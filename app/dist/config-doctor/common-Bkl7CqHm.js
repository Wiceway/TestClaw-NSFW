import { r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.js";
import { d as asSafeIntegerInRange, u as asPositiveSafeInteger, y as parseStrictFiniteNumber } from "./number-coercion-0M4tZV2c.js";
import { c as normalizeSingleOrTrimmedStringList } from "./string-normalization-DsCfAx8q.js";
import "./fs-safe-CZ3jhUUr.js";
import "./mime-Bmg9gcyP.js";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.js";
import { n as textResult } from "./tool-results-BCM3fdVS.js";
//#region src/param-key.ts
function toSnakeCaseKey(key) {
	const snakeKey = key.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z0-9])([A-Z])/g, "$1_$2");
	return lowercasePreservingWhitespace(snakeKey);
}
function resolveSnakeCaseParamKey(params, key) {
	if (Object.hasOwn(params, key)) return key;
	const snakeKey = toSnakeCaseKey(key);
	if (snakeKey !== key && Object.hasOwn(params, snakeKey)) return snakeKey;
}
function readSnakeCaseParamRaw(params, key) {
	const resolvedKey = resolveSnakeCaseParamKey(params, key);
	if (resolvedKey) return params[resolvedKey];
}
//#endregion
//#region src/agents/tools/common.ts
function asToolParamsRecord(params) {
	return asNonArrayRecord(params);
}
function isBlankParamValue(raw) {
	return typeof raw === "string" && raw.trim() === "";
}
function readToolStringParam(params, key, options = {}) {
	const { required = false, trim = true, label = key, allowEmpty = false } = options;
	const raw = readSnakeCaseParamRaw(params, key);
	if (typeof raw !== "string") {
		if (required) throw new ToolInputError(`${label} required`);
		return;
	}
	const value = trim ? raw.trim() : raw;
	if (!value && !allowEmpty) {
		if (required) throw new ToolInputError(`${label} required`);
		return;
	}
	return value;
}
/**
* Normalize tool model override input.
* - empty/whitespace => undefined
* - "default" (case-insensitive) => undefined (sentinel: reset/fallback)
* - otherwise returns trimmed explicit model string
*/
function normalizeToolModelOverride(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed || trimmed.toLowerCase() === "default") return;
	return trimmed;
}
function readNumberParam(params, key, options = {}) {
	const { required = false, label = key, integer = false, strict = false, positiveInteger = false, nonNegativeInteger = false } = options;
	const raw = readSnakeCaseParamRaw(params, key);
	let value;
	if (typeof raw === "number" && Number.isFinite(raw)) value = raw;
	else if (typeof raw === "string") {
		const trimmed = raw.trim();
		if (trimmed) {
			const parsed = strict ? parseStrictFiniteNumber(trimmed) : Number.parseFloat(trimmed);
			if (parsed !== void 0 && Number.isFinite(parsed)) value = parsed;
		}
	}
	if (value === void 0) {
		if (required) throw new ToolInputError(`${label} required`);
		return;
	}
	if (positiveInteger) return asPositiveSafeInteger(value);
	if (nonNegativeInteger) return asSafeIntegerInRange(value, { min: 0 });
	return integer ? Math.trunc(value) : value;
}
function readPositiveIntegerParam(params, key, options = {}) {
	const value = readNumberParam(params, key, {
		positiveInteger: true,
		strict: true
	});
	if (value === void 0) {
		const raw = readSnakeCaseParamRaw(params, key);
		if (raw != null && !isBlankParamValue(raw)) throw new ToolInputError(options.message ?? `${key} must be a positive integer`);
	}
	if (value !== void 0 && options.max !== void 0 && value > options.max) throw new ToolInputError(options.message ?? `${key} must be a positive integer`);
	return value;
}
function readNonNegativeIntegerParam(params, key, options = {}) {
	const value = readNumberParam(params, key, {
		nonNegativeInteger: true,
		strict: true
	});
	if (value === void 0) {
		const raw = readSnakeCaseParamRaw(params, key);
		if (raw != null && !isBlankParamValue(raw)) throw new ToolInputError(options.message ?? `${key} must be a non-negative integer`);
	}
	if (value !== void 0 && options.max !== void 0 && value > options.max) throw new ToolInputError(options.message ?? `${key} must be a non-negative integer`);
	return value;
}
function readFiniteNumberParam(params, key, options = {}) {
	const value = readNumberParam(params, key, { strict: true });
	if (value === void 0) {
		const raw = readSnakeCaseParamRaw(params, key);
		if (raw != null && !isBlankParamValue(raw)) throw new ToolInputError(options.message ?? `${key} must be a finite number`);
		return;
	}
	if (options.min !== void 0) {
		if (options.minExclusive ? value <= options.min : value < options.min) throw new ToolInputError(options.message ?? `${key} must be a finite number`);
	}
	if (options.max !== void 0) {
		if (options.maxExclusive ? value >= options.max : value > options.max) throw new ToolInputError(options.message ?? `${key} must be a finite number`);
	}
	return value;
}
function readStringArrayParam(params, key, options = {}) {
	const { required = false, label = key } = options;
	const values = normalizeSingleOrTrimmedStringList(readSnakeCaseParamRaw(params, key));
	if (values.length > 0) return values;
	if (required) throw new ToolInputError(`${label} required`);
}
function stringifyToolPayload(payload) {
	if (typeof payload === "string") return payload;
	try {
		const encoded = JSON.stringify(payload, null, 2);
		if (typeof encoded === "string") return encoded;
	} catch {}
	return String(payload);
}
function failedTextResult(text, details) {
	return textResult(text, details);
}
function payloadTextResult(payload) {
	return textResult(stringifyToolPayload(payload), payload);
}
function toolProgressResult(progress) {
	return {
		content: [],
		details: void 0,
		progress: {
			text: progress.text,
			visibility: "channel",
			privacy: "public",
			...progress.id ? { id: progress.id } : {}
		}
	};
}
function emitToolProgress(onUpdate, progress) {
	const text = progress.text.trim();
	if (!onUpdate || !text) return;
	try {
		onUpdate(toolProgressResult({
			...progress,
			text
		}));
	} catch {}
}
function scheduleToolProgress(onUpdate, progress, delayMs, options = {}) {
	if (!onUpdate || options.signal?.aborted) return () => {};
	let cleared = false;
	const clear = () => {
		if (cleared) return;
		cleared = true;
		clearTimeout(timer);
		options.signal?.removeEventListener("abort", clear);
	};
	const timer = setTimeout(() => {
		clear();
		emitToolProgress(onUpdate, progress);
	}, delayMs);
	options.signal?.addEventListener("abort", clear, { once: true });
	return clear;
}
//#endregion
export { readFiniteNumberParam as a, readPositiveIntegerParam as c, scheduleToolProgress as d, readSnakeCaseParamRaw as f, payloadTextResult as i, readStringArrayParam as l, failedTextResult as n, readNonNegativeIntegerParam as o, resolveSnakeCaseParamKey as p, normalizeToolModelOverride as r, readNumberParam as s, asToolParamsRecord as t, readToolStringParam as u };
