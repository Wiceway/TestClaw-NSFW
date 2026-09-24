import { t as resolveGatewayProbeTarget } from "./probe-target-DdxJiOgf.mjs";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-K5-Jxion.mjs";
//#region src/commands/status.gateway-probe.ts
/** Resolves gateway probe auth plus any non-secret warning about credential lookup. */
async function resolveGatewayProbeAuthResolution(cfg, env = process.env) {
	const target = resolveGatewayProbeTarget(cfg);
	return resolveGatewayProbeAuthSafeWithSecretInputs({
		cfg,
		mode: target.mode,
		env
	});
}
//#endregion
export { resolveGatewayProbeAuthResolution };
