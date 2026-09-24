//#region src/infra/native-error-response.ts
function restoreNativeErrorResponse(value) {
	const cause = value.cause ? Object.assign(new Error(value.cause.message), value.cause) : void 0;
	return Object.assign(new Error(value.message, cause ? { cause } : void 0), {
		name: value.name,
		code: value.code,
		errcode: value.errcode
	});
}
//#endregion
export { restoreNativeErrorResponse as t };
