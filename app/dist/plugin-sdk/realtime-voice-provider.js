import { c as readErrorName, d as toStringifiedError, i as extractErrorCode, t as coerceErrorMessage, u as toErrorObject } from "../error-coercion-C787aVxk.mjs";
import { r as truncateUtf16Safe } from "../utf16-slice-D_ngcYKd.mjs";
import { s as sleepWithAbort } from "../src-D4OikzaT.mjs";
import "../backoff-CszdOMiF.mjs";
import { t as canonicalizeBase64 } from "../base64-B5EyWEOm.mjs";
import { n as rawDataToString } from "../ws-BdD3UP1C.mjs";
import { n as createRealtimeVoiceAudioQueue, t as RealtimeVoiceSessionLifecycle } from "../realtime-session-lifecycle-CJCE-3t7.mjs";
import { A as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, M as realtimeVoiceAudioDurationMs, N as toOpenAICompatibleRealtimeAudioFormat, g as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, j as normalizeRealtimeVoiceResponseOutcome, k as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, o as buildRealtimeVoiceAgentControlSpeechMessage } from "../agent-run-control-shared-DcOm7IvW.mjs";
import { t as createRealtimeVoiceOutputActivityTracker } from "../output-activity-tracker-DibtmiPc.mjs";
import { a as convertPcmToMulaw8k, c as pcmToMulaw, l as resamplePcm, o as createStreamingPcmResampler, r as isRealtimeVoiceAudioAudible, s as mulawToPcm } from "../audio-energy-CUNIcCl_.mjs";
import { t as createRealtimeVoiceAudioPortSender } from "../audio-output-port-B-2tgfdC.mjs";
//#region src/talk/realtime-voice-lazy-lifecycle.ts
/** Owns a lazy bridge generation while provider-local queues own input admission and ordering. */
function createLazyRealtimeVoiceBridgeLifecycle(params) {
	const request = params.request;
	const { getPlaybackState, handleDelegationInput, runAgentConsult } = request;
	const lifecycle = new RealtimeVoiceSessionLifecycle(`${params.label} lazy`);
	const disposedBridges = /* @__PURE__ */ new WeakMap();
	let loaded;
	let closePromise;
	let closing;
	const dispose = (state, bridge) => {
		if (disposedBridges.has(bridge)) return disposedBridges.get(bridge);
		disposedBridges.set(bridge, void 0);
		const completion = state.closeOptions ? bridge.close(state.closeOptions) : bridge.close();
		disposedBridges.set(bridge, completion);
		return completion;
	};
	const notifyTerminal = (connection, outcome) => {
		if (closing?.connection === connection && lifecycle.isCurrent(connection)) {
			if (outcome === "error") closing.outcome = outcome;
			return;
		}
		const reason = lifecycle.close(connection, outcome);
		if (reason) {
			params.clearPending();
			request.onClose?.(reason);
		}
	};
	const close = (outcome, primaryError, options) => {
		const connection = lifecycle.currentConnection();
		if (!(outcome === "error" && connection ? lifecycle.failure(connection) : lifecycle.cancel())) return closePromise;
		const state = loaded;
		if (state) state.closeOptions = options;
		const owner = {
			connection,
			outcome
		};
		closing = owner;
		params.clearPending();
		const finish = (reason = owner.outcome) => {
			if (closing === owner) {
				closing = void 0;
				if (outcome === "error") try {
					request.onError?.(toStringifiedError(primaryError));
				} catch {}
			}
			if (connection ? lifecycle.close(connection, reason) : !lifecycle.currentConnection()) request.onClose?.(reason);
		};
		const fail = (error) => {
			try {
				finish("error");
			} catch {}
			throw error;
		};
		let pending;
		try {
			pending = state?.bridge ? dispose(state, state.bridge) : state && state.connection === connection ? state.promise.then((bridge) => dispose(state, bridge)) : void 0;
		} catch (error) {
			return fail(error);
		}
		if (pending) {
			const completion = pending.then(() => finish(), fail);
			if (closing === owner) closePromise = completion;
			return completion;
		}
		finish();
	};
	const guardRequest = (connection) => {
		const isCurrent = () => lifecycle.acceptsEvents(connection);
		const guard = (callback) => (...args) => {
			if (isCurrent()) callback(...args);
		};
		return {
			...request,
			onAudio: guard(request.onAudio),
			onClearAudio: guard(request.onClearAudio),
			...request.onMark ? { onMark: guard(request.onMark) } : {},
			...request.onEvent ? { onEvent: guard(request.onEvent) } : {},
			...request.onResponseDone ? { onResponseDone: guard(request.onResponseDone) } : {},
			...request.onToolCall ? { onToolCall: guard(request.onToolCall) } : {},
			...request.onError ? { onError: guard(request.onError) } : {},
			...getPlaybackState ? { getPlaybackState: () => {
				if (!isCurrent()) return [];
				const playback = getPlaybackState();
				return isCurrent() ? playback : [];
			} } : {},
			...handleDelegationInput ? { handleDelegationInput: (text, respond) => {
				if (!isCurrent()) return "control";
				return handleDelegationInput(text, (message) => {
					if (isCurrent()) respond(message);
				});
			} } : {},
			...runAgentConsult ? { runAgentConsult: (input) => isCurrent() ? runAgentConsult(input) : Promise.reject(/* @__PURE__ */ new Error(`${params.label} realtime voice session closed`)) } : {},
			...request.onTranscript ? { onTranscript: (...args) => {
				const isFinal = args[2];
				if (isCurrent() || isFinal && closing?.connection === connection && lifecycle.isCurrent(connection)) request.onTranscript?.(...args);
			} } : {},
			onReady: () => {
				if (isCurrent()) {
					request.onReady?.();
					if (isCurrent()) params.onProviderReady?.(loaded?.bridge);
				}
			},
			onClose: (reason) => notifyTerminal(connection, reason)
		};
	};
	return {
		get bridge() {
			return loaded?.bridge;
		},
		isActive: () => lifecycle.phase() !== "terminal",
		connect: () => lifecycle.connect(async (connection) => {
			closePromise = void 0;
			closing = void 0;
			const state = {
				connection,
				promise: Promise.resolve().then(() => params.load(guardRequest(connection)))
			};
			loaded = state;
			const bridge = await state.promise;
			const isCurrent = () => lifecycle.acceptsEvents(connection);
			if (!isCurrent()) {
				await dispose(state, bridge);
				return;
			}
			state.bridge = bridge;
			try {
				await bridge.connect();
				if (isCurrent()) {
					await params.onConnected?.(bridge, isCurrent);
					lifecycle.ready(connection);
				}
			} catch (error) {
				try {
					if (isCurrent()) await close("error", error);
					else await dispose(state, bridge);
				} catch {}
				throw error;
			}
			if (!isCurrent()) await dispose(state, bridge);
		}),
		close: (options) => close("completed", void 0, options)
	};
}
//#endregion
export { REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, RealtimeVoiceSessionLifecycle, buildRealtimeVoiceAgentControlSpeechMessage, canonicalizeBase64, coerceErrorMessage, convertPcmToMulaw8k, createLazyRealtimeVoiceBridgeLifecycle, createRealtimeVoiceAudioPortSender, createRealtimeVoiceAudioQueue, createRealtimeVoiceOutputActivityTracker, createStreamingPcmResampler, extractErrorCode, isRealtimeVoiceAudioAudible, mulawToPcm, normalizeRealtimeVoiceResponseOutcome, pcmToMulaw, rawDataToString, readErrorName, realtimeVoiceAudioDurationMs, resamplePcm, sleepWithAbort, toErrorObject, toOpenAICompatibleRealtimeAudioFormat, toStringifiedError, truncateUtf16Safe };
