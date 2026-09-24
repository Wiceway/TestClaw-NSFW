import { n as normalizeAgentId } from "./agent-id-fXQBq5ZF.mjs";
import { C as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./session-key-C_bfgyCp.mjs";
import { i as listAgentIds } from "./agent-roster-Cl9s4QHb.mjs";
import { i as tryGetLegacyDefaultAgentId } from "./legacy.default-agent-owner-C-WRgKDI.mjs";
import { a as getResolvedLoggerSettings, l as toPinoLikeLogger, r as getChildLogger } from "./logger-Cnti88IN.mjs";
import "./agent-scope-_30Scclc.mjs";
import { a as isAgentDeletionBlocked } from "./agent-lifecycle-registry-r7UAOGpY.mjs";
import { t as resolveCronJobsStorePath } from "./paths-DhhZyQfL.mjs";
import "./store-DySaWHFF.mjs";
import { t as CronService } from "./service-CjaNR8on.mjs";
//#region src/cron/local-service.ts
async function withLocalAgentCronJobsRemoved(agentId, getRuntimeConfig, commit) {
	const cfg = getRuntimeConfig();
	const storePath = resolveCronJobsStorePath();
	const service = new CronService({
		storePath,
		cronEnabled: cfg.cron?.enabled !== false,
		cronConfig: cfg.cron,
		log: toPinoLikeLogger(getChildLogger({
			module: "cron",
			storeKey: storePath
		}), getResolvedLoggerSettings().level),
		defaultAgentId: tryResolveAmbientOwnerAgentId(cfg),
		legacyDefaultAgentId: tryGetLegacyDefaultAgentId(cfg),
		resolveDefaultAgentId: () => tryResolveAmbientOwnerAgentId(getRuntimeConfig()),
		isAgentAvailable: (id) => !isAgentDeletionBlocked(id) && listAgentIds(getRuntimeConfig()).some((configuredId) => normalizeAgentId(configuredId) === id),
		enqueueSystemEvent: () => false,
		requestHeartbeat: () => {},
		runIsolatedAgentJob: async () => {
			throw new Error("Cron execution is unavailable in local service context.");
		}
	});
	try {
		return await service.removeAgentJobsTransactional(agentId, commit);
	} finally {
		service.stop();
	}
}
//#endregion
export { withLocalAgentCronJobsRemoved as t };
