import { n as compareSemverStrings } from "./update-check-D4M5AA5a.js";
//#region src/infra/update-runner-doctor.ts
const UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV = "TESTCLAW_UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR";
const UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV = "TESTCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE";
const UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART_ENV = "TESTCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART";
const UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV = "TESTCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR";
const UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV = "TESTCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION";
const UPDATE_DOCTOR_SERVICE_REPAIR_POLICY_ENV = "TESTCLAW_SERVICE_REPAIR_POLICY";
const EXTERNAL_SERVICE_REPAIR_POLICY_MIN_VERSION = "2026.4.25-beta.1";
function resolveUpdateDoctorExecutionPolicy(params) {
	if (params.allowGatewayServiceRepair) return { fix: true };
	const support = compareSemverStrings(params.targetVersion, EXTERNAL_SERVICE_REPAIR_POLICY_MIN_VERSION);
	if (support !== null && support >= 0) return {
		fix: true,
		serviceRepairPolicy: "external"
	};
	return { fix: false };
}
function buildUpdateDoctorEnv(params) {
	return {
		TESTCLAW_UPDATE_IN_PROGRESS: "1",
		...params.deferConfiguredPluginInstallRepair ? { [UPDATE_DEFER_CONFIGURED_PLUGIN_INSTALL_REPAIR_ENV]: "1" } : {},
		[UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE_ENV]: "1",
		[UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART_ENV]: "1",
		[UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV]: params.allowGatewayServiceRepair ? "1" : "0",
		[UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV]: params.allowGatewayActivation ? "1" : "0",
		[UPDATE_DOCTOR_SERVICE_REPAIR_POLICY_ENV]: params.serviceRepairPolicy,
		...params.compatibilityHostVersion ? { TESTCLAW_COMPATIBILITY_HOST_VERSION: params.compatibilityHostVersion } : {}
	};
}
//#endregion
export { resolveUpdateDoctorExecutionPolicy as n, buildUpdateDoctorEnv as t };
