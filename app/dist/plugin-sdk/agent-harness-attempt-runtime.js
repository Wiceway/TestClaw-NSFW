import { F as resolveTimerTimeoutMs } from "../number-coercion-CLj0HTDM.mjs";
import { i as emitAgentEvent } from "../agent-events-WwqMA2rD.mjs";
import { n as buildCurrentInboundPrompt } from "../runtime-context-prompt-AdiWfjMx.mjs";
//#region src/agents/harness/attempt-deadlines.ts
/** Tracks execution and local settlement against their original absolute deadlines. */
function createAgentHarnessAttemptDeadlineController(params) {
	let deadline = { kind: "closed" };
	let timer;
	const armDeadline = (next) => {
		clearTimeout(timer);
		deadline = next;
		const deadlineAtMs = next.startedAtMs + next.timeoutMs;
		params.onDeadlineChanged?.({
			kind: "bounded",
			deadlineAtMs
		});
		timer = setTimeout(() => {
			if (deadline !== next || params.signal.aborted) return;
			deadline = { kind: "closed" };
			params.onTimeout({
				kind: next.kind,
				elapsedMs: Math.max(0, Date.now() - next.startedAtMs),
				timeoutMs: next.timeoutMs
			});
		}, resolveTimerTimeoutMs(Math.max(1, deadlineAtMs - Date.now()), 1));
		timer.unref?.();
	};
	const dispose = () => {
		deadline = { kind: "closed" };
		clearTimeout(timer);
		params.signal.removeEventListener("abort", dispose);
	};
	if (!params.signal.aborted) {
		params.signal.addEventListener("abort", dispose, { once: true });
		if (params.timeoutMs >= 2147e6) {
			deadline = { kind: "unlimited" };
			params.onDeadlineChanged?.({ kind: "unlimited" });
		} else armDeadline({
			kind: "execution",
			startedAtMs: params.startedAtMs,
			timeoutMs: params.timeoutMs
		});
	}
	return {
		ownsExecutionWait: () => deadline.kind === "unlimited" || deadline.kind === "execution" && Date.now() < deadline.startedAtMs + deadline.timeoutMs,
		beginSettlement: (startedAtMs) => {
			if (deadline.kind === "closed" || deadline.kind === "settlement") return;
			armDeadline({
				kind: "settlement",
				startedAtMs,
				timeoutMs: params.settlementTimeoutMs
			});
		},
		dispose
	};
}
//#endregion
//#region src/agents/harness/attempt-cancellation.ts
/** Own cancellation admission without interpreting a backend's native stop receipt. */
function createAgentHarnessAttemptCancellation(params) {
	const controller = new AbortController();
	let attemptAbortNotified = false;
	const notifyAttemptAbort = () => {
		if (attemptAbortNotified) return;
		attemptAbortNotified = true;
		params.onAttemptAbort?.();
	};
	const abortExplicitly = (reason) => {
		if (params.state.terminalOutcomeFrozen) {
			if (params.state.sharedAbortAllowedAfterTerminalOutcome) notifyAttemptAbort();
			return;
		}
		notifyAttemptAbort();
		params.state.explicitCancellationObserved = true;
		params.state.explicitCancellationReason ??= reason;
		controller.abort(reason);
	};
	const abortFromUpstream = () => {
		abortExplicitly(params.upstreamSignal?.reason ?? "upstream_abort");
	};
	const dispose = () => {
		params.upstreamSignal?.removeEventListener("abort", abortFromUpstream);
	};
	const freezeTerminalOutcome = () => {
		if (params.state.terminalOutcomeFrozen) return;
		params.state.terminalOutcomeFrozen = true;
		dispose();
	};
	if (params.upstreamSignal?.aborted) abortFromUpstream();
	else params.upstreamSignal?.addEventListener("abort", abortFromUpstream, { once: true });
	return {
		controller,
		abortExplicitly,
		freezeTerminalOutcome,
		dispose
	};
}
//#endregion
//#region src/agents/harness/attempt-events.ts
/** Observer failures cannot interrupt the authoritative native attempt. */
async function emitAgentHarnessAttemptEvent(attempt, event, diagnostics) {
	try {
		emitAgentEvent({
			runId: attempt.runId,
			stream: event.stream,
			data: event.data,
			...attempt.sessionKey ? { sessionKey: attempt.sessionKey } : {}
		});
	} catch (error) {
		diagnostics.log.debug(`${diagnostics.label} global agent event emit failed`, { error });
	}
	try {
		await attempt.onAgentEvent?.(event);
	} catch (error) {
		diagnostics.log.debug(`${diagnostics.label} agent event handler threw`, { error });
	}
}
/** Share event bookkeeping while the backend decides whether a native handoff suppresses it. */
function createAgentHarnessAttemptLifecycle(params) {
	const emitLifecycleStart = (model) => {
		params.emitEvent({
			stream: "lifecycle",
			data: {
				phase: "start",
				startedAt: params.startedAtMs
			}
		});
		params.emitEvent({
			stream: "lifecycle",
			data: {
				phase: "model",
				...model
			}
		});
		params.state.lifecycleStarted = true;
	};
	const emitLifecycleTerminal = (data) => {
		if (!params.state.lifecycleStarted || params.state.lifecycleTerminalEmitted || params.shouldSuppressTerminal?.()) return;
		params.emitEvent({
			stream: "lifecycle",
			data: {
				startedAt: params.startedAtMs,
				endedAt: Date.now(),
				...data,
				...params.attempt.deferTerminalLifecycle ? { phase: "finishing" } : {}
			}
		});
		params.state.lifecycleTerminalEmitted = true;
	};
	const executionPhaseKeys = /* @__PURE__ */ new Set();
	const emitExecutionPhaseOnce = (key, info) => {
		if (executionPhaseKeys.has(key)) return;
		executionPhaseKeys.add(key);
		params.attempt.onExecutionPhase?.({
			provider: params.attempt.provider,
			model: params.attempt.modelId,
			backend: params.backend,
			...info
		});
	};
	return {
		emitLifecycleStart,
		emitLifecycleTerminal,
		emitExecutionPhaseOnce
	};
}
//#endregion
//#region src/agents/harness/reasoning-effort.ts
/** Preserve a supported effort, otherwise prefer the next higher effort. */
function selectSupportedReasoningEffort(params) {
	const declared = new Set(params.supportedEfforts);
	const supported = params.effortOrder.filter((effort) => declared.has(effort));
	if (supported.includes(params.requested)) return params.requested;
	const requestedRank = params.effortOrder.indexOf(params.requested);
	return supported.find((effort) => params.effortOrder.indexOf(effort) >= requestedRank) ?? supported.at(-1);
}
//#endregion
export { buildCurrentInboundPrompt, createAgentHarnessAttemptCancellation, createAgentHarnessAttemptDeadlineController, createAgentHarnessAttemptLifecycle, emitAgentHarnessAttemptEvent, selectSupportedReasoningEffort };
