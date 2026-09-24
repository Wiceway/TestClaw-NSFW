const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./user-prefs-request-Dx0LEDn6.js","./user-prefs-request-PVTPO2Ff.js","./gateway-runtime-BV4hxqU_.js","./control-ui-core-CBmGCeuQ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,Jr as n,aa as r,eo as i,ia as a,qr as o,ti as s}from"./control-ui-foundation-CGMdhB5v.js";import{$l as c,Ac as l,Bl as u,Bs as ee,Hl as d,Jl as f,Lc as te,Ml as ne,Pl as re,Rs as p,Uc as ie,Wc as ae,zl as oe}from"./control-ui-core-S9jKXqB5.js";import{$ as m,X as h,Y as g,ct as _,nt as v,ut as y}from"./lit-runtime-DWoPVI38.js";import{Cr as se,Di as b,Dr as x,Dt as ce,Er as le,Fn as ue,In as de,Ln as fe,Oi as S,Or as C,Qa as pe,ba as me,do as he,fo as ge,wa as _e}from"./control-ui-core-G2U4O6rB.js";import{E as ve,O as ye}from"./control-ui-boot-shared-BGGpAWmX.js";import{_t as be,bt as xe,vt as w,yt as T}from"./control-ui-boot-shared-8dYR6CXG.js";import{Fi as Se,Ii as Ce,Pi as we,as as Te,d as E,f as D,is as Ee}from"./control-ui-boot-shared-ooxiG3qa.js";import{Aa as De,At as O,Ct as Oe,Da as ke,Et as k,Gr as Ae,Ki as A,Kr as j,Nt as je,Oa as M,Ot as N,Pt as P,St as Me,Va as Ne,_t as Pe,bt as F,ht as I,kt as Fe,wt as L,yt as R,za as Ie}from"./control-ui-boot-shared-CCYBAAP9.js";import{i as Le,t as Re}from"./wizard-step-controls-BOTgnqix.js";import{o as z,r as B}from"./settings-targets-B7C72q5F.js";import{n as ze,t as Be}from"./settings-workspace-DJAhLnkQ.js";import{a as V,c as H,d as Ve,i as He,l as Ue,n as We,r as Ge,s as Ke,t as qe,u as Je}from"./github-identity-view-B8f4OQ8W.js";var U;function W(){return(W=e((()=>{n(),g(),v(),me(),S(),C(),I(),f(),Je(),ae(),d(),z(),Ue(),qe(),U=class extends u{constructor(...e){super(...e),this.purpose=`personal`,this.setupOpen=!1,this.snapshot=null,this.revision=0,this.canRead=!1,this.canAdmin=!1,this.profileId=null,this.subscriptions=[],this.personal=new H({requestUpdate:()=>this.requestUpdate(),authorizationSucceeded:()=>{this.setupOpen=!1}}),this.system=new H({requestUpdate:()=>this.requestUpdate(),authorizationSucceeded:()=>{this.setupOpen=!1},runExternalMutation:(e,t)=>this.context.runtimeConfig.runExternalMutation(e,t)})}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applySnapshot(e)),this.context.agents.subscribe(()=>this.syncControllers()),this.context.settingsAgentSelection.subscribe(()=>this.syncControllers()),this.context.runtimeConfig.subscribe(()=>this.syncControllers())],this.applySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.personal.dispose(),this.system.dispose(),this.snapshot=null,this.revision+=1,super.disconnectedCallback()}applySnapshot(e){let t=this.snapshot,n=!t||t.client!==e.client||t.phase!==e.phase||t.hello!==e.hello||this.profileId!==(e.selfUser?.id??null);this.snapshot=e,this.profileId=e.phase===`connected`?e.selfUser?.id??null:null,this.canRead=e.phase===`connected`&&!!e.hello?.auth&&le(e.hello?.auth??null),this.canAdmin=this.canRead&&se(e.hello?.auth??null),n&&(this.revision+=1,this.setupOpen=!1,this.purpose=this.profileId?`personal`:`system`),this.syncControllers(),this.canAdmin&&this.context.runtimeConfig.ensureLoaded()}syncControllers(){let e=this.snapshot;if(!e)return;let t={client:e.client,connected:e.phase===`connected`,clientRevision:this.revision};this.personal.sync({...t,target:this.profileId?{kind:`personal`,profileId:this.profileId}:null,statusReadable:this.canRead&&this.profileId!==null,authorizable:this.canRead&&this.profileId!==null,configurable:!1});let n=this.context.settingsAgentSelection.state.selectedId;this.system.sync({...t,target:n?{kind:`shared`,scope:`system`,agentId:n,config:ie(this.context.runtimeConfig.state)}:null,statusReadable:this.canAdmin,authorizable:this.canAdmin,configurable:this.canAdmin}),this.personal.statusReadable&&!this.personal.personal&&!this.personal.loading&&!this.personal.error&&this.personal.verify(),n&&this.canAdmin&&!this.system.status&&!this.system.loading&&!this.system.error&&this.system.verify(),this.requestUpdate()}get locked(){return this.personal.loading||this.system.loading||this.personal.authorizationActive||this.system.authorizationActive||this.personal.busy||this.system.busy}openSetup(e){this.locked||(e===`personal`?!this.profileId||!this.canRead:!this.canAdmin)||(this.purpose=e,this.setupOpen=!0)}render(){let e=this.personal.personal,t=this.system.status?.selected.identity??this.personal.system,n=this.context.settingsAgentSelection.state.selectedId,r=this.context.agents.state.agentsList?.agents?.find(e=>e.id===n),i=this.system.status?.effective??null,a=this.purpose===`personal`?this.personal:this.system,o=this.setupOpen||this.personal.authorizationActive||this.system.authorizationActive,s=e?.state===`connected`,l=e?.state===`unavailable`||e?.refreshState===`expired`||e?.refreshState===`failed`,u=this.profileId?c(l?`githubConnections.reconnectRequired`:s?`githubConnections.connected`:`githubConnections.disconnected`):c(`githubConnections.signInRequired`);return m`<div id=${B.githubConnections}>
      ${N({title:c(`githubConnections.title`),description:c(`githubConnections.description`),actions:this.canRead&&(this.profileId||this.canAdmin)?m`<button
                    class="btn btn--sm"
                    ?disabled=${this.locked||!this.profileId&&!this.system.status}
                    @click=${()=>this.openSetup(this.profileId?`personal`:`system`)}
                  >
                    ${c(`githubConnections.manage`)}
                  </button>
                  <button
                    class="btn btn--sm"
                    ?disabled=${this.locked}
                    @click=${()=>{this.personal.verify(),this.system.verify()}}
                  >
                    ${c(`agentTools.githubVerify`)}
                  </button>`:void 0},m`
          <div data-github-connection="personal">
            ${k({title:c(`githubConnections.mine`),description:this.profileId?m`${e?.account?`@${e.account.login} · `:``}${c(`githubConnections.personalDescription`)}`:c(`githubConnections.unboundDescription`),control:m`${this.profileId&&!e?Ke(this.personal):O({kind:l?`warn`:s?`ok`:`muted`,label:u})}
              ${this.profileId&&this.canRead&&e?m`<button
                      class="btn btn--sm"
                      ?disabled=${this.locked}
                      @click=${()=>this.openSetup(`personal`)}
                    >
                      ${c(s?`githubConnections.changeMine`:`githubConnections.connectMine`)}
                    </button>`:h}`})}
          </div>
          <div data-github-connection="system">
            ${k({title:c(`githubConnections.system`),description:m`${t?.account?`@${t.account.login} · `:``}${c(`githubConnections.systemDescription`)}`,control:m`${V(t,{loading:this.system.loading||this.personal.loading,error:this.system.error??this.personal.error})}${this.canAdmin?m`<button
                      class="btn btn--sm"
                      ?disabled=${this.locked||!this.system.status}
                      @click=${()=>this.openSetup(`system`)}
                    >
                      ${c(`githubConnections.changeSystem`)}
                    </button>`:P(c(`githubConnections.adminManaged`))}`})}
          </div>
          ${this.canAdmin&&n?m`<div data-github-connection="agent">
                  ${k({title:c(`githubConnections.agentFor`,{agent:r?.identity?.name??r?.name??n}),description:m`${i?.account?`@${i.account.login} · `:``}${i?c(i.source===`agent-override`?`githubConnections.agentOverride`:`githubConnections.system`):``}<br />${c(`githubConnections.agentDescription`)}`,control:m`${V(i,this.system)}<button
                        class="btn btn--sm"
                        @click=${()=>this.context.navigate(`agents`,{pathname:_e(n,`tools`,this.context.basePath)})}
                      >
                        ${c(`githubConnections.viewAgent`)}
                      </button>`})}
                </div>`:h}
          ${We(this.personal.error??this.system.error,m`<button
              class="btn btn--sm"
              ?disabled=${this.locked}
              @click=${()=>{this.personal.verify(),this.system.verify()}}
            >
              ${c(`common.retry`)}
            </button>`)}
          ${o?m`<div class="settings-subrows" data-github-setup>
                  ${k({title:c(`githubConnections.purpose`),control:this.profileId&&this.canAdmin&&this.system.status?Fe({value:this.purpose,options:[{value:`personal`,label:c(`githubConnections.forMe`)},{value:`system`,label:c(`githubConnections.forSystem`)}],disabled:this.locked,ariaLabel:c(`githubConnections.purpose`),onChange:e=>this.openSetup(e)}):P(this.purpose===`personal`?c(`githubConnections.forMe`):c(`githubConnections.forSystem`))})}
                  ${Ge(a)}
                  ${this.locked?h:k({title:c(`githubConnections.purposeHint`),control:m`<button
                            class="btn btn--sm"
                            @click=${()=>{this.setupOpen=!1,a.hidePatFallback()}}
                          >
                            ${c(`common.close`)}
                          </button>`})}
                </div>`:h}
          <details class="settings-row settings-row--stacked">
            <summary class="settings-row__title">${c(`githubConnections.usage`)}</summary>
            <div class="settings-row__desc">${c(`githubConnections.usageDescription`)}</div>
            ${He(t)}
          </details>
          ${this.canAdmin&&this.system.status?.selected.configured?k({title:c(`agentTools.githubUseNativeNewRuns`),description:c(`agentTools.githubSystemMutationHint`),control:m`<button
                    class="btn btn--sm"
                    ?disabled=${this.locked}
                    @click=${()=>void this.system.inherit()}
                  >
                    ${c(`agentTools.githubUseNativeNewRuns`)}
                  </button>`}):h}
        `)}
      ${this.profileId&&this.canRead&&e&&e.state!==`disconnected`?N({danger:!0},k({title:c(`githubConnections.disconnectMine`),description:c(`githubConnections.disconnectDescription`),control:m`<button
                  class="btn btn--sm"
                  ?disabled=${this.locked}
                  @click=${()=>void this.personal.disconnect()}
                >
                  ${c(`githubConnections.disconnectMine`)}
                </button>`})):h}
    </div>`}},s([o({context:b,subscribe:!1})],U.prototype,`context`,void 0),s([_()],U.prototype,`purpose`,void 0),s([_()],U.prototype,`setupOpen`,void 0),customElements.get(`testclaw-github-connections`)||customElements.define(`testclaw-github-connections`,U),Ve()})))()}function Ye(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw new X(`invalid-image`);let n=Math.min(e,t),r=Math.min(1,K/n);return{sourceEdge:n,sourceX:Math.max(0,Math.round((e-n)/2)),sourceY:Math.max(0,Math.round((t-n)/2)),edge:Math.max(1,Math.round(n*r))}}async function Xe(e){let t=URL.createObjectURL(e);try{let e=new Image;return e.decoding=`async`,e.src=t,await e.decode(),e}catch{throw new X(`invalid-image`)}finally{URL.revokeObjectURL(t)}}function G(e,t,n){return new Promise(r=>{e.toBlob(r,t,n)})}function Ze(e){let t=[];for(let n=0;n<e.length;n+=32768)t.push(String.fromCharCode(...e.subarray(n,n+32768)));return btoa(t.join(``))}async function Qe(e,t){if(e.size>q)throw new X(`too-large`);let n=new Uint8Array(await e.arrayBuffer()),r=Ze(n);if(r.length>J)throw new X(`too-large`);return{mime:t,avatarBase64:r,byteLength:n.byteLength}}async function $e(e){if(![`image/png`,`image/jpeg`,`image/webp`].includes(e.type))throw new X(`invalid-image`);if(e.size>Y)throw new X(`source-too-large`);let t=await Xe(e),n=Ye(t.naturalWidth,t.naturalHeight),r=document.createElement(`canvas`);r.width=n.edge,r.height=n.edge;let i=r.getContext(`2d`);if(!i)throw new X(`invalid-image`);i.drawImage(t,n.sourceX,n.sourceY,n.sourceEdge,n.sourceEdge,0,0,n.edge,n.edge);let a=e.type===`image/webp`?`image/webp`:`image/png`,o=await G(r,a,a===`image/webp`?.9:void 0);if((!o||o.type!==a||o.size>q)&&(a=`image/webp`,o=await G(r,a,.82)),!o||o.type!==a)throw new X(`invalid-image`);return Qe(o,a)}var K,q,J,Y,X;function et(){return(et=e((()=>{K=512,q=524288,J=7e5,Y=10485760,X=class extends Error{constructor(e){super(e),this.code=e,this.name=`ProfileAvatarError`}}})))()}function tt(e){return e.target.value}function nt(e){try{let t=new URL(e);return`${t.origin}${t.pathname}`}catch{return c(`profilePage.modelAccounts.gatewayUnavailable`)}}function rt(e,t){return e.some(e=>e.authProfileId!==t.authProfileId&&e.provider===t.provider&&e.label===t.label)?m` <code>${t.authProfileId}</code>`:``}function it(e,t){let n=e.accounts.find(e=>e.authProfileId===t.authProfileId);return k({title:m`
      <span class="model-accounts__id"
        >${n?.label??c(`profilePage.modelAccounts.gatewayAccount`)}</span
      >
      <span class="model-accounts__provider">${M(t.provider)}</span>
    `,description:m`${c(`profilePage.modelAccounts.linkedDescription`)}${n?rt(e.accounts,n):``}`,control:m`
      ${O({kind:`ok`,label:c(`profilePage.modelAccounts.linkedStatus`)})}
      <button
        type="button"
        class="btn btn--sm profile-auth-link-unlink"
        aria-label=${`${c(`profilePage.modelAccounts.unlinkAction`)}: ${M(t.provider)} · ${n?.label??t.authProfileId}`}
        ?disabled=${e.busy}
        @click=${()=>e.onUnlink(t.provider)}
      >
        ${c(`profilePage.modelAccounts.unlinkAction`)}
      </button>
    `})}function at(e,t){return k({title:m`
      <span class="model-accounts__id">${t.label}</span>
      <span class="model-accounts__provider">${M(t.provider)}</span>
    `,description:m`${c(`profilePage.modelAccounts.authTypes.${t.authType}`)}${rt(e.accounts,t)}`,control:m`
      <button
        type="button"
        class="btn btn--sm profile-auth-account-select"
        data-auth-profile-id=${t.authProfileId}
        aria-label=${`${c(`profilePage.modelAccounts.selectAction`)}: ${M(t.provider)} · ${t.label} (${t.authProfileId})`}
        ?disabled=${e.busy}
        @click=${()=>e.onSelectAccount(t.authProfileId)}
      >
        ${c(`profilePage.modelAccounts.selectAction`)}
      </button>
    `})}function ot(e){let t=e.signIn;if(!t)return``;let n=t.providers.find(e=>e.id===t.provider),r=e.connectFlow,i=r?.step,a=m`<button
    type="button"
    class="btn btn--sm profile-auth-connect-cancel"
    ?disabled=${e.cancelBusy}
    @click=${r?e.onConnectCancel:e.onCloseSignIn}
  >
    ${c(`profilePage.modelAccounts.cancelAction`)}
  </button>`;return k({title:r?r.step?.title??n?.label??c(`profilePage.modelAccounts.connectAction`):c(`profilePage.modelAccounts.addAccount`),stacked:!0,control:r?m`<div class="model-accounts-flow">
          ${i?Le({step:i,value:e.stepValue,busy:e.busy,inputId:`profile-account-auth-answer`,leadingAction:a,onValueChange:t=>e.onStepValueChange(i.id,t),onAnswer:t=>e.onStepAnswer(i.id,t)}):m`<span role="status">${c(`common.loading`)}</span>${a}`}
          ${e.statusUnavailable?m`<button
                  type="button"
                  class="btn btn--sm profile-auth-connect-check"
                  ?disabled=${e.cancelBusy}
                  @click=${e.onConnectCheck}
                >
                  ${c(`profilePage.modelAccounts.checkStatusAction`)}
                </button>`:``}
        </div>`:m`<div class="model-accounts-choice">
          ${j({label:c(`profilePage.modelAccounts.provider`),className:`profile-auth-provider`,value:t.provider||null,options:t.providers.map(e=>({value:e.id,label:e.label})),disabled:e.busy,renderLeading:e=>De(e.value),onChange:e.onProviderChange})}
          ${n?j({label:c(`profilePage.modelAccounts.method`),className:`profile-auth-method`,value:t.method||null,options:n.methods.map(e=>({value:e.id,label:e.label,description:e.hint})),disabled:e.busy,onChange:e.onMethodChange}):``}
          ${!e.busy&&!e.error&&t.providers.length===0?m`<span>${c(`profilePage.modelAccounts.noMethods`)}</span>`:``}
          <div class="wizard-step__actions">
            ${a}
            <button
              type="button"
              class="btn btn--sm primary profile-auth-connect-start"
              ?disabled=${e.busy||!t.method}
              @click=${e.onConnectStart}
            >
              ${c(`profilePage.modelAccounts.connectAction`)}
            </button>
          </div>
        </div>`})}function st(e){return k({title:c(`profilePage.modelAccounts.inputLabel`),description:c(`profilePage.modelAccounts.inputDescription`),stackedOnNarrow:!0,control:m`
      <form
        class="model-accounts-form"
        @submit=${t=>{t.preventDefault(),e.onLink()}}
      >
        <input
          class="settings-input profile-auth-link-input"
          type="text"
          aria-label=${c(`profilePage.modelAccounts.inputLabel`)}
          .value=${e.linkDraft}
          placeholder=${c(`profilePage.modelAccounts.inputPlaceholder`)}
          ?disabled=${e.busy}
          @input=${t=>e.onLinkDraftInput(tt(t))}
        />
        <button
          type="submit"
          class="btn btn--sm profile-auth-link-submit"
          ?disabled=${e.busy||!e.linkDraft.trim()}
        >
          ${c(`profilePage.modelAccounts.linkAction`)}
        </button>
      </form>
    `})}function ct(e){return m`
    ${e.links.length===0?R(c(`profilePage.modelAccounts.empty`)):e.links.map(t=>it(e,t))}
    ${e.accounts.filter(e=>!e.selected).map(t=>at(e,t))}
    ${e.hasMore?k({title:c(`profilePage.modelAccounts.savedAccounts`),control:m`<button
              type="button"
              class="btn btn--sm profile-auth-accounts-more"
              ?disabled=${e.busy}
              @click=${e.onLoadMore}
            >
              ${c(`profilePage.modelAccounts.loadMore`)}
            </button>`}):``}
    ${ot(e)} ${e.showManualLink?st(e):``}
    ${e.notice?m`<div class="settings-row model-accounts-notice" role="status">
            <span class="settings-row__desc">${e.notice}</span>
          </div>`:``}
    ${e.error?m`<div class="settings-row model-accounts-error" role="alert">
            <span class="settings-row__desc">${e.error}</span>
          </div>`:``}
    ${e.inventoryError?m`<div class="settings-row model-accounts-error" role="alert">
            ${c(`profilePage.modelAccounts.inventoryFailed`)} ${e.inventoryError}
          </div>`:``}
  `}function lt(e,t){let n=m`
    ${k({title:c(`profilePage.modelAccounts.gateway`),stackedOnNarrow:!0,control:P(nt(e.gatewayUrl),{mono:!0})})}
    ${k({title:c(`profilePage.modelAccounts.person`),stackedOnNarrow:!0,control:P(e.personLabel??c(`profilePage.modelAccounts.noPerson`))})}
    ${k({title:c(`profilePage.modelAccounts.scope`),description:c(`profilePage.modelAccounts.personalDescription`),control:P(c(`profilePage.modelAccounts.personal`))})}
    ${t?ct(t):k({title:c(`profilePage.modelAccounts.signInUnavailable`),description:c(`profilePage.modelAccounts.unavailable.${e.unavailableReason}`),stacked:!0,control:m`
              <button type="button" class="btn btn--sm" @click=${e.onConnectionSettings}>
                ${c(`profilePage.modelAccounts.connectionSettings`)}
              </button>
              ${Pe(`https://docs.testclaw.ai/concepts/multi-user#per-person-model-accounts`)}
            `})}
  `;return N({title:c(`profilePage.modelAccounts.title`),description:c(`profilePage.modelAccounts.description`),actions:t?m`${t.signIn?``:m`<button
                    type="button"
                    class="btn btn--sm primary profile-auth-add-account"
                    ?disabled=${t.busy}
                    @click=${t.onAddAccount}
                  >
                    ${c(`profilePage.modelAccounts.addAccount`)}
                  </button>`}<button
              type="button"
              class="btn btn--sm profile-auth-accounts-refresh"
              ?disabled=${t.inventoryLoading}
              @click=${t.onRefresh}
            >
              ${c(`common.refresh`)}
            </button>`:void 0},n)}function ut(){return(ut=e((()=>{g(),ke(),Ae(),I(),Re(),f(),E(),D()})))()}var Z;function dt(){return(dt=e((()=>{n(),g(),v(),S(),C(),f(),E(),ee(),d(),ut(),D(),Z=class extends oe{constructor(...e){super(...e),this.identityId=null,this.profileId=null,this.personLabel=null,this.links=[],this.accounts=[],this.inventoryLoading=!1,this.inventoryError=null,this.action=null,this.error=null,this.notice=null,this.linkDraft=``,this.signIn=null,this.connectFlow=null,this.statusUnavailable=!1,this.target=null,this.generation=0,this.inventoryRequest=0,this.unsubscribe=null,this.pollTimer=null}connectedCallback(){super.connectedCallback(),this.unsubscribe=this.context.gateway.subscribe(e=>{this.applySnapshot(e),this.requestUpdate()}),this.applySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.generation+=1,this.target=null,this.stopPoll(),super.disconnectedCallback()}willUpdate(e){(e.has(`profileId`)||e.has(`identityId`))&&this.isConnected&&this.applySnapshot(this.context.gateway.snapshot)}applySnapshot(e){let t=e.phase===`connected`&&x(e.hello?.auth??null),n=t?e.client:null,r=e.selfUser?.id??null,i=n&&r===this.identityId?this.profileId:null,a=t&&se(e.hello?.auth??null);(this.target?.client!==n||this.target?.identityId!==r||this.target?.profileId!==i||this.target?.canAdmin!==a)&&(this.generation+=1,this.stopPoll(),this.target=n&&r&&i?{client:n,identityId:r,profileId:i,canAdmin:a}:null,this.links=[],this.accounts=[],this.nextCursor=void 0,this.inventoryRequest+=1,this.inventoryLoading=!1,this.inventoryError=null,this.action=null,this.error=null,this.notice=null,this.linkDraft=``,this.signIn=null,this.connectFlow=null,this.stepValue=void 0,this.statusUnavailable=!1,this.target&&this.loadAccounts())}applyLinks(e){this.links=e,this.accounts=this.accounts.map(t=>({...t,selected:e.some(e=>e.authProfileId===t.authProfileId)}))}async loadAccounts(e){let t=this.target;if(!t)return;let n=++this.inventoryRequest,r=()=>this.isConnected&&this.target===t&&n===this.inventoryRequest;this.inventoryLoading=!0,this.inventoryError=null;try{let n=await t.client.request(`users.listModelAccounts`,{profileId:t.profileId,...e?{cursor:e}:{}});r()&&(this.accounts=e?[...this.accounts,...n.accounts]:n.accounts,this.nextCursor=n.nextCursor,this.applyLinks(n.links))}catch(e){r()&&(this.inventoryError=p(e))}finally{r()&&(this.inventoryLoading=!1)}}isCurrent(e,t){return this.isConnected&&this.target===e&&this.generation===t}async runAction(e,t,n){let r=this.target;if(!r||this.action&&(e!==`cancel`||this.action!==`answer`))return;let i=++this.generation;this.stopPoll(),this.action=e,this.error=null,this.notice=null,this.statusUnavailable=!1;try{let e=await t(r);this.isCurrent(r,i)&&n(e)}catch(e){this.isCurrent(r,i)&&(this.error=p(e,c(`profilePage.modelAccounts.actionFailed`)))}finally{this.isCurrent(r,i)&&(this.action=null,this.schedulePoll(this.connectFlow?.step?2e3:0))}}updateLink(e){let t=`authProfileId`in e;(!t||e.authProfileId&&this.target?.canAdmin)&&this.runAction(`request`,n=>n.client.request(t?`users.linkAuthProfile`:`users.unlinkAuthProfile`,{profileId:n.profileId,...e}),e=>{this.applyLinks(e.links),this.linkDraft=``,this.notice=t?`selected`:`cleared`,this.loadAccounts()})}selectAccount(e){this.runAction(`request`,t=>t.client.request(`users.selectModelAccount`,{profileId:t.profileId,authProfileId:e}),e=>{this.applyLinks(e.links),this.notice=`selected`,this.loadAccounts()})}openSignIn(){this.signIn={providers:[],provider:``,method:``},this.runAction(`request`,e=>e.client.request(`users.authConnect.catalog`,{profileId:e.profileId}),e=>{this.signIn={providers:e.providers,provider:``,method:``}})}selectProvider(e){let t=this.signIn,n=t?.providers.find(t=>t.id===e);t&&n&&!this.action&&!this.connectFlow&&(this.signIn={...t,provider:e,method:n.methods.length===1?n.methods[0]?.id??``:``})}startConnect(){let e=this.signIn;e?.providers.some(t=>t.id===e.provider&&t.methods.some(t=>t.id===e.method))&&this.runAction(`request`,t=>t.client.request(`users.authConnect.start`,{profileId:t.profileId,provider:e.provider,method:e.method}),e=>{this.connectFlow=e,this.stepValue=void 0})}applyConnectStatus(e){if(e.status===`pending`){e.error&&(this.error=p(e.error)),this.connectFlow&&=(this.connectFlow.step?.id!==e.step?.id&&(this.stepValue=e.step?.sensitive?void 0:e.step?.initialValue),{...this.connectFlow,step:e.step});return}if(this.error=null,this.statusUnavailable=!1,this.stopPoll(),this.signIn=null,this.connectFlow=null,this.stepValue=void 0,e.status===`failed`){this.error=c(`profilePage.modelAccounts.connectErrors.${e.reason}`);return}e.status===`connected`&&(this.applyLinks(e.links),this.loadAccounts()),this.notice=e.status}connectStatus(e){let t=this.connectFlow;t&&this.runAction(e===`status`?`request`:e,n=>n.client.request(`users.authConnect.${e}`,{profileId:n.profileId,connectId:t.connectId}),e=>this.applyConnectStatus(e))}answerStep(e,t){let n=this.connectFlow,r=n?.step;n&&r&&r.id===e&&r.type!==`progress`&&(r.sensitive&&(this.stepValue=void 0),this.runAction(`answer`,e=>e.client.request(`users.authConnect.answer`,{profileId:e.profileId,connectId:n.connectId,stepId:r.id,...t===void 0?{}:{value:t}}),e=>this.applyConnectStatus(e)))}stopPoll(){this.pollTimer!==null&&(clearTimeout(this.pollTimer),this.pollTimer=null)}schedulePoll(e=2e3){this.stopPoll();let t=this.connectFlow;if(!t||!this.target||this.action)return;let n=Math.max(0,Math.min(e,t.expiresAtMs-Date.now()));this.pollTimer=setTimeout(()=>{this.pollTimer=null,this.pollStatus()},n)}async pollStatus(){let e=this.target,t=this.connectFlow,n=this.generation;if(e&&t&&!this.action)try{let r=await e.client.request(`users.authConnect.status`,{profileId:e.profileId,connectId:t.connectId});if(!this.isCurrent(e,n)||this.connectFlow?.connectId!==t.connectId)return;this.applyConnectStatus(r),this.connectFlow&&(Date.now()>=t.expiresAtMs?(this.statusUnavailable=!0,this.error=c(`profilePage.modelAccounts.statusTimedOut`)):this.schedulePoll())}catch(t){this.isCurrent(e,n)&&(this.statusUnavailable=!0,this.error=p(t,c(`profilePage.modelAccounts.statusFailed`)))}}render(){let e=this.context.gateway.snapshot;if(e.phase!==`connected`||!e.client)return h;let t=e.selfUser?.id===this.identityId?e.selfUser:null;return lt({gatewayUrl:(this.target?.client??e.client).gatewayUrl,personLabel:t?this.personLabel||t.name||t.email||c(`profilePage.modelAccounts.currentPerson`):null,unavailableReason:t?x(e.hello?.auth??null)?`profile`:`write`:`identity`,onConnectionSettings:()=>this.context.navigate(`connection`)},this.target?{links:this.links,accounts:this.accounts,hasMore:!!this.nextCursor,inventoryLoading:this.inventoryLoading,inventoryError:this.inventoryError,showManualLink:this.target.canAdmin,busy:this.inventoryLoading||this.action!==null,cancelBusy:this.action!==null&&this.action!==`answer`,error:this.error,notice:this.notice?c(`profilePage.modelAccounts.notices.${this.notice}`):null,statusUnavailable:this.statusUnavailable,linkDraft:this.linkDraft,signIn:this.signIn,connectFlow:this.connectFlow,stepValue:this.stepValue,onLinkDraftInput:e=>{this.linkDraft=e},onLink:()=>this.updateLink({authProfileId:this.linkDraft.trim()}),onUnlink:e=>this.updateLink({provider:e}),onSelectAccount:e=>this.selectAccount(e),onLoadMore:()=>void this.loadAccounts(this.nextCursor),onRefresh:()=>void this.loadAccounts(),onAddAccount:()=>this.openSignIn(),onProviderChange:e=>this.selectProvider(e),onMethodChange:e=>{this.signIn&&!this.action&&!this.connectFlow&&(this.signIn={...this.signIn,method:e})},onCloseSignIn:()=>{!this.action&&!this.connectFlow&&(this.signIn=null,this.error=null)},onConnectStart:()=>this.startConnect(),onStepValueChange:(e,t)=>{this.connectFlow?.step?.id===e&&(this.stepValue=t)},onStepAnswer:(e,t)=>this.answerStep(e,t),onConnectCancel:()=>this.connectStatus(`cancel`),onConnectCheck:()=>this.connectStatus(`status`)}:null)}},s([o({context:b,subscribe:!1})],Z.prototype,`context`,void 0),s([y({attribute:!1})],Z.prototype,`identityId`,void 0),s([y({attribute:!1})],Z.prototype,`profileId`,void 0),s([y({attribute:!1})],Z.prototype,`personLabel`,void 0),s([_()],Z.prototype,`links`,void 0),s([_()],Z.prototype,`accounts`,void 0),s([_()],Z.prototype,`nextCursor`,void 0),s([_()],Z.prototype,`inventoryLoading`,void 0),s([_()],Z.prototype,`inventoryError`,void 0),s([_()],Z.prototype,`action`,void 0),s([_()],Z.prototype,`error`,void 0),s([_()],Z.prototype,`notice`,void 0),s([_()],Z.prototype,`linkDraft`,void 0),s([_()],Z.prototype,`signIn`,void 0),s([_()],Z.prototype,`connectFlow`,void 0),s([_()],Z.prototype,`stepValue`,void 0),s([_()],Z.prototype,`statusUnavailable`,void 0),customElements.get(`testclaw-model-accounts`)||customElements.define(`testclaw-model-accounts`,Z)})))()}function ft(e,t){return{id:e.id,name:e.displayName??void 0,email:e.emails[0],avatarUrl:t??void 0,watchedSessions:[]}}function pt(e){let t=e.profile.displayName??``,n=e.displayName.trim()!==t,r=e.profile.emails.join(`, `),i=e.profile.githubIdentity,a=e.profile.id===be;return m`<div id=${B.identity}>
    ${N({title:c(`profilePage.identity.title`),description:c(`profilePage.identity.description`)},m`
        ${k({title:c(`profilePage.identity.avatar`),description:c(`profilePage.identity.avatarDescription`),control:m`
            <span class="identity-avatar-control">
              <testclaw-viewer-avatar
                .user=${ft(e.profile,e.avatarUrl)}
                variant="profile"
              ></testclaw-viewer-avatar>
              <button
                type="button"
                class="btn btn--sm"
                ?disabled=${e.busy!==null}
                @click=${e=>{let t=e.currentTarget,n=t instanceof HTMLButtonElement?t.nextElementSibling:null;n instanceof HTMLInputElement&&n.click()}}
              >
                ${e.busy===`avatar`?c(`profilePage.identity.processingAvatar`):c(`profilePage.identity.chooseAvatar`)}
              </button>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                ?disabled=${e.busy!==null}
                @change=${t=>{let n=t.currentTarget,r=n.files?.[0];n.value=``,r&&e.onAvatarSelect(r)}}
              />
            </span>
          `})}
        ${k({title:c(`profilePage.identity.displayName`),description:c(`profilePage.identity.displayNameDescription`),control:m`
            <form
              class="identity-name-control"
              @submit=${t=>{t.preventDefault(),e.onSaveDisplayName()}}
            >
              <input
                class="settings-input"
                type="text"
                maxlength="256"
                aria-label=${c(`profilePage.identity.displayName`)}
                .value=${e.displayName}
                ?disabled=${e.busy!==null}
                @input=${t=>e.onDisplayNameInput(t.currentTarget.value)}
              />
              <button
                type="submit"
                class="btn btn--sm"
                ?disabled=${e.busy!==null||!n}
              >
                ${e.busy===`display-name`?c(`common.saving`):c(`common.save`)}
              </button>
            </form>
          `})}
        ${a?h:k({title:c(`profilePage.identity.linkedEmails`),description:c(`profilePage.identity.linkedEmailsDescription`),control:r?P(r):h})}
        ${k({title:c(`profilePage.identity.githubAccount`),description:c(a?`profilePage.identity.ownerGithubDescription`:i?`profilePage.identity.githubAccountDescription`:`profilePage.identity.githubUnavailableDescription`),control:i?m`
                <a
                  class="settings-account"
                  href=${i.profileUrl}
                  target=${we}
                  rel=${Se()}
                >
                  <img class="settings-account__avatar" src=${i.avatarUrl} alt="" />
                  <span class="settings-row__value settings-row__value--mono"
                    >@${i.login}</span
                  >
                </a>
                ${O({kind:`ok`,label:c(`profilePage.identity.githubVerified`)})}
              `:O({kind:`muted`,label:c(`profilePage.identity.githubUnavailable`)})})}
        ${je({title:c(`profilePage.identity.gitCoauthor`),description:c(a?`profilePage.identity.ownerGitCoauthorDescription`:i?`profilePage.identity.gitCoauthorDescription`:`profilePage.identity.gitCoauthorUnavailable`),checked:!!(i&&e.gitCoauthorEnabled),disabled:e.busy!==null||!i,onChange:e.onGitCoauthorChange})}
        ${e.error?m`<div class="settings-row identity-error" role="alert">
                <span class="settings-row__desc">${e.error}</span>
              </div>`:h}
      `)}
  </div>`}function mt(){return(mt=e((()=>{g(),T(),I(),f(),A(),Ce(),z()})))()}function ht(e,t,n,i=``,a){let o=a??globalThis.location?.href;if(!o)return null;try{let a=new URL(o),s=new URL(e,a);if(s.protocol===`ws:`?s.protocol=`http:`:s.protocol===`wss:`&&(s.protocol=`https:`),![`http:`,`https:`].includes(s.protocol))return null;s.username=``,s.password=``;let c=s.origin===a.origin?r(i):``;return new URL(ve(t,n,c),s.origin).href}catch{return null}}function gt(){return(gt=e((()=>{a(),ye()})))()}function _t(e,t){if(e.user)return m`<testclaw-viewer-avatar
      .user=${{...e.user,name:t,watchedSessions:[]}}
      variant="profile"
    ></testclaw-viewer-avatar>`;let n=re(e.row,e.identity);return Ne({id:e.row.id,name:t,avatar:n?e.avatarLoader.resolve(n):null,textAvatar:te(e.row,e.identity)},``,n?e.avatarLoader.imageErrorHandler(n):void 0)}function vt(e){let t=e.user?e.user.name?.trim()||e.user.email||c(`nav.owner`):e.identity?.name?.trim()||e.row.identity?.name?.trim()||e.row.name?.trim()||e.row.id,n=e.user?e.user.email:`@${e.row.id}`;return F(m`
    <section class="profile-hero">
      <div class="profile-hero__avatar">${_t(e,t)}</div>
      <div class="profile-hero__name">${t}</div>
      <div class="profile-hero__handle">
        ${n?m`<span class="profile-hero__email">${n}</span>`:h}
        <span class="profile-hero__badge">Assistant</span>
      </div>
    </section>
  `)}function yt(){return(yt=e((()=>{g(),Ie(),I(),f(),l(),ne(),A()})))()}function bt(e){return p(e,c(`profilePage.identity.profileUnavailable`))}var xt,Q;function $(){return($=e((()=>{n(),g(),v(),T(),pe(),S(),C(),ue(),I(),Be(),f(),E(),ee(),Te(),d(),z(),W(),et(),dt(),mt(),gt(),yt(),i(),D(),xt=`https://docs.testclaw.ai/concepts/user-model`,Q=class extends u{constructor(...e){super(...e),this.selfUser=null,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!0,this.identityLoading=!1,this.identityBusy=null,this.identityError=null,this.client=null,this.connected=!1,this.canWrite=!1,this.heroAvatarLoader=new Ee(this),this.identityRequestId=0,this.subscriptions=[]}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.agents.subscribe(()=>this.requestUpdate()),this.context.agentIdentity.subscribe(()=>this.requestUpdate())],this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.identityRequestId+=1,this.client=null,this.connected=!1,this.canWrite=!1,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`,r=n&&x(e.hello?.auth??null),i=r!==this.canWrite,a=n!==this.connected,o=n?ce({snapshotUser:e.selfUser}):null,s=o?.id!==this.selfUser?.id,c=t||a||s||i;this.client=e.client,this.connected=n,this.canWrite=r,this.selfUser=o,this.requestUpdate(),c&&(this.identityRequestId+=1,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!0,this.identityLoading=!1,this.identityBusy=null,this.identityError=null),n&&e.client&&(o&&r&&c&&this.loadIdentity(),this.context.agents.ensureList().then(e=>{e&&this.context.agentIdentity.ensure([e.defaultId])}))}async loadIdentity(){let e=this.client;if(!e||!this.connected||!this.canWrite||this.identityLoading)return;let n=++this.identityRequestId,r=this.ownProfile,i=this.displayName,a=r!==null&&i.trim()!==(r.displayName??``);this.identityLoading=!0,this.identityError=null;try{let r=await e.request(`users.self`,{});if(n!==this.identityRequestId)return;let o=r.profile;if(this.ownProfile=o,this.displayName=a?i:o.displayName??``,this.gitCoauthorEnabled=!0,o.githubIdentity){let{loadUserPreferences:r}=await t(async()=>{let{loadUserPreferences:e}=await import(`./user-prefs-request-Dx0LEDn6.js`);return{loadUserPreferences:e}},__vite__mapDeps([0,1,2,3]),import.meta.url);if(n!==this.identityRequestId)return;let i=await r(e,o.id,{keys:[w]});if(n!==this.identityRequestId)return;this.gitCoauthorEnabled=i.status===`ok`&&xe(i.entries[`git.coauthor.enabled`])}}catch(e){n===this.identityRequestId&&(this.identityError=bt(e))}finally{n===this.identityRequestId&&(this.identityLoading=!1)}}async saveIdentity(e){let t=this.client,n=this.ownProfile;if(!t||!n||!this.canWrite||this.identityBusy||this.identityLoading||e.kind===`git-coauthor`&&!n.githubIdentity)return;this.identityBusy=e.kind,this.identityError=null;let r=this.identityRequestId,i=()=>t===this.client&&r===this.identityRequestId;try{switch(e.kind){case`display-name`:{let e=await t.request(`users.setDisplayName`,{profileId:n.id,displayName:this.displayName.trim()||null});if(!i())return;this.ownProfile=e.profile,this.displayName=e.profile.displayName??``,this.context.gateway.updateSelfUser?.({name:e.profile.displayName??void 0});break}case`avatar`:{let r=this.displayName,a=r.trim()!==(n.displayName??``),o=this.selfUser?.id===n.id?this.selfUser.avatarUrl:void 0,s=await $e(e.file);if(!i())return;let c=await t.request(`users.setAvatar`,{profileId:n.id,mime:s.mime,avatarBase64:s.avatarBase64});if(!i())return;this.ownProfile=c.profile,this.displayName=a?r:c.profile.displayName??``;let l=ht(this.context.gateway.connection.gatewayUrl,c.profile.id,c.avatarRevision,this.context.resourceBasePath),u=this.selfUser?.id===c.profile.id&&this.selfUser.avatarUrl!==o;l&&!u&&this.context.gateway.updateSelfUser?.({avatarUrl:l});break}case`git-coauthor`:{let n=await fe(t,{entries:{[w]:e.enabled}});if(!i())return;if(n.status!==`ok`)throw Error(c(`profilePage.identity.profileUnavailable`));this.gitCoauthorEnabled=e.enabled;return}}}catch(t){i()&&(this.identityError=e.kind===`avatar`&&t instanceof X?c(t.code===`too-large`?`profilePage.identity.avatarErrors.tooLarge`:t.code===`source-too-large`?`profilePage.identity.avatarErrors.sourceTooLarge`:`profilePage.identity.avatarErrors.invalid`):bt(t));return}finally{i()&&this.identityBusy===e.kind&&(this.identityBusy=null)}i()&&this.loadIdentity()}renderIdentity(){if(!this.selfUser)return m`<div id=${B.identity}>
        ${N({title:c(`profilePage.identity.title`)},R(c(`profilePage.identity.unidentified`)))}
      </div>`;if(!this.canWrite)return m`<div id=${B.identity}>
        ${N({title:c(`profilePage.identity.title`)},R(c(`profilePage.identity.writeRequired`)))}
      </div>`;if(!this.ownProfile)return m`<div id=${B.identity}>
        ${N({title:c(`profilePage.identity.title`)},this.identityLoading?Me({label:c(`profilePage.identity.loading`),rows:2}):R(this.identityError??c(`profilePage.identity.profileUnavailable`)))}
      </div>`;let e=this.selfUser?.id===this.ownProfile.id&&this.selfUser.avatarUrl?this.selfUser.avatarUrl:ht(this.context.gateway.connection.gatewayUrl,this.ownProfile.id,this.ownProfile.updatedAt,this.context.resourceBasePath);return pt({profile:this.ownProfile,avatarUrl:e,displayName:this.displayName,gitCoauthorEnabled:this.gitCoauthorEnabled,busy:this.identityLoading?`loading`:this.identityBusy,error:this.identityError,onDisplayNameInput:e=>{this.displayName=e},onSaveDisplayName:()=>void this.saveIdentity({kind:`display-name`}),onAvatarSelect:e=>void this.saveIdentity({kind:`avatar`,file:e}),onGitCoauthorChange:e=>void this.saveIdentity({kind:`git-coauthor`,enabled:e})})}renderModelAccounts(){return m`<testclaw-model-accounts
      .identityId=${this.selfUser?.id??null}
      .profileId=${this.ownProfile?.id??null}
      .personLabel=${this.ownProfile?this.ownProfile.displayName?.trim()||this.ownProfile.emails[0]||c(`profilePage.modelAccounts.currentPerson`):null}
    ></testclaw-model-accounts>`}refreshManually(){this.selfUser&&this.canWrite&&!this.identityBusy&&!this.identityLoading&&(this.client&&de(this.client),this.loadIdentity())}renderHero(){let e=this.context.agents.state.agentsList,t=e?.defaultId??`main`;return vt({row:e?.agents.find(e=>e.id===t)??{id:t},user:this.selfUser,identity:this.context.agentIdentity.get(t),avatarLoader:this.heroAvatarLoader})}renderBody(){return!this.connected||!this.client?L(F(R(c(`profilePage.offline`)))):L(m`
      ${this.renderHero()} ${this.renderIdentity()} ${this.renderModelAccounts()}
      <testclaw-github-connections></testclaw-github-connections>
      ${F(Oe({title:c(`profilePage.usageStatistics`),description:c(`profilePage.usageStatisticsDescription`),onClick:()=>this.context.navigate(`usage`)}))}
    `)}render(){return this.heroAvatarLoader.withActiveRoutes(()=>this.renderContent())}renderContent(){return m`
      <section class="content-header">
        <div>
          <h1 class="page-title">${ge(`profile`)}</h1>
          <div class="page-subtitle">
            ${he(`profile`)} ${Pe(xt)}
          </div>
        </div>
        ${this.selfUser?m`<button
                class="btn profile-refresh"
                ?disabled=${this.identityLoading||this.identityBusy!==null}
                @click=${()=>this.refreshManually()}
              >
                ${this.identityLoading?c(`common.refreshing`):c(`common.refresh`)}
              </button>`:h}
      </section>
      ${ze(this.renderBody())}
    `}},s([o({context:b,subscribe:!1})],Q.prototype,`context`,void 0),s([_()],Q.prototype,`selfUser`,void 0),s([_()],Q.prototype,`ownProfile`,void 0),s([_()],Q.prototype,`displayName`,void 0),s([_()],Q.prototype,`gitCoauthorEnabled`,void 0),s([_()],Q.prototype,`identityLoading`,void 0),s([_()],Q.prototype,`identityBusy`,void 0),s([_()],Q.prototype,`identityError`,void 0),customElements.get(`testclaw-profile-page`)||customElements.define(`testclaw-profile-page`,Q)})))()}$();
//# sourceMappingURL=profile-page-Dj1EvCik.js.map