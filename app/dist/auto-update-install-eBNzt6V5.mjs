import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatErrorMessage } from "./errors-DNLGIg8_.mjs";
import { n as AUTO_UPDATE_STEP_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { r as isExactSemverVersion } from "./npm-registry-spec-B-fX1tYr.mjs";
import { i as runCommandWithTimeout } from "./exec-BddaUUYf.mjs";
import { t as parsePackageAssistantSchemaVersions } from "./testclaw-schema-versions-7gdJhvJg.mjs";
import { c as withInstallWorkspace, i as packNpmSpecToArchive, s as resolveNpmSpecMetadata } from "./install-source-utils-Cje4YZy0.mjs";
import { O as resolveNpmGlobalPrefixLayoutFromPrefix, c as collectInstalledGlobalPackageErrors, i as runStep, l as createGlobalInstallEnv, v as resolveGlobalInstallTarget } from "./update-runner-command-Dn-V6rM4.mjs";
import { n as collectPackageDistContentInventoryErrors } from "./package-dist-inventory-DnyC80Ez.mjs";
import { s as withUpdateCommandExecutor } from "./update-command-executor-C_9Me3Ow.mjs";
import { t as runGlobalPackageUpdateSteps } from "./package-update-steps-DnzimNpq.mjs";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-BnxQJHd5.mjs";
import { n as assertNodeRuntimeUpdateCompatible, r as readNodeRuntimeUpdateManifest, t as assertNodeRuntimeSchemaVersions } from "./auto-update-compatibility-D4jc6klw.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/node-host/auto-update-install.ts
/** Install only into an immutable private generation; activation belongs to the node launcher. */
async function prepareNodeRuntimeUpdate(params) {
	const version = params.targetVersion.trim();
	if (!isExactSemverVersion(version) || /[\\/]/u.test(version)) throw new Error("Node auto-update requires an exact published Assistant version.");
	params.signal?.throwIfAborted();
	const spec = `testclaw@${version}`;
	const resolved = await resolveNpmSpecMetadata({
		spec,
		signal: params.signal
	});
	if (!resolved.ok) throw new Error(resolved.error);
	const { metadata } = resolved;
	if (metadata.name !== "testclaw" || metadata.version !== version || !metadata.integrity) throw new Error("Node auto-update registry metadata does not identify the requested release and integrity.");
	assertNodeRuntimeSchemaVersions(parsePackageAssistantSchemaVersions({
		name: metadata.name,
		version: metadata.version,
		testclaw: metadata.packageAssistant
	}));
	const integrity = metadata.integrity;
	const digest = createHash("sha256").update(integrity).digest("hex");
	const runtimeRoot = path.resolve(params.stateDir, "node-runtime", "releases", `${version}-${digest}`);
	const prepareGeneration = async (generationRoot) => {
		const layout = resolveNpmGlobalPrefixLayoutFromPrefix(generationRoot);
		const packageRoot = path.join(layout.globalRoot, "testclaw");
		const prepared = {
			runtimeRoot: generationRoot,
			packageRoot,
			version,
			integrity
		};
		return await withUpdateCommandExecutor(randomUUID(), async (executor) => {
			const fence = await executor.enter(generationRoot);
			const assertCurrent = () => {
				fence.assertCurrent();
				params.signal?.throwIfAborted();
			};
			assertCurrent();
			let retained = false;
			try {
				await fs.lstat(packageRoot);
				retained = true;
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
			}
			if (retained) {
				try {
					const errors = [...await collectInstalledGlobalPackageErrors({
						packageRoot,
						expectedVersion: version
					}), ...await collectPackageDistContentInventoryErrors(packageRoot)];
					if (errors.length) throw new Error(errors.join("; "));
					await readNodeRuntimeUpdateManifest(packageRoot);
				} catch (error) {
					assertCurrent();
					return { invalidRuntime: `Preserved invalid node runtime at ${generationRoot}: ${formatErrorMessage(error)}` };
				}
				await assertNodeRuntimeUpdateCompatible({
					...params,
					packageRoot
				});
				assertCurrent();
				return prepared;
			}
			return await withInstallWorkspace("testclaw-node-update-", async (workspace) => {
				assertCurrent();
				const packed = await packNpmSpecToArchive({
					spec,
					cwd: workspace,
					timeoutMs: AUTO_UPDATE_STEP_TIMEOUT_MS,
					signal: params.signal
				});
				assertCurrent();
				if (!packed.ok) throw new Error(packed.error);
				if (packed.metadata.name !== "testclaw" || packed.metadata.version !== version) throw new Error("Node auto-update archive does not match the requested release.");
				const drift = await resolveNpmIntegrityDriftWithDefaultMessage({
					spec,
					expectedIntegrity: integrity,
					resolution: packed.metadata
				});
				if (drift.error) throw new Error(drift.error);
				const env = await createGlobalInstallEnv({
					...process.env,
					TESTCLAW_STATE_DIR: path.join(workspace, "state"),
					TESTCLAW_CONFIG_PATH: path.join(workspace, "testclaw.json")
				});
				const runCommand = async (argv, options) => {
					assertCurrent();
					const result = await runCommandWithTimeout(argv, {
						...options,
						env: {
							...env,
							...options.env
						},
						signal: params.signal,
						killProcessTree: true
					});
					assertCurrent();
					return result;
				};
				const installTarget = await resolveGlobalInstallTarget({
					manager: "npm",
					runCommand,
					timeoutMs: AUTO_UPDATE_STEP_TIMEOUT_MS,
					pkgRoot: packageRoot,
					honorPackageRoot: true,
					packageName: "testclaw"
				});
				if (installTarget.manager !== "npm" || installTarget.packageRoot !== packageRoot || installTarget.globalRoot !== layout.globalRoot) throw new Error("Node auto-update npm target escaped its private runtime prefix.");
				assertCurrent();
				const result = await runGlobalPackageUpdateSteps({
					installTarget,
					installSpec: packed.archivePath,
					packageName: "testclaw",
					runCommand,
					runStep: (step) => runStep({
						...step,
						runCommand,
						cwd: step.cwd ?? workspace,
						stepIndex: 0,
						totalSteps: 0
					}),
					timeoutMs: AUTO_UPDATE_STEP_TIMEOUT_MS,
					env,
					installCwd: workspace,
					assertCurrent,
					validateCandidate: async (candidateRoot) => {
						if ((await readNodeRuntimeUpdateManifest(candidateRoot)).version !== version) throw new Error("Node auto-update installed an unexpected package version.");
						await assertNodeRuntimeUpdateCompatible({
							...params,
							packageRoot: candidateRoot
						});
						assertCurrent();
						return [];
					}
				});
				assertCurrent();
				if (result.failedStep || result.activePackageRoot !== packageRoot || result.afterVersion !== version) throw new Error(result.failedStep?.stderrTail ?? "Node auto-update private installation could not be verified.");
				return prepared;
			});
		});
	};
	const initial = await prepareGeneration(runtimeRoot);
	if (!("invalidRuntime" in initial)) return initial;
	try {
		const replacement = await prepareGeneration(`${runtimeRoot}-${randomUUID()}`);
		if ("invalidRuntime" in replacement) throw new Error(replacement.invalidRuntime);
		return {
			...replacement,
			warnings: [initial.invalidRuntime]
		};
	} catch (cause) {
		throw new Error(`${initial.invalidRuntime}; fresh installation failed: ${formatErrorMessage(cause)}`, { cause });
	}
}
//#endregion
export { prepareNodeRuntimeUpdate };
