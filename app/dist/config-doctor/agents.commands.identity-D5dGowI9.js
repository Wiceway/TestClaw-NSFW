import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-C8MGgrNG.js";
import "./src-D9uQ497Z.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { n as sanitizeTerminalText } from "./safe-text-CXEZaOnt.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import { p as shortenHomePath } from "./utils-BfoJTy8l.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, j as listAgentIds, k as listAgentEntries } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-D61YL_TY.js";
import "./agent-scope-BiRi-Smp.js";
import "./workspace-_6eikbXk.js";
import { r as replaceConfigFile } from "./mutate-CFZDg_sD.js";
import "./config-CiBXBfE2.js";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.js";
import { i as loadAgentIdentityFromWorkspace, r as loadAgentIdentityFromFile } from "./identity-file-CgkoFMsU.js";
import { t as applyAgentConfig } from "./agents.config-DdlBMgIo.js";
import { t as ExpectedCliError } from "./failure-output-B62fEQHE.js";
import { r as requireValidConfigForWrite } from "./config-validation-kR5vBxrW.js";
import { r as logConfigUpdated } from "./logging-ADGA527D.js";
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
