import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import "./utils-BfoJTy8l.js";
import { d as pathExists } from "./fs-safe-CZ3jhUUr.js";
import { f as resolvePackedRootDir, l as extractArchive } from "./archive-yx_Z0RZv.js";
import { c as withInstallWorkspace, u as resolveInstallWorkTimeoutMs } from "./install-source-utils-DHWsIfEL.js";
import { c as withInstallActivity } from "./install-package-dir-Diw3eGK7.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/install-flow.ts
/** Resolve and stat a user-provided install path. */
async function resolveExistingInstallPath(inputPath) {
	const resolvedPath = resolveUserPath(inputPath);
	if (!await pathExists(resolvedPath)) return {
		ok: false,
		error: `path not found: ${resolvedPath}`
	};
	return {
		ok: true,
		resolvedPath,
		stat: await fs.stat(resolvedPath)
	};
}
/** Extract an archive to a temp dir and run work against the detected package root. */
async function withExtractedArchiveRoot(params) {
	return await withInstallWorkspace(params.tempDirPrefix, async (tmpDir) => {
		const extractDir = path.join(tmpDir, "extract");
		await fs.mkdir(extractDir, { recursive: true });
		params.logger?.info?.(`Extracting ${params.archivePath}…`);
		try {
			await withInstallActivity(params.logger, "extract", () => extractArchive({
				archivePath: params.archivePath,
				destDir: extractDir,
				timeoutMs: resolveInstallWorkTimeoutMs(params.workTimeoutMs, params.timeoutMs) ?? 0,
				logger: params.logger,
				limits: params.verification?.limits ?? params.limits,
				durable: false
			}));
		} catch (err) {
			if (params.verification) return params.verification.onExtractionError(err);
			return {
				ok: false,
				error: `failed to extract archive: ${String(err)}`
			};
		}
		const verificationFailure = await params.verification?.verify(extractDir);
		if (verificationFailure) return verificationFailure;
		let rootDir;
		try {
			rootDir = await resolvePackedRootDir(extractDir, { rootMarkers: params.rootMarkers ? [...params.rootMarkers] : void 0 });
		} catch (err) {
			return {
				ok: false,
				error: String(err)
			};
		}
		return await params.onExtracted(rootDir);
	});
}
//#endregion
export { withExtractedArchiveRoot as n, resolveExistingInstallPath as t };
