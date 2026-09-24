import { r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { t as formatDocsLink } from "./links-Dbd25H-p.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as addGatewayClientOptions } from "./gateway-rpc-D4ZbEO3i.mjs";
import { t as danger } from "./globals-CUJhO5PM.mjs";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-gVaqQ9_U.mjs";
import { t as formatHelpExamples } from "./help-format-Ctl5AOqy.mjs";
import { i as registerCommandGroups } from "./register-command-groups-Df5_Ehss.mjs";
import "./cli-runtime-BfEMMtyY.mjs";
import { n as resolveBrowserLazySubcommand } from "./cli-output-mode-eqyUredo.mjs";
import "./core-api-BhNfYVuE.mjs";
//#region extensions/browser/src/cli/browser-cli-examples.ts
/**
* Help examples shown by the Browser CLI root command.
*/
/** Core Browser CLI examples for lifecycle and inspection commands. */
const browserCoreExamples = [
	"testclaw browser status",
	"testclaw browser start",
	"testclaw browser start --headless",
	"testclaw browser stop",
	"testclaw browser tabs",
	"testclaw browser open https://example.com",
	"testclaw browser focus abcd1234",
	"testclaw browser close abcd1234",
	"testclaw browser screenshot",
	"testclaw browser screenshot --full-page",
	"testclaw browser screenshot --ref 12",
	"testclaw browser snapshot",
	"testclaw browser snapshot --format aria --limit 200",
	"testclaw browser snapshot --efficient",
	"testclaw browser snapshot --labels"
];
/** Browser CLI examples for interaction/action commands. */
const browserActionExamples = [
	"testclaw browser navigate https://example.com",
	"testclaw browser resize 1280 720",
	"testclaw browser click 12 --double",
	"testclaw browser click-coords 120 340",
	"testclaw browser type 23 \"hello\" --submit",
	"testclaw browser press Enter",
	"testclaw browser hover 44",
	"testclaw browser drag 10 11",
	"testclaw browser select 9 OptionA OptionB",
	"testclaw browser upload /tmp/testclaw/uploads/file.pdf",
	"testclaw browser upload media://inbound/file.pdf",
	"testclaw browser fill --fields '[{\"ref\":\"1\",\"value\":\"Ada\"}]'",
	"testclaw browser dialog --accept",
	"testclaw browser wait --text \"Done\"",
	"testclaw browser evaluate --fn '(el) => el.textContent' --ref 7",
	"testclaw browser evaluate --fn 'const title = document.title; return title;'",
	"testclaw browser console --level error",
	"testclaw browser pdf",
	"testclaw browser batch --actions-file plan.json",
	"testclaw browser batch --actions '[{\"kind\":\"wait\",\"timeMs\":500},{\"kind\":\"click\",\"ref\":\"12\"},{\"kind\":\"type\",\"ref\":\"23\",\"text\":\"hello\"}]'",
	"testclaw browser batch --actions-file plan.json --continue"
];
//#endregion
//#region extensions/browser/src/cli/browser-cli.ts
const command = (name, description, options) => ({
	name,
	description,
	...options ? { options } : {}
});
const browserCommandGroupDefinitions = [
	{
		placeholders: [
			command("status", "Show browser status"),
			command("start", "Start the browser (no-op if already running)"),
			command("stop", "Stop the browser (best-effort)"),
			command("reset-profile", "Reset browser profile (moves it to Trash)"),
			command("tabs", "List open tabs"),
			command("tab", "Tab shortcuts (index-based)"),
			command("open", "Open a URL in a new tab"),
			command("focus", "Focus a tab by tab reference"),
			command("close", "Close a tab (tab reference optional)"),
			command("profiles", "List all browser profiles"),
			command("system-profiles", "List Chrome-family profiles available for cookie import"),
			command("import-profile", "Import cookies from a macOS Chrome-family profile"),
			command("create-profile", "Create a new browser profile"),
			command("delete-profile", "Delete a browser profile"),
			command("doctor", "Check browser plugin readiness", [{
				flags: "--deep",
				description: "Run a live snapshot probe"
			}])
		],
		register: async (args) => {
			(await import("./browser-cli-manage-CEyBCLQY.mjs")).registerBrowserManageCommands(args.browser, args.parentOpts);
		}
	},
	{
		placeholders: [command("cookie-sync", "Sync allowlisted macOS browser cookies to a managed profile")],
		register: async (args) => {
			(await import("./browser-cli-cookie-sync-DnMZH1I7.mjs")).registerBrowserCookieSyncCommand(args.browser, args.parentOpts);
		}
	},
	{
		placeholders: [command("screenshot", "Capture a screenshot (prints the saved path)"), command("snapshot", "Capture a snapshot (default: ai; aria is the accessibility tree)")],
		register: async (args) => {
			(await import("./browser-cli-inspect-B1w1MU1h.mjs")).registerBrowserInspectCommands(args.browser, args.parentOpts);
		}
	},
	{
		placeholders: [
			command("navigate", "Navigate the current tab to a URL"),
			command("resize", "Resize the viewport"),
			command("click", "Click an element by ref from snapshot"),
			command("click-coords", "Click viewport coordinates"),
			command("type", "Type into an element by ref from snapshot"),
			command("press", "Press a key"),
			command("hover", "Hover an element by ai ref"),
			command("scrollintoview", "Scroll an element into view by ref from snapshot"),
			command("drag", "Drag from one ref to another"),
			command("select", "Select option(s) in a select element"),
			command("upload", "Arm file upload for the next file chooser"),
			command("waitfordownload", "Wait for the next download (and save it)"),
			command("download", "Click a ref and save the resulting download"),
			command("dialog", "Arm the next modal dialog (alert/confirm/prompt)"),
			command("fill", "Fill a form with JSON field descriptors"),
			command("wait", "Wait for time, selector, URL, load state, or JS conditions"),
			command("evaluate", "Evaluate a function against the page or a ref"),
			command("batch", "Run a batch of browser actions in one call")
		],
		register: async (args) => {
			(await import("./browser-cli-actions-input-DujV0dwc.mjs")).registerBrowserActionInputCommands(args.browser, args.parentOpts);
		}
	},
	{
		placeholders: [
			command("console", "Get recent console messages"),
			command("pdf", "Save page as PDF"),
			command("responsebody", "Wait for a network response and return its body")
		],
		register: async (args) => {
			(await import("./browser-cli-actions-observe-n3tUgbAX.mjs")).registerBrowserActionObserveCommands(args.browser, args.parentOpts);
		}
	},
	{
		placeholders: [
			command("highlight", "Highlight an element by ref"),
			command("errors", "Get recent page errors"),
			command("requests", "Get recent network requests (best-effort)"),
			command("trace", "Record a Playwright trace")
		],
		register: async (args) => {
			(await import("./browser-cli-debug-CjULQXpn.mjs")).registerBrowserDebugCommands(args.browser, args.parentOpts);
		}
	},
	{
		placeholders: [
			command("cookies", "Read/write cookies"),
			command("storage", "Read/write localStorage/sessionStorage"),
			command("set", "Browser environment settings")
		],
		register: async (args) => {
			(await import("./browser-cli-state-CgxOK7bj.mjs")).registerBrowserStateCommands(args.browser, args.parentOpts);
		}
	},
	{
		placeholders: [command("extension", "Chrome extension install, status, and pairing")],
		register: async (args) => {
			(await import("./browser-cli-extension-C3gHCXGP.mjs")).registerBrowserExtensionCommands(args.browser, args.parentOpts, args.pluginRoot);
		}
	}
];
function buildBrowserCommandGroups(params) {
	return browserCommandGroupDefinitions.map((entry) => ({
		placeholders: entry.placeholders,
		register: async () => await entry.register(params)
	}));
}
function registerLazyBrowserCommands(browser, parentOpts, argv, pluginRoot) {
	const subcommand = resolveBrowserLazySubcommand(argv);
	registerCommandGroups(browser, buildBrowserCommandGroups({
		browser,
		parentOpts,
		pluginRoot
	}), {
		eager: shouldEagerRegisterSubcommands(),
		primary: subcommand,
		registerPrimaryOnly: subcommand !== null
	});
}
/** Registers the Browser CLI command and its lazy-loaded subcommand groups. */
function registerBrowserCli(program, argv = process.argv, pluginRoot) {
	const browser = program.command("browser").description("Manage Assistant's dedicated browser (Chrome/Chromium)").option("--browser-profile <name>", "Browser profile name (default from config)").option("--json", "Output machine-readable JSON", false).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([...browserCoreExamples, ...browserActionExamples].map((cmd) => [cmd, ""]), true)}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/browser", "docs.testclaw.ai/cli/browser")}\n`).action(() => {
		browser.outputHelp();
		defaultRuntime.error(danger(`Missing subcommand. Try: "${formatCliCommand("testclaw browser status")}"`));
		defaultRuntime.exit(1);
	});
	addGatewayClientOptions(browser);
	const parentOpts = () => browser.opts();
	registerLazyBrowserCommands(browser, parentOpts, argv, pluginRoot);
}
//#endregion
export { registerBrowserCli as t };
