import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Jl as n,vi as r}from"./control-ui-core-S9jKXqB5.js";import{$ as i,Y as a}from"./lit-runtime-DWoPVI38.js";import{Oa as o,ba as s}from"./control-ui-core-G2U4O6rB.js";function c(e,n,a){if(e?.plugins?.errors.some(e=>e.pluginId===n&&e.code===`custom-plugin-ui-disabled`))return i`<div class="card-title">${t(`pluginUi.customPluginsDisabled`)}</div>
    <p class="card-sub">${t(`pluginUi.customPluginsEnableHint`)}</p>
    <a
      class="btn btn--sm"
      href=${o(`labs`,e.basePath)}
      @click=${t=>{r(t)&&(t.preventDefault(),a?.(),e.navigate(`labs`))}}
      >${t(`pluginUi.openLabs`)}</a
    >`}function l(){return(l=e((()=>{a(),s(),n()})))()}export{c as n,l as t};
//# sourceMappingURL=control-ui-disabled-P0AuytQi.js.map