import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BPqVt7Ps.mjs";
import { r as resolveRealpathOrAbsolute } from "./boundary-path-DdYnCwCA.mjs";
import "./utils-Dy46mFy2.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-u2SCs3-A.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-Dm8T0OhW.mjs";
import "./agent-scope-_30Scclc.mjs";
import { o as isRenderableAvatarImageDataUrl, t as AVATAR_MAX_BYTES } from "./avatar-limits-2506OuP3.mjs";
import { a as isSupportedLocalAvatarExtension, c as resolveAvatarMime, i as isPathWithinRoot, n as isAvatarDataUrl, o as isWindowsAbsolutePath, r as isAvatarHttpUrl, t as hasAvatarUriScheme } from "./avatar-policy-COOAbr6a.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/identity-avatar-file.ts
/** Resolve one local avatar source while retaining its canonical workspace root. */
function resolveLocalAgentAvatarPath(params) {
	const workspaceRoot = resolveRealpathOrAbsolute(params.workspaceDir);
	const resolved = params.raw.startsWith("~") || path.isAbsolute(params.raw) ? resolveUserPath(params.raw) : path.resolve(workspaceRoot, params.raw);
	const filePath = resolveRealpathOrAbsolute(resolved);
	if (!isPathWithinRoot(workspaceRoot, filePath)) return {
		ok: false,
		reason: "outside_workspace"
	};
	if (!isSupportedLocalAvatarExtension(filePath)) return {
		ok: false,
		reason: "unsupported_extension"
	};
	try {
		const stat = fs.statSync(filePath);
		if (!stat.isFile()) return {
			ok: false,
			reason: "missing"
		};
		if (stat.size > 2097152) return {
			ok: false,
			reason: "too_large"
		};
	} catch {
		return {
			ok: false,
			reason: "missing"
		};
	}
	return {
		ok: true,
		value: {
			filePath,
			workspaceRoot
		}
	};
}
function openResolvedLocalAgentAvatarFile(resolved) {
	try {
		const opened = openRootFileSync({
			absolutePath: resolved.filePath,
			rootPath: resolved.workspaceRoot,
			rootRealPath: resolved.workspaceRoot,
			boundaryLabel: "agent workspace",
			maxBytes: AVATAR_MAX_BYTES,
			rejectHardlinks: true,
			skipLexicalRootCheck: true
		});
		if (!opened.ok) return null;
		if (!isSupportedLocalAvatarExtension(opened.path)) {
			fs.closeSync(opened.fd);
			return null;
		}
		return {
			path: opened.path,
			fd: opened.fd,
			stat: {
				ctimeMs: opened.stat.ctimeMs,
				dev: opened.stat.dev,
				ino: opened.stat.ino,
				mtimeMs: opened.stat.mtimeMs,
				size: opened.stat.size
			}
		};
	} catch {
		return null;
	}
}
/**
* Open one selected local avatar under its agent workspace.
* A successful caller owns `file.fd` and must close it exactly once.
*/
function openLocalAgentAvatarFile(params) {
	const resolved = resolveLocalAgentAvatarPath({
		raw: params.source,
		workspaceDir: resolveAgentWorkspaceDir(params.cfg, params.agentId)
	});
	if (!resolved.ok) return resolved;
	const file = openResolvedLocalAgentAvatarFile(resolved.value);
	return file ? {
		ok: true,
		file
	} : {
		ok: false,
		reason: "unreadable"
	};
}
/** Consume a pinned local avatar descriptor into a data URL. Always closes it. */
function readOpenedLocalAgentAvatarDataUrl(opened) {
	try {
		const buffer = readFileDescriptorBoundedSync(opened.fd, AVATAR_MAX_BYTES);
		return `data:${resolveAvatarMime(opened.path)};base64,${buffer.toString("base64")}`;
	} catch {
		return;
	} finally {
		fs.closeSync(opened.fd);
	}
}
/** Resolve one configured avatar source for agent-list projections. */
function resolveAgentAvatarUrlFromSource(cfg, agentId, source) {
	const normalized = normalizeOptionalString(source);
	if (!normalized) return;
	if (isAvatarHttpUrl(normalized) || isRenderableAvatarImageDataUrl(normalized)) return normalized;
	if (isAvatarDataUrl(normalized) || hasAvatarUriScheme(normalized) && !isWindowsAbsolutePath(normalized)) return;
	const opened = openLocalAgentAvatarFile({
		cfg,
		agentId,
		source: normalized
	});
	return opened.ok ? readOpenedLocalAgentAvatarDataUrl(opened.file) : void 0;
}
//#endregion
export { resolveLocalAgentAvatarPath as i, readOpenedLocalAgentAvatarDataUrl as n, resolveAgentAvatarUrlFromSource as r, openLocalAgentAvatarFile as t };
