const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./model-setup-page-CPfzJFpi.js","./control-ui-boot-shared-BGGpAWmX.js","./control-ui-boot-shared-8dYR6CXG.js","./markdown-runtime-B1-JWj3L.js","./config-runtime-CgOgfOrG.js","./control-ui-boot-shared-D2o30asO.js","./control-ui-boot-shared-7DNogyqm.js","./control-ui-boot-shared-DudbgiQn.js","./control-ui-boot-shared-VDjYq2Zh.js","./control-ui-boot-shared-DE0JeAKR.js","./sidebar-update-runtime-BRiaYa7O.js","./settings-CUz7ACi4.js","./wizard-login-controller-mVdQTtmr.js","./wizard-step-controls-BOTgnqix.js","./channel-picker-BtUNSoO-.js","./image-with-fallback-DfBwywga.js","./control-ui-core-CBmGCeuQ.css","./control-ui-boot-shared-aePz3vDg.css","./sidebar-update-runtime-BklCM1yZ.css","./settings-BXlW75v2.css","./channel-picker-hvRTuarN.css","./wizard-step-controls-D2NAzKG1.css","./wizard-login-controller-CpdIpYqr.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,Hi as n,Hr as r,Jr as i,Ur as a,eo as o,ja as s,qr as c,sr as l,ti as u}from"./control-ui-foundation-CGMdhB5v.js";import{$l as d,Ac as f,Bl as p,Bs as m,Hl as h,Jl as g,Jn as _,Mc as v,Mi as y,Ni as b,Qc as ee,Rs as x,Si as te,Uc as S,Wc as ne,_n as re,ac as ie,ha as ae,ic as oe,in as se,is as ce,jc as le,ma as ue,mn as de,on as fe,ts as pe,xi as me,zs as he}from"./control-ui-core-S9jKXqB5.js";import{$ as C,X as w,Y as T,c as ge,ct as E,nt as _e,s as ve,tt as ye,ut as D}from"./lit-runtime-DWoPVI38.js";import{Cr as be,Di as xe,Fi as O,Ii as k,Li as Se,Oi as Ce,Or as we,Qa as Te,Ri as Ee,fo as De}from"./control-ui-core-G2U4O6rB.js";import{gt as Oe,ht as ke}from"./control-ui-boot-shared-DyyHmPxq.js";import{c as Ae,s as je,u as Me}from"./gateway-runtime-BV4hxqU_.js";import{$ as Ne,Aa as Pe,I as Fe,L as Ie,Ma as Le,at as Re,da as ze,et as Be,go as Ve,ho as He,it as Ue,ja as We,ka as Ge,l as Ke,nt as qe,tt as Je,u as Ye,ua as Xe}from"./control-ui-boot-shared-ooxiG3qa.js";import{G as Ze,H as A,U as j,V as M}from"./control-ui-boot-shared-C3bL_9oq.js";import{Aa as Qe,At as N,Da as $e,Ea as et,Et as P,Nt as tt,Oa as F,Ot as I,Pt as nt,St as rt,Tt as it,_t as at,bt as L,ht as R,kt as ot,lo as st,uo as ct,wt as lt,yt as z}from"./control-ui-boot-shared-CCYBAAP9.js";import{ht as ut,mt as dt}from"./control-ui-boot-shared-BnfqoX89.js";import{n as ft,t as pt}from"./en-settings-DALqdpqg.js";import{n as mt,t as ht}from"./settings-workspace-DJAhLnkQ.js";import{n as gt,t as _t}from"./model-picker-B5f1dDe1.js";import{n as vt,t as yt}from"./decision-model-picker-DCNG76SK.js";import{a as bt,i as xt,n as St,r as Ct,t as wt}from"./load-DnaH0T0n.js";import{a as Tt,i as Et,n as Dt,r as Ot}from"./usage-DvG1St5a.js";import{a as kt,c as At,i as jt,l as Mt,n as Nt,o as Pt,r as Ft,s as It,t as Lt}from"./view-status-DZFvBRaB.js";function Rt(e){let t=null,n=null,r=0,i={get generation(){return r},get discovering(){return t!==null},get error(){return n},retry(){a()},reset(){let r=t;t=null,n=null,r?.abort(),e.requestUpdate()}};async function a(){let i=e.getAgentId();if(!i||t)return;let a=e.getGateway(),o=a.client;if(!a.connected||!o)return;let s=e.getAgentEpoch(),c=a.epoch,l=new AbortController,u=()=>t===l&&a.isCurrent({client:o,epoch:c})&&e.getAgentId()===i&&e.getAgentEpoch()===s;t=l,r+=1,n=null,e.requestUpdate();try{let t=await Be(o,{agentId:i,refresh:!0,signal:l.signal});if(u()){n=Je(t,d(`modelProviders.defaults.discoverFailed`));let r=e.getData();r&&e.setData({...r,providerOutcomes:t.providerOutcomes??[],catalogError:null})}}catch(e){u()&&(n=x(e,`request failed`))}finally{t===l&&(t=null,e.requestUpdate(),e.onSettled())}}return i}function zt(){return(zt=e((()=>{g(),m(),Ne()})))()}function Bt(e,t){return{onPrimaryChange:n=>{t({primary:n,fallbacks:e().fallbacks.filter(e=>e!==n)})},onFallbackChange:n=>{t({fallbacks:n?[n,...e().fallbacks.slice(1).filter(e=>e!==n)]:[]})},onUtilityChange:e=>t({utilityModel:e}),onDecisionChange:e=>t({decisionModel:e}),onThinkingChange:e=>t({thinkingLevel:e,thinkingOverridden:!0}),onThinkingReset:()=>t({thinkingLevel:void 0,thinkingOverridden:!1}),onFastModeChange:e=>t({fastMode:e,fastModeOverridden:!0}),onFastModeReset:()=>t({fastMode:void 0,fastModeOverridden:!1})}}function Vt(e){let t=e?.thinkingDefault,n=e?.fastModeDefault;return{thinkingLevel:typeof t==`string`?t:void 0,thinkingOverridden:e!==null&&Object.hasOwn(e,`thinkingDefault`),fastMode:n===`auto`||typeof n==`boolean`?n:void 0,fastModeOverridden:e!==null&&Object.hasOwn(e,`fastModeDefault`)}}function Ht(e){return{agents:{defaults:{...e.primary?{model:e.fallbacks.length>0?{primary:e.primary,fallbacks:[...e.fallbacks]}:e.primary}:{},utilityModel:e.utilityModel,...e.decisionModel===void 0?{}:{decisionModel:e.decisionModel},thinkingDefault:e.thinkingOverridden&&e.thinkingLevel?e.thinkingLevel:null,fastModeDefault:e.fastModeOverridden&&e.fastMode!==void 0?e.fastMode:null}}}}function Ut(e){return/method (?:not found|not supported)|unknown method/iu.test(H(e))}function Wt(e,t){if(t.length===1)return t[0];let n=t.some(e=>e.status===`ok`)?`ok`:Yt.find(e=>t.some(t=>t.status===e))??`unknown`,r=t.find(e=>e.status===n)?.error;return{provider:e,status:n,...r?{error:r}:{},results:t.flatMap(e=>e.results.map(t=>({...t,label:`${e.provider}: ${t.label}`})))}}function B(e){let t=e.runtimeConfig.state,n=e.overlays.snapshot;return t.configLoading||t.configSaving||t.configApplying||n.updateRunning||n.updateReconciliationPending}function V(e){let t=e.gateway.snapshot;if(t.phase!==`connected`)return d(`modelProviders.readOnly.disconnected`);if(e.runtimeConfig.canPatch!==!0)return d(`modelProviders.readOnly.adminRequired`);let n=e.runtimeConfig.state;return!t.client||n.client!==t.client||!S(n)?d(`modelProviders.configUnavailable`):null}function H(e){return x(e,d(`modelProviders.requestFailed`))}async function Gt(e,t){let{runtimeConfig:n}=e;e.setBusy(!0),e.setMessage(null);try{if(await n.ensureLoaded(),!e.isCurrentClient())return;let r=await n.patch({raw:t.raw,note:t.note,...t.replacePaths?{replacePaths:t.replacePaths}:{}});if(!e.isCurrentClient())return;r||e.isCurrentAgent()&&e.setMessage({kind:`error`,text:n.state.lastError??d(`modelProviders.configUnavailable`)})}catch(t){e.isCurrentClient()&&e.isCurrentAgent()&&e.setMessage({kind:`error`,text:H(t)})}finally{e.isCurrentClient()&&e.isCurrentAgent()&&e.setBusy(!1)}}async function Kt(e,t){let n=()=>e.isCurrentClient()&&e.isCurrentAgent();e.setBusy(!0),e.setMessage(null);try{let r=await e.runtimeConfig.runExternalMutation(async e=>{if(e!==t.client)throw Error(d(`modelProviders.requestFailed`));let n={provider:t.provider,agentId:t.agentId},r=await(t.apiKey===null?e.request(`models.authLogout`,{...n,credentialType:`api_key`}):e.request(`models.authSetApiKey`,{...n,apiKey:t.apiKey}));return b(e),r},{canDispatch:()=>n()&&e.canMutate()});if(!n())return{ok:!1};if(!r.ok)return e.setMessage({kind:`error`,text:r.error}),{ok:!1};let i=r.value.warning?[r.value.warning]:[];if(!r.refresh.ok)i.push(r.refresh.error);else try{let t=await e.refreshProviders();t&&i.push(t)}catch(e){i.push(H(e))}if(!n())return{ok:!1};let a=i.length>0?i.join(` `):null;return e.setMessage({kind:`success`,text:t.success,...a?{warning:a}:{}}),{ok:!0,warning:a}}finally{n()&&e.setBusy(!1)}}function qt(e,t,n){return d(e===`add`?`modelProviders.add.saved`:t===null?`modelProviders.apiKey.removed`:`modelProviders.apiKey.saved`,{provider:n})}var Jt,Yt;function U(){return(U=e((()=>{g(),ne(),m(),y(),Jt=[`agents.defaults.model.fallbacks`],Yt=[`auth`,`billing`,`rate_limit`,`timeout`,`format`,`no_model`,`unknown`]})))()}var Xt;function Zt(){return(Zt=e((()=>{M(),ue(),St(),Xt=class{constructor(e,t){this.options=t,this.active=!1,this.publicationPending=!1,this.task=new A(e,{autoRun:!1,task:([e],{signal:t})=>e?bt(e.client,{agentId:e.agentId,...e.reason===`forced`?{refresh:!0}:{},signal:t}).then(t=>({...e,data:t})):j,onComplete:e=>{this.settle(),this.options.onComplete(e)},onError:()=>this.settle()})}get loading(){return this.active}refresh(e,t,n){return n===`publication`&&(this.active||this.options.isCatalogLoading())?(this.publicationPending=!0,Promise.resolve()):(n===`publication`&&(this.publicationPending&&ae(e,{agentId:t}),this.publicationPending=!1),this.active=!0,this.options.onStart(n),this.task.run([{client:e,agentId:t,reason:n}]))}invalidate(){this.publicationPending=!1,this.active=!1,this.task.run([null])}settle(){this.active=!1,this.flushPublication()}flushPublication(){queueMicrotask(()=>{this.publicationPending&&!this.active&&!this.options.isCatalogLoading()&&this.options.refreshPublication()})}}})))()}function W(e){return Ge(e)}function Qt(e){switch(e.status){case`ok`:case`expiring`:case`expired`:case`missing`:return e.status;default:return`api-key`}}function G(e,t){return e.find(e=>t.some(t=>e.ids.has(t)))}function K(e,t,n){let r=G(e,[t]);if(r)return r;let i={ids:new Set([t]),card:{id:t,displayName:n,profiles:[],profileProviderIds:{},profileOrders:{},profileOrderExplicitProviders:[],profileOrderStoredProviders:[],profileOrderLocks:{},credentialProviderIds:[],logoutTargets:[],hasConfigApiKey:!1,modelCount:0,availableModelCount:0},hasModelAuth:!1};return e.push(i),i}function $t(e,t){let n=a(t);n&&!e.some(e=>a(e)===n)&&e.push(t)}function en(e,t,n){if(n.length===0)return;let r=a(t),i=e.find(e=>a(e.provider)===r);if(!i){e.push({provider:t,profileIds:[...new Set(n)]});return}i.profileIds=[...new Set([...i.profileIds,...n])]}function tn(e){let t=[],n=new Map,r=new Map,i=new Set;for(let t of e.authStatus?.providerCapabilities??[]){let e=W(t.provider);e&&n.set(e,n.get(e)===!0||t.apiKeySupported)}for(let n of e.configProviderIds??[]){let e=W(n);e&&(K(t,e,F(e)).card.configKey??=n)}for(let n of e.configApiKeyProviderIds??[]){let e=W(n);if(e){let r=K(t,e,F(e)).card;r.configKey=n,r.hasConfigApiKey=!0,$t(r.credentialProviderIds,n)}}for(let[n,r]of Object.entries(e.configProviderAuthModes??{})){let e=W(n);e&&(K(t,e,F(e)).card.configAuthMode=r)}for(let n of e.pendingProviders??[]){let e=W(n);e&&(K(t,e,F(e)).card.checkingModels=!0)}for(let n of e.providerOutcomes??[]){let e=W(n.provider);if(!e)continue;let r=K(t,e,F(e)),i=r.catalogOutcome,a=n.profileId===void 0,o=on[a?`provider`:`profile`];(!i||(a===(i.profileId===void 0)?o.indexOf(n.status)<o.indexOf(i.status):a))&&(r.catalogOutcome=n)}for(let n of e.models??[]){let e=W(n.provider);if(!e)continue;let r=K(t,e,F(e));r.card.modelCount+=1,n.available===!0&&(r.card.availableModelCount+=1)}for(let a of e.authStatus?.providers??[]){let e=W(a.provider);if(!e)continue;let o=a.usage?W(a.usage.providerId):e,s=[...new Set([e,o])],c=G(t,s)??K(t,o,F(o));for(let e of s)c.ids.add(e);if(c.card.displayName=a.displayName||c.card.displayName,c.card.profiles.push(...a.profiles),a.profiles.length>0){let e=a.authProvider||a.provider;for(let t of a.profiles)c.card.profileProviderIds[t.profileId]=e;a.profileOrder!==void 0&&i.add(e);let t=a.profileOrder??a.profiles.map(e=>e.profileId);r.set(e,[...new Set([...r.get(e)??[],...t])]),c.card.profileOrders[e]=t,a.profileOrderStored===!0&&!c.card.profileOrderStoredProviders.includes(e)&&c.card.profileOrderStoredProviders.push(e),a.profileOrderLocked!==void 0&&(c.card.profileOrderLocks[e]??=a.profileOrderLocked)}(a.apiKey||a.profiles.length>0)&&$t(c.card.credentialProviderIds,a.provider),en(c.card.logoutTargets,a.provider,a.profiles.filter(e=>e.logoutSupported===!0).map(e=>e.profileId)),c.card.apiKey??=a.apiKey,c.hasModelAuth||=We(a)||n.has(e);let l=a.usage;l&&!c.card.usage&&(c.card.usage={provider:l.providerId,displayName:a.displayName,windows:l.windows,...l.summary?{summary:l.summary}:{},...l.plan?{plan:l.plan}:{},...l.billing?.length?{billing:l.billing}:{}})}for(let e of t){e.card.profileOrderExplicitProviders=Object.keys(e.card.profileOrders).filter(e=>i.has(e));for(let t of Object.keys(e.card.profileOrders)){let n=r.get(t);n&&(e.card.profileOrders[t]=n)}}for(let n of Le(e.authStatus?.providers??[])){let e=G(t,[W(n.provider)]);e&&(e.card.auth={kind:Qt(n),profileCount:n.profiles.length,...n.expiry?.label?{expiryLabel:n.expiry.label}:{}})}for(let n of e.providerUsage?.providers??[]){let e=W(n.provider);if(!e)continue;let r=G(t,[e])??K(t,e,n.displayName||F(e));r.ids.add(e),r.card.usage=n}for(let n of e.costByProvider??[]){let e=W(n.provider??``);if(!e)continue;let r=G(t,[e])??K(t,e,F(e)),i={totalCost:n.totals.totalCost,totalTokens:n.totals.totalTokens,messageCount:n.count},a=r.card.localCost;r.card.localCost=a?{totalCost:a.totalCost+i.totalCost,totalTokens:a.totalTokens+i.totalTokens,messageCount:a.messageCount+i.messageCount}:i}return t.filter(t=>t.hasModelAuth||(e.configProviderIds??[]).some(e=>W(e)===t.card.id)||!!t.card.usage||t.card.modelCount>0||!!t.catalogOutcome||t.card.checkingModels||(t.card.localCost?.totalTokens??0)>0).map(e=>{let t=n.get(e.card.id);return Object.assign({},e.card,e.catalogOutcome?{catalogStatus:e.catalogOutcome.status}:{},t===void 0?{}:{apiKeySupported:t})}).toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}function q(e){return e.selectionRef===void 0?e.id.startsWith(`${e.provider}/`)?e.id:`${e.provider}/${e.id}`:e.selectionRef}function nn(e,t){let n=new Set([t.primary,...t.fallbacks,t.utilityModel].filter(e=>typeof e==`string`&&e.length>0)),r=(e??[]).filter(e=>e.available!==!1||n.has(q(e))),i=new Set(r.map(q)),a=e===null?{}:{available:!1};for(let t of n){if(i.has(t))continue;let{model:n,profile:o}=l(t);if(o){let i=(e??[]).find(e=>q(e)===n);if(i){r.push({...i,selectionRef:t});continue}}let s=t.indexOf(`/`);if(s<=0||s===t.length-1){let n=t.trim().toLowerCase(),i=(e??[]).find(e=>e.alias?.trim().toLowerCase()===n||e.id.trim()===t.trim());r.push({...i??{provider:``,id:t,name:t,...a},selectionRef:t});continue}r.push({provider:t.slice(0,s),id:t.slice(s+1),name:t,...a})}return r}function rn(e){let t=n(e?.models),r=n(t?.providers),i=n(e?.agents),a=n(i?.defaults),o=a?.model,s=n(o),c=typeof o==`string`?o:typeof s?.primary==`string`?s.primary:``,l=Array.isArray(s?.fallbacks)?s.fallbacks.filter(e=>typeof e==`string`):[];return{providerIds:Object.keys(r??{}),apiKeyProviderIds:Object.entries(r??{}).filter(([,e])=>{let t=n(e);return t?Object.hasOwn(t,`apiKey`)&&t.apiKey!=null:!1}).map(([e])=>e),providerAuthModes:Object.fromEntries(Object.entries(r??{}).flatMap(([e,t])=>{let r=n(t)?.auth;return typeof r==`string`?[[e,r]]:[]})),defaults:{primary:c,fallbacks:l,utilityModel:typeof a?.utilityModel==`string`?a.utilityModel:null,...typeof a?.decisionModel==`string`?{decisionModel:a.decisionModel}:{}}}}function an(e,t){let n=new Set(Array.from(t,W)),r=new Map;for(let t of e??[]){let e=W(t.provider);t.quickApiKeySetup&&e&&!n.has(e)&&!r.has(e)&&r.set(e,{id:e,displayName:F(e)})}return[...r.values()].toSorted((e,t)=>e.displayName.localeCompare(t.displayName))}var on;function sn(){return(sn=e((()=>{r(),$e(),Pe(),on={provider:[`auth-rejected`,`unavailable`,`ready`],profile:[`ready`,`auth-rejected`,`unavailable`]}})))()}function cn(e){return e.state===`closed`?w:e.state===`loading`?C`<testclaw-modal-dialog
      label=${d(`modelSetup.discovery.title`)}
      @modal-cancel=${e.onCancel}
    >
      <div class="model-setup-wizard">
        <div class="model-setup-wizard__body" role="status">${d(`common.loading`)}</div>
        <div class="model-setup-wizard__footer">
          <button class="btn" @click=${e.onCancel}>${d(`common.cancel`)}</button>
        </div>
      </div>
    </testclaw-modal-dialog>`:C`<testclaw-model-setup-page
    .routeData=${{firstRun:!1}}
    .embedded=${!0}
    .onConnectChoice=${e.onConnectChoice}
    .credentialChoices=${e.credentialChoices}
    .agentLabel=${e.agentLabel}
    .onClose=${e.onClose}
  ></testclaw-model-setup-page>`}var ln;function un(){return(un=e((()=>{T(),g(),At(),o(),Mt(),ln=class{constructor(e,t){this.host=e,this.options=t,this.state=`closed`,this.generation=0,this.owner=null,e.addController(this)}get busy(){return this.state!==`closed`}reset(){this.generation+=1,this.state=`closed`,this.owner=null,this.host.requestUpdate()}hostUpdated(){let e=this.owner;if(!e)return;let t=this.options.getOwner();(this.state===`loading`&&!this.options.isCurrent(e)||t.selectionIntentRevision!==e.selectionIntentRevision||!t.selectionPending&&t.agentId!==e.agentId)&&this.reset()}cancelLoading(){this.state===`loading`&&this.reset()}hostDisconnected(){this.reset()}async open(){if(!this.options.canOpen()||this.busy)return;let e=this.options.getOwner();if(!e.client)return;let n=this.generation,r=()=>n===this.generation&&this.state===`loading`&&this.options.isCurrent(e);this.owner=e,this.state=`loading`,this.host.requestUpdate();try{await t(()=>import(`./model-setup-page-CPfzJFpi.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]),import.meta.url),r()&&(this.state=`ready`,this.host.requestUpdate())}catch(e){r()&&(this.reset(),this.options.onError(e))}}render(e){let t=this.generation;return cn({...e,state:this.state,onCancel:()=>{t===this.generation&&this.reset()},onClose:()=>{t===this.generation&&(this.reset(),this.options.onClose())},onConnectChoice:e=>{t===this.generation&&(this.reset(),this.options.onConnectChoice(e))}})}}})))()}var dn,fn,pn;function mn(){return(mn=e((()=>{M(),T(),k(),$e(),R(),g(),ne(),Ae(),U(),dn=`acpx.agents.list`,fn={installed:{kind:`muted`,labelKey:`modelProviders.installedAgents.status.installed`},missing:{kind:`muted`,labelKey:`modelProviders.installedAgents.status.missing`},unverified:{kind:`warn`,labelKey:`modelProviders.installedAgents.status.unverified`}},pn=class{constructor(e,t){this.host=e,this.options=t,this.agents=null,this.pending=new Map,this.messages=new Map,this.list=new A(e,{args:()=>[t.gateway.connected&&this.available()?t.gateway.client:null,t.gateway.epoch],task:async([e],{signal:t})=>e?(await e.request(dn,{},{signal:t})).agents:j,onComplete:e=>{this.agents=e}})}get loading(){return this.list.status===Ze.PENDING}get error(){return this.list.status===Ze.ERROR?H(this.list.error):null}subscribe(e){return e.subscribeEvents(e=>{e.event===`config.changed`&&this.agents!==null&&this.pending.size===0&&this.list.run()})}reset(e={}){this.list.run([null,this.options.gateway.epoch]),this.pending.clear(),this.messages.clear(),e.preserveVisibleData||(this.agents=null)}filterProviders(e){return e.filter(e=>!this.agents?.some(t=>t.runtimeId===e.id))}available(){return je(this.options.getContext().gateway.snapshot,dn,`operator.read`)}blockedReason(){return V(this.options.getContext())}setEnabled(e,t){let n=this.options.gateway.capture();if(!n||this.blockedReason()||B(this.options.getContext())||this.pending.has(e.id))return!1;this.pending.set(e.id,t);let r=()=>this.options.gateway.isCurrent(n);return Gt({runtimeConfig:this.options.getContext().runtimeConfig,isCurrentClient:r,isCurrentAgent:()=>!0,setBusy:t=>{t||this.pending.delete(e.id),this.host.requestUpdate()},setMessage:t=>{t?this.messages.set(e.id,t):this.messages.delete(e.id),this.host.requestUpdate()}},{key:`installed-agent:${e.id}`,raw:{plugins:{entries:{acpx:{config:{nativeAgents:{[e.id]:t}}}}}},note:d(`modelProviders.installedAgents.note`)}).then(()=>{r()&&this.list.run()}),!0}renderAgent(e,t,n,r){let i=this.pending.get(e.id),a=i??(typeof n==`boolean`?n:e.enabled),o=fn[e.installation],s=``;e.installation===`missing`?s=d(`modelProviders.installedAgents.installHint`,{name:e.name}):e.installation===`unverified`?s=d(`modelProviders.installedAgents.unverifiedHint`):a?r?.catalogStatus===`auth-rejected`?(o={kind:`danger`,labelKey:`modelProviders.installedAgents.status.signIn`},s=d(`modelProviders.installedAgents.signInHint`,{name:e.name})):r?.catalogStatus===`unavailable`?(o={kind:`warn`,labelKey:`modelProviders.status.modelsUnavailable`},s=d(`modelProviders.installedAgents.discoveryHint`,{name:e.name})):r?.checkingModels?o={kind:`muted`,labelKey:`modelProviders.installedAgents.status.discovering`}:r&&r.availableModelCount>0?o={kind:`ok`,labelKey:`modelProviders.installedAgents.status.modelsAvailable`}:s=d(`modelProviders.installedAgents.signInHint`,{name:e.name}):s=d(`modelProviders.installedAgents.disabledHint`);let c=this.messages.get(e.id);return C`
      <div class="model-providers__installed-agent" data-installed-agent=${e.id}>
        ${tt({icon:et(e.id)?Qe(e.id,{className:`model-providers__icon`}):C`<span
                class="model-providers__icon model-providers__agent-icon"
                aria-hidden="true"
                >${O.terminal}</span
              >`,title:e.name,ariaLabel:d(`modelProviders.installedAgents.toggle`,{name:e.name}),description:i===void 0?C`${N({kind:o.kind,label:d(o.labelKey)})}${s?C`<br />${s}`:w}`:N({kind:`muted`,label:d(`modelProviders.saving`)}),checked:a,disabled:t||i!==void 0,onChange:t=>this.setEnabled(e,t)})}
        ${c?C`<div
                class="callout ${c.kind} model-providers__installed-agent-message"
                role=${c.kind===`error`?`alert`:`status`}
              >
                ${c.text}
              </div>`:w}
      </div>
    `}render(e,t){if(!this.available())return w;let r=this.blockedReason(),i=r!==null||B(this.options.getContext()),a=S(this.options.getContext().runtimeConfig.state),o=n(n(a?.plugins)?.entries),s=n(n(o?.acpx)?.config),c=n(s?.nativeAgents),l=this.error?C`<div class="settings-row">
          <div class="settings-row__text">
            <span class="settings-row__desc provider-usage-error" role="alert">${this.error}</span>
          </div>
          <div class="settings-row__control">
            <button
              class="btn btn--sm"
              ?disabled=${this.loading}
              @click=${()=>void this.list.run()}
            >
              ${d(`common.retry`)}
            </button>
          </div>
        </div>`:w,u=this.agents===null?this.error?l:rt({rows:4}):C`${l}${this.agents.length===0?z(d(`modelProviders.installedAgents.empty`)):this.agents.map(t=>this.renderAgent(t,i,c?.[t.id],e.find(e=>e.id===t.runtimeId)))}`,f=this.loading?d(`modelProviders.installedAgents.checking`):d(`modelProviders.installedAgents.check`);return C`
      <div class="model-providers__installed-agents">
        ${I({title:d(`modelProviders.installedAgents.title`),description:C`${d(`modelProviders.installedAgents.description`)}${r?C`<br />${r}`:w}`,actions:C`
              <testclaw-tooltip .content=${f}>
                <button
                  type="button"
                  class="btn btn--icon btn--ghost btn--xs model-providers__refresh-button"
                  aria-label=${f}
                  ?disabled=${this.loading||this.pending.size>0}
                  @click=${()=>{this.list.run(),t()}}
                >
                  ${O.refresh}
                </button>
              </testclaw-tooltip>
            `},u)}
      </div>
    `}}})))()}var hn;function gn(){return(gn=e((()=>{g(),y(),U(),hn=class{constructor(e){this.options=e,this.probeEpochs=new Map,this.probeUnsupported=!1,this.pendingOrders=new Map,this.activeOrderProviders=new Set}get probeAvailable(){return!this.probeUnsupported}resetProbes(){this.probeEpochs=new Map,this.probeUnsupported=!1}clearProbe(e){this.probeEpochs.set(e,(this.probeEpochs.get(e)??0)+1),this.options.setBusy(`probe:`+e,!1),this.options.setProbeResult(e,null)}async probe(e,t){let n=this.options.getClient(),r=`probe:${e}`;if(!n||!this.options.canMutate()||this.options.isBusy(r)||this.probeUnsupported)return;let i=this.options.getClientEpoch(),a=this.options.getAgentId(),o=this.options.getAgentEpoch(),s=(this.probeEpochs.get(e)??0)+1;this.probeEpochs.set(e,s);let c=()=>this.options.isCurrentClient(n,i)&&this.options.getAgentEpoch()===o&&this.options.getAgentId()===a&&this.probeEpochs.get(e)===s;this.options.setBusy(r,!0),this.options.clearMessage(e);try{let r=[];for(let e of t){if(!c())return;r.push(await n.request(`models.probe`,{provider:e,agentId:a}))}c()&&this.options.setProbeResult(e,Wt(e,r))}catch(t){if(!c())return;Ut(t)?(this.probeUnsupported=!0,this.options.setProbeError(e,d(`modelProviders.probe.unavailable`))):this.options.setProbeError(e,H(t))}finally{c()&&this.options.setBusy(r,!1)}}resetOrders(){this.pendingOrders.clear(),this.options.setOrders({})}setOrder(e,t,n){let r=this.options.getData()?.authStatus?.providers.find(e=>e.provider===t),i=n??r?.profiles.map(e=>e.profileId)??[];this.options.setOrders({...this.options.getOrders(),[t]:i}),this.pendingOrders.set(t,{cardId:e,profileIds:n,optimisticOrder:i}),this.options.clearMessage(e),this.flushOrder(t)}flushPendingOrders(){if(this.options.canMutate())for(let e of this.pendingOrders.keys())this.flushOrder(e)}async logout(e,t){let n=this.options.getClient(),r=`logout:${e}`;if(!n||!this.options.canMutate()||this.options.isBusy(r))return;let i=this.options.getClientEpoch(),a=this.options.getAgentId(),o=this.options.getAgentEpoch(),s=()=>this.isCurrentScope(n,i,o,a);this.clearProbe(e),this.options.setBusy(r,!0),this.options.clearMessage(e);try{let n=await this.options.getConfig().runExternalMutation(async e=>{let n=await e.request(`models.authLogout`,{...t,agentId:a});return b(e),n},{canDispatch:()=>s()&&this.options.canMutate()});if(!s())return;if(!n.ok){await this.options.refresh(),s()&&this.options.setError(e,n.error);return}let r=n.value.warning?[n.value.warning]:[];if(!n.refresh.ok)r.push(n.refresh.error);else try{await this.options.refresh();let e=this.options.getData()?.error;e&&r.push(e)}catch(e){r.push(H(e))}s()&&this.options.setLogoutSuccess(r.join(` `)||void 0)}catch(t){s()&&this.options.setError(e,t)}finally{s()&&this.options.setBusy(r,!1)}}async flushOrder(e){if(!this.activeOrderProviders.has(e)){this.activeOrderProviders.add(e);try{for(;;){let t=this.pendingOrders.get(e);if(!t)return;let n=this.options.getClient();if(!n||!this.options.canMutate())return;this.pendingOrders.delete(e);let r=this.options.getClientEpoch(),i=this.options.getAgentEpoch(),a=this.options.getAgentId();try{let o=await n.request(`models.authOrderSet`,{provider:e,...t.profileIds?{profileIds:t.profileIds}:{},agentId:a});if(b(n),!this.isCurrentScope(n,r,i,a))return;if(t.profileIds&&!o.warning)this.options.cancelRefresh(),this.applyOrder(e,t.profileIds),this.options.refresh();else if(await this.options.refresh(),!this.isCurrentScope(n,r,i,a))return;this.clearOptimisticOrder(e,t.optimisticOrder)&&o.warning&&this.options.setError(t.cardId,o.warning)}catch(o){if(!this.isCurrentScope(n,r,i,a))return;this.clearOptimisticOrder(e,t.optimisticOrder)&&this.options.setError(t.cardId,o)}}}finally{this.activeOrderProviders.delete(e),this.pendingOrders.has(e)&&this.options.canMutate()&&this.flushOrder(e)}}}isCurrentScope(e,t,n,r){return this.options.isCurrentClient(e,t)&&this.options.getAgentEpoch()===n&&this.options.getAgentId()===r}clearOptimisticOrder(e,t){let n=this.options.getOrders();if(n[e]!==t)return!1;let r={...n};return delete r[e],this.options.setOrders(r),!0}applyOrder(e,t){let n=this.options.getData(),r=n?.authStatus;if(!n||!r)return;let i=[...r.providers];for(let[n,r]of i.entries()){if((r.authProvider??r.provider)!==e)continue;let{profileOrder:a,profileOrderStored:o,...s}=r;i[n]={...s,profileOrder:[...t],profileOrderStored:!0}}this.options.setData({...n,authStatus:{...r,providers:i}})}}})))()}var J;function _n(){return(_n=e((()=>{M(),T(),_e(),k(),Dt(),g(),m(),h(),J=class extends p{constructor(...e){super(...e),this.client=null,this.agentId=``,this.profileId=``,this.refresh=0,this.usage=new A(this,{args:()=>[this.client,this.agentId,this.profileId,this.refresh],task:([e,t,n],{signal:r})=>e&&t&&n?e.request(`codex.accountUsage`,{agentId:t,profileId:n},{signal:r,timeoutMs:3e4}):j})}refreshUsage(){this.refresh+=1}render(){return this.client?C`
      <div class="model-providers__account-usage">
        <button
          class="model-providers__account-refresh"
          type="button"
          aria-label=${d(`common.refresh`)}
          title=${d(`common.refresh`)}
          ?disabled=${this.usage.status===Ze.PENDING}
          @click=${()=>this.refreshUsage()}
        >
          ${O.refresh}
        </button>
        ${this.usage.render({pending:()=>C`<span>${d(`common.loading`)}</span>`,complete:e=>e.providers.length===0?C`<span>${d(`modelProviders.noStats`)}</span>`:e.providers.map(e=>C`
                    ${e.plan?C`<strong>${e.plan}</strong>`:w}
                    <div>
                      ${e.windows.length||e.billing?.length?Ot(e,{groupWindows:!0}):d(`modelProviders.noStats`)}
                    </div>
                  `),error:e=>C`<span class="provider-usage-error">${x(e)}</span>`})}
      </div>
    `:w}},u([D({attribute:!1})],J.prototype,`client`,void 0),u([D()],J.prototype,`agentId`,void 0),u([D()],J.prototype,`profileId`,void 0),u([E()],J.prototype,`refresh`,void 0),customElements.get(`testclaw-model-account-usage`)||customElements.define(`testclaw-model-account-usage`,J)})))()}function vn(e){te({placement:`bottom`,message:H(e),icon:O.alertTriangle,durationMs:12e3})}function yn(e){te({placement:`bottom`,message:[d(`modelProviders.logout.done`),e].filter(Boolean).join(` `),icon:O.check})}function bn(e){switch(e.source){case`config`:return d(`modelProviders.profiles.sourceConfig`);case`external`:return e.displayName||d(`modelProviders.profiles.sourceExternal`);case`inherited`:return d(`modelProviders.profiles.sourceInherited`);case`saved`:return d(`modelProviders.profiles.sourceSaved`);default:return}}function xn(e){if(e.apiKey?.source===`config`)return d(`modelProviders.credentials.configKey`);if(e.apiKey?.source===`env`)return e.apiKey.envVar?d(`modelProviders.credentials.envKeyNamed`,{name:e.apiKey.envVar}):d(`modelProviders.credentials.envKey`)}function Sn(e){return d(e===`auth-config`?`modelProviders.profiles.priorityManagedByAuth`:`modelProviders.profiles.priorityManagedByProvider`)}function Cn(e){let t=[],n=bn(e);return n&&e.source!==`saved`&&t.push(n),e.email&&e.displayName&&e.displayName!==n&&t.push(e.displayName),e.lastUsedAt&&t.push(d(`modelProviders.profiles.lastUsed`,{time:Xe(Date.now()-e.lastUsedAt)})),t.join(` · `)}function wn(e){let t=(e.split(`@`)[0]??``).split(/[^a-z0-9]+/iu).filter(Boolean);return(t.length>1?`${t[0]?.[0]??``}${t.at(-1)?.[0]??``}`:t[0]?.slice(0,2)??``).toLocaleUpperCase()||`?`}function Tn(e,t){switch(e.externallyManaged&&(e.status===`expired`||e.status===`expiring`)?`ok`:e.status){case`ok`:return N({kind:t?`muted`:`ok`,label:d(t?`modelProviders.status.configured`:`modelProviders.status.ok`)});case`static`:return N({kind:`ok`,label:d(`modelProviders.status.configured`)});case`expiring`:return N({kind:`warn`,label:d(`modelProviders.status.expiring`)});case`expired`:return N({kind:`danger`,label:d(`modelProviders.status.expired`)});default:return N({kind:`muted`,label:d(`modelProviders.status.missing`)})}}function En(e,t){return e.profiles.filter(n=>(e.profileProviderIds[n.profileId]??e.id)===t)}function Dn(e,t){return e.logoutTargets.find(e=>e.profileIds.includes(t))?.provider}function On(e,t){let n=new Set(e.map(e=>e.profileId));return[...t.filter(e=>n.delete(e)),...e.flatMap(e=>n.delete(e.profileId)?[e.profileId]:[])]}function kn(e,t){if(e.length!==t.length)return!1;let n=new Set(e.map(e=>e.profileId));return n.size===e.length&&t.every(e=>n.delete(e))}function An(e,t){return[...new Set(e.profiles.map(t=>e.profileProviderIds[t.profileId]??e.id))].map(n=>{let r=En(e,n),i=t[n]??e.profileOrders[n]??[],a=e.profileOrderLocks[n],o=kn(r,i),s=e.profileOrderStoredProviders.includes(n),c=t[n]!==void 0||e.profileOrderExplicitProviders.includes(n),l=a?Sn(a):o?void 0:d(s?`modelProviders.profiles.partialStoredOrder`:`modelProviders.profiles.partialOrder`),u=new Map(r.map(e=>[e.profileId,e]));return{provider:n,order:i,lock:a,complete:o,stored:s,explicit:c,explanation:l,profiles:On(r,i).flatMap(e=>{let t=u.get(e);return t?[t]:[]})}})}function jn(e,t){return[...e.querySelectorAll(t)]}function Mn(e){e.classList.remove(In);for(let t of jn(e,`.model-providers__profile`))t.classList.remove(Fn),t.style.removeProperty(`translate`)}function Nn(e){if(!e.canMove||e.event.button!==0)return;let t=e.event.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.closest(`.model-providers__profile`),r=t.closest(`.model-providers__profiles`);if(!n||!r)return;let i=r.getBoundingClientRect().top,a=jn(r,`.model-providers__profile`).filter(t=>t.dataset.profileProvider===e.provider).map(e=>({element:e,bounds:e.getBoundingClientRect()})),o=a.find(e=>e.element===n);if(!o)return;let s=a.filter(e=>e!==o),c,l=`before`;e.event.preventDefault(),r.classList.add(In),n.classList.add(Fn);try{t.setPointerCapture?.(e.event.pointerId)}catch{}let u=t=>{if(t.pointerId!==e.event.pointerId)return;let u=i-r.getBoundingClientRect().top,d=t.clientY-e.event.clientY+u;n.style.translate=`${t.clientX-e.event.clientX}px ${d}px`;let f=document.elementFromPoint(t.clientX,t.clientY),p=f?.closest(`.model-providers__profile`),m=t.clientY+u,h=f&&r.contains(f)&&(!p||p.dataset.profileProvider===e.provider)&&a.some(({bounds:e})=>t.clientX>=e.left&&t.clientX<=e.right&&m>=e.top&&m<=e.bottom),g=(d>0?o.bounds.bottom:o.bounds.top)+d;c=h?s.find(({bounds:e})=>g<e.top+e.height/2):void 0,l=c?`before`:`after`,h&&!c&&(c=s.at(-1));let v=c?_(a,o,c,l):a;v.indexOf(o)===a.indexOf(o)&&(c=void 0);let y=a[0]?.bounds.top??0;for(let e of v)e!==o&&(e.element.style.translate=`0px ${y-e.bounds.top}px`),y+=e.bounds.height},d=(n,i)=>{if(n.pointerId!==e.event.pointerId)return;u(n);let a=c?.element.dataset.profileId;Mn(r),t.removeEventListener(`pointermove`,f),t.removeEventListener(`pointerup`,p),t.removeEventListener(`pointercancel`,m),t.removeEventListener(`lostpointercapture`,m),document.removeEventListener(`keydown`,h,!0);try{t.releasePointerCapture?.(e.event.pointerId)}catch{}i&&a&&e.move(a,l)},f=e=>u(e),p=e=>d(e,!0),m=e=>d(e,!1),h=t=>{t.key===`Escape`&&(t.preventDefault(),t.stopPropagation(),d(e.event,!1))};t.addEventListener(`pointermove`,f),t.addEventListener(`pointerup`,p),t.addEventListener(`pointercancel`,m),t.addEventListener(`lostpointercapture`,m),document.addEventListener(`keydown`,h,!0)}function Pn(e,t){if(e.profiles.length===0)return w;let n=An(e,t.profileOrders),r=new Map(e.profiles.map((e,t)=>[e.profileId,e.email||e.displayName||d(`modelProviders.profiles.account`,{number:String(t+1)})])),i=n.flatMap(e=>e.profiles.map(t=>({group:e,profile:t}))),a=n.some(e=>!e.lock&&e.complete&&e.order.length>1),o=[...new Set(n.flatMap(e=>e.explanation?[e.explanation]:[]))],s=xn(e);return C`
    <section
      class="model-providers__profiles"
      aria-label=${`${d(`modelProviders.profiles.title`)}: ${e.displayName}`}
    >
      <div class="model-providers__profiles-heading">
        <div class="model-providers__profiles-heading-copy">
          <strong>${d(`modelProviders.profiles.title`)}</strong>
          <span
            >${d(i.length===1?`modelProviders.profiles.accountOne`:`modelProviders.profiles.accounts`,{count:String(i.length)})}${s?` · ${s}`:``}</span
          >
          ${a?C`<span>${d(`modelProviders.profiles.reorderHint`)}</span>`:w}
          ${o.map(e=>C`<span>${e}</span>`)}
        </div>
        <div class="model-providers__profiles-heading-actions">
          ${e.profileOrderStoredProviders.map(n=>C`<button
              type="button"
              class="btn btn--sm btn--ghost"
              ?disabled=${!t.canMutate}
              title=${t.canMutate?d(`modelProviders.profiles.resetOrderHint`):t.mutationBlockedReason??``}
              @click=${()=>t.onProfileOrderChange(e.id,n,null)}
            >
              ${d(`modelProviders.profiles.resetOrder`)}
            </button>`)}
          ${t.onAddAccount?C`<button
                  type="button"
                  class="btn btn--sm"
                  ?disabled=${t.addAccountDisabled}
                  @click=${t.onAddAccount}
                >
                  ${d(`modelProviders.profiles.addAccount`)}
                </button>`:w}
        </div>
      </div>
      <div class="model-providers__profile-list" role="list">
        ${ge(i,({profile:e})=>e.profileId,({profile:n,group:i})=>{let{provider:a,order:o,complete:s,lock:c,stored:l,explicit:u}=i,f=o.indexOf(n.profileId),p=t.canMutate&&!c&&s&&o.length>1&&f>=0,m=!c&&(s||l)&&o.length>1,h=r.get(n.profileId),g=Cn(n),v=Dn(e,n.profileId),y=d(`modelProviders.logout.actionFor`,{account:h}),b=t.canMutate?y:t.mutationBlockedReason??``,ee=t.canMutate?i.explanation??``:t.mutationBlockedReason??``,x=(r,i)=>{p&&t.onProfileOrderChange(e.id,a,_(o,n.profileId,r,i))},te=(e,t)=>{let n=o[f+t];if(!p||!n)return;let r=e.currentTarget,i=r instanceof HTMLButtonElement&&document.activeElement===r;x(n,t<0?`before`:`after`),i&&queueMicrotask(()=>{r.isConnected&&document.activeElement===document.body&&r.focus({preventScroll:!0})})};return C`
              <div
                class="model-providers__profile"
                role="listitem"
                data-profile-id=${n.profileId}
                data-profile-provider=${a}
              >
                <span class="model-providers__profile-order">
                  ${m?C`<button
                          type="button"
                          class="model-providers__profile-grip"
                          ?disabled=${!p}
                          aria-label=${d(`modelProviders.profiles.reorder`,{account:h,position:String(f+1)})}
                          aria-keyshortcuts=${p?`ArrowUp ArrowDown`:w}
                          title=${ee||d(`modelProviders.profiles.reorderHint`)}
                          @pointerdown=${e=>Nn({event:e,canMove:p,provider:a,move:x})}
                          @keydown=${e=>{(e.key===`ArrowUp`||e.key===`ArrowDown`)&&(e.preventDefault(),te(e,e.key===`ArrowUp`?-1:1))}}
                        >
                          ${O.gripVertical}
                        </button>`:C`<span aria-hidden="true"></span>`}
                  ${u&&s&&f>=0?C`<span
                          class="model-providers__profile-position"
                          aria-label=${d(`modelProviders.profiles.priority`,{position:String(f+1)})}
                          title=${d(`modelProviders.profiles.priority`,{position:String(f+1)})}
                          >${f+1}</span
                        >`:w}
                </span>
                <span class="model-providers__profile-avatar" aria-hidden="true"
                  >${wn(h)}</span
                >
                <div class="model-providers__profile-copy">
                  <strong>${h}</strong>
                  ${g?C`<span>${g}</span>`:w}
                  <details>
                    <summary>${d(`modelProviders.profiles.details`)}</summary>
                    <div>${n.profileId}</div>
                    ${n.expiry?C`<span>${d(`modelProviders.expiresIn`,{time:n.expiry.label})}</span>`:w}
                  </details>
                </div>
                ${a===`openai`&&n.type!==`api_key`?C`<testclaw-model-account-usage
                        .client=${t.usageClient??null}
                        .agentId=${t.usageAgentId??``}
                        .profileId=${n.profileId}
                      ></testclaw-model-account-usage>`:w}
                <span class="model-providers__profile-status"
                  >${Tn(n,e.catalogStatus===`auth-rejected`)}</span
                >
                <span class="model-providers__profile-actions">
                  ${n.logoutSupported===!0&&v?C`<button
                          type="button"
                          class="model-providers__profile-logout"
                          aria-label=${y}
                          title=${b}
                          ?disabled=${!t.canMutate||t.busy[`logout:${e.id}`]}
                          @click=${()=>t.onRequestLogout({cardId:e.id,label:h,target:{provider:v,profileIds:[n.profileId]}})}
                        >
                          ${Ln}
                        </button>`:w}
                </span>
              </div>
            `})}
      </div>
    </section>
  `}var Fn,In,Ln;function Rn(){return(Rn=e((()=>{T(),_n(),ve(),Se(),k(),R(),g(),pt(),ze(),me(),U(),ft(),Fn=`model-providers__profile--dragging`,In=`model-providers__profiles--sorting`,Ln=Ee(ye` <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  <polyline points="16 17 21 12 16 7" />
  <line x1="21" x2="9" y1="12" y2="12" />`)})))()}function Y(e,t,n){let r={...e};return n===null?delete r[t]:r[t]=n,r}var zn;function Bn(){return(Bn=e((()=>{M(),St(),zn=class{constructor(e,t){this.options=t,this.pending=new Set,this.usageTask=this.createTask(e,`usage`,xt,e=>({providerUsage:e}),(e,t)=>this.options.refreshPolicy.markProviderUsage(e,Date.now(),t)),this.costTask=this.createTask(e,`cost`,Ct,e=>({costByProvider:e}))}get loading(){return this.pending.size>0}get usageLoading(){return this.pending.has(`usage`)}adoptCoreData(e,t,n={}){let r=e===this.options.getDataClient()?this.options.getData():null;this.options.setData({...t,...n.preserveCatalogDiagnostics&&r?{providerOutcomes:r.providerOutcomes,catalogError:r.catalogError}:{},providerUsage:r?.providerUsage??t.providerUsage,costByProvider:r?.costByProvider??t.costByProvider}),this.options.setDataClient(e),t.providerUsage!==null&&this.options.refreshPolicy.markProviderUsage(t.providerUsage,t.updatedAt,this.options.getGateway().epoch),e&&!this.options.isCoreLoading()&&!this.loading&&t.providerUsage===null&&t.costByProvider===null&&this.load(e)}invalidate(){this.options.refreshPolicy.interrupt(),this.cancelGeneration()}beginCoreRefresh(e){this.cancelGeneration(),e&&this.options.refreshPolicy.resetPayload()}cancelGeneration(){this.pending.clear();let e=this.options.getGateway().epoch;this.usageTask.run([null,e]),this.costTask.run([null,e])}load(e){return this.loadRequests(e,!0)}loadUsage(){return this.loadRequests(void 0,!1)}async loadRequests(e,t){let n=this.options.getGateway(),r=e??n.client;if(!n.connected||!r){this.options.refreshPolicy.markLoadDeferred();return}this.options.refreshPolicy.beginLoad(),this.pending.add(`usage`);let i=this.usageTask.run([r,n.epoch]);if(!t){await i;return}this.pending.add(`cost`),await Promise.all([i,this.costTask.run([r,n.epoch])])}createTask(e,t,n,r,i){return new A(e,{autoRun:!1,task:([e,t],{signal:r})=>e?n(e,r).then(n=>({client:e,data:n,epoch:t})):j,onComplete:({client:e,data:n,epoch:a})=>{this.pending.delete(t);let o=this.options.getData();o&&e===this.options.getDataClient()&&this.options.getGateway().isCurrent({client:e,epoch:a})&&(this.options.setData({...o,...r(n)}),i?.(n,a)),this.options.refreshPolicy.flushPending()},onError:()=>{this.pending.delete(t),this.options.refreshPolicy.flushPending()}})}}})))()}function Vn(e,t){let n=new Set,r=[];for(let i of e){let e=q(i);n.has(e)||(n.add(e),r.push(Hn(i,t)))}return r.toSorted((e,t)=>e.label.localeCompare(t.label))}function Hn(e,t){let n=q(e),r=t.get(Ge(e.provider)),i=r?Ke(r,{authProfileId:l(n).profile,projection:`available-credentials`}):void 0;return{value:n,label:e.name||n,...i?{detail:[i.label,i.detail].filter(Boolean).join(` · `)}:{},...e.available===!1?{disabled:!0}:{},...e.provider?{provider:e.provider}:{}}}function Un(e){return C`
    <span class="model-providers__label-with-help">
      <span>${e.title}</span>
      <span class="settings-section__docs">
        <testclaw-tooltip open-on-click>
          <button
            id=${e.triggerId}
            type="button"
            class="settings-section__help-button model-providers__help-button"
            aria-label=${e.label}
            @keydown=${e=>{e.key===`Escape`&&e.stopPropagation()}}
          >
            ${O.info}
          </button>
          <div slot="content" class="settings-section__help-panel">${e.body}</div>
        </testclaw-tooltip>
      </span>
    </span>
  `}function Wn(e){return e===`auto`?`auto`:e===`on`}function Gn(e){return C`
    ${e.catalogDiscovering?C`
            <div class="model-providers__catalog-progress" role="status" aria-live="polite">
              <span class="btn__spinner" aria-hidden="true"></span>
              <span>${d(`modelProviders.defaults.discoveringMore`)}</span>
            </div>
          `:w}
    ${e.catalogDiscoveryError?C`
            <div class="model-providers__catalog-progress" role="alert" aria-live="polite">
              <span>${d(`modelProviders.defaults.discoverFailed`)}</span>
              <button class="btn btn--sm" type="button" @click=${e.onCatalogRetry}>
                ${d(`modelProviders.defaults.retryDiscover`)}
              </button>
            </div>
          `:w}
  `}function Kn(e){let t=!e.canMutate||e.models.length===0,n=!e.canMutate,r=!!e.busy.defaults,i=e.mutationBlockedReason??``,a=e.thinkingLevel&&!Zn.has(e.thinkingLevel)?[...Z,e.thinkingLevel]:Z,o=e.fastMode===void 0?``:dt(e.fastMode),s=e.selection.fallbacks[0]??``,c=new Map(Le(e.authStatus?.providers??[]).map(e=>[e.provider,e])),u=Vn(e.models,c),f=e.automaticUtilityModel,p=f?l(f).model:``,m=e.models.find(e=>q(e)===p),h=f?Hn({...m??{id:p,name:p,provider:p.split(`/`,1)[0]??``},selectionRef:f},c):void 0,g=C`
    <div class="model-providers__defaults">
      ${!e.loading&&e.models.length===0?C`<div class="callout warning">${d(`modelProviders.defaults.noModels`)}</div>`:w}
      ${P({title:d(`modelProviders.defaults.primary`),control:gt({label:d(`modelProviders.defaults.primary`),value:e.selection.primary,options:[{value:``,label:d(`modelProviders.defaults.selectModel`),disabled:!!e.selection.primary},...u],disabled:t||r,title:i,showSelectedDetail:!0,onChange:e.onPrimaryChange})})}
      ${P({title:Un({title:d(`modelProviders.defaults.utility`),label:d(`modelProviders.defaults.utilityHelpLabel`),triggerId:Jn,body:C`
            <p>${d(`modelProviders.defaults.utilityHelpPurpose`)}</p>
            <p>${d(`modelProviders.defaults.utilityHelpAutomatic`)}</p>
          `}),control:gt({id:qn,label:d(`modelProviders.defaults.utility`),value:e.selection.utilityModel??X,options:[{value:X,label:e.automaticUtilityModel?`${d(`quickSettings.model.fastModes.auto`)} · ${h?.label??e.automaticUtilityModel}`:d(`quickSettings.model.fastModes.auto`),provider:h?.provider,detail:f===null?d(`modelProviders.defaults.automaticUnavailable`):h?.detail},{value:``,label:d(`modelProviders.defaults.disabled`)},...u],disabled:t||r,title:i,showSelectedDetail:!0,onChange:t=>e.onUtilityChange(t===X?null:t)})})}
      ${P({title:d(`chat.modelControls.decisionLabel`),description:d(`chat.modelControls.decisionHelp`),control:vt({id:`model-providers-decision-model`,models:e.decisionModels,value:e.selection.decisionModel,disabled:!e.canMutate||r,title:i,onChange:e.onDecisionChange})})}
      ${P({title:d(`modelProviders.defaults.fallback`),control:gt({label:d(`modelProviders.defaults.fallback`),value:s,options:[{value:``,label:d(`modelProviders.defaults.noFallback`)},...u.filter(t=>t.value!==e.selection.primary)],disabled:t||r||!e.selection.primary,title:i,showSelectedDetail:!0,onChange:t=>e.onFallbackChange(t||null)})})}
      ${P({title:Un({title:d(`quickSettings.model.thinking`),label:d(`modelProviders.defaults.thinkingHelpLabel`),triggerId:Yn,body:C`
            <p>${d(`modelProviders.defaults.thinkingHelp`)}</p>
            <p>${d(`modelProviders.defaults.thinkingDefaultHelp`)}</p>
          `}),control:C`
          ${ot({value:e.thinkingLevel??``,ariaLabel:d(`quickSettings.model.thinking`),options:[{value:``,label:d(`quickSettings.model.default`)},...a.map(e=>({value:e,label:Zn.has(e)?d(`quickSettings.model.thinkingLevels.${e}`):Fe(e)}))],disabled:r||n,onChange:(t,n)=>t===``?e.onThinkingReset():e.onThinkingChange(t,n),onReselect:t=>{t===``&&e.thinkingOverridden&&e.onThinkingReset()}})}
        `})}
      ${P({title:Un({title:d(`quickSettings.model.fastMode`),label:d(`modelProviders.defaults.fastModeHelpLabel`),triggerId:Xn,body:C`
            <p>${d(`modelProviders.defaults.fastModeHelp`)}</p>
            <p>${d(`modelProviders.defaults.fastModeDefaultHelp`)}</p>
          `}),control:C`
          ${ot({value:o,ariaLabel:d(`quickSettings.model.fastMode`),options:[{value:``,label:d(`quickSettings.model.default`)},{value:`auto`,label:d(`quickSettings.model.fastModes.auto`)},{value:`on`,label:d(`quickSettings.model.fastModes.on`)},{value:`off`,label:d(`quickSettings.model.fastModes.off`)}],disabled:r||n,onChange:t=>{t===``?e.onFastModeReset():t!==o&&e.onFastModeChange(Wn(t))},onReselect:t=>{t===``&&e.fastModeOverridden&&e.onFastModeReset()}})}
        `})}
      ${Gn(e)}
      ${e.canMutate&&e.message?C`<div
              class="callout ${e.message.kind}"
              role=${e.message.kind===`error`?`alert`:`status`}
            >
              ${e.message.text}
            </div>`:w}
      ${e.canMutate&&e.message?.warning?C`<div class="callout warning" role="status">${e.message.warning}</div>`:w}
    </div>
  `;return I({title:d(`modelProviders.defaults.title`),description:d(`modelProviders.defaults.subtitle`)},g)}var X,qn,Jn,Yn,Xn,Z,Zn;function Qn(){return(Qn=e((()=>{T(),Oe(),ut(),yt(),k(),_t(),R(),g(),Ie(),Pe(),Ye(),sn(),X=`__testclaw_automatic_utility__`,qn=`model-providers-utility-model`,Jn=`model-providers-utility-help`,Yn=`model-providers-thinking-help`,Xn=`model-providers-fast-mode-help`,Z=ke.filter(e=>e!==`minimal`),Zn=new Set(Z)})))()}function Q(e){return!e.canMutate||e.configBusy}function $n(e){return e.modelCount===0?null:e.availableModelCount<e.modelCount?d(`modelProviders.modelsAvailable`,{available:String(e.availableModelCount),count:String(e.modelCount)}):e.modelCount===1?d(`modelProviders.modelOne`):d(`modelProviders.models`,{count:String(e.modelCount)})}function er(e,t){let n=e.localCost;return!n||n.totalTokens===0&&n.totalCost===0?w:C`
    <div class="model-providers__local-cost">
      <div class="provider-usage-billing-row">
        <span>${d(`modelProviders.localCost`,{days:String(t)})}</span>
        <strong>${fe(n.totalCost)}</strong>
      </div>
      <div class="model-providers__local-cost-detail">
        ${d(`modelProviders.localCostDetail`,{tokens:se(n.totalTokens),messages:String(n.messageCount)})}
      </div>
    </div>
  `}function tr(e,t){let n=e.profiles.filter(e=>e.type===`oauth`).length,r=e.profiles.filter(e=>e.type===`token`).length,i=e.profiles.filter(e=>e.type===`api_key`).length,a=[];return n>0&&a.push(d(`modelProviders.credentials.oauth`,{count:String(n)})),r>0&&a.push(d(`modelProviders.credentials.tokenProfiles`,{count:String(r)})),e.apiKey?.source===`config`?a.push(d(`modelProviders.credentials.configKey`)):e.apiKey?.source===`env`?a.push(e.apiKey.envVar?d(`modelProviders.credentials.envKeyNamed`,{name:e.apiKey.envVar}):d(`modelProviders.credentials.envKey`)):i>0&&a.push(d(`modelProviders.credentials.profileKey`,{count:String(i)})),C`
    <div class="model-providers__credentials">
      <span>${d(`modelProviders.credentials.label`,{agent:t})}</span>
      <strong
        >${a.length>0?a.join(` · `):d(`modelProviders.credentials.none`)}</strong
      >
    </div>
  `}function nr(e){if(!e)return w;let t=e.status===`ok`&&e.results.some(e=>e.status!==`ok`),n=t?`warning`:e.status===`ok`?`success`:`error`;return C`
    <div class="model-providers__probe model-providers__probe--${n}" role="status">
      <div class="model-providers__probe-summary">
        <strong
          >${d(t?`modelProviders.probe.status.partial`:`modelProviders.probe.status.${e.status}`)}</strong
        >
        ${e.latencyMs===void 0?w:C`<span
                >${d(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}</span
              >`}
      </div>
      ${e.error?C`<div>${he(e.error)}</div>`:w}
      ${e.results.map(e=>C`
          <div class="model-providers__probe-target">
            <span>${e.label}</span>
            <span>
              ${d(`modelProviders.probe.status.${e.status}`)}${e.latencyMs===void 0?``:` · ${d(`modelProviders.probe.latency`,{ms:String(e.latencyMs)})}`}
            </span>
            ${e.error?C`<small>${he(e.error)}</small>`:w}
          </div>
        `)}
    </div>
  `}function rr(e,t){if(t.keyEditorProvider!==e.id)return w;let n=!!t.busy[`key:${e.id}`],r=e.apiKeySupported===!1||!!(e.configAuthMode&&e.configAuthMode!==`api-key`),i=Q(t);return C`
    <div class="model-providers__inline-form">
      <label class="field">
        <span>${d(`modelProviders.apiKey.label`)}</span>
        <input
          type="password"
          autocomplete="off"
          placeholder=${e.apiKey?.source===`config`?d(`modelProviders.apiKey.replacePlaceholder`):d(`modelProviders.apiKey.placeholder`)}
          .value=${t.keyDraft}
          ?disabled=${n||i||r}
          @input=${e=>t.onKeyDraftChange(e.target.value)}
        />
      </label>
      <div class="model-providers__form-actions">
        <button
          class="btn primary btn--sm"
          ?disabled=${n||i||r||!t.keyDraft.trim()}
          @click=${()=>t.onSaveKey(e.id,e.configKey??e.id)}
        >
          ${d(n?`modelProviders.saving`:`common.save`)}
        </button>
        <button class="btn btn--sm" ?disabled=${n} @click=${()=>t.onCloseKeyEditor()}>
          ${d(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function ir(e,t){let n=e.credentialProviderIds.length?e.credentialProviderIds:[e.id],r=e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0,i=!!t.busy[`probe:${e.id}`],a=!!t.busy[`key:${e.id}`],o=t.mutationBlockedReason??``,s=!!(e.configAuthMode&&e.configAuthMode!==`api-key`),c=e.apiKeySupported===!1,l=Q(t),u=s?d(`modelProviders.apiKey.authModeBlocked`,{mode:e.configAuthMode??``}):o;return C`
    <div class="model-providers__card-actions">
      ${t.canConnect(e)&&e.profiles.length===0?C`<button
              class="btn btn--sm"
              data-models-connect-provider=${e.id}
              ?disabled=${l||t.loginBusy}
              @click=${()=>t.onConnect(e)}
            >
              ${d(`modelProviders.login.action`)}
            </button>`:w}
      ${r?C`
              <button
                class="btn btn--sm"
                ?disabled=${i||!t.canMutate||!t.probeAvailable}
                title=${t.probeAvailable?o:d(`modelProviders.probe.unavailable`)}
                @click=${()=>t.onProbe(e.id,n)}
              >
                ${d(i?`modelProviders.probe.testing`:`modelProviders.probe.test`)}
              </button>
            `:w}
      ${c?w:C`
              <button
                class="btn btn--sm"
                ?disabled=${a||l||s}
                title=${u}
                @click=${()=>t.onOpenKeyEditor(e.id)}
              >
                ${d(`modelProviders.apiKey.set`)}
              </button>
            `}
      ${e.hasConfigApiKey||e.profiles.some(e=>e.type===`api_key`&&e.logoutSupported)?C`
              <button
                class="btn btn--sm danger"
                ?disabled=${a||l||s}
                title=${u}
                @click=${()=>t.onRemoveKey(e.id,e.configKey??e.id)}
              >
                ${d(`modelProviders.apiKey.remove`)}
              </button>
            `:w}
    </div>
  `}function ar(e,t){let n=$n(e),r=t.messages[`key:${e.id}`]??t.messages[e.id];return C`
    <div
      class="settings-row settings-row--stacked model-providers__row"
      data-provider-id=${e.id}
    >
      <div class="model-providers__head">
        <div class="model-providers__identity">
          ${Qe(e.id,{className:`model-providers__icon`})}
          <div class="settings-row__text">
            <span class="settings-row__title">${e.displayName}</span>
            <span class="settings-row__desc"
              >${e.id}${n?C` · ${n}`:w}</span
            >
          </div>
        </div>
        <div class="settings-row__control">
          ${e.usage?.plan?nt(e.usage.plan):w}
          ${kt(e)}
        </div>
      </div>
      ${e.profiles.length>0&&t.canViewProfiles?Pn(e,{usageClient:t.usageClient,usageAgentId:t.usageAgentId,busy:t.busy,canMutate:t.canMutate&&!t.configBusy,mutationBlockedReason:t.mutationBlockedReason,profileOrders:t.profileOrders,onAddAccount:t.canConnect(e)?()=>t.onConnect(e):void 0,addAccountDisabled:t.loginBusy||Q(t),onProfileOrderChange:t.onProfileOrderChange,onRequestLogout:t.onRequestLogout}):tr(e,t.credentialAgentLabel)}
      <div
        class="model-providers__global-metrics"
        aria-busy=${t.supplementalLoading?`true`:`false`}
      >
        <div class="model-providers__global-metrics-title">${d(`modelProviders.globalUsage`)}</div>
        ${e.usage?Ot(e.usage):C`<div class="model-providers__no-stats">
                ${d(t.supplementalLoading?`common.loading`:`modelProviders.noStats`)}
              </div>`}
        ${er(e,t.costDays)}
      </div>
      ${ir(e,t)} ${rr(e,t)}
      ${nr(t.probeResults[e.id])} ${jt(r)}
    </div>
  `}function or(e){if(!e.addProviderOpen)return w;let t=!!e.busy.add,n=Q(e)||t,r=e.unconfiguredProviders.find(t=>t.id===e.addProviderId);return C`
    <testclaw-modal-dialog
      label=${d(`modelProviders.add.title`)}
      @modal-cancel=${n=>{n.preventDefault(),t||e.onAddProviderToggle()}}
    >
      <div class="model-setup-wizard" data-models-key-dialog>
        <div class="model-setup-wizard__header">
          <h2>${r?.displayName??e.addProviderId}</h2>
        </div>
        <div class="model-setup-wizard__body">
          <p>${d(`modelProviders.credentials.label`,{agent:e.credentialAgentLabel})}</p>
          <label class="field">
            <span>${d(`modelProviders.apiKey.label`)}</span>
            <input
              type="password"
              autocomplete="off"
              placeholder=${d(`modelProviders.apiKey.placeholder`)}
              .value=${e.addProviderKey}
              ?disabled=${n}
              @input=${t=>e.onAddProviderKeyChange(t.target.value)}
            />
          </label>
          ${jt(e.messages.add)}
        </div>
        <div class="model-setup-wizard__footer">
          <button class="btn" ?disabled=${t} @click=${e.onAddProviderToggle}>
            ${d(`common.cancel`)}
          </button>
          <button
            class="btn primary"
            ?disabled=${n||!e.addProviderId||!e.addProviderKey.trim()}
            @click=${e.onAddProvider}
          >
            ${d(t?`modelProviders.saving`:`modelProviders.add.save`)}
          </button>
        </div>
      </div>
    </testclaw-modal-dialog>
  `}function sr(e){let t=e.cards.some(Lt);return C`
    <div class="model-providers__setup" data-model-readiness="model-required">
      ${I({title:d(`modelProviders.readiness.title`)},P({title:d(`modelProviders.readiness.heading`),description:d(t?`modelProviders.readiness.signedInNoModels`:`modelProviders.readiness.notConfigured`),control:C`
            ${N({kind:`warn`,label:d(t?`modelProviders.readiness.noModels`:`modelProviders.readiness.modelRequired`)})}
            <button
              class="btn primary"
              ?disabled=${Q(e)||e.loginBusy}
              title=${e.mutationBlockedReason??``}
              @click=${e.onConnectProvider}
            >
              ${d(`modelProviders.login.action`)}
            </button>
          `}))}
    </div>
  `}function cr(e){return C`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__desc provider-usage-error">${e}</span>
      </div>
    </div>
  `}function lr(e){if(!e.connected)return lt(L(z(d(`modelProviders.disconnected`))));let t=(e.providerQuery??``).trim().toLocaleLowerCase(),n=e.cards.filter(e=>[e.id,e.displayName,...e.credentialProviderIds].some(e=>e.toLocaleLowerCase().includes(t))),r=C`
    <label class="field model-providers__search">
      <input
        type="search"
        aria-label=${d(`modelProviders.search`)}
        placeholder=${d(`modelProviders.search`)}
        .value=${e.providerQuery??``}
        @input=${t=>e.onProviderQueryChange?.(t.currentTarget.value)}
      />
    </label>
    <div class="model-providers__provider-list">
      ${e.error?L(cr(e.error)):w}
      ${e.providerUsageFailed?L(cr(d(`usage.providerUsage.unavailable`))):w}
      ${e.cards.length===0?L(z(C`<strong>${d(`modelProviders.emptyTitle`)}</strong><br />${d(`modelProviders.emptySubtitle`)}`)):n.map(t=>L(ar(t,e)))}
      ${e.cards.length>0&&n.length===0?z(d(`modelProviders.noMatches`)):w}
    </div>
  `,i=!e.loading&&!e.configuredModels.some(e=>e.available!==!1);return C`${lt(C`
    ${i?sr(e):w}
    <div id=${pe.behavior}>
      ${Kn({models:e.configuredModels,decisionModels:e.decisionModels,selection:e.defaultModels,authStatus:e.authStatus,automaticUtilityModel:e.automaticUtilityModel,thinkingLevel:e.thinkingLevel,thinkingOverridden:e.thinkingOverridden,fastMode:e.fastMode,fastModeOverridden:e.fastModeOverridden,loading:e.loading,catalogDiscovering:e.catalogDiscovering,catalogDiscoveryError:e.catalogDiscoveryError,canMutate:e.defaultsMutationBlockedReason===null&&!e.configBusy,mutationBlockedReason:e.defaultsMutationBlockedReason,busy:e.busy,message:e.messages.defaults,onPrimaryChange:e.onPrimaryChange,onFallbackChange:e.onFallbackChange,onUtilityChange:e.onUtilityChange,onDecisionChange:e.onDecisionChange,onThinkingChange:e.onThinkingChange,onThinkingReset:e.onThinkingReset,onFastModeChange:e.onFastModeChange,onFastModeReset:e.onFastModeReset,onCatalogRetry:e.onCatalogRetry})}
    </div>
    ${e.installedAgents}
    ${I({title:d(`modelProviders.accessTitle`),description:d(`modelProviders.accessDescription`),count:e.cards.length,actions:C`
          ${e.providerScope}
          ${e.updatedAt?C`<span class="model-providers__updated"
                  >${d(`modelProviders.updated`,{time:de(e.updatedAt,{hour:`numeric`,minute:`2-digit`})})}</span
                >`:w}
          <testclaw-tooltip
            .content=${e.refreshing?d(`modelProviders.refreshing`):d(`common.refresh`)}
          >
            <button
              type="button"
              class="btn btn--icon btn--ghost btn--xs model-providers__refresh-button"
              aria-label=${e.refreshing?d(`modelProviders.refreshing`):d(`common.refresh`)}
              ?disabled=${e.refreshing}
              @click=${()=>e.onRefresh()}
            >
              ${O.refresh}
            </button>
          </testclaw-tooltip>
        `},e.loading?L(rt()):e.cards.length===0&&e.installedAgents!==w&&!e.error&&!e.providerUsageFailed?w:r)}
    ${e.providerUsageStalled?C`<div class="callout warning" role="status">${d(`usage.providerUsage.stalled`)}</div>`:w}
  `)}${or(e)}`}function ur(e){return C`
    <span class="muted" data-models-provider-agent
      >${d(`agentScope.label`)}: ${e.agentLabel}</span
    >
    ${Ft(e)}
  `}function dr(e){return C`
    ${it({title:De(`model-providers`),subtitle:C`${d(`modelProviders.subtitle`)}
      ${at(`https://docs.testclaw.ai/concepts/model-providers`)}`})}
    ${mt(C`${jt(e.loginMessage)}${e.body}`)}
    ${e.login}
  `}function fr(){return(fr=e((()=>{T(),Te(),k(),$e(),Dt(),R(),ht(),g(),pt(),m(),re(),ce(),Qn(),Rn(),Nt(),ft()})))()}var $;function pr(){return(pr=e((()=>{i(),T(),_e(),Ce(),we(),st(),g(),f(),ne(),Ae(),Ne(),ee(),Ve(),h(),ie(),Tt(),zt(),U(),Zt(),sn(),un(),mn(),St(),It(),gn(),Rn(),Bn(),fr(),$=class extends p{constructor(...e){super(...e),this.mutationBlockedReason=()=>V(this.context)??(this.selectedAgentId?null:d(`agents.noAgents`)),this.canMutate=()=>this.mutationBlockedReason()===null&&!B(this.context),this.loaderPending=!1,this.data=null,this.busy={},this.messages={},this.probeResults={},this.keyEditorProvider=null,this.keyDraft=``,this.logoutConfirmation=null,this.profileOrders={},this.providerQuery=``,this.pendingConnection=!1,this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``,this.defaultsDraft=null,this.selectedAgentId=``,this.dataClient=null,this.routeDataObserved=!1,this.agentEpoch=0,this.coreCatalogGeneration=0,this.core=new Xt(this,{onStart:e=>{e!==`publication`&&this.catalogDiscovery.reset(),this.coreCatalogGeneration=this.catalogDiscovery.generation,this.supplemental.beginCoreRefresh(e===`forced`),e===`forced`&&this.querySelectorAll(`testclaw-model-account-usage`).forEach(e=>e.refreshUsage())},onComplete:({client:e,data:t})=>{let n=this.data!==null&&this.catalogDiscovery.generation!==this.coreCatalogGeneration;n||this.catalogDiscovery.reset(),this.supplemental.adoptCoreData(e,t,{preserveCatalogDiagnostics:n})},isCatalogLoading:()=>this.catalogDiscovery.discovering,refreshPublication:()=>void this.refresh(`publication`)}),this.refreshPolicy=new Et({isLoading:()=>this.loaderPending||!this.routeDataObserved||this.core.loading||this.supplemental.usageLoading,reload:()=>this.supplemental.loadUsage(),onIncompleteUsageExhausted:()=>this.requestUpdate()}),this.supplemental=new zn(this,{isCoreLoading:()=>this.loaderPending,getGateway:()=>this.gateway,getData:()=>this.data,getDataClient:()=>this.dataClient,setData:e=>this.data=e,setDataClient:e=>this.dataClient=e,refreshPolicy:this.refreshPolicy}),this.catalogDiscovery=Rt({getGateway:()=>this.gateway,getAgentId:()=>this.selectedAgentId,getAgentEpoch:()=>this.agentEpoch,getData:()=>this.data,setData:e=>this.data=e,requestUpdate:()=>this.requestUpdate(),onSettled:()=>this.core.flushPublication()}),this.gateway=new He(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetConnectionState(),invalidateRequests:()=>this.invalidateRequests(),ensureInitialData:()=>this.ensureInitialData(),onSnapshot:e=>{e.initial?this.resetConnectionState():e.connectionChanged&&!e.identityChanged&&this.resetConnectionState({preserveVisibleData:!0}),e.becameConnected&&!e.initial&&this.routeDataObserved&&!this.loaderPending&&this.refresh(`replacement`)},onPageActivation:()=>this.refreshPolicy.request(`focus`)}),this.installedAgents=new pn(this,{gateway:this.gateway,getContext:()=>this.context}),this.profileActions=new hn({getAgentEpoch:()=>this.agentEpoch,getAgentId:()=>this.selectedAgentId,getClient:()=>this.context.gateway.snapshot.client,getClientEpoch:()=>this.gateway.epoch,getData:()=>this.data,getOrders:()=>this.profileOrders,setData:e=>this.data=e,setError:(e,t)=>vn(t),setOrders:e=>this.profileOrders=e,clearMessage:e=>this.setMessage(e,null),canMutate:()=>this.canMutate(),cancelRefresh:()=>this.cancelCoreRefresh(),refresh:()=>this.refresh(`forced`),isCurrentClient:(e,t)=>this.gateway.isCurrent({client:e,epoch:t}),isBusy:e=>!!this.busy[e],setBusy:(e,t)=>this.setBusy(e,t),setProbeResult:(e,t)=>this.probeResults=Y(this.probeResults,e,t),setProbeError:(e,t)=>this.setMessage(e,{kind:`error`,text:t}),setLogoutSuccess:yn,getConfig:()=>this.context.runtimeConfig}),this.discovery=new ln(this,{canOpen:()=>this.canMutate(),getOwner:()=>({client:this.gateway.client,epoch:this.gateway.epoch,agentEpoch:this.agentEpoch,agentId:this.context.settingsAgentSelection.state.selectedId,selectionIntentRevision:this.context.settingsAgentSelection.intentRevision,selectionPending:this.context.settingsAgentSelection.state.selectedId===null&&this.context.agents.state.agentsList===null}),isCurrent:e=>!!(this.isConnected&&e.client&&this.gateway.isCurrent({client:e.client,epoch:e.epoch})&&this.agentEpoch===e.agentEpoch),onClose:()=>void this.refresh(`replacement`),onConnectChoice:e=>void this.login.open(void 0,e),onError:e=>this.setMessage(`connection`,{kind:`error`,text:H(e)})}),this.login=new Pt(this,{getScope:()=>({context:this.context,agentId:this.selectedAgentId,authStatus:this.data?.authStatus??null}),canStart:()=>this.canMutate(),onDiscover:()=>{this.setMessage(`connection`,null),this.discovery.open()},onApiKey:e=>{this.addProviderId=e,this.addProviderKey=``,this.addProviderOpen=!0,this.setMessage(`add`,null)},canContinue:()=>this.mutationBlockedReason()===null,refresh:()=>this.refresh(`replacement`)}),this.subscriptions=new oe(this).effect(()=>this.context?.gateway,e=>Re(e,()=>void this.refresh(`publication`))).effect(()=>this.context?.gateway,e=>this.installedAgents.subscribe(e)).watch(()=>this.context?.gateway.snapshot.client,Ue).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t),e=>{!e.state.configSnapshot&&!e.state.configLoading&&e.ensureLoaded().catch(()=>void 0),this.profileActions.flushPendingOrders()}).watch(()=>this.context?.overlays,(e,t)=>e.subscribe(t),()=>this.profileActions.flushPendingOrders()).watch(()=>this.context?.agents,(e,t)=>e.subscribe(t),()=>this.syncSelectedAgent()).effect(()=>this.context?.settingsAgentSelection,e=>e.subscribe(()=>this.syncSelectedAgent())),this.setBusy=(e,t)=>this.busy=Y(this.busy,e,t?!0:null),this.setMessage=(e,t)=>this.messages=Y(this.messages,e,t)}disconnectedCallback(){this.profileActions.resetOrders(),this.subscriptions.clear(),this.refreshPolicy.dispose(),super.disconnectedCallback()}willUpdate(e){(e.has(`routeData`)||e.has(`loaderPending`))&&this.routeData!==void 0&&(this.routeData.connect&&!e.get(`routeData`)?.connect&&(this.pendingConnection=!0),this.cancelCoreRefresh(),this.routeDataObserved=!0,this.setSelectedAgent(this.resolveSelectedAgentId()),(this.routeData.agentId??``)===this.selectedAgentId&&this.routeData.selectionIntentRevision===this.context.settingsAgentSelection.intentRevision&&this.gateway.isRouteDataCurrent(this.routeData)?this.supplemental.adoptCoreData(this.routeData.client,this.routeData.data):(this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload()),this.ensureInitialData())}updated(){this.isConnected&&this.pendingConnection&&this.data&&this.canMutate()&&!this.core.loading&&(this.pendingConnection=!1,this.login.open())}ensureInitialData(){!this.context.agents.state.agentsList&&!this.context.agents.state.agentsLoading&&!this.context.agents.state.agentsError&&this.context.agents.ensureList();let e=this.gateway.client;this.routeDataObserved&&!this.loaderPending&&this.gateway.connected&&e&&this.selectedAgentId&&!this.core.loading&&(this.data===null||this.data.updatedAt===null||e!==this.dataClient)&&this.refresh(`replacement`)}cancelCoreRefresh(){this.catalogDiscovery.reset(),this.core.invalidate()}invalidateRequests(){this.logoutConfirmation?.abort(),this.cancelCoreRefresh(),this.supplemental.invalidate()}resetConnectionState(e={}){e.preserveVisibleData||(this.data=null,this.dataClient=null),this.refreshPolicy.resetPayload(),this.discovery.cancelLoading(),this.installedAgents.reset(e),this.resetAgentScopeState(),this.profileActions.resetProbes(),this.defaultsDraft=null}resetAgentScopeState(){this.login.reset(),this.busy={},this.messages={},this.probeResults={},this.closeKeyEditor(),this.logoutConfirmation?.abort(),this.profileActions.resetOrders(),this.addProviderOpen=!1,this.addProviderId=``,this.addProviderKey=``}resolveSelectedAgentId(){let e=this.context.settingsAgentSelection.state.selectedId;return e?s(e):``}setSelectedAgent(e){return e!==this.selectedAgentId&&(this.selectedAgentId=e,this.agentEpoch+=1,this.resetAgentScopeState(),!0)}syncSelectedAgent(){this.setSelectedAgent(this.resolveSelectedAgentId())&&(this.invalidateRequests(),this.data=null,this.dataClient=null,this.refreshPolicy.resetPayload(),this.requestUpdate(),this.ensureInitialData())}refresh(e){if(!this.selectedAgentId)return Promise.resolve();let t=this.gateway.client;return!this.gateway.connected||!t?(this.refreshPolicy.markLoadDeferred(),Promise.resolve()):this.core.refresh(t,this.selectedAgentId,e)}async patchConfig(e){let t=this.context.gateway.snapshot.client;if(!t||V(this.context)||B(this.context)||this.busy[e.key])return;let n=this.gateway.epoch,r=this.agentEpoch;return Gt({runtimeConfig:this.context.runtimeConfig,isCurrentClient:()=>this.gateway.isCurrent({client:t,epoch:n}),isCurrentAgent:()=>this.agentEpoch===r,setBusy:t=>this.setBusy(e.key,t),setMessage:t=>this.setMessage(e.key,t)},e)}openKeyEditor(e){this.keyEditorProvider=e,this.keyDraft=``,this.setMessage(e,null)}closeKeyEditor(){this.keyEditorProvider=null,this.keyDraft=``}async mutateApiKey(e,t,n,r=`edit`){let i=this.gateway.client,a=r===`add`?`add`:`key:${e}`;if(!i||!this.canMutate()||this.busy[a]||n===``)return;let o=this.gateway.epoch,s=this.agentEpoch,c=()=>this.gateway.isCurrent({client:i,epoch:o})&&this.agentEpoch===s;this.profileActions.clearProbe(e);let l=await Kt({runtimeConfig:this.context.runtimeConfig,isCurrentClient:c,isCurrentAgent:c,canMutate:()=>this.canMutate(),refreshProviders:async()=>{let e=this.data;if(await this.refresh(`replacement`),c()&&this.data?.error){let t=this.data.error;return this.data=e,t}return this.data?.error??this.data?.catalogError??null},setBusy:e=>this.setBusy(a,e),setMessage:t=>{this.setMessage(e,t),r===`add`&&this.setMessage(`add`,t)}},{client:i,agentId:this.selectedAgentId,provider:t,apiKey:n,success:qt(r,n,e)});l.ok&&c()&&(r===`add`?this.addProviderId===e&&this.addProviderKey.trim()===n&&(this.addProviderOpen=!!l.warning,l.warning||(this.addProviderId=``),this.addProviderKey=``):this.keyEditorProvider===e&&this.keyDraft.trim()===n&&this.closeKeyEditor())}async requestLogout(e){if(this.logoutConfirmation||!this.canMutate()||this.busy[`logout:${e.cardId}`])return;let t=new AbortController;this.logoutConfirmation=t,await ct({title:d(`modelProviders.logout.actionFor`,{account:e.label}),message:d(`modelProviders.logout.confirm`,{provider:e.label}),confirmLabel:d(`modelProviders.logout.action`),danger:!0,signal:t.signal}).finally(()=>{this.logoutConfirmation=null})&&!t.signal.aborted&&this.canMutate()&&await this.profileActions.logout(e.cardId,e.target)}async addProvider(){let e=this.addProviderId;e&&await this.mutateApiKey(e,e,this.addProviderKey.trim(),`add`)}async saveDefaults(e=this.defaultsDraft){e&&(await this.patchConfig({key:`defaults`,raw:Ht(e),note:d(`modelProviders.notes.defaultModel`),replacePaths:Jt}),this.defaultsDraft===e&&(this.defaultsDraft=null))}render(){let e=this.context.gateway.snapshot,t=e.hello?.auth,r=this.context.agents.state,i=r.agentsList?.agents??[],a=r.agentsList!==null&&le(i).length===0,o=r.agentsList?null:r.agentsError,c=i.find(e=>s(e.id)===this.selectedAgentId),l=this.data??wt,u=S(this.context.runtimeConfig.state),f=rn(u),p=e.client&&this.selectedAgentId?qe(e.client,{agentId:this.selectedAgentId},{allowStale:!0}):void 0,m={...f.defaults,...Vt(n(n(u?.agents)?.defaults))},h=this.defaultsDraft??m,g=e=>{this.defaultsDraft={...this.defaultsDraft??m,...e},this.setMessage(`defaults`,null),this.saveDefaults(this.defaultsDraft)},_=tn({...l,models:p?.models??null,providerOutcomes:p?p.providerOutcomes??[]:l.providerOutcomes,pendingProviders:p?.pendingProviders,providerUsage:l.providerUsage?.ok?l.providerUsage.value:null,configProviderIds:f.providerIds,configApiKeyProviderIds:f.apiKeyProviderIds,configProviderAuthModes:f.providerAuthModes}),y=new Set([...f.providerIds,...l.authStatus?.providers.filter(e=>!!e.apiKey||e.profiles.length>0).map(e=>e.provider)??[]]),b=Me(e,`models.probe`),ee=Me(e,`codex.accountUsage`),x=this.login.pageActions;return dr({body:lr({providerScope:ur({agentLabel:c?v(c):this.selectedAgentId,...x,connectDisabled:x.connectDisabled||this.discovery.busy||this.addProviderOpen}),providerQuery:this.providerQuery,onProviderQueryChange:e=>this.providerQuery=e,onConnectProvider:()=>void this.login.open(),usageClient:!this.mutationBlockedReason()&&ee?e.client:null,usageAgentId:this.selectedAgentId,connected:e.phase===`connected`,loading:e.phase===`connected`&&this.data===null&&!o&&!a,refreshing:this.core.loading,error:o??(a?d(`agents.noAgents`):l.error),providerUsageFailed:l.providerUsage?.ok===!1,supplementalLoading:this.loaderPending||this.supplemental.loading,updatedAt:l.updatedAt,costDays:30,credentialAgentLabel:c?v(c):this.selectedAgentId,cards:a?[]:this.installedAgents.filterProviders(_),configuredModels:nn(p?.models??null,h),decisionModels:p?.decisionModels??[],defaultModels:h,authStatus:l.authStatus,automaticUtilityModel:p?.defaultModels?.automaticUtilityModel,thinkingLevel:h.thinkingLevel,thinkingOverridden:h.thinkingOverridden,fastMode:h.fastMode,fastModeOverridden:h.fastModeOverridden,catalogDiscovering:this.catalogDiscovery.discovering||!!p?.pendingProviders?.length,catalogDiscoveryError:this.catalogDiscovery.discovering?null:this.catalogDiscovery.error??l.catalogError,configBusy:B(this.context),quickAddSupported:l.authStatus?.providerCapabilities!==void 0,unconfiguredProviders:an(l.authStatus?.providerCapabilities,y),canViewProfiles:e.phase===`connected`&&t?.scopes!==void 0&&be(t),mutationBlockedReason:this.mutationBlockedReason(),defaultsMutationBlockedReason:V(this.context),providerUsageStalled:this.refreshPolicy.incompleteUsageExhausted,probeAvailable:this.profileActions.probeAvailable&&b!==!1,busy:this.busy,messages:this.messages,probeResults:this.probeResults,keyEditorProvider:this.keyEditorProvider,keyDraft:this.keyDraft,profileOrders:this.profileOrders,addProviderOpen:this.addProviderOpen,addProviderId:this.addProviderId,addProviderKey:this.addProviderKey,installedAgents:this.installedAgents.render(_,()=>this.catalogDiscovery.retry()),onRefresh:()=>void(o?this.context.agents.refreshList():Promise.all([this.context.runtimeConfig.refresh({background:!0}),this.refresh(`forced`)])),onOpenKeyEditor:e=>this.openKeyEditor(e),onCloseKeyEditor:()=>this.closeKeyEditor(),onKeyDraftChange:e=>this.keyDraft=e,onSaveKey:(e,t)=>void this.mutateApiKey(e,t,this.keyDraft.trim()),onRemoveKey:(e,t)=>void this.mutateApiKey(e,t,null),onProbe:(e,t)=>void this.profileActions.probe(e,t),onRequestLogout:e=>void this.requestLogout(e),onProfileOrderChange:(e,t,n)=>this.profileActions.setOrder(e,t,n),onAddProviderToggle:()=>{this.addProviderOpen=!this.addProviderOpen,this.addProviderKey=``,this.setMessage(`add`,null)},onAddProviderIdChange:e=>this.addProviderId=e,onAddProviderKeyChange:e=>this.addProviderKey=e,onAddProvider:()=>void this.addProvider(),...Bt(()=>this.defaultsDraft??m,g),onCatalogRetry:()=>this.catalogDiscovery.retry(),...this.login.providerActions}),loginMessage:this.messages.connection??x.loginMessage,login:C`${x.login}${this.discovery.render({agentLabel:c?v(c):this.selectedAgentId,credentialChoices:l.authStatus?.providerCapabilities?.flatMap(e=>e.loginOptions?.map(e=>e.id)??[])??[]})}`})}},u([c({context:xe,subscribe:!0})],$.prototype,`context`,void 0),u([D({attribute:!1})],$.prototype,`routeData`,void 0),u([D({attribute:!1})],$.prototype,`loaderPending`,void 0),u([E()],$.prototype,`data`,void 0),u([E()],$.prototype,`busy`,void 0),u([E()],$.prototype,`messages`,void 0),u([E()],$.prototype,`probeResults`,void 0),u([E()],$.prototype,`keyEditorProvider`,void 0),u([E()],$.prototype,`keyDraft`,void 0),u([E()],$.prototype,`profileOrders`,void 0),u([E()],$.prototype,`providerQuery`,void 0),u([E()],$.prototype,`addProviderOpen`,void 0),u([E()],$.prototype,`addProviderId`,void 0),u([E()],$.prototype,`addProviderKey`,void 0),u([E()],$.prototype,`defaultsDraft`,void 0),u([E()],$.prototype,`selectedAgentId`,void 0),customElements.get(`testclaw-model-providers-page`)||customElements.define(`testclaw-model-providers-page`,$)})))()}pr();
//# sourceMappingURL=model-providers-page-CScjqWbL.js.map