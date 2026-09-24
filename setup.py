#!/usr/bin/env python3
"""
Testclaw installer — cross-platform (Linux / macOS / Windows).

Only requirement: Python 3.8+.

The runtime (including node_modules) ships inside this repository.
The Node.js engine is downloaded once, for your platform, during install.

Usage:
    python3 setup.py                  # interactive
    python3 setup.py --home /opt/tc   # custom install root
    python3 setup.py --key sk-...     # non-interactive (or DEEPSEEK_API_KEY)
"""

from __future__ import annotations

import argparse
import getpass
import os
import platform
import shutil
import stat
import subprocess
import sys
import tarfile
import tempfile
import urllib.request
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
APP_SRC = HERE / "app"
NODE_VERSION = "v24.21.0"
NODE_BASE = f"https://nodejs.org/dist/{NODE_VERSION}"

BANNER = r"""
  ______          __  ______ __
 /_  __/__  _____/ /_/ ____// /___ _      __
  / / / _ \/ ___/ __/ /    / //_/ | /| / /
 / / /  __(__  ) /_/ /___ / ,<  | |/ |/ /
/_/  \___/____/\__/\____//_/|_| |__/|__/
"""


def say(msg: str) -> None:
    print(f"\033[1;36m==>\033[0m {msg}" if os.name != "nt" else f"==> {msg}")


def warn(msg: str) -> None:
    print(f"\033[1;33m[!]\033[0m {msg}" if os.name != "nt" else f"[!] {msg}")


def die(msg: str) -> None:
    print(f"\033[1;31m[x]\033[0m {msg}" if os.name != "nt" else f"[x] {msg}", file=sys.stderr)
    raise SystemExit(1)


def node_target() -> tuple[str, str]:
    """Return (asset_name, inner_path) for the current platform."""
    system = platform.system().lower()
    machine = platform.machine().lower()
    arch = "arm64" if machine in ("arm64", "aarch64") else "x64"

    if system == "windows":
        return f"node-{NODE_VERSION}-win-{arch}.zip", "node.exe"
    if system == "darwin":
        return f"node-{NODE_VERSION}-darwin-{arch}.tar.gz", "bin/node"
    if system == "linux":
        return f"node-{NODE_VERSION}-linux-{arch}.tar.xz", "bin/node"
    die(f"unsupported platform: {system}/{machine}")


def download(url: str, dest: Path) -> None:
    say(f"Downloading {url}")
    with urllib.request.urlopen(url, timeout=120) as resp, open(dest, "wb") as out:  # noqa: S310
        shutil.copyfileobj(resp, out)


