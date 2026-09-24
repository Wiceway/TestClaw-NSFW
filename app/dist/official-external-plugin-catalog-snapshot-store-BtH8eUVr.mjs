import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-DSeyJ5Sb.mjs";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-DStyAtQk.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { n as HostedCatalogSignedFeedMonotonicityError } from "./official-external-plugin-catalog-source-BxrkRw-S.mjs";
import { existsSync } from "node:fs";
//#region src/plugins/official-external-plugin-catalog-snapshot-store.ts
/** Persists hosted official plugin catalog snapshots through the shared-state worker. */
function resolveDatabaseOptions(options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	if (options.stateDir) env.TESTCLAW_STATE_DIR = options.stateDir;
	return {
		env,
		path: options.stateDatabasePath || resolveAssistantStateSqlitePath(env)
	};
}
function captureSnapshot(snapshot) {
	const { metadata, trust, monotonic } = snapshot;
	return {
		body: snapshot.body,
		metadata: {
			url: metadata.url,
			status: metadata.status,
			etag: metadata.etag,
			lastModified: metadata.lastModified,
			checksum: metadata.checksum
		},
		savedAt: snapshot.savedAt,
		...trust ? { trust: {
			mode: trust.mode,
			signedBy: trust.signedBy,
			signatureCount: trust.signatureCount,
			threshold: trust.threshold,
			verifiedAt: trust.verifiedAt
		} } : {},
		...monotonic ? { monotonic: {
			mode: monotonic.mode,
			sequence: monotonic.sequence,
			generatedAt: monotonic.generatedAt
		} } : {}
	};
}
/** Creates a snapshot store backed by the shared `state/testclaw.sqlite` database. */
function createSqliteHostedOfficialExternalPluginCatalogSnapshotStore(options = {}) {
	return {
		async read(url) {
			const databaseOptions = resolveDatabaseOptions(options);
			if (!existsSync(databaseOptions.path)) return null;
			const context = captureAssistantStateWorkerContext(databaseOptions);
			const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-Cbw9_4QI.mjs");
			return await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
				type: "plugins.catalogSnapshot.read",
				input: { url }
			}), { existingOnly: true }) ?? null;
		},
		async write(snapshot) {
			const now = Date.now();
			const prepared = captureSnapshot(snapshot);
			const context = captureAssistantStateWorkerContext(resolveDatabaseOptions(options));
			const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-Cbw9_4QI.mjs");
			const result = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
				type: "plugins.catalogSnapshot.write",
				input: {
					snapshot: prepared,
					now
				}
			}));
			if (!result.ok) throw new HostedCatalogSignedFeedMonotonicityError(result.message);
		}
	};
}
//#endregion
export { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore };
