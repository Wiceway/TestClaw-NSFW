import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { k as parseAgentSessionKey, x as isSubagentSessionKey } from "./session-key-AvQIavYt.js";
import { _ as resolveSessionAgentId } from "./agent-scope-BiRi-Smp.js";
import { n as isSystemEventStoreCurrent } from "./system-event-ownership-CyoXvClm.js";
import { y as readTaskBackingInstance } from "./task-registry.store.kernel-Bnd9Ls7p.js";
import { A as getSubagentRunsForRequesterSession, j as subagentRuns } from "./subagent-run-liveness-D6t-uqkj.js";
import { D as getSubagentSessionListRunsSnapshotForRead, L as withSubagentRunReadSnapshot, a as getLatestLiveSubagentRunByChildSessionKey, f as listSubagentRunsForController, p as listSubagentRunsForRequester, v as buildSubagentRunReadIndexFromRuns } from "./subagent-registry-read-DD46xgBs.js";
import { n as findTaskByRunId } from "./task-registry-query-R9q--_2Z.js";
import { r as resolveStoredSubagentCapabilities } from "./subagent-capabilities-9LXIvheU.js";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey } from "./sessions-helpers-aQr2GWhq.js";
import { n as resolveSubagentRequesterAgentId } from "./subagent-requester-owner-ChaBwEHU.js";
import { n as observeSubagentExecution } from "./subagent-execution-observation-B5A1gJte.js";
import { t as getTaskExecutionObservation } from "./task-execution-observation-DPvdDZMN.js";
import { n as captureSubagentListReadContext } from "./subagent-list-BlxCcEkR.js";
import { n as isRequesterSettleWakeForRun } from "./subagent-requester-settle-identity-B9cUdMU4.js";
//#region src/agents/subagents/registry/subagent-control-scope.ts
/** Recent-run default window used by subagent control UI/tools. */
const DEFAULT_RECENT_MINUTES = 30;
/** Maximum recent-run window accepted by subagent control UI/tools. */
const MAX_RECENT_MINUTES = 1440;
/** Resolves which subagent runs the caller is allowed to control. */
function resolveSubagentController(params) {
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	const callerRaw = params.agentSessionKey?.trim() || alias;
	const callerSessionKey = resolveInternalSessionKey({
		key: callerRaw,
		alias,
		mainKey
	});
	const controllerAgentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: callerSessionKey,
		agentId: params.agentId
	});
	if (!isSubagentSessionKey(callerSessionKey)) return {
		controllerSessionKey: callerSessionKey,
		controllerAgentId,
		callerSessionKey,
		callerIsSubagent: false,
		controlScope: "children"
	};
	return {
		controllerSessionKey: callerSessionKey,
		controllerAgentId,
		callerSessionKey,
		callerIsSubagent: true,
		controlScope: resolveStoredSubagentCapabilities(callerSessionKey, {
			cfg: params.cfg,
			agentId: controllerAgentId
		}).controlScope
	};
}
function listControlledSubagentRunsForTurn(controller, requesterTurnRunId) {
	const controlledRuns = listSubagentRunsForController(controller.controllerSessionKey, controller.controllerAgentId);
	if (requesterTurnRunId === void 0) return controlledRuns;
	const requesterRuns = listSubagentRunsForRequester(controller.controllerSessionKey, { requesterAgentId: controller.controllerAgentId });
	const runsById = new Map(requesterRuns.filter((entry) => getLatestLiveSubagentRunByChildSessionKey(entry.childSessionKey) === entry).map((entry) => [entry.runId, entry]));
	return controlledRuns.filter((entry) => entry.requesterTurnRunId === requesterTurnRunId || isRequesterSettleWakeForRun({
		entry,
		runId: requesterTurnRunId,
		requesterSessionKey: controller.controllerSessionKey,
		requesterAgentId: controller.controllerAgentId,
		runsById
	}));
}
function resolveRunRequesterAgentId(entry, cfg) {
	if (entry.requesterAgentId) return entry.requesterAgentId;
	const parsed = parseAgentSessionKey(entry.requesterSessionKey)?.agentId;
	if (parsed || !cfg) return parsed;
	return resolveSubagentRequesterAgentId(cfg, entry);
}
function isSubagentRunVisibleToSession(entry, sessionKey, agentId, cfg) {
	const controllerKey = entry.controllerSessionKey?.trim();
	const requesterKey = entry.requesterSessionKey.trim();
	const requesterAgentId = resolveRunRequesterAgentId(entry, cfg);
	const controllerAgentId = (controllerKey ? parseAgentSessionKey(controllerKey)?.agentId : void 0) ?? requesterAgentId;
	const normalizedAgentId = normalizeAgentId(agentId);
	return controllerKey === sessionKey && controllerAgentId === normalizedAgentId || requesterKey === sessionKey && requesterAgentId === normalizedAgentId;
}
/** Builds one stable snapshot for controlled-run listing and descendant status reads. */
async function buildControlledSubagentRunsReadContext(controllerSessionKey, controllerAgentId, cfg, recentMinutes = 30) {
	const key = controllerSessionKey.trim();
	const agentId = controllerAgentId ?? parseAgentSessionKey(key)?.agentId;
	if (!key || !agentId) return {
		runs: [],
		list: captureSubagentListReadContext([], buildSubagentRunReadIndexFromRuns({ runs: /* @__PURE__ */ new Map() }), /* @__PURE__ */ new Map(), recentMinutes),
		getExecutionObservation: () => ({ state: "unknown" })
	};
	const select = (snapshot) => {
		const index = buildSubagentRunReadIndexFromRuns({
			runs: snapshot,
			inMemoryRuns: subagentRuns.values()
		});
		const visible = [...index.latestRunsByChildSessionKey.values()].filter((entry) => isSubagentRunVisibleToSession(entry, key, agentId, cfg));
		return {
			index,
			runIds: visible.map((entry) => entry.runId),
			sessionKeys: visible.filter((entry) => entry.pauseReason === "sessions_yield").map((entry) => entry.childSessionKey)
		};
	};
	return withSubagentRunReadSnapshot(subagentRuns, select, (selection, snapshot) => buildControlledReadContext(snapshot, selection.index, new Set(selection.runIds), cfg, recentMinutes));
}
function buildControlledReadContext(snapshot, readIndex, visibleIds, cfg, recentMinutes = 30) {
	const runs = [...snapshot.values()].filter((entry) => visibleIds.has(entry.runId));
	const list = captureSubagentListReadContext(runs, readIndex, snapshot, recentMinutes);
	return {
		runs: list.view.latest,
		list,
		getExecutionObservation: (entry) => {
			const taskRunId = entry.taskRunId ?? entry.runId;
			const task = findTaskByRunId(taskRunId);
			const backing = readTaskBackingInstance(task?.detail);
			const requesterAgentId = resolveRunRequesterAgentId(entry, cfg);
			if (task?.runtime === "subagent" && task.runId === taskRunId && task.childSessionKey === entry.childSessionKey && task.requesterSessionKey === entry.requesterSessionKey && requesterAgentId !== void 0 && task.requesterAgentId === requesterAgentId && task.agentId === (parseAgentSessionKey(entry.childSessionKey)?.agentId ?? requesterAgentId) && backing?.runtime === "subagent" && backing.generation === entry.generation) return getTaskExecutionObservation(task);
			return observeSubagentExecution(entry, getSubagentRunsForRequesterSession(entry.childSessionKey));
		}
	};
}
/** Cancellation consumes current ownership facts without hydrating retained result payloads. */
function listControlledSubagentRunFacts(controllerSessionKey, controllerAgentId, cfg) {
	if (!controllerAgentId) return [];
	return [...buildSubagentRunReadIndexFromRuns({ runs: getSubagentSessionListRunsSnapshotForRead(subagentRuns) }).latestRunsByChildSessionKey.values()].filter((entry) => isSubagentRunVisibleToSession(entry, controllerSessionKey, controllerAgentId, cfg));
}
function ensureSubagentControllerOwnsRun(params) {
	const controllerKey = params.entry.controllerSessionKey?.trim();
	const owner = controllerKey || params.entry.requesterSessionKey;
	const ownerStorePath = controllerKey ? params.entry.controllerStorePath : params.entry.requesterStorePath;
	const ownerAgentId = parseAgentSessionKey(owner)?.agentId ?? resolveRunRequesterAgentId(params.entry, params.cfg);
	const controllerAgentId = params.controller.controllerAgentId ?? parseAgentSessionKey(params.controller.controllerSessionKey)?.agentId;
	if (owner === params.controller.controllerSessionKey && ownerAgentId === controllerAgentId && (ownerStorePath === void 0 || isSystemEventStoreCurrent(owner, ownerStorePath, ownerAgentId))) return;
	return "Subagents can only control runs spawned from their own session.";
}
function getLatestOwnedSubagentRun(childSessionKey, agentId, cfg) {
	const ownerFilter = parseAgentSessionKey(childSessionKey) ? void 0 : agentId;
	return getLatestLiveSubagentRunByChildSessionKey(childSessionKey, ownerFilter ? (candidate) => resolveRunRequesterAgentId(candidate, cfg) === ownerFilter : void 0) ?? void 0;
}
function isCurrentSubagentRun(entry, cfg) {
	if (!cfg) return getLatestLiveSubagentRunByChildSessionKey(entry.childSessionKey) === entry;
	return getLatestOwnedSubagentRun(entry.childSessionKey, resolveRunRequesterAgentId(entry, cfg), cfg) === entry;
}
function isSameSubagentRunGeneration(live, snapshot) {
	return live.childSessionKey === snapshot.childSessionKey && live.runId === snapshot.runId && live.generation === snapshot.generation && live.createdAt === snapshot.createdAt;
}
//#endregion
export { getLatestOwnedSubagentRun as a, isSubagentRunVisibleToSession as c, resolveSubagentController as d, ensureSubagentControllerOwnsRun as i, listControlledSubagentRunFacts as l, MAX_RECENT_MINUTES as n, isCurrentSubagentRun as o, buildControlledSubagentRunsReadContext as r, isSameSubagentRunGeneration as s, DEFAULT_RECENT_MINUTES as t, listControlledSubagentRunsForTurn as u };
