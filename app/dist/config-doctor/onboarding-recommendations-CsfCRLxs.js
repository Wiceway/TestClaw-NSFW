import { n as sha256Hex } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { T as string, b as object, d as array, l as _enum, y as number } from "./schemas-D6YHSiZI.js";
import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-hLL0vTIh.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { t as executeAssistantStateWorker } from "./testclaw-state-worker-store-BMVEu7e2.js";
//#region src/state/onboarding-recommendations.contract.ts
const OnboardingRecommendationMatchSchema = object({
	appLabel: string(),
	candidateId: string(),
	tier: _enum(["recommended", "optional"]),
	reason: string(),
	candidate: object({
		id: string(),
		displayName: string(),
		summary: string(),
		source: _enum([
			"official-plugin",
			"official-channel",
			"official-provider",
			"clawhub-skill"
		]),
		downloads: number().optional()
	})
});
const OnboardingRecommendationMatchesSchema = array(OnboardingRecommendationMatchSchema);
function canonicalInventory(inventory) {
	return inventory.map((app) => ({
		label: app.label,
		...app.bundleId ? { bundleId: app.bundleId } : {}
	})).toSorted((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base" }) || (left.bundleId ?? "").localeCompare(right.bundleId ?? ""));
}
function hashOnboardingRecommendationInventory(inventory) {
	return sha256Hex(JSON.stringify(canonicalInventory(inventory)));
}
function prepareOnboardingRecommendationOffer(params) {
	const nowMs = params.nowMs ?? Date.now();
	return {
		inventoryHash: hashOnboardingRecommendationInventory(params.inventory),
		matches: OnboardingRecommendationMatchesSchema.parse(params.matches),
		answered: params.answered,
		nowMs
	};
}
function prepareOnboardingRecommendationPending(params) {
	const nowMs = params.nowMs ?? Date.now();
	return {
		matches: OnboardingRecommendationMatchesSchema.parse(params.matches),
		expected: structuredClone(params.expected),
		nowMs
	};
}
//#endregion
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
