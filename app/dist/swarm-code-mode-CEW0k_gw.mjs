//#region src/agents/subagents/swarm/swarm-code-mode.ts
/** Internal host-only metadata used to make Code Mode collector spawns replay-safe. */
const SWARM_CODE_MODE_IDEMPOTENCY_KEY = Symbol.for("testclaw.swarmCodeModeIdempotencyKey");
const SWARM_CODE_MODE_REQUEST_FINGERPRINT = Symbol.for("testclaw.swarmCodeModeRequestFingerprint");
//#endregion
export { SWARM_CODE_MODE_REQUEST_FINGERPRINT as n, SWARM_CODE_MODE_IDEMPOTENCY_KEY as t };
