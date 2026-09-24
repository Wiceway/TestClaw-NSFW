# Testclaw — self-contained AI agent

Autonomous AI assistant gateway with shell, files, web, and browser tools.

The runtime (including every `node_modules` dependency) ships inside this
repository. You do **not** need `npm` or `pnpm`. The installer downloads the
Node.js engine once, for your platform. The only requirement is **Python 3.8+**.

Works on **Linux**, **macOS**, and **Windows**.

## Requirements

- Python 3.8+ (https://www.python.org/downloads/)
- A **DeepSeek API key** — https://platform.deepseek.com/api_keys

## Install

### Linux / macOS

```bash
git clone <this-repo> testclaw
cd testclaw
./install.sh
```

(or `python3 setup.py` directly)

### Windows

```bat
git clone <this-repo> testclaw
cd testclaw
install.bat
```

(or `python setup.py` directly)

Both entry points run the same installer. It will:

1. detect your platform and architecture (Linux/macOS/Windows, x64/arm64)
2. **ask you to paste your DeepSeek API key** — hidden input, never echoed
3. copy the runtime to `~/TestClawHome` (override with `--home`)
4. download Node.js 24.21.0 for your platform from nodejs.org
5. write `.env` and `config/testclaw.json` with your key
6. on Linux as root, register and start a `systemd` service

When it finishes, the dashboard is at:

```
http://127.0.0.1:18789/
```

### Non-interactive / custom root

```bash
python3 setup.py --home /opt/testclaw --key "$DEEPSEEK_API_KEY"
```

## Repository layout

```
app/                  bundled runtime (dist + node_modules + launcher .mjs)
templates/            config templates (key placeholder only)
setup.py              cross-platform installer
install.sh            Linux/macOS wrapper
install.bat           Windows wrapper
```

After install:

```
$TESTCLAW_HOME/
├── bin/              runtime + the platform's Node (node-bin / node.exe)
├── config/           testclaw.json   (contains your key — keep private)
├── workspace/        agent workspace (AGENTS.md, SOUL.md, …)
├── state/            sessions, databases
├── logs/             gateway + service logs
├── run.sh / run.cmd  launcher
└── .env              environment (contains your key — chmod 600)
```

## Managing the service

Linux (installed as root):

```bash
systemctl status  testclaw-gateway
systemctl restart testclaw-gateway
journalctl -u testclaw-gateway -f
```

Anywhere, foreground:

```bash
# Linux/macOS
~/TestClawHome/run.sh gateway run
# Windows
%USERPROFILE%\TestClawHome\run.cmd gateway run
```

## Security notes

- The dashboard binds to `127.0.0.1` by default. Put it behind a reverse proxy
  (nginx/Caddy) with TLS before exposing it to the internet.
- `DEEPSEEK_API_KEY` is stored in `$TESTCLAW_HOME/.env` (mode 600) and in
  `config/testclaw.json`. Never commit either file.
- The template sets `exec.security: "full"` — unrestricted shell for the agent.
  Tighten it in `config/testclaw.json` if that is not what you want.

## License

MIT
