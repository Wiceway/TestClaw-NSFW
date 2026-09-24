import { n as sha256Hex } from "./node-crypto-p3a5nOcB.js";
import { i as sha256File } from "./crypto-digest-BPwjfEnk.js";
import { r as resolveSafeInstallDir } from "./install-safe-path-BblY42U-.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/lifecycle/install-paths.ts
const VALID_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
function hasNonAscii(value) {
	for (const char of value) if (char.charCodeAt(0) > 127) return true;
	return false;
}
/** Normalizes a tracked slug without accepting traversal or path separators. */
function normalizeTrackedSkillSlug(raw) {
	const slug = raw.trim();
	if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes("..")) throw new Error(`Invalid skill slug: ${raw}`);
	return slug;
}
function validateRequestedSkillSlug(raw) {
	const slug = normalizeTrackedSkillSlug(raw);
	if (hasNonAscii(slug) || !VALID_SLUG_PATTERN.test(slug)) throw new Error(`Invalid skill slug: ${raw}`);
	return slug;
}
function resolveWorkspaceSkillInstallDir(workspaceDir, slug) {
	const skillsDir = path.join(path.resolve(workspaceDir), "skills");
	const target = resolveSafeInstallDir({
		baseDir: skillsDir,
		id: slug,
		invalidNameMessage: "invalid skill target path"
	});
	if (!target.ok) throw new Error(target.error);
	return target.path;
}
//#endregion
//#region src/skills/lifecycle/skill-tree-digest.ts
const EXCLUDED_METADATA_DIRS = /* @__PURE__ */ new Set([".clawhub", ".clawdhub"]);
async function collectEntries(root, relativeDir = "") {
	const absoluteDir = path.join(root, relativeDir);
	const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
	const collected = [];
	for (const entry of entries.toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0)) {
		if (!relativeDir && EXCLUDED_METADATA_DIRS.has(entry.name)) continue;
		const relativePath = path.join(relativeDir, entry.name);
		const portablePath = relativePath.split(path.sep).join("/");
		const stat = await fs.lstat(path.join(root, relativePath));
		if (stat.isSymbolicLink() || !stat.isDirectory() && !stat.isFile()) throw new Error(`Skill tree contains unsupported entry ${JSON.stringify(portablePath)}.`);
		if (stat.isDirectory()) {
			collected.push({
				path: portablePath,
				type: "directory"
			});
			collected.push(...await collectEntries(root, relativePath));
			continue;
		}
		if (stat.nlink > 1) throw new Error(`Skill tree contains hard-linked file ${JSON.stringify(portablePath)}.`);
		const end = stat.size > 0 ? stat.size - 1 : void 0;
		collected.push({
			path: portablePath,
			type: "file",
			sha256: await sha256File(path.join(root, relativePath), end)
		});
	}
	return collected;
}
/** Digests every installed skill file except Assistant's own provenance metadata. */
async function digestClawHubSkillTree(skillDir) {
	const entries = await collectEntries(skillDir);
	return `sha256:${sha256Hex(JSON.stringify(entries))}`;
}
async function checkClawHubSkillPlanAtPath(plan, skillDir, readFile = fs.readFile) {
	try {
		const stat = await fs.lstat(skillDir);
		if (!stat.isDirectory() || stat.isSymbolicLink()) return {
			ok: false,
			error: `Skill ${JSON.stringify(plan.slug)} changed during update.`
		};
		const content = await readFile(path.join(skillDir, plan.skillFilePath));
		if (sha256Hex(content) !== plan.skillFileSha256 || await digestClawHubSkillTree(skillDir) !== plan.fileTreeSha256) return {
			ok: false,
			error: `Skill ${JSON.stringify(plan.slug)} changed during update.`
		};
		return { ok: true };
	} catch (error) {
		return {
			ok: false,
			error: String(error)
		};
	}
}
//#endregion
export { validateRequestedSkillSlug as a, resolveWorkspaceSkillInstallDir as i, digestClawHubSkillTree as n, normalizeTrackedSkillSlug as r, checkClawHubSkillPlanAtPath as t };
