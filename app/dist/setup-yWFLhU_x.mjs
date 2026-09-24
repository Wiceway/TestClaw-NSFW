import "./utils-Dy46mFy2.mjs";
import "./session-key-C_bfgyCp.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import "./detect-binary-DF--Y8NG.mjs";
import "./setup-helpers-C6b_Q_ZP.mjs";
import "./setup-wizard-helpers-Cl2paH-l.mjs";
import "./setup-credential-BgjPJidz.mjs";
//#region src/plugin-sdk/resolution-notes.ts
/** Format a short note that separates successfully resolved targets from unresolved passthrough values. */
function formatResolvedUnresolvedNote(params) {
	if (params.resolved.length === 0 && params.unresolved.length === 0) return;
	return [params.resolved.length > 0 ? `Resolved: ${params.resolved.join(", ")}` : void 0, params.unresolved.length > 0 ? `Unresolved (kept as typed): ${params.unresolved.join(", ")}` : void 0].filter(Boolean).join("\n");
}
//#endregion
export { formatResolvedUnresolvedNote as t };
