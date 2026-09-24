import { n as resolveAssistantPackageRoot } from "./testclaw-root-CayS889k.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/docs-path.ts
/**
* Locates local Assistant docs/source roots for references shown to agents.
*/
const TESTCLAW_DOCS_URL = "https://docs.testclaw.ai";
const TESTCLAW_SOURCE_URL = "https://github.com/testclaw/testclaw";
function isUsableDocsDir(docsDir) {
	return fs.existsSync(path.join(docsDir, "docs.json"));
}
function isGitCheckout(rootDir) {
	return fs.existsSync(path.join(rootDir, ".git"));
}
/** Resolve a usable local docs directory, preferring the active workspace. */
async function resolveAssistantDocsPath(params) {
	const workspaceDir = params.workspaceDir?.trim();
	if (workspaceDir) {
		const workspaceDocs = path.join(workspaceDir, "docs");
		if (isUsableDocsDir(workspaceDocs)) return workspaceDocs;
	}
	const packageRoot = await resolveAssistantPackageRoot({
		cwd: params.cwd,
		argv1: params.argv1,
		moduleUrl: params.moduleUrl
	});
	if (!packageRoot) return null;
	const packageDocs = path.join(packageRoot, "docs");
	return isUsableDocsDir(packageDocs) ? packageDocs : null;
}
/** Resolve the package root only when it is a Git checkout. */
async function resolveAssistantSourcePath(params) {
	const packageRoot = await resolveAssistantPackageRoot({
		cwd: params.cwd,
		argv1: params.argv1,
		moduleUrl: params.moduleUrl
	});
	if (!packageRoot || !isGitCheckout(packageRoot)) return null;
	return packageRoot;
}
/** Resolve docs and source roots concurrently for prompt/reference injection. */
async function resolveAssistantReferencePaths(params) {
	const [docsPath, sourcePath] = await Promise.all([resolveAssistantDocsPath(params), resolveAssistantSourcePath(params)]);
	return {
		docsPath,
		sourcePath
	};
}
//#endregion
export { TESTCLAW_SOURCE_URL as n, resolveAssistantReferencePaths as r, TESTCLAW_DOCS_URL as t };
