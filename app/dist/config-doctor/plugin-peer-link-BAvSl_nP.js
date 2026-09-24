import { r as isPathInside } from "./path-guards-D465IUx2.js";
import { r as resolveAssistantPackageRootSync } from "./testclaw-root-QV2nsx8w.js";
import { o as resolveUserPath } from "./home-dir-DjuHbd5R.js";
import { o as safeRealpathSync } from "./path-safety-DGxmmiKh.js";
import "./path-safety-xYU8Js1N.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import "./errors-cp9Var1Z.js";
import { c as readRootJsonObjectSync } from "./json-files-DAp75qfY.js";
import { c as resolvePluginInstallDir } from "./install-paths--_w6GXvW.js";
import { lstatSync, symlinkSync, unlinkSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/npm-package-dirs.ts
async function listNpmPackageDirs(npmRoot, options) {
	const readEntries = async (dir) => {
		try {
			const entries = await fs$1.readdir(dir, { withFileTypes: true });
			return options.sortEntries ? entries.toSorted((left, right) => left.name.localeCompare(right.name)) : entries;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return [];
			throw error;
		}
	};
	const nodeModulesDir = path.join(npmRoot, "node_modules");
	const packageDirs = [];
	for (const entry of await readEntries(nodeModulesDir)) {
		if (!options.includeEntry(entry, false)) continue;
		const entryPath = path.join(nodeModulesDir, entry.name);
		if (entry.name.startsWith("@")) {
			for (const scopedEntry of await readEntries(entryPath)) if (options.includeEntry(scopedEntry, true)) packageDirs.push(path.join(entryPath, scopedEntry.name));
		} else packageDirs.push(entryPath);
	}
	return packageDirs;
}
//#endregion
//#region src/plugins/plugin-peer-link.ts
/** Resolve the host declaration consistently for peer, direct, and optional dependencies. */
function resolveAssistantHostDependency(manifest) {
	for (const declaration of [
		"peerDependencies",
		"optionalDependencies",
		"dependencies"
	]) {
		const dependencies = manifest[declaration];
		const spec = typeof dependencies === "object" && dependencies !== null && !Array.isArray(dependencies) ? dependencies.testclaw : void 0;
		if (typeof spec === "string" && spec) return {
			declaration,
			spec
		};
	}
	return null;
}
async function readSafePackageManifest(packageDir) {
	const result = readRootJsonObjectSync({
		rootDir: packageDir,
		relativePath: "package.json",
		boundaryLabel: "installed plugin package directory"
	});
	if (!result.ok) {
		if (result.reason === "open" && result.failure.error?.code === "ENOENT") return null;
		if (result.reason === "parse") throw new SyntaxError(result.error);
		if (result.reason === "open" && result.failure.error instanceof Error) throw result.failure.error;
		throw new Error(`Could not safely read package.json from ${packageDir}: ${result.reason === "open" ? result.failure.reason : result.error}`);
	}
	return result.value;
}
async function readPackageAssistantLinkDependencies(packageDir) {
	const manifest = await readSafePackageManifest(packageDir);
	const dependency = manifest ? resolveAssistantHostDependency(manifest) : null;
	return dependency ? { testclaw: dependency.spec } : {};
}
async function listManagedNpmRootPackageDirs(npmRoot) {
	return (await listNpmPackageDirs(npmRoot, { includeEntry: (entry, scoped) => entry.isDirectory() && (scoped || !entry.name.startsWith(".")) })).toSorted((a, b) => a.localeCompare(b));
}
async function safeRealpath(filePath) {
	try {
		return await fs$1.realpath(filePath);
	} catch {
		return null;
	}
}
function managedPackageNameFromDir(params) {
	return path.relative(path.join(params.npmRoot, "node_modules"), params.packageDir).split(path.sep).join("/");
}
function auditAssistantPeerDependency(params) {
	const packageName = params.packageName ?? (params.npmRoot ? managedPackageNameFromDir({
		npmRoot: params.npmRoot,
		packageDir: params.packageDir
	}) : path.basename(params.packageDir));
	const nodeModulesDir = path.join(params.packageDir, "node_modules");
	try {
		const existing = lstatSync(nodeModulesDir);
		if (!existing.isDirectory() || existing.isSymbolicLink()) return {
			packageName,
			packageDir: params.packageDir,
			reason: `${nodeModulesDir} is not a real directory`
		};
	} catch (error) {
		if (error.code === "ENOENT") return {
			packageName,
			packageDir: params.packageDir,
			reason: `missing ${path.join(nodeModulesDir, "testclaw")}`
		};
		throw error;
	}
	const linkPath = path.join(nodeModulesDir, "testclaw");
	const currentTarget = safeRealpathSync(linkPath);
	if (!currentTarget) return {
		packageName,
		packageDir: params.packageDir,
		reason: `missing ${linkPath}`
	};
	const expectedTarget = safeRealpathSync(params.hostRoot) ?? params.hostRoot;
	if (currentTarget !== expectedTarget) return {
		packageName,
		packageDir: params.packageDir,
		reason: `${linkPath} points to ${currentTarget} instead of ${expectedTarget}`
	};
	return null;
}
function auditAssistantPeerDependencyLinkSync(params) {
	const packageName = params.packageName ?? path.basename(params.packageDir);
	const hostRoot = resolveAssistantPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) return {
		packageName,
		packageDir: params.packageDir,
		reason: "could not locate testclaw package root"
	};
	return auditAssistantPeerDependency({
		hostRoot,
		packageDir: params.packageDir,
		packageName
	});
}
async function auditAssistantPeerDependencyLink(params) {
	return auditAssistantPeerDependencyLinkSync(params);
}
/** Audit the installed host only when the package actually declares an Assistant dependency. */
async function auditDeclaredAssistantHostDependency(params) {
	const dependencies = await readPackageAssistantLinkDependencies(params.packageDir);
	if (!Object.hasOwn(dependencies, "testclaw")) return null;
	return await auditAssistantPeerDependencyLink(params);
}
async function ensureRealNodeModulesDir(params) {
	const nodeModulesDir = path.join(params.installedDir, "node_modules");
	let existing;
	try {
		existing = await fs$1.lstat(nodeModulesDir);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (!existing) {
		await params.beforePersistentEffect?.();
		params.beforePersistentApply?.();
		await fs$1.mkdir(nodeModulesDir, { recursive: true });
		existing = await fs$1.lstat(nodeModulesDir);
	}
	if (!existing.isDirectory() || existing.isSymbolicLink()) {
		params.logger.warn?.(`Skipping testclaw peerDependency link because ${nodeModulesDir} is not a real directory.`);
		return null;
	}
	return nodeModulesDir;
}
async function linkAssistantPeerDependency(params) {
	const nodeModulesDir = await ensureRealNodeModulesDir(params);
	if (!nodeModulesDir) return "skipped";
	const linkPath = path.join(nodeModulesDir, params.peerName);
	const expectedTarget = await safeRealpath(params.hostRoot) ?? params.hostRoot;
	if (await safeRealpath(linkPath) === expectedTarget) return "unchanged";
	const warn = (error) => {
		params.beforePersistentApply?.();
		params.logger.warn?.(`Failed to symlink peerDependency "${params.peerName}": ${String(error)}`);
		return "skipped";
	};
	let existing;
	try {
		existing = await fs$1.lstat(linkPath).catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return null;
			throw error;
		});
		if (existing && !existing.isSymbolicLink() && (params.peerName !== "testclaw" || !existing.isDirectory() || await readPackageName(linkPath) !== "testclaw")) {
			params.logger.warn?.(`Skipping testclaw peerDependency link because ${linkPath} already exists and is not a symlink.`);
			return "skipped";
		}
	} catch (error) {
		return warn(error);
	}
	if (existing) {
		await params.beforePersistentEffect?.();
		params.beforePersistentApply?.();
		try {
			if (existing.isSymbolicLink()) unlinkSync(linkPath);
			else await fs$1.rm(linkPath, {
				recursive: true,
				force: true
			});
		} catch (error) {
			return warn(error);
		}
	}
	await params.beforePersistentEffect?.();
	params.beforePersistentApply?.();
	try {
		symlinkSync(params.hostRoot, linkPath, "junction");
		params.logger.info?.(`Linked peerDependency "${params.peerName}" -> ${params.hostRoot}`);
		return "linked";
	} catch (error) {
		return warn(error);
	}
}
async function readPackageName(packageDir) {
	const manifest = await readSafePackageManifest(packageDir);
	return typeof manifest?.name === "string" ? manifest.name : void 0;
}
/**
* Symlink the host testclaw package for plugins that declare it as a dependency.
* Plugin package managers still own third-party dependencies; this only wires
* the host SDK package into the plugin-local Node graph.
*/
async function linkAssistantPeerDependencies(params) {
	const peers = Object.keys(params.peerDependencies).filter((name) => name === "testclaw");
	if (peers.length === 0) return {
		repaired: 0,
		skipped: 0
	};
	const hostRoot = params.hostRoot ?? resolveAssistantPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) {
		params.logger.warn?.("Could not locate testclaw package root to symlink peerDependencies; plugin may fail to resolve testclaw at runtime.");
		return {
			repaired: 0,
			skipped: peers.length
		};
	}
	let repaired = 0;
	let skipped = 0;
	for (const peerName of peers) {
		const result = await linkAssistantPeerDependency({
			hostRoot,
			installedDir: params.installedDir,
			peerName,
			logger: params.logger,
			beforePersistentApply: params.beforePersistentApply,
			beforePersistentEffect: params.beforePersistentEffect
		});
		if (result === "linked") repaired += 1;
		else if (result === "skipped") skipped += 1;
	}
	return {
		repaired,
		skipped
	};
}
/**
* Repair registry-owned installs named by the authoritative install ledger.
* Local/path installs and symlink escapes remain developer-owned and are never mutated.
*/
async function reconcileRegisteredAssistantHostLinks(params) {
	const extensionsRoot = path.resolve(params.extensionsDir);
	const extensionsRootRealPath = await safeRealpath(extensionsRoot);
	if (!extensionsRootRealPath) return {
		checked: 0,
		repaired: 0,
		skipped: 0,
		issues: []
	};
	let checked = 0;
	let repaired = 0;
	let skipped = 0;
	const issues = [];
	for (const [pluginId, record] of Object.entries(params.installRecords).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (record.source !== "npm" && record.source !== "clawhub" || !record.installPath?.trim()) continue;
		let packageDir;
		let expectedPackageDir;
		try {
			packageDir = path.resolve(resolveUserPath(record.installPath, params.env));
			expectedPackageDir = path.resolve(resolvePluginInstallDir(pluginId, extensionsRoot));
		} catch {
			continue;
		}
		if (packageDir !== expectedPackageDir) continue;
		const packageRealPath = await safeRealpath(packageDir);
		const expectedPackageRealPath = path.join(extensionsRootRealPath, path.relative(extensionsRoot, expectedPackageDir));
		if (!packageRealPath || !isPathInside(extensionsRootRealPath, packageRealPath) || packageRealPath !== expectedPackageRealPath) continue;
		let dependencies;
		try {
			dependencies = await readPackageAssistantLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			skipped += 1;
			continue;
		}
		if (!Object.hasOwn(dependencies, "testclaw")) continue;
		checked += 1;
		const issue = await auditAssistantPeerDependencyLink({
			packageDir,
			packageName: pluginId
		});
		if (!issue) continue;
		issues.push(issue);
		if (params.mode !== "repair") continue;
		const result = await linkAssistantPeerDependencies({
			installedDir: packageDir,
			peerDependencies: dependencies,
			logger: params.logger ?? {},
			beforePersistentApply: params.beforePersistentApply,
			beforePersistentEffect: params.beforePersistentEffect
		});
		repaired += result.repaired;
		skipped += result.skipped;
	}
	return {
		checked,
		repaired,
		skipped,
		issues
	};
}
async function relinkAssistantPeerDependenciesInManagedNpmRoot(params) {
	let checked = 0;
	let attempted = 0;
	let repaired = 0;
	let skipped = 0;
	for (const packageDir of await listManagedNpmRootPackageDirs(params.npmRoot)) {
		let testClawLinkDependencies;
		try {
			testClawLinkDependencies = await readPackageAssistantLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			skipped += 1;
			continue;
		}
		if (!Object.hasOwn(testClawLinkDependencies, "testclaw")) continue;
		checked += 1;
		const result = await linkAssistantPeerDependencies({
			installedDir: packageDir,
			peerDependencies: testClawLinkDependencies,
			logger: params.logger,
			beforePersistentApply: params.beforePersistentApply,
			beforePersistentEffect: params.beforePersistentEffect
		});
		attempted += 1;
		repaired += result.repaired;
		skipped += result.skipped;
	}
	return {
		checked,
		attempted,
		repaired,
		skipped
	};
}
async function auditAssistantPeerDependenciesInManagedNpmRoot(params) {
	const hostRoot = resolveAssistantPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	});
	if (!hostRoot) return {
		checked: 0,
		broken: 0,
		issues: []
	};
	let checked = 0;
	const issues = [];
	for (const packageDir of await listManagedNpmRootPackageDirs(params.npmRoot)) {
		let testClawLinkDependencies;
		try {
			testClawLinkDependencies = await readPackageAssistantLinkDependencies(packageDir);
		} catch (error) {
			if (!params.onPackageReadError) throw error;
			params.onPackageReadError(error, packageDir);
			continue;
		}
		if (!Object.hasOwn(testClawLinkDependencies, "testclaw")) continue;
		checked += 1;
		const issue = auditAssistantPeerDependency({
			hostRoot,
			npmRoot: params.npmRoot,
			packageDir
		});
		if (issue) issues.push(issue);
	}
	return {
		checked,
		broken: issues.length,
		issues
	};
}
//#endregion
export { linkAssistantPeerDependencies as a, resolveAssistantHostDependency as c, auditAssistantPeerDependencyLinkSync as i, listNpmPackageDirs as l, auditAssistantPeerDependenciesInManagedNpmRoot as n, reconcileRegisteredAssistantHostLinks as o, auditAssistantPeerDependencyLink as r, relinkAssistantPeerDependenciesInManagedNpmRoot as s, auditDeclaredAssistantHostDependency as t };
