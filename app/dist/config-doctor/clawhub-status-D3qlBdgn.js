import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { T as statRegularFile, d as pathExists } from "./fs-safe-CZ3jhUUr.js";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-DtmggasY.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as sha256Hex } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { r as replaceFileAtomicSync } from "./replace-file-GThucKH8.js";
import { d as writeJson, i as readJson, l as tryReadJson, o as readJsonIfExists, t as JsonFileReadError } from "./json-files-DAp75qfY.js";
import { r as getAgentWorkspaceAccess, t as WorkspaceAccessUnavailableError } from "./workspace-access-B2mkdxzZ.js";
import { _ as resolveClawHubBaseUrl } from "./clawhub-client-B_Cd834b.js";
import { r as CLAWHUB_SKILLS_SH_TRUST_STATE, t as CLAWHUB_SKILLS_SH_REF_PREFIX, u as searchClawHubSkills } from "./clawhub-skills-8MWyro0j.js";
import { a as validateRequestedSkillSlug, i as resolveWorkspaceSkillInstallDir, n as digestClawHubSkillTree, r as normalizeTrackedSkillSlug } from "./skill-tree-digest-BU-L5_Lq.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/skills/lifecycle/clawhub-store.ts
const DOT_DIR = ".clawhub";
const LEGACY_DOT_DIR = ".clawdhub";
const CLAWHUB_OWNER_HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9._-]{0,38}[a-z0-9])?$/;
const GITHUB_OWNER_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const GITHUB_REPO_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;
function metadataPaths(rootDir, filename) {
	return [path.join(rootDir, DOT_DIR, filename), path.join(rootDir, LEGACY_DOT_DIR, filename)];
}
function normalizeClawHubOwnerHandle(raw) {
	const ownerHandle = raw.trim().toLowerCase();
	if (!CLAWHUB_OWNER_HANDLE_PATTERN.test(ownerHandle)) throw new Error(`Invalid ClawHub owner handle: ${raw}`);
	return ownerHandle;
}
function parseRequestedClawHubSkillRef(raw) {
	const value = raw.trim();
	if (value.startsWith("skills-sh/")) throw new Error(`Invalid skills.sh skill reference: ${raw}`);
	if (value.startsWith("skills-sh:")) {
		const parts = value.slice(CLAWHUB_SKILLS_SH_REF_PREFIX.length).split("/");
		if (parts.length !== 3) throw new Error(`Invalid skills.sh skill reference: ${raw}`);
		const [owner, repo, slug] = parts;
		if (!owner || !repo || !slug || !GITHUB_OWNER_PATTERN.test(owner) || !GITHUB_REPO_PATTERN.test(repo) || repo === "." || repo === "..") throw new Error(`Invalid skills.sh skill reference: ${raw}`);
		return {
			slug: validateRequestedSkillSlug(slug),
			requestedReference: value,
			trustState: CLAWHUB_SKILLS_SH_TRUST_STATE
		};
	}
	if (!value.startsWith("@")) return { slug: validateRequestedSkillSlug(value) };
	const parts = value.slice(1).split("/");
	if (parts.length !== 2) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
	const [owner, slug] = parts;
	if (!owner || !slug) throw new Error(`Invalid ClawHub skill reference: ${raw}`);
	return {
		ownerHandle: normalizeClawHubOwnerHandle(owner),
		slug: validateRequestedSkillSlug(slug)
	};
}
function formatClawHubSkillRef(ref) {
	return ref.ownerHandle ? `@${ref.ownerHandle}/${ref.slug}` : ref.slug;
}
function normalizeStoredRegistry(registry) {
	const trimmed = registry.trim();
	return trimmed.replace(/\/+$/, "") || trimmed;
}
function normalizeGitHubCommitSegment(raw) {
	const commit = normalizeOptionalString(raw);
	return commit && /^[0-9a-f]{40}$/i.test(commit) ? commit : void 0;
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
function normalizeDownloadedArtifactLock(raw) {
	if (!raw || typeof raw !== "object") return;
	const candidate = raw;
	if ((candidate.kind === "archive" || candidate.kind === "clawpack") && isNonEmptyString(candidate.sha256) && isNonEmptyString(candidate.integrity)) return {
		kind: candidate.kind,
		sha256: candidate.sha256,
		integrity: candidate.integrity
	};
}
function normalizeSkillFileLock(raw) {
	if (!raw || typeof raw !== "object") return;
	const candidate = raw;
	return isNonEmptyString(candidate.path) && isNonEmptyString(candidate.sha256) ? {
		path: candidate.path,
		sha256: candidate.sha256
	} : void 0;
}
function normalizeClawHubSkillOrigin(raw) {
	if (raw?.version !== 1 || !isNonEmptyString(raw.registry) || !isNonEmptyString(raw.slug) || !isNonEmptyString(raw.installedVersion) || typeof raw.installedAt !== "number") return null;
	const sourceUrl = normalizeOptionalString(raw.sourceUrl);
	const ownerHandleRaw = normalizeOptionalString(raw.ownerHandle);
	let ownerHandle;
	if (ownerHandleRaw) try {
		ownerHandle = normalizeClawHubOwnerHandle(ownerHandleRaw);
	} catch {
		return null;
	}
	const requestedReferenceRaw = normalizeOptionalString(raw.requestedReference);
	let requestedReference;
	let trustState;
	if (requestedReferenceRaw) try {
		const parsed = parseRequestedClawHubSkillRef(requestedReferenceRaw);
		if (!parsed.requestedReference || parsed.slug !== raw.slug) return null;
		requestedReference = parsed.requestedReference;
		if (normalizeOptionalString(raw.trustState) !== "not-scanned-by-clawhub") return null;
		trustState = CLAWHUB_SKILLS_SH_TRUST_STATE;
	} catch {
		return null;
	}
	else if (raw.trustState !== void 0) return null;
	const artifact = normalizeDownloadedArtifactLock(raw.artifact);
	const skillFile = normalizeSkillFileLock(raw.skillFile);
	const fileTreeSha256 = normalizeOptionalString(raw.fileTreeSha256);
	return {
		version: 1,
		registry: normalizeStoredRegistry(raw.registry),
		slug: raw.slug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		installedVersion: raw.installedVersion,
		installedAt: raw.installedAt,
		...sourceUrl ? { sourceUrl } : {},
		...artifact ? { artifact } : {},
		...skillFile ? { skillFile } : {},
		...fileTreeSha256 ? { fileTreeSha256 } : {}
	};
}
function parseClawHubSkillsLockfile(raw) {
	if (raw?.version !== 1 || !raw.skills || typeof raw.skills !== "object") throw new Error("expected version 1 lockfile with skills");
	return {
		version: 1,
		skills: raw.skills
	};
}
async function readClawHubSkillsLockfile(workspaceDir) {
	for (const candidate of metadataPaths(workspaceDir, "lock.json")) try {
		if ((await statRegularFile(candidate).catch(() => void 0))?.missing) continue;
		return parseClawHubSkillsLockfile(await readJson(candidate));
	} catch (err) {
		if (err instanceof JsonFileReadError && hasErrnoCode(err.cause, "ENOENT")) continue;
		throw new Error(`Malformed workspace ClawHub lockfile at ${candidate}: ${formatErrorMessage(err)}. Repair or restore it before retrying.`, { cause: err });
	}
	return {
		version: 1,
		skills: {}
	};
}
async function writeClawHubSkillsLockfile(workspaceDir, lockfile) {
	await writeJson(path.join(workspaceDir, DOT_DIR, "lock.json"), lockfile, { trailingNewline: true });
}
function readJsonIfExistsSync(candidate) {
	try {
		return {
			exists: true,
			value: JSON.parse(fs.readFileSync(candidate, "utf8"))
		};
	} catch (err) {
		if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") return { exists: false };
		throw err;
	}
}
function readClawHubSkillsLockfileStatusSync(workspaceDir) {
	for (const candidate of metadataPaths(workspaceDir, "lock.json")) try {
		const read = readJsonIfExistsSync(candidate);
		if (!read.exists) continue;
		return {
			kind: "found",
			path: candidate,
			lock: parseClawHubSkillsLockfile(read.value)
		};
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
function originResult(raw, candidate) {
	const origin = normalizeClawHubSkillOrigin(raw);
	return origin ? {
		kind: "found",
		origin,
		path: candidate
	} : {
		kind: "malformed",
		path: candidate,
		error: "expected version 1 origin with registry, slug, installedVersion, and installedAt"
	};
}
async function readClawHubSkillOrigin(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const origin = normalizeClawHubSkillOrigin(await tryReadJson(candidate));
		if (origin) return origin;
	} catch {}
	return null;
}
function readClawHubSkillOriginStatusSync(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const read = readJsonIfExistsSync(candidate);
		if (read.exists) return originResult(read.value, candidate);
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
async function readClawHubSkillOriginStrict(skillDir) {
	for (const candidate of metadataPaths(skillDir, "origin.json")) try {
		const raw = await readJsonIfExists(candidate);
		if (raw) return originResult(raw, candidate);
	} catch (err) {
		return {
			kind: "malformed",
			path: candidate,
			error: formatErrorMessage(err)
		};
	}
	return { kind: "missing" };
}
async function writeClawHubSkillOrigin(skillDir, origin) {
	await writeJson(path.join(skillDir, DOT_DIR, "origin.json"), origin, { trailingNewline: true });
}
async function readInstalledSkillFileLock(skillDir) {
	const { CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS } = await import("./archive-install-B5gAODlV.js");
	for (const marker of CLAWHUB_SKILL_ARCHIVE_ROOT_MARKERS) try {
		return {
			path: marker,
			sha256: sha256Hex(await fs$1.readFile(path.join(skillDir, marker)))
		};
	} catch {
		continue;
	}
}
/** Finalize native tracking beside the installed files, preserving other tracked skills. */
async function recordClawHubSkillInstall(params) {
	const { origin, verification } = params;
	await writeClawHubSkillOrigin(params.skillDir, origin);
	const lock = await readClawHubSkillsLockfile(params.workspaceDir);
	lock.skills[origin.slug] = {
		version: origin.installedVersion,
		registry: origin.registry,
		installedAt: origin.installedAt,
		...origin.ownerHandle ? { ownerHandle: origin.ownerHandle } : {},
		...origin.requestedReference ? { requestedReference: origin.requestedReference } : {},
		...origin.trustState ? { trustState: origin.trustState } : {},
		...origin.sourceUrl ? { sourceUrl: origin.sourceUrl } : {},
		...origin.artifact ? { artifact: origin.artifact } : {},
		...origin.skillFile ? { skillFile: origin.skillFile } : {},
		...origin.fileTreeSha256 ? { fileTreeSha256: origin.fileTreeSha256 } : {},
		...verification ? { verification } : {}
	};
	await writeClawHubSkillsLockfile(params.workspaceDir, lock);
}
async function readTrackedClawHubSkillSlugs(workspaceDir) {
	const workspaceAccess = getAgentWorkspaceAccess(workspaceDir, "loadSkills");
	const access = workspaceAccess?.loadSkills ? workspaceAccess : void 0;
	if (access && !access.clawHubSkills) throw new WorkspaceAccessUnavailableError("Remote workspace ClawHub tracking is unavailable");
	const lock = await (access?.clawHubSkills?.readClawHubSkillsLockfile ?? readClawHubSkillsLockfile)(workspaceDir);
	return Object.keys(lock.skills).toSorted();
}
async function untrackClawHubSkill(workspaceDir, slug, beforePersistentApply, beforeRollback = beforePersistentApply, authorizeMutation) {
	const trackedSlug = normalizeTrackedSkillSlug(slug);
	if (authorizeMutation) await authorizeMutation("apply");
	const lock = await readClawHubSkillsLockfile(workspaceDir);
	const previous = lock.skills[trackedSlug];
	if (!previous) return async () => void 0;
	const writeLock = (value, assertCurrent = beforePersistentApply) => {
		assertCurrent?.();
		return replaceFileAtomicSync({
			filePath: path.join(workspaceDir, DOT_DIR, "lock.json"),
			content: `${JSON.stringify(value, null, 2)}\n`,
			mode: 384,
			dirMode: 511 & ~process.umask(),
			copyFallbackOnPermissionError: true,
			syncTempFile: true,
			syncParentDir: true,
			beforeRename: assertCurrent
		});
	};
	delete lock.skills[trackedSlug];
	writeLock(lock);
	return async () => {
		if (authorizeMutation) await authorizeMutation("rollback");
		const current = await readClawHubSkillsLockfile(workspaceDir);
		if (current.skills[trackedSlug]) throw new Error(`Skill ${JSON.stringify(trackedSlug)} was retracked during rollback.`);
		current.skills[trackedSlug] = previous;
		writeLock(current, beforeRollback);
	};
}
/** Check the native target and tracking before acquiring an archive. */
async function assertClawHubSkillInstallState(params) {
	const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug);
	if (!params.force && await pathExists(targetDir)) throw new Error(`Skill already exists at ${targetDir}. Re-run with force/update.`);
	await readClawHubSkillsLockfile(params.workspaceDir);
}
async function readInstalledClawHubSkillFiles(params) {
	const fileTreeSha256 = await digestClawHubSkillTree(params.skillDir);
	const skillFile = await readInstalledSkillFileLock(params.skillDir);
	return {
		fileTreeSha256,
		...skillFile ? { skillFile } : {}
	};
}
//#endregion
//#region src/skills/lifecycle/clawhub-status.ts
const LOCAL_SKILL_CARD_FILENAME = "skill-card.md";
const LOCAL_SKILL_CARD_MAX_BYTES = 262144;
function readRealPathSync(candidate) {
	try {
		return fs.realpathSync.native(candidate);
	} catch {
		return;
	}
}
function invalidLink(reason, details) {
	return {
		status: "invalid",
		valid: false,
		reason,
		...details
	};
}
function resolveClawHubSkillStatusLinkSync(params) {
	const originRead = readClawHubSkillOriginStatusSync(params.skillDir);
	const lockRead = params.lockRead ?? readClawHubSkillsLockfileStatusSync(params.workspaceDir);
	const lockfileLabel = `${params.lockfileScope ?? "workspace"} ClawHub lockfile`;
	if (originRead.kind === "missing") {
		let trackedSlug;
		try {
			trackedSlug = normalizeTrackedSkillSlug(params.skillKey);
		} catch {
			return;
		}
		const locked = lockRead.kind === "found" ? lockRead.lock.skills[trackedSlug] : void 0;
		if (!locked) return;
		return invalidLink(`Skill "${trackedSlug}" is tracked by the ${lockfileLabel} but is missing local ClawHub origin metadata.`, {
			slug: trackedSlug,
			installedVersion: locked.version,
			installedAt: locked.installedAt,
			registry: normalizeStoredRegistry(locked.registry ?? resolveClawHubBaseUrl()),
			lockPath: lockRead.kind === "found" ? lockRead.path : void 0
		});
	}
	if (originRead.kind === "malformed") return invalidLink(`Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`, {
		originPath: originRead.path,
		lockPath: lockRead.kind === "found" ? lockRead.path : void 0
	});
	const originDetails = {
		registry: originRead.origin.registry,
		installedVersion: originRead.origin.installedVersion,
		installedAt: originRead.origin.installedAt,
		originPath: originRead.path
	};
	let trackedSlug;
	try {
		trackedSlug = normalizeTrackedSkillSlug(originRead.origin.slug);
	} catch (err) {
		return invalidLink(`Invalid ClawHub origin slug "${originRead.origin.slug}": ${formatErrorMessage(err)}`, {
			...originDetails,
			slug: originRead.origin.slug,
			lockPath: lockRead.kind === "found" ? lockRead.path : void 0
		});
	}
	if (lockRead.kind === "missing") return invalidLink(`Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`, {
		...originDetails,
		slug: trackedSlug
	});
	if (lockRead.kind === "malformed") return invalidLink(`Malformed ${lockfileLabel} at ${lockRead.path}: ${lockRead.error}`, {
		...originDetails,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	const locked = lockRead.lock.skills[trackedSlug];
	if (!locked) return invalidLink(`Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the ${lockfileLabel}.`, {
		...originDetails,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	const expectedSkillDir = readRealPathSync(resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug));
	if (!expectedSkillDir || readRealPathSync(params.skillDir) !== expectedSkillDir) return invalidLink(`Skill "${trackedSlug}" ClawHub origin metadata is not in the expected ClawHub install directory.`, {
		...originDetails,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	const originRegistry = normalizeStoredRegistry(originRead.origin.registry);
	const lockedRegistry = locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
	const sourceUrl = normalizeOptionalString(locked.sourceUrl);
	const ownerHandle = normalizeOptionalString(locked.ownerHandle);
	const requestedReference = normalizeOptionalString(locked.requestedReference);
	const trustState = locked.trustState === "not-scanned-by-clawhub" ? CLAWHUB_SKILLS_SH_TRUST_STATE : void 0;
	const artifact = normalizeDownloadedArtifactLock(locked.artifact);
	const skillFile = normalizeSkillFileLock(locked.skillFile);
	const fileTreeSha256 = normalizeOptionalString(locked.fileTreeSha256);
	const provenanceMatches = originRead.origin.ownerHandle === ownerHandle && originRead.origin.requestedReference === requestedReference && originRead.origin.trustState === trustState && originRead.origin.sourceUrl === sourceUrl && originRead.origin.artifact?.kind === artifact?.kind && originRead.origin.artifact?.sha256 === artifact?.sha256 && originRead.origin.artifact?.integrity === artifact?.integrity && originRead.origin.skillFile?.path === skillFile?.path && originRead.origin.skillFile?.sha256 === skillFile?.sha256 && originRead.origin.fileTreeSha256 === fileTreeSha256;
	if (locked.version !== originRead.origin.installedVersion || locked.installedAt !== originRead.origin.installedAt || lockedRegistry !== originRegistry || !provenanceMatches) return invalidLink(`Skill "${trackedSlug}" ClawHub origin metadata does not match the ${lockfileLabel}.`, {
		...originDetails,
		registry: lockedRegistry,
		slug: trackedSlug,
		lockPath: lockRead.path
	});
	return {
		status: "linked",
		valid: true,
		registry: lockedRegistry,
		slug: trackedSlug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		installedVersion: locked.version,
		installedAt: locked.installedAt,
		originPath: originRead.path,
		lockPath: lockRead.path,
		...sourceUrl ? { sourceUrl } : {},
		...artifact ? { artifact } : {},
		...skillFile ? { skillFile } : {},
		...fileTreeSha256 ? { fileTreeSha256 } : {}
	};
}
function readLocalSkillCardSync(skillDir, includeContent = false) {
	const cardPath = path.join(skillDir, LOCAL_SKILL_CARD_FILENAME);
	let fd;
	try {
		const opened = openRootFileSync({
			absolutePath: cardPath,
			rootPath: skillDir,
			boundaryLabel: "skill directory",
			maxBytes: LOCAL_SKILL_CARD_MAX_BYTES,
			rejectHardlinks: false
		});
		if (!opened.ok) return;
		fd = opened.fd;
		const result = {
			present: true,
			path: cardPath,
			sizeBytes: opened.stat.size
		};
		if (includeContent) result.content = readFileDescriptorBoundedSync(fd, LOCAL_SKILL_CARD_MAX_BYTES).toString("utf8");
		return result;
	} catch {
		return;
	} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function resolveLocalSkillCardStatusSync(skillDir) {
	return readLocalSkillCardSync(skillDir);
}
function readLocalSkillCardContentSync(skillDir) {
	return readLocalSkillCardSync(skillDir, true)?.content;
}
function normalizeOptionalSelector(value) {
	return value?.trim() || void 0;
}
async function searchSkillsFromClawHub(params) {
	return await searchClawHubSkills({
		query: params.query?.trim() ?? "",
		limit: params.limit,
		baseUrl: params.baseUrl
	});
}
async function resolveClawHubSkillVerificationTarget(params) {
	try {
		const workspaceAccess = getAgentWorkspaceAccess(params.workspaceDir, "loadSkills");
		const access = workspaceAccess?.loadSkills ? workspaceAccess : void 0;
		if (access) {
			if (!access.clawHubSkills) throw new WorkspaceAccessUnavailableError("Remote workspace ClawHub tracking is unavailable");
			return await access.clawHubSkills.resolveClawHubSkillVerificationTarget({
				...params,
				baseUrl: resolveClawHubBaseUrl(params.baseUrl)
			});
		}
		const version = normalizeOptionalSelector(params.version);
		const tag = normalizeOptionalSelector(params.tag);
		if (version && tag) return {
			ok: false,
			error: "Use either --version or --tag."
		};
		const requestedRef = parseRequestedClawHubSkillRef(params.slug);
		if (requestedRef.requestedReference && (version || tag)) return {
			ok: false,
			error: "--version and --tag are not supported for skills-sh references."
		};
		const trackedSlug = requestedRef.slug;
		const skillDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug);
		const originRead = await readClawHubSkillOriginStrict(skillDir);
		if (originRead.kind === "malformed") return {
			ok: false,
			error: `Malformed ClawHub origin metadata at ${originRead.path}: ${originRead.error}`
		};
		if (originRead.kind === "found") {
			const locked = (await readClawHubSkillsLockfile(params.workspaceDir)).skills[trackedSlug];
			if (!locked) return {
				ok: false,
				error: `Skill "${trackedSlug}" has ClawHub origin metadata but is not tracked by the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			if (normalizeTrackedSkillSlug(originRead.origin.slug) !== trackedSlug) return {
				ok: false,
				error: `Skill "${trackedSlug}" has ClawHub origin metadata for "${originRead.origin.slug}". Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			const originRegistry = normalizeStoredRegistry(originRead.origin.registry);
			const lockedRegistry = locked.registry === void 0 ? originRegistry : normalizeStoredRegistry(locked.registry);
			const ownerHandle = normalizeOptionalString(locked.ownerHandle);
			const requestedReference = normalizeOptionalString(locked.requestedReference);
			const trustState = locked.trustState === "not-scanned-by-clawhub" ? CLAWHUB_SKILLS_SH_TRUST_STATE : void 0;
			if (locked.version !== originRead.origin.installedVersion || locked.installedAt !== originRead.origin.installedAt || lockedRegistry !== originRegistry || originRead.origin.ownerHandle !== ownerHandle || originRead.origin.requestedReference !== requestedReference || originRead.origin.trustState !== trustState) return {
				ok: false,
				error: `Skill "${trackedSlug}" ClawHub origin metadata does not match the workspace ClawHub lockfile. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
			};
			if (requestedReference && (version || tag)) return {
				ok: false,
				error: "--version and --tag are not supported for skills-sh references."
			};
			if (requestedRef.ownerHandle && ownerHandle !== requestedRef.ownerHandle) return {
				ok: false,
				error: `Skill "${trackedSlug}" is tracked as ${ownerHandle ? `@${ownerHandle}/${trackedSlug}` : trackedSlug}, not @${requestedRef.ownerHandle}/${trackedSlug}.`
			};
			if (requestedRef.requestedReference && requestedReference !== requestedRef.requestedReference) return {
				ok: false,
				error: `Skill "${trackedSlug}" is not tracked from ${requestedRef.requestedReference}.`
			};
			const selector = version ? "version" : tag ? "tag" : "installed-version";
			const verificationVersion = requestedReference ? void 0 : version ?? (tag ? void 0 : locked.version);
			return {
				ok: true,
				slug: trackedSlug,
				...ownerHandle ? { ownerHandle } : {},
				...requestedReference ? { requestedReference } : {},
				...trustState ? { trustState } : {},
				baseUrl: lockedRegistry,
				version: verificationVersion,
				tag: requestedReference ? void 0 : tag,
				resolution: {
					source: "installed",
					selector,
					registry: lockedRegistry,
					skillDir,
					installedVersion: locked.version
				}
			};
		}
		const lockRead = readClawHubSkillsLockfileStatusSync(params.workspaceDir);
		if (lockRead.kind === "malformed") return {
			ok: false,
			error: `Malformed workspace ClawHub lockfile at ${lockRead.path}: ${lockRead.error}`
		};
		if (lockRead.kind === "found" && lockRead.lock.skills[trackedSlug]) return {
			ok: false,
			error: `Skill "${trackedSlug}" is tracked by the workspace ClawHub lockfile but is missing ClawHub origin metadata. Reinstall it from ClawHub before verifying it as an installed ClawHub skill.`
		};
		const registry = resolveClawHubBaseUrl(params.baseUrl);
		const selector = version ? "version" : tag ? "tag" : "latest";
		return {
			ok: true,
			slug: requestedRef.slug,
			...requestedRef.ownerHandle ? { ownerHandle: requestedRef.ownerHandle } : {},
			...requestedRef.requestedReference ? { requestedReference: requestedRef.requestedReference } : {},
			...requestedRef.trustState ? { trustState: requestedRef.trustState } : {},
			baseUrl: registry,
			version,
			tag,
			resolution: {
				source: "registry",
				selector,
				registry,
				skillDir: void 0,
				installedVersion: void 0
			}
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err)
		};
	}
}
async function preflightSkillOwnerState(params) {
	const targetDir = resolveWorkspaceSkillInstallDir(params.workspaceDir, params.requested.slug);
	if (!await pathExists(targetDir)) return {
		ok: true,
		action: "install",
		integrity: params.integrity
	};
	const status = resolveClawHubSkillStatusLinkSync({
		workspaceDir: params.workspaceDir,
		skillDir: targetDir,
		skillKey: params.requested.slug
	});
	if (status?.status === "linked" && status.installedVersion === params.version && status.ownerHandle === params.requested.ownerHandle && status.artifact?.integrity === params.integrity) return {
		ok: true,
		action: "reuse",
		integrity: params.integrity
	};
	return {
		ok: false,
		code: "skill_version_conflict",
		error: `Skill ${params.requestedLabel}@${params.version} conflicts with the existing workspace skill at ${targetDir}.`
	};
}
async function resolveRequestedUpdateSlug(params) {
	const requested = params.requestedSlug.trim();
	const requestedRef = requested.startsWith("@") || requested.startsWith("skills-sh:") ? parseRequestedClawHubSkillRef(requested) : { slug: normalizeTrackedSkillSlug(requested) };
	const trackedSlug = requestedRef.slug;
	const trackedOrigin = await readClawHubSkillOrigin(resolveWorkspaceSkillInstallDir(params.workspaceDir, trackedSlug));
	const trackedLockEntry = params.lock.skills[trackedSlug];
	if (!trackedOrigin && !trackedLockEntry) return validateRequestedSkillSlug(requestedRef.slug);
	const trackedOwnerHandle = trackedOrigin?.ownerHandle ?? trackedLockEntry?.ownerHandle;
	if (requestedRef.ownerHandle && trackedOwnerHandle !== requestedRef.ownerHandle) {
		const trackedRef = trackedOwnerHandle ? `@${trackedOwnerHandle}/${trackedSlug}` : trackedSlug;
		throw new Error(`Skill "${trackedSlug}" is tracked as ${trackedRef}, not @${requestedRef.ownerHandle}/${trackedSlug}.`);
	}
	const trackedRequestedReference = trackedOrigin?.requestedReference ?? trackedLockEntry?.requestedReference;
	if (requestedRef.requestedReference && trackedRequestedReference !== requestedRef.requestedReference) throw new Error(`Skill "${trackedSlug}" is not tracked from ${requestedRef.requestedReference}.`);
	return trackedSlug;
}
async function resolveTrackedUpdateTarget(params) {
	const origin = await readClawHubSkillOrigin(resolveWorkspaceSkillInstallDir(params.workspaceDir, params.slug));
	const lockEntry = params.lock.skills[params.slug];
	if (!origin && !lockEntry) return {
		ok: false,
		slug: params.slug,
		error: `Skill "${params.slug}" is not tracked as a ClawHub install.`
	};
	const ownerHandle = origin?.ownerHandle ?? lockEntry?.ownerHandle;
	const requestedReference = origin?.requestedReference ?? lockEntry?.requestedReference;
	const trustState = origin?.trustState ?? lockEntry?.trustState;
	return {
		ok: true,
		slug: params.slug,
		...ownerHandle ? { ownerHandle } : {},
		...requestedReference ? { requestedReference } : {},
		...trustState ? { trustState } : {},
		baseUrl: origin?.registry ?? params.baseUrl,
		previousVersion: origin?.installedVersion ?? lockEntry?.version ?? null
	};
}
//#endregion
export { recordClawHubSkillInstall as _, resolveLocalSkillCardStatusSync as a, searchSkillsFromClawHub as c, normalizeGitHubCommitSegment as d, parseRequestedClawHubSkillRef as f, readTrackedClawHubSkillSlugs as g, readInstalledClawHubSkillFiles as h, resolveClawHubSkillVerificationTarget as i, assertClawHubSkillInstallState as l, readClawHubSkillsLockfileStatusSync as m, readLocalSkillCardContentSync as n, resolveRequestedUpdateSlug as o, readClawHubSkillsLockfile as p, resolveClawHubSkillStatusLinkSync as r, resolveTrackedUpdateTarget as s, preflightSkillOwnerState as t, formatClawHubSkillRef as u, untrackClawHubSkill as v };
