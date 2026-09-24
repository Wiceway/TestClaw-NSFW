---
name: command-logger
description: "Log emitted command events to a centralized audit file"
homepage: (документация продукта)/automation/hooks#command-logger
metadata:
  {
    "testclaw":
      {
        "emoji": "📝",
        "events": ["command"],
        "install": [{ "id": "bundled", "kind": "bundled", "label": "Bundled with Testclaw" }],
      },
  }
---

# Command Logger Hook

Logs emitted command events to a centralized audit log file for debugging and monitoring purposes. Current core actions are `/new`, `/reset`, and `/stop`; plugins may emit additional actions.

## What It Does

Every time Testclaw emits a command event:

1. **Captures event details** - Command action, timestamp, session key, sender ID, source
2. **Appends to log file** - Writes a JSON line to `~/.testclaw/logs/commands.log`
3. **Silent operation** - Runs in the background without user notifications

## Output Format

Log entries are written in JSONL (JSON Lines) format:

```json
{"timestamp":"2026-01-16T14:30:00.000Z","action":"new","sessionKey":"agent:main:main","senderId":"+1234567890","source":"telegram"}
{"timestamp":"2026-01-16T15:45:22.000Z","action":"stop","sessionKey":"agent:main:main","senderId":"user@example.com","source":"whatsapp"}
```

## Use Cases

- **Debugging**: Track when commands were issued and from which source
- **Auditing**: Monitor command usage across different channels
- **Analytics**: Analyze command patterns and frequency
- **Troubleshooting**: Investigate issues by reviewing command history

## Log File Location

`~/.testclaw/logs/commands.log`

## Requirements

No requirements - this hook works out of the box on all platforms.

## Configuration

No configuration needed. The hook automatically:

- Creates the log directory if it doesn't exist
- Appends to the log file (doesn't overwrite)
- Handles errors silently without disrupting command execution

## Disabling

To disable this hook:

```bash
testclaw hooks disable command-logger
```

Or via config:

```json
{
  "hooks": {
    "internal": {
      "entries": {
        "command-logger": { "enabled": false }
      }
    }
  }
}
```

## Log Rotation

The hook does not automatically rotate logs. To manage log size, you can:

1. **Manual rotation**:

   ```bash
   mv ~/.testclaw/logs/commands.log ~/.testclaw/logs/commands.log.old
   ```

2. **Use logrotate** (Linux):
   Create `/etc/logrotate.d/testclaw`:
   ```
   /home/username/.testclaw/logs/commands.log {
       weekly
       rotate 4
       compress
       missingok
       notifempty
   }
   ```

## Viewing Logs

View recent commands:

```bash
tail -n 20 ~/.testclaw/logs/commands.log
```

Pretty-print with jq:

```bash
cat ~/.testclaw/logs/commands.log | jq .
```

Filter by action:

```bash
grep '"action":"new"' ~/.testclaw/logs/commands.log | jq .
```
