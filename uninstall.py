#!/usr/bin/env python3
"""
Testclaw uninstaller — cross-platform (Linux / macOS / Windows).

Removes everything the installer created:
  * the install root (default: ~/TestClawHome)
  * the systemd service on Linux (if it was installed)

It never touches the git clone itself unless you pass --clone.

Usage:
    python3 uninstall.py
    python3 uninstall.py --home /opt/testclaw
    python3 uninstall.py --clone              # also delete the repo folder
"""

from __future__ import annotations

import argparse
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path


def say(m: str) -> None:
    print(f"\033[1;36m==>\033[0m {m}" if os.name != "nt" else f"==> {m}")


def warn(m: str) -> None:
    print(f"\033[1;33m[!]\033[0m {m}" if os.name != "nt" else f"[!] {m}")


def die(m: str) -> None:
    print(f"\033[1;31m[x]\033[0m {m}" if os.name != "nt" else f"[x] {m}", file=sys.stderr)
    raise SystemExit(1)


def stop_windows_processes(home: Path) -> None:
    """Kill only node processes whose command line references this install."""
    try:
        ps = (
            "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | "
            "Where-Object { $_.CommandLine -like '*TestClawHome*' -or $_.CommandLine -like '*"
            + str(home).replace("'", "''") + "*' } | "
            "ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
        )
        subprocess.run(["powershell", "-NoProfile", "-Command", ps], check=False)
        say("stopped matching node.exe processes (if any)")
    except Exception as e:  # noqa: BLE001
        warn(f"could not stop node processes automatically: {e}")


def stop_linux_service() -> None:
    if platform.system().lower() != "linux":
        return
    if os.geteuid() != 0 or not shutil.which("systemctl"):
        return
    say("stopping and disabling testclaw-gateway.service")
    subprocess.run(["systemctl", "stop", "testclaw-gateway.service"], check=False)
    subprocess.run(["systemctl", "disable", "testclaw-gateway.service"], check=False)
    unit = Path("/etc/systemd/system/testclaw-gateway.service")
    if unit.exists():
        unit.unlink()
        subprocess.run(["systemctl", "daemon-reload"], check=False)


def main() -> None:
    ap = argparse.ArgumentParser(description="Uninstall Testclaw.")
    ap.add_argument("--home", default=None, help="Install root (default: ~/TestClawHome)")
    ap.add_argument("--clone", action="store_true", help="Also delete this repository folder")
    ap.add_argument("--yes", action="store_true", help="Do not ask for confirmation")
    args = ap.parse_args()

    home = Path(args.home).expanduser().resolve() if args.home else (Path.home() / "TestClawHome")
    repo = Path(__file__).resolve().parent

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
        stop_linux_service()

    if home.exists():
        shutil.rmtree(home, ignore_errors=True)
        say(f"removed {home}")
    else:
        warn(f"{home} does not exist — nothing to remove")

    if args.clone:
        # deleting the folder we are running from: re-exec from a temp dir
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
