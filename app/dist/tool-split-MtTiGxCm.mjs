import { a as toToolDefinitions } from "./agent-tool-definition-adapter-6suOPCnM.mjs";
//#region src/agents/embedded-agent-runner/tool-split.ts
/**
* Splits SDK tools from Assistant tool definitions for provider calls.
*/
function splitSdkTools(options) {
	const { tools, toolHookContext } = options;
	return { customTools: toToolDefinitions(tools, toolHookContext, options.abortSignal) };
}
//#endregion
export { splitSdkTools as t };
