import { r as TestclawConfig, t as ConfigFileSnapshot } from "./types.testclaw-C-wX50Nb.js";
import "./zod-schema.implicit-mentions-Du1YLL_X.js";
import { _ as ConfigMutationBase, a as readConfigFileSnapshotForWrite, c as ConfigWriteResult, l as ConfigWriteAfterWrite, s as ConfigWriteOptions, u as ConfigWriteFollowUp } from "./io-D98w0DmD.js";
import "./types-RdRiGrAp.js";
import "./manifest-registry-BbQfGHTp.js";
import "./paths-CQ2ss5JU.js";
//#region src/config/mutate.d.ts
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: TestclawConfig;
  persistedHash: string | null;
  persistedSourceConfig?: TestclawConfig;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
type ConfigMutationIO = {
  env?: NodeJS.ProcessEnv;
  readConfigFileSnapshotForWrite: typeof readConfigFileSnapshotForWrite;
  writeConfigFile: (cfg: TestclawConfig, options?: ConfigWriteOptions) => Promise<ConfigWriteResult | void>;
};
type ConfigMutationContext = {
  snapshot: ConfigFileSnapshot;
  previousHash: string | null;
  attempt: number;
};
type ConfigTransformResult<T> = {
  nextConfig: TestclawConfig;
  result?: T;
};
type ConfigMutationCommitParams = {
  nextConfig: TestclawConfig;
  snapshot: ConfigFileSnapshot;
  baseHash?: string;
  writeOptions?: ConfigWriteOptions;
  afterWrite: ConfigWriteAfterWrite;
  io?: ConfigMutationIO;
};
type ConfigMutationCommitResult = {
  config: TestclawConfig;
  persistedHash: string | null;
  persistedSourceConfig?: TestclawConfig;
  afterWrite?: ConfigWriteAfterWrite;
};
type ConfigMutationCommit = (params: ConfigMutationCommitParams) => Promise<ConfigMutationCommitResult>;
type TransformConfigFileParams<T> = {
  base?: ConfigMutationBase;
  baseHash?: string;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
  commit?: ConfigMutationCommit;
  transform: (currentConfig: TestclawConfig, context: ConfigMutationContext, preservation: Pick<ConfigWriteOptions, "envSnapshotForRestore">) => Promise<ConfigTransformResult<T>> | ConfigTransformResult<T>;
};
type ConfigMutationResult<T> = ConfigReplaceResult & {
  result: T | undefined;
  attempts: number;
};
type ConfigReplaceInput = {
  sourceConfig: TestclawConfig;
  nextConfig?: never;
} | {
  nextConfig: TestclawConfig;
  sourceConfig?: never;
};
type ConfigReplaceParams = ConfigReplaceInput & {
  baseHash?: string;
  snapshot?: ConfigFileSnapshot;
  afterWrite?: ConfigWriteOptions["afterWrite"];
  writeOptions?: ConfigWriteOptions;
  io?: ConfigMutationIO;
};
declare function replaceConfigFile(params: ConfigReplaceParams): Promise<ConfigReplaceResult>;
type MutateConfigFileParams<T> = Omit<TransformConfigFileParams<T>, "transform" | "commit"> & {
  mutate: (draft: TestclawConfig, context: ConfigMutationContext) => Promise<T | void> | T | void;
};
declare function mutateConfigFile<T = void>(params: MutateConfigFileParams<T>): Promise<ConfigMutationResult<T>>;
//#endregion
export { mutateConfigFile as n, replaceConfigFile as r, ConfigReplaceResult as t };