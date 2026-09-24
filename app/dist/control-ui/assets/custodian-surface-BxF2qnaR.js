import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Hi as t,Jr as n,Za as r,ja as i,qi as a,qr as o,so as s,ti as c,wa as l}from"./control-ui-foundation-CGMdhB5v.js";import{$l as u,Bl as d,Bs as f,Hl as p,Jl as m,Ks as ee,Qc as te,Qs as ne,Rs as re,Xr as ie,Xs as ae,Yr as oe,Zs as se,_c as ce,ac as le,dl as ue,fc as de,ic as fe,jn as h,kn as pe,mc as me,ou as he,zs as ge}from"./control-ui-core-S9jKXqB5.js";import{$ as g,X as _,Y as v,ct as _e,nt as y,ut as b}from"./lit-runtime-DWoPVI38.js";import{Di as ve,Fi as ye,Ii as be,Jr as xe,La as Se,Mn as Ce,Oi as we,Xn as Te,Yn as Ee,ba as De,c as Oe,jn as ke,l as Ae,s as je,vt as Me,ya as Ne,yt as Pe,zr as Fe}from"./control-ui-core-G2U4O6rB.js";import{It as Ie,Lt as Le}from"./control-ui-boot-shared-8dYR6CXG.js";import{c as x,l as Re,s as S,u as C}from"./gateway-runtime-BV4hxqU_.js";import{Di as ze,Ei as Be,Fs as Ve,Ls as He,Ti as Ue,_i as We,wi as Ge,xi as Ke}from"./control-ui-boot-shared-ooxiG3qa.js";import{$t as qe,Dr as Je,ci as Ye,di as w,en as Xe,fi as Ze,li as T,or as Qe,si as $e,sr as et,tn as tt,ui as nt,wr as rt}from"./control-ui-boot-shared-CCYBAAP9.js";import{i as it,n as E,o as at,r as D,t as ot}from"./plugin-help-BRzlmSdh.js";import{L as st,R as ct}from"./control-ui-boot-shared-BnfqoX89.js";import{Jn as lt,Kn as ut,Rr as dt,er as ft,nr as pt,rr as mt,tr as O,zr as ht}from"./control-ui-boot-shared-D2o30asO.js";import"./control-ui-boot-shared-VDjYq2Zh.js";import{n as gt,t as k}from"./custodian-alert-store-D3-kKDhQ.js";import{i as _t,t as vt}from"./wizard-step-controls-BOTgnqix.js";import"./chat-transcript-styles-DpctKxHc.js";import"./control-ui-boot-chat-oECFOvg2.js";function yt(e){if(!a(e))return;let t=e.code;return t===A.INFERENCE_UNAVAILABLE?{code:t}:void 0}function bt(e){if(!a(e))return;let t=e.code;return t===A.SESSION_INVALIDATED?{code:t}:void 0}var A;function j(){return(j=e((()=>{A={INFERENCE_UNAVAILABLE:`system_agent_inference_unavailable`,SESSION_INVALIDATED:`system_agent_session_invalidated`}})))()}var M;function N(){return(N=e((()=>{ee(),D(),M=class{constructor(){this.ordinary={value:``},this.sensitive={value:``},this.context=null,this.cleanup=null}connect(e,t){this.cleanup?.(),this.context=e,this.cleanup=ae(e,t)}resetPrompt(e,t){this.sensitive={value:``},[e.wizardValue,e.wizardSecretVisible]=[void 0,!1],e.sensitive=t}get pluginReference(){return this.context?E(this.context):void 0}reconcile(e){if(!this.context||e.sensitive||e.wizardInputPending||e.hasUnresolvedQuestion())return;let t=at(this.context);t&&(this.ordinary={value:[this.ordinary.value,t].filter(Boolean).join(`

`)})}}})))()}function xt(e,t,n){t===`chat`&&n===`utility`?e?.navigate(`model-setup`,{search:`?firstRun=1`}):e?.navigate(t)}async function St(e){let{context:t}=e,n=t.gateway.snapshot.sessionKey?.trim();if(e.agentId){let r=await t.agents.refreshList();if(!e.isCurrent())return`stale`;n=l({agentId:e.agentId,mainKey:r?.mainKey}),Ce({selection:t.agentSelection,gateway:t.gateway,sessionKey:n,agentId:e.agentId})}if(!n)return`exit-setup`;let r=ce({face:`chat`,sessionKey:n,fallbackAgentId:me(t),basePath:t.basePath,mainKey:ue({agentsList:t.agents.state.agentsList,hello:t.gateway.snapshot.hello}),focusComposer:!e.hatchDraft});return t.navigate(`chat`,{pathname:r.options.pathname,...e.hatchDraft?{search:`?draft=${encodeURIComponent(u(`custodian.hatchDraft`))}`}:r.options.search?{search:r.options.search}:{}}),window.dispatchEvent(new CustomEvent(Fe,{detail:{open:!1}})),`navigated`}function P(){return(P=e((()=>{ke(),xe(),m(),de(),te()})))()}function Ct(e,t){return t===`received`?`sent`:e instanceof Ee||t===`unsent`?`rejected`:`unknown`}function wt(e,t){return t===`sent`?!1:t===`unknown`||e}function Tt(e,t,n){return n!==`rejected`&&e!==null&&e.severity===t.severity&&e.message===t.message}function Et(e,t,n){if(n.event!==`health`)return[e,t];let r=Ft(n);return t?[r,t]:[r,null]}function Dt(e){if(e.kind===`config-reload`)return u(`custodian.nudge.configReload`);let t=e.channelLabel??u(`custodian.nudge.channelFallback`);return e.kind===`channel-auth`?u(`custodian.nudge.channelAuth`,{channel:t}):e.kind===`channel-disconnected`?u(`custodian.nudge.channelDisconnected`,{channel:t}):u(`custodian.nudge.channelDegraded`,{channel:t})}function Ot(e){return g`<div class="custodian__nudge" role="status">
    <button
      class="custodian__nudge-action"
      type="button"
      ?disabled=${e.disabled}
      @click=${e.onSend}
    >
      ${Dt(e.nudge)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${u(`custodian.nudge.dismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function kt(e){return g`<div class="custodian__nudge custodian__nudge--channel-onboarding" role="status">
    <div class="custodian__nudge-copy">
      <strong>${u(`custodian.nudge.channelSetupTitle`)}</strong>
      <span>${u(`custodian.nudge.channelSetupBody`)}</span>
    </div>
    <button
      class="btn btn--sm primary custodian__nudge-cta"
      type="button"
      @click=${e.onOpenChannels}
    >
      ${u(`custodian.nudge.channelSetupAction`)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${u(`custodian.nudge.channelSetupDismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function At(e){return g`<div class="custodian__nudge custodian__nudge--channel-onboarding" role="alert">
    <div class="custodian__nudge-copy">
      <strong>${u(`custodian.nudge.channelStatusErrorTitle`)}</strong>
      <span>${u(`custodian.nudge.channelStatusErrorBody`)}</span>
    </div>
    <button
      class="btn btn--sm primary custodian__nudge-cta"
      type="button"
      ?disabled=${e.retrying}
      @click=${e.onRetry}
    >
      ${e.retrying?u(`common.loading`):u(`common.retry`)}
    </button>
    <button
      class="custodian__nudge-dismiss"
      type="button"
      aria-label=${u(`custodian.nudge.channelSetupDismiss`)}
      @click=${e.onDismiss}
    >
      ×
    </button>
  </div>`}function jt(e){return I.some(t=>e[t]===`configured_unavailable`)}function Mt(e){return t(e.probe)?.ok===!1}function Nt(e,t,n){if(n.configured===!1||n.enabled===!1)return null;let r=e.toLowerCase();if(jt(n))return{severity:3,kind:`channel-auth`,channelLabel:t,message:`what happened with ${r} authentication?`};let i=typeof n.healthState==`string`?n.healthState.trim().toLowerCase():void 0;if(i===`terminal-disconnect`||Mt(n))return{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`};if(i===`not-running`&&n.running===!1){let e=typeof n.reconnectAttempts==`number`?n.reconnectAttempts:0,t=typeof n.lastStartAt==`number`?n.lastStartAt:void 0,r=typeof n.lastStopAt==`number`?n.lastStopAt:void 0;if(n.restartPending===!1&&r!==void 0&&(t===void 0||r>=t)&&e<10)return null}return n.connected!==!0&&i!==`healthy`&&typeof n.lastError==`string`&&n.lastError.trim()?{severity:3,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:n.connected===!1&&n.running===!0?{severity:2,kind:`channel-disconnected`,channelLabel:t,message:`what happened with ${r}?`}:i&&F.has(i)?{severity:1,kind:`channel-degraded`,channelLabel:t,message:`what happened with ${r}?`}:null}function Pt(e){let n=t(e);if(!n)return null;if(t(n.configReload)?.hotReloadStatus===`disabled`)return{severity:3,kind:`config-reload`,message:`what happened with configuration reload?`};let r=t(n.channels);if(!r)return null;let i=t(n.channelLabels),a=null;for(let[e,n]of Object.entries(r)){let r=t(n);if(!r)continue;let o=typeof i?.[e]==`string`?i[e]:e,s=t(r.accounts),c=s?Object.values(s).map(t).filter(e=>e!==null):[],l=c.length>0?c:[r];for(let t of l){let n=Nt(e,o,t);n&&(!a||n.severity>a.severity)&&(a=n)}}return a}function Ft(e){return e.event===`health`?Pt(e.payload):null}var F,I;function L(){return(L=e((()=>{v(),Te(),m(),F=new Set([`disconnected`,`stale-socket`,`stuck`,`terminal-disconnect`]),I=[`tokenStatus`,`botTokenStatus`,`appTokenStatus`,`signingSecretStatus`,`userTokenStatus`]})))()}function It(e,t){e.activeVariant!==`caretaker`||e.eventNudgeClosed||([e.eventNudge,e.eventNudgePending]=Et(e.eventNudge,e.eventNudgePending,t),e.requestNudgeUpdate())}async function Lt(e){let t=e.eventNudge;if(!t||e.sensitive||e.hasUnresolvedQuestion())return;e.eventNudgePending=t,e.requestNudgeUpdate();let n=await e.send(t.message);if(e.eventNudgePending===t){e.eventNudgePending=null;let r=Tt(e.eventNudge,t,n);[e.eventNudgeClosed,e.eventNudge]=[r,r?null:e.eventNudge],e.requestNudgeUpdate()}}function Rt(e){[e.eventNudge,e.eventNudgeClosed]=[null,!0],e.requestNudgeUpdate()}function zt(e,t){e.channelOnboardingNudgeClosed=!0,e.requestNudgeUpdate(),t()}function Bt(e,t,n){e.channelOnboardingNudgeClosed=!0,t(),e.requestNudgeUpdate(),n()}function R(){return(R=e((()=>{L()})))()}function Vt(e){return e!==null&&e.length<=512&&e.trim().length>0}function z(){return`control-ui-onboarding-${oe()}`}function B(e){try{he()?.setItem(V,e)}catch{}}function Ht(){let e=null;try{e=he()?.getItem(V)??null}catch{}if(Vt(e))return{sessionId:e,restored:!0};let t=z();return B(t),{sessionId:t,restored:!1}}var V;function Ut(){return(Ut=e((()=>{ie(),V=`testclaw.custodian.session.v1`})))()}function Wt(e){if(!e||e.gateway.snapshot.phase!==`connected`)return`unresolved`;let t=e.agents.state.agentsList;if(!t)return`unresolved`;let n=i(e.gateway.snapshot.assistantAgentId??t.defaultId??``),r=t.agents.find(e=>i(e.id)===n);return r?r.model?.primary?.trim()?`ready`:r.utilityModel?.trim()?`utility`:`required`:`unresolved`}function H(){return(H=e((()=>{te()})))()}function U(e,t){return e.options?.find(e=>Object.is(e.value,t))}function Gt(e,t){if(e.type===`note`||e.type===`action`||e.type===`progress`)return{answer:{stepId:e.id},display:u(`common.continue`)};if(e.type===`text`)return typeof t==`string`?{answer:{stepId:e.id,value:t},display:t}:null;if(e.type===`confirm`)return typeof t==`boolean`?{answer:{stepId:e.id,value:t},display:u(t?`common.yes`:`common.no`)}:null;if(e.type===`select`){let n=U(e,t);return n?{answer:{stepId:e.id,value:t},display:n.label}:null}if(!Array.isArray(t))return null;if(t.length===0)return{answer:{stepId:e.id,value:[]},display:u(`common.none`)};let n=t.map(t=>U(e,t)?.label);return n.every(e=>e!==void 0)?{answer:{stepId:e.id,value:t},display:n.join(`, `)}:null}function Kt(e){return e.type===`multiselect`?Array.isArray(e.initialValue)?[...e.initialValue]:[]:e.initialValue}function qt(e){return Re(e?.gateway.snapshot??{},Ie.SYSTEM_AGENT_WIZARD_CANCEL)??!1}function Jt(){return(Jt=e((()=>{Le(),m(),x()})))()}function Yt(e,t){return e?`onboarding`:t?`new-agent`:`caretaker`}function W(e,t,n){let r=e===`caretaker`?{}:{welcomeVariant:e};if(t===void 0)return r;let i=window.location.pathname,a=Se(i,Ne(i));return{...r,message:t,...a?{context:{page:a,...n?{plugin:n}:{}}}:{}}}function G(e){return e.message!==void 0||e.wizardAnswer!==void 0||e.wizardCancel!==void 0}function Xt(e){let t=e&&typeof e==`object`?e.details:void 0;return{inferenceUnavailable:yt(t)!==void 0,sessionInvalidated:bt(t)!==void 0}}function K(){return(K=e((()=>{j(),De()})))()}var q;function Zt(){return(Zt=e((()=>{v(),y(),m(),q=class extends r{constructor(...e){super(...e),this.selectedValue=``,this.requestKey=``,this.focusPreselection=!1}createRenderRoot(){return this}willUpdate(){let e=this.props,t=e?JSON.stringify([e.header??``,e.question,e.options.map(e=>[e.value,e.label,e.recommended===!0])]):``;t!==this.requestKey&&(this.requestKey=t,this.selectedValue=e?.options.slice(0,4).find(e=>e.recommended)?.value??``,this.focusPreselection=!!this.selectedValue)}updated(e){this.focusPreselection&&!this.props?.disabled&&(this.focusPreselection=!1,[...this.querySelectorAll(`.option-card__choice`)].find(e=>e.dataset.optionValue===this.selectedValue)?.focus({preventScroll:!0}))}select(e){this.props?.disabled||(this.selectedValue=e,this.props?.onSelect?.(e),this.dispatchEvent(new CustomEvent(`option-select`,{bubbles:!0,composed:!0,detail:{value:e}})))}skip(){this.props?.disabled||(this.props?.onSkip?.(),this.dispatchEvent(new CustomEvent(`option-skip`,{bubbles:!0,composed:!0})))}render(){let e=this.props;if(!e)return _;let t=e.options.slice(0,4),n=t.findIndex(e=>e.recommended===!0);return g`
      <section class="option-card" role="group" aria-label=${e.question}>
        ${e.header?g`<div class="option-card__chip">${e.header}</div>`:_}
        <div class="option-card__question">${e.question}</div>
        <div class="option-card__choices" role="radiogroup">
          ${t.map((t,r)=>{let i=r===n,a=t.value===this.selectedValue;return g`
              <button
                class=${`option-card__choice ${i?`option-card__choice--recommended`:``} ${a?`option-card__choice--selected`:``}`}
                type="button"
                role="radio"
                aria-checked=${a?`true`:`false`}
                data-option-value=${t.value}
                ?disabled=${e.disabled}
                @click=${()=>this.select(t.value)}
              >
                <span class="option-card__choice-copy">
                  <strong>${t.label}</strong>
                  ${t.description?g`<span class="option-card__description">${t.description}</span>`:_}
                </span>
                ${i?g`<span class="option-card__recommended">
                        ${u(`optionCard.recommended`)}
                      </span>`:_}
              </button>
            `})}
        </div>
        <button
          class="option-card__skip"
          type="button"
          ?disabled=${e.disabled}
          @click=${()=>this.skip()}
        >
          ${u(`optionCard.skip`)}
        </button>
      </section>
    `}},c([b({attribute:!1})],q.prototype,`props`,void 0),c([_e()],q.prototype,`selectedValue`,void 0),customElements.get(`testclaw-option-card`)||customElements.define(`testclaw-option-card`,q)})))()}function Qt(e){return g`<div class="custodian__option-card">
    <testclaw-option-card
      .props=${{header:e.question.header,question:e.question.question,options:e.question.options.map(e=>({value:e.label,label:e.label,description:e.description,recommended:e.recommended})),disabled:e.disabled,onSelect:e.onSelect,onSkip:e.onSkip}}
    ></testclaw-option-card>
  </div>`}function $t(){return($t=e((()=>{v(),Zt()})))()}function en(e){if(!e||typeof e!=`object`)return null;let t=s(e.id),n=s(e.header),r=s(e.question);if(!t||!n||!r||!Array.isArray(e.options)||e.options.length<2||e.options.length>4)return null;let i=[];for(let t of e.options){let e=s(t?.label);if(!e)return null;let n=s(t.description??null),r=s(t.reply??null);i.push({label:e,...n?{description:n}:{},...t.recommended===!0?{recommended:!0}:{},...r?{reply:r}:{}})}return new Set(i.map(e=>e.label.toLocaleLowerCase())).size!==i.length||i.filter(e=>e.recommended).length>1?null:{id:t,header:n,question:r,options:i,isOther:e.isOther===!0,...e.skipAction===`exit`?{skipAction:`exit`}:{}}}function tn(){return(tn=e((()=>{})))()}function nn(e,t,n,r=null,i=null){return{id:e,role:t,text:n,at:Date.now(),question:r,step:i}}function rn(e,t){let n=t.step??null,r=n?null:en(t.question),i=fn.test(t.reply);return i&&!r&&!n?null:{...nn(e,`assistant`,i?``:t.reply,r,n),optionalWelcome:t.optionalWelcome===!0}}function an(e,t,n,r,i){return r||i||e.some(e=>e.question!==null&&e.question.id!==`system-agent-quick-actions`&&!t.has(`${e.id}:${e.question.id}`)&&!n.has(`${e.id}:${e.question.id}`))}function on(e,t){let n=new Set(t);for(let t of e)t.question&&n.add(`${t.id}:${t.question.id}`);return n}function J(e){return re(e,u(`custodian.requestFailed`))}function sn(e){let t=`msg-${e.id}`,n={role:e.role,content:e.text},r=He(n),i=Ke(n,r);return{kind:`group`,key:t,role:e.role,messages:[{message:n,key:t,hasVisibleContent:i===`non-text`||!!Ue(n,r).trim()}],visibleContent:i,timestamp:e.at,isStreaming:!1}}async function cn(e){try{return{ok:!0,turns:(await e.request(`testclaw.chat.history`,{},{timeoutMs:Y})).turns}}catch(e){return{ok:!1,error:e}}}function ln(e,t){let n=t;return{messages:e.map(e=>({id:n++,role:e.role,text:e.role===`user`&&e.text===mn?u(`custodian.sensitiveReply`):e.text,at:e.at,question:null,step:null})),nextMessageId:n}}function un(e,t){return e.id===t?ht({kind:`divider`,key:`custodian-earlier`,label:u(`custodian.earlier`),timestamp:e.at}):_}function dn(e){let t=e.message.question,n=e.message.step;return g`
    ${e.message.text?lt(sn(e.message),{showReasoning:!1,showToolCalls:!1,assistantName:u(`custodian.title`),agentId:st}):_}
    ${un(e.message,e.boundaryAfterId)}
    ${e.showQuestion&&t?Qt({question:t,disabled:e.questionDisabled,onSelect:e.onSelect,onSkip:e.onSkip}):_}
    ${e.showWizardStep&&n?g`<section
            class="custodian__wizard-step"
            aria-label=${ge(n.title??n.message,`Setup`)}
          >
            ${n.title?g`<strong class="custodian__wizard-title"
                    >${ge(n.title)}</strong
                  >`:_}
            ${_t({step:n,value:e.wizardValue,busy:e.wizardDisabled,inputId:`custodian-wizard-input-${e.message.id}`,sensitiveRevealed:e.wizardSecretVisible,onValueChange:e.onWizardValueChange,onAnswer:e.onWizardAnswer,leadingAction:e.showWizardCancel?g`<button
                    class="btn btn--ghost custodian__wizard-cancel"
                    type="button"
                    ?disabled=${e.wizardDisabled}
                    @click=${e.onWizardCancel}
                  >
                    ${u(`custodian.cancel`)}
                  </button>`:void 0,onToggleSensitiveVisibility:e.onToggleWizardSecretVisibility})}
          </section>`:_}
  `}var Y,fn,pn,mn;function X(){return(X=e((()=>{v(),ct(),w(),vt(),m(),Ge(),Ve(),We(),f(),pe(),dt(),ut(),$t(),tn(),Y=15e3,fn=/^\s*NO_REPLY\s*$/,pn=class{constructor(e,t){this.onStatusChange=e,this.getGatewaySnapshot=t,this.status=T(),this.generation=0,this.recoveryPending=!1,this.inFlight=null}get refreshing(){return this.inFlight!==null}deferRecovery(){this.recoveryPending=!0}clearRecovery(){this.recoveryPending=!1}settleRecovery(e,t){this.recoveryPending&&!e&&(this.clearRecovery(),t())}watchAvailability(e){let t=this.getGatewaySnapshot();return()=>{let n=this.getGatewaySnapshot(),r=n&&h(n)&&(!t||!h(t));t=n,r&&this.recover(e)}}async recover(e){let t=this.generation;await this.inFlight?.promise;let n=this.getGatewaySnapshot();t===this.generation&&n&&h(n)&&(this.status.awaitingGateway||this.status.error!==null)&&e()}invalidate(){this.generation+=1,this.inFlight=null}reset(){this.clearRecovery(),this.invalidate(),this.status=T()}async read(e,t,n){let r=this.inFlight;if(r&&r.client===e&&r.epoch===t)return await r.promise,null;let i=++this.generation;this.status=$e(this.status,{clearError:!1});let a=cn(e);this.inFlight={client:e,epoch:t,promise:a},this.onStatusChange();try{let e=await a;return!n()||i!==this.generation?null:(this.status=e.ok?Ye():nt(this.status,e.error,this.getGatewaySnapshot()),e)}finally{this.inFlight?.promise===a&&(this.inFlight=null,this.onStatusChange())}}async loadMessages(e,t,n,r){this.clearRecovery();let i=await this.read(e,t,r);return i?.ok&&r()?ln(i.turns,n):null}},mn=`<redacted secret>`})))()}var hn,gn,Z;function Q(){return(Q=e((()=>{m(),x(),N(),P(),R(),Ut(),ne(),H(),Jt(),L(),K(),X(),hn=19e4,gn=class{constructor(){this.messages=[],this.sending=!1,this.sensitive=!1,this.wizardInputPending=!1,this.wizardSecretVisible=!1,this.questionReplyUncertain=!1,this.error=null,this.transcript=new pn(()=>this.emit(),()=>this.context?.gateway.snapshot),this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.activeClient=null,this.chatAvailable=!1,this.eventNudge=null,this.eventNudgePending=null,this.eventNudgeClosed=!1,this.channelOnboardingNudgeClosed=!1,this.earlierBoundaryAfterId=null,this.abandonedTurnOutcomeUnknown=!1,this.inferenceState=`unverified`,this.inputDrafts=new M,this.context=null,this.variant=`caretaker`,this.sessionVariant=null,this.restoredIdentity=Ht(),this.sessionId=this.restoredIdentity.sessionId,this.rejoinBarrierPending=this.restoredIdentity.restored,this.requestEpoch=0,this.requestAbort=null,this.nextMessageId=1,this.retryParams=null,this.sessionClient=null,this.sessionOwnershipKey=null,this.sessionOwner=new se,this.sessionStarted=!1,this.configuredInferenceState=`unresolved`,this.gatewayCleanup=null,this.agentCleanup=null,this.eventCleanup=null,this.listeners=new Set}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}connect(e,t){let n=this.context!==e;if(n||this.variant!==t){if(n){this.gatewayCleanup?.(),this.agentCleanup?.(),this.eventCleanup?.(),this.context=e,this.inputDrafts.connect(e,()=>this.emit());let t=this.transcript.watchAvailability(()=>void this.refreshTranscriptIfIdle());this.gatewayCleanup=e.gateway.subscribe(()=>{t(),this.synchronizeClient(),this.emit()}),this.agentCleanup=e.agents.subscribe(()=>{this.synchronizeClient(),this.emit()}),this.eventCleanup=e.gateway.subscribeEvents(e=>It(this,e))}this.variant=t,this.synchronizeClient(),this.emit()}}get input(){return this.inputDrafts[this.sensitive?`sensitive`:`ordinary`].value}set input(e){this.inputDrafts[this.sensitive?`sensitive`:`ordinary`]={value:e}}setInput(e){this.input=e,this.emit()}setWizardValue(e){this.wizardValue=e,this.emit()}toggleWizardSecretVisibility(){this.wizardSecretVisible=!this.wizardSecretVisible,this.emit()}hasRealUserTurn(){return this.messages.some(e=>e.role===`user`)}get activeVariant(){return this.variant}hasUnresolvedQuestion(){return an(this.messages,this.dismissedQuestions,this.answeredQuestions,this.wizardInputPending,this.questionReplyUncertain)}get transcriptBlocked(){return this.sending||this.hasUnresolvedQuestion()||this.transcript.refreshing}async refreshTranscriptIfIdle(){let e=this.activeClient;if(e&&this.sessionStarted&&this.chatAvailable){if(this.transcriptBlocked){(this.transcript.status.awaitingGateway||this.transcript.status.error!==null)&&this.transcript.deferRecovery();return}await this.refreshTranscriptHistory(e,this.requestEpoch)&&this.abandonedTurnOutcomeUnknown&&(this.abandonedTurnOutcomeUnknown=!1,this.emit())}}canRetry(){return this.retryParams!==null&&!G(this.retryParams)}get setupRequired(){return this.configuredInferenceState===`required`}get canSend(){return this.activeClient!==null&&this.chatAvailable&&!this.sending&&(this.configuredInferenceState===`ready`||this.configuredInferenceState===`utility`)&&this.inferenceState===`ready`}get wizardCancelAvailable(){return qt(this.context)}retry(){let e=this.activeClient,t=this.retryParams;e&&t&&!G(t)&&this.chatAvailable&&!this.sending&&this.initializeSession(e,t,!1)}async send(e,t,n=this.hasUnresolvedQuestion(),r){let i=e??this.input,a=this.sensitive?i:i.trim(),o=this.activeClient;if(!a.trim()||!o||!this.canSend)return this.emit(),`rejected`;let s=this.sensitive?u(`custodian.sensitiveReply`):t??a,c={sessionId:this.sessionId,...W(this.variant,a,this.inputDrafts.pluginReference)};return await this.sendUserTurn(o,c,s,n,()=>r&&(!r.isCurrent()||!r.admit())?!1:(e===void 0&&(this.input=``),!0))}async sendUserTurn(e,t,n,r,i){let a=[this.answeredQuestions,this.questionReplyUncertain],o,s=await this.requestReply(e,t,()=>{let e=this.inputDrafts.ordinary;if(i&&!i())return!1;let t=this.inputDrafts.ordinary;this.inputDrafts.resetPrompt(this,this.sensitive),o=this.requestEpoch,r&&(this.questionReplyUncertain=!0),this.abandonedTurnOutcomeUnknown=!1,this.answeredQuestions=on(this.messages,this.answeredQuestions);let s=nn(this.nextMessageId++,`user`,n);return this.messages=[...this.messages,s],()=>{this.messages=this.messages.filter(e=>e!==s),this.answeredQuestions=a[0],e!==t&&this.inputDrafts.ordinary===t&&(this.inputDrafts.ordinary=e)}});return r&&this.requestEpoch===o&&(this.questionReplyUncertain=wt(a[1],s),s===`rejected`&&(this.answeredQuestions=a[0]),this.emit()),s}requestNudgeUpdate(){this.emit()}sendEventNudge(){return Lt(this)}dismissEventNudge(){Rt(this)}dismissChannelOnboardingNudge(){zt(this,()=>this.context?.replace(`custodian`))}openChannelsFromOnboarding(){Bt(this,()=>this.revokeNavigationAuthority(),()=>this.context?.navigate(`channels`))}async dismissQuestion(e){let t=e.question;if(t){if(t.skipAction===`exit`){this.exitSetup();return}await this.send(t.isOther?u(`optionCard.skip`):`cancel`,u(`optionCard.skip`),!0)!==`rejected`&&this.messages.includes(e)&&(this.dismissedQuestions=new Set(this.dismissedQuestions).add(`${e.id}:${t.id}`),this.emit())}}answerQuestion(e,t){let n=e.question;if(!n)return;let r=n.options.find(e=>e.label===t);this.send(r?.reply??t,t,!0)}answerWizardStep(e,t){if(!e.step||!this.wizardInputPending)return;let n=Gt(e.step,t),r=this.activeClient;if(!n||!r||!this.canSend){this.emit();return}let i=e.step.sensitive?u(`custodian.sensitiveReply`):n.display;this.sendUserTurn(r,{sessionId:this.sessionId,wizardAnswer:n.answer},i,!0)}cancelWizardStep(e){let t=e.step,n=this.activeClient;if(!t||!this.wizardInputPending||!n||!this.canSend||!this.wizardCancelAvailable){this.emit();return}this.sendUserTurn(n,{sessionId:this.sessionId,wizardCancel:{stepId:t.id}},u(`custodian.cancel`),!0)}exitSetup(e=`chat`){this.revokeNavigationAuthority(),xt(this.context,e,this.configuredInferenceState)}revokeNavigationAuthority(){this.requestAbort?.abort(),this.requestAbort=null,this.transcript.clearRecovery(),this.advanceRequestEpoch(),this.sending=!1,this.questionReplyUncertain=!1,this.retryParams=null,this.error=null}advanceRequestEpoch(){return this.transcript.invalidate(),++this.requestEpoch}emit(){this.inputDrafts.reconcile(this),this.transcript.settleRecovery(this.transcriptBlocked,()=>void this.refreshTranscriptIfIdle());for(let e of this.listeners)e()}startSession(e,t){this.sessionVariant=this.variant,this.sessionClient=e,this.sessionOwnershipKey=this.sessionOwner.key(this.context?.gateway??null),this.sessionStarted=!0,this.initializeSession(e,{sessionId:this.sessionId,...W(this.variant)},t)}replaceSessionId(e){e===void 0&&(this.rejoinBarrierPending=!1),this.sessionId=e??z(),B(this.sessionId)}abandonPendingUserTurn(e){e&&G(e)&&(this.retryParams=null,this.abandonedTurnOutcomeUnknown=!0)}restartVolatileSession(e){this.replaceSessionId(),this.answeredQuestions=on(this.messages,this.answeredQuestions),this.inputDrafts.resetPrompt(this,!1),this.wizardInputPending=this.questionReplyUncertain=!1,this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.startSession(e,!1)}synchronizeClient(){let e=this.context;if(!e)return;let t=e.gateway.snapshot,n=t.phase===`connected`?t.client:null,r=n!==null&&S(t,`testclaw.chat`,`operator.admin`),i=C(t,`testclaw.chat`)===!1,a=Wt(this.context),o=a!==this.configuredInferenceState;this.configuredInferenceState=a;let s=this.sessionStarted&&this.sessionVariant!==this.variant,c=this.sessionOwner.key(e.gateway),l=this.sessionStarted&&n!==null&&this.activeClient===null,d=this.sessionStarted&&n!==null&&this.sessionClient!==null&&n!==this.sessionClient,f=this.sessionOwnershipKey!==null&&c!==this.sessionOwnershipKey;if(n===this.activeClient&&!s&&!d&&!f&&this.chatAvailable===(r&&a!==`unresolved`)&&!o)return;let p=this.sending&&this.retryParams!==null,m=p?this.retryParams:null;if((n!==this.activeClient||f)&&this.transcript.clearRecovery(),this.activeClient=n,this.advanceRequestEpoch(),this.sending=!1,this.chatAvailable=!1,s||f)f&&this.replaceSessionId(),[this.eventNudge,this.eventNudgePending]=[null,null],this.eventNudgeClosed=!1,this.abandonedTurnOutcomeUnknown=!1,this.sessionStarted=!1,this.clearConversation();else if(n&&(d||l)){if(!r){this.sessionStarted=!1,this.abandonPendingUserTurn(m),this.error=i?u(`custodian.unsupportedGateway`):null;return}this.chatAvailable=!0,this.abandonPendingUserTurn(m),this.requestAbort?.abort(),this.requestAbort=null,this.sessionClient=n,this.sessionOwnershipKey=c,this.questionReplyUncertain||this.abandonedTurnOutcomeUnknown?(this.questionReplyUncertain=!1,this.wizardInputPending=!1,this.abandonedTurnOutcomeUnknown=!1,this.rejoinBarrierPending=!0,this.initializeSession(n,{sessionId:this.sessionId,...W(this.variant)})):this.refreshTranscriptIfIdle();return}else p&&(m?.message===void 0&&(this.error=u(`custodian.connectionChanged`)),this.abandonPendingUserTurn(m));if(n){if(!r){this.error=i?u(`custodian.unsupportedGateway`):null;return}if(a!==`unresolved`){if(this.chatAvailable=!0,a===`required`){this.sessionStarted=!1,this.clearConversation();return}if(this.sessionStarted){this.retryParams||(this.error=p?this.error:null);return}this.clearConversation(!0),this.startSession(n,!0)}}}async initializeSession(e,t,n=!0){let r=this.advanceRequestEpoch();this.sending=!0,this.inferenceState=`unverified`,this.error=null,this.retryParams=t,this.emit(),n&&await this.refreshTranscriptHistory(e,r),r===this.requestEpoch&&e===this.activeClient&&await this.requestReply(e,t)}async refreshTranscriptHistory(e,t){let n=this.context;if(!n||C(n.gateway.snapshot,`testclaw.chat.history`)!==!0)return!1;let r=await this.transcript.loadMessages(e,t,this.nextMessageId,()=>t===this.requestEpoch&&e===this.activeClient);return r?([this.messages,this.nextMessageId]=[r.messages,r.nextMessageId],this.earlierBoundaryAfterId=this.messages.at(-1)?.id??null,this.emit(),!0):!1}clearConversation(e=!1){this.messages=[],this.dismissedQuestions=new Set,this.answeredQuestions=new Set,this.retryParams=null,this.error=null,this.transcript.reset(),this.inferenceState=`unverified`,e||(this.inputDrafts.ordinary={value:``}),this.inputDrafts.resetPrompt(this,!1),this.wizardInputPending=this.questionReplyUncertain=!1,this.earlierBoundaryAfterId=null}async requestReply(e,t,n){let r=this.context;if(!r)return`rejected`;let i=()=>e===this.activeClient&&r.gateway.snapshot.client===e&&S(r.gateway.snapshot,`testclaw.chat`,`operator.admin`);if(!i())return`rejected`;this.requestAbort?.abort();let a=new AbortController;this.requestAbort=a;let o=this.advanceRequestEpoch(),s=`unsent`,c;this.sending=!0,this.error=null,this.retryParams=t,this.emit();try{if(o!==this.requestEpoch||!i()||(c=n?.())===!1)return this.retryParams===t&&(this.retryParams=null),`rejected`;let l=e.request(`testclaw.chat`,t,{timeoutMs:hn,onSent:()=>{s=`sent`},signal:a.signal});this.emit();let u=await l;if(s=`received`,o!==this.requestEpoch||e!==this.activeClient||(this.replaceSessionId(u.sessionId),this.inputDrafts.resetPrompt(this,u.sensitive===!0),this.wizardInputPending=u.wizardInputPending===!0,this.retryParams=null,this.inferenceState=`ready`,this.rejoinBarrierPending&&!G(t)&&(this.rejoinBarrierPending=!1,await this.refreshTranscriptHistory(e,o),o!==this.requestEpoch||e!==this.activeClient)))return`sent`;this.wizardValue=u.step?Kt(u.step):void 0;let d=rn(this.nextMessageId,u);return d&&(this.nextMessageId+=1,this.messages=[...this.messages,d]),u.handoff?.kind===`model-accounts`?this.exitSetup(`profile`):u.action===`open-agent`?await St({context:r,...u.agentId?{agentId:u.agentId}:{},hatchDraft:u.agentDraft===`hatch`,isCurrent:()=>o===this.requestEpoch&&e===this.activeClient})===`exit-setup`&&this.exitSetup():u.action===`exit`&&this.exitSetup(),`sent`}catch(n){if(o===this.requestEpoch&&e===this.activeClient){s===`unsent`&&c&&c(),this.error=J(n);let{inferenceUnavailable:r,sessionInvalidated:i}=Xt(n);r&&(this.inferenceState=`unverified`,this.retryParams={sessionId:this.sessionId,...W(this.variant)}),i&&G(t)?(this.restartVolatileSession(e),this.error=u(`custodian.sessionRestarted`,{error:J(n)})):i&&(this.replaceSessionId(),this.retryParams={...t,sessionId:this.sessionId},this.error=u(`custodian.sessionRestarted`,{error:J(n)}))}return G(t)&&this.retryParams===t&&(this.retryParams=null),Ct(n,s)}finally{this.requestAbort===a&&(this.requestAbort=null),o===this.requestEpoch&&(this.sending=!1),this.emit()}}},Z=new gn})))()}function _n(){return(_n=e((()=>{})))()}function vn(e,t,n){e.kind===`navigate`?t.navigate(e.routeId):n&&je({startGatewayUpdate:()=>void t.overlays.runUpdate(),watchUpdateProgress:Oe(t),onAcknowledge:()=>t.overlays.acknowledgeUpdateRun(),onCheckStatus:()=>t.overlays.refreshUpdateStatus(),onReviewUpdate:()=>t.navigate(`updates`),updateAvailable:t.overlays.snapshot.updateAvailable,updateSchedule:t.overlays.snapshot.updateSchedule,viaNativeApp:Me()})}function yn(e){let{action:t}=e.alert,n=S(e.context.gateway.snapshot,`update.run`,`operator.admin`),r=t?.target.kind===`update`&&!n;return g`<article class="custodian__nudge custodian__alert-card" role="status">
    <div class="custodian__alert-heading">
      <strong>${e.alert.title}</strong>
      <button
        class="custodian__nudge-dismiss"
        type="button"
        aria-label=${u(`common.dismiss`)}
        @click=${e.onDismiss}
      >
        ×
      </button>
    </div>
    <ul class="custodian__alert-facts">
      ${e.alert.facts.map(e=>g`<li>${e}</li>`)}
    </ul>
    ${t?g`<button
            class="btn btn--sm primary custodian__alert-action"
            type="button"
            title=${r?u(`updates.adminRequired`):_}
            ?disabled=${r}
            @click=${()=>vn(t.target,e.context,n)}
          >
            ${t.label}
          </button>`:_}
  </article>`}function bn(){return(bn=e((()=>{v(),Pe(),Ae(),m(),x()})))()}var $;function xn(){return(xn=e((()=>{n(),v(),y(),we(),be(),Xe(),Je(),et(),w(),qe(),m(),Be(),p(),le(),pt(),bn(),gt(),Q(),L(),D(),K(),X(),ze(),$=class extends d{constructor(){super(),this.store=Z,this.onboarding=!1,this.newAgentIntent=!1,this.showChannelOnboardingNudge=!1,this.channelOnboardingError=null,this.channelOnboardingRetrying=!1,this.onRetryChannelOnboarding=()=>void 0,this.compact=!1,this.historyContent=_,this.composerTextarea=null,this.lastMessageId=null,this.lastPluginHelpFocus=0,new fe(this).watch(()=>this.store,(e,t)=>e.subscribe(t)).watch(()=>k,(e,t)=>e.subscribe(t))}async getUpdateComplete(){let e=await super.getUpdateComplete();return await Promise.all(Array.from(this.querySelectorAll(`testclaw-option-card`)).map(e=>e.updateComplete)),e}willUpdate(){this.store.connect(this.context,Yt(this.onboarding,this.newAgentIntent))}disconnectedCallback(){this.composerTextarea&&=(O(this.composerTextarea),null),super.disconnectedCallback()}updated(){let e=this.store,t=this.querySelector(`textarea`);this.composerTextarea&&this.composerTextarea!==t&&O(this.composerTextarea),this.composerTextarea=t,t&&(mt(t),ft(t)),e.canSend&&!e.sensitive&&!e.hasUnresolvedQuestion()&&k.askIfReady((t,n,r)=>void e.send(t,r,!1,n));let n=it(this.context);n>0&&n!==this.lastPluginHelpFocus&&!e.sensitive&&!e.wizardInputPending&&e.chatAvailable&&(this.lastPluginHelpFocus=n,t?.focus());let r=this.querySelector(`.custodian__messages`),i=this.store.messages.at(-1)?.id??null;if(i!==this.lastMessageId){this.lastMessageId=i;let e=r?.lastElementChild;e instanceof HTMLElement&&e.scrollIntoView?.({block:`nearest`})}}handleComposerKeydown(e){e.key!==`Enter`||e.shiftKey||e.isComposing||(e.preventDefault(),this.store.send())}render(){let e=this.store,t=E(this.context),n=t?u(`custodian.pluginPlaceholder`,{plugin:t.name}):u(`custodian.placeholder`),r=k.alert?yn({alert:k.alert,context:this.context,onDismiss:()=>k.dismiss()}):_;if(e.setupRequired)return g`
        <section
          class="custodian-surface custodian-surface--setup-required ${this.compact?`custodian-surface--panel`:``}"
        >
          ${r}
          <div class="custodian__setup-state" role="alert">
            <testclaw-mascot mood="idle" .size=${this.compact?72:96}></testclaw-mascot>
            <h2>${u(`modelSetup.required.title`)}</h2>
            <p>${u(`modelSetup.required.body`)}</p>
            <div class="custodian__setup-actions">
              <button
                class="btn primary"
                type="button"
                @click=${()=>e.exitSetup(`model-setup`)}
              >
                ${u(`modelSetup.required.action`)}
              </button>
            </div>
          </div>
        </section>
      `;let i=e.messages.length===0&&e.error!==null&&!e.sending,a=e.wizardInputPending?e.messages.findLast(e=>e.step!==null):void 0,o=t&&e.activeVariant===`caretaker`&&!e.sensitive&&!e.hasUnresolvedQuestion(),s=o&&!e.hasRealUserTurn(),c=s?ot(this.context,t):void 0;return g`
      <section
        class="custodian-surface ${this.compact?`custodian-surface--panel`:``} ${i?`custodian-surface--empty-error`:``}"
      >
        <div
          class="custodian__messages"
          ${tt()}
          aria-live="polite"
          @click=${e=>{rt(e),Qe(e)}}
        >
          ${r}
          ${this.channelOnboardingError?At({retrying:this.channelOnboardingRetrying,onRetry:this.onRetryChannelOnboarding,onDismiss:()=>e.dismissChannelOnboardingNudge()}):this.showChannelOnboardingNudge?kt({onOpenChannels:()=>e.openChannelsFromOnboarding(),onDismiss:()=>e.dismissChannelOnboardingNudge()}):_}
          ${!this.onboarding&&e.eventNudge&&!e.eventNudgePending?Ot({nudge:e.eventNudge,disabled:!e.canSend||e.sensitive||e.hasUnresolvedQuestion(),onSend:()=>void e.sendEventNudge(),onDismiss:()=>e.dismissEventNudge()}):_}
          ${s?g`<div class="custodian__plugin-intro">
                  <h2>${u(`custodian.pluginIntroTitle`,{plugin:t.name})}</h2>
                  <div class="custodian__plugin-starters">
                    ${[{label:u(`custodian.pluginStarterPurpose`),prompt:u(`custodian.pluginPromptPurpose`,{plugin:t.name})},{label:u(`custodian.pluginStarterTools`),prompt:u(`custodian.pluginPromptTools`,{plugin:t.name})},{label:u(`custodian.pluginStarterSetup`),prompt:u(`custodian.pluginPromptSetup`,{plugin:t.name})}].map(({label:e,prompt:t})=>g`<button
                        class="btn"
                        type="button"
                        @click=${()=>void c?.({question:t})}
                      >
                        ${e}
                      </button>`)}
                  </div>
                </div>`:_}
          ${e.messages.filter(e=>!o||!e.optionalWelcome).map(t=>{let n=t.question?`${t.id}:${t.question.id}`:``,r=t.question!==null&&!e.dismissedQuestions.has(n);return dn({message:t,boundaryAfterId:e.earlierBoundaryAfterId,showQuestion:r,questionDisabled:!e.canSend||e.answeredQuestions.has(n),onSelect:n=>e.answerQuestion(t,n),onSkip:()=>void e.dismissQuestion(t),showWizardStep:t===a,wizardValue:e.wizardValue,wizardDisabled:!e.canSend,wizardSecretVisible:e.wizardSecretVisible,onWizardValueChange:t=>e.setWizardValue(t),onWizardAnswer:n=>e.answerWizardStep(t,n),showWizardCancel:e.wizardCancelAvailable,onWizardCancel:()=>e.cancelWizardStep(t),onToggleWizardSecretVisibility:()=>e.toggleWizardSecretVisibility()})})}
          ${e.sending?g`<div class="chat-group assistant custodian__thinking-row" role="status">
                  <div class="chat-avatar assistant custodian__mascot-avatar" aria-hidden="true">
                    <testclaw-mascot mood="thinking" .size=${26}></testclaw-mascot>
                  </div>
                  <div class="chat-group-messages custodian__thinking">
                    <span></span><span></span><span></span>
                    <span class="sr-only">${u(`custodian.thinking`)}</span>
                  </div>
                </div>`:_}
          ${e.abandonedTurnOutcomeUnknown?g`<div class="custodian__error" role="alert">
                  <span>${u(`custodian.connectionChanged`)}</span>
                </div>`:_}
          ${Ze({status:e.transcript.status,className:`custodian__transcript-status`})}
          ${e.error&&!(e.abandonedTurnOutcomeUnknown&&e.error===u(`custodian.connectionChanged`))?g`<div class="custodian__error" role="alert">
                  <span>${e.error}</span>
                  ${e.activeClient&&e.chatAvailable&&e.canRetry()?g`<button
                          class="btn btn--sm"
                          type="button"
                          @click=${()=>e.retry()}
                        >
                          ${u(`common.retry`)}
                        </button>`:_}
                </div>`:_}
        </div>

        ${this.historyContent}
        ${a?_:g`<div class="agent-chat__composer-shell">
                <div class="agent-chat__input">
                  <div class="agent-chat__composer-input-row">
                    <div class="agent-chat__composer-combobox">
                      ${e.sensitive?g`<input
                              type="password"
                              .value=${e.input}
                              autocomplete="off"
                              placeholder=${u(`custodian.sensitivePlaceholder`)}
                              aria-label=${u(`custodian.sensitivePlaceholder`)}
                              ?disabled=${!e.canSend}
                              @input=${t=>e.setInput(t.target.value)}
                              @keydown=${e=>this.handleComposerKeydown(e)}
                            />`:g`<textarea
                              rows="1"
                              .value=${e.input}
                              autocomplete="on"
                              placeholder=${n}
                              aria-label=${n}
                              ?disabled=${!e.chatAvailable}
                              @input=${t=>e.setInput(t.target.value)}
                              @keydown=${e=>this.handleComposerKeydown(e)}
                            ></textarea>`}
                      <span class="agent-chat__composer-placeholder" aria-hidden="true"
                        >${e.sensitive?u(`custodian.sensitivePlaceholder`):n}</span
                      >
                    </div>
                    <div class="agent-chat__composer-actions">
                      <button
                        class="chat-send-btn"
                        type="button"
                        aria-label=${u(`custodian.send`)}
                        ?disabled=${!e.input.trim()||!e.canSend}
                        @click=${()=>void e.send()}
                      >
                        ${ye.arrowUp}
                        <span class="agent-chat__control-label">${u(`custodian.send`)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>`}
      </section>
    `}},c([o({context:ve,subscribe:!0})],$.prototype,`context`,void 0),c([b({attribute:!1})],$.prototype,`store`,void 0),c([b({attribute:!1})],$.prototype,`onboarding`,void 0),c([b({attribute:!1})],$.prototype,`newAgentIntent`,void 0),c([b({attribute:!1})],$.prototype,`showChannelOnboardingNudge`,void 0),c([b({attribute:!1})],$.prototype,`channelOnboardingError`,void 0),c([b({attribute:!1})],$.prototype,`channelOnboardingRetrying`,void 0),c([b({attribute:!1})],$.prototype,`onRetryChannelOnboarding`,void 0),c([b({attribute:!1})],$.prototype,`compact`,void 0),c([b({attribute:!1})],$.prototype,`historyContent`,void 0),customElements.get(`testclaw-custodian-surface`)||customElements.define(`testclaw-custodian-surface`,$)})))()}export{Q as i,_n as n,Z as r,xn as t};
//# sourceMappingURL=custodian-surface-BxF2qnaR.js.map