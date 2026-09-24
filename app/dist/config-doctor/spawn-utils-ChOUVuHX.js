import "./src-D9uQ497Z.js";
import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import "./errors-cp9Var1Z.js";
import { t as getSpawnBroker } from "./context-DVMD-4tA.js";
import { n as recordChildProcessSpawn } from "./spawn-diagnostics-XqgfPeEE.js";
import { n as brokerSpawnOptions } from "./host-KdOTN1Xa.js";
import { spawn } from "node:child_process";
import { once } from "node:events";
//#region src/process/spawn-utils.ts
/** Select the process-scoped native spawn transport without changing launch options. */
function spawnProcess(command, args, options) {
	const broker = getSpawnBroker();
	const child = broker && brokerSpawnOptions(options) ? broker.spawn(command, args, options) : spawn(command, args, options);
	recordChildProcessSpawn(command, child);
	return child;
}
function shouldRetry(err) {
	return (err && typeof err === "object" && "code" in err ? String(err.code) : "") === "EBADF";
}
async function spawnAndWaitForSpawn(spawnImpl, argv, options) {
	const child = spawnImpl(expectDefined(argv[0], "argv entry at 0"), argv.slice(1), options);
	try {
		await once(child, "spawn");
	} catch (err) {
		throw toErrorObject(err, "Non-Error rejection");
	}
	return child;
}
async function spawnWithFallback(params) {
	const spawnImpl = params.spawnImpl ?? spawnProcess;
	const baseOptions = { ...params.options };
	const fallbacks = params.fallbacks ?? [];
	const attempts = [baseOptions, ...fallbacks.map((options) => ({
		...baseOptions,
		...options
	}))];
	let lastError;
	for (const [index, attempt] of attempts.entries()) {
		params.assertCurrent?.();
		try {
			return {
				child: await spawnAndWaitForSpawn(spawnImpl, params.argv, attempt),
				usedFallback: index > 0
			};
		} catch (err) {
			lastError = err;
			if (!fallbacks[index] || !shouldRetry(err)) throw err;
		}
	}
	throw lastError;
}
//#endregion
export { spawnWithFallback as n, spawnProcess as t };
