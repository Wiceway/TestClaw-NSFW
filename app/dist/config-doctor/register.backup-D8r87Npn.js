import { r as theme } from "./theme-DLJw9KCD.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { n as runCommandWithRuntime } from "./cli-utils-BOBTfPOr.js";
import { n as parseStrictPositiveIntOption } from "./helpers-BGwqfJ8f.js";
import { t as formatHelpExamples } from "./help-format-CSGmoada.js";
import { t as addGatewayClientOptions } from "./gateway-rpc-D4qc8nHD.js";
//#region src/cli/program/register.backup.ts
/** Register backup create/verify subcommands. */
function registerBackupCommand(program) {
	const backup = program.command("backup").description("Create, verify, and restore backup archives and SQLite snapshots").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/backup", "docs.testclaw.ai/cli/backup")}\n`);
	backup.command("create").description("Write a backup archive for config, credentials, sessions, and workspaces").option("--output <path>", "Archive path or destination directory").option("--json", "Output JSON", false).option("--dry-run", "Print the backup plan without writing the archive", false).option("--verify", "Verify the archive after writing it", false).option("--only-config", "Back up only the active JSON config file", false).option("--no-include-workspace", "Exclude workspace directories from the backup").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["testclaw backup create", "Create a timestamped backup in the current directory."],
		["testclaw backup create --output ~/Backups", "Write the archive into an existing backup directory."],
		["testclaw backup create --dry-run --json", "Preview the archive plan without writing any files."],
		["testclaw backup create --verify", "Create the archive and immediately validate its manifest and payload layout."],
		["testclaw backup create --no-include-workspace", "Back up state/config without agent workspace files."],
		["testclaw backup create --only-config", "Back up only the active JSON config file."]
	])}`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupCreateCommand } = await import("./backup-CKYUZc5f.js");
			await backupCreateCommand(defaultRuntime, {
				output: opts.output,
				json: Boolean(opts.json),
				dryRun: Boolean(opts.dryRun),
				verify: Boolean(opts.verify),
				onlyConfig: Boolean(opts.onlyConfig),
				includeWorkspace: opts.includeWorkspace
			});
		});
	});
	backup.command("verify <archive>").description("Validate a backup archive and its embedded manifest").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["testclaw backup verify ./2026-03-09T08-00-00.000+08-00-testclaw-backup.tar.gz", "Check that the archive structure and manifest are intact."], ["testclaw backup verify ~/Backups/latest.tar.gz --json", "Emit machine-readable verification output."]])}`).action(async (archive, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupVerifyCommand } = await import("./backup-verify-B4IwRM4o.js");
			await backupVerifyCommand(defaultRuntime, {
				archive,
				json: Boolean(opts.json)
			});
		});
	});
	backup.command("restore <archive>").description("Restore a verified backup archive to a fresh staging directory").requiredOption("--target <dir>", "Fresh target directory; non-empty directories are refused").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["testclaw backup restore ~/Backups/latest.tar.gz --target ./restored-testclaw", "Verify, then extract the whole archive into a fresh staging directory."], ["testclaw backup restore ~/Backups/latest.tar.gz --target ./restored-testclaw --json", "Emit machine-readable restore details and rollback warnings."]])}`).action(async (archive, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupRestoreCommand } = await import("./backup-restore-DJPIf3No.js");
			await backupRestoreCommand(defaultRuntime, {
				archive,
				target: opts.target,
				json: Boolean(opts.json)
			});
		});
	});
	registerBackupSqliteCommands(backup);
	registerBackupGitCommands(backup);
	registerBackupScheduleCommands(backup);
}
function collectAgent(value, previous) {
	return [...previous, value];
}
function registerBackupScheduleCommands(backup) {
	addGatewayClientOptions(backup.command("enable").description("Provision a Gateway automation for scheduled Git backups").requiredOption("--repository <path>", "Git backup repository directory").option("--every <duration>", "Backup interval", "24h").option("--push", "Push the current branch to origin after each backup", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--include-secrets", "Keep credential-bearing tables in pushed scheduled backups", false).option("--global-only", "Back up only the shared state database", false).option("--agent <id>", "Back up only one agent database").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupEnableCommand } = await import("./backup-schedule-Colv7XB8.js");
			await backupEnableCommand(defaultRuntime, opts);
		});
	}));
	addGatewayClientOptions(backup.command("disable").description("Remove the scheduled Git backup automation").action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupDisableCommand } = await import("./backup-schedule-Colv7XB8.js");
			await backupDisableCommand(defaultRuntime, opts);
		});
	}));
}
function registerBackupGitCommands(backup) {
	const git = backup.command("git").description("Create and restore deterministic versioned SQLite dumps in Git").action(() => {
		git.outputHelp();
		process.exitCode = 1;
	});
	git.command("init").description("Initialize or adopt an operator-owned Git backup repository").requiredOption("--repository <path>", "Git backup repository directory").option("--remote <url>", "Add the remote as origin").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitInitCommand } = await import("./backup-git-B6qgmugW.js");
			await backupGitInitCommand(defaultRuntime, opts);
		});
	});
	git.command("create").description("Dump selected Assistant databases and commit one Git revision").requiredOption("--repository <path>", "Git backup repository directory").option("--all", "Back up the shared database and every registered agent database", false).option("--global", "Back up the shared Assistant state database", false).option("--agent <id>", "Back up an agent database (repeatable)", collectAgent, []).option("--push", "Push the current branch to origin", false).option("--exclude-secrets", "Omit credential-bearing database tables", false).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitCreateCommand } = await import("./backup-git-B6qgmugW.js");
			await backupGitCreateCommand(defaultRuntime, {
				repository: opts.repository,
				all: Boolean(opts.all),
				global: Boolean(opts.global),
				agents: opts.agent,
				push: Boolean(opts.push),
				excludeSecrets: Boolean(opts.excludeSecrets),
				json: Boolean(opts.json)
			});
		});
	});
	git.command("log").description("Show Git backup commits").requiredOption("--repository <path>", "Git backup repository directory").option("--limit <n>", "Maximum commits to show", (value) => parseStrictPositiveIntOption(value, "--limit"), 20).option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitLogCommand } = await import("./backup-git-B6qgmugW.js");
			await backupGitLogCommand(defaultRuntime, opts);
		});
	});
	git.command("verify").description("Restore and verify one database snapshot from a Git ref").requiredOption("--repository <path>", "Git backup repository directory").option("--ref <commit>", "Commit or ref to verify", "HEAD").option("--global", "Verify the shared state database", false).option("--agent <id>", "Verify one agent database").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitVerifyCommand } = await import("./backup-git-B6qgmugW.js");
			await backupGitVerifyCommand(defaultRuntime, opts);
		});
	});
	git.command("restore").description("Restore one database snapshot from a Git ref to a fresh SQLite file").requiredOption("--repository <path>", "Git backup repository directory").requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused").option("--ref <commit>", "Commit or ref to restore", "HEAD").option("--global", "Restore the shared state database", false).option("--agent <id>", "Restore one agent database").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupGitRestoreCommand } = await import("./backup-git-B6qgmugW.js");
			await backupGitRestoreCommand(defaultRuntime, opts);
		});
	});
}
function registerBackupSqliteCommands(backup) {
	const sqlite = backup.command("sqlite").description("Create, list, verify, and restore SQLite snapshots").action(() => {
		sqlite.outputHelp();
		process.exitCode = 1;
	});
	sqlite.command("create").description("Create a compact, verified snapshot of an Assistant SQLite database").option("--global", "Snapshot the shared Assistant state database", false).option("--agent <id>", "Snapshot one per-agent Assistant database").requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([["testclaw backup sqlite create --global --repository ~/Backups/testclaw-sqlite", "Snapshot the shared state database."], ["testclaw backup sqlite create --agent main --repository ~/Backups/testclaw-sqlite", "Snapshot the main agent database."]])}`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteCreateCommand } = await import("./backup-sqlite-ioKRDd3g.js");
			await backupSqliteCreateCommand(defaultRuntime, {
				global: Boolean(opts.global),
				agent: opts.agent,
				repository: opts.repository,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("list").description("List committed snapshots in a repository").requiredOption("--repository <path>", "Snapshot repository directory").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteListCommand } = await import("./backup-sqlite-ioKRDd3g.js");
			await backupSqliteListCommand(defaultRuntime, {
				repository: opts.repository,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("verify <snapshot>").description("Verify a snapshot manifest, artifact hash, SQLite integrity, and database owner").option("--scratch <path>", "Existing private directory for verification copies").option("--json", "Output JSON", false).action(async (snapshot, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteVerifyCommand } = await import("./backup-sqlite-ioKRDd3g.js");
			await backupSqliteVerifyCommand(defaultRuntime, snapshot, {
				scratch: opts.scratch,
				json: Boolean(opts.json)
			});
		});
	});
	sqlite.command("restore <snapshot>").description("Restore a verified snapshot to a new SQLite database path").requiredOption("--target <path>", "Fresh target path; existing files and sidecars are refused").option("--json", "Output JSON", false).action(async (snapshot, opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const { backupSqliteRestoreCommand } = await import("./backup-sqlite-ioKRDd3g.js");
			await backupSqliteRestoreCommand(defaultRuntime, snapshot, {
				target: opts.target,
				json: Boolean(opts.json)
			});
		});
	});
}
//#endregion
export { registerBackupCommand };
