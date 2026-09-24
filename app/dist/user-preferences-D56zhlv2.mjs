import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { c as runAssistantStateWriteTransaction, r as openAssistantStateDatabase } from "./testclaw-state-db-BXFT1fUC.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-DZ6Lslrz.mjs";
import { i as runAssistantStateWorkerOperation, t as executeAssistantStateWorker } from "./testclaw-state-worker-store-CirfybVZ.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { D as writeUserPreferences, E as readUserPreferences, w as ensureUserPreferencesSchema } from "./user-profile-list-Bvg01jUh.mjs";
//#region src/state/user-preferences.validation.ts
function prepareEntries(entries) {
	const rawEntries = Object.entries(entries);
	if (rawEntries.length > 32) return err({ code: "invalid-entry-count" });
	const serialized = [];
	const deletionKeys = [];
	for (const [prefKey, value] of rawEntries) {
		if (!prefKey || prefKey.length > 256) return err({
			code: "invalid-key",
			key: prefKey
		});
		if (value === null) {
			deletionKeys.push(prefKey);
			continue;
		}
		let valueJson;
		try {
			valueJson = JSON.stringify(value);
		} catch {
			return err({
				code: "invalid-value",
				key: prefKey
			});
		}
		if (valueJson === void 0) return err({
			code: "invalid-value",
			key: prefKey
		});
		if (Buffer.byteLength(valueJson, "utf8") > 4096) return err({
			code: "value-too-large",
			key: prefKey
		});
		serialized.push({
			prefKey,
			valueJson
		});
	}
	return ok({
		serialized,
		deletionKeys
	});
}
function prepareUserPreferenceUpdate(entries, expectedEntries = {}) {
	const prepared = prepareEntries(entries);
	if (!prepared.ok) return prepared;
	const expected = prepareEntries(expectedEntries);
	if (!expected.ok) return expected;
	return ok({
		...prepared.value,
		expected: [...expected.value.serialized, ...expected.value.deletionKeys.map((prefKey) => ({
			prefKey,
			valueJson: null
		}))]
	});
}
//#endregion
//#region src/state/user-preferences.ts
function getUserPreferences(profileId, keys, options = {}) {
	if (keys?.length === 0) return {};
	ensureUserPreferencesSchema(options);
	return readUserPreferences(openAssistantStateDatabase(options).db, profileId, keys);
}
function setUserPreferences(profileId, entries, options = {}) {
	const prepared = prepareUserPreferenceUpdate(entries, options.expectedEntries);
	if (!prepared.ok) return prepared;
	if (prepared.value.serialized.length === 0 && prepared.value.deletionKeys.length === 0 && prepared.value.expected.length === 0) return ok(void 0);
	ensureUserPreferencesSchema(options);
	return runAssistantStateWriteTransaction(({ db }) => writeUserPreferences(db, profileId, prepared.value), options, { operationLabel: "users.preferences.set" });
}
function getCanonicalUserPreferences(profileId, keys, options = {}) {
	return executeAssistantStateWorker(captureAssistantStateWorkerContext(options), {
		type: "userPreferences.read",
		input: {
			profileId,
			keys
		}
	});
}
async function setCanonicalUserPreferences(profileId, entries, options = {}) {
	const prepared = prepareUserPreferenceUpdate(entries, options.expectedEntries);
	if (!prepared.ok) return prepared;
	const context = captureAssistantStateWorkerContext(options);
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "userPreferences.write",
		input: {
			profileId,
			update: prepared.value
		}
	}), {
		assertCurrent: options.assertCurrent,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Profile preference mutation requires transaction admission");
				context.admission.assertCurrent();
				options.assertCurrent?.();
				grant();
			})
		})
	});
}
//#endregion
export { setUserPreferences as i, getUserPreferences as n, setCanonicalUserPreferences as r, getCanonicalUserPreferences as t };
