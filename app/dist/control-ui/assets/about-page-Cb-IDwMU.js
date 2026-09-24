import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,Mr as n,cr as r,qr as i,ti as a}from"./control-ui-foundation-CGMdhB5v.js";import{$l as o,Bl as s,Hl as ee,Jl as c,Zl as l,_n as te,ac as ne,fn as u,ic as d,nr as f,rr as p}from"./control-ui-core-S9jKXqB5.js";import{$ as m,X as h,Y as g,ct as _,nt as re}from"./lit-runtime-DWoPVI38.js";import{Bi as ie,Di as ae,Ei as oe,Fi as v,Ii as se,Ni as y,Oi as b,Qa as x,Ui as S,fo as C,wi as w}from"./control-ui-core-G2U4O6rB.js";import{Fi as T,Ii as E,Mi as D,Ni as O,Pi as k}from"./control-ui-boot-shared-ooxiG3qa.js";import{Et as A,Ot as j,Pt as M,ht as N,wt as P}from"./control-ui-boot-shared-CCYBAAP9.js";import{c as F,d as I,f as L,m as ce,p as R,u as z}from"./control-ui-boot-new-DhInmp9T.js";import{n as B,t as V}from"./settings-workspace-DJAhLnkQ.js";import{n as H,t as U}from"./brand-icons-DrzgqaW5.js";function W(e,t){if(!e)return null;let n=new Date(e);return Number.isNaN(n.getTime())?null:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeZone:`UTC`}).format(n)}function G(e){return o(e===`copying`?`aboutPage.copyingCommit`:e===`copied`?`aboutPage.copiedCommit`:e===`error`?`aboutPage.copyCommitFailed`:`aboutPage.copyCommit`)}function le(e){return e===`copied`?o(`aboutPage.copiedCommit`):e===`error`?o(`aboutPage.copyCommitFailed`):``}function K(){return m`<span class="muted">${o(`aboutPage.unavailable`)}</span>`}function ue(e){if(!e)return h;let t=Date.parse(e);if(!Number.isFinite(t))return h;let n=new Intl.DateTimeFormat(l.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t));return m`
    <time class="about-commit__age" dir="auto" datetime=${e} title=${n}
      >${u(t,{fallback:``})}</time
    >
  `}function de(e){let t=e.buildInfo.commit;if(!t)return K();let n=G(e.copyState);return m`
    <span class="about-commit">
      <code dir="ltr" title=${t}>${t.slice(0,q)}</code>
      ${ue(e.buildInfo.commitAt)}
      <testclaw-tooltip .content=${n}>
        <button
          type="button"
          class="about-commit__copy"
          aria-label=${n}
          aria-busy=${e.copyState===`copying`?`true`:h}
          ?disabled=${e.copyState===`copying`}
          @click=${e.onCopyCommit}
        >
          <span aria-hidden="true">${e.copyState===`copied`?v.check:v.copy}</span>
        </button>
      </testclaw-tooltip>
      <span class="sr-only" role="status" aria-live="polite">${le(e.copyState)}</span>
    </span>
  `}function fe(e){let t=R.find(e=>e.id===`crimson`)??n(R[0],`about lobster palette`),r=F(t);return m`
    <section class="about-hero">
      ${S().mascot===`none`?m`<span class="about-hero__mark--neutral" aria-hidden="true">${v.mark}</span>`:m`<button
              type="button"
              class="about-hero__clawd ${e.clawdWaving?`about-hero__clawd--wave`:``}"
              style=${I(r)}
              aria-label=${o(`aboutPage.waveHello`)}
              @click=${e.onPokeClawd}
            >
              ${L(r)}
            </button>`}
      <h2 class="about-hero__name">${o(`aboutPage.productName`)}</h2>
      <p class="about-hero__tagline">${o(`aboutPage.tagline`)}</p>
      ${e.buildInfo.version?m`<code class="about-hero__version" dir="ltr">v${e.buildInfo.version}</code>`:h}
      <nav class="about-hero__links" aria-label=${o(`aboutPage.linksLabel`)}>
        ${J.map(e=>m`
            <a
              class="about-hero__link"
              href=${e.href}
              target=${k}
              rel=${T()}
            >
              <span class="about-hero__link-icon" aria-hidden="true">${e.icon}</span>
              <span>${e.label()}</span>
            </a>
          `)}
      </nav>
    </section>
  `}function pe(e){let t=W(e.buildInfo.builtAt,l.getLocale()),n=m`
    <dl class="settings-kv about-build-grid" aria-label=${o(`aboutPage.artifactDetails`)}>
      <dt>${o(`aboutPage.version`)}</dt>
      <dd>
        ${e.buildInfo.version?m`<code dir="ltr" title=${e.buildInfo.version}
                >${e.buildInfo.version}</code
              >`:K()}
      </dd>
      <dt>${o(`aboutPage.commit`)}</dt>
      <dd>${de(e)}</dd>
      ${e.buildInfo.branch?m`
              <dt>${o(`aboutPage.branch`)}</dt>
              <dd>
                <code dir="ltr" title=${e.buildInfo.branch}
                  >${e.buildInfo.branch}${e.buildInfo.dirty===!0?`*`:``}</code
                >
              </dd>
            `:h}
      <dt>${o(`aboutPage.built`)}</dt>
      <dd>
        ${t&&e.buildInfo.builtAt?m`<time
                dir="auto"
                datetime=${e.buildInfo.builtAt}
                title=${e.buildInfo.builtAt}
                >${t}</time
              >`:K()}
      </dd>
    </dl>
  `;return P([fe(e),j({title:o(`aboutPage.artifactTitle`),description:o(`aboutPage.artifactSubtitle`)},n),j({},A({title:o(`aboutPage.gatewayVersion`),description:o(`aboutPage.gatewayVersionHint`),control:e.gatewayVersion?M(m`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`,{mono:!0}):M(o(`aboutPage.unavailable`))})),m`<p class="about-footer">${o(`aboutPage.license`)}</p>`])}var q,J;function Y(){return(Y=e((()=>{r(),g(),se(),z(),ce(),ie(),N(),y(),c(),E(),te(),O(),H(),q=12,J=[{href:`https://testclaw.ai`,icon:v.globe,label:()=>o(`aboutPage.linkWebsite`)},{href:`https://docs.testclaw.ai`,icon:v.book,label:()=>o(`aboutPage.linkDocs`)},{href:`https://github.com/testclaw/testclaw`,icon:U.github,label:()=>o(`aboutPage.linkGitHub`)},{href:D,icon:U.discord,label:()=>o(`aboutPage.linkDiscord`)},{href:`https://x.com/testclaw`,icon:U.x,label:()=>o(`aboutPage.linkX`)},{href:`https://docs.testclaw.ai/releases`,icon:v.scrollText,label:()=>o(`aboutPage.linkChangelog`)}]})))()}var X,Z,Q;function $(){return($=e((()=>{t(),g(),re(),x(),b(),oe(),V(),p(),ee(),ne(),Y(),X=1800,Z=1400,Q=class extends s{constructor(...e){super(...e),this.copyState=`idle`,this.clawdWaving=!1,this.copyResetTimer=null,this.waveResetTimer=null,this.subscriptions=new d(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),this.copyResetTimer!==null&&(globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),this.waveResetTimer!==null&&(globalThis.clearTimeout(this.waveResetTimer),this.waveResetTimer=null),super.disconnectedCallback()}pokeClawd(){this.clawdWaving||(this.clawdWaving=!0,this.waveResetTimer=globalThis.setTimeout(()=>{this.waveResetTimer=null,this.clawdWaving=!1},Z))}async copyCommit(){let e=w.commit;if(!e||this.copyState===`copying`)return;globalThis.clearTimeout(this.copyResetTimer??void 0),this.copyResetTimer=null,this.copyState=`copying`;let t=await f(e);this.isConnected&&(this.copyState=t?`copied`:`error`,this.copyResetTimer=globalThis.setTimeout(()=>{this.copyResetTimer=null,this.copyState=`idle`},X))}render(){let e=this.context.gateway.snapshot,t=e.phase===`connected`&&e.hello?.server?.version?.trim()||null,n=pe({buildInfo:w,gatewayVersion:t,copyState:this.copyState,onCopyCommit:()=>void this.copyCommit(),clawdWaving:this.clawdWaving,onPokeClawd:()=>this.pokeClawd()});return m`
      <section class="content-header">
        <div>
          <h1 class="page-title">${C(`about`)}</h1>
        </div>
      </section>
      ${B(n)}
    `}},a([i({context:ae,subscribe:!0})],Q.prototype,`context`,void 0),a([_()],Q.prototype,`copyState`,void 0),a([_()],Q.prototype,`clawdWaving`,void 0),customElements.get(`testclaw-about-page`)||customElements.define(`testclaw-about-page`,Q)})))()}$();
//# sourceMappingURL=about-page-Cb-IDwMU.js.map