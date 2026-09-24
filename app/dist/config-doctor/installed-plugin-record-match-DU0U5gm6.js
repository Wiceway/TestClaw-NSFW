import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-AulM0PZ6.js";
import { a as normalizeWindowsPathForComparison, n as isNotFoundPathError } from "./path-guards-D465IUx2.js";
import { f as getProcessPluginCache, o as getPluginCache, v as preparePluginCacheFact } from "./plugin-cache-CsUjLuei.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import "./utils-BfoJTy8l.js";
import { t as isPathInside } from "./path-safety-xYU8Js1N.js";
import { l as pluginCacheRealpathSync } from "./package-manifest-DmftnIsu.js";
import { _ as redactSensitiveText } from "./redact-myZeUWr_.js";
import { n as compareValidSemver } from "./semver-BiH_OTew.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { O as union, T as string, b as object, d as array, f as boolean, g as literal, y as number } from "./schemas-D6YHSiZI.js";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-Dj6kLnap.js";
import { a as readPluginMetadataStateRow, c as readPluginMetadataStateRowsSync, i as readBundledDiscoveryModeMemoized, o as INSTALLED_PLUGIN_INDEX_STATE_KEY, r as readBundledDiscoveryMode, s as readPluginMetadataStateRowSync } from "./bundled-discovery-state-DLgcGE7d.js";
import { S as isPluginCandidateInstallOwnerAmbiguous, w as resolvePluginCandidateInstallOwner } from "./discovery-2wVyQ2Ni.js";
import { u as tryReadJsonSync } from "./json-files-DAp75qfY.js";
import { i as isPrereleaseResolutionAllowed, o as parseRegistryNpmSpec } from "./npm-registry-spec-CfnkP6Wa.js";
import { h as validatePluginId, p as resolvePluginNpmProjectsDir, r as isPluginNpmProjectDir, s as resolveDefaultPluginNpmDir } from "./install-paths--_w6GXvW.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { c as listManagedPluginNpmProjectRootsSync, o as resolveRetainedManagedNpmInstallPackageInfo, r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-Yaww9waZ.js";
import { i as isTrustedOfficialPluginInstallRecord } from "./official-external-install-records-B1d0ysfv.js";
import fs from "node:fs";
import path from "node:path";
//#region src/config/zod-schema.installs.ts
const InstallSourceSchema = union([
	literal("npm"),
	literal("archive"),
	literal("path"),
	literal("clawhub"),
	literal("git")
]);
const PluginInstallSourceSchema = union([InstallSourceSchema, literal("marketplace")]);
/** Zod object shape for persisted generic install records. */
const InstallRecordShape = {
	source: InstallSourceSchema,
	spec: string().optional(),
	sourcePath: string().optional(),
	installPath: string().optional(),
	version: string().optional(),
	resolvedName: string().optional(),
	resolvedVersion: string().optional(),
	resolvedSpec: string().optional(),
	integrity: string().optional(),
	shasum: string().optional(),
	resolvedAt: string().optional(),
	installedAt: string().optional(),
	clawhubUrl: string().optional(),
	clawhubPackage: string().optional(),
	clawhubFamily: union([literal("code-plugin"), literal("bundle-plugin")]).optional(),
	clawhubChannel: union([
		literal("official"),
		literal("community"),
		literal("private")
	]).optional(),
	clawhubTrustDisposition: union([
		literal("clean"),
		literal("review-recommended"),
		literal("review-required"),
		literal("blocked")
	]).optional(),
	clawhubTrustScanStatus: string().optional(),
	clawhubTrustModerationState: string().optional(),
	clawhubTrustReasons: array(string()).optional(),
	clawhubTrustPending: boolean().optional(),
	clawhubTrustStale: boolean().optional(),
	clawhubTrustCheckedAt: string().optional(),
	clawhubTrustAcknowledgedAt: string().optional(),
	artifactKind: union([literal("legacy-zip"), literal("npm-pack")]).optional(),
	artifactFormat: union([literal("zip"), literal("tgz")]).optional(),
	npmIntegrity: string().optional(),
	npmShasum: string().optional(),
	npmTarballName: string().optional(),
	clawpackSha256: string().optional(),
	clawpackSpecVersion: number().int().nonnegative().optional(),
	clawpackManifestSha256: string().optional(),
	clawpackSize: number().int().nonnegative().optional(),
	gitUrl: string().optional(),
	gitRef: string().optional(),
	gitCommit: string().optional()
};
object(InstallRecordShape);
const PluginInstallRecordShape = {
	...InstallRecordShape,
	source: PluginInstallSourceSchema,
	marketplaceName: string().optional(),
	marketplaceSource: string().optional(),
	marketplacePlugin: string().optional(),
	acceptedSurface: object({
		channels: array(string().min(1)),
		providers: array(string().min(1)),
		tools: array(string().min(1)),
		contracts: array(string().min(1)),
		hooks: array(string().min(1)),
		mcpServers: array(string().min(1)),
		cliCommands: array(string().min(1)),
		cliBackends: array(string().min(1)),
		skills: array(string().min(1)),
		dangerousConfigFlags: array(string().min(1))
	}).strict().optional(),
	acceptedSurfaceHash: string().optional(),
	acceptedSurfaceAt: string().optional(),
	acceptedSurfaceIntegrity: string().optional()
};
//#endregion
//#region src/config/plugin-install-record-map.ts
const PluginInstallRecordSchema = object(PluginInstallRecordShape).passthrough();
const NORMALIZED_STRING_FIELDS = [
	"spec",
	"sourcePath",
	"installPath",
	"version",
	"resolvedName",
	"resolvedVersion",
	"resolvedSpec",
	"integrity",
	"shasum",
	"resolvedAt",
	"installedAt",
	"clawhubUrl",
	"clawhubPackage",
	"clawhubFamily",
	"clawhubChannel",
	"clawhubTrustDisposition",
	"clawhubTrustScanStatus",
	"clawhubTrustModerationState",
	"clawhubTrustCheckedAt",
	"clawhubTrustAcknowledgedAt",
	"artifactKind",
	"artifactFormat",
	"npmIntegrity",
	"npmShasum",
	"npmTarballName",
	"clawpackSha256",
	"clawpackManifestSha256",
	"gitUrl",
	"gitRef",
	"gitCommit",
	"marketplaceName",
	"marketplaceSource",
	"marketplacePlugin",
	"acceptedSurfaceHash",
	"acceptedSurfaceAt",
	"acceptedSurfaceIntegrity"
];
const utf8Encoder = new TextEncoder();
function comparePluginIds(left, right) {
	const leftBytes = utf8Encoder.encode(left);
	const rightBytes = utf8Encoder.encode(right);
	const sharedLength = Math.min(leftBytes.length, rightBytes.length);
	for (let index = 0; index < sharedLength; index += 1) {
		const difference = (leftBytes[index] ?? 0) - (rightBytes[index] ?? 0);
		if (difference !== 0) return difference;
	}
	return leftBytes.length - rightBytes.length;
}
function createPluginInstallRecordMap() {
	return Object.create(null);
}
function setPluginInstallRecordMapEntry(records, pluginId, record) {
	Object.defineProperty(records, pluginId, {
		configurable: true,
		enumerable: true,
		value: record,
		writable: true
	});
}
function getPluginInstallRecordMapEntry(records, pluginId) {
	return records && Object.hasOwn(records, pluginId) ? records[pluginId] : void 0;
}
function copyPluginInstallRecordMap(records) {
	const copied = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(records ?? {})) setPluginInstallRecordMapEntry(copied, pluginId, record);
	return copied;
}
function parsePluginInstallRecord(value) {
	const parsed = PluginInstallRecordSchema.safeParse(value);
	if (!parsed.success) return null;
	const record = parsed.data;
	for (const field of NORMALIZED_STRING_FIELDS) {
		const fieldValue = record[field];
		if (typeof fieldValue !== "string") continue;
		const normalized = fieldValue.trim();
		if (normalized) record[field] = normalized;
		else delete record[field];
	}
	if (record.clawhubTrustReasons) {
		const reasons = record.clawhubTrustReasons.map((entry) => entry.trim()).filter(Boolean);
		if (reasons.length > 0) record.clawhubTrustReasons = reasons;
		else delete record.clawhubTrustReasons;
	}
	return record;
}
function parsePluginInstallRecordMap(value) {
	if (!isRecord(value)) return null;
	const records = createPluginInstallRecordMap();
	for (const [pluginId, rawRecord] of Object.entries(value)) {
		const record = parsePluginInstallRecord(rawRecord);
		if (!record) return null;
		setPluginInstallRecordMapEntry(records, pluginId, record);
	}
	return records;
}
function inspectPluginInstallRecordMap(value) {
	if (value === void 0) return { status: "missing" };
	const records = parsePluginInstallRecordMap(value);
	return records ? {
		status: "valid",
		records
	} : { status: "invalid" };
}
/**
* Object enumeration reorders integer-index keys, so persisted bytes must be
* assembled from sorted entries instead of relying on object insertion order.
*/
function serializePluginInstallRecordMap(records) {
	return `{${Object.entries(records).toSorted(([left], [right]) => comparePluginIds(left, right)).map(([pluginId, record]) => `${JSON.stringify(pluginId)}:${JSON.stringify(record)}`).join(",")}}`;
}
//#endregion
//#region src/plugins/installed-plugin-index-store-path.ts
const LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH = path.join("plugins", "installs.json");
function resolveStoreEnv(options) {
	const env = options.env ?? process.env;
	if (options.stateDir) return {
		...env,
		TESTCLAW_STATE_DIR: options.stateDir
	};
	if (hasActivePluginInstallRoots()) return {
		...env,
		TESTCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	};
	return env;
}
/** Resolves the canonical SQLite-backed installed plugin index path. */
function resolveInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	return resolveAssistantStateSqlitePath(resolveStoreEnv(options));
}
/** Resolves state database options for the installed plugin index store. */
function resolveInstalledPluginIndexStateDatabaseOptions(options = {}) {
	if (options.filePath) return {
		...options.env ? { env: options.env } : {},
		path: options.filePath
	};
	return { env: resolveStoreEnv(options) };
}
/** Resolves the legacy JSON installed plugin index path for migration/doctor use. */
function resolveLegacyInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveActivePluginInstallRoots(env).stateDir;
	return path.join(stateDir, LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH);
}
//#endregion
//#region src/plugins/installed-plugin-index-record-state.ts
/** Read failures must escape before either projection can authorize recovery or rebuilding. */
function readPersistedInstalledPluginIndexRowSync(options) {
	if (options.filePath?.endsWith(".json")) return;
	return readPluginMetadataStateRowSync("installed-index", resolveInstalledPluginIndexStateDatabaseOptions(options), options.artifactPreservingReadOnly);
}
/** Share the SQLite row while validating install records independently from index metadata. */
function getPersistedInstalledPluginIndexCacheEntry(options, readRow = () => readPersistedInstalledPluginIndexRowSync(options)) {
	const cache = getPluginCache().persistedInstalledIndex;
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const current = cache.get(key);
	if (current && "value" in current) return current.value;
	const row = readRow();
	const entry = { state: row ? {
		status: "present",
		value: safeParseJson(row.value_json)
	} : { status: "missing" } };
	cache.set(key, { value: entry });
	return entry;
}
/** Prepare missing policy and inventory facts without replacing their lifecycle owners. */
function preparePluginMetadataMachineState(options) {
	const env = options.env ?? process.env;
	readBundledDiscoveryModeMemoized(env, options, (databasePath) => {
		const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
		const current = getPluginCache().persistedInstalledIndex.get(key);
		if (path.resolve(databasePath) !== key || options.filePath?.endsWith(".json") || current && "value" in current) return readBundledDiscoveryMode({ env }, options);
		const rows = readPluginMetadataStateRowsSync(["plugins.bundledDiscovery", INSTALLED_PLUGIN_INDEX_STATE_KEY], resolveInstalledPluginIndexStateDatabaseOptions(options), options.artifactPreservingReadOnly);
		const mode = rows.find((row) => row.state_key === "plugins.bundledDiscovery");
		const value = mode ? JSON.parse(mode.value_json) : void 0;
		getPersistedInstalledPluginIndexCacheEntry(options, () => rows.find((row) => row.state_key === INSTALLED_PLUGIN_INDEX_STATE_KEY));
		return value;
	});
}
/** Await one shared row, retaining its cache generation until publication completes. */
async function preparePersistedInstalledPluginIndexCacheEntry(options = {}) {
	const owner = getPluginCache();
	const key = path.resolve(resolveInstalledPluginIndexStorePath(options));
	const databaseOptions = resolveInstalledPluginIndexStateDatabaseOptions(options);
	const prepared = await preparePluginCacheFact(owner, owner.persistedInstalledIndex, key, async () => {
		const row = options.filePath?.endsWith(".json") ? void 0 : await readPluginMetadataStateRow("installed-index", databaseOptions, options.artifactPreservingReadOnly);
		return { state: row ? {
			status: "present",
			value: safeParseJson(row.value_json)
		} : { status: "missing" } };
	});
	return {
		entry: prepared.value,
		assertCurrent: prepared.assertCurrent
	};
}
function inspectPersistedInstalledPluginIndexInstallRecords(entry) {
	if (!entry.records) {
		const state = entry.state;
		const records = (state.status === "present" ? state.value : void 0)?.index?.installRecords;
		entry.records = state.status === "missing" ? { status: "missing" } : records === void 0 ? { status: "invalid" } : inspectPluginInstallRecordMap(records);
	}
	return entry.records;
}
function inspectPersistedInstalledPluginIndexInstallRecordsSync(options = {}) {
	return inspectPersistedInstalledPluginIndexInstallRecords(getPersistedInstalledPluginIndexCacheEntry(options));
}
//#endregion
//#region src/plugins/installed-plugin-index-record-cache.ts
/** Explicit ledger writes/reloads leave the Gateway's embedded boot snapshot unchanged. */
function clearLoadInstalledPluginIndexInstallRecordsCache() {
	for (const cache of /* @__PURE__ */ new Set([getPluginCache(), getProcessPluginCache()])) {
		cache.installRecords.clear();
		cache.persistedInstalledIndex.clear();
	}
}
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.ts
/** Reads installed-index records back into manifest registry records. */
function copyInstallRecords(records) {
	return copyPluginInstallRecordMap(records);
}
const BLOCKED_RECORD_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isSafeRecordKey(key) {
	return !BLOCKED_RECORD_KEYS.has(key);
}
function readJsonObjectFileSync(filePath) {
	const parsed = tryReadJsonSync(filePath);
	return isRecord(parsed) ? parsed : null;
}
function readStringRecord(value) {
	if (!isRecord(value)) return {};
	const record = {};
	for (const [key, raw] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (!isSafeRecordKey(key)) continue;
		if (typeof raw === "string" && raw.trim()) record[key] = raw.trim();
	}
	return record;
}
function hasPackagePluginMetadata(manifest) {
	const testclaw = manifest.testclaw;
	if (!isRecord(testclaw)) return false;
	const extensions = testclaw.extensions;
	return Array.isArray(extensions) && extensions.some((entry) => typeof entry === "string");
}
function readManifestPluginId(packageDir) {
	const manifest = readJsonObjectFileSync(path.join(packageDir, "testclaw.plugin.json"));
	return (typeof manifest?.id === "string" ? manifest.id.trim() : "") || void 0;
}
function resolveRecoveredManagedNpmRoot(options = {}) {
	return path.resolve(options.stateDir ? path.join(options.stateDir, "npm") : resolveDefaultPluginNpmDir(options.env));
}
function resolveRecoveredManagedNpmPluginId(params) {
	const packageManifest = readJsonObjectFileSync(path.join(params.packageDir, "package.json"));
	if (!packageManifest || !hasPackagePluginMetadata(packageManifest)) return;
	const packageName = typeof packageManifest.name === "string" && packageManifest.name.trim() ? packageManifest.name.trim() : params.packageName;
	const pluginId = readManifestPluginId(params.packageDir) ?? packageName;
	return validatePluginId(pluginId) ? void 0 : pluginId;
}
function readManagedNpmInstallTimestampMs(params) {
	const timestampPaths = params.sharedLegacyRoot ? [params.packageDir] : [path.join(params.projectRoot, "package.json"), params.projectRoot];
	for (const filePath of timestampPaths) try {
		return fs.statSync(filePath).mtimeMs;
	} catch {}
	return 0;
}
function buildRecoveredManagedNpmInstallCandidatesForRoot(params) {
	const dependencies = readStringRecord(readJsonObjectFileSync(path.join(params.projectRoot, "package.json"))?.dependencies);
	const candidates = [];
	for (const [packageName, dependencySpec] of Object.entries(dependencies)) {
		const packageDir = path.join(params.projectRoot, "node_modules", ...packageName.split("/"));
		let stat;
		try {
			stat = fs.statSync(packageDir);
		} catch {
			continue;
		}
		if (!stat.isDirectory()) continue;
		if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
		const pluginId = resolveRecoveredManagedNpmPluginId({
			packageName,
			packageDir
		});
		if (!pluginId) continue;
		const packageManifest = readJsonObjectFileSync(path.join(packageDir, "package.json"));
		const version = typeof packageManifest?.version === "string" && packageManifest.version.trim() ? packageManifest.version.trim() : void 0;
		candidates.push({
			pluginId,
			installTimestampMs: readManagedNpmInstallTimestampMs({
				packageDir,
				projectRoot: params.projectRoot,
				sharedLegacyRoot: params.sharedLegacyRoot
			}),
			installRecord: {
				source: "npm",
				spec: `${packageName}@${dependencySpec}`,
				installPath: packageDir,
				...version ? {
					version,
					resolvedName: packageName,
					resolvedVersion: version
				} : {},
				...version ? { resolvedSpec: `${packageName}@${version}` } : {}
			}
		});
	}
	return candidates;
}
/** Lists recoverable managed npm installs without assigning active precedence. */
function listRecoveredManagedNpmInstallCandidates(options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	return [...buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot: npmRoot,
		sharedLegacyRoot: true
	}), ...listManagedPluginNpmProjectRootsSync(npmRoot).flatMap((projectRoot) => buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot,
		sharedLegacyRoot: false
	}))];
}
function recordsShareInstallPath(left, right) {
	if (!left?.installPath || !right.installPath) return false;
	return normalizeInstallPathForComparison(left.installPath) === normalizeInstallPathForComparison(right.installPath);
}
function normalizeInstallPathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
function pickMostRecentRecoveredManagedNpmCandidate(candidates) {
	return candidates.toSorted((left, right) => {
		const byTimestamp = right.installTimestampMs - left.installTimestampMs;
		if (byTimestamp !== 0) return byTimestamp;
		return (right.installRecord.installPath ?? "").localeCompare(left.installRecord.installPath ?? "");
	})[0];
}
function emitManagedNpmRecoveryFallbackWarning(params) {
	process.emitWarning(`Managed npm recovery found ${params.candidates.length} installs for plugin "${params.pluginId}" without an authoritative active path; selected the most recently installed candidate. Run \`testclaw doctor --fix\` to persist and retire stale generations.`, {
		code: "TESTCLAW_PLUGIN_INSTALL_RECOVERY_FALLBACK",
		type: "AssistantPluginRecoveryWarning",
		detail: JSON.stringify({
			pluginId: params.pluginId,
			selectedInstallPath: params.selected.installRecord.installPath,
			candidates: params.candidates.map((candidate) => ({
				installPath: candidate.installRecord.installPath,
				installTimestampMs: candidate.installTimestampMs
			}))
		})
	});
}
function buildRecoveredManagedNpmInstallRecords(persisted, options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const records = createPluginInstallRecordMap();
	const candidatesByPluginId = /* @__PURE__ */ new Map();
	for (const candidate of listRecoveredManagedNpmInstallCandidates(options)) {
		const candidates = candidatesByPluginId.get(candidate.pluginId) ?? [];
		candidates.push(candidate);
		candidatesByPluginId.set(candidate.pluginId, candidates);
	}
	for (const [pluginId, candidates] of candidatesByPluginId) {
		const persistedRecord = getPluginInstallRecordMapEntry(persisted ?? void 0, pluginId);
		const authoritative = candidates.find((candidate) => recordsShareInstallPath(persistedRecord, candidate.installRecord));
		const selected = authoritative ?? pickMostRecentRecoveredManagedNpmCandidate(candidates);
		setPluginInstallRecordMapEntry(records, pluginId, selected.installRecord);
		const recoversUnavailableManagedPath = isUnavailableManagedNpmInstallRecord({
			npmRoot,
			persisted: persistedRecord,
			recovered: selected.installRecord
		});
		if (!authoritative && candidates.length > 1 && (!persistedRecord || recoversUnavailableManagedPath)) emitManagedNpmRecoveryFallbackWarning({
			pluginId,
			selected,
			candidates
		});
	}
	return records;
}
function readInstallRecordVersion(record) {
	return record?.resolvedVersion ?? record?.version;
}
function isUnavailableManagedNpmInstallRecord(params) {
	const installPath = params.persisted?.installPath;
	if (params.persisted?.source !== "npm" || !installPath) return false;
	try {
		if (fs.statSync(installPath).isDirectory()) return false;
	} catch (error) {
		if (!isNotFoundPathError(error)) return false;
	}
	const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(installPath);
	if (!packageInfo || packageInfo.packageName !== params.recovered.resolvedName) return false;
	const npmRoot = normalizeInstallPathForComparison(params.npmRoot);
	return normalizeInstallPathForComparison(packageInfo.projectRoot) === npmRoot || normalizeInstallPathForComparison(path.dirname(packageInfo.projectRoot)) === normalizeInstallPathForComparison(resolvePluginNpmProjectsDir(params.npmRoot));
}
function mergeRecoveredManagedNpmMetadata(persisted, recovered, options = {}) {
	const next = {
		...persisted,
		...recovered
	};
	if (options.preservePersistedSpec) {
		const persistedSpec = persisted.spec ? parseRegistryNpmSpec(persisted.spec) : null;
		const selectorIsCompatible = persistedSpec !== null && isPrereleaseResolutionAllowed({
			spec: persistedSpec,
			resolvedVersion: recovered.resolvedVersion
		}) && (persistedSpec.selectorKind !== "exact-version" || persistedSpec.selector !== void 0 && recovered.resolvedVersion !== void 0 && compareValidSemver(persistedSpec.selector, recovered.resolvedVersion) === 0);
		if (persistedSpec?.name === recovered.resolvedName && selectorIsCompatible) next.spec = persisted.spec;
	}
	delete next.integrity;
	delete next.shasum;
	delete next.resolvedAt;
	delete next.installedAt;
	return next;
}
function isForeignManagedNpmInstallRecord(params) {
	if (params.record?.source !== "npm") return false;
	const installPath = params.record.installPath;
	if (!installPath) return false;
	const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(installPath);
	if (!packageInfo) return false;
	const projectsDir = path.dirname(packageInfo.projectRoot);
	if (path.basename(projectsDir) !== "projects") return false;
	const previousNpmRoot = path.dirname(projectsDir);
	if (normalizeInstallPathForComparison(previousNpmRoot) === normalizeInstallPathForComparison(params.npmRoot)) return false;
	return isPluginNpmProjectDir({
		packageName: packageInfo.packageName,
		projectDir: packageInfo.projectRoot,
		npmDir: previousNpmRoot
	});
}
/** Lists existing npm projects that could be copied managed state or external installs. */
function findForeignManagedNpmInstallRecordPluginIds(persisted, options) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	return Object.entries(persisted ?? {}).flatMap(([pluginId, record]) => isForeignManagedNpmInstallRecord({
		npmRoot,
		record
	}) ? [pluginId] : []);
}
function mergeRecoveredManagedNpmRecord(params) {
	if (params.persisted && isUnavailableManagedNpmInstallRecord(params)) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered, { preservePersistedSpec: true });
	const persistedVersion = readInstallRecordVersion(params.persisted);
	const recoveredVersion = readInstallRecordVersion(params.recovered);
	if (params.persisted?.source === "npm" && recordsShareInstallPath(params.persisted, params.recovered) && recoveredVersion && persistedVersion !== recoveredVersion) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered);
	return params.persisted ?? params.recovered;
}
/** Merges persisted records with managed npm installs recovered from the current root. */
function mergeRecoveredManagedNpmInstallRecords(persisted, options) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const recovered = buildRecoveredManagedNpmInstallRecords(persisted, options);
	const merged = copyPluginInstallRecordMap(persisted ?? void 0);
	for (const [pluginId, record] of Object.entries(recovered)) setPluginInstallRecordMapEntry(merged, pluginId, mergeRecoveredManagedNpmRecord({
		npmRoot,
		persisted: getPluginInstallRecordMapEntry(merged, pluginId),
		recovered: record
	}));
	return merged;
}
/** Reads install records from the persisted installed plugin index. */
function readPersistedInstalledPluginIndexInstallRecords(options = {}) {
	const state = inspectPersistedInstalledPluginIndexInstallRecordsSync(options);
	return state.status === "valid" ? copyInstallRecords(state.records) : null;
}
function requireLoadablePluginInstallRecordState(state) {
	if (state.status === "invalid") throw new Error("Persisted plugin install records are invalid. Run testclaw doctor to inspect and repair plugin installation state.");
	return state.status === "valid" ? state.records : null;
}
function resolveInstallRecordsCacheKey(options) {
	return [path.resolve(resolveInstalledPluginIndexStorePath(options)), resolveRecoveredManagedNpmRoot(options)].join("\0");
}
/** Loads installed plugin records, recovering managed npm installs and caching the result. */
async function loadInstalledPluginIndexInstallRecords(params = {}) {
	const captured = {
		...params,
		env: cloneEnvWithPlatformSemantics(params.env ?? process.env)
	};
	const cacheKey = resolveInstallRecordsCacheKey(captured);
	const cache = getPluginCache().installRecords;
	const cached = cache.get(cacheKey);
	if (cached) return copyInstallRecords(cached);
	const prepared = await preparePersistedInstalledPluginIndexCacheEntry(captured);
	prepared.assertCurrent();
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(inspectPersistedInstalledPluginIndexInstallRecords(prepared.entry)), captured);
	prepared.assertCurrent();
	cache.set(cacheKey, records);
	return copyInstallRecords(records);
}
/** Synchronously loads installed plugin records, recovering managed npm installs and caching them. */
function loadInstalledPluginIndexInstallRecordsSync(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cache = getPluginCache().installRecords;
	const cached = cache.get(cacheKey);
	if (cached) return copyInstallRecords(cached);
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(inspectPersistedInstalledPluginIndexInstallRecordsSync(params)), params);
	cache.set(cacheKey, records);
	return copyInstallRecords(records);
}
//#endregion
//#region src/plugins/installed-plugin-record-match.ts
function resolveCandidateInstallOwner(params) {
	if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) return;
	const installOwner = resolvePluginCandidateInstallOwner(params.candidate);
	if (installOwner) return Object.hasOwn(params.installRecords, installOwner) ? installOwner : void 0;
}
function matchesInstalledPluginRecord(params) {
	if (params.candidate.origin !== "global" && params.candidate.origin !== "config") return false;
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	if (!record) return false;
	const candidatePaths = [
		params.candidate.rootDir,
		params.candidate.packageDir,
		params.candidate.source,
		params.candidate.setupSource
	].filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	const trackedPaths = (params.installPathOnly ? [record.installPath] : [record.installPath, record.sourcePath]).filter((entry) => typeof entry === "string" && entry.trim().length > 0).map((entry) => {
		const resolved = resolveUserPath(entry, params.env);
		return pluginCacheRealpathSync(resolved) ?? resolved;
	});
	if (candidatePaths.length === 0 || trackedPaths.length === 0) return false;
	return trackedPaths.some((trackedPath) => candidatePaths.some((candidatePath) => candidatePath === trackedPath || isPathInside(trackedPath, candidatePath) || isPathInside(candidatePath, trackedPath)));
}
function resolvePluginTrust(params) {
	const installOwner = resolveCandidateInstallOwner(params);
	const record = installOwner ? params.installRecords[installOwner] : void 0;
	const origin = params.candidate.origin;
	let reason;
	if (origin === "bundled") reason = "bundled";
	else if (isPluginCandidateInstallOwnerAmbiguous(params.candidate)) reason = "owner-ambiguous";
	else if (origin === "workspace" || record?.source === "path" || record?.source === "npm" && (record.artifactKind !== void 0 || record.sourcePath !== void 0)) reason = "origin-path";
	else if (!record || !installOwner) reason = "record-missing";
	else if (!matchesInstalledPluginRecord({
		pluginId: params.pluginId,
		candidate: params.candidate,
		env: params.env,
		installRecords: params.installRecords,
		installPathOnly: true
	})) reason = "install-path-mismatch";
	else if (isTrustedOfficialPluginInstallRecord({
		pluginId: installOwner,
		packageName: params.candidate.packageName,
		record
	})) reason = "trusted-official";
	else if (record.source === "npm" && record.spec === void 0 && record.resolvedName === void 0 && record.resolvedSpec === void 0 || record.source === "clawhub" && record.clawhubUrl === void 0 && record.clawhubChannel === void 0) reason = "provenance-missing";
	else reason = "provenance-invalid";
	return {
		reason,
		registryPath: params.registryPath,
		origin,
		installSource: record?.source,
		installSpec: record?.spec === void 0 ? void 0 : redactSensitiveText(record.spec, { mode: "tools" })
	};
}
//#endregion
export { parsePluginInstallRecordMap as C, parsePluginInstallRecord as S, setPluginInstallRecordMapEntry as T, PluginInstallRecordSchema as _, loadInstalledPluginIndexInstallRecords as a, getPluginInstallRecordMapEntry as b, clearLoadInstalledPluginIndexInstallRecordsCache as c, preparePersistedInstalledPluginIndexCacheEntry as d, preparePluginMetadataMachineState as f, resolveLegacyInstalledPluginIndexStorePath as g, resolveInstalledPluginIndexStorePath as h, listRecoveredManagedNpmInstallCandidates as i, getPersistedInstalledPluginIndexCacheEntry as l, resolveInstalledPluginIndexStateDatabaseOptions as m, resolvePluginTrust as n, loadInstalledPluginIndexInstallRecordsSync as o, readPersistedInstalledPluginIndexRowSync as p, findForeignManagedNpmInstallRecordPluginIds as r, readPersistedInstalledPluginIndexInstallRecords as s, matchesInstalledPluginRecord as t, inspectPersistedInstalledPluginIndexInstallRecordsSync as u, copyPluginInstallRecordMap as v, serializePluginInstallRecordMap as w, inspectPluginInstallRecordMap as x, createPluginInstallRecordMap as y };
