import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.js";
import { i as resolveWindowsConsoleEncoding, n as decodeWindowsOutputBuffer } from "./windows-encoding-CzxaGNeo.js";
import { a as executeGitCommandBuffered, c as normalizeGitPathForFilesystem, i as executeGitCommand, n as createGitCommandError, o as executeGitCommandBytes, r as enqueueGitRefMutation, u as requireGitCommandOutput } from "./git-exec-DorVib0z.js";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.js";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs$1 from "node:fs/promises";
//#region src/agents/worktrees/errors.ts
var WorktreeRepositoryError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WorktreeRepositoryError";
	}
};
//#endregion
//#region src/infra/git-worker-context.ts
const context = new AsyncLocalStorage();
const errorOrigins = /* @__PURE__ */ new WeakMap();
function serializeGitWorkerFailure(error) {
	const code = asOptionalRecord(error)?.code;
	return {
		name: error instanceof Error ? error.name : "Error",
		message: error instanceof Error ? error.message : String(error),
		...typeof code === "string" || typeof code === "number" ? { code } : {},
		...error instanceof Error && errorOrigins.has(error) ? { origin: errorOrigins.get(error) } : {}
	};
}
function restoreGitWorkerFailure(failure) {
	const error = failure.name === "WorktreeRepositoryError" ? new WorktreeRepositoryError(failure.message) : new Error(failure.message);
	error.name = failure.name;
	if (failure.code !== void 0) Object.assign(error, { code: failure.code });
	if (failure.origin !== void 0) errorOrigins.set(error, failure.origin);
	return error;
}
function hasGitWorkerContext() {
	return context.getStore() !== void 0;
}
async function requestHost(request) {
	const state = context.getStore();
	if (!state || state.closed) throw new Error("Git operation requires its worker host");
	const transfers = [];
	if (request.type === "workspace.inventory.write") {
		const bytes = ownedWorkerBytes(request.input.bytes);
		request.input.bytes = bytes;
		transfers.push(bytes.buffer);
	}
	if ((request.type === "git.text" || request.type === "git.buffer") && request.input.options.input instanceof Uint8Array) {
		const input = Uint8Array.from(request.input.options.input);
		request.input.options.input = input;
		transfers.push(input.buffer);
	}
	return await new Promise((resolve, reject) => {
		state.pending.push({
			request,
			transfers,
			resolve,
			reject
		});
		state.drain ??= Promise.resolve().then(() => drainHostRequests(state));
	});
}
/** Independent Git reads keep their parallelism inside the pool's serial host channel. */
async function drainHostRequests(state) {
	try {
		while (state.pending.length > 0) {
			const pending = state.pending.splice(0, 16);
			try {
				if (state.closed) throw new Error("Git operation closed before host execution");
				const batch = {
					type: "git.batch",
					input: { requests: pending.map((entry) => entry.request) }
				};
				const response = await state.channel.request(batch, pending.flatMap((entry) => entry.transfers));
				try {
					const replies = response.input;
					if (!Array.isArray(replies) || replies.length !== pending.length) throw new Error("Git host returned an incomplete batch");
					for (const [index, entry] of pending.entries()) {
						const reply = replies[index];
						if (reply.ok) entry.resolve(reply.value);
						else entry.reject(restoreGitWorkerFailure(reply.error));
					}
				} finally {
					response.consumed();
				}
			} catch (error) {
				for (const entry of pending) entry.reject(error);
			}
		}
	} finally {
		state.drain = void 0;
	}
}
async function requestGitWorkerCommand(command) {
	return await requestHost(command);
}
//#endregion
//#region src/agents/worktrees/git.ts
const WORKTREE_CHECKOUT_TIMEOUT_MS = 3e5;
function withNoGlob(value) {
	if (value?.trim().split(/\s+/).at(-1) === "noglob") return value;
	return value ? `${value} noglob` : "noglob";
}
/**
* Gateway-run Git must never execute repository hooks or filesystem monitors;
* the admin-gated setup script is the sole intentional repository-code path.
* Exported so other Gateway-owned callers that must bypass the `runGit`/
* `requireGit*` wrappers (e.g. a buffered, non-throwing invocation with a
* custom timeout) still pin the same invariant instead of reimplementing it.
*/
function gitEnvironment(env, args = [], platform = process.platform, inheritedEnv = process.env) {
	const baseEnv = env ?? inheritedEnv;
	const effectiveWindowsEnv = platform === "win32" && args.some((arg) => arg.endsWith("^{commit}")) ? mergeProcessEnv([inheritedEnv, env], platform) : void 0;
	const windowsNoGlob = effectiveWindowsEnv ? {
		MSYS: withNoGlob(resolveEnvironmentValue(effectiveWindowsEnv, "MSYS", platform)),
		CYGWIN: withNoGlob(resolveEnvironmentValue(effectiveWindowsEnv, "CYGWIN", platform))
	} : {};
	return {
		...baseEnv,
		...windowsNoGlob,
		GIT_CONFIG_COUNT: "2",
		GIT_CONFIG_KEY_0: "core.hooksPath",
		GIT_CONFIG_VALUE_0: os.devNull,
		GIT_CONFIG_KEY_1: "core.fsmonitor",
		GIT_CONFIG_VALUE_1: "false"
	};
}
async function runGit(cwd, args, options = {}) {
	if (hasGitWorkerContext()) {
		const { signal: _signal, beforeRun: _beforeRun, ...forwarded } = options;
		const { stdout, stderr, windowsEncoding, ...metadata } = await requestGitWorkerCommand({
			type: "git.text",
			input: {
				cwd,
				args,
				options: forwarded
			}
		});
		return {
			...metadata,
			stdout: decodeWindowsOutputBuffer({
				buffer: Buffer.from(stdout.buffer, stdout.byteOffset, stdout.byteLength),
				windowsEncoding
			}),
			stderr: decodeWindowsOutputBuffer({
				buffer: Buffer.from(stderr.buffer, stderr.byteOffset, stderr.byteLength),
				windowsEncoding
			})
		};
	}
	const baseEnv = options.baseEnv ?? { ...process.env };
	const env = gitEnvironment(options.env, args, process.platform, baseEnv);
	const fetchesRefs = args[0] === "fetch";
	const run = (gitArgs) => {
		return executeGitCommand(cwd, gitArgs, {
			...options,
			beforeRun: gitArgs === args ? options.beforeRun : void 0,
			baseEnv,
			env,
			input: gitArgs === args ? options.input : void 0,
			killProcessTree: options.killProcessTree ?? (fetchesRefs && gitArgs === args)
		});
	};
	return await withGitRefAdmission(cwd, args, run, options.signal);
}
/** Parent-only command execution for text consumers whose decoding runs in a worker. */
async function runGitBytes(cwd, args, options = {}) {
	const baseEnv = options.baseEnv ?? { ...process.env };
	const env = gitEnvironment(options.env, args, process.platform, baseEnv);
	return await withGitRefAdmission(cwd, args, (gitArgs) => {
		return executeGitCommandBytes(cwd, gitArgs, {
			...options,
			beforeRun: gitArgs === args ? options.beforeRun : void 0,
			baseEnv,
			env,
			input: gitArgs === args ? options.input : void 0,
			killProcessTree: options.killProcessTree ?? (args[0] === "fetch" && gitArgs === args)
		});
	}, options.signal);
}
async function withGitRefAdmission(cwd, args, run, signal) {
	if (!(args[0] === "fetch" || args[0] === "update-ref" || args[0] === "branch" && args.some((arg) => arg === "-d" || arg === "-D" || arg === "--delete"))) return await run(args);
	const resolved = await run(["rev-parse", "--git-common-dir"]);
	if (resolved.termination !== "exit" || resolved.code !== 0) return resolved;
	const commonDir = typeof resolved.stdout === "string" ? resolved.stdout : decodeWindowsOutputBuffer({
		buffer: Buffer.from(resolved.stdout.buffer, resolved.stdout.byteOffset, resolved.stdout.byteLength),
		windowsEncoding: resolveWindowsConsoleEncoding()
	});
	let entered = false;
	try {
		return await enqueueGitRefMutation(cwd, commonDir.trim(), () => {
			entered = true;
			return run(args);
		}, signal);
	} catch (error) {
		if (!entered && signal?.aborted && error === signal.reason) return await run(args);
		throw error;
	}
}
/** Byte-preserving Git transport shared by worker inventories and ordinary callers. */
async function runGitBuffered(cwd, args, options = {}) {
	if (hasGitWorkerContext()) {
		const { signal: _signal, beforeRun: _beforeRun, ...forwarded } = options;
		const result = await requestGitWorkerCommand({
			type: "git.buffer",
			input: {
				cwd,
				args,
				options: forwarded
			}
		});
		return {
			...result,
			stdout: Buffer.from(result.stdout.buffer, result.stdout.byteOffset, result.stdout.byteLength),
			stderr: Buffer.from(result.stderr.buffer, result.stderr.byteOffset, result.stderr.byteLength)
		};
	}
	const baseEnv = options.baseEnv ?? { ...process.env };
	const env = gitEnvironment(options.env, args, process.platform, baseEnv);
	return await withGitRefAdmission(cwd, args, (gitArgs) => {
		return executeGitCommandBuffered(cwd, gitArgs, {
			...options,
			beforeRun: gitArgs === args ? options.beforeRun : void 0,
			input: gitArgs === args ? options.input : void 0,
			baseEnv,
			env
		});
	}, options.signal);
}
function commandError(command, result) {
	return createGitCommandError(command, result);
}
async function requireGit(cwd, args, options = {}) {
	const result = await runGit(cwd, args, options);
	return requireGitCommandOutput(`git ${args.join(" ")}`, result).trim();
}
async function requireGitBuffer(cwd, args, options = {}) {
	const result = await runGitBuffered(cwd, args, options);
	if (result.termination !== "exit" || result.code !== 0) throw createGitCommandError(`git ${args.join(" ")}`, result);
	return result.stdout;
}
function parseWorktreeList(output) {
	const entries = [];
	let current;
	for (const field of output.split("\0")) {
		if (!field) {
			if (current) {
				entries.push(current);
				current = void 0;
			}
			continue;
		}
		if (field.startsWith("worktree ")) {
			if (current) entries.push(current);
			current = { path: normalizeGitPathForFilesystem(field.slice(9)) };
		} else if (current && field === "locked") current.lockedReason = "";
		else if (current && field.startsWith("locked ")) current.lockedReason = field.slice(7);
	}
	if (current) entries.push(current);
	return entries;
}
async function listGitWorktrees(repoRoot, options = {}) {
	return parseWorktreeList(requireGitCommandOutput("git worktree list", await runGit(repoRoot, [
		"worktree",
		"list",
		"--porcelain",
		"-z"
	], options)));
}
/** Resolve shared storage and its primary root without selecting or validating HEAD. */
async function resolveGitRepositoryPaths(sourceRoot, options = {}) {
	const commonRaw = normalizeGitPathForFilesystem(await requireGit(sourceRoot, ["rev-parse", "--git-common-dir"], options));
	const commonDir = await fs$1.realpath(path.isAbsolute(commonRaw) ? commonRaw : path.resolve(sourceRoot, commonRaw));
	const primary = (await listGitWorktrees(sourceRoot, options))[0]?.path ?? sourceRoot;
	return {
		canonicalRoot: await fs$1.realpath(primary),
		commonDir
	};
}
/**
* True when dir sits inside a git checkout: a .git entry on itself or any ancestor.
* Existence, not directory-ness, is the signal — linked worktrees keep a .git file.
* Mirrors `git rev-parse --show-toplevel` discovery without spawning git, so UI
* capability checks and create-preflights cannot diverge from the worktree service.
*/
function findGitCheckoutRoot(start) {
	let current = path.resolve(start);
	for (;;) {
		if (existsSync(path.join(current, ".git"))) return current;
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
function insideGitCheckout(start) {
	return findGitCheckoutRoot(start) !== null;
}
async function hasSelfContainedGitMetadata(checkoutRoot) {
	try {
		return (await fs$1.lstat(path.join(checkoutRoot, ".git"))).isDirectory();
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
async function worktreePathExists(target) {
	try {
		await fs$1.lstat(target);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
//#endregion
export { serializeGitWorkerFailure as _, hasSelfContainedGitMetadata as a, requireGit as c, runGit as d, runGitBuffered as f, restoreGitWorkerFailure as g, hasGitWorkerContext as h, gitEnvironment as i, requireGitBuffer as l, worktreePathExists as m, commandError as n, insideGitCheckout as o, runGitBytes as p, findGitCheckoutRoot as r, listGitWorktrees as s, WORKTREE_CHECKOUT_TIMEOUT_MS as t, resolveGitRepositoryPaths as u, WorktreeRepositoryError as v };
