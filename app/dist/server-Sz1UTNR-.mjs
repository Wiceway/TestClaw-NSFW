import { i as measureGatewayBootstrapStep } from "./startup-trace-CP6CKAU0.mjs";
import { t as truncateCloseReason } from "./close-reason-B67wSC7I.mjs";
//#region src/gateway/server.ts
/**
* Lazy public entrypoint for the gateway server implementation.
*
* Keeping `server-start` behind dynamic import lets light-weight callers import
* server types and helpers without paying the full startup dependency graph.
*/
async function loadServerStart() {
	return await measureGatewayBootstrapStep("gateway.server-start-import", () => import("./server-start-D_2aMzkk.mjs"));
}
/** Starts the gateway server after lazily loading the full server implementation. */
async function startGatewayServer(port = 18789, opts = {}) {
	const startupStartedAt = opts.startupStartedAt ?? Date.now();
	let stopDatabaseAdmission;
	const start = async () => {
		const { createSqliteReadOnlyWorkerScope } = await import("./sqlite-readonly-worker-D8-3X6e-.mjs");
		const readOnlyWorkers = createSqliteReadOnlyWorkerScope();
		const { withAgentDatabaseStartupAdmission } = await import("./agent-database-startup-rNVPC_a5.mjs");
		try {
			const server = await readOnlyWorkers.run(() => withAgentDatabaseStartupAdmission(async (admission) => {
				stopDatabaseAdmission = () => admission.stop();
				return (await loadServerStart()).startGatewayServerCore(port, {
					...opts,
					startupStartedAt
				});
			}));
			return {
				...server,
				close: (closeOptions) => readOnlyWorkers.run(async () => {
					try {
						await server.close(closeOptions);
					} finally {
						await readOnlyWorkers.close();
					}
				})
			};
		} catch (error) {
			await readOnlyWorkers.close();
			throw error;
		}
	};
	if (process.platform !== "linux" || process.versions.bun) return await start();
	const { startGatewaySpawnBroker, runWithSpawnBroker } = await import("./context-Bp8bPUmI.mjs");
	let logger;
	const broker = await startGatewaySpawnBroker({
		onReady(pid, restarted) {
			if (restarted) logger?.info(`spawn broker restarted pid=${pid}`);
		},
		async onStartupFailure(message) {
			const { createSubsystemLogger } = await import("./subsystem-BSizy-B4.mjs");
			createSubsystemLogger("gateway").error(message);
		}
	});
	if (!broker) return await start();
	const closeBroker = async () => {
		await stopDatabaseAdmission?.();
		await broker.close();
	};
	try {
		const { createSubsystemLogger } = await import("./subsystem-BSizy-B4.mjs");
		logger = createSubsystemLogger("gateway");
		logger.info(`spawn broker ready pid=${broker.pid}`);
		const server = await runWithSpawnBroker(broker, start);
		return {
			...server,
			close: (closeOptions) => runWithSpawnBroker(broker, async () => {
				try {
					await server.close(closeOptions);
				} finally {
					await closeBroker();
				}
			})
		};
	} catch (error) {
		await closeBroker();
		throw error;
	}
}
//#endregion
export { startGatewayServer, truncateCloseReason };
