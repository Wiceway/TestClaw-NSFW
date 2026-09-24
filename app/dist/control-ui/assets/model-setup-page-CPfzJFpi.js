import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ht as t,Jr as n,qr as r,ti as i}from"./control-ui-foundation-CGMdhB5v.js";import{$l as a,Bl as o,Bs as s,Hl as c,Jl as l,Qc as u,Rs as ee,_n as te,ac as ne,ic as re,ll as ie,ln as ae,ou as d,zs as oe}from"./control-ui-core-S9jKXqB5.js";import{$ as f,A as se,D as p,J as ce,K as le,N as ue,O as de,P as fe,X as m,Y as h,Z as pe,_ as me,ct as g,et as he,j as ge,k as _e,m as ve,nt as ye,q as be,ut as _}from"./lit-runtime-DWoPVI38.js";import{Cr as v,Di as xe,Fi as y,Fr as Se,Ii as b,Oi as Ce,Or as we,Qa as Te,do as Ee,fo as De}from"./control-ui-core-G2U4O6rB.js";import{c as Oe,u as x}from"./gateway-runtime-BV4hxqU_.js";import{$ as ke,Mn as Ae,Nn as je,at as Me,et as Ne,nt as Pe,tt as Fe}from"./control-ui-boot-shared-ooxiG3qa.js";import{H as S,Sn as Ie,U as C,V as Le,_n as w,dn as Re,gn as ze,ln as Be,vn as Ve,xn as He,yn as Ue}from"./control-ui-boot-shared-C3bL_9oq.js";import{Aa as T,Da as E,Ea as D,Ia as We,La as Ge,Oa as O,_t as Ke,ht as qe,ja as Je,ka as k}from"./control-ui-boot-shared-CCYBAAP9.js";import{G as Ye,U as Xe,W as Ze,Z as Qe}from"./control-ui-boot-shared-VDjYq2Zh.js";import{n as $e,t as et}from"./settings-workspace-DJAhLnkQ.js";import{n as tt,t as nt}from"./model-picker-B5f1dDe1.js";import{a as rt,c as it,d as at,f as A,g as ot,h as st,i as ct,l as lt,m as ut,o as dt,p as ft,s as pt,u as j}from"./wizard-login-controller-mVdQTtmr.js";import{c as M,i as mt,l as N,n as ht,o as gt,r as _t,s as vt}from"./view-status-DZFvBRaB.js";var P,yt;function bt(){return(bt=e((()=>{Ie(),P=class{oHash;iHash;blockLen;outputLen;canXOF=!1;finished=!1;destroyed=!1;constructor(e,t){if(Ve(e),ze(t,void 0,`key`),this.iHash=e.create(),typeof this.iHash.update!=`function`)throw Error(`expected Hash instance`);this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let n=this.blockLen,r=new Uint8Array(n);r.set(t.length>n?e.create().update(t).digest():t);for(let e=0;e<r.length;e++)r[e]^=54;this.iHash.update(r),this.oHash=e.create();for(let e=0;e<r.length;e++)r[e]^=106;this.oHash.update(r),He(r)}update(e){return w(this),this.iHash.update(e),this}digestInto(e){w(this),Ue(e,this),this.finished=!0;let t=e.subarray(0,this.outputLen);this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){let e=new Uint8Array(this.oHash.outputLen);return this.digestInto(e),e}_cloneInto(e){e||=Object.create(Object.getPrototypeOf(this),{});let{oHash:t,iHash:n,finished:r,destroyed:i,blockLen:a,outputLen:o,canXOF:s}=this;return e=e,e.finished=r,e.destroyed=i,e.blockLen=a,e.outputLen=o,e.canXOF=s,e.oHash=t._cloneInto(e.oHash),e.iHash=n._cloneInto(e.iHash),e}clone(){return this._cloneInto()}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},yt=(()=>{let e=((e,t,n)=>new P(e,t).update(n).digest());return e.create=(e,t)=>new P(e,t),e})()})))()}function xt(e){let t=t=>{t.key===R&&t.newValue===null&&t.oldValue&&e(t.oldValue)};return z.add(e),window.addEventListener(`storage`,t),()=>{z.delete(e),window.removeEventListener(`storage`,t)}}function St(e,t,n){try{let r=JSON.parse(n.getItem(Et)??`null`);if(r?.version!==1||typeof r.privateKey!=`string`||!r.privateKey)return null;let i=e.gateway.connection,a=i.token||i.password||i.bootstrapToken,o=a?``:e.gateway.snapshot.hello?.auth?.deviceToken;if(!a&&!o)return null;let s=[t.gatewayUrl,t.agentId,t.modelRef??``,t.kind,String(t.deadlineMs),i.token,i.password,i.bootstrapToken,i.bootstrapProfile??``,o??``,...t.modelTarget?[t.modelTarget]:[]],c=new TextEncoder,l=s.map(e=>`${c.encode(e).length}:${e}`).join(`|`);return Array.from(yt(Re,c.encode(r.privateKey),c.encode(l))).map(e=>e.toString(16).padStart(2,`0`)).join(``)}catch{return null}}function F(e,t){try{let n=e.getItem(R);if((t===void 0||t&&n===JSON.stringify(t))&&(e.removeItem(R),n))for(let e of z)e(n)}catch{}}function I(e,n){let r=d();if(!r||e.gateway.snapshot.phase!==`connected`)return null;try{let i=r.getItem(R);if(!i||n&&i!==JSON.stringify(n))return null;let a=JSON.parse(i);if(a?.version!==1||typeof a.gatewayUrl!=`string`||typeof a.agentId!=`string`||a.modelRef!==null&&typeof a.modelRef!=`string`||a.modelTarget!==void 0&&a.modelTarget!==`utility`||typeof a.kind!=`string`||typeof a.deadlineMs!=`number`||!Number.isFinite(a.deadlineMs)||a.deadlineMs<=Date.now()||typeof a.owner!=`string`||a.gatewayUrl!==t(e.gateway.connection.gatewayUrl)||a.agentId!==(e.agentSelection.state.selectedId??``))return F(r),null;let{owner:o,...s}=a;return St(e,s,r)===o?a:(F(r),null)}catch{return F(r),null}}function Ct(e){return Date.now()+at(e)+Dt}function wt(e,n){let r=d();if(!r||e.gateway.snapshot.phase!==`connected`)return null;try{let i={version:1,gatewayUrl:t(e.gateway.connection.gatewayUrl),agentId:e.agentSelection.state.selectedId??``,modelRef:n.modelRef??null,...n.modelTarget?{modelTarget:n.modelTarget}:{},kind:n.kind,deadlineMs:n.deadlineMs??Ct(n.kind)},a=St(e,i,r);if(!a)return null;let o={...i,owner:a};return r.setItem(R,JSON.stringify(o)),o}catch{return null}}function L(e){let t=d();t&&F(t,e)}function Tt(e,t,n,r,i,a){let{context:o}=e,s=o.gateway.snapshot;!i()&&s.phase===`connected`&&s.client===t.client&&s.hello===t.hello&&o.gateway.connectionRevision===n&&(o.agentSelection.state.selectedId?.trim()||null)===r&&e.isStillDefaultLanding()&&I(o)!==null&&e.redirect(),a()}var R,Et,Dt,z;function B(){return(B=e((()=>{bt(),Be(),A(),R=`testclaw.modelSetup.pendingActivation.v1`,Et=`testclaw-device-identity-v1`,Dt=5e3,z=new Set})))()}function V(e){return ee(e,a(`modelSetup.errors.requestFailed`))}async function Ot(e,t){try{return{client:e,value:await t()}}catch(t){return{client:e,error:t}}}function H(){return(H=e((()=>{l(),s()})))()}function U(e,t){return t?e.agentSelection:e.settingsAgentSelection}function kt(e,t,n=null){let r=e.gateway.snapshot,i=U(e,t);return{client:r.client,hello:r.hello,agentId:i.state.selectedId,selectionIntentRevision:t?0:i.intentRevision,selectionPending:!t&&i.state.selectedId===null&&e.agents.state.agentsList===null,connected:r.phase===`connected`,firstRun:t,connectionRevision:e.gateway.connectionRevision,recoveryScope:r.phase===`connected`?r.hello?.auth?.recoveryScope??null:n}}function At(e,t){return e&&t.selectionPending&&t.selectionIntentRevision===e.selectionIntentRevision&&t.firstRun===e.firstRun&&t.connectionRevision===e.connectionRevision&&(!t.connected||t.recoveryScope&&t.recoveryScope===e.recoveryScope&&v(t.hello?.auth??null))?{kind:e.selectionPending?`unchanged`:`pending`,connection:{...e,selectionPending:!0}}:{kind:e&&t.client===e.client&&t.hello===e.hello&&t.agentId===e.agentId&&t.connected===e.connected&&t.firstRun===e.firstRun&&t.connectionRevision===e.connectionRevision&&t.recoveryScope===e.recoveryScope&&t.selectionIntentRevision===e.selectionIntentRevision&&t.selectionPending===e.selectionPending?`unchanged`:`changed`,connection:t}}var jt;function Mt(){return(Mt=e((()=>{we(),l(),te(),B(),H(),A(),jt=class{constructor(e){this.host=e,this.generation=0,this.started=!1,this.readyConnection=null,this.pending=null}subscribe(e){return xt(t=>{let n=this.pending;n?.receipt&&JSON.stringify(n.receipt)===t&&(this.pending=null,n.outcome===`verified`&&this.host.setActivationState({phase:`idle`}),this.host.setVerifyState({phase:`idle`}),e())})}setReadyConnection(e){this.readyConnection=e}routeChanged(){let e=this.pending?.receipt??null;this.reset(),this.readyConnection=null,this.pending=null,this.host.routeData()?.firstRun===!1&&L(e)}connectionChanged(e){if(this.reset(),this.readyConnection=null,this.pending&&(!this.pending.owner.recoveryScope||e.agentId!==this.pending.owner.connection.agentId||this.host.context().gateway.connectionRevision!==this.pending.owner.connectionRevision||this.host.context().gateway.snapshot.phase===`connected`&&(e.hello?.auth?.recoveryScope??null)!==this.pending.owner.recoveryScope)){let e=this.pending.receipt;this.pending=null,L(e)}}reconnectActivation(e){let t=this.pending;if(!t)return;let n=this.host.context();t.owner.recoveryScope&&t.owner.connectionRevision===n.gateway.connectionRevision&&t.owner.recoveryScope===(e.hello?.auth?.recoveryScope??null)&&t.owner.connection.agentId===e.agentId&&t.owner.firstRun===this.host.routeData()?.firstRun&&(t.owner=this.owner(t.owner.firstRun))}retryDetection(){if(this.host.actionsDisabled())return!1;if(this.pending&&Date.now()<this.pending.deadlineMs)return this.host.setRefreshWarning(a(`modelSetup.recovery.wait`,{time:ae(this.pending.deadlineMs)})),!0;if(this.host.routeData()?.firstRun){let e=this.host.pageState(),t=this.pending&&e.phase===`ready`&&this.configuredActivationModel(e.result);this.pending=null,L(),this.host.setRefreshWarning(null),this.reset(),this.started=!!t}return!0}dispose(){this.reset(),this.readyConnection=null,this.pending=null}visiblePageState(e){let t=this.host.pageState();return this.host.routeData()?.firstRun&&t.phase===`ready`&&t.result.setupComplete&&t.result.configuredModel&&!e?{...t,result:{...t.result,setupComplete:!1}}:t}start(){let e=this.host.routeData(),t=this.host.context(),n=t.gateway.snapshot,r=this.host.pageState(),i=this.readyConnection;if(!e?.firstRun||this.started||r.phase!==`ready`||!i||i.client!==n.client||i.hello!==n.hello||i.agentId!==t.agentSelection.state.selectedId||this.host.actionsDisabled()||!this.host.canUseSetup(n.client))return;let o=I(t);this.pending?.receipt&&o?.owner!==this.pending.receipt.owner&&(this.pending=null);let s=o??this.pending;if(s&&(this.pending={owner:this.owner(e.firstRun),modelRef:s.modelRef,...s.modelTarget?{modelTarget:s.modelTarget}:{},kind:s.kind,deadlineMs:s.deadlineMs,receipt:o,outcome:`pending`}),!this.pending){this.started=!0;return}let c=this.configuredActivationModel(r.result);if(this.pending&&(!c||!this.pending.modelRef)){this.started=!0,this.showUnresolved();return}if(c&&!this.host.canVerify(n.client)){this.started=!0,this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${a(`modelSetup.access.gatewayTooOld`)}. ${a(`updates.confirm.action`)}. ${a(`desktop.reconnect`)}.`});return}this.started=!0,this.run(this.owner(e.firstRun),r.result)}beginActivation(e){let t=this.host.routeData();if(!t?.firstRun)return null;let n=this.owner(t.firstRun),r=wt(this.host.context(),e);return this.pending={owner:n,kind:e.kind,modelRef:e.modelRef??null,...e.modelTarget?{modelTarget:e.modelTarget}:{},receipt:r,outcome:`pending`,deadlineMs:r?.deadlineMs??Ct(e.kind)},this.started=!0,this.pending}recordActivation(e,t){if(!e)return;if(t.status===`cancelled`||t.status===`not-admitted`||t.status===`error`&&t.activationRejection?.disposition===`rejected-before-promotion`){this.ownsActivation(e)&&(e.outcome=`rejected`),L(e.receipt),this.pending===e&&(this.pending=null);return}let n=t.status===`done`?t.modelActivation?.modelRef:void 0;n&&this.pending===e&&this.ownsActivation(e)&&(e.modelRef=n,e.modelTarget=t.status===`done`?t.modelActivation?.modelTarget:void 0,e.outcome=`verified`,e.receipt=wt(this.host.context(),e))}finishActivation(e,t,n){this.pending&&this.ownsActivation()&&e.ok&&e.modelRef&&(e.gatewayRestartRequired?(this.host.setActivationState({phase:`testing`,targetId:t}),this.host.setRefreshWarning(n??a(`updates.dialog.restarting`))):n||this.completeNavigation())}get unresolved(){return this.pending!==null}get canUseCurrentModel(){let e=this.host.pageState();return this.pending!==null&&e.phase===`ready`&&!!this.configuredActivationModel(e.result)}async useCurrentModel(){let e=this.host.pageState(),t=this.pending;if(!t||e.phase!==`ready`||!this.configuredActivationModel(e.result)||this.host.actionsDisabled())return;let n=this.configuredActivationModel(e.result),r=this.owner(t.owner.firstRun),i=await this.verify();!this.owns(r)||this.pending!==t||!i||`error`in i||(i.value.ok&&i.value.modelRef===n&&i.value.modelTarget===t.modelTarget?this.completeNavigation():i.value.ok&&this.showUnresolved())}owner(e){let t=kt(this.host.context(),e);return{generation:this.generation,firstRun:e,connectionRevision:t.connectionRevision,recoveryScope:t.recoveryScope,connection:t}}clearPending(){this.pending=null,L()}ownsActivation(e=this.pending){return e?this.owns(e.owner)?e.outcome===`rejected`?this.pending===null:this.pending===e&&(!e.receipt||I(this.host.context(),e.receipt)!==null)&&Date.now()<e.deadlineMs:!1:!this.host.routeData()?.firstRun}async verify(){let e=this.host.routeData();if(!e)return;let t=this.owner(e.firstRun),n=this.pending,r=await this.host.verify(n?.modelTarget);if(this.owns(t)&&r){if(this.pending!==n||n&&!this.ownsActivation(n)){this.host.setVerifyState({phase:`idle`});return}return this.host.setVerifyState(`error`in r?{phase:`failed`,status:`unknown`,error:V(r.error)}:ut(r.value)),r}}continueSetup(e){if(this.pending)this.pending.outcome===`verified`&&this.ownsActivation()&&this.completeNavigation();else{let t=this.host.pageState(),n=this.host.activationState();e===`utility`||n.phase===`success`&&n.modelTarget===`utility`||t.phase===`ready`&&t.result.setupModel?this.host.context().navigate(`custodian`,t.phase===`ready`&&!t.result.configuredModel?{search:`?onboarding=1`}:{}):this.host.context().navigate(`chat`)}}completeNavigation(){this.clearPending(),this.host.setRefreshWarning(null),this.host.context().navigate(`custodian`,{search:`?onboarding=1`})}showUnresolved(){this.host.setRefreshWarning(null),this.host.setVerifyState({phase:`failed`,status:`unknown`,error:`${a(`modelSetup.errors.activationFailed`)} ${this.pending?.modelRef??``}`.trim()})}reset(){this.generation+=1,this.started=!1}owns(e){let t=this.host.context(),n=t.gateway.snapshot;return e.generation===this.generation&&e.connectionRevision===t.gateway.connectionRevision&&e.recoveryScope===(n.hello?.auth?.recoveryScope??null)&&e.firstRun===this.host.routeData()?.firstRun&&n.phase===`connected`&&n.client===e.connection.client&&n.hello===e.connection.hello&&U(t,e.firstRun).state.selectedId===e.connection.agentId}async run(e,t){let n=this.configuredActivationModel(t);if(n){if(this.pending&&n!==this.pending.modelRef){this.showUnresolved();return}let t=await this.verify();if(!this.owns(e)||!t||`error`in t)return;t.value.ok&&this.finishVerified(t.value.modelRef,t.value.modelTarget)}}configuredActivationModel(e){return this.pending?.modelTarget===`utility`?e.utilityModel??e.setupModel:e.setupComplete?e.configuredModel:void 0}finishVerified(e,t){this.pending?this.pending.modelRef===e&&this.pending.modelTarget===t?this.completeNavigation():this.showUnresolved():this.host.context().navigate(`chat`)}}})))()}function Nt(e){return e.brandId&&D(e.brandId)?e.brandId:null}function W(e,t,n=``){let r=Nt(t);if(r)return T(r,{className:`model-setup__icon ${n}`.trim()});let i=t.icon?e.iconUrls[t.icon]:void 0;return!t.icon||!i?Je(t.label,{className:`model-setup__icon ${n}`.trim()}):f`<img
    class=${`model-setup__icon ${n}`.trim()}
    src=${i}
    alt=${t.label}
    width="24"
    height="24"
    @error=${()=>e.onIconError(t.icon)}
  />`}var Pt;function G(){return(G=e((()=>{h(),E(),Qe(),Ze(),Pt=class{constructor(e,t,n){this.getContext=e,this.getPageState=t,this.onChange=n,this.loader=new Xe({getFetchContext:()=>{let e=this.getContext();return{resourceBasePath:e.resourceBasePath,gatewayUrl:e.gateway.connection.gatewayUrl,auth:{hello:e.gateway.snapshot.hello,settings:{token:e.gateway.connection.token},password:e.gateway.connection.password}}},isConnected:e=>this.getContext().gateway.snapshot.phase===`connected`&&this.currentIconUrls().has(e),fetchIcon:(e,t,n)=>Ye({iconUrl:e,...t,signal:n}),timeoutError:()=>new DOMException(`catalog icon fetch timed out`,`TimeoutError`),onUrlsChange:e=>this.onChange(e)})}reconcile(){let e=this.currentIconUrls();this.loader.reconcileKeys(e);for(let t of e)this.loader.load(t)}invalidate(e){this.loader.handleError(e)}reset(){this.loader.reset()}currentIconUrls(){let e=this.getPageState();if(e.phase!==`ready`)return new Set;let t=e.result;return new Set([...t.candidates,...t.manualProviders,...t.authOptions??[],...t.prepareOptions??[],...t.recommendedInstalls??[]].flatMap(e=>e.icon&&!Nt(e)?[e.icon]:[]))}}})))()}function Ft(e){return f`
    <section class="settings-section" data-native-model-setup>
      <div class="settings-section__header"><h2>${a(`modelSetup.nativeModels.title`)}</h2></div>
      <p class="muted">${a(`modelSetup.nativeModels.body`)}</p>
      ${e}
    </section>
  `}function It(){return Ft(f`
    <div class="model-picker"><span class="picker-select__trigger skeleton"></span></div>
    <span class="btn skeleton">${`\xA0`}</span>
  `)}var Lt;function K(){return(K=e((()=>{h(),nt(),E(),l(),je(),ke(),u(),H(),Lt=class{constructor(e,t){this.host=e,this.options=t,this.nativeModels=[],this.nativeModel=``,this.nativeModelError=null,this.nativeCatalogError=null,this.saving=!1,this.generation=0,this.nativeModelsAbort=null,this.nativeModelsUnsubscribe=null,this.nativeModelsStatus=`idle`}get count(){return this.nativeModels.length}reset(){this.generation+=1,this.nativeModels=[],this.nativeModel=``,this.nativeModelError=null,this.nativeCatalogError=null,this.saving=!1,this.nativeModelsAbort?.abort(),this.nativeModelsAbort=null,this.nativeModelsUnsubscribe?.(),this.nativeModelsUnsubscribe=null,this.nativeModelsStatus=`idle`}async useNativeModel(){let e=this.options.getConnection(),t=this.generation,n=()=>this.generation===t&&this.options.getConnection()===e,r=this.options.getContext(),i=r.gateway.snapshot.client,a=e?.agentId??ie(r.gateway.snapshot)?.defaultAgentId,o=this.nativeModels.find(e=>`${e.provider}/${e.id}`===this.nativeModel);if(!this.options.canUseSetup(i)||!a||o?.available!==!0||this.saving||this.options.blocked())return;this.saving=!0,this.host.requestUpdate(),this.nativeModelError=null;let s=`${o.provider}/${o.id}`;try{let e=await r.runtimeConfig.runExternalMutation(e=>e.request(`agents.update`,{agentId:a,model:s,agentRuntime:o.agentRuntime?.id}),{canDispatch:()=>n()&&this.options.canUseSetup(i)});if(!n())return;if(!e.ok){this.nativeModelError=e.error;return}if(!e.refresh.ok){this.nativeModelError=e.refresh.error;return}await r.agents.refreshList(),n()&&this.options.onSelected()}catch(e){n()&&(this.nativeModelError=V(e))}finally{n()&&(this.saving=!1,this.host.requestUpdate())}}applyNativeCatalog(e){this.nativeModels=e.models.filter(e=>e.agentRuntime&&e.agentRuntime.id!==`testclaw`),this.nativeModelsStatus=e.pendingProviders?.length?`loading`:`ready`,this.nativeCatalogError=Fe(e),this.nativeModels.some(e=>`${e.provider}/${e.id}`===this.nativeModel)||(this.nativeModel=``)}async loadNativeModels(e=!0){let t=this.options.getConnection(),n=this.options.getContext(),r=n.gateway.snapshot.client;if(!r||!this.options.canUseSetup(r))return;let i={view:`all`,agentId:t?.agentId??void 0},a=Pe(r,i,{allowStale:!0});a&&this.applyNativeCatalog(a),this.nativeModelsUnsubscribe??=Me(n.gateway,()=>void this.loadNativeModels(!1),i),this.nativeModelsAbort?.abort();let o=new AbortController;this.nativeModelsAbort=o,e&&(this.nativeCatalogError=null),this.nativeModelsStatus=`loading`,this.host.requestUpdate();try{let n=await Ne(r,{...i,refresh:e,signal:o.signal});if(this.options.getConnection()!==t||o.signal.aborted)return;this.applyNativeCatalog(n)}catch(e){this.options.getConnection()===t&&!o.signal.aborted&&(this.nativeModelsStatus=`ready`,this.nativeCatalogError=V(e))}finally{this.nativeModelsAbort===o&&(this.nativeModelsAbort=null,this.host.requestUpdate())}}render(){let e=this.nativeModels,t=e.find(e=>`${e.provider}/${e.id}`===this.nativeModel);return Ft(f`
      ${this.nativeModelsStatus===`loading`?f`<p role="status">${a(`modelSetup.nativeModels.loading`)}</p>`:m}
      ${this.nativeModelsStatus===`ready`&&e.length===0&&!this.nativeCatalogError?f`<p role="status">${a(`modelSetup.nativeModels.empty`)}</p>`:m}
      ${tt({label:a(`modelSetup.nativeModels.choose`),value:this.nativeModel,options:e.map(e=>({value:`${e.provider}/${e.id}`,label:e.name,provider:e.provider,detail:e.available===!0?O(e.provider):Ae(e.unavailableReason)??(this.nativeModelsStatus===`loading`&&e.available===void 0?a(`modelSetup.nativeModels.loading`):e.available===!1?a(`chat.modelControls.modelsUnavailable`):a(`modelSetup.nativeModels.unconfirmed`)),disabled:e.available!==!0})),disabled:this.options.blocked()||this.saving,onChange:e=>{this.nativeModel=e,this.host.requestUpdate()},onOpen:()=>{this.nativeModelsAbort||this.loadNativeModels(this.nativeModelsStatus===`idle`)}})}
      <button
        class="btn primary"
        ?disabled=${this.options.blocked()||this.saving||t?.available!==!0}
        @click=${()=>void this.useNativeModel()}
      >
        ${a(this.saving?`modelSetup.nativeModels.saving`:`modelSetup.nativeModels.use`)}
      </button>
      ${this.nativeModelError?f`<div class="callout danger" role="alert">${this.nativeModelError}</div>`:m}
      ${this.nativeCatalogError?f`
              <div class="callout danger" role="alert">
                ${this.nativeCatalogError}
                <button
                  class="btn btn--sm"
                  type="button"
                  ?disabled=${this.options.blocked()||this.saving||this.nativeModelsAbort!==null}
                  @click=${()=>void this.loadNativeModels(!0)}
                >
                  ${a(`common.retry`)}
                </button>
              </div>
            `:m}
    `)}}})))()}function q(e){return`provider-auto:${encodeURIComponent(e)}`}function Rt(e,t){return{kind:q(e.id),modelRef:t,...e.modelTarget?{modelTarget:e.modelTarget}:{}}}function zt(e){let t=[{id:`ollama`,brandId:`ollama`,label:a(`modelSetup.prepare.ollamaLabel`),hint:a(`modelSetup.prepare.ollamaHint`)},{id:`llama-cpp`,brandId:`llama-cpp`,label:a(`modelSetup.prepare.llamaCppLabel`)}];return(e.prepareOptions??t).filter(t=>!e.candidates.some(e=>e.credentials!==!1&&(e.kind===q(t.id)||e.modelRef.startsWith(`${t.brandId??t.id}/`))))}function Bt(e,t){return e.candidates.find(e=>e.kind===q(t)&&e.credentials!==!1)}function J(){return(J=e((()=>{l()})))()}function Vt(e,t,n){let r=e.find(e=>e.id===t),i=n.trim();return r&&i?{kind:`api-key`,authChoice:r.id,apiKey:i,...r.modelTarget?{modelTarget:r.modelTarget}:{}}:null}function Ht(e){let t=e.currentTarget;if(t.open){if(e.key===`Tab`){e.preventDefault(),e.stopPropagation();let n=e.shiftKey?t.querySelector(`[slot="trigger"]`):t.closest(`.model-setup__manual`)?.querySelector(`input[type="password"]`);t.addEventListener(`wa-after-hide`,()=>n?.focus({preventScroll:!0}),{once:!0}),t.open=!1;return}e.key===`Escape`&&(e.preventDefault(),t.addEventListener(`wa-after-hide`,()=>t.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}))}}function Ut(e,t,n){let r=e.detail.item,i=e.currentTarget,a=r.value??r.getAttribute(`value`);if(a){if(a!==t){i.addEventListener(`wa-after-hide`,()=>i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),{once:!0}),n(a);return}e.preventDefault(),r.checked=!0,i.querySelector(`[slot="trigger"]`)?.focus({preventScroll:!0}),i.open=!1}}function Y(e){return e.groupLabel?.trim()||e.label}function Wt(e){let t=e.label.trim();return t===Y(e)?void 0:t}function Gt(e,t,n){let r=n?Wt(n):void 0,i=n?[Y(n),r].filter(Boolean).join(`, `):a(`modelSetup.manual.selectProvider`);return f`
    <wa-dropdown
      class="model-setup-provider-select"
      placement="bottom-start"
      aria-label=${a(`modelSetup.manual.provider`)}
      @wa-select=${t=>Ut(t,e.manualProviderId,e.onManualProviderChange)}
      @keydown=${Ht}
    >
      <button
        slot="trigger"
        type="button"
        class="model-setup-provider-select__trigger"
        aria-label=${`${a(`modelSetup.manual.provider`)}: ${i}`}
        ?disabled=${e.actionsDisabled||t.manualProviders.length===0}
      >
        ${n?W(e,n,`model-setup__icon--picker`):f`<span class="model-setup-provider-select__placeholder-icon" aria-hidden="true">
                ${y.key}
              </span>`}
        <span class="model-setup-provider-select__copy">
          <strong>
            ${n?Y(n):a(`modelSetup.manual.selectProvider`)}
          </strong>
          ${n?r?f`<span>${r}</span>`:m:f`<span>${a(`modelSetup.manual.selectProviderHint`)}</span>`}
        </span>
        <span class="model-setup-provider-select__chevron" aria-hidden="true">
          ${y.chevronDown}
        </span>
      </button>
      ${t.manualProviders.toSorted((e,t)=>Y(e).localeCompare(Y(t))).map(t=>{let n=t.id===e.manualProviderId,r=Wt(t),i=[Y(t),r,t.hint].filter(Boolean).join(`, `);return f`
            <wa-dropdown-item
              class="model-setup-provider-select__option"
              data-manual-provider=${t.id}
              ?data-selected=${n}
              aria-label=${i}
              .value=${t.id}
              type="checkbox"
              .checked=${n}
              ?disabled=${e.actionsDisabled}
              ?autofocus=${n&&!e.actionsDisabled}
              ${me(e=>Ge(e,n))}
            >
              <span slot="icon">
                ${W(e,t,`model-setup__icon--picker`)}
              </span>
              <span class="model-setup-provider-select__copy">
                <strong>${Y(t)}</strong>
                ${r?f`<span>${r}</span>`:m}
                ${t.hint?f`<small>${t.hint}</small>`:m}
              </span>
            </wa-dropdown-item>
          `})}
    </wa-dropdown>
  `}function X(){return(X=e((()=>{h(),ve(),b(),We(),l(),G()})))()}function Kt(e,t){return new S(e,{autoRun:!1,args:()=>[null,null,null],task:async([e,n,r],{signal:i})=>{if(!e||!r)return C;let a=t.getHello();return{...await Ot(e,()=>qt(e,n??void 0,i)),agentId:n,hello:a,token:r}},onComplete:t.onComplete})}function qt(e,t,n){return e.request(`testclaw.setup.detect`,t?{agentId:t}:{},{timeoutMs:it,...n?{signal:n}:{}})}function Jt(e,t,n,r){return e.request(`testclaw.setup.verify`,{...t?{agentId:t}:{},...r?{modelTarget:r}:{}},{timeoutMs:lt,...n?{signal:n}:{}})}function Yt(e){return new S(e,{autoRun:!1,args:()=>[null,null,void 0],task:async([e,t,n],{signal:r})=>e?Ot(e,()=>Jt(e,t??void 0,r,n)):C})}function Xt(){return(Xt=e((()=>{Le(),H(),A()})))()}var Z,Zt;function Qt(){return(Qt=e((()=>{he(),ce(),_e(),Z=e=>de(e)?e._$litType$.h:e.strings,Zt=le(class extends be{constructor(e){super(e),this.et=new WeakMap}render(e){return[e]}update(e,[t]){let n=ge(this.it)?Z(this.it):null,r=ge(t)?Z(t):null;if(n!==null&&(r===null||n!==r)){let t=p(e).pop(),r=this.et.get(n);if(r===void 0){let e=document.createDocumentFragment();r=pe(m,e),r.setConnected(!1),this.et.set(n,r)}ue(r,[t]),fe(r,void 0,t)}if(r!==null){if(n===null||n!==r){let t=this.et.get(r);if(t!==void 0){let n=p(t).pop();se(e),fe(e,void 0,n),ue(e,[n])}}this.it=t}else this.it=void 0;return this.render(t)}})})))()}function $t(){return($t=e((()=>{Qt()})))()}function en(e){if(e.modelTarget===`utility`)return a(`modelSetup.utility.role`);let t=e.kind.startsWith(`saved-auth:`)?`detected`:e.recommended?`recommended`:e.credentials===void 0?`detected`:e.credentials?`credentialsReady`:`signInNeeded`;return a(`modelSetup.candidates.${t}`)}function tn(e,t){let n=t.candidates.filter(e=>!(e.modelTarget===`utility`&&!e.kind.startsWith(`saved-auth:`)&&e.modelRef===(t.utilityModel??t.setupModel))&&(!t.configuredModel||e.kind!==`existing-model`&&(e.kind.startsWith(`saved-auth:`)||e.modelRef!==t.configuredModel)));return n.length===0?m:f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${a(`modelSetup.candidates.title`)}</h2>
      </div>
      <div class="model-setup__rows">
        ${n.toSorted((e,t)=>e.label.localeCompare(t.label)).map(n=>{let r=e.activation.phase===`testing`&&e.activation.targetId===j(n.kind,n.modelRef),i=e.activation.phase===`failure`&&e.activation.targetId===j(n.kind,n.modelRef)?e.activation:null;return f`
              <div class="model-setup__row" data-candidate-kind=${n.kind}>
                <div class="model-setup__row-main">
                  <div class="model-setup__row-title">
                    ${W(e,n)}
                    <strong>${n.label}</strong>
                    <span class="model-setup__chip">${en(n)}</span>
                  </div>
                  <div class="muted">
                    ${n.modelRef} · ${oe(n.detail)}
                  </div>
                  ${n.modelTarget===`utility`?f`<div class="muted">${a(`modelSetup.utility.hint`)}</div>`:m}
                </div>
                <div class="model-setup__row-actions">
                  <button
                    type="button"
                    class=${`btn ${i?``:`primary`}`}
                    ?disabled=${e.actionsDisabled||e.detecting}
                    @click=${()=>e.onActivateCandidate(n)}
                  >
                    <span>
                      ${r?a(`modelSetup.candidates.testingButton`):i?a(`modelSetup.candidates.retry`):n.modelTarget===`utility`?a(t.configuredModel?`modelSetup.utility.useUtility`:`modelSetup.utility.useSetup`):a(e.embedded?`modelSetup.discovery.useForAgent`:`modelSetup.candidates.testAndUse`)}
                    </span>
                  </button>
                </div>
              </div>
            `})}
      </div>
    </section>
  `}function nn(){return(nn=e((()=>{h(),l(),M(),s(),G(),A(),N()})))()}function rn(e){let t=e.result.utilityModel??e.result.setupModel;if(!t)return m;let n=e.canRepair?e.result.candidates.find(e=>e.modelTarget===`utility`&&e.modelRef===t&&e.kind.startsWith(`provider-auto:`)):void 0,r=n&&e.activation.phase===`testing`&&e.activation.targetId===j(n.kind,n.modelRef);return f`<section class="settings-section model-setup__utility">
    <div class="settings-section__header"><h2>${a(`modelSetup.utility.configured`)}</h2></div>
    <div class="model-setup__row">
      <div class="model-setup__row-main">
        <strong>${t}</strong>
        <div class="muted">
          ${a(e.result.configuredModel?`modelSetup.utility.primaryReady`:`modelSetup.utility.choosePrimary`)}
        </div>
      </div>
      <div class="model-setup__row-actions">
        ${n?f`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled}
                @click=${()=>e.onActivateCandidate(n)}
              >
                ${a(r?`modelSetup.candidates.testingButton`:`modelSetup.utility.repair`)}
              </button>`:m}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled}
          @click=${e.onOpenAssistant}
        >
          ${a(`modelSetup.utility.openAssistant`)}
        </button>
      </div>
    </div>
  </section>`}function an(e){let t={auth:a(`modelSetup.failure.auth`),rate_limit:a(`modelSetup.failure.rateLimit`),billing:a(`modelSetup.failure.billing`),timeout:a(`modelSetup.failure.timeout`),format:a(`modelSetup.failure.format`),unavailable:a(`modelSetup.failure.unavailable`),unknown:a(`modelSetup.failure.unknown`)};return t[e]??t.unknown}function on(e){let t={auth:a(`modelSetup.failureGuidance.auth`),rate_limit:a(`modelSetup.failureGuidance.rateLimit`),billing:a(`modelSetup.failureGuidance.billing`),timeout:a(`modelSetup.failureGuidance.timeout`),format:a(`modelSetup.failureGuidance.format`),unavailable:m,unknown:a(`modelSetup.failureGuidance.unknown`)};return t[e]??t.unknown}function sn(e,t){return f`
    <div class="model-setup__failure" role="alert">
      <span class="model-setup__failure-icon" aria-hidden="true">${y.alertTriangle}</span>
      <span><strong>${an(e)}.</strong> ${t} ${on(e)}</span>
    </div>
  `}function cn(e){let t=e.indexOf(`/`);return t<0?e:e.slice(t+1)}function ln(e,t){return e.candidates.find(e=>e.modelRef===t&&!e.kind.startsWith(`saved-auth:`))}function un(e,t){let n=cn(t),r=e?.detail.trim();return!r||e?.kind===`existing-model`?n:r.toLowerCase().includes(n.toLowerCase())?r:`${n} · ${r}`}function dn(e){switch(e.phase){case`checking`:return a(`modelSetup.verify.checkingButton`);case`failed`:return a(`modelSetup.verify.retry`);case`ok`:return a(`modelSetup.verify.checkAgain`);default:return a(`modelSetup.verify.button`)}}function fn(e){let t=e.result.configuredModel,n=e.verify.phase===`ok`?e.verify.modelRef:t,r=k(n),i=n===t?ln(e.result,t):void 0,o=r?O(r):n,s=un(i,n);return f`
    <section class="settings-section model-setup__current" data-verify-phase=${e.verify.phase}>
      <div class="settings-section__header">
        <h2>${a(`modelSetup.verify.title`)}</h2>
      </div>
      <div class="model-setup__row">
        <div class="model-setup__provider-copy">
          ${r?T(r,{className:`model-setup__icon`}):m}
          <div class="model-setup__current-copy">
            <strong>${o}</strong>
            <div class="muted">${s}</div>
            ${e.verify.phase===`checking`?f`<div class="model-setup__testing" role="status">
                    ${a(`modelSetup.verify.checking`,{modelRef:t})}
                  </div>`:e.verify.phase===`ok`?f`<div class="model-setup__verified" role="status">
                      ${e.verify.latencyMs===void 0?a(`modelSetup.verify.ready`):a(`modelSetup.verify.readyIn`,{latencyMs:String(e.verify.latencyMs)})}
                    </div>`:e.verify.phase===`failed`?sn(e.verify.status,e.verify.error):m}
          </div>
        </div>
        <div class="model-setup__row-actions">
          ${e.canVerify?f`<button
                  type="button"
                  class="btn"
                  ?disabled=${e.actionsDisabled}
                  @click=${e.onVerify}
                >
                  ${dn(e.verify)}
                </button>`:m}
          ${e.onContinue?f`<button type="button" class="btn primary" @click=${e.onContinue}>
                  ${y.messageSquare} ${a(`modelSetup.success.continueSetup`)}
                </button>`:m}
        </div>
      </div>
    </section>
  `}function pn(e){return e.phase===`testing`?f`<div class="model-setup__testing" role="status">${a(`modelSetup.testing`)}</div>`:e.phase===`failure`?sn(e.status,e.error):m}function mn(){return(mn=e((()=>{h(),b(),E(),l(),M(),A(),N()})))()}function Q(e){return f`
    <section class=${`settings-section ${e.className??``}`.trim()}>
      <div class="settings-section__header"><h2>${e.title}</h2></div>
      ${e.intro?f`<p class="muted model-setup__loading-intro">${e.intro}</p>`:m}
      <div class="model-setup__rows">
        ${Array.from({length:e.rows??1},(t,n)=>f`
            <div class="model-setup__row model-setup__loading-row">
              <span class="model-setup__loading-icon skeleton"></span>
              <span class="model-setup__loading-copy">
                ${n===0&&e.status?f`<span class="model-setup__loading-status">${e.status}</span>`:f`<span class="skeleton skeleton-line skeleton-line--medium"></span>`}
                <span class="skeleton skeleton-line skeleton-line--long"></span>
              </span>
              <span class="model-setup__loading-action skeleton"></span>
            </div>
          `)}
      </div>
    </section>
  `}function hn(e){return f`
    <div
      class="model-setup__loading"
      role="status"
      aria-busy="true"
      aria-label=${a(`modelSetup.loading`)}
    >
      <div class="model-setup__loading-sections" aria-hidden="true">
        ${e?Q({title:a(`modelSetup.verify.title`),className:`model-setup__loading-section--selected`,status:a(`modelSetup.loading`)}):m}
        ${It()}
        ${Q({title:a(`modelSetup.candidates.title`),className:`model-setup__loading-section--candidates`,status:e?void 0:a(`modelSetup.loading`)})}
        ${Q({title:a(`modelSetup.prepare.title`),intro:a(`modelSetup.prepare.intro`),rows:2})}
        ${Q({title:a(`modelSetup.signIn.title`),className:`model-setup__loading-section--sign-in`})}
        ${Q({title:a(`modelSetup.manual.title`)})}
      </div>
    </div>
  `}function gn(){return(gn=e((()=>{h(),l(),M(),K(),N()})))()}function _n(e,t,n,r,i=!1){let o=k(e.modelRef),s=o&&D(o)?o:null,c=e.modelTarget===`utility`,l=a(c?`modelSetup.utility.ready`:`modelSetup.success.title`),u=e.warning??a(c?`modelSetup.utility.verified`:`modelSetup.success.body`,{modelRef:e.modelRef}),ee=c?a(`modelSetup.utility.openAssistant`):i?a(`modelSetup.discovery.returnToModels`):r?a(`modelSetup.success.continueSetup`):e.warning?a(`tabs.chat`):a(`modelSetup.success.openChat`);return f`
    <testclaw-modal-dialog label=${l} description=${u} @modal-cancel=${n}>
      <section class="model-setup-success" role="status">
        <div
          class=${`model-setup-success__icon${s?` model-setup-success__icon--provider`:``}`}
          aria-hidden="true"
        >
          ${s?f`
                  ${T(s,{className:`model-setup-success__provider-icon`})}
                  <span class="model-setup-success__status-badge">${y.check}</span>
                `:y.shieldCheck}
        </div>
        <div class="model-setup-success__copy">
          <h2>${l}</h2>
          ${e.warning?m:f`<p>${u}</p>`}
        </div>
        ${e.warning?f`<div class="model-setup-success__warning">${e.warning}</div>`:m}
        <div class="model-setup-success__summary">
          <span>${a(c?`modelSetup.utility.model`:`modelSetup.success.activeModel`)}</span>
          <strong>${e.modelRef}</strong>
          ${e.latencyMs===void 0?m:f`<span>
                  ${a(`modelSetup.success.latency`,{latencyMs:String(e.latencyMs)})}
                </span>`}
        </div>
        <footer class="model-setup-success__actions">
          ${i&&!c?m:f`<button type="button" class="btn" @click=${n}>
                  ${a(`modelSetup.success.stayHere`)}
                </button>`}
          <button type="button" class="btn primary" autofocus @click=${t}>
            ${i&&!c?m:y.messageSquare} ${ee}
          </button>
        </footer>
      </section>
    </testclaw-modal-dialog>
  `}function vn(){return(vn=e((()=>{h(),b(),Se(),E(),l(),M(),N()})))()}function yn(e,t){let n=t.recommendedInstalls??[];return e.nativeModels?.count||t.candidates.length>0||(t.authOptions?.length??0)>0||n.length===0?m:f`
    <section class="settings-section model-setup__empty">
      <div class="settings-section__header">
        <h2>${a(`modelSetup.empty.title`)}</h2>
      </div>
      <p class="muted">${a(`modelSetup.empty.intro`)}</p>
      <div class="model-setup__recommendations">
        ${n.map(t=>f`
            <div class="model-setup__recommendation" data-recommended-install=${t.id}>
              ${W(e,t,`model-setup__icon--recommendation`)}
              <div class="model-setup__row-main">
                <strong>${t.label}</strong>
                <div class="muted">${t.hint}</div>
                <a href=${t.website} target="_blank" rel="noopener">${t.website}</a>
              </div>
            </div>
          `)}
      </div>
    </section>
  `}function bn(e,t){return f`
    <div class="model-setup__row" data-auth-choice=${t.id}>
      <div class="model-setup__provider-copy">
        ${W(e,t)}
        <div>
          <strong>${t.label}</strong>
          ${t.groupLabel?f`<div class="muted">${t.groupLabel}</div>`:m}
          ${t.hint?f`<div class="muted">${t.hint}</div>`:m}
        </div>
      </div>
      <button
        type="button"
        class="btn"
        ?disabled=${e.actionsDisabled||e.detecting}
        @click=${()=>e.onStartAuth(t)}
      >
        ${t.kind===`install`?a(`modelSetup.signIn.install`):t.kind===`custom`?a(`modelSetup.signIn.custom`):a(`modelSetup.signIn.verify`)}
      </button>
    </div>
  `}function xn(e,t){let n=(t.authOptions??[]).filter(t=>!e.embedded||!e.credentialChoices?.includes(t.id)).toSorted((e,t)=>e.label.localeCompare(t.label));if(n.length===0)return m;let r=n.filter(e=>e.featured||e.kind===`install`||e.kind===`custom`),i=n.filter(e=>!r.includes(e));return f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${a(`modelSetup.signIn.title`)}</h2>
        <p>${a(`modelSetup.signIn.description`)}</p>
      </div>
      <div class="model-setup__rows">${r.map(t=>bn(e,t))}</div>
      ${i.length?f`<details
              class="model-setup__more"
              .open=${e.moreSignInOpen}
              @toggle=${t=>e.onMoreSignInToggle(t.currentTarget.open)}
            >
              <summary>${a(`modelSetup.signIn.more`)}</summary>
              <div class="model-setup__rows">
                ${i.map(t=>bn(e,t))}
              </div>
            </details>`:m}
    </section>
  `}function Sn(e,t){if(!e.canPrepare)return m;let n=zt(t);return n.length===0?m:f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${a(`modelSetup.prepare.title`)}</h2>
      </div>
      <p class="muted">${a(`modelSetup.prepare.intro`)}</p>
      <div class="model-setup__rows">
        ${n.map(t=>f`
            <div class="model-setup__row" data-prepare-choice=${t.id}>
              <div class="model-setup__provider-copy">
                ${W(e,t)}
                <div>
                  <strong>${t.label}</strong>
                  ${t.hint?f`<div class="muted">${t.hint}</div>`:m}
                </div>
              </div>
              <button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled||e.detecting}
                @click=${()=>e.onStartPrepare(t)}
              >
                ${t.actionLabel??a(`modelSetup.prepare.ollamaButton`)}
              </button>
            </div>
          `)}
      </div>
    </section>
  `}function Cn(e,t){return e.embedded===!0&&e.credentialChoices?.includes(t.id)===!0}function wn(e,t){let n=e.embedded?{...t,manualProviders:t.manualProviders.filter(t=>!Cn(e,t))}:t;if(n.manualProviders.length===0&&e.embedded)return m;let r=n.manualProviders.find(t=>t.id===e.manualProviderId),i=`manual:${e.manualProviderId}`,o=e.embedded?`model-discovery-manual`:`model-setup-manual`,s=e.activation.phase===`testing`&&e.activation.targetId===i;return f`
    <section class="settings-section">
      <div class="settings-section__header">
        <h2>${a(`modelSetup.manual.title`)}</h2>
      </div>
      <div class="model-setup__manual">
        <div class="field">
          <span>${a(`modelSetup.manual.provider`)}</span>
          ${Gt(e,n,r)}
        </div>
        <label class="field">
          <span>
            ${r?a(`modelSetup.manual.accessValueFor`,{provider:Y(r)}):a(`modelSetup.manual.accessValue`)}
          </span>
          <input
            class="input"
            type="password"
            autocomplete="off"
            required
            aria-invalid=${e.manualError?`true`:m}
            aria-describedby=${`${o}-help${e.manualError?` ${o}-error`:``}`}
            .value=${e.manualApiKey}
            ?disabled=${e.actionsDisabled}
            placeholder=${a(`modelSetup.manual.accessValuePlaceholder`)}
            @input=${t=>e.onManualApiKeyChange(t.currentTarget.value)}
          />
        </label>
        <div id=${`${o}-help`} class="model-setup__manual-help">
          ${y.shieldCheck}
          <span>${a(`modelSetup.manual.verifyHint`)}</span>
        </div>
        ${e.manualError?f`<div id=${`${o}-error`} class="callout danger" role="alert">
                ${e.manualError}
              </div>`:m}
        <button
          type="button"
          class="btn primary"
          ?disabled=${e.actionsDisabled||e.detecting||!e.manualProviderId}
          @click=${e.onManualConnect}
        >
          ${a(s?`modelSetup.candidates.testingButton`:e.embedded?`modelSetup.discovery.connectForAgent`:`modelSetup.manual.connectAndVerify`)}
        </button>
      </div>
    </section>
  `}function Tn(e){e.querySelector(`.model-setup > .model-setup__testing, .model-setup > .model-setup__failure`)?.scrollIntoView?.({block:`nearest`,behavior:`auto`})}function En(e,t){return t.nativeSessionCatalogPreferenceRequired!==!0||!t.nativeSessionCatalogs?.length?m:f`
    <section class="settings-section model-setup__native-discovery">
      <div class="settings-section__header"><h2>${a(`modelSetup.nativeDiscovery.title`)}</h2></div>
      <p class="muted">${a(`modelSetup.nativeDiscovery.body`)}</p>
      <p>${t.nativeSessionCatalogs.map(e=>e.label).join(`, `)}</p>
      <label>
        <input
          type="checkbox"
          .checked=${e.nativeSessionCatalogsEnabled===!0}
          ?disabled=${e.actionsDisabled}
          @change=${t=>{let n=t.currentTarget;e.onNativeSessionCatalogsChange?.(n.checked)}}
        />
        ${a(`modelSetup.nativeDiscovery.enable`)}
      </label>
      <p class="muted">${a(`modelSetup.nativeDiscovery.decline`)}</p>
    </section>
  `}function Dn(e,t){let n=e.firstRun&&t.setupComplete&&e.activation.phase!==`success`?e.onOpenChat:void 0,r=!e.embedded&&t.configuredModel?fn({result:t,verify:e.verify.phase===`ok`&&e.verify.modelTarget===`utility`?{phase:`idle`}:e.verify,canVerify:e.canVerify,actionsDisabled:e.actionsDisabled||e.detecting===!0,onVerify:e.onVerify,onContinue:n}):m,i=f`${r}${rn({result:t,activation:e.activation,canRepair:e.canAdmin&&!e.gatewayTooOld,actionsDisabled:e.actionsDisabled||e.detecting===!0||e.activationUnresolved===!0,onOpenAssistant:e.onOpenSetupAssistant??e.onOpenChat,onActivateCandidate:e.onActivateCandidate})}`;return e.canAdmin?e.gatewayTooOld?f`${i}
      <div class="callout warning" role="note">${a(`modelSetup.access.gatewayTooOld`)}</div>`:f`
    ${i} ${En(e,t)} ${yn(e,t)}
    ${e.nativeModels?.render()} ${tn(e,t)}
    ${Sn(e,t)} ${xn(e,t)} ${wn(e,t)}
  `:f`${i}
      <div class="callout warning" role="note">${a(`modelSetup.access.adminRequired`)}</div>`}function On(e){let t;e.page.phase===`ready`?t=Dn({...e,actionsDisabled:e.actionsDisabled||e.activationUnresolved===!0},e.page.result):e.canAdmin?e.gatewayTooOld?t=f`<div class="callout warning" role="note">
      ${a(`modelSetup.access.gatewayTooOld`)}
    </div>`:e.page.phase===`loading`?t=e.embedded?f`<div class="model-setup__loading" role="status">${a(`modelSetup.loading`)}</div>`:hn(e.modelConfigured===!0):e.page.phase===`detect-error`&&(t=f`
      <div class="callout danger" role="alert">${e.page.message}</div>
      <button type="button" class="btn" ?disabled=${e.detecting} @click=${e.onDetect}>
        ${a(`modelSetup.retry`)}
      </button>
    `):t=f`<div class="callout warning" role="note">
      ${a(`modelSetup.access.adminRequired`)}
    </div>`;let n=f`
    <div
      class="model-setup"
      aria-busy=${e.detecting||e.page.phase===`loading`?`true`:`false`}
    >
      <div class="model-setup__intro">
        <div>
          ${e.embedded?f`<h2>${a(`modelSetup.discovery.title`)}</h2>
                  <p>
                    ${a(`modelSetup.discovery.description`,{agent:e.agentLabel??``})}
                  </p>`:f`<h1>${a(`modelSetup.heading`)}</h1>
                  <p>${a(`modelSetup.intro`)}</p>`}
        </div>
        ${e.connection?_t(e.connection,!0):m}
        ${e.page.phase===`ready`&&(e.embedded||!e.page.result.configuredModel)&&e.activation.phase!==`success`&&e.canAdmin&&!e.gatewayTooOld?f`<button
                type="button"
                class="btn"
                ?disabled=${e.actionsDisabled||e.detecting}
                @click=${e.onDetect}
              >
                ${e.detecting?a(`modelSetup.verify.checkingButton`):a(`modelSetup.checkAgain`)}
              </button>`:m}
      </div>
      ${e.canAdmin&&!e.gatewayTooOld?pn(e.activation):m}
      ${e.refreshWarning?f`<div class="callout warning" role="alert">${e.refreshWarning}</div>`:m}
      ${e.activationUnresolved&&!e.actionsDisabled&&e.activation.phase!==`success`?f`<div class="model-setup__recovery">
              <p>${a(`modelSetup.recovery.unknown`)}</p>
              ${e.page.phase===`ready`&&(e.page.result.configuredModel||e.page.result.setupModel)&&e.canVerify&&e.onUseCurrentModel?f`<button
                      type="button"
                      class="btn primary"
                      @click=${e.onUseCurrentModel}
                    >
                      ${a(`modelSetup.recovery.useCurrent`)}
                    </button>`:m}
              <button type="button" class="btn" @click=${e.onDetect}>
                ${a(`modelSetup.checkAgain`)}
              </button>
            </div>`:m}
      ${mt(e.connection?.loginMessage)}
      ${e.detectionError?f`<div class="callout warning" role="alert">${e.detectionError}</div>`:m}
      ${e.detecting&&e.page.phase===`ready`?f`<div class="muted" role="status">${a(`modelSetup.loading`)}</div>`:m}
      ${t}
    </div>
  `,r=f`
    ${e.connection?.login}
    <div @modal-cancel=${e=>e.preventDefault()}>
      ${rt({mode:e.wizardMode,state:e.wizard,refreshWarning:e.refreshWarning,cancellationNotice:e.cancellationNotice,value:e.wizardValue,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,onCancel:e.onWizardCancel,onClose:e.onWizardClose})}
    </div>
    ${e.activation.phase===`success`?_n(e.activation,e.activation.modelTarget===`utility`?e.onOpenSetupAssistant??e.onOpenChat:e.onOpenChat,e.onSuccessClose,e.firstRun,e.embedded):m}
  `;if(e.embedded){let t=e.wizard.phase!==`idle`||e.activation.phase===`success`;return f`
      ${Zt(t?m:f`<testclaw-modal-dialog
              label=${a(`modelSetup.discovery.title`)}
              @modal-cancel=${()=>e.onClose?.()}
              @wa-after-show=${t=>t.target===t.currentTarget?e.onDiscoveryShown?.():void 0}
            >
              <div class="model-setup-wizard model-setup-discovery">
                <div class="model-setup-wizard__body">${n}</div>
                <div class="model-setup-wizard__footer">
                  <button class="btn" @click=${()=>e.onClose?.()}>
                    ${a(`common.close`)}
                  </button>
                </div>
              </div>
            </testclaw-modal-dialog>`)}
      ${r}
    `}return f`
    <section class="content-header">
      <div>
        <div class="page-title">${De(`model-setup`)}</div>
        <div class="page-subtitle">
          ${Ee(`model-setup`)} ${Ke(kn)}
        </div>
      </div>
    </section>
    ${$e(n)} ${r}
  `}var kn;function An(){return(An=e((()=>{h(),$t(),Te(),b(),qe(),et(),l(),M(),ht(),nn(),mn(),gn(),G(),J(),X(),vn(),ct(),N(),kn=`https://docs.testclaw.ai/concepts/model-providers`})))()}var $;function jn(){return(jn=e((()=>{n(),ye(),Ce(),we(),l(),Oe(),u(),c(),ne(),vt(),Mt(),G(),H(),K(),J(),X(),Xt(),A(),An(),pt(),B(),$=class extends o{constructor(...e){super(...e),this.actionsDisabled=()=>this.login.busy||this.nativeModels.saving||this.activationState.phase===`testing`||this.verifyState.phase===`checking`||this.wizardMutationActive||this.wizardState.phase!==`idle`&&this.wizardState.phase!==`error`&&this.wizardState.phase!==`cancelled`,this.embedded=!1,this.agentLabel=``,this.credentialChoices=[],this.pageState={phase:`loading`},this.activationState={phase:`idle`},this.verifyState={phase:`idle`},this.wizardState={phase:`idle`},this.wizardMode=`auth`,this.wizardDraft={stepId:null,value:void 0},this.manualProviderId=``,this.manualApiKey=``,this.manualError=null,this.moreSignInOpen=!1,this.nativeSessionCatalogsEnabled=!1,this.iconUrls={},this.setupRefreshWarning=null,this.detectionError=null,this.detectionRequest=null,this.cancellationNotice=null,this.observedConnection=null,this.pendingPrepareOption=null,this.wizardMutationGeneration=0,this.wizardMutationActive=!1,this.wizardReturnFocus=null,this.firstRun=new jt({context:()=>this.context,routeData:()=>this.routeData,pageState:()=>this.pageState,activationState:()=>this.activationState,actionsDisabled:()=>this.actionsDisabled()||this.detectionRequest!==null,canUseSetup:e=>this.canUseSetup(e),canVerify:e=>this.canVerify(e),verify:e=>this.verifyConnection(e).then(()=>this.verifyTask.value),setVerifyState:e=>this.verifyState=e,setActivationState:e=>this.activationState=e,setRefreshWarning:e=>this.setupRefreshWarning=e}),this.nativeModels=new Lt(this,{getContext:()=>this.context,getConnection:()=>this.observedConnection,canUseSetup:e=>this.canUseSetup(e),blocked:()=>this.actionsDisabled()||this.detectionRequest!==null||this.firstRun.unresolved,onSelected:()=>this.embedded?this.onClose?.():this.context.navigate(`chat`)}),this.iconLoader=new Pt(()=>this.context,()=>this.pageState,e=>this.iconUrls=e),this.login=new gt(this,{getScope:()=>({context:this.context,agentId:this.agentSelection.state.selectedId}),canStart:()=>this.canUseSetup(this.context.gateway.snapshot.client)&&!this.firstRun.unresolved&&!this.actionsDisabled(),canContinue:()=>this.canUseSetup(this.context.gateway.snapshot.client)&&!this.firstRun.unresolved,refresh:()=>this.detect()}),this.subscriptions=new re(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t),e=>this.synchronizeGateway(e.snapshot)).watch(()=>this.context&&this.agentSelection,(e,t)=>e.subscribe(t),()=>this.synchronizeGateway(this.context.gateway.snapshot)).watch(()=>this.firstRun,(e,t)=>e.subscribe(t)),this.wizard=new dt({getClient:()=>this.context?.gateway.snapshot.client??null,getAgentId:()=>this.agentSelection.state.selectedId??null,onChange:e=>{e.phase!==`starting`&&e.phase!==`done`&&(this.activationState={phase:`idle`}),this.wizardState=e.phase===`step`&&this.wizardMutationActive?{...e,busy:!0}:e,this.wizardDraft=ot(this.wizardDraft,e),e.phase===`idle`&&(this.cancellationNotice=null)},onStart:(e,t)=>{if(e===`testclaw.setup.prepare.start`)return;let n=this.firstRun.beginActivation(t??{kind:`provider-auth`});return e=>(this.firstRun.recordActivation(n,e),this.requestUpdate(),()=>this.firstRun.ownsActivation(n))},onBackgroundCompletion:e=>this.runWizardMutation(()=>Promise.resolve(e),!0),requestFailedMessage:()=>a(`modelSetup.errors.requestFailed`),cancelledMessage:()=>a(`modelSetup.wizard.cancelled`),sessionExpiredMessage:()=>a(`modelSetup.wizard.sessionExpired`)}),this.detectTask=Kt(this,{getHello:()=>this.context.gateway.snapshot.hello,onComplete:e=>{if(this.detectionRequest===e.token&&this.context.gateway.snapshot.client===e.client&&this.context.gateway.snapshot.hello===e.hello&&this.agentSelection.state.selectedId===e.agentId){if(this.detectionRequest=null,`error`in e){let t=V(e.error);this.pageState.phase===`ready`?this.detectionError=t:(this.firstRun.setReadyConnection(null),this.pageState={phase:`detect-error`,message:t});return}this.detectionError=null,this.firstRun.setReadyConnection({client:e.client,hello:e.hello,agentId:e.agentId}),this.pageState={phase:`ready`,result:e.value},e.value.manualProviders.some(e=>e.id===this.manualProviderId)||(this.manualProviderId=``)}}}),this.verifyTask=Yt(this)}get agentSelection(){return U(this.context,this.routeData?.firstRun===!0)}disconnectedCallback(){this.firstRun.dispose(),this.resetActivity(),this.observedConnection=null,this.nativeModels.reset(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(){this.synchronizeGateway(this.context.gateway.snapshot)}updated(e){this.isConnected&&(e.has(`activationState`)&&this.activationState.phase!==`idle`&&Tn(this.renderRoot),this.wizardState.phase!==`idle`&&this.querySelector(`testclaw-modal-dialog`)?.setReturnFocusTarget(this.wizardReturnFocus),this.iconLoader.reconcile(),this.firstRun.start())}synchronizeGateway(e){let t=this.routeData;if(!this.isConnected||!t)return;let n=this.observedConnection,r=At(n,kt(this.context,t.firstRun,n?.recoveryScope));if(r.kind===`unchanged`)return;let i=r.connection;if(this.observedConnection=i,this.nativeModels.reset(),r.kind===`pending`){this.wizard.hasAdmittedSession||(this.pageState={phase:`loading`}),this.wizard.suspend();return}let a=n&&(!i.recoveryScope||i.recoveryScope!==n.recoveryScope),o=n&&(i.agentId!==n.agentId||i.selectionIntentRevision!==n.selectionIntentRevision||i.firstRun!==n.firstRun||i.connectionRevision!==n.connectionRevision||a),s=i.connected&&!v(e.hello?.auth??null);if((a||s)&&this.wizard.close({retireOwner:!0}),o&&(this.nativeSessionCatalogsEnabled=!1,this.manualProviderId=``,this.manualApiKey=``,this.manualError=null),n&&i.recoveryScope&&!o&&this.wizard.hasAdmittedSession){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.wizard.suspend(),this.canUseSetup(i.client)&&(this.firstRun.reconnectActivation(i),this.runWizardMutation(()=>this.wizard.resume()));return}i.firstRun===n?.firstRun?this.firstRun.connectionChanged(i):this.firstRun.routeChanged(),this.resetActivity(),this.pageState={phase:`loading`},this.canUseSetup(i.client)&&this.detect()}resetActivity(){this.login.reset(),this.detectionRequest=null,this.detectionError=null,this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.detectTask.run([null,null,null]),this.activationState={phase:`idle`},this.resetVerify(),this.iconLoader.reset(),this.pendingPrepareOption=null,this.wizard.cancel()}canUseSetup(e){let t=this.context.gateway.snapshot;return!(!e||this.routeData?.firstRun!==!0&&this.agentSelection.state.selectedId===null||t.phase!==`connected`||!v(t.hello?.auth??null)||x(t,`testclaw.setup.detect`)!==!0)}async detect(){let e=this.context.gateway.snapshot.client;if(!this.canUseSetup(e)||this.detectionRequest)return null;this.resetVerify(),this.detectionError=null,this.pageState.phase!==`ready`&&(this.pageState={phase:`loading`});let t={};this.detectionRequest=t,await this.detectTask.run([e,this.agentSelection.state.selectedId,t]);let n=this.detectTask.value;return n?.token===t&&`value`in n?n.value:null}canVerify(e){let t=this.context.gateway.snapshot;return this.canUseSetup(e)&&x(t,`testclaw.setup.verify`)===!0}resetVerify(){this.verifyState={phase:`idle`},this.verifyTask.run([null,null,void 0])}async verifyConnection(e){let t=this.context.gateway.snapshot.client;!this.canVerify(t)||this.actionsDisabled()||this.detectionRequest||(this.verifyState={phase:`checking`},await this.verifyTask.run([t,this.agentSelection.state.selectedId,e]))}async activate(e,t){let n=this.context.gateway.snapshot.client;!this.canUseSetup(n)||this.actionsDisabled()||this.detectionRequest||this.firstRun.unresolved||(this.manualError=null,this.activationState={phase:`testing`,targetId:t},this.pendingPrepareOption=null,this.wizardMode=`activate`,await this.runWizardMutation(()=>this.wizard.activate({...e,...this.nativeSessionCatalogPreference()},t)))}nativeSessionCatalogPreference(){return this.pageState.phase===`ready`&&this.pageState.result.nativeSessionCatalogPreferenceRequired===!0?{nativeSessionCatalogsEnabled:this.nativeSessionCatalogsEnabled}:{}}connectManual(){let e=Vt(this.pageState.phase===`ready`?this.pageState.result.manualProviders:[],this.manualProviderId,this.manualApiKey);if(!e){this.manualError=a(`modelSetup.manual.required`);return}this.activate(e,`manual:${this.manualProviderId}`)}selectManualProvider(e){e!==this.manualProviderId&&(this.manualApiKey=``),this.manualProviderId=e,this.manualError=null}async handleWizardDone({startMethod:e,preparedModelRef:t,activationTargetId:n,modelActivation:r,isCurrent:i}){let o=e===`testclaw.setup.prepare.start`?this.pendingPrepareOption:null,s=this.nativeSessionCatalogPreference();if(this.pendingPrepareOption=null,o&&t){let e=Rt(o,t);this.wizard.close(),this.activate({...e,...s},j(e.kind,t));return}if(e!==`testclaw.setup.prepare.start`){if(i?.()===!1){this.wizard.close();return}if(!r){this.wizard.fail(a(e===`testclaw.setup.activate.start`?`modelSetup.errors.activationFailed`:`modelSetup.wizard.notComplete`));return}this.wizard.close();let t={ok:!0,...r},o=n??`provider-auth`;this.activationState=ft({result:t,targetId:o,fallbackError:a(`modelSetup.errors.activationFailed`),restartWarning:a(`labsPage.restartRequired`),refreshWarning:this.setupRefreshWarning}),this.activationState.phase===`success`&&(this.manualApiKey=``),this.firstRun.finishActivation(t,o,this.setupRefreshWarning);return}let c=await this.detect();if(!c){this.wizard.fail(a(`modelSetup.errors.requestFailed`));return}if(o){this.pageState=st(c,o.modelTarget);let e=Bt(c,o.id);if(!e){this.wizard.fail(a(`modelSetup.prepare.providerNotReady`,{provider:o.label}));return}this.wizard.close(),this.activate({kind:e.kind,modelRef:e.modelRef,...e.modelTarget?{modelTarget:e.modelTarget}:{},...s},j(e.kind,e.modelRef));return}this.wizard.close()}closeWizard(){this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.wizard.close()}async runWizardMutation(e,t=!1){let n=this.context.gateway.snapshot.client;if((this.wizardMutationActive||this.detectionRequest!==null)&&!t||!this.canUseSetup(n)||this.wizard.state.phase===`idle`&&this.firstRun.unresolved)return;if(this.wizard.state.phase===`idle`){let e=this.ownerDocument.activeElement;this.wizardReturnFocus=e instanceof HTMLElement&&this.contains(e)?e:null}let r=++this.wizardMutationGeneration;this.wizardMutationActive=!0,this.requestUpdate();try{let t=await this.context.runtimeConfig.runExternalMutation(async t=>{if(t!==n)throw Error(`Connection changed before model setup continued.`);return await e()},{canDispatch:()=>r===this.wizardMutationGeneration&&this.context.gateway.snapshot.client===n&&this.canUseSetup(n),dispatchError:a(`modelSetup.errors.requestFailed`)});if(r!==this.wizardMutationGeneration){t.ok&&!t.refresh.ok&&this.isConnected&&(this.setupRefreshWarning=t.refresh.error),this.isConnected&&this.canUseSetup(this.context.gateway.snapshot.client)&&this.detect();return}if(!t.ok){this.wizard.fail(t.error);return}this.setupRefreshWarning=t.refresh.ok?null:t.refresh.error;let i=t.value;i?(this.wizardMutationActive=!1,await this.handleWizardDone(i)):this.wizardState.phase===`step`&&this.wizardState.busy&&(this.wizardState={...this.wizardState,busy:!1})}catch(e){r===this.wizardMutationGeneration&&this.wizard.fail(V(e))}finally{r===this.wizardMutationGeneration&&(this.wizardMutationActive=!1,this.requestUpdate())}}async cancelWizard(){let e=this.wizardMutationGeneration;this.cancellationNotice=null;try{let t=await this.wizard.requestCancellation();if(e!==this.wizardMutationGeneration)return;if(t===`running`){this.cancellationNotice=a(`modelSetup.wizard.finishingStep`);return}if(t!==`cancelled`)return;this.wizardMutationGeneration+=1,this.wizardMutationActive=!1,this.pendingPrepareOption=null,this.activationState={phase:`idle`}}catch(t){e===this.wizardMutationGeneration&&(this.wizardState.phase===`starting`||this.wizardState.phase===`step`)&&(this.cancellationNotice=a(`modelSetup.wizard.cancelFailed`,{error:V(t)}))}}render(){let e=this.context.gateway.snapshot,t=v(e.hello?.auth??null),n=e.phase===`connected`&&x(e,`testclaw.setup.detect`)!==!0;return On({detecting:this.detectionRequest!==null,detectionError:this.detectionError,embedded:this.embedded,agentLabel:this.agentLabel,credentialChoices:this.credentialChoices,onClose:this.onClose,onDiscoveryShown:()=>{this.wizardState.phase===`idle`&&(this.wizardReturnFocus?.focus({preventScroll:!0}),this.wizardReturnFocus=null)},onConnectChoice:this.onConnectChoice,page:this.firstRun.visiblePageState(this.verifyState.phase===`ok`&&this.verifyState.modelTarget!==`utility`),activation:this.activationState,verify:this.verifyState,connection:this.embedded?void 0:this.login.pageActions,wizard:this.wizardState,wizardMode:this.wizardMode,wizardValue:this.wizardDraft.value,canAdmin:t,canVerify:this.canVerify(e.client),canPrepare:this.canUseSetup(e.client)&&x(e,`testclaw.setup.prepare.start`)===!0,modelConfigured:ie(e)?.modelConfigured===!0,gatewayTooOld:n,refreshWarning:this.setupRefreshWarning,cancellationNotice:this.cancellationNotice,activationUnresolved:this.firstRun.unresolved,onUseCurrentModel:this.firstRun.canUseCurrentModel?()=>void this.firstRun.useCurrentModel():void 0,actionsDisabled:this.actionsDisabled(),manualProviderId:this.manualProviderId,manualApiKey:this.manualApiKey,manualError:this.manualError,moreSignInOpen:this.moreSignInOpen,nativeSessionCatalogsEnabled:this.nativeSessionCatalogsEnabled,nativeModels:this.nativeModels,onNativeSessionCatalogsChange:e=>this.nativeSessionCatalogsEnabled=e,firstRun:this.routeData?.firstRun===!0,iconUrls:this.iconUrls,onDetect:()=>{!this.detectionRequest&&this.firstRun.retryDetection()&&this.detect()},onVerify:()=>void this.firstRun.verify(),onActivateCandidate:({kind:e,modelRef:t,modelTarget:n})=>void this.activate({kind:e,modelRef:t,...n?{modelTarget:n}:{}},j(e,t)),onStartAuth:e=>{this.wizard.prepareSignIn(e.kind,e.label),this.pendingPrepareOption=null,this.wizardMode=`auth`,this.runWizardMutation(()=>this.wizard.start(e.id,`testclaw.setup.auth.start`,this.nativeSessionCatalogPreference(),e.modelTarget))},onStartPrepare:e=>{this.pendingPrepareOption=e,this.wizardMode=`prepare`,this.runWizardMutation(()=>this.wizard.start(e.id,`testclaw.setup.prepare.start`))},onManualProviderChange:e=>this.selectManualProvider(e),onManualApiKeyChange:e=>{this.manualApiKey=e,this.manualError=null},onManualConnect:()=>this.connectManual(),onMoreSignInToggle:e=>this.moreSignInOpen=e,onIconError:e=>this.iconLoader.invalidate(e),onOpenChat:()=>this.embedded?this.onClose?.():this.firstRun.continueSetup(),onOpenSetupAssistant:()=>this.firstRun.continueSetup(`utility`),onSuccessClose:()=>{if(this.embedded){this.onClose?.();return}this.activationState={phase:`idle`},this.detect()},onWizardValueChange:e=>this.wizardDraft={...this.wizardDraft,value:e},onWizardAnswer:(e,t)=>void this.runWizardMutation(()=>this.wizard.answer(e,t)),onWizardCancel:()=>void this.cancelWizard(),onWizardClose:()=>this.closeWizard()})}},i([r({context:xe,subscribe:!0})],$.prototype,`context`,void 0),i([_({attribute:!1})],$.prototype,`routeData`,void 0),i([_({type:Boolean})],$.prototype,`embedded`,void 0),i([_()],$.prototype,`agentLabel`,void 0),i([_({attribute:!1})],$.prototype,`credentialChoices`,void 0),i([_({attribute:!1})],$.prototype,`onClose`,void 0),i([_({attribute:!1})],$.prototype,`onConnectChoice`,void 0),i([g()],$.prototype,`pageState`,void 0),i([g()],$.prototype,`activationState`,void 0),i([g()],$.prototype,`verifyState`,void 0),i([g()],$.prototype,`wizardState`,void 0),i([g()],$.prototype,`wizardMode`,void 0),i([g()],$.prototype,`wizardDraft`,void 0),i([g()],$.prototype,`manualProviderId`,void 0),i([g()],$.prototype,`manualApiKey`,void 0),i([g()],$.prototype,`manualError`,void 0),i([g()],$.prototype,`moreSignInOpen`,void 0),i([g()],$.prototype,`nativeSessionCatalogsEnabled`,void 0),i([g()],$.prototype,`iconUrls`,void 0),i([g()],$.prototype,`setupRefreshWarning`,void 0),i([g()],$.prototype,`detectionError`,void 0),i([g()],$.prototype,`detectionRequest`,void 0),i([g()],$.prototype,`cancellationNotice`,void 0),customElements.get(`testclaw-model-setup-page`)||customElements.define(`testclaw-model-setup-page`,$)})))()}jn();export{$ as ModelSetupPage,Tt as resumeFirstRunActivation};
//# sourceMappingURL=model-setup-page-CPfzJFpi.js.map