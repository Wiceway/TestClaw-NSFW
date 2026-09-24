import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { t as normalizeChatType } from "./chat-type-Dy-aVK5n.mjs";
import { i as listRegisteredPluginAgentPromptGuidance } from "./command-registry-state-DUpVKTvF.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-B6-CxN9_.mjs";
import { r as resolveNodeExecEligibility } from "./exec-defaults-C37VpHcZ.mjs";
import { i as mapSandboxSkillEntriesForPrompt, n as resolveEmbeddedRunSkillEntries, o as resolveSandboxSkillRuntimeInputs } from "./runtime-capabilities-D8cwk9dF.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Dt2c3YNS.mjs";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-DKdK8Ya2.mjs";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn } from "./bootstrap-files-CXk1Bt0f.mjs";
import { t as ensureSandboxWorkspaceForSession } from "./context-DR5GVRug.mjs";
import "./sandbox-Bd5wyAMT.mjs";
import { t as createAssistantCodingTools } from "./agent-tools-DXVRk-Ti.mjs";
import { n as resolveAgentPromptSurfaceForSessionKey, t as resolveAgentRuntimePrompt } from "./runtime-prompt-DbMv5GgL.mjs";
import { n as resolveEmbeddedFullAccessState } from "./sandbox-info-Co-LHEhb.mjs";
import { t as getRemoteSkillEligibility } from "./remote-75hX6LX9.mjs";
import { t as resolveReusableWorkspaceSkillSnapshot } from "./session-snapshot-q46YH_7N.mjs";
import { t as resolveRuntimePolicySessionKey } from "./runtime-policy-session-key-fBIz0W3H.mjs";
import { t as buildConfiguredAgentSystemPrompt } from "./system-prompt-config-DIDTVOY9.mjs";
//#region src/auto-reply/reply/commands-system-prompt.ts
const log = createSubsystemLogger("auto-reply/commands-system-prompt");
function resolveCommandSkillsEligibility(params) {
	try {
		const nodeSkills = resolveNodeExecEligibility({
			cfg: params.config,
			sessionEntry: params.sessionEntry,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		});
		return {
			nodeSkills,
			remote: getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		};
	} catch {
		try {
			return {
				nodeSkills: { canExec: false },
				remote: getRemoteSkillEligibility({ advertiseExecNode: false })
			};
		} catch {
			return { nodeSkills: { canExec: false } };
		}
	}
}
async function resolveCommandSkillsPrompt(params) {
	let skillsSnapshot;
	try {
		skillsSnapshot = (await resolveReusableWorkspaceSkillSnapshot({
			workspaceDir: resolveAgentWorkspaceDir(params.config, params.agentId),
			executionWorkspaceDir: params.executionWorkspaceDir,
			config: params.config,
			agentId: params.agentId,
			resolveEligibility: () => ({
				...params.eligibility,
				remote: getRemoteSkillEligibility({ advertiseExecNode: params.eligibility?.nodeSkills?.canExec ?? false })
			}),
			existingSnapshot: params.skillsSnapshot,
			skillFilter: params.skillsSnapshot?.skillFilter,
			skillOverrides: params.skillsSnapshot?.skillOverrides,
			watch: false
		})).snapshot;
	} catch {
		return "";
	}
	if (params.sandboxed) try {
		const sandboxWorkspace = await ensureSandboxWorkspaceForSession({
			skillsSnapshot,
			config: params.config,
			agentId: params.sandboxAgentId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir
		});
		if (!sandboxWorkspace) return "";
		if (sandboxWorkspace.containerWorkdir) {
			const { skillsEligibility, skillsPromptWorkspaceDir, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir, workspaceOnly } = resolveSandboxSkillRuntimeInputs({
				sandbox: {
					enabled: true,
					containerWorkdir: sandboxWorkspace.containerWorkdir,
					...sandboxWorkspace.skillsEligibility ? { skillsEligibility: sandboxWorkspace.skillsEligibility } : {},
					...sandboxWorkspace.skillsWorkspaceDir ? { skillsWorkspaceDir: sandboxWorkspace.skillsWorkspaceDir } : {},
					...sandboxWorkspace.skillUsagePaths ? { skillUsagePaths: sandboxWorkspace.skillUsagePaths } : {},
					...sandboxWorkspace.workspaceAccess ? { workspaceAccess: sandboxWorkspace.workspaceAccess } : {}
				},
				skillsAnchorWorkspace: sandboxWorkspace.workspaceDir,
				skillsSnapshot
			});
			const { shouldLoadSkillEntries, skillEntries, preserveEntryOrder } = await resolveEmbeddedRunSkillEntries({
				workspaceDir: skillsWorkspaceDir,
				config: params.config,
				agentId: params.agentId,
				eligibility: skillsEligibility,
				skillsSnapshot: skillsSnapshotForRun,
				workspaceOnly
			});
			const promptSkillEntries = mapSandboxSkillEntriesForPrompt({
				entries: shouldLoadSkillEntries ? skillEntries : void 0,
				skillsWorkspaceDir,
				skillsPromptWorkspaceDir
			});
			return await resolveSkillsPrompt({
				skillsSnapshot: skillsSnapshotForRun,
				entries: promptSkillEntries,
				config: params.config,
				workspaceDir: skillsPromptWorkspaceDir,
				agentId: params.agentId,
				eligibility: skillsEligibility,
				preserveEntryOrder
			});
		}
	} catch {
		return "";
	}
	return skillsSnapshot.prompt;
}
async function resolveCommandsSystemPromptBundle(params) {
	const workspaceDir = params.workspaceDir;
	const targetSessionEntry = params.sessionStore?.[params.sessionKey] ?? params.sessionEntry;
	const sessionAgentId = params.agentId;
	const { bootstrapFiles, contextFiles: injectedFiles } = await resolveBootstrapContextForRun({
		workspaceDir,
		config: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: targetSessionEntry?.sessionId,
		chatType: targetSessionEntry?.chatType,
		agentId: sessionAgentId,
		warn: makeBootstrapWarn({
			sessionLabel: params.sessionKey,
			workspaceDir,
			warn: (message) => log.warn(message)
		})
	});
	const toolPolicySessionKey = resolveRuntimePolicySessionKey({
		agentId: sessionAgentId,
		cfg: params.cfg,
		ctx: params.ctx,
		sessionKey: params.sessionKey
	});
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey,
		classificationSessionKey: toolPolicySessionKey
	});
	const skillsEligibility = resolveCommandSkillsEligibility({
		agentId: sessionAgentId,
		config: params.cfg,
		sessionEntry: targetSessionEntry,
		sessionKey: params.sessionKey
	});
	const skillsPrompt = await resolveCommandSkillsPrompt({
		agentId: sessionAgentId,
		config: params.cfg,
		eligibility: skillsEligibility,
		sandboxAgentId: sandboxRuntime.classificationAgentId,
		sandboxed: sandboxRuntime.sandboxed,
		sessionKey: toolPolicySessionKey,
		workspaceDir,
		executionWorkspaceDir: targetSessionEntry?.worktree?.canonicalWorkspaceDir ?? workspaceDir,
		skillsSnapshot: targetSessionEntry?.skillsSnapshot
	});
	const tools = (() => {
		try {
			return createAssistantCodingTools({
				config: params.cfg,
				agentId: sessionAgentId,
				workspaceDir,
				sessionKey: toolPolicySessionKey,
				allowGatewaySubagentBinding: true,
				messageProvider: params.command.channel,
				groupId: targetSessionEntry?.groupId ?? void 0,
				groupChannel: targetSessionEntry?.groupChannel ?? void 0,
				groupSpace: targetSessionEntry?.space ?? void 0,
				spawnedBy: targetSessionEntry?.spawnedBy ?? void 0,
				senderId: params.command.senderId,
				senderName: params.ctx.SenderName,
				senderUsername: params.ctx.SenderUsername,
				senderE164: params.ctx.SenderE164,
				modelProvider: params.provider,
				modelId: params.model
			});
		} catch {
			return [];
		}
	})();
	const toolNames = tools.map((t) => t.name);
	const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
	const accountId = params.command.accountId ?? params.ctx.AccountId;
	const { runtimeInfo, userTimezone, userDate, reactionGuidance, messageToolHints } = await resolveAgentRuntimePrompt({
		config: params.cfg,
		agentId: sessionAgentId,
		workspaceDir,
		cwd: process.cwd(),
		sessionKey: params.sessionKey,
		sessionId: targetSessionEntry?.sessionId,
		model: `${params.provider}/${params.model}`,
		channel: params.command.channel,
		accountId,
		chatType: normalizeChatType(params.ctx.ChatType ?? targetSessionEntry?.chatType)
	});
	const fullAccessState = resolveEmbeddedFullAccessState({ execElevated: {
		enabled: params.elevated.enabled,
		allowed: params.elevated.allowed,
		defaultLevel: params.resolvedElevatedLevel ?? "off"
	} });
	const sandboxInfo = sandboxRuntime.sandboxed ? {
		enabled: true,
		workspaceDir,
		workspaceAccess: "rw",
		elevated: {
			allowed: params.elevated.allowed,
			defaultLevel: params.resolvedElevatedLevel ?? "off",
			fullAccessAvailable: fullAccessState.available,
			...fullAccessState.blockedReason ? { fullAccessBlockedReason: fullAccessState.blockedReason } : {}
		}
	} : { enabled: false };
	const { getPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-C1J9Stvc.mjs");
	const preparedModelRuntime = getPreparedModelCatalogOwnerSnapshot({
		config: params.cfg,
		agentId: sessionAgentId,
		workspaceDir
	});
	return {
		systemPrompt: buildConfiguredAgentSystemPrompt({
			config: params.cfg,
			preparedModelRuntime,
			agentId: sessionAgentId,
			workspaceDir,
			reasoningLevel: params.resolvedReasoningLevel,
			extraSystemPrompt: void 0,
			ownerNumbers: void 0,
			reasoningTagHint: false,
			toolNames,
			userTimezone,
			userDate,
			contextFiles: injectedFiles,
			skillsPrompt,
			acpEnabled: isAcpRuntimeSpawnAvailable({
				config: params.cfg,
				sandboxed: sandboxRuntime.sandboxed
			}),
			promptSurface,
			nativeCommandGuidanceLines: listRegisteredPluginAgentPromptGuidance({ surface: promptSurface }),
			reactionGuidance,
			messageToolHints,
			runtimeInfo,
			sandboxInfo
		}),
		tools,
		skillsPrompt,
		bootstrapFiles,
		injectedFiles,
		sandboxRuntime
	};
}
//#endregion
export { resolveCommandsSystemPromptBundle as t };
