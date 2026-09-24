import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { D as StateDatabaseCoordinatorContentionError } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { s as hasGatewayServiceStopUnsafeError } from "./service-inspection-error-B0LJdIzc.js";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-fRe8i0lu.js";
import { t as DoctorUnreadableStateDatabaseError } from "./state-repair-message-Dr7vDKEC.js";
import { n as GatewayLockError } from "./gateway-lock-BdQ1BI9a.js";
import { t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-DC2sfSBV.js";
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
