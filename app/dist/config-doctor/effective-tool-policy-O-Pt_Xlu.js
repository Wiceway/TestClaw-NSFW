import { a as collectExplicitDenylist } from "./tool-policy-BFaYCu9H.js";
import { r as getPluginToolMeta } from "./tool-metadata-BnzelBzh.js";
import { t as applyToolPolicyPipeline } from "./tool-policy-pipeline-yiyfYkqA.js";
import { i as resolveConversationToolPolicies, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-BklTZ6p6.js";
import { t as buildDeclaredToolAllowlistContext } from "./tool-policy-declared-context-BumZlrgR.js";
//#region src/agents/embedded-agent-runner/effective-tool-policy.ts
function applyFinalEffectiveToolPolicy(params) {
	if (params.bundledTools.length === 0) return params.bundledTools;
	const capabilityProfile = params.conversationCapabilityProfile;
	const { trustedGroup } = capabilityProfile.policy;
	if (trustedGroup.dropped) params.warn("effective tool policy: dropping caller-provided groupId that does not match session-derived group context");
	const policies = resolveConversationToolPolicies({ capabilityProfile });
	const pipelineSteps = buildConversationToolPolicyPipelineSteps({
		capabilityProfile,
		policies,
		includeRuntimeToolPolicy: false
	}).map((step) => Object.assign({}, step, { suppressUnavailableCoreToolWarning: true }));
	return applyToolPolicyPipeline({
		tools: params.bundledTools,
		toolMeta: (tool) => getPluginToolMeta(tool),
		warn: params.warn,
		steps: pipelineSteps,
		onFilter: params.onFilter,
		declaredToolAllowlist: buildDeclaredToolAllowlistContext({
			config: params.config,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.metadataSnapshot,
			toolDenylist: collectExplicitDenylist(pipelineSteps.map((step) => step.policy))
		})
	});
}
//#endregion
export { applyFinalEffectiveToolPolicy as t };
