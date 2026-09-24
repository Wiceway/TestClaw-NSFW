import { p as resolveGatewaySystemdServiceName } from "./constants-DJMIH2n2.mjs";
import { i as runCommandWithTimeout } from "./exec-BddaUUYf.mjs";
import { n as readSystemdServiceRuntime } from "./systemd-C14FU_go.mjs";
import { i as buildGatewayConnectionDetails } from "./call-Cm2P5Cd6.mjs";
//#region src/cli/logs-cli.runtime.ts
const DEFAULT_LOG_SUBPROCESS_TIMEOUT_MS = 1e4;
const STDERR_MAX_BYTES = 65536;
async function execFileUtf8Tail(command, args, options) {
	try {
		const result = await runCommandWithTimeout([command, ...args], {
			baseEnv: options.env,
			maxOutputBytes: {
				stdout: options.maxBytes,
				stderr: STDERR_MAX_BYTES
			},
			timeoutMs: options.timeoutMs ?? DEFAULT_LOG_SUBPROCESS_TIMEOUT_MS
		});
		return {
			stdout: result.stdout,
			stderr: result.stderr,
			code: result.code ?? 1,
			truncated: Boolean(result.stdoutTruncatedBytes)
		};
	} catch (error) {
		return {
			stdout: "",
			stderr: error instanceof Error ? error.message : String(error),
			code: 1,
			truncated: false
		};
	}
}
//#endregion
export { buildGatewayConnectionDetails, execFileUtf8Tail, readSystemdServiceRuntime, resolveGatewaySystemdServiceName };
