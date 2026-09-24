import { u as upsertAuthProfileWithLockOrThrow } from "./profiles-BGtnbrpm.mjs";
import { t as applyPrimaryModel } from "./provider-model-primary-eH18Zusd.mjs";
import { n as buildApiKeyCredential, t as applyAuthProfileConfig } from "./provider-auth-helpers-Clt-z84f.mjs";
import { c as validateApiKeyInput, i as normalizeApiKeyInput, n as ensureApiKeyFromOptionEnvOrPrompt } from "./provider-auth-input-DrwOvWSv.mjs";
//#region src/plugins/provider-api-key-auth.runtime.ts
/** Runtime API-key auth helper bundle exposed to provider setup code. */
const providerApiKeyAuthRuntime = {
	upsertAuthProfileWithLockOrThrow,
	applyAuthProfileConfig,
	applyPrimaryModel,
	buildApiKeyCredential,
	ensureApiKeyFromOptionEnvOrPrompt,
	normalizeApiKeyInput,
	validateApiKeyInput
};
//#endregion
export { providerApiKeyAuthRuntime };
