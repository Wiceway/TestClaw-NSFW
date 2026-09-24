#!/usr/bin/env bash
# Testclaw installer for Linux / macOS — requires python3.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
exec python3 ./setup.py "$@"
