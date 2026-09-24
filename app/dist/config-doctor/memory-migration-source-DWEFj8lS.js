import { g as readRegularFile } from "./fs-safe-CZ3jhUUr.js";
import crypto from "node:crypto";
//#region src/plugin-sdk/memory-migration-source.ts
const MAX_MEMORY_MIGRATION_FILE_BYTES = 67108864;
/** Bind copyable memory items to the exact source bytes reviewed by an embedded migration UI. */
async function bindMemoryMigrationPlanSources(plan, opts = {}) {
	const items = [];
	for (const item of plan.items) {
		if (item.kind !== "memory" || item.action !== "copy" || item.status !== "planned" && !(opts.includeConflicts && item.status === "conflict") || !item.source) {
			items.push(item);
			continue;
		}
		const { buffer } = await readRegularFile({
			filePath: item.source,
			maxBytes: MAX_MEMORY_MIGRATION_FILE_BYTES
		});
		items.push({
			...item,
			sourceRevision: {
				algorithm: "sha256",
				digest: crypto.createHash("sha256").update(buffer).digest("hex")
			}
		});
	}
	return {
		...plan,
		items
	};
}
//#endregion
export { bindMemoryMigrationPlanSources as t };
