import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { d as normalizeStringEntries } from "./string-normalization-DsCfAx8q.js";
import { t as asBoolean } from "./boolean-DmBL0YJK.js";
import "./utils-BfoJTy8l.js";
import { a as redactChannelAccountSnapshotBaseUrl, i as projectSafeChannelAccountSnapshotFields } from "./account-snapshot-fields-CBHwDt5W.js";
import { i as resolveChannelAccountState, t as applyChannelAccountState } from "./account-state-BM02MWhQ.js";
//#region src/plugin-sdk/status-helpers.ts
/** Normalize runtime-only account state into the shared status snapshot fields. */
function buildRuntimeAccountStatusSnapshot(params, extra) {
	const { runtime, probe } = params;
	return {
		running: runtime?.running ?? false,
		lastStartAt: runtime?.lastStartAt ?? null,
		lastStopAt: runtime?.lastStopAt ?? null,
		lastError: runtime?.lastError ?? null,
		probe,
		...typeof runtime?.linked === "boolean" ? { linked: runtime.linked } : {},
		...typeof runtime?.connected === "boolean" ? { connected: runtime.connected } : {},
		...typeof runtime?.restartPending === "boolean" ? { restartPending: runtime.restartPending } : {},
		...typeof runtime?.reconnectAttempts === "number" ? { reconnectAttempts: runtime.reconnectAttempts } : {},
		...typeof runtime?.lastConnectedAt === "number" ? { lastConnectedAt: runtime.lastConnectedAt } : {},
		...runtime?.lastDisconnect ? { lastDisconnect: runtime.lastDisconnect } : {},
		...typeof runtime?.lastEventAt === "number" ? { lastEventAt: runtime.lastEventAt } : {},
		...typeof runtime?.lastTransportActivityAt === "number" ? { lastTransportActivityAt: runtime.lastTransportActivityAt } : {},
		...typeof runtime?.healthState === "string" ? { healthState: runtime.healthState } : {},
		...runtime?.lifecycle ? { lifecycle: runtime.lifecycle } : {},
		...runtime?.ingressUnavailable === true ? { ingressUnavailable: true } : {},
		...runtime?.terminalDisconnect ? { terminalDisconnect: runtime.terminalDisconnect } : {},
		...typeof runtime?.busy === "boolean" ? { busy: runtime.busy } : {},
		...typeof runtime?.activeRuns === "number" ? { activeRuns: runtime.activeRuns } : {},
		...typeof runtime?.lastRunActivityAt === "number" ? { lastRunActivityAt: runtime.lastRunActivityAt } : {},
		...typeof runtime?.activeRunStartedAt === "number" ? { activeRunStartedAt: runtime.activeRunStartedAt } : {},
		...extra ?? {}
	};
}
//#endregion
//#region src/channels/account-summary.ts
/**
* Channel account summary helpers.
*
* Builds safe status snapshots and resolves enabled/configured account state.
*/
/** Projects an admitted lifetime without resolving its potentially stale account configuration. */
function buildChannelAccountSnapshotFromRuntime(runtime) {
	return {
		...buildRuntimeAccountStatusSnapshot({ runtime }),
		...projectSafeChannelAccountSnapshotFields(runtime),
		accountId: runtime.accountId,
		enabled: runtime.enabled,
		configured: runtime.configured,
		stateReason: runtime.stateReason
	};
}
/** Projects diagnostic inspection metadata without treating it as a runtime account. */
function buildChannelAccountSnapshotFromInspection(params) {
	const inspected = asNullableRecord(params.account);
	const enabled = asBoolean(inspected?.enabled) ?? params.runtime?.enabled ?? true;
	const configured = asBoolean(inspected?.configured) ?? params.runtime?.configured;
	const snapshot = {
		...buildRuntimeAccountStatusSnapshot(params),
		lastInboundAt: params.runtime?.lastInboundAt ?? null,
		lastOutboundAt: params.runtime?.lastOutboundAt ?? null,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...params.runtime,
		...params.probe !== void 0 ? { probe: params.probe } : {},
		accountId: normalizeOptionalString(inspected?.accountId) ?? params.accountId,
		enabled,
		configured
	};
	if (configured === void 0) {
		snapshot.stateReason = enabled ? "configuration status unavailable" : "disabled";
		if (!enabled) snapshot.running = false;
		return redactChannelAccountSnapshotBaseUrl(snapshot);
	}
	const reason = normalizeOptionalString(inspected?.stateReason);
	applyChannelAccountState(snapshot, resolveChannelAccountState({
		enabled,
		configured,
		linked: snapshot.linked,
		runtime: snapshot,
		disabledReason: reason,
		unconfiguredReason: reason
	}));
	return redactChannelAccountSnapshotBaseUrl(snapshot);
}
/**
* Builds the safe account snapshot shown by CLI, gateway, and status summaries.
*/
function buildChannelAccountSummary(params) {
	const described = params.plugin.config.describeAccount?.(params.account, params.cfg);
	return redactChannelAccountSnapshotBaseUrl({
		enabled: params.enabled,
		configured: params.configured,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...described,
		accountId: params.accountId
	});
}
/**
* Formats allowFrom entries with a plugin formatter when one exists.
*/
function formatChannelAllowFrom(params) {
	if (params.plugin.config.formatAllowFrom) return params.plugin.config.formatAllowFrom({
		cfg: params.cfg,
		accountId: params.accountId,
		allowFrom: params.allowFrom
	});
	return normalizeStringEntries(params.allowFrom);
}
/**
* Resolves whether a channel account should be treated as enabled.
*/
function resolveChannelAccountEnabled(params) {
	if (params.plugin.config.isEnabled) return params.plugin.config.isEnabled(params.account, params.cfg);
	return (isRecord(params.account) ? params.account.enabled : void 0) !== false;
}
/**
* Resolves whether a channel account has enough configuration to run.
*/
async function resolveChannelAccountConfigured(params) {
	if (params.plugin.config.isConfigured) return await params.plugin.config.isConfigured(params.account, params.cfg);
	if (params.readAccountConfiguredField) return (isRecord(params.account) ? params.account.configured : void 0) !== false;
	return true;
}
//#endregion
export { resolveChannelAccountConfigured as a, formatChannelAllowFrom as i, buildChannelAccountSnapshotFromRuntime as n, resolveChannelAccountEnabled as o, buildChannelAccountSummary as r, buildChannelAccountSnapshotFromInspection as t };
