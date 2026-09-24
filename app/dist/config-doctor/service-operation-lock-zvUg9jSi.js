import { n as resolvePreferredAssistantTmpDir } from "./tmp-testclaw-dir-B_iJhgq7.js";
import { n as sha256Hex } from "./node-crypto-p3a5nOcB.js";
import "./crypto-digest-BPwjfEnk.js";
import { r as withFileLock } from "./file-lock-XibtmZie.js";
import { t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-BvLK_tcK.js";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DKTfQpId.js";
import { i as assertGatewayServiceUpdateCurrent } from "./service-update-authority-I83SnBXH.js";
import { s as resolveSystemdServiceName } from "./systemd-service-files-Bb2bJdgP.js";
import { u as resolveTaskName } from "./schtasks-layout-DGcLQNsp.js";
import { n as resolveLaunchAgentLabel } from "./launchd-label--1tgJye2.js";
import { m as resolveLaunchAgentGuiDomain } from "./launchd-runtime-CoXJr0nG.js";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/daemon/service-operation-lock.ts
const scopes = new AsyncLocalStorage();
/** A read borrows the existing lifetime; it never creates mutation custody. */
async function withSystemdServiceReadBinding(env, create, read, deadline) {
	const expired = () => /* @__PURE__ */ new Error("Original systemd read admission deadline expired.");
	if (deadline !== void 0 && performance.now() >= deadline) throw expired();
	const scope = scopes.getStore()?.get(resolveGatewayServiceOperationLockPath(env));
	const key = JSON.stringify([
		env.HOME,
		env.TESTCLAW_PROFILE,
		resolveSystemdServiceName(env),
		env.TESTCLAW_STATE_DIR,
		env.XDG_RUNTIME_DIR,
		env.DBUS_SESSION_BUS_ADDRESS
	]);
	if (scope) {
		if (!scope.active || scope.systemdRead && scope.systemdRead.key !== key) throw new Error("Original systemd read scope is closed or selects a different manager.");
		scope.systemdRead ??= {
			key,
			binding: create()
		};
		const retained = scope.systemdRead.binding;
		const work = Promise.resolve().then(async () => {
			const binding = await awaitWithinDeadline(() => retained, deadline, () => performance.now());
			if (binding === ABSOLUTE_DEADLINE_EXPIRED) throw expired();
			if (!scope.active) throw new Error("Original systemd read scope has closed.");
			binding?.verify();
			return await read(binding);
		});
		scope.pending.add(work);
		try {
			return await work;
		} finally {
			scope.pending.delete(work);
		}
	}
	const binding = await create();
	try {
		if (deadline !== void 0 && performance.now() >= deadline) throw expired();
		return await read(binding);
	} finally {
		await binding?.close();
	}
}
/** Serialize native effects and original-file capture using the shipped file-lock
* owner. This lock does not attest a stopped gateway or replace native identity
* inspection; stopped-state capture additionally holds the gateway coordinator.
*/
async function withGatewayServiceOperationLock(env, operation) {
	assertGatewayServiceUpdateCurrent();
	const file = resolveGatewayServiceOperationLockPath(env);
	const assertResourceUnborrowed = (targetPath) => createManagedHandoffLeaseStore().assertSourceUnborrowed(targetPath);
	assertResourceUnborrowed(file);
	const inherited = scopes.getStore();
	const parent = inherited?.get(file);
	const assertScope = (scope) => {
		assertGatewayServiceUpdateCurrent();
		if (!scope.active) throw new Error("Native service operation ownership has closed.");
		assertResourceUnborrowed(file);
	};
	if (parent?.active) {
		let active = true;
		const work = Promise.resolve().then(() => {
			assertScope(parent);
			return operation(() => {
				assertScope(parent);
				if (!active) throw new Error("Native service operation ownership has closed.");
			});
		});
		parent.pending.add(work);
		try {
			return await work;
		} finally {
			active = false;
			parent.pending.delete(work);
		}
	}
	const scope = {
		active: false,
		pending: /* @__PURE__ */ new Set()
	};
	const next = new Map(inherited);
	next.set(file, scope);
	return await withFileLock(file, {
		retries: {
			retries: 120,
			factor: 1.1,
			minTimeout: 25,
			maxTimeout: 250
		},
		stale: 3e4,
		staleRecovery: "remove-if-definitely-stale",
		assertResourceUnborrowed
	}, async () => scopes.run(next, async () => {
		scope.active = true;
		const [outcome] = await Promise.allSettled([Promise.resolve().then(() => {
			assertScope(scope);
			return operation(() => assertScope(scope));
		})]);
		const failures = [];
		while (scope.pending.size) for (const result of await Promise.allSettled(scope.pending)) if (result.status === "rejected") failures.push(result.reason);
		scope.active = false;
		try {
			await (await scope.systemdRead?.binding)?.close();
		} catch (error) {
			failures.push(error);
		}
		if (failures.length) throw new AggregateError(outcome.status === "rejected" ? [outcome.reason, ...failures] : failures, "Native service operation did not settle successfully.");
		if (outcome.status === "rejected") throw outcome.reason instanceof Error ? outcome.reason : new Error("Native service operation failed.", { cause: outcome.reason });
		return outcome.value;
	}));
}
function resolveGatewayServiceOperationLockPath(env) {
	const identity = process.platform === "darwin" ? `launchd:${resolveLaunchAgentGuiDomain()}/${resolveLaunchAgentLabel(env)}` : process.platform === "win32" ? `schtasks:${resolveTaskName(env).toLowerCase()}` : `systemd:${resolveSystemdServiceName(env)}`;
	return path.join(resolvePreferredAssistantTmpDir(), `service-lifecycle-${sha256Hex(identity)}`);
}
//#endregion
export { withSystemdServiceReadBinding as n, withGatewayServiceOperationLock as t };
