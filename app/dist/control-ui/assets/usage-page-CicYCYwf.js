import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,Kr as n,Mr as r,Oa as i,cr as a,fa as o,oo as s,qr as c,ti as l,wr as u,yr as d}from"./control-ui-foundation-CGMdhB5v.js";import{$l as f,Bl as p,Hl as m,Jl as h,Kr as g,Nr as _,Si as v,Ur as y,Wr as b,_n as x,ac as S,au as C,dn as w,ic as T,in as ee,iu as E,jn as D,kn as O,mn as k,rn as A,xi as j}from"./control-ui-core-S9jKXqB5.js";import{$ as M,B as N,H as P,X as F,Y as I,b as L,ct as R,nt as z,tt as B,ut as te,x as ne}from"./lit-runtime-DWoPVI38.js";import{Di as V,Ni as H,Oi as U,Qa as re,do as ie,fo as ae}from"./control-ui-core-G2U4O6rB.js";import{Cn as W,Jo as G,Qo as oe,Vl as se,da as ce,go as le,ho as ue,la as de}from"./control-ui-boot-shared-ooxiG3qa.js";import{Br as fe,Hi as pe,Ia as me,Ot as he,Tt as ge,Vr as _e,Wi as ve,ci as ye,di as be,fi as xe,ht as Se,kt as Ce,li as we,si as Te,ui as Ee,wt as De}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as Oe,t as ke}from"./settings-workspace-DJAhLnkQ.js";import{n as Ae,t as je}from"./agent-row-chip-LzqZKgRH.js";import{n as Me,t as Ne}from"./agent-scope-control-DE_nXHBu.js";import{i as Pe,n as Fe,r as Ie}from"./usage-B43qXpLn.js";import{a as Le,i as Re,n as ze,o as Be,r as Ve,s as He}from"./usage-DvG1St5a.js";import{a as Ue,c as We,d as Ge,f as Ke,i as qe,l as Je,n as Ye,o as Xe,r as Ze,s as Qe,t as $e,u as et}from"./request-usage-snapshot-DH-Uio31.js";function tt(e,t){return[e,t].some(e=>e&&e.status!==`fresh`)}function nt(e,t,n){let r=g(t),i=Ee(r?we():e,t,n);return{clearData:r,status:r&&i.error?{...i,error:y(`usage details`)}:i}}function rt(){return(rt=e((()=>{be(),b()})))()}function it(e,t){let n=null,r=(t,r)=>{if(n===t){n=null;try{r()}catch{}finally{e.requestUpdate()}}};return{get pending(){return n!==null},cancel:()=>{let t=n;n=null,t?.abort(),e.requestUpdate()},async run(i){let a=n,o=new AbortController;n=o,a?.abort(),e.requestUpdate();let s;try{s=await t.task(i,{signal:o.signal})}catch(e){r(o,()=>t.onError(e));return}r(o,()=>t.onComplete(s))}}}function at(e,t){return e?.key===t.key&&e.agentId===t.agentId&&e.sessionId===t.sessionId}function ot(e,t,n,r,a,o){let s=null,c=we(),l=null,u=0,d=it(e,{task:async([e,t],{signal:r})=>({target:t,data:await n(e,{key:t.key,...!i(t.key.trim())&&t.agentId?{agentId:t.agentId}:{}},r,t.sessionId)}),onComplete:e=>{l=null,s=e,c=ye()},onError:e=>{l=null;let n=nt(c,e,t.snapshot);n.clearData&&s&&delete s.data,c=n.status}}),f=()=>{l&&t.snapshot&&!D(t.snapshot)&&(c=Ee(c,void 0,t.snapshot)),l=null,u+=1,d.cancel()},p=e=>{s=e?{target:e}:null,c=we(),o?.()};return{get data(){return s?.data??null},get status(){return c},get loading(){return l!==null},async recover(e,n=!1){let i=u,a=r(e);await l,i===u&&at(a,r(e))&&t.snapshot&&D(t.snapshot)&&(c.awaitingGateway||c.error!==null||n&&!c.hasLoaded)&&this.load(e)},load(e,n=!0){let i=t.client;if(!i||!t.connected)return Promise.resolve();let o=!!e&&a?.(e)!==!1,m=r(e),h=at(s?.target,m);return(!h||!o)&&p(o?m:void 0),o?!n&&h?l??Promise.resolve():(c=Te(c),u+=1,l=d.run([i,m])):(f(),Promise.resolve())},cancel:f,clear(){p(),f()}}}var st;function ct(){return(ct=e((()=>{o(),be(),h(),O(),rt(),st=class{constructor(e,t,n,r,i){let a=e=>{let t=r().find(t=>t.key===e),i=t?.agentId??n().agentId;return{key:e,...i?{agentId:i}:{},sessionId:t?.sessionId}};this.timeSeries=ot(e,t,Pe,a,void 0,i),this.sessionLogs=ot(e,t,async(e,t)=>{let n=await Ie(e,t);return Array.isArray(n.logs)?n.logs:null},a),this.contextWeight=ot(e,t,async(e,t,r,i)=>{let a=(await Fe(e,{...n(),agentId:t.agentId},{key:t.key,includeContextWeight:!0,signal:r})).sessions[0];if(i!==void 0&&a?.sessionId!==void 0&&a.sessionId!==i)throw Error(f(`usage.details.contextOutOfDate`));return a?.contextWeight},a,e=>r().some(t=>t.key===e&&t.hasContextWeight))}load(e,t=!0){this.timeSeries.load(e,t),this.sessionLogs.load(e,t),this.contextWeight.load(e)}cancel(){this.timeSeries.cancel(),this.sessionLogs.cancel(),this.contextWeight.cancel()}clear(){this.timeSeries.clear(),this.sessionLogs.clear(),this.contextWeight.clear()}}})))()}var lt,ut;function dt(){return(dt=e((()=>{C(),lt={usage:{presets:{today:`Today`,last7d:`7d`,last30d:`30d`,last90d:`90d`,last1y:`1y`,all:`All`},scope:{instance:`Current instance`,instanceHint:`Show only the active session id for each logical session.`,family:`Historical lineage`,familyHint:`Roll up known rotated transcript-backed session ids.`,familyIncluded:`Historical lineage includes {count} session instances.`},filters:{rangeTitle:`Reporting range`,rangeHint:`Choose the dates to include in every chart and total.`,title:`Filters`,to:`to`,startDate:`Start date`,endDate:`End date`,timeZone:`Time zone`,timeZoneLocal:`Local`,timeZoneUtc:`UTC`,pin:`Pin`,pinned:`Pinned`,selectAll:`Select All`,clear:`Clear`,clearAll:`Clear All`,remove:`Remove filter`,removeDays:`Remove days filter`,removeHours:`Remove hours filter`,removeSession:`Remove session filter`,all:`All`,days:`Days`,hours:`Hours`,session:`Session`,agent:`Agent`,channel:`Channel`,provider:`Provider`,model:`Model`,tool:`Tool`,daysCount:`{count} days`,hoursCount:`{count} hours`,sessionsCount:`{count} sessions`},query:{placeholder:`Filter sessions (e.g. key:agent:main:cron* model:gpt-4o has:errors minTokens:2000)`,apply:`Filter (client-side)`,matching:`{shown} of {total} sessions match`,inRange:`{total} sessions in range`,tip:`Tip: use filters or click bars to refine days.`},export:{label:`Export`,changed:`Session context changed while preparing the export. Refresh usage and try again.`,sessionsCsv:`Sessions CSV`,dailyCsv:`Daily CSV`,json:`JSON`},cacheStatus:{warning:`Usage data may be incomplete. Checking for updated totals automatically.`,paused:`Usage data may be incomplete. Automatic checks paused; select Refresh to check again.`},creators:{title:`Started by`,description:`Usage grouped by who started each session. This is session attribution, not per-turn billing.`,all:`All identities`,select:`Filter by session creator`,selected:`Selected identity`,identity:`Identity`,unattributed:`Unattributed`,system:`System`,empty:`No usage for these dates and filters.`,more:`Show {count} more identities`},empty:{title:`No usage in this date range`,subtitle:`Try a wider date range or another identity to explore more history.`,hint:`Choose a wider date range or another identity.`,noData:`No data`},daily:{title:`Daily Usage`,total:`Total`,byType:`By Type`,tokensTitle:`Daily Token Usage`,costTitle:`Daily Cost`,compressedScaleHint:`Square-root scale keeps low-usage days visible.`},costWindows:{title:`Cost Windows`,subtitle:`Calendar windows ending {date}`,selectedRange:`Selected Range`,lastDays:`Last {count} days`,perDay:`/ day`},overview:{messages:`Messages`,messagesHint:`Total user and assistant messages in range.`,messagesAbbrev:`msgs`,user:`user`,assistant:`assistant`,toolCalls:`Tool Calls`,toolCallsHint:`Total tool call count across sessions.`,toolsUsed:`tools used`,errors:`Errors`,errorsHint:`Total message and tool errors in range.`,toolResults:`tool results`,avgTokens:`Avg Tokens / Msg`,avgTokensHint:`Average tokens per message in this range.`,avgCost:`Avg Cost / Msg`,avgCostHint:`Average cost per message when providers report costs.`,avgCostHintMissing:`Average cost per message when providers report costs. Cost data is missing for some or all sessions in this range.`,acrossMessages:`Across {count} messages`,sessions:`Sessions`,sessionsHint:`Distinct sessions in the range.`,sessionsInRange:`of {count} in range`,throughput:`Throughput`,throughputHint:`Throughput shows tokens per minute over active time. Higher is better.`,tokensPerMinute:`tok/min`,perMinute:`/ min`,errorRate:`Error Rate`,errorHint:`Error rate = errors / total messages. Lower is better.`,avgSession:`avg session`,cacheHitRate:`Cache Hit Rate`,cacheHint:`Cache hit rate = cache read / (input + cache read + cache write). Higher is better.`,cached:`cached`,prompt:`prompt`,calls:`calls`,costShare:`{percent}% of cost`,topModels:`Top Models`,topProviders:`Top Providers`,topTools:`Top Tools`,topAgents:`Top Agents`,topChannels:`Top Channels`,peakErrorDays:`Peak Error Days`,peakErrorHours:`Peak Error Hours`,noModelData:`No model data`,noProviderData:`No provider data`,noToolCalls:`No tool calls`,noAgentData:`No agent data`,noChannelData:`No channel data`,noErrorData:`No error data`},sessions:{title:`Sessions`,shown:`{count} shown`,total:`{count} total`,avg:`avg`,all:`All`,recent:`Recently viewed`,recentShort:`Recent`,sort:`Sort`,ascending:`Ascending`,descending:`Descending`,clearSelection:`Clear Selection`,noRecent:`No recent sessions`,noneInRange:`No sessions in range`,more:`+{count} more`,selected:`Selected ({count})`,copy:`Copy`,limitReached:`Showing first 1,000 sessions. Narrow date range for complete results.`},mosaic:{title:`Activity by Time`,subtitleEmpty:`Estimates require session timestamps.`,subtitle:`Estimated from session spans (first/last activity). Time zone: {zone}.`,noTimelineData:`No timeline data yet.`,dayOfWeek:`Day of Week`,midnight:`Midnight`,fourAm:`4am`,eightAm:`8am`,noon:`Noon`,fourPm:`4pm`,eightPm:`8pm`,legend:`Low → High token density`,sun:`Sun`,mon:`Mon`,tue:`Tue`,wed:`Wed`,thu:`Thu`,fri:`Fri`,sat:`Sat`}}},ut=Object.assign(()=>{let{overview:e,...t}=lt.usage;Object.assign(E.usage,t),Object.assign(E.usage.overview,e)},{catalog:lt})})))()}function ft({agentId:e,key:t,sessionId:n}){return JSON.stringify([e,t,n])}function pt(e,t,n){return it(e,{task:async(e,{signal:r})=>{let i=t.capture();if(!i)throw Error(f(`common.offline`));let a=`testclaw-usage-${Ue()}.json`,o=new Map;if(e.sessions.some(e=>e.hasContextWeight)){let t=await Fe(i.client,n(),{includeContextWeight:!0,signal:r});if(o=new Map(t.sessions.map(e=>[ft(e),e.contextWeight])),e.sessions.some(e=>e.hasContextWeight&&!o.get(ft(e))))throw Error(f(`usage.export.changed`))}return{connection:i,filename:a,data:{...e,sessions:e.sessions.map(e=>({...e,contextWeight:o.get(ft(e))??null}))}}},onComplete:({connection:e,filename:n,data:r})=>{t.isCurrent(e)&&W(n,JSON.stringify(r,null,2),`application/json;charset=utf-8`)},onError:e=>{v({message:`${f(`usage.export.label`)}: ${Ge(e)}`})}})}function mt(){return(mt=e((()=>{h(),dt(),j(),We(),ut()})))()}function ht(e,t,n){let r=t?.sessions.map(e=>e.agentId).filter(e=>!!e?.trim())??[];return M`
    ${ge({title:ae(`usage`),subtitle:ie(`usage`),actions:Me({agents:e.agents.state.agentsList?.agents??[],additionalAgentIds:r,selection:e.agentSelection})})}
    ${Oe(n)}
  `}function gt(e){return M`
    <span class="settings-status settings-status--accent">
      <span class="usage-loading-spinner" aria-hidden="true"></span>
      ${e}
    </span>
  `}function _t(e){return M`
    <section class="settings-group usage-panel usage-empty-state">
      <div class="usage-empty-state__title">${f(`usage.empty.title`)}</div>
      <div class="card-sub usage-empty-state__subtitle">${f(`usage.empty.subtitle`)}</div>
      <div class="usage-empty-state__actions">
        <button class="btn primary" @click=${e}>${f(`common.refresh`)}</button>
      </div>
    </section>
  `}function vt(e,t,n){return xe({status:e,errorMessage:e.error?f(`usage.details.loadFailed`,{detail:s(f(t)),error:e.error}):void 0,className:`usage-callout usage-detail-error--${n}`})}function yt(){return(yt=e((()=>{I(),re(),Ne(),be(),Se(),ke(),h()})))()}var bt;function xt(){return(xt=e((()=>{bt=[`channel`,`agent`,`provider`,`model`,`messages`,`tools`,`errors`,`duration`]})))()}function St(){return{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,totalCost:0,inputCost:0,outputCost:0,cacheReadCost:0,cacheWriteCost:0,missingCostEntries:0}}function Ct(e,t){if(e.input+=t.input,e.output+=t.output,e.cacheRead+=t.cacheRead,e.cacheWrite+=t.cacheWrite,e.totalTokens+=t.totalTokens,e.totalCost+=t.totalCost,e.inputCost+=t.inputCost,e.outputCost+=t.outputCost,e.cacheReadCost+=t.cacheReadCost,e.cacheWriteCost+=t.cacheWriteCost,e.missingCostEntries+=t.missingCostEntries,t.missingCostByModel){e.missingCostByModel??={};for(let[n,r]of Object.entries(t.missingCostByModel))e.missingCostByModel[n]=(e.missingCostByModel[n]??0)+r}}function wt(e,t){return JSON.stringify([e??`unknown`,t??`unknown`])}function Tt(e,t,n){return JSON.stringify([e,t??`unknown`,n??`unknown`])}function Et(){return{count:0,sum:0,min:1/0,max:0,p95Max:0}}function Dt(e,t){e.count+=t.count,e.sum+=t.avgMs*t.count,e.min=Math.min(e.min,t.minMs),e.max=Math.max(e.max,t.maxMs),e.p95Max=Math.max(e.p95Max,t.p95Ms)}function Ot(e){return{count:e.count,avgMs:e.count?e.sum/e.count:0,minMs:e.min===1/0?0:e.min,maxMs:e.max,p95Ms:e.p95Max}}function kt(e,t,n,r){let i=e.get(t)??{provider:n.provider,model:r,count:0,totals:St()};i.count+=n.count,Ct(i.totals,n.totals),e.set(t,i)}function At(e,t,n){if(!t)return;let r=e.get(t)??St();Ct(r,n),e.set(t,r)}function jt(e,t){return t.totals.totalCost-e.totals.totalCost||t.totals.totalTokens-e.totals.totalTokens}function Mt(){let e=St(),t={total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},n=new Map,r=new Map,i=new Map,a=new Map,o=new Map,s=new Map,c=new Map,l=new Map,u=new Map,d=new Map,f=Et(),p=0,m=0;function h(e){let t=c.get(e);return t||(t={date:e,tokens:0,cost:0,messages:0,toolCalls:0,errors:0},c.set(e,t)),t}function g({usage:c,agentId:g,channel:_,createdActor:v,creatorKey:y=Nt}){if(!c)return;Ct(e,c),m=Math.max(m,c.durationMs??0);let b=c.firstActivity!==void 0||(c.messageCounts?.total??0)>0;b&&(p+=1),c.messageCounts&&(t.total+=c.messageCounts.total,t.user+=c.messageCounts.user,t.assistant+=c.messageCounts.assistant,t.toolCalls+=c.messageCounts.toolCalls,t.toolResults+=c.messageCounts.toolResults,t.errors+=c.messageCounts.errors);for(let e of c.toolUsage?.tools??[])n.set(e.name,(n.get(e.name)??0)+e.count);for(let e of c.modelUsage??[])kt(r,wt(e.provider,e.model),e,e.model),kt(i,e.provider??`unknown`,e,void 0);At(a,g,c),At(o,_,c);let x=s.get(y)??{key:y,...v?{actor:v}:{},totals:St(),sessionCount:0,daily:new Map,sessionActivity:new Map};if(Ct(x.totals,c),b){x.sessionCount+=1;let e=[...new Set([...c.activityDates??[],...c.dailyBreakdown?.map(({date:e})=>e)??[],...c.dailyMessageCounts?.map(({date:e})=>e)??[]])].toSorted(),t=JSON.stringify(e),n=x.sessionActivity.get(t)??{dates:e,sessionCount:0};n.sessionCount+=1,x.sessionActivity.set(t,n)}s.set(y,x),c.latency&&c.latency.count>0&&Dt(f,c.latency);for(let e of c.dailyLatency??[]){let t=u.get(e.date)??Et();Dt(t,e),u.set(e.date,t)}for(let e of c.dailyBreakdown??[]){let t=h(e.date);t.tokens+=e.tokens,t.cost+=e.cost,At(l,e.date,e),At(x.daily,e.date,e)}for(let e of c.dailyMessageCounts??[]){let t=h(e.date);t.messages+=e.total,t.toolCalls+=e.toolCalls,t.errors+=e.errors}for(let e of c.dailyModelUsage??[]){let t=Tt(e.date,e.provider,e.model),n=d.get(t)??{date:e.date,provider:e.provider,model:e.model,tokens:0,cost:0,count:0};n.tokens+=e.tokens,n.cost+=e.cost,n.count+=e.count,d.set(t,n)}}function _(){let e=Array.from(n,([e,t])=>({name:e,count:t})).toSorted((e,t)=>t.count-e.count);return{sessionCount:p,...m>0?{longestSessionDurationMs:m}:{},messages:t,tools:{totalCalls:e.reduce((e,{count:t})=>e+t,0),uniqueTools:n.size,tools:e},byModel:Array.from(r.values()).toSorted(jt),byProvider:Array.from(i.values()).toSorted(jt),byAgent:Array.from(a,([e,t])=>({agentId:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byChannel:Array.from(o,([e,t])=>({channel:e,totals:t})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost),byCreator:Array.from(s.values(),({daily:e,sessionActivity:t,...n})=>({...n,daily:Array.from(e,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date)),sessionActivity:Array.from(t.values()).toSorted((e,t)=>e.dates.join(`,`).localeCompare(t.dates.join(`,`)))})).toSorted((e,t)=>t.totals.totalCost-e.totals.totalCost||t.totals.totalTokens-e.totals.totalTokens||e.key.localeCompare(t.key)),costDaily:Array.from(l,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date)),latency:f.count>0?Ot(f):void 0,dailyLatency:Array.from(u,([e,t])=>({date:e,...Ot(t)})).toSorted((e,t)=>e.date.localeCompare(t.date)),modelDaily:Array.from(d.values()).toSorted((e,t)=>e.date.localeCompare(t.date)||t.cost-e.cost),daily:Array.from(c.values()).toSorted((e,t)=>e.date.localeCompare(t.date))}}return{totals:e,add:g,finish:_}}var Nt;function Pt(){return(Pt=e((()=>{Nt=`["unknown"]`})))()}function Ft(e){return Math.round(e/rn)}function K(e){return ee(e,{thousandsSuffix:`K`,trimTrailingZero:!1})}function q(e,t=2){return`$${e.toFixed(t)}`}function It(e){return new Date(Date.UTC(1970,0,1,e)).toLocaleTimeString(void 0,{hour:`numeric`,timeZone:`UTC`})}function Lt(e,t,n){let r=e.usage;if(!r)return!1;let i=r.firstActivity??e.updatedAt,a=r.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a);if(o===s){let e=new Date(o);return n({usage:r,hour:zt(e,t),weekday:Bt(e,t),share:1}),!0}let c=s-o,l=o;for(;l<s;){let e=new Date(l),i=Math.min(Ut(e,t),s);n({usage:r,hour:zt(e,t),weekday:Bt(e,t),share:(i-l)/c}),l=i}return!0}function Rt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:24},()=>0);for(let i of e){let e=i.usage;if(!e?.messageCounts||e.messageCounts.total===0)continue;let a=e.messageCounts;if(e.utcQuarterHourMessageCounts&&e.utcQuarterHourMessageCounts.length>0){let i={utcDateKey:void 0,utcWeekday:null,utcStartMs:0};for(let a of e.utcQuarterHourMessageCounts){let e=Ht(a.date,a.quarterIndex,t,i);e&&(n[e.hour]=(n[e.hour]??0)+a.errors,r[e.hour]=(r[e.hour]??0)+a.total)}continue}Lt(i,t,({hour:e,share:t})=>{n[e]=(n[e]??0)+(a.errors??0)*t,r[e]=(r[e]??0)+a.total*t})}return r.map((e,t)=>{let r=n[t]??0;return{hour:t,rate:e>0?r/e:0,errors:r,msgs:e}}).filter(e=>e.msgs>0&&e.errors>0).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(e=>({label:It(e.hour),value:`${(e.rate*100).toFixed(2)}%`,sub:`${Math.round(e.errors)} ${s(f(`usage.overview.errors`))} · ${Math.round(e.msgs)} ${f(`usage.overview.messagesAbbrev`)}`}))}function zt(e,t){return t===`utc`?e.getUTCHours():e.getHours()}function Bt(e,t){return t===`utc`?e.getUTCDay():e.getDay()}function Vt(e,t){let n=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!n||!Number.isInteger(t)||t<0||t>95)return null;let[,r,i,a]=n,o=Number(r),s=Number(i),c=Number(a),l=new Date(Date.UTC(o,s-1,c,0,t*15));return Number.isNaN(l.valueOf())||l.getUTCFullYear()!==o||l.getUTCMonth()!==s-1||l.getUTCDate()!==c?null:l}function Ht(e,t,n,r){if(!Number.isInteger(t)||t<0||t>95)return null;if(e!==r.utcDateKey){r.utcDateKey=e;let t=Vt(e,0);r.utcWeekday=t?t.getUTCDay():null,r.utcStartMs=t?t.getTime():0}if(r.utcWeekday===null)return null;let i=n===`local`?new Date(r.utcStartMs+t*9e5):null;return{hour:i?zt(i,n):Math.floor((t+0)/4),weekday:i?Bt(i,n):r.utcWeekday}}function Ut(e,t){let n=e.getTime(),r=t===`utc`?e.getUTCMinutes():e.getMinutes(),i=t===`utc`?e.getUTCSeconds():e.getSeconds(),a=n+(60-r)*6e4-i*1e3-e.getMilliseconds();if(t===`utc`||new Date(a-1).getTimezoneOffset()===e.getTimezoneOffset())return a;let o=e.getTimezoneOffset(),s=n+1,c=a-1;for(;s<c;){let e=s+Math.floor((c-s)/2);new Date(e).getTimezoneOffset()===o?s=e+1:c=e}return s}function Wt(e,t,n){let r=e.usage?.utcQuarterHourTokenUsage;if(!r||r.length===0)return!1;let i=!1,a={utcDateKey:void 0,utcWeekday:null,utcStartMs:0};for(let e of r){if(e.totalTokens<=0)continue;let r=Ht(e.date,e.quarterIndex,t,a);if(r&&(i=!0,n({hour:r.hour,weekday:r.weekday,tokens:e.totalTokens})===!1))break}return i}function Gt(e,t,n){let r=e.usage,i=r?.firstActivity??e.updatedAt,a=r?.lastActivity??e.updatedAt;if(!i||!a)return!1;let o=Math.min(i,a),s=Math.max(i,a),c=o;for(;c<=s;){let e=new Date(c),r=zt(e,n);if(t.includes(r))return!0;if(c===s)break;c=Math.min(Ut(e,n),s)}return!1}function Kt(e,t,n){if(t.length===0)return!0;let r=!1;return Wt(e,n,({hour:e})=>(r=t.includes(e),!r))?r:Gt(e,t,n)}function qt(e,t){let n=Array.from({length:24},()=>0),r=Array.from({length:7},()=>0),i=0,a=!1;for(let o of e){let e=o.usage;if(!(!e||!e.totalTokens||e.totalTokens<=0)){if(i+=e.totalTokens,Wt(o,t,({hour:e,weekday:t,tokens:i})=>{n[e]=(n[e]??0)+i,r[t]=(r[t]??0)+i})){a=!0;continue}Lt(o,t,({usage:e,hour:t,weekday:i,share:a})=>{n[t]=(n[t]??0)+e.totalTokens*a,r[i]=(r[i]??0)+e.totalTokens*a})&&(a=!0)}}let o=[f(`usage.mosaic.sun`),f(`usage.mosaic.mon`),f(`usage.mosaic.tue`),f(`usage.mosaic.wed`),f(`usage.mosaic.thu`),f(`usage.mosaic.fri`),f(`usage.mosaic.sat`)].map((e,t)=>({label:e,tokens:r[t]??0}));return{hasData:a,totalTokens:i,hourTotals:n,weekdayTotals:o}}function Jt(e,t,n,r){let i=qt(e,t);if(!i.hasData)return he({title:f(`usage.mosaic.title`),description:f(`usage.mosaic.subtitleEmpty`),actions:M`
          <div class="usage-mosaic-total">
            ${K(0)} ${s(f(`usage.metrics.tokens`))}
          </div>
        `},M`
        <div class="usage-panel usage-mosaic">
          <div class="usage-empty-block usage-empty-block--compact">
            ${f(`usage.mosaic.noTimelineData`)}
          </div>
        </div>
      `);let a=Math.max(...i.hourTotals,1),o=Math.max(...i.weekdayTotals.map(e=>e.tokens),1);return he({title:f(`usage.mosaic.title`),description:f(`usage.mosaic.subtitle`,{zone:f(t===`utc`?`usage.filters.timeZoneUtc`:`usage.filters.timeZoneLocal`)}),actions:M`
        <div class="usage-mosaic-total">
          ${K(i.totalTokens)}
          ${s(f(`usage.metrics.tokens`))}
        </div>
      `},M`
      <div class="usage-panel usage-mosaic">
        <div class="usage-mosaic-grid">
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">${f(`usage.mosaic.dayOfWeek`)}</div>
            <div class="usage-daypart-grid">
              ${i.weekdayTotals.map(e=>{let t=Math.min(e.tokens/o,1),n=e.tokens>0?`color-mix(in srgb, var(--accent) ${(12+t*60).toFixed(1)}%, transparent)`:`transparent`;return M`
                  <div class="usage-daypart-cell" style="background: ${n};">
                    <div class="usage-daypart-label">${e.label}</div>
                    <div class="usage-daypart-value">${K(e.tokens)}</div>
                  </div>
                `})}
            </div>
          </div>
          <div class="usage-mosaic-section">
            <div class="usage-mosaic-section-title">
              <span>${f(`usage.filters.hours`)}</span>
              <span class="usage-mosaic-sub">0 → 23</span>
            </div>
            <div class="usage-hour-grid">
              ${i.hourTotals.map((e,t)=>{let i=Math.min(e/a,1),o=e>0?`color-mix(in srgb, var(--accent) ${(8+i*70).toFixed(1)}%, transparent)`:`transparent`,c=`${t}:00 · ${K(e)} ${s(f(`usage.metrics.tokens`))}`,l=i>.7?`color-mix(in srgb, var(--accent) 60%, transparent)`:`color-mix(in srgb, var(--accent) 24%, transparent)`,u=n.includes(t);return M`
                  <button
                    type="button"
                    class="usage-hour-cell ${u?`selected`:``}"
                    style="background: ${o}; border-color: ${l};"
                    title="${c}"
                    aria-label=${c}
                    aria-pressed=${u?`true`:`false`}
                    @click=${e=>r(t,e.shiftKey)}
                  ></button>
                `})}
            </div>
            <div class="usage-hour-labels">
              <span>${f(`usage.mosaic.midnight`)}</span>
              <span>${f(`usage.mosaic.fourAm`)}</span>
              <span>${f(`usage.mosaic.eightAm`)}</span>
              <span>${f(`usage.mosaic.noon`)}</span>
              <span>${f(`usage.mosaic.fourPm`)}</span>
              <span>${f(`usage.mosaic.eightPm`)}</span>
            </div>
            <div class="usage-hour-legend">
              <span></span>
              ${f(`usage.mosaic.legend`)}
            </div>
          </div>
        </div>
      </div>
    `)}function Yt(e,t=`local`){let n=t===`utc`?e.getUTCFullYear():e.getFullYear(),r=(t===`utc`?e.getUTCMonth():e.getMonth())+1,i=t===`utc`?e.getUTCDate():e.getDate();return`${n}-${String(r).padStart(2,`0`)}-${String(i).padStart(2,`0`)}`}function Xt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let[,n,r,i]=t,a=Number(n),o=Number(r)-1,s=Number(i),c=new Date(a,o,s);return Number.isNaN(c.valueOf())||c.getFullYear()!==a||c.getMonth()!==o||c.getDate()!==s?null:c}function Zt(e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!t)return null;let n=Number(t[1]),r=Number(t[2]),i=Number(t[3]),a=Date.UTC(n,r-1,i),o=new Date(a);return o.getUTCFullYear()!==n||o.getUTCMonth()!==r-1||o.getUTCDate()!==i?null:a/an}function Qt(e){return new Date(e*an).toISOString().slice(0,10)}function $t(e){let t=Xt(e);return t?t.toLocaleDateString(void 0,{month:`short`,day:`numeric`}):e}function en(e){let t=Xt(e);return t?t.toLocaleDateString(void 0,{month:`long`,day:`numeric`,year:`numeric`}):e}function tn(e,t,n){let r=Zt(t),i=Zt(n);if(r===null||i===null||r>i)return null;let a=St();for(let t of e){let e=Zt(t.date);e!==null&&e>=r&&e<=i&&Ct(a,t)}return{days:i-r+1,startDate:t,endDate:n,totals:a}}function nn(e,t,n,r=[1,7,30,90]){let i=Zt(t),a=Zt(n);if(i===null||a===null||i>a)return[];let o=a-i+1;return Array.from(new Set(r.map(e=>Math.max(1,Math.trunc(e))))).filter(e=>e<o).toSorted((e,t)=>e-t).map(t=>tn(e,Qt(a-t+1),n)).filter(e=>e!==null)}var rn,an,on,sn;function J(){return(J=e((()=>{I(),Pt(),Se(),h(),dt(),x(),ut(),rn=4,an=864e5,on=(e,t)=>{if(e.length===0)return t??{messages:{total:0,user:0,assistant:0,toolCalls:0,toolResults:0,errors:0},tools:{totalCalls:0,uniqueTools:0,tools:[]},byModel:[],byProvider:[],byAgent:[],byChannel:[],daily:[]};let n=Mt();for(let t of e)n.add(t);return n.finish()},sn=(e,t,n)=>{let r=0,i=0;for(let t of e){let e=t.usage?.durationMs??0;e>0&&(r+=e,i+=1)}let a=i?r/i:0,o=t&&r>0?t.totalTokens/(r/6e4):void 0,s=t&&r>0?t.totalCost/(r/6e4):void 0,c=n.messages.total?n.messages.errors/n.messages.total:0,l;for(let e of n.daily){if(e.messages<=0||e.errors<=0)continue;let t={date:e.date,errors:e.errors,messages:e.messages,rate:e.errors/e.messages};(!l||t.rate>l.rate||t.rate===l.rate&&t.errors>l.errors)&&(l=t)}return{durationSumMs:r,durationCount:i,avgDurationMs:a,throughputTokensPerMin:o,throughputCostPerMin:s,errorRate:c,peakErrorDay:l}}})))()}function cn(e){return/^[ \t\r\n]*[=+\-@\uFF0B\uFF0D\uFF1D\uFF20]/u.test(e)?`'${e}`:e}function ln(e,t=!0){let n=t?cn(e):e;return/[",\r\n]/.test(n)?`"${n.replaceAll(`"`,`""`)}"`:n}function un(e){return e.map(e=>e==null?``:ln(String(e),typeof e==`string`)).join(`,`)}function dn(e,t,n,r=12){for(let i of t){if(e.length>=r)break;let t=n(i);t&&!e.includes(t)&&e.push(t)}}function fn(e,t){let n={agent:[],channel:[],provider:[],model:[],tool:[]};return dn(n.agent,e,e=>e.agentId,6),dn(n.channel,e,e=>e.channel),dn(n.provider,e,e=>e.modelProvider),dn(n.provider,e,e=>e.providerOverride),dn(n.provider,t?.byProvider??[],e=>e.provider),dn(n.model,e,e=>e.model),dn(n.model,t?.byModel??[],e=>e.model),dn(n.tool,t?.tools.tools??[],e=>e.name),n}var pn,mn,hn,gn,Y,_n,vn;function yn(){return(yn=e((()=>{d(),We(),pn=e=>{let t=[un([`key`,`label`,`agentId`,`channel`,`provider`,`model`,`updatedAt`,`durationMs`,`messages`,`errors`,`toolCalls`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`totalCost`])];for(let n of e){let e=n.usage;t.push(un([n.key,n.label??``,n.agentId??``,n.channel??``,n.modelProvider??n.providerOverride??``,n.model??n.modelOverride??``,u(n.updatedAt)??``,e?.durationMs??``,e?.messageCounts?.total??``,e?.messageCounts?.errors??``,e?.messageCounts?.toolCalls??``,e?.input??``,e?.output??``,e?.cacheRead??``,e?.cacheWrite??``,e?.totalTokens??``,e?.totalCost??``]))}return t.join(`
`)},mn=e=>{let t=[un([`date`,`inputTokens`,`outputTokens`,`cacheReadTokens`,`cacheWriteTokens`,`totalTokens`,`inputCost`,`outputCost`,`cacheReadCost`,`cacheWriteCost`,`totalCost`])];for(let n of e)t.push(un([n.date,n.input,n.output,n.cacheRead,n.cacheWrite,n.totalTokens,n.inputCost??``,n.outputCost??``,n.cacheReadCost??``,n.cacheWriteCost??``,n.totalCost]));return t.join(`
`)},hn=(e,t)=>{let n=e.trim();if(!n)return[];let r=Xe(n).map(e=>e.raw).at(-1)??``,[i,a]=r.includes(`:`)?[r.slice(0,r.indexOf(`:`)),r.slice(r.indexOf(`:`)+1)]:[``,``],o=s(i),c=s(a);if(!o)return[{label:`agent:`,value:`agent:`},{label:`channel:`,value:`channel:`},{label:`provider:`,value:`provider:`},{label:`model:`,value:`model:`},{label:`tool:`,value:`tool:`},{label:`has:errors`,value:`has:errors`},{label:`has:tools`,value:`has:tools`},{label:`minTokens:`,value:`minTokens:`},{label:`maxCost:`,value:`maxCost:`}];let l=[],u=(e,t)=>{for(let n of t.slice(0,6))(!c||s(n).includes(c))&&l.push({label:`${e}:${n}`,value:`${e}:${n}`})};switch(o){case`agent`:u(`agent`,t.agent);break;case`channel`:u(`channel`,t.channel);break;case`provider`:u(`provider`,t.provider);break;case`model`:u(`model`,t.model);break;case`tool`:u(`tool`,t.tool);break;case`has`:[`errors`,`tools`,`context`,`usage`,`model`,`provider`].forEach(e=>{(!c||e.includes(c))&&l.push({label:`has:${e}`,value:`has:${e}`})})}return l},gn=(e,t)=>{let n=e.trim();if(!n)return`${t} `;let r=Xe(n).map(e=>e.raw);return r[r.length-1]=t,`${r.join(` `)} `},Y=e=>s(e),_n=(e,t)=>{let n=Xe(e).map(e=>e.raw).filter(e=>e!==t);return n.length?`${n.join(` `)} `:``},vn=(e,t,n)=>{let r=Y(t),i=new Map(n.map(e=>[Y(e),e])),a=[];for(let t of Xe(e))(Y(t.key??``)!==r||i.delete(Y(t.value)))&&a.push(t.raw);let o=[...a,...Array.from(i.values(),e=>`${t}:${e}`)];return o.length?`${o.join(` `)} `:``}})))()}function bn(e,t,n){return{key:e,className:`usage-token-${e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}`,labelKey:`usage.breakdown.${e}`,hintKey:t,short:n}}function xn(e,t){return t===0?0:e/t*100}function Sn(e){let t=Math.abs(e);return q(e,t===0||t>=.01?2:t>=1e-4?4:6)}function Cn(e,t,n,r){(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),r(t,e.shiftKey,n))}function wn(e,t){let n=Date.parse(t.startDate),r=(Date.parse(t.endDate)-n)/864e5+1;if(!t.complete||!Number.isInteger(r)||r<1||r>366)return e.toSorted((e,t)=>e.date.localeCompare(t.date));let i=new Map(e.map(e=>[e.date,e]));return Array.from({length:r},(e,t)=>{let r=new Date(n+t*864e5).toISOString().slice(0,10);return i.get(r)??{...St(),date:r}})}function Tn(e,t,n,i,a,o,c){let l=wn(e,c);if(!l.length)return M`
      <div class="daily-chart-compact">
        <div class="card-title usage-section-title">${f(`usage.daily.title`)}</div>
        <div class="usage-empty-block">${f(`usage.empty.noData`)}</div>
      </div>
    `;let u=l.map(e=>e.date),d=n===`tokens`,p=l.map(e=>d?e.totalTokens:e.totalCost),m=Math.max(...p,0),h=m>0?m:d?1:1e-4,g=p.filter(e=>e>0),_=h/(g.length>0?Math.min(...g):h)>50,v=p.map(e=>{if(e<=0)return 0;let t=_?Math.sqrt(e/h):e/h;return Math.max(6,t*200)}),y=l.length>30?12:l.length>20?18:l.length>14?24:32,b=l.length<=14,x=new Set(t);return M`
    <div class="daily-chart-compact">
      <div class="daily-chart-header">
        ${Ce({mode:`buttons`,variant:`accent`,className:`small sessions-toggle`,value:i,onChange:a,onReselect:a,options:[{value:`total`,label:f(`usage.daily.total`)},{value:`by-type`,label:f(`usage.daily.byType`)}]})}
        <div class="card-title">
          ${f(d?`usage.daily.tokensTitle`:`usage.daily.costTitle`)}
          <div class="card-sub daily-chart-range">
            ${en(c.startDate)} – ${en(c.endDate)}
          </div>
          ${_?M`<span
                  class="daily-chart-scale-badge"
                  title=${f(`usage.daily.compressedScaleHint`)}
                  aria-label=${f(`usage.daily.compressedScaleHint`)}
                  >√</span
                >`:F}
        </div>
      </div>
      <div class="daily-chart">
        <div class="daily-chart-plot">
          <div class="daily-chart-scale" aria-hidden="true">
            ${(m>0?[m,m/(_?4:2),0]:[0]).map(e=>M`<span
                  >${d?K(e):e===0?q(0):Sn(e)}</span
                >`)}
          </div>
          <div class="daily-chart-bars" style="--bar-max-width: ${y}px">
            ${l.map((e,t)=>{let n=r(v[t],`daily usage bar height`),a=x.has(e.date),c=$t(e.date),p=l.length<=14||t%Math.ceil(l.length/6)===0||t===l.length-1,m=c,h=p?`daily-bar-label`:`daily-bar-label daily-bar-label--hidden`,g=i===`by-type`?X.map(({key:t,className:n,labelKey:r})=>({value:d?e[t]:e[`${t}Cost`]??0,className:n,labelKey:r})):[],_=g.map(({value:e,labelKey:t})=>`${f(t)} ${d?K(e):Sn(e)}`),y=d?K(e.totalTokens):Sn(e.totalCost),S=en(e.date),C=`${K(e.totalTokens)} ${s(f(`usage.metrics.tokens`))}`.trim(),w=Sn(e.totalCost),T=g.reduce((e,t)=>e+t.value,0)||1;return M`
                <testclaw-tooltip
                  .content=${[S,C,w,..._].join(`
`)}
                >
                  <div
                    class="daily-bar-wrapper ${a?`selected`:``}"
                    role="button"
                    tabindex="0"
                    aria-pressed=${a?`true`:`false`}
                    aria-label=${`${S}: ${C}, ${w}`}
                    @keydown=${t=>Cn(t,e.date,u,o)}
                    @click=${t=>o(e.date,t.shiftKey,u)}
                  >
                    ${i===`by-type`?M`
                            <div
                              class="daily-bar daily-bar--stacked ${n===0?`daily-bar--empty`:``}"
                              style="height: ${n.toFixed(0)}px;"
                            >
                              ${g.map(({className:e,value:t})=>M`
                                  <div
                                    class="cost-segment ${e}"
                                    style="height: ${t/T*100}%"
                                  ></div>
                                `)}
                            </div>
                          `:M`
                            <div
                              class="daily-bar ${n===0?`daily-bar--empty`:``}"
                              style="height: ${n.toFixed(0)}px"
                            ></div>
                          `}
                    ${b?M`<div class="daily-bar-total">${y}</div>`:M`<div
                            class="daily-bar-total daily-bar-total--placeholder"
                            aria-hidden="true"
                          ></div>`}
                    <div class="${h}">${m}</div>
                  </div>
                </testclaw-tooltip>
              `})}
          </div>
        </div>
      </div>
    </div>
  `}function En(e,t){let n=t===`tokens`,r=n?e.totalTokens||1:e.totalCost||0,i=X.map(({key:t,className:i,labelKey:a})=>{let o=n?e[t]:e[`${t}Cost`]||0;return{className:i,labelKey:a,percentage:xn(o,r),formatted:n?K(o):Sn(o)}});return M`
    <div class="cost-breakdown cost-breakdown-compact">
      <div class="cost-breakdown-header">
        ${f(n?`usage.breakdown.tokensByType`:`usage.breakdown.costByType`)}
      </div>
      <div class="cost-breakdown-bar">
        ${i.map(({className:e,labelKey:t,percentage:n,formatted:r})=>M`
            <div
              class="cost-segment ${e}"
              style="width: ${n.toFixed(1)}%"
              title="${f(t)}: ${r}"
            ></div>
          `)}
      </div>
      <div class="cost-breakdown-legend">
        ${i.map(({className:e,labelKey:t,formatted:n})=>M`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${f(t)} ${n}</span
            >
          `)}
      </div>
      <div class="cost-breakdown-total">
        ${f(`usage.breakdown.total`)}:
        ${n?K(e.totalTokens):Sn(e.totalCost)}
      </div>
    </div>
  `}var X;function Dn(){return(Dn=e((()=>{a(),I(),Se(),h(),H(),J(),X=[bn(`output`,`usage.details.assistantOutputTokens`,`Out`),bn(`input`,`usage.details.userToolInputTokens`,`In`),bn(`cacheWrite`,`usage.details.tokensWrittenToCache`,`CW`),bn(`cacheRead`,`usage.details.tokensReadFromCache`,`CR`)]})))()}function On({actor:e}){if(!e)return f(`usage.creators.unattributed`);let t=e.label?.trim()||e.identity?.id||e.id||f(e.type===`system`?`usage.creators.system`:`usage.common.unknown`);return e.identity?.type===`profile`?oe({id:e.identity.id,name:t}):t}function kn(e){let t=e.options.toSorted((e,t)=>On(e).localeCompare(On(t))).map(e=>({key:e.key,label:On(e)}));return e.selectedKey!==null&&!t.some(t=>t.key===e.selectedKey)&&t.push({key:e.selectedKey,label:f(`usage.creators.selected`)}),M`
    <select
      class="usage-select usage-creator-filter"
      aria-label=${f(`usage.creators.select`)}
      @change=${t=>{let n=t.currentTarget.value;e.onSelect(n||null)}}
    >
      <option value="" .selected=${e.selectedKey===null}>${f(`usage.creators.all`)}</option>
      ${t.map(t=>M`
          <option value=${t.key} .selected=${t.key===e.selectedKey}>
            ${t.label}
          </option>
        `)}
    </select>
  `}function An(e){let t=t=>e.mode===`tokens`?t.totals.totalTokens:t.totals.totalCost,n=e.groups.toSorted((e,n)=>t(n)-t(e)||On(e).localeCompare(On(n))),r=n.reduce((e,n)=>e+t(n),0),i=n=>M`
    <table class="usage-creators-table">
      <thead>
        <tr>
          <th scope="col">${f(`usage.creators.identity`)}</th>
          <th scope="col">${f(`usage.metrics.tokens`)}</th>
          <th scope="col">${f(`usage.metrics.cost`)}</th>
          <th scope="col">${f(`usage.metrics.sessions`)}</th>
        </tr>
      </thead>
      <tbody>
        ${n.map(n=>M`
            <tr class=${n.key===e.selectedKey?`selected`:``}>
              <th scope="row">
                <button
                  type="button"
                  class="usage-creator-select"
                  aria-pressed=${n.key===e.selectedKey}
                  @click=${()=>e.onSelect(n.key)}
                >
                  <span class="usage-creator-name">
                    <span aria-hidden="true">${ve(n.actor,`row`)}</span>
                    <span>${On(n)}</span>
                  </span>
                  <span class="usage-creator-track" aria-hidden="true">
                    <span style=${`width: ${r>0?t(n)/r*100:0}%`}></span>
                  </span>
                </button>
              </th>
              <td class=${e.mode===`tokens`?`usage-creator-primary`:``}>
                ${K(n.totals.totalTokens)}
              </td>
              <td class=${e.mode===`cost`?`usage-creator-primary`:``}>
                ${q(n.totals.totalCost)}
              </td>
              <td>${n.sessionCount}</td>
            </tr>
          `)}
      </tbody>
    </table>
  `;return he({title:f(`usage.creators.title`),description:f(`usage.creators.description`)},M`
      <div class="usage-panel usage-creators">
        ${n.length>0?i(n.slice(0,8)):M`<div class="usage-empty-block usage-empty-block--compact">
                ${f(`usage.creators.empty`)}
              </div>`}
        ${n.length>8?M`
                <details class="usage-creators-more">
                  <summary>
                    ${f(`usage.creators.more`,{count:String(n.length-8)})}
                  </summary>
                  ${i(n.slice(8))}
                </details>
              `:F}
      </div>
    `)}function jn(){return(jn=e((()=>{I(),pe(),Se(),h(),G(),J()})))()}function Mn(e){let{sessionKey:t,displayLabel:n,meta:r,agentId:i,valueLabel:a,isSelected:o,onSelect:s}=e;return M`
    <div
      class="session-bar-row ${o?`selected`:``}"
      @click=${e=>{e.target instanceof Element&&e.target.closest(`button`)||s(e)}}
      title="${t}"
    >
      <button
        type="button"
        class="session-bar-selection"
        aria-label=${n}
        aria-pressed=${o?`true`:`false`}
        @click=${s}
      >
        <span class="session-bar-label">
          <span class="session-bar-title">${n}</span>
          ${i?Ae(i):F}
          ${r.length>0?M`<span class="session-bar-meta">${r.join(` · `)}</span>`:F}
        </span>
      </button>
      <div class="session-bar-actions">
        ${ne(n,M`<button
            type="button"
            class="btn btn--sm btn--ghost"
            @click=${e=>{e.stopPropagation(),fe(e,n,f(`usage.sessions.copy`))}}
          >
            <span data-copy-label>${f(`usage.sessions.copy`)}</span>
          </button>`)}
        <div class="session-bar-value">${a}</div>
      </div>
    </div>
  `}function Nn(){return(Nn=e((()=>{I(),L(),je(),_e(),h()})))()}function Z(e){let t=Math.abs(e);return q(e,t===0||t>=.01?2:t>=1e-4?4:6)}function Pn(e,t,r,i,a,o,s,c){if(!(e.length>0||t.length>0||r.length>0))return F;let l=r.at(0)??``,u=r.length===1?i.find(e=>e.key===l):null,d=u?n(u.label||u.key,20)+((u.label||u.key).length>20?`…`:``):r.length===1?n(l,8)+`…`:f(`usage.filters.sessionsCount`,{count:String(r.length)}),p=u?u.label||u.key:r.length===1?l:r.join(`, `),m=e.length===1?e[0]:f(`usage.filters.daysCount`,{count:String(e.length)}),h=t.length===1?`${t[0]}:00`:f(`usage.filters.hoursCount`,{count:String(t.length)}),g=[{active:e.length>0,labelKey:`usage.filters.days`,value:m,removeKey:`usage.filters.removeDays`,onClear:a},{active:t.length>0,labelKey:`usage.filters.hours`,value:h,removeKey:`usage.filters.removeHours`,onClear:o},{active:r.length>0,labelKey:`usage.filters.session`,value:d,removeKey:`usage.filters.removeSession`,onClear:s,title:p}];return M`
    <div class="active-filters">
      ${g.filter(({active:e})=>e).map(({labelKey:e,value:t,removeKey:n,onClear:r,title:i})=>M`
            <div class="filter-chip" title=${P(i)}>
              <span class="filter-chip-label">${f(e)}: ${t}</span>
              <testclaw-tooltip .content=${f(`usage.filters.remove`)}>
                <button class="filter-chip-remove" @click=${r} aria-label=${f(n)}>
                  ×
                </button>
              </testclaw-tooltip>
            </div>
          `)}
      ${(e.length>0||t.length>0)&&r.length>0?M`
              <button class="btn btn--sm" @click=${c}>
                ${f(`usage.filters.clearAll`)}
              </button>
            `:F}
    </div>
  `}function Fn(e,t,n,r){let i=tn(e,t,n);if(!i||e.length===0)return F;let a=nn(e,t,n),o=Yt(new Date,r),s=(e,t)=>e===1?t===o?f(`usage.presets.today`):$t(t):f(`usage.costWindows.lastDays`,{count:String(e)}),c=[{label:f(`usage.costWindows.selectedRange`),summary:i,range:!0},...a.map(e=>({label:s(e.days,e.endDate),summary:e,range:!1}))];return M`
    <section class="cost-window-analysis">
      <div class="cost-window-header">
        <div>
          <div class="card-title usage-section-title">${f(`usage.costWindows.title`)}</div>
          <div class="card-sub">
            ${f(`usage.costWindows.subtitle`,{date:en(n)})}
          </div>
        </div>
        <div class="cost-window-range-label">
          ${$t(t)} – ${$t(n)}
        </div>
      </div>
      <div class="cost-window-grid">
        ${c.map(({label:e,summary:t,range:n})=>{let r=t.totals.totalCost/t.days;return M`
            <div class="cost-window-card ${n?`cost-window-card--range`:``}">
              <div class="cost-window-card__label">${e}</div>
              <div class="cost-window-card__value">
                ${Z(t.totals.totalCost)}
              </div>
              <div class="cost-window-card__meta">
                ${K(t.totals.totalTokens)} ${f(`usage.metrics.tokens`)} ·
                ${Z(r)} ${f(`usage.costWindows.perDay`)}
              </div>
            </div>
          `})}
      </div>
    </section>
  `}function In(e,t,n,r){let i=[`usage-insight-card`,r?.className].filter(Boolean).join(` `),a=[r?.error?`usage-error-list`:`usage-list`,r?.listClassName].filter(Boolean).join(` `);return M`
    <div class=${i}>
      <div class="usage-insight-title">${e}</div>
      ${t.length===0?M`<div class="muted">${n}</div>`:M`
              <div class=${a}>
                ${t.map(e=>r?.error?M`
                        <div class="usage-error-row">
                          <div class="usage-error-date">${e.label}</div>
                          <div class="usage-error-rate">${e.value}</div>
                          ${e.sub?M`<div class="usage-error-sub">${e.sub}</div>`:F}
                        </div>
                      `:M`
                        <div class="usage-list-item">
                          <span
                            >${e.agentId?Ae(e.agentId):e.label}</span
                          >
                          <span class="usage-list-value">
                            <span>${e.value}</span>
                            ${e.sub?M`<span class="usage-list-sub">${e.sub}</span>`:F}
                          </span>
                        </div>
                      `)}
              </div>
            `}
    </div>
  `}function Ln(e){let t=e.currentTarget;t instanceof HTMLElement&&t.focus()}function Q(e){let t=`usage-summary-hint-${e.hintId}`,n=[`stat`,`usage-summary-card`,e.className,e.tone?`usage-summary-card--${e.tone}`:``].filter(Boolean).join(` `),r=[`stat-value`,`usage-summary-value`,e.tone??``,e.compactValue?`usage-summary-value--compact`:``].filter(Boolean).join(` `);return M`
    <div class=${n}>
      <div class="usage-summary-title">
        ${e.title}
        <testclaw-tooltip open-on-click>
          <button
            id=${t}
            type="button"
            class="usage-summary-hint"
            aria-label=${e.title}
            @click=${Ln}
          >
            ?
          </button>
          <!-- Shared tooltips dismiss pointer activation so action buttons never
               strand one open. This hint exists only to be read, so it opts in to
               click-to-open; the click handler still normalizes browsers that do
               not focus buttons on pointer activation. -->
          <span slot="content">${e.hint}</span>
        </testclaw-tooltip>
      </div>
      <div class=${r}>${e.value}</div>
      <div class="usage-summary-sub">${e.sub}</div>
    </div>
  `}function Rn(e,t,n,r,i,a,o,c){if(!e)return F;let l=t.messages.total?Math.round(e.totalTokens/t.messages.total):0,u=t.messages.total?e.totalCost/t.messages.total:0,d=e.input+e.cacheRead+e.cacheWrite,p=d>0?e.cacheRead/d:0,m=d>0?`${(p*100).toFixed(1)}%`:f(`usage.common.emptyValue`),h=n.errorRate*100,g=n.throughputTokensPerMin===void 0?f(`usage.common.emptyValue`):`${K(Math.round(n.throughputTokensPerMin))} ${f(`usage.overview.tokensPerMinute`)}`,_=n.throughputCostPerMin===void 0?f(`usage.common.emptyValue`):`${Z(n.throughputCostPerMin)} ${f(`usage.overview.perMinute`)}`,v=n.durationCount>0?de(n.avgDurationMs)??f(`usage.common.emptyValue`):f(`usage.common.emptyValue`),y=t.daily.filter(e=>e.messages>0&&e.errors>0).map(e=>{let t=e.errors/e.messages;return{label:$t(e.date),value:`${(t*100).toFixed(2)}%`,sub:`${e.errors} ${s(f(`usage.overview.errors`))} · ${e.messages} ${f(`usage.overview.messagesAbbrev`)} · ${K(e.tokens)}`,rate:t}}).toSorted((e,t)=>t.rate-e.rate).slice(0,5).map(({rate:e,...t})=>t),b=t=>i&&e.totalCost>0?f(`usage.overview.costShare`,{percent:(t/e.totalCost*100).toFixed(1)}):null,x=(e,t,n)=>[b(e),K(t),n===void 0?null:`${n} ${f(`usage.overview.messagesAbbrev`)}`].filter(e=>e!==null).join(` · `),S=t.byModel.slice(0,5).map(e=>({label:e.model??f(`usage.common.unknown`),value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens,e.count)})),C=t.byProvider.slice(0,5).map(e=>({label:e.provider??f(`usage.common.unknown`),value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens,e.count)})),w=t.tools.tools.slice(0,6).map(e=>({label:e.name,value:`${e.count}`,sub:f(`usage.overview.calls`)})),T=t.byAgent.slice(0,5).map(e=>({label:e.agentId,agentId:e.agentId,value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens)})),ee=t.byChannel.slice(0,5).map(e=>({label:e.channel,value:Z(e.totals.totalCost),sub:x(e.totals.totalCost,e.totals.totalTokens)})),E=[[`usage.overview.topModels`,S,`usage.overview.noModelData`],[`usage.overview.topProviders`,C,`usage.overview.noProviderData`],[`usage.overview.topTools`,w,`usage.overview.noToolCalls`],[`usage.overview.topAgents`,T,`usage.overview.noAgentData`],[`usage.overview.topChannels`,ee,`usage.overview.noChannelData`]];return he({title:f(`usage.overview.title`)},M`
      <section class="usage-panel usage-overview-card">
        <div class="usage-overview-layout">
          <div class="usage-summary-grid">
            ${Q({hintId:`messages`,title:f(`usage.overview.messages`),hint:f(`usage.overview.messagesHint`),value:t.messages.total,sub:`${t.messages.user} ${s(f(`usage.overview.user`))} · ${t.messages.assistant} ${s(f(`usage.overview.assistant`))}`,className:`usage-summary-card--hero`})}
            ${Q({hintId:`throughput`,title:f(`usage.overview.throughput`),hint:f(`usage.overview.throughputHint`),value:g,sub:_,className:`usage-summary-card--hero usage-summary-card--throughput`,compactValue:!0})}
            ${Q({hintId:`tool-calls`,title:f(`usage.overview.toolCalls`),hint:f(`usage.overview.toolCallsHint`),value:t.tools.totalCalls,sub:`${t.tools.uniqueTools} ${f(`usage.overview.toolsUsed`)}`,className:`usage-summary-card--half`})}
            ${Q({hintId:`average-tokens`,title:f(`usage.overview.avgTokens`),hint:f(`usage.overview.avgTokensHint`),value:K(l),sub:f(`usage.overview.acrossMessages`,{count:String(t.messages.total||0)}),className:`usage-summary-card--half`})}
            ${Q({hintId:`cache-hit-rate`,title:f(`usage.overview.cacheHitRate`),hint:f(`usage.overview.cacheHint`),value:m,sub:`${K(e.cacheRead)} ${f(`usage.overview.cached`)} · ${K(d)} ${f(`usage.overview.prompt`)}`,tone:p>.6?`good`:p>.3?`warn`:`bad`,className:`usage-summary-card--medium`})}
            ${Q({hintId:`error-rate`,title:f(`usage.overview.errorRate`),hint:f(`usage.overview.errorHint`),value:`${h.toFixed(2)}%`,sub:`${t.messages.errors} ${s(f(`usage.overview.errors`))} · ${v} ${f(`usage.overview.avgSession`)}`,tone:h>5?`bad`:h>1?`warn`:`good`,className:`usage-summary-card--medium`})}
            ${Q({hintId:`average-cost`,title:f(`usage.overview.avgCost`),hint:f(r?`usage.overview.avgCostHintMissing`:`usage.overview.avgCostHint`),value:Z(u),sub:`${Z(e.totalCost)} ${s(f(`usage.breakdown.total`))}`,className:`usage-summary-card--compact`})}
            ${Q({hintId:`sessions`,title:f(`usage.overview.sessions`),hint:f(`usage.overview.sessionsHint`),value:o,sub:f(`usage.overview.sessionsInRange`,{count:String(c)}),className:`usage-summary-card--compact`})}
            ${Q({hintId:`errors`,title:f(`usage.overview.errors`),hint:f(`usage.overview.errorsHint`),value:t.messages.errors,sub:`${t.messages.toolResults} ${f(`usage.overview.toolResults`)}`,className:`usage-summary-card--compact`})}
          </div>
          <div class="usage-insights-grid">
            ${E.map(([e,t,n])=>In(f(e),t,f(n)))}
            ${In(f(`usage.overview.peakErrorDays`),y,f(`usage.overview.noErrorData`),{error:!0})}
            ${In(f(`usage.overview.peakErrorHours`),a,f(`usage.overview.noErrorData`),{error:!0,className:`usage-insight-card--wide`,listClassName:`usage-error-list--hours`})}
          </div>
        </div>
      </section>
    `)}function zn(e,t,n,r,i,a,o,c,l,u,d,p,m,h,g){let _=e=>m.includes(e),v=_(`agent`)||new Set(e.map(e=>e.agentId)).size>1,y=e=>{let t=e.label||e.key;return t.startsWith(`agent:`)&&t.includes(`?token=`)?t.slice(0,t.indexOf(`?token=`)):t},b=e=>[_(`channel`)&&e.channel&&`channel:${e.channel}`,_(`provider`)&&(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,_(`model`)&&e.model&&`model:${e.model}`,_(`messages`)&&e.usage?.messageCounts&&`msgs:${e.usage.messageCounts.total}`,_(`tools`)&&e.usage?.toolUsage&&`tools:${e.usage.toolUsage.totalCalls}`,_(`errors`)&&e.usage?.messageCounts&&`errors:${e.usage.messageCounts.errors}`,_(`duration`)&&e.usage?.durationMs&&`dur:${de(e.usage.durationMs)??`—`}`].filter(e=>typeof e==`string`&&e.length>0),x=new Set(n),S=e.map(e=>{let t=e.usage,n=t?.totalTokens??0,a=t?.totalCost??0,o=x.size>0?t?.dailyBreakdown:void 0;if(o?.length){n=0,a=0;for(let e of o)x.has(e.date)&&(n+=e.tokens,a+=e.cost)}let s;switch(i){case`recent`:s=e.updatedAt??0;break;case`messages`:s=t?.messageCounts?.total??0;break;case`errors`:s=t?.messageCounts?.errors??0;break;case`cost`:s=a;break;case`tokens`:s=n}return{session:e,displayLabel:y(e),value:r?n:a,sortValue:s}}).toSorted((e,t)=>{let n=t.sortValue-e.sortValue;if(n!==0)return n;let r=(t.session.updatedAt??0)-(e.session.updatedAt??0);return r===0?e.displayLabel.localeCompare(t.displayLabel):r}),C=a===`asc`?S.toReversed():S,w=C.reduce((e,t)=>e+t.value,0),T=C.length?w/C.length:0,ee=C.reduce((e,t)=>e+(t.session.usage?.messageCounts?.errors??0),0),E=new Set(t),D=C.filter(e=>E.has(e.session.key)),O=D.length,k=new Map(C.map(e=>[e.session.key,e])),A=o.map(e=>k.get(e)).filter(e=>e!==void 0),j=c===`recent`?A:C.slice(0,50),N=e=>{let t=e.map(e=>e.session.key);return e.map(e=>Mn({sessionKey:e.session.key,displayLabel:e.displayLabel,meta:b(e.session),agentId:v?e.session.agentId:void 0,valueLabel:r?K(e.value):Z(e.value),isSelected:E.has(e.session.key),onSelect:n=>l(e.session.key,n.shiftKey,t)}))};return he({title:f(`usage.sessions.title`)},M`
      <div class="usage-panel sessions-card">
        <div class="sessions-card-header">
          <div class="sessions-card-count">
            ${f(`usage.sessions.shown`,{count:String(j.length)})}
            ${h===j.length?``:` · ${f(`usage.sessions.total`,{count:String(h)})}`}
          </div>
        </div>
        <div class="sessions-card-meta">
          <div class="sessions-card-stats">
            <span>
              ${r?K(T):Z(T)}
              ${f(`usage.sessions.avg`)}
            </span>
            <span
              >${ee} ${s(f(`usage.overview.errors`))}</span
            >
          </div>
          ${Ce({mode:`buttons`,variant:`accent`,ariaPressed:!1,className:`small`,value:c,onChange:p,onReselect:p,options:[{value:`all`,label:f(`usage.sessions.all`)},{value:`recent`,label:f(`usage.sessions.recent`)}]})}
          <label class="sessions-sort">
            <span>${f(`usage.sessions.sort`)}</span>
            <select
              class="settings-select"
              @change=${e=>u(e.target.value)}
            >
              ${Object.entries({cost:`usage.metrics.cost`,errors:`usage.overview.errors`,messages:`usage.overview.messages`,recent:`usage.sessions.recentShort`,tokens:`usage.metrics.tokens`}).map(([e,t])=>M`<option value=${e} ?selected=${i===e}>
                    ${f(t)}
                  </option>`)}
            </select>
          </label>
          <testclaw-tooltip
            .content=${f(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
          >
            <button
              class="btn btn--sm"
              aria-label=${f(a===`desc`?`usage.sessions.descending`:`usage.sessions.ascending`)}
              @click=${()=>d(a===`desc`?`asc`:`desc`)}
            >
              ${a===`desc`?`↓`:`↑`}
            </button>
          </testclaw-tooltip>
          ${O>0?M`
                  <button class="btn btn--sm" @click=${g}>
                    ${f(`usage.sessions.clearSelection`)}
                  </button>
                `:F}
        </div>
        ${c===`recent`?j.length===0?M` <div class="usage-empty-block">${f(`usage.sessions.noRecent`)}</div> `:M`
                  <div class="session-bars session-bars--recent">
                    ${N(j)}
                  </div>
                `:j.length===0?M` <div class="usage-empty-block">${f(`usage.sessions.noneInRange`)}</div> `:M`
                  <div class="session-bars">
                    ${N(j)}
                    ${e.length>j.length?M`
                            <div class="usage-more-sessions">
                              ${f(`usage.sessions.more`,{count:String(e.length-j.length)})}
                            </div>
                          `:F}
                  </div>
                `}
        ${O>1?M`
                <div class="sessions-selected-group">
                  <div class="sessions-card-count">
                    ${f(`usage.sessions.selected`,{count:String(O)})}
                  </div>
                  <div class="session-bars session-bars--selected">
                    ${N(D)}
                  </div>
                </div>
              `:F}
      </div>
    `)}function Bn(){return(Bn=e((()=>{I(),N(),je(),Se(),h(),H(),ce(),J(),Nn()})))()}function Vn(e,t,n){let r=t||e.usage;if(!r)return M` <div class="usage-empty-block">${f(`usage.details.noUsageData`)}</div> `;let i=e=>e?w(e):f(`usage.common.emptyValue`),a=n!==void 0,o=n?.filter(e=>e.timestamp>0),c=a?o?.length?o.reduce((e,{role:t})=>((t===`user`||t===`assistant`)&&(e[t]+=1,e.total+=1),e),{total:0,user:0,assistant:0}):void 0:r.messageCounts,l=[e.channel&&`channel:${e.channel}`,e.agentId&&`agent:${e.agentId}`,(e.modelProvider||e.providerOverride)&&`provider:${e.modelProvider??e.providerOverride}`,e.model&&`model:${e.model}`].filter(Boolean),u=r.toolUsage?.tools.slice(0,6)??[],d;if(o?.length){d=new Map;for(let e of o.filter(({role:e})=>e===`assistant`))for(let[t,n]of Je(e.content).tools)d.set(t,(d.get(t)??0)+n)}let p=u.map(e=>({label:e.name,value:`${d?d.get(e.name)??0:a?f(`usage.common.emptyValue`):e.count}`,sub:f(`usage.overview.calls`)})),m=d?[...d.values()].reduce((e,t)=>e+t,0):a?f(`usage.common.emptyValue`):r.toolUsage?.totalCalls??0,h=d?d.size:a?f(`usage.common.emptyValue`):r.toolUsage?.uniqueTools??0,g=r.modelUsage?.slice(0,6).map(e=>({label:e.model??f(`usage.common.unknown`),value:q(e.totals.totalCost),sub:K(e.totals.totalTokens)}))??[],_=[{labelKey:`usage.overview.messages`,value:c?.total??(a?f(`usage.common.emptyValue`):0),meta:M`${a&&!c?f(`usage.common.emptyValue`):M`${c?.user??0}
            ${s(f(`usage.overview.user`))} ·
            ${c?.assistant??0}
            ${s(f(`usage.overview.assistant`))}`}${a?M`<br />${f(`usage.details.loadedIntervalMessages`)}`:F}`},{labelKey:`usage.overview.toolCalls`,value:m,meta:M`${h} ${f(`usage.overview.toolsUsed`)}`},{labelKey:`usage.overview.errors`,value:a?f(`usage.common.emptyValue`):r.messageCounts?.errors??0,meta:M`${a?f(`usage.common.emptyValue`):r.messageCounts?.toolResults??0}
      ${f(`usage.overview.toolResults`)}`},{labelKey:`usage.details.duration`,value:de(r.durationMs)??f(`usage.common.emptyValue`),meta:M`${i(r.firstActivity)} → ${i(r.lastActivity)}`}];return M`
    ${l.length>0?M`<div class="usage-badges">
            ${l.map(e=>M`<span class="settings-row__value">${e}</span>`)}
          </div>`:F}
    <div class="session-summary-grid">
      ${_.map(({labelKey:e,value:t,meta:n})=>M`
          <div class="stat session-summary-card">
            <div class="session-summary-title">${f(e)}</div>
            <div class="stat-value session-summary-value">${t}</div>
            <div class="session-summary-meta">${n}</div>
          </div>
        `)}
    </div>
    <div class="usage-insights-grid usage-insights-grid--tight">
      ${In(f(`usage.overview.topTools`),p,f(`usage.overview.noToolCalls`))}
      ${In(f(`usage.details.modelMix`),g,f(`usage.overview.noModelData`))}
    </div>
  `}function Hn(){return(Hn=e((()=>{I(),h(),ce(),x(),We(),J(),Bn()})))()}function Un(e,t,n){let r=Number(e.slice(0,4)),i=Number(e.slice(5,7))-1,a=Number(e.slice(8,10))+n;return t===`utc`?Date.UTC(r,i,a):new Date(r,i,a).getTime()}function Wn(e,t,n,i,a,o,c,l,u,d,p=`local`,m,h,g){if((t||n.awaitingGateway)&&!n.hasLoaded)return M`
      <div class="session-timeseries-compact">
        <div class="usage-empty-block">${f(`usage.loading.badge`)}</div>
      </div>
    `;let _=vt(n,`usage.details.usageOverTime`,`timeline`);if(n.error&&!n.hasLoaded)return M`
      <div class="session-timeseries-compact">
        <div class="card-title usage-section-title">${f(`usage.details.usageOverTime`)}</div>
        ${_}
      </div>
    `;if(!e||e.points.length<2)return M`
      <div class="session-timeseries-compact">
        ${_}
        <div class="usage-empty-block">${f(`usage.details.noTimeline`)}</div>
      </div>
    `;let v=e.points;if(l||u||d&&d.length>0){let t=l?Un(l,p,0):0,n=u?Un(u,p,1):1/0,r=d?.length?new Set(d):void 0;v=e.points.filter(e=>e.timestamp<t||e.timestamp>=n?!1:!r||r.has(Yt(new Date(e.timestamp),p)))}if(v.length<2)return M`
      <div class="session-timeseries-compact">
        ${_}
        <div class="usage-empty-block">${f(`usage.details.noDataInRange`)}</div>
      </div>
    `;let y=0,b=0;v=v.map(e=>(y+=e.totalTokens,b+=e.cost,{...e,cumulativeTokens:y,cumulativeCost:b}));let x=m!=null&&h!=null,S=x?Math.min(m,h):0,C=x?Math.max(m,h):1/0,w=0,T=v.length;if(x){w=v.findIndex(e=>e.timestamp>=S),w===-1&&(w=v.length);let e=v.findIndex(e=>e.timestamp>C);T=e===-1?v.length:e}let ee=x?v.slice(w,T):v,E={output:0,input:0,cacheRead:0,cacheWrite:0};for(let e of ee)for(let{key:t}of X)E[t]+=e[t];let D={top:8,right:4,bottom:14,left:30},O=400-D.left-D.right,j=100-D.top-D.bottom,N=i===`cumulative`,P=i===`per-turn`&&o===`by-type`,I=p===`utc`?{timeZone:`UTC`}:{},L=A({month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`,...I},``),R=Object.values(E).reduce((e,t)=>e+t,0),z=v.map(e=>N?e.cumulativeTokens:P?e.input+e.output+e.cacheRead+e.cacheWrite:e.totalTokens),te=Math.max(...z,1),ne=O/v.length,V=Math.min(Kn,Math.max(1,ne*Gn)),H=ne-V,U=D.left+w*(V+H),re=T>=v.length?D.left+(v.length-1)*(V+H)+V:D.left+(T-1)*(V+H)+V,ie=r(v[0],`time series first point`).timestamp,ae=r(v.at(-1),`time series last point`).timestamp,W=Math.max(ie,Math.min(ae,S)),G=Math.max(ie,Math.min(ae,C)),oe=(e,t)=>{g?.(e===`left`?Math.max(ie,Math.min(t,G)):W,e===`right`?Math.min(ae,Math.max(t,W)):G)},se=(e,t)=>{let n=t===`left`?W:G,r=t===`left`?ie:W,i=t===`left`?G:ae,a;switch(e.key){case`ArrowLeft`:case`ArrowDown`:a=v.findLast(e=>e.timestamp<n)?.timestamp??r;break;case`ArrowRight`:case`ArrowUp`:a=v.find(e=>e.timestamp>n)?.timestamp??i;break;case`Home`:a=r;break;case`End`:a=i;break;default:return}e.preventDefault(),oe(t,a)};return M`
    <div class="session-timeseries-compact">
      <div class="timeseries-header-row">
        <div class="card-title usage-section-title">${f(`usage.details.usageOverTime`)}</div>
        <div class="timeseries-controls">
          ${x?M`
                  <div class="settings-segmented settings-segmented--accent small">
                    <button
                      class="btn btn--sm settings-segmented__btn settings-segmented__btn--active"
                      @click=${()=>g?.(null,null)}
                    >
                      ${f(`usage.details.reset`)}
                    </button>
                  </div>
                `:F}
          ${Ce({mode:`buttons`,variant:`accent`,className:`small`,value:i,onChange:a,onReselect:a,options:[{value:`per-turn`,label:f(`usage.details.perTurn`)},{value:`cumulative`,label:f(`usage.details.cumulative`)}]})}
          ${N?F:Ce({mode:`buttons`,variant:`accent`,className:`small`,value:o,onChange:c,onReselect:c,options:[{value:`total`,label:f(`usage.daily.total`)},{value:`by-type`,label:f(`usage.daily.byType`)}]})}
        </div>
      </div>
      ${_}
      <div class="timeseries-chart-wrapper">
        <svg viewBox="0 0 ${400} ${118}" class="timeseries-svg">
          ${[{x1:D.left,y1:D.top,x2:D.left,y2:D.top+j},{x1:D.left,y1:D.top+j,x2:400-D.right,y2:D.top+j}].map(({x1:e,y1:t,x2:n,y2:r})=>B`<line x1="${e}" y1="${t}" x2="${n}" y2="${r}" stroke="var(--border)" />`)}
          ${[{y:D.top+5,text:K(te)},{y:D.top+j,text:`0`}].map(({y:e,text:t})=>B`<text x="${D.left-4}" y="${e}" text-anchor="end" class="ts-axis-label">${t}</text>`)}
          <!-- X axis labels (first and last) -->
          ${B`
            <text x="${D.left}" y="${D.top+j+10}" text-anchor="start" class="ts-axis-label">${k(r(v[0],`time series first point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...I},``)}</text>
            <text x="${400-D.right}" y="${D.top+j+10}" text-anchor="end" class="ts-axis-label">${k(r(v.at(-1),`time series last point`).timestamp,{hour:`2-digit`,minute:`2-digit`,...I},``)}</text>
          `}
          <!-- Bars -->
          ${v.map((e,t)=>{let n=r(z[t],`time series bar total`),i=D.left+t*(V+H),a=n/te*j,o=D.top+j-a,c=[L(e.timestamp),`${K(n)} ${s(f(`usage.metrics.tokens`))}`];P&&c.push(...X.map(({key:t,short:n})=>`${n} ${K(e[t])}`));let l=c.join(` · `),u=x&&(t<w||t>=T);if(!P)return B`<rect x="${i}" y="${o}" width="${V}" height="${a}" class="ts-bar${u?` dimmed`:``}" rx="1" role="img" data-tooltip=${l} aria-label=${l}></rect>`;let d=D.top+j,p=u?` dimmed`:``;return B`
              ${X.map(({key:t,className:r})=>{let o=e[t];if(o<=0||n<=0)return F;let s=o/n*a;return d-=s,B`<rect x="${i}" y="${d}" width="${V}" height="${s}" class="ts-bar ${r}${p}" rx="1" role="img" data-tooltip=${l} aria-label=${l}></rect>`})}
            `})}
          <!-- Selection highlight overlay (always visible between handles) -->
          ${B`
            <rect
              x="${U}"
              y="${D.top}"
              width="${Math.max(1,re-U)}"
              height="${j}"
              fill="var(--accent)"
              opacity="${qn}"
              pointer-events="none"
            />
          `}
          ${[U,re].map(e=>B`
              <line x1="${e}" y1="${D.top}" x2="${e}" y2="${D.top+j}" stroke="var(--accent)" stroke-width="0.8" opacity="0.7" />
              <rect x="${e-Jn/2}" y="${D.top+j/2-Yn/2}" width="${Jn}" height="${Yn}" rx="1.5" fill="var(--accent)" class="cursor-handle" />
              ${[-.7,Xn].map(t=>B`<line x1="${e+t}" y1="${D.top+j/2-Yn/5}" x2="${e+t}" y2="${D.top+j/2+Yn/5}" stroke="var(--bg)" stroke-width="0.4" pointer-events="none" />`)}
            `)}
        </svg>
        <!-- Handle drag zones (only on handles, not full chart) -->
        ${(()=>{let e=e=>t=>{if(!g||!(t.currentTarget instanceof HTMLElement))return;t.preventDefault(),t.stopPropagation();let n=t.currentTarget.closest(`.timeseries-chart-wrapper`)?.querySelector(`svg`);if(!n)return;let r=n.getBoundingClientRect(),i=r.width,a=D.left/400*i,o=(400-D.right)/400*i-a,s=e=>{let t=Math.max(0,Math.min(1,(e-r.left-a)/o));return Math.min(Math.floor(t*v.length),v.length-1)},c=e===`left`?U:re,l=r.left+c/400*i,u=t.clientX-l;document.body.style.cursor=`col-resize`;let d=t=>{let n=t.clientX-u,r=s(n),i=v[r];i&&oe(e,i.timestamp)},f=()=>{document.body.style.cursor=``,document.removeEventListener(`mousemove`,d),document.removeEventListener(`mouseup`,f)};document.addEventListener(`mousemove`,d),document.addEventListener(`mouseup`,f)};return M`
            ${[`left`,`right`].map(t=>{let n=t===`left`?U:re;return M`<div
                class="chart-handle-zone chart-handle-${t}"
                role="slider"
                tabindex="0"
                aria-label=${f(t===`left`?`usage.details.rangeStart`:`usage.details.rangeEnd`)}
                aria-valuemin=${t===`left`?ie:W}
                aria-valuemax=${t===`left`?G:ae}
                aria-valuenow=${t===`left`?W:G}
                aria-valuetext=${L(t===`left`?W:G)}
                style="left: ${(n/400*100).toFixed(1)}%;"
                @mousedown=${e(t)}
                @keydown=${e=>se(e,t)}
              ></div>`})}
          `})()}
      </div>
      <div class="timeseries-summary">
        ${x?M`
                <span class="timeseries-summary__range">
                  ${f(`usage.details.turnRange`,{start:String(w+1),end:String(T),total:String(v.length)})}
                </span>
                ·
                ${k(S,{hour:`2-digit`,minute:`2-digit`,...I},``)}–${k(C,{hour:`2-digit`,minute:`2-digit`,...I},``)}
                · ${K(R)} ·
                ${q(ee.reduce((e,t)=>e+(t.cost||0),0))}
              `:M`${v.length} ${f(`usage.overview.messagesAbbrev`)} ·
              ${K(y)} · ${q(b)}`}
      </div>
      ${P?M`
              <div class="timeseries-breakdown">
                <div class="card-title usage-section-title">
                  ${f(`usage.breakdown.tokensByType`)}
                </div>
                <div class="cost-breakdown-bar cost-breakdown-bar--compact">
                  ${X.map(({key:e,className:t})=>M`
                      <div
                        class="cost-segment ${t}"
                        style="width: ${(R>0?E[e]/R*100:0).toFixed(1)}%"
                      ></div>
                    `)}
                </div>
                <div class="cost-breakdown-legend">
                  ${X.map(({key:e,className:t,labelKey:n,hintKey:r})=>M`
                      <div class="legend-item" title=${f(r)}>
                        <span class="legend-dot ${t}"></span>${f(n)}
                        ${K(E[e])}
                      </div>
                    `)}
                </div>
                <div class="cost-breakdown-total">
                  ${f(`usage.breakdown.total`)}: ${K(R)}
                </div>
              </div>
            `:F}
    </div>
  `}var Gn,Kn,qn,Jn,Yn,Xn;function Zn(){return(Zn=e((()=>{a(),I(),Se(),h(),x(),J(),yt(),Dn(),Gn=.75,Kn=8,qn=.06,Jn=5,Yn=12,Xn=.7})))()}function Qn(e,t){return t>0?e/t*100:0}function $n(e){return e<0xe8d4a51000?e*1e3:e}function er(e,t,n){if(!(e.timestamp>0))return!0;let r=$n(e.timestamp);return r>=Math.min(t,n)&&r<=Math.max(t,n)}function tr(e,t,n,i){let a=Math.min(n,i),o=Math.max(n,i),s=t.filter(e=>e.timestamp>=a&&e.timestamp<=o);if(s.length===0)return;let c=0,l=0,u={output:0,input:0,cacheWrite:0,cacheRead:0};for(let e of s){c+=e.totalTokens||0,l+=e.cost||0;for(let{key:t}of X)u[t]+=e[t]||0}let d=r(s[0],`filtered usage first point`),f=r(s.at(-1),`filtered usage last point`);return{...e,...u,totalTokens:c,totalCost:l,durationMs:f.timestamp-d.timestamp,firstActivity:d.timestamp,lastActivity:f.timestamp,messageCounts:void 0}}function nr(e,t,r,i,a,o,c,l,u,d,p,m,h,g,_,v,y,b,x,S,C,w,T,ee,E,D,O,k,A,j){let N=e.label||e.key,P=N.length>50?n(N,50)+`…`:N,I=e.usage,L=u!==null&&d!==null,R=u!==null&&d!==null&&t?.points&&I?tr(I,t.points,u,d):void 0,z=R?{totalTokens:R.totalTokens,totalCost:R.totalCost}:{totalTokens:I?.totalTokens??0,totalCost:I?.totalCost??0},B=R?f(`usage.details.filtered`):``;return M`
    <div class="settings-group usage-panel session-detail-panel">
      <div class="session-detail-header">
        <div class="session-detail-header-left">
          <div class="session-detail-title">
            ${P}
            ${B?M`<span class="session-detail-indicator">${B}</span>`:F}
          </div>
        </div>
        <div class="session-detail-stats">
          ${I?M`
                  <span
                    ><strong>${K(z.totalTokens)}</strong>
                    ${s(f(`usage.metrics.tokens`))}${B}</span
                  >
                  <span
                    ><strong>${q(z.totalCost)}</strong
                    >${B}</span
                  >
                `:F}
        </div>
        <testclaw-tooltip .content=${f(`usage.details.close`)}>
          <button
            class="btn btn--sm btn--ghost"
            @click=${j}
            aria-label=${f(`usage.details.close`)}
          >
            ×
          </button>
        </testclaw-tooltip>
      </div>
      ${e.scope===`family`&&e.includedSessionIds?.length?M`
              <div class="usage-lineage-note">
                ${f(`usage.scope.familyIncluded`,{count:String(e.includedSessionIds.length)})}
              </div>
            `:F}
      <div class="session-detail-content">
        ${Vn(e,R,L?b.hasLoaded&&v?v.filter(e=>er(e,u,d)):null:void 0)}
        <div class="session-detail-row">
          ${Wn(t,r,i,a,o,c,l,m,h,g,_,u,d,p)}
        </div>
        <div class="session-detail-bottom">
          ${ir(v,y,b,x,S,C,w,T,ee,E,D,L?u:null,L?d:null)}
          ${rr(O,I,k,A)}
        </div>
      </div>
    </div>
  `}function rr({weight:e,loading:t,status:n},r,i,a){let o=vt(n,`usage.details.systemPromptBreakdown`,`context`);if(!e)return M`
      <div class="context-details-panel">
        ${o}
        ${n.error?F:M`<div class="usage-empty-block">
                ${f(t||n.awaitingGateway?`usage.loading.badge`:`usage.details.noContextData`)}
              </div>`}
      </div>
    `;let s=[{className:`skills`,labelKey:`usage.details.skills`,tokens:Ft(e.skills.promptChars),entries:e.skills.entries.map(({name:e,blockChars:t})=>({name:e,chars:t}))},{className:`tools`,labelKey:`usage.details.tools`,tokens:Ft(e.tools.listChars+e.tools.schemaChars),entries:e.tools.entries.map(({name:e,summaryChars:t,schemaChars:n})=>({name:e,chars:t+n}))},{className:`files`,labelKey:`usage.details.files`,tokens:Ft(e.injectedWorkspaceFiles.reduce((e,t)=>t.injectionStatus===`native_unverified`?e:e+t.injectedChars,0)),entries:e.injectedWorkspaceFiles.map(({name:e,injectedChars:t})=>({name:e,chars:t}))}].map(({className:e,labelKey:t,tokens:n,entries:r})=>({className:e,labelKey:t,tokens:n,entries:r.toSorted((e,t)=>e.chars===null?t.chars===null?0:1:t.chars===null?-1:t.chars-e.chars)})),c=[{className:`system`,labelKey:`usage.details.system`,tokens:Ft(e.systemPrompt.chars)},...s],l=c.reduce((e,{tokens:t})=>e+t,0),u=r&&r.totalTokens>0?r.input+r.cacheRead:0,d=u>0?`~${Math.min(l/u*100,100).toFixed(0)}% ${f(`usage.details.ofInput`)}`:f(`usage.details.baseContextPerMessage`),p=s.some(({entries:e})=>e.length>4);return M`
    <div class="context-details-panel">
      ${o}
      <div class="context-breakdown-header">
        <div class="card-title usage-section-title">
          ${f(`usage.details.systemPromptBreakdown`)}
        </div>
        ${p?M`<button class="btn btn--sm" @click=${a}>
                ${f(i?`usage.details.collapse`:`usage.details.expandAll`)}
              </button>`:F}
      </div>
      <p class="context-weight-desc">${d}</p>
      <div class="context-stacked-bar">
        ${c.map(({className:e,labelKey:t,tokens:n})=>M`
            <div
              class="context-segment ${e}"
              style="width: ${Qn(n,l).toFixed(1)}%"
              title="${f(t)}: ~${K(n)}"
            ></div>
          `)}
      </div>
      <div class="context-legend">
        ${c.map(({className:e,labelKey:t,tokens:n})=>M`
            <span class="legend-item"
              ><span class="legend-dot ${e}"></span>${f(e===`system`?`usage.details.systemShort`:t)}
              ~${K(n)}</span
            >
          `)}
      </div>
      <div class="context-total">
        ${f(`usage.breakdown.total`)}: ~${K(l)}
      </div>
      <div class="context-breakdown-grid">
        ${s.filter(({entries:e})=>e.length>0).map(({labelKey:e,entries:t})=>{let n=i?t:t.slice(0,4),r=t.length-n.length;return M`
              <div class="context-breakdown-card">
                <div class="context-breakdown-title">${f(e)} (${t.length})</div>
                <div class="context-breakdown-list">
                  ${n.map(({name:e,chars:t})=>M`
                      <div class="context-breakdown-item">
                        <span class="mono" title=${e}>${e}</span>
                        <span class="muted"
                          >${t===null?f(`usage.common.unknown`):`~${K(Ft(t))}`}</span
                        >
                      </div>
                    `)}
                </div>
                ${r>0?M`
                        <div class="context-breakdown-more">
                          ${f(`usage.sessions.more`,{count:String(r)})}
                        </div>
                      `:F}
              </div>
            `})}
      </div>
    </div>
  `}function ir(e,t,n,r,i,a,o,c,l,u,d,p,m){if((t||n.awaitingGateway)&&!n.hasLoaded)return M`
      <div class="session-logs-compact">
        <div class="session-logs-header">${f(`usage.details.conversation`)}</div>
        <div class="usage-empty-block">${f(`usage.loading.badge`)}</div>
      </div>
    `;let h=vt(n,`usage.details.conversation`,`conversation`);if(n.error&&!n.hasLoaded)return M`
      <div class="session-logs-compact">
        <div class="session-logs-header">${f(`usage.details.conversation`)}</div>
        ${h}
      </div>
    `;if(!e||e.length===0)return M`
      <div class="session-logs-compact">
        <div class="session-logs-header">${f(`usage.details.conversation`)}</div>
        ${h}
        <div class="usage-empty-block">${f(`usage.details.noMessages`)}</div>
      </div>
    `;let g=A(),_=s(a.query),v=e.map(e=>{let t=Je(e.content);return{log:e,toolInfo:t,cleanContent:t.cleanContent||e.content}}),y=Array.from(new Set(v.flatMap(e=>e.toolInfo.tools.map(([e])=>e)))).toSorted((e,t)=>e.localeCompare(t)),b=p!=null&&m!=null,x=v.filter(e=>(!b||er(e.log,p,m))&&(a.roles.length===0||a.roles.includes(e.log.role))&&(!a.hasTools||e.toolInfo.tools.length>0)&&(a.tools.length===0||e.toolInfo.tools.some(([e])=>a.tools.includes(e)))&&(!_||s(e.cleanContent).includes(_))),S=a.roles.length>0||a.tools.length>0||a.hasTools||_||b?`${x.length} ${f(`usage.details.of`)} ${e.length}${b?` (${f(`usage.details.timelineFiltered`)})`:``}`:`${e.length}`,C=new Set(a.roles),w=new Set(a.tools);return M`
    <div class="session-logs-compact">
      <div class="session-logs-header">
        <span>
          ${f(`usage.details.conversation`)}
          <span class="session-logs-header-count">
            (${S} ${s(f(`usage.overview.messages`))})
          </span>
        </span>
        <button class="btn btn--sm" @click=${i}>
          ${f(r?`usage.details.collapseAll`:`usage.details.expandAll`)}
        </button>
      </div>
      ${h}
      <div class="usage-filters-inline session-log-filters">
        <select
          multiple
          size="4"
          aria-label=${f(`usage.details.filterByRole`)}
          @change=${e=>o(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${[[`user`,`usage.overview.user`],[`assistant`,`usage.overview.assistant`],[`tool`,`usage.details.tool`],[`toolResult`,`usage.details.toolResult`]].map(([e,t])=>M`<option value=${e} ?selected=${C.has(e)}>
                ${f(t)}
              </option>`)}
        </select>
        <select
          multiple
          size="4"
          aria-label=${f(`usage.details.filterByTool`)}
          @change=${e=>c(Array.from(e.target.selectedOptions).map(e=>e.value))}
        >
          ${y.map(e=>M`<option value=${e} ?selected=${w.has(e)}>${e}</option>`)}
        </select>
        <label class="usage-filters-inline session-log-has-tools">
          <input
            type="checkbox"
            .checked=${a.hasTools}
            @change=${e=>l(e.target.checked)}
          />
          ${f(`usage.details.hasTools`)}
        </label>
        <input
          type="text"
          placeholder=${f(`usage.details.searchConversation`)}
          aria-label=${f(`usage.details.searchConversation`)}
          .value=${a.query}
          @input=${e=>u(e.target.value)}
        />
        <button class="btn btn--sm" @click=${d}>${f(`usage.filters.clear`)}</button>
      </div>
      <div class="session-logs-list">
        ${x.map(e=>{let{log:t,toolInfo:n,cleanContent:i}=e,a=t.role===`user`?`user`:`assistant`,o=t.role===`user`?f(`usage.details.you`):t.role===`assistant`?f(`usage.overview.assistant`):f(`usage.details.tool`);return M`
            <div class="session-log-entry ${a}">
              <div class="session-log-meta">
                <span class="session-log-role">${o}</span>
                <span>${g(t.timestamp)}</span>
                ${t.tokens?M`<span>${K(t.tokens)}</span>`:F}
              </div>
              <div class="session-log-content">${i}</div>
              ${n.tools.length>0?M`
                      <details class="session-log-tools" ?open=${r}>
                        <summary>${n.summary}</summary>
                        <div class="session-log-tools-list">
                          ${n.tools.map(([e,t])=>M`
                              <span class="session-log-tools-pill">${e} × ${t}</span>
                            `)}
                        </div>
                      </details>
                    `:F}
            </div>
          `})}
        ${x.length===0?M`
                <div class="usage-empty-block usage-empty-block--compact">
                  ${f(`usage.details.noMessagesMatch`)}
                </div>
              `:F}
      </div>
    </div>
  `}function ar(){return(ar=e((()=>{a(),I(),h(),H(),x(),We(),J(),yt(),Dn(),Hn(),Zn()})))()}function or(e){return new Date(`${e}T12:00:00Z`).getTime()}function sr(e){return new Date(e).toISOString().slice(0,10)}function cr(e){let t=e.toSorted((e,t)=>e-t),n=e=>t[Math.min(t.length-1,Math.floor(t.length*e))]??0;return[n(.25),n(.5),n(.75)]}function lr(e,t){return e<=0?0:e<t[0]?1:e<t[1]?2:e<t[2]?3:4}function ur(e,t,n,r){let i=or(n),a=Math.max(or(t),i-363*dr),o=new Map(e.map(e=>[e.date,e.totalTokens])),s=e.filter(e=>{let t=or(e.date);return e.totalTokens>0&&t>=a&&t<=i}).map(e=>e.totalTokens),c=s.length>0?cr(s):[0,0,0],l=a-new Date(a).getUTCDay()*dr,u=new Intl.DateTimeFormat(r,{month:`short`,timeZone:`UTC`}),d=[],f=[],p=-1;for(let e=l;e<=i;e+=7*dr){let t=[];for(let n=0;n<7;n+=1){let r=e+n*dr;if(r<a||r>i){t.push(null);continue}let s=sr(r),l=o.get(s)??0;t.push({date:s,tokens:l,level:lr(l,c)})}d.push({days:t});let r=or(t.find(e=>e!==null)?.date??n),s=new Date(r).getUTCMonth();f.push(s===p?``:u.format(new Date(r))),p=s}return{weeks:d,monthLabels:f}}var dr;function fr(){return(fr=e((()=>{dr=864e5})))()}function pr(e){let t=_r+e.weeks.length*gr,n=new Intl.NumberFormat(void 0,{maximumFractionDigits:0}),r=new Intl.DateTimeFormat(void 0,{weekday:`short`,timeZone:`UTC`});return M`
    <svg
      class="usage-heatmap__svg"
      viewBox="0 0 ${t} ${116}"
      style="--usage-heatmap-width: ${t}px"
      role="group"
      aria-label=${f(`usage.heatmap.title`)}
    >
      ${e.monthLabels.map((e,t)=>e?B`<text class="usage-heatmap__month" x=${_r+t*gr} y="10">${e}</text>`:F)}
      ${yr.map(({row:e,utcDay:t})=>B`<text class="usage-heatmap__weekday" x=${24} y=${vr+e*gr+hr-2}>${r.format(new Date(t))}</text>`)}
      ${e.weeks.map((e,t)=>e.days.map((e,r)=>{if(!e)return F;let i=`${en(e.date)} · ${f(`usage.heatmap.cellTokens`,{tokens:n.format(e.tokens)})}`;return B`
            <rect
              class="usage-heatmap__cell usage-heatmap__cell--l${e.level}"
              x=${_r+t*gr}
              y=${vr+r*gr}
              width=${hr}
              height=${hr}
              rx="2.5"
              role="img"
              data-tooltip=${i}
              aria-label=${i}
            ></rect>
          `}))}
    </svg>
  `}function mr(e,t,n){if(e.length===0)return F;let r=ur(e,t,n),i=M`
    <div class="usage-heatmap__legend" aria-hidden="true">
      <span>${f(`usage.heatmap.less`)}</span>
      ${[0,1,2,3,4].map(e=>M`<span class="usage-heatmap__swatch usage-heatmap__cell--l${e}"></span>`)}
      <span>${f(`usage.heatmap.more`)}</span>
    </div>
  `;return he({title:f(`usage.heatmap.title`),description:f(`usage.heatmap.subtitle`),actions:i},M`<div class="usage-panel usage-heatmap">${pr(r)}</div>`)}var hr,gr,_r,vr,yr;function br(){return(br=e((()=>{I(),Se(),h(),fr(),J(),hr=11,gr=14,_r=30,vr=18,yr=[{row:1,utcDay:Date.UTC(2024,0,1)},{row:3,utcDay:Date.UTC(2024,0,3)},{row:5,utcDay:Date.UTC(2024,0,5)}]})))()}function xr(e,t,n,r,i){if(n.length===0)return F;let a=Y(e),o=Xe(r).filter(e=>Y(e.key??``)===a).map(e=>e.value).filter(Boolean),s=new Set(o.map(e=>Y(e))),c=n.length>0&&n.every(e=>s.has(Y(e))),l=o.length;return M`
    <wa-dropdown
      class="usage-filter-select"
      placement="bottom-start"
      @wa-select=${t=>{t.preventDefault();let a=t.detail.item.value;if(a===`command:select-all`){i(vn(r,e,n));return}if(a===`command:clear`){i(vn(r,e,[]));return}if(a?.startsWith(`option:`)){let n=decodeURIComponent(a.slice(7));i(vn(r,e,t.detail.item.checked?[...o,n]:o.filter(e=>Y(e)!==Y(n))))}}}
    >
      <button slot="trigger" type="button" class="usage-filter-trigger">
        <span>${t}</span>
        ${l>0?M`<span class="settings-count">${l}</span>`:M` <span class="settings-count">${f(`usage.filters.all`)}</span> `}
      </button>
      <wa-dropdown-item value="command:select-all" ?disabled=${c}>
        ${f(`usage.filters.selectAll`)}
      </wa-dropdown-item>
      <wa-dropdown-item value="command:clear" ?disabled=${l===0}>
        ${f(`usage.filters.clear`)}
      </wa-dropdown-item>
      <div class="session-menu__separator" role="separator"></div>
      ${n.map(e=>{let t=s.has(Y(e));return M`
          <wa-dropdown-item
            class="usage-filter-option"
            type="checkbox"
            value=${`option:${encodeURIComponent(e)}`}
            .checked=${t}
          >
            ${e}
          </wa-dropdown-item>
        `})}
    </wa-dropdown>
  `}function Sr(){return(Sr=e((()=>{I(),h(),We(),yn()})))()}function Cr(e,t,n){let r=n?M`<div class="callout warning usage-callout">${f(`usage.providerUsage.stalled`)}</div>`:t?M`<div class="callout warning usage-callout">
          ${f(`usage.providerUsage.unavailable`)}
        </div>`:F;return e.length===0?r:he({title:f(`usage.providerUsage.title`),count:e.length,description:f(`usage.providerUsage.subtitle`)},M`
      ${r}
      <div class="usage-panel provider-usage-section">
        <div class="provider-usage-grid">
          ${e.map(e=>M`
              <article class="provider-usage-card">
                <div class="provider-usage-card__header">
                  <div>
                    <div class="provider-usage-card__name">${e.displayName}</div>
                    <div class="provider-usage-card__id">${e.provider}</div>
                  </div>
                  ${e.plan?M`<span class="provider-usage-plan">${e.plan}</span>`:F}
                </div>
                ${Ve(e)}
              </article>
            `)}
        </div>
      </div>
    `)}function wr(e){let{data:t,filters:n,display:r,detail:i,callbacks:a}=e,o=a.filters,s=a.display,c=a.details,l=t.cacheRefresh!==`complete`&&!t.totals?.totalTokens&&!t.totals?.totalCost&&!t.sessions.some(e=>e.usage?.totalTokens||e.usage?.totalCost)&&!t.costDaily.some(e=>e.totalTokens||e.totalCost),u=!l&&!!(t.totals||t.sessions.length||t.costDaily.length),d=t.loading||l&&t.cacheRefresh===`retrying`,p=r.chartMode===`tokens`,m=n.query.trim().length>0,h=n.queryDraft.trim().length>0,g=new Set(n.selectedDays),_=new Set(n.selectedSessions),v=t.sessions.toSorted((e,t)=>{let n=p?e.usage?.totalTokens??0:e.usage?.totalCost??0;return(p?t.usage?.totalTokens??0:t.usage?.totalCost??0)-n}),y=n.selectedHours.length>0?v.filter(e=>Kt(e,n.selectedHours,n.timeZone)):v,b=Qe(y,n.query),x=e=>g.size===0?!0:e.usage?.activityDates?.length?e.usage.activityDates.some(e=>g.has(e)):!!(e.updatedAt&&g.has(Yt(new Date(e.updatedAt),n.timeZone))),S=b.sessions.filter(x),C=b.warnings,w=fn(v,t.aggregates),T=hn(n.queryDraft,w),ee=Xe(n.queryDraft),E=n.selectedSessions.length===1?t.sessions.find(e=>e.key===n.selectedSessions[0])??S.find(e=>e.key===n.selectedSessions[0]):null,D=_.size?b.sessions.filter(e=>_.has(e.key)):b.sessions,O=D.filter(x),k=_.size>0||m||n.selectedHours.length>0,A=k||g.size>0,j=e=>{let t=St();for(let n of e)n&&Ct(t,n);return t},N=k?(()=>{let e=new Map;for(let t of D)for(let n of t.usage?.dailyBreakdown??[]){let t=e.get(n.date)??St();Ct(t,n),e.set(n.date,t)}return Array.from(e,([e,t])=>({date:e,...t})).toSorted((e,t)=>e.date.localeCompare(t.date))})():t.costDaily,P=u?g.size?j(N.filter(e=>g.has(e.date))):k?j(O.map(e=>e.usage)):t.totals:null,I=t.aggregates?.sessionCount??v.length,L=A?on(O):on([],t.aggregates),R=k?void 0:t.aggregates?.byCreator;g.size>0&&(L.byCreator=(R??L.byCreator??[]).flatMap(e=>{let t=e.daily.filter(e=>g.has(e.date)),n=e.sessionActivity.flatMap(e=>{let t=e.dates.filter(e=>g.has(e));return t.length?[{dates:t,sessionCount:e.sessionCount}]:[]}),r=n.reduce((e,t)=>e+t.sessionCount,0),i=j(t);return r||i.totalTokens||i.totalCost?[{...e,totals:i,sessionCount:r,daily:t,sessionActivity:n}]:[]}));let z=g.size>0&&R?(L.byCreator??[]).reduce((e,t)=>e+t.sessionCount,0):A?O.length:t.aggregates?.sessionCount??O.length;g.size>0&&R&&(L.sessionCount=z);let B=t.sessionsLimitReached&&!A,te=B?j(O.map(e=>e.usage)):P,ne=B?on(O):L,V=A?F:Fn(t.costDaily,n.startDate,n.endDate,n.timeZone),H=sn(O,te,ne),U=t.cacheRefresh===`complete`&&t.totals!==null&&!t.loading&&!t.error&&t.sessions.length===0&&(t.totals?.totalTokens??0)===0,re=(P?.missingCostEntries??0)>0,ie=[{label:f(`usage.presets.today`),days:1},{label:f(`usage.presets.last7d`),days:7},{label:f(`usage.presets.last30d`),days:30},{label:f(`usage.presets.last90d`),days:90},{label:f(`usage.presets.last1y`),days:365}],ae=e=>{let t=new Date,r=new Date(t);return n.timeZone===`utc`?r.setUTCDate(r.getUTCDate()-(e-1)):r.setDate(r.getDate()-(e-1)),{start:Yt(r,n.timeZone),end:Yt(t,n.timeZone)}},G=e=>{let t=ae(e);return n.startDate===t.start&&n.endDate===t.end},oe=e=>{let t=ae(e);o.onStartDateChange(t.start),o.onEndDateChange(t.end)},se=()=>{o.onStartDateChange(`1970-01-01`),o.onEndDateChange(Yt(new Date,n.timeZone))},ce=Yt(new Date);return De(M`
      <div class="usage-page">
        <section class="settings-section">
          <div class="settings-section__header">
            <h2 class="settings-section__heading">${f(`usage.filters.rangeTitle`)}</h2>
            <div class="settings-section__actions">
              ${d?gt(f(`usage.loading.badge`)):F}
              ${U?M`<span class="usage-query-hint">${f(`usage.empty.hint`)}</span>`:F}
            </div>
          </div>
          <div
            class="settings-group usage-panel usage-header ${r.headerPinned?`pinned`:``}"
          >
            <div class="usage-header-row">
              <div class="usage-controls">
                ${Pn(n.selectedDays,n.selectedHours,n.selectedSessions,t.sessions,o.onClearDays,o.onClearHours,o.onClearSessions,o.onClearFilters)}
                <div class="usage-presets">
                  ${ie.map(e=>M`
                      <button
                        class="btn btn--sm ${G(e.days)?`active`:``}"
                        aria-pressed=${G(e.days)}
                        @click=${()=>oe(e.days)}
                      >
                        ${e.label}
                      </button>
                    `)}
                  <button
                    class="btn btn--sm ${n.startDate===`1970-01-01`?`active`:``}"
                    aria-pressed=${n.startDate===`1970-01-01`}
                    @click=${se}
                  >
                    ${f(`usage.presets.all`)}
                  </button>
                </div>
                <div class="usage-date-range">
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.startDate}
                    title=${f(`usage.filters.startDate`)}
                    aria-label=${f(`usage.filters.startDate`)}
                    @change=${e=>o.onStartDateChange(e.target.value)}
                  />
                  <span class="usage-separator">${f(`usage.filters.to`)}</span>
                  <input
                    class="usage-date-input"
                    type="date"
                    .value=${n.endDate}
                    title=${f(`usage.filters.endDate`)}
                    aria-label=${f(`usage.filters.endDate`)}
                    @change=${e=>o.onEndDateChange(e.target.value)}
                  />
                </div>
                <select
                  class="usage-select"
                  title=${f(`usage.filters.timeZone`)}
                  aria-label=${f(`usage.filters.timeZone`)}
                  .value=${n.timeZone}
                  @change=${e=>o.onTimeZoneChange(e.target.value)}
                >
                  <option value="local">${f(`usage.filters.timeZoneLocal`)}</option>
                  <option value="utc">${f(`usage.filters.timeZoneUtc`)}</option>
                </select>
              </div>
              <div class="usage-view-options">
                ${kn({options:t.creatorOptions,selectedKey:n.creatorKey,onSelect:o.onCreatorChange})}
                ${Ce({mode:`buttons`,variant:`accent`,value:n.scope,onChange:o.onScopeChange,onReselect:o.onScopeChange,options:[{value:`instance`,label:f(`usage.scope.instance`),title:f(`usage.scope.instanceHint`)},{value:`family`,label:f(`usage.scope.family`),title:f(`usage.scope.familyHint`)}]})}
                ${Ce({mode:`buttons`,variant:`accent`,value:p?`tokens`:`cost`,onChange:s.onChartModeChange,onReselect:s.onChartModeChange,options:[{value:`tokens`,label:f(`usage.metrics.tokens`)},{value:`cost`,label:f(`usage.metrics.cost`)}]})}
                <button
                  class="btn btn--sm primary"
                  @click=${o.onRefresh}
                  ?disabled=${t.loading}
                >
                  ${f(`common.refresh`)}
                </button>
              </div>
            </div>

            <div class="usage-header-row">
              <div class="usage-header-metrics">
                ${P?M`
                        <span class="usage-metric-badge">
                          <strong>${K(P.totalTokens)}</strong>
                          ${f(`usage.metrics.tokens`)}
                        </span>
                        <span class="usage-metric-badge">
                          <strong>${q(P.totalCost)}</strong>
                          ${f(`usage.metrics.cost`)}
                        </span>
                        <span class="usage-metric-badge">
                          <strong>${z}</strong>
                          ${f(z===1?`usage.metrics.session`:`usage.metrics.sessions`)}
                        </span>
                      `:F}
                <button
                  class="btn btn--sm usage-pin-btn ${r.headerPinned?`active`:``}"
                  @click=${o.onToggleHeaderPinned}
                >
                  ${r.headerPinned?f(`usage.filters.pinned`):f(`usage.filters.pin`)}
                </button>
                <wa-dropdown
                  class="usage-export-menu"
                  placement="bottom-end"
                  @wa-select=${e=>{switch(e.detail.item.value){case`sessions-csv`:W(`testclaw-usage-sessions-${ce}.csv`,pn(O),`text/csv;charset=utf-8`);break;case`daily-csv`:W(`testclaw-usage-daily-${ce}.csv`,mn(N),`text/csv;charset=utf-8`);break;case`json`:s.onExportJson({totals:P,sessions:O,daily:N,aggregates:L});break;case void 0:}}}
                >
                  <button
                    slot="trigger"
                    type="button"
                    class="btn btn--sm"
                    aria-busy=${t.exporting}
                  >
                    ${t.exporting?f(`common.loading`):f(`usage.export.label`)} ▾
                  </button>
                  <wa-dropdown-item
                    value="sessions-csv"
                    ?disabled=${O.length===0}
                  >
                    ${f(`usage.export.sessionsCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item value="daily-csv" ?disabled=${N.length===0}>
                    ${f(`usage.export.dailyCsv`)}
                  </wa-dropdown-item>
                  <wa-dropdown-item
                    value="json"
                    ?disabled=${t.exporting||t.loading||O.length===0&&N.length===0}
                  >
                    ${f(`usage.export.json`)}
                  </wa-dropdown-item>
                </wa-dropdown>
              </div>
            </div>

            <div class="usage-query-section">
              <div class="usage-query-bar">
                <input
                  class="usage-query-input"
                  type="text"
                  .value=${n.queryDraft}
                  aria-label=${f(`usage.query.placeholder`)}
                  placeholder=${f(`usage.query.placeholder`)}
                  @input=${e=>o.onQueryDraftChange(e.target.value)}
                  @keydown=${e=>{e.key===`Enter`&&(e.preventDefault(),o.onApplyQuery())}}
                />
                <div class="usage-query-actions">
                  <button
                    class="btn btn--sm"
                    @click=${o.onApplyQuery}
                    ?disabled=${t.loading||!h&&!m}
                  >
                    ${f(`usage.query.apply`)}
                  </button>
                  ${h||m?M`
                          <button class="btn btn--sm" @click=${o.onClearQuery}>
                            ${f(`usage.filters.clear`)}
                          </button>
                        `:F}
                  <span class="usage-query-hint">
                    ${u?m?f(`usage.query.matching`,{shown:String(S.length),total:String(I)}):f(`usage.query.inRange`,{total:String(I)}):F}
                  </span>
                </div>
              </div>
              <div class="usage-filter-row">
                ${xr(`channel`,f(`usage.filters.channel`),w.channel,n.queryDraft,o.onQueryDraftChange)}
                ${xr(`provider`,f(`usage.filters.provider`),w.provider,n.queryDraft,o.onQueryDraftChange)}
                ${xr(`model`,f(`usage.filters.model`),w.model,n.queryDraft,o.onQueryDraftChange)}
                ${xr(`tool`,f(`usage.filters.tool`),w.tool,n.queryDraft,o.onQueryDraftChange)}
                <span class="usage-query-hint">${f(`usage.query.tip`)}</span>
              </div>
              ${ee.length>0?M`
                      <div class="usage-query-chips">
                        ${ee.map(e=>{let t=e.raw;return M`
                            <span class="usage-query-chip">
                              ${t}
                              <testclaw-tooltip .content=${f(`usage.filters.remove`)}>
                                <button
                                  aria-label=${f(`usage.filters.remove`)}
                                  @click=${()=>o.onQueryDraftChange(_n(n.queryDraft,t))}
                                >
                                  ×
                                </button>
                              </testclaw-tooltip>
                            </span>
                          `})}
                      </div>
                    `:F}
              ${T.length>0?M`
                      <div class="usage-query-suggestions">
                        ${T.map(e=>M`
                            <button
                              class="usage-query-suggestion"
                              @click=${()=>o.onQueryDraftChange(gn(n.queryDraft,e.value))}
                            >
                              ${e.label}
                            </button>
                          `)}
                      </div>
                    `:F}
              ${C.length>0?M`
                      <div class="callout warning usage-callout usage-callout--tight">
                        ${C.join(` · `)}
                      </div>
                    `:F}
            </div>

            ${t.error?M`<div class="callout danger usage-callout">${t.error}</div>`:F}
            ${t.cacheRefresh===`complete`?F:M`
                    <div
                      class="callout ${t.cacheRefresh===`exhausted`?`warning`:``} usage-callout usage-cache-warning"
                      role="status"
                      aria-live="polite"
                    >
                      ${f(t.cacheRefresh===`exhausted`?`usage.cacheStatus.paused`:`usage.cacheStatus.warning`)}
                    </div>
                  `}
            ${t.sessionsLimitReached?M`
                    <div class="callout warning usage-callout">
                      ${f(`usage.sessions.limitReached`)}
                    </div>
                  `:F}
          </div>
        </section>

        ${u?U?_t(o.onRefresh):M`
                  <div class="settings-group usage-panel usage-left-card usage-trend-section">
                    ${Tn(N,n.selectedDays,r.chartMode,r.dailyChartMode,s.onDailyChartModeChange,o.onSelectDay,{startDate:n.startDate,endDate:n.endDate,complete:t.cacheRefresh===`complete`})}
                    ${P?En(P,r.chartMode):F}
                  </div>
                  ${An({groups:L.byCreator??[],selectedKey:n.creatorKey,mode:r.chartMode,onSelect:o.onCreatorChange})}
                  ${Rn(te,ne,H,re,n.selectedDays.length===0,Rt(O,n.timeZone),z,I)}
                  ${V}
                  ${mr(N,n.startDate,n.endDate)}
                  ${Jt(O,n.timeZone,n.selectedHours,o.onSelectHour)}

                  <div class="usage-grid">
                    <div class="usage-grid-column">
                      ${zn(S,n.selectedSessions,n.selectedDays,p,r.sessionSort,r.sessionSortDir,r.recentSessions,r.sessionsTab,c.onSelectSession,s.onSessionSortChange,s.onSessionSortDirChange,s.onSessionsTabChange,r.visibleColumns,I,o.onClearSessions)}
                    </div>
                    ${E?M`<div class="usage-grid-column">
                            ${nr(E,i.timeSeries,i.timeSeriesLoading,i.timeSeriesStatus,i.timeSeriesMode,c.onTimeSeriesModeChange,i.timeSeriesBreakdownMode,c.onTimeSeriesBreakdownChange,i.timeSeriesCursorStart,i.timeSeriesCursorEnd,c.onTimeSeriesCursorRangeChange,n.startDate,n.endDate,n.selectedDays,n.timeZone,i.sessionLogs,i.sessionLogsLoading,i.sessionLogsStatus,i.sessionLogsExpanded,c.onToggleSessionLogsExpanded,i.logFilters,c.onLogFilterRolesChange,c.onLogFilterToolsChange,c.onLogFilterHasToolsChange,c.onLogFilterQueryChange,c.onLogFilterClear,i.context,r.contextExpanded,c.onToggleContextExpanded,o.onClearSessions)}
                          </div>`:F}
                  </div>
                `:d?M`<div class="usage-panel usage-loading-card">
                  <div class="usage-loading-grid">
                    <div class="skeleton usage-skeleton-block usage-skeleton-block--tall"></div>
                    <div class="skeleton usage-skeleton-block"></div>
                    <div class="skeleton usage-skeleton-block"></div>
                  </div>
                </div>`:F}
        ${Cr(t.providerUsage,t.providerUsageUnavailable,t.providerUsageStalled)}
      </div>
    `,{wide:!0})}function Tr(){return(Tr=e((()=>{I(),ze(),Se(),H(),me(),h(),We(),J(),yt(),yn(),Dn(),jn(),ar(),br(),Bn(),Sr()})))()}var $,Er;function Dr(){return(Dr=e((()=>{t(),I(),z(),U(),_(),b(),Be(),le(),m(),S(),ct(),mt(),We(),yt(),Le(),$e(),xt(),Tr(),$=class extends p{constructor(...e){super(...e),this.usageSnapshot=null,this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageIncomplete=!1,this.usageError=null,this.initialDateRange=qe(),this.usageStartDate=this.initialDateRange.startDate,this.usageEndDate=this.initialDateRange.endDate,this.usageScope=`family`,this.usageAgentId=null,this.usageCreatorKey=null,this.usageSelectedSessions=[],this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageChartMode=`tokens`,this.usageDailyChartMode=`by-type`,this.usageTimeSeriesMode=`per-turn`,this.usageTimeSeriesBreakdownMode=`by-type`,this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null,this.usageSessionLogsExpanded=!1,this.usageQuery=``,this.usageQueryDraft=``,this.usageSessionSort=`recent`,this.usageSessionSortDir=`desc`,this.usageRecentSessions=[],this.usageTimeZone=`local`,this.usageContextExpanded=!1,this.usageHeaderPinned=!1,this.usageSessionsTab=`all`,this.usageVisibleColumns=[...bt],this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``,this.dateDebounceTimer=null,this.queryDebounceTimer=null,this.connectionEpoch={},this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.refreshPolicy=new Re({isLoading:()=>this.usageLoading,reload:e=>{this.clearDateDebounce();let t=e===`manual`&&this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;return this.loadUsage(t)},onIncompleteUsageExhausted:()=>this.requestUpdate()}),this.gateway=new ue(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForClientChange(),invalidateRequests:e=>{e.snapshot.phase!==`connected`&&(this.refreshPolicy.interrupt(),this.usageRequest.cancel(),this.details.cancel(),this.usageExportRequest.cancel())},onSnapshot:e=>this.handleGatewaySnapshot(e),onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.observeAgentScope=se(e=>{this.routeDataInitialized&&this.usageAgentId!==e&&(this.usageAgentId=e,this.usageCreatorKey=null,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)),this.requestUpdate()}),this.usageRequest=it(this,{task:async([e,t],{signal:n})=>{this.refreshPolicy.beginLoad();let r=this.connectionEpoch,i=this.currentQuery;return{epoch:r,query:i,refreshSessionKey:t,snapshot:await Ze(e,i,n)}},onComplete:e=>{let t=e.snapshot,n=this.isCurrentQuery(e.query);if(n&&t.ok){this.usageSnapshot={query:e.query,result:t.value.result,costSummary:t.value.costSummary},this.usageError=null;let n=this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;n&&this.details.load(n,e.refreshSessionKey===n)}else n&&!t.ok&&this.applyUsageError(t.error.cause);this.applyUsageLoadState(Ye(t),e.epoch,n&&t.ok?void 0:null),this.refreshPolicy.flushPending()},onError:e=>{this.applyUsageError(e),this.applyUsageLoadState({state:`pending`},this.connectionEpoch,null),this.refreshPolicy.flushPending()}}),this.usageExportRequest=pt(this,this.gateway,()=>this.currentQuery),this.details=new st(this,this.gateway,()=>this.currentQuery,()=>this.usageResult?.sessions??[],()=>{this.usageTimeSeriesCursorStart=null,this.usageTimeSeriesCursorEnd=null}),this.subscriptions=new T(this).effect(()=>this.context?.agentSelection,e=>this.observeAgentScope(e)).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t))}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}disconnectedCallback(){this.subscriptions.clear(),this.clearDateDebounce(),this.clearQueryDebounce(),this.refreshPolicy.dispose(),this.usageRequest.cancel(),this.details.cancel(),this.usageExportRequest.cancel(),super.disconnectedCallback()}applyRouteData(){let e=this.routeData;if(!e||(this.routeDataInitialized=!0,!this.routeDataEnabled))return;if(!this.gateway.isRouteDataCurrent(e)){this.routeDataEnabled=!1;return}let t=this.context.agentSelection.state.scopeId;if(e.query.agentId!==t){this.usageAgentId=t,this.clearSelectionsAndDetails(),this.resetProviderUsage(),this.refreshPolicy.request(`manual`);return}this.usageStartDate=e.query.startDate,this.usageEndDate=e.query.endDate,this.usageScope=e.query.scope,this.usageTimeZone=e.query.timeZone,this.usageAgentId=e.query.agentId,this.usageCreatorKey=e.query.creatorKey??null,this.usageSnapshot={query:this.currentQuery,result:e.result,costSummary:e.costSummary},this.applyUsageLoadState(e.providerUsage,this.connectionEpoch,e.loadedAtMs),this.usageError=e.error}ensureInitialData(){!this.routeDataEnabled&&this.routeDataInitialized&&this.gateway.client&&this.gateway.connected&&!this.usageLoading&&this.loadUsage()}resetForClientChange(){this.clearDateDebounce(),this.usageRequest.cancel(),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.usageSnapshot=null,this.resetProviderUsage(),this.usageError=null,this.usageAgentId=this.context.agentSelection.state.scopeId,this.usageCreatorKey=null,this.clearSelectionsAndDetails()}resetProviderUsage(){this.providerUsageSummary=null,this.providerUsageUnavailable=!1,this.providerUsageIncomplete=!1,this.refreshPolicy.resetPayload()}applyUsageLoadState(e,t,n=Date.now()){if(e.state===`settled`){let t=e.result;this.providerUsageUnavailable=!t.ok,this.providerUsageIncomplete=!t.ok||He(t.value),t.ok&&!this.providerUsageIncomplete&&(this.providerUsageSummary=t.value)}let r=this.providerUsageIncomplete||this.usageCacheIncomplete;this.refreshPolicy.setLastLoadedAtMs(e.state===`pending`?null:n,{incomplete:r,connection:t})}get usageCacheIncomplete(){return tt(this.usageResult?.cacheStatus,this.usageCostSummary?.cacheStatus)}get currentQuery(){return{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,timeZone:this.usageTimeZone,agentId:s(this.usageAgentId??``)||void 0,creatorKey:this.usageCreatorKey??void 0}}isCurrentQuery(e){let t=this.currentQuery;return e.startDate===t.startDate&&e.endDate===t.endDate&&e.scope===t.scope&&e.timeZone===t.timeZone&&e.agentId===t.agentId&&e.creatorKey===t.creatorKey}get usageResult(){return this.usageSnapshot&&this.isCurrentQuery(this.usageSnapshot.query)?this.usageSnapshot.result:null}get usageCostSummary(){return this.usageSnapshot&&this.isCurrentQuery(this.usageSnapshot.query)?this.usageSnapshot.costSummary:null}get usageCreatorOptions(){return this.usageSnapshot?.query.agentId===this.currentQuery.agentId?this.usageSnapshot?.result?.creatorOptions??[]:[]}get providerUsageStalled(){return this.providerUsageIncomplete&&this.refreshPolicy.incompleteUsageExhausted}applyUsageError(e){let t=g(e);this.usageError=t?y(`usage`):Ge(e),t&&(this.usageSnapshot=null)}get usageLoading(){return!this.routeDataInitialized||this.dateDebounceTimer!==null||this.usageRequest.pending}loadUsage(e){let t=this.gateway.client;return!t||!this.gateway.connected?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):(this.routeDataEnabled=!1,this.usageError=null,this.usageRequest.run([t,e]))}clearSelections(){this.usageSelectedDays=[],this.usageSelectedHours=[],this.usageSelectedSessions=[]}clearSelectionsAndDetails(){this.usageExportRequest.cancel(),this.clearSelections(),this.details.clear()}clearDateDebounce(){this.dateDebounceTimer!==null&&(window.clearTimeout(this.dateDebounceTimer),this.dateDebounceTimer=null)}scheduleUsageLoad(){this.clearDateDebounce(),this.usageRequest.cancel(),this.usageError=null,this.refreshPolicy.resetPayload(),this.routeDataEnabled=!1,this.dateDebounceTimer=window.setTimeout(()=>{this.dateDebounceTimer=null,this.refreshPolicy.request(`manual`)},400)}handleGatewaySnapshot(e){if(!this.gateway.connected||!this.gateway.client)return;this.context.agents.ensureList(),(e.identityChanged||e.becameConnected)&&(this.connectionEpoch={},this.routeDataInitialized&&this.refreshPolicy.request(`reconnect`));let t=this.usageSelectedSessions.length===1?this.usageSelectedSessions[0]:void 0;if(e.becameAvailable&&t)for(let e of[this.details.timeSeries,this.details.sessionLogs,this.details.contextWeight])e.recover(t,e===this.details.contextWeight)}clearQueryDebounce(){this.queryDebounceTimer!==null&&(window.clearTimeout(this.queryDebounceTimer),this.queryDebounceTimer=null)}selectSession(e,t,n){if(this.details.clear(),this.usageRecentSessions=[e,...this.usageRecentSessions.filter(t=>t!==e)].slice(0,8),this.usageSelectedSessions=et(this.usageSelectedSessions,e,n,t),this.usageSelectedSessions.length===1){let e=this.usageSelectedSessions[0];e&&this.details.load(e)}}render(){let e=this.details.timeSeries.data,t={data:{loading:this.usageLoading,exporting:this.usageExportRequest.pending,error:this.usageError,sessions:this.usageResult?.sessions??[],creatorOptions:this.usageCreatorOptions,agents:this.context.agents.state.agentsList?.agents.map(e=>e.id).filter(Boolean)??[],sessionsLimitReached:(this.usageResult?.sessions.length??0)>=1e3,totals:this.usageResult?.totals??null,aggregates:this.usageResult?.aggregates??null,costDaily:this.usageCostSummary?.daily??[],cacheRefresh:this.usageCacheIncomplete?this.refreshPolicy.incompleteUsageExhausted?`exhausted`:`retrying`:`complete`,providerUsage:this.providerUsageSummary?.providers??[],providerUsageStalled:this.providerUsageStalled,providerUsageUnavailable:this.providerUsageUnavailable},filters:{startDate:this.usageStartDate,endDate:this.usageEndDate,scope:this.usageScope,selectedSessions:this.usageSelectedSessions,selectedDays:this.usageSelectedDays,selectedHours:this.usageSelectedHours,agentId:this.usageAgentId,creatorKey:this.usageCreatorKey,query:this.usageQuery,queryDraft:this.usageQueryDraft,timeZone:this.usageTimeZone},display:{chartMode:this.usageChartMode,dailyChartMode:this.usageDailyChartMode,sessionSort:this.usageSessionSort,sessionSortDir:this.usageSessionSortDir,recentSessions:this.usageRecentSessions,sessionsTab:this.usageSessionsTab,visibleColumns:this.usageVisibleColumns,contextExpanded:this.usageContextExpanded,headerPinned:this.usageHeaderPinned},detail:{context:{weight:this.details.contextWeight.data,loading:this.details.contextWeight.loading,status:this.details.contextWeight.status},timeSeriesMode:this.usageTimeSeriesMode,timeSeriesBreakdownMode:this.usageTimeSeriesBreakdownMode,timeSeries:e,timeSeriesLoading:this.details.timeSeries.loading,timeSeriesStatus:this.details.timeSeries.status,timeSeriesCursorStart:this.usageTimeSeriesCursorStart,timeSeriesCursorEnd:this.usageTimeSeriesCursorEnd,sessionLogs:this.details.sessionLogs.data,sessionLogsLoading:this.details.sessionLogs.loading,sessionLogsStatus:this.details.sessionLogs.status,sessionLogsExpanded:this.usageSessionLogsExpanded,logFilters:{roles:this.usageLogFilterRoles,tools:this.usageLogFilterTools,hasTools:this.usageLogFilterHasTools,query:this.usageLogFilterQuery}},callbacks:{filters:{onStartDateChange:e=>{this.usageStartDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onEndDateChange:e=>{this.usageEndDate=e,this.clearSelectionsAndDetails(),this.scheduleUsageLoad()},onScopeChange:e=>{this.usageScope=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onAgentChange:e=>{this.context.agentSelection.setScope(e)},onCreatorChange:e=>{this.usageCreatorKey=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onRefresh:()=>this.refreshPolicy.request(`manual`),onTimeZoneChange:e=>{this.usageTimeZone=e,this.clearSelectionsAndDetails(),this.refreshPolicy.request(`manual`)},onToggleHeaderPinned:()=>this.usageHeaderPinned=!this.usageHeaderPinned,onSelectHour:(e,t)=>{this.usageSelectedHours=Ke(this.usageSelectedHours,e,Array.from({length:24},(e,t)=>t),t,!0)},onQueryDraftChange:e=>{this.usageQueryDraft=e,this.clearQueryDebounce(),this.queryDebounceTimer=window.setTimeout(()=>{this.usageQuery=this.usageQueryDraft,this.queryDebounceTimer=null},250)},onApplyQuery:()=>{this.clearQueryDebounce(),this.usageQuery=this.usageQueryDraft},onClearQuery:()=>{this.clearQueryDebounce(),this.usageQueryDraft=``,this.usageQuery=``},onSelectDay:(e,t,n)=>{this.usageSelectedDays=Ke(this.usageSelectedDays,e,n,t,!1)},onClearDays:()=>this.usageSelectedDays=[],onClearHours:()=>this.usageSelectedHours=[],onClearSessions:()=>{this.usageSelectedSessions=[],this.details.clear()},onClearFilters:()=>this.clearSelectionsAndDetails()},display:{onExportJson:e=>{this.usageExportRequest.run(e)},onChartModeChange:e=>this.usageChartMode=e,onDailyChartModeChange:e=>this.usageDailyChartMode=e,onSessionSortChange:e=>this.usageSessionSort=e,onSessionSortDirChange:e=>this.usageSessionSortDir=e,onSessionsTabChange:e=>this.usageSessionsTab=e,onToggleColumn:e=>{this.usageVisibleColumns=this.usageVisibleColumns.includes(e)?this.usageVisibleColumns.filter(t=>t!==e):[...this.usageVisibleColumns,e]}},details:{onToggleContextExpanded:()=>this.usageContextExpanded=!this.usageContextExpanded,onToggleSessionLogsExpanded:()=>this.usageSessionLogsExpanded=!this.usageSessionLogsExpanded,onLogFilterRolesChange:e=>{this.usageLogFilterRoles=e},onLogFilterToolsChange:e=>{this.usageLogFilterTools=e},onLogFilterHasToolsChange:e=>{this.usageLogFilterHasTools=e},onLogFilterQueryChange:e=>{this.usageLogFilterQuery=e},onLogFilterClear:()=>{this.usageLogFilterRoles=[],this.usageLogFilterTools=[],this.usageLogFilterHasTools=!1,this.usageLogFilterQuery=``},onSelectSession:(e,t,n)=>this.selectSession(e,t,n),onTimeSeriesModeChange:e=>{this.usageTimeSeriesMode=e},onTimeSeriesBreakdownChange:e=>{this.usageTimeSeriesBreakdownMode=e},onTimeSeriesCursorRangeChange:(t,n)=>{this.details.timeSeries.data===e&&(this.usageTimeSeriesCursorStart=t,this.usageTimeSeriesCursorEnd=n)}}}};return ht(this.context,this.usageResult,wr(t))}},l([c({context:V,subscribe:!0})],$.prototype,`context`,void 0),l([te({attribute:!1})],$.prototype,`routeData`,void 0),l([R()],$.prototype,`usageSnapshot`,void 0),l([R()],$.prototype,`providerUsageSummary`,void 0),l([R()],$.prototype,`providerUsageUnavailable`,void 0),l([R()],$.prototype,`providerUsageIncomplete`,void 0),l([R()],$.prototype,`usageError`,void 0),l([R()],$.prototype,`usageStartDate`,void 0),l([R()],$.prototype,`usageEndDate`,void 0),l([R()],$.prototype,`usageScope`,void 0),l([R()],$.prototype,`usageAgentId`,void 0),l([R()],$.prototype,`usageCreatorKey`,void 0),l([R()],$.prototype,`usageSelectedSessions`,void 0),l([R()],$.prototype,`usageSelectedDays`,void 0),l([R()],$.prototype,`usageSelectedHours`,void 0),l([R()],$.prototype,`usageChartMode`,void 0),l([R()],$.prototype,`usageDailyChartMode`,void 0),l([R()],$.prototype,`usageTimeSeriesMode`,void 0),l([R()],$.prototype,`usageTimeSeriesBreakdownMode`,void 0),l([R()],$.prototype,`usageTimeSeriesCursorStart`,void 0),l([R()],$.prototype,`usageTimeSeriesCursorEnd`,void 0),l([R()],$.prototype,`usageSessionLogsExpanded`,void 0),l([R()],$.prototype,`usageQuery`,void 0),l([R()],$.prototype,`usageQueryDraft`,void 0),l([R()],$.prototype,`usageSessionSort`,void 0),l([R()],$.prototype,`usageSessionSortDir`,void 0),l([R()],$.prototype,`usageRecentSessions`,void 0),l([R()],$.prototype,`usageTimeZone`,void 0),l([R()],$.prototype,`usageContextExpanded`,void 0),l([R()],$.prototype,`usageHeaderPinned`,void 0),l([R()],$.prototype,`usageSessionsTab`,void 0),l([R()],$.prototype,`usageVisibleColumns`,void 0),l([R()],$.prototype,`usageLogFilterRoles`,void 0),l([R()],$.prototype,`usageLogFilterTools`,void 0),l([R()],$.prototype,`usageLogFilterHasTools`,void 0),l([R()],$.prototype,`usageLogFilterQuery`,void 0),customElements.get(`testclaw-usage-page`)||customElements.define(`testclaw-usage-page`,$),Er={header:!0,render:e=>M`<testclaw-usage-page .routeData=${e}></testclaw-usage-page>`}})))()}Dr();export{Er as usagePageComponent};
//# sourceMappingURL=usage-page-CicYCYwf.js.map