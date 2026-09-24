import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { i as summarizeMigrationItems } from "./migration-Dn56qIS6.js";
import { t as withPluginMigrationProviders } from "./migration-provider-runtime-Dwz5MxNt.js";
import { t as buildMigrationContext } from "./context-Dqd6TkZg.js";
import { t as runMigrationApply } from "./apply-Bm3RycCl.js";
import { t as bindMemoryMigrationPlanSources } from "./memory-migration-source-DWEFj8lS.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/migrations.ts
const MAX_MEMORY_MIGRATION_ITEMS = 2e3;
const MemoryMigrationPlanFingerprintSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
const MemoryMigrationItemStatusSchema = Type.Union([
	Type.Literal("planned"),
	Type.Literal("migrated"),
	Type.Literal("skipped"),
	Type.Literal("warning"),
	Type.Literal("conflict"),
	Type.Literal("error")
]);
const MemoryMigrationItemSchema = Type.Object({
	id: NonEmptyString,
	status: MemoryMigrationItemStatusSchema,
	source: Type.Optional(NonEmptyString),
	target: Type.Optional(NonEmptyString),
	message: Type.Optional(Type.String()),
	reason: Type.Optional(Type.String()),
	details: Type.Optional(Type.Record(Type.String(), Type.Unknown()))
}, { additionalProperties: false });
const MemoryMigrationSummarySchema = Type.Object({
	total: Type.Integer({ minimum: 0 }),
	planned: Type.Integer({ minimum: 0 }),
	migrated: Type.Integer({ minimum: 0 }),
	skipped: Type.Integer({ minimum: 0 }),
	conflicts: Type.Integer({ minimum: 0 }),
	errors: Type.Integer({ minimum: 0 }),
	sensitive: Type.Integer({ minimum: 0 })
}, { additionalProperties: false });
const MemoryMigrationProviderPlanSchema = Type.Object({
	providerId: NonEmptyString,
	label: NonEmptyString,
	description: Type.Optional(Type.String()),
	planFingerprint: Type.Optional(MemoryMigrationPlanFingerprintSchema),
	found: Type.Boolean(),
	source: Type.Optional(NonEmptyString),
	target: Type.Optional(NonEmptyString),
	confidence: Type.Optional(Type.Union([
		Type.Literal("low"),
		Type.Literal("medium"),
		Type.Literal("high")
	])),
	message: Type.Optional(Type.String()),
	error: Type.Optional(Type.String()),
	summary: MemoryMigrationSummarySchema,
	items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
	warnings: Type.Optional(Type.Array(Type.String()))
}, { additionalProperties: false });
const MigrationsMemoryPlanParamsSchema = Type.Object({
	agentId: NonEmptyString,
	overwrite: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
Type.Object({
	agentId: NonEmptyString,
	workspace: NonEmptyString,
	providers: Type.Array(MemoryMigrationProviderPlanSchema)
}, { additionalProperties: false });
const MigrationsMemoryApplyParamsSchema = Type.Object({
	idempotencyKey: NonEmptyString,
	agentId: NonEmptyString,
	providerId: NonEmptyString,
	planFingerprint: MemoryMigrationPlanFingerprintSchema,
	itemIds: Type.Array(NonEmptyString, {
		minItems: 1,
		uniqueItems: true,
		maxItems: MAX_MEMORY_MIGRATION_ITEMS
	}),
	overwrite: Type.Optional(Type.Boolean())
}, { additionalProperties: false });
Type.Object({
	providerId: NonEmptyString,
	source: NonEmptyString,
	target: Type.Optional(NonEmptyString),
	summary: MemoryMigrationSummarySchema,
	items: Type.Array(MemoryMigrationItemSchema, { maxItems: MAX_MEMORY_MIGRATION_ITEMS }),
	warnings: Type.Optional(Type.Array(Type.String())),
	backupPath: Type.Optional(NonEmptyString),
	reportDir: Type.Optional(NonEmptyString)
}, { additionalProperties: false });
//#endregion
//#region src/commands/migrate/memory-import.ts
/** Canonical memory-only migration planning and apply policy for embedded surfaces. */
const MEMORY_ITEM_KIND = "memory";
const silentRuntime = {
	log() {},
	error() {},
	exit(code) {
		throw new Error(`migration exited with ${code}`);
	}
};
async function withMemoryMigrationProviders(config, run, onCleanupError) {
	return await withPluginMigrationProviders({
		cfg: config,
		onCleanupError
	}, async (providers) => await run(providers.filter((provider) => provider.supportedItemKinds?.includes(MEMORY_ITEM_KIND))));
}
function shapeMemoryOnlyPlan(plan) {
	const items = plan.items.filter((item) => item.kind === MEMORY_ITEM_KIND);
	if (items.length > 2e3) throw new Error(`memory import found ${items.length} items; the maximum is ${MAX_MEMORY_MIGRATION_ITEMS}. Narrow or split the source memory before importing.`);
	const itemIds = /* @__PURE__ */ new Set();
	for (const item of items) {
		if (itemIds.has(item.id)) throw new Error(`duplicate memory migration item id "${item.id}"`);
		itemIds.add(item.id);
	}
	const unsupported = items.find((item) => (item.status === "planned" || item.status === "conflict") && item.action !== "copy");
	if (unsupported) throw new Error(`memory import only supports copy actions; ${unsupported.id} uses ${unsupported.action}`);
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
async function planProviderMemoryImport(params) {
	const ctx = buildMigrationContext({
		runtime: params.runtime ?? silentRuntime,
		configOverride: params.config,
		targetAgentId: params.agentId,
		itemKinds: [MEMORY_ITEM_KIND],
		overwrite: params.overwrite,
		json: true
	});
	const detection = await params.provider.detect?.(ctx);
	if (detection && !detection.found) return {
		detection,
		plan: {
			providerId: params.provider.id,
			source: detection.source ?? "",
			summary: summarizeMigrationItems([]),
			items: []
		}
	};
	return {
		detection,
		plan: await bindMemoryMigrationPlanSources(shapeMemoryOnlyPlan(await params.provider.plan(ctx)), { includeConflicts: params.overwrite === true })
	};
}
async function applyProviderMemoryImport(params) {
	return await runMigrationApply({
		runtime: params.runtime ?? silentRuntime,
		providerId: params.provider.id,
		provider: params.provider,
		onApplyCompleted: params.onApplyCompleted,
		opts: {
			yes: true,
			json: true,
			configOverride: params.config,
			targetAgentId: params.agentId,
			itemKinds: [MEMORY_ITEM_KIND],
			itemIds: params.itemIds,
			overwrite: params.overwrite,
			preflightPlan: params.preflightPlan,
			allowPartialResult: true
		}
	});
}
//#endregion
export { MigrationsMemoryPlanParamsSchema as a, MigrationsMemoryApplyParamsSchema as i, planProviderMemoryImport as n, withMemoryMigrationProviders as r, applyProviderMemoryImport as t };
