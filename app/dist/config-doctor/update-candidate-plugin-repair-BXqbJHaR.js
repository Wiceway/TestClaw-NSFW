import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D465IUx2.js";
import { r as resolveAssistantPackageRootSync } from "./testclaw-root-QV2nsx8w.js";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BBHaqzpY.js";
import { i as isPluginInPackageBundledRoots } from "./bundled-dir-wAZIVp2F.js";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-D4j-tzq3.js";
import { t as discoverConfiguredPluginLoadPaths } from "./discovery-2wVyQ2Ni.js";
import { r as loadPluginManifest } from "./manifest-DQTAOZoC.js";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-BsuozKQZ.js";
import { r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-SMf2br4D.js";
import { n as inspectPluginSourceDependencies } from "./plugin-generation-source-inspection-e5-rCQOp.js";
import { n as resolveUpdateCandidatePluginPath, r as resolveUpdateCandidatePluginSourcePath } from "./update-candidate-paths-DMiAfiSo.js";
import { n as prepareUpdateCandidatePluginTrees, t as copyUpdateCandidatePluginTrees } from "./update-candidate-plugin-tree-DH-3iPcj.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-candidate-plugin-sources.ts
/** Snapshot the executable surfaces their owners can demand during candidate validation. */
function resolveUpdateCandidatePluginSourceEntries(candidates, config) {
	const plugins = normalizePluginsConfig(config.plugins);
	const entries = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		if (candidate.format === "bundle") continue;
		const manifest = loadPluginManifest(candidate.rootDir);
		const pluginId = candidate.effectivePluginId ?? (manifest.ok ? manifest.manifest.id : candidate.idHint);
		const enabled = resolveEffectiveEnableState({
			id: pluginId,
			origin: candidate.origin,
			config: plugins,
			rootConfig: config
		}).enabled;
		const packageManifest = candidate.packageManifest;
		if (enabled) entries.set(candidate.source, {
			pluginId,
			rootDir: candidate.rootDir,
			entryFile: candidate.source
		});
		if (candidate.setupSource && (enabled || packageManifest?.setupFeatures?.configPromotion)) entries.set(candidate.setupSource, {
			pluginId,
			rootDir: candidate.rootDir,
			entryFile: candidate.setupSource
		});
		if (!manifest.ok || manifest.manifest.doctorContract && !Object.values(manifest.manifest.doctorContract).some(Boolean)) continue;
		const doctor = resolvePluginDoctorContractArtifact({
			rootDir: candidate.rootDir,
			origin: candidate.origin,
			packageManifest
		});
		if (doctor) entries.set(doctor.modulePath, {
			pluginId,
			rootDir: doctor.boundaryRoot,
			entryFile: doctor.modulePath
		});
	}
	return [...entries.values()];
}
//#endregion
//#region src/infra/update-candidate-plugin-repair.ts
async function readOptionalFile(file) {
	return fs.readFile(file).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	});
}
/** Complete a published driver's private snapshot before candidate Doctor loads plugins. */
async function completeUpdateCandidatePluginRehearsal(params) {
	const rehearsalRoot = resolveUpdateRehearsalRoot(params.env);
	const warnings = [];
	if (!rehearsalRoot || params.env.TESTCLAW_UPDATE_IN_PROGRESS !== "1") return {
		copiedFiles: 0,
		warnings
	};
	const privateRoot = await fs.realpath(rehearsalRoot);
	const assertPrivate = (file) => {
		if (!isPathInside(privateRoot, path.resolve(file)) || !isPathInside(privateRoot, resolvePathViaExistingAncestorSync(file))) throw new Error(`Plugin dependency is outside the temporary update copy: ${file}`);
	};
	const isPrivateLookup = (specifier) => {
		const absolute = specifier.startsWith("file:") ? fileURLToPath(specifier) : path.isAbsolute(specifier) ? specifier : void 0;
		return !absolute || isPathInside(privateRoot, absolute);
	};
	const sources = new Set(params.config.plugins?.load?.paths ?? []);
	for (const record of [...Object.values(params.installRecords ?? {}), ...Object.values(params.config.plugins?.installs ?? {})]) {
		if (record.installPath) sources.add(record.installPath);
		if (record.source === "path" && record.sourcePath) sources.add(record.sourcePath);
	}
	if (sources.size === 0) return {
		copiedFiles: 0,
		warnings
	};
	const candidateRoot = params.candidateRoot ?? resolveAssistantPackageRootSync({ moduleUrl: import.meta.url });
	if (!candidateRoot) throw new Error("Cannot locate the staged Assistant installation for plugin setup");
	const entries = resolveUpdateCandidatePluginSourceEntries(discoverConfiguredPluginLoadPaths({
		loadPaths: [...sources],
		deduplicate: true,
		env: params.env
	}).candidates.filter((candidate) => isPathInside(privateRoot, candidate.rootDir) || !isPluginInPackageBundledRoots({
		rootDir: candidate.rootDir,
		packageRoot: candidateRoot
	})), params.config);
	const originals = [];
	const comparedFiles = /* @__PURE__ */ new Map();
	const project = (source) => resolveUpdateCandidatePluginPath(privateRoot, privateRoot, source);
	const assertMatchingFile = async (source, copied) => {
		assertPrivate(copied);
		const [original, existing] = await Promise.all([readOptionalFile(source), readOptionalFile(copied)]);
		if (original === void 0 !== (existing === void 0) || original && existing && !original.equals(existing)) throw new Error(`Plugin source changed since the update snapshot: ${source}. Retry the update after plugin edits finish.`);
	};
	for (const entry of entries) {
		assertPrivate(entry.rootDir);
		assertPrivate(entry.entryFile);
		let copiedGraph;
		try {
			copiedGraph = inspectPluginSourceDependencies([entry]);
		} catch (error) {
			if (!(error instanceof SyntaxError)) throw error;
			warnings.push(`Update checks could not inspect plugin ${entry.pluginId} (${entry.entryFile}): ${error.message}. Continuing without dependency repair for this entry.`);
			continue;
		}
		for (const reference of copiedGraph.references) if (isPathInside(privateRoot, reference.source) && isPrivateLookup(reference.specifier)) assertPrivate(reference.target);
		copiedGraph.assertSourceCurrent();
		const unresolvedPrivate = copiedGraph.unresolved.filter(({ source, specifier }) => isPathInside(privateRoot, source) && isPrivateLookup(specifier));
		if (unresolvedPrivate.length === 0) continue;
		const [copiedRoot, copiedEntry] = await Promise.all([fs.realpath(entry.rootDir), fs.realpath(entry.entryFile)]);
		const rootDir = resolveUpdateCandidatePluginSourcePath(privateRoot, copiedRoot);
		const entryFile = resolveUpdateCandidatePluginSourcePath(privateRoot, copiedEntry);
		if (!rootDir || !entryFile || !isPathInside(rootDir, entryFile)) {
			warnings.push(`Update checks could not recover the original plugin path for ${entry.entryFile}.`);
			continue;
		}
		const missingReferences = new Set(unresolvedPrivate.flatMap(({ source, specifier }) => {
			const original = resolveUpdateCandidatePluginSourcePath(privateRoot, source);
			return original ? [JSON.stringify([original, specifier])] : [];
		}));
		const canonicalSource = await fs.realpath(entryFile).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (!canonicalSource) {
			warnings.push(`Plugin source for update checks is no longer available: ${entryFile}.`);
			continue;
		}
		let available;
		try {
			available = inspectPluginSourceDependencies([{
				rootDir,
				entryFile
			}]);
		} catch (error) {
			warnings.push(`Update checks could not inspect the original source for plugin ${entry.pluginId} (${entryFile}): ${String(error)}`);
			continue;
		}
		if (!available.references.some(({ source, specifier }) => missingReferences.has(JSON.stringify([source, specifier])))) continue;
		if (canonicalSource !== entryFile || await fs.realpath(rootDir) !== rootDir) throw new Error(`Plugin source location changed since the update snapshot: ${entryFile}.`);
		for (const [source, copied] of [
			[entryFile, copiedEntry],
			[path.join(rootDir, "package.json"), path.join(copiedRoot, "package.json")],
			[path.join(rootDir, "testclaw.plugin.json"), path.join(copiedRoot, "testclaw.plugin.json")]
		]) {
			await assertMatchingFile(source, copied);
			comparedFiles.set(source, copied);
		}
		available.assertSourceCurrent();
		originals.push(available);
	}
	if (originals.length === 0) return {
		copiedFiles: 0,
		warnings
	};
	const files = new Set(originals.flatMap((graph) => graph.files));
	const assertSourcesCurrent = () => originals.forEach((graph) => graph.assertSourceCurrent());
	for (const source of files) {
		const copied = project(source);
		assertPrivate(copied);
		if (await readOptionalFile(copied)) comparedFiles.set(source, copied);
	}
	const assertCurrent = async () => {
		if (params.env.TESTCLAW_UPDATE_IN_PROGRESS !== "1" || resolveUpdateRehearsalRoot(params.env) !== rehearsalRoot) throw new Error("Update authority changed during plugin dependency preparation");
		assertSourcesCurrent();
		for (const [source, copied] of comparedFiles) await assertMatchingFile(source, copied);
		assertSourcesCurrent();
	};
	await assertCurrent();
	const plan = await prepareUpdateCandidatePluginTrees({
		roots: new Map(originals.flatMap((graph) => graph.packageRoots.concat(graph.files)).map((source) => [source, project(source)])),
		project,
		targetStateDir: privateRoot,
		candidateRoot
	});
	const missing = [];
	for (const entry of plan.entries) {
		const destination = project(entry.path);
		assertPrivate(destination);
		const existing = await fs.lstat(destination).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (!existing) missing.push(entry);
		else if (entry.kind === "directory" && !existing.isDirectory() || entry.kind === "file" && !existing.isFile() || entry.kind === "symlink" && !existing.isSymbolicLink()) throw new Error(`Plugin dependency conflicts with the existing update snapshot: ${destination}`);
	}
	await assertCurrent();
	if (missing.length > 0) {
		await copyUpdateCandidatePluginTrees({
			...plan,
			entries: missing
		}, {
			targetStateDir: privateRoot,
			candidateRoot
		});
		await assertCurrent();
	}
	return {
		copiedFiles: missing.filter((entry) => entry.kind === "file").length,
		warnings
	};
}
//#endregion
export { completeUpdateCandidatePluginRehearsal };
