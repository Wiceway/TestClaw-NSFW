import { E as string, d as array, f as boolean, l as _enum, p as custom, x as object } from "./schemas-qz0osXyE.mjs";
import { ar as PluginRuntimeApplicationSchema } from "./sessions-D-UIbeC_.mjs";
import { r as MAX_CLAW_MANIFEST_BYTES } from "./reader-BU9kgCOF.mjs";
import { t as clawMonitorCleanupBindingSchema } from "./monitor-cleanup-contract-CbhVewFQ.mjs";
import { Value } from "typebox/value";
//#region src/claws/package-remove-contract.ts
const text = string().min(1).max(4096);
const digest = string().regex(/^sha256:[a-f0-9]{64}$/u);
const clawPackageRemovalRequestSchema = object({
	agentId: text,
	operationId: text,
	binding: clawMonitorCleanupBindingSchema,
	expectedInstallDigest: digest,
	expectedPackagePlanDigest: digest,
	cleanup: object({
		mode: _enum([
			"retain",
			"remove-if-unused",
			"remove-selected"
		]),
		selected: array(text).optional(),
		allowConflicts: boolean().optional()
	}).strict()
}).strict().refine((request) => Buffer.byteLength(JSON.stringify(request)) <= MAX_CLAW_MANIFEST_BYTES, "Package cleanup request exceeds the Claw manifest byte limit.");
const clawPackageRemovalResultSchema = object({
	packages: array(object({
		kind: _enum(["plugin", "skill"]),
		ref: text,
		version: text,
		action: _enum([
			"uninstalled",
			"retained",
			"error"
		]),
		reason: string().optional()
	}).strict()),
	warnings: array(string()).optional(),
	application: custom((value) => Value.Check(PluginRuntimeApplicationSchema, value)).optional()
}).strict();
//#endregion
export { clawPackageRemovalResultSchema as n, clawPackageRemovalRequestSchema as t };
