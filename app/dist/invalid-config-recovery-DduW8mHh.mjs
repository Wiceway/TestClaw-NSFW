import { t as ExitError } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DNRSXUP6.mjs";
//#region src/cli/invalid-config-recovery.ts
/** Offer a consent-gated doctor repair, then retry the failed operation once. */
async function offerInvalidConfigRecovery(params) {
	const command = formatCliCommand("testclaw doctor --fix");
	const printCommand = () => {
		params.runtime.error(`Run "${command}" to repair the config, then retry.`);
	};
	if (!(params.deps?.isInteractive ?? isTerminalInteractive)()) {
		printCommand();
		return { status: "declined" };
	}
	if (!await (params.deps?.confirm ?? (async (question, defaultYes) => {
		const { promptYesNo } = await import("./prompt-C2jv0J8n.mjs");
		return await promptYesNo(question, defaultYes);
	}))(`Run "${command}" now?`, true)) {
		printCommand();
		return { status: "declined" };
	}
	const runDoctor = params.deps?.runDoctor ?? (async (runtime) => {
		const { doctorCommand } = await import("./doctor-BVRdqy3e.mjs");
		await doctorCommand(runtime, { repair: true });
	});
	try {
		await runDoctor(params.runtime);
	} catch (error) {
		if (error instanceof ExitError) throw error;
		params.runtime.error(`Failed to run "${command}": ${formatErrorMessage(error)}`);
		return { status: "retry-failed" };
	}
	try {
		return {
			status: "recovered",
			value: await params.retry()
		};
	} catch (error) {
		const { isInvalidConfigError } = await import("./io.invalid-config-DdQHsnpz.mjs");
		if (!isInvalidConfigError(error)) throw error;
		params.runtime.error(`Config is still invalid after "${command}":`);
		params.runtime.error(formatErrorMessage(error));
		return { status: "retry-failed" };
	}
}
//#endregion
export { offerInvalidConfigRecovery };
