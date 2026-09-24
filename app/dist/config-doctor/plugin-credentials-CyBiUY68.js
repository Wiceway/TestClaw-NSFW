import { t as lazyCompile } from "./protocol-validator-Bso29gFX.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/plugin-credentials.ts
const closed = { additionalProperties: false };
const text = Type.String({
	minLength: 1,
	maxLength: 512
});
const path = Type.Array(Type.Union([text, Type.Integer({ minimum: 0 })]), {
	minItems: 5,
	maxItems: 32
});
const PluginCredentialDescriptorSchema = Type.Object({
	path,
	label: text,
	envVars: Type.Array(text, { maxItems: 32 }),
	placeholder: Type.Optional(text),
	signupUrl: Type.Optional(text),
	requiresCredential: Type.Optional(Type.Boolean())
}, closed);
const reference = Type.Object({
	source: Type.Union([
		Type.Literal("env"),
		Type.Literal("file"),
		Type.Literal("exec"),
		Type.Literal("store")
	]),
	provider: text,
	id: Type.String({
		minLength: 1,
		maxLength: 4096
	})
}, closed);
const PluginCredentialInspectionSchema = Type.Union([
	Type.Object({ kind: Type.Literal("missing") }, closed),
	Type.Object({
		kind: Type.Literal("literal"),
		value: Type.Optional(Type.String())
	}, closed),
	Type.Object({ kind: Type.Literal("invalid") }, closed),
	Type.Object({
		kind: Type.Literal("environment"),
		envVar: text
	}, closed),
	Type.Object({
		kind: Type.Literal("reference"),
		ref: reference,
		unresolved: Type.Boolean()
	}, closed)
]);
/** An admin can inspect only a credential advertised by this installed plugin, at this revision. */
const PluginsCredentialsInspectParamsSchema = Type.Object({
	pluginId: text,
	path,
	baseHash: text,
	reveal: Type.Optional(Type.Boolean())
}, closed);
Type.Object({
	baseHash: text,
	credential: PluginCredentialInspectionSchema
}, closed);
const validatePluginsCredentialsInspectParams = /* @__PURE__ */ lazyCompile(PluginsCredentialsInspectParamsSchema);
//#endregion
export { validatePluginsCredentialsInspectParams as n, PluginCredentialDescriptorSchema as t };
