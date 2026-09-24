import { l as isThemeId, u as normalizeThemeMode } from "./theme-D-KLkk4a.js";
//#region packages/gateway-protocol/src/schema/ui-appearance-typefaces.ts
const UI_APPEARANCE_TYPEFACE_VALUES = [
	"instrument-sans",
	"geist",
	"dm-sans",
	"ibm-plex-sans",
	"space-grotesk",
	"atkinson-hyperlegible",
	"fraunces",
	"lora",
	"jetbrains-mono",
	"system"
];
//#endregion
//#region packages/gateway-protocol/src/schema/ui-appearance-preferences.ts
const UI_APPEARANCE_PREFERENCE_KEYS = {
	theme: "ui.theme",
	themeMode: "ui.themeMode",
	accent: "ui.accent",
	fontUi: "ui.fontUi",
	fontChat: "ui.fontChat"
};
const UI_APPEARANCE_TYPEFACES = new Set(UI_APPEARANCE_TYPEFACE_VALUES);
function normalizeUiAppearancePreference(key, value) {
	if (typeof value !== "string") return;
	if (key === UI_APPEARANCE_PREFERENCE_KEYS.accent) return value === "theme" || /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : void 0;
	if (key === UI_APPEARANCE_PREFERENCE_KEYS.fontUi || key === UI_APPEARANCE_PREFERENCE_KEYS.fontChat) return UI_APPEARANCE_TYPEFACES.has(value) ? value : void 0;
	if (key === UI_APPEARANCE_PREFERENCE_KEYS.theme) return isThemeId(value) ? value : void 0;
	return normalizeThemeMode(value);
}
//#endregion
export { normalizeUiAppearancePreference as n, UI_APPEARANCE_PREFERENCE_KEYS as t };
