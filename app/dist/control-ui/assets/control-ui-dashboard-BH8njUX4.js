const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./board-view-BSBzVBDr.js","./control-ui-boot-shared-CCYBAAP9.js","./gateway-runtime-BV4hxqU_.js","./control-ui-boot-shared-BGGpAWmX.js","./control-ui-boot-shared-DyyHmPxq.js","./control-ui-boot-shared-8dYR6CXG.js","./control-ui-boot-shared-C3bL_9oq.js","./markdown-runtime-B1-JWj3L.js","./control-ui-boot-shared-7DNogyqm.js","./control-ui-boot-shared-BnfqoX89.js","./config-runtime-CgOgfOrG.js","./control-ui-boot-shared-D2o30asO.js","./control-ui-boot-shared-DudbgiQn.js","./control-ui-boot-shared-VDjYq2Zh.js","./control-ui-boot-shared-DE0JeAKR.js","./sidebar-update-runtime-BRiaYa7O.js","./board-view-NvQR5p1A.js","./control-ui-disabled-P0AuytQi.js","./near-viewport-observer-BF_iROOc.js","./widget-sandbox-host-K91WGv0Z.js","./control-ui-core-CBmGCeuQ.css","./control-ui-boot-shared-aePz3vDg.css","./sidebar-update-runtime-BklCM1yZ.css","./board-view-CL7o60OA.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,eo as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Hl as o,Jl as s}from"./control-ui-core-S9jKXqB5.js";import{$ as c,X as l,Y as u,ct as d,nt as f,ut as p}from"./lit-runtime-DWoPVI38.js";import{Fi as m,Ii as h,fi as g,pi as _}from"./control-ui-core-G2U4O6rB.js";import{_r as v,hr as y,mr as b,pr as x}from"./control-ui-boot-shared-ooxiG3qa.js";function S(){return g(`testclaw-board-view`,()=>t(()=>import(`./board-view-BSBzVBDr.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]),import.meta.url))}var C;function w(){return(w=e((()=>{u(),f(),_(),h(),s(),v(),o(),n(),C=class extends a{constructor(...e){super(...e),this.session=null,this.client=null,this.connected=!1,this.canMutate=!1,this.canGrant=!1,this.presented=!0,this.provider=null,this.expanded=!1,this.activeTabId=``,this.viewError=null,this.viewLoad=null,this.lease=null,this.unsubscribeSnapshot=null,this.expansionInitialized=!1}connectedCallback(){super.connectedCallback(),this.requestUpdate()}updated(){this.viewLoad??=S().catch(e=>{this.viewError=e instanceof Error?e.message:String(e)}),this.synchronizeProvider()}disconnectedCallback(){this.releaseProvider(),super.disconnectedCallback()}synchronizeProvider(){let e=this.session,t=this.client;if(!this.isConnected||!e?.sessionKey.trim()||!t){this.releaseProvider();return}let n=y(e);if(this.lease?.client===t&&this.lease.cacheKey===n){(this.lease.session.sessionKey!==e.sessionKey||this.lease.session.agentId!==e.agentId)&&(this.lease.session={...e},this.requestUpdate()),this.lease.update(t,this.connected,{canPinWidgets:!1,canPinMcpApps:!1,canMutate:this.canMutate,canGrant:this.canGrant});return}this.releaseProvider(),this.expansionInitialized=!1,this.activeTabId=``;let r=x(e,t,this.connected,!1,!1,this.canMutate,this.canGrant);this.lease={...r,client:t,cacheKey:n,session:{...e}},this.provider=r.provider,this.unsubscribeSnapshot=r.provider.snapshot$.subscribe(()=>{this.reconcileSnapshot(r.provider),this.requestUpdate()}),this.reconcileSnapshot(r.provider),this.requestUpdate()}releaseProvider(){this.unsubscribeSnapshot?.(),this.unsubscribeSnapshot=null,this.lease?.release(),this.lease=null,this.provider=null}reconcileSnapshot(e){let t=e.snapshot$.value,n=t.tabs[0]?.tabId??``;t.tabs.some(e=>e.tabId===this.activeTabId)||(this.activeTabId=n),!this.expansionInitialized&&e.hasLoadedSnapshot&&(this.expansionInitialized=!0,this.expanded=b(t))}render(){let e=this.provider,t=e?.snapshot$.value,n=this.lease?.session,r=!!(t&&b(t)),a=e?{appViewGeneration:e.appViewGeneration,applyOps:t=>e.applyOps(t),grant:(t,n)=>e.grant(t,n),selectTab:e=>{this.activeTabId=e},frameLoadFailed:t=>e.refreshWidgetFrame(t),widgetAppView:(t,n)=>e.widgetAppView(t,n),refreshWidgetAppView:(t,n)=>e.refreshWidgetAppView(t,n)}:null;return c`
      <section class="plugin-session-dashboard">
        <button
          type="button"
          class="plugin-session-dashboard__toggle"
          aria-expanded=${this.expanded?`true`:`false`}
          @click=${()=>{this.expansionInitialized=!0,this.expanded=!this.expanded}}
        >
          <span class="plugin-session-dashboard__title">
            ${m.kanban}<span>${i(`pluginUi.dashboardTitle`)}</span>
          </span>
          <span class="plugin-session-dashboard__chevron" aria-hidden="true"
            >${m.arrowDown}</span
          >
        </button>
        <div class="plugin-session-dashboard__body" ?hidden=${!this.expanded}>
          ${this.viewError?c`<p role="alert">${this.viewError}</p>
                  <button
                    type="button"
                    @click=${()=>{this.viewLoad=null,this.viewError=null}}
                  >
                    ${i(`common.retry`)}
                  </button>`:r&&e&&t&&n&&a?c`
                    <testclaw-board-view
                      .active=${this.expanded&&this.presented}
                      .session=${n}
                      .snapshot=${t}
                      .activeTabId=${this.activeTabId}
                      .widgetFrameUrl=${(t,n)=>e.widgetFrameUrl(t,n)}
                      .callbacks=${a}
                      .sessions=${[]}
                      .canMutate=${this.canMutate}
                      .canGrant=${this.canGrant}
                    ></testclaw-board-view>
                  `:c`<p class="plugin-session-dashboard__empty">
                    ${i(`pluginUi.dashboardEmpty`)}
                  </p>`}
        </div>
        ${!this.expanded&&this.expansionInitialized&&!r?c`<p class="plugin-session-dashboard__collapsed-empty">
                ${i(`pluginUi.dashboardEmpty`)}
              </p>`:l}
      </section>
    `}},r([p({attribute:!1})],C.prototype,`session`,void 0),r([p({attribute:!1})],C.prototype,`client`,void 0),r([p({attribute:!1})],C.prototype,`connected`,void 0),r([p({attribute:!1})],C.prototype,`canMutate`,void 0),r([p({attribute:!1})],C.prototype,`canGrant`,void 0),r([p({attribute:!1})],C.prototype,`presented`,void 0),r([d()],C.prototype,`provider`,void 0),r([d()],C.prototype,`expanded`,void 0),r([d()],C.prototype,`activeTabId`,void 0),r([d()],C.prototype,`viewError`,void 0),customElements.get(`testclaw-plugin-session-dashboard`)||customElements.define(`testclaw-plugin-session-dashboard`,C)})))()}w();
//# sourceMappingURL=control-ui-dashboard-BH8njUX4.js.map