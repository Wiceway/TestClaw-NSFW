import { n as TESTCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-BhcTjWs2.mjs";
//#region src/agents/harness/builtin-testclaw-metadata.ts
/** Shared descriptor facts; invocation and built-in identity stay with the factory. */
const BUILTIN_AGENT_HARNESS_METADATA = {
	id: "testclaw",
	label: "Assistant embedded agent",
	contextEngineHostCapabilities: TESTCLAW_EMBEDDED_CONTEXT_ENGINE_HOST.capabilities,
	supports: () => ({
		supported: true,
		priority: 0
	})
};
//#endregion
export { BUILTIN_AGENT_HARNESS_METADATA as t };
