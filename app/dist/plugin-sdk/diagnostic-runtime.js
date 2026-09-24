import { _ as redactSensitiveText } from "../redact-Db5P6nQB.mjs";
import { A as isValidDiagnosticSpanId, D as formatDiagnosticTraceparent, E as createDiagnosticTraceContextFromActiveScope, M as isValidDiagnosticTraceId, N as parseDiagnosticTraceparent, O as freezeDiagnosticTraceContext, T as createDiagnosticTraceContext, c as emitTrustedDiagnosticEventWithPrivateData, f as hasPendingInternalDiagnosticEvent, g as onInternalDiagnosticEvent, h as onDiagnosticEvent, j as isValidDiagnosticTraceFlags, m as isInternalDiagnosticEventMetadata, p as isDiagnosticsEnabled, r as emitDiagnosticEvent, s as emitTrustedDiagnosticEvent, t as areDiagnosticsEnabledForProcess, w as createChildDiagnosticTraceContext, x as waitForDiagnosticEventsDrained, y as resetDiagnosticEventsForTest } from "../diagnostic-events-C4sEV9aC.mjs";
import { t as createSubsystemLogger } from "../subsystem-Bmu9GF-b.mjs";
import { t as isDiagnosticFlagEnabled } from "../diagnostic-flags-BDkp2nbq.mjs";
import { n as resolveDiagnosticModelContentCapturePolicy } from "../diagnostic-llm-content-pAJxJAOh.mjs";
//#region src/plugin-sdk/diagnostic-runtime.ts
const LOW_CARDINALITY_DIAGNOSTIC_VALUE_RE = /^[A-Za-z0-9_.:-]{1,120}$/u;
function normalizeDiagnosticValue(value, fallback = "unknown") {
	if (!value) return fallback;
	const redacted = redactSensitiveText(value.trim());
	const redactedLower = redacted.toLowerCase();
	if (redactedLower.startsWith("agent:") || redactedLower.includes(":agent:")) return fallback;
	return LOW_CARDINALITY_DIAGNOSTIC_VALUE_RE.test(redacted) ? redacted : fallback;
}
function normalizeDiagnosticLane(value, fallback = "unknown") {
	if (!value) return fallback;
	const redacted = redactSensitiveText(value.trim());
	if (redacted.toLowerCase().startsWith("agent:")) return fallback;
	const scopedLaneIndex = redacted.indexOf(":");
	const lane = scopedLaneIndex >= 0 ? redacted.slice(0, scopedLaneIndex) : redacted;
	return LOW_CARDINALITY_DIAGNOSTIC_VALUE_RE.test(lane) ? lane : fallback;
}
//#endregion
export { areDiagnosticsEnabledForProcess, createChildDiagnosticTraceContext, createDiagnosticTraceContext, createDiagnosticTraceContextFromActiveScope, createSubsystemLogger, emitDiagnosticEvent, emitTrustedDiagnosticEvent, emitTrustedDiagnosticEventWithPrivateData, formatDiagnosticTraceparent, freezeDiagnosticTraceContext, hasPendingInternalDiagnosticEvent, isDiagnosticFlagEnabled, isDiagnosticsEnabled, isInternalDiagnosticEventMetadata, isValidDiagnosticSpanId, isValidDiagnosticTraceFlags, isValidDiagnosticTraceId, normalizeDiagnosticLane, normalizeDiagnosticValue, onDiagnosticEvent, onInternalDiagnosticEvent, parseDiagnosticTraceparent, resetDiagnosticEventsForTest, resolveDiagnosticModelContentCapturePolicy, waitForDiagnosticEventsDrained };
