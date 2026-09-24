import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ti as t}from"./control-ui-foundation-CGMdhB5v.js";import{$l as n,As as r,Hl as i,Jl as a,Ms as o,ks as s,zl as c}from"./control-ui-core-S9jKXqB5.js";import{$ as l,X as u,Y as d,nt as f,ut as p}from"./lit-runtime-DWoPVI38.js";import{Fi as m,Ha as h,Ii as g,Ni as _,Wa as v}from"./control-ui-core-G2U4O6rB.js";var y;function b(){return(b=e((()=>{d(),f(),v(),a(),o(),i(),g(),_(),y=class extends c{constructor(...e){super(...e),this.navCollapsed=!1,this.historyOnly=!1,this.canGoBack=!1,this.canGoForward=!1}render(){let e=this.navCollapsed?n(`nav.expand`):n(`nav.collapse`);return l`
      <nav class="macos-titlebar-controls" @mousedown=${h}>
        ${this.historyOnly?u:this.renderButton({label:e,icon:this.navCollapsed?m.panelLeftOpen:m.panelLeftClose,ariaExpanded:!this.navCollapsed,onClick:this.onToggleSidebar,className:`macos-titlebar-controls__sidebar-toggle`})}
        ${this.renderButton({label:n(`nav.back`),icon:m.chevronLeft,disabled:!this.canGoBack,onClick:()=>globalThis.history.back(),className:`macos-titlebar-controls__back`})}
        ${this.renderButton({label:n(`nav.forward`),icon:m.chevronRight,disabled:!this.canGoForward,onClick:()=>globalThis.history.forward(),className:`macos-titlebar-controls__forward`})}
        ${this.historyOnly?u:l`
                ${this.renderButton({label:n(`chat.openCommandPalette`),tooltip:n(`chat.commandPaletteTitle`),icon:m.search,onClick:this.onOpenPalette,className:`macos-titlebar-controls__search`})}
                ${this.navCollapsed?this.renderButton({label:n(`chat.runControls.newSession`),tooltip:this.newSessionDisabledReason??`${n(`chat.runControls.newSession`)} (${r(s.newSession)})`,icon:m.plus,disabled:!!this.newSessionDisabledReason,onClick:this.onOpenNewSession,className:`macos-titlebar-controls__new-session`}):u}
              `}
      </nav>
    `}renderButton(e){return l`
      <testclaw-tooltip .content=${e.tooltip??e.label}>
        <button
          type="button"
          class="topbar-icon-btn macos-titlebar-controls__button ${e.className}"
          aria-label=${e.label}
          aria-expanded=${e.ariaExpanded===void 0?u:String(e.ariaExpanded)}
          ?disabled=${e.disabled||!e.onClick}
          @click=${e.onClick}
        >
          ${e.icon}
        </button>
      </testclaw-tooltip>
    `}},t([p({attribute:!1})],y.prototype,`navCollapsed`,void 0),t([p({attribute:!1})],y.prototype,`historyOnly`,void 0),t([p({attribute:!1})],y.prototype,`canGoBack`,void 0),t([p({attribute:!1})],y.prototype,`canGoForward`,void 0),t([p({attribute:!1})],y.prototype,`newSessionDisabledReason`,void 0),t([p({attribute:!1})],y.prototype,`onToggleSidebar`,void 0),t([p({attribute:!1})],y.prototype,`onOpenPalette`,void 0),t([p({attribute:!1})],y.prototype,`onOpenNewSession`,void 0),customElements.get(`testclaw-macos-titlebar-controls`)||customElements.define(`testclaw-macos-titlebar-controls`,y)})))()}b();
//# sourceMappingURL=macos-titlebar-controls.runtime-DyrQYvnf.js.map