import { C as resolveOAuthDir, E as resolveStateDir, p as resolveConfigPath } from "./paths-DeOFr7iP.js";
import { t as appendConfigPathSegment } from "./dot-path-CTxqU0U7.js";
import { r as formatConfigIssueSummary } from "./issue-format-DXdS88Yb.js";
import { c as readConfigFileSnapshot, m as readSourceConfigBestEffort } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { t as buildCleanupPlan } from "./cleanup-utils-BN1VhO2l.js";
//#region src/commands/cleanup-plan.ts
function buildCleanupPlanForConfig(cfg) {
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	return {
		cfg,
		stateDir,
		configPath,
		oauthDir,
		...buildCleanupPlan({
			cfg,
			stateDir,
			configPath,
			oauthDir
		})
	};
}
/** Build a read-only cleanup preview without recording config health state. */
async function resolveCleanupPlanForDryRun() {
	return buildCleanupPlanForConfig(await readSourceConfigBestEffort());
}
/** Resolve destructive cleanup inputs without mutating the state being guarded. */
async function resolveCleanupPlanForRemoval(runtime) {
	const snapshot = await readConfigFileSnapshot({
		observe: false,
		pluginValidation: "core-only"
	});
	const workspacePaths = /* @__PURE__ */ new Set(["agents.defaults.workspace", ...Object.keys(snapshot.runtimeConfig.agents?.entries ?? {}).map((agentId) => `${appendConfigPathSegment("agents.entries", agentId)}.workspace`)]);
	const workspaceWarnings = snapshot.warnings.filter((issue) => workspacePaths.has(issue.path));
	if (!snapshot.valid || workspaceWarnings.length > 0) {
		const issues = snapshot.valid ? workspaceWarnings : snapshot.issues;
		const issueSummary = formatConfigIssueSummary(issues) ?? "configuration read failed";
		runtime.error(`Cannot safely remove Assistant state because workspace configuration could not be resolved: ${issueSummary}. Fix the configuration and retry.`);
		return;
	}
	return buildCleanupPlanForConfig(snapshot.runtimeConfig);
}
//#endregion
export { resolveCleanupPlanForRemoval as n, resolveCleanupPlanForDryRun as t };
