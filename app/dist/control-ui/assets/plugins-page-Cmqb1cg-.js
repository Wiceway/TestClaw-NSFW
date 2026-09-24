import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Hi as t,It as n,Jr as r,Lt as i,Wi as a,gi as o,lo as s,on as c,qr as l,ti as u}from"./control-ui-foundation-CGMdhB5v.js";import{$l as d,Bl as f,Bs as p,Hl as m,Jl as h,Rs as g,Xr as ee,Yr as te,_n as _,ac as ne,ao as re,au as ie,cn as ae,co as oe,dr as se,gr as ce,hn as le,ic as ue,iu as de,oo as fe,so as pe,vi as v,yr as me,zs as y}from"./control-ui-core-S9jKXqB5.js";import{$ as b,X as x,Y as S,_ as he,c as C,ct as w,m as ge,nt as _e,r as ve,s as ye,t as be,tt as T,ut as E}from"./lit-runtime-DWoPVI38.js";import{Cr as xe,Da as Se,Di as Ce,Ea as we,Fi as D,Fr as Te,Ii as O,It as Ee,Li as De,Ma as Oe,Ni as ke,Oa as k,Oi as Ae,Or as je,Ri as A,Rt as Me,Ut as Ne,Wt as Pe,Xn as Fe,Yn as Ie,ba as Le,ja as Re}from"./control-ui-core-G2U4O6rB.js";import{et as ze,tt as Be}from"./control-ui-boot-shared-8dYR6CXG.js";import{c as Ve,s as He,u as Ue}from"./gateway-runtime-BV4hxqU_.js";import{Di as j,Ei as M,go as We,ho as Ge,ir as Ke}from"./control-ui-boot-shared-ooxiG3qa.js";import{B as qe,G as Je,H as Ye,U as Xe,V as Ze,ft as Qe,st as $e}from"./control-ui-boot-shared-C3bL_9oq.js";import{At as et,B as tt,Dr as nt,Et as rt,Ia as it,Jr as at,Ot as ot,St as N,Tt as st,er as ct,f as lt,ht as P,lo as ut,nr as dt,p as ft,qr as pt,uo as mt,wr as ht,wt as F,yt as I,z as gt}from"./control-ui-boot-shared-CCYBAAP9.js";import{a as _t,r as vt,t as yt}from"./plugin-help-BRzlmSdh.js";import{$ as bt,Q as xt,U as St,W as Ct,ct as wt,et as Tt,lt as Et,nt as Dt,ot as Ot,rt as kt,st as At,tt as jt}from"./control-ui-boot-shared-VDjYq2Zh.js";import{n as Mt,t as Nt}from"./image-with-fallback-DfBwywga.js";import{i as Pt,l as Ft,o as It}from"./config-form.tiers-CVymKsPv.js";import{n as Lt,t as Rt}from"./settings-workspace-DJAhLnkQ.js";import{_ as zt,c as Bt,d as Vt,f as Ht,g as Ut,h as Wt,m as Gt,n as Kt,p as qt,t as Jt}from"./config-form-DCJREHbx.js";import{F as Yt,M as Xt,P as Zt,i as Qt,o as $t}from"./config-form.node.shared-CgIgd4Xp.js";import{a as en,i as tn,n as nn,r as rn,t as an}from"./settings-model-g8RP4RPm.js";import{i as on,n as sn,r as cn,t as ln}from"./plugins-hub-header-D0sv93ul.js";import{n as un,t as dn}from"./credential-editor-D-x7vNpi.js";import{n as fn,r as pn,t as mn}from"./file-preview-modal-registration-B2ui1EEv.js";var L;function hn(){return(hn=e((()=>{L=[`channels`,`providers`,`tools`,`contracts`,`hooks`,`mcpServers`,`cliCommands`,`cliBackends`,`skills`,`dangerousConfigFlags`]})))()}function gn(e,t){return Object.keys(e).every(e=>t.includes(e))}function _n(e){let n=t(e);if(!n||!gn(n,L))return;let r={};for(let e of L){let t=n[e];if(t!==void 0){if(!Array.isArray(t)||!t.every(c))return;r[e]=t}}return r}function vn(e){let n=t(e);if(!n||n.capabilityConsentCode!==`PLUGIN_CAPABILITY_CONSENT_REQUIRED`||!gn(n,[`capabilityConsentCode`,`pluginId`,`reviewToken`,`widened`,`acceptedAt`])||!c(n.pluginId)||!c(n.reviewToken)||n.acceptedAt!==void 0&&!c(n.acceptedAt))return;let r=n.widened===void 0?void 0:_n(n.widened);if(n.widened===void 0||r)return{capabilityConsentCode:yn,pluginId:n.pluginId,reviewToken:n.reviewToken,...r?{widened:r}:{},...n.acceptedAt===void 0?{}:{acceptedAt:n.acceptedAt}}}var yn;function bn(){return(bn=e((()=>{hn(),yn=`PLUGIN_CAPABILITY_CONSENT_REQUIRED`})))()}function xn(e){let n=t(e);if(!n)return;let r=s(n.ruleId),i=s(n.message),a=n.severity;if(!r||!i||a!==`info`&&a!==`warn`&&a!==`critical`)return;let o=s(n.file),c=s(n.evidence),l=n.line;if(!(n.file!==void 0&&!o||n.evidence!==void 0&&!c||l!==void 0&&(typeof l!=`number`||!Number.isSafeInteger(l)||l<=0)))return{ruleId:r,severity:a,message:i,...o?{file:o}:{},...l===void 0?{}:{line:l},...c?{evidence:c}:{}}}function Sn(e){let n=t(e);if(!n)return;let r=s(n.targetName),i=s(n.reason),a=n.targetType,o=n.requestMode;if(n.installPolicyCode!==`install_policy_warning_acknowledgement_required`||!r||!i||a!==`skill`&&a!==`plugin`||o!==`install`&&o!==`update`)return;let c;if(n.findings!==void 0){if(!Array.isArray(n.findings))return;c=[];for(let e of n.findings){let t=xn(e);if(!t)return;c.push(t)}}return{installPolicyCode:Cn,targetName:r,targetType:a,requestMode:o,reason:i,...c?{findings:c}:{}}}var Cn;function wn(){return(wn=e((()=>{Cn=`install_policy_warning_acknowledgement_required`})))()}function Tn(e){return e===`#configuration`?`configuration`:`readme`}function En(e,t){let n=new URLSearchParams(e?.search);return t?n.set(`view`,`settings`):n.delete(`view`),{pathname:e?.pathname,search:n.size?`?${n}`:``,hash:``}}function Dn(e,t){return e.catalog.official===t.catalog.official?(t.catalog.downloads??0)-(e.catalog.downloads??0)||e.catalog.name.localeCompare(t.catalog.name):e.catalog.official?-1:1}function On(e,t,n){return e.filter(e=>e.catalog[t]).toSorted((e,t)=>(e.catalog[n]??2**53-1)-(t.catalog[n]??2**53-1))}function kn(e,t){let n=new Map(e.map(e=>[e.id,e]));for(let e of t)n.set(e.id,e);return[...n.values()]}var An,jn,Mn,Nn,Pn;function Fn(){return(Fn=e((()=>{Ze(),p(),An=100,jn=8,Mn=null,Nn=null,Pn=class{constructor(e,t){this.host=e,this.gateway=t,this.result=null,this.error=null,this.remoteError=null,this.categories=[],this.featured=[],this.trending=[],this.loadMoreError=null,this.intent=`all`,this.category=null,this.query=``,this.committedQuery=``,this.searchTimer=null,this.browseTask=new Ye(e,{autoRun:!1,args:()=>[this.gateway.isConnected()?this.gateway.getClient():null,this.intent,this.category,this.committedQuery,!1],task:([e,t,n,r,i],{signal:a})=>e?this.fetchAvailablePage({client:e,intent:t,category:n,query:r,manual:i,signal:a}):Xe,onComplete:e=>{this.result={items:e.items,...e.nextCursor?{nextCursor:e.nextCursor}:{}},this.remoteError=e.remoteError??null,e.overview&&(this.categories=e.categories??[],this.featured=On(e.items,`featured`,`featuredRank`).slice(0,jn),this.trending=On(e.items,`trending`,`trendingRank`).slice(0,jn))},onError:e=>{this.error=g(e)}}),this.loadMoreTask=new Ye(e,{autoRun:!1,args:()=>[Mn,this.intent,this.category,this.committedQuery,Nn],task:([e,t,n,r,i],{signal:a})=>e&&i?this.fetchAvailablePage({client:e,intent:t,category:n,query:r,cursor:i,signal:a}):Xe,onComplete:e=>{if(!this.result||this.result.nextCursor!==e.requestedCursor)return;let t=kn(this.result.items,e.items);this.result={items:this.intent===`all`&&!this.committedQuery?t.toSorted(Dn):t,...e.nextCursor?{nextCursor:e.nextCursor}:{}},this.loadMoreError=e.remoteError??null},onError:e=>{this.loadMoreError=g(e)}})}get loading(){return this.gateway.isConnected()&&this.browseTask.status===Je.PENDING}get featuredLoading(){return this.isGroupedOverview()&&this.loading}get trendingLoading(){return this.isGroupedOverview()&&this.loading}get loadingMore(){return this.gateway.isConnected()&&this.loadMoreTask.status===Je.PENDING}async fetchAvailablePage(e){let t=!e.cursor&&this.isGroupedOverview(e.intent,e.category,e.query),n=await e.client.request(`plugins.catalog.browse`,{intent:e.intent,...e.category?{category:e.category}:{},...e.query?{query:e.query}:{},...e.manual?{searchSource:`testclaw-control-ui`}:{},...e.cursor?{cursor:e.cursor}:{},pageSize:An},e.signal?{signal:e.signal}:void 0);return{items:e.intent===`all`&&!e.query?n.items.toSorted(Dn):n.items,overview:t,...n.categories?{categories:n.categories}:{},...n.nextCursor&&!e.query?{nextCursor:n.nextCursor}:{},...n.remoteError?{remoteError:n.remoteError}:{},...e.cursor?{requestedCursor:e.cursor}:{}}}isGroupedOverview(e=this.intent,t=this.category,n=this.committedQuery){return e===`all`&&t===null&&!n}invalidate(){this.disconnect(),this.committedQuery=this.query.trim(),this.browseTask.run([null,this.intent,this.category,this.committedQuery,!1]),this.result=null,this.error=null,this.remoteError=null,this.featured=[],this.trending=[],this.loadMoreError=null}disconnect(){this.searchTimer&&=(clearTimeout(this.searchTimer),null),this.loadMoreTask.run([null,this.intent,this.category,this.committedQuery,null])}async refresh(e=!1){let t=this.gateway.getClient();t&&this.gateway.isConnected()&&(this.error=null,this.remoteError=null,this.loadMoreError=null,this.loadMoreTask.run([null,this.intent,this.category,this.committedQuery,null]),await this.browseTask.run([t,this.intent,this.category,this.committedQuery,e]))}async loadMore(){let e=this.gateway.getClient(),t=this.result?.nextCursor;e&&this.gateway.isConnected()&&t&&!this.committedQuery&&!this.isGroupedOverview()&&(this.loadMoreError=null,await this.loadMoreTask.run([e,this.intent,this.category,this.committedQuery,t]))}selectIntent(e){this.intent=e,this.category=null,this.refresh()}selectCategory(e){this.intent=`all`,this.category=e,this.refresh()}updateQuery(e){this.query=e,e.trim()&&(this.intent=`all`,this.category=null),this.host.requestUpdate(),this.searchTimer&&clearTimeout(this.searchTimer),this.searchTimer=setTimeout(()=>{this.searchTimer=null;let t=e.trim(),n=t!==this.committedQuery&&t.length>=2;this.committedQuery=t,this.refresh(n)},250)}}})))()}var In;function Ln(){return(Ln=e((()=>{Yt(),Ve(),vt(),In=class{constructor(e){e.addController(this)}get available(){return this.plugin!==void 0}update(e){let t=e.context;t!==this.context&&(this.release?.(),this.context=t);let n=e.result?.plugins.find(t=>t.installed&&t.id===e.detail?.pluginId),r=e.detail?.catalog??e.catalogDetail?.result,i=r?.plugin.local.pluginId??r?.detail.packageName,a=r?{tools:r.detail.contracts?.tools,providers:r.detail.providers,channels:r.detail.channels,contracts:r.detail.contracts?Object.entries(r.detail.contracts).filter(([e])=>e!==`tools`).flatMap(([e,t])=>t.map(t=>`${e}: ${t}`)):void 0,skills:r.detail.skills.map(e=>e.name),mcpServers:r.detail.mcpServers}:void 0;if(this.plugin=e.connected&&He(t.gateway.snapshot,`testclaw.chat`,`operator.admin`)?n?{id:n.id,name:n.name,declared:e.detail?.inspection?.declared??(n.catalogId===r?.plugin.id?a:void 0)}:r&&i?{id:i,name:r.plugin.catalog.name,declared:a}:void 0:void 0,!this.plugin){this.release?.(),this.release=void 0;return}this.release=_t(t,this,this.plugin,{installed:!!n,overview:!n||e.installedDetailTab!==`configuration`})}get ask(){if(!this.context||!this.plugin)return async()=>{};let e=yt(this.context,this.plugin);return t=>{let n=t?.value===void 0?t?.schema.default:t.value;return e(t?{path:t.path,label:t.label,value:n,sensitive:Zt(n,t.path,t.hints)}:void 0)}}hostDisconnected(){this.release?.(),this.release=void 0,this.plugin=void 0}}})))()}function Rn(e){return mt({title:d(`pluginsPage.removeConfirmTitle`,{name:e}),message:d(`pluginsPage.removeConfirmMessage`),confirmLabel:d(`pluginsPage.remove`),danger:!0})}function zn(){return(zn=e((()=>{ut(),h(),M(),j()})))()}var Bn;function Vn(){return(Vn=e((()=>{dn(),Bn=class{constructor(e){this.options=e,this.patch=(e,t)=>{if(!this.options.canEdit())return!1;this.options.onEdit();let n=this.options.getContext().runtimeConfig;return t===void 0?n.removeFormValue(e):n.patchForm(e,t),this.options.getDetail()&&this.options.isSettings()&&(this.write=n.flushFormChanges()),!0},this.render=e=>{let t=this.options.getDetail(),n=t?.inspection?.credentials?.find(t=>t.path.length===e.path.length&&t.path.every((t,n)=>t===e.path[n]));if(!t||!n)return;let r=this.options.getContext().runtimeConfig;return un(e,n,{pluginId:t.pluginId,baseHash:r.state.configSnapshot?.hash??null,gateway:this.options.gateway,canInspect:this.options.canInspect(),saveError:r.state.lastError,onDiscard:()=>r.discardFormValue(e.path),onCommit:async(t,n)=>{let r=this.write;return e.onPatch(t,n)!==!1&&this.write&&this.write!==r?this.write:!1}})}}}})))()}function Hn(e,t){return e.request(`plugins.inspect`,{pluginId:t})}function Un(e){if(e instanceof Ie)return vn(e.details)}function Wn(){return(Wn=e((()=>{bn(),Fe()})))()}async function Gn(e,t,n){let r,i=n?e.addEventListener(e=>{e.event===`plugins.install.progress`&&Qe(Be,e.payload)&&e.payload.requestId===r&&n(e.payload)}):void 0;try{return await e.request(`plugins.install`,t,{onSent:e=>{r=e}})}finally{i?.()}}function Kn(){return(Kn=e((()=>{$e(),ze()})))()}function qn(e){if(e instanceof Ie)return Sn(e.details)}function Jn(){return(Jn=e((()=>{wn(),Fe()})))()}function R(e){return`plugin:${e}`}function z(e,t={}){return e?b`<div
    class="plugins-row-message plugins-row-message--${e.kind} oc-banner ${e.kind===`error`?`oc-banner-error`:`oc-banner-warning`}"
    role=${e.kind===`error`||e.installPolicyWarning?`alert`:`status`}
  >
    <div>
      ${e.text}
      ${e.installPolicyWarning?b`
              <p>${d(`pluginConsent.installPolicy.policyScope`)}</p>
              ${e.installPolicyWarning.details.findings?.map(e=>b`<div class="plugins-policy-review__finding">
                  <strong>${d(`pluginConsent.installPolicy.severity.${e.severity}`)}</strong>
                  <p>${y(e.message)}</p>
                  <details>
                    <summary>${d(`pluginConsent.installPolicy.technicalDetails`)}</summary>
                    <code>${e.ruleId}</code>
                    ${e.file?b`<code>${e.file}${e.line?`:${e.line}`:``}</code>`:x}
                    ${e.evidence?b`<p>${y(e.evidence)}</p>`:x}
                  </details>
                </div>`)}
              ${t.onContinue?b`<button
                      class="btn btn--sm oc-action oc-action-secondary"
                      type="button"
                      ?disabled=${t.busy}
                      @click=${()=>{t.busy||t.onContinue?.({...e.installPolicyWarning.request,acknowledgeInstallPolicyWarning:!0})}}
                    >
                      ${d(`pluginsPage.continueInstall`)}
                    </button>`:x}
            `:x}
    </div>
  </div>`:x}function B(){return(B=e((()=>{S(),h(),p()})))()}function Yn(e,t){let n=[...(e.warnings??[]).map(e=>y(e)),t?d(`pluginsPage.configRefreshFailed`,{error:t}):null].filter(Boolean);return n.length?{kind:`warning`,text:n.join(`
`)}:null}var Xn;function Zn(){return(Zn=e((()=>{n(),Fe(),h(),p(),Wn(),Kn(),Jn(),B(),Xn=class{constructor(e){this.host=e,this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.installProgress=new Map,this.mutationToken=0,this.mutationTokens=new Map,this.installPolicyScopes=new Map}getActiveInstall(e){let t=this.installProgress.get(e);if(t&&t.finishedAt===void 0)return t;let n=this.host.getResult()?.plugins.find(t=>R(t.id)===e),r=n?.catalogId?this.installProgress.get(`install:${n.catalogId}`):void 0;return r?.finishedAt===void 0?r:void 0}reset(){this.close(),this.mutationTokens.clear(),this.installProgress.clear(),this.installPolicyScopes.clear()}reconcileInstallMessages(e){let t={...this.host.getMessages()},n=this.host.getResult();for(let[r,i]of Object.entries(t)){let a=i.savedInstall;if(!a)continue;let o=e?.plugins.some(e=>e.id===a&&e.installed);(o||e&&n?.plugins.some(e=>e.id===a&&e.installed))&&(this.installProgress.get(r)?.finishedAt!==void 0&&this.installProgress.delete(r),(!o||r!==R(a))&&delete t[r])}return t}async runMutation(e,t,n,r,i=t=>{this.host.setMessage(e,{kind:`error`,text:g(t)})}){let a=this.host.gateway.capture(),o=()=>(r.canDispatch??this.host.canMutate)()&&!this.getActiveInstall(e);if(!a||!o()||this.host.isBusy(e)||r.confirm&&(!await r.confirm()||!this.host.gateway.isCurrent(a)||!o()||this.host.isBusy(e)))return;this.host.clearPageNotice();let s=++this.mutationToken;this.mutationTokens.set(e,s);let c=()=>this.host.gateway.isCurrent(a)&&this.mutationTokens.get(e)===s,l=()=>c()&&this.mutationToken===s;this.host.setBusy(e,r.action),r.preserveMessageWhilePending||this.host.setMessage(e,null);try{let e=await fe(this.host.getContext().runtimeConfig,a.client,t,{canDispatch:()=>c()&&o()});c()&&await n(e.value,e.refreshError,a.client,c,l)}catch(e){c()&&await i(e,a,c)}finally{this.mutationTokens.get(e)===s&&(this.mutationTokens.delete(e),this.host.setBusy(e,null))}}open(e,t,n){if(!this.host.canMutate())return;let r=this.host.getResult()?.plugins.find(e=>e.id===t);this.host.closeDetails(),this.inspection=null,this.inspectionError=null,this.inspectionLoading=!0,this.consent={intent:e,pluginId:t,fallback:{name:r?.name??t,...r?.version?{version:r.version}:{},...r?.origin===`official`?{official:!0}:{}},...n?{details:n}:{}},this.host.requestUpdate(),this.inspect()}close(){this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.host.requestUpdate()}async inspect(){let e=this.consent,t=this.host.gateway.capture();if(e?.pluginId&&t){this.inspectionLoading=!0,this.inspectionError=null,this.host.requestUpdate();try{let n=await Hn(t.client,e.pluginId);this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspection=n)}catch(n){this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionError=g(n))}finally{this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionLoading=!1,this.host.requestUpdate())}}}confirm(){let e=this.consent?.intent,t=this.inspection?.reviewToken;e&&!this.inspectionLoading&&!this.inspectionError&&t&&(this.close(),this.mutateInstalledPlugin(e.pluginId,e.kind,e.rowKey,{acknowledgeCapabilities:{reviewToken:t}}))}async install(e,t){let n=this.host.getResult()?.plugins.find(t=>t.installed&&(e.source===`official`||e.source===`bundled`?t.id===e.pluginId:e.source===`clawhub`?t.packageName===e.packageName:`expectedPluginId`in e&&t.id===e.expectedPluginId)),r=this.host.getMessages();if((r[t]??(n?r[R(n.id)]:void 0))?.savedInstall)return;let o=this.installPolicyScopes.get(t);if(this.installPolicyScopes.delete(t),e.acknowledgeInstallPolicyWarning&&(!o||!this.host.gateway.isCurrent(o))){this.host.setMessage(t,{kind:`error`,text:d(`pluginsPage.installDestinationChanged`)});return}await this.runMutation(t,async n=>{let r=this.host.gateway.capture(),i={startedAt:Date.now(),activities:[]};this.installProgress.set(t,i),this.host.requestUpdate();let a=()=>r&&this.host.gateway.isCurrent(r)&&this.installProgress.get(t)===i,o=await Gn(n,e,e=>{if(!a())return;let n=i.activities.findIndex(t=>t.activityId===e.activityId);i={...i,activities:n<0?[...i.activities,e]:i.activities.map((t,r)=>r===n?e:t)},this.installProgress.set(t,i),this.host.requestUpdate()});return a()&&(this.installProgress.delete(t),this.host.applyMutationResult(o)),o},async(e,n,r)=>{let i=R(e.plugin.id);i!==t&&this.host.setMessage(t,null),this.host.setMessage(i,Yn(e,n)),await this.host.refreshCatalogAfterMutation(r)},{action:`install`,preserveMessageWhilePending:e.acknowledgeInstallPolicyWarning===!0},async(n,r,o)=>{let s=n instanceof Ie?a(n.details):void 0,c=a(s?.persistence),l=qn(n),u=this.installProgress.get(t);if(u&&(this.installProgress.set(t,{...u,finishedAt:Date.now(),canRetry:i(n)&&!c&&!l}),this.host.requestUpdate()),c?.operation===`install`&&typeof c.pluginId==`string`&&c.pluginId.trim()){let e=c.pluginId,i=R(e),l=a(s?.runtime),u=a(s?.runtimeAttempt)?.phase??l?.phase,f={kind:`error`,savedInstall:e,text:[d(l?.committed===!1?`pluginsPage.installSavedNotApplied`:`pluginsPage.installSaved`,{name:e,error:g(n)}),typeof u==`string`?d(`pluginsPage.runtimeFailurePhase`,{phase:y(u)}):null].filter(Boolean).join(`
`)};await this.reconcileCommittedFailure([t,i],f,r.client,o);return}if(l){this.installPolicyScopes.set(t,r),this.host.setMessage(t,{kind:`warning`,text:l.reason,installPolicyWarning:{details:l,request:e}});return}let f=g(n);this.host.setMessage(t,{kind:`error`,text:f})})}async reconcileCommittedFailure(e,t,n,r){for(let n of e)this.host.setMessage(n,t);let i=this.host.getContext().runtimeConfig.refresh(),[a]=await Promise.allSettled([i,r()?this.host.refreshCatalogAfterMutation(n):Promise.resolve()]);if(r()&&a.status===`rejected`)for(let n of new Set(e))this.host.getMessages()[n]===t&&this.host.setMessage(n,{...t,text:`${t.text}\n${d(`pluginsPage.configRefreshFailed`,{error:g(a.reason)})}`})}async mutateInstalledPlugin(e,t,n=R(e),r={}){await this.runMutation(n,n=>pe(n,e,t===`enable`,r),async(e,t,r)=>{this.host.applyMutationResult(e),this.host.setMessage(n,Yn(e,t)),await this.host.refreshCatalogAfterMutation(r)},{action:t},async(r,i,o)=>{let s=r instanceof Ie?a(r.details):void 0,c=a(s?.runtime),l=Un(r);if(t!==`disable`&&c?.committed!==!0&&l&&this.host.canMutate()){this.open({kind:t,pluginId:e,rowKey:n},l.pluginId,l);return}let u=a(s?.runtimeAttempt)?.phase??c?.phase,f=this.host.getMessages()[n]?.savedInstall,p={kind:`error`,...f?{savedInstall:f}:{},text:[g(r),typeof u==`string`?d(`pluginsPage.runtimeFailurePhase`,{phase:y(u)}):null].filter(Boolean).join(`
`)};c?.committed===!0?await this.reconcileCommittedFailure([n],p,i.client,o):this.host.setMessage(n,p)})}}})))()}async function Qn(e){let{plugin:t,client:n}=e,r=e.initial,i=t=>{e.isCurrent()&&(r=t,e.onChange(t))},a=e.includeTools?n.request(`tools.catalog`,{includePlugins:!0}).catch(()=>void 0):Promise.resolve(void 0);try{let o=await Hn(n,t.id);if(!e.isCurrent()||(i({...r,inspection:o,tools:void 0,catalog:o.catalog??r.catalog,catalogLoading:!(!t.catalogId||o.catalog||r.catalog)}),a.then(e=>{if(!e)return;let n=new Map(o.declared.tools.map(e=>[e,{name:e}]));for(let r of e.groups.filter(e=>e.pluginId===t.id))for(let e of r.tools)n.set(e.id,{name:e.id,description:e.fullDescription??e.description});i({...r,tools:[...n.values()]})}),!t.catalogId))return;try{let e=await re(n,t.catalogId,void 0,t.version);i({...r,catalog:e,catalogLoading:!1})}catch{i({...r,catalogLoading:!1})}}catch(e){i({...r,error:g(e)})}}function $n(){return($n=e((()=>{p(),Wn()})))()}function er(e){return new Set(Array.from(e.querySelectorAll(`[data-plugin-icon-id]`),e=>e.dataset.pluginIconId??``).filter(Boolean))}var tr;function nr(){return(nr=e((()=>{Ee(),Ct(),tr=class{constructor(e){this.authCandidates=[];let t={getFetchContext:()=>{let t=e.getContext();return{resourceBasePath:t.resourceBasePath,gatewayUrl:t.gateway.connection.gatewayUrl,auth:{hello:t.gateway.snapshot.hello,settings:{token:t.gateway.connection.token},password:t.gateway.connection.password}}},isConnected:e.isConnected};this.installed=new St({...t,onUrlsChange:e.onInstalledUrlsChange}),this.catalog=new St({kind:`catalog`,...t,onUrlsChange:e.onCatalogUrlsChange})}updateAuth(e){let t=Me(e),n=t.length!==this.authCandidates.length||t.some((e,t)=>e!==this.authCandidates[t]);return this.authCandidates=t,n}syncInstalled(e,t){this.installed.sync(e,er(t))}reconcileInstalled(e){this.installed.reconcile(e)}invalidateInstalled(e){this.installed.invalidate(e)}handleInstalledError(e){this.installed.handleError(e)}syncCatalog(e,t,n){let r=er(t);this.catalog.syncCatalog([...[...e.result?.items??[],...e.featured,...e.trending].filter(e=>r.has(e.id)),...n?[n.plugin]:[]],n?.detail.author?.imageUrl?[n.detail.author.imageUrl]:[])}resetInstalled(){this.installed.reset()}reset(){this.installed.reset(),this.catalog.reset()}}})))()}function rr(e,t){if(!e)return e;let n=e.plugins.findIndex(e=>e.id===t.id),r=[...e.plugins];return n>=0?r[n]=t:r.push(t),{...e,plugins:r}}function ir(e){return e.connected?e.hasAdminAccess?e.mutationAllowed===!1?d(`pluginsPage.changesDisabled`):null:d(`pluginsPage.adminRequired`):d(`pluginsPage.connectToChange`)}function ar(e){if(e.plugin.local.installed||e.plugin.local.action!==`install`)return null;if(e.plugin.local.install)return e.plugin.local.install;let t=e.detail.packageName?.trim();return t?{source:`clawhub`,packageName:t}:null}function or(){return(or=e((()=>{h(),M(),j()})))()}var V;function sr(){return(sr=e((()=>{qe(),S(),_e(),ge(),at(),O(),h(),M(),_(),ee(),m(),j(),V=class extends f{constructor(...e){super(...e),this.busy=!1,this.disabled=!1,this.label=``,this.buttonClass=``,this.primary=!1,this.onInstall=()=>{},this.open=!1,this.now=Date.now(),this.pinned=!1,this.hovering=!1,this.progressId=`plugin-install-progress-${te()}`,this.handleEscape=e=>{e.key===`Escape`&&this.open&&(this.dismiss(),e.stopPropagation())},this.configurePopup=e=>{let t=this.querySelector(`button`);e instanceof o&&t&&(pt(e,t,`bottom`),e.distance=16,e.hoverBridge=!0)}}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleEscape)}disconnectedCallback(){clearInterval(this.timer),document.removeEventListener(`keydown`,this.handleEscape),super.disconnectedCallback()}updated(e){(e.has(`progress`)||e.has(`busy`))&&(clearInterval(this.timer),this.timer=void 0,this.progress&&this.progress.finishedAt===void 0&&(this.timer=setInterval(()=>{this.now=Date.now()},1e3)),!this.progress&&!this.busy&&this.dismiss()),this.toggleAttribute(`open`,this.open&&!!this.progress)}dismiss(){this.pinned=!1,this.open=!1}render(){let e=this.progress,t=e?.finishedAt!==void 0,n=!!e||this.busy,r=!n||e?.canRetry===!0&&!this.busy,i=e?Math.max(0,Math.floor(((e.finishedAt??this.now)-e.startedAt)/1e3)):0;return b`<span
      class="plugin-install-action"
      @mouseenter=${()=>{this.hovering=!0,this.open=!0}}
      @mouseleave=${()=>{this.hovering=!1,!this.pinned&&!this.contains(document.activeElement)&&(this.open=!1)}}
      @focusin=${()=>{this.open=!0}}
      @focusout=${e=>{!this.pinned&&!this.hovering&&!(e.relatedTarget instanceof Node&&this.contains(e.relatedTarget))&&(this.open=!1)}}
    >
      <button
        type="button"
        class=${`${this.buttonClass} plugin-install-action__button ${this.primary&&!t?`primary oc-action-primary`:`oc-action-secondary`} ${t?`plugin-install-action__button--failed`:``}`}
        ?disabled=${this.disabled&&r}
        aria-label=${r&&this.label||x}
        aria-busy=${n&&!t?`true`:x}
        aria-expanded=${e?String(this.open):x}
        aria-controls=${e?this.progressId:x}
        @click=${e=>{e.preventDefault(),e.stopPropagation(),r?this.disabled||this.onInstall():(this.pinned=!this.pinned,this.open=this.pinned)}}
      >
        ${n&&!t?b`<span class="btn__spinner" aria-hidden="true"></span>`:x}
        ${d(r?`pluginsPage.install`:t?`pluginsPage.installProgress.failed`:`pluginsPage.installing`)}
        ${e?D.chevronDown:x}
      </button>
      ${e?b`<wa-popup
              class="plugin-install-action__popup"
              ?active=${this.open}
              ${he(this.configurePopup)}
            >
              <section
                class="plugin-install-progress"
                id=${this.progressId}
                role="status"
                aria-label=${d(`pluginsPage.installProgress.title`)}
              >
                <div class="plugin-install-progress__header">
                  <strong
                    >${d(t?`pluginsPage.installProgress.stopped`:`pluginsPage.installProgress.title`)}</strong
                  ><span aria-hidden="true"
                    >${le({value:i,unit:`second`})}</span
                  >
                </div>
                <ol class="plugin-install-progress__activities">
                  ${e.activities.map(e=>b`<li
                      class=${`plugin-install-progress__activity plugin-install-progress__activity--${e.status}`}
                    >
                      <span class="plugin-install-progress__icon" aria-hidden="true"
                        >${e.status===`completed`?D.check:e.status===`failed`?`!`:x}</span
                      >
                      <span
                        >${d(`pluginsPage.installProgress.${e.stage}.${e.status}`)}</span
                      >
                    </li>`)}
                  ${t&&!e.activities.some(e=>e.status===`failed`)?b`<li class="plugin-install-progress__activity plugin-install-progress__activity--failed"><span class="plugin-install-progress__icon" aria-hidden="true">!</span><span>${d(`pluginsPage.installProgress.failure`)}</span></li>`:x}
                </ol>
              </section>
            </wa-popup>`:x}
    </span>`}},u([E({attribute:!1})],V.prototype,`progress`,void 0),u([E({attribute:!1})],V.prototype,`busy`,void 0),u([E({attribute:!1})],V.prototype,`disabled`,void 0),u([E({attribute:!1})],V.prototype,`label`,void 0),u([E({attribute:!1})],V.prototype,`buttonClass`,void 0),u([E({attribute:!1})],V.prototype,`primary`,void 0),u([E({attribute:!1})],V.prototype,`onInstall`,void 0),u([w()],V.prototype,`open`,void 0),u([w()],V.prototype,`now`,void 0),customElements.get(`testclaw-plugin-install-action`)||customElements.define(`testclaw-plugin-install-action`,V)})))()}function cr(e,t){return e?b`<testclaw-tooltip open-on-click .content=${e}>${t}</testclaw-tooltip>`:t}function H(){return(H=e((()=>{S(),ke()})))()}var lr,ur;function dr(){return(dr=e((()=>{ie(),lr={pluginConsent:{widenedTitle:`What changed`,widenedDescription:`New since your last acceptance.`,previouslyAccepted:`Previously accepted {date}.`,declaredTitle:`Declared capabilities`,declaredDescription:`From the plugin manifest. Assistant validates the plugin against these declarations when it loads.`,declaredEmpty:`No channels, providers, or tools declared in the manifest.`,contracts:`Contracts`,hooks:`Hooks`,runtimeHooks:`Code plugins may register hooks at runtime; their hook names are not declared in the manifest.`,mcpServers:`MCP servers`,cliCommands:`CLI commands`,cliBackends:`CLI backends`,skills:`Skills`,dangerousFlags:`Dangerous config flags`,grantsTitle:`Your grants`,grantsDescription:`Set per plugin in plugins.entries.{id}. Hooks outside these grants are blocked at load.`,promptInjection:`Prompt injection`,conversationAccess:`Conversation access`,allowed:`Allowed`,blocked:`Blocked`,on:`On`,off:`Off`,grantDefault:`(default)`,grantConfigured:`(set in config)`,externalAccessHint:`Off by default for external plugins.`,modelOverrides:`Model overrides`,subagentModelOverrides:`Subagent model overrides`,modelOverride:`Model override: {value}`,allowedModels:`Allowed models: {models}`,allowedCompletionModels:`Completion models: {models}`,authProfileOverride:`Auth profile override: {value}`,agentIdOverride:`Agent ID override: {value}`,noOverrides:`No overrides configured`,loading:`Loading capability details…`,fallback:`Capability details must be available before you can approve this plugin.`,verifiedClean:`Verified clean`,reviewRecommended:`Review recommended`,reviewRequired:`Review required`,trustBlocked:`Blocked`,scanDate:`Scanned {date}`,integrity:`Integrity`,sha256:`SHA-256`,commit:`Commit`,pinnedArtifact:`Pinned to the exact installed artifact.`,sourceClawHub:`ClawHub`,sourceNpm:`npm`,sourceGit:`Git`,sourcePath:`Local path`,sourceArchive:`Archive`,sourceMarketplace:`Marketplace`,community:`Community`,enableNamed:`Enable {name}`,installPolicy:{technicalDetails:`Technical details`,severity:{info:`Info`,warn:`Warning`,critical:`Critical`},policyScope:`Continuing approves every install-policy warning encountered during this install. Each warning is checked again before installation continues.`}}},ur=Object.assign(()=>{de.pluginConsent=lr.pluginConsent},{catalog:lr})})))()}function U(e,t,n,r,i=`plugins-tile`,a){let o=(n,a)=>{if(n)return b`<span class=${i} data-plugin-icon-id=${e}>
        <img
          class="plugins-icon"
          src=${n}
          alt=""
          loading="lazy"
          decoding="async"
          @error=${()=>{a(),r?.()}}
        />
      </span>`;let[o,s]=At(e),c=wt(t);return b`<span
      class=${`${i} ${i}--fallback`}
      data-plugin-icon-id=${e}
      style=${`--plugins-art-a:${o};--plugins-art-b:${s}`}
      aria-hidden="true"
    >
      ${c?b`<span>${c}</span>`:D.plug}
    </span>`};return b`${Nt(n,(e,t)=>e?o(e,t):b`${Nt(a,o)}`)}`}function W(e,t,n=!1){return rt({title:e,control:b`<span class=${n?`plugins-consent__row--warning`:``}>${t}</span>`,stackedOnNarrow:!0,carapace:!0})}function fr(e){return b`<span class="plugins-consent__items">${e.join(`, `)}</span>`}function pr(e,t=!1){return L.flatMap(n=>{let r=e[n];return r?.length&&(t||n!==`dangerousConfigFlags`)?[W(d(wr[n]),fr(r),t)]:[]})}function mr(e){let t=pr(e);return ot({title:d(`pluginConsent.declaredTitle`),description:d(`pluginConsent.declaredDescription`),carapace:!0},b`${t.length?t:rt({title:d(`pluginConsent.declaredEmpty`),carapace:!0})}
    ${e.hooks.length===0?W(d(`pluginConsent.hooks`),d(`pluginConsent.runtimeHooks`)):x}
    ${e.dangerousConfigFlags.length>0?W(d(`pluginConsent.dangerousFlags`),fr(e.dangerousConfigFlags),!0):x}`)}function hr(e){if(!e.widened)return x;let t=pr(e.widened,!0);return t.length===0?x:b`
    <section class="plugins-consent__section oc-section">
      <h3>${d(`pluginConsent.widenedTitle`)}</h3>
      <p class="plugins-consent__description">
        ${d(`pluginConsent.widenedDescription`)}
        ${e.acceptedAt?d(`pluginConsent.previouslyAccepted`,{date:e.acceptedAt}):x}
      </p>
      <div class="plugins-consent__rows">${t}</div>
    </section>
  `}function gr(e,t,n){return`${d(e.effective?t:n)} ${d(e.configured===void 0?`pluginConsent.grantDefault`:`pluginConsent.grantConfigured`)}`}function _r(e,t){return t===void 0?void 0:d(e,{value:d(t?`pluginConsent.allowed`:`pluginConsent.blocked`)})}function vr(e){return[_r(`pluginConsent.modelOverride`,e.allowModelOverride),e.allowedModels?.length?d(`pluginConsent.allowedModels`,{models:e.allowedModels.join(`, `)}):void 0,`allowedCompletionModels`in e&&e.allowedCompletionModels?.length?d(`pluginConsent.allowedCompletionModels`,{models:e.allowedCompletionModels.join(`, `)}):void 0,`allowAuthProfileOverride`in e?_r(`pluginConsent.authProfileOverride`,e.allowAuthProfileOverride):void 0,`allowAgentIdOverride`in e?_r(`pluginConsent.agentIdOverride`,e.allowAgentIdOverride):void 0].filter(Boolean).join(` · `)||d(`pluginConsent.noOverrides`)}function yr(e,t){let n=e.hooks.allowConversationAccess;return ot({title:d(`pluginConsent.grantsTitle`),description:d(`pluginConsent.grantsDescription`),carapace:!0},b`
      ${W(d(`pluginConsent.promptInjection`),gr(e.hooks.allowPromptInjection,`pluginConsent.allowed`,`pluginConsent.blocked`))}
      ${W(d(`pluginConsent.conversationAccess`),b`
          ${gr(n,`pluginConsent.on`,`pluginConsent.off`)}
          ${!n.effective&&n.configured===void 0&&t!==`bundled`?b`<span class="plugins-consent__hint">
                  ${d(`pluginConsent.externalAccessHint`)}
                </span>`:x}
        `)}
      ${e.llm?W(d(`pluginConsent.modelOverrides`),vr(e.llm)):x}
      ${e.subagent?W(d(`pluginConsent.subagentModelOverrides`),vr(e.subagent)):x}
    `)}function br(e,t){if(t)return d(`pluginsPage.official`);let n=e&&Object.hasOwn(Er,e)?Er[e]:void 0;return n?d(n):e??(t===!1?d(`pluginConsent.community`):null)}function xr(e){if(!e)return x;let t=e.integrityKind===`sha256`?d(`pluginConsent.sha256`):e.integrityKind===`git-commit`?d(`pluginConsent.commit`):d(`pluginConsent.integrity`);return b`
    <div class="plugins-consent__provenance">
      <span
        >${[d(Tr[e.kind]),e.spec??e.packageName].filter(Boolean).join(` · `)}</span
      >
      ${e.integrity?b`<span title=${e.integrity}>
              ${t}: <code>${e.integrity.slice(0,20)}…</code>
            </span>`:x}
    </div>
    ${e.integrity?b`<p class="plugins-consent__hint">${d(`pluginConsent.pinnedArtifact`)}</p>`:x}
  `}function Sr(e){if(!e)return x;let t=d(e.disposition===`clean`?`pluginConsent.verifiedClean`:e.disposition===`review-recommended`?`pluginConsent.reviewRecommended`:e.disposition===`review-required`?`pluginConsent.reviewRequired`:`pluginConsent.trustBlocked`),n=e.disposition===`clean`?`ok`:e.disposition===`blocked`?`danger`:`warn`;return b`
    <section class="plugins-consent__trust">
      ${et({kind:n,label:t,carapace:!0})}
      ${e.reasons?.length?b`<ul>
              ${e.reasons.map(e=>b`<li>${e}</li>`)}
            </ul>`:x}
      ${e.checkedAt?b`<p class="plugins-consent__hint">
              ${d(`pluginConsent.scanDate`,{date:e.checkedAt})}
            </p>`:x}
    </section>
  `}function Cr(e){let{consent:t,inspection:n}=e,r=t.details,i=n?.plugin,a=t.fallback,o=n?.source?.packageName,s=t.pluginId??o??a?.name??`plugin`,c=i?.name??a?.name??s,l=i?.version??a?.version,u=[br(i?.origin,a?.official),o].filter(Boolean).join(` · `),f=e.busy?d(`pluginsPage.working`):d(`pluginConsent.enableNamed`,{name:c}),p=!e.canMutate||e.busy||e.loading||!!e.error||!n,m=b`
    <button
      type="button"
      class="btn primary oc-action oc-action-primary"
      ?disabled=${p&&!e.mutationBlockedReason}
      aria-disabled=${e.canMutate?x:`true`}
      @click=${()=>{p||e.onConfirm()}}
    >
      ${f}
    </button>
  `;return b`
    <testclaw-modal-dialog
      label=${c}
      style="--testclaw-modal-width: min(560px, calc(100vw - 32px));"
      @modal-cancel=${e.onCancel}
    >
      <section class="plugins-consent oc-card" data-plugin-consent=${t.intent.kind}>
        <header class="plugins-consent__header">
          ${U(s,c,e.iconUrl)}
          <div>
            <div class="plugins-detail__title">
              <h2>${c}</h2>
              ${l?b`<span class="plugins-version">${`v${l}`}</span>`:x}
            </div>
            ${u?b`<p class="plugins-consent__description">${u}</p>`:x}
          </div>
        </header>
        ${e.loading?b`<p class="plugins-consent__hint" role="status">${d(`pluginConsent.loading`)}</p>`:e.error?b`<div class="plugins-consent__error" role="alert">
                  <span>${e.error}</span>
                  <button
                    type="button"
                    class="btn btn--sm oc-action oc-action-secondary"
                    @click=${e.onRetry}
                  >
                    ${d(`pluginsPage.tryAgain`)}
                  </button>
                </div>`:n?b`
                    ${xr(n.source)} ${Sr(n.trust)}
                    ${r?hr(r):x}
                    ${mr(n.declared)}
                    ${yr(n.grants,i?.origin)}
                  `:b`<p class="plugins-consent__description">${d(`pluginConsent.fallback`)}</p>`}
        <footer class="plugins-consent__actions">
          <button type="button" class="btn oc-action oc-action-secondary" @click=${e.onCancel}>
            ${d(`pluginsPage.cancel`)}
          </button>
          ${cr(e.mutationBlockedReason,m)}
        </footer>
      </section>
    </testclaw-modal-dialog>
  `}var wr,Tr,Er;function G(){return(G=e((()=>{S(),hn(),O(),Mt(),Te(),H(),P(),h(),dr(),M(),Ot(),j(),ur(),wr={channels:`pluginsPage.categoryChannels`,providers:`pluginsPage.categoryProviders`,tools:`pluginsPage.categoryTools`,contracts:`pluginConsent.contracts`,hooks:`pluginConsent.hooks`,mcpServers:`pluginConsent.mcpServers`,cliCommands:`pluginConsent.cliCommands`,cliBackends:`pluginConsent.cliBackends`,skills:`pluginConsent.skills`,dangerousConfigFlags:`pluginConsent.dangerousFlags`},Tr={bundled:`pluginsPage.included`,"official-catalog":`pluginsPage.official`,clawhub:`pluginConsent.sourceClawHub`,npm:`pluginConsent.sourceNpm`,git:`pluginConsent.sourceGit`,path:`pluginConsent.sourcePath`,archive:`pluginConsent.sourceArchive`,marketplace:`pluginConsent.sourceMarketplace`},Er={bundled:`pluginsPage.included`,global:`pluginsPage.global`,workspace:`pluginsPage.workspace`,config:`pluginsPage.config`,official:`pluginsPage.official`}})))()}function Dr(e){return b`<nav class="plugins-settings-breadcrumb" aria-label=${d(`pluginsPage.breadcrumb`)}>
    <a
      class="plugins-settings-breadcrumb__parent"
      href=${e.backHref}
      @click=${t=>{v(t)&&(t.preventDefault(),e.onBack())}}
      >${e.backLabel}</a
    >
    <span class="plugins-settings-breadcrumb__chevron" aria-hidden="true"
      >${D.chevronRight}</span
    >
    <span class="plugins-settings-breadcrumb__current" aria-current="page">${e.name}</span>
  </nav>`}function Or(e){let t=`${e.id}-title`;return b`<section
    class="plugin-catalog-detail ${e.sidebar?``:`plugin-catalog-detail--no-sidebar`}"
    aria-labelledby=${t}
  >
    ${Dr(e)}
    <div class="plugin-catalog-detail__hero">
      ${e.icon?b`<div class="plugin-catalog-detail__icon" aria-hidden="true">${e.icon}</div>`:x}
      <div class="plugin-catalog-detail__heading">
        <div class="plugin-catalog-detail__title-row">
          <h1 id=${t}>${e.name}</h1>
        </div>
        ${e.identity}
        ${e.summary?b`<p class="plugin-catalog-detail__summary">${e.summary}</p>`:x}
        <div class="plugin-catalog-detail__actions">${e.titleAction??x}</div>
      </div>
    </div>
    <div class="plugin-catalog-detail__content">
      <section class="plugin-catalog-detail__panel">${e.panel}</section>
      ${e.sidebar?b`<aside class="plugin-catalog-detail__sidebar">${e.sidebar}</aside>`:x}
      ${e.readme?b`<section class="plugin-catalog-detail__readme-section">${e.readme}</section>`:x}
    </div>
  </section>`}function K(){return(K=e((()=>{S(),O(),h(),M(),j()})))()}function kr(e){return e&&zr[e]||D.box}function Ar(e,t){let n=Et({pluginId:e.local.pluginId,imageUrl:e.catalog.imageUrl},t);return U(e.local.pluginId??e.id,e.catalog.name,n??void 0)}function jr(e){if(e<1e3)return new Intl.NumberFormat().format(e);if(e<1e6){let t=e/1e3;return`${t>=100?Math.round(t):Number(t.toFixed(1))}k`}let t=e/1e6;return`${t>=100?Math.round(t):Number(t.toFixed(1))}m`}function Mr(e,t){let n=e.local.state===`not-installed`?null:e.local.state,r=t.installProgress?.get(`install:${e.id}`),i=!!(r&&r.finishedAt===void 0),a=e.local.installed&&n!==null&&!i,o=!!t.busy?.[`install:${e.id}`],s=t.canInstall&&e.local.action===`install`&&!o&&!t.messages?.[`install:${e.id}`]?.savedInstall;return b`<article
    class="plugin-catalog-card oc-card oc-card-interactive"
    data-plugin-id=${e.id}
  >
    <a
      class="plugin-catalog-card__primary-link"
      href=${t.entryHref(e.id)}
      aria-label=${e.catalog.name}
      @click=${n=>{v(n)&&(n.preventDefault(),t.onOpenEntry(e.id))}}
    ></a>
    <div class="plugin-catalog-card__head">
      <div class="installed-plugins-card__head">
        <span
          class="installed-plugins-card__art plugin-catalog-card__art"
          aria-hidden="true"
          data-plugin-icon-id=${e.local.pluginId??x}
        >
          ${Ar(e,t)}
        </span>
        ${Tt({name:e.catalog.name,attribution:{...e.catalog.author?{author:e.catalog.author}:{},official:e.catalog.official},linkedAuthor:!0})}
      </div>
      <div class="plugin-catalog-card__action">
        ${a?kt(n,`plugin-catalog-card__status`):b`<testclaw-plugin-install-action
                .buttonClass=${`btn btn--sm plugin-catalog-card__install oc-action oc-action-secondary`}
                .label=${d(`pluginsPage.installNamed`,{name:e.catalog.name})}
                .busy=${o}
                .disabled=${!s}
                .progress=${r}
                .onInstall=${()=>t.onInstall(e.id)}
              ></testclaw-plugin-install-action>`}
      </div>
    </div>
    ${jt(e.catalog.summary||d(`pluginsPage.optionalCapability`))}
    ${z(t.messages?.[`install:${e.id}`],{busy:o,onContinue:t.canInstall&&t.onContinueInstall?n=>t.onContinueInstall?.(e.id,n):void 0})}
  </article>`}function Nr(e){return b`<div
    class="plugin-catalog-grid plugin-catalog-grid--skeleton"
    role="status"
    aria-busy="true"
    aria-label=${e.label??d(`common.loading`)}
  >
    ${Array.from({length:e.cards},()=>b`<div
        class="plugin-catalog-card oc-card plugin-catalog-card--skeleton"
        aria-hidden="true"
      >
        <div class="plugin-catalog-card__head">
          <div class="installed-plugins-card__head">
            <span class="skeleton plugin-catalog-card__skeleton-art"></span>
            <div class="installed-plugins-card__identity">
              <span class="skeleton plugin-catalog-card__skeleton-title"></span>
            </div>
          </div>
          <div class="plugin-catalog-card__action">
            <span class="skeleton plugin-catalog-card__skeleton-action"></span>
          </div>
        </div>
        <span class="plugin-catalog-card__skeleton-summary">
          <span class="skeleton plugin-catalog-card__skeleton-line"></span>
          <span class="skeleton plugin-catalog-card__skeleton-line"></span>
        </span>
      </div>`)}
  </div>`}function q(e,t){return b`<div class="callout danger oc-banner oc-banner-error" role="alert">
    <span>${y(e)}</span>
    <button
      type="button"
      class="btn btn--sm oc-action oc-action-secondary oc-banner-action"
      @click=${t}
    >
      ${d(`pluginsPage.tryAgain`)}
    </button>
  </div>`}function J(e){return!e.loading&&!e.error&&e.items.length===0?x:b`<section
    class="plugin-catalog-section ${e.onViewAll?`plugin-catalog-section--expandable`:``}"
    data-catalog-section=${e.id}
  >
    <header class="plugin-catalog-section__header">
      <h2>${e.title}</h2>
      ${e.onViewAll?b`<button
              type="button"
              class="btn btn--sm plugin-catalog-section__view-all oc-action oc-action-ghost"
              @click=${e.onViewAll}
            >
              ${d(`pluginsPage.viewAllInstalledPlugins`)}
            </button>`:x}
    </header>
    ${e.loading?Nr({cards:Rr}):e.error&&e.onRetry?q(e.error,e.onRetry):b`<div class="plugin-catalog-grid">
              ${C(e.onViewAll?e.items.slice(0,Rr):e.items,e=>e.id,t=>Mr(t,e.props))}
            </div>`}
  </section>`}function Pr(e){let t=e.intent===`all`&&e.category===null;return b`<div
    class="plugin-catalog-chips"
    role="group"
    aria-label=${d(`pluginsPage.categoriesLabel`)}
  >
    <button
      type="button"
      class="plugin-catalog-chip ${t?`is-active`:``}"
      aria-pressed=${t}
      @click=${()=>e.onIntentChange(`all`)}
    >
      <span aria-hidden="true">${D.layoutGrid}</span>${d(`pluginsPage.intentAll`)}
    </button>
    <button
      type="button"
      class="plugin-catalog-chip ${e.intent===`featured`?`is-active`:``}"
      aria-pressed=${e.intent===`featured`}
      @click=${()=>e.onIntentChange(`featured`)}
    >
      <span aria-hidden="true">${D.star}</span>${d(`pluginsPage.featuredTitle`)}
    </button>
    <button
      type="button"
      class="plugin-catalog-chip ${e.intent===`trending`?`is-active`:``}"
      aria-pressed=${e.intent===`trending`}
      @click=${()=>e.onIntentChange(`trending`)}
    >
      <span aria-hidden="true">${D.barChart}</span>${d(`pluginsPage.intentTrending`)}
    </button>
    ${C(e.categories.toSorted((e,t)=>e.order-t.order),e=>e.slug,t=>b`<button
        type="button"
        class="plugin-catalog-chip ${e.category===t.slug?`is-active`:``}"
        aria-pressed=${e.category===t.slug}
        @click=${()=>e.onCategoryChange(t.slug)}
      >
        <span aria-hidden="true">${kr(t.icon)}</span>${t.label}
      </button>`)}
  </div>`}function Fr(e){let t=e.result?.items??[];if(e.loading)return Nr({label:d(`pluginsPage.loadingDiscovery`),cards:Rr});if(e.error)return q(e.error,e.onRetry);if(!e.connected)return b`<p class="plugin-catalog-results__empty">${d(`pluginsPage.discoveryOffline`)}</p>`;if(t.length===0)return tt({icon:D.search,heading:d(`pluginsPage.noDiscoveryResults`),description:d(`pluginsPage.noDiscoveryResultsHint`)});let n=t.filter(e=>e.catalog.official),r=t.filter(e=>!e.catalog.official);return b`
    ${e.query.trim()&&n.length>0&&r.length>0?b`
            ${J({id:`official`,title:d(`pluginsPage.official`),items:n,props:e})}
            ${J({id:`community`,title:d(`pluginsPage.community`),items:r,props:e})}
          `:b`<div class="plugin-catalog-grid plugin-catalog-grid--results">
            ${C(t,e=>e.id,t=>Mr(t,e))}
          </div>`}
    ${e.loadMoreError?q(e.loadMoreError,e.onLoadMore):x}
    ${e.result?.nextCursor?b`<div class="plugin-catalog-load-more">
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary"
              ?disabled=${e.loadingMore}
              @click=${e.onLoadMore}
            >
              ${e.loadingMore?d(`pluginsPage.loadingMore`):d(`pluginsPage.loadMore`)}
            </button>
          </div>`:x}
  `}function Ir(e){let t=e.result?.items??[],n=e.categories.toSorted((e,t)=>e.order-t.order),r=new Set(n.map(e=>e.slug)),i=t.filter(e=>!e.catalog.categories.some(e=>r.has(e)));return!(e.featured.length>0||e.trending.length>0||t.length>0)&&!e.loading&&!e.featuredLoading&&!e.trendingLoading&&!e.error&&!e.remoteError?tt({icon:D.search,heading:d(`pluginsPage.noDiscoveryResults`),description:d(`pluginsPage.noDiscoveryResultsHint`)}):b`
    ${e.error?q(e.error,e.onRetry):x}
    ${J({id:`featured`,title:d(`pluginsPage.featuredTitle`),items:e.featured,loading:e.featuredLoading,onViewAll:()=>e.onIntentChange(`featured`),props:e})}
    ${J({id:`trending`,title:d(`pluginsPage.intentTrending`),items:e.trending,loading:e.trendingLoading,onViewAll:()=>e.onIntentChange(`trending`),props:e})}
    ${C(n,e=>e.slug,n=>J({id:n.slug,title:n.label,items:t.filter(e=>e.catalog.categories.includes(n.slug)),onViewAll:()=>e.onCategoryChange(n.slug),props:e}))}
    ${J({id:`uncategorized`,title:d(`pluginsPage.categoryUncategorized`),items:i,props:e})}
  `}function Lr(e){let t=!e.query.trim()&&e.intent===`all`&&e.category===null;return b`<section class="plugin-catalog-results" aria-label=${d(`pluginsPage.exploreTitle`)}>
    <label class="plugin-catalog-search">
      <span aria-hidden="true">${D.search}</span>
      <input
        type="search"
        class="oc-input"
        autofocus
        aria-label=${d(`pluginsPage.searchPlugins`)}
        placeholder=${d(`pluginsPage.searchPlugins`)}
        .value=${e.query}
        ${he(e=>{e instanceof HTMLInputElement&&!e.dataset.autofocused&&(e.dataset.autofocused=`true`,e.focus(),requestAnimationFrame(()=>requestAnimationFrame(()=>{e.isConnected&&e.focus()})))})}
        @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onQueryChange(t.currentTarget.value)}}
      />
    </label>
    ${Pr(e)}
    ${e.remoteError?b`<div class="callout warning oc-banner" role="status">
            <span>${y(e.remoteError)}</span>
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary oc-banner-action"
              @click=${e.onRetry}
            >
              ${d(`pluginsPage.tryAgain`)}
            </button>
          </div>`:x}
    <div class="plugin-catalog-results__body">
      ${t?Ir(e):Fr(e)}
    </div>
  </section>`}var Rr,zr;function Br(){return(Br=e((()=>{S(),sr(),ge(),ye(),De(),O(),gt(),h(),p(),G(),xt(),B(),Ot(),Rr=8,zr={activity:D.activity,"book-open":D.book,brain:D.brain,bot:D.bot,database:A(T` <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />`),"git-branch":D.gitPullRequest,globe:D.globe,"message-circle":D.messageSquare,"message-square":D.messageSquare,mic:D.mic,package:D.box,palette:D.palette,shield:D.shield,wrench:D.settings,plug:D.plug,"code-xml":A(T` <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />`),server:D.server,files:A(T` <path d="M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
    <path d="M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z" />
    <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" />`),inbox:D.inbox,"list-todo":A(T` <path d="M13 5h8" />
    <path d="M13 12h8" />
    <path d="M13 19h8" />
    <path d="m3 17 2 2 4-4" />
    <rect x="3" y="4" width="6" height="6" rx="1" />`),"calendar-days":A(T` <path d="M8 2v3" />
    <path d="M16 2v3" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M8 13h.01" />
    <path d="M12 13h.01" />
    <path d="M16 13h.01" />
    <path d="M8 17h.01" />
    <path d="M12 17h.01" />
    <path d="M16 17h.01" />`),"wallet-cards":A(T` <path d="M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21" />
    <path d="M3 7h18" />
    <rect x="3" y="3" width="18" height="18" rx="2" />`),megaphone:A(T` <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
    <path d="M8 6v8" />`),"chart-no-axes-combined":A(T` <path d="M12 16v5" />
    <path d="M16 14.639V21" />
    <path d="M20 10.656V21" />
    <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
    <path d="M4 18.463V21" />
    <path d="M8 14.656V21" />`),workflow:A(T` <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />`),search:D.search}})))()}function Vr(e){return/^(?:clean|pass|safe|benign|cleared)$/iu.test(e)?`Clean`:/^(?:suspicious|warning|review)$/iu.test(e)?`Review`:e}function Hr(e){return/^(?:clean|pass|safe|benign|cleared)$/iu.test(e)?`pass`:/^(?:suspicious|warning|review)$/iu.test(e)?`warning`:/^(?:blocked|danger|fail|malicious)$/iu.test(e)?`danger`:`unknown`}function Ur(e,t){let n=Hr(e),r={pass:3,warning:2,danger:1,unknown:0}[n];return b`<a
    class="plugin-catalog-detail__security plugin-catalog-detail__security--${n}"
    href=${t??x}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2>
      ${d(`pluginsPage.detailSecurity`)}
      <span title=${d(`pluginsPage.detailSecurityAudit`)}>${D.info}</span>
    </h2>
    <div class="plugin-catalog-detail__security-score">
      <strong>${Vr(e)}</strong>
      ${[0,1,2].map(e=>b`<span class=${e<r?`is-filled`:``} aria-hidden="true"></span>`)}
    </div>
  </a>`}function Wr(){return(Wr=e((()=>{S(),O(),h(),M(),j()})))()}function Gr(e){if(!e)return null;try{let t=new URL(e);return/^https?:$/u.test(t.protocol)&&!t.username&&!t.password?t:null}catch{return null}}function Kr(e){if(!e)return null;let t=Gr(/^[\w.-]+\/[\w.-]+$/u.test(e)?`https://github.com/${e}`:e.replace(/^git\+/u,``));if(!t)return null;let n=t.hostname===`github.com`,[r,i]=t.pathname.split(`/`).filter(Boolean);if(n&&r&&i){let e=`${r}/${i.replace(/\.git$/u,``)}`;return{href:`https://github.com/${e}`,name:e,github:n}}return{href:t.href,name:t.hostname+t.pathname.replace(/\/$/u,``),github:n}}function qr(e,t){let n=e?.detail.author,r=n?.handle??e?.plugin.catalog.author,i=n?.displayName??t;return!i&&!r?x:b`<div class="plugin-catalog-detail__publisher">
    <span class="plugin-catalog-detail__publisher-name">
      ${i?b`<strong>${i}</strong>`:bt(r,{linked:!0})}
      ${n?.official===!0?Dt():x}
    </span>
    ${i?bt(r,{linked:!0}):x}
  </div>`}function Jr(e,t,n,r=!1){let i=e?.detail,a=e?.plugin.catalog,o=Kr(n?.repositoryUrl??i?.repositoryUrl??i?.verification?.sourceRepo),s=Gr(n?.documentationUrl??i?.documentationUrl),c=[[d(`pluginsPage.catalogDownloadsColumn`),a?.downloads===void 0?void 0:jr(a.downloads)],[d(`pluginsPage.detailPublished`),i?.createdAt===void 0?void 0:ae(i.createdAt,{dateStyle:`medium`})],[d(t?`pluginsPage.detailInstalledVersion`:`pluginsPage.version`),t??a?.latestVersion],[d(`pluginsPage.detailUpdated`),i?.updatedAt===void 0?void 0:ae(i.updatedAt,{dateStyle:`medium`})]],l=a?.categories??[],u=b`<span
    class="plugin-metadata__placeholder skeleton"
    aria-hidden="true"
  ></span>`;return b`
    ${r?b`<section class="plugin-metadata__loading" role="status" aria-label=${d(`pluginsPage.detailLoading`)}><span class="plugin-metadata__placeholder skeleton" aria-hidden="true"></span>${u}</section>`:x}
    ${i?.security?Ur(i.security.verdict??`unknown`,i.security.auditUrl):x}
    ${r||c.some(([,e])=>e!==void 0)?b`<dl class="plugin-metadata__facts">
            ${c.filter(([,e])=>r||e!==void 0).map(([e,t])=>b`<div>
                    <dt>${e}</dt>
                    <dd>${t??u}</dd>
                  </div>`)}
          </dl>`:x}
    ${l.length?b`<section class="plugin-metadata__section">
            <h2>${d(`pluginsPage.detailCategories`)}</h2>
            <div class="plugin-metadata__categories">
              ${l.map(e=>b`<span class="chip">${e}</span>`)}
            </div>
          </section>`:x}
    ${o?b`<section class="plugin-metadata__section">
            <h2>${d(`pluginsPage.detailRepository`)}</h2>
            <a
              class="plugin-metadata__repository"
              href=${o.href}
              target="_blank"
              rel="noopener noreferrer"
              >${o.github?D.github:D.externalLink}<span
                >${o.name}</span
              ></a
            >
          </section>`:x}
    ${s?b`<section class="plugin-metadata__section">
            <h2>${d(`pluginsPage.detailDocumentation`)}</h2>
            <a href=${s.href} target="_blank" rel="noopener noreferrer"
              >${d(`pluginsPage.detailDocumentation`)} ${D.arrowUpRight}</a
            >
          </section>`:x}
  `}function Y(e,t,n){return b`${t.length?b`<section class="plugin-capabilities">
          <h2>${e}<span>${t.length}</span></h2>
          <div>
            ${t.map(e=>{let t=e.onOpen,r=b`<span class="plugin-capability__icon" aria-hidden="true"
                  >${n}</span
                ><span class="plugin-capability__copy"
                  ><strong>${e.name}</strong
                  >${e.description?b`<span>${e.description}</span>`:x}</span
                >${t?D.chevronRight:x}`;return b`<div class="plugin-capability">
                ${t?b`<button type="button" @click=${t}>${r}</button>`:b`<div class="plugin-capability__static">${r}</div>`}
              </div>`})}
          </div>
        </section>`:x}`}function Yr(e,t=!0){return e?b`<button
        type="button"
        class="btn oc-action ${t?`primary oc-action-primary`:`oc-action-secondary`}"
        @click=${e}
      >
        ${d(`nav.askAssistant`)}
      </button>`:x}function X(){return(X=e((()=>{S(),O(),h(),_(),Br(),xt(),Wr()})))()}function Xr(e){let t=e?dt(e,{mode:`document`}).replaceAll(`<h1`,`<h2`).replaceAll(`</h1>`,`</h2>`):null;return e?b`<article
        class="plugin-catalog-detail__readme sidebar-markdown"
        @click=${ht}
      >
        ${ve(t)}
      </article>`:b`<p class="plugin-catalog-detail__empty">${d(`pluginsPage.detailNoReadme`)}</p>`}function Zr(e,t){let{plugin:n,detail:r}=e,i=!!(t.installProgress&&t.installProgress.finishedAt===void 0),a=n.catalog.imageUrl?t.iconUrls[n.catalog.imageUrl]:void 0,o=r.author?.imageUrl?t.iconUrls[r.author.imageUrl]:void 0;return Or({id:`plugin-catalog-detail`,name:n.catalog.name,summary:n.catalog.summary,backHref:t.backHref,backLabel:d(`tabs.plugins`),onBack:t.onBack,icon:U(n.id,n.catalog.name,a,void 0,`plugins-tile`,o),titleAction:b`${n.local.action===`install`||i?cr(t.installBlockedReason,b`<testclaw-plugin-install-action
              .buttonClass=${`btn oc-action plugin-catalog-detail__install`}
              .primary=${!0}
              .disabled=${!t.canInstall}
              .busy=${!!t.busy}
              .progress=${t.installProgress}
              .onInstall=${t.onInstall}
            ></testclaw-plugin-install-action>`):x}${Yr(t.onAskPlugin,n.local.action!==`install`&&!i)}`,identity:qr(e),sidebar:Jr(e),panel:b`${z(t.message,{busy:t.busy,onContinue:t.canInstall?t.onContinueInstall:void 0})}
    ${t.skillsSection??Y(d(`pluginsPage.detailTabs.skills`),r.skills,D.bookOpenText)}
    ${Y(d(`pluginsPage.detailTools`),(r.contracts?.tools??[]).map(e=>({name:e})),D.wrench)}
    ${Y(d(`pluginsPage.detailMcpServers`),r.mcpServers.map(e=>({name:e})),D.plug)}`,readme:r.readme?Xr(r.readme):void 0})}function Qr(e){return F(e.error?b`<div class="callout danger oc-banner oc-banner-error" role="alert">
          <span>${y(e.error)}</span>
          <button type="button" class="btn btn--sm" @click=${e.onRetry}>
            ${d(`pluginsPage.tryAgain`)}
          </button>
        </div>`:e.connected?e.result?Zr(e.result,e):b`<section
              class="plugin-catalog-detail plugin-catalog-detail--loading"
              aria-label=${d(`pluginsPage.detailLoading`)}
            >
              <div class="plugin-catalog-detail__back skeleton"></div>
              <div class="plugin-catalog-detail__hero">
                <div class="plugin-catalog-detail__icon skeleton"></div>
                <div>
                  <div class="plugin-catalog-detail__loading-title skeleton"></div>
                  <div class="plugin-catalog-detail__loading-publisher skeleton"></div>
                  <div class="plugin-catalog-detail__loading-summary skeleton"></div>
                </div>
              </div>
              <div class="plugin-catalog-detail__content">
                <div class="plugin-catalog-detail__panel" aria-hidden="true">
                  <div class="plugin-catalog-detail__loading-card skeleton"></div>
                  <div class="plugin-catalog-detail__loading-card skeleton"></div>
                </div>
                <aside class="plugin-catalog-detail__sidebar">
                  ${Jr(void 0,void 0,void 0,!0)}
                </aside>
              </div>
            </section>`:b`<p class="plugin-catalog-detail__empty">${d(`pluginsPage.discoveryOffline`)}</p>`,{wide:!0,carapace:!0})}function $r(){return($r=e((()=>{sr(),S(),be(),O(),nt(),ct(),H(),P(),h(),p(),G(),K(),X(),B()})))()}function ei(e,t){let n=t.trim().toLocaleLowerCase();return!n||[e.name,e.id,e.description,e.packageName].some(e=>e?.toLocaleLowerCase().includes(n))}function ti(e,t,n=[]){let{label:r,help:i}=Ft(e.path,e.schema,e.hints),a=[...n,r],o=zt(e);return me(e.schema)===`object`&&e.schema.properties&&Object.keys(e.schema.properties).length>0&&e.schema.additionalProperties===!1&&!e.schema.anyOf&&!e.schema.oneOf&&!e.schema.enum&&!$t(e.value)&&!e.unsupported.has(ce(e.path))&&!Ut(e,o)?Ht(e).fields.flatMap(e=>ti(e,t,a)):[{...e,property:t,label:a.join(`: `),help:i}]}var Z;function ni(){return(ni=e((()=>{S(),_e(),ye(),Wt(),qt(),Vt(),Qt(),Pt(),Yt(),Jt(),O(),P(),h(),it(),M(),m(),K(),an(),j(),Z=class extends f{constructor(...e){super(...e),this.query=``}willUpdate(e){e.has(`model`)&&e.get(`model`)?.pluginId!==this.model?.pluginId&&(this.query=``)}renderField(e){let{label:t,help:n,path:r,disabled:i}=e,a=this.onAskSetting,o=e.value===void 0?e.effectiveValue??e.schema.default:e.value,s=!se(r,e.hints)?.placeholder&&me(e.schema)===`boolean`&&!e.schema.enum&&!e.schema.anyOf&&!e.schema.oneOf,c=Xt(r,`plugin-help`),l={...e,value:e.value===void 0?e.effectiveValue:e.value,descriptionId:n?c:void 0},u=this.renderCredential?.(l)??Bt({...l,showLabel:!1,hints:{...e.hints,[ce(r)]:{...se(r,e.hints),label:t}}});return b`<div
      class="plugin-editor__row"
      data-setting=${r.slice(r[3]===`config`?4:3).join(`.`)}
      @click=${t=>{if(!s||i||getSelection()?.toString())return;let n=t.target;n instanceof Element&&!n.closest(`button,a,input,select,textarea,label,wa-switch,wa-checkbox,wa-dropdown,summary,[contenteditable]`)&&e.onPatch(r,!o)}}
    >
      <div class="plugin-editor__menu">
        <wa-dropdown
          placement="bottom-start"
          @wa-select=${t=>{t.detail.item.value===`reset`&&!i&&e.onPatch(r,e.isRequired?structuredClone(e.schema.default):void 0),t.detail.item.value===`ask`&&a?.({...e,value:o})}}
        >
          <button
            slot="trigger"
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${d(`pluginsPage.editor.actions`,{name:t})}
          >
            ${D.moreHorizontal}
          </button>
          <wa-dropdown-item
            value="reset"
            ?disabled=${i||e.value===void 0||e.isRequired&&e.schema.default===void 0}
            >${d(`pluginsPage.editor.reset`)}</wa-dropdown-item
          >
          ${a?b`<wa-dropdown-item value="ask">${d(`pluginsPage.editor.ask`)}</wa-dropdown-item>`:x}
        </wa-dropdown>
      </div>
      <div class="plugin-editor__copy">
        <span class="plugin-editor__title">${t}</span
        >${n?b`<p id=${c}>${n}</p>`:x}
      </div>
      <div class="plugin-editor__control">${u}</div>
    </div>`}renderPermissions(){if(!this.permissions)return x;let e=this.query.trim().toLocaleLowerCase(),t=this.permissions.fields.filter(t=>!e||`${d(`pluginsPage.editor.permissions`)} ${t.label} ${t.help??``}`.toLocaleLowerCase().includes(e)||It({...t,criteria:{text:e,tags:[]}}));return this.permissions.loading&&!e?N({rows:3,carapace:!0}):t.length?b`${C(t,e=>JSON.stringify(e.path),e=>this.renderField(e))}`:x}renderGroups(e,t){let n=t!==x,r=me(e.schema)!==`object`||e.schema.anyOf||e.schema.oneOf||e.schema.enum||e.unsupported.has(ce(e.path))?{fields:[e],additional:void 0}:Ht(e),i=(se(e.path,e.hints)?.groups??[]).toSorted((e,t)=>(e.order??0)-(t.order??0)),a=this.query.trim().toLocaleLowerCase(),o=r.fields.flatMap(e=>ti(e,String(e.path.at(-1)))).filter(e=>!a||It({...e,criteria:{text:a,tags:[]}})||[e.path.slice(4).join(`.`),e.label,e.help,i.find(t=>t.properties.includes(e.property))?.title].join(` `).toLocaleLowerCase().includes(a)),s=i.map(e=>({id:e.id,title:e.title,fields:e.properties.flatMap(e=>o.filter(t=>t.property===e))})),c=o.filter(e=>!i.some(t=>t.properties.includes(e.property)));s.push({id:`__ungrouped`,title:i.length?d(`pluginsPage.editor.other`):``,fields:c});let l=r.additional?Gt({...r.additional,searchCriteria:a?{text:a,tags:[]}:void 0},Bt):x,u=t=>Xt([...e.path,t],`section`),f=s.filter(e=>e.fields.length&&e.title);return n&&f.push({id:`__permissions`,title:d(`pluginsPage.editor.permissions`),fields:[]}),b`<div class="plugin-editor__layout">
      ${i.length?b`<nav class="plugin-editor__nav" aria-label=${d(`pluginsPage.editor.navigation`)}>
              ${f.map(e=>b`<a
                    href=${`#${u(e.id)}`}
                    @click=${t=>{t.preventDefault();let n=this.querySelector(`#${CSS.escape(u(e.id))}`);n?.scrollIntoView({block:`start`,behavior:Ke()}),n?.focus({preventScroll:!0})}}
                    >${e.title}</a
                  >`)}
            </nav>`:x}
      <div class="plugin-editor__sections">
        ${s.map(e=>e.fields.length?b`<section
                class="plugin-editor__section"
                id=${u(e.id)}
                tabindex="-1"
              >
                ${e.title?b`<h2>${e.title}</h2>`:x}
                <div class="plugin-editor__group">
                  ${C(e.fields,e=>JSON.stringify(e.path),e=>this.renderField(e))}
                </div>
              </section>`:x)}
        ${l===x?x:b`<section class="plugin-editor__section"><div class="plugin-editor__group">${l}</div></section>`}
        ${n?b`<section
                class="plugin-editor__section"
                id=${u(`__permissions`)}
                tabindex="-1"
              >
                <h2>${d(`pluginsPage.editor.permissions`)}</h2>
                <div class="plugin-editor__group">${t}</div>
              </section>`:x}
        ${!o.length&&l===x&&!n?b`<p class="plugin-editor__empty">${d(a?`pluginsPage.editor.noMatches`:`pluginsPage.editor.empty`)}</p>`:x}
      </div>
    </div>`}render(){let e=this.model;if(!e)return x;let t=e.result?.plugins.find(t=>t.id===e.pluginId)?.name??e.pluginId,n=this.renderPermissions(),r=n!==x,i=e.configSchema?{schema:e.configSchema,value:tn(e.configValue,e.pluginId).config,path:[`plugins`,`entries`,e.pluginId,`config`],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.connected||!e.canEditConfig||e.configBusy,compact:!0,commitOnBlur:!0,showLabel:!1,maskSensitive:!0,rawAvailable:!1,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove}:null,a=i?zt(i):void 0,o=i&&Ut(i,a)?b`<testclaw-config-form-structured-draft
            .props=${{identity:JSON.stringify(i.path),sourceIdentity:i.value,initialValue:a,params:i,renderNode:e=>this.renderGroups(e,n)}}
          ></testclaw-config-form-structured-draft>`:i?this.renderGroups(i,n):x;return b`<section class="plugin-editor">
      <header class="plugin-editor__header">
        ${Dr({name:d(`pluginsPage.detailSettings`),backHref:e.backHref,backLabel:t,onBack:e.onBack})}
      </header>
      <label class="plugin-editor__search"
        >${D.search}<input
          type="search"
          class="settings-input"
          aria-label=${d(`pluginsPage.editor.search`)}
          placeholder=${d(`pluginsPage.editor.search`)}
          .value=${this.query}
          @input=${e=>{this.query=e.currentTarget.value}}
      /></label>
      ${e.configError?b`<div class="callout danger" role="alert">${e.configError}<button class="btn btn--sm" @click=${e.configValue&&e.configSchema?e.onConfigWriteRetry:e.onConfigReadRetry}>${d(`common.retry`)}</button></div>`:x}
      ${e.configSchemaLoading||!e.configValue?N({rows:2,carapace:!0}):o}
      ${r&&!i?b`<section class="plugin-editor__section">
              <h2>${d(`pluginsPage.editor.permissions`)}</h2>
              <div class="plugin-editor__group">${n}</div>
            </section>`:x}
    </section>`}},u([E({attribute:!1})],Z.prototype,`model`,void 0),u([E({attribute:!1})],Z.prototype,`permissions`,void 0),u([E({attribute:!1})],Z.prototype,`onAskSetting`,void 0),u([E({attribute:!1})],Z.prototype,`renderCredential`,void 0),u([w()],Z.prototype,`query`,void 0),customElements.define(`testclaw-plugin-settings-editor`,Z)})))()}function ri(e,t){let n=R(t.id),r=e.busy[n],i=!!r,a=r===`enable`||r===`disable`?r:t.enabled?`disable`:`enable`,o=(e,n,a,o,s,c)=>cr(o,b`<button
        type="button"
        class=${`btn oc-action ${a}`}
        ?disabled=${!o&&(!s||i)}
        aria-disabled=${!s||i?`true`:x}
        aria-label=${`${n} ${t.name}`}
        aria-busy=${r===e?`true`:x}
        @click=${()=>{s&&!i&&c()}}
      >
        ${r===e?b`<span class="btn__spinner" aria-hidden="true"></span>`:x}${n}
      </button>`),s=Yr(e.onAskPlugin,t.enabled);return b`
    ${t.enabled?s:x}
    ${o(a,d(a===`disable`?`pluginsPage.detailDisable`:`pluginsPage.detailEnable`),t.enabled?`oc-action-secondary`:`primary oc-action-primary`,e.mutationBlockedReason??(t.state===`needs-setup`?d(`pluginsPage.setupRequiredNotice`):null),e.canMutate&&t.state!==`needs-setup`,()=>e.onSetEnabled(t.id,!t.enabled,n))}
    ${t.enabled?x:s}
    ${t.removable?o(`uninstall`,d(`pluginsPage.uninstall`),`oc-action-secondary`,e.mutationBlockedReason,e.canMutate,()=>e.onUninstall(t.id,n)):x}
    <a
      class="btn btn--icon oc-action oc-action-icon oc-action-secondary"
      href=${e.settingsHref}
      aria-label=${d(`pluginsPage.detailSettings`)}
      @click=${t=>{v(t)&&(t.preventDefault(),e.onSettings())}}
      >${D.settings}</a
    >
  `}function ii(){return(ii=e((()=>{S(),O(),H(),h(),X(),B()})))()}function Q(e,t){return b`<div
    class="callout danger plugins-settings-error oc-banner oc-banner-error"
    role="alert"
  >
    <span>${e}</span>
    <button type="button" class="btn btn--sm oc-action oc-action-secondary" @click=${t}>
      ${d(`pluginsPage.tryAgain`)}
    </button>
  </div>`}function ai(e){return b`<button
    type="button"
    class="btn btn--xs btn--icon oc-action oc-action-icon oc-action-secondary"
    aria-label=${d(`common.reload`)}
    ?disabled=${e.configBusy||e.configSchemaLoading}
    @click=${e.onConfigReload}
  >
    ${D.refresh}
  </button>`}function oi(e){return ft({id:`plugin-settings`,active:e.tab,tabs:[{value:`installed`,label:d(`pluginsPage.settingsInstalled`)},{value:`advanced`,label:d(`pluginsPage.advanced`)}],ariaLabel:d(`pluginsPage.settingsTabs`),panelId:`plugin-settings-panel`,variant:`sub`,className:`plugins-settings-tabs`,carapace:!0,onSelect:e.onTabChange})}function si(e){if(!e.connected)return I(d(`pluginsPage.connectToManage`),{carapace:!0});if(e.loading)return N({rows:4,carapace:!0});if(e.error&&!e.result)return Q(e.error,e.onRefresh);let t=e.error?Q(e.error,e.onRefresh):x,n=(e.result?.plugins??[]).filter(t=>t.installed&&ei(t,e.query)).toSorted((e,t)=>e.name.localeCompare(t.name));return n.length===0?b`${t}${I(e.query?d(`pluginsPage.noSettingsMatches`):d(`pluginsPage.noInstalled`),{carapace:!0})}`:b`${t}${C(n,e=>e.id,t=>{let n=R(t.id);return b`
        <article
          class="settings-row settings-row--nav plugins-settings-row oc-settings-row"
          data-plugin-id=${t.id}
          @click=${n=>{let r=n.target;(!(r instanceof Element)||!r.closest(`button, a`))&&e.onOpenPlugin(t.id)}}
        >
          ${U(t.id,t.name,e.iconUrls[t.id],()=>e.onIconError(t.id))}
          <a
            class="settings-row__text plugins-settings-row__link oc-settings-row-content"
            href=${e.pluginHref(t.id)}
            @click=${n=>{v(n)&&(n.preventDefault(),e.onOpenPlugin(t.id))}}
          >
            <span class="settings-row__title oc-settings-row-title">${t.name}</span>
            <span class="settings-row__desc oc-settings-row-description"
              >${t.description||d(`pluginsPage.optionalCapability`)}</span
            >
          </a>
          <div class="settings-row__control oc-settings-row-control">
            ${t.state===`not-installed`?x:kt(t.state,`plugins-settings-row__status`)}
            <span class="settings-row__chevron" aria-hidden="true">${D.chevronRight}</span>
          </div>
          ${z(e.messages[n])}
        </article>
      `})}`}function ci(e){return e.connected?!e.advancedSchema||!e.configValue?e.configError?Q(e.configError,e.onConfigReadRetry):e.configSchemaLoading||!e.configValue?N({rows:4,carapace:!0}):I(d(`pluginsPage.schemaUnavailable`),{carapace:!0}):b`
    ${Bt({rawAvailable:!1,maskSensitive:!0,schema:e.advancedSchema,value:e.configValue.plugins??{},path:[`plugins`],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.canEditConfig||e.configBusy,showLabel:!1,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove})}
    ${e.configError?Q(e.configError,e.onConfigWriteRetry):x}
  `:I(d(`pluginsPage.connectToManage`),{carapace:!0})}function li(e){let t=e.tab===`installed`?b`
          <label class="plugins-settings-search">
            <span class="settings-control__sr-label">${d(`pluginsPage.searchInstalled`)}</span>
            <span aria-hidden="true">${D.search}</span>
            <input
              class="settings-input oc-input"
              type="search"
              aria-label=${d(`pluginsPage.searchInstalled`)}
              placeholder=${d(`pluginsPage.searchInstalled`)}
              .value=${e.query}
              @input=${t=>{e.onQueryChange(t.currentTarget.value)}}
            />
          </label>
          <div class="settings-group oc-settings-group">${si(e)}</div>
        `:b`<div id="plugin-settings-advanced">
          ${ot({title:d(`pluginsPage.advanced`),description:d(`pluginsPage.advancedDescription`),actions:ai(e),carapace:!0},ci(e))}
        </div>`;return F(b`
      ${st({title:d(`tabs.plugins`),subtitle:d(`pluginsPage.settingsDescription`)})}
      <div class="plugins-settings-content">
        ${oi(e)}
        <wa-tab-panel
          id="plugin-settings-panel"
          name=${e.tab}
          active
          aria-labelledby=${`plugin-settings-tab-${e.tab}`}
        >
          ${t}
        </wa-tab-panel>
      </div>
    `,{carapace:!0})}function ui(e){if(!e.inspection)return{fields:[],loading:!0};let t=e.hostControlsSchema&&e.configValue?Ht({rawAvailable:!1,maskSensitive:!0,schema:e.hostControlsSchema,value:tn(e.configValue,e.pluginId),path:[`plugins`,`entries`,e.pluginId],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.connected||!e.canEditConfig||e.configBusy,showLabel:!1,compact:!0,commitOnBlur:!0,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove}).fields.flatMap(e=>ti(e,String(e.path.at(-1)))):[];for(let n of t){let t=n.path[4];if(n.path[3]!==`hooks`||n.path.length!==5||t!==`allowPromptInjection`&&t!==`allowConversationAccess`)continue;let r=t===`allowPromptInjection`?`promptContextAccess`:`conversationAccess`;n.label=d(`pluginsPage.${r}`),n.help=d(`pluginsPage.${r}Description`),n.effectiveValue=e.inspection.grants.hooks[t].effective}return{fields:t}}function di(e){let t=e.result?.plugins.find(t=>t.id===e.pluginId);if(!e.connected)return F(I(d(`pluginsPage.connectToManage`),{carapace:!0}),{carapace:!0});if(e.error&&!e.result)return F(Q(e.error,e.onRefresh),{carapace:!0});if(!e.result)return F(N({rows:5,carapace:!0}),{carapace:!0});if(!t?.installed)return F(b`
        <a
          class="btn btn--sm oc-action oc-action-secondary"
          href=${e.backHref}
          @click=${t=>{t.preventDefault(),e.onBack()}}
        >
          ${D.chevronLeft} ${e.backLabel}
        </a>
        ${I(d(`pluginsPage.pluginNotFound`),{carapace:!0})}
      `,{carapace:!0});let n=R(t.id),r=e.catalog??e.inspection?.catalog,i=e.inspection?.components,a=e.tab===`configuration`,o=b`${e.error?Q(e.error,e.onRefresh):x}
  ${e.inspectionError?Q(e.inspectionError,e.onRetryInspection):x}
  ${t.error?b`<div class="callout danger oc-banner oc-banner-error" role="alert">${y(t.error)}</div>`:x}
  ${z(e.messages[n])}`;if(a)return F(b`
        ${o}
        <testclaw-plugin-settings-editor
          .model=${e}
          .renderCredential=${e.renderCredential}
          .onAskSetting=${e.onAskSetting}
          .permissions=${ui(e)}
        ></testclaw-plugin-settings-editor>
      `,{wide:!0,carapace:!0});let s=e=>(e??[]).map(e=>({name:e})),c=(i?.skills??[]).map(e=>({name:e,description:r?.detail.skills.find(t=>t.name===e)?.description})),l=e.tools??s(e.inspection?.declared.tools??r?.detail.contracts?.tools);return F(Or({id:`plugin-installed-detail`,name:t.name,summary:t.description||r?.plugin.catalog.summary,backHref:e.backHref,backLabel:e.backLabel,onBack:e.onBack,icon:U(t.id,t.name,e.iconUrls[t.id]??(r?.plugin.catalog.imageUrl?e.catalogIconUrls?.[r.plugin.catalog.imageUrl]:void 0),()=>e.onIconError(t.id),`plugins-tile`,r?.detail.author?.imageUrl?e.catalogIconUrls?.[r.detail.author.imageUrl]:void 0),identity:qr(r,e.inspection?.overview?.publisherName),titleAction:e.installProgress?b`<testclaw-plugin-install-action
              .buttonClass=${`btn oc-action plugin-catalog-detail__install`}
              .primary=${!0}
              .progress=${e.installProgress}
            ></testclaw-plugin-install-action
            >${Yr(e.onAskPlugin,!1)}`:ri({...e,settingsHref:e.settingsHref??`#configuration`,onSettings:()=>e.onTabChange(`configuration`)},t),sidebar:r||t.version||e.inspection?.overview||e.catalogLoading?Jr(r,t.version,e.inspection?.overview,e.catalogLoading):void 0,panel:b`${o}
      ${!e.inspection&&!r&&!e.inspectionError?N({rows:2,carapace:!0}):x}
      ${e.skillsSection??Y(d(`pluginsPage.detailTabs.skills`),c,D.bookOpenText)}
      ${Y(d(`pluginsPage.detailTools`),l.map(({name:t,description:n})=>({name:t,description:n,onOpen:n?.trim()&&e.onOpenTool?()=>e.onOpenTool?.(t):void 0})),D.wrench)}
      ${Y(d(`pluginsPage.detailMcpServers`),s(i?.mcpServers??r?.detail.mcpServers),D.plug)}`,readme:e.inspection?.overview?.readme||r?.detail.readme?Xr(e.inspection?.overview?.readme??r?.detail.readme):void 0}),{wide:!0,carapace:!0})}function fi(){return(fi=e((()=>{S(),ye(),Vt(),Jt(),lt(),O(),P(),h(),p(),$r(),G(),K(),X(),xt(),B(),ni(),ii(),an()})))()}function pi(e,t){return e.description?.trim()?Pe({signal:t,value:void 0},({render:t,finish:n})=>{t(()=>b`<testclaw-modal-dialog
        class="plugin-tool-dialog"
        label=${e.name}
        @modal-cancel=${()=>n(void 0)}
      >
        <article class="plugin-tool-preview">
          <header>
            <h2>${e.name}</h2>
            <button
              class="btn btn--icon"
              type="button"
              aria-label=${d(`common.close`)}
              @click=${()=>n(void 0)}
            >
              ${D.x}
            </button>
          </header>
          <p>${e.description}</p>
        </article>
      </testclaw-modal-dialog>`)}):Promise.resolve()}function mi(){return(mi=e((()=>{S(),O(),Ne(),h()})))()}function hi(e){let t=e.state;if(!t)return x;let n=t.result?.files.map(e=>({path:e.path,size:``,contents:e.content??``,...e.status!==`ready`&&e.status!==`deferred`?{message:d(`filePreview.bundle.${e.status}`)}:{}}))??[],r=t.result?.files.find(e=>e.path===t.activePath),i=t.fileErrors.get(t.activePath)??(r?.status===`unavailable`?d(`filePreview.bundle.unavailable`):``),a=t.result&&(!t.result.inventoryComplete||t.result.files.some(e=>e.status===`unavailable`||e.status===`too-large`));return b`<testclaw-file-preview-modal
    .label=${t.request.skillName}
    .files=${n}
    .directories=${t.result?.directories??[]}
    .activePath=${t.activePath}
    layout="document"
    .loading=${t.loading}
    .fileLoading=${t.pendingPaths.has(t.activePath)}
    .error=${t.error??(t.pendingPaths.has(t.activePath)?``:i)}
    .notice=${a?d(`filePreview.bundle.incomplete`):``}
    @file-preview-select=${t=>e.select(t.detail)}
    @file-preview-retry=${()=>e.retry()}
    @file-preview-close=${()=>e.close()}
  ></testclaw-file-preview-modal>`}function gi(e,t){return b`<div class="plugin-skills-section">
    ${Y(d(`pluginsPage.detailTabs.skills`),e.map(e=>({...e,onOpen:()=>t(e.name)})),D.bookOpenText)}
  </div>`}var _i;function vi(){return(vi=e((()=>{S(),O(),mn(),h(),fn(),M(),p(),X(),mi(),pn(),j(),_i=class{constructor(e,t){this.host=e,this.gateway=t,this.state=null,this.sequence=0,this.toolAbort=new AbortController}async open(e){this.close();let t=this.sequence,n=this.gateway.capture();if(this.state={request:{...e},loading:!!n,error:n?null:d(`pluginsPage.connectToManage`),result:null,activePath:`SKILL.md`,pendingPaths:new Set,fileErrors:new Map},this.host.requestUpdate(),!n)return;let r=()=>this.sequence===t&&this.gateway.isCurrent(n);try{let t=await n.client.request(`plugins.skills.read`,e);r()&&this.state&&(this.state.result=t,this.state.activePath=t.entryPath,t.version&&(this.state.request={...this.state.request,version:t.version}))}catch(e){r()&&this.state&&(this.state.error=g(e))}finally{r()&&this.state&&(this.state.loading=!1,this.host.requestUpdate())}}openTool(e){this.close(),pi(e,this.toolAbort.signal)}retry(){this.state?.result?this.select(this.state.activePath):this.state&&this.open(this.state.request)}async select(e){let t=this.state,n=t?.result?.files.find(t=>t.path===e);if(!t||!n||(t.activePath=e,this.host.requestUpdate(),t.pendingPaths.has(e)||n.status!==`deferred`&&n.status!==`unavailable`))return;let r=this.gateway.capture();if(!r){t.fileErrors.set(e,d(`pluginsPage.connectToManage`));return}let i=()=>this.state===t&&this.gateway.isCurrent(r);t.pendingPaths.add(e),t.fileErrors.delete(e);try{let n=await r.client.request(`plugins.skills.read`,{...t.request,path:e});if(!i()||!t.result)return;let a=n.files.find(t=>t.path===e);if(n.version!==t.result.version||n.rootPath!==t.result.rootPath||!a||a.status===`deferred`)throw Error(d(`filePreview.bundle.unavailable`));t.result={...t.result,files:t.result.files.map(t=>t.path===e?a:t)}}catch(n){i()&&t.fileErrors.set(e,g(n))}finally{i()&&(t.pendingPaths.delete(e),this.host.requestUpdate())}}close(){this.sequence++,this.toolAbort.abort(),this.toolAbort=new AbortController,this.state=null,this.host.requestUpdate()}}})))()}function yi(e){e.help?.update(e);let t=e.help?.available?e.help.ask:void 0,n=t?()=>void t():void 0,{actions:r,catalogDetail:i,consentController:a,context:o,detail:s,discovery:c}=e,l=o.runtimeConfig.state,u=Kt(l.configSchema),f=i?.result,p=f?.plugin.catalog.latestVersion,m=f&&p&&f.detail.skills.length?gi(f.detail.skills,e=>r.openSkill({source:`catalog`,catalogId:f.plugin.id,version:p,skillName:e})):void 0,h=s?.pluginId??null,g=i?a.getActiveInstall(`install:${i.id}`):void 0,ee=new URLSearchParams(e.routeData?.location.search??``).get(`from`)===`plugins`?`plugins`:`plugin-settings`,te={connected:e.connected,loading:e.loading,result:e.result,error:e.error,busy:e.busy,messages:e.messages,iconUrls:e.iconUrls,canMutate:e.canMutate,mutationBlockedReason:e.mutationBlockedReason,configBusy:l.configLoading,configError:l.lastError,canEditConfig:e.canEditConfig,configValue:l.configForm,configHints:l.configUiHints,configSchemaLoading:l.configSchemaLoading,configUnsupportedPaths:u.unsupportedPaths,onIconError:r.handlePluginIconError,onSetEnabled:r.updateEnabled,onUninstall:r.uninstall,onConfigPatch:r.patchConfig,onConfigRemove:r.removeConfig,onConfigReload:r.reloadConfig,onConfigReadRetry:r.retryConfigRead,onConfigWriteRetry:r.retryConfigWrite,onRefresh:r.refreshCatalog,onAskPlugin:n,onAskSetting:t},_=t=>{let n=s?.inspection?.components,i=n?.skillDetails??n?.skills.map(e=>({name:e}))??[],c=e.routeData?.location,l=new URLSearchParams(c?.search);l.set(`view`,`settings`);let f=e.installedDetailTab===`configuration`,p=new URLSearchParams(c?.search);p.delete(`view`);let h=`${c?.pathname??``}${p.size?`?${p}`:``}`;return di({...te,pluginId:t,installProgress:a.getActiveInstall(R(t)),inspection:s?.inspection??null,catalog:s?.catalog,inspectionError:s?.error??null,catalogLoading:s?.catalogLoading,catalogIconUrls:e.catalogIconUrls,renderCredential:e.renderCredential,tools:s?.tools,onOpenTool:r.openTool,skillsSection:i.length?gi(i,e=>r.openSkill({source:`installed`,pluginId:t,skillName:e})):n?void 0:m,settingsHref:`${c?.pathname??``}?${l}`,configSchema:rn(u.schema,t),hostControlsSchema:en(u.schema,t),backHref:f?h:k(e.surface===`discovery`?`plugins`:ee,o.basePath),backLabel:e.surface===`discovery`||ee===`plugins`?d(`tabs.plugins`):d(`nav.settings`),tab:e.installedDetailTab,onBack:f?()=>r.selectInstalledDetailTab(`readme`):e.surface===`discovery`?r.closeCatalogDetail:()=>r.closeSettingsDetail(ee),onRetryInspection:()=>r.retrySettingsDetail(t),onTabChange:r.selectInstalledDetailTab})};return b`
    ${e.surface===`discovery`&&!i?sn({active:`plugins`,onSelect:r.selectHubTab,secondaryAction:{label:d(`pluginsPage.pluginSettings`),icon:D.settings,onClick:()=>r.openPluginSettings(null,!1)}}):x}
    ${Lt(b`
      <testclaw-plugin-manager></testclaw-plugin-manager>
      ${z(e.pageNotice??void 0)}
      ${e.surface===`discovery`?b`<wa-tab-panel
              id=${cn}
              name="plugins"
              active
              aria-labelledby="plugins-tab-plugins"
              >${i?h&&!g?_(h):Qr({onAskPlugin:n,connected:e.connected,skillsSection:m,result:i.result,error:i.error,backHref:k(`plugins`,o.basePath),onBack:r.closeCatalogDetail,onRetry:r.retryCatalogDetail,canInstall:e.canMutate&&!e.messages[`install:${i.id}`]?.savedInstall&&!!(i.result&&ar(i.result)),installBlockedReason:e.mutationBlockedReason,onInstall:()=>r.installCatalogEntry(i.id),busy:!!e.busy[`install:${i.id}`],installProgress:a.installProgress.get(`install:${i.id}`),message:e.messages[`install:${i.id}`],onContinueInstall:e=>void a.install(e,`install:${i.id}`),iconUrls:e.catalogIconUrls}):F(Lr({connected:e.connected,loading:c.loading,result:c.result,error:c.error??e.error,remoteError:c.remoteError,categories:c.categories,featured:c.featured,featuredLoading:c.featuredLoading,trending:c.trending,trendingLoading:c.trendingLoading,loadingMore:c.loadingMore,loadMoreError:c.loadMoreError,intent:c.intent,category:c.category,query:c.query,iconUrls:e.catalogIconUrls,pluginIconUrls:e.iconUrls,canInstall:e.canMutate,installProgress:a.installProgress,entryHref:e=>we(e,o.basePath),onIntentChange:e=>c.selectIntent(e),onCategoryChange:e=>c.selectCategory(e),onQueryChange:e=>c.updateQuery(e),onOpenEntry:e=>o.navigate(`plugins`,{pathname:we(e,o.basePath)}),onInstall:r.installCatalogEntry,busy:e.busy,messages:e.messages,onContinueInstall:(e,t)=>void a.install(t,`install:${e}`),onLoadMore:()=>void c.loadMore(),onRetry:()=>void c.refresh()}),{wide:!0,carapace:!0})}</wa-tab-panel
            >`:h?_(h):li({...te,tab:e.settingsTab,query:e.query,advancedSchema:nn(u.schema),onTabChange:r.selectSettingsTab,onQueryChange:r.setQuery,pluginHref:e=>Se(e,o.basePath),onOpenPlugin:e=>r.openPluginSettings(e,!1)})}
    `)}
    ${hi(e.skillPreview)}
    ${a.consent?Cr({consent:a.consent,inspection:a.inspection,loading:a.inspectionLoading,error:a.inspectionError,iconUrl:a.consent.pluginId?e.iconUrls[a.consent.pluginId]:void 0,canMutate:e.canMutate,mutationBlockedReason:e.mutationBlockedReason,busy:Object.values(e.busy).some(Boolean),onCancel:()=>a.close(),onConfirm:()=>a.confirm(),onRetry:()=>void a.inspect()}):x}
  `}function bi(){return(bi=e((()=>{S(),Le(),Jt(),O(),P(),Rt(),h(),$r(),Br(),G(),B(),ln(),on(),or(),an(),fi(),vi()})))()}var $;function xi(){return(xi=e((()=>{r(),Ze(),_e(),Le(),Ae(),je(),h(),p(),Ve(),We(),m(),ne(),Fn(),Ln(),zn(),Vn(),Zn(),$n(),nr(),or(),bi(),vi(),$=class extends f{constructor(...e){super(...e),this.surface=`settings`,this.result=null,this.error=null,this.query=``,this.settingsTab=`installed`,this.busy={},this.messages={},this.detail=null,this.iconUrls={},this.catalogIconUrls={},this.pageNotice=null,this.catalogDetail=null,this.installedDetailTab=`readme`,this.installRequestGeneration=0,this.help=new In(this),this.configAutoSaveStatus=this.context?.runtimeConfig.state.configAutoSaveStatus??`idle`,this.pluginConfigEditPending=!1,this.routeDataConsumed=!1,this.icons=new tr({getContext:()=>this.context,isConnected:()=>this.isConnected,onInstalledUrlsChange:e=>{this.iconUrls=e},onCatalogUrlsChange:e=>{this.catalogIconUrls=e}}),this.gateway=new Ge(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.result=null,this.error=null,this.messages={},this.pageNotice=null},invalidateRequests:e=>this.invalidateRequests(e.identityChanged||e.snapshot.phase!==`connected`||!e.snapshot.client),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.skillPreview=new _i(this,this.gateway),this.discovery=new Pn(this,{getClient:()=>this.gateway.client,isConnected:()=>this.gateway.connected}),this.settings=new Bn({gateway:this.gateway,getContext:()=>this.context,getDetail:()=>this.detail,canInspect:()=>xe(this.context.gateway.snapshot.hello?.auth??null),canEdit:()=>this.canEditConfig(),onEdit:()=>{this.pluginConfigEditPending=!0},isSettings:()=>this.installedDetailTab===`configuration`}),this.consentController=new Xn({gateway:this.gateway,getContext:()=>this.context,getResult:()=>this.result,canMutate:()=>this.canMutate(),isBusy:e=>!!this.busy[e],setBusy:(e,t)=>this.setBusy(e,t),setMessage:(e,t)=>this.setMessage(e,t),getMessages:()=>this.messages,clearPageNotice:()=>{this.pageNotice=null},closeDetails:()=>this.skillPreview.close(),applyMutationResult:e=>this.applyMutationResult(e),refreshCatalogAfterMutation:e=>this.refreshCatalog(e),requestUpdate:()=>this.requestUpdate()}),this.catalogTask=new Ye(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`plugins.list`,{},{signal:t}):Xe,onComplete:e=>{this.replaceResult(e),this.surface===`settings`&&this.showDetails(this.activeRoutePluginId)},onError:e=>{this.error=g(e)}}),this.subscriptions=new ue(this).effect(()=>this.context?.runtimeConfig,e=>(this.surface===`settings`&&(e.ensureLoaded(),e.ensureSchemaLoaded()),this.configAutoSaveStatus=e.state.configAutoSaveStatus,e.subscribe(()=>{let t=e.state.configAutoSaveStatus,n=this.configAutoSaveStatus===`saving`&&t===`saved`;this.configAutoSaveStatus=t,this.requestUpdate(),n&&this.pluginConfigEditPending&&(this.pluginConfigEditPending=!1,this.refreshCatalog())}))),this.handleDocumentKeydown=e=>{if(e.key!==`Escape`||document.querySelector(`.shell-nav[aria-modal='true']`)||e.target instanceof Element&&e.target.closest(`wa-dropdown[open]`))return;let t=this.querySelector(`testclaw-plugin-install-action[open]`);if(t){t.dismiss(),e.stopPropagation();return}if(this.consentController.consent){this.consentController.close(),e.stopPropagation();return}if(!(this.skillPreview.state||document.querySelector(`testclaw-modal-dialog`))){if(this.querySelector(`:focus`)?.blur(),this.catalogDetail){this.closeCatalogDetail(),e.stopPropagation();return}this.detail&&(this.detail=null,this.surface===`settings`&&this.context.replace(`plugin-settings`,{pathname:k(`plugin-settings`,this.context.basePath)}),e.stopPropagation())}}}willUpdate(e){e.has(`routeData`)&&(this.skillPreview.close(),e.get(`routeData`)?.location.pathname!==this.routeData?.location.pathname&&(this.installRequestGeneration+=1),this.applyRouteData())}updated(){this.icons.syncInstalled(this.result,this),this.icons.syncCatalog(this.discovery,this,this.detail?.catalog??this.catalogDetail?.result)}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0)}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),this.skillPreview.close(),this.discovery.disconnect(),this.subscriptions.clear(),this.icons.reset(),super.disconnectedCallback()}handleGatewaySnapshot(e){let t=e.snapshot,n=t.pluginCapabilities?.generation,r=n!==void 0&&n!==this.pluginGeneration;this.pluginGeneration=n,!e.initial&&r&&this.skillPreview.close();let i=this.icons.updateAuth({hello:t.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}),a=!e.initial&&(e.identityChanged||e.connectionChanged||i||r)&&t.phase===`connected`&&this.routeDataConsumed;!e.initial&&i&&!e.identityChanged&&!e.connectionChanged&&(this.gateway.invalidate(),this.invalidateRequests(t.phase!==`connected`||!t.client)),!e.initial&&(e.identityChanged||e.connectionChanged||i)&&(this.icons.reset(),this.busy={}),a?this.refreshCatalog():this.ensureInitialData()}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataConsumed=!0;let t=this.surface===`settings`?this.activeRoutePluginId:null,n=this.surface===`discovery`?this.activeRoutePluginId:null;this.surface===`settings`&&!t&&(this.settingsTab=new URLSearchParams(e.location.search).get(`tab`)===`advanced`?`advanced`:`installed`),(t||n)&&(this.installedDetailTab=new URLSearchParams(e.location.search).get(`view`)===`settings`?`configuration`:Tn(e.location.hash)),this.gateway.isRouteDataCurrent(e)&&(this.pluginGeneration!==void 0&&(e.result?.generation??-1)<this.pluginGeneration?this.refreshCatalog():(this.replaceResult(e.result),this.error=e.error)),this.surface===`settings`&&t!==this.detail?.pluginId&&this.showDetails(t),n!==this.catalogDetail?.id&&this.showCatalogDetail(n),this.ensureInitialData()}invalidateRequests(e=!0){e&&(this.catalogTask.run([null]),this.discovery.invalidate()),this.skillPreview.close(),this.detail=null,this.catalogDetail=null,this.installRequestGeneration+=1,this.consentController.reset()}replaceResult(e,t=!1){t?this.icons.reconcileInstalled(e):this.icons.resetInstalled(),this.messages=this.consentController.reconcileInstallMessages(e),this.result=e,e&&this.surface===`discovery`&&this.refreshDiscovery()}get loading(){return this.gateway.connected&&(!this.routeDataConsumed||this.catalogTask.status===Je.PENDING)}get activeRoutePluginId(){let e=this.routeData?.location.pathname??``;return this.surface===`settings`?Oe(e,this.context.basePath):Re(e,this.context.basePath)}ensureInitialData(){this.routeDataConsumed&&this.gateway.connected&&this.gateway.client&&(this.activeRoutePluginId&&this.installedDetailTab===`configuration`&&(this.context.runtimeConfig.ensureLoaded(),this.context.runtimeConfig.ensureSchemaLoaded()),!this.loading&&!this.result&&!this.error&&this.refreshCatalog())}async refreshCatalog(e=this.gateway.connected?this.gateway.client:null){e&&(this.error=null,await this.catalogTask.run([e]))}async refreshDiscovery(){if(this.surface!==`discovery`)return;let e=this.activeRoutePluginId;e?await this.showCatalogDetail(e):await this.discovery.refresh()}selectHubTab(e){(e!==`plugins`||this.surface!==`discovery`)&&this.context.navigate(e)}accessBlockedReason(e,t=this.gateway.connected){return ir({connected:t,hasAdminAccess:xe(this.context.gateway.snapshot.hello?.auth??null),mutationAllowed:e})}canMutate(){return this.result?.mutationAllowed===!0&&this.accessBlockedReason()===null}canEditConfig(){let e=this.context.runtimeConfig;return this.accessBlockedReason(e.canSet,e.state.connected)===null}setBusy(e,t){let n={...this.busy};t?n[e]=t:delete n[e],this.busy=n}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}applyMutationResult(e){this.icons.invalidateInstalled(e.plugin.id),this.replaceResult(rr(this.result,e.plugin),!0)}async showDetails(e){let t=this.detail?.pluginId===e?this.detail:null,n=this.catalogDetail?.result,r=this.result?.plugins.find(t=>t.id===e),i=e?{...t,pluginId:e,inspection:t?.inspection??null,catalog:t?.catalog??(n&&n.plugin.id===r?.catalogId?n:void 0),error:null}:null;this.detail=i;let a=this.gateway.capture();r?.installed&&i&&a&&await Qn({plugin:r,client:a.client,initial:i,includeTools:Ue(this.context.gateway.snapshot,`tools.catalog`)===!0,isCurrent:()=>this.gateway.isCurrent(a)&&this.detail===i,onChange:e=>{i=e,this.detail=e}})}async showCatalogDetail(e){let t=e?{id:e,result:this.catalogDetail?.id===e?this.catalogDetail.result:null,error:null}:null;this.surface===`discovery`&&this.catalogDetail?.id!==e&&(this.detail=null),this.catalogDetail=t;let n=this.gateway.capture();if(!t||!n)return;let r=this.result?.plugins.find(t=>t.installed&&t.catalogId===e);if(r){new URLSearchParams(this.routeData?.location.search).get(`action`)===`install`&&this.context.replace(`plugins`,{pathname:this.routeData?.location.pathname,search:``}),await this.showDetails(r.id);return}this.detail=null;try{let e=await re(n.client,t.id);if(this.gateway.isCurrent(n)&&this.catalogDetail===t){this.catalogDetail={...t,result:e};let n=e.plugin.local.installed?e.plugin.local.pluginId:void 0;this.showDetails(n??null),new URLSearchParams(this.routeData?.location.search).get(`action`)===`install`&&this.context.replace(`plugins`,{pathname:this.routeData?.location.pathname,search:``})}}catch(e){this.gateway.isCurrent(n)&&this.catalogDetail===t&&(this.catalogDetail={...t,error:g(e)})}}async installCatalogEntry(e){let t=this.gateway.capture(),n=`install:${e}`;if(!t||!this.canMutate()||this.busy[n])return;let r=++this.installRequestGeneration;this.setBusy(n,`install`);try{let i=this.catalogDetail?.result?.plugin.id===e?this.catalogDetail.result:await re(t.client,e);if(!this.gateway.isCurrent(t)||r!==this.installRequestGeneration)return;let a=ar(i);this.setBusy(n,null),a?await this.consentController.install(a,n):this.setMessage(n,{kind:`warning`,text:d(`pluginsPage.installAvailabilityChanged`)})}catch(e){this.gateway.isCurrent(t)&&r===this.installRequestGeneration&&this.setMessage(n,{kind:`error`,text:g(e)})}finally{this.gateway.isCurrent(t)&&this.setBusy(n,null)}}closeCatalogDetail(){this.catalogDetail=null,this.detail=null,this.context.navigate(`plugins`,{pathname:k(`plugins`,this.context.basePath)})}async uninstall(e,t){let n=this.result?.plugins.find(t=>t.id===e)?.name??e;await this.consentController.runMutation(t,t=>oe(t,e),async(t,n,r,i,a)=>{a()&&(this.pageNotice=Yn(t,n),this.activeRoutePluginId===e&&(this.detail=null,this.context.replace(`plugin-settings`,{pathname:k(`plugin-settings`,this.context.basePath)}))),await this.refreshCatalog(r)},{action:`uninstall`,confirm:()=>Rn(n)})}render(){let e=this.accessBlockedReason(this.result?.mutationAllowed);return yi({help:this.help,context:this.context,routeData:this.routeData,surface:this.surface,connected:this.gateway.connected,loading:this.loading,result:this.result,error:this.error,query:this.query,settingsTab:this.settingsTab,busy:this.busy,messages:this.messages,detail:this.detail,pageNotice:this.pageNotice,iconUrls:this.iconUrls,catalogIconUrls:this.catalogIconUrls,catalogDetail:this.catalogDetail,installedDetailTab:this.installedDetailTab,canMutate:this.canMutate(),mutationBlockedReason:e,canEditConfig:this.canEditConfig(),discovery:this.discovery,consentController:this.consentController,renderCredential:this.settings.render,skillPreview:this.skillPreview,actions:{selectHubTab:e=>this.selectHubTab(e),closeCatalogDetail:()=>this.closeCatalogDetail(),retryCatalogDetail:()=>void this.showCatalogDetail(this.catalogDetail?.id??null),installCatalogEntry:e=>void this.installCatalogEntry(e),openSkill:e=>void this.skillPreview.open(e),openTool:e=>this.skillPreview.openTool(this.detail?.tools?.find(t=>t.name===e)??{name:e}),setQuery:e=>{this.query=e},refreshCatalog:()=>void this.refreshCatalog(),openPluginSettings:(e,t)=>{this.context.navigate(`plugin-settings`,{pathname:e?Se(e,this.context.basePath):k(`plugin-settings`,this.context.basePath),search:t&&e?`?from=plugins`:``})},handlePluginIconError:e=>this.icons.handleInstalledError(e),updateEnabled:(e,t,n)=>void this.consentController.mutateInstalledPlugin(e,t?`enable`:`disable`,n),uninstall:(e,t)=>void this.uninstall(e,t),patchConfig:(e,t)=>this.settings.patch(e,t),removeConfig:e=>this.settings.patch(e,void 0),reloadConfig:()=>{this.pluginConfigEditPending=!1,this.context.runtimeConfig.discardDraft({reloadOnly:!0})},retryConfigRead:()=>{this.context.runtimeConfig.refresh(),this.context.runtimeConfig.refreshSchema()},retryConfigWrite:()=>{this.context.runtimeConfig.retry()},closeSettingsDetail:e=>{this.detail=null,this.installedDetailTab=`readme`,this.context.navigate(e,{pathname:k(e,this.context.basePath)})},retrySettingsDetail:e=>void this.showDetails(e),selectInstalledDetailTab:e=>{this.installedDetailTab=e,this.context.navigate(this.surface===`discovery`?`plugins`:`plugin-settings`,En(this.routeData?.location,e===`configuration`))},selectSettingsTab:e=>{this.settingsTab=e,this.context.replace(`plugin-settings`,{pathname:k(`plugin-settings`,this.context.basePath),search:e===`advanced`?`?tab=advanced`:``})}}})}},u([l({context:Ce,subscribe:!0})],$.prototype,`context`,void 0),u([E({attribute:!1})],$.prototype,`routeData`,void 0),u([E({attribute:!1})],$.prototype,`surface`,void 0),u([w()],$.prototype,`result`,void 0),u([w()],$.prototype,`error`,void 0),u([w()],$.prototype,`query`,void 0),u([w()],$.prototype,`settingsTab`,void 0),u([w()],$.prototype,`busy`,void 0),u([w()],$.prototype,`messages`,void 0),u([w()],$.prototype,`detail`,void 0),u([w()],$.prototype,`iconUrls`,void 0),u([w()],$.prototype,`catalogIconUrls`,void 0),u([w()],$.prototype,`pageNotice`,void 0),u([w()],$.prototype,`catalogDetail`,void 0),u([w()],$.prototype,`installedDetailTab`,void 0),customElements.get(`testclaw-plugins-page`)||customElements.define(`testclaw-plugins-page`,$)})))()}xi();
//# sourceMappingURL=plugins-page-Cmqb1cg-.js.map