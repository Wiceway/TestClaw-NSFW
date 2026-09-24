import "./session-key-AvQIavYt.js";
import "./account-lookup-CD9t104R.js";
//#region src/channels/plugins/config-helpers.ts
/** Replace one section; undefined removes it and prunes an empty channels object. */
function writeChannelSection(cfg, channelKey, section) {
	if (section !== void 0) return {
		...cfg,
		channels: {
			...cfg.channels,
			[channelKey]: section
		}
	};
	const channels = { ...cfg.channels };
	delete channels[channelKey];
	const next = { ...cfg };
	if (Object.keys(channels).length > 0) next.channels = channels;
	else delete next.channels;
	return next;
}
//#endregion
export { writeChannelSection as t };
