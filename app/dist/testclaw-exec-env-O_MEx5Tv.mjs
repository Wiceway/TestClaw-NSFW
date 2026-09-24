//#region src/infra/testclaw-exec-env.ts
/** Process env key that marks child commands as launched by the Assistant CLI. */
const TESTCLAW_CLI_ENV_VAR = "TESTCLAW_CLI";
/** Child-shell routing hint; it does not authenticate or authorize a Gateway caller. */
const SUBAGENT_EXEC_ENV_VAR = "TESTCLAW_SUBAGENT_EXEC";
/** Stable marker value used for Assistant-launched subprocess detection. */
const CLI_ENV_VALUE = "1";
/** Returns a cloned env object with the Assistant CLI marker set. */
function markAssistantExecEnv(env) {
	return {
		...env,
		[TESTCLAW_CLI_ENV_VAR]: CLI_ENV_VALUE
	};
}
/** Mutates an existing process env object so current-process children inherit the marker. */
function ensureAssistantExecMarkerOnProcess(env = process.env) {
	env[TESTCLAW_CLI_ENV_VAR] = CLI_ENV_VALUE;
	return env;
}
//#endregion
export { markAssistantExecEnv as i, TESTCLAW_CLI_ENV_VAR as n, ensureAssistantExecMarkerOnProcess as r, SUBAGENT_EXEC_ENV_VAR as t };
