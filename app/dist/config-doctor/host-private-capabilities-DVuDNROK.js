import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/harness/host-private-capabilities.ts
const questionAnswerScope = new AsyncLocalStorage();
const questionAnswerCapabilities = /* @__PURE__ */ new WeakMap();
/** Retain the creator's prepared policy; a matching hash alone never grants authority. */
function createAgentQuestionAnswerAuthority(params) {
	return Object.freeze({
		sessionKey: params.sessionKey.trim(),
		assertActive: params.assertActive,
		admitTranscriptAnswer: params.admitTranscriptAnswer,
		assertCaller: (caller) => {
			params.assertActive();
			const projected = params.project(caller);
			params.assertActive();
			if (!params.fingerprint || projected !== params.fingerprint) throw new Error("question answer caller policy does not match its creator");
		}
	});
}
function withAgentQuestionAnswerAuthority(authority, run) {
	return questionAnswerScope.run(authority, run);
}
function registerAgentHarnessQuestionAnswerAuthority(hostCapabilities, authority) {
	questionAnswerCapabilities.set(hostCapabilities, authority);
}
/** An explicit host carrier cannot fall back to an unrelated ambient creator. */
function resolveAgentQuestionAnswerAuthority(hostCapabilities) {
	return hostCapabilities ? questionAnswerCapabilities.get(hostCapabilities) : questionAnswerScope.getStore();
}
function captureAgentQuestionAnswerAuthority(sessionKey) {
	const authority = questionAnswerScope.getStore();
	authority?.assertActive();
	if (authority && authority.sessionKey !== sessionKey.trim()) throw new Error("question creator authority belongs to another session");
	return authority;
}
const retainedBeforeToolCallRunners = /* @__PURE__ */ new WeakMap();
function registerAgentHarnessBeforeToolCallRetention(runBeforeToolCall, retain) {
	retainedBeforeToolCallRunners.set(runBeforeToolCall, retain);
}
const scheduledToolProjectionCapabilities = /* @__PURE__ */ new WeakMap();
const ttsProvenanceTransferCapabilities = /* @__PURE__ */ new WeakMap();
function registerAgentHarnessScheduledToolProjectionCapability(params) {
	scheduledToolProjectionCapabilities.set(params.hostCapabilities, Object.freeze({
		ownerPluginId: params.ownerPluginId,
		create: params.create
	}));
}
function registerAgentHarnessTtsProvenanceTransferCapability(params) {
	ttsProvenanceTransferCapabilities.set(params.hostCapabilities, Object.freeze({
		ownerPluginId: params.ownerPluginId,
		transfer: params.transfer
	}));
}
//#endregion
export { registerAgentHarnessScheduledToolProjectionCapability as a, withAgentQuestionAnswerAuthority as c, registerAgentHarnessQuestionAnswerAuthority as i, createAgentQuestionAnswerAuthority as n, registerAgentHarnessTtsProvenanceTransferCapability as o, registerAgentHarnessBeforeToolCallRetention as r, resolveAgentQuestionAnswerAuthority as s, captureAgentQuestionAnswerAuthority as t };
