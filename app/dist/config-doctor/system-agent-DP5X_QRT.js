import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-kM7jday_.js";
import { t as _usingCtx } from "./usingCtx-E-VWE-jt.js";
import { a as isPersistentSystemAgentOperation, o as parseSystemAgentOperation } from "./operations-parse-CJ16l1J7.js";
import { t as executeSystemAgentOperation } from "./operations-BB1UEP4Y.js";
import { r as withProgress } from "./progress-47BE6b88.js";
import { a as resolveSystemAgentVerifiedInferenceRoute, r as hasCurrentSystemAgentOwnerPluginArtifacts } from "./verified-inference-CVC2Uoay.js";
import { t as SystemAgentInferenceUnavailableError } from "./inference-error-DWG7NHn3.js";
import { i as loadSystemAgentOverview, n as formatSystemAgentOverview } from "./overview-BGFW4MAR.js";
import { n as resolveSystemAgentOperation } from "./dialogue-sKLgARWy.js";
import { stdin, stdout } from "node:process";
//#region src/system-agent/system-agent.ts
function systemAgentCommandDepsFromOptions(opts) {
	if (!opts.deps && !opts.formatOverview && !opts.loadOverview) return;
	return {
		...opts.deps,
		...opts.formatOverview ? { formatOverview: opts.formatOverview } : {},
		...opts.loadOverview ? { loadOverview: opts.loadOverview } : {}
	};
}
async function requireVerifiedInference(opts) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		if (await resolveSystemAgentVerifiedInferenceRoute(opts.verifiedInference, opts.deps)) return;
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
async function requirePersistentApplyInference(opts, runtime) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		const { resolvePersistentApplyInference } = await import("./setup-inference-DqvZe-fa.js");
		if (await resolvePersistentApplyInference({
			binding: opts.verifiedInference,
			runtime,
			deps: opts.deps
		})) return;
	} catch (error) {
		if (error instanceof SystemAgentInferenceUnavailableError) throw error;
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
async function runOneShot(operation, runtime, opts) {
	if (operation.kind === "none" && operation.message === "") return;
	await requireVerifiedInference(opts);
	const approved = opts.yes === true || !isPersistentSystemAgentOperation(operation);
	if (approved && isPersistentSystemAgentOperation(operation)) await requirePersistentApplyInference(opts, runtime);
	await executeSystemAgentOperation(operation, runtime, {
		approved,
		deps: systemAgentCommandDepsFromOptions(opts)
	});
}
/** Run Assistant in JSON, one-shot message, or interactive TUI mode. */
async function runSystemAgent(opts, runtime = defaultRuntime) {
	try {
		var _usingCtx$1 = _usingCtx();
		const binding = opts?.verifiedInference;
		if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
		const boundOpts = {
			...opts,
			verifiedInference: binding
		};
		const run = () => runBoundSystemAgent(boundOpts, runtime);
		const route = binding.execution;
		if (route.runner !== "embedded" || route.agentHarnessRuntimeOverride === "testclaw") return await run();
		const { resolveAgentWorkspaceDir } = await import("./agent-scope-BM4mAou3.js");
		const { loadAgentRuntimePluginRegistryHandle } = await import("./runtime-plugins-BgH1q0Nj.js");
		const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-BgfYl99h.js");
		const { createPluginCache, withPluginCache } = await import("./plugin-cache-BVyF3Tvv.js");
		const { withPluginRuntimeRegistryScope } = await import("./gateway-request-scope-Ct9X80qg.js");
		const cache = _usingCtx$1.a(createPluginCache());
		const readSnapshot = boundOpts.deps?.readConfigFileSnapshot ?? (await import("./config-fCohulPn.js")).readConfigFileSnapshot;
		await withPluginRuntimeRegistryScope(await withPluginLifecycleLease({}, async (lease) => {
			const snapshot = await readSnapshot();
			if (!await hasCurrentSystemAgentOwnerPluginArtifacts(binding, {
				...boundOpts.deps,
				readConfigFileSnapshot: async () => snapshot
			})) throw new SystemAgentInferenceUnavailableError("conversation");
			const config = snapshot.runtimeConfig ?? snapshot.config;
			const workspaceDir = resolveAgentWorkspaceDir(config, route.agentId);
			lease.assertOwned();
			return withPluginCache(cache, () => loadAgentRuntimePluginRegistryHandle({
				basePluginIds: [],
				config,
				workspaceDir,
				selections: [{
					provider: route.provider,
					modelId: route.model,
					runtime: route.agentHarnessRuntimeOverride,
					agentId: route.agentId
				}]
			}));
		}), run);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
async function runBoundSystemAgent(boundOpts, runtime) {
	await requireVerifiedInference(boundOpts);
	if (boundOpts.json) {
		const overview = await (boundOpts.loadOverview ?? loadSystemAgentOverview)();
		writeRuntimeJson(runtime, overview);
		return;
	}
	if (boundOpts.message?.trim()) {
		const parsed = parseSystemAgentOperation(boundOpts.message);
		if (parsed.kind === "overview") {
			await runOneShot(parsed, runtime, boundOpts);
			return;
		}
		const overview = await withProgress({
			label: "Loading Assistant overview…",
			indeterminate: true,
			delayMs: 0,
			fallback: "none"
		}, async () => await (boundOpts.loadOverview ?? loadSystemAgentOverview)());
		runtime.log((boundOpts.formatOverview ?? formatSystemAgentOverview)(overview));
		runtime.log("");
		await runOneShot(await resolveSystemAgentOperation(boundOpts.message, runtime, {
			...boundOpts,
			loadOverview: async () => overview
		}), runtime, boundOpts);
		return;
	}
	if (boundOpts.interactive === false) {
		const overview = await (boundOpts.loadOverview ?? loadSystemAgentOverview)();
		runtime.log((boundOpts.formatOverview ?? formatSystemAgentOverview)(overview));
		return;
	}
	const input = boundOpts.input ?? stdin;
	const output = boundOpts.output ?? stdout;
	const inputIsTty = input.isTTY === true;
	const outputIsTty = output.isTTY === true;
	if (!inputIsTty || !outputIsTty) {
		runtime.error("Assistant needs an interactive TTY. Use --message for one command.");
		runtime.exit(1);
		return;
	}
	const runInteractiveTui = boundOpts.runInteractiveTui ?? (await import("./tui-backend-Cs2QnWfv.js")).runSystemAgentTui;
	boundOpts.onReady?.();
	await runInteractiveTui(boundOpts, runtime);
}
//#endregion
export { runSystemAgent };
