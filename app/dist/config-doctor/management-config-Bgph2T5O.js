import { o as asRecord } from "./record-coerce-DItp3I4t.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-Cw44ic16.js";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.js";
import { c as readConfigFileSnapshot, u as readConfigFileSnapshotForWrite } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { n as resolveInstallConfigMutationPreflights, r as selectInstallMutationWriteOptions } from "./install-config-mutation-Dku3vFY4.js";
//#region src/plugins/management-config.ts
function readValidSourceConfig(snapshot) {
	if (!snapshot.valid) throw new ManagedPluginLifecycleError("Config invalid; run `testclaw doctor --fix` before managing plugins.");
	return snapshot.sourceConfig;
}
async function readPluginRuntimeConfig() {
	return readValidSourceConfig(await readConfigFileSnapshot({
		observe: false,
		isolateEnv: true
	}));
}
async function readPluginMutationSnapshot(env, beforePersistentApply) {
	try {
		assertConfigWriteAllowedInCurrentMode({ env });
	} catch (error) {
		throw new ManagedPluginLifecycleError(formatErrorMessage(error), { cause: error });
	}
	const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
	const config = readValidSourceConfig(snapshot);
	const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions, beforePersistentApply);
	const { pluginMutation } = resolveInstallConfigMutationPreflights({
		parsed: asRecord(snapshot.parsed),
		snapshotPath: snapshot.path,
		writeOptions: mutationWriteOptions
	});
	if (pluginMutation.mode === "blocked") throw new ManagedPluginLifecycleError(pluginMutation.reason);
	return {
		config,
		baseHash: snapshot.hash,
		writeOptions: mutationWriteOptions
	};
}
//#endregion
export { readPluginRuntimeConfig as n, readPluginMutationSnapshot as t };
