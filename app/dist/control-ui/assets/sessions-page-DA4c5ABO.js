const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-BUmhTcxK.js","./input-dialog-BosD-bnA.js","./control-ui-core-CBmGCeuQ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,Jr as n,Sr as r,eo as i,er as a,lo as o,oo as s,qr as c,ti as l,un as u,wa as d,yr as f}from"./control-ui-foundation-CGMdhB5v.js";import{$l as p,Ac as m,Bl as h,Bs as g,Di as _,Fs as v,Hl as y,Ho as b,Is as x,Jc as ee,Jl as S,Nr as C,Qc as w,Qi as T,Rs as E,Si as te,Wo as ne,Xn as re,Yc as ie,Yn as ae,_c as D,_n as oe,ac as se,bl as ce,cl as le,dl as O,dn as ue,el as de,fc as fe,fn as pe,gc as me,hc as he,ic as ge,in as k,lt as _e,mc as A,ou as j,qc as ve,sa as ye,sl as M,ut as be,vi as xe,wi as Se,wn as Ce,xi as we}from"./control-ui-core-S9jKXqB5.js";import{$ as N,X as P,Y as F,_ as Te,ct as I,m as Ee,nt as De,ut as Oe}from"./lit-runtime-DWoPVI38.js";import{Di as ke,Fi as L,Ii as Ae,Mn as je,Ni as Me,Oi as Ne,Qa as Pe,do as Fe,fo as Ie,jn as Le}from"./control-ui-core-G2U4O6rB.js";import{c as Re,u as ze}from"./gateway-runtime-BV4hxqU_.js";import{$i as Be,B as Ve,Bi as He,Ca as Ue,I as We,Ji as Ge,Jo as Ke,L as qe,Mo as Je,P as Ye,Qi as Xe,Qo as Ze,Ri as Qe,Vl as $e,Zi as et,ba as R,bo as tt,da as nt,go as rt,ha as it,ho as at,jo as z,la as ot,ln as B,mi as st,pi as ct,qi as lt,sn as ut,un as dt,va as ft,vl as pt,yl as mt,yo as ht,z as gt}from"./control-ui-boot-shared-ooxiG3qa.js";import{H as _t,U as vt,V as yt}from"./control-ui-boot-shared-C3bL_9oq.js";import{At as V,Gt as bt,Ia as xt,Kt as St,Ot as H,Qr as Ct,Ri as wt,Zr as Tt,_i as Et,_t as Dt,ht as Ot,kt,lo as At,nt as jt,tt as Mt,uo as U,vi as Nt,wt as Pt}from"./control-ui-boot-shared-CCYBAAP9.js";import{a as Ft,n as It,o as Lt,r as Rt,t as zt}from"./session-workspace-recovery.runtime-QWgA3KCE.js";import{f as Bt,l as Vt}from"./control-ui-boot-shared-BnfqoX89.js";import{n as Ht,r as Ut,t as Wt}from"./control-ui-boot-shared-VDjYq2Zh.js";import{n as Gt,t as Kt}from"./transcript-search-BiwnFjzt.js";import{n as qt,t as Jt}from"./cloud-worker-stop.runtime-DO3e3-fh.js";import{n as Yt,t as Xt}from"./settings-workspace-DJAhLnkQ.js";import{n as Zt,t as Qt}from"./agent-row-chip-LzqZKgRH.js";import{o as $t,s as en}from"./presenter-wVFa7WAH.js";import{n as tn,t as nn}from"./agent-scope-control-DE_nXHBu.js";import{n as rn,t as an}from"./capacity-meter-WRJGAD19.js";import{n as on,t as sn}from"./sessions-hub-header-B0Yf5Iz2.js";function cn(e){return[...new Set((e?.sessions??[]).map(e=>M(e.key)?.agentId).filter(e=>!!e))]}function ln(e,t){return Object.fromEntries(cn(e).map(e=>[e,t(e)]).filter(e=>!!e[1]))}function un(){return(un=e((()=>{w()})))()}function dn(e,{key:t,sessionId:n,pinned:r},i){let a=e.captureConnectionScope();return a?o=>{e.isConnectionScopeCurrent(a)&&o.entry.sessionId===n&&te({message:p(`sessionsView.sessionArchived`),actionLabel:p(`common.undo`),onAction:()=>{e.isConnectionScopeCurrent(a)&&e.patch(t,{archived:!1,...r===!0?{pinned:!0}:{}},{agentId:i,expectedSessionId:n}).catch(t=>{e.isConnectionScopeCurrent(a)&&te({message:E(t)})})}})}:null}function fn(){return(fn=e((()=>{S(),g(),we()})))()}function pn(e,t){let n=(e?.sessions??[]).map(e=>e.category?.trim()).filter(e=>!!e);return[...new Set([...t,...n.toSorted((e,t)=>e.localeCompare(t))])]}async function mn(e){if(!e.sessions||e.knownCategories.includes(e.name))return`completed`;try{return await e.sessions.groupsPut([...e.sessions.state.groups??[],e.name])===`completed`&&e.isCurrent()?`completed`:`stale`}catch(t){return e.isCurrent()?(e.onError(E(t)),`failed`):`stale`}}function hn(){return(hn=e((()=>{g()})))()}function gn(e,t){let n=t.deepLinkSessionKey?.trim()||null,r=M(n)?.agentId??e.agentSelection.state.scopeId?.trim(),i=!n&&t.statusFilter===`active`?t.activeMinutes:void 0;return{limit:n?50:t.limit,...i?{activeMinutes:i}:{},...n||t.search?.trim()?{search:n??t.search.trim()}:{},includeGlobal:n?!0:t.includeGlobal,includeUnknown:n?!0:t.includeUnknown,includeDerivedTitles:!1,includeLastMessage:!1,archivedFilter:t.statusFilter,...r?{agentId:r}:{}}}function _n(){return(_n=e((()=>{Ce(),w()})))()}function vn(){return Ue(j()?.getItem(W))}function yn(e){try{j()?.setItem(W,e)}catch{}}var W;function bn(){return(bn=e((()=>{R(),W=`testclaw:sessions:group-by`})))()}function xn(e){let{context:t,row:n}=e,r=t.gateway.snapshot,i=O({agentsList:t.agents.state.agentsList,hello:r.hello}),a=ee(n,i),s=ie([n],i),c=Nt(n.placement),l=!(!c||c.blocksActiveRun&&n.hasActiveRun===!0||ze(r,c.method)!==!0),u=de(n);return N`
    <testclaw-session-menu
      .session=${{label:o(n.label)??n.key,sessionId:o(n.sessionId)??null,pinned:n.pinned===!0,pinnable:u,unread:n.unread===!0,hiddenFromInvolvingMe:n.hiddenFromInvolvingMe,archived:n.archived===!0,archiving:t.sessions.archiveVisibility(n.key)===`pending`,category:o(n.category)??null,icon:o(n.icon)??null,color:o(n.color)??null,categoryClearReturnsToGroups:!1}}
      .anchor=${e.menu}
      .trigger=${e.trigger}
      .disabled=${e.disabled}
      .navigationAllowed=${!0}
      .copyMarkdownAllowed=${ut(r)}
      .splitAllowed=${!1}
      .actionDisabledReasons=${St({snapshot:r,session:{...n,pinnable:u},cloudWorkerStopAction:c})}
      .forkDisabled=${n.modelSelectionLocked===!0}
      .forkFromLastCompleted=${n.hasActiveRun===!0}
      .archiveAllowed=${a}
      .deleteAllowed=${s}
      .cloudWorkerStopAllowed=${l}
      .groups=${e.groups}
      .work=${e.work}
      .pluginActions=${Ht(t.plugins,n)}
      .onClose=${e.onClose}
      .onAction=${e.onAction}
    ></testclaw-session-menu>
  `}function Sn(){return(Sn=e((()=>{F(),Et(),bt(),Re(),w(),B(),Wt()})))()}function Cn(e){return p(G[e]??G.none)}function wn(e){let t=[`session-filter-check`,`session-filter-toggle`,e.extraClass??``,e.checked?`session-filter-check--active`:``].filter(Boolean).join(` `);return N`
    <testclaw-tooltip .content=${e.title}>
      <label class=${t}>
        <input
          name=${e.name}
          class="session-filter-check__input"
          type="checkbox"
          .checked=${e.checked}
          @change=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onChange(t.currentTarget.checked)}}
        />
        <span class="session-filter-check__mark" aria-hidden="true">${L.check}</span>
        <span class="session-filter-check__label">${e.label}</span>
      </label>
    </testclaw-tooltip>
  `}function Tn(e,t){e.currentTarget instanceof Element&&e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,String(t))}function En(e){let t=[[`activeMinutes`,`minutes`,p(`sessionsView.active`),p(`sessionsView.activeTooltip`,{count:e.activeMinutes.trim()}),p(`sessionsView.minutesPlaceholder`),e.statusFilter!==`active`],[`limit`,`limit`,p(`sessionsView.limit`),p(`sessionsView.limitTooltip`),P,!1]],n=[[`includeGlobal`,p(`sessionsView.global`),p(`sessionsView.globalTooltip`)],[`includeUnknown`,p(`sessionsView.unknown`),p(`sessionsView.unknownTooltip`)]],{activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o}=e,s=(t,n)=>e.onFiltersChange({activeMinutes:r,limit:i,includeGlobal:a,includeUnknown:o,[t]:n}),c=r.trim()!==``||i.trim()!==`50`||!a||o||e.groupBy!==`none`;return N`
    <button
      id="sessions-filter-popover-trigger"
      type="button"
      class="btn btn--sm sessions-filter-popover__trigger ${c?`active`:``}"
      title=${p(`sessionsView.filters`)}
      aria-label=${p(`sessionsView.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${L.listFilter}
    </button>
    <wa-popover
      ${Te(jt)}
      class="sessions-filter-popover"
      for="sessions-filter-popover-trigger"
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>Tn(e,!0)}
      @wa-hide=${e=>Tn(e,!1)}
    >
      <div class="sessions-filter-popover__panel">
        <div class="sessions-filter-popover__fields">
          ${t.map(([t,n,r,i,a,o])=>N`
              <testclaw-tooltip .content=${i}>
                <label class="session-filter-field">
                  <span class="session-filter-label">${r}</span>
                  <input
                    class="session-filter-input session-filter-input--${n}"
                    placeholder=${a}
                    .value=${e[t]}
                    ?disabled=${o}
                    @input=${e=>{e.currentTarget instanceof HTMLInputElement&&s(t,e.currentTarget.value)}}
                  />
                </label>
              </testclaw-tooltip>
            `)}
        </div>
        <div
          class="session-filter-toggle-group"
          role="group"
          aria-label=${p(`sessionsView.sourceFilters`)}
        >
          ${n.map(([t,n,r])=>wn({name:t,checked:e[t],label:n,title:r,onChange:e=>s(t,e)}))}
        </div>
        <label class="session-groupby">
          <span class="session-groupby__label">${p(`sessionsView.groupBy`)}</span>
          <select
            class="session-groupby__select"
            @change=${t=>{t.currentTarget instanceof HTMLSelectElement&&e.onGroupByChange(Ue(t.currentTarget.value))}}
          >
            ${it.filter(t=>t!==`person`||e.personGroupingAvailable).map(t=>N`
                <option value=${t} ?selected=${e.groupBy===t}>
                  ${Cn(t)}
                </option>
              `)}
          </select>
        </label>
        ${e.groupBy===`category`?N`
                <button
                  class="btn btn--sm"
                  ?disabled=${!!e.groupWriteDisabledReason}
                  title=${e.groupWriteDisabledReason??P}
                  @click=${()=>e.onRequestNewCategory()}
                >
                  ${L.plus} ${p(`sessionsView.newGroup`)}
                </button>
              `:P}
      </div>
    </wa-popover>
  `}var G;function Dn(){return(Dn=e((()=>{F(),Ee(),Ae(),Me(),Mt(),S(),R(),b(),G={none:`sessionsView.groupByNone`,category:`sessionsView.groupByCategory`,person:`sessionsView.groupByPerson`,channel:`sessionsView.groupByChannel`,kind:`sessionsView.groupByKind`,agent:`sessionsView.groupByAgent`,date:`sessionsView.groupByDate`}})))()}function On(e,t){let n=t.find(t=>t.key===e.sessionKey);return o(n?.label)??o(n?.displayName)??e.sessionKey}function kn(e){let t=e.transcriptSearchQuery.trim().length>0,n=e.transcriptSearch,r=n.status===`results`?n.results:[],i=n.status===`results`?n.sessions:[],a=n.status===`loading`;return N`
    <section
      class="sessions-transcript-search"
      aria-label=${p(`sessionsView.transcriptSearchTitle`)}
    >
      <form
        class="sessions-transcript-search__form"
        role="search"
        aria-label=${p(`sessionsView.transcriptSearchTitle`)}
        @submit=${n=>{n.preventDefault(),e.transcriptSearchAvailable&&t&&!a&&e.onTranscriptSearch()}}
      >
        <div class="data-table-search sessions-transcript-search__input">
          <input
            type="search"
            maxlength="4096"
            aria-label=${p(`sessionsView.transcriptSearchInputLabel`)}
            placeholder=${p(`sessionsView.transcriptSearchPlaceholder`)}
            .value=${e.transcriptSearchQuery}
            ?disabled=${!e.transcriptSearchAvailable}
            @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onTranscriptSearchChange(t.currentTarget.value)}}
          />
        </div>
        <button
          class="btn primary"
          type="submit"
          ?disabled=${!e.transcriptSearchAvailable||!t||a}
        >
          ${p(a?`sessionsView.transcriptSearchSearching`:`sessionsView.transcriptSearchAction`)}
        </button>
        ${t?N`
                <button class="btn" type="button" @click=${e.onClearTranscriptSearch}>
                  ${p(`sessionsView.transcriptSearchClear`)}
                </button>
              `:P}
      </form>
      ${e.transcriptSearchAvailable?P:N`
              <div class="muted" role="status">
                ${p(`sessionsView.transcriptSearchUnavailable`)}
              </div>
            `}
      <div
        class="sessions-transcript-search__status"
        aria-live="polite"
        aria-busy=${a?`true`:`false`}
      >
        ${a?N`<span class="muted">${p(`sessionsView.transcriptSearchSearching`)}</span>`:P}
        ${n.status===`error`?N`
                <div
                  class="sessions-transcript-search__notice sessions-transcript-search__notice--danger"
                >
                  <span>${p(`sessionsView.transcriptSearchError`)}: ${n.message}</span>
                  <button class="btn btn--sm" type="button" @click=${e.onTranscriptSearch}>
                    ${p(`sessionsView.transcriptSearchRetry`)}
                  </button>
                </div>
              `:P}
        ${n.status===`results`&&n.indexing?N`
                <div class="sessions-transcript-search__notice">
                  <span>${p(`sessionsView.transcriptSearchIndexing`)}</span>
                  <button
                    class="btn btn--sm"
                    type="button"
                    ?disabled=${a}
                    @click=${e.onTranscriptSearch}
                  >
                    ${p(`sessionsView.transcriptSearchRetry`)}
                  </button>
                </div>
              `:P}
        ${n.status===`results`&&n.archivedTranscriptsExcluded>0?N`<div class="sessions-transcript-search__notice">
                ${p(`sessionsView.transcriptSearchArchivedExcluded`,{count:String(n.archivedTranscriptsExcluded)})}
              </div>`:P}
        ${n.status===`results`&&r.length===0&&!n.indexing?N`
                <div class="sessions-transcript-search__empty" role="status">
                  ${p(`sessionsView.transcriptSearchEmpty`)}
                </div>
              `:P}
        ${r.length>0?N`
                <div class="sessions-transcript-search__results">
                  <div class="sessions-transcript-search__summary">
                    <strong
                      >${p(`sessionsView.transcriptSearchMatches`,{count:String(r.length)})}</strong
                    >
                    ${n.status===`results`&&n.truncated?N`<span class="muted"
                            >${p(`sessionsView.transcriptSearchTruncated`)}</span
                          >`:P}
                  </div>
                  <div class="sessions-transcript-search__list">
                    ${r.map(t=>{let n=t.timestamp>0?pe(t.timestamp):p(`common.na`),r=t.timestamp>0?ue(t.timestamp):n;return N`
                        <button
                          class="sessions-transcript-search__result"
                          type="button"
                          @click=${()=>e.onNavigateToChat?.(t.sessionKey)}
                        >
                          <span class="sessions-transcript-search__result-header">
                            <strong>${On(t,i)}</strong>
                            <span class="muted" title=${r}>
                              ${p(`sessionsView.${t.role}`)} · ${n}
                            </span>
                          </span>
                          <span class="sessions-transcript-search__snippet">${t.snippet}</span>
                          <span class="sessions-transcript-search__key">${t.sessionKey}</span>
                        </button>
                      `})}
                  </div>
                </div>
              `:P}
      </div>
    </section>
  `}function An(){return(An=e((()=>{F(),S(),pt(),oe(),mt()})))()}function jn(e,t){return Object.hasOwn(e,t)?e[t]??null:null}function Mn(e,t){let n=Ve({catalog:[],session:e,defaults:t,sessionKey:e.key,sessionsResult:null});return[{value:``,label:n.inherited.displayLabel},...n.options]}function K(e,t){return!t||e.some(e=>e.value===t)?[...e]:[...e,{value:t,label:We(t)}]}function q(e,t=!1){return e.map(e=>({value:e,label:p(e===``?`sessionsView.inherit`:t&&e===`off`?`sessionsView.offExplicit`:`sessionsView.${e}`)}))}function Nn(e){return p(rr[e]??`sessionsView.statusUnknown`)}function Pn(e){let t=u(e),n=e.hasActiveRun===!1&&(!e.status||e.status===`running`),r=e.status===`queued`?p(`sessionsView.statusQueued`):t?p(`sessionsView.statusLive`):n?p(`sessionsView.statusIdle`):e.status?Nn(e.status):p(`sessionsView.statusUnknown`),i=e.status===`queued`?`warn`:t||e.status===`done`?`ok`:n||!e.status?`muted`:`danger`,a=`${p(`sessionsView.status`)}: ${r}`;return N`
    <testclaw-tooltip .content=${a}>
      ${V({kind:i,label:r})}
    </testclaw-tooltip>
  `}function Fn(e){let t=_(e);return N`
    <span class="session-avatar session-avatar--${t}" aria-hidden="true">
      ${Z[t]??L.circle}
      ${u(e)?N`<span class="session-avatar__status"></span>`:P}
    </span>
  `}function In(e){let t=e.totalTokens;if(typeof t!=`number`||!Number.isFinite(t))return N`<span class="muted">${p(`common.na`)}</span>`;let n=e.totalTokensFresh!==!1,r=`${n?``:`~`}${k(t)}`,i=Ye(e),a=i.tokens>0?i.tokens:null;if(!a)return N`<span class="session-tokens__value">${r}</span>`;let o=Math.min(100,Math.round(t/a*100)),s=n?o>=ar?`danger`:o>=ir?`warn`:`ok`:`stale`,c=p(i.fromLastPrompt?n?`sessionsView.promptBudgetUsage`:`sessionsView.promptBudgetUsageApprox`:n?`sessionsView.contextUsage`:`sessionsView.contextUsageApprox`,{percent:String(o),used:t.toLocaleString(),context:a.toLocaleString()});return N`
    <testclaw-tooltip .content=${c}>
      <div class="session-tokens">
        <span class="session-tokens__value"
          >${r} / ${k(a)}</span
        >
        ${rn({mode:`continuous`,percent:o,tone:s,label:c})}
      </div>
    </testclaw-tooltip>
  `}function Ln(e,t,n){let r=e.filter(e=>e.unread===!0&&e.archived!==!0).length,i=e.filter(e=>e.archived===!0).length,a=[[String(t),p(`sessionsView.statusLive`),t>0],[String(r),p(`sessionsView.unread`),r>0]];return n!==`active`&&a.push([String(i),p(`sessionsView.archived`),!1]),N`
    <span class="sessions-heading-facts">
      ${a.map(([e,t,n],r)=>N`
          ${r>0?N`<span class="sessions-heading-fact__separator" aria-hidden="true">·</span>`:P}
          <span
            class=${n?`sessions-heading-fact sessions-heading-fact--active`:`sessions-heading-fact`}
          >
            <strong>${e}</strong> ${t}
          </span>
        `)}
    </span>
  `}function Rn(e){return Array.from({length:or},(t,n)=>N`
      <tr class="session-skeleton-row" aria-hidden="true">
        ${Array.from({length:e},(e,t)=>t===0?N`<td class="data-table-checkbox-col"></td>`:N`<td>
                <span
                  class="session-skeleton ${t===1?`session-skeleton--key`:``}"
                  style=${`animation-delay: ${n*120}ms`}
                ></span>
              </td>`)}
      </tr>
    `)}function zn(e,t,n){let r=t*n;return e.slice(r,r+n)}function Bn(e){return s(e.searchQuery).length>0||r(e.activeMinutes)!==void 0||!e.includeGlobal}function Vn(e){return typeof e!=`number`||!Number.isFinite(e)||e<0?null:ot(e)??`0ms`}function Hn(e){if(!e)return P;let t=e.status===`active`||e.status===`complete`?`ok`:`warn`,n=Vt(e);return N`
    <testclaw-tooltip .content=${n}>
      <span tabindex="0" aria-label=${n}>
        ${V({kind:t,label:Bt(e)})}
      </span>
    </testclaw-tooltip>
  `}function Un(e){let{row:t,updated:n}=e,r=[{label:p(`sessionsView.key`),value:t.key},{label:p(`sessionsView.kind`),value:_(t)},{label:p(`sessionsView.updated`),value:n},{label:p(`sessionsView.tokens`),value:$t(t)}],i=(e,t)=>{let n=o(t);n&&r.push({label:e,value:n})};i(p(`sessionsView.group`),t.category),i(p(`sessionsView.status`),t.status),t.goal&&r.push({label:p(`sessionsView.goal`),value:Vt(t.goal)}),i(p(`sessionsView.goalNote`),t.goal?.lastStatusNote),i(p(`sessionsView.model`),t.model),i(p(`sessionsView.provider`),t.modelProvider),i(p(`sessionsView.runtime`),a(t.agentRuntime)),i(p(`sessionsView.runDuration`),Vn(t.runtimeMs)),i(p(`sessionsView.surface`),t.surface),i(p(`sessionsView.subject`),t.subject),i(p(`sessionsView.room`),t.room),i(p(`sessionsView.space`),t.space),i(p(`sessionsView.sessionId`),t.sessionId),t.archiveReason&&r.push({label:p(`sessionsView.archiveReason`),value:ct(t.archiveReason)});for(let[e,n]of[[p(`sessionsView.activeRun`),t.hasActiveRun],[p(`sessionsView.archived`),t.archived],[p(`sessionsView.pinned`),t.pinned]])typeof n==`boolean`&&r.push({label:e,value:p(n?`common.yes`:`common.no`)});return r}function J(e){return e.groupBy===`category`?8:7}function Wn(e,t){let{id:n}=e;if(t.groupBy===`date`)return p({today:`sessionsView.dateToday`,yesterday:`sessionsView.dateYesterday`,week:`sessionsView.dateThisWeek`,older:`sessionsView.dateOlder`}[n]??`sessionsView.dateNoActivity`);if(n===``)return p(`sessionsView.ungrouped`);if(t.groupBy===`agent`){let e=jn(t.agentIdentityById,n),r=o(e?.name);if(r){let t=o(e?.emoji);return t?`${t} ${r}`:r}}if(t.groupBy===`person`){let t=e.rows[0]?.owner?.actor;return t?.identity?.type===`profile`?Ze({id:t.identity.id,name:t.label?.trim()||n}):t?.label?.trim()||n}return n}function Y(e,t){e.currentTarget?.classList.toggle(`session-drop-target--active`,t)}function Gn(e,t){if(e.groupBy!==`category`||e.groupWriteDisabledReason)return{dragover:P,dragleave:P,drop:P};let n=e=>e.dataTransfer?.types.includes(z)===!0;return{dragover:e=>{n(e)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`),Y(e,!0))},dragleave:e=>Y(e,!1),drop:r=>{if(!n(r))return;r.preventDefault(),Y(r,!1);let i=r.dataTransfer?.getData(z);i&&e.onAssignCategory(i,t)}}}function Kn(e,t){let n=Wn(e,t),r=e.rows.length===1?p(`sessionsView.groupRowCountOne`,{count:`1`}):p(`sessionsView.groupRowCount`,{count:String(e.rows.length)}),i=Gn(t,e.id===``?null:e.id);return N`
    <tr
      class="session-group-row"
      @dragover=${i.dragover}
      @dragleave=${i.dragleave}
      @drop=${i.drop}
    >
      <td colspan=${J(t)}>
        <div class="session-group-row__header">
          <span class="session-group-row__icon" aria-hidden="true">${L.folder}</span>
          <span class="session-group-row__label">${n}</span>
          <span class="session-group-row__count">${r}</span>
        </div>
      </td>
    </tr>
  `}function qn(e,t){let n=o(e.category)??``,r=[...t.knownCategories];return n&&!r.includes(n)&&r.push(n),N`
    <td>
      <select
        ?disabled=${t.loading||!!t.groupWriteDisabledReason}
        title=${t.groupWriteDisabledReason??P}
        aria-label=${p(`sessionsView.moveToGroup`)}
        class="session-group-select"
        @change=${r=>{if(t.groupWriteDisabledReason)return;let i=r.target;if(i.value===Q){i.value=n,t.onRequestNewCategory(e.key);return}t.onAssignCategory(e.key,i.value||null)}}
      >
        <option value="" ?selected=${!n}>${p(`sessionsView.ungrouped`)}</option>
        ${r.map(e=>N`<option value=${e} ?selected=${n===e}>${e}</option>`)}
        <option value=${Q}>${p(`sessionsView.newGroup`)}</option>
      </select>
    </td>
  `}function Jn(e){return e instanceof Element&&!!e.closest(`a, button, input, label, select, textarea`)}function X(e){return N`
    <label class="session-override-field">
      <span class="session-override-field__label">${e.label}</span>
      <select
        class="settings-select"
        ?disabled=${e.disabled}
        title=${e.disabledReason??P}
        @change=${t=>e.onChange(t.target.value)}
      >
        ${e.options.map(t=>N`<option value=${t.value} ?selected=${e.current===t.value}>
              ${t.label}
            </option>`)}
      </select>
    </label>
  `}function Yn(e){let t=e.result?.sessions??[],n=e.sortDir===`asc`?1:-1,r=t.toSorted((t,r)=>{let i=(r.pinnedAt??0)-(t.pinnedAt??0);return i===0?(e.sortColumn===`kind`?_(t).localeCompare(_(r)):e.sortColumn===`key`?t.key.localeCompare(r.key):e.sortColumn===`updated`?(t.updatedAt??0)-(r.updatedAt??0):(t.totalTokens??t.inputTokens??t.outputTokens??0)-(r.totalTokens??r.inputTokens??r.outputTokens??0))*n:i}),i=r.length,a=Math.max(1,Math.ceil(i/e.pageSize)),o=Math.min(e.page,a-1),s=e.groupBy===`none`?null:ft({rows:r,mode:e.groupBy,knownCategories:e.knownCategories}),c=zn(s?s.flatMap(e=>e.rows):r,o,e.pageSize),l=t.length===0&&Bn(e),d=t.filter(e=>u(e)).length,f=t.filter(e=>e.archived===!0).length,m=e.statusFilter===`archived`?p(`sessionsView.noArchivedSessions`):e.statusFilter===`active`?p(`sessionsView.noActiveSessions`):p(`sessionsView.noSessions`),h=(t,n,r=``)=>{let i=e.sortColumn===t,a=i&&e.sortDir===`asc`?`desc`:`asc`;return N`
      <th
        class=${r}
        data-sortable
        data-sort-dir=${i?e.sortDir:``}
        aria-sort=${i?e.sortDir===`asc`?`ascending`:`descending`:P}
        @click=${()=>e.onSortChange(t,i?a:`desc`)}
      >
        <button class="data-table-sort-button" type="button">
          ${n}
          <span class="data-table-sort-icon" aria-hidden="true">${L.arrowUpDown}</span>
        </button>
      </th>
    `},g=N`
    ${p(`sessionsView.title`)}
    ${e.result?N`
            <testclaw-tooltip .content=${p(`sessionsView.store`,{path:e.result.path})}>
              <span class="settings-count">${t.length}</span>
            </testclaw-tooltip>
          `:P}
    ${e.result?Ln(t,d,e.statusFilter):P}
  `,v=N`
    ${e.statusFilter===`archived`?N`
            <button
              class="btn danger"
              ?disabled=${e.loading||f===0||!!e.deleteArchivedDisabledReason}
              title=${e.deleteArchivedDisabledReason??P}
              @click=${e.onDeleteAllArchived}
            >
              ${L.trash} ${p(`sessionsView.deleteAllArchived`)}
            </button>
          `:P}
    <button class="btn" ?disabled=${e.refreshing} @click=${e.onRefresh}>
      ${e.refreshing?p(`common.loading`):p(`common.refresh`)}
    </button>
  `,y=[e.error?N`<div class="sessions-error" role="alert">${e.error}</div>`:P,H({title:p(`sessionsView.transcriptSearchTitle`)},kn(e)),H({title:g,actions:v},Xn(e,{paginated:c,groups:s,emptyBecauseFiltered:l,emptyMessage:m,totalRows:i,totalPages:a,page:o,sortHeader:h}))];return Pt(y,{wide:!0})}function Xn(e,t){let{paginated:n,groups:r,emptyBecauseFiltered:i,emptyMessage:a,totalRows:o,totalPages:s,page:c}=t,l=t.sortHeader,u=i?p(`sessionsView.noSessionsMatchFilters`):a,d=r?new Set(n.map(e=>e.key)):null;return N`
    <div
      class="sessions-toolbar sessions-filter-bar"
      role="group"
      aria-label=${p(`sessionsView.filterControls`)}
    >
      <div class="data-table-search sessions-toolbar__search">
        ${L.search}
        <input
          type="text"
          aria-label=${p(`sessionsView.searchPlaceholder`)}
          placeholder=${p(`sessionsView.searchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${t=>e.onSearchChange(t.target.value)}
        />
      </div>
      ${kt({value:e.statusFilter,ariaLabel:p(`sessionsView.sessionState`),className:`sessions-view-segment`,options:[{value:`active`,label:p(`common.active`)},{value:`archived`,label:p(`sessionsView.archived`),title:p(`sessionsView.archivedOnlyTooltip`)},{value:`all`,label:p(`sessionsView.all`)}],onChange:t=>e.onStatusFilterChange(t)})}
      ${En(e)}
    </div>

    ${e.selectedKeys.size>0?N`
            <div class="data-table-bulk-bar">
              <span>${p(`sessionsView.selected`,{count:String(e.selectedKeys.size)})}</span>
              <button class="btn btn--sm" @click=${e.onDeselectAll}>
                ${p(`common.unselect`)}
              </button>
              <button
                class="btn btn--sm danger"
                ?disabled=${e.loading||!!e.deleteSelectedDisabledReason}
                title=${e.deleteSelectedDisabledReason??P}
                @click=${e.onDeleteSelected}
              >
                ${L.trash} ${p(`sessionsView.deleteSelected`)}
              </button>
            </div>
          `:P}

    <div class="data-table-container">
      <table class="data-table sessions-table">
        <thead>
          <tr>
            <th class="data-table-checkbox-col">
              ${n.length>0?N`<input
                      type="checkbox"
                      .checked=${n.length>0&&n.every(t=>e.selectedKeys.has(t.key))}
                      .indeterminate=${n.some(t=>e.selectedKeys.has(t.key))&&!n.every(t=>e.selectedKeys.has(t.key))}
                      @change=${()=>{n.every(t=>e.selectedKeys.has(t.key))?e.onDeselectPage(n.map(e=>e.key)):e.onSelectPage(n.map(e=>e.key))}}
                      aria-label=${p(`sessionsView.selectAllOnPage`)}
                    />`:P}
            </th>
            ${l(`key`,p(`sessionsView.key`),`data-table-key-col`)}
            ${e.groupBy===`category`?N`<th>${p(`sessionsView.group`)}</th>`:P}
            ${l(`kind`,p(`sessionsView.kind`))}
            <th class="session-status-col">${p(`sessionsView.status`)}</th>
            ${l(`updated`,p(`sessionsView.updated`))}
            ${l(`tokens`,p(`sessionsView.tokens`))}
            <th class="session-actions-col">
              <span class="sr-only">${p(`sessionsView.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${e.loading&&!e.result?Rn(J(e)):n.length===0&&(e.loading||e.error||!e.result)?P:n.length===0?N`
                      <tr>
                        <td
                          colspan=${J(e)}
                          class="data-table-empty-cell"
                        >
                          <div class="data-table-empty-state" role="status" aria-live="polite">
                            <div class="data-table-empty-state__message">
                              ${i?L.search:L.messageSquare}
                              <span>${u}</span>
                            </div>
                            ${i?N`
                                    <button class="btn btn--sm" @click=${e.onClearFilters}>
                                      ${p(`sessionsView.showAll`)}
                                    </button>
                                  `:P}
                          </div>
                        </td>
                      </tr>
                    `:r?r.flatMap(t=>{let n=t.rows.filter(e=>d?.has(e.key));if(n.length===0&&t.rows.length>0)return[];let r=n.flatMap(t=>Zn(t,e));return r.unshift(Kn(t,e)),r}):n.flatMap(t=>Zn(t,e))}
        </tbody>
      </table>
    </div>

    ${o>0?N`
            <div class="data-table-pagination">
              <div class="data-table-pagination__info">
                ${p(`sessionsView.pagination`,{start:String(c*e.pageSize+1),end:String(Math.min((c+1)*e.pageSize,o)),total:String(o)})}
              </div>
              <div class="data-table-pagination__controls">
                <select
                  class="data-table-pagination__size"
                  aria-label=${p(`sessionsView.pageSize`)}
                  .value=${String(e.pageSize)}
                  @change=${t=>e.onPageSizeChange(Number(t.target.value))}
                >
                  ${nr.map(t=>N`<option value=${t} ?selected=${t===e.pageSize}>
                        ${p(`sessionsView.rowsPerPage`,{count:String(t)})}
                      </option>`)}
                </select>
                ${e.result?.hasMore&&e.result.nextOffset!=null?N` <button ?disabled=${e.loading} @click=${e.onLoadMore}>
                        ${p(`chat.selectors.loadMoreRosterSessions`)}
                      </button>`:P}
                <button ?disabled=${c<=0} @click=${()=>e.onPageChange(c-1)}>
                  ${p(`common.previous`)}
                </button>
                <button
                  ?disabled=${c>=s-1}
                  @click=${()=>e.onPageChange(c+1)}
                >
                  ${p(`common.next`)}
                </button>
              </div>
            </div>
          `:P}
  `}function Zn(e,t){let n=e.updatedAt?pe(e.updatedAt):p(`common.na`),r=t.expandedSessionKey===e.key,i=`session-details-${encodeURIComponent(e.key)}`,a=o(e.displayName)??null,s=o(e.label)??``,c=!!(a&&a!==e.key&&a!==s),l=le(e.key),u=l?jn(t.agentIdentityById,l.agentId):null,d=o(u?.emoji)??``,f=o(u?.name)??``,m=f&&l?`${d?`${d} `:``}${f} (${l.channel})`:null,h=m??e.key,g=e.kind!==`global`,y=g?D({face:he(e),sessionKey:e.key,fallbackAgentId:t.agentId,basePath:t.basePath,row:e,mainKey:t.mainKey}).href:null,b=_(e),x=`session-kind session-kind--${b}`,ee=[`session-data-row`,`session-data-row--expandable`,t.statusFilter===`all`&&e.archived===!0?`session-data-row--archived`:``,r?`session-data-row--expanded`:``,t.sessionMenu?.key===e.key?`session-data-row--menu-open`:``].filter(Boolean).join(` `),S=p(r?`sessionsView.hideSessionDetails`:`sessionsView.showSessionDetails`,{count:h}),C=t.groupBy===`category`,w=Gn(t,o(e.category)??null),T=n=>v(n,n instanceof KeyboardEvent?n.currentTarget.querySelector(`button[aria-haspopup="menu"]`):null,(n,r,i)=>t.onOpenSessionMenu(e,{x:r,y:i},n));return[N`<tr
      class=${ee}
      tabindex="0"
      aria-controls=${r?i:P}
      draggable=${C?`true`:P}
      aria-description=${C?p(`sessionsView.dragSessionHint`):P}
      @dragstart=${C?t=>{t.dataTransfer?.setData(z,e.key),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)}:P}
      @dragover=${w.dragover}
      @dragleave=${w.dragleave}
      @drop=${w.drop}
      @contextmenu=${T}
      @click=${n=>{Jn(n.target)||t.onToggleDetails(e.key)}}
      @keydown=${n=>{T(n),!n.defaultPrevented&&(Jn(n.target)||(n.key===`Enter`||n.key===` `)&&(n.preventDefault(),t.onToggleDetails(e.key)))}}
    >
      <td class="data-table-checkbox-col">
        <input
          type="checkbox"
          .checked=${t.selectedKeys.has(e.key)}
          @change=${()=>t.onToggleSelect(e.key)}
          aria-label=${`${p(`sessionsView.selectSession`)}: ${e.key}`}
        />
      </td>
      <td class="data-table-key-col">
        <testclaw-tooltip .content=${h}>
          <div class=${m?`session-key-cell`:`mono session-key-cell`}>
            ${Fn(e)}
            <div class="session-key-cell__text">
              <span class="session-key-cell__primary">
                ${e.unread===!0?N`<span
                        class="session-unread-dot"
                        role="img"
                        aria-label=${p(`sessionsView.unread`)}
                      ></span>`:P}
                ${g?N`<a
                        href=${y}
                        class="session-link"
                        @click=${n=>{xe(n)&&t.onNavigateToChat&&(n.preventDefault(),t.onNavigateToChat(e.key))}}
                        >${m??e.key}</a
                      >`:N`<span>${m??e.key}</span>`}
                ${s?N`<span class="session-label-chip" title=${s}
                        >${s}</span
                      >`:P}
              </span>
              ${e.kind===`global`&&!e.agentId?P:Zt(M(e.key)?.agentId??e.agentId)}
              ${c?N`<span class="muted session-key-display-name">${a}</span>`:P}
            </div>
          </div>
        </testclaw-tooltip>
      </td>
      ${C?qn(e,t):P}
      <td>
        <span class=${x}>${b}</span>
      </td>
      <td class="session-status-col">
        <div class="session-status-stack">
          ${Pn(e)} ${Hn(e.goal)}
          ${t.statusFilter===`all`&&e.archived===!0?V({kind:`muted`,label:p(`sessionsView.archived`)}):P}
        </div>
      </td>
      <td>${n}</td>
      <td class="session-token-cell">${In(e)}</td>
      <td class="session-actions-cell">
        <div class="session-actions">
          <button
            class="session-details-toggle"
            type="button"
            aria-expanded=${String(r)}
            aria-controls=${r?i:P}
            aria-label=${S}
            @click=${n=>{n.stopPropagation(),t.onToggleDetails(e.key)}}
          >
            ${L.chevronDown}
          </button>
          <button
            class="icon-btn"
            type="button"
            title=${p(`chat.sidebar.openSessionMenu`)}
            aria-label=${p(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            aria-expanded=${String(t.sessionMenu?.key===e.key)}
            @click=${n=>{n.stopPropagation();let r=n.currentTarget,i=r.getBoundingClientRect();t.onOpenSessionMenu(e,{x:i.right,y:i.bottom+4},r)}}
          >
            ${L.moreHorizontal}
          </button>
        </div>
      </td>
    </tr>`,...r?[Qn({row:e,props:t,detailsId:i,friendlyKeyLabel:m,displayName:a,showDisplayName:c,kindClass:x,updated:n})]:[]]}function Qn(e){let{row:t,props:n,detailsId:r,friendlyKeyLabel:i,displayName:a,showDisplayName:s,kindClass:c,updated:l}=e,u=t.thinkingLevel??``,d=u?gt(u):``,f=K(Mn(t,n.result?.defaults),d),m=t.fastMode===`auto`?`auto`:t.fastMode===!0?`on`:t.fastMode===!1?`off`:``,h=K(q(er),m),g=t.verboseLevel??``,v=K(q($n,!0),g),y=t.reasoningLevel??``,b=K(q(tr),y),x=Un({row:t,updated:l});return N`<tr id=${r} class="session-details-row">
    <td colspan=${J(n)}>
      <div class="session-details-panel">
        <div class="session-details-panel__hero">
          <div>
            <div class="session-details-panel__eyebrow">${p(`sessionsView.sessionDetails`)}</div>
            <div class="session-details-panel__title">${i??t.key}</div>
            ${s?N`<div class="muted session-details-panel__subtitle">${a}</div>`:P}
          </div>
          <div class="session-details-panel__badges">
            ${Pn(t)} ${Hn(t.goal)}
            <span class=${c}>${_(t)}</span>
          </div>
        </div>

        <div class="session-details-section">
          <div class="session-details-panel__eyebrow">${p(`sessionsView.overrides`)}</div>
          <div class="session-overrides-grid">
            <label class="session-override-field">
              <span class="session-override-field__label">${p(`sessionsView.label`)}</span>
              <input
                class="settings-input"
                .value=${t.label??``}
                ?disabled=${n.loading||!!n.patchWriteDisabledReason}
                title=${n.patchWriteDisabledReason??P}
                placeholder=${p(`sessionsView.optionalPlaceholder`)}
                @change=${e=>{let r=o(e.target.value)??null;n.onPatch(t.key,{label:r})}}
              />
            </label>
            ${X({label:p(`sessionsView.thinking`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:f,current:d,onChange:e=>n.onPatch(t.key,{thinkingLevel:e||null})})}
            ${X({label:p(`sessionsView.fast`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:h,current:m,onChange:e=>n.onPatch(t.key,{fastMode:e===``?null:e===`auto`?`auto`:e===`on`})})}
            ${X({label:p(`sessionsView.verbose`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:v,current:g,onChange:e=>n.onPatch(t.key,{verboseLevel:e||null})})}
            ${X({label:p(`sessionsView.reasoning`),disabled:n.loading||!!n.patchAdminDisabledReason,disabledReason:n.patchAdminDisabledReason,options:b,current:y,onChange:e=>n.onPatch(t.key,{reasoningLevel:e||null})})}
          </div>
        </div>

        <div class="session-details-grid">
          ${x.map(e=>N`
              <div class="session-detail-stat">
                <div class="session-detail-stat__label">${e.label}</div>
                <testclaw-tooltip .content=${e.value}>
                  <div class="session-detail-stat__value">${e.value}</div>
                </testclaw-tooltip>
              </div>
            `)}
        </div>
      </div>
    </td>
  </tr>`}var $n,er,tr,nr,rr,Z,ir,ar,or,Q;function sr(){return(sr=e((()=>{f(),F(),Qt(),an(),Ae(),Ot(),S(),Me(),xt(),m(),qe(),nt(),oe(),x(),Ke(),en(),Se(),Je(),R(),fe(),st(),w(),Dn(),An(),$n=[``,`off`,`on`,`full`],er=[``,`auto`,`on`,`off`],tr=[``,`off`,`on`,`stream`],nr=[10,25,50,100],rr={queued:`sessionsView.statusQueued`,running:`sessionsView.statusRunning`,done:`sessionsView.statusDone`,failed:`sessionsView.statusFailed`,killed:`sessionsView.statusKilled`,timeout:`sessionsView.statusTimeout`},Z={cron:L.clock,direct:L.messageSquare,group:L.users,global:L.globe,unknown:L.circle},ir=65,ar=85,or=4,Q=`__new-group__`})))()}var cr,lr,$;function ur(){return(ur=e((()=>{n(),yt(),f(),F(),De(),Pe(),Le(),Ne(),nn(),Jt(),Et(),At(),Ct(),wt(),It(),sn(),Ot(),Xt(),S(),C(),ht(),g(),Re(),_e(),ae(),Qe(),et(),Ce(),Ge(),fe(),w(),B(),b(),Kt(),Lt(),rt(),y(),se(),Wt(),un(),fn(),hn(),_n(),bn(),Sn(),sr(),i(),cr=`https://docs.testclaw.ai/concepts/session`,lr=200,$=class extends h{constructor(...e){super(...e),this.result=null,this.loading=!1,this.refreshing=!1,this.error=null,this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1,this.statusFilter=`active`,this.searchQuery=``,this.transcriptSearchQuery=``,this.submittedTranscriptSearchQuery=``,this.sortColumn=`updated`,this.sortDir=`desc`,this.groupBy=vn(),this.page=0,this.pageSize=25,this.selectedKeys=new Set,this.sessionMenu=null,this.sessionMenuWork=null,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.pageEpoch=0,this.pluginActionLifetime=new AbortController,this.routeDataEnabled=!0,this.sessionMutationPending=!1,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion=0,this.observeAgentScope=$e(()=>{this.retirePageOperations(),this.resetTranscriptSearchState(this.transcriptSearchQuery),this.deepLinkSessionKey||(this.page=0,this.selectedKeys=new Set,this.routeDataEnabled=!1,this.clearSearchTimer(),this.bindSessionList()),this.requestUpdate()}),this.subscriptions=new ge(this).watch(()=>this.context?.agentIdentity,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).watch(()=>this.context?.plugins,(e,t)=>e.subscribe(t)),this.gatewayLifecycle=new at(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{let e=this.listBinding?.sessions.listSnapshot(this.listBinding.query).result;this.resetProviderState(),this.appliedListResult=e},invalidateRequests:()=>this.invalidatePageWork()}),this.transcriptSearchTask=new _t(this,{args:()=>{let e=this.context,t=e?.gateway.snapshot;return[t?.phase===`connected`?t.client??null:null,this.submittedTranscriptSearchQuery,e??null,e?.agentSelection.state.scopeId??null]},task:async([e,t,n,r],{signal:i})=>{if(!e||!t||!n)return vt;let{sessions:a,results:o,indexing:s=!1,truncated:c=!1,archivedTranscriptsExcluded:l=0}=await Gt({client:e,query:t,listOptions:this.sessionListOptions(n,``),isCurrent:()=>!i.aborted});return{sessions:a,results:o,indexing:s,truncated:c,archivedTranscriptsExcluded:l}}}),this.dialogLifecycle=null}willUpdate(e){let t=this.context?.sessions;t&&this.listBinding&&this.listBinding.sessions!==t&&(this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.invalidatePageWork(),this.resetProviderState()),(e.has(`routeData`)||e.has(`context`))&&this.applyRouteData(),this.bindSessionList()}disconnectedCallback(){this.unsubscribeList?.(),this.unsubscribeList=void 0,this.listBinding=void 0,this.subscriptions.clear(),this.invalidatePageWork(),this.dialogLifecycle?.abort(),super.disconnectedCallback()}retirePageOperations(){this.pluginActionLifetime.abort(),this.pluginActionLifetime=new AbortController,this.pageEpoch+=1,this.sessionMutationPending=!1,this.closeSessionMenu()}invalidatePageWork(){this.retirePageOperations(),this.clearSearchTimer(),this.listRequest=void 0,this.resetTranscriptSearchState(this.transcriptSearchQuery),this.loading=!1,this.refreshing=!1}resetProviderState(){this.result=null,this.error=null,this.loading=!1,this.refreshing=!1,this.resetTranscriptSearchState(``),this.selectedKeys=new Set,this.expandedSessionKey=null,this.deepLinkSessionKey=null,this.appliedListResult=void 0}captureRequestScope(){let e=this.context;if(!this.isConnected||!e)return null;let t=e.gateway,n=this.gatewayLifecycle.gateway===t?this.gatewayLifecycle.client:null;return!this.gatewayLifecycle.connected||!n?null:{epoch:this.pageEpoch,context:e,gateway:t,sessions:e.sessions,client:n}}isRequestScopeCurrent(e){let t=this.context,n=t?.gateway;return this.isConnected&&this.pageEpoch===e.epoch&&t===e.context&&n===e.gateway&&t.sessions===e.sessions&&n.snapshot.phase===`connected`&&n.snapshot.client===e.client}mutationDisabledReason(e){let t=re(this.context?.gateway.snapshot,e);return t.allowed?void 0:t.reason}requireMutationAccess(e,t){let n=re(e.gateway.snapshot,t);return n.allowed?!0:(this.error=n.reason,!1)}selectedDeleteDisabledReason(){let e=new Map(this.result?.sessions.map(e=>[e.key,e])??[]);for(let t of this.selectedKeys){let n=e.get(t),r=this.mutationDisabledReason({method:`sessions.delete`,params:{key:t,...n?.archived===!0?{archivedOnly:!0}:{}}});if(r)return r}}applyRouteData(){let e=this.routeData,t=this.context;e&&t&&(e!==this.appliedRouteData&&(this.appliedRouteData=e,this.routeDataEnabled=!0),this.routeDataEnabled&&(this.statusFilter=e.statusFilter,e.expandedSessionKey?(this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!0,this.searchQuery=``,this.page=0,this.selectedKeys=new Set):(this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1),this.expandedSessionKey=e.expandedSessionKey,this.deepLinkSessionKey=e.expandedSessionKey))}sessionAgentId(e,t=this.context){if(!t)return;let{agentId:n}=ye({assistantAgentId:t.agentSelection.state.selectedId,hello:t.gateway.snapshot.hello},e);return n}sessionPathAgentId(e,t){return this.sessionAgentId(e,t)??A(t)}sessionListOptions(e,t=this.searchQuery){return gn(e,{activeMinutes:r(this.activeMinutes),limit:r(this.limit)??50,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,deepLinkSessionKey:this.deepLinkSessionKey,search:t})}bindSessionList(e=!0){let t=this.context;if(!t||!this.isConnected)return;let n=t.sessions,r=this.sessionListOptions(t),i=JSON.stringify(r),a=this.listBinding,o=JSON.stringify(this.sessionListOptions(t,``));(a?.sessions!==n||a.key!==i)&&(a?.sessions===n&&n.listSnapshot(a.query).loading&&this.loadSessionList(a),this.unsubscribeList?.(),this.unsubscribeList=void 0,(a?.sessions!==n||a.transcriptKey!==o)&&this.resetTranscriptSearchState(this.transcriptSearchQuery),this.result=null,this.error=null,this.selectedKeys=new Set,this.page=0,this.listBinding={sessions:n,query:r,key:i,transcriptKey:o},this.appliedListResult=void 0);let s=this.listBinding;if(this.unsubscribeList||(this.loading=t.gateway.snapshot.phase===`connected`,!this.captureRequestScope()||this.searchTimer!==void 0||this.listRequest))return s;let c=e=>{this.applyListSnapshot(s,e)};this.unsubscribeList=n.subscribeList(r,c);let l=n.listSnapshot(r);return c(l),e&&(!l.result||l.loading)&&this.loadSessionList(s),s}applyListSnapshot(e,t){if(this.listBinding!==e||this.context?.sessions!==e.sessions)return;this.loading=t.loading,this.error=t.error;let n=t.result;n&&n!==this.appliedListResult&&(this.appliedListResult=n,this.result=T(n,{archivedFilter:this.statusFilter}),this.ensureAgentIdentities(this.result))}async refreshSessionList(e=this.captureRequestScope()){if(!e)return;this.routeDataEnabled=!1,this.clearSearchTimer();let t=this.bindSessionList(!1);t&&t.sessions===e.sessions&&this.isRequestScopeCurrent(e)&&(await this.loadSessionList(t,{force:!0}),this.isRequestScopeCurrent(e)&&this.listBinding===t&&this.applyListSnapshot(t,t.sessions.listSnapshot(t.query)))}loadSessionList(e,t={}){if(this.listRequest)return t.force&&this.unsubscribeList&&e.sessions.refreshList({...e.query,...t}),this.listRequest;if(!this.captureRequestScope())return Promise.resolve();let n,r=new Promise(e=>{n=e}).finally(()=>{this.listRequest===r&&(this.listRequest=void 0,this.refreshing=!1,this.bindSessionList())});return this.listRequest=r,this.refreshing=!0,n(e.sessions.refreshList({...e.query,...t})),r}clearSearchTimer(){clearTimeout(this.searchTimer),this.searchTimer=void 0}adoptCurrentListSnapshot(){let e=this.listBinding;e&&this.applyListSnapshot(e,e.sessions.listSnapshot(e.query))}resetTranscriptSearchState(e){this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=``,this.transcriptSearchTask.run()}updateTranscriptSearchQuery(e){e!==this.transcriptSearchQuery&&this.resetTranscriptSearchState(e)}async runTranscriptSearch(){let e=this.transcriptSearchQuery.trim();if(!e){this.resetTranscriptSearchState(``);return}this.captureRequestScope()&&(this.transcriptSearchQuery=e,this.submittedTranscriptSearchQuery=e,await this.transcriptSearchTask.run())}ensureAgentIdentities(e){let t=this.context;if(!t||!e)return;let n=cn(e).filter(e=>!t.agentIdentity.get(e));n.length!==0&&t.agentIdentity.ensure(n)}updateFilters(e){this.activeMinutes=e.activeMinutes,this.limit=e.limit,this.includeGlobal=e.includeGlobal,this.includeUnknown=e.includeUnknown,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.refreshSessionList()}updateStatusFilter(e){let t=this.context;e!==this.statusFilter&&t&&(this.statusFilter=e,this.clearSearchTimer(),this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.loading=!0,this.error=null,t.navigate(`sessions`,e===`active`?void 0:{search:`?status=${e}`}))}async deleteSelected(){let e=[...this.selectedKeys];if(e.length===0||this.loading||this.sessionMutationPending)return;let t=this.captureRequestScope();if(!t)return;let n=new Map(this.result?.sessions.map(e=>[e.key,e])??[]),r=e.map(e=>n.get(e)??{key:e}),i=p(e.length===1?`sessionsView.deleteSelectedConfirmOne`:`sessionsView.deleteSelectedConfirm`,{count:String(e.length)});await U({message:i,confirmLabel:p(`common.delete`),danger:!0,signal:this.pluginActionLifetime.signal})&&this.isRequestScopeCurrent(t)&&await this.deleteSessions(r)}async deleteSessions(e,t={}){if(e.length===0||this.loading||this.sessionMutationPending)return;let n=this.captureRequestScope();if(!n)return;let r=e.map(e=>({key:e.key,agentId:this.sessionAgentId(e.key,n.context),...t,...e.sessionId?{expectedSessionId:e.sessionId}:{},...e.archived===!0?{archivedOnly:!0}:{}}));for(let e of r)if(!this.requireMutationAccess(n,{method:`sessions.delete`,params:e}))return;this.sessionMutationPending=!0;let i=null;try{let t=async()=>{let t=await n.sessions.deleteMany(r);if(e.length===1&&t.errors.length>0)throw t.errors[0].error;return t},a=e[0],o=e.length===1?await Rt({action:`delete`,session:{...a,label:a.label||a.displayName||a.key,agentId:r[0].agentId},scope:{...n,signal:this.pluginActionLifetime.signal},isCurrent:()=>this.isRequestScopeCurrent(n),request:t}):await t();if(!this.isRequestScopeCurrent(n)||!o)return;if(o.preservedWorktrees.length>0&&window.alert(Ft(o.preservedWorktrees)),o.deleted.length>0){let e=new Set(o.deleted),t=new Set(this.selectedKeys);for(let e of o.deleted)t.delete(e);this.selectedKeys=t,this.expandedSessionKey&&e.has(this.expandedSessionKey)&&(this.expandedSessionKey=null),this.deepLinkSessionKey&&e.has(this.deepLinkSessionKey)&&(this.deepLinkSessionKey=null);let r=o.deleted.find(e=>ve(e,n.gateway.snapshot.sessionKey));if(r){let e=M(r)?.agentId??n.context.agentSelection.state.selectedId??`main`;je({selection:n.context.agentSelection,gateway:n.gateway,agentId:e,sessionKey:d({agentId:e,mainKey:O({agentsList:n.context.agents.state.agentsList,hello:n.gateway.snapshot.hello})})})}}await this.refreshSessionList(n),o.errors.length>0&&(i=o.errors.map(({error:e})=>zt(e)).join(`; `))}catch(e){this.isRequestScopeCurrent(n)&&(i=E(e))}finally{this.isRequestScopeCurrent(n)&&(this.sessionMutationPending=!1,this.adoptCurrentListSnapshot(),i&&(this.error=i))}}async deleteAllArchived(){let e=this.captureRequestScope(),t=this.pluginActionLifetime.signal;if(!e||this.loading||this.sessionMutationPending)return;let n;try{let{search:t,agentId:r,...i}=this.sessionListOptions(e.context),a=e.context.agentSelection.state.scopeId?.trim(),o={...i,...a?{agentId:a}:{}},s=await lt({list:t=>e.sessions.list({...o,limit:1e3,offset:t}),isCurrent:()=>this.isRequestScopeCurrent(e),missingResultError:e.sessions.state.error??`archived session enumeration returned no result`,stalledPaginationError:`archived session enumeration did not advance`,incompletePaginationError:`archived session enumeration was incomplete`});if(!s)return;n=s}catch(t){this.isRequestScopeCurrent(e)&&(this.error=E(t));return}let r=n.filter(e=>e.archived===!0);r.length!==0&&await U({message:p(`sessionsView.deleteAllArchivedConfirm`,{count:String(r.length)}),confirmLabel:p(`common.delete`),danger:!0,signal:t})&&this.isRequestScopeCurrent(e)&&await this.deleteSessions(r,{deleteTranscript:!0})}async deleteSessionFromMenu(e){let t=o(e.label)??e.key,n=this.captureRequestScope();n&&await U({message:p(`sessionsView.deleteSessionConfirm`,{session:t}),confirmLabel:p(`common.delete`),danger:!0,signal:this.pluginActionLifetime.signal})&&this.isRequestScopeCurrent(n)&&await this.deleteSessions([e])}async stopCloudWorker(e){let t=o(e.label)??e.key,n=Nt(e.placement);if(!n||n.blocksActiveRun&&e.hasActiveRun===!0)return;let r=this.captureRequestScope();if(!r||!await U({message:p(`sessionsView.stopCloudWorkerConfirm`,{session:t}),confirmLabel:p(`sessionsView.stopCloudWorkerConfirmAction`),danger:!0,signal:this.pluginActionLifetime.signal})||!this.isRequestScopeCurrent(r)||!this.requireMutationAccess(r,n))return;this.sessionMutationPending=!0;let i=null;try{let t=M(e.key)?.agentId;await qt(r.client,{key:e.key,...t?{agentId:t}:{}},r.context.placementStartup),this.isRequestScopeCurrent(r)&&await this.refreshSessionList(r)}catch(e){this.isRequestScopeCurrent(r)&&(i=E(e))}finally{this.isRequestScopeCurrent(r)&&(this.sessionMutationPending=!1,this.adoptCurrentListSnapshot(),i&&(this.error=i))}}knownCategories(){return pn(this.result,this.context?.sessions.state.groups??[])}setGroupBy(e){this.groupBy=e,this.page=0,yn(e)}async rememberCustomGroup(e,t=this.captureRequestScope()){return t?this.requireMutationAccess(t,{method:`sessions.groups.put`,requiredScope:`operator.write`})?mn({name:e,knownCategories:this.knownCategories(),sessions:t.sessions,isCurrent:()=>this.isRequestScopeCurrent(t),onError:e=>{this.error=e}}):`failed`:`stale`}assignCategory(e,t){let n=this.result?.sessions.find(t=>t.key===e);n&&(n.category?.trim()||null)!==t&&(t&&this.rememberCustomGroup(t),this.patchSession(e,{category:t}))}async withDialogLifecycle(e){let t=this.dialogLifecycle;if(t)return e(t.signal);let n=new AbortController;this.dialogLifecycle=n;try{return await e(n.signal)}finally{this.dialogLifecycle===n&&(this.dialogLifecycle=null)}}async loadInputDialog(){try{return(await t(async()=>{let{showInputDialog:e}=await import(`./input-dialog-BUmhTcxK.js`);return{showInputDialog:e}},__vite__mapDeps([0,1,2]),import.meta.url)).showInputDialog}catch(e){return this.error=E(e),null}}async requestNewCategory(e){let t=this.result?.sessions.find(t=>t.key===e);if(e&&!t?.sessionId){this.error=p(`common.refresh`);return}await this.withDialogLifecycle(async e=>{await(await this.loadInputDialog())?.({signal:e,title:p(`sessionsView.newGroupTitle`),label:p(`sessionsView.newGroupPrompt`),submitLabel:p(`sessionsView.newGroupCreate`),requireValue:!0,submit:e=>this.writeNewCategory(e,t)})})}async writeNewCategory(e,t){this.error=null;let n=this.captureRequestScope();if(!n)return p(`sessionsView.newGroupFailed`);let r=await this.rememberCustomGroup(e,n);if(r!==`completed`)return r===`failed`?this.error??p(`sessionsView.newGroupFailed`):p(`sessionsView.newGroupStale`);if(!t)return null;let i=await this.patchSession(t.key,{category:e},n,t.sessionId);return i===`failed`?this.error??p(`sessionsView.newGroupFailed`):i===`stale`?p(`sessionsView.newGroupStale`):null}async renameSession(e){let t=this.captureRequestScope();if(!t){this.error=p(`sessionsView.actionRequiresConnection`);return}let n=Be(e),r=this.pluginActionLifetime.signal,i=await this.withDialogLifecycle(async e=>await(await this.loadInputDialog())?.({signal:AbortSignal.any([e,r]),title:p(`sessionsView.renameSessionPrompt`),defaultValue:n})??null);if(i===null||!this.isRequestScopeCurrent(t))return;let a=Xe(i,n,e.label);a&&await this.patchSession(e.key,a,t,e.sessionId)}async patchSession(e,t,n=this.captureRequestScope(),r,i){if(!n)return this.error=p(`sessionsView.actionRequiresConnection`),`failed`;if(typeof t.archived==`boolean`&&!r?.trim())return this.error=`Session lifecycle action requires a durable session identity.`,`failed`;let a=this.sessionAgentId(e,n.context);if(!this.requireMutationAccess(n,{method:`sessions.patch`,params:{key:e,...t,...a?{agentId:a}:{}}}))return`failed`;try{let o=()=>n.sessions.patch(e,t,{agentId:a,...r?{expectedSessionId:r}:{}}),s=this.result?.sessions.find(t=>t.key===e),c=t.archived===!0?await Rt({action:`archive`,session:{key:e,sessionId:r,label:s?.label||s?.displayName||e,agentId:a},scope:{...n,signal:this.pluginActionLifetime.signal},isCurrent:()=>this.isRequestScopeCurrent(n),request:o}):await o();if(c&&i?.(c),!this.isRequestScopeCurrent(n))return`stale`;if(!c)return this.error=n.sessions.state.error,`failed`;if(await this.refreshSessionList(n),!this.isRequestScopeCurrent(n))return`stale`;let l=new Set(this.selectedKeys);return l.delete(e),this.selectedKeys=l,`completed`}catch(e){return this.isRequestScopeCurrent(n)?(this.error=E(e),`failed`):`stale`}}async archiveSessionWithUndo(e){let t=this.captureRequestScope();if(!t)return;let n=dn(t.sessions,e,this.sessionAgentId(e.key,t.context));if(!n)return;let r=t.sessions.beginArchive(e.key,e.sessionId);if(r)try{await this.patchSession(e.key,{archived:!0},t,e.sessionId,n)}finally{r()}}async forkSession(e,t=!1){let n=this.captureRequestScope();if(!n)return;let r=this.sessionAgentId(e,n.context),i={parentSessionKey:e,fork:!0,...t?{forkFrom:`last-completed`}:{},...r?{agentId:r}:{}};if(this.requireMutationAccess(n,{method:`sessions.create`,params:i}))try{let e=await n.sessions.create(i);if(!this.isRequestScopeCurrent(n))return;e?n.context.navigate(`chat`,{...D({context:n.context,face:`chat`,sessionKey:e,agentId:r??this.sessionPathAgentId(e,n.context)}).options,hash:``}):n.sessions.state.error&&(this.error=n.sessions.state.error)}catch(e){this.isRequestScopeCurrent(n)&&(this.error=E(e))}}async toggleSessionDetails(e){if(!this.context)return;let t=this.deepLinkSessionKey!==null;if(this.deepLinkSessionKey=null,t&&this.refreshSessionList(),this.expandedSessionKey===e){this.expandedSessionKey=null;return}this.expandedSessionKey=e}openSessionMenu(e,t,n){if(this.sessionMenu?.key===e.key&&this.sessionMenu.sessionId===e.sessionId&&n){this.closeSessionMenu();return}this.sessionMenu={key:e.key,sessionId:e.sessionId,...t},this.sessionMenuTrigger=n,this.loadSessionMenuWork(e)}closeSessionMenu(){this.context&&He(this.context.gateway).unwatch(this),this.sessionMenu=null,this.sessionMenuTrigger=null,this.sessionMenuWorkVersion+=1,this.sessionMenuWork=null}loadSessionMenuWork(e){let t=++this.sessionMenuWorkVersion;if(!e.worktree){this.sessionMenuWork=null;return}this.sessionMenuWork={loading:!0,pullRequestUrl:null,worktreePath:null};let n=this.captureRequestScope();if(!n){this.sessionMenuWork={loading:!1,pullRequestUrl:null,worktreePath:null};return}let r=He(n.context.gateway),i=ce(e.key,this.sessionAgentId(e.key,n.context));Tt({client:n.client,loadPullRequests:ze(n.context.gateway.snapshot,`controlUi.sessionPullRequests.subscribe`)===!0?()=>r.load(this,i):void 0,worktreeId:e.worktree.id,execNode:e.execNode}).then(e=>{t===this.sessionMenuWorkVersion&&(this.sessionMenuWork={loading:!1,...e})})}renderSessionMenu(){let e=this.sessionMenu,t=this.context,n=e?this.result?.sessions.find(t=>t.key===e.key&&t.sessionId===e.sessionId):null;return!e||!t||!n?P:xn({context:t,row:n,menu:e,trigger:this.sessionMenuTrigger,disabled:this.loading,groups:this.knownCategories(),work:this.sessionMenuWork,onClose:()=>this.closeSessionMenu(),onAction:r=>{switch(r.kind){case`open-pr`:be(r.url);break;case`open-in`:tt(r.editor,r.path);break;case`copy-session-id`:case`copy-session-link`:case`copy-session-preview-link`:case`copy-markdown`:case`open-new-tab`:case`open-new-window`:case`split-right`:case`split-below`:dt(r.kind,{context:t,session:n,agentId:n.agentId,isCurrent:()=>this.isConnected&&this.context===t});break;case`toggle-pin`:this.patchSession(n.key,{pinned:n.pinned!==!0});break;case`toggle-involving-me`:{let e=this.captureRequestScope();if(!e||!n.sessionId){this.error=p(`sessionsView.actionRequiresConnection`);break}ne(e.client,{key:n.key,expectedSessionId:n.sessionId,agentId:n.agentId??this.sessionAgentId(n.key,e.context),hidden:!n.hiddenFromInvolvingMe}).then(async()=>{this.isRequestScopeCurrent(e)&&await this.refreshSessionList(e)}).catch(t=>{this.isRequestScopeCurrent(e)&&(this.error=E(t))});break}case`toggle-unread`:this.patchSession(n.key,{unread:n.unread!==!0});break;case`rename`:this.renameSession(n);break;case`set-color`:this.patchSession(n.key,{color:r.color});break;case`set-icon`:this.patchSession(n.key,{icon:r.icon});break;case`reset-appearance`:this.patchSession(n.key,{icon:null,color:null});break;case`fork`:this.forkSession(n.key,n.hasActiveRun===!0);break;case`plugin`:this.runPluginAction(r.id,e);break;case`move-to-group`:this.assignCategory(n.key,r.category);break;case`new-group`:this.requestNewCategory(n.key);break;case`toggle-archived`:n.archived===!0?this.patchSession(n.key,{archived:!1},void 0,n.sessionId):this.archiveSessionWithUndo(n);break;case`assign-owner`:this.context?.sessions.assignOwner(n.key,r.owner);break;case`stop-cloud-worker`:this.stopCloudWorker(n);break;case`delete`:this.deleteSessionFromMenu(n)}}})}render(){let e=this.context,t=(this.result?.owners?.length??0)>1;return e?N`
      ${on({active:`sessions`,title:Ie(`sessions`),subtitle:N`${Fe(`sessions`)} ${Dt(cr)}`,actions:tn({agents:e.agents.state.agentsList?.agents??[],selection:e.agentSelection}),onSelect:t=>{t!==`sessions`&&e.navigate(t)}})}
      ${Yt(Yn({loading:this.loading,refreshing:this.refreshing,result:this.result,error:this.error,activeMinutes:this.activeMinutes,limit:this.limit,includeGlobal:this.includeGlobal,includeUnknown:this.includeUnknown,statusFilter:this.statusFilter,basePath:e.basePath,agentId:A(e),mainKey:O({agentsList:e.agents.state.agentsList,hello:e.gateway.snapshot.hello}),searchQuery:this.searchQuery,transcriptSearchAvailable:e.gateway.snapshot.phase===`connected`,transcriptSearchQuery:this.transcriptSearchQuery,transcriptSearch:this.transcriptSearchTask.render({initial:()=>({status:`idle`}),pending:()=>({status:`loading`}),complete:e=>({status:`results`,...e}),error:e=>({status:`error`,message:E(e)})}),agentIdentityById:ln(this.result,t=>e.agentIdentity.get(t)??void 0),sortColumn:this.sortColumn,sortDir:this.sortDir,groupBy:t||this.groupBy!==`person`?this.groupBy:`none`,personGroupingAvailable:t,knownCategories:this.knownCategories(),page:this.page,pageSize:this.pageSize,selectedKeys:this.selectedKeys,sessionMenu:this.sessionMenu,expandedSessionKey:this.expandedSessionKey,patchWriteDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,label:null}}),patchAdminDisabledReason:this.mutationDisabledReason({method:`sessions.patch`,params:{key:``,thinkingLevel:null}}),groupWriteDisabledReason:this.mutationDisabledReason({method:`sessions.groups.put`,requiredScope:`operator.write`}),deleteArchivedDisabledReason:this.mutationDisabledReason({method:`sessions.delete`,params:{key:``,archivedOnly:!0,deleteTranscript:!0}}),deleteSelectedDisabledReason:this.selectedDeleteDisabledReason(),onFiltersChange:e=>this.updateFilters(e),onClearFilters:()=>{this.activeMinutes=``,this.limit=`50`,this.includeGlobal=!0,this.includeUnknown=!1,this.searchQuery=``,this.page=0,this.selectedKeys=new Set,this.deepLinkSessionKey=null,this.refreshSessionList()},onSearchChange:e=>{this.routeDataEnabled=!1,this.deepLinkSessionKey=null,this.searchQuery=e,this.page=0,this.selectedKeys=new Set,this.clearSearchTimer(),this.captureRequestScope()&&(this.searchTimer=setTimeout(()=>{this.searchTimer=void 0,this.bindSessionList()},lr)),this.bindSessionList()},onTranscriptSearchChange:e=>this.updateTranscriptSearchQuery(e),onTranscriptSearch:()=>void this.runTranscriptSearch(),onClearTranscriptSearch:()=>this.resetTranscriptSearchState(``),onSortChange:(e,t)=>{this.sortColumn=e,this.sortDir=t,this.page=0},onGroupByChange:e=>this.setGroupBy(e),onAssignCategory:(e,t)=>this.assignCategory(e,t),onRequestNewCategory:e=>void this.requestNewCategory(e),onLoadMore:()=>{let e=this.listBinding,t=this.result?.nextOffset;e&&this.result?.hasMore&&t!=null&&!this.loading&&this.loadSessionList(e,{offset:t,append:!0})},onPageChange:e=>{this.page=e},onPageSizeChange:e=>{this.pageSize=e,this.page=0},onRefresh:()=>void this.refreshSessionList(),onStatusFilterChange:e=>this.updateStatusFilter(e),onDeleteAllArchived:()=>void this.deleteAllArchived(),onPatch:(e,t)=>void this.patchSession(e,t),onToggleSelect:e=>{let t=new Set(this.selectedKeys);t.has(e)?t.delete(e):t.add(e),this.selectedKeys=t},onSelectPage:e=>{this.selectedKeys=new Set([...this.selectedKeys,...e])},onDeselectPage:e=>{let t=new Set(this.selectedKeys);for(let n of e)t.delete(n);this.selectedKeys=t},onDeselectAll:()=>{this.selectedKeys=new Set},onDeleteSelected:()=>void this.deleteSelected(),onNavigateToChat:t=>{let n=me(e,t),r=D({context:e,face:n,sessionKey:t,agentId:this.sessionPathAgentId(t,e),preferenceDerivedFace:!0});e.navigate(n,r.options)},onOpenSessionMenu:(e,t,n)=>this.openSessionMenu(e,t,n),onToggleDetails:e=>void this.toggleSessionDetails(e)}),{id:`sessions-hub-panel`})}
      ${this.renderSessionMenu()}
    `:N``}async runPluginAction(e,t){let n=this.captureRequestScope();if(n)try{await Ut({runtime:n.context.plugins,id:e,placement:`session`,sessionKey:t.key,session:this.result?.sessions.find(e=>e.key===t.key&&e.sessionId===t.sessionId),signal:this.pluginActionLifetime.signal})}catch(e){this.isRequestScopeCurrent(n)&&(this.error=E(e))}}},l([c({context:ke,subscribe:!0})],$.prototype,`context`,void 0),l([Oe({attribute:!1})],$.prototype,`routeData`,void 0),l([I()],$.prototype,`result`,void 0),l([I()],$.prototype,`loading`,void 0),l([I()],$.prototype,`refreshing`,void 0),l([I()],$.prototype,`error`,void 0),l([I()],$.prototype,`activeMinutes`,void 0),l([I()],$.prototype,`limit`,void 0),l([I()],$.prototype,`includeGlobal`,void 0),l([I()],$.prototype,`includeUnknown`,void 0),l([I()],$.prototype,`statusFilter`,void 0),l([I()],$.prototype,`searchQuery`,void 0),l([I()],$.prototype,`transcriptSearchQuery`,void 0),l([I()],$.prototype,`submittedTranscriptSearchQuery`,void 0),l([I()],$.prototype,`sortColumn`,void 0),l([I()],$.prototype,`sortDir`,void 0),l([I()],$.prototype,`groupBy`,void 0),l([I()],$.prototype,`page`,void 0),l([I()],$.prototype,`pageSize`,void 0),l([I()],$.prototype,`selectedKeys`,void 0),l([I()],$.prototype,`sessionMenu`,void 0),l([I()],$.prototype,`sessionMenuWork`,void 0),l([I()],$.prototype,`expandedSessionKey`,void 0),customElements.get(`testclaw-sessions-page`)||customElements.define(`testclaw-sessions-page`,$)})))()}ur();
//# sourceMappingURL=sessions-page-DA4c5ABO.js.map