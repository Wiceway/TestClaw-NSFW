import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { l as asPositiveFiniteNumber } from "./number-coercion-0M4tZV2c.js";
import { i as resolveGlobalSingleton } from "./global-singleton-DmdlcXls.js";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.js";
//#region src/interactive/payload.ts
const PRESENTATION_FALLBACK_CONTINUATION = Symbol.for("testclaw.presentation.fallback-continuation");
function resolveMessagePresentationActionValue(action) {
	if (action?.type === "command") return action.command;
	if (action?.type === "callback") return action.value;
}
function resolveMessagePresentationButtonAction(button, options) {
	if (button.action !== void 0) {
		const action = normalizePresentationAction(button.action);
		return action?.type === "model-picker" && options?.modelPicker !== true ? void 0 : action;
	}
	if (button.url) return {
		type: "url",
		url: button.url
	};
	const webAppUrl = button.webApp?.url ?? button.web_app?.url;
	if (webAppUrl) return {
		type: "web-app",
		url: webAppUrl
	};
	return button.value ? {
		type: "callback",
		value: button.value
	} : void 0;
}
function resolveMessagePresentationOptionAction(option, options) {
	if (option.action !== void 0) {
		const action = normalizePresentationAction(option.action);
		if (action?.type === "model-picker" && options?.modelPicker !== true) return;
		return action?.type === "command" || action?.type === "callback" || action?.type === "model-picker" ? action : void 0;
	}
	return option.value ? {
		type: "callback",
		value: option.value
	} : void 0;
}
function normalizeButtonStyle(value) {
	const style = normalizeOptionalLowercaseString(value);
	return style === "primary" || style === "secondary" || style === "success" || style === "danger" ? style : void 0;
}
function normalizePresentationTone(value) {
	const tone = normalizeOptionalLowercaseString(value);
	return tone === "info" || tone === "success" || tone === "warning" || tone === "danger" || tone === "neutral" ? tone : void 0;
}
const MODEL_PICKER_TOKEN_MAX_LENGTH = 128;
const MODEL_PICKER_TOKEN_PATTERN = /^[A-Za-z0-9_-]+$/u;
function normalizeModelPickerToken(value) {
	const token = normalizeOptionalString(value);
	return token && token.length <= MODEL_PICKER_TOKEN_MAX_LENGTH && MODEL_PICKER_TOKEN_PATTERN.test(token) ? token : void 0;
}
function normalizeOptionalModelPickerCursor(record) {
	if (record.cursor === void 0) return { valid: true };
	const cursor = normalizeModelPickerToken(record.cursor);
	return cursor ? {
		valid: true,
		cursor
	} : { valid: false };
}
function normalizeModelPickerAction(record) {
	if (record.type !== "model-picker" || record.version !== 1) return;
	const snapshotToken = normalizeModelPickerToken(record.snapshotToken);
	if (!snapshotToken) return;
	const intent = record.intent;
	if (intent === "show-providers" || intent === "show-recents") {
		const cursor = normalizeOptionalModelPickerCursor(record);
		return cursor.valid ? {
			type: "model-picker",
			version: 1,
			snapshotToken,
			intent,
			...cursor.cursor ? { cursor: cursor.cursor } : {}
		} : void 0;
	}
	if (intent === "show-models") {
		const providerToken = normalizeModelPickerToken(record.providerToken);
		const cursor = normalizeOptionalModelPickerCursor(record);
		return providerToken && cursor.valid ? {
			type: "model-picker",
			version: 1,
			snapshotToken,
			intent,
			providerToken,
			...cursor.cursor ? { cursor: cursor.cursor } : {}
		} : void 0;
	}
	if (intent === "choose-model") {
		const providerToken = normalizeModelPickerToken(record.providerToken);
		const modelToken = normalizeModelPickerToken(record.modelToken);
		return providerToken && modelToken ? {
			type: "model-picker",
			version: 1,
			snapshotToken,
			intent,
			providerToken,
			modelToken
		} : void 0;
	}
	if (intent === "choose-runtime") {
		const providerToken = normalizeModelPickerToken(record.providerToken);
		const modelToken = normalizeModelPickerToken(record.modelToken);
		const runtimeToken = normalizeModelPickerToken(record.runtimeToken);
		return providerToken && modelToken && runtimeToken ? {
			type: "model-picker",
			version: 1,
			snapshotToken,
			intent,
			providerToken,
			modelToken,
			runtimeToken
		} : void 0;
	}
	return intent === "reset" || intent === "cancel" ? {
		type: "model-picker",
		version: 1,
		snapshotToken,
		intent
	} : void 0;
}
function normalizePresentationAction(raw) {
	const record = asOptionalRecord(raw);
	if (!record) return;
	const type = normalizeOptionalLowercaseString(record.type);
	if (type === "command") {
		const command = normalizeOptionalString(record.command);
		return command ? {
			type: "command",
			command
		} : void 0;
	}
	if (type === "callback") {
		const value = normalizeOptionalString(record.value);
		return value ? {
			type: "callback",
			value
		} : void 0;
	}
	if (type === "model-picker") return normalizeModelPickerAction(record);
	if (type === "approval") {
		if (record.type !== "approval") return;
		const approvalId = record.approvalId;
		const approvalKind = record.approvalKind;
		const decision = record.decision;
		if (typeof approvalId !== "string" || !isWellFormedApprovalId(approvalId) || approvalKind !== "exec" && approvalKind !== "plugin" && approvalKind !== "system-agent" || decision !== "allow-once" && decision !== "allow-always" && decision !== "deny") return;
		return {
			type: "approval",
			approvalId,
			approvalKind,
			decision
		};
	}
	if (type === "question") {
		if (record.type !== "question") return;
		const questionId = record.questionId;
		const optionValue = record.optionValue;
		if (typeof questionId !== "string" || !isWellFormedApprovalId(questionId)) return;
		const intent = record.intent;
		if (intent === void 0) return typeof optionValue === "string" && optionValue.trim() ? {
			type: "question",
			questionId,
			optionValue
		} : void 0;
		if (intent === "custom-input") return {
			type: "question",
			questionId,
			intent
		};
		return;
	}
	if (type === "url") {
		const url = normalizeOptionalString(record.url);
		return url ? {
			type: "url",
			url
		} : void 0;
	}
	if (type === "web-app") {
		const url = normalizeOptionalString(record.url);
		const widgetId = normalizeOptionalString(record.widgetId);
		if (url) return {
			type: "web-app",
			url,
			...widgetId ? { widgetId } : {}
		};
		return widgetId ? {
			type: "web-app",
			widgetId
		} : void 0;
	}
}
function normalizeButton(raw) {
	const record = asOptionalRecord(raw);
	if (!record) return;
	const label = normalizeOptionalString(record.label) ?? normalizeOptionalString(record.text);
	const value = normalizeOptionalString(record.value) ?? normalizeOptionalString(record.callbackData) ?? normalizeOptionalString(record.callback_data);
	const url = normalizeOptionalString(record.url);
	const webAppRecord = asOptionalRecord(record.webApp) ?? asOptionalRecord(record.web_app);
	const webAppUrl = normalizeOptionalString(webAppRecord?.url);
	const action = record.action !== void 0 ? normalizePresentationAction(record.action) : void 0;
	if (!label || record.action !== void 0 && !action || !action && !value && !url && !webAppUrl) return;
	const priority = typeof record.priority === "number" && Number.isFinite(record.priority) ? record.priority : void 0;
	return {
		label,
		...action ? { action } : {},
		...value ? { value } : {},
		...url ? { url } : {},
		...webAppUrl ? { webApp: { url: webAppUrl } } : {},
		...priority !== void 0 ? { priority } : {},
		...record.disabled === true ? { disabled: true } : {},
		...record.reusable === true ? { reusable: true } : {},
		style: normalizeButtonStyle(record.style)
	};
}
function normalizeOption(raw) {
	const record = asOptionalRecord(raw);
	if (!record) return;
	const label = normalizeOptionalString(record.label) ?? normalizeOptionalString(record.text);
	const value = normalizeOptionalString(record.value);
	const normalizedAction = record.action !== void 0 ? normalizePresentationAction(record.action) : void 0;
	const action = normalizedAction?.type === "command" || normalizedAction?.type === "callback" || normalizedAction?.type === "model-picker" ? normalizedAction : void 0;
	if (!label || record.action !== void 0 && !action || !action && !value) return;
	return {
		label,
		...action ? { action } : {},
		...value ? { value } : {}
	};
}
function normalizeList(value, normalizeEntry) {
	return Array.isArray(value) ? value.map((entry) => normalizeEntry(entry)).filter((entry) => Boolean(entry)) : [];
}
function normalizeInteractiveBlock(raw) {
	const record = asOptionalRecord(raw);
	if (!record) return;
	const type = normalizeOptionalLowercaseString(record.type);
	if (type === "text") {
		const text = normalizeOptionalString(record.text);
		return text ? {
			type: "text",
			text
		} : void 0;
	}
	if (type === "buttons") {
		const buttons = normalizeList(record.buttons, normalizeButton);
		return buttons.length > 0 ? {
			type: "buttons",
			buttons
		} : void 0;
	}
	if (type === "select") {
		const options = normalizeList(record.options, normalizeOption);
		return options.length > 0 ? {
			type: "select",
			placeholder: normalizeOptionalString(record.placeholder),
			options
		} : void 0;
	}
}
function normalizeChartSegments(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	const segments = value.map((entry) => {
		const record = asOptionalRecord(entry);
		const label = normalizeOptionalString(record?.label);
		const segmentValue = record?.value;
		return label && typeof segmentValue === "number" && Number.isFinite(segmentValue) ? {
			label,
			value: segmentValue
		} : void 0;
	});
	return segments.every((segment) => Boolean(segment && segment.value > 0)) ? segments : void 0;
}
function normalizeChartCategories(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	const categories = value.map((entry) => normalizeOptionalString(entry));
	if (categories.some((entry) => !entry)) return;
	const normalized = categories;
	return new Set(normalized).size === normalized.length ? normalized : void 0;
}
function normalizeChartSeries(params) {
	if (!Array.isArray(params.value) || params.value.length === 0) return;
	const series = params.value.map((entry) => {
		const record = asOptionalRecord(entry);
		const name = normalizeOptionalString(record?.name);
		const values = record?.values;
		if (!name || !Array.isArray(values) || values.length !== params.categoryCount || !values.every((value) => typeof value === "number" && Number.isFinite(value))) return;
		return {
			name,
			values
		};
	});
	if (!series.every((entry) => Boolean(entry)) || new Set(series.map((entry) => entry.name)).size !== series.length) return;
	return series;
}
function normalizeChartBlock(record) {
	const title = normalizeOptionalString(record.title);
	const chartType = normalizeOptionalLowercaseString(record.chartType);
	if (!title) return;
	if (chartType === "pie") {
		const segments = normalizeChartSegments(record.segments);
		return segments ? {
			type: "chart",
			chartType,
			title,
			segments
		} : void 0;
	}
	if (chartType !== "bar" && chartType !== "area" && chartType !== "line") return;
	const categories = normalizeChartCategories(record.categories);
	if (!categories) return;
	const series = normalizeChartSeries({
		value: record.series,
		categoryCount: categories.length
	});
	if (!series) return;
	const xLabel = normalizeOptionalString(record.xLabel);
	const yLabel = normalizeOptionalString(record.yLabel);
	return {
		type: "chart",
		chartType,
		title,
		categories,
		series,
		...xLabel ? { xLabel } : {},
		...yLabel ? { yLabel } : {}
	};
}
function normalizeTableBlock(record) {
	const caption = normalizeOptionalString(record.caption);
	if (!caption || !Array.isArray(record.headers) || record.headers.length === 0) return;
	const headers = record.headers.map((header) => normalizeOptionalString(header));
	if (!headers.every((header) => Boolean(header)) || new Set(headers).size !== headers.length || !Array.isArray(record.rows) || record.rows.length === 0) return;
	const rows = record.rows.map((row) => {
		if (!Array.isArray(row) || row.length !== headers.length) return;
		const cells = row.map((cell) => {
			if (typeof cell === "number") return Number.isFinite(cell) ? cell : void 0;
			return normalizeOptionalString(cell);
		});
		return cells.every((cell) => cell !== void 0) ? cells : void 0;
	});
	if (!rows.every((row) => Boolean(row))) return;
	const rowHeaderColumnIndex = record.rowHeaderColumnIndex;
	if (rowHeaderColumnIndex !== void 0 && (typeof rowHeaderColumnIndex !== "number" || !Number.isInteger(rowHeaderColumnIndex) || rowHeaderColumnIndex < 0 || rowHeaderColumnIndex >= headers.length)) return;
	return {
		type: "table",
		caption,
		headers,
		rows,
		...typeof rowHeaderColumnIndex === "number" ? { rowHeaderColumnIndex } : {}
	};
}
function normalizeLegacyInteractiveReply(raw) {
	const record = asOptionalRecord(raw);
	if (!record) return;
	const blocks = normalizeList(record.blocks, normalizeInteractiveBlock);
	return blocks.length > 0 ? { blocks } : void 0;
}
function isPresentationContinuation(raw) {
	const record = asOptionalRecord(raw);
	return Boolean(record && Object.getOwnPropertyDescriptor(record, PRESENTATION_FALLBACK_CONTINUATION)?.value === true);
}
function normalizePresentationBlock(raw, followedByContinuation) {
	const record = asOptionalRecord(raw);
	if (!record) return;
	const type = normalizeOptionalLowercaseString(record.type);
	if (type === "text" || type === "context") {
		const continuation = isPresentationContinuation(record);
		const text = (continuation || followedByContinuation) && typeof record.text === "string" ? record.text : normalizeOptionalString(record.text);
		const block = text ? {
			type,
			text
		} : void 0;
		if (block && continuation) Object.defineProperty(block, PRESENTATION_FALLBACK_CONTINUATION, { value: true });
		return block;
	}
	if (type === "divider") return { type: "divider" };
	if (type === "buttons") {
		const buttons = normalizeList(record.buttons, normalizeButton);
		return buttons.length > 0 ? {
			type: "buttons",
			buttons
		} : void 0;
	}
	if (type === "select") {
		const options = normalizeList(record.options, normalizeOption);
		return options.length > 0 ? {
			type: "select",
			placeholder: normalizeOptionalString(record.placeholder),
			options
		} : void 0;
	}
	if (type === "chart") return normalizeChartBlock(record);
	if (type === "table") return normalizeTableBlock(record);
}
function normalizeMessagePresentation(raw) {
	const record = asOptionalRecord(raw);
	if (!record) return;
	const rawBlocks = Array.isArray(record.blocks) ? record.blocks : [];
	const blocks = rawBlocks.flatMap((block, index) => {
		const normalized = normalizePresentationBlock(block, isPresentationContinuation(rawBlocks[index + 1]));
		return normalized ? [normalized] : [];
	});
	const title = isPresentationContinuation(rawBlocks[0]) && typeof record.title === "string" ? record.title : normalizeOptionalString(record.title);
	if (!title && blocks.length === 0) return;
	return {
		...title ? { title } : {},
		tone: normalizePresentationTone(record.tone),
		blocks
	};
}
function hasLegacyInteractiveReplyBlocks(value) {
	return Boolean(normalizeLegacyInteractiveReply(value));
}
function hasMessagePresentationBlocks(value) {
	return Boolean(normalizeMessagePresentation(value));
}
/**
* Render presentation blocks as plain-text fallback for channels that do not
* support native interactive controls.
*
* Text and context blocks are rendered as-is. Buttons with a `command`-typed
* action render as `label: \`command\`` so the value is copyable. URL and web
* app actions include their user-facing URL. Approval, question, callback,
* legacy value, and select actions render label-only to keep transport data
* private. Disabled buttons render label-only regardless of action type.
*
* Downstream consumers should not claim a manual command is available unless
* they verify one was actually rendered.
*
* Exported through the plugin SDK for channel adapters.
*/
function renderMessagePresentationChartFallbackText(block) {
	const lines = [`${block.title} (${block.chartType} chart)`];
	if (block.chartType === "pie") {
		lines.push(...block.segments.map((segment) => `- ${segment.label}: ${String(segment.value)}`));
		return lines.join("\n");
	}
	if (block.xLabel) lines.push(`X axis: ${block.xLabel}`);
	if (block.yLabel) lines.push(`Y axis: ${block.yLabel}`);
	lines.push(...block.series.map((series) => `- ${series.name}: ${block.categories.map((category, index) => `${category}: ${String(series.values[index])}`).join("; ")}`));
	return lines.join("\n");
}
function renderTableFallbackValue(value) {
	return String(value).replace(/\s+/g, " ").trim();
}
function renderMessagePresentationTableFallbackText(block) {
	const headers = block.headers.map(renderTableFallbackValue);
	const lines = [`${renderTableFallbackValue(block.caption)} (table)`];
	lines.push(...block.rows.map((row) => `- ${row.map((cell, index) => `${headers[index]}: ${renderTableFallbackValue(cell)}`).join("; ")}`));
	return lines.join("\n");
}
/** Keep only operator-visible navigation and public command text in control fallbacks. */
function renderMessagePresentationControlFallbackLabel(control) {
	if (control.disabled) return control.label;
	const action = resolveMessagePresentationButtonAction(control);
	if (action?.type === "url" || action?.type === "web-app" && action.url) return `${control.label}: ${action.url}`;
	if (action?.type === "command") return `${control.label}: \`${action.command}\``;
	return control.label;
}
function renderMessagePresentationFallbackText(params) {
	const lines = [];
	const text = normalizeOptionalString(params.text);
	if (text) lines.push(text);
	const presentation = params.presentation;
	if (!presentation) return lines.join("\n\n");
	if (presentation.title) lines.push(presentation.title);
	for (const block of presentation.blocks) {
		if (block.type === "text" || block.type === "context") {
			if (isPresentationContinuation(block) && lines.length) lines[lines.length - 1] += block.text;
			else lines.push(block.text);
			continue;
		}
		if (block.type === "buttons") {
			const labels = block.buttons.map(renderMessagePresentationControlFallbackLabel).filter(Boolean);
			if (labels.length > 0) lines.push(labels.map((label) => `- ${label}`).join("\n"));
			continue;
		}
		if (block.type === "chart") {
			lines.push(renderMessagePresentationChartFallbackText(block));
			continue;
		}
		if (block.type === "table") {
			lines.push(renderMessagePresentationTableFallbackText(block));
			continue;
		}
		if (block.type === "select") {
			const labels = block.options.map(renderMessagePresentationControlFallbackLabel).filter(Boolean);
			if (labels.length > 0) {
				const heading = block.placeholder ? `${block.placeholder}:` : "Options:";
				lines.push(`${heading}\n${labels.map((label) => `- ${label}`).join("\n")}`);
			}
		}
	}
	return lines.join("\n\n") || normalizeOptionalString(params.emptyFallback) || "";
}
function hasReplyChannelData(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0);
}
function hasReplyContent(params) {
	const text = normalizeOptionalString(params.text);
	const mediaUrl = normalizeOptionalString(params.mediaUrl);
	return Boolean(text || mediaUrl || params.mediaUrls?.some((entry) => Boolean(normalizeOptionalString(entry))) || hasMessagePresentationBlocks(params.presentation) || hasLegacyInteractiveReplyBlocks(params.interactive) || params.hasChannelData || params.extraContent);
}
function hasReplyPayloadContent(payload, options) {
	return hasReplyContent({
		text: options?.trimText ? payload.text?.trim() : payload.text,
		mediaUrl: payload.mediaUrl,
		mediaUrls: payload.mediaUrls,
		interactive: payload.interactive,
		presentation: payload.presentation,
		hasChannelData: options?.hasChannelData ?? hasReplyChannelData(payload.channelData),
		extraContent: options?.extraContent ?? payload.location != null
	});
}
//#endregion
//#region src/auto-reply/reply-payload.ts
/** Adds the BTW question banner for channels that only accept plain text bodies. */
function formatBtwTextForExternalDelivery(payload) {
	const text = normalizeOptionalString(payload.text);
	if (!text) return payload.text;
	const question = normalizeOptionalString(payload.btw?.question);
	if (!question) return payload.text;
	const formatted = `BTW\nQuestion: ${question}\n\n${text}`;
	return text === formatted || text.startsWith("BTW\nQuestion:") ? text : formatted;
}
/** True when a payload has visible or playable content for delivery. */
function isRenderablePayload(payload) {
	return hasReplyPayloadContent(payload, { extraContent: payload.audioAsVoice || payload.location != null || hasReplyPayloadSpeechContent(payload) });
}
/** True when a payload should stay internal as reasoning-only output. */
function shouldSuppressReasoningPayload(payload) {
	return payload.isReasoning === true;
}
function readAskUserQuestionId(payload) {
	const askUser = payload.channelData?.askUser;
	if (!askUser || typeof askUser !== "object" || Array.isArray(askUser)) return;
	const questionId = askUser.questionId;
	return typeof questionId === "string" && questionId ? questionId : void 0;
}
const PAIRING_QR_REPLY_CHANNEL_DATA_KEY = "testclawPairingQr";
function readPairingQrReplyChannelData(payload) {
	const raw = payload.channelData?.[PAIRING_QR_REPLY_CHANNEL_DATA_KEY];
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
	const record = raw;
	const setupCode = readNonBlankString(record.setupCode);
	const expiresAtMs = asPositiveFiniteNumber(record.expiresAtMs);
	return setupCode && expiresAtMs ? {
		setupCode,
		expiresAtMs
	} : void 0;
}
/** Metadata for fast-auto progress notices. */
const FAST_MODE_AUTO_PROGRESS_KIND = "fast-mode-auto";
function isFastModeAutoProgressPayload(payload) {
	return payload.channelData?.testclawProgressKind === FAST_MODE_AUTO_PROGRESS_KIND;
}
const REPLY_MEDIA_FAILURE_MESSAGES = {
	"file-not-found": "File not found. Check the path and try again.",
	"unsupported-format": "Rejected by the local attachment allowlist. Send a supported file type.",
	"delivery-failed": "Delivery failed. Try sending this file again."
};
function formatReplyMediaFailures(failures) {
	return failures.map((failure) => `⚠️ ${failure.label}: ${REPLY_MEDIA_FAILURE_MESSAGES[failure.code]}`).join("\n");
}
/** Appends one named, actionable fallback receipt per failed attachment. */
function appendReplyMediaFailures(text, failures) {
	if (failures.length === 0) return text;
	const receipt = formatReplyMediaFailures(failures);
	return text?.trim() ? `${text}\n${receipt}` : receipt;
}
/** Removes producer-authored fallback receipts when structured display cards supersede them. */
function stripReplyMediaFailureFallback(text, failures) {
	if (!text || failures.length === 0) return text;
	const receipt = formatReplyMediaFailures(failures);
	if (text === receipt) return;
	const suffix = `\n${receipt}`;
	return text.endsWith(suffix) ? text.slice(0, -suffix.length) : text;
}
function hasReplyPayloadMedia(payload) {
	return Boolean(readNonBlankString(payload.mediaUrl) || Array.isArray(payload.mediaUrls) && payload.mediaUrls.some(readNonBlankString));
}
/** Returns normalized TTS supplement metadata only when the payload has media to carry it. */
function getReplyPayloadTtsSupplement(payload) {
	const spokenText = readNonBlankString(payload.ttsSupplement?.spokenText);
	if (!spokenText || !hasReplyPayloadMedia(payload)) return;
	return {
		spokenText,
		...payload.ttsSupplement?.visibleTextAlreadyDelivered === true ? { visibleTextAlreadyDelivered: true } : {}
	};
}
/** Returns true when the payload is a valid TTS supplement media payload. */
function isReplyPayloadTtsSupplement(payload) {
	return Boolean(getReplyPayloadTtsSupplement(payload));
}
/** Marks a reply payload as supplemental TTS media while preserving the original shape. */
function markReplyPayloadAsTtsSupplement(payload, spokenText = payload.spokenText ?? payload.text ?? "", options) {
	const normalizedSpokenText = readNonBlankString(spokenText);
	if (!normalizedSpokenText) return payload;
	return {
		...payload,
		spokenText: normalizedSpokenText,
		ttsSupplement: {
			spokenText: normalizedSpokenText,
			...options?.visibleTextAlreadyDelivered === true ? { visibleTextAlreadyDelivered: true } : {}
		}
	};
}
/** Removes visible-only fields from a payload that should be delivered as TTS supplement media. */
function buildTtsSupplementMediaPayload(payload) {
	const supplement = getReplyPayloadTtsSupplement(payload);
	if (!supplement) return payload;
	const { text: _text, presentation: _presentation, interactive: _interactive, btw: _btw, ...mediaPayload } = payload;
	return copyReplyPayloadMetadata(payload, {
		...mediaPayload,
		spokenText: supplement.spokenText,
		ttsSupplement: supplement
	});
}
const replyPayloadMetadata = resolveGlobalSingleton(Symbol.for("testclaw.replyPayloadMetadata"), () => /* @__PURE__ */ new WeakMap());
/** Adds internal metadata to a reply payload object. */
function setReplyPayloadMetadata(payload, metadata) {
	const previous = replyPayloadMetadata.get(payload);
	replyPayloadMetadata.set(payload, {
		...previous,
		...metadata
	});
	return payload;
}
/** Reads internal metadata attached to a reply payload object. */
function getReplyPayloadMetadata(payload) {
	return replyPayloadMetadata.get(payload);
}
/** Reads a complete, internally consistent source occurrence from reply metadata. */
function readReplyPayloadSourceOccurrence(payload) {
	const metadata = getReplyPayloadMetadata(payload);
	const assistantMessageIndex = metadata?.assistantMessageIndex;
	const sourceText = metadata?.blockSourceText;
	const sourceRange = metadata?.blockSourceRange;
	if (typeof assistantMessageIndex !== "number" || !Number.isSafeInteger(assistantMessageIndex) || assistantMessageIndex < 0 || typeof sourceText !== "string" || !Array.isArray(sourceRange) || sourceRange.length !== 2) return;
	const [start, end] = sourceRange;
	if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start || end - start !== sourceText.length) return;
	return {
		assistantMessageIndex,
		sourceText,
		sourceRange: [start, end]
	};
}
/** Explicit speech remains content while the payload waits for TTS admission. */
function hasReplyPayloadSpeechContent(payload) {
	return Boolean(readNonBlankString(getReplyPayloadMetadata(payload)?.tts?.text));
}
function isReplyPayloadTargetSuppressed(payload) {
	return getReplyPayloadMetadata(payload)?.replyTargetSuppressed === true;
}
/** Keep derived reply fields consistent with the host's recorded target decision. */
function applyReplyPayloadTargetPolicy(payload) {
	if (!isReplyPayloadTargetSuppressed(payload)) return payload;
	return copyReplyPayloadMetadata(payload, {
		...payload,
		replyToId: void 0,
		replyToCurrent: false,
		replyToTag: false
	});
}
/** Revalidates an authority-bearing payload against a freshly loaded session row. */
function isReplyPayloadSessionWriterDeliveryAuthorized(payload, entry) {
	const authority = getReplyPayloadMetadata(payload)?.sessionWriterDeliveryAuthority;
	if (!authority) return true;
	return Boolean(entry && entry.sessionId === authority.expectedSessionId && (authority.expectedLifecycleRevision === void 0 || entry.lifecycleRevision === authority.expectedLifecycleRevision) && (authority.expectedWriterRunId === void 0 || entry.activeWriterRunId === authority.expectedWriterRunId));
}
/** Returns true when a payload is the synthesized warning for a non-terminal tool error. */
function isReplyPayloadNonTerminalToolErrorWarning(payload) {
	return getReplyPayloadMetadata(payload)?.nonTerminalToolErrorWarning === true;
}
/** Copies internal payload metadata when cloning or transforming payload objects. */
function copyReplyPayloadMetadata(source, payload) {
	const metadata = getReplyPayloadMetadata(source);
	return metadata ? setReplyPayloadMetadata(payload, metadata) : payload;
}
/** Marks a host-owned payload as deliverable even when normal source replies are suppressed. */
function markReplyPayloadForSourceSuppressionDelivery(payload) {
	return setReplyPayloadMetadata(payload, { deliverDespiteSourceReplySuppression: true });
}
function markCommandReplyForDelivery(reply) {
	const markPayload = (payload) => setReplyPayloadMetadata(markReplyPayloadForSourceSuppressionDelivery(payload), { commandReply: true });
	if (!reply) return reply;
	if (Array.isArray(reply)) return reply.map(markPayload);
	return markPayload(reply);
}
/** Returns true only when a command owner produced every payload in a non-empty reply. */
function isCommandReplyForDelivery(reply) {
	const payloads = Array.isArray(reply) ? reply : reply ? [reply] : [];
	return payloads.length > 0 && payloads.every((payload) => getReplyPayloadMetadata(payload)?.commandReply === true);
}
/** Returns true for internal status/notice payloads, not assistant answer content. */
function isReplyPayloadStatusNotice(payload) {
	return Boolean(payload.isCompactionNotice || payload.isFallbackNotice || payload.isStatusNotice);
}
/** Classifies terminal vs. supplemental reply lanes, not content, sendability, or authority. */
const isReplyPayloadTerminalContent = (payload) => {
	const supplement = getReplyPayloadTtsSupplement(payload);
	return payload.isReasoning !== true && payload.isCommentary !== true && (!isReplyPayloadStatusNotice(payload) || getReplyPayloadMetadata(payload)?.commandReply === true) && (!supplement || supplement.visibleTextAlreadyDelivered !== true && Boolean(readNonBlankString(payload.text)));
};
//#endregion
export { hasReplyChannelData as A, resolveMessagePresentationOptionAction as B, readPairingQrReplyChannelData as C, stripReplyMediaFailureFallback as D, shouldSuppressReasoningPayload as E, renderMessagePresentationControlFallbackLabel as F, renderMessagePresentationFallbackText as I, renderMessagePresentationTableFallbackText as L, normalizeLegacyInteractiveReply as M, normalizeMessagePresentation as N, hasLegacyInteractiveReplyBlocks as O, renderMessagePresentationChartFallbackText as P, resolveMessagePresentationActionValue as R, readAskUserQuestionId as S, setReplyPayloadMetadata as T, isReplyPayloadTerminalContent as _, copyReplyPayloadMetadata as a, markReplyPayloadAsTtsSupplement as b, getReplyPayloadTtsSupplement as c, isFastModeAutoProgressPayload as d, isRenderablePayload as f, isReplyPayloadTargetSuppressed as g, isReplyPayloadStatusNotice as h, buildTtsSupplementMediaPayload as i, hasReplyPayloadContent as j, hasMessagePresentationBlocks as k, hasReplyPayloadSpeechContent as l, isReplyPayloadSessionWriterDeliveryAuthorized as m, appendReplyMediaFailures as n, formatBtwTextForExternalDelivery as o, isReplyPayloadNonTerminalToolErrorWarning as p, applyReplyPayloadTargetPolicy as r, getReplyPayloadMetadata as s, FAST_MODE_AUTO_PROGRESS_KIND as t, isCommandReplyForDelivery as u, isReplyPayloadTtsSupplement as v, readReplyPayloadSourceOccurrence as w, markReplyPayloadForSourceSuppressionDelivery as x, markCommandReplyForDelivery as y, resolveMessagePresentationButtonAction as z };
