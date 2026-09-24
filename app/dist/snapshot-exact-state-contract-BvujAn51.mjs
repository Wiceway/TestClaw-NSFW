import { E as string, b as number, l as _enum, x as object } from "./schemas-qz0osXyE.mjs";
//#region src/agents/worktrees/snapshot-exact-state-contract.ts
const oid = string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u);
const exactStateRetirementSchema = object({
	ownerKind: _enum([
		"manual",
		"session",
		"workboard"
	]),
	ownerId: string().optional(),
	createdAt: number().finite(),
	lastActiveAt: number().finite(),
	head: oid,
	branchHead: oid,
	indexSha256: string().regex(/^[a-f0-9]{64}$/u)
}).strict();
//#endregion
export { exactStateRetirementSchema as t };
