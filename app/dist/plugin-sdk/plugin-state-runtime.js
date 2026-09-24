import { t as configureSqliteConnectionPragmas } from "../sqlite-wal-36gEREe5.mjs";
import { t as migrateSqliteSchemaToStrict } from "../sqlite-strict-7A3qfvsv.mjs";
//#region src/plugin-sdk/plugin-state-runtime.ts
function createPluginStateErrorReporter(getRuntime, plugin, feature, message, formatError = (error) => ({ error: String(error) })) {
	return (error) => {
		try {
			getRuntime()?.logging.getChildLogger({
				plugin,
				feature
			}).warn(message, formatError(error));
		} catch {}
	};
}
//#endregion
export { configureSqliteConnectionPragmas, createPluginStateErrorReporter, migrateSqliteSchemaToStrict };
