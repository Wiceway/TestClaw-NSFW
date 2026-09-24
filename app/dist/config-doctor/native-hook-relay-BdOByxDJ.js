import { h as readNonEmptyStringPreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import "./src-D9uQ497Z.js";
import { T as resolveExpiresAtMsFromDurationMs } from "./number-coercion-0M4tZV2c.js";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.js";
import "./testclaw-root-QV2nsx8w.js";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.js";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import "./testclaw-state-db.paths-qkMAjTSx.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-CvUcH_7-.js";
import "./tool-policy-BFaYCu9H.js";
import "./sqlite-worker-operation-admission-D_Uo1AJB.js";
import { i as runAssistantStateWorkerOperation } from "./testclaw-state-worker-store-BMVEu7e2.js";
import { t as ErrorCodes } from "./gateway-error-details-D4L8ZwC-.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { G as cancelDeferredPluginToolApproval, rt as PluginApprovalResolutions, y as runBeforeToolCallHook } from "./agent-tools.before-tool-call-BwZqazXs.js";
import "./hooks-CL-Rsbd9.js";
import "./hook-runner-global-B45lHO9j.js";
import { t as formatMcpCodexApprovalRemedy } from "./mcp-codex-tool-approval-qr5rrC7E.js";
import { r as listAgentToolResultMiddlewares } from "./agent-tool-result-middleware-C01MXKqc.js";
import { i as payloadTextResult } from "./common-Bkl7CqHm.js";
import { t as callGatewayTool } from "./gateway-DSMADMfF.js";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-DagGnkHf.js";
import "./host-private-capabilities-DVuDNROK.js";
import { r as runAgentHarnessBeforeAgentFinalizeHook } from "./lifecycle-hook-helpers-Bw4F3UwX.js";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-CEsyMmW9.js";
import "./tool-loop-detection-config-DBQPRU0c.js";
import { t as isApprovalNotFoundError } from "./approval-errors-Bzw_-cAg.js";
import { c as prepareSystemRunMutableFileBinding, u as revalidateSystemRunMutableFileBinding } from "./system-run-approval-binding-CMOqhQeA.js";
import { a as readNativeHookRelayProvider, c as shellQuoteArgs, i as readNativeHookRelayEvent, l as snapshotNativeHookRelayPayload, n as isJsonValue, o as readNonEmptyString, r as normalizePositiveInteger, s as readOptionalBoolean, t as isJsonObject, u as truncateRelayText } from "./native-hook-relay-utils-B2WeXDW7.js";
import { n as formatNativeHookRelayApprovalPresentation } from "./native-hook-relay-approval-presentation-CIUIYNF1.js";
import "./exec-approvals-mcp-_J1mGbQ9.js";
import { a as codexNativeHookRelayResponseCodec, t as NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR } from "./native-hook-relay-client-DXyNelWq.js";
import "node:fs";
import "node:path";
import { createHash } from "node:crypto";
import "node:http";
//#region src/agents/harness/native-hook-relay-state.ts
const NATIVE_HOOK_RELAY_STATE_SYMBOL = Symbol.for("testclaw.nativeHookRelay.state");
function getNativeHookRelaySharedState() {
	const globalRecord = globalThis;
	globalRecord[NATIVE_HOOK_RELAY_STATE_SYMBOL] ??= {
		relays: /* @__PURE__ */ new Map(),
		relayBridges: /* @__PURE__ */ new Map(),
		pendingOperations: /* @__PURE__ */ new Set(),
		invocations: [],
		pendingPermissionApprovals: /* @__PURE__ */ new Map(),
		pendingPreToolUseApprovals: /* @__PURE__ */ new Map(),
		permissionApprovalWindows: /* @__PURE__ */ new Map(),
		permissionAllowAlwaysApprovals: /* @__PURE__ */ new Map()
	};
	return globalRecord[NATIVE_HOOK_RELAY_STATE_SYMBOL];
}
const nativeHookRelayState = getNativeHookRelaySharedState();
//#endregion
//#region src/agents/harness/native-hook-relay-store.ts
async function deleteNativeHookRelayBridgeRecordIfOwned(params) {
	const context = captureAssistantStateWorkerContext({ path: params.stateDbPath });
	const input = {
		relayId: params.relayId,
		pid: params.pid,
		token: params.token
	};
	return runAssistantStateWorkerOperation(context, (scope) => scope.execute({
		type: "nativeHookRelay.deleteOwned",
		input
	}));
}
//#endregion
//#region src/agents/harness/native-hook-relay-bridge.ts
const log$2 = createSubsystemLogger("agents/harness/native-hook-relay");
const { relays: relays$2, relayBridges: relayBridges$1, pendingOperations } = nativeHookRelayState;
function retainNativeHookRelayOperation(relayId, operation) {
	pendingOperations.add(operation);
	operation.then(() => pendingOperations.delete(operation), (error) => {
		pendingOperations.delete(operation);
		log$2.debug("native hook relay operation failed", {
			error,
			relayId
		});
	});
}
function unregisterNativeHookRelayBridge(relayId, options) {
	const bridge = options?.expectedBridge ?? relayBridges$1.get(relayId);
	if (!bridge) return;
	if (bridge.closing) return bridge.closing;
	if (relayBridges$1.get(relayId) === bridge) relayBridges$1.delete(relayId);
	if (!bridge.server.listening) bridge.cancelStartup();
	bridge.closing = bridge.pending.catch(() => void 0).then(async () => {
		try {
			await deleteNativeHookRelayBridgeRecordIfOwned({
				...bridge,
				pid: process.pid
			});
		} finally {
			const deferListenerCloseMs = normalizePositiveInteger(options?.deferListenerCloseMs, 0);
			if (deferListenerCloseMs > 0) await new Promise((resolve) => {
				setTimeout(resolve, deferListenerCloseMs).unref();
			});
			await new Promise((resolve, reject) => {
				bridge.server.close((error) => {
					if (error && !hasErrnoCode(error, "ERR_SERVER_NOT_RUNNING")) reject(error);
					else resolve();
				});
			});
		}
	});
	bridge.pending = bridge.closing;
	retainNativeHookRelayOperation(bridge.relayId, bridge.closing);
	return bridge.closing;
}
//#endregion
//#region src/agents/harness/native-hook-relay-codec.ts
const CODEX_NATIVE_HOOK_TOOL_NAME_ALIASES = {
	exec_command: "exec",
	write: "apply_patch",
	edit: "apply_patch",
	agent: "spawn_agent"
};
const nativeHookRelayProviderAdapters = { codex: {
	normalizeMetadata: normalizeCodexHookMetadata,
	readToolInput: readCodexToolInput,
	readToolResponse: readCodexToolResponse,
	...codexNativeHookRelayResponseCodec,
	renderBeforeAgentFinalizeReviseResponse: (reason) => ({
		stdout: `${JSON.stringify({
			decision: "block",
			reason
		})}\n`,
		stderr: "",
		exitCode: 0
	}),
	renderBeforeAgentFinalizeStopResponse: (reason) => ({
		stdout: `${JSON.stringify({
			continue: false,
			...reason?.trim() ? { stopReason: reason.trim() } : {}
		})}\n`,
		stderr: "",
		exitCode: 0
	})
} };
function getNativeHookRelayProviderAdapter(provider) {
	return nativeHookRelayProviderAdapters[provider];
}
function normalizeNativeHookInvocation(params) {
	const metadata = getNativeHookRelayProviderAdapter(params.registration.provider).normalizeMetadata(params.rawPayload);
	return {
		provider: params.registration.provider,
		relayId: params.registration.relayId,
		event: params.event,
		...metadata,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId,
		rawPayload: params.rawPayload,
		receivedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function normalizeCodexHookMetadata(rawPayload) {
	const payload = isJsonObject(rawPayload) ? rawPayload : {};
	const metadata = {};
	const nativeEventName = readNonEmptyStringPreservingWhitespace(payload.hook_event_name);
	if (nativeEventName) metadata.nativeEventName = nativeEventName;
	const cwd = readNonEmptyStringPreservingWhitespace(payload.cwd);
	if (cwd) metadata.cwd = cwd;
	const model = readNonEmptyStringPreservingWhitespace(payload.model);
	if (model) metadata.model = model;
	const turnId = readNonEmptyStringPreservingWhitespace(payload.turn_id);
	if (turnId) metadata.turnId = turnId;
	const transcriptPath = readNonEmptyStringPreservingWhitespace(payload.transcript_path);
	if (transcriptPath) metadata.transcriptPath = transcriptPath;
	const permissionMode = readNonEmptyStringPreservingWhitespace(payload.permission_mode);
	if (permissionMode) metadata.permissionMode = permissionMode;
	const stopHookActive = readOptionalBoolean(payload.stop_hook_active);
	if (stopHookActive !== void 0) metadata.stopHookActive = stopHookActive;
	const lastAssistantMessage = readNonEmptyStringPreservingWhitespace(payload.last_assistant_message);
	if (lastAssistantMessage) metadata.lastAssistantMessage = lastAssistantMessage;
	const toolName = readNonEmptyStringPreservingWhitespace(payload.tool_name);
	if (toolName) metadata.toolName = toolName;
	const toolUseId = readNonEmptyStringPreservingWhitespace(payload.tool_use_id);
	if (toolUseId) metadata.toolUseId = toolUseId;
	return metadata;
}
function readCodexToolInput(rawPayload) {
	const payload = isJsonObject(rawPayload) ? rawPayload : {};
	const toolInput = payload.tool_input;
	if (isJsonObject(toolInput)) return normalizeCodexToolInput(normalizeNativeHookToolName(readNonEmptyStringPreservingWhitespace(payload.tool_name)), toolInput);
	if (toolInput === void 0) return {};
	return { value: toolInput };
}
function normalizeCodexToolInput(toolName, toolInput) {
	const command = normalizeCodexCommand(toolInput.cmd);
	if (toolName !== "exec" || command === void 0) return toolInput;
	return {
		...toolInput,
		command
	};
}
function normalizeCodexCommand(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value) && value.every((part) => typeof part === "string")) return shellQuoteArgs(value);
}
function nativeHookRelayParamsWereRewritten(originalFingerprint, candidate) {
	if (candidate === void 0) return false;
	return stableStringify(candidate) !== originalFingerprint;
}
function readCodexToolResponse(rawPayload) {
	return (isJsonObject(rawPayload) ? rawPayload : {}).tool_response;
}
function readNativeHookRelayApprovalMode(rawPayload) {
	return (isJsonObject(rawPayload) ? rawPayload : {}).testclaw_approval_mode === "report" ? "report" : void 0;
}
function normalizeNativeHookToolName(toolName) {
	const normalized = normalizeToolPolicyName(toolName ?? "tool");
	return CODEX_NATIVE_HOOK_TOOL_NAME_ALIASES[normalized] ?? normalized;
}
//#endregion
//#region src/agents/harness/native-hook-relay-permissions.ts
const DEFAULT_PERMISSION_TIMEOUT_MS = 12e4;
const PERMISSION_ALLOW_ALWAYS_TTL_MS = 18e5;
const MAX_PERMISSION_FALLBACK_KEYS = 200;
const MAX_PERMISSION_FALLBACK_KEY_CHARS = 240;
const MAX_PERMISSION_FINGERPRINT_SORT_KEYS = 200;
const MAX_PERMISSION_APPROVALS_PER_WINDOW = 12;
const PERMISSION_APPROVAL_WINDOW_MS = 6e4;
const MAX_PERMISSION_ALLOW_ALWAYS_ENTRIES = 512;
const log$1 = createSubsystemLogger("agents/harness/native-hook-relay");
const NATIVE_SHELL_APPROVAL_TOOLS = /* @__PURE__ */ new Set([
	"bash",
	"exec",
	"exec_command",
	"shell",
	"shell_command"
]);
const { pendingPermissionApprovals, pendingPreToolUseApprovals, permissionApprovalWindows, permissionAllowAlwaysApprovals } = nativeHookRelayState;
let nativeHookRelayPermissionApprovalRequester = requestNativeHookRelayPermissionApproval;
function nativeHookRelayPreToolUseApprovalKey(params) {
	const toolUseId = params.toolUseId?.trim();
	return toolUseId ? JSON.stringify([params.relayId, toolUseId]) : void 0;
}
function setNativeHookRelayPreToolUseApproval(params) {
	const key = nativeHookRelayPreToolUseApprovalKey(params);
	if (!key) return false;
	const previousApproval = pendingPreToolUseApprovals.get(key);
	pendingPreToolUseApprovals.set(key, {
		relayId: params.relayId,
		deferredApproval: params.deferredApproval,
		originalParamsFingerprint: params.originalParamsFingerprint
	});
	let evictedApproval;
	if (pendingPreToolUseApprovals.size > 200) {
		const oldestKey = pendingPreToolUseApprovals.keys().next().value;
		if (oldestKey) {
			evictedApproval = pendingPreToolUseApprovals.get(oldestKey);
			pendingPreToolUseApprovals.delete(oldestKey);
		}
	}
	if (previousApproval) cancelDeferredPluginToolApproval(previousApproval.deferredApproval);
	if (evictedApproval) cancelDeferredPluginToolApproval(evictedApproval.deferredApproval);
	return true;
}
function detachNativeHookRelayApprovalState(relayId) {
	const preToolUseApprovals = [];
	for (const [key, approval] of pendingPreToolUseApprovals) if (approval.relayId === relayId) {
		pendingPreToolUseApprovals.delete(key);
		preToolUseApprovals.push(approval);
	}
	const permissionApprovals = detachNativeHookRelayPermissionState(relayId);
	return () => {
		for (const approval of preToolUseApprovals) cancelDeferredPluginToolApproval(approval.deferredApproval);
		for (const approval of permissionApprovals) approval.controller.abort();
	};
}
async function runNativeHookRelayPermissionRequest(params) {
	const mcpToolName = params.invocation.toolName?.startsWith("mcp__") ? params.invocation.toolName : void 0;
	if (mcpToolName && params.registration.deferMcpToolApprovals) return params.adapter.renderNoopResponse(params.invocation.event);
	const request = {
		provider: params.registration.provider,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId,
		toolName: mcpToolName ?? normalizeNativeHookToolName(params.invocation.toolName),
		...params.invocation.toolUseId ? { toolCallId: params.invocation.toolUseId } : {},
		...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
		...params.invocation.model ? { model: params.invocation.model } : {},
		toolInput: params.adapter.readToolInput(params.invocation.rawPayload),
		...params.registration.signal ? { signal: params.registration.signal } : {}
	};
	const mcpServerName = /^mcp__(.+?)__/.exec(request.toolName)?.[1];
	const mutableFileBinding = await prepareNativeHookMutableFileBinding(request);
	params.registration.assertActive?.();
	if (!mutableFileBinding.ok) return params.adapter.renderPermissionDecisionResponse("deny", mutableFileBinding.message);
	const approvalKey = nativeHookRelayPermissionApprovalKey({
		registration: params.registration,
		request,
		binding: mutableFileBinding.binding
	});
	const allowAlwaysKey = nativeHookRelayPermissionAllowAlwaysKey({
		registration: params.registration,
		request,
		binding: mutableFileBinding.binding
	});
	if (hasNativeHookRelayPermissionAllowAlways(allowAlwaysKey)) {
		params.registration.assertActive?.();
		if (mutableFileBinding.binding) {
			const current = await revalidateSystemRunMutableFileBinding({
				binding: mutableFileBinding.binding,
				cwd: request.cwd
			});
			params.registration.assertActive?.();
			if (!current.ok) return params.adapter.renderPermissionDecisionResponse("deny", current.message);
		}
		return params.adapter.renderPermissionDecisionResponse("allow");
	}
	try {
		const decision = await waitForNativeHookRelayPermissionApproval({
			registration: params.registration,
			approvalKey,
			request
		});
		params.registration.assertActive?.();
		if ((decision === "allow" || decision === "allow-always") && mutableFileBinding.binding) {
			const current = await revalidateSystemRunMutableFileBinding({
				binding: mutableFileBinding.binding,
				cwd: request.cwd
			});
			params.registration.assertActive?.();
			if (!current.ok) return params.adapter.renderPermissionDecisionResponse("deny", current.message);
		}
		if (decision === "allow") return params.adapter.renderPermissionDecisionResponse("allow");
		if (decision === "allow-always") {
			rememberNativeHookRelayPermissionAllowAlways({
				key: allowAlwaysKey,
				relayId: params.registration.relayId,
				mcpTool: mcpToolName !== void 0
			});
			return params.adapter.renderPermissionDecisionResponse("allow");
		}
		if (decision === "deny" || decision === "timed-out" && mcpToolName) {
			const reason = decision === "deny" ? "Denied by user" : "MCP tool approval timed out";
			return params.adapter.renderPermissionDecisionResponse("deny", mcpToolName ? `${reason}. ${formatMcpCodexApprovalRemedy(mcpServerName)}` : reason);
		}
	} catch (error) {
		params.registration.assertActive?.();
		log$1.warn(`native hook permission approval failed; deferring to provider approval path: ${String(error)}`);
	}
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function waitForNativeHookRelayPermissionApproval(params) {
	let approval = pendingPermissionApprovals.get(params.approvalKey);
	if (!approval) {
		if (!consumeNativeHookRelayPermissionBudget(params.registration.relayId)) {
			log$1.warn(`native hook permission approval rate limit exceeded; deferring to provider approval path: relay=${params.registration.relayId} run=${params.registration.runId}`);
			return "defer";
		}
		const controller = new AbortController();
		const pending = {
			relayId: params.registration.relayId,
			controller,
			waiters: 0,
			cancelWhenUnobserved: params.registration.approvalHost !== void 0,
			promise: racePromiseWithAbortSignal(Promise.resolve().then(() => {
				controller.signal.throwIfAborted();
				const request = {
					...params.request,
					signal: controller.signal
				};
				return params.registration.approvalHost ? requestNativeHookRelayPermissionApproval(request, params.registration.approvalHost) : nativeHookRelayPermissionApprovalRequester(request);
			}), controller.signal).finally(() => {
				if (pendingPermissionApprovals.get(params.approvalKey) === pending) pendingPermissionApprovals.delete(params.approvalKey);
			})
		};
		pendingPermissionApprovals.set(params.approvalKey, pending);
		approval = pending;
	}
	approval.waiters++;
	try {
		return await racePromiseWithAbortSignal(approval.promise, params.registration.signal);
	} finally {
		approval.waiters--;
		if (approval.cancelWhenUnobserved && approval.waiters === 0 && pendingPermissionApprovals.get(params.approvalKey) === approval) {
			pendingPermissionApprovals.delete(params.approvalKey);
			approval.controller.abort();
		}
	}
}
function nativeHookRelayPermissionApprovalKey(params) {
	return JSON.stringify([
		params.registration.relayId,
		params.registration.runId,
		params.request.toolCallId ? ["call", params.request.toolCallId] : ["fallback", permissionRequestFallbackKey(params.request)],
		permissionRequestContentFingerprint(params.request),
		params.binding ? permissionRequestBindingFingerprint(params.binding) : "no-file-binding"
	]);
}
async function prepareNativeHookMutableFileBinding(request) {
	if (!NATIVE_SHELL_APPROVAL_TOOLS.has(request.toolName.trim().toLowerCase())) return { ok: true };
	const command = readNonEmptyStringPreservingWhitespace(request.toolInput.command);
	const prepared = await prepareSystemRunMutableFileBinding({
		command: {
			kind: "shell",
			text: command ?? ""
		},
		cwd: request.cwd
	});
	if (!prepared.ok) return {
		ok: false,
		message: prepared.message
	};
	return prepared.binding.operands.length > 0 ? {
		ok: true,
		binding: prepared.binding
	} : { ok: true };
}
function permissionRequestBindingFingerprint(binding) {
	const hash = createHash("sha256");
	for (const { argv, snapshot } of binding.operands) {
		hash.update(JSON.stringify([
			argv,
			snapshot.argvIndex,
			snapshot.path,
			snapshot.sha256
		]));
		hash.update("\0");
	}
	return hash.digest("hex");
}
function nativeHookRelayPermissionAllowAlwaysKey(params) {
	return createHash("sha256").update(JSON.stringify([
		params.registration.relayId,
		params.request.provider,
		params.request.agentId,
		params.request.sessionKey ?? params.request.sessionId,
		params.request.toolName.startsWith("mcp__") ? params.request.toolName : permissionRequestContentFingerprint(params.request),
		params.binding ? permissionRequestBindingFingerprint(params.binding) : void 0
	])).digest("hex");
}
function permissionRequestFallbackKey(request) {
	const command = readNonEmptyStringPreservingWhitespace(request.toolInput.command);
	if (command) return `${request.toolName}:command:${truncateRelayText(command, 240)}`;
	return `${request.toolName}:keys:${permissionRequestToolInputKeyFingerprint(request.toolInput)}`;
}
function permissionRequestToolInputKeyFingerprint(toolInput) {
	let fingerprint = "";
	const { keys, truncated } = readBoundedOwnKeys(toolInput, MAX_PERMISSION_FALLBACK_KEYS);
	for (const key of keys) {
		const separator = fingerprint ? "," : "";
		const remaining = MAX_PERMISSION_FALLBACK_KEY_CHARS - fingerprint.length - separator.length;
		if (remaining <= 0) break;
		fingerprint += `${separator}${key.slice(0, remaining)}`;
	}
	if (truncated && fingerprint.length < MAX_PERMISSION_FALLBACK_KEY_CHARS) fingerprint += `${fingerprint ? "," : ""}...`.slice(0, MAX_PERMISSION_FALLBACK_KEY_CHARS - fingerprint.length);
	return fingerprint || "none";
}
function permissionRequestContentFingerprint(request) {
	const hash = createHash("sha256");
	hash.update(request.toolName);
	hash.update("\0");
	hash.update(request.cwd ?? "");
	hash.update("\0");
	updateJsonHash(hash, request.toolInput);
	return hash.digest("hex");
}
function updateJsonHash(hash, value) {
	if (value === null) {
		hash.update("null");
		return;
	}
	if (typeof value === "string") {
		hash.update("string:");
		hash.update(JSON.stringify(value));
		return;
	}
	if (typeof value === "number") {
		hash.update(`number:${String(value)}`);
		return;
	}
	if (typeof value === "boolean") {
		hash.update(`boolean:${String(value)}`);
		return;
	}
	if (Array.isArray(value)) {
		hash.update("[");
		for (const item of value) {
			updateJsonHash(hash, item);
			hash.update(",");
		}
		hash.update("]");
		return;
	}
	hash.update("{");
	const { keys, truncated } = readBoundedOwnKeys(value, MAX_PERMISSION_FINGERPRINT_SORT_KEYS);
	for (const key of keys) {
		hash.update(JSON.stringify(key));
		hash.update(":");
		const item = value[key];
		if (item !== void 0) updateJsonHash(hash, item);
		hash.update(",");
	}
	if (truncated) {
		const sortedKeySet = new Set(keys);
		hash.update("#object-tail:");
		for (const key in value) {
			if (!Object.hasOwn(value, key) || sortedKeySet.has(key)) continue;
			hash.update(JSON.stringify(key));
			hash.update(":");
			const item = value[key];
			if (item !== void 0) updateJsonHash(hash, item);
			hash.update(",");
		}
	}
	hash.update("}");
}
function readBoundedOwnKeys(value, maxKeys) {
	const keys = [];
	let truncated = false;
	for (const key in value) {
		if (!Object.hasOwn(value, key)) continue;
		if (keys.length >= maxKeys) {
			truncated = true;
			break;
		}
		keys.push(key);
	}
	keys.sort();
	return {
		keys,
		truncated
	};
}
function consumeNativeHookRelayPermissionBudget(relayId, now = Date.now()) {
	const windowStart = now - PERMISSION_APPROVAL_WINDOW_MS;
	const timestamps = (permissionApprovalWindows.get(relayId) ?? []).filter((timestamp) => timestamp >= windowStart);
	if (timestamps.length >= MAX_PERMISSION_APPROVALS_PER_WINDOW) {
		permissionApprovalWindows.set(relayId, timestamps);
		return false;
	}
	timestamps.push(now);
	permissionApprovalWindows.set(relayId, timestamps);
	return true;
}
function hasNativeHookRelayPermissionAllowAlways(key, now = Date.now()) {
	const entry = permissionAllowAlwaysApprovals.get(key);
	if (!entry) return false;
	if (entry.expiresAtMs !== void 0 && entry.expiresAtMs <= now) {
		permissionAllowAlwaysApprovals.delete(key);
		return false;
	}
	return true;
}
function rememberNativeHookRelayPermissionAllowAlways(params, now = Date.now()) {
	pruneNativeHookRelayPermissionAllowAlways(now);
	const expiresAtMs = params.mcpTool ? void 0 : resolveExpiresAtMsFromDurationMs(PERMISSION_ALLOW_ALWAYS_TTL_MS, { nowMs: now });
	if (!params.mcpTool && expiresAtMs === void 0) return;
	permissionAllowAlwaysApprovals.set(params.key, {
		relayId: params.relayId,
		expiresAtMs
	});
	pruneMapToMaxSize(permissionAllowAlwaysApprovals, MAX_PERMISSION_ALLOW_ALWAYS_ENTRIES);
}
function pruneNativeHookRelayPermissionAllowAlways(now = Date.now()) {
	for (const [key, entry] of permissionAllowAlwaysApprovals) if (entry.expiresAtMs !== void 0 && entry.expiresAtMs <= now) permissionAllowAlwaysApprovals.delete(key);
}
function detachNativeHookRelayPermissionState(relayId) {
	const approvals = [];
	permissionApprovalWindows.delete(relayId);
	for (const [key, entry] of permissionAllowAlwaysApprovals) if (entry.relayId === relayId) permissionAllowAlwaysApprovals.delete(key);
	for (const [key, approval] of pendingPermissionApprovals) if (approval.relayId === relayId) {
		pendingPermissionApprovals.delete(key);
		approvals.push(approval);
	}
	return approvals;
}
async function requestNativeHookRelayPermissionApproval(request, approvalHost) {
	const timeoutMs = DEFAULT_PERMISSION_TIMEOUT_MS;
	const approvalRequest = {
		...formatNativeHookRelayApprovalPresentation(request),
		severity: "warning",
		toolName: request.toolName,
		toolCallId: request.toolCallId,
		allowedDecisions: [
			PluginApprovalResolutions.ALLOW_ONCE,
			PluginApprovalResolutions.ALLOW_ALWAYS,
			PluginApprovalResolutions.DENY
		],
		timeoutMs
	};
	const requestResult = approvalHost ? await approvalHost.requestApproval({
		...approvalRequest,
		transportTimeoutMs: 13e4,
		signal: request.signal
	}) : await callGatewayTool("plugin.approval.request", { timeoutMs: 13e4 }, {
		...approvalRequest,
		pluginId: `testclaw-native-hook-relay-${request.provider}`,
		agentId: request.agentId,
		sessionKey: request.sessionKey,
		twoPhase: true
	}, {
		expectFinal: false,
		signal: request.signal
	});
	request.signal?.throwIfAborted();
	const approvalId = requestResult?.id;
	if (!approvalId) return "defer";
	let decision;
	if (Object.hasOwn(requestResult ?? {}, "decision")) decision = requestResult.decision;
	else {
		const waitResult = await waitForNativeHookRelayApprovalDecision({
			approvalId,
			signal: request.signal,
			timeoutMs,
			approvalHost
		});
		if (!waitResult || waitResult.id !== approvalId) return "defer";
		decision = waitResult.decision;
	}
	if (decision === PluginApprovalResolutions.ALLOW_ONCE) return "allow";
	if (decision === PluginApprovalResolutions.ALLOW_ALWAYS) return "allow-always";
	if (decision === PluginApprovalResolutions.DENY) return "deny";
	return decision == null ? "timed-out" : "defer";
}
async function waitForNativeHookRelayApprovalDecision(params) {
	return (params.approvalHost ? params.approvalHost.waitForApproval({
		approvalId: params.approvalId,
		timeoutMs: params.timeoutMs,
		transportTimeoutMs: params.timeoutMs + 1e4,
		signal: params.signal
	}).then((result) => result ? {
		id: params.approvalId,
		decision: result.decision
	} : void 0) : callGatewayTool("plugin.approval.waitDecision", { timeoutMs: params.timeoutMs + 1e4 }, { id: params.approvalId }, { signal: params.signal })).catch((error) => {
		if (isApprovalNotFoundError(error)) return;
		throw error;
	});
}
//#endregion
//#region src/agents/harness/native-hook-relay-events.ts
async function processNativeHookRelayInvocation(params) {
	if (params.invocation.event === "pre_tool_use") return runNativeHookRelayPreToolUse(params);
	if (params.invocation.event === "post_tool_use") return runNativeHookRelayPostToolUse(params);
	if (params.invocation.event === "before_agent_finalize") return runNativeHookRelayBeforeAgentFinalize(params);
	return runNativeHookRelayPermissionRequest(params);
}
async function runNativeHookRelayPreToolUse(params) {
	const toolName = normalizeNativeHookToolName(params.invocation.toolName);
	const toolInput = params.adapter.readToolInput(params.invocation.rawPayload);
	const originalToolInputFingerprint = stableStringify(toolInput);
	const approvalMode = readNativeHookRelayApprovalMode(params.invocation.rawPayload);
	const policyRequest = {
		toolName,
		params: toolInput,
		...params.invocation.toolUseId ? { toolCallId: params.invocation.toolUseId } : {},
		signal: params.registration.signal
	};
	const outcome = params.registration.runBeforeToolCall ? await params.registration.runBeforeToolCall({
		...policyRequest,
		...approvalMode === "report" ? { approvalMode: "defer" } : {},
		...params.invocation.cwd ? { nativeOperation: { cwd: params.invocation.cwd } } : {}
	}) : await runBeforeToolCallHook({
		...policyRequest,
		...approvalMode === "report" ? { approvalMode: "defer" } : {},
		ctx: {
			...params.registration.agentId ? { agentId: params.registration.agentId } : {},
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			...params.registration.config ? { config: params.registration.config } : {},
			runId: params.registration.runId,
			...params.registration.channelId ? { channelId: params.registration.channelId } : {},
			...params.registration.requester ? { requester: params.registration.requester } : {},
			...params.registration.approvalContext,
			...params.invocation.cwd ? {
				cwd: params.invocation.cwd,
				workspaceDir: params.invocation.cwd
			} : {}
		}
	});
	try {
		params.registration.signal?.throwIfAborted();
		params.registration.assertActive?.();
	} catch (error) {
		if (!outcome.blocked && outcome.deferredApproval) cancelDeferredPluginToolApproval(outcome.deferredApproval);
		throw error;
	}
	if (outcome.blocked) return params.adapter.renderPreToolUseBlockResponse(outcome.reason, outcome.kind === "failure" && outcome.disposition !== "blocked" ? outcome.disposition : void 0);
	if (!outcome.deferredApproval && nativeHookRelayParamsWereRewritten(originalToolInputFingerprint, outcome.params)) return params.adapter.renderPreToolUseBlockResponse("Assistant tool policy rewrote Codex app-server approval params; refusing original request.");
	try {
		if (params.executionAdmission?.toolNames.includes(toolName)) {
			params.executionAdmission.admit(params.invocation, params.assertExecutionAdmissionCurrent);
			params.registration.signal?.throwIfAborted();
			params.registration.assertActive?.();
		}
	} catch (error) {
		if (outcome.deferredApproval) cancelDeferredPluginToolApproval(outcome.deferredApproval);
		throw error;
	}
	if (outcome.deferredApproval) {
		if (!setNativeHookRelayPreToolUseApproval({
			relayId: params.registration.relayId,
			toolUseId: params.invocation.toolUseId,
			deferredApproval: outcome.deferredApproval,
			originalParamsFingerprint: originalToolInputFingerprint
		})) {
			cancelDeferredPluginToolApproval(outcome.deferredApproval);
			return params.adapter.renderPreToolUseBlockResponse("Plugin approval required but Codex tool id unavailable.");
		}
		return params.adapter.renderNoopResponse(params.invocation.event);
	}
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function runNativeHookRelayPostToolUse(params) {
	const toolName = normalizeNativeHookToolName(params.invocation.toolName);
	const toolCallId = params.invocation.toolUseId ?? `${params.invocation.event}:${params.invocation.receivedAt}`;
	const startArgs = params.adapter.readToolInput(params.invocation.rawPayload);
	const rawResult = params.adapter.readToolResponse(params.invocation.rawPayload);
	const result = !(listAgentToolResultMiddlewares("codex").length > 0) ? rawResult : await createAgentToolResultMiddlewareRunner({
		runtime: "codex",
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		runId: params.registration.runId
	}).applyToolResultMiddleware({
		turnId: params.invocation.turnId,
		toolCallId,
		toolName,
		args: startArgs,
		...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
		result: payloadTextResult(rawResult)
	});
	await runAgentHarnessAfterToolCallHook({
		toolName,
		toolCallId,
		runId: params.registration.runId,
		...params.registration.agentId ? { agentId: params.registration.agentId } : {},
		sessionId: params.registration.sessionId,
		...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
		...params.registration.channelId ? { channelId: params.registration.channelId } : {},
		startArgs,
		result
	});
	return params.adapter.renderNoopResponse(params.invocation.event);
}
async function runNativeHookRelayBeforeAgentFinalize(params) {
	const outcome = await runAgentHarnessBeforeAgentFinalizeHook({
		event: {
			runId: params.registration.runId,
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			...params.invocation.turnId ? { turnId: params.invocation.turnId } : {},
			provider: params.registration.provider,
			...params.invocation.model ? { model: params.invocation.model } : {},
			...params.invocation.cwd ? { cwd: params.invocation.cwd } : {},
			...params.invocation.transcriptPath ? { transcriptPath: params.invocation.transcriptPath } : {},
			stopHookActive: params.invocation.stopHookActive === true,
			...params.invocation.lastAssistantMessage ? { lastAssistantMessage: params.invocation.lastAssistantMessage } : {}
		},
		ctx: {
			...params.registration.agentId ? { agentId: params.registration.agentId } : {},
			sessionId: params.registration.sessionId,
			...params.registration.sessionKey ? { sessionKey: params.registration.sessionKey } : {},
			runId: params.registration.runId,
			...params.registration.channelId ? { channelId: params.registration.channelId } : {},
			...params.invocation.cwd ? { workspaceDir: params.invocation.cwd } : {},
			...params.invocation.model ? { modelId: params.invocation.model } : {}
		}
	});
	if (outcome.action === "revise") return params.adapter.renderBeforeAgentFinalizeReviseResponse(outcome.reason);
	if (outcome.action === "finalize") return params.adapter.renderBeforeAgentFinalizeStopResponse(outcome.reason);
	return params.adapter.renderNoopResponse(params.invocation.event);
}
//#endregion
//#region src/agents/harness/native-hook-relay-work.ts
const { relays: relays$1 } = nativeHookRelayState;
function assertNativeHookRelayForegroundCurrent(registration, lifetime, foregroundToken) {
	if (relays$1.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
	registration.signal?.throwIfAborted();
	registration.assertActive?.();
	if (!lifetime.foregroundOpen || lifetime.foregroundToken !== foregroundToken) throw new Error("native hook relay foreground invocation not allowed");
}
async function resolveNativeHookRelayInvocationBinding(registration, lifetime, event, rawPayload, signal) {
	if (!lifetime) throw new Error("native hook relay registration is inactive");
	await racePromiseWithAbortSignal(lifetime.policyReady, signal);
	signal?.throwIfAborted();
	if (relays$1.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
	const claim = lifetime.retention?.readClaim(rawPayload);
	if (claim && event === "pre_tool_use" && lifetime.retained && lifetime.retention) {
		const retained = lifetime.retained;
		const retention = lifetime.retention;
		let assertAdmission;
		const assertRetainedAuthority = () => {
			if (relays$1.get(registration.relayId) !== registration || Date.now() > registration.expiresAtMs) throw new Error("native hook relay registration is inactive");
			registration.signal?.throwIfAborted();
			retained.assertActive();
			if (assertAdmission && !assertAdmission()) throw new Error("native hook relay retained invocation not allowed");
			if (!retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		};
		const assertActive = () => {
			signal?.throwIfAborted();
			assertRetainedAuthority();
		};
		if (!lifetime.foregroundOpen && !retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		if (retention.awaitForegroundAdmission) {
			assertAdmission = await racePromiseWithAbortSignal(retention.awaitForegroundAdmission(claim, signal), signal);
			if (!assertAdmission) throw new Error("native hook relay retained invocation not allowed");
			assertActive();
		} else if (!retention.allowPreToolUse(claim)) throw new Error("native hook relay retained invocation not allowed");
		return {
			registration: {
				...registration,
				assertActive,
				runBeforeToolCall: retained.runBeforeToolCall,
				signal
			},
			assertExecutionAdmissionCurrent: assertRetainedAuthority
		};
	}
	if (!lifetime.foregroundOpen) throw new Error("native hook relay foreground invocation not allowed");
	const foregroundToken = lifetime.foregroundToken;
	const assertExecutionAdmissionCurrent = () => assertNativeHookRelayForegroundCurrent(registration, lifetime, foregroundToken);
	const assertActive = () => {
		signal?.throwIfAborted();
		assertExecutionAdmissionCurrent();
	};
	return {
		registration: {
			...registration,
			assertActive,
			signal
		},
		assertExecutionAdmissionCurrent
	};
}
//#endregion
//#region src/agents/harness/native-hook-relay.ts
const log = createSubsystemLogger("agents/harness/native-hook-relay");
const { relays, relayBridges, invocations } = nativeHookRelayState;
const RELAY_LIFETIME = "__testclawNativeHookRelayLifetimeV1";
function readRelayLifetime(registration) {
	return registration[RELAY_LIFETIME];
}
function unregisterNativeHookRelay(relayId, expectedRegistration, options) {
	if (expectedRegistration && relays.get(relayId) !== expectedRegistration) return;
	const registration = expectedRegistration ?? relays.get(relayId);
	if (!registration) return;
	const lifetime = readRelayLifetime(registration);
	const bridge = relayBridges.get(relayId);
	if (relays.get(relayId) === registration) relays.delete(relayId);
	if (lifetime?.expiryTimer) clearTimeout(lifetime.expiryTimer);
	lifetime?.removeAbortListener?.();
	lifetime?.retained?.release();
	delete registration[RELAY_LIFETIME];
	unregisterNativeHookRelayBridge(relayId, {
		...options,
		...bridge ? { expectedBridge: bridge } : {}
	});
	removeNativeHookRelayInvocations(relayId);
	detachNativeHookRelayApprovalState(relayId)();
	const deliverOnUnregister = () => {
		try {
			lifetime?.retention?.onDispose();
		} catch (error) {
			try {
				log.warn("native hook relay unregister callback failed", {
					error,
					relayId
				});
			} catch {}
		}
	};
	if (options?.deferOnUnregister) return deliverOnUnregister;
	deliverOnUnregister();
}
async function invokeNativeHookRelay(params, invocationSignal) {
	const provider = readNativeHookRelayProvider(params.provider);
	const relayId = readNonEmptyString(params.relayId, "relayId");
	const event = readNativeHookRelayEvent(params.event);
	const registration = relays.get(relayId);
	if (!registration) {
		pruneExpiredNativeHookRelays();
		throw new Error("native hook relay not found");
	}
	const signal = invocationSignal && registration.signal ? AbortSignal.any([invocationSignal, registration.signal]) : invocationSignal ?? registration.signal;
	signal?.throwIfAborted();
	if (Date.now() > registration.expiresAtMs) {
		unregisterNativeHookRelay(relayId, registration);
		throw new Error("native hook relay expired");
	}
	if (registration.provider !== provider) throw new Error("native hook relay provider mismatch");
	if (params.requireGeneration) {
		const generation = readNonEmptyString(params.generation, "generation");
		if (generation !== registration.generation) {
			if (!canAcceptNativeHookRelayGenerationMismatch(registration, generation)) throw new Error(NATIVE_HOOK_RELAY_BRIDGE_STALE_REGISTRATION_ERROR);
			log.debug("native hook relay accepted bootstrap generation mismatch", {
				relayId,
				event,
				runId: registration.runId
			});
		}
	}
	if (!registration.allowedEvents.includes(event)) throw new Error("native hook relay event not allowed");
	if (!isJsonValue(params.rawPayload)) throw new Error("native hook relay payload must be JSON-compatible");
	const normalized = normalizeNativeHookInvocation({
		registration,
		event,
		rawPayload: params.rawPayload
	});
	const { registration: effectiveRegistration, assertExecutionAdmissionCurrent } = await resolveNativeHookRelayInvocationBinding(registration, readRelayLifetime(registration), event, params.rawPayload, signal);
	if (event === "pre_tool_use" || event === "permission_request") effectiveRegistration.assertActive?.();
	recordNativeHookRelayInvocation(normalized);
	const startedAt = Date.now();
	const response = await racePromiseWithAbortSignal(processNativeHookRelayInvocation({
		registration: effectiveRegistration,
		invocation: normalized,
		adapter: getNativeHookRelayProviderAdapter(provider),
		executionAdmission: readRelayLifetime(registration)?.executionAdmission,
		assertExecutionAdmissionCurrent
	}), signal);
	if (event === "pre_tool_use" || event === "permission_request") effectiveRegistration.assertActive?.();
	if (normalized.toolUseId && response.failureDisposition && readNativeHookRelayApprovalMode(normalized.rawPayload) !== "report") projectNativeHookRelayPreToolUseFailure(registration, {
		toolName: normalizeNativeHookToolName(normalized.toolName),
		toolCallId: normalized.toolUseId,
		disposition: response.failureDisposition,
		durationMs: Date.now() - startedAt
	});
	return response;
}
function projectNativeHookRelayPreToolUseFailure(registration, failure) {
	const callback = registration.onPreToolUseFailure;
	if (!callback || registration.preToolUseFailureProjections.has(failure.toolCallId)) return;
	const record = {
		promise: Promise.resolve().then(() => callback(failure)),
		settled: false
	};
	registration.preToolUseFailureProjections.set(failure.toolCallId, record);
	record.promise.then(() => {
		record.settled = true;
	}, (error) => {
		record.settled = true;
		if (registration.preToolUseFailureProjections.get(failure.toolCallId) === record) registration.preToolUseFailureProjections.delete(failure.toolCallId);
		log.debug("native pre-tool failure projection failed", {
			error,
			relayId: registration.relayId,
			toolCallId: failure.toolCallId
		});
	});
	if (registration.preToolUseFailureProjections.size > 200) {
		let oldestToolCallId;
		for (const [toolCallId, candidate] of registration.preToolUseFailureProjections) {
			oldestToolCallId ??= toolCallId;
			if (candidate.settled) {
				registration.preToolUseFailureProjections.delete(toolCallId);
				return;
			}
		}
		if (oldestToolCallId) registration.preToolUseFailureProjections.delete(oldestToolCallId);
	}
}
function recordNativeHookRelayInvocation(invocation) {
	invocations.push({
		...invocation,
		rawPayload: snapshotNativeHookRelayPayload(invocation.rawPayload)
	});
	if (invocations.length > 200) invocations.splice(0, invocations.length - 200);
}
function removeNativeHookRelayInvocations(relayId) {
	for (let index = invocations.length - 1; index >= 0; index -= 1) if (invocations[index]?.relayId === relayId) invocations.splice(index, 1);
}
function canAcceptNativeHookRelayGenerationMismatch(registration, generation) {
	const expiresAtMs = registration.generationMismatchGraceExpiresAtMs;
	if (typeof expiresAtMs !== "number" || Date.now() > expiresAtMs) return false;
	if (registration.generationMismatchGraceAcceptedGeneration) return registration.generationMismatchGraceAcceptedGeneration === generation;
	registration.generationMismatchGraceAcceptedGeneration = generation;
	return true;
}
function pruneExpiredNativeHookRelays(now = Date.now()) {
	for (const [relayId, registration] of relays) if (now > registration.expiresAtMs) unregisterNativeHookRelay(relayId, registration);
}
//#endregion
//#region src/gateway/server-methods/native-hook-relay.ts
/** Gateway request handlers for invoking registered native hook relays. */
const nativeHookRelayHandlers = { "nativeHook.invoke": async ({ params, respond, client }) => {
	try {
		respond(true, await invokeNativeHookRelay({
			provider: params.provider,
			relayId: params.relayId,
			generation: params.generation,
			event: params.event,
			rawPayload: params.rawPayload,
			requireGeneration: true
		}, client?.connectionSignal));
	} catch (error) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error instanceof Error ? error.message : "native hook relay failed"));
	}
} };
//#endregion
export { nativeHookRelayHandlers };
