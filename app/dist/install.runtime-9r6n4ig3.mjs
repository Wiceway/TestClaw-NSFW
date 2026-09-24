import { d as pathExists } from "./fs-safe-B1VkXzpu.mjs";
import { n as isPathInside, r as isPathInsideWithRealpath } from "./path-safety-D-qXHKZj.mjs";
import "./includes-BmaVsPnI.mjs";
import { i as readJson } from "./json-files-BOBkrvx7.mjs";
import { i as isPrereleaseResolutionAllowed, l as validateRegistryNpmSpec, n as formatPrereleaseResolutionError, o as parseRegistryNpmSpec } from "./npm-registry-spec-B-fX1tYr.mjs";
import { p as resolveArchiveKind } from "./archive-P-Y6Y6q2.mjs";
import { a as resolveArchiveSourcePath, c as withInstallWorkspace, d as resolveTimedInstallModeOptions, i as packNpmSpecToArchive, l as resolveInstallModeOptions } from "./install-source-utils-Cje4YZy0.mjs";
import { r as installPackageDir } from "./install-package-dir-Cy6JnOCT.mjs";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-BnxQJHd5.mjs";
import { n as withExtractedArchiveRoot, t as resolveExistingInstallPath } from "./install-flow-DUvF1mXq.mjs";
import { n as resolveCanonicalInstallTarget, t as ensureInstallTargetAvailable } from "./install-target-BCituOtD.mjs";
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
