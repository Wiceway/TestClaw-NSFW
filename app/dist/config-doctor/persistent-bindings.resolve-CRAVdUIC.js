import { r as resolveConfiguredBindingRecordBySessionKey, s as resolveConfiguredAcpBindingSpecFromRecord } from "./configured-binding-registry-N3rneCJz.js";
//#region src/acp/persistent-bindings.resolve.ts
/** Resolves configured channel conversation bindings into ACP session binding specs. */
/** Resolves the configured ACP binding spec that owns a generated session key. */
function resolveConfiguredAcpBindingSpecBySessionKey(params) {
	const resolved = resolveConfiguredBindingRecordBySessionKey(params);
	return resolved ? resolveConfiguredAcpBindingSpecFromRecord(resolved.record) : null;
}
//#endregion
export { resolveConfiguredAcpBindingSpecBySessionKey as t };
