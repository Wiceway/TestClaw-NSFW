import "./gateway-rpc-D4ZbEO3i.mjs";
import "./net-D6MXMoHn.mjs";
import "./auth-BiBrp8U7.mjs";
import "./call-Cm2P5Cd6.mjs";
import "./client-CU2-PwSe.mjs";
import "./node-command-policy-DonFHl1h.mjs";
import "./node-resolve-BEFGSlyx.mjs";
import "./operator-approvals-client-CbB8TDSv.mjs";
import "./hosted-plugin-surface-url-Q5ZwZyGj.mjs";
import "./plugin-node-capability-CGbSnr30.mjs";
import "./startup-auth-BRavxagO.mjs";
import "./channel-status-patches-Cbjsu8NA.mjs";
//#region src/plugin-sdk/gateway-runtime.ts
async function resolveAdvertisedLanHost() {
	return await (await import("./advertised-lan-host-Dm1YO9cj.mjs")).resolveAdvertisedLanHostCore();
}
//#endregion
export { resolveAdvertisedLanHost as t };
