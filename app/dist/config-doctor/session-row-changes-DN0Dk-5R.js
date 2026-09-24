import { r as resolveGlobalSet } from "./global-singleton-DmdlcXls.js";
import { i as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-Cresg45I.js";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.js";
//#region src/sessions/session-row-changes.ts
const listeners = resolveGlobalSet(Symbol.for("testclaw.sessionRowChanges"), "close-and-restart");
const factListeners = resolveGlobalSet(Symbol.for("testclaw.sessionRowFactChanges"), "close-and-restart");
const projectionListeners = resolveGlobalSet(Symbol.for("testclaw.sessionRowProjectionChanges"), "close-and-restart");
const sessionChanges = {
	subscribe(listener) {
		return registerListener(listeners, listener);
	},
	/** Install prepared facts only; live-row observers run after every commit callback. */
	subscribeFacts(listener) {
		return registerListener(factListeners, listener);
	},
	/** Refresh resident rows after all committed facts, before public observers can broadcast. */
	subscribeProjection(listener) {
		return registerListener(projectionListeners, listener);
	},
	/** SQLite observers run only after all committed owner state has settled. */
	emit(change, database) {
		sessionChanges.emitBatch([change], database);
	},
	emitBatch(changes, database) {
		const publishFacts = () => {
			for (const change of changes) notifyListeners(factListeners, change);
		};
		const prepareObservers = () => {
			for (const change of changes) notifyListeners(projectionListeners, change);
		};
		if (!database || !stageSqliteTransactionState(database, {
			stage: () => {},
			rollback: () => {},
			commit: publishFacts,
			prepareObservers
		})) {
			publishFacts();
			prepareObservers();
		}
		const publish = () => {
			for (const change of changes) if ("sessionKey" in change) {
				const { facts: _facts, factsInvalidated: _invalidated, ...notification } = change;
				notifyListeners(listeners, notification);
			} else {
				const { factsInvalidated: _invalidated, ...notification } = change;
				notifyListeners(listeners, notification);
			}
		};
		if (!database || !deferSqlitePostCommitPublication(database, publish)) publish();
	}
};
//#endregion
export { sessionChanges as t };
