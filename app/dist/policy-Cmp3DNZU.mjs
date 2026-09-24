import { r as resolveHookKey } from "./frontmatter-B6HWYTlp.mjs";
//#region src/hooks/policy.ts
const HOOK_SOURCE_PRECEDENCE = {
	"testclaw-bundled": 10,
	"testclaw-plugin": 20,
	"testclaw-managed": 30,
	"testclaw-workspace": 40
};
/** Resolve explicit per-hook config by hook key. */
function resolveHookConfig(config, hookKey) {
	const hooks = config?.hooks?.internal?.entries;
	if (!hooks || typeof hooks !== "object") return;
	const entry = hooks[hookKey];
	if (!entry || typeof entry !== "object") return;
	return entry;
}
/** Resolve whether a hook is enabled before runtime requirement checks. */
function resolveHookEnableState(params) {
	const { entry, config } = params;
	const hookKey = resolveHookKey(entry.hook.name, entry);
	const hookConfig = params.hookConfig ?? resolveHookConfig(config, hookKey);
	if (entry.hook.source === "testclaw-plugin") return { enabled: true };
	if (hookConfig?.enabled === false) return {
		enabled: false,
		reason: "disabled in config"
	};
	if (entry.hook.source === "testclaw-workspace" && hookConfig?.enabled !== true) return {
		enabled: false,
		reason: "workspace hook (disabled by default)"
	};
	return { enabled: true };
}
/** Merge hook entries by name using source precedence and override policy. */
function resolveHookEntries(entries, opts) {
	const ordered = entries.map((entry, index) => ({
		entry,
		index
	})).toSorted((a, b) => {
		const precedenceDelta = HOOK_SOURCE_PRECEDENCE[a.entry.hook.source] - HOOK_SOURCE_PRECEDENCE[b.entry.hook.source];
		return precedenceDelta !== 0 ? precedenceDelta : a.index - b.index;
	});
	const merged = /* @__PURE__ */ new Map();
	for (const { entry } of ordered) {
		const existing = merged.get(entry.hook.name);
		if (!existing) {
			merged.set(entry.hook.name, entry);
			continue;
		}
		const sameSource = entry.hook.source === existing.hook.source;
		if (entry.hook.source === "testclaw-workspace" ? sameSource : !sameSource || entry.hook.source === "testclaw-managed") {
			merged.set(entry.hook.name, entry);
			continue;
		}
		opts?.onCollisionIgnored?.({
			name: entry.hook.name,
			kept: existing,
			ignored: entry
		});
	}
	return Array.from(merged.values());
}
//#endregion
export { resolveHookEnableState as n, resolveHookEntries as r, resolveHookConfig as t };
