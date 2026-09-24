import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ba as t,Ga as n,Ia as r,Jr as i,Ua as a,Va as o,qr as s,ti as c}from"./control-ui-foundation-CGMdhB5v.js";import{$l as l,Ac as u,Bl as d,Bs as f,Hl as p,Jl as m,Nr as ee,Rs as h,Uc as te,Wc as ne,Zl as re,_n as ie,ac as ae,dn as oe,fc as se,fn as g,ic as ce,in as _,jc as le,mc as ue,rn as de,vi as fe,zs as v}from"./control-ui-core-S9jKXqB5.js";import{$ as y,B as pe,H as b,X as x,Y as S,_ as me,c as he,ct as C,m as ge,nt as _e,r as ve,s as ye,t as be,ut as xe}from"./lit-runtime-DWoPVI38.js";import{Di as Se,Fi as Ce,Ii as w,Ni as we,Oa as Te,Oi as Ee,Or as De,Pi as T,Qa as Oe,ba as ke,do as Ae,fo as je,kr as Me}from"./control-ui-core-G2U4O6rB.js";import{h as Ne,m as Pe}from"./control-ui-boot-shared-BGGpAWmX.js";import{$ as Fe,Ba as Ie,Da as Le,Ea as E,Ga as Re,Ha as ze,Ht as Be,Ja as Ve,Jt as He,Ka as Ue,Kt as We,La as Ge,Oa as Ke,Qa as qe,Ra as Je,Ua as Ye,Va as Xe,Vl as Ze,Wa as Qe,Xa as $e,Ya as et,Yt as tt,Za as nt,ao as D,co as O,da as rt,do as it,et as at,fo as ot,go as st,ho as ct,io as lt,ir as ut,la as dt,lo as ft,no as pt,on as mt,qa as ht,ro as k,to as gt,tt as _t,ua as vt,za as yt}from"./control-ui-boot-shared-ooxiG3qa.js";import{Da as bt,Dr as xt,Et as St,Gr as Ct,Ia as wt,Kr as Tt,Mt as Et,Nt as Dt,Ot as A,Tr as Ot,Tt as kt,er as At,f as jt,ht as j,ka as Mt,kt as Nt,lo as Pt,nr as Ft,nt as It,p as Lt,tt as Rt,uo as zt,wt as Bt}from"./control-ui-boot-shared-CCYBAAP9.js";import{c as Vt,cn as Ht,on as Ut,s as Wt,sn as Gt}from"./control-ui-boot-shared-D2o30asO.js";import"./control-ui-boot-shared-VDjYq2Zh.js";import{n as Kt,t as qt}from"./channel-picker-BtUNSoO-.js";import{n as Jt,t as Yt}from"./settings-workspace-DJAhLnkQ.js";import{n as Xt,t as Zt}from"./agent-row-chip-LzqZKgRH.js";import{n as Qt,t as $t}from"./model-picker-B5f1dDe1.js";import{i as M,n as en,r as N,t as tn}from"./cron-jobs-pagination-fv383neL.js";import{n as nn,s as rn}from"./presenter-wVFa7WAH.js";import{n as an,t as on}from"./agent-scope-control-DE_nXHBu.js";var sn;function cn(){return(cn=e((()=>{sn=class{constructor(e){this.host=e,this.footer=null,this.scroller=null,this.observer=null,this.previousPadding=``,e.addController(this)}hostUpdated(){let e=this.host.querySelector(`.cron-editor-actions`),t=this.host.closest(`.content`);if(e===this.footer&&t===this.scroller||(this.hostDisconnected(),!e||!t))return;this.footer=e,this.scroller=t,this.previousPadding=t.style.scrollPaddingBlockEnd;let n=()=>{let n=getComputedStyle(t).paddingBlockEnd;t.style.scrollPaddingBlockEnd=`calc(${e.getBoundingClientRect().height}px + ${n})`};n(),typeof ResizeObserver==`function`&&(this.observer=new ResizeObserver(n),this.observer.observe(e),this.observer.observe(t))}hostDisconnected(){this.observer?.disconnect(),this.observer=null,this.scroller&&(this.scroller.style.scrollPaddingBlockEnd=this.previousPadding),this.footer=null,this.scroller=null}}})))()}function ln(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch{return``}}function un(){try{return Intl.supportedValuesOf?.(`timeZone`)??[]}catch{return[]}}function dn(e,n=ln(),r=un()){let i=e.map(e=>e.schedule.kind===`cron`&&typeof e.schedule.tz==`string`?e.schedule.tz:``);return a([n,`UTC`,...i,...t(r)])}function fn(){return(fn=e((()=>{r()})))()}function pn(e){let n=te(e.runtimeConfig),r=e.cron.cronForm.deliveryChannel.trim()||`last`,i=new Set((e.agentsList?.agents??[]).filter(e=>e.kind===`system`).map(e=>e.id.trim())),a=t([...le(e.agentsList?.agents??[]).map(e=>e.id.trim()),...e.cron.cronJobs.map(e=>typeof e.agentId==`string`&&!i.has(e.agentId.trim())?e.agentId.trim():``)]),o=t([...e.modelSuggestions,...Ue(n),...e.cron.cronJobs.map(e=>{let t=ft(e);return t?.kind===`agentTurn`&&typeof t.model==`string`?t.model.trim():``})]),s=t(e.cron.cronJobs.map(e=>e.delivery?.to)),c=(r===`last`?Object.values(e.channels.channelsSnapshot?.channelAccounts??{}).flat():e.channels.channelsSnapshot?.channelAccounts?.[r]??[]).flatMap(e=>[e.accountId,e.name]).filter(e=>typeof e==`string`).map(e=>e.trim()).filter(Boolean);return{agentSuggestions:a,modelSuggestions:o,timezoneSuggestions:dn(e.cron.cronJobs),accountTargets:c,deliveryToSuggestions:e.cron.cronForm.deliveryMode===`webhook`?s.filter(e=>/^https?:\/\//i.test(e)):s}}var mn;function hn(){return(hn=e((()=>{r(),u(),ne(),Xe(),fn(),mn=[`off`,`minimal`,`low`,`medium`,`high`]})))()}function gn(e){let t=new URLSearchParams(e),n=t.get(`job`)?.trim()||null,r=t.get(`session`)?.trim(),i=t.get(`agent`)?.trim();return{jobId:n,runId:n&&t.get(`run`)?.trim()||null,...!n&&r&&i?{session:{sessionKey:r,sessionAgentId:i}}:{}}}function _n(e,t){if(t.runId===e)return!0;let n=vn.exec(e);return n!==null&&n[1]===t.jobId&&t.runAtMs===Number(n[2])}var vn;function P(){return(P=e((()=>{vn=/^cron:(.+):(\d+)$/u})))()}var yn;function bn(){return(bn=e((()=>{S(),m(),f(),Be(),Ut(),Wt(),yn=class{constructor(e,t){this.host=e,this.capture=t,this.attempt=0,this.entry=null,this.task=null,this.candidateId=null,this.error=null,this.transcript={client:null,connected:!1,requestUpdate:()=>this.host.requestUpdate()},e.addController(this)}hostDisconnected(){this.close()}close(){this.attempt++,Ht(this.transcript),this.entry=null,this.task=null,this.candidateId=null,this.error=null,this.host.requestUpdate()}observe(e){let t=We(e);if(t){if(t.action===`deleted`&&(t.taskId===this.task?.id||t.taskId===this.candidateId)){this.close();return}Gt(this.transcript,t)}}async open(e){this.close();let t=this.capture();if(!t)return;this.entry=e;let n=this.attempt,r=()=>n===this.attempt&&this.host.isConnected&&t.isCurrent(),i=t=>t.runtime===`cron`&&t.sourceId===e.jobId&&t.childSessionKey===e.sessionKey&&t.startedAt===e.runAtMs;try{if(!e.jobId||!e.sessionKey?.trim()||typeof e.runAtMs!=`number`||!Number.isFinite(e.runAtMs))throw Error(l(`cron.runEntry.transcriptMissingMetadata`));let n=new Map,a=new Set,o;do{let s=tt(await t.client.request(`tasks.list`,{sessionKey:e.sessionKey,limit:500,...o?{cursor:o}:{}}));if(!r())return;if(!s)throw Error(l(`tasksPage.invalidResponse`));for(let e of s.tasks)i(e)&&n.set(e.id,e);if(o=s.nextCursor,o){if(a.has(o))throw Error(l(`tasksPage.invalidResponse`));a.add(o)}}while(o);let[s]=n.values();if(n.size!==1||!s)throw Error(l(`cron.runEntry.transcriptUnavailable`));this.candidateId=s.id;let c=He(await t.client.request(`tasks.get`,{taskId:s.id}));if(!r())return;if(!c||c.id!==s.id||!i(c)||!c.hasTranscript)throw Error(l(`cron.runEntry.transcriptUnavailable`));this.task=c,Object.assign(this.transcript,{client:t.client,connected:!0,connectionEpoch:t.epoch})}catch(e){if(!r())return;this.error=h(e,l(`tasksPage.loadFailed`))}if(!r()||(this.host.requestUpdate(),await this.host.updateComplete,!r()))return;let a=this.host.querySelector(`[data-cron-run-transcript]`);a?.focus({preventScroll:!0}),a?.scrollIntoView({block:`start`,behavior:`instant`})}render(){return this.entry?y`<section
      class="card"
      role="region"
      tabindex="-1"
      aria-label=${l(`tasksPage.transcript`)}
      data-cron-run-transcript
    >
      <div class="row">
        <h2>${this.task?mt(this.task):l(`tasksPage.transcript`)}</h2>
        <button class="btn btn--sm" @click=${()=>this.close()}>${l(`common.close`)}</button>
      </div>
      ${this.error?y`<p role="alert">${this.error}</p>
              <button class="btn btn--sm" @click=${()=>this.entry&&void this.open(this.entry)}>
                ${l(`common.retry`)}
              </button>`:this.task?Vt({host:this.transcript,task:this.task}):y`<p role="status">${l(`tasksPage.loading`)}</p>`}
    </section>`:x}}})))()}function F(e){let t=e.tabs;return t?Lt({id:t.id,active:e.value,tabs:e.options.map(e=>({value:e.value,label:e.label,testId:e.testId})),ariaLabel:e.ariaLabel??``,panelId:t.panelId,className:`cron-tabs`,variant:t.variant,onSelect:e.onChange}):Nt({value:e.value,options:e.options,ariaLabel:e.ariaLabel,onChange:t=>e.onChange(t)})}function xn(){return(xn=e((()=>{jt(),j()})))()}function I(e,t,n,r){return{id:e,emoji:t,nameKey:`cron.suggestions.ideas.${e}.name`,taglineKey:`cron.suggestions.ideas.${e}.tagline`,promptKey:`cron.suggestions.ideas.${e}.prompt`,scheduleKey:n,schedule:r}}function Sn(e){return{name:l(e.nameKey),payloadText:l(e.promptKey),payloadKind:`agentTurn`,sessionTarget:`isolated`,wakeMode:`now`,deleteAfterRun:!1,enabled:!0,...e.schedule}}var L,R,Cn,wn,Tn;function En(){return(En=e((()=>{m(),L={scheduleKind:`cron`,cronExpr:`0 9 * * 1-5`},R={scheduleKind:`cron`,cronExpr:`0 8 * * *`},Cn={scheduleKind:`cron`,cronExpr:`0 9 * * 1`},wn={scheduleKind:`every`,everyAmount:`1`,everyUnit:`hours`},Tn=[I(`repoPulse`,`🐙`,`cron.suggestions.schedules.weekdayMornings`,L),I(`standupGhostwriter`,`👻`,`cron.suggestions.schedules.weekdayMornings`,L),I(`hackerNewsScout`,`🔭`,`cron.suggestions.schedules.everyMorning`,R),I(`dependencyRadar`,`🛰️`,`cron.suggestions.schedules.weekly`,Cn),I(`watchdog`,`🦉`,`cron.suggestions.schedules.hourly`,wn),I(`polyglotMinute`,`🗣️`,`cron.suggestions.schedules.everyMorning`,R)]})))()}function z(e,t,n){return y`
    <label class="field">
      <span>${n.label}</span>
      <select
        class="settings-select"
        data-test-id=${b(n.testId)}
        .value=${n.value}
        @change=${n=>{if(n.currentTarget instanceof HTMLSelectElement)return e.onJobsFiltersChange({[t]:n.currentTarget.value})}}
      >
        ${n.options.map(({value:e,label:t})=>y`<option value=${e} ?selected=${e===n.value}>${t}</option>`)}
      </select>
    </label>
  `}function Dn(e,t){return y`
    <button
      id="cron-jobs-filter-trigger"
      type="button"
      class="btn btn--sm cron-filter-popover__trigger ${t?`active`:``}"
      title=${l(`cron.list.filters`)}
      aria-label=${l(`cron.list.filters`)}
      aria-haspopup="dialog"
      aria-expanded="false"
    >
      ${T(`listFilter`)}
    </button>
    <wa-popover
      ${me(It)}
      class="cron-filter-popover"
      for="cron-jobs-filter-trigger"
      aria-label=${l(`cron.list.filters`)}
      placement="bottom-end"
      without-arrow
      @wa-show=${e=>{e.currentTarget instanceof Element&&e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`true`)}}
      @wa-hide=${e=>{e.currentTarget instanceof Element&&e.currentTarget.previousElementSibling?.setAttribute(`aria-expanded`,`false`)}}
    >
      <div class="cron-filter-popover__panel">
        ${z(e,`cronJobsScheduleKindFilter`,{label:l(`cron.jobs.schedule`),value:e.jobsScheduleKindFilter,testId:`cron-jobs-schedule-filter`,options:Object.entries(On).map(([e,t])=>({value:e,label:l(t)}))})}
        ${z(e,`cronJobsLastStatusFilter`,{label:l(`cron.jobs.lastRun`),value:e.jobsLastStatusFilter,testId:`cron-jobs-last-status-filter`,options:[{value:`all`,label:l(`cron.jobs.all`)},{value:`ok`,label:l(`cron.runs.runStatusOk`)},{value:`error`,label:l(`cron.runs.runStatusError`)},{value:`skipped`,label:l(`cron.runs.runStatusSkipped`)},{value:`unknown`,label:l(`cron.runs.runStatusUnknown`)}]})}
        ${z(e,`cronJobsTriggerFilter`,{label:l(`cron.jobs.condition`),value:e.jobsTriggerFilter,testId:`cron-jobs-trigger-filter`,options:[{value:`all`,label:l(`cron.jobs.all`)},{value:`conditional`,label:l(`cron.jobs.conditional`)},{value:`unconditional`,label:l(`cron.jobs.unconditional`)}]})}
        ${z(e,`cronJobsSortBy`,{label:l(`cron.jobs.sort`),value:e.jobsSortBy,options:[{value:`nextRunAtMs`,label:l(`cron.jobs.nextRun`)},{value:`updatedAtMs`,label:l(`cron.jobs.recentlyUpdated`)},{value:`name`,label:l(`cron.jobs.name`)}]})}
        ${z(e,`cronJobsSortDir`,{label:l(`cron.jobs.direction`),value:e.jobsSortDir,options:[{value:`asc`,label:l(`cron.jobs.ascending`)},{value:`desc`,label:l(`cron.jobs.descending`)}]})}
        <button
          class="btn btn--sm"
          data-test-id="cron-jobs-filters-reset"
          ?disabled=${!t}
          @click=${e.onJobsFiltersReset}
        >
          ${l(`cron.jobs.reset`)}
        </button>
      </div>
    </wa-popover>
  `}var On;function kn(){return(kn=e((()=>{S(),pe(),ge(),w(),Rt(),m(),N(),M(),On={all:`cron.jobs.all`,at:`cron.form.at`,every:`cron.form.every`,cron:`cron.form.cronOption`,"on-exit":`cron.form.repeatOnExit`,stream:`cron.form.repeatStream`}})))()}function B(e,t){return y`
    <div class="cron-condition-activity__metric">
      <dt>${e}</dt>
      <dd>${t}</dd>
    </div>
  `}function An(e){let t=g(e.lastCheckedAtMs,{fallback:l(`cron.runs.notChecked`)}),n=g(e.lastFiredAtMs,{fallback:l(`cron.runs.neverFired`)});return y`
    <div class="cron-condition-activity" data-test-id="cron-condition-activity">
      <div class="cron-condition-activity__intro">
        <div class="settings-row__title">
          <span class="cron-condition-activity__icon" aria-hidden="true">${T(`gitBranch`)}</span>
          ${l(`cron.runs.conditionActivity`)}
        </div>
        <div class="settings-row__desc">${l(`cron.runs.conditionActivityHint`)}</div>
      </div>
      <dl class="cron-condition-activity__metrics">
        ${B(l(`cron.runs.checks`),String(e.checkCount))}
        ${B(l(`cron.runs.lastChecked`),t)}
        ${B(l(`cron.runs.lastFired`),n)}
      </dl>
    </div>
  `}function jn(e){if(e.checkCount===0)return l(`cron.runs.emptyConditionUnchecked`);let t=e.checkCount===1?`cron.runs.emptyConditionHintOne`:`cron.runs.emptyConditionHint`;return l(t,{count:String(e.checkCount)})}function Mn(){return[{value:`ok`,label:l(`cron.runs.runStatusOk`)},{value:`error`,label:l(`cron.runs.runStatusError`)},{value:`skipped`,label:l(`cron.runs.runStatusSkipped`)}]}function Nn(){return[{value:`delivered`,label:l(`cron.runs.deliveryDelivered`)},{value:`not-delivered`,label:l(`cron.runs.deliveryNotDelivered`)},{value:`unknown`,label:l(`cron.runs.deliveryUnknown`)},{value:`not-requested`,label:l(`cron.runs.deliveryNotRequested`)}]}function Pn(e,t,n){let r=new Set(e);return n?r.add(t):r.delete(t),Array.from(r)}function Fn(e,t){return e.length===0?t:e.length<=2?e.join(`, `):`${e[0]} +${e.length-1}`}function In(e){let t=e.options.filter(t=>e.selected.includes(t.value)).map(e=>e.label),n=t.length>2?`${e.summary} (${new Intl.ListFormat(re.getLocale(),{style:`long`,type:`conjunction`}).format(t)})`:e.summary;return y`
    <div class="cron-filter-dropdown" data-filter=${e.id}>
      <wa-dropdown
        class="cron-filter-dropdown__details"
        placement="bottom-start"
        @wa-select=${t=>{let n=t.detail.item.value;if(n===`${H}clear`){e.onClear();return}if(n?.startsWith(V)){t.preventDefault();let r=n.slice(7);e.onToggle(r,!e.selected.includes(r))}}}
      >
        <button
          slot="trigger"
          type="button"
          class="btn btn--sm cron-filter-dropdown__trigger ${e.selected.length>0?`active`:``}"
          title=${e.title}
          aria-label=${`${e.title} ${n}`}
        >
          <span>${e.summary}</span>
          ${T(`chevronDown`)}
        </button>
        ${e.options.map(t=>y`
            <wa-dropdown-item
              class="cron-filter-dropdown__option"
              type="checkbox"
              value=${`${V}${t.value}`}
              .checked=${e.selected.includes(t.value)}
            >
              ${t.label}
            </wa-dropdown-item>
          `)}
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item value=${`${H}clear`}>
          ${l(`cron.runs.clear`)}
        </wa-dropdown-item>
      </wa-dropdown>
    </div>
  `}function Ln(e){let t=de(),n=e.runs.toSorted((t,n)=>e.runsSortDir===`asc`?t.ts-n.ts:n.ts-t.ts),r=e.runsQuery.trim().length>0||e.runsStatuses.length>0||e.runsDeliveryStatuses.length>0,i=Mn(),a=Nn(),o=i.filter(t=>e.runsStatuses.includes(t.value)).map(e=>e.label),s=a.filter(t=>e.runsDeliveryStatuses.includes(t.value)).map(e=>e.label),c=Fn(o,l(`cron.runs.allStatuses`)),u=Fn(s,l(`cron.runs.allDelivery`)),d=e.runsSortDir===`asc`?l(`cron.runs.oldestFirst`):l(`cron.runs.newestFirst`);return y`
    <div class="cron-runs" aria-busy=${String(e.runsState===`pending`)}>
      ${e.conditionActivity?An(e.conditionActivity):x}
      <div class="cron-run-filters">
        <div class="cron-search-box cron-run-filter-search">
          <span class="cron-search-box__icon" aria-hidden="true">${T(`search`)}</span>
          <input
            type="search"
            class="settings-input"
            .value=${e.runsQuery}
            aria-label=${l(`cron.runs.searchRuns`)}
            placeholder=${l(`cron.runs.searchPlaceholder`)}
            @input=${t=>e.onRunsFiltersChange({cronRunsQuery:t.target.value})}
          />
        </div>
        ${In({id:`status`,title:l(`cron.runs.status`),summary:c,options:i,selected:e.runsStatuses,onToggle:(t,n)=>{let r=Pn(e.runsStatuses,t,n);e.onRunsFiltersChange({cronRunsStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsStatuses:[]})}})}
        ${In({id:`delivery`,title:l(`cron.runs.delivery`),summary:u,options:a,selected:e.runsDeliveryStatuses,onToggle:(t,n)=>{let r=Pn(e.runsDeliveryStatuses,t,n);e.onRunsFiltersChange({cronRunsDeliveryStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
        <div class="cron-filter-dropdown">
          <wa-dropdown
            class="cron-filter-dropdown__details"
            placement="bottom-start"
            @wa-select=${t=>{let n=t.detail.item.value;(n===`asc`||n===`desc`)&&e.onRunsFiltersChange({cronRunsSortDir:n})}}
          >
            <button
              slot="trigger"
              type="button"
              class="btn btn--sm cron-filter-dropdown__trigger cron-run-sort"
              aria-label=${`${l(`cron.jobs.sort`)} ${d}`}
            >
              <span>${d}</span>
              ${T(`chevronDown`)}
            </button>
            <wa-dropdown-item value="desc" aria-current=${String(e.runsSortDir===`desc`)}>
              ${l(`cron.runs.newestFirst`)}
              <span slot="details" aria-hidden="true">
                ${e.runsSortDir===`desc`?T(`check`):x}
              </span>
            </wa-dropdown-item>
            <wa-dropdown-item value="asc" aria-current=${String(e.runsSortDir===`asc`)}>
              ${l(`cron.runs.oldestFirst`)}
              <span slot="details" aria-hidden="true">
                ${e.runsSortDir===`asc`?T(`check`):x}
              </span>
            </wa-dropdown-item>
          </wa-dropdown>
        </div>
      </div>
      ${e.runsState===`failed`?y`<button class="btn btn--sm" @click=${e.onRefresh}>${l(`common.retry`)}</button>`:x}
      ${n.length===0?e.runsState===`pending`?y`<div
                class="cron-empty-state"
                role="status"
                aria-live="polite"
                data-test-id="cron-runs-loading"
              >
                ${l(`cron.list.loading`)}
              </div>`:e.runsState===`ready`?r?y`<div class="muted cron-runs__empty">${l(`cron.runs.noMatching`)}</div>`:y`
                    <div class="cron-empty-state">
                      <div class="cron-empty-state__title">
                        ${e.conditionActivity?l(`cron.runs.emptyConditionTitle`):l(`cron.runs.emptyTitle`)}
                      </div>
                      <div class="cron-empty-state__copy">
                        ${e.conditionActivity?jn(e.conditionActivity):l(`cron.runs.emptyHint`)}
                      </div>
                    </div>
                  `:x:y`
              <div class="cron-runs__list">
                ${n.map(n=>Vn(n,t,e.highlightedRunId,e.onViewRunTranscript))}
              </div>
            `}
      ${e.runsHasMore?y`
              <button
                class="btn btn--sm cron-load-more"
                ?disabled=${e.runsLoadingMore}
                @click=${e.onLoadMoreRuns}
              >
                ${e.runsLoadingMore?l(`cron.list.loading`):l(`cron.runs.loadMore`)}
              </button>
            `:x}
    </div>
  `}function Rn(e,t=Date.now()){let n=g(e);return l(e>t?`cron.runEntry.next`:`cron.runEntry.due`,{rel:n})}function zn(e,t){if(e===`ok`&&(t===`failed`||t===`unknown`)){let e=l(t===`failed`?`cron.runs.runStatusError`:`cron.runs.runStatusUnknown`);return`${l(`cron.runs.runStatusOk`)} · ${e}`}switch(e){case`ok`:return l(`cron.runs.runStatusOk`);case`error`:return l(`cron.runs.runStatusError`);case`skipped`:return l(`cron.runs.runStatusSkipped`);default:return l(`cron.runs.runStatusUnknown`)}}function Bn(e){switch(e){case`delivered`:return l(`cron.runs.deliveryDelivered`);case`not-delivered`:return l(`cron.runs.deliveryNotDelivered`);case`not-requested`:return l(`cron.runs.deliveryNotRequested`);default:return l(`cron.runs.deliveryUnknown`)}}function Vn(e,t,n,r){let i=zn(e.status??`unknown`,e.completionStatus),a=Bn(e.deliveryStatus??`not-requested`),o=e.usage,s=o&&typeof o.total_tokens==`number`?`${_(o.total_tokens)} ${l(`usage.metrics.tokens`)}`:o&&typeof o.input_tokens==`number`&&typeof o.output_tokens==`number`?`${_(o.input_tokens)} in / ${_(o.output_tokens)} out`:null,c=e.summary||v(e.error)||l(`cron.runEntry.noSummary`),u=!!e.error&&!!e.summary,d=v(e.deliverySuppressionReason),f=[a,d?l(`cron.runEntry.deliverySuppression`,{reason:d}):null,e.model,e.provider,s].filter(Boolean),p=!!(n&&_n(n,e));return y`
    <div class="cron-run-entry ${p?`cron-run-entry--highlighted`:``}">
      <div class="cron-run-entry__header">
        <div class="cron-run-entry__main">
          <div class="cron-run-entry__title">
            ${e.jobName??e.jobId}
            <span class="muted"> · ${i}</span>
          </div>
          <div class="cron-run-entry__facts muted">${f.join(` · `)}</div>
        </div>
        <div class="cron-run-entry__meta">
          <div>${t(e.ts)}</div>
          ${typeof e.runAtMs==`number`?y`<div class="muted">
                  ${l(`cron.runEntry.runAt`)} ${t(e.runAtMs)}
                </div>`:x}
          <div class="muted">
            ${typeof e.durationMs==`number`&&Number.isFinite(e.durationMs)?dt(e.durationMs)??vt(e.durationMs,l(`common.na`)):l(`common.na`)}
          </div>
          ${typeof e.nextRunAtMs==`number`?y`<div class="muted">${Rn(e.nextRunAtMs)}</div>`:x}
          ${e.sessionKey?y`<div>
                  <button class="btn btn--sm" @click=${()=>r?.(e)}>
                    ${l(`tasksPage.viewTranscript`)}
                  </button>
                </div>`:x}
          ${u?y`<div class="muted">${v(e.error)}</div>`:x}
          ${e.deliveryError?y`<div class="muted">${v(e.deliveryError)}</div>`:x}
        </div>
      </div>
      <div class="cron-run-entry__body chat-text">
        ${ve(Ft(c))}
      </div>
    </div>
  `}var V,H;function Hn(){return(Hn=e((()=>{S(),be(),w(),wt(),At(),m(),N(),rt(),f(),ie(),P(),M(),V=`option:`,H=`command:`})))()}function Un(e){return[{value:`last`,label:`last`,kind:`neutral`},...n(e.channels.filter(Boolean)).map(t=>({value:t,label:e.channelMeta?.find(e=>e.id===t)?.label||e.channelLabels?.[t]||t}))]}function U(e,t){let r=n(o(t));return r.length===0?x:y`<datalist id=${e}>
        ${r.map(e=>y`<option value=${e}></option> `)}
      </datalist>`}function W(e){return`cron-error-${e}`}function G(e){return`cron-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`}function Wn(e,t,n){return e===`payloadText`&&t.payloadKind===`systemEvent`?l(`cron.form.mainTimelineMessage`):l(e===`deliveryTo`&&n===`webhook`?`cron.form.webhookUrl`:wr[e])}function Gn(e,t,n){return Object.keys(wr).flatMap(r=>{let i=e[r];return i?[{key:r,label:Wn(r,t,n),message:i,inputId:G(r)}]:[]})}function Kn(e){let t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`center`,behavior:ut()}),t.focus())}function qn(e,t){return e?y`<div id=${b(t)} class="cron-help cron-error">${l(e)}</div>`:x}function Jn(e){return y`
    ${e}
    <span class="cron-required-marker" aria-hidden="true">*</span>
    <span class="cron-required-sr">${l(`cron.form.requiredSr`)}</span>
  `}function K(e){let t=e.wide?`cron-control cron-control--wide`:`cron-control`,n=y`<div class=${t}>
    ${e.control}${qn(e.error,e.errorId)}
  </div>`;return y`
    <div class=${e.stacked?`settings-row settings-row--stacked`:`settings-row`}>
      <label class="settings-row__text" for=${b(e.controlId||void 0)}>
        <span class="settings-row__title">
          ${e.required?Jn(e.label):e.label}
        </span>
        ${e.help?y`<span class="settings-row__desc">${e.help}</span>`:x}
      </label>
      <div class="settings-row__control">${n}</div>
    </div>
  `}function q(e,t,n){let r=n.errorKey?e.fieldErrors[n.errorKey]:void 0,i=r&&n.errorKey&&n.describeError!==!1?W(n.errorKey):void 0;return y`
    <input
      id=${G(t)}
      class=${n.mono?`settings-input mono`:`settings-input`}
      type=${b(n.type)}
      aria-required=${b(n.required?`true`:void 0)}
      .value=${e.form[t]}
      list=${b(n.list)}
      ?disabled=${n.disabled??!1}
      aria-invalid=${b(n.errorKey?r?`true`:`false`:void 0)}
      aria-describedby=${b(i)}
      placeholder=${b(n.placeholder)}
      @input=${n=>e.onFormChange({[t]:n.currentTarget.value})}
    />
  `}function J(e,t,n){let r=n.errorKey;return K({label:n.label,controlId:G(t),required:n.required,help:n.help,error:r?e.fieldErrors[r]:void 0,errorId:r?W(r):void 0,control:q(e,t,n)})}function Y(e,t,n){let r=n.value??e.form[t];return(n.channel?Kt:Tt)({id:n.standalone?void 0:G(t),label:n.label,value:n.channel?r||`last`:r,options:n.options,disabled:n.disabled,onChange:n=>e.onFormChange({[t]:n})})}function X(e,t,n){return K({label:n.label,controlId:G(t),help:n.help,control:Y(e,t,n)})}function Z(e,t,n){return Dt({title:n.label,description:n.help,checked:e.form[t],onChange:n=>e.onFormChange({[t]:n})})}function Yn(e){let t=e.editingJob?`job`:e.createOpen?`create`:`overview`;return y`
    ${t===`overview`?Zn(e):ur(e,t)}
    ${U(`cron-agent-suggestions`,e.agentSuggestions)}
    ${U(`cron-thinking-suggestions`,e.thinkingSuggestions)}
    ${U(`cron-tz-suggestions`,e.timezoneSuggestions)}
    ${U(`cron-delivery-to-suggestions`,e.deliveryToSuggestions)}
    ${U(`cron-delivery-account-suggestions`,e.accountSuggestions)}
  `}function Xn(e){return e.canManage?x:y`<div class="cron-admin-note" role="note">
        <span aria-hidden="true">${T(`lock`)}</span>
        <span>${l(`cron.adminRequired`)}</span>
      </div>`}function Zn(e){let t=e.jobsScheduleKindFilter!==`all`||e.jobsLastStatusFilter!==`all`||e.jobsTriggerFilter!==`all`||e.jobsSortBy!==`nextRunAtMs`||e.jobsSortDir!==`asc`,n=t||e.jobsQuery.trim().length>0||e.jobsEnabledFilter!==`all`,r=!e.loading&&e.hasLoaded&&!e.listError&&!e.error&&e.jobsTotal===0&&!n&&e.canManage,i=[y`
      <div class="cron-overview-header">
        ${Xn(e)}
        ${e.status&&!e.status.enabled?y`
                <div class="cron-error-banner" data-test-id="cron-scheduler-banner">
                  <strong>${l(`cron.list.schedulerOff`)}</strong>
                  ${l(`cron.runNotStarted.stopped`)}
                </div>
              `:x}
        ${e.listError?y`<div class="cron-error-banner" role="alert">${e.listError}</div>`:x}
        ${e.error?y`<div class="cron-error-banner" role="alert">${e.error}</div>`:x}
        ${$n(e,t)}
      </div>
    `,y`
      <div
        id="cron-list-panel"
        class="cron-tab-panel"
        role="tabpanel"
        aria-labelledby=${`cron-list-tab-${e.listTab===`activity`?`activity`:e.jobsEnabledFilter}`}
      >
        ${e.listTab===`activity`?A({},y`<div class="cron-activity">${Ln(e)}</div>`):[A({},er(e,n)),r?lr(e):x]}
      </div>
    `];return y`
    <section class="cron-page" data-panel-mode="overview">
      ${Bt(i,{wide:!0})}
    </section>
  `}function Qn(e){return F({value:e.listTab===`activity`?`activity`:e.jobsEnabledFilter,options:[...Tr.map(e=>({value:e.value,label:l(e.labelKey),testId:`cron-tab-${e.value}`})),{value:`activity`,label:l(`cron.list.activityTab`),testId:`cron-list-tab-activity`}],ariaLabel:l(`cron.list.viewLabel`),tabs:{id:`cron-list`,panelId:`cron-list-panel`},onChange:t=>{if(t===`activity`){e.onListTabChange(`activity`);return}e.onListTabChange(`tasks`),t!==e.jobsEnabledFilter&&e.onJobsFiltersChange({cronJobsEnabledFilter:t})}})}function $n(e,t){return y`
    <div class="cron-toolbar">
      ${e.listTab===`tasks`?y`
              <div class="cron-toolbar__filters">
                <div class="cron-search-box">
                  <span class="cron-search-box__icon" aria-hidden="true">${T(`search`)}</span>
                  <input
                    type="search"
                    class="settings-input"
                    .value=${e.jobsQuery}
                    aria-label=${l(`cron.list.searchPlaceholder`)}
                    placeholder=${l(`cron.list.searchPlaceholder`)}
                    @input=${t=>e.onJobsFiltersChange({cronJobsQuery:t.target.value})}
                  />
                </div>
                ${Dn(e,t)}
              </div>
            `:x}
      <div class="cron-toolbar__primary">
        ${Qn(e)}
        <div class="cron-toolbar__actions">
          <button
            type="button"
            class="btn btn--sm btn--ghost cron-refresh ${e.loading?`cron-refresh--loading`:``}"
            ?disabled=${e.loading}
            title=${e.loading?l(`cron.list.refreshing`):l(`cron.list.refresh`)}
            aria-label=${l(`cron.list.refresh`)}
            @click=${e.onRefresh}
          >
            ${T(`refresh`)}
          </button>
          ${e.canManage?y`
                  <button
                    type="button"
                    class="btn primary btn--sm cron-new-task"
                    data-test-id="cron-new-task"
                    @click=${()=>e.onOpenCreate()}
                  >
                    ${T(`plus`)} ${l(`cron.list.newTask`)}
                  </button>
                `:x}
        </div>
      </div>
    </div>
  `}function er(e,t){let n=e.loading&&!e.hasLoaded,r=e.loading||e.jobsLoadingMore,i=e.jobs.toSorted((e,t)=>Number(E(t))-Number(E(e)));return y`
    <div
      class="cron-table ${e.canManage?``:`cron-table--read-only`}"
      aria-busy=${r?`true`:x}
    >
      <div class="cron-table__head">
        <span>${l(`cron.jobs.name`)}</span>
        <span>${l(`cron.jobs.schedule`)}</span>
        <span>${l(`cron.jobs.nextRun`)}</span>
        <span>${l(`cron.jobs.lastRun`)}</span>
        ${e.canManage?y`<span aria-hidden="true"></span>`:x}
      </div>
      ${i.length===0?n?y`
                <div
                  class="cron-empty-state"
                  role="status"
                  aria-live="polite"
                  data-test-id="cron-jobs-loading"
                >
                  <div class="cron-empty-state__title">${l(`cron.list.loading`)}</div>
                </div>
              `:e.hasLoaded?y`
                  <div class="cron-empty-state">
                    <div class="cron-empty-state__title">
                      ${l(t?`cron.list.noMatching`:`cron.list.emptyTitle`)}
                    </div>
                    ${t?x:y`<div class="cron-empty-state__copy">
                            ${l(`cron.list.emptyHint`)}
                          </div>`}
                  </div>
                `:x:he(i,e=>e.id,t=>tr(t,e))}
      ${en({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMoreJobs})}
    </div>
  `}function Q(e){return Ne(e?.declarationKey)}function tr(e,t){let n=e.displayName??e.name,r=e.description?.trim(),i=Q(e),a=e.state?.nextRunAtMs,o=typeof a==`number`&&Number.isFinite(a),s=Le(e)?y`<span class="cron-table__running">${l(`cron.runs.runStatusRunning`)}</span>`:o?g(a):l(`common.na`);return y`
    <div
      class="cron-table__row ${e.enabled?``:`cron-table__row--paused`}"
      data-test-id=${`cron-row-${e.id}`}
      @click=${()=>t.onSelectJob(e)}
    >
      <button type="button" class="cron-table__name">
        ${rr(e)}
        <span class="cron-table__name-copy">
          <span class="cron-table__name-line">
            <span class="cron-table__name-text">${n}</span>
            ${e.trigger?ir():x}
          </span>
          ${i?x:Xt(e.agentId)}
          ${r||!e.enabled?y`
                  <span class="cron-table__name-meta">
                    ${r?y`
                            <span
                              class="cron-table__description"
                              data-test-id=${`cron-row-description-${e.id}`}
                              title=${`${l(`cron.form.description`)}: ${r}`}
                              >${r}</span
                            >
                          `:x}
                    ${r&&!e.enabled?y`<span class="cron-table__meta-separator" aria-hidden="true">·</span>`:x}
                    ${e.enabled?x:ar(e)}
                  </span>
                `:x}
        </span>
      </button>
      ${nr(`cron-table__schedule`,l(`cron.jobs.schedule`),nn(e))}
      ${nr(`cron-table__next`,l(`cron.jobs.nextRun`),s)}
      ${nr(`cron-table__last`,l(`cron.jobs.lastRun`),sr(e))}
      ${t.canManage?y`
              <span class="cron-table__actions" @click=${e=>e.stopPropagation()}>
                <button
                  type="button"
                  class="btn btn--sm btn--ghost cron-row-run"
                  data-test-id=${`cron-row-run-${e.id}`}
                  title=${l(`cron.actions.runNowJob`,{name:n})}
                  aria-label=${l(`cron.actions.runNowJob`,{name:n})}
                  ?disabled=${t.busy}
                  @click=${()=>t.onRun(e,`force`)}
                >
                  ${T(`play`)}
                </button>
                ${i?x:fr(t,e,{compact:!0,testId:`cron-row-toggle-${e.id}`})}
                ${cr(t,e)}
              </span>
            `:x}
    </div>
  `}function nr(e,t,n){return y`<span class="cron-table__cell ${e}">
    <span class="cron-table__cell-label">${t}</span>
    <span class="cron-table__cell-value">${n}</span>
  </span>`}function rr(e){let t=e.state?.autoDisabled,n=Le(e)?{className:`cron-table__state--running`,iconName:`loader`,label:l(`cron.runs.runStatusRunning`)}:t?{className:`cron-table__state--error`,iconName:`lock`,label:or(e)}:E(e)?{className:`cron-table__state--error`,iconName:`alertTriangle`,label:l(`cron.runs.runStatusError`)}:e.enabled?{className:`cron-table__state--active`,iconName:null,label:l(`cron.detail.active`)}:{className:`cron-table__state--paused`,iconName:`pause`,label:l(`cron.list.paused`)};return y`<span
    class="cron-table__state ${n.className}"
    role="img"
    aria-label=${n.label}
    title=${n.label}
    >${n.iconName?T(n.iconName):y`<span class="cron-table__state-dot"></span>`}</span
  >`}function ir(){let e=l(`cron.form.triggerConfigured`);return y`<span class="cron-trigger-icon" role="img" aria-label=${e} title=${e}
    >${T(`gitBranch`)}</span
  >`}function ar(e){if(!e.state?.autoDisabled)return y`<span class="muted cron-table__paused-note">${l(`cron.list.paused`)}</span>`;let t=or(e),n=e.state?.lastError?.trim();return y`<span
    class="cron-table__paused-note cron-table__auto-disabled"
    data-test-id=${`cron-row-auto-disabled-${e.id}`}
    title=${n?v(n):t}
    >${t}</span
  >`}function or(e){let t=e.state?.autoDisabled;return t?l(t.reason===`schedule-errors`?`cron.list.autoDisabledScheduleErrors`:`cron.list.autoDisabledRunFailures`,{count:String(t.consecutiveErrors)}):l(`cron.list.paused`)}function sr(e){let t=Ke(e),n=e.state?.lastRunAtMs,r=typeof n==`number`&&Number.isFinite(n)?g(n):null;if(t===`unknown`||!r)return y`<span class="muted">${l(`common.na`)}</span>`;let i=t===`ok`?y`<span class="cron-last-glyph cron-last-glyph--ok">${T(`check`)}</span>`:t===`error`?y`<span class="cron-last-glyph cron-last-glyph--error">${T(`x`)}</span>`:y`<span class="cron-last-glyph">${T(`cornerDownRight`)}</span>`,a=zn(t);return y`
    <span class="cron-table__last-run" role="img" aria-label=${a} title=${a}>
      ${i}
      <span class="cron-table__last-time">${r}</span>
    </span>
  `}function cr(e,t){if(!e.canManage)return x;let n=Q(t),r=t.displayName??t.name;return y`
    <wa-dropdown
      class="cron-job-menu"
      placement="bottom-end"
      @wa-select=${r=>{if(e.canManage)switch(r.detail.item.value){case`run-if-due`:e.onRun(t,`due`);break;case`clone`:n||e.onClone(t);break;case`remove`:n||e.onRemove(t);break;case void 0:}}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost cron-job-menu__trigger"
        aria-label=${l(`cron.actions.moreJob`,{name:r})}
        title=${l(`cron.actions.moreJob`,{name:r})}
      >
        ${T(`moreHorizontal`)}
      </button>
      ${hr(e,`run-if-due`,l(`cron.actions.runIfDue`))}
      ${n?x:hr(e,`clone`,l(`cron.actions.clone`))}
      ${n?x:hr(e,`remove`,l(`cron.actions.remove`),{danger:!0})}
    </wa-dropdown>
  `}function lr(e){return A({title:l(`cron.suggestions.title`)},Tn.map(t=>y`
        <button
          type="button"
          class="settings-row settings-row--nav cron-suggestion"
          data-suggestion=${t.id}
          @click=${()=>e.onOpenCreate(Sn(t))}
        >
          <div class="settings-row__text">
            <span class="settings-row__title">
              <span aria-hidden="true">${t.emoji}</span> ${l(t.nameKey)}
            </span>
            <span class="settings-row__desc">${l(t.taglineKey)}</span>
          </div>
          <div class="settings-row__control">
            <span class="settings-row__value">${l(t.scheduleKey)}</span>
            <span class="settings-row__chevron">${Ce.chevronRight}</span>
          </div>
        </button>
      `))}function ur(e,t){let n=t===`job`?e.editingJob??void 0:void 0,r=t===`job`&&!!n,i=t===`job`&&e.detailTab===`history`,a=n?.trigger?{checkCount:n.state?.triggerEvalCount??0,lastCheckedAtMs:n.state?.lastTriggerEvalAtMs,lastFiredAtMs:n.state?.lastTriggerFireAtMs}:void 0,o=[y`
      <div class="cron-back-row">
        <button
          type="button"
          class="cron-back"
          data-test-id="cron-back"
          ?disabled=${e.busy}
          @click=${e.onClosePanel}
        >
          ${T(`arrowLeft`)} ${l(`cron.detail.back`)}
        </button>
      </div>
    `,dr(e,t,n),Xn(e),r?pr(e):x,e.error?y`<div class="cron-error-banner" role="alert">${e.error}</div>`:x,y`
      <div
        id="cron-detail-panel"
        class="cron-tab-panel"
        role=${r?`tabpanel`:x}
        aria-labelledby=${r?`cron-detail-tab-${e.detailTab}`:x}
      >
        ${i?A({title:l(`cron.detail.historyTitle`)},y`<div class="cron-history">
                  ${Ln({...e,conditionActivity:a})}
                </div>`):mr(e,t)}
      </div>
    `];return y`
    <section class="cron-page cron-page--detail" data-panel-mode=${t}>
      ${Bt(o,{wide:!0})}
    </section>
  `}function dr(e,t,n){let r=t===`job`?n?.displayName??n?.name??e.form.name:l(`cron.detail.newTitle`),i=t===`job`?n?.description?.trim():void 0,a=Q(n),o=n?.state?.nextRunAtMs,s=typeof o==`number`&&Number.isFinite(o)?` · ${l(`cron.jobState.next`)} ${g(o)}`:``,c=t===`job`&&n?`${nn(n)}${s}`:l(`cron.detail.newSubtitle`);return y`
    <div class="cron-detail-header">
      <div class="cron-detail-header__copy">
        <div class="cron-detail-title">${r}</div>
        ${i?y`<div class="cron-detail-description" data-test-id="cron-detail-description">
                <span class="cron-detail-description__label">${l(`cron.form.description`)}:</span>
                ${i}
              </div>`:x}
        <div class="cron-detail-meta">
          ${t===`job`&&n&&e.canManage&&!a?fr(e,n):x}
          <span class="cron-detail-sub">${c}</span>
          ${n?.trigger?ir():x}
        </div>
      </div>
      <div class="cron-detail-actions">
        ${t===`job`&&n&&e.canManage?y`
                <button
                  type="button"
                  class="btn btn--sm"
                  data-test-id="cron-run-now"
                  ?disabled=${e.busy}
                  @click=${()=>e.onRun(n,`force`)}
                >
                  ${T(`play`)} ${l(`cron.actions.runNow`)}
                </button>
                ${cr(e,n)}
              `:x}
      </div>
    </div>
  `}function fr(e,t,n){let r=t.enabled?l(`cron.detail.active`):l(`cron.detail.paused`),i=l(t.enabled?`cron.actions.pauseJob`:`cron.actions.resumeJob`,{name:t.displayName??t.name});return y`
    <span
      class="cron-enabled-toggle"
      data-test-id=${n?.testId??`cron-toggle-enabled`}
      title=${n?.compact?i:x}
    >
      ${Et({checked:t.enabled,disabled:e.busy||!e.canManage,ariaLabel:n?.compact?i:r,onChange:n=>{e.canManage&&e.onToggle(t,n)}})}
      ${n?.compact?x:y`<span class="cron-detail-sub">${r}</span>`}
    </span>
  `}function pr(e){return F({value:e.detailTab,options:[{value:`settings`,label:l(`cron.detail.settingsTab`),testId:`cron-detail-tab-settings`},{value:`history`,label:l(`cron.detail.historyTitle`),testId:`cron-detail-tab-history`}],ariaLabel:l(`cron.detail.tabsLabel`),tabs:{id:`cron-detail`,panelId:`cron-detail-panel`,variant:`sub`},onChange:e.onDetailTabChange})}function mr(e,t){let n=e.form.payloadLocked,r=t===`job`&&Q(e.editingJob),i=!n&&e.form.payloadKind===`agentTurn`,a=e.form.sessionTarget!==`main`&&(e.form.payloadKind===`agentTurn`||n),o=e.form.deliveryMode===`announce`&&!a?`none`:e.form.deliveryMode,s=Gn(e.fieldErrors,e.form,o),c=e.canManage&&!e.busy&&s.length>0,u=c&&!e.canSubmit?s.length===1?l(`cron.form.fixFields`,{count:String(s.length)}):l(`cron.form.fixFieldsPlural`,{count:String(s.length)}):``;return y`
    <fieldset
      class="cron-editor"
      ?disabled=${e.busy||!e.canManage||r}
      aria-busy=${String(e.busy)}
    >
      ${gr(e,{payloadLocked:n,isAgentTurn:i})} ${_r(e)}
      ${yr(e)}
      ${br(e,{supportsAnnounce:a,selectedDeliveryMode:o})}
      ${xr(e,{mode:t,isAgentTurn:i,selectedDeliveryMode:o})}
      ${c?y`
              <div class="cron-form-status" role="status" aria-live="polite">
                <div class="cron-form-status__title">${l(`cron.form.cantAddYet`)}</div>
                <div class="cron-help">${l(`cron.form.fillRequired`)}</div>
                <ul class="cron-form-status__list">
                  ${s.map(e=>y`
                      <li>
                        <button
                          type="button"
                          class="cron-form-status__link"
                          @click=${()=>Kn(e.inputId)}
                        >
                          ${e.label}: ${l(e.message)}
                        </button>
                      </li>
                    `)}
                </ul>
              </div>
            `:x}
      ${e.canManage&&!r?y`
              <div class="cron-editor-actions">
                <button
                  class="btn primary"
                  data-test-id="cron-submit"
                  ?disabled=${e.busy||!e.canSubmit}
                  @click=${e.onSubmit}
                >
                  ${e.busy?l(`cron.form.saving`):l(t===`job`?`cron.form.saveChanges`:`cron.form.createTask`)}
                </button>
                ${t===`create`?y`
                        <button
                          class="btn"
                          data-test-id="cron-submit-run"
                          ?disabled=${e.busy||!e.canSubmit}
                          @click=${e.onSubmitRunNow}
                        >
                          ${l(`cron.form.createAndRun`)}
                        </button>
                      `:x}
                <button class="btn" ?disabled=${e.busy} @click=${e.onClosePanel}>
                  ${l(`cron.form.cancel`)}
                </button>
                ${u?y`<div class="cron-submit-reason" aria-live="polite">
                        ${u}
                      </div>`:x}
              </div>
            `:x}
    </fieldset>
  `}function hr(e,t,n,r){return y`
    <wa-dropdown-item
      class=${r?.danger?`cron-job-menu__item danger`:`cron-job-menu__item`}
      value=${t}
      variant=${r?.danger?`danger`:`default`}
      ?disabled=${e.busy||!e.canManage}
    >
      ${n}
    </wa-dropdown-item>
  `}function gr(e,t){let r=e.form.payloadKind===`script`?l(`cron.form.script`):e.form.payloadKind===`heartbeat`?`Heartbeat monitor`:e.form.payloadKind===`agentTurn`?l(`cron.form.assistantTaskPrompt`):l(`cron.form.command`),i=t.payloadLocked?r:e.form.payloadKind===`systemEvent`?l(`cron.form.mainTimelineMessage`):l(`cron.form.assistantTaskPrompt`),a=t.payloadLocked?l(`cron.form.readOnlyPayloadHelp`):e.form.payloadKind===`systemEvent`?l(`cron.form.systemEventHelp`):l(`cron.form.agentTurnHelp`),o=t.payloadLocked?Er[e.form.payloadKind]:``,s=e.form.payloadKind===`heartbeat`?e.heartbeatScratch:e.form.payloadText,c=K({label:i,controlId:o?``:`cron-payload-text`,required:!0,help:a,stacked:!0,wide:!0,error:e.fieldErrors.payloadText,errorId:W(`payloadText`),control:o?y`
          <pre
            id="cron-payload-text"
            class="code-block cron-payload-code"
            data-test-id="cron-payload-code"
            tabindex="0"
            role="region"
            aria-label=${i}
          ><code class="hljs">${ve(Ot(s,o))}</code></pre>
        `:y`
          <textarea
            id="cron-payload-text"
            class="settings-input"
            rows="6"
            .value=${s}
            ?readonly=${t.payloadLocked}
            aria-required="true"
            placeholder=${l(`cron.form.promptPlaceholder`)}
            aria-invalid=${e.fieldErrors.payloadText?`true`:`false`}
            aria-describedby=${b(e.fieldErrors.payloadText?W(`payloadText`):void 0)}
            @input=${t=>e.onFormChange({payloadText:t.target.value})}
          ></textarea>
        `}),u=l(`cron.form.action`),d=t.payloadLocked?K({label:u,controlId:G(`payloadKind`),control:y`
          <input
            id=${G(`payloadKind`)}
            class="settings-input"
            .value=${r}
            readonly
          />
        `}):X(e,`payloadKind`,{label:u,options:[{value:`systemEvent`,label:l(`cron.form.systemEvent`)},{value:`agentTurn`,label:l(`cron.form.agentTurn`)}]}),f=l(`cron.form.model`),p=e.fieldErrors.payloadModel,m=n(e.modelSuggestions).map(e=>({value:e,label:e,provider:Mt(e)??void 0})),ee=t.isAgentTurn?y`
        ${K({label:f,controlId:``,help:l(`cron.form.modelHelp`),error:p,errorId:W(`payloadModel`),control:Qt({id:`cron-payload-model-picker`,label:f,value:e.form.payloadModel,options:[{value:``,label:l(`quickSettings.model.default`)},...m],custom:{id:G(`payloadModel`),label:l(`cron.form.customModel`),placeholder:l(`cron.form.modelPlaceholder`),invalid:!!p,describedBy:p?W(`payloadModel`):void 0},onChange:t=>e.onFormChange({payloadModel:t})})})}
        ${J(e,`payloadThinking`,{label:l(`cron.form.thinking`),help:l(`cron.form.thinkingHelp`),errorKey:`payloadThinking`,describeError:!1,list:`cron-thinking-suggestions`,placeholder:l(`cron.form.thinkingPlaceholder`)})}
      `:x;return A({},y`${c}${d}${ee}`)}function _r(e){let t=e.form.sessionTarget,n=t===`main`||t===`isolated`;return A({title:l(`cron.detail.generalSection`)},y`
      ${J(e,`name`,{label:l(`cron.form.fieldName`),required:!0,errorKey:`name`,placeholder:l(`cron.form.namePlaceholder`)})}
      ${J(e,`agentId`,{label:l(`cron.form.agentId`),help:l(`cron.form.agentHelp`),list:`cron-agent-suggestions`,disabled:e.form.clearAgent,placeholder:l(`cron.form.agentPlaceholder`)})}
      ${X(e,`sessionTarget`,{label:l(`cron.form.runsIn`),help:l(`cron.form.sessionHelp`),options:[{value:`main`,label:l(`cron.form.mainSession`)},{value:`isolated`,label:l(`cron.form.isolatedSession`)},...n?[]:[{value:t,label:t}]]})}
    `)}function vr(e){if(e.scheduleKind===`every`){let t=e.everyAmount.trim();if(ot(t,e.everyUnit)===void 0)return null;if(Number(t)===1){let t=e.everyUnit===`seconds`?`cron.form.summaryEverySecondOne`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinuteOne`:e.everyUnit===`hours`?`cron.form.summaryEveryHourOne`:`cron.form.summaryEveryDayOne`;return l(t)}let n=e.everyUnit===`seconds`?`cron.form.summaryEverySeconds`:e.everyUnit===`minutes`?`cron.form.summaryEveryMinutes`:e.everyUnit===`hours`?`cron.form.summaryEveryHours`:`cron.form.summaryEveryDays`;return l(n,{amount:t})}if(e.scheduleKind===`at`){let t=Date.parse(e.scheduleAt);return Number.isFinite(t)?l(`cron.form.summaryOnce`,{at:oe(t)}):null}if(e.scheduleKind===`cron`){let t=e.cronExpr.trim();if(!t)return null;let n=e.cronTz.trim();return n?l(`cron.form.summaryCronTz`,{expr:t,tz:n}):l(`cron.form.summaryCron`,{expr:t})}return e.scheduleKind===`on-exit`?l(`cron.form.repeatOnExit`):e.scheduleKind===`stream`?l(`cron.form.repeatStream`):null}function yr(e){let t=e.form,n=t.scheduleKind===`on-exit`,r=t.scheduleKind===`stream`,i=n?{value:`on-exit`,label:l(`cron.form.repeatOnExit`)}:r?{value:`stream`,label:l(`cron.form.repeatStream`)}:null,a=[...i?[{...i,testId:`cron-schedule-kind-${i.value}`}]:[],{value:`every`,label:l(`cron.form.repeatInterval`),testId:`cron-schedule-kind-every`},{value:`at`,label:l(`cron.form.repeatOnce`),testId:`cron-schedule-kind-at`},{value:`cron`,label:l(`cron.form.cronOption`),testId:`cron-schedule-kind-cron`}],o=vr(t);return A({title:l(`cron.detail.scheduleSection`)},y`
      ${St({title:l(`cron.form.repeat`),description:n?l(`cron.form.onExitHelp`):void 0,stacked:!0,control:F({value:t.scheduleKind,options:a,ariaLabel:l(`cron.form.repeat`),onChange:n=>e.onFormChange({scheduleKind:n,...n===`at`&&(t.scheduleKind===`every`||t.scheduleKind===`cron`)?{deleteAfterRun:!0}:n===`every`||n===`cron`?{deleteAfterRun:!1}:{}})})})}
      ${t.scheduleKind===`at`?J(e,`scheduleAt`,{label:l(`cron.form.runAt`),required:!0,errorKey:`scheduleAt`,type:`datetime-local`}):x}
      ${t.scheduleKind===`every`?K({label:l(`cron.form.every`),controlId:`cron-every-amount`,required:!0,error:e.fieldErrors.everyAmount,errorId:W(`everyAmount`),control:y`
                <div class="cron-inline-controls">
                  ${q(e,`everyAmount`,{label:l(`cron.form.every`),required:!0,errorKey:`everyAmount`,placeholder:l(`cron.form.everyAmountPlaceholder`)})}
                  ${Y(e,`everyUnit`,{label:l(`cron.form.unit`),standalone:!0,options:[{value:`seconds`,label:l(`cron.form.seconds`)},{value:`minutes`,label:l(`cron.form.minutes`)},{value:`hours`,label:l(`cron.form.hours`)},{value:`days`,label:l(`cron.form.days`)}]})}
                </div>
              `}):x}
      ${t.scheduleKind===`cron`?y`
              ${J(e,`cronExpr`,{label:l(`cron.form.expression`),required:!0,errorKey:`cronExpr`,mono:!0,placeholder:l(`cron.form.expressionPlaceholder`)})}
              ${J(e,`cronTz`,{label:l(`cron.form.timezoneOptional`),help:l(`cron.form.timezoneHelp`),list:`cron-tz-suggestions`,placeholder:l(`cron.form.timezonePlaceholder`)})}
            `:x}
      ${o?y` <div class="cron-schedule-summary">${T(`clock`)}<span>${o}</span></div> `:x}
    `)}function br(e,t){let n=Un(e);return A({title:l(`cron.detail.deliverySection`)},y`
      ${X(e,`deliveryMode`,{label:l(`cron.form.deliveryModeLabel`),help:l(`cron.form.deliveryHelp`),value:t.selectedDeliveryMode,options:[...t.supportsAnnounce?[{value:`announce`,label:l(`cron.form.announceDefault`)}]:[],{value:`webhook`,label:l(`cron.form.webhookPost`)},{value:`none`,label:l(`cron.form.noneInternal`)}]})}
      ${t.selectedDeliveryMode===`announce`?y`
              ${X(e,`deliveryChannel`,{label:l(`cron.form.channel`),help:l(`cron.form.channelHelp`),value:e.form.deliveryChannel||`last`,options:n,channel:!0})}
              ${J(e,`deliveryTo`,{label:l(`cron.form.to`),help:l(`cron.form.toHelp`),list:`cron-delivery-to-suggestions`,placeholder:l(`cron.form.toPlaceholder`)})}
            `:x}
      ${t.selectedDeliveryMode===`webhook`?J(e,`deliveryTo`,{label:l(`cron.form.webhookUrl`),required:!0,help:l(`cron.form.webhookHelp`),errorKey:`deliveryTo`,list:`cron-delivery-to-suggestions`,placeholder:l(`cron.form.webhookPlaceholder`)}):x}
    `)}function xr(e,t){let n=e.form.scheduleKind===`cron`,r=Un(e);return y`
    <section class="settings-section">
      <details class="cron-advanced">
        <summary class="settings-section__heading cron-advanced__summary">
          ${l(`cron.form.advanced`)}
          ${e.form.triggerEnabled?y`<span class="cron-trigger-summary">
                  ${T(`gitBranch`)} ${l(`cron.form.triggerConfigured`)}
                </span>`:x}
        </summary>
        <p class="settings-section__desc">${l(`cron.form.advancedHelp`)}</p>
        <div class="settings-group">
          ${Sr(e)}
          ${J(e,`description`,{label:l(`cron.form.description`),placeholder:l(`cron.form.descriptionPlaceholder`)})}
          ${t.mode===`create`?Z(e,`enabled`,{label:l(`cron.form.startEnabled`)}):x}
          ${X(e,`wakeMode`,{label:l(`cron.form.wakeMode`),help:l(`cron.form.wakeModeHelp`),options:[{value:`now`,label:l(`cron.form.now`)},{value:`next-heartbeat`,label:l(`cron.form.nextHeartbeat`)}]})}
          ${t.isAgentTurn?J(e,`timeoutSeconds`,{label:l(`cron.form.timeoutSeconds`),help:l(`cron.form.timeoutHelp`),errorKey:`timeoutSeconds`,placeholder:l(`cron.form.timeoutPlaceholder`)}):x}
          ${e.form.scheduleKind===`at`||e.form.scheduleKind===`on-exit`?Z(e,`deleteAfterRun`,{label:l(`cron.form.deleteAfterRun`),help:l(`cron.form.deleteAfterRunHelp`)}):x}
          ${Z(e,`clearAgent`,{label:l(`cron.form.clearAgentOverride`),help:l(`cron.form.clearAgentHelp`)})}
          ${K({label:l(`cron.form.sessionKey`),controlId:`cron-session-key`,help:l(`cron.form.sessionKeyHelp`),control:y`
              <input
                id="cron-session-key"
                class="settings-input"
                .value=${e.form.sessionKey}
                placeholder="agent:main:main"
                @input=${t=>e.onFormChange({sessionKey:t.target.value})}
              />
            `})}
          ${n?y`
                  ${Z(e,`scheduleExact`,{label:l(`cron.form.exactTiming`),help:l(`cron.form.exactTimingHelp`)})}
                  ${K({label:l(`cron.form.staggerWindow`),controlId:`cron-stagger-amount`,error:e.fieldErrors.staggerAmount,errorId:W(`staggerAmount`),control:y`
                      <div class="cron-inline-controls">
                        ${q(e,`staggerAmount`,{label:l(`cron.form.staggerWindow`),disabled:e.form.scheduleExact,errorKey:`staggerAmount`,placeholder:l(`cron.form.staggerPlaceholder`)})}
                        ${Y(e,`staggerUnit`,{label:l(`cron.form.staggerUnit`),standalone:!0,disabled:e.form.scheduleExact,options:[{value:`seconds`,label:l(`cron.form.seconds`)},{value:`minutes`,label:l(`cron.form.minutes`)}]})}
                      </div>
                    `})}
                `:x}
          ${t.isAgentTurn?y`
                  ${K({label:l(`cron.form.accountId`),controlId:`cron-delivery-account-id`,help:l(`cron.form.accountIdHelp`),control:y`
                      <input
                        id="cron-delivery-account-id"
                        class="settings-input"
                        .value=${e.form.deliveryAccountId}
                        list="cron-delivery-account-suggestions"
                        ?disabled=${t.selectedDeliveryMode!==`announce`}
                        placeholder="default"
                        @input=${t=>e.onFormChange({deliveryAccountId:t.target.value})}
                      />
                    `})}
                  ${Z(e,`payloadLightContext`,{label:l(`cron.form.lightContext`),help:l(`cron.form.lightContextHelp`)})}
                  ${Cr(e,r)}
                `:x}
          ${t.selectedDeliveryMode===`none`?x:Z(e,`deliveryBestEffort`,{label:l(`cron.form.bestEffortDelivery`),help:l(`cron.form.bestEffortHelp`)})}
        </div>
      </details>
    </section>
  `}function Sr(e){let t=e.form.payloadKind===`script`;return!t&&e.status===null?x:e.status?.triggersEnabled!==!0||t?St({title:l(`cron.form.conditionTrigger`),description:t?l(`cron.errors.triggerScriptPayloadUnsupported`):e.form.triggerEnabled?l(`cron.form.triggerDisabledConfigured`):l(`cron.form.triggerDisabled`),control:e.form.triggerEnabled?y`<button
            type="button"
            class="btn btn--sm"
            @click=${()=>e.onFormChange({triggerEnabled:!1})}
          >
            ${l(`cron.form.clearTrigger`)}
          </button>`:x}):y`
    ${Z(e,`triggerEnabled`,{label:l(`cron.form.conditionTrigger`),help:l(`cron.form.conditionTriggerHelp`)})}
    ${e.form.triggerEnabled?y`
            ${K({label:l(`cron.form.triggerScript`),controlId:`cron-trigger-script`,required:!0,help:l(`cron.form.triggerScriptHelp`),error:e.fieldErrors.triggerScript,errorId:W(`triggerScript`),stacked:!0,wide:!0,control:y`<textarea
                id="cron-trigger-script"
                class="settings-input cron-trigger-script mono"
                rows="8"
                spellcheck="false"
                aria-invalid=${e.fieldErrors.triggerScript?`true`:`false`}
                aria-describedby=${b(e.fieldErrors.triggerScript?W(`triggerScript`):void 0)}
                .value=${e.form.triggerScript}
                @input=${t=>{let n=t.currentTarget;n instanceof HTMLTextAreaElement&&e.onFormChange({triggerScript:n.value})}}
              ></textarea>`})}
            ${Z(e,`triggerOnce`,{label:l(`cron.form.triggerOnce`),help:l(`cron.form.triggerOnceHelp`)})}
          `:x}
  `}function Cr(e,t){return y`
    ${X(e,`failureAlertMode`,{label:l(`cron.form.failureAlerts`),help:l(`cron.form.failureAlertsHelp`),options:[{value:`inherit`,label:l(`cron.form.failureAlertInherit`)},{value:`disabled`,label:l(`cron.form.failureAlertDisabled`)},{value:`custom`,label:l(`cron.form.failureAlertCustom`)}]})}
    ${e.form.failureAlertMode===`custom`?y`
            ${J(e,`failureAlertAfter`,{label:l(`cron.form.failureAlertAfter`),help:l(`cron.form.failureAlertAfterHelp`),errorKey:`failureAlertAfter`,placeholder:l(`cron.form.failureAlertInherit`)})}
            ${J(e,`failureAlertCooldownSeconds`,{label:l(`cron.form.failureAlertCooldown`),help:l(`cron.form.failureAlertCooldownHelp`),errorKey:`failureAlertCooldownSeconds`,placeholder:l(`cron.form.failureAlertInherit`)})}
            ${X(e,`failureAlertChannel`,{label:l(`cron.form.failureAlertChannel`),value:e.form.failureAlertChannel||`last`,options:t,channel:!0})}
            ${J(e,`failureAlertTo`,{label:l(`cron.form.failureAlertTo`),help:l(`cron.form.failureAlertToHelp`),list:`cron-delivery-to-suggestions`,placeholder:l(`cron.form.failureAlertToPlaceholder`)})}
            ${X(e,`failureAlertDeliveryMode`,{label:l(`cron.form.failureAlertMode`),options:[{value:``,label:l(`cron.form.failureAlertInherit`)},{value:`announce`,label:l(`cron.form.failureAlertAnnounce`)},{value:`webhook`,label:l(`cron.form.failureAlertWebhook`)}]})}
            ${J(e,`failureAlertAccountId`,{label:l(`cron.form.failureAlertAccountId`),placeholder:l(`cron.form.failureAlertAccountPlaceholder`)})}
          `:x}
  `}var wr,Tr,Er;function Dr(){return(Dr=e((()=>{r(),S(),pe(),ye(),be(),Pe(),Zt(),qt(),tn(),w(),xt(),$t(),bt(),Ct(),we(),wt(),j(),m(),N(),it(),f(),ie(),rn(),xn(),En(),kn(),Hn(),M(),wr={name:`cron.form.fieldName`,scheduleAt:`cron.form.runAt`,everyAmount:`cron.form.every`,cronExpr:`cron.form.expression`,staggerAmount:`cron.form.staggerWindow`,triggerScript:`cron.form.triggerScript`,payloadText:`cron.form.assistantTaskPrompt`,payloadModel:`cron.form.model`,payloadThinking:`cron.form.thinking`,timeoutSeconds:`cron.form.timeoutSeconds`,deliveryTo:`cron.form.to`,failureAlertAfter:`cron.form.failureAlertAfter`,failureAlertCooldownSeconds:`cron.form.failureAlertCooldown`},Tr=[{value:`all`,labelKey:`cron.tabs.all`},{value:`enabled`,labelKey:`cron.tabs.active`},{value:`disabled`,labelKey:`cron.tabs.paused`}],Er={script:`javascript`,command:`bash`,heartbeat:``,systemEvent:``,agentTurn:``}})))()}var $,Or;function kr(){return(kr=e((()=>{i(),S(),_e(),Oe(),ke(),Ee(),De(),on(),Pt(),j(),Yt(),m(),N(),ee(),Xe(),pt(),f(),Fe(),se(),st(),p(),ae(),cn(),hn(),P(),bn(),Dr(),M(),$=class extends d{constructor(){super(),this.routeSearch=``,this.cron=yt(),this.agentsList=null,this.cronModelSuggestions=[],this.modelSuggestionsError=null,this.listTab=`tasks`,this.detailTab=`settings`,this.heartbeatScratch=``,this.runTranscript=new yn(this,()=>{let e=this.gateway.capture(),t=this.cron;return e?{client:e.client,epoch:this.gateway.epoch,isCurrent:()=>this.gateway.isCurrent(e)&&this.cron===t}:null}),this.pendingRouteData=null,this.routeJobRequested=!1,this.highlightedRunId=null,this.pendingRunScroll=!1,this.modelSuggestionsRequest=null,this.heartbeatScratchRequest=0,this.pageHidden=document.visibilityState===`hidden`,this.gateway=new ct(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial?this.resetGatewayState(e.snapshot):Me(e.snapshot).canAdmin||this.clearHeartbeatScratch()},ensureInitialData:()=>this.ensureInitialData(),onPageActivation:()=>{let e=document.visibilityState===`hidden`,t=this.pageHidden&&!e;this.pageHidden=e,t&&this.ensureInitialData(!0)}}),this.observeAgentScope=Ze(e=>{this.pendingRouteData=null,this.resetGatewayState(this.context.gateway.snapshot),this.cron.cronAgentId=e,this.listTab=`tasks`,this.detailTab=`settings`,this.ensureInitialData(),this.requestUpdate()}),this.subscriptions=new ce(this).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncAgentsState()).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{this.gateway.gateway===e&&this.context.gateway===e&&this.gateway.connected&&this.gateway.client&&(t.event===`task`&&this.runTranscript.observe(t.payload),t.event===`cron`?this.refreshCron({tableFilters:!0,coalesce:!0}):(t.event===`config.changed`||t.event===`chat.metadata.changed`)&&this.loadModelSuggestions(this.cron))})),this.lastPanelKey=null,new sn(this)}get canManageCron(){return Me(this.context.gateway.snapshot).canAdmin}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}resetGatewayState(e){this.runTranscript.close(),this.clearHeartbeatScratch(),ze(this.cron);let t=e?.phase===`connected`,n=yt({client:e?.client??null,connected:t});n.canRefresh=()=>this.canRefreshCron(n),this.cron=n,n.cronSessionFilter=gn(this.routeSearch).session,this.routeJobRequested=!1,this.pageHidden=document.visibilityState===`hidden`,this.cron.cronAgentId=this.context.agentSelection.state.scopeId,this.agentsList=t?this.context.agents.state.agentsList:null,this.cronModelSuggestions=[],this.modelSuggestionsError=null,this.modelSuggestionsRequest=null}syncAgentsState(){this.agentsList=this.context.agents.state.agentsList}canRefreshCron(e=this.cron){return this.isConnected&&this.cron===e&&document.visibilityState!==`hidden`}ensureInitialData(e=!1){this.canRefreshCron()&&this.cron.connected&&this.cron.client&&(!this.agentsList&&!this.context.agents.state.agentsLoading&&this.context.agents.ensureList(),e||!this.cron.cronStatus&&!this.cron.cronLoading?this.refreshCron({tableFilters:!0,coalesce:!0}):!this.cron.cronRuns.length&&!this.cron.cronRunsLoadingMore&&this.loadRuns(),this.modelSuggestionsRequest?.state!==this.cron&&this.loadModelSuggestions(this.cron))}requestCronUpdate(e=this.cron){this.cron===e&&this.requestUpdate()}willUpdate(e){if(e.has(`routeSearch`)){this.runTranscript.close(),this.cron.cronError=null;let e=gn(this.routeSearch);JSON.stringify(this.cron.cronSessionFilter)!==JSON.stringify(e.session)&&(this.resetGatewayState(this.context.gateway.snapshot),this.ensureInitialData()),this.listTab=`tasks`,this.detailTab=`settings`,this.pendingRouteData=e.jobId||e.session?e:null,this.routeJobRequested=!1,this.highlightedRunId=null,this.pendingRunScroll=!1}}updated(){let e=this.cron.cronEditingJob?.id??null,t=`${e?`job`:this.cron.cronCreateOpen?`create`:`overview`}:${e??``}`;if(t!==this.lastPanelKey){this.lastPanelKey=t,this.detailTab=e&&this.highlightedRunId?`history`:`settings`;let n=this.closest(`.content`);n instanceof HTMLElement&&typeof n.scrollTo==`function`&&n.scrollTo({top:0})}let n=this.pendingRouteData,r=this.cron.client;if(n?.session&&this.cron.cronJobsSnapshotRevision&&!this.cron.cronLoading){this.pendingRouteData=null;let[e]=this.cron.cronJobs;this.cron.cronJobsTotal===1&&e&&this.selectJob(e)}if(n?.jobId&&r&&this.cron.connected&&!this.routeJobRequested&&(this.routeJobRequested=!0,this.runCronTask(async e=>{let t=()=>this.isConnected&&this.cron===e&&this.pendingRouteData===n;try{let e=await r.request(`cron.get`,{id:n.jobId});t()&&this.selectJob(e,n.runId)}catch(n){t()&&(this.pendingRouteData=null,e.cronError=h(n))}})),this.pendingRunScroll){let e=this.querySelector(`.cron-run-entry--highlighted`);e&&(e.scrollIntoView?.({block:`nearest`}),this.pendingRunScroll=!1)}}async refreshCron(e){let t=this.cron;this.canRefreshCron(t)&&t.connected&&t.client&&(this.loadRuns(e.coalesce),this.context.channels.refresh(!1),await Promise.all([this.runCronTask(t=>Ye(t,e)),this.runCronTask(t=>O(t,{tableFilters:e.tableFilters}))]))}loadRuns(e=!1){return this.runCronTask(t=>k(t,{coalesce:e}))}async loadModelSuggestions(e){let t=e.client,n=this.context.agentSelection.state.selectedId;if(!t||!e.connected||!n)return;let r={state:e,agentId:n};this.modelSuggestionsRequest=r;let i=()=>this.cron===e&&this.modelSuggestionsRequest===r&&this.context.agentSelection.state.selectedId===n;try{let e=await at(t,{agentId:n});i()&&(this.cronModelSuggestions=e.models.filter(e=>e.manualSelectionAllowed!==!1).map(e=>e.id),this.modelSuggestionsError=_t(e))}catch(e){i()&&(this.modelSuggestionsError=h(e))}}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.requestCronUpdate(t),await n}finally{this.requestCronUpdate(t)}}runCronAdminTask(e){this.canManageCron&&this.runCronTask(e)}patchForm(e){this.canManageCron&&(this.cron.cronForm=Qe({...this.cron.cronForm,...e},e),this.cron.cronFieldErrors=qe(this.cron.cronForm),this.requestCronUpdate())}selectJob(e,t=null){this.clearHeartbeatScratch(),this.pendingRouteData=null,this.highlightedRunId=t,this.pendingRunScroll=!!t,t&&(this.detailTab=`history`),this.cron.cronCreateOpen=!1,et(this.cron,e),this.requestCronUpdate(),e.payload?.kind===`heartbeat`&&this.loadHeartbeatScratch(this.cron,e.id,this.heartbeatScratchRequest),this.runCronTask(async t=>{D(t,{cronRunsScope:`job`}),t.cronRunsJobId=e.id,await k(t)})}clearHeartbeatScratch(){this.heartbeatScratchRequest+=1,this.heartbeatScratch=``}async loadHeartbeatScratch(e,t,n){let r=e.client;if(!this.canManageCron||!r||!e.connected)return;let i=this.gateway.capture();if(!i)return;let a=()=>this.cron===e&&this.heartbeatScratchRequest===n&&this.gateway.isCurrent(i)&&this.canManageCron&&e.cronEditingJob?.id===t&&e.cronForm.payloadKind===`heartbeat`;try{let e=await r.request(`cron.scratch.get`,{id:t});a()&&(this.heartbeatScratch=e.scratch?.content??``)}catch(t){a()&&(e.cronError=h(t),this.requestCronUpdate(e))}}openCreate(e){if(this.canManageCron){if(this.clearHeartbeatScratch(),this.pendingRouteData=null,Je(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!0,e){this.patchForm(e);return}this.requestCronUpdate()}}cloneJob(e){this.canManageCron&&(this.clearHeartbeatScratch(),this.pendingRouteData=null,Ve(this.cron,e),this.cron.cronCreateOpen=!0,this.requestCronUpdate())}async removeJob(e){let t=this.context,n=this.cron,r=this.gateway.capture(),i=this.canManageCron,a=n.cronEditingJob?.id===e.id?n.cronEditingJob:n.cronJobs.find(t=>t.id===e.id&&t.updatedAtMs===e.updatedAtMs);if(!r||!i||!a)return;let o=a.id,s=a.updatedAtMs,c=a.name,u=await zt({title:l(`cron.actions.removeConfirmTitle`,{name:c}),message:l(`cron.actions.removeConfirmMessage`),confirmLabel:l(`cron.actions.remove`),danger:!0}),d=n.cronEditingJob?.id===o?n.cronEditingJob:n.cronJobs.find(e=>e.id===o);u&&this.context===t&&this.cron===n&&this.gateway.isCurrent(r)&&this.canManageCron&&d&&d.updatedAtMs===s&&await this.runCronTask(async e=>{await Re(e,d),e.cronRunsScope===`job`&&e.cronRunsJobId===null&&(D(e,{cronRunsScope:`all`}),await k(e))})}closePanel(){this.clearHeartbeatScratch(),this.pendingRouteData=null,Je(this.cron,this.context.agentSelection.state.selectedId),this.cron.cronCreateOpen=!1,this.requestCronUpdate(),this.runCronTask(async e=>{D(e,{cronRunsScope:`all`}),e.cronRunsJobId=null,await k(e)})}submitForm(e={}){this.runCronAdminTask(async t=>{let n=!!t.cronEditingJob,r=await Ge(t);r.saved&&(n||t.cronEditingJob||(e.runNow&&r.jobId&&await ht(t,r.jobId,`force`),t.cronCreateOpen=!1,t.cronRunsScope===`job`&&(D(t,{cronRunsScope:`all`}),t.cronRunsJobId=null,await k(t))))})}render(){let e=this.context.channels.state,t=ue(this.context),n=pn({channels:e,runtimeConfig:this.context.runtimeConfig.state,cron:this.cron,agentsList:this.agentsList,modelSuggestions:this.cronModelSuggestions}),r=this.canManageCron;return y`
      ${kt({title:je(`cron`),subtitle:this.cron.cronSessionFilter?l(`cron.list.sessionFilter`):Ae(`cron`),actions:this.cron.cronSessionFilter?y`<a
              class="btn"
              href=${Te(`cron`,this.context.basePath)}
              @click=${e=>{fe(e)&&(e.preventDefault(),this.context.navigate(`cron`,{search:``}))}}
              >${l(`cron.list.showAll`)}</a
            >`:an({agents:this.agentsList?.agents??[],selection:this.context.agentSelection})})}
      ${this.runTranscript.render()}
      ${Jt(Yn({basePath:this.context.basePath,agentId:t,loading:this.cron.cronLoading,hasLoaded:this.cron.cronJobsSnapshotRevision!==null,listError:this.cron.cronJobsError,canManage:r,status:this.cron.cronStatus,jobs:this.cron.cronJobs,jobsLoadingMore:this.cron.cronJobsLoadingMore,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsQuery:this.cron.cronJobsQuery,jobsEnabledFilter:this.cron.cronJobsEnabledFilter,jobsScheduleKindFilter:this.cron.cronJobsScheduleKindFilter,jobsLastStatusFilter:this.cron.cronJobsLastStatusFilter,jobsTriggerFilter:this.cron.cronJobsTriggerFilter,jobsSortBy:this.cron.cronJobsSortBy,jobsSortDir:this.cron.cronJobsSortDir,editingJob:this.cron.cronEditingJob,createOpen:this.cron.cronCreateOpen,listTab:this.listTab,detailTab:this.detailTab,error:this.cron.cronError??this.cron.cronRunsError??this.modelSuggestionsError,busy:this.cron.cronBusy,form:this.cron.cronForm,heartbeatScratch:r?this.heartbeatScratch:``,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(e=>e.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runs:this.cron.cronRuns,runsState:gt(this.cron),highlightedRunId:this.highlightedRunId,runsTotal:this.cron.cronRunsTotal,runsHasMore:this.cron.cronRunsHasMore,runsLoadingMore:this.cron.cronRunsLoadingMore,runsStatuses:this.cron.cronRunsStatuses,runsDeliveryStatuses:this.cron.cronRunsDeliveryStatuses,runsQuery:this.cron.cronRunsQuery,runsSortDir:this.cron.cronRunsSortDir,fieldErrors:this.cron.cronFieldErrors,canSubmit:!Ie(this.cron.cronFieldErrors),agentSuggestions:n.agentSuggestions,modelSuggestions:n.modelSuggestions,thinkingSuggestions:mn,timezoneSuggestions:n.timezoneSuggestions,deliveryToSuggestions:n.deliveryToSuggestions,accountSuggestions:n.accountTargets,onListTabChange:e=>{this.listTab=e},onDetailTabChange:e=>{this.detailTab=e},onFormChange:e=>this.patchForm(e),onRefresh:()=>void this.refreshCron({tableFilters:!0}),onSubmit:()=>this.submitForm(),onSubmitRunNow:()=>this.submitForm({runNow:!0}),onSelectJob:e=>this.selectJob(e),onOpenCreate:e=>this.openCreate(e),onClosePanel:()=>this.closePanel(),onClone:e=>this.cloneJob(e),onToggle:(e,t)=>this.runCronAdminTask(n=>$e(n,e,t)),onRun:(e,t)=>this.runCronAdminTask(n=>ht(n,e.id,t??`force`)),onRemove:e=>void this.removeJob(e),onLoadMoreJobs:()=>void this.runCronTask(e=>O(e,{append:!0,tableFilters:!0})),onJobsFiltersChange:e=>void this.runCronTask(async t=>{nt(t,e),await O(t,{append:!1,tableFilters:!0})}),onJobsFiltersReset:()=>void this.runCronTask(async e=>{nt(e,{cronJobsScheduleKindFilter:`all`,cronJobsLastStatusFilter:`all`,cronJobsTriggerFilter:`all`,cronJobsSortBy:`nextRunAtMs`,cronJobsSortDir:`asc`}),await O(e,{append:!1,tableFilters:!0})}),onLoadMoreRuns:()=>void this.runCronTask(e=>lt(e)),onRunsFiltersChange:e=>void this.runCronTask(async t=>{D(t,e),await k(t)}),onViewRunTranscript:e=>void this.runTranscript.open(e)}))}
    `}},c([s({context:Se,subscribe:!0})],$.prototype,`context`,void 0),c([xe({attribute:!1})],$.prototype,`routeSearch`,void 0),c([C()],$.prototype,`cron`,void 0),c([C()],$.prototype,`agentsList`,void 0),c([C()],$.prototype,`cronModelSuggestions`,void 0),c([C()],$.prototype,`modelSuggestionsError`,void 0),c([C()],$.prototype,`listTab`,void 0),c([C()],$.prototype,`detailTab`,void 0),c([C()],$.prototype,`heartbeatScratch`,void 0),Or={header:!0,render:e=>y`<testclaw-cron-page
    .routeSearch=${typeof e==`string`?e:``}
  ></testclaw-cron-page>`},customElements.get(`testclaw-cron-page`)||customElements.define(`testclaw-cron-page`,$)})))()}kr();export{Or as cronPageComponent};
//# sourceMappingURL=cron-page-DfRD4Eod.js.map