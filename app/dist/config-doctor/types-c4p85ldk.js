import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { t as VERSION } from "./version-BdHihr00.js";
//#region packages/acp-core/src/types.ts
const ACP_PROVENANCE_MODE_VALUES = [
	"off",
	"meta",
	"meta+receipt"
];
function normalizeAcpProvenanceMode(value) {
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	return ACP_PROVENANCE_MODE_VALUES.includes(normalized) ? normalized : void 0;
}
//#endregion
//#region src/acp/types.ts
/** ACP protocol helpers and Assistant agent identity metadata. */
/** ACP agent identity advertised during protocol initialization. */
const ACP_AGENT_INFO = {
	name: "testclaw-acp",
	title: "Assistant ACP Gateway",
	version: VERSION
};
//#endregion
export { normalizeAcpProvenanceMode as n, ACP_AGENT_INFO as t };
