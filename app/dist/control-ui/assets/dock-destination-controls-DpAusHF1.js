import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,X as n,Y as r}from"./lit-runtime-DWoPVI38.js";import{Ni as i}from"./control-ui-core-G2U4O6rB.js";function a(e){let r=e.destinations.filter(t=>t.dock!==e.current);return r.length===0?n:t`<span class=${e.groupClass} role="group" aria-label=${e.groupLabel}>
    ${r.map(n=>t`<testclaw-tooltip .content=${n.label}>
        <button
          class=${`rail-header__action ${n.className??``}`}
          type="button"
          aria-label=${n.label}
          @click=${()=>e.onSelect(n.dock)}
        >
          ${n.icon}
        </button>
      </testclaw-tooltip>`)}
  </span>`}function o(){return(o=e((()=>{r(),i()})))()}export{a as n,o as t};
//# sourceMappingURL=dock-destination-controls-DpAusHF1.js.map