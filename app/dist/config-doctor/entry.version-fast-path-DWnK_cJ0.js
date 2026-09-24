import { d as isRootVersionInvocation } from "./argv-zmtAhw2-.js";
import { r as resolveCliContainerTarget } from "./container-target-DTEOCkYF.js";
//#region src/entry.version-fast-path.ts
function tryHandleRootVersionFastPath(argv, deps = {}) {
	if (resolveCliContainerTarget(argv, deps.env)) return false;
	if (!isRootVersionInvocation(argv)) return false;
	const output = deps.output ?? ((message) => console.log(message));
	const exit = deps.exit ?? ((code) => process.exit(code));
	const onError = deps.onError ?? (async (error) => {
		const message = `[testclaw] Failed to resolve version: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`;
		try {
			const [{ loadCliDotEnv }, { formatConsoleDiagnosticBlock }] = await Promise.all([import("./dotenv-Bxg-PUHy.js"), import("./json-console-line-By3D7X1N.js")]);
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
		const [{ VERSION }, { resolveCommitHash }] = await Promise.all([import("./version-M0RNbBAa.js"), import("./git-commit-D_cyaWjy.js")]);
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
export { tryHandleRootVersionFastPath };
