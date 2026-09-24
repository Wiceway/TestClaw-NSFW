import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { a as NonEmptyString, i as InputProvenanceSchema, t as ChatSendSessionKeyString } from "./primitives-BBZtPseE.js";
import { l as SessionVisibilitySchema, r as SessionPermissionModeSchema, s as SessionToolOverridesSchema } from "./sessions-row-CwTWD3JH.js";
import { t as CHAT_WORK_CONTEXT_LIMITS } from "./chat-work-context-BnQywh8U.js";
import { t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C-H8nkgi.js";
import { Type } from "typebox";
const MentionReferenceSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const MentionLabelSchema = Type.String({
	minLength: 1,
	maxLength: 256
});
const MentionSessionKeySchema = Type.String({
	minLength: 1,
	maxLength: 512
});
const MentionAvatarUrlSchema = Type.String({
	minLength: 1,
	maxLength: 2048
});
const MentionTimestampSchema = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
/** Explicit selections bound to UTF-16 offsets in the submitted message text. */
const HumanMentionSchema = closedObject({
	profileId: MentionReferenceSchema,
	start: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	end: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	})
});
const HumanMentionsSchema = Type.Array(HumanMentionSchema, { maxItems: 10 });
const UsersMentionableParamsSchema = Type.Union([closedObject({
	sessionKey: MentionSessionKeySchema,
	agentId: Type.Optional(MentionReferenceSchema),
	query: Type.Optional(Type.String({ maxLength: 128 }))
}), closedObject({
	agentId: MentionReferenceSchema,
	visibility: Type.Optional(SessionVisibilitySchema),
	query: Type.Optional(Type.String({ maxLength: 128 }))
})]);
const MentionableUserSchema = closedObject({
	profileId: MentionReferenceSchema,
	displayName: MentionLabelSchema,
	avatarUrl: Type.Optional(MentionAvatarUrlSchema),
	online: Type.Boolean()
});
closedObject({
	users: Type.Array(MentionableUserSchema, { maxItems: 100 }),
	truncated: Type.Boolean()
});
const MentionInboxItemSchema = closedObject({
	id: MentionReferenceSchema,
	senderProfileId: MentionReferenceSchema,
	senderLabel: MentionLabelSchema,
	senderAvatarUrl: Type.Optional(MentionAvatarUrlSchema),
	sessionKey: MentionSessionKeySchema,
	agentId: MentionReferenceSchema,
	sessionTitle: MentionLabelSchema,
	messageId: MentionReferenceSchema,
	createdAt: MentionTimestampSchema,
	expiresAt: MentionTimestampSchema,
	excerpt: Type.Optional(Type.String({ maxLength: 280 }))
});
const MentionsListParamsSchema = closedObject({});
const MentionsDismissParamsSchema = closedObject({ ids: Type.Array(MentionReferenceSchema, {
	maxItems: 100,
	uniqueItems: true
}) });
const MentionInboxVersionProperties = {
	gatewayInstanceId: MentionReferenceSchema,
	revision: Type.Integer({
		minimum: 0,
		maximum: Number.MAX_SAFE_INTEGER
	})
};
closedObject({
	...MentionInboxVersionProperties,
	items: Type.Array(MentionInboxItemSchema, { maxItems: 100 })
});
closedObject(MentionInboxVersionProperties);
//#endregion
//#region packages/gateway-protocol/src/schema/logs-chat.ts
/** Cursor-based request for the gateway log tail endpoint. */
const LogsTailParamsSchema = closedObject({
	cursor: Type.Optional(Type.Integer({ minimum: 0 })),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e3
	})),
	maxBytes: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 1e6
	}))
});
closedObject({
	file: NonEmptyString,
	cursor: Type.Integer({ minimum: 0 }),
	size: Type.Integer({ minimum: 0 }),
	lines: Type.Array(Type.String()),
	truncated: Type.Optional(Type.Boolean()),
	reset: Type.Optional(Type.Boolean()),
	skippedBytes: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Session-scoped history request used by WebChat and native WebSocket clients. */
const ChatHistoryParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	cursor: Type.Optional(Type.String()),
	limit: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: CHAT_HISTORY_MAX_ENTRIES
	})),
	maxBytes: Type.Optional(Type.Integer({ minimum: 1024 })),
	offset: Type.Optional(Type.Integer({ minimum: 0 })),
	pendingBefore: Type.Optional(Type.Integer({ minimum: 1 })),
	inputRunIds: Type.Optional(Type.Array(Type.String({
		minLength: 1,
		maxLength: 256
	}), {
		minItems: 1,
		maxItems: 50,
		uniqueItems: true
	})),
	messageId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 5e5
	}))
});
/** Resolve a short chat link and fetch its first page under the same discovery policy. */
const ChatStartupParamsSchema = Type.Union([ChatHistoryParamsSchema, closedObject({
	shortId: NonEmptyString,
	slugHint: Type.Optional(NonEmptyString),
	agentId: NonEmptyString,
	limit: ChatHistoryParamsSchema.properties.limit,
	maxBytes: ChatHistoryParamsSchema.properties.maxBytes
})]);
/** Accepted input awaiting a turn, separate from canonical model history. */
const ChatPendingInputsPageSchema = closedObject({
	items: Type.Array(closedObject({
		id: NonEmptyString,
		runId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 256
		})),
		message: Type.Unknown(),
		acceptedAt: Type.Number(),
		state: Type.String({ enum: [
			"queued",
			"cancelled",
			"interrupted"
		] })
	}), { maxItems: 20 }),
	total: Type.Integer({ minimum: 0 }),
	nextBefore: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Exact accepted-input custody, independent of display pagination and message identity. */
