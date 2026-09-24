import "./sqlite-error-diagnostics-E0F_10pq.js";
import { T as string, b as object, k as unknown, y as number } from "./schemas-D6YHSiZI.js";
import { n as retainAssistantStateWorkerErrorPayload, t as hydrateAssistantStateWorkerError } from "./testclaw-state-worker-error-DudqzgpE.js";
import { t as restoreNativeErrorResponse } from "./native-error-response-DpO6PFN_.js";
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
function restoreAgentSchemaInspectionError(value) {
	const error = restoreNativeErrorResponse(value);
	if (value.stateError) retainAssistantStateWorkerErrorPayload(error, value.stateError);
	const restored = hydrateAssistantStateWorkerError(error);
	restored.message = value.message;
	return restored;
}
//#endregion
export { restoreAgentSchemaInspectionError as n, agentSchemaInspectionErrorSchema as t };
