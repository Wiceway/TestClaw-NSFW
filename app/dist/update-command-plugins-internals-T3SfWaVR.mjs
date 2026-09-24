import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import "./capability-consent-error-details-CF5XfV3G.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-CQQBnbzM.mjs";
//#region src/cli/update-cli/update-command-plugins-internals.ts
/** Producer-classified notices shared by current and published updater handoffs. */
function collectPostCorePluginAdvisories(result) {
	return [...(result?.warnings ?? []).filter((warning) => warning.reason === "plugin-target-unavailable" || warning.reason === "plugin-operator-managed" || warning.reason === "doctor-advisory").map((warning) => warning.message), ...(result?.npm?.outcomes ?? []).filter((outcome) => outcome.code === "source-bundled-plugin").map((outcome) => outcome.message)];
}
function collectPostCorePluginFailureFacts(result, env = process.env) {
	if (result.status !== "error") return [];
	if (result.failureFacts?.length) return normalizeUpdateFailureFacts(result.failureFacts, env);
	const failures = result.npm.outcomes.filter((outcome) => outcome.status === "error").map((outcome) => ({
		check: "plugin-update",
		code: outcome.code ?? "plugin-update-failed",
		pluginId: outcome.pluginId,
		message: outcome.message
	}));
	if (!failures.length) failures.push(...result.sync.errors.map((message) => ({
		check: "plugin-sync",
		code: "plugin-sync-failed",
		message
	})));
	if (!failures.length) failures.push({
		check: "plugin-convergence",
		code: result.reason ?? "post-update-plugins",
		message: result.warnings?.[0]?.message
	});
	return normalizeUpdateFailureFacts(failures, env);
}
function assessPluginUpdate(params) {
	if (params.outcomes.some((outcome) => outcome.status === "error" && outcome.code === "PLUGIN_CAPABILITY_CONSENT_REQUIRED")) return {
		kind: "unsafe",
		reason: "capability-consent-required"
	};
	if (params.integrityDrift) return {
		kind: "unsafe",
		reason: "integrity-drift"
	};
	const failures = params.smokeFailures;
	if (failures.some((failure) => !failure.installPath)) return {
		kind: "unsafe",
		reason: "unowned-plugin-payload"
	};
	const unavailablePluginIds = [...failures.map((failure) => failure.pluginId), ...params.disabledPluginIds];
	if (unavailablePluginIds.some((pluginId) => params.requirements[pluginId] === "required")) return {
		kind: "unsafe",
		reason: "required-plugin-unavailable"
	};
	if (unavailablePluginIds.some((pluginId) => params.requirements[pluginId] !== "optional")) return {
		kind: "unsafe",
		reason: "plugin-requirement-unknown"
	};
	if (params.disabledPluginIds.length > 0) return {
		kind: "unsafe",
		reason: "plugin-disabled-after-update"
	};
	if (failures.length > 0) return {
		kind: "optional-repair-needed",
		failures
	};
	return params.errored ? {
		kind: "unsafe",
		reason: "convergence-failed"
	} : { kind: "no-payload-repair" };
}
function createPluginUpdateWarning(params) {
	const command = formatCliCommand(params.kind === "load" ? "testclaw doctor --fix" : params.pluginId ? `testclaw plugins update ${params.pluginId}` : "testclaw update repair", params.env);
	const nextAction = `Run \`${command}\` to ${params.kind === "load" ? "check and repair the load problem" : "retry"}.`;
	return {
		...params.pluginId ? { pluginId: params.pluginId } : {},
		reason: params.reason,
		message: params.pluginId ? `Plugin "${params.pluginId}" could not be ${params.kind === "load" ? "loaded" : "updated"}. ${nextAction}` : `Plugin updates could not complete. ${nextAction}`,
		guidance: [command]
	};
}
function appendPluginUpdateWarnings(result, warnings) {
	if (warnings.length === 0) return result;
	const plugins = result.postUpdate?.plugins ?? {
		status: "warning",
		changed: false,
		sync: {
			changed: false,
			switchedToBundled: [],
			switchedToNpm: [],
			warnings: [],
			errors: []
		},
		npm: {
			changed: false,
			outcomes: []
		},
		integrityDrifts: []
	};
	const combined = [...plugins.warnings ?? []];
	for (const warning of warnings) if (!combined.some((entry) => entry.pluginId === warning.pluginId && entry.reason === warning.reason)) combined.push(warning);
	return {
		...result,
		postUpdate: {
			...result.postUpdate,
			plugins: {
				...plugins,
				status: plugins.status === "error" ? "error" : "warning",
				warnings: combined
			}
		}
	};
}
/**
* Build the post-core-update result we return when the active config cannot
* even be parsed. Mandatory post-core convergence requires a parseable
* config to know which plugins are configured; if one isn't available, we
* refuse to restart the gateway and surface this as a hard error so the
* existing `status === "error"` => `exit 1` pre-restart gate fires.
*/
function buildInvalidConfigPostCoreUpdateResult() {
	const guidance = ["Run `testclaw doctor` to inspect the config validation errors.", "Once the config parses, rerun `testclaw update repair`."];
	const message = "Plugin post-update convergence skipped because the config is invalid; refusing to restart the gateway with an unverified plugin set.";
	return {
		message,
		guidance,
		result: {
			status: "error",
			reason: "invalid-config",
			changed: false,
			sync: {
				changed: false,
				switchedToBundled: [],
				switchedToNpm: [],
				warnings: [],
				errors: []
			},
			npm: {
				changed: false,
				outcomes: []
			},
			integrityDrifts: [],
			warnings: [{
				reason: "invalid-config",
				message,
				guidance
			}]
		}
	};
}
//#endregion
export { collectPostCorePluginFailureFacts as a, collectPostCorePluginAdvisories as i, assessPluginUpdate as n, createPluginUpdateWarning as o, buildInvalidConfigPostCoreUpdateResult as r, appendPluginUpdateWarnings as t };
