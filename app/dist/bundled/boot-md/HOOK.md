---
name: boot-md
description: "Run BOOT.md on gateway startup"
homepage: (документация продукта)/automation/hooks#boot-md
metadata:
  {
    "testclaw":
      {
        "emoji": "🚀",
        "events": ["gateway:startup"],
        "requires": { "config": ["workspace.dir"] },
        "install": [{ "id": "bundled", "kind": "bundled", "label": "Bundled with Testclaw" }],
      },
  }
---

# Boot Checklist Hook

Runs `BOOT.md` at Gateway startup once per distinct configured agent workspace,
if the file exists there. Agents sharing a workspace do not run the same checklist
again. Enable with `testclaw hooks enable boot-md`, then restart the Gateway.
