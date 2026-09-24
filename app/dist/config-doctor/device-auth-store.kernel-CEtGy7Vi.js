import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.js";
//#region src/infra/device-auth-store.kernel.ts
function createDeviceAuthEntry(params) {
	return {
		token: params.token,
		role: normalizeDeviceAuthRole(params.role),
		scopes: normalizeDeviceAuthScopes(params.scopes),
		updatedAtMs: params.updatedAtMs ?? Date.now()
	};
}
function clearDeviceAuthTokenFromDatabase(db, params) {
	const baseQuery = getNodeSqliteKysely(db).deleteFrom("device_auth_tokens").where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role));
	const query = params.expectedToken === void 0 ? baseQuery : params.observedToken !== void 0 && params.observedToken.trim() === params.expectedToken ? baseQuery.where("token", "in", [params.expectedToken, params.observedToken]) : baseQuery.where("token", "=", params.expectedToken);
	return executeSqliteQuerySync(db, query).numAffectedRows === 1n;
}
//#endregion
export { createDeviceAuthEntry as n, clearDeviceAuthTokenFromDatabase as t };
