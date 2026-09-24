import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./message-channel-iCC7oIhe.js";
import "./delivery-info-B5Y1TlNL.js";
import { t as resolveSessionDeliveryTarget } from "./targets-session-Odn-ziiP.js";
import "./targets-CGx0k745.js";
import { n as sendDurableMessageBatchCore } from "./send-Bh8w6d4a.js";
import "./runtime-2SLUijNh.js";
import { r as resolvePersistedApprovalRequestSessionEntry } from "./approval-request-account-binding-B0BpAI_K.js";
//#region src/infra/exec-approval-session-target.ts
function normalizeExecApprovalThreadValue(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	if (typeof value !== "string") return;
	const normalized = value.trim();
	return normalized ? normalized : void 0;
}
/** Resolves the best known message target for an exec approval request. */
function resolveExecApprovalSessionTarget(params) {
	if (!normalizeOptionalString(params.request.request.sessionKey)) return null;
	const persisted = resolvePersistedApprovalRequestSessionEntry({
		cfg: params.cfg,
		request: params.request
	});
	if (!persisted) return null;
	const target = resolveSessionDeliveryTarget({
		entry: persisted.entry,
		requestedChannel: "last",
		turnSourceChannel: normalizeOptionalString(params.turnSourceChannel),
		turnSourceTo: normalizeOptionalString(params.turnSourceTo),
		turnSourceAccountId: normalizeOptionalString(params.turnSourceAccountId),
		turnSourceThreadId: normalizeExecApprovalThreadValue(params.turnSourceThreadId)
	});
	if (!target.to) return null;
	return {
		channel: normalizeOptionalString(target.channel),
		to: target.to,
		accountId: normalizeOptionalString(target.accountId),
		threadId: normalizeExecApprovalThreadValue(target.threadId)
	};
}
//#endregion
export { resolveExecApprovalSessionTarget, sendDurableMessageBatchCore };
