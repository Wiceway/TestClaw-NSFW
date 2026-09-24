import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as theme } from "./theme-DLJw9KCD.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as ExpectedCliError } from "./failure-output-B62fEQHE.js";
import { t as formatVersionLabel } from "./version-format-B-C6AzAF.js";
import { t as searchInstallablePluginPackages } from "./catalog-search-CHC3eEIU.js";
//#region src/cli/plugins-search-command.ts
function formatPackageSearchLine(entry) {
	const pkg = entry.package;
	const flags = [
		pkg.family,
		pkg.channel,
		pkg.isOfficial && pkg.channel !== "official" ? "official" : void 0,
		pkg.latestVersion ? formatVersionLabel(pkg.latestVersion) : void 0
	].filter(Boolean);
	const summary = pkg.summary ? theme.muted(` — ${pkg.summary}`) : "";
	return `${pkg.name}  ${theme.muted(flags.join(" | "))}${summary}\n  ${theme.muted(`Install: ${formatCliCommand(`testclaw plugins install clawhub:${pkg.name}`)}`)}`;
}
/** Search ClawHub for installable plugins and write JSON or terminal output. */
async function runPluginsSearchCommand(queryParts, opts = {}, runtime = defaultRuntime) {
	const query = normalizeOptionalString(Array.isArray(queryParts) ? queryParts.join(" ") : queryParts);
	if (!query) {
		const message = "Usage: testclaw plugins search <query>";
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	try {
		const results = await searchInstallablePluginPackages({
			query,
			limit: opts.limit
		});
		if (opts.json) {
			writeRuntimeJson(runtime, { results });
			return;
		}
		if (results.length === 0) {
			runtime.log("No ClawHub plugins found.");
			return;
		}
		runtime.log(`${theme.heading("ClawHub plugins")} ${theme.muted(`(${results.length})`)}`);
		runtime.log(results.map(formatPackageSearchLine).join("\n"));
	} catch (error) {
		if (opts.json) throw error;
		runtime.error(formatErrorMessage(error));
		runtime.exit(1);
	}
}
//#endregion
export { runPluginsSearchCommand };
