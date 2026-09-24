import { l as normalizeOptionalString } from "../string-coerce-CIXf7egm.mjs";
import { a as getGatewayContextResolver, r as getCanonicalGatewayContextResolver } from "../gateway-context-binding-VqB7gkMe.mjs";
import { o as withPluginRuntimeGatewayContextResolver } from "../gateway-request-scope-Cys5l4an.mjs";
import { _ as retainGatewayRootWorkAdmissionContinuationScope } from "../gateway-work-admission-DeFm4gyw.mjs";
import { i as emitAgentEvent, l as getAgentEventLifecycleGeneration } from "../agent-events-WwqMA2rD.mjs";
import { At as DetachedTaskRuntimeOwnerRetiredError, H as matchesTaskPersistenceReceipt, j as captureTaskPersistenceReceipt, kt as DetachedTaskAssignmentUnsupportedError } from "../task-registry.store.kernel-CTpG8C0S.mjs";
import { t as captureDetachedTaskRuntimeOwner } from "../detached-task-runtime-state-CsuWaBlO.mjs";
import { t as captureTaskExecutionOwner } from "../task-execution-owner-D_zpbgLF.mjs";
import { p as getTasksByRunId } from "../task-registry.process-state-BEDk3knf.mjs";
import "../task-registry-state-C_3mxHYW.mjs";
import { s as listTaskRecords } from "../task-registry-query-BjzJF9UR.mjs";
import "../runtime-internal-CxjcW5l2.mjs";
import { a as finalizeTaskRunByRunId, f as transitionTaskAssignment, l as recordTaskRunProgressByRunId, r as createRunningTaskRun, u as setDetachedTaskDeliveryStatusByRunId } from "../detached-task-runtime-BbgsXm9e.mjs";
import { t as captureOperatorToolGatewayContinuationContext } from "../server-plugin-in-process-dispatch-DLEJEMN0.mjs";
import { n as buildAnnounceIdempotencyKey } from "../announce-idempotency-CkUlnjaT.mjs";
import { t as AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION } from "../internal-event-contract-pF6FHp8g.mjs";
import { i as formatAgentInternalEventsForPrompt } from "../internal-events-tp2BIlO7.mjs";
import { a as loadRequesterSessionEntry, i as resolveSubagentCompletionOrigin, n as isInternalAnnounceRequesterSession, r as resolveAnnounceOrigin, t as deliverSubagentAnnouncement } from "../subagent-announce-delivery-B0-7Sv1G.mjs";
import { t as assertAgentHarnessTaskRuntimeScope } from "../agent-harness-task-runtime-scope-DquK9rFl.mjs";
import { t as reconcileHarnessCompletionDelivery } from "../agent-harness-completion-delivery-BJYUkc1j.mjs";
//#region src/tasks/agent-harness-completion-custody.ts
const registryKey = Symbol.for("testclaw.agentHarnessCompletionCustody.registry");
const globalRegistry = globalThis;
const owners = globalRegistry[registryKey] ??= /* @__PURE__ */ new WeakMap();
function getCompletionOwner(custody, scope) {
	const owner = owners.get(custody);
	const expected = owner && getGatewayContextResolver(owner.scope);
	const actual = getGatewayContextResolver(scope);
	if (!owner || owner.scope.requesterSessionKey !== scope.requesterSessionKey || (expected && getCanonicalGatewayContextResolver(expected)) !== (actual && getCanonicalGatewayContextResolver(actual))) throw new Error("Harness completion custody does not own this requester");
	return owner;
}
/** Capture during admission; assignment/recovery owners retain their own holds before yielding. */
function captureAgentHarnessCompletionCustodyOwner(scopeInput, assertRequesterCurrent) {
	const scope = assertAgentHarnessTaskRuntimeScope(scopeInput);
	const resolver = getGatewayContextResolver(scope);
	const captured = resolver ? withPluginRuntimeGatewayContextResolver(resolver, captureOperatorToolGatewayContinuationContext) : captureOperatorToolGatewayContinuationContext();
	if (!captured) return;
	const root = retainGatewayRootWorkAdmissionContinuationScope();
	const releaseRoot = () => root?.release();
	captured.signal.addEventListener("abort", releaseRoot, { once: true });
	let references = 0;
	let executions = 0;
	const retain = (settled = false) => {
		captured.signal.throwIfAborted();
		references += 1;
		if (!settled) executions += 1;
		const lifetime = new AbortController();
		let executionSettled = settled;
		const settleExecution = () => {
			if (!executionSettled) {
				executionSettled = true;
				if (--executions === 0) {
					captured.signal.removeEventListener("abort", releaseRoot);
					releaseRoot();
				}
			}
		};
		const assertCurrent = () => {
			lifetime.signal.throwIfAborted();
			captured.signal.throwIfAborted();
			assertRequesterCurrent();
		};
		const custody = {
			signal: AbortSignal.any([lifetime.signal, captured.signal]),
			isCurrent: () => isAgentHarnessCompletionCustodyCurrent(custody, scope),
			retain() {
				assertCurrent();
				return retain(executionSettled);
			},
			settleExecution,
			release() {
				if (lifetime.signal.aborted) return;
				lifetime.abort(/* @__PURE__ */ new Error("Harness completion custody was released"));
				settleExecution();
				if (--references === 0) captured.release();
			}
		};
		owners.set(custody, {
			scope,
			run(run) {
				assertCurrent();
				return !executionSettled && root ? root.runSync(() => captured.run(run)) : captured.run(run);
			},
			emit(run) {
				assertCurrent();
				if (executionSettled) throw new Error("Harness execution custody was settled");
				captured.run(() => root ? root.runSync(run) : run());
			}
		});
		return custody;
	};
	try {
		return retain();
	} catch (error) {
		root?.release();
		captured.release();
		throw error;
	}
}
/** Binds an event producer to one persisted assignment; no caller-supplied event routing escapes. */
function createAgentHarnessTaskEventSink(params) {
	const scope = assertAgentHarnessTaskRuntimeScope(params.scope);
	const owner = getCompletionOwner(params.completionCustody, scope);
	const readTasks = () => getTasksByRunId(params.runId).filter((task) => task.runtime === "subagent" && Boolean(task.taskKind) && task.requesterSessionKey === scope.requesterSessionKey && task.scopeKind === "session" && task.ownerKey === scope.requesterSessionKey);
	if (params.expectedTask.runId !== params.runId || params.expectedTask.runtime !== "subagent" || !params.expectedTask.taskKind || params.expectedTask.scopeKind !== "session" || params.expectedTask.ownerKey !== scope.requesterSessionKey) throw new Error("Harness event custody does not own this task assignment");
	const generation = getAgentEventLifecycleGeneration();
	return (event) => owner.emit(() => {
		const current = readTasks();
		if (current.length !== 1 || !current[0] || !matchesTaskPersistenceReceipt(current[0], params.expectedTask)) throw new Error("Harness event task assignment was replaced");
		emitAgentEvent({
			stream: event.stream,
			data: event.data,
			runId: params.runId,
			agentId: current[0].agentId,
			lifecycleGeneration: generation
		});
	});
}
/** Only the completion SDK can enter retained authority; plugins cannot execute a callback in it. */
function runWithAgentHarnessCompletionCustody(custody, scope, run) {
	return getCompletionOwner(custody, scope).run(run);
}
/** Revalidate the retained source at asynchronous delivery effect boundaries. */
function isAgentHarnessCompletionCustodyCurrent(custody, scope) {
	try {
		return getCompletionOwner(custody, scope).run(() => true);
	} catch {
		return false;
	}
}
//#endregion
//#region src/plugin-sdk/agent-harness-task-runtime.ts
/**
* Runtime SDK helpers for agent harness task persistence and completion delivery.
*/
/** Retains admitted completion work for this exact physical requester lifecycle. */
function captureAgentHarnessCompletionCustody(scope) {
	assertAgentHarnessTaskRuntimeScope(scope);
	const entry = loadRequesterSessionEntry(scope.requesterSessionKey).entry;
	const expected = {
		sessionId: entry?.sessionId,
		lifecycleRevision: entry?.lifecycleRevision
	};
	return captureAgentHarnessCompletionCustodyOwner(scope, () => {
		const current = loadRequesterSessionEntry(scope.requesterSessionKey).entry;
		if (current?.sessionId !== expected.sessionId || current?.lifecycleRevision !== expected.lifecycleRevision) throw new Error("Harness completion requester lifecycle was replaced");
	});
}
const AGENT_HARNESS_COMPLETION_SOURCE_TOOL = "agent_harness_task";
/** Creates a task runtime whose run ids and task records are constrained to one scope. */
function createAgentHarnessTaskRuntime(params) {
	const runtime = params.runtime;
	const scope = assertAgentHarnessTaskRuntimeScope(params.scope);
	const requesterSessionKey = scope.requesterSessionKey;
	const taskKind = normalizeOptionalString(params.taskKind);
	const runIdPrefix = normalizeOptionalString(params.runIdPrefix);
	const executionOwner = params.executionPid === void 0 ? void 0 : captureTaskExecutionOwner(params.executionPid);
	const runtimeOwner = captureDetachedTaskRuntimeOwner();
	const assertRunId = (runId) => assertScopedRunId(runId, runIdPrefix);
	const transitionAssignment = (transition, ownership) => transitionTaskAssignment({
		transition,
		expectedTask: ownership.expectedTask,
		assertCurrent() {
			runtimeOwner.assertCurrent();
			assertAgentHarnessTaskRuntimeScope(scope);
			if (ownership.expectedTask.runtime !== runtime || ownership.expectedTask.ownerKey !== requesterSessionKey || ownership.expectedTask.scopeKind !== "session" || ownership.expectedTask.runId !== transition.params.runId || taskKind && ownership.expectedTask.taskKind !== taskKind || ownership.completionCustody && !isAgentHarnessCompletionCustodyCurrent(ownership.completionCustody, scope)) throw new Error("Harness task assignment owner is no longer current");
		}
	});
	const tryCreateRunningTaskRun = (taskParams) => {
		assertRunId(taskParams.runId);
		return createRunningTaskRun({
			...taskParams,
			runtime,
			...taskKind ? { taskKind } : {},
			requesterSessionKey,
			ownerKey: requesterSessionKey,
			scopeKind: "session",
			executionOwner
		});
	};
	return {
		assertTaskAssignmentSupported() {
			runtimeOwner.assertCurrent();
			if (runtimeOwner.runtime && !runtimeOwner.runtime.transitionTaskAssignment) throw new DetachedTaskAssignmentUnsupportedError();
		},
		createRunningTaskRun(taskParams) {
			const task = tryCreateRunningTaskRun(taskParams);
			if (!task) throw new Error("Task persistence failed.");
			return task;
		},
		tryCreateRunningTaskRun,
		recordTaskRunProgressByRunId(taskParams) {
			assertRunId(taskParams.runId);
			const { expectedTask, completionCustody, ...progress } = taskParams;
			if (expectedTask) return transitionAssignment({
				kind: "state",
				params: {
					...progress,
					runtime,
					sessionKey: requesterSessionKey
				}
			}, {
				expectedTask,
				completionCustody
			});
			return recordTaskRunProgressByRunId({
				...progress,
				runtime,
				sessionKey: requesterSessionKey
			});
		},
		finalizeTaskRunByRunId(taskParams) {
			assertRunId(taskParams.runId);
			const { expectedTask, completionCustody, ...terminal } = taskParams;
			if (expectedTask) return transitionAssignment({
				kind: "state",
				params: {
					...terminal,
					runtime,
					sessionKey: requesterSessionKey
				}
			}, {
				expectedTask,
				completionCustody
			});
			return finalizeTaskRunByRunId({
				...terminal,
				runtime,
				sessionKey: requesterSessionKey
			});
		},
		setDetachedTaskDeliveryStatusByRunId(taskParams) {
			assertRunId(taskParams.runId);
			const { expectedTask, completionCustody, ...delivery } = taskParams;
			if (expectedTask) return transitionAssignment({
				kind: "delivery",
				params: {
					...delivery,
					runtime,
					sessionKey: requesterSessionKey
				}
			}, {
				expectedTask,
				completionCustody
			});
			return setDetachedTaskDeliveryStatusByRunId({
				...delivery,
				runtime,
				sessionKey: requesterSessionKey
			});
		},
		listTaskRecords() {
			return listTaskRecords((task) => task.runtime === runtime && (!taskKind || task.taskKind === taskKind) && task.scopeKind === "session" && task.ownerKey === requesterSessionKey && (!runIdPrefix || task.runId?.startsWith(runIdPrefix) === true));
		}
	};
}
/** Delivers a completed harness task result back to the requester or parent session. */
async function deliverAgentHarnessTaskCompletion(params) {
	const scope = assertAgentHarnessTaskRuntimeScope(params.scope);
	const requesterSessionKey = scope.requesterSessionKey;
	const childSessionKey = params.childSessionKey.trim();
	const childSessionId = params.childSessionId.trim();
	const taskLabel = params.taskLabel?.trim() || "Agent harness task";
	const announceType = params.announceType?.trim() || "Agent harness task";
	const statusLabel = params.statusLabel?.trim() || params.status;
	const eventStatus = mapHarnessCompletionStatus(params.status);
	const readOwnedTasks = () => listTaskRecords((task) => task.runtime === "subagent" && Boolean(task.taskKind) && task.requesterSessionKey === requesterSessionKey && task.runId === childSessionKey);
	const ownedTasks = readOwnedTasks();
	const sourceTask = ownedTasks.length === 1 ? ownedTasks[0] : void 0;
	const taskReceipt = params.expectedTask ?? (sourceTask && captureTaskPersistenceReceipt(sourceTask));
	const isTaskCurrent = () => {
		const current = readOwnedTasks();
		if (!taskReceipt) return ownedTasks.length === 0 && current.length === 0;
		const task = current[0];
		return current.length === 1 && task !== void 0 && taskReceipt !== void 0 && matchesTaskPersistenceReceipt(task, taskReceipt) && task.status === params.status && task.deliveryStatus === "pending";
	};
	const expectedRequester = params.expectedRequester;
	const isRequesterCurrent = () => {
		if (params.completionCustody && !isAgentHarnessCompletionCustodyCurrent(params.completionCustody, scope)) return false;
		if (!expectedRequester) return true;
		const current = loadRequesterSessionEntry(requesterSessionKey).entry;
		return current?.sessionId === expectedRequester.sessionId && current.lifecycleRevision === expectedRequester.lifecycleRevision;
	};
	const isSourceSessionEffectsAllowed = () => !params.completionCustody?.signal.aborted && isRequesterCurrent() && isTaskCurrent();
	const requesterIsSubagent = isInternalAnnounceRequesterSession(requesterSessionKey);
	let directOrigin = scope.requesterOrigin;
	if (!requesterIsSubagent) {
		const { entry } = loadRequesterSessionEntry(requesterSessionKey);
		directOrigin = resolveAnnounceOrigin(entry, scope.requesterOrigin);
	}
	const completionDirectOrigin = requesterIsSubagent || !directOrigin ? directOrigin : await resolveSubagentCompletionOrigin({
		childSessionKey,
		requesterSessionKey,
		requesterOrigin: directOrigin,
		childRunId: childSessionKey,
		spawnMode: "run",
		expectsCompletionMessage: true
	});
	const internalEvents = [{
		type: AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION,
		source: "subagent",
		childSessionKey,
		childSessionId,
		announceType,
		taskLabel,
		status: eventStatus,
		statusLabel,
		result: params.result,
		replyInstruction: params.replyInstruction?.trim() || "Use the completed harness task result to continue or wrap up the parent task. If this is a channel session, send the visible response with the message tool instead of only writing a transcript final answer."
	}];
	const prompt = formatAgentInternalEventsForPrompt(internalEvents);
	const deliver = async () => {
		if (ownedTasks.length > 1 || readOwnedTasks().length > 1) return {
			delivered: false,
			path: "none",
			recoveryBlocked: true,
			error: "completion task ownership is ambiguous"
		};
		if (!isRequesterCurrent()) return {
			delivered: false,
			path: "none",
			recoveryBlocked: true,
			error: "completion requester locator is missing or replaced"
		};
		const requester = loadRequesterSessionEntry(requesterSessionKey);
		if (requester.agentId && requester.storePath) {
			const custody = reconcileHarnessCompletionDelivery({
				agentId: requester.agentId,
				storePath: requester.storePath,
				sessionKey: requester.canonicalKey,
				sourceRunId: buildAnnounceIdempotencyKey(params.announceId),
				taskRunId: childSessionKey
			});
			if (custody === "delivered") return {
				delivered: true,
				path: "direct"
			};
			if (custody !== "unowned") return {
				delivered: false,
				path: "none",
				...custody === "pending" ? { recoveryPending: true } : { recoveryBlocked: true },
				error: custody === "pending" ? "completion is owned by requester recovery" : "completion recovery receipt or owner is unresolved"
			};
		}
		if (!isTaskCurrent()) return {
			delivered: false,
			path: "none",
			recoveryBlocked: true,
			error: "completion task is no longer owed by this requester"
		};
		return await deliverSubagentAnnouncement({
			requesterSessionKey,
			isSourceSessionEffectsAllowed,
			triggerMessage: prompt,
			steerMessage: prompt,
			internalEvents,
			requesterSessionOrigin: scope.requesterOrigin,
			completionDirectOrigin: completionDirectOrigin ?? directOrigin,
			directOrigin,
			sourceSessionKey: childSessionKey,
			sourceTool: AGENT_HARNESS_COMPLETION_SOURCE_TOOL,
			isSourceSessionAdmissionAllowed: params.isSourceSessionAdmissionAllowed,
			targetRequesterSessionKey: requesterSessionKey,
			requesterIsSubagent,
			expectsCompletionMessage: true,
			bestEffortDeliver: true,
			directIdempotencyKey: buildAnnounceIdempotencyKey(params.announceId),
			signal: params.completionCustody ? AbortSignal.any([params.completionCustody.signal, ...params.signal ? [params.signal] : []]) : params.signal
		});
	};
	const resolveGatewayContext = getGatewayContextResolver(scope);
	const deliverInGateway = () => resolveGatewayContext ? withPluginRuntimeGatewayContextResolver(resolveGatewayContext, deliver) : deliver();
	return params.completionCustody ? await runWithAgentHarnessCompletionCustody(params.completionCustody, scope, deliverInGateway) : await deliverInGateway();
}
function mapHarnessCompletionStatus(status) {
	if (status === "succeeded") return "ok";
	return "error";
}
/** Returns true when completion delivery reached a persistent direct or steered path. */
function isDurableAgentHarnessCompletionDelivery(delivery) {
	if (!delivery.delivered) return false;
	if (delivery.path === "steered") return true;
	if (delivery.path !== "direct") return false;
	const phases = Array.isArray(delivery.phases) ? delivery.phases : void 0;
	if (!phases) return true;
	return phases.some((phase) => phase.phase === "direct-primary" && phase.delivered && phase.path === "direct");
}
function assertScopedRunId(runId, runIdPrefix) {
	const normalized = runId.trim();
	if (!normalized) throw new Error("Agent harness task runtime requires runId");
	if (runIdPrefix && !normalized.startsWith(runIdPrefix)) throw new Error("Agent harness task runId is outside the configured scope");
}
//#endregion
export { DetachedTaskRuntimeOwnerRetiredError as AgentHarnessTaskAssignmentOwnerRetiredError, DetachedTaskAssignmentUnsupportedError as AgentHarnessTaskAssignmentUnsupportedError, captureAgentHarnessCompletionCustody, captureTaskPersistenceReceipt as captureAgentHarnessTaskAssignment, createAgentHarnessTaskEventSink, createAgentHarnessTaskRuntime, deliverAgentHarnessTaskCompletion, isDurableAgentHarnessCompletionDelivery, matchesTaskPersistenceReceipt as matchesAgentHarnessTaskAssignment };
