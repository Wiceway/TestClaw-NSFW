import { r as STATE_DIR } from "./paths-DeOFr7iP.js";
import { i as normalizeMainKey } from "./session-key-C0UQClgw.js";
import "./session-key-AvQIavYt.js";
import { o as getRuntimeConfigAppliedHash } from "./runtime-snapshot-DTssNCAN.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-BiRi-Smp.js";
import { t as createConfigIO } from "./io.factory-D6Qm5I9o.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./io-BXuoCABW.js";
import { r as resolveAgentMainSessionKey } from "./main-session-DzZK9knv.js";
import { c as getGatewaySuspendAdmissionPhase } from "./gateway-work-admission-DJ5CkZgB.js";
import "./sessions-4kX-llHk.js";
import { n as resolveGatewayAuth } from "./auth-resolve-BdzJh_th.js";
import { n as resolveGatewayAgentSelectionState } from "./agent-list-C7FjDSZV.js";
import "./auth-3HaCNOXL.js";
import { t as listSystemPresence } from "./system-presence-B2UbZ4Wg.js";
import { n as getUpdateSchedule, t as getUpdateAvailable } from "./update-status-state-CWEy2E9S.js";
import { o as projectUpdateAvailable } from "./events-CAEUKvkp.js";
import { t as createPresenceRecipientProjection } from "./presence-projection-DKXF41UU.js";
//#region src/gateway/server/health-state.ts
let presenceVersion = 1;
let healthVersion = 1;
let healthCache = null;
let broadcastHealthUpdate = null;
const healthRefreshStates = {
	public: {
		nextGeneration: 0,
		committedGeneration: 0,
		inFlight: {
			passive: null,
			probe: null
		}
	},
	admin: {
		nextGeneration: 0,
		committedGeneration: 0,
		inFlight: {
			passive: null,
			probe: null
		}
	}
};
function buildGatewaySnapshot(opts) {
	const cfg = getRuntimeConfig();
	const selection = resolveGatewayAgentSelectionState(cfg);
	const defaultAgentId = selection.defaultId;
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	const scope = cfg.session?.scope ?? "per-sender";
	const mainSessionKey = scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId: defaultAgentId
	});
	const presence = createPresenceRecipientProjection({
		cfg,
		presence: listSystemPresence()
	})(opts.client);
	const uptimeMs = Math.round(process.uptime() * 1e3);
	const includeUpdateDetails = opts?.includeUpdateDetails === true;
	const updateAvailable = projectUpdateAvailable(getUpdateAvailable(), includeUpdateDetails) ?? void 0;
	const updateSchedule = includeUpdateDetails ? getUpdateSchedule() ?? void 0 : void 0;
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	const snapshot = {
		suspension: { phase: getGatewaySuspendAdmissionPhase() },
		presence,
		health: {},
		stateVersion: {
			presence: presenceVersion,
			health: healthVersion
		},
		uptimeMs,
		appliedConfigHash: appliedConfigHash ? opts.revisionProjector.projectResolvedHash(appliedConfigHash) : null,
		sessionDefaults: {
			defaultAgentId,
			modelConfigured: Boolean(resolveAgentEffectiveModelPrimary(cfg, defaultAgentId)),
			ownership: selection.ownership,
			selectionRequired: selection.selectionRequired,
			mainKey,
			mainSessionKey,
			scope
		},
		updateAvailable,
		updateSchedule
	};
	if (opts?.includeSensitive === true) {
		const auth = resolveGatewayAuth({
			authConfig: cfg.gateway?.auth,
			env: process.env
		});
		snapshot.configPath = createConfigIO().configPath;
		snapshot.stateDir = STATE_DIR;
		snapshot.authMode = auth.mode;
	}
	return snapshot;
}
function getHealthCache() {
	return healthCache;
}
function getHealthVersion() {
	return healthVersion;
}
function incrementPresenceVersion() {
	presenceVersion += 1;
	return presenceVersion;
}
function getPresenceVersion() {
	return presenceVersion;
}
function setBroadcastHealthUpdate(fn) {
	broadcastHealthUpdate = fn;
}
async function refreshGatewayHealthSnapshot(opts) {
	const includeSensitive = opts?.includeSensitive === true;
	const audience = includeSensitive ? "admin" : "public";
	const state = healthRefreshStates[audience];
	const strength = opts?.probe === false ? "passive" : "probe";
	const existing = strength === "passive" ? state.inFlight.probe ?? state.inFlight.passive : state.inFlight.probe;
	if (existing) return existing.promise;
	const generation = state.nextGeneration + 1;
	state.nextGeneration = generation;
	const promise = (async () => {
		const { collectGatewayHealthSnapshot } = await import("./collector-fyCj7kO_.js");
		let runtimeSnapshot;
		try {
			runtimeSnapshot = opts?.getRuntimeSnapshot?.();
		} catch {
			runtimeSnapshot = void 0;
		}
		const configReloadHotReloadStatus = opts?.getConfigReloaderHotReloadStatus?.();
		const snap = await collectGatewayHealthSnapshot({
			audience,
			probe: strength === "probe",
			runtimeSnapshot,
			...configReloadHotReloadStatus ? { configReloadHotReloadStatus } : {},
			...opts?.getSessionRowProjection ? { sessionRowProjection: opts.getSessionRowProjection() } : {}
		});
		const eventLoop = opts?.getEventLoopHealth?.();
		if (eventLoop) snap.eventLoop = eventLoop;
		if (strength === "probe" && state.inFlight.passive && state.inFlight.passive.generation < generation) state.inFlight.passive = null;
		if (!includeSensitive && generation > state.committedGeneration) {
			state.committedGeneration = generation;
			healthCache = snap;
			healthVersion += 1;
			if (broadcastHealthUpdate) broadcastHealthUpdate(snap);
		}
		return snap;
	})().finally(() => {
		if (state.inFlight[strength]?.generation === generation) state.inFlight[strength] = null;
	});
	state.inFlight[strength] = {
		generation,
		promise
	};
	return promise;
}
//#endregion
export { incrementPresenceVersion as a, getPresenceVersion as i, getHealthCache as n, refreshGatewayHealthSnapshot as o, getHealthVersion as r, setBroadcastHealthUpdate as s, buildGatewaySnapshot as t };
