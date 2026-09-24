import { compareBuild, parse } from "semver";
//#region src/infra/semver.ts
function compareValidSemver(left, right) {
	const parsedLeft = parse(left);
	const parsedRight = parse(right);
	return parsedLeft && parsedRight ? parsedLeft.compare(parsedRight) : null;
}
function isAssistantCorrectionSemver(version) {
	return version.prerelease.length === 1 && typeof version.prerelease[0] === "number";
}
function toAssistantComparableVersion(version) {
	if (isAssistantCorrectionSemver(version)) return `${version.major}.${version.minor}.${version.patch}+${version.prerelease[0]}`;
	return version.version;
}
/** Compares prereleases, stable releases, then Assistant numeric corrections. */
function compareAssistantSemver(left, right) {
	return compareBuild(toAssistantComparableVersion(left), toAssistantComparableVersion(right));
}
/** Converts legacy Assistant `1.2.3.beta.N` tags into valid SemVer prereleases. */
function normalizeLegacyDotBetaVersion(version) {
	const trimmed = version.trim();
	const dotBetaMatch = /^([vV]?[0-9]+\.[0-9]+\.[0-9]+)\.beta(?:\.([0-9A-Za-z.-]+))?$/.exec(trimmed);
	if (!dotBetaMatch) return trimmed;
	const base = dotBetaMatch[1];
	const suffix = dotBetaMatch[2];
	return suffix ? `${base}-beta.${suffix}` : `${base}-beta`;
}
//#endregion
export { normalizeLegacyDotBetaVersion as i, compareValidSemver as n, isAssistantCorrectionSemver as r, compareAssistantSemver as t };
