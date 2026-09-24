import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { i as listCoreToolSections, n as PROFILE_OPTIONS, o as resolveCoreToolProfiles } from "./tool-catalog-pszDlwnP.mjs";
import "./agent-scope-_30Scclc.mjs";
import { Eo as validateToolsCatalogParams } from "./src-BNV0SJoP.mjs";
import { l as getActivePluginRegistry } from "./runtime-D1tHq7F4.mjs";
import { r as getPluginToolMeta, t as buildPluginToolMetadataKey } from "./tool-metadata-CwykBqAo.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-CB3czZI3.mjs";
import { i as resolvePluginTools, r as ensureStandalonePluginToolRegistryLoaded } from "./tools-9SVmLvuj.mjs";
import { n as summarizeToolDescriptionText } from "./tool-description-summary-Ch0o0jSZ.mjs";
import { t as assertValidParams } from "./validation-uy_XyLdJ.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DePOhdT-.mjs";
//#region src/gateway/server-methods/tools-catalog.ts
function buildCoreGroups(params) {
	const swarmEnabled = resolveSwarmConfig(params.cfg, params.agentId).enabled;
	return listCoreToolSections({ swarmEnabled }).map((section) => ({
		id: section.id,
		label: section.label,
		source: "core",
		tools: section.tools.map((tool) => ({
			id: tool.id,
			label: tool.label,
			description: tool.description,
			source: "core",
			defaultProfiles: resolveCoreToolProfiles(tool.id)
		}))
	}));
}
function buildPluginGroups(params) {
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const agentDir = resolveAgentDir(params.cfg, params.agentId);
	const toolContext = {
		config: params.cfg,
		workspaceDir,
		agentDir,
		agentId: params.agentId
	};
	const toolRegistry = ensureStandalonePluginToolRegistryLoaded({
		context: toolContext,
		toolAllowlist: ["group:plugins"],
		allowGatewaySubagentBinding: true
	});
	const pluginTools = resolvePluginTools({
		context: toolContext,
		existingToolNames: params.existingToolNames,
		toolAllowlist: ["group:plugins"],
		suppressNameConflicts: true,
		allowGatewaySubagentBinding: true,
		runtimeRegistry: toolRegistry
	});
	const catalogRegistry = toolRegistry ?? getActivePluginRegistry();
	const groups = /* @__PURE__ */ new Map();
	const pluginToolMetadata = /* @__PURE__ */ new Map();
	if (catalogRegistry) for (const entry of catalogRegistry.toolMetadata) {
		const metadataKey = buildPluginToolMetadataKey(entry.pluginId, entry.metadata.toolName);
		pluginToolMetadata.set(metadataKey, entry.metadata);
	}
	const seenToolIds = /* @__PURE__ */ new Set();
	for (const tool of pluginTools) {
		const meta = getPluginToolMeta(tool);
		const pluginId = meta?.pluginId ?? "plugin";
		const groupId = `plugin:${pluginId}`;
		const existing = groups.get(groupId) ?? {
			id: groupId,
			label: pluginId,
			source: "plugin",
			pluginId,
			tools: []
		};
		const ownedMetadata = meta?.pluginId ? pluginToolMetadata.get(buildPluginToolMetadataKey(meta.pluginId, tool.name)) : void 0;
		existing.tools.push({
			id: tool.name,
			label: normalizeOptionalString(ownedMetadata?.displayName) ?? normalizeOptionalString(tool.label) ?? tool.name,
			description: summarizeToolDescriptionText({
				rawDescription: ownedMetadata?.description ?? (typeof tool.description === "string" ? tool.description : void 0),
				displaySummary: tool.displaySummary
			}),
			fullDescription: ownedMetadata?.description ?? (typeof tool.description === "string" ? tool.description : void 0),
			source: "plugin",
			pluginId,
			optional: meta?.optional,
			risk: ownedMetadata?.risk,
			tags: ownedMetadata?.tags,
			defaultProfiles: []
		});
		seenToolIds.add(tool.name);
		groups.set(groupId, existing);
	}
	for (const entry of catalogRegistry?.tools ?? []) {
		const names = entry.names.length > 0 ? entry.names : entry.declaredNames ?? [];
		for (const name of names) {
			if (seenToolIds.has(name) || params.existingToolNames.has(name)) continue;
			const groupId = `plugin:${entry.pluginId}`;
			const existing = groups.get(groupId) ?? {
				id: groupId,
				label: entry.pluginName ?? entry.pluginId,
				source: "plugin",
				pluginId: entry.pluginId,
				tools: []
			};
			const ownedMetadata = pluginToolMetadata.get(buildPluginToolMetadataKey(entry.pluginId, name));
			existing.tools.push({
				id: name,
				label: normalizeOptionalString(ownedMetadata?.displayName) ?? name,
				description: summarizeToolDescriptionText({ rawDescription: ownedMetadata?.description }) || `Plugin tool from ${entry.pluginName ?? entry.pluginId}`,
				fullDescription: ownedMetadata?.description,
				source: "plugin",
				pluginId: entry.pluginId,
				optional: entry.optional,
				risk: ownedMetadata?.risk,
				tags: ownedMetadata?.tags,
				defaultProfiles: []
			});
			seenToolIds.add(name);
			groups.set(groupId, existing);
		}
	}
	return Array.from(groups.values(), (group) => {
		group.tools = group.tools.toSorted((a, b) => a.id.localeCompare(b.id));
		return group;
	}).toSorted((a, b) => a.label.localeCompare(b.label));
}
/** Build the merged core/plugin tool catalog for one agent. */
function buildToolsCatalogResult(params) {
	const agentId = params.agentId;
	const includePlugins = params.includePlugins !== false;
	const groups = buildCoreGroups({
		cfg: params.cfg,
		agentId
	});
	if (includePlugins) {
		const existingToolNames = new Set(groups.flatMap((group) => group.tools.map((tool) => tool.id)));
		groups.push(...buildPluginGroups({
			cfg: params.cfg,
			agentId,
			existingToolNames
		}));
	}
	return {
		agentId,
		profiles: PROFILE_OPTIONS.map((profile) => ({
			id: profile.id,
			label: profile.label
		})),
		groups
	};
}
/** Gateway request handlers for tool catalog queries. */
const toolsCatalogHandlers = { "tools.catalog": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateToolsCatalogParams, "tools.catalog", respond)) return;
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: context.getRuntimeConfig(),
		normalize: normalizeOptionalString
	});
	if (!resolved) return;
	respond(true, buildToolsCatalogResult({
		cfg: resolved.cfg,
		agentId: resolved.agentId,
		includePlugins: params.includePlugins
	}), void 0);
} };
//#endregion
export { toolsCatalogHandlers };
