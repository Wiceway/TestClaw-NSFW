import { i as normalizeLegacyDotBetaVersion, r as isAssistantCorrectionSemver, t as compareAssistantSemver } from "./semver-BiH_OTew.mjs";
import { parse } from "semver";
//#region src/config/version.ts
/** Parses stable, prerelease, and legacy dot-beta Assistant versions. */
function parseAssistantVersion(raw) {
	if (!raw) return null;
	const normalized = normalizeLegacyDotBetaVersion(raw.trim());
	return parse(normalized);
}
function normalizeAssistantVersionBase(raw) {
	const parsed = parseAssistantVersion(raw);
	if (!parsed) return null;
	return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
}
function compareAssistantVersions(a, b) {
	const parsedA = parseAssistantVersion(a);
	const parsedB = parseAssistantVersion(b);
	if (!parsedA || !parsedB) return null;
	return compareAssistantSemver(parsedA, parsedB);
}
function shouldWarnOnTouchedVersion(current, touched) {
	const parsedCurrent = parseAssistantVersion(current);
	const parsedTouched = parseAssistantVersion(touched);
	if (parsedCurrent && parsedTouched && parsedCurrent.compareMain(parsedTouched) === 0) {
		if (parsedTouched.prerelease.length === 0 || isAssistantCorrectionSemver(parsedTouched)) return false;
	}
	return parsedCurrent !== null && parsedTouched !== null ? compareAssistantSemver(parsedCurrent, parsedTouched) < 0 : false;
}
//#endregion
export { normalizeAssistantVersionBase as n, shouldWarnOnTouchedVersion as r, compareAssistantVersions as t };
