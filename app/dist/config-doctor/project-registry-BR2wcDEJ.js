import { D as withAgentRosterFactsBatch, d as resolveAgentWorkspaceDir, j as listAgentIds } from "./agent-scope-config-BEuqweC1.js";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-CICmT-bh.js";
import { t as captureAssistantStateWorkerContext } from "./testclaw-state-worker-context-CE_q2-wY.js";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-CGWZEj0Z.js";
import "./agent-scope-BiRi-Smp.js";
import { c as runAssistantStateWriteTransaction } from "./testclaw-state-db-BAeysXj_.js";
import { t as createAssistantStateSchemaEnsurer } from "./testclaw-state-feature-schema-Du6iKbeX.js";
import { t as withAssistantStateLease } from "./testclaw-state-lease-C24liE0k.js";
import { d as runGit, o as insideGitCheckout } from "./git-C6UqFKot.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/projects/project-checkout.ts
const PROJECT_CHECKOUT_LEASE_MS = 3e4;
const PROJECT_CHECKOUT_WAIT_MS = 3e4;
var ProjectCheckoutError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ProjectCheckoutError";
	}
};
async function withProjectCheckoutLifecycle(repoRoot, options, run) {
	return await withAssistantStateLease({
		scope: "projects.checkout",
		key: repoRoot,
		signal: options.signal,
		database: {
			scope: "shared",
			options
		},
		leaseMs: PROJECT_CHECKOUT_LEASE_MS,
		waitMs: PROJECT_CHECKOUT_WAIT_MS,
		leaseLabel: "project checkout lease",
		operationLabel: "projects.checkout.lease"
	}, run);
}
async function resolveProjectDirectory(projectPath) {
	const requested = await fs.realpath(projectPath).catch(() => {
		throw new ProjectCheckoutError(`project path does not exist: ${projectPath}`);
	});
	if (!(await fs.stat(requested).catch(() => null))?.isDirectory()) throw new ProjectCheckoutError(`project path is not a directory: ${projectPath}`);
	return requested;
}
async function resolveProjectCheckout(projectPath) {
	const requested = await resolveProjectDirectory(projectPath);
	if (!insideGitCheckout(requested)) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
	const rootResult = await runGit(requested, ["rev-parse", "--show-toplevel"]);
	if (rootResult.code !== 0) throw new ProjectCheckoutError(`project path is not a git checkout: ${projectPath}`);
	const repoRoot = await fs.realpath(rootResult.stdout.trim()).catch(() => {
		throw new ProjectCheckoutError(`project checkout root is unavailable: ${projectPath}`);
	});
	if ((await runGit(repoRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	])).code !== 0) throw new ProjectCheckoutError(`project checkout has no commits: ${projectPath}`);
	const originResult = await runGit(repoRoot, [
		"config",
		"--get",
		"remote.origin.url"
	]);
	const originUrl = originResult.code === 0 ? originResult.stdout.trim() : "";
	return {
		path: requested,
		repoRoot,
		...originUrl ? { originUrl } : {}
	};
}
//#endregion
//#region src/projects/project-registration.ts
async function prepareProjectRegistration(input) {
	const { path: requestedPath, name, originUrl, source } = input;
	const checkout = await resolveProjectCheckout(requestedPath);
	return {
		requestedPath,
		project: {
			displayName: name?.trim() || path.basename(checkout.repoRoot) || "Project",
			repoRoot: checkout.repoRoot,
			originUrl: originUrl ?? checkout.originUrl,
			source
		}
	};
}
async function registerPreparedProjectRegistry(prepared, lease, context, onRegistered) {
	const current = await resolveProjectCheckout(prepared.project.repoRoot);
	lease.assertOwned();
	if (current.repoRoot !== prepared.project.repoRoot) throw new ProjectCheckoutError(`project checkout changed while registering: ${prepared.requestedPath}`);
	const { runWithAssistantStateLeaseWorker } = await import("./testclaw-state-lease-worker-storage-_7QqlPf9.js");
	return await runWithAssistantStateLeaseWorker(lease, context, async (scope, identity) => {
		const project = await scope.execute({
			type: "projects.insert",
			input: {
				project: prepared.project,
				lease: identity
			}
		});
		onRegistered?.();
		return project;
	});
}
async function registerResolvedProject(input, options) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureAssistantStateWorkerContext({
		path: options.path,
		env
	});
	const prepared = await prepareProjectRegistration(input);
	return await withProjectCheckoutLifecycle(prepared.project.repoRoot, {
		path: context.admission.databasePath,
		env
	}, (lease) => registerPreparedProjectRegistry(prepared, lease, context));
}
//#endregion
//#region src/projects/project-registry.kernel.ts
const ensureProjectRegistrySchema = createAssistantStateSchemaEnsurer({
	table: "projects",
	operationLabel: "projects.registry.schema.ensure"
});
function removeProjectCheckoutReferenceInDatabase(database, project) {
	const db = getNodeSqliteKysely(database);
	const current = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("id", "=", project.id));
	if (!current) return "missing";
	if (current.source !== "cloned" || current.repo_root !== project.repoRoot) return "changed";
	executeSqliteQuerySync(database, db.deleteFrom("projects").where("id", "=", project.id));
	const sibling = executeSqliteQueryTakeFirstSync(database, db.selectFrom("projects").selectAll().where("repo_root", "=", project.repoRoot).orderBy("id", "asc"));
	if (!sibling) return "final";
	if (sibling.source === "registered") executeSqliteQuerySync(database, db.updateTable("projects").set({
		source: "cloned",
		origin_url: sibling.origin_url ?? current.origin_url,
		updated_at_ms: Date.now()
	}).where("id", "=", sibling.id));
	return "remaining";
}
//#endregion
//#region src/projects/project-registry.ts
function workspaceProject(cfg, agentId) {
	const repoRoot = resolveAgentWorkspaceDir(cfg, agentId);
	return {
		id: `workspace:${agentId}`,
		displayName: path.basename(repoRoot) || agentId,
		repoRoot,
		source: "workspace",
		agentId
	};
}
function compareProjects(left, right) {
	const leftName = left.displayName.toLowerCase();
	const rightName = right.displayName.toLowerCase();
	if (leftName !== rightName) return leftName < rightName ? -1 : 1;
	return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
}
async function registerProjectRegistry(input, options = {}) {
	return await registerResolvedProject({
		...input,
		source: "registered"
	}, options);
}
function listWorkspaceProjects(cfg) {
	return withAgentRosterFactsBatch(cfg, () => listAgentIds(cfg).map((agentId) => workspaceProject(cfg, agentId)).toSorted(compareProjects));
}
async function listProjectRegistry(cfg, options = {}) {
	const context = captureAssistantStateWorkerContext(options);
	const workspaces = listWorkspaceProjects(cfg);
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	const stored = await executeAssistantStateWorker(context, {
		type: "projects.list",
		input: void 0
	});
	return [...workspaces, ...stored].toSorted(compareProjects);
}
function resolveWorkspaceProject(cfg, id) {
	if (!id.startsWith("workspace:")) return;
	const agentId = id.slice(10);
	return listAgentIds(cfg).includes(agentId) ? workspaceProject(cfg, agentId) : void 0;
}
async function resolveProjectRegistry(cfg, id, options = {}) {
	if (id.startsWith("workspace:")) return resolveWorkspaceProject(cfg, id);
	return await readStoredProjectRegistry(captureAssistantStateWorkerContext(options), id);
}
async function readStoredProjectRegistry(context, id) {
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return await executeAssistantStateWorker(context, {
		type: "projects.resolve",
		input: { id }
	});
}
/** Retain the original database and reacquire the selected checkout for each finite operation. */
async function selectStoredProjectRegistry(id, options = {}) {
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureAssistantStateWorkerContext({
		path: options.path,
		env
	});
	const signal = options.signal;
	const project = await readStoredProjectRegistry(context, id);
	if (!project) return;
	const repoRoot = project.repoRoot;
	return {
		project,
		withRollback: async (run) => await withProjectCheckoutLifecycle(repoRoot, {
			path: context.admission.databasePath,
			env
		}, async (lease) => {
			const { withAssistantStateLeaseWorkerAdmission } = await import("./testclaw-state-lease-worker-owner-SsDdwGng.js");
			return await withAssistantStateLeaseWorkerAdmission(lease, context.admission.databasePath, async (admission) => await run(() => {
				context.admission.assertCurrent();
				admission.assertCurrent();
			}));
		}),
		withCurrent: async (run) => {
			const acquisition = new AbortController();
			const abortAcquisition = () => acquisition.abort(signal?.reason);
			signal?.addEventListener("abort", abortAcquisition, { once: true });
			if (signal?.aborted) abortAcquisition();
			try {
				return await withProjectCheckoutLifecycle(repoRoot, {
					path: context.admission.databasePath,
					env,
					signal: acquisition.signal
				}, async (lease) => {
					signal?.removeEventListener("abort", abortAcquisition);
					const operationSignal = signal ? AbortSignal.any([signal, lease.signal]) : lease.signal;
					try {
						const { withAssistantStateLeaseWorkerAdmission } = await import("./testclaw-state-lease-worker-owner-SsDdwGng.js");
						const { runAssistantStateWorkerOperation } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
						return await withAssistantStateLeaseWorkerAdmission(lease, context.admission.databasePath, async (admission) => {
							const assertCheckoutCurrent = () => {
								context.admission.assertCurrent();
								admission.assertCurrent();
							};
							const assertCurrent = () => {
								assertCheckoutCurrent();
								operationSignal.throwIfAborted();
							};
							return await runAssistantStateWorkerOperation(context, async (scope) => {
								const current = await scope.execute({
									type: "projects.resolve",
									input: { id }
								});
								assertCurrent();
								return await run({
									project: current,
									assertCurrent,
									assertCheckoutCurrent,
									signal: operationSignal
								});
							}, {
								assertCurrent,
								createAdmission: admission.createAdmission
							});
						});
					} finally {
						signal?.addEventListener("abort", abortAcquisition, { once: true });
						if (signal?.aborted) abortAcquisition();
					}
				});
			} finally {
				signal?.removeEventListener("abort", abortAcquisition);
			}
		}
	};
}
function removeProjectCheckoutReference(project, lease, options = {}) {
	ensureProjectRegistrySchema(options);
	return runAssistantStateWriteTransaction(({ db: sqlite }) => {
		lease.assertOwnedInTransaction(sqlite);
		return removeProjectCheckoutReferenceInDatabase(sqlite, project);
	}, options, { operationLabel: "projects.registry.checkout-reference.remove" });
}
async function resolveProjectCloneRefreshOwner(project, lease, context) {
	const { runWithAssistantStateLeaseWorker } = await import("./testclaw-state-lease-worker-storage-_7QqlPf9.js");
	return await runWithAssistantStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
		type: "projects.resolveRefreshOwner",
		input: {
			project,
			lease: identity
		}
	}));
}
async function resolveRecordedProjectRoot(projectPath, options = {}) {
	const context = captureAssistantStateWorkerContext(options);
	const repoRoot = await fs.realpath(projectPath).catch(() => void 0);
	if (!repoRoot) return;
	const { executeAssistantStateWorker } = await import("./testclaw-state-worker-store-C-YrKqH_.js");
	return await executeAssistantStateWorker(context, {
		type: "projects.findRoot",
		input: { repoRoot }
	});
}
async function removeProjectRegistry(project, options = {}) {
	const selectedProject = {
		id: project.id,
		repoRoot: project.repoRoot,
		source: project.source,
		originUrl: project.originUrl
	};
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureAssistantStateWorkerContext({
		path: options.path,
		env
	});
	return await withProjectCheckoutLifecycle(selectedProject.repoRoot, {
		path: context.admission.databasePath,
		env
	}, async (lease) => {
		const { runWithAssistantStateLeaseWorker } = await import("./testclaw-state-lease-worker-storage-_7QqlPf9.js");
		return await runWithAssistantStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
			type: "projects.remove",
			input: {
				project: selectedProject,
				lease: identity
			}
		}));
	});
}
//#endregion
export { removeProjectRegistry as a, resolveRecordedProjectRoot as c, prepareProjectRegistration as d, registerPreparedProjectRegistry as f, withProjectCheckoutLifecycle as g, resolveProjectDirectory as h, removeProjectCheckoutReference as i, resolveWorkspaceProject as l, resolveProjectCheckout as m, listWorkspaceProjects as n, resolveProjectCloneRefreshOwner as o, ProjectCheckoutError as p, registerProjectRegistry as r, resolveProjectRegistry as s, listProjectRegistry as t, selectStoredProjectRegistry as u };
