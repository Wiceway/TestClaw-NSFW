import { a as asDateTimestampMs } from "./number-coercion-0M4tZV2c.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import { r as getRuntimeConfig } from "./io.runtime-C0vFx1Ic.js";
import "./config-CiBXBfE2.js";
import { i as resolveSandboxConfigForAgent } from "./config-2b4YAeh9.js";
import { n as resolveSandboxAgentId } from "./shared-BS_-7NdN.js";
import { d as removeSandboxRegistryRuntime, h as withSandboxRegistryEntryLock, i as readBrowserRegistry, o as readRegistry, t as assertSandboxBrowserRegistryEntryCurrent, u as removeSandboxRegistryGeneration } from "./registry-BF57nGps.js";
import { p as dockerSandboxBackendManager } from "./fs-bridge-stat-parse-BJ4fl30v.js";
import { i as getSandboxBackendManager, s as usesSandboxRuntimeReservations } from "./backend-DshQQJME.js";
import { r as stopCachedBrowserBridgesForContainer } from "./browser-bridges-C13s-dXM.js";
//#region src/agents/sandbox/prune.ts
/**
* Sandbox registry pruning.
*
* Removes stale runtime containers and browser bridges on a best-effort schedule.
*/
let lastPruneAtMs = 0;
function resolveEntryPruneConfig(config, entry) {
	return resolveSandboxConfigForAgent(config, resolveSandboxAgentId(entry.sessionKey)).prune;
}
function shouldPruneSandboxEntry(prune, now, entry) {
	const idleHours = prune.idleHours;
	const maxAgeDays = prune.maxAgeDays;
	if (idleHours === 0 && maxAgeDays === 0) return false;
	const nowMs = asDateTimestampMs(now) ?? 0;
	const lastUsedAtMs = asDateTimestampMs(entry.lastUsedAtMs) ?? 0;
	const createdAtMs = asDateTimestampMs(entry.createdAtMs) ?? 0;
	const idleMs = nowMs - lastUsedAtMs;
	const ageMs = nowMs - createdAtMs;
	return idleHours > 0 && idleMs > idleHours * 60 * 60 * 1e3 || maxAgeDays > 0 && ageMs > maxAgeDays * 24 * 60 * 60 * 1e3;
}
/** Removes expired registry entries and their backing runtime resources. */
async function pruneSandboxRegistryEntries(params) {
	const now = Date.now();
	const registry = await params.read();
	for (const entry of registry.entries) {
		if (!shouldPruneSandboxEntry(resolveEntryPruneConfig(params.config, entry), now, entry)) continue;
		try {
			await params.remove(entry, (current) => shouldPruneSandboxEntry(resolveEntryPruneConfig(params.config, current), now, current));
		} catch (error) {
			const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
			defaultRuntime.error?.(`Sandbox prune failed to remove ${entry.containerName}: ${message ?? "unknown error"}`);
		}
	}
}
/** Prunes ordinary sandbox runtime containers from the configured backend manager. */
async function pruneSandboxContainers(config) {
	await pruneSandboxRegistryEntries({
		config,
		read: readRegistry,
		remove: (entry, shouldRemove) => removeSandboxRegistryRuntime(entry, async (current) => {
			const backendId = current.backendId ?? "docker";
			const manager = getSandboxBackendManager(backendId);
			if (!manager) throw new Error(`Sandbox backend "${backendId}" is unavailable; enable its plugin before removing this runtime.`);
			await manager.removeRuntime({
				entry: current,
				config,
				agentId: resolveSandboxAgentId(current.sessionKey)
			});
		}, {
			reserveRuntime: usesSandboxRuntimeReservations(entry.backendId ?? "docker"),
			shouldRemove
		})
	});
}
/** Prunes browser bridge containers and closes matching in-process bridge servers. */
async function pruneSandboxBrowsers(config) {
	await pruneSandboxRegistryEntries({
		config,
		read: readBrowserRegistry,
		remove: async (entry, shouldRemove) => {
			await withSandboxRegistryEntryLock({
				...entry,
				backendId: "docker"
			}, async () => {
				const current = (await readBrowserRegistry()).entries.find((candidate) => candidate.containerName === entry.containerName);
				if (!current || !shouldRemove(current)) return;
				try {
					assertSandboxBrowserRegistryEntryCurrent(entry);
				} catch {
					return;
				}
				await stopCachedBrowserBridgesForContainer(current.containerName);
				await dockerSandboxBackendManager.removeRuntime({
					entry: {
						...current,
						backendId: "docker",
						runtimeLabel: current.containerName,
						configLabelKind: "Image"
					},
					config,
					agentId: resolveSandboxAgentId(current.sessionKey)
				});
				removeSandboxRegistryGeneration("browser", current, () => assertSandboxBrowserRegistryEntryCurrent(current));
			});
		}
	});
}
/** Runs sandbox pruning at most once per throttle window. */
async function maybePruneSandboxes(config) {
	const now = Date.now();
	if (now - lastPruneAtMs < 3e5) return;
	lastPruneAtMs = now;
	try {
		const currentConfig = config ?? getRuntimeConfig();
		await pruneSandboxContainers(currentConfig);
		await pruneSandboxBrowsers(currentConfig);
	} catch (error) {
		const message = error instanceof Error ? error.message : typeof error === "string" ? error : JSON.stringify(error);
		defaultRuntime.error?.(`Sandbox prune failed: ${message ?? "unknown error"}`);
	}
}
//#endregion
export { maybePruneSandboxes };
