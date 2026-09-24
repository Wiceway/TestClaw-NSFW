import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Bs as o,Hl as s,Jl as c,Nr as l,Qc as u,Rs as d,_c as f,_n as ee,ac as te,dc as ne,dl as re,fc as p,fn as ie,gc as m,hc as h,ic as g,mc as _,nr as v,rn as ae,rr as oe,sl as se,vi as ce,zs as y}from"./control-ui-core-S9jKXqB5.js";import{$ as b,X as x,Y as S,c as le,ct as C,nt as ue,s as de}from"./lit-runtime-DWoPVI38.js";import{Di as fe,Dr as pe,Er as me,Oi as w,Or as T,Qa as E,Xn as D,Yn as O,do as k,fo as A}from"./control-ui-core-G2U4O6rB.js";import{Bt as j,Ht as M,Jt as N,Kt as P,Vl as F,Wt as I,Xt as L,Yt as R,Zt as z,an as he,en as ge,go as _e,ho as ve,in as ye,on as B,qt as be,rn as xe}from"./control-ui-boot-shared-ooxiG3qa.js";import{G as V,H as Se,U as Ce,V as we}from"./control-ui-boot-shared-C3bL_9oq.js";import{At as Te,Ot as Ee,Tt as De,ht as H,wt as Oe,yt as U}from"./control-ui-boot-shared-CCYBAAP9.js";import{c as ke,cn as Ae,on as je,s as Me,sn as Ne}from"./control-ui-boot-shared-D2o30asO.js";import"./control-ui-boot-shared-VDjYq2Zh.js";import{n as Pe,t as Fe}from"./settings-workspace-DJAhLnkQ.js";import{n as Ie,t as Le}from"./agent-row-chip-LzqZKgRH.js";import{n as Re,t as ze}from"./agent-scope-control-DE_nXHBu.js";function Be(e,t){let n=e.childSessionKey??e.sessionKey;if(!n)return x;let r=t.sessionRow(n),a=f({face:h(r),sessionKey:n,fallbackAgentId:t.agentId,basePath:t.basePath,mainKey:t.mainKey,row:r,preferenceDerivedFace:!0}).href;return b`<a
    class="session-link"
    href=${a}
    @click=${e=>{ce(e)&&(e.preventDefault(),t.onNavigateToChat(n))}}
    >${i(`tasksPage.openSession`)}</a
  >`}function Ve(e,t,n){let r=e.status===`queued`||e.status===`running`,a=he(e.updatedAt??e.createdAt),o=ge(e),s=B(e),c=t.cancellingTaskIds.has(e.id),l=e.terminalOutcome===`blocked`,u=l&&e.deliveryStatus===`failed`,d=l&&e.deliveryStatus===`dismissed`,f=r&&t.canCancel||l&&t.canCopy||u&&t.canCancel;return b`
    <div class="settings-row task-row" data-task-id=${e.id}>
      <div class="settings-row__text task-row__content">
        <div class="settings-row__title">${s}</div>
        <div class="task-row__facts">
          <span data-task-status
            >${Te({kind:He(e.status),label:ye(e.status)})}</span
          >
          <span>${xe(e)}</span>
          ${e.agentId?Ie(e.agentId):x}
        </div>
        ${o?b`<div class="settings-row__desc">${o}</div>`:x}
        ${l?b`<div class="task-row__warning">
                <span
                  >${i(d?`tasksPage.deliveryDismissed`:`tasksPage.deliveryBlocked`)}</span
                >
                ${u?b`<span class="muted">${i(`tasksPage.duplicateRisk`)}</span>`:x}
              </div>`:x}
      </div>
      <div class="settings-row__control task-row__control">
        <div class="task-row__links">
          ${a>0?b`<span title=${n(a)}
                  >${ie(a)}</span
                >`:b`<span>${i(`common.na`)}</span>`}
          ${e.hasTranscript&&t.canCopy?b`<button
                  class="btn btn--sm"
                  type="button"
                  ?disabled=${!t.connected}
                  @click=${n=>{n.currentTarget instanceof HTMLButtonElement&&t.onViewTranscript(e.id,n.currentTarget)}}
                >
                  ${i(`tasksPage.viewTranscript`)}
                </button>`:x}
          ${Be(e,t)}
        </div>
        ${f?b`<div class="task-row__actions">
                ${r&&t.canCancel?b`<button
                        class="btn btn--sm"
                        type="button"
                        aria-label=${i(`tasksPage.cancelTask`,{title:s})}
                        ?disabled=${c||!t.connected}
                        @click=${()=>t.onCancel(e.taskId)}
                      >
                        ${i(c?`tasksPage.cancelling`:`common.cancel`)}
                      </button>`:x}
                ${l&&t.canCopy?b`<button
                        class="btn btn--sm"
                        type="button"
                        ?disabled=${c||!t.connected}
                        @click=${()=>t.onCopyResult(e.taskId)}
                      >
                        ${i(`tasksPage.copyResult`)}
                      </button>`:x}
                ${u&&t.canCancel?b`
                        <button
                          class="btn btn--sm"
                          type="button"
                          ?disabled=${c||!t.connected}
                          @click=${()=>t.onRetry(e.taskId)}
                        >
                          ${i(`tasksPage.retryDelivery`)}
                        </button>
                        <button
                          class="btn btn--sm"
                          type="button"
                          ?disabled=${c||!t.connected}
                          @click=${()=>t.onDismiss(e.taskId)}
                        >
                          ${i(`tasksPage.dismissDelivery`)}
                        </button>
                      `:x}
              </div>`:x}
      </div>
    </div>
  `}function He(e){switch(e){case`completed`:return`ok`;case`failed`:case`timed_out`:return`danger`;case`queued`:case`running`:return`warn`;case`cancelled`:return`muted`}return e}function W(e,...t){return e.filter(e=>t.includes(e.status)).length}function G(e,t){let n=e===`active`?[[W(t,`running`),i(`tasksPage.status.running`)],[W(t,`queued`),i(`tasksPage.status.queued`)]]:[[W(t,`completed`),i(`tasksPage.status.completed`)],[W(t,`failed`,`timed_out`),i(`tasksPage.status.failed`)]];return b`<span class="task-heading-facts">
    ${n.map(([e,t],n)=>b`
        ${n>0?b`<span aria-hidden="true">·</span>`:x}
        <span><strong>${e}</strong> ${t}</span>
      `)}
  </span>`}function K(e,t,n,r,i,a){let o=n.length===0?U(r):le(n,e=>e.id,e=>Ve(e,i,a));return b`<div data-task-section=${e}>
    ${Ee({title:b`${t}${G(e,n)}`},o)}
  </div>`}function Ue(e){let t=ae(),{active:n,recent:r}=z(e.tasks);return Oe(b`<div class="tasks-page-list">
      ${e.connected?x:b`<div class="callout warn">${i(`tasksPage.disconnected`)}</div>`}
      ${e.error?b`<div class="callout danger" role="alert">${e.error}</div>`:x}
      ${e.copyResultError?b`<div class="callout danger" role="alert">${e.copyResultError}</div>`:x}
      ${e.loading&&e.tasks.length===0?U(i(`tasksPage.loading`)):x}
      ${!e.loading&&e.tasks.length===0?U(i(`tasksPage.empty`)):x}
      ${K(`active`,i(`tasksPage.active`),n,i(`tasksPage.emptyActive`),e,t)}
      ${K(`recent`,i(`tasksPage.recent`),r,i(`tasksPage.emptyRecent`),e,t)}
    </div>`,{wide:!0})}function q(){return(q=e((()=>{S(),de(),Le(),H(),c(),ee(),p(),M()})))()}function J(e,t){return t?e.agentId?.trim()?e.agentId.trim().toLowerCase()===t:[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>se(e)?.agentId===t):!0}function We(e){return e instanceof O&&e.gatewayCode===`INVALID_REQUEST`}async function Ge(e){let t=[],n,r=new Set;for(;;){let a;try{a=await e.client.request(`tasks.list`,{status:[`queued`,`running`],limit:500,...e.agentId?{agentId:e.agentId}:{},...n===void 0?{}:{cursor:n}},{signal:e.signal})}catch(e){throw n!==void 0&&We(e)?new X(e):e}let o=R(a);if(!o)throw Error(i(`tasksPage.invalidResponse`));if(t=I(t,o.tasks),o.nextCursor===void 0)return t;if(!o.nextCursor||r.has(o.nextCursor))throw new X(Error(i(`tasksPage.invalidResponse`)));r.add(o.nextCursor),n=o.nextCursor}}async function Y(e){let[t,n]=await Promise.all([Ge(e),e.client.request(`tasks.list`,{status:Z,sortBy:`endedAt`,limit:200,...e.agentId?{agentId:e.agentId}:{}},{signal:e.signal})]),r=R(n);if(!r)throw Error(i(`tasksPage.invalidResponse`));return{active:t,recent:r.tasks}}async function Ke(e){try{return await Y(e)}catch(t){if(!(t instanceof X))throw t;return await Y(e)}}var X,Z,Q;function $(){return($=e((()=>{t(),we(),S(),ue(),D(),E(),w(),T(),ze(),H(),Fe(),c(),l(),oe(),o(),p(),u(),M(),_e(),s(),te(),je(),Me(),q(),X=class extends Error{constructor(e){super(`task list continuation failed`),this.reason=e}},Z=[`completed`,`failed`,`timed_out`,`cancelled`],Q=class extends a{constructor(...e){super(...e),this.tasks=[],this.error=null,this.copyResultError=null,this.cancellingTaskIds=new Set,this.transcriptTaskId=null,this.transcriptTrigger=null,this.transcriptHost={client:null,connected:!1,requestUpdate:()=>this.requestUpdate()},this.taskRefreshEvents=null,this.taskSnapshotInvalidated=!1,this.copyResultAttempt=0,this.gateway=new ve(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.tasks=[],this.taskSnapshotInvalidated=!1,this.error=null,this.copyResultError=null},invalidateRequests:()=>this.cancelGatewayWork(),onSnapshot:()=>{this.gateway.connected&&this.context.agents.ensureList()},ensureInitialData:()=>void this.refreshTasks()}),this.observeAgentScope=F(()=>{this.gateway.invalidate(),this.cancelGatewayWork(),this.invalidateTaskSnapshot(),this.gateway.connected&&this.refreshTasks(),this.requestUpdate()}),this.listTask=new Se(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null,this.context?.agentSelection.state.scopeId??null],task:async([e,t,n],{signal:r})=>{if(!e||!t)return Ce;let i={gateway:e,client:t,scopeId:n,events:[]};return this.taskRefreshEvents=i,{...await Ke({client:t,agentId:n??void 0,signal:r}),buffer:i}},onComplete:({active:e,recent:t,buffer:n})=>{let r=I(e,t);for(let e of n.events)r=j(r,e).tasks;this.taskSnapshotInvalidated=!1,this.tasks=r,this.reconcileTranscriptSelection(),this.taskRefreshEvents===n&&(this.taskRefreshEvents=null)},onError:e=>{e instanceof X?this.invalidateTaskSnapshot():this.taskRefreshEvents=null,this.error=d(e instanceof X?e.reason:e,i(`tasksPage.loadFailed`))}}),this.subscriptions=new g(this).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e||!this.gateway.connected||t.event!==`task`)return;let n=this.context.agentSelection.state.scopeId,r=P(t.payload);if((r?.action===`deleted`||r?.action===`upserted`&&J(r.task,n))&&this.bufferTaskRefreshEvent(r),this.taskSnapshotInvalidated)return;let i=j(this.tasks,t.payload);if(i.refetch){this.refreshTasks();return}this.tasks=i.tasks.filter(e=>J(e,n)),this.reconcileTranscriptSelection(),r&&Ne(this.transcriptHost,r)})).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}bufferTaskRefreshEvent(e){let t=this.taskRefreshEvents;e&&e.action!==`restored`&&t&&t.gateway===this.gateway.gateway&&t.client===this.gateway.client&&t.scopeId===this.context.agentSelection.state.scopeId&&t.events.push(e)}invalidateTaskSnapshot(){this.closeTranscript(),this.taskRefreshEvents=null,this.taskSnapshotInvalidated=!0,this.tasks=[]}disconnectedCallback(){this.closeTranscript(),this.copyResultAttempt+=1,this.copyResultError=null,this.subscriptions.clear(),super.disconnectedCallback()}cancelGatewayWork(){this.closeTranscript(),this.copyResultAttempt+=1,this.copyResultError=null,this.taskRefreshEvents=null,this.listTask.run([null,null,null]),this.cancellingTaskIds=new Set}refreshTasks(){let e=this.gateway.gateway,t=this.gateway.client;if(!e||this.context.gateway!==e||!this.gateway.connected||!t)return Promise.resolve();let n=this.context.agentSelection.state.scopeId;return this.error=null,this.copyResultError=null,this.listTask.run([e,t,n])}async cancelTask(e){let t=this.gateway.capture(),n=this.gateway.gateway;if(t&&n&&this.context.gateway===n&&!this.cancellingTaskIds.has(e)){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let n=await t.client.request(`tasks.cancel`,{taskId:e});if(!this.gateway.isCurrent(t))return;let r=be(n);if(r?.task){let e=P({action:`upserted`,task:r.task});this.bufferTaskRefreshEvent(e),this.tasks=j(this.tasks,{action:`upserted`,task:r.task}).tasks}r?.cancelled||(this.error=y(r?.reason,i(`tasksPage.cancelFailed`)))}catch(e){this.gateway.isCurrent(t)&&(this.error=d(e,i(`tasksPage.cancelFailed`)))}finally{if(this.gateway.isCurrent(t)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async recoverTask(e,t){let n=this.gateway.capture(),r=this.gateway.gateway;if(n&&r&&this.context.gateway===r&&!this.cancellingTaskIds.has(e)){this.cancellingTaskIds=new Set([...this.cancellingTaskIds,e]),this.error=null;try{let r=t===`retry`?await n.client.request(`tasks.retry`,{taskIds:[e]}):await n.client.request(`tasks.dismiss`,{taskIds:[e]});if(!this.gateway.isCurrent(n))return;let a=L(r)?.results[0];if(!a?.ok){this.error=y(a?.reason,i(`tasksPage.recoveryFailed`));return}if(a.task){let e=P({action:`upserted`,task:a.task});this.bufferTaskRefreshEvent(e),this.tasks=j(this.tasks,e).tasks}}catch(e){this.gateway.isCurrent(n)&&(this.error=d(e,i(`tasksPage.recoveryFailed`)))}finally{if(this.gateway.isCurrent(n)){let t=new Set(this.cancellingTaskIds);t.delete(e),this.cancellingTaskIds=t}}}}async copyTaskResult(e){let t=++this.copyResultAttempt,n=this.gateway.capture(),r=this.gateway.gateway;if(n&&r&&this.context.gateway===r)try{let r=N(await n.client.request(`tasks.get`,{taskId:e}));if(!this.gateway.isCurrent(n)||t!==this.copyResultAttempt)return;let a=r?.result??r?.progressSummary;if(!a){this.copyResultError=i(`tasksPage.recoveryFailed`);return}let o=await v(a,()=>this.gateway.isCurrent(n)&&t===this.copyResultAttempt);this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=o?null:i(`common.copyFailed`))}catch(e){this.gateway.isCurrent(n)&&t===this.copyResultAttempt&&(this.copyResultError=d(e,i(`tasksPage.recoveryFailed`)))}}async viewTranscript(e,t){if(this.transcriptTaskId=e,this.transcriptTrigger=t,await this.updateComplete,!this.isConnected||this.transcriptTaskId!==e)return;let n=this.querySelector(`.tasks-transcript`);n?.focus({preventScroll:!0}),n?.scrollIntoView({block:`start`,behavior:`instant`})}closeTranscript(e=!1){let t=this.transcriptTrigger;this.transcriptTrigger=null,Ae(this.transcriptHost),this.transcriptTaskId=null,e&&t?.isConnected&&t.focus()}reconcileTranscriptSelection(){this.transcriptTaskId&&!this.tasks.some(e=>e.id===this.transcriptTaskId)&&this.closeTranscript()}renderTranscript(){let e=this.tasks.find(e=>e.id===this.transcriptTaskId);return e?(Object.assign(this.transcriptHost,{client:this.gateway.client,connected:this.gateway.connected,connectionEpoch:this.gateway.epoch}),b`<section
      class="tasks-transcript"
      tabindex="-1"
      aria-label=${i(`tasksPage.transcript`)}
    >
      <div class="tasks-transcript__header">
        <h2>${B(e)}</h2>
        <button class="btn btn--sm" type="button" @click=${()=>this.closeTranscript(!0)}>
          ${i(`common.close`)}
        </button>
      </div>
      ${ke({host:this.transcriptHost,task:e})}
    </section>`):x}render(){let e=_(this.context);return b`
      ${De({title:A(`tasks`),subtitle:k(`tasks`),actions:b`
          ${Re({agents:this.context.agents.state.agentsList?.agents??[],selection:this.context.agentSelection})}
          <button
            class="btn"
            type="button"
            ?disabled=${!this.gateway.connected||this.listTask.status===V.PENDING}
            @click=${()=>void this.refreshTasks()}
          >
            ${this.listTask.status===V.PENDING?i(`common.refreshing`):i(`common.refresh`)}
          </button>
        `})}
      ${Pe(b`${this.renderTranscript()}${Ue({basePath:this.context.basePath,agentId:e,mainKey:re({agentsList:this.context.agents.state.agentsList,hello:this.context.gateway.snapshot.hello}),connected:this.gateway.connected,canCopy:me(this.context.gateway.snapshot.hello?.auth??null),canCancel:pe(this.context.gateway.snapshot.hello?.auth??null),loading:this.listTask.status===V.PENDING,error:this.error,copyResultError:this.copyResultError,tasks:this.tasks,cancellingTaskIds:this.cancellingTaskIds,sessionRow:e=>ne(this.context,e),onCancel:e=>void this.cancelTask(e),onRetry:e=>void this.recoverTask(e,`retry`),onDismiss:e=>void this.recoverTask(e,`dismiss`),onCopyResult:e=>void this.copyTaskResult(e),onViewTranscript:(e,t)=>void this.viewTranscript(e,t),onNavigateToChat:e=>{let t=m(this.context,e);this.context.navigate(t,f({context:this.context,face:t,sessionKey:e,preferenceDerivedFace:!0}).options)}})}`)}
    `}},r([n({context:fe,subscribe:!0})],Q.prototype,`context`,void 0),r([C()],Q.prototype,`tasks`,void 0),r([C()],Q.prototype,`error`,void 0),r([C()],Q.prototype,`copyResultError`,void 0),r([C()],Q.prototype,`cancellingTaskIds`,void 0),r([C()],Q.prototype,`transcriptTaskId`,void 0),customElements.get(`testclaw-tasks-page`)||customElements.define(`testclaw-tasks-page`,Q)})))()}$();
//# sourceMappingURL=tasks-page-NHjYs5kL.js.map