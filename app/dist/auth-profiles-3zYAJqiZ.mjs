import "./oauth-NSULlBBk.mjs";
import "./store-_Ypv0hYn.mjs";
import "./profiles-BGtnbrpm.mjs";
import "./runtime-snapshots-BVrxpeKm.mjs";
import "./external-cli-discovery-CM7Lge71.mjs";
import "./order-BnTFWeei.mjs";
import "./store-runtime-CZ_l0ERR.mjs";
import { n as resolveAuthProfileMetadata } from "./identity-C0n2rHTU.mjs";
import "./usage-1VMY1Jze.mjs";
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
