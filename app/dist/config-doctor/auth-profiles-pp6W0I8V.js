import "./store-D9AW3Yaj.js";
import "./runtime-snapshots-LZfHFeGe.js";
import "./external-cli-discovery-CCpduAoE.js";
import "./order-D7DJivFp.js";
import "./store-runtime-gE8saxs_.js";
import { w as resolveAuthProfileMetadata } from "./repair-BgK-Q2lS.js";
import "./oauth-CLtD0EFM.js";
import "./usage-6TTU-a96.js";
//#region src/agents/auth-profiles/display.ts
/** Builds the human-readable profile label used in status and auth listings. */
function resolveAuthProfileDisplayLabel(params) {
	const { displayName, email } = resolveAuthProfileMetadata(params);
	if (displayName) return `${params.profileId} (${displayName})`;
	if (email) return `${params.profileId} (${email})`;
	return params.profileId;
}
//#endregion
export { resolveAuthProfileDisplayLabel as t };
