//#region src/plugin-sdk/widget-html.ts
/** Public static assets available to widget documents; never a connect-src grant. */
const WIDGET_CDN_ORIGINS = Object.freeze([
	"https://cdnjs.cloudflare.com",
	"https://cdn.jsdelivr.net",
	"https://esm.sh",
	"https://unpkg.com",
	"https://fonts.googleapis.com",
	"https://fonts.gstatic.com",
	"https://fonts.bunny.net"
]);
/** Input error surfaced by tools that accept agent-supplied widget HTML. */
var WidgetHtmlInputError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ToolInputError";
	}
};
/** Enforces a widget HTML size limit while preserving the caller's input label and unit. */
function assertWidgetHtmlSize(html, maxSize, options = {}) {
	const inputName = options.inputName ?? "html";
	const unit = options.unit ?? "bytes";
	if ((unit === "bytes" ? new TextEncoder().encode(html).byteLength : html.length) > maxSize) throw new WidgetHtmlInputError(`${inputName} exceeds maximum size (${maxSize} ${unit})`);
}
//#endregion
//#region src/shared/widget-media.ts
/** Playback sources for Canvas widgets; these do not grant script or API access. */
const WIDGET_MEDIA_SOURCES = Object.freeze(["https:", "blob:"]);
//#endregion
export { assertWidgetHtmlSize as i, WIDGET_CDN_ORIGINS as n, WidgetHtmlInputError as r, WIDGET_MEDIA_SOURCES as t };
