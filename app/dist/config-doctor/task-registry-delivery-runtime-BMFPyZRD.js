import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-C0vFx1Ic.js";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-DzGGlGmD.js";
import { t as sendMessage } from "./message-CLcEoDTf.js";
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
