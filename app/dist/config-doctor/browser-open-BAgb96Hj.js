import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import "./utils-BfoJTy8l.js";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.js";
import { a as resolveExecutableFromPathEnv, n as isExecutableFile } from "./executable-path-Cckkl2tv.js";
import { n as getWindowsInstallRoots } from "./windows-install-roots-DYABQcWw.js";
import { i as runCommandWithTimeout } from "./exec-BXnQTpXR.js";
import { t as isWSL } from "./wsl-BQP0ORkx.js";
import path from "node:path";
//#region src/infra/detect-binary.ts
/** Return true when a safe executable name/path can be found on this host. */
async function detectBinary(name) {
	if (!name?.trim()) return false;
	if (!isSafeExecutableValue(name)) return false;
	const resolved = name.startsWith("~") ? resolveUserPath(name) : name;
	if (path.isAbsolute(resolved) || resolved.startsWith(".") || resolved.includes("/") || resolved.includes("\\")) return isExecutableFile(resolved);
	try {
		const cwd = process.cwd();
		const pathEnv = resolveEnvironmentValue(process.env, "PATH") ?? "";
		const searchPath = process.platform === "win32" ? `${cwd};${pathEnv}` : pathEnv;
		const extension = process.platform === "win32" ? path.extname(name) : "";
		const lookupEnv = extension ? { PATHEXT: extension } : process.env;
		return Boolean(resolveExecutableFromPathEnv(name, searchPath, lookupEnv, {
			cwd,
			useCache: false
		}));
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/browser-open.ts
function shouldSkipBrowserOpenInTests() {
	if (process.env.VITEST) return true;
	return false;
}
function resolveWindowsRundll32Path() {
	const { systemRoot } = getWindowsInstallRoots();
	return path.win32.join(systemRoot, "System32", "rundll32.exe");
}
function normalizeBrowserOpenUrl(raw) {
	try {
		const parsed = new URL(raw);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
		return parsed.toString();
	} catch {
		return null;
	}
}
/** Resolve the platform command used to open an HTTP(S) URL in a browser. */
async function resolveBrowserOpenCommand(environment = {}) {
	const platform = environment.platform ?? process.platform;
	const env = environment.env ?? process.env;
	const hasDisplay = Boolean(env.DISPLAY || env.WAYLAND_DISPLAY);
	if ((Boolean(env.SSH_CLIENT) || Boolean(env.SSH_TTY) || Boolean(env.SSH_CONNECTION)) && !hasDisplay && platform !== "win32" && platform !== "darwin") return {
		argv: null,
		reason: "ssh-no-display"
	};
	if (platform === "win32") {
		const rundll32 = resolveWindowsRundll32Path();
		return {
			argv: [rundll32, "url.dll,FileProtocolHandler"],
			command: rundll32
		};
	}
	if (platform === "darwin") return await detectBinary("open") ? {
		argv: ["open"],
		command: "open"
	} : {
		argv: null,
		reason: "missing-open"
	};
	if (platform === "linux") {
		const wsl = await isWSL(environment);
		if (!hasDisplay && !wsl) return {
			argv: null,
			reason: "no-display"
		};
		if (wsl) {
			if (await detectBinary("wslview")) return {
				argv: ["wslview"],
				command: "wslview"
			};
			if (!hasDisplay) return {
				argv: null,
				reason: "wsl-no-wslview"
			};
		}
		return await detectBinary("xdg-open") ? {
			argv: ["xdg-open"],
			command: "xdg-open"
		} : {
			argv: null,
			reason: "missing-xdg-open"
		};
	}
	return {
		argv: null,
		reason: "unsupported-platform"
	};
}
/** Report whether browser opening is currently available. */
async function detectBrowserOpenSupport(environment = {}) {
	const resolved = await resolveBrowserOpenCommand(environment);
	if (!resolved.argv) return {
		ok: false,
		reason: resolved.reason
	};
	return {
		ok: true,
		command: resolved.command
	};
}
/** Open a safe HTTP(S) URL in the user's browser when the platform supports it. */
async function openUrl(url) {
	if (shouldSkipBrowserOpenInTests()) return false;
	const normalizedUrl = normalizeBrowserOpenUrl(url);
	if (!normalizedUrl) return false;
	const resolved = await resolveBrowserOpenCommand();
	if (!resolved.argv) return false;
	const command = [...resolved.argv];
	command.push(normalizedUrl);
	try {
		const result = await runCommandWithTimeout(command, { timeoutMs: 5e3 });
		return result.code === 0 && result.termination === "exit";
	} catch {
		return false;
	}
}
//#endregion
export { detectBinary as i, openUrl as n, resolveBrowserOpenCommand as r, detectBrowserOpenSupport as t };
