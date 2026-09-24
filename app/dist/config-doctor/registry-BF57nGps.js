import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-CICmT-bh.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { t as executeExistingAssistantStateRead, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Cg9RiSzs.js";
import { r as withFileLock } from "./file-lock-XibtmZie.js";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/sandbox/registry.kernel.ts
function rowToUpdate(row) {
	const { registry_kind: _registryKind, container_name: _containerName, ...update } = row;
	return update;
}
function insertSandboxRegistryRowInDatabase(db, row) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("sandbox_registry_entries").values(row).onConflict((conflict) => conflict.columns(["registry_kind", "container_name"]).doUpdateSet(rowToUpdate(row))));
}
function assertSandboxRegistryReservationCurrent(current, expected) {
	if (!current || current.runtimeState === "removing" || current.runtimeState === "removing-pending" || current.backendId !== expected.backendId || current.sessionKey !== expected.sessionKey) throw new Error("Sandbox runtime was removed or is being removed; retry after sandbox recreate completes.");
}
function containerEntryToRow(entry, existing) {
	const next = {
		...entry,
		backendId: entry.backendId ?? existing?.backendId,
		backendTarget: entry.backendTarget ?? existing?.backendTarget,
		runtimeLabel: entry.runtimeLabel ?? existing?.runtimeLabel,
		createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
		image: existing?.image ?? entry.image,
		configLabelKind: entry.configLabelKind ?? existing?.configLabelKind,
		configHash: entry.configHash ?? existing?.configHash,
		runtimeState: entry.runtimeState ?? existing?.runtimeState,
		workspaceDir: existing?.workspaceDir ?? entry.workspaceDir
	};
	return {
		registry_kind: "container",
		container_name: next.containerName,
		session_key: next.sessionKey,
		backend_id: next.backendId ?? null,
		runtime_label: next.runtimeLabel ?? null,
		image: next.image,
		created_at_ms: next.createdAtMs,
		last_used_at_ms: next.lastUsedAtMs,
		config_label_kind: next.configLabelKind ?? null,
		config_hash: next.configHash ?? null,
		cdp_port: null,
		no_vnc_port: null,
		entry_json: JSON.stringify(next),
		updated_at: Date.now()
	};
}
function browserEntryToRow(entry, existing) {
	const next = {
		...entry,
		createdAtMs: existing?.createdAtMs ?? entry.createdAtMs,
		image: existing?.image ?? entry.image,
		configHash: entry.configHash ?? existing?.configHash,
		workspaceDir: entry.workspaceDir ?? existing?.workspaceDir
	};
	return {
		registry_kind: "browser",
		container_name: next.containerName,
		session_key: next.sessionKey,
		backend_id: null,
		runtime_label: null,
		image: next.image,
		created_at_ms: next.createdAtMs,
		last_used_at_ms: next.lastUsedAtMs,
		config_label_kind: null,
		config_hash: next.configHash ?? null,
		cdp_port: next.cdpPort,
		no_vnc_port: next.noVncPort ?? null,
		entry_json: JSON.stringify(next),
		updated_at: Date.now()
	};
}
function parseRegistryEntryJson(row) {
	try {
		const parsed = JSON.parse(row.entry_json);
		return isRecord(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
function optionalPayloadString(value) {
	return typeof value === "string" ? value : "";
}
function rowToContainerEntry(row) {
	if (row.registry_kind !== "container") return null;
	const payload = parseRegistryEntryJson(row);
	if (!payload) return null;
	return normalizeSandboxRegistryEntry({
		...payload,
		containerName: row.container_name,
		sessionKey: row.session_key ?? optionalPayloadString(payload.sessionKey),
		createdAtMs: row.created_at_ms ?? Number(payload.createdAtMs ?? 0),
		lastUsedAtMs: row.last_used_at_ms ?? Number(payload.lastUsedAtMs ?? 0),
		image: row.image ?? optionalPayloadString(payload.image),
		...row.backend_id != null ? { backendId: row.backend_id } : {},
		...row.runtime_label != null ? { runtimeLabel: row.runtime_label } : {},
		...row.config_label_kind != null ? { configLabelKind: row.config_label_kind } : {},
		...row.config_hash != null ? { configHash: row.config_hash } : {}
	});
}
function rowToBrowserEntry(row) {
	if (row.registry_kind !== "browser") return null;
	const payload = parseRegistryEntryJson(row);
	if (!payload) return null;
	return {
		...payload,
		containerName: row.container_name,
		sessionKey: row.session_key ?? optionalPayloadString(payload.sessionKey),
		createdAtMs: row.created_at_ms ?? Number(payload.createdAtMs ?? 0),
		lastUsedAtMs: row.last_used_at_ms ?? Number(payload.lastUsedAtMs ?? 0),
		image: row.image ?? optionalPayloadString(payload.image),
		cdpPort: row.cdp_port ?? Number(payload.cdpPort ?? 0),
		...row.no_vnc_port != null ? { noVncPort: row.no_vnc_port } : {},
		...row.config_hash != null ? { configHash: row.config_hash } : {}
	};
}
function normalizeSandboxRegistryEntry(entry) {
	return {
		...entry,
		backendId: entry.backendId?.trim() || "docker",
		runtimeLabel: entry.runtimeLabel?.trim() || entry.containerName,
		configLabelKind: entry.configLabelKind?.trim() || "Image"
	};
}
function readSandboxRegistryEntryInDatabase(db, containerName) {
	if (!tableExists(db, "sandbox_registry_entries")) return null;
	const row = readSandboxRegistryRowInDatabase(db, "container", containerName);
	return row ? rowToContainerEntry(row) : null;
}
function readSandboxRegistryRowInDatabase(db, kind, containerName) {
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", kind).where("container_name", "=", containerName).limit(1)).rows[0] ?? null;
}
//#endregion
//#region src/agents/sandbox/registry.ts
/**
* Persistent sandbox registry storage.
*
* Tracks runtime and browser containers in the shared state DB.
*/
function getSandboxRegistryKysely(db) {
	return getNodeSqliteKysely(db);
}
async function writeRegistry(write) {
	const context = captureAssistantStateWorkerContext();
	const input = structuredClone(write);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		context.maintenanceScope?.assertAdmission();
	};
	const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "sandboxRegistry.write",
		input
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
}
function removeRegistryRow(kind, containerName) {
	runAssistantStateWriteTransaction(({ db }) => {
		const stateDb = getSandboxRegistryKysely(db);
		executeSqliteQuerySync(db, stateDb.deleteFrom("sandbox_registry_entries").where("registry_kind", "=", kind).where("container_name", "=", containerName));
	});
}
/** Reads all registered sandbox runtime containers from SQLite. */
async function readRegistry() {
	const reply = await executeExistingAssistantStateRead({}, { type: "sandboxRegistry.list" });
	if (!reply) return { entries: [] };
	if (!reply.ok || reply.type !== "sandboxRegistry.list") throw new Error("Unexpected sandbox registry list result");
	return { entries: reply.entries };
}
/** Reads one registered sandbox runtime container by container name. */
async function readRegistryEntry(containerName) {
	const reply = await executeExistingAssistantStateRead({}, {
		type: "sandboxRegistry.get",
		containerName
	});
	if (!reply) return null;
	if (!reply.ok || reply.type !== "sandboxRegistry.get") throw new Error("Unexpected sandbox registry lookup result");
	return reply.entry;
}
/** Reads registered runtime IDs for one backend-owned sandbox scope, newest first. */
async function readRegisteredSandboxRuntimeIds(params) {
	const reply = await executeExistingAssistantStateRead({}, {
		type: "sandboxRegistry.runtimeIds",
		...params
	});
	if (!reply) return [];
	if (!reply.ok || reply.type !== "sandboxRegistry.runtimeIds") throw new Error("Unexpected sandbox runtime ID result");
	return reply.runtimeIds;
}
/** Creates or updates one sandbox runtime registry entry, preserving immutable creation fields. */
async function updateRegistry(entry) {
	await writeRegistry({
		operation: "update",
		entry
	});
}
/** Removes one sandbox runtime registry entry by container name. */
async function removeRegistryEntry(containerName, options = {}) {
	await writeRegistry({
		operation: "remove",
		containerName,
		preserveRemovalIntent: options.preserveRemovalIntent
	});
}
/** Atomically select one generation for a backend/scope before provider allocation. */
function reserveSandboxRegistryEntry(candidate) {
	return runAssistantStateWriteTransaction(({ db }) => {
		const stateDb = getSandboxRegistryKysely(db);
		const existing = executeSqliteQuerySync(db, stateDb.selectFrom("sandbox_registry_entries").selectAll().where("registry_kind", "=", "container").where("backend_id", "=", candidate.backendId ?? "docker").where("session_key", "=", candidate.sessionKey).orderBy("last_used_at_ms", "desc").orderBy("container_name", "asc")).rows.map(rowToContainerEntry).find((entry) => entry !== null);
		if (existing) {
			assertSandboxRegistryReservationCurrent(existing, candidate);
			if (!existing.runtimeState || !existing.workspaceDir) {
				existing.runtimeState ??= "pending";
				existing.workspaceDir ??= candidate.workspaceDir;
				insertSandboxRegistryRowInDatabase(db, containerEntryToRow(existing));
			}
			return existing;
		}
		if (readSandboxRegistryRowInDatabase(db, "container", candidate.containerName)) throw new Error(`Sandbox runtime ID "${candidate.containerName}" is already registered.`);
		const entry = {
			...candidate,
			runtimeState: "pending"
		};
		insertSandboxRegistryRowInDatabase(db, containerEntryToRow(entry));
		return entry;
	});
}
/** Validate the exact generation; retained handles cannot outlive removal intent. */
function assertSandboxRegistryEntryCurrent(entry) {
	const current = withExistingAssistantStateDatabaseReadOnly(({ db }) => readSandboxRegistryEntryInDatabase(db, entry.containerName)) ?? null;
	assertSandboxRegistryReservationCurrent(current, entry);
	if (current.createdAtMs !== entry.createdAtMs || current.workspaceDir !== entry.workspaceDir || current.configHash !== entry.configHash || !isDeepStrictEqual(current.backendTarget, entry.backendTarget)) throw new Error("Sandbox runtime generation changed");
}
/** Publish only a still-current reservation, or forget a provider-confirmed terminal generation. */
async function completeSandboxRegistryReservation(entry, retired = false) {
	await writeRegistry({
		operation: "complete",
		entry,
		retired
	});
}
/** Serialize provider operations across Gateway/CLI; only dead owners permit lock recovery. */
async function withSandboxRegistryEntryLock(entry, operation) {
	const key = createHash("sha256").update(entry.containerName).digest("hex");
	return await withFileLock(`${resolveAssistantStateSqlitePath()}.sandbox-${key}`, {
		retries: {
			retries: 9e3,
			factor: 1,
			minTimeout: 100,
			maxTimeout: 100
		},
		stale: 0,
		staleRecovery: "remove-if-definitely-stale"
	}, operation);
}
/** Persist removal intent before waiting for provisioning, and retain failed cleanup for retry. */
async function removeSandboxRegistryRuntime(entry, removeRuntime, options = {}) {
	const selected = runAssistantStateWriteTransaction(({ db }) => {
		const row = readSandboxRegistryRowInDatabase(db, "container", entry.containerName);
		const current = row ? rowToContainerEntry(row) : null;
		if (!current || current.backendId !== entry.backendId || current.sessionKey !== entry.sessionKey || options.shouldRemove && !options.shouldRemove(current)) return null;
		if (!current.runtimeState && !options.reserveRuntime) return current;
		const next = {
			...current,
			runtimeState: current.runtimeState === "pending" || current.runtimeState === "removing-pending" ? "removing-pending" : "removing"
		};
		insertSandboxRegistryRowInDatabase(db, containerEntryToRow(next, current));
		return next;
	});
	if (!selected) return;
	if (!selected.runtimeState) {
		await removeRuntime(selected);
		await removeRegistryEntry(selected.containerName);
		return;
	}
	const removing = selected;
	await withSandboxRegistryEntryLock(removing, async () => {
		const current = await readRegistryEntry(removing.containerName);
		if (!current || current.runtimeState !== "removing" && current.runtimeState !== "removing-pending" || current.backendId !== removing.backendId || current.sessionKey !== removing.sessionKey || options.shouldRemove && !options.shouldRemove(current)) return;
		await removeRuntime(current);
		await removeRegistryEntry(current.containerName);
	});
}
/** Reads all registered browser sandbox containers from SQLite. */
async function readBrowserRegistry() {
	const reply = await executeExistingAssistantStateRead({}, { type: "sandboxRegistry.browsers" });
	if (!reply) return { entries: [] };
	if (!reply.ok || reply.type !== "sandboxRegistry.browsers") throw new Error("Unexpected sandbox browser registry result");
	return { entries: reply.entries };
}
/** Validate the exact browser workspace owner before local reconciliation effects. */
function assertSandboxBrowserRegistryEntryCurrent(entry) {
	const current = withExistingAssistantStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "sandbox_registry_entries")) return null;
		const row = readSandboxRegistryRowInDatabase(db, "browser", entry.containerName);
		return row ? rowToBrowserEntry(row) : null;
	});
	if (!current || current.sessionKey !== entry.sessionKey || current.createdAtMs !== entry.createdAtMs || current.workspaceDir !== entry.workspaceDir || current.configHash !== entry.configHash) throw new Error("Sandbox browser workspace owner changed");
}
/** Creates or updates one browser sandbox registry entry, preserving immutable creation fields. */
async function updateBrowserRegistry(entry) {
	runAssistantStateWriteTransaction(({ db }) => {
		const existingRow = readSandboxRegistryRowInDatabase(db, "browser", entry.containerName);
		insertSandboxRegistryRowInDatabase(db, browserEntryToRow(entry, existingRow ? rowToBrowserEntry(existingRow) : null));
	});
}
function sameSandboxRegistryGeneration(current, expected) {
	const { lastUsedAtMs: _currentUse, ...currentGeneration } = current;
	const { lastUsedAtMs: _expectedUse, ...expectedGeneration } = expected;
	return isDeepStrictEqual(currentGeneration, expectedGeneration);
}
/** Forget only the inspected allocation, under the caller's still-live settlement lease. */
function removeSandboxRegistryGeneration(kind, entry, assertCurrent) {
	runAssistantStateWriteTransaction(({ db }) => {
		assertCurrent();
		const row = readSandboxRegistryRowInDatabase(db, kind, entry.containerName);
		const current = row && (kind === "browser" ? rowToBrowserEntry(row) : rowToContainerEntry(row));
		if (!current || !sameSandboxRegistryGeneration(current, entry)) throw new Error("Sandbox runtime generation changed during retirement");
		const stateDb = getSandboxRegistryKysely(db);
		executeSqliteQuerySync(db, stateDb.deleteFrom("sandbox_registry_entries").where("registry_kind", "=", kind).where("container_name", "=", entry.containerName));
	});
}
/** Removes one browser sandbox registry entry by container name. */
async function removeBrowserRegistryEntry(containerName) {
	removeRegistryRow("browser", containerName);
}
//#endregion
export { containerEntryToRow as _, readRegisteredSandboxRuntimeIds as a, removeBrowserRegistryEntry as c, removeSandboxRegistryRuntime as d, reserveSandboxRegistryEntry as f, browserEntryToRow as g, withSandboxRegistryEntryLock as h, readBrowserRegistry as i, removeRegistryEntry as l, updateRegistry as m, assertSandboxRegistryEntryCurrent as n, readRegistry as o, updateBrowserRegistry as p, completeSandboxRegistryReservation as r, readRegistryEntry as s, assertSandboxBrowserRegistryEntryCurrent as t, removeSandboxRegistryGeneration as u };
