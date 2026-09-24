import { t as closedObject } from "./closed-object-dq04TDCx.js";
import { S as WorkerAdmissionHandshakeSchema } from "./worker-admission-D2iU0J8C.js";
import { i as UPDATE_RUN_TRIGGERS, n as UPDATE_RUN_STATUSES, r as UPDATE_RUN_STEP_STATUSES, t as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BYZF4sMi.js";
import { a as NonEmptyString, c as UserProfileIdSchema, n as GatewayClientIdSchema, r as GatewayClientModeSchema, s as SessionLabelString } from "./primitives-BBZtPseE.js";
import { r as SessionPersonSchema } from "./session-participant-HHyv8kPN.js";
import { l as SessionVisibilitySchema, n as SessionOwnerSchema } from "./sessions-row-CwTWD3JH.js";
import { t as AgentOwnershipSchema } from "./agents-models-skills-Bo_uJkDM.js";
import { n as ControlUiPluginWidgetKindSchema, r as PluginJsonValueSchema, t as ControlUiPluginTabSchema, w as ControlUiLinkReaderDescriptorSchema } from "./plugins-UZjApU8q.js";
import { t as GatewayEventLoopHealthSchema } from "./runtime-vitals-D8Dhll4g.js";
import { g as HumanMentionsSchema, r as ChatAttachmentsSchema } from "./logs-chat-qumy6V9-.js";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/update-runs.ts
const text = Type.String({ maxLength: 1024 });
const timestamp = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
const runId = Type.String({ pattern: "^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$" });
const phase = Type.Enum(UPDATE_RUN_PHASES);
const status = Type.Enum(UPDATE_RUN_STATUSES);
const version = closedObject({
	version: Type.Optional(Type.Union([text, Type.Null()])),
	sha: Type.Optional(Type.Union([text, Type.Null()])),
	buildId: Type.Optional(Type.Union([text, Type.Null()]))
});
const driver = closedObject({
	host: Type.String({
		minLength: 1,
		maxLength: 255
	}),
	pid: Type.Integer({
		minimum: 1,
		maximum: Number.MAX_SAFE_INTEGER
	}),
	startIdentity: Type.String({
		pattern: "^\\d+$",
		maxLength: 128
	})
});
const snapshotLocation = closedObject({
	kind: Type.Enum([
		"explicit-tmpdir",
		"state-volume",
		"system-tmpdir"
	]),
	directory: text
});
const snapshotBytes = Type.Integer({
	minimum: 0,
	maximum: Number.MAX_SAFE_INTEGER
});
const destinationPath = Type.String({ maxLength: 240 });
const nullableDestinationPath = Type.Union([destinationPath, Type.Null()]);
/** Wire projection of the canonical update ledger record. */
const UpdateRunRecordSchema = closedObject({
	runId,
	createdAtMs: timestamp,
	updatedAtMs: timestamp,
	trigger: Type.Enum(UPDATE_RUN_TRIGGERS),
	phase,
	status,
	reason: Type.Union([text, Type.Null()]),
	origin: closedObject({
		driver: Type.Optional(driver),
		previousDrivers: Type.Optional(Type.Array(driver, { maxItems: 7 })),
		requester: Type.Optional(closedObject({
			channel: Type.Optional(text),
			accountId: Type.Optional(text),
			senderId: Type.Optional(text),
			authorizationSource: Type.Optional(text)
		})),
		sessionKey: Type.Optional(text),
		deliveryContext: Type.Optional(closedObject({
			channel: Type.Optional(text),
			to: Type.Optional(text),
			accountId: Type.Optional(text),
			threadId: Type.Optional(text)
		})),
		campaignId: Type.Optional(text),
		doctorHint: Type.Optional(text),
		nextAction: Type.Optional(text)
	}),
	target: closedObject({
		channel: Type.Optional(text),
		tag: Type.Optional(text),
		kind: Type.Optional(Type.Enum(["package", "git"])),
		version: Type.Optional(text),
		sha: Type.Optional(text),
		installationMethod: Type.Optional(Type.Union([Type.Enum([
			"git-checkout",
			"npm-global",
			"pnpm-global",
			"bun-global",
			"managed-service"
		]), Type.Null()]))
	}),
	before: version,
	after: version,
	steps: Type.Array(closedObject({
		step: text,
		status: Type.Enum(UPDATE_RUN_STEP_STATUSES),
		startedAtMs: Type.Optional(timestamp),
		endedAtMs: Type.Optional(timestamp),
		exitCode: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
		detail: Type.Optional(text),
		failureFacts: Type.Optional(Type.Array(closedObject({
			check: Type.String({ maxLength: 128 }),
			code: Type.String({ maxLength: 80 }),
			message: Type.Optional(Type.String({ maxLength: 200 })),
			affectedKey: Type.Optional(Type.String({ maxLength: 128 })),
			pluginId: Type.Optional(Type.String({ maxLength: 80 })),
			errorName: Type.Optional(Type.Union([Type.String({ maxLength: 80 }), Type.Null()])),
			location: Type.Optional(Type.Union([Type.String({ maxLength: 160 }), Type.Null()])),
			destination: Type.Optional(closedObject({
				ownership: Type.Enum(["foreign", "unknown"]),
				cause: Type.Enum([
					"package-mismatch",
					"launcher-mismatch",
					"permission",
					"probe-failure",
					"unreadable-layout"
				]),
				destinationKind: Type.Enum(["npm-global", "unknown"]),
				prefix: nullableDestinationPath,
				packageRoot: nullableDestinationPath,
				runningRoot: destinationPath,
				runningPrefix: nullableDestinationPath,
				launcher: nullableDestinationPath,
				launcherTarget: nullableDestinationPath
			}))
		}), { maxItems: 5 })),
		configChange: Type.Optional(Type.Union([closedObject({
			kind: Type.Literal("key"),
			key: text
		}), closedObject({
			kind: Type.Literal("migration"),
			message: text
		})])),
		configWriteRefusal: Type.Optional(closedObject({
			reason: text,
			message: text,
			keys: Type.Array(text, { maxItems: 32 })
		})),
		snapshotCapacity: Type.Optional(closedObject({
			sqliteBytes: snapshotBytes,
			pluginBytes: Type.Union([snapshotBytes, Type.Null()]),
			requiredBytes: snapshotBytes,
			reason: Type.Enum([
				"explicit-tmpdir",
				"state-volume",
				"system-tmpdir",
				"snapshot-capacity-insufficient",
				"snapshot-location-unavailable"
			]),
			candidates: Type.Array(closedObject({
				...snapshotLocation.properties,
				availableBytes: Type.Union([snapshotBytes, Type.Null()]),
				allocationError: Type.Optional(text)
			}), { maxItems: 3 }),
			selection: Type.Union([snapshotLocation, Type.Null()])
		}))
	}), { maxItems: 128 }),
	verification: closedObject({
		rollbackOutcome: Type.Optional(Type.Union([closedObject({
			status: Type.Enum([
				"not-needed",
				"not-attempted",
				"succeeded",
				"failed"
			]),
			reason: Type.String({ maxLength: 512 })
		}), Type.Null()])),
		recovery: Type.Optional(Type.Union([
			closedObject({
				serviceRestartSafe: Type.Literal(true),
				packageRollbackVerified: Type.Optional(Type.Literal(true)),
				version: Type.String({ minLength: 1 }),
				buildId: Type.Optional(Type.String({
					minLength: 1,
					maxLength: 96
				})),
				service: Type.Optional(Type.Enum(["healthy", "failed"])),
				reason: Type.Optional(Type.String({ minLength: 1 }))
			}),
			closedObject({
				serviceRestartSafe: Type.Literal(false),
				packageRollbackVerified: Type.Optional(Type.Boolean()),
				reason: Type.Enum([
					"source-rollback-failed",
					"state-migration-started",
					"manager-unavailable",
					"deps-install-failed",
					"build-failed",
					"rollback-checkout-dirty",
					"runtime-verification-failed"
				])
			}),
			Type.Null()
		])),
		booted: Type.Optional(Type.Boolean()),
		runningVersion: Type.Optional(text),
		runningBuildId: Type.Optional(text),
		serviceRunning: Type.Optional(Type.Boolean()),
		pid: Type.Optional(timestamp),
		port: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: 65535
		})),
		versionMatch: Type.Optional(Type.Boolean()),
		pluginErrors: Type.Optional(Type.Array(text, { maxItems: 32 })),
		channelsReady: Type.Optional(Type.Boolean()),
		readyz: Type.Optional(Type.Boolean()),
		settled: Type.Optional(Type.Boolean()),
		noticeDelivered: Type.Optional(Type.Boolean()),
		doctorHint: Type.Optional(text)
	}),
	repair: Type.Array(closedObject({
		attempt: Type.Integer({
			minimum: 1,
			maximum: Number.MAX_SAFE_INTEGER
		}),
		status: Type.Enum([
			"succeeded",
			"failed",
			"skipped"
		]),
		startedAtMs: timestamp,
		endedAtMs: Type.Optional(timestamp),
		summary: Type.Optional(text),
		reason: Type.Optional(text)
	}), { maxItems: 16 }),
	confirmedAtMs: Type.Union([timestamp, Type.Null()]),
	finishedAtMs: Type.Union([timestamp, Type.Null()]),
	downtimeMs: Type.Union([timestamp, Type.Null()])
});
const UpdateRunsGetParamsSchema = closedObject({ runId });
closedObject({ run: Type.Union([UpdateRunRecordSchema, Type.Null()]) });
const UpdateRunsListParamsSchema = closedObject({ limit: Type.Optional(Type.Integer({
	minimum: 1,
	maximum: 100
})) });
closedObject({ runs: Type.Array(UpdateRunRecordSchema, { maxItems: 100 }) });
closedObject({
	runId,
	phase,
	status,
	updatedAtMs: timestamp
});
closedObject({
	runId,
	ok: Type.Boolean(),
	result: Type.Unknown(),
	ackDelivered: Type.Optional(Type.Boolean()),
	ackQueued: Type.Optional(Type.Boolean()),
	acknowledgement: Type.Optional(Type.String()),
	code: Type.Optional(Type.String()),
	message: Type.Optional(Type.String()),
	handoff: Type.Optional(Type.Unknown()),
	restart: Type.Optional(Type.Unknown()),
	sentinel: Type.Optional(Type.Unknown())
});
//#endregion
//#region packages/gateway-protocol/src/schema/config.ts
/**
* Gateway config and update protocol schemas.
*
* These payloads carry raw config text plus optional delivery context so the
* gateway can report edits/restarts back to the originating channel.
*/
const ConfigSchemaLookupPathString = Type.String({
	minLength: 1,
	maxLength: 1024,
	pattern: "^[A-Za-z0-9_./\\[\\]\\-*]+$"
});
const ConfigDeliveryContextSchema = closedObject({
	channel: Type.Optional(Type.String()),
	to: Type.Optional(Type.String()),
	accountId: Type.Optional(Type.String()),
	threadId: Type.Optional(Type.Union([Type.String(), Type.Number()]))
});
/** Empty request payload for reading the current raw config. */
const ConfigGetParamsSchema = closedObject({});
/** Full raw config replacement request with optional base hash guard. */
const ConfigSetParamsSchema = closedObject({
	raw: NonEmptyString,
	baseHash: Type.Optional(NonEmptyString)
});
/** Shared config apply/patch payload with optional restart notification context. */
const ConfigApplyLikeParamProperties = {
	raw: NonEmptyString,
	baseHash: Type.Optional(NonEmptyString),
	sessionKey: Type.Optional(Type.String()),
	deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
	note: Type.Optional(Type.String()),
	restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 }))
};
/** Raw config apply request that may schedule a restart. */
const ConfigApplyParamsSchema = closedObject(ConfigApplyLikeParamProperties);
/** Raw config patch request that may schedule a restart. */
const ConfigPatchParamsSchema = closedObject({
	...ConfigApplyLikeParamProperties,
	replacePaths: Type.Optional(Type.Array(NonEmptyString, { maxItems: 256 }))
});
/** Empty request payload for fetching the generated config schema. */
const ConfigSchemaParamsSchema = closedObject({});
/** Schema lookup request for one config path. */
const ConfigSchemaLookupParamsSchema = closedObject({ path: ConfigSchemaLookupPathString });
/** Request payload for cached status or an explicit checkout refresh. */
const UpdateStatusParamsSchema = closedObject({ refreshCheckout: Type.Optional(Type.Boolean()) });
const UpdateCommitSchema = closedObject({
	sha: NonEmptyString,
	subject: Type.String({ maxLength: 120 })
});
/** Backward-compatible update availability metadata. */
const UpdateAvailableSchema = closedObject({
	currentVersion: NonEmptyString,
	latestVersion: NonEmptyString,
	channel: NonEmptyString,
	currentSha: Type.Optional(NonEmptyString),
	upstreamRef: Type.Optional(NonEmptyString),
	upstreamSha: Type.Optional(NonEmptyString),
	repositoryUrl: Type.Optional(NonEmptyString),
	commitsBehind: Type.Optional(Type.Integer({ minimum: 0 })),
	commits: Type.Optional(Type.Array(UpdateCommitSchema, { maxItems: 5 }))
});
const GitInstallMetadataProperties = {
	currentSha: Type.Optional(NonEmptyString),
	commitAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	installedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
};
const GitUpdateStatusSchema = Type.Union([
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("current")
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("behind"),
		commitsBehind: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("ahead"),
		commitsAhead: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("diverged"),
		commitsAhead: Type.Integer({ minimum: 1 }),
		commitsBehind: Type.Integer({ minimum: 1 })
	}),
	closedObject({
		...GitInstallMetadataProperties,
		status: Type.Literal("unavailable"),
		reason: Type.Union([
			Type.Literal("fetch-failed"),
			Type.Literal("no-upstream"),
			Type.Literal("no-upstream-sha"),
			Type.Literal("comparison-failed"),
			Type.Literal("git-unavailable")
		])
	})
]);
/** Authoritative automatic-update schedule and in-memory campaign state. */
const UpdateScheduleStateSchema = closedObject({
	channel: NonEmptyString,
	autoEnabled: Type.Boolean(),
	install: Type.Optional(closedObject({
		kind: Type.Union([
			Type.Literal("package"),
			Type.Literal("git"),
			Type.Literal("unknown")
		]),
		git: Type.Optional(GitUpdateStatusSchema)
	})),
	target: Type.Optional(Type.Union([closedObject({
		kind: Type.Literal("package"),
		version: NonEmptyString
	}), closedObject({
		kind: Type.Literal("git"),
		upstreamRef: NonEmptyString,
		upstreamSha: NonEmptyString,
		commitsBehind: Type.Integer({ minimum: 0 })
	})])),
	campaign: Type.Optional(closedObject({
		id: NonEmptyString,
		state: Type.Union([
			Type.Literal("waiting-for-idle"),
			Type.Literal("countdown"),
			Type.Literal("applying")
		]),
		announcedAtMs: Type.Integer({ minimum: 0 }),
		applyAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		holdUntilMs: Type.Optional(Type.Integer({ minimum: 0 })),
		forceAtMs: Type.Integer({ minimum: 0 }),
		updatedAtMs: Type.Integer({ minimum: 0 })
	}))
});
/** Validated response payload for update.status. */
const UpdateStatusResultSchema = closedObject({
	sentinel: Type.Unknown(),
	updateAvailable: Type.Union([UpdateAvailableSchema, Type.Null()]),
	activeRun: Type.Optional(UpdateRunRecordSchema),
	lastRun: Type.Optional(UpdateRunRecordSchema),
	effectiveChannel: Type.Optional(Type.Union([
		Type.Literal("stable"),
		Type.Literal("extended-stable"),
		Type.Literal("beta"),
		Type.Literal("dev")
	])),
	schedule: Type.Optional(UpdateScheduleStateSchema)
});
/** Empty request payload for deferring the active update campaign. */
const UpdateHoldParamsSchema = closedObject({});
/** Result of attempting to defer the active update campaign. */
const UpdateHoldResultSchema = closedObject({
	ok: Type.Boolean(),
	schedule: Type.Optional(UpdateScheduleStateSchema)
});
/** Request payload for running an update/restart flow with optional channel delivery context. */
const UpdateRunParamsSchema = closedObject({
	requester: Type.Optional(closedObject({
		channel: Type.Optional(Type.String()),
		accountId: Type.Optional(Type.String()),
		senderId: Type.Optional(Type.String())
	})),
	sessionKey: Type.Optional(Type.String()),
	deliveryContext: Type.Optional(ConfigDeliveryContextSchema),
	note: Type.Optional(Type.String()),
	continuationMessage: Type.Optional(Type.String()),
	restartDelayMs: Type.Optional(Type.Integer({ minimum: 0 })),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 1 })),
	target: Type.Optional(closedObject({
		kind: Type.Literal("git"),
		upstreamRef: Type.String({
			minLength: 1,
			pattern: "^[^\\s\\u0000-\\u001f\\u007f-\\u009f]+$"
		}),
		upstreamSha: Type.String({ pattern: "^[a-fA-F0-9]{40}$" })
	}))
});
/** Explicit two-step request for previewing or submitting one failed update report. */
const UpdateReportParamsSchema = Type.Union([closedObject({
	action: Type.Literal("preview"),
	attemptId: Type.String({
		minLength: 1,
		maxLength: 256
	})
}), closedObject({
	action: Type.Literal("submit"),
	attemptId: Type.String({
		minLength: 1,
		maxLength: 256
	}),
	previewDigest: Type.String({ pattern: "^[a-f0-9]{64}$" })
})]);
const UpdateReportUrlSchema = Type.String({
	minLength: 1,
	maxLength: 16384
});
/** Result of a consent-gated update failure report action. */
const UpdateReportResultSchema = Type.Union([
	closedObject({
		status: Type.Literal("ready"),
		attemptId: Type.String({
			minLength: 1,
			maxLength: 256
		}),
		body: Type.String({ maxLength: 16e3 }),
		previewDigest: Type.String({ pattern: "^[a-f0-9]{64}$" }),
		title: Type.String({
			minLength: 1,
			maxLength: 200
		})
	}),
	closedObject({
		status: Type.Literal("created"),
		message: Type.Optional(Type.String({ maxLength: 512 })),
		url: UpdateReportUrlSchema
	}),
	closedObject({
		status: Type.Literal("fallback"),
		fallbackUrl: UpdateReportUrlSchema,
		message: Type.String({ maxLength: 512 })
	}),
	closedObject({
		status: Type.Literal("pending"),
		message: Type.String({ maxLength: 512 })
	}),
	closedObject({
		status: Type.Literal("retryable"),
		message: Type.String({ maxLength: 512 })
	}),
	closedObject({
		status: Type.Literal("duplicate"),
		fallbackUrl: Type.Optional(UpdateReportUrlSchema),
		message: Type.String({ maxLength: 512 }),
		url: Type.Optional(UpdateReportUrlSchema)
	})
]);
/** UI metadata attached to config schema paths. */
const ConfigUiHintSchema = closedObject({
	label: Type.Optional(Type.String()),
	help: Type.Optional(Type.String()),
	docsUrl: Type.Optional(Type.String()),
	tags: Type.Optional(Type.Array(Type.String())),
	group: Type.Optional(Type.String()),
	groups: Type.Optional(Type.Array(closedObject({
		id: NonEmptyString,
		title: NonEmptyString,
		order: Type.Optional(Type.Integer()),
		properties: Type.Array(NonEmptyString)
	}))),
	order: Type.Optional(Type.Integer()),
	advanced: Type.Optional(Type.Boolean()),
	sensitive: Type.Optional(Type.Boolean()),
	placeholder: Type.Optional(Type.String()),
	presentation: Type.Optional(Type.Literal("phone-number")),
	itemTemplate: Type.Optional(Type.Unknown())
});
closedObject({
	schema: Type.Unknown(),
	uiHints: Type.Record(Type.String(), ConfigUiHintSchema),
	version: NonEmptyString,
	generatedAt: NonEmptyString
});
/** Child entry returned when looking up a config schema path. */
const ConfigSchemaLookupChildSchema = closedObject({
	key: NonEmptyString,
	path: NonEmptyString,
	type: Type.Optional(Type.Union([Type.String(), Type.Array(Type.String())])),
	required: Type.Boolean(),
	hasChildren: Type.Boolean(),
	reloadKind: Type.Optional(Type.Union([
		Type.Literal("restart"),
		Type.Literal("hot"),
		Type.Literal("none")
	])),
	hint: Type.Optional(ConfigUiHintSchema),
	hintPath: Type.Optional(Type.String())
});
/** Schema lookup response for one config path and its immediate children. */
const ConfigSchemaLookupResultSchema = closedObject({
	path: NonEmptyString,
	schema: Type.Unknown(),
	reloadKind: Type.Optional(Type.Union([
		Type.Literal("restart"),
		Type.Literal("hot"),
		Type.Literal("none")
	])),
	hint: Type.Optional(ConfigUiHintSchema),
	hintPath: Type.Optional(Type.String()),
	children: Type.Array(ConfigSchemaLookupChildSchema)
});
//#endregion
//#region packages/gateway-protocol/src/schema/gateway-suspend.ts
const SuspensionTokenSchema = Type.String({
	minLength: 1,
	maxLength: 128,
	pattern: "\\S"
});
const CountSchema = Type.Integer({ minimum: 0 });
/** Recorded lifecycle sections; absence on older residents means unknown custody. */
const GatewayWriteCustodySchema = Type.Array(closedObject({
	phase: Type.String({ minLength: 1 }),
	count: CountSchema
}));
/** Public admission state only; never includes the controller's suspension token. */
const GatewaySuspensionSchema = closedObject({ phase: Type.Union([
	Type.Literal("accepting"),
	Type.Literal("preparing"),
	Type.Literal("draining"),
	Type.Literal("prepared")
]) });
const GatewaySuspendTaskBlockerSchema = closedObject({
	taskId: Type.String(),
	status: Type.Literal("running"),
	runtime: Type.Union([
		Type.Literal("subagent"),
		Type.Literal("acp"),
		Type.Literal("cli"),
		Type.Literal("cron")
	]),
	runId: Type.Optional(Type.String()),
	label: Type.Optional(Type.String()),
	title: Type.Optional(Type.String())
});
const GatewaySuspendBlockerSchema = closedObject({
	kind: Type.Union([
		Type.Literal("queue"),
		Type.Literal("reply"),
		Type.Literal("embedded-run"),
		Type.Literal("background-exec"),
		Type.Literal("cron-run"),
		Type.Literal("task"),
		Type.Literal("root-request"),
		Type.Literal("session-admission"),
		Type.Literal("session-mutation"),
		Type.Literal("chat-run"),
		Type.Literal("queued-turn"),
		Type.Literal("terminal-persistence"),
		Type.Literal("terminal-session")
	]),
	count: CountSchema,
	message: Type.String(),
	task: Type.Optional(GatewaySuspendTaskBlockerSchema)
});
const GatewaySuspendPrepareParamsSchema = closedObject({
	requestId: SuspensionTokenSchema,
	terminalPolicy: Type.Optional(Type.Union([Type.Literal("preserve"), Type.Literal("terminate")])),
	drain: Type.Optional(Type.Boolean())
});
const GatewaySuspendPrepareBusyResultSchema = closedObject({
	status: Type.Literal("busy"),
	reason: Type.Union([Type.Literal("active-work"), Type.Literal("gateway-draining")]),
	retryAfterMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendPrepareDrainingResultSchema = closedObject({
	status: Type.Literal("draining"),
	suspensionId: SuspensionTokenSchema,
	expiresAtMs: CountSchema,
	retryAfterMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendPrepareReadyResultSchema = closedObject({
	status: Type.Literal("ready"),
	suspensionId: SuspensionTokenSchema,
	expiresAtMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
Type.Union([
	GatewaySuspendPrepareBusyResultSchema,
	GatewaySuspendPrepareDrainingResultSchema,
	GatewaySuspendPrepareReadyResultSchema
]);
const GatewaySuspendStatusParamsSchema = closedObject({ suspensionId: SuspensionTokenSchema });
const GatewaySuspendStatusRunningResultSchema = closedObject({ status: Type.Literal("running") });
const GatewaySuspendStatusDrainingResultSchema = closedObject({
	status: Type.Literal("draining"),
	expiresAtMs: CountSchema,
	retryAfterMs: CountSchema,
	activeCount: CountSchema,
	blockers: Type.Array(GatewaySuspendBlockerSchema),
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
const GatewaySuspendStatusReadyResultSchema = closedObject({
	status: Type.Literal("ready"),
	expiresAtMs: CountSchema,
	writeCustody: Type.Optional(GatewayWriteCustodySchema)
});
Type.Union([
	GatewaySuspendStatusRunningResultSchema,
	GatewaySuspendStatusDrainingResultSchema,
	GatewaySuspendStatusReadyResultSchema
]);
const GatewaySuspendResumeParamsSchema = GatewaySuspendStatusParamsSchema;
closedObject({
	ok: Type.Literal(true),
	status: Type.Literal("running"),
	resumed: Type.Boolean()
});
/** Arms cleanup for the next SIGTERM; the external host still owns replacement. */
const GatewaySuspendHandoffParamsSchema = closedObject({
	suspensionId: SuspensionTokenSchema,
	target: closedObject({
		pid: Type.Integer({ minimum: 1 }),
		processInstanceId: SuspensionTokenSchema
	})
});
closedObject({
	status: Type.Literal("armed"),
	suspensionId: SuspensionTokenSchema,
	expiresAtMs: CountSchema
});
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.ts
/**
* Gateway state snapshot schemas.
*
* Snapshots are sent during hello and later event streams; they summarize node
* presence, health, session defaults, and version counters for clients.
*/
/** One gateway-visible presence record for a node/client/runtime. */
const PresenceEntrySchema = closedObject({
	host: Type.Optional(NonEmptyString),
	clientId: Type.Optional(NonEmptyString),
	ip: Type.Optional(NonEmptyString),
	version: Type.Optional(NonEmptyString),
	platform: Type.Optional(NonEmptyString),
	deviceFamily: Type.Optional(NonEmptyString),
	modelIdentifier: Type.Optional(NonEmptyString),
	timeZone: Type.Optional(NonEmptyString),
	mode: Type.Optional(NonEmptyString),
	lastInputSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
	reason: Type.Optional(NonEmptyString),
	tags: Type.Optional(Type.Array(NonEmptyString)),
	text: Type.Optional(Type.String()),
	/** Heartbeat freshness, not online duration or user activity. */
	ts: Type.Integer({ minimum: 0 }),
	/** Server timestamps for the person's continuous online interval and last accepted activity. */
	onlineSince: Type.Optional(Type.Integer({ minimum: 0 })),
	lastActivityAt: Type.Optional(Type.Integer({ minimum: 0 })),
	deviceId: Type.Optional(NonEmptyString),
	roles: Type.Optional(Type.Array(NonEmptyString)),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	instanceId: Type.Optional(NonEmptyString),
	user: Type.Optional(closedObject({
		/** Canonical profile id when resolved, otherwise authenticated identity; grouping also uses identity qualification. */
		id: NonEmptyString,
		identity: Type.Optional(SessionPersonSchema.properties.identity),
		email: Type.Optional(NonEmptyString),
		name: Type.Optional(NonEmptyString),
		avatarUrl: Type.Optional(NonEmptyString)
	})),
	/** Sessions this connection declares it is viewing, independent of transport subscriptions. Sorted lexicographically. */
	watchedSessions: Type.Optional(Type.Array(NonEmptyString))
});
const HealthSessionSummarySchema = closedObject({
	path: Type.String(),
	count: Type.Integer({ minimum: 0 }),
	recent: Type.Array(closedObject({
		key: Type.String(),
		updatedAt: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
		age: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()])
	}))
});
const HealthSnapshotSchema = closedObject({
	ok: Type.Optional(Type.Literal(true)),
	ts: Type.Optional(Type.Integer({ minimum: 0 })),
	durationMs: Type.Optional(Type.Integer({ minimum: 0 })),
	eventLoop: Type.Optional(GatewayEventLoopHealthSchema),
	plugins: Type.Optional(closedObject({
		loaded: Type.Array(Type.String()),
		errors: Type.Array(closedObject({
			id: Type.String(),
			origin: Type.String(),
			activated: Type.Boolean(),
			activationSource: Type.Optional(Type.String()),
			activationReason: Type.Optional(Type.String()),
			failurePhase: Type.Optional(Type.String()),
			error: Type.String()
		})),
		unavailable: Type.Optional(Type.Array(closedObject({
			id: Type.String(),
			state: Type.Literal("configured-unavailable"),
			diagnostic: closedObject({
				kind: Type.Literal("plugin-verification"),
				reason: Type.String(),
				detail: Type.String()
			})
		})))
	})),
	contextEngines: Type.Optional(closedObject({ quarantined: Type.Array(closedObject({
		engineId: Type.String(),
		owner: Type.Optional(Type.String()),
		operation: Type.String(),
		reason: Type.String(),
		failedAt: Type.Integer({ minimum: 0 })
	})) })),
	deliveryQueues: Type.Optional(closedObject({
		failed: Type.Array(closedObject({
			queueName: Type.String(),
			count: Type.Integer({ minimum: 0 }),
			oldestFailedAt: Type.Optional(Type.Integer({ minimum: 0 }))
		})),
		ingressFailed: Type.Optional(Type.Array(closedObject({
			channelId: Type.String(),
			accountId: Type.String(),
			count: Type.Integer({ minimum: 0 }),
			oldestFailedAt: Type.Optional(Type.Integer({ minimum: 0 }))
		}))),
		ingressPressure: Type.Optional(Type.Array(closedObject({
			channelId: Type.String(),
			accountId: Type.String(),
			laneCount: Type.Integer({ minimum: 0 }),
			pendingCount: Type.Integer({ minimum: 0 }),
			claimedCount: Type.Integer({ minimum: 0 }),
			blockedCount: Type.Integer({ minimum: 0 }),
			oldestReceivedAt: Type.Integer({ minimum: 0 })
		})))
	})),
	modelPricing: Type.Optional(closedObject({
		state: Type.Union([
			Type.Literal("ok"),
			Type.Literal("degraded"),
			Type.Literal("disabled")
		]),
		sources: Type.Array(closedObject({
			source: Type.Union([
				Type.Literal("openrouter"),
				Type.Literal("litellm"),
				Type.Literal("bootstrap"),
				Type.Literal("refresh")
			]),
			state: Type.Union([Type.Literal("ok"), Type.Literal("degraded")]),
			lastFailureAt: Type.Optional(Type.Integer({ minimum: 0 })),
			detail: Type.Optional(Type.String())
		})),
		lastFailureAt: Type.Optional(Type.Integer({ minimum: 0 })),
		detail: Type.Optional(Type.String())
	})),
	configReload: Type.Optional(closedObject({ hotReloadStatus: Type.Union([Type.Literal("active"), Type.Literal("disabled")]) })),
	channels: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	channelOrder: Type.Optional(Type.Array(Type.String())),
	channelLabels: Type.Optional(Type.Record(Type.String(), Type.String())),
	heartbeatSeconds: Type.Optional(Type.Integer({ minimum: 0 })),
	defaultAgentId: Type.Optional(Type.String()),
	agents: Type.Optional(Type.Array(closedObject({
		agentId: Type.String(),
		name: Type.Optional(Type.String()),
		isDefault: Type.Boolean(),
		heartbeat: closedObject({
			enabled: Type.Boolean(),
			every: Type.String(),
			everyMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
			prompt: Type.String(),
			target: Type.String(),
			model: Type.Optional(Type.String()),
			session: Type.Optional(Type.String()),
			ackMaxChars: Type.Integer({ minimum: 0 })
		}),
		sessions: HealthSessionSummarySchema
	}))),
	sessions: Type.Optional(HealthSessionSummarySchema)
});
/** Default session routing keys included in initial gateway snapshots. */
const SessionDefaultsSchema = closedObject({
	defaultAgentId: NonEmptyString,
	modelConfigured: Type.Optional(Type.Boolean()),
	ownership: Type.Optional(AgentOwnershipSchema),
	selectionRequired: Type.Optional(Type.Boolean()),
	mainKey: NonEmptyString,
	mainSessionKey: NonEmptyString,
	scope: Type.Optional(NonEmptyString)
});
/** Monotonic version counters for snapshot subtrees. */
const StateVersionSchema = closedObject({
	presence: Type.Integer({ minimum: 0 }),
	health: Type.Integer({ minimum: 0 })
});
/** Initial and incremental gateway state snapshot payload. */
const SnapshotSchema = closedObject({
	suspension: Type.Optional(GatewaySuspensionSchema),
	presence: Type.Array(PresenceEntrySchema),
	health: HealthSnapshotSchema,
	stateVersion: StateVersionSchema,
	uptimeMs: Type.Integer({ minimum: 0 }),
	/** Resolved source-config revision accepted by the active Gateway runtime. */
	appliedConfigHash: Type.Optional(Type.Union([NonEmptyString, Type.Null()])),
	configPath: Type.Optional(NonEmptyString),
	stateDir: Type.Optional(NonEmptyString),
	sessionDefaults: Type.Optional(SessionDefaultsSchema),
	/** Credential-free browser sign-in endpoint advertised to authenticated operators. */
	controlUiIdentityUrl: Type.Optional(NonEmptyString),
	authMode: Type.Optional(Type.Union([
		Type.Literal("none"),
		Type.Literal("token"),
		Type.Literal("password"),
		Type.Literal("trusted-proxy")
	])),
	updateAvailable: Type.Optional(UpdateAvailableSchema),
	updateSchedule: Type.Optional(UpdateScheduleStateSchema)
});
closedObject({ ts: Type.Integer({ minimum: 0 }) });
closedObject({
	reason: NonEmptyString,
	restartExpectedMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Initial client hello/connect payload sent before the gateway accepts frames. */
const ConnectParamsSchema = closedObject({
	minProtocol: Type.Integer({ minimum: 1 }),
	maxProtocol: Type.Integer({ minimum: 1 }),
	client: closedObject({
		id: GatewayClientIdSchema,
		displayName: Type.Optional(NonEmptyString),
		version: NonEmptyString,
		buildId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		platform: NonEmptyString,
		deviceFamily: Type.Optional(NonEmptyString),
		modelIdentifier: Type.Optional(NonEmptyString),
		/** Self-reported IANA zone. Bounded because the longest real name is well under this cap. */
		timeZone: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 64
		})),
		mode: GatewayClientModeSchema,
		instanceId: Type.Optional(NonEmptyString)
	}),
	caps: Type.Optional(Type.Array(NonEmptyString, { default: [] })),
	commands: Type.Optional(Type.Array(NonEmptyString)),
	/** Additive Computer Use declaration; the owning core contract validates its bounded shape. */
	computerUse: Type.Optional(Type.Unknown()),
	/** @deprecated Accepted for the shipped v1 node-host envelope; current hosts use runner inventory. */
	workerRuns: Type.Optional(WorkerAdmissionHandshakeSchema),
	permissions: Type.Optional(Type.Record(NonEmptyString, Type.Boolean())),
	pathEnv: Type.Optional(Type.String()),
	role: Type.Optional(NonEmptyString),
	scopes: Type.Optional(Type.Array(NonEmptyString)),
	/** Initial catalog read scope; method authorization still owns access. */
	modelCatalog: Type.Optional(Type.Union([closedObject({
		agentId: Type.Optional(NonEmptyString),
		sessionKey: Type.Optional(NonEmptyString)
	}), closedObject({
		agentId: Type.Optional(NonEmptyString),
		shortId: NonEmptyString,
		slugHint: Type.Optional(NonEmptyString)
	})])),
	device: Type.Optional(closedObject({
		id: NonEmptyString,
		publicKey: NonEmptyString,
		signature: NonEmptyString,
		signedAt: Type.Integer({ minimum: 0 }),
		nonce: NonEmptyString
	})),
	auth: Type.Optional(closedObject({
		token: Type.Optional(Type.String()),
		bootstrapToken: Type.Optional(Type.String()),
		deviceToken: Type.Optional(Type.String()),
		password: Type.Optional(Type.String()),
		approvalRuntimeToken: Type.Optional(Type.String()),
		agentRuntimeIdentityToken: Type.Optional(Type.String())
	})),
	locale: Type.Optional(Type.String()),
	userAgent: Type.Optional(Type.String())
});
closedObject({
	type: Type.Literal("hello-ok"),
	protocol: Type.Integer({ minimum: 1 }),
	server: closedObject({
		version: NonEmptyString,
		buildId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		bootId: Type.Optional(Type.String({
			minLength: 1,
			maxLength: 96
		})),
		controlUiBuildSource: Type.Optional(Type.Union([Type.Literal("bundled"), Type.Literal("configured")])),
		connId: NonEmptyString
	}),
	features: closedObject({
		methods: Type.Array(NonEmptyString),
		events: Type.Array(NonEmptyString),
		capabilities: Type.Optional(Type.Array(NonEmptyString))
	}),
	snapshot: SnapshotSchema,
	controlUiUrl: Type.Optional(NonEmptyString),
	controlUiTabs: Type.Optional(Type.Array(ControlUiPluginTabSchema)),
	controlUiWidgetKinds: Type.Optional(Type.Array(ControlUiPluginWidgetKindSchema)),
	controlUiLinkReaders: Type.Optional(Type.Array(ControlUiLinkReaderDescriptorSchema)),
	pluginSurfaceUrls: Type.Optional(Type.Record(NonEmptyString, NonEmptyString)),
	auth: closedObject({
		method: Type.Optional(Type.Union([
			Type.Literal("none"),
			Type.Literal("token"),
			Type.Literal("password"),
			Type.Literal("tailscale"),
			Type.Literal("device-token"),
			Type.Literal("bootstrap-token"),
			Type.Literal("trusted-proxy")
		])),
		deviceToken: Type.Optional(NonEmptyString),
		recoveryMigrationAllowed: Type.Optional(Type.Literal(true)),
		recoveryScope: Type.Optional(NonEmptyString),
		role: NonEmptyString,
		scopes: Type.Array(NonEmptyString),
		issuedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
		deviceTokens: Type.Optional(Type.Array(closedObject({
			deviceToken: NonEmptyString,
			role: NonEmptyString,
			scopes: Type.Array(NonEmptyString),
			issuedAtMs: Type.Integer({ minimum: 0 })
		})))
	}),
	policy: closedObject({
		maxPayload: Type.Integer({ minimum: 1 }),
		maxBufferedBytes: Type.Integer({ minimum: 1 }),
		tickIntervalMs: Type.Integer({ minimum: 1 }),
		attachments: Type.Optional(closedObject({
			maxBytes: Type.Integer({ minimum: 1 }),
			maxImageBytes: Type.Integer({ minimum: 1 })
		})),
		allowedSessionVisibilities: Type.Optional(Type.Array(SessionVisibilitySchema)),
		hasMultipleSessionSharingIdentities: Type.Optional(Type.Boolean())
	})
});
/** Standard structured error shape used in response frames and connect failures. */
const ErrorShapeSchema = closedObject({
	code: NonEmptyString,
	message: NonEmptyString,
	details: Type.Optional(Type.Unknown()),
	retryable: Type.Optional(Type.Boolean()),
	retryAfterMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Client request frame envelope; `method` selects the payload validator. */
const RequestFrameSchema = closedObject({
	type: Type.Literal("req"),
	id: NonEmptyString,
	method: NonEmptyString,
	params: Type.Optional(Type.Unknown()),
	traceparent: Type.Optional(Type.String({ maxLength: 128 })),
	expectedProfileId: Type.Optional(UserProfileIdSchema)
});
/** Server response frame envelope paired with a prior request id. */
const ResponseFrameSchema = closedObject({
	type: Type.Literal("res"),
	id: NonEmptyString,
	ok: Type.Boolean(),
	payload: Type.Optional(Type.Unknown()),
	error: Type.Optional(ErrorShapeSchema)
});
/** Server event frame envelope; `event` selects the payload validator. */
const EventFrameSchema = closedObject({
	type: Type.Literal("event"),
	event: NonEmptyString,
	payload: Type.Optional(Type.Unknown()),
	seq: Type.Optional(Type.Integer({ minimum: 0 })),
	stateVersion: Type.Optional(StateVersionSchema),
	recipientProfileId: Type.Optional(UserProfileIdSchema)
});
Type.Union([
	RequestFrameSchema,
	ResponseFrameSchema,
	EventFrameSchema
], { discriminator: "type" });
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.ts
const SESSION_OBSERVER_HEALTH_VALUES = [
	"on-track",
	"grinding",
	"stuck",
	"waiting-on-user",
	"wrapping-up",
	"done",
	"failed"
];
/** Trajectory judgment produced for one observed agent session. */
const SessionObserverHealthSchema = Type.Union([
	Type.Literal("on-track"),
	Type.Literal("grinding"),
	Type.Literal("stuck"),
	Type.Literal("waiting-on-user"),
	Type.Literal("wrapping-up"),
	Type.Literal("done"),
	Type.Literal("failed")
]);
/** Completed and total step counts from the session's current plan. */
const SessionObserverPlanProgressSchema = closedObject({
	completed: Type.Integer({ minimum: 0 }),
	total: Type.Integer({ minimum: 0 })
});
closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	lifecycleRevision: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	revision: Type.Integer({ minimum: 1 }),
	updatedAt: Type.Integer({ minimum: 0 }),
	headline: Type.String({
		minLength: 1,
		maxLength: 120
	}),
	assessment: Type.Optional(Type.String({
		minLength: 1,
		maxLength: 320
	})),
	health: SessionObserverHealthSchema,
	planProgress: Type.Optional(SessionObserverPlanProgressSchema)
});
/** Declares whether this connection currently renders session observer output. */
const SessionsObserverVisibilityParamsSchema = closedObject({ visible: Type.Boolean() });
closedObject({ ok: Type.Literal(true) });
/** One bounded question/answer exchange in the ephemeral session companion. */
const SessionCompanionExchangeSchema = closedObject({
	question: Type.String({
		minLength: 1,
		maxLength: 400
	}),
	answer: Type.String({
		minLength: 1,
		maxLength: 1200
	}),
	ts: Type.Integer({ minimum: 0 })
});
/** Asks the read-only companion about one session and its workspace. */
const SessionsCompanionAskParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	question: Type.String({
		minLength: 1,
		maxLength: 400
	})
});
closedObject({
	answer: Type.String({
		minLength: 1,
		maxLength: 1200
	}),
	ts: Type.Integer({ minimum: 0 })
});
/** Selects the in-memory companion thread for one session. */
const SessionsCompanionStateParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
closedObject({ exchanges: Type.Array(SessionCompanionExchangeSchema, { maxItems: 24 }) });
/** Selects the in-memory companion thread to clear. */
const SessionsCompanionResetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
closedObject({ ok: Type.Literal(true) });
closedObject({
	operationId: NonEmptyString,
	operation: Type.Literal("compact"),
	phase: Type.Union([Type.Literal("start"), Type.Literal("end")]),
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	ts: Type.Integer({ minimum: 0 }),
	completed: Type.Optional(Type.Boolean()),
	reason: Type.Optional(Type.String())
});
/** Session file grouping used by the Control UI session workspace rail. */
const SessionFileKindSchema = Type.Union([Type.Literal("modified"), Type.Literal("read")]);
/** Session relevance marker for browser entries. */
const SessionFileRelevanceSchema = Type.Union([
	Type.Literal("modified"),
	Type.Literal("read"),
	Type.Literal("mixed")
]);
/** Encoding used when a session file preview includes inline content. */
const SessionFileContentEncodingSchema = Type.Union([Type.Literal("utf8"), Type.Literal("base64")]);
/** Renderer class selected for one session workspace file preview. */
const SessionFilePreviewKindSchema = Type.Union([
	Type.Literal("text"),
	Type.Literal("image"),
	Type.Literal("unsupported")
]);
const SessionFileHashSchema = Type.String({
	minLength: 64,
	maxLength: 64,
	pattern: "^[a-f0-9]{64}$"
});
/** One file path referenced by a session transcript. */
const SessionFileEntrySchema = closedObject({
	path: NonEmptyString,
	workspacePath: Type.Optional(NonEmptyString),
	name: NonEmptyString,
	kind: SessionFileKindSchema,
	missing: Type.Boolean(),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 })),
	content: Type.Optional(Type.String()),
	hash: Type.Optional(SessionFileHashSchema),
	mimeType: Type.Optional(NonEmptyString),
	contentEncoding: Type.Optional(SessionFileContentEncodingSchema),
	previewKind: Type.Optional(SessionFilePreviewKindSchema)
});
/** One file or folder in the session-rooted browser. */
const SessionFileBrowserEntrySchema = closedObject({
	path: Type.String(),
	name: NonEmptyString,
	kind: Type.Union([Type.Literal("file"), Type.Literal("directory")]),
	sessionKind: Type.Optional(SessionFileRelevanceSchema),
	size: Type.Optional(Type.Integer({ minimum: 0 })),
	updatedAtMs: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Folder listing or search result rooted at the session workspace. */
const SessionFileBrowserResultSchema = closedObject({
	path: Type.String(),
	parentPath: Type.Optional(Type.String()),
	search: Type.Optional(Type.String()),
	entries: Type.Array(SessionFileBrowserEntrySchema),
	truncated: Type.Optional(Type.Boolean())
});
/** Lists files touched by a session transcript. */
const SessionsFilesListParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	path: Type.Optional(Type.String()),
	search: Type.Optional(Type.String())
});
/** File references visible in one session workspace. */
const SessionsFilesListResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	/** Whether the session workspace directory is inside a git checkout; absent when the workspace root is unknown or the gateway predates the field. */
	gitCheckout: Type.Optional(Type.Boolean()),
	files: Type.Array(SessionFileEntrySchema),
	browser: Type.Optional(SessionFileBrowserResultSchema)
});
/** Reads one session-referenced file by path. */
const SessionsFilesGetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	path: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Result for reading one session-referenced file. */
const SessionsFilesGetResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	file: SessionFileEntrySchema
});
/** Overwrites one existing session workspace file with hash-based CAS. */
const SessionsFilesSetParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	path: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	content: Type.String(),
	expectedHash: SessionFileHashSchema
});
closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	file: SessionFileEntrySchema
});
/** Opens a session workspace on the Gateway host without accepting a client path. */
const SessionsFilesRevealParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
closedObject({
	ok: Type.Boolean(),
	path: Type.Optional(NonEmptyString),
	error: Type.Optional(NonEmptyString)
});
/** Change status for one file in a session checkout diff. */
const SessionDiffFileStatusSchema = Type.Union([
	Type.Literal("added"),
	Type.Literal("modified"),
	Type.Literal("deleted"),
	Type.Literal("renamed")
]);
/** One changed file in a session checkout diff. */
const SessionDiffFileSchema = closedObject({
	path: NonEmptyString,
	oldPath: Type.Optional(NonEmptyString),
	status: SessionDiffFileStatusSchema,
	additions: Type.Integer({ minimum: 0 }),
	deletions: Type.Integer({ minimum: 0 }),
	binary: Type.Optional(Type.Boolean()),
	untracked: Type.Optional(Type.Boolean()),
	/** Per-file unified patch text; absent for binary or oversized files. */
	patch: Type.Optional(Type.String()),
	truncated: Type.Optional(Type.Boolean())
});
/** One commit shown in session diff branch metadata. */
const SessionDiffCommitSchema = closedObject({
	sha: NonEmptyString,
	subject: Type.String()
});
/** Selects the session checkout state represented by the diff. */
const SessionDiffScopeSchema = Type.Union([
	Type.Literal("all"),
	Type.Literal("uncommitted"),
	Type.Literal("commit")
]);
/** Reads the git diff of a session checkout against its base branch. */
const SessionsDiffParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	scope: Type.Optional(SessionDiffScopeSchema),
	commit: Type.Optional(NonEmptyString)
});
/** Branch + working-tree diff for one session checkout. */
const SessionsDiffResultSchema = closedObject({
	sessionKey: NonEmptyString,
	root: Type.Optional(NonEmptyString),
	branch: Type.Optional(NonEmptyString),
	/** Display label of the diff base: the default branch name or "HEAD". */
	baseRef: Type.Optional(NonEmptyString),
	/** Number of commits between the resolved branch merge base and HEAD. */
	aheadCount: Type.Optional(Type.Integer({ minimum: 0 })),
	/** Newest-first commits between the resolved branch merge base and HEAD. */
	commits: Type.Optional(Type.Array(SessionDiffCommitSchema, { maxItems: 50 })),
	/** The resolved branch merge-base commit. */
	mergeBase: Type.Optional(SessionDiffCommitSchema),
	files: Type.Array(SessionDiffFileSchema),
	additions: Type.Integer({ minimum: 0 }),
	deletions: Type.Integer({ minimum: 0 }),
	truncated: Type.Optional(Type.Boolean()),
	unavailableReason: Type.Optional(Type.Union([
		Type.Literal("unknown_session"),
		Type.Literal("not_git"),
		Type.Literal("unknown_commit"),
		Type.Literal("workspace_stopped")
	]))
});
/** Repairs or removes invalid session records from the selected agent scope. */
const SessionsCleanupParamsSchema = closedObject({
	agent: Type.Optional(NonEmptyString),
	allAgents: Type.Optional(Type.Boolean()),
	enforce: Type.Optional(Type.Boolean()),
	activeKey: Type.Optional(NonEmptyString),
	fixMissing: Type.Optional(Type.Boolean()),
	fixDmScope: Type.Optional(Type.Boolean())
});
/** Reads short previews for selected session keys. */
const SessionsPreviewParamsSchema = closedObject({
	keys: Type.Array(NonEmptyString, { minItems: 1 }),
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	maxChars: Type.Optional(Type.Integer({ minimum: 20 }))
});
/** Describes one session and optional derived title/last-message previews. */
const SessionsDescribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	includeDerivedTitles: Type.Optional(Type.Boolean()),
	includeLastMessage: Type.Optional(Type.Boolean())
});
const SessionWorktreeInfoSchema = closedObject({
	id: NonEmptyString,
	path: NonEmptyString,
	branch: NonEmptyString
});
Type.Object({
	ok: Type.Literal(true),
	key: NonEmptyString,
	sessionId: Type.Optional(NonEmptyString),
	entry: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	runStarted: Type.Optional(Type.Boolean()),
	runId: Type.Optional(NonEmptyString),
	messageSeq: Type.Optional(Type.Integer({ minimum: 1 })),
	runError: Type.Optional(ErrorShapeSchema),
	worktree: Type.Optional(SessionWorktreeInfoSchema)
}, { additionalProperties: true });
/** Sends one message into an existing session. */
const SessionsSendParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	message: Type.String(),
	mentions: Type.Optional(HumanMentionsSchema),
	thinking: Type.Optional(Type.String()),
	attachments: Type.Optional(ChatAttachmentsSchema),
	timeoutMs: Type.Optional(Type.Integer({ minimum: 0 })),
	idempotencyKey: Type.Optional(NonEmptyString)
});
/** Subscribes a client to live message updates for one session. */
const SessionsMessagesSubscribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	/** Opt in to sanitized durable approval events for this session and its descendants. */
	includeApprovals: Type.Optional(Type.Literal(true))
});
/** Removes a live message subscription for one session. */
const SessionsMessagesUnsubscribeParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
/** Aborts the active or named run for a session. */
const SessionsAbortParamsSchema = closedObject({
	key: Type.Optional(NonEmptyString),
	runId: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	/** Also discard followup and lane queues for a key-only non-global session abort. */
	clearQueued: Type.Optional(Type.Boolean())
});
/** Updates or clears one plugin namespace value on a session record. */
const SessionsPluginPatchParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	pluginId: NonEmptyString,
	namespace: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema),
	unset: Type.Optional(Type.Boolean())
});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	value: Type.Optional(PluginJsonValueSchema)
});
/** Resets a session to a new or reset transcript state. */
const SessionsResetParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	reason: Type.Optional(Type.Union([Type.Literal("new"), Type.Literal("reset")])),
	expectedSessionId: Type.Optional(NonEmptyString)
});
/** Reassigns mutable session responsibility without changing provenance or sharing authority. */
const SessionsAssignOwnerParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	owner: closedObject({
		type: Type.Union([Type.Literal("agent"), Type.Literal("human")]),
		id: NonEmptyString
	})
});
closedObject({
	ok: Type.Literal(true),
	key: NonEmptyString,
	owner: SessionOwnerSchema
});
/** Lists the gateway-owned custom session group catalog (names + order). */
const SessionsGroupsListParamsSchema = closedObject({});
/** One custom session group catalog entry. */
const SessionGroupSchema = closedObject({
	name: SessionLabelString,
	position: Type.Integer({ minimum: 0 })
});
/** New Session defaults visible only to operators who can update them. */
const SessionGroupDefaultsSchema = closedObject({
	name: SessionLabelString,
	cwd: Type.Optional(NonEmptyString),
	worktree: Type.Optional(Type.Boolean())
});
const SidebarSectionIdString = Type.String({
	minLength: 1,
	maxLength: 512
});
closedObject({
	groups: Type.Array(SessionGroupSchema),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString))
});
/** Reads the New Session defaults for the custom group catalog. */
const SessionsGroupsDefaultsParamsSchema = closedObject({});
closedObject({ defaults: Type.Array(SessionGroupDefaultsSchema) });
/** Replaces the ordered group catalog; creates listed names, keeps member categories untouched. */
const SessionsGroupsPutParamsSchema = closedObject({
	names: Type.Array(SessionLabelString),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString))
});
/** Renames a group and repoints every member session's category. */
const SessionsGroupsRenameParamsSchema = closedObject({
	name: SessionLabelString,
	to: SessionLabelString
});
/** Updates the New Session defaults owned by one custom group. */
const SessionsGroupsUpdateParamsSchema = closedObject({
	name: SessionLabelString,
	cwd: Type.Union([NonEmptyString, Type.Null()]),
	worktree: Type.Boolean()
});
closedObject({
	ok: Type.Literal(true),
	defaults: Type.Array(SessionGroupDefaultsSchema)
});
/** Deletes a group and clears every member session's category. */
const SessionsGroupsDeleteParamsSchema = closedObject({ name: SessionLabelString });
closedObject({
	ok: Type.Literal(true),
	groups: Type.Array(SessionGroupSchema),
	sectionOrder: Type.Optional(Type.Array(SidebarSectionIdString)),
	updatedSessions: Type.Optional(Type.Integer({ minimum: 0 }))
});
/** Requests manual compaction for a session transcript. */
const SessionsCompactParamsSchema = closedObject({
	key: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	maxLines: Type.Optional(Type.Integer({ minimum: 1 }))
});
/** Repoints a session to the active-path state before one persisted user message. */
const SessionsRewindParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	entryId: NonEmptyString
});
/** Creates a new session from the active-path state before one persisted user message. */
const SessionsForkParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	entryId: NonEmptyString
});
const SessionEditorAttachmentSchema = closedObject({
	mimeType: Type.String(),
	data: Type.String()
});
closedObject({
	editorText: Type.Optional(Type.String()),
	editorAttachments: Type.Optional(Type.Array(SessionEditorAttachmentSchema))
});
closedObject({
	sessionKey: NonEmptyString,
	editorText: Type.Optional(Type.String()),
	editorAttachments: Type.Optional(Type.Array(SessionEditorAttachmentSchema))
});
const SessionBranchSchema = closedObject({
	leafEntryId: NonEmptyString,
	headline: Type.String(),
	messageCount: Type.Integer({ minimum: 0 }),
	updatedAt: Type.Optional(NonEmptyString),
	active: Type.Boolean()
});
/** Lists transcript DAG tips available for branch switching. */
const SessionsBranchesListParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString)
});
closedObject({ branches: Type.Array(SessionBranchSchema) });
/** Repoints the active transcript path to one existing DAG tip. */
const SessionsBranchesSwitchParamsSchema = closedObject({
	sessionKey: NonEmptyString,
	agentId: Type.Optional(NonEmptyString),
	leafEntryId: NonEmptyString
});
closedObject({});
/** Usage report query across one session, one agent, or all agent sessions. */
const SessionsUsageParamsSchema = closedObject({
	/** Specific session key to analyze; if omitted returns sessions for the effective agent. */
	key: Type.Optional(NonEmptyString),
	/** Agent scope for list-style usage queries. */
	agentId: Type.Optional(NonEmptyString),
	/** Explicit all-agent scope for list-style usage queries. */
	agentScope: Type.Optional(Type.Literal("all")),
	/** Opaque creator identity returned by sessions.usage; filters before the row limit. */
	creatorKey: Type.Optional(NonEmptyString),
	/** Start date for range filter (YYYY-MM-DD). */
	startDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
	/** End date for range filter (YYYY-MM-DD). */
	endDate: Type.Optional(Type.String({ pattern: "^\\d{4}-\\d{2}-\\d{2}$" })),
	/** How start/end dates should be interpreted. Defaults to UTC when omitted. */
	mode: Type.Optional(Type.Union([
		Type.Literal("utc"),
		Type.Literal("gateway"),
		Type.Literal("specific")
	])),
	/** Preset range for usage queries when explicit start/end dates are omitted. */
	range: Type.Optional(Type.Union([
		Type.Literal("7d"),
		Type.Literal("30d"),
		Type.Literal("90d"),
		Type.Literal("1y"),
		Type.Literal("all")
	])),
	/** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
	groupBy: Type.Optional(Type.Union([Type.Literal("instance"), Type.Literal("family")])),
	/** Backward-compatible alias for requesting family grouping. */
	includeHistorical: Type.Optional(Type.Boolean({
		deprecated: true,
		description: "Deprecated alias for groupBy: family."
	})),
	/** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
	utcOffset: Type.Optional(Type.String({
		pattern: "^UTC[+-]\\d{1,2}(?::[0-5]\\d)?$",
		deprecated: true,
		description: "Deprecated compatibility fallback; use timeZone."
	})),
	/** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
	timeZone: Type.Optional(NonEmptyString),
	/** Maximum sessions to return (default 50). */
	limit: Type.Optional(Type.Integer({ minimum: 1 })),
	/** Include context weight breakdown (systemPromptReport). */
	includeContextWeight: Type.Optional(Type.Boolean())
});
//#endregion
export { UpdateReportParamsSchema as $, SessionsObserverVisibilityParamsSchema as A, GatewaySuspendHandoffParamsSchema as B, SessionsGroupsDeleteParamsSchema as C, SessionsGroupsUpdateParamsSchema as D, SessionsGroupsRenameParamsSchema as E, SessionsSendParamsSchema as F, ConfigGetParamsSchema as G, GatewaySuspendResumeParamsSchema as H, SessionsUsageParamsSchema as I, ConfigSchemaLookupResultSchema as J, ConfigPatchParamsSchema as K, ConnectParamsSchema as L, SessionsPreviewParamsSchema as M, SessionsResetParamsSchema as N, SessionsMessagesSubscribeParamsSchema as O, SessionsRewindParamsSchema as P, UpdateHoldResultSchema as Q, ErrorShapeSchema as R, SessionsGroupsDefaultsParamsSchema as S, SessionsGroupsPutParamsSchema as T, GatewaySuspendStatusParamsSchema as U, GatewaySuspendPrepareParamsSchema as V, ConfigApplyParamsSchema as W, ConfigSetParamsSchema as X, ConfigSchemaParamsSchema as Y, UpdateHoldParamsSchema as Z, SessionsFilesListParamsSchema as _, SessionsBranchesListParamsSchema as a, UpdateRunsListParamsSchema as at, SessionsFilesSetParamsSchema as b, SessionsCompactParamsSchema as c, SessionsCompanionStateParamsSchema as d, UpdateReportResultSchema as et, SessionsDescribeParamsSchema as f, SessionsFilesGetResultSchema as g, SessionsFilesGetParamsSchema as h, SessionsAssignOwnerParamsSchema as i, UpdateRunsGetParamsSchema as it, SessionsPluginPatchParamsSchema as j, SessionsMessagesUnsubscribeParamsSchema as k, SessionsCompanionAskParamsSchema as l, SessionsDiffResultSchema as m, SessionFileEntrySchema as n, UpdateStatusParamsSchema as nt, SessionsBranchesSwitchParamsSchema as o, SessionsDiffParamsSchema as p, ConfigSchemaLookupParamsSchema as q, SessionsAbortParamsSchema as r, UpdateStatusResultSchema as rt, SessionsCleanupParamsSchema as s, SESSION_OBSERVER_HEALTH_VALUES as t, UpdateRunParamsSchema as tt, SessionsCompanionResetParamsSchema as u, SessionsFilesListResultSchema as v, SessionsGroupsListParamsSchema as w, SessionsForkParamsSchema as x, SessionsFilesRevealParamsSchema as y, RequestFrameSchema as z };
