import { n as MODEL_CATALOG_THINKING_LEVELS } from "../model-catalog-types-Be14Nus9.mjs";
import { isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel } from "@testclaw/ai/internal/google-model-family";
//#region src/plugin-sdk/provider-thinking-runtime.ts
function resolveEffortThinkingProfile(efforts) {
	if (!efforts || efforts.length === 0) return;
	const acceptedLevelIds = /* @__PURE__ */ new Set(["off", ...efforts.map((effort) => effort === "none" ? "off" : effort)]);
	return {
		levels: MODEL_CATALOG_THINKING_LEVELS.filter((id) => acceptedLevelIds.has(id)).map((id) => ({ id })),
		defaultLevel: acceptedLevelIds.has("medium") ? "medium" : acceptedLevelIds.has("high") ? "high" : acceptedLevelIds.has("low") ? "low" : "off"
	};
}
//#endregion
export { isGoogleGemini3FlashModel, isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel, resolveEffortThinkingProfile };
