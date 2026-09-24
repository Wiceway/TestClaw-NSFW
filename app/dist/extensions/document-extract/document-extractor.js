import { r as resolveRuntimeWorkerUrl } from "../../runtime-worker-url-DEzGnZz9.mjs";
import { t as WorkerTaskPool } from "../../worker-task-pool-xVA5A4Bb.mjs";
import { t as documentExtractorWorkerEntrypoint } from "../../document-extractor-worker-entrypoint-CfkHAu5c.mjs";
import "../../process-runtime-Boey3jvK.mjs";
//#region extensions/document-extract/document-extractor.ts
const pool = new WorkerTaskPool({
	workerUrl: resolveRuntimeWorkerUrl(documentExtractorWorkerEntrypoint),
	maxWorkers: 1,
	sharedCompute: true
});
function createPdfDocumentExtractor() {
	return {
		id: "pdf",
		label: "PDF",
		mimeTypes: ["application/pdf"],
		autoDetectOrder: 10,
		extract: async ({ signal, onImageExtractionError, ...request }) => {
			const reply = await pool.run(request, {
				timeoutMs: 18e4,
				signal,
				inputBytes: request.buffer.byteLength
			});
			signal?.throwIfAborted();
			for (const error of reply.imageErrors) onImageExtractionError?.(error);
			if (reply.status === "failed") throw reply.error;
			return reply.result;
		}
	};
}
//#endregion
export { createPdfDocumentExtractor };
