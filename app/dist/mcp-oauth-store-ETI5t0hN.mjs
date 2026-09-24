import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-L2ePyI_M.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-arRyGxwp.mjs";
import { i as runAssistantStateWorkerOperation, t as executeAssistantStateWorker } from "./testclaw-state-worker-store-CirfybVZ.mjs";
import { n as runWithAssistantStateLeaseWorker } from "./testclaw-state-lease-worker-storage-CxuOrjNc.mjs";
import "./mcp-oauth-store.kernel-JS89WUfy.mjs";
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
export { deleteMcpOAuthPendingAuthorizationsByPrefix as a, readMcpOAuthPendingAuthorization as c, readMcpOAuthStoreStatuses as d, writeMcpOAuthPendingAuthorization as f, deleteMcpOAuthPendingAuthorization as i, readMcpOAuthStore as l, consumeOAuthState as n, listMcpOAuthStoreKeysByPrefix as o, projectMcpOAuthCredentialsStatus as p, countMcpOAuthStorePrincipals as r, mutateMcpOAuthStore as s, clearMcpOAuthStore as t, readMcpOAuthStoreReadOnly as u };
