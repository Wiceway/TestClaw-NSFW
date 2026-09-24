import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,Kr as n,qr as r,ti as i}from"./control-ui-foundation-CGMdhB5v.js";import{$l as a,Bl as o,Hl as s,Jl as c,ac as l,ic as u}from"./control-ui-core-S9jKXqB5.js";import{$ as d,X as f,Y as p,b as m,ct as h,nt as g,ut as _,x as v}from"./lit-runtime-DWoPVI38.js";import{Di as y,Fi as b,Ii as x,Oi as S}from"./control-ui-core-G2U4O6rB.js";import{Q as C,Z as w}from"./control-ui-boot-shared-BGGpAWmX.js";import{i as T,r as E,t as D}from"./custodian-surface-BxF2qnaR.js";import{Dt as O,Et as k,Tt as A,t as j}from"./control-ui-boot-shared-7DNogyqm.js";import"./control-ui-boot-shared-VDjYq2Zh.js";import{L as M}from"./control-ui-boot-chat-oECFOvg2.js";var N;function P(){return(P=e((()=>{t(),p(),g(),m(),C(),S(),c(),s(),j(),M(),x(),N=class extends o{constructor(...e){super(...e),this.sessionKey=``,this.agentId=``,this.workContext={page:`chat`},this.includeContext=!0,this.selection=``,this.selectionAvailable=!1,this.selectionScope=``,this.updateSelectionAvailability=()=>{let e=window.getSelection();this.selectionAvailable=!(!e||e.isCollapsed||!e.anchorNode||this.contains(e.anchorNode))},this.attachSelection=e=>{e.preventDefault();let t=window.getSelection();!t||t.isCollapsed||t.anchorNode&&this.contains(t.anchorNode)||(this.selection=n(t.toString(),640),this.includeContext=!0)}}connectedCallback(){super.connectedCallback(),document.addEventListener(`selectionchange`,this.updateSelectionAvailability),this.updateSelectionAvailability()}disconnectedCallback(){document.removeEventListener(`selectionchange`,this.updateSelectionAvailability),super.disconnectedCallback()}willUpdate(){let e=this.workContext,t=JSON.stringify([this.context.gateway.connection.gatewayUrl,e.page,e.sessionKey,e.sessionId,e.agentId,e.file]);this.selectionScope&&this.selectionScope!==t&&(this.selection=``),this.selectionScope=t}render(){let e={...this.workContext,selection:this.selection||void 0},t=w(e),n=JSON.stringify([this.context.gateway.connection.gatewayUrl,this.agentId,this.sessionKey]);return d`
      <div class="assistant-panel-context">
        ${this.includeContext?d`
                <details>
                  <summary>
                    ${a(`assistantPanel.context`,{context:e.title||e.page})}
                  </summary>
                  <pre>${t}</pre>
                </details>
                <button
                  type="button"
                  class="rail-header__action"
                  aria-label=${a(`assistantPanel.removeContext`)}
                  @click=${()=>{this.includeContext=!1}}
                >
                  ${b.x}
                </button>
              `:d`<button
                type="button"
                class="btn btn--sm"
                @click=${()=>{this.includeContext=!0}}
              >
                ${a(`assistantPanel.includeContext`)}
              </button>`}
        <button
          type="button"
          class="rail-header__action"
          aria-label=${a(`assistantPanel.attachSelection`)}
          ?disabled=${!this.selectionAvailable}
          title=${a(`assistantPanel.attachSelection`)}
          @mousedown=${this.attachSelection}
          @click=${e=>{e.detail===0&&this.attachSelection(e)}}
        >
          ${b.messageSquare}
        </button>
        ${this.selection?d`<button
                type="button"
                class="btn btn--sm"
                aria-label=${a(`assistantPanel.removeSelection`)}
                @click=${()=>{this.selection=``}}
              >
                ${a(`assistantPanel.selection`)} ${b.x}
              </button>`:f}
      </div>
      ${v(n,d`<testclaw-chat-pane
          .paneId=${`home-dock:${n}`}
          .presentationId=${`home-dock:${n}`}
          .sessionKey=${this.sessionKey}
          .agentId=${this.agentId}
          .inputRegion=${`dock`}
          .active=${!0}
          .compact=${!0}
          .narrow=${!0}
          .workContext=${this.includeContext?e:void 0}
        ></testclaw-chat-pane>`)}
    `}},i([r({context:y,subscribe:!0})],N.prototype,`context`,void 0),i([_({attribute:!1})],N.prototype,`sessionKey`,void 0),i([_({attribute:!1})],N.prototype,`agentId`,void 0),i([_({attribute:!1})],N.prototype,`workContext`,void 0),i([h()],N.prototype,`includeContext`,void 0),i([h()],N.prototype,`selection`,void 0),i([h()],N.prototype,`selectionAvailable`,void 0),customElements.define(`testclaw-home-session`,N)})))()}var F;function I(){return(I=e((()=>{p(),g(),s(),l(),k(),T(),D(),P(),F=class extends o{constructor(){super(),this.active=!1,this.destination=`custodian`,this.sessionKey=``,this.agentId=``,this.pageRouteId=`chat`,this.pageSessionKey=``,this.pageAgentId=``,this.custodianVisible=!1,new u(this).watch(()=>this.store??E,(e,t)=>e.subscribe(t)).watch(()=>this.context,(e,t)=>O(e,t)).watch(()=>this.context?.sessions,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new CustomEvent(`assistant-custodian-store`,{detail:this.store??E,bubbles:!0}))}willUpdate(){let e=this.active&&this.destination===`custodian`;e&&!this.custodianVisible&&(this.store??E).refreshTranscriptIfIdle(),this.custodianVisible=e}render(){if(!this.active)return f;let e=this.store??E;return this.destination===`home`?d`<testclaw-home-session
          .sessionKey=${this.sessionKey}
          .agentId=${this.agentId}
          .workContext=${this.context?A(this.context,this.pageRouteId,this.pageSessionKey,this.pageAgentId):void 0}
        ></testclaw-home-session>`:d`<testclaw-custodian-surface
          .store=${e}
          .onboarding=${e.activeVariant===`onboarding`}
          .newAgentIntent=${e.activeVariant===`new-agent`}
          compact
        ></testclaw-custodian-surface>`}},i([_({type:Boolean})],F.prototype,`active`,void 0),i([_()],F.prototype,`destination`,void 0),i([_()],F.prototype,`sessionKey`,void 0),i([_()],F.prototype,`agentId`,void 0),i([_({attribute:!1})],F.prototype,`context`,void 0),i([_()],F.prototype,`pageRouteId`,void 0),i([_()],F.prototype,`pageSessionKey`,void 0),i([_()],F.prototype,`pageAgentId`,void 0),i([_({attribute:!1})],F.prototype,`store`,void 0),customElements.define(`testclaw-assistant-panel-content`,F)})))()}I();export{F as AssistantAssistantPanelContent};
//# sourceMappingURL=assistant-panel-content-DjsQQxeB.js.map