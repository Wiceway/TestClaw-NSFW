import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./kysely-sync-CICmT-bh.js";
import "./sqlite-live-snapshot-C0XwFcJs.js";
import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { s as McpOAuthStoreCorruptionError } from "./testclaw-state-worker-error-DudqzgpE.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Cg9RiSzs.js";
import { i as runAssistantStateWorkerOperation, t as executeAssistantStateWorker } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { n as runWithAssistantStateLeaseWorker } from "./testclaw-state-lease-worker-storage-BvfUhAAJ.js";
import "node:util";
import { OAuthClientInformationSchema, OAuthMetadataSchema, OAuthProtectedResourceMetadataSchema, OAuthTokensSchema, OpenIdProviderDiscoveryMetadataSchema } from "@modelcontextprotocol/sdk/shared/auth.js";
//#region src/agents/mcp-oauth-status.ts
function projectMcpOAuthCredentialsStatus(store) {
	if (store.pendingAuthorizationChallenge?.requiresAuthorization === true) return { state: "requires-authorization" };
	if (store.tokens) return {
		state: "authorized",
		...store.tokenExpiresAt === void 0 ? {} : { expiresAt: store.tokenExpiresAt }
	};
	if (store.clientInformation || store.codeVerifier || store.discoveryState || store.lastAuthorizationUrl || store.redirectUrl || store.pendingAuthorizationChallenge) return { state: "pending-authorization" };
	return { state: "unauthenticated" };
}
//#endregion
//#region src/agents/mcp-oauth-store.kernel.ts
const UNINITIALIZED_STORE_FIELDS = /* @__PURE__ */ new Set(["credentialState", "pendingAuthorizationChallenge"]);
function assertOptionalString(storeKey, store, field) {
	const value = store[field];
	if (value !== void 0 && (typeof value !== "string" || value.length === 0)) throw new McpOAuthStoreCorruptionError(storeKey, `${field} must be a non-empty string`);
}
function assertDiscoveryState(storeKey, value) {
	if (value === void 0) return;
	if (!isRecord(value) || typeof value.authorizationServerUrl !== "string") throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState is invalid");
	if (!URL.canParse(value.authorizationServerUrl)) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState URLs are invalid");
	if (value.resourceMetadataUrl !== void 0 && (typeof value.resourceMetadataUrl !== "string" || !URL.canParse(value.resourceMetadataUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState URLs are invalid");
	if (value.resourceMetadata !== void 0 && !OAuthProtectedResourceMetadataSchema.safeParse(value.resourceMetadata).success) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState resource metadata is invalid");
	if (value.authorizationServerMetadata !== void 0 && !OAuthMetadataSchema.safeParse(value.authorizationServerMetadata).success && !OpenIdProviderDiscoveryMetadataSchema.safeParse(value.authorizationServerMetadata).success) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState authorization server metadata is invalid");
}
function assertAuthorizationChallenge(storeKey, value) {
	if (value === void 0) return;
	if (!isRecord(value)) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge is invalid");
	const resourceMetadataUrl = value.resourceMetadataUrl;
	if (resourceMetadataUrl !== void 0 && (typeof resourceMetadataUrl !== "string" || !URL.canParse(resourceMetadataUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge URL is invalid");
	const scope = value.scope;
	if (scope !== void 0 && (typeof scope !== "string" || scope.length === 0)) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge scope is invalid");
	if (value.requiresAuthorization !== void 0 && value.requiresAuthorization !== true) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge requiresAuthorization must be true");
}
/** Parse a canonical row without discarding SDK extension fields. */
function parseMcpOAuthStoreJson(storeKey, raw) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch (error) {
		throw new McpOAuthStoreCorruptionError(storeKey, "store_json is not valid JSON", { cause: error });
	}
	if (!isRecord(value)) throw new McpOAuthStoreCorruptionError(storeKey, "store_json must contain an object");
	if (value.clientInformation !== void 0 && !OAuthClientInformationSchema.safeParse(value.clientInformation).success) throw new McpOAuthStoreCorruptionError(storeKey, "clientInformation is invalid");
	if (value.tokens !== void 0 && !OAuthTokensSchema.safeParse(value.tokens).success) throw new McpOAuthStoreCorruptionError(storeKey, "tokens are invalid");
	if (value.credentialState !== void 0 && value.credentialState !== "uninitialized" && value.credentialState !== "cleared") throw new McpOAuthStoreCorruptionError(storeKey, "credentialState is invalid");
	if (value.credentialState !== void 0 && value.tokens !== void 0) throw new McpOAuthStoreCorruptionError(storeKey, "credentialState cannot coexist with tokens");
	if (value.credentialState === "uninitialized" && Object.keys(value).some((field) => !UNINITIALIZED_STORE_FIELDS.has(field))) throw new McpOAuthStoreCorruptionError(storeKey, "uninitialized credential state contains authoritative OAuth fields");
	if (value.tokenExpiresAt !== void 0 && (typeof value.tokenExpiresAt !== "number" || !Number.isFinite(value.tokenExpiresAt) || value.tokenExpiresAt < 0)) throw new McpOAuthStoreCorruptionError(storeKey, "tokenExpiresAt is invalid");
	if (value.tokenExpiresAt !== void 0 && value.tokens === void 0) throw new McpOAuthStoreCorruptionError(storeKey, "tokenExpiresAt requires tokens");
	if (value.tokensAuthorizationServerUrl !== void 0 && (typeof value.tokensAuthorizationServerUrl !== "string" || !URL.canParse(value.tokensAuthorizationServerUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "tokensAuthorizationServerUrl is invalid");
	if (value.tokensAuthorizationServerUrl !== void 0 && value.tokens === void 0) throw new McpOAuthStoreCorruptionError(storeKey, "tokensAuthorizationServerUrl requires tokens");
	assertOptionalString(storeKey, value, "codeVerifier");
	assertOptionalString(storeKey, value, "lastAuthorizationUrl");
	assertOptionalString(storeKey, value, "redirectUrl");
	assertDiscoveryState(storeKey, value.discoveryState);
	assertAuthorizationChallenge(storeKey, value.pendingAuthorizationChallenge);
	return value;
}
//#endregion
//#region src/agents/mcp-oauth-store.ts
/** Read canonical state, opening the writable lifecycle when runtime owns it. */
async function readMcpOAuthStore(storeKey, context = captureAssistantStateWorkerContext()) {
	return executeAssistantStateWorker(context, {
		type: "mcpOAuth.read",
		input: storeKey
	});
}
/** Read status state without creating or repairing the shared database. */
async function readMcpOAuthStoreReadOnly(storeKey, context = captureAssistantStateWorkerContext()) {
	const result = await executeExistingAssistantStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.readOnly",
		input: storeKey
	}, { context });
	if (result === void 0) return {};
	if (result.ok && result.type === "mcpOAuth.readOnly") return result.value;
	throw new Error("Unexpected MCP OAuth store read result");
}
async function readMcpOAuthStoreStatuses(storeKeys, context = captureAssistantStateWorkerContext()) {
	if (storeKeys.length === 0) return [];
	const result = await executeExistingAssistantStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.statuses",
		input: storeKeys
	}, { context });
	if (result === void 0) return storeKeys.map(() => projectMcpOAuthCredentialsStatus({}));
	if (result.ok && result.type === "mcpOAuth.statuses") return result.value;
	throw new Error("Unexpected MCP OAuth status batch result");
}
/** List canonical store keys matching one server/principal prefix without creating state. */
async function listMcpOAuthStoreKeysByPrefix(prefix, context = captureAssistantStateWorkerContext()) {
	const result = await executeExistingAssistantStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.keys",
		input: prefix
	}, { context });
	if (result === void 0) return [];
	if (result.ok && result.type === "mcpOAuth.keys") return result.value;
	throw new Error("Unexpected MCP OAuth keys read result");
}
async function countMcpOAuthStorePrincipals(prefix) {
	const context = captureAssistantStateWorkerContext();
	const result = await executeExistingAssistantStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.countPrincipals",
		input: prefix
	}, { context });
	if (result === void 0) return 0;
	if (result.ok && result.type === "mcpOAuth.countPrincipals") return result.value;
	throw new Error("Unexpected MCP OAuth principal count result");
}
/** Resolve one unexpired callback state without creating state or scanning credential JSON. */
async function readMcpOAuthPendingAuthorization(state, context = captureAssistantStateWorkerContext()) {
	const result = await executeExistingAssistantStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "mcpOAuth.pending",
		input: state
	}, { context });
	if (result === void 0) return;
	if (result.ok && result.type === "mcpOAuth.pending") return result.value;
	throw new Error("Unexpected MCP OAuth pending state read result");
}
/** Apply a bounded mutation under its original live store lease. */
function mutateMcpOAuthStore({ storeKey, lease, context }, mutation, authority) {
	const captured = structuredClone(mutation);
	return runWithAssistantStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.mutate",
		input: {
			storeKey,
			identity,
			mutation: captured
		}
	}, { signal: lease.signal }), authority);
}
/** Claim one exact unexpired callback state while its store lease is still owned. */
function consumeOAuthState({ storeKey, lease, context }, state, authority) {
	return runWithAssistantStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.consumePending",
		input: {
			storeKey,
			identity,
			state
		}
	}, { signal: lease.signal }), authority);
}
/** Replace one store's callback state after OAuth persisted its session. */
function writeMcpOAuthPendingAuthorization({ storeKey, lease, context }, state, authority) {
	return runWithAssistantStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.writePending",
		input: {
			storeKey,
			identity,
			state
		}
	}, { signal: lease.signal }), authority);
}
/** Delete callback correlation for one settled or cleared OAuth store. */
function deleteMcpOAuthPendingAuthorization({ storeKey, lease, context }, authority) {
	return runWithAssistantStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.deletePending",
		input: {
			storeKey,
			identity
		}
	}, { signal: lease.signal }), authority);
}
/** Clear one OAuth session while retaining explicit logout provenance. */
function clearMcpOAuthStore({ storeKey, lease, context }) {
	return runWithAssistantStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "mcpOAuth.clear",
		input: {
			storeKey,
			identity
		}
	}, { signal: lease.signal }));
}
/** Remove orphan callback rows for a removed server's requester prefix. */
function deleteMcpOAuthPendingAuthorizationsByPrefix(prefix, context = captureAssistantStateWorkerContext()) {
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "mcpOAuth.clearPendingPrefix",
		input: prefix
	}), {
		assertCurrent: context.admission.assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(context.admission.assertCurrent, [context.admission.databasePath])
	});
}
//#endregion
export { deleteMcpOAuthPendingAuthorizationsByPrefix as a, readMcpOAuthPendingAuthorization as c, readMcpOAuthStoreStatuses as d, writeMcpOAuthPendingAuthorization as f, deleteMcpOAuthPendingAuthorization as i, readMcpOAuthStore as l, projectMcpOAuthCredentialsStatus as m, consumeOAuthState as n, listMcpOAuthStoreKeysByPrefix as o, parseMcpOAuthStoreJson as p, countMcpOAuthStorePrincipals as r, mutateMcpOAuthStore as s, clearMcpOAuthStore as t, readMcpOAuthStoreReadOnly as u };
