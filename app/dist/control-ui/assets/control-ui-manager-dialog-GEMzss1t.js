import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Hl as a,Jl as o,ac as s,ic as c,zl as l}from"./control-ui-core-S9jKXqB5.js";import{$ as u,X as d,Y as f,ct as p,nt as m,ut as h}from"./lit-runtime-DWoPVI38.js";import{Di as g,Fr as _,Oi as v}from"./control-ui-core-G2U4O6rB.js";import{n as y,t as b}from"./control-ui-disabled-P0AuytQi.js";var x;function S(){return(S=e((()=>{t(),f(),m(),v(),o(),a(),s(),b(),_(),x=class extends l{constructor(){super(),this.open=!1,this.reloading=!1,this.reloadError=``,this.close=()=>this.dispatchEvent(new Event(`modal-cancel`,{bubbles:!0,composed:!0})),new c(this).watch(()=>this.runtime,(e,t)=>e.subscribe(t))}render(){let e=this.runtime;if(!this.open||!e)return d;let t=e.registrations(`replacements`),n=[...new Set(t.map(e=>e.value.surface))];return u`<testclaw-modal-dialog .label=${i(`pluginUi.customize`)}>
      <section class="card">
        <h2>${i(`pluginUi.customize`)}</h2>
        <p>${i(`pluginUi.selectionScope`)}</p>
        ${n.map(n=>u`<label class="field"
            ><span>${i(`pluginUi.surface.${n}`)}</span>
            <select
              @change=${t=>e.selectReplacement(n,t.target.value||null)}
            >
              <option value="" .selected=${!e.selectedReplacement(n)}>
                ${i(`pluginUi.builtin`)}
              </option>
              ${t.filter(e=>e.value.surface===n).map(t=>u`<option
                      value=${t.key}
                      .selected=${e.selectedReplacement(n)?.key===t.key}
                    >
                      ${t.value.label} (${t.pluginId})
                    </option>`)}
            </select></label
          >`)}
        ${e.errors.map(e=>{let t=y(this.context,e.pluginId,this.close);return t?u`<section role="status"><strong>${e.pluginId}</strong>${t}</section>`:u`<p role="alert"><strong>${e.pluginId}</strong>: ${e.message}</p>`})}
        ${this.reloadError?u`<p role="alert">${this.reloadError}</p>`:d}
        ${e.canReload?u`<button
                class="btn"
                ?disabled=${this.reloading}
                @click=${async()=>{this.reloading=!0,this.reloadError=``;try{await e.reload()}catch(e){this.reloadError=e instanceof Error?e.message:String(e)}finally{this.reloading=!1}}}
              >
                ${i(`pluginUi.reload`)}
              </button>`:d}
        <button class="btn" @click=${()=>void e.refresh()}>${i(`common.retry`)}</button>
        <button class="btn" @click=${this.close}>${i(`common.close`)}</button>
      </section>
    </testclaw-modal-dialog>`}},r([n({context:g,subscribe:!0})],x.prototype,`context`,void 0),r([h({attribute:!1})],x.prototype,`runtime`,void 0),r([h({type:Boolean})],x.prototype,`open`,void 0),r([p()],x.prototype,`reloading`,void 0),r([p()],x.prototype,`reloadError`,void 0),customElements.get(`testclaw-plugin-manager-dialog`)||customElements.define(`testclaw-plugin-manager-dialog`,x)})))()}S();
//# sourceMappingURL=control-ui-manager-dialog-GEMzss1t.js.map