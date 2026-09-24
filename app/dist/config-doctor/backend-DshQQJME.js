import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { f as reserveSandboxRegistryEntry, h as withSandboxRegistryEntryLock, m as updateRegistry, n as assertSandboxRegistryEntryCurrent, r as completeSandboxRegistryReservation } from "./registry-BF57nGps.js";
import { d as createDockerSandboxBackend, f as createPodmanSandboxBackend, m as podmanSandboxBackendManager, p as dockerSandboxBackendManager } from "./fs-bridge-stat-parse-BJ4fl30v.js";
import { t as SandboxRuntimeRetiredError } from "./provisioning-error-BNwGapwt.js";
import { d as resolveRemoteShellRuntimePaths, n as createSshSandboxBackend, r as sshSandboxBackendManager } from "./ssh-backend-CnWZXcSS.js";
//#region src/agents/sandbox/backend.ts
/**
* Sandbox backend registry.
*
* Stores process-wide backend factories so core and plugins can register local container, SSH, or custom sandbox providers.
*/
const SANDBOX_BACKEND_FACTORIES_STATE_KEY = Symbol.for("testclaw.sandboxBackendFactories");
function getSandboxBackendFactories() {
	const globalStore = globalThis;
	globalStore[SANDBOX_BACKEND_FACTORIES_STATE_KEY] ??= /* @__PURE__ */ new Map();
	return globalStore[SANDBOX_BACKEND_FACTORIES_STATE_KEY];
}
function normalizeSandboxBackendId(id) {
	const normalized = normalizeOptionalLowercaseString(id);
	if (!normalized) throw new Error("Sandbox backend id must not be empty.");
	return normalized;
}
/** Look up a sandbox backend factory by normalized backend id. */
function getSandboxBackendFactory(id) {
	const registration = resolveSandboxBackendRegistration(id);
	if (!registration) return null;
	if (!registration.reserveRuntimeId) return registration.factory;
	const factory = registration.factory;
	return async (params) => {
		const { runtimeId, assertRuntimeCurrent } = params;
		if (!runtimeId || !assertRuntimeCurrent) throw new Error(`Sandbox backend "${id}" requires a registry-reserved runtime and its current owner.`);
		assertRuntimeCurrent();
		return factory({
			...params,
			runtimeId,
			assertRuntimeCurrent
		});
	};
}
/** Look up optional lifecycle management hooks for a registered backend. */
function getSandboxBackendManager(id) {
	return resolveSandboxBackendRegistration(id)?.manager ?? null;
}
/** Include legacy rows in the lifecycle selected by the currently registered backend. */
function usesSandboxRuntimeReservations(id) {
	return resolveSandboxBackendRegistration(id)?.reserveRuntimeId !== void 0;
}
/** Look up optional backend workdir resolution that does not start the runtime. */
function getSandboxBackendWorkdirResolver(id) {
	return resolveSandboxBackendRegistration(id)?.resolveWorkdir ?? null;
}
/** Read static backend capabilities without provisioning a sandbox runtime. */
function getSandboxBackendCapabilities(id) {
	return resolveSandboxBackendRegistration(id)?.capabilities;
}
/** Resolve a backend factory or throw the user-facing configuration error. */
function requireSandboxBackendFactory(id) {
	const factory = getSandboxBackendFactory(id);
	if (factory) return factory;
	throw new Error([`Sandbox backend "${id}" is not registered.`, "Load the plugin that provides it, or set agents.defaults.sandbox.backend=docker."].join("\n"));
}
/** Create and publish a backend, reserving provider IDs only for opted-in factories. */
async function createSandboxBackend(params, operatorAuthority) {
	const factory = requireSandboxBackendFactory(params.cfg.backend);
	const reserveRuntimeId = resolveSandboxBackendRegistration(params.cfg.backend)?.reserveRuntimeId;
	const toEntry = (backend) => ({
		containerName: backend.runtimeId,
		backendId: backend.id,
		runtimeLabel: backend.runtimeLabel,
		sessionKey: params.scopeKey,
		createdAtMs: Date.now(),
		lastUsedAtMs: Date.now(),
		image: backend.configLabel ?? params.cfg.docker.image,
		configLabelKind: backend.configLabelKind ?? "Image"
	});
	if (!reserveRuntimeId) {
		const backend = factory === createDockerSandboxBackend ? await createDockerSandboxBackend(params, operatorAuthority) : factory === createPodmanSandboxBackend ? await createPodmanSandboxBackend(params, operatorAuthority) : await factory(params);
		await updateRegistry(toEntry(backend));
		return backend;
	}
	for (let attempt = 0;; attempt++) {
		const reservation = reserveSandboxRegistryEntry({
			containerName: reserveRuntimeId(params),
			backendId: params.cfg.backend,
			sessionKey: params.scopeKey,
			createdAtMs: Date.now(),
			lastUsedAtMs: Date.now(),
			image: params.cfg.docker.image,
			workspaceDir: params.workspaceDir
		});
		try {
			return await withSandboxRegistryEntryLock(reservation, async () => {
				assertSandboxRegistryEntryCurrent(reservation);
				try {
					const backend = await factory({
						...params,
						workspaceDir: reservation.workspaceDir ?? params.workspaceDir,
						runtimeId: reservation.containerName,
						assertRuntimeCurrent: () => assertSandboxRegistryEntryCurrent(reservation)
					});
					if (backend.runtimeId !== reservation.containerName || backend.id !== reservation.backendId) throw new Error("Sandbox backend returned a runtime outside its reserved generation.");
					await completeSandboxRegistryReservation(toEntry(backend));
					return backend;
				} catch (error) {
					if (error instanceof SandboxRuntimeRetiredError && error.runtimeId === reservation.containerName) await completeSandboxRegistryReservation(reservation, true);
					throw error;
				}
			});
		} catch (error) {
			if (!(error instanceof SandboxRuntimeRetiredError) || error.runtimeId !== reservation.containerName || attempt > 0) throw error;
		}
	}
}
const builtinSandboxBackends = /* @__PURE__ */ new Map();
builtinSandboxBackends.set("docker", {
	factory: createDockerSandboxBackend,
	manager: dockerSandboxBackendManager,
	resolveWorkdir: ({ cfg }) => cfg.docker.workdir,
	capabilities: { readOnlyResourceMounts: true }
});
builtinSandboxBackends.set("podman", {
	factory: createPodmanSandboxBackend,
	manager: podmanSandboxBackendManager,
	resolveWorkdir: ({ cfg }) => cfg.docker.workdir,
	capabilities: { readOnlyResourceMounts: true }
});
builtinSandboxBackends.set("ssh", {
	factory: createSshSandboxBackend,
	manager: sshSandboxBackendManager,
	resolveWorkdir: ({ cfg, scopeKey }) => resolveRemoteShellRuntimePaths(cfg.ssh.workspaceRoot, scopeKey).remoteWorkspaceDir
});
function resolveSandboxBackendRegistration(id) {
	const normalizedId = normalizeSandboxBackendId(id);
	return getSandboxBackendFactories().get(normalizedId)?.registration ?? builtinSandboxBackends.get(normalizedId);
}
//#endregion
export { getSandboxBackendWorkdirResolver as a, getSandboxBackendManager as i, getSandboxBackendCapabilities as n, requireSandboxBackendFactory as o, getSandboxBackendFactory as r, usesSandboxRuntimeReservations as s, createSandboxBackend as t };
