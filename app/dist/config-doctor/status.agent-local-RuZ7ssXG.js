import { d as pathExists } from "./fs-safe-CZ3jhUUr.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BEuqweC1.js";
import "./agent-scope-BiRi-Smp.js";
import { a as evaluateAgentDatabaseAdmissions, f as recordAgentDatabaseAdmissions, s as hasAgentDatabaseAdmissions } from "./agent-database-admission-D08lnQbi.js";
import { t as listGatewayAgentsBasic } from "./agent-list-C7FjDSZV.js";
import { t as measureCliCommandStartup } from "./command-startup-timing-BnaZ05vX.js";
import { n as readStatusSessionStores } from "./session-stores-CIbiR7AJ.js";
import path from "node:path";
//#region src/commands/status.agent-local.ts
/** Returns per-agent local workspace, bootstrap, session count, and last activity status. */
async function collectStatusLocalSnapshot(cfg) {
	if (!hasAgentDatabaseAdmissions()) recordAgentDatabaseAdmissions(await measureCliCommandStartup("status.agent-admission", () => evaluateAgentDatabaseAdmissions(cfg), { config: cfg }));
	const agentList = listGatewayAgentsBasic(cfg);
	const now = Date.now();
	const sessionStores = await measureCliCommandStartup("status.session-stores", () => readStatusSessionStores(cfg, agentList.agents, 10), { config: cfg });
	const statuses = [];
	for (const { agent, path: sessionsPath, count, recent } of sessionStores.byAgent) {
		const agentId = agent.id;
		const workspaceDir = (() => {
			try {
				return resolveAgentWorkspaceDir(cfg, agentId);
			} catch {
				return null;
			}
		})();
		const bootstrapPath = workspaceDir != null ? path.join(workspaceDir, "BOOTSTRAP.md") : null;
		const bootstrapPending = bootstrapPath != null ? await pathExists(bootstrapPath) : null;
		const lastUpdatedAt = recent[0]?.entry.updatedAt ?? 0;
		const resolvedLastUpdatedAt = lastUpdatedAt > 0 ? lastUpdatedAt : null;
		const lastActiveAgeMs = resolvedLastUpdatedAt ? now - resolvedLastUpdatedAt : null;
		statuses.push({
			id: agentId,
			...agent.admissionRefusal ? {
				status: agent.status,
				admissionRefusal: agent.admissionRefusal
			} : {},
			name: agent.name,
			workspaceDir,
			bootstrapPending,
			sessionsPath,
			sessionsCount: count,
			lastUpdatedAt: resolvedLastUpdatedAt,
			lastActiveAgeMs
		});
	}
	const bootstrapPendingCount = statuses.reduce((sum, s) => sum + (s.bootstrapPending ? 1 : 0), 0);
	return {
		agentStatus: {
			defaultId: agentList.selectionRequired ? null : agentList.defaultId,
			ownership: agentList.ownership,
			selectionRequired: agentList.selectionRequired,
			agents: statuses,
			totalSessions: sessionStores.count,
			bootstrapPendingCount
		},
		sessionStores
	};
}
//#endregion
export { collectStatusLocalSnapshot };
