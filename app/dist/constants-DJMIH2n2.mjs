import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/daemon/constants.ts
/** Cross-platform daemon service names, labels, and profile-aware descriptions. */
const GATEWAY_LAUNCH_AGENT_LABEL = "ai.testclaw.gateway";
const GATEWAY_SYSTEMD_SERVICE_NAME = "testclaw-gateway";
const GATEWAY_WINDOWS_TASK_NAME = "Assistant Gateway";
const GATEWAY_SERVICE_MARKER = "testclaw";
const GATEWAY_SERVICE_KIND = "gateway";
const GATEWAY_SERVICE_RUNTIME_PID_ENV = "TESTCLAW_GATEWAY_SERVICE_PID";
const GATEWAY_SERVICE_SELECTOR_ENV_KEYS = [
	"TESTCLAW_STATE_DIR",
	"TESTCLAW_CONFIG_PATH",
	"TESTCLAW_PROFILE",
	"TESTCLAW_GATEWAY_PORT",
	"TESTCLAW_LAUNCHD_LABEL",
	"TESTCLAW_SYSTEMD_UNIT",
	"TESTCLAW_WINDOWS_TASK_NAME"
];
function isGatewayServiceEnv(env) {
	if (env.TESTCLAW_SERVICE_MARKER?.trim() !== "testclaw") return false;
	const serviceKind = env.TESTCLAW_SERVICE_KIND?.trim();
	return !serviceKind || serviceKind === "gateway";
}
const NODE_LAUNCH_AGENT_LABEL = "ai.testclaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "testclaw-node";
const NODE_WINDOWS_TASK_NAME = "Assistant Node";
const NODE_SERVICE_MARKER = "testclaw";
const NODE_SERVICE_KIND = "node";
const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
const LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES = ["clawdbot-gateway"];
function normalizeGatewayProfile(profile) {
	const trimmed = profile?.trim();
	if (!trimmed || normalizeLowercaseStringOrEmpty(trimmed) === "default") return null;
	return trimmed;
}
function resolveGatewayProfileSuffix(profile) {
	const normalized = normalizeGatewayProfile(profile);
	return normalized ? `-${normalized}` : "";
}
function resolveGatewayLaunchAgentLabel(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_LAUNCH_AGENT_LABEL;
	return `ai.testclaw.${normalized}`;
}
function resolveGatewaySystemdServiceName(profile) {
	const suffix = resolveGatewayProfileSuffix(profile);
	if (!suffix) return GATEWAY_SYSTEMD_SERVICE_NAME;
	return `testclaw-gateway${suffix}`;
}
function resolveGatewayWindowsTaskName(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return GATEWAY_WINDOWS_TASK_NAME;
	return `Assistant Gateway (${normalized})`;
}
function resolveGatewayNativeServiceIdentityConflict(env, platform = process.platform) {
	const profile = normalizeGatewayProfile(env.TESTCLAW_PROFILE);
	if (!profile) return null;
	if (platform === "darwin") {
		const envKey = "TESTCLAW_LAUNCHD_LABEL";
		const actual = env[envKey]?.trim();
		const expected = resolveGatewayLaunchAgentLabel(profile);
		return actual && actual !== expected ? {
			envKey,
			expected
		} : null;
	}
	if (platform === "linux") {
		const envKey = "TESTCLAW_SYSTEMD_UNIT";
		const actual = env[envKey]?.trim();
		const normalizedActual = actual?.endsWith(".service") ? actual : actual && `${actual}.service`;
		const expected = `${resolveGatewaySystemdServiceName(profile)}.service`;
		return normalizedActual && normalizedActual !== expected ? {
			envKey,
			expected
		} : null;
	}
	if (platform === "win32") {
		const envKey = "TESTCLAW_WINDOWS_TASK_NAME";
		const actual = env[envKey]?.trim();
		const expected = resolveGatewayWindowsTaskName(profile);
		return actual && actual !== expected ? {
			envKey,
			expected
		} : null;
	}
	return null;
}
function formatGatewayServiceDescription(profile) {
	const normalized = normalizeGatewayProfile(profile);
	if (!normalized) return "Assistant Gateway";
	return `Assistant Gateway (profile: ${normalized})`;
}
function resolveGatewayServiceDescription(params) {
	return params.description ?? formatGatewayServiceDescription(params.env.TESTCLAW_PROFILE);
}
function resolveNodeLaunchAgentLabel() {
	return NODE_LAUNCH_AGENT_LABEL;
}
function resolveNodeSystemdServiceName() {
	return NODE_SYSTEMD_SERVICE_NAME;
}
function resolveNodeWindowsTaskName() {
	return NODE_WINDOWS_TASK_NAME;
}
function resolveNodeServiceIdentityEnvironment() {
	return {
		TESTCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel(),
		TESTCLAW_SYSTEMD_UNIT: resolveNodeSystemdServiceName(),
		TESTCLAW_WINDOWS_TASK_NAME: resolveNodeWindowsTaskName(),
		TESTCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1",
		TESTCLAW_TASK_SCRIPT_NAME: NODE_WINDOWS_TASK_SCRIPT_NAME,
		TESTCLAW_LOG_PREFIX: "node",
		TESTCLAW_SERVICE_MARKER: NODE_SERVICE_MARKER,
		TESTCLAW_SERVICE_KIND: NODE_SERVICE_KIND
	};
}
//#endregion
export { resolveNodeSystemdServiceName as _, GATEWAY_SERVICE_SELECTOR_ENV_KEYS as a, isGatewayServiceEnv as c, resolveGatewayProfileSuffix as d, resolveGatewayServiceDescription as f, resolveNodeServiceIdentityEnvironment as g, resolveNodeLaunchAgentLabel as h, GATEWAY_SERVICE_RUNTIME_PID_ENV as i, resolveGatewayLaunchAgentLabel as l, resolveGatewayWindowsTaskName as m, GATEWAY_SERVICE_KIND as n, LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES as o, resolveGatewaySystemdServiceName as p, GATEWAY_SERVICE_MARKER as r, NODE_SERVICE_KIND as s, GATEWAY_LAUNCH_AGENT_LABEL as t, resolveGatewayNativeServiceIdentityConflict as u, resolveNodeWindowsTaskName as v };
