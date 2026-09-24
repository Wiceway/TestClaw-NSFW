import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { k as parseAgentSessionKey } from "./session-key-AvQIavYt.js";
import { i as markRuntimeCompactionDelegate } from "./compaction-watchdog-Cg7dxcCu.js";
import "./memory-state-CDjonGW3.js";
import "@testclaw/ai/internal/shared";
//#region src/context-engine/delegate.ts
const loadCompactRuntime = createLazyRuntimeModule(() => import("./compact.runtime-DGsgwNue.js"));
function assertCompactionSessionIdentity(params) {
	const targetAgentId = normalizeOptionalString(params.sessionTarget?.agentId);
	const targetSessionId = normalizeOptionalString(params.sessionTarget?.sessionId);
	const targetSessionKey = normalizeOptionalString(params.sessionTarget?.sessionKey);
	const requestedAgentId = normalizeOptionalString(params.agentId);
	const callerSessionId = normalizeOptionalString(params.sessionId);
	const requestedSessionKey = normalizeOptionalString(params.sessionKey);
	const requestedSessionKeyAgentId = parseAgentSessionKey(requestedSessionKey)?.agentId;
	if (requestedAgentId && targetAgentId && requestedAgentId !== targetAgentId || callerSessionId && targetSessionId && callerSessionId !== targetSessionId || requestedSessionKey && targetSessionKey && requestedSessionKey !== targetSessionKey || requestedSessionKeyAgentId && targetAgentId && requestedSessionKeyAgentId !== targetAgentId) throw new Error("Context-engine successor target conflicts with the caller session identity");
	const agentId = targetAgentId ?? requestedAgentId;
	const sessionKeyAgentId = parseAgentSessionKey(targetSessionKey ?? requestedSessionKey)?.agentId;
	if (sessionKeyAgentId && agentId && sessionKeyAgentId !== agentId) throw new Error("Context-engine successor session key conflicts with its agent identity");
}
/**
* Delegate a context-engine compaction request to Assistant's built-in runtime compaction path.
*
* This is the same bridge used by the legacy context engine. Third-party
* engines can call it from their own `compact()` implementations when they do
* not own the compaction algorithm but still need `/compact` and overflow
* recovery to use the stock runtime behavior.
*
* Note: `compactionTarget` is part of the public `compact()` contract, but the
* built-in runtime compaction path does not expose that knob. This helper
* ignores it to preserve legacy behavior; engines that need target-specific
* compaction should implement their own `compact()` algorithm.
*/
async function delegateCompactionToRuntime(params) {
	const runtimeContext = params.runtimeContext ?? {};
	const { sessionFile: _legacySessionFile, ...runtimeContextParams } = runtimeContext;
	const sessionTarget = params.sessionTarget ?? runtimeContext.sessionTarget;
	const agentId = params.agentId ?? runtimeContext.agentId;
	const sessionKey = params.sessionKey ?? runtimeContext.sessionKey;
	assertCompactionSessionIdentity({
		agentId,
		sessionId: params.sessionId,
		sessionKey,
		sessionTarget
	});
	const { compactEmbeddedAgentSessionOnDemand } = await loadCompactRuntime();
	const currentTokenCount = params.currentTokenCount ?? (typeof runtimeContext.currentTokenCount === "number" && Number.isFinite(runtimeContext.currentTokenCount) && runtimeContext.currentTokenCount > 0 ? Math.floor(runtimeContext.currentTokenCount) : void 0);
	const result = await compactEmbeddedAgentSessionOnDemand({
		...runtimeContextParams,
		contextEngineRuntimeContext: runtimeContext,
		agentId,
		sessionId: params.sessionId,
		sessionKey,
		sessionTarget,
		tokenBudget: params.tokenBudget,
		...currentTokenCount !== void 0 ? { currentTokenCount } : {},
		force: params.force,
		customInstructions: params.customInstructions,
		abortSignal: params.abortSignal,
		workspaceDir: typeof runtimeContext.workspaceDir === "string" ? runtimeContext.workspaceDir : process.cwd()
	});
	return {
		ok: result.ok,
		compacted: result.compacted,
		reason: result.reason,
		result: result.result ? {
			summary: result.result.summary,
			firstKeptEntryId: result.result.firstKeptEntryId,
			tokensBefore: result.result.tokensBefore,
			tokensAfter: result.result.tokensAfter,
			details: result.result.details,
			...result.result.sessionId ? { sessionId: result.result.sessionId } : {},
			...result.result.sessionTarget ? { sessionTarget: result.result.sessionTarget } : {}
		} : void 0
	};
}
markRuntimeCompactionDelegate(delegateCompactionToRuntime);
//#endregion
export { delegateCompactionToRuntime as t };
