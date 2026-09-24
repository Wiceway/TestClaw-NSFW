import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Bs as o,Hl as s,Jl as c,Rs as l,Zl as u,ac as d,ic as f}from"./control-ui-core-S9jKXqB5.js";import{$ as p,X as m,Y as h,ct as g,nt as _}from"./lit-runtime-DWoPVI38.js";import{Di as v,Oi as y,Or as b,Qa as x,fo as S,gt as C,ht as w,kr as T}from"./control-ui-core-G2U4O6rB.js";import{Y as E,q as D}from"./control-ui-boot-shared-8dYR6CXG.js";import{St as O,Tt as k,_t as A,bt as j,ht as M,wt as N}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as P,t as F}from"./settings-workspace-DJAhLnkQ.js";function I(e,t){if(e.revokedAtMs!==null)return i(`standingGrants.stateRevoked`);if(e.expiresAtMs!==null&&e.expiresAtMs<=t)return i(`standingGrants.stateExpired`);if(e.expiresAtMs!==null){let n=Math.max(1,Math.ceil((e.expiresAtMs-t)/864e5));return i(`standingGrants.stateExpiresIn`,{count:String(n)})}return i(`standingGrants.stateUntilRevoked`)}function L(e,t){return e.revokedAtMs===null&&(e.expiresAtMs===null||e.expiresAtMs>t)}function R(e){return new Intl.DateTimeFormat(u.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(e))}function z(e){switch(e){case`exec`:return i(`approvalHistory.kinds.exec`);case`plugin`:return i(`approvalHistory.kinds.plugin`);case`system-agent`:return i(`approvalHistory.kinds.systemAgent`)}return e}function B(e){switch(e){case`allowed`:return i(`approvalHistory.statuses.allowed`);case`denied`:return i(`approvalHistory.statuses.denied`);case`expired`:return i(`approvalHistory.statuses.expired`);case`cancelled`:return i(`approvalHistory.statuses.cancelled`)}return e}function V(e){switch(e){case`allow-once`:return i(`approvalHistory.decisions.allowOnce`);case`allow-always`:return i(`approvalHistory.decisions.allowAlways`);case`deny`:return i(`approvalHistory.decisions.deny`);case void 0:return i(`approvalHistory.notApplicable`)}return e}function H(e){switch(e){case`user`:return i(`approvalHistory.reasons.user`);case`timeout`:return i(`approvalHistory.reasons.timeout`);case`malformed-verdict`:return i(`approvalHistory.reasons.malformedVerdict`);case`no-route`:return i(`approvalHistory.reasons.noRoute`);case`run-aborted`:return i(`approvalHistory.reasons.runAborted`);case`gateway-restart`:return i(`approvalHistory.reasons.gatewayRestart`);case`storage-corrupt`:return i(`approvalHistory.reasons.storageCorrupt`)}return e}function U(e){let t=e.presentation;return(t.kind===`exec`?t.commandText:t.title)||i(`approvalHistory.unknown`)}function W(e){let t=[e.source?.agentId,e.source?.sessionKey].filter(e=>!!e);return t.length>0?t.join(` · `):i(`approvalHistory.unknown`)}function G(e){return e.resolver?e.resolver.id?`${e.resolver.kind} · ${e.resolver.id}`:e.resolver.kind:i(`approvalHistory.unknown`)}var K,q,J,Y;function X(){return(X=e((()=>{t(),h(),_(),D(),x(),y(),w(),b(),M(),F(),c(),o(),s(),d(),K=50,q=`operator.approvals`,J=`https://docs.testclaw.ai/tools/exec-approvals`,Y=class extends a{constructor(...e){super(...e),this.items=[],this.grants=[],this.grantsError=null,this.revokingGrantId=null,this.nextCursor=null,this.loading=!1,this.loadingMore=!1,this.error=null,this.connected=!1,this.approvalsAccess=!0,this.client=null,this.gatewaySource=null,this.requestGeneration=0,this.hasLoaded=!1,this.historyRefreshPending=!1,this.subscriptions=new f(this).effect(()=>this.context?.gateway,e=>{this.gatewaySource!==e&&this.resetHistory(!0),this.gatewaySource=e,this.applyGatewaySnapshot(e.snapshot);let t=e.subscribe(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.applyGatewaySnapshot(t)}),n=e.subscribeEvents(t=>{this.gatewaySource===e&&this.context.gateway===e&&this.approvalsAccess&&T(e.snapshot).canReviewApprovals&&C(t.event,t.payload)&&(this.historyRefreshPending=!0,!this.loading&&!this.loadingMore&&this.loadPage(!0))});return()=>{t(),n()}})}disconnectedCallback(){this.subscriptions.clear(),this.resetHistory(!1),this.gatewaySource=null,super.disconnectedCallback()}resetHistory(e){this.requestGeneration+=1,this.loading=!1,this.loadingMore=!1,this.historyRefreshPending=!1,e&&(this.hasLoaded=!1,this.items=[],this.nextCursor=null,this.error=null)}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`!==this.connected,r=T(e).canReviewApprovals,i=r!==this.approvalsAccess;this.connected=e.phase===`connected`,this.approvalsAccess=r,t||i?(this.client=e.client,this.resetHistory(!0)):n&&(this.resetHistory(!1),e.phase===`connected`&&(this.hasLoaded=!1)),e.phase===`connected`&&e.client&&this.approvalsAccess&&!this.hasLoaded&&!this.loading&&this.loadPage(!0)}async loadPage(e){let t=this.client,n=this.gatewaySource;if(!t||!n||!this.connected||!this.approvalsAccess||!T(n.snapshot).canReviewApprovals||this.loading||this.loadingMore)return;let r=this.requestGeneration,a=e?void 0:this.nextCursor??void 0;if(!e&&!a)return;e?(this.historyRefreshPending=!1,this.loading=!0):this.loadingMore=!0,this.error=null;let o=()=>this.isConnected&&this.connected&&this.approvalsAccess&&this.gatewaySource===n&&this.context.gateway===n&&n.snapshot.phase===`connected`&&T(n.snapshot).canReviewApprovals&&this.client===t&&this.requestGeneration===r;try{let n=await t.request(`approval.history`,{...a?{cursor:a}:{},limit:K});if(!E(n))throw Error(i(`approvalHistory.invalidResponse`));if(!o())return;this.items=e?n.items:[...this.items,...n.items],this.nextCursor=n.nextCursor??null,this.hasLoaded=!0,e&&this.loadGrants(t,o)}catch(e){o()&&(this.error=l(e),this.hasLoaded=!0)}finally{o()&&(this.loading=!1,this.loadingMore=!1,this.historyRefreshPending&&this.loadPage(!0))}}async loadGrants(e,t){try{let n=await e.request(`exec.approval.grants.list`,{});if(!t())return;this.grants=Array.isArray(n.grants)?n.grants:[],this.grantsError=null}catch(e){t()&&(this.grantsError=l(e))}}async revokeGrant(e){let t=this.client;if(t&&this.revokingGrantId===null){this.revokingGrantId=e;try{await t.request(`exec.approval.grants.revoke`,{grantId:e});let n=Date.now();this.grants=this.grants.map(t=>t.grantId===e?{...t,revokedAtMs:n}:t),this.grantsError=null}catch(e){this.grantsError=l(e)}finally{this.revokingGrantId=null}}}renderGrants(){let e=Date.now();return p`
      <h2 id="standing-grants-title" class="settings-section-title">
        ${i(`standingGrants.title`)}
      </h2>
      <p class="settings-section-subtitle">${i(`standingGrants.description`)}</p>
      ${this.grantsError?p`<div class="callout danger" role="alert">${this.grantsError}</div>`:m}
      <div class="data-table-container">
        <table
          class="data-table standing-grants-table settings-table--stacked"
          role="table"
          aria-labelledby="standing-grants-title"
        >
          <thead>
            <tr>
              <th scope="col">${i(`standingGrants.columns.automation`)}</th>
              <th scope="col">${i(`standingGrants.columns.command`)}</th>
              <th scope="col">${i(`standingGrants.columns.uses`)}</th>
              <th scope="col">${i(`standingGrants.columns.state`)}</th>
              <th scope="col"><span class="sr-only">${i(`standingGrants.revoke`)}</span></th>
            </tr>
          </thead>
          <tbody>
            ${this.grants.length===0?p`
                    <tr>
                      <td colspan="5" class="data-table-empty-cell">
                        <div class="data-table-empty-state" role="status" aria-live="polite">
                          ${i(`standingGrants.empty`)}
                        </div>
                      </td>
                    </tr>
                  `:this.grants.map(t=>p`
                      <tr>
                        <td data-label=${i(`standingGrants.columns.automation`)}>
                          ${t.cronJobName??t.cronJobId}
                        </td>
                        <td class="mono" data-label=${i(`standingGrants.columns.command`)}>
                          ${t.command}
                        </td>
                        <td data-label=${i(`standingGrants.columns.uses`)}>${t.useCount}</td>
                        <td data-label=${i(`standingGrants.columns.state`)} aria-live="polite">
                          ${I(t,e)}
                        </td>
                        <td>
                          ${L(t,e)?p`
                                  <button
                                    class="btn btn--sm"
                                    aria-label=${`${this.revokingGrantId===t.grantId?i(`standingGrants.revoking`):i(`standingGrants.revoke`)}: ${t.cronJobName??t.cronJobId} — ${t.command}`}
                                    ?disabled=${this.revokingGrantId!==null}
                                    @click=${()=>void this.revokeGrant(t.grantId)}
                                  >
                                    ${this.revokingGrantId===t.grantId?i(`standingGrants.revoking`):i(`standingGrants.revoke`)}
                                  </button>
                                `:m}
                        </td>
                      </tr>
                    `)}
          </tbody>
        </table>
      </div>
    `}renderTable(){return this.loading&&this.items.length===0?j(O({label:i(`approvalHistory.loading`)})):p`
      <div class="data-table-container">
        <table
          class="data-table approval-history-table settings-table--stacked"
          role="table"
          aria-labelledby="approval-history-title"
          aria-busy=${this.loading||this.loadingMore?`true`:`false`}
        >
          <thead>
            <tr>
              <th scope="col">${i(`approvalHistory.columns.resolved`)}</th>
              <th scope="col">${i(`approvalHistory.columns.kind`)}</th>
              <th scope="col">${i(`approvalHistory.columns.request`)}</th>
              <th scope="col">${i(`approvalHistory.columns.decision`)}</th>
              <th scope="col">${i(`approvalHistory.columns.reason`)}</th>
              <th scope="col">${i(`approvalHistory.columns.source`)}</th>
              <th scope="col">${i(`approvalHistory.columns.resolver`)}</th>
            </tr>
          </thead>
          <tbody>
            ${this.items.length===0?p`
                    <tr>
                      <td colspan="7" class="data-table-empty-cell">
                        <div class="data-table-empty-state" role="status" aria-live="polite">
                          ${this.error||!this.hasLoaded?i(`approvalHistory.unknown`):i(`approvalHistory.empty`)}
                        </div>
                      </td>
                    </tr>
                  `:this.items.map(e=>p`
                      <tr>
                        <td data-label=${i(`approvalHistory.columns.resolved`)}>
                          ${R(e.resolvedAtMs)}
                        </td>
                        <td data-label=${i(`approvalHistory.columns.kind`)}>
                          ${z(e.presentation.kind)}
                        </td>
                        <td class="mono" data-label=${i(`approvalHistory.columns.request`)}>
                          ${U(e)}
                        </td>
                        <td data-label=${i(`approvalHistory.columns.decision`)}>
                          ${B(e.status)} ·
                          ${V(`decision`in e?e.decision:void 0)}
                        </td>
                        <td data-label=${i(`approvalHistory.columns.reason`)}>
                          ${H(e.reason)}
                        </td>
                        <td class="mono" data-label=${i(`approvalHistory.columns.source`)}>
                          ${W(e)}
                        </td>
                        <td class="mono" data-label=${i(`approvalHistory.columns.resolver`)}>
                          ${G(e)}
                        </td>
                      </tr>
                    `)}
          </tbody>
        </table>
      </div>
      <div class="data-table-pagination">
        <div class="data-table-pagination__info">${i(`approvalHistory.retention`)}</div>
        <div class="data-table-pagination__controls">
          ${this.nextCursor?p`
                  <button ?disabled=${this.loadingMore} @click=${()=>void this.loadPage(!1)}>
                    ${this.loadingMore?i(`approvalHistory.loadingMore`):i(`approvalHistory.loadMore`)}
                  </button>
                `:m}
        </div>
      </div>
    `}render(){let e=N(p`
        ${this.connected?m:p`<div class="callout warn" role="status">${i(`approvalHistory.offline`)}</div>`}
        ${this.connected&&!this.approvalsAccess?p`
                <div class="callout warn" role="status">
                  ${i(`common.disabled`)} · <code>${q}</code>
                </div>
              `:m}
        ${this.approvalsAccess&&this.error?p`
                <div class="callout danger" role="alert">
                  ${this.error}
                  <button class="btn btn--sm" @click=${()=>void this.loadPage(!0)}>
                    ${i(`common.retry`)}
                  </button>
                </div>
              `:m}
        ${this.approvalsAccess?this.renderGrants():m}
        ${this.approvalsAccess?p`<h2 id="approval-history-title" class="settings-section-title">
                ${i(`standingGrants.historyTitle`)}
              </h2>`:m}
        ${this.approvalsAccess?this.renderTable():m}
      `,{wide:!0});return p`
      ${k({title:S(`approvals`),subtitle:p`${i(`approvalHistory.description`)}
        ${A(J)}`})}
      ${P(e)}
    `}},r([n({context:v,subscribe:!0})],Y.prototype,`context`,void 0),r([g()],Y.prototype,`items`,void 0),r([g()],Y.prototype,`grants`,void 0),r([g()],Y.prototype,`grantsError`,void 0),r([g()],Y.prototype,`revokingGrantId`,void 0),r([g()],Y.prototype,`nextCursor`,void 0),r([g()],Y.prototype,`loading`,void 0),r([g()],Y.prototype,`loadingMore`,void 0),r([g()],Y.prototype,`error`,void 0),r([g()],Y.prototype,`connected`,void 0),r([g()],Y.prototype,`approvalsAccess`,void 0),customElements.get(`testclaw-approvals-page`)||customElements.define(`testclaw-approvals-page`,Y)})))()}X();
//# sourceMappingURL=approvals-page-DRTymqwH.js.map