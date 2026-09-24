import { a as runWithPluginExecutionFrame } from "./plugin-instance-invocation-Cy1hZ4_T.js";
import { n as createPluginMetadataSnapshotFrame, s as runOutsidePluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-VdnPfhqM.js";
import { a as runOutsidePluginRuntimeRegistryScope, d as getPluginRuntimeExecutionFrame, t as createRegistryScope, u as PluginRuntimeExecutionFrame } from "./gateway-request-scope-B7K42D1p.js";
import { t as createEmptyPluginRegistry } from "./registry-empty--vb91VWS.js";
import { n as runOutsidePluginRuntimeGenerationRegistryScope } from "./generation-state-uisWS5zI.js";
//#region src/plugins/runtime/generation-scope.ts
/** Carries one prepared plugin generation through all nested runtime lookups. */
function withPluginRuntimeGenerationScope(generation, run) {
	const pluginRegistry = generation.pluginRegistry ?? createEmptyPluginRegistry();
	const frame = createPluginMetadataSnapshotFrame(generation.metadataSnapshot, { trustConfigIdentity: true });
	return runWithPluginExecutionFrame(new PluginRuntimeExecutionFrame(frame, createRegistryScope(pluginRegistry, getPluginRuntimeExecutionFrame(frame)?.gatewayScope, generation.metadataSnapshot.declaredProviderOwners), pluginRegistry), run);
}
/** Re-admission drops the old generation while retaining the exact Gateway caller. */
function runOutsidePluginRuntimeGenerationScope(run) {
	return runOutsidePluginRuntimeGenerationRegistryScope(() => runOutsidePluginMetadataSnapshotScope(() => runOutsidePluginRuntimeRegistryScope(run)));
}
//#endregion
export { withPluginRuntimeGenerationScope as n, runOutsidePluginRuntimeGenerationScope as t };
