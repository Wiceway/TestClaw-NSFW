import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
import { T as StateDatabaseCoordinatorContentionError } from "./sqlite-source-handle-CDYF24uv.mjs";
import { s as hasGatewayServiceStopUnsafeError } from "./service-inspection-error-DLyDrlb3.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-Dn-wRvxN.mjs";
import { n as GatewayLockError } from "./gateway-lock-CMKMxZa9.mjs";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-Dr7vDKEC.mjs";
import { t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-Q7LpdcwR.mjs";
//#region src/commands/doctor-maintenance-inspection.ts
/** Admission verdict for explicit Doctor maintenance before mutable repair. */
/** Admission has not opened repair writers; deferral cannot authorize any later work. */
function classifyDoctorMaintenanceRefusal(error) {
	const causes = collectNestedErrorCandidates(error);
	if (hasGatewayServiceStopUnsafeError(error)) return {
		kind: "data-at-risk",
		reason: "active-mutation"
	};
	if (causes.some((cause) => cause instanceof DoctorUnreadableStateDatabaseError)) return {
		kind: "data-at-risk",
		reason: "unreadable-state"
	};
	if (causes.some((cause) => cause instanceof DoctorStateMigrationRefusalError)) return {
		kind: "data-at-risk",
		reason: "incomplete-migration"
	};
	if (causes.some((cause) => cause instanceof GatewayLockError)) return {
		kind: "data-at-risk",
		reason: "gateway-state-unverified"
	};
	return {
		kind: "deferred",
		reason: causes.some((cause) => cause instanceof StateDatabaseCoordinatorContentionError) ? "coordinator-contention" : "admission-unavailable"
	};
}
function assertDoctorMaintenanceInspection(inspection, env) {
	const kind = inspection.serviceUpdateVerdict?.kind;
	if (!inspection.blockMessage && (kind === "unavailable" || inspection.inspected && (kind === "owned" || kind === "absent" || inspection.offline === true))) return;
	const detail = inspection.blockMessage ?? `Gateway service ownership or shutdown could not be verified. Run ${formatCliCommand("testclaw gateway status --deep", env)} and stop it through its service owner before retrying.`;
	throw new DoctorMaintenanceRefusalError(`Doctor could not enter maintenance. Error: ${detail} Stop the Gateway service and other Assistant processes using this state, then run ${formatCliCommand("testclaw doctor --fix", env)} from an independent shell.`, {
		kind: "data-at-risk",
		reason: "gateway-state-unverified"
	});
}
//#endregion
export { classifyDoctorMaintenanceRefusal as n, assertDoctorMaintenanceInspection as t };
