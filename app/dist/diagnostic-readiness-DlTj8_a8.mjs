import { r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { r as resolveStateDir } from "./state-dir-Bicqquql.mjs";
import { p as resolveConfigPath, v as resolveGatewayPort } from "./paths-DvpAEtA8.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-PRvzp9PM.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-CMKMxZa9.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-D7QjtIL9.mjs";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-CdeEw3KZ.mjs";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-kSPonTZ4.mjs";
import { a as resolveGatewayService } from "./service-BWH3Jzzo.mjs";
import { n as createGatewayRestartDeadline } from "./restart-health-deadline-CiLW_zjg.mjs";
import { h as isImplicitLocalGatewayTarget } from "./call-Cm2P5Cd6.mjs";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-K5-Jxion.mjs";
import { i as resolveGatewayRestartProbeContext } from "./restart-health-probe-BWQHWIfG.mjs";
import { n as waitForGatewayHealthyRestart } from "./restart-health-DODQwMtT.mjs";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-BnbTHsGr.mjs";
//#region src/cli/daemon-cli/diagnostic-readiness.ts
/** Returns undefined when the original diagnostic path should probe without a startup wait. */
async function waitForGatewayDiagnosticReadiness(opts) {
	if (!await isImplicitLocalGatewayTarget(opts)) return;
	const probeContext = opts.config ? {
		config: opts.config,
		auth: (await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: opts.config,
			mode: "local",
			explicitAuth: {
				token: opts.token,
				password: opts.password
			}
		})).auth
	} : await resolveGatewayRestartProbeContext(process.env, {
		token: opts.token,
		password: opts.password
	});
	if (!probeContext.auth?.token && !probeContext.auth?.password && probeContext.config.gateway?.auth?.mode !== "none") return;
	const port = opts.localPortOverride ?? resolveGatewayPort(probeContext.config);
	const nativeService = resolveGatewayService();
	let nativeCommand;
	let nativeServiceAbsent = false;
	const deadline = createGatewayRestartDeadline({ timeoutMs: Math.max(0, Math.min(opts.timeoutMs ?? DEFAULT_RESTART_HEALTH_TIMEOUT_MS, opts.deadlineMs === void 0 ? Infinity : opts.deadlineMs - performance.now())) });
	try {
		const snapshot = await withCommandProcessScope(() => waitForGatewayHealthyRestart({
			port,
			timeoutMs: opts.timeoutMs ?? DEFAULT_RESTART_HEALTH_TIMEOUT_MS,
			deadline,
			deadlineOutcome: "snapshot",
			probeContext,
			probeHosts: LOOPBACK_PORT_PROBE_HOSTS,
			requirePluginHealth: false,
			waitForMissingService: false,
			onProgress: opts.onProgress,
			service: {
				readCommand: async () => null,
				readRuntime: async (env, options) => {
					const owner = await deadline.read("diagnostic:owner", async () => readGatewayOwnerLease({
						env,
						port
					}));
					if (owner?.state === "live" && (owner.mode === "foreground" || owner.supervisor?.kind === "external")) return {
						status: "running",
						pid: owner.pid
					};
					const remainingReadOptions = () => ({
						...options,
						timeoutMs: Math.max(1, Math.min(options?.timeoutMs ?? Infinity, deadline.remainingMs()))
					});
					const command = await (nativeCommand ??= (async () => {
						nativeServiceAbsent = await deadline.read("diagnostic:service-absence", async () => nativeService.isAbsent?.({
							env,
							timeoutMs: remainingReadOptions().timeoutMs
						})) === true;
						deadline.signal.throwIfAborted();
						return nativeServiceAbsent ? null : deadline.read("diagnostic:service-command", () => nativeService.readCommand(env, {
							...remainingReadOptions(),
							requireEffective: true
						}));
					})());
					deadline.signal.throwIfAborted();
					const readNativeRuntime = () => deadline.read("diagnostic:native-runtime", () => nativeService.readRuntime(env, remainingReadOptions()));
					const serviceEnv = mergeGatewayServiceEnv(env, command);
					const servicePort = parseTcpPortFromArgs(command?.programArguments) ?? resolveGatewayPort(probeContext.config, serviceEnv);
					if (!command || servicePort !== port || resolveStateDir(serviceEnv) !== resolveStateDir(env) || resolveConfigPath(serviceEnv) !== resolveConfigPath(env)) {
						const legacyOwner = await deadline.read("diagnostic:legacy-owner", () => readActiveGatewayLockIdentity({
							env,
							requireInspection: true,
							timeoutMs: deadline.remainingMs(),
							signal: deadline.signal
						}));
						if (legacyOwner?.port === port) return {
							status: "running",
							pid: legacyOwner.pid
						};
						return nativeServiceAbsent || command !== null ? {
							status: "unknown",
							missingUnit: true
						} : readNativeRuntime();
					}
					return readNativeRuntime();
				}
			}
		}), deadline.signal);
		return snapshot.waitOutcome === "stopped-free" && snapshot.runtime.missingUnit ? void 0 : snapshot;
	} finally {
		deadline.dispose();
	}
}
//#endregion
export { waitForGatewayDiagnosticReadiness as t };
