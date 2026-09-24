import { n as formatErrorMessageWithCode } from "./errors-DNLGIg8_.mjs";
import { f as errorShape } from "./error-codes-WUvUxA6s.mjs";
import { n as copyErrorDiagnostic } from "./error-diagnostics-LIeQ0S8g.mjs";
//#region src/gateway/error-shape.ts
/** Builds a wire error from an unknown failure without diagnostic class names. */
function errorShapeFromError(code, error, opts) {
	const shape = errorShape(code, formatErrorMessageWithCode(error), opts);
	copyErrorDiagnostic(error, shape);
	return shape;
}
//#endregion
export { errorShapeFromError as t };
