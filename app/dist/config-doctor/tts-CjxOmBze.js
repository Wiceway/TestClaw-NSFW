import { n as readConfigMachineState } from "./config-machine-state-BiDCuNUZ.js";
import { l as mimeTypeFromFilePath } from "./mime-Bmg9gcyP.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DcNWEaY3.js";
import { d as saveMediaBuffer } from "./store-CiT93cXA.js";
import { n as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-B7PkzUe3.js";
import { b as setTtsMachinePrefsPathResolver } from "./tts-settings-UQqeRJB6.js";
import { C as setSpeechRuntimeAvailabilityGuard, b as textToSpeechCore, u as maybeApplyTtsToPayloadCore } from "./runtime-api-CjUPhjru.js";
//#region src/tts/tts-audio-store.ts
const TTS_MEDIA_SUBDIR = "tool-speech-synthesis";
const persistTtsAudioToMediaStore = async ({ audioBuffer, cfg, fileExtension }) => {
	const originalFilename = `voice${fileExtension}`;
	return (await saveMediaBuffer(audioBuffer, mimeTypeFromFilePath(originalFilename), TTS_MEDIA_SUBDIR, resolveGeneratedMediaMaxBytes(cfg, "audio"), originalFilename)).path;
};
//#endregion
//#region src/tts/tts.ts
/** Public TTS runtime barrel exposed to core callers and plugin SDK facades. */
setSpeechRuntimeAvailabilityGuard(() => {
	assertSecretOwnerAvailable("capability", "tts");
});
setTtsMachinePrefsPathResolver(() => readConfigMachineState("tts.prefsPath"));
function textToSpeech(params) {
	return textToSpeechCore(params, persistTtsAudioToMediaStore);
}
function maybeApplyTtsToPayload(params) {
	return maybeApplyTtsToPayloadCore(params, persistTtsAudioToMediaStore);
}
//#endregion
export { textToSpeech as n, maybeApplyTtsToPayload as t };
