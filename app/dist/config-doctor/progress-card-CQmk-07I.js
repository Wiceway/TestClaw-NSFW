import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/progress-card.ts
const PROGRESS_CARD_MAX_UTF8_BYTES = 8192;
const ProgressCardStepStatusSchema = Type.Union([
	Type.Literal("pending"),
	Type.Literal("in_progress"),
	Type.Literal("completed")
]);
const ProgressCardStepSchema = closedObject({
	step: Type.String({ minLength: 1 }),
	status: ProgressCardStepStatusSchema
});
const ProgressCardSchema = closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Integer({ minimum: 1 }),
	updatedAt: Type.Integer(),
	markdown: Type.Optional(Type.String()),
	steps: Type.Optional(Type.Array(ProgressCardStepSchema, { maxItems: 50 }))
});
const ProgressCardGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
closedObject({ card: Type.Union([ProgressCardSchema, Type.Null()]) });
const ProgressCardPutParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	markdown: Type.Optional(Type.String()),
	plan: Type.Optional(Type.Array(ProgressCardStepSchema, { maxItems: 50 })),
	expectedRevision: Type.Optional(Type.Integer({ minimum: 1 }))
});
const ProgressCardRefreshParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	idempotencyKey: NonEmptyString
});
closedObject({
	runId: NonEmptyString,
	status: Type.Literal("accepted"),
	revision: Type.Integer({ minimum: 1 })
});
closedObject({
	sessionKey: NonEmptyString,
	revision: Type.Union([Type.Number(), Type.Null()])
});
//#endregion
export { ProgressCardStepSchema as a, ProgressCardRefreshParamsSchema as i, ProgressCardGetParamsSchema as n, ProgressCardPutParamsSchema as r, PROGRESS_CARD_MAX_UTF8_BYTES as t };
