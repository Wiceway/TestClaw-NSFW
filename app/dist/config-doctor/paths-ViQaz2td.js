import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { P as timestampMsToIsoFileStamp } from "./number-coercion-0M4tZV2c.js";
import { i as resolveRequiredHomeDir, t as expandHomePrefix } from "./home-dir-DjuHbd5R.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { o as safeRealpathSync } from "./boundary-path-BBHaqzpY.js";
import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { r as isIncognitoSessionKey } from "./session-key-C0UQClgw.js";
import { c as resolveAgentIdFromSessionKey } from "./session-key-AvQIavYt.js";
import { n as resolvePreferredAssistantTmpDir } from "./tmp-testclaw-dir-B_iJhgq7.js";
import { i as resolveIncognitoAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { t as resolveZstdCodec } from "./zstd-codec-C-vEb3Qf.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/config/sessions/archive-compression.ts
const SESSION_ARCHIVE_ZSTD_SUFFIX = ".zst";
const zstdCodec = resolveZstdCodec();
/** Strips the optional zstd suffix so archive name parsers see one shape. */
function stripSessionArchiveCompressionSuffix(fileName) {
	return fileName.endsWith(".zst") ? fileName.slice(0, -4) : fileName;
}
/** Compresses archive content when the runtime supports zstd. */
function encodeSessionArchiveContent(content) {
	const plain = Buffer.from(content, "utf8");
	if (!zstdCodec || plain.length === 0) return {
		bytes: plain,
		suffix: ""
	};
	return {
		bytes: zstdCodec.compress(plain),
		suffix: SESSION_ARCHIVE_ZSTD_SUFFIX
	};
}
/** Reads an archived transcript, transparently decompressing zstd artifacts. */
function readSessionArchiveContentSync(filePath) {
	if (!filePath.endsWith(".zst")) return fs.readFileSync(filePath, "utf8");
	if (!zstdCodec) throw new Error(`Cannot read compressed transcript archive ${filePath}: this runtime lacks node:zlib zstd support`);
	return zstdCodec.decompress(fs.readFileSync(filePath)).toString("utf8");
}
/** Decodes staged archive bytes using the source archive's codec. */
function decodeSessionArchiveBytes(bytes, compressed) {
	if (!compressed) return Buffer.from(bytes).toString("utf8");
	if (!zstdCodec) throw new Error("Cannot decode compressed transcript archive: this runtime lacks zstd support");
	return zstdCodec.decompress(Buffer.from(bytes)).toString("utf8");
}
/**
* Materializes a compressed archive as a plain JSONL cache file and returns
* the readable path; plain archives pass through untouched. Archives are
* write-once (timestamped names), so a cache hit never needs revalidation —
* this lets every downstream transcript reader (index, tail chunks, header
* probes) work on archives without learning about compression.
*/
function materializeSessionArchiveForRead(filePath) {
	if (!filePath.endsWith(".zst")) return filePath;
	const cacheDir = path.join(resolvePreferredAssistantTmpDir(), "session-archive-read-cache");
	const pathKey = createHash("sha256").update(filePath).digest("hex").slice(0, 32);
	let sourceStat;
	try {
		sourceStat = fs.statSync(filePath);
	} catch (error) {
		removeMaterializedArchiveCacheEntries(cacheDir, pathKey);
		throw error;
	}
	const cachePath = path.join(cacheDir, `${pathKey}-${sourceStat.size}-${Math.trunc(sourceStat.mtimeMs)}.jsonl`);
	sweepMaterializedArchiveCache(cacheDir);
	if (fs.existsSync(cachePath)) return cachePath;
	const content = readSessionArchiveContentSync(filePath);
	removeMaterializedArchiveCacheEntries(cacheDir, pathKey, path.basename(cachePath));
	fs.mkdirSync(cacheDir, {
		recursive: true,
		mode: 448
	});
	const tempPath = `${cachePath}.${process.pid}.${randomUUID()}.tmp`;
	fs.writeFileSync(tempPath, content, {
		encoding: "utf8",
		mode: 384
	});
	fs.renameSync(tempPath, cachePath);
	return cachePath;
}
const MATERIALIZED_ARCHIVE_CACHE_TTL_MS = 864e5;
let lastMaterializedArchiveCacheSweepMs = 0;
function sweepMaterializedArchiveCache(cacheDir) {
	const now = Date.now();
	if (now - lastMaterializedArchiveCacheSweepMs < MATERIALIZED_ARCHIVE_CACHE_TTL_MS / 24) return;
	lastMaterializedArchiveCacheSweepMs = now;
	let entries;
	try {
		entries = fs.readdirSync(cacheDir);
	} catch {
		return;
	}
	for (const entry of entries) {
		const entryPath = path.join(cacheDir, entry);
		try {
			if (now - fs.statSync(entryPath).mtimeMs > MATERIALIZED_ARCHIVE_CACHE_TTL_MS) fs.rmSync(entryPath, { force: true });
		} catch {}
	}
}
function removeMaterializedArchiveCacheEntries(cacheDir, pathKey, keepName) {
	let entries;
	try {
		entries = fs.readdirSync(cacheDir);
	} catch {
		return;
	}
	for (const entry of entries) {
		if (!entry.startsWith(`${pathKey}-`) || entry === keepName || entry.endsWith(".tmp")) continue;
		fs.rmSync(path.join(cacheDir, entry), { force: true });
	}
}
//#endregion
//#region src/config/sessions/artifacts.ts
const ARCHIVE_SUFFIX_RE = /^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}(?:\.\d{3})?Z)(?:\.([0-9a-f]{32}))?$/;
const LEGACY_STORE_BACKUP_RE = /^sessions\.json\.bak\.\d+$/;
const PRE_DOCTOR_REPAIR_RE = /\.jsonl\.pre-doctor-(?:branch|openai-codex)-repair-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.bak$/u;
const MIGRATION_ARCHIVE_RE = /\.migrated(?:\.\d+)?$/u;
const COMPACTION_CHECKPOINT_TRANSCRIPT_RE = /^(.+)\.checkpoint\.([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.jsonl$/i;
function hasArchiveSuffix(fileName, reason) {
	const marker = `.${reason}.`;
	const normalized = stripSessionArchiveCompressionSuffix(fileName);
	const index = normalized.lastIndexOf(marker);
	if (index < 0) return false;
	const raw = normalized.slice(index + marker.length);
	return ARCHIVE_SUFFIX_RE.test(raw);
}
/** Returns true for archived session artifacts and legacy store backup names. */
function isSessionArchiveArtifactName(fileName) {
	if (LEGACY_STORE_BACKUP_RE.test(fileName)) return true;
	return hasArchiveSuffix(fileName, "deleted") || hasArchiveSuffix(fileName, "reset") || hasArchiveSuffix(fileName, "bak");
}
/** Returns true for retained archives and disposable legacy compact backups pruned at high water. */
function isRetainedSessionTranscriptArchiveName(fileName) {
	return hasArchiveSuffix(fileName, "deleted") || hasArchiveSuffix(fileName, "reset") || hasArchiveSuffix(fileName, "bak");
}
/** Returns true for migration rollback archives retained beside their legacy source. */
function isMigrationArchiveArtifactName(fileName) {
	return MIGRATION_ARCHIVE_RE.test(fileName) || PRE_DOCTOR_REPAIR_RE.test(fileName);
}
const SESSION_STORE_TEMP_RE_CACHE = /* @__PURE__ */ new Map();
const SESSION_STORE_TEMP_STALE_MS = 3e5;
function sessionStoreTempPattern(storeBasename) {
	let pattern = SESSION_STORE_TEMP_RE_CACHE.get(storeBasename);
	if (!pattern) {
		pattern = new RegExp(`^${escapeRegExp(storeBasename)}\\.(?:\\d+\\.)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.tmp$`, "i");
		SESSION_STORE_TEMP_RE_CACHE.set(storeBasename, pattern);
	}
	return pattern;
}
function isSessionStoreTempArtifactName(fileName, storeBasename) {
	if (!storeBasename) return false;
	return sessionStoreTempPattern(storeBasename).test(fileName);
}
/** Parses a compaction checkpoint transcript filename into session/checkpoint ids. */
function parseCompactionCheckpointTranscriptFileName(fileName) {
	const match = COMPACTION_CHECKPOINT_TRANSCRIPT_RE.exec(fileName);
	const sessionId = match?.[1];
	const checkpointId = match?.[2];
	return sessionId && checkpointId ? {
		sessionId,
		checkpointId
	} : null;
}
/** Returns true when a filename is a compaction checkpoint transcript. */
function isCompactionCheckpointTranscriptFileName(fileName) {
	return parseCompactionCheckpointTranscriptFileName(fileName) !== null;
}
/** Returns true for trajectory runtime jsonl artifacts. */
function isTrajectoryRuntimeArtifactName(fileName) {
	return fileName.endsWith(".trajectory.jsonl");
}
/** Returns true for trajectory pointer artifacts. */
function isTrajectoryPointerArtifactName(fileName) {
	return fileName.endsWith(".trajectory-path.json");
}
function resolveTrajectoryPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory.jsonl` : void 0;
}
function resolveTrajectoryPointerPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory-path.json` : void 0;
}
/** Returns true for any trajectory-related session artifact. */
function isTrajectorySessionArtifactName(fileName) {
	return isTrajectoryRuntimeArtifactName(fileName) || isTrajectoryPointerArtifactName(fileName);
}
/** Returns true for primary session transcript files that represent live session history. */
function isPrimarySessionTranscriptFileName(fileName) {
	if (fileName === "sessions.json") return false;
	if (!fileName.endsWith(".jsonl")) return false;
	if (isTrajectoryRuntimeArtifactName(fileName)) return false;
	if (isCompactionCheckpointTranscriptFileName(fileName)) return false;
	return !isSessionArchiveArtifactName(fileName);
}
/** Formats an archive timestamp that is safe for filenames. */
function formatSessionArchiveTimestamp(nowMs = Date.now()) {
	return timestampMsToIsoFileStamp(nowMs);
}
function restoreSessionArchiveTimestamp(raw) {
	const [datePart, timePart] = raw.split("T");
	if (!datePart || !timePart) return raw;
	return `${datePart}T${timePart.replace(/-/g, ":")}`;
}
function parseSessionArchiveTimestamp(fileName, reason) {
	const marker = `.${reason}.`;
	const normalized = stripSessionArchiveCompressionSuffix(fileName);
	const index = normalized.lastIndexOf(marker);
	if (index < 0) return null;
	const raw = normalized.slice(index + marker.length);
	if (!raw) return null;
	const timestampRaw = ARCHIVE_SUFFIX_RE.exec(raw)?.[1];
	if (!timestampRaw) return null;
	const timestamp = Date.parse(restoreSessionArchiveTimestamp(timestampRaw));
	return Number.isNaN(timestamp) ? null : timestamp;
}
//#endregion
//#region src/config/sessions/paths.ts
/** Incognito key identity takes precedence over an explicit durable store path. */
function resolveExplicitSessionStorePathForScope(scope) {
	if (isIncognitoSessionKey(scope.sessionKey)) return resolveIncognitoAssistantAgentSqlitePath({
		agentId: resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env
	});
	return scope.storePath || void 0;
}
function resolveConcreteSessionStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === MULTI_STORE_PATH_SENTINEL || trimmed.includes("{agentId}")) return;
	return trimmed;
}
function resolveAgentSessionsDir(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	if (!agentId?.trim()) throw new Error("Session storage path requires an explicit agent id.");
	const root = resolveStateDir(env, homedir);
	const id = normalizeAgentId(agentId);
	return path.join(root, "agents", id, "sessions");
}
function resolveSessionTranscriptsDirForAgent(agentId, env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	return resolveAgentSessionsDir(agentId, env, homedir);
}
function resolveDefaultSessionStorePath(agentId) {
	return path.join(resolveAgentSessionsDir(agentId), "sessions.json");
}
/** Store selectors and explicit databases share the owning agent's session artifact directory. */
function resolveSessionArtifactDirectory(storePath) {
	const storeDir = path.dirname(storePath);
	return path.basename(storeDir) === "agent" ? path.join(path.dirname(storeDir), "sessions") : storeDir;
}
const MULTI_STORE_PATH_SENTINEL = "(multiple)";
const SQLITE_TRANSCRIPT_TARGET_PREFIX = "sqlite:";
function resolveSessionFilePathOptions(params) {
	const agentId = params.agentId?.trim();
	const storePath = params.storePath?.trim();
	if (storePath && storePath !== MULTI_STORE_PATH_SENTINEL) {
		const sessionsDir = path.dirname(path.resolve(storePath));
		return agentId ? {
			sessionsDir,
			agentId
		} : { sessionsDir };
	}
	if (agentId) return { agentId };
}
const SAFE_SESSION_ID_RE = /^[\p{L}\p{N}][\p{L}\p{N}\p{M}._-]{0,127}$/u;
function validateSessionId(sessionId) {
	const trimmed = sessionId.trim();
	if (trimmed !== trimmed.normalize("NFC") || !SAFE_SESSION_ID_RE.test(trimmed) || Buffer.byteLength(`${trimmed}.jsonl`, "utf8") > 255 || isCompactionCheckpointTranscriptFileName(`${trimmed}.jsonl`)) throw new Error(`Invalid session ID: ${sessionId}`);
	return trimmed;
}
function resolveSessionsDir(opts) {
	const sessionsDir = opts?.sessionsDir?.trim();
	if (sessionsDir) return path.resolve(sessionsDir);
	if (!opts?.agentId?.trim()) throw new Error("Session storage path requires an explicit agent id.");
	return resolveAgentSessionsDir(opts.agentId);
}
function resolvePathFromAgentSessionsDir(agentSessionsDir, candidateAbsPath) {
	const agentBase = safeRealpathSync(path.resolve(agentSessionsDir)) ?? path.resolve(agentSessionsDir);
	const realCandidate = safeRealpathSync(candidateAbsPath) ?? candidateAbsPath;
	const relative = path.relative(agentBase, realCandidate);
	if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return resolveRerootedSessionPath(agentBase, candidateAbsPath);
	return path.resolve(agentBase, relative);
}
function resolveRerootedSessionPath(agentSessionsDir, candidateAbsPath) {
	const parsed = resolveAgentSessionsPathParts(candidateAbsPath);
	if (!parsed) return;
	const relativeSegments = parsed.parts.slice(parsed.sessionsIndex + 1);
	if (relativeSegments.length === 0) return;
	const rerooted = path.resolve(agentSessionsDir, ...relativeSegments);
	const contained = path.relative(agentSessionsDir, rerooted);
	if (!contained || contained.startsWith("..") || path.isAbsolute(contained)) return;
	return fs.existsSync(rerooted) ? rerooted : void 0;
}
function resolveSiblingAgentSessionsDir(baseSessionsDir, agentId) {
	const resolvedBase = path.resolve(baseSessionsDir);
	if (path.basename(resolvedBase) !== "sessions") return;
	const baseAgentDir = path.dirname(resolvedBase);
	const baseAgentsDir = path.dirname(baseAgentDir);
	if (path.basename(baseAgentsDir) !== "agents") return;
	const rootDir = path.dirname(baseAgentsDir);
	return path.join(rootDir, "agents", normalizeAgentId(agentId), "sessions");
}
function resolveAgentSessionsPathParts(candidateAbsPath) {
	const parts = path.normalize(path.resolve(candidateAbsPath)).split(path.sep).filter(Boolean);
	const sessionsIndex = parts.lastIndexOf("sessions");
	if (sessionsIndex < 2 || parts[sessionsIndex - 2] !== "agents") return null;
	return {
		parts,
		sessionsIndex
	};
}
function extractAgentIdFromAbsoluteSessionPath(candidateAbsPath) {
	const parsed = resolveAgentSessionsPathParts(candidateAbsPath);
	if (!parsed) return;
	const { parts, sessionsIndex } = parsed;
	return parts[sessionsIndex - 1] || void 0;
}
function resolveStructuralSessionFallbackPath(candidateAbsPath, expectedAgentId) {
	const parsed = resolveAgentSessionsPathParts(candidateAbsPath);
	if (!parsed) return;
	const { parts, sessionsIndex } = parsed;
	const agentIdPart = parts[sessionsIndex - 1];
	if (!agentIdPart) return;
	const normalizedAgentId = normalizeAgentId(agentIdPart);
	if (normalizedAgentId !== normalizeLowercaseStringOrEmpty(agentIdPart)) return;
	if (normalizedAgentId !== normalizeAgentId(expectedAgentId)) return;
	const relativeSegments = parts.slice(sessionsIndex + 1);
	if (relativeSegments.length !== 1) return;
	const fileName = relativeSegments[0];
	if (!fileName || fileName === "." || fileName === "..") return;
	return path.normalize(path.resolve(candidateAbsPath));
}
function resolvePathWithinSessionsDir(sessionsDir, candidate, opts) {
	const trimmed = candidate.trim();
	if (!trimmed) throw new Error("Session file path must not be empty");
	const resolvedBase = path.resolve(sessionsDir);
	const realBase = safeRealpathSync(resolvedBase) ?? resolvedBase;
	const realTrimmed = path.isAbsolute(trimmed) ? safeRealpathSync(trimmed) ?? trimmed : trimmed;
	const normalized = path.isAbsolute(realTrimmed) ? path.relative(realBase, realTrimmed) : realTrimmed;
	if (normalized.startsWith("..") && path.isAbsolute(realTrimmed)) {
		const tryAgentFallback = (agentId) => {
			const normalizedAgentId = normalizeAgentId(agentId);
			const siblingSessionsDir = resolveSiblingAgentSessionsDir(realBase, normalizedAgentId);
			if (siblingSessionsDir) {
				const siblingResolved = resolvePathFromAgentSessionsDir(siblingSessionsDir, realTrimmed);
				if (siblingResolved) return siblingResolved;
			}
			return resolvePathFromAgentSessionsDir(resolveAgentSessionsDir(normalizedAgentId), realTrimmed);
		};
		const explicitAgentId = opts?.agentId?.trim();
		if (explicitAgentId) {
			const resolvedFromAgent = tryAgentFallback(explicitAgentId);
			if (resolvedFromAgent) return resolvedFromAgent;
		}
		const extractedAgentId = extractAgentIdFromAbsoluteSessionPath(realTrimmed);
		if (extractedAgentId) {
			const resolvedFromPath = tryAgentFallback(extractedAgentId);
			if (resolvedFromPath) return resolvedFromPath;
			const structuralFallback = resolveStructuralSessionFallbackPath(realTrimmed, extractedAgentId);
			if (structuralFallback) return structuralFallback;
		}
	}
	if (!normalized || normalized.startsWith("..") || path.isAbsolute(normalized)) throw new Error("Session file path must be within sessions directory");
	return path.resolve(realBase, normalized);
}
function resolveSessionTranscriptPathInDir(sessionId, sessionsDir, topicId) {
	const safeSessionId = validateSessionId(sessionId);
	const safeTopicId = typeof topicId === "string" ? encodeURIComponent(topicId) : typeof topicId === "number" ? String(topicId) : void 0;
	const fileName = safeTopicId !== void 0 ? `${safeSessionId}-topic-${safeTopicId}.jsonl` : `${safeSessionId}.jsonl`;
	if (Buffer.byteLength(fileName, "utf8") > 255) throw new Error(`Invalid session transcript filename: ${fileName}`);
	return resolvePathWithinSessionsDir(sessionsDir, fileName);
}
function resolveSessionTranscriptPath(sessionId, agentId, topicId) {
	return resolveSessionTranscriptPathInDir(sessionId, resolveAgentSessionsDir(agentId), topicId);
}
function resolveSessionFilePathCore(sessionId, entry, opts) {
	const sessionsDir = resolveSessionsDir(opts);
	const candidate = entry && "sessionFile" in entry && typeof entry.sessionFile === "string" ? entry.sessionFile.trim() : void 0;
	if (candidate) {
		if (candidate.startsWith(SQLITE_TRANSCRIPT_TARGET_PREFIX)) return candidate;
		try {
			return resolvePathWithinSessionsDir(sessionsDir, candidate, { agentId: opts?.agentId });
		} catch {}
	}
	return resolveSessionTranscriptPathInDir(sessionId, sessionsDir);
}
var SessionStoreAgentIdRequiredError = class extends Error {
	constructor() {
		super("Session store path requires an explicit agent id.");
		this.name = "SessionStoreAgentIdRequiredError";
	}
};
/** Resolves fixed literal paths without an owner; derived or templated paths require agentId. */
function resolveSessionStorePathCore(store, opts) {
	const env = opts?.env ?? process.env;
	const homedir = () => resolveRequiredHomeDir(env, os.homedir);
	if (!store) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		return path.join(resolveAgentSessionsDir(agentId, env, homedir), "sessions.json");
	}
	if (store.includes("{agentId}")) {
		if (!opts?.agentId?.trim()) throw new SessionStoreAgentIdRequiredError();
		const agentId = normalizeAgentId(opts.agentId);
		const expanded = store.replaceAll("{agentId}", agentId);
		if (expanded.startsWith("~")) return path.resolve(expandHomePrefix(expanded, {
			home: resolveRequiredHomeDir(env, homedir),
			env,
			homedir
		}));
		return path.resolve(expanded);
	}
	if (store.startsWith("~")) return path.resolve(expandHomePrefix(store, {
		home: resolveRequiredHomeDir(env, homedir),
		env,
		homedir
	}));
	return path.resolve(store);
}
function resolveAgentsDirFromSessionStorePath(storePath) {
	const candidateAbsPath = path.resolve(storePath);
	if (path.basename(candidateAbsPath) !== "sessions.json") return;
	const sessionsDir = path.dirname(candidateAbsPath);
	if (path.basename(sessionsDir) !== "sessions") return;
	const agentDir = path.dirname(sessionsDir);
	const agentsDir = path.dirname(agentDir);
	if (path.basename(agentsDir) !== "agents") return;
	return agentsDir;
}
//#endregion
export { readSessionArchiveContentSync as A, parseSessionArchiveTimestamp as C, decodeSessionArchiveBytes as D, SESSION_ARCHIVE_ZSTD_SUFFIX as E, encodeSessionArchiveContent as O, isTrajectorySessionArtifactName as S, resolveTrajectoryPointerPath as T, isMigrationArchiveArtifactName as _, resolveExplicitSessionStorePathForScope as a, isSessionArchiveArtifactName as b, resolveSessionFilePathOptions as c, resolveSessionTranscriptPathInDir as d, resolveSessionTranscriptsDirForAgent as f, isCompactionCheckpointTranscriptFileName as g, formatSessionArchiveTimestamp as h, resolveDefaultSessionStorePath as i, materializeSessionArchiveForRead as k, resolveSessionStorePathCore as l, SESSION_STORE_TEMP_STALE_MS as m, resolveAgentsDirFromSessionStorePath as n, resolveSessionArtifactDirectory as o, validateSessionId as p, resolveConcreteSessionStorePath as r, resolveSessionFilePathCore as s, SessionStoreAgentIdRequiredError as t, resolveSessionTranscriptPath as u, isPrimarySessionTranscriptFileName as v, resolveTrajectoryPath as w, isSessionStoreTempArtifactName as x, isRetainedSessionTranscriptArchiveName as y };
