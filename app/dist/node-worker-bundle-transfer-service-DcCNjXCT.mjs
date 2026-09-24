import { n as workerBootstrapOperationTimeoutMs } from "./bootstrap-DpngPG9j.mjs";
import { t as createArtifactTransferService } from "./artifact-transfer-service-BYYhL_aU.mjs";
//#region src/gateway/worker-environments/node-worker-bundle-transfer-service.ts
function createNodeWorkerBundleTransferService(options = {}) {
	const transfer = createArtifactTransferService(options);
	return {
		...transfer,
		prepare(params) {
			const { token } = transfer.prepare({
				...params,
				artifactKey: params.artifact.bundleHash,
				ttlMs: workerBootstrapOperationTimeoutMs(params.artifact)
			});
			return {
				token,
				input: {
					gatewayNamespace: params.gatewayNamespace,
					...params.bundlePrewarm ? { bundlePrewarm: params.bundlePrewarm } : {},
					build: {
						bundleHash: params.artifact.bundleHash,
						testclawVersion: params.artifact.testclawVersion,
						protocolFeatures: [...params.artifact.protocolFeatures]
					},
					archive: {
						token,
						sha256: params.artifact.tarballSha256,
						bytes: params.artifact.tarballBytes
					}
				}
			};
		},
		authorize(params) {
			return transfer.authorize({
				token: params.token,
				artifactKey: params.bundleHash
			});
		}
	};
}
//#endregion
export { createNodeWorkerBundleTransferService };
