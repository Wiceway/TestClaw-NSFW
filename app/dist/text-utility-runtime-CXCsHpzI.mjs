import "./cjk-chars-6ld30jSx.mjs";
import { k as withTimeout } from "./fs-safe-B1VkXzpu.mjs";
import "./utils-Dy46mFy2.mjs";
import "./fetch-timeout-Cs4pN7ev.mjs";
import "./with-timeout-CEnLHVHe.mjs";
import "./tool-result-limits-B-fhY8wF.mjs";
//#region src/plugin-sdk/text-utility-runtime.ts
/** Run a channel probe with shared timeout, elapsed-time, and error-result handling. */
async function runChannelProbe(timeoutMs, run, onError) {
	const startedAt = Date.now();
	const elapsedMs = () => Date.now() - startedAt;
	const finish = (result) => ({
		...result,
		elapsedMs: result.elapsedMs ?? elapsedMs()
	});
	try {
		return finish(await withTimeout(run({
			startedAt,
			elapsedMs
		}), timeoutMs ?? 0));
	} catch (error) {
		if (!onError) throw error;
		return finish(onError(error));
	}
}
//#endregion
export { runChannelProbe as t };
