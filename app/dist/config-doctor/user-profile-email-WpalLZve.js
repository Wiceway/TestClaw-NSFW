import { t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as normalizeProfileEmail } from "./user-profile-email.kernel-DX9GWr_x.js";
//#region src/state/user-profile-email.ts
/** Legacy email authentication keeps creation with the existing profile owner. */
async function ensureProfileIdForEmail(email, options = {}, assertCurrent) {
	assertCurrent?.();
	const normalized = normalizeProfileEmail(email);
	const context = captureAssistantStateWorkerContext(options);
	const selected = {
		...options,
		path: context.admission.databasePath
	};
	const observed = await executeExistingAssistantStateRead(selected, {
		type: "userProfiles.email.resolve",
		email: normalized
	});
	context.admission.assertCurrent();
	assertCurrent?.();
	if (observed && (!observed.ok || observed.type !== "userProfiles.email.resolve")) throw new Error("Unexpected profile email lookup reply");
	if (observed?.profileId) return observed.profileId;
	const { ensureCanonicalUserProfileForEmail } = await import("./user-profile-writes-B7rOXsqi.js");
	return (await ensureCanonicalUserProfileForEmail(normalized, {
		...selected,
		assertCurrent: () => {
			context.admission.assertCurrent();
			assertCurrent?.();
		}
	})).id;
}
//#endregion
export { ensureProfileIdForEmail };
