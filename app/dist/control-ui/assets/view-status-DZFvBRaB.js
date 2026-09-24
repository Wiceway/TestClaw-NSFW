import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Bs as n,Jl as r,Mi as i,Ni as a,Rs as o,au as s,iu as c}from"./control-ui-core-S9jKXqB5.js";import{$ as l,X as u,Y as d,_ as f,h as p,m}from"./lit-runtime-DWoPVI38.js";import{Aa as h,Gn as g,Na as _,Wn as v}from"./control-ui-boot-shared-ooxiG3qa.js";import{Aa as y,At as b,Da as x,Oa as S,ht as C}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as w,t as T}from"./en-settings-DALqdpqg.js";import{r as E,t as D}from"./wizard-step-controls-BOTgnqix.js";import{n as O,t as k}from"./wizard-login-controller-mVdQTtmr.js";var A,j;function M(){return(M=e((()=>{s(),A={modelSetup:{discovery:{title:`On this Gateway`,description:`Find existing connections or prepare a local model for {agent}. Using a model here changes this agent, not the global defaults.`,useForAgent:`Test & use for this agent`,connectForAgent:`Connect & use for this agent`,connectProvider:`Connect provider`,returnToModels:`Return to Models`,otherSoftware:`Other detected software`},verify:{title:`Selected model`,button:`Check model`,retry:`Try again`,checkAgain:`Check again`,checkingButton:`Checking…`,checking:`Checking — asking {modelRef} for a quick reply…`,ready:`Ready`,readyIn:`Ready · {latencyMs} ms`,providerUnavailable:`{provider} isn’t responding.`},nativeDiscovery:{title:`Discover existing conversations`,body:`Show native assistant conversations from this Gateway host in Assistant. This is discovery, not an import or copy.`,enable:`Show existing native conversations`,decline:`Leave unchecked to keep native session catalogs off when you connect your AI provider. Existing installations are not changed.`},success:{title:`Connection verified`,body:`Assistant received a real reply from {modelRef}. You can start chatting now.`,activeModel:`Active model`,latency:`Verified in {latencyMs} ms`,openChat:`Start chatting`,continueSetup:`Continue setup`,stayHere:`Stay in settings`,configuredModel:`Configured model`},utility:{role:`Setup & utility`,hint:`Helps set up Assistant and handles lightweight tasks. Regular chats need a primary model.`,useSetup:`Use for setup`,useUtility:`Use as utility`,ready:`Setup & utility model ready`,configured:`Setup & utility model`,verified:`Assistant received a real reply from {modelRef}. This model is ready for setup and lightweight tasks.`,model:`Utility model`,choosePrimary:`Choose a primary model below for regular chats. Your setup assistant remains available.`,primaryReady:`This model handles setup and lightweight tasks. Regular chats use your primary model.`,openAssistant:`Open setup assistant`,repair:`Recheck & repair`}}},j=Object.assign(()=>{Object.assign(c.modelSetup,A.modelSetup)},{catalog:A})})))()}var N;function P(){return(P=e((()=>{d(),m(),x(),O(),D(),r(),T(),n(),i(),h(),w(),N=class{constructor(e,n){this.host=e,this.options=n,this.picker=null,this.searchInput=p(),this.methodChoices=p(),this.focusPicker=null,this.generation=0,this.mutationActive=!1,this.refreshWarning=null,e.addController(this),this.wizard=new k(e,{getClient:()=>n.getScope().context.gateway.snapshot.client,getAgentId:()=>n.getScope().agentId,onClose:()=>this.reset(),onAnswer:(e,t)=>void this.run(()=>this.runner.answer(e,t)),onBackgroundCompletion:e=>this.run(()=>Promise.resolve(e),!0),requestFailedMessage:()=>t(`modelProviders.requestFailed`),sessionExpiredMessage:()=>t(`modelProviders.login.sessionExpired`)}),this.runner=this.wizard.runner}get busy(){return this.picker!==null||this.mutationActive||this.wizard.cancelling||this.runner.state.phase!==`idle`}get providerActions(){return{canMutate:this.options.canStart(),loginBusy:this.busy,onConnect:e=>this.open([e.id,...e.credentialProviderIds]),canConnect:e=>this.loginProviders([e.id,...e.credentialProviderIds]).length>0}}get pageActions(){return{selectedAgentId:this.options.getScope().agentId,onConnect:()=>this.open(),connectDisabled:!this.options.canStart()||this.busy,login:this.render(),loginMessage:this.message}}loginProviders(e,t=this.options.getScope().authStatus){let n=new Map,r=new Set;for(let i of t?.providerCapabilities??[])if(!e||e.includes(i.provider)){for(let e of i.loginOptions??[]){if(r.has(e.id))continue;r.add(e.id);let t=n.get(e.brandId);t||(t={id:e.brandId,label:``,choices:[]},n.set(t.id,t)),t.label||=e.groupLabel?.trim()??``,t.choices.push(e)}if(i.quickApiKeySetup&&this.options.onApiKey){let e=i.loginOptions?.length?i.loginOptions.map(e=>e.brandId):[i.provider];for(let t of new Set(e)){let e=n.get(t)??{id:t,label:``,choices:[]};n.set(t,{...e,apiKeyProvider:e.apiKeyProvider??i.provider})}}}for(let e of n.values())e.label||=S(e.id),e.choices.sort((e,t)=>Number(t.featured)-Number(e.featured)||e.label.localeCompare(t.label)||e.id.localeCompare(t.id));return[...n.values()].toSorted((e,t)=>e.label.localeCompare(t.label)||e.id.localeCompare(t.id))}async open(e,n){if(!this.options.canStart()||this.busy)return;let r=this.options.getScope(),{client:i,hello:a}=r.context.gateway.snapshot;if(!i||!r.agentId)return;let s=++this.generation,c=new AbortController;this.inventoryRequest=c;let l=()=>{let e=this.options.getScope();return s===this.generation&&e.context.gateway.snapshot.client===i&&e.context.gateway.snapshot.hello===a&&e.agentId===r.agentId&&this.options.canContinue()};this.picker={phase:`loading`,providers:e,providerId:``,query:``,isCurrent:l},this.focusPicker=null,this.message=void 0,this.host.requestUpdate();try{let t=r.authStatus??await _(i,{agentId:r.agentId,signal:c.signal});if(l()){let i=this.loginProviders(e,t),a=n?i.find(e=>e.choices.some(e=>e.id===n)):e&&i.length===1?i[0]:void 0;if(a?.apiKeyProvider&&!a.choices.length){this.reset(),this.options.onApiKey?.(a.apiKeyProvider);return}this.picker={phase:`ready`,providers:e,authStatus:t,providerId:a?.id??``,query:``,isCurrent:l},r.authStatus||(this.focusPicker=a?`method`:`search`)}}catch(n){l()&&(this.picker={phase:`error`,isCurrent:l,providers:e,providerId:``,query:``,message:o(n,t(`modelProviders.requestFailed`))})}finally{s===this.generation&&(this.inventoryRequest=void 0,l()||(this.picker=null),this.host.requestUpdate())}}reset(){this.generation+=1,this.inventoryRequest?.abort(),this.inventoryRequest=void 0,this.picker=null,this.focusPicker=null,this.mutationActive=!1,this.refreshWarning=null,this.message=void 0,this.wizard.reset()}hostDisconnected(){this.reset()}hostUpdated(){if(!this.focusPicker||!this.picker)return;let e=this.methodChoices.value,t=this.focusPicker===`search`?this.searchInput.value:e?.querySelector(`button`)??e;this.focusPicker=null,t?.focus({preventScroll:!0})}render(){let e=this.picker;if(e){let n=e.phase===`ready`?this.loginProviders(e.providers,e.authStatus):[],r=n.find(t=>t.id===e.providerId),i=e.query.trim().toLocaleLowerCase(),a=n.filter(e=>[e.id,e.label,...e.apiKeyProvider?[t(`modelProviders.status.apiKey`)]:[],...e.choices.flatMap(e=>[e.label,e.hint??``])].some(e=>e.toLocaleLowerCase().includes(i)));return l`
        <testclaw-modal-dialog
          label=${t(`modelProviders.login.title`)}
          @modal-cancel=${()=>this.reset()}
        >
          <div class="model-setup-wizard model-provider-login">
            <div class="model-setup-wizard__header">
              <h2>${t(`modelProviders.login.title`)}</h2>
            </div>
            <div class="model-setup-wizard__body">
              <p>${t(`modelProviders.login.description`)}</p>
              ${e.phase===`loading`?l`<div role="status">${t(`common.loading`)}</div>`:e.phase===`error`?l`<div role="alert">${e.message}</div>`:r?l`
                          <h3 class="model-provider-login__provider">
                            ${y(r.id)} ${r.label}
                          </h3>
                          <div data-models-login-choice tabindex="-1" ${f(this.methodChoices)}>
                            ${E({label:t(`modelProviders.login.method`),options:r.choices.map(e=>({value:e.id,label:e.label,hint:e.hint})),busy:e.phase!==`ready`||!e.isCurrent(),onAnswer:t=>{let n=r.choices.find(e=>e.id===t);this.picker===e&&n&&e.phase===`ready`&&e.isCurrent()&&(this.picker=null,this.refreshWarning=null,this.runner.prepareSignIn(n.kind,n.label),this.run(()=>this.runner.start(n.id,`models.authLogin`)))}})}
                          </div>
                          ${r.apiKeyProvider?l`
                                  <button
                                    type="button"
                                    class="btn"
                                    data-models-login-api-key
                                    ?disabled=${e.phase!==`ready`||!e.isCurrent()}
                                    @click=${()=>{this.picker===e&&r.apiKeyProvider&&e.phase===`ready`&&e.isCurrent()&&(this.reset(),this.options.onApiKey?.(r.apiKeyProvider))}}
                                  >
                                    ${t(`modelProviders.apiKey.set`)}
                                  </button>
                                `:u}
                        `:l`
                          <label class="field">
                            <span>${t(`modelProviders.search`)}</span>
                            <input
                              type="search"
                              data-models-login-search
                              autofocus
                              autocomplete="off"
                              ${f(this.searchInput)}
                              .value=${e.query}
                              @input=${t=>{e.query=t.currentTarget.value,this.host.requestUpdate()}}
                            />
                          </label>
                          <ul
                            class="model-provider-login__providers"
                            aria-label=${t(`modelSetup.manual.provider`)}
                          >
                            ${a.map(n=>l`
                                <li>
                                  <button
                                    type="button"
                                    class="btn model-provider-login__option"
                                    data-models-login-provider=${n.id}
                                    ?disabled=${e.phase!==`ready`||!e.isCurrent()}
                                    @click=${()=>{if(this.picker===e&&e.phase===`ready`&&e.isCurrent()){if(n.apiKeyProvider&&!n.choices.length){this.reset(),this.options.onApiKey?.(n.apiKeyProvider);return}e.providerId=n.id,this.focusPicker=`method`,this.host.requestUpdate()}}}
                                  >
                                    ${y(n.id)}
                                    <span class="model-provider-login__copy">
                                      <strong>${n.label}</strong>
                                      <span>
                                        ${[...n.choices.map(e=>e.label),...n.apiKeyProvider?[t(`modelProviders.status.apiKey`)]:[]].join(` · `)}
                                      </span>
                                    </span>
                                  </button>
                                </li>
                              `)}
                          </ul>
                          ${a.length?u:l`
                                  <p class="muted" role="status">
                                    ${t(i?`modelProviders.noMatches`:`modelProviders.login.noProviders`)}
                                  </p>
                                `}
                        `}
            </div>
            <div class="model-setup-wizard__footer">
              ${r?l`
                      <button
                        class="btn model-provider-login__secondary"
                        data-models-login-back
                        @click=${()=>{this.picker===e&&e.phase===`ready`&&e.isCurrent()&&(e.providers=void 0,e.providerId=``,this.focusPicker=`search`,this.host.requestUpdate())}}
                      >
                        ${t(`common.back`)}
                      </button>
                    `:!e.providers&&this.options.onDiscover?l`
                        <button
                          class="btn model-provider-login__secondary"
                          data-models-login-discover
                          ?disabled=${!e.isCurrent()}
                          @click=${()=>{this.picker===e&&e.isCurrent()&&(this.reset(),this.options.onDiscover?.())}}
                        >
                          ${t(`modelProviders.login.discover`)}
                        </button>
                      `:u}
              <button class="btn" @click=${()=>this.reset()}>${t(`common.cancel`)}</button>
            </div>
          </div>
        </testclaw-modal-dialog>
      `}return this.wizard.render({busy:this.mutationActive,refreshWarning:this.refreshWarning})}async complete(){let e=this.runner.state.authLabel;this.runner.close(),this.message={kind:`success`,text:[e,t(`modelProviders.login.done`)].filter(Boolean).join(`: `),...this.refreshWarning?{warning:this.refreshWarning}:{}},this.host.requestUpdate(),await this.options.refresh()}async run(e,n=!1){let r=this.options.getScope().context.gateway.snapshot.client;if(!r||this.mutationActive&&!n||!this.options.canContinue())return;let i=++this.generation;this.mutationActive=!0,this.host.requestUpdate();try{let n=await this.options.getScope().context.runtimeConfig.runExternalMutation(async n=>{if(n!==r)throw Error(t(`modelProviders.requestFailed`));let i=await e();return i&&a(n),i},{canDispatch:()=>i===this.generation&&this.options.getScope().context.gateway.snapshot.client===r&&this.options.canContinue(),dispatchError:t(`modelProviders.requestFailed`)});if(i!==this.generation)return;if(!n.ok){this.runner.fail(n.error);return}this.refreshWarning=n.refresh.ok?null:n.refresh.error,n.value&&n.value.isCurrent?.()!==!1&&await this.complete()}catch(e){i===this.generation&&this.runner.fail(o(e,t(`modelProviders.requestFailed`)))}finally{i===this.generation&&(this.mutationActive=!1,this.host.requestUpdate())}}}})))()}function F(e){let n=e.auth;if(!n)return u;let r=t(V[n.kind]),i=n.expiryLabel?t(`modelProviders.expiresIn`,{time:n.expiryLabel}):void 0;return l`
    <span title=${i??r}>
      ${b({kind:H[n.kind],label:r})}
    </span>
  `}function I(e){return e.hasConfigApiKey||!!e.apiKey||e.profiles.length>0}function L(e){return e.catalogStatus===`ready`&&e.auth?.kind!==`expired`&&e.auth?.kind!==`missing`&&e.auth?.kind!==`expiring`}function R(e){return e.checkingModels?b({kind:`muted`,label:t(`chat.modelControls.checkingProviderModels`,{providers:e.displayName})}):e.auth?.kind===`expired`||e.auth?.kind===`missing`||e.auth?.kind===`expiring`?F(e):e.catalogStatus===`auth-rejected`?b({kind:`danger`,label:t(`modelProviders.status.denied`)}):e.catalogStatus===`unavailable`?b({kind:`warn`,label:t(`modelProviders.status.modelsUnavailable`)}):I(e)?L(e)&&e.availableModelCount>0?b({kind:`ok`,label:t(`modelProviders.status.ready`)}):L(e)?b({kind:`muted`,label:t(`modelProviders.status.ok`)}):b({kind:`muted`,label:t(`modelProviders.status.configured`)}):F(e)}function z(e){return e?l`
    <div class="callout ${e.kind}" role=${e.kind===`error`?`alert`:`status`}>
      ${e.text}
    </div>
    ${e.warning?l`<div class="callout warning" role="status">${e.warning}</div>`:u}
  `:u}function B(e,n=!1){return l`<button
    class=${n?`btn primary`:`btn`}
    data-models-connect
    ?disabled=${e.connectDisabled}
    @click=${e.onConnect}
  >
    ${t(`modelProviders.login.action`)}
  </button>`}var V,H;function U(){return(U=e((()=>{d(),C(),r(),v(),g(),V={ok:`modelProviders.status.ok`,expiring:`modelProviders.status.expiring`,expired:`modelProviders.status.expired`,missing:`modelProviders.status.missing`,"api-key":`modelProviders.status.apiKey`},H={ok:`ok`,expiring:`warn`,expired:`danger`,missing:`danger`,"api-key":`muted`}})))()}export{R as a,M as c,z as i,j as l,U as n,N as o,B as r,P as s,L as t};
//# sourceMappingURL=view-status-DZFvBRaB.js.map