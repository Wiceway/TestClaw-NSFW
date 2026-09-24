import { r as isArtifactPreservingStateRead } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { n as readConfigMachineState } from "./config-machine-state-Qs1zxcYs.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-B5HfY1po.mjs";
//#region src/model-catalog/remote-store.ts
const REMOTE_MODEL_CATALOG_STATE_KEY = "modelCatalog.remote";
function readRemoteModelCatalog(options = {}) {
	const snapshot = readConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, options);
	return snapshot ? {
		id: 1,
		...snapshot
	} : void 0;
}
/** Read the startup catalog through the existing shared-state inspection owner. */
async function readRemoteModelCatalogAsync(context) {
	const artifactPreservingReadOnly = isArtifactPreservingStateRead();
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-Cbw9_4QI.mjs");
	context.admission.assertCurrent();
	return runAssistantStateWorkerOperation(context, async (scope) => {
		const row = await scope.execute({
			type: "modelCatalog.remote.read",
			input: { artifactPreservingReadOnly }
		});
		context.admission.assertCurrent();
		return row;
	}, { existingOnly: true });
}
function writeRemoteModelCatalog(row, options = {}) {
	let result = { status: "written" };
	updateConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, (current) => {
		if (current && current.source_url === row.source_url && (current.generated_at > row.generated_at || current.generated_at === row.generated_at && current.bundle_json !== row.bundle_json)) {
			result = {
				status: "retained-newer",
				row: {
					id: 1,
					...current
				}
			};
			return current;
		}
		return row;
	}, options);
	return result;
}
function markRemoteModelCatalogChecked(checkedAt, metadata, options = {}) {
	let matched = false;
	updateConfigMachineState(REMOTE_MODEL_CATALOG_STATE_KEY, (current) => {
		if (!current) return;
		if (current.source_url !== metadata.expected.source_url || current.generated_at !== metadata.expected.generated_at || current.etag !== metadata.expected.etag || current.last_modified !== metadata.expected.last_modified) return current;
		matched = true;
		return {
			...current,
			checked_at: checkedAt,
			...metadata.etag !== void 0 ? { etag: metadata.etag } : {},
			...metadata.lastModified !== void 0 ? { last_modified: metadata.lastModified } : {}
		};
	}, options);
	return matched;
}
//#endregion
export { writeRemoteModelCatalog as i, readRemoteModelCatalog as n, readRemoteModelCatalogAsync as r, markRemoteModelCatalogChecked as t };
