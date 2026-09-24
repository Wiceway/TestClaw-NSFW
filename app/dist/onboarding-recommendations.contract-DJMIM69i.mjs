import { n as sha256Hex } from "./node-crypto-B8Y3L7k8.mjs";
import "./crypto-digest-CXyOu5KJ.mjs";
import { E as string, b as number, d as array, l as _enum, x as object } from "./schemas-qz0osXyE.mjs";
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
function isOnboardingRecommendationWriteCommand(command) {
	switch (command.type) {
		case "onboardingRecommendations.writeOffer":
		case "onboardingRecommendations.acknowledge":
		case "onboardingRecommendations.updatePending":
		case "onboardingRecommendations.clearPending":
		case "onboardingRecommendations.clear": return true;
		default: return false;
	}
}
//#endregion
export { prepareOnboardingRecommendationOffer as n, prepareOnboardingRecommendationPending as r, isOnboardingRecommendationWriteCommand as t };
