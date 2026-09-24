import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as VERSION } from "./version-BdHihr00.js";
import { C as record, D as tuple, O as union, T as string, b as object, d as array, f as boolean, g as literal, k as unknown, l as _enum, x as partialRecord, y as number } from "./schemas-D6YHSiZI.js";
import { r as isArtifactPreservingStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as readConfigMachineState } from "./config-machine-state-BiDCuNUZ.js";
import { _ as MODEL_CATALOG_APIS, v as MODEL_CATALOG_THINKING_LEVELS } from "./manifest-DQTAOZoC.js";
import { t as compareAssistantVersions } from "./version-CKE5uMw2.js";
import { n as planManifestModelCatalogRows } from "./manifest-planner-CMFcKFST.js";
import { n as updateConfigMachineState } from "./config-machine-state-write-BsrY8iFO.js";
import { n as isProviderCatalogSourceAllowed } from "./provider-config-owner-BOsyuzHw.js";
import { createRequire } from "node:module";
import { getEnvironmentData, setEnvironmentData } from "node:worker_threads";
//#region packages/model-catalog-core/src/remote-catalog-bundle.ts
const REMOTE_CATALOG_MAX_FUTURE_SKEW_MS = 864e5;
const stringMapSchema = record(string(), string());
const pricingTierSchema = object({
	input: number().finite().nonnegative(),
	output: number().finite().nonnegative(),
	cacheRead: number().finite().nonnegative(),
	cacheWrite: number().finite().nonnegative(),
	range: union([tuple([number().finite().nonnegative()]), tuple([number().finite().nonnegative(), number().finite().nonnegative()])])
}).strict();
const costSchema = object({
	input: number().finite().nonnegative().optional(),
	output: number().finite().nonnegative().optional(),
	cacheRead: number().finite().nonnegative().optional(),
	cacheWrite: number().finite().nonnegative().optional(),
	tieredPricing: array(pricingTierSchema).optional()
}).strict();
const hostedPricingSchema = object({
	input: number().finite().nonnegative(),
	output: number().finite().nonnegative(),
	cacheRead: number().finite().nonnegative().optional(),
	cacheWrite: number().finite().nonnegative().optional(),
	tieredPricing: array(pricingTierSchema).optional()
}).strict();
const contextWindowOptionSchema = object({
	id: string().trim().min(1),
	label: string().trim().min(1),
	contextWindow: number().int().positive()
}).strict();
const modelSchema = object({
	id: string().trim().min(1),
	name: string().optional(),
	api: _enum(MODEL_CATALOG_APIS).optional(),
	baseUrl: string().optional(),
	headers: stringMapSchema.optional(),
	input: array(_enum([
		"text",
		"image",
		"document"
	])).optional(),
	reasoning: boolean().optional(),
	contextWindow: number().finite().positive().optional(),
	contextWindows: array(contextWindowOptionSchema).max(16).optional(),
	contextWindowDefault: string().trim().min(1).optional(),
	contextTokens: number().int().positive().optional(),
	maxTokens: number().finite().positive().optional(),
	thinkingLevelMap: partialRecord(_enum(MODEL_CATALOG_THINKING_LEVELS), string().nullable()).optional(),
	cost: costSchema.optional(),
	compat: record(string(), unknown()).optional(),
	mediaInput: record(string(), unknown()).optional(),
	status: _enum([
		"available",
		"preview",
		"deprecated",
		"disabled"
	]).optional(),
	statusReason: string().optional(),
	replaces: array(string()).optional(),
	replacedBy: string().optional(),
	tags: array(string()).optional()
}).superRefine((model, context) => {
	if (model.contextWindowDefault && !model.contextWindows?.some((option) => option.id === model.contextWindowDefault)) context.addIssue({
		code: "custom",
		message: "contextWindowDefault must reference a declared contextWindows option",
		path: ["contextWindowDefault"]
	});
});
const remoteModelCatalogProviderSchema = object({
	baseUrl: string().optional(),
	api: _enum(MODEL_CATALOG_APIS).optional(),
	headers: stringMapSchema.optional(),
	defaultModel: string().optional(),
	defaultUtilityModel: string().optional(),
	models: array(modelSchema).min(1)
}).strict().superRefine((provider, context) => {
	const seen = /* @__PURE__ */ new Set();
	for (const [index, model] of provider.models.entries()) {
		if (seen.has(model.id)) context.addIssue({
			code: "custom",
			message: `duplicate model id: ${model.id}`,
			path: [
				"models",
				index,
				"id"
			]
		});
		seen.add(model.id);
	}
});
const remoteModelCatalogBundleSchema = object({
	schemaVersion: literal(1),
	generatedAt: number().int().positive().refine((value) => value <= Date.now() + REMOTE_CATALOG_MAX_FUTURE_SKEW_MS, { message: "generatedAt is implausibly far in the future" }),
	minVersion: string().trim().min(1).optional(),
	sourceCommit: string().trim().min(1),
	providers: record(string().trim().min(1), remoteModelCatalogProviderSchema),
	pricing: record(string().trim().min(1), hostedPricingSchema).optional()
}).strict();
function parseRemoteModelCatalogBundle(value) {
	return remoteModelCatalogBundleSchema.parse(value);
}
function stripRemoteTransportOverrides(value) {
	if (Array.isArray(value)) return value.map(stripRemoteTransportOverrides);
	if (!value || typeof value !== "object") return value;
	const entries = Object.entries(value);
	let kept = 0;
	for (const entry of entries) if (entry[0] !== "baseUrl" && entry[0] !== "headers") {
		entry[1] = stripRemoteTransportOverrides(entry[1]);
		entries[kept++] = entry;
	}
	entries.length = kept;
	return Object.fromEntries(entries);
}
/** Removes every transport endpoint/header override before remote data reaches persistence. */
function sanitizeRemoteModelCatalogBundle(bundle) {
	return stripRemoteTransportOverrides(bundle);
}
function validateAndSanitizeRemoteModelCatalogBundle(value) {
	return sanitizeRemoteModelCatalogBundle(parseRemoteModelCatalogBundle(value));
}
//#endregion
//#region src/model-catalog/bundled-catalog-stamp.ts
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
/** Reads the package build stamp once through Node's JSON module cache. */
function bundledCatalogGeneratedAt(moduleUrl = import.meta.url) {
	const require = createRequire(moduleUrl);
	for (const candidate of BUILD_INFO_CANDIDATES) try {
		const info = require(candidate);
		if (typeof info.builtAt !== "string") continue;
		const generatedAt = Date.parse(info.builtAt);
		if (Number.isFinite(generatedAt) && generatedAt > 0) return generatedAt;
	} catch {}
}
//#endregion
//#region src/model-catalog/remote-config.ts
const DEFAULT_REMOTE_MODEL_CATALOG_URL = "https://catalog.testclaw.ai/models/v1/catalog.json";
function isRemoteModelCatalogRefreshEnabled(config) {
	return config.models?.catalogRefresh?.enabled !== false;
}
function resolveRemoteCatalogUrl(config) {
	return config.models?.catalogRefresh?.url?.trim() || DEFAULT_REMOTE_MODEL_CATALOG_URL;
}
//#endregion
//#region src/model-catalog/remote-store.ts
const REMOTE_MODEL_CATALOG_STATE_KEY = "modelCatalog.remote";
function readRemoteModelCatalog(options = {}) {
	const snapshot = readConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, options);
	return snapshot ? {
		id: 1,
		...snapshot
	} : void 0;
}
/** Read the startup catalog through the existing shared-state inspection owner. */
async function readRemoteModelCatalogAsync(context) {
	const artifactPreservingReadOnly = isArtifactPreservingStateRead();
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	context.admission.assertCurrent();
	return runAssistantStateWorkerOperation(context, async (scope) => {
		const row = await scope.execute({
			type: "modelCatalog.remote.read",
			input: { artifactPreservingReadOnly }
		});
		context.admission.assertCurrent();
		return row;
	}, { existingOnly: true });
}
function writeRemoteModelCatalog(row, options = {}) {
	let result = { status: "written" };
	updateConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, (current) => {
		if (current && current.source_url === row.source_url && (current.generated_at > row.generated_at || current.generated_at === row.generated_at && current.bundle_json !== row.bundle_json)) {
			result = {
				status: "retained-newer",
				row: {
					id: 1,
					...current
				}
			};
			return current;
		}
		return row;
	}, options);
	return result;
}
function markRemoteModelCatalogChecked(checkedAt, metadata, options = {}) {
	let matched = false;
	updateConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, (current) => {
		if (!current) return;
		if (current.source_url !== metadata.expected.source_url || current.generated_at !== metadata.expected.generated_at || current.etag !== metadata.expected.etag || current.last_modified !== metadata.expected.last_modified) return current;
		matched = true;
		return {
			...current,
			checked_at: checkedAt,
			...metadata.etag !== void 0 ? { etag: metadata.etag } : {},
			...metadata.lastModified !== void 0 ? { last_modified: metadata.lastModified } : {}
		};
	}, options);
	return matched;
}
//#endregion
//#region src/model-catalog/remote-overlay.ts
const STARTUP_SNAPSHOT_KEY = "testclaw.remoteModelCatalogStartupSnapshot";
let readBundledGeneratedAt = bundledCatalogGeneratedAt;
let readStoredCatalog = readRemoteModelCatalog;
let readStoredCatalogAsync = readRemoteModelCatalogAsync;
function isCompatible(bundle, bundledGeneratedAt) {
	if (bundle.generatedAt <= bundledGeneratedAt) return false;
	if (!bundle.minVersion) return true;
	const comparison = compareAssistantVersions(VERSION, bundle.minVersion);
	return comparison !== null && comparison >= 0;
}
function readCompatibleRemoteModelCatalog() {
	const bundledGeneratedAt = readBundledGeneratedAt();
	if (bundledGeneratedAt === void 0) return null;
	return selectCompatibleRemoteModelCatalog(readStoredCatalog(), bundledGeneratedAt);
}
function readCompatibleRemoteModelCatalogMetadata() {
	const bundledGeneratedAt = readBundledGeneratedAt();
	if (bundledGeneratedAt === void 0) return null;
	const stored = readStoredCatalog();
	if (!stored) return null;
	const bundle = parseRemoteModelCatalogBundle(JSON.parse(stored.bundle_json));
	return isCompatible(bundle, bundledGeneratedAt) ? {
		sourceUrl: stored.source_url,
		generatedAt: bundle.generatedAt
	} : null;
}
function selectCompatibleRemoteModelCatalog(stored, bundledGeneratedAt) {
	if (!stored) return null;
	const bundle = validateAndSanitizeRemoteModelCatalogBundle(JSON.parse(stored.bundle_json));
	if (!isCompatible(bundle, bundledGeneratedAt)) return null;
	return {
		sourceUrl: stored.source_url,
		generatedAt: bundle.generatedAt,
		providers: bundle.providers,
		...bundle.pricing ? { pricing: bundle.pricing } : {}
	};
}
function inheritedRemoteModelCatalogStartupSnapshot() {
	return getEnvironmentData(STARTUP_SNAPSHOT_KEY);
}
function publishRemoteModelCatalogStartupSnapshot(snapshot) {
	const inherited = inheritedRemoteModelCatalogStartupSnapshot();
	if (inherited !== void 0) return inherited.catalog;
	setEnvironmentData(STARTUP_SNAPSHOT_KEY, { catalog: snapshot });
	return snapshot;
}
function captureRemoteModelCatalogStartupSnapshot() {
	const inherited = inheritedRemoteModelCatalogStartupSnapshot();
	if (inherited !== void 0) return inherited.catalog;
	let snapshot;
	try {
		snapshot = readCompatibleRemoteModelCatalog();
	} catch {
		snapshot = null;
	}
	return publishRemoteModelCatalogStartupSnapshot(snapshot);
}
/** Prepare the same first-winner startup pair without host-thread SQLite reads. */
async function prepareRemoteModelCatalogStartupSnapshot(options = {}) {
	const inherited = inheritedRemoteModelCatalogStartupSnapshot();
	if (inherited !== void 0) return inherited.catalog;
	let bundledGeneratedAt;
	try {
		bundledGeneratedAt = readBundledGeneratedAt();
	} catch {
		return publishRemoteModelCatalogStartupSnapshot(null);
	}
	if (bundledGeneratedAt === void 0) return publishRemoteModelCatalogStartupSnapshot(null);
	const context = captureAssistantStateWorkerContext(options);
	let snapshot;
	try {
		snapshot = selectCompatibleRemoteModelCatalog(await readStoredCatalogAsync(context), bundledGeneratedAt);
	} catch {
		snapshot = null;
	}
	context.admission.assertCurrent();
	return publishRemoteModelCatalogStartupSnapshot(snapshot);
}
function getActiveRemoteModelCatalog(config) {
	if (!isRemoteModelCatalogRefreshEnabled(config)) return;
	const snapshot = captureRemoteModelCatalogStartupSnapshot();
	return snapshot?.sourceUrl === resolveRemoteCatalogUrl(config) ? snapshot : void 0;
}
/** Inspects a completed check without activating its download or replacing the startup pair. */
function checkRemoteModelCatalogUpdate(config, expected) {
	if (!isRemoteModelCatalogRefreshEnabled(config) || resolveRemoteCatalogUrl(config) !== expected.sourceUrl) return "superseded";
	if (getActiveRemoteModelCatalog(config)?.generatedAt === expected.generatedAt) return "unchanged";
	const stored = readCompatibleRemoteModelCatalogMetadata();
	if (!stored) return "unchanged";
	return stored.sourceUrl === expected.sourceUrl && stored.generatedAt === expected.generatedAt ? "restart-required" : "superseded";
}
function getRemoteModelCatalogProviderOverlay(config, provider) {
	const providerId = normalizeProviderId(provider);
	return providerId ? getActiveRemoteModelCatalog(config)?.providers[providerId] : void 0;
}
function getRemoteModelCatalogPricing(config) {
	return getActiveRemoteModelCatalog(config)?.pricing;
}
function setRemoteModelCatalogOverlaySourcesForTest(sources) {
	setEnvironmentData(STARTUP_SNAPSHOT_KEY, void 0);
	readBundledGeneratedAt = sources?.bundledGeneratedAt ?? bundledCatalogGeneratedAt;
	readStoredCatalog = sources?.readStoredCatalog ?? readRemoteModelCatalog;
	const readTestCatalog = sources?.readStoredCatalog;
	readStoredCatalogAsync = readTestCatalog ? async () => readTestCatalog() : readRemoteModelCatalogAsync;
}
if (process.env.VITEST || false) globalThis[Symbol.for("testclaw.remoteModelCatalogOverlayTestApi")] = { setRemoteModelCatalogOverlaySourcesForTest };
//#endregion
//#region src/model-catalog/index.ts
function planEffectiveModelCatalogRows(params) {
	return planManifestModelCatalogRows({
		registry: params.registry,
		includeProvider: (provider, plugin) => isProviderCatalogSourceAllowed({
			provider,
			plugin,
			config: params.config
		}),
		...params.providerFilter ? { providerFilter: params.providerFilter } : {},
		...params.providerFilters ? { providerFilters: params.providerFilters } : {},
		...params.mergeKeyFilter ? { mergeKeyFilter: params.mergeKeyFilter } : {},
		resolveRemoteProvider: (provider) => getRemoteModelCatalogProviderOverlay(params.config, provider),
		...params.selection ? { selection: params.selection } : {}
	});
}
//#endregion
export { prepareRemoteModelCatalogStartupSnapshot as a, writeRemoteModelCatalog as c, bundledCatalogGeneratedAt as d, parseRemoteModelCatalogBundle as f, getRemoteModelCatalogPricing as i, isRemoteModelCatalogRefreshEnabled as l, captureRemoteModelCatalogStartupSnapshot as n, markRemoteModelCatalogChecked as o, validateAndSanitizeRemoteModelCatalogBundle as p, checkRemoteModelCatalogUpdate as r, readRemoteModelCatalog as s, planEffectiveModelCatalogRows as t, resolveRemoteCatalogUrl as u };
