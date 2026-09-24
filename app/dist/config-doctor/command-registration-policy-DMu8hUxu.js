import { n as isTruthyEnvValue } from "./env-BrSJw7bv.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-cnh1Va4H.js";
//#region src/cli/command-registration-policy.ts
const RESERVED_NON_PLUGIN_COMMAND_ROOTS = /* @__PURE__ */ new Set([
	"auth",
	"tool",
	"tools"
]);
function isReservedNonPluginCommandRoot(primary) {
	return typeof primary === "string" && RESERVED_NON_PLUGIN_COMMAND_ROOTS.has(primary);
}
function shouldSkipPluginCommandRegistration(params) {
	const invocation = resolveCliArgvInvocation(params.argv);
	if (params.primary === "help") return invocation.hasHelpOrVersion && invocation.commandPath.length <= 1;
	if (invocation.hasHelpOrVersion) return !params.primary || params.hasBuiltinPrimary || isReservedNonPluginCommandRoot(params.primary);
	if (params.hasBuiltinPrimary) return true;
	if (!params.primary) return invocation.hasHelpOrVersion;
	if (isReservedNonPluginCommandRoot(params.primary)) return true;
	return false;
}
function shouldEagerRegisterSubcommands(env = process.env) {
	return isTruthyEnvValue(env.TESTCLAW_DISABLE_LAZY_SUBCOMMANDS);
}
//#endregion
export { shouldEagerRegisterSubcommands as n, shouldSkipPluginCommandRegistration as r, isReservedNonPluginCommandRoot as t };
