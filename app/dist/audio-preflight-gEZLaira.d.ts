import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import { l as RuntimeMsgContext } from "./templating-Cj1bgdNt.js";
import "./types-RdRiGrAp.js";
import { l as MediaUnderstandingProvider } from "./types-DUHHqvaV.js";
import { l as ActiveMediaModel } from "./runtime-types-DkNbqukH.js";
//#region src/media-understanding/audio-preflight.d.ts
/**
 * Transcribes the first audio attachment BEFORE mention checking.
 * This allows voice notes to be processed in group chats with requireMention: true.
 * Returns the transcript or undefined if transcription fails or no audio is found.
 */
declare function transcribeFirstAudio(params: {
  ctx: RuntimeMsgContext;
  cfg: TestclawConfig;
  agentDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel;
}): Promise<string | undefined>;
//#endregion
export { transcribeFirstAudio as t };