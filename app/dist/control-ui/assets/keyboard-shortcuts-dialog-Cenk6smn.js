import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ti as t}from"./control-ui-foundation-CGMdhB5v.js";import{$l as n,Hl as r,Jl as i,Ps as a,Vl as o,Xn as s,Yn as c,js as l,ks as u}from"./control-ui-core-S9jKXqB5.js";import{$ as d,X as f,Y as p,ct as m,mt as h,nt as g,ut as _}from"./lit-runtime-DWoPVI38.js";import{A as v,Fr as y,k as b}from"./control-ui-core-G2U4O6rB.js";import{On as x,kn as S}from"./control-ui-boot-shared-ooxiG3qa.js";var C;function w(){return(w=e((()=>{p(),g(),b(),i(),x(),c(),r(),y(),C=class extends o{constructor(...e){super(...e),this.sendShortcut=`enter`,this.open=!1,this.handleKeydown=async e=>{let t=e.currentTarget,n=document.testClawModalLayers;if(e.defaultPrevented||e.repeat||!this.open||!(t instanceof HTMLElement)||n?.size!==1||!n.has(t))return;let r=this.newSessionHost,i=r?.context,o=a(u.newSession,e)&&r&&!r.onboardingMode&&s(i?.gateway.snapshot,{method:`sessions.create`,params:{}}).allowed;(o||a(u.keyboardShortcuts,e))&&(e.preventDefault(),e.stopPropagation(),this.open=!1,await this.updateComplete,this.isConnected&&!this.open&&o&&r.isConnected&&r.context===i&&v(r,`shortcut`))}}static{this.styles=h`
    :host {
      display: contents;
      --testclaw-modal-width: 560px;
    }

    .dialog {
      display: flex;
      max-height: min(720px, calc(100dvh - 64px));
      flex-direction: column;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
      color: var(--text);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 22px 16px;
      border-bottom: 1px solid var(--border);
    }

    h2 {
      margin: 0;
      color: var(--text-strong);
      font-size: 16px;
      font-weight: 600;
    }

    .close {
      display: grid;
      width: 28px;
      height: 28px;
      place-items: center;
      border: 0;
      border-radius: 6px;
      background: transparent;
      color: var(--muted);
      font-size: 20px;
    }

    .close:hover {
      background: var(--bg-hover);
      color: var(--text);
    }

    .body {
      overflow: auto;
      padding: 8px 22px 18px;
    }

    section + section {
      margin-top: 12px;
      border-top: 1px solid var(--border);
    }

    h3 {
      margin: 18px 0 8px;
      color: var(--muted);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .shortcut-row {
      display: flex;
      min-height: 34px;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      font-size: 13px;
    }

    .combos {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .combo {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    kbd {
      min-width: 22px;
      padding: 3px 6px;
      border: 1px solid var(--border-strong);
      border-radius: 5px;
      background: var(--bg-muted);
      color: var(--text);
      font: inherit;
      font-size: 12px;
      text-align: center;
    }
  `}get isOpen(){return this.open}toggle(){this.open=!this.open}render(){if(!this.open)return f;let e=e=>{e.preventDefault(),this.open=!1};return d`
      <testclaw-modal-dialog
        label=${n(`shortcutsOverlay.title`)}
        @modal-cancel=${e}
        @keydown=${this.handleKeydown}
      >
        <div class="dialog">
          <header class="header">
            <h2>${n(`shortcutsOverlay.title`)}</h2>
            <button class="close" type="button" aria-label=${n(`common.close`)} @click=${e}>
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <div class="body">
            ${S(this.sendShortcut).map(e=>d`
                <section>
                  <h3>${n(e.label)}</h3>
                  ${e.entries.map(e=>d`
                      <div class="shortcut-row">
                        <span>${n(e.label)}</span>
                        <span class="combos">
                          ${e.combos.map(e=>d`
                              <span class="combo">
                                ${l(e).map(e=>d`<kbd>${e}</kbd>`)}
                              </span>
                            `)}
                        </span>
                      </div>
                    `)}
                </section>
              `)}
          </div>
        </div>
      </testclaw-modal-dialog>
    `}},t([_({attribute:!1})],C.prototype,`sendShortcut`,void 0),t([_({attribute:!1})],C.prototype,`newSessionHost`,void 0),t([m()],C.prototype,`open`,void 0),customElements.get(`testclaw-keyboard-shortcuts-dialog`)||customElements.define(`testclaw-keyboard-shortcuts-dialog`,C)})))()}w();
//# sourceMappingURL=keyboard-shortcuts-dialog-Cenk6smn.js.map