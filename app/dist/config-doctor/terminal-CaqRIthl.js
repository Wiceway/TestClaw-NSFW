import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-_nFH9T9d.js";
import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { t as withSince } from "./since-DH6SNo1_.js";
import "./src-D9uQ497Z.js";
import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-AulM0PZ6.js";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.js";
import { i as allowsProcessHomeSessionScan } from "./paths-DeOFr7iP.js";
import "./errors-cp9Var1Z.js";
import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { Bs as SessionCatalogLocatorSchema } from "./validator-registry-Dpl5QmuY.js";
import { t as lazyCompile } from "./protocol-validator-Bso29gFX.js";
import { a as isCanonicalTerminalUploadBase64, n as MAX_TERMINAL_UPLOAD_BASE64_LENGTH, r as MAX_TERMINAL_UPLOAD_BYTES, t as BoundedBuffer } from "./bounded-buffer-CWK1ZFaH.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-cU98pfB6.js";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRl7Rrsc.js";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.js";
import { d as resolveSessionWorkStartError } from "./lifecycle-DpcRUIUy.js";
import { h as NODE_TERMINAL_UPLOAD_COMMAND, i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS } from "./node-commands-BLhGKTZa.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-D1CEhJWf.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DlmWzvmc.js";
import "./session-utils-DyRtmfj4.js";
import { t as assertValidParams } from "./validation-BZLpfukT.js";
import { t as applyPluginNodeInvokePolicy } from "./node-invoke-plugin-policy-Bw86SNJt.js";
import { n as resolveSessionCatalogProvider } from "./session-catalog-q5ZCR7V4.js";
import { r as resolveTerminalSpawnPlan, t as buildTerminalEnv } from "./launch-BPw8MJSf.js";
import { n as surrogateSafeTail } from "./output-ring-C3yWkMoO.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/terminal.ts
const TerminalDimension = Type.Integer({
	minimum: 1,
	maximum: 2e3
});
/** Opens a shell session; the server picks the shell, cwd, and confinement. */
const TerminalOpenParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	catalog: Type.Optional(SessionCatalogLocatorSchema),
	cols: TerminalDimension,
	rows: TerminalDimension
});
closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	title: Type.Optional(NonEmptyString)
});
/** Writes client keystrokes to the session stdin. */
const TerminalInputParamsSchema = closedObject({
	sessionId: NonEmptyString,
	data: Type.String()
});
/** Stages one file on the host bound to an existing terminal session. */
const TerminalUploadParamsSchema = closedObject({
	sessionId: NonEmptyString,
	name: Type.String({
		minLength: 1,
		maxLength: 255
	}),
	contentBase64: Type.String({ maxLength: MAX_TERMINAL_UPLOAD_BASE64_LENGTH })
});
/** Absolute temporary path pasted into the active terminal after upload. */
const TerminalUploadResultSchema = closedObject({
	path: NonEmptyString,
	size: Type.Integer({
		minimum: 0,
		maximum: MAX_TERMINAL_UPLOAD_BYTES
	}),
	/** Explicit path insertion contract for a native CLI rather than a shell. */
	uploadPathStyle: Type.Optional(Type.Literal("native"))
});
/** Resizes the PTY grid after the client viewport changes. */
const TerminalResizeParamsSchema = closedObject({
	sessionId: NonEmptyString,
	cols: TerminalDimension,
	rows: TerminalDimension
});
/** Closes a connection-owned session or detaches from an agent-owned session. */
const TerminalCloseParamsSchema = closedObject({ sessionId: NonEmptyString });
/**
* Attaches the calling admin connection. Connection-owned sessions use
* take-over; agent-owned sessions retain ownership and add a shared viewer.
*/
const TerminalAttachParamsSchema = closedObject({ sessionId: NonEmptyString });
closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	title: Type.Optional(NonEmptyString),
	owner: Type.Optional(Type.Union([Type.Literal("conn"), Type.String({ pattern: "^agent:.+" })])),
	buffer: Type.String(),
	seq: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** One attachable session, as reported by terminal.list. */
