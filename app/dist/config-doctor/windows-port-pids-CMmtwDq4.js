import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { S as parseStrictPositiveInteger } from "./number-coercion-0M4tZV2c.js";
import { d as normalizeStringEntries } from "./string-normalization-DsCfAx8q.js";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-C94DYooc.js";
import { K as tableExists } from "./sqlite-live-snapshot-C0XwFcJs.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { l as withExistingAssistantStateDatabaseCurrentReadOnly, u as withExistingAssistantStateDatabaseReadOnly } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { a as assertAssistantStateWriteAllowed } from "./testclaw-state-ownership-B0rMwXgw.js";
import { u as withAssistantStateStartupMigrationCheckpointDatabase } from "./testclaw-state-db-BAeysXj_.js";
import { a as decodeWindowsProcessOutput, t as getFileLockProcessStartTime } from "./pid-alive-BrVKCISp.js";
import { a as releaseAssistantStateLeaseInTransaction, c as readStateLeaseProcessOwnerStatus, i as reclaimDeadAssistantStateLeaseInTransaction, n as readAssistantStateLease, s as parseStateLeaseProcessOwner, t as acquireAssistantStateLeaseInTransaction } from "./testclaw-state-lease-store-DwGiGlp_.js";
import { n as STARTUP_MIGRATION_LEASE_TTL_MS } from "./startup-migration-checkpoint-DnvPNuHL.js";
import { t as startAssistantStateLeaseHeartbeat } from "./testclaw-state-lease-heartbeat-D0J4g3Fp.js";
import { a as getWindowsSystem32ExePath, o as getWindowsWmicExePath, r as getWindowsPowerShellExePath } from "./windows-install-roots-DYABQcWw.js";
import { t as splitArgsPreservingQuotes } from "./arg-split-CR3xkHmb.js";
import { r as parseWindowsNetstatListeners } from "./ports-netstat-B8TW8-Bx.js";
import { spawnSync } from "node:child_process";
import { hostname } from "node:os";
import { randomUUID } from "node:crypto";
//#region src/infra/gateway-owner-lease.ts
const gatewayOwnerKey = {
	scope: "gateway-owner",
	key: "global"
};
const log = createSubsystemLogger("gateway");
function parseSupervisor(value) {
	if (value === null) return null;
	if (!isRecord(value) || value.kind !== "launchd" && value.kind !== "systemd" && value.kind !== "schtasks" && value.kind !== "external" || value.name !== null && (typeof value.name !== "string" || !value.name.trim())) throw new Error("Gateway owner lease supervisor could not be verified");
	return {
		kind: value.kind,
		name: value.name
	};
}
/** Read through the caller's admitted connection when ownership guards a write. */
function readGatewayOwnerLeaseFromDatabase(db, port) {
	if (!tableExists(db, "state_leases")) return;
	const row = readAssistantStateLease(db, gatewayOwnerKey);
	if (!row) return;
	const processOwner = parseStateLeaseProcessOwner(row.payloadJson);
	let payload;
	try {
		payload = row.payloadJson ? JSON.parse(row.payloadJson) : null;
	} catch {
		payload = null;
	}
	if (!processOwner || !isRecord(payload) || typeof payload.port !== "number" || !Number.isInteger(payload.port) || payload.port <= 0 || payload.port > 65535 || payload.mode !== "foreground" && payload.mode !== "supervised") throw new Error("Gateway owner lease identity could not be verified");
	if (port !== void 0 && payload.port !== port) return;
	const supervisor = parseSupervisor(payload.supervisor);
	if (payload.mode === "foreground" !== (supervisor === null)) throw new Error("Gateway owner lease supervisor does not match its listener mode");
	return {
		...processOwner,
		owner: row.owner,
		port: payload.port,
		mode: payload.mode,
		supervisor,
		state: readStateLeaseProcessOwnerStatus(processOwner),
		expired: row.expiresAt === null || row.expiresAt <= Date.now()
	};
}
function readGatewayOwnerLease(params = {}) {
	const operation = ({ db }) => readGatewayOwnerLeaseFromDatabase(db, params.port);
	return params.current || params.openStateSchemaReadAdmission ? withExistingAssistantStateDatabaseCurrentReadOnly(operation, { env: params.env }, params.openStateSchemaReadAdmission) : withExistingAssistantStateDatabaseReadOnly(operation, { env: params.env });
}
/** Publish only while the caller holds the Gateway lifecycle coordinator. */
function acquireGatewayOwnerLease(params) {
	const env = params.env ?? process.env;
	const databasePath = resolveAssistantStateSqlitePath(env);
	const identity = {
		...gatewayOwnerKey,
		owner: params.owner ?? randomUUID()
	};
	const processOwner = {
		pid: process.pid,
		host: hostname(),
		startedAt: getFileLockProcessStartTime(process.pid, env) ?? getFileLockProcessStartTime(process.pid, env)
	};
	const payloadJson = JSON.stringify({
		owner: processOwner,
		port: params.port,
		mode: params.mode,
		supervisor: params.supervisor
	});
	const expiresAt = withAssistantStateStartupMigrationCheckpointDatabase((db) => runSqliteImmediateTransactionSync(db, () => {
		assertAssistantStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		reclaimDeadAssistantStateLeaseInTransaction(db, identity);
		const acquired = acquireAssistantStateLeaseInTransaction(db, identity, STARTUP_MIGRATION_LEASE_TTL_MS, payloadJson);
		if (acquired.kind === "held") throw new Error("Another Gateway owner lease is still active for this state directory");
		return acquired.expiresAt;
	}), {
		env,
		path: databasePath
	});
	const releaseRow = () => withAssistantStateStartupMigrationCheckpointDatabase((db) => runSqliteImmediateTransactionSync(db, () => {
		assertAssistantStateWriteAllowed({
			database: db,
			databasePath,
			env
		});
		releaseAssistantStateLeaseInTransaction(db, identity);
	}), {
		env,
		path: databasePath
	});
	let heartbeat;
	let constructionFailure;
	let warned = false;
	const ready = (async () => {
		try {
			heartbeat = startAssistantStateLeaseHeartbeat({
				path: databasePath,
				existingOnly: true,
				identity,
				leaseMs: STARTUP_MIGRATION_LEASE_TTL_MS,
				acquiredAt: expiresAt - STARTUP_MIGRATION_LEASE_TTL_MS,
				expiresAt,
				heartbeatMs: 3e4,
				...processOwner.startedAt === null ? { processOwner: {
					identity: processOwner,
					env: resolveDiagnosticProcessEnv(env)
				} } : {},
				onLost: () => {
					if (!warned) {
						warned = true;
						log.warn("Gateway owner lease heartbeat stopped; process identity remains recorded");
					}
				}
			});
		} catch (error) {
			constructionFailure = { error };
			throw error;
		}
		await heartbeat.ready;
	})();
	let released = false;
	return {
		owner: identity.owner,
		ready,
		async release() {
			if (released) return;
			if (constructionFailure) throw new Error("Gateway owner heartbeat cleanup could not be confirmed", { cause: constructionFailure.error });
			await heartbeat?.stop();
			releaseRow();
			released = true;
		}
	};
}
//#endregion
//#region src/infra/windows-port-pids.ts
const DEFAULT_TIMEOUT_MS = 5e3;
function readListeningPidsViaPowerShell(port, timeoutMs) {
	const ps = spawnSync(getWindowsPowerShellExePath(), [
		"-NoProfile",
		"-Command",
		`(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess)`
	], {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (ps.error || ps.status !== 0) return null;
	return ps.stdout.split(/\r?\n/).flatMap((line) => parseStrictPositiveInteger(line.trim()) ?? []);
}
function parseListeningPidsFromNetstat(stdout, port) {
	return [...new Set(parseWindowsNetstatListeners(stdout, port).map((listener) => listener.pid))];
}
function readWindowsListeningPidsOnPortSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const result = readWindowsListeningPidsResultSync(port, timeoutMs);
	return result.ok ? result.pids : [];
}
function readWindowsListeningPidsResultSync(port, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const powershellPids = readListeningPidsViaPowerShell(port, timeoutMs);
	if (powershellPids != null) return {
		ok: true,
		pids: powershellPids
	};
	const netstat = spawnSync(getWindowsSystem32ExePath("netstat.exe"), ["-ano"], {
		env: resolveDiagnosticProcessEnv(),
		encoding: "utf8",
		timeout: timeoutMs,
		windowsHide: true
	});
	if (netstat.error) {
		const code = netstat.error.code;
		return {
			ok: false,
			permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
		};
	}
	if (netstat.status !== 0) return {
		ok: false,
		permanent: false
	};
	return {
		ok: true,
		pids: parseListeningPidsFromNetstat(netstat.stdout, port)
	};
}
function extractWindowsCommandLine(raw) {
	const lines = normalizeStringEntries(decodeWindowsProcessOutput(raw).split(/\r?\n/));
	for (const line of lines) {
		if (!normalizeLowercaseStringOrEmpty(line).startsWith("commandline=")) continue;
		return line.slice(12).trim() || null;
	}
	return lines.find((line) => normalizeLowercaseStringOrEmpty(line) !== "commandline") ?? null;
}
function readWindowsProcessArgsSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS, env = process.env, deadlineMs) {
	const result = readWindowsProcessArgsResultSync(pid, timeoutMs, env, deadlineMs);
	return result.ok ? result.args : null;
}
function readWindowsProcessArgsResultSync(pid, timeoutMs = DEFAULT_TIMEOUT_MS, env = process.env, deadlineMs) {
	const remainingTimeoutMs = () => deadlineMs === void 0 ? timeoutMs : Math.min(timeoutMs, Math.max(0, Math.ceil(deadlineMs - performance.now())));
	if (remainingTimeoutMs() <= 0) return {
		ok: false,
		permanent: false
	};
	const powershellPath = getWindowsPowerShellExePath(env, deadlineMs);
	const powershellTimeoutMs = remainingTimeoutMs();
	if (powershellTimeoutMs <= 0) return {
		ok: false,
		permanent: false
	};
	const powershell = spawnSync(powershellPath, [
		"-NoProfile",
		"-Command",
		`(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`
	], {
		env: resolveDiagnosticProcessEnv(env),
		encoding: "utf8",
		timeout: powershellTimeoutMs,
		windowsHide: true
	});
	if (!powershell.error && powershell.status === 0) {
		const command = powershell.stdout.trim();
		return {
			ok: true,
			args: command ? splitArgsPreservingQuotes(command, { escapeMode: "backslash-quote-only" }) : null
		};
	}
	if (remainingTimeoutMs() <= 0) return {
		ok: false,
		permanent: false
	};
	const wmicPath = getWindowsWmicExePath(env, deadlineMs);
	const wmicTimeoutMs = remainingTimeoutMs();
	if (wmicTimeoutMs <= 0) return {
		ok: false,
		permanent: false
	};
	const wmic = spawnSync(wmicPath, [
		"process",
		"where",
		`ProcessId=${pid}`,
		"get",
		"CommandLine",
		"/value"
	], {
		env: resolveDiagnosticProcessEnv(env),
		timeout: wmicTimeoutMs,
		windowsHide: true,
		stdio: [
			"ignore",
			"pipe",
			"ignore"
		]
	});
	if (!wmic.error && wmic.status === 0) {
		const command = extractWindowsCommandLine(wmic.stdout);
		return {
			ok: true,
			args: command ? splitArgsPreservingQuotes(command, { escapeMode: "backslash-quote-only" }) : null
		};
	}
	const code = (wmic.error ?? powershell.error)?.code;
	return {
		ok: false,
		permanent: code === "ENOENT" || code === "EACCES" || code === "EPERM"
	};
}
//#endregion
export { acquireGatewayOwnerLease as a, readWindowsProcessArgsSync as i, readWindowsListeningPidsResultSync as n, readGatewayOwnerLease as o, readWindowsProcessArgsResultSync as r, readGatewayOwnerLeaseFromDatabase as s, readWindowsListeningPidsOnPortSync as t };
