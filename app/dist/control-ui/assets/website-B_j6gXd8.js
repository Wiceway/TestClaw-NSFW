import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Hl as o,Jl as s,au as c,iu as l}from"./control-ui-core-S9jKXqB5.js";import{$ as u,X as d,Y as f,nt as p,ut as m}from"./lit-runtime-DWoPVI38.js";import{Di as h,Fi as g,Ii as _,Oi as v}from"./control-ui-core-G2U4O6rB.js";import{D as y,M as b,O as x,g as S}from"./config-runtime-CgOgfOrG.js";import{M as C,dn as w,k as T}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as E,r as D}from"./board-layout-BmeSfx17.js";function O(e){let t=k.safeParse(e);if(!t.success)throw new E(`invalid_operation`,`Website props must contain only a valid HTTPS url of at most 2048 characters`);let n=new URL(t.data.url);if(n.username||n.password)throw new E(`invalid_operation`,`Website URLs must not contain embedded credentials`);return t.data}var k;function A(){return(A=e((()=>{S(),D(),k=y({url:x().max(2048).pipe(b({protocol:/^https$/,normalize:!0}).max(2048))})})))()}var j,M;function N(){return(N=e((()=>{c(),j={board:{widget:{websiteOpen:`Open website`,websiteEmbedHint:`If this site does not load here, open it in a new tab.`,websiteSameOrigin:`Open this website in a new tab. Gateway and Control UI pages cannot be embedded in a website widget.`}}},M=Object.assign(()=>Object.assign(l.board.widget,j.board.widget),{catalog:j})})))()}var P;function F(){return(F=e((()=>{t(),f(),p(),A(),v(),T(),_(),s(),N(),o(),M(),P=class extends a{constructor(...e){super(...e),this.active=!0,this.activated=!1}willUpdate(){this.activated||=this.active}render(){if(!this.activated)return d;let e;try{e=new URL(O(this.widget?.props).url)}catch(e){return C(e)}let t=w(this.context?.gateway.connection.gatewayUrl??``,window.location.origin),n=new URL(t).hostname,r=e.hostname===window.location.hostname||e.hostname===n;return u`<div class="board-website">
      ${r?u`<p class="board-website__notice" role="alert">
              ${i(`board.widget.websiteSameOrigin`)}
            </p>`:u`<iframe
              class="board-website__frame"
              title=${this.widget?.title||i(`board.widget.kindWebsite`)}
              src=${e.href}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              referrerpolicy="no-referrer"
            ></iframe>`}
      <div class="board-website__footer">
        <span class="board-website__origin">${e.host}</span>
        <a
          href=${e.href}
          target="_blank"
          rel="noopener noreferrer"
          title=${i(`board.widget.websiteEmbedHint`)}
        >
          ${i(`board.widget.websiteOpen`)}${g.externalLink}
        </a>
      </div>
    </div>`}},r([n({context:h,subscribe:!0})],P.prototype,`context`,void 0),r([m({attribute:!1})],P.prototype,`widget`,void 0),r([m({type:Boolean})],P.prototype,`active`,void 0),customElements.get(`testclaw-website-widget`)||customElements.define(`testclaw-website-widget`,P)})))()}F();
//# sourceMappingURL=website-B_j6gXd8.js.map