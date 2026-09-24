import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-DIHH_X2V.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-CDDGZTUQ.mjs";
import { t as sendMessage } from "./message-TTXIvmjX.mjs";
//#region src/tasks/task-registry-delivery-runtime.ts
async function prepareTaskControlUiSessionUrl(assertCurrent) {
	const { config } = await captureRuntimeConfigAsyncReader({
		assertCurrent,
		capture: true
	})();
	assertCurrent();
	return (params) => {
		assertCurrent();
		return resolveControlUiSessionUrl(config, {
			...params,
			exactKey: true
		});
	};
}
//#endregion
export { prepareTaskControlUiSessionUrl, sendMessage };
