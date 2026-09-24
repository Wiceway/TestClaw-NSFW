import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ht as t,Jr as n,qr as r,ti as i}from"./control-ui-foundation-CGMdhB5v.js";import{$l as a,Ac as o,Bl as s,Hl as c,Jl as l,Kr as u,Wr as d,bi as f,kc as p,yi as m}from"./control-ui-core-S9jKXqB5.js";import{$ as h,X as g,Y as _,ct as v,nt as y}from"./lit-runtime-DWoPVI38.js";import{$t as b,Di as x,Oi as S,Qa as ee,do as te,fo as ne,tn as re,un as ie}from"./control-ui-core-G2U4O6rB.js";import{ca as ae,da as oe,go as se,ho as ce,sa as le,ua as ue}from"./control-ui-boot-shared-ooxiG3qa.js";import{At as C,Dt as w,Et as T,Ot as E,_t as D,ht as O,lo as k,uo as A,wt as j}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as M,t as N}from"./en-settings-DALqdpqg.js";import{n as P,o as F}from"./settings-targets-B7C72q5F.js";import{n as I}from"./login-runtime-D8jfKi1h.js";import{n as L,t as R}from"./settings-workspace-DJAhLnkQ.js";import{n as z,r as B,t as V}from"./system-info-DUbEMG87.js";import{a as H,n as de}from"./gateway-vitals-C6z7rmBL.js";function fe(e){if(e.length===0)return null;let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.ceil(t.length*e)-1];return{count:e.length,averageMs:e.reduce((e,t)=>e+t,0)/e.length,p50Ms:n(.5),p95Ms:n(.95),p99Ms:n(.99)}}function U(){return(U=e((()=>{})))()}function pe(e){return e>=.92?`critical`:e>=.75?`warn`:`ok`}function me(e,t){let n=Math.min(Math.max(t,0),1),r=Math.round(n*100);return h`
    <div
      class="config-host__meter"
      role="meter"
      aria-label=${a(`quickSettings.system.usage`,{label:e})}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow=${r}
    >
      <div
        class="config-host__meter-fill config-host__meter-fill--${pe(n)}"
        style="--config-host-meter-fill: ${r}%"
      ></div>
    </div>
  `}function he(e){let t=e.path?`${e.label} ${e.path}`:e.label;return h`
    <div class="config-host__stat" title=${e.title??g}>
      <div class="config-host__stat-label">
        ${e.label}${e.path?h` <span class="config-host__stat-path">${e.path}</span>`:g}
      </div>
      <div class="config-host__stat-value">
        ${e.value}${e.unit?h` <span class="config-host__stat-unit">${e.unit}</span>`:g}
      </div>
      ${e.usedFraction==null?g:me(t,e.usedFraction)}
      ${e.detail?h`<div class="config-host__stat-detail">${e.detail}</div>`:g}
    </div>
  `}function W(e,t){if(!(e==null||t==null||e<=0))return(e-t)/e}function G(e){return`${Math.round(Math.min(Math.max(e,0),1)*100)}%`}function ge(e){let t=e.loadAverage?.[0],n=e.loadAverage?a(`quickSettings.system.loadAverage`,{values:e.loadAverage.map(e=>e.toFixed(1)).join(` · `)}):void 0,r=[e.cpuModel,n].filter(Boolean).join(` · `)||void 0,i=a(e.cpuCount===1?`quickSettings.system.core`:`quickSettings.system.cores`,{count:String(e.cpuCount)}),o=t==null?{label:a(`quickSettings.system.cpu`),value:i,detail:e.cpuModel}:{label:a(`quickSettings.system.cpu`),value:t.toFixed(1),unit:a(`quickSettings.system.load`),detail:i,usedFraction:e.cpuCount>0?t/e.cpuCount:void 0,title:r},s=W(e.memoryTotalBytes,e.memoryFreeBytes),c=[o,{label:a(`quickSettings.system.memory`),value:s==null?`—`:G(s),unit:s==null?void 0:a(`quickSettings.system.used`),detail:a(`quickSettings.system.freeOf`,{free:p(e.memoryFreeBytes),total:p(e.memoryTotalBytes)}),usedFraction:s}];for(let t of e.disks??[]){let e=W(t.totalBytes,t.availableBytes);e!=null&&c.push({label:a(`quickSettings.system.disk`),value:G(e),unit:a(`quickSettings.system.used`),detail:a(`quickSettings.system.freeOf`,{free:p(t.availableBytes),total:p(t.totalBytes)}),usedFraction:e,path:t.path})}return c}function _e(e){return[{label:a(`quickSettings.system.cpu`),value:e},{label:a(`quickSettings.system.memory`),value:e},{label:a(`quickSettings.system.disk`),value:e}]}function ve(e){if(e.systemInfoUnavailable)return g;let t=e.systemInfo,n=e.systemInfoLoading?h`<span class="skeleton config-host__placeholder" aria-hidden="true"></span>`:`—`,r=t&&t.hostname!==t.machineName?t.hostname:void 0,i=t?.lanAddress?`${t.lanAddress}${t.port==null?``:`:${t.port}`}`:void 0,o=t?ge(t):_e(n),s={title:a(`quickSettings.system.gatewayHost`),actions:t?C({kind:`ok`,label:a(`quickSettings.system.up`,{duration:ue(t.uptimeMs)})}):void 0};return h`
    <div id=${P.host} aria-busy=${!!e.systemInfoLoading}>
      ${E(s,h`
          <div class="config-host">
            <div class="config-host__identity">
              <div class="config-host__name" title=${r??``}>
                ${t?.machineName??n}
              </div>
              <div class="config-host__meta">
                ${t?`${t.osLabel} · ${t.arch}`:n}
              </div>
              <div class="config-host__meta">
                ${t?a(`quickSettings.system.runtime`,{version:t.nodeVersion,pid:String(t.pid)}):n}
              </div>
              ${i?h`<code class="config-host__address">${i}</code>`:g}
            </div>
            <div class="config-host__stats">${o.map(he)}</div>
          </div>
        `)}
    </div>
  `}function K(){return(K=e((()=>{_(),O(),l(),o(),oe(),F()})))()}function ye(e){return e?`${(e/1e3).toFixed(e%1e3==0?0:1)}s`:null}function q(e,t){let n=t===`password`?`connection.access.passwordHint`:t===`token`?`connection.access.tokenHint`:`connection.access.secretHint`;return T({title:a(`connection.access.secret`),description:a(n),control:h`<div class="settings-input-with-hint">
      ${w({ariaLabel:a(`connection.access.secret`),value:e.secret,placeholder:a(`connection.access.secretPlaceholder`),visible:e.showGatewaySecret,showLabel:a(`connection.access.showSecret`),hideLabel:a(`connection.access.hideSecret`),toggleLabel:a(`connection.access.toggleSecretVisibility`),onInput:e.onSecretChange,onToggle:e.onToggleGatewaySecretVisibility})}
      ${I(e.secret)===`setup-code`?h`<p class="settings-row__desc" role="status">
              ${a(`connection.access.setupCodeHint`)}
            </p>`:g}
    </div>`,stackedOnNarrow:!0})}function be(e){return`${e.toFixed(1)} ${a(`connection.ping.unit`)}`}function xe(e){let t=[{key:`average`,value:e.ping?.averageMs},{key:`p50`,value:e.ping?.p50Ms},{key:`p95`,value:e.ping?.p95Ms},{key:`p99`,value:e.ping?.p99Ms}];return h`<div class="settings-row connection-ping">
    <dl class="connection-ping__stats" aria-label=${a(`connection.ping.title`)}>
      ${t.map(({key:e,value:t})=>h`<div title=${a(`connection.ping.${e}Hint`)}>
          <dt>${a(`connection.ping.${e}`)}</dt>
          <dd>
            ${t===void 0?`—`:h`${t.toFixed(1)} <span>${a(`connection.ping.unit`)}</span>`}
          </dd>
        </div>`)}
    </dl>
    <testclaw-sparkline
      class="gateway-vital connection-ping__trend"
      .label=${a(`connection.ping.latest`)}
      .samples=${e.pingSamples}
      .format=${be}
      .floorMax=${100}
    ></testclaw-sparkline>
    <p class="settings-row__desc">
      ${e.ping?a(`connection.ping.samples`,{count:String(e.ping.count)}):e.pingFailed?g:a(`connection.ping.measuring`)}
      ${e.pingFailed?h`<span class="connection-ping__error" role="status">
              ${a(`connection.ping.failed`)}
            </span>`:g}
    </p>
  </div>`}function Se(e){let n=e.hello?.snapshot,r=e.phase===`connected`,i=[`connecting`,`starting`,`reconnecting`].includes(e.phase),o=i&&!e.dirty,s=e.phase===`reload-required`,c=n?.authMode,l=t(e.settings.gatewayUrl)===t(e.liveGatewayUrl)?c:void 0,u=l===`trusted-proxy`,d=r?`connected`:e.phase===`stopped`?`offline`:e.phase,f=a(o?e.phase===`reconnecting`?`connection.access.status.reconnecting`:`connection.access.status.connecting`:r||i?`connection.access.applyReconnect`:e.lastError?`connection.access.retry`:`common.connect`),p=ye(e.hello?.policy?.tickIntervalMs),_=h`
    ${r?xe(e):g}
    ${T({title:a(`connection.access.gatewayUrl`),description:a(`connection.access.gatewayUrlHint`),control:h`
        <input
          class="settings-input"
          aria-label=${a(`connection.access.gatewayUrl`)}
          inputmode="url"
          autocapitalize="none"
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          .value=${e.settings.gatewayUrl}
          @input=${t=>{e.onConnectionChange({gatewayUrl:t.target.value})}}
          placeholder="wss://gateway.example:443"
        />
      `})}
    ${u?T({title:a(`connection.access.secret`),description:a(`connection.access.trustedProxy`),control:C({kind:`ok`,label:a(`connection.access.trustedProxyStatus`)})}):q(e,l)}
    ${!r&&e.lastError?T({title:C({kind:`danger`,label:a(`connection.access.lastError`)}),description:e.lastError}):g}
    ${(!r||e.dirty)&&!s?h`<div class="settings-row connection-actions">
            <div class="settings-row__text">
              <span class="settings-row__desc" role="status">
                ${e.dirty?a(`connection.access.unsavedHint`):g}
              </span>
            </div>
            <div class="settings-row__control connection-actions__buttons">
              ${e.dirty?h`<button class="btn" @click=${e.onDiscardConnection}>
                      ${a(`connection.access.discard`)}
                    </button>`:g}
              <button class="btn primary" ?disabled=${o} @click=${e.onConnect}>
                ${o?h`<span class="btn__spinner" aria-hidden="true"></span>`:g}
                ${f}
              </button>
            </div>
          </div>`:g}
    <details class="connection-details">
      <summary>${a(`connection.access.details`)}</summary>
      <div class="connection-details__body">
        ${r&&(c||p)?h`<p class="settings-row__desc">
                ${[c?a(J[c]):null,p?a(`connection.access.tick`,{tick:p}):null].filter(Boolean).join(` · `)}
              </p>`:g}
        <p class="settings-row__desc">${a(`connection.access.reconnectHint`)}</p>
        <button class="btn" ?disabled=${!r||e.dirty} @click=${e.onReconnect}>
          ${a(`connection.access.reconnect`)}
        </button>
      </div>
    </details>
  `;return j([E({title:a(`connection.access.title`),description:r?a(`connection.access.connectedTo`,{host:m(e.liveGatewayUrl)}):a(i||s?`connection.access.status.${d}`:`connection.access.descriptionOffline`),actions:C({kind:r?`ok`:`warn`,label:a(`connection.access.status.${d}`)})},_),E({title:a(`connection.activity.title`),description:a(`connection.activity.description`)},h`<div class="settings-row connection-activity">
        ${H(e.statusHistory.at(-1)?.status??{},e.statusHistory)}
        ${e.statusFailed?h`<p class="settings-row__desc" role="status">
                ${a(`connection.activity.failed`)}
              </p>`:r?e.statusHistory.length===0?h`<p class="settings-row__desc" role="status">${a(`common.loading`)}</p>`:g:h`<p class="settings-row__desc">${a(`connection.activity.offline`)}</p>`}
      </div>`),E({title:a(`connection.access.sessionTitle`),description:a(`connection.access.sessionDescription`,{host:m(e.liveGatewayUrl)})},h`
        ${T({title:a(`connection.access.sessionKey`),description:a(`connection.access.sessionKeyHint`),control:h`
            <input
              class="settings-input"
              aria-label=${a(`connection.access.sessionKey`)}
              .value=${e.settings.sessionKey}
              @input=${t=>e.onSessionKeyChange(t.target.value)}
            />
          `})}
        ${e.sessionDirty?h`<div class="settings-row">
                <div class="settings-row__text"></div>
                <div class="settings-row__control connection-actions__buttons">
                  <button class="btn" @click=${e.onDiscardSession}>
                    ${a(`connection.access.discard`)}
                  </button>
                  <button
                    class="btn primary"
                    ?disabled=${!e.settings.sessionKey.trim()}
                    @click=${e.onSaveSession}
                  >
                    ${a(`common.save`)}
                  </button>
                </div>
              </div>`:e.sessionSaved?h`<div class="settings-row" role="status">${a(`connection.access.saved`)}</div>`:g}
      `),ve(e),e.canForgetDevice?E({title:a(`connection.browser.title`)},T({title:a(`connection.browser.savedSignIn`),control:h`<button class="btn" @click=${e.onForgetDevice}>
              ${a(`connection.browser.forgetDevice`)}
            </button>`})):g])}var J;function Y(){return(Y=e((()=>{_(),de(),O(),l(),N(),f(),K(),M(),J={none:`connection.access.auth.none`,token:`connection.access.auth.token`,password:`connection.access.auth.password`,"trusted-proxy":`connection.access.auth.trustedProxy`}})))()}var X,Z,Q;function $(){return($=e((()=>{n(),_(),y(),ee(),S(),b(),k(),O(),R(),l(),d(),f(),se(),c(),ae(),U(),V(),Y(),X=5e3,Z=`https://docs.testclaw.ai/gateway/remote`,Q=class extends s{constructor(...e){super(...e),this.settings=re(),this.password=``,this.gatewaySecretVisible=!1,this.systemInfo=null,this.systemInfoUnavailable=!1,this.systemInfoLoading=!1,this.ping=null,this.pingFailed=!1,this.pingSamples=[],this.pingRequest=null,this.statusHistory=[],this.statusFailed=!1,this.systemInfoRequest=null,this.sessionKeyBaseline=``,this.sessionGatewayUrl=``,this.sessionSaved=!1,this.diagnosticsPolling=new le(this,X,()=>this.refreshDiagnostics(),!1),this.gateway=new ce(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>{this.systemInfoLoading=!1,this.resetDiagnostics()},onSnapshot:e=>this.handleGatewaySnapshot(e),onPageActivation:()=>this.syncDiagnosticsPolling()})}disconnectedCallback(){this.resetDiagnostics(),this.resetSensitiveUi(),super.disconnectedCallback()}resetSensitiveUi(){this.gatewaySecretVisible=!1}handleGatewaySnapshot({snapshot:e,initial:t,sourceChanged:n,clientChanged:r}){let i=this.systemInfoUnavailable;t||n||r?(this.resetDiagnostics(),this.resetConnectionDraft(),(t||n||this.sessionGatewayUrl!==this.context.gateway.connection.gatewayUrl)&&this.resetSessionDraft(),this.systemInfo=null,this.systemInfoUnavailable=!1):e.phase!==`connected`&&(this.resetSensitiveUi(),this.systemInfo=null),e.phase===`connected`&&e.hello&&(this.systemInfoUnavailable=!B(e.hello),this.systemInfoUnavailable&&(this.gateway.invalidate(),this.systemInfoRequest?.abort(),this.systemInfoRequest=null,this.systemInfoLoading=!1,this.systemInfo=null,this.statusFailed=!0)),this.settings.sessionKey===this.sessionKeyBaseline&&(this.settings={...this.settings,sessionKey:e.sessionKey}),this.sessionKeyBaseline=e.sessionKey,this.syncDiagnosticsPolling(),i&&!this.systemInfoUnavailable&&this.loadSystemInfo()}stopDiagnosticsPolling(){this.diagnosticsPolling.stop(),this.pingRequest?.abort(),this.pingRequest=null,this.systemInfoRequest?.abort(),this.systemInfoRequest=null,this.systemInfoLoading=!1}resetDiagnostics(){this.stopDiagnosticsPolling(),this.pingSamples=[],this.ping=null,this.pingFailed=!1,this.statusHistory=[],this.statusFailed=!1}syncDiagnosticsPolling(){let e=this.context.gateway.snapshot;if(!this.isConnected||document.visibilityState===`hidden`||e.phase!==`connected`||!e.client){this.stopDiagnosticsPolling();return}this.diagnosticsPolling.start()&&this.refreshDiagnostics()}refreshDiagnostics(){this.measurePing(),this.loadSystemInfo()}async measurePing(){let e=this.gateway.gateway,t=this.gateway.capture();if(!e||e!==this.context.gateway||!t||this.pingRequest||document.visibilityState===`hidden`)return;let n=new AbortController;this.pingRequest=n;let r=()=>this.pingRequest===n&&this.isConnected&&document.visibilityState!==`hidden`&&this.context.gateway===e&&this.gateway.isCurrent(t),i=performance.now();try{if(await t.client.request(`last-heartbeat`,{},{timeoutMs:X,signal:n.signal}),!r())return;this.pingSamples=[...this.pingSamples.slice(-99),{at:Date.now(),value:performance.now()-i}],this.ping=fe(this.pingSamples.map(e=>e.value)),this.pingFailed=!1}catch{r()&&(this.pingFailed=!0)}finally{this.pingRequest===n&&(this.pingRequest=null)}}async loadSystemInfo(){let e=this.gateway.gateway,t=this.gateway.capture();if(!e||e!==this.context.gateway||!t||this.systemInfoUnavailable||this.systemInfoRequest||document.visibilityState===`hidden`)return;let n=new AbortController;this.systemInfoRequest=n,this.systemInfoLoading=!0;let r=()=>this.systemInfoRequest===n&&this.isConnected&&document.visibilityState!==`hidden`&&this.context.gateway===e&&this.gateway.isCurrent(t);try{let e=await t.client.request(`system.info`,{},{timeoutMs:X,signal:n.signal});if(!r())return;this.systemInfo=e,this.statusHistory=[...this.statusHistory.slice(-99),{at:Date.now(),status:{eventLoop:e.eventLoop,processMemory:e.processMemory}}],this.statusFailed=!1}catch(e){if(!r())return;this.statusFailed=!0,(u(e)||z(e))&&(this.systemInfo=null,this.systemInfoUnavailable=!0)}finally{this.systemInfoRequest===n&&(this.systemInfoRequest=null,this.systemInfoLoading=!1)}}resetConnectionDraft(){let{gatewayUrl:e,token:t,password:n}=this.context.gateway.connection;this.settings={...this.settings,gatewayUrl:e,token:t},this.password=n,this.resetSensitiveUi()}resetSessionDraft(){this.sessionGatewayUrl=this.context.gateway.connection.gatewayUrl,this.sessionKeyBaseline=this.context.gateway.snapshot.sessionKey,this.settings={...this.settings,sessionKey:this.sessionKeyBaseline},this.sessionSaved=!1}saveSession(){this.context.gateway.setSessionKey(this.settings.sessionKey),this.resetSessionDraft(),this.sessionSaved=!0}async forgetDevice(){let e=this.context.gateway,t=e.connection.gatewayUrl;await A({title:a(`connection.browser.confirmTitle`),message:a(`connection.browser.confirmMessage`,{gateway:m(t)}),confirmLabel:a(`connection.browser.confirmLabel`),danger:!0})&&this.isConnected&&this.context.gateway===e&&e.connection.gatewayUrl===t&&(e.forgetDeviceToken?.(),this.requestUpdate())}connect(){this.context.gateway.connect({gatewayUrl:this.settings.gatewayUrl,token:this.settings.token,password:this.password})}updateConnection(e){if(e.gatewayUrl!==void 0){let t=ie(this.settings.gatewayUrl,e.gatewayUrl,{token:this.settings.token,password:this.password});this.password=t.password,this.settings={...this.settings,...e,token:t.token};return}this.settings={...this.settings,...e}}render(){let e=this.context.gateway.snapshot,t=this.context.gateway.connection,n=this.settings.gatewayUrl!==t.gatewayUrl||this.settings.token!==t.token||this.password!==t.password,r=Se({phase:e.phase,hello:e.hello,settings:this.settings,liveGatewayUrl:t.gatewayUrl,secret:this.settings.token||this.password,lastError:e.lastError,systemInfo:this.systemInfo,systemInfoLoading:this.systemInfoLoading,systemInfoUnavailable:this.systemInfoUnavailable,ping:this.ping,pingFailed:this.pingFailed,pingSamples:this.pingSamples,statusHistory:this.statusHistory,statusFailed:this.statusFailed,dirty:n,sessionDirty:this.settings.sessionKey.trim()!==e.sessionKey,sessionSaved:this.sessionSaved,showGatewaySecret:this.gatewaySecretVisible,canForgetDevice:this.context.gateway.hasStoredDeviceToken?.()??!1,onForgetDevice:()=>void this.forgetDevice(),onConnectionChange:e=>this.updateConnection(e),onSecretChange:e=>{this.password=``,this.updateConnection({token:e})},onSessionKeyChange:e=>{this.sessionSaved=!1,this.settings={...this.settings,sessionKey:e}},onToggleGatewaySecretVisibility:()=>{this.gatewaySecretVisible=!this.gatewaySecretVisible},onConnect:()=>this.connect(),onDiscardConnection:()=>this.resetConnectionDraft(),onReconnect:()=>this.context.gateway.connect(),onSaveSession:()=>this.saveSession(),onDiscardSession:()=>this.resetSessionDraft()});return h`
      <section class="content-header">
        <div>
          <h1 class="page-title">${ne(`connection`)}</h1>
          <div class="page-subtitle">
            ${te(`connection`)} ${D(Z)}
          </div>
        </div>
      </section>
      ${L(r)}
    `}},i([r({context:x,subscribe:!0})],Q.prototype,`context`,void 0),i([v()],Q.prototype,`settings`,void 0),i([v()],Q.prototype,`password`,void 0),i([v()],Q.prototype,`gatewaySecretVisible`,void 0),i([v()],Q.prototype,`systemInfo`,void 0),i([v()],Q.prototype,`systemInfoUnavailable`,void 0),i([v()],Q.prototype,`systemInfoLoading`,void 0),i([v()],Q.prototype,`ping`,void 0),i([v()],Q.prototype,`pingFailed`,void 0),i([v()],Q.prototype,`statusHistory`,void 0),i([v()],Q.prototype,`statusFailed`,void 0),i([v()],Q.prototype,`sessionSaved`,void 0),customElements.get(`testclaw-connection-page`)||customElements.define(`testclaw-connection-page`,Q)})))()}$();
//# sourceMappingURL=connection-page-DYJAY_mc.js.map