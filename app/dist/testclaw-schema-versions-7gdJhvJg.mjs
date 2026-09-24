//#region src/state/testclaw-schema-versions.ts
function parseAssistantSchemaVersions(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	if (!Number.isInteger(record.state) || record.state < 0 || !Number.isInteger(record.agent) || record.agent < 0) return;
	return {
		state: record.state,
		agent: record.agent
	};
}
function parsePackageAssistantSchemaVersions(packageJson) {
	if (!packageJson || typeof packageJson !== "object" || Array.isArray(packageJson)) return;
	const manifest = packageJson;
	const testclaw = manifest.testclaw;
	if (testclaw !== void 0) {
		if (!testclaw || typeof testclaw !== "object" || Array.isArray(testclaw)) return;
		const schemaVersions = testclaw.schemaVersions;
		if (schemaVersions !== void 0) return parseAssistantSchemaVersions(schemaVersions);
	}
	if (manifest.name !== "testclaw" || typeof manifest.version !== "string") return;
	const legacy = /^2026\.([1-7])\.([1-9]\d*)$/.exec(manifest.version);
	if (!legacy || !Number.isSafeInteger(Number(legacy[2])) || legacy[1] === "7" && legacy[2] !== "1") return;
	return {
		state: 1,
		agent: 1
	};
}
//#endregion
export { parseAssistantSchemaVersions as n, parsePackageAssistantSchemaVersions as t };
