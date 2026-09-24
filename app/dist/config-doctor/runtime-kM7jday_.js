import { n as loggingState } from "./state-DaoCpEu8.js";
import { t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.js";
//#region packages/terminal-core/src/restore.ts
const RESET_SEQUENCE = "\x1B[0m\x1B[?25h\x1B[?1000l\x1B[?1002l\x1B[?1003l\x1B[?1006l\x1B[?2004l\x1B[<u\x1B[>4;0m";
function reportRestoreFailure(scope, err, reason) {
	const suffix = reason ? ` (${reason})` : "";
	const message = `[terminal] restore ${scope} failed${suffix}: ${String(err)}`;
	try {
		process.stderr.write(`${message}\n`);
	} catch (writeErr) {
		console.error(`[terminal] restore reporting failed${suffix}: ${String(writeErr)}`);
	}
}
function restoreTerminalState(reason, options = {}) {
	const resumeStdin = options.resumeStdinIfPaused ?? options.resumeStdin ?? false;
	const resetStream = options.resetStream ?? process.stdout;
	try {
		clearActiveProgressLine();
	} catch (err) {
		reportRestoreFailure("progress line", err, reason);
	}
	const stdin = process.stdin;
	if (stdin.isTTY && typeof stdin.setRawMode === "function") {
		try {
			stdin.setRawMode(false);
		} catch (err) {
			reportRestoreFailure("raw mode", err, reason);
		}
		if (resumeStdin && typeof stdin.isPaused === "function" && stdin.isPaused()) try {
			stdin.resume();
		} catch (err) {
			reportRestoreFailure("stdin resume", err, reason);
		}
	}
	if (resetStream.isTTY) try {
		resetStream.write(RESET_SEQUENCE);
	} catch (err) {
		reportRestoreFailure("terminal reset", err, reason);
	}
}
//#endregion
//#region src/runtime.ts
function shouldEmitRuntimeLog(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.TESTCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof console.log.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.TESTCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof process.stdout.write.mock === "object";
}
function isPipeClosedError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function hasRuntimeOutputWriter(runtime) {
	return typeof runtime.writeStdout === "function";
}
function writeStdout(value) {
	if (!shouldEmitRuntimeStdout()) return;
	clearActiveProgressLine();
	const line = value.endsWith("\n") ? value : `${value}\n`;
	try {
		process.stdout.write(line);
	} catch (err) {
		if (isPipeClosedError(err)) return;
		throw err;
	}
}
function createRuntimeIo() {
	return {
		log: (...args) => {
			if (!shouldEmitRuntimeLog()) return;
			clearActiveProgressLine();
			console.log(...args);
		},
		error: (...args) => {
			clearActiveProgressLine();
			console.error(...args);
		},
		writeStdout,
		writeJson: (value, space = 2) => {
			writeStdout(JSON.stringify(value, void 0, space > 0 ? space : void 0));
		}
	};
}
/** Keep terminal reset bytes off stdout when the invocation owns machine-readable output. */
function restoreRuntimeTerminalState(reason, options = {}) {
	const resetStream = options.resetStream ?? (loggingState.forceConsoleToStderr ? process.stderr : void 0);
	restoreTerminalState(reason, {
		...options,
		...resetStream ? { resetStream } : {}
	});
}
const defaultRuntime = {
	...createRuntimeIo(),
	exit: (code, opts) => {
		restoreRuntimeTerminalState("runtime exit", {
			resumeStdinIfPaused: false,
			...opts?.resetStream ? { resetStream: opts.resetStream } : {}
		});
		process.exit(code);
		throw new Error("unreachable");
	}
};
/** Signals a deferred or non-exiting runtime exit so callers can unwind owned resources. */
var ExitError = class extends Error {
	constructor(code, message) {
		super(message ?? `exit ${code}`);
		this.code = code;
		this.name = "ExitError";
	}
};
function createNonExitingRuntime() {
	return {
		...createRuntimeIo(),
		exit: (code, _opts) => {
			throw new ExitError(code);
		}
	};
}
function writeRuntimeJson(runtime, value, space = 2) {
	if (hasRuntimeOutputWriter(runtime)) {
		runtime.writeJson(value, space);
		return;
	}
	runtime.log(JSON.stringify(value, void 0, space > 0 ? space : void 0));
}
function writeRuntimeStdout(runtime, value) {
	if (hasRuntimeOutputWriter(runtime)) {
		runtime.writeStdout(value);
		return;
	}
	runtime.log(value);
}
//#endregion
export { writeRuntimeJson as a, restoreRuntimeTerminalState as i, createNonExitingRuntime as n, writeRuntimeStdout as o, defaultRuntime as r, restoreTerminalState as s, ExitError as t };
