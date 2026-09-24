import { r as createLazyRuntimeModule } from "../lazy-runtime-BPNHa36e.mjs";
//#region src/plugin-sdk/secret-egress-runtime.ts
const loadModelEgressRuntime = createLazyRuntimeModule(() => import("../model-egress-Ca3xB3Kd.mjs"));
/** Private official-plugin runtime for a standalone job's protected model credential. */
async function withConfiguredModelEgress(options, run) {
	return (await loadModelEgressRuntime()).withConfiguredModelEgress(options, run);
}
//#endregion
export { withConfiguredModelEgress };
