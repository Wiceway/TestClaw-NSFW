//#region packages/model-catalog-core/src/model-catalog-refs.d.ts
type ProviderModelRef = {
  provider: string;
  model: string;
};
//#endregion
//#region packages/media-generation-core/src/model-ref.d.ts
/** Provider/model pair parsed from a generation model reference like `provider/model`. */
type ParsedGenerationModelRef = ProviderModelRef;
/** Parses strict generation model refs and rejects missing provider or model segments. */
declare function parseGenerationModelRef(raw: string | undefined): ProviderModelRef | null;
//#endregion
export { parseGenerationModelRef as n, ParsedGenerationModelRef as t };