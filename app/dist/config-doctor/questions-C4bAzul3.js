import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { t as withSince } from "./since-DH6SNo1_.js";
import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/questions.ts
const QuestionIdSchema = Type.String({ pattern: "^[a-z][a-z0-9_]*$" });
const QuestionResolutionIdSchema = withSince("2026.8", Type.String({
	minLength: 1,
	maxLength: 128
}));
const QuestionHeaderSchema = Type.String({ maxLength: 12 });
const QuestionSecretStoreAllowedHostsSchema = Type.Array(Type.String({
	minLength: 1,
	maxLength: 253
}), {
	maxItems: 128,
	uniqueItems: true
});
const QuestionOptionSchema = closedObject({
	label: NonEmptyString,
	description: Type.Optional(Type.String())
});
const QuestionSecretStoreBindingSchema = closedObject({
	name: Type.String({
		minLength: 1,
		maxLength: 128,
		pattern: "^[A-Z][A-Z0-9_]{0,127}$"
	}),
	kind: Type.Union([Type.Literal("secret"), Type.Literal("env")]),
	allowedHosts: Type.Optional(QuestionSecretStoreAllowedHostsSchema),
	reason: Type.Optional(Type.String({ maxLength: 200 }))
});
const QuestionSecretStoreExistingSchema = closedObject({
	updatedAtMs: Type.Integer({ minimum: 0 }),
	updatedBy: Type.Optional(NonEmptyString)
});
const QuestionInputFields = {
	questionId: QuestionIdSchema,
	header: QuestionHeaderSchema,
	question: NonEmptyString,
	url: Type.Optional(withSince("2026.8", Type.String({
		minLength: 1,
		maxLength: 2048
	}))),
	options: Type.Array(QuestionOptionSchema, { maxItems: 4 }),
	multiSelect: Type.Optional(Type.Boolean()),
	isOther: Type.Optional(Type.Boolean()),
	isSecret: Type.Optional(Type.Boolean()),
	secretStore: Type.Optional(withSince("2026.8", QuestionSecretStoreBindingSchema))
};
/** Unnormalized question accepted by question.request. */
const QuestionRequestQuestionSchema = closedObject(QuestionInputFields);
const QuestionFields = {
	...QuestionInputFields,
	secretStoreExisting: Type.Optional(withSince("2026.8", QuestionSecretStoreExistingSchema))
};
/** Canonical normalized question shown to an operator. */
const QuestionSchema = closedObject(QuestionFields);
const QuestionAnswersSchema = closedObject({ answers: Type.Record(QuestionIdSchema, Type.Array(Type.String())) });
const QuestionStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("answered"),
	Type.Literal("cancelled"),
	Type.Literal("expired")
]);
/**
* One pending or recently resolved transient question request. Flat object with
* optional terminal fields (exec-approval record precedent): native protocol
* codegen cannot emit per-status object unions, and the manager owns the
* status/answers invariant (answers present only when status is "answered").
*/
const QuestionRecordSchema = closedObject({
	id: NonEmptyString,
	questions: Type.Array(QuestionSchema, {
		minItems: 1,
		maxItems: 3
	}),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	createdAtMs: Type.Integer({ minimum: 0 }),
	expiresAtMs: Type.Integer({ minimum: 0 }),
	status: QuestionStatusSchema,
	answers: Type.Optional(QuestionAnswersSchema),
	resolvedBy: Type.Optional(NonEmptyString)
});
const QuestionRequestParamsSchema = closedObject({
	id: Type.Optional(NonEmptyString),
	questions: Type.Array(QuestionRequestQuestionSchema, {
		minItems: 1,
		maxItems: 3
	}),
	agentId: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 }))
});
closedObject({
	id: NonEmptyString,
	expiresAtMs: Type.Integer({ minimum: 0 })
});
const QuestionWaitAnswerParamsSchema = closedObject({
	id: NonEmptyString,
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	includeResolutionId: Type.Optional(withSince("2026.8", Type.Boolean()))
});
const QuestionWaitAnswerResultSchema = Type.Union([
	closedObject({ status: Type.Literal("pending") }),
	closedObject({
		status: Type.Literal("answered"),
		answers: QuestionAnswersSchema,
		resolutionId: Type.Optional(QuestionResolutionIdSchema)
	}),
	closedObject({ status: Type.Literal("cancelled") }),
	closedObject({ status: Type.Literal("expired") })
]);
const QuestionResolveParamsSchema = Type.Union([closedObject({
	id: NonEmptyString,
	answers: QuestionAnswersSchema,
	secretStoreAllowedHosts: Type.Optional(withSince("2026.8", QuestionSecretStoreAllowedHostsSchema)),
	resolvedBy: Type.Optional(NonEmptyString),
	resolutionId: Type.Optional(QuestionResolutionIdSchema)
}), closedObject({
	id: NonEmptyString,
	cancel: Type.Literal(true),
	resolvedBy: Type.Optional(NonEmptyString)
})]);
const QuestionResolveResultSchema = Type.Union([closedObject({
	status: Type.Literal("answered"),
	answers: QuestionAnswersSchema
}), closedObject({ status: Type.Literal("cancelled") })]);
const QuestionGetParamsSchema = closedObject({ id: NonEmptyString });
const QuestionGetResultSchema = closedObject({ question: QuestionRecordSchema });
const QuestionListParamsSchema = closedObject({});
const QuestionListResultSchema = closedObject({ questions: Type.Array(QuestionRecordSchema) });
withSince("2026.7", QuestionRecordSchema);
const QuestionResolvedEventSchema = withSince("2026.7", Type.Union([
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("answered"),
		answers: QuestionAnswersSchema
	}),
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("cancelled")
	}),
	closedObject({
		id: NonEmptyString,
		status: Type.Literal("expired")
	})
]));
//#endregion
export { QuestionOptionSchema as a, QuestionRequestQuestionSchema as c, QuestionResolvedEventSchema as d, QuestionWaitAnswerParamsSchema as f, QuestionListResultSchema as i, QuestionResolveParamsSchema as l, QuestionGetResultSchema as n, QuestionRecordSchema as o, QuestionWaitAnswerResultSchema as p, QuestionListParamsSchema as r, QuestionRequestParamsSchema as s, QuestionGetParamsSchema as t, QuestionResolveResultSchema as u };
