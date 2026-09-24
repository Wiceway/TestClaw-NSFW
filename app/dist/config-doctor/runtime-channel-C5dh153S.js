import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { t as expectDefined } from "./expect-lbe3Hgrh.js";
import { A as resolveOptionalIntegerOption, k as resolveNonNegativeIntegerOption } from "./number-coercion-0M4tZV2c.js";
import { r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CgCh8H_K.js";
import { t as formatCliCommand } from "./command-format-CH2GYoFl.js";
import "./session-key-AvQIavYt.js";
import { n as normalizeAccountId } from "./account-id-vE-dRkuP.js";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.js";
import "./errors-cp9Var1Z.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { l as resolveSessionStorePathCore } from "./paths-ViQaz2td.js";
import { i as normalizeChannelId, r as listChannelPlugins } from "./registry-PMJLv7Nh.js";
import "./plugins-23wkyULy.js";
import { m as recordInboundSessionMeta, p as readSessionUpdatedAtCore, v as updateSessionLastRoute } from "./session-accessor.sqlite-entry-CJ8WVyje.js";
import "./session-accessor-DMf92PxK.js";
import { c as getActivePluginChannelRegistryVersion } from "./runtime-B980B6n3.js";
import { n as createCommandTurnContext, t as commandTurnKindToSource } from "./command-turn-context-CmPEYNmV.js";
import { i as shouldComputeCommandAuthorized, n as isControlCommandMessage, t as hasControlCommand } from "./command-detection-B0wcgFdq.js";
import { o as resolveAgentRoute, t as buildAgentSessionKey } from "./resolve-route-BBuGiPPu.js";
import "./sessions-4kX-llHk.js";
import { n as resolveSessionEntryResetFreshness } from "./entry-freshness-WwtUSunX.js";
import { a as implicitMentionKindWhen, c as createHostChannelInboundEventContextBuilder, i as resolveStableChannelIngressPolicy, o as resolveInboundMentionDecision, r as resolveChannelIngressPolicy, s as resolveCommandAuthorizedFromAuthorizers, t as createChannelIngressPolicyResolver } from "./runtime-CmHwV-9X.js";
import { n as resolveChannelAccountEntry } from "./account-lookup-CD9t104R.js";
import "./logging-CaOHXBaE.js";
import { n as resolveChannelGroupRequireMention, t as resolveChannelGroupPolicy } from "./group-policy-DW27nR9p.js";
import { d as saveMediaBuffer } from "./store-CiT93cXA.js";
import { t as normalizeInboundTextNewlines } from "./inbound-text-B6lb_yrL.js";
import { a as saveResponseMedia, i as saveRemoteMedia, r as readRemoteMediaBuffer } from "./fetch-CMA20Xer.js";
import { a as createReplyDispatcherWithTyping } from "./reply-dispatcher-LuKlc50k.js";
import { t as finalizeInboundContext } from "./inbound-context-DWtLx7J6.js";
import { n as resolveEffectiveMessagesConfig, r as resolveHumanDelayConfig } from "./identity-XLC8cjlS.js";
import { a as chunkText, c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, o as chunkTextWithMode, r as chunkMarkdownText, s as resolveChunkMode, t as chunkByNewline } from "./chunk-B9HobLHQ.js";
import { a as markdownToIRWithMeta, o as renderMarkdownCodeTable, r as getMarkdownTableSource, s as renderMarkdownTableBullets } from "./ir-DpNqc5lc.js";
import { t as shouldHandleTextCommands } from "./commands-text-routing-DQ8Efmfp.js";
import "./commands-registry-CcaOl4qH.js";
import { n as settleReplyDispatcher, r as withReplyDispatcher } from "./dispatch-dispatcher-eahhxxcq.js";
import { n as matchesMentionPatterns, r as matchesMentionWithExplicit, t as buildMentionRegexes } from "./mentions-C6SIDzUE.js";
import { t as copyConversationBindingRouteFacts } from "./conversation-binding-route-facts-B57TMwN5.js";
import { r as resolveEnvelopeFormatOptions, t as formatAgentEnvelope } from "./envelope-E-FBLYkh.js";
import { c as removeChannelAllowFromStoreEntry, s as readChannelAllowFromStore, u as upsertChannelPairingRequest } from "./pairing-store-DfgcjOc7.js";
import { i as setChannelConversationBindingMaxAgeBySessionKeyAsync, n as setChannelConversationBindingIdleTimeoutBySessionKeyAsync, r as setChannelConversationBindingMaxAgeBySessionKey, t as setChannelConversationBindingIdleTimeoutBySessionKey } from "./conversation-bindings-YtBgHyeC.js";
import { t as recordInboundSession } from "./session-DEKMsIjp.js";
import { t as buildChannelInboundMediaPayload } from "./media-VRARUGPe.js";
import { t as loadChannelOutboundAdapter } from "./load-BS3NjGlp.js";
import { n as recordChannelActivity, t as getChannelActivity } from "./channel-activity-KGHrbxIK.js";
//#region packages/markdown-core/src/tables.ts
function renderTableSource(table, mode) {
	if (mode !== "bullets") {
		const text = renderMarkdownCodeTable(table.headers, table.rows);
		let fenceLength = 3;
		for (const run of text.matchAll(/`+/g)) fenceLength = Math.max(fenceLength, run[0].length + 1);
		const fence = "`".repeat(fenceLength);
		return `${fence}\n${text}${fence}`;
	}
	const source = expectDefined(getMarkdownTableSource(table), "Markdown table source");
	const headers = table.headers.map((text, column) => ({
		text,
		markdown: source.headers[column]
	}));
	const rows = table.rows.map((row, index) => row.map((text, column) => ({
		text,
		markdown: source.rows[index]?.[column]
	})));
	let rendered = "";
	renderMarkdownTableBullets(headers, rows, (text) => {
		rendered += text;
	}, (cell, rowLabel) => {
		rendered += rowLabel ? `**${cell.markdown}**` : cell.markdown;
	});
	return rendered.replace(/\n+$/u, "");
}
/** Convert only parsed table ranges; unrelated Markdown retains its original source bytes. */
function convertMarkdownTables(markdown, mode) {
	if (!markdown || mode === "off" || !markdown.includes("|")) return markdown;
	const { tables } = markdownToIRWithMeta(markdown, {
		linkify: false,
		autolink: false,
		tableMode: "block"
	});
	let cursor = 0;
	let result = "";
	for (const table of tables) {
		const source = expectDefined(getMarkdownTableSource(table), "Markdown table source");
		const rendered = renderTableSource(table, mode).replaceAll("\n", "\n" + source.prefix);
		result += markdown.slice(cursor, source.start) + rendered;
		cursor = source.end;
	}
	return result + markdown.slice(cursor);
}
//#endregion
//#region src/auto-reply/inbound-debounce.ts
/** Resolve effective inbound debounce milliseconds from explicit, channel, and global config. */
function resolveInboundDebounceMs(params) {
	const inbound = params.cfg.messages?.inbound;
	for (const value of [
		params.overrideMs,
		inbound?.byChannel?.[params.channel],
		inbound?.debounceMs
	]) {
		const resolved = resolveOptionalIntegerOption(value, { min: 0 });
		if (resolved !== void 0) return resolved;
	}
	return 0;
}
/**
* Start one flush and bind its admission signal to the turn lifecycle.
* Completion also releases admission for gated work that never enters a session lane.
*/
function createInboundDebounceFlush(params) {
	let resolveAdmission;
	let admitted = false;
	const admission = new Promise((resolve) => {
		resolveAdmission = resolve;
	});
	const markAdmitted = () => {
		if (admitted) return;
		admitted = true;
		resolveAdmission();
	};
	const source = params.lifecycle;
	const lifecycle = {
		abortSignal: source?.abortSignal ?? new AbortController().signal,
		onAdopted: async () => {
			await source?.onAdopted?.();
			markAdmitted();
		},
		onDeferred: () => {
			const accepted = source?.onDeferred?.();
			if (accepted !== false) markAdmitted();
			return accepted;
		},
		onDeferredHeartbeat: () => source?.onDeferredHeartbeat?.(),
		deferredHeartbeatIntervalMs: source?.deferredHeartbeatIntervalMs,
		onAdoptionFinalizing: () => source?.onAdoptionFinalizing?.(),
		onFailed: source?.onFailed ? async (error) => {
			try {
				await source.onFailed?.(error);
			} finally {
				markAdmitted();
			}
		} : void 0,
		onAbandoned: async () => {
			await source?.onAbandoned?.();
		}
	};
	let completion;
	try {
		completion = params.dispatch(lifecycle);
	} catch (error) {
		completion = Promise.reject(toErrorObject(error, "Inbound debounce dispatch failed"));
	}
	completion = completion.then(markAdmitted).catch(async (error) => {
		if (!admitted && lifecycle.onFailed) await Promise.allSettled([lifecycle.onFailed(error)]);
		markAdmitted();
		throw error;
	});
	return {
		admission,
		completion
	};
}
const DEFAULT_MAX_TRACKED_KEYS = 2048;
const MAX_DEBOUNCE_WINDOW_MULTIPLIER = 5;
/** Create a keyed debouncer with flush/cancel controls and same-key serialization. */
function createInboundDebouncer(params) {
	const buffers = /* @__PURE__ */ new Map();
	const pendingBuffers = /* @__PURE__ */ new Map();
	const keyChains = /* @__PURE__ */ new Map();
	const keyGenerations = /* @__PURE__ */ new Map();
	const activeCompletions = /* @__PURE__ */ new Set();
	const defaultDebounceMs = resolveNonNegativeIntegerOption(params.debounceMs, 0);
	const maxTrackedKeys = Math.max(1, Math.trunc(params.maxTrackedKeys ?? DEFAULT_MAX_TRACKED_KEYS));
	const resolveDebounceMs = (item, pending) => {
		const resolved = params.resolveDebounceMs?.(item, pending);
		return resolveNonNegativeIntegerOption(resolved, defaultDebounceMs);
	};
	const resolvePending = (item, key) => {
		const buffer = buffers.get(key);
		return buffer && (params.canAppend?.(item, buffer.items) ?? true) ? buffer : void 0;
	};
	const shouldBuffer = (item) => {
		const key = params.buildKey(item);
		return Boolean(key && resolveDebounceMs(item, resolvePending(item, key)?.items) > 0 && (params.shouldDebounce?.(item) ?? true));
	};
	const untrackBuffer = (key, buffer) => {
		const pending = pendingBuffers.get(key);
		pending?.delete(buffer);
		if (pending?.size === 0) pendingBuffers.delete(key);
	};
	const reportFlushError = (err, items) => {
		try {
			params.onError?.(err, items);
		} catch {}
	};
	const runFlush = async (items) => {
		let flush;
		try {
			flush = params.onFlush(items, createInboundDebounceFlush);
		} catch (err) {
			reportFlushError(err, items);
			return;
		}
		let reported = false;
		const reportOnce = (err) => {
			if (reported) return;
			reported = true;
			reportFlushError(err, items);
		};
		const admission = flush.admission.catch(reportOnce);
		const completion = flush.completion.catch(reportOnce);
		activeCompletions.add(completion);
		const cleanup = () => activeCompletions.delete(completion);
		completion.then(cleanup, cleanup);
		await Promise.race([admission, completion]);
	};
	const cancelItems = (items) => {
		try {
			params.onCancel?.(items);
		} catch {}
	};
	const resolveKeyGeneration = (key) => keyGenerations.get(key) ?? 0;
	const runQueuedFlush = async (key, generation, items) => {
		if (resolveKeyGeneration(key) !== generation) {
			cancelItems(items);
			return;
		}
		await runFlush(items);
	};
	const enqueueKeyTask = (key, task) => {
		const next = (keyChains.get(key) ?? Promise.resolve()).catch(() => void 0).then(task);
		const settled = next.catch(() => void 0);
		keyChains.set(key, settled);
		const cleanup = () => {
			if (keyChains.get(key) === settled) {
				keyChains.delete(key);
				if (!buffers.has(key)) keyGenerations.delete(key);
			}
		};
		settled.then(cleanup, cleanup);
		return next;
	};
	const runKeyTaskNow = (key, task) => {
		let resolveSettled;
		const settled = new Promise((resolve) => {
			resolveSettled = resolve;
		});
		keyChains.set(key, settled);
		const cleanup = () => {
			resolveSettled();
			if (keyChains.get(key) === settled) {
				keyChains.delete(key);
				if (!buffers.has(key)) keyGenerations.delete(key);
			}
		};
		let next;
		try {
			next = task();
		} catch (err) {
			cleanup();
			throw err;
		}
		next.then(cleanup, cleanup);
		return next;
	};
	const enqueueReservedKeyTask = (key, task) => {
		let readyReleased = false;
		let releaseReady;
		const ready = new Promise((resolve) => {
			releaseReady = resolve;
		});
		return {
			task: enqueueKeyTask(key, async () => {
				await ready;
				await task();
			}),
			release: () => {
				if (readyReleased) return;
				readyReleased = true;
				releaseReady();
			}
		};
	};
	const releaseBuffer = (buffer) => {
		if (buffer.readyReleased) return;
		buffer.readyReleased = true;
		buffer.releaseReady();
	};
	const flushBuffer = async (key, buffer) => {
		if (buffers.get(key) === buffer) buffers.delete(key);
		if (buffer.timeout) {
			clearTimeout(buffer.timeout);
			buffer.timeout = null;
		}
		releaseBuffer(buffer);
		await buffer.task;
	};
	const flushKey = async (key) => {
		const buffer = buffers.get(key);
		if (!buffer) return;
		await flushBuffer(key, buffer);
	};
	const cancelKey = (key) => {
		const pending = pendingBuffers.get(key);
		if (!pending?.size && !keyChains.has(key)) return false;
		keyGenerations.set(key, resolveKeyGeneration(key) + 1);
		for (const buffer of pending ?? []) {
			if (buffers.get(key) === buffer) buffers.delete(key);
			if (buffer.timeout) {
				clearTimeout(buffer.timeout);
				buffer.timeout = null;
			}
			const canceledItems = buffer.items;
			buffer.items = [];
			cancelItems(canceledItems);
			releaseBuffer(buffer);
		}
		pendingBuffers.delete(key);
		return true;
	};
	const scheduleFlush = (key, buffer) => {
		if (buffer.timeout) clearTimeout(buffer.timeout);
		const delayMs = Math.min(buffer.debounceMs, Math.max(0, buffer.flushDeadlineMs - performance.now()));
		buffer.timeout = setTimeout(() => {
			flushBuffer(key, buffer);
		}, delayMs);
		buffer.timeout.unref?.();
	};
	const enqueue = async (item) => {
		const key = params.buildKey(item);
		const existing = key ? resolvePending(item, key) : void 0;
		const debounceMs = resolveDebounceMs(item, existing?.items);
		if (!(debounceMs > 0 && (params.shouldDebounce?.(item) ?? true)) || !key) {
			if (key) {
				if (buffers.has(key)) {
					const generation = resolveKeyGeneration(key);
					const reservedTask = enqueueReservedKeyTask(key, async () => {
						await runQueuedFlush(key, generation, [item]);
					});
					try {
						await flushKey(key);
					} finally {
						reservedTask.release();
					}
					await reservedTask.task;
					return;
				}
				if (keyChains.has(key)) {
					const generation = resolveKeyGeneration(key);
					await enqueueKeyTask(key, async () => {
						await runQueuedFlush(key, generation, [item]);
					});
					return;
				}
				if (params.serializeImmediate) {
					await runKeyTaskNow(key, async () => {
						await runFlush([item]);
					});
					return;
				}
				await runFlush([item]);
			} else await runFlush([item]);
			return;
		}
		if (existing) {
			existing.items.push(item);
			existing.debounceMs = debounceMs;
			scheduleFlush(key, existing);
			return;
		}
		if (key && buffers.has(key)) flushKey(key);
		if (!(keyChains.has(key) || keyChains.size < maxTrackedKeys)) {
			const generation = resolveKeyGeneration(key);
			await enqueueKeyTask(key, async () => {
				await runQueuedFlush(key, generation, [item]);
			});
			return;
		}
		const generation = resolveKeyGeneration(key);
		const reservedTask = enqueueReservedKeyTask(key, async () => {
			untrackBuffer(key, buffer);
			if (buffer.items.length === 0) return;
			const items = buffer.items;
			if (resolveKeyGeneration(key) !== generation) buffer.items = [];
			await runQueuedFlush(key, generation, items);
		});
		const buffer = {
			items: [item],
			timeout: null,
			debounceMs,
			flushDeadlineMs: performance.now() + Math.max(debounceMs, resolveNonNegativeIntegerOption(typeof params.maxWaitMs === "function" ? params.maxWaitMs(item) : params.maxWaitMs, debounceMs * MAX_DEBOUNCE_WINDOW_MULTIPLIER)),
			releaseReady: reservedTask.release,
			readyReleased: false,
			task: reservedTask.task
		};
		buffers.set(key, buffer);
		const pending = pendingBuffers.get(key) ?? /* @__PURE__ */ new Set();
		pending.add(buffer);
		pendingBuffers.set(key, pending);
		scheduleFlush(key, buffer);
	};
	const drain = async () => {
		while (keyChains.size > 0 || activeCompletions.size > 0) await Promise.all([...keyChains.values(), ...activeCompletions]);
	};
	return {
		enqueue,
		shouldBuffer,
		flushKey,
		cancelKey,
		drain
	};
}
//#endregion
//#region src/channels/ack-reactions.ts
/** Channel-level policy for which inbound messages should receive an ack reaction. */
/** Resolves the generic ack reaction gate without sending or removing reactions. */
function shouldAckReaction(params) {
	const scope = params.scope ?? "group-mentions";
	if (scope === "off" || scope === "none") return false;
	if (params.inboundEventKind === "room_event" && scope !== "all") return false;
	if (scope === "all") return true;
	if (scope === "direct") return params.isDirect;
	if (scope === "group-all") return params.isGroup;
	if (scope === "group-mentions") {
		if (!params.isMentionableGroup) return false;
		if (!params.canDetectMention) return false;
		return params.effectiveWasMentioned || params.shouldBypassMention === true;
	}
	return false;
}
/** Starts sending an ack reaction and returns the success-tracking cleanup handle. */
function createAckReactionHandle(params) {
	const ackReactionValue = params.ackReactionValue.trim();
	if (!ackReactionValue) return null;
	let sendPromise;
	try {
		sendPromise = params.send();
	} catch (err) {
		sendPromise = Promise.reject(toErrorObject(err, "Non-Error rejection"));
	}
	return {
		ackReactionPromise: sendPromise.then(() => true, (err) => {
			params.onSendError?.(err);
			return false;
		}),
		ackReactionValue,
		remove: params.remove
	};
}
/** Schedules removal of a previously sent ack reaction after reply delivery. */
function removeAckReactionAfterReply(params) {
	if (!params.removeAfterReply) return;
	if (!params.ackReactionPromise) return;
	if (!params.ackReactionValue) return;
	params.ackReactionPromise.then((didAck) => {
		if (!didAck) return;
		params.remove().catch((err) => params.onError?.(err));
	});
}
/** Convenience wrapper that removes an ack reaction handle after reply delivery. */
function removeAckReactionHandleAfterReply(params) {
	removeAckReactionAfterReply({
		removeAfterReply: params.removeAfterReply,
		ackReactionPromise: params.ackReaction?.ackReactionPromise ?? null,
		ackReactionValue: params.ackReaction?.ackReactionValue ?? null,
		remove: params.ackReaction?.remove ?? (async () => {}),
		onError: params.onError
	});
}
//#endregion
//#region src/security/context-visibility.ts
/** Evaluates one supplemental context item against mode, kind, and sender allowlist state. */
function evaluateSupplementalContextVisibility(params) {
	if (params.mode === "all") return {
		include: true,
		reason: "mode_all"
	};
	if (params.senderAllowed) return {
		include: true,
		reason: "sender_allowed"
	};
	if (params.mode === "allowlist_quote" && params.kind === "quote") return {
		include: true,
		reason: "quote_override"
	};
	return {
		include: false,
		reason: "blocked"
	};
}
/** Boolean shorthand for callers that do not need the audit reason. */
function shouldIncludeSupplementalContext(params) {
	return evaluateSupplementalContextVisibility(params).include;
}
//#endregion
//#region src/channels/inbound-event/context.ts
/**
* Channel inbound event context builder.
*
* Converts route, sender, command, media, and supplemental facts into finalized message context.
*/
function keepSupplementalContext(params) {
	if (!params.mode || params.mode === "all") return true;
	if (params.senderAllowed === void 0) return false;
	return shouldIncludeSupplementalContext({
		mode: params.mode,
		kind: params.kind,
		senderAllowed: params.senderAllowed
	});
}
function filterChannelInboundSupplementalContext(params) {
	const supplemental = params.supplemental;
	if (!supplemental) return;
	const quote = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "quote",
		senderAllowed: supplemental.quote?.senderAllowed
	}) ? supplemental.quote : void 0;
	const forwarded = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "forwarded",
		senderAllowed: supplemental.forwarded?.senderAllowed
	}) ? supplemental.forwarded : void 0;
	const thread = keepSupplementalContext({
		mode: params.contextVisibility,
		kind: "thread",
		senderAllowed: supplemental.thread?.senderAllowed
	}) ? supplemental.thread : void 0;
	return {
		...supplemental,
		quote,
		forwarded,
		thread
	};
}
function definedFields(fields) {
	return Object.fromEntries(Object.entries(fields).filter((entry) => entry[1] !== void 0));
}
function stripQuoteRuntimeFields(quote) {
	const { media: _media, isSelf: _isSelf, ...stripped } = quote;
	return stripped;
}
function resolveChannelInboundSupplementalForFinalizer(params) {
	const rawSupplemental = params.supplemental;
	const filtered = filterChannelInboundSupplementalContext({
		supplemental: rawSupplemental,
		contextVisibility: params.contextVisibility
	});
	const media = [...params.media ?? []];
	if (!rawSupplemental?.quote || !filtered?.quote) return {
		rawSupplemental,
		supplemental: filtered,
		media
	};
	const quote = filtered.quote;
	const selfQuote = quote.isSelf === true;
	const suppressSelfQuoteBody = params.suppressSelfQuoteBody ?? true;
	const suppressSelfQuoteMedia = params.suppressSelfQuoteMedia ?? true;
	const finalizeQuote = (quoteMedia) => {
		if (!(selfQuote && suppressSelfQuoteMedia)) media.push(...quoteMedia ?? []);
		const stripped = stripQuoteRuntimeFields(quote);
		const visibleQuote = selfQuote && suppressSelfQuoteBody ? (({ body: _body, ...withoutBody }) => withoutBody)(stripped) : stripped;
		return {
			rawSupplemental,
			supplemental: {
				...filtered,
				quote: visibleQuote
			},
			media
		};
	};
	if (selfQuote && suppressSelfQuoteMedia) return finalizeQuote(void 0);
	if (!params.resolveSupplementalMedia) return finalizeQuote(Array.isArray(quote.media) ? quote.media : void 0);
	if (typeof quote.media !== "function") return finalizeQuote(quote.media);
	const resolved = quote.media();
	return isPromiseLike(resolved) ? resolved.then(finalizeQuote) : finalizeQuote(resolved);
}
function finalizePreparedChannelInboundContext(params) {
	const mediaPayload = params.media ? definedFields(buildChannelInboundMediaPayload([...params.media])) : {};
	const baseContext = {
		...params.originalContext,
		SupplementalContext: params.supplemental,
		...params.media ? { media: [...params.media] } : {},
		...mediaPayload
	};
	const channelStructuredContext = resolveChannelStructuredContext({
		supplemental: params.supplemental,
		extra: baseContext
	});
	const structuredContextField = channelStructuredContext.kind === "present" ? { ChannelStructuredContext: channelStructuredContext.entries } : {};
	return {
		context: (params.finalize ?? finalizeInboundContext)({
			...baseContext,
			...structuredContextField
		}, params.finalizeOptions),
		supplemental: params.supplemental,
		quoteHidden: Boolean(params.rawSupplemental?.quote && !params.supplemental?.quote),
		forwardedHidden: Boolean(params.rawSupplemental?.forwarded && !params.supplemental?.forwarded),
		threadHidden: Boolean(params.rawSupplemental?.thread && !params.supplemental?.thread)
	};
}
function finalizeChannelInboundContextValue(params) {
	const contextSupplemental = params.context.SupplementalContext;
	const prepared = resolveChannelInboundSupplementalForFinalizer({
		supplemental: params.supplemental ?? contextSupplemental,
		contextVisibility: params.contextVisibility,
		media: params.media,
		resolveSupplementalMedia: params.resolveSupplementalMedia,
		suppressSelfQuoteBody: params.suppressSelfQuoteBody,
		suppressSelfQuoteMedia: params.suppressSelfQuoteMedia
	});
	const finish = (result) => finalizePreparedChannelInboundContext({
		originalContext: params.context,
		finalize: params.finalize,
		finalizeOptions: params.finalizeOptions,
		...result
	});
	if (params.resolveSupplementalMedia) return Promise.resolve(prepared).then(finish);
	return isPromiseLike(prepared) ? prepared.then(finish) : finish(prepared);
}
function resolveIngressCommandAuthorized(access) {
	return access?.commands?.authorized;
}
function normalizeUntrustedGroupPrompt(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeInboundTextNewlines(value);
	return normalized.trim().length > 0 ? normalized : void 0;
}
function resolveChannelStructuredContext(params) {
	const entries = [];
	const extraEntries = params.extra?.ChannelStructuredContext ?? params.extra?.UntrustedStructuredContext;
	if (Array.isArray(extraEntries)) entries.push(...extraEntries);
	const supplementalEntries = params.supplemental?.channelStructuredContext ?? params.supplemental?.untrustedContext;
	if (supplementalEntries !== void 0) entries.push(...supplementalEntries);
	const groupPrompt = normalizeUntrustedGroupPrompt(params.supplemental?.untrustedGroupSystemPrompt);
	if (groupPrompt) entries.push({
		label: "Group prompt context",
		type: "group_prompt_context",
		payload: { text: groupPrompt }
	});
	return extraEntries !== void 0 || supplementalEntries !== void 0 || groupPrompt !== void 0 ? {
		kind: "present",
		entries
	} : { kind: "absent" };
}
function resolveChannelCommandContext(params) {
	if (params.commandTurn) return params.commandTurn;
	const command = params.command;
	if (!command) return;
	const body = command.body ?? params.message.commandBody ?? params.message.rawBody;
	return createCommandTurnContext(commandTurnKindToSource(command.kind), {
		authorized: command.kind === "normal" ? false : command.authorized ?? resolveIngressCommandAuthorized(params.access) === true,
		commandName: command.name,
		body
	});
}
function buildChannelInboundEventContext(params) {
	return buildChannelInboundEventContextValue(params);
}
createHostChannelInboundEventContextBuilder(buildChannelInboundEventContextValue);
function buildChannelInboundEventContextValue(params) {
	const body = params.message.body ?? params.message.rawBody;
	const commandTurn = resolveChannelCommandContext({
		command: params.command,
		commandTurn: params.commandTurn,
		message: params.message,
		access: params.access
	});
	const context = {
		Body: body,
		InboundEventKind: params.message.inboundEventKind ?? "user_request",
		BodyForAgent: params.message.bodyForAgent ?? params.message.rawBody,
		InboundHistory: params.message.inboundHistory,
		SessionTranscriptContext: params.sessionTranscript && params.sessionTranscript.historyLimit > 0 ? params.sessionTranscript : void 0,
		SourceModality: params.message.sourceModality,
		RawBody: params.message.rawBody,
		CommandBody: params.message.commandBody ?? params.message.rawBody,
		BodyForCommands: params.message.commandBody ?? params.message.rawBody,
		From: params.from,
		To: params.reply.to,
		SessionKey: params.route.dispatchSessionKey ?? params.route.routeSessionKey,
		AgentId: params.route.agentId,
		DmScope: params.route.dmScope,
		AccountId: params.route.accountId ?? params.accountId,
		ParentSessionKey: params.route.parentSessionKey,
		ModelParentSessionKey: params.route.modelParentSessionKey,
		MessageSid: params.messageId,
		MessageSidFull: params.messageIdFull,
		ReplyToId: params.reply.replyToId,
		ReplyToIdFull: params.reply.replyToIdFull,
		ChatType: params.conversation.kind,
		ChatId: params.conversation.id,
		ConversationRoutePeerId: params.conversation.routePeer?.id,
		ConversationLabel: params.conversation.label,
		GroupSubject: params.conversation.kind !== "direct" ? params.conversation.label : void 0,
		GroupSpace: params.conversation.spaceId,
		SenderName: params.sender.name ?? params.sender.displayLabel,
		SenderId: params.sender.id,
		SenderUsername: params.sender.username,
		SenderTag: params.sender.tag,
		SenderIsBot: params.sender.isBot,
		SenderIsSelf: params.sender.isSelf === true ? true : void 0,
		MemberRoleIds: params.sender.roles,
		Timestamp: params.timestamp,
		Provider: params.provider ?? params.channel,
		Surface: params.surface ?? params.provider ?? params.channel,
		WasMentioned: params.access?.mentions?.wasMentioned,
		GroupRequireMention: params.access?.mentions?.requireMention,
		ExplicitlyMentionedBot: params.access?.mentions?.explicitlyMentionedBot,
		MentionedUserIds: params.access?.mentions?.mentionedUserIds,
		MentionedSubteamIds: params.access?.mentions?.mentionedSubteamIds,
		ImplicitMentionKinds: params.access?.mentions?.implicitMentionKinds,
		MentionSource: params.access?.mentions?.mentionSource,
		CommandAuthorized: resolveIngressCommandAuthorized(params.access) === true,
		ConversationToolPolicy: params.access?.toolPolicy,
		CommandTurn: commandTurn,
		MessageThreadId: params.reply.messageThreadId ?? params.conversation.threadId,
		NativeChannelId: params.reply.nativeChannelId ?? params.conversation.nativeChannelId,
		ConversationAvatar: params.conversation.avatar,
		ChannelContext: params.channelContext,
		OriginatingChannel: params.channel,
		OriginatingTo: params.reply.originatingTo ?? params.reply.to,
		ThreadParentId: params.reply.threadParentId ?? params.conversation.parentId,
		InboundAccessAuthorized: true,
		ConversationRouteContextObserved: params.conversation.routePeer ? true : void 0,
		...params.extra
	};
	copyConversationBindingRouteFacts(params.route, context);
	const finalizeParams = {
		finalize: params.finalize,
		finalizeOptions: params.finalizeOptions,
		supplemental: params.supplemental,
		contextVisibility: params.contextVisibility,
		media: params.media,
		context
	};
	const result = params.resolveSupplementalMedia ? finalizeChannelInboundContextValue({
		...finalizeParams,
		resolveSupplementalMedia: true,
		suppressSelfQuoteBody: params.suppressSelfQuoteBody,
		suppressSelfQuoteMedia: params.suppressSelfQuoteMedia
	}) : finalizeChannelInboundContextValue(finalizeParams);
	const unwrap = (finalized) => finalized.context;
	return isPromiseLike(result) ? result.then(unwrap) : unwrap(result);
}
//#endregion
//#region src/config/markdown-tables.ts
function buildDefaultTableModes() {
	return new Map(listChannelPlugins().flatMap((plugin) => {
		const defaultMarkdownTableMode = plugin.messaging?.defaultMarkdownTableMode;
		return defaultMarkdownTableMode ? [[plugin.id, defaultMarkdownTableMode]] : [];
	}).toSorted(([left], [right]) => left.localeCompare(right)));
}
let cachedDefaultTableModes = null;
let cachedDefaultTableModesRegistryVersion = null;
function getDefaultTableModes() {
	const registryVersion = getActivePluginChannelRegistryVersion();
	if (!cachedDefaultTableModes || cachedDefaultTableModesRegistryVersion !== registryVersion) {
		cachedDefaultTableModes = buildDefaultTableModes();
		cachedDefaultTableModesRegistryVersion = registryVersion;
	}
	return cachedDefaultTableModes;
}
const isMarkdownTableMode = (value) => value === "off" || value === "bullets" || value === "code" || value === "block";
function resolveMarkdownModeFromSection(section, channel, accountId) {
	if (!section) return;
	const normalizedAccountId = normalizeAccountId(accountId);
	const accounts = section.accounts;
	if (accounts && typeof accounts === "object") {
		const matchMode = resolveChannelAccountEntry(accounts, normalizedAccountId, channel)?.markdown?.tables;
		if (isMarkdownTableMode(matchMode)) return matchMode;
	}
	const sectionMode = section.markdown?.tables;
	return isMarkdownTableMode(sectionMode) ? sectionMode : void 0;
}
function resolveMarkdownTableMode(params) {
	const channel = normalizeChannelId(params.channel);
	const defaultMode = channel ? getDefaultTableModes().get(channel) ?? "code" : "code";
	let resolved = defaultMode;
	if (channel && params.cfg) {
		const channelsConfig = params.cfg.channels;
		const rootConfig = params.cfg;
		resolved = resolveMarkdownModeFromSection(channelsConfig?.[channel] ?? rootConfig[channel], channel, params.accountId) ?? defaultMode;
	}
	return resolved === "block" && !params.supportsBlockTables ? "code" : resolved;
}
//#endregion
//#region src/pairing/pairing-messages.ts
function buildPairingReply(params) {
	const { channel, idLine, code } = params;
	return [
		"Assistant: access not configured.",
		"",
		idLine,
		"Pairing code:",
		"```",
		code,
		"```",
		"",
		"Ask the bot owner to approve with:",
		"```",
		formatCliCommand(`testclaw pairing approve ${channel} ${code}`),
		"```"
	].join("\n");
}
//#endregion
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
const dispatchLowLevelChannelReplyFromConfig = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./dispatch-from-config-B7WYify9.js")), (runtime) => runtime.dispatchLowLevelChannelReplyFromConfig);
const dispatchReplyWithBufferedBlockDispatcherCore = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./provider-dispatcher-C6CEuInS.js")), (runtime) => runtime.dispatchReplyWithBufferedBlockDispatcherCore);
const loadChannelTurnLifecycle = createLazyRuntimeModule(() => import("./lifecycle-CeTCCz8E.js"));
const dispatchAssembledChannelTurn = createLazyRuntimeMethod(loadChannelTurnLifecycle, (runtime) => runtime.dispatchAssembledChannelTurn);
const loadPreparedChannelTurn = createLazyRuntimeModule(() => import("./execution-CikU4hYt.js"));
const runPreparedChannelTurn = async (params) => (await loadPreparedChannelTurn()).runPreparedChannelTurn(params);
const runChannelTurn = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./run-channel-turn-snRWdj_8.js")), (runtime) => runtime.runChannelTurn);
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
