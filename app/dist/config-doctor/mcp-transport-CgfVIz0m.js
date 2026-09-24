import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { u as toErrorObject } from "./error-coercion-C787aVxk.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { f as clampPositiveTimerTimeoutMs } from "./number-coercion-0M4tZV2c.js";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-BO-LaDsQ.js";
import { b as redactToolPayloadText } from "./redact-myZeUWr_.js";
import { t as formatErrorMessage } from "./errors-cp9Var1Z.js";
import { n as normalizeJsonSchemaForTypeBox } from "./json-schema-DpOMaL6j.js";
import { n as findJsonSchemaShapeError } from "./json-schema-defaults-C3jOE7Vf.js";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.js";
import { t as logDebug } from "./logger-DgjIIHeT.js";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.js";
import { i as settlesWithin, n as closeOwnedStdioProcess, r as createOwnedStdioProcess, t as OwnedStdioCleanupError } from "./owned-stdio-peBYH4mb.js";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-EEG0etQn.js";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-R-LTr41E.js";
import { n as withSameOriginMcpHttpHeaders, r as withoutMcpAuthorizationHeader, t as buildMcpHttpFetch } from "./mcp-http-fetch-CyAfXmpN.js";
import { r as withMcpAuthProfileBearer, t as resolveMcpAuthProfileId } from "./mcp-auth-profile-B1ewV63P.js";
import { n as operatorMcpOAuthIdentity, r as requesterMcpOAuthIdentity } from "./mcp-oauth-identity-CcnMspqq.js";
import { d as resolveMcpOAuthAccessToken, u as recordMcpOAuthAuthorizationRequired } from "./mcp-oauth-Z7lToIiK.js";
import process from "node:process";
import { PassThrough } from "node:stream";
import fs from "node:fs/promises";
import { Compile } from "typebox/compile";
import { StringDecoder } from "node:string_decoder";
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { StreamableHTTPClientTransport, StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport, SseError } from "@modelcontextprotocol/sdk/client/sse.js";
import { ReadBuffer, STDIO_DEFAULT_MAX_BUFFER_SIZE, serializeMessage } from "@modelcontextprotocol/sdk/shared/stdio.js";
import { getDefaultEnvironment } from "@modelcontextprotocol/sdk/client/stdio.js";
import { AjvJsonSchemaValidator } from "@modelcontextprotocol/sdk/validation/ajv-provider.js";
import { extractWWWAuthenticateParams } from "@modelcontextprotocol/sdk/client/auth.js";
//#region src/agents/mcp-error.ts
const STREAMABLE_RESPONSE_BODY_MARKER = "Error POSTing to endpoint:";
const LEGACY_RESPONSE_BODY_RE = /Error POSTing to endpoint \(HTTP \d+\):/;
/** MCP lifecycle errors use the protocol code, including serialized SDK errors. */
function isMcpRequestTimeoutError(error) {
	return isRecord(error) && error.code === ErrorCode.RequestTimeout;
}
/** Redacts MCP diagnostics, including response bodies the SDK includes in thrown errors. */
function redactMcpDiagnosticError(error) {
	let message = formatErrorMessage(error);
	const streamableIndex = message.indexOf(STREAMABLE_RESPONSE_BODY_MARKER);
	const legacyMatch = LEGACY_RESPONSE_BODY_RE.exec(message);
	const prefixEnd = streamableIndex >= 0 ? streamableIndex + 26 : legacyMatch ? legacyMatch.index + legacyMatch[0].length : void 0;
	if (prefixEnd !== void 0) message = `${message.slice(0, prefixEnd)} [redacted response body]`;
	return redactToolPayloadText(redactSensitiveUrlLikeString(message));
}
//#endregion
//#region src/agents/mcp-http-transport.ts
const STREAM_RETRY_EXHAUSTED_RE = /^Maximum reconnection attempts \(\d+\) exceeded\.$/;
const SESSION_TERMINATION_TIMEOUT_MS = 5e3;
var McpSseSessionExpiredError = class extends Error {};
var McpHttpResponseTooLargeError = class extends Error {
	constructor(unit) {
		super(`MCP ${unit} exceeds ${STDIO_DEFAULT_MAX_BUFFER_SIZE} bytes`);
		this.code = "MCP_HTTP_RESPONSE_TOO_LARGE";
		this.name = "McpHttpResponseTooLargeError";
	}
};
function isMcpSseEventTooLargeError(error) {
	return error.message.includes(`MCP SSE event exceeds ${STDIO_DEFAULT_MAX_BUFFER_SIZE} bytes`);
}
function isEventStreamResponse(response) {
	return response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() === "text/event-stream";
}
function limitMcpResponseStream(body, eventStream) {
	let messageBytes = 0;
	let retainedEventBytes = 0;
	let lineBytes = 0;
	let lineIsComment = false;
	let previousByteWasCr = false;
	const checkEventLimit = () => {
		if (retainedEventBytes + lineBytes > STDIO_DEFAULT_MAX_BUFFER_SIZE) throw new McpHttpResponseTooLargeError("SSE event");
	};
	const finishEventLine = () => {
		if (lineBytes === 0) retainedEventBytes = 0;
		else if (!lineIsComment) retainedEventBytes += lineBytes + 1;
		lineBytes = 0;
		lineIsComment = false;
		checkEventLimit();
	};
	return body.pipeThrough(new TransformStream({ transform(chunk, controller) {
		if (!eventStream) {
			messageBytes += chunk.byteLength;
			if (messageBytes > STDIO_DEFAULT_MAX_BUFFER_SIZE) throw new McpHttpResponseTooLargeError("HTTP response");
			controller.enqueue(chunk);
			return;
		}
		const bytes = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
		let cursor = previousByteWasCr && bytes[0] === 10 ? 1 : 0;
		if (bytes.length > 0) previousByteWasCr = false;
		let lf = bytes.indexOf(10, cursor);
		let cr = bytes.indexOf(13, cursor);
		while (cursor < bytes.length) {
			const delimiter = lf < 0 ? cr : cr < 0 ? lf : Math.min(lf, cr);
			const end = delimiter < 0 ? bytes.length : delimiter;
			if (end > cursor) {
				if (lineBytes === 0) lineIsComment = bytes[cursor] === 58;
				lineBytes += end - cursor;
				previousByteWasCr = false;
				checkEventLimit();
			}
			if (delimiter < 0) break;
			finishEventLine();
			previousByteWasCr = bytes[delimiter] === 13;
			cursor = delimiter + 1;
			if (previousByteWasCr && bytes[cursor] === 10) {
				cursor += 1;
				previousByteWasCr = false;
			}
			if (lf >= 0 && lf < cursor) lf = bytes.indexOf(10, cursor);
			if (cr >= 0 && cr < cursor) cr = bytes.indexOf(13, cursor);
		}
		controller.enqueue(chunk);
	} }));
}
function limitMcpHttpResponse(response) {
	if (!response.body) return response;
	return new Response(limitMcpResponseStream(response.body, isEventStreamResponse(response)), {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function withMcpHttpResponseLimits(fetchFn) {
	return async (input, init) => limitMcpHttpResponse(await fetchFn(input, init));
}
function toEventSourceByteStream(body) {
	if (body instanceof ReadableStream) return body;
	const reader = body.getReader();
	return new ReadableStream({
		async pull(controller) {
			const result = await reader.read();
			if (result.done) {
				controller.close();
				return;
			}
			if (!(result.value instanceof Uint8Array)) {
				await reader.cancel();
				throw new TypeError("MCP SSE response body must contain byte chunks");
			}
			controller.enqueue(new Uint8Array(result.value));
		},
		async cancel() {
			await reader.cancel();
		}
	});
}
function limitMcpEventSourceResponse(response) {
	if (!response.body && response instanceof Response) return response;
	const headers = response instanceof Response ? response.headers : new Headers();
	if (!(response instanceof Response)) for (const name of ["content-type", "www-authenticate"]) {
		const value = response.headers.get(name);
		if (value) headers.set(name, value);
	}
	const body = response.body ? limitMcpResponseStream(toEventSourceByteStream(response.body), true) : null;
	const limitedResponse = new Response(body, {
		status: response.status,
		...response instanceof Response ? { statusText: response.statusText } : {},
		headers
	});
	Object.defineProperties(limitedResponse, {
		url: { value: response.url },
		redirected: { value: response.redirected }
	});
	return limitedResponse;
}
var AssistantMcpHttpTransport = class {
	constructor() {
		this.closed = false;
		this.closeEmitted = false;
	}
	emitClose() {
		if (this.closeEmitted) return;
		this.closeEmitted = true;
		this.onclose?.();
	}
	emitError(error) {
		if (!this.closed) this.onerror?.(error);
	}
};
/** Converts legacy SSE terminal HTTP failures into the lifecycle close the SDK omits. */
var AssistantSSEClientTransport = class extends AssistantMcpHttpTransport {
	constructor(url, options) {
		super();
		const baseFetch = options?.fetch ?? fetch;
		const limitedFetch = withMcpHttpResponseLimits(baseFetch);
		const eventSourceInit = options?.eventSourceInit;
		const configuredEventSourceFetch = eventSourceInit?.fetch;
		this.transport = new SSEClientTransport(url, {
			...options,
			fetch: async (input, init) => {
				const response = await limitedFetch(input, init);
				if (init?.method === "POST" && response.status === 404) throw new McpSseSessionExpiredError(`Error POSTing to endpoint (HTTP 404): ${await response.text().catch(() => null)}`);
				return response;
			},
			eventSourceInit: {
				...eventSourceInit,
				fetch: async (eventUrl, init) => {
					return limitMcpEventSourceResponse(configuredEventSourceFetch ? await configuredEventSourceFetch(eventUrl, init) : await baseFetch(eventUrl, init));
				}
			}
		});
	}
	async start() {
		this.transport.onmessage = (message) => this.onmessage?.(message);
		this.transport.onclose = () => this.emitClose();
		this.transport.onerror = (error) => {
			this.emitError(error);
			if (isMcpSseEventTooLargeError(error) || error instanceof SseError && error.code !== void 0) {
				this.close();
				setTimeout(() => void this.transport.close(), 0).unref?.();
			}
		};
		await this.transport.start();
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		await this.transport.close();
		this.emitClose();
	}
	async send(message) {
		if (this.closed) throw new Error("MCP SSE transport is closed");
		await this.transport.send(message);
	}
	setProtocolVersion(version) {
		this.transport.setProtocolVersion(version);
	}
};
/** Owns Streamable HTTP notification recovery and stateful cleanup around SDK 1.30.0. */
var AssistantStreamableHTTPClientTransport = class extends AssistantMcpHttpTransport {
	constructor(url, options = {}) {
		super();
		this.pendingExpiredNotificationGet = false;
		this.url = url;
		this.cleanupFetch = options.fetch ?? fetch;
		this.requestInit = options.requestInit;
		const runtimeFetch = async (input, init) => {
			if (this.closed) throw new Error("MCP Streamable HTTP transport is closed");
			const response = limitMcpHttpResponse(await this.cleanupFetch(input, init));
			if (init?.method === "GET" && response.status === 404 && this.sessionId !== void 0) this.pendingExpiredNotificationGet = true;
			return response;
		};
		this.transport = new StreamableHTTPClientTransport(url, {
			...options,
			fetch: runtimeFetch
		});
	}
	get sessionId() {
		return this.transport.sessionId;
	}
	get protocolVersion() {
		return this.transport.protocolVersion;
	}
	async start() {
		this.transport.onmessage = (message) => this.onmessage?.(message);
		this.transport.onclose = () => this.emitClose();
		this.transport.onerror = (error) => {
			if (this.closed) {
				setTimeout(() => void this.transport.close(), 0).unref?.();
				return;
			}
			this.emitError(error);
			const sessionExpired = this.pendingExpiredNotificationGet && error instanceof StreamableHTTPError && error.code === 404;
			if (sessionExpired) this.pendingExpiredNotificationGet = false;
			if (isMcpSseEventTooLargeError(error) || sessionExpired || STREAM_RETRY_EXHAUSTED_RE.test(error.message)) this.close();
		};
		await this.transport.start();
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		await this.transport.close();
		this.emitClose();
	}
	async send(message, options) {
		await this.transport.send(message, options);
	}
	setProtocolVersion(version) {
		this.transport.setProtocolVersion(version);
	}
	/** Uses a fresh request signal because failed initialization makes the SDK's signal unusable. */
	async terminateSession() {
		const sessionId = this.sessionId;
		if (!sessionId || sessionId === this.terminatedSessionId) return;
		const headers = new Headers(this.requestInit?.headers);
		headers.set("mcp-session-id", sessionId);
		if (this.protocolVersion) headers.set("mcp-protocol-version", this.protocolVersion);
		const response = await this.cleanupFetch(this.url, {
			...this.requestInit,
			method: "DELETE",
			headers,
			signal: AbortSignal.timeout(SESSION_TERMINATION_TIMEOUT_MS)
		});
		response.body?.cancel().catch(() => void 0);
		if (!response.ok && response.status !== 404 && response.status !== 405) throw new StreamableHTTPError(response.status, `Failed to terminate session: ${response.statusText}`);
		this.terminatedSessionId = sessionId;
	}
};
//#endregion
//#region src/agents/mcp-stdio-transport.ts
/**
* Assistant stdio transport wrapper for MCP server subprocesses.
*/
var AssistantStdioClientTransport = class {
	constructor(serverParams) {
		this.serverParams = serverParams;
		this.stderrStream = null;
		this.forceRequested = false;
		this.closeNotified = false;
		this.startupAbort = new AbortController();
		this.readBuffer = serverParams.decoder ?? new ReadBuffer();
		if (serverParams.stderr === "pipe" || serverParams.stderr === "overlapped") this.stderrStream = new PassThrough();
	}
	async start() {
		if (this.starting || this.closing) throw new Error("AssistantStdioClientTransport already started or closed; Client.connect() starts transports automatically.");
		this.starting = this.startProcess();
		return this.starting;
	}
	async startProcess() {
		const prepareDataDir = this.serverParams.prepareDataDir?.trim();
		if (prepareDataDir) try {
			await fs.mkdir(prepareDataDir, { recursive: true });
		} catch (error) {
			throw new Error(`unable to prepare PLUGIN_DATA directory "${prepareDataDir}": ${formatErrorMessage(error)}`, { cause: error });
		}
		if (this.startupAbort.signal.aborted) throw new Error("MCP stdio transport is closed");
		try {
			const child = await createOwnedStdioProcess({
				argv: [this.serverParams.command, ...this.serverParams.args ?? []],
				cwd: this.serverParams.cwd,
				env: this.serverParams.exactEnv ? mergeProcessEnv([this.serverParams.env]) : mergeProcessEnv([getDefaultEnvironment(), this.serverParams.env]),
				...this.serverParams.exactEnv ? { exactEnv: true } : {},
				abortSignal: this.startupAbort.signal,
				stderrDestination: this.stderrStream ?? (this.serverParams.stderr === "ignore" ? void 0 : process.stderr)
			});
			this.process = child;
			child.onError((error) => this.onerror?.(error));
			const receive = (chunk) => {
				if (this.closing) return;
				try {
					this.readBuffer.append(chunk);
					this.processReadBuffer();
				} catch (error) {
					this.onerror?.(error instanceof Error ? error : new Error(String(error)));
					this.close().catch(() => {});
				}
			};
			child.onStdout((text) => {
				if (!child.supportsRawOutput) receive(Buffer.from(text));
			}, receive);
			if (this.serverParams.stderr === "ignore") child.onStderr(() => {});
			child.wait().then((exit) => {
				try {
					this.onexit?.(exit);
				} catch (error) {
					this.onerror?.(error instanceof Error ? error : new Error(String(error)));
				} finally {
					this.close().catch(() => {});
					this.notifyClosed();
				}
			}, (error) => {
				this.onerror?.(error instanceof Error ? error : new Error(String(error)));
				this.close().catch(() => {});
				this.notifyClosed();
			});
		} catch (error) {
			if (error instanceof OwnedStdioCleanupError) {
				this.startupCleanupError = error;
				recordAgentCleanupFailure();
			}
			this.onerror?.(error instanceof Error ? error : new Error(String(error)));
			throw error;
		}
	}
	get stderr() {
		return this.stderrStream;
	}
	get pid() {
		return this.process?.pid ?? null;
	}
	get cleanupResult() {
		return this.cleanup;
	}
	notifyClosed() {
		if (this.closeNotified) return;
		this.closeNotified = true;
		this.onclose?.();
	}
	processReadBuffer() {
		while (!this.closing) try {
			const message = this.readBuffer.readMessage();
			if (message === null) break;
			this.onmessage?.(message);
		} catch (error) {
			this.onerror?.(error instanceof Error ? error : new Error(String(error)));
		}
	}
	close() {
		if (this.starting && !this.process) this.startupAbort.abort();
		this.closing ??= (async () => {
			await this.starting?.catch(() => void 0);
			try {
				if (this.startupCleanupError) throw this.startupCleanupError;
				if (this.process) this.cleanup = await closeOwnedStdioProcess(this.process, { force: this.forceRequested });
			} catch (error) {
				recordAgentCleanupFailure();
				throw error;
			} finally {
				this.process = void 0;
				this.readBuffer.clear();
				this.stderrStream?.end();
				this.notifyClosed();
			}
		})();
		this.closing.catch(() => recordAgentCleanupFailure());
		return this.closing;
	}
	/** Retire RPC admission now; the returned promise still joins owned-process cleanup. */
	retire() {
		const closing = this.close();
		this.readBuffer.clear();
		this.notifyClosed();
		return closing;
	}
	terminate() {
		this.process?.kill("SIGTERM");
		return this.retire();
	}
	forceClose() {
		this.forceRequested = true;
		this.process?.kill("SIGKILL");
		return this.close();
	}
	send(message) {
		return new Promise((resolve, reject) => {
			const stdin = this.closing ? void 0 : this.process?.stdin;
			if (!stdin) throw new Error("Not connected");
			const json = serializeMessage(message);
			try {
				stdin.write(json, (err) => {
					if (err) reject(err);
					else resolve();
				});
			} catch (err) {
				reject(err instanceof Error ? err : new Error(String(err)));
			}
		});
	}
};
//#endregion
//#region src/agents/mcp-client-lifecycle.ts
var McpClientConnectTimeoutError = class extends Error {};
/** Matches an expired HTTP session without treating stateless HTTP 404s as expiration. */
function isMcpHttpSessionExpired(session, error) {
	if (session.transportType === "sse") return session.transport instanceof AssistantSSEClientTransport && error instanceof McpSseSessionExpiredError;
	return session.transportType === "streamable-http" && session.transport instanceof AssistantStreamableHTTPClientTransport && session.transport.sessionId !== void 0 && error instanceof StreamableHTTPError && error.code === 404;
}
async function connectMcpClient(params) {
	const deadline = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, deadline]) : deadline;
	let onAbort;
	const aborted = new Promise((_, reject) => {
		onAbort = () => reject(signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("MCP startup aborted"));
		if (signal.aborted) onAbort();
		else signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		await Promise.race([(async () => {
			const { client } = params;
			const close = client.close;
			client.close = () => {
				const closing = close.call(client);
				closing.catch(() => recordAgentCleanupFailure());
				return closing;
			};
			try {
				await client.connect(params.transport, {
					signal,
					timeout: params.timeoutMs,
					maxTotalTimeout: params.timeoutMs
				});
			} finally {
				client.close = close;
			}
		})(), aborted]);
	} catch (error) {
		if (deadline.aborted || isMcpRequestTimeoutError(error)) {
			await disposeMcpClient({
				client: params.client,
				transport: params.transport,
				transportType: params.transport instanceof AssistantStdioClientTransport ? "stdio" : params.transport instanceof AssistantStreamableHTTPClientTransport ? "streamable-http" : "sse"
			}, Math.min(params.timeoutMs, 1e3));
			throw new McpClientConnectTimeoutError(`MCP server connection timed out after ${params.timeoutMs}ms`, { cause: error });
		}
		throw error;
	} finally {
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
async function disposeMcpClient(session, timeoutMs = 5e3) {
	let failed = false;
	const markFailed = () => {
		failed = true;
		recordAgentCleanupFailure();
	};
	const ignoreCloseFailure = async (close) => {
		try {
			await close();
		} catch (error) {
			const firstFailure = !failed;
			markFailed();
			if (firstFailure) try {
				session.onCleanupError?.(error);
			} catch {}
		}
	};
	try {
		const graceful = (async () => {
			if (session.transportType === "streamable-http") await ignoreCloseFailure(() => session.transport.terminateSession?.());
			await ignoreCloseFailure(() => session.transport.close());
			await ignoreCloseFailure(() => session.client.close());
		})();
		if (await settlesWithin(graceful, timeoutMs)) return failed ? "uncertain" : "closed";
		const { transport } = session;
		const closeTransport = session.transportType === "stdio" && transport instanceof AssistantStdioClientTransport ? () => transport.forceClose() : () => transport.close();
		if (!await settlesWithin(Promise.all([
			graceful,
			ignoreCloseFailure(closeTransport),
			ignoreCloseFailure(() => session.client.close())
		]), timeoutMs)) markFailed();
		return failed ? "uncertain" : "closed";
	} finally {
		session.detachStderr?.();
	}
}
//#endregion
//#region src/agents/mcp-json-schema-validator.ts
const DRAFT_2020_12_SCHEMA = "https://json-schema.org/draft/2020-12/schema";
function isDraft202012Schema(schema) {
	return schema.$schema === DRAFT_2020_12_SCHEMA;
}
function formatTypeBoxErrors(errors) {
	return errors.map((error) => {
		const message = error.message?.trim() || "schema validation failed";
		return error.instancePath ? `${error.instancePath} ${message}` : message;
	}).join(", ") || "schema validation failed";
}
/** MCP SDK validator with draft-2020-12 support for external tool schemas. */
function createMcpJsonSchemaValidator() {
	const defaultValidator = new AjvJsonSchemaValidator();
	return { getValidator(schema) {
		if (!isDraft202012Schema(schema)) return defaultValidator.getValidator(schema);
		let validator;
		try {
			const schemaError = findJsonSchemaShapeError(schema);
			if (schemaError) throw new Error(schemaError);
			validator = Compile(normalizeJsonSchemaForTypeBox(schema, { format: "annotation" }));
		} catch (error) {
			const setupError = toErrorObject(error, "schema setup failed");
			throw new Error(`Invalid MCP draft-2020-12 JSON Schema: ${setupError.message}`, { cause: error });
		}
		return (input) => {
			if (validator.Check(input)) return {
				valid: true,
				data: input,
				errorMessage: void 0
			};
			return {
				valid: false,
				data: void 0,
				errorMessage: formatTypeBoxErrors([...validator.Errors(input)])
			};
		};
	} };
}
//#endregion
//#region src/agents/mcp-metadata.ts
const MCP_METADATA_TEXT_LIMIT = 1200;
const MCP_APPS_CLIENT_EXTENSION = "io.modelcontextprotocol/ui";
const MCP_APP_RESOURCE_MIME_TYPE = "text/html;profile=mcp-app";
function buildMcpClientCapabilities(mcpAppsEnabled) {
	return mcpAppsEnabled ? { extensions: { [MCP_APPS_CLIENT_EXTENSION]: { mimeTypes: [MCP_APP_RESOURCE_MIME_TYPE] } } } : {};
}
function normalizeToolUiVisibility(value) {
	if (!Array.isArray(value)) return;
	const normalized = value.filter((entry) => entry === "app" || entry === "model");
	return [...new Set(normalized)].toSorted();
}
function summarizeServerCapabilities(capabilities) {
	return {
		resources: capabilities?.resources ? { listChanged: capabilities.resources.listChanged === true } : void 0,
		prompts: capabilities?.prompts ? { listChanged: capabilities.prompts.listChanged === true } : void 0,
		tools: capabilities?.tools ? { listChanged: capabilities.tools.listChanged === true } : void 0
	};
}
/** Scrubs untrusted MCP metadata before exposing it to a model. */
function sanitizeMcpMetadataText(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	const scrubbed = normalized.replace(/ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/disregard\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, "[redacted MCP metadata instruction]").replace(/system\s+prompt/gi, "system prompt");
	return scrubbed.length > MCP_METADATA_TEXT_LIMIT ? `${truncateUtf16Safe(scrubbed, MCP_METADATA_TEXT_LIMIT)}...` : scrubbed;
}
//#endregion
//#region src/agents/mcp-pagination.ts
/** Shared bounded pagination for MCP list operations. */
function positiveInteger(value, label) {
	if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`${label} must be a positive safe integer`);
	return value;
}
function abortError(signal, label) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error(`${label} aborted`);
}
async function collectMcpPaginatedItems(params) {
	const timeoutMs = clampPositiveTimerTimeoutMs(params.timeoutMs);
	if (timeoutMs === void 0) throw new Error(`${params.label} requires a positive timeout`);
	const maxPages = positiveInteger(params.maxPages, `${params.label} maxPages`);
	const maxItems = positiveInteger(params.maxItems, `${params.label} maxItems`);
	const maxBytes = positiveInteger(params.maxBytes, `${params.label} maxBytes`);
	const deadlineController = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, deadlineController.signal]) : deadlineController.signal;
	if (signal.aborted) throw abortError(signal, params.label);
	const deadlineAtMs = performance.now() + timeoutMs;
	const timeoutError = /* @__PURE__ */ new Error(`${params.label} timed out after ${timeoutMs}ms`);
	const deadlineTimer = setTimeout(() => deadlineController.abort(timeoutError), timeoutMs);
	deadlineTimer.unref?.();
	const assertActive = () => {
		if (signal.aborted) throw abortError(signal, params.label);
		if (performance.now() >= deadlineAtMs) {
			deadlineController.abort(timeoutError);
			throw timeoutError;
		}
	};
	let onAbort;
	const aborted = new Promise((_resolve, reject) => {
		onAbort = () => reject(abortError(signal, params.label));
		signal.addEventListener("abort", onAbort, { once: true });
	});
	const items = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let collectedBytes = 0;
	let cursor;
	try {
		for (let pageNumber = 0; pageNumber < maxPages; pageNumber += 1) {
			assertActive();
			const page = await Promise.race([params.loadPage({
				cursor,
				requestTimeoutMs: timeoutMs,
				signal
			}), aborted]);
			assertActive();
			const measured = boundedJsonUtf8Bytes(page.serializedValue ?? {
				items: page.items,
				nextCursor: page.nextCursor
			}, maxBytes - collectedBytes);
			if (!measured.complete || collectedBytes + measured.bytes > maxBytes) throw new Error(`${params.label} exceeded ${maxBytes} bytes`);
			collectedBytes += measured.bytes;
			for (const item of page.items) {
				const mapped = params.mapItem ? params.mapItem(item) : item;
				if (mapped === void 0) continue;
				if (items.length >= maxItems) throw new Error(`${params.label} exceeded ${maxItems} ${params.itemLabel}`);
				items.push(mapped);
			}
			const nextCursor = page.nextCursor;
			assertActive();
			if (nextCursor === void 0) return items;
			if (seenCursors.has(nextCursor)) throw new Error(`${params.label} returned a repeated pagination cursor`);
			seenCursors.add(nextCursor);
			cursor = nextCursor;
		}
		throw new Error(`${params.label} exceeded ${maxPages} pages`);
	} finally {
		clearTimeout(deadlineTimer);
		if (onAbort) signal.removeEventListener("abort", onAbort);
	}
}
//#endregion
//#region src/agents/mcp-tool-metadata.ts
/** Canonicalizes one server catalog before policy, publication, and call metadata diverge. */
function normalizeMcpToolCatalog(tools, schemaValidator, classify = () => "include") {
	const canonicalNames = tools.map((tool) => tool.name.trim());
	const nameCounts = /* @__PURE__ */ new Map();
	for (const toolName of canonicalNames) if (toolName) nameCounts.set(toolName, (nameCounts.get(toolName) ?? 0) + 1);
	const included = [];
	const deniedTools = [];
	const excludedTools = [];
	const resultValidators = /* @__PURE__ */ new Map();
	for (const [index, sourceTool] of tools.entries()) {
		const toolName = canonicalNames[index] ?? "";
		if (!toolName) continue;
		const tool = {
			...sourceTool,
			name: toolName
		};
		if (nameCounts.get(toolName) !== 1 || sourceTool.execution?.taskSupport === "required") {
			excludedTools.push(tool);
			continue;
		}
		const disposition = classify(toolName);
		if (disposition === "exclude") {
			excludedTools.push({
				...sourceTool,
				name: toolName
			});
			continue;
		}
		if (disposition === "include") {
			included.push(tool);
			if (tool.outputSchema) {
				const validator = schemaValidator.getValidator(tool.outputSchema);
				resultValidators.set(toolName, (result) => {
					if (result.structuredContent === void 0 && result.isError !== true) throw new McpError(ErrorCode.InvalidRequest, `Tool ${toolName} has an output schema but did not return structured content`);
					if (result.structuredContent === void 0) return;
					const validation = validator(result.structuredContent);
					if (!validation.valid) throw new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validation.errorMessage}`);
				});
			}
		} else deniedTools.push(tool);
	}
	return {
		tools: included,
		excludedTools,
		metadata: { validatorForCall(toolName) {
			return resultValidators.get(toolName);
		} },
		deniedTools
	};
}
//#endregion
//#region src/agents/mcp-oauth-fetch.ts
function withBearerHeader(init, accessToken) {
	const headers = new Headers(init.headers);
	headers.set("authorization", `Bearer ${accessToken}`);
	return {
		...init,
		headers
	};
}
async function toFetchInit(request) {
	const body = request.body ? await request.arrayBuffer() : void 0;
	return {
		method: request.method,
		headers: request.headers,
		body,
		cache: request.cache,
		credentials: request.credentials,
		integrity: request.integrity,
		keepalive: request.keepalive,
		mode: request.mode,
		redirect: request.redirect,
		referrer: request.referrer,
		referrerPolicy: request.referrerPolicy,
		signal: request.signal
	};
}
/**
* Own native OAuth retries above the MCP SDK transport. The SDK otherwise runs
* refresh outside Assistant's cross-process OAuth lease on every 401/403.
*/
function withMcpOAuthBearer(params) {
	const resourceOrigin = new URL(params.identity.serverUrl).origin;
	return async (input, init) => {
		const source = input instanceof Request ? input.clone() : input;
		const request = new Request(source, init);
		const requestUrl = request.url;
		if (new URL(requestUrl).origin !== resourceOrigin) return await params.fetchFn(requestUrl, await toFetchInit(request));
		const accessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			allowMissingToken: true,
			signal: request.signal
		});
		const fetchInit = await toFetchInit(request);
		const firstInit = accessToken ? withBearerHeader(fetchInit, accessToken) : fetchInit;
		const response = await params.fetchFn(requestUrl, firstInit);
		const challenge = extractWWWAuthenticateParams(response);
		const insufficientScope = response.status === 403 && challenge.error === "insufficient_scope";
		if (!(response.status === 401 || insufficientScope)) return response;
		await response.body?.cancel().catch(() => void 0);
		const nextAccessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			authorizationChallenge: true,
			interactiveAuthorizationRequired: insufficientScope,
			rejectedAccessToken: accessToken,
			resourceMetadataUrl: challenge.resourceMetadataUrl,
			signal: request.signal,
			scope: challenge.scope
		});
		const retryInit = withBearerHeader(fetchInit, nextAccessToken);
		const retryResponse = await params.fetchFn(requestUrl, retryInit);
		const retryChallenge = extractWWWAuthenticateParams(retryResponse);
		const retryInsufficientScope = retryResponse.status === 403 && retryChallenge.error === "insufficient_scope";
		if (retryResponse.status === 401 || retryInsufficientScope) {
			const rejectedAccessToken = nextAccessToken;
			await recordMcpOAuthAuthorizationRequired({
				identity: params.identity,
				rejectedAccessToken,
				resourceMetadataUrl: retryChallenge.resourceMetadataUrl ?? challenge.resourceMetadataUrl,
				scope: retryChallenge.scope ?? challenge.scope,
				signal: request.signal
			});
		}
		return retryResponse;
	};
}
//#endregion
//#region src/agents/mcp-transport.ts
/**
* MCP client transport factory.
*
* This module turns normalized MCP server config into stdio, SSE, or
* streamable-HTTP SDK transports with Assistant auth, redirect, and logging rules.
*/
const MAX_MCP_STDERR_LINE_BYTES = 8192;
function attachStderrLogging(serverName, transport) {
	const stderr = transport.stderr;
	if (!stderr) return;
	const decoder = new StringDecoder("utf8");
	let pending = "";
	let truncated = false;
	let progressTimer;
	const emit = (text) => {
		const tail = truncateUtf8Suffix(text, MAX_MCP_STDERR_LINE_BYTES);
		const message = `${truncated || tail !== text ? "[stderr line truncated] " : ""}${tail}`.trim();
		truncated = false;
		if (message) logDebug(`bundle-mcp:${serverName}: ${message}`);
	};
	const flushProgress = () => {
		progressTimer = void 0;
		const text = pending;
		pending = "";
		emit(text);
	};
	const onData = (chunk) => {
		const decoded = decoder.write(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
		const lines = (pending + decoded).split(/[\r\n]/);
		pending = lines.pop() ?? "";
		for (const line of lines) emit(line);
		const tail = truncateUtf8Suffix(pending, MAX_MCP_STDERR_LINE_BYTES);
		truncated ||= tail !== pending;
		pending = tail;
		if (pending && !progressTimer) {
			progressTimer = setTimeout(flushProgress, 250);
			progressTimer.unref();
		} else if (!pending) {
			clearTimeout(progressTimer);
			progressTimer = void 0;
		}
	};
	const finalize = () => {
		stderr.off("data", onData);
		stderr.off("end", finalize);
		stderr.off("close", finalize);
		clearTimeout(progressTimer);
		pending += decoder.end();
		flushProgress();
	};
	stderr.on("data", onData);
	stderr.on("end", finalize);
	stderr.on("close", finalize);
	return finalize;
}
function buildSseEventSourceFetch(headers, baseFetch) {
	return (url, init) => {
		const mergedHeaders = {};
		for (const [key, value] of new Headers(init?.headers)) mergedHeaders[key.toLowerCase()] = value;
		for (const [key, value] of Object.entries(headers)) mergedHeaders[key.toLowerCase()] = value;
		return baseFetch(url, {
			...init,
			headers: mergedHeaders
		});
	};
}
/** Resolves a configured MCP server into a live SDK transport instance. */
function resolveMcpTransport(serverName, rawServer, options) {
	const resolved = resolveMcpTransportConfig(serverName, rawServer);
	if (!resolved) return null;
	if (resolved.kind === "stdio") {
		const transport = new AssistantStdioClientTransport({
			command: resolved.command,
			args: resolved.args,
			env: resolved.env,
			cwd: resolved.cwd,
			prepareDataDir: options?.prepareDataDir,
			stderr: "pipe"
		});
		return {
			transport,
			description: resolved.description,
			transportType: "stdio",
			connectionTimeoutMs: resolved.connectionTimeoutMs,
			requestTimeoutMs: resolved.requestTimeoutMs,
			supportsParallelToolCalls: resolved.supportsParallelToolCalls,
			detachStderr: attachStderrLogging(serverName, transport)
		};
	}
	const authProfileId = resolveMcpAuthProfileId(rawServer);
	const requesterScope = options?.requesterScope;
	let oauthIdentity;
	if (resolved.oauth?.identity === "per-requester") {
		if (!requesterScope) return null;
		oauthIdentity = requesterMcpOAuthIdentity(serverName, resolved.url, requesterScope);
	} else oauthIdentity = operatorMcpOAuthIdentity(serverName, resolved.url);
	const baseFetch = buildMcpHttpFetch({
		sslVerify: resolved.sslVerify,
		clientCert: resolved.clientCert,
		clientKey: resolved.clientKey,
		resourceUrl: resolved.url
	});
	const headers = resolved.auth === "oauth" || authProfileId ? withoutMcpAuthorizationHeader(resolved.headers) : resolved.headers;
	const resourceFetch = withSameOriginMcpHttpHeaders({
		fetchFn: baseFetch,
		headers,
		resourceUrl: resolved.url
	});
	const httpFetch = authProfileId ? withMcpAuthProfileBearer({
		fetchFn: baseFetch,
		serverName,
		resourceUrl: resolved.url,
		headers,
		authProfileId,
		cfg: options?.cfg,
		agentDir: options?.agentDir
	}) : resolved.auth === "oauth" ? withMcpOAuthBearer({
		fetchFn: resourceFetch,
		authFetchFn: resourceFetch,
		identity: oauthIdentity,
		config: resolved.oauth
	}) : baseFetch;
	if (resolved.transportType === "streamable-http") return {
		transport: new AssistantStreamableHTTPClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !headers ? void 0 : { headers },
			fetch: httpFetch
		}),
		description: resolved.description,
		transportType: "streamable-http",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
	const sseHeaders = { ...headers };
	const hasHeaders = Object.keys(sseHeaders).length > 0;
	return {
		transport: new AssistantSSEClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !hasHeaders ? void 0 : { headers: sseHeaders },
			fetch: httpFetch,
			eventSourceInit: { fetch: buildSseEventSourceFetch(resolved.auth === "oauth" ? {} : sseHeaders, httpFetch) }
		}),
		description: resolved.description,
		transportType: "sse",
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
}
//#endregion
export { normalizeToolUiVisibility as a, createMcpJsonSchemaValidator as c, disposeMcpClient as d, isMcpHttpSessionExpired as f, buildMcpClientCapabilities as i, McpClientConnectTimeoutError as l, normalizeMcpToolCatalog as n, sanitizeMcpMetadataText as o, redactMcpDiagnosticError as p, collectMcpPaginatedItems as r, summarizeServerCapabilities as s, resolveMcpTransport as t, connectMcpClient as u };
