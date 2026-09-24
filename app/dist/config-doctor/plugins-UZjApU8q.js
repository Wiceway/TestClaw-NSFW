import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { t as PluginCredentialDescriptorSchema } from "./plugin-credentials-CyBiUY68.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/control-ui-link-reader.ts
const ControlUiLinkReaderMetadataSchema = closedObject({
	hosts: Type.Array(Type.String({
		minLength: 1,
		maxLength: 253
	}), {
		minItems: 1,
		maxItems: 16
	}),
	pathPattern: Type.String({
		minLength: 2,
		maxLength: 1024
	}),
	detailMethod: Type.String({
		minLength: 1,
		maxLength: 128
	}),
	previewMethod: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	})),
	imageMethod: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 128
	}))
});
const ControlUiLinkReaderDescriptorSchema = closedObject({
	pluginId: NonEmptyString,
	id: NonEmptyString,
	label: NonEmptyString,
	icon: Type.Optional(Type.String()),
	linkReader: ControlUiLinkReaderMetadataSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/plugin-inspection.ts
/** Effective operator hook-policy grant with optional explicit config value. */
const PluginHookGrantSchema = closedObject({
	/** Effective policy after origin defaults and operator config. */
	effective: Type.Boolean(),
	/** Present only when plugins.entries.<id>.hooks sets the flag explicitly. */
	configured: Type.Optional(Type.Boolean())
});
/** Install provenance and pinned artifact integrity for one plugin. */
const PluginInspectSourceSchema = closedObject({
	kind: Type.Union([
		Type.Literal("bundled"),
		Type.Literal("clawhub"),
		Type.Literal("npm"),
		Type.Literal("git"),
		Type.Literal("path"),
		Type.Literal("archive"),
		Type.Literal("marketplace"),
		Type.Literal("official-catalog")
	]),
	spec: Type.Optional(NonEmptyString),
	packageName: Type.Optional(NonEmptyString),
	/** Pinned artifact integrity recorded at install (npm SSRI, sha-256, or git commit). */
	integrity: Type.Optional(NonEmptyString),
	integrityKind: Type.Optional(Type.Union([
		Type.Literal("ssri"),
		Type.Literal("sha256"),
		Type.Literal("git-commit")
	]))
});
/** Manifest-declared capability surface in enumerable terms. All arrays sorted. */
const PluginDeclaredSurfaceSchema = closedObject({
	channels: Type.Array(NonEmptyString),
	providers: Type.Array(NonEmptyString),
	tools: Type.Array(NonEmptyString),
	/** Manifest contract families and identifiers, rendered as `family: id`. */
	contracts: Type.Array(NonEmptyString),
	/** Bundle-format hook names; code plugins register hooks at runtime and list nothing here. */
	hooks: Type.Array(NonEmptyString),
	mcpServers: Type.Array(NonEmptyString),
	cliCommands: Type.Array(NonEmptyString),
	cliBackends: Type.Array(NonEmptyString),
	skills: Type.Array(NonEmptyString),
	/** Dot paths from configContracts.dangerousFlags. */
	dangerousConfigFlags: Type.Array(NonEmptyString)
});
/** Operator-granted capability flags with effective values. */
const PluginOperatorGrantsSchema = closedObject({
	hooks: closedObject({
		allowPromptInjection: PluginHookGrantSchema,
		allowConversationAccess: PluginHookGrantSchema
	}),
	llm: Type.Optional(closedObject({
		allowModelOverride: Type.Optional(Type.Boolean()),
		allowedModels: Type.Optional(Type.Array(NonEmptyString)),
		allowedCompletionModels: Type.Optional(Type.Array(NonEmptyString)),
		allowAuthProfileOverride: Type.Optional(Type.Boolean()),
		allowAgentIdOverride: Type.Optional(Type.Boolean())
	})),
	subagent: Type.Optional(closedObject({
		allowModelOverride: Type.Optional(Type.Boolean()),
		allowedModels: Type.Optional(Type.Array(NonEmptyString))
	}))
});
/** Persisted ClawHub per-release trust verdict from the install record. */
const PluginInstallTrustSchema = closedObject({
	disposition: Type.Union([
		Type.Literal("clean"),
		Type.Literal("review-recommended"),
		Type.Literal("review-required"),
		Type.Literal("blocked")
	]),
	reasons: Type.Optional(Type.Array(Type.String())),
	checkedAt: Type.Optional(NonEmptyString),
	acknowledgedAt: Type.Optional(NonEmptyString),
	pending: Type.Optional(Type.Boolean()),
	stale: Type.Optional(Type.Boolean())
});
/** Runtime-supported installed component lists plus detected-but-unavailable bundle facts. */
const PluginInstalledComponentsSchema = closedObject({
	/** Runtime-supported capability families; item arrays may be empty when names are unavailable. */
	mapped: Type.Array(NonEmptyString),
	skills: Type.Array(NonEmptyString),
	skillDetails: Type.Optional(Type.Array(closedObject({
		name: NonEmptyString,
		description: Type.Optional(Type.String())
	}))),
	mcpServers: Type.Array(NonEmptyString),
	commands: Type.Array(NonEmptyString),
	hooks: Type.Array(NonEmptyString),
	lspServers: Type.Array(NonEmptyString),
	unavailable: closedObject({
		capabilities: Type.Array(NonEmptyString),
		mcpServers: Type.Array(NonEmptyString),
		lspServers: Type.Array(NonEmptyString)
	})
});
/** Instance-local decision provider health; contains no evidence or credential details. */
const PluginDecisionProviderStatusSchema = closedObject({
	providerId: NonEmptyString,
	pluginId: NonEmptyString,
	configured: Type.Boolean(),
	credentialReady: Type.Boolean(),
	callable: Type.Boolean(),
	runtimeGeneration: NonEmptyString,
	recentSuccessAt: Type.Optional(Type.Integer({ minimum: 0 })),
	activeRequests: Type.Integer({ minimum: 0 }),
	successCount: Type.Integer({ minimum: 0 }),
	totalLatencyMs: Type.Number({ minimum: 0 }),
	usage: closedObject({
		inputTokens: Type.Number({ minimum: 0 }),
		outputTokens: Type.Number({ minimum: 0 })
	}),
	reasons: Type.Partial(closedObject({
		"credentials-unavailable": Type.Integer({ minimum: 0 }),
		authentication: Type.Integer({ minimum: 0 }),
		"rate-limited": Type.Integer({ minimum: 0 }),
		transport: Type.Integer({ minimum: 0 }),
		"unsupported-input": Type.Integer({ minimum: 0 }),
		"invalid-response": Type.Integer({ minimum: 0 }),
		disabled: Type.Integer({ minimum: 0 }),
		"not-configured": Type.Integer({ minimum: 0 }),
		retiring: Type.Integer({ minimum: 0 }),
		overloaded: Type.Integer({ minimum: 0 }),
		"circuit-open": Type.Integer({ minimum: 0 }),
		deadline: Type.Integer({ minimum: 0 })
	}), { additionalProperties: false })
});
//#endregion
//#region packages/gateway-protocol/src/schema/plugins.ts
/**
* Plugin control-surface protocol schemas.
*
* These payloads let the gateway expose plugin-provided UI actions without
* baking plugin-specific payload shapes into the core protocol.
*/
/** Arbitrary plugin-owned JSON payload carried opaquely through the gateway. */
const PluginJsonValueSchema = Type.Unknown();
/** Descriptor for one plugin-provided control UI action or surface. */
const PluginControlUiDescriptorSchema = closedObject({
	id: NonEmptyString,
	pluginId: NonEmptyString,
	pluginName: Type.Optional(NonEmptyString),
	surface: Type.Union([
		Type.Literal("session"),
		Type.Literal("tool"),
		Type.Literal("run"),
		Type.Literal("settings"),
		Type.Literal("tab"),
		Type.Literal("widget"),
		Type.Literal("link-reader")
	]),
	linkReader: Type.Optional(ControlUiLinkReaderMetadataSchema),
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	icon: Type.Optional(Type.String()),
	path: Type.Optional(Type.String()),
	placement: Type.Optional(Type.String()),
	group: Type.Optional(Type.Union([Type.Literal("control"), Type.Literal("agent")])),
	order: Type.Optional(Type.Number()),
	schema: Type.Optional(PluginJsonValueSchema),
	requiredScopes: Type.Optional(Type.Array(NonEmptyString))
});
/** Empty request payload for listing plugin UI descriptors. */
const PluginsUiDescriptorsParamsSchema = closedObject({});
const ControlUiPluginTabSchema = closedObject({
	pluginId: NonEmptyString,
	id: NonEmptyString,
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	icon: Type.Optional(Type.String()),
	path: Type.Optional(Type.String()),
	placement: Type.Optional(Type.String()),
	slug: Type.Optional(Type.String({
		pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
		maxLength: 64
	})),
	requiresGatewayAuth: Type.Optional(Type.Boolean()),
	group: Type.Optional(Type.Union([Type.Literal("control"), Type.Literal("agent")])),
	order: Type.Optional(Type.Number())
});
const ControlUiPluginWidgetKindSchema = closedObject({
	pluginId: NonEmptyString,
	kind: NonEmptyString,
	label: NonEmptyString
});
/** Response payload containing all plugin UI descriptors visible to the client. */
const PluginsUiDescriptorsResultSchema = closedObject({
	ok: Type.Literal(true),
	descriptors: Type.Array(PluginControlUiDescriptorSchema),
	generation: Type.Optional(Type.Integer({ minimum: 0 })),
	methods: Type.Optional(Type.Array(NonEmptyString)),
	controlUiTabs: Type.Optional(Type.Array(ControlUiPluginTabSchema)),
	controlUiWidgetKinds: Type.Optional(Type.Array(ControlUiPluginWidgetKindSchema)),
	controlUiLinkReaders: Type.Optional(Type.Array(ControlUiLinkReaderDescriptorSchema)),
	pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString))
});
/** One immutable browser build owned by an active native plugin. */
const PluginControlUiModuleSchema = closedObject({
	pluginId: NonEmptyString,
	name: NonEmptyString,
	revision: NonEmptyString,
	entryUrl: NonEmptyString,
	styles: Type.Array(NonEmptyString, { maxItems: 16 })
});
const PluginControlUiDiagnosticSchema = closedObject({
	pluginId: NonEmptyString,
	message: Type.String({ maxLength: 512 }),
	code: Type.Optional(Type.Literal("custom-plugin-ui-disabled"))
});
/** Lists browser builds; reading this catalog never reloads backend plugin code. */
const PluginsControlUiListParamsSchema = closedObject({});
const PluginsControlUiReloadParamsSchema = closedObject({ pluginId: Type.Optional(NonEmptyString) });
closedObject({
	revision: NonEmptyString,
	plugins: Type.Array(PluginControlUiModuleSchema, { maxItems: 64 }),
	diagnostics: Type.Array(PluginControlUiDiagnosticSchema, { maxItems: 64 })
});
closedObject({ revision: NonEmptyString });
const PluginsControlUiReportParamsSchema = closedObject({
	pluginId: NonEmptyString,
	revision: NonEmptyString,
	status: Type.Union([Type.Literal("activated"), Type.Literal("failed")]),
	error: Type.Optional(Type.String({ maxLength: 512 }))
});
const PluginsControlUiStatusParamsSchema = closedObject({ pluginId: Type.Optional(NonEmptyString) });
closedObject({ clients: Type.Array(closedObject({
	connId: NonEmptyString,
	activations: Type.Array(PluginsControlUiReportParamsSchema, { maxItems: 64 })
}), { maxItems: 128 }) });
/** Request payload for invoking one plugin-owned session action. */
const PluginsSessionActionParamsSchema = closedObject({
	pluginId: NonEmptyString,
	actionId: NonEmptyString,
	sessionKey: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	payload: Type.Optional(PluginJsonValueSchema)
});
/** Successful plugin action result, optionally continuing the agent turn. */
const PluginsSessionActionSuccessResultSchema = closedObject({
	ok: Type.Literal(true),
	result: Type.Optional(PluginJsonValueSchema),
	continueAgent: Type.Optional(Type.Boolean()),
	reply: Type.Optional(PluginJsonValueSchema)
});
/** Failed plugin action result with plugin-owned detail payload. */
const PluginsSessionActionFailureResultSchema = closedObject({
	ok: Type.Literal(false),
	error: Type.String(),
	code: Type.Optional(Type.String()),
	details: Type.Optional(PluginJsonValueSchema)
});
/** Discriminated plugin action result returned to gateway clients. */
const PluginsSessionActionResultSchema = Type.Union([PluginsSessionActionSuccessResultSchema, PluginsSessionActionFailureResultSchema]);
/** ClawHub-backed install action for one catalog entry. */
const PluginCatalogClawHubInstallSchema = closedObject({
	source: Type.Literal("clawhub"),
	packageName: NonEmptyString
});
/** Official-catalog install action for one catalog entry. */
const PluginCatalogOfficialInstallSchema = closedObject({
	source: Type.Literal("official"),
	pluginId: NonEmptyString
});
const PluginCatalogInstallActionSchema = Type.Union([PluginCatalogClawHubInstallSchema, PluginCatalogOfficialInstallSchema]);
/** Observed state of the plugin in the current Gateway runtime generation. */
const PluginRuntimeStatusSchema = closedObject({
	state: Type.Union([
		Type.Literal("unloaded"),
		Type.Literal("disabled"),
		Type.Literal("active"),
		Type.Literal("service-failed")
	]),
	error: Type.Optional(Type.String())
});
/** Catalog metadata and desired enablement, with optional observed runtime state. */
const PluginCatalogEntrySchema = closedObject({
	id: NonEmptyString,
	name: NonEmptyString,
	packageName: Type.Optional(NonEmptyString),
	/** Canonical ClawHub identity proven by install provenance or the official catalog. */
	clawhubPackage: Type.Optional(NonEmptyString),
	/** Opaque discovery identity for loading optional ClawHub presentation metadata. */
	catalogId: Type.Optional(NonEmptyString),
	description: Type.Optional(Type.String()),
	version: Type.Optional(NonEmptyString),
	kind: Type.Optional(Type.Array(NonEmptyString)),
	origin: Type.Optional(NonEmptyString),
	installed: Type.Boolean(),
	enabled: Type.Boolean(),
	state: Type.Union([
		Type.Literal("enabled"),
		Type.Literal("disabled"),
		Type.Literal("needs-setup"),
		Type.Literal("not-installed"),
		Type.Literal("error")
	]),
	featured: Type.Optional(Type.Boolean()),
	featuredAt: Type.Optional(Type.Integer({ minimum: 0 })),
	order: Type.Optional(Type.Number()),
	/** True when the gateway can resolve a manifest or catalog icon for this plugin identity. */
	hasIcon: Type.Optional(Type.Boolean()),
	/** True when the installed package supplies a default compact activity glyph. */
	hasActivityIcon: Type.Optional(Type.Boolean()),
	/** Exact effective tool IDs with package-owned activity glyph overrides. */
	activityIconTools: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 128,
		pattern: "^[A-Za-z0-9_][A-Za-z0-9_.-]*$"
	}), { maxItems: 128 })),
	/** Channel identities declared by this installed plugin. */
	channelIds: Type.Optional(Type.Array(NonEmptyString)),
	install: Type.Optional(PluginCatalogInstallActionSchema),
	error: Type.Optional(Type.String()),
	runtime: Type.Optional(PluginRuntimeStatusSchema),
	/** Ordered package or registry categories; the first category is primary. */
	categories: Type.Optional(Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 3
	})),
	/** Compatibility projection of the primary category. */
	category: Type.Optional(NonEmptyString),
	/** True when the plugin has an install record and can be removed via plugins.uninstall. */
	removable: Type.Optional(Type.Boolean())
});
/** Empty request payload for the cold plugin catalog. */
const PluginsListParamsSchema = closedObject({});
closedObject({
	generation: Type.Optional(Type.Integer({ minimum: 0 })),
	plugins: Type.Array(PluginCatalogEntrySchema),
	diagnostics: Type.Array(Type.Unknown()),
	mutationAllowed: Type.Boolean()
});
/** Request payload for inspecting one plugin's declared capability surface. */
const PluginsInspectParamsSchema = closedObject({ pluginId: NonEmptyString });
/** Newly declared capability items grouped by their existing manifest surface. */
const PluginDeclaredSurfaceWideningSchema = Type.Partial(PluginDeclaredSurfaceSchema, { additionalProperties: false });
closedObject({
	capabilityConsentCode: Type.Literal("PLUGIN_CAPABILITY_CONSENT_REQUIRED"),
	pluginId: NonEmptyString,
	reviewToken: NonEmptyString,
	widened: Type.Optional(PluginDeclaredSurfaceWideningSchema),
	acceptedAt: Type.Optional(NonEmptyString)
});
const PluginCapabilityAcknowledgmentSchema = closedObject({ reviewToken: NonEmptyString });
/** Request payload for searching installable ClawHub plugin families. */
const PluginsSearchParamsSchema = closedObject({
	query: NonEmptyString,
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
/** ClawHub package fields exposed by plugin search. */
const PluginSearchPackageSchema = closedObject({
	name: NonEmptyString,
	displayName: NonEmptyString,
	family: Type.Union([Type.Literal("code-plugin"), Type.Literal("bundle-plugin")]),
	channel: Type.Union([
		Type.Literal("official"),
		Type.Literal("community"),
		Type.Literal("private")
	]),
	isOfficial: Type.Boolean(),
	summary: Type.Optional(Type.String()),
	latestVersion: Type.Optional(NonEmptyString),
	runtimeId: Type.Optional(NonEmptyString),
	downloads: Type.Optional(Type.Number({ minimum: 0 })),
	verificationTier: Type.Optional(NonEmptyString)
});
/** Ranked ClawHub plugin search hit. */
const PluginSearchResultEntrySchema = closedObject({
	score: Type.Number(),
	package: PluginSearchPackageSchema
});
closedObject({ results: Type.Array(PluginSearchResultEntrySchema) });
const PluginDiscoveryIntentSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("bundled"),
	Type.Literal("trending"),
	Type.Literal("official"),
	Type.Literal("featured")
]);
const PluginDiscoveryIconKeySchema = Type.String({
	minLength: 1,
	maxLength: 64,
	pattern: "^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"
});
const PluginDiscoveryCategorySchema = closedObject({
	slug: NonEmptyString,
	label: NonEmptyString,
	description: NonEmptyString,
	icon: PluginDiscoveryIconKeySchema,
	order: Type.Integer({ minimum: 0 })
});
const PluginDiscoveryCatalogFactsSchema = closedObject({
	name: NonEmptyString,
	packageName: Type.Optional(NonEmptyString),
	summary: Type.Optional(Type.String()),
	family: Type.Optional(Type.Union([Type.Literal("code-plugin"), Type.Literal("bundle-plugin")])),
	author: Type.Optional(NonEmptyString),
	official: Type.Boolean(),
	categories: Type.Array(NonEmptyString),
	icon: Type.Optional(PluginDiscoveryIconKeySchema),
	imageUrl: Type.Optional(NonEmptyString),
	latestVersion: Type.Optional(NonEmptyString),
	downloads: Type.Optional(Type.Number({ minimum: 0 })),
	installs: Type.Optional(Type.Number({ minimum: 0 })),
	verificationTier: Type.Optional(NonEmptyString),
	featured: Type.Optional(Type.Boolean()),
	trending: Type.Optional(Type.Boolean()),
	featuredRank: Type.Optional(Type.Integer({ minimum: 0 })),
	trendingRank: Type.Optional(Type.Integer({ minimum: 0 })),
	publishedToClawHub: Type.Optional(Type.Boolean())
});
const PluginDiscoveryLocalFactsSchema = closedObject({
	present: Type.Boolean(),
	installed: Type.Boolean(),
	enabled: Type.Boolean(),
	state: Type.Union([
		Type.Literal("enabled"),
		Type.Literal("disabled"),
		Type.Literal("needs-setup"),
		Type.Literal("not-installed"),
		Type.Literal("error")
	]),
	pluginId: Type.Optional(NonEmptyString),
	install: Type.Optional(PluginCatalogInstallActionSchema),
	action: Type.Union([
		Type.Literal("install"),
		Type.Literal("manage"),
		Type.Literal("unavailable")
	])
});
const PluginDiscoveryEntrySchema = closedObject({
	id: Type.String({
		minLength: 1,
		maxLength: 512,
		pattern: "^[A-Za-z0-9_-]+$"
	}),
	catalog: PluginDiscoveryCatalogFactsSchema,
	local: PluginDiscoveryLocalFactsSchema
});
const PluginsCatalogBrowseParamsSchema = closedObject({
	query: Type.Optional(Type.String({ maxLength: 200 })),
	searchSource: Type.Optional(Type.Literal("testclaw-control-ui")),
	intent: Type.Optional(PluginDiscoveryIntentSchema),
	category: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 64,
		pattern: "^[a-z][a-z0-9-]*$"
	})),
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 4096
	})),
	pageSize: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	}))
});
closedObject({
	items: Type.Array(PluginDiscoveryEntrySchema),
	categories: Type.Optional(Type.Array(PluginDiscoveryCategorySchema)),
	nextCursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 4096
	})),
	remoteError: Type.Optional(Type.String())
});
const PluginsCatalogCategoriesParamsSchema = closedObject({});
closedObject({ categories: Type.Array(PluginDiscoveryCategorySchema) });
const PluginsCatalogGetParamsSchema = closedObject({
	id: Type.String({
		minLength: 1,
		maxLength: 512,
		pattern: "^[A-Za-z0-9_-]+$"
	}),
	version: Type.Optional(NonEmptyString)
});
const PluginDiscoveryCompatibilitySchema = closedObject({
	pluginApiRange: Type.Optional(NonEmptyString),
	builtWithAssistantVersion: Type.Optional(NonEmptyString),
	pluginSdkVersion: Type.Optional(NonEmptyString),
	minGatewayVersion: Type.Optional(NonEmptyString)
});
const PluginDiscoveryConfigFieldSchema = closedObject({
	name: NonEmptyString,
	description: Type.Optional(Type.String()),
	required: Type.Boolean(),
	sensitive: Type.Boolean()
});
const PluginDiscoveryVersionSchema = closedObject({
	version: NonEmptyString,
	createdAt: Type.Integer({ minimum: 0 }),
	changelog: Type.String(),
	tags: Type.Array(NonEmptyString)
});
const PluginDiscoveryDetailSchema = closedObject({
	origin: Type.Union([Type.Literal("clawhub"), Type.Literal("local")]),
	packageName: Type.Optional(NonEmptyString),
	author: Type.Optional(closedObject({
		handle: Type.Optional(NonEmptyString),
		displayName: Type.Optional(NonEmptyString),
		imageUrl: Type.Optional(NonEmptyString),
		official: Type.Optional(Type.Boolean())
	})),
	topics: Type.Array(NonEmptyString),
	createdAt: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAt: Type.Optional(Type.Integer({ minimum: 0 })),
	readme: Type.Optional(Type.String({ maxLength: 524288 })),
	repositoryUrl: Type.Optional(NonEmptyString),
	documentationUrl: Type.Optional(NonEmptyString),
	compatibility: Type.Optional(PluginDiscoveryCompatibilitySchema),
	contracts: Type.Optional(Type.Record(NonEmptyString, Type.Array(NonEmptyString))),
	providers: Type.Optional(Type.Array(NonEmptyString)),
	channels: Type.Optional(Type.Array(NonEmptyString)),
	configuration: Type.Array(PluginDiscoveryConfigFieldSchema),
	mcpServers: Type.Array(NonEmptyString),
	skills: Type.Array(closedObject({
		name: NonEmptyString,
		description: Type.Optional(Type.String())
	})),
	versions: Type.Array(PluginDiscoveryVersionSchema, { maxItems: 10 }),
	verification: Type.Optional(closedObject({
		tier: NonEmptyString,
		summary: Type.Optional(Type.String()),
		sourceRepo: Type.Optional(NonEmptyString),
		sourceCommit: Type.Optional(NonEmptyString),
		sourcePath: Type.Optional(NonEmptyString),
		scanStatus: Type.Optional(NonEmptyString)
	})),
	security: Type.Optional(closedObject({
		status: NonEmptyString,
		auditUrl: Type.Optional(NonEmptyString),
		verdict: Type.Optional(NonEmptyString),
		summary: Type.Optional(Type.String()),
		guidance: Type.Optional(Type.String()),
		checkedAt: Type.Optional(Type.Integer({ minimum: 0 }))
	}))
});
const PluginsCatalogGetResultSchema = closedObject({
	plugin: PluginDiscoveryEntrySchema,
	detail: PluginDiscoveryDetailSchema
});
closedObject({
	ok: Type.Literal(true),
	overview: Type.Optional(closedObject({
		readme: Type.Optional(Type.String({ maxLength: 524288 })),
		repositoryUrl: Type.Optional(NonEmptyString),
		documentationUrl: Type.Optional(NonEmptyString),
		publisherName: Type.Optional(NonEmptyString)
	})),
	credentials: Type.Optional(Type.Array(PluginCredentialDescriptorSchema)),
	decisions: Type.Optional(Type.Array(PluginDecisionProviderStatusSchema)),
	plugin: closedObject({
		id: NonEmptyString,
		name: NonEmptyString,
		version: Type.Optional(NonEmptyString),
		description: Type.Optional(Type.String()),
		origin: Type.Optional(NonEmptyString),
		installed: Type.Boolean(),
		enabled: Type.Boolean()
	}),
	source: Type.Optional(PluginInspectSourceSchema),
	declared: PluginDeclaredSurfaceSchema,
	components: PluginInstalledComponentsSchema,
	reviewToken: NonEmptyString,
	grants: PluginOperatorGrantsSchema,
	trust: Type.Optional(PluginInstallTrustSchema),
	/** Exact installed-version ClawHub metadata when a canonical package match exists. */
	catalog: Type.Optional(PluginsCatalogGetResultSchema)
});
const PluginInstallOptions = {
	mode: Type.Optional(Type.Union([Type.Literal("install"), Type.Literal("update")])),
	acknowledgeInstallPolicyWarning: Type.Optional(Type.Literal(true)),
	acknowledgeCapabilities: Type.Optional(PluginCapabilityAcknowledgmentSchema)
};
/** Source intent only; install provenance and capability review remain host-owned. */
const PluginsInstallParamsSchema = Type.Union([
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("clawhub"),
		packageName: NonEmptyString,
		version: Type.Optional(NonEmptyString),
		expectedPluginId: Type.Optional(NonEmptyString),
		expectedIntegrity: Type.Optional(NonEmptyString)
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("official"),
		pluginId: NonEmptyString,
		version: Type.Optional(Type.Literal("latest")),
		pin: Type.Optional(Type.Boolean())
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("npm"),
		spec: NonEmptyString,
		pin: Type.Optional(Type.Boolean()),
		expectedPluginId: Type.Optional(NonEmptyString),
		expectedIntegrity: Type.Optional(NonEmptyString)
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("git"),
		spec: NonEmptyString
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("local"),
		path: NonEmptyString,
		link: Type.Optional(Type.Boolean())
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("npm-pack"),
		archivePath: NonEmptyString
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("marketplace"),
		marketplace: NonEmptyString,
		plugin: NonEmptyString
	}),
	closedObject({
		...PluginInstallOptions,
		source: Type.Literal("bundled"),
		pluginId: NonEmptyString,
		spec: Type.Optional(NonEmptyString)
	})
]);
/** Receipt emitted only after the requested runtime generation was applied. */
const PluginRuntimeApplicationSchema = closedObject({
	operationId: NonEmptyString,
	generation: Type.Integer({ minimum: 0 }),
	pluginIds: Type.Array(NonEmptyString),
	sourceDigests: Type.Optional(Type.Record(NonEmptyString, NonEmptyString))
});
closedObject({ generation: Type.Integer({ minimum: 0 }) });
closedObject({
	ok: Type.Literal(true),
	plugin: PluginCatalogEntrySchema,
	restartRequired: Type.Boolean(),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Internal signal that persisted plugin metadata changed outside the Gateway process. */
const PluginsRefreshParamsSchema = closedObject({});
closedObject({
	ok: Type.Literal(true),
	restartRequired: Type.Optional(Type.Boolean()),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	warnings: Type.Optional(Type.Array(Type.String()))
});
const PluginReloadTargetSchema = closedObject({
	pluginId: NonEmptyString,
	installHash: Type.Optional(Type.String({ pattern: "^[a-f0-9]{64}$" })),
	sourceDigests: Type.Optional(Type.Record(NonEmptyString, Type.String({ pattern: "^[a-f0-9]{64}$" })))
});
const PluginsReloadParamsSchema = closedObject({
	plugins: Type.Array(PluginReloadTargetSchema, {
		minItems: 1,
		maxItems: 64,
		uniqueItems: true
	}),
	acknowledgeCapabilities: Type.Optional(PluginCapabilityAcknowledgmentSchema)
});
closedObject({
	ok: Type.Literal(true),
	pluginIds: Type.Array(NonEmptyString, {
		minItems: 1,
		maxItems: 64
	}),
	restartRequired: Type.Literal(false),
	runtime: PluginRuntimeApplicationSchema,
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Request payload for removing one installed plugin and its managed files. */
const PluginsUninstallParamsSchema = closedObject({
	pluginId: NonEmptyString,
	keepFiles: Type.Optional(Type.Boolean())
});
closedObject({
	ok: Type.Literal(true),
	pluginId: NonEmptyString,
	restartRequired: Type.Boolean(),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	removed: Type.Array(Type.String()),
	warnings: Type.Optional(Type.Array(Type.String()))
});
/** Request payload for changing one installed plugin's policy state. */
const PluginsSetEnabledParamsSchema = closedObject({
	pluginId: NonEmptyString,
	enabled: Type.Boolean(),
	allowlistPolicy: Type.Optional(Type.Literal("preserve")),
	acknowledgeCapabilities: Type.Optional(PluginCapabilityAcknowledgmentSchema)
});
closedObject({
	ok: Type.Literal(true),
	plugin: PluginCatalogEntrySchema,
	restartRequired: Type.Boolean(),
	runtime: Type.Optional(PluginRuntimeApplicationSchema),
	warnings: Type.Optional(Type.Array(Type.String()))
});
//#endregion
export { PluginsUninstallParamsSchema as C, PluginsUiDescriptorsResultSchema as S, PluginsSearchParamsSchema as _, PluginsCatalogBrowseParamsSchema as a, PluginsSetEnabledParamsSchema as b, PluginsControlUiListParamsSchema as c, PluginsControlUiStatusParamsSchema as d, PluginsInspectParamsSchema as f, PluginsReloadParamsSchema as g, PluginsRefreshParamsSchema as h, PluginRuntimeApplicationSchema as i, PluginsControlUiReloadParamsSchema as l, PluginsListParamsSchema as m, ControlUiPluginWidgetKindSchema as n, PluginsCatalogCategoriesParamsSchema as o, PluginsInstallParamsSchema as p, PluginJsonValueSchema as r, PluginsCatalogGetParamsSchema as s, ControlUiPluginTabSchema as t, PluginsControlUiReportParamsSchema as u, PluginsSessionActionParamsSchema as v, ControlUiLinkReaderDescriptorSchema as w, PluginsUiDescriptorsParamsSchema as x, PluginsSessionActionResultSchema as y };
