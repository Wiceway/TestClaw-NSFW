import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { Type } from "typebox";
const TRANSCRIPTS_RESULT_MAX_BYTES = 1048576;
const TRANSCRIPTS_EXPORT_MAX_BYTES = 4194304;
const TRANSCRIPTS_LEGACY_MAX_UTTERANCES = 2e3;
const TRANSCRIPTS_LEGACY_MAX_TEXT_LENGTH = 4e3;
const TRANSCRIPTS_LEGACY_RESULT_MAX_BYTES = 26214400;
const Selector = Type.String({
	minLength: 1,
	maxLength: TRANSCRIPTS_RESULT_MAX_BYTES
});
const Filter = Type.String({
	minLength: 1,
	maxLength: 256
});
const NullableString = Type.Union([Type.String(), Type.Null()]);
const Page = {
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 100
	})),
	cursor: Type.Optional(Type.String({
		minLength: 1,
		maxLength: TRANSCRIPTS_RESULT_MAX_BYTES
	})),
	query: Type.Optional(Type.String({ maxLength: 256 }))
};
const SummarySourceSchema = Type.Union([Type.Literal("model"), Type.Literal("heuristic")]);
const SourceKind = Type.Union([
	Type.Literal("live-audio"),
	Type.Literal("live-caption"),
	Type.Literal("posthoc-transcript"),
	Type.Literal("recording-stt")
]);
const AutoStartField = Type.Union([Type.Literal("optional"), Type.Literal("required")]);
const Source = closedObject({
	providerId: NonEmptyString,
	kind: Type.Optional(SourceKind),
	accountId: Type.Optional(Type.String()),
	guildId: Type.Optional(Type.String()),
	channelId: Type.Optional(Type.String()),
	meetingUrl: Type.Optional(Type.String()),
	threadTs: Type.Optional(Type.String()),
	fileId: Type.Optional(Type.String())
});
const TranscriptSessionSummarySchema = closedObject({
	selector: Selector,
	sessionId: NonEmptyString,
	title: Type.Optional(Type.String()),
	providerId: NonEmptyString,
	providerName: Type.Optional(Type.String()),
	source: Source,
	startedAt: NonEmptyString,
	stoppedAt: Type.Optional(Type.String()),
	active: Type.Boolean(),
	utteranceCount: Type.Integer({ minimum: 0 }),
	participants: Type.Array(Type.String()),
	hasSummary: Type.Boolean(),
	summarySource: Type.Optional(SummarySourceSchema),
	overview: Type.Optional(Type.String({ maxLength: 280 })),
	agentId: NullableString,
	updatedAt: Type.String(),
	lastUtteranceAt: NullableString,
	activeSubscription: Type.Boolean()
});
const TranscriptUtteranceSchema = closedObject({
	sequence: Type.Integer({ minimum: 0 }),
	id: Type.Optional(Type.String()),
	startedAt: Type.Optional(Type.String()),
	endedAt: Type.Optional(Type.String()),
	speakerId: Type.Optional(Type.String()),
	speakerLabel: Type.Optional(Type.String()),
	text: Type.String(),
	final: Type.Optional(Type.Boolean())
});
const TranscriptsListParamsSchema = closedObject({
	...Page,
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 200,
		default: 50
	})),
	providerId: Type.Optional(NonEmptyString),
	accountId: Type.Optional(Filter),
	agentId: Type.Optional(Filter),
	startedAfter: Type.Optional(Type.String({
		format: "date-time",
		maxLength: 64
	})),
	startedBefore: Type.Optional(Type.String({
		format: "date-time",
		maxLength: 64
	}))
});
closedObject({
	sessions: Type.Array(TranscriptSessionSummarySchema, { maxItems: 200 }),
	nextCursor: NullableString
});
const TranscriptsSummarizeParamsSchema = closedObject({ selector: Selector });
const TranscriptsGetParamsSchema = closedObject({
	selector: Selector,
	includeUtterances: Type.Optional(Type.Boolean()),
	...Page
});
closedObject({
	session: TranscriptSessionSummarySchema,
	summary: Type.Optional(closedObject({
		generatedAt: Type.String(),
		overview: Type.String(),
		decisions: Type.Array(Type.String()),
		actionItems: Type.Array(Type.String()),
		risks: Type.Array(Type.String()),
		participants: Type.Array(Type.String()),
		source: Type.Optional(SummarySourceSchema),
		model: Type.Optional(Type.String()),
		markdown: Type.String(),
		utteranceCount: Type.Integer({ minimum: 0 })
	})),
	utterances: Type.Optional(Type.Array(TranscriptUtteranceSchema, { maxItems: TRANSCRIPTS_LEGACY_MAX_UTTERANCES })),
	nextCursor: NullableString
});
const TranscriptsExportParamsSchema = closedObject({
	selector: Selector,
	format: Type.Union([Type.Literal("markdown"), Type.Literal("jsonl")])
});
closedObject({
	selector: Selector,
	filename: Type.String(),
	mimeType: Type.String(),
	encoding: Type.Literal("base64"),
	data: Type.String(),
	sizeBytes: Type.Integer({
		minimum: 0,
		maximum: TRANSCRIPTS_EXPORT_MAX_BYTES
	})
});
const TranscriptsStatusParamsSchema = closedObject({});
closedObject({
	enabled: Type.Boolean(),
	providers: Type.Array(closedObject({
		providerId: Type.String(),
		pluginId: Type.Optional(Type.String()),
		name: Type.String(),
		availability: Type.Union([
			Type.Literal("enabled"),
			Type.Literal("disabled"),
			Type.Literal("unavailable"),
			Type.Literal("unknown")
		]),
		sourceKinds: Type.Optional(Type.Array(SourceKind)),
		canStart: Type.Optional(Type.Boolean()),
		canStop: Type.Optional(Type.Boolean()),
		canImport: Type.Optional(Type.Boolean()),
		autoStart: Type.Optional(closedObject({
			accountId: Type.Optional(AutoStartField),
			guildId: Type.Optional(AutoStartField),
			channelId: Type.Optional(AutoStartField),
			meetingUrl: Type.Optional(AutoStartField)
		}))
	}), { maxItems: 100 }),
	configuredSources: Type.Array(closedObject({
		source: Source,
		title: Type.Optional(Type.String()),
		sessionId: Type.Optional(Type.String()),
		state: Type.Union([
			Type.Literal("disabled"),
			Type.Literal("armed"),
			Type.Literal("not-active"),
			Type.Literal("unknown")
		]),
		activeSelectors: Type.Array(Selector, { maxItems: 100 }),
		startDiagnostic: Type.Optional(Type.Union([
			Type.Literal("starting"),
			Type.Literal("retrying"),
			Type.Literal("id-conflict"),
			Type.Literal("admitted-start-failed"),
			Type.Literal("start-failed"),
			Type.Literal("ended")
		]))
	}), { maxItems: 100 }),
	active: Type.Array(TranscriptSessionSummarySchema, { maxItems: 100 }),
	latestTranscript: Type.Union([TranscriptSessionSummarySchema, Type.Null()]),
	omitted: closedObject({
		providers: Type.Integer({ minimum: 0 }),
		configuredSources: Type.Integer({ minimum: 0 }),
		active: Type.Integer({ minimum: 0 })
	})
});
//#endregion
export { TranscriptsExportParamsSchema as a, TranscriptsStatusParamsSchema as c, TRANSCRIPTS_RESULT_MAX_BYTES as i, TranscriptsSummarizeParamsSchema as l, TRANSCRIPTS_LEGACY_MAX_TEXT_LENGTH as n, TranscriptsGetParamsSchema as o, TRANSCRIPTS_LEGACY_RESULT_MAX_BYTES as r, TranscriptsListParamsSchema as s, TRANSCRIPTS_EXPORT_MAX_BYTES as t };
