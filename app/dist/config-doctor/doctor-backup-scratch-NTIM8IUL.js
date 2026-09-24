import { t as note } from "./note-Dc3h_SGh.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { t as readBackupArchiveDirectories } from "./backup-run-records-Dbe-4jq9.js";
import { r as maintainBackupScratch } from "./backup-scratch-DhyKnfqR.js";
import os from "node:os";
//#region src/commands/doctor-backup-scratch.ts
async function noteBackupScratchHealth(env, shouldRepair) {
	const roots = [os.tmpdir()];
	try {
		roots.push(...readBackupArchiveDirectories(env));
	} catch (error) {
		note(`Cannot discover recorded backup scratch locations: ${formatErrorMessage(error)}`, "Backups");
	}
	const report = await maintainBackupScratch({
		roots,
		repair: shouldRepair
	});
	const lines = [
		...report.unchecked.map((directory) => `Backup scratch awaiting lifecycle check: ${directory}. Run \`testclaw doctor --fix\` to remove it if abandoned.`),
		...report.reclaimed.map((directory) => `Removed abandoned backup scratch: ${directory}`),
		...report.alreadyReclaimed.map((directory) => `Backup scratch already reclaimed: ${directory}`),
		...report.active.map((directory) => `Kept active backup scratch: ${directory}`),
		...report.warnings
	];
	if (lines.length) note(lines.join("\n"), "Backup scratch");
}
//#endregion
export { noteBackupScratchHealth };
