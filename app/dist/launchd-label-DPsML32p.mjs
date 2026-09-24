import { l as resolveGatewayLaunchAgentLabel } from "./constants-DJMIH2n2.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
//#region src/daemon/launchd-label.ts
/** Resolves the one effective launchd label shared by lifecycle and diagnostics. */
function assertValidLaunchAgentLabel(label) {
	const trimmed = label.trim();
	if (!/^[A-Za-z0-9._-]+$/.test(trimmed)) throw new Error(`Invalid launchd label: ${sanitizeForLog(trimmed)}`);
	return trimmed;
}
function resolveLaunchAgentLabel(env) {
	const override = env?.TESTCLAW_LAUNCHD_LABEL?.trim();
	return assertValidLaunchAgentLabel(override || resolveGatewayLaunchAgentLabel(env?.TESTCLAW_PROFILE));
}
//#endregion
export { resolveLaunchAgentLabel as n, assertValidLaunchAgentLabel as t };
