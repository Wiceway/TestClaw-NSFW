import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./paths-DeOFr7iP.js";
import "./types.secrets-K95Dlap_.js";
import "./io.snapshot-Dbj6l_ZW.js";
import "./types.models-C2SClTy5.js";
import "./runtime-snapshot-DTssNCAN.js";
import "./config-write-guard-Cw44ic16.js";
import "./io.snapshot-preparation-BEHQru7Z.js";
import "./io-BXuoCABW.js";
import "./mutate-CFZDg_sD.js";
//#region src/config/types.tools.ts
const TOOLS_BY_SENDER_KEY_TYPES = [
	"channel",
	"id",
	"e164",
	"username",
	"name"
];
function parseToolsBySenderTypedKey(rawKey) {
	const trimmed = rawKey.trim();
	if (!trimmed) return;
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	for (const type of TOOLS_BY_SENDER_KEY_TYPES) {
		const prefix = `${type}:`;
		if (!lowered.startsWith(prefix)) continue;
		return {
			type,
			value: trimmed.slice(prefix.length)
		};
	}
}
//#endregion
export { parseToolsBySenderTypedKey as n, TOOLS_BY_SENDER_KEY_TYPES as t };
