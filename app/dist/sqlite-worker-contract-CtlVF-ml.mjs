//#region src/infra/sqlite-worker-contract.ts
const SQLITE_WORKER_PREPARE_COMMAND = Symbol.for("testclaw.sqliteWorkerPrepareCommand");
const SQLITE_WORKER_CLOSE_RECEIPT = Symbol.for("testclaw.sqliteWorkerCloseReceipt");
const SQLITE_WORKER_MAX_MESSAGE_BYTES = 33554432;
const SQLITE_WORKER_MAX_RESULT_BYTES = 67108864;
const retainedWorkerErrorCode = Symbol.for("testclaw.sqliteWorkerErrorCode");
var SqliteWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "SqliteWorkerError";
		Object.defineProperty(this, retainedWorkerErrorCode, { value: code });
	}
};
/** Carry only canonical worker classification through a local cleanup aggregate. */
function retainSqliteWorkerErrorCode(error, source) {
	let code;
	try {
		code = Object.getOwnPropertyDescriptor(source, retainedWorkerErrorCode)?.value;
	} catch {
		return error;
	}
	if (code === "closed" || code === "overloaded" || code === "unavailable" || code === "outcome-unknown") {
		Object.defineProperty(error, retainedWorkerErrorCode, { value: code });
		Object.assign(error, { code });
	}
	return error;
}
/** Recognize canonical broker errors without admitting cleanup aggregates for retry. */
function isSqliteWorkerError(error, code) {
	if (!(error instanceof Error) || error instanceof AggregateError) return false;
	try {
		return Object.getOwnPropertyDescriptor(error, retainedWorkerErrorCode)?.value === code;
	} catch {
		return false;
	}
}
//#endregion
export { SqliteWorkerError as a, SQLITE_WORKER_PREPARE_COMMAND as i, SQLITE_WORKER_MAX_MESSAGE_BYTES as n, isSqliteWorkerError as o, SQLITE_WORKER_MAX_RESULT_BYTES as r, retainSqliteWorkerErrorCode as s, SQLITE_WORKER_CLOSE_RECEIPT as t };
