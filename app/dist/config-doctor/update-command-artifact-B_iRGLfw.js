import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS } from "./constants-DaCUjVXa.js";
import { n as resolvePreferredAssistantTmpDir } from "./tmp-testclaw-dir-B_iJhgq7.js";
import { _ as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./io.read-helpers-DjrAb5Uv.js";
import { l as createUpdatePreflightFailure } from "./update-failure-facts-CzM99Hgb.js";
import { t as tempWorkspace } from "./private-temp-workspace-DjKgPauH.js";
import { t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-Cm1H0Euq.js";
import { n as parseAssistantSchemaVersions } from "./testclaw-schema-versions-7gdJhvJg.js";
import { n as compareSemverStrings } from "./update-check-D4M5AA5a.js";
import { t as createUpdateProgress } from "./progress-CexvC1Oq.js";
import { o as stagePackageInstallUpdate } from "./update-command-package-4wCnB9RO.js";
import { a as withUpdateInitializationCleanup } from "./update-command-initialization-C_FvXj1B.js";
import path from "node:path";
import fs from "node:fs/promises";
import { valid } from "semver";
//#region src/cli/update-cli/update-command-artifact.ts
/** Candidate hooks may initialize their own profile, never the profile awaiting admission. */
async function withFreshUpdateArtifact(params, use) {
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredAssistantTmpDir(),
		prefix: "testclaw-update-artifact-"
	});
	return await withUpdateInitializationCleanup(async () => {
		const home = workspace.dir;
		const state = path.join(home, "state");
		const tmp = path.join(home, "tmp");
		await fs.mkdir(tmp);
		const env = { ...params.installEnv };
		for (const key of [
			...[...GATEWAY_CONFIG_SELECTION_ENV_KEYS].filter((selector) => selector.startsWith("TESTCLAW_") || selector === "PI_CODING_AGENT_DIR"),
			...GATEWAY_SERVICE_SELECTOR_ENV_KEYS,
			...SUPERVISOR_HINT_ENV_VARS,
			"STATE_DIRECTORY",
			"NODE_COMPILE_CACHE",
			"TESTCLAW_GATEWAY_SERVICE_PID",
			"TESTCLAW_SERVICE_MARKER",
			"TESTCLAW_SERVICE_KIND",
			"TESTCLAW_UPDATE_RUN_ID",
			"TESTCLAW_UPDATE_RUN_HANDOFF",
			"TESTCLAW_CONTROL_PLANE_UPDATE_SENTINEL_META",
			"TESTCLAW_UPDATE_POST_CORE",
			"TESTCLAW_UPDATE_POST_CORE_CHANNEL",
			"TESTCLAW_UPDATE_POST_CORE_RESULT_PATH",
			"TESTCLAW_UPDATE_POST_CORE_INSTALL_RECORDS_PATH",
			"TESTCLAW_UPDATE_POST_CORE_STARTED_AT_MS",
			"TESTCLAW_UPDATE_POST_CORE_REQUESTED_CHANNEL",
			"TESTCLAW_UPDATE_POST_CORE_SOURCE_CONFIG_PATH",
			"TESTCLAW_DIAGNOSTICS_TIMELINE_PATH"
		]) env[key] = void 0;
		Object.assign(env, {
			TESTCLAW_HOME: home,
			TESTCLAW_STATE_DIR: state,
			TESTCLAW_CONFIG_PATH: path.join(state, "testclaw.json"),
			TMPDIR: tmp,
			TMP: tmp,
			TEMP: tmp,
			NODE_DISABLE_COMPILE_CACHE: "1"
		});
		const stage = await stagePackageInstallUpdate({
			...params,
			installEnv: env
		});
		return await withUpdateInitializationCleanup(async () => {
			const manifest = JSON.parse(await fs.readFile(path.join(stage.root, "package.json"), "utf8"));
			return await use({
				stage,
				manifest
			});
		}, () => stage.close());
	}, async () => {
		await workspace.cleanup();
	});
}
/** Explicit artifacts need their own declaration; a familiar version is not provenance. */
function readFreshUpdateArtifactMetadata(manifest) {
	if (!isRecord(manifest) || typeof manifest.version !== "string" || !valid(manifest.version)) return { failure: createUpdatePreflightFailure("target-version-resolution") };
	const schemas = isRecord(manifest.testclaw) ? parseAssistantSchemaVersions(manifest.testclaw.schemaVersions) : void 0;
	if (!schemas) return { failure: createUpdatePreflightFailure("target-schema-metadata") };
	return {
		version: manifest.version,
		schemaVersions: schemas,
		nodeEngine: isRecord(manifest.engines) && typeof manifest.engines.node === "string" ? manifest.engines.node : null
	};
}
/** Bind the inspected artifact to the existing fresh-profile admission flow. */
async function runFreshUpdateArtifact(params, run) {
	const presentation = createUpdateProgress(!params.json);
	const { initialization } = params;
	const { target } = initialization;
	try {
		return await withFreshUpdateArtifact(params.stageParams(presentation.progress), async ({ stage, manifest }) => {
			initialization.stagedPackage = stage;
			const metadata = readFreshUpdateArtifactMetadata(manifest);
			if (metadata.failure) return await target.refuseUpdate("target-metadata-preflight", metadata.failure.message, metadata.failure.failureFacts);
			const comparison = compareSemverStrings(target.currentVersion, metadata.version);
			target.downgradeRisk = comparison !== null && comparison > 0;
			target.packageAlreadyCurrent = false;
			target.targetVersion = metadata.version;
			target.packageTargetSchemaVersions = metadata.schemaVersions;
			target.packageRuntimeTarget = {
				version: metadata.version,
				nodeEngine: metadata.nodeEngine
			};
			return await run();
		});
	} finally {
		presentation.dispose();
	}
}
//#endregion
export { runFreshUpdateArtifact };
