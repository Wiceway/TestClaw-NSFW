import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { l as tryResolveSoleAgentId } from "./agent-roster-Cl9s4QHb.mjs";
import "./agent-scope-_30Scclc.mjs";
import { s as isLegacyParentWritableUpdateDoctorPass } from "./update-phase-ygr4tw0u.mjs";
//#region src/flows/doctor-health-contribution-utils.ts
function isUpdateDoctorRun(env) {
	const value = env.TESTCLAW_UPDATE_IN_PROGRESS;
	return value === "1" || value === "true";
}
function resolveDoctorMode(cfg) {
	return cfg.gateway?.mode === "remote" ? "remote" : "local";
}
function resolveDoctorWorkspaceDir(cfg, env = process.env) {
	const agentId = tryResolveSoleAgentId(cfg);
	return agentId ? resolveAgentWorkspaceDir(cfg, agentId, env) : void 0;
}
function resolveLegacyParentVersionOverride(ctx) {
	if (!isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env)) return {};
	const version = ctx.configResult.sourceLastTouchedVersion?.trim();
	return version ? { lastTouchedVersionOverride: version } : {};
}
//#endregion
export { resolveLegacyParentVersionOverride as i, resolveDoctorMode as n, resolveDoctorWorkspaceDir as r, isUpdateDoctorRun as t };
