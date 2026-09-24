import { n as formatErrorMessageWithCode } from "./errors-cp9Var1Z.js";
import { n as errorShape } from "./error-codes-DQWjOSek.js";
import { n as copyErrorDiagnostic } from "./error-diagnostics-D1OCFafW.js";
//#region src/gateway/error-shape.ts
/** Builds a wire error from an unknown failure without diagnostic class names. */
function errorShapeFromError(code, error, opts) {
	const shape = errorShape(code, formatErrorMessageWithCode(error), opts);
	copyErrorDiagnostic(error, shape);
	return shape;
}
//#endregion
export { errorShapeFromError as t };
