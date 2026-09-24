import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { r as findStartupMaintenanceRequiredError } from "./startup-maintenance-required-dhosRuFE.js";
import { t as AssistantDatabaseSchemaPreflightError } from "./testclaw-database-preflight.messages-Drhs5G1o.js";
//#region src/cli/gateway-cli/startup-maintenance.ts
const gatewayLog = createSubsystemLogger("gateway");
function resolveGatewayStartupMaintenanceReason(error) {
	return findStartupMaintenanceRequiredError(error)?.reason;
}
async function handleGatewayStartupMaintenance(error) {
	const maintenance = findStartupMaintenanceRequiredError(error);
	if (!maintenance) return false;
	const reason = maintenance.reason;
	let refusal = maintenance;
	if (maintenance.kind === "newer-schema" && !(maintenance instanceof AssistantDatabaseSchemaPreflightError)) try {
		const { preflightAssistantDatabaseSchemas } = await import("./testclaw-database-preflight-D-1emagy.js");
		const schemas = await preflightAssistantDatabaseSchemas({ env: process.env });
		if (schemas.incompatible.length > 0) refusal = new AssistantDatabaseSchemaPreflightError(schemas.incompatible);
	} catch {}
	const stop = `Stop the service with ${formatCliCommand("testclaw gateway stop")} (or its service owner), then`;
	const guidance = reason === "a newer Assistant build" ? `${stop} restore your pre-update backup created with ${formatCliCommand("testclaw backup create")}, then start it again with ${formatCliCommand("testclaw gateway start")}. See https://docs.testclaw.ai/install/updating#rollback.` : `${stop} run ${formatCliCommand("testclaw doctor --fix")}, then start it again with ${formatCliCommand("testclaw gateway start")}.`;
	let parked = false;
	try {
		const { parkCurrentLaunchAgentForMaintenance } = await import("./launchd-13qYcvzA.js");
		parked = await parkCurrentLaunchAgentForMaintenance();
	} catch (parkError) {
		gatewayLog.error(`failed to park the managed LaunchAgent: ${formatErrorMessage(parkError)}`);
	}
	if (refusal instanceof AssistantDatabaseSchemaPreflightError) {
		gatewayLog.error(`${formatErrorMessage(refusal)}${parked ? " Parked the managed LaunchAgent." : ""}`);
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(refusal)}`);
	} else {
		gatewayLog.error(`gateway requires ${reason}${parked ? "; parked the managed LaunchAgent" : ""}. ${guidance}`);
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(error)}. ${guidance}`);
	}
	defaultRuntime.exit(78);
	return true;
}
//#endregion
export { resolveGatewayStartupMaintenanceReason as n, handleGatewayStartupMaintenance as t };
