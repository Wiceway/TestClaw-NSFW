import { r as trimToUndefined } from "./credential-planner-CFcNwxh2.js";
import "./credentials-_4Zh4Pjr.js";
import { t as resolveConfiguredSecretInputWithFallback } from "./resolve-configured-secret-input-string-BqgFo8ND.js";
//#region src/gateway/auth-token-resolution.ts
/** Resolves gateway.auth.token with configurable env fallback and SecretRef diagnostics. */
async function resolveGatewayAuthToken(params) {
	const explicitToken = trimToUndefined(params.explicitToken);
	if (explicitToken) return {
		token: explicitToken,
		source: "explicit",
		secretRefConfigured: false
	};
	const resolved = await resolveConfiguredSecretInputWithFallback({
		config: params.cfg,
		env: params.env,
		value: params.cfg.gateway?.auth?.token,
		path: "gateway.auth.token",
		unresolvedReasonStyle: params.unresolvedReasonStyle,
		...params.envFallback !== "never" ? { readFallback: () => params.env.TESTCLAW_GATEWAY_TOKEN } : {}
	});
	return {
		...resolved.value ? { token: resolved.value } : {},
		...resolved.source ? { source: resolved.source === "fallback" ? "env" : resolved.source } : {},
		secretRefConfigured: resolved.secretRefConfigured,
		...resolved.unresolvedRefReason ? { unresolvedRefReason: resolved.unresolvedRefReason } : {},
		...resolved.unresolvedRefCode ? { unresolvedRefCode: resolved.unresolvedRefCode } : {}
	};
}
//#endregion
export { resolveGatewayAuthToken as t };
