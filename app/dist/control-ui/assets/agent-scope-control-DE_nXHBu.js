import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ja as t}from"./control-ui-foundation-CGMdhB5v.js";import{$l as n,Ac as r,Jl as i,Mc as a,Qc as o,jc as s}from"./control-ui-core-S9jKXqB5.js";import{$ as c,X as l,Y as u}from"./lit-runtime-DWoPVI38.js";import{Fi as d,Ii as f}from"./control-ui-core-G2U4O6rB.js";import{mt as p}from"./control-ui-boot-new-DhInmp9T.js";function m(e){let r=e.selectedId??e.selection.state.scopeId??``,i=r?t(r):``,o=e.allowAll!==!1,u=n=>e.agents.some(e=>e.kind===`system`&&t(e.id)===n),f=s(e.agents);if(f.length<=1)return l;let p=new Map(f.map(e=>{let n=t(e.id);return[n,n===e.id?e:{...e,id:n}]}));for(let n of e.additionalAgentIds??[]){if(!n.trim())continue;let e=t(n);!u(e)&&!p.has(e)&&p.set(e,{id:e})}i&&!u(i)&&!p.has(i)&&p.set(i,{id:i});let m=[...p.values()].toSorted((e,t)=>a(e).localeCompare(a(t))),h=u(i)?o?``:m[0]?.id??``:i,g=[...o?[{value:``,label:n(`agentScope.allAgents`),icon:d.users}]:[],...m.map(e=>({value:e.id,label:a(e),agent:e}))];return c`
    <div class="agent-scope-control">
      <testclaw-agent-select
        .options=${g}
        .value=${h}
        .accessibleLabel=${n(`agentScope.label`)}
        .menuLabel=${n(`agentScope.label`)}
        .onSelect=${t=>o?e.selection.setScope(t||null):e.selection.set(t||null)}
      ></testclaw-agent-select>
    </div>
  `}function h(){return(h=e((()=>{u(),i(),r(),o(),p(),f()})))()}export{m as n,h as t};
//# sourceMappingURL=agent-scope-control-DE_nXHBu.js.map