import "./agent-harness-runtime-DNhAy8yX.js";
import { r as TestclawConfig } from "./types.testclaw-C-wX50Nb.js";
import "./templating-Cj1bgdNt.js";
import { h as ReplyPayload } from "./reply-payload-wovcll2t.js";
import { i as buildPreparedModelsProviderData, n as ModelsProviderData, o as ModelsProviderMenu, t as ModelsCommandSessionEntry } from "./commands-models-catalog-LzKu6q37.js";
//#region src/auto-reply/reply/commands-models.d.ts
declare const MODEL_PICKER_CHANGED_MESSAGE = "Available models changed. Open /models and choose again.";
declare function formatModelsAvailableHeader(params: {
  provider: string;
  total: number;
  cfg: TestclawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  sessionEntry?: ModelsCommandSessionEntry;
  availability?: ModelsProviderMenu;
}): string;
type ModelsCommandReplyParams = {
  cfg: TestclawConfig;
  commandBodyNormalized: string;
  surface?: string;
  currentModel?: string;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  sessionEntry?: ModelsCommandSessionEntry;
};
declare function resolveModelsCommandReply(params: ModelsCommandReplyParams): Promise<ReplyPayload | null>;
//#endregion
//#region src/plugin-sdk/models-provider-runtime.d.ts
declare function buildModelsProviderData(...args: Parameters<typeof buildPreparedModelsProviderData>): Promise<ModelsProviderData>;
//#endregion
export { resolveModelsCommandReply as i, MODEL_PICKER_CHANGED_MESSAGE as n, formatModelsAvailableHeader as r, buildModelsProviderData as t };