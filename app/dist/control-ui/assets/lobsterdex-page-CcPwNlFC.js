import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ti as t}from"./control-ui-foundation-CGMdhB5v.js";import{$l as n,Bl as r,Hl as i,Jl as a,Zl as o,nr as s,rr as c}from"./control-ui-core-S9jKXqB5.js";import{$ as l,X as u,Y as d,ct as f,nt as p}from"./lit-runtime-DWoPVI38.js";import{Fi as m,Ii as h,Qa as g,fo as _}from"./control-ui-core-G2U4O6rB.js";import{C as v,_ as y,c as b,d as x,f as S,g as C,h as w,m as T,p as E,u as D,w as O}from"./control-ui-boot-new-DhInmp9T.js";import{n as k,t as A}from"./settings-workspace-DJAhLnkQ.js";function j(e){return new Date(e).toLocaleDateString(o.getLocale())}function M(e,t={}){let r=E.filter(t=>e.has(t.id)).length,i=r===E.length,a=n(`quickSettings.appearance.lobsterdexSeen`,{seen:String(r),total:String(E.length)});return l`
    <section class="lobsterdex-page">
      <header
        class="lobsterdex-page__header ${i?`lobsterdex-page__header--complete`:``}"
      >
        <div>
          <h2>${n(`tabs.lobsterdex`)}</h2>
          <p>${n(`subtitles.lobsterdex`)}</p>
        </div>
        <span class="lobsterdex-page__count">${a}</span>
      </header>
      <span class="sr-only" role="status">
        ${t.copyFeedback?.status===`copied`?n(`common.copied`):u}
      </span>
      ${t.copyFeedback?.status===`error`?l`<div class="callout danger" role="alert">${n(`common.copyFailed`)}</div>`:u}
      <section class="lobsterdex-page__grid" aria-label=${a}>
        ${E.map(r=>{let i=b(r),a=e.get(r.id),o=a!==void 0,s=o?a.name??y(r.id):`?`,c=w[r.id],d=o&&a.firstSeenAt!==null?n(`quickSettings.appearance.lobsterdexCardFirstVisited`,{date:j(a.firstSeenAt)}):null,f=a?.shinySeenAt==null?null:n(`quickSettings.appearance.lobsterdexCardShinySeen`,{date:j(a.shinySeenAt)});return l`
            <article
              id="lobsterdex-${r.id}"
              class="lobsterdex-page__card ${o?``:`lobsterdex-page__card--unseen`}"
            >
              <button
                type="button"
                class="lobsterdex-page__copy-link"
                aria-label=${n(`quickSettings.appearance.lobsterdexCardCopyLink`)}
                @click=${()=>t.onCopyLink?.(r.id)}
              >
                <span aria-hidden="true"
                  >${t.copyFeedback?.status===`copied`&&t.copyFeedback.paletteId===r.id?m.check:m.link}</span
                >
              </button>
              <div
                class="lobsterdex-page__sprite lobster-pet lobster-pet--palette-${r.id} ${o?``:`lobsterdex__mini--unseen`}"
                style=${x(i)}
              >
                ${S(i,{standalone:!0})}
                ${a?.shinySeenAt==null?u:l`<span
                        class="lobsterdex__mini-star lobsterdex-page__star"
                        aria-hidden="true"
                        >✦</span
                      >`}
              </div>
              <h3>${s}</h3>
              <p class="lobsterdex-page__lore">${o?c.flavor:c.hint}</p>
              <div class="lobsterdex-page__dates">
                ${d?l`<p class="lobsterdex-page__date"><time>${d}</time></p>`:u}
                ${f?l`<p class="lobsterdex-page__date"><time>${f}</time></p>`:u}
              </div>
            </article>
          `})}
      </section>
    </section>
  `}function N(){return(N=e((()=>{d(),h(),D(),C(),T(),a()})))()}var P;function F(){return(F=e((()=>{d(),p(),g(),O(),T(),A(),c(),i(),N(),P=class extends r{constructor(...e){super(...e),this.copyFeedback=null,this.copyAttempt=0,this.copyResetTimer=null,this.copyLink=async e=>{let t=++this.copyAttempt;this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null);let n=`${location.origin}${location.pathname}#lobsterdex-${e}`,r=await s(n,()=>this.isConnected&&t===this.copyAttempt);this.isConnected&&t===this.copyAttempt&&(this.copyFeedback={paletteId:e,status:r?`copied`:`error`},this.copyResetTimer=window.setTimeout(()=>{this.copyFeedback=null,this.copyResetTimer=null},1500))}}disconnectedCallback(){this.copyAttempt+=1,this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),super.disconnectedCallback()}firstUpdated(){if(!location.hash.startsWith(`#lobsterdex-`))return;let e=E.find(e=>e.id===location.hash.slice(12));if(!e)return;let t=this.querySelector(`#lobsterdex-${e.id}`);if(!t)return;let n=e=>{e.target===t&&e.animationName===`lobsterdex-card-highlight`&&(t.classList.remove(`lobsterdex-page__card--highlight`),t.removeEventListener(`animationend`,n))};t.addEventListener(`animationend`,n),t.classList.add(`lobsterdex-page__card--highlight`),requestAnimationFrame(()=>{requestAnimationFrame(()=>t.scrollIntoView({block:`center`}))})}render(){return l`
      <section class="content-header">
        <h1 class="page-title">${_(`lobsterdex`)}</h1>
      </section>
      ${k(M(v(),{copyFeedback:this.copyFeedback,onCopyLink:e=>void this.copyLink(e)}))}
    `}},t([f()],P.prototype,`copyFeedback`,void 0),customElements.get(`testclaw-lobsterdex-page`)||customElements.define(`testclaw-lobsterdex-page`,P)})))()}F();
//# sourceMappingURL=lobsterdex-page-CcPwNlFC.js.map