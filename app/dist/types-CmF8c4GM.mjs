import { t as VERSION } from "./version-BnaMeO13.mjs";
//#region src/acp/types.ts
/** ACP protocol helpers and Assistant agent identity metadata. */
/** ACP agent identity advertised during protocol initialization. */
const ACP_AGENT_INFO = {
	name: "testclaw-acp",
	title: "Assistant ACP Gateway",
	version: VERSION
};
//#endregion
export { ACP_AGENT_INFO as t };
