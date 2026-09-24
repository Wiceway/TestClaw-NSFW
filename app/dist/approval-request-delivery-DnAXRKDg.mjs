import { c as trackAsyncWork } from "./async-work-scope-B8vgCYcj.mjs";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-C2LdSyZM.mjs";
import { T as runWithRetainedGatewayRootWork } from "./gateway-work-admission-DeFm4gyw.mjs";
import { n as isApprovalRecordVisibleToClient } from "./approval-record-lookup-BL6mBsV5.mjs";
import "./approval-shared-Dc0-_f5O.mjs";
//#region src/gateway/server-methods/approval-request-delivery.ts
function trackApprovalDelivery(run) {
	return trackAsyncWork(() => runWithRetainedGatewayRootWork(run));
}
function resolveFirstSuccessfulApprovalDelivery(deliveryTasks) {
	return new Promise((resolve) => {
		let remaining = deliveryTasks.length;
		for (const delivery of deliveryTasks) delivery.then((delivered) => {
			if (delivered) {
				resolve(true);
				return;
			}
			remaining -= 1;
			if (remaining === 0) resolve(false);
		});
	});
}
/** Runs external approval deliveries concurrently and reports whether any route accepted. */
function runApprovalRequestDeliveries(params) {
	const isTargetVisible = (target) => isApprovalRecordVisibleToClient({
		record: params.record,
		client: { connect: {
			client: { id: GATEWAY_CLIENT_IDS.IOS_APP },
			device: { id: target.deviceId },
			scopes: [...target.scopes]
		} }
	});
	const deliveryTasks = [params.forward, params.iosPush].flatMap((delivery) => {
		if (!delivery) return [];
		const [run, errorLabel] = delivery;
		return [trackApprovalDelivery(() => run(isTargetVisible)).catch((err) => {
			params.context.logGateway?.error?.(`${errorLabel}: ${String(err)}`);
			return false;
		})];
	});
	try {
		const webPushDelivery = params.context.approvalWebPushDelivery?.handleRequested(params.record);
		if (webPushDelivery !== false && webPushDelivery !== void 0) deliveryTasks.push(trackApprovalDelivery(() => Promise.resolve(webPushDelivery)).catch((err) => {
			params.context.logGateway?.error?.(`approval Web Push request failed: ${String(err)}`);
			return false;
		}));
	} catch (err) {
		params.context.logGateway?.error?.(`approval Web Push request failed: ${String(err)}`);
	}
	if (deliveryTasks.length === 0) return false;
	return resolveFirstSuccessfulApprovalDelivery(deliveryTasks);
}
//#endregion
export { runApprovalRequestDeliveries as t };
