import { $ as unknown, A as init_testclaw_state_db_schema_repair, B as init_testclaw_state_schema_compatibility, Bt as init_sqlite_user_version, Ct as init_sqlite_snapshot_source, D as init_testclaw_state_db, Dt as init_sqlite_readonly_worker, E as init_config_env_vars, En as init_error_coercion, Et as init_state_database_coordinator, F as init_testclaw_state_schema_publication, G as init_zod, Gt as init_testclaw_state_db_contract, It as init_runtime_process_entrypoints, Jt as init_sqlite_file_generation, K as _enum, N as init_testclaw_state_db_maintenance, Nt as init_runtime_worker_url, O as init_testclaw_state_db_fast_path, Q as string, Rt as init_sqlite_schema_header, Sn as init_path_guards, St as init_sqlite_schema_contract, Tn as init_command_format, Ut as init_deferred, W as init_testclaw_state_schema, X as number, Xt as init_file_descriptor, Y as literal, Z as object, Zt as init_node_sqlite, _t as init_testclaw_state_db_paths, an as init_errno, c as init_testclaw_database_verify, cn as init_kysely_sync, ct as init_runtime_process_url, d as init_session_dirs, dn as init_artifacts, en as init_errors, fn as init_agent_scope_config, g as init_testclaw_agent_db_registry, hn as init_session_key, ht as init_testclaw_quarantine_store, it as init_testclaw_state_worker_error, kn as __esmMin, n as init_testclaw_agent_db, nn as createSubsystemLogger, o as init_agent_database_admission, on as init_ansi, ot as init_testclaw_state_ownership, p as init_session_sqlite_target, pt as init_testclaw_state_db_schema_migration_required, q as discriminatedUnion, qt as init_sqlite_integrity, rn as init_subsystem, st as init_sqlite_files, tn as init_sqlite_error_diagnostics, u as init_targets, ut as init_testclaw_state_db_schema_version, v as init_agent_deletion_journal, vn as init_paths, w as init_testclaw_agent_db_registry_read, y as init_agent_deletion_journal_read, yt as init_testclaw_agent_db_contract } from "./state/testclaw-state-read.worker.js";
import "node:path";
import "node:os";
import "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
import "node:url";
import "node:child_process";
var init_agent_deletion_discovery = __esmMin((() => {
	init_paths();
	init_path_guards();
	init_sqlite_files();
	init_session_key();
	init_agent_deletion_journal_read();
	init_testclaw_agent_db_registry();
	init_testclaw_state_db_paths();
})), init_state_migrations_media_persistence_targets = __esmMin((() => {
	init_ansi();
	init_session_dirs();
	init_command_format();
	init_paths();
	init_artifacts();
	init_session_key();
	init_agent_deletion_discovery();
	init_agent_deletion_journal_read();
	init_testclaw_agent_db_registry();
	init_errno();
	init_path_guards();
}));
var init_agent_database_startup = __esmMin((() => {
	init_config_env_vars();
	init_errors();
	init_file_descriptor();
	init_sqlite_file_generation();
	init_sqlite_readonly_worker();
	init_subsystem();
	init_agent_database_admission();
	init_agent_deletion_journal();
	init_testclaw_state_db_paths();
	createSubsystemLogger("state/agent-admission");
	new AsyncLocalStorage();
}));
//#endregion
//#region src/infra/native-error-response-schema.ts
var nativeErrorDetailsSchema, nativeErrorResponseSchema;
var init_native_error_response_schema = __esmMin((() => {
	init_zod();
	nativeErrorDetailsSchema = object({
		message: string(),
		code: string().optional(),
		errcode: number().optional()
	});
	nativeErrorResponseSchema = nativeErrorDetailsSchema.extend({
		name: string(),
		cause: nativeErrorDetailsSchema.optional()
	});
}));
var init_native_error_response = __esmMin((() => {}));
var agentSchemaInspectionErrorSchema;
var init_testclaw_agent_schema_inspection_response = __esmMin((() => {
	init_zod();
	init_native_error_response_schema();
	init_native_error_response();
	init_sqlite_error_diagnostics();
	init_testclaw_state_worker_error();
	agentSchemaInspectionErrorSchema = nativeErrorResponseSchema.extend({ stateError: unknown().optional() });
}));
var init_testclaw_agent_schema_inspection_worker = __esmMin((() => {
	init_error_coercion();
	init_zod();
	init_runtime_process_url();
	init_runtime_worker_url();
	init_sqlite_file_generation();
	init_sqlite_readonly_worker();
	init_deferred();
	init_testclaw_agent_schema_inspection_response();
	discriminatedUnion("ok", [object({
		requestId: number().int().safe(),
		ok: literal(false),
		error: agentSchemaInspectionErrorSchema
	}), object({
		requestId: number().int().safe(),
		ok: literal(true),
		inspection: object({
			version: number().int().safe(),
			integrityGateOutcome: _enum(["cached", "healthy"]).optional(),
			writerAppVersion: string().optional(),
			reason: string().optional(),
			failure: agentSchemaInspectionErrorSchema.optional(),
			agentSchemaMeta: object({
				agentId: string().nullable(),
				role: string().nullable(),
				schemaVersion: number().nullable()
			}).nullable().optional()
		}).nullable()
	})]);
}));
var init_usingCtx = __esmMin((() => {}));
var init_testclaw_database_preflight_agent_scheduler = __esmMin((() => {
	init_sqlite_readonly_worker();
	init_deferred();
	init_testclaw_agent_schema_inspection_worker();
	init_usingCtx();
}));
var init_testclaw_database_preflight_messages = __esmMin((() => {
	init_sqlite_user_version();
	init_testclaw_state_db_contract();
}));
__esmMin((() => {
	init_error_coercion();
	init_runtime_process_entrypoints();
	init_runtime_worker_url();
	init_subsystem();
	init_testclaw_agent_db();
	init_testclaw_quarantine_store();
	init_testclaw_state_db();
	init_testclaw_state_db_paths();
	createSubsystemLogger("state/database-verify");
}));
__esmMin((() => {
	init_agent_scope_config();
	init_paths();
	init_session_sqlite_target();
	init_targets();
	init_errors();
	init_kysely_sync();
	init_node_sqlite();
	init_path_guards();
	init_sqlite_integrity();
	init_sqlite_schema_contract();
	init_sqlite_schema_header();
	init_sqlite_snapshot_source();
	init_sqlite_user_version();
	init_state_database_coordinator();
	init_state_migrations_media_persistence_targets();
	init_agent_database_admission();
	init_agent_database_startup();
	init_agent_deletion_discovery();
	init_agent_deletion_journal_read();
	init_testclaw_agent_db_contract();
	init_testclaw_agent_db_registry();
	init_testclaw_agent_db_registry_read();
	init_testclaw_database_preflight_agent_scheduler();
	init_testclaw_database_preflight_messages();
	init_testclaw_database_verify();
	init_testclaw_state_db_contract();
	init_testclaw_state_db_fast_path();
	init_testclaw_state_db_maintenance();
	init_testclaw_state_db_schema_migration_required();
	init_testclaw_state_db_schema_repair();
	init_testclaw_state_db_schema_version();
	init_testclaw_state_db_paths();
	init_testclaw_state_ownership();
	init_testclaw_state_schema_compatibility();
	init_testclaw_state_schema_publication();
	init_testclaw_state_schema();
	init_testclaw_state_db();
}));
//#endregion
export {};
