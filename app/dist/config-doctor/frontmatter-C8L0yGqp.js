import { g as readStringValue } from "./string-coerce-CIXf7egm.js";
import { a as parseAssistantManifestInstallBase, c as resolveAssistantManifestOs, d as parseFrontmatterBlock, i as parseFrontmatterBool, l as resolveAssistantManifestRequires, n as getFrontmatterString, o as resolveAssistantManifestBlock, r as normalizeStringList, s as resolveAssistantManifestInstall, t as applyAssistantManifestInstallCommonFields } from "./frontmatter-CvTr0Utu.js";
//#region src/hooks/frontmatter.ts
/** Parse HOOK.md frontmatter into the generic hook frontmatter record. */
function parseHookFrontmatter(content) {
	return parseFrontmatterBlock(content);
}
function parseInstallSpec(input) {
	const parsed = parseAssistantManifestInstallBase(input, [
		"bundled",
		"npm",
		"git"
	]);
	if (!parsed) return;
	const { raw } = parsed;
	const spec = applyAssistantManifestInstallCommonFields({ kind: parsed.kind }, parsed);
	if (typeof raw.package === "string") spec.package = raw.package;
	if (typeof raw.repository === "string") spec.repository = raw.repository;
	return spec;
}
/** Resolve Assistant hook metadata from the manifest block in HOOK.md frontmatter. */
function resolveHookManifestMetadata(frontmatter) {
	const metadataObj = resolveAssistantManifestBlock({ frontmatter });
	if (!metadataObj) return;
	const requires = resolveAssistantManifestRequires(metadataObj);
	const install = resolveAssistantManifestInstall(metadataObj, parseInstallSpec);
	const osRaw = resolveAssistantManifestOs(metadataObj);
	const eventsRaw = normalizeStringList(metadataObj.events);
	return {
		always: typeof metadataObj.always === "boolean" ? metadataObj.always : void 0,
		emoji: readStringValue(metadataObj.emoji),
		homepage: readStringValue(metadataObj.homepage),
		hookKey: readStringValue(metadataObj.hookKey),
		export: readStringValue(metadataObj.export),
		os: osRaw.length > 0 ? osRaw : void 0,
		events: eventsRaw.length > 0 ? eventsRaw : [],
		requires,
		install: install.length > 0 ? install : void 0
	};
}
/** Resolve invocation policy from top-level hook frontmatter flags. */
function resolveHookInvocationPolicy(frontmatter) {
	return { enabled: parseFrontmatterBool(getFrontmatterString(frontmatter, "enabled"), true) };
}
/** Resolve the config key for a hook, honoring metadata hookKey overrides. */
function resolveHookKey(hookName, entry) {
	return entry?.metadata?.hookKey ?? hookName;
}
//#endregion
export { resolveHookManifestMetadata as i, resolveHookInvocationPolicy as n, resolveHookKey as r, parseHookFrontmatter as t };
