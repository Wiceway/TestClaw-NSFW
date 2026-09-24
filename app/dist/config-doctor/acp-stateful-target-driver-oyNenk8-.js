import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as resolveAgentIdFromSessionKey, v as isAcpSessionKey } from "./session-key-AvQIavYt.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { r as logVerbose } from "./globals-NNTJbzqD.js";
import "./session-accessor-DMf92PxK.js";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-BGyeftoC.js";
import { c as resolveAcpSessionTarget } from "./manager.utils-XmlHUMqq.js";
import { t as getAcpSessionManager } from "./manager-CGVJjEnt.js";
import { n as readAcpSessionEntry } from "./session-meta-8OGO7A4a.js";
import { a as buildConfiguredAcpSessionKey, s as resolveConfiguredAcpBindingSpecFromRecord } from "./configured-binding-registry-N3rneCJz.js";
import { t as resolveConfiguredAcpBindingSpecBySessionKey } from "./persistent-bindings.resolve-CRAVdUIC.js";
import { o as performGatewaySessionReset } from "./session-reset-service-CS3JPNMR.js";
//#region src/acp/persistent-bindings.lifecycle.ts
/** Ensures configured channel-to-ACP bindings have live sessions and matching runtime options. */
function sessionStructurallyMatchesConfiguredBinding(params) {
	if (params.meta.state === "error") return false;
	const desiredAgent = normalizeLowercaseStringOrEmpty(params.spec.acpAgentId ?? params.spec.agentId);
	const currentAgent = normalizeLowercaseStringOrEmpty(params.meta.agent);
	if (!currentAgent || currentAgent !== desiredAgent) return false;
	if (params.meta.mode !== params.spec.mode) return false;
	const desiredBackend = normalizeOptionalString(params.spec.backend) ?? normalizeOptionalString(params.cfg.acp?.backend) ?? "";
	if (desiredBackend) {
		const currentBackend = (params.meta.backend ?? "").trim();
		if (!currentBackend || currentBackend !== desiredBackend) return false;
	}
	const desiredCwd = normalizeOptionalString(params.spec.cwd);
	if (desiredCwd !== void 0) {
		if (desiredCwd !== (params.meta.runtimeOptions?.cwd ?? params.meta.cwd ?? "").trim()) return false;
	}
	return true;
}
/** Creates or replaces the ACP session required by one configured binding. */
async function ensureConfiguredAcpBindingSession(params) {
	const sessionKey = buildConfiguredAcpSessionKey(params.spec);
	const acpManager = getAcpSessionManager();
	const runtimeOptions = {
		...params.spec.model ? { model: params.spec.model } : {},
		...params.spec.thinking ? { thinking: params.spec.thinking } : {}
	};
	try {
		const resolution = acpManager.resolveSession({
			cfg: params.cfg,
			agentId: params.spec.agentId,
			sessionKey
		});
		if (resolution.kind === "ready" && sessionStructurallyMatchesConfiguredBinding({
			cfg: params.cfg,
			spec: params.spec,
			meta: resolution.meta
		})) {
			let currentOptions = resolution.meta.runtimeOptions;
			for (const key of ["model", "thinking"]) {
				const value = runtimeOptions[key];
				if (value !== void 0 && normalizeOptionalString(currentOptions?.[key]) !== value) {
					params.assertActive?.();
					currentOptions = await acpManager.setSessionConfigOption({
						...params.assertActive ? { assertActive: params.assertActive } : {},
						cfg: params.cfg,
						agentId: params.spec.agentId,
						sessionKey,
						key,
						value
					});
				}
			}
			return {
				ok: true,
				sessionKey
			};
		}
		if (resolution.kind !== "none") {
			params.assertActive?.();
			await acpManager.closeSession({
				...params.assertActive ? { assertActive: params.assertActive } : {},
				cfg: params.cfg,
				agentId: params.spec.agentId,
				sessionKey,
				reason: "config-binding-reconfigure",
				clearMeta: false,
				allowBackendUnavailable: true,
				requireAcpSession: false
			});
		}
		params.assertActive?.();
		await acpManager.initializeSession({
			...params.assertActive ? { assertActive: params.assertActive } : {},
			cfg: params.cfg,
			agentId: params.spec.agentId,
			sessionKey,
			agent: params.spec.acpAgentId ?? params.spec.agentId,
			mode: params.spec.mode,
			runtimeOptions,
			cwd: params.spec.cwd,
			backendId: params.spec.backend
		});
		return {
			ok: true,
			sessionKey
		};
	} catch (error) {
		const message = formatErrorMessage(error);
		logVerbose(`acp-configured-binding: failed ensuring ${params.spec.channel}:${params.spec.accountId}:${params.spec.conversationId} -> ${sessionKey}: ${message}`);
		return {
			ok: false,
			sessionKey,
			error: message
		};
	}
}
/** Resolves a configured binding for a conversation and ensures its ACP session exists. */
async function ensureConfiguredAcpBindingReadyCore(params) {
	if (!params.configuredBinding) return { ok: true };
	const ensured = await ensureConfiguredAcpBindingSession({
		...params.assertActive ? { assertActive: params.assertActive } : {},
		cfg: params.cfg,
		spec: params.configuredBinding.spec
	});
	if (ensured.ok) return { ok: true };
	return {
		ok: false,
		error: ensured.error ?? "unknown error"
	};
}
//#endregion
//#region src/channels/plugins/acp-stateful-target-driver.ts
/**
* ACP stateful target driver for configured bindings.
*
* Ensures ACP-backed bound sessions exist, are ready, and can be reset by Gateway.
*/
function toAcpStatefulBindingTargetDescriptor(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const target = resolveAcpSessionTarget(params);
	if (readAcpSessionEntry({
		cfg: params.cfg,
		...target
	})?.acp) return {
		kind: "stateful",
		driverId: "acp",
		...target
	};
	const spec = resolveConfiguredAcpBindingSpecBySessionKey({
		...params,
		sessionKey
	});
	if (!spec) {
		if (!isAcpSessionKey(sessionKey)) return null;
		return {
			kind: "stateful",
			driverId: "acp",
			sessionKey,
			agentId: resolveAgentIdFromSessionKey(sessionKey)
		};
	}
	return {
		kind: "stateful",
		driverId: "acp",
		sessionKey,
		agentId: spec.agentId,
		...spec.label ? { label: spec.label } : {}
	};
}
async function ensureAcpTargetReady(params) {
	const configuredBinding = resolveConfiguredAcpBindingSpecFromRecord(params.bindingResolution.record);
	if (!configuredBinding) return {
		ok: false,
		error: "Configured ACP binding unavailable"
	};
	return await ensureConfiguredAcpBindingReadyCore({
		...params.assertActive ? { assertActive: params.assertActive } : {},
		cfg: params.cfg,
		configuredBinding: {
			spec: configuredBinding,
			record: params.bindingResolution.record
		}
	});
}
async function ensureAcpTargetSession(params) {
	const spec = resolveConfiguredAcpBindingSpecFromRecord(params.bindingResolution.record);
	if (!spec) return {
		ok: false,
		sessionKey: params.bindingResolution.statefulTarget.sessionKey,
		error: "Configured ACP binding unavailable"
	};
	return await ensureConfiguredAcpBindingSession({
		cfg: params.cfg,
		spec
	});
}
async function resetAcpTargetInPlace(params) {
	if (resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.bindingTarget.agentId
	}).entry?.incognito === true) return {
		ok: false,
		error: "Incognito sessions cannot reset in place."
	};
	const result = await performGatewaySessionReset({
		key: params.sessionKey,
		agentId: params.bindingTarget.agentId,
		operatorRoleActor: { kind: "system" },
		reason: params.reason,
		commandSource: params.commandSource ?? "stateful-target:acp-reset-in-place",
		armSessionDiffBaselineCapture: true
	});
	if (result.ok) {
		if ("incognitoDeleted" in result) return {
			ok: true,
			sessionKey: result.key,
			storePath: result.storePath
		};
		return {
			ok: true,
			sessionKey: result.key,
			sessionId: result.entry.sessionId,
			storePath: result.storePath
		};
	}
	return {
		ok: false,
		error: result.error.message
	};
}
const acpStatefulBindingTargetDriver = {
	id: "acp",
	ensureReady: ensureAcpTargetReady,
	ensureSession: ensureAcpTargetSession,
	resolveTargetBySessionKey: toAcpStatefulBindingTargetDescriptor,
	resetInPlace: resetAcpTargetInPlace
};
//#endregion
export { acpStatefulBindingTargetDriver };
