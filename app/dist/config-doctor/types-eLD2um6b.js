import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
//#region packages/memory-host-sdk/src/host/types.ts
/** Automatic prompt injection is reserved for content with authoritative trusted provenance. */
function isMemoryOriginEligibleForAutomaticInjection(originClass) {
	return originClass === "owner" || originClass === "agent";
}
function isAutomaticMemoryEntryEligible(entry) {
	return isMemoryOriginEligibleForAutomaticInjection(entry.provenance?.originClass);
}
function resolveMemoryIndexIdentityDiagnostic(status) {
	const identity = asNullableRecord(status.custom?.indexIdentity);
	const reason = typeof identity?.reason === "string" ? identity.reason.trim() : "";
	if (!identity || !reason) return;
	if (identity.status === "missing" && identity.code === "metadata_missing" && identity.owner === "testclaw") return {
		status: "missing",
		reason,
		code: "metadata_missing",
		owner: "testclaw"
	};
	if (identity.status !== "mismatched") return;
	if (identity.owner === "testclaw" && (identity.code === "provenance_version" || identity.code === "chunking_version")) return {
		status: "mismatched",
		reason,
		code: identity.code,
		owner: "testclaw",
		...identity.code === "chunking_version" && identity.chunkingVersionOnly === true && identity.versionOrder !== "newer" ? { chunkingVersionOnly: true } : {}
	};
	if (identity.owner === "configuration" && (identity.code === "model" || identity.code === "provider" || identity.code === "provider_settings" || identity.code === "sources" || identity.code === "scope" || identity.code === "chunking" || identity.code === "vector_dims" || identity.code === "fts_tokenizer")) return {
		status: "mismatched",
		reason,
		code: identity.code,
		owner: "configuration"
	};
}
function formatMemoryIndexRebuildGuidance(status, agentId) {
	return `${`testclaw memory status --index${agentId?.trim() ? ` --agent ${agentId.trim()}` : ""}`}. ${(status.requestedProvider?.trim() || status.provider?.trim()) === "none" ? "Rebuilding uses keyword indexing only and does not call an embedding provider." : "Rebuilding may call the configured embedding provider and can incur provider cost."}`;
}
function resolveMemoryIndexSearchDiagnostic(diagnostic, status, agentId) {
	const repairFailure = diagnostic.owner === "testclaw" && status.lastSyncError?.trim();
	const newerIndex = diagnostic.owner === "testclaw" && diagnostic.status === "mismatched" && asNullableRecord(status.custom?.indexIdentity)?.versionOrder === "newer";
	if (repairFailure && !newerIndex) {
		const guidance = {
			warning: `Memory index repair failed: ${repairFailure}. The existing index was left unchanged.`,
			action: `Run: testclaw memory status --deep${agentId?.trim() ? ` --agent ${agentId.trim()}` : ""}. Resolve the reported sync failure before retrying the search.`
		};
		return {
			error: repairFailure,
			...guidance,
			staleness: {
				stale: true,
				...guidance
			}
		};
	}
	const cause = diagnostic.owner === "configuration" ? `the current memory configuration no longer matches the index (${diagnostic.reason})` : diagnostic.code === "metadata_missing" ? `the memory index metadata is missing (${diagnostic.reason}); no configuration change is needed` : newerIndex ? diagnostic.reason : `this Assistant version changed the memory index format (${diagnostic.reason}); no configuration change is needed`;
	const guidance = formatMemoryIndexRebuildGuidance(status, agentId);
	const priorFailure = repairFailure ? ` Previous memory sync failed: ${repairFailure}.` : "";
	return {
		error: diagnostic.reason,
		warning: `Tell the user: memory search is paused because ${cause}.${priorFailure}`,
		action: newerIndex ? `Tell the user to upgrade Assistant or reindex explicitly: ${guidance}` : `Tell the user to run: ${guidance}`,
		staleness: {
			stale: true,
			warning: `Memory index is stale: ${diagnostic.reason} (owner: ${diagnostic.owner}, code: ${diagnostic.code}). Search results may be incomplete.${priorFailure}`,
			action: newerIndex ? `Upgrade Assistant or reindex explicitly: ${guidance}` : `Run: ${guidance}`
		}
	};
}
function resolveMemorySearchStaleness(status, agentId) {
	const diagnostic = resolveMemoryIndexIdentityDiagnostic(status);
	if (diagnostic) return resolveMemoryIndexSearchDiagnostic(diagnostic, status, agentId).staleness;
	const reason = status.lastSyncError?.trim();
	if (!reason) return null;
	return {
		stale: true,
		warning: `Memory index is stale: ${reason}. Search results may be incomplete.`,
		action: `Run: ${formatMemoryIndexRebuildGuidance(status, agentId)}`
	};
}
//#endregion
export { isMemoryOriginEligibleForAutomaticInjection as n, resolveMemorySearchStaleness as r, isAutomaticMemoryEntryEligible as t };
