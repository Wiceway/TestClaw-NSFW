import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { W as ensureColumn } from "./sqlite-live-snapshot-C0XwFcJs.js";
import "./config-machine-state-BiDCuNUZ.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import "./config-machine-state-write-BsrY8iFO.js";
import { t as createAssistantStateSchemaEnsurer } from "./testclaw-state-feature-schema-Du6iKbeX.js";
import { f as selectResolvedUserProfileMetadataById, x as ensureUserProfilesSchema } from "./user-profiles-internal-CUEKVOsi.js";
import { t as getSqliteWorkerStateContext } from "./sqlite-worker-state-context-CUqRhO7l.js";
import { a as hashWebPushEndpoint, l as webPushSubscriptionToRow, p as normalizeWebPushDevicePreferences, r as WebPushSubscriptionBindingError } from "./push-web-store.records-utoVeGqn.js";
//#region src/infra/push-web-store.kernel.ts
const ensuredWebPushBindingDatabases = /* @__PURE__ */ new WeakSet();
createAssistantStateSchemaEnsurer({
	table: "web_push_approval_deliveries",
	endMarker: "  ON web_push_approval_deliveries(subscription_id, approval_id);\n",
	operationLabel: "web-push.approval-delivery.schema.ensure"
});
function webPushDatabaseOptions(database) {
	return {
		database,
		path: database.path,
		env: getSqliteWorkerStateContext().environment
	};
}
/** Adds downgrade-safe binding columns before the first Web Push store operation. */
function ensureWebPushSubscriptionBindingColumns(db) {
	ensureColumn(db, "web_push_subscriptions", "device_id TEXT");
	ensureColumn(db, "web_push_subscriptions", "user_profile_id TEXT");
	ensureColumn(db, "web_push_subscriptions", "preferences_json TEXT");
}
function ensureWebPushSubscriptionBindingSchema(database) {
	const options = webPushDatabaseOptions(database);
	if (ensuredWebPushBindingDatabases.has(database.db)) return;
	runAssistantStateWriteTransaction(({ db }) => ensureWebPushSubscriptionBindingColumns(db), options, { operationLabel: "web-push.subscription-binding.schema.ensure" });
	ensuredWebPushBindingDatabases.add(database.db);
}
function requestWebPushMutationAdmission(db, profiles, boundProfile) {
	let facts;
	if (profiles) {
		const resolve = (reference) => reference ? selectResolvedUserProfileMetadataById(db, reference)?.id : void 0;
		const original = resolve(profiles.original);
		const current = profiles.current === profiles.original ? original : resolve(profiles.current);
		const bound = boundProfile === profiles.original ? original : boundProfile === profiles.current ? current : resolve(boundProfile);
		facts = {
			profileId: current ?? null,
			bindingCurrent: (!profiles.original || original !== void 0) && (!profiles.current || current !== void 0) && (!boundProfile || bound !== void 0) && original === current && bound === current
		};
	}
	requestSqliteWorkerOperationAdmission({
		stage: "transaction",
		facts
	});
}
function setWebPushSubscriptionPreferencesInDatabase(params) {
	ensureWebPushSubscriptionBindingSchema(params.database);
	const options = webPushDatabaseOptions(params.database);
	if (params.requestProfiles?.original || params.requestProfiles?.current) ensureUserProfilesSchema(options);
	return runAssistantStateWriteTransaction(({ db }) => {
		if (params.assertCurrent) params.assertCurrent();
		else requestWebPushMutationAdmission(db, params.requestProfiles, params.expectedUserProfileId);
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("web_push_subscriptions").set({
			preferences_json: JSON.stringify(normalizeWebPushDevicePreferences(params.preferences)),
			updated_at_ms: Date.now()
		}).where("endpoint_hash", "=", hashWebPushEndpoint(params.endpoint)).where("endpoint", "=", params.endpoint).where("device_id", "=", params.expectedDeviceId).where("user_profile_id", params.expectedUserProfileId === null ? "is" : "=", params.expectedUserProfileId));
		return Number(result.numAffectedRows ?? 0) === 1;
	}, options);
}
/** Reread the endpoint row inside the write transaction before creating or updating it. */
function upsertWebPushSubscriptionInDatabase(params) {
	ensureWebPushSubscriptionBindingSchema(params.database);
	if (params.requestProfiles?.original || params.requestProfiles?.current) ensureUserProfilesSchema(webPushDatabaseOptions(params.database));
	return runAssistantStateWriteTransaction(({ db }) => {
		if (params.assertCurrent) params.assertCurrent();
		else requestWebPushMutationAdmission(db, params.requestProfiles, params.binding?.userProfileId);
		const stateDb = getNodeSqliteKysely(db);
		const existingRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("web_push_subscriptions").selectAll().where("endpoint_hash", "=", params.endpointHash));
		if (existingRow && existingRow.endpoint !== params.endpoint) throw new Error("web push endpoint hash collision");
		const subscription = {
			subscriptionId: existingRow?.subscription_id ?? params.candidateSubscriptionId,
			endpoint: params.endpoint,
			keys: { ...params.keys },
			createdAtMs: existingRow?.created_at_ms ?? params.nowMs,
			updatedAtMs: params.nowMs
		};
		const row = webPushSubscriptionToRow({
			endpointHash: params.endpointHash,
			subscription,
			binding: params.binding
		});
		const bindingChanged = Boolean(existingRow && (existingRow.device_id !== row.device_id || existingRow.user_profile_id !== row.user_profile_id));
		if (bindingChanged && existingRow && (existingRow.p256dh !== params.keys.p256dh || existingRow.auth !== params.keys.auth)) throw new WebPushSubscriptionBindingError("existing browser subscription keys required; reconnect from the owning browser");
		executeSqliteQuerySync(db, stateDb.insertInto("web_push_subscriptions").values(row).onConflict((conflict) => conflict.column("endpoint_hash").doUpdateSet({
			subscription_id: row.subscription_id,
			endpoint: row.endpoint,
			p256dh: row.p256dh,
			auth: row.auth,
			device_id: row.device_id,
			user_profile_id: row.user_profile_id,
			preferences_json: bindingChanged ? null : existingRow?.preferences_json ?? null,
			updated_at_ms: row.updated_at_ms
		})));
		return subscription;
	}, webPushDatabaseOptions(params.database));
}
function deleteBoundWebPushSubscriptionInDatabase(params) {
	ensureWebPushSubscriptionBindingSchema(params.database);
	if (params.requestProfiles?.original || params.requestProfiles?.current) ensureUserProfilesSchema(webPushDatabaseOptions(params.database));
	return runAssistantStateWriteTransaction(({ db }) => {
		if (params.assertCurrent) params.assertCurrent();
		else requestWebPushMutationAdmission(db, params.requestProfiles, params.expectedUserProfileId);
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("web_push_subscriptions").where("endpoint_hash", "=", params.endpointHash).where("endpoint", "=", params.endpoint).where("device_id", "=", params.expectedDeviceId).where("user_profile_id", params.expectedUserProfileId === null ? "is" : "=", params.expectedUserProfileId));
		return Number(result.numAffectedRows ?? 0) > 0;
	}, webPushDatabaseOptions(params.database));
}
//#endregion
export { upsertWebPushSubscriptionInDatabase as i, ensureWebPushSubscriptionBindingColumns as n, setWebPushSubscriptionPreferencesInDatabase as r, deleteBoundWebPushSubscriptionInDatabase as t };