def extract_node(archive: Path, inner: str, dest: Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        if archive.suffix == ".zip":
            with zipfile.ZipFile(archive) as z:
                z.extractall(tmpdir)
        elif archive.name.endswith(".tar.xz"):
            with tarfile.open(archive, "r:xz") as t:
                t.extractall(tmpdir)
        else:
            with tarfile.open(archive, "r:gz") as t:
                t.extractall(tmpdir)

        # find the *inner* path under the single extracted top dir
        root_dirs = [p for p in tmpdir.iterdir() if p.is_dir()]
        if not root_dirs:
            die("downloaded Node archive was empty")
        candidate = root_dirs[0] / inner
        if not candidate.exists():
            die(f"expected {inner} inside the Node archive, not found")
        shutil.copy2(candidate, dest)


def install_node(home: Path) -> Path:
    """Ensure a usable Node binary exists; download if needed."""
    bundled = sorted((HERE / "node").glob("node-*"))
    want_asset, inner = node_target()
    plat_key = want_asset.split(f"{NODE_VERSION}-")[1].rsplit(".", 1)[0]  # e.g. linux-x64

    for p in bundled:
        if plat_key in p.name:
            say(f"Using bundled Node: {p.name}")
            dst = home / "bin" / ("node.exe" if os.name == "nt" else "node-bin")
            shutil.copy2(p, dst)
            return dst

    # no bundle — download
    url = f"{NODE_BASE}/{want_asset}"
    say(f"No bundled Node for {plat_key}; downloading Node {NODE_VERSION}")
    with tempfile.TemporaryDirectory() as tmp:
        archive = Path(tmp) / want_asset
        download(url, archive)
        dst = home / "bin" / ("node.exe" if os.name == "nt" else "node-bin")
        extract_node(archive, inner, dst)
    return dst


def ask_key(cli_key: str | None) -> str:
    key = cli_key or os.environ.get("DEEPSEEK_API_KEY", "")
    if key:
        say("Using DeepSeek key from argument/environment.")
        return key.strip()
    print()
    say("DeepSeek API key required.")
    print("    Get one at https://platform.deepseek.com/api_keys\n")
    key = getpass.getpass("Paste your DeepSeek API key (hidden): ").strip()
    if not key:
        die("no API key provided — aborting")
    return key


def render(template: Path, home: Path, key: str) -> str:
    text = template.read_text(encoding="utf-8")
    return text.replace("__TESTCLAW_HOME__", str(home)).replace("__DEEPSEEK_API_KEY__", key)


def main() -> None:
    ap = argparse.ArgumentParser(description="Install Testclaw (bundled runtime).")
    ap.add_argument("--home", default=None, help="Install root (default: ~/TestClawHome)")
    ap.add_argument("--key", default=None, help="DeepSeek API key (skips the prompt)")
    ap.add_argument("--no-service", action="store_true", help="Do not register a system service")
    ap.add_argument("--portable", action="store_true",
                    help="Install everything into ./runtime next to this repo "
                         "(one folder, delete it to remove)")
    args = ap.parse_args()

    os_name = "windows" if os.name == "nt" else platform.system().lower()
    if args.portable and args.home:
        die("--portable and --home are mutually exclusive")
    if args.portable:
        home = HERE / "runtime"
    elif args.home:
        home = Path(args.home).expanduser().resolve()
    else:
        home = Path.home() / "TestClawHome"

    print(BANNER)
    say(f"Platform: {os_name} {platform.machine()}")
    say(f"Install root: {home}")

    if not APP_SRC.is_dir():
        die(f"app/ not found next to setup.py ({APP_SRC})")

    key = ask_key(args.key)

    # --- layout ------------------------------------------------------------
    for sub in ("config", "workspace", "logs", "data", "state"):
        (home / sub).mkdir(parents=True, exist_ok=True)

    say("Copying runtime (this can take a minute)…")
    if (home / "bin").exists():
        warn(f"{home / 'bin'} already exists — replacing")
        shutil.rmtree(home / "bin")
    shutil.copytree(APP_SRC, home / "bin", symlinks=True)

    node_dst = install_node(home)
    if os_name != "windows":
        node_dst.chmod(node_dst.stat().st_mode | stat.S_IEXEC | stat.S_IXGRP | stat.S_IXOTH)

    # --- config ------------------------------------------------------------
    say("Writing .env and config/testclaw.json")
    (home / ".env").write_text(render(HERE / "templates" / "env.template", home, key), encoding="utf-8")
    try:
        os.chmod(home / ".env", 0o600)
    except OSError:
        pass
    (home / "config" / "testclaw.json").write_text(
        render(HERE / "templates" / "testclaw.json.template", home, key), encoding="utf-8"
    )

    for name in ("AGENTS.md", "SOUL.md", "IDENTITY.md", "USER.md", "BOOTSTRAP.md", "MEMORY.md"):
        f = home / "workspace" / name
        if not f.exists():
            f.write_text("", encoding="utf-8")

    # --- launchers ---------------------------------------------------------
    if os_name == "windows":
        (home / "run.cmd").write_text(
            "@echo off\r\n"
            f'set "TESTCLAW_HOME={home}"\r\n'
            f'for /f "usebackq tokens=1,* delims==" %%a in ("{home}\\.env") do set "%%a=%%b"\r\n'
            f'"{home}\\bin\\node.exe" "{home}\\bin\\testclaw.mjs" %*\r\n',
            encoding="utf-8",
        )
        run_hint = f'"{home}\\run.cmd" gateway run'
    else:
        run_sh = home / "run.sh"
        run_sh.write_text(
            "#!/usr/bin/env bash\n"
            "set -euo pipefail\n"
            f'export TESTCLAW_HOME="{home}"\n'
            f'set -a; . "{home}/.env"; set +a\n'
            f'exec "{home}/bin/node-bin" "{home}/bin/testclaw.mjs" "$@"\n',
            encoding="utf-8",
        )
        run_sh.chmod(0o755)
        run_hint = f"{run_sh} gateway run"

    # --- verify ------------------------------------------------------------
    say("Verifying the runtime…")
    try:
        r = subprocess.run([str(node_dst), str(home / "bin" / "testclaw.mjs"), "--version"],
                           capture_output=True, text=True, timeout=180)
        if r.returncode == 0:
            say(f"Runtime OK: {r.stdout.strip()}")
        else:
            warn(f"--version returned {r.returncode}: {(r.stderr or r.stdout).strip()[:200]}")
    except Exception as e:  # noqa: BLE001
        warn(f"could not verify --version: {e}")

    # --- service (Linux, root only) ---------------------------------------
    if not args.no_service and os_name == "linux" and os.geteuid() == 0 and shutil.which("systemctl"):
        say("Installing systemd service testclaw-gateway.service")
        unit = f"""[Unit]
Description=Testclaw Gateway
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory={home}/bin
EnvironmentFile={home}/.env
ExecStart={home}/bin/node-bin {home}/bin/testclaw.mjs gateway run
Restart=always
RestartSec=5
StandardOutput=append:{home}/logs/gateway-svc.log
StandardError=append:{home}/logs/gateway-svc.log

[Install]
WantedBy=multi-user.target
"""
        Path("/etc/systemd/system/testclaw-gateway.service").write_text(unit, encoding="utf-8")
        subprocess.run(["systemctl", "daemon-reload"], check=False)
        subprocess.run(["systemctl", "enable", "--now", "testclaw-gateway.service"], check=False)
    else:
        warn("No service registered. Start manually with:")
        print(f"    {run_hint}")

    print()
    say("Done.")
    say("Dashboard: http://127.0.0.1:18789/")
    say(f"Install root: {home}")


if __name__ == "__main__":
    main()
