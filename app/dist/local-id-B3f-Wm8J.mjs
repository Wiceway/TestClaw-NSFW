import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import { t as loadDeviceIdentityIfPresentAsync } from "./device-identity-async-BZ4WwgZv.mjs";
//#region src/node-host/local-id.ts
const localNodeIdByStateDir = /* @__PURE__ */ new Map();
async function resolveLocalNodeId(env = process.env) {
	const stateDir = resolveStateDir(env);
	const cached = localNodeIdByStateDir.get(stateDir);
	if (cached) return cached;
	const nodeId = (await loadDeviceIdentityIfPresentAsync({ env }))?.deviceId ?? null;
	if (nodeId) localNodeIdByStateDir.set(stateDir, nodeId);
	return nodeId;
}
//#endregion
export { resolveLocalNodeId as t };
