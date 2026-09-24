//#region src/state/testclaw-state-lease-error.ts
const leaseErrorCodes = [
	"TESTCLAW_STATE_LEASE_INVALID_INPUT",
	"TESTCLAW_STATE_LEASE_HELD",
	"TESTCLAW_STATE_LEASE_ABORTED",
	"TESTCLAW_STATE_LEASE_LOST",
	"TESTCLAW_STATE_LEASE_STORAGE_FAILED"
];
function isAssistantStateLeaseErrorCode(value) {
	return leaseErrorCodes.some((code) => code === value);
}
var AssistantStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "AssistantStateLeaseError";
		this.code = options.code;
	}
};
var AssistantStateLeaseAcquisitionError = class extends AssistantStateLeaseError {
	constructor(label, outcome, cause) {
		super(outcome.kind === "held" ? `${label} is held by ${outcome.holder.owner} (lease epoch ${outcome.holder.epoch})` : outcome.kind === "aborted" ? `${label} acquisition was aborted after ${outcome.elapsedMs} ms by caller signal` : `failed to acquire ${label}: store unavailable (${outcome.reason})`, {
			code: outcome.kind === "held" ? "TESTCLAW_STATE_LEASE_HELD" : outcome.kind === "aborted" ? "TESTCLAW_STATE_LEASE_ABORTED" : "TESTCLAW_STATE_LEASE_STORAGE_FAILED",
			cause
		});
		this.outcome = outcome;
	}
};
function toAssistantStateLeaseVerificationError(identity, error) {
	return error instanceof AssistantStateLeaseError ? error : new AssistantStateLeaseError(`failed to verify ${identity.leaseLabel ?? "state lease"} ${identity.scope}/${identity.key}`, {
		code: "TESTCLAW_STATE_LEASE_STORAGE_FAILED",
		cause: error
	});
}
function createAssistantStateLeaseError(code, message, cause) {
	return new AssistantStateLeaseError(message, {
		code,
		...cause === void 0 ? {} : { cause }
	});
}
function createAssistantStateLeaseAbortError(signal, label, leaseLabel) {
	return createAssistantStateLeaseError("TESTCLAW_STATE_LEASE_ABORTED", `${leaseLabel} ${label} was aborted`, signal.reason);
}
//#endregion
export { isAssistantStateLeaseErrorCode as a, createAssistantStateLeaseError as i, AssistantStateLeaseError as n, toAssistantStateLeaseVerificationError as o, createAssistantStateLeaseAbortError as r, AssistantStateLeaseAcquisitionError as t };
