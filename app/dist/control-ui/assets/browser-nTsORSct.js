import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Hi as t,Jr as n,qr as r,ti as i}from"./control-ui-foundation-CGMdhB5v.js";import{$l as a,Bl as o,Bs as s,Hl as c,Jl as l,Rs as u,ac as d,ic as f}from"./control-ui-core-S9jKXqB5.js";import{$ as p,X as m,Y as h,ct as g,nt as _,ut as v}from"./lit-runtime-DWoPVI38.js";import{Di as y,It as b,Oi as x,it as S,rt as C,zt as w}from"./control-ui-core-G2U4O6rB.js";import{Fr as T,Pr as E}from"./control-ui-boot-shared-ooxiG3qa.js";import{Cn as D,Fn as O,M as k,k as A}from"./control-ui-boot-shared-CCYBAAP9.js";import{t as j}from"./browser-panel-BIkIr1cs.js";var M;function N(){return(N=e((()=>{n(),h(),_(),x(),b(),C(),A(),D(),j(),l(),E(),c(),d(),s(),T(),M=class extends o{constructor(){super(),this.session={sessionKey:``},this.active=!0,this.pending=!1,this.generation=0,this.refreshNeeded=!1,new f(this).watch(()=>this.context?.gateway,(e,n)=>{let r=e.subscribe(n),i=e.subscribeEvents(e=>{let n=t(e.payload);e.event===`plugin.browser.dashboard_changed`&&n?.instanceId===this.widget?.instanceId&&n?.name===this.widget?.name&&(this.refreshNeeded=!0,this.active&&this.request(`inspect`))});return()=>{r(),i()}})}willUpdate(){let e=this.context?.gateway.snapshot.client??null,t=JSON.stringify([this.session,this.widget?.instanceId,this.widget?.name,this.widget?.props]);(this.scope?.key!==t||this.scope.client!==e)&&(this.scope={key:t,client:e},this.generation+=1,this.dashboard=void 0,this.error=void 0,this.pending=!1,this.refreshNeeded=!1),this.active&&this.available&&!this.pending&&!this.error&&(this.refreshNeeded?this.request(`inspect`):(!this.dashboard||!this.dashboard.paused&&!this.dashboard.browserTab)&&this.request(`open`))}disconnectedCallback(){this.generation+=1,this.scope=void 0,super.disconnectedCallback()}get available(){return!!(this.context&&S(this.context.gateway.snapshot))}async request(e){let t=this.context?.gateway.snapshot.client,n=this.widget?.instanceId;if(!t||!this.available||!this.widget||this.pending)return;if(!n){this.error=Error(a(`browser.dashboardMissingIdentity`));return}let r=++this.generation;e===`inspect`&&(this.refreshNeeded=!1),this.pending=!0,this.error=void 0;try{let i=await O(t,{...this.session,name:this.widget.name,instanceId:n},e);this.isConnected&&r===this.generation&&t===this.scope?.client&&(this.dashboard=i)}catch(e){this.isConnected&&r===this.generation&&(this.error=e)}finally{this.isConnected&&r===this.generation&&(this.pending=!1,this.refreshNeeded&&this.active&&this.request(`inspect`))}}render(){let e=this.context?.gateway,t=this.dashboard;return!this.active&&!t?m:!e||!this.available?p`<p class="board-browser__notice">${a(`browser.dashboardUnavailable`)}</p>`:p`<div class="board-browser" data-chat-autotype-exempt>
      <div class="board-browser__content">
        ${t?.browserTab&&!t.paused?p`<testclaw-browser-panel
                embedded
                .client=${e.snapshot.client}
                .available=${this.available}
                .remoteAvailable=${this.available}
                .presented=${this.active}
                .sessionKey=${t.sessionKey}
                .fixedTab=${t.browserTab}
                .dashboardTarget=${{...this.session,name:t.name,instanceId:t.instanceId}}
                .resourceBasePath=${this.context?.resourceBasePath??``}
                .authToken=${w({hello:e.snapshot.hello,password:e.connection.password,settings:{token:e.connection.token}})}
              ></testclaw-browser-panel>`:this.error?k(this.error,()=>void this.request(`open`)):p` <p class="board-browser__notice" role="status">
                  ${a(t?.stopping?`browser.dashboardStopping`:t?.paused?`browser.dashboardStopped`:`browser.loading`)}
                </p>`}
      </div>
      <div class="board-browser__footer">
        <span>${a(`browser.dashboardShared`)}</span>
        <div>
          <button
            type="button"
            class="btn btn--small"
            ?disabled=${this.pending}
            @click=${()=>void this.request(t?.stopping?`stop`:t?.paused?`resume`:`open`)}
          >
            ${a(t?.stopping?`browser.dashboardRetryStop`:t?.paused?`browser.dashboardResume`:`browser.dashboardReconnect`)}
          </button>
          ${t?.browserTab&&!t.paused?p`<button
                  type="button"
                  class="btn btn--small"
                  ?disabled=${this.pending}
                  @click=${()=>void this.request(`stop`)}
                >
                  ${a(`browser.dashboardStop`)}
                </button>`:m}
        </div>
      </div>
      ${this.error&&t?.browserTab?p`<p role="alert" class="board-browser__error">${u(this.error)}</p>`:m}
    </div>`}},i([r({context:y,subscribe:!0})],M.prototype,`context`,void 0),i([v({attribute:!1})],M.prototype,`widget`,void 0),i([v({attribute:!1})],M.prototype,`session`,void 0),i([v({type:Boolean})],M.prototype,`active`,void 0),i([g()],M.prototype,`dashboard`,void 0),i([g()],M.prototype,`error`,void 0),i([g()],M.prototype,`pending`,void 0),customElements.get(`testclaw-browser-dashboard-widget`)||customElements.define(`testclaw-browser-dashboard-widget`,M)})))()}N();
//# sourceMappingURL=browser-nTsORSct.js.map