import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.js";
import { h as isSessionWorkAdmissionActive } from "./session-lifecycle-admission-7kJ3kdsZ.js";
import { f as hasAgentRunContextExecutionOwner, m as listAgentRunsForSession } from "./agent-run-registry-DbPiDevk.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape, r as missingScopeErrorShape } from "./error-codes-DQWjOSek.js";
import { d as isEmbeddedAgentRunActive } from "./runs-CKg3ezhN.js";
//#region src/gateway/server-methods/sessions-patch-sandbox.runtime.ts
/** Recheck authority and idle execution at preparation and the synchronous write boundary. */
function validateSessionPatchSandboxChange(params) {
	if (params.client !== null && !params.client.connect.scopes?.includes("operator.admin")) return missingScopeErrorShape({
		missingScope: ADMIN_SCOPE,
		requiredScopes: [ADMIN_SCOPE]
	});
	const grantingConsent = typeof params.patch.nativeRuntimeConsent === "string";
	if (params.entry.sandbox === "required" && (params.entry.sandboxMode === "off" || grantingConsent)) return errorShape(ErrorCodes.INVALID_REQUEST, "This session requires a sandbox and cannot run without one.");
	if (grantingConsent && (!params.existingEntry || params.patch.expectedSessionId !== params.existingEntry.sessionId || params.patch.expectedLifecycleRevision !== params.existingEntry.lifecycleRevision)) return errorShape(ErrorCodes.INVALID_REQUEST, "Native runtime consent must target the current session incarnation.");
	if (!grantingConsent && params.existingEntry?.sandboxMode === params.entry.sandboxMode && params.existingEntry?.nativeRuntimeConsent === params.entry.nativeRuntimeConsent) return;
	const sessionId = params.existingEntry?.sessionId;
	const placement = sessionId ? params.context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId) : void 0;
	if (isSessionWorkAdmissionActive(params.storePath, params.lifecycleIdentities) || sessionId && isEmbeddedAgentRunActive(sessionId) || listAgentRunsForSession({
		sessionKey: params.sessionKey,
		sessionId
	}).some(({ runId }) => hasAgentRunContextExecutionOwner(runId)) || placement?.executionMode === "worker-turn" && placement.turnClaim) return errorShape(ErrorCodes.INVALID_REQUEST, "Stop the active run before changing this session's execution permissions.");
}
//#endregion
export { validateSessionPatchSandboxChange };
