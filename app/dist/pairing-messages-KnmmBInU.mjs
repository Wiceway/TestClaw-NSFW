import { t as formatCliCommand } from "./command-format-D2yOb8RI.mjs";
//#region src/pairing/pairing-messages.ts
function buildPairingReply(params) {
	const { channel, idLine, code } = params;
	return [
		"Assistant: access not configured.",
		"",
		idLine,
		"Pairing code:",
		"```",
		code,
		"```",
		"",
		"Ask the bot owner to approve with:",
		"```",
		formatCliCommand(`testclaw pairing approve ${channel} ${code}`),
		"```"
	].join("\n");
}
//#endregion
export { buildPairingReply as t };
