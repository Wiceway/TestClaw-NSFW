import path from "node:path";
//#region scripts/windows-cmd-helpers.mjs
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
function getEnvValueCaseInsensitive(env, expectedKey) {
	const direct = env[expectedKey];
	if (direct !== void 0) return direct;
	const expected = expectedKey.toUpperCase();
	const actualKey = Object.keys(env).find((key) => key.toUpperCase() === expected);
	return actualKey ? env[actualKey] : void 0;
}
function normalizeWindowsSystemRoot(raw) {
	const trimmed = raw?.trim();
	if (!trimmed || trimmed.includes("\0") || trimmed.includes("\r") || trimmed.includes("\n") || trimmed.includes(";")) return null;
	const normalized = path.win32.normalize(trimmed);
	if (!path.win32.isAbsolute(normalized) || normalized.startsWith("\\\\")) return null;
	const parsed = path.win32.parse(normalized);
	if (!/^[A-Za-z]:\\$/.test(parsed.root) || normalized.length <= parsed.root.length) return null;
	return normalized.replace(/[\\/]+$/, "");
}
function resolveWindowsSystemRoot(env = process.env) {
	return normalizeWindowsSystemRoot(getEnvValueCaseInsensitive(env, "SystemRoot")) ?? normalizeWindowsSystemRoot(getEnvValueCaseInsensitive(env, "WINDIR")) ?? DEFAULT_WINDOWS_SYSTEM_ROOT;
}
/** @internal Shared repository-script contract. */
function resolveWindowsPowerShellPath(env = process.env) {
	return path.win32.join(resolveWindowsSystemRoot(env), "System32", "WindowsPowerShell", "v1.0", "powershell.exe");
}
//#endregion
export { resolveWindowsPowerShellPath };
