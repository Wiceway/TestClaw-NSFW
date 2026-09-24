import { E as resolveStateDir } from "./paths-DeOFr7iP.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { a as resolveAssistantAgentSqlitePath } from "./testclaw-agent-db.paths-XNCyPZ9E.js";
import { t as sessionChanges } from "./session-row-changes-DN0Dk-5R.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { a as prepareAssistantAgentDatabaseRegistrySnapshotRead } from "./testclaw-agent-db-registry-listing-DBxqeFUz.js";
import { t as runAssistantAgentWorkerWrite } from "./testclaw-agent-write-admission-fcqqlXn0.js";
import { t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-DLysF7hk.js";
import { g as toDatabaseOptions, u as resolveSqliteScope } from "./session-accessor.sqlite-scope-D-yDm5hE.js";
import { t as captureAssistantAgentDatabaseExecution } from "./testclaw-agent-execution-CA747lDP.js";
import { f as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-DFtewwRd.js";
import { i as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CBtrr-9r.js";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-DtyU4c68.js";
//#region src/config/sessions/provider-review-store.ts
async function withProviderReviewDatabase(target, assertCallerCurrent, operation) {
	assertCallerCurrent();
	const env = cloneEnvWithPlatformSemantics(target.env ?? process.env);
	env.TESTCLAW_STATE_DIR = resolveStateDir(env);
	const logical = resolveSqliteScope({
		...target,
		storePath: void 0,
		env
	});
	const storePath = logical.path ?? target.storePath ?? resolveAssistantAgentSqlitePath(toDatabaseOptions(logical));
	const candidates = captureSessionStoreReadCandidates(storePath);
	const registryRead = prepareAssistantAgentDatabaseRegistrySnapshotRead({ env });
	return withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		const request = {
			agentId: logical.agentId,
			storePath,
			env
		};
		let selected = await discovery.readStoreTarget({
			...request,
			registeredDatabases: { status: "deferred" }
		});
		let assertRegistryCurrent;
		if (selected.kind === "session-target-registry-required") {
			const registry = await registryRead.read();
			assertRegistryCurrent = registry.assertCurrent;
			registry.assertCurrent();
			discovery.assertCurrent();
			assertCallerCurrent();
			selected = await discovery.readStoreTarget({
				...request,
				registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
			});
		}
		if (selected.kind !== "session-store-target") throw new Error("Provider review store could not resolve its database owner");
		assertRegistryCurrent?.();
		const sourcePath = selected.sourcePath;
		const assertCurrent = () => {
			discovery.assertCurrent();
			assertSessionStoreReadCandidate(sourcePath, candidates);
			assertCallerCurrent();
		};
		assertCurrent();
		return operation({
			...selected.database,
			env
		}, logical.sessionKey, assertCurrent);
	});
}
async function readSessionProviderReview(target, assertCurrent) {
	assertCurrent();
	const { sessionId, lifecycleRevision } = target;
	return withProviderReviewDatabase(target, assertCurrent, async (options, sessionKey, assertHeld) => {
		const result = await withSessionHistoryWorkerDatabase(options, (owner) => owner.readExactEntries({
			sessionKeys: [sessionKey],
			env: options.env ?? {}
		}));
		assertHeld();
		const entry = result.entries.find((row) => row.sessionKey === sessionKey)?.entry;
		return entry?.sessionId === sessionId && entry.lifecycleRevision === lifecycleRevision ? entry : void 0;
	});
}
/** A review clear can consume only the exact refusal the human acknowledged. */
async function compareSessionProviderReview(target, params) {
	params.assertCurrent();
	const capturedTarget = { ...target };
	const input = structuredClone({
		sessionKey: target.sessionKey,
		sessionId: target.sessionId,
		lifecycleRevision: target.lifecycleRevision,
		expectedReview: params.expectedReview,
		nextReview: params.nextReview
	});
	return withProviderReviewDatabase(capturedTarget, params.assertCurrent, async (options, sessionKey, assertHeld) => {
		input.sessionKey = sessionKey;
		const execution = captureAssistantAgentDatabaseExecution(options);
		const assertCurrent = () => {
			execution.assertCurrent();
			assertHeld();
		};
		try {
			const entry = await runAssistantAgentWorkerWrite(options, () => execution.runExisting({
				assertCurrent,
				createAdmission(binding) {
					return () => ({
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							binding.authorize(request);
							assertCurrent();
							if (!grant()) throw new Error("Provider review authority expired");
						})
					});
				}
			}, (worker) => worker.execute({
				type: "session.providerReview.compare",
				input
			})));
			if (!entry) throw new Error("Session disappeared before provider review update");
			sessionChanges.emit({
				agentId: capturedTarget.agentId,
				storePath: execution.path,
				sessionKey
			});
			return entry;
		} finally {
			await execution.release();
		}
	});
}
//#endregion
export { compareSessionProviderReview, readSessionProviderReview };
