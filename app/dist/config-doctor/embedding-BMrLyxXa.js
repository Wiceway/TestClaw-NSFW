import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as resolveAgentDir } from "./agent-scope-config-BEuqweC1.js";
import { r as defaultRuntime } from "./runtime-kM7jday_.js";
import "./agent-scope-BiRi-Smp.js";
import { l as getMemoryEmbeddingCommandSecretTargetIds } from "./command-secret-targets-CdV9gKy0.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C_fSkqnL.js";
import { n as listRegisteredMemoryEmbeddingProviderAdapters, r as listEmbeddingProviders } from "./memory-embedding-provider-runtime-N9IdwZ9L.js";
import { n as formatEnvelopeForText, r as providerSummaryText, t as emitJsonOrText } from "./output-D5mZF4lu.js";
import { n as runCommandWithRuntime } from "./cli-utils-BOBTfPOr.js";
import { t as prepareLocalCapabilityAccountSecrets } from "./local-account-secrets-D2qNkofJ.js";
import { a as providerHasGenericConfig, c as resolveCapabilityAgentOption, l as resolveCapabilityProviderAgentId, o as registerLocalProvidersCommand, s as requireProviderModelOverride, u as resolveLocalCapabilityRuntimeConfig } from "./shared-BFDkGrRp.js";
import { r as createEmbeddingProvider } from "./memory-core-bundled-runtime-9KJR1T1P.js";
import { t as collectOption } from "./helpers-BGwqfJ8f.js";
//#region src/cli/capability-cli/embedding.ts
async function closeEmbeddingProviderWithRetry(provider) {
	let lastError;
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		await provider.close?.();
		return;
	} catch (err) {
		lastError = err;
	}
	throw lastError;
}
async function runMemoryEmbeddingCreate(params) {
	const modelRef = requireProviderModelOverride(params.model);
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer embedding create",
		targetIds: getMemoryEmbeddingCommandSecretTargetIds()
	});
	const requestedProvider = normalizeOptionalString(params.provider) || modelRef?.provider || "auto";
	const agentId = resolveCapabilityProviderAgentId(cfg, params.agent, "infer embedding create");
	await prepareLocalCapabilityAccountSecrets({
		cfg,
		agentId
	});
	const result = await createEmbeddingProvider({
		config: cfg,
		agentDir: resolveAgentDir(cfg, agentId),
		provider: requestedProvider,
		fallback: "none",
		model: modelRef?.model ?? ""
	});
	if (!result.provider) throw new Error(result.providerUnavailableReason ?? "No embedding provider available.");
	const provider = result.provider;
	let embeddings = [];
	let operationError;
	let operationFailed = false;
	try {
		embeddings = await provider.embedBatch(params.texts, { inputType: "document" });
	} catch (err) {
		operationError = err;
		operationFailed = true;
	}
	let closeError;
	let closeFailed = false;
	try {
		await closeEmbeddingProviderWithRetry(provider);
	} catch (err) {
		closeError = err;
		closeFailed = true;
	}
	if (operationFailed) throw operationError;
	if (closeFailed) throw closeError;
	return {
		ok: true,
		capability: "embedding.create",
		transport: "local",
		provider: provider.id,
		model: provider.model,
		attempts: result.fallbackFrom ? [{
			provider: result.fallbackFrom,
			outcome: "failed",
			error: result.fallbackReason
		}] : [],
		outputs: embeddings.map((embedding, index) => ({
			text: params.texts[index],
			embedding,
			dimensions: embedding.length
		}))
	};
}
function registerEmbeddingCapabilityCommands(capability) {
	const embedding = capability.command("embedding").description("Embedding providers").option("--agent <id>", "Agent whose model and auth state should be used");
	embedding.command("create").description("Create embeddings").requiredOption("--text <text>", "Input text", collectOption).option("--provider <id>", "Provider id").option("--model <provider/model>", "Model override").option("--agent <id>", "Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action(async (opts, command) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runMemoryEmbeddingCreate({
				texts: opts.text,
				agent: resolveCapabilityAgentOption(command, opts.agent),
				provider: opts.provider,
				model: opts.model
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
		});
	});
	registerLocalProvidersCommand(embedding, "List embedding providers", (cfg, agentId) => {
		const resolvedMemory = resolveMemorySearchConfig(cfg, agentId);
		const selectedProvider = resolvedMemory?.provider;
		const providers = new Map(listRegisteredMemoryEmbeddingProviderAdapters().map((provider) => [provider.id, {
			id: provider.id,
			defaultModel: provider.defaultModel,
			transport: provider.transport,
			autoSelectPriority: provider.autoSelectPriority
		}]));
		for (const provider of listEmbeddingProviders(cfg)) {
			if (providers.has(provider.id)) continue;
			providers.set(provider.id, {
				id: provider.id,
				defaultModel: provider.defaultModel,
				transport: provider.transport,
				autoSelectPriority: void 0
			});
		}
		if (selectedProvider && !providers.has(selectedProvider)) providers.set(selectedProvider, {
			id: selectedProvider,
			defaultModel: resolvedMemory?.model || void 0,
			transport: providerHasGenericConfig({
				cfg,
				providerId: selectedProvider,
				agentId
			}) ? "remote" : void 0,
			autoSelectPriority: void 0
		});
		return Array.from(providers.values()).map((provider) => ({
			available: true,
			configured: provider.id === selectedProvider || providerHasGenericConfig({
				cfg,
				providerId: provider.id,
				agentId
			}),
			selected: provider.id === selectedProvider,
			id: provider.id,
			defaultModel: provider.defaultModel,
			transport: provider.transport,
			autoSelectPriority: provider.autoSelectPriority
		}));
	}, providerSummaryText);
}
//#endregion
export { registerEmbeddingCapabilityCommands };
