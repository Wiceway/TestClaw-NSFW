import { n as getSealedRuntimeSecureTempRoot } from "./sealed-runtime-registry-DDnWdfsn.js";
//#region src/infra/tmp-testclaw-dir.ts
/** Preferred shared Assistant temp root on POSIX systems when ownership and permissions are safe. */
const DEFAULT_POSIX_TMP_ROOT = "/tmp/testclaw";
let resolveSecureTempRootRuntime;
function loadResolveSecureTempRoot() {
	if (resolveSecureTempRootRuntime) return resolveSecureTempRootRuntime;
	const injected = getSealedRuntimeSecureTempRoot();
	if (injected) {
		resolveSecureTempRootRuntime = injected;
		return injected;
	}
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed temp-root runtime was not registered before use");
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") throw new Error("Node module loading is unavailable for secure temp-root resolution");
	const moduleNamespace = getBuiltinModule("module");
	if (typeof moduleNamespace.createRequire !== "function") throw new Error("Node createRequire is unavailable for secure temp-root resolution");
	resolveSecureTempRootRuntime = moduleNamespace.createRequire(import.meta.url)("@testclaw/fs-safe/temp").resolveSecureTempRoot;
	return resolveSecureTempRootRuntime;
}
/** Resolves a safe Assistant temp root, falling back to user-scoped os.tmpdir paths when needed. */
function resolvePreferredAssistantTmpDir(options = {}) {
	return loadResolveSecureTempRoot()({
		...options,
		preferredDir: options.preferredDir ?? "/tmp/testclaw",
		fallbackPrefix: "testclaw",
		warningPrefix: "[testclaw]",
		unsafeFallbackLabel: "Assistant temp dir",
		skipPreferredOnWindows: true
	});
}
//#endregion
export { resolvePreferredAssistantTmpDir as n, DEFAULT_POSIX_TMP_ROOT as t };
