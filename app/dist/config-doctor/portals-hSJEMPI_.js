import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { a as NonEmptyString } from "./primitives-BBZtPseE.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/portals.ts
const PortalSummaryIdentityFields = {
	id: NonEmptyString,
	title: NonEmptyString,
	port: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	listenPort: Type.Integer({
		minimum: 1,
		maximum: 65535
	})
};
const PortalSummaryMetadataFields = {
	publicUrl: NonEmptyString,
	path: Type.Optional(Type.String({ pattern: "^/" })),
	description: Type.Optional(Type.String()),
	origin: Type.Optional(Type.String()),
	createdAtMs: Type.Integer({ minimum: 0 })
};
const PortalSummarySchema = closedObject({
	...PortalSummaryIdentityFields,
	tokenQuery: Type.Optional(NonEmptyString),
	url: Type.Optional(NonEmptyString),
	...PortalSummaryMetadataFields
});
const PortalEnvironmentFields = { environmentId: Type.Optional(NonEmptyString) };
const PortalListParamsSchema = closedObject({ ...PortalEnvironmentFields });
const PortalListResultSchema = closedObject({ portals: Type.Array(PortalSummarySchema) });
const PortalOpenParamsSchema = closedObject({
	...PortalEnvironmentFields,
	port: Type.Integer({
		minimum: 1,
		maximum: 65535
	}),
	title: Type.Optional(NonEmptyString),
	description: Type.Optional(Type.String()),
	path: Type.Optional(Type.String({ pattern: "^/" }))
});
closedObject({
	...PortalSummaryIdentityFields,
	tokenQuery: NonEmptyString,
	url: NonEmptyString,
	...PortalSummaryMetadataFields
});
const PortalCloseParamsSchema = closedObject({
	id: NonEmptyString,
	...PortalEnvironmentFields
});
const PortalCloseResultSchema = closedObject({ closed: Type.Boolean() });
closedObject({ portals: Type.Array(PortalSummarySchema) });
//#endregion
export { PortalOpenParamsSchema as a, PortalListResultSchema as i, PortalCloseResultSchema as n, PortalSummarySchema as o, PortalListParamsSchema as r, PortalCloseParamsSchema as t };
