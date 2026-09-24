import { s as resolveProviderThinkingLevel } from "./thinking-jB2bcB7l.mjs";
import { a as getModelCompletionTransport, i as getModelCompletionOwner, n as bindModelLlmRuntime, o as getModelLlmRuntime } from "./model-runtime-binding-CD0DZgT6.mjs";
import { n as completeSimple } from "./stream-D3Vnt2kk.mjs";
import { defaultApiRegistry } from "@testclaw/ai/internal/runtime";
import { prepareHeadersForSimpleCompletion, prepareModelForSimpleCompletion } from "@testclaw/ai/transports";
import { reasoningTagTextPolicy } from "@testclaw/ai/internal/openai";
//#region src/agents/simple-completion-execution.ts
/** Executes an already-prepared model without importing model/auth preparation. */
async function completeWithPreparedSimpleCompletionModel(params) {
	const owner = getModelCompletionOwner(params.model);
	if (!owner) return await completePreparedModel(params);
	return await owner.run(() => completePreparedModel({
		...params,
		assertCurrent: () => {
			owner.assertCurrent();
			params.assertCurrent?.();
		}
	}));
}
async function completePreparedModel(params) {
	await import("./ai-transport-runtime-host-DMoQpVFc.mjs");
	params.assertCurrent?.();
	params.options?.signal?.throwIfAborted();
	const runtime = getModelLlmRuntime(params.model);
	let completionModel = getModelCompletionTransport(params.model) ?? prepareModelForSimpleCompletion({
		apiRegistry: runtime?.registry ?? defaultApiRegistry,
		model: params.model,
		cfg: params.cfg
	});
	if (runtime) completionModel = bindModelLlmRuntime(completionModel, runtime);
	const { reasoning: rawReasoning, strictReasoningTags, ...options } = params.options ?? {};
	const providerReasoning = resolveProviderThinkingLevel({
		provider: completionModel.provider,
		model: completionModel.id,
		catalog: [completionModel],
		agentRuntime: "testclaw",
		level: rawReasoning
	});
	const reasoning = providerReasoning === "adaptive" ? "medium" : providerReasoning;
	const headers = prepareHeadersForSimpleCompletion(completionModel, options);
	const completionOptions = {
		...options,
		...reasoning ? { reasoning } : {},
		apiKey: params.auth.apiKey,
		...headers ? { headers } : {}
	};
	if (strictReasoningTags) reasoningTagTextPolicy.markStrict(completionOptions);
	return await completeSimple(completionModel, params.context, completionOptions, params.assertCurrent);
}
//#endregion
export { completeWithPreparedSimpleCompletionModel as t };
