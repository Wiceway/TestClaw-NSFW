import { M as resolveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { t as expandHomePrefix } from "./home-dir-DjuHbd5R.js";
import { r as sha256HexPrefixCore } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { r as normalizeExecAsk } from "./exec-approvals-core-BW9WjMmv.js";
import { r as isGeneratedHashedArgPattern } from "./exec-command-resolution-hTQFa-so.js";
import { _ as hasPosixInteractiveStartupBeforeInlineCommand, d as isShellWrapperInvocation, h as POSIX_INLINE_COMMAND_FLAGS, i as extractBindableShellWrapperInlineCommand, v as hasPosixLoginStartupBeforeInlineCommand } from "./shell-wrapper-resolution-BVUBYqqS.js";
import { c as resolveExecApprovalsDisplayPath, o as normalizeExecApprovalsInternal, u as resolveExecApprovalsSocketPath } from "./exec-approvals-config-BN4b4XLr.js";
import { c as replaceExecApprovalsSnapshot, d as updateExecApprovalsSync, n as ensureExecApprovalsSnapshot, r as loadExecApprovals, t as commitExecAuthorizations } from "./exec-approvals-store-BSrG9R8i.js";
import { o as resolveAllowAlwaysPatternEntries } from "./exec-approvals-allowlist-BZrsAgyU.js";
import "./extract-C85vXhx0.js";
import "./exec-approvals-generated-migration-CStfNiQj.js";
import { addAbortListener } from "node:events";
import net from "node:net";
import { clearTimeout, setTimeout } from "node:timers";
//#region src/infra/exec-approvals-resolver.ts
function isExecSecurity(value) {
	return value === "allowlist" || value === "full" || value === "deny";
}
function isExecAsk(value) {
	return value === "always" || value === "off" || value === "on-miss";
}
function normalizeSecurity(value, fallback) {
	return isExecSecurity(value) ? value : fallback;
}
function normalizeAsk(value, fallback) {
	return isExecAsk(value) ? value : fallback;
}
function resolveDefaultSecurityField(params) {
	const defaultValue = params.defaults[params.field];
	if (isExecSecurity(defaultValue)) return {
		value: defaultValue,
		source: `defaults.${params.field}`
	};
	return {
		value: params.fallback,
		source: null
	};
}
function resolveDefaultAskField(params) {
	if (isExecAsk(params.defaults.ask)) return {
		value: params.defaults.ask,
		source: "defaults.ask"
	};
	return {
		value: params.fallback,
		source: null
	};
}
function resolveAgentSecurityField(params) {
	const fallbackField = resolveDefaultSecurityField({
		field: params.field,
		defaults: params.defaults,
		fallback: params.fallback
	});
	if (params.rawAgent[params.field] != null) {
		if (isExecSecurity(params.agent[params.field])) return {
			value: params.agent[params.field],
			source: `agents.${params.agentKey}.${params.field}`
		};
		return fallbackField;
	}
	if (params.rawWildcard[params.field] != null) {
		if (isExecSecurity(params.wildcard[params.field])) return {
			value: params.wildcard[params.field],
			source: `agents.*.${params.field}`
		};
		return fallbackField;
	}
	return fallbackField;
}
function resolveAgentAskField(params) {
	const fallbackField = resolveDefaultAskField({
		defaults: params.defaults,
		fallback: params.fallback
	});
	if (params.rawAgent.ask != null) {
		if (isExecAsk(params.agent.ask)) return {
			value: params.agent.ask,
			source: `agents.${params.agentKey}.ask`
		};
		return fallbackField;
	}
	if (params.rawWildcard.ask != null) {
		if (isExecAsk(params.wildcard.ask)) return {
			value: params.wildcard.ask,
			source: "agents.*.ask"
		};
		return fallbackField;
	}
	return fallbackField;
}
function resolveExecApprovalsFromFilePrepared(params) {
	const rawFile = params.rawFile;
	const file = params.file;
	const defaults = file.defaults ?? {};
	const agentKey = params.agentId ?? "default";
	const agent = file.agents?.[agentKey] ?? {};
	const wildcard = file.agents?.["*"] ?? {};
	const rawAgent = rawFile.agents?.[agentKey] ?? {};
	const rawWildcard = rawFile.agents?.["*"] ?? {};
	const fallbackSecurity = params.overrides?.security ?? "full";
	const fallbackAsk = params.overrides?.ask ?? "off";
	const fallbackAskFallback = params.overrides?.askFallback ?? "deny";
	const fallbackAutoAllowSkills = params.overrides?.autoAllowSkills ?? false;
	const resolvedDefaults = {
		security: normalizeSecurity(defaults.security, fallbackSecurity),
		ask: normalizeAsk(defaults.ask, fallbackAsk),
		askFallback: normalizeSecurity(defaults.askFallback ?? fallbackAskFallback, fallbackAskFallback),
		autoAllowSkills: defaults.autoAllowSkills ?? fallbackAutoAllowSkills
	};
	const resolvedAgentSecurity = resolveAgentSecurityField({
		field: "security",
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.security
	});
	const resolvedAgentAsk = resolveAgentAskField({
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.ask
	});
	const resolvedAgentAskFallback = resolveAgentSecurityField({
		field: "askFallback",
		defaults,
		agent,
		rawAgent,
		wildcard,
		rawWildcard,
		agentKey,
		fallback: resolvedDefaults.askFallback
	});
	const resolvedAgent = {
		security: resolvedAgentSecurity.value,
		ask: resolvedAgentAsk.value,
		askFallback: resolvedAgentAskFallback.value,
		autoAllowSkills: agent.autoAllowSkills ?? wildcard.autoAllowSkills ?? resolvedDefaults.autoAllowSkills
	};
	const allowlist = [...Array.isArray(wildcard.allowlist) ? wildcard.allowlist : [], ...Array.isArray(agent.allowlist) ? agent.allowlist : []];
	return {
		path: params.path ?? resolveExecApprovalsDisplayPath(),
		socketPath: expandHomePrefix(params.socketPath ?? file.socket?.path ?? resolveExecApprovalsSocketPath()),
		token: params.token,
		defaults: resolvedDefaults,
		agent: resolvedAgent,
		agentSources: {
			security: resolvedAgentSecurity.source,
			ask: resolvedAgentAsk.source,
			askFallback: resolvedAgentAskFallback.source
		},
		allowlist,
		file
	};
}
function resolveExecApprovalsFromFileInternal(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovalsInternal(params.file);
	const { token: socketToken } = file.socket ?? {};
	return resolveExecApprovalsFromFilePrepared({
		...params,
		rawFile,
		file,
		token: params.token ?? socketToken ?? ""
	});
}
//#endregion
//#region src/infra/exec-approvals-policy.ts
function requiresExecApproval(params) {
	if (params.ask === "always") return true;
	if (params.durableApprovalSatisfied === true) return false;
	return params.ask === "on-miss" && params.security === "allowlist" && (!params.analysisOk || !params.allowlistSatisfied);
}
function normalizeCommandName(value) {
	return (value ?? "").split(/[\\/]/).pop()?.toLowerCase() ?? "";
}
function textMentionsSecurityAuditSuppressions(value) {
	const normalized = value.toLowerCase();
	return normalized.includes("security.audit.suppressions") || /["']?security["']?[\s\S]{0,200}["']?audit["']?[\s\S]{0,200}["']?suppressions["']?/.test(normalized);
}
function isReadOnlySecurityAuditSuppressionInspection(argv) {
	let offset = normalizeCommandName(argv[0]) === "pnpm" && argv[1] === "testclaw" ? 1 : 0;
	if (normalizeCommandName(argv[offset]) !== "testclaw") return false;
	offset += 1;
	while (offset < argv.length) {
		const arg = argv[offset];
		if (["--dev", "--no-color"].includes(arg ?? "")) {
			offset += 1;
			continue;
		}
		if ([
			"--profile",
			"--container",
			"--log-level"
		].includes(arg ?? "")) {
			offset += 2;
			continue;
		}
		if (arg?.startsWith("--profile=") || arg?.startsWith("--container=") || arg?.startsWith("--log-level=")) {
			offset += 1;
			continue;
		}
		break;
	}
	return argv[offset] === "config" && [
		"get",
		"schema",
		"validate"
	].includes(argv[offset + 1] ?? "");
}
function removeParsedSegmentText(command, segments) {
	let remaining = command;
	for (const segment of segments) {
		const raw = (segment.raw ?? segment.argv?.join(" "))?.trim();
		if (!raw) continue;
		remaining = remaining.replace(raw, " ");
	}
	return remaining;
}
function commandRequiresSecurityAuditSuppressionApproval(params) {
	let sawSegmentMention = false;
	for (const segment of params.segments) {
		if (!textMentionsSecurityAuditSuppressions(`${segment.raw ?? ""} ${segment.argv.join(" ")}`)) continue;
		sawSegmentMention = true;
		if (!isReadOnlySecurityAuditSuppressionInspection(segment.argv)) return true;
	}
	if (sawSegmentMention) {
		if (textMentionsSecurityAuditSuppressions(removeParsedSegmentText(params.command, params.segments))) return true;
		return false;
	}
	return textMentionsSecurityAuditSuppressions(params.command);
}
function minSecurity(a, b) {
	const order = {
		deny: 0,
		allowlist: 1,
		full: 2
	};
	return order[a] <= order[b] ? a : b;
}
function maxAsk(a, b) {
	const order = {
		off: 0,
		"on-miss": 1,
		always: 2
	};
	return order[a] >= order[b] ? a : b;
}
const DEFAULT_EXEC_APPROVAL_DECISIONS = [
	"allow-once",
	"allow-always",
	"deny"
];
const OPTIONAL_EXEC_APPROVAL_DECISIONS = ["allow-always"];
const OPTIONAL_EXEC_APPROVAL_DECISION_SET = new Set(OPTIONAL_EXEC_APPROVAL_DECISIONS);
function isOptionalExecApprovalDecision(decision) {
	return OPTIONAL_EXEC_APPROVAL_DECISION_SET.has(decision);
}
function collectExecApprovalUnavailableDecisionSet(decisions) {
	const unavailable = /* @__PURE__ */ new Set();
	if (!Array.isArray(decisions)) return unavailable;
	for (const decision of decisions) if (isOptionalExecApprovalDecision(decision)) unavailable.add(decision);
	return unavailable;
}
function normalizeExecApprovalUnavailableDecisions(decisions) {
	const unavailable = collectExecApprovalUnavailableDecisionSet(decisions);
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => unavailable.has(decision));
}
function resolveExecApprovalAllowedDecisions(params) {
	if (normalizeExecAsk(params?.ask) === "always" || params?.allowAlwaysPersistence?.kind === "one-shot") return ["allow-once", "deny"];
	return DEFAULT_EXEC_APPROVAL_DECISIONS;
}
function resolveExecApprovalUnavailableDecisions(params) {
	const allowed = new Set(resolveExecApprovalAllowedDecisions(params));
	return OPTIONAL_EXEC_APPROVAL_DECISIONS.filter((decision) => !allowed.has(decision));
}
function resolveExecApprovalRequestAllowedDecisions(params) {
	const policyDecisions = resolveExecApprovalAllowedDecisions({ ask: params?.ask });
	const unavailableDecisions = collectExecApprovalUnavailableDecisionSet(params?.unavailableDecisions);
	if (unavailableDecisions.size === 0) return policyDecisions;
	return policyDecisions.filter((decision) => !isOptionalExecApprovalDecision(decision) || !unavailableDecisions.has(decision));
}
//#endregion
//#region src/infra/exec-approval-policy-snapshot.ts
const utf8Encoder = new TextEncoder();
function compareUtf8(left, right) {
	const leftBytes = utf8Encoder.encode(left);
	const rightBytes = utf8Encoder.encode(right);
	const sharedLength = Math.min(leftBytes.length, rightBytes.length);
	for (let index = 0; index < sharedLength; index += 1) {
		const difference = (leftBytes[index] ?? 0) - (rightBytes[index] ?? 0);
		if (difference !== 0) return difference;
	}
	return leftBytes.length - rightBytes.length;
}
function compareOptionalUtf8(left, right) {
	if (left === void 0) return right === void 0 ? 0 : -1;
	if (right === void 0) return 1;
	return compareUtf8(left, right);
}
/** Cross-runtime order: tuple fields, absent before present, UTF-8 byte lexicographic. */
function compareExecApprovalPolicyRules(left, right) {
	return compareUtf8(left.pattern, right.pattern) || compareOptionalUtf8(left.argPattern, right.argPattern) || compareOptionalUtf8(left.source, right.source);
}
function buildExecApprovalPolicyRuleKey$1(rule) {
	return JSON.stringify([
		rule.pattern,
		rule.argPattern ?? null,
		rule.source ?? null
	]);
}
function canonicalizeExecApprovalPolicyRules(rules) {
	return [...new Map(rules.map((rule) => [buildExecApprovalPolicyRuleKey$1(rule), rule])).values()].toSorted(compareExecApprovalPolicyRules);
}
function normalizeExecApprovalPolicySnapshot(value) {
	if (value === void 0) return;
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const candidate = value;
	const security = candidate.security;
	const ask = candidate.ask;
	const askFallback = candidate.askFallback;
	const autoAllowSkills = candidate.autoAllowSkills;
	const allowlistRules = candidate.allowlistRules;
	if (security !== "deny" && security !== "allowlist" && security !== "full" || ask !== "off" && ask !== "on-miss" && ask !== "always" || askFallback !== "deny" && askFallback !== "allowlist" && askFallback !== "full" || typeof autoAllowSkills !== "boolean" || !Array.isArray(allowlistRules)) return null;
	const normalizedRules = [];
	for (const rawRule of allowlistRules) {
		if (!rawRule || typeof rawRule !== "object" || Array.isArray(rawRule)) return null;
		const rule = rawRule;
		if (typeof rule.pattern !== "string" || rule.argPattern !== void 0 && typeof rule.argPattern !== "string" || rule.source !== void 0 && rule.source !== "allow-always") return null;
		normalizedRules.push({
			pattern: rule.pattern,
			...typeof rule.argPattern === "string" ? { argPattern: rule.argPattern } : {},
			...rule.source === "allow-always" ? { source: rule.source } : {}
		});
	}
	return {
		security,
		ask,
		askFallback,
		autoAllowSkills,
		allowlistRules: canonicalizeExecApprovalPolicyRules(normalizedRules)
	};
}
//#endregion
//#region src/infra/exec-approvals-allow-always.ts
function hasDurableExecApproval(params) {
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) || hasSegmentDurableExecApproval({
		analysisOk: params.analysisOk,
		segmentAllowlistEntries: params.segmentAllowlistEntries
	});
}
function buildDurableCommandApprovalPattern(commandText) {
	return `=command:${sha256HexPrefixCore(commandText, 16)}`;
}
function buildNodeCommandApprovalPattern(commandText) {
	return `=node-command:${sha256HexPrefixCore(commandText, 16)}`;
}
function hasNodeCommandAllowAlwaysMarker(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildNodeCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && entry.pattern === commandPattern);
}
function hasExactCommandDurableExecApproval(params) {
	const normalizedCommand = params.commandText?.trim();
	if (!normalizedCommand) return false;
	const commandPattern = buildDurableCommandApprovalPattern(normalizedCommand);
	return (params.allowlist ?? []).some((entry) => entry.source === "allow-always" && (entry.pattern === commandPattern || typeof entry.commandText === "string" && entry.commandText.trim() === normalizedCommand));
}
/** Callers pass whether their final, post-gate authorization depends on a durable grant. */
function resolveDurableExecApprovalRequirement(params) {
	if (!params.durableApprovalRequired) return null;
	return hasExactCommandDurableExecApproval({
		allowlist: params.allowlist,
		commandText: params.commandText
	}) ? "exact-command" : "segment-allowlist";
}
function hasSegmentDurableExecApproval(params) {
	return params.analysisOk && params.segmentAllowlistEntries.length > 0 && params.segmentAllowlistEntries.every((entry) => entry?.source === "allow-always");
}
function buildAllowlistEntryMatchKey(entry) {
	return JSON.stringify([entry.pattern, entry.argPattern ?? null]);
}
function buildExecApprovalPolicyRuleKey(entry) {
	return JSON.stringify([
		entry.pattern,
		entry.argPattern ?? null,
		entry.source ?? null
	]);
}
function buildAllowAlwaysUpgradeRuleKey(rule) {
	if (rule.source !== void 0) return null;
	return buildExecApprovalPolicyRuleKey({
		...rule,
		source: "allow-always"
	});
}
/** Captures effective file policy while excluding ids and mutable usage metadata. */
function createExecApprovalPolicySnapshot(params) {
	const resolved = resolveExecApprovalsFromFileInternal({
		file: params.file,
		agentId: params.agentId
	});
	const allowlistRulesByKey = new Map(resolved.allowlist.map((entry) => {
		const rule = {
			pattern: entry.pattern,
			...entry.argPattern !== void 0 ? { argPattern: entry.argPattern } : {},
			...entry.source === "allow-always" ? { source: entry.source } : {}
		};
		return [buildExecApprovalPolicyRuleKey(rule), rule];
	}));
	return {
		security: resolved.agent.security,
		ask: resolved.agent.ask,
		askFallback: resolved.agent.askFallback,
		autoAllowSkills: resolved.agent.autoAllowSkills,
		allowlistRules: canonicalizeExecApprovalPolicyRules([...allowlistRulesByKey.values()])
	};
}
function isExecApprovalPolicySnapshotCurrent(expected, current) {
	const currentRuleKeys = new Set(current.allowlistRules.map(buildExecApprovalPolicyRuleKey));
	return expected.security === current.security && expected.ask === current.ask && expected.askFallback === current.askFallback && expected.autoAllowSkills === current.autoAllowSkills && expected.allowlistRules.every((rule) => {
		const key = buildExecApprovalPolicyRuleKey(rule);
		if (currentRuleKeys.has(key)) return true;
		const upgradedKey = buildAllowAlwaysUpgradeRuleKey(rule);
		return upgradedKey !== null && currentRuleKeys.has(upgradedKey);
	});
}
function resolveAllowAlwaysPatternCoverage(params) {
	const byKey = /* @__PURE__ */ new Map();
	let representedSegmentCount = 0;
	for (const segment of params.segments) {
		if (isShellWrapperInvocation(segment.argv)) {
			const segmentPatterns = resolveAllowAlwaysPatternEntries({
				segments: [segment],
				cwd: params.cwd,
				env: params.env,
				platform: params.platform,
				strictInlineEval: params.strictInlineEval
			});
			for (const pattern of segmentPatterns) byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
			continue;
		}
		const segmentPatterns = resolveAllowAlwaysPatternEntries({
			segments: [segment],
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (segmentPatterns.length === 0) continue;
		representedSegmentCount += 1;
		for (const pattern of segmentPatterns) byKey.set(`${pattern.pattern}\x00${pattern.argPattern ?? ""}`, pattern);
	}
	return {
		complete: params.segments.length > 0 && representedSegmentCount === params.segments.length,
		patterns: [...byKey.values()]
	};
}
function hasRuntimeShellPayload(argv) {
	const inlineCommand = extractBindableShellWrapperInlineCommand([...argv]);
	return Boolean(inlineCommand && (/(?:\$[A-Za-z0-9_@*?#$!-]|\$\{|`|\$\()/u.test(inlineCommand) || hasPosixInteractiveStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS) || hasPosixLoginStartupBeforeInlineCommand(argv, POSIX_INLINE_COMMAND_FLAGS)));
}
function resolvePlanPersistenceState(plan) {
	if (!plan) return {
		reusablePatternsAllowed: true,
		reasons: []
	};
	if (!plan.ok) return {
		reusablePatternsAllowed: false,
		reasons: ["unplanned"]
	};
	const reasons = /* @__PURE__ */ new Set();
	let reusablePatternsAllowed = true;
	const candidates = plan.groups.flatMap((group) => group.candidates);
	for (const candidate of candidates) {
		if (candidate.trustMode === "prompt-only") reasons.add("prompt-only");
		if (candidate.trustMode === "exact-command") reasons.add("no-reusable-pattern");
		if (candidate.trustMode === "executable" && !candidate.allowAlways) reasons.add("no-reusable-pattern");
		reusablePatternsAllowed = reusablePatternsAllowed && candidate.allowAlways;
		if (hasRuntimeShellPayload(candidate.sourceSegment.argv)) reasons.add("runtime-payload");
		if (candidate.transport.kind === "shell-wrapper" && hasRuntimeShellPayload(candidate.transport.wrapperArgv)) reasons.add("runtime-payload");
	}
	return {
		reusablePatternsAllowed,
		reasons: [...reasons]
	};
}
function resolveAllowAlwaysPersistenceDecision(params) {
	const planPersistence = resolvePlanPersistenceState(params.authorizationPlan);
	const reasons = new Set(planPersistence.reasons);
	if (params.runtimePayload === true) reasons.add("runtime-payload");
	const commandText = params.commandText?.trim();
	const hardReasons = [...reasons].filter((reason) => reason !== "no-reusable-pattern");
	if (hardReasons.length > 0) return {
		kind: "one-shot",
		reasons: hardReasons
	};
	if (params.preparedCoverage?.complete === true && params.preparedCoverage.patterns.length > 0) return {
		kind: "patterns",
		patterns: params.preparedCoverage.patterns,
		...commandText ? { commandText } : {}
	};
	if (planPersistence.reusablePatternsAllowed) {
		const coverage = resolveAllowAlwaysPatternCoverage({
			segments: params.segments,
			cwd: params.cwd,
			env: params.env,
			platform: params.platform,
			strictInlineEval: params.strictInlineEval
		});
		if (coverage.patterns.length > 0) return {
			kind: "patterns",
			patterns: coverage.patterns,
			...commandText && coverage.complete ? { commandText } : {}
		};
	}
	reasons.add("no-reusable-pattern");
	return {
		kind: "one-shot",
		reasons: [...reasons]
	};
}
//#endregion
//#region src/infra/exec-approvals-authorization.kernel.ts
function assertCurrentUsageAuthorization(params) {
	const current = resolveExecApprovalsFromFileInternal({
		file: params.file,
		agentId: params.agentId,
		overrides: {
			security: params.authorization.security,
			ask: params.authorization.ask
		}
	});
	const security = params.authorization.bypassHostApprovalFloors ? params.authorization.security : minSecurity(params.authorization.security, current.agent.security);
	const ask = params.authorization.bypassHostApprovalFloors ? params.authorization.ask : maxAsk(params.authorization.ask, current.agent.ask);
	if (security === "deny") throw new Error("Exec approval changed before execution");
	if (params.authorization.source === "explicit-approval" || params.authorization.source === "auto-review") {
		const expectedPolicy = params.authorization.policySnapshot;
		if (!expectedPolicy || !isExecApprovalPolicySnapshotCurrent(expectedPolicy, createExecApprovalPolicySnapshot({
			file: params.file,
			agentId: params.agentId
		}))) throw new Error("Exec approval changed before execution");
	}
	if (params.authorization.source === "explicit-approval") return;
	if (params.authorization.source === "auto-review") {
		if (ask === "always") throw new Error("Exec approval changed before execution");
		return;
	}
	let authorizationSecurity = security;
	if (params.authorization.source === "ask-fallback") {
		const askFallback = minSecurity(security, current.agent.askFallback);
		if (askFallback === "deny" || askFallback !== params.authorization.security) throw new Error("Exec approval changed before execution");
		if (askFallback === "full") return;
		authorizationSecurity = askFallback;
	} else if (security !== params.authorization.security || ask !== params.authorization.ask) throw new Error("Exec approval changed before execution");
	if (authorizationSecurity !== "allowlist") return;
	if (params.authorization.requireExactCommandApproval) {
		if (!hasExactCommandDurableExecApproval({
			allowlist: current.allowlist,
			commandText: params.command
		})) throw new Error("Exec approval changed before execution");
		return;
	}
	if (params.authorization.requireDurableAllowlistApproval) {
		const durableKeys = new Set(current.allowlist.filter((entry) => entry.source === "allow-always").map(buildAllowlistEntryMatchKey));
		if (params.matchKeys.size === 0 || [...params.matchKeys].some((key) => !durableKeys.has(key))) throw new Error("Exec approval changed before execution");
	}
	if (!params.authorization.allowlistSatisfied) throw new Error("Exec approval changed before execution");
	const currentKeys = new Set(current.allowlist.map(buildAllowlistEntryMatchKey));
	if ([...params.matchKeys].some((key) => !currentKeys.has(key))) throw new Error("Exec approval changed before execution");
	if (params.authorization.requireAutoAllowSkills && !current.agent.autoAllowSkills) throw new Error("Exec approval changed before execution");
}
function applyRecordedAllowlistUse(params) {
	const keys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	if (params.authorization) assertCurrentUsageAuthorization({
		file: params.file,
		agentId: params.agentId,
		command: params.command,
		matchKeys: keys,
		authorization: params.authorization
	});
	return applyRecordedAllowlistMetadata(params);
}
function applyRecordedAllowlistMetadata(params) {
	const keys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	if (keys.size === 0) return null;
	if (!params.agentId) throw new Error("Exec allowlist metadata update requires an explicit agent id.");
	const target = params.agentId;
	const agents = params.file.agents ?? {};
	let changed = false;
	const nextAgents = { ...agents };
	for (const key of target === "*" ? [target] : ["*", target]) {
		const existing = agents[key];
		if (!existing?.allowlist) continue;
		let entryChanged = false;
		const nextAllowlist = existing.allowlist.map((entry) => {
			if (!keys.has(buildAllowlistEntryMatchKey(entry))) return entry;
			changed = true;
			entryChanged = true;
			return Object.assign({}, entry, {
				id: entry.id ?? crypto.randomUUID(),
				lastUsedAt: Date.now(),
				lastUsedCommand: isGeneratedHashedArgPattern(entry.argPattern) ? void 0 : params.command,
				lastResolvedPath: params.resolvedPath
			});
		});
		if (entryChanged) nextAgents[key] = {
			...existing,
			allowlist: nextAllowlist
		};
	}
	return changed ? {
		...params.file,
		agents: nextAgents
	} : null;
}
//#endregion
//#region src/infra/exec-approvals-authorization.ts
function recordAllowlistMatchesUse(params) {
	if (params.matches.length === 0 && !params.authorization) return;
	const snapshot = updateExecApprovalsSync({ update: (file) => applyRecordedAllowlistUse({
		...params,
		file
	}) });
	if (snapshot) replaceExecApprovalsSnapshot(params.approvals, snapshot.file);
}
async function commitExecAuthorizationLocked(input) {
	const params = structuredClone(input);
	const { snapshot, readCurrent } = await commitExecAuthorizations(params);
	const matchKeys = new Set(params.matches.filter((entry) => entry.pattern).map(buildAllowlistEntryMatchKey));
	const authorization = {
		...params.authorization,
		policySnapshot: createExecApprovalPolicySnapshot({
			file: snapshot.file,
			agentId: params.agentId
		})
	};
	return () => assertCurrentUsageAuthorization({
		file: readCurrent(),
		agentId: params.agentId,
		command: params.command,
		matchKeys,
		authorization
	});
}
//#endregion
//#region src/infra/jsonl-socket.ts
const JSONL_SOCKET_MAX_LINE_BYTES = 16777216;
/**
* Sends one JSONL request line, half-closes the write side, and waits for an accepted response line.
*/
async function requestJsonlSocket(params) {
	const { socketPath, requestLine, accept, signal } = params;
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	return await new Promise((resolve) => {
		const client = new net.Socket();
		let settled = false;
		const lineChunks = [];
		let lineBytes = 0;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			abortListener?.[Symbol.dispose]();
			client.destroy();
			resolve(value);
		};
		const appendLineChunk = (chunk) => {
			if (lineBytes + chunk.byteLength > JSONL_SOCKET_MAX_LINE_BYTES) {
				finish(null);
				return false;
			}
			if (chunk.byteLength > 0) {
				lineChunks.push(chunk);
				lineBytes += chunk.byteLength;
			}
			return true;
		};
		const timer = setTimeout(() => finish(null), timeoutMs);
		const abortListener = signal ? addAbortListener(signal, () => finish(null)) : void 0;
		if (signal?.aborted) {
			finish(null);
			return;
		}
		client.on("error", () => finish(null));
		client.on("end", () => finish(null));
		client.on("close", () => finish(null));
		client.connect(socketPath, () => {
			if (!settled) client.end(`${requestLine}\n`);
		});
		client.on("data", (data) => {
			let offset = 0;
			while (offset < data.byteLength) {
				const newlineIndex = data.indexOf(10, offset);
				if (newlineIndex === -1) {
					appendLineChunk(data.subarray(offset));
					return;
				}
				if (!appendLineChunk(data.subarray(offset, newlineIndex))) return;
				const line = (lineChunks.length > 1 ? Buffer.concat(lineChunks, lineBytes) : lineChunks[0])?.toString("utf8").trim() ?? "";
				lineChunks.length = 0;
				lineBytes = 0;
				offset = newlineIndex + 1;
				if (!line) continue;
				try {
					const msg = JSON.parse(line);
					const result = accept(msg);
					if (result === void 0) continue;
					finish(result);
					return;
				} catch {}
			}
		});
	});
}
//#endregion
//#region src/infra/exec-approvals.ts
function redactExecApprovals(snapshot) {
	const { raw: _raw, ...rest } = snapshot;
	const socketPath = snapshot.file.socket?.path?.trim();
	return {
		...rest,
		file: {
			...snapshot.file,
			socket: socketPath ? { path: socketPath } : void 0
		}
	};
}
function normalizeExecApprovals(file) {
	const socketPath = file.socket?.path?.trim();
	const token = file.socket?.token?.trim();
	return normalizeExecApprovalsInternal({
		...file,
		socket: {
			path: socketPath,
			token
		}
	});
}
function shapeResolvedExecApprovals(params) {
	const defaultSocketPath = resolveExecApprovalsSocketPath();
	return resolveExecApprovalsFromFile({
		file: params.file,
		agentId: params.agentId,
		overrides: params.overrides,
		path: params.filePath,
		socketPath: params.socket === "persisted" ? expandHomePrefix(params.file.socket?.path ?? defaultSocketPath) : defaultSocketPath,
		token: params.socket === "persisted" ? params.file.socket?.token ?? "" : ""
	});
}
function resolveExecApprovalsWithoutSocket(params) {
	const resolved = shapeResolvedExecApprovals({
		...params,
		socket: "none"
	});
	return (resolved.agent.security === "full" || resolved.agent.security === "deny") && resolved.agent.ask === "off" && !params.file.socket?.token?.trim() ? resolved : null;
}
async function resolveExecApprovalsLocked(agentId, overrides) {
	const filePath = resolveExecApprovalsDisplayPath();
	if (!overrides?.requireSocket) {
		const resolved = resolveExecApprovalsWithoutSocket({
			file: loadExecApprovals(),
			filePath,
			agentId,
			overrides
		});
		if (resolved) return resolved;
	}
	return shapeResolvedExecApprovals({
		file: (await ensureExecApprovalsSnapshot()).file,
		filePath: resolveExecApprovalsDisplayPath(),
		agentId,
		overrides,
		socket: "persisted"
	});
}
function resolveExecApprovalsFromFile(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovals(params.file);
	return resolveExecApprovalsFromFilePrepared({
		...params,
		rawFile,
		file,
		token: params.token ?? file.socket?.token ?? ""
	});
}
//#endregion
export { requiresExecApproval as C, resolveExecApprovalUnavailableDecisions as E, normalizeExecApprovalUnavailableDecisions as S, resolveExecApprovalRequestAllowedDecisions as T, DEFAULT_EXEC_APPROVAL_DECISIONS as _, requestJsonlSocket as a, maxAsk as b, createExecApprovalPolicySnapshot as c, hasNodeCommandAllowAlwaysMarker as d, isExecApprovalPolicySnapshotCurrent as f, normalizeExecApprovalPolicySnapshot as g, resolveDurableExecApprovalRequirement as h, resolveExecApprovalsLocked as i, hasDurableExecApproval as l, resolveAllowAlwaysPersistenceDecision as m, redactExecApprovals as n, commitExecAuthorizationLocked as o, resolveAllowAlwaysPatternCoverage as p, resolveExecApprovalsFromFile as r, recordAllowlistMatchesUse as s, normalizeExecApprovals as t, hasExactCommandDurableExecApproval as u, OPTIONAL_EXEC_APPROVAL_DECISIONS as v, resolveExecApprovalAllowedDecisions as w, minSecurity as x, commandRequiresSecurityAuditSuppressionApproval as y };
