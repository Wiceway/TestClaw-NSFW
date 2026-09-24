import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import "./session-key-C_bfgyCp.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { l as resolveSessionStorePathCore } from "./paths-D1bkI3aW.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CyLpJ2LV.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CBM31t7c.mjs";
import { t as resolveAgentSessionDirs } from "./session-dirs-SATsXf4g.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, f as listConfiguredSessionStoreAgentIds } from "./targets-DS0OmfJW.mjs";
import { t as hasSessionEntriesByStatusReadOnly } from "./session-accessor.sqlite-entry-BgjD5zI-.mjs";
import "./session-accessor-CtBBLApI.mjs";
import "./sessions-QjbxjKuh.mjs";
import path from "node:path";
//#region src/agents/main-session-recovery/main-session-restart-recovery-shared.ts
const mainSessionRecoveryLog = createSubsystemLogger("main-session-restart-recovery");
const DEFAULT_RECOVERY_DELAY_MS = 5e3;
function resolveRestartRecoveryTerminalClientRunId(entry) {
	return entry.restartRecoverySourceIngress === "control-ui" ? normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) : void 0;
}
function normalizeStringSet(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const trimmed = value.trim();
		if (trimmed) normalized.add(trimmed);
	}
	return normalized;
}
const normalizeFiniteTimestamp = asFiniteNumber;
function hasCurrentProcessOwner(params) {
	if (params.activeSessionIds.has(params.entry.sessionId)) return true;
	return params.activeSessionIds.size === 0 && params.activeSessionKeys.has(params.sessionKey);
}
async function discoverRestartRecoveryStoreTargets(params) {
	const storeTargets = [];
	const stateDir = params.stateDir ?? resolveStateDir(process.env);
	const env = {
		...process.env,
		TESTCLAW_STATE_DIR: stateDir
	};
	if (params.cfg) {
		const configuredAgentIds = listConfiguredSessionStoreAgentIds(params.cfg);
		const configuredStorePaths = new Set(configuredAgentIds.map((agentId) => path.resolve(resolveSessionStorePathCore(params.cfg?.session?.store, {
			agentId,
			env
		}))));
		const configuredAgentIdSet = new Set(configuredAgentIds);
		for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env })) {
			const storePath = path.resolve(target.storePath);
			if (!configuredAgentIdSet.has(target.agentId) && !configuredStorePaths.has(storePath)) continue;
			storeTargets.push({
				...target,
				storePath
			});
		}
	} else for (const sessionsDir of await resolveAgentSessionDirs(stateDir)) {
		const storePath = path.join(sessionsDir, "sessions.json");
		storeTargets.push({
			agentId: resolveSqliteTargetFromSessionStorePath(storePath).agentId ?? "main",
			storePath
		});
	}
	return storeTargets.filter((target) => !readAgentDatabaseAdmissionRefusal(target.agentId, { env }) && (!params.statuses || hasSessionEntriesByStatusReadOnly({
		...target,
		env
	}, params.statuses))).toSorted((a, b) => a.storePath.localeCompare(b.storePath) || a.agentId.localeCompare(b.agentId));
}
//#endregion
export { normalizeFiniteTimestamp as a, mainSessionRecoveryLog as i, discoverRestartRecoveryStoreTargets as n, normalizeStringSet as o, hasCurrentProcessOwner as r, resolveRestartRecoveryTerminalClientRunId as s, DEFAULT_RECOVERY_DELAY_MS as t };
