import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { g as registerAssistantStateDatabaseLifecycleListener, h as registerAssistantStateDatabaseAsyncResource } from "./testclaw-state-db-cache-BxGqhkwE.js";
import { s as resolveAssistantStateSqlitePath } from "./testclaw-state-db.paths-qkMAjTSx.js";
import { n as getActiveAssistantStateDatabaseReadSnapshot, t as executeExistingAssistantStateRead } from "./testclaw-state-db-readonly-mjFl_Qah.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as createAsyncLock } from "./json-files-DAp75qfY.js";
import { t as sessionChanges } from "./session-row-changes-DN0Dk-5R.js";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.js";
import { n as reserveWorkerEnvironmentNativePublication } from "./store-native-publication-CBjzYlTV.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/device-pairing-card-renderer.ts
let pairedCardRendererCache;
function invalidatePairedCardRendererCache() {
	pairedCardRendererCache = void 0;
}
/** The pairing publication owner invalidates this projection after committed mutations. */
function readPairedCardRendererCache(stateDir, load) {
	if (pairedCardRendererCache?.stateDir !== stateDir) pairedCardRendererCache = {
		stateDir,
		value: load()
	};
	return pairedCardRendererCache.value;
}
//#endregion
//#region src/infra/device-pairing-lock.ts
const owner = resolveGlobalSingleton(Symbol.for("testclaw.devicePairingLock"), () => ({
	lock: createAsyncLock(),
	current: new AsyncLocalStorage()
}));
/** Domain facades and their broker adapter share one admission interval. */
async function withDevicePairingLock(operate) {
	if (owner.current.getStore()?.active) return operate();
	return owner.lock(async () => {
		const scope = { active: true };
		try {
			return await owner.current.run(scope, operate);
		} finally {
			scope.active = false;
		}
	});
}
//#endregion
//#region src/infra/device-pairing-publication.ts
const publications = resolveGlobalSingleton(Symbol.for("testclaw.devicePairingPublications"), () => {
	const state = /* @__PURE__ */ new Map();
	registerAssistantStateDatabaseAsyncResource({
		phase: "after-resources",
		async close(identity) {
			for (const [path, publication] of state) if (!identity || publication.identity === identity.key || publication.canonicalPath === identity.canonicalPath) state.delete(path);
		}
	});
	registerAssistantStateDatabaseLifecycleListener((event) => {
		if (event.kind === "opened") return;
		for (const [path, publication] of state) if (path === event.path || publication.identity === event.identity?.key) state.delete(path);
	});
	return state;
});
function captureDevicePairingPublication(admission) {
	const path = admission.databasePath;
	const { identity } = admission;
	let publication = publications.get(identity.key) ?? publications.get(identity.canonicalPath);
	if (publication && publication.identity !== identity.key) {
		for (const [alias, current] of publications) if (current === publication) publications.delete(alias);
		publication = void 0;
	}
	if (!publication) publication = {
		identity: identity.key,
		canonicalPath: identity.canonicalPath,
		epoch: 0,
		blocked: false,
		complete: false,
		rows: /* @__PURE__ */ new Map(),
		pending: /* @__PURE__ */ new Set()
	};
	publications.set(path, publication);
	publications.set(identity.canonicalPath, publication);
	publications.set(identity.key, publication);
	const captured = publication;
	const epoch = captured.epoch;
	const install = (rows) => {
		for (const row of rows) captured.rows.set(row.deviceId, row.binding ? { ...row.binding } : null);
	};
	return {
		isCurrent: () => publications.get(path) === captured && captured.epoch === epoch && !captured.mutation,
		completeRevision: () => !captured.blocked && captured.complete ? captured.revision : void 0,
		fail() {
			if (publications.get(path) === captured && captured.epoch === epoch) captured.blocked = true;
		},
		publish(revision, rows, complete = false) {
			if (publications.get(path) !== captured || captured.epoch !== epoch || captured.mutation) return false;
			if (!rows) {
				if (captured.revision !== revision || !captured.complete) throw new Error("Pairing publication cannot reuse an unknown revision");
				captured.blocked = false;
				return true;
			}
			if (captured.revision !== revision) captured.epoch++;
			if (complete || captured.revision !== revision) {
				captured.rows.clear();
				captured.complete = false;
			}
			captured.revision = revision;
			install(rows);
			captured.complete ||= complete;
			captured.blocked = false;
			return true;
		},
		beginMutation() {
			captured.epoch++;
			captured.blocked = true;
			const mutation = {};
			captured.mutation = mutation;
			return {
				publish(receipt) {
					if (publications.get(path) !== captured || captured.mutation !== mutation) return;
					if (receipt.beforeRevision !== captured.revision) {
						captured.complete = false;
						captured.rows.clear();
					}
					install(receipt.changed);
					captured.revision = receipt.revision;
					captured.blocked = false;
					captured.mutation = void 0;
					captured.epoch++;
				},
				finish(settled) {
					if (settled && captured.mutation === mutation) {
						captured.mutation = void 0;
						captured.epoch++;
					}
				}
			};
		},
		servicePending(service) {
			captured.pending.add(service);
			return () => captured.pending.delete(service);
		}
	};
}
/** Unknown facts suppress use without declaring an otherwise live node revoked. */
function getPublishedPairedDeviceBinding(deviceId, baseDir) {
	const path = resolveAssistantStateSqlitePath(baseDir ? {
		...process.env,
		TESTCLAW_STATE_DIR: baseDir
	} : process.env);
	const publication = publications.get(path);
	for (const service of publication?.pending ?? []) service();
	if (!publication || publication.blocked || !publication.complete && !publication.rows.has(deviceId)) throw new Error("Device pairing authority requires a current worker publication");
	const binding = publication.rows.get(deviceId);
	return binding ? { ...binding } : null;
}
//#endregion
//#region src/infra/device-pairing-store-readonly.ts
async function readPairing(command, baseDir, current = false) {
	const options = baseDir ? { env: {
		...process.env,
		TESTCLAW_STATE_DIR: baseDir
	} } : {};
	const context = captureAssistantStateWorkerContext(options);
	const selected = {
		path: context.admission.databasePath,
		env: context.environment
	};
	const snapshot = current ? void 0 : getActiveAssistantStateDatabaseReadSnapshot(selected);
	const read = async () => {
		const publication = captureDevicePairingPublication(context.admission);
		let reply;
		try {
			reply = await executeExistingAssistantStateRead(selected, command.type === "devicePairing.list" && !snapshot ? {
				...command,
				publishedRevision: publication.completeRevision()
			} : command, { current });
		} catch (error) {
			if (!snapshot) publication.fail();
			throw error;
		}
		context.admission.assertCurrent();
		if (snapshot) return { reply };
		if (!publication.isCurrent()) return;
		if (reply?.ok && "bindings" in reply) publication.publish(reply.revision, reply.bindings, reply.type === "devicePairing.list");
		else if (!reply) publication.publish("missing", [], true);
		return { reply };
	};
	const observed = await read();
	if (observed) return observed.reply;
	return withDevicePairingLock(async () => {
		const refreshed = await read();
		if (!refreshed) throw new Error("Device pairing read publication was replaced");
		return refreshed.reply;
	});
}
/** Readers never create, migrate, or synchronously open the shared database. */
async function listDevicePairingStoreRecordsReadOnly(baseDir, current = false) {
	const reply = await readPairing({
		type: "devicePairing.list",
		nowMs: Date.now()
	}, baseDir, current);
	if (!reply) return {
		pending: [],
		paired: []
	};
	if (!reply.ok || reply.type !== "devicePairing.list") throw new Error("Unexpected pairing list reply");
	return reply.list;
}
async function loadPairedDevicePairingStoreRecordReadOnly(deviceId, baseDir) {
	const reply = await readPairing({
		type: "devicePairing.lookup",
		deviceId: deviceId.trim()
	}, baseDir, true);
	if (!reply) return null;
	if (!reply.ok || reply.type !== "devicePairing.lookup") throw new Error("Unexpected pairing lookup reply");
	return reply.device;
}
async function loadPendingDevicePairingStoreRecordReadOnly(requestId, baseDir) {
	const reply = await readPairing({
		type: "devicePairing.pending",
		requestId,
		nowMs: Date.now()
	}, baseDir, true);
	if (!reply) return null;
	if (!reply.ok || reply.type !== "devicePairing.pending") throw new Error("Unexpected pending pairing reply");
	return reply.pending;
}
async function loadBoundDeviceBootstrapContextReadOnly(input, baseDir) {
	const reply = await readPairing({
		type: "devicePairing.bootstrapContext",
		input
	}, baseDir, true);
	if (!reply) return null;
	if (!reply.ok || reply.type !== "devicePairing.bootstrapContext") throw new Error("Unexpected bootstrap context reply");
	return reply.context;
}
//#endregion
//#region src/infra/device-pairing-worker.ts
const DevicePairingAuthorityRefusedError = resolveGlobalSingleton(Symbol.for("testclaw.devicePairingAuthorityRefusedError"), () => class extends Error {
	constructor(message = "Device pairing authority changed") {
		super(message);
	}
});
function admissionFacts(value) {
	if (!Array.isArray(value) || !value.every((entry) => isRecord(entry) && typeof entry.kind === "string")) throw new Error("Invalid pairing admission facts");
	return value;
}
function commitReceipt(value) {
	if (!isRecord(value) || value.kind !== "devicePairing" || typeof value.beforeRevision !== "string" || typeof value.revision !== "string" || !Array.isArray(value.changed) || !value.changed.every((entry) => isRecord(entry) && typeof entry.deviceId === "string" && (entry.binding === null || isRecord(entry.binding) && typeof entry.binding.identity === "string" && (entry.binding.generation === void 0 || typeof entry.binding.generation === "string")))) throw new Error("Invalid pairing commit receipt");
	let tokensReplaced;
	if (value.tokensReplaced !== void 0) {
		const replaced = value.tokensReplaced;
		if (!isRecord(replaced) || typeof replaced.deviceId !== "string" || !Array.isArray(replaced.roles) || !replaced.roles.every((role) => typeof role === "string")) throw new Error("Invalid pairing token replacement receipt");
		tokensReplaced = {
			deviceId: replaced.deviceId,
			roles: replaced.roles
		};
	}
	let workerEnvironment;
	if (value.workerEnvironment !== void 0) {
		const environment = value.workerEnvironment;
		if (!isRecord(environment) || typeof environment.environmentId !== "string" || typeof environment.nodeDeviceId !== "string" || typeof environment.updatedAtMs !== "number") throw new Error("Invalid pairing worker-environment receipt");
		workerEnvironment = {
			environmentId: environment.environmentId,
			nodeDeviceId: environment.nodeDeviceId,
			updatedAtMs: environment.updatedAtMs
		};
	}
	return {
		kind: "devicePairing",
		beforeRevision: value.beforeRevision,
		revision: value.revision,
		...tokensReplaced ? { tokensReplaced } : {},
		...workerEnvironment ? { workerEnvironment } : {},
		changed: value.changed.map((entry) => ({
			deviceId: entry.deviceId,
			binding: entry.binding === null ? null : {
				identity: entry.binding.identity,
				...entry.binding.generation === void 0 ? {} : { generation: entry.binding.generation }
			}
		}))
	};
}
function executeDevicePairingMutation(command, options = {}) {
	const context = captureAssistantStateWorkerContext(options.baseDir ? { env: {
		...process.env,
		TESTCLAW_STATE_DIR: options.baseDir
	} } : {});
	const captured = structuredClone(command);
	return withDevicePairingLock(async () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
		const publication = captureDevicePairingPublication(context.admission);
		const mutation = publication.beginMutation();
		let admission;
		let published = false;
		let publishEnvironment;
		const install = () => {
			const committed = admission?.committed;
			if (committed && !published) {
				const receipt = commitReceipt(committed.facts);
				const environment = receipt.workerEnvironment;
				let environmentPublished = false;
				if (environment && publishEnvironment) {
					context.admission.assertCurrent();
					environmentPublished = publishEnvironment(environment.environmentId, {
						nodeDeviceId: environment.nodeDeviceId,
						updatedAtMs: environment.updatedAtMs
					});
				}
				mutation.publish(receipt);
				invalidatePairedCardRendererCache();
				published = true;
				if (environmentPublished) sessionChanges.emit({
					all: true,
					scope: "worker-environments"
				});
				if (receipt.tokensReplaced) options.onTokensReplaced?.(receipt.tokensReplaced.deviceId, receipt.tokensReplaced.roles);
			}
		};
		const removeService = publication.servicePending(install);
		try {
			return await runAssistantStateWorkerOperation(context, async (scope) => {
				try {
					return await scope.execute(captured);
				} finally {
					install();
				}
			}, {
				assertCurrent: options.assertCurrent,
				createAdmission: () => {
					let committed = false;
					admission = createSqliteWorkerOperationAdmission((request, grant) => {
						if (committed || request.stage !== "transaction" && request.stage !== "commit") throw new Error("Pairing admission requested out of order");
						context.admission.assertCurrent();
						options.assertCurrent?.();
						for (const facts of admissionFacts(request.facts)) options.admit?.(facts);
						if (request.stage === "commit" && captured.type === "bootstrap.consume") publishEnvironment = reserveWorkerEnvironmentNativePublication(context.admission.identity);
						if (!grant()) throw new DevicePairingAuthorityRefusedError();
						committed = request.stage === "commit";
					});
					return {
						admission,
						nativeLocations: [context.admission.databasePath]
					};
				}
			});
		} finally {
			try {
				install();
			} finally {
				mutation.finish(!admission || admission.settlement?.kind === "completed");
				removeService();
			}
		}
	});
}
/** Start the privileged effect in the same interval that publishes its pairing facts. */
async function withCurrentDevicePairingSnapshot(baseDir, prepare) {
	return (await withDevicePairingLock(async () => {
		const { paired } = await listDevicePairingStoreRecordsReadOnly(baseDir, true);
		return { value: prepare(paired)?.start() };
	})).value;
}
//#endregion
//#region src/shared/device-bootstrap-profile.ts
/** Operator scopes allowed to cross the short-lived bootstrap handoff boundary. */
const BOOTSTRAP_HANDOFF_OPERATOR_SCOPES = [
	"operator.approvals",
	"operator.questions",
	"operator.read",
	"operator.talk.secrets",
	"operator.write"
];
const BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET = new Set(BOOTSTRAP_HANDOFF_OPERATOR_SCOPES);
/** Full browser-owner scopes allowed only by the host-issued Control UI profile. */
const CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES = [
	"operator.admin",
	"operator.approvals",
	"operator.pairing",
	"operator.questions",
	"operator.read",
	"operator.talk.secrets",
	"operator.write"
];
const CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPE_SET = new Set(CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES);
/** Full native-mobile operator scopes allowed only by the closed mobile setup profile. */
const MOBILE_FULL_ACCESS_OPERATOR_SCOPES = ["operator.admin", ...BOOTSTRAP_HANDOFF_OPERATOR_SCOPES];
const MOBILE_FULL_ACCESS_OPERATOR_SCOPE_SET = new Set(MOBILE_FULL_ACCESS_OPERATOR_SCOPES);
const VOICE_NODE_OPERATOR_SCOPE_SET = /* @__PURE__ */ new Set(["operator.read", "operator.talk"]);
/** Existing least-privilege setup-code/QR profile. */
const PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: [...BOOTSTRAP_HANDOFF_OPERATOR_SCOPES]
};
/** Full browser-owner profile issued only by dashboard and graphical onboarding. */
const CONTROL_UI_OWNER_BOOTSTRAP_PROFILE = {
	roles: ["operator"],
	scopes: [...CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES],
	purpose: "control-ui-owner"
};
/** Full native-mobile setup profile for explicitly authorized setup surfaces. */
const FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: [...MOBILE_FULL_ACCESS_OPERATOR_SCOPES],
	purpose: "mobile-full"
};
/** Node-only setup profile for companions that never act as operators. */
const NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node"],
	scopes: []
};
/** Environment-owned node profile removed when its cloud lease is released. */
const CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node"],
	scopes: [],
	purpose: "cloud-worker"
};
/** Room/embedded voice profile: node capabilities plus least-privilege Talk RPCs. */
const VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: ["operator.read", "operator.talk"],
	purpose: "voice-node"
};
/** Compare normalized bootstrap profiles, including their closed purpose. */
function deviceBootstrapProfilesEqual(left, right) {
	const profile = normalizeDeviceBootstrapProfile(left);
	const expected = normalizeDeviceBootstrapProfile(right);
	return profile.purpose === expected.purpose && profile.roles.length === expected.roles.length && profile.scopes.length === expected.scopes.length && profile.roles.every((role, index) => role === expected.roles[index]) && profile.scopes.every((scope, index) => scope === expected.scopes[index]);
}
function matchesBootstrapProfile(input, expected) {
	return deviceBootstrapProfilesEqual(input, expected);
}
/** Return whether an input matches either supported native-mobile setup profile. */
function isMobilePairingSetupBootstrapProfile(input) {
	return isPairingSetupBootstrapProfile(input) || matchesBootstrapProfile(input, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Return whether an input exactly matches the existing limited setup profile. */
function isPairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Return whether an input exactly matches the node-only companion setup profile. */
function isNodePairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE) || matchesBootstrapProfile(input, CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
function resolvePairingSetupAccess(input) {
	if (deviceBootstrapProfilesEqual(input, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE)) return "full";
	if (deviceBootstrapProfilesEqual(input, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE) || deviceBootstrapProfilesEqual(input, CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE)) return "node";
	return "limited";
}
/** Return whether an input exactly matches the embedded voice-node setup profile. */
function isVoiceNodePairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Resolve the subset of requested scopes a bootstrap profile may carry for one role. */
function resolveBootstrapProfileScopesForRole(role, scopes, purpose) {
	const normalizedRole = normalizeDeviceAuthRole(role);
	const normalizedScopes = normalizeDeviceAuthScopes(Array.from(scopes));
	if (normalizedRole === "operator") {
		const allowedScopes = purpose === "control-ui-owner" ? CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPE_SET : purpose === "mobile-full" ? MOBILE_FULL_ACCESS_OPERATOR_SCOPE_SET : purpose === "voice-node" ? VOICE_NODE_OPERATOR_SCOPE_SET : BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET;
		return normalizedScopes.filter((scope) => allowedScopes.has(scope));
	}
	return [];
}
/** Resolve bounded bootstrap handoff scopes across a role set. */
function resolveBootstrapProfileScopesForRoles(roles, scopes, purpose) {
	return normalizeDeviceAuthScopes(roles.flatMap((role) => resolveBootstrapProfileScopesForRole(role, scopes, purpose)));
}
/** Normalize a requested bootstrap profile and strip scopes outside the handoff allowlist. */
function normalizeDeviceBootstrapHandoffProfile(input) {
	const profile = normalizeDeviceBootstrapProfile(input);
	return {
		roles: profile.roles,
		scopes: resolveBootstrapProfileScopesForRoles(profile.roles, profile.scopes, profile.purpose),
		...profile.purpose ? { purpose: profile.purpose } : {}
	};
}
function normalizeBootstrapRoles(roles) {
	if (!Array.isArray(roles)) return [];
	const out = /* @__PURE__ */ new Set();
	for (const role of roles) {
		const normalized = normalizeDeviceAuthRole(role);
		if (normalized) out.add(normalized);
	}
	return [...out].toSorted();
}
/** Normalize caller-provided bootstrap roles/scopes without applying handoff bounds. */
function normalizeDeviceBootstrapProfile(input) {
	const purpose = input?.purpose === "control-ui" || input?.purpose === "control-ui-owner" || input?.purpose === "mobile-full" || input?.purpose === "voice-node" || input?.purpose === "cloud-worker" ? input.purpose : void 0;
	return {
		roles: normalizeBootstrapRoles(input?.roles),
		scopes: normalizeDeviceAuthScopes(input?.scopes ? [...input.scopes] : []),
		...purpose ? { purpose } : {}
	};
}
//#endregion
export { loadPendingDevicePairingStoreRecordReadOnly as C, readPairedCardRendererCache as D, invalidatePairedCardRendererCache as E, loadPairedDevicePairingStoreRecordReadOnly as S, withDevicePairingLock as T, DevicePairingAuthorityRefusedError as _, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE as a, listDevicePairingStoreRecordsReadOnly as b, deviceBootstrapProfilesEqual as c, isVoiceNodePairingSetupBootstrapProfile as d, normalizeDeviceBootstrapHandoffProfile as f, resolvePairingSetupAccess as g, resolveBootstrapProfileScopesForRoles as h, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE as i, isMobilePairingSetupBootstrapProfile as l, resolveBootstrapProfileScopesForRole as m, CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE as n, PAIRING_SETUP_BOOTSTRAP_PROFILE as o, normalizeDeviceBootstrapProfile as p, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE as r, VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE as s, BOOTSTRAP_HANDOFF_OPERATOR_SCOPES as t, isNodePairingSetupBootstrapProfile as u, executeDevicePairingMutation as v, getPublishedPairedDeviceBinding as w, loadBoundDeviceBootstrapContextReadOnly as x, withCurrentDevicePairingSnapshot as y };
