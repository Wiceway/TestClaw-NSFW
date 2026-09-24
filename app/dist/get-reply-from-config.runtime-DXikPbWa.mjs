import { n as prewarmReplyRunRuntimes, t as getReplyFromConfig } from "./get-reply-UsNOFNo_.mjs";
//#region src/auto-reply/reply/get-reply-from-config.runtime.ts
/** Runtime facade for config-driven reply resolution. */
async function prewarmConfigDrivenReplyRuntime() {
	await prewarmReplyRunRuntimes();
}
//#endregion
export { getReplyFromConfig, prewarmConfigDrivenReplyRuntime };
