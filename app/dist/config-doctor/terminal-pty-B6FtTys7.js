import { a as __toESM } from "./rolldown-runtime-B000p9w_.js";
import { i as signalPtySessionTree } from "./kill-tree-BGQdx374.js";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.js";
import { i as resolveWindowsSpawnProgram, n as materializeWindowsSpawnProgram, r as resolveWindowsExecutablePath } from "./windows-spawn-wVSY09BI.js";
import { i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-BYdhONRJ.js";
import { n as resolvePtyTerminalName, r as setPtyTerminalName, t as readPtyTerminalName } from "./pty-terminal-name-Cn3vXzKc.js";
import path from "node:path";
//#region src/process/terminal-pty.ts
function resolveTerminalNodeExecutable(env) {
	const candidate = path.win32.basename(process.execPath).toLowerCase() === "node.exe" ? process.execPath : resolveWindowsExecutablePath("node", env);
	if (path.win32.basename(candidate).toLowerCase() === "node.exe") return candidate;
	throw new Error("A Node executable is required to launch this Windows npm wrapper; add node.exe to PATH.");
}
function resolveTerminalPtyInvocation(params) {
	const platform = params.platform ?? process.platform;
	if (!isWindowsBatchCommand(params.file, platform)) return {
		file: params.file,
		args: params.args
	};
	const program = resolveWindowsSpawnProgram({
		command: params.file,
		platform,
		env: params.env,
		execPath: process.execPath,
		allowShellFallback: true
	});
	if (program.resolution !== "shell-fallback") {
		const invocation = materializeWindowsSpawnProgram(program.resolution === "node-entrypoint" ? {
			...program,
			command: resolveTerminalNodeExecutable(params.env)
		} : program, params.args);
		return {
			file: invocation.command,
			args: invocation.argv
		};
	}
	return {
		file: resolveEnvironmentValue(params.env, "COMSPEC")?.trim() || resolveTrustedWindowsCmdExe(platform),
		args: `/d /s /c ${buildWindowsCmdExeCommandLine(params.file, params.args)}`
	};
}
async function spawnTerminalPty(params, lifecycle) {
	const assertCurrent = () => {
		lifecycle?.assertCurrent?.();
		if (lifecycle?.abortSignal?.aborted) throw new Error("PTY construction aborted");
	};
	if (process.versions.bun && process.platform !== "win32") {
		const { spawnNodeTerminalPty } = await import("./terminal-pty-node-Dxld5wZ4.js");
		assertCurrent();
		return await spawnNodeTerminalPty(params, assertCurrent);
	}
	const { spawn } = await import("./node-pty-DLewxmTl.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
	const env = params.env ? { ...params.env } : void 0;
	const terminalName = resolvePtyTerminalName(params.name ?? readPtyTerminalName(env ?? process.env, process.platform));
	if (env) setPtyTerminalName({
		env,
		name: terminalName,
		platform: process.platform
	});
	const invocation = resolveTerminalPtyInvocation({
		file: params.file,
		args: params.args,
		env: env ?? process.env
	});
	assertCurrent();
	const pty = spawn(invocation.file, invocation.args, {
		name: terminalName,
		cols: params.cols,
		rows: params.rows,
		cwd: params.cwd,
		env
	});
	return {
		get pid() {
			return pty.pid;
		},
		write: (data) => pty.write(data),
		resize: (cols, rows) => pty.resize(cols, rows),
		pause: () => pty.pause(),
		resume: () => pty.resume(),
		onData: (listener) => pty.onData(listener),
		onExit: (listener) => pty.onExit(listener),
		kill: (signal) => killPtyTree(pty, signal)
	};
}
function killPtyTree(pty, signal) {
	const sig = signal ?? "SIGKILL";
	try {
		if ((sig === "SIGKILL" || sig === "SIGTERM") && typeof pty.pid === "number" && pty.pid > 0) signalPtySessionTree(pty.pid, sig);
		else if (process.platform === "win32") pty.kill();
		else pty.kill(sig);
	} catch {}
}
//#endregion
export { spawnTerminalPty as t };
