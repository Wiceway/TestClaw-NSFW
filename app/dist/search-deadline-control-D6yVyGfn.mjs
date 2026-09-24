//#region packages/memory-host-sdk/src/host/search-deadline-control.ts
/**
* Per-call control channel between a memory-search deadline owner and a nested
* phase that runs on its own budget. The canonical example is managed
* local-service acquisition during query embedding: service readiness is owned
* and bounded by `models.providers.<id>.localService.readyTimeoutMs`, so the
* whole-search deadline must not consume its budget while the caller waits for
* a cold service to become ready.
*
* The channel is symbol-keyed so it never serializes into tool payloads or
* provider request bodies and stays invisible to model-facing surfaces.
*/
const MEMORY_SEARCH_DEADLINE_CONTROL = Symbol("testclaw.memory-search-deadline-control");
/** Create the balanced fan-out at the deadline owner boundary. */
function createMemorySearchDeadlineControl() {
	let depth = 0;
	const listeners = /* @__PURE__ */ new Set();
	return {
		report(action) {
			if (action === "pause") {
				depth += 1;
				if (depth === 1) for (const listener of listeners) listener("pause");
				return;
			}
			if (depth === 0) return;
			depth -= 1;
			if (depth === 0) for (const listener of listeners) listener("resume");
		},
		subscribe(listener) {
			listeners.add(listener);
			if (depth > 0) listener("pause");
			return () => {
				listeners.delete(listener);
			};
		}
	};
}
//#endregion
export { createMemorySearchDeadlineControl as n, MEMORY_SEARCH_DEADLINE_CONTROL as t };
