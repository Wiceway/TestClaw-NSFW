import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/session-participant.ts
/** Product identity, independent of display metadata and authorization. */
const SessionParticipantIdentitySchema = Type.Union([
	closedObject({
		type: Type.Literal("profile"),
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("agent"),
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("remote"),
		pluginId: NonEmptyString,
		domain: NonEmptyString,
		idKind: NonEmptyString,
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("observation"),
		pluginId: Type.Union([NonEmptyString, Type.Null()]),
		accountId: Type.Union([NonEmptyString, Type.Null()]),
		senderKind: Type.Union([
			Type.Literal("human"),
			Type.Literal("bot"),
			Type.Literal("unknown")
		]),
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("legacy"),
		actorType: Type.String(),
		source: Type.Union([Type.String(), Type.Null()]),
		id: Type.String()
	})
]);
const SessionParticipantSchema = closedObject({
	identity: SessionParticipantIdentitySchema,
	label: Type.Optional(NonEmptyString),
	avatarUrl: Type.Optional(NonEmptyString)
});
const SessionPersonSchema = closedObject({
	identity: closedObject({
		type: Type.Literal("profile"),
		id: NonEmptyString
	}),
	label: Type.Optional(NonEmptyString),
	avatarUrl: Type.Optional(NonEmptyString),
	sessionCount: Type.Integer({ minimum: 1 })
});
//#endregion
export { SessionParticipantSchema as n, SessionPersonSchema as r, SessionParticipantIdentitySchema as t };
