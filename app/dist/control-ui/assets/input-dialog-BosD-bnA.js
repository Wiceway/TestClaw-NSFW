import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Bs as n,Jl as r,Rs as i}from"./control-ui-core-S9jKXqB5.js";import{$ as a,X as o,Y as s}from"./lit-runtime-DWoPVI38.js";import{Ut as c,Wt as l}from"./control-ui-core-G2U4O6rB.js";function u(e){return l({signal:e.signal,value:null},n=>{let{host:r,finish:s,render:c}=n,l=!1,u=null,d=t=>e.requireValue===!0?t.trim():t,f=t=>{let n=d(t);return e.requireValue===!0&&n.length===0||e.requireChange===!0&&n===(e.defaultValue??``)},p=f(e.defaultValue??``),m=()=>r.querySelector(`input[name="value"]`),h=e=>{let t=f(e.target.value);t!==p&&(p=t,y())};async function g(t){if(t.preventDefault(),l)return;let r=m()?.value;if(r===void 0||f(r))return;let a=d(r);if(!e.submit){s(a);return}l=!0,u=null,y();let o;try{o=await e.submit(a)}catch(e){o=i(e)}if(!n.settled){if(l=!1,o===null){s(a);return}u=o,y(),m()?.focus()}}function _(e){if(l){e.preventDefault();return}s(null)}let v=e.label??e.title;function y(){c(()=>a`
          <testclaw-modal-dialog
            label=${e.title}
            description=${v}
            @modal-cancel=${_}
          >
            <form class="exec-approval-card" @submit=${g}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <label class="field input-dialog__field">
                <span>${v}</span>
                <input
                  name="value"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  .value=${e.defaultValue??``}
                  ?disabled=${l}
                  aria-invalid=${u?`true`:o}
                  @input=${h}
                  autofocus
                />
              </label>
              ${u?a`<div class="exec-approval-error" role="alert">${u}</div>`:o}
              <div class="exec-approval-actions">
                <button type="submit" class="btn primary" ?disabled=${l||p}>
                  ${e.submitLabel??t(`common.save`)}
                </button>
                <button
                  type="button"
                  class="btn"
                  ?disabled=${l}
                  @click=${()=>s(null)}
                >
                  ${e.cancelLabel??t(`common.cancel`)}
                </button>
              </div>
            </form>
          </testclaw-modal-dialog>
        `)}y()})}function d(e){return f?Promise.resolve(null):(f=!0,u(e).finally(()=>{f=!1}))}var f;function p(){return(p=e((()=>{s(),r(),n(),c(),f=!1})))()}export{d as n,p as t};
//# sourceMappingURL=input-dialog-BosD-bnA.js.map