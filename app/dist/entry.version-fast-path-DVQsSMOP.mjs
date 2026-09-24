import { d as isRootVersionInvocation } from "./argv-Wc3zbgLD.mjs";
import { r as resolveCliContainerTarget } from "./container-target-BILBNY5T.mjs";
//#region src/entry.version-fast-path.ts
function tryHandleRootVersionFastPath(argv, deps = {}) {
	if (resolveCliContainerTarget(argv, deps.env)) return false;
	if (!isRootVersionInvocation(argv)) return false;
	const output = deps.output ?? ((message) => console.log(message));
	const exit = deps.exit ?? ((code) => process.exit(code));
	const onError = deps.onError ?? (async (error) => {
		const message = `[testclaw] Failed to resolve version: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`;
		try {
			const [{ loadCliDotEnv }, { formatConsoleDiagnosticBlock }] = await Promise.all([import("./dotenv-DwbC6iDO.mjs"), import("./json-console-line-DVN28Wiz.mjs")]);
			loadCliDotEnv({ quiet: true });
			process.stderr.write(formatConsoleDiagnosticBlock({
				level: "error",
				message
			}));
		} catch {
			process.stderr.write(message);
		} finally {
			exit(1);
		}
	});
	(deps.resolveVersion ?? (async () => {
		const [{ VERSION }, { resolveCommitHash }] = await Promise.all([import("./version-MfjpiZAe.mjs"), import("./git-commit-DB-F8tah.mjs")]);
		return {
			VERSION,
			resolveCommitHash
		};
	}))().then(({ VERSION, resolveCommitHash }) => {
		const commit = resolveCommitHash({ moduleUrl: deps.moduleUrl ?? import.meta.url });
		output(commit ? `Assistant ${VERSION} (${commit})` : `Assistant ${VERSION}`);
		exit(0);
	}).catch(onError);
	return true;
}
//#endregion
export { tryHandleRootVersionFastPath as t };
