import { i as __require, t as __commonJSMin } from "./rolldown-runtime-B000p9w_.mjs";
//#region node_modules/.pnpm/@lydell+node-pty@1.2.0-beta.15/node_modules/@lydell/node-pty/package.json
var require_package = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		"name": "@lydell/node-pty",
		"description": "Smaller distribution of node-pty.",
		"author": "Simon Lydell",
		"version": "1.2.0-beta.15",
		"license": "MIT",
		"type": "commonjs",
		"exports": { ".": {
			"types": "./node-pty.d.ts",
			"default": "./index.js"
		} },
		"types": "./node-pty.d.ts",
		"repository": {
			"type": "git",
			"url": "git://github.com/lydell/node-pty.git"
		},
		"keywords": [
			"pty",
			"tty",
			"terminal",
			"pseudoterminal",
			"forkpty",
			"openpty",
			"prebuild",
			"prebuilt"
		],
		"optionalDependencies": {
			"@lydell/node-pty-darwin-arm64": "1.2.0-beta.15",
			"@lydell/node-pty-darwin-x64": "1.2.0-beta.15",
			"@lydell/node-pty-linux-arm64": "1.2.0-beta.15",
			"@lydell/node-pty-linux-x64": "1.2.0-beta.15",
			"@lydell/node-pty-win32-arm64": "1.2.0-beta.15",
			"@lydell/node-pty-win32-x64": "1.2.0-beta.15"
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@lydell+node-pty@1.2.0-beta.15/node_modules/@lydell/node-pty/index.js
var require_node_pty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const PACKAGE_NAME = `@lydell/node-pty-${process.platform}-${process.arch}`;
	const help = `
This can happen if you use the "--omit=optional" (or "--no-optional") npm flag.
The "optionalDependencies" package.json feature is used to install the correct
binary executable for your current platform. Remove that flag to use @lydell/node-pty.

This can also happen if the "node_modules" folder was copied between two operating systems
that need different binaries - including "virtual" operating systems like Docker and WSL.
If so, try installing with npm rather than copying "node_modules".
`.trim();
	function requirePlatformSpecificPackage() {
		try {
			return __require(PACKAGE_NAME);
		} catch (error) {
			if (error && error.code === "MODULE_NOT_FOUND") {
				const optionalDependencies = getOptionalDependencies();
				throw new Error(optionalDependencies === void 0 ? `The @lydell/node-pty package could not find the platform-specific package: ${PACKAGE_NAME}\n\n${help}\n\nYour platform (${process.platform}-${process.arch}) might not be supported.` : PACKAGE_NAME in optionalDependencies ? `The @lydell/node-pty package supports your platform (${process.platform}-${process.arch}), but it could not find the platform-specific package for it: ${PACKAGE_NAME}\n\n${help}` : `The @lydell/node-pty package currently does not support your platform: ${process.platform}-${process.arch}`, { cause: error });
			} else throw error;
		}
	}
	function getOptionalDependencies() {
		try {
			return require_package().optionalDependencies;
		} catch (_error) {
			return;
		}
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.native = exports.open = exports.createTerminal = exports.fork = exports.spawn = void 0;
	module.exports = requirePlatformSpecificPackage();
}));
//#endregion
export default require_node_pty();
export {};
