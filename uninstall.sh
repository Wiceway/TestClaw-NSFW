#!/usr/bin/env bash
# Testclaw uninstaller for Linux / macOS — requires python3.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
exec python3 ./uninstall.py "$@"
