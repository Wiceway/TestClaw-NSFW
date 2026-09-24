import { t as definePluginEntry } from "../../plugin-entry-JBPHePKD.mjs";
import { t as isBrowserMachineOutput } from "../../cli-output-mode-eqyUredo.mjs";
//#region extensions/browser/cli-metadata.ts
/**
* Browser CLI metadata entry. It registers the `testclaw browser` command lazily
* so command discovery does not load the full browser runtime.
*/
/** Plugin entry that contributes Browser CLI commands. */
var cli_metadata_default = definePluginEntry({
	id: "browser",
	name: "Browser",
	description: "Default browser tool plugin",
	register(api) {
		api.registerCli(async ({ program }) => {
			const { registerBrowserCli } = await import("../../browser-cli-CIn6C5tB.mjs");
			registerBrowserCli(program, process.argv, api.rootDir);
		}, {
			commands: ["browser"],
			descriptors: [{
				name: "browser",
				description: "Manage Assistant's dedicated browser (Chrome/Chromium)",
				hasSubcommands: true,
				machineOutput: isBrowserMachineOutput
			}]
		});
	}
});
//#endregion
export { cli_metadata_default as default };
