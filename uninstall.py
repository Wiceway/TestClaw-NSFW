#!/usr/bin/env python3
"""
Testclaw uninstaller — cross-platform (Linux / macOS / Windows).

Removes what the installer created:
  * the install root (default: ~/TestClawHome, or ./runtime in --portable mode)
  * the systemd service on Linux — ONLY if its unit points at that install root

It never touches the git clone itself unless you pass --clone.

Usage:
    python3 uninstall.py                     # ~/TestClawHome (or ./runtime if present)
    python3 uninstall.py --home /opt/testclaw
    python3 uninstall.py --clone             # also delete the repo folder
"""

from __future__ import annotations

import argparse
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path

SERVICE_NAME = "testclaw-gateway.service"
SERVICE_PATH = Path("/etc/systemd/system") / SERVICE_NAME


def say(m: str) -> None:
    print(f"\033[1;36m==>\033[0m {m}" if os.name != "nt" else f"==> {m}")


def warn(m: str) -> None:
    print(f"\033[1;33m[!]\033[0m {m}" if os.name != "nt" else f"[!] {m}")


def die(m: str) -> None:
    print(f"\033[1;31m[x]\033[0m {m}" if os.name != "nt" else f"[x] {m}", file=sys.stderr)
    raise SystemExit(1)


def resolve_home(explicit: str | None) -> Path:
    repo = Path(__file__).resolve().parent
    if explicit:
        return Path(explicit).expanduser().resolve()
    portable = repo / "runtime"
    if portable.exists():
        return portable
    return Path.home() / "TestClawHome"


def unit_belongs_to(home: Path) -> bool:
    """True only if the installed systemd unit actually points at `home`."""
    if not SERVICE_PATH.exists():
        return False
    try:
        text = SERVICE_PATH.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return False
    return str(home) in text


def remove_linux_service(home: Path) -> None:
    if platform.system().lower() != "linux" or os.geteuid() != 0 or not shutil.which("systemctl"):
        return
    if not SERVICE_PATH.exists():
        return
    if not unit_belongs_to(home):
        warn(f"{SERVICE_NAME} exists but does not point at {home} — leaving it alone")
        return
    say(f"stopping and removing {SERVICE_NAME} (belongs to {home})")
    subprocess.run(["systemctl", "stop", SERVICE_NAME], check=False)
    subprocess.run(["systemctl", "disable", SERVICE_NAME], check=False)
    try:
        SERVICE_PATH.unlink()
        subprocess.run(["systemctl", "daemon-reload"], check=False)
    except OSError as e:
        warn(f"could not remove {SERVICE_PATH}: {e}")


def stop_windows_processes(home: Path) -> None:
    needle = str(home).replace("'", "''")
    ps = (
        "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | "
        f"Where-Object {{ $_.CommandLine -like '*{needle}*' }} | "
        "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
    )
    try:
        subprocess.run(["powershell", "-NoProfile", "-Command", ps], check=False)
        say("stopped matching node.exe processes (if any)")
    except Exception as e:  # noqa: BLE001
        warn(f"could not stop node processes automatically: {e}")


def stop_posix_processes(home: Path) -> None:
    """Kill processes whose command line references this home directory only."""
    try:
        out = subprocess.run(["ps", "-eo", "pid=,args="], capture_output=True, text=True, check=False).stdout
    except Exception:  # noqa: BLE001
        return
    me = os.getpid()
    for line in out.splitlines():
        line = line.strip()
        if not line or str(home) not in line or "testclaw" not in line:
            continue
        pid_s = line.split(None, 1)[0]
        if not pid_s.isdigit() or int(pid_s) == me:
            continue
        subprocess.run(["kill", pid_s], check=False)


def main() -> None:
    ap = argparse.ArgumentParser(description="Uninstall Testclaw.")
    ap.add_argument("--home", default=None, help="Install root (default: ~/TestClawHome or ./runtime)")
    ap.add_argument("--clone", action="store_true", help="Also delete this repository folder")
    ap.add_argument("--yes", action="store_true", help="Do not ask for confirmation")
    args = ap.parse_args()

    repo = Path(__file__).resolve().parent
    home = resolve_home(args.home)

    print()
    say(f"Install root to remove: {home}")
    if args.clone:
        say(f"Repository folder to remove: {repo}")
    if not args.yes:
        ans = input("Type 'yes' to confirm removal: ").strip().lower()
        if ans != "yes":
            die("aborted by user")

    if os.name == "nt":
        stop_windows_processes(home)
    else:
        stop_posix_processes(home)
        remove_linux_service(home)

    if home.exists():
        shutil.rmtree(home, ignore_errors=True)
        say(f"removed {home}")
    else:
        warn(f"{home} does not exist — nothing to remove")

    if args.clone:
        parent = repo.parent
        tmp = parent / f".{repo.name}-uninstall"
        try:
            if tmp.exists():
                shutil.rmtree(tmp, ignore_errors=True)
            shutil.move(str(repo), str(tmp))
            shutil.rmtree(tmp, ignore_errors=True)
            say(f"removed {repo}")
        except Exception as e:  # noqa: BLE001
            warn(f"could not remove the clone folder ({e}); delete it manually: {repo}")
    else:
        warn("repository folder kept (pass --clone to remove it too)")

    print()
    say("Done.")


if __name__ == "__main__":
    main()
