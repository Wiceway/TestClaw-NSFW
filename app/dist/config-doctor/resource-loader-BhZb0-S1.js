import { n as __exportAll } from "./rolldown-runtime-B000p9w_.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as estimateStringChars } from "./src-D9uQ497Z.js";
import { l as truncateCodePoints } from "./directive-tags-CEERLSA1.js";
import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.js";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { O as resolveIntegerOption, g as parseDateFirstTimestampMs, j as resolvePositiveTimerTimeoutMs, x as parseStrictNonNegativeInteger } from "./number-coercion-0M4tZV2c.js";
import { i as readResponseWithLimit } from "./http-response-body-BEF2-H0F.js";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-DsCfAx8q.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { h as sleep } from "./utils-BfoJTy8l.js";
import { O as walkDirectorySync } from "./fs-safe-CZ3jhUUr.js";
import { s as isDefaultStateDir } from "./paths-DeOFr7iP.js";
import { o as prepareModelVisibleToolTextBlock } from "./redact-myZeUWr_.js";
import { f as mergeDeep } from "./includes-Be6ircIw.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import { d as takeCodeModeResponseSource, u as prepareCodeModeSourceAppend } from "./transcript-redact-C2CfuzTs.js";
import "./transcript-payload-BaqIXvVM.js";
import { l as resolvePendingRuntimeContextReplay, m as stripRuntimeContextCustomMessages } from "./internal-runtime-context-Bn0Ci0G3.js";
import { b as resolveOpenAIThinkingApi, v as MODEL_CATALOG_THINKING_LEVELS } from "./manifest-DQTAOZoC.js";
import { r as replaceFileAtomicSync } from "./replace-file-GThucKH8.js";
import { c as buildPluginLoaderAliasMap, l as buildPluginLoaderJitiOptions, o as installAssistantInternalCorePackageNativeResolver } from "./plugin-module-loader-cache-DFZdUh0W.js";
import { c as runPluginStreamConsumer } from "./plugin-instance-scope-B1RUw70q.js";
import "./defaults-BbU4k6fu.js";
import { l as acquireFileLockSyncWithRetry } from "./update-managed-service-handoff-lease-BvLK_tcK.js";
import { n as parseGitUrl } from "./cloud-worker-project-profiles-DJ5jtY5M.js";
import { a as createToolCallOccurrenceQueue, f as selectResetKeptEntries } from "./tool-result-pairing-9JojAaN6.js";
import { r as stripToolResultDetails } from "./model-context-message-BMr0fCKI.js";
import { i as sameSessionTranscriptTargetBinding } from "./transcript-target-binding-CriGFpOg.js";
import { n as attachRuntimePromptMediaFacts } from "./media-facts-CfqEsuNX.js";
import { G as applyAssistantDeliveryDirectives } from "./session-accessor.sqlite-transcript-store-BX2GNujg.js";
import { f as withSessionMetadataPublication, i as captureOwnedTranscriptWriteAssertion, p as withSessionTranscriptWriteAssertion } from "./transcript-write-context-CW-keGmb.js";
import { a as BRANCH_SUMMARY_PREFIX, c as COMPACTION_SUMMARY_SUFFIX, d as isRuntimeContextCarrier, i as projectSessionEntryMessage, l as bashExecutionToText, o as BRANCH_SUMMARY_SUFFIX, s as COMPACTION_SUMMARY_PREFIX, t as buildSessionContext, u as convertToLlm } from "./session-BKH3neS_.js";
import { l as makeZeroUsageSnapshot } from "./usage-C3K3M4jZ.js";
import { d as resolveClaudeOpus5ModelIdentity, f as resolveClaudeSonnet5ModelIdentity, s as resolveClaudeFable5ModelIdentity } from "./anthropic-DBfWwdAm.js";
import { t as createWindowsOutputDecoder } from "./windows-encoding-CzxaGNeo.js";
import { o as createCommandTerminationController, u as releaseChildProcessOutputAfterExit } from "./exec-BXnQTpXR.js";
import { c as waitForCommandSpawn, o as spawnCommand } from "./exec-spawn-USR_FeKZ.js";
import { d as getInternalSteeringQueueObserver, f as getInternalSyncSteeringGetter, g as takeInternalToolBatchLifecycle, l as copyInternalToolResultState, n as appendToolLoopWarning, p as getInternalToolExecutionPreparer, r as attachInternalSyncSteeringGetter, u as getInternalBeforeToolBatch } from "./internal-hooks-A8m3oGkR.js";
import { r as isToolResultError } from "./tool-result-error-BN3NyZD4.js";
import "./http-body-C9nYeJpi.js";
import { n as resolveJsonSaveTarget } from "./json-file-CEHpXMgm.js";
import { n as createSyntheticSourceInfo, t as createSourceInfo } from "./source-info-CcFiWAof.js";
import { u as extractFrontmatterBlock } from "./frontmatter-CvTr0Utu.js";
import { t as parseSkillFrontmatter } from "./frontmatter-S6p9FeWJ.js";
import { a as FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE, i as AuthStorage, n as getModelRegistryRuntime, o as FileAuthStorageBackend, r as AUTH_STORAGE_CREATE_DEPRECATION_CODE, s as InMemoryAuthStorageBackend, t as ModelRegistry } from "./model-registry-UE0EOYQn.js";
import { i as OAuthProviderConfiguredUnavailableError } from "./oauth-zMW97kBk.js";
import { t as getAgentDir } from "./config-Uq6HcsCP.js";
import { n as createStreamingBinaryOutputSanitizer } from "./shell-utils-Bvgm8qFu.js";
import { i as PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, t as isRetryableAssistantError } from "./retry-aTvyL7NL.js";
import { n as validateToolCall$1, t as validateToolArguments$1 } from "./src-tM8aLYtL.js";
import { o as getStreamLlmRuntime } from "./model-runtime-binding-Dcvog-Jx.js";
import { i as wrapUntrustedPromptDataBlock } from "./sanitize-for-prompt-C5q9LjmF.js";
import { r as isLocalPath, t as canonicalizePath } from "./paths-CIwQeLl6.js";
import { A as createBashToolDefinition, B as OutputAccumulator, C as createEditToolDefinition, F as interactiveAgentTheme, G as truncateHead, H as DEFAULT_MAX_BYTES, I as loadThemeFromPath, K as truncateLine, M as wrapToolDefinition, N as wrapToolDefinitions, P as createLocalBashOperations, R as addIgnoreRules, S as createEditTool, T as withFileMutationQueue, U as DEFAULT_MAX_LINES, W as formatSize, _ as createLsToolDefinition, a as createCodingTools, b as createFindTool, c as createTool, d as createWriteToolDefinition, f as createReadTool, g as createLsTool, i as createCodingToolDefinitions, j as createToolDefinitionFromAgentTool, k as createBashTool, l as createToolDefinition, n as createAllToolDefinitions, o as createReadOnlyToolDefinitions, p as createReadToolDefinition, q as truncateTail, r as createAllTools, s as createReadOnlyTools, t as allToolNames, u as createWriteTool, v as createGrepTool, x as createFindToolDefinition, y as createGrepToolDefinition, z as normalizeNativePathSeparators } from "./tools-FoyuW2o_.js";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-CLDNGDNd.js";
import { t as materializeSkill } from "./skill-materializer-DoslpeET.js";
import { t as classifyRateLimitWindow } from "./retry-evidence-r2MRZSDb.js";
import { n as extractToolResultId, t as extractToolCallsFromAssistant } from "./tool-call-id-DDGKoPAb.js";
import { n as repairToolUseResultPairing } from "./session-transcript-repair-BNL2e-6A.js";
import { a as migrateSessionEntries, c as normalizeLoadedFileEntry, d as generateSessionEntryId, f as uuidv7, l as parseSessionEntries, n as getLatestCompactionEntry, t as buildSessionContext$1 } from "./session-manager-codec-CSC986xU.js";
import { n as TranscriptNotContinuableError } from "./errors-DahFK5Nq.js";
import { n as runWithAgentToolExecutionContext } from "./tool-execution-context-C6v2UVPI.js";
import { t as event_stream_exports } from "./event-stream-IPGDcRrP.js";
import { i as streamSimple, n as completeSimple, r as stream, t as complete } from "./stream-Dln_s4hO.js";
import { n as resolveEnvNodeProxyUrlForTarget, t as createFixedNodeProxyAgentPair } from "./node-proxy-agent-DVVQhl0E.js";
import { r as stripStaleThinkingSignaturesForCompactionReplay } from "./thinking-signatures-Dc2B2Swm.js";
import { n as SessionMetadataCommittedError, t as SessionManager } from "./session-manager-B9vSB5Dk.js";
import { t as withSessionManagerWrite } from "./session-manager-write-admission-BvxhBa55.js";
import { o as mergePreparedUserTurnMessageForRuntime } from "./user-turn-transcript.message-W5Lni2jm.js";
import { n as readRuntimePromptImageFactIndexes } from "./runtime-prompt-image-provenance-B1mrHw2J.js";
import { n as createMessageInjectionAuthority } from "./message-injection-authority-CJuS3j6I.js";
import { a as getExamplesPath, i as getDocsPath, n as CONFIG_DIR_NAME, o as getReadmePath, r as PACKAGE_MANIFEST_VERSION, s as isBunBinary } from "./tools-manager-CYHvkyJr.js";
import "./messages-DfCykjPA.js";
import { createRequire } from "node:module";
import * as fs$1 from "node:fs";
import { chmodSync, existsSync, globSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as os$1 from "node:os";
import { homedir } from "node:os";
import * as path$1 from "node:path";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import * as bundledTypebox from "typebox";
import chalk from "chalk";
import { EventEmitter } from "node:events";
import { createHash } from "node:crypto";
import * as bundledTypeboxGuard from "typebox/guard";
import * as bundledTypeboxSchema from "typebox/schema";
import * as bundledTypeboxFormat from "typebox/format";
import * as bundledTypeboxValue from "typebox/value";
import * as bundledTypeboxCompile from "typebox/compile";
import { isCompactionReplayCheckpoint, replaceCompactionReplayOwnerContent } from "@testclaw/ai/transports";
import { calculateCost, clampThinkingLevel, clampThinkingLevel as clampThinkingLevel$1, cleanupSessionResources, createSseByteGuard, createToolArgumentPreviewSchedule, createToolArgumentPreviewSchedule as createToolArgumentPreviewSchedule$1, getApiProvider, getApiProviders, getEnvApiKey as getEnvApiKey$1, getSupportedThinkingLevels, isContextOverflow, modelsAreEqual, parseStreamingJson, parseStreamingJson as parseStreamingJson$1, parseTerminalToolCallArguments, sanitizeSurrogates as sanitizeSurrogates$1 } from "@testclaw/ai/internal/runtime";
import { adjustMaxTokensForThinking, buildBaseOptions, clampReasoning, transformMessages } from "@testclaw/ai/internal/shared";
import { isResponsesOutputLimitToolCallError } from "@testclaw/ai/diagnostics";
import { parse as parse$1 } from "yaml";
import { minimatch } from "minimatch";
import { validateToolArguments } from "@testclaw/ai/validation";
import * as bundledTypeboxError from "typebox/error";
import * as bundledTypeboxSystem from "typebox/system";
import * as bundledTypeboxType from "typebox/type";
//#region packages/llm-core/src/utils/event-stream.ts
const thinkingAppends = /* @__PURE__ */ new WeakMap();
const eventStreamCompletions = /* @__PURE__ */ new WeakMap();
/** Generic async-iterable event stream with a separately awaited final result. */
var EventStream$1 = class {
	constructor(isComplete, extractResult) {
		this.queue = [];
		this.queueHead = 0;
		this.waiting = [];
		this.done = false;
		this.resultSettled = false;
		this.isComplete = isComplete;
		this.extractResult = extractResult;
		this.finalResultPromise = new Promise((resolve, reject) => {
			this.resolveFinalResult = resolve;
			this.rejectFinalResult = reject;
		});
		eventStreamCompletions.set(this, this.finalResultPromise);
	}
	push(event) {
		if (this.done) return;
		if (this.isComplete(event)) {
			this.done = true;
			this.resultSettled = true;
			this.resolveFinalResult(this.extractResult(event));
		}
		const waiter = this.waiting.shift();
		if (waiter) waiter({
			value: event,
			done: false
		});
		else this.queue.push(event);
	}
	end(result) {
		this.done = true;
		if (result !== void 0) {
			this.resultSettled = true;
			this.resolveFinalResult(result);
		} else if (!this.resultSettled) {
			this.resultSettled = true;
			this.finalResultPromise.catch(() => {});
			this.rejectFinalResult(/* @__PURE__ */ new Error("event stream ended without a terminal event or final result"));
		}
		while (this.waiting.length > 0) {
			const waiter = this.waiting.shift();
			if (!waiter) break;
			waiter({
				value: void 0,
				done: true
			});
		}
	}
	async *[Symbol.asyncIterator]() {
		while (true) if (this.queueHead < this.queue.length) {
			const event = this.queue[this.queueHead];
			this.queue[this.queueHead] = void 0;
			this.queueHead += 1;
			if (this.queueHead >= 1024 && this.queueHead * 2 >= this.queue.length) {
				this.queue = this.queue.slice(this.queueHead);
				this.queueHead = 0;
			}
			yield event;
		} else if (this.done) return;
		else {
			const result = await new Promise((resolve) => {
				this.waiting.push(resolve);
			});
			if (result.done) return;
			yield result.value;
		}
	}
	result() {
		return this.finalResultPromise;
	}
};
/** Assistant-message event stream that resolves on done/error terminal events. */
var AssistantMessageEventStream = class extends EventStream$1 {
	push(event) {
		if (event.type === "thinking_delta" || event.type === "thinking_end") {
			const block = event.partial.content[event.contentIndex];
			if (block?.type === "thinking") {
				if (this.done || event.type === "thinking_end") {
					thinkingAppends.delete(block);
					this.activeThinkingBlocks?.delete(block);
				} else if (thinkingAppends.has(block)) (this.activeThinkingBlocks ??= /* @__PURE__ */ new Set()).add(block);
			}
		}
		if (event.type === "done" || event.type === "error") this.clearThinkingAppends(event.type === "done" ? event.message : event.error);
		super.push(event);
	}
	end(result) {
		this.clearThinkingAppends(result);
		super.end(result);
	}
	clearThinkingAppends(message) {
		for (const block of message?.content ?? []) if (block.type === "thinking") thinkingAppends.delete(block);
		for (const block of this.activeThinkingBlocks ?? []) thinkingAppends.delete(block);
		this.activeThinkingBlocks = void 0;
	}
	constructor() {
		super((event) => event.type === "done" || event.type === "error", (event) => {
			if (event.type === "done") return event.message;
			else if (event.type === "error") return event.error;
			throw new Error("Unexpected event type for final result");
		});
	}
};
/** Creates an assistant-message stream for provider and plugin adapters. */
function createAssistantMessageEventStream() {
	return new AssistantMessageEventStream();
}
//#endregion
//#region packages/agent-core/src/runtime-deps.ts
function missingRuntimeDep(name) {
	return /* @__PURE__ */ new Error(`@testclaw/agent-core runtime dependency "${name}" is not configured. Pass an AgentCoreRuntimeDeps instance or a streamFn explicitly.`);
}
/** Resolve the stream function, preferring an explicit override over injected runtime deps. */
function resolveAgentCoreStreamFn(runtime, streamFn) {
	if (streamFn) return streamFn;
	if (runtime?.streamSimple) return runtime.streamSimple;
	throw missingRuntimeDep("streamSimple");
}
/** Standalone runtimes consume directly; hosts may retain their exact stream owner. */
function runAgentCoreStream(stream, consume, runtime) {
	return runtime?.runStream ? runtime.runStream(stream, consume) : consume();
}
/** Drain a host-decorated stream before reading its final assistant message. */
async function consumeAgentCoreStream(stream, runtime) {
	return await runAgentCoreStream(stream, async () => {
		const response = await stream;
		for await (const _ of response);
		return response.result();
	}, runtime);
}
/** Resolve the completion function used by non-streaming helper flows. */
function resolveAgentCoreCompleteFn(runtime) {
	if (runtime?.completeSimple) return runtime.completeSimple;
	throw missingRuntimeDep("completeSimple");
}
//#endregion
//#region packages/agent-core/src/stream-steering.ts
/** Forward queued input while its normal transcript owner retains commit ordering. */
function createStreamSteering(config, signal, convertSteering) {
	const observer = getInternalSteeringQueueObserver(config.getSteeringMessages);
	let open = true;
	let cleanup;
	let forwarding = Promise.resolve();
	let needsContinuation;
	let finished;
	let failure;
	let submitted = false;
	const stop = () => {
		open = false;
		const release = cleanup;
		cleanup = void 0;
		release?.();
	};
	const onActiveResponse = (control) => {
		if (!open || signal?.aborted) return;
		needsContinuation = control.needsContinuation;
		const outerCleanup = config.onActiveResponse?.(control);
		const forward = () => {
			if (!open || signal?.aborted || failure || !observer || submitted) return;
			const messages = observer.peek();
			if (messages.length === 0) return;
			submitted = true;
			const release = observer.reserve(messages);
			let dispatched = false;
			forwarding = forwarding.then(async () => {
				if (!open || signal?.aborted) {
					release();
					return;
				}
				const converted = await convertSteering([...messages]);
				const userMessages = converted.filter((message) => message.role === "user");
				if (!open || signal?.aborted || userMessages.length !== converted.length || userMessages.length === 0) {
					release();
					stop();
					return;
				}
				dispatched = true;
				if (!await control.steer(userMessages)) {
					release();
					stop();
				}
			}).catch((error) => {
				if (!dispatched) release();
				failure ??= { error };
			});
		};
		const unsubscribe = observer?.subscribe(forward);
		cleanup = () => {
			unsubscribe?.();
			outerCleanup?.();
		};
		forward();
		return stop;
	};
	return {
		onActiveResponse,
		finish() {
			return finished ??= (async () => {
				stop();
				await forwarding;
				if (failure) throw failure.error;
				return needsContinuation?.() === true;
			})();
		}
	};
}
//#endregion
//#region packages/agent-core/src/turn-interruption.ts
/** Canonical empty aborted/error assistant recorded when a run ends without output. */
function createFailureMessage(model, error, aborted) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: ""
		}],
		api: model.api,
		provider: model.provider,
		model: model.id,
		stopReason: aborted ? "aborted" : "error",
		errorMessage: error instanceof Error ? error.message : String(error),
		timestamp: Date.now(),
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		}
	};
}
const INTERRUPTED_TURN_GUIDANCE = `<turn_aborted>
The previous turn was interrupted. Any running background processes may still be active. If any tools or commands were aborted, they may have partially executed.
</turn_aborted>`;
/**
* Aborts that end a turn as an intentional handoff (e.g. yield-style tools)
* mark it with an abort reason carrying `turnHandoff: true`. Interruption
* guidance is skipped for them: the next turn would otherwise be told tools
* may have partially executed after a clean, deliberate stop.
*/
function isTurnHandoffAbort(signal) {
	if (!signal?.aborted) return false;
	const reason = signal.reason;
	return typeof reason === "object" && reason !== null && reason.turnHandoff === true;
}
async function appendInterruptedTurnMessage(messages, emit) {
	const interruption = {
		role: "custom",
		customType: "turn-aborted",
		content: INTERRUPTED_TURN_GUIDANCE,
		display: false,
		timestamp: Date.now()
	};
	messages.push(interruption);
	await emit({
		type: "message_start",
		message: interruption
	});
	await emit({
		type: "message_end",
		message: interruption
	});
}
function normalizeCoreContextMessages(messages) {
	return messages.map((message) => {
		if (message.role !== "custom" || message.customType !== "turn-aborted") return message;
		return {
			role: "user",
			content: typeof message.content === "string" ? [{
				type: "text",
				text: message.content
			}] : message.content,
			timestamp: message.timestamp
		};
	});
}
//#endregion
//#region packages/agent-core/src/agent-stream-response.ts
function appendTextDeltaToAssistantMessage(message, contentIndex, delta) {
	const content = [...message.content];
	const currentContent = content[contentIndex];
	content[contentIndex] = currentContent?.type === "text" ? {
		...currentContent,
		text: currentContent.text + delta
	} : {
		type: "text",
		text: delta
	};
	return {
		...message,
		content
	};
}
function resolveAssistantMessageUpdate(event, currentMessage) {
	if ("partial" in event && event.partial) return event.partial;
	if (event.type === "text_delta") return appendTextDeltaToAssistantMessage(currentMessage, event.contentIndex, event.delta);
	return currentMessage;
}
function removeNonExecutableToolCalls(message) {
	if (message.stopReason === "toolUse") return message;
	const content = message.content.filter((item) => item.type !== "toolCall" || item.async);
	return content.length === message.content.length ? message : replaceCompactionReplayOwnerContent(message, content);
}
function ensureToolTurnIdentity(message) {
	if (!(message.stopReason === "toolUse" || (message.stopReason === "stop" || message.stopReason === "length") && message.content.some((item) => item.type === "toolCall" && item.async)) || message.responseId?.trim() || message.turnId?.trim()) return message;
	return {
		...message,
		turnId: uuidv7()
	};
}
async function streamAgentResponse(context, config, signal, emit, newMessages, executeAsyncTools, prepareAssistantMessage, streamFn, runtime) {
	const sourceMessages = [...context.messages];
	const convertMessages = async (messages, projectionSignal = signal) => {
		const transformed = config.transformContext ? await config.transformContext(messages, projectionSignal) : messages;
		return config.convertToLlm(normalizeCoreContextMessages(transformed));
	};
	const llmMessages = await convertMessages(sourceMessages);
	let requestPrefix;
	const llmContext = {
		systemPrompt: context.systemPrompt,
		messages: llmMessages,
		tools: context.tools
	};
	const streamFunction = resolveAgentCoreStreamFn(runtime, streamFn);
	const resolvedApiKey = (config.getApiKey ? await config.getApiKey(config.model.provider) : void 0) || config.apiKey;
	const executionAbort = new AbortController();
	const executionSignal = signal ? AbortSignal.any([signal, executionAbort.signal]) : executionAbort.signal;
	const abortFailedResponse = (message) => {
		if (message && (message.stopReason === "error" || message.stopReason === "aborted") && !isResponsesOutputLimitToolCallError(message)) executionAbort.abort(new Error(message.errorMessage ?? "Model response interrupted"));
	};
	const steering = createStreamSteering(config, executionSignal, async (pending) => {
		requestPrefix ??= JSON.stringify(llmMessages);
		const projected = await convertMessages([...sourceMessages, ...pending], executionSignal);
		if (JSON.stringify(projected.slice(0, llmMessages.length)) !== requestPrefix) return [];
		return projected.slice(llmMessages.length);
	});
	const executedIds = /* @__PURE__ */ new Set();
	const batches = [];
	let executions = Promise.resolve();
	let admissions = Promise.resolve();
	let executionFailure;
	const emitToolEvent = async (event) => {
		if (event.type === "message_end" && event.message.role === "toolResult") {
			context.messages.push(event.message);
			newMessages.push(event.message);
		}
		await emit(event);
	};
	const enqueueTools = (message) => {
		if (message.stopReason === "error" || message.stopReason === "aborted") return;
		const calls = message.content.filter((item) => item.type === "toolCall" && !executedIds.has(item.id) && (message.stopReason === "toolUse" || item.async === true));
		if (calls.length === 0) return;
		const hasUnobservedAsyncToolResults = executedIds.size > 0;
		for (const call of calls) executedIds.add(call.id);
		const previousExecutions = executions;
		const previousAdmission = admissions;
		let releaseAdmission;
		admissions = new Promise((resolve) => {
			releaseAdmission = resolve;
		});
		const execution = previousAdmission.then(async () => {
			const batch = await executeAsyncTools(message, calls, executionSignal, emitToolEvent, {
				waitForPrevious: () => previousExecutions,
				onParallelStarted: releaseAdmission,
				hasUnobservedAsyncToolResults
			});
			batches.push(batch);
			if (batch.fatal || batch.terminateRun) executionAbort.abort(batch.fatal?.error ?? /* @__PURE__ */ new Error("Tool batch terminated"));
		}).catch((error) => {
			executionFailure ??= { error };
			executionAbort.abort(error);
		}).finally(releaseAdmission);
		executions = Promise.all([previousExecutions, execution]).then(() => {});
	};
	try {
		const stream = streamFunction(config.model, llmContext, {
			...config,
			apiKey: resolvedApiKey,
			signal: executionSignal,
			onActiveResponse: steering.onActiveResponse,
			asyncToolExecution: true
		});
		return await runAgentCoreStream(stream, async () => {
			const response = await stream;
			let partialMessage = null;
			let partialIndex;
			let committedContentCount = 0;
			let streamedTurnId;
			const remainingFragment = (message) => committedContentCount === 0 ? message : replaceCompactionReplayOwnerContent(message, message.content.slice(committedContentCount));
			const updatePartial = async (message) => {
				const fragment = remainingFragment(message);
				if (partialIndex === void 0) {
					partialIndex = context.messages.length;
					context.messages.push(fragment);
					await emit({
						type: "message_start",
						message: { ...fragment }
					});
				} else context.messages[partialIndex] = fragment;
				return fragment;
			};
			const commitFragment = async (message) => {
				if (partialIndex === void 0) {
					context.messages.push(message);
					await emit({
						type: "message_start",
						message: { ...message }
					});
				} else {
					context.messages.splice(partialIndex, 1);
					context.messages.push(message);
				}
				partialIndex = void 0;
				newMessages.push(message);
				await emit({
					type: "message_end",
					message
				});
			};
			for await (const event of response) switch (event.type) {
				case "start": {
					const message = event.partial;
					partialMessage = message;
					await updatePartial(message);
					break;
				}
				case "text_start":
				case "text_delta":
				case "text_end":
				case "thinking_start":
				case "thinking_delta":
				case "thinking_end":
				case "toolcall_start":
				case "toolcall_delta":
				case "toolcall_end":
					if (partialMessage) {
						const message = resolveAssistantMessageUpdate(event, partialMessage);
						partialMessage = message;
						if (event.contentIndex < committedContentCount) break;
						const fragment = await updatePartial(message);
						await emit({
							type: "message_update",
							assistantMessageEvent: {
								...event,
								contentIndex: event.contentIndex - committedContentCount,
								..."partial" in event ? { partial: fragment } : {}
							},
							message: { ...fragment }
						});
						if (event.type === "toolcall_end" && event.toolCall.async && !executedIds.has(event.toolCall.id) && message.content.slice(committedContentCount, event.contentIndex).every((item) => item.type !== "toolCall" || item.async === true)) {
							const prefix = prepareAssistantMessage(ensureToolTurnIdentity({
								...replaceCompactionReplayOwnerContent(message, message.content.slice(committedContentCount, event.contentIndex + 1)),
								...streamedTurnId ? { turnId: streamedTurnId } : {},
								stopReason: "toolUse",
								usage: {
									input: 0,
									output: 0,
									cacheRead: 0,
									cacheWrite: 0,
									totalTokens: 0,
									cost: {
										input: 0,
										output: 0,
										cacheRead: 0,
										cacheWrite: 0,
										total: 0
									}
								}
							}));
							streamedTurnId ??= prefix.turnId;
							await commitFragment(prefix);
							committedContentCount = event.contentIndex + 1;
							enqueueTools(prefix);
						}
					}
					break;
				case "done":
				case "error": return await finalizeAssistantMessage(event.type === "done" ? event.message : event.error);
			}
			return await finalizeAssistantMessage();
			async function finalizeAssistantMessage(terminal) {
				abortFailedResponse(terminal);
				const result = await response.result();
				abortFailedResponse(result);
				const outputLimit = isResponsesOutputLimitToolCallError(result);
				if (outputLimit) await executions;
				const finalMessage = prepareAssistantMessage(ensureToolTurnIdentity(removeNonExecutableToolCalls({
					...remainingFragment(result),
					...streamedTurnId ? { turnId: streamedTurnId } : {},
					...outputLimit && signal?.aborted ? { stopReason: "aborted" } : outputLimit && batches.length > 0 && batches.every((batch) => batch.terminate) ? { errorCode: PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE } : {}
				})));
				await commitFragment(finalMessage);
				if (executedIds.size > 0) enqueueTools(finalMessage);
				await executions;
				if (executionFailure) throw executionFailure.error;
				const continuationRequired = await steering.finish();
				return {
					message: finalMessage,
					executedIds,
					batches,
					continuationRequired
				};
			}
		}, runtime);
	} finally {
		executionAbort.abort(/* @__PURE__ */ new Error("Model response closed"));
		await executions;
		await steering.finish();
	}
}
//#endregion
//#region packages/agent-core/src/reasoning.ts
function resolveAgentReasoningOption(model, thinkingLevel) {
	if (thinkingLevel !== "off") return thinkingLevel;
	const offFallback = model.thinkingLevelMap?.off ?? ((model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) ? "low" : void 0);
	switch (offFallback) {
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
		case "max": return offFallback;
		default: return model.thinkingLevelMap?.off !== null || model.api === "anthropic-messages" && (resolveClaudeSonnet5ModelIdentity(model) || resolveClaudeOpus5ModelIdentity(model)) ? "off" : void 0;
	}
}
//#endregion
//#region packages/agent-core/src/agent-loop.ts
const TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE = "Assistant stopped this run because tool-loop recovery encountered another critical loop. No blocked tool action was executed.";
const STEERING_TOOL_SKIP_MESSAGE = "Skipped to process an incoming message.";
const TOOL_ADMISSION_FAILURE_MESSAGE = "Tool execution was blocked before launch.";
const TOOL_ADMISSION_FAILURE_DETAILS = {
	status: "blocked",
	deniedReason: "tool-admission"
};
function getSteeringAtCheckpoint(config) {
	const callback = config.getSteeringMessages;
	if (!callback) return [];
	return getInternalSyncSteeringGetter(callback)?.() ?? callback.call(config);
}
/** Run a prompt-started loop and emit events through a caller-owned sink. */
async function runAgentLoop(prompts, context, config, emit, signal, streamFn, runtime) {
	return runAgentLoopCore(prompts, context, config, emit, signal, streamFn, runtime);
}
/** Continue an existing loop context and emit only newly produced messages. */
async function runAgentLoopContinue(context, config, emit, signal, streamFn, runtime) {
	assertContinuableContext(context);
	return runAgentLoopCore([], context, config, emit, signal, streamFn, runtime);
}
function assertContinuableContext(context) {
	const lastMessage = context.messages.at(-1);
	if (!lastMessage) throw new Error("Cannot continue: no messages in context");
	if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
}
async function runAgentLoopCore(prompts, context, config, emit, signal, streamFn, runtime) {
	const newMessages = [];
	const state = { context: {
		...context,
		messages: [...context.messages]
	} };
	await emit({ type: "agent_start" });
	await emit({ type: "turn_start" });
	for (const prompt of prompts) {
		if (config.consumeQueuedMessageCancellation?.(prompt)) continue;
		await emit({
			type: "message_start",
			message: prompt
		});
		if (config.consumeQueuedMessageCancellation?.(prompt)) continue;
		await emit({
			type: "message_end",
			message: prompt
		});
		state.context.messages.push(prompt);
		newMessages.push(prompt);
	}
	if (prompts.length > 0 && newMessages.length === 0) {
		await emit({
			type: "agent_end",
			messages: []
		});
		return [];
	}
	return runLoop(state, newMessages, config, signal, emit, streamFn, runtime);
}
/**
* Own one replaceable context slot so this async frame does not retain earlier
* contexts after a next-turn hook replaces them.
*/
async function runLoop(state, newMessages, initialConfig, signal, emit, streamFn, runtime) {
	let config = initialConfig;
	let firstTurn = true;
	let turnOpen = true;
	let turnTainted = isActiveTurnTainted(state.context.messages);
	const toolLoopRecoveryState = initialConfig.toolLoopRecoveryState ?? { criticalToolLoopSeen: false };
	const initialSteering = getSteeringAtCheckpoint(config);
	let pendingMessages = Array.isArray(initialSteering) ? initialSteering : await initialSteering;
	const stopIfAborted = async () => {
		if (!signal?.aborted) return false;
		const abortedMessage = withAssistantTurnTaint(createFailureMessage(config.model, signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Agent run aborted"), true), turnTainted);
		newMessages.push(abortedMessage);
		if (!turnOpen) {
			await emit({ type: "turn_start" });
			turnOpen = true;
		}
		await emit({
			type: "message_start",
			message: abortedMessage
		});
		await emit({
			type: "message_end",
			message: abortedMessage
		});
		await emit({
			type: "turn_end",
			message: abortedMessage,
			toolResults: []
		});
		turnOpen = false;
		if (!isTurnHandoffAbort(signal)) await appendInterruptedTurnMessage(newMessages, emit);
		await emit({
			type: "agent_end",
			messages: newMessages
		});
		return true;
	};
	const commitPendingMessages = async () => {
		const messagesToInject = pendingMessages;
		pendingMessages = [];
		let injectedMessage = false;
		for (const message of messagesToInject) {
			if (config.consumeQueuedMessageCancellation?.(message)) continue;
			await emit({
				type: "message_start",
				message
			});
			if (config.consumeQueuedMessageCancellation?.(message)) continue;
			if (message.role === "user") turnTainted = false;
			await emit({
				type: "message_end",
				message
			});
			state.context.messages.push(message);
			newMessages.push(message);
			injectedMessage = true;
		}
		return injectedMessage;
	};
	while (true) {
		let hasMoreToolCalls = true;
		while (hasMoreToolCalls || pendingMessages.length > 0) {
			if (await stopIfAborted()) return newMessages;
			if (!firstTurn) {
				await emit({ type: "turn_start" });
				turnOpen = true;
			} else firstTurn = false;
			if (pendingMessages.length > 0) {
				if (!await commitPendingMessages() && !hasMoreToolCalls) continue;
			}
			if (await stopIfAborted()) return newMessages;
			let streamedSteering = [];
			const streamedConfig = {
				...config,
				getSteeringMessages: async () => {
					if (streamedSteering.length === 0) streamedSteering = await getSteeringAtCheckpoint(config);
					return streamedSteering;
				}
			};
			const streamed = await streamAgentResponse(state.context, config, signal, emit, newMessages, async (assistantMessage, toolCalls, executionSignal, toolEmit, scheduling) => {
				const batch = await executeToolCalls(state.context, assistantMessage, streamedConfig, executionSignal, toolEmit, toolLoopRecoveryState.criticalToolLoopSeen, toolCalls, scheduling, scheduling.hasUnobservedAsyncToolResults);
				if (batch.intervention) toolLoopRecoveryState.criticalToolLoopSeen = true;
				return batch;
			}, (message) => withAssistantTurnTaint(message, turnTainted), streamFn, runtime);
			const { message } = streamed;
			const providerFailed = message.stopReason === "error" || message.stopReason === "aborted";
			const remainingToolCalls = providerFailed ? [] : message.content.filter((item) => item.type === "toolCall" && !streamed.executedIds.has(item.id) && (message.stopReason === "toolUse" || item.async === true));
			const terminalToolBatch = remainingToolCalls.length > 0 ? await executeToolCalls(state.context, message, streamedSteering.length > 0 ? streamedConfig : config, signal, emit, toolLoopRecoveryState.criticalToolLoopSeen, remainingToolCalls, void 0, streamed.executedIds.size > 0) : void 0;
			const batches = [...streamed.batches, ...terminalToolBatch ? [terminalToolBatch] : []];
			const executedToolBatch = batches.length ? {
				messages: batches.flatMap((batch) => batch.messages),
				steeringMessages: [...new Set(batches.flatMap((batch) => batch.steeringMessages))],
				terminate: batches.every((batch) => batch.terminate),
				terminateRun: batches.some((batch) => batch.terminateRun),
				intervention: batches.find((batch) => batch.intervention)?.intervention,
				fatal: batches.find((batch) => batch.fatal)?.fatal
			} : void 0;
			const toolResults = executedToolBatch?.messages ?? [];
			turnTainted ||= toolResults.some(toolResultTaintsTurn);
			hasMoreToolCalls = streamed.continuationRequired || message.stopReason === "stop" && message.endTurn === false && !executedToolBatch?.terminate || executedToolBatch !== void 0 && !executedToolBatch.terminate;
			pendingMessages = executedToolBatch?.steeringMessages ?? [];
			if (executedToolBatch?.intervention) toolLoopRecoveryState.criticalToolLoopSeen = true;
			for (const result of terminalToolBatch?.messages ?? []) {
				state.context.messages.push(result);
				newMessages.push(result);
			}
			await emit({
				type: "turn_end",
				message,
				toolResults
			});
			turnOpen = false;
			if (executedToolBatch?.fatal) throw executedToolBatch.fatal.error;
			if (message.stopReason === "aborted") {
				if (signal?.aborted && !isTurnHandoffAbort(signal)) await appendInterruptedTurnMessage(newMessages, emit);
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
			if (await stopIfAborted()) return newMessages;
			if (executedToolBatch?.terminateRun) {
				const terminalMessage = {
					...createFailureMessage(config.model, /* @__PURE__ */ new Error(TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE), false),
					content: [{
						type: "text",
						text: TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE
					}]
				};
				state.context.messages.push(terminalMessage);
				newMessages.push(terminalMessage);
				await emit({ type: "turn_start" });
				turnOpen = true;
				await emit({
					type: "message_start",
					message: terminalMessage
				});
				await emit({
					type: "message_end",
					message: terminalMessage
				});
				await emit({
					type: "turn_end",
					message: terminalMessage,
					toolResults: []
				});
				turnOpen = false;
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
			if (providerFailed) {
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
			const nextTurnSnapshot = await config.prepareNextTurn?.({
				message,
				toolResults,
				context: state.context,
				newMessages
			});
			if (nextTurnSnapshot) {
				state.context = nextTurnSnapshot.context ?? state.context;
				const nextModel = nextTurnSnapshot.model ?? config.model;
				const nextThinkingLevel = nextTurnSnapshot.thinkingLevel ?? config.thinkingLevel;
				const nextReasoning = (nextTurnSnapshot.thinkingLevel !== void 0 || nextTurnSnapshot.model !== void 0 && nextThinkingLevel !== void 0) && nextThinkingLevel !== void 0 ? resolveAgentReasoningOption(nextModel, nextThinkingLevel) : config.reasoning;
				config = Object.assign({}, config, {
					model: nextModel,
					thinkingLevel: nextThinkingLevel,
					reasoning: nextReasoning
				});
			}
			if (await stopIfAborted()) return newMessages;
			if (pendingMessages.length === 0) {
				if (!nextTurnSnapshot?.stop && await config.shouldStopAfterTurn?.({
					message,
					toolResults,
					context: state.context,
					newMessages
				})) {
					await emit({
						type: "agent_end",
						messages: newMessages
					});
					return newMessages;
				}
				const steering = getSteeringAtCheckpoint(config);
				pendingMessages = Array.isArray(steering) ? steering : await steering;
			}
			if (await stopIfAborted()) return newMessages;
			if (nextTurnSnapshot?.stop) {
				await commitPendingMessages();
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
		}
		pendingMessages = await config.getFollowUpMessages?.() || [];
		if (pendingMessages.length === 0) {
			const finalSteering = getSteeringAtCheckpoint(config);
			pendingMessages = Array.isArray(finalSteering) ? finalSteering : await finalSteering;
		}
		if (pendingMessages.length === 0) break;
	}
	await emit({
		type: "agent_end",
		messages: newMessages
	});
	return newMessages;
}
/**
* Execute tool calls from an assistant message.
*/
async function executeToolCalls(currentContext, assistantMessage, config, signal, emit, criticalToolLoopSeen, toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall"), scheduling, hasUnobservedAsyncToolResults = false) {
	const batch = {
		currentContext,
		assistantMessage,
		config,
		signal,
		emit,
		resolved: /* @__PURE__ */ new Map(),
		validated: /* @__PURE__ */ new Map(),
		onParallelStarted: scheduling?.onParallelStarted,
		hasUnobservedAsyncToolResults
	};
	if (config.beforeToolBatch) {
		for (const toolCall of toolCalls) {
			if (signal?.aborted) break;
			batch.validated.set(toolCall, await validateToolCallForBatchAdmission(batch, toolCall));
		}
		const calls = toolCalls.flatMap((toolCall) => {
			const validation = batch.validated.get(toolCall);
			return validation?.kind === "prepared" ? [{
				toolCall,
				args: validation.args,
				tool: validation.tool
			}] : [];
		});
		if (calls.length > 0 && !signal?.aborted) {
			const admission = await config.beforeToolBatch({
				assistantMessage,
				calls,
				context: currentContext
			}, signal);
			if (admission?.intervention) return await completeToolLoopInterventionBatch(batch, {
				toolCalls,
				intervention: admission.intervention,
				terminal: criticalToolLoopSeen
			});
			batch.lifecycle = admission ? takeInternalToolBatchLifecycle(admission) : void 0;
			batch.warnings = admission?.warnings;
		}
	}
	let hasSequentialToolCall = false;
	if (config.toolExecution !== "sequential") for (const toolCall of toolCalls) {
		if (signal?.aborted) break;
		const resolution = await resolveToolCallTool(batch, toolCall);
		if (resolution.kind === "resolved" && resolution.tool?.executionMode === "sequential") {
			hasSequentialToolCall = true;
			break;
		}
	}
	const sequential = config.toolExecution === "sequential" || hasSequentialToolCall;
	if (sequential && scheduling) await scheduling.waitForPrevious();
	return executeToolCallGroups(batch, toolCalls, sequential);
}
function hidesToolCallFromChannelProgress(context, toolCall, resolvedToolCalls) {
	const resolution = resolvedToolCalls.get(toolCall);
	return (resolution?.kind === "resolved" ? resolution.tool : context.tools?.find((candidate) => candidate.name === toolCall.name))?.hideFromChannelProgress === true;
}
function validatedToolCallIds(batch, calls) {
	return calls.filter((call) => batch.validated.get(call)?.kind === "prepared").map((call) => call.id);
}
async function executeToolCallGroups(batch, toolCalls, sequential) {
	const finalizedCalls = [];
	const messages = [];
	let steeringMessages = [];
	let cursor = 0;
	let fatal;
	while (cursor < toolCalls.length) {
		if (sequential && !batch.signal?.aborted) {
			const steering = getSteeringAtCheckpoint(batch.config);
			steeringMessages = Array.isArray(steering) ? steering : await steering;
		}
		if (steeringMessages.length > 0) {
			batch.lifecycle?.releaseSkippedCalls(validatedToolCallIds(batch, toolCalls.slice(cursor)));
			break;
		}
		const entries = [];
		try {
			while (cursor < toolCalls.length) {
				const toolCall = toolCalls[cursor++];
				if (!toolCall) continue;
				const entry = await prepareToolCallEntry(batch, toolCall);
				entries.push(entry);
				if (!("kind" in entry)) await emitToolExecutionEnd(entry, batch.emit);
				if (sequential || batch.signal?.aborted) break;
			}
			const hasReady = entries.some((entry) => "kind" in entry);
			if (!batch.signal?.aborted && (!sequential || hasReady)) {
				const steering = getSteeringAtCheckpoint(batch.config);
				steeringMessages = Array.isArray(steering) ? steering : await steering;
			}
			const ordered = entries.map((entry) => "kind" in entry ? void 0 : entry);
			const settle = async (index, entry, outcome) => {
				try {
					const finalized = await finalizeExecutedToolCall(batch, entry, outcome, entry.execution.args);
					if (sequential) entry.execution.dispose();
					await emitToolExecutionEnd(finalized, batch.emit);
					ordered[index] = finalized;
				} finally {
					entry.execution.dispose();
				}
			};
			const launched = steeringMessages.length > 0 || sequential && !hasReady ? void 0 : await launchParallelToolCalls(entries, batch.lifecycle);
			if (!sequential && launched?.started.length && !launched.rejected) batch.onParallelStarted?.();
			for (const { index, entry, outcome } of launched?.completed ?? []) await settle(index, entry, outcome);
			fatal = launched?.rejected ? { error: launched.rejected.error } : void 0;
			const skippedIndex = steeringMessages.length > 0 ? 0 : launched?.rejected?.index ?? entries.length;
			if (sequential && steeringMessages.length > 0) {
				for (const entry of entries) if ("kind" in entry) entry.execution.dispose();
			}
			if (steeringMessages.length > 0 || fatal) {
				const skippedIds = [...entries.slice(skippedIndex).flatMap((entry) => "kind" in entry ? [entry.toolCall.id] : []), ...validatedToolCallIds(batch, toolCalls.slice(cursor))];
				if (sequential || fatal || skippedIds.length > 0) batch.lifecycle?.releaseSkippedCalls(skippedIds);
			}
			for (let index = skippedIndex; index < entries.length; index++) {
				const entry = entries[index];
				if (!entry || !("kind" in entry)) continue;
				if (!sequential) entry.execution.dispose();
				ordered[index] = await completeUnstartedToolCall(batch, entry.toolCall, {
					reason: fatal ? "admission" : "steering",
					args: entry.execution.args,
					startEmitted: true
				});
			}
			if (launched) await Promise.all(launched.started.map(async ({ index, entry, outcome }) => settle(index, entry, await outcome)));
			for (const finalized of ordered) if (finalized) {
				messages.push(await emitToolResultMessage(finalized, batch.emit));
				finalizedCalls.push(finalized);
			}
		} finally {
			for (const entry of entries) if ("kind" in entry) entry.execution.dispose();
		}
		if (steeringMessages.length > 0 || fatal || batch.signal?.aborted) break;
	}
	if (sequential && !fatal && !batch.signal?.aborted && steeringMessages.length === 0) {
		const steering = getSteeringAtCheckpoint(batch.config);
		steeringMessages = Array.isArray(steering) ? steering : await steering;
		if (steeringMessages.length > 0) batch.lifecycle?.releaseSkippedCalls([]);
	}
	const skippedReason = fatal ? "admission" : steeringMessages.length > 0 ? "steering" : void 0;
	for (; cursor < toolCalls.length; cursor++) {
		const toolCall = toolCalls[cursor];
		if (!toolCall) continue;
		const finalized = await completeUnstartedToolCall(batch, toolCall, { reason: skippedReason });
		messages.push(await emitToolResultMessage(finalized, batch.emit));
		finalizedCalls.push(finalized);
	}
	return {
		messages,
		steeringMessages,
		terminate: shouldTerminateToolBatch(finalizedCalls),
		terminateRun: false,
		...fatal ? { fatal } : {}
	};
}
async function prepareToolCallEntry(batch, toolCall) {
	const hideFromChannelProgress = hidesToolCallFromChannelProgress(batch.currentContext, toolCall, batch.resolved);
	await batch.emit({
		type: "tool_execution_start",
		toolCallId: toolCall.id,
		toolName: toolCall.name,
		args: toolCall.arguments,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	});
	const preparation = await prepareToolCall(batch, toolCall);
	if (preparation.kind === "immediate") return await finalizeToolCallOutcome(batch, {
		toolCall,
		result: preparation.result,
		isError: preparation.isError,
		executionStarted: false,
		...preparation.errorKind ? { errorKind: preparation.errorKind } : {},
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	}, toolCall.arguments);
	const execution = await prepareToolCallExecution(preparation, {
		assistantMessage: batch.assistantMessage,
		toolCall: preparation.toolCall,
		hasUnobservedAsyncToolResults: batch.hasUnobservedAsyncToolResults || batch.assistantMessage.content.slice(0, batch.assistantMessage.content.indexOf(toolCall)).some((item) => item.type === "toolCall" && item.async === true)
	}, batch.signal, batch.emit);
	return execution.kind === "immediate" ? await finalizeExecutedToolCall(batch, preparation, execution.outcome, preparation.args) : {
		...preparation,
		execution
	};
}
async function launchParallelToolCalls(entries, batchLifecycle) {
	const ready = entries.flatMap((entry, index) => "kind" in entry ? [{
		entry,
		index
	}] : []);
	const result = {
		started: [],
		completed: []
	};
	let cursor = 0;
	let finish;
	let finished = false;
	const done = new Promise((resolve) => {
		finish = () => {
			if (!finished) {
				finished = true;
				resolve();
			}
		};
	});
	const launchNext = () => {
		const current = ready[cursor++];
		if (!current) {
			finish();
			return;
		}
		const launchState = {};
		let started = false;
		let rejected = false;
		const onStart = () => {
			try {
				batchLifecycle?.commitReadyCalls([{
					toolCallId: current.entry.toolCall.id,
					args: current.entry.execution.args
				}]);
			} catch (error) {
				rejected = true;
				result.rejected = {
					index: current.index,
					error
				};
				finish();
				throw error;
			}
			started = true;
			if (launchState.outcome) result.started.push({
				...current,
				outcome: launchState.outcome
			});
			queueMicrotask(launchNext);
		};
		const outcome = current.entry.execution.execute(onStart);
		launchState.outcome = outcome;
		if (started) result.started.push({
			...current,
			outcome
		});
		outcome.then((completed) => {
			if (!started && !rejected) {
				result.completed.push({
					...current,
					outcome: completed
				});
				queueMicrotask(launchNext);
			}
		}, (error) => {
			if (!rejected) {
				result.rejected = {
					index: current.index,
					error
				};
				finish();
			}
		});
	};
	launchNext();
	await done;
	return result;
}
function shouldTerminateToolBatch(finalizedCalls) {
	return finalizedCalls.length > 0 && finalizedCalls.every((finalized) => finalized.result.terminate === true);
}
function prepareToolCallArguments(tool, toolCall) {
	if (!tool.prepareArguments) return toolCall;
	const preparedArguments = tool.prepareArguments(toolCall.arguments);
	if (preparedArguments === toolCall.arguments) return toolCall;
	return {
		...toolCall,
		arguments: preparedArguments
	};
}
async function resolveToolCallTool(batch, toolCall) {
	const cached = batch.resolved.get(toolCall);
	if (cached) return cached;
	let resolution;
	try {
		let tool = batch.currentContext.tools?.find((t) => t.name === toolCall.name);
		if (!tool) {
			const resolvedTool = await batch.config.resolveDeferredTool?.({
				assistantMessage: batch.assistantMessage,
				toolCall,
				context: batch.currentContext
			}, batch.signal);
			if (resolvedTool && resolvedTool.name !== toolCall.name) throw new Error(`Deferred tool resolver returned "${resolvedTool.name}" for requested "${toolCall.name}"`);
			tool = resolvedTool;
			if (tool) batch.currentContext.tools = [...batch.currentContext.tools ?? [], tool];
		}
		resolution = {
			kind: "resolved",
			...tool ? { tool } : {}
		};
	} catch (error) {
		resolution = {
			kind: "error",
			error
		};
	}
	batch.resolved.set(toolCall, resolution);
	return resolution;
}
async function prepareToolCall(batch, toolCall) {
	const cachedValidation = batch.validated.get(toolCall);
	if (batch.signal?.aborted && !cachedValidation) return {
		kind: "immediate",
		result: createErrorToolResult("Operation aborted"),
		isError: true
	};
	const validation = cachedValidation ?? await validateToolCallForBatchAdmission(batch, toolCall);
	if (validation.kind === "immediate") return validation;
	const { args: validatedArgs } = validation;
	try {
		if (batch.config.beforeToolCall) {
			const beforeResult = await batch.config.beforeToolCall({
				assistantMessage: batch.assistantMessage,
				toolCall,
				args: validatedArgs,
				context: batch.currentContext
			}, batch.signal);
			if (batch.signal?.aborted) return {
				kind: "immediate",
				result: createErrorToolResult("Operation aborted"),
				isError: true
			};
			if (beforeResult?.block) return {
				kind: "immediate",
				result: createErrorToolResult(beforeResult.reason || "Tool execution was blocked"),
				isError: true
			};
		}
		if (batch.signal?.aborted) return {
			kind: "immediate",
			result: createErrorToolResult("Operation aborted"),
			isError: true
		};
		return validation;
	} catch (error) {
		return {
			kind: "immediate",
			result: createErrorToolResult(coerceErrorMessage(error)),
			isError: true
		};
	}
}
async function validateToolCallForBatchAdmission(batch, toolCall) {
	const resolution = await resolveToolCallTool(batch, toolCall);
	if (resolution.kind === "error") return {
		kind: "immediate",
		result: createErrorToolResult(batch.signal?.aborted ? "Operation aborted" : coerceErrorMessage(resolution.error)),
		isError: true
	};
	const tool = resolution.tool;
	if (!tool) return {
		kind: "immediate",
		result: createErrorToolResult(`Tool ${toolCall.name} not found`),
		isError: true
	};
	let preparedToolCall;
	try {
		preparedToolCall = prepareToolCallArguments(tool, toolCall);
	} catch (error) {
		return {
			kind: "immediate",
			result: createErrorToolResult(coerceErrorMessage(error)),
			isError: true
		};
	}
	let validatedArgs;
	try {
		validatedArgs = validateToolArguments(tool, preparedToolCall);
	} catch (error) {
		return {
			kind: "immediate",
			result: createErrorToolResult(coerceErrorMessage(error)),
			isError: true,
			errorKind: "argument-validation"
		};
	}
	return {
		kind: "prepared",
		toolCall,
		tool,
		args: validatedArgs
	};
}
async function prepareToolCallExecution(prepared, executionContext, signal, emit) {
	const updateEvents = [];
	let acceptingUpdates = true;
	const onUpdate = (partialResult) => {
		if (!acceptingUpdates) return;
		updateEvents.push(Promise.resolve(emit({
			type: "tool_execution_update",
			toolCallId: prepared.toolCall.id,
			toolName: prepared.toolCall.name,
			args: prepared.toolCall.arguments,
			partialResult,
			...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
		})));
	};
	const finishUpdates = async () => {
		acceptingUpdates = false;
		await Promise.all(updateEvents);
	};
	const immediateError = async (error) => {
		await finishUpdates();
		return {
			kind: "immediate",
			outcome: {
				result: createToolExecutionErrorResult(error),
				isError: true,
				executionStarted: false
			}
		};
	};
	const readyExecution = (args, run, disposeSource = () => {}) => {
		let disposed = false;
		const dispose = () => {
			if (!disposed) {
				disposed = true;
				acceptingUpdates = false;
				disposeSource();
			}
		};
		return {
			kind: "ready",
			args,
			dispose,
			async execute(onImplementationStart) {
				let executionStarted = false;
				let implementationStartError;
				try {
					if (signal?.aborted) return {
						result: createErrorToolResult("Operation aborted"),
						isError: true,
						executionStarted: false
					};
					try {
						const result = await run(() => {
							try {
								onImplementationStart?.();
							} catch (error) {
								implementationStartError = { error };
								throw error;
							}
							executionStarted = true;
						});
						if (implementationStartError) throw implementationStartError.error;
						return {
							result,
							isError: false,
							executionStarted
						};
					} catch (error) {
						if (implementationStartError) throw implementationStartError.error;
						return {
							result: createToolExecutionErrorResult(error),
							isError: true,
							executionStarted,
							...executionStarted && signal?.aborted && error === signal.reason ? { callerCancelled: true } : {}
						};
					}
				} finally {
					await finishUpdates();
					dispose();
				}
			}
		};
	};
	const preparer = getInternalToolExecutionPreparer(prepared.tool);
	if (!preparer) return readyExecution(prepared.args, async (onImplementationStart) => {
		if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("Operation aborted");
		return await runWithAgentToolExecutionContext(executionContext, () => {
			onImplementationStart();
			return prepared.tool.execute(prepared.toolCall.id, prepared.args, signal, onUpdate);
		});
	});
	let internalPreparation;
	try {
		internalPreparation = await runWithAgentToolExecutionContext(executionContext, () => preparer({
			toolCallId: prepared.toolCall.id,
			args: prepared.args,
			...signal ? { signal } : {},
			onUpdate
		}));
	} catch (error) {
		return await immediateError(error);
	}
	if (internalPreparation.kind === "immediate") {
		internalPreparation.dispose();
		await finishUpdates();
		return {
			kind: "immediate",
			outcome: internalPreparation.outcome.kind === "result" ? {
				result: internalPreparation.outcome.result,
				isError: internalPreparation.outcome.isError,
				executionStarted: false
			} : {
				result: createToolExecutionErrorResult(internalPreparation.outcome.error),
				isError: true,
				executionStarted: false
			}
		};
	}
	const readyPreparation = internalPreparation;
	return readyExecution(readyPreparation.args, (onImplementationStart) => runWithAgentToolExecutionContext(executionContext, () => readyPreparation.execute(onImplementationStart)), readyPreparation.dispose);
}
async function finalizeExecutedToolCall(batch, prepared, executed, finalArgs) {
	let result = executed.result;
	let isError = executed.isError;
	if (executed.executionStarted && batch.config.afterToolCall) try {
		const afterResult = await batch.config.afterToolCall({
			assistantMessage: batch.assistantMessage,
			toolCall: prepared.toolCall,
			args: finalArgs,
			result,
			isError,
			context: batch.currentContext
		}, batch.signal);
		if (afterResult) {
			result = copyInternalToolResultState(result, {
				...result,
				content: afterResult.content ?? result.content,
				details: afterResult.details ?? result.details,
				terminate: afterResult.terminate ?? result.terminate
			});
			isError = afterResult.isError ?? isError;
		}
	} catch (error) {
		result = createErrorToolResult(coerceErrorMessage(error));
		isError = true;
	}
	return await finalizeToolCallOutcome(batch, {
		toolCall: prepared.toolCall,
		result,
		isError,
		executionStarted: executed.executionStarted,
		...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
		...executed.executionStarted && !executed.callerCancelled && prepared.tool.resultContentSource ? { resultContentSource: prepared.tool.resultContentSource } : {}
	}, finalArgs);
}
async function finalizeToolCallOutcome(batch, finalized, args) {
	const outcome = await applyToolOutcomeHook(batch, finalized, args);
	const warning = batch.warnings?.find((entry) => entry.toolCallId === outcome.toolCall.id);
	return warning ? {
		...outcome,
		result: appendToolLoopWarning(outcome.result, warning)
	} : outcome;
}
async function applyToolOutcomeHook(batch, finalized, args) {
	if (!batch.config.afterToolOutcome) return finalized;
	try {
		const afterResult = await batch.config.afterToolOutcome({
			assistantMessage: batch.assistantMessage,
			toolCall: finalized.toolCall,
			args,
			result: finalized.result,
			isError: finalized.isError,
			executionStarted: finalized.executionStarted,
			...finalized.errorKind ? { errorKind: finalized.errorKind } : {},
			context: batch.currentContext
		}, batch.signal);
		if (!afterResult) return finalized;
		return {
			...finalized,
			result: copyInternalToolResultState(finalized.result, {
				...finalized.result,
				content: afterResult.content ?? finalized.result.content,
				details: afterResult.details ?? finalized.result.details,
				terminate: afterResult.terminate ?? finalized.result.terminate
			}),
			isError: afterResult.isError ?? finalized.isError
		};
	} catch (error) {
		const errorResult = createErrorToolResult(coerceErrorMessage(error));
		return {
			...finalized,
			result: {
				...errorResult,
				...finalized.result.terminate === void 0 ? {} : { terminate: finalized.result.terminate }
			},
			isError: true
		};
	}
}
async function completeToolLoopInterventionBatch(batch, params) {
	const messages = [];
	const finalizedCalls = [];
	for (const toolCall of params.toolCalls) {
		const hideFromChannelProgress = hidesToolCallFromChannelProgress(batch.currentContext, toolCall, batch.resolved);
		await batch.emit({
			type: "tool_execution_start",
			toolCallId: toolCall.id,
			toolName: toolCall.name,
			args: toolCall.arguments,
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		});
		const isTrigger = toolCall.id === params.intervention.toolCallId;
		const text = params.terminal ? isTrigger ? `${params.intervention.reason}\n\nCritical tool-loop recovery failed because another critical loop was detected. This run is stopping now.` : "This tool was not executed because another call in the batch repeated a critical tool loop. This run is stopping now." : isTrigger ? `${params.intervention.reason}\n\nDo not repeat this exact tool action. Reassess the task. You may answer the user, ask for clarification, or continue with a different tool or different arguments.` : "This tool was not executed because another call in the batch triggered critical tool-loop recovery. Reassess the task before choosing the next action.";
		const validation = batch.validated.get(toolCall);
		const finalized = await finalizeToolCallOutcome(batch, {
			toolCall,
			result: {
				content: [{
					type: "text",
					text
				}],
				details: {
					status: "blocked",
					deniedReason: "tool-loop",
					intervention: params.intervention
				},
				...params.terminal ? { terminate: true } : {}
			},
			isError: true,
			executionStarted: false,
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		}, validation?.kind === "prepared" ? validation.args : toolCall.arguments);
		await emitToolExecutionEnd(finalized, batch.emit);
		messages.push(await emitToolResultMessage(finalized, batch.emit));
		finalizedCalls.push(finalized);
	}
	return {
		messages,
		steeringMessages: [],
		terminate: params.terminal || shouldTerminateToolBatch(finalizedCalls),
		terminateRun: params.terminal,
		intervention: params.intervention
	};
}
async function completeUnstartedToolCall(batch, toolCall, options = {}) {
	const hideFromChannelProgress = hidesToolCallFromChannelProgress(batch.currentContext, toolCall, batch.resolved);
	if (!options.startEmitted) await batch.emit({
		type: "tool_execution_start",
		toolCallId: toolCall.id,
		toolName: toolCall.name,
		args: toolCall.arguments,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	});
	const finalized = await finalizeToolCallOutcome(batch, {
		toolCall,
		result: createErrorToolResult(options.reason === "admission" ? TOOL_ADMISSION_FAILURE_MESSAGE : options.reason === "steering" ? STEERING_TOOL_SKIP_MESSAGE : "Operation aborted", options.reason === "admission" ? TOOL_ADMISSION_FAILURE_DETAILS : options.reason === "steering" ? {
			status: "skipped",
			deniedReason: "steering"
		} : void 0),
		isError: true,
		executionStarted: false,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	}, "args" in options ? options.args : toolCall.arguments);
	await emitToolExecutionEnd(finalized, batch.emit);
	return finalized;
}
function createToolExecutionErrorResult(error) {
	const result = createErrorToolResult(coerceErrorMessage(error));
	return typeof error === "object" && error !== null ? copyInternalToolResultState(error, result) : result;
}
function createErrorToolResult(message, details = {}) {
	return {
		content: [{
			type: "text",
			text: message
		}],
		details
	};
}
async function emitToolExecutionEnd(finalized, emit) {
	await emit({
		type: "tool_execution_end",
		toolCallId: finalized.toolCall.id,
		toolName: finalized.toolCall.name,
		result: finalized.result,
		isError: finalized.isError,
		executionStarted: finalized.executionStarted,
		...finalized.errorKind ? { errorKind: finalized.errorKind } : {},
		...finalized.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
	});
}
async function emitToolResultMessage(finalized, emit) {
	const message = copyInternalToolResultState(finalized.result, withToolResultContentSource({
		role: "toolResult",
		toolCallId: finalized.toolCall.id,
		toolName: finalized.toolCall.name,
		content: finalized.result.content ?? [],
		details: finalized.result.details,
		isError: finalized.isError,
		timestamp: Date.now()
	}, finalized.resultContentSource));
	await emit({
		type: "message_start",
		message
	});
	await emit({
		type: "message_end",
		message
	});
	return message;
}
function readTurnTaintMetadata(message) {
	const metadata = Reflect.get(message, "__testclaw");
	const record = asOptionalRecord(metadata);
	if (!record) return;
	return {
		...record.resultContentSource === "network" ? { resultContentSource: record.resultContentSource } : {},
		...record.turnTainted === true ? { turnTainted: true } : {}
	};
}
function toolResultTaintsTurn(message) {
	return readTurnTaintMetadata(message)?.resultContentSource === "network";
}
function isActiveTurnTainted(messages) {
	for (const message of messages.toReversed()) {
		if (message.role === "user") return false;
		const metadata = readTurnTaintMetadata(message);
		if (metadata?.turnTainted === true || metadata?.resultContentSource === "network") return true;
	}
	return false;
}
function withAssistantTurnTaint(message, tainted) {
	if (!tainted) return message;
	return {
		...message,
		__testclaw: {
			...readTurnTaintMetadata(message),
			turnTainted: true
		}
	};
}
function withToolResultContentSource(message, source) {
	if (!source) return message;
	return {
		...message,
		__testclaw: {
			...readTurnTaintMetadata(message),
			resultContentSource: source
		}
	};
}
//#endregion
//#region packages/agent-core/src/agent.ts
function defaultConvertToLlm(messages) {
	return messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
}
const DEFAULT_MODEL = {
	id: "unknown",
	name: "unknown",
	api: "unknown",
	provider: "unknown",
	baseUrl: "",
	reasoning: false,
	input: [],
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0
	},
	contextWindow: 0,
	maxTokens: 0
};
function createMutableAgentState(initialState) {
	let tools = initialState?.tools?.slice() ?? [];
	let messages = initialState?.messages?.slice() ?? [];
	return {
		systemPrompt: initialState?.systemPrompt ?? "",
		model: initialState?.model ?? DEFAULT_MODEL,
		thinkingLevel: initialState?.thinkingLevel ?? "off",
		get tools() {
			return tools;
		},
		set tools(nextTools) {
			tools = nextTools.slice();
		},
		get messages() {
			return messages;
		},
		set messages(nextMessages) {
			messages = nextMessages.slice();
		},
		isStreaming: false,
		streamingMessage: void 0,
		pendingToolCalls: /* @__PURE__ */ new Set(),
		errorMessage: void 0
	};
}
var PendingMessageQueue = class {
	constructor(mode) {
		this.messages = [];
		this.listeners = /* @__PURE__ */ new Set();
		this.submitted = /* @__PURE__ */ new Set();
		this.inFlight = [];
		this.cancelled = /* @__PURE__ */ new WeakSet();
		this.mode = mode;
	}
	enqueue(message) {
		this.messages.push(message);
		for (const listener of this.listeners) listener();
	}
	peek() {
		return (this.inFlight.length > 0 ? this.inFlight : this.messages).slice(0, this.mode === "all" ? void 0 : 1);
	}
	subscribe(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	reserve(messages) {
		for (const message of messages) this.submitted.add(message);
		return () => {
			for (const message of messages) this.submitted.delete(message);
		};
	}
	hasItems() {
		return this.messages.length > 0;
	}
	drain() {
		let count = this.mode === "all" ? this.messages.length : 1;
		const boundary = this.messages.findIndex((message) => !this.submitted.has(message));
		if (boundary > 0) count = Math.min(count, boundary);
		const drained = this.messages.splice(0, count);
		this.inFlight.push(...drained);
		return drained;
	}
	commit(message) {
		this.submitted.delete(message);
		this.cancelled.delete(message);
		const index = this.inFlight.indexOf(message);
		if (index >= 0) this.inFlight.splice(index, 1);
	}
	restore() {
		this.messages = [...this.inFlight, ...this.messages];
		this.inFlight = [];
		this.submitted.clear();
	}
	cancelFirst(predicate) {
		const pendingIndex = this.messages.findIndex(predicate);
		const pendingMessage = this.messages[pendingIndex];
		if (pendingMessage) {
			if (this.submitted.has(pendingMessage)) return;
			return this.messages.splice(pendingIndex, 1)[0];
		}
		const inFlightIndex = this.inFlight.findIndex(predicate);
		const message = this.inFlight[inFlightIndex];
		if (!message || this.submitted.has(message)) return;
		this.inFlight.splice(inFlightIndex, 1);
		this.cancelled.add(message);
		return message;
	}
	consumeCancellation(message) {
		return this.cancelled.delete(message);
	}
	clear() {
		this.messages = this.messages.filter((message) => this.submitted.has(message));
		this.inFlight = this.inFlight.filter((message) => this.submitted.has(message));
		this.cancelled = /* @__PURE__ */ new WeakSet();
	}
};
/**
* Stateful wrapper around the low-level agent loop.
*
* `Agent` owns the current transcript, emits lifecycle events, executes tools,
* and exposes queueing APIs for steering and follow-up messages.
*/
var Agent$1 = class {
	constructor(options = {}) {
		this.listeners = /* @__PURE__ */ new Set();
		this.toolLoopRecoveryState = { criticalToolLoopSeen: false };
		this.mutableState = createMutableAgentState(options.initialState);
		this.convertToLlm = options.convertToLlm ?? defaultConvertToLlm;
		this.transformContext = options.transformContext;
		this.runtime = options.runtime;
		this.streamFn = resolveAgentCoreStreamFn(options.runtime, options.streamFn);
		this.getApiKey = options.getApiKey;
		this.onPayload = options.onPayload;
		this.onResponse = options.onResponse;
		this.beforeToolCall = options.beforeToolCall;
		this.resolveDeferredTool = options.resolveDeferredTool;
		this.afterToolCall = options.afterToolCall;
		this.afterToolOutcome = options.afterToolOutcome;
		this.prepareNextTurn = options.prepareNextTurn;
		this.prepareNextTurnWithContext = options.prepareNextTurnWithContext;
		this.steeringQueue = new PendingMessageQueue(options.steeringMode ?? "one-at-a-time");
		this.followUpQueue = new PendingMessageQueue(options.followUpMode ?? "one-at-a-time");
		this.sessionId = options.sessionId;
		this.thinkingBudgets = options.thinkingBudgets;
		this.transport = options.transport ?? "auto";
		this.maxRetryDelayMs = options.maxRetryDelayMs;
		this.toolExecution = options.toolExecution ?? "parallel";
	}
	/**
	* Subscribe to agent lifecycle events.
	*
	* Listener promises are awaited in subscription order and are included in
	* the current run's settlement. Listeners also receive the active abort
	* signal for the current run.
	*
	* `agent_end` is the final emitted event for a run, but the agent does not
	* become idle until all awaited listeners for that event have settled.
	*/
	subscribe(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	/**
	* Current agent state.
	*
	* Assigning `state.tools` or `state.messages` copies the provided top-level array.
	*/
	get state() {
		return this.mutableState;
	}
	/** Controls how queued steering messages are drained. */
	set steeringMode(mode) {
		this.steeringQueue.mode = mode;
	}
	get steeringMode() {
		return this.steeringQueue.mode;
	}
	/** Controls how queued follow-up messages are drained. */
	set followUpMode(mode) {
		this.followUpQueue.mode = mode;
	}
	get followUpMode() {
		return this.followUpQueue.mode;
	}
	/**
	* Queue a message for the active run. Running tools finish, while sequential
	* tail calls or a parallel batch that has not launched yet are skipped.
	*/
	steer(message) {
		this.steeringQueue.enqueue(message);
	}
	/** Cancel queued input unless a live provider response may already have admitted it. */
	cancelSteeringMessage(predicate) {
		return this.steeringQueue.cancelFirst(predicate);
	}
	/** Queue a message to run only after the agent would otherwise stop. */
	followUp(message) {
		this.followUpQueue.enqueue(message);
	}
	/** Remove queued steering messages that have not been submitted to a live response. */
	clearSteeringQueue() {
		this.steeringQueue.clear();
	}
	/** Remove all queued follow-up messages. */
	clearFollowUpQueue() {
		this.followUpQueue.clear();
	}
	/** Remove all queued steering and follow-up messages. */
	clearAllQueues() {
		this.clearSteeringQueue();
		this.clearFollowUpQueue();
	}
	/** Returns true when either queue still contains pending messages. */
	hasQueuedMessages() {
		return this.steeringQueue.hasItems() || this.followUpQueue.hasItems();
	}
	/** Active abort signal for the current run, if any. */
	get signal() {
		return this.activeRun?.abortController.signal;
	}
	/** Abort the current run, if one is active. */
	abort(reason) {
		this.activeRun?.abortController.abort(reason);
	}
	/**
	* Resolve when the current run and all awaited event listeners have finished.
	*
	* This resolves after `agent_end` listeners settle.
	*/
	waitForIdle() {
		return this.activeRun?.promise ?? Promise.resolve();
	}
	/** Clear transcript state, runtime state, and queued messages. */
	reset() {
		this.mutableState.messages = [];
		this.mutableState.isStreaming = false;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
		this.mutableState.errorMessage = void 0;
		this.toolLoopRecoveryState.criticalToolLoopSeen = false;
		this.clearAllQueues();
	}
	async prompt(input, images) {
		if (this.activeRun) throw new Error("Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion.");
		this.toolLoopRecoveryState.criticalToolLoopSeen = false;
		const messages = this.normalizePromptInput(input, images);
		await this.runPromptMessages(messages);
	}
	/** Continue from the current transcript. The last message must be a user or tool-result message. */
	async continue() {
		if (this.activeRun) throw new Error("Agent is already processing. Wait for completion before continuing.");
		const lastMessage = this.mutableState.messages[this.mutableState.messages.length - 1];
		if (!lastMessage) throw new Error("No messages to continue from");
		if (lastMessage.role === "assistant" || lastMessage.role === "toolResult") {
			const queuedSteering = this.steeringQueue.drain();
			if (queuedSteering.length > 0) {
				await this.runPromptMessages(queuedSteering, { skipInitialSteeringPoll: true });
				return;
			}
			const queuedFollowUps = this.followUpQueue.drain();
			if (queuedFollowUps.length > 0) {
				await this.runPromptMessages(queuedFollowUps);
				return;
			}
		}
		if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
		await this.runContinuation();
	}
	normalizePromptInput(input, images) {
		if (Array.isArray(input)) return input;
		if (typeof input !== "string") return [input];
		const content = [{
			type: "text",
			text: input
		}];
		if (images && images.length > 0) content.push(...images);
		return [{
			role: "user",
			content,
			timestamp: Date.now()
		}];
	}
	async runPromptMessages(messages, options = {}) {
		await this.runWithLifecycle(async (signal) => {
			await runAgentLoop(messages, this.createContextSnapshot(), this.createLoopConfig(options), (event) => this.processEvents(event), signal, this.streamFn);
		});
	}
	async runContinuation() {
		await this.runWithLifecycle(async (signal) => {
			await runAgentLoopContinue(this.createContextSnapshot(), this.createLoopConfig(), (event) => this.processEvents(event), signal, this.streamFn);
		});
	}
	createContextSnapshot() {
		return {
			systemPrompt: this.mutableState.systemPrompt,
			messages: this.mutableState.messages.slice(),
			tools: this.mutableState.tools.slice()
		};
	}
	createLoopConfig(options = {}) {
		let skipInitialSteeringPoll = options.skipInitialSteeringPoll === true;
		const drainSteeringMessages = () => {
			if (skipInitialSteeringPoll) {
				skipInitialSteeringPoll = false;
				return [];
			}
			return this.steeringQueue.drain();
		};
		const getSteeringMessages = attachInternalSyncSteeringGetter(async () => drainSteeringMessages(), drainSteeringMessages, {
			peek: () => this.steeringQueue.peek(),
			reserve: (messages) => this.steeringQueue.reserve(messages),
			subscribe: (listener) => this.steeringQueue.subscribe(listener)
		});
		return {
			model: this.mutableState.model,
			thinkingLevel: this.mutableState.thinkingLevel,
			reasoning: resolveAgentReasoningOption(this.mutableState.model, this.mutableState.thinkingLevel),
			sessionId: this.sessionId,
			onPayload: this.onPayload,
			onResponse: this.onResponse,
			transport: this.transport,
			thinkingBudgets: this.thinkingBudgets,
			maxRetryDelayMs: this.maxRetryDelayMs,
			toolExecution: this.toolExecution,
			beforeToolCall: this.beforeToolCall,
			beforeToolBatch: getInternalBeforeToolBatch(this),
			toolLoopRecoveryState: this.toolLoopRecoveryState,
			resolveDeferredTool: this.resolveDeferredTool,
			afterToolCall: this.afterToolCall,
			afterToolOutcome: this.afterToolOutcome,
			prepareNextTurn: this.prepareNextTurnWithContext || this.prepareNextTurn ? async (context) => {
				if (this.prepareNextTurnWithContext) return await this.prepareNextTurnWithContext(context, this.signal);
				return await this.prepareNextTurn?.(this.signal);
			} : void 0,
			convertToLlm: this.convertToLlm,
			transformContext: this.transformContext,
			getApiKey: this.getApiKey,
			getSteeringMessages,
			getFollowUpMessages: async () => this.followUpQueue.drain(),
			consumeQueuedMessageCancellation: (message) => this.steeringQueue.consumeCancellation(message) || this.followUpQueue.consumeCancellation(message)
		};
	}
	async runWithLifecycle(executor) {
		if (this.activeRun) throw new Error("Agent is already processing.");
		const abortController = new AbortController();
		let resolvePromise = () => {};
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		this.activeRun = {
			promise,
			resolve: resolvePromise,
			abortController
		};
		this.mutableState.isStreaming = true;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.errorMessage = void 0;
		try {
			await executor(abortController.signal);
		} catch (error) {
			await this.handleRunFailure(error, abortController.signal.aborted);
		} finally {
			this.finishRun();
		}
	}
	async handleRunFailure(error, aborted) {
		const failureMessage = createFailureMessage(this.mutableState.model, error, aborted);
		await this.processEvents({
			type: "message_start",
			message: failureMessage
		});
		await this.processEvents({
			type: "message_end",
			message: failureMessage
		});
		await this.processEvents({
			type: "turn_end",
			message: failureMessage,
			toolResults: []
		});
		const messages = [failureMessage];
		if (aborted && !isTurnHandoffAbort(this.signal)) await appendInterruptedTurnMessage(messages, (event) => this.processEvents(event));
		await this.processEvents({
			type: "agent_end",
			messages
		});
	}
	finishRun() {
		this.steeringQueue.restore();
		this.followUpQueue.restore();
		this.mutableState.isStreaming = false;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
		this.activeRun?.resolve();
		this.activeRun = void 0;
	}
	/**
	* Reduce internal state for a loop event, then await listeners.
	*
	* `agent_end` only means no further loop events will be emitted. The run is
	* considered idle later, after all awaited listeners for `agent_end` finish
	* and `finishRun()` clears runtime-owned state.
	*/
	async processEvents(event) {
		switch (event.type) {
			case "agent_start":
			case "turn_start":
			case "tool_execution_update": break;
			case "message_start":
				if (event.message.role !== "toolResult" || this.mutableState.streamingMessage?.role !== "assistant") this.mutableState.streamingMessage = event.message;
				break;
			case "message_update":
				this.mutableState.streamingMessage = event.message;
				break;
			case "message_end":
				if (event.message.role !== "toolResult" || this.mutableState.streamingMessage?.role !== "assistant") this.mutableState.streamingMessage = void 0;
				this.mutableState.messages.push(event.message);
				this.steeringQueue.commit(event.message);
				this.followUpQueue.commit(event.message);
				break;
			case "tool_execution_start": {
				const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
				pendingToolCalls.add(event.toolCallId);
				this.mutableState.pendingToolCalls = pendingToolCalls;
				break;
			}
			case "tool_execution_end": {
				const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
				pendingToolCalls.delete(event.toolCallId);
				this.mutableState.pendingToolCalls = pendingToolCalls;
				break;
			}
			case "turn_end":
				if (event.message.role === "assistant" && event.message.errorMessage) this.mutableState.errorMessage = event.message.errorMessage;
				break;
			case "agent_end": this.mutableState.streamingMessage = void 0;
		}
		const signal = this.activeRun?.abortController.signal;
		if (!signal) throw new Error("Agent listener invoked outside active run");
		for (const listener of this.listeners) await listener(event, signal);
	}
};
//#endregion
//#region packages/ai/src/provider-types.ts
const PROVIDER_CONTEXT_HANDOFF = Symbol("providerContextHandoff");
/** Resolves provider-only context without widening the canonical call contract. */
async function resolveProviderContext(context, options) {
	return options?.[PROVIDER_CONTEXT_HANDOFF]?.() ?? context;
}
//#endregion
//#region packages/ai/src/providers/openai-reasoning-effort.ts
/**
* OpenAI-compatible reasoning-effort normalization. Different GPT families
* expose different accepted effort enums, so callers map requested values here
* before constructing provider payloads.
*/
const ENABLED_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_5_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high"
];
const GPT_51_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high"
];
const GPT_52_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_56_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_6_ASTRA_REASONING_EFFORTS = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_CODEX_REASONING_EFFORTS = [
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_PRO_REASONING_EFFORTS = [
	"medium",
	"high",
	"xhigh"
];
const GPT_5_PRO_REASONING_EFFORTS = ["high"];
const GPT_51_CODEX_MAX_REASONING_EFFORTS = [
	"none",
	"medium",
	"high",
	"xhigh"
];
const GPT_51_CODEX_MINI_REASONING_EFFORTS = ["medium"];
const CANONICAL_REASONING_EFFORTS = /* @__PURE__ */ new Set([
	"none",
	...ENABLED_REASONING_EFFORTS,
	"off"
]);
function normalizeModelId(id) {
	return normalizeLowercaseStringOrEmpty(id ?? "").replace(/-\d{4}-\d{2}-\d{2}$/u, "");
}
/** Return whether a model has a known GPT-6 reasoning and sampling contract. */
function isOpenAIGpt6Model(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	return id === "gpt-6-astra" || id === "gpt-6-sol" || id === "gpt-6-luna";
}
/** Normalize user-facing reasoning effort names to API effort names. */
function normalizeOpenAIReasoningEffort(effort) {
	const trimmed = effort.trim();
	const folded = trimmed.toLowerCase();
	return CANONICAL_REASONING_EFFORTS.has(folded) ? folded : trimmed;
}
function readCompatReasoningEfforts(compat) {
	if (!compat || typeof compat !== "object") return;
	if (compat.supportsReasoningEffort === false) return [];
	const raw = compat.supportedReasoningEfforts;
	if (!Array.isArray(raw)) return;
	return normalizeUniqueTrimmedStringList(raw);
}
/** Read a declared or known model contract, leaving unknown compatible models unspecified. */
function resolveOpenAIModelReasoningEfforts(model) {
	const compatEfforts = readCompatReasoningEfforts(model.compat);
	if (compatEfforts) return compatEfforts;
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	const api = resolveOpenAIThinkingApi(model.api);
	const supportsMax = api !== "openai-completions";
	if (isOpenAIGpt6Model(model) && api !== "azure-openai-responses") {
		if (id === "gpt-6-astra") return supportsMax ? GPT_6_ASTRA_REASONING_EFFORTS : GPT_CODEX_REASONING_EFFORTS;
		return supportsMax ? GPT_56_REASONING_EFFORTS : GPT_52_REASONING_EFFORTS;
	}
	if (/^gpt-5\.6(?:-|$)/u.test(id)) return supportsMax ? GPT_56_REASONING_EFFORTS : GPT_52_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-mini") return GPT_51_CODEX_MINI_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-max") return GPT_51_CODEX_MAX_REASONING_EFFORTS;
	if (/^gpt-5(?:\.\d+)?-codex(?:-|$)/u.test(id)) return GPT_CODEX_REASONING_EFFORTS;
	if (id === "gpt-5-pro") return GPT_5_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?-pro(?:-|$)/u.test(id)) return GPT_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?(?:-|$)/u.test(id)) return GPT_52_REASONING_EFFORTS;
	if (/^gpt-5\.1(?:-|$)/u.test(id)) return GPT_51_REASONING_EFFORTS;
	if (/^gpt-5(?:-|$)/u.test(id)) return GPT_5_REASONING_EFFORTS;
}
/** Read provider mappings without folding provider-native labels. */
function resolveOpenAIReasoningEffortMapping(effort, mapping) {
	const requested = normalizeOpenAIReasoningEffort(effort);
	return mapping?.[requested] ?? (mapping && CANONICAL_REASONING_EFFORTS.has(requested) ? Object.entries(mapping).find(([key]) => normalizeOpenAIReasoningEffort(key) === requested)?.[1] : void 0);
}
//#endregion
//#region packages/ai/src/transports/openai-reasoning-compat.ts
/** Explicit model reasoning-effort compatibility metadata. */
function readCompatReasoningEffortMap(compat) {
	const rawMap = asOptionalObjectRecord(asOptionalObjectRecord(compat)?.reasoningEffortMap);
	if (!rawMap) return {};
	return Object.fromEntries(Object.entries(rawMap).filter((entry) => typeof entry[1] === "string"));
}
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
function resolveOpenAIReasoningEffortMap(model, fallbackMap = {}) {
	return {
		...fallbackMap,
		...readCompatReasoningEffortMap(model.compat)
	};
}
//#endregion
//#region src/llm/utils/node-http-proxy.ts
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
function createHttpProxyAgentsForTarget(targetUrl) {
	const proxyUrl = resolveEnvNodeProxyUrlForTarget(targetUrl);
	if (!proxyUrl) return;
	return createFixedNodeProxyAgentPair(proxyUrl);
}
//#endregion
//#region src/plugin-sdk/llm.ts
var llm_exports = /* @__PURE__ */ __exportAll({
	AssistantMessageEventStream: () => AssistantMessageEventStream,
	adjustMaxTokensForThinking: () => adjustMaxTokensForThinking,
	buildBaseOptions: () => buildBaseOptions,
	calculateCost: () => calculateCost,
	clampReasoning: () => clampReasoning,
	clampThinkingLevel: () => clampThinkingLevel$1,
	complete: () => complete,
	completeSimple: () => completeSimple,
	createAssistantMessageEventStream: () => createAssistantMessageEventStream,
	createHttpProxyAgentsForTarget: () => createHttpProxyAgentsForTarget,
	createToolArgumentPreviewSchedule: () => createToolArgumentPreviewSchedule$1,
	getApiProvider: () => getApiProvider,
	getApiProviders: () => getApiProviders,
	getEnvApiKey: () => getEnvApiKey$1,
	parseStreamingJson: () => parseStreamingJson$1,
	resolveOpenAIModelReasoningEfforts: () => resolveOpenAIModelReasoningEfforts,
	resolveOpenAIReasoningEffortMap: () => resolveOpenAIReasoningEffortMap,
	resolveOpenAIReasoningEffortMapping: () => resolveOpenAIReasoningEffortMapping,
	resolveProviderContext: () => resolveProviderContext,
	sanitizeSurrogates: () => sanitizeSurrogates$1,
	stream: () => stream,
	streamSimple: () => streamSimple,
	transformMessages: () => transformMessages,
	validateToolArguments: () => validateToolArguments$1,
	validateToolCall: () => validateToolCall$1
});
//#endregion
//#region packages/agent-core/src/harness/prompt-template-arguments.ts
/** Parse an argument string using simple shell-style single and double quotes. */
function parseCommandArgs(argsString) {
	const args = [];
	let current = "";
	let inQuote = null;
	let hasToken = false;
	for (const char of argsString) if (inQuote) {
		if (char === inQuote) inQuote = null;
		else {
			hasToken = true;
			current += char;
		}
	} else if (char === "\"" || char === "'") {
		hasToken = true;
		inQuote = char;
	} else if (/\s/.test(char)) {
		if (hasToken) {
			args.push(current);
			current = "";
			hasToken = false;
		}
	} else {
		hasToken = true;
		current += char;
	}
	if (hasToken) args.push(current);
	return args;
}
/**
* Substitute prompt template placeholders (`$1`, `$@`, `$ARGUMENTS`, `${@:N}`, `${@:N:L}`) with command arguments.
*
* Unsafe integer placeholders resolve to empty text instead of throwing, so malformed templates cannot abort prompt
* loading or invocation.
*/
function substituteArgs(content, args) {
	const allArgs = args.join(" ");
	return content.replace(/\$(\d+)|\$\{@:(\d+)(?::(\d+))?\}|\$ARGUMENTS|\$@/g, (_match, num, startStr, lengthStr) => {
		if (num !== void 0) {
			const parsed = parseStrictNonNegativeInteger(num);
			if (parsed === void 0 || parsed <= 0) return "";
			return args[parsed - 1] ?? "";
		}
		if (startStr !== void 0) {
			const parsedStart = parseStrictNonNegativeInteger(startStr);
			if (parsedStart === void 0) return "";
			let start = parsedStart - 1;
			if (start < 0) start = 0;
			if (lengthStr) {
				const length = parseStrictNonNegativeInteger(lengthStr);
				if (length === void 0) return "";
				return args.slice(start, start + length).join(" ");
			}
			return args.slice(start).join(" ");
		}
		return allArgs;
	});
}
//#endregion
//#region packages/agent-core/src/harness/types.ts
var CompactionError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "CompactionError";
		this.code = code;
	}
};
/** Internal typed signal for a completed summary response with no usable text. */
var InvalidSummaryOutputError = class extends CompactionError {
	constructor(message) {
		super("summarization_failed", message);
	}
};
var BranchSummaryError = class extends Error {
	constructor(code, message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "BranchSummaryError";
		this.code = code;
	}
};
/** Shared role instruction used by ordinary and branch compaction requests. */
const SUMMARIZATION_SYSTEM_PROMPT = ` `;
//#endregion
//#region packages/agent-core/src/harness/compaction/utils.ts
function normalizeFileToolName(value) {
	const name = typeof value === "string" ? value.toLowerCase() : "";
	const separator = name.indexOf("__", name.startsWith("mcp__") ? 5 : 0);
	return separator < 0 ? name : name.slice(separator + 2);
}
function addFilePaths(target, value) {
	for (const path of Array.isArray(value) ? value : []) if (typeof path === "string") target.add(path);
}
/** Create an empty file-operation accumulator. */
function createFileOps() {
	return {
		read: /* @__PURE__ */ new Set(),
		written: /* @__PURE__ */ new Set(),
		edited: /* @__PURE__ */ new Set()
	};
}
/** Restore file metadata recorded by an earlier compaction or branch summary. */
function mergeSummaryFileOperations(fileOps, details) {
	addFilePaths(fileOps.read, details.readFiles);
	addFilePaths(fileOps.edited, details.modifiedFiles);
}
/** Add file operations from tool calls and results to an accumulator. */
function extractFileOpsFromMessage(message, fileOps) {
	if (message.role === "toolResult") {
		if (normalizeFileToolName(message.toolName) !== "apply_patch") return;
		for (const result of [message, ...Array.isArray(message.content) ? message.content : []]) {
			const details = asOptionalRecord(asOptionalRecord(result)?.details);
			const summary = asOptionalRecord(details?.summary);
			addFilePaths(fileOps.written, summary?.added);
			addFilePaths(fileOps.edited, summary?.modified);
		}
		return;
	}
	if (message.role !== "assistant" || !Array.isArray(message.content)) return;
	for (const block of message.content) {
		const toolCall = asOptionalRecord(block);
		if (toolCall?.type !== "toolCall") continue;
		const args = asOptionalRecord(toolCall.arguments);
		const path = [
			args?.path,
			args?.file_path,
			args?.filePath
		].find((value) => typeof value === "string");
		if (!path) continue;
		switch (normalizeFileToolName(toolCall.name)) {
			case "read":
				fileOps.read.add(path);
				break;
			case "write":
				fileOps.written.add(path);
				break;
			case "edit": fileOps.edited.add(path);
		}
	}
}
/** Compute sorted read-only and modified file lists from accumulated operations. */
function computeFileLists(fileOps) {
	const modified = /* @__PURE__ */ new Set([...fileOps.edited, ...fileOps.written]);
	return {
		readFiles: [...fileOps.read].filter((f) => !modified.has(f)).toSorted(),
		modifiedFiles: [...modified].toSorted()
	};
}
const MAX_FILE_OPS_SECTION_CHARS = 2e3;
function formatBoundedFileList(tag, files, maxChars) {
	if (files.length === 0 || maxChars <= 0) return "";
	const openTag = `<${tag}>\n`;
	const closeTag = `\n</${tag}>`;
	const lines = [];
	let usedChars = openTag.length + closeTag.length;
	for (let i = 0; i < files.length; i++) {
		const line = `${files[i]}\n`;
		const remaining = files.length - i - 1;
		const overflowLine = remaining > 0 ? `...and ${remaining} more\n` : "";
		if (usedChars + line.length + overflowLine.length > maxChars) {
			const overflow = `...and ${files.length - i} more\n`;
			if (usedChars + overflow.length <= maxChars) lines.push(overflow);
			break;
		}
		lines.push(line);
		usedChars += line.length;
	}
	return lines.length > 0 ? `${openTag}${lines.join("").trimEnd()}${closeTag}` : "";
}
/** Format file lists as bounded summary metadata tags. */
function formatFileOperations(readFiles, modifiedFiles) {
	const sections = [formatBoundedFileList("read-files", readFiles, 900), formatBoundedFileList("modified-files", modifiedFiles, 900)].filter(Boolean);
	if (sections.length === 0) return "";
	const joined = `\n\n${sections.join("\n\n")}`;
	return joined.length > 2e3 ? joined.slice(0, MAX_FILE_OPS_SECTION_CHARS) : joined;
}
/** Extract visible summary text without normalizing valid model output. */
function extractSummaryText(response) {
	const summary = response.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");
	return summary.trim() ? summary : void 0;
}
const TOOL_RESULT_MAX_CHARS = 2e3;
const IMPORTANT_TOOL_RESULT_TAIL = /(error|exception|failed|fatal|traceback|panic|stack trace|errno|exit code)/i;
function stringifyCompactionValue(value) {
	try {
		return JSON.stringify(value) ?? "undefined";
	} catch {
		return "[unserializable]";
	}
}
function truncateForSummary(text, maxChars) {
	if (text.length <= maxChars) return text;
	const tailChars = Math.min(Math.floor(maxChars * .3), 600);
	const diagnosticSearch = sliceUtf16Safe(text, -maxChars);
	const diagnosticMatches = [...diagnosticSearch.matchAll(new RegExp(IMPORTANT_TOOL_RESULT_TAIL.source, "gi"))];
	const diagnosticMatch = diagnosticMatches.findLast((match) => /^(error|exception|fatal|panic|errno)$/i.test(match[0])) ?? diagnosticMatches.at(-1);
	if (diagnosticMatch) {
		const head = truncateUtf16Safe(text, maxChars - tailChars);
		const displacedHead = sliceUtf16Safe(text, Math.max(0, head.length - 32), maxChars);
		if (!IMPORTANT_TOOL_RESULT_TAIL.test(displacedHead)) {
			const diagnosticOffset = text.length - diagnosticSearch.length + (diagnosticMatch.index ?? 0);
			const tailStart = Math.min(diagnosticOffset, text.length - tailChars);
			if (tailStart >= head.length) {
				const tail = sliceUtf16Safe(text, tailStart, tailStart + tailChars);
				return `${head}\n\n[... ${text.length - head.length - tail.length} ${tailStart + tail.length < text.length ? "middle/trailing" : "more"} characters truncated]\n\n${tail}`;
			}
		}
	}
	const sliced = truncateUtf16Safe(text, maxChars);
	return `${sliced}\n\n[... ${text.length - sliced.length} more characters truncated]`;
}
/** Extract text that compaction both estimates and includes in summary prompts. */
function getCompactionContentBlockText(block) {
	if ((block.type === "text" || block.type === "toolResult" || block.type === "tool_result") && block.text) return block.text;
	return (block.type === "toolResult" || block.type === "tool_result") && typeof block.content === "string" ? block.content : "";
}
/** Project summary content once so rendering and token accounting share omission facts. */
function getCompactionContent(content) {
	const omissions = /* @__PURE__ */ new Set();
	return {
		text: typeof content === "string" ? content : content.map((block) => {
			const blockText = getCompactionContentBlockText(block);
			if (block.type !== "text" && !blockText) omissions.add(block.type === "image" ? "[image data omitted from summary input]" : "[non-text data omitted from summary input]");
			return blockText;
		}).filter(Boolean).join("\n"),
		omissionText: [...omissions].join("\n")
	};
}
const MAX_OMISSION_MESSAGES = 8;
const OMISSION_OVERFLOW = "[More image/non-text data omitted from summary input]";
function readPersistedSender(message) {
	if (message.role !== "user") return;
	const metadata = asOptionalRecord(Reflect.get(message, "__testclaw"));
	if (!metadata) return;
	const normalize = (value) => {
		if (typeof value !== "string") return;
		return value.replaceAll("\0", "").trim() || void 0;
	};
	const sender = {
		id: normalize(metadata.senderId),
		name: normalize(metadata.senderName),
		username: normalize(metadata.senderUsername)
	};
	return sender.id ? sender : void 0;
}
/**
* Return exactly the persisted-sender text which is projected into a user
* conversation label. Keep this shared with token accounting: adding a label
* to the prompt without charging it can make bounded compaction overflow.
*/
function formatPersistedSenderSuffix(message) {
	const sender = readPersistedSender(message);
	return sender ? ` sender=${JSON.stringify(sender)}` : "";
}
function formatConversationSpeaker(message) {
	if (message.role !== "user") return message.role === "toolResult" ? "Tool result" : "User";
	return `User${formatPersistedSenderSuffix(message)}`;
}
/** Serialize LLM messages to plain text for summarization prompts. */
function serializeConversation(messages) {
	const parts = [];
	let omissionMessages = 0;
	for (const msg of messages) {
		if (msg.role === "user" && msg.runtimeContextCarrier === true) continue;
		if (msg.role === "user" || msg.role === "toolResult") {
			const { text, omissionText } = getCompactionContent(msg.content);
			if (omissionText && omissionMessages++ === MAX_OMISSION_MESSAGES) parts.push(OMISSION_OVERFLOW);
			const content = [omissionMessages <= MAX_OMISSION_MESSAGES ? omissionText : "", msg.role === "toolResult" ? truncateForSummary(text, TOOL_RESULT_MAX_CHARS) : text].filter(Boolean).join("\n");
			if (content) parts.push(`[${formatConversationSpeaker(msg)}]: ${content}`);
		} else if (msg.role === "assistant") {
			const textParts = [];
			const toolCalls = [];
			for (const block of msg.content) if (block.type === "text") textParts.push(block.text);
			else if (block.type === "toolCall") {
				const argsStr = Object.entries(block.arguments).map(([k, v]) => `${k}=${stringifyCompactionValue(v)}`).join(", ");
				toolCalls.push(`${block.name}(${argsStr})`);
			}
			if (textParts.length > 0) parts.push(`[Assistant]: ${textParts.join("\n")}`);
			if (toolCalls.length > 0) parts.push(`[Assistant tool calls]: ${toolCalls.join("; ")}`);
		}
	}
	return parts.join("\n\n");
}
//#endregion
//#region packages/agent-core/src/harness/compaction/branch-summarization.ts
/** Collect entries that should be summarized before navigating to a different session tree entry. */
function collectEntriesForBranchSummaryFromBranches(oldBranch, targetBranch) {
	const oldPath = new Set(oldBranch.map((entry) => entry.id));
	let commonAncestorId = null;
	for (const targetEntry of targetBranch.toReversed()) if (oldPath.has(targetEntry.id)) {
		commonAncestorId = targetEntry.id;
		break;
	}
	const firstSummarizedIndex = commonAncestorId === null ? 0 : oldBranch.findIndex((entry) => entry.id === commonAncestorId) + 1;
	return {
		entries: oldBranch.slice(firstSummarizedIndex),
		commonAncestorId
	};
}
/** Prepare branch entries for summarization within an optional token budget. */
function prepareBranchEntries(entries, tokenBudget = 0) {
	const messages = [];
	const fileOps = createFileOps();
	let totalTokens = 0;
	for (const entry of entries) if (entry.type === "branch_summary" && !entry.fromHook && entry.details) mergeSummaryFileOperations(fileOps, entry.details);
	for (const entry of entries.toReversed()) {
		const message = projectSessionEntryMessage(entry);
		if (!message) continue;
		extractFileOpsFromMessage(message, fileOps);
		const rendered = serializeConversation(convertToLlm([message]));
		const tokens = rendered ? Math.ceil((estimateStringChars(rendered) + (totalTokens > 0 ? 2 : 0)) / 4) : 0;
		if (tokenBudget > 0 && totalTokens + tokens > tokenBudget) break;
		messages.push(message);
		totalTokens += tokens;
	}
	return {
		messages: messages.toReversed(),
		fileOps,
		totalTokens
	};
}
const BRANCH_SUMMARY_PREAMBLE = `The user explored a different conversation branch before returning here.
Summary of that exploration:

`;
const BRANCH_SUMMARY_PROMPT = `Create a structured summary of this conversation branch for context when returning later.

Use this EXACT format:

## Goal
[What was the user trying to accomplish in this branch?]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Work that was started but not finished]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [What should happen next to continue this work]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
/** Generate a summary for abandoned branch entries. */
async function generateBranchSummary$1(entries, options) {
	const { model, apiKey, headers, signal, customInstructions, replaceInstructions, reserveTokens = 16384 } = options;
	let instructions;
	if (replaceInstructions && customInstructions) instructions = customInstructions;
	else if (customInstructions) instructions = `${BRANCH_SUMMARY_PROMPT}\n\nAdditional focus: ${customInstructions}`;
	else instructions = BRANCH_SUMMARY_PROMPT;
	const promptPrefix = "<conversation>\n";
	const promptSuffix = `\n</conversation>\n\n${instructions}`;
	const fixedInputTokens = Math.ceil(estimateStringChars(`${SUMMARIZATION_SYSTEM_PROMPT}${promptPrefix}${promptSuffix}`) / 4);
	const contextWindow = model.contextWindow || 128e3;
	const maxSummaryOutputTokens = Math.min(2048, Math.max(1, Math.floor(contextWindow / 4)), model.maxTokens > 0 ? model.maxTokens : 2048);
	const usableReserveTokens = reserveTokens < contextWindow ? reserveTokens : Math.floor(contextWindow / 2);
	const tokenBudget = contextWindow - Math.max(maxSummaryOutputTokens + fixedInputTokens, usableReserveTokens);
	if (tokenBudget <= 0) return err(new BranchSummaryError("summarization_failed", "Branch summary instructions and output reservation exceed the model context window."));
	const { messages, fileOps } = prepareBranchEntries(entries, tokenBudget);
	const conversationText = serializeConversation(convertToLlm(messages));
	if (!conversationText) {
		if (entries.some((entry) => {
			const message = projectSessionEntryMessage(entry);
			return message && serializeConversation(convertToLlm([message])).length > 0;
		})) return err(new BranchSummaryError("summarization_failed", "The latest branch content cannot fit beside the summary instructions and output. Reduce the focus instructions or select a larger context window."));
		return ok({
			summary: "No content to summarize",
			readFiles: [],
			modifiedFiles: []
		});
	}
	const summarizationMessages = [{
		role: "user",
		content: [{
			type: "text",
			text: `${promptPrefix}${conversationText}${promptSuffix}`
		}],
		timestamp: Date.now()
	}];
	const context = {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: summarizationMessages
	};
	const streamOptions = {
		apiKey,
		headers,
		signal,
		maxTokens: maxSummaryOutputTokens
	};
	const response = options.streamFn ? await consumeAgentCoreStream(options.streamFn(model, context, streamOptions), options.runtime) : await resolveAgentCoreCompleteFn(options.runtime)(model, context, streamOptions);
	options.runtime?.internalUsageSink?.(response.usage);
	if (response.stopReason === "aborted") return err(new BranchSummaryError("aborted", response.errorMessage || "Branch summary aborted"));
	if (response.stopReason === "error") return err(new BranchSummaryError("summarization_failed", `Branch summary failed: ${response.errorMessage || "Unknown error"}`));
	const summaryText = extractSummaryText(response);
	if (summaryText === void 0) return err(new BranchSummaryError("summarization_failed", "Branch summary failed: model returned no summary text"));
	let summary = BRANCH_SUMMARY_PREAMBLE + summaryText;
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	summary += formatFileOperations(readFiles, modifiedFiles);
	return ok({
		summary,
		readFiles,
		modifiedFiles
	});
}
//#endregion
//#region packages/agent-core/src/harness/compaction/summarization-completion.ts
function createSummarizationOptions(model, maxTokens, apiKey, headers, signal, thinkingLevel) {
	const options = {
		maxTokens,
		signal,
		apiKey,
		headers
	};
	const fableReasoning = (model.api === "anthropic-messages" || model.api === "bedrock-converse-stream") && resolveClaudeFable5ModelIdentity(model) !== void 0;
	if ((model.reasoning || fableReasoning) && thinkingLevel) options.reasoning = resolveAgentReasoningOption(model, thinkingLevel);
	return options;
}
/** Runs one summarization completion and maps abort/error stops to CompactionError. */
async function runSummarizationCompletion(params) {
	let promptText = `<conversation>\n${serializeConversation(convertToLlm(params.messages))}\n</conversation>\n\n`;
	if (params.previousSummary) promptText += `<previous-summary>\n${params.previousSummary}\n</previous-summary>\n\n`;
	promptText += params.prompt;
	if (params.customInstructions) promptText += `\n\nAdditional focus: ${params.customInstructions}`;
	const context = {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: promptText
			}],
			timestamp: Date.now()
		}]
	};
	const options = createSummarizationOptions(params.model, params.maxTokens, params.apiKey, params.headers, params.signal, params.thinkingLevel);
	const response = params.streamFn ? await consumeAgentCoreStream(params.streamFn(params.model, context, options), params.runtime) : await resolveAgentCoreCompleteFn(params.runtime)(params.model, context, options);
	params.runtime?.internalUsageSink?.(response.usage);
	if (response.stopReason === "aborted") return err(new CompactionError("aborted", response.errorMessage || `${params.errorLabel} aborted`));
	if (response.stopReason === "error") return err(new CompactionError("summarization_failed", `${params.errorLabel} failed: ${response.errorMessage || "Unknown error"}`));
	const summary = extractSummaryText(response);
	if (summary === void 0) return err(new InvalidSummaryOutputError(`${params.errorLabel} failed: model returned no summary text`));
	return ok(summary);
}
//#endregion
//#region packages/agent-core/src/harness/compaction/compaction.ts
function parseCompactionDetails(value) {
	const details = asOptionalRecord(value);
	if (!details || !Array.isArray(details.readFiles) || !details.readFiles.every((file) => typeof file === "string") || !Array.isArray(details.modifiedFiles) || !details.modifiedFiles.every((file) => typeof file === "string")) return;
	const request = details.latestUnresolvedUserRequest;
	const latestUnresolvedUserRequest = typeof request === "string" && request.length <= MAX_LATEST_USER_REQUEST_CHARS ? request : void 0;
	return {
		readFiles: details.readFiles,
		modifiedFiles: details.modifiedFiles,
		...latestUnresolvedUserRequest ? { latestUnresolvedUserRequest } : {}
	};
}
function extractFileOperations(messages, entries, prevBoundaryIndex) {
	const fileOps = createFileOps();
	if (prevBoundaryIndex >= 0) {
		const prevCompaction = entries[prevBoundaryIndex];
		if (prevCompaction?.type === "compaction" && !prevCompaction.fromHook) {
			const details = parseCompactionDetails(prevCompaction.details);
			if (details) mergeSummaryFileOperations(fileOps, details);
		}
	}
	for (const msg of messages) extractFileOpsFromMessage(msg, fileOps);
	return fileOps;
}
function getMessageFromEntryForCompaction(entry) {
	if (entry.type === "compaction") return;
	return projectSessionEntryMessage(entry);
}
const MAX_COMPACTION_SUMMARY_CHARS = 16e3;
const SUMMARY_TRUNCATED_MARKER = "\n\n[Compaction summary truncated to fit budget]";
const TURN_CONTEXT_PREFIX = "\n\n---\n\n**Turn Context (split turn):**\n\n";
const MAX_LATEST_USER_REQUEST_CHARS = 800;
const LATEST_USER_REQUEST_TRUNCATED_MARKER = "\n[... latest user request truncated ...]\n";
function extractLatestUserRequest(messages) {
	let source = "";
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message?.role === "user") {
			source = getCompactionContent(message.content).text.trim();
			if (source) break;
		}
	}
	if (!source || source.length <= MAX_LATEST_USER_REQUEST_CHARS) return source || void 0;
	return `${truncateUtf16Safe(source, Math.floor(759 / 2))}${LATEST_USER_REQUEST_TRUNCATED_MARKER}${sliceUtf16Safe(source, -380)}`;
}
function capCompactionSummary(summary, maxChars = MAX_COMPACTION_SUMMARY_CHARS, preservedSuffix = "") {
	if (maxChars <= 0 || summary.length <= maxChars) return summary;
	const suffix = preservedSuffix && summary.endsWith(preservedSuffix) ? preservedSuffix : "";
	if (maxChars < 46 + suffix.length) return truncateUtf16Safe(summary, maxChars);
	const budget = maxChars - 46 - suffix.length;
	const prefix = suffix ? summary.slice(0, -suffix.length) : summary;
	return `${truncateUtf16Safe(prefix, budget)}${SUMMARY_TRUNCATED_MARKER}${suffix}`;
}
/** Let each summary owner preserve its structure before checking the foreground token budget. */
function fitCompactionSummary(tokenBudget, render) {
	const full = render(MAX_COMPACTION_SUMMARY_CHARS);
	if (full && (tokenBudget === void 0 || estimateStringChars(full.summary) / 4 <= tokenBudget)) return ok(full);
	let low = 1;
	let high = 15999;
	let fitted;
	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const candidate = render(mid);
		if (!candidate) low = mid + 1;
		else if (tokenBudget === void 0 || estimateStringChars(candidate.summary) / 4 <= tokenBudget) {
			fitted = candidate;
			low = mid + 1;
		} else high = mid - 1;
	}
	return fitted ? ok(fitted) : err(new CompactionError("summarization_failed", "The compaction summary cannot fit beside the foreground prompt and retained history."));
}
/** Default compaction settings used by the harness. */
const DEFAULT_COMPACTION_SETTINGS = {
	enabled: true,
	reserveTokens: 16384,
	keepRecentTokens: 2e4
};
/** Calculate total context tokens from provider usage. */
function calculateContextTokens(usage) {
	if (usage.contextUsage?.state === "available") return usage.contextUsage.totalTokens;
	return usage.totalTokens || usage.input + usage.output + usage.cacheRead + usage.cacheWrite;
}
function getAssistantUsage(msg) {
	if (msg.role === "assistant" && "usage" in msg) {
		const assistantMsg = msg;
		if (assistantMsg.stopReason !== "aborted" && assistantMsg.stopReason !== "error" && assistantMsg.usage && calculateContextTokens(assistantMsg.usage) > 0) return assistantMsg.usage;
	}
}
function isUnavailableContextBarrier(message) {
	if (message.role !== "assistant") return false;
	const usage = "usage" in message ? message.usage : void 0;
	if (!usage) return false;
	if (message.api === "cli" && usage.contextUsage === void 0) return true;
	if (usage.contextUsage?.state !== "unavailable") return false;
	return calculateContextTokens(usage) === 0;
}
/** Return usage from the last valid assistant message in session entries. */
function getLastAssistantUsage(entries) {
	for (const entry of entries.toReversed()) if (entry.type === "message") {
		if (isUnavailableContextBarrier(entry.message)) return;
		const usage = getAssistantUsage(entry.message);
		if (usage) return usage;
	}
}
function getLastAssistantUsageInfo(messages) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages.at(i);
		if (!message) continue;
		if (isUnavailableContextBarrier(message)) return;
		const usage = getAssistantUsage(message);
		if (usage && usage.contextUsage?.state !== "unavailable") return {
			usage,
			index: i
		};
	}
}
/** Estimate context tokens for messages using provider usage when available. */
function estimateContextTokens(messages) {
	const usageInfo = getLastAssistantUsageInfo(messages);
	if (!usageInfo) {
		let estimated = 0;
		for (const message of messages) estimated += estimateTokens(message);
		return {
			tokens: estimated,
			usageTokens: 0,
			trailingTokens: estimated,
			lastUsageIndex: null
		};
	}
	const usageTokens = calculateContextTokens(usageInfo.usage);
	let trailingTokens = 0;
	for (const message of messages.slice(usageInfo.index + 1)) trailingTokens += estimateTokens(message);
	return {
		tokens: usageTokens + trailingTokens,
		usageTokens,
		trailingTokens,
		lastUsageIndex: usageInfo.index
	};
}
/** Return whether context usage exceeds the configured compaction threshold. */
function shouldCompact(contextTokens, contextWindow, settings) {
	if (!settings.enabled || !Number.isFinite(contextWindow) || contextWindow <= 0) return false;
	return contextTokens > contextWindow - settings.reserveTokens;
}
const IMAGE_BLOCK_TOKENS = 2e3;
const IMAGE_BLOCK_CHARS = IMAGE_BLOCK_TOKENS * 4;
function countContentChars(content) {
	const { text, omissionText } = getCompactionContent(content);
	const images = typeof content === "string" ? 0 : content.filter((block) => block.type === "image").length;
	const omissionChars = omissionText ? omissionText.length + 17 : 0;
	return estimateStringChars(text) + images * IMAGE_BLOCK_CHARS + omissionChars;
}
/** Estimate token count for one message using a conservative character heuristic. */
function estimateTokens(message) {
	if ("excludeFromContext" in message && message.excludeFromContext === true) return 0;
	let chars = 0;
	switch (message.role) {
		case "assistant":
			for (const block of message.content) if (block.type === "text") chars += estimateStringChars(block.text);
			else if (block.type === "thinking") chars += estimateStringChars(block.thinking);
			else if (block.type === "toolCall") chars += estimateStringChars(block.name) + estimateStringChars(stringifyCompactionValue(block.arguments));
			return Math.ceil(chars / 4);
		case "user":
			chars = countContentChars(message.content);
			chars += estimateStringChars(formatPersistedSenderSuffix(message));
			return Math.ceil(chars / 4);
		case "custom":
		case "toolResult":
			chars = countContentChars(message.content);
			return Math.ceil(chars / 4);
		case "bashExecution":
			chars = estimateStringChars(message.command) + estimateStringChars(message.output);
			return Math.ceil(chars / 4);
		case "branchSummary":
		case "compactionSummary":
			chars = estimateStringChars(message.summary);
			return Math.ceil(chars / 4);
	}
	return 0;
}
function isCutPointMessage(message) {
	switch (message.role) {
		case "custom": return !isRuntimeContextCarrier(message);
		case "user":
		case "assistant":
		case "bashExecution":
		case "branchSummary":
		case "compactionSummary": return true;
		case "toolResult": return false;
	}
	return false;
}
function isTurnStartMessage(message) {
	switch (message.role) {
		case "custom": return !isRuntimeContextCarrier(message);
		case "user":
		case "bashExecution":
		case "branchSummary":
		case "compactionSummary": return true;
		case "assistant":
		case "toolResult": return false;
	}
	return false;
}
function isTurnStartEntry(entry) {
	const message = getMessageFromEntryForCompaction(entry);
	return message ? isTurnStartMessage(message) : false;
}
/** Find the user-visible message that starts the turn containing an entry. */
function findTurnStartIndex(entries, entryIndex, startIndex) {
	for (let i = entryIndex; i >= startIndex; i--) {
		const entry = entries[i];
		if (!entry) continue;
		if (isTurnStartEntry(entry)) return i;
	}
	return -1;
}
/** Find the compaction cut point that keeps approximately the requested recent-token budget. */
function findCutPoint(entries, startIndex, endIndex, keepRecentTokens, constraints) {
	const retention = constraints?.budget;
	let cutIndex;
	let lastAllowedCut = endIndex - 1;
	for (let i = startIndex; i < endIndex; i++) {
		const entry = entries[i];
		const message = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (entry && entry.id === constraints?.preserveFromEntryId) lastAllowedCut = i;
		if (message && isCutPointMessage(message)) cutIndex = i;
	}
	if (cutIndex === void 0) return {
		firstKeptEntryIndex: startIndex,
		turnStartIndex: -1,
		isSplitTurn: false
	};
	let accumulatedTokens = 0;
	for (let i = endIndex - 1; i >= startIndex; i--) {
		const entry = entries[i];
		if (!entry) continue;
		const message = getMessageFromEntryForCompaction(entry);
		if (!message) continue;
		if (isCutPointMessage(message)) cutIndex = i;
		accumulatedTokens += retention?.estimateTokens(message) ?? estimateTokens(message);
		if (accumulatedTokens >= keepRecentTokens) break;
	}
	cutIndex = Math.min(cutIndex, lastAllowedCut);
	if (retention) {
		let retainedTokens = 0;
		let fittingCut = endIndex;
		let tailLimit = retention.maxTokens;
		for (let i = endIndex - 1; i >= cutIndex; i--) {
			const entry = entries[i];
			const message = entry ? getMessageFromEntryForCompaction(entry) : void 0;
			retainedTokens += message ? retention.estimateTokens(message) : 0;
			if (retainedTokens > tailLimit) break;
			if (i <= lastAllowedCut && message && isCutPointMessage(message)) {
				if (fittingCut === endIndex) tailLimit = Math.max(retainedTokens, retention.maxTokens - retention.reserveTokens);
				fittingCut = i;
			}
		}
		if (fittingCut === endIndex) return {
			firstKeptEntryIndex: endIndex,
			turnStartIndex: -1,
			isSplitTurn: false
		};
		cutIndex = fittingCut;
	}
	while (cutIndex > startIndex) {
		const prevEntry = entries[cutIndex - 1];
		if (!prevEntry) break;
		if (prevEntry.type === "compaction" || prevEntry.type === "reset") break;
		if (prevEntry.type === "message" || getMessageFromEntryForCompaction(prevEntry)) break;
		cutIndex--;
	}
	const cutEntry = entries[cutIndex];
	if (!cutEntry) throw new Error("compaction cut point does not reference a session entry");
	const startsTurn = isTurnStartEntry(cutEntry);
	const turnStartIndex = startsTurn ? -1 : findTurnStartIndex(entries, cutIndex, startIndex);
	return {
		firstKeptEntryIndex: cutIndex,
		turnStartIndex,
		isSplitTurn: !startsTurn && turnStartIndex !== -1
	};
}
const SUMMARIZATION_PROMPT = `The messages above are a conversation to summarize. Create a structured context checkpoint summary that another LLM will use to continue the work.

Use this EXACT format:

## Goal
[What is the user trying to accomplish? Can be multiple items if the session covers different tasks.]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned by user]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Current work]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [Ordered list of what should happen next]

## Critical Context
- [Any data, examples, or references needed to continue]
- [Or "(none)" if not applicable]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
const UPDATE_SUMMARIZATION_PROMPT = `The messages above are NEW conversation messages to incorporate into the existing summary provided in <previous-summary> tags.

Update the existing structured summary with new information. RULES:
- PRESERVE all existing information from the previous summary
- ADD new progress, decisions, and context from the new messages
- UPDATE the Progress section: move items from "In Progress" to "Done" when completed
- UPDATE "Next Steps" based on what was accomplished
- PRESERVE exact file paths, function names, and error messages
- If something is no longer relevant, you may remove it

Use this EXACT format:

## Goal
[Preserve existing goals, add new ones if the task expanded]

## Constraints & Preferences
- [Preserve existing, add new ones discovered]

## Progress
### Done
- [x] [Include previously done items AND newly completed items]

### In Progress
- [ ] [Current work - update based on progress]

### Blocked
- [Current blockers - remove if resolved]

## Key Decisions
- **[Decision]**: [Brief rationale] (preserve all previous, add new)

## Next Steps
1. [Update based on current state]

## Critical Context
- [Preserve important context, add new if needed]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
/** Generate or update a conversation summary for compaction. */
async function generateSummary$1(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime, summaryPrompt) {
	const maxTokens = Math.min(Math.floor((summaryPrompt?.kind === "turn-prefix" ? .5 : .8) * reserveTokens), model.maxTokens > 0 ? model.maxTokens : Number.POSITIVE_INFINITY);
	const selectedPrompt = summaryPrompt?.kind === "turn-prefix" ? TURN_PREFIX_SUMMARIZATION_PROMPT : summaryPrompt?.instructions;
	return await runSummarizationCompletion({
		messages: currentMessages,
		prompt: summaryPrompt ? [previousSummary && "Update the previous summary with the new conversation. Preserve relevant facts, decisions, and unresolved asks; remove stale or duplicate detail. Use the format below.", selectedPrompt].filter(Boolean).join("\n\n") : previousSummary ? UPDATE_SUMMARIZATION_PROMPT : SUMMARIZATION_PROMPT,
		customInstructions,
		previousSummary,
		model,
		maxTokens,
		apiKey,
		headers,
		signal,
		thinkingLevel,
		streamFn,
		runtime,
		errorLabel: summaryPrompt?.kind === "turn-prefix" ? "Turn prefix summarization" : "Summarization"
	});
}
/** Prepare session entries for compaction, or return undefined when compaction is not applicable. */
function prepareCompaction$1(pathEntries, settings, requestState, constraints) {
	const lastEntry = pathEntries.at(-1);
	if (!lastEntry || lastEntry.type === "reset" || lastEntry.type === "compaction" && lastEntry.fromHook) return ok(void 0);
	let prevBoundaryIndex = -1;
	for (let i = pathEntries.length - 1; i >= 0; i--) {
		const type = pathEntries.at(i)?.type;
		if (type === "compaction" || type === "reset") {
			prevBoundaryIndex = i;
			break;
		}
	}
	let previousSummary;
	let previousSummaryDetails;
	let previousLatestUnresolvedUserRequest;
	let effectiveEntries = pathEntries;
	let resetPreludeMessages = [];
	let boundaryStart = 0;
	if (prevBoundaryIndex >= 0) {
		const prevBoundary = pathEntries[prevBoundaryIndex];
		previousSummary = prevBoundary?.type === "compaction" ? prevBoundary.summary : void 0;
		if (prevBoundary?.type === "compaction") {
			const details = parseCompactionDetails(prevBoundary.details);
			previousLatestUnresolvedUserRequest = details?.latestUnresolvedUserRequest;
			if (!prevBoundary.fromHook) previousSummaryDetails = details;
		}
		const firstKeptEntryId = prevBoundary?.type === "compaction" || prevBoundary?.type === "reset" ? prevBoundary.firstKeptEntryId : void 0;
		const firstKeptEntryIndex = pathEntries.findIndex((entry) => entry.id === firstKeptEntryId);
		if (prevBoundary?.type === "reset") {
			resetPreludeMessages = (firstKeptEntryIndex >= 0 ? selectResetKeptEntries(pathEntries.slice(firstKeptEntryIndex, prevBoundaryIndex)) : []).flatMap((entry) => {
				const message = getMessageFromEntryForCompaction(entry);
				return message ? [message] : [];
			});
			effectiveEntries = pathEntries.slice(prevBoundaryIndex + 1);
			prevBoundaryIndex = -1;
		} else boundaryStart = firstKeptEntryIndex >= 0 ? firstKeptEntryIndex : prevBoundaryIndex + 1;
	}
	const boundaryEnd = effectiveEntries.length;
	const contextMessages = buildSessionContext(pathEntries).messages;
	const latestUnresolvedUserRequest = requestState ? extractLatestUserRequest(contextMessages) ?? previousLatestUnresolvedUserRequest : void 0;
	const contextUsage = estimateContextTokens(contextMessages);
	const tokensBefore = contextUsage.tokens;
	const totalEstimatedTokens = contextMessages.reduce((total, message) => total + estimateTokens(message), 0);
	const triggerUnitScale = !constraints?.budget && totalEstimatedTokens > 0 && Number.isFinite(totalEstimatedTokens) && Number.isFinite(contextUsage.usageTokens) ? Math.min(Math.max(1, settings.keepRecentTokens), Math.max(1, contextUsage.usageTokens / totalEstimatedTokens)) : 1;
	const resetPreludeTokens = resetPreludeMessages.reduce((total, message) => total + estimateTokens(message), 0);
	const keepRecentTokens = Math.min(Number.MAX_SAFE_INTEGER, settings.keepRecentTokens / triggerUnitScale + resetPreludeTokens);
	const cutPoint = findCutPoint(effectiveEntries, boundaryStart, boundaryEnd, keepRecentTokens, constraints);
	if (cutPoint.firstKeptEntryIndex === boundaryEnd) return err(new CompactionError("summarization_failed", "No complete recent message fits beside the foreground prompt, tools, and summary. Reduce the request or select a larger context window."));
	const firstKeptEntry = effectiveEntries[cutPoint.firstKeptEntryIndex];
	if (!firstKeptEntry?.id) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	const firstKeptEntryId = firstKeptEntry.id;
	const historyEnd = cutPoint.isSplitTurn ? cutPoint.turnStartIndex : cutPoint.firstKeptEntryIndex;
	const messagesToSummarize = [...resetPreludeMessages];
	for (let i = boundaryStart; i < historyEnd; i++) {
		const entry = effectiveEntries.at(i);
		const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (msg) messagesToSummarize.push(msg);
	}
	const turnPrefixMessages = [];
	if (cutPoint.isSplitTurn) for (let i = cutPoint.turnStartIndex; i < cutPoint.firstKeptEntryIndex; i++) {
		const entry = effectiveEntries.at(i);
		const msg = entry ? getMessageFromEntryForCompaction(entry) : void 0;
		if (msg) turnPrefixMessages.push(msg);
	}
	if (messagesToSummarize.length === 0 && turnPrefixMessages.length === 0) return ok(void 0);
	const fileOps = extractFileOperations(messagesToSummarize, effectiveEntries, prevBoundaryIndex);
	if (cutPoint.isSplitTurn) for (const msg of turnPrefixMessages) extractFileOpsFromMessage(msg, fileOps);
	return ok({
		firstKeptEntryId,
		messagesToSummarize,
		turnPrefixMessages,
		isSplitTurn: cutPoint.isSplitTurn,
		...latestUnresolvedUserRequest ? { latestUnresolvedUserRequest } : {},
		tokensBefore,
		previousSummary,
		previousSummaryDetails,
		fileOps,
		settings
	});
}
const TURN_PREFIX_SUMMARIZATION_PROMPT = `This is the PREFIX of a turn that was too large to keep. The SUFFIX (recent work) is retained.

Summarize the prefix to provide context for the retained suffix:

## Original Request
[What did the user ask for in this turn?]

## Early Progress
- [Key decisions and work done in the prefix]

## Context for Suffix
- [Information needed to understand the retained recent work]

Be concise. Focus on what's needed to understand the kept suffix.`;
/** Generate compaction summary data from prepared session history. */
async function compact$1(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, runtime) {
	const { firstKeptEntryId, messagesToSummarize, turnPrefixMessages, isSplitTurn, tokensBefore, previousSummary, previousSummaryDetails, fileOps, settings } = preparation;
	if (!firstKeptEntryId) return err(new CompactionError("invalid_session", "First kept entry has no UUID - session may need migration"));
	const summarizeTurnPrefix = isSplitTurn && turnPrefixMessages.length > 0;
	const previousFileOperations = previousSummaryDetails ? formatFileOperations(previousSummaryDetails.readFiles, previousSummaryDetails.modifiedFiles) : "";
	const preservedPreviousSummary = previousFileOperations && previousSummary?.endsWith(previousFileOperations) ? previousSummary.slice(0, -previousFileOperations.length) : previousSummary;
	const historyResult = messagesToSummarize.length > 0 || !summarizeTurnPrefix ? await generateSummary$1(messagesToSummarize, model, settings.reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, runtime) : ok(preservedPreviousSummary ?? "No prior history.");
	if (!historyResult.ok) return err(historyResult.error);
	let latestContext = "";
	if (summarizeTurnPrefix) {
		const turnPrefixResult = await generateSummary$1(turnPrefixMessages, model, settings.reserveTokens, apiKey, headers, signal, customInstructions, void 0, thinkingLevel, streamFn, runtime, { kind: "turn-prefix" });
		if (!turnPrefixResult.ok) return err(turnPrefixResult.error);
		latestContext = `${TURN_CONTEXT_PREFIX}${turnPrefixResult.value}`;
	}
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	const fileOperations = formatFileOperations(readFiles, modifiedFiles);
	const unresolvedRequestContext = preparation.latestUnresolvedUserRequest ? `## Latest unresolved user request\n${JSON.stringify(preparation.latestUnresolvedUserRequest)}\n\n` : "";
	const fitted = fitCompactionSummary(preparation.summaryTokenBudget, (maxChars) => {
		const requiredChars = fileOperations.length + unresolvedRequestContext.length;
		if (maxChars <= requiredChars + 46) return;
		const preservedHistoryChars = Math.min(historyResult.value.length, Math.floor((preparation.summaryTokenBudget === void 0 ? maxChars : maxChars - requiredChars) / 2));
		const latestContextBudget = maxChars - requiredChars - 46 - preservedHistoryChars;
		if (preparation.summaryTokenBudget !== void 0 && latestContext && latestContextBudget < 86) return;
		const suffix = `${latestContextBudget > 0 ? capCompactionSummary(latestContext, latestContextBudget) : ""}${fileOperations}`;
		return { summary: `${unresolvedRequestContext}${capCompactionSummary(`${historyResult.value}${suffix}`, maxChars - unresolvedRequestContext.length, suffix)}` };
	});
	if (!fitted.ok) return fitted;
	const { summary } = fitted.value;
	return ok({
		summary,
		firstKeptEntryId,
		tokensBefore,
		details: {
			readFiles,
			modifiedFiles,
			...preparation.latestUnresolvedUserRequest ? { latestUnresolvedUserRequest: preparation.latestUnresolvedUserRequest } : {}
		}
	});
}
//#endregion
//#region src/agents/runtime/proxy.ts
/**
* Proxy stream function for apps that route LLM calls through a server.
* The server manages auth and proxies requests to LLM providers.
*/
const PROXY_ERROR_BODY_MAX_BYTES = 16777216;
const PROXY_SSE_STREAM_MAX_BYTES = 16777216;
const PROXY_SSE_PENDING_BUFFER_MAX_BYTES = PROXY_SSE_STREAM_MAX_BYTES;
const PROXY_SSE_READ_IDLE_TIMEOUT_MS = 12e4;
var ProxyMessageEventStream = class extends event_stream_exports.EventStream {
	constructor() {
		super((event) => event.type === "done" || event.type === "error", (event) => {
			if (event.type === "done") return event.message;
			if (event.type === "error") return event.error;
			throw new Error("Unexpected event type");
		});
	}
};
/**
* Stream function that proxies through a server instead of calling LLM providers directly.
* The server strips the partial field from delta events to reduce bandwidth.
* We reconstruct the partial message client-side.
*
* Use this as the `streamFn` option when creating an Agent that needs to go through a proxy.
*
* @example
* ```typescript
* const agent = new Agent({
*   streamFn: (model, context, options) =>
*     streamProxy(model, context, {
*       ...options,
*       authToken: await getAuthToken(),
*       proxyUrl: "https://genai.example.com",
*     }),
* });
* ```
*/
function buildProxyRequestOptions(options) {
	return {
		temperature: options.temperature,
		maxTokens: options.maxTokens,
		reasoning: options.reasoning,
		cacheRetention: options.cacheRetention,
		sessionId: options.sessionId,
		promptCacheKey: options.promptCacheKey,
		metadata: options.metadata,
		transport: options.transport,
		thinkingBudgets: options.thinkingBudgets,
		maxRetryDelayMs: options.maxRetryDelayMs,
		timeoutMs: options.timeoutMs
	};
}
function sanitizeProxyModel(model) {
	const { headers: _headers, ...safeModel } = model;
	return safeModel;
}
function resolveProxyReadIdleTimeoutMs(timeoutMs) {
	return resolvePositiveTimerTimeoutMs(timeoutMs, PROXY_SSE_READ_IDLE_TIMEOUT_MS);
}
function createProxyRequestTimeoutError(timeoutMs) {
	const error = /* @__PURE__ */ new Error(`Proxy request timed out after ${timeoutMs}ms`);
	error.name = "TimeoutError";
	return error;
}
function buildProxyRequestAbort(callerSignal, timeoutMs) {
	const timeoutController = new AbortController();
	const timeoutId = setTimeout(() => {
		timeoutController.abort(createProxyRequestTimeoutError(timeoutMs));
	}, timeoutMs);
	return {
		signal: callerSignal ? AbortSignal.any([callerSignal, timeoutController.signal]) : timeoutController.signal,
		clear: () => {
			clearTimeout(timeoutId);
		}
	};
}
function isProxyRequestTimeoutError(params) {
	if (params.callerSignal?.aborted || !params.requestSignal.aborted) return false;
	if (!(params.error instanceof Error)) return false;
	return params.error.name === "AbortError" || params.error.name === "TimeoutError" || params.error.message === "Request was aborted";
}
async function readProxyErrorData(response, readIdleTimeoutMs) {
	const bytes = await readResponseWithLimit(response, PROXY_ERROR_BODY_MAX_BYTES, {
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Proxy error body exceeded ${maxBytes} bytes`),
		chunkTimeoutMs: readIdleTimeoutMs,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Proxy error body stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
async function readProxySseChunk(reader, readIdleTimeoutMs, cancel) {
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const timeoutError = /* @__PURE__ */ new Error(`Proxy SSE stream stalled: no data received for ${readIdleTimeoutMs}ms`);
		const timeoutId = setTimeout(() => {
			timedOut = true;
			cancel(timeoutError);
			reject(timeoutError);
		}, readIdleTimeoutMs);
		reader.read().then((result) => {
			clearTimeout(timeoutId);
			if (!timedOut) resolve(result);
		}, (error) => {
			clearTimeout(timeoutId);
			if (!timedOut) reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
function assertProxySsePendingBufferWithinLimit(buffer) {
	if (new TextEncoder().encode(buffer).byteLength <= PROXY_SSE_PENDING_BUFFER_MAX_BYTES) return;
	throw new Error(`Proxy SSE pending buffer exceeded ${PROXY_SSE_PENDING_BUFFER_MAX_BYTES} bytes`);
}
function streamProxy(model, context, options) {
	const stream = new ProxyMessageEventStream();
	(async () => {
		const partial = {
			role: "assistant",
			stopReason: "stop",
			content: [],
			api: model.api,
			provider: model.provider,
			model: model.id,
			usage: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				totalTokens: 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			},
			timestamp: Date.now()
		};
		let reader;
		let readerReachedEof = false;
		let cancellation;
		let cleanupReason;
		const readIdleTimeoutMs = resolveProxyReadIdleTimeoutMs(options.timeoutMs);
		const cancelReader = (reason) => reader ? cancellation ??= reader.cancel(reason).catch(() => void 0) : Promise.resolve();
		const abortHandler = () => void cancelReader("Request aborted by user");
		options.signal?.addEventListener("abort", abortHandler);
		try {
			const requestAbort = buildProxyRequestAbort(options.signal, readIdleTimeoutMs);
			const response = await fetch(`${options.proxyUrl}/api/stream`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${options.authToken}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: sanitizeProxyModel(model),
					context,
					options: buildProxyRequestOptions(options)
				}),
				signal: requestAbort.signal
			}).catch((error) => {
				if (isProxyRequestTimeoutError({
					error,
					callerSignal: options.signal,
					requestSignal: requestAbort.signal
				})) throw new Error(`Proxy request timed out after ${readIdleTimeoutMs}ms`, { cause: error instanceof Error ? error : void 0 });
				throw error;
			}).finally(() => {
				requestAbort.clear();
			});
			if (!response.ok) {
				let errorMessage = `Proxy error: ${response.status} ${response.statusText}`;
				try {
					const errorData = await readProxyErrorData(response, readIdleTimeoutMs);
					if (errorData?.error) errorMessage = `Proxy error: ${errorData.error}`;
				} catch (error) {
					if (error instanceof Error && error.message.startsWith("Proxy error body")) throw error;
				}
				throw new Error(errorMessage);
			}
			reader = response.body.getReader();
			const sseReader = createSseByteGuard(reader, {
				maxBytes: PROXY_SSE_STREAM_MAX_BYTES,
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Proxy SSE stream exceeded ${maxBytes} bytes`)
			});
			const decoder = new TextDecoder();
			let buffer = "";
			let terminalEventSeen = false;
			const toolArgumentPreviewSchedules = /* @__PURE__ */ new Map();
			const processSseLine = (line) => {
				if (!line.startsWith("data:")) return false;
				const data = line.slice(5).trim();
				if (!data) return false;
				const event = processProxyEvent(JSON.parse(data), partial, toolArgumentPreviewSchedules);
				if (!event) return false;
				stream.push(event);
				return event.type === "done" || event.type === "error";
			};
			while (!terminalEventSeen) {
				const { done, value } = await readProxySseChunk(sseReader, readIdleTimeoutMs, cancelReader);
				if (done) {
					readerReachedEof = cancellation === void 0;
					break;
				}
				if (options.signal?.aborted) throw new Error("Request aborted by user");
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				assertProxySsePendingBufferWithinLimit(buffer);
				for (const line of lines) {
					terminalEventSeen = processSseLine(line);
					if (terminalEventSeen) break;
				}
			}
			if (options.signal?.aborted) throw new Error("Request aborted by user");
			if (readerReachedEof) {
				buffer += decoder.decode();
				if (buffer.trim()) terminalEventSeen = processSseLine(buffer);
			}
			if (!terminalEventSeen) throw new Error("Proxy stream ended before terminal event");
			stream.end();
		} catch (error) {
			cleanupReason = error;
			const errorMessage = error instanceof Error ? error.message : String(error);
			const reason = options.signal?.aborted ? "aborted" : "error";
			partial.stopReason = reason;
			partial.errorMessage = errorMessage;
			stream.push({
				type: "error",
				reason,
				error: partial
			});
			stream.end();
		} finally {
			try {
				if (reader && !readerReachedEof) cancelReader(cleanupReason);
				reader?.releaseLock();
			} catch {}
			options.signal?.removeEventListener("abort", abortHandler);
		}
	})();
	return stream;
}
/**
* Process a proxy event and update the partial message.
*/
function processProxyEvent(proxyEvent, partial, toolArgumentPreviewSchedules) {
	switch (proxyEvent.type) {
		case "start": return {
			type: "start",
			partial
		};
		case "text_start":
			partial.content[proxyEvent.contentIndex] = {
				type: "text",
				text: "",
				...proxyEvent.contentSignature !== void 0 ? { textSignature: proxyEvent.contentSignature } : {}
			};
			return {
				type: "text_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		case "text_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "text") {
				content.text += proxyEvent.delta;
				return {
					type: "text_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received text_delta for non-text content");
		}
		case "text_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "text") {
				if (proxyEvent.contentSignature !== void 0) content.textSignature = proxyEvent.contentSignature;
				return {
					type: "text_end",
					contentIndex: proxyEvent.contentIndex,
					content: content.text,
					partial
				};
			}
			throw new Error("Received text_end for non-text content");
		}
		case "thinking_start":
			partial.content[proxyEvent.contentIndex] = {
				type: "thinking",
				thinking: ""
			};
			return {
				type: "thinking_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		case "thinking_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "thinking") {
				content.thinking += proxyEvent.delta;
				return {
					type: "thinking_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received thinking_delta for non-thinking content");
		}
		case "thinking_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "thinking") {
				content.thinkingSignature = proxyEvent.contentSignature;
				return {
					type: "thinking_end",
					contentIndex: proxyEvent.contentIndex,
					content: content.thinking,
					partial
				};
			}
			throw new Error("Received thinking_end for non-thinking content");
		}
		case "toolcall_start": {
			const content = {
				type: "toolCall",
				id: proxyEvent.id,
				name: proxyEvent.toolName,
				arguments: {},
				partialJson: ""
			};
			partial.content[proxyEvent.contentIndex] = content;
			toolArgumentPreviewSchedules.set(proxyEvent.contentIndex, createToolArgumentPreviewSchedule());
			return {
				type: "toolcall_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		}
		case "toolcall_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "toolCall") {
				const streamingContent = content;
				streamingContent.partialJson += proxyEvent.delta;
				const previewSchedule = toolArgumentPreviewSchedules.get(proxyEvent.contentIndex);
				if (!previewSchedule) throw new Error("Received toolcall_delta without a preview schedule");
				if (previewSchedule(streamingContent.partialJson.length)) content.arguments = parseStreamingJson(streamingContent.partialJson);
				partial.content[proxyEvent.contentIndex] = { ...content };
				return {
					type: "toolcall_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received toolcall_delta for non-toolCall content");
		}
		case "toolcall_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "toolCall") {
				const streamingContent = content;
				content.arguments = streamingContent.partialJson ? parseTerminalToolCallArguments(streamingContent.partialJson) : {};
				toolArgumentPreviewSchedules.delete(proxyEvent.contentIndex);
				delete content.partialJson;
				return {
					type: "toolcall_end",
					contentIndex: proxyEvent.contentIndex,
					toolCall: content,
					partial
				};
			}
			return;
		}
		case "done":
			partial.stopReason = proxyEvent.reason;
			partial.usage = proxyEvent.usage;
			return {
				type: "done",
				reason: proxyEvent.reason,
				message: partial
			};
		case "error":
			partial.stopReason = proxyEvent.reason;
			partial.errorMessage = proxyEvent.errorMessage;
			partial.usage = proxyEvent.usage;
			return {
				type: "error",
				reason: proxyEvent.reason,
				error: partial
			};
		default:
			console.warn(`Unhandled proxy event type: ${proxyEvent.type}`);
			return;
	}
}
//#endregion
//#region src/plugin-sdk/agent-core.ts
var agent_core_exports = /* @__PURE__ */ __exportAll({
	Agent: () => Agent,
	BRANCH_SUMMARY_PREFIX: () => BRANCH_SUMMARY_PREFIX,
	BRANCH_SUMMARY_SUFFIX: () => BRANCH_SUMMARY_SUFFIX,
	COMPACTION_SUMMARY_PREFIX: () => COMPACTION_SUMMARY_PREFIX,
	COMPACTION_SUMMARY_SUFFIX: () => COMPACTION_SUMMARY_SUFFIX,
	DEFAULT_COMPACTION_SETTINGS: () => DEFAULT_COMPACTION_SETTINGS,
	IMAGE_BLOCK_TOKENS: () => IMAGE_BLOCK_TOKENS,
	bashExecutionToText: () => bashExecutionToText,
	buildSessionContext: () => buildSessionContext,
	calculateContextTokens: () => calculateContextTokens,
	collectEntriesForBranchSummaryFromBranches: () => collectEntriesForBranchSummaryFromBranches,
	compact: () => compact$1,
	estimateContextTokens: () => estimateContextTokens,
	estimateTokens: () => estimateTokens,
	findCutPoint: () => findCutPoint,
	findTurnStartIndex: () => findTurnStartIndex,
	generateBranchSummary: () => generateBranchSummary$1,
	generateSummary: () => generateSummary$1,
	getLastAssistantUsage: () => getLastAssistantUsage,
	prepareBranchEntries: () => prepareBranchEntries,
	prepareCompaction: () => prepareCompaction$1,
	runAgentLoop: () => runAgentLoop,
	serializeConversation: () => serializeConversation,
	shouldCompact: () => shouldCompact,
	streamProxy: () => streamProxy,
	testClawAgentCoreRuntime: () => testClawAgentCoreRuntime,
	uuidv7: () => uuidv7
});
/** Runtime adapter that lets the package agent-core use Assistant LLM helpers. */
const testClawAgentCoreRuntime = {
	runStream: runPluginStreamConsumer,
	completeSimple: ((model, context, options) => completeSimple(model, context, options)),
	streamSimple: ((model, context, options) => streamSimple(model, context, options))
};
/** Agent-core class preconfigured with Runtime dependencies. */
var Agent = class extends Agent$1 {
	constructor(options = {}) {
		super({
			runtime: testClawAgentCoreRuntime,
			...options
		});
	}
};
//#endregion
//#region src/agents/agent-compaction-constants.ts
const MAX_COMPACTION_RESERVE_RATIO = .25;
/** Caps compaction headroom so prompts retain at least three quarters of the model window. */
function resolveEffectiveCompactionReserveTokens(params) {
	const contextTokenBudget = Math.max(1, Math.floor(params.contextTokenBudget));
	return Math.min(Math.max(0, Math.floor(params.reserveTokens)), Math.floor(contextTokenBudget * MAX_COMPACTION_RESERVE_RATIO));
}
//#endregion
//#region src/agents/compaction-planning-projection.ts
/** Builds bounded transcript projections for compaction worker planning. */
const TEXT_TRUNCATE_THRESHOLD_CHARS = 32768;
const TEXT_SAMPLE_CHARS = 8192;
const PLANNING_MAX_CHARS = 262144;
const MAX_ARGUMENT_ESTIMATE_CHARS = 1e6;
const UNMEASURABLE_ARGUMENT_OMITTED_CHARS = Number.MAX_SAFE_INTEGER;
const OMITTED_CHARS_FIELD = "__testclawCompactionPlanningOmittedChars";
function readCompactionPlanningOmittedChars(message) {
	const value = Reflect.get(message, OMITTED_CHARS_FIELD);
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}
function projectText(text, budget) {
	if (text.length <= TEXT_TRUNCATE_THRESHOLD_CHARS && text.length <= budget.remainingChars) {
		budget.remainingChars -= text.length;
		return null;
	}
	const sample = truncateUtf16Safe(text, Math.min(TEXT_SAMPLE_CHARS, budget.remainingChars));
	budget.remainingChars -= sample.length;
	return {
		text: sample,
		omittedChars: estimateStringChars(text.slice(sample.length))
	};
}
function jsonStringLengthWithin(text, maxChars, estimate) {
	let length = 2;
	for (let index = 0; index < text.length; index += 1) {
		const char = text[index] ?? "";
		const code = text.charCodeAt(index);
		const nextCode = text.charCodeAt(index + 1);
		const pairedSurrogate = code >= 55296 && code <= 56319 && nextCode >= 56320 && nextCode <= 57343;
		length += pairedSurrogate ? 2 : code >= 55296 && code <= 57343 ? 6 : char === "\"" || char === "\\" || code === 8 || code === 9 || code === 10 || code === 12 || code === 13 ? 2 : code < 32 ? 6 : 1;
		if (pairedSurrogate) index += 1;
		if (length > maxChars) return;
	}
	estimate.cjkChars += estimateStringChars(text) - text.length;
	return length;
}
function jsonLengthWithin(value, maxChars, estimate, seen = /* @__PURE__ */ new Set()) {
	if (typeof value === "string") return jsonStringLengthWithin(value, maxChars, estimate);
	if (value === null) return 4;
	if (typeof value === "number" || typeof value === "boolean") {
		const length = String(value).length;
		return length <= maxChars ? length : void 0;
	}
	if (!value || typeof value !== "object" || seen.has(value)) return;
	seen.add(value);
	let length = 2;
	if (Array.isArray(value)) for (const entry of value) {
		const separatorLength = length === 2 ? 0 : 1;
		const entryLength = jsonLengthWithin(entry, maxChars - length - separatorLength, estimate, seen);
		if (entryLength === void 0) return;
		length += separatorLength + entryLength;
		if (length > maxChars) return;
	}
	else {
		const record = value;
		for (const key in record) {
			if (!Object.hasOwn(record, key)) continue;
			const separatorLength = length === 2 ? 0 : 1;
			const keyLength = jsonStringLengthWithin(key, maxChars - length - separatorLength, estimate);
			const entryLength = jsonLengthWithin(record[key], maxChars - length - separatorLength - (keyLength ?? 0) - 1, estimate, seen);
			if (keyLength === void 0 || entryLength === void 0) return;
			length += separatorLength + keyLength + entryLength + 1;
			if (length > maxChars) return;
		}
	}
	seen.delete(value);
	return length;
}
function projectToolArguments(value, budget) {
	const estimate = { cjkChars: 0 };
	const length = jsonLengthWithin(value, MAX_ARGUMENT_ESTIMATE_CHARS, estimate);
	if (length !== void 0 && length <= budget.remainingChars) {
		budget.remainingChars -= length;
		return;
	}
	budget.remainingChars = 0;
	return length === void 0 ? UNMEASURABLE_ARGUMENT_OMITTED_CHARS : length + estimate.cjkChars - 2;
}
function projectContentBlock(block, budget) {
	if (!block || typeof block !== "object") return {
		block,
		omittedChars: 0,
		changed: false
	};
	const record = block;
	const type = typeof record.type === "string" ? record.type : "";
	if (type === "image" && typeof record.data === "string" && record.data.length > 0) return {
		block: {
			...record,
			data: ""
		},
		omittedChars: 0,
		changed: true
	};
	const hasText = typeof record.text === "string" && record.text.length > 0;
	const textIsModelVisible = type === "text" || (type === "toolResult" || type === "tool_result") && hasText;
	const contentIsModelVisible = (type === "toolResult" || type === "tool_result") && !hasText && typeof record.content === "string";
	let next;
	let omittedChars = 0;
	for (const field of [
		"text",
		"content",
		"thinking"
	]) {
		if (field === "thinking" && type !== "thinking") continue;
		const value = record[field];
		const projected = typeof value === "string" ? projectText(value, budget) : null;
		if (!projected) continue;
		next ??= { ...record };
		next[field] = projected.text;
		omittedChars += field === "thinking" || (field === "text" ? textIsModelVisible : contentIsModelVisible) ? projected.omittedChars : 0;
	}
	if (type === "toolCall") {
		const omittedArguments = projectToolArguments(record.arguments, budget);
		if (omittedArguments !== void 0) {
			next ??= { ...record };
			next.arguments = {};
			omittedChars += omittedArguments;
		}
	}
	for (const signature of [
		"textSignature",
		"thinkingSignature",
		"thoughtSignature"
	]) if (signature in record) {
		next ??= { ...record };
		delete next[signature];
	}
	return next ? {
		block: next,
		omittedChars,
		changed: true
	} : {
		block,
		omittedChars,
		changed: false
	};
}
function projectStringFields(message, fields, budget) {
	let omittedChars = readCompactionPlanningOmittedChars(message);
	let next;
	for (const field of fields) {
		const value = Reflect.get(message, field);
		if (typeof value !== "string") continue;
		const projected = projectText(value, budget);
		if (!projected) continue;
		next ??= { ...message };
		Reflect.set(next, field, projected.text);
		omittedChars += projected.omittedChars;
	}
	return next ? Object.assign(next, { [OMITTED_CHARS_FIELD]: omittedChars }) : message;
}
function projectMessage(message, budget) {
	let source = message;
	if (message.role === "assistant") source = {
		role: message.role,
		content: message.content,
		stopReason: message.stopReason,
		timestamp: message.timestamp
	};
	else if (message.role === "bashExecution") {
		const { fullOutputPath: _, ...rest } = message;
		source = rest;
	} else if (message.role === "compactionSummary" || message.role === "custom") {
		const { details: _, ...rest } = message;
		source = rest;
	}
	const content = source.content;
	if (typeof content === "string") return projectStringFields(source, ["content"], budget);
	if (!Array.isArray(content)) switch (source.role) {
		case "bashExecution": return projectStringFields(source, ["command", "output"], budget);
		case "branchSummary":
		case "compactionSummary": return projectStringFields(source, ["summary"], budget);
		default: return source;
	}
	let omittedChars = 0;
	let changed = false;
	const projectedContent = content.map((block) => {
		const projected = projectContentBlock(block, budget);
		omittedChars += projected.omittedChars;
		changed ||= projected.changed;
		return projected.block;
	});
	if (!changed) return source;
	return Object.assign({}, source, {
		content: projectedContent,
		[OMITTED_CHARS_FIELD]: readCompactionPlanningOmittedChars(source) + omittedChars
	});
}
function projectCompactionPlanningMessages(messages) {
	const budget = { remainingChars: PLANNING_MAX_CHARS };
	return messages.map((message) => projectMessage(message, budget));
}
//#endregion
//#region src/agents/compaction-planning.ts
/**
* Planning helpers for transcript compaction. The module estimates sanitized
* token usage, chooses chunking strategy, and preserves active tool-use pairs
* while splitting history for summaries.
*/
/** Default share of context window targeted for compaction chunks. */
const BASE_CHUNK_RATIO = .4;
/** Lower bound for adaptive compaction chunk sizing. */
const MIN_CHUNK_RATIO = .15;
/** Buffer for estimateTokens() inaccuracy. */
const SAFETY_MARGIN = 1.2;
const DEFAULT_PARTS = 2;
/**
* Overhead reserved for summary prompt, system prompt, prior summary, wrapper
* tags, and high-reasoning summary generation.
*/
const SUMMARIZATION_OVERHEAD_TOKENS = 4096;
/** Estimates compaction tokens after removing fields that must not reach summarization. */
function estimateMessagesTokens(messages) {
	return sanitizeCompactionMessages(messages).reduce((sum, message) => sum + estimateCompactionPlanningTokens(message), 0);
}
/**
* Per-original-message token estimates, aligned 1:1 to the input array. Sanitizes
* the full array once instead of wrapping and re-cloning each message in its own
* 1-element array. Runtime-context entries are not model-visible, so they estimate
* to 0 here just as sanitizeCompactionMessages([msg]) would drop them.
*/
function estimatePerMessageTokens(messages) {
	const detailStripped = stripToolResultDetails(messages);
	const modelVisible = new Set(stripRuntimeContextCustomMessages(detailStripped));
	return detailStripped.map((message) => modelVisible.has(message) ? estimateCompactionPlanningTokens(message) : 0);
}
/** Removes runtime-only context and tool-result details before token estimates or summaries. */
function sanitizeCompactionMessages(messages) {
	return stripToolResultDetails(stripRuntimeContextCustomMessages(messages));
}
function estimateCompactionPlanningTokens(message) {
	return estimateTokens(message) + Math.ceil(readCompactionPlanningOmittedChars(message) / 4);
}
/** Builds a bounded planning projection that preserves token pressure accounting. */
function projectCompactionMessagesForPlanning(messages) {
	return projectCompactionPlanningMessages(sanitizeCompactionMessages(messages));
}
/** Clamps requested split parts to a usable count for the available messages. */
function normalizeCompactionParts(parts, messageCount) {
	if (!Number.isFinite(parts) || parts <= 1) return 1;
	return Math.min(Math.max(1, Math.floor(parts)), Math.max(1, messageCount));
}
function forEachCompactionMessageGroup(messages, perMessageTokens, visit) {
	let start = 0;
	let currentTokens = 0;
	let pendingToolCalls = createToolCallOccurrenceQueue();
	for (const [index, message] of messages.entries()) {
		currentTokens += perMessageTokens[index];
		if (message.role === "assistant") {
			const stopReason = message.stopReason;
			const toolCalls = stopReason === "aborted" || stopReason === "error" ? [] : extractToolCallsFromAssistant(message);
			pendingToolCalls = createToolCallOccurrenceQueue();
			for (const toolCall of toolCalls) pendingToolCalls.add(toolCall.id, true);
		} else if (message.role === "toolResult" && pendingToolCalls.size > 0) {
			const resultId = extractToolResultId(message);
			if (resultId) pendingToolCalls.claim(resultId);
			else pendingToolCalls.clear();
		}
		if (pendingToolCalls.size === 0) {
			visit(start, index + 1, currentTokens);
			start = index + 1;
			currentTokens = 0;
		}
	}
	if (start < messages.length) visit(start, messages.length, currentTokens);
}
/** Chunks atomic tool-call groups without splitting a provider-visible call/result pair. */
function chunkCompactionMessageGroups(messages, maxTokens, perMessageTokens, maxChunks = Number.POSITIVE_INFINITY) {
	const chunks = [];
	let chunkStart = 0;
	let currentTokens = 0;
	forEachCompactionMessageGroup(messages, perMessageTokens, (start, _end, tokens) => {
		if (start > chunkStart && chunks.length < maxChunks - 1 && currentTokens + tokens > maxTokens) {
			chunks.push(messages.slice(chunkStart, start));
			chunkStart = start;
			currentTokens = 0;
		}
		currentTokens += tokens;
	});
	if (chunkStart < messages.length) chunks.push(messages.slice(chunkStart));
	return chunks;
}
/**
* Compute adaptive chunk ratio based on average message size.
* When messages are large, we use smaller chunks to avoid exceeding model limits.
*/
function computeAdaptiveChunkRatio(messages, contextWindow) {
	if (messages.length === 0) return BASE_CHUNK_RATIO;
	const avgRatio = estimateMessagesTokens(messages) / messages.length * SAFETY_MARGIN / contextWindow;
	if (avgRatio > .1) {
		const reduction = Math.min(avgRatio * 2, .25);
		return Math.max(MIN_CHUNK_RATIO, BASE_CHUNK_RATIO - reduction);
	}
	return BASE_CHUNK_RATIO;
}
/** Builds sanitized chunks for summarization prompts. */
function buildSummaryChunks(params) {
	const safeMessages = sanitizeCompactionMessages(params.messages);
	return chunkCompactionMessageGroups(safeMessages, Math.max(1, Math.floor(params.maxChunkTokens / SAFETY_MARGIN)), estimatePerMessageTokens(safeMessages));
}
/** Separates messages too large to summarize and emits compact placeholder notes for them. */
function buildOversizedFallbackPlan(params) {
	const smallMessages = [];
	const oversizedNotes = [];
	const perMessageTokens = estimatePerMessageTokens(params.messages);
	const oversizedThreshold = params.contextWindow * .5;
	forEachCompactionMessageGroup(params.messages, perMessageTokens, (start, end) => {
		let omitToolBatch = false;
		for (let index = start; index < end; index++) {
			const message = params.messages[index];
			const tokens = perMessageTokens[index];
			if (tokens * 1.2 > oversizedThreshold) {
				oversizedNotes.push(`[Large ${message.role} (~${Math.round(tokens / 1e3)}K tokens) omitted from summary]`);
				omitToolBatch ||= message.role === "assistant" || message.role === "toolResult";
			}
		}
		for (let index = start; index < end; index++) {
			if (perMessageTokens[index] * 1.2 > oversizedThreshold) continue;
			const message = params.messages[index];
			if (!omitToolBatch || message.role !== "assistant" && message.role !== "toolResult") smallMessages.push(message);
		}
	});
	return {
		smallMessages,
		oversizedNotes
	};
}
/** Plans whether to split a summarization stage based on message count and token budget. */
function buildStageSplitPlan(params) {
	const minMessagesForSplit = Math.max(2, params.minMessagesForSplit ?? 4);
	const parts = normalizeCompactionParts(params.parts ?? DEFAULT_PARTS, params.messages.length);
	if (parts <= 1 || params.messages.length < minMessagesForSplit) return { mode: "single" };
	const perMessageTokens = estimatePerMessageTokens(params.messages);
	const totalTokens = perMessageTokens.reduce((sum, tokens) => sum + tokens, 0);
	if (totalTokens <= params.maxChunkTokens) return { mode: "single" };
	const chunks = chunkCompactionMessageGroups(params.messages, totalTokens / parts, perMessageTokens, parts);
	return chunks.length > 1 ? {
		mode: "split",
		chunks
	} : { mode: "single" };
}
/** Drops oldest token-share chunks until history fits the requested context share. */
function pruneHistoryForContextShare(params) {
	const budgetTokens = Math.max(1, Math.floor(params.maxContextTokens * params.maxHistoryShare));
	let keptMessages = params.messages;
	const allDroppedMessages = [];
	let droppedChunks = 0;
	const parts = normalizeCompactionParts(params.parts ?? DEFAULT_PARTS, keptMessages.length);
	const originalMessageIndexes = new Map(params.messages.map((message, index) => [message, index]));
	while (keptMessages.length > 0) {
		const splitPlan = buildStageSplitPlan({
			messages: keptMessages,
			maxChunkTokens: budgetTokens,
			minMessagesForSplit: 2,
			parts
		});
		if (splitPlan.mode === "single") break;
		const dropped = splitPlan.chunks[0];
		const retained = splitPlan.chunks.slice(1).flat();
		const repairReport = repairToolUseResultPairing(retained);
		const repairedDropped = repairReport.discarded;
		droppedChunks += 1;
		allDroppedMessages.push(...dropped, ...repairedDropped);
		keptMessages = repairReport.messages;
	}
	allDroppedMessages.sort((left, right) => (originalMessageIndexes.get(left) ?? params.messages.length) - (originalMessageIndexes.get(right) ?? params.messages.length));
	return {
		messages: keptMessages,
		droppedMessagesList: allDroppedMessages,
		droppedChunks,
		droppedMessages: allDroppedMessages.length,
		droppedTokens: estimateMessagesTokens(allDroppedMessages),
		keptTokens: estimateMessagesTokens(keptMessages),
		budgetTokens
	};
}
/** Computes whether new content exceeds the history budget and plans pruning when needed. */
function buildHistoryPrunePlan(params) {
	const summarizableTokens = estimateMessagesTokens(params.messagesToSummarize) + estimateMessagesTokens(params.turnPrefixMessages);
	const newContentTokens = Math.max(0, Math.floor(params.tokensBefore - summarizableTokens));
	const maxHistoryTokens = Math.floor(params.contextWindowTokens * params.maxHistoryShare * SAFETY_MARGIN);
	const plan = {
		summarizableTokens,
		newContentTokens,
		maxHistoryTokens
	};
	return newContentTokens <= maxHistoryTokens ? plan : {
		...plan,
		pruned: pruneHistoryForContextShare({
			messages: params.messagesToSummarize,
			maxContextTokens: params.contextWindowTokens,
			maxHistoryShare: params.maxHistoryShare,
			parts: params.parts
		})
	};
}
const TOOL_RESULT_CHARS_PER_TOKEN = 2;
const JSON_PAYLOAD_CHARS_PER_TOKEN = 3;
const MESSAGE_BOUNDARY_OVERHEAD_TOKENS = 12;
const CONTENT_BLOCK_OVERHEAD_TOKENS = 6;
function estimateStringTokenPressure(text, charsPerToken = 4, mode = "general") {
	const estimatedTokens = Math.ceil(estimateStringChars(text) / charsPerToken);
	return mode === "tool-result" ? Math.max(Math.ceil(text.length / TOOL_RESULT_CHARS_PER_TOKEN), estimatedTokens) : estimatedTokens;
}
function estimateJsonPayloadTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN, mode = "general") {
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? estimateStringTokenPressure(serialized, charsPerToken, mode) : 1;
	} catch {
		return 256;
	}
}
/** Count model-facing definitions; runtime output schemas and metadata never reach the provider. */
function estimateToolSchemaTokens(tools) {
	return tools?.length ? estimateJsonPayloadTokenPressure(tools.map(({ name, description, parameters }) => ({
		name,
		description,
		parameters
	}))) : 0;
}
function estimateIdentifierTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN) {
	if (value == null) return 0;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return estimateStringTokenPressure(String(value), charsPerToken);
	return estimateJsonPayloadTokenPressure(value, charsPerToken);
}
function estimateContentBlockTokenPressure(block, charsPerToken = 4, mode = "general") {
	if (typeof block === "string") return estimateStringTokenPressure(block, charsPerToken, mode);
	if (!isRecord(block)) return estimateJsonPayloadTokenPressure(block, charsPerToken, mode);
	const type = block.type;
	const text = type === "text" ? block.text : type === "thinking" ? block.thinking : void 0;
	if (typeof text === "string") return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(text, charsPerToken, mode);
	if (type === "image") return IMAGE_BLOCK_TOKENS;
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateJsonPayloadTokenPressure(block, charsPerToken, mode);
}
function estimateAssistantToolCallTokenPressure(block) {
	const args = block.arguments ?? block.input ?? block.args ?? {};
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateIdentifierTokenPressure(block.name, JSON_PAYLOAD_CHARS_PER_TOKEN) + estimateJsonPayloadTokenPressure(args, JSON_PAYLOAD_CHARS_PER_TOKEN);
}
function estimateContentTokenPressure(content, mode = "general") {
	if (typeof content === "string") return estimateStringTokenPressure(content, 4, mode);
	if (Array.isArray(content)) return content.reduce((sum, block) => sum + estimateContentBlockTokenPressure(block, 4, mode), 0);
	if (content !== void 0) return estimateJsonPayloadTokenPressure(content, mode === "tool-result" ? 4 : JSON_PAYLOAD_CHARS_PER_TOKEN, mode);
	return 0;
}
function estimateMessageTokenPressure(message) {
	if ("excludeFromContext" in message && message.excludeFromContext === true) return 0;
	const legacy = isRecord(message) ? message : {};
	let tokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS;
	if (message.role === "toolResult" || legacy.role === "tool" || legacy.type === "toolResult") {
		const content = message.role === "toolResult" ? message.content : legacy.content;
		const toolName = message.role === "toolResult" ? message.toolName : legacy.toolName;
		tokens += estimateContentTokenPressure(content, "tool-result");
		tokens += estimateIdentifierTokenPressure(toolName ?? legacy.tool_name);
		return tokens;
	}
	if (message.role === "bashExecution") {
		tokens += estimateStringTokenPressure(bashExecutionToText(message));
		return tokens;
	}
	if (message.role === "branchSummary" || message.role === "compactionSummary") {
		const [prefix, suffix] = message.role === "branchSummary" ? [BRANCH_SUMMARY_PREFIX, BRANCH_SUMMARY_SUFFIX] : [COMPACTION_SUMMARY_PREFIX, COMPACTION_SUMMARY_SUFFIX];
		return tokens + estimateStringTokenPressure(prefix + message.summary + suffix);
	}
	if (message.role === "assistant") {
		if (Array.isArray(message.content)) for (const block of message.content) {
			if (isRecord(block)) {
				const blockType = block.type;
				if (blockType === "toolCall" || blockType === "tool_use") {
					tokens += estimateAssistantToolCallTokenPressure(block);
					continue;
				}
			}
			tokens += estimateContentBlockTokenPressure(block);
		}
		else tokens += estimateContentTokenPressure(message.content);
		const toolCalls = legacy.toolCalls ?? legacy.tool_calls;
		if (Array.isArray(toolCalls)) for (const toolCall of toolCalls) tokens += isRecord(toolCall) ? estimateAssistantToolCallTokenPressure(toolCall) : estimateJsonPayloadTokenPressure(toolCall);
		return tokens;
	}
	tokens += estimateContentTokenPressure(legacy.content);
	return tokens;
}
/**
* Estimates the prompt pressure at the LLM boundary from transcript messages,
* optional system prompt, and current prompt text. The result intentionally
* includes a safety margin because this path runs before provider tokenization.
*/
function estimateRenderedPromptTokens(params) {
	return (typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0 ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt) : 0) + MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
}
/** Prepare fixed request costs before estimating its pending input or replacement history. */
function createFreshLlmBoundaryTokenEstimator(params) {
	const toolTokens = estimateToolSchemaTokens(params.tools);
	const fixedPromptTokens = estimateRenderedPromptTokens({
		systemPrompt: params.systemPrompt,
		prompt: ""
	});
	return (request) => Math.ceil((fixedPromptTokens + estimateStringTokenPressure(request.prompt) + toolTokens + (request.imageCount ?? 0) * IMAGE_BLOCK_TOKENS + request.messages.reduce((total, message) => total + estimateMessageTokenPressure(message), 0)) * SAFETY_MARGIN);
}
//#endregion
//#region src/agents/agent-hooks/compaction-instructions.ts
/**
* Compaction instruction utilities.
*
* Provides default language-preservation instructions and a precedence-based
* resolver for customInstructions used during context compaction summaries.
*/
/**
* Default instructions injected into every safeguard-mode compaction summary.
* Preserves conversation language and persona while keeping the SDK's required
* summary structure intact.
*/
const DEFAULT_COMPACTION_INSTRUCTIONS = "Write the summary body in the primary language used in the conversation.\nFocus on factual content: what was discussed, decisions made, and current state.\nKeep the required summary structure and section headers unchanged.\nDo not translate or alter code, file paths, identifiers, or error messages.";
/**
* Upper bound on custom instruction length to prevent prompt bloat.
* ~800 chars ≈ ~200 tokens — keeps summarization quality stable.
*/
const MAX_INSTRUCTION_LENGTH = 800;
/**
* Resolve compaction instructions with precedence:
*   event (SDK) → runtime (config) → DEFAULT constant.
*
* Each input is normalized first (trim + empty→undefined) so that blank
* strings don't short-circuit the fallback chain.
*/
function resolveCompactionInstructions(eventInstructions, runtimeInstructions) {
	const resolved = normalizeOptionalString(eventInstructions) ?? normalizeOptionalString(runtimeInstructions) ?? DEFAULT_COMPACTION_INSTRUCTIONS;
	return truncateCodePoints(resolved, MAX_INSTRUCTION_LENGTH);
}
//#endregion
//#region src/agents/compaction-usage.ts
function parseCompactionUsageTimestamp(value) {
	return parseDateFirstTimestampMs(value) ?? null;
}
function stripStaleAssistantUsageBeforeLatestCompaction(messages, options = {}) {
	const latestCompactionSummaryIndex = messages.findLastIndex((entry) => entry?.role === "compactionSummary");
	const hasCompactionSummary = latestCompactionSummaryIndex !== -1;
	if (!hasCompactionSummary && options.whenMissingCompactionSummary !== "zeroAssistantUsage") return messages;
	const latestCompactionTimestamp = parseCompactionUsageTimestamp(messages[latestCompactionSummaryIndex]?.timestamp);
	let out = messages;
	for (let i = 0; i < messages.length; i += 1) {
		const candidate = messages[i];
		if (candidate?.role !== "assistant" || !candidate.usage || typeof candidate.usage !== "object") continue;
		const messageTimestamp = parseCompactionUsageTimestamp(candidate.timestamp);
		if (!(!hasCompactionSummary || (latestCompactionTimestamp !== null && messageTimestamp !== null ? messageTimestamp <= latestCompactionTimestamp : i < latestCompactionSummaryIndex))) continue;
		if (out === messages && !options.mutate) out = [...messages];
		out[i] = {
			...candidate,
			usage: makeZeroUsageSnapshot()
		};
	}
	return out;
}
//#endregion
//#region src/agents/compaction-replay.ts
/** Keep every transcript rebuild safe for the next provider request. */
function sanitizeCompactionReplayMessages(messages) {
	return stripStaleThinkingSignaturesForCompactionReplay(stripStaleAssistantUsageBeforeLatestCompaction(messages));
}
//#endregion
//#region src/sessions/user-turn-transcript-runtime-context.ts
const RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT = Symbol.for("testclaw.runtimeUserTurnTranscriptContext");
const RUNTIME_USER_TURN_TRANSCRIPT_RECORDER = Symbol.for("testclaw.runtimeUserTurnTranscriptRecorder");
/** Carries transcript-only fields with a queued runtime message without exposing them to the model. */
function attachRuntimeUserTurnTranscriptContext(runtimeMessage, context) {
	Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT, {
		configurable: true,
		value: context
	});
	return runtimeMessage;
}
/** Consumes the transient queued-turn context before the message is serialized. */
function takeRuntimeUserTurnTranscriptContext(runtimeMessage) {
	const context = Reflect.get(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT);
	if (context) Reflect.deleteProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_CONTEXT);
	return context;
}
/** Keeps the queued recorder attached to the exact final message until persistence succeeds. */
function attachRuntimeUserTurnTranscriptRecorder(runtimeMessage, recorder) {
	Object.defineProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER, {
		configurable: true,
		value: recorder
	});
	return runtimeMessage;
}
function readRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
	return Reflect.get(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER);
}
/** A steered message retains its own live custody while another turn owns the runtime. */
function withRuntimeUserTurnTranscriptRecorder(runtimeMessage, append) {
	const recorder = readRuntimeUserTurnTranscriptRecorder(runtimeMessage);
	const assertCommit = recorder?.assertOriginalInputCommit;
	const beforeFreshMessageCommit = assertCommit ? createMessageInjectionAuthority(() => {
		assertCommit();
		return true;
	}) : void 0;
	const persist = () => append(beforeFreshMessageCommit);
	return recorder?.withPendingInput ? recorder.withPendingInput(persist) : persist();
}
function takeRuntimeUserTurnTranscriptRecorder(runtimeMessage) {
	const recorder = readRuntimeUserTurnTranscriptRecorder(runtimeMessage);
	if (recorder) Reflect.deleteProperty(runtimeMessage, RUNTIME_USER_TURN_TRANSCRIPT_RECORDER);
	return recorder;
}
//#endregion
//#region src/agents/utils/frontmatter.ts
/**
* YAML frontmatter parsing helpers.
*
* Agent docs/tools use this to split optional Markdown frontmatter from the
* body while preserving normal content when no complete frontmatter fence exists.
*/
const normalizeNewlines = (value) => value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
/** Parses optional YAML frontmatter from Markdown-like content. */
const parsePromptFrontmatter = (content) => {
	const normalized = normalizeNewlines(content);
	const extracted = extractFrontmatterBlock(normalized);
	if (!extracted) return {
		frontmatter: {},
		body: normalized
	};
	return {
		frontmatter: parse$1(extracted.block) ?? {},
		body: extracted.body.trim()
	};
};
/** Removes YAML frontmatter from content when a complete frontmatter block exists. */
const stripFrontmatter = (content) => parsePromptFrontmatter(content).body;
//#endregion
//#region src/agents/sessions/agent-session-transcript.ts
/** Persist completed model messages through their existing custody owner. */
async function persistAgentSessionMessage(manager, message, options) {
	applyAssistantDeliveryDirectives(message);
	const appendOptions = { invalidateSerializedPrefixCache: options.invalidateSerializedPrefixCache };
	prepareCodeModeSourceAppend(appendOptions, message, options.sourceAppend);
	return message.role === "user" ? await withSessionManagerWrite(manager, () => manager.appendMessage(message, appendOptions)) : await manager.appendMessageAsync(message, appendOptions);
}
//#endregion
//#region src/agents/sessions/agent-session-utils.ts
function unwrapCoreResult(result) {
	if (result.ok) return result.value;
	throw result.error;
}
function normalizeBranchSummaryResult(result) {
	if (result.ok) return result.value;
	if (result.error.code === "aborted") return {
		aborted: true,
		error: result.error.message
	};
	return { error: result.error.message };
}
function hasPersistedAssistantContent(content) {
	return (typeof content === "string" || Array.isArray(content)) && content.length > 0;
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	let text = "";
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const candidate = block;
		if (candidate.type === "text" && typeof candidate.text === "string") text += candidate.text;
	}
	return text;
}
function replaceAgentMessageInPlace(target, replacement) {
	if (target === replacement) return;
	for (const key of Object.keys(target)) Reflect.deleteProperty(target, key);
	Object.assign(target, replacement);
}
function estimateMessagesFromContent(messages) {
	return messages.reduce((total, message) => total + estimateTokens(message), 0);
}
//#endregion
//#region src/agents/sessions/auth-guidance.ts
/**
* Shared user-facing auth guidance for session/model selection failures.
*
* Uses docs paths instead of provider-specific instructions so guidance stays correct across OAuth/API-key providers.
*/
const UNKNOWN_PROVIDER = "unknown";
/** Returns the standard provider login help block. */
function getProviderLoginHelp() {
	return [
		"Use /login to log into a provider via OAuth or API key. See:",
		`  ${join(getDocsPath(), "providers.md")}`,
		`  ${join(getDocsPath(), "models.md")}`
	].join("\n");
}
/** Formats the message shown when no configured model can be used. */
function formatNoModelsAvailableMessage() {
	return `No models available. ${getProviderLoginHelp()}`;
}
/** Formats the message shown before a model is selected. */
function formatNoModelSelectedMessage() {
	return `No model selected.\n\n${getProviderLoginHelp()}\n\nThen use /model to select a model.`;
}
/** Formats the missing API key guidance for a provider or unknown selected model. */
function formatNoApiKeyFoundMessage(provider) {
	return `No API key found for ${provider === UNKNOWN_PROVIDER ? "the selected model" : provider}.\n\n${getProviderLoginHelp()}`;
}
//#endregion
//#region src/agents/sessions/event-bus.ts
/**
* Tiny event bus abstraction for session UI/runtime notifications.
*
* Isolates handler failures so one bad subscriber cannot break later listeners.
*/
/** Creates an in-process event bus with unsubscribe and clear support. */
function createEventBus() {
	const emitter = new EventEmitter();
	return {
		emit: (channel, data) => {
			emitter.emit(channel, data);
		},
		on: (channel, handler) => {
			const safeHandler = (data) => {
				try {
					handler(data);
				} catch (err) {
					console.error(`Event handler error (${channel}):`, err);
				}
			};
			emitter.on(channel, safeHandler);
			return () => emitter.off(channel, safeHandler);
		},
		clear: () => {
			emitter.removeAllListeners();
		}
	};
}
//#endregion
//#region src/agents/sessions/exec.ts
/**
* Shared command execution utilities for extensions and custom tools.
*/
const DEFAULT_OUTPUT_LIMIT_CHARS = 16777216;
const FORCE_KILL_GRACE_MS = 5e3;
function decodeCapturedOutput(decoder, chunk) {
	return Buffer.isBuffer(chunk) ? decoder.decode(chunk) : `${decoder.flush()}${chunk}`;
}
function clampMaxOutputChars(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_OUTPUT_LIMIT_CHARS;
	return Math.max(1, Math.floor(value));
}
function appendCapturedOutput(current, chunk, maxOutputChars, truncateTail) {
	const text = String(chunk);
	const combined = `${current.text}${text}`;
	const overflowChars = Math.max(0, combined.length - maxOutputChars);
	if (overflowChars === 0) return {
		text: combined,
		truncatedChars: current.truncatedChars
	};
	const nextText = truncateTail ? sliceUtf16Safe(combined, overflowChars) : sliceUtf16Safe(combined, 0, maxOutputChars);
	return {
		text: nextText,
		truncatedChars: current.truncatedChars + combined.length - nextText.length
	};
}
/**
* Execute a shell command and return stdout/stderr/code.
* Supports timeout and abort signal.
*/
async function execCommand(command, args, cwd, options) {
	const cancelController = new AbortController();
	const startupCanceled = createDeferredCore();
	let waitingForSpawn = true;
	let acceptingOutput = true;
	let killed = false;
	let terminationStarted = false;
	let timeoutId;
	let terminationController;
	const killProcess = () => {
		killed = true;
		if (terminationController) {
			if (!terminationStarted) {
				terminationStarted = true;
				if (!terminationController.terminate()) cancelController.abort();
			}
		} else cancelController.abort();
		if (waitingForSpawn) startupCanceled.resolve({
			stdout: "",
			stderr: "",
			code: 1,
			killed: true
		});
	};
	try {
		const proc = spawnCommand([command, ...args], {
			buffer: false,
			cancelSignal: cancelController.signal,
			cwd,
			detached: process.platform !== "win32",
			forceKillAfterDelay: FORCE_KILL_GRACE_MS,
			reject: false,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		options?.signal?.addEventListener("abort", killProcess, { once: true });
		if (options?.timeout && options.timeout > 0) timeoutId = setTimeout(killProcess, options.timeout);
		const completion = (async () => {
			if (proc.pid === void 0) await waitForCommandSpawn(proc);
			waitingForSpawn = false;
			return new Promise((resolve) => {
				const releaseOutput = releaseChildProcessOutputAfterExit(proc.nodeChildProcess);
				let childExited = false;
				proc.nodeChildProcess.once("exit", () => {
					childExited = true;
				});
				let commandSettled = false;
				const termination = createCommandTerminationController({
					child: proc.nodeChildProcess,
					cancelController,
					processTree: { mode: "graceful" },
					killGraceMs: FORCE_KILL_GRACE_MS,
					isChildExited: () => childExited,
					isCommandSettled: () => commandSettled
				});
				terminationController = termination;
				let stdout = {
					text: "",
					truncatedChars: 0
				};
				let stderr = {
					text: "",
					truncatedChars: 0
				};
				const stdoutDecoder = createWindowsOutputDecoder({ preserveUtf8Bom: true });
				const stderrDecoder = createWindowsOutputDecoder({ preserveUtf8Bom: true });
				let settled = false;
				const maxOutputChars = clampMaxOutputChars(options?.maxOutputChars);
				const truncateOutput = options?.maxOutputChars !== void 0;
				let outputLimitExceeded;
				const markOutputLimitExceeded = (stream) => {
					if (!truncateOutput && !outputLimitExceeded) {
						outputLimitExceeded = stream;
						killProcess();
					}
				};
				const finish = async (code) => {
					if (settled) return;
					settled = true;
					commandSettled = true;
					if (timeoutId) clearTimeout(timeoutId);
					if (options?.signal) options.signal.removeEventListener("abort", killProcess);
					await termination.settle();
					const stdoutBeforeFlush = stdout.truncatedChars;
					stdout = appendCapturedOutput(stdout, stdoutDecoder.flush(), maxOutputChars, truncateOutput);
					if (!truncateOutput && stdout.truncatedChars > stdoutBeforeFlush && !outputLimitExceeded) outputLimitExceeded = "stdout";
					const stderrBeforeFlush = stderr.truncatedChars;
					stderr = appendCapturedOutput(stderr, stderrDecoder.flush(), maxOutputChars, truncateOutput);
					if (!truncateOutput && stderr.truncatedChars > stderrBeforeFlush && !outputLimitExceeded) outputLimitExceeded = "stderr";
					if (outputLimitExceeded) stderr = appendCapturedOutput(stderr, `${stderr.text ? "\n" : ""}exec ${outputLimitExceeded} exceeded output limit ${maxOutputChars} chars`, maxOutputChars, true);
					resolve({
						stdout: stdout.text,
						stderr: stderr.text,
						stdoutTruncatedChars: stdout.truncatedChars || void 0,
						stderrTruncatedChars: stderr.truncatedChars || void 0,
						outputLimitExceeded,
						code: outputLimitExceeded ? 1 : code,
						killed
					});
				};
				const ignoreOutputStreamError = () => {};
				proc.stdout?.on("error", ignoreOutputStreamError);
				proc.stderr?.on("error", ignoreOutputStreamError);
				proc.stdout?.on("data", (data) => {
					if (!acceptingOutput) return;
					const before = stdout.truncatedChars;
					stdout = appendCapturedOutput(stdout, decodeCapturedOutput(stdoutDecoder, data), maxOutputChars, truncateOutput);
					if (stdout.truncatedChars > before) markOutputLimitExceeded("stdout");
				});
				proc.stderr?.on("data", (data) => {
					if (!acceptingOutput) return;
					const before = stderr.truncatedChars;
					stderr = appendCapturedOutput(stderr, decodeCapturedOutput(stderrDecoder, data), maxOutputChars, truncateOutput);
					if (stderr.truncatedChars > before) markOutputLimitExceeded("stderr");
				});
				if (killed) killProcess();
				proc.then((result) => finish(result.exitCode ?? (result.failed ? 1 : 0))).catch(() => finish(1)).finally(releaseOutput);
			});
		})();
		if (options?.signal?.aborted) killProcess();
		return await Promise.race([completion, startupCanceled.promise]);
	} finally {
		acceptingOutput = false;
		clearTimeout(timeoutId);
		options?.signal?.removeEventListener("abort", killProcess);
	}
}
//#endregion
//#region src/agents/sessions/bash-executor.ts
/**
* Bash command execution with streaming support and cancellation.
*/
/**
* Execute a bash command using custom BashOperations.
* Used for remote execution (SSH, containers, etc.).
*/
async function executeBashWithOperations(command, cwd, operations, options) {
	const output = new OutputAccumulator({
		tempFilePrefix: "testclaw-bash",
		createTextTransform: () => {
			const sanitizeOutput = createStreamingBinaryOutputSanitizer();
			return (text) => sanitizeOutput(text).replace(/\r/g, "");
		}
	});
	const onData = (data, stream) => {
		const text = output.append(data, stream);
		options?.onChunk?.(text);
	};
	const finalizeOutput = async () => {
		const finalText = output.finish();
		const snapshot = output.snapshot({ persistIfTruncated: true });
		try {
			if (finalText) options?.onChunk?.(finalText);
			return snapshot;
		} finally {
			await output.closeTempFile();
		}
	};
	const buildResult = async (exitCode, cancelled) => {
		const snapshot = await finalizeOutput();
		return {
			output: snapshot.content,
			exitCode: cancelled ? void 0 : exitCode,
			cancelled,
			truncated: snapshot.truncation.truncated,
			fullOutputPath: snapshot.fullOutputPath
		};
	};
	let result;
	try {
		result = await operations.exec(command, cwd, {
			onData,
			signal: options?.signal
		});
	} catch (err) {
		if (options?.signal?.aborted) return await buildResult(void 0, true);
		await finalizeOutput();
		throw err;
	}
	const cancelled = options?.signal?.aborted ?? false;
	return await buildResult(result.exitCode ?? void 0, cancelled);
}
//#endregion
//#region src/agents/sessions/compaction/runtime.ts
/** Adds a private usage sink without changing public summary result shapes. */
function createCompactionRuntime(usageSink) {
	return usageSink ? {
		...testClawAgentCoreRuntime,
		internalUsageSink: usageSink
	} : testClawAgentCoreRuntime;
}
//#endregion
//#region src/agents/sessions/compaction/branch-summarization.ts
/** Collects entries that differ between two session branches for summarization. */
function collectEntriesForBranchSummary(session, oldLeafId, targetId) {
	if (!oldLeafId) return {
		entries: [],
		commonAncestorId: null
	};
	return collectEntriesForBranchSummaryFromBranches(session.getBranch(oldLeafId), session.getBranch(targetId));
}
/** Generates a human-readable branch summary through the shared agent-core runtime. */
async function generateBranchSummary(entries, options) {
	const { usageSink, ...summaryOptions } = options;
	const result = await generateBranchSummary$1(entries, {
		runtime: createCompactionRuntime(usageSink),
		...summaryOptions
	});
	if (result.ok) return result.value;
	if (result.error.code === "aborted") return {
		aborted: true,
		error: result.error.message
	};
	return { error: result.error.message };
}
//#endregion
//#region src/agents/sessions/compaction/compaction.ts
/** Converts agent-core Result values back to the legacy session compaction API shape. */
function unwrapCompactionResult(result) {
	if (result.ok) return result.value;
	throw result.error;
}
/** Prepares session entries for compaction using the shared agent-core planner. */
function prepareCompaction(pathEntries, settings) {
	return unwrapCompactionResult(prepareCompaction$1(pathEntries, settings));
}
/** Generates a compaction summary through the shared agent-core runtime. */
async function generateSummary(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, usageSink, summaryPrompt) {
	return unwrapCompactionResult(await generateSummary$1(currentMessages, model, reserveTokens, apiKey, headers, signal, customInstructions, previousSummary, thinkingLevel, streamFn, createCompactionRuntime(usageSink), summaryPrompt));
}
/** Runs full compaction through agent-core and returns the compacted conversation result. */
async function compact(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, usageSink) {
	return unwrapCompactionResult(await compact$1(preparation, model, apiKey, headers, customInstructions, signal, thinkingLevel, streamFn, createCompactionRuntime(usageSink)));
}
//#endregion
//#region src/agents/sessions/defaults.ts
/** Default thinking level for sessions that do not specify a model-specific override. */
const DEFAULT_THINKING_LEVEL = "medium";
//#endregion
//#region src/agents/sessions/model-resolver.ts
/**
* Model resolution, scoping, and initial selection
*/
function isValidThinkingLevel(level) {
	return MODEL_CATALOG_THINKING_LEVELS.some((candidate) => candidate === level);
}
function splitModelPatternSuffix(pattern) {
	const index = pattern.lastIndexOf(":");
	return index === -1 ? void 0 : [pattern.slice(0, index), pattern.slice(index + 1)];
}
/**
* Helper to check if a model ID looks like an alias (no date suffix)
* Dates are typically in format: -20241022 or -20250929
*/
function isAlias$1(id) {
	return !/-\d{8}$/.test(id);
}
function scopeModelsToProvider(provider, availableModels) {
	const exact = availableModels.filter((model) => model.provider === provider);
	return exact.length ? exact : availableModels.filter((model) => model.provider.toLowerCase() === provider.toLowerCase());
}
function collectQualifiedModelScopes(modelReference, availableModels) {
	const canonicalScopes = [];
	const qualifiedScopes = [];
	for (let slashIndex = modelReference.indexOf("/"); slashIndex !== -1; slashIndex = modelReference.indexOf("/", slashIndex + 1)) {
		const provider = modelReference.slice(0, slashIndex);
		const modelId = modelReference.slice(slashIndex + 1);
		const models = scopeModelsToProvider(provider, availableModels);
		if (models.length) canonicalScopes.push([modelId, models]);
		const trimmedModels = provider === provider.trim() ? models : scopeModelsToProvider(provider.trim(), availableModels);
		if (trimmedModels.length) qualifiedScopes.push([modelId.trim(), trimmedModels]);
	}
	return [canonicalScopes, qualifiedScopes];
}
function collectModelReferenceMatches(modelReference, availableModels, qualifiedOnly = false) {
	const trimmedReference = modelReference.trim();
	if (!trimmedReference) return [];
	const groups = collectQualifiedModelScopes(trimmedReference, availableModels);
	if (!qualifiedOnly) groups.push([[trimmedReference, availableModels]]);
	for (const scopes of groups) {
		const matchedScopes = scopes.map(([id, models]) => [id, models.filter((model) => model.id.toLowerCase() === id.toLowerCase())]).filter(([, models]) => models.length);
		const folded = matchedScopes.flatMap(([, models]) => models);
		const canonical = folded.filter((model) => `${model.provider}/${model.id}` === trimmedReference);
		const matches = canonical.length ? canonical : matchedScopes.length > 1 ? folded : matchedScopes.flatMap(([id, models]) => {
			const exact = models.filter((model) => model.id === id);
			return exact.length ? exact : models;
		});
		if (matches.length > 0) return matches.filter((model, index) => matches.findIndex((candidate) => modelsAreEqual(candidate, model)) === index);
	}
	return [];
}
function ambiguousModelReference(pattern) {
	return `Model "${pattern}" is ambiguous. Use exact provider and model IDs, specifying the provider separately if needed.`;
}
function collectModelPatternMatches(pattern, availableModels, deferRawIds = false) {
	const parts = splitModelPatternSuffix(pattern);
	const suffix = parts && isValidThinkingLevel(parts[1]) ? parts : void 0;
	const matches = collectModelReferenceMatches(pattern, availableModels, deferRawIds && !suffix);
	return matches.length || !suffix ? matches : collectModelPatternMatches(suffix[0], availableModels, deferRawIds);
}
/**
* Match a bare id or provider/model reference, preferring exact model-id casing.
* Case-insensitive matches remain available only when unambiguous.
*/
function findExactModelReferenceMatch(modelReference, availableModels) {
	const matches = collectModelReferenceMatches(modelReference, availableModels);
	return matches.length === 1 ? matches[0] : void 0;
}
function matchPartialModelPattern(modelPattern, availableModels) {
	const normalizedPattern = modelPattern.toLowerCase();
	const matched = availableModels.filter((model) => model.id.toLowerCase().includes(normalizedPattern) || model.name?.toLowerCase().includes(normalizedPattern)).toSorted((a, b) => Number(isAlias$1(b.id)) - Number(isAlias$1(a.id)) || b.id.localeCompare(a.id, void 0, { numeric: true }))[0];
	return matched && availableModels.find((model) => modelsAreEqual(model, matched));
}
function buildFallbackModel(provider, modelId, availableModels) {
	const baseModel = availableModels.find((model) => model.provider === provider);
	return baseModel ? {
		...baseModel,
		id: modelId,
		name: modelId
	} : void 0;
}
function selectAvailableFallbackModel(availableModels) {
	return availableModels.find((model) => model.provider === "openai" && model.id === "gpt-6-astra") ?? availableModels[0];
}
/**
* Parse a pattern to extract model and thinking level.
* Handles models with colons in their IDs (e.g., OpenRouter's :exacto suffix).
*
* Algorithm:
* 1. Try to match full pattern as a model
* 2. If found, leave the thinking level unspecified
* 3. If not found and has colons, split on last colon:
*    - If suffix is valid thinking level, use it and recurse on prefix
*    - If suffix is invalid, warn and leave the thinking level unspecified
*
* @internal Shared with the session extension SDK
*/
function parseModelPattern(pattern, availableModels, options) {
	const exactMatches = collectModelReferenceMatches(pattern, availableModels);
	if (exactMatches.length > 1) return {
		model: void 0,
		thinkingLevel: void 0,
		warning: ambiguousModelReference(pattern)
	};
	const model = exactMatches[0] ?? matchPartialModelPattern(pattern, availableModels);
	if (model) return {
		model,
		thinkingLevel: void 0,
		warning: void 0
	};
	const parts = splitModelPatternSuffix(pattern);
	if (!parts) return {
		model: void 0,
		thinkingLevel: void 0,
		warning: void 0
	};
	const [prefix, suffix] = parts;
	if (isValidThinkingLevel(suffix)) {
		const result = parseModelPattern(prefix, availableModels, options);
		if (result.model) return {
			model: result.model,
			thinkingLevel: result.warning ? void 0 : suffix,
			warning: result.warning
		};
		return result;
	}
	if (!(options?.allowInvalidThinkingLevelFallback ?? true)) return {
		model: void 0,
		thinkingLevel: void 0,
		warning: void 0
	};
	const result = parseModelPattern(prefix, availableModels, options);
	if (result.model) return {
		model: result.model,
		thinkingLevel: void 0,
		warning: `Invalid thinking level "${suffix}" in pattern "${pattern}". Using default instead.`
	};
	return result;
}
/**
* Resolve model patterns to actual Model objects with optional thinking levels
* Format: "pattern:level" where :level is optional
* For each pattern, finds all matching models and picks the best version:
* 1. Prefer alias (e.g., claude-sonnet-4-5) over dated versions (claude-sonnet-4-5-20250929)
* 2. If no alias, pick the latest dated version
*
* Supports models with colons in their IDs (e.g., OpenRouter's model:exacto).
* The algorithm tries to match the full pattern first, then progressively
* strips colon-suffixes to find a match.
*/
async function resolveModelScope(patterns, modelRegistry) {
	const availableModels = modelRegistry.getAvailable();
	const scopedModels = [];
	for (const pattern of patterns) {
		if (pattern.includes("*") || pattern.includes("?") || pattern.includes("[")) {
			const suffix = splitModelPatternSuffix(pattern);
			let globPattern = pattern;
			let thinkingLevel;
			if (suffix && isValidThinkingLevel(suffix[1])) {
				thinkingLevel = suffix[1];
				globPattern = suffix[0];
			}
			const matchingModels = availableModels.filter((m) => {
				const fullId = `${m.provider}/${m.id}`;
				return minimatch(fullId, globPattern, { nocase: true }) || minimatch(m.id, globPattern, { nocase: true });
			});
			if (matchingModels.length === 0) {
				console.warn(chalk.yellow(`Warning: No models match pattern "${pattern}"`));
				continue;
			}
			for (const model of matchingModels) if (!scopedModels.some((sm) => modelsAreEqual(sm.model, model))) scopedModels.push({
				model,
				thinkingLevel
			});
			continue;
		}
		const { model, thinkingLevel, warning } = parseModelPattern(pattern, availableModels);
		if (warning) console.warn(chalk.yellow(`Warning: ${warning}`));
		if (!model) {
			console.warn(chalk.yellow(`Warning: No models match pattern "${pattern}"`));
			continue;
		}
		if (!scopedModels.some((sm) => modelsAreEqual(sm.model, model))) scopedModels.push({
			model,
			thinkingLevel
		});
	}
	return scopedModels;
}
/**
* Resolve a single model from CLI flags.
*
* Supports:
* - --provider <provider> --model <pattern>
* - --model <provider>/<pattern>
* - Fuzzy matching (same rules as model scoping: exact id, then partial id/name)
*
* Note: This does not apply the thinking level by itself, but it may *parse* and
* return a thinking level from "<pattern>:<thinking>" so the caller can apply it.
*/
function resolveCliModel(options) {
	const { cliProvider, cliModel, cliThinking, modelRegistry } = options;
	if (!cliModel) return {
		model: void 0,
		warning: void 0,
		error: void 0
	};
	const availableModels = modelRegistry.getAll();
	if (availableModels.length === 0) return {
		model: void 0,
		warning: void 0,
		error: "No models available. Check your installation or add models to models.json."
	};
	let scopeGroups;
	if (cliProvider) {
		const models = scopeModelsToProvider(cliProvider, availableModels);
		if (!models.length) return {
			model: void 0,
			warning: void 0,
			error: `Unknown provider "${cliProvider}". Use --list-models to see available providers/models.`
		};
		const prefix = `${cliProvider}/`;
		scopeGroups = [[[cliModel.toLowerCase().startsWith(prefix.toLowerCase()) ? cliModel.slice(prefix.length) : cliModel, models]]];
	} else scopeGroups = collectQualifiedModelScopes(cliModel.trim(), availableModels);
	const parse = (pattern, models) => parseModelPattern(pattern, models, { allowInvalidThinkingLevelFallback: false });
	const canonicalMatches = cliProvider ? [] : collectModelPatternMatches(cliModel, availableModels, true);
	let parsed = canonicalMatches.length ? parse(cliModel, canonicalMatches) : void 0;
	for (const scopes of scopeGroups) {
		if (parsed) break;
		const matches = scopes.map(([scopePattern, models]) => {
			const candidates = models.some((entry) => entry.provider !== models[0]?.provider) ? collectModelPatternMatches(scopePattern, models) : models;
			return parse(scopePattern, candidates);
		}).filter((result) => result.model || result.warning);
		parsed = matches.find((result) => result.warning) ?? (matches.length > 1 ? {
			model: void 0,
			warning: ambiguousModelReference(cliModel)
		} : matches[0]);
	}
	parsed ??= cliProvider ? void 0 : parse(cliModel, availableModels);
	if (parsed?.model || parsed?.warning) return {
		model: parsed.model,
		thinkingLevel: parsed.thinkingLevel,
		warning: parsed.model ? parsed.warning : void 0,
		error: parsed.model ? void 0 : parsed.warning
	};
	const fallbackScopes = scopeGroups.find((scopes) => scopes.length) ?? [];
	const providers = new Set(fallbackScopes.flatMap(([, models]) => models.map((entry) => entry.provider)));
	if (providers.size > 1) return {
		model: void 0,
		warning: void 0,
		error: ambiguousModelReference(cliModel)
	};
	const [provider] = providers;
	const pattern = fallbackScopes[0]?.[0] ?? cliModel;
	if (provider) {
		let fallbackPattern = pattern;
		let fallbackThinking;
		const suffix = splitModelPatternSuffix(pattern);
		if (!cliThinking && suffix && isValidThinkingLevel(suffix[1])) {
			fallbackPattern = suffix[0];
			fallbackThinking = suffix[1];
		}
		const fallbackModel = buildFallbackModel(provider, fallbackPattern, availableModels);
		if (fallbackModel) {
			const requestedThinking = cliThinking ?? fallbackThinking;
			return {
				model: requestedThinking && requestedThinking !== "off" ? {
					...fallbackModel,
					reasoning: true
				} : fallbackModel,
				thinkingLevel: requestedThinking,
				warning: `Model "${fallbackPattern}" not found for provider "${provider}". Using custom model id.`,
				error: void 0
			};
		}
	}
	return {
		model: void 0,
		thinkingLevel: void 0,
		warning: void 0,
		error: `Model "${provider ? `${provider}/${pattern}` : cliModel}" not found. Use --list-models to see available models.`
	};
}
/**
* Find the initial model to use based on priority:
* 1. CLI args (provider + model)
* 2. First model from scoped models (if not continuing/resuming)
* 3. Restored from session (if continuing/resuming)
* 4. Saved default from settings
* 5. First available model with valid API key
*/
async function findInitialModel(options) {
	const { cliProvider, cliModel, scopedModels, isContinuing, defaultProvider, defaultModelId, defaultThinkingLevel, modelRegistry } = options;
	let model;
	let thinkingLevel = DEFAULT_THINKING_LEVEL;
	if (cliProvider && cliModel) {
		const resolved = resolveCliModel({
			cliProvider,
			cliModel,
			modelRegistry
		});
		if (resolved.error) {
			console.error(chalk.red(resolved.error));
			process.exit(1);
		}
		if (resolved.model) return {
			model: resolved.model,
			thinkingLevel: resolved.thinkingLevel ?? "medium",
			fallbackMessage: void 0
		};
	}
	if (scopedModels.length > 0 && !isContinuing) {
		const scopedModel = scopedModels.at(0);
		if (!scopedModel) throw new Error("Scoped model list became empty during selection");
		return {
			model: scopedModel.model,
			thinkingLevel: scopedModel.thinkingLevel ?? defaultThinkingLevel ?? "medium",
			fallbackMessage: void 0
		};
	}
	if (defaultProvider && defaultModelId) {
		const found = modelRegistry.find(defaultProvider, defaultModelId);
		if (found && modelRegistry.hasConfiguredAuth(found)) {
			model = found;
			if (defaultThinkingLevel) thinkingLevel = defaultThinkingLevel;
			return {
				model,
				thinkingLevel,
				fallbackMessage: void 0
			};
		}
	}
	const availableModels = modelRegistry.getAvailable();
	if (availableModels.length > 0) return {
		model: selectAvailableFallbackModel(availableModels),
		thinkingLevel: DEFAULT_THINKING_LEVEL,
		fallbackMessage: void 0
	};
	return {
		model: void 0,
		thinkingLevel: DEFAULT_THINKING_LEVEL,
		fallbackMessage: void 0
	};
}
/**
* Restore model from session, with fallback to available models
*/
async function restoreModelFromSession(savedProvider, savedModelId, currentModel, shouldPrintMessages, modelRegistry) {
	const restoredModel = modelRegistry.find(savedProvider, savedModelId);
	const hasConfiguredAuth = restoredModel ? modelRegistry.hasConfiguredAuth(restoredModel) : false;
	if (restoredModel && hasConfiguredAuth) {
		if (shouldPrintMessages) console.log(chalk.dim(`Restored model: ${savedProvider}/${savedModelId}`));
		return {
			model: restoredModel,
			fallbackMessage: void 0
		};
	}
	const reason = !restoredModel ? "model no longer exists" : "no auth configured";
	if (shouldPrintMessages) console.error(chalk.yellow(`Warning: Could not restore model ${savedProvider}/${savedModelId} (${reason}).`));
	if (currentModel) {
		if (shouldPrintMessages) console.log(chalk.dim(`Falling back to: ${currentModel.provider}/${currentModel.id}`));
		return {
			model: currentModel,
			fallbackMessage: `Could not restore model ${savedProvider}/${savedModelId} (${reason}). Using ${currentModel.provider}/${currentModel.id}.`
		};
	}
	const availableModels = modelRegistry.getAvailable();
	if (availableModels.length > 0) {
		const fallbackModel = selectAvailableFallbackModel(availableModels);
		if (!fallbackModel) return {
			model: void 0,
			fallbackMessage: `Could not restore model ${savedProvider}/${savedModelId} (${reason}). No models available.`
		};
		if (shouldPrintMessages) console.log(chalk.dim(`Falling back to: ${fallbackModel.provider}/${fallbackModel.id}`));
		return {
			model: fallbackModel,
			fallbackMessage: `Could not restore model ${savedProvider}/${savedModelId} (${reason}). Using ${fallbackModel.provider}/${fallbackModel.id}.`
		};
	}
	return {
		model: void 0,
		fallbackMessage: void 0
	};
}
//#endregion
//#region src/agents/sessions/package-manager.ts
/**
* Session package/resource manager.
*
* Resolves extension, skill, prompt, and theme sources from npm, git, local paths, and project manifests.
*/
/**
* Compute a numeric precedence rank for a resource based on its metadata.
* Lower rank = higher precedence. Used to sort resolved resources so that
* name-collision resolution ("first wins") produces the correct outcome.
*
* Precedence (highest to lowest):
*   0  project + settings entry (source: "local", scope: "project")
*   1  project + auto-discovered (source: "auto", scope: "project")
*   2  user + settings entry (source: "local", scope: "user")
*   3  user + auto-discovered (source: "auto", scope: "user")
*   4  package resource (origin: "package")
*/
function resourcePrecedenceRank(m) {
	if (m.origin === "package") return 4;
	return (m.scope === "project" ? 0 : 2) + (m.source === "local" ? 0 : 1);
}
const RESOURCE_TYPES = [
	"extensions",
	"skills",
	"prompts",
	"themes"
];
const FILE_PATTERNS = {
	extensions: /\.(ts|js)$/,
	skills: /\.md$/,
	prompts: /\.md$/,
	themes: /\.json$/
};
function getHomeDir() {
	return process.env.HOME || homedir();
}
function getAgentResourceTempDir(agentDir) {
	const tempDir = join(agentDir, "tmp", "resources");
	mkdirSync(tempDir, {
		recursive: true,
		mode: 448
	});
	chmodSync(tempDir, 448);
	return tempDir;
}
function isPattern(s) {
	return s.startsWith("!") || s.startsWith("+") || s.startsWith("-") || s.includes("*") || s.includes("?");
}
function isOverridePattern(s) {
	return s.startsWith("!") || s.startsWith("+") || s.startsWith("-");
}
function hasGlobPattern(s) {
	return s.includes("*") || s.includes("?");
}
function splitPatterns(entries) {
	const plain = [];
	const patterns = [];
	for (const entry of entries) if (isPattern(entry)) patterns.push(entry);
	else plain.push(entry);
	return {
		plain,
		patterns
	};
}
function collectDirectoryEntries(dir, root, ignoreMatcher, options = {}) {
	if (!existsSync(dir)) return {
		entries: [],
		ignoreMatcher
	};
	const entries = [];
	const ig = addIgnoreRules(dir, root, ignoreMatcher);
	try {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (entry.name.startsWith(".") || !options.allowNodeModules && entry.name === "node_modules") continue;
			const fullPath = join(dir, entry.name);
			if (options.requireWithinRoot && !isRealPathWithinRoot(root, fullPath)) continue;
			let isDirectory = entry.isDirectory();
			let isFile = entry.isFile();
			if (entry.isSymbolicLink()) try {
				const stats = statSync(fullPath);
				isDirectory = stats.isDirectory();
				isFile = stats.isFile();
			} catch {
				continue;
			}
			const relativePath = normalizeNativePathSeparators(relative(root, fullPath));
			if (ig.ignores(isDirectory ? `${relativePath}/` : relativePath)) continue;
			entries.push({
				name: entry.name,
				fullPath,
				isDirectory,
				isFile
			});
		}
	} catch {}
	return {
		entries,
		ignoreMatcher: ig
	};
}
function collectFiles(dir, filePattern, skipNodeModules = true, ignoreMatcher, rootDir) {
	const files = [];
	const root = rootDir ?? dir;
	const directory = collectDirectoryEntries(dir, root, ignoreMatcher, { allowNodeModules: !skipNodeModules });
	for (const entry of directory.entries) if (entry.isDirectory) files.push(...collectFiles(entry.fullPath, filePattern, skipNodeModules, directory.ignoreMatcher, root));
	else if (entry.isFile && filePattern.test(entry.name)) files.push(entry.fullPath);
	return files;
}
function collectSkillEntries(dir, mode, ignoreMatcher, rootDir) {
	const entries = [];
	const root = rootDir ?? dir;
	const directory = collectDirectoryEntries(dir, root, ignoreMatcher, { requireWithinRoot: true });
	const skill = directory.entries.find((entry) => entry.name === "SKILL.md" && entry.isFile);
	if (skill) return [skill.fullPath];
	for (const entry of directory.entries) {
		if (mode === "testclaw" && dir === root && entry.isFile && entry.name.endsWith(".md")) {
			entries.push(entry.fullPath);
			continue;
		}
		if (!entry.isDirectory) continue;
		entries.push(...collectSkillEntries(entry.fullPath, mode, directory.ignoreMatcher, root));
	}
	return entries;
}
function collectAutoSkillEntries(dir, mode) {
	return collectSkillEntries(dir, mode);
}
function findGitRepoRoot(startDir) {
	let dir = resolve(startDir);
	while (true) {
		if (existsSync(join(dir, ".git"))) return dir;
		const parent = dirname(dir);
		if (parent === dir) return null;
		dir = parent;
	}
}
function collectAncestorAgentsSkillDirs(startDir) {
	const skillDirs = [];
	const resolvedStartDir = resolve(startDir);
	const gitRepoRoot = findGitRepoRoot(resolvedStartDir);
	let dir = resolvedStartDir;
	while (true) {
		skillDirs.push(join(dir, ".agents", "skills"));
		if (gitRepoRoot && dir === gitRepoRoot) break;
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return skillDirs;
}
function collectTopLevelAutoResourceEntries(dir, resourceType) {
	const entries = [];
	const directory = collectDirectoryEntries(dir, dir, void 0, { requireWithinRoot: true });
	for (const entry of directory.entries) if (entry.isFile && FILE_PATTERNS[resourceType].test(entry.name)) entries.push(entry.fullPath);
	return entries;
}
function readResourceManifestFile(packageJsonPath) {
	try {
		const content = readFileSync(packageJsonPath, "utf-8");
		return JSON.parse(content).testclaw ?? null;
	} catch {
		return null;
	}
}
function resolveExtensionEntries(dir, rootDir = dir) {
	const packageJsonPath = join(dir, "package.json");
	if (existsSync(packageJsonPath)) {
		const manifest = readResourceManifestFile(packageJsonPath);
		if (manifest?.extensions?.length) {
			const entries = [];
			for (const extPath of manifest.extensions) {
				const resolvedExtPath = resolve(dir, extPath);
				if (existsSync(resolvedExtPath) && isRealPathWithinRoot(rootDir, resolvedExtPath)) entries.push(resolvedExtPath);
			}
			if (entries.length > 0) return entries;
		}
	}
	const indexTs = join(dir, "index.ts");
	const indexJs = join(dir, "index.js");
	if (existsSync(indexTs) && isRealPathWithinRoot(rootDir, indexTs)) return [indexTs];
	if (existsSync(indexJs) && isRealPathWithinRoot(rootDir, indexJs)) return [indexJs];
	return null;
}
function collectAutoExtensionEntries(dir) {
	const entries = [];
	const rootEntries = resolveExtensionEntries(dir);
	if (rootEntries) return rootEntries;
	const directory = collectDirectoryEntries(dir, dir, void 0, { requireWithinRoot: true });
	for (const entry of directory.entries) if (entry.isFile && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) entries.push(entry.fullPath);
	else if (entry.isDirectory) {
		const resolvedEntries = resolveExtensionEntries(entry.fullPath, dir);
		if (resolvedEntries) entries.push(...resolvedEntries);
	}
	return entries;
}
/**
* Collect resource files from a directory based on resource type.
* Extensions use smart discovery (index.ts in subdirs), others use recursive collection.
*/
function collectResourceFiles(dir, resourceType) {
	if (resourceType === "skills") return collectSkillEntries(dir, "testclaw");
	if (resourceType === "extensions") return collectAutoExtensionEntries(dir);
	return collectFiles(dir, FILE_PATTERNS[resourceType]);
}
const AUTO_RESOURCE_COLLECTORS = {
	extensions: collectAutoExtensionEntries,
	skills: (dir) => collectAutoSkillEntries(dir, "testclaw"),
	prompts: (dir) => collectTopLevelAutoResourceEntries(dir, "prompts"),
	themes: (dir) => collectTopLevelAutoResourceEntries(dir, "themes")
};
function resolveRealPathIfPossible(path) {
	try {
		return realpathSync.native(path);
	} catch {
		return resolve(path);
	}
}
function isRealPathWithinRoot(root, candidate) {
	return isPathInside(resolveRealPathIfPossible(resolve(root)), resolveRealPathIfPossible(candidate));
}
function getMatchCandidates(filePath, baseDir, includeNames) {
	const name = basename(filePath);
	const candidates = [normalizeNativePathSeparators(relative(baseDir, filePath)), normalizeNativePathSeparators(filePath)];
	if (includeNames) candidates.push(name);
	if (name === "SKILL.md") {
		const parentDir = dirname(filePath);
		candidates.push(normalizeNativePathSeparators(relative(baseDir, parentDir)), normalizeNativePathSeparators(parentDir));
		if (includeNames) candidates.push(basename(parentDir));
	}
	return candidates;
}
function matchesAnyPattern(filePath, patterns, baseDir) {
	const candidates = getMatchCandidates(filePath, baseDir, true);
	return patterns.some((pattern) => minimatch.match(candidates, normalizeNativePathSeparators(pattern)).length > 0);
}
function normalizeExactPattern(pattern) {
	const normalized = pattern.startsWith("./") || pattern.startsWith(".\\") ? pattern.slice(2) : pattern;
	return normalizeNativePathSeparators(normalized);
}
function matchesAnyExactPattern(filePath, patterns, baseDir) {
	const candidates = new Set(getMatchCandidates(filePath, baseDir, false));
	return patterns.some((pattern) => candidates.has(normalizeExactPattern(pattern)));
}
function isEnabledByOverrides(filePath, patterns, baseDir) {
	return applyPatterns([filePath], patterns.filter(isOverridePattern), baseDir).has(filePath);
}
/**
* Apply patterns to paths and return a Set of enabled paths.
* Pattern types:
* - Plain patterns: include matching paths
* - `!pattern`: exclude matching paths
* - `+path`: force-include exact path (overrides exclusions)
* - `-path`: force-exclude exact path (overrides force-includes)
*/
function applyPatterns(allPaths, patterns, baseDir) {
	const includes = [];
	const excludes = [];
	const forceIncludes = [];
	const forceExcludes = [];
	for (const p of patterns) if (p.startsWith("+")) forceIncludes.push(p.slice(1));
	else if (p.startsWith("-")) forceExcludes.push(p.slice(1));
	else if (p.startsWith("!")) excludes.push(p.slice(1));
	else includes.push(p);
	let result;
	if (includes.length === 0) result = [...allPaths];
	else result = allPaths.filter((filePath) => matchesAnyPattern(filePath, includes, baseDir));
	if (excludes.length > 0) result = result.filter((filePath) => !matchesAnyPattern(filePath, excludes, baseDir));
	if (forceIncludes.length > 0) {
		for (const filePath of allPaths) if (!result.includes(filePath) && matchesAnyExactPattern(filePath, forceIncludes, baseDir)) result.push(filePath);
	}
	if (forceExcludes.length > 0) result = result.filter((filePath) => !matchesAnyExactPattern(filePath, forceExcludes, baseDir));
	return new Set(result);
}
function getPackageFilter(pkg) {
	if (typeof pkg === "string") return;
	return RESOURCE_TYPES.some((resourceType) => pkg[resourceType] !== void 0) ? pkg : void 0;
}
var DefaultPackageManager = class {
	constructor(options) {
		this.cwd = options.cwd;
		this.agentDir = options.agentDir;
		this.settingsManager = options.settingsManager;
	}
	async resolve(onMissing) {
		const accumulator = this.createAccumulator();
		const globalSettings = this.settingsManager.getGlobalSettings();
		const projectSettings = this.settingsManager.getProjectSettings();
		const allPackages = [];
		for (const pkg of projectSettings.packages ?? []) allPackages.push({
			pkg,
			scope: "project"
		});
		for (const pkg of globalSettings.packages ?? []) allPackages.push({
			pkg,
			scope: "user"
		});
		const packageSources = this.dedupePackages(allPackages);
		await this.resolvePackageSources(packageSources, accumulator, onMissing);
		const globalBaseDir = this.agentDir;
		const projectBaseDir = join(this.cwd, CONFIG_DIR_NAME);
		const localScopes = [{
			scope: "project",
			settings: projectSettings,
			baseDir: projectBaseDir
		}, {
			scope: "user",
			settings: globalSettings,
			baseDir: globalBaseDir
		}];
		for (const resourceType of RESOURCE_TYPES) for (const { scope, settings, baseDir } of localScopes) this.resolveLocalEntries(settings[resourceType] ?? [], resourceType, accumulator[resourceType], {
			source: "local",
			scope,
			origin: "top-level"
		}, baseDir);
		this.addAutoDiscoveredResources(accumulator, globalSettings, projectSettings, globalBaseDir, projectBaseDir);
		return this.toResolvedPaths(accumulator);
	}
	async resolveExtensionSources(sources, options) {
		const accumulator = this.createAccumulator();
		const scope = options?.temporary ? "temporary" : options?.local ? "project" : "user";
		const packageSources = sources.map((source) => ({
			pkg: source,
			scope
		}));
		await this.resolvePackageSources(packageSources, accumulator);
		return this.toResolvedPaths(accumulator);
	}
	async resolvePackageSources(sources, accumulator, onMissing) {
		for (const { pkg, scope } of sources) {
			const sourceStr = typeof pkg === "string" ? pkg : pkg.source;
			const filter = getPackageFilter(pkg);
			const parsed = this.parseSource(sourceStr);
			const metadata = {
				source: sourceStr,
				scope,
				origin: "package"
			};
			const target = this.resolvePackageTarget(parsed, scope);
			if (!target) continue;
			if (target.kind === "missing") {
				if (onMissing && await onMissing(sourceStr) === "error") throw new Error(`Missing source: ${sourceStr}`);
				continue;
			}
			metadata.baseDir = target.baseDir;
			if (target.kind === "file") {
				this.addResource(accumulator.extensions, target.path, metadata, this.isExtensionEnabled(target.path, filter?.extensions, target.baseDir));
				continue;
			}
			const hasPackageLayout = this.collectPackageResources(target.path, accumulator, filter, metadata);
			if (parsed.type === "local" && !hasPackageLayout) this.addResource(accumulator.extensions, target.path, metadata, this.isExtensionEnabled(target.path, filter?.extensions, target.baseDir));
		}
	}
	resolvePackageTarget(source, scope) {
		if (source.type === "npm") {
			const path = this.getNpmInstallPath(source, scope);
			return !existsSync(path) || source.pinned && !this.installedNpmMatchesPinnedVersion(source, path) ? { kind: "missing" } : {
				kind: "directory",
				path,
				baseDir: path
			};
		}
		if (source.type === "git") {
			const path = this.getGitInstallPath(source, scope);
			return existsSync(path) ? {
				kind: "directory",
				path,
				baseDir: path
			} : { kind: "missing" };
		}
		const path = this.resolvePathFromBase(source.path, this.getBaseDirForScope(scope));
		if (!existsSync(path)) return { kind: "missing" };
		try {
			const stats = statSync(path);
			if (stats.isFile()) return {
				kind: "file",
				path,
				baseDir: dirname(path)
			};
			if (stats.isDirectory()) return {
				kind: "directory",
				path,
				baseDir: path
			};
		} catch {}
	}
	isExtensionEnabled(path, patterns, baseDir) {
		if (patterns === void 0) return true;
		return patterns.length > 0 && applyPatterns([path], patterns, baseDir).has(path);
	}
	parseSource(source) {
		if (source.startsWith("npm:")) {
			const spec = source.slice(4).trim();
			const { name, version } = this.parseNpmSpec(spec);
			return {
				type: "npm",
				spec,
				name,
				pinned: Boolean(version)
			};
		}
		if (isLocalPath(source)) return {
			type: "local",
			path: source
		};
		const gitParsed = parseGitUrl(source);
		if (gitParsed) return gitParsed;
		return {
			type: "local",
			path: source
		};
	}
	installedNpmMatchesPinnedVersion(source, installedPath) {
		const installedVersion = this.getInstalledNpmVersion(installedPath);
		if (!installedVersion) return false;
		const { version: pinnedVersion } = this.parseNpmSpec(source.spec);
		if (!pinnedVersion) return true;
		return installedVersion === pinnedVersion;
	}
	getInstalledNpmVersion(installedPath) {
		const packageJsonPath = join(installedPath, "package.json");
		if (!existsSync(packageJsonPath)) return;
		try {
			const content = readFileSync(packageJsonPath, "utf-8");
			return JSON.parse(content).version;
		} catch {
			return;
		}
	}
	/**
	* Get a unique identity for a package, ignoring version/ref.
	* Used to detect when the same package is in both global and project settings.
	* For git packages, uses normalized host/path to ensure SSH and HTTPS URLs
	* for the same repository are treated as identical.
	*/
	getPackageIdentity(source, scope) {
		const parsed = this.parseSource(source);
		if (parsed.type === "npm") return `npm:${parsed.name}`;
		if (parsed.type === "git") return `git:${parsed.host}/${parsed.path}`;
		if (scope) {
			const baseDir = this.getBaseDirForScope(scope);
			return `local:${this.resolvePathFromBase(parsed.path, baseDir)}`;
		}
		return `local:${this.resolvePath(parsed.path)}`;
	}
	/**
	* Dedupe packages: if same package identity appears in both global and project,
	* keep only the project one (project wins).
	*/
	dedupePackages(packages) {
		const seen = /* @__PURE__ */ new Map();
		for (const entry of packages) {
			const sourceStr = typeof entry.pkg === "string" ? entry.pkg : entry.pkg.source;
			const identity = this.getPackageIdentity(sourceStr, entry.scope);
			const existing = seen.get(identity);
			if (!existing) seen.set(identity, entry);
			else if (entry.scope === "project" && existing.scope === "user") seen.set(identity, entry);
		}
		return Array.from(seen.values());
	}
	parseNpmSpec(spec) {
		const match = spec.match(/^(@?[^@]+(?:\/[^@]+)?)(?:@(.+))?$/);
		if (!match) return { name: spec };
		return {
			name: match[1] ?? spec,
			version: match[2]
		};
	}
	getNpmInstallPath(source, scope) {
		if (scope === "temporary") return join(this.getTemporaryDir("npm"), "node_modules", source.name);
		if (scope === "project") return join(this.cwd, CONFIG_DIR_NAME, "npm", "node_modules", source.name);
		return join(this.agentDir, "npm", "node_modules", source.name);
	}
	getGitInstallPath(source, scope) {
		if (scope === "temporary") return this.getTemporaryDir(`git-${source.host}`, source.path);
		if (scope === "project") return join(this.cwd, CONFIG_DIR_NAME, "git", source.host, source.path);
		return join(this.agentDir, "git", source.host, source.path);
	}
	getTemporaryDir(prefix, suffix) {
		const hash = createHash("sha256").update(`${prefix}-${suffix ?? ""}`).digest("hex").slice(0, 8);
		return join(getAgentResourceTempDir(this.agentDir), prefix, hash, suffix ?? "");
	}
	getBaseDirForScope(scope) {
		if (scope === "project") return join(this.cwd, CONFIG_DIR_NAME);
		if (scope === "user") return this.agentDir;
		return this.cwd;
	}
	resolvePath(input) {
		const trimmed = input.trim();
		if (trimmed === "~") return getHomeDir();
		if (trimmed.startsWith("~/")) return join(getHomeDir(), trimmed.slice(2));
		if (trimmed.startsWith("~")) return join(getHomeDir(), trimmed.slice(1));
		return resolve(this.cwd, trimmed);
	}
	resolvePathFromBase(input, baseDir) {
		const trimmed = input.trim();
		if (trimmed === "~") return getHomeDir();
		if (trimmed.startsWith("~/")) return join(getHomeDir(), trimmed.slice(2));
		if (trimmed.startsWith("~")) return join(getHomeDir(), trimmed.slice(1));
		return resolve(baseDir, trimmed);
	}
	collectPackageResources(packageRoot, accumulator, filter, metadata) {
		const manifest = readResourceManifestFile(join(packageRoot, "package.json"));
		const hasPackageLayout = manifest !== null || RESOURCE_TYPES.some((type) => existsSync(join(packageRoot, type)));
		for (const resourceType of RESOURCE_TYPES) {
			const patterns = filter?.[resourceType];
			const target = accumulator[resourceType];
			if (patterns !== void 0) {
				this.applyPackageFilter(packageRoot, patterns, resourceType, target, metadata);
				continue;
			}
			const entries = manifest?.[resourceType];
			if (manifest !== null && (!filter || entries !== void 0)) {
				this.addManifestEntries(entries, packageRoot, resourceType, target, metadata);
				continue;
			}
			const dir = join(packageRoot, resourceType);
			if (existsSync(dir)) for (const path of this.collectConventionResourceFiles(packageRoot, resourceType)) this.addResource(target, path, metadata, true);
		}
		return hasPackageLayout;
	}
	applyPackageFilter(packageRoot, userPatterns, resourceType, target, metadata) {
		const allFiles = this.collectManifestFiles(packageRoot, resourceType);
		if (userPatterns.length === 0) {
			for (const f of allFiles) this.addResource(target, f, metadata, false);
			return;
		}
		const enabledByUser = applyPatterns(allFiles, userPatterns, packageRoot);
		for (const f of allFiles) {
			const enabled = enabledByUser.has(f);
			this.addResource(target, f, metadata, enabled);
		}
	}
	collectManifestFiles(packageRoot, resourceType) {
		const entries = readResourceManifestFile(join(packageRoot, "package.json"))?.[resourceType];
		if (entries && entries.length > 0) {
			const allFiles = this.collectFilesFromManifestEntries(entries, packageRoot, resourceType);
			const manifestPatterns = entries.filter(isOverridePattern);
			return Array.from(manifestPatterns.length > 0 ? applyPatterns(allFiles, manifestPatterns, packageRoot) : new Set(allFiles));
		}
		return this.collectConventionResourceFiles(packageRoot, resourceType);
	}
	collectConventionResourceFiles(packageRoot, resourceType) {
		const conventionDir = join(packageRoot, resourceType);
		if (!existsSync(conventionDir)) return [];
		return this.filterManifestResourcePaths(collectResourceFiles(conventionDir, resourceType), packageRoot);
	}
	addManifestEntries(entries, root, resourceType, target, metadata) {
		if (!entries) return;
		const allFiles = this.collectFilesFromManifestEntries(entries, root, resourceType);
		const enabledPaths = applyPatterns(allFiles, entries.filter(isOverridePattern), root);
		for (const f of allFiles) if (enabledPaths.has(f)) this.addResource(target, f, metadata, true);
	}
	collectFilesFromManifestEntries(entries, root, resourceType) {
		const resolved = entries.filter((entry) => !isOverridePattern(entry)).flatMap((entry) => {
			if (!hasGlobPattern(entry)) return [resolve(root, entry)];
			return globSync(entry, { cwd: root }).map((match) => resolve(root, match));
		});
		return this.collectFilesFromPaths(this.filterManifestResourcePaths(resolved, root), resourceType);
	}
	filterManifestResourcePaths(paths, root) {
		const resolvedRoot = resolve(root);
		const realRoot = resolveRealPathIfPossible(resolvedRoot);
		return paths.filter((path) => {
			const resolvedPath = resolve(path);
			if (!isPathInside(resolvedRoot, resolvedPath)) return false;
			return isPathInside(realRoot, resolveRealPathIfPossible(resolvedPath));
		});
	}
	resolveLocalEntries(entries, resourceType, target, metadata, baseDir) {
		if (entries.length === 0) return;
		const { plain, patterns } = splitPatterns(entries);
		const resolvedPlain = plain.map((p) => this.resolvePathFromBase(p, baseDir));
		const allFiles = this.collectFilesFromPaths(resolvedPlain, resourceType);
		const enabledPaths = applyPatterns(allFiles, patterns, baseDir);
		for (const f of allFiles) this.addResource(target, f, metadata, enabledPaths.has(f));
	}
	addAutoDiscoveredResources(accumulator, globalSettings, projectSettings, globalBaseDir, projectBaseDir) {
		const userAgentsSkillsDir = join(getHomeDir(), ".agents", "skills");
		const projectAgentsSkillDirs = collectAncestorAgentsSkillDirs(this.cwd).filter((dir) => resolve(dir) !== resolve(userAgentsSkillsDir));
		const addScopeResources = (options) => {
			const metadata = {
				source: "auto",
				scope: options.scope,
				origin: "top-level",
				baseDir: options.baseDir
			};
			const addResources = (resourceType, paths, resourceMetadata = metadata, patternBaseDir = options.baseDir) => {
				for (const path of paths) this.addResource(accumulator[resourceType], path, resourceMetadata, isEnabledByOverrides(path, options.settings[resourceType] ?? [], patternBaseDir));
			};
			for (const resourceType of RESOURCE_TYPES) {
				addResources(resourceType, AUTO_RESOURCE_COLLECTORS[resourceType](join(options.baseDir, resourceType)));
				if (resourceType !== "skills") continue;
				for (const skillsDir of options.agentsSkillDirs) {
					const agentsBaseDir = dirname(skillsDir);
					addResources("skills", collectAutoSkillEntries(skillsDir, "agents"), {
						...metadata,
						baseDir: agentsBaseDir
					}, agentsBaseDir);
				}
			}
		};
		addScopeResources({
			scope: "project",
			settings: projectSettings,
			baseDir: projectBaseDir,
			agentsSkillDirs: projectAgentsSkillDirs
		});
		addScopeResources({
			scope: "user",
			settings: globalSettings,
			baseDir: globalBaseDir,
			agentsSkillDirs: isDefaultStateDir() ? [userAgentsSkillsDir] : []
		});
	}
	collectFilesFromPaths(paths, resourceType) {
		const files = [];
		for (const p of paths) {
			if (!existsSync(p)) continue;
			try {
				const stats = statSync(p);
				if (stats.isFile()) files.push(p);
				else if (stats.isDirectory()) files.push(...collectResourceFiles(p, resourceType));
			} catch {}
		}
		return files;
	}
	addResource(map, path, metadata, enabled) {
		if (!path) return;
		if (!map.has(path)) map.set(path, {
			metadata,
			enabled
		});
	}
	createAccumulator() {
		return {
			extensions: /* @__PURE__ */ new Map(),
			skills: /* @__PURE__ */ new Map(),
			prompts: /* @__PURE__ */ new Map(),
			themes: /* @__PURE__ */ new Map()
		};
	}
	toResolvedPaths(accumulator) {
		const mapToResolved = (entries) => {
			const resolved = Array.from(entries.entries()).map(([path, { metadata, enabled }]) => ({
				path,
				enabled,
				metadata
			}));
			resolved.sort((a, b) => resourcePrecedenceRank(a.metadata) - resourcePrecedenceRank(b.metadata));
			const seen = /* @__PURE__ */ new Set();
			return resolved.filter((entry) => {
				const canonicalPath = canonicalizePath(entry.path);
				if (seen.has(canonicalPath)) return false;
				seen.add(canonicalPath);
				return true;
			});
		};
		return {
			extensions: mapToResolved(accumulator.extensions),
			skills: mapToResolved(accumulator.skills),
			prompts: mapToResolved(accumulator.prompts),
			themes: mapToResolved(accumulator.themes)
		};
	}
};
//#endregion
//#region src/agents/sessions/http-dispatcher.ts
/**
* HTTP session dispatcher config helpers.
*
* Parses idle-timeout values shared by server and config surfaces.
*/
const DEFAULT_HTTP_IDLE_TIMEOUT_MS = 3e5;
/** Parses idle timeout values, using `0` for the explicit disabled sentinel. */
function parseHttpIdleTimeoutMs(value) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.toLowerCase() === "disabled") return 0;
		if (trimmed.length === 0) return;
		return parseStrictNonNegativeInteger(trimmed);
	}
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return;
	return Math.floor(value);
}
//#endregion
//#region src/agents/sessions/settings-storage.ts
const SETTINGS_SCOPES = ["global", "project"];
function replaceSettingsFile(path, content) {
	const savePath = resolveJsonSaveTarget(path);
	const saveDir = realpathSync(dirname(savePath));
	const canonicalSavePath = join(saveDir, basename(savePath));
	replaceFileAtomicSync({
		filePath: canonicalSavePath,
		content,
		dirMode: statSync(saveDir).mode & 4095,
		mode: 438 & ~process.umask(),
		preserveExistingMode: true,
		tempPrefix: basename(canonicalSavePath)
	});
}
var FileSettingsStorage = class {
	constructor(cwd, agentDir) {
		this.paths = {
			global: join(agentDir, "settings.json"),
			project: join(cwd, CONFIG_DIR_NAME, "settings.json")
		};
	}
	readSettingsScope(scope) {
		const path = this.paths[scope];
		if (!lstatSync(`${path}.lock`, { throwIfNoEntry: false }) && !lstatSync(`${path}.lock.reclaim`, { throwIfNoEntry: false }) && !existsSync(path)) return;
		let content;
		this.withLock(scope, (current) => {
			content = current;
		});
		return content;
	}
	withLock(scope, fn) {
		const path = this.paths[scope];
		const release = acquireFileLockSyncWithRetry(path);
		try {
			const next = fn(existsSync(path) ? readFileSync(path, "utf-8") : void 0);
			if (next !== void 0) replaceSettingsFile(path, next);
		} finally {
			release();
		}
	}
};
var InMemorySettingsStorage = class {
	constructor() {
		this.values = {
			global: void 0,
			project: void 0
		};
	}
	withLock(scope, fn) {
		const next = fn(this.values[scope]);
		if (next !== void 0) this.values[scope] = next;
	}
};
//#endregion
//#region src/agents/sessions/settings-manager.ts
/**
* Session settings manager.
*
* Loads and persists user/session defaults for models, transports, retry policy, UI, packages, and telemetry.
*/
/** Deep merge settings: project/overrides take precedence, nested objects merge recursively */
function deepMergeSettings(base, overrides) {
	return mergeDeep(base, overrides);
}
var SettingsManager = class SettingsManager {
	constructor(storage, scopes) {
		this.storage = storage;
		this.scopes = scopes;
		this.settings = {};
		this.runtimeOverrides = {};
		this.writeQueue = Promise.resolve();
		this.errors = SETTINGS_SCOPES.flatMap((scope) => {
			const error = scopes[scope].loadError;
			return error ? [{
				scope,
				error
			}] : [];
		});
		this.recomputeSettings();
	}
	/** Create a SettingsManager that loads from files */
	static create(cwd, agentDir = getAgentDir()) {
		const storage = new FileSettingsStorage(cwd, agentDir);
		return SettingsManager.fromStorage(storage);
	}
	/** Create a SettingsManager from an arbitrary storage backend */
	static fromStorage(storage) {
		return new SettingsManager(storage, {
			global: SettingsManager.loadScope(storage, "global"),
			project: SettingsManager.loadScope(storage, "project")
		});
	}
	/** Create an in-memory SettingsManager (no file I/O) */
	static inMemory(settings = {}) {
		const storage = new InMemorySettingsStorage();
		const initialSettings = SettingsManager.migrateSettings(structuredClone(settings));
		storage.withLock("global", () => JSON.stringify(initialSettings, null, 2));
		return SettingsManager.fromStorage(storage);
	}
	static loadScope(storage, scope) {
		let content;
		try {
			if (storage.readSettingsScope) content = storage.readSettingsScope(scope);
			else storage.withLock(scope, (current) => {
				content = current;
			});
			const settings = content ? SettingsManager.migrateSettings(JSON.parse(content)) : {};
			return SettingsManager.createScopeState(settings);
		} catch (error) {
			return SettingsManager.createScopeState({}, error);
		}
	}
	static createScopeState(settings, loadError = null) {
		return {
			settings,
			modified: /* @__PURE__ */ new Map(),
			loadError
		};
	}
	/** Migrate old settings format to new format */
	static migrateSettings(settings) {
		if ("queueMode" in settings && !("steeringMode" in settings)) {
			settings.steeringMode = settings.queueMode;
			delete settings.queueMode;
		}
		if (!("transport" in settings) && typeof settings.websockets === "boolean") {
			settings.transport = settings.websockets ? "websocket" : "sse";
			delete settings.websockets;
		}
		if (isRecord(settings.skills)) {
			const skillsSettings = settings.skills;
			if (skillsSettings.enableSkillCommands !== void 0 && settings.enableSkillCommands === void 0) settings.enableSkillCommands = skillsSettings.enableSkillCommands;
			if (Array.isArray(skillsSettings.customDirectories) && skillsSettings.customDirectories.length > 0) settings.skills = skillsSettings.customDirectories;
			else delete settings.skills;
		}
		if (isRecord(settings.retry)) {
			const retrySettings = settings.retry;
			const providerSettings = asOptionalObjectRecord(retrySettings.provider);
			if (typeof retrySettings.maxDelayMs === "number" && providerSettings?.maxRetryDelayMs == null) retrySettings.provider = {
				...providerSettings,
				maxRetryDelayMs: retrySettings.maxDelayMs
			};
			delete retrySettings.maxDelayMs;
		}
		return settings;
	}
	getGlobalSettings() {
		return structuredClone(this.scopes.global.settings);
	}
	getProjectSettings() {
		return structuredClone(this.scopes.project.settings);
	}
	recomputeSettings() {
		this.settings = deepMergeSettings(deepMergeSettings(this.scopes.global.settings, this.scopes.project.settings), this.runtimeOverrides);
	}
	async reload() {
		await this.writeQueue;
		for (const scope of SETTINGS_SCOPES) {
			const state = this.scopes[scope];
			const loaded = SettingsManager.loadScope(this.storage, scope);
			if (loaded.loadError) {
				state.loadError = loaded.loadError;
				this.recordError(scope, loaded.loadError);
			} else {
				state.settings = loaded.settings;
				state.loadError = null;
			}
			state.modified.clear();
		}
		this.recomputeSettings();
	}
	/** Apply non-persisted overrides on top of global/project settings. */
	applyOverrides(overrides) {
		this.runtimeOverrides = deepMergeSettings(this.runtimeOverrides, overrides);
		this.recomputeSettings();
	}
	markModified(scope, field, nestedKey) {
		const state = this.scopes[scope];
		const existing = state.modified.get(field);
		if (!nestedKey || existing === null) {
			state.modified.set(field, null);
			return;
		}
		const nestedFields = existing ?? /* @__PURE__ */ new Set();
		nestedFields.add(nestedKey);
		state.modified.set(field, nestedFields);
	}
	recordError(scope, error) {
		const normalizedError = error instanceof Error ? error : new Error(String(error));
		this.errors.push({
			scope,
			error: normalizedError
		});
	}
	enqueueWrite(scope, task) {
		this.writeQueue = this.writeQueue.then(() => {
			task();
			this.scopes[scope].modified.clear();
		}).catch((error) => {
			this.recordError(scope, error);
		});
	}
	persistScopedSettings(scope, snapshotSettings, modified) {
		this.storage.withLock(scope, (current) => {
			const currentFileSettings = current ? SettingsManager.migrateSettings(JSON.parse(current)) : {};
			const mergedSettings = { ...currentFileSettings };
			for (const [field, nestedModified] of modified) {
				const value = snapshotSettings[field];
				if (nestedModified && typeof value === "object" && value !== null) {
					const baseNested = currentFileSettings[field] ?? {};
					const inMemoryNested = value;
					const mergedNested = { ...baseNested };
					for (const nestedKey of nestedModified) mergedNested[nestedKey] = inMemoryNested[nestedKey];
					mergedSettings[field] = mergedNested;
				} else mergedSettings[field] = value;
			}
			return JSON.stringify(mergedSettings, null, 2);
		});
	}
	save(scope) {
		this.recomputeSettings();
		const state = this.scopes[scope];
		if (state.loadError) return;
		const snapshotSettings = structuredClone(state.settings);
		const modified = new Map([...state.modified].map(([field, nested]) => [field, nested && new Set(nested)]));
		this.enqueueWrite(scope, () => {
			this.persistScopedSettings(scope, snapshotSettings, modified);
		});
	}
	setScopedSetting(scope, field, value) {
		this.scopes[scope].settings[field] = scope === "project" ? structuredClone(value) : value;
		this.markModified(scope, field);
		this.save(scope);
	}
	setGlobalNestedSetting(field, nestedField, value) {
		const current = this.scopes.global.settings[field];
		const nested = isRecord(current) ? { ...current } : {};
		nested[nestedField] = value;
		this.scopes.global.settings[field] = nested;
		this.markModified("global", field, nestedField);
		this.save("global");
	}
	async flush() {
		await this.writeQueue;
	}
	drainErrors() {
		const drained = [...this.errors];
		this.errors = [];
		return drained;
	}
	getLastChangelogVersion() {
		return this.settings.lastChangelogVersion;
	}
	setLastChangelogVersion(version) {
		this.setScopedSetting("global", "lastChangelogVersion", version);
	}
	getSessionDir() {
		const sessionDir = this.settings.sessionDir;
		if (!sessionDir) return sessionDir;
		return sessionDir === "~" ? homedir() : sessionDir.startsWith("~/") ? join(homedir(), sessionDir.slice(2)) : sessionDir;
	}
	getDefaultProvider() {
		return this.settings.defaultProvider;
	}
	getDefaultModel() {
		return this.settings.defaultModel;
	}
	setDefaultProvider(provider) {
		this.setScopedSetting("global", "defaultProvider", provider);
	}
	setDefaultModel(modelId) {
		this.setScopedSetting("global", "defaultModel", modelId);
	}
	setDefaultModelAndProvider(provider, modelId) {
		this.scopes.global.settings.defaultProvider = provider;
		this.scopes.global.settings.defaultModel = modelId;
		this.markModified("global", "defaultProvider");
		this.markModified("global", "defaultModel");
		this.save("global");
	}
	getSteeringMode() {
		return this.settings.steeringMode || "one-at-a-time";
	}
	setSteeringMode(mode) {
		this.setScopedSetting("global", "steeringMode", mode);
	}
	getFollowUpMode() {
		return this.settings.followUpMode || "one-at-a-time";
	}
	setFollowUpMode(mode) {
		this.setScopedSetting("global", "followUpMode", mode);
	}
	getTheme() {
		return this.settings.theme;
	}
	setTheme(theme) {
		this.setScopedSetting("global", "theme", theme);
	}
	getDefaultThinkingLevel() {
		return this.settings.defaultThinkingLevel;
	}
	setDefaultThinkingLevel(level) {
		this.setScopedSetting("global", "defaultThinkingLevel", level);
	}
	getTransport() {
		return this.settings.transport ?? "auto";
	}
	setTransport(transport) {
		this.setScopedSetting("global", "transport", transport);
	}
	getCompactionEnabled() {
		return this.settings.compaction?.enabled ?? true;
	}
	setCompactionEnabled(enabled) {
		this.setGlobalNestedSetting("compaction", "enabled", enabled);
	}
	getCompactionReserveTokens() {
		return this.settings.compaction?.reserveTokens ?? 16384;
	}
	getCompactionKeepRecentTokens() {
		return this.settings.compaction?.keepRecentTokens ?? 2e4;
	}
	getCompactionSettings() {
		return {
			enabled: this.getCompactionEnabled(),
			reserveTokens: this.getCompactionReserveTokens(),
			keepRecentTokens: this.getCompactionKeepRecentTokens()
		};
	}
	getBranchSummarySettings() {
		return {
			reserveTokens: this.settings.branchSummary?.reserveTokens ?? 16384,
			skipPrompt: this.settings.branchSummary?.skipPrompt ?? false
		};
	}
	getBranchSummarySkipPrompt() {
		return this.settings.branchSummary?.skipPrompt ?? false;
	}
	getRetryEnabled() {
		return this.settings.retry?.enabled ?? true;
	}
	setRetryEnabled(enabled) {
		this.setGlobalNestedSetting("retry", "enabled", enabled);
	}
	getRetrySettings() {
		return {
			enabled: this.getRetryEnabled(),
			maxRetries: this.settings.retry?.maxRetries ?? 3,
			baseDelayMs: this.settings.retry?.baseDelayMs ?? 2e3
		};
	}
	getHttpIdleTimeoutMs() {
		const value = this.settings.httpIdleTimeoutMs;
		const timeoutMs = parseHttpIdleTimeoutMs(value);
		if (timeoutMs !== void 0) return timeoutMs;
		if (value !== void 0) throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(value)}`);
		return DEFAULT_HTTP_IDLE_TIMEOUT_MS;
	}
	setHttpIdleTimeoutMs(timeoutMs) {
		if (!Number.isFinite(timeoutMs) || timeoutMs < 0) throw new Error(`Invalid httpIdleTimeoutMs setting: ${String(timeoutMs)}`);
		this.setScopedSetting("global", "httpIdleTimeoutMs", Math.floor(timeoutMs));
	}
	getProviderRetrySettings() {
		return {
			timeoutMs: this.settings.retry?.provider?.timeoutMs,
			maxRetries: this.settings.retry?.provider?.maxRetries,
			maxRetryDelayMs: this.settings.retry?.provider?.maxRetryDelayMs ?? 6e4
		};
	}
	getHideThinkingBlock() {
		return this.settings.hideThinkingBlock ?? false;
	}
	setHideThinkingBlock(hide) {
		this.setScopedSetting("global", "hideThinkingBlock", hide);
	}
	getShellPath() {
		return this.settings.shellPath;
	}
	setShellPath(path) {
		this.setScopedSetting("global", "shellPath", path);
	}
	getQuietStartup() {
		return this.settings.quietStartup ?? false;
	}
	setQuietStartup(quiet) {
		this.setScopedSetting("global", "quietStartup", quiet);
	}
	getShellCommandPrefix() {
		return this.settings.shellCommandPrefix;
	}
	setShellCommandPrefix(prefix) {
		this.setScopedSetting("global", "shellCommandPrefix", prefix);
	}
	getNpmCommand() {
		return this.settings.npmCommand ? [...this.settings.npmCommand] : void 0;
	}
	setNpmCommand(command) {
		this.setScopedSetting("global", "npmCommand", command ? [...command] : void 0);
	}
	getCollapseChangelog() {
		return this.settings.collapseChangelog ?? false;
	}
	setCollapseChangelog(collapse) {
		this.setScopedSetting("global", "collapseChangelog", collapse);
	}
	getEnableInstallTelemetry() {
		return this.settings.enableInstallTelemetry ?? true;
	}
	setEnableInstallTelemetry(enabled) {
		this.setScopedSetting("global", "enableInstallTelemetry", enabled);
	}
	getPackages() {
		return [...this.settings.packages ?? []];
	}
	setPackages(packages) {
		this.setScopedSetting("global", "packages", packages);
	}
	setProjectPackages(packages) {
		this.setScopedSetting("project", "packages", packages);
	}
	getExtensionPaths() {
		return [...this.settings.extensions ?? []];
	}
	setExtensionPaths(paths) {
		this.setScopedSetting("global", "extensions", paths);
	}
	setProjectExtensionPaths(paths) {
		this.setScopedSetting("project", "extensions", paths);
	}
	getSkillPaths() {
		return [...this.settings.skills ?? []];
	}
	setSkillPaths(paths) {
		this.setScopedSetting("global", "skills", paths);
	}
	setProjectSkillPaths(paths) {
		this.setScopedSetting("project", "skills", paths);
	}
	getPromptTemplatePaths() {
		return [...this.settings.prompts ?? []];
	}
	setPromptTemplatePaths(paths) {
		this.setScopedSetting("global", "prompts", paths);
	}
	setProjectPromptTemplatePaths(paths) {
		this.setScopedSetting("project", "prompts", paths);
	}
	getThemePaths() {
		return [...this.settings.themes ?? []];
	}
	setThemePaths(paths) {
		this.setScopedSetting("global", "themes", paths);
	}
	setProjectThemePaths(paths) {
		this.setScopedSetting("project", "themes", paths);
	}
	getEnableSkillCommands() {
		return this.settings.enableSkillCommands ?? true;
	}
	setEnableSkillCommands(enabled) {
		this.setScopedSetting("global", "enableSkillCommands", enabled);
	}
	getThinkingBudgets() {
		return this.settings.thinkingBudgets;
	}
	getShowImages() {
		return this.settings.terminal?.showImages ?? true;
	}
	setShowImages(show) {
		this.setGlobalNestedSetting("terminal", "showImages", show);
	}
	getImageWidthCells() {
		return resolveIntegerOption(this.settings.terminal?.imageWidthCells, 60, { min: 1 });
	}
	setImageWidthCells(width) {
		this.setGlobalNestedSetting("terminal", "imageWidthCells", Math.max(1, Math.floor(width)));
	}
	getClearOnShrink() {
		return this.settings.terminal?.clearOnShrink ?? false;
	}
	setClearOnShrink(enabled) {
		this.setGlobalNestedSetting("terminal", "clearOnShrink", enabled);
	}
	getShowTerminalProgress() {
		return this.settings.terminal?.showTerminalProgress ?? false;
	}
	setShowTerminalProgress(enabled) {
		this.setGlobalNestedSetting("terminal", "showTerminalProgress", enabled);
	}
	getImageAutoResize() {
		return this.settings.images?.autoResize ?? true;
	}
	setImageAutoResize(enabled) {
		this.setGlobalNestedSetting("images", "autoResize", enabled);
	}
	getBlockImages() {
		return this.settings.images?.blockImages ?? false;
	}
	setBlockImages(blocked) {
		this.setGlobalNestedSetting("images", "blockImages", blocked);
	}
	getEnabledModels() {
		return this.settings.enabledModels;
	}
	setEnabledModels(patterns) {
		this.setScopedSetting("global", "enabledModels", patterns);
	}
	getDoubleEscapeAction() {
		return this.settings.doubleEscapeAction ?? "tree";
	}
	setDoubleEscapeAction(action) {
		this.setScopedSetting("global", "doubleEscapeAction", action);
	}
	getTreeFilterMode() {
		const mode = this.settings.treeFilterMode;
		return mode && [
			"default",
			"no-tools",
			"user-only",
			"labeled-only",
			"all"
		].includes(mode) ? mode : "default";
	}
	setTreeFilterMode(mode) {
		this.setScopedSetting("global", "treeFilterMode", mode);
	}
	getShowHardwareCursor() {
		return this.settings.showHardwareCursor ?? false;
	}
	setShowHardwareCursor(enabled) {
		this.setScopedSetting("global", "showHardwareCursor", enabled);
	}
	getEditorPaddingX() {
		return this.settings.editorPaddingX ?? 0;
	}
	setEditorPaddingX(padding) {
		this.setScopedSetting("global", "editorPaddingX", Math.max(0, Math.min(3, Math.floor(padding))));
	}
	getAutocompleteMaxVisible() {
		return this.settings.autocompleteMaxVisible ?? 5;
	}
	setAutocompleteMaxVisible(maxVisible) {
		this.setScopedSetting("global", "autocompleteMaxVisible", Math.max(3, Math.min(20, Math.floor(maxVisible))));
	}
	getCodeBlockIndent() {
		return this.settings.markdown?.codeBlockIndent ?? "  ";
	}
	getWarnings() {
		return { ...this.settings.warnings };
	}
	setWarnings(warnings) {
		this.setScopedSetting("global", "warnings", { ...warnings });
	}
};
//#endregion
//#region src/agents/sessions/extensions/types.ts
/**
* Preserve parameter inference for standalone tool definitions.
*
* Use this when assigning a tool to a variable or passing it through arrays such
* as `customTools`, where contextual typing would otherwise widen params to
* `unknown`.
*/
function defineTool(tool) {
	return tool;
}
function isBashToolResult(e) {
	return e.toolName === "bash";
}
function isReadToolResult(e) {
	return e.toolName === "read";
}
function isEditToolResult(e) {
	return e.toolName === "edit";
}
function isWriteToolResult(e) {
	return e.toolName === "write";
}
function isGrepToolResult(e) {
	return e.toolName === "grep";
}
function isFindToolResult(e) {
	return e.toolName === "find";
}
function isLsToolResult(e) {
	return e.toolName === "ls";
}
function isToolCallEventType(toolName, event) {
	return event.toolName === toolName;
}
//#endregion
//#region src/agents/sessions/extensions/wrapper.ts
/**
* Wrap a RegisteredTool into an AgentTool.
* Uses the runner's createContext() for consistent context across tools and event handlers.
*/
function wrapRegisteredTool(registeredTool, runner) {
	return wrapToolDefinition(registeredTool.definition, () => runner.createContext());
}
/**
* Wrap all registered tools into AgentTools.
* Uses the runner's createContext() for consistent context across tools and event handlers.
*/
function wrapRegisteredTools(registeredTools, runner) {
	return wrapToolDefinitions(registeredTools.map((registeredTool) => registeredTool.definition), () => runner.createContext());
}
//#endregion
//#region src/agents/sessions/extension-sdk.ts
var extension_sdk_exports = /* @__PURE__ */ __exportAll({
	AUTH_STORAGE_CREATE_DEPRECATION_CODE: () => AUTH_STORAGE_CREATE_DEPRECATION_CODE,
	AuthStorage: () => AuthStorage,
	CURRENT_SESSION_VERSION: () => 4,
	DEFAULT_COMPACTION_SETTINGS: () => DEFAULT_COMPACTION_SETTINGS,
	DEFAULT_MAX_BYTES: () => DEFAULT_MAX_BYTES,
	DEFAULT_MAX_LINES: () => DEFAULT_MAX_LINES,
	DefaultPackageManager: () => DefaultPackageManager,
	FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE: () => FILE_AUTH_STORAGE_BACKEND_DEPRECATION_CODE,
	FileAuthStorageBackend: () => FileAuthStorageBackend,
	FileSettingsStorage: () => FileSettingsStorage,
	InMemoryAuthStorageBackend: () => InMemoryAuthStorageBackend,
	InMemorySettingsStorage: () => InMemorySettingsStorage,
	ModelRegistry: () => ModelRegistry,
	OAuthProviderConfiguredUnavailableError: () => OAuthProviderConfiguredUnavailableError,
	SessionManager: () => SessionManager,
	SettingsManager: () => SettingsManager,
	VERSION: () => PACKAGE_MANIFEST_VERSION,
	allToolNames: () => allToolNames,
	buildSessionContext: () => buildSessionContext$1,
	calculateContextTokens: () => calculateContextTokens,
	collectEntriesForBranchSummary: () => collectEntriesForBranchSummary,
	compact: () => compact,
	convertToLlm: () => convertToLlm,
	createAllToolDefinitions: () => createAllToolDefinitions,
	createAllTools: () => createAllTools,
	createBashTool: () => createBashTool,
	createBashToolDefinition: () => createBashToolDefinition,
	createCodingToolDefinitions: () => createCodingToolDefinitions,
	createCodingTools: () => createCodingTools,
	createEditTool: () => createEditTool,
	createEditToolDefinition: () => createEditToolDefinition,
	createEventBus: () => createEventBus,
	createFindTool: () => createFindTool,
	createFindToolDefinition: () => createFindToolDefinition,
	createGrepTool: () => createGrepTool,
	createGrepToolDefinition: () => createGrepToolDefinition,
	createLocalBashOperations: () => createLocalBashOperations,
	createLsTool: () => createLsTool,
	createLsToolDefinition: () => createLsToolDefinition,
	createReadOnlyToolDefinitions: () => createReadOnlyToolDefinitions,
	createReadOnlyTools: () => createReadOnlyTools,
	createReadTool: () => createReadTool,
	createReadToolDefinition: () => createReadToolDefinition,
	createSourceInfo: () => createSourceInfo,
	createSyntheticSourceInfo: () => createSyntheticSourceInfo,
	createTool: () => createTool,
	createToolDefinition: () => createToolDefinition,
	createWriteTool: () => createWriteTool,
	createWriteToolDefinition: () => createWriteToolDefinition,
	defineTool: () => defineTool,
	estimateContextTokens: () => estimateContextTokens,
	estimateTokens: () => estimateTokens,
	executeBashWithOperations: () => executeBashWithOperations,
	findCutPoint: () => findCutPoint,
	findExactModelReferenceMatch: () => findExactModelReferenceMatch,
	findInitialModel: () => findInitialModel,
	findTurnStartIndex: () => findTurnStartIndex,
	formatSize: () => formatSize,
	generateBranchSummary: () => generateBranchSummary,
	generateSummary: () => generateSummary,
	getAgentDir: () => getAgentDir,
	getLastAssistantUsage: () => getLastAssistantUsage,
	getLatestCompactionEntry: () => getLatestCompactionEntry,
	isBashToolResult: () => isBashToolResult,
	isEditToolResult: () => isEditToolResult,
	isFindToolResult: () => isFindToolResult,
	isGrepToolResult: () => isGrepToolResult,
	isLsToolResult: () => isLsToolResult,
	isReadToolResult: () => isReadToolResult,
	isToolCallEventType: () => isToolCallEventType,
	isWriteToolResult: () => isWriteToolResult,
	migrateSessionEntries: () => migrateSessionEntries,
	normalizeLoadedFileEntry: () => normalizeLoadedFileEntry,
	parseModelPattern: () => parseModelPattern,
	parseSessionEntries: () => parseSessionEntries,
	prepareBranchEntries: () => prepareBranchEntries,
	prepareCompaction: () => prepareCompaction,
	resolveCliModel: () => resolveCliModel,
	resolveModelScope: () => resolveModelScope,
	restoreModelFromSession: () => restoreModelFromSession,
	serializeConversation: () => serializeConversation,
	shouldCompact: () => shouldCompact,
	truncateHead: () => truncateHead,
	truncateLine: () => truncateLine,
	truncateTail: () => truncateTail,
	withFileMutationQueue: () => withFileMutationQueue,
	wrapRegisteredTool: () => wrapRegisteredTool,
	wrapRegisteredTools: () => wrapRegisteredTools
});
//#endregion
//#region src/agents/sessions/extensions/loader.ts
/**
* Extension loader - loads TypeScript extension modules using jiti.
*
*/
/** Canonical host modules shared by source extensions and compiled binaries. */
const VIRTUAL_MODULES = {
	typebox: bundledTypebox,
	"typebox/compile": bundledTypeboxCompile,
	"typebox/error": bundledTypeboxError,
	"typebox/format": bundledTypeboxFormat,
	"typebox/guard": bundledTypeboxGuard,
	"typebox/schema": bundledTypeboxSchema,
	"typebox/system": bundledTypeboxSystem,
	"typebox/type": bundledTypeboxType,
	"typebox/value": bundledTypeboxValue,
	"@sinclair/typebox": bundledTypebox,
	"@sinclair/typebox/compile": bundledTypeboxCompile,
	"@sinclair/typebox/format": bundledTypeboxFormat,
	"@sinclair/typebox/value": bundledTypeboxValue,
	"testclaw/plugin-sdk/agent-core": agent_core_exports,
	"@testclaw/plugin-sdk/agent-core": agent_core_exports,
	"testclaw/plugin-sdk/llm": llm_exports,
	"@testclaw/plugin-sdk/llm": llm_exports,
	"testclaw/plugin-sdk/agent-sessions": extension_sdk_exports,
	"@testclaw/plugin-sdk/agent-sessions": extension_sdk_exports
};
const require = createRequire(import.meta.url);
let createJitiLoaderFactory;
let nativeExtensionLoadCounter = 0;
let extensionCacheCwd;
let extensionCacheGeneration = 0;
const extensionFactoryCache = /* @__PURE__ */ new Map();
const EXTENSION_LOADER_ALIAS_IMPORT_PATTERN = /(?:@testclaw\/plugin-sdk|testclaw\/plugin-sdk|@sinclair\/typebox|typebox)(?:\/[A-Za-z0-9_-]+)?/u;
const RELATIVE_EXTENSION_IMPORT_PATTERN = /(?:import\s*(?:[^'"]*?\s*from\s*)?["']\.{1,2}\/|export\s*(?:[^'"]*?\s*from\s*)["']\.{1,2}\/|import\s*\(\s*["']\.{1,2}\/|require\s*\(\s*["']\.{1,2}\/)/u;
const COMMONJS_EXTENSION_EXPORT_PATTERN = /\b(?:module\.exports|exports\.)/u;
async function loadCreateJitiLoaderFactory() {
	if (createJitiLoaderFactory) return createJitiLoaderFactory;
	const loaded = await import("jiti/static");
	if (typeof loaded.createJiti !== "function") throw new Error("jiti/static module did not export createJiti");
	createJitiLoaderFactory = loaded.createJiti;
	return createJitiLoaderFactory;
}
const UNICODE_SPACES = /[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g;
function normalizeUnicodeSpaces(str) {
	return str.replace(UNICODE_SPACES, " ");
}
function expandPath(p) {
	const normalized = normalizeUnicodeSpaces(p);
	if (normalized.startsWith("~/")) return path$1.join(os$1.homedir(), normalized.slice(2));
	if (normalized.startsWith("~")) return path$1.join(os$1.homedir(), normalized.slice(1));
	return normalized;
}
function resolvePath(extPath, cwd) {
	const expanded = expandPath(extPath);
	if (path$1.isAbsolute(expanded)) return expanded;
	return path$1.resolve(cwd, expanded);
}
function clearExtensionCache() {
	extensionFactoryCache.clear();
	extensionCacheCwd = void 0;
	extensionCacheGeneration++;
}
function useExtensionCacheCwd(cwd) {
	const resolvedCwd = path$1.resolve(expandPath(cwd));
	if (extensionCacheCwd !== void 0 && extensionCacheCwd !== resolvedCwd) clearExtensionCache();
	extensionCacheCwd = resolvedCwd;
	return {
		cwd: resolvedCwd,
		generation: extensionCacheGeneration
	};
}
function isCurrentCacheScope(scope) {
	return scope !== void 0 && extensionCacheCwd === scope.cwd && extensionCacheGeneration === scope.generation;
}
/**
* Create a runtime with throwing stubs for action methods.
* Runner.bindCore() replaces these with real implementations.
*/
function createExtensionRuntime() {
	const notInitialized = () => {
		throw new Error("Extension runtime not initialized. Action methods cannot be called during extension loading.");
	};
	const state = {};
	const assertActive = () => {
		if (state.staleMessage) throw new Error(state.staleMessage);
	};
	const runtime = {
		sendMessage: notInitialized,
		sendUserMessage: notInitialized,
		appendEntry: notInitialized,
		setSessionName: notInitialized,
		getSessionName: notInitialized,
		setLabel: notInitialized,
		getActiveTools: notInitialized,
		getAllTools: notInitialized,
		setActiveTools: notInitialized,
		refreshTools: () => {},
		getCommands: notInitialized,
		setModel: () => Promise.reject(/* @__PURE__ */ new Error("Extension runtime not initialized")),
		getThinkingLevel: notInitialized,
		setThinkingLevel: notInitialized,
		flagValues: /* @__PURE__ */ new Map(),
		pendingProviderRegistrations: [],
		assertActive,
		invalidate: (message) => {
			state.staleMessage ??= message ?? "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().";
		},
		registerProvider: (name, config, extensionPath = "<unknown>") => {
			runtime.pendingProviderRegistrations.push({
				name,
				config,
				extensionPath
			});
		},
		unregisterProvider: (name) => {
			runtime.pendingProviderRegistrations = runtime.pendingProviderRegistrations.filter((r) => r.name !== name);
		}
	};
	return runtime;
}
/**
* Create the ExtensionAPI for an extension.
* Registration methods write to the extension object.
* Action methods delegate to the shared runtime.
*/
function createExtensionAPI(extension, runtime, cwd, eventBus) {
	return {
		on(event, handler) {
			runtime.assertActive();
			const list = extension.handlers.get(event) ?? [];
			list.push(handler);
			extension.handlers.set(event, list);
		},
		registerTool(tool) {
			runtime.assertActive();
			extension.tools.set(tool.name, {
				definition: tool,
				sourceInfo: extension.sourceInfo
			});
			runtime.refreshTools();
		},
		registerCommand(name, options) {
			runtime.assertActive();
			extension.commands.set(name, {
				name,
				sourceInfo: extension.sourceInfo,
				...options
			});
		},
		registerShortcut(shortcut, options) {
			runtime.assertActive();
			extension.shortcuts.set(shortcut, {
				shortcut,
				extensionPath: extension.path,
				...options
			});
		},
		registerFlag(name, options) {
			runtime.assertActive();
			extension.flags.set(name, {
				name,
				extensionPath: extension.path,
				...options
			});
			if (options.default !== void 0 && !runtime.flagValues.has(name)) runtime.flagValues.set(name, options.default);
		},
		registerMessageRenderer(customType, renderer) {
			runtime.assertActive();
			extension.messageRenderers.set(customType, renderer);
		},
		getFlag(name) {
			runtime.assertActive();
			if (!extension.flags.has(name)) return;
			return runtime.flagValues.get(name);
		},
		sendMessage(message, options) {
			runtime.assertActive();
			runtime.sendMessage(message, options);
		},
		sendUserMessage(content, options) {
			runtime.assertActive();
			runtime.sendUserMessage(content, options);
		},
		appendEntry(customType, data) {
			runtime.assertActive();
			runtime.appendEntry(customType, data);
		},
		setSessionName(name) {
			runtime.assertActive();
			runtime.setSessionName(name);
		},
		getSessionName() {
			runtime.assertActive();
			return runtime.getSessionName();
		},
		setLabel(entryId, label) {
			runtime.assertActive();
			runtime.setLabel(entryId, label);
		},
		exec(command, args, options) {
			runtime.assertActive();
			return execCommand(command, args, options?.cwd ?? cwd, options);
		},
		getActiveTools() {
			runtime.assertActive();
			return runtime.getActiveTools();
		},
		getAllTools() {
			runtime.assertActive();
			return runtime.getAllTools();
		},
		setActiveTools(toolNames) {
			runtime.assertActive();
			runtime.setActiveTools(toolNames);
		},
		getCommands() {
			runtime.assertActive();
			return runtime.getCommands();
		},
		setModel(model) {
			runtime.assertActive();
			return runtime.setModel(model);
		},
		getThinkingLevel() {
			runtime.assertActive();
			return runtime.getThinkingLevel();
		},
		setThinkingLevel(level) {
			runtime.assertActive();
			return runtime.setThinkingLevel(level);
		},
		registerProvider(name, config) {
			runtime.assertActive();
			runtime.registerProvider(name, config, extension.path);
		},
		unregisterProvider(name) {
			runtime.assertActive();
			runtime.unregisterProvider(name, extension.path);
		},
		events: eventBus
	};
}
function resolveExtensionFactory(module) {
	const candidate = typeof module === "object" && module !== null && "default" in module ? module.default : module;
	if (typeof candidate === "function") return candidate;
	const nestedCandidate = typeof candidate === "object" && candidate !== null && "default" in candidate ? candidate.default : void 0;
	return typeof nestedCandidate === "function" ? nestedCandidate : void 0;
}
function isJavaScriptExtensionPath(extensionPath) {
	switch (path$1.extname(extensionPath).toLowerCase()) {
		case ".cjs":
		case ".mjs": return true;
		default: return false;
	}
}
function extensionSourceNeedsJitiAliasResolution(extensionPath) {
	try {
		const source = fs$1.readFileSync(extensionPath, "utf8");
		return EXTENSION_LOADER_ALIAS_IMPORT_PATTERN.test(source) || RELATIVE_EXTENSION_IMPORT_PATTERN.test(source) || path$1.extname(extensionPath).toLowerCase() === ".js" && COMMONJS_EXTENSION_EXPORT_PATTERN.test(source);
	} catch {
		return true;
	}
}
function shouldLoadExtensionWithNativeImport(extensionPath) {
	return !isBunBinary && isJavaScriptExtensionPath(extensionPath) && !extensionSourceNeedsJitiAliasResolution(extensionPath);
}
async function loadNativeExtensionModule(extensionPath) {
	const url = pathToFileURL(extensionPath);
	url.searchParams.set("v", String(++nativeExtensionLoadCounter));
	try {
		const cachedPath = require.resolve(extensionPath);
		delete require.cache[cachedPath];
	} catch {}
	return resolveExtensionFactory(await import(url.href));
}
async function loadExtensionSourceTransformModule(extensionPath, context) {
	if (!context.sourceTransformLoader) {
		installAssistantInternalCorePackageNativeResolver({ moduleUrl: import.meta.url });
		const createJitiLoader = await loadCreateJitiLoaderFactory();
		const aliases = isBunBinary ? {} : buildPluginLoaderAliasMap(fileURLToPath(import.meta.url), process.argv[1], import.meta.url);
		context.sourceTransformLoader = createJitiLoader(import.meta.url, {
			...buildPluginLoaderJitiOptions(aliases),
			virtualModules: VIRTUAL_MODULES,
			tryNative: false,
			moduleCache: false
		});
	}
	return resolveExtensionFactory(await context.sourceTransformLoader.import(extensionPath, { default: true }));
}
async function loadExtensionModule(extensionPath, context) {
	if (isCurrentCacheScope(context.cacheScope)) {
		const cachedFactory = extensionFactoryCache.get(extensionPath);
		if (cachedFactory) return cachedFactory;
	}
	const factory = shouldLoadExtensionWithNativeImport(extensionPath) ? await loadNativeExtensionModule(extensionPath) : await loadExtensionSourceTransformModule(extensionPath, context);
	if (factory && isCurrentCacheScope(context.cacheScope)) extensionFactoryCache.set(extensionPath, factory);
	return factory;
}
/**
* Create an Extension object with empty collections.
*/
function createExtension(extensionPath, resolvedPath) {
	const source = extensionPath.startsWith("<") && extensionPath.endsWith(">") ? extensionPath.slice(1, -1).split(":")[0] || "temporary" : "local";
	const baseDir = extensionPath.startsWith("<") ? void 0 : path$1.dirname(resolvedPath);
	return {
		path: extensionPath,
		resolvedPath,
		sourceInfo: createSyntheticSourceInfo(extensionPath, {
			source,
			baseDir
		}),
		handlers: /* @__PURE__ */ new Map(),
		tools: /* @__PURE__ */ new Map(),
		messageRenderers: /* @__PURE__ */ new Map(),
		commands: /* @__PURE__ */ new Map(),
		flags: /* @__PURE__ */ new Map(),
		shortcuts: /* @__PURE__ */ new Map()
	};
}
async function loadExtension(extensionPath, cwd, eventBus, runtime, context) {
	const resolvedPath = resolvePath(extensionPath, cwd);
	try {
		const factory = await loadExtensionModule(resolvedPath, context);
		if (!factory) return {
			extension: null,
			error: `Extension does not export a valid factory function: ${extensionPath}`
		};
		const extension = createExtension(extensionPath, resolvedPath);
		await factory(createExtensionAPI(extension, runtime, cwd, eventBus));
		return {
			extension,
			error: null
		};
	} catch (err) {
		return {
			extension: null,
			error: `Failed to load extension: ${err instanceof Error ? err.message : String(err)}`
		};
	}
}
/**
* Create an Extension from an inline factory function.
*/
async function loadExtensionFromFactory(factory, cwd, eventBus, runtime, extensionPath = "<inline>") {
	const extension = createExtension(extensionPath, extensionPath);
	await factory(createExtensionAPI(extension, runtime, cwd, eventBus));
	return extension;
}
/**
* Load extensions from paths.
*/
async function loadExtensionsCached(paths, cwd, eventBus) {
	const extensions = [];
	const errors = [];
	const resolvedEventBus = eventBus ?? createEventBus();
	const runtime = createExtensionRuntime();
	const cacheScope = useExtensionCacheCwd(cwd);
	const resolvedCwd = cacheScope.cwd;
	const context = { cacheScope };
	for (const extPath of paths) {
		const { extension, error } = await loadExtension(extPath, resolvedCwd, resolvedEventBus, runtime, context);
		if (error) {
			errors.push({
				path: extPath,
				error
			});
			continue;
		}
		if (extension) extensions.push(extension);
	}
	return {
		extensions,
		errors,
		runtime
	};
}
//#endregion
//#region src/agents/sessions/extensions/handler-error.ts
/** A missing committed view is a runtime fault; ordinary extension faults remain isolated. */
function reportExtensionHandlerError(error, extensionPath, event, report) {
	if (error instanceof SessionMetadataCommittedError) throw error;
	report({
		extensionPath,
		event,
		error: coerceErrorMessage(error),
		stack: error instanceof Error ? error.stack : void 0
	});
}
//#endregion
//#region src/agents/sessions/extensions/metadata-actions.ts
/** Retain the bound runtime and manager through queued metadata transaction/commit grants. */
function bindExtensionMetadataActions(manager, runtime, actions) {
	const run = (action) => {
		runtime.assertActive();
		const target = manager.getSessionTarget();
		const assertCurrent = () => {
			runtime.assertActive();
			const current = manager.getSessionTarget();
			if (!sameSessionTranscriptTargetBinding(target, current)) throw new Error("Extension session manager changed before metadata persistence");
		};
		return target ? withSessionTranscriptWriteAssertion(target, assertCurrent, action) : action();
	};
	runtime.setModel = (model) => run(() => actions.setModel(model));
	runtime.setThinkingLevel = (level) => run(() => actions.setThinkingLevel(level));
}
//#endregion
//#region src/agents/sessions/extensions/runner.ts
const RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS = [
	"app.interrupt",
	"app.clear",
	"app.exit",
	"app.suspend",
	"app.thinking.cycle",
	"app.model.cycleForward",
	"app.model.cycleBackward",
	"app.model.select",
	"app.tools.expand",
	"app.thinking.toggle",
	"app.editor.external",
	"app.message.followUp",
	"tui.input.submit",
	"tui.select.confirm",
	"tui.select.cancel",
	"tui.input.copy",
	"tui.editor.deleteToLineEnd"
];
const buildBuiltinKeybindings = (resolvedKeybindings) => {
	const builtinKeybindings = {};
	for (const [keybinding, keys] of Object.entries(resolvedKeybindings)) {
		if (keys === void 0) continue;
		const keyList = Array.isArray(keys) ? keys : [keys];
		const restrictOverride = RESERVED_KEYBINDINGS_FOR_EXTENSION_CONFLICTS.includes(keybinding);
		for (const key of keyList) {
			const normalizedKey = key.toLowerCase();
			if (builtinKeybindings[normalizedKey]?.restrictOverride && !restrictOverride) continue;
			builtinKeybindings[normalizedKey] = {
				keybinding,
				restrictOverride
			};
		}
	}
	return builtinKeybindings;
};
/**
* Helper function to emit session_shutdown event to extensions.
* Returns true if the event was emitted, false if there were no handlers.
*/
async function emitSessionShutdownEvent(extensionRunner, event) {
	if (extensionRunner.hasHandlers("session_shutdown")) {
		await extensionRunner.emit(event);
		return true;
	}
	return false;
}
const noOpUIContext = {
	select: async () => void 0,
	confirm: async () => false,
	input: async () => void 0,
	notify: () => {},
	onTerminalInput: () => () => {},
	setStatus: () => {},
	setWorkingMessage: () => {},
	setWorkingVisible: () => {},
	setWorkingIndicator: () => {},
	setHiddenThinkingLabel: () => {},
	setWidget: () => {},
	setFooter: () => {},
	setHeader: () => {},
	setTitle: () => {},
	custom: async () => void 0,
	pasteToEditor: () => {},
	setEditorText: () => {},
	getEditorText: () => "",
	editor: async () => void 0,
	addAutocompleteProvider: () => {},
	setEditorComponent: () => {},
	getEditorComponent: () => void 0,
	get theme() {
		return interactiveAgentTheme;
	},
	getAllThemes: () => [],
	getTheme: () => void 0,
	setTheme: (nextTheme) => {
		return {
			success: false,
			error: "UI not available"
		};
	},
	getToolsExpanded: () => false,
	setToolsExpanded: () => {}
};
var ExtensionRunner = class {
	constructor(extensions, runtime, cwd, sessionManager, modelRegistry) {
		this.errorListeners = /* @__PURE__ */ new Set();
		this.getModel = () => void 0;
		this.isIdleFn = () => true;
		this.getSignalFn = () => void 0;
		this.waitForIdleFn = async () => {};
		this.abortFn = () => {};
		this.hasPendingMessagesFn = () => false;
		this.getContextUsageFn = () => void 0;
		this.compactFn = () => {};
		this.getSystemPromptFn = () => "";
		this.newSessionHandler = async () => ({ cancelled: false });
		this.forkHandler = async () => ({ cancelled: false });
		this.navigateTreeHandler = async () => ({ cancelled: false });
		this.switchSessionHandler = async () => ({ cancelled: false });
		this.reloadHandler = async () => {};
		this.shutdownHandler = () => {};
		this.shortcutDiagnostics = [];
		this.commandDiagnostics = [];
		this.extensions = extensions;
		this.runtime = runtime;
		this.uiContext = noOpUIContext;
		this.cwd = cwd;
		this.sessionManager = sessionManager;
		this.modelRegistry = modelRegistry;
	}
	bindCore(actions, contextActions, providerActions) {
		this.runtime.sendMessage = actions.sendMessage;
		this.runtime.sendUserMessage = actions.sendUserMessage;
		this.runtime.appendEntry = actions.appendEntry;
		this.runtime.setSessionName = actions.setSessionName;
		this.runtime.getSessionName = actions.getSessionName;
		this.runtime.setLabel = actions.setLabel;
		this.runtime.getActiveTools = actions.getActiveTools;
		this.runtime.getAllTools = actions.getAllTools;
		this.runtime.setActiveTools = actions.setActiveTools;
		this.runtime.refreshTools = actions.refreshTools;
		this.runtime.getCommands = actions.getCommands;
		bindExtensionMetadataActions(this.sessionManager, this.runtime, actions);
		this.runtime.getThinkingLevel = actions.getThinkingLevel;
		this.getModel = contextActions.getModel;
		this.isIdleFn = contextActions.isIdle;
		this.getSignalFn = contextActions.getSignal;
		this.abortFn = contextActions.abort;
		this.hasPendingMessagesFn = contextActions.hasPendingMessages;
		this.shutdownHandler = contextActions.shutdown;
		this.getContextUsageFn = contextActions.getContextUsage;
		this.compactFn = contextActions.compact;
		this.getSystemPromptFn = contextActions.getSystemPrompt;
		for (const { name, config, extensionPath } of this.runtime.pendingProviderRegistrations) try {
			if (providerActions?.registerProvider) providerActions.registerProvider(name, config);
			else this.modelRegistry.registerProvider(name, config);
		} catch (err) {
			this.emitError({
				extensionPath,
				event: "register_provider",
				error: coerceErrorMessage(err),
				stack: err instanceof Error ? err.stack : void 0
			});
		}
		this.runtime.pendingProviderRegistrations = [];
		this.runtime.registerProvider = (name, config) => {
			if (providerActions?.registerProvider) {
				providerActions.registerProvider(name, config);
				return;
			}
			this.modelRegistry.registerProvider(name, config);
		};
		this.runtime.unregisterProvider = (name) => {
			if (providerActions?.unregisterProvider) {
				providerActions.unregisterProvider(name);
				return;
			}
			this.modelRegistry.unregisterProvider(name);
		};
	}
	bindCommandContext(actions) {
		if (actions) {
			this.waitForIdleFn = actions.waitForIdle;
			this.newSessionHandler = actions.newSession;
			this.forkHandler = actions.fork;
			this.navigateTreeHandler = actions.navigateTree;
			this.switchSessionHandler = actions.switchSession;
			this.reloadHandler = actions.reload;
			return;
		}
		this.waitForIdleFn = async () => {};
		this.newSessionHandler = async () => ({ cancelled: false });
		this.forkHandler = async () => ({ cancelled: false });
		this.navigateTreeHandler = async () => ({ cancelled: false });
		this.switchSessionHandler = async () => ({ cancelled: false });
		this.reloadHandler = async () => {};
	}
	setUIContext(uiContext) {
		this.uiContext = uiContext ?? noOpUIContext;
	}
	getUIContext() {
		return this.uiContext;
	}
	hasUI() {
		return this.uiContext !== noOpUIContext;
	}
	getExtensionPaths() {
		return this.extensions.map((e) => e.path);
	}
	/** Get all registered tools from all extensions (first registration per name wins). */
	getAllRegisteredTools() {
		const toolsByName = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const tool of ext.tools.values()) if (!toolsByName.has(tool.definition.name)) toolsByName.set(tool.definition.name, tool);
		return Array.from(toolsByName.values());
	}
	/** Get a tool definition by name. Returns undefined if not found. */
	getToolDefinition(toolName) {
		for (const ext of this.extensions) {
			const tool = ext.tools.get(toolName);
			if (tool) return tool.definition;
		}
	}
	getFlags() {
		const allFlags = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const [name, flag] of ext.flags) if (!allFlags.has(name)) allFlags.set(name, flag);
		return allFlags;
	}
	setFlagValue(name, value) {
		this.runtime.flagValues.set(name, value);
	}
	getFlagValues() {
		return new Map(this.runtime.flagValues);
	}
	getShortcuts(resolvedKeybindings) {
		this.shortcutDiagnostics = [];
		const builtinKeybindings = buildBuiltinKeybindings(resolvedKeybindings);
		const extensionShortcuts = /* @__PURE__ */ new Map();
		const addDiagnostic = (message, extensionPath) => {
			this.shortcutDiagnostics.push({
				type: "warning",
				message,
				path: extensionPath
			});
			if (!this.hasUI()) console.warn(message);
		};
		for (const ext of this.extensions) for (const [key, shortcut] of ext.shortcuts) {
			const normalizedKey = key.toLowerCase();
			const builtInKeybinding = builtinKeybindings[normalizedKey];
			if (builtInKeybinding?.restrictOverride === true) {
				addDiagnostic(`Extension shortcut '${key}' from ${shortcut.extensionPath} conflicts with built-in shortcut. Skipping.`, shortcut.extensionPath);
				continue;
			}
			if (builtInKeybinding?.restrictOverride === false) addDiagnostic(`Extension shortcut conflict: '${key}' is built-in shortcut for ${builtInKeybinding.keybinding} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`, shortcut.extensionPath);
			const existingExtensionShortcut = extensionShortcuts.get(normalizedKey);
			if (existingExtensionShortcut) addDiagnostic(`Extension shortcut conflict: '${key}' registered by both ${existingExtensionShortcut.extensionPath} and ${shortcut.extensionPath}. Using ${shortcut.extensionPath}.`, shortcut.extensionPath);
			extensionShortcuts.set(normalizedKey, shortcut);
		}
		return extensionShortcuts;
	}
	getShortcutDiagnostics() {
		return this.shortcutDiagnostics;
	}
	invalidate(message = "This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().") {
		if (!this.staleMessage) {
			this.staleMessage = message;
			this.runtime.invalidate(message);
		}
	}
	assertActive() {
		if (this.staleMessage) throw new Error(this.staleMessage);
		this.runtime.assertActive();
	}
	onError(listener) {
		this.errorListeners.add(listener);
		return () => this.errorListeners.delete(listener);
	}
	emitError(error) {
		for (const listener of this.errorListeners) listener(error);
	}
	hasHandlers(eventType) {
		for (const ext of this.extensions) {
			const handlers = ext.handlers.get(eventType);
			if (handlers && handlers.length > 0) return true;
		}
		return false;
	}
	getMessageRenderer(customType) {
		for (const ext of this.extensions) {
			const renderer = ext.messageRenderers.get(customType);
			if (renderer) return renderer;
		}
	}
	resolveRegisteredCommands() {
		const commands = [];
		const counts = /* @__PURE__ */ new Map();
		for (const ext of this.extensions) for (const command of ext.commands.values()) {
			commands.push(command);
			counts.set(command.name, (counts.get(command.name) ?? 0) + 1);
		}
		const seen = /* @__PURE__ */ new Map();
		const takenInvocationNames = /* @__PURE__ */ new Set();
		return commands.map((command) => {
			const occurrence = (seen.get(command.name) ?? 0) + 1;
			seen.set(command.name, occurrence);
			let invocationName = (counts.get(command.name) ?? 0) > 1 ? `${command.name}:${occurrence}` : command.name;
			if (takenInvocationNames.has(invocationName)) {
				let suffix = occurrence;
				do {
					suffix++;
					invocationName = `${command.name}:${suffix}`;
				} while (takenInvocationNames.has(invocationName));
			}
			takenInvocationNames.add(invocationName);
			return Object.assign({}, command, { invocationName });
		});
	}
	getRegisteredCommands() {
		this.commandDiagnostics = [];
		return this.resolveRegisteredCommands();
	}
	getCommandDiagnostics() {
		return this.commandDiagnostics;
	}
	getCommand(name) {
		return this.resolveRegisteredCommands().find((command) => command.invocationName === name);
	}
	/**
	* Request a graceful shutdown. Called by extension tools and event handlers.
	* The actual shutdown behavior is provided by the mode via bindExtensions().
	*/
	shutdown() {
		this.shutdownHandler();
	}
	/**
	* Create an ExtensionContext for use in event handlers and tool execution.
	* Context values are resolved at call time, so changes via bindCore/bindUI are reflected.
	*/
	createContext() {
		const requireActiveRunner = () => {
			this.assertActive();
			return this;
		};
		const getModel = this.getModel;
		return {
			get ui() {
				return requireActiveRunner().uiContext;
			},
			get hasUI() {
				return requireActiveRunner().hasUI();
			},
			get cwd() {
				return requireActiveRunner().cwd;
			},
			get sessionManager() {
				return requireActiveRunner().sessionManager;
			},
			get modelRegistry() {
				return requireActiveRunner().modelRegistry;
			},
			get model() {
				requireActiveRunner();
				return getModel();
			},
			isIdle: () => requireActiveRunner().isIdleFn(),
			get signal() {
				return requireActiveRunner().getSignalFn();
			},
			abort: () => requireActiveRunner().abortFn(),
			hasPendingMessages: () => requireActiveRunner().hasPendingMessagesFn(),
			shutdown: () => requireActiveRunner().shutdownHandler(),
			getContextUsage: () => requireActiveRunner().getContextUsageFn(),
			compact: (options) => requireActiveRunner().compactFn(options),
			getSystemPrompt: () => requireActiveRunner().getSystemPromptFn()
		};
	}
	createCommandContext() {
		return Object.assign(this.createContext(), {
			waitForIdle: () => {
				this.assertActive();
				return this.waitForIdleFn();
			},
			newSession: (options) => {
				this.assertActive();
				return this.newSessionHandler(options);
			},
			fork: (entryId, options) => {
				this.assertActive();
				return this.forkHandler(entryId, options);
			},
			navigateTree: (targetId, options) => {
				this.assertActive();
				return this.navigateTreeHandler(targetId, options);
			},
			switchSession: (sessionPath, options) => {
				this.assertActive();
				return this.switchSessionHandler(sessionPath, options);
			},
			reload: () => {
				this.assertActive();
				return this.reloadHandler();
			}
		});
	}
	isSessionBeforeEvent(event) {
		return event.type === "session_before_switch" || event.type === "session_before_fork" || event.type === "session_before_compact" || event.type === "session_before_tree";
	}
	async dispatchHandlers(eventType, invoke, ctx) {
		let handlerContext = ctx;
		for (const ext of this.extensions) for (const handler of ext.handlers.get(eventType) ?? []) {
			handlerContext ??= this.createContext();
			try {
				const result = await invoke(handler, handlerContext, ext.path);
				if (result !== void 0) return result;
			} catch (err) {
				reportExtensionHandlerError(err, ext.path, eventType, (error) => this.emitError(error));
			}
		}
	}
	async emit(event) {
		let result;
		return await this.dispatchHandlers(event.type, async (handler, ctx) => {
			const handlerResult = await handler(event, ctx);
			if (this.isSessionBeforeEvent(event) && handlerResult) {
				result = handlerResult;
				if (result.cancel) return result;
			}
		}) ?? result;
	}
	async emitMessageEnd(event) {
		let currentMessage = event.message;
		let modified = false;
		await this.dispatchHandlers("message_end", async (handler, ctx, extensionPath) => {
			const handlerResult = await handler({
				...event,
				message: currentMessage
			}, ctx);
			if (handlerResult?.message) {
				if (handlerResult.message.role !== currentMessage.role) this.emitError({
					extensionPath,
					event: "message_end",
					error: "message_end handlers must return a message with the same role"
				});
				else {
					currentMessage = handlerResult.message;
					modified = true;
				}
			}
		});
		return modified ? currentMessage : void 0;
	}
	async emitToolResult(event) {
		const currentEvent = { ...event };
		let modified = false;
		await this.dispatchHandlers("tool_result", async (handler, ctx) => {
			const handlerResult = await handler(currentEvent, ctx);
			if (handlerResult?.content !== void 0) {
				currentEvent.content = handlerResult.content;
				modified = true;
			}
			if (handlerResult?.details !== void 0) {
				currentEvent.details = handlerResult.details;
				modified = true;
			}
			if (handlerResult?.isError !== void 0 || isToolResultError(handlerResult)) {
				currentEvent.isError = handlerResult?.isError ?? true;
				modified = true;
			}
			if (handlerResult?.terminate !== void 0) {
				currentEvent.terminate = handlerResult.terminate;
				modified = true;
			}
		});
		if (!modified) return;
		return {
			content: currentEvent.content,
			details: currentEvent.details,
			isError: currentEvent.isError,
			terminate: currentEvent.terminate
		};
	}
	async emitToolCall(event) {
		let ctx;
		let result;
		for (const ext of this.extensions) {
			const handlers = ext.handlers.get("tool_call");
			if (!handlers || handlers.length === 0) continue;
			for (const handler of handlers) {
				ctx ??= this.createContext();
				const handlerResult = await handler(event, ctx);
				if (handlerResult) {
					result = handlerResult;
					if (result.block) return result;
				}
			}
		}
		return result;
	}
	async emitUserBash(event) {
		return await this.dispatchHandlers("user_bash", async (handler, ctx) => {
			const handlerResult = await handler(event, ctx);
			return handlerResult ? handlerResult : void 0;
		});
	}
	async emitContext(messages) {
		if (!this.hasHandlers("context")) return messages;
		let currentMessages = structuredClone(messages);
		await this.dispatchHandlers("context", async (handler, ctx) => {
			const handlerResult = await handler({
				type: "context",
				messages: currentMessages
			}, ctx);
			if (handlerResult?.messages) currentMessages = handlerResult.messages;
		});
		return currentMessages;
	}
	async emitBeforeProviderRequest(payload) {
		let currentPayload = payload;
		await this.dispatchHandlers("before_provider_request", async (handler, ctx) => {
			const handlerResult = await handler({
				type: "before_provider_request",
				payload: currentPayload
			}, ctx);
			if (handlerResult !== void 0) currentPayload = handlerResult;
		});
		return currentPayload;
	}
	async emitBeforeAgentStart(prompt, images, systemPrompt, systemPromptOptions) {
		let currentSystemPrompt = systemPrompt;
		const ctx = this.createContext();
		ctx.getSystemPrompt = () => {
			this.assertActive();
			return currentSystemPrompt;
		};
		const messages = [];
		let systemPromptModified = false;
		await this.dispatchHandlers("before_agent_start", async (handler, handlerCtx) => {
			const handlerResult = await handler({
				type: "before_agent_start",
				prompt,
				images,
				systemPrompt: currentSystemPrompt,
				systemPromptOptions
			}, handlerCtx);
			if (handlerResult?.message) messages.push(handlerResult.message);
			if (handlerResult?.systemPrompt !== void 0) {
				currentSystemPrompt = handlerResult.systemPrompt;
				systemPromptModified = true;
			}
		}, ctx);
		if (messages.length > 0 || systemPromptModified) return {
			messages: messages.length > 0 ? messages : void 0,
			systemPrompt: systemPromptModified ? currentSystemPrompt : void 0
		};
	}
	async emitResourcesDiscover(cwd, reason) {
		const skillPaths = [];
		const promptPaths = [];
		const themePaths = [];
		await this.dispatchHandlers("resources_discover", async (handler, ctx, extensionPath) => {
			const result = await handler({
				type: "resources_discover",
				cwd,
				reason
			}, ctx);
			if (result?.skillPaths?.length) skillPaths.push(...result.skillPaths.map((path) => ({
				path,
				extensionPath
			})));
			if (result?.promptPaths?.length) promptPaths.push(...result.promptPaths.map((path) => ({
				path,
				extensionPath
			})));
			if (result?.themePaths?.length) themePaths.push(...result.themePaths.map((path) => ({
				path,
				extensionPath
			})));
		});
		return {
			skillPaths,
			promptPaths,
			themePaths
		};
	}
	/** Emit input event. Transforms chain, "handled" short-circuits. */
	async emitInput(text, images, source) {
		let currentText = text;
		let currentImages = images;
		const handled = await this.dispatchHandlers("input", async (handler, ctx) => {
			const result = await handler({
				type: "input",
				text: currentText,
				images: currentImages,
				source
			}, ctx);
			if (result?.action === "handled") return result;
			if (result?.action === "transform") {
				currentText = result.text;
				currentImages = result.images ?? currentImages;
			}
		});
		if (handled) return handled;
		return currentText !== text || currentImages !== images ? {
			action: "transform",
			text: currentText,
			images: currentImages
		} : { action: "continue" };
	}
};
//#endregion
//#region src/agents/sessions/queued-user-message-retirement.ts
const queuedUserMessageRetirements = /* @__PURE__ */ new WeakMap();
/** Binds one runtime message to the exact display entry created for it. */
function registerQueuedUserMessageRetirement(message, retire) {
	queuedUserMessageRetirements.set(message, retire);
}
/** Consumes the display retirement owned by this exact runtime message. */
function retireQueuedUserMessage(message) {
	const retire = queuedUserMessageRetirements.get(message);
	if (!retire) return false;
	queuedUserMessageRetirements.delete(message);
	return retire();
}
//#endregion
//#region src/agents/agent-hooks/session-manager-runtime-registry.ts
/** Creates a WeakMap-backed runtime registry keyed by SessionManager object identity. */
function createSessionManagerRuntimeRegistry() {
	const registry = /* @__PURE__ */ new WeakMap();
	const set = (sessionManager, value) => {
		if (!sessionManager || typeof sessionManager !== "object") return;
		const key = sessionManager;
		if (value === null) {
			registry.delete(key);
			return;
		}
		registry.set(key, value);
	};
	const get = (sessionManager) => {
		if (!sessionManager || typeof sessionManager !== "object") return null;
		return registry.get(sessionManager) ?? null;
	};
	return {
		set,
		get
	};
}
//#endregion
//#region src/agents/sessions/session-tool-result-redaction.ts
const preparers = createSessionManagerRuntimeRegistry();
/** Bind the guard's policy without extending the public SessionManager contract. */
function setSessionToolTextPreparer(sessionManager, prepare) {
	preparers.set(sessionManager, prepare);
}
function prepareSessionToolResult(sessionManager, event) {
	if (event.type !== "message_end" || event.message.role !== "toolResult") return false;
	const prepare = preparers.get(sessionManager) ?? prepareModelVisibleToolTextBlock;
	let changed = false;
	event.message.content = event.message.content.map((block) => {
		if (block.type !== "text") return block;
		const prepared = prepare(block);
		changed ||= prepared.text !== block.text;
		return prepared;
	});
	return changed;
}
//#endregion
//#region src/agents/sessions/steering-message-identity.ts
const STEERING_MESSAGE_IDENTITY = Symbol.for("testclaw.steeringMessageIdentity");
const steeringMessagePersistenceFailureListeners = /* @__PURE__ */ new Map();
function setSteeringMessageIdentity(message, identity) {
	if (identity) Object.defineProperty(message, STEERING_MESSAGE_IDENTITY, {
		configurable: true,
		value: identity
	});
}
function getSteeringMessageIdentity(message) {
	return message && typeof message === "object" ? message[STEERING_MESSAGE_IDENTITY] : void 0;
}
/** Keeps persistence failures private to the exact in-flight steering identity. */
function subscribeSteeringMessagePersistenceFailure(identity, listener) {
	const listeners = steeringMessagePersistenceFailureListeners.get(identity) ?? /* @__PURE__ */ new Set();
	listeners.add(listener);
	steeringMessagePersistenceFailureListeners.set(identity, listeners);
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && steeringMessagePersistenceFailureListeners.get(identity) === listeners) steeringMessagePersistenceFailureListeners.delete(identity);
	};
}
/** Rejects a queued receipt before a failed append can strand or acknowledge its source. */
function reportSteeringMessagePersistenceFailure(message, error) {
	const identity = getSteeringMessageIdentity(message);
	if (identity) steeringMessagePersistenceFailureListeners.get(identity)?.forEach((listener) => listener(error));
}
//#endregion
//#region src/shared/tilde-path.ts
/**
* Expands a leading `~` against the OS home dir, keeping relative inputs
* relative so callers can resolve them against their own base dir. Unlike
* `resolveHomeRelativePath`, `~name` is treated as `<home>/name` (shipped
* loader behavior for prompt/skill path lists).
*/
function expandTildePath(input) {
	const trimmed = input.trim();
	if (trimmed === "~") return homedir();
	if (trimmed.startsWith("~/")) return join(homedir(), trimmed.slice(2));
	if (trimmed.startsWith("~")) return join(homedir(), trimmed.slice(1));
	return trimmed;
}
//#endregion
//#region src/skills/loading/session.ts
/** Max name length per spec */
const MAX_NAME_LENGTH = 64;
/** Max description length per spec */
const MAX_DESCRIPTION_LENGTH = 1024;
/**
* Validate skill name per Agent Skills spec.
* Returns array of validation error messages (empty if valid).
*/
function validateName(name) {
	const errors = [];
	if (name.length > MAX_NAME_LENGTH) errors.push(`name exceeds ${MAX_NAME_LENGTH} characters (${name.length})`);
	if (!/^[a-z0-9-]+$/.test(name)) errors.push(`name contains invalid characters (must be lowercase a-z, 0-9, hyphens only)`);
	if (name.startsWith("-") || name.endsWith("-")) errors.push(`name must not start or end with a hyphen`);
	if (name.includes("--")) errors.push(`name must not contain consecutive hyphens`);
	return errors;
}
/**
* Validate description per Agent Skills spec.
*/
function validateDescription(description) {
	const errors = [];
	if (!description || description.trim() === "") errors.push("description is required");
	else if (description.length > MAX_DESCRIPTION_LENGTH) errors.push(`description exceeds ${MAX_DESCRIPTION_LENGTH} characters (${description.length})`);
	return errors;
}
function resolveSkillSourceOptions(source) {
	if (source === "user" || source === "project") return {
		source: "local",
		scope: source
	};
	return { source: source === "path" ? "local" : source };
}
function loadSkillsFromDirInternal(dir, source, includeRootFiles, ignoreMatcher, rootDir) {
	const skills = [];
	const diagnostics = [];
	if (!existsSync(dir)) return {
		skills,
		diagnostics
	};
	const root = rootDir ?? dir;
	const ig = addIgnoreRules(dir, root, ignoreMatcher);
	try {
		const entries = readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.name !== "SKILL.md") continue;
			const fullPath = join(dir, entry.name);
			let isFile = entry.isFile();
			if (entry.isSymbolicLink()) try {
				isFile = statSync(fullPath).isFile();
			} catch {
				continue;
			}
			const relPath = normalizeNativePathSeparators(relative(root, fullPath));
			if (!isFile || ig.ignores(relPath)) continue;
			const result = loadSkillFromFile(fullPath, source);
			if (result.skill) skills.push(result.skill);
			diagnostics.push(...result.diagnostics);
			return {
				skills,
				diagnostics
			};
		}
		for (const entry of entries) {
			if (entry.name.startsWith(".")) continue;
			if (entry.name === "node_modules") continue;
			const fullPath = join(dir, entry.name);
			let isDirectory = entry.isDirectory();
			let isFile = entry.isFile();
			if (entry.isSymbolicLink()) try {
				const stats = statSync(fullPath);
				isDirectory = stats.isDirectory();
				isFile = stats.isFile();
			} catch {
				continue;
			}
			const relPath = normalizeNativePathSeparators(relative(root, fullPath));
			const ignorePath = isDirectory ? `${relPath}/` : relPath;
			if (ig.ignores(ignorePath)) continue;
			if (isDirectory) {
				const subResult = loadSkillsFromDirInternal(fullPath, source, false, ig, root);
				skills.push(...subResult.skills);
				diagnostics.push(...subResult.diagnostics);
				continue;
			}
			if (!isFile || !includeRootFiles || !entry.name.endsWith(".md")) continue;
			const result = loadSkillFromFile(fullPath, source);
			if (result.skill) skills.push(result.skill);
			diagnostics.push(...result.diagnostics);
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to scan skill directory";
		diagnostics.push({
			type: "warning",
			message,
			path: dir
		});
	}
	return {
		skills,
		diagnostics
	};
}
function loadSkillFromFile(filePath, source) {
	const diagnostics = [];
	try {
		const rawContent = readFileSync(filePath, "utf-8");
		const frontmatter = parseSkillFrontmatter(rawContent);
		const skillDir = dirname(filePath);
		const parentDirName = basename(skillDir);
		const descErrors = validateDescription(frontmatter.description);
		for (const error of descErrors) diagnostics.push({
			type: "warning",
			message: error,
			path: filePath
		});
		const name = frontmatter.name || parentDirName;
		const nameErrors = validateName(name);
		for (const error of nameErrors) diagnostics.push({
			type: "warning",
			message: error,
			path: filePath
		});
		if (!frontmatter.description || frontmatter.description.trim() === "") return {
			skill: null,
			diagnostics
		};
		return {
			skill: materializeSkill({
				content: rawContent,
				frontmatter,
				name,
				description: frontmatter.description,
				filePath,
				baseDir: skillDir,
				source,
				sourceOptions: resolveSkillSourceOptions(source)
			}),
			diagnostics
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : "failed to parse skill file";
		diagnostics.push({
			type: "warning",
			message,
			path: filePath
		});
		return {
			skill: null,
			diagnostics
		};
	}
}
/**
* Format skills for inclusion in a system prompt.
* Uses XML format per Agent Skills standard.
* See: https://agentskills.io/integrate-skills
*
* Skills with disableModelInvocation=true are excluded from the prompt
* (they can only be invoked explicitly via /skill:name commands).
*/
function formatSkillsForPrompt(skills) {
	const visibleSkills = skills.filter((s) => !s.disableModelInvocation);
	return formatSkillsForPromptBounded({ skills: visibleSkills });
}
function resolveSkillPath(p, cwd) {
	const normalized = expandTildePath(p);
	return isAbsolute(normalized) ? normalized : resolve(cwd, normalized);
}
/**
* Load skills from all configured locations.
* Returns skills and any validation diagnostics.
*/
function loadSkills(options) {
	const { cwd, agentDir, skillPaths, includeDefaults } = options;
	const resolvedAgentDir = agentDir ?? getAgentDir();
	const skillMap = /* @__PURE__ */ new Map();
	const realPathSet = /* @__PURE__ */ new Set();
	const allDiagnostics = [];
	const collisionDiagnostics = [];
	function addSkills(result) {
		allDiagnostics.push(...result.diagnostics);
		for (const skill of result.skills) {
			const realPath = canonicalizePath(skill.filePath);
			if (realPathSet.has(realPath)) continue;
			const existing = skillMap.get(skill.name);
			if (existing) collisionDiagnostics.push({
				type: "collision",
				message: `name "${skill.name}" collision`,
				path: skill.filePath,
				collision: {
					resourceType: "skill",
					name: skill.name,
					winnerPath: existing.filePath,
					loserPath: skill.filePath
				}
			});
			else {
				skillMap.set(skill.name, skill);
				realPathSet.add(realPath);
			}
		}
	}
	if (includeDefaults) {
		addSkills(loadSkillsFromDirInternal(join(resolvedAgentDir, "skills"), "user", true));
		addSkills(loadSkillsFromDirInternal(resolve(cwd, CONFIG_DIR_NAME, "skills"), "project", true));
	}
	const userSkillsDir = join(resolvedAgentDir, "skills");
	const projectSkillsDir = resolve(cwd, CONFIG_DIR_NAME, "skills");
	const getSource = (resolvedPath) => {
		if (!includeDefaults) {
			if (isPathInside(userSkillsDir, resolvedPath)) return "user";
			if (isPathInside(projectSkillsDir, resolvedPath)) return "project";
		}
		return "path";
	};
	for (const rawPath of skillPaths) {
		const resolvedPath = resolveSkillPath(rawPath, cwd);
		if (!existsSync(resolvedPath)) {
			allDiagnostics.push({
				type: "warning",
				message: "skill path does not exist",
				path: resolvedPath
			});
			continue;
		}
		try {
			const stats = statSync(resolvedPath);
			const source = getSource(resolvedPath);
			if (stats.isDirectory()) addSkills(loadSkillsFromDirInternal(resolvedPath, source, true));
			else if (stats.isFile() && resolvedPath.endsWith(".md")) {
				const result = loadSkillFromFile(resolvedPath, source);
				if (result.skill) addSkills({
					skills: [result.skill],
					diagnostics: result.diagnostics
				});
				else allDiagnostics.push(...result.diagnostics);
			} else allDiagnostics.push({
				type: "warning",
				message: "skill path is not a markdown file",
				path: resolvedPath
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to read skill path";
			allDiagnostics.push({
				type: "warning",
				message,
				path: resolvedPath
			});
		}
	}
	return {
		skills: Array.from(skillMap.values()),
		diagnostics: [...allDiagnostics, ...collisionDiagnostics]
	};
}
//#endregion
//#region src/agents/promised-work-prompt.ts
/**
* STUB (testclaw): секция ## Promised Work вырезана.
* Оригинал: src/agents/promised-work-prompt.ts
*/
function buildPromisedWorkPromptSection() {
	return [];
}
//#endregion
//#region src/agents/sessions/system-prompt.ts
/**
* System prompt construction and project context loading
*/
/** Build the system prompt with tools, guidelines, and context */
function buildSystemPrompt(options) {
	const { customPrompt, selectedTools, toolSnippets, promptGuidelines, appendSystemPrompt, cwd, contextFiles: providedContextFiles, skills: providedSkills } = options;
	const promptCwd = cwd.replace(/\\/g, "/");
	const now = /* @__PURE__ */ new Date();
	const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	const appendSection = appendSystemPrompt ? `\n\n${appendSystemPrompt}` : "";
	const contextFiles = providedContextFiles ?? [];
	const skills = providedSkills ?? [];
	let prompt = customPrompt;
	let hasRead = false;
	if (!prompt) {
		const readmePath = getReadmePath();
		const docsPath = getDocsPath();
		const examplesPath = getExamplesPath();
		const tools = selectedTools || [
			"read",
			"bash",
			"edit",
			"write"
		];
		const visibleTools = tools.filter((name) => Boolean(toolSnippets?.[name]));
		const toolsList = visibleTools.length > 0 ? visibleTools.map((name) => `- ${name}: ${toolSnippets[name]}`).join("\n") : "(none)";
		const guidelinesList = [];
		const guidelinesSet = /* @__PURE__ */ new Set();
		const addGuideline = (guideline) => {
			if (guidelinesSet.has(guideline)) return;
			guidelinesSet.add(guideline);
			guidelinesList.push(guideline);
		};
		const hasBash = tools.includes("bash");
		const hasGrep = tools.includes("grep");
		const hasFind = tools.includes("find");
		const hasLs = tools.includes("ls");
		hasRead = tools.includes("read");
		if (hasBash && !hasGrep && !hasFind && !hasLs) addGuideline("Use bash for file operations like ls, rg, find");
		else if (hasBash && (hasGrep || hasFind || hasLs)) addGuideline("Prefer grep/find/ls tools over bash for file exploration (faster, respects .gitignore)");
		for (const guideline of promptGuidelines ?? []) {
			const normalized = guideline.trim();
			if (normalized.length > 0) addGuideline(normalized);
		}
		addGuideline("Be concise in your responses");
		addGuideline("Show file paths clearly when working with files");
		prompt = ` `;
	}
	if (appendSection) prompt += appendSection;
	if (contextFiles.length > 0) {
		prompt += "\n\n<project_context>\n\n";
		prompt += "Project-specific instructions and guidelines:\n\n";
		for (const { path: filePath, content } of contextFiles) prompt += `<project_instructions path="${filePath}">\n${content}\n</project_instructions>\n\n`;
		prompt += "</project_context>\n";
	}
	if (customPrompt) hasRead = !selectedTools || selectedTools.includes("read");
	if (hasRead && skills.length > 0) prompt += formatSkillsForPrompt(skills);
	prompt += `\nCurrent date: ${date}`;
		return prompt;
}
//#endregion
//#region src/agents/sessions/agent-session-base.ts
const log = createSubsystemLogger("agents/session");
var AgentSessionBase = class {
	constructor(config) {
		this.eventListeners = [];
		this.steeringMessages = [];
		this.followUpMessages = [];
		this.pendingNextTurnMessages = [];
		this.compactionAbortController = void 0;
		this.autoCompactionAbortController = void 0;
		this.overflowRecoveryAttempts = 0;
		this.branchSummaryAbortController = void 0;
		this.extensionModifiedToolResultIds = /* @__PURE__ */ new Set();
		this.retryAbortController = void 0;
		this.retryCount = 0;
		this.turnIndex = 0;
		this.baseToolDefinitions = /* @__PURE__ */ new Map();
		this.toolRegistry = /* @__PURE__ */ new Map();
		this.toolDefinitions = /* @__PURE__ */ new Map();
		this.toolPromptSnippets = /* @__PURE__ */ new Map();
		this.toolPromptGuidelines = /* @__PURE__ */ new Map();
		this.baseSystemPrompt = "";
		this.lastAssistantMessage = void 0;
		this.lastRunEndedForTurnHandoff = false;
		this.handleAgentEvent = async (event, signal) => {
			if (event.type === "agent_end") {
				const reason = signal?.reason;
				this.lastRunEndedForTurnHandoff = signal?.aborted === true && typeof reason === "object" && reason !== null && reason.turnHandoff === true;
			}
			if (this.eventMayWriteSession(event)) {
				await this.runWithSessionWriteSettlement(async () => await this.handleAgentEventUnlocked(event));
				prepareSessionToolResult(this.sessionManager, event);
				return;
			}
			await this.handleAgentEventUnlocked(event);
		};
		this.agent = config.agent;
		this.sessionManager = config.sessionManager;
		this.settingsManager = config.settingsManager;
		this.sessionResourceLoader = config.resourceLoader;
		this.customTools = config.customTools ?? [];
		this.cwd = config.cwd;
		this.sessionModelRegistry = config.modelRegistry;
		this.extensionRunnerRef = config.extensionRunnerRef;
		this.initialActiveToolNames = config.initialActiveToolNames;
		this.allowedToolNames = config.allowedToolNames ? new Set(config.allowedToolNames) : void 0;
		this.disableBuiltInTools = config.disableBuiltInTools === true;
		this.baseToolsOverride = config.baseToolsOverride;
		this.sessionStartEvent = config.sessionStartEvent ?? {
			type: "session_start",
			reason: "startup"
		};
		this.withExternalSessionWriteSettlement = config.withSessionWriteSettlement;
		this.contextOverflowRecoveryOwner = config.contextOverflowRecoveryOwner ?? "session";
		this.cleanupProviderSessionResourcesOnDispose = config.cleanupProviderSessionResourcesOnDispose ?? true;
	}
	/** Model registry for API key resolution and model discovery */
	get modelRegistry() {
		return this.sessionModelRegistry;
	}
	async getRequiredRequestAuth(model) {
		const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
		if (!result.ok) {
			if (result.error.startsWith("No API key found")) throw new Error(formatNoApiKeyFoundMessage(model.provider));
			throw new Error(result.error);
		}
		if (result.apiKey) return {
			apiKey: result.apiKey,
			headers: result.headers
		};
		if (this.sessionModelRegistry.isUsingOAuth(model)) throw new Error(`Authentication failed for "${model.provider}". Credentials may have expired or network is unavailable. Run '/login ${model.provider}' to re-authenticate.`);
		throw new Error(formatNoApiKeyFoundMessage(model.provider));
	}
	async getCompactionRequestAuth(model) {
		if (getStreamLlmRuntime(this.agent.streamFn) === getModelRegistryRuntime(this.sessionModelRegistry).llmRuntime) return this.getRequiredRequestAuth(model);
		const result = await this.sessionModelRegistry.getApiKeyAndHeaders(model);
		return result.ok ? {
			apiKey: result.apiKey,
			headers: result.headers
		} : {};
	}
	async runWithSessionWriteSettlement(run) {
		return this.withExternalSessionWriteSettlement ? await this.withExternalSessionWriteSettlement(run) : await run();
	}
	eventMayWriteSession(event) {
		return event.type === "message_end" || this.currentExtensionRunner.hasHandlers(event.type);
	}
	/**
	* Install tool hooks once on the Agent instance.
	*
	* The callbacks read `this.currentExtensionRunner` at execution time, so extension reload swaps in the
	* new runner without reinstalling hooks. Extension-specific tool wrappers are still used to adapt
	* registered tool execution to the extension context. Tool call and tool result interception now
	* happens here instead of in wrappers.
	*/
	installAgentToolHooks() {
		this.agent.beforeToolCall = async ({ toolCall, args }) => {
			const runner = this.currentExtensionRunner;
			return await this.runWithSessionWriteSettlement(async () => {
				if (!runner.hasHandlers("tool_call")) return;
				try {
					return await runner.emitToolCall({
						type: "tool_call",
						toolName: toolCall.name,
						toolCallId: toolCall.id,
						input: args
					});
				} catch (err) {
					if (err instanceof Error) throw err;
					throw new Error(`Extension failed, blocking execution: ${String(err)}`, { cause: err });
				}
			});
		};
		this.agent.afterToolCall = async ({ toolCall, args, result, isError }) => {
			const resultIsError = isError || isToolResultError(result);
			const runner = this.currentExtensionRunner;
			if (!runner.hasHandlers("tool_result")) return { isError: resultIsError };
			const hookResult = await this.runWithSessionWriteSettlement(async () => await runner.emitToolResult({
				type: "tool_result",
				toolName: toolCall.name,
				toolCallId: toolCall.id,
				input: args,
				content: result.content,
				details: result.details,
				isError: resultIsError,
				...result.terminate !== void 0 ? { terminate: result.terminate } : {}
			}));
			if (hookResult) this.extensionModifiedToolResultIds.add(toolCall.id);
			return {
				...hookResult,
				isError: hookResult?.isError ?? resultIsError
			};
		};
		this.agent.afterToolOutcome = async ({ executionStarted, result, isError }) => executionStarted ? void 0 : { isError: isError || isToolResultError(result) };
	}
	/** Copy-on-write listener registration keeps dispatch stable without per-event snapshots. */
	emit(event) {
		for (const l of this.eventListeners) l(event);
	}
	/** Terminal listeners form a barrier before retry, compaction, or queue draining. */
	async emitTerminal(event) {
		const listeners = this.eventListeners;
		for (const listener of listeners) try {
			await listener(event);
		} catch (error) {
			log.warn(`agent_end listener failed: ${String(error)}`);
		}
	}
	emitQueueUpdate() {
		this.emit({
			type: "queue_update",
			steering: this.steeringMessages.map((entry) => entry.text),
			followUp: this.followUpMessages.map((entry) => entry.text)
		});
	}
	trackQueuedUserMessage(message, owner, text) {
		const queue = owner === "steering" ? this.steeringMessages : this.followUpMessages;
		const entry = { text };
		queue.push(entry);
		registerQueuedUserMessageRetirement(message, () => {
			if (queue !== this.steeringMessages && queue !== this.followUpMessages) return false;
			const queueIndex = queue.indexOf(entry);
			if (queueIndex === -1) return false;
			queue.splice(queueIndex, 1);
			this.emitQueueUpdate();
			return true;
		});
		this.emitQueueUpdate();
	}
	async handleAgentEventUnlocked(event) {
		if (event.type === "agent_start") this.lastAssistantEntryId = void 0;
		if (event.type === "message_start" && event.message.role === "user") {
			this.overflowRecoveryAttempts = 0;
			retireQueuedUserMessage(event.message);
		}
		const sourceSlots = event.type === "message_end" ? takeCodeModeResponseSource(event.message) : void 0;
		let messageChanged = await this.emitExtensionEvent(event);
		messageChanged = prepareSessionToolResult(this.sessionManager, event) || messageChanged;
		const publishAfterPersistence = event.type === "message_end" && event.message.role === "user";
		if (event.type === "agent_end") await this.emitTerminal({
			...event,
			willRetry: this.willRetryAfterAgentEnd(event),
			...this.lastAssistantEntryId ? { assistantEntryId: this.lastAssistantEntryId } : {}
		});
		else if (!publishAfterPersistence) this.emit(event);
		messageChanged = prepareSessionToolResult(this.sessionManager, event) || messageChanged;
		if (event.type === "message_end") {
			if (event.message.role === "custom") {
				const message = event.message;
				await withSessionManagerWrite(this.sessionManager, () => this.sessionManager.appendCustomMessageEntry(message.customType, message.content, message.display, message.details));
			} else if (event.message.role === "user" || event.message.role === "assistant" || event.message.role === "toolResult") {
				const toolResultChangedByExtension = event.message.role === "toolResult" && this.extensionModifiedToolResultIds.delete(event.message.toolCallId);
				try {
					const entryId = await persistAgentSessionMessage(this.sessionManager, event.message, {
						invalidateSerializedPrefixCache: messageChanged || toolResultChangedByExtension,
						sourceAppend: sourceSlots
					});
					if (event.message.role === "assistant") this.lastAssistantEntryId = entryId;
				} catch (error) {
					if (event.message.role === "user") reportSteeringMessagePersistenceFailure(event.message, error);
					throw error;
				}
				if (event.message.role === "user") this.emit(event);
			}
			if (event.message.role === "assistant") this.lastAssistantMessage = event.message;
		}
		if (event.type === "turn_end" && event.message.role === "assistant") {
			const assistantMsg = event.message;
			if (assistantMsg.stopReason !== "error" && assistantMsg.stopReason !== "length") this.overflowRecoveryAttempts = 0;
			if (assistantMsg.stopReason !== "error" && this.retryCount > 0) {
				this.emit({
					type: "auto_retry_end",
					success: assistantMsg.stopReason !== "aborted",
					attempt: this.retryCount,
					...assistantMsg.stopReason === "aborted" ? { finalError: assistantMsg.errorMessage } : {}
				});
				this.retryCount = 0;
			}
		}
	}
	willRetryAfterAgentEnd(event) {
		const settings = this.settingsManager.getRetrySettings();
		if (!settings.enabled || this.retryCount >= settings.maxRetries) return false;
		const lastAssistant = event.messages.findLast((message) => message.role === "assistant");
		return lastAssistant !== void 0 && this.isRetryableError(lastAssistant);
	}
	/** Find the last assistant message in agent state (including aborted ones) */
	findLastAssistantMessage() {
		return this.agent.state.messages.findLast((message) => message.role === "assistant");
	}
	/** Emit extension events based on agent events */
	async emitExtensionEvent(event) {
		if (event.type === "agent_start") {
			this.turnIndex = 0;
			await this.currentExtensionRunner.emit({ type: "agent_start" });
		} else if (event.type === "agent_end") await this.currentExtensionRunner.emit({
			type: "agent_end",
			messages: event.messages
		});
		else if (event.type === "turn_start") {
			const extensionEvent = {
				type: "turn_start",
				turnIndex: this.turnIndex,
				timestamp: Date.now()
			};
			await this.currentExtensionRunner.emit(extensionEvent);
		} else if (event.type === "turn_end") {
			const extensionEvent = {
				type: "turn_end",
				turnIndex: this.turnIndex,
				message: event.message,
				toolResults: event.toolResults
			};
			await this.currentExtensionRunner.emit(extensionEvent);
			this.turnIndex++;
		} else if (event.type === "message_start") {
			const extensionEvent = {
				type: "message_start",
				message: event.message
			};
			await this.currentExtensionRunner.emit(extensionEvent);
		} else if (event.type === "message_update") {
			const extensionEvent = {
				type: "message_update",
				message: event.message,
				assistantMessageEvent: event.assistantMessageEvent
			};
			await this.currentExtensionRunner.emit(extensionEvent);
		} else if (event.type === "message_end") {
			const extensionEvent = {
				type: "message_end",
				message: event.message
			};
			const replacement = await this.currentExtensionRunner.emitMessageEnd(extensionEvent);
			if (replacement) {
				replaceAgentMessageInPlace(event.message, replacement);
				return true;
			}
		} else if (event.type === "tool_execution_start") {
			const extensionEvent = {
				type: "tool_execution_start",
				toolCallId: event.toolCallId,
				toolName: event.toolName,
				args: event.args
			};
			await this.currentExtensionRunner.emit(extensionEvent);
		} else if (event.type === "tool_execution_update") {
			const extensionEvent = {
				type: "tool_execution_update",
				toolCallId: event.toolCallId,
				toolName: event.toolName,
				args: event.args,
				partialResult: event.partialResult
			};
			await this.currentExtensionRunner.emit(extensionEvent);
		} else if (event.type === "tool_execution_end") {
			const extensionEvent = {
				type: "tool_execution_end",
				toolCallId: event.toolCallId,
				toolName: event.toolName,
				result: event.result,
				isError: event.isError
			};
			await this.currentExtensionRunner.emit(extensionEvent);
		}
		return false;
	}
	/**
	* Subscribe to agent events.
	* Session persistence is handled internally (saves messages on message_end).
	* Multiple listeners can be added. Returns unsubscribe function for this listener.
	*/
	subscribe(listener) {
		this.eventListeners = [...this.eventListeners, listener];
		return () => {
			const index = this.eventListeners.indexOf(listener);
			if (index !== -1) this.eventListeners = this.eventListeners.toSpliced(index, 1);
		};
	}
	/**
	* Temporarily disconnect from agent events.
	* User listeners are preserved and will receive events again after resubscribe().
	* Used internally during operations that need to pause event processing.
	*/
	disconnectFromAgent() {
		if (this.unsubscribeAgent) {
			this.unsubscribeAgent();
			this.unsubscribeAgent = void 0;
		}
	}
	/**
	* Reconnect to agent events after disconnectFromAgent().
	* Preserves all existing listeners.
	*/
	reconnectToAgent() {
		if (this.unsubscribeAgent) return;
		this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
	}
	/**
	* Remove all listeners and disconnect from agent.
	* Call this when completely done with the session.
	*/
	dispose() {
		const abortOperations = [
			() => this.abortRetry(),
			() => this.abortCompaction(),
			() => this.abortBranchSummary(),
			() => this.agent.abort()
		];
		for (const abortOperation of abortOperations) try {
			abortOperation();
		} catch {}
		this.currentExtensionRunner.invalidate("This extension ctx is stale after session replacement or reload. Do not use a captured api or command ctx after ctx.newSession(), ctx.fork(), ctx.switchSession(), or ctx.reload(). For newSession, fork, and switchSession, move post-replacement work into withSession and use the ctx passed to withSession. For reload, do not use the old ctx after await ctx.reload().");
		this.disconnectFromAgent();
		this.eventListeners = [];
		if (this.cleanupProviderSessionResourcesOnDispose) cleanupSessionResources(this.sessionId);
	}
	/** Full agent state */
	get state() {
		return this.agent.state;
	}
	/** Current model (may be undefined if not yet selected) */
	get model() {
		return this.agent.state.model;
	}
	/** Current thinking level */
	get thinkingLevel() {
		return this.agent.state.thinkingLevel;
	}
	/** Whether agent is currently streaming a response */
	get isStreaming() {
		return this.agent.state.isStreaming;
	}
	/** Current effective system prompt (includes any per-turn extension modifications) */
	get systemPrompt() {
		return this.agent.state.systemPrompt;
	}
	/** Current retry attempt (0 if not retrying) */
	get retryAttempt() {
		return this.retryCount;
	}
	/**
	* Get the names of currently active tools.
	* Returns the names of tools currently set on the agent.
	*/
	getActiveToolNames() {
		return this.agent.state.tools.map((t) => t.name);
	}
	/**
	* Get all configured tools with name, description, parameter schema, and source metadata.
	*/
	getAllTools() {
		return Array.from(this.toolDefinitions.values()).map(({ definition, sourceInfo }) => ({
			name: definition.name,
			description: definition.description,
			parameters: definition.parameters,
			sourceInfo
		}));
	}
	getToolDefinition(name) {
		return this.toolDefinitions.get(name)?.definition;
	}
	/**
	* Set active tools by name.
	* Only tools in the registry can be enabled. Unknown tool names are ignored.
	* Also rebuilds the system prompt to reflect the new tool set.
	* Changes take effect on the next agent turn.
	*/
	setActiveToolsByName(toolNames) {
		const tools = [];
		const validToolNames = [];
		for (const name of toolNames) {
			const tool = this.toolRegistry.get(name);
			if (tool) {
				tools.push(tool);
				validToolNames.push(name);
			}
		}
		this.agent.state.tools = tools;
		this.baseSystemPrompt = this.rebuildSystemPrompt(validToolNames);
		this.agent.state.systemPrompt = this.systemPromptOverride ?? this.baseSystemPrompt;
	}
	/** Set an exact base prompt owned by the current runtime. */
	setBaseSystemPrompt(systemPrompt) {
		const { validToolNames, toolSnippets, promptGuidelines } = this.collectActiveToolPromptMetadata(this.getActiveToolNames());
		this.exactBaseSystemPrompt = systemPrompt;
		this.baseSystemPrompt = systemPrompt;
		this.baseSystemPromptOptions = {
			cwd: this.cwd,
			selectedTools: validToolNames,
			toolSnippets,
			promptGuidelines,
			customPrompt: systemPrompt
		};
		this.agent.state.systemPrompt = systemPrompt;
	}
	/** Whether compaction or branch summarization is currently running */
	get isCompacting() {
		return this.autoCompactionAbortController !== void 0 || this.compactionAbortController !== void 0 || this.branchSummaryAbortController !== void 0;
	}
	/** All messages including custom types like BashExecutionMessage */
	get messages() {
		return this.agent.state.messages;
	}
	/** Current steering mode */
	get steeringMode() {
		return this.agent.steeringMode;
	}
	/** Current follow-up mode */
	get followUpMode() {
		return this.agent.followUpMode;
	}
	/** Current persisted transcript target, or undefined for in-memory sessions. */
	get sessionTarget() {
		return this.sessionManager.getSessionTarget();
	}
	/** Current persisted session key, or undefined for in-memory sessions. */
	get sessionKey() {
		return this.sessionTarget?.sessionKey;
	}
	/** @deprecated Compatibility token; returns the session key, not a file path. */
	get sessionFile() {
		return this.sessionKey;
	}
	/** Current session ID */
	get sessionId() {
		return this.sessionManager.getSessionId();
	}
	/** Current session display name, if set */
	get sessionName() {
		return this.sessionManager.getSessionName();
	}
	/** File-based prompt templates */
	get promptTemplates() {
		return this.sessionResourceLoader.getPrompts().prompts;
	}
	normalizePromptSnippet(text) {
		if (!text) return;
		const oneLine = text.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
		return oneLine.length > 0 ? oneLine : void 0;
	}
	normalizePromptGuidelines(guidelines) {
		if (!guidelines || guidelines.length === 0) return [];
		const unique = /* @__PURE__ */ new Set();
		for (const guideline of guidelines) {
			const normalized = guideline.trim();
			if (normalized.length > 0) unique.add(normalized);
		}
		return Array.from(unique);
	}
	collectActiveToolPromptMetadata(toolNames) {
		const validToolNames = toolNames.filter((name) => this.toolRegistry.has(name));
		const toolSnippets = {};
		const promptGuidelines = [];
		for (const name of validToolNames) {
			const snippet = this.toolPromptSnippets.get(name);
			if (snippet) toolSnippets[name] = snippet;
			const toolGuidelines = this.toolPromptGuidelines.get(name);
			if (toolGuidelines) promptGuidelines.push(...toolGuidelines);
		}
		return {
			validToolNames,
			toolSnippets,
			promptGuidelines
		};
	}
	rebuildSystemPrompt(toolNames) {
		const { validToolNames, toolSnippets, promptGuidelines } = this.collectActiveToolPromptMetadata(toolNames);
		if (this.exactBaseSystemPrompt !== void 0) {
			this.baseSystemPromptOptions = {
				...this.baseSystemPromptOptions,
				cwd: this.cwd,
				customPrompt: this.exactBaseSystemPrompt,
				selectedTools: validToolNames,
				toolSnippets,
				promptGuidelines
			};
			return this.exactBaseSystemPrompt;
		}
		const loaderSystemPrompt = this.sessionResourceLoader.getSystemPrompt();
		const loaderAppendSystemPrompt = this.sessionResourceLoader.getAppendSystemPrompt();
		const appendSystemPrompt = loaderAppendSystemPrompt.length > 0 ? loaderAppendSystemPrompt.join("\n\n") : void 0;
		const loadedSkills = this.sessionResourceLoader.getSkills().skills;
		const loadedContextFiles = this.sessionResourceLoader.getAgentsFiles().agentsFiles;
		this.baseSystemPromptOptions = {
			cwd: this.cwd,
			skills: loadedSkills,
			contextFiles: loadedContextFiles,
			customPrompt: loaderSystemPrompt,
			appendSystemPrompt,
			selectedTools: validToolNames,
			toolSnippets,
			promptGuidelines
		};
		return buildSystemPrompt(this.baseSystemPromptOptions);
	}
};
//#endregion
//#region src/agents/sessions/compaction/request-budget.ts
const promptRequestBudgets = /* @__PURE__ */ new WeakMap();
/** Bind prepared foreground facts to the exact owned prompt invocation, outside public options. */
function attachPromptCompactionRequestBudget(options, budget) {
	if (budget) promptRequestBudgets.set(options, budget);
}
function takePromptCompactionRequestBudget(options) {
	if (!options) return;
	const budget = promptRequestBudgets.get(options);
	promptRequestBudgets.delete(options);
	return budget;
}
function createCompactionRequestBudget(params) {
	const estimateTokens = createFreshLlmBoundaryTokenEstimator(params);
	const fixedTokens = estimateTokens({
		messages: [],
		prompt: ""
	});
	const pendingUserTokens = (params.pendingPrompt ?? "") === "" && (params.pendingImageCount ?? 0) === 0 ? 0 : estimateTokens({
		messages: [],
		prompt: params.pendingPrompt ?? "",
		imageCount: params.pendingImageCount
	}) - fixedTokens;
	const pendingQueuedContextTokens = estimateCompactionHistoryTokens(params.pendingQueuedContextMessages ?? []);
	const additionalContextTokens = estimateCompactionHistoryTokens(params.pendingContextMessages ?? []) + pendingQueuedContextTokens;
	let additiveTokens = 0;
	if (params.pendingAdditivePrompt) {
		const estimateAdditiveTokens = createFreshLlmBoundaryTokenEstimator({});
		additiveTokens = estimateAdditiveTokens({
			messages: [],
			prompt: params.pendingAdditivePrompt
		}) - estimateAdditiveTokens({
			messages: [],
			prompt: ""
		});
	}
	return {
		contextWindow: params.contextWindow,
		reserveTokens: params.reserveTokens,
		fixedTokens,
		pendingUserIdempotencyKey: params.pendingUserIdempotencyKey,
		pendingTokens: pendingUserTokens + additionalContextTokens,
		pendingQueuedContextTokens,
		...additionalContextTokens || additiveTokens ? { pendingUserTokens: Math.max(0, pendingUserTokens - additiveTokens) } : {}
	};
}
/** Reconcile only queued context; prepared user, image, and transient costs stay owned upstream. */
function withCompactionQueuedContext(budget, messages) {
	const pendingQueuedContextTokens = estimateCompactionHistoryTokens(messages);
	const previousQueuedTokens = budget.pendingQueuedContextTokens ?? 0;
	if (pendingQueuedContextTokens === previousQueuedTokens) return budget;
	return {
		...budget,
		pendingTokens: budget.pendingTokens - previousQueuedTokens + pendingQueuedContextTokens,
		pendingQueuedContextTokens,
		pendingUserTokens: budget.pendingUserTokens ?? budget.pendingTokens - previousQueuedTokens
	};
}
function estimateCompactionHistoryTokens(messages, budget) {
	const pending = budget?.pendingTokens && budget.pendingUserIdempotencyKey ? messages.findLast((message) => message.role === "user" && "idempotencyKey" in message && message.idempotencyKey === budget.pendingUserIdempotencyKey) : void 0;
	const overlap = pending ? Math.min(estimateCompactionHistoryTokens([pending]), budget?.pendingUserTokens ?? budget?.pendingTokens ?? 0) : 0;
	const estimateTokens = createFreshLlmBoundaryTokenEstimator({});
	return estimateTokens({
		messages,
		prompt: ""
	}) - estimateTokens({
		messages: [],
		prompt: ""
	}) - overlap;
}
function estimateCompactedRequestTokens(messages, budget) {
	return budget.fixedTokens + budget.pendingTokens + estimateCompactionHistoryTokens(messages, budget);
}
function resolveCompactionRetentionBudget(budget, messages) {
	const preferredTokens = budget.contextWindow - budget.reserveTokens - budget.fixedTokens - budget.pendingTokens;
	return {
		maxTokens: preferredTokens <= 0 ? estimateCompactionHistoryTokens(messages, budget) - 1 : preferredTokens,
		reserveTokens: estimateCompactionHistoryTokens([{
			role: "compactionSummary",
			summary: "x".repeat(MAX_COMPACTION_SUMMARY_CHARS),
			tokensBefore: 0,
			timestamp: 0
		}])
	};
}
//#endregion
//#region src/agents/sessions/prompt-templates.ts
/**
* Prompt template discovery and loading.
*
* Reads markdown prompt templates from user, project, and package sources with frontmatter metadata.
*/
function loadTemplateFromFile(filePath, sourceInfo) {
	try {
		const rawContent = readFileSync(filePath, "utf-8");
		const { frontmatter, body } = parsePromptFrontmatter(rawContent);
		const name = basename(filePath).replace(/\.md$/, "");
		let description = frontmatter.description || "";
		if (!description) {
			const firstLine = body.split("\n").find((line) => line.trim());
			if (firstLine) {
				description = truncateUtf16Safe(firstLine, 60);
				if (firstLine.length > 60) description += "...";
			}
		}
		return {
			name,
			description,
			...frontmatter["argument-hint"] && { argumentHint: frontmatter["argument-hint"] },
			content: body,
			sourceInfo,
			filePath
		};
	} catch {
		return null;
	}
}
/**
* Scan a directory for .md files (non-recursive) and load them as prompt templates.
*/
function loadTemplatesFromDir(dir, getSourceInfo) {
	const templates = [];
	try {
		const { entries } = walkDirectorySync(dir, {
			maxDepth: 1,
			symlinks: "follow",
			include: (entry) => entry.kind === "file" && entry.name.endsWith(".md")
		});
		for (const entry of entries) {
			const fullPath = join(dir, entry.name);
			const template = loadTemplateFromFile(fullPath, getSourceInfo(fullPath));
			if (template) templates.push(template);
		}
	} catch {
		return templates;
	}
	return templates;
}
function resolvePromptPath(p, cwd) {
	const normalized = expandTildePath(p);
	return isAbsolute(normalized) ? normalized : resolve(cwd, normalized);
}
/**
* Load all prompt templates from:
* 1. Global: agentDir/prompts/
* 2. Project: cwd/{CONFIG_DIR_NAME}/prompts/
* 3. Explicit prompt paths
*/
function loadPromptTemplates(options) {
	const resolvedCwd = options.cwd;
	const resolvedAgentDir = options.agentDir;
	const promptPaths = options.promptPaths;
	const includeDefaults = options.includeDefaults;
	const templates = [];
	const globalPromptsDir = options.agentDir ? join(options.agentDir, "prompts") : resolvedAgentDir;
	const projectPromptsDir = resolve(resolvedCwd, CONFIG_DIR_NAME, "prompts");
	const getSourceInfo = (resolvedPath) => {
		if (isPathInside(globalPromptsDir, resolvedPath)) return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			scope: "user",
			baseDir: globalPromptsDir
		});
		if (isPathInside(projectPromptsDir, resolvedPath)) return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			scope: "project",
			baseDir: projectPromptsDir
		});
		return createSyntheticSourceInfo(resolvedPath, {
			source: "local",
			baseDir: statSync(resolvedPath).isDirectory() ? resolvedPath : dirname(resolvedPath)
		});
	};
	if (includeDefaults) {
		templates.push(...loadTemplatesFromDir(globalPromptsDir, getSourceInfo));
		templates.push(...loadTemplatesFromDir(projectPromptsDir, getSourceInfo));
	}
	for (const rawPath of promptPaths) {
		const resolvedPath = resolvePromptPath(rawPath, resolvedCwd);
		if (!existsSync(resolvedPath)) continue;
		try {
			const stats = statSync(resolvedPath);
			if (stats.isDirectory()) templates.push(...loadTemplatesFromDir(resolvedPath, getSourceInfo));
			else if (stats.isFile() && resolvedPath.endsWith(".md")) {
				const template = loadTemplateFromFile(resolvedPath, getSourceInfo(resolvedPath));
				if (template) templates.push(template);
			}
		} catch {}
	}
	return templates;
}
/**
* Expand a prompt template if it matches a template name.
* Returns the expanded content or the original text if not a template.
*/
function expandPromptTemplate(text, templates) {
	if (!text.startsWith("/")) return text;
	const match = text.match(/^\/([^\s]+)(?:\s+([\s\S]*))?$/);
	if (!match) return text;
	const templateName = match[1];
	const argsString = match[2] ?? "";
	const template = templates.find((t) => t.name === templateName);
	if (template) {
		const args = parseCommandArgs(argsString);
		return substituteArgs(template.content, args);
	}
	return text;
}
//#endregion
//#region src/agents/sessions/agent-session-prompting.ts
/** @internal Host preparation runs after SDK prompt hooks and owns its run cancellation. */
const agentSessionSetPromptPreparation = Symbol.for("testclaw.agent-session.set-prompt-preparation");
/** @internal Queue prompt-owned context with cleanup for preflight exits. */
const agentSessionQueuePromptContext = Symbol.for("testclaw.agent-session.queue-prompt-context");
var AgentSessionPrompting = class extends AgentSessionBase {
	constructor(..._args) {
		super(..._args);
		this.logicalPromptActive = false;
	}
	[agentSessionQueuePromptContext](message) {
		this.pendingNextTurnMessages.unshift(message);
		return () => {
			this.pendingNextTurnMessages = this.pendingNextTurnMessages.filter((pending) => pending !== message);
		};
	}
	[agentSessionSetPromptPreparation](prepare) {
		this.promptPreparation = prepare;
	}
	dispose() {
		this.promptPreparation = void 0;
		super.dispose();
	}
	async runAgentPrompt(messages) {
		if (this.logicalPromptActive) throw new Error("Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion.");
		this.logicalPromptActive = true;
		let endedForTurnHandoff = false;
		try {
			await this.runPreparedAgentLoop(() => this.agent.prompt(messages));
			while (true) {
				const action = await this.handlePostAgentRun();
				if (action !== "continue") {
					endedForTurnHandoff = action === "handoff";
					break;
				}
				await this.runPreparedAgentLoop(() => this.agent.continue());
			}
		} finally {
			this.systemPromptOverride = void 0;
			this.logicalPromptActive = false;
			endedForTurnHandoff ||= this.lastRunEndedForTurnHandoff;
			this.lastRunEndedForTurnHandoff = false;
			if (endedForTurnHandoff) this.emit({ type: "agent_handoff" });
			else {
				this.emit({ type: "agent_settled" });
				await this.currentExtensionRunner.emit({ type: "agent_settled" });
			}
		}
	}
	async runPreparedAgentLoop(run) {
		const prepare = this.promptPreparation;
		if (prepare) {
			const admit = await prepare();
			if (prepare !== this.promptPreparation) throw new Error("Session prompt preparation is stale after replacement or disposal.");
			admit?.();
		}
		return run();
	}
	async handlePostAgentRun() {
		const msg = this.lastAssistantMessage;
		this.lastAssistantMessage = void 0;
		const endedForTurnHandoff = this.lastRunEndedForTurnHandoff;
		this.lastRunEndedForTurnHandoff = false;
		if (endedForTurnHandoff) return "handoff";
		if (!msg || msg.stopReason === "aborted") return "settled";
		if (this.isRetryableError(msg) && await this.prepareRetry(msg)) return "continue";
		if (msg.stopReason === "error" && this.retryCount > 0) {
			this.emit({
				type: "auto_retry_end",
				success: false,
				attempt: this.retryCount,
				finalError: msg.errorMessage
			});
			this.retryCount = 0;
		}
		if (await this.checkCompaction(msg)) return "continue";
		return this.agent.hasQueuedMessages() ? "continue" : "settled";
	}
	createUserContent(text, images) {
		return [{
			type: "text",
			text
		}, ...images ?? []];
	}
	createUserMessage(text, images, preparedMessage) {
		const imageFactIndexes = readRuntimePromptImageFactIndexes(images);
		const message = {
			role: "user",
			content: this.createUserContent(text, images),
			timestamp: Date.now(),
			...imageFactIndexes ? { __testclaw: { mediaImageBlockFactIndexes: imageFactIndexes } } : {}
		};
		return Object.assign(message, mergePreparedUserTurnMessageForRuntime({
			runtimeMessage: message,
			preparedMessage
		}), { content: message.content });
	}
	/**
	* Send a prompt to the agent.
	* - Handles extension commands immediately, even during streaming
	* - Expands file-based prompt templates by default
	* - During streaming, queues via steer() or followUp() based on streamingBehavior option
	* - Validates model and API key before sending (when not streaming)
	* @throws Error if streaming and no streamingBehavior specified
	* @throws Error if no model selected or no API key available (when not streaming)
	*/
	async prompt(text, options) {
		const preparedCompactionBudget = takePromptCompactionRequestBudget(options);
		const expandPromptTemplates = options?.expandPromptTemplates ?? true;
		const preflightResult = options?.preflightResult;
		let messages;
		try {
			if (expandPromptTemplates && text.startsWith("/")) {
				if (await this.tryExecuteExtensionCommand(text)) {
					preflightResult?.(true);
					return;
				}
			}
			let currentText = text;
			let currentImages = options?.images;
			if (this.currentExtensionRunner.hasHandlers("input")) {
				const inputResult = await this.currentExtensionRunner.emitInput(currentText, currentImages, options?.source ?? "interactive");
				if (inputResult.action === "handled") {
					preflightResult?.(true);
					return;
				}
				if (inputResult.action === "transform") {
					currentText = inputResult.text;
					currentImages = inputResult.images ?? currentImages;
				}
			}
			let expandedText = currentText;
			if (expandPromptTemplates) {
				expandedText = this.expandSkillCommand(expandedText);
				expandedText = expandPromptTemplate(expandedText, [...this.promptTemplates]);
			}
			if (this.isStreaming || this.logicalPromptActive) {
				if (!options?.streamingBehavior) throw new Error("Agent is already processing. Specify streamingBehavior ('steer' or 'followUp') to queue the message.");
				if (options.streamingBehavior === "followUp") await this.queueFollowUp(expandedText, currentImages);
				else await this.queueSteer(expandedText, currentImages);
				preflightResult?.(true);
				return;
			}
			if (!this.model) throw new Error(formatNoModelSelectedMessage());
			if (!this.sessionModelRegistry.hasConfiguredAuth(this.model)) {
				if (this.sessionModelRegistry.isUsingOAuth(this.model)) throw new Error(`Authentication failed for "${this.model.provider}". Credentials may have expired or network is unavailable. Run '/login ${this.model.provider}' to re-authenticate.`);
				throw new Error(formatNoApiKeyFoundMessage(this.model.provider));
			}
			const persistedUserIdempotencyKey = options?.persistedUserIdempotencyKey;
			const contextWindow = this.model.contextWindow;
			const lastAssistant = this.findLastAssistantMessage();
			if (lastAssistant) {
				const pendingQueuedContextMessages = resolvePendingRuntimeContextReplay({
					messages: this.agent.state.messages,
					pendingContextMessages: this.pendingNextTurnMessages,
					persistedUserIdempotencyKey
				}).pendingContextMessages;
				await this.checkCompaction(lastAssistant, false, preparedCompactionBudget ? withCompactionQueuedContext(preparedCompactionBudget, pendingQueuedContextMessages) : typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0 ? createCompactionRequestBudget({
					contextWindow,
					reserveTokens: this.settingsManager.getCompactionSettings().reserveTokens,
					systemPrompt: this.agent.state.systemPrompt,
					tools: this.agent.state.tools,
					pendingPrompt: expandedText,
					pendingImageCount: currentImages?.length,
					pendingQueuedContextMessages,
					pendingUserIdempotencyKey: persistedUserIdempotencyKey
				}) : void 0);
			}
			const { persistedUserIndex, replayPersistedCarrier, pendingContextMessages } = resolvePendingRuntimeContextReplay({
				messages: this.agent.state.messages,
				pendingContextMessages: this.pendingNextTurnMessages,
				persistedUserIdempotencyKey
			});
			const replayPersistedTurn = persistedUserIndex >= 0;
			const persistedUser = this.agent.state.messages[persistedUserIndex];
			if (!replayPersistedCarrier && persistedUser?.role === "user") {
				const runtimeUser = this.createUserMessage(expandedText, currentImages, persistedUser);
				this.agent.state.messages = this.agent.state.messages.with(persistedUserIndex, runtimeUser);
			}
			messages = [];
			if (!replayPersistedTurn) messages.push({
				...this.createUserMessage(expandedText, currentImages),
				...persistedUserIdempotencyKey ? { idempotencyKey: persistedUserIdempotencyKey } : {}
			});
			messages.push(...pendingContextMessages);
			this.pendingNextTurnMessages = [];
			const result = await this.currentExtensionRunner.emitBeforeAgentStart(expandedText, currentImages, this.baseSystemPrompt, this.baseSystemPromptOptions);
			if (result?.messages) for (const msg of result.messages) messages.push({
				role: "custom",
				customType: msg.customType,
				content: msg.content,
				display: msg.display,
				details: msg.details,
				timestamp: Date.now()
			});
			if (result?.systemPrompt !== void 0) {
				this.systemPromptOverride = result.systemPrompt;
				this.agent.state.systemPrompt = result.systemPrompt;
			} else {
				this.systemPromptOverride = void 0;
				this.agent.state.systemPrompt = this.baseSystemPrompt;
			}
		} catch (error) {
			preflightResult?.(false);
			throw error;
		}
		if (!messages) return;
		preflightResult?.(true);
		await this.runAgentPrompt(messages);
	}
	/**
	* Try to execute an extension command. Returns true if command was found and executed.
	*/
	async tryExecuteExtensionCommand(text) {
		const spaceIndex = text.indexOf(" ");
		const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
		const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1);
		const command = this.currentExtensionRunner.getCommand(commandName);
		if (!command) return false;
		const ctx = this.currentExtensionRunner.createCommandContext();
		try {
			await command.handler(args, ctx);
			return true;
		} catch (err) {
			this.currentExtensionRunner.emitError({
				extensionPath: `command:${commandName}`,
				event: "command",
				error: err instanceof Error ? err.message : String(err)
			});
			return true;
		}
	}
	/**
	* Expand skill commands (/skill:name args) to their full content.
	* Returns the expanded text, or the original text if not a skill command or skill not found.
	* Emits errors via extension runner if file read fails.
	*/
	expandSkillCommand(text) {
		if (!text.startsWith("/skill:")) return text;
		const spaceIndex = text.indexOf(" ");
		const skillName = spaceIndex === -1 ? text.slice(7) : text.slice(7, spaceIndex);
		const args = spaceIndex === -1 ? "" : text.slice(spaceIndex + 1).trim();
		const skill = this.sessionResourceLoader.getSkills().skills.find((s) => s.name === skillName);
		if (!skill) return text;
		try {
			const content = readFileSync(skill.filePath, "utf-8");
			const body = stripFrontmatter(content).trim();
			const skillBlock = `<skill name="${skill.name}" location="${skill.filePath}">\nReferences are relative to ${skill.baseDir}.\n\n${body}\n</skill>`;
			return args ? `${skillBlock}\n\n${args}` : skillBlock;
		} catch (err) {
			this.currentExtensionRunner.emitError({
				extensionPath: skill.filePath,
				event: "skill_expansion",
				error: err instanceof Error ? err.message : String(err)
			});
			return text;
		}
	}
	/**
	* Queue a steering message while the agent is running.
	* Delivered before the next unstarted tool launch or model call. Running tools
	* continue; suppressed calls receive paired synthetic results.
	* Expands skill commands and prompt templates. Errors on extension commands.
	* @param images Optional image attachments to include with the message
	* @param userTurnTranscriptRecorder Prepared channel fields for transcript-only persistence
	* @throws Error if text is an extension command
	*/
	async steer(text, images, userTurnTranscriptRecorder, media, imageOrder, queueIdentity, canInject) {
		if (text.startsWith("/")) this.throwIfExtensionCommand(text);
		let expandedText = this.expandSkillCommand(text);
		expandedText = expandPromptTemplate(expandedText, [...this.promptTemplates]);
		const preparedMessage = await userTurnTranscriptRecorder?.resolveMessage();
		if (canInject && !canInject()) throw new Error("active session is finalizing");
		await this.queueSteer(expandedText, images, preparedMessage && userTurnTranscriptRecorder ? {
			message: preparedMessage,
			recorder: userTurnTranscriptRecorder
		} : void 0, media, imageOrder, queueIdentity);
	}
	/**
	* Queue a follow-up message to be processed after the agent finishes.
	* Delivered only when agent has no more tool calls or steering messages.
	* Expands skill commands and prompt templates. Errors on extension commands.
	* @param images Optional image attachments to include with the message
	* @throws Error if text is an extension command
	*/
	async followUp(text, images) {
		if (text.startsWith("/")) this.throwIfExtensionCommand(text);
		let expandedText = this.expandSkillCommand(text);
		expandedText = expandPromptTemplate(expandedText, [...this.promptTemplates]);
		await this.queueFollowUp(expandedText, images);
	}
	/**
	* Internal: Queue a steering message (already expanded, no extension command check).
	*/
	async queueSteer(text, images, transcriptContext, media, imageOrder, queueIdentity) {
		const runtimeMessage = this.createUserMessage(text, images, transcriptContext?.message);
		const promptMessage = media?.length ? attachRuntimePromptMediaFacts(runtimeMessage, media, imageOrder) : runtimeMessage;
		setSteeringMessageIdentity(promptMessage, queueIdentity);
		this.trackQueuedUserMessage(promptMessage, "steering", text);
		this.agent.steer(transcriptContext ? attachRuntimeUserTurnTranscriptContext(promptMessage, transcriptContext) : promptMessage);
	}
	/**
	* Internal: Queue a follow-up message (already expanded, no extension command check).
	*/
	async queueFollowUp(text, images) {
		const message = this.createUserMessage(text, images);
		this.trackQueuedUserMessage(message, "followUp", text);
		this.agent.followUp(message);
	}
	/**
	* Throw an error if the text is an extension command.
	*/
	throwIfExtensionCommand(text) {
		const spaceIndex = text.indexOf(" ");
		const commandName = spaceIndex === -1 ? text.slice(1) : text.slice(1, spaceIndex);
		if (this.currentExtensionRunner.getCommand(commandName)) throw new Error(`Extension command "/${commandName}" cannot be queued. Use prompt() or execute the command when not streaming.`);
	}
	/**
	* Send a custom message to the session. Creates a CustomMessageEntry.
	*
	* Handles three cases:
	* - Streaming: queues message, processed when loop pulls from queue
	* - Not streaming + triggerTurn: appends to state/session, starts new turn
	* - Not streaming + no trigger: appends to state/session, no turn
	*
	* @param message Custom message with customType, content, display, details
	* @param options.triggerTurn If true and not streaming, triggers a new LLM turn
	* @param options.deliverAs Delivery mode: "steer", "followUp", or "nextTurn"
	*/
	async sendCustomMessage(message, options) {
		const appMessage = {
			role: "custom",
			customType: message.customType,
			content: message.content,
			display: message.display,
			details: message.details,
			timestamp: Date.now()
		};
		if (options?.deliverAs === "nextTurn") this.pendingNextTurnMessages.push(appMessage);
		else if (this.isStreaming) {
			if (options?.deliverAs === "followUp") this.agent.followUp(appMessage);
			else this.agent.steer(appMessage);
		} else if (options?.triggerTurn) await this.runAgentPrompt(appMessage);
		else {
			await withSessionManagerWrite(this.sessionManager, () => {
				this.sessionManager.appendCustomMessageEntry(appMessage.customType, appMessage.content, appMessage.display, appMessage.details);
				this.agent.state.messages.push(appMessage);
			});
			this.emit({
				type: "message_start",
				message: appMessage
			});
			this.emit({
				type: "message_end",
				message: appMessage
			});
		}
	}
	/**
	* Send a user message to the agent. Always triggers a turn.
	* When the agent is streaming, use deliverAs to specify how to queue the message.
	*
	* @param content User message content (string or content array)
	* @param options.deliverAs Delivery mode when streaming: "steer" or "followUp"
	*/
	async sendUserMessage(content, options) {
		let text;
		let images;
		if (typeof content === "string") text = content;
		else {
			const textParts = [];
			images = [];
			for (const part of content) if (part.type === "text") textParts.push(part.text);
			else images.push(part);
			text = textParts.join("\n");
			if (images.length === 0) images = void 0;
		}
		await this.prompt(text, {
			expandPromptTemplates: false,
			streamingBehavior: options?.deliverAs,
			images,
			source: "extension"
		});
	}
	/**
	* Clear all queued messages and return them.
	* Useful for restoring to editor when user aborts.
	* @returns Object with steering and followUp arrays
	*/
	clearQueue() {
		const steering = this.steeringMessages.map((entry) => entry.text);
		const followUp = this.followUpMessages.map((entry) => entry.text);
		this.steeringMessages = [];
		this.followUpMessages = [];
		this.agent.clearAllQueues();
		this.emitQueueUpdate();
		return {
			steering,
			followUp
		};
	}
	/** Number of pending messages (includes both steering and follow-up) */
	get pendingMessageCount() {
		return this.steeringMessages.length + this.followUpMessages.length;
	}
	/** Get pending steering messages (read-only) */
	getSteeringMessages() {
		return this.steeringMessages.map((entry) => entry.text);
	}
	/** Get pending follow-up messages (read-only) */
	getFollowUpMessages() {
		return this.followUpMessages.map((entry) => entry.text);
	}
	get resourceLoader() {
		return this.sessionResourceLoader;
	}
	/** Abort the current run; yield callers pass a turnHandoff reason to skip interruption guidance. */
	async abort(reason) {
		this.abortRetry();
		this.agent.abort(reason);
		await this.agent.waitForIdle();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-models.ts
const THINKING_LEVELS = [
	"off",
	"minimal",
	"low",
	"medium",
	"high"
];
var AgentSessionModels = class extends AgentSessionPrompting {
	async emitModelSelect(nextModel, previousModel, runner, isCurrent) {
		if (!isCurrent() || modelsAreEqual(previousModel, nextModel)) return;
		await runner.emit({
			type: "model_select",
			model: nextModel,
			previousModel,
			source: "set"
		});
	}
	/** Set the model after validating its current auth at write admission. */
	async setModel(model) {
		const owner = this.captureMetadataOwner();
		const { previousModel, thinkingSelection: committedThinkingSelection, commit: committedMetadata } = await owner.run(() => withSessionManagerWrite(owner.manager, async () => {
			owner.assertCurrent();
			if (!this.sessionModelRegistry.hasConfiguredAuth(model)) throw new Error(`No API key for ${model.provider}/${model.id}`);
			const previous = this.model;
			const thinkingSelection = this.planThinkingLevel(this.getThinkingLevelForModelSwitch(), model);
			const publication = {};
			await withSessionMetadataPublication(owner.manager, {
				type: "model_change",
				provider: model.provider,
				modelId: model.id
			}, (commit) => {
				publication.commit = commit;
				this.agent.state.model = model;
				this.settingsManager.setDefaultModelAndProvider(model.provider, model.id);
			}, () => owner.manager.appendModelChange(model.provider, model.id));
			if (thinkingSelection) try {
				owner.assertCurrent();
				publication.commit = await this.appendThinkingSelection(owner, thinkingSelection) ?? publication.commit;
			} catch (cause) {
				this.failAfterMetadataCommit(cause, publication.commit);
			}
			return {
				previousModel: previous,
				thinkingSelection: thinkingSelection?.event,
				commit: publication.commit
			};
		}));
		try {
			const thinking = this.emitThinkingLevelSelect(committedThinkingSelection, owner.runner, owner.isCurrent);
			const selected = this.emitModelSelect(model, previousModel, owner.runner, owner.isCurrent);
			const failures = (await Promise.allSettled([thinking, selected])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "Session metadata notifications failed", { cause: failures[0] });
		} catch (cause) {
			this.failAfterMetadataCommit(cause, committedMetadata);
		}
	}
	/**
	* Set thinking level.
	* Clamps to model capabilities based on available thinking levels.
	* Saves to session and settings only if the level actually changes.
	*/
	async setThinkingLevel(level) {
		const owner = this.captureMetadataOwner();
		const committedSelection = await owner.run(() => withSessionManagerWrite(owner.manager, async () => {
			owner.assertCurrent();
			const selection = this.planThinkingLevel(level, this.model);
			if (!selection) return;
			const commit = await this.appendThinkingSelection(owner, selection);
			return {
				event: selection.event,
				commit
			};
		}));
		try {
			await this.emitThinkingLevelSelect(committedSelection?.event, owner.runner, owner.isCurrent);
		} catch (cause) {
			this.failAfterMetadataCommit(cause, committedSelection?.commit);
		}
	}
	planThinkingLevel(level, model) {
		const effectiveLevel = (model ? getSupportedThinkingLevels(model) : THINKING_LEVELS).includes(level) ? level : model ? clampThinkingLevel(model, level) : "off";
		const previousLevel = this.agent.state.thinkingLevel;
		if (effectiveLevel === previousLevel) return;
		return {
			event: {
				type: "thinking_level_select",
				level: effectiveLevel,
				previousLevel
			},
			saveDefault: Boolean(model?.reasoning) || effectiveLevel !== "off"
		};
	}
	async appendThinkingSelection(owner, selection) {
		const publication = {};
		await withSessionMetadataPublication(owner.manager, {
			type: "thinking_level_change",
			thinkingLevel: selection.event.level
		}, (commit) => {
			publication.commit = commit;
			this.agent.state.thinkingLevel = selection.event.level;
			if (selection.saveDefault) this.settingsManager.setDefaultThinkingLevel(selection.event.level);
		}, () => owner.manager.appendThinkingLevelChange(selection.event.level));
		return publication.commit;
	}
	emitThinkingLevelSelect(event, runner, isCurrent) {
		if (event && isCurrent()) {
			this.emit({
				type: "thinking_level_changed",
				level: event.level
			});
			if (isCurrent()) return runner.emit(event);
		}
		return Promise.resolve();
	}
	failAfterMetadataCommit(cause, commit) {
		if (cause instanceof SessionMetadataCommittedError || !commit) throw cause;
		throw new SessionMetadataCommittedError(commit.entry, commit.version, cause, commit.target);
	}
	captureMetadataOwner() {
		const manager = this.sessionManager;
		const target = manager.getSessionTarget();
		const sessionId = manager.getSessionId();
		const runner = this.currentExtensionRunner;
		const assertAmbient = target ? captureOwnedTranscriptWriteAssertion(target) : void 0;
		const isBound = () => {
			const current = manager.getSessionTarget();
			return manager.getSessionId() === sessionId && sameSessionTranscriptTargetBinding(target, current);
		};
		const assertCurrent = () => {
			if (!isBound()) throw new Error("Session manager identity changed before transcript write admission");
			if (this.currentExtensionRunner !== runner || runner.createContext().sessionManager !== manager) throw new Error("Session metadata source changed before publication");
			assertAmbient?.();
		};
		return {
			manager,
			runner,
			assertCurrent,
			isCurrent: () => {
				try {
					assertCurrent();
					return true;
				} catch {
					return false;
				}
			},
			run: (operation) => target ? withSessionTranscriptWriteAssertion(target, assertCurrent, operation) : operation()
		};
	}
	/**
	* Get available thinking levels for current model.
	* The provider will clamp to what the specific model supports internally.
	*/
	getAvailableThinkingLevels() {
		if (!this.model) return THINKING_LEVELS;
		return getSupportedThinkingLevels(this.model);
	}
	/**
	* Check if current model supports thinking/reasoning.
	*/
	supportsThinking() {
		return Boolean(this.model?.reasoning);
	}
	getThinkingLevelForModelSwitch() {
		if (!this.supportsThinking()) return this.settingsManager.getDefaultThinkingLevel() ?? "medium";
		return this.thinkingLevel;
	}
	/**
	* Set steering message mode.
	* Saves to settings.
	*/
	setSteeringMode(mode) {
		this.agent.steeringMode = mode;
		this.settingsManager.setSteeringMode(mode);
	}
	/**
	* Set follow-up message mode.
	* Saves to settings.
	*/
	setFollowUpMode(mode) {
		this.agent.followUpMode = mode;
		this.settingsManager.setFollowUpMode(mode);
	}
};
//#endregion
//#region src/agents/sessions/agent-session-inspection.ts
var AgentSessionInspection = class extends AgentSessionModels {
	/**
	* Set a display name for the current session.
	*/
	setSessionName(name) {
		this.sessionManager.appendSessionInfo(name);
		this.emit({
			type: "session_info_changed",
			name: this.sessionManager.getSessionName()
		});
	}
	getContextUsage() {
		const model = this.model;
		if (!model) return;
		const contextWindow = model.contextWindow ?? 0;
		if (contextWindow <= 0) return;
		const branchEntries = this.sessionManager.getBranch();
		const latestCompaction = getLatestCompactionEntry(branchEntries);
		const providerCheckpointIndex = branchEntries.findLastIndex((entry) => entry.type === "message" && entry.message.role === "assistant" && isCompactionReplayCheckpoint(entry.message.providerReplay));
		const clientCompactionIndex = latestCompaction ? branchEntries.lastIndexOf(latestCompaction) : -1;
		const compactionIndex = Math.max(clientCompactionIndex, providerCheckpointIndex);
		const providerCheckpoint = providerCheckpointIndex > clientCompactionIndex;
		let estimateFromContent = false;
		if (compactionIndex >= 0) {
			let hasPostCompactionUsage = false;
			for (let index = branchEntries.length - 1; index > compactionIndex; index -= 1) {
				const entry = branchEntries[index];
				if (entry.type === "message" && entry.message.role === "assistant") {
					const assistant = entry.message;
					if (assistant.stopReason !== "aborted" && assistant.stopReason !== "error") {
						if (providerCheckpoint && assistant.usage.contextUsage?.state !== "available") continue;
						if (assistant.usage.contextUsage?.state === "unavailable") {
							estimateFromContent = true;
							continue;
						}
						if (calculateContextTokens(assistant.usage) > 0) {
							hasPostCompactionUsage = true;
							estimateFromContent = false;
							break;
						}
					}
				}
			}
			if (!hasPostCompactionUsage && (providerCheckpoint || !estimateFromContent)) return {
				tokens: null,
				contextWindow,
				percent: null
			};
		}
		const tokens = estimateFromContent ? estimateMessagesFromContent(this.messages) : estimateContextTokens(this.messages).tokens;
		return {
			tokens,
			contextWindow,
			percent: tokens / contextWindow * 100
		};
	}
	/**
	* Export the current session branch to a JSONL file.
	* Writes the session header followed by all entries on the current branch path.
	* @param outputPath Target file path. If omitted, generates a timestamped file in cwd.
	* @returns The resolved output file path.
	*/
	exportToJsonl(outputPath) {
		const filePath = resolve(outputPath ?? `session-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.jsonl`);
		const dir = dirname(filePath);
		if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
		const header = {
			type: "session",
			version: this.sessionManager.getHeader()?.version,
			id: this.sessionManager.getSessionId(),
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			cwd: this.sessionManager.getCwd()
		};
		const branchEntries = this.sessionManager.getBranch();
		const lines = [JSON.stringify(header)];
		let prevId = null;
		for (const entry of branchEntries) {
			const linear = {
				...entry,
				parentId: prevId
			};
			lines.push(JSON.stringify(linear));
			prevId = entry.id;
		}
		writeFileSync(filePath, `${lines.join("\n")}\n`);
		return filePath;
	}
	/**
	* Get text content of last assistant message.
	* Useful for /copy command.
	* @returns Text content, or undefined if no assistant message exists
	*/
	getLastAssistantText() {
		const messages = this.messages;
		for (let index = messages.length - 1; index >= 0; index -= 1) {
			const message = messages[index];
			if (message.role !== "assistant") continue;
			const content = message.content;
			if (message.stopReason === "aborted" && !hasPersistedAssistantContent(content)) continue;
			return extractTextContent(content).trim() || void 0;
		}
	}
};
//#endregion
//#region src/agents/sessions/manual-compaction-preflight.ts
/** Plans manual compaction without aborting or otherwise mutating the active session. */
function preflightManualSessionCompaction(pathEntries, settings) {
	const initial = prepareCompaction$1(pathEntries, settings);
	if (!initial.ok) throw initial.error;
	let preparation = initial.value;
	if (!preparation) {
		const smallest = prepareCompaction$1(pathEntries, {
			...settings,
			keepRecentTokens: 0
		});
		if (!smallest.ok) throw smallest.error;
		preparation = smallest.value;
	}
	if (preparation) return {
		compactable: true,
		preparation
	};
	return {
		compactable: false,
		reason: pathEntries.at(-1)?.type === "compaction" ? "Already compacted" : "Nothing to compact (session too small)"
	};
}
//#endregion
//#region src/agents/sessions/session-model-usage.ts
const sinkBySessionManager = createSessionManagerRuntimeRegistry();
/** Records one auxiliary model completion at the session that owns the request. */
function recordSessionModelUsage(sessionManager, usage) {
	sinkBySessionManager.get(sessionManager)?.(usage);
}
/** Sets the active accounting owner for auxiliary model usage. */
function setSessionModelUsageSink(sessionManager, sink) {
	sinkBySessionManager.set(sessionManager, sink);
}
//#endregion
//#region src/agents/sessions/agent-session-compaction.ts
function compactionErrorMessage(error, fallback) {
	const message = error instanceof Error ? error.message : String(error);
	return message.trim() ? message : fallback;
}
/** @internal */
const agentSessionAutomaticCompaction = Symbol.for("testclaw.agent-session.automatic-compaction");
/** Installs a synchronous callback for model-context replacement during compaction. */
const agentSessionSetContextReplacementHook = Symbol.for("testclaw.agent-session.set-context-replacement-hook");
var AgentSessionCompaction = class extends AgentSessionInspection {
	[agentSessionSetContextReplacementHook](callback, assertActive) {
		this.onContextReplaced = callback;
		this.assertContextReplacementActive = assertActive;
	}
	/**
	* Manually compact the session context.
	* Aborts current agent operation first.
	* @param customInstructions Optional instructions for the compaction summary
	*/
	async compact(customInstructions) {
		return await this.runWithSessionWriteSettlement(async () => {
			const outcome = await this.compactWithSessionWriteSettlement(customInstructions, "none");
			if (outcome.status === "skipped") throw new Error(outcome.reason);
			return outcome.result;
		});
	}
	async [agentSessionAutomaticCompaction](customInstructions, requestState, summaryOutputPolicy = "retry-invalid-once", constraints) {
		return await this.runWithSessionWriteSettlement(() => this.compactWithSessionWriteSettlement(customInstructions, summaryOutputPolicy, requestState, constraints));
	}
	async compactWithSessionWriteSettlement(customInstructions, summaryOutputPolicy = "none", requestState, constraints) {
		this.disconnectFromAgent();
		await this.abort();
		const abortController = new AbortController();
		this.compactionAbortController = abortController;
		const itemId = generateSessionEntryId();
		this.emit({
			type: "compaction_start",
			reason: "manual",
			itemId
		});
		try {
			const settings = this.settingsManager.getCompactionSettings();
			let outcome;
			try {
				outcome = await this.runCompactionWork({
					itemId,
					customInstructions,
					mode: "manual",
					summaryOutputPolicy,
					requestState,
					...constraints,
					settings,
					signal: abortController.signal
				});
			} catch (error) {
				const message = compactionErrorMessage(error, "Compaction failed");
				const aborted = abortController.signal.aborted || error instanceof Error && error.name === "AbortError";
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome: aborted ? { status: "aborted" } : {
						status: "failed",
						reason: `Compaction failed: ${message}`
					}
				});
				throw error;
			}
			if (outcome.status === "skipped") {
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome
				});
				return outcome;
			}
			if (outcome.status === "aborted") {
				this.emit({
					type: "compaction_end",
					reason: "manual",
					itemId,
					outcome
				});
				throw new Error("Compaction cancelled");
			}
			this.emit({
				type: "compaction_end",
				reason: "manual",
				itemId,
				outcome: {
					status: "completed",
					tokensBefore: outcome.result.tokensBefore,
					tokensAfter: outcome.tokensAfter,
					willRetry: false
				}
			});
			return outcome;
		} finally {
			if (this.compactionAbortController === abortController) this.compactionAbortController = void 0;
			this.reconnectToAgent();
		}
	}
	/**
	* Cancel in-progress compaction (manual or auto).
	*/
	abortCompaction() {
		this.compactionAbortController?.abort();
		this.autoCompactionAbortController?.abort();
	}
	/**
	* Cancel in-progress branch summarization.
	*/
	abortBranchSummary() {
		this.branchSummaryAbortController?.abort();
	}
	async runCompactionWork(options) {
		const isManual = options.mode === "manual";
		const assertContextReplacementActive = this.assertContextReplacementActive;
		const onContextReplaced = this.onContextReplaced;
		if (!this.model) {
			if (isManual) throw new Error(formatNoModelSelectedMessage());
			return {
				status: "skipped",
				reason: formatNoModelSelectedMessage()
			};
		}
		const model = this.model;
		let auth;
		try {
			auth = await this.getCompactionRequestAuth(model);
		} catch (error) {
			if (isManual) throw error;
			return {
				status: "skipped",
				reason: compactionErrorMessage(error, "Compaction authentication failed")
			};
		}
		const pathEntries = this.sessionManager.getBranch();
		const requestBudget = options.requestBudget;
		const pendingUserIdempotencyKey = requestBudget?.pendingTokens ? requestBudget.pendingUserIdempotencyKey : void 0;
		const pendingEntryIndex = options.pendingUserEntryId || pendingUserIdempotencyKey ? pathEntries.findLastIndex((entry) => entry.type === "message" && entry.message.role === "user" && (options.pendingUserEntryId ? entry.id === options.pendingUserEntryId : "idempotencyKey" in entry.message && entry.message.idempotencyKey === pendingUserIdempotencyKey)) : -1;
		if (options.pendingUserEntryId && pendingEntryIndex < 0) throw new Error("Compaction cannot find the admitted pending user request.");
		const retention = requestBudget ? resolveCompactionRetentionBudget(requestBudget, buildSessionContext(pathEntries).messages) : void 0;
		const requestTokenLimit = requestBudget && retention ? requestBudget.fixedTokens + requestBudget.pendingTokens + retention.maxTokens : void 0;
		let preparation;
		if (isManual && !options.requestState && !requestBudget && pendingEntryIndex < 0) {
			const manualPreflight = preflightManualSessionCompaction(pathEntries, options.settings);
			if (!manualPreflight.compactable) throw new Error(manualPreflight.reason);
			preparation = manualPreflight.preparation;
		} else preparation = unwrapCoreResult(prepareCompaction$1(pathEntries, options.settings, options.requestState, requestBudget || pendingEntryIndex >= 0 ? {
			preserveFromEntryId: pathEntries[pendingEntryIndex]?.id,
			...requestBudget && retention ? { budget: {
				...retention,
				estimateTokens: (message) => estimateCompactionHistoryTokens([message], requestBudget)
			} } : {}
		} : void 0));
		if (!preparation) return {
			status: "skipped",
			reason: "Nothing to compact (session too small)"
		};
		const projectReplacement = (result, summary) => buildSessionContext([...pathEntries, {
			...result,
			type: "compaction",
			id: options.itemId,
			parentId: pathEntries.at(-1)?.id ?? null,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			summary
		}]).messages;
		if (requestBudget && requestTokenLimit !== void 0) {
			const remaining = requestTokenLimit - estimateCompactedRequestTokens(projectReplacement(preparation, ""), requestBudget);
			preparation.summaryTokenBudget = Math.floor(remaining / SAFETY_MARGIN) - 1;
		}
		let compactionResult;
		let fromExtension = false;
		if (this.currentExtensionRunner.hasHandlers("session_before_compact")) {
			const extensionResult = await this.currentExtensionRunner.emit({
				type: "session_before_compact",
				preparation,
				branchEntries: pathEntries,
				customInstructions: options.customInstructions,
				signal: options.signal,
				thinkingLevel: this.thinkingLevel,
				streamFn: this.agent.streamFn
			});
			if (extensionResult?.cancel) return { status: "aborted" };
			if (extensionResult?.compaction) {
				compactionResult = extensionResult.compaction;
				fromExtension = true;
			}
		}
		if (!compactionResult) {
			const focus = normalizeOptionalString(options.customInstructions);
			const boundedFocus = focus ? resolveCompactionInstructions(focus, void 0) : void 0;
			const coreInstructions = [boundedFocus ? wrapUntrustedPromptDataBlock({
				label: "Compaction focus",
				text: boundedFocus
			}) : "", preparation.latestUnresolvedUserRequest ? ["The run owner will resume this request after compaction. Preserve it as current work.", wrapUntrustedPromptDataBlock({
				label: "Latest unresolved user request",
				text: preparation.latestUnresolvedUserRequest
			})].join("\n") : ""].filter(Boolean).join("\n\n");
			const runCoreCompaction = () => compact$1(preparation, model, auth.apiKey, auth.headers, coreInstructions || void 0, options.signal, this.thinkingLevel, this.agent.streamFn, createCompactionRuntime((usage) => recordSessionModelUsage(this.sessionManager, usage)));
			let result = await runCoreCompaction();
			if (options.signal.aborted) return { status: "aborted" };
			if (options.summaryOutputPolicy === "retry-invalid-once" && !result.ok && result.error instanceof InvalidSummaryOutputError) {
				result = await runCoreCompaction();
				if (options.signal.aborted) return { status: "aborted" };
			}
			compactionResult = unwrapCoreResult(result);
		}
		if (options.signal.aborted) return { status: "aborted" };
		const completedCompaction = {
			...compactionResult,
			summary: capCompactionSummary(compactionResult.summary)
		};
		const { firstKeptEntryId } = completedCompaction;
		const firstKeptIndex = pathEntries.findIndex((entry) => entry.id === firstKeptEntryId);
		if (pendingEntryIndex >= 0 && (firstKeptIndex < 0 || firstKeptIndex > pendingEntryIndex)) throw new Error("Compaction must retain the unprocessed pending user request.");
		if (requestBudget && requestTokenLimit !== void 0 && estimateCompactedRequestTokens(projectReplacement(completedCompaction, completedCompaction.summary), requestBudget) > requestTokenLimit) throw new Error("The finalized compaction exceeds the foreground request budget. Reduce the request or select a larger context window.");
		const committed = await withSessionManagerWrite(this.sessionManager, () => {
			const currentController = isManual ? this.compactionAbortController : this.autoCompactionAbortController;
			if (options.signal.aborted || currentController?.signal !== options.signal || this.assertContextReplacementActive !== assertContextReplacementActive || this.onContextReplaced !== onContextReplaced) return;
			assertContextReplacementActive?.();
			const replacementMessages = sanitizeCompactionReplayMessages(projectReplacement(completedCompaction, completedCompaction.summary));
			const tokensAfter = requestBudget ? estimateCompactedRequestTokens(replacementMessages, {
				...requestBudget,
				pendingTokens: 0
			}) : estimateContextTokens(replacementMessages).tokens;
			const entryId = this.sessionManager.appendCompaction(completedCompaction.summary, completedCompaction.firstKeptEntryId, completedCompaction.tokensBefore, completedCompaction.details, fromExtension, { itemId: options.itemId }, tokensAfter);
			const sessionContext = this.sessionManager.buildSessionContext();
			this.agent.state.messages = sanitizeCompactionReplayMessages(sessionContext.messages);
			onContextReplaced?.(tokensAfter, completedCompaction.tokensBefore);
			return {
				entryId,
				tokensAfter
			};
		});
		if (committed === void 0) return { status: "aborted" };
		const { entryId: compactionEntryId, tokensAfter } = committed;
		const savedCompactionEntry = this.sessionManager.getEntry(compactionEntryId);
		if (this.currentExtensionRunner && savedCompactionEntry?.type === "compaction") await this.currentExtensionRunner.emit({
			type: "session_compact",
			compactionEntry: savedCompactionEntry,
			fromExtension
		});
		return {
			status: "completed",
			result: completedCompaction,
			tokensAfter
		};
	}
	/**
	* Check if compaction is needed and run it.
	* Called after agent_end and before prompt submission.
	*
	* Two cases:
	* 1. Overflow: LLM returned context overflow error, remove error message from agent state, compact, auto-retry
	* 2. Threshold: Context over threshold, compact, NO auto-retry (user continues manually)
	*
	* @param assistantMessage The assistant message to check
	* @param skipAbortedCheck If false, include aborted messages (for pre-prompt check). Default: true
	*/
	async checkCompaction(assistantMessage, skipAbortedCheck = true, requestBudget) {
		const settings = this.settingsManager.getCompactionSettings();
		if (!settings.enabled) return false;
		if (skipAbortedCheck && assistantMessage.stopReason === "aborted") return false;
		const contextWindow = this.model?.contextWindow ?? 0;
		const sameModel = this.model && assistantMessage.provider === this.model.provider && assistantMessage.model === this.model.id;
		const compactionEntry = getLatestCompactionEntry(this.sessionManager.getBranch());
		if (compactionEntry !== null && assistantMessage.timestamp <= new Date(compactionEntry.timestamp).getTime()) return false;
		if (sameModel && (assistantMessage.stopReason === "error" || assistantMessage.stopReason === "length") && isContextOverflow(assistantMessage, contextWindow)) {
			if (this.contextOverflowRecoveryOwner === "caller") return false;
			if (this.overflowRecoveryAttempts >= 3) {
				this.emit({
					type: "compaction_end",
					reason: "overflow",
					outcome: {
						status: "failed",
						reason: `Context overflow recovery failed after 3 compact-and-retry attempts. Try reducing context or switching to a larger-context model.`
					}
				});
				return false;
			}
			this.overflowRecoveryAttempts += 1;
			const messages = this.agent.state.messages;
			if (messages.at(-1)?.role === "assistant") this.agent.state.messages = messages.slice(0, -1);
			return await this.runAutoCompaction("overflow", true, requestBudget);
		}
		let contextTokens;
		if (assistantMessage.stopReason === "error") {
			const messages = this.agent.state.messages;
			const estimate = estimateContextTokens(messages);
			if (estimate.lastUsageIndex === null) return false;
			contextTokens = estimate.tokens;
		} else if (assistantMessage.usage.contextUsage?.state === "unavailable") {
			const estimatedContextTokens = this.getContextUsage()?.tokens;
			if (estimatedContextTokens == null) return false;
			contextTokens = estimatedContextTokens;
		} else contextTokens = calculateContextTokens(assistantMessage.usage);
		if (shouldCompact(contextTokens, contextWindow, settings)) return await this.runAutoCompaction("threshold", false, requestBudget);
		return false;
	}
	/**
	* Internal: Run auto-compaction with events.
	*/
	async runAutoCompaction(reason, willRetry, requestBudget) {
		const settings = this.settingsManager.getCompactionSettings();
		const contextWindow = this.model?.contextWindow;
		const itemId = generateSessionEntryId();
		this.emit({
			type: "compaction_start",
			reason,
			itemId
		});
		const abortController = new AbortController();
		this.autoCompactionAbortController = abortController;
		try {
			const outcome = await this.runCompactionWork({
				itemId,
				mode: "auto",
				requestBudget: requestBudget ?? (typeof contextWindow === "number" && Number.isFinite(contextWindow) && contextWindow > 0 ? createCompactionRequestBudget({
					contextWindow,
					reserveTokens: settings.reserveTokens,
					systemPrompt: this.agent.state.systemPrompt,
					tools: this.agent.state.tools
				}) : void 0),
				...willRetry ? { requestState: "unresolved" } : {},
				summaryOutputPolicy: "retry-invalid-once",
				settings,
				signal: abortController.signal
			});
			if (outcome.status === "skipped") {
				this.emit({
					type: "compaction_end",
					reason,
					itemId,
					outcome
				});
				return false;
			}
			if (outcome.status === "aborted") {
				this.emit({
					type: "compaction_end",
					reason,
					itemId,
					outcome
				});
				return false;
			}
			this.emit({
				type: "compaction_end",
				reason,
				itemId,
				outcome: {
					status: "completed",
					tokensBefore: outcome.result.tokensBefore,
					tokensAfter: outcome.tokensAfter,
					willRetry
				}
			});
			if (willRetry) {
				const messages = this.agent.state.messages;
				const lastMsg = messages[messages.length - 1];
				if (lastMsg?.role === "assistant" && (lastMsg.stopReason === "error" || lastMsg.stopReason === "length")) this.agent.state.messages = messages.slice(0, -1);
				return true;
			}
			return this.agent.hasQueuedMessages();
		} catch (error) {
			if (abortController.signal.aborted) {
				this.emit({
					type: "compaction_end",
					reason,
					itemId,
					outcome: { status: "aborted" }
				});
				return false;
			}
			const errorMessage = compactionErrorMessage(error, "compaction failed");
			this.emit({
				type: "compaction_end",
				reason,
				itemId,
				outcome: {
					status: "failed",
					reason: reason === "overflow" ? `Context overflow recovery failed: ${errorMessage}` : `Auto-compaction failed: ${errorMessage}`
				}
			});
			return false;
		} finally {
			if (this.autoCompactionAbortController === abortController) this.autoCompactionAbortController = void 0;
		}
	}
	/**
	* Toggle auto-compaction setting.
	*/
	setAutoCompactionEnabled(enabled) {
		this.settingsManager.setCompactionEnabled(enabled);
	}
	/** Whether auto-compaction is enabled */
	get autoCompactionEnabled() {
		return this.settingsManager.getCompactionEnabled();
	}
};
//#endregion
//#region src/agents/sessions/agent-session-extensions.ts
var AgentSessionExtensions = class extends AgentSessionCompaction {
	async bindExtensions(bindings) {
		if (bindings.uiContext !== void 0) this.extensionUIContext = bindings.uiContext;
		if (bindings.commandContextActions !== void 0) this.extensionCommandContextActions = bindings.commandContextActions;
		if (bindings.abortHandler !== void 0) this.extensionAbortHandler = bindings.abortHandler;
		if (bindings.shutdownHandler !== void 0) this.extensionShutdownHandler = bindings.shutdownHandler;
		if (bindings.onError !== void 0) this.extensionErrorListener = bindings.onError;
		this.applyExtensionBindings(this.currentExtensionRunner);
		await this.currentExtensionRunner.emit(this.sessionStartEvent);
		await this.extendResourcesFromExtensions(this.sessionStartEvent.reason === "reload" ? "reload" : "startup");
	}
	async extendResourcesFromExtensions(reason) {
		if (!this.currentExtensionRunner.hasHandlers("resources_discover")) return;
		const { skillPaths, promptPaths, themePaths } = await this.currentExtensionRunner.emitResourcesDiscover(this.cwd, reason);
		if (skillPaths.length === 0 && promptPaths.length === 0 && themePaths.length === 0) return;
		const extensionPaths = {
			skillPaths: this.buildExtensionResourcePaths(skillPaths),
			promptPaths: this.buildExtensionResourcePaths(promptPaths),
			themePaths: this.buildExtensionResourcePaths(themePaths)
		};
		this.sessionResourceLoader.extendResources(extensionPaths);
		this.baseSystemPrompt = this.rebuildSystemPrompt(this.getActiveToolNames());
		this.agent.state.systemPrompt = this.baseSystemPrompt;
	}
	buildExtensionResourcePaths(entries) {
		return entries.map((entry) => {
			const source = this.getExtensionSourceLabel(entry.extensionPath);
			const baseDir = entry.extensionPath.startsWith("<") ? void 0 : dirname(entry.extensionPath);
			return {
				path: entry.path,
				metadata: {
					source,
					scope: "temporary",
					origin: "top-level",
					baseDir
				}
			};
		});
	}
	getExtensionSourceLabel(extensionPath) {
		if (extensionPath.startsWith("<")) return `extension:${extensionPath.replace(/[<>]/g, "")}`;
		return `extension:${basename(extensionPath).replace(/\.(ts|js)$/, "")}`;
	}
	applyExtensionBindings(runner) {
		runner.setUIContext(this.extensionUIContext);
		runner.bindCommandContext(this.extensionCommandContextActions);
		this.extensionErrorUnsubscriber?.();
		this.extensionErrorUnsubscriber = this.extensionErrorListener ? runner.onError(this.extensionErrorListener) : void 0;
	}
	refreshCurrentModelFromRegistry() {
		const currentModel = this.model;
		if (!currentModel) return;
		const refreshedModel = this.sessionModelRegistry.find(currentModel.provider, currentModel.id);
		if (!refreshedModel || refreshedModel === currentModel) return;
		this.agent.state.model = refreshedModel;
	}
	bindExtensionCore(runner) {
		const getCommands = () => {
			const extensionCommands = runner.getRegisteredCommands().map((command) => ({
				name: command.invocationName,
				description: command.description,
				source: "extension",
				sourceInfo: command.sourceInfo
			}));
			const templates = this.promptTemplates.map((template) => ({
				name: template.name,
				description: template.description,
				source: "prompt",
				sourceInfo: template.sourceInfo
			}));
			const skills = this.sessionResourceLoader.getSkills().skills.map((skill) => ({
				name: `skill:${skill.name}`,
				description: skill.description,
				source: "skill",
				sourceInfo: skill.sourceInfo
			}));
			return [
				...extensionCommands,
				...templates,
				...skills
			];
		};
		runner.bindCore({
			sendMessage: (message, options) => {
				this.sendCustomMessage(message, options).catch((err) => {
					runner.emitError({
						extensionPath: "<runtime>",
						event: "send_message",
						error: err instanceof Error ? err.message : String(err)
					});
				});
			},
			sendUserMessage: (content, options) => {
				this.sendUserMessage(content, options).catch((err) => {
					runner.emitError({
						extensionPath: "<runtime>",
						event: "send_user_message",
						error: err instanceof Error ? err.message : String(err)
					});
				});
			},
			appendEntry: (customType, data) => {
				this.sessionManager.appendCustomEntry(customType, data);
			},
			setSessionName: (name) => {
				this.setSessionName(name);
			},
			getSessionName: () => {
				return this.sessionManager.getSessionName();
			},
			setLabel: (entryId, label) => {
				this.sessionManager.appendLabelChange(entryId, label);
			},
			getActiveTools: () => this.getActiveToolNames(),
			getAllTools: () => this.getAllTools(),
			setActiveTools: (toolNames) => this.setActiveToolsByName(toolNames),
			refreshTools: () => this.refreshToolRegistry(),
			getCommands,
			setModel: async (model) => {
				if (!this.sessionModelRegistry.hasConfiguredAuth(model)) return false;
				await this.setModel(model);
				return true;
			},
			getThinkingLevel: () => this.thinkingLevel,
			setThinkingLevel: (level) => this.setThinkingLevel(level)
		}, {
			getModel: () => this.model,
			isIdle: () => !this.isStreaming,
			getSignal: () => this.agent.signal,
			abort: () => {
				if (this.extensionAbortHandler) {
					this.extensionAbortHandler();
					return;
				}
				this.abort();
			},
			hasPendingMessages: () => this.pendingMessageCount > 0,
			shutdown: () => {
				this.extensionShutdownHandler?.();
			},
			getContextUsage: () => this.getContextUsage(),
			compact: (options) => {
				(async () => {
					try {
						const result = await this.compact(options?.customInstructions);
						options?.onComplete?.(result);
					} catch (error) {
						const err = error instanceof Error ? error : new Error(String(error));
						options?.onError?.(err);
					}
				})();
			},
			getSystemPrompt: () => this.systemPrompt
		}, {
			registerProvider: (name, config) => {
				this.sessionModelRegistry.registerProvider(name, config);
				this.refreshCurrentModelFromRegistry();
			},
			unregisterProvider: (name) => {
				this.sessionModelRegistry.unregisterProvider(name);
				this.refreshCurrentModelFromRegistry();
			}
		});
	}
	/** Replace a runtime-owned tool surface without restarting its active agent loop. */
	replaceCustomTools(customTools, activeToolNames) {
		this.customTools = customTools;
		this.allowedToolNames = new Set(activeToolNames);
		this.refreshToolRegistry({ activeToolNames });
	}
	refreshToolRegistry(options) {
		const previousRegistryNames = new Set(this.toolRegistry.keys());
		const previousActiveToolNames = this.getActiveToolNames();
		const allowedToolNames = this.allowedToolNames;
		const isDisabledBuiltInToolName = (name) => this.disableBuiltInTools && this.baseToolDefinitions.has(name);
		const isAllowedTool = (name) => !isDisabledBuiltInToolName(name) && (!allowedToolNames || allowedToolNames.has(name));
		const allCustomTools = [...this.currentExtensionRunner.getAllRegisteredTools(), ...this.customTools.map((definition) => ({
			definition,
			sourceInfo: createSyntheticSourceInfo(`<sdk:${definition.name}>`, { source: "sdk" })
		}))].filter((tool) => isAllowedTool(tool.definition.name));
		const definitionRegistry = new Map(Array.from(this.baseToolDefinitions.entries()).filter(([name]) => isAllowedTool(name)).map(([name, definition]) => [name, {
			definition,
			sourceInfo: createSyntheticSourceInfo(`<builtin:${name}>`, { source: "builtin" })
		}]));
		for (const tool of allCustomTools) definitionRegistry.set(tool.definition.name, {
			definition: tool.definition,
			sourceInfo: tool.sourceInfo
		});
		this.toolDefinitions = definitionRegistry;
		this.toolPromptSnippets = new Map(Array.from(definitionRegistry.values()).map(({ definition }) => {
			const snippet = this.normalizePromptSnippet(definition.promptSnippet);
			return snippet ? [definition.name, snippet] : void 0;
		}).filter((entry) => entry !== void 0));
		this.toolPromptGuidelines = new Map(Array.from(definitionRegistry.values()).map(({ definition }) => {
			const guidelines = this.normalizePromptGuidelines(definition.promptGuidelines);
			return guidelines.length > 0 ? [definition.name, guidelines] : void 0;
		}).filter((entry) => entry !== void 0));
		const runner = this.currentExtensionRunner;
		const wrappedExtensionTools = wrapRegisteredTools(allCustomTools, runner);
		const wrappedBuiltInTools = wrapRegisteredTools(Array.from(this.baseToolDefinitions.values()).filter((definition) => isAllowedTool(definition.name)).map((definition) => ({
			definition,
			sourceInfo: createSyntheticSourceInfo(`<builtin:${definition.name}>`, { source: "builtin" })
		})), runner);
		const toolRegistry = new Map(wrappedBuiltInTools.map((tool) => [tool.name, tool]));
		for (const tool of wrappedExtensionTools) toolRegistry.set(tool.name, tool);
		this.toolRegistry = toolRegistry;
		const nextActiveToolNames = (options?.activeToolNames ? [...options.activeToolNames] : [...previousActiveToolNames]).filter((name) => isAllowedTool(name));
		if (allowedToolNames) {
			for (const toolName of this.toolRegistry.keys()) if (allowedToolNames.has(toolName)) nextActiveToolNames.push(toolName);
		} else if (options?.includeAllExtensionTools) for (const tool of wrappedExtensionTools) nextActiveToolNames.push(tool.name);
		else if (!options?.activeToolNames) {
			for (const toolName of this.toolRegistry.keys()) if (!previousRegistryNames.has(toolName)) nextActiveToolNames.push(toolName);
		}
		this.setActiveToolsByName([...new Set(nextActiveToolNames)]);
	}
	buildRuntime(options) {
		const autoResizeImages = this.settingsManager.getImageAutoResize();
		const shellCommandPrefix = this.settingsManager.getShellCommandPrefix();
		const shellPath = this.settingsManager.getShellPath();
		const baseToolDefinitions = this.baseToolsOverride ? Object.fromEntries(Object.entries(this.baseToolsOverride).map(([name, tool]) => [name, createToolDefinitionFromAgentTool(tool)])) : createAllToolDefinitions(this.cwd, {
			read: { autoResizeImages },
			bash: {
				commandPrefix: shellCommandPrefix,
				shellPath
			}
		});
		this.baseToolDefinitions = new Map(Object.entries(baseToolDefinitions).map(([name, tool]) => [name, tool]));
		const extensionsResult = this.sessionResourceLoader.getExtensions();
		if (options.flagValues) for (const [name, value] of options.flagValues) extensionsResult.runtime.flagValues.set(name, value);
		this.currentExtensionRunner = new ExtensionRunner(extensionsResult.extensions, extensionsResult.runtime, this.cwd, this.sessionManager, this.sessionModelRegistry);
		if (this.extensionRunnerRef) this.extensionRunnerRef.current = this.currentExtensionRunner;
		this.bindExtensionCore(this.currentExtensionRunner);
		this.applyExtensionBindings(this.currentExtensionRunner);
		const defaultActiveToolNames = this.baseToolsOverride ? Object.keys(this.baseToolsOverride) : [
			"read",
			"bash",
			"edit",
			"write"
		];
		const baseActiveToolNames = options.activeToolNames ?? defaultActiveToolNames;
		this.refreshToolRegistry({
			activeToolNames: baseActiveToolNames,
			includeAllExtensionTools: options.includeAllExtensionTools
		});
	}
	async reload() {
		const previousFlagValues = this.currentExtensionRunner.getFlagValues();
		await emitSessionShutdownEvent(this.currentExtensionRunner, {
			type: "session_shutdown",
			reason: "reload"
		});
		await this.settingsManager.reload();
		this.agent.steeringMode = this.settingsManager.getSteeringMode();
		this.agent.followUpMode = this.settingsManager.getFollowUpMode();
		await this.sessionResourceLoader.reload();
		this.sessionModelRegistry.refresh();
		this.buildRuntime({
			activeToolNames: this.getActiveToolNames(),
			flagValues: previousFlagValues,
			includeAllExtensionTools: true
		});
		if (this.extensionUIContext || this.extensionCommandContextActions || this.extensionShutdownHandler || this.extensionErrorListener) {
			await this.currentExtensionRunner.emit({
				type: "session_start",
				reason: "reload"
			});
			await this.extendResourcesFromExtensions("reload");
		}
	}
};
//#endregion
//#region src/agents/sessions/agent-session-execution.ts
var AgentSessionExecution = class extends AgentSessionExtensions {
	/**
	* Check if an error is retryable (overloaded, rate limit, server errors).
	* Context overflow errors are NOT retryable (handled by compaction instead).
	*/
	isRetryableError(message) {
		if (message.stopReason !== "error" || !message.errorMessage) return false;
		const contextWindow = this.model?.contextWindow ?? 0;
		if (isContextOverflow(message, contextWindow)) return false;
		return isResponsesOutputLimitToolCallError(message) || isRetryableAssistantError(message);
	}
	/**
	* Prepare a retryable error for continuation with exponential backoff.
	* @returns true if the caller should continue the agent, false otherwise
	*/
	async prepareRetry(message) {
		const settings = this.settingsManager.getRetrySettings();
		if (!settings.enabled) return false;
		this.retryCount++;
		if (this.retryCount > settings.maxRetries) {
			this.retryCount--;
			return false;
		}
		const backoffDelayMs = settings.baseDelayMs * 2 ** (this.retryCount - 1);
		const rateLimitWindow = classifyRateLimitWindow(message.errorMessage);
		const retryAfterDelayMs = rateLimitWindow.kind === "short" && rateLimitWindow.retryAfterSeconds !== void 0 ? Math.ceil(rateLimitWindow.retryAfterSeconds * 1e3) : 0;
		const delayMs = Math.max(backoffDelayMs, retryAfterDelayMs);
		this.emit({
			type: "auto_retry_start",
			attempt: this.retryCount,
			maxAttempts: settings.maxRetries,
			delayMs,
			errorMessage: message.errorMessage || "Unknown error"
		});
		const messages = this.agent.state.messages;
		const failedIndex = messages.findLastIndex((candidate) => candidate === message);
		if (failedIndex >= 0) this.agent.state.messages = messages.toSpliced(failedIndex, 1);
		this.retryAbortController = new AbortController();
		try {
			await sleep(delayMs, this.retryAbortController.signal);
		} catch {
			const attempt = this.retryCount;
			this.retryCount = 0;
			this.emit({
				type: "auto_retry_end",
				success: false,
				attempt,
				finalError: "Retry cancelled"
			});
			return false;
		} finally {
			this.retryAbortController = void 0;
		}
		return true;
	}
	/**
	* Cancel in-progress retry.
	*/
	abortRetry() {
		this.retryAbortController?.abort();
	}
	/** Whether auto-retry is currently in progress */
	get isRetrying() {
		return this.retryAbortController !== void 0;
	}
	/** Whether auto-retry is enabled */
	get autoRetryEnabled() {
		return this.settingsManager.getRetryEnabled();
	}
	/**
	* Toggle auto-retry setting.
	*/
	setAutoRetryEnabled(enabled) {
		this.settingsManager.setRetryEnabled(enabled);
	}
};
//#endregion
//#region src/agents/sessions/agent-session-tree.ts
var AgentSessionTree = class extends AgentSessionExecution {
	/**
	* Navigate to a different node in the session tree.
	* Unlike fork() which creates a new session file, this stays in the same file.
	*
	* @param targetId The entry ID to navigate to
	* @param options.summarize Whether user wants to summarize abandoned branch
	* @param options.customInstructions Custom instructions for summarizer
	* @param options.replaceInstructions If true, customInstructions replaces the default prompt
	* @param options.label Label to attach to the branch summary entry
	* @returns Result with editorText (if user message) and cancelled status
	*/
	async navigateTree(targetId, options = {}) {
		const oldLeafId = this.sessionManager.getLeafId();
		if (targetId === oldLeafId) return { cancelled: false };
		if (options.summarize && !this.model) throw new Error("No model available for summarization");
		const targetEntry = this.sessionManager.getEntry(targetId);
		if (!targetEntry) throw new Error(`Entry ${targetId} not found`);
		const { entries: entriesToSummarize, commonAncestorId } = oldLeafId ? collectEntriesForBranchSummaryFromBranches(this.sessionManager.getBranch(oldLeafId), this.sessionManager.getBranch(targetId)) : {
			entries: [],
			commonAncestorId: null
		};
		let customInstructions = options.customInstructions;
		let replaceInstructions = options.replaceInstructions;
		let label = options.label;
		const preparation = {
			targetId,
			oldLeafId,
			commonAncestorId,
			entriesToSummarize,
			userWantsSummary: options.summarize ?? false,
			customInstructions,
			replaceInstructions,
			label
		};
		const abortController = new AbortController();
		this.branchSummaryAbortController = abortController;
		try {
			let extensionSummary;
			let fromExtension = false;
			if (this.currentExtensionRunner.hasHandlers("session_before_tree")) {
				const result = await this.currentExtensionRunner.emit({
					type: "session_before_tree",
					preparation,
					signal: abortController.signal
				});
				if (result?.cancel) return { cancelled: true };
				if (result?.summary && options.summarize) {
					extensionSummary = result.summary;
					fromExtension = true;
				}
				if (result?.customInstructions !== void 0) customInstructions = result.customInstructions;
				if (result?.replaceInstructions !== void 0) replaceInstructions = result.replaceInstructions;
				if (result?.label !== void 0) label = result.label;
			}
			let summaryText;
			let summaryDetails;
			if (options.summarize && entriesToSummarize.length > 0 && !extensionSummary) {
				const model = this.model;
				const { apiKey, headers } = await this.getRequiredRequestAuth(model);
				const branchSummarySettings = this.settingsManager.getBranchSummarySettings();
				const result = normalizeBranchSummaryResult(await generateBranchSummary$1(entriesToSummarize, {
					model,
					apiKey,
					headers,
					signal: abortController.signal,
					customInstructions,
					replaceInstructions,
					reserveTokens: branchSummarySettings.reserveTokens,
					streamFn: this.agent.streamFn,
					runtime: createCompactionRuntime((usage) => recordSessionModelUsage(this.sessionManager, usage))
				}));
				if (result.aborted) return {
					cancelled: true,
					aborted: true
				};
				if (result.error) throw new Error(result.error);
				summaryText = result.summary;
				summaryDetails = {
					readFiles: result.readFiles || [],
					modifiedFiles: result.modifiedFiles || []
				};
			} else if (extensionSummary) {
				summaryText = extensionSummary.summary;
				summaryDetails = extensionSummary.details;
			}
			let newLeafId;
			let editorText;
			if (targetEntry.type === "message" && targetEntry.message.role === "user") {
				newLeafId = targetEntry.parentId;
				editorText = extractTextContent(targetEntry.message.content);
			} else if (targetEntry.type === "custom_message") {
				newLeafId = targetEntry.parentId;
				editorText = extractTextContent(targetEntry.content);
			} else newLeafId = targetId;
			const navigation = await withSessionManagerWrite(this.sessionManager, () => {
				if (abortController.signal.aborted || this.branchSummaryAbortController !== abortController) return {
					cancelled: true,
					aborted: true
				};
				let summaryEntry;
				if (summaryText) {
					const summaryId = this.sessionManager.branchWithSummary(newLeafId, summaryText, summaryDetails, fromExtension);
					summaryEntry = this.sessionManager.getEntry(summaryId);
					if (label) this.sessionManager.appendLabelChange(summaryId, label);
				} else if (newLeafId === null) this.sessionManager.resetLeaf();
				else this.sessionManager.branch(newLeafId);
				if (label && !summaryText) this.sessionManager.appendLabelChange(targetId, label);
				const sessionContext = this.sessionManager.buildSessionContext();
				this.agent.state.messages = sanitizeCompactionReplayMessages(sessionContext.messages);
				return {
					cancelled: false,
					summaryEntry
				};
			});
			if (navigation.cancelled) return navigation;
			const { summaryEntry } = navigation;
			await this.currentExtensionRunner.emit({
				type: "session_tree",
				newLeafId: this.sessionManager.getLeafId(),
				oldLeafId,
				summaryEntry,
				fromExtension: summaryText ? fromExtension : void 0
			});
			return {
				editorText,
				cancelled: false,
				summaryEntry
			};
		} finally {
			if (this.branchSummaryAbortController === abortController) this.branchSummaryAbortController = void 0;
		}
	}
	/**
	* Get all user messages from session for fork selector.
	*/
	getUserMessagesForForking() {
		const entries = this.sessionManager.getEntries();
		const result = [];
		for (const entry of entries) {
			if (entry.type !== "message") continue;
			if (entry.message.role !== "user") continue;
			const text = extractTextContent(entry.message.content);
			if (text) result.push({
				entryId: entry.id,
				text
			});
		}
		return result;
	}
	createReplacedSessionContext() {
		const context = Object.defineProperties({}, Object.getOwnPropertyDescriptors(this.currentExtensionRunner.createCommandContext()));
		context.sendMessage = (message, options) => this.sendCustomMessage(message, options);
		context.sendUserMessage = (content, options) => this.sendUserMessage(content, options);
		return context;
	}
	/**
	* Check if extensions have handlers for a specific event type.
	*/
	hasExtensionHandlers(eventType) {
		return this.currentExtensionRunner.hasHandlers(eventType);
	}
	/**
	* Get the extension runner (for setting UI context and error handlers).
	*/
	get extensionRunner() {
		return this.currentExtensionRunner;
	}
};
//#endregion
//#region src/agents/sessions/agent-session.ts
/**
* Core abstraction for agent lifecycle and session management.
*
* Shared by interactive, print, and RPC modes. Mode-specific I/O stays above
* this class while the feature layers below own session behavior.
*/
var AgentSession = class extends AgentSessionTree {
	constructor(config) {
		super(config);
		this.unsubscribeAgent = this.agent.subscribe(this.handleAgentEvent);
		this.installAgentToolHooks();
		this.buildRuntime({
			activeToolNames: this.initialActiveToolNames,
			includeAllExtensionTools: true
		});
	}
};
//#endregion
//#region src/agents/sessions/resource-loader.ts
/**
* Session resource loader.
*
* Loads extensions, skills, prompts, themes, AGENTS files, and system prompt fragments for a cwd.
*/
const EMPTY_RESOLVED_PATHS = {
	extensions: [],
	skills: [],
	prompts: [],
	themes: []
};
function resolvePromptInput(input, description) {
	if (!input) return;
	if (existsSync(input)) try {
		return readFileSync(input, "utf-8");
	} catch (error) {
		console.error(chalk.yellow(`Warning: Could not read ${description} file ${input}: ${String(error)}`));
		return;
	}
	return input;
}
function loadContextFileFromDir(dir) {
	for (const filename of [
		"AGENTS.md",
		"AGENTS.MD",
		"CLAUDE.md",
		"CLAUDE.MD"
	]) {
		const filePath = join(dir, filename);
		if (existsSync(filePath)) try {
			return {
				path: filePath,
				content: readFileSync(filePath, "utf-8")
			};
		} catch (error) {
			console.error(chalk.yellow(`Warning: Could not read ${filePath}: ${String(error)}`));
		}
	}
	return null;
}
function loadProjectContextFiles(options) {
	const resolvedCwd = options.cwd;
	const resolvedAgentDir = options.agentDir;
	const contextFiles = [];
	const seenPaths = /* @__PURE__ */ new Set();
	const globalContext = loadContextFileFromDir(resolvedAgentDir);
	if (globalContext) {
		contextFiles.push(globalContext);
		seenPaths.add(globalContext.path);
	}
	const ancestorContextFiles = [];
	let currentDir = resolvedCwd;
	const root = resolve("/");
	while (true) {
		const contextFile = loadContextFileFromDir(currentDir);
		if (contextFile && !seenPaths.has(contextFile.path)) {
			ancestorContextFiles.unshift(contextFile);
			seenPaths.add(contextFile.path);
		}
		if (currentDir === root) break;
		const parentDir = resolve(currentDir, "..");
		if (parentDir === currentDir) break;
		currentDir = parentDir;
	}
	contextFiles.push(...ancestorContextFiles);
	return contextFiles;
}
var DefaultResourceLoader = class {
	constructor(options) {
		this.loaded = false;
		this.cwd = options.cwd;
		this.agentDir = options.agentDir;
		this.settingsManager = options.settingsManager ?? SettingsManager.create(this.cwd, this.agentDir);
		this.eventBus = options.eventBus ?? createEventBus();
		this.packageManager = new DefaultPackageManager({
			cwd: this.cwd,
			agentDir: this.agentDir,
			settingsManager: this.settingsManager
		});
		this.additionalExtensionPaths = options.additionalExtensionPaths ?? [];
		this.additionalSkillPaths = options.additionalSkillPaths ?? [];
		this.additionalPromptTemplatePaths = options.additionalPromptTemplatePaths ?? [];
		this.additionalThemePaths = options.additionalThemePaths ?? [];
		this.extensionFactories = options.extensionFactories ?? [];
		this.noExtensions = options.noExtensions ?? false;
		this.noSkills = options.noSkills ?? false;
		this.noPromptTemplates = options.noPromptTemplates ?? false;
		this.noThemes = options.noThemes ?? false;
		this.noContextFiles = options.noContextFiles ?? false;
		this.systemPromptSource = options.systemPrompt;
		this.appendSystemPromptSource = options.appendSystemPrompt;
		this.extensionsOverride = options.extensionsOverride;
		this.skillsOverride = options.skillsOverride;
		this.promptsOverride = options.promptsOverride;
		this.themesOverride = options.themesOverride;
		this.agentsFilesOverride = options.agentsFilesOverride;
		this.systemPromptTransform = options.systemPromptTransform;
		this.appendSystemPromptTransform = options.appendSystemPromptTransform;
		this.extensionsResult = {
			extensions: [],
			errors: [],
			runtime: createExtensionRuntime()
		};
		this.skills = [];
		this.skillDiagnostics = [];
		this.prompts = [];
		this.promptDiagnostics = [];
		this.themes = [];
		this.themeDiagnostics = [];
		this.agentsFiles = [];
		this.appendSystemPrompt = [];
		this.lastSkillPaths = [];
		this.extensionSkillSourceInfos = /* @__PURE__ */ new Map();
		this.extensionPromptSourceInfos = /* @__PURE__ */ new Map();
		this.extensionThemeSourceInfos = /* @__PURE__ */ new Map();
		this.lastPromptPaths = [];
		this.lastThemePaths = [];
	}
	getExtensions() {
		return this.extensionsResult;
	}
	getSkills() {
		return {
			skills: this.skills,
			diagnostics: this.skillDiagnostics
		};
	}
	getPrompts() {
		return {
			prompts: this.prompts,
			diagnostics: this.promptDiagnostics
		};
	}
	getThemes() {
		return {
			themes: this.themes,
			diagnostics: this.themeDiagnostics
		};
	}
	getAgentsFiles() {
		return { agentsFiles: this.agentsFiles };
	}
	getSystemPrompt() {
		return this.systemPrompt;
	}
	getAppendSystemPrompt() {
		return this.appendSystemPrompt;
	}
	extendResources(paths) {
		const skillPaths = this.normalizeExtensionPaths(paths.skillPaths ?? []);
		const promptPaths = this.normalizeExtensionPaths(paths.promptPaths ?? []);
		const themePaths = this.normalizeExtensionPaths(paths.themePaths ?? []);
		for (const entry of skillPaths) this.extensionSkillSourceInfos.set(entry.path, createSourceInfo(entry.path, entry.metadata));
		for (const entry of promptPaths) this.extensionPromptSourceInfos.set(entry.path, createSourceInfo(entry.path, entry.metadata));
		for (const entry of themePaths) this.extensionThemeSourceInfos.set(entry.path, createSourceInfo(entry.path, entry.metadata));
		if (skillPaths.length > 0) {
			this.lastSkillPaths = this.mergePaths(this.lastSkillPaths, skillPaths.map((entry) => entry.path));
			this.updateSkillsFromPaths(this.lastSkillPaths);
		}
		if (promptPaths.length > 0) {
			this.lastPromptPaths = this.mergePaths(this.lastPromptPaths, promptPaths.map((entry) => entry.path));
			this.updatePromptsFromPaths(this.lastPromptPaths);
		}
		if (themePaths.length > 0) {
			this.lastThemePaths = this.mergePaths(this.lastThemePaths, themePaths.map((entry) => entry.path));
			this.updateThemesFromPaths(this.lastThemePaths);
		}
	}
	async reload() {
		if (this.loaded) clearExtensionCache();
		await this.settingsManager.reload();
		const resolvedPaths = this.noExtensions && this.noSkills && this.noPromptTemplates && this.noThemes ? EMPTY_RESOLVED_PATHS : await this.packageManager.resolve();
		const cliExtensionPaths = await this.packageManager.resolveExtensionSources(this.additionalExtensionPaths, { temporary: true });
		const metadataByPath = /* @__PURE__ */ new Map();
		this.extensionSkillSourceInfos = /* @__PURE__ */ new Map();
		this.extensionPromptSourceInfos = /* @__PURE__ */ new Map();
		this.extensionThemeSourceInfos = /* @__PURE__ */ new Map();
		const getEnabledResources = (resources) => {
			for (const r of resources) if (!metadataByPath.has(r.path)) metadataByPath.set(r.path, r.metadata);
			return resources.filter((r) => r.enabled);
		};
		const getEnabledPaths = (resources) => getEnabledResources(resources).map((r) => r.path);
		const enabledExtensions = getEnabledPaths(resolvedPaths.extensions);
		const enabledSkillResources = getEnabledResources(resolvedPaths.skills);
		const enabledPrompts = getEnabledPaths(resolvedPaths.prompts);
		const enabledThemes = getEnabledPaths(resolvedPaths.themes);
		const mapSkillPath = (resource) => {
			if (resource.metadata.source !== "auto" && resource.metadata.origin !== "package") return resource.path;
			try {
				if (!statSync(resource.path).isDirectory()) return resource.path;
			} catch {
				return resource.path;
			}
			const skillFile = join(resource.path, "SKILL.md");
			if (existsSync(skillFile)) {
				if (!metadataByPath.has(skillFile)) metadataByPath.set(skillFile, resource.metadata);
				return skillFile;
			}
			return resource.path;
		};
		const enabledSkills = enabledSkillResources.map(mapSkillPath);
		for (const r of [...cliExtensionPaths.extensions, ...cliExtensionPaths.skills]) if (!metadataByPath.has(r.path)) metadataByPath.set(r.path, {
			source: "cli",
			scope: "temporary",
			origin: "top-level"
		});
		const cliEnabledExtensions = getEnabledPaths(cliExtensionPaths.extensions);
		const cliEnabledSkills = getEnabledPaths(cliExtensionPaths.skills);
		const cliEnabledPrompts = getEnabledPaths(cliExtensionPaths.prompts);
		const cliEnabledThemes = getEnabledPaths(cliExtensionPaths.themes);
		const extensionsResult = await loadExtensionsCached(this.noExtensions ? cliEnabledExtensions : this.mergePaths(cliEnabledExtensions, enabledExtensions), this.cwd, this.eventBus);
		const inlineExtensions = await this.loadExtensionFactories(extensionsResult.runtime);
		extensionsResult.extensions.push(...inlineExtensions.extensions);
		extensionsResult.errors.push(...inlineExtensions.errors);
		const conflicts = this.detectExtensionConflicts(extensionsResult.extensions);
		for (const conflict of conflicts) extensionsResult.errors.push({
			path: conflict.path,
			error: conflict.message
		});
		for (const p of this.additionalExtensionPaths) if (isLocalPath(p) && !existsSync(p)) extensionsResult.errors.push({
			path: p,
			error: `Extension path does not exist: ${p}`
		});
		this.extensionsResult = this.extensionsOverride ? this.extensionsOverride(extensionsResult) : extensionsResult;
		this.applyExtensionSourceInfo(this.extensionsResult.extensions, metadataByPath);
		const skillPaths = this.noSkills ? this.mergePaths(cliEnabledSkills, this.additionalSkillPaths) : this.mergePaths([...cliEnabledSkills, ...enabledSkills], this.additionalSkillPaths);
		this.lastSkillPaths = skillPaths;
		this.updateSkillsFromPaths(skillPaths, metadataByPath);
		for (const p of this.additionalSkillPaths) if (isLocalPath(p) && !existsSync(p) && !this.skillDiagnostics.some((d) => d.path === p)) this.skillDiagnostics.push({
			type: "error",
			message: "Skill path does not exist",
			path: p
		});
		const promptPaths = this.noPromptTemplates ? this.mergePaths(cliEnabledPrompts, this.additionalPromptTemplatePaths) : this.mergePaths([...cliEnabledPrompts, ...enabledPrompts], this.additionalPromptTemplatePaths);
		this.lastPromptPaths = promptPaths;
		this.updatePromptsFromPaths(promptPaths, metadataByPath);
		for (const p of this.additionalPromptTemplatePaths) if (isLocalPath(p) && !existsSync(p) && !this.promptDiagnostics.some((d) => d.path === p)) this.promptDiagnostics.push({
			type: "error",
			message: "Prompt template path does not exist",
			path: p
		});
		const themePaths = this.noThemes ? this.mergePaths(cliEnabledThemes, this.additionalThemePaths) : this.mergePaths([...cliEnabledThemes, ...enabledThemes], this.additionalThemePaths);
		this.lastThemePaths = themePaths;
		this.updateThemesFromPaths(themePaths, metadataByPath);
		for (const p of this.additionalThemePaths) if (!existsSync(p) && !this.themeDiagnostics.some((d) => d.path === p)) this.themeDiagnostics.push({
			type: "error",
			message: "Theme path does not exist",
			path: p
		});
		const agentsFiles = { agentsFiles: this.noContextFiles ? [] : loadProjectContextFiles({
			cwd: this.cwd,
			agentDir: this.agentDir
		}) };
		const resolvedAgentsFiles = this.agentsFilesOverride ? this.agentsFilesOverride(agentsFiles) : agentsFiles;
		this.agentsFiles = resolvedAgentsFiles.agentsFiles;
		const baseSystemPrompt = resolvePromptInput(this.systemPromptSource ?? this.discoverPromptFile("SYSTEM.md"), "system prompt");
		this.systemPrompt = this.systemPromptTransform ? this.systemPromptTransform(baseSystemPrompt) : baseSystemPrompt;
		const baseAppend = (this.appendSystemPromptSource ?? (this.discoverPromptFile("APPEND_SYSTEM.md") ? [this.discoverPromptFile("APPEND_SYSTEM.md")] : [])).map((s) => resolvePromptInput(s, "append system prompt")).filter((s) => s !== void 0);
		this.appendSystemPrompt = this.appendSystemPromptTransform ? this.appendSystemPromptTransform(baseAppend) : baseAppend;
		this.loaded = true;
	}
	normalizeExtensionPaths(entries) {
		return entries.map((entry) => ({
			path: this.resolveResourcePath(entry.path),
			metadata: entry.metadata
		}));
	}
	updateSkillsFromPaths(skillPaths, metadataByPath) {
		let skillsResult;
		if (this.noSkills && skillPaths.length === 0) skillsResult = {
			skills: [],
			diagnostics: []
		};
		else skillsResult = loadSkills({
			cwd: this.cwd,
			agentDir: this.agentDir,
			skillPaths,
			includeDefaults: false
		});
		const resolvedSkills = this.skillsOverride ? this.skillsOverride(skillsResult) : skillsResult;
		this.skills = resolvedSkills.skills.map((skill) => ({
			...skill,
			sourceInfo: this.findSourceInfoForPath(skill.filePath, this.extensionSkillSourceInfos, metadataByPath) ?? skill.sourceInfo ?? this.getDefaultSourceInfoForPath(skill.filePath)
		}));
		this.skillDiagnostics = resolvedSkills.diagnostics;
	}
	updatePromptsFromPaths(promptPaths, metadataByPath) {
		let promptsResult;
		if (this.noPromptTemplates && promptPaths.length === 0) promptsResult = {
			prompts: [],
			diagnostics: []
		};
		else {
			const allPrompts = loadPromptTemplates({
				cwd: this.cwd,
				agentDir: this.agentDir,
				promptPaths,
				includeDefaults: false
			});
			promptsResult = this.dedupePrompts(allPrompts);
		}
		const resolvedPrompts = this.promptsOverride ? this.promptsOverride(promptsResult) : promptsResult;
		this.prompts = resolvedPrompts.prompts.map((prompt) => ({
			...prompt,
			sourceInfo: this.findSourceInfoForPath(prompt.filePath, this.extensionPromptSourceInfos, metadataByPath) ?? prompt.sourceInfo ?? this.getDefaultSourceInfoForPath(prompt.filePath)
		}));
		this.promptDiagnostics = resolvedPrompts.diagnostics;
	}
	updateThemesFromPaths(themePaths, metadataByPath) {
		let themesResult;
		if (this.noThemes && themePaths.length === 0) themesResult = {
			themes: [],
			diagnostics: []
		};
		else {
			const loaded = this.loadThemes(themePaths);
			const deduped = this.dedupeThemes(loaded.themes);
			themesResult = {
				themes: deduped.themes,
				diagnostics: [...loaded.diagnostics, ...deduped.diagnostics]
			};
		}
		const resolvedThemes = this.themesOverride ? this.themesOverride(themesResult) : themesResult;
		this.themes = resolvedThemes.themes.map((theme) => {
			const sourcePath = theme.sourcePath;
			theme.sourceInfo = sourcePath ? this.findSourceInfoForPath(sourcePath, this.extensionThemeSourceInfos, metadataByPath) ?? theme.sourceInfo ?? this.getDefaultSourceInfoForPath(sourcePath) : theme.sourceInfo;
			return theme;
		});
		this.themeDiagnostics = resolvedThemes.diagnostics;
	}
	applyExtensionSourceInfo(extensions, metadataByPath) {
		for (const extension of extensions) {
			extension.sourceInfo = this.findSourceInfoForPath(extension.path, void 0, metadataByPath) ?? this.getDefaultSourceInfoForPath(extension.path);
			for (const command of extension.commands.values()) command.sourceInfo = extension.sourceInfo;
			for (const tool of extension.tools.values()) tool.sourceInfo = extension.sourceInfo;
		}
	}
	findSourceInfoForPath(resourcePath, extraSourceInfos, metadataByPath) {
		if (!resourcePath) return;
		if (resourcePath.startsWith("<")) return this.getDefaultSourceInfoForPath(resourcePath);
		const normalizedResourcePath = resolve(resourcePath);
		if (extraSourceInfos) for (const [sourcePath, sourceInfo] of extraSourceInfos.entries()) {
			const normalizedSourcePath = resolve(sourcePath);
			if (isPathInside(normalizedSourcePath, normalizedResourcePath)) return {
				...sourceInfo,
				path: resourcePath
			};
		}
		if (metadataByPath) {
			const exact = metadataByPath.get(normalizedResourcePath) ?? metadataByPath.get(resourcePath);
			if (exact) return createSourceInfo(resourcePath, exact);
			for (const [sourcePath, metadata] of metadataByPath.entries()) {
				const normalizedSourcePath = resolve(sourcePath);
				if (isPathInside(normalizedSourcePath, normalizedResourcePath)) return createSourceInfo(resourcePath, metadata);
			}
		}
	}
	getDefaultSourceInfoForPath(filePath) {
		if (filePath.startsWith("<") && filePath.endsWith(">")) return {
			path: filePath,
			source: filePath.slice(1, -1).split(":")[0] || "temporary",
			scope: "temporary",
			origin: "top-level"
		};
		const normalizedPath = resolve(filePath);
		for (const [baseDir, scope] of [[this.agentDir, "user"], [join(this.cwd, CONFIG_DIR_NAME), "project"]]) for (const resource of [
			"skills",
			"prompts",
			"themes",
			"extensions"
		]) {
			const root = join(baseDir, resource);
			if (isPathInside(root, normalizedPath)) return {
				path: filePath,
				source: "local",
				scope,
				origin: "top-level",
				baseDir: root
			};
		}
		return {
			path: filePath,
			source: "local",
			scope: "temporary",
			origin: "top-level",
			baseDir: statSync(normalizedPath).isDirectory() ? normalizedPath : resolve(normalizedPath, "..")
		};
	}
	mergePaths(primary, additional) {
		const merged = [];
		const seen = /* @__PURE__ */ new Set();
		for (const p of [...primary, ...additional]) {
			const resolved = this.resolveResourcePath(p);
			const canonicalPath = canonicalizePath(resolved);
			if (seen.has(canonicalPath)) continue;
			seen.add(canonicalPath);
			merged.push(resolved);
		}
		return merged;
	}
	resolveResourcePath(p) {
		const trimmed = p.trim();
		let expanded = trimmed;
		if (trimmed === "~") expanded = homedir();
		else if (trimmed.startsWith("~/")) expanded = join(homedir(), trimmed.slice(2));
		else if (trimmed.startsWith("~")) expanded = join(homedir(), trimmed.slice(1));
		return resolve(this.cwd, expanded);
	}
	loadThemes(paths) {
		const themes = [];
		const diagnostics = [];
		for (const p of paths) {
			const resolved = resolve(this.cwd, p);
			if (!existsSync(resolved)) {
				diagnostics.push({
					type: "warning",
					message: "theme path does not exist",
					path: resolved
				});
				continue;
			}
			try {
				const stats = statSync(resolved);
				if (stats.isDirectory()) this.loadThemesFromDir(resolved, themes, diagnostics);
				else if (stats.isFile() && resolved.endsWith(".json")) this.loadThemeFromFile(resolved, themes, diagnostics);
				else diagnostics.push({
					type: "warning",
					message: "theme path is not a json file",
					path: resolved
				});
			} catch (error) {
				const message = error instanceof Error ? error.message : "failed to read theme path";
				diagnostics.push({
					type: "warning",
					message,
					path: resolved
				});
			}
		}
		return {
			themes,
			diagnostics
		};
	}
	loadThemesFromDir(dir, themes, diagnostics) {
		if (!existsSync(dir)) return;
		try {
			const { entries, failedDirs } = walkDirectorySync(dir, {
				maxDepth: 1,
				symlinks: "follow",
				include: (entry) => entry.kind === "file" && entry.name.endsWith(".json")
			});
			const failure = failedDirs[0];
			if (failure) throw failure.error;
			for (const entry of entries) this.loadThemeFromFile(join(dir, entry.name), themes, diagnostics);
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to read theme directory";
			diagnostics.push({
				type: "warning",
				message,
				path: dir
			});
		}
	}
	loadThemeFromFile(filePath, themes, diagnostics) {
		try {
			themes.push(loadThemeFromPath(filePath));
		} catch (error) {
			const message = error instanceof Error ? error.message : "failed to load theme";
			diagnostics.push({
				type: "warning",
				message,
				path: filePath
			});
		}
	}
	async loadExtensionFactories(runtime) {
		const extensions = [];
		const errors = [];
		for (const [index, factory] of this.extensionFactories.entries()) {
			const extensionPath = `<inline:${index + 1}>`;
			try {
				const extension = await loadExtensionFromFactory(factory, this.cwd, this.eventBus, runtime, extensionPath);
				extensions.push(extension);
			} catch (error) {
				const message = error instanceof Error ? error.message : "failed to load extension";
				errors.push({
					path: extensionPath,
					error: message
				});
			}
		}
		return {
			extensions,
			errors
		};
	}
	dedupePrompts(prompts) {
		const seen = /* @__PURE__ */ new Map();
		const diagnostics = [];
		for (const prompt of prompts) {
			const existing = seen.get(prompt.name);
			if (existing) diagnostics.push({
				type: "collision",
				message: `name "/${prompt.name}" collision`,
				path: prompt.filePath,
				collision: {
					resourceType: "prompt",
					name: prompt.name,
					winnerPath: existing.filePath,
					loserPath: prompt.filePath
				}
			});
			else seen.set(prompt.name, prompt);
		}
		return {
			prompts: Array.from(seen.values()),
			diagnostics
		};
	}
	dedupeThemes(themes) {
		const seen = /* @__PURE__ */ new Map();
		const diagnostics = [];
		for (const t of themes) {
			const name = t.name ?? "unnamed";
			const existing = seen.get(name);
			if (existing) diagnostics.push({
				type: "collision",
				message: `name "${name}" collision`,
				path: t.sourcePath,
				collision: {
					resourceType: "theme",
					name,
					winnerPath: existing.sourcePath ?? "<builtin>",
					loserPath: t.sourcePath ?? "<builtin>"
				}
			});
			else seen.set(name, t);
		}
		return {
			themes: Array.from(seen.values()),
			diagnostics
		};
	}
	discoverPromptFile(filename) {
		const projectPath = join(this.cwd, CONFIG_DIR_NAME, filename);
		if (existsSync(projectPath)) return projectPath;
		const globalPath = join(this.agentDir, filename);
		return existsSync(globalPath) ? globalPath : void 0;
	}
	detectExtensionConflicts(extensions) {
		const conflicts = [];
		const owners = {
			tools: /* @__PURE__ */ new Map(),
			flags: /* @__PURE__ */ new Map()
		};
		for (const ext of extensions) for (const kind of ["tools", "flags"]) for (const name of ext[kind].keys()) {
			const existingOwner = owners[kind].get(name);
			if (existingOwner && existingOwner !== ext.path) {
				const label = kind === "tools" ? `Tool "${name}"` : `Flag "--${name}"`;
				conflicts.push({
					path: ext.path,
					message: `${label} conflicts with ${existingOwner}`
				});
			} else owners[kind].set(name, ext.path);
		}
		return conflicts;
	}
};
//#endregion
export { BASE_CHUNK_RATIO as $, resolveModelScope as A, serializeConversation as At, formatNoModelsAvailableMessage as B, wrapRegisteredTools as C, fitCompactionSummary as Ct, findInitialModel as D, MAX_FILE_OPS_SECTION_CHARS as Dt, findExactModelReferenceMatch as E, prepareBranchEntries as Et, prepareCompaction as F, sanitizeCompactionReplayMessages as G, takeRuntimeUserTurnTranscriptContext as H, collectEntriesForBranchSummary as I, estimateJsonPayloadTokenPressure as J, stripStaleAssistantUsageBeforeLatestCompaction as K, generateBranchSummary as L, DEFAULT_THINKING_LEVEL as M, PROVIDER_CONTEXT_HANDOFF as Mt, compact as N, parseModelPattern as O, computeFileLists as Ot, generateSummary as P, estimateToolSchemaTokens as Q, executeBashWithOperations as R, loadExtensionFromFactory as S, findTurnStartIndex as St, DefaultPackageManager as T, shouldCompact as Tt, takeRuntimeUserTurnTranscriptRecorder as U, attachRuntimeUserTurnTranscriptRecorder as V, withRuntimeUserTurnTranscriptRecorder as W, estimateRenderedPromptTokens as X, estimateMessageTokenPressure as Y, estimateStringTokenPressure as Z, setSessionToolTextPreparer as _, calculateContextTokens as _t, recordSessionModelUsage as a, buildStageSplitPlan as at, ExtensionRunner as b, estimateTokens as bt, agentSessionQueuePromptContext as c, estimateMessagesTokens as ct, createCompactionRequestBudget as d, resolveEffectiveCompactionReserveTokens as dt, MIN_CHUNK_RATIO as et, estimateCompactedRequestTokens as f, Agent as ft, subscribeSteeringMessagePersistenceFailure as g, SUMMARY_TRUNCATED_MARKER as gt, getSteeringMessageIdentity as h, MAX_COMPACTION_SUMMARY_CHARS as ht, agentSessionSetContextReplacementHook as i, buildOversizedFallbackPlan as it, restoreModelFromSession as j, CompactionError as jt, resolveCliModel as k, formatFileOperations as kt, agentSessionSetPromptPreparation as l, projectCompactionMessagesForPlanning as lt, loadSkills as m, IMAGE_BLOCK_TOKENS as mt, AgentSession as n, SUMMARIZATION_OVERHEAD_TOKENS as nt, setSessionModelUsageSink as o, buildSummaryChunks as ot, formatSkillsForPrompt as p, DEFAULT_COMPACTION_SETTINGS as pt, resolveCompactionInstructions as q, agentSessionAutomaticCompaction as r, buildHistoryPrunePlan as rt, preflightManualSessionCompaction as s, computeAdaptiveChunkRatio as st, DefaultResourceLoader as t, SAFETY_MARGIN as tt, attachPromptCompactionRequestBudget as u, sanitizeCompactionMessages as ut, createSessionManagerRuntimeRegistry as v, capCompactionSummary as vt, SettingsManager as w, getLastAssistantUsage as wt, createExtensionRuntime as x, findCutPoint as xt, retireQueuedUserMessage as y, estimateContextTokens as yt, createEventBus as z };
