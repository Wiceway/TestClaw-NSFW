import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,ja as n,qr as r,ti as i}from"./control-ui-foundation-CGMdhB5v.js";import{$l as a,Bl as o,Cc as s,Hl as c,Jl as l,Qc as u,ac as d,bc as f,fi as p,ic as m,pi as h,xc as g}from"./control-ui-core-S9jKXqB5.js";import{$ as _,X as v,Y as y,b,nt as x,ut as S,x as C}from"./lit-runtime-DWoPVI38.js";import{Ba as w,Di as T,Fi as E,Ia as D,Ii as O,Oi as k,ba as A,ma as j}from"./control-ui-core-G2U4O6rB.js";import{B as M,z as N}from"./control-ui-boot-shared-CCYBAAP9.js";import{t as P}from"./terminal-panel-registration-DE_BbB6G.js";function F(e,t=``){let n=D(e,j),r=w(n.pathname,t);if(r)return{sessionId:r};let i=g(n.search);return i?{catalog:i}:null}function I(){return(I=e((()=>{A(),s()})))()}var L;function R(){return(R=e((()=>{t(),y(),x(),b(),k(),O(),N(),P(),l(),s(),u(),p(),c(),d(),I(),L=class extends o{constructor(){super(),this.location=null,new m(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t)).watch(()=>this.context?.config,(e,t)=>e.subscribe(t)).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t)).watch(()=>this.context?.agentSelection,(e,t)=>e.subscribe(t))}render(){let e=this.context,t=e.gateway.snapshot,r=h(t,e.config.current.terminalEnabled??!1),i=e.agentSelection.state.selectedId??t.assistantAgentId,o=this.location?F(this.location,e.basePath):null,s=o?`sessionId`in o?o.sessionId:f(o.catalog):``;return C(s,_`<testclaw-terminal-panel
          ?hidden=${!r}
          embedded
          fullscreen
          .page=${!0}
          .routeTarget=${o}
          .client=${t.phase===`connected`?t.client:null}
          .available=${r}
          .agentId=${i?n(i):null}
          .basePath=${e.basePath}
          .themeMode=${e.theme.resolvedMode}
        ></testclaw-terminal-panel>
        ${r?v:M({icon:E.terminal,heading:a(`terminal.title`),description:a(`terminal.unavailable`),action:_`<button class="btn" @click=${()=>e.navigate(`new-session`)}>
                  ${a(`newSession.title`)}
                </button>`})}`)}},i([r({context:T,subscribe:!0})],L.prototype,`context`,void 0),i([S({attribute:!1})],L.prototype,`location`,void 0),customElements.define(`testclaw-terminal-page`,L)})))()}R();
//# sourceMappingURL=terminal-page-BW_UhdsD.js.map