import { r as normalizeLogLevel } from "./levels-qpAN12Fm.js";
import { o as isFileLogLevelEnabled, r as getChildLogger } from "./logger-DmjW9g94.js";
import { a as shouldLogVerbose } from "./globals-NNTJbzqD.js";
import "./logging-CaOHXBaE.js";
//#region src/plugins/runtime/runtime-logging.ts
function writeRuntimeLog(logger, level, message, meta) {
	if (meta && Object.keys(meta).length > 0) {
		logger[level](meta, message);
		return;
	}
	logger[level](message);
}
/** Creates the plugin runtime logging facade. */
function createRuntimeLogging() {
	return {
		shouldLogVerbose,
		getChildLogger: (bindings, opts) => {
			const overrideLevel = opts?.level ? normalizeLogLevel(opts.level) : void 0;
			const childOpts = overrideLevel ? { level: overrideLevel } : void 0;
			const emit = (level) => (message, meta) => {
				if (!overrideLevel && !isFileLogLevelEnabled(level)) return;
				writeRuntimeLog(getChildLogger(bindings, childOpts), level, message, meta);
			};
			return {
				debug: emit("debug"),
				info: emit("info"),
				warn: emit("warn"),
				error: emit("error")
			};
		}
	};
}
//#endregion
export { writeRuntimeLog as n, createRuntimeLogging as t };
