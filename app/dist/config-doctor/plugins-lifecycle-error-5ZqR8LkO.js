import { n as AssistantStateLeaseError, t as AssistantStateLeaseAcquisitionError } from "./testclaw-state-lease-error-LeoKUUrG.js";
import { n as buildCapabilityConsentErrorDetails } from "./capability-consent-error-details-hP9Zhj1G.js";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.js";
import { n as isClawHubTrustErrorCode, t as buildClawHubTrustErrorDetails } from "./clawhub-trust-error-details-BsNBm0Tv.js";
import { n as readInstallPolicyWarningErrorDetails, t as INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED } from "./install-policy-warning-error-details-Ql8N70iV.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { a as projectPluginRuntimeFailure, r as capturePluginRuntimeApplications, t as PluginInstallPersistedError } from "./lifecycle-XIqTC5za.js";
//#region src/gateway/server-methods/plugins-lifecycle-error.ts
function captureGatewayPluginRuntimeApplications(applyRuntime, assertCurrent) {
	assertCurrent();
	return capturePluginRuntimeApplications((change) => {
		assertCurrent();
		return applyRuntime({
			...change,
			assertInvokerOwned: () => {
				assertCurrent();
				change.assertInvokerOwned?.();
			}
		});
	});
}
function pluginLifecycleError(caught, { application, entered, signal }) {
	if (!entered && caught instanceof AssistantStateLeaseAcquisitionError && caught.outcome.kind === "held") return errorShape(ErrorCodes.UNAVAILABLE, "Another plugin or config operation is already running; retry when it completes.", {
		retryable: true,
		retryAfterMs: 1e3
	});
	const error = caught instanceof AssistantStateLeaseError && caught.code === "TESTCLAW_STATE_LEASE_ABORTED" && signal?.aborted && caught.cause === signal.reason ? signal.reason : caught;
	const failure = projectPluginRuntimeFailure(error, application);
	const cause = error instanceof PluginInstallPersistedError ? error.cause : error;
	const lifecycleError = cause instanceof ManagedPluginLifecycleError ? cause : void 0;
	const installDetails = lifecycleError?.capabilityConsent ? buildCapabilityConsentErrorDetails(lifecycleError.capabilityConsent) : lifecycleError?.installPolicyWarning ? readInstallPolicyWarningErrorDetails({
		installPolicyCode: INSTALL_POLICY_WARNING_ACKNOWLEDGEMENT_REQUIRED,
		...lifecycleError.installPolicyWarning
	}) : lifecycleError ? buildClawHubTrustErrorDetails({
		code: isClawHubTrustErrorCode(lifecycleError.code) ? lifecycleError.code : void 0,
		version: lifecycleError.version,
		warning: lifecycleError.warning
	}) : void 0;
	const refusal = !failure.persistence && lifecycleError?.installRejected ? {
		pluginInstallRejected: true,
		...lifecycleError.code ? { pluginInstallCode: lifecycleError.code } : {},
		...lifecycleError.installSource ? { pluginInstallSource: lifecycleError.installSource } : {}
	} : void 0;
	const details = failure.runtime || failure.persistence || refusal ? {
		...installDetails,
		...refusal,
		...failure.runtime ? { runtime: failure.runtime } : {},
		...failure.persistence ? { persistence: failure.persistence } : {},
		...failure.runtimeAttempt ? { runtimeAttempt: failure.runtimeAttempt } : {}
	} : installDetails;
	return errorShape(lifecycleError?.kind === "invalid-request" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, failure.message, details ? { details } : void 0);
}
//#endregion
export { pluginLifecycleError as n, captureGatewayPluginRuntimeApplications as t };
