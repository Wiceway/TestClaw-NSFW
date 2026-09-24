import { n as normalizeAgentId } from "./agent-id-C8MGgrNG.js";
import { C as tryResolveAmbientOwnerAgentId, j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import "./session-key-AvQIavYt.js";
import { a as getResolvedLoggerSettings, r as getChildLogger, s as toPinoLikeLogger } from "./logger-DmjW9g94.js";
import { i as tryGetLegacyDefaultAgentId } from "./legacy.default-agent-owner-C3BvcqUT.js";
import "./agent-scope-BiRi-Smp.js";
import { a as isAgentDeletionBlocked } from "./agent-lifecycle-registry-BHA6mh5y.js";
import { t as CronService } from "./service-cxneL3M5.js";
import { y as resolveCronJobsStorePath } from "./store-DmG8kbi1.js";
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
