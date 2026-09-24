import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,so as r,ti as i}from"./control-ui-foundation-CGMdhB5v.js";import{$l as a,Bl as o,Bs as s,Gr as c,Hl as l,Jl as ee,Rs as u,Wr as d,au as te,iu as ne,vi as f}from"./control-ui-core-S9jKXqB5.js";import{$ as p,X as m,Y as h,c as g,ct as _,i as re,nt as ie,o as v,r as ae,s as y,t as oe,ut as se}from"./lit-runtime-DWoPVI38.js";import{Di as ce,Dr as le,Er as b,Fi as x,Ii as ue,Oa as S,Oi as de,Or as fe,ba as pe}from"./control-ui-core-G2U4O6rB.js";import{ca as me,da as he,go as ge,ho as _e,la as C,sa as ve}from"./control-ui-boot-shared-ooxiG3qa.js";import{G as w,H as T,U as E,V as D}from"./control-ui-boot-shared-C3bL_9oq.js";import{er as O,f as k,nr as A,p as j}from"./control-ui-boot-shared-CCYBAAP9.js";import{F as M,P as N}from"./markdown-runtime-B1-JWj3L.js";import{a as P,o as F}from"./settings-targets-B7C72q5F.js";import{n as ye,t as be}from"./en-transcripts-BQo6UYf3.js";function I(e){let t=new URLSearchParams(e);return{limit:50,query:t.get(`query`)?.slice(0,256)||void 0,providerId:t.get(`providerId`)||void 0,accountId:t.get(`accountId`)||void 0,agentId:t.get(`agentId`)||void 0,startedAfter:L(t.get(`startedAfter`)),startedBefore:L(t.get(`startedBefore`)),cursor:t.get(`cursor`)||void 0}}function L(e){if(e)return/^\d{4}-\d{2}-\d{2}$/u.test(e)?`${e}T00:00:00.000Z`:e}function R(e,t){let n=new URLSearchParams(e);for(let[e,r]of Object.entries(t))r?n.set(e,r):n.delete(e);let r=n.toString();return r?`?${r}`:``}var z,B;function V(){return(V=e((()=>{z=[`providerId`,`accountId`,`agentId`,`startedAfter`,`startedBefore`],B=[`query`,...z]})))()}var H,U;function W(){return(W=e((()=>{te(),H={meetings:{emptyTitle:`Your meeting notes, together`,docs:`Set up meeting transcripts`,inProgress:`In progress`,activeNotes:`Summaries are generated about every 5 minutes when new speech is captured. Follow the Transcript tab for speech as it is saved.`,liveCapture:`Live capture`,liveHint:`Updates automatically every 3 seconds.`,liveSummaryHint:`Summary so far · Updates about every 5 minutes when there is new speech. Final notes are saved when capture ends.`,liveRetrying:`Updates are delayed. Retrying automatically.`,waitingForSpeech:`Waiting for speech…`,noSpeech:`No speech captured`,listLabel:`Meetings by day`,newestFirst:`Newest first · grouped by meeting date`,loadingMeetings:`Loading meetings…`,loadingSummary:`Loading summary…`,loadingTranscript:`Loading transcript…`,summaryPending:`Summary updates about every 5 minutes as new speech is captured.`,summaryUnavailable:`No saved summary preview is available.`,noResults:`No meetings match your search`}},U=Object.assign(()=>{Object.assign(ne,H)},{catalog:H})})))()}function xe(e){let t=e.split(/\r\n?|\n/),n=Y.parse(e,{}),r=[],i=0,a=!1;for(let[e,o]of n.entries()){if(o.type!==`heading_open`||o.level!==0||o.tag!==`h1`&&o.tag!==`h2`||!o.map)continue;let s=o.map[0];a&&=(i=s,!1),o.tag===`h2`&&n[e+1]?.content.trim()===`Transcript`&&(r.push(t.slice(i,s).join(`
`)),a=!0)}return a||r.push(t.slice(i).join(`
`)),r.join(`
`)}function G(e){return e?new Date(e).toLocaleString():a(`transcripts.unknown`)}function Se(e){let t=a(`transcripts.sourceTime`,{time:G(e)});return p`<time datetime=${e??m} title=${t} aria-label=${t}
    >${e?new Date(e).toLocaleTimeString():a(`transcripts.unknown`)}</time
  >`}function Ce(e){return[e.providerId,e.accountId,e.guildId,e.channelId,e.meetingUrl,e.threadTs,e.fileId].filter(Boolean).join(` · `)}function K(e,t){let n=c(e);return p`<div class="transcripts-notice" role="alert" tabindex="-1">
    <h2>${a(n?`transcripts.forbidden`:`transcripts.loadError`)}</h2>
    <p>${n?a(`transcripts.forbiddenHint`):u(e)}</p>
    <button class="btn" @click=${t}>${a(`common.retry`)}</button>
  </div>`}function q(e){return p`<div class="meetings-loading" role="status" aria-live="polite">
    <span class="btn__spinner" aria-hidden="true"></span>
    <span>${e}</span>
  </div>`}function we(e){let t=new URLSearchParams(e.search),n=z.some(e=>t.get(e)),i=(t,n,r=`search`)=>p`<label class="field">
    <span>${n}</span
    ><input
      name=${t}
      type=${r}
      aria-label=${n}
      maxlength=${256}
      .value=${v(e.drafts[t]??``)}
      @input=${n=>e.onDraft(t,n.target.value)}
    />
  </label>`;return p`<form
    class="transcripts-filters"
    aria-label=${a(`transcripts.filters`)}
    @submit=${t=>{t.preventDefault();let n=new FormData(t.currentTarget),i={cursor:null};for(let e of B)i[e]=r(n.get(e));e.onNavigate(i)}}
  >
    ${i(`query`,a(`transcripts.titleFilter`))}
    <details ?open=${n}>
      <summary>${a(`transcripts.advancedFilters`)}</summary>
      <div class="transcripts-filters__advanced">
        ${i(`providerId`,a(`transcripts.sourceFilter`))}
        ${i(`accountId`,a(`transcripts.accountFilter`))}
        ${i(`agentId`,a(`transcripts.agentFilter`))}
        ${i(`startedAfter`,a(`transcripts.afterFilter`),`date`)}
        ${i(`startedBefore`,a(`transcripts.beforeFilter`),`date`)}
      </div>
      <p class="transcripts-caption">${a(`transcripts.filterHint`)}</p>
    </details>
    <div class="transcripts-actions">
      <button type="submit" class="btn">${x.search}${a(`transcripts.filter`)}</button>
      <button
        type="button"
        class="btn"
        @click=${()=>e.onNavigate(Object.fromEntries([...B,`cursor`].map(e=>[e,null])))}
      >
        ${a(`transcripts.clearFilters`)}
      </button>
    </div>
  </form>`}function Te(e,t){let n=new URLSearchParams(t.search).get(`selector`),r=!e.active&&e.utteranceCount===0,i=e.participants.slice(0,3).join(`, `),o=e.participants.length-3,s=e.stoppedAt?C(Math.max(0,Date.parse(e.stoppedAt)-Date.parse(e.startedAt))):null,c={selector:e.selector,find:null,tab:null};return p`<li>
    <a
      class="transcripts-list__entry meetings-row ${r?`meetings-row--silent`:``}"
      aria-current=${e.selector===n?`page`:m}
      href=${S(`meetings`,t.basePath)+R(t.search,c)}
      @click=${e=>{f(e)&&(e.preventDefault(),t.onNavigate(c))}}
    >
      <span class="meetings-row__title"
        >${e.title||e.providerName||e.providerId}</span
      >
      <span class="meetings-row__meta">
        ${e.providerName||e.providerId} ·
        <time datetime=${e.startedAt}
          >${new Date(e.startedAt).toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`})}</time
        >
        ${e.active?p`<span class="meetings-live">${a(`meetings.inProgress`)}</span>`:s?p` · ${s}`:m}
      </span>
      ${i?p`<span class="meetings-row__meta meetings-row__participants">${i}${o>0?` +${o}`:``}</span>`:m}
      <span class="meetings-row__meta"
        >${a(`transcripts.savedCount`,{count:String(e.utteranceCount)})}</span
      >
      <span class="meetings-row__overview"
        >${e.utteranceCount===0?a(e.active?`meetings.waitingForSpeech`:`meetings.noSpeech`):e.overview||a(e.active?`meetings.summaryPending`:`meetings.summaryUnavailable`)}</span
      >
    </a>
  </li>`}function Ee(e){if(e.listError)return K(e.listError,e.onRefresh);if(!e.list)return q(a(`meetings.loadingMeetings`));let t=new Map;for(let n of e.list.sessions){let e=new Date(n.startedAt).toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`}),r=t.get(e)??[];r.push(n),t.set(e,r)}return p` ${t.size?p`<section class="meetings-timeline" aria-label=${a(`meetings.listLabel`)}>
            <p class="transcripts-caption">${a(`meetings.newestFirst`)}</p>
            ${g(t,([e])=>e,([t,n])=>p`<section class="meetings-day">
                <h2>${t}</h2>
                <ol class="transcripts-list">
                  ${g(n,e=>e.selector,t=>Te(t,e))}
                </ol>
              </section>`)}
          </section>`:p`<div class="transcripts-notice" role="status">
            <h2>
              ${a(B.some(t=>new URLSearchParams(e.search).has(t))?`meetings.noResults`:`meetings.emptyTitle`)}
            </h2>
            <p>${a(`transcripts.emptyHint`)}</p>
            <a
              href="https://docs.testclaw.ai/cli/transcripts"
              target="_blank"
              rel="noopener noreferrer"
              >${a(`meetings.docs`)}</a
            >
          </div>`}
    <nav class="transcripts-actions" aria-label=${a(`transcripts.pagination`)}>
      ${new URLSearchParams(e.search).has(`cursor`)?p`<button class="btn" @click=${()=>e.onNavigate({cursor:null})}>
              ${a(`transcripts.firstPage`)}
            </button>`:m}
      ${e.list.nextCursor?p`<button
              class="btn"
              @click=${()=>e.onNavigate({cursor:e.list?.nextCursor??null})}
            >
              ${a(`transcripts.nextPage`)}${x.chevronRight}
            </button>`:m}
    </nav>`}function De(e,t){let n=e.summary,r=`# ${e.session.title||e.session.sessionId}\n`,i=xe(n?n.markdown.startsWith(r)?n.markdown.slice(r.length):n.markdown:``);return p`<section class="transcripts-summary">
    ${n?p`${e.session.active?p`<p class="transcripts-caption" role="status">${a(`meetings.liveSummaryHint`)}</p>`:m}
            <p class="transcripts-caption">
              ${n.source?p`${a(n.source===`model`?`transcripts.modelNotes`:`transcripts.heuristicNotes`)}${n.model?` · ${n.model}`:m} · `:m}
              ${a(`transcripts.generatedAt`,{time:G(n.generatedAt)})}
            </p>
            <div class="meetings-notes markdown">
              ${ae(A(i,{mode:`document`,remoteImages:!1}))}
            </div>
            <p class="transcripts-caption">${a(`transcripts.summaryHint`)}</p>`:t.summaryGeneration?.kind===`loading`?q(a(`transcripts.generatingSummary`)):t.summaryGeneration?.kind===`error`?p`<div role="alert">
                <p>${a(`transcripts.summaryError`)} ${t.summaryGeneration.message}</p>
                <button class="btn" @click=${t.onSummaryRetry}>${a(`common.retry`)}</button>
              </div>`:p`<p role="status">
                ${a(e.session.utteranceCount===0?e.session.active?`meetings.waitingForSpeech`:`meetings.noSpeech`:`transcripts.noSummary`)}
              </p>`}
  </section>`}function Oe(e){let t=new URLSearchParams(e.search),n=e.reader.pages.at(-1),i=e.reader.summary??n,o=e.readerTab===`summary`?e.reader.summary:n;return p`<article
    class="transcripts-reader"
    aria-label=${a(`transcripts.reader`)}
    aria-busy=${e.reader.loading}
  >
    <a
      class="transcripts-back"
      href=${S(`meetings`,e.basePath)+R(e.search,{selector:null,find:null,tab:null})}
      @click=${t=>{f(t)&&(t.preventDefault(),e.onNavigate({selector:null,find:null,tab:null}))}}
      >${x.arrowLeft}${a(`transcripts.back`)}</a
    >
    ${e.reader.error?K(e.reader.error,e.onReaderRetry):m}
    ${e.reader.loading&&!o?q(a(e.readerTab===`summary`?`meetings.loadingSummary`:`meetings.loadingTranscript`)):m}
    ${i?p`
            <header class="transcripts-reader__header">
              <h1 tabindex="-1">${i.session.title||i.session.sessionId}</h1>
              <p class="transcripts-caption">
                ${i.session.providerName||i.session.providerId} ·
                <time datetime=${i.session.startedAt}
                  >${G(i.session.startedAt)}</time
                >
                · ${a(`transcripts.savedCount`,{count:String(i.session.utteranceCount)})}
              </p>
              ${i.session.active?p`<div class="meetings-live-status" role="status">
                      <div class="meetings-live-status__heading">
                        <span class="meetings-live">${a(`meetings.liveCapture`)}</span>
                        <span class="meetings-live-status__elapsed" role="timer" aria-live="off"
                          >${C(Math.max(0,e.now-Date.parse(i.session.startedAt)))}</span
                        >
                      </div>
                      <p>
                        ${a(e.reader.error?`meetings.liveRetrying`:`meetings.liveHint`)}
                      </p>
                    </div>`:m}
              <details class="transcripts-source-details">
                <summary>${a(`transcripts.sourceDetails`)}</summary>
                <p class="transcripts-caption">${Ce(i.session.source)}</p>
                <p class="transcripts-caption">
                  ${i.session.agentId??a(`transcripts.unattributed`)}
                </p>
                <p class="transcripts-caption">
                  ${a(`transcripts.lastUtterance`,{time:G(i.session.lastUtteranceAt)})}
                </p>
                <p class="transcripts-caption">
                  ${a(i.session.activeSubscription?`transcripts.armedHint`:`transcripts.inactiveHint`)}
                </p>
              </details>
              <div class="transcripts-actions">
                ${[`markdown`,`jsonl`].map(t=>p`<button
                      class="btn"
                      ?disabled=${e.exportState.kind===`loading`}
                      @click=${()=>e.onDownload(t)}
                    >
                      ${x.download}${a(`transcripts.download.${t}`)}
                    </button>`)}
              </div>
              ${e.exportState.kind===`error`?p`<p role="alert">
                      ${a(`transcripts.exportError`)} ${e.exportState.message}
                    </p>`:m}
              ${e.exportState.kind===`loading`||e.exportState.kind===`done`?p`<p role="status">
                      ${a(e.exportState.kind===`loading`?`transcripts.exporting`:`transcripts.downloadStarted`)}
                    </p>`:m}
            </header>
            ${j({id:`transcript-reader`,active:e.readerTab,tabs:[{value:`summary`,label:a(`transcripts.summary`)},{value:`text`,label:a(`transcripts.text`)}],ariaLabel:a(`transcripts.reader`),panelId:`transcript-reader-panel`,variant:`sub`,onSelect:e.onReaderTab})}
            <div
              id="transcript-reader-panel"
              role="tabpanel"
              aria-labelledby=${`transcript-reader-tab-${e.readerTab}`}
            >
              ${e.readerTab===`summary`?e.reader.summary?De(e.reader.summary,e):m:p`
                      <form
                        class="transcripts-search"
                        role="search"
                        @submit=${t=>{t.preventDefault();let n=r(new FormData(t.currentTarget).get(`find`));e.onNavigate({find:n,tab:`transcript`})}}
                      >
                        <label class="field">
                          <input
                            type="search"
                            name="find"
                            aria-label=${a(`transcripts.searchWithin`)}
                            placeholder=${a(`transcripts.searchWithin`)}
                            maxlength=${256}
                            .value=${v(e.drafts.find??``)}
                            @input=${t=>e.onDraft(`find`,t.target.value)}
                          />
                        </label>
                        <button class="btn" type="submit">
                          ${x.search}${a(`transcripts.search`)}
                        </button>
                        ${t.get(`find`)?p`<button
                                class="btn"
                                type="button"
                                @click=${()=>e.onNavigate({find:null})}
                              >
                                ${a(`transcripts.clearSearch`)}
                              </button>`:m}
                      </form>
                      ${t.get(`find`)?p`<p class="transcripts-caption" role="status">
                              ${a(`transcripts.searchResults`,{query:t.get(`find`)??``})}
                            </p>`:m}
                      <ol class="transcripts-utterances">
                        ${e.reader.pages.flatMap(e=>e.utterances??[]).map(e=>p`<li>
                              <div class="transcripts-utterance__byline">
                                <strong
                                  >${e.speakerLabel??e.speakerId??a(`transcripts.unknownSpeaker`)}</strong
                                >
                                ${Se(e.startedAt??e.endedAt)}
                              </div>
                              <p>${e.text}</p>
                            </li>`)}
                      </ol>
                      ${n&&!e.reader.error&&!e.reader.pages.some(e=>e.utterances?.length)?p`<p role="status">
                              ${a(t.get(`find`)?`transcripts.noMatches`:i.session.active?`meetings.waitingForSpeech`:`transcripts.noUtterances`)}
                            </p>`:m}
                      ${e.reader.loading&&n?.nextCursor?q(a(`meetings.loadingTranscript`)):m}
                    `}
            </div>
          `:m}
  </article>`}function J(e){let t=!!new URLSearchParams(e.search).get(`selector`),n=P.meetingCapture;return p`<section class="transcripts-workspace">
    <header class="content-header content-header--page">
      <div>
        <h1 class="page-title">${a(`tabs.meetings`)}</h1>
        <p class="page-sub">${a(`subtitles.meetings`)}</p>
      </div>
      <div class="transcripts-actions">
        <a
          class="btn"
          href=${S(n.routeId,e.basePath)+n.search+n.hash}
          >${x.settings}${a(`meetingCapture.title`)}</a
        >
        <button
          class="btn"
          ?disabled=${!e.connected||!e.allowed||e.listLoading}
          @click=${e.onRefresh}
        >
          ${x.refresh}${a(`common.refresh`)}
        </button>
      </div>
    </header>
    ${e.connected?e.allowed?p`<div class="transcripts-layout ${t?`transcripts-layout--selected`:``}">
              <section
                class="transcripts-library"
                aria-label=${a(`transcripts.library`)}
                aria-busy=${e.listLoading}
              >
                ${we(e)}${Ee(e)}
              </section>
              ${t?Oe(e):m}
            </div>`:p`<div class="transcripts-notice" role="alert">
              <h2>${a(`transcripts.forbidden`)}</h2>
              <p>${a(`transcripts.forbiddenHint`)}</p>
            </div>`:p`<div class="transcripts-notice" role="status">${a(`transcripts.disconnected`)}</div>`}
  </section>`}var Y;function X(){return(X=e((()=>{h(),re(),y(),oe(),M(),pe(),k(),ue(),O(),ee(),W(),be(),he(),s(),d(),F(),V(),ye(),U(),Y=new N(`commonmark`)})))()}var Z,Q;function $(){return($=e((()=>{t(),D(),h(),ie(),de(),fe(),s(),d(),ge(),l(),me(),V(),X(),Z=class extends o{constructor(){super(),this.routeSearch=``,this.drafts={},this.list=null,this.listDenial=null,this.readerDenial=null,this.accessGeneration=0,this.readerCursor=null,this.loadedReaderCursor=null,this.lastReaderRefresh=0,this.now=Date.now(),this.summary=null,this.summaryGeneration={kind:`idle`},this.summaryAbort=null,this.readerPages=[],this.exportState={kind:`idle`},this.exportAbort=null,this.focusSelection=!1,this.gateway=new _e(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetConnection(),onPageActivation:()=>this.refreshLive(!0),onSnapshot:({snapshot:{hello:e}})=>{(e!==this.connectionHello||e?.auth!==this.connectionAuth)&&(this.gateway.invalidate(),this.resetConnection()),this.connectionHello=e,this.connectionAuth=e?.auth}}),this.polling=new ve(this,3e3,()=>this.refreshLive()),this.listTask=new T(this,{args:()=>[this.requestClient(),this.gateway.epoch,JSON.stringify(I(this.routeSearch)),this.selection.selector],task:async([e,,t,n],{signal:r})=>e?this.readArchive({client:e,method:`transcripts.list`,params:I(this.routeSearch),signal:r,current:()=>this.selection.selector===n&&JSON.stringify(I(this.routeSearch))===t,accept:e=>{this.listDenial=null,this.list=e}}):E}),this.summaryTask=new T(this,{args:()=>[this.requestClient(),this.gateway.epoch,this.selection.selector],task:async([e,,t],{signal:n})=>!e||!t?E:this.readArchive({client:e,method:`transcripts.get`,params:{selector:t},signal:n,current:()=>this.selection.selector===t,accept:e=>{this.readerDenial=null,this.summary=e,this.generateMissingSummary()}})}),this.readerTask=new T(this,{args:()=>[this.requestClient(),this.gateway.epoch,this.selection.selector,this.selection.query,this.readerCursor],task:async([e,,t,n,r],{signal:i})=>!e||!t?E:this.readArchive({client:e,method:`transcripts.get`,params:{selector:t,includeUtterances:!0,query:n||void 0,cursor:r??void 0,limit:50},signal:i,current:()=>this.selection.selector===t&&this.selection.query===n&&this.readerCursor===r,accept:e=>{this.readerDenial=null;let t=r?[...r===this.loadedReaderCursor?this.readerPages.slice(0,-1):this.readerPages,e]:[e];this.loadedReaderCursor=r,this.readerPages=t}})}),this.polling}requestClient(){let e=this.context?.gateway.snapshot;return this.isConnected&&e?.phase===`connected`&&b(e.hello?.auth??null)?e.client:null}get selection(){let e=new URLSearchParams(this.routeSearch);return{selector:e.get(`selector`)??``,query:(e.get(`find`)??``).slice(0,256)}}get readerTab(){let e=new URLSearchParams(this.routeSearch);return e.has(`tab`)?e.get(`tab`)===`transcript`?`text`:`summary`:this.selection.query?`text`:`summary`}async readArchive(e){let t=this.gateway.capture(),n=this.context.gateway,r=n.snapshot.hello,i=n.snapshot.hello?.auth,a=this.accessGeneration,o=()=>!e.signal.aborted&&this.requestClient()===e.client&&this.context.gateway===n&&n.snapshot.hello===r&&n.snapshot.hello?.auth===i&&t!==null&&this.gateway.isCurrent(t)&&this.accessGeneration===a&&e.current();try{let t=await e.client.request(e.method,e.params,{signal:e.signal});return o()?e.accept(t):E}catch(e){if(!o())return E;throw c(e)&&(this.accessGeneration++,this.cancelSummaryGeneration(),this.listDenial=e,this.readerDenial=e,this.list=null,this.summary=null,this.readerPages=[],this.cancelExport()),e}}willUpdate(e){if(e.has(`routeSearch`)){let t=new URLSearchParams(String(e.get(`routeSearch`)??``)),n=new URLSearchParams(this.routeSearch);t.get(`selector`)!==n.get(`selector`)&&(this.cancelSummaryGeneration(),this.summary=null,this.lastReaderRefresh=0),JSON.stringify(I(String(e.get(`routeSearch`)??``)))!==JSON.stringify(I(this.routeSearch))&&(this.list=null);for(let r of[...B,`find`])(t.get(r)!==n.get(r)||e.get(`routeSearch`)===void 0||r===`find`&&t.get(`selector`)!==n.get(`selector`))&&(this.drafts[r]=n.get(r)??``);(t.get(`selector`)!==(this.selection.selector||null)||t.get(`find`)!==(this.selection.query||null))&&(this.resetReader(),this.cancelExport(),this.focusSelection=e.get(`routeSearch`)!==void 0)}}updated(){let e=this.readerPages.at(-1)?.nextCursor;if(this.readerTask.status===w.COMPLETE&&document.visibilityState!==`hidden`&&!this.readerDenial&&e&&e!==this.readerCursor&&(this.readerCursor=e),!this.focusSelection)return;let t=this.selection.selector?this.querySelector(`.transcripts-reader h1, .transcripts-reader [role=alert]`):this.querySelector(`.transcripts-library input[name="query"]`);t&&(t.focus(),this.focusSelection=!1)}resetConnection(){this.cancelSummaryGeneration(),this.list=null,this.listDenial=null,this.readerDenial=null,this.summary=null,this.lastReaderRefresh=0,this.listTask.abort(),this.summaryTask.abort(),this.readerTask.abort(),this.cancelExport(),this.resetReader()}resetReader(){this.readerCursor=null,this.loadedReaderCursor=null,this.readerPages=[]}cancelExport(){this.exportAbort?.abort(),this.exportAbort=null,this.exportState={kind:`idle`}}cancelSummaryGeneration(){this.summaryAbort?.abort(),this.summaryAbort=null,this.summaryGeneration={kind:`idle`}}async generateMissingSummary(e=!1){let t=this.requestClient(),{selector:n}=this.selection,r=this.context.gateway,i=r.snapshot.hello,a=i?.auth,o=this.gateway.capture(),s=this.accessGeneration;if(!t||!n||!o||this.readerDenial||!le(a??null)||!this.summary||this.summary.summary||this.summary.session.utteranceCount===0||this.summaryGeneration.kind===`loading`||!e&&this.summaryGeneration.kind!==`idle`)return;let c=new AbortController;this.summaryAbort=c,this.summaryGeneration={kind:`loading`};let l=()=>!c.signal.aborted&&this.summaryAbort===c&&this.requestClient()===t&&this.context.gateway===r&&r.snapshot.hello===i&&r.snapshot.hello?.auth===a&&this.gateway.isCurrent(o)&&this.accessGeneration===s&&this.selection.selector===n;try{let e=await t.request(`transcripts.summarize`,{selector:n},{signal:c.signal,timeoutMs:12e4});if(!l())return;this.summaryTask.abort(),this.summary=e,this.summaryGeneration={kind:`done`}}catch(e){l()&&(this.summaryGeneration={kind:`error`,message:u(e)})}finally{this.summaryAbort===c&&(this.summaryAbort=null)}}navigate(e){for(let[t,n]of Object.entries(e))this.drafts[t]=n??``;this.requestUpdate(),this.context.navigate(`meetings`,{search:R(this.routeSearch,e)})}refresh(){this.cancelExport(),this.summary=null,this.resetReader(),new URLSearchParams(this.routeSearch).has(`cursor`)?this.navigate({cursor:null}):this.listTask.run(),this.summaryTask.run(),this.readerTask.run()}refreshLive(e=!1){if(!this.requestClient()||document.visibilityState===`hidden`||this.listDenial||this.readerDenial||(this.now=Date.now(),this.listTask.status!==w.PENDING&&this.listTask.run(),!this.selection.selector))return;let t=this.summary?.session??this.readerPages.at(-1)?.session,n=this.summary?.summary,r=t?.stoppedAt&&n?.generatedAt&&Date.parse(n.generatedAt)<Date.parse(t.stoppedAt),i=t?.active||!n||r?3e3:15e3;!e&&this.now-this.lastReaderRefresh<i||(this.lastReaderRefresh=this.now,this.summaryTask.status!==w.PENDING&&this.summaryTask.run(),this.readerTask.status!==w.PENDING&&this.readerTask.run())}async download(e){let t=this.requestClient(),{selector:n}=this.selection;if(!t||!n||this.exportState.kind===`loading`)return;let r=new AbortController;this.exportAbort=r,this.exportState={kind:`loading`};try{await this.readArchive({client:t,method:`transcripts.export`,params:{selector:n,format:e},signal:r.signal,current:()=>this.selection.selector===n,accept:e=>{let t=Uint8Array.from(atob(e.data),e=>e.charCodeAt(0)),n=URL.createObjectURL(new Blob([t],{type:e.mimeType})),r=document.createElement(`a`);try{r.href=n,r.download=e.filename,document.body.append(r),r.click(),this.exportState={kind:`done`}}finally{r.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),1e3)}}})}catch(e){this.exportAbort===r&&!r.signal.aborted&&(this.exportState={kind:`error`,message:u(e)})}finally{this.exportAbort===r&&(this.exportAbort=null)}}render(){let e=this.context.gateway.snapshot,t=this.requestClient(),n=this.readerTab===`summary`?this.summaryTask:this.readerTask,r={summary:this.summary,pages:this.readerPages,loading:n.status===w.PENDING,error:this.readerDenial??(n.status===w.ERROR?n.error:null)};return J({basePath:this.context.basePath,now:this.now,search:this.routeSearch,drafts:this.drafts,onDraft:(e,t)=>{this.drafts[e]=t},connected:e.phase===`connected`,allowed:b(e.hello?.auth??null),list:t?this.list:null,listLoading:!this.listDenial&&this.listTask.status===w.PENDING,listError:this.listDenial??(this.listTask.status===w.ERROR?this.listTask.error:null),reader:r,readerTab:this.readerTab,summaryGeneration:this.summaryGeneration,onSummaryRetry:()=>void this.generateMissingSummary(!0),exportState:this.exportState,onNavigate:e=>this.navigate(e),onRefresh:()=>this.refresh(),onReaderRetry:()=>{if(this.readerTab===`summary`){this.summaryTask.run();return}this.readerPages.length||this.resetReader(),this.summary||this.summaryTask.run(),this.readerTask.run()},onReaderTab:e=>{this.navigate({tab:e===`text`?`transcript`:`summary`})},onDownload:e=>void this.download(e)})}},i([n({context:ce,subscribe:!0})],Z.prototype,`context`,void 0),i([se({attribute:!1})],Z.prototype,`routeSearch`,void 0),i([_()],Z.prototype,`list`,void 0),i([_()],Z.prototype,`listDenial`,void 0),i([_()],Z.prototype,`readerDenial`,void 0),i([_()],Z.prototype,`readerCursor`,void 0),i([_()],Z.prototype,`now`,void 0),i([_()],Z.prototype,`summary`,void 0),i([_()],Z.prototype,`summaryGeneration`,void 0),i([_()],Z.prototype,`readerPages`,void 0),i([_()],Z.prototype,`exportState`,void 0),Q={header:!0,render:e=>p`<testclaw-meetings-page
      .routeSearch=${typeof e==`string`?e:``}
    ></testclaw-meetings-page>`},customElements.get(`testclaw-meetings-page`)||customElements.define(`testclaw-meetings-page`,Z)})))()}$();export{Q as meetingsPageComponent};
//# sourceMappingURL=meetings-page-Cljut384.js.map