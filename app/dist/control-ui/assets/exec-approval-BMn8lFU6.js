import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ti as t}from"./control-ui-foundation-CGMdhB5v.js";import{$l as n,Hl as r,Jl as i,Ps as a,ks as o,zl as s}from"./control-ui-core-S9jKXqB5.js";import{$ as c,X as l,Y as u,at as d,ct as f,nt as p,ut as m}from"./lit-runtime-DWoPVI38.js";import{Fr as h}from"./control-ui-core-G2U4O6rB.js";import{On as g}from"./control-ui-boot-shared-ooxiG3qa.js";import{C as _,S as v,b as y,mi as b,pi as x,w as S,x as C}from"./control-ui-boot-shared-CCYBAAP9.js";function w(e){let t=e.queue.filter(t=>t.id!==e.activeId);return t.length===0?l:c`
    <div class="exec-approval-list" aria-label=${n(`execApproval.otherPending`)}>
      <div class="exec-approval-list__heading">${n(`execApproval.otherPending`)}</div>
      ${t.map(t=>{let r=x(t.request.command),i=t.request.agentId?.trim()||`—`;return c`
          <button
            class="exec-approval-list__item"
            type="button"
            aria-label=${n(`execApproval.reviewRequest`,{agent:i,command:r})}
            @click=${()=>e.onSelect(t.id)}
          >
            <span class="exec-approval-list__agent">${i}</span>
            <span class="exec-approval-list__command mono">${r}</span>
            <testclaw-approval-countdown
              class="exec-approval-list__expiry"
              aria-hidden="true"
              .expiresAtMs=${t.expiresAtMs}
              .compact=${!0}
            ></testclaw-approval-countdown>
          </button>
        `})}
    </div>
  `}function T(e){return e.composedPath().some(e=>e instanceof Element&&e.closest(`input, textarea, [contenteditable]:not([contenteditable='false'])`)!==null)}function E(e){return T(e)?null:a(o.approveAlways,e)?`allow-always`:a(o.modifiedEnter,e)?`allow-once`:a(o.denyApproval,e)?`deny`:null}var D;function O(){return(O=e((()=>{u(),p(),b(),i(),g(),r(),v(),h(),D=class extends s{constructor(...e){super(...e),this.selectedApprovalId=null,this.explicitlyOpen=!1}show(){this.props?.queue.length&&(this.explicitlyOpen=!0,this.updateComplete.then(()=>this.dialog?.show()))}get dialogOpen(){return this.explicitlyOpen&&(this.props?.queue.length??0)>0}handleKeydown(e,t){if(e.defaultPrevented||e.repeat||this.props?.busy||!this.props?.canGrant)return;let n=E(e);n&&S(t).includes(n)&&(e.preventDefault(),this.props?.onDecision(t.id,n))}willUpdate(e){if(e.get(`props`)?.queue.length&&!this.props?.queue.length){this.explicitlyOpen=!1,this.selectedApprovalId=null;return}let t=this.props?.queue??[];t.some(e=>e.id===this.selectedApprovalId)||(this.selectedApprovalId=t.at(0)?.id??null)}render(){let e=this.props,t=e?.queue??[],n=t.find(e=>e.id===this.selectedApprovalId)??t.at(0);return!e||!this.explicitlyOpen||!n?l:c`
      <testclaw-modal-dialog
        label=${C(n)}
        description=${y(n.expiresAtMs,Date.now())}
        @keydown=${e=>this.handleKeydown(e,n)}
        @modal-cancel=${t=>{if(e.busy){t.preventDefault();return}this.explicitlyOpen=!1}}
      >
        <div class="exec-approval-modal-stack">
          ${_({approval:n,busy:e.busy,canGrant:e.canGrant,error:e.errors.get(n.id)??null,variant:`modal`,queueCount:t.length,onDecision:e.onDecision})}
          ${w({queue:t,activeId:n.id,onSelect:e=>{this.selectedApprovalId=e}})}
        </div>
      </testclaw-modal-dialog>
    `}},t([m({attribute:!1})],D.prototype,`props`,void 0),t([d(`testclaw-modal-dialog`)],D.prototype,`dialog`,void 0),t([f()],D.prototype,`selectedApprovalId`,void 0),t([f()],D.prototype,`explicitlyOpen`,void 0),customElements.get(`testclaw-exec-approval`)||customElements.define(`testclaw-exec-approval`,D)})))()}O();
//# sourceMappingURL=exec-approval-BMn8lFU6.js.map