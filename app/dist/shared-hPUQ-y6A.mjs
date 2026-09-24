import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { n as resolveAssistantPackageRoot } from "./testclaw-root-CayS889k.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { i as resolveRequiredHomeDir } from "./home-dir-BPqVt7Ps.mjs";
import { l as pathExists } from "./utils-Dy46mFy2.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import "./errors-DNLGIg8_.mjs";
import { o as UPDATE_INSTALL_SKIP_GUIDANCE } from "./update-outcome-Dj5_EBo1.mjs";
import { l as createUpdatePreflightFailure, r as normalizeUpdateFailureFacts } from "./update-failure-facts-CQQBnbzM.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { i as runCommandWithTimeout } from "./exec-BddaUUYf.mjs";
import { r as resolveBrewAssistantPath } from "./brew-DRC2Y5Er.mjs";
import { n as readPackageName } from "./package-json-CKAceI3K.mjs";
import { s as parseSemver } from "./runtime-guard-Tm7Cs1SV.mjs";
import { A as createFreeBsdPkgOwnershipInspection, d as detectGlobalInstallManagerForRoot, i as runStep, l as createGlobalInstallEnv, o as canResolveRegistryVersionForPackageTarget, u as detectGlobalInstallManagerByPresence } from "./update-runner-command-Dn-V6rM4.mjs";
import { r as resolveUnmanagedUpdateInstallReason, t as describeUpdateInstallRoot } from "./update-runner-install-surface-DkLXK-KU.mjs";
import { t as resolveNodeRunner } from "./node-runner-Cua6MUxg.mjs";
import { r as fetchNpmTagVersion } from "./update-check-iRYMjMOk.mjs";
import { n as COMPLETION_SKIP_PLUGIN_COMMANDS_ENV } from "./completion-runtime-Bq08T9nT.mjs";
import { r as isJsonOutputModeActive } from "./json-output-mode-M78iFCSh.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/package-tag.ts
/** Normalizes a package tag input, stripping known package-name prefixes when present. */
function normalizePackageTagInput(value, packageNames) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return null;
	for (const packageName of packageNames) {
		if (trimmed === packageName) return null;
		const prefix = `${packageName}@`;
		if (trimmed.startsWith(prefix)) {
			const tag = trimmed.slice(prefix.length).trim();
			return tag ? tag : null;
		}
	}
	return trimmed;
}
//#endregion
//#region src/cli/update-cli/shared.ts
var UpdatePreMutationError = class extends Error {
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.name = "UpdatePreMutationError";
		this.recoverySteps = options?.recoverySteps;
		this.failureFacts = normalizeUpdateFailureFacts(options?.failureFacts ?? [{
			check: reason,
			code: reason,
			message
		}]);
	}
};
const INVALID_TIMEOUT_ERROR = "--timeout must be a positive integer (seconds)";
const MAX_SAFE_TIMEOUT_SECONDS = Math.floor(Number.MAX_SAFE_INTEGER / 1e3);
/** Parse the shared timeout contract without exiting an owning operation. */
function parseUpdateTimeoutMs(timeout) {
	if (timeout === void 0) return;
	const trimmed = timeout.trim();
	const seconds = parseStrictPositiveInteger(trimmed);
	if (seconds === void 0 || seconds > MAX_SAFE_TIMEOUT_SECONDS) throw new Error(INVALID_TIMEOUT_ERROR);
	return seconds * 1e3;
}
/** Parse a CLI timeout in seconds, exiting through the runtime on invalid input. */
function parseTimeoutMsOrExit(timeout) {
	try {
		return parseUpdateTimeoutMs(timeout);
	} catch (error) {
		if (isJsonOutputModeActive(process.argv)) throw error;
		defaultRuntime.error(INVALID_TIMEOUT_ERROR);
		defaultRuntime.exit(1);
		return null;
	}
}
const UPSTREAM_REPOSITORY_URL = "https://github.com/testclaw/testclaw.git";
const GIT_CLONE_BLOB_FILTER = "--filter=blob:none";
const DEFAULT_PACKAGE_NAME = "testclaw";
const CORE_PACKAGE_NAMES = /* @__PURE__ */ new Set([DEFAULT_PACKAGE_NAME]);
/** Normalize a CLI tag/version/spec into the npm target form accepted by update flows. */
function normalizeTag(value) {
	return normalizePackageTagInput(value, ["testclaw", DEFAULT_PACKAGE_NAME]);
}
function normalizeVersionTag(tag) {
	const trimmed = tag.trim();
	if (!trimmed) return null;
	const cleaned = trimmed.startsWith("v") ? trimmed.slice(1) : trimmed;
	return parseSemver(cleaned) ? cleaned : null;
}
/** Resolve an npm dist-tag or explicit version into a concrete package version. */
async function resolveTargetVersion(tag, timeoutMs, options = {}) {
	if (!canResolveRegistryVersionForPackageTarget(tag)) return null;
	const direct = normalizeVersionTag(tag);
	if (direct) return direct;
	return (await fetchNpmTagVersion({
		tag,
		timeoutMs,
		spec: options.spec,
		command: options.command,
		cwd: options.cwd,
		env: options.env
	})).version ?? null;
}
/** Return true when `root` is a local git checkout directory. */
async function isGitCheckout(root) {
	try {
		await fs.stat(path.join(root, ".git"));
		return true;
	} catch {
		return false;
	}
}
async function isCorePackage(root) {
	const name = await readPackageName(root);
	return Boolean(name && CORE_PACKAGE_NAMES.has(name));
}
/** Return true only for existing directories with no entries. */
async function isEmptyDir(targetPath) {
	try {
		return (await fs.readdir(targetPath)).length === 0;
	} catch {
		return false;
	}
}
/** Resolve the checkout path used by source-based self-update. */
function resolveGitInstallDir() {
	const override = process.env.TESTCLAW_GIT_DIR?.trim();
	if (override) return path.resolve(override);
	return resolveDefaultGitDir();
}
function resolveDefaultGitDir() {
	const home = resolveRequiredHomeDir(process.env, os.homedir);
	if (home.startsWith("/")) return path.posix.join(home, "testclaw");
	return path.join(home, "testclaw");
}
function tryResolveInvocationCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
/** Locate the installed Assistant package root that should receive update operations. */
async function resolveUpdateRoot() {
	return (process.argv[1] ? await resolveAssistantPackageRoot({ cwd: path.dirname(path.resolve(process.argv[1])) }) : null) ?? await resolveAssistantPackageRoot({
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	}) ?? process.cwd();
}
/** Run one update subprocess and report bounded stdout/stderr tails to progress listeners. */
async function runUpdateStep(params) {
	return await runStep({
		...params,
		cwd: params.cwd ?? process.cwd(),
		runCommand: params.runCommand ?? runCommandWithTimeout,
		stepIndex: 0,
		totalSteps: 0
	});
}
async function cloneGitCheckoutTransactionally(params) {
	const parentDir = path.dirname(params.dir);
	await fs.mkdir(parentDir, { recursive: true });
	const canonicalParentDir = await fs.realpath(parentDir);
	const preserveDir = await pathExists(params.dir) && await isEmptyDir(params.dir);
	const targetDir = preserveDir ? await fs.realpath(params.dir) : path.join(canonicalParentDir, path.basename(params.dir));
	const targetIdentity = preserveDir ? await fs.lstat(targetDir, { bigint: true }) : void 0;
	const stagingParent = preserveDir ? targetDir : canonicalParentDir;
	const stagingDir = await fs.mkdtemp(path.join(stagingParent, ".testclaw-clone-"));
	const stagingIdentity = await fs.lstat(stagingDir, { bigint: true });
	let cleanupStaging = true;
	async function ownsDirectory(directory, identity) {
		try {
			const current = await fs.lstat(directory, { bigint: true });
			return current.isDirectory() && current.ino !== 0n && (process.platform !== "win32" || current.dev !== 0n) && current.ino === identity.ino && current.dev === identity.dev;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return false;
			throw error;
		}
	}
	try {
		const result = await runUpdateStep({
			name: "git-clone",
			argv: [
				"git",
				"clone",
				GIT_CLONE_BLOB_FILTER,
				UPSTREAM_REPOSITORY_URL,
				stagingDir
			],
			env: params.env,
			timeoutMs: params.timeoutMs,
			progress: params.progress
		});
		if (result.exitCode !== 0) return {
			checkoutDir: targetDir,
			step: result
		};
		const publish = async () => {
			if (!await ownsDirectory(stagingDir, stagingIdentity) || targetIdentity && !await ownsDirectory(targetDir, targetIdentity)) throw new Error(`The clone destination or staging directory changed before publication: ${targetDir}. The replacement was left unchanged; choose an empty TESTCLAW_GIT_DIR and retry.`);
			if (!preserveDir) try {
				await fs.lstat(targetDir);
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
				await fs.rename(stagingDir, targetDir);
				return targetDir;
			}
			if (!preserveDir) throw new Error(`TESTCLAW_GIT_DIR appeared while cloning: ${params.dir}. The existing path was left unchanged; move it or choose another TESTCLAW_GIT_DIR, then retry.`);
			const expectedEntries = preserveDir ? [path.basename(stagingDir)] : [];
			if ((await fs.readdir(targetDir)).toSorted().join("\0") !== expectedEntries.toSorted().join("\0")) throw new Error(`TESTCLAW_GIT_DIR appeared while cloning: ${params.dir}. The existing path was left unchanged; move it or choose another TESTCLAW_GIT_DIR, then retry.`);
			const entries = (await fs.readdir(stagingDir)).toSorted((a, b) => a === ".git" ? 1 : b === ".git" ? -1 : 0);
			const moved = [];
			let publishError;
			try {
				for (const entry of entries) {
					await fs.rename(path.join(stagingDir, entry), path.join(targetDir, entry));
					moved.push(entry);
				}
			} catch (error) {
				publishError = { value: error };
			}
			if (publishError) {
				const rollbackErrors = [];
				for (const entry of moved.toReversed()) try {
					await fs.rename(path.join(targetDir, entry), path.join(stagingDir, entry));
				} catch (rollbackError) {
					rollbackErrors.push(rollbackError);
				}
				if (rollbackErrors.length > 0) {
					cleanupStaging = false;
					throw new AggregateError([publishError.value, ...rollbackErrors], `Could not publish or fully roll back the cloned checkout at ${targetDir}; recovery files remain at ${stagingDir}`);
				}
				throw publishError.value;
			}
			return targetDir;
		};
		if (params.useStagedCheckout) await params.useStagedCheckout(stagingDir, publish, targetDir);
		else await publish();
		return {
			checkoutDir: targetDir,
			step: result
		};
	} finally {
		if (cleanupStaging && await ownsDirectory(stagingDir, stagingIdentity)) await fs.rm(stagingDir, {
			recursive: true,
			force: true
		});
	}
}
/** Ensure the configured source-update directory exists and points at an Assistant checkout. */
async function ensureGitCheckout(params) {
	const gitEnv = params.env ?? await createGlobalInstallEnv();
	if (!await pathExists(params.dir)) return await cloneGitCheckoutTransactionally({
		dir: params.dir,
		env: gitEnv,
		timeoutMs: params.timeoutMs,
		progress: params.progress,
		useStagedCheckout: params.useStagedCheckout
	});
	if (!await isGitCheckout(params.dir)) {
		if (!await isEmptyDir(params.dir)) throw new UpdatePreMutationError("invalid-git-directory", `TESTCLAW_GIT_DIR points at a non-git directory: ${params.dir}. Set TESTCLAW_GIT_DIR to an empty folder or an testclaw checkout.`);
		return await cloneGitCheckoutTransactionally({
			dir: params.dir,
			env: gitEnv,
			timeoutMs: params.timeoutMs,
			progress: params.progress,
			useStagedCheckout: params.useStagedCheckout
		});
	}
	if (!await isCorePackage(params.dir)) throw new UpdatePreMutationError("invalid-git-directory", `TESTCLAW_GIT_DIR does not look like a core checkout: ${params.dir}.`);
	return {
		checkoutDir: await fs.realpath(params.dir),
		step: null
	};
}
/** Detect the package manager that owns a global/package Assistant install. */
async function resolveGlobalManager(params) {
	await (params.pkgOwnership ?? createFreeBsdPkgOwnershipInspection(params.timeoutMs)).assertUnowned(params.root);
	if (params.installKind !== "git") {
		if (await resolveBrewAssistantPath(params.root)) throw new UpdatePreMutationError(resolveUnmanagedUpdateInstallReason(), "This Assistant installation is managed by Homebrew. To update Assistant, run:\n\n  brew upgrade testclaw-cli\n\nThen restart the gateway:\n\n  testclaw gateway restart", { failureFacts: [] });
		const diagnostics = [];
		const detected = await detectGlobalInstallManagerForRoot(runCommandWithTimeout, params.root, params.timeoutMs, diagnostics);
		if (!detected) {
			const reason = resolveUnmanagedUpdateInstallReason();
			const failure = createUpdatePreflightFailure("installation-unclassified", `${await describeUpdateInstallRoot(params.root)} Service unit target: ${params.serviceUnitTarget ?? "not inspected"}. Inspected package-manager owners: ${diagnostics.join("; ")}. ${UPDATE_INSTALL_SKIP_GUIDANCE[reason]}`);
			throw new UpdatePreMutationError(reason, failure.message, { failureFacts: failure.failureFacts });
		}
		return detected;
	}
	return await detectGlobalInstallManagerByPresence(runCommandWithTimeout, params.timeoutMs) ?? "npm";
}
const COMPLETION_CACHE_WRITE_TIMEOUT_MS = 3e4;
const COMPLETION_CACHE_MANUAL_REFRESH_HINT = "Shell tab-completion may be stale; refresh manually with: testclaw completion --write-state";
/** Best-effort refresh of shell completion state after a successful update. */
async function tryWriteCompletionCache(root, jsonMode, timeoutMs = COMPLETION_CACHE_WRITE_TIMEOUT_MS) {
	const binPath = path.join(root, "testclaw.mjs");
	if (!await pathExists(binPath)) return "skipped";
	let failure;
	try {
		const result = await runCommandWithTimeout([
			resolveNodeRunner(),
			binPath,
			"completion",
			"--write-state"
		], {
			cwd: root,
			env: {
				...process.env,
				[COMPLETION_SKIP_PLUGIN_COMMANDS_ENV]: "1"
			},
			input: "",
			timeoutMs,
			killProcessTree: true
		});
		if (result.code === 0) return "completed";
		failure = result.termination === "timeout" ? `timed out after ${timeoutMs / 1e3}s` : result.stderr.trim();
	} catch (error) {
		failure = String(error);
	}
	if (!jsonMode) defaultRuntime.log(theme.warn(`Completion cache update failed${failure ? `: ${failure}` : ""}. ${COMPLETION_CACHE_MANUAL_REFRESH_HINT}`));
	return "failed";
}
async function requestUpdateDowngradeConfirmation(params) {
	if (!process.stdin.isTTY || params.json) return "confirmation-required";
	const { confirm, isCancel } = await import("@clack/prompts");
	const { stylePromptMessage } = await import("./terminal-core/prompt-style.js");
	const targetLabel = params.targetVersion ?? `${params.tag} (unknown)`;
	const ok = await confirm({
		message: stylePromptMessage(`Downgrading from ${params.currentVersion} to ${targetLabel} can break configuration. Continue?`),
		initialValue: false
	});
	return isCancel(ok) || !ok ? "cancelled" : "confirmed";
}
async function confirmUpdateDowngrade(params) {
	const { finishUpdateRun } = await import("./update-run-ledger-D1vR-znz.mjs");
	const { opts, currentVersion, targetVersion, tag } = params;
	const decision = await requestUpdateDowngradeConfirmation({
		json: Boolean(opts.json),
		currentVersion,
		targetVersion,
		tag
	});
	const run = opts.run;
	if (decision === "confirmation-required") {
		finishUpdateRun(run.runId, {
			status: "skipped",
			reason: "downgrade-confirmation-required"
		}, { env: run.env });
		defaultRuntime.error("Downgrade confirmation required.\nDowngrading can break configuration. Re-run in a TTY to confirm.");
		defaultRuntime.exit(1);
		return false;
	}
	if (decision === "cancelled") {
		finishUpdateRun(run.runId, {
			status: "skipped",
			reason: "cancelled"
		}, { env: run.env });
		if (!opts.json) defaultRuntime.log(theme.muted("Update cancelled."));
		defaultRuntime.exit(0);
		return false;
	}
	return true;
}
//#endregion
export { tryWriteCompletionCache as _, isEmptyDir as a, parseTimeoutMsOrExit as c, resolveGitInstallDir as d, resolveGlobalManager as f, tryResolveInvocationCwd as g, runUpdateStep as h, ensureGitCheckout as i, parseUpdateTimeoutMs as l, resolveUpdateRoot as m, UpdatePreMutationError as n, isGitCheckout as o, resolveTargetVersion as p, confirmUpdateDowngrade as r, normalizeTag as s, DEFAULT_PACKAGE_NAME as t, requestUpdateDowngradeConfirmation as u };
