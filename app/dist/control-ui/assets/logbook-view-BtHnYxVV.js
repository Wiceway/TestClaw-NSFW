import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Bs as n,Jl as r,_n as i,mn as a,zs as o}from"./control-ui-core-S9jKXqB5.js";import{$ as s,X as c,Y as l,r as u,t as d}from"./lit-runtime-DWoPVI38.js";import{Fi as f,Ii as p}from"./control-ui-core-G2U4O6rB.js";import{da as m,la as h}from"./control-ui-boot-shared-ooxiG3qa.js";import{er as g,nr as _}from"./control-ui-boot-shared-CCYBAAP9.js";import{a as v,c as y,d as b,i as x,l as S,n as C,o as w,r as T,s as E,t as D,u as O}from"./logbook-controller-ebZfT1Jh.js";function k(e,t){return a(e,{hour:`2-digit`,minute:`2-digit`,timeZone:t},``)}function A(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)|0;return Math.abs(t)%360}function j(e){let n=e.captureEnabled&&!e.capturePaused&&!e.lastCaptureError,r=e.capturePaused?t(`logbook.status.paused`):e.captureEnabled?t(`logbook.status.capturing`,{seconds:String(e.captureIntervalSeconds)}):t(`logbook.status.disabled`);return s`
    <div class="logbook__chips">
      <span class="logbook__chip ${n?`logbook__chip--ok`:`logbook__chip--warn`}">
        <span class="logbook__chip-dot"></span>
        ${r}
      </span>
      ${e.nodeName||e.nodeId?s`<span class="logbook__chip" title=${t(`logbook.status.nodeHelp`)}>
              ${f.monitor} ${e.nodeName??e.nodeId}
            </span>`:c}
      ${e.pendingFrames>0?s`<span class="logbook__chip" title=${t(`logbook.status.pendingHelp`)}>
              ${t(`logbook.status.pending`,{count:String(e.pendingFrames)})}
            </span>`:c}
      ${e.analysisRunning?s`<span class="logbook__chip logbook__chip--busy"
              >${t(`logbook.status.analyzing`)}</span
            >`:c}
      ${e.lastCaptureError?s`<span
              class="logbook__chip logbook__chip--error"
              title=${o(e.lastCaptureError)}
            >
              ${t(`logbook.status.captureError`)}
            </span>`:c}
      ${e.lastBatch?.status===`error`?s`<span
              class="logbook__chip logbook__chip--error"
              title=${o(e.lastBatch.error)}
            >
              ${t(`logbook.status.batchError`)}
            </span>`:c}
      ${e.visionModelSource===`missing`?s`<span
              class="logbook__chip logbook__chip--warn"
              title=${t(`logbook.status.modelMissingHelp`)}
            >
              ${t(`logbook.status.modelMissing`)}
            </span>`:c}
    </div>
  `}function M(e,n,r,i){let a=e.expandedCardIds.has(r.id),l=A(r.category),u=r.keyframeId!==void 0&&!e.framePreviewFailed.has(r.keyframeId)?r.keyframeId:void 0,d=u===void 0?void 0:e.framePreviews.get(u);return a&&u!==void 0&&!d&&w(e,n,u),s`
    <article
      class="logbook-card ${a?`logbook-card--expanded`:``}"
      style="--logbook-hue: ${l}"
    >
      <button
        class="logbook-card__header"
        type="button"
        @click=${()=>{let t=new Set(e.expandedCardIds);a?t.delete(r.id):t.add(r.id),e.expandedCardIds=t,e.requestUpdate?.()}}
      >
        <span class="logbook-card__time">
          ${k(r.startMs,i)}<span class="logbook-card__time-sep">–</span
          >${k(r.endMs,i)}
        </span>
        <span class="logbook-card__stripe" aria-hidden="true"></span>
        <span class="logbook-card__heading">
          <span class="logbook-card__title">${r.title}</span>
          <span class="logbook-card__summary">${r.summary}</span>
        </span>
        <span class="logbook-card__meta">
          <span class="logbook-card__category">${r.category}</span>
          ${r.appPrimary?s`<span class="logbook-card__app">${r.appPrimary}</span>`:c}
          <span class="logbook-card__duration"
            >${h(r.endMs-r.startMs)??`0s`}</span
          >
        </span>
      </button>
      ${a?s`
              <div class="logbook-card__body">
                ${d?s`<img
                        class="logbook-card__keyframe"
                        src=${d}
                        alt=${t(`logbook.card.keyframeAlt`)}
                      />`:u===void 0?c:s`<div class="logbook-card__keyframe logbook-card__keyframe--loading">
                          ${t(`common.loading`)}
                        </div>`}
                ${r.detail?s`<p class="logbook-card__detail">${o(r.detail)}</p>`:c}
                ${r.distractions.length>0?s`
                        <div class="logbook-card__distractions">
                          <span class="logbook-card__distractions-label">
                            ${t(`logbook.card.distractions`)}
                          </span>
                          ${r.distractions.map(e=>s`
                              <span class="logbook-card__distraction">
                                ${k(e.startMs,i)} · ${e.title}
                              </span>
                            `)}
                        </div>
                      `:c}
              </div>
            `:c}
    </article>
  `}function N(e){let n=e.timeline?.stats;if(!n||n.trackedMs<=0)return c;let r=Math.max(0,n.trackedMs-n.distractionMs),i=Math.round(r/n.trackedMs*100),a=n.categories[0]?.ms??1;return s`
    <section class="card logbook-side__card">
      <div class="card-title">${t(`logbook.stats.title`)}</div>
      <div class="logbook-stats__focus">
        <div class="logbook-stats__focus-bar">
          <div class="logbook-stats__focus-fill" style="width: ${i}%"></div>
        </div>
        <div class="logbook-stats__focus-legend">
          <span>${t(`logbook.stats.focus`,{pct:String(i)})}</span>
          <span
            >${t(`logbook.stats.tracked`,{duration:h(n.trackedMs)??`0s`})}</span
          >
        </div>
      </div>
      <div class="logbook-stats__categories">
        ${n.categories.slice(0,6).map(e=>s`
            <div
              class="logbook-stats__category"
              style="--logbook-hue: ${A(e.category)}"
            >
              <span class="logbook-stats__category-name">${e.category}</span>
              <span class="logbook-stats__category-bar">
                <span
                  class="logbook-stats__category-fill"
                  style="width: ${Math.max(6,Math.round(e.ms/a*100))}%"
                ></span>
              </span>
              <span class="logbook-stats__category-time"
                >${h(e.ms)??`0s`}</span
              >
            </div>
          `)}
      </div>
      ${n.apps.length>0?s`
              <div class="logbook-stats__apps">
                ${n.apps.slice(0,5).map(e=>s`<span class="logbook-stats__app">${e.domain}</span>`)}
              </div>
            `:c}
    </section>
  `}function P(e,n){return s`
    <section class="card logbook-side__card">
      <div class="logbook-side__card-header">
        <div class="card-title">${t(`logbook.standup.title`)}</div>
        <button
          class="btn btn--small"
          type="button"
          ?disabled=${e.standupLoading}
          @click=${()=>void E(e,n,e.standup!==null)}
        >
          ${e.standupLoading?t(`common.loading`):e.standup?t(`logbook.standup.refresh`):t(`logbook.standup.generate`)}
        </button>
      </div>
      ${e.standup?s`<div class="logbook-standup__body markdown-body">
              ${u(_(e.standup.text))}
            </div>`:s`<div class="card-sub">${t(`logbook.standup.empty`)}</div>`}
    </section>
  `}function F(e,n){return s`
    <section class="card logbook-side__card">
      <div class="card-title">${t(`logbook.ask.title`)}</div>
      <form
        class="logbook-ask__form"
        @submit=${t=>{t.preventDefault(),D(e,n)}}
      >
        <input
          class="logbook-ask__input"
          type="text"
          .value=${e.askQuestion}
          placeholder=${t(`logbook.ask.placeholder`)}
          @input=${t=>{e.askQuestion=t.target.value}}
        />
        <button class="btn btn--small" type="submit" ?disabled=${e.askLoading}>
          ${e.askLoading?t(`common.loading`):t(`logbook.ask.submit`)}
        </button>
      </form>
      ${e.askAnswer?s`<p class="logbook-ask__answer">${e.askAnswer}</p>`:c}
    </section>
  `}function I(e){let n=T(e.host);n.requestUpdate=e.onRequestUpdate??null;let r=e.connected;C(n,r?e.client:null,r),r&&!n.timeline&&!n.loading&&!n.error&&v(n,e.client);let i=n.status?.today??y(),a=n.day===i,o=n.status,l=n.timeline?.cards??[];return s`
    <section class="logbook">
      <header class="logbook__header">
        <div class="logbook__daynav">
          <button
            class="btn btn--small"
            type="button"
            aria-label=${t(`logbook.nav.previousDay`)}
            @click=${()=>void v(n,e.client,{day:b(n.day,-1)})}
          >
            ‹
          </button>
          <span class="logbook__day">${n.day}</span>
          <button
            class="btn btn--small"
            type="button"
            aria-label=${t(`logbook.nav.nextDay`)}
            ?disabled=${a}
            @click=${()=>void v(n,e.client,{day:b(n.day,1)})}
          >
            ›
          </button>
          ${a?c:s`<button
                  class="btn btn--small"
                  type="button"
                  @click=${()=>void v(n,e.client,{today:!0})}
                >
                  ${t(`logbook.nav.today`)}
                </button>`}
        </div>
        ${n.status?j(n.status):c}
        <div class="logbook__actions">
          ${n.status?s`<button
                  class="btn btn--small"
                  type="button"
                  ?disabled=${n.actionPending||!n.status.captureEnabled}
                  @click=${()=>void O(n,e.client,!n.status?.capturePaused)}
                >
                  ${n.status.capturePaused?t(`logbook.actions.resume`):t(`logbook.actions.pause`)}
                </button>`:c}
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${n.actionPending}
            @click=${()=>void S(n,e.client)}
          >
            ${t(`logbook.actions.analyzeNow`)}
          </button>
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${n.loading}
            @click=${()=>void v(n,e.client)}
          >
            ${f.refresh}
          </button>
        </div>
      </header>
      ${n.error?s`<div class="callout danger" role="alert">${n.error}</div>`:c}
      <div class="logbook__layout">
        <div class="logbook__timeline">
          ${n.loading&&l.length===0?s`<div class="card-sub">${t(`common.loading`)}</div>`:c}
          ${!n.loading&&l.length===0&&!n.error?s`
                  <div class="logbook__empty">
                    <div class="logbook__empty-title">${t(`logbook.empty.title`)}</div>
                    <div class="logbook__empty-sub">${t(`logbook.empty.subtitle`)}</div>
                  </div>
                `:c}
          ${o?l.map(t=>M(n,e.client,t,o.timeZone)):c}
        </div>
        <aside class="logbook__side">
          ${N(n)} ${P(n,e.client)}
          ${F(n,e.client)}
        </aside>
      </div>
    </section>
  `}function L(){return(L=e((()=>{l(),d(),p(),g(),r(),m(),n(),i(),x()})))()}L();export{I as renderLogbook};
//# sourceMappingURL=logbook-view-BtHnYxVV.js.map