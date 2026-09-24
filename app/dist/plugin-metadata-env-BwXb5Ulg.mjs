import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { l as shouldTrustTestBundledPluginsDirOverride } from "./bundled-dir-Bmn6z9c1.mjs";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-D3iH83cN.mjs";
import { P as hashJson } from "./discovery-Beqghw38.mjs";
//#region src/plugins/plugin-metadata-env.ts
const PLUGIN_METADATA_ENV_KEYS = [
	"ANDROID_DATA",
	"APPDATA",
	"HOME",
	"TESTCLAW_BUNDLED_PLUGINS_DIR",
	"TESTCLAW_COMPATIBILITY_HOST_VERSION",
	"TESTCLAW_CONFIG_PATH",
	"TESTCLAW_DEV_SOURCE_ROOT",
	"TESTCLAW_DISABLE_BUNDLED_PLUGINS",
	"TESTCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS",
	"TESTCLAW_HOME",
	"TESTCLAW_NIX_MODE",
	"TESTCLAW_STATE_DIR",
	"PREFIX",
	"USERPROFILE",
	"XDG_CONFIG_HOME"
];
/** Compares discovery namespaces without resolving or probing filesystem roots. */
function resolvePluginMetadataEnvFingerprint(env = process.env) {
	return hashJson({
		env: Object.fromEntries(PLUGIN_METADATA_ENV_KEYS.flatMap((key) => {
			const value = env[key];
			return value === void 0 ? [] : [[key, value]];
		})),
		installRoots: hasActivePluginInstallRoots() ? resolveActivePluginInstallRoots() : void 0,
		trustBundledPluginsDirOverride: shouldTrustTestBundledPluginsDirOverride(env),
		cwd: tryProcessCwd()
	});
}
//#endregion
export { resolvePluginMetadataEnvFingerprint as t };