const TerminalSessionInfoSchema = closedObject({
	sessionId: NonEmptyString,
	agentId: NonEmptyString,
	shell: NonEmptyString,
	title: Type.Optional(NonEmptyString),
	cwd: NonEmptyString,
	confined: Type.Boolean(),
	/** False while the session is detached (no connection owns its stream). */
	attached: Type.Boolean(),
	/** Connection-owned session, or the trusted agent session key that owns it. */
	owner: Type.Optional(Type.Union([Type.Literal("conn"), Type.String({ pattern: "^agent:.+" })])),
	createdAtMs: Type.Integer({ minimum: 0 })
});
closedObject({ sessions: Type.Array(TerminalSessionInfoSchema) });
closedObject({ ok: Type.Boolean() });
/** Streamed output chunk; seq is its cumulative UTF-16 end offset within the session. */
const TerminalDataEventSchema = withSince("2026.7", closedObject({
	sessionId: NonEmptyString,
	seq: Type.Integer({ minimum: 0 }),
	data: Type.String()
}));
/** Terminal end-of-life notice; the session id is invalid after this event. */
const TerminalExitEventSchema = withSince("2026.7", closedObject({
	sessionId: NonEmptyString,
	exitCode: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	signal: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
	reason: Type.Optional(Type.Union([
		Type.Literal("process_exit"),
		Type.Literal("closed"),
		Type.Literal("disconnected"),
		Type.Literal("detached"),
		Type.Literal("error")
	])),
	error: Type.Optional(Type.String())
}));
withSince("2026.7", Type.Union([TerminalDataEventSchema, TerminalExitEventSchema]));
//#endregion
//#region packages/gateway-protocol/src/terminal-validators.ts
const validateTerminalOpenParams = /* @__PURE__ */ lazyCompile(TerminalOpenParamsSchema);
const validateTerminalInputParams = /* @__PURE__ */ lazyCompile(TerminalInputParamsSchema);
const validateTerminalResizeParams = /* @__PURE__ */ lazyCompile(TerminalResizeParamsSchema);
const validateTerminalCloseParams = /* @__PURE__ */ lazyCompile(TerminalCloseParamsSchema);
const validateTerminalAttachParams = /* @__PURE__ */ lazyCompile(TerminalAttachParamsSchema);
const validateTerminalUploadParams = /* @__PURE__ */ lazyCompile(TerminalUploadParamsSchema);
const validateTerminalUploadResult = /* @__PURE__ */ lazyCompile(TerminalUploadResultSchema);
//#endregion
//#region src/gateway/terminal/node-relay.ts
const DATA_INPUT_CHUNK_BYTES = 2048;
const MAX_PENDING_DATA_CHARS = 524288;
function parseExit(result) {
	if (!result.ok) return { error: `${result.error?.code ?? "NODE_INVOKE_FAILED"}: ${result.error?.message ?? "node terminal invoke failed"}` };
	try {
		const raw = result.payloadJSON ?? (result.payload === void 0 ? void 0 : JSON.stringify(result.payload));
		if (!raw) return { exitCode: 0 };
		const value = JSON.parse(raw);
		if (!value || typeof value !== "object" || Array.isArray(value)) return { exitCode: 0 };
		const record = value;
		return {
			...typeof record.exitCode === "number" ? { exitCode: record.exitCode } : {},
			...typeof record.signal === "number" ? { signal: record.signal } : {}
		};
	} catch {
		return { error: "node terminal returned an invalid exit result" };
	}
}
async function createNodeRelayBackend(params) {
	let resolveDispatchReady;
	const dispatchReady = new Promise((resolve) => {
		resolveDispatchReady = resolve;
	});
	let dataCallback;
	let exitCallback;
	const pendingData = new BoundedBuffer(MAX_PENDING_DATA_CHARS, {
		mode: "drop-oldest",
		fit: surrogateSafeTail
	}, (chunk) => chunk.length);
	let pendingExit;
	const abort = new AbortController();
	const result = params.registry.invoke({
		nodeId: params.nodeId,
		expectedConnId: params.expectedConnId,
		...params.expectedPairingGeneration ? { expectedPairingGeneration: params.expectedPairingGeneration } : {},
		isDispatchAuthorized: params.isDispatchAuthorized,
		command: params.command,
		params: params.params,
		timeoutMs: 0,
		idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
		signal: abort.signal,
		onDispatchReady: resolveDispatchReady,
		onProgress: (chunk) => {
			if (!chunk) return;
			if (dataCallback) dataCallback(chunk);
			else pendingData.push(chunk);
		}
	}).then(parseExit).catch((error) => ({ error: error instanceof Error ? error.message : String(error) })).then((exit) => {
		if (exitCallback) exitCallback(exit);
		else pendingExit = exit;
		return exit;
	});
	const activeInvokeId = await Promise.race([dispatchReady, result.then((exit) => {
		throw new Error(exit.error ?? "failed to start node terminal invoke");
	})]);
	const send = (payload) => params.registry.sendInvokeInput(activeInvokeId, payload);
	return {
		write(data) {
			for (let offset = 0; offset < data.length;) {
				const head = data.slice(offset, offset + DATA_INPUT_CHUNK_BYTES);
				const chunk = head.slice(0, truncateUtf8Prefix(head, DATA_INPUT_CHUNK_BYTES).length);
				send({
					kind: "data",
					data: chunk
				});
				offset += chunk.length;
			}
		},
		resize(cols, rows) {
			send({
				kind: "resize",
				cols,
				rows
			});
		},
		pause() {},
		resume() {},
		kill() {
			abort.abort();
		},
		onData(callback) {
			dataCallback = callback;
			for (const chunk of pendingData.drain()) callback(chunk);
		},
		onExit(callback) {
			exitCallback = callback;
			if (pendingExit) {
				const exit = pendingExit;
				pendingExit = void 0;
				callback(exit);
			}
		}
	};
}
//#endregion
//#region src/gateway/terminal/open-deadline.ts
const TERMINAL_OPEN_DEADLINE_MS = 3e4;
var TerminalOpenDeadlineError = class extends Error {
	constructor() {
		super("terminal open timed out");
		this.name = "TerminalOpenDeadlineError";
	}
};
function createTerminalOpenDeadline() {
	return {
		expiresAtMs: Date.now() + TERMINAL_OPEN_DEADLINE_MS,
		controller: new AbortController()
	};
}
function expireTerminalOpenDeadline(deadline) {
	if (!deadline.controller.signal.aborted) deadline.controller.abort(new TerminalOpenDeadlineError());
	return toErrorObject(deadline.controller.signal.reason, "Terminal open timed out");
}
async function waitForTerminalOpenDeadline(run, deadline) {
	if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) throw expireTerminalOpenDeadline(deadline);
	return await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timer);
			reject(expireTerminalOpenDeadline(deadline));
		};
		const timer = setTimeout(() => expireTerminalOpenDeadline(deadline), Math.max(0, deadline.expiresAtMs - Date.now()));
		deadline.controller.signal.addEventListener("abort", onAbort, { once: true });
		let promise;
		try {
			promise = run();
		} catch (error) {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
			return;
		}
		promise.then((value) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			if (deadline.controller.signal.aborted || Date.now() >= deadline.expiresAtMs) {
				expireTerminalOpenDeadline(deadline);
				return;
			}
			clearTimeout(timer);
			deadline.controller.signal.removeEventListener("abort", onAbort);
			reject(toErrorObject(error, "Terminal open failed"));
		});
	});
}
//#endregion
//#region src/gateway/server-methods/terminal-open-plan.ts
function authorizeTerminalNodeCommand(context, nodeId, command) {
	const node = context.nodeRegistry.get(nodeId);
	if (!node) return {
		ok: false,
		message: "terminal node is not connected"
	};
	if (!node.commands.includes(command)) return {
		ok: false,
		message: "terminal node command is not available"
	};
	const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
		...node,
		approvedCommands: node.commands
	});
	const allowed = isNodeCommandAllowed({
		command,
		declaredCommands: node.commands,
		allowlist
	});
	return allowed.ok ? {
		ok: true,
		node
	} : {
		ok: false,
		message: allowed.reason
	};
}
function authorizeCatalogTerminalNode(context, plan) {
	return authorizeTerminalNodeCommand(context, plan.nodeId, plan.command);
}
function resolveTerminalOpenSpawnPlan(launchPlan, catalogPlan) {
	if (!catalogPlan) return resolveTerminalSpawnPlan(launchPlan);
	if (catalogPlan.kind === "local") return resolveTerminalSpawnPlan({
		...launchPlan,
		initialCommand: catalogPlan.argv,
		cwdOverride: catalogPlan.cwd
	});
	return {
		agentId: launchPlan.agentId,
		cwd: catalogPlan.cwd ?? launchPlan.cwd,
		shell: catalogPlan.title ?? catalogPlan.command,
		args: []
	};
}
//#endregion
//#region src/gateway/server-methods/terminal-upload.ts
function invalid$1(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
const terminalUploadHandlers = { "terminal.upload": async (opts) => {
	const { params, respond, context } = opts;
	if (!assertValidParams(params, validateTerminalUploadParams, "terminal.upload", respond)) return;
	const connId = opts.client?.connId;
	if (!connId) {
		invalid$1(respond, "terminal requires an authenticated connection");
		return;
	}
	const p = params;
	if (!isCanonicalTerminalUploadBase64(p.contentBase64)) {
		invalid$1(respond, "invalid terminal.upload base64 content");
		return;
	}
	if (!context.terminalSessions || !context.isTerminalEnabled()) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
		return;
	}
	try {
		const result = await context.terminalSessions.upload(connId, p.sessionId, {
			name: p.name,
			contentBase64: p.contentBase64
		});
		if (!result) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		respond(true, {
			path: result.path,
			size: result.size,
			...result.uploadPathStyle && hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_UPLOAD_PATH_STYLE) ? { uploadPathStyle: result.uploadPathStyle } : {}
		});
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "terminal upload failed"));
	}
} };
//#endregion
//#region src/gateway/server-methods/terminal.ts
function invalid(respond, detail) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, detail));
}
function requireConnId(opts) {
	const connId = opts.client?.connId;
	if (!connId) {
		invalid(opts.respond, "terminal requires an authenticated connection");
		return null;
	}
	return connId;
}
function terminalEnabled(context) {
	return context.isTerminalEnabled();
}
function terminalFailureMessage(message, hint) {
	return hint ? `${message}; ${hint}` : message;
}
function respondTerminalUnavailable(respond, message, hint) {
	respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage(message, hint)));
}
function parseNodePayload(payload, payloadJSON) {
	if (!payloadJSON) return payload;
	return safeParseJson(payloadJSON);
}
async function stageNodeTerminalUpload(context, nodeId, file) {
	const access = authorizeTerminalNodeCommand(context, nodeId, NODE_TERMINAL_UPLOAD_COMMAND);
	if (!access.ok) throw new Error(access.message);
	const result = await context.nodeRegistry.invoke({
		nodeId,
		expectedConnId: access.node.connId,
		...access.node.pairingGeneration ? { expectedPairingGeneration: access.node.pairingGeneration } : {},
		command: NODE_TERMINAL_UPLOAD_COMMAND,
		params: file,
		timeoutMs: 12e4
	});
	if (!result.ok) throw new Error(result.error?.message ?? "terminal node upload failed");
	const payload = parseNodePayload(result.payload, result.payloadJSON);
	if (!validateTerminalUploadResult(payload)) throw new Error("terminal node returned an invalid upload result");
	const uploaded = payload;
	return {
		path: uploaded.path,
		size: uploaded.size
	};
}
function respondLaunchBlocked(respond, block, hint) {
	if (block.kind === "disabled") {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("terminal is disabled", hint)));
		return;
	}
	if (block.kind === "unknown-agent") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, terminalFailureMessage(`unknown agent "${block.agentId}"`, hint)));
		return;
	}
	if (block.kind === "owner-required") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, terminalFailureMessage(block.message, hint)));
		return;
	}
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, terminalFailureMessage(`terminal unavailable: agent "${block.agentId}" runs in a sandbox (mode "${block.mode}"); in-sandbox terminals are not supported yet`, hint)));
}
const CATALOG_TERMINAL_INITIAL_SIZE = {
	cols: 80,
	rows: 24
};
/** Canonical terminal admission and launch path shared by shell, resume, and start RPCs. */
async function openTerminalSession(opts, request) {
	const { respond, context } = opts;
	const connId = requireConnId(opts);
	if (!connId) return;
	const manager = context.terminalSessions;
	if (!manager) {
		respondTerminalUnavailable(respond, "terminal is not available", request.failureHint);
		return;
	}
	const launch = context.resolveTerminalLaunchPolicy(request.agentId);
	if (!launch.ok) {
		respondLaunchBlocked(respond, launch.block, request.failureHint);
		return;
	}
	const deadline = createTerminalOpenDeadline();
	let catalogPlan;
	let title;
	let createBackend;
	let nodeRelay;
	let stageUpload;
	if (request.resolveCatalogPlan) {
		const resolveCatalogPlan = request.resolveCatalogPlan;
		try {
			catalogPlan = await waitForTerminalOpenDeadline(() => resolveCatalogPlan(launch.plan.agentId), deadline);
		} catch (error) {
			if (error instanceof TerminalOpenDeadlineError) {
				respondTerminalUnavailable(respond, "terminal open timed out", request.failureHint);
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? terminalFailureMessage(error.message, request.failureHint) : terminalFailureMessage(request.catalogFailureMessage ?? "catalog terminal open failed", request.failureHint)));
			return;
		}
		title = catalogPlan.title;
		if (catalogPlan.kind === "local") {
			if (catalogPlan.argv.length === 0) {
				invalid(respond, terminalFailureMessage("catalog terminal plan has no command", request.failureHint));
				return;
			}
		} else {
			const nodeCatalogPlan = catalogPlan;
			if (nodeCatalogPlan.uploadPathStyle !== void 0 && nodeCatalogPlan.uploadPathStyle !== "native") {
				invalid(respond, "catalog terminal plan has an unsupported upload path style");
				return;
			}
			const uploadNodeId = nodeCatalogPlan.nodeId;
			const uploadPathStyle = nodeCatalogPlan.uploadPathStyle;
			const access = authorizeCatalogTerminalNode(context, nodeCatalogPlan);
			if (!access.ok) {
				respondTerminalUnavailable(respond, access.message, request.failureHint);
				return;
			}
			let nodeParams;
			try {
				const parsed = JSON.parse(catalogPlan.paramsJSON);
				if (!isRecord(parsed)) throw new Error("invalid params");
				nodeParams = {
					...parsed,
					cols: request.cols,
					rows: request.rows
				};
			} catch {
				invalid(respond, terminalFailureMessage("catalog terminal plan has invalid params", request.failureHint));
				return;
			}
			nodeRelay = {
				plan: nodeCatalogPlan,
				params: nodeParams,
				connId: access.node.connId,
				pairingGeneration: access.node.pairingGeneration
			};
			let policyResult;
			try {
				policyResult = await waitForTerminalOpenDeadline(() => applyPluginNodeInvokePolicy({
					context,
					client: opts.client,
					nodeSession: access.node,
					command: nodeCatalogPlan.command,
					params: nodeParams
				}), deadline);
			} catch (error) {
				if (error instanceof TerminalOpenDeadlineError) {
					respondTerminalUnavailable(respond, "terminal open timed out", request.failureHint);
					return;
				}
				throw error;
			}
			if (policyResult && !policyResult.ok) {
				respondTerminalUnavailable(respond, policyResult.message, request.failureHint);
				return;
			}
			stageUpload = async (file) => ({
				...await stageNodeTerminalUpload(context, uploadNodeId, file),
				...uploadPathStyle ? { uploadPathStyle } : {}
			});
		}
	}
	if (context.isConnectionActive?.(connId) === false) {
		respondTerminalUnavailable(respond, "terminal connection closed", request.failureHint);
		return;
	}
	if (request.requireCliAgents && context.getRuntimeConfig().gateway?.cliAgents?.enabled === false) {
		invalid(respond, "CLI agent terminal start is disabled; enable gateway.cliAgents.enabled and retry");
		return;
	}
	if (!terminalEnabled(context)) {
		respondTerminalUnavailable(respond, "terminal is disabled", request.failureHint);
		return;
	}
	const refreshedLaunch = context.resolveTerminalLaunchPolicy(request.agentId);
	if (!refreshedLaunch.ok) {
		respondLaunchBlocked(respond, refreshedLaunch.block, request.failureHint);
		return;
	}
	let agentOwner;
	if (request.sessionKey) {
		const runtimeConfig = context.getRuntimeConfig();
		const requestedOwner = resolveRequestedSessionAgentId(runtimeConfig, request.sessionKey, refreshedLaunch.plan.agentId);
		if (!requestedOwner.ok) {
			respond(false, void 0, requestedOwner.error);
			return;
		}
		const agentSessionKey = resolveStoredSessionKeyForAgentStore({
			cfg: runtimeConfig,
			agentId: requestedOwner.agentId,
			sessionKey: request.sessionKey
		});
		const { entry } = loadGatewaySessionEntryReadOnly(agentSessionKey, {
			agentId: requestedOwner.agentId,
			clone: false
		});
		const agentSessionId = entry?.sessionId?.trim();
		if (!agentSessionId) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, terminalFailureMessage("session is no longer available; refresh and retry", request.failureHint)));
			return;
		}
		const readinessError = resolveSessionWorkStartError(agentSessionKey, entry);
		if (readinessError) {
			invalid(respond, terminalFailureMessage(readinessError, request.failureHint));
			return;
		}
		agentOwner = {
			kind: "agent",
			agentSessionKey,
			agentSessionId,
			agentId: requestedOwner.agentId
		};
	}
	if (nodeRelay) {
		const relay = nodeRelay;
		const access = authorizeCatalogTerminalNode(context, relay.plan);
		if (!access.ok) {
			respondTerminalUnavailable(respond, access.message, request.failureHint);
			return;
		}
		if (access.node.connId !== relay.connId || access.node.pairingGeneration !== relay.pairingGeneration) {
			invalid(respond, "terminal node connection changed; refresh the host and retry");
			return;
		}
		createBackend = async () => await createNodeRelayBackend({
			registry: context.nodeRegistry,
			nodeId: relay.plan.nodeId,
			expectedConnId: access.node.connId,
			expectedPairingGeneration: access.node.pairingGeneration,
			isDispatchAuthorized: () => context.isConnectionActive?.(connId) !== false && terminalEnabled(context) && (!request.requireCliAgents || context.getRuntimeConfig().gateway?.cliAgents?.enabled !== false) && context.resolveTerminalLaunchPolicy(refreshedLaunch.plan.agentId).ok && authorizeCatalogTerminalNode(context, relay.plan).ok && !deadline.controller.signal.aborted && Date.now() < deadline.expiresAtMs,
			command: relay.plan.command,
			params: relay.params
		});
	}
	const spawnPlan = resolveTerminalOpenSpawnPlan(refreshedLaunch.plan, catalogPlan);
	if (request.requiredCwd !== void 0 && spawnPlan.cwd !== request.requiredCwd) {
		invalid(respond, terminalFailureMessage("cwd is no longer available; recreate or choose the worktree and retry", request.failureHint));
		return;
	}
	const terminalEnv = catalogPlan?.kind === "local" ? mergeProcessEnv([
		buildTerminalEnv(process.env),
		catalogPlan.env,
		catalogPlan.pathEnv ? { PATH: catalogPlan.pathEnv } : void 0
	]) : buildTerminalEnv(process.env);
	const closeOpenedSession = (sessionId) => agentOwner ? manager.closeAgent(agentOwner, sessionId) : manager.close(connId, sessionId);
	let openingTerminal;
	let outcome;
	try {
		outcome = await waitForTerminalOpenDeadline(() => {
			openingTerminal = manager.open({
				owner: agentOwner ?? {
					kind: "conn",
					connId
				},
				...agentOwner ? { viewerConnId: connId } : {},
				agentId: spawnPlan.agentId,
				cwd: spawnPlan.cwd,
				shell: spawnPlan.shell,
				...title ? { title } : {},
				args: spawnPlan.args,
				cols: request.cols,
				rows: request.rows,
				env: terminalEnv,
				signal: deadline.controller.signal,
				...createBackend ? { createBackend } : {},
				...stageUpload ? { stageUpload } : {}
			});
			return openingTerminal;
		}, deadline);
	} catch (error) {
		if (error instanceof TerminalOpenDeadlineError) {
			if (openingTerminal) openingTerminal.then((lateOutcome) => {
				if (lateOutcome.ok) closeOpenedSession(lateOutcome.sessionId);
			}, () => void 0);
			respondTerminalUnavailable(respond, "terminal open timed out", request.failureHint);
			return;
		}
		throw error;
	}
	if (!outcome.ok) {
		const code = outcome.code === "limit" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE;
		respond(false, void 0, errorShape(code, terminalFailureMessage(outcome.message, request.failureHint)));
		return;
	}
	if (context.isConnectionActive?.(connId) === false) {
		closeOpenedSession(outcome.sessionId);
		respondTerminalUnavailable(respond, "terminal connection closed", request.failureHint);
		return;
	}
	context.logGateway.info(`terminal opened session=${outcome.sessionId} agent=${outcome.agentId} conn=${connId} shell=${outcome.shell}`);
	respond(true, {
		sessionId: outcome.sessionId,
		agentId: outcome.agentId,
		shell: outcome.shell,
		cwd: outcome.cwd,
		confined: false,
		...title ? { title } : {}
	});
}
/** Handlers for the operator terminal method family. */
const terminalHandlers = {
	...terminalUploadHandlers,
	"terminal.open": async (opts) => {
		const { params, respond } = opts;
		if (!assertValidParams(params, validateTerminalOpenParams, "terminal.open", respond)) return;
		const p = params;
		let resolveCatalogPlan;
		if (p.catalog) {
			const provider = resolveSessionCatalogProvider(p.catalog.catalogId);
			if (!provider) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${p.catalog.catalogId}`));
				return;
			}
			if (!provider.openTerminal) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session catalog cannot open terminals"));
				return;
			}
			const openTerminal = provider.openTerminal;
			const catalog = p.catalog;
			resolveCatalogPlan = async (agentId) => await openTerminal.call(provider, {
				allowProcessHomeFallback: allowsProcessHomeSessionScan(),
				agentId,
				hostId: catalog.hostId,
				threadId: catalog.threadId,
				...catalog.sourceHomeId ? { sourceHomeId: catalog.sourceHomeId } : {}
			});
		}
		await openTerminalSession(opts, {
			...p.agentId ? { agentId: p.agentId } : {},
			...p.sessionKey ? { sessionKey: p.sessionKey } : {},
			cols: p.cols,
			rows: p.rows,
			...resolveCatalogPlan ? { resolveCatalogPlan } : {},
			catalogFailureMessage: "catalog terminal open failed"
		});
	},
	"terminal.input": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalInputParams, "terminal.input", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.write(connId, p.sessionId, p.data) ?? false });
	},
	"terminal.resize": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalResizeParams, "terminal.resize", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!terminalEnabled(context)) {
			context.terminalSessions?.close(connId, p.sessionId);
			respond(true, { ok: false });
			return;
		}
		respond(true, { ok: context.terminalSessions?.resize(connId, p.sessionId, p.cols, p.rows) ?? false });
	},
	"terminal.close": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalCloseParams, "terminal.close", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		respond(true, { ok: context.terminalSessions?.close(connId, p.sessionId) ?? false });
	},
	"terminal.attach": async (opts) => {
		const { params, respond, context } = opts;
		if (!assertValidParams(params, validateTerminalAttachParams, "terminal.attach", respond)) return;
		const connId = requireConnId(opts);
		if (!connId) return;
		const p = params;
		if (!context.terminalSessions || !terminalEnabled(context)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "terminal is not available"));
			return;
		}
		const attached = context.terminalSessions.attach(connId, p.sessionId);
		if (!attached) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown terminal session "${p.sessionId}"`));
			return;
		}
		context.logGateway.info(`terminal attached session=${attached.sessionId} agent=${attached.agentId} conn=${connId}`);
		const supportsOffsetSeq = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_OFFSET_SEQ);
		const supportsMetadata = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_SESSION_METADATA);
		respond(true, {
			sessionId: attached.sessionId,
			agentId: attached.agentId,
			shell: attached.shell,
			...supportsMetadata ? {
				owner: attached.owner,
				...attached.title ? { title: attached.title } : {}
			} : {},
			cwd: attached.cwd,
			confined: false,
			buffer: attached.buffer,
			...supportsOffsetSeq ? { seq: attached.seq } : {}
		});
	},
	"terminal.list": async (opts) => {
		const { respond, context } = opts;
		if (!requireConnId(opts)) return;
		const supportsMetadata = hasGatewayClientCap(opts.client?.connect?.caps, GATEWAY_CLIENT_CAPS.TERMINAL_SESSION_METADATA);
		respond(true, { sessions: context.terminalSessions && terminalEnabled(context) ? context.terminalSessions.list().map((session) => ({
			sessionId: session.sessionId,
			agentId: session.agentId,
			shell: session.shell,
			title: supportsMetadata ? session.title : void 0,
			cwd: session.cwd,
			confined: false,
			attached: session.attached,
			owner: session.owner,
			createdAtMs: session.createdAtMs
		})) : [] });
	}
};
//#endregion
export { CATALOG_TERMINAL_INITIAL_SIZE, openTerminalSession, terminalHandlers };
