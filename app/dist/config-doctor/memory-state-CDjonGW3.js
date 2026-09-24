import { n as filterStringEntries } from "./string-normalization-DsCfAx8q.js";
import { d as resolveEffectivePluginActivationState, l as normalizePluginsConfig } from "./config-state-D4j-tzq3.js";
import { t as createSubsystemLogger } from "./subsystem-B0s_EQTq.js";
import "./plugin-instance-scope-B1RUw70q.js";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-B7K42D1p.js";
import { y as requireActivePluginRegistry } from "./runtime-B980B6n3.js";
import { AsyncLocalStorage } from "node:async_hooks";
createSubsystemLogger("plugins/memory-state");
function resolveMemoryCapabilityRegistration(registrations) {
	let effective;
	for (const registration of registrations) {
		const existing = effective;
		if (!existing) {
			effective = registration;
			continue;
		}
		const existingOwnsSlot = existing.memorySlotSelected === true;
		if (existingOwnsSlot !== (registration.memorySlotSelected === true)) {
			const owner = existingOwnsSlot ? existing : registration;
			const contributor = existingOwnsSlot ? registration : existing;
			effective = {
				pluginId: owner.pluginId,
				capability: {
					...contributor.capability,
					...owner.capability
				},
				memorySlotSelected: true
			};
			continue;
		}
		const preserveExisting = Boolean(registration.capability.publicArtifacts) && !registration.capability.promptBuilder && !registration.capability.flushPlanResolver && !registration.capability.runtime;
		effective = {
			pluginId: registration.pluginId,
			capability: {
				...preserveExisting ? existing.capability : {},
				...registration.capability
			},
			memorySlotSelected: registration.memorySlotSelected
		};
	}
	return effective;
}
const getMemoryCapability = () => resolveMemoryCapabilityRegistration(getPluginRegistryForContext()?.memoryCapabilities ?? []);
const preparedMemoryPromptSections = /* @__PURE__ */ new WeakSet();
const activePreparedMemoryPromptSection = new AsyncLocalStorage();
function adoptEligibleRuntimeMemoryRegistrations(target, runtime, canAdopt) {
	const pluginIds = new Set(target.map((registration) => registration.pluginId));
	let adopted;
	for (const registration of runtime) {
		if (pluginIds.has(registration.pluginId) || !canAdopt(registration.pluginId)) continue;
		(adopted ??= [...target]).push(registration);
		pluginIds.add(registration.pluginId);
	}
	return adopted ?? target;
}
/**
* Discovery scopes cannot safely rerun full memory plugin setup.
* Reuse exact root sidecars only while activation and source ownership still match.
*/
function adoptRuntimeMemoryRegistrations(targetRegistry, runtimeRegistry, config) {
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const canAdopt = (pluginId) => {
		const targetOwner = targetRegistry.plugins.find((plugin) => plugin.id === pluginId);
		const runtimeOwner = runtimeRegistry.plugins.find((plugin) => plugin.id === pluginId);
		if (runtimeOwner?.status !== "loaded" || !resolveEffectivePluginActivationState({
			id: runtimeOwner.id,
			origin: runtimeOwner.origin,
			config: normalizedConfig,
			rootConfig: config,
			enabledByDefault: runtimeOwner.activationSource === "default"
		}).enabled || targetOwner && (targetOwner.status !== "loaded" || targetOwner.source !== runtimeOwner.source)) return false;
		return true;
	};
	const memoryCorpusSupplements = adoptEligibleRuntimeMemoryRegistrations(targetRegistry.memoryCorpusSupplements, runtimeRegistry.memoryCorpusSupplements, canAdopt);
	const memoryPromptPreparations = adoptEligibleRuntimeMemoryRegistrations(targetRegistry.memoryPromptPreparations, runtimeRegistry.memoryPromptPreparations, canAdopt);
	const memoryPromptSupplements = adoptEligibleRuntimeMemoryRegistrations(targetRegistry.memoryPromptSupplements, runtimeRegistry.memoryPromptSupplements, canAdopt);
	return memoryCorpusSupplements === targetRegistry.memoryCorpusSupplements && memoryPromptPreparations === targetRegistry.memoryPromptPreparations && memoryPromptSupplements === targetRegistry.memoryPromptSupplements ? targetRegistry : {
		...targetRegistry,
		memoryCorpusSupplements,
		memoryPromptPreparations,
		memoryPromptSupplements
	};
}
function buildSynchronousMemoryPromptSection(params) {
	const registry = requireActivePluginRegistry();
	return {
		primary: filterStringEntries(resolveMemoryCapabilityRegistration(registry.memoryCapabilities)?.capability.promptBuilder?.(params) ?? []),
		supplements: registry.memoryPromptSupplements.toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).map((registration) => ({
			pluginId: registration.pluginId,
			lines: filterStringEntries(registration.builder(params))
		}))
	};
}
function cloneMemoryPromptSectionParams(params) {
	return {
		availableTools: new Set(params.availableTools),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	};
}
function snapshotMemoryPromptContext(params) {
	return Object.freeze({
		availableTools: Object.freeze([...params.availableTools].toSorted()),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed === true
	});
}
/** Prepare one immutable memory prompt snapshot for a run. */
async function prepareMemoryPromptSection(params) {
	const runParams = cloneMemoryPromptSectionParams(params);
	const context = snapshotMemoryPromptContext(runParams);
	const synchronous = buildSynchronousMemoryPromptSection(cloneMemoryPromptSectionParams(runParams));
	const preparationRegistrations = [...requireActivePluginRegistry().memoryPromptPreparations];
	const preparedSupplements = await Promise.all(preparationRegistrations.map(async (registration) => ({
		pluginId: registration.pluginId,
		lines: filterStringEntries(await registration.prepare(cloneMemoryPromptSectionParams(runParams)))
	})));
	const lines = Object.freeze([...synchronous.primary, ...[...synchronous.supplements, ...preparedSupplements].toSorted((left, right) => left.pluginId.localeCompare(right.pluginId)).flatMap((registration) => registration.lines)]);
	const prepared = Object.freeze({
		context,
		lines
	});
	preparedMemoryPromptSections.add(prepared);
	return prepared;
}
/** Keep async preparation run-scoped while a context engine assembles synchronously. */
async function runWithPreparedMemoryPromptSection(params, run) {
	const prepared = await prepareMemoryPromptSection(params);
	return activePreparedMemoryPromptSection.run(prepared, run);
}
function resolveMemoryFlushPlan(params) {
	return getMemoryCapability()?.capability.flushPlanResolver?.(params) ?? null;
}
function getMemoryRuntime() {
	return getMemoryCapability()?.capability.runtime;
}
let standaloneMemoryManagerActive = false;
function setStandaloneMemoryManagerActive(active) {
	standaloneMemoryManagerActive = active;
}
function hasMemoryRuntime() {
	return standaloneMemoryManagerActive || getMemoryRuntime() !== void 0;
}
//#endregion
export { resolveMemoryCapabilityRegistration as a, setStandaloneMemoryManagerActive as c, prepareMemoryPromptSection as i, getMemoryRuntime as n, resolveMemoryFlushPlan as o, hasMemoryRuntime as r, runWithPreparedMemoryPromptSection as s, adoptRuntimeMemoryRegistrations as t };
