import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import "./paths-DvpAEtA8.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { i as publishSecretEgressProxy, t as clearSecretEgressProxy } from "./registry-DRgKcQfG.mjs";
import { t as startSecretEgressProxyServer } from "./proxy-server-DnuG9Xw4.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/secrets/egress-proxy/runtime.ts
const log = createSubsystemLogger("secrets/egress-proxy");
const SECRET_EGRESS_PROXY_DIR_MODE = 448;
function removeProxyDirBestEffort(proxyDir) {
	try {
		fs.rmSync(proxyDir, {
			recursive: true,
			force: true
		});
		fs.rmdirSync(path.dirname(proxyDir));
	} catch {}
}
function removeStaleProxyDirs(parentDir) {
	for (const entry of fs.readdirSync(parentDir, { withFileTypes: true })) if (entry.isDirectory() && entry.name.startsWith("gateway-")) fs.rmSync(path.join(parentDir, entry.name), {
		recursive: true,
		force: true
	});
}
/** Starts the process-local proxy and registers it as the current Gateway owner. */
async function startGatewaySecretEgressProxy(params) {
	const parentDir = path.join(resolveStateDir(), "secret-egress-proxy");
	fs.mkdirSync(parentDir, {
		recursive: true,
		mode: SECRET_EGRESS_PROXY_DIR_MODE
	});
	fs.chmodSync(parentDir, SECRET_EGRESS_PROXY_DIR_MODE);
	removeStaleProxyDirs(parentDir);
	const proxyDir = fs.mkdtempSync(path.join(parentDir, "gateway-"));
	fs.chmodSync(proxyDir, SECRET_EGRESS_PROXY_DIR_MODE);
	let proxy;
	try {
		proxy = await startSecretEgressProxyServer({
			caDir: proxyDir,
			...params.allowedHosts !== void 0 ? { allowedHosts: params.allowedHosts } : {},
			...params.bypassHosts ? { bypassHosts: params.bypassHosts } : {},
			onAudit: (event) => {
				if (event.reason === "certificate-error") log.warn("secret egress TLS certificate unavailable; check OpenSSL and the system clock, then retry", event);
				else log.info("secret egress request", event);
			}
		});
		const ownedProxy = proxy;
		const cleanupOnProcessExit = () => removeProxyDirBestEffort(proxyDir);
		process.once("exit", cleanupOnProcessExit);
		const handle = {
			...ownedProxy,
			stop: async () => {
				clearSecretEgressProxy(handle);
				process.off("exit", cleanupOnProcessExit);
				try {
					await ownedProxy.stop();
				} finally {
					removeProxyDirBestEffort(proxyDir);
				}
			}
		};
		publishSecretEgressProxy(handle);
		return handle;
	} catch (error) {
		await proxy?.stop().catch(() => void 0);
		removeProxyDirBestEffort(proxyDir);
		throw error;
	}
}
//#endregion
export { startGatewaySecretEgressProxy };
