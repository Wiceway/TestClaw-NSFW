import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./io-BXuoCABW.js";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-BJDQV0nt.js";
//#region src/agents/main-session-recovery/main-session-recovery-owner-release.ts
/** Schedules exact-row recovery only after the caller releases its lifecycle admission. */
function scheduleMainSessionRecoveryPendingTarget(target) {
	if (!target) return;
	import("./main-session-restart-recovery-DFejmYDb.js").then(({ scheduleRestartAbortedMainSessionRecoveryAfterOwnerRelease: schedule }) => schedule({
		...target,
		expectedSessionId: target.sessionId,
		getConfig: getRuntimeConfig,
		getGatewayRuntime: getGatewayRecoveryRuntime
	}), () => {});
}
//#endregion
export { scheduleMainSessionRecoveryPendingTarget as t };
