import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as isTruthyEnvValue } from "./env-DiCPcdkM.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { i as UPDATE_RUNNER_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { i as runCommandWithTimeout } from "./exec-BddaUUYf.mjs";
import { t as note } from "./note-BvG46svB.mjs";
import { a as isServiceRepairDeferred } from "./doctor-service-repair-policy-BIWEOO8f.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-update.ts
/** Optional pre-doctor update prompt for source checkouts and package installs. */
async function resolveComparablePath(target) {
	return await fs.realpath(target).catch(() => path.resolve(target));
}
async function detectAssistantGitCheckout(root) {
	const res = await runCommandWithTimeout([
		"git",
		"-C",
		root,
		"rev-parse",
		"--show-toplevel"
	], { timeoutMs: 5e3 }).catch(() => null);
	if (!res) return "unknown";
	if (res.code !== 0) {
		if (normalizeLowercaseStringOrEmpty(res.stderr).includes("not a git repository")) return "not-git";
		return "unknown";
	}
	return await resolveComparablePath(res.stdout.trim()) === await resolveComparablePath(root) ? "git" : "not-git";
}
/** Offers to update Assistant before doctor when running interactively from an updatable install. */
async function maybeOfferUpdateBeforeDoctor(params) {
	if (!(!isTruthyEnvValue(process.env.TESTCLAW_UPDATE_IN_PROGRESS) && params.options.nonInteractive !== true && params.options.yes !== true && params.options.repair !== true && process.stdin.isTTY) || !params.root) return { updated: false };
	const git = await detectAssistantGitCheckout(params.root);
	if (git === "git") {
		if (isServiceRepairDeferred()) {
			note("Update through the external supervisor's stop/update/finalize/restart workflow. Continuing Doctor without updating Assistant.", "Update");
			return { updated: false };
		}
		if (!await params.confirm({
			message: "Update Assistant from git before running doctor?",
			initialValue: true
		})) return { updated: false };
		const { updateCommand } = await import("./update-command-Z8lV19aY.mjs");
		let handled = false;
		let readinessReason;
		await updateCommand({
			sourceUpdate: { root: params.root },
			timeout: String(UPDATE_RUNNER_TIMEOUT_MS / 1e3),
			onResult: (result) => {
				readinessReason = result.status === "skipped" && (result.reason === "gateway-readiness-unverified" || result.reason === "still-starting") ? result.reason : void 0;
				handled = result.status === "ok" || readinessReason !== void 0;
			}
		});
		if (handled) params.outro(readinessReason ? "Assistant installed; Gateway readiness remains unverified. Keep recovery backups and check `testclaw gateway status --deep`." : "Update completed (doctor already ran as part of the update).");
		return {
			updated: true,
			handled,
			...readinessReason ? { reason: readinessReason } : {}
		};
	}
	if (git === "not-git") note(["This install is not a git checkout.", `Run \`${formatCliCommand("testclaw update")}\` to update via your package manager (npm/pnpm), then rerun doctor.`].join("\n"), "Update");
	return { updated: false };
}
//#endregion
export { maybeOfferUpdateBeforeDoctor };
