import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { r as getAsyncWorkSignal } from "./async-work-scope-Botgjsbr.js";
import { a as escapeInternalRuntimeContextDelimiters } from "./internal-runtime-context-Bn0Ci0G3.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-R-LTr41E.js";
import { Type } from "typebox";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-bundle-mcp-request-context.ts
const requestSignals = resolveGlobalSingleton(Symbol.for("testclaw.sessionMcpRequestSignal"), () => new AsyncLocalStorage());
function getSessionMcpRequestSignal() {
	const caller = requestSignals.getStore();
	const owner = getAsyncWorkSignal();
	return caller && owner ? AbortSignal.any([caller, owner]) : caller ?? owner;
}
function runWithSessionMcpRequestSignal(signal, run) {
	return signal ? requestSignals.run(signal, run) : run();
}
//#endregion
//#region src/agents/agent-bundle-mcp-requester-connect.ts
async function connectRequesterOAuthServer(params) {
	if (!params.publicOrigin) {
		const message = `MCP server "${params.serverName}" needs requester sign-in, but gateway.publicOrigin is not configured. Ask the operator to set the public Gateway HTTP(S) origin.`;
		return {
			content: [{
				type: "text",
				text: message
			}],
			details: {
				status: "error",
				error: message,
				mcpServer: params.serverName
			}
		};
	}
	const result = await params.authorize(new URL("/oauth/mcp/callback", params.publicOrigin).href);
	if (result.status === "authorized") return {
		content: [{
			type: "text",
			text: `MCP server "${params.serverName}" is connected. Its tools become available on the next message.`
		}],
		details: { mcpServer: params.serverName }
	};
	return {
		content: [{
			type: "text",
			text: `Connect MCP server "${params.serverName}" at ${result.authorizationUrl}\nAfter sign-in completes, the server's tools become available on the next message.`
		}],
		details: { mcpConnect: {
			serverName: params.serverName,
			authorizationUrl: result.authorizationUrl
		} }
	};
}
function buildRequesterConnectCatalog(serverNames, safeServerNamesByServer) {
	const entries = [...serverNames];
	return {
		version: 1,
		generatedAt: Date.now(),
		servers: Object.fromEntries(entries.map((serverName) => [serverName, {
			serverName,
			safeServerName: safeServerNamesByServer.get(serverName),
			launchSummary: "Requester OAuth",
			toolCount: 1
		}])),
		tools: entries.map((serverName) => ({
			serverName,
			safeServerName: safeServerNamesByServer.get(serverName) ?? serverName,
			toolName: "connect",
			description: `Connect your ${serverName} account.`,
			fallbackDescription: `Connect your ${serverName} account.`,
			inputSchema: Type.Object({}),
			oauthConnectBootstrap: true
		}))
	};
}
/** Builds the per-message requester sign-in surface without opening MCP transports. */
async function createRequesterMcpConnect(params) {
	const configured = [...params.serverNames].toSorted((a, b) => a.localeCompare(b)).flatMap((serverName) => {
		const resolved = resolveMcpTransportConfig(serverName, params.mcpServers[serverName], { logWarnings: false });
		return resolved?.kind === "http" && resolved.auth === "oauth" && resolved.oauth?.identity === "per-requester" ? [{
			serverName,
			resolved
		}] : [];
	});
	if (configured.length === 0) return;
	const { requesterMcpOAuthIdentity } = await import("./mcp-oauth-identity-lDU73Jpy.js");
	const { readMcpOAuthCredentialsStatuses, startMcpOAuthAuthorization } = await import("./mcp-oauth-RlQQ35x4.js");
	const statuses = await readMcpOAuthCredentialsStatuses(configured.map(({ serverName, resolved }) => requesterMcpOAuthIdentity(serverName, resolved.url, params.requesterScope)));
	const servers = /* @__PURE__ */ new Map();
	const authorizedServerNames = [];
	for (const [index, { serverName, resolved }] of configured.entries()) {
		const status = expectDefined(statuses[index], "requester MCP OAuth status");
		servers.set(serverName, () => connectRequesterOAuthServer({
			serverName,
			publicOrigin: params.cfg?.gateway?.publicOrigin,
			authorize: (redirectUrl) => startMcpOAuthAuthorization(requesterMcpOAuthIdentity(serverName, resolved.url, params.requesterScope), resolved, { redirectUrl })
		}));
		if (status.state === "authorized") authorizedServerNames.push(serverName);
	}
	const configFingerprint = JSON.stringify({
		config: params.configFingerprint,
		authorizedServerNames,
		publicOrigin: params.cfg?.gateway?.publicOrigin
	});
	return {
		catalog: buildRequesterConnectCatalog(servers.keys(), params.safeServerNamesByServer),
		authorizedServerNames,
		configFingerprint,
		createExecute: (serverName) => servers.get(serverName)
	};
}
/** Adds transient connect entries only for servers absent from the live catalog. */
function mergeMcpConnectCatalog(liveCatalog, requesterConnect) {
	const connectCatalog = requesterConnect?.catalog;
	if (!connectCatalog) return liveCatalog;
	const missingServerNames = new Set(Object.keys(connectCatalog.servers).filter((serverName) => !Object.hasOwn(liveCatalog.servers, serverName)));
	if (missingServerNames.size === 0) return liveCatalog;
	return {
		...liveCatalog,
		generatedAt: Math.max(liveCatalog.generatedAt, connectCatalog.generatedAt),
		servers: {
			...liveCatalog.servers,
			...Object.fromEntries(Object.entries(connectCatalog.servers).filter(([serverName]) => missingServerNames.has(serverName)))
		},
		tools: [...liveCatalog.tools, ...connectCatalog.tools.filter((tool) => missingServerNames.has(tool.serverName))].toSorted((left, right) => left.safeServerName.localeCompare(right.safeServerName) || left.toolName.localeCompare(right.toolName) || left.serverName.localeCompare(right.serverName))
	};
}
//#endregion
//#region src/agents/mcp-app-model-context.ts
const MCP_APP_MODEL_CONTEXT_MAX_BYTES = 16384;
function revokeMcpAppModelContext(runtime) {
	runtime.pendingMcpAppModelContext = void 0;
	runtime.mcpAppModelContextRevoked = true;
}
function allowMcpAppModelContext(runtime) {
	runtime.mcpAppModelContextRevoked = void 0;
}
function clearMcpAppModelContextForView(runtime, view) {
	if (runtime.pendingMcpAppModelContext?.owner === view) runtime.pendingMcpAppModelContext = void 0;
}
function updateMcpAppModelContext(runtime, view, params) {
	if (runtime.mcpAppModelContextRevoked === true) throw new Error("MCP App model context is unavailable for this session");
	if (Object.hasOwn(params, "structuredContent")) throw new Error("MCP App structured model context is unsupported");
	if (params.content === void 0 || Array.isArray(params.content) && params.content.length === 0) {
		runtime.pendingMcpAppModelContext = void 0;
		return;
	}
	if (!Array.isArray(params.content) || params.content.length !== 1) throw new Error("MCP App model context must contain exactly one text block");
	const block = params.content[0];
	if (!block || typeof block !== "object" || Array.isArray(block)) throw new Error("MCP App model context must contain exactly one text block");
	const { type, text } = block;
	if (type !== "text" || typeof text !== "string") throw new Error("MCP App model context must contain exactly one text block");
	if (text.length === 0) {
		runtime.pendingMcpAppModelContext = void 0;
		return;
	}
	if (Buffer.byteLength(text, "utf8") > MCP_APP_MODEL_CONTEXT_MAX_BYTES) throw new Error(`MCP App model context exceeds ${MCP_APP_MODEL_CONTEXT_MAX_BYTES} bytes`);
	runtime.pendingMcpAppModelContext = {
		owner: view,
		text
	};
}
function leaseMcpAppModelContextForTurn(params) {
	const snapshot = params.runtime.pendingMcpAppModelContext;
	if (!snapshot || snapshot.leased === true || params.runtime.mcpAppModelContextRevoked === true) return;
	snapshot.leased = true;
	const text = `MCP App context snapshot:\n${JSON.stringify({ text: snapshot.text })}`;
	let committed = false;
	return {
		context: {
			kind: "conversation-data",
			text
		},
		legacyText: escapeInternalRuntimeContextDelimiters(text),
		commit: () => {
			committed = true;
			if (params.runtime.pendingMcpAppModelContext === snapshot) params.runtime.pendingMcpAppModelContext = void 0;
		},
		rollback: () => {
			if (!committed && params.runtime.pendingMcpAppModelContext === snapshot) snapshot.leased = void 0;
		}
	};
}
//#endregion
export { updateMcpAppModelContext as a, getSessionMcpRequestSignal as c, revokeMcpAppModelContext as i, runWithSessionMcpRequestSignal as l, clearMcpAppModelContextForView as n, createRequesterMcpConnect as o, leaseMcpAppModelContextForTurn as r, mergeMcpConnectCatalog as s, allowMcpAppModelContext as t };
