import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-BZ9qYcsx.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { t as executeAssistantStateWorker } from "./testclaw-state-worker-store-CirfybVZ.mjs";
import { n as prepareOnboardingRecommendationOffer, r as prepareOnboardingRecommendationPending } from "./onboarding-recommendations.contract.js";
//#region src/state/onboarding-recommendations.ts
function createOnboardingRecommendationsStore(params) {
	const configKey = `onboarding.recommendations.${resolveWorkspaceStateIdentity(params.workspaceDir).workspaceKey}`;
	const database = params.database ?? {};
	return {
		async read() {
			const result = await executeExistingAssistantStateRead(database, {
				type: "onboardingRecommendations.read",
				configKey
			});
			if (result === void 0) return null;
			if (result.ok && result.type === "onboardingRecommendations.read") return result.record;
			throw new Error("Unexpected onboarding recommendations read result");
		},
		writeOffer(offer) {
			const captured = prepareOnboardingRecommendationOffer(offer);
			const context = captureAssistantStateWorkerContext(database);
			return executeAssistantStateWorker(context, {
				type: "onboardingRecommendations.writeOffer",
				input: {
					configKey,
					params: captured
				}
			});
		},
		acknowledge(options = {}) {
			const context = captureAssistantStateWorkerContext(database);
			const captured = structuredClone({
				...options,
				nowMs: options.nowMs ?? Date.now()
			});
			return executeAssistantStateWorker(context, {
				type: "onboardingRecommendations.acknowledge",
				input: {
					configKey,
					params: captured
				}
			});
		},
		updatePending(options) {
			const captured = prepareOnboardingRecommendationPending(options);
			const context = captureAssistantStateWorkerContext(database);
			return executeAssistantStateWorker(context, {
				type: "onboardingRecommendations.updatePending",
				input: {
					configKey,
					params: captured
				}
			});
		},
		clearPending(options) {
			const context = captureAssistantStateWorkerContext(database);
			const captured = structuredClone(options);
			return executeAssistantStateWorker(context, {
				type: "onboardingRecommendations.clearPending",
				input: {
					configKey,
					params: captured
				}
			});
		},
		clear() {
			return executeAssistantStateWorker(captureAssistantStateWorkerContext(database), {
				type: "onboardingRecommendations.clear",
				input: { configKey }
			});
		}
	};
}
//#endregion
export { createOnboardingRecommendationsStore as t };
