import { D as withAgentRosterFactsBatch } from "./agent-scope-config-BEuqweC1.js";
import "./testclaw-state-db-cache-BxGqhkwE.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-C3BvcqUT.js";
import { i as listAssistantRegisteredAgentDatabases, o as readAssistantAgentDatabaseRegistryToken } from "./testclaw-agent-db-registry-listing-DBxqeFUz.js";
import { t as createAssistantAgentDatabasePathMatcher } from "./testclaw-agent-db-registry-DgP56LUX.js";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BANhXeoo.js";
import { f as listConfiguredSessionStoreAgentIds, t as createExistingAgentSessionStoreTargetResolver } from "./targets-BxNVBaMw.js";
import { a as resolveGatewaySessionStoreLookupCandidates } from "./session-utils-store-lookup-BpmBw41u.js";
//#region src/gateway/session-utils-store-sources.ts
/** Bind candidate addresses once; registry metadata uses its existing invalidation owner. */
function prepareGatewaySessionStoreReadSources(params) {
	const registryOptions = {
		env: cloneEnvWithPlatformSemantics(params.env),
		path: params.registryPath,
		includeIncompatibleSchemaVersions: true
	};
	const currentSource = params.currentSource;
	const currentSourceAgentId = currentSource.agentId;
	const currentSourcePath = currentSource.path;
	let discoveryIsCurrent;
	let registryToken = readAssistantAgentDatabaseRegistryToken(registryOptions);
	const assertCurrent = () => {
		const currentToken = readAssistantAgentDatabaseRegistryToken(registryOptions);
		if (currentToken === registryToken) return;
		try {
			if (discoveryIsCurrent?.()) {
				registryToken = currentToken;
				return;
			}
		} catch {}
		throw new Error("Session store changed while preparing its metadata. Retry the request.");
	};
	const bindSources = () => withAgentRosterFactsBatch(params.cfg, () => {
		let registered;
		try {
			registered = listAssistantRegisteredAgentDatabases(registryOptions);
		} catch {
			return {};
		}
		const registryFacts = registered;
		registered = registered.filter((entry) => entry.schemaVersion === 23);
		const agentIds = /* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(params.cfg), ...registered.map((entry) => entry.agentId)]);
		const isSameDatabasePath = createAssistantAgentDatabasePathMatcher();
		const resolveExistingTargets = createExistingAgentSessionStoreTargetResolver(params.cfg, {
			env: params.env,
			registeredDatabases: registered,
			isSameDatabasePath
		});
		const sources = /* @__PURE__ */ new Map();
		const bindCurrentSource = (source) => {
			isSameDatabasePath(source.path, source.path);
			return source.agentId === currentSourceAgentId && isSameDatabasePath(source.path, currentSourcePath) ? currentSource : source;
		};
		for (const agentId of agentIds) try {
			const { candidates, readSources } = resolveGatewaySessionStoreLookupCandidates({
				...params,
				agentId,
				registeredDatabases: registered,
				resolveExistingTargets
			});
			const resolved = [];
			if (readSources) {
				for (const readSource of readSources) {
					const source = bindCurrentSource(readSource);
					if (!resolved.some((candidate) => candidate.agentId === source.agentId && isSameDatabasePath(candidate.path, source.path))) resolved.push(source);
				}
				sources.set(agentId, resolved);
				continue;
			}
			for (const candidate of candidates) {
				const target = resolveSqliteTargetFromSessionStorePath(candidate.storePath, {
					agentId: candidate.agentId,
					defaultAgentId: resolveSessionStoreCompatibilityAgentId(params.cfg),
					env: params.env,
					registeredDatabases: registered,
					isSameDatabasePath
				});
				if (target.ownerSource === "ambiguous-registry") {
					resolved.length = 0;
					break;
				}
				const source = bindCurrentSource({
					agentId: target.agentId ?? candidate.agentId,
					path: target.path
				});
				if (!resolved.some((resolvedSource) => isSameDatabasePath(resolvedSource.path, source.path))) resolved.push(source);
			}
			sources.set(agentId, resolved);
		} catch {
			sources.set(agentId, []);
		}
		discoveryIsCurrent = () => {
			const current = listAssistantRegisteredAgentDatabases(registryOptions);
			return currentSource.agentId === currentSourceAgentId && currentSource.path === currentSourcePath && current.length === registryFacts.length && current.every((entry, index) => {
				const previous = registryFacts[index];
				return entry.agentId === previous.agentId && entry.path === previous.path && entry.schemaVersion === previous.schemaVersion;
			}) && isSameDatabasePath.isCurrent();
		};
		return Object.fromEntries(sources);
	});
	let sources = params.deferSources ? void 0 : bindSources();
	return {
		get sources() {
			if (!sources) {
				assertCurrent();
				sources = bindSources();
			}
			return sources;
		},
		assertCurrent
	};
}
//#endregion
export { prepareGatewaySessionStoreReadSources as t };
