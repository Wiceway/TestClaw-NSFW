import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-Dg6PE4Mj.mjs";
import { o as resolveUserPath } from "./home-dir-BPqVt7Ps.mjs";
import { p as shortenHomePath } from "./utils-Dy46mFy2.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-fXQBq5ZF.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./session-key-C_bfgyCp.mjs";
import { i as listAgentIds, n as listAgentEntries } from "./agent-roster-Cl9s4QHb.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-D3iAUtdH.mjs";
import "./agent-scope-_30Scclc.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as replaceConfigFile } from "./mutate-p35y2dNu.mjs";
import "./config-DqAgdhnz.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as ExpectedCliError } from "./failure-output-BDwPHdmu.mjs";
import "./workspace-bootstrap-policy-DhM0WSIj.mjs";
import "./workspace-CQbT0L2J.mjs";
import { i as loadAgentIdentityFromWorkspace, r as loadAgentIdentityFromFile } from "./identity-file-DKW0N7J8.mjs";
import { t as applyAgentConfig } from "./agents.config-8PkaGUZy.mjs";
import { r as logConfigUpdated } from "./logging-BDPh2tEj.mjs";
import { r as requireValidConfigForWrite } from "./config-validation-DQS8Bqjh.mjs";
import path from "node:path";
//#region src/commands/agents.commands.identity.ts
const normalizeWorkspacePath = (input) => path.resolve(resolveUserPath(input));
function failAgentIdentity(message) {
	throw new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
function resolveAgentIdByWorkspace(cfg, workspaceDir) {
	const list = listAgentEntries(cfg);
	const ids = list.length > 0 ? list.map((entry) => normalizeAgentId(entry.id)) : [resolveDefaultAgentId(cfg)];
	const normalizedTarget = normalizeWorkspacePath(workspaceDir);
	return ids.filter((id) => normalizeWorkspacePath(resolveAgentWorkspaceDir(cfg, id)) === normalizedTarget);
}
/** Update an agent identity from flags or workspace identity markdown. */
async function agentsSetIdentityCommand(opts, runtime = defaultRuntime) {
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	const cfg = migratePersistedImplicitMainRoster(writeSnapshot.snapshot.sourceConfig).config;
	const nameRaw = normalizeOptionalString(opts.name);
	const emojiRaw = normalizeOptionalString(opts.emoji);
	const themeRaw = normalizeOptionalString(opts.theme);
	const avatarRaw = normalizeOptionalString(opts.avatar);
	const hasExplicitIdentity = Boolean(nameRaw || emojiRaw || themeRaw || avatarRaw);
	const identityFileRaw = normalizeOptionalString(opts.identityFile);
	const workspaceRaw = normalizeOptionalString(opts.workspace);
	const wantsIdentityFile = Boolean(opts.fromIdentity || identityFileRaw || !hasExplicitIdentity);
	const normalizedAgent = opts.agent === void 0 ? null : normalizeAgentIdStrict(opts.agent);
	if (normalizedAgent && !normalizedAgent.ok) failAgentIdentity(`Agent "${opts.agent}" not found. Create it with \`testclaw agents add\`.`);
	let agentId = normalizedAgent?.value;
	let identityFilePath;
	let workspaceDir;
	let workspaceLocatorDir;
	if (identityFileRaw) {
		identityFilePath = normalizeWorkspacePath(identityFileRaw);
		workspaceDir = path.dirname(identityFilePath);
	} else if (workspaceRaw) {
		workspaceLocatorDir = normalizeWorkspacePath(workspaceRaw);
		workspaceDir = workspaceLocatorDir;
	} else if (agentId && wantsIdentityFile) workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	else if (wantsIdentityFile || !agentId) workspaceDir = path.resolve(process.cwd());
	if (!agentId) {
		const resolvedWorkspace = expectDefined(workspaceDir, "agent workspace");
		const matches = resolveAgentIdByWorkspace(cfg, resolvedWorkspace);
		if (matches.length === 0) failAgentIdentity(`No agent workspace matches ${shortenHomePath(resolvedWorkspace)}. Pass --agent to target a specific agent.`);
		if (matches.length > 1) failAgentIdentity(`Multiple agents match ${shortenHomePath(resolvedWorkspace)}: ${matches.join(", ")}. Pass --agent to choose one.`);
		agentId = matches[0];
	}
	const resolvedAgentId = expectDefined(agentId, "agent id");
	if (!listAgentIds(cfg).map((id) => normalizeAgentId(id)).includes(resolvedAgentId)) failAgentIdentity(`Agent "${resolvedAgentId}" not found. Create it with \`testclaw agents add\`.`);
	let identityFromFile = null;
	if (wantsIdentityFile) {
		if (identityFilePath) try {
			identityFromFile = await loadAgentIdentityFromFile(identityFilePath);
		} catch (error) {
			failAgentIdentity(formatErrorMessage(error));
		}
		else if (workspaceDir) identityFromFile = loadAgentIdentityFromWorkspace(workspaceDir);
		if (!identityFromFile) {
			const targetPath = identityFilePath ?? (workspaceDir ? path.join(workspaceDir, "IDENTITY.md") : "IDENTITY.md");
			failAgentIdentity(`No identity data found in ${shortenHomePath(targetPath)}.`);
		}
	}
	const fileTheme = identityFromFile?.theme ?? identityFromFile?.creature ?? identityFromFile?.vibe ?? void 0;
	const incomingIdentity = {
		...nameRaw || identityFromFile?.name ? { name: nameRaw ?? identityFromFile?.name } : {},
		...emojiRaw || identityFromFile?.emoji ? { emoji: emojiRaw ?? identityFromFile?.emoji } : {},
		...themeRaw || fileTheme ? { theme: themeRaw ?? fileTheme } : {},
		...avatarRaw || identityFromFile?.avatar ? { avatar: avatarRaw ?? identityFromFile?.avatar } : {}
	};
	const nextConfig = applyAgentConfig(cfg, {
		agentId: resolvedAgentId,
		identity: incomingIdentity
	});
	const committed = await replaceConfigFile({
		...writeSnapshot,
		sourceConfig: nextConfig,
		writeOptions: {
			...writeSnapshot.writeOptions,
			allowConfigSizeDrop: true
		}
	});
	const committedEntry = expectDefined(listAgentEntries(committed.nextConfig).find((entry) => normalizeAgentId(entry.id) === resolvedAgentId), "committed agent config");
	const committedIdentity = expectDefined(committedEntry.identity, "committed agent identity");
	const storedWorkspaceDir = resolveAgentWorkspaceDir(committed.nextConfig, resolvedAgentId);
	const identitySourceDir = identityFromFile ? workspaceDir : void 0;
	const locatorDiffers = workspaceLocatorDir !== void 0 && normalizeWorkspacePath(workspaceLocatorDir) !== normalizeWorkspacePath(storedWorkspaceDir);
	const identitySourceDiffers = identitySourceDir !== void 0 && normalizeWorkspacePath(identitySourceDir) !== normalizeWorkspacePath(storedWorkspaceDir);
	if (opts.json) {
		writeRuntimeJson(runtime, {
			agentId: resolvedAgentId,
			identity: committedIdentity,
			workspace: workspaceDir ?? null,
			storedWorkspace: storedWorkspaceDir,
			identityFile: identityFilePath ?? null
		});
		return;
	}
	logConfigUpdated(runtime);
	runtime.log(`Agent: ${sanitizeTerminalText(resolvedAgentId)}`);
	if (committedIdentity.name) runtime.log(`Name: ${sanitizeTerminalText(committedIdentity.name)}`);
	if (committedIdentity.theme) runtime.log(`Theme: ${sanitizeTerminalText(committedIdentity.theme)}`);
	if (committedIdentity.emoji) runtime.log(`Emoji: ${sanitizeTerminalText(committedIdentity.emoji)}`);
	if (committedIdentity.avatar) runtime.log(`Avatar: ${sanitizeTerminalText(committedIdentity.avatar)}`);
	runtime.log(`Workspace: ${sanitizeTerminalText(shortenHomePath(storedWorkspaceDir))}`);
	if (locatorDiffers && workspaceLocatorDir) {
		runtime.log(`Workspace locator: ${sanitizeTerminalText(shortenHomePath(workspaceLocatorDir))}`);
		runtime.log(`Stored workspace unchanged. Relocate with ${formatCliCommand(`testclaw config set agents.entries.${resolvedAgentId}.workspace ${quoteCliArg(workspaceLocatorDir)}`)}.`);
	} else if (identitySourceDiffers && identitySourceDir) runtime.log(`Identity source: ${sanitizeTerminalText(shortenHomePath(identitySourceDir))}`);
}
//#endregion
export { agentsSetIdentityCommand };
