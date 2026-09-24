import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import "./errors-cp9Var1Z.js";
import { i as AcpRuntimeError, r as ACP_ERROR_CODES } from "./errors-YLABO4Pj.js";
import { n as buildAcpDatabaseSessionKey } from "./session-meta-keys-DzM4byAj.js";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-DUdbrd94.js";
//#region src/acp/control-plane/manager.utils.ts
/** Shared ACP manager normalization, resolution, and error helpers. */
/** Resolves the agent id encoded in an ACP session key. */
function resolveAcpAgentFromSessionKey(sessionKey, fallback = "main") {
	const parsed = parseAgentSessionKey(sessionKey);
	return normalizeAgentId(parsed?.agentId ?? fallback);
}
/** Builds the stale-session error shown when ACP metadata is missing. */
function resolveMissingMetaError(sessionKey) {
	return new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `ACP metadata is missing for ${sessionKey}. Recreate this ACP session with /acp spawn and rebind the thread.`);
}
/** Converts a session resolution union into the runtime error callers should throw. */
function resolveAcpSessionResolutionError(resolution) {
	if (resolution.kind === "ready") return null;
	if (resolution.kind === "stale") return resolution.error;
	return new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `Session is not ACP-enabled: ${resolution.sessionKey}`);
}
/** Returns ready ACP metadata or throws the matching resolution error. */
function requireReadySessionMeta(resolution) {
	if (resolution.kind === "ready") return resolution.meta;
	throw toErrorObject(resolveAcpSessionResolutionError(resolution), "Non-Error thrown");
}
/** Resolve ownership before main aliases can erase the encoded agent namespace. */
function resolveAcpSessionTarget(params) {
	const normalized = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (!normalized) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
	const { agentId, storeSessionKey: sessionKey } = resolveSessionStorePathForAcp({
		...params,
		sessionKey: normalized
	});
	return {
		agentId,
		sessionKey
	};
}
/** Components normalize before encoding; base64url itself is case-sensitive. */
function acpSessionActorKey(target) {
	return buildAcpDatabaseSessionKey(normalizeLowercaseStringOrEmpty(target.sessionKey), target.agentId);
}
/** Restricts runtime-provided error codes to the ACP error-code enum. */
function normalizeAcpErrorCode(code) {
	if (!code) return "ACP_TURN_FAILED";
	const normalized = code.trim().toUpperCase();
	for (const allowed of ACP_ERROR_CODES) if (allowed === normalized) return allowed;
	return "ACP_TURN_FAILED";
}
function createUnsupportedControlError(params) {
	return new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", `ACP backend "${params.backend}" does not support ${params.control}.`);
}
function hasLegacyAcpIdentityProjection(meta) {
	const raw = meta;
	return Object.hasOwn(raw, "backendSessionId") || Object.hasOwn(raw, "agentSessionId") || Object.hasOwn(raw, "sessionIdsProvisional");
}
//#endregion
export { requireReadySessionMeta as a, resolveAcpSessionTarget as c, normalizeAcpErrorCode as i, resolveMissingMetaError as l, createUnsupportedControlError as n, resolveAcpAgentFromSessionKey as o, hasLegacyAcpIdentityProjection as r, resolveAcpSessionResolutionError as s, acpSessionActorKey as t };
