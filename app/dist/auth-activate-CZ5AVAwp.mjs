import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-_30Scclc.mjs";
import { o as callGateway } from "./call-Cm2P5Cd6.mjs";
import { x as toSavedAuthSetupKind } from "./setup-inference-core-qVH6T-0n.mjs";
import { t as activateSetupInference } from "./setup-inference-GP_M4P1b.mjs";
import { i as loadValidConfigSnapshotOrThrow, l as resolveModelsTargetAgent } from "./shared-DVPg8fou.mjs";
import { t as refreshRunningGatewayAuthState } from "./auth-refresh-CwpgcJxA.mjs";
//#region src/commands/models/auth-activate.ts
async function modelsAuthActivateCommand(opts, runtime) {
	const { runtimeConfig } = await loadValidConfigSnapshotOrThrow();
	const { agentId } = resolveModelsTargetAgent(runtimeConfig, opts.agent, { kind: "mutation" });
	const result = await activateSetupInference({
		kind: toSavedAuthSetupKind(opts.profileId.trim()),
		agentId,
		surface: "cli",
		activationConfirmed: true,
		runtime
	});
	if (!result.ok) throw new Error(result.error);
	const refreshed = await refreshRunningGatewayAuthState(agentId, "update", runtime);
	for (const line of result.lines) runtime.log(line);
	let applied = false;
	if (refreshed === "refreshed") try {
		const current = await callGateway({
			method: "config.get",
			params: {},
			timeoutMs: 3e3,
			requireLocalBackendSharedAuth: true
		});
		applied = current.configRevisionHash === current.appliedConfigHash && splitTrailingAuthProfile(resolveAgentEffectiveModelPrimary(current.config, agentId) ?? "").profile === opts.profileId.trim();
	} catch {}
	runtime.log(applied ? `Saved sign-in activated for ${agentId}: ${opts.profileId}` : "Sign-in verified and saved. The running connection could not be confirmed. Run `testclaw gateway restart` to apply the saved settings.");
}
//#endregion
export { modelsAuthActivateCommand };
