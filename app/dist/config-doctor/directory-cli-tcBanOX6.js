import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as theme } from "./theme-DLJw9KCD.js";
import { S as parseStrictPositiveInteger } from "./number-coercion-0M4tZV2c.js";
import { r as renderTerminalSafeTable, t as getTerminalTableWidth } from "./table-B2-iW6Co.js";
import { n as sanitizeTerminalText } from "./safe-text-CXEZaOnt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as danger } from "./globals-NNTJbzqD.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DCQ7FYwR.js";
import { n as resolveChannelDefaultAccountId } from "./helpers-DsHF8yVm.js";
import { r as resolveMessageChannelSelection } from "./channel-selection-BPtL262w.js";
import { f as getScopedChannelsCommandSecretTargets } from "./command-secret-targets-CdV9gKy0.js";
import { t as formatDocsLink } from "./links-B_2WKb2T.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-LPy_iaVf.js";
import { t as parseAccountSelector } from "./account-selector-DE7PugtW.js";
import { t as resolveInstallableChannelPlugin } from "./channel-plugin-resolution-BrCBHHNq.js";
import { t as parseChannelSelector } from "./channel-selector-CTI6xK_s.js";
import { r as requireValidConfigForWrite } from "./config-validation-kR5vBxrW.js";
import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-bx-_yGLM.js";
import { t as formatHelpExamples } from "./help-format-CSGmoada.js";
//#region src/channels/plugins/directory-adapters.ts
const nullChannelDirectorySelf = async () => null;
//#endregion
//#region src/cli/directory-cli.ts
function parseLimit(value) {
	if (value === void 0 || value === null) return null;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw new Error("--limit must be a positive integer.");
	return parsed;
}
function buildRows(entries) {
	return entries.map((entry) => ({
		ID: entry.id,
		Name: normalizeOptionalString(entry.name) ?? ""
	}));
}
function formatDirectoryScope(channelId, accountId) {
	return `channel ${JSON.stringify(sanitizeTerminalText(channelId))}, account ${JSON.stringify(sanitizeTerminalText(accountId))}`;
}
function printDirectoryList(params) {
	if (params.entries.length === 0) {
		defaultRuntime.log(theme.muted(params.emptyMessage));
		return;
	}
	const tableWidth = getTerminalTableWidth();
	defaultRuntime.log(`${theme.heading(params.title)} ${theme.muted(`(${params.entries.length})`)}`);
	defaultRuntime.log(renderTerminalSafeTable({
		width: tableWidth,
		columns: [{
			key: "ID",
			header: "ID",
			minWidth: 16,
			flex: true
		}, {
			key: "Name",
			header: "Name",
			minWidth: 18,
			flex: true
		}],
		rows: buildRows(params.entries)
	}).trimEnd());
}
/** Register directory lookup commands and shared channel/account resolution. */
function registerDirectoryCli(program) {
	const directory = program.command("directory").description("Lookup contact and group IDs (self, peers, groups) for supported chat channels").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["testclaw directory self --channel slack", "Show the connected account identity."],
		["testclaw directory peers list --channel slack --query \"alice\"", "Search contact/user IDs by name."],
		["testclaw directory groups list --channel discord", "List available groups/channels."],
		["testclaw directory groups members --channel discord --group-id <id>", "List members for a specific group."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/directory", "docs.testclaw.ai/cli/directory")}\n`).action(() => {
		directory.help({ error: true });
	});
	const withChannel = (cmd) => cmd.option("--channel <name>", "Channel (auto when only one is configured)", parseChannelSelector).option("--account <id>", "Account id (accountId)", parseAccountSelector).option("--json", "Output JSON", false);
	const resolve = async (opts) => {
		const writeSnapshot = await requireValidConfigForWrite(defaultRuntime);
		if (!writeSnapshot) return null;
		const autoEnabled = applyPluginAutoEnable({
			config: writeSnapshot.snapshot.sourceConfig,
			env: process.env
		});
		const sourceConfig = autoEnabled.config;
		const explicitChannel = opts.channel?.trim();
		const resolvedExplicit = explicitChannel ? await resolveInstallableChannelPlugin({
			cfg: sourceConfig,
			runtime: defaultRuntime,
			rawChannel: explicitChannel,
			allowInstall: true,
			preferRegisteredPlugin: true,
			supports: (plugin) => Boolean(plugin.directory)
		}) : null;
		if (resolvedExplicit?.configChanged || autoEnabled.changes.length > 0) await commitConfigWithPendingPluginInstalls({
			sourceConfig: resolvedExplicit?.cfg ?? sourceConfig,
			baseHash: writeSnapshot.snapshot.hash,
			writeOptions: writeSnapshot.writeOptions
		});
		const runtimeConfig = getRuntimeConfig();
		const selection = explicitChannel ? {
			channel: resolvedExplicit?.channelId,
			plugin: resolvedExplicit?.plugin
		} : await resolveMessageChannelSelection({
			cfg: runtimeConfig,
			channel: opts.channel ?? null,
			accountResolution: "read_only"
		});
		const selectedChannelId = selection.channel;
		const plugin = selection.plugin;
		if (!plugin) throw new Error(`Unsupported channel: ${String(selectedChannelId)}`);
		const channelId = selectedChannelId ?? plugin.id;
		const accountId = normalizeOptionalString(opts.account) || resolveChannelDefaultAccountId({
			plugin,
			cfg: runtimeConfig
		});
		const secretTargets = getScopedChannelsCommandSecretTargets({
			config: runtimeConfig,
			channel: channelId,
			accountId
		});
		const { effectiveConfig } = await resolveCommandConfigWithSecrets({
			config: runtimeConfig,
			commandName: "directory",
			targetIds: secretTargets.targetIds,
			...secretTargets.allowedPaths ? { allowedPaths: secretTargets.allowedPaths } : {},
			mode: "read_only_operational",
			runtime: defaultRuntime
		});
		return {
			cfg: effectiveConfig,
			channelId,
			accountId,
			plugin
		};
	};
	const runDirectoryList = async (params) => {
		const limit = parseLimit(params.opts.limit);
		const resolved = await resolve({
			channel: params.opts.channel,
			account: params.opts.account
		});
		if (!resolved) return;
		const { cfg, channelId, accountId, plugin } = resolved;
		const fn = params.action === "listPeers" ? plugin.directory?.listPeersLive ?? plugin.directory?.listPeers : plugin.directory?.listGroupsLive ?? plugin.directory?.listGroups;
		if (!fn) throw new Error(`Channel ${channelId} does not support directory ${params.unsupported}`);
		const result = await fn({
			cfg,
			accountId,
			query: params.opts.query ?? null,
			limit,
			runtime: defaultRuntime
		});
		if (params.opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		printDirectoryList({
			title: params.title,
			emptyMessage: `${params.emptyMessage} for ${formatDirectoryScope(channelId, accountId)}.`,
			entries: result
		});
	};
	const runDirectoryAction = async (opts, action) => {
		try {
			await action();
		} catch (err) {
			if (opts.json) throw err;
			defaultRuntime.error(danger(formatErrorMessage(err)));
			defaultRuntime.exit(1);
		}
	};
	withChannel(directory.command("self").description("Show the current account user")).action((opts) => runDirectoryAction(opts, async () => {
		const resolved = await resolve({
			channel: opts.channel,
			account: opts.account
		});
		if (!resolved) return;
		const { cfg, channelId, accountId, plugin } = resolved;
		const fn = plugin.directory?.self;
		if (!fn) throw new Error(`Channel ${channelId} does not support directory self`);
		const result = await fn({
			cfg,
			accountId,
			runtime: defaultRuntime
		});
		if (!result) {
			const unsupported = fn === nullChannelDirectorySelf;
			if (opts.json) defaultRuntime.writeJson({
				status: "unavailable",
				channel: channelId,
				accountId,
				reason: unsupported ? "self-identity-unsupported" : "plugin-returned-no-self-identity"
			});
			else defaultRuntime.log(theme.muted(unsupported ? `Channel ${JSON.stringify(sanitizeTerminalText(channelId))} does not expose a self identity.` : `No self identity was returned for ${formatDirectoryScope(channelId, accountId)}. Verify the account is configured and authenticated, then retry.`));
			return;
		}
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		const tableWidth = getTerminalTableWidth();
		defaultRuntime.log(theme.heading("Self"));
		defaultRuntime.log(renderTerminalSafeTable({
			width: tableWidth,
			columns: [{
				key: "ID",
				header: "ID",
				minWidth: 16,
				flex: true
			}, {
				key: "Name",
				header: "Name",
				minWidth: 18,
				flex: true
			}],
			rows: buildRows([result])
		}).trimEnd());
	}));
	withChannel(directory.command("peers").description("Peer directory (contacts/users)").command("list").description("List peers")).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, async () => {
		await runDirectoryList({
			opts,
			action: "listPeers",
			unsupported: "peers",
			title: "Peers",
			emptyMessage: "No peers found"
		});
	}));
	const groups = directory.command("groups").description("Group directory");
	withChannel(groups.command("list").description("List groups")).option("--query <text>", "Optional search query").option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, async () => {
		await runDirectoryList({
			opts,
			action: "listGroups",
			unsupported: "groups",
			title: "Groups",
			emptyMessage: "No groups found"
		});
	}));
	withChannel(groups.command("members").description("List group members").requiredOption("--group-id <id>", "Group id")).option("--limit <n>", "Limit results").action((opts) => runDirectoryAction(opts, async () => {
		const limit = parseLimit(opts.limit);
		const groupId = normalizeStringifiedOptionalString(opts.groupId) ?? "";
		if (!groupId) throw new Error("Missing --group-id");
		const resolved = await resolve({
			channel: opts.channel,
			account: opts.account
		});
		if (!resolved) return;
		const { cfg, channelId, accountId, plugin } = resolved;
		const fn = plugin.directory?.listGroupMembers;
		if (!fn) throw new Error(`Channel ${channelId} does not support group members listing`);
		const result = await fn({
			cfg,
			accountId,
			groupId,
			limit,
			runtime: defaultRuntime
		});
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		printDirectoryList({
			title: "Group Members",
			emptyMessage: `No group members found for group ${JSON.stringify(sanitizeTerminalText(groupId))}, ${formatDirectoryScope(channelId, accountId)}.`,
			entries: result
		});
	}));
}
//#endregion
export { registerDirectoryCli };
