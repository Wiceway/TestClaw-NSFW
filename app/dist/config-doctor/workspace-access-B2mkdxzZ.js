import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.js";
import { d as readPersistedMediaFacts } from "./media-facts-CfqEsuNX.js";
import path from "node:path";
//#region src/agents/workspace-access.ts
const bindings = /* @__PURE__ */ new Map();
function assertBindingCurrent(key, binding) {
	if (!binding.active || bindings.get(key) !== binding) throw new WorkspaceAccessUnavailableError("Workspace access is stopped or not ready");
}
const WORKSPACE_ACCESS_UNAVAILABLE_CODE = "WORKSPACE_ACCESS_UNAVAILABLE";
/** The configured workspace host cannot currently provide the requested data. */
var WorkspaceAccessUnavailableError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = WORKSPACE_ACCESS_UNAVAILABLE_CODE;
		this.name = "WorkspaceAccessUnavailableError";
	}
};
/** Match wrapped errors and separate SDK module instances without parsing messages. */
function isWorkspaceAccessUnavailableError(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === WORKSPACE_ACCESS_UNAVAILABLE_CODE);
}
function getAgentWorkspaceAccess(workspaceDir, capability) {
	const key = path.resolve(workspaceDir);
	const binding = bindings.get(key);
	if (capability && binding?.access && !binding.access[capability]) return;
	if (binding) assertBindingCurrent(key, binding);
	return binding?.access;
}
/** Internal routing capture: unrelated Gateway media remains usable while the host is offline. */
function captureAgentWorkspaceOutboundMedia(workspaceDir) {
	const key = path.resolve(workspaceDir);
	const binding = bindings.get(key);
	if (!binding) return;
	const media = binding.access?.outboundMedia;
	if (binding.access && !media) return;
	return {
		localRoots: media?.localRoots ?? [],
		async readFile(filePath, maxBytes) {
			assertBindingCurrent(key, binding);
			if (!media) throw new Error("Remote workspace attachment access is unavailable");
			return await media.readFile(filePath, maxBytes);
		}
	};
}
/** Prepare execution-only paths while retaining canonical media and transcript facts. */
async function prepareAgentWorkspaceAttachments(params) {
	if (!params.turn.media?.length && !params.turn.userTurnTranscriptRecorder) return;
	const access = getAgentWorkspaceAccess(params.workspaceDir, "prepareTurnAttachments");
	if (!access?.prepareTurnAttachments) return;
	const assertCurrent = () => {
		params.turn.abortSignal?.throwIfAborted();
		params.assertCurrent();
		if (getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed during attachment preparation");
	};
	assertCurrent();
	const recorder = params.turn.userTurnTranscriptRecorder;
	const message = await recorder?.resolveMessage() ?? recorder?.message;
	assertCurrent();
	const facts = (message ? readPersistedMediaFacts(message) : void 0) ?? params.turn.media ?? [];
	if (!facts.some((fact) => fact.path?.trim() || fact.url?.trim())) return;
	const note = await access.prepareTurnAttachments({
		config: params.turn.config,
		media: facts,
		timeoutMs: params.turn.timeoutMs,
		abortSignal: params.turn.abortSignal
	}, assertCurrent);
	assertCurrent();
	return note;
}
//#endregion
export { prepareAgentWorkspaceAttachments as a, isWorkspaceAccessUnavailableError as i, captureAgentWorkspaceOutboundMedia as n, getAgentWorkspaceAccess as r, WorkspaceAccessUnavailableError as t };
