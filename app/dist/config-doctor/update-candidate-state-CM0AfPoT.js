import { M as resolveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { t as hasNodeErrorCode } from "./path-guards-D465IUx2.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { n as formatErrorMessageWithCode } from "./errors-cp9Var1Z.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-9ThoWRzf.js";
import { o as releaseSnapshotTempDirectory, s as removeTempDirectory, u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-CwtWaSiY.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { n as createSqliteSnapshotStagingDirectory, u as resolvePrivateSqliteSnapshotStagingRoot } from "./sqlite-snapshot-staging-D3DC29Jr.js";
import { a as readSqliteUserVersion } from "./sqlite-user-version-BppRXydv.js";
import { n as runtimeProcessEntrypoints, t as SQLITE_READONLY_CHILD_ARG } from "./runtime-process-entrypoints-DJeggoLv.js";
import { o as resolveAggregateSqliteInspectionTimeoutMs } from "./sqlite-readonly-worker-B2DLf5L4.js";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B-Vaprol.js";
import { O as readStateSchemaContentVersion } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { a as resolveAssistantStateDirForDatabasePath, i as resolveAssistantRegisteredAgentDatabasePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { C as record, D as tuple, T as string, b as object, d as array, g as literal, y as number } from "./schemas-D6YHSiZI.js";
import { a as runUtf8CommandWithTimeout } from "./exec-BXnQTpXR.js";
import { r as hasCommandProcessCleanupError } from "./exec-result-VkoWpd4F.js";
import { l as withCommandProcessScope } from "./exec-spawn-USR_FeKZ.js";
import { i as resolveUpdateCandidateStateIdentity, t as UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME } from "./update-candidate-paths-DMiAfiSo.js";
import { n as withUpdateCandidateIoBudget } from "./update-candidate-io-CuGA69IN.js";
import "node:fs";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { StringDecoder } from "node:string_decoder";
//#region src/infra/update-candidate-state.diagnostics.ts
const UPDATE_STATE_INSPECTION_PROGRESS_PREFIX = "State schema progress: ";
const ProgressSchema = object({
	phase: string(),
	path: string().optional()
});
/** Keep the last source independently of diagnostic output volume and child lifetime. */
function createUpdateStateInspectionDiagnostics(params) {
	const startedAt = Date.now();
	const decoder = new StringDecoder("utf8");
	let progress = {
		phase: params.phase,
		...params.paths.length === 1 ? { path: params.paths[0] } : {}
	};
	let pending = "";
	let tail = "";
	const receiveLine = (line) => {
		if (line.startsWith("State schema progress: ")) try {
			const value = ProgressSchema.safeParse(JSON.parse(line.slice(23)));
			if (value.success) {
				progress = value.data;
				return;
			}
		} catch {}
		tail = `${tail}${line}\n`.slice(-12e3);
	};
	return {
		onOutputChunk: (chunk, stream) => {
			if (stream !== "stderr") return;
			const lines = `${pending}${decoder.write(chunk)}`.split("\n");
			pending = (lines.pop() ?? "").slice(-12e3);
			for (const line of lines) receiveLine(line);
		},
		stderr: () => `${tail}${pending}`.trim(),
		failure(reason, termination) {
			const detail = formatErrorMessageWithCode(reason ?? "").trim() || "Worker exited without diagnostic output";
			const elapsed = Math.max(0, Date.now() - startedAt) / 1e3;
			const scope = params.paths.slice(0, 3).join(", ");
			const source = progress.path ?? `database scope [${scope}${params.paths.length > 3 ? ", …" : ""}]`;
			return new Error(`${params.operation} failed${termination ? ` (${termination})` : ""} after ${elapsed.toFixed(3)} seconds during ${progress.phase} for ${source} (scope: ${params.paths.length} database paths): ${detail}. Check database access, concurrent writers, and storage performance, then retry the update.`, reason instanceof Error ? { cause: reason } : void 0);
		}
	};
}
//#endregion
//#region src/infra/update-candidate-state.process.ts
/** A bounded command result does not release snapshot ownership before late process cleanup. */
function withUpdateStateInspectionWork(run, signal) {
	let stop = () => {};
	const work = withCommandProcessScope((stopScope) => {
		stop = stopScope;
		return run();
	}, signal);
	return retainSnapshotWork(work, () => stop());
}
//#endregion
//#region src/infra/update-candidate-state.inspection.ts
async function runUpdateStateInspectionWorker(params) {
	const workerUrl = resolveRuntimeWorkerUrl({
		...params.readOnlySource ? runtimeProcessEntrypoints.sqliteReadOnly : runtimeProcessEntrypoints.updateCandidateState,
		root: params.root
	});
	const sourceTsconfigPath = /\.[cm]?ts$/.test(fileURLToPath(workerUrl)) ? fileURLToPath(new URL("../../tsconfig.json", workerUrl)) : void 0;
	const inspection = createUpdateStateInspectionDiagnostics({
		operation: "State schema inspection",
		phase: params.input.mode === "versions" ? "schema inspection startup" : "shared database discovery",
		paths: params.readOnlySource ? [params.readOnlySource] : params.input.mode === "versions" ? params.databases.map((database) => database.path) : [path.resolve(params.input.stateDir, "state", "testclaw.sqlite")]
	});
	try {
		return {
			...await withUpdateStateInspectionWork(() => withUpdateCandidateIoBudget({
				directory: params.stagingRoot,
				bytes: params.databases.reduce((total, database) => total + Number(database.sizeBytes ?? 0), 0),
				timeoutMs: Math.max(params.timeoutMs ?? 0, resolveAggregateSqliteInspectionTimeoutMs("state schema inspection", params.databases)),
				signal: params.signal,
				nodeRunner: params.nodeRunner,
				env: params.sourceEnv
			}, (signal) => runUtf8CommandWithTimeout([
				params.nodeRunner,
				...resolveRuntimeWorkerArgv(workerUrl, params.nodeRunner),
				...params.readOnlySource ? [
					SQLITE_READONLY_CHILD_ARG,
					"sync",
					params.readOnlySource,
					params.stagingRoot
				] : []
			], {
				cwd: os.tmpdir(),
				input: params.readOnlySource ? void 0 : JSON.stringify({
					...params.input,
					env: {
						HOME: params.sourceEnv.HOME,
						TESTCLAW_HOME: params.sourceEnv.TESTCLAW_HOME,
						USERPROFILE: params.sourceEnv.USERPROFILE,
						TESTCLAW_AGENT_DIR: params.sourceEnv.TESTCLAW_AGENT_DIR,
						PI_CODING_AGENT_DIR: params.sourceEnv.PI_CODING_AGENT_DIR
					}
				}),
				baseEnv: params.sourceEnv,
				env: {
					XDG_CACHE_HOME: params.stagingRoot,
					...sourceTsconfigPath ? { TSX_TSCONFIG_PATH: sourceTsconfigPath } : {}
				},
				killGraceMs: 500,
				killProcessTree: true,
				maxOutputBytes: {
					stdout: 1048576,
					stderr: 2e4
				},
				outputCapture: {
					stdout: "head",
					stderr: "discard"
				},
				terminateOnOutputLimit: { stdout: true },
				onOutputChunk: inspection.onOutputChunk,
				signal
			})), params.signal),
			stderr: inspection.stderr(),
			inspection
		};
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw inspection.failure(error);
		params.signal?.throwIfAborted();
		throw inspection.failure(error);
	}
}
function parseUpdateStateInspectionWorker(result, schema) {
	if (result.code !== 0 || result.termination !== "exit" || result.outputLimitExceeded) {
		const signal = result.signal ? `, signal ${result.signal}` : "";
		throw result.inspection.failure(result.stderr || (result.outputLimitExceeded ? "Worker output exceeded its capture limit" : result.stdout), `${result.termination}${signal}`);
	}
	try {
		return schema.parse(JSON.parse(result.stdout));
	} catch (error) {
		throw result.inspection.failure(error);
	}
}
//#endregion
//#region src/infra/update-candidate-state.sizes.ts
const inventorySource = `
  const fs = require("node:fs");
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
    const result = [];
    const progress = path => fs.writeSync(2, ${JSON.stringify(UPDATE_STATE_INSPECTION_PROGRESS_PREFIX)} + JSON.stringify({ phase: "metadata inventory", path }) + "\\n");
    for (const file of JSON.parse(input).files) {
      let size;
      progress(file);
      try { size = fs.statSync(file, { bigint: true }).size; }
      catch (error) {
        if (error.code !== "ENOENT") result.push({ path: file });
        continue;
      }
      for (const suffix of ["-wal", "-shm", "-journal"]) {
        progress(file + suffix);
        try { size += fs.statSync(file + suffix, { bigint: true }).size; }
        catch (error) {
          if (error.code !== "ENOENT") { size = undefined; break; }
        }
      }
      result.push({ path: file, sizeBytes: size?.toString() });
    }
    process.stdout.write(JSON.stringify(result));
  });
`;
const inventorySchema = array(object({
	path: string(),
	sizeBytes: string().regex(/^\d+$/).optional()
}));
/** Measure SQLite families in a bounded child so metadata cannot block updater cancellation. */
async function readUpdateStateDatabaseSizes(files, options) {
	const budget = resolveAggregateSqliteInspectionTimeoutMs("state schema inventory", files.map((file) => ({
		path: file,
		sizeBytes: void 0
	})));
	const inspection = createUpdateStateInspectionDiagnostics({
		operation: "State schema inventory",
		phase: "metadata inventory",
		paths: files
	});
	let result;
	try {
		result = await withUpdateStateInspectionWork(() => runUtf8CommandWithTimeout([
			options.nodeRunner,
			"--input-type=commonjs",
			"--eval",
			inventorySource
		], {
			cwd: os.tmpdir(),
			input: JSON.stringify({ files }),
			baseEnv: options.sourceEnv,
			env: { XDG_CACHE_HOME: options.stagingRoot },
			signal: options.signal,
			timeoutMs: resolveTimerTimeoutMs(Math.max(options.timeoutMs ?? 0, budget), budget),
			killGraceMs: 500,
			killProcessTree: true,
			maxOutputBytes: {
				stdout: 1048576,
				stderr: 2e4
			},
			outputCapture: {
				stdout: "head",
				stderr: "discard"
			},
			terminateOnOutputLimit: { stdout: true },
			onOutputChunk: inspection.onOutputChunk
		}), options.signal);
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw inspection.failure(error);
		options.signal?.throwIfAborted();
		throw inspection.failure(error);
	}
	options.signal?.throwIfAborted();
	if (result.code !== 0 || result.termination !== "exit" || result.outputLimitExceeded) throw inspection.failure(inspection.stderr() || (result.outputLimitExceeded ? "Worker output exceeded its capture limit" : ""), result.termination);
	try {
		return inventorySchema.parse(JSON.parse(result.stdout)).map((entry) => ({
			path: entry.path,
			sizeBytes: entry.sizeBytes === void 0 ? void 0 : BigInt(entry.sizeBytes)
		}));
	} catch (error) {
		throw inspection.failure(error);
	}
}
//#endregion
//#region src/infra/update-candidate-state.ts
const UpdateStateSchemaVersionsSchema = array(object({
	path: string(),
	userVersion: number().nullable(),
	contentVersion: number().optional()
}));
const UpdateCandidateStateSnapshotSchema = object({
	versions: UpdateStateSchemaVersionsSchema,
	pluginPaths: record(string(), string())
});
/** Older inspection workers report only the published version; agent stores never defer it. */
function resolveUpdateStateContentVersion(entry) {
	return entry.contentVersion ?? entry.userVersion;
}
function updateStateSchemaVersionsMatch(before, after, params) {
	const versions = new Map(after.map((entry) => [entry.path, resolveUpdateStateContentVersion(entry)]));
	const candidate = params.candidateSchemaVersions;
	if (!candidate) return before.length === after.length && before.every((entry) => versions.get(entry.path) === resolveUpdateStateContentVersion(entry));
	const baseline = new Map(before.map((entry) => [entry.path, resolveUpdateStateContentVersion(entry)]));
	return before.every((entry) => resolveUpdateStateContentVersion(entry) === null || versions.get(entry.path) === resolveUpdateStateContentVersion(entry)) && after.every((entry) => {
		const version = resolveUpdateStateContentVersion(entry);
		if (version === null || baseline.get(entry.path) === version) return true;
		const supported = entry.path === params.sharedPath ? candidate.state : candidate.agent;
		return baseline.get(entry.path) == null && version === supported;
	});
}
async function fileExists(file) {
	try {
		await fs$1.access(file);
		return true;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return false;
		throw error;
	}
}
/** Every raw spelling discovered for one database, grouped by projection identity. */
const StateDatabaseDiscoverySchema = object({ spellings: tuple([string()], string()) });
const UpdateCandidateStateInventorySchema = array(tuple([string(), StateDatabaseDiscoverySchema])).transform((entries) => new Map(entries));
const UpdateCandidateSnapshotInventorySchema = object({
	databases: UpdateCandidateStateInventorySchema,
	pluginBytes: number().nonnegative(),
	pluginPlan: literal(UPDATE_CANDIDATE_PLUGIN_PLAN_FILENAME)
});
const UpdateStateSchemaInspectionPlanSchema = object({
	files: array(tuple([string(), StateDatabaseDiscoverySchema])),
	sharedVersion: UpdateStateSchemaVersionsSchema.element
});
function queueStateDatabaseSpelling(files, identity, file) {
	const discovery = files.get(identity);
	if (discovery) {
		if (!discovery.spellings.includes(file)) discovery.spellings.push(file);
		return;
	}
	files.set(identity, { spellings: [file] });
}
function collectRegisteredPaths(db, shared, files) {
	return (tableExists(db, "agent_databases") ? executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("agent_databases").select("path").orderBy("path")).rows : []).map(({ path: stored }) => {
		const source = resolveAssistantRegisteredAgentDatabasePath(shared, stored);
		queueStateDatabaseSpelling(files, resolveUpdateCandidateStateIdentity(resolveAssistantStateDirForDatabasePath(shared), source), source);
		return {
			stored,
			source
		};
	});
}
async function collectStateDatabasePaths(input, options = {}) {
	const shared = path.resolve(input.stateDir, "state", "testclaw.sqlite");
	const stateRoot = path.resolve(input.stateDir);
	const files = /* @__PURE__ */ new Map();
	const queue = (file) => {
		queueStateDatabaseSpelling(files, resolveUpdateCandidateStateIdentity(stateRoot, file), file);
	};
	queue(shared);
	let directories = [];
	if (options.includeUnconfiguredAgents !== false) try {
		directories = (await fs$1.readdir(path.join(input.stateDir, "agents"), { withFileTypes: true })).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => entry.name);
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
	const configured = Object.entries(input.config.agents?.entries ?? {});
	for (const directory of [input.env?.TESTCLAW_AGENT_DIR, input.env?.PI_CODING_AGENT_DIR]) if (directory?.trim()) queue(path.join(resolveUserPath(directory, input.env), "testclaw-agent.sqlite"));
	const projected = (input.config.agents?.list ?? []).map((agent) => [agent.id, agent]);
	for (const [id, agent] of [...configured, ...projected]) {
		directories.push(id);
		if (agent.agentDir) queue(path.join(resolveUserPath(agent.agentDir, input.env), "testclaw-agent.sqlite"));
	}
	for (const id of /* @__PURE__ */ new Set(["main", ...directories])) queue(path.resolve(input.stateDir, "agents", id, "agent", "testclaw-agent.sqlite"));
	return new Map([...files.entries()].toSorted(([, a], [, b]) => a.spellings[0] < b.spellings[0] ? -1 : a.spellings[0] > b.spellings[0] ? 1 : 0));
}
function readStateDatabaseVersion(location, file, shared, files) {
	const db = openNodeSqliteDatabase(location, { readOnly: true });
	try {
		if (file === shared) collectRegisteredPaths(db, shared, files);
		return {
			userVersion: readSqliteUserVersion(db),
			...file === shared ? { contentVersion: readStateSchemaContentVersion(db) } : {}
		};
	} finally {
		db.close();
	}
}
function finishStateInspection(stagingRoot, outcome) {
	if ("cause" in outcome && hasCommandProcessCleanupError(outcome.cause)) {
		releaseSnapshotTempDirectory(stagingRoot);
		throw new Error(`${formatErrorMessageWithCode(outcome.cause)}. Staging retained at ${stagingRoot}. Confirm that update workers have stopped before retrying the update.`, { cause: outcome.cause });
	}
	if (!removeTempDirectory(stagingRoot)) throw new Error(`State schema inspection snapshot cleanup failed: ${stagingRoot}`, { cause: "cause" in outcome ? outcome.cause : void 0 });
	if ("cause" in outcome) throw outcome.cause;
	return outcome.value;
}
/** Released candidates can snapshot shared state even when they cannot expose discovery. */
async function discoverLegacyUpdateStateSchemaInspection(params) {
	params.signal?.throwIfAborted();
	const shared = path.resolve(params.input.stateDir, "state", "testclaw.sqlite");
	const files = await collectStateDatabasePaths(params.input);
	if (!await fileExists(shared)) return {
		files: [...files],
		sharedVersion: {
			path: shared,
			userVersion: null
		}
	};
	const stagingRoot = await createSqliteSnapshotStagingDirectory(params.stagingRoot, params.root !== void 0, params.signal);
	let outcome;
	try {
		const snapshot = parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
			...params,
			stagingRoot,
			readOnlySource: shared
		}), object({
			ok: literal(true),
			location: string()
		}));
		const relative = path.relative(stagingRoot, snapshot.location);
		if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error("Legacy state inspection returned a snapshot outside parent-owned staging.");
		const sharedVersion = {
			path: shared,
			...readStateDatabaseVersion(snapshot.location, shared, shared, files)
		};
		outcome = { value: {
			files: [...files],
			sharedVersion
		} };
	} catch (cause) {
		outcome = { cause };
	}
	return finishStateInspection(stagingRoot, outcome);
}
/** Schema fencing reads private copies in candidate workers under size-aware deadlines. */
async function readUpdateStateSchemaVersions({ root, nodeRunner = process.execPath, timeoutMs, signal: callerSignal, ...input }) {
	if (root === null) throw new Error("The active installation root is unknown; state inspection is unsafe.");
	const controller = new AbortController();
	const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
	signal.throwIfAborted();
	const sourceEnv = input.env ?? process.env;
	const stagingRoot = await createSqliteSnapshotStagingDirectory(resolvePrivateSqliteSnapshotStagingRoot(sourceEnv), root !== void 0, signal);
	const inspection = (async () => {
		let outcome;
		try {
			const shared = path.resolve(input.stateDir, "state", "testclaw.sqlite");
			const sizeOptions = {
				nodeRunner,
				signal,
				sourceEnv,
				stagingRoot,
				timeoutMs
			};
			const discoveryParams = {
				input: {
					...input,
					mode: "discover",
					stagingRoot
				},
				nodeRunner,
				root,
				signal,
				sourceEnv,
				stagingRoot,
				timeoutMs,
				databases: await readUpdateStateDatabaseSizes([shared], sizeOptions)
			};
			const discoveryResult = await runUpdateStateInspectionWorker(discoveryParams);
			const legacyWorker = discoveryResult.code !== 0 && discoveryResult.stderr.includes("Unknown update state inspection mode");
			const discovery = legacyWorker ? await discoverLegacyUpdateStateSchemaInspection({
				...discoveryParams,
				input
			}) : parseUpdateStateInspectionWorker(discoveryResult, UpdateStateSchemaInspectionPlanSchema);
			const sharedIdentity = resolveUpdateCandidateStateIdentity(input.stateDir, shared);
			const files = legacyWorker ? discovery.files.flatMap(([, database]) => database.spellings) : discovery.files.filter(([identity]) => identity !== sharedIdentity).map(([, database]) => database.spellings[0]);
			outcome = { value: parseUpdateStateInspectionWorker(await runUpdateStateInspectionWorker({
				...discoveryParams,
				input: legacyWorker ? {
					...input,
					mode: "versions"
				} : {
					...input,
					mode: "versions",
					stagingRoot,
					inspectionPlan: discovery
				},
				databases: await readUpdateStateDatabaseSizes(files, sizeOptions)
			}), UpdateStateSchemaVersionsSchema) };
		} catch (cause) {
			outcome = { cause };
		}
		return finishStateInspection(stagingRoot, outcome);
	})();
	return retainSnapshotWork(inspection, () => controller.abort());
}
//#endregion
export { resolveUpdateStateContentVersion as a, readUpdateStateSchemaVersions as i, UpdateCandidateStateSnapshotSchema as n, updateStateSchemaVersionsMatch as o, collectStateDatabasePaths as r, readUpdateStateDatabaseSizes as s, UpdateCandidateSnapshotInventorySchema as t };
