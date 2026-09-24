import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Xt as t,aa as n,en as r,oo as i,ti as a}from"./control-ui-foundation-CGMdhB5v.js";import{$l as o,Hl as s,J as c,Jl as l,K as u,X as d,Y as f,Z as p,au as m,bi as h,iu as g,xi as _,yi as v,zl as y}from"./control-ui-core-S9jKXqB5.js";import{$ as b,X as x,Y as S,ct as C,nt as w,ut as T}from"./lit-runtime-DWoPVI38.js";import{Fi as E,Ii as D,Si as O,Yi as k,ba as ee,hi as te,qi as ne,xi as re,yi as A}from"./control-ui-core-G2U4O6rB.js";import{Fi as j,Ii as M,Pi as N}from"./control-ui-boot-shared-ooxiG3qa.js";import{E as P,T as F}from"./control-ui-boot-shared-CCYBAAP9.js";var I,L;function R(){return(R=e((()=>{m(),I={login:{heading:`Connect to Assistant`,lede:`Enter the Gateway URL and secret, or open the one-time link that testclaw dashboard prints on the Gateway host.`,gatewayUrl:`Gateway URL`,gatewaySettings:`Gateway settings`,secret:`Gateway secret`,setupCodeHint:`This is a device setup code for the Assistant mobile app, not the Gateway secret. Paste it in the app's Gateway settings instead; the Gateway secret comes from testclaw gateway auth-token --show on the Gateway host.`,secretPlaceholder:`Paste the token or type the password`,runOnHost:`Run on the Gateway host`,connection:{target:`Connecting to {host}`,secretEntered:`secret entered`,noSecret:`no secret`,change:`Change`},showSecret:`Show Gateway secret`,hideSecret:`Hide Gateway secret`,toggleSecretVisibility:`Toggle Gateway secret visibility`,failure:{rawError:`Raw error`,profileUnavailable:{title:`Profile verification unavailable`,stepRetry:`Retry shortly.`,stepAdmin:`If this continues, ask a Gateway administrator to check the identity provider and GitHub API credential.`},verifiedUserRequired:{title:`Verified identity required`,summary:`This Gateway has named roles enabled. Device and setup tokens cannot identify a person.`,stepIdentity:`Reconnect through the trusted proxy or Tailscale so the Gateway can verify your identity.`,stepSharedSecret:`For trusted local operator access, use the shared Gateway token or password.`},authRequired:{title:`This Gateway expects its token`,passwordTitle:`This Gateway expects its password`,summary:`The Gateway at {host} is reachable, but it needs a matching token or password before this browser can connect.`,stepPaste:`Paste the token from testclaw gateway auth-token --show into Gateway secret.`,stepPassword:`Type the configured Gateway password into Gateway secret.`,stepGenerate:`If no token is configured, run testclaw doctor --generate-gateway-token on the gateway host.`,stepConnect:`Click Connect again after updating the Gateway secret.`},authFailed:{title:`Gateway secret rejected`,summary:`{host} rejected the supplied Gateway secret. Check that it belongs to this Gateway and try again.`,stepDashboard:`Run testclaw dashboard --no-open for a fresh URL, or testclaw gateway auth-token --show to recover the token.`,stepReplace:`Replace the Gateway secret with the token for this Gateway URL.`},trustedProxy:{title:`Proxy authentication required`,summary:`The Gateway is reachable, but it rejected the proxy identity or forwarding information.`,stepSignIn:`Open the configured authenticated proxy or SSO dashboard URL and sign in there, rather than visiting the Gateway directly.`,stepHeaders:`Ask the Gateway administrator to check for missing identity headers and required-header forwarding on WebSocket upgrade requests, and confirm your account is permitted.`,stepNoToken:`A Gateway token cannot replace proxy authentication.`},rateLimited:{title:`Too many failed attempts`,summary:`The Gateway is temporarily limiting authentication attempts for this client.`,stepStop:`Stop retrying from this tab for a moment.`,stepWait:`Wait for the auth limiter to cool down, then reconnect with the corrected credential.`,stepCheckClients:`If this is a shared host, check other clients for repeated bad retries.`},pairing:{title:`Approve this browser`,scopeTitle:`Approve the new access level`,roleTitle:`Approve the new role`,metadataTitle:`Re-approve this browser`,summary:`This browser passed Gateway auth at {host}, but the Gateway has not seen it before. A one-time approval on the Gateway host finishes pairing.`,upgradeSummary:`This browser is already paired with {host}, but it asked for access it was not approved for. Approve the new request on the Gateway host.`,stepDashboard:`Prefer a link? Run testclaw dashboard on the Gateway host and open the one-time URL it prints in this browser.`,stepLatest:`That command prints the exact approve command for the newest pending request; run that one as well.`,stepReconnect:`Once approved, click Connect.`,waiting:`Waiting for approval… this page connects on its own once the request is approved.`,checkNow:`Check now`},insecure:{title:`Secure browser context required`,summary:`This page is running over plain HTTP, so the browser cannot create the device identity the Gateway expects.`,stepHttps:`Use HTTPS/Tailscale Serve, or open http://127.0.0.1:18789 on the Gateway host.`,stepAvoidDisable:`Do not use a remote plain-HTTP URL; a token or password cannot replace browser device identity.`},origin:{title:`Browser origin not allowed`,summary:`The Gateway rejected this page origin before accepting the Control UI connection.`,stepAllowedOrigins:`Add this browser origin to gateway.controlUi.allowedOrigins.`,stepFullOrigin:`Use full origins such as http://localhost:5173, not wildcard patterns.`,stepRestart:`Restart or reload the Gateway after changing allowed origins.`},protocol:{title:`Protocol mismatch`,summary:`The served Control UI and the running Gateway do not agree on the supported connection protocol.`,refresh:`Refresh page`,stepDashboard:`Reopen the served dashboard with testclaw dashboard so the UI and Gateway come from the same install.`,stepDevUi:`If using pnpm ui:dev, rebuild or restart the dev UI against the current checkout.`,stepRestart:`Restart the Gateway after updating Assistant so it serves the current protocol.`},network:{title:`Gateway unreachable`,summary:`The browser could not reach {host}. Check the address and transport before retrying credentials.`,stepGateway:`Confirm the Gateway is running with testclaw status or testclaw gateway run.`,stepUrl:`Check the Gateway URL and use wss:// when the Gateway is behind HTTPS/Tailscale Serve.`,stepDashboard:`Reopen the dashboard with testclaw dashboard --no-open to recopy the current URL and auth details.`}}}},L=Object.assign(()=>{Object.assign(g.login,I.login)},{catalog:I})})))()}function z(e){let t=e.trim(),n=t.toLowerCase().startsWith(`oc-pair://`)?t.slice(10):t;if(!/^[A-Za-z0-9_-]+$/u.test(n))return`unknown`;try{let e=Uint8Array.from(atob(n.replace(/-/g,`+`).replace(/_/g,`/`)),e=>e.charCodeAt(0)),t=JSON.parse(new TextDecoder().decode(e));return typeof t==`object`&&t&&`url`in t&&typeof t.url==`string`&&t.url.trim()!==``&&`bootstrapToken`in t&&typeof t.bootstrapToken==`string`&&t.bootstrapToken.trim()!==``?`setup-code`:`unknown`}catch{return`unknown`}}function B(){return(B=e((()=>{})))()}function V(e){return e===t.AUTH_PASSWORD_MISSING||e===t.AUTH_PASSWORD_MISMATCH||e===t.AUTH_PASSWORD_NOT_CONFIGURED}function H(e){let t=e.docsHref??`https://docs.testclaw.ai/web/dashboard`,n=c(e.rawError);return{kind:e.kind,placement:e.placement??`status`,tone:e.tone??`danger`,field:e.field,title:o(e.titleKey,e.stepParams),summary:e.summaryKey?o(e.summaryKey,e.stepParams):n,primaryCommand:e.primaryCommand,refreshAction:e.refreshAction,steps:e.stepKeys.map(t=>typeof t==`string`?{text:o(t,e.stepParams),commands:[]}:{text:o(t.key,e.stepParams),commands:t.commands}),docsHref:t,rawError:n}}function U(e){if(e.connected||!e.lastError)return null;let n=e.lastError,r=e.lastErrorCode??null,a=i(n),s=v(e.gatewayUrl);if(r===t.AUTHENTICATED_PROFILE_UNAVAILABLE)return H({kind:`profile-unavailable`,tone:`pending`,rawError:n,titleKey:`login.failure.profileUnavailable.title`,stepKeys:[`login.failure.profileUnavailable.stepRetry`,`login.failure.profileUnavailable.stepAdmin`],docsHref:`https://docs.testclaw.ai/concepts/user-model#gateway-profile-and-github-credit`});if(r===t.AUTH_VERIFIED_USER_REQUIRED)return H({kind:`verified-user-required`,rawError:n,titleKey:`login.failure.verifiedUserRequired.title`,summaryKey:`login.failure.verifiedUserRequired.summary`,stepKeys:[`login.failure.verifiedUserRequired.stepIdentity`,`login.failure.verifiedUserRequired.stepSharedSecret`],docsHref:`https://docs.testclaw.ai/gateway/operator-scopes`});if(r===t.CONTROL_UI_BUILD_MISMATCH)return H({kind:`build-mismatch`,tone:`pending`,rawError:n,titleKey:`chat.sidebar.serverUpdatedTitle`,summaryKey:`chat.sidebar.serverUpdatedRefresh`,refreshAction:{label:o(`login.failure.protocol.refresh`)},stepKeys:[],docsHref:`https://docs.testclaw.ai/web/control-ui`});let c=d(!1,n,r);if(c)return H({kind:`pairing-required`,tone:`pending`,rawError:n,docsHref:`https://docs.testclaw.ai/web/control-ui#device-pairing-first-connection`,titleKey:c.kind===`scope-upgrade-pending`?`login.failure.pairing.scopeTitle`:c.kind===`role-upgrade-pending`?`login.failure.pairing.roleTitle`:c.kind===`metadata-upgrade-pending`?`login.failure.pairing.metadataTitle`:`login.failure.pairing.title`,summaryKey:c.kind===`pairing-required`?`login.failure.pairing.summary`:`login.failure.pairing.upgradeSummary`,primaryCommand:c.requestId?`testclaw devices approve ${c.requestId}`:`testclaw devices approve --latest`,stepKeys:[...c.requestId?[]:[`login.failure.pairing.stepLatest`],{key:`login.failure.pairing.stepDashboard`,commands:[`testclaw dashboard`]},...e.reconnectPending?[]:[`login.failure.pairing.stepReconnect`]],stepParams:{host:s}});if(r===t.AUTH_RATE_LIMITED||a.includes(`too many failed authentication attempts`)||a.includes(`rate limit`))return H({kind:`auth-rate-limited`,tone:`warn`,rawError:n,titleKey:`login.failure.rateLimited.title`,summaryKey:`login.failure.rateLimited.summary`,stepKeys:[`login.failure.rateLimited.stepStop`,`login.failure.rateLimited.stepWait`,`login.failure.rateLimited.stepCheckClients`]});if(p(!1,n,r))return H({kind:`insecure-context`,rawError:n,docsHref:`https://docs.testclaw.ai/web/control-ui#insecure-http`,titleKey:`login.failure.insecure.title`,summaryKey:`login.failure.insecure.summary`,stepKeys:[`login.failure.insecure.stepHttps`,`login.failure.insecure.stepAvoidDisable`]});if(r===t.CONTROL_UI_ORIGIN_NOT_ALLOWED||a.includes(`origin not allowed`))return H({kind:`origin-not-allowed`,rawError:n,docsHref:`https://docs.testclaw.ai/web/control-ui/development#debugging%2Ftesting%3A-dev-server-%2B-remote-gateway`,titleKey:`login.failure.origin.title`,summaryKey:`login.failure.origin.summary`,stepKeys:[`login.failure.origin.stepAllowedOrigins`,`login.failure.origin.stepFullOrigin`,`login.failure.origin.stepRestart`]});if(a.includes(`protocol mismatch`))return H({kind:`protocol-mismatch`,rawError:n,docsHref:`https://docs.testclaw.ai/web/control-ui/development#debugging%2Ftesting%3A-dev-server-%2B-remote-gateway`,titleKey:`login.failure.protocol.title`,summaryKey:`login.failure.protocol.summary`,refreshAction:{label:o(`login.failure.protocol.refresh`)},stepKeys:[{key:`login.failure.protocol.stepDashboard`,commands:[`testclaw dashboard`]},{key:`login.failure.protocol.stepDevUi`,commands:[`pnpm ui:dev`]},`login.failure.protocol.stepRestart`]});let l=f(e),u=V(r);return H(l===`trusted-proxy`?{kind:`trusted-proxy`,rawError:n,titleKey:`login.failure.trustedProxy.title`,summaryKey:`login.failure.trustedProxy.summary`,stepKeys:[`login.failure.trustedProxy.stepSignIn`,`login.failure.trustedProxy.stepHeaders`,`login.failure.trustedProxy.stepNoToken`],docsHref:`https://docs.testclaw.ai/gateway/trusted-proxy-auth`}:l===`required`?{kind:`auth-required`,placement:`form`,tone:`warn`,field:`credential`,rawError:n,titleKey:u?`login.failure.authRequired.passwordTitle`:`login.failure.authRequired.title`,summaryKey:`login.failure.authRequired.summary`,stepKeys:u?[`login.failure.authRequired.stepPassword`,`login.failure.authRequired.stepConnect`]:[{key:`login.failure.authRequired.stepPaste`,commands:[`testclaw gateway auth-token --show`]},{key:`login.failure.authRequired.stepGenerate`,commands:[`testclaw doctor --generate-gateway-token`]},`login.failure.authRequired.stepConnect`],stepParams:{host:s}}:l===`failed`?{kind:`auth-failed`,placement:`form`,field:`credential`,rawError:n,titleKey:u?`login.failure.authRequired.passwordTitle`:r===t.AUTH_TOKEN_MISMATCH?`login.failure.authRequired.title`:`login.failure.authFailed.title`,summaryKey:(r===t.AUTH_TOKEN_MISMATCH||r===t.AUTH_PASSWORD_MISMATCH)&&z(e.secret??``)===`setup-code`?`login.setupCodeHint`:`login.failure.authFailed.summary`,stepKeys:u?[`login.failure.authRequired.stepPassword`,`login.failure.authRequired.stepConnect`]:[{key:`login.failure.authFailed.stepDashboard`,commands:[`testclaw dashboard --no-open`,`testclaw gateway auth-token --show`]},`login.failure.authFailed.stepReplace`],stepParams:{host:s}}:{kind:`network`,placement:`form`,tone:`warn`,field:`url`,rawError:n,titleKey:`login.failure.network.title`,summaryKey:`login.failure.network.summary`,stepKeys:[{key:`login.failure.network.stepGateway`,commands:[`testclaw status`,`testclaw gateway run`]},`login.failure.network.stepUrl`,{key:`login.failure.network.stepDashboard`,commands:[`testclaw dashboard --no-open`]}],stepParams:{host:s}})}function W(){return(W=e((()=>{r(),l(),u(),h()})))()}function G({text:e,commands:t}){let n=new Set(t),r=[...n].map(t=>[t,e.indexOf(t)]).toSorted(([e,t],[n,r])=>t-r||n.length-e.length),i=[],a=0;for(let[t,o]of r)o<a||(i.push(e.slice(a,o),P(t)),n.delete(t),a=o+t.length);i.push(e.slice(a));for(let e of n)i.push(` `,P(e));return i}function K(e){return e.steps.length===0?x:b`
    <ol class="login-gate__failure-steps">
      ${e.steps.map(e=>b`<li>${G(e)}</li>`)}
    </ol>
  `}function q(e){return b`
    <footer class="login-gate__foot">
      <details class="login-gate__failure-detail">
        <summary>${o(`login.failure.rawError`)}</summary>
        <div class="login-gate__failure-raw mono">${e.rawError}</div>
      </details>
      <a
        class="session-link login-gate__failure-docs"
        href=${e.docsHref}
        target=${N}
        rel=${j()}
        >${o(`common.learnMore`)}</a
      >
    </footer>
  `}function J(e,t){return e.refreshAction?b`
    <button
      type="button"
      class="btn primary login-gate__failure-refresh"
      ?disabled=${t.state===`pending`}
      @click=${t.onRefresh}
    >
      ${t.state===`pending`?o(`common.refreshing`):t.state===`failed`?o(`common.retry`):e.refreshAction.label}
    </button>
  `:x}function Y(e,t,n){let[r,i,a]=t;return b`
    <testclaw-tooltip .content=${e?i:r}>
      <button
        type="button"
        class="settings-secret__toggle"
        aria-label=${a}
        aria-pressed=${e}
        @click=${n}
      >
        ${e?E.eye:E.eyeOff}
      </button>
    </testclaw-tooltip>
  `}function X(e){let{props:t,feedback:n}=e,r=z(t.secret)===`setup-code`,i=n?.placement===`form`?n.field:void 0,a=e=>{e.key===`Enter`&&t.onConnect()};return b`
    <div class="login-gate__form">
      <div class="field">
        <label for="login-gate-url">${o(`login.gatewayUrl`)}</label>
        <input
          id="login-gate-url"
          inputmode="url"
          autocapitalize="none"
          autocorrect="off"
          autocomplete="off"
          spellcheck="false"
          enterkeyhint="go"
          aria-invalid=${i===`url`?`true`:x}
          .value=${t.gatewayUrl}
          @input=${e=>{t.onGatewayUrlChange(e.target.value)}}
          @keydown=${a}
          placeholder="wss://gateway.example:443"
        />
      </div>
      <div class="field">
        <label for="login-gate-credential">${o(`login.secret`)}</label>
        <span class="settings-secret">
          <input
            id="login-gate-credential"
            type=${t.showGatewaySecret?`text`:`password`}
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="go"
            aria-invalid=${i===`credential`?`true`:x}
            aria-describedby=${r?`login-gate-secret-hint`:x}
            .value=${t.secret}
            @input=${e=>{t.onSecretChange(e.target.value)}}
            @keydown=${a}
            placeholder=${o(`login.secretPlaceholder`)}
          />
          ${Y(t.showGatewaySecret,[o(`login.showSecret`),o(`login.hideSecret`),o(`login.toggleSecretVisibility`)],t.onToggleGatewaySecret)}
        </span>
        ${r?b`<p id="login-gate-secret-hint" class="muted" role="status">${o(`login.setupCodeHint`)}</p>`:x}
      </div>
      ${e.withSubmit?b`
              <button class="btn primary login-gate__connect" @click=${t.onConnect}>
                ${o(`common.connect`)}
              </button>
            `:x}
    </div>
  `}function ie(e){let t=v(e.gatewayUrl),n=e.secret.trim()?o(`login.connection.secretEntered`):o(`login.connection.noSecret`);return b`
    <summary>
      <span class="login-gate__connection-target">
        ${E.server}
        <span>${o(`login.connection.target`,{host:t})}</span>
      </span>
      <span class="login-gate__connection-cred">· ${n}</span>
      <span class="login-gate__connection-change">${o(`login.connection.change`)}</span>
    </summary>
  `}function ae(e){let{props:t,feedback:n}=e,r=n.kind===`pairing-required`&&t.reconnectPending;return b`
    <section
      class="login-gate__body login-gate__failure"
      role="status"
      aria-live="polite"
      data-kind=${n.kind}
      data-tone=${n.tone}
    >
      <div class="login-gate__status-head">
        <span class="login-gate__status-icon" aria-hidden="true">${Z[n.tone]}</span>
        <div class="login-gate__status-text">
          <h1 class="login-gate__failure-title">${n.title}</h1>
          <p class="login-gate__failure-summary">${n.summary}</p>
        </div>
      </div>
      ${n.primaryCommand?b`
              <div class="login-gate__hero">
                <span class="login-gate__hero-label">${o(`login.runOnHost`)}</span>
                ${P(n.primaryCommand,`hero`)}
              </div>
            `:x}
      ${K(n)}
      ${r?b`<p class="login-gate__failure-summary">
              <span class="session-run-spinner" aria-hidden="true"></span>
              ${o(`login.failure.pairing.waiting`)}
            </p>`:x}
      <div class="login-gate__actions">
        ${J(n,e.refreshAction)}
        <button class="btn login-gate__connect" @click=${t.onConnect}>
          ${o(r?`login.failure.pairing.checkNow`:`common.connect`)}
        </button>
      </div>
      <details class="login-gate__connection">
        ${ie(t)} ${X({...e,withSubmit:!1})}
      </details>
      ${q(n)}
    </section>
  `}function oe(e){let{feedback:t}=e;return b`
    <section
      class=${t?`login-gate__body login-gate__failure`:`login-gate__body`}
      role=${t?`status`:x}
      aria-live=${t?`polite`:x}
      data-kind=${t?.kind??x}
      data-tone=${t?.tone??x}
    >
      <div class="login-gate__status-text">
        <h1 class=${t?`login-gate__failure-title`:`login-gate__heading`}>
          ${t?.title??o(`login.heading`)}
        </h1>
        <p class=${t?`login-gate__failure-summary`:`login-gate__lede`}>
          ${t?.summary??o(`login.lede`)}
        </p>
      </div>
      ${X({...e,withSubmit:!0})}
      ${t?b`${K(t)} ${q(t)}`:b`
              <details class="login-gate__help">
                <summary class="login-gate__help-title">${o(`connection.help.title`)}</summary>
                <ol class="login-gate__steps">
                  <li>
                    ${o(`connection.help.step1`)}${P(`testclaw gateway run`)}
                  </li>
                  <li>
                    ${o(`connection.help.step2`)} ${P(`testclaw dashboard`)}
                  </li>
                  <li>${o(`connection.help.step3`)}</li>
                </ol>
                <div class="login-gate__docs">
                  <a
                    class="session-link"
                    href="https://docs.testclaw.ai/web/dashboard"
                    target=${N}
                    rel=${j()}
                    >${o(`connection.help.docsLink`)}</a
                  >
                </div>
              </details>
            `}
    </section>
  `}function se(e,t){let r=n(e.resourceBasePath),i=ne(`favicon.svg`,r),a=U(e),s=a?.placement===`status`?ae({props:e,feedback:a,refreshAction:t}):oe({props:e,feedback:a});return b`
    <div class="login-gate">
      <testclaw-toast-host></testclaw-toast-host>
      <div class="login-gate__card" data-mode=${a?.placement??`form`}>
        <header class="login-gate__brand">
          ${e.mascot===`none`?b`<span class="login-gate__logo login-gate__logo--neutral" aria-hidden="true"
                  >${E.mark}</span
                >`:b`<img class="login-gate__logo" src=${i} alt="" />`}
          <span class="login-gate__brand-name">Assistant</span>
        </header>
        ${s}
        ${e.onOpenGatewaySettings?b`<button class="btn" @click=${e.onOpenGatewaySettings}>
                ${o(`login.gatewaySettings`)}
              </button>`:x}
      </div>
    </div>
  `}var Z,Q;function $(){return($=e((()=>{S(),w(),ee(),O(),k(),te(),l(),_(),R(),M(),h(),s(),F(),D(),W(),L(),Z={pending:E.shieldEllipsis,warn:E.clock,danger:E.shieldAlert},Q=class extends y{constructor(...e){super(...e),this.refreshState=`idle`}ownsRefresh(e){let t=this.props;return this.refreshAttempt===e&&this.isConnected&&t!==void 0&&!t.connected&&!t.reconnectPending&&[`lastError`,`lastErrorCode`,`lastErrorAuthReason`,`gatewayUrl`,`resourceBasePath`,`secret`].every(n=>t[n]===e.props[n])}cancelRefresh(){this.refreshAttempt=void 0,this.refreshState=`idle`}willUpdate(){this.refreshAttempt&&!this.ownsRefresh(this.refreshAttempt)&&this.cancelRefresh()}disconnectedCallback(){this.cancelRefresh(),super.disconnectedCallback()}async refreshPage(){let e=this.props;if(!e||this.refreshAttempt||this.refreshState===`pending`||!this.isConnected||e.connected||e.reconnectPending||!U(e)?.refreshAction||!re(!0))return;let t={props:e};this.refreshAttempt=t,this.refreshState=`pending`;try{let e=await A({canReload:()=>this.ownsRefresh(t)});this.ownsRefresh(t)&&!e&&(this.refreshState=`failed`)}catch{this.ownsRefresh(t)&&(this.refreshState=`failed`)}finally{this.refreshAttempt===t&&(this.ownsRefresh(t)?this.refreshAttempt=void 0:this.cancelRefresh())}}render(){let e=this.props;return e?se({...e,onConnect:()=>{this.cancelRefresh(),e.onConnect()},onGatewayUrlChange:t=>{this.cancelRefresh(),e.onGatewayUrlChange(t)},onSecretChange:t=>{this.cancelRefresh(),e.onSecretChange(t)}},{state:this.refreshState,onRefresh:()=>void this.refreshPage()}):x}},a([T({attribute:!1})],Q.prototype,`props`,void 0),a([C()],Q.prototype,`refreshState`,void 0),customElements.get(`testclaw-login-gate`)||customElements.define(`testclaw-login-gate`,Q)})))()}export{L as a,R as i,z as n,B as r,$ as t};
//# sourceMappingURL=login-runtime-D8jfKi1h.js.map