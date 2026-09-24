import { r as openAssistantStateDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { n as runWithSqliteWorkerStateContext } from "./sqlite-worker-state-context-CUqRhO7l.js";
import { i as upsertWebPushSubscriptionInDatabase, r as setWebPushSubscriptionPreferencesInDatabase, t as deleteBoundWebPushSubscriptionInDatabase } from "./push-web-store.kernel-CK2_UqYf.js";
//#region src/infra/push-web-store.native.ts
function withNativeWebPushDatabase(context, operation) {
	context.admission.assertCurrent();
	return runWithSqliteWorkerStateContext(context, () => operation(openAssistantStateDatabase({
		path: context.admission.databasePath,
		env: context.environment
	})));
}
function setNativeWebPushSubscriptionPreferences(params, context) {
	return withNativeWebPushDatabase(context, (database) => setWebPushSubscriptionPreferencesInDatabase({
		...params,
		database
	}));
}
function upsertNativeWebPushSubscription(params, context) {
	return withNativeWebPushDatabase(context, (database) => upsertWebPushSubscriptionInDatabase({
		...params,
		database
	}));
}
function deleteNativeBoundWebPushSubscription(params, context) {
	return withNativeWebPushDatabase(context, (database) => deleteBoundWebPushSubscriptionInDatabase({
		...params,
		database
	}));
}
//#endregion
export { deleteNativeBoundWebPushSubscription, setNativeWebPushSubscriptionPreferences, upsertNativeWebPushSubscription };
