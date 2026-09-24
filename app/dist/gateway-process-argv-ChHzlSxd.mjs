import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
//#region src/infra/gateway-process-argv.ts
function normalizeProcArg(arg) {
	return normalizeLowercaseStringOrEmpty(arg.replaceAll("\\", "/"));
}
const ENTRY_CANDIDATES = [
	"dist/index.js",
	"dist/entry.js",
	"testclaw.mjs",
	"scripts/run-node.mjs",
	"src/entry.ts",
	"src/index.ts"
];
function parseProcCmdline(raw) {
	return normalizeStringEntries(raw.split("\0"));
}
function isAssistantArgv(args) {
	const normalized = args.map(normalizeProcArg);
	const exe = (normalized[0] ?? "").replace(/\.(bat|cmd|exe)$/i, "");
	if (normalized.some((arg) => ENTRY_CANDIDATES.some((entry) => arg.endsWith(entry)))) return true;
	return exe.endsWith("/testclaw") || exe === "testclaw";
}
function isAssistantCommandArgv(args, command) {
	const normalizedCommand = normalizeProcArg(command);
	return args.some((arg) => normalizeProcArg(arg) === normalizedCommand) && isAssistantArgv(args);
}
function isGatewayArgv(args, opts) {
	const exe = (args.map(normalizeProcArg)[0] ?? "").replace(/\.(bat|cmd|exe)$/i, "");
	const isGatewayBinary = exe.endsWith("/testclaw-gateway") || exe === "testclaw-gateway";
	if (!isAssistantCommandArgv(args, "gateway")) return opts?.allowGatewayBinary === true && isGatewayBinary;
	return true;
}
//#endregion
export { parseProcCmdline as i, isAssistantArgv as n, isAssistantCommandArgv as r, isGatewayArgv as t };
