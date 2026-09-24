import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as isRich, r as theme } from "./theme-DLJw9KCD.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.js";
import { n as runCommandWithRuntime } from "./cli-utils-BOBTfPOr.js";
import { f as unauthorizedHintForMessage } from "./rpc-4Eol7QH0.js";
//#region src/cli/nodes-cli/cli-utils.ts
/** Return color helpers that degrade to plain text in non-rich terminals. */
function getNodesTheme() {
	const rich = isRich();
	const color = (fn) => (value) => rich ? fn(value) : value;
	return {
		rich,
		heading: color(theme.heading),
		ok: color(theme.success),
		warn: color(theme.warn),
		muted: color(theme.muted),
		error: color(theme.error)
	};
}
function formatConnectionFlagReminder(opts) {
	const flags = [normalizeOptionalString(opts.url) ? "--url" : null, normalizeOptionalString(opts.token) ? "--token" : null].filter((flag) => flag !== null);
	return flags.length > 0 ? `Reuse the same connection option${flags.length === 1 ? "" : "s"} when rerunning: ${flags.join(", ")}.` : null;
}
/** Run a node CLI action with standard failure text and authorization hints. */
function runNodesCommand(label, action) {
	return runCommandWithRuntime(defaultRuntime, action, (err) => {
		const message = formatErrorMessage(err);
		const { error, warn } = getNodesTheme();
		defaultRuntime.error(error(`nodes ${label} failed: ${message}`));
		const hint = unauthorizedHintForMessage(message);
		if (hint) defaultRuntime.error(warn(hint));
		defaultRuntime.exit(1);
	});
}
//#endregion
//#region src/cli/pairing-command-format.ts
/** Format an exact-request approval hint; callers keep token/password flags in reminders. */
function formatPairingApproveCommand(group, requestId, opts = {}) {
	const args = [
		"testclaw",
		group,
		"approve",
		requestId
	];
	const url = normalizeOptionalString(opts.url);
	if (url) args.push("--url", url);
	const timeout = normalizeOptionalString(opts.timeout);
	if (timeout && timeout !== "10000") args.push("--timeout", timeout);
	if (opts.json === true) args.push("--json");
	return formatCliCommand(args.map(quoteCliArg).join(" "));
}
//#endregion
export { runNodesCommand as i, formatConnectionFlagReminder as n, getNodesTheme as r, formatPairingApproveCommand as t };
