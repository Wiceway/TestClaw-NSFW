//#region packages/gateway-protocol/src/clawhub-trust-error-details.ts
/** Structured ClawHub trust details carried in gateway error payloads. */
const ClawHubTrustErrorCodes = {
	SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
	DOWNLOAD_BLOCKED: "clawhub_download_blocked"
};
function isClawHubTrustErrorCode(value) {
	return value === ClawHubTrustErrorCodes.SECURITY_UNAVAILABLE || value === ClawHubTrustErrorCodes.DOWNLOAD_BLOCKED;
}
function buildClawHubTrustErrorDetails(params) {
	if (!params.code && !params.version && !params.warning) return;
	return {
		...params.code ? { clawhubTrustCode: params.code } : {},
		...params.version ? { version: params.version } : {},
		...params.warning ? { warning: params.warning } : {}
	};
}
//#endregion
export { isClawHubTrustErrorCode as n, buildClawHubTrustErrorDetails as t };
