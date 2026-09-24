import { o as resolveUserPath } from "./home-dir-BPqVt7Ps.mjs";
import { p as shortenHomePath } from "./utils-Dy46mFy2.mjs";
import { n as t } from "./i18n-DrbABx94.mjs";
import { r as resolveOnboardingWorkspaceConflict } from "./onboard-config-5sl-05yZ.mjs";
//#region src/wizard/setup.workspace.ts
/** Resolves a proposed setup workspace without silently remapping an existing fleet. */
async function resolveSetupWorkspaceSelection(params) {
	if (params.approvedWorkspaceDir && resolveUserPath(params.approvedWorkspaceDir) === resolveUserPath(params.requestedWorkspaceDir)) return {
		workspaceDir: params.requestedWorkspaceDir,
		allowWorkspaceChange: true
	};
	const conflict = params.hasAuthoredRoster === false ? void 0 : resolveOnboardingWorkspaceConflict(params.baseConfig, params.requestedWorkspaceDir);
	if (!conflict) return {
		workspaceDir: params.requestedWorkspaceDir,
		allowWorkspaceChange: false
	};
	await params.prompter.note(t("wizard.setup.workspaceConflictNotice", {
		current: shortenHomePath(conflict.currentWorkspaceDir),
		requested: shortenHomePath(conflict.requestedWorkspaceDir)
	}), t("wizard.setup.workspaceConflictTitle"));
	const allowWorkspaceChange = params.canConfirmMove !== false && await params.prompter.confirm({
		message: t("wizard.setup.workspaceConflictConfirm"),
		initialValue: false
	});
	return {
		workspaceDir: allowWorkspaceChange ? params.requestedWorkspaceDir : conflict.currentWorkspaceDir,
		allowWorkspaceChange,
		conflict
	};
}
//#endregion
export { resolveSetupWorkspaceSelection as t };
