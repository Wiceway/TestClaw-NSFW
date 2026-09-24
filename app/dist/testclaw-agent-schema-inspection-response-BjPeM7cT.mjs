import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { r as formatSqliteReadOnlyInspectionFailure } from "./sqlite-error-diagnostics-g2PTirPA.mjs";
import { A as unknown, E as string, b as number, x as object } from "./schemas-qz0osXyE.mjs";
import { n as hydrateAssistantStateWorkerError, r as retainAssistantStateWorkerErrorPayload, t as encodeAssistantStateWorkerError } from "./testclaw-state-worker-error-gYXwilzO.mjs";
import { n as serializeNativeErrorResponse, t as restoreNativeErrorResponse } from "./native-error-response-Bg_O-hkf.mjs";
//#region src/infra/native-error-response-schema.ts
const nativeErrorDetailsSchema = object({
	message: string(),
	code: string().optional(),
	errcode: number().optional()
});
//#endregion
//#region src/state/testclaw-agent-schema-inspection-response.ts
const agentSchemaInspectionErrorSchema = nativeErrorDetailsSchema.extend({
	name: string(),
	cause: nativeErrorDetailsSchema.optional()
}).extend({ stateError: unknown().optional() });
function serializeAgentSchemaInspectionError(value) {
	const error = toStringifiedError(value);
	return {
		...serializeNativeErrorResponse(error),
		message: formatSqliteReadOnlyInspectionFailure(error),
		stateError: encodeAssistantStateWorkerError(error)
	};
}
function restoreAgentSchemaInspectionError(value) {
	const error = restoreNativeErrorResponse(value);
	if (value.stateError) retainAssistantStateWorkerErrorPayload(error, value.stateError);
	const restored = hydrateAssistantStateWorkerError(error);
	restored.message = value.message;
	return restored;
}
//#endregion
export { restoreAgentSchemaInspectionError as n, serializeAgentSchemaInspectionError as r, agentSchemaInspectionErrorSchema as t };
