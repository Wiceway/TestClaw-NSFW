import "./src-D9uQ497Z.js";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { g as registerAssistantStateDatabaseLifecycleListener } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { H as resolveDatabasePath, R as assertAssistantStateDatabaseOwner, r as isArtifactPreservingStateRead, s as withExistingAssistantStateDatabaseArtifactPreservingReadOnly, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import "./testclaw-state-db-BAeysXj_.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/claws/provenance-runtime-read.kernel.ts
function readClawInstallSchemaVersionRows(db) {
	if (!tableExists(db, "claw_installs")) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("claw_installs").select([
		"agent_id as agentId",
		"schema_version as schemaVersion",
		"agent_config_digest as agentConfigDigest"
	])).rows;
}
//#endregion
//#region src/claws/provenance-schema-version.ts
const LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION = "testclaw.clawInstallRecord.v1";
const CLAW_INSTALL_RECORD_SCHEMA_VERSION = "testclaw.clawInstallRecord.v2";
function parseClawInstallRecordSchemaVersion(value) {
	if (value === LEGACY_CLAW_INSTALL_RECORD_SCHEMA_VERSION || value === "testclaw.clawInstallRecord.v2") return value;
	throw new Error(`Unsupported Claw install record schema ${JSON.stringify(value)}.`);
}
function upgradeClawInstallSchema(db, agentId, record, expectedRecord, replacement) {
	if (!expectedRecord || stableStringify(record) !== stableStringify(expectedRecord)) throw new Error(`Legacy Claw install record for agent ${JSON.stringify(agentId)} is not an exact resumable attempt.`);
	db.prepare(`UPDATE claw_installs
          SET schema_version = ?, plan_integrity = ?, agent_config_digest = ?
        WHERE agent_id = ?`).run(CLAW_INSTALL_RECORD_SCHEMA_VERSION, replacement?.planIntegrity ?? record.planIntegrity, replacement?.agentConfigDigest ?? record.agentConfigDigest, agentId);
	return {
		...record,
		...replacement,
		schemaVersion: CLAW_INSTALL_RECORD_SCHEMA_VERSION
	};
}
//#endregion
//#region src/claws/provenance-runtime-read.ts
const snapshotsByPath = /* @__PURE__ */ new Map();
const snapshotListeners = /* @__PURE__ */ new Set();
const handedOffFacts = resolveGlobalSingleton(Symbol.for("testclaw.clawInstallSchemaVersionFacts"), () => new AsyncLocalStorage());
function notifySnapshotListeners() {
	for (const listener of snapshotListeners) listener();
}
function decodeSchemaVersions(rows) {
	const schemaVersions = /* @__PURE__ */ new Map();
	for (const row of rows) try {
		schemaVersions.set(row.agentId, {
			kind: "ok",
			schemaVersion: parseClawInstallRecordSchemaVersion(row.schemaVersion),
			agentConfigDigest: row.agentConfigDigest
		});
	} catch (error) {
		schemaVersions.set(row.agentId, {
			kind: "error",
			error
		});
	}
	return {
		kind: "ready",
		schemaVersions
	};
}
function readSchemaVersions(db) {
	try {
		return decodeSchemaVersions(readClawInstallSchemaVersionRows(db));
	} catch (error) {
		return {
			kind: "state-error",
			error,
			knownAgentIds: /* @__PURE__ */ new Set(),
			ownershipUnknown: true
		};
	}
}
function knownAgentIds(snapshot) {
	if (snapshot?.kind === "ready") return new Set(snapshot.schemaVersions.keys());
	return snapshot?.kind === "state-error" ? snapshot.knownAgentIds : /* @__PURE__ */ new Set();
}
function isOwnershipUnknown(snapshot) {
	return !snapshot || snapshot.kind === "uninitialized" || snapshot.kind === "state-error" && snapshot.ownershipUnknown;
}
registerAssistantStateDatabaseLifecycleListener((event) => {
	if (event.kind === "failure-cleared") return;
	const previous = snapshotsByPath.get(event.kind === "opened" ? event.database.path : event.path);
	if (event.kind === "opened") {
		const snapshot = readSchemaVersions(event.database.db);
		snapshotsByPath.set(event.database.path, snapshot.kind === "state-error" ? {
			...snapshot,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: isOwnershipUnknown(previous)
		} : snapshot);
	} else if (event.kind === "open-error" || event.kind === "terminal-failure") snapshotsByPath.set(event.path, {
		kind: "state-error",
		error: event.error,
		knownAgentIds: knownAgentIds(previous),
		ownershipUnknown: isOwnershipUnknown(previous)
	});
	else snapshotsByPath.set(event.path, {
		kind: "state-error",
		error: /* @__PURE__ */ new Error("Assistant state database closed before consent provenance verification."),
		knownAgentIds: knownAgentIds(previous),
		ownershipUnknown: isOwnershipUnknown(previous)
	});
	notifySnapshotListeners();
});
function resolveSnapshotPath(options) {
	return options.database?.path ?? resolveDatabasePath(options);
}
/** Discovery workers consume the host's prepared facts, including failed or missing preparation. */
function captureClawInstallSchemaVersionFacts(options = {}) {
	const path = resolveSnapshotPath(options);
	const snapshot = readCachedClawInstallSchemaVersions(options);
	if (snapshot.kind === "ready") return {
		path,
		snapshot: {
			kind: snapshot.kind,
			schemaVersions: [...snapshot.schemaVersions].map(([agentId, read]) => [agentId, read.kind === "error" ? {
				...read,
				error: formatErrorMessage(read.error)
			} : read])
		}
	};
	return {
		path,
		snapshot: snapshot.kind === "state-error" ? {
			...snapshot,
			error: formatErrorMessage(snapshot.error),
			knownAgentIds: [...snapshot.knownAgentIds]
		} : snapshot
	};
}
function readHandedOffFacts(options) {
	const scope = handedOffFacts.getStore();
	if (!scope) return;
	if (!scope.active || scope.path !== resolveSnapshotPath(options)) throw new Error("Claw provenance facts are outside their captured state scope.");
	return scope.snapshot;
}
function readCachedClawInstallSchemaVersions(options = {}) {
	return readHandedOffFacts(options) ?? snapshotsByPath.get(resolveSnapshotPath(options)) ?? { kind: "uninitialized" };
}
function initializeCachedClawInstallSchemaVersions(options = {}) {
	if (readHandedOffFacts(options)) {
		notifySnapshotListeners();
		return;
	}
	const path = resolveSnapshotPath(options);
	const previous = snapshotsByPath.get(path);
	try {
		const snapshot = (options.artifactPreservingReadOnly === false ? withExistingAssistantStateDatabaseReadOnly : withExistingAssistantStateDatabaseArtifactPreservingReadOnly)(({ db, path: pathname }) => {
			assertAssistantStateDatabaseOwner(db, { pathname });
			return readSchemaVersions(db);
		}, options);
		snapshotsByPath.set(path, resolveSchemaVersionSnapshot(snapshot, previous));
	} catch (error) {
		snapshotsByPath.set(path, {
			kind: "state-error",
			error,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: true
		});
	}
	notifySnapshotListeners();
}
function resolveSchemaVersionSnapshot(snapshot, previous) {
	if (snapshot) return snapshot;
	const previousAgentIds = knownAgentIds(previous);
	return previousAgentIds.size > 0 || previous !== void 0 && isOwnershipUnknown(previous) ? {
		kind: "state-error",
		error: /* @__PURE__ */ new Error("Assistant state database disappeared after Claw ownership was observed."),
		knownAgentIds: previousAgentIds,
		ownershipUnknown: true
	} : {
		kind: "ready",
		schemaVersions: /* @__PURE__ */ new Map()
	};
}
async function prepareClawInstallSchemaVersions(options = {}) {
	const path = resolveSnapshotPath(options);
	const previous = snapshotsByPath.get(path);
	let snapshot;
	let assertCurrent;
	try {
		const context = captureAssistantStateWorkerContext({
			path,
			env: options.env
		});
		assertCurrent = context.admission.assertCurrent;
		const rows = await runAssistantStateWorkerOperation(context, (scope) => scope.execute({
			type: "claws.install-schema-versions",
			input: { artifactPreservingReadOnly: options.artifactPreservingReadOnly !== false || isArtifactPreservingStateRead() }
		}), { existingOnly: true });
		snapshot = resolveSchemaVersionSnapshot(rows === void 0 ? void 0 : decodeSchemaVersions(rows), previous);
	} catch (error) {
		snapshot = {
			kind: "state-error",
			error,
			knownAgentIds: knownAgentIds(previous),
			ownershipUnknown: true
		};
	}
	return {
		path,
		publish: () => {
			const current = snapshotsByPath.get(path);
			if (current !== previous) return;
			try {
				if (resolveSnapshotPath(options) !== path) throw new Error("Assistant state location changed before consent provenance publication.");
				assertCurrent?.();
			} catch (error) {
				snapshot = {
					kind: "state-error",
					error,
					knownAgentIds: knownAgentIds(current),
					ownershipUnknown: true
				};
			}
			snapshotsByPath.set(path, snapshot);
			notifySnapshotListeners();
		}
	};
}
function registerClawInstallSchemaVersionSnapshotListener(listener) {
	snapshotListeners.add(listener);
	return () => snapshotListeners.delete(listener);
}
function cacheClawInstallSchemaVersion(agentId, schemaVersion, agentConfigDigest, options = {}) {
	const snapshot = snapshotsByPath.get(resolveSnapshotPath(options));
	if (snapshot?.kind !== "ready") return;
	snapshot.schemaVersions.set(agentId, {
		kind: "ok",
		schemaVersion,
		agentConfigDigest
	});
	snapshotsByPath.set(resolveSnapshotPath(options), { ...snapshot });
	notifySnapshotListeners();
}
function deleteCachedClawInstallSchemaVersion(agentId, options = {}) {
	const snapshot = snapshotsByPath.get(resolveSnapshotPath(options));
	if (snapshot?.kind !== "ready" || !snapshot.schemaVersions.delete(agentId)) return;
	snapshotsByPath.set(resolveSnapshotPath(options), { ...snapshot });
	notifySnapshotListeners();
}
//#endregion
export { prepareClawInstallSchemaVersions as a, CLAW_INSTALL_RECORD_SCHEMA_VERSION as c, initializeCachedClawInstallSchemaVersions as i, parseClawInstallRecordSchemaVersion as l, captureClawInstallSchemaVersionFacts as n, readCachedClawInstallSchemaVersions as o, deleteCachedClawInstallSchemaVersion as r, registerClawInstallSchemaVersionSnapshotListener as s, cacheClawInstallSchemaVersion as t, upgradeClawInstallSchema as u };
