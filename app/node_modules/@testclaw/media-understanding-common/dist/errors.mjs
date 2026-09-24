//#region packages/media-understanding-common/src/errors.ts
/** Error used when a media attachment should be skipped without failing the whole request. */
var MediaUnderstandingSkipError = class extends Error {
	constructor(reason, message) {
		super(message);
		this.reason = reason;
		this.name = "MediaUnderstandingSkipError";
	}
};
/** Narrow unknown errors to media-understanding skip errors. */
function isMediaUnderstandingSkipError(err) {
	return err instanceof MediaUnderstandingSkipError;
}
//#endregion
export { MediaUnderstandingSkipError, isMediaUnderstandingSkipError };