const ChatInputReceiptsSchema = Type.Array(Type.Union([closedObject({
	runId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	state: Type.Literal("pending")
}), closedObject({
	runId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	state: Type.Literal("consumed"),
	consumedByEventId: NonEmptyString
})]), { maxItems: 50 });
/** Consumed-only compatibility projection for existing v4 clients. */
const ChatInputConsumptionsSchema = Type.Array(closedObject({
	runId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	consumedByEventId: NonEmptyString
}), { maxItems: 50 });
const AgentActivityItemSchema = closedObject({
	itemId: NonEmptyString,
	phase: Type.Union([
		Type.Literal("start"),
		Type.Literal("update"),
		Type.Literal("end")
	]),
	kind: Type.String(),
	title: Type.String(),
	status: Type.Optional(Type.Union([
		Type.Literal("running"),
		Type.Literal("completed"),
		Type.Literal("failed"),
		Type.Literal("blocked")
	])),
	name: Type.Optional(Type.String()),
	meta: Type.Optional(Type.String()),
	commandBearing: Type.Optional(Type.Boolean()),
	toolCallId: Type.Optional(Type.String()),
	startedAt: Type.Optional(Type.Number()),
	endedAt: Type.Optional(Type.Number()),
	error: Type.Optional(Type.String()),
	summary: Type.Optional(Type.String()),
	progressText: Type.Optional(Type.String()),
	suppressChannelProgress: Type.Optional(Type.Boolean()),
	hideFromChannelProgress: Type.Optional(Type.Boolean()),
	approvalId: Type.Optional(Type.String()),
	approvalSlug: Type.Optional(Type.String())
});
const ChatHistoryActivitySchema = closedObject({
	messageId: NonEmptyString,
	items: Type.Array(AgentActivityItemSchema)
});
/**
* Bounded forward catch-up response. Clients replay `messages` as `session.message`
* payloads. There is no continuation loop: more than 200 raw events or the byte
* budget returns `reset`, and the client fetches a fresh tail page.
*/
const ChatHistoryDeltaResultSchema = closedObject({
	kind: Type.Literal("delta"),
	messages: Type.Array(Type.Unknown()),
	activity: Type.Optional(Type.Array(ChatHistoryActivitySchema)),
	deltaCursor: Type.String(),
	sessionInfo: Type.Unknown(),
	agentsList: Type.Optional(Type.Unknown()),
	inFlightRun: Type.Optional(Type.Unknown()),
	metadata: Type.Optional(Type.Unknown()),
	pendingInputs: Type.Optional(ChatPendingInputsPageSchema),
	inputReceipts: Type.Optional(ChatInputReceiptsSchema),
	inputConsumptions: Type.Optional(ChatInputConsumptionsSchema)
});
/** Normal cursor discontinuity; clients recover with a fresh tail request. */
const ChatHistoryResetResultSchema = closedObject({ kind: Type.Literal("reset") });
Type.Union([ChatHistoryDeltaResultSchema, ChatHistoryResetResultSchema]);
/** Lightweight metadata; session scope preserves the persisted auth-profile selection. */
const ChatMetadataParamsSchema = Object.assign(closedObject({
	agentId: Type.Optional(NonEmptyString),
	authProfileId: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 256,
		description: "Preview your own saved model account for a new chat without changing defaults. Cannot be combined with sessionKey."
	})),
	sessionKey: Type.Optional(Type.String({
		minLength: 1,
		description: "Read the authorized session's persisted auth-profile selection instead of neutral agent metadata."
	}))
}), { not: { required: ["sessionKey", "authProfileId"] } });
/** Batched purpose-title request for tool calls rendered in the Control UI. */
const ChatToolTitlesParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	items: Type.Array(closedObject({
		id: Type.String({
			minLength: 1,
			maxLength: 64
		}),
		name: Type.String({
			minLength: 1,
			maxLength: 200
		}),
		input: Type.String({
			minLength: 1,
			maxLength: 4e3
		})
	}), {
		minItems: 1,
		maxItems: 24
	})
});
closedObject({
	titles: Type.Record(Type.String(), Type.String()),
	disabled: Type.Optional(Type.Boolean())
});
/** Fetches one stored chat message without forcing history callers to request huge payloads. */
const ChatMessageGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	messageId: NonEmptyString,
	maxChars: Type.Optional(Type.Integer({
		minimum: 1,
		maximum: 2e6
	}))
});
closedObject({
	ok: Type.Boolean(),
	message: Type.Optional(Type.Unknown()),
	unavailableReason: Type.Optional(Type.Union([
		Type.Literal("not_found"),
		Type.Literal("oversized"),
		Type.Literal("not_visible")
	]))
});
/** Permissive attachment envelope shared by chat and session entrypoints. */
const ChatAttachmentSchema = Type.Object({
	type: Type.Optional(Type.String()),
	mimeType: Type.Optional(Type.String()),
	fileName: Type.Optional(Type.String()),
	origin: Type.Optional(Type.Union([Type.Literal("paste"), Type.Literal("file")])),
	content: Type.Optional(Type.Unknown()),
	sizeBytes: Type.Optional(Type.Number()),
	durationMs: Type.Optional(Type.Number()),
	width: Type.Optional(Type.Number()),
	height: Type.Optional(Type.Number())
}, { additionalProperties: true });
/** Attachment list shared by chat.send and session creation's initial turn. */
const ChatAttachmentsSchema = Type.Array(ChatAttachmentSchema);
/** Opaque, out-of-band plugin bindings carried separately from model input. */
const RunToolBindingsSchema = Type.Record(Type.String({
	minLength: 1,
	maxLength: 128
}), Type.Unknown(), { maxProperties: 16 });
const QUEUE_MODES = [
	"steer",
	"followup",
	"collect",
	"interrupt"
];
const ChatSendIntentSchema = closedObject({
	kind: Type.Literal("session-goal-start"),
	version: Type.Literal(1),
	issuedAtMs: Type.Integer({ minimum: 0 })
});
const ChatWorkContextSchema = closedObject({
	page: Type.String({
		minLength: 1,
		maxLength: CHAT_WORK_CONTEXT_LIMITS.page
	}),
	title: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.title })),
	sessionKey: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.sessionKey })),
	sessionId: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.sessionId })),
	agentId: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.agentId })),
	workspace: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.workspace })),
	file: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.file })),
	selection: Type.Optional(Type.String({ maxLength: CHAT_WORK_CONTEXT_LIMITS.selection }))
});
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
const ChatSendParamsSchema = closedObject({
	sessionKey: ChatSendSessionKeyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	message: Type.String(),
	mentions: Type.Optional(HumanMentionsSchema),
	workContext: Type.Optional(ChatWorkContextSchema),
	intent: Type.Optional(ChatSendIntentSchema),
	thinking: Type.Optional(Type.String()),
	fastMode: Type.Optional(Type.Union([Type.Boolean(), Type.Literal("auto")])),
	fastAutoOnSeconds: Type.Optional(Type.Integer({ minimum: 1 })),
	queueMode: Type.Optional(Type.String({ enum: [...QUEUE_MODES] })),
	deliver: Type.Optional(Type.Boolean()),
	originatingChannel: Type.Optional(Type.String()),
	originatingTo: Type.Optional(Type.String()),
	originatingAccountId: Type.Optional(Type.String()),
	originatingThreadId: Type.Optional(Type.String()),
	replyToId: Type.Optional(NonEmptyString),
	attachments: Type.Optional(ChatAttachmentsSchema),
	toolBindings: Type.Optional(RunToolBindingsSchema),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	systemInputProvenance: Type.Optional(InputProvenanceSchema),
	systemProvenanceReceipt: Type.Optional(Type.String()),
	suppressCommandInterpretation: Type.Optional(Type.Boolean()),
	expectedLeafEntryId: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	expectedSessionRoutingContract: Type.Optional(NonEmptyString),
	expectedPermissionMode: Type.Optional(Type.Union([SessionPermissionModeSchema, Type.Null()])),
	expectedToolOverrides: Type.Optional(Type.Union([SessionToolOverridesSchema, Type.Null()])),
	idempotencyKey: NonEmptyString
});
/** Cancels the active or named run for a chat session. */
const ChatAbortParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	preserveSideRuns: Type.Optional(Type.Boolean())
});
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
const ChatInjectParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: NonEmptyString,
	label: Type.Optional(Type.String({ maxLength: 100 }))
});
/** Shared event fields preserve stream ordering and route events to the right session. */
const ChatEventBaseSchema = {
	runId: NonEmptyString,
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	spawnedBy: Type.Optional(NonEmptyString),
	seq: Type.Integer({ minimum: 0 })
};
/** Stable error categories exposed over the chat stream. */
const ChatEventErrorKindSchema = Type.Union([
	Type.Literal("refusal"),
	Type.Literal("timeout"),
	Type.Literal("rate_limit"),
	Type.Literal("context_length"),
	Type.Literal("unknown")
]);
/** Coarse startup stages shown while a run has not produced visible activity yet. */
const ChatRunStartupPhaseSchema = Type.Union([
	Type.Literal("preparing_workspace"),
	Type.Literal("naming_worktree"),
	Type.Literal("creating_worktree"),
	Type.Literal("running_setup"),
	Type.Literal("provisioning_environment"),
	Type.Literal("preparing_context"),
	Type.Literal("memory_flushing"),
	Type.Literal("starting_model")
]);
/** Transient working status; only the run owner publishes terminal failures. */
const ChatStatusEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("status"),
	phase: ChatRunStartupPhaseSchema,
	retry: Type.Optional(closedObject({
		attempt: Type.Integer({
			minimum: 1,
			maximum: 10
		}),
		maxAttempts: Type.Integer({
			minimum: 1,
			maximum: 10
		}),
		reason: Type.Literal("rate_limit")
	}))
});
/** Incremental assistant output event; `replace` marks full-content refresh deltas. */
const ChatDeltaEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("delta"),
	message: Type.Optional(Type.Unknown()),
	deltaText: Type.String(),
	replace: Type.Optional(Type.Boolean()),
	usage: Type.Optional(Type.Unknown())
});
/** Successful terminal event for a completed chat run. */
const ChatFinalEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("final"),
	message: Type.Optional(Type.Unknown()),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String()),
	yielded: Type.Optional(Type.Literal(true))
});
/** Terminal event for user-initiated or coordinator-initiated cancellation. */
const ChatAbortedEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("aborted"),
	message: Type.Optional(Type.Unknown()),
	errorMessage: Type.Optional(Type.String()),
	stopReason: Type.Optional(Type.String())
});
const CHAT_ERROR_DETAIL_MAX_CHARS = 300;
const ChatErrorDetailTextSchema = Type.Optional(Type.String({ maxLength: CHAT_ERROR_DETAIL_MAX_CHARS }));
const ChatErrorDetailSchema = closedObject({
	provider: ChatErrorDetailTextSchema,
	model: ChatErrorDetailTextSchema,
	failoverReason: ChatErrorDetailTextSchema,
	providerRuntimeFailureKind: ChatErrorDetailTextSchema,
	providerErrorType: ChatErrorDetailTextSchema,
	httpStatus: Type.Optional(Type.Integer({
		minimum: 100,
		maximum: 599
	})),
	providerErrorMessagePreview: ChatErrorDetailTextSchema
});
/** Bounds already-redacted provider facts before lifecycle and chat publication. */
function projectChatErrorDetail(observation) {
	const source = asOptionalRecord(observation);
	if (!source) return;
	const readText = (value) => typeof value === "string" && value.trim() ? truncateUtf16Safe(value.trim(), CHAT_ERROR_DETAIL_MAX_CHARS) : void 0;
	const httpStatus = typeof source.httpStatus === "number" ? source.httpStatus : void 0;
	const detail = {
		provider: readText(source.provider),
		model: readText(source.model),
		failoverReason: readText(source.failoverReason),
		providerRuntimeFailureKind: readText(source.providerRuntimeFailureKind),
		providerErrorType: readText(source.providerErrorType),
		httpStatus: httpStatus !== void 0 && Number.isInteger(httpStatus) && httpStatus >= 100 && httpStatus <= 599 ? httpStatus : void 0,
		providerErrorMessagePreview: readText(source.providerErrorMessagePreview)
	};
	return Object.values(detail).some((value) => value !== void 0) ? detail : void 0;
}
/** Terminal event for failed chat runs with optional sanitized provider diagnostics. */
const ChatErrorEventSchema = closedObject({
	...ChatEventBaseSchema,
	state: Type.Literal("error"),
	message: Type.Optional(Type.Unknown()),
	errorMessage: Type.Optional(Type.String()),
	errorKind: Type.Optional(ChatEventErrorKindSchema),
	errorDetail: Type.Optional(ChatErrorDetailSchema),
	usage: Type.Optional(Type.Unknown()),
	stopReason: Type.Optional(Type.String())
});
Type.Union([
	ChatStatusEventSchema,
	ChatDeltaEventSchema,
	ChatFinalEventSchema,
	ChatAbortedEventSchema,
	ChatErrorEventSchema
]);
//#endregion
export { MentionsDismissParamsSchema as _, ChatHistoryParamsSchema as a, ChatMetadataParamsSchema as c, ChatStartupParamsSchema as d, ChatStatusEventSchema as f, HumanMentionsSchema as g, projectChatErrorDetail as h, ChatHistoryActivitySchema as i, ChatPendingInputsPageSchema as l, LogsTailParamsSchema as m, ChatAbortParamsSchema as n, ChatInjectParamsSchema as o, ChatToolTitlesParamsSchema as p, ChatAttachmentsSchema as r, ChatMessageGetParamsSchema as s, AgentActivityItemSchema as t, ChatSendParamsSchema as u, MentionsListParamsSchema as v, UsersMentionableParamsSchema as y };
