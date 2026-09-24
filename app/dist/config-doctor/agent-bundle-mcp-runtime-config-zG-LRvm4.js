import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as assignSafeServerNames } from "./agent-bundle-mcp-names-CP3ugHLh.js";
import { t as createMcpServerToolDenyMatcher } from "./tool-policy-match-Cgem8hFf.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DRxMNwZw.js";
import { i as logWarn } from "./logger-DgjIIHeT.js";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-hjDwMopC.js";
import { a as partitionMcpServersByConnectionScope, o as redactMcpServersForFingerprint } from "./mcp-connection-resolver-CNpWj6Me.js";
import fs from "node:fs";
import crypto from "node:crypto";
//#region src/agents/bundle-mcp-config.ts
/**
* Merges bundled plugin MCP servers with user-configured MCP servers for agent
* runtimes.
*/
const TESTCLAW_TRANSPORT_TO_CLI_BUNDLE_TYPE = {
	"streamable-http": "http",
	http: "http",
	sse: "sse",
	stdio: "stdio"
};
function prepareOwnedBundleMcpDataDirs(params) {
	const mcpServers = { ...params.config.mcpServers };
	const prepareDataDirsByServer = {};
	const diagnostics = [];
	for (const [serverName, ownership] of Object.entries(params.prepareDataDirsByServer)) {
		if (!Object.hasOwn(mcpServers, serverName)) continue;
		try {
			fs.mkdirSync(ownership.dataDir, { recursive: true });
			prepareDataDirsByServer[serverName] = ownership;
		} catch (error) {
			delete mcpServers[serverName];
			diagnostics.push({
				pluginId: ownership.pluginId,
				message: `unable to prepare PLUGIN_DATA directory "${ownership.dataDir}" for MCP server "${serverName}": ${formatErrorMessage(error)}`
			});
		}
	}
	return {
		config: { mcpServers },
		diagnostics,
		prepareDataDirsByServer
	};
}
/**
* User config stores Assistant MCP transport names, while CLI backends such as
* Claude Code and Gemini expect a downstream `type` field. Keep this adapter
* out of the generic merge path because embedded Assistant still consumes the raw
* Assistant `transport` shape directly.
*/
function toCliBundleMcpServerConfig(server) {
	const next = { ...server };
	const rawTransport = next.transport;
	delete next.transport;
	if (typeof next.type === "string") return next;
	if (typeof rawTransport === "string") {
		const mapped = TESTCLAW_TRANSPORT_TO_CLI_BUNDLE_TYPE[rawTransport];
		if (mapped) next.type = mapped;
	}
	return next;
}
/** Loads enabled bundled MCP servers and overlays user config by server name. */
function loadMergedBundleMcpConfig(params) {
	const bundleMcp = loadEnabledBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry
	});
	const configuredMcp = normalizeConfiguredMcpServers(params.cfg?.mcp?.servers);
	const serverOverrides = params.toolOverrides?.mcpServers;
	const readServerOverride = (name) => serverOverrides && Object.hasOwn(serverOverrides, name) ? serverOverrides[name] : void 0;
	const disabledConfiguredNames = new Set(Object.entries(configuredMcp).filter(([name, server]) => readServerOverride(name) !== true && server.enabled === false).map(([name]) => name));
	const enabledConfiguredMcp = Object.fromEntries(Object.entries(configuredMcp).filter(([name, server]) => readServerOverride(name) !== false && (readServerOverride(name) === true || server.enabled !== false)));
	const enabledBundleMcp = Object.fromEntries(Object.entries(bundleMcp.config.mcpServers).filter(([name]) => readServerOverride(name) !== false && !disabledConfiguredNames.has(name)));
	const mapConfiguredServer = params.mapConfiguredServer ?? ((server) => server);
	const prepareDataDirsByServer = Object.fromEntries(Object.entries(bundleMcp.prepareDataDirsByServer ?? {}).filter(([name]) => Object.hasOwn(enabledBundleMcp, name) && !Object.hasOwn(enabledConfiguredMcp, name)));
	return {
		config: { mcpServers: {
			...Object.fromEntries(Object.entries(enabledBundleMcp).map(([name, server]) => [name, mapConfiguredServer(server, name)])),
			...Object.fromEntries(Object.entries(enabledConfiguredMcp).map(([name, server]) => [name, mapConfiguredServer(server, name)]))
		} },
		diagnostics: bundleMcp.diagnostics,
		prepareDataDirsByServer
	};
}
//#endregion
//#region src/agents/embedded-agent-mcp.ts
/** Loads merged MCP server config for an embedded agent workspace. */
function loadEmbeddedAgentMcpConfig(params) {
	const bundleMcp = loadMergedBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	return {
		mcpServers: bundleMcp.config.mcpServers,
		diagnostics: bundleMcp.diagnostics,
		prepareDataDirsByServer: bundleMcp.prepareDataDirsByServer
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-runtime-config.ts
/** Session MCP config loading, filtering, and catalog fingerprints. */
function digestSafeServerNameAssignments(safeServerNamesByServer) {
	if (!safeServerNamesByServer || safeServerNamesByServer.size === 0) return;
	return Object.fromEntries([...safeServerNamesByServer.entries()].toSorted(([a], [b]) => a.localeCompare(b)));
}
function digestMcpToolDenials(value) {
	const entries = Object.entries(value ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted((left, right) => left.localeCompare(right))]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function createCatalogFingerprint(params) {
	return crypto.createHash("sha256").update(JSON.stringify(params)).digest("hex");
}
function filterMcpServers(mcpServers, options) {
	if (!options.includeServerNames && !options.excludeServerNames && !options.toolDenylist?.length) return mcpServers;
	const filtered = {};
	const isDenied = createMcpServerToolDenyMatcher(options.toolDenylist);
	for (const [serverName, rawServer] of Object.entries(mcpServers)) {
		if (options.includeServerNames && !options.includeServerNames.has(serverName)) continue;
		if (options.excludeServerNames?.has(serverName)) continue;
		if (isDenied(options.safeServerNamesByServer.get(serverName) ?? serverName)) continue;
		filtered[serverName] = rawServer;
	}
	return filtered;
}
function loadSessionMcpConfig(params) {
	const loaded = params.loaded ?? loadEmbeddedAgentMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.cfg,
		manifestRegistry: params.manifestRegistry,
		toolOverrides: params.toolOverrides
	});
	if (params.logDiagnostics !== false) for (const diagnostic of loaded.diagnostics) logWarn(`bundle-mcp: ${diagnostic.pluginId}: ${diagnostic.message}`);
	const safeServerNamesByServer = params.safeServerNamesByServer ?? assignSafeServerNames(Object.keys(loaded.mcpServers));
	const safeServerNames = digestSafeServerNameAssignments(safeServerNamesByServer);
	const mcpAppsEnabled = params.cfg?.mcp?.apps?.enabled === true;
	const mcpToolsDeny = digestMcpToolDenials(params.toolOverrides?.mcpToolsDeny);
	const mcpServers = filterMcpServers(loaded.mcpServers, {
		includeServerNames: params.includeServerNames,
		excludeServerNames: params.excludeServerNames,
		safeServerNamesByServer,
		toolDenylist: params.toolDenylist
	});
	const prepareDataDirsByServer = Object.fromEntries(Object.entries(loaded.prepareDataDirsByServer ?? {}).filter(([serverName]) => Object.hasOwn(mcpServers, serverName)));
	const fingerprintServers = params.redactConnectionServerNames?.size ? redactMcpServersForFingerprint(mcpServers, params.redactConnectionServerNames) : mcpServers;
	const result = {
		safeServerNamesByServer,
		loaded: {
			...loaded,
			mcpServers,
			prepareDataDirsByServer
		},
		fingerprint: createCatalogFingerprint({
			servers: fingerprintServers,
			mcpAppsEnabled,
			...safeServerNames ? { safeServerNames } : {},
			mcpToolsDeny
		})
	};
	return structuredClone(result);
}
/**
* Loads enabled MCP config metadata for a session without creating runtimes,
* connecting transports, or issuing MCP tools/list requests.
*/
function resolveSessionMcpConfigSummary(params) {
	const { loaded, safeServerNamesByServer } = loadSessionMcpConfig({
		...params,
		logDiagnostics: false
	});
	const serverNames = Object.keys(loaded.mcpServers).toSorted((a, b) => a.localeCompare(b));
	const { requesterScopedServerNames } = partitionMcpServersByConnectionScope(loaded.mcpServers);
	const { fingerprint } = loadSessionMcpConfig({
		...params,
		loaded,
		logDiagnostics: false,
		...requesterScopedServerNames.length > 0 ? { excludeServerNames: new Set(requesterScopedServerNames) } : {},
		safeServerNamesByServer
	});
	return {
		fingerprint,
		serverNames
	};
}
/** Reads the enabled static MCP server set without opening transports or listing tools. */
function resolveStaticSessionMcpServerNames(params) {
	const { loaded } = loadSessionMcpConfig({
		...params,
		logDiagnostics: false
	});
	const { staticServers } = partitionMcpServersByConnectionScope(loaded.mcpServers);
	return Object.keys(staticServers).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { loadMergedBundleMcpConfig as a, loadEmbeddedAgentMcpConfig as i, resolveSessionMcpConfigSummary as n, prepareOwnedBundleMcpDataDirs as o, resolveStaticSessionMcpServerNames as r, toCliBundleMcpServerConfig as s, loadSessionMcpConfig as t };
