import { i as isDeepSeekV4ModelRef } from "./.setup/models-CSoHkBlA.mjs";
import { createDeepSeekV4OpenAICompatibleThinkingWrapper } from "testclaw/plugin-sdk/provider-stream-shared";
//#region extensions/deepseek/stream.ts
function createDeepSeekV4ThinkingWrapper(baseStreamFn, thinkingLevel) {
	return createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn,
		thinkingLevel,
		shouldPatchModel: isDeepSeekV4ModelRef
	});
}
//#endregion
export { createDeepSeekV4ThinkingWrapper };
