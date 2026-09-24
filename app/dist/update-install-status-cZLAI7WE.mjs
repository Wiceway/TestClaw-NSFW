import { n as resolveAssistantPackageRoot } from "./testclaw-root-CayS889k.mjs";
import { y as readVerifiedGitUpdateReceipt } from "./restart-sentinel-Csb-WRIg.mjs";
import { n as updateInstallRootsMatch } from "./update-install-root-Cdtzz5MM.mjs";
import { t as checkUpdateStatus } from "./update-check-iRYMjMOk.mjs";
//#region src/infra/update-install-status.ts
async function resolveStartupInstallStatus(fetchRemoteGit, signal) {
	const [root, installReceipt] = await Promise.all([resolveAssistantPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	}), readVerifiedGitUpdateReceipt()]);
	const gitUpstreamFallback = installReceipt?.upstreamRef && root && updateInstallRootsMatch(root, installReceipt.root) ? {
		currentSha: installReceipt.sha,
		upstreamRef: installReceipt.upstreamRef
	} : void 0;
	const status = await checkUpdateStatus({
		root,
		signal,
		...fetchRemoteGit ? {} : { timeoutMs: 2500 },
		fetchGit: fetchRemoteGit,
		includeRegistry: false,
		...fetchRemoteGit ? { useDetachedDevUpstream: true } : {},
		...gitUpstreamFallback ? { gitUpstreamFallback } : {}
	});
	signal.throwIfAborted();
	return {
		root,
		status,
		installReceipt
	};
}
//#endregion
export { resolveStartupInstallStatus as t };
