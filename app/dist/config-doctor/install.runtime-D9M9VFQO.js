import { d as pathExists } from "./fs-safe-CZ3jhUUr.js";
import { n as isPathInside, r as isPathInsideWithRealpath } from "./path-safety-DGxmmiKh.js";
import "./includes-Be6ircIw.js";
import { i as readJson } from "./json-files-DAp75qfY.js";
import { i as isPrereleaseResolutionAllowed, l as validateRegistryNpmSpec, n as formatPrereleaseResolutionError, o as parseRegistryNpmSpec } from "./npm-registry-spec-CfnkP6Wa.js";
import { d as resolveArchiveKind } from "./archive-yx_Z0RZv.js";
import { a as resolveArchiveSourcePath, c as withInstallWorkspace, d as resolveTimedInstallModeOptions, i as packNpmSpecToArchive, l as resolveInstallModeOptions } from "./install-source-utils-DHWsIfEL.js";
import { r as installPackageDir } from "./install-package-dir-Diw3eGK7.js";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-BnxQJHd5.js";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-GLhZsY-3.js";
import { n as resolveCanonicalInstallTarget, t as ensureInstallTargetAvailable } from "./install-target-BAYjIsTJ.js";
//#region src/infra/install-from-npm-spec.ts
function isSuccessfulInstallResult(result) {
	return result.ok;
}
/**
* Validates a registry npm spec, downloads its archive, and delegates final installation.
* The caller supplies archive-specific params without `archivePath`; this helper injects
* the downloaded archive path and normalizes the npm archive flow result.
*/
async function installFromValidatedNpmSpecArchive(params) {
	const spec = params.spec.trim();
	const specError = validateRegistryNpmSpec(spec);
	if (specError) return {
		ok: false,
		error: specError
	};
	const flowResult = await withInstallWorkspace(params.tempDirPrefix, async (tmpDir) => {
		const parsedSpec = parseRegistryNpmSpec(spec);
		if (!parsedSpec) return {
			ok: false,
			error: "unsupported npm spec"
		};
		const packedResult = await packNpmSpecToArchive({
			spec,
			timeoutMs: params.timeoutMs,
			workTimeoutMs: params.workTimeoutMs,
			cwd: tmpDir
		});
		if (!packedResult.ok) return packedResult;
		const npmResolution = {
			...packedResult.metadata,
			resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (npmResolution.version && !isPrereleaseResolutionAllowed({
			spec: parsedSpec,
			resolvedVersion: npmResolution.version
		})) return {
			ok: false,
			error: formatPrereleaseResolutionError({
				spec: parsedSpec,
				resolvedVersion: npmResolution.version
			})
		};
		const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
			spec,
			expectedIntegrity: params.expectedIntegrity,
			resolution: npmResolution,
			onIntegrityDrift: params.onIntegrityDrift,
			warn: params.warn
		});
		if (driftResult.error) return {
			ok: false,
			error: driftResult.error
		};
		return {
			ok: true,
			installResult: await params.installFromArchive({
				archivePath: packedResult.archivePath,
				...params.archiveInstallParams
			}),
			npmResolution,
			integrityDrift: driftResult.integrityDrift
		};
	});
	if (!flowResult.ok) return flowResult;
	const installResult = flowResult.installResult;
	if (!isSuccessfulInstallResult(installResult)) return installResult;
	return {
		...installResult,
		npmResolution: flowResult.npmResolution,
		...flowResult.integrityDrift ? { integrityDrift: flowResult.integrityDrift } : {}
	};
}
//#endregion
export { ensureInstallTargetAvailable, pathExists as fileExists, installFromValidatedNpmSpecArchive, installPackageDir, isPathInside, isPathInsideWithRealpath, readJson as readJsonFile, resolveArchiveKind, resolveArchiveSourcePath, resolveCanonicalInstallTarget, resolveExistingInstallPath, resolveInstallModeOptions, resolveTimedInstallModeOptions, withExtractedArchiveRoot };
