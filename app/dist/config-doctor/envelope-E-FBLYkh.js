import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as resolveUserTimezone } from "./date-time-BxM1pkzX.js";
import { a as resolveTimezone, n as formatUtcTimestamp, r as formatZonedTimestamp } from "./format-datetime-CSLJIAzN.js";
import { n as formatTimeAgo } from "./format-relative-DYcw7YLb.js";
//#region src/auto-reply/envelope.ts
/** Formats inbound message envelopes with sender, timing, and channel metadata for agent prompts. */
function sanitizeEnvelopeHeaderPart(value) {
	return value.replace(/\r\n|\r|\n/g, " ").replaceAll("[", "(").replaceAll("]", ")").replace(/\s+/g, " ").trim();
}
/** Resolves envelope formatting defaults from agent config. */
function resolveEnvelopeFormatOptions(cfg) {
	const defaults = cfg?.agents?.defaults;
	const configuredTimezone = normalizeOptionalString(defaults?.userTimezone);
	return {
		timezone: configuredTimezone ? resolveTimezone(configuredTimezone) ?? "local" : void 0,
		includeTimestamp: true,
		includeElapsed: true,
		userTimezone: defaults?.userTimezone
	};
}
function normalizeEnvelopeOptions(options) {
	const includeTimestamp = options?.includeTimestamp !== false;
	const includeElapsed = options?.includeElapsed !== false;
	return {
		timezone: normalizeOptionalString(options?.timezone) || "local",
		includeTimestamp,
		includeElapsed,
		userTimezone: options?.userTimezone
	};
}
function resolveEnvelopeTimezone(options) {
	const trimmed = options.timezone?.trim();
	if (!trimmed) return { mode: "local" };
	const lowered = normalizeLowercaseStringOrEmpty(trimmed);
	if (lowered === "utc" || lowered === "gmt") return { mode: "utc" };
	if (lowered === "local" || lowered === "host") return { mode: "local" };
	if (lowered === "user") return {
		mode: "iana",
		timeZone: resolveUserTimezone(options.userTimezone)
	};
	const explicit = resolveTimezone(trimmed);
	return explicit ? {
		mode: "iana",
		timeZone: explicit
	} : { mode: "utc" };
}
let utcWeekdayFormatter;
/** Formats an envelope timestamp using local, UTC, user, or explicit IANA timezone rules. */
function formatAgentEnvelopeTimestamp(ts, options) {
	if (ts === void 0) return;
	const resolved = normalizeEnvelopeOptions(options);
	if (!resolved.includeTimestamp) return;
	const date = ts instanceof Date ? ts : new Date(ts);
	if (Number.isNaN(date.getTime())) return;
	const zone = resolveEnvelopeTimezone(resolved);
	if (zone.mode !== "utc") return formatZonedTimestamp(date, {
		timeZone: zone.mode === "iana" ? zone.timeZone : void 0,
		displaySeconds: true,
		displayWeekday: true
	});
	const formatted = formatUtcTimestamp(date, { displaySeconds: true });
	try {
		const DateTimeFormat = Intl.DateTimeFormat;
		const cached = utcWeekdayFormatter;
		const formatter = cached?.dateTimeFormatConstructor === DateTimeFormat ? cached.formatter : new DateTimeFormat("en-US", {
			timeZone: "UTC",
			weekday: "short"
		});
		const weekday = formatter.format(date);
		if (formatter !== cached?.formatter) utcWeekdayFormatter = {
			dateTimeFormatConstructor: DateTimeFormat,
			formatter
		};
		return `${weekday} ${formatted}`;
	} catch {
		return formatted;
	}
}
/** Formats the generic bracketed envelope prepended to agent-visible messages. */
function formatAgentEnvelope(params) {
	const parts = [sanitizeEnvelopeHeaderPart(normalizeOptionalString(params.channel) || "Channel")];
	const resolved = normalizeEnvelopeOptions(params.envelope);
	let elapsed;
	if (resolved.includeElapsed && params.timestamp && params.previousTimestamp) {
		const elapsedMs = (params.timestamp instanceof Date ? params.timestamp.getTime() : params.timestamp) - (params.previousTimestamp instanceof Date ? params.previousTimestamp.getTime() : params.previousTimestamp);
		elapsed = Number.isFinite(elapsedMs) && elapsedMs >= 0 ? formatTimeAgo(elapsedMs, { suffix: false }) : void 0;
	}
	const from = normalizeOptionalString(params.from);
	if (from) {
		const fromLabel = sanitizeEnvelopeHeaderPart(from);
		parts.push(elapsed ? `${fromLabel} +${elapsed}` : fromLabel);
	} else if (elapsed) parts.push(`+${elapsed}`);
	const host = normalizeOptionalString(params.host);
	if (host) parts.push(sanitizeEnvelopeHeaderPart(host));
	const ip = normalizeOptionalString(params.ip);
	if (ip) parts.push(sanitizeEnvelopeHeaderPart(ip));
	const ts = formatAgentEnvelopeTimestamp(params.timestamp, resolved);
	if (ts) parts.push(ts);
	return `${`[${parts.join(" ")}]`} ${params.body}`;
}
//#endregion
export { formatAgentEnvelopeTimestamp as n, resolveEnvelopeFormatOptions as r, formatAgentEnvelope as t };
