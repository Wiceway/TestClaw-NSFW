import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { f as hashRuntimeConfigValue, o as getRuntimeConfigAppliedHash } from "./runtime-snapshot-DTssNCAN.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-D2a98CpI.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { g as setCommandLaneConcurrency, r as enqueueCommandInLane } from "./command-queue-BKEY7Dlw.js";
import { t as WizardSession } from "./session-DsnmHRHD.js";
import { n as createAdmittedWizardSession, r as respondSetupAdmissionBusy } from "./setup-admission-WhcDAsAj.js";
//#region src/gateway/server-methods/system-agent-execution.ts
const SYSTEM_AGENT_GATEWAY_EXECUTION_KEY = "gateway";
const systemAgentGatewayExecutionQueue = new KeyedAsyncQueue();
async function runSystemAgentGatewayTask(task) {
	setCommandLaneConcurrency("system-agent", Number.MAX_SAFE_INTEGER);
	return await enqueueCommandInLane("system-agent", () => systemAgentGatewayExecutionQueue.enqueue(SYSTEM_AGENT_GATEWAY_EXECUTION_KEY, task));
}
async function verifyGatewaySetupInference(params) {
	const [{ readConfigFileSnapshot }, { verifySetupInference }] = await Promise.all([import("./config-fCohulPn.js"), import("./setup-inference-DqvZe-fa.js")]);
	const runtimeConfig = params.context.getRuntimeConfig();
	const appliedHash = getRuntimeConfigAppliedHash();
	const isCurrent = () => appliedHash !== null && params.context.isConfigReloadSettled() && params.context.getRuntimeConfig() === runtimeConfig && getRuntimeConfigAppliedHash() === appliedHash;
	const isApplied = async () => {
		if (!isCurrent()) return false;
		const snapshot = await readConfigFileSnapshot();
		return snapshot.exists && snapshot.valid && hashRuntimeConfigValue(snapshot.sourceConfig) === appliedHash && isCurrent();
	};
	const unavailable = {
		ok: false,
		status: "unavailable",
		error: "Gateway settings are saved but not active yet. Wait for application or restart to finish, then retry verification."
	};
	if (!await isApplied()) return unavailable;
	const verification = await verifySetupInference({
		runtime: params.runtime,
		...params.modelTarget ? { modelTarget: params.modelTarget } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return await isApplied() ? verification : unavailable;
}
async function activateGatewaySetupInference(params) {
	let complete;
	let restartRequired;
	let result;
	try {
		result = await runSystemAgentGatewayTask(async () => {
			const { activateSetupInference } = await import("./setup-inference-DqvZe-fa.js");
			return activateSetupInference({
				...params,
				onActivationCompletion: (completion) => {
					complete = completion;
				}
			});
		});
	} finally {
		restartRequired = await complete?.();
	}
	return result.ok && restartRequired ? {
		...result,
		gatewayRestartRequired: true
	} : result;
}
//#endregion
//#region src/gateway/server-methods/system-agent-setup-wizard.ts
function rejectExistingSetupWizardSession(params) {
	if (!params.context.wizardSessions.has(params.sessionId)) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard session already exists"));
	return true;
}
async function startSetupActivationWizard(params) {
	if (rejectExistingSetupWizardSession(params)) return;
	const session = await createAdmittedWizardSession(() => new WizardSession(async (prompter, signal, runnerSession) => {
		const result = await activateGatewaySetupInference({
			...params.activation,
			surface: "gateway",
			isRemoteProviderAuth: params.isLocalClient !== true,
			runtime: {
				...defaultRuntime,
				exit: (code) => {
					throw new Error(`setup step exited with code ${String(code)}`);
				}
			},
			prompter,
			signal,
			isCancelled: () => signal.aborted,
			beforePersistentEffect: () => runnerSession.lockCancellationForPreparation(),
			onPreparationComplete: () => runnerSession.finishPreparation(),
			onCommitStarted: () => runnerSession.lockCancellation()
		});
		signal.throwIfAborted();
		if (!result.ok) {
			if (result.disposition === "rejected-before-promotion") runnerSession.setActivationRejection({
				disposition: result.disposition,
				status: result.status
			});
			throw new Error(result.error);
		}
		runnerSession.setModelActivation({
			modelRef: result.modelRef,
			...result.modelTarget ? { modelTarget: result.modelTarget } : {},
			...result.gatewayRestartRequired ? { gatewayRestartRequired: true } : {}
		});
	}, { timeoutMs: params.timeoutMs }));
	if (!session) {
		respondSetupAdmissionBusy(params.respond);
		return;
	}
	params.context.wizardSessions.set(params.sessionId, session);
	params.respond(true, {
		sessionId: params.sessionId,
		done: false,
		status: "running"
	}, void 0);
}
//#endregion
export { verifyGatewaySetupInference as a, runSystemAgentGatewayTask as i, startSetupActivationWizard as n, activateGatewaySetupInference as r, rejectExistingSetupWizardSession as t };
