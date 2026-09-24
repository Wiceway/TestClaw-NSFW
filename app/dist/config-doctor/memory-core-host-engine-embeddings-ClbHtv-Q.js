import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as parseBoolean } from "./boolean-coercion-1HZNNkFl.js";
import "./src-D9uQ497Z.js";
import "./utils-BfoJTy8l.js";
import "./error-utils-B4pDpAz2.js";
import "./runtime-snapshots-LZfHFeGe.js";
import "./gateway-startup-plugin-config-Dj7x4BMH.js";
import "./memory-state-CDjonGW3.js";
import "./internal-BY7j8CSZ.js";
import "./multimodal-BWJanLvN.js";
import "./memory-embedding-provider-runtime-N9IdwZ9L.js";
import "./config-schema-DyP-lVIl.js";
import "./secret-input-DdVwDmg4.js";
new TextEncoder();
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-remote-client.ts
function normalizeEmbeddingDestinationKey(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		const hostname = parsed.hostname.toLowerCase();
		const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
		const pathname = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
		return `${parsed.protocol}//${hostname}:${port}${pathname}${parsed.search}`;
	} catch {
		return;
	}
}
/** Whether provider-owned embedding credentials belong to the selected destination. */
function embeddingProviderOwnsDestination(params) {
	const baseUrlKey = normalizeEmbeddingDestinationKey(params.baseUrl);
	const providerBaseUrlKey = normalizeEmbeddingDestinationKey(params.providerBaseUrl);
	return baseUrlKey !== void 0 && baseUrlKey === providerBaseUrlKey;
}
/** Append an embedding endpoint without changing its destination-owned query. */
function resolveEmbeddingEndpointUrl(baseUrl, endpoint) {
	const url = new URL(baseUrl);
	url.pathname = `${url.pathname.replace(/\/+$/u, "")}/${endpoint.replace(/^\/+/, "")}`;
	url.hash = "";
	return url.toString();
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-debug.ts
const normalizedDebugEmbeddings = normalizeLowercaseStringOrEmpty(process.env.TESTCLAW_DEBUG_MEMORY_EMBEDDINGS);
parseBoolean(normalizedDebugEmbeddings) ?? [
	"1",
	"on",
	"yes"
].includes(normalizedDebugEmbeddings);
//#endregion
export { embeddingProviderOwnsDestination, resolveEmbeddingEndpointUrl };
