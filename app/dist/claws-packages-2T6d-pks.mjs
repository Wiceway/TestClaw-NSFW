import { n as listAgentEntries } from "./agent-roster-Cl9s4QHb.mjs";
import "./agent-scope-_30Scclc.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-WUvUxA6s.mjs";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-DI5y0Fk0.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-CkmD-Hkp.mjs";
import { a as projectPluginRuntimeFailure } from "./lifecycle-kyMYqai_.mjs";
import { a as readClawInstallRecord } from "./provenance-ksQfwli9.mjs";
import { _ as applyClawPackageRemovals, c as readClawStatus, n as digestClawRemovalInstall, o as orderClawPackageRemovals, s as projectClawPackageRemovePlan, t as digestClawPackageRemovalPlan, v as planClawPackageRemovals } from "./package-remove-plan-D2-7iWG1.mjs";
import { t as resolveClawMonitorCleanupBinding } from "./monitor-cleanup-binding-DiCttc1y.mjs";
import { t as clawPackageRemovalRequestSchema } from "./package-remove-contract-DyXQxxpG.mjs";
import { n as pluginLifecycleError, t as captureGatewayPluginRuntimeApplications } from "./plugins-lifecycle-error-CdkO15A7.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-methods/claws-packages.ts
const clawsPackageHandlers = { "claws.packages.remove": async ({ params, respond, context, signal, sessionMutationCommitGuard }) => {
	const parsed = clawPackageRemovalRequestSchema.safeParse(params);
	if (!parsed.success) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid Claw package cleanup parameters."));
		return;
	}
	const input = parsed.data;
	let captured;
	let entered = false;
	try {
		const applyRuntime = context.applyPluginLifecycleChange;
		if (!applyRuntime) throw new Error("Claw plugin cleanup requires a running plugin lifecycle owner.");
		const assertCurrent = () => {
			signal?.throwIfAborted();
			sessionMutationCommitGuard?.();
			const journal = readAgentDeletionJournal(input.agentId);
			if (!isDeepStrictEqual(input.binding, resolveClawMonitorCleanupBinding(context.cronStorePath)) || journal?.operationId !== input.operationId || journal.cleanupCompleted || listAgentEntries(context.getRuntimeConfig()).some((agent) => agent.id === input.agentId) || digestClawRemovalInstall(readClawInstallRecord(input.agentId)) !== input.expectedInstallDigest) throw new Error("Claw package cleanup no longer owns the current removal state.");
		};
		captured = captureGatewayPluginRuntimeApplications(applyRuntime, assertCurrent);
		const applyOwnedRuntime = captured.applyRuntime;
		const { runtimeFailure, ...removed } = await withPluginLifecycleLease({
			signal,
			waitMs: 0
		}, async (lease) => {
			entered = true;
			const beforePersistentApply = () => {
				assertCurrent();
				lease.assertOwned();
			};
			beforePersistentApply();
			const status = await readClawStatus(input.agentId);
			beforePersistentApply();
			const record = status.records[0];
			if (!record || status.records.length !== 1) throw new Error("Claw package cleanup has no unique current owner.");
			const decisions = await planClawPackageRemovals(record.install, record.packages, { referencedCleanup: input.cleanup });
			beforePersistentApply();
			if (digestClawPackageRemovalPlan(decisions, input.cleanup) !== input.expectedPackagePlanDigest) throw new Error("Claw package ownership changed after removal planning; preview removal again.");
			const projection = projectClawPackageRemovePlan({
				decisions,
				inspections: record.packages,
				cleanup: input.cleanup
			});
			if (projection.blockers.length > 0) throw new Error(projection.blockers.map((blocker) => blocker.message).join("; "));
			return await applyClawPackageRemovals(orderClawPackageRemovals(decisions), {
				applyRuntime: applyOwnedRuntime,
				assertCurrent: beforePersistentApply
			});
		});
		assertCurrent();
		const { warnings: runtimeWarnings, ...currentApplication } = captured.application ?? {};
		let application = captured.application ? currentApplication : void 0;
		if (runtimeFailure) {
			const runtime = projectPluginRuntimeFailure(runtimeFailure, captured.application).runtime;
			application = runtime?.committed ? {
				operationId: runtime.operationId,
				generation: runtime.generation,
				pluginIds: runtime.pluginIds
			} : void 0;
		}
		const warnings = [.../* @__PURE__ */ new Set([...removed.warnings ?? [], ...runtimeWarnings ?? []])];
		respond(true, {
			...removed,
			...application ? { application } : {},
			...warnings.length ? { warnings } : {}
		}, void 0);
	} catch (error) {
		respond(false, void 0, pluginLifecycleError(error, {
			application: captured?.application,
			entered,
			signal
		}));
	}
} };
//#endregion
export { clawsPackageHandlers };
