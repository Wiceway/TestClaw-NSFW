import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{Ac as i,Bl as a,Hl as o,Lc as s,Mc as c,Ml as l,Pl as u,Qc as d,ac as f,ic as p,pl as m}from"./control-ui-core-S9jKXqB5.js";import{$ as h,Y as g,nt as _,ut as v}from"./lit-runtime-DWoPVI38.js";import{Di as y,Oi as b}from"./control-ui-core-G2U4O6rB.js";import{as as x,is as S}from"./control-ui-boot-shared-ooxiG3qa.js";import{Va as C,za as w}from"./control-ui-boot-shared-CCYBAAP9.js";function T(e){return h`<testclaw-agent-row-chip .agentId=${e}></testclaw-agent-row-chip>`}var E;function D(){return(D=e((()=>{t(),g(),_(),b(),i(),l(),x(),d(),o(),f(),w(),E=class extends a{constructor(){super(),this.avatars=new S(this),new p(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}render(){let e=this.context?.agents.state.agentsList,t=this.agentId?.trim()||m({agentsList:e,hello:this.context?.gateway.snapshot.hello}),n=e?.agents.find(e=>e.id===t)??{id:t},r=this.context?.agentIdentity.get(t),i=c(n,r),a=i===t?`agent:${t}`:`${i} (agent:${t})`,o=u(n,r);return this.avatars.withActiveRoutes(()=>{let e=o?this.avatars.resolve(o):null;return h`<span
        class="agent-row-chip"
        data-agent-id=${t}
        role="img"
        aria-label=${a}
        title=${a}
      >
        ${C({id:t,avatar:e,textAvatar:s(n,r)},`agent-row-chip__avatar`)}
        <span class="agent-row-chip__name">${i}</span>
      </span>`})}},r([n({context:y,subscribe:!0}),v({attribute:!1})],E.prototype,`context`,void 0),r([v({attribute:!1})],E.prototype,`agentId`,void 0),customElements.get(`testclaw-agent-row-chip`)||customElements.define(`testclaw-agent-row-chip`,E)})))()}export{T as n,D as t};
//# sourceMappingURL=agent-row-chip-LzqZKgRH.js.map