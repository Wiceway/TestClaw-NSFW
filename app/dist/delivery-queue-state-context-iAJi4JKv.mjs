import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-C0zD4p1G.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
//#region src/infra/delivery-queue-state-context.ts
function captureDeliveryQueueStateContext(stateDir) {
	const env = resolveDeliveryQueueStateEnv(stateDir);
	return {
		workerContext: captureAssistantStateWorkerContext({ env }),
		stateDir: resolveStateDir(env),
		...isGatewayExternallySupervised(process.env) ? { supervisorMode: "external" } : {}
	};
}
function resolveDeliveryQueueStateEnv(stateDir, context) {
	return context ? {
		...process.env,
		TESTCLAW_STATE_DIR: context.stateDir,
		TESTCLAW_SUPERVISOR_MODE: context.supervisorMode
	} : stateDir ? {
		...process.env,
		TESTCLAW_STATE_DIR: stateDir
	} : process.env;
}
//#endregion
export { resolveDeliveryQueueStateEnv as n, captureDeliveryQueueStateContext as t };
