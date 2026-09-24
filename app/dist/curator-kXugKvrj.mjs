import { t as AsyncWorkScope } from "./async-work-scope-B8vgCYcj.mjs";
import "./agent-scope-config-Dm8T0OhW.mjs";
import { i as listAgentIds } from "./agent-roster-Cl9s4QHb.mjs";
import { _ as onTrustedInternalDiagnosticEvent } from "./diagnostic-events-C4sEV9aC.mjs";
import { t as createSubsystemLogger } from "./subsystem-Bmu9GF-b.mjs";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context--d08nNom.mjs";
import { t as canonicalizePath } from "./paths-CIwQeLl6.mjs";
import { a as normalizeSkillIndexName } from "./skill-index-Bh90u5mi.mjs";
import { r as parseSkillProposalRow } from "./store-sqlite-record-vZ3w0rgm.mjs";
import { t as listWritableWorkshopSkillSummaries } from "./workspace-skill-read-CQHIj543.mjs";
import path from "node:path";
//#region src/skills/workshop/curator.ts
const log = createSubsystemLogger("skills/curator");
const SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE = "Skill lifecycle curation is retired. The weekly collection review manages the skill collection; pin, unpin, and restore no longer exist.";
function canonicalSkillKey(name) {
	const key = normalizeSkillIndexName(name);
	if (!key) throw new Error(`Invalid skill name: ${name}`);
	return key;
}
async function getSkillCuratorStatus(options) {
	const context = captureAssistantStateWorkerContext(options);
	const curatedByFile = /* @__PURE__ */ new Map();
	for (const agentId of listAgentIds(options.config)) for (const skill of listWritableWorkshopSkillSummaries({
		config: options.config,
		agentId,
		env: options.env
	})) {
		const skillFile = canonicalizePath(skill.filePath);
		curatedByFile.set(skillFile, skill);
	}
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-Cbw9_4QI.mjs");
	const { proposalRows, usageRows, reviewStatus } = await executeAssistantStateWorker(context, {
		type: "skills.curator.read",
		input: { skillFiles: [...curatedByFile.keys()] }
	});
	const createdAtByFile = /* @__PURE__ */ new Map();
	for (const row of proposalRows) {
		const record = parseSkillProposalRow(row);
		if (!record || !record.appliedAt) continue;
		const appliedAtMs = Date.parse(record.appliedAt);
		const skillFile = canonicalizePath(record.target.skillFile);
		if (!Number.isFinite(appliedAtMs)) continue;
		createdAtByFile.set(skillFile, Math.min(createdAtByFile.get(skillFile) ?? appliedAtMs, appliedAtMs));
	}
	const usageByFile = new Map(usageRows.map((row) => [row.skill_file, row]));
	const skills = [...curatedByFile.entries()].toSorted(([left], [right]) => left.localeCompare(right)).map(([skillFile, skill]) => {
		const usage = usageByFile.get(skillFile);
		return {
			skillFile,
			skillKey: skill.skillKey,
			skillName: skill.name,
			createdAtMs: createdAtByFile.get(skillFile) ?? null,
			state: "active",
			pinned: false,
			stateChangedAtMs: createdAtByFile.get(skillFile) ?? null,
			lastUsedAtMs: usage?.last_used_at_ms ?? null,
			useCount: usage?.use_count ?? 0,
			archivedReason: null
		};
	});
	return {
		inventory: "live-workshop",
		lastAttemptAtMs: reviewStatus.lastAttemptAtMs,
		lastSuccessAtMs: reviewStatus.lastSuccessAtMs,
		lastError: reviewStatus.lastError,
		collectionReview: reviewStatus.collectionReviews,
		experienceReview: reviewStatus.experienceReviews,
		counts: {
			active: skills.length,
			stale: 0,
			archived: 0
		},
		skills,
		overlaps: []
	};
}
async function recordSkillUsage(event, context) {
	const rawSkillFile = event.skillFile?.trim();
	if (!rawSkillFile || !path.isAbsolute(rawSkillFile)) {
		log.debug(`skipping skill usage without file identity: ${event.skillName}`);
		return;
	}
	const skillFile = canonicalizePath(path.resolve(rawSkillFile));
	const skillKey = canonicalSkillKey(event.skillName);
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-Cbw9_4QI.mjs");
	await executeAssistantStateWorker(context, {
		type: "skills.usage.record",
		input: {
			...event,
			skillFile,
			skillKey
		}
	});
}
/** Listener failures must never propagate into the tool execution that emitted usage. */
function registerSkillUsageTracking(options = {}) {
	const context = captureAssistantStateWorkerContext(options);
	const work = new AsyncWorkScope();
	let closing;
	const unregister = onTrustedInternalDiagnosticEvent((event, metadata, privateData) => {
		if (closing || !metadata.trusted || event.type !== "skill.used") return;
		work.track(async () => {
			try {
				await recordSkillUsage({
					...event,
					skillFile: privateData.skillUsage?.skillFile
				}, context);
			} catch (error) {
				log.warn(`failed to record skill usage: ${String(error)}`);
			}
		});
	}, { include: ["skill.used"] });
	return () => {
		unregister();
		return closing ??= AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain());
	};
}
//#endregion
export { getSkillCuratorStatus as n, registerSkillUsageTracking as r, SKILL_LIFECYCLE_CURATION_RETIRED_MESSAGE as t };
