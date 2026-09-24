//#region src/auto-reply/reply/context-text.ts
/** Resolves normalized text for slash/bang command parsing. */
function resolveCommandContextText(ctx) {
	return ctx.commandText.trim();
}
//#endregion
export { resolveCommandContextText as t };
