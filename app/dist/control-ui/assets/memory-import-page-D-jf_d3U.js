import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Ac as a,Bl as o,Bs as s,Hl as c,Jl as l,Mc as u,Rs as d,Xr as f,Yr as ee,ac as p,ic as m,jc as h,zs as g}from"./control-ui-core-S9jKXqB5.js";import{$ as _,X as v,Y as y,ct as b,nt as x}from"./lit-runtime-DWoPVI38.js";import{Cr as S,Di as C,Fi as w,Fr as T,Ii as te,Oi as ne,Or as re,Qa as ie,do as ae,fo as oe}from"./control-ui-core-G2U4O6rB.js";import{c as se,u as ce}from"./gateway-runtime-BV4hxqU_.js";import{G as E,H as le,U as ue,V as de}from"./control-ui-boot-shared-C3bL_9oq.js";import{Aa as fe,At as D,Da as O,Et as k,Nt as A,Ot as j,Pt as M,Tt as N,_t as P,ht as F,wt as I,yt as L}from"./control-ui-boot-shared-CCYBAAP9.js";import{mt as R}from"./control-ui-boot-new-DhInmp9T.js";import{n as z,t as B}from"./settings-workspace-DJAhLnkQ.js";import{n as V,t as pe}from"./en-memory-import-DkYX5SSo.js";function me(e){return e.backfillRollbackPending?_`
    <testclaw-modal-dialog
      label=${i(`memoryImport.backfill.rollbackConfirmTitle`)}
      description=${i(`memoryImport.backfill.rollbackConfirmDescription`)}
      @modal-cancel=${e.onBackfillRollbackCancel}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">
              ${i(`memoryImport.backfill.rollbackConfirmTitle`)}
            </div>
            <div class="exec-approval-sub">
              ${i(`memoryImport.backfill.rollbackConfirmDescription`)}
            </div>
          </div>
        </div>
        <div class="callout warn">${i(`memoryImport.backfill.rollbackWarning`)}</div>
        <div class="exec-approval-actions">
          <button
            class="btn danger"
            data-test-id="memory-backfill-rollback-confirm"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackConfirm}
          >
            ${i(`memoryImport.backfill.rollback`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.backfillBusy!==null||e.applyingProviderId!==null}
            @click=${e.onBackfillRollbackCancel}
          >
            ${i(`common.cancel`)}
          </button>
        </div>
      </div>
    </testclaw-modal-dialog>
  `:v}function H(){return(H=e((()=>{y(),T(),l()})))()}function U(e,t){let n=e.details?.[t];return typeof n==`string`&&n.trim()?n:void 0}function he(e){let t=new Map;for(let n of e){let e=U(n,`collectionId`)??n.id,r=U(n,`collectionLabel`)??U(n,`sourceLabel`)??i(`memoryImport.unknownCollection`),a=t.get(e)??{id:e,label:r,items:[]};a.items.push(n),t.set(e,a)}return[...t.values()].toSorted((e,t)=>e.label.localeCompare(t.label))}function W(e){return e.providerId===`claude`?i(`memoryImport.claudeCode`):e.label}function ge(e){return e.providerId===`codex`?i(`memoryImport.codexDescription`):e.providerId===`claude`?i(`memoryImport.claudeDescription`):i(`memoryImport.providerFallback`)}function G(e){return i(e===1?`memoryImport.fileCountOne`:`memoryImport.fileCount`,{count:String(e)})}function _e(e){return i(e===1?`memoryImport.backfill.processedDayCountOne`:`memoryImport.backfill.processedDayCount`,{count:String(e)})}function K(e){let t=U(e,`relativePath`);if(t)return t;let n=e.target??e.source??e.id;return n.split(/[\\/]/u).at(-1)??n}function ve(e,t,n,r,a){let o=t.items.filter(e=>e.status===`planned`).map(e=>e.id),s=o.length>0&&o.every(e=>n.has(e)),c=t.items.filter(e=>e.status===`conflict`).length;return _`
    <div class="settings-row settings-row--stacked memory-import__collection">
      <div class="memory-import__collection-header">
        <label class="memory-import__collection-choice">
          <input
            type="checkbox"
            .checked=${s}
            ?disabled=${o.length===0||a}
            @change=${t=>r(e.providerId,o,t.currentTarget.checked)}
          />
          <span>
            <strong>${t.label}</strong>
            <small>${G(t.items.length)}</small>
          </span>
        </label>
        ${c>0?D({kind:`warn`,label:i(`memoryImport.alreadyImported`,{count:String(c)})}):v}
      </div>
      <details ?open=${t.items.length<=4}>
        <summary>${i(`memoryImport.reviewFiles`)}</summary>
        <ul class="memory-import__files">
          ${t.items.map(e=>_`
              <li>
                <span class="memory-import__file-icon" aria-hidden="true">${w.fileText}</span>
                <code title=${e.source??K(e)}>${K(e)}</code>
                <span class="memory-import__file-status memory-import__file-status--${e.status}">
                  ${e.status===`planned`?i(`memoryImport.ready`):e.status===`conflict`?i(`memoryImport.existing`):e.status}
                </span>
              </li>
            `)}
        </ul>
      </details>
    </div>
  `}function ye(e){if(!e)return v;let t=e.summary.errors>0||e.summary.conflicts>0,n=e.items.filter(e=>e.status===`error`||e.status===`conflict`||U(e,`recoveryRecordPath`)!==void 0);return _`
    <div
      class="settings-row settings-row--stacked memory-import__result ${t?`memory-import__result--incomplete`:``}"
      role=${t?`alert`:`status`}
    >
      <span aria-hidden="true">${t?w.alertTriangle:w.check}</span>
      <div>
        <strong>
          ${i(t?`memoryImport.importIncomplete`:`memoryImport.importComplete`)}
        </strong>
        <span>
          ${t?i(`memoryImport.importedWithIssues`,{conflicts:String(e.summary.conflicts),errors:String(e.summary.errors),migrated:String(e.summary.migrated)}):i(`memoryImport.importedCount`,{count:String(e.summary.migrated)})}
        </span>
        ${e.reportDir?_`<span class="memory-import__result-path">
                ${i(`memoryImport.reportSaved`)}:
                <code title=${e.reportDir}>${e.reportDir}</code>
              </span>`:v}
        ${n.length>0?_`<ul class="memory-import__result-issues">
                ${n.map(e=>{let t=[{label:i(`memoryImport.recoveryFile`),path:U(e,`recoveryPath`)},{label:i(`memoryImport.recoveryJournal`),path:U(e,`recoveryRecordPath`)},{label:i(`memoryImport.itemBackup`),path:U(e,`backupPath`)}].filter(e=>!!e.path);return _`<li>
                    <strong>${K(e)}</strong>
                    <span>${g(e.reason??e.message,e.status)}</span>
                    ${t.map(e=>_`<span class="memory-import__result-artifact">
                        <span>${e.label}</span>
                        <code title=${e.path}>${e.path}</code>
                      </span>`)}
                  </li>`})}
              </ul>`:v}
      </div>
    </div>
  `}function q(e,t){let n=new Set(e.selectedByProvider[t.providerId]??[]),r=he(t.items),a=e.applyingProviderId===t.providerId,o=e.backfillBusy===`apply`||e.backfillBusy===`rollback`||e.backfillRollbackPending,s=t.error?_`<div class="callout danger" role="alert">${g(t.error)}</div>`:t.found?_`
          ${t.source?k({title:i(`memoryImport.source`),control:M(t.source,{mono:!0})}):v}
          ${t.target?k({title:i(`memoryImport.destination`),control:M(`${t.target}/memory/imports/`,{mono:!0})}):v}
          ${r.map(r=>ve(t,r,n,e.onToggleCollection,e.loading||e.applyingProviderId!==null||e.error!==null||o))}
          ${k({title:n.size>0?i(`memoryImport.selectedCount`,{count:String(n.size)}):i(`memoryImport.selectAtLeastOne`),control:_`
              <button
                class="btn primary"
                data-test-id="memory-import-provider-button"
                ?disabled=${n.size===0||e.applyingProviderId!==null||o||e.loading||e.error!==null}
                @click=${()=>e.onRequestImport(t.providerId)}
              >
                ${i(a?`common.importing`:`memoryImport.importSelected`)}
              </button>
            `})}
        `:L(t.message??i(`memoryImport.noMemoryFound`));return _`
    <div data-provider-id=${t.providerId}>
      ${j({title:_`<span class="memory-import__provider-title">
            ${fe(t.providerId,{className:`memory-import__provider-icon`})}
            ${W(t)}
          </span>`,description:ge(t),actions:D({kind:t.found?`ok`:`muted`,label:t.found?G(t.items.length):i(`memoryImport.notFound`)})},_`${s}${ye(e.lastResults[t.providerId])}`)}
    </div>
  `}function be(e){let t=e.plan?.providers.find(t=>t.providerId===e.pendingProviderId);if(!t)return v;let n=e.selectedByProvider[t.providerId]?.length??0,r=i(`memoryImport.confirmTitle`,{provider:W(t)}),a=i(`memoryImport.confirmDescription`,{count:String(n)});return _`
    <testclaw-modal-dialog
      label=${r}
      description=${a}
      @modal-cancel=${()=>{e.applyingProviderId===null&&e.onCancelImport()}}
    >
      <div class="exec-approval-card memory-import__confirm">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">${r}</div>
            <div class="exec-approval-sub">${a}</div>
          </div>
        </div>
        <div class="callout ${e.replaceExisting?`warn`:``}">
          ${e.replaceExisting?i(`memoryImport.confirmReplace`):i(`memoryImport.confirmBackup`)}
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            data-test-id="memory-import-confirm"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onConfirmImport}
          >
            ${i(`memoryImport.confirmImport`)}
          </button>
          <button
            class="btn"
            ?disabled=${e.applyingProviderId!==null}
            @click=${e.onCancelImport}
          >
            ${i(`common.cancel`)}
          </button>
        </div>
      </div>
    </testclaw-modal-dialog>
  `}function xe(e){let t=e.loading||e.applyingProviderId!==null||e.backfillBusy!==null;return j({title:i(`memoryImport.title`),description:i(`memoryImport.subtitle`),actions:_`
        <button class="btn btn--sm" ?disabled=${t} @click=${e.onRefresh}>
          ${e.loading?i(`common.refreshing`):i(`common.refresh`)}
        </button>
      `},_`
      ${e.agents.length>1?k({title:i(`memoryImport.agent`),control:_`
                <testclaw-agent-select
                  class="agent-select--settings"
                  name="memory-import-agent"
                  .options=${e.agents.map(e=>({value:e.id,label:u(e),agent:e}))}
                  .value=${e.selectedAgentId??``}
                  .accessibleLabel=${i(`memoryImport.agent`)}
                  .disabled=${t}
                  .onSelect=${e.onSelectAgent}
                ></testclaw-agent-select>
              `}):v}
      ${A({title:i(`memoryImport.replaceExisting`),description:i(`memoryImport.replaceHint`),checked:e.replaceExisting,disabled:t,onChange:t=>e.onReplaceExisting(t)})}
    `)}function Se(e){let t=e.backfillBusy!==null||e.applyingProviderId!==null,n=e.backfillPreview;return _`
    <div data-test-id="memory-session-backfill">
      ${j({title:i(`memoryImport.backfill.title`),description:i(`memoryImport.backfill.subtitle`)},_`
          ${e.backfillAvailable?_`
                  ${k({title:i(`memoryImport.backfill.dateRange`),description:i(`memoryImport.backfill.dateRangeHint`),control:_`<div class="memory-import__backfill-dates">
                      <label>
                        <span>${i(`memoryImport.backfill.from`)}</span>
                        <input
                          class="input"
                          type="date"
                          .value=${e.backfillFrom}
                          ?disabled=${t}
                          @input=${t=>e.onBackfillFromChange(t.currentTarget.value)}
                        />
                      </label>
                      <label>
                        <span>${i(`memoryImport.backfill.to`)}</span>
                        <input
                          class="input"
                          type="date"
                          .value=${e.backfillTo}
                          ?disabled=${t}
                          @input=${t=>e.onBackfillToChange(t.currentTarget.value)}
                        />
                      </label>
                    </div>`})}
                  ${k({title:i(`memoryImport.backfill.actions`),control:_`<div class="memory-import__backfill-actions">
                      <button
                        class="btn"
                        data-test-id="memory-backfill-preview"
                        ?disabled=${t}
                        @click=${e.onBackfillPreview}
                      >
                        ${e.backfillBusy===`preview`?i(`memoryImport.backfill.previewing`):i(`memoryImport.backfill.preview`)}
                      </button>
                      <button
                        class="btn primary"
                        data-test-id="memory-backfill-apply"
                        ?disabled=${t}
                        @click=${e.onBackfillApply}
                      >
                        ${e.backfillBusy===`apply`?i(`memoryImport.backfill.applying`):i(`memoryImport.backfill.apply`)}
                      </button>
                      <button
                        class="btn danger"
                        data-test-id="memory-backfill-rollback"
                        ?disabled=${t}
                        @click=${e.onBackfillRollbackRequest}
                      >
                        ${i(`memoryImport.backfill.rollback`)}
                      </button>
                    </div>`})}
                  ${e.backfillError?_`<div class="callout danger" role="alert">${e.backfillError}</div>`:v}
                  ${n?_`<div
                          class="settings-row settings-row--stacked memory-import__backfill-preview"
                        >
                          <strong role="status">
                            ${i(`memoryImport.backfill.previewSummary`,{candidates:String(n.candidates),days:String(n.days)})}
                          </strong>
                          ${n.perDay.length>0?_`<ul>
                                  ${n.perDay.map(e=>_`<li>
                                      <div>
                                        <strong>${e.day}</strong>
                                        <span>
                                          ${i(`memoryImport.backfill.candidateCount`,{count:String(e.candidateCount)})}
                                        </span>
                                      </div>
                                      ${e.sample.length>0?_`<ul>
                                              ${e.sample.map(e=>_`<li>${e}</li>`)}
                                            </ul>`:v}
                                    </li>`)}
                                </ul>`:_`<span>${i(`memoryImport.backfill.noCandidates`)}</span>`}
                          ${n.truncated?_`<div class="callout warn">
                                  ${i(`memoryImport.backfill.previewTruncated`)}
                                </div>`:v}
                        </div>`:v}
                  ${e.backfillProgress?_`<div
                          class="settings-row settings-row--stacked memory-import__backfill-progress"
                          role="status"
                        >
                          <strong>
                            ${e.backfillProgress.complete?i(`memoryImport.backfill.complete`,{count:String(e.backfillProgress.staged)}):i(`memoryImport.backfill.progress`,{days:String(e.backfillProgress.days),staged:String(e.backfillProgress.staged)})}
                          </strong>
                          <span>
                            ${i(`memoryImport.backfill.processedCandidates`,{count:String(e.backfillProgress.candidates)})}
                            · ${_e(e.backfillProgress.days)}
                          </span>
                        </div>`:v}
                  ${e.backfillRollbackResult?_`<div class="settings-row settings-row--stacked" role="status">
                          <strong>${i(`memoryImport.backfill.rollbackComplete`)}</strong>
                          <span>
                            ${i(`memoryImport.backfill.rollbackCounts`,{diary:String(e.backfillRollbackResult.removedDiaryEntries),staged:String(e.backfillRollbackResult.removedStagedEntries)})}
                          </span>
                        </div>`:v}
                `:L(i(`memoryImport.backfill.unavailable`))}
        `)}
      ${me(e)}
    </div>
  `}function Ce(e){return e.connected?e.canAdmin?_`
    <div class="memory-import" data-test-id="memory-import-page">
      ${I(_`
        ${xe(e)} ${Se(e)}
        ${e.error?_`<div class="callout danger" role="alert">${e.error}</div>`:v}
        ${e.applyError?_`<div class="callout danger" role="alert">${e.applyError}</div>`:v}
        ${e.loading&&!e.plan?_`<div class="settings-group memory-import__loading" aria-busy="true">
                <div class="skeleton memory-import__skeleton"></div>
                <div class="skeleton memory-import__skeleton"></div>
              </div>`:(e.plan?.providers??[]).map(t=>q(e,t))}
        ${be(e)}
      `)}
    </div>
  `:I(L(i(`memoryImport.adminRequired`))):I(L(i(`memoryImport.disconnected`)))}function J(){return(J=e((()=>{y(),R(),T(),te(),O(),F(),l(),pe(),a(),s(),H(),V()})))()}function Y(e){return d(e,`request failed`)}var X,Z,Q;function $(){return($=e((()=>{t(),de(),y(),x(),ie(),ne(),re(),F(),B(),a(),s(),se(),f(),c(),p(),J(),X=14,Z=`https://docs.testclaw.ai/install/migrating`,Q=class extends o{constructor(...e){super(...e),this.replaceExisting=!1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=null,this.applyError=null,this.lastResults={},this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1,this.applyEpoch=0,this.backfillEpoch=0,this.lastPlanValue=null,this.subscriptions=new m(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t)),this.planTask=new le(this,{args:()=>{let e=this.context?.gateway.snapshot;return[this.isConnected&&e?.phase===`connected`?e.client??null:null,e?S(e.hello?.auth??null):!1,this.currentAgentId(),this.replaceExisting]},task:async([e,t,n,r],{signal:i})=>!e||!t||!n?ue:{client:e,agentId:n,overwrite:r,plan:await e.request(`migrations.memory.plan`,{agentId:n,overwrite:r},{signal:i})},onComplete:e=>{let t=this.lastPlanValue;t&&(t.client!==e.client||t.agentId!==e.agentId||t.overwrite!==e.overwrite)&&(this.resetMutationState({preserveAttemptedImport:t.client!==e.client}),(t.client!==e.client||t.agentId!==e.agentId)&&this.resetBackfillState()),this.lastPlanValue=e;let{plan:n}=e;this.selectedByProvider=Object.fromEntries(n.providers.map(e=>[e.providerId,e.items.filter(e=>e.status===`planned`).map(e=>e.id)]))}})}disconnectedCallback(){this.planTask.run([null,!1,null,this.replaceExisting]),this.applyEpoch+=1,this.backfillEpoch+=1,this.subscriptions.clear(),super.disconnectedCallback()}updated(){let e=this.context.gateway.snapshot;this.pendingImport&&(e.phase!==`connected`||e.client!==(this.planTask.value??this.lastPlanValue)?.client||this.currentAgentId()!==this.pendingImport.agentId)&&this.resetMutationState({preserveAttemptedImport:!0}),e.phase!==`connected`&&(this.backfillBusy!==null||this.backfillRollbackPending)&&this.resetBackfillState()}currentAgentId(){let e=this.context.agents.state.agentsList;if(!e)return null;let t=h(e.agents),n=this.context.agentSelection.state.selectedId;return n&&t.some(e=>e.id===n)?n:t.some(t=>t.id===e.defaultId)?e.defaultId:t[0]?.id??null}get plan(){let e=this.planTask.value??this.lastPlanValue,t=this.context.gateway.snapshot,n=this.currentAgentId();return e&&t.phase===`connected`&&e.client===t.client&&e.agentId===n&&e.overwrite===this.replaceExisting?e.plan:null}get loading(){return this.planTask.status===E.PENDING}get error(){return this.planTask.status===E.ERROR?Y(this.planTask.error):null}get canAdmin(){return S(this.context.gateway.snapshot.hello?.auth??null)}resetMutationState(e={}){let t=e.preserveAttemptedImport&&this.pendingImport?.attempted?this.pendingImport:null;this.applyEpoch+=1,this.selectedByProvider={},this.applyingProviderId=null,this.pendingImport=t,this.applyError=null,this.lastResults={}}refresh(){return this.currentAgentId()?this.planTask.run():this.context.agents.ensureList().then(()=>void 0)}selectAgent(e){this.context.agentSelection.set(e),this.resetMutationState(),this.resetBackfillState()}setReplaceExisting(e){this.replaceExisting=e,this.resetMutationState()}toggleCollection(e,t,n){let r=new Set(this.selectedByProvider[e]??[]);for(let e of t)n?r.add(e):r.delete(e);this.selectedByProvider={...this.selectedByProvider,[e]:[...r]}}requestImport(e){if(!this.canAdmin)return;let t=this.currentAgentId(),n=this.plan?.providers.find(t=>t.providerId===e)?.planFingerprint,r=this.selectedByProvider[e]??[];!this.loading&&this.error===null&&this.applyingProviderId===null&&this.backfillBusy!==`apply`&&this.backfillBusy!==`rollback`&&!this.backfillRollbackPending&&t&&this.plan?.agentId===t&&n&&r.length!==0&&(this.applyError=null,this.pendingImport={providerId:e,agentId:t,planFingerprint:n,itemIds:[...r],overwrite:this.replaceExisting,idempotencyKey:ee(),attempted:!1})}async confirmImport(){if(!this.canAdmin||this.applyingProviderId!==null||this.backfillBusy===`apply`||this.backfillBusy===`rollback`||this.backfillRollbackPending)return;let e=this.pendingImport,t=this.context.gateway.snapshot;if(!e||!t.client||this.currentAgentId()!==e.agentId||this.plan?.agentId!==e.agentId)return;let n={...e,attempted:!0},r=t.client;this.pendingImport=n;let i=++this.applyEpoch;this.applyingProviderId=n.providerId,this.applyError=null;try{let e=await r.request(`migrations.memory.apply`,{idempotencyKey:n.idempotencyKey,agentId:n.agentId,providerId:n.providerId,planFingerprint:n.planFingerprint,itemIds:n.itemIds,overwrite:n.overwrite});if(i!==this.applyEpoch||this.context.gateway.snapshot.phase!==`connected`||this.context.gateway.snapshot.client!==r||this.currentAgentId()!==n.agentId)return;this.lastResults={...this.lastResults,[n.providerId]:e},this.pendingImport=null,await this.refresh()}catch(e){i===this.applyEpoch&&(this.applyError=Y(e))}finally{i===this.applyEpoch&&(this.applyingProviderId=null)}}resetBackfillState(){this.backfillEpoch+=1,this.backfillFrom=``,this.backfillTo=``,this.backfillBusy=null,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillRollbackPending=!1}backfillRequest(e){return{agentId:e,...this.backfillFrom?{from:this.backfillFrom}:{},...this.backfillTo?{to:this.backfillTo}:{},limitDays:X}}isCurrentBackfillRequest(e,t,n){return e===this.backfillEpoch&&this.context.gateway.snapshot.phase===`connected`&&this.context.gateway.snapshot.client===t&&this.currentAgentId()===n}async previewBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`preview`,this.backfillError=null,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null;try{let r=await e.request(`memory.sessionBackfill.preview`,this.backfillRequest(t));this.isCurrentBackfillRequest(n,e,t)&&(this.backfillPreview=r)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async applyBackfill(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null)return;let n=++this.backfillEpoch;this.backfillBusy=`apply`,this.backfillError=null,this.backfillPreview=null,this.backfillRollbackResult=null,this.backfillProgress={days:0,candidates:0,staged:0,complete:!1};let r=this.backfillProgress,i=new Set;try{for(;;){let a=await e.request(`memory.sessionBackfill.apply`,this.backfillRequest(t));if(!this.isCurrentBackfillRequest(n,e,t))return;if(a.candidates>0&&a.cursor?.advanced!==!0)throw Error(`Session backfill stopped because the server cursor did not advance.`);if(a.candidates===0&&a.cursor?.exhausted!==!0)throw Error(`Session backfill stopped because the server cursor was not exhausted.`);for(let e of a.perDay)i.add(e.day);if(r={days:i.size,candidates:r.candidates+a.candidates,staged:r.staged+a.staged,complete:a.candidates===0},this.backfillProgress=r,a.candidates===0)break}}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}async confirmBackfillRollback(){let e=this.context.gateway.snapshot.client,t=this.currentAgentId();if(!this.canAdmin||!e||!t||this.backfillBusy!==null||this.applyingProviderId!==null||!this.backfillRollbackPending)return;let n=++this.backfillEpoch;this.backfillBusy=`rollback`,this.backfillError=null;try{let r=await e.request(`memory.sessionBackfill.rollback`,{agentId:t});this.isCurrentBackfillRequest(n,e,t)&&(this.backfillRollbackResult=r,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackPending=!1)}catch(r){this.isCurrentBackfillRequest(n,e,t)&&(this.backfillError=Y(r))}finally{this.isCurrentBackfillRequest(n,e,t)&&(this.backfillBusy=null)}}render(){let e=this.context.gateway.snapshot,t=this.context.agents.state.agentsList,n=this.currentAgentId(),r=Ce({connected:e.phase===`connected`,canAdmin:this.canAdmin,agents:h(t?.agents??[]),selectedAgentId:n,plan:this.plan,loading:this.loading||this.context.agents.state.agentsLoading,error:(n?null:this.context.agents.state.agentsError)??this.error,applyError:this.applyError,replaceExisting:this.replaceExisting,selectedByProvider:this.selectedByProvider,applyingProviderId:this.applyingProviderId,pendingProviderId:this.pendingImport?.agentId===n?this.pendingImport.providerId:null,lastResults:this.lastResults,backfillAvailable:ce(e,`memory.sessionBackfill.preview`)!==!1,backfillFrom:this.backfillFrom,backfillTo:this.backfillTo,backfillBusy:this.backfillBusy,backfillError:this.backfillError,backfillPreview:this.backfillPreview,backfillProgress:this.backfillProgress,backfillRollbackResult:this.backfillRollbackResult,backfillRollbackPending:this.backfillRollbackPending,onSelectAgent:e=>this.selectAgent(e),onReplaceExisting:e=>this.setReplaceExisting(e),onRefresh:()=>void this.refresh(),onToggleCollection:(e,t,n)=>this.toggleCollection(e,t,n),onRequestImport:e=>this.requestImport(e),onConfirmImport:()=>void this.confirmImport(),onCancelImport:()=>{this.applyingProviderId===null&&(this.pendingImport=null,this.applyError=null)},onBackfillFromChange:e=>{this.backfillFrom=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillToChange:e=>{this.backfillTo=e,this.backfillPreview=null,this.backfillProgress=null,this.backfillRollbackResult=null,this.backfillError=null},onBackfillPreview:()=>void this.previewBackfill(),onBackfillApply:()=>void this.applyBackfill(),onBackfillRollbackRequest:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!0,this.backfillError=null)},onBackfillRollbackConfirm:()=>void this.confirmBackfillRollback(),onBackfillRollbackCancel:()=>{this.backfillBusy===null&&(this.backfillRollbackPending=!1)}});return _`
      ${N({title:oe(`memory-import`),subtitle:_`${ae(`memory-import`)}
        ${P(Z)}`})}
      ${z(r)}
    `}},r([n({context:C,subscribe:!0})],Q.prototype,`context`,void 0),r([b()],Q.prototype,`replaceExisting`,void 0),r([b()],Q.prototype,`selectedByProvider`,void 0),r([b()],Q.prototype,`applyingProviderId`,void 0),r([b()],Q.prototype,`pendingImport`,void 0),r([b()],Q.prototype,`applyError`,void 0),r([b()],Q.prototype,`lastResults`,void 0),r([b()],Q.prototype,`backfillFrom`,void 0),r([b()],Q.prototype,`backfillTo`,void 0),r([b()],Q.prototype,`backfillBusy`,void 0),r([b()],Q.prototype,`backfillError`,void 0),r([b()],Q.prototype,`backfillPreview`,void 0),r([b()],Q.prototype,`backfillProgress`,void 0),r([b()],Q.prototype,`backfillRollbackResult`,void 0),r([b()],Q.prototype,`backfillRollbackPending`,void 0),customElements.get(`testclaw-memory-import-page`)||customElements.define(`testclaw-memory-import-page`,Q)})))()}$();
//# sourceMappingURL=memory-import-page-D-jf_d3U.js.map