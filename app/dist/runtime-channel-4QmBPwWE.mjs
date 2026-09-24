import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { l as resolveSessionStorePathCore } from "./paths-D1bkI3aW.mjs";
import { t as resolveCommandAuthorizedFromAuthorizers } from "./command-gating-65fgTdwb.mjs";
import { n as implicitMentionKindWhen, r as resolveInboundMentionDecision } from "./mention-gating-Cqy7URJJ.mjs";
import { i as resolveStableChannelIngressPolicy, r as resolveChannelIngressPolicy, t as createChannelIngressPolicyResolver } from "./runtime-BJmsKdOg.mjs";
import "./logging-Dqz-HW4O.mjs";
import { m as recordInboundSessionMeta, p as readSessionUpdatedAtCore, v as updateSessionLastRoute } from "./session-accessor.sqlite-entry-BgjD5zI-.mjs";
import "./session-accessor-CtBBLApI.mjs";
import { a as shouldComputeCommandAuthorized, r as isControlCommandMessage, t as hasControlCommand } from "./command-detection-CLXcpXCd.mjs";
import "./sessions-QjbxjKuh.mjs";
import { t as finalizeInboundContext } from "./inbound-context-pT-cPSwW.mjs";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-DlfZ8qsV.mjs";
import { i as resolveHumanDelayConfig, r as resolveEffectiveMessagesConfig } from "./identity-D5GWLt72.mjs";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-DihBpxlM.mjs";
import { f as saveMediaBuffer } from "./store-CgHi10YJ.mjs";
import { n as shouldHandleTextCommands } from "./commands-text-routing-DNtULIm-.mjs";
import "./commands-registry-BY5fwelV.mjs";
import { n as settleReplyDispatcher, r as withReplyDispatcher } from "./dispatch-dispatcher-CRk0YOt9.mjs";
import { o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-C_VACgEb.mjs";
import { n as matchesMentionPatterns, r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-lL-2LsKu.mjs";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-DGNIaKb7.mjs";
import { a as saveResponseMedia, i as saveRemoteMedia, r as readRemoteMediaBuffer } from "./fetch-DSlHXpYY.mjs";
import { a as chunkText, c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, o as chunkTextWithMode, r as chunkMarkdownText, s as resolveChunkMode, t as chunkByNewline } from "./chunk-DMpehUb8.mjs";
import { t as convertMarkdownTables } from "./tables-BC0IgAAb.mjs";
import { a as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-C-Bm0n1u.mjs";
import { n as resolveInboundDebounceMs, t as createInboundDebouncer } from "./inbound-debounce-8imbu7H7.mjs";
import { i as shouldAckReaction, n as removeAckReactionAfterReply, r as removeAckReactionHandleAfterReply, t as createAckReactionHandle } from "./ack-reactions-ChUVaNLd.mjs";
import { t as buildChannelInboundEventContext } from "./context-C2j7Y6fF.mjs";
import { i as setChannelConversationBindingMaxAgeBySessionKeyAsync, n as setChannelConversationBindingIdleTimeoutBySessionKeyAsync, r as setChannelConversationBindingMaxAgeBySessionKey, t as setChannelConversationBindingIdleTimeoutBySessionKey } from "./conversation-bindings-BTtsOnwJ.mjs";
import { t as loadChannelOutboundAdapter } from "./load-BcXqb-IP.mjs";
import { t as recordInboundSession } from "./session-B4HxgGZT.mjs";
import { t as resolveMarkdownTableMode } from "./markdown-tables-4oI3ISOk.mjs";
import { n as recordChannelActivity, t as getChannelActivity } from "./channel-activity-KGHrbxIK.mjs";
import { t as buildPairingReply } from "./pairing-messages-KnmmBInU.mjs";
import { d as upsertChannelPairingRequest, l as removeChannelAllowFromStoreEntry, s as readChannelAllowFromStore } from "./pairing-store-CDP5xkHN.mjs";
//#region src/plugins/runtime/channel-runtime-contexts.ts
const log = createSubsystemLogger("plugins/runtime-channel");
function normalizeRuntimeContextString(value) {
	return normalizeOptionalString(value) ?? "";
}
function normalizeRuntimeContextKey(params) {
	const channelId = normalizeRuntimeContextString(params.channelId);
	const capability = normalizeRuntimeContextString(params.capability);
	const accountId = normalizeRuntimeContextString(params.accountId);
	if (!channelId || !capability) return null;
	return {
		mapKey: `${channelId}\u0000${accountId}\u0000${capability}`,
		normalizedKey: {
			channelId,
			capability,
			...accountId ? { accountId } : {}
		}
	};
}
function doesRuntimeContextWatcherMatch(params) {
	if (params.watcher.channelId && params.watcher.channelId !== params.event.key.channelId) return false;
	if (params.watcher.accountId !== void 0 && params.watcher.accountId !== (params.event.key.accountId ?? "")) return false;
	if (params.watcher.capability && params.watcher.capability !== params.event.key.capability) return false;
	return true;
}
/** Creates the in-memory channel runtime context registry used by plugin runtime surfaces. */
function createChannelRuntimeContextRegistry() {
	const runtimeContexts = /* @__PURE__ */ new Map();
	const runtimeContextWatchers = /* @__PURE__ */ new Set();
	const emitRuntimeContextEvent = (event) => {
		for (const watcher of runtimeContextWatchers) {
			if (!doesRuntimeContextWatcherMatch({
				watcher: watcher.filter,
				event
			})) continue;
			try {
				watcher.onEvent(event);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				log.error(`runtime context watcher failed during ${event.type} channel=${event.key.channelId} capability=${event.key.capability}` + (event.key.accountId ? ` account=${event.key.accountId}` : "") + `: ${message}`);
			}
		}
	};
	return {
		register: (params) => {
			const normalized = normalizeRuntimeContextKey(params);
			if (!normalized) return { dispose: () => {} };
			if (params.abortSignal?.aborted) return { dispose: () => {} };
			const token = Symbol(normalized.mapKey);
			let disposed = false;
			const dispose = () => {
				if (disposed) return;
				disposed = true;
				params.abortSignal?.removeEventListener("abort", dispose);
				const current = runtimeContexts.get(normalized.mapKey);
				if (!current || current.token !== token) return;
				runtimeContexts.delete(normalized.mapKey);
				emitRuntimeContextEvent({
					type: "unregistered",
					key: normalized.normalizedKey
				});
			};
			params.abortSignal?.addEventListener("abort", dispose, { once: true });
			if (params.abortSignal?.aborted) {
				dispose();
				return { dispose };
			}
			runtimeContexts.set(normalized.mapKey, {
				token,
				context: params.context,
				normalizedKey: normalized.normalizedKey
			});
			if (disposed) return { dispose };
			emitRuntimeContextEvent({
				type: "registered",
				key: normalized.normalizedKey,
				context: params.context
			});
			return { dispose };
		},
		get: (params) => {
			const normalized = normalizeRuntimeContextKey(params);
			if (!normalized) return;
			return runtimeContexts.get(normalized.mapKey)?.context;
		},
		watch: (params) => {
			const watcher = {
				filter: {
					...params.channelId?.trim() ? { channelId: params.channelId.trim() } : {},
					...params.accountId != null ? { accountId: params.accountId.trim() } : {},
					...params.capability?.trim() ? { capability: params.capability.trim() } : {}
				},
				onEvent: params.onEvent
			};
			runtimeContextWatchers.add(watcher);
			return () => {
				runtimeContextWatchers.delete(watcher);
			};
		}
	};
}
//#endregion
//#region src/plugins/runtime/runtime-channel.ts
const dispatchLowLevelChannelReplyFromConfig = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./dispatch-from-config-D04yhMIM.mjs")), (runtime) => runtime.dispatchLowLevelChannelReplyFromConfig);
const dispatchReplyWithBufferedBlockDispatcherCore = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./provider-dispatcher-B1tCHY22.mjs")), (runtime) => runtime.dispatchReplyWithBufferedBlockDispatcherCore);
const loadChannelTurnLifecycle = createLazyRuntimeModule(() => import("./lifecycle-BvZy7KkP.mjs"));
const dispatchAssembledChannelTurn = createLazyRuntimeMethod(loadChannelTurnLifecycle, (runtime) => runtime.dispatchAssembledChannelTurn);
const loadPreparedChannelTurn = createLazyRuntimeModule(() => import("./execution-Bv3ruaQD.mjs"));
const runPreparedChannelTurn = async (params) => (await loadPreparedChannelTurn()).runPreparedChannelTurn(params);
const runChannelTurn = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./run-channel-turn-CWsB4UK6.mjs")), (runtime) => runtime.runChannelTurn);
function createRuntimeChannel(options) {
	const dispatchInbound = async (params) => (await loadChannelTurnLifecycle()).dispatchRoutedChannelTurn({
		...params,
		...options?.dispatchReplyFromConfig ? { dispatchReplyFromConfig: options.dispatchReplyFromConfig } : {}
	});
	const inboundRuntime = {
		ingress: {
			createResolver: createChannelIngressPolicyResolver,
			resolve: resolveChannelIngressPolicy,
			resolveStable: resolveStableChannelIngressPolicy
		},
		buildContext: buildChannelInboundEventContext,
		run: runChannelTurn,
		runPreparedReply: runPreparedChannelTurn,
		dispatch: dispatchInbound,
		dispatchReply: dispatchAssembledChannelTurn
	};
	const sessionRuntime = {
		resolveStorePath: resolveSessionStorePathCore,
		readSessionUpdatedAt: readSessionUpdatedAtCore,
		recordSessionMetaFromInbound: recordInboundSessionMeta,
		recordInboundSession,
		updateLastRoute: updateSessionLastRoute,
		resolveEntryResetFreshness: resolveSessionEntryResetFreshness
	};
	return {
		text: {
			chunkByNewline,
			chunkMarkdownText,
			chunkMarkdownTextWithMode,
			chunkText,
			chunkTextWithMode,
			resolveChunkMode,
			resolveTextChunkLimit,
			hasControlCommand,
			resolveMarkdownTableMode,
			convertMarkdownTables
		},
		reply: {
			dispatchReplyWithBufferedBlockDispatcher: dispatchReplyWithBufferedBlockDispatcherCore,
			createReplyDispatcherWithTyping,
			resolveEffectiveMessagesConfig,
			resolveHumanDelayConfig,
			dispatchReplyFromConfig: options?.dispatchReplyFromConfig ?? dispatchLowLevelChannelReplyFromConfig,
			withReplyDispatcher,
			settleReplyDispatcher,
			finalizeInboundContext,
			formatAgentEnvelope,
			resolveEnvelopeFormatOptions
		},
		routing: {
			buildAgentSessionKey,
			resolveAgentRoute
		},
		pairing: {
			buildPairingReply,
			readAllowFromStore: ({ channel, accountId, env }) => readChannelAllowFromStore(channel, env, accountId),
			removeAllowFromStoreEntry: ({ channel, entry, accountId, env, pairingAdapter }) => removeChannelAllowFromStoreEntry({
				channel,
				entry,
				accountId,
				env,
				pairingAdapter
			}),
			upsertPairingRequest: ({ channel, id, accountId, meta, env, pairingAdapter }) => upsertChannelPairingRequest({
				channel,
				id,
				accountId,
				meta,
				env,
				pairingAdapter
			})
		},
		media: {
			readRemoteMediaBuffer,
			fetchRemoteMedia: readRemoteMediaBuffer,
			saveRemoteMedia,
			saveResponseMedia,
			saveMediaBuffer
		},
		activity: {
			record: recordChannelActivity,
			get: getChannelActivity
		},
		session: sessionRuntime,
		mentions: {
			buildMentionRegexes,
			matchesMentionPatterns,
			matchesMentionWithExplicit,
			implicitMentionKindWhen,
			resolveInboundMentionDecision
		},
		reactions: {
			createAckReactionHandle,
			shouldAckReaction,
			removeAckReactionAfterReply,
			removeAckReactionHandleAfterReply
		},
		groups: {
			resolveGroupPolicy: resolveChannelGroupPolicy,
			resolveRequireMention: resolveChannelGroupRequireMention
		},
		debounce: {
			createInboundDebouncer,
			resolveInboundDebounceMs
		},
		commands: {
			resolveCommandAuthorizedFromAuthorizers,
			isControlCommandMessage,
			shouldComputeCommandAuthorized,
			shouldHandleTextCommands
		},
		outbound: { loadAdapter: loadChannelOutboundAdapter },
		inbound: inboundRuntime,
		turn: inboundRuntime,
		threadBindings: {
			setIdleTimeoutBySessionKeyAsync: setChannelConversationBindingIdleTimeoutBySessionKeyAsync,
			setMaxAgeBySessionKeyAsync: setChannelConversationBindingMaxAgeBySessionKeyAsync,
			setIdleTimeoutBySessionKey: ({ channelId, targetSessionKey, accountId, idleTimeoutMs }) => setChannelConversationBindingIdleTimeoutBySessionKey({
				channelId,
				targetSessionKey,
				accountId,
				idleTimeoutMs
			}),
			setMaxAgeBySessionKey: ({ channelId, targetSessionKey, accountId, maxAgeMs }) => setChannelConversationBindingMaxAgeBySessionKey({
				channelId,
				targetSessionKey,
				accountId,
				maxAgeMs
			})
		},
		runtimeContexts: createChannelRuntimeContextRegistry()
	};
}
//#endregion
export { createRuntimeChannel as t };
