import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-BBHaqzpY.js";
import { r as getChildLogger } from "./logger-DmjW9g94.js";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B-Vaprol.js";
import { t as WorkerTaskPool } from "./worker-task-pool-DdST9izh.js";
import { S as isTrajectorySessionArtifactName, _ as isMigrationArchiveArtifactName, b as isSessionArchiveArtifactName, g as isCompactionCheckpointTranscriptFileName, m as SESSION_STORE_TEMP_STALE_MS, o as resolveSessionArtifactDirectory, s as resolveSessionFilePathCore, v as isPrimarySessionTranscriptFileName, x as isSessionStoreTempArtifactName, y as isRetainedSessionTranscriptArchiveName } from "./paths-ViQaz2td.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { a as normalizeStoreSessionKey } from "./store-entry-BKQU6sPT.js";
import "./session-sqlite-target-BANhXeoo.js";
import { r as projectSessionStoreForPersistence } from "./skill-prompt-blobs-DSVi3nkm.js";
import { a as collectActiveSessionLifecycleMutationIdentities, o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-7kJ3kdsZ.js";
import { _ as shouldRunSessionEntryMaintenance, d as pruneStaleEntries, f as pruneStaleModelRunEntries, g as shouldRunModelRunPrune, i as capEntryCount, l as isSessionEntryDiskBudgetEvictable, n as readLegacyCompactionSnapshotPaths, p as resolveMaintenanceConfigFromInput, r as archiveStaleDashboardEntries } from "./legacy-compaction-history-3Lv-j3a5.js";
import { a as resolveTrajectoryFilePath, o as resolveTrajectoryPointerFilePath } from "./paths-ygwczn-L.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.js";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/store-maintenance-plan.ts
/** Mutate working images only; callers own warn mode, protected keys, reads, and persistence. */
function planSessionEntryMaintenance(params) {
	const runModelRunPrune = shouldRunModelRunPrune({
		maintenance: params.maintenance,
		entryCount: params.initialUnarchivedCount,
		force: params.forceMaintenance
	});
	const candidateAges = [
		params.maintenance.pruneAfterMs,
		params.maintenance.archiveDashboardAfterMs,
		runModelRunPrune ? params.maintenance.modelRunPruneAfterMs : null
	].filter((age) => age != null && age > 0);
	const store = params.readAgeCandidates(candidateAges.length > 0 ? Math.min(...candidateAges) : null);
	let remainingUnarchivedCount = params.initialUnarchivedCount;
	const counts = {
		archived: 0,
		capArchived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
	const options = {
		log: params.log,
		preserveRecentMs: params.maintenance.preserveRecentMs
	};
	let protectedOptions;
	const readProtectedOptions = () => protectedOptions ??= {
		...options,
		preserveKeys: params.readPreserveKeys()
	};
	const ageOptions = Object.keys(store).length > 0 ? readProtectedOptions() : options;
	const recordRemoval = (candidate, reason) => {
		remainingUnarchivedCount -= 1;
		params.onRemoved?.(candidate, reason);
	};
	const recordArchive = (candidate, phase) => {
		remainingUnarchivedCount -= 1;
		counts.archived += 1;
		if (phase === "cap") counts.capArchived += 1;
		params.onArchived?.(candidate, phase);
	};
	const archiveDashboards = () => archiveStaleDashboardEntries(store, params.maintenance.archiveDashboardAfterMs, {
		...ageOptions,
		onArchived: (candidate) => recordArchive(candidate, "dashboard")
	});
	if (params.profile === "legacy-read") archiveDashboards();
	if (runModelRunPrune) counts.modelRunPruned = pruneStaleModelRunEntries(store, params.maintenance.modelRunPruneAfterMs, {
		...ageOptions,
		onPruned: (candidate) => recordRemoval(candidate, "model-run-pruned")
	});
	if (params.profile === "write") archiveDashboards();
	if (params.profile === "write" || remainingUnarchivedCount > params.maintenance.maxEntries) {
		counts.pruned = pruneStaleEntries(store, params.maintenance.pruneAfterMs, {
			...ageOptions,
			onPruned: (candidate) => recordRemoval(candidate, "pruned"),
			onArchived: (candidate) => recordArchive(candidate, "age")
		});
		if (shouldRunSessionEntryMaintenance({
			entryCount: remainingUnarchivedCount,
			maxEntries: params.maintenance.maxEntries,
			force: params.forceMaintenance
		})) {
			const cap = params.readCapCandidates(remainingUnarchivedCount);
			if (cap && Object.keys(cap.store).length > 0) counts.capped = capEntryCount(cap.store, cap.maxEntries, {
				...readProtectedOptions(),
				onArchived: (candidate) => {
					if (cap.store !== store) store[candidate.key] = candidate.entry;
					recordArchive(candidate, "cap");
				},
				onRemoved: (candidate) => recordRemoval(candidate, "capped")
			});
		}
	}
	return {
		store,
		...counts
	};
}
//#endregion
//#region src/config/sessions/store-maintenance-preserve-snapshot.ts
function collectSessionWorkAdmissionKeysFromSnapshot(store, identities) {
	if (identities.length === 0) return /* @__PURE__ */ new Set();
	const active = new Set(identities);
	const normalized = new Set(identities.map(normalizeStoreSessionKey));
	const keys = /* @__PURE__ */ new Set();
	for (const [key, entry] of Object.entries(store)) {
		const normalizedKey = normalizeStoreSessionKey(key);
		if (normalized.has(normalizedKey) || active.has(entry.sessionId)) {
			keys.add(key);
			keys.add(normalizedKey);
		}
	}
	return keys;
}
/** Resolve parent-owned protection against the worker's current row projection. */
function resolveSessionMaintenancePreserveKeys(params) {
	const keys = new Set(params.snapshot.providerKeys);
	for (const key of params.baseKeys ?? []) {
		const normalized = normalizeStoreSessionKey(key ?? "");
		if (normalized) keys.add(normalized);
	}
	for (const key of collectSessionWorkAdmissionKeysFromSnapshot(params.store, params.snapshot.workIdentities)) keys.add(key);
	if (params.snapshot.lifecycleIdentities.length > 0) {
		const lifecycle = new Set(params.snapshot.lifecycleIdentities);
		for (const [key, entry] of Object.entries(params.store)) {
			const normalizedKey = normalizeStoreSessionKey(key);
			if ([
				key,
				normalizedKey,
				entry.sessionId
			].some((identity) => Boolean(identity?.trim()) && lifecycle.has(identity.trim()))) {
				keys.add(key);
				keys.add(normalizedKey);
			}
		}
	}
	return keys;
}
//#endregion
//#region src/config/sessions/store-maintenance-preserve.ts
const preserveKeysProviders = /* @__PURE__ */ new Set();
/** Registers a provider for session maintenance preserve keys. */
function registerSessionMaintenancePreserveKeysProvider(provider) {
	preserveKeysProviders.add(provider);
	return () => {
		preserveKeysProviders.delete(provider);
	};
}
function addSessionMaintenancePreserveKey(keys, value) {
	const normalized = normalizeStoreSessionKey(value ?? "");
	if (normalized) keys.add(normalized);
}
function addSessionMaintenancePreserveKeys(keys, values) {
	for (const value of values ?? []) addSessionMaintenancePreserveKey(keys, value);
}
/** Collects normalized session keys that maintenance/pruning must preserve. */
function collectSessionMaintenancePreserveKeys(baseKeys) {
	const keys = /* @__PURE__ */ new Set();
	addSessionMaintenancePreserveKeys(keys, baseKeys);
	for (const provider of preserveKeysProviders) try {
		addSessionMaintenancePreserveKeys(keys, provider());
	} catch {}
	return keys.size > 0 ? keys : void 0;
}
/** Resolves store keys owned by active work, including aliases sharing a backing session id. */
function collectActiveSessionWorkAdmissionKeys(params) {
	const keys = collectSessionWorkAdmissionKeysFromSnapshot(params.store, [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []]);
	return keys.size > 0 ? keys : void 0;
}
/** Capture live parent owners before dispatch; no protection registry is copied into the worker. */
function captureSessionMaintenancePreservation(storePath) {
	return {
		providerKeys: [...collectSessionMaintenancePreserveKeys() ?? []].toSorted(),
		workIdentities: [...collectActiveSessionWorkAdmissions().get(storePath) ?? []].toSorted(),
		lifecycleIdentities: collectActiveSessionLifecycleMutationIdentities(storePath)
	};
}
/** Collects runtime, active-work, and lifecycle keys protected from automatic maintenance. */
function collectSessionMaintenancePreserveKeysForStore(params) {
	const keys = resolveSessionMaintenancePreserveKeys({
		...params,
		snapshot: captureSessionMaintenancePreservation(params.storePath)
	});
	return keys.size > 0 ? keys : void 0;
}
//#endregion
//#region src/config/sessions/store-maintenance-runtime.ts
function resolveMaintenanceConfig() {
	let maintenance;
	try {
		maintenance = getRuntimeConfig().session?.maintenance;
	} catch {}
	return resolveMaintenanceConfigFromInput(maintenance);
}
//#endregion
//#region src/config/sessions/disk-budget-files.ts
const SESSIONS_DIR_STAT_CONCURRENCY = 8;
async function removeFileIfExists(filePath) {
	const stat = await fs.promises.stat(filePath).catch(() => null);
	if (!stat?.isFile()) return err("not-removed");
	return fs.promises.rm(filePath).then(() => ok(stat.size), () => err("not-removed"));
}
async function removeFileForBudget(params) {
	const resolvedPath = path.resolve(params.filePath);
	const canonicalPath = params.canonicalPath ?? resolveRealpathOrAbsolute(resolvedPath);
	if (params.dryRun) {
		if (params.simulatedRemovedPaths.has(canonicalPath)) return err("not-removed");
		const size = params.fileSizesByPath.get(canonicalPath);
		if (size === void 0) return err("not-removed");
		params.simulatedRemovedPaths.add(canonicalPath);
		params.onRemovedPath?.(canonicalPath);
		return ok(size);
	}
	const removal = await removeFileIfExists(resolvedPath);
	if (removal.ok) params.onRemovedPath?.(canonicalPath);
	return removal;
}
async function readSessionsDirFiles(sessionsDir) {
	const tasks = (await fs.promises.readdir(sessionsDir, { withFileTypes: true }).catch(() => [])).filter((dirent) => dirent.isFile() && !isMigrationArchiveArtifactName(dirent.name)).map((dirent) => async () => {
		const filePath = path.join(sessionsDir, dirent.name);
		const stat = await fs.promises.stat(filePath).catch(() => null);
		if (!stat?.isFile()) return null;
		return {
			path: filePath,
			canonicalPath: resolveRealpathOrAbsolute(filePath),
			name: dirent.name,
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	});
	const { results } = await runTasksWithConcurrency({
		tasks,
		limit: SESSIONS_DIR_STAT_CONCURRENCY
	});
	return results.filter((file) => Boolean(file));
}
async function readSessionPromptBlobFiles(sessionsDir) {
	const root = path.join(sessionsDir, "skills-prompts", "sha256");
	const prefixEntries = await fs.promises.readdir(root, { withFileTypes: true }).catch(() => []);
	const files = [];
	for (const prefixEntry of prefixEntries) {
		if (!prefixEntry.isDirectory() || !/^[a-f0-9]{2}$/u.test(prefixEntry.name)) continue;
		const prefixDir = path.join(root, prefixEntry.name);
		const blobEntries = await fs.promises.readdir(prefixDir, { withFileTypes: true }).catch(() => []);
		for (const blobEntry of blobEntries) {
			if (!blobEntry.isFile() || !/^[a-f0-9]{64}\.txt$/u.test(blobEntry.name) && !isSessionPromptBlobTempArtifactName(blobEntry.name)) continue;
			const filePath = path.join(prefixDir, blobEntry.name);
			const stat = await fs.promises.stat(filePath).catch(() => null);
			if (!stat?.isFile()) continue;
			files.push({
				path: filePath,
				canonicalPath: resolveRealpathOrAbsolute(filePath),
				name: blobEntry.name,
				size: stat.size,
				mtimeMs: stat.mtimeMs
			});
		}
	}
	return files;
}
function isSessionPromptBlobTempArtifactName(name) {
	return /^[a-f0-9]{64}\.txt\.(?:\d+\.)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.tmp$/u.test(name);
}
//#endregion
//#region src/config/sessions/disk-budget-runtime.ts
const measurements = resolveGlobalSingleton(Symbol.for("testclaw.sessionDiskBudgetWorkers"), () => ({
	pool: new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl({
			currentModuleUrl: import.meta.url,
			sourceWorkerName: "disk-budget.worker",
			distWorkerPath: "config/sessions/disk-budget.worker.js"
		}),
		maxWorkers: 1
	}),
	pending: /* @__PURE__ */ new Set()
}), () => drainSessionDiskBudgetWorkers());
/** Join admitted scans before retiring workers; later measurements reuse the pool. */
function drainSessionDiskBudgetWorkers() {
	return measurements.draining ??= Promise.resolve().then(async () => {
		while (measurements.pending.size > 0) await Promise.allSettled(measurements.pending);
		await measurements.pool.rotate();
	}).finally(() => {
		measurements.draining = void 0;
	});
}
/** Measures physical session artifacts without running per-file synchronous work on the caller. */
async function measureSessionPhysicalDiskUsage(storePath) {
	const pending = measurements.pool.run(path.resolve(storePath), {});
	measurements.pending.add(pending);
	try {
		return await pending;
	} finally {
		measurements.pending.delete(pending);
	}
}
//#endregion
//#region src/config/sessions/session-history-archive-pruning-diagnostics.ts
function archivePruningLogFields(diagnostics) {
	const milliseconds = (value) => value === void 0 ? void 0 : Math.round(value);
	return {
		trigger: diagnostics.trigger,
		checkpointCalls: diagnostics.checkpointCalls,
		checkpointIncomplete: diagnostics.checkpointIncomplete,
		checkpoint: diagnostics.checkpoint,
		totalBytesBefore: diagnostics.totalBytesBefore,
		totalBytesAfter: diagnostics.totalBytesAfter,
		walBytesBefore: diagnostics.walBytesBefore,
		walBytesAfter: diagnostics.walBytesAfter,
		checkpointMs: milliseconds(diagnostics.checkpointMs),
		checkpointMaxMs: milliseconds(diagnostics.checkpointMaxMs),
		vacuumMs: milliseconds(diagnostics.vacuumMs),
		vacuumPasses: diagnostics.vacuumPasses,
		vacuumPagesRequested: diagnostics.vacuumPagesRequested,
		queryMs: milliseconds(diagnostics.queryMs),
		rowDeletionMs: milliseconds(diagnostics.rowDeletionMs),
		fileRemovalMs: milliseconds(diagnostics.fileRemovalMs),
		removedFiles: diagnostics.removedFiles,
		missingFiles: diagnostics.missingFiles,
		failedRemovals: diagnostics.failedRemovals,
		measurementMs: milliseconds(diagnostics.measurementMs),
		measurements: diagnostics.measurements,
		legacyInventoryMs: milliseconds(diagnostics.legacyInventoryMs),
		completed: diagnostics.completed === true
	};
}
async function observeSessionArchivePruning(diagnostics, run) {
	const startedAt = performance.now();
	let failed = true;
	try {
		const result = await run();
		failed = false;
		return result;
	} finally {
		const elapsedMs = performance.now() - startedAt;
		if (failed || elapsedMs >= 1e3) try {
			getChildLogger({ subsystem: "session-sqlite" }).warn(failed ? "SQLite session archive pruning failed" : "slow SQLite session archive pruning", {
				elapsedMs: Math.round(elapsedMs),
				archivePruning: archivePruningLogFields(diagnostics)
			});
		} catch {}
	}
}
async function timeArchivePruningAsync(diagnostics, stage, operation) {
	if (!diagnostics) return await operation();
	if (stage === "measurementMs") diagnostics.measurements = (diagnostics.measurements ?? 0) + 1;
	const startedAt = performance.now();
	try {
		return await operation();
	} finally {
		diagnostics[stage] = (diagnostics[stage] ?? 0) + performance.now() - startedAt;
	}
}
//#endregion
//#region src/config/sessions/disk-budget.ts
const NOOP_LOGGER = {
	warn: () => {},
	info: () => {}
};
function measureStoreBytes(store) {
	return Buffer.byteLength(JSON.stringify(store, null, 2), "utf-8");
}
function measureStoreEntryChunkBytes(key, entry) {
	const singleEntryStore = JSON.stringify({ [key]: entry }, null, 2);
	if (!singleEntryStore.startsWith("{\n") || !singleEntryStore.endsWith("\n}")) return measureStoreBytes({ [key]: entry }) - 4;
	const chunk = singleEntryStore.slice(2, -2);
	return Buffer.byteLength(chunk, "utf-8");
}
function buildStoreEntryChunkSizeMap(store) {
	const out = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) out.set(key, measureStoreEntryChunkBytes(key, entry));
	return out;
}
function resolveProjectedPromptBlobHash(entry) {
	const ref = entry?.skillsSnapshot?.promptRef;
	return ref?.algorithm === "sha256" && typeof ref.hash === "string" ? ref.hash : void 0;
}
function buildProjectedPromptBlobRefCounts(store) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of Object.values(store)) {
		const hash = resolveProjectedPromptBlobHash(entry);
		if (!hash) continue;
		counts.set(hash, (counts.get(hash) ?? 0) + 1);
	}
	return counts;
}
function buildSessionIdRefCounts(store) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of Object.values(store)) {
		const sessionId = entry?.sessionId;
		if (!sessionId) continue;
		counts.set(sessionId, (counts.get(sessionId) ?? 0) + 1);
	}
	return counts;
}
function resolveSessionTranscriptPathForEntry(params) {
	if (!params.entry.sessionId) return null;
	try {
		const resolved = resolveSessionFilePathCore(params.entry.sessionId, params.entry, { sessionsDir: params.sessionsDir });
		const resolvedSessionsDir = resolveRealpathOrAbsolute(params.sessionsDir);
		const resolvedPath = resolveRealpathOrAbsolute(resolved);
		const relative = path.relative(resolvedSessionsDir, resolvedPath);
		if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;
		return resolvedPath;
	} catch {
		return null;
	}
}
function resolveSessionArtifactPathsForEntry(params) {
	const transcriptPath = resolveSessionTranscriptPathForEntry(params);
	if (!transcriptPath) return [];
	const paths = [transcriptPath];
	if (params.entry.sessionId) {
		paths.push(resolveTrajectoryPointerFilePath(transcriptPath));
		paths.push(resolveTrajectoryFilePath({
			env: {},
			sessionFile: transcriptPath,
			sessionId: params.entry.sessionId
		}));
	}
	return paths;
}
function resolveSessionArtifactCanonicalPathsForEntry(params) {
	return resolveSessionArtifactPathsForEntry(params).map(resolveRealpathOrAbsolute);
}
function resolveReferencedSessionArtifactPaths(params) {
	const referenced = /* @__PURE__ */ new Set();
	if (!params.files.some((file) => isUnreferencedSessionArtifactFile(file, referenced))) return referenced;
	const resolvedSessionsDir = resolveRealpathOrAbsolute(params.sessionsDir);
	for (const entry of Object.values(params.store)) {
		for (const resolved of resolveSessionArtifactCanonicalPathsForEntry({
			sessionsDir: params.sessionsDir,
			entry
		})) referenced.add(resolved);
		for (const checkpointFile of readLegacyCompactionSnapshotPaths(entry)) {
			const resolvedCheckpointPath = resolveRealpathOrAbsolute(checkpointFile);
			const relative = path.relative(resolvedSessionsDir, resolvedCheckpointPath);
			if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) referenced.add(resolvedCheckpointPath);
		}
	}
	return referenced;
}
async function hasRetainedSessionTranscriptArchives(storePath) {
	return (await readSessionsDirFiles(resolveSessionArtifactDirectory(storePath))).some((file) => isRetainedSessionTranscriptArchiveName(file.name));
}
/** Removes oldest retained archives and legacy compact backups, remeasuring after each file. */
async function pruneSessionTranscriptArchivesToHighWater(params) {
	const { diagnostics } = params;
	const files = await timeArchivePruningAsync(diagnostics, "legacyInventoryMs", async () => (await readSessionsDirFiles(resolveSessionArtifactDirectory(params.storePath))).filter((file) => isRetainedSessionTranscriptArchiveName(file.name)).toSorted((left, right) => left.mtimeMs - right.mtimeMs));
	let usage = await timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	let removedFiles = 0;
	for (const file of files) {
		if (usage.totalBytes <= params.highWaterBytes) break;
		const removal = params.removeFile ? await params.removeFile(file) : (await timeArchivePruningAsync(diagnostics, "fileRemovalMs", () => removeFileIfExists(file.path))).ok ? "removed" : "failed";
		if (removal === "failed") {
			if (diagnostics) diagnostics.failedRemovals = (diagnostics.failedRemovals ?? 0) + 1;
			continue;
		}
		if (removal === "removed") {
			removedFiles += 1;
			if (diagnostics) diagnostics.removedFiles = (diagnostics.removedFiles ?? 0) + 1;
		}
		usage = await timeArchivePruningAsync(diagnostics, "measurementMs", () => measureSessionPhysicalDiskUsage(params.storePath));
	}
	return {
		removedFiles,
		usage
	};
}
function resolvePromptBlobFileHash(file) {
	return /^[a-f0-9]{64}\.txt$/u.test(file.name) ? file.name.slice(0, -4) : void 0;
}
function isUnreferencedSessionArtifactFile(file, referencedPaths) {
	if (referencedPaths.has(file.canonicalPath)) return false;
	return isCompactionCheckpointTranscriptFileName(file.name) || isTrajectorySessionArtifactName(file.name) || isPrimarySessionTranscriptFileName(file.name);
}
const SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS = SESSION_STORE_TEMP_STALE_MS;
function isUnreferencedPromptBlobFileRemovable(file, projectedPromptBlobRefCounts, cutoffMs) {
	if (file.mtimeMs > cutoffMs) return false;
	const hash = resolvePromptBlobFileHash(file);
	return hash ? !projectedPromptBlobRefCounts.has(hash) : false;
}
function isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs, tempCutoffMs) {
	if (isSessionPromptBlobTempArtifactName(file.name)) return file.mtimeMs <= tempCutoffMs;
	return isUnreferencedPromptBlobFileRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs);
}
function isDiskBudgetRemovableSessionFile(file, referencedPaths, tempStaleCutoffMs, storeBasename) {
	if (isSessionStoreTempArtifactName(file.name, storeBasename)) return file.mtimeMs <= tempStaleCutoffMs;
	return isSessionArchiveArtifactName(file.name) || isUnreferencedSessionArtifactFile(file, referencedPaths);
}
async function removePromptBlobFileForBudget(params) {
	let file = params.file;
	if (!params.dryRun) {
		const stat = await fs.promises.stat(file.path).catch(() => null);
		if (!stat?.isFile()) return err("not-removed");
		file = {
			...file,
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	}
	if (!isPromptBlobArtifactRemovable(file, params.projectedPromptBlobRefCounts, params.promptBlobCutoffMs, params.tempCutoffMs)) return err("not-removed");
	return await removeFileForBudget({
		filePath: file.path,
		canonicalPath: file.canonicalPath,
		dryRun: params.dryRun,
		fileSizesByPath: params.fileSizesByPath,
		simulatedRemovedPaths: params.simulatedRemovedPaths,
		onRemovedPath: params.onRemovedPath
	});
}
async function pruneUnreferencedSessionArtifacts(params) {
	const olderThanMs = Number.isFinite(params.olderThanMs) && params.olderThanMs > 0 ? params.olderThanMs : 0;
	const sessionsDir = resolveSessionArtifactDirectory(params.storePath);
	const files = await readSessionsDirFiles(sessionsDir);
	const promptBlobFiles = await readSessionPromptBlobFiles(sessionsDir);
	const fileSizesByPath = new Map([...files, ...promptBlobFiles].map((file) => [file.canonicalPath, file.size]));
	const simulatedRemovedPaths = /* @__PURE__ */ new Set();
	const now = Date.now();
	const cutoffMs = now - olderThanMs;
	const tempCutoffMs = now - SESSION_STORE_TEMP_STALE_MS;
	const promptBlobCutoffMs = now - Math.max(olderThanMs, SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS);
	const referencedPaths = resolveReferencedSessionArtifactPaths({
		files: files.filter((file) => file.mtimeMs <= cutoffMs && !params.excludeCanonicalPaths?.has(file.canonicalPath)),
		sessionsDir,
		store: params.store
	});
	const projectedPromptBlobRefCounts = promptBlobFiles.length > 0 ? buildProjectedPromptBlobRefCounts(projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: params.store
	}).store) : /* @__PURE__ */ new Map();
	const storeBasename = path.basename(params.storePath);
	const removableStoreFiles = files.filter((file) => {
		if (params.excludeCanonicalPaths?.has(file.canonicalPath)) return false;
		if (isSessionStoreTempArtifactName(file.name, storeBasename)) return file.mtimeMs <= tempCutoffMs;
		return file.mtimeMs <= cutoffMs && isUnreferencedSessionArtifactFile(file, referencedPaths);
	});
	const removablePromptBlobFiles = promptBlobFiles.filter((file) => {
		if (params.excludeCanonicalPaths?.has(file.canonicalPath)) return false;
		return isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobCutoffMs, tempCutoffMs);
	});
	const removableFiles = [...removableStoreFiles.map((file) => ({
		kind: "store",
		file
	})), ...removablePromptBlobFiles.map((file) => ({
		kind: "promptBlob",
		file
	}))].filter((file) => {
		return !params.excludeCanonicalPaths?.has(file.file.canonicalPath);
	}).toSorted((a, b) => a.file.mtimeMs - b.file.mtimeMs);
	let removedFiles = 0;
	let freedBytes = 0;
	const dryRun = params.dryRun === true;
	for (const item of removableFiles) {
		const removal = item.kind === "promptBlob" ? await removePromptBlobFileForBudget({
			file: item.file,
			projectedPromptBlobRefCounts,
			promptBlobCutoffMs,
			tempCutoffMs,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths
		}) : await removeFileForBudget({
			filePath: item.file.path,
			canonicalPath: item.file.canonicalPath,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths
		});
		if (!removal.ok) continue;
		removedFiles += 1;
		freedBytes += removal.value;
	}
	return {
		scannedFiles: files.length + promptBlobFiles.length,
		removedFiles,
		freedBytes,
		olderThanMs
	};
}
async function enforceSessionDiskBudget(params) {
	const maxBytes = params.maintenance.maxDiskBytes;
	const highWaterBytes = params.maintenance.highWaterBytes;
	if (maxBytes == null || highWaterBytes == null) return null;
	const log = params.log ?? NOOP_LOGGER;
	const dryRun = params.dryRun === true;
	const sessionsDir = resolveSessionArtifactDirectory(params.storePath);
	const files = await readSessionsDirFiles(sessionsDir);
	const promptBlobFiles = await readSessionPromptBlobFiles(sessionsDir);
	const fileSizesByPath = new Map([...files, ...promptBlobFiles].map((file) => [file.canonicalPath, file.size]));
	const simulatedRemovedPaths = /* @__PURE__ */ new Set();
	const resolvedStorePath = resolveRealpathOrAbsolute(params.storePath);
	const storeFile = files.find((file) => file.canonicalPath === resolvedStorePath);
	const projectedPersistence = projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: params.store
	});
	const projectedStore = projectedPersistence.store;
	let projectedStoreBytes = measureStoreBytes(projectedStore);
	const projectedPromptBlobBytesByHash = /* @__PURE__ */ new Map();
	const existingPromptBlobFilesByHash = /* @__PURE__ */ new Map();
	for (const file of promptBlobFiles) {
		const hash = resolvePromptBlobFileHash(file);
		if (hash) existingPromptBlobFilesByHash.set(hash, file);
	}
	for (const [hash, blob] of projectedPersistence.promptBlobs) if (!existingPromptBlobFilesByHash.has(hash)) projectedPromptBlobBytesByHash.set(hash, blob.ref.bytes);
	const projectedPromptBlobRefCounts = buildProjectedPromptBlobRefCounts(projectedStore);
	const projectedPromptBlobBytes = [...projectedPromptBlobBytesByHash.values()].reduce((sum, bytes) => sum + bytes, 0);
	let total = [...files, ...promptBlobFiles].reduce((sum, file) => sum + file.size, 0) - (storeFile?.size ?? 0) + projectedStoreBytes + projectedPromptBlobBytes;
	const totalBefore = total;
	if (total <= maxBytes) return {
		totalBytesBefore: totalBefore,
		totalBytesAfter: total,
		removedFiles: 0,
		removedEntries: 0,
		freedBytes: 0,
		maxBytes,
		highWaterBytes,
		overBudget: false
	};
	if (params.warnOnly) {
		log.warn("session disk budget exceeded (warn-only mode)", {
			sessionsDir,
			totalBytes: total,
			maxBytes,
			highWaterBytes
		});
		return {
			totalBytesBefore: totalBefore,
			totalBytesAfter: total,
			removedFiles: 0,
			removedEntries: 0,
			freedBytes: 0,
			maxBytes,
			highWaterBytes,
			overBudget: true
		};
	}
	let removedFiles = 0;
	let removedEntries = 0;
	let freedBytes = 0;
	const commitEvictedIndex = params.commitEvictedIndex;
	const referencedPaths = resolveReferencedSessionArtifactPaths({
		files,
		sessionsDir,
		store: params.store
	});
	const tempStaleCutoffMs = Date.now() - SESSION_STORE_TEMP_STALE_MS;
	const promptBlobOrphanCutoffMs = Date.now() - SESSION_PROMPT_BLOB_UNREFERENCED_GRACE_MS;
	const storeBasename = path.basename(params.storePath);
	const unreferencedPromptBlobQueue = promptBlobFiles.filter((file) => {
		return isPromptBlobArtifactRemovable(file, projectedPromptBlobRefCounts, promptBlobOrphanCutoffMs, tempStaleCutoffMs);
	}).toSorted((a, b) => a.mtimeMs - b.mtimeMs);
	for (const file of unreferencedPromptBlobQueue) {
		if (total <= highWaterBytes) break;
		const removal = await removePromptBlobFileForBudget({
			file,
			projectedPromptBlobRefCounts,
			promptBlobCutoffMs: promptBlobOrphanCutoffMs,
			tempCutoffMs: tempStaleCutoffMs,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths,
			onRemovedPath: params.onRemoveFile
		});
		if (!removal.ok) continue;
		total -= removal.value;
		freedBytes += removal.value;
		removedFiles += 1;
	}
	const removableFileQueue = files.filter((file) => isDiskBudgetRemovableSessionFile(file, referencedPaths, tempStaleCutoffMs, storeBasename)).toSorted((a, b) => a.mtimeMs - b.mtimeMs);
	for (const file of removableFileQueue) {
		if (total <= highWaterBytes) break;
		const removal = await removeFileForBudget({
			filePath: file.path,
			canonicalPath: file.canonicalPath,
			dryRun,
			fileSizesByPath,
			simulatedRemovedPaths,
			onRemovedPath: params.onRemoveFile
		});
		if (!removal.ok) continue;
		total -= removal.value;
		freedBytes += removal.value;
		removedFiles += 1;
	}
	if (total > highWaterBytes) {
		const activeSessionKey = normalizeOptionalLowercaseString(params.activeSessionKey);
		const sessionIdRefCounts = buildSessionIdRefCounts(params.store);
		const entryChunkBytesByKey = buildStoreEntryChunkSizeMap(projectedStore);
		const keys = Object.keys(params.store).filter((key) => isSessionEntryDiskBudgetEvictable({
			key,
			entry: params.store[key],
			preserveKeys: params.preserveKeys,
			preserveRecentMs: params.maintenance.preserveRecentMs
		})).toSorted((a, b) => (params.store[a]?.archivedAt ?? Number.POSITIVE_INFINITY) - (params.store[b]?.archivedAt ?? Number.POSITIVE_INFINITY) || a.localeCompare(b));
		for (const key of keys) {
			if (total <= highWaterBytes) break;
			if (activeSessionKey && normalizeLowercaseStringOrEmpty(key) === activeSessionKey) continue;
			const entry = params.store[key];
			if (!entry) continue;
			const previousProjectedBytes = projectedStoreBytes;
			const projectedEntry = projectedStore[key];
			const promptBlobHash = resolveProjectedPromptBlobHash(projectedEntry);
			delete params.store[key];
			delete projectedStore[key];
			const chunkBytes = entryChunkBytesByKey.get(key);
			entryChunkBytesByKey.delete(key);
			if (typeof chunkBytes === "number" && Number.isFinite(chunkBytes) && chunkBytes >= 0) projectedStoreBytes = Math.max(2, projectedStoreBytes - (chunkBytes + 2));
			else projectedStoreBytes = measureStoreBytes(projectedStore);
			total += projectedStoreBytes - previousProjectedBytes;
			removedEntries += 1;
			if (!dryRun && commitEvictedIndex) {
				await commitEvictedIndex();
				if (projectedPromptBlobBytesByHash.size > 0) for (const file of await readSessionPromptBlobFiles(sessionsDir)) {
					const hash = resolvePromptBlobFileHash(file);
					if (hash && projectedPromptBlobBytesByHash.delete(hash)) existingPromptBlobFilesByHash.set(hash, file);
				}
			}
			if (promptBlobHash) {
				const nextRefCount = (projectedPromptBlobRefCounts.get(promptBlobHash) ?? 1) - 1;
				if (nextRefCount > 0) projectedPromptBlobRefCounts.set(promptBlobHash, nextRefCount);
				else {
					projectedPromptBlobRefCounts.delete(promptBlobHash);
					const virtualBlobBytes = projectedPromptBlobBytesByHash.get(promptBlobHash) ?? 0;
					if (virtualBlobBytes > 0) {
						total -= virtualBlobBytes;
						projectedPromptBlobBytesByHash.delete(promptBlobHash);
					} else {
						const blobFile = existingPromptBlobFilesByHash.get(promptBlobHash);
						if (blobFile && (dryRun || commitEvictedIndex)) {
							const removal = await removePromptBlobFileForBudget({
								file: blobFile,
								projectedPromptBlobRefCounts,
								promptBlobCutoffMs: promptBlobOrphanCutoffMs,
								tempCutoffMs: tempStaleCutoffMs,
								dryRun,
								fileSizesByPath,
								simulatedRemovedPaths,
								onRemovedPath: dryRun ? void 0 : params.onRemoveFile
							});
							if (removal.ok) {
								total -= removal.value;
								freedBytes += removal.value;
								removedFiles += 1;
							}
						}
					}
				}
			}
			const sessionId = entry.sessionId;
			if (!sessionId) continue;
			const nextRefCount = (sessionIdRefCounts.get(sessionId) ?? 1) - 1;
			if (nextRefCount > 0) {
				sessionIdRefCounts.set(sessionId, nextRefCount);
				continue;
			}
			sessionIdRefCounts.delete(sessionId);
			if (!dryRun && !commitEvictedIndex) continue;
			for (const artifactPath of resolveSessionArtifactPathsForEntry({
				sessionsDir,
				entry
			})) {
				const removal = await removeFileForBudget({
					filePath: artifactPath,
					dryRun,
					fileSizesByPath,
					simulatedRemovedPaths,
					onRemovedPath: dryRun ? void 0 : params.onRemoveFile
				});
				if (!removal.ok) continue;
				total -= removal.value;
				freedBytes += removal.value;
				removedFiles += 1;
			}
		}
	}
	if (!dryRun) {
		if (total > highWaterBytes) log.warn("session disk budget still above high-water target after cleanup", {
			sessionsDir,
			totalBytes: total,
			maxBytes,
			highWaterBytes,
			removedFiles,
			removedEntries
		});
		else if (removedFiles > 0 || removedEntries > 0) log.info("applied session disk budget cleanup", {
			sessionsDir,
			totalBytesBefore: totalBefore,
			totalBytesAfter: total,
			maxBytes,
			highWaterBytes,
			removedFiles,
			removedEntries
		});
	}
	return {
		totalBytesBefore: totalBefore,
		totalBytesAfter: total,
		removedFiles,
		removedEntries,
		freedBytes,
		maxBytes,
		highWaterBytes,
		overBudget: true
	};
}
//#endregion
export { resolveSessionArtifactCanonicalPathsForEntry as a, measureSessionPhysicalDiskUsage as c, collectActiveSessionWorkAdmissionKeys as d, collectSessionMaintenancePreserveKeysForStore as f, planSessionEntryMaintenance as h, pruneUnreferencedSessionArtifacts as i, resolveMaintenanceConfig as l, resolveSessionMaintenancePreserveKeys as m, hasRetainedSessionTranscriptArchives as n, observeSessionArchivePruning as o, registerSessionMaintenancePreserveKeysProvider as p, pruneSessionTranscriptArchivesToHighWater as r, timeArchivePruningAsync as s, enforceSessionDiskBudget as t, captureSessionMaintenancePreservation as u };
