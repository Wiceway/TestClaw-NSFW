import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Bs as o,Hl as s,Jl as c,Rs as l,_n as u,ac as d,ic as ee,mn as te}from"./control-ui-core-S9jKXqB5.js";import{$ as f,X as p,Y as m,c as h,ct as g,d as _,nt as ne,r as v,s as y,t as b,u as x}from"./lit-runtime-DWoPVI38.js";import{$i as S,Di as C,Oi as w,Qa as re,Qi as ie,fo as ae}from"./control-ui-core-G2U4O6rB.js";import{ca as T,go as E,ho as D,sa as O}from"./control-ui-boot-shared-ooxiG3qa.js";import{G as k,H as A,U as j,V as M}from"./control-ui-boot-shared-C3bL_9oq.js";import{At as N,Dr as P,Er as F,Et as I,Ot as L,ht as R,wt as z,yt as oe}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as B,r as V,t as H}from"./control-ui-boot-shared-DE0JeAKR.js";import{n as U,t as W}from"./settings-workspace-DJAhLnkQ.js";import{i as G,s as K}from"./presenter-wVFa7WAH.js";import{a as q,i as se,n as J,t as ce}from"./lane-table-8ChAaIWZ.js";function Y(e,t){return I({title:e,stacked:!0,control:f`<pre class="code-block" role="group" aria-label=${e} tabindex="0">
${_([t],()=>v(F(JSON.stringify(t??{},null,2))))}</pre>`})}function le(e){let t=(e.status&&typeof e.status==`object`?e.status.securityAudit:null)?.summary??null;if(!t)return p;let n=t.critical??0,r=t.warn??0,a=t.info??0,o=n>0?`danger`:r>0?`warn`:`ok`,s=n>0?i(`debug.security.critical`,{count:String(n)}):r>0?i(`debug.security.warnings`,{count:String(r)}):i(`debug.security.noCriticalIssues`),c=a>0?` · ${i(`debug.security.info`,{count:String(a)})}`:``;return I({title:i(`debug.security.audit`),description:f`
      ${i(`debug.security.runPrefix`)}
      <span class="mono">testclaw security audit --deep</span>
      ${i(`debug.security.runSuffix`)}
    `,control:N({kind:o,label:`${s}${c}`})})}function ue(e){return e?f`
    <div class="settings-row" role="alert">
      <div class="settings-row__text">
        <span class="settings-row__title">
          ${N({kind:`danger`,label:i(`common.failed`)})}
        </span>
        <span class="settings-row__desc">${e}</span>
      </div>
    </div>
  `:p}function de(e){return e.connected||!e.offlineStable?p:I({title:N({kind:`muted`,label:i(`common.offline`)}),description:i(`debug.offlineSnapshots`)})}function fe(e){return I({title:e.event,description:te(e.ts,void 0,``),stacked:!0,control:f`<pre class="code-block" role="group" aria-label=${e.event} tabindex="0">
${_([e.payload],()=>v(F(G(e.payload))))}</pre>`})}function pe(e){let t=e.connected&&e.loading,n=L({title:i(`debug.snapshotsTitle`),description:i(`debug.snapshotsSubtitle`),actions:f`
        <button
          class="btn"
          ?disabled=${!e.connected||e.loading}
          @click=${e.onRefresh}
        >
          ${i(t?`common.refreshing`:`common.refresh`)}
        </button>
      `},f`
      ${de(e)} ${ue(e.diagnosticsError)}
      ${le(e)} ${Y(i(`debug.status`),e.status)}
      ${Y(i(`debug.health`),e.health)}
      ${Y(i(`debug.lastHeartbeat`),e.heartbeat)}
    `),r=L({title:i(`debug.lanes.title`),description:i(`debug.lanes.subtitle`),actions:f`
        <button class="btn" @click=${e.onOpenOverlay}>
          ${S()?i(`debug.overlay.open`):i(`debug.overlay.openWithShortcut`,{shortcut:H})}
        </button>
      `},f`
      <div class="data-table-container command-lanes-table-wrap">
        <table class="data-table command-lanes-table settings-table--stacked" role="table">
          <thead>
            <tr>
              <th scope="col">${i(`debug.lanes.lane`)}</th>
              <th scope="col">${i(`debug.lanes.active`)}</th>
              <th scope="col">${i(`debug.lanes.queued`)}</th>
              <th scope="col">${i(`debug.lanes.group`)}</th>
              <th scope="col">${i(`debug.lanes.blocked`)}</th>
            </tr>
          </thead>
          <tbody>
            ${J({lanes:e.lanes,dynamic:e.dynamic})}
          </tbody>
        </table>
      </div>
    `),a=L({title:i(`debug.manualRpcTitle`),description:i(`debug.manualRpcSubtitle`)},f`
      ${I({title:i(`debug.method`),control:f`
          <select
            class="settings-select"
            aria-label=${i(`debug.method`)}
            .value=${e.callMethod}
            @change=${t=>e.onCallMethodChange(t.target.value)}
          >
            ${e.callMethod?p:f` <option value="" disabled>${i(`debug.selectMethod`)}</option> `}
            ${e.methods.map(e=>f`<option value=${e}>${e}</option>`)}
          </select>
        `})}
      ${I({title:i(`debug.paramsJson`),stacked:!0,control:f`
          <textarea
            class="settings-input"
            aria-label=${i(`debug.paramsJson`)}
            .value=${e.callParams}
            @input=${t=>e.onCallParamsChange(t.target.value)}
            rows="6"
          ></textarea>
        `})}
      ${I({title:i(`common.call`),control:f`
          <button class="btn primary" @click=${e.onCall}>${i(`common.call`)}</button>
        `})}
      ${e.callError?f`
              <div class="settings-row settings-row--stacked" role="alert">
                ${N({kind:`danger`,label:i(`debug.callFailed`)})}
                <pre
                  class="code-block"
                  role="group"
                  aria-label=${i(`debug.callFailed`)}
                  tabindex="0"
                >
${e.callError}</pre>
              </div>
            `:p}
      ${e.callResult?f`
              <div class="settings-row settings-row--stacked">
                ${N({kind:`ok`,label:i(`common.ok`)})}
                <pre
                  class="code-block"
                  role="group"
                  aria-label=${`${e.callMethod}: ${i(`common.ok`)}`}
                  tabindex="0"
                >
${_([e.callResult],()=>v(F(e.callResult)))}</pre>
              </div>
            `:p}
    `),o=L({title:i(`debug.modelsTitle`),description:i(`debug.modelsSubtitle`)},f`
      <div class="settings-row settings-row--stacked">
        <pre class="code-block" role="group" aria-label=${i(`debug.modelsTitle`)} tabindex="0">
${_([e.models],()=>v(F(JSON.stringify(e.models??[],null,2))))}</pre>
      </div>
    `),s=L({title:i(`debug.eventLogTitle`),description:i(`debug.eventLogSubtitle`)},e.eventLog.length===0?oe(i(`debug.noEvents`)):h(e.eventLog,e=>e,fe));return z(f`${n} ${r} ${a} ${o} ${s}`,{wide:!0})}function X(){return(X=e((()=>{m(),x(),y(),b(),ie(),P(),R(),c(),u(),K(),B(),ce()})))()}var Z,Q;function $(){return($=e((()=>{t(),M(),m(),ne(),re(),w(),W(),o(),E(),s(),T(),d(),B(),X(),Z=3e3,Q=class extends a{constructor(...e){super(...e),this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallMethod=``,this.debugCallParams=`{}`,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.debugLiveError=null,this.eventLog=[],this.polling=new O(this,Z,()=>{this.loadLiveDiagnostics()},!1,`visible`),this.callEpoch=0,this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.diagnosticsNeedsRefresh=!0,this.diagnosticsTask=new A(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.context?.settingsAgentSelection.state.selectedId??null],task:([e,t],{signal:n})=>e?q(e,t,n):j,onComplete:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=null,this.debugLiveError=null,this.debugStatus=e.status,this.debugHealth=e.health,this.debugModels=e.models,this.debugHeartbeat=e.heartbeat,this.debugLanes=e.lanes,this.debugDynamic=e.dynamic},onError:e=>{this.diagnosticsTaskActiveClient=null,this.debugDiagnosticsError=l(e)}}),this.liveTask=new A(this,{autoRun:!1,task:async([e],{signal:t})=>{if(!e)return j;let[n,r]=await Promise.all([e.request(`last-heartbeat`,{},{signal:t}),se(e,t)]);return{heartbeat:n,...r}},onComplete:e=>{this.debugHeartbeat=e.heartbeat,this.debugLanes=e.lanes,this.debugDynamic=e.dynamic,this.debugLiveError=null},onError:e=>{this.debugLiveError=l(e)}}),this.gateway=new D(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugLanes=[],this.debugDynamic=null,this.debugCallResult=null,this.debugCallError=null,this.debugDiagnosticsError=null,this.debugLiveError=null},invalidateRequests:()=>{this.diagnosticsTask.run([null,null]),this.liveTask.run([null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsNeedsRefresh=!0,this.callEpoch+=1},onSnapshot:()=>{this.syncPolling(),this.ensureInitialDebug()}}),this.subscriptions=new ee(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribeEventLog(t),e=>{this.eventLog=e.eventLog}).watch(()=>this.context?.settingsAgentSelection,(e,t)=>e.subscribe(t),e=>{let t=e.state.selectedId;t!==this.diagnosticsAgentId&&(this.diagnosticsAgentId=t,this.debugModels=[],this.diagnosticsTask.run([null,null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsNeedsRefresh=!0,this.loadDiagnostics())})}disconnectedCallback(){this.subscriptions.clear(),this.diagnosticsTask.run([null,null]),this.liveTask.run([null]),this.diagnosticsTaskActiveClient=null,this.diagnosticsAgentId=null,this.diagnosticsNeedsRefresh=!0,this.callEpoch+=1,super.disconnectedCallback()}syncPolling(){if(!this.gateway.connected||!this.gateway.client){this.polling.stop();return}this.polling.start()}ensureInitialDebug(){this.gateway.connected&&this.gateway.client&&this.diagnosticsNeedsRefresh&&!this.diagnosticsTaskActiveClient&&this.loadDiagnostics()}loadDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient?Promise.resolve():(this.liveTask.run([null]),this.diagnosticsTaskActiveClient=e,this.diagnosticsNeedsRefresh=!1,this.diagnosticsAgentId=this.context.settingsAgentSelection.state.selectedId,this.diagnosticsTask.run([e,this.context.settingsAgentSelection.state.selectedId]))}loadLiveDiagnostics(){let e=this.gateway.connected?this.gateway.client:null;return!e||this.diagnosticsTaskActiveClient||this.liveTask.status===k.PENDING?Promise.resolve():this.liveTask.run([e])}async callDebugMethod(){let e=this.gateway.connected?this.gateway.client:null;if(!e)return;this.debugCallError=null,this.debugCallResult=null;let t=this.gateway.gateway,n=++this.callEpoch,r=()=>this.gateway.connected&&this.gateway.client===e&&this.gateway.gateway===t&&this.context.gateway===t&&this.callEpoch===n;try{let t=this.debugCallParams.trim()?JSON.parse(this.debugCallParams):{},n=await e.request(this.debugCallMethod.trim(),t);r()&&(this.debugCallResult=JSON.stringify(n,null,2))}catch(e){r()&&(this.debugCallError=l(e))}}render(){let e=pe({connected:this.gateway.connected,offlineStable:this.gateway.snapshot?.offlineStable??!1,loading:this.diagnosticsTask.status===k.PENDING,status:this.debugStatus,health:this.debugHealth,models:this.debugModels,heartbeat:this.debugHeartbeat,lanes:this.debugLanes,dynamic:this.debugDynamic,diagnosticsError:this.debugDiagnosticsError??this.debugLiveError,eventLog:this.eventLog,methods:(this.context.gateway.snapshot.hello?.features?.methods??[]).toSorted(),callMethod:this.debugCallMethod,callParams:this.debugCallParams,callResult:this.debugCallResult,callError:this.debugCallError,onCallMethodChange:e=>this.debugCallMethod=e,onCallParamsChange:e=>this.debugCallParams=e,onRefresh:()=>void this.loadDiagnostics(),onOpenOverlay:V,onCall:()=>void this.callDebugMethod()});return f`
      <section class="content-header">
        <div>
          <div class="page-title">${ae(`debug`)}</div>
        </div>
      </section>
      ${U(e)}
    `}},r([n({context:C,subscribe:!0})],Q.prototype,`context`,void 0),r([g()],Q.prototype,`debugStatus`,void 0),r([g()],Q.prototype,`debugHealth`,void 0),r([g()],Q.prototype,`debugModels`,void 0),r([g()],Q.prototype,`debugHeartbeat`,void 0),r([g()],Q.prototype,`debugLanes`,void 0),r([g()],Q.prototype,`debugDynamic`,void 0),r([g()],Q.prototype,`debugCallMethod`,void 0),r([g()],Q.prototype,`debugCallParams`,void 0),r([g()],Q.prototype,`debugCallResult`,void 0),r([g()],Q.prototype,`debugCallError`,void 0),r([g()],Q.prototype,`debugDiagnosticsError`,void 0),r([g()],Q.prototype,`debugLiveError`,void 0),r([g()],Q.prototype,`eventLog`,void 0),customElements.get(`testclaw-debug-page`)||customElements.define(`testclaw-debug-page`,Q)})))()}$();
//# sourceMappingURL=debug-page-CfZNCIuy.js.map