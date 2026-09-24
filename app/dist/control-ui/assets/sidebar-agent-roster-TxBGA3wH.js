import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ti as t}from"./control-ui-foundation-CGMdhB5v.js";import{$l as n,Jl as r,Qc as i,Vt as a,qc as o,vi as s}from"./control-ui-core-S9jKXqB5.js";import{$ as c,X as l,Y as u,c as d,ct as f,nt as p,s as m,ut as h}from"./lit-runtime-DWoPVI38.js";import{$t as g,Fi as _,Ii as v,Oa as y,Sa as b,ba as x,ln as S,n as C,r as w,tn as T}from"./control-ui-core-G2U4O6rB.js";import{Ci as E,Ei as D,Si as O,Ti as k,Va as A,bi as j,xi as M,yi as N,za as P}from"./control-ui-boot-shared-CCYBAAP9.js";import{a as F,i as I,n as L,o as R,r as z,t as B}from"./roster-element-DmMXoJpo.js";function V(e,t){return c`<testclaw-sidebar-new-session-menu
    .host=${e}
    .active=${e.navigationVisible}
    .triggerClass=${t}
  ></testclaw-sidebar-new-session-menu>`}function H(e,t){return c`<testclaw-sidebar-agent-roster
    .host=${e}
    .active=${e.navigationVisible}
    .sections=${t}
    .involvingMe=${e.sessionInvolvingMeFilterActive}
  ></testclaw-sidebar-agent-roster>`}var U,W;function G(){return(G=e((()=>{u(),p(),m(),x(),g(),r(),F(),z(),L(),i(),N(),O(),v(),P(),C(),k(),R(),U=class extends B{constructor(...e){super(...e),this.sections=[],this.involvingMe=!1,this.collapsed=new Set,this.settingsScope=null,this.published=null}willUpdate(){let e=this.context.gateway.connection.gatewayUrl;this.settingsScope!==e&&(this.settingsScope=e,this.collapsed=new Set(T(e).sidebarCollapsedAgentIds??[]));let t=I(this.context);t.setInvolvingMe(this.involvingMe);let n=t.snapshot;(this.published?.snapshot!==n||this.published.collapsed!==this.collapsed)&&(this.published={snapshot:n,collapsed:this.collapsed},this.host.rosterSessionSource={result:n.result,agentIds:n.cards.map(e=>e.id),collapsedAgentIds:this.collapsed})}disconnectedCallback(){this.host.rosterSessionSource=null,I(this.context).setInvolvingMe(!1),super.disconnectedCallback()}toggleAgent(e){let t=new Set(this.collapsed);t.delete(e)||t.add(e),this.setCollapsedAgents(t)}setCollapsedAgents(e){S({gatewayUrl:this.context.gateway.connection.gatewayUrl,sidebarCollapsedAgentIds:[...e]},{selectGateway:!1}),this.collapsed=e}render(){return this.avatars.withActiveRoutes(()=>{let e=this.cards(),t=this.roster.error??this.roster.subscriptionError,r=this.host.readNewSessionAccess();return j(this.host,c`<div class="sidebar-agent-roster">
          ${t?c`<button class="sidebar-agent-roster__link" @click=${()=>void this.refresh()}>${n(`agentsHome.loadFailed`)}</button>`:l}
          ${this.roster.loading&&e.length===0?c`<span role="status" aria-label=${n(`common.loading`)} class="skeleton skeleton-line"></span>`:l}
          ${d(e,e=>e.id,t=>{let i=this.collapsed.has(t.id),a=this.sections.filter(e=>e.id.startsWith(`agent:${t.id}:`)),u=this.host.selectedAgentMainSessionKey(t.id),d=this.host.mainSessionRow(t.id),f=d?this.host.projectHomeSession(d,t.id):null,p=f?.childLoadParentKeys?.length?f.childLoadParentKeys:[d?.key??u],m=b(this.host.activeRouteId)&&o(this.host.getRouteSessionKey(),u),h=[...f?[f]:[],...i?a.flatMap(e=>e.rows):[]];return c`<section
                class="sidebar-agent-roster__group"
                data-agent-group=${t.id}
                aria-label=${t.name}
              >
                <div class="sidebar-agent-roster__header">
                  <button
                    type="button"
                    class="sidebar-agent-roster__action sidebar-agent-roster__chevron"
                    data-agent-collapse=${t.id}
                    aria-label=${n(i?`agentsHome.expandAgent`:`agentsHome.collapseAgent`,{agent:t.name})}
                    aria-expanded=${String(!i)}
                    @click=${()=>this.toggleAgent(t.id)}
                  >
                    <span class="sidebar-agent-roster__chevron" aria-hidden="true"
                      >${i?_.chevronRight:_.chevronDown}</span
                    >
                  </button>
                  <a
                    class="sidebar-agent-roster__row"
                    data-agent-id=${t.id}
                    href=${t.target.href}
                    aria-current=${m?`page`:l}
                    title=${n(`agentsHome.openChat`)}
                    @click=${e=>{s(e)&&(e.preventDefault(),this.host.openMainSession(t.id))}}
                  >
                    <span class="sidebar-agent-roster__avatar" aria-hidden="true">
                      ${A(t)}
                    </span>
                    <span class="sidebar-agent-roster__copy"><span>${t.name}</span></span>
                  </a>
                  <span class="sidebar-agent-roster__signals">
                    ${h.length>0?D(h,i,i?a.reduce((e,t)=>e+t.rows.length,0):0,h.reduce((e,t)=>e+(t.workspaceConflictCount??0),0)):l}
                  </span>
                  <span
                    class="sidebar-agent-roster__actions"
                    @keydown=${e=>{e.key===` `&&e.target instanceof HTMLAnchorElement&&(e.preventDefault(),e.target.click())}}
                  >
                    ${w({basePath:this.host.basePath,agentId:t.id,className:`sidebar-agent-roster__action sidebar-agent-roster__new`,label:`${n(`agentChip.newConversation`)}: ${t.name}`,disabledReason:r.allowed?void 0:r.reason,onOpen:(e,t)=>this.host.requestOpenNewSession(e,t)})}
                    <wa-dropdown
                      placement="bottom-end"
                      @wa-show=${()=>this.host.dismissTransientMenus()}
                      @wa-select=${n=>{switch(n.detail.item.value){case`main`:this.host.openMainSession(t.id);break;case`sessions`:this.context.agentSelection.setScope(t.id),this.host.onNavigate?.(`sessions`);break;case`collapse-others`:this.setCollapsedAgents(new Set(e.filter(e=>e.id!==t.id).map(e=>e.id)))}}}
                    >
                      <button
                        slot="trigger"
                        type="button"
                        class="sidebar-agent-roster__action"
                        aria-label=${n(`agentsHome.agentOptions`,{agent:t.name})}
                      >
                        ${_.moreHorizontal}
                      </button>
                      <wa-dropdown-item value="main"
                        >${n(`agentsHome.openMainChat`)}</wa-dropdown-item
                      >
                      <wa-dropdown-item value="sessions"
                        >${n(`agentsHome.allSessions`)}</wa-dropdown-item
                      >
                      <wa-dropdown-item value="collapse-others"
                        >${n(`agentsHome.collapseOthers`)}</wa-dropdown-item
                      >
                    </wa-dropdown>
                  </span>
                </div>
                ${i?l:c`${p.map(e=>E(this.host,e))}
                      ${a.map(e=>M({host:this.host,section:e,personHeaders:void 0}))}`}
              </section>`})}
        </div>`)})}},t([h({attribute:!1})],U.prototype,`host`,void 0),t([h({attribute:!1})],U.prototype,`sections`,void 0),t([h({attribute:!1})],U.prototype,`involvingMe`,void 0),t([f()],U.prototype,`collapsed`,void 0),customElements.define(`testclaw-sidebar-agent-roster`,U),W=class extends B{constructor(...e){super(...e),this.triggerClass=``}render(){return this.avatars.withActiveRoutes(()=>{let e=this.host.readNewSessionAccess(),t=this.cards();return c`<wa-dropdown
        class="sidebar-new-session-menu"
        placement="bottom-end"
        aria-label=${n(`agentChip.agents`)}
        @wa-show=${()=>this.host.dismissTransientMenus()}
        @wa-select=${n=>{let r=n.detail.item;if(n.preventDefault(),r.dataset.nativeNavigation){delete r.dataset.nativeNavigation;return}let i=r.value;if(e.allowed&&i&&t.some(e=>e.id===i)){let e=this.querySelector(`wa-dropdown`);e&&(e.open=!1),this.host.requestOpenNewSession(i)}}}
      >
        <button
          slot="trigger"
          type="button"
          class=${this.triggerClass}
          aria-label=${n(`agentChip.newConversation`)}
          title=${e.allowed?n(`agentChip.newConversation`):e.reason}
          ?disabled=${!e.allowed||t.length===0}
        >
          ${_.plus}
        </button>
        ${t.map(e=>c`<wa-dropdown-item
            value=${e.id}
            @click=${e=>{s(e)?e.preventDefault():e.currentTarget instanceof HTMLElement&&(e.currentTarget.dataset.nativeNavigation=`true`)}}
            ><a
              class="sidebar-agent-roster__link"
              href=${`${y(`new-session`,this.host.basePath)}${a(e.id)}`}
              tabindex="-1"
              ><span class="sidebar-agent-roster__avatar" aria-hidden="true">
                ${A(e)} </span
              ><span>${e.name}</span></a
            >
          </wa-dropdown-item>`)}
      </wa-dropdown>`})}},t([h({attribute:!1})],W.prototype,`host`,void 0),t([h({attribute:!1})],W.prototype,`triggerClass`,void 0),customElements.define(`testclaw-sidebar-new-session-menu`,W)})))()}G();export{H as renderSidebarAgentRoster,V as renderSidebarNewSessionMenu};
//# sourceMappingURL=sidebar-agent-roster-TxBGA3wH.js.map