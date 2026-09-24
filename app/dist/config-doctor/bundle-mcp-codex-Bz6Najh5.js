import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-C8MGgrNG.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { f as clampPositiveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { p as normalizeTrimmedStringList } from "./string-normalization-DsCfAx8q.js";
import "./utils-BfoJTy8l.js";
import "./session-key-AvQIavYt.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-DRxMNwZw.js";
import "./agent-scope-BiRi-Smp.js";
import { r as getPluginToolMeta } from "./tool-metadata-BnzelBzh.js";
import "./agent-bundle-mcp-manager-api-uAyTpLKT.js";
import "./bundle-mcp-hjDwMopC.js";
import "./agent-bundle-mcp-runtime-config-zG-LRvm4.js";
import { a as partitionMcpServersByConnectionScope } from "./mcp-connection-resolver-CNpWj6Me.js";
import { t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-0yls35jH.js";
import { r as resolveProjectedMcpCodexToolApprovalMode } from "./mcp-codex-tool-approval-qr5rrC7E.js";
import "./mcp-auth-profile-B1ewV63P.js";
import "./runtime-status-BX_OpEuD.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-O-Pt_Xlu.js";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-vTfNYSKr.js";
import "./conversation-capability-profile-B0O-rXIc.js";
import "./exec-approvals-mcp-_J1mGbQ9.js";
import { n as serializeTomlInlineValue } from "./toml-inline-C1FYvw5-.js";
import "node:crypto";
//#region src/agents/bundle-mcp-adapter.ts
function normalizeMcpStringRecord(value) {
	if (!isRecord(value)) return;
	const entries = Object.entries(value).filter((entry) => {
		return typeof entry[1] === "string";
	});
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function decodeHeaderEnvPlaceholder(value) {
	const match = /^(Bearer )?\${([A-Z0-9_]+)}$/.exec(value);
	return match?.[2] ? {
		envVar: match[2],
		bearer: Boolean(match[1])
	} : null;
}
const COMMON_STRING_FIELDS = [
	"command",
	"cwd",
	"url"
];
function normalizeBundleMcpServerConfig(server, fields = {}) {
	const next = {};
	for (const field of [...COMMON_STRING_FIELDS, ...fields.strings ?? []]) if (typeof server[field] === "string") next[field] = server[field];
	for (const field of fields.booleans ?? []) if (typeof server[field] === "boolean") next[field] = server[field];
	const args = Array.isArray(server.args) && server.args.every((entry) => typeof entry === "string") ? [...server.args] : void 0;
	if (args) next.args = args;
	const env = normalizeMcpStringRecord(server.env);
	if (env) next.env = env;
	return next;
}
//#endregion
//#region src/agents/native-mcp-policy.ts
function buildPolicyProjectionTools(catalog) {
	const callableTools = buildBundleMcpToolsFromCatalog({ catalog }).filter((tool) => getPluginToolMeta(tool)?.mcp?.operation === "tool");
	const callableIdentities = new Set(callableTools.flatMap((tool) => {
		const mcp = getPluginToolMeta(tool)?.mcp;
		return mcp?.operation === "tool" ? [JSON.stringify([mcp.serverName, mcp.toolName])] : [];
	}));
	const hiddenPolicyTools = (catalog.policyTools ?? [...catalog.tools, ...catalog.sessionDeniedTools ?? []]).filter((tool) => !callableIdentities.has(JSON.stringify([tool.serverName, tool.toolName])));
	const hiddenTools = buildBundleMcpToolsFromCatalog({
		catalog: {
			...catalog,
			tools: hiddenPolicyTools,
			policyTools: void 0,
			sessionDeniedTools: void 0
		},
		reservedToolNames: callableTools.map((tool) => tool.name),
		includeAppOnlyInventory: true
	}).filter((tool) => getPluginToolMeta(tool)?.mcp?.operation === "tool");
	return [...callableTools, ...hiddenTools];
}
async function prepareNativeMcpPolicy(params) {
	params.runtime.markUsed();
	const allTools = buildPolicyProjectionTools(await params.runtime.getCatalog());
	const runtimeAllowed = applyEmbeddedAttemptToolsAllow(allTools, params.runtimeToolsAllow, { toolMeta: (tool) => getPluginToolMeta(tool) });
	const effectiveAllowed = applyFinalEffectiveToolPolicy({
		bundledTools: runtimeAllowed,
		config: params.config,
		workspaceDir: params.workspaceDir,
		conversationCapabilityProfile: params.capabilityProfile,
		warn: params.warn
	});
	const effectiveAllowedNames = new Set(effectiveAllowed.map((tool) => tool.name));
	const servers = {};
	for (const tool of allTools) {
		const mcp = getPluginToolMeta(tool)?.mcp;
		if (!mcp || mcp.operation !== "tool") continue;
		const server = servers[mcp.serverName] ??= {
			serverName: mcp.serverName,
			safeServerName: mcp.safeServerName,
			allowedTools: [],
			deniedTools: []
		};
		(!mcp.excludedFromAssistantCatalog && !mcp.deniedBySession && effectiveAllowedNames.has(tool.name) ? server.allowedTools : server.deniedTools).push(mcp.toolName);
	}
	for (const server of Object.values(servers)) {
		server.allowedTools = [...new Set(server.allowedTools)].toSorted();
		server.deniedTools = [...new Set(server.deniedTools)].toSorted();
	}
	return { servers: Object.fromEntries(Object.entries(servers).toSorted(([left], [right]) => left.localeCompare(right))) };
}
/** Applies one prepared policy to the provider-neutral MCP config shape. */
function applyPreparedNativeMcpPolicy(config, policy) {
	return { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).flatMap(([serverName, server]) => {
		const prepared = policy.servers[serverName];
		if (!prepared || prepared.allowedTools.length === 0) return [];
		const toolFilter = isRecord(server.toolFilter) ? server.toolFilter : {};
		return [[serverName, {
			...server,
			toolFilter: {
				...toolFilter,
				include: prepared.allowedTools,
				exclude: prepared.deniedTools
			}
		}]];
	})) };
}
/** Returns raw per-server denials for backends that enforce a deny list. */
function preparedNativeMcpDenials(policy) {
	const entries = Object.values(policy.servers).filter((server) => server.deniedTools.length > 0).map((server) => [server.serverName, server.deniedTools]);
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
//#endregion
//#region src/agents/codex-mcp-config.ts
function assertCodexExactToolFilters(serverName, fieldName, patterns) {
	const wildcard = patterns.find((pattern) => pattern.includes("*"));
	if (!wildcard) return;
	throw new Error(`Cannot project mcp.servers.${serverName}.toolFilter.${fieldName} pattern "${wildcard}" into Codex ${fieldName === "include" ? "enabled_tools" : "disabled_tools"}: Codex MCP projection only supports exact tool names.`);
}
function applyCodexToolFilter(next, name, server) {
	if (!isRecord(server.toolFilter)) return;
	const include = normalizeTrimmedStringList(server.toolFilter.include);
	const exclude = normalizeTrimmedStringList(server.toolFilter.exclude);
	assertCodexExactToolFilters(name, "include", include);
	assertCodexExactToolFilters(name, "exclude", exclude);
	if (include.length > 0) next.enabled_tools = include;
	if (exclude.length > 0) next.disabled_tools = exclude;
}
/** Normalizes one bundle MCP server into Codex's mcp_servers shape. */
function normalizeCodexMcpServerConfig(name, server, grants = []) {
	const next = normalizeBundleMcpServerConfig(server);
	const connectionTimeoutMs = clampPositiveTimerTimeoutMs(server.connectionTimeoutMs);
	const requestTimeoutMs = clampPositiveTimerTimeoutMs(server.requestTimeoutMs);
	if (connectionTimeoutMs !== void 0) next.startup_timeout_sec = connectionTimeoutMs / 1e3;
	if (requestTimeoutMs !== void 0) next.tool_timeout_sec = requestTimeoutMs / 1e3;
	if (typeof server.supportsParallelToolCalls === "boolean") next.supports_parallel_tool_calls = server.supportsParallelToolCalls;
	applyCodexToolFilter(next, name, server);
	const defaultToolsApprovalMode = resolveProjectedMcpCodexToolApprovalMode(name, server);
	if (defaultToolsApprovalMode) next.default_tools_approval_mode = defaultToolsApprovalMode;
	if (defaultToolsApprovalMode === void 0 || defaultToolsApprovalMode === "auto") {
		const tools = grants.filter((grant) => grant.server === name).map((grant) => [grant.tool, { approval_mode: "approve" }]).toSorted(([left], [right]) => left.localeCompare(right));
		if (tools.length > 0) next.tools = Object.fromEntries(tools);
	}
	const httpHeaders = normalizeMcpStringRecord(server.headers);
	if (httpHeaders) {
		const staticHeaders = {};
		const envHeaders = {};
		for (const [nameLocal, value] of Object.entries(httpHeaders)) {
			const decoded = decodeHeaderEnvPlaceholder(value);
			if (!decoded) {
				staticHeaders[nameLocal] = value;
				continue;
			}
			if (decoded.bearer && normalizeOptionalLowercaseString(nameLocal) === "authorization") {
				next.bearer_token_env_var = decoded.envVar;
				continue;
			}
			envHeaders[nameLocal] = decoded.envVar;
		}
		if (Object.keys(staticHeaders).length > 0) next.http_headers = staticHeaders;
		if (Object.keys(envHeaders).length > 0) next.env_http_headers = envHeaders;
	}
	return next;
}
/**
* Build Codex `mcp_servers` config from normalized bundle MCP config.
* Requester-scoped servers are excluded: harness-native MCP clients are
* session-shared and must never dial placeholder or requester-bound URLs.
*/
function buildCodexMcpServersConfig(config, grants = []) {
	const { staticServers } = partitionMcpServersByConnectionScope(config.mcpServers);
	return Object.fromEntries(Object.entries(staticServers).map(([name, server]) => [name, normalizeCodexMcpServerConfig(name, server, grants)]));
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-codex.ts
/**
* Codex CLI and app-server bundle MCP projection helpers.
*/
function normalizeAgentIds(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter((entry) => isValidAgentId(entry)).map((entry) => normalizeAgentId(entry));
}
function readCodexProjectionConfig(server) {
	return isRecord(server.codex) ? server.codex : {};
}
function isCodexMcpServerAllowedForAgent(server, options) {
	const codex = readCodexProjectionConfig(server);
	if (!Object.hasOwn(codex, "agents")) return true;
	const agentIds = normalizeAgentIds(codex.agents);
	if (agentIds.length === 0 || !options?.agentId) return false;
	return agentIds.includes(normalizeAgentId(options.agentId));
}
/**
* Applies Codex-only agent scoping before Assistant resolves credentials or opens transports.
* Session overrides may narrow this result, but cannot widen `codex.agents`.
*/
function resolveCodexMcpToolOverridesForAgent(cfg, options) {
	const deniedServerNames = Object.entries(normalizeConfiguredMcpServers(cfg?.mcp?.servers)).filter(([, server]) => !isCodexMcpServerAllowedForAgent(server, options)).map(([name]) => name);
	if (deniedServerNames.length === 0) return options.toolOverrides;
	const mcpServers = { ...options.toolOverrides?.mcpServers };
	for (const serverName of deniedServerNames) mcpServers[serverName] = false;
	return {
		...options.toolOverrides,
		mcpServers
	};
}
/** Returns Codex CLI args with TOML MCP server overrides injected. */
function injectCodexMcpConfigArgs(args, config) {
	const overrides = serializeTomlInlineValue(buildCodexMcpServersConfig(config));
	return [
		...args ?? [],
		"-c",
		`mcp_servers=${overrides}`
	];
}
//#endregion
export { preparedNativeMcpDenials as a, normalizeMcpStringRecord as c, prepareNativeMcpPolicy as i, resolveCodexMcpToolOverridesForAgent as n, decodeHeaderEnvPlaceholder as o, applyPreparedNativeMcpPolicy as r, normalizeBundleMcpServerConfig as s, injectCodexMcpConfigArgs as t };
