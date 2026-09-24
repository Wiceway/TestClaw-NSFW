const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./channel-avatar-uLSU0z2R.js","./gateway-runtime-BV4hxqU_.js","./control-ui-boot-shared-BGGpAWmX.js","./control-ui-boot-shared-DyyHmPxq.js","./control-ui-boot-shared-C3bL_9oq.js","./control-ui-boot-shared-BnfqoX89.js","./control-ui-boot-shared-8dYR6CXG.js","./markdown-runtime-B1-JWj3L.js","./config-runtime-CgOgfOrG.js","./control-ui-boot-shared-D2o30asO.js","./control-ui-boot-shared-7DNogyqm.js","./control-ui-boot-shared-DudbgiQn.js","./control-ui-boot-shared-VDjYq2Zh.js","./control-ui-boot-shared-DE0JeAKR.js","./sidebar-update-runtime-BRiaYa7O.js","./control-ui-core-CBmGCeuQ.css","./control-ui-boot-shared-aePz3vDg.css","./sidebar-update-runtime-BklCM1yZ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,Or as n,cr as r,eo as i,qi as a,uo as o}from"./control-ui-foundation-CGMdhB5v.js";import{$l as s,Jl as c,Qc as l,Zl as u,bl as d,dl as f,qc as p,sl as m,vi as h}from"./control-ui-core-S9jKXqB5.js";import{$ as g,X as _,Y as v,Z as y,pt as b}from"./lit-runtime-DWoPVI38.js";import{Fi as x,Ii as S,It as ee,Ni as te,Oa as ne,Rt as re,ba as ie,ci as ae,li as oe}from"./control-ui-core-G2U4O6rB.js";import{Bi as se,Et as ce,Ot as C,Ri as le}from"./control-ui-boot-shared-ooxiG3qa.js";import{$ as ue,Ca as de,Gi as fe,H as pe,Hi as me,Ji as w,Jn as he,Ki as ge,Kn as _e,Sa as ve,U as ye,V as be,Xi as xe,Yi as Se,Zi as T,ai as Ce,et as we,hr as Te,ii as E,oi as D,pr as O,qi as k,qn as Ee,ri as A,ur as De}from"./control-ui-boot-shared-CCYBAAP9.js";import{F as Oe,P as ke}from"./control-ui-boot-chat-oECFOvg2.js";function Ae(e){if(!e)return _;let t=s(e.status===`in_progress`?`sessionProgressCard.status.inProgress`:e.status===`paused`?`sessionProgressCard.status.paused`:`sessionProgressCard.status.pending`);return g`<div
    class="session-hovercard__context-row session-hovercard__plan-row"
    aria-label=${s(`sessionProgressCard.stepLabel`,{status:t,step:e.step})}
    title=${e.step}
  >
    <span class="session-hovercard__context-icon" aria-hidden="true"
      >${e.status===`in_progress`?g`<span class="session-run-spinner"></span>`:x.clock}</span
    >
    <span class="session-hovercard__context-value session-hovercard__plan-step"
      >${e.step}</span
    >
    <span class="session-hovercard__plan-count">${e.completed}/${e.total}</span>
  </div>`}function je({row:e,automationLink:t},n){let r=e?.workContext,i=r?.kind===`project`?r.cwd:r?.path,a=i??r?.path,o=e?.placementProviderId&&e.placementProfileId?{label:`${e.placementProviderId} · ${e.placementProfileId}`,title:s(`sessionHovercard.runsOn`,{providerId:e.placementProviderId,profileId:e.placementProfileId})}:void 0,c=de(e?.placementMachine),l=c.filter(Boolean).join(` · `);return g`<div class="session-hovercard__context">
    ${r?g`<div
            class="session-hovercard__context-row"
            aria-label=${`${s(r.kind===`project`?`sessionHovercard.projectLabel`:`sessionHovercard.workspaceLabel`)}: ${r.name}`}
            title=${a?`${s(r.kind===`project`?`sessionHovercard.projectLabel`:`sessionHovercard.workspaceLabel`)}: ${a}`:_}
          >
            <span class="session-hovercard__context-icon" aria-hidden="true">${x.folder}</span>
            <span class="session-hovercard__context-value session-hovercard__context-text"
              >${r.name}</span
            >
          </div>`:_}
    ${r?.kind===`project`&&r.branch?g`<div
            class="session-hovercard__context-row"
            aria-label=${`${s(`sessionHovercard.branchLabel`)}: ${r.branch}`}
            title=${i??_}
          >
            <span class="session-hovercard__context-icon" aria-hidden="true"
              >${x.gitBranch}</span
            >
            <span class="session-hovercard__context-value session-hovercard__context-text"
              >${r.branch}</span
            >
          </div>`:_}
    ${o?g`<div
            class="session-hovercard__context-row"
            aria-label=${o.title}
            title=${o.title}
          >
            <span class="session-hovercard__context-icon" aria-hidden="true">${x.server}</span>
            <span class="session-hovercard__context-value session-hovercard__context-text"
              >${o.label}</span
            >
          </div>`:_}
    ${o&&l?g`<div
            class="session-hovercard__machine"
            aria-label=${`${s(`sessionHovercard.machineLabel`)}: ${l}`}
          >
            ${c.map((e,t)=>e?g`<span class=${t===1?`session-hovercard__machine-class`:_}
                    >${e}</span
                  >`:_)}
          </div>`:_}
    ${e?.boardFace===`dashboard`?g`<div
            class="session-hovercard__context-row"
            aria-label=${s(`sessionsView.opensAsDashboard`)}
          >
            <span class="session-hovercard__context-icon" aria-hidden="true"
              >${x.layoutDashboard}</span
            >
            <span class="session-hovercard__context-value session-hovercard__context-text"
              >${s(`sessionsView.opensAsDashboard`)}</span
            >
          </div>`:_}
    ${e?.hasAutomation&&t?g`<a
            class="session-hovercard__context-row session-hovercard__automation-link"
            href=${t.href}
            @click=${e=>{h(e)&&(e.preventDefault(),t.navigate())}}
          >
            <span class="session-hovercard__context-icon" aria-hidden="true">${x.clock}</span>
            <span class="session-hovercard__context-value session-hovercard__context-text"
              >${s(`sessionsView.automationAttached`)}</span
            >
            <span class="session-hovercard__context-icon" aria-hidden="true"
              >${x.chevronRight}</span
            >
          </a>`:_}
    ${Ae(n)}
  </div>`}function j(){return(j=e((()=>{v(),c(),S(),ve()})))()}function M(e){return e.label?.trim()||e.identity.id}function Me(e,t,n){return e.identity.type===`profile`&&e.identity.id===n||JSON.stringify(e.identity)===JSON.stringify(t?.identity)}function Ne(){We??=t(()=>import(`./channel-avatar-uLSU0z2R.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]),import.meta.url)}function Pe(e){return s(`sessionHovercard.states.${e}`)}function Fe(e){switch(e.state){case`passing`:return s(`sessionHovercard.checks.passing`);case`failing`:return s(`sessionHovercard.checks.failing`);case`pending`:return s(`sessionHovercard.checks.pending`);default:return e.state}}function Ie(e){switch(e){case`open`:return x.gitPullRequest;case`draft`:return x.gitPullRequestDraft;case`merged`:return x.gitMerge;case`closed`:return x.gitPullRequestClosed;default:return e}}function N(e){return e.additions===void 0&&e.deletions===void 0?_:g`<span class="session-hovercard__diff">
    ${e.additions===void 0?_:g`<span class="session-hovercard__additions"
            >+${e.additions.toLocaleString()}</span
          >`}
    ${e.deletions===void 0?_:g`<span class="session-hovercard__deletions"
            >−${e.deletions.toLocaleString()}</span
          >`}
  </span>`}function P(e){let t=Math.abs(e)/864e5;return t>=365?{value:Math.max(1,Math.round(t/365)),unit:`year`}:t>=28?{value:Math.max(1,Math.round(t/30)),unit:`month`}:t>=7?{value:Math.max(1,Math.round(t/7)),unit:`week`}:t>=1?{value:Math.max(1,Math.round(t)),unit:`day`}:n(Math.abs(e))}function F(e,t){if(typeof e!=`number`||!Number.isFinite(e))return``;let n=e-Date.now(),{value:r,unit:i}=P(n);if(t)return i===`second`&&n<=0?s(`common.justNow`):new Intl.RelativeTimeFormat(u.getLocale(),{numeric:`always`,style:`narrow`}).format(n<=0?-r:r,i);if(u.getLocale().toLowerCase().startsWith(`en`)){let e={second:`s`,minute:`m`,hour:`h`,day:`d`,week:`w`,month:`mo`,year:`y`}[i];if(e)return`${r}${e}`}return new Intl.NumberFormat(u.getLocale(),{style:`unit`,unit:i,unitDisplay:`short`,maximumFractionDigits:0}).format(r)}function Le(e,t){let n=e.createdActor,r=n?.label?.trim()||n?.id?.trim(),i=new Set,a=0,o=(e.expandedParticipants??e.participants??[]).filter(e=>{let r=JSON.stringify(e.identity);return!i.has(r)&&(i.add(r),!Me(e,n,t)||(a+=1,!1))}),s=Math.max(o.length,(e.participantCount??0)-a);if(n&&r)return{creator:n,primaryIdentity:n.identity,primaryLabel:r,participants:o,otherCount:s};let c=o[0];if(c)return{primaryIdentity:c.identity,primaryLabel:M(c),participants:o,otherCount:Math.max(0,s-1)}}function Re(e,t,n){let r=Math.max(0,t-e.length);return g`<div
    slot="content"
    class="session-hovercard__participant-menu"
    role="list"
    style="min-width: 150px; max-height: min(280px, 60vh); overflow-y: auto;"
    aria-label=${s(`sessionHovercard.moreParticipantsLabel`,{count:String(t)})}
  >
    ${e.map(e=>{let t=M(e),r=e.identity.type===`profile`?w(e.identity.id,n,t):null;return g`<div role="listitem">
        ${T(t,r,`session-menu__item learn-more-link session-hovercard__participant-link`)}
      </div>`})}
    ${r>0?g`<div class="session-hovercard__more" role="listitem">
            ${s(`sessionHovercard.moreParticipantsLabel`,{count:String(r)})}
          </div>`:_}
  </div>`}function I({row:e,selfUserId:t,avatarAuth:n,personActivity:r}){if(!e)return _;let i=Le(e,t);if(!i)return _;let{creator:a,primaryIdentity:o,primaryLabel:c,participants:l,otherCount:u}=i,d=a?void 0:l[0],f=o?.type===`profile`?w(o.id,r,c):null,p=a?fe(a):``,m=p?g`<span class="session-hovercard__creator-avatar-fallback" aria-hidden="true"
        >${p}</span
      >`:_;a&&e.channelAvatarUrl&&Ne();let h=a?e.channelAvatarUrl?g`<testclaw-channel-avatar
          class="session-hovercard__creator-avatar"
          .routeUrl=${e.channelAvatarUrl}
          .authTokens=${n?.authTokens??[]}
          .authReady=${n?.authReady??!1}
          .fallback=${m}
          aria-hidden="true"
        ></testclaw-channel-avatar>`:g`<testclaw-viewer-avatar
          class="session-hovercard__creator-avatar"
          .user=${{id:a.id,name:a.label,avatarUrl:a.avatarUrl,watchedSessions:[]}}
          .markAsViewer=${!1}
          .identity=${a.identity}
          variant="session"
          aria-hidden="true"
        ></testclaw-viewer-avatar>`:d?g`<testclaw-viewer-avatar
          class="session-hovercard__creator-avatar"
          .user=${{id:d.identity.id,name:d.label,avatarUrl:d.avatarUrl,watchedSessions:[]}}
          .markAsViewer=${!1}
          .identity=${d.identity}
          variant="session"
          aria-hidden="true"
        ></testclaw-viewer-avatar>`:_,v=a?l:l.slice(1),y=[c,u>0?s(`sessionHovercard.moreParticipantsLabel`,{count:String(u)}):``].filter(Boolean).join(`, `),b=u>0?s(u===1?`sessionHovercard.attributionOther`:`sessionHovercard.attributionOthers`,{count:String(u)}):``;return g`<div class="session-hovercard__attribution" aria-label=${y}>
    <span class="session-hovercard__attribution-copy">
      ${T(c,f,`session-hovercard__attribution-name`)}
      ${u>0?v.length>0?g`<testclaw-tooltip
                class="session-hovercard__participants-tooltip"
                .describe=${!1}
                open-on-click
              >
                <button
                  type="button"
                  class="session-hovercard__attribution-others"
                  style="padding: 1px 3px; border: 0; border-radius: var(--radius-sm); background: transparent; font: inherit;"
                  aria-label=${s(`sessionHovercard.moreParticipantsLabel`,{count:String(u)})}
                >
                  ${b}
                </button>
                ${Re(v,u,r)}
              </testclaw-tooltip>`:g`<span class="session-hovercard__attribution-others">${b}</span>`:_}
    </span>
    <span class="session-hovercard__attribution-avatars">
      ${xe(h,f)}
      ${v.length>0?g`<testclaw-viewer-facepile
              .staticParticipants=${v}
              .totalCount=${u}
              .maxVisible=${Math.min(v.length,L)}
              .personActivity=${r}
            ></testclaw-viewer-facepile>`:_}
    </span>
  </div>`}function ze(e){let t=e.row,n=t.channelPresentation,r=n?[...new Set([n.conversation,n.address].filter(e=>e&&e!==t.label))]:[],i=typeof t.createdAt==`number`&&Number.isFinite(t.createdAt),a=i?F(t.createdAt,!0):``,o=i?F(t.createdAt,!1):``;return g`<header class="session-hovercard__header">
    <span class="session-hovercard__heading">
      ${n?g`<span class="session-hovercard__channel"
              ><span aria-hidden="true">${x.link}</span
              >${s(`sessionHovercard.linkedChannel`,{channel:n.channelLabel})}</span
            >`:_}
      <span class="session-hovercard__title">${we(t.color)}${t.label}</span>
      ${n?g`<span class="session-hovercard__conversation">
              ${n.kind?g`<span>${n.topicId?s(`sessionHovercard.topicNumber`,{id:n.topicId}):s(`sessionHovercard.chatKinds.${n.kind}`)}</span>`:_}
              ${r.map(e=>g`<span>${e}</span>`)}
              ${n.account?g`<span>${s(`sessionHovercard.viaAccount`,{account:n.account})}</span>`:_}
            </span>`:I(e)}
    </span>
    ${o?g`<span class="session-hovercard__created-age" title=${a}>${o}</span>`:_}
  </header>`}function Be(e){return e?.markdown?.trim()?g`<section
    class="session-hovercard__section session-hovercard__notepad"
    aria-label=${s(`sessionHovercard.agentNotepad`)}
  >
    <div class="session-hovercard__notepad-title">${s(`sessionHovercard.agentNotepad`)}</div>
    ${ye(e.markdown,{promoteProgress:!0})}
  </section>`:_}function Ve(e){let t=Pe(e.state),n=e.checks?Fe(e.checks):null,r=[e.title,n,e.additions===void 0?null:`+${e.additions.toLocaleString()}`,e.deletions===void 0?null:`−${e.deletions.toLocaleString()}`].filter(e=>!!e);return g`<a
    class="session-hovercard__pr-row"
    data-state=${e.state}
    href=${e.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label=${`${s(`sessionHovercard.pullRequestLabel`,{number:String(e.number),state:t})}${r.length>0?`, ${r.join(`, `)}`:``}`}
  >
    <span
      class="session-hovercard__pr-state-icon"
      role="img"
      data-checks=${e.checks?.state??_}
      aria-label=${n?`${t} · ${n}`:t}
      title=${n?`${t} · ${n}`:t}
      >${Ie(e.state)}</span
    >
    <span class="session-hovercard__pr-title">${e.title}</span>
    ${N(e)}
  </a>`}function He(e){if(!e)return _;if(e.pullRequests.length>0){let t=e.pullRequests.slice(0,1),n=e.pullRequests.length-t.length;return g`<div class="session-hovercard__pr-list">
      ${t.map(Ve)}
      ${n>0?g`<span class="session-hovercard__more"
              >${s(`sessionHovercard.more`,{count:String(n)})}</span
            >`:_}
    </div>`}let t=e.branch;if(!t)return _;let n=s(`chat.pullRequests.createPr`),r=s(`chat.pullRequests.createPrLabel`,{branch:t.branch});return g`<div class="session-hovercard__branch-row">
    <span class="session-hovercard__branch-icon" aria-hidden="true">${x.gitBranch}</span>
    ${t.createUrl?g`<a
            class="session-hovercard__branch-action"
            href=${t.createUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label=${r}
            title=${r}
            >${n}</a
          >`:g`<span class="session-hovercard__branch-label">${s(`chat.sessionDiff.title`)}</span>`}
    ${N(t)}
  </div>`}function Ue(e){let t=e.row?.channelPresentation?I(e):_,n=pe(e.progressCard,e.row?.status,e.row?.startedAt,e.row?.hasActiveRun??!1),r=!!(e.pullRequests&&(e.pullRequests.pullRequests.length>0||e.pullRequests.branch||e.pullRequests.status!==`ready`)),i=!!(e.row?.workContext||e.row?.placementProviderId&&e.row.placementProfileId||e.row?.boardFace===`dashboard`||e.row?.hasAutomation&&e.automationLink||n),a=e.progressCard?void 0:e.row?.lastMessagePreview?.trim()||void 0;return!e.row&&!r&&!e.progressCard?_:g`<div class="session-hovercard">
    ${e.row?g`<section class="session-hovercard__section session-hovercard__section--header">
            ${ze(e)}
          </section>`:_}
    ${i?g`<section class="session-hovercard__section session-hovercard__section--metadata">
            ${je(e,n)}
          </section>`:_}
    ${r?g`<section class="session-hovercard__section session-hovercard__section--prs">
            ${He(e.pullRequests)}
            ${e.pullRequests?.status===`ready`?_:g`<div class="session-hovercard__more" role="status">
                    ${s(e.pullRequests?.status===`rate-limited`?`chat.pullRequests.rateLimited`:`chat.pullRequests.unavailable`)}
                  </div>`}
          </section>`:_}
    ${a?g`<section class="session-hovercard__section session-hovercard__section--optional">
            <div class="session-hovercard__excerpt">${a}</div>
          </section>`:_}
    ${Be(e.progressCard)}
    ${t===_?_:g`<section
            class="session-hovercard__section session-hovercard__section--attribution"
            aria-label=${s(`sessionHovercard.sessionParticipants`)}
          >
            <div class="session-hovercard__attribution-label">
              ${s(`sessionHovercard.sessionParticipants`)}
            </div>
            ${t}
          </section>`}
  </div>`}var L,We;function R(){return(R=e((()=>{r(),v(),c(),S(),k(),ue(),j(),me(),be(),te(),ge(),i(),L=4})))()}function Ge(e){if(!a(e)||e.status!==`ok`)throw Error(`Session title unavailable`);let t=o(e.sessionKey),n=o(e.agentId);if(!t||!n)throw Error(`Session title response was incomplete`);return{sessionKey:t,agentId:n,namespace:`chat`,title:o(e.title)??o(e.derivedTitle)}}var z,B,V,H,U;function W(){return(W=e((()=>{ae(),l(),Oe(),De(),z=`a.markdown-session-link, [data-session-href]`,B=3e5,V=3e4,H=100,U=class{constructor(e){this.host=e,this.client=null,this.context=null,this.cache=new Map,this.observer=new MutationObserver(e=>{for(let t of e.flatMap(e=>[...e.addedNodes]))t instanceof HTMLElement&&this.refresh(t)})}connect(){this.observer.observe(this.host,{childList:!0,subtree:!0}),this.refresh()}refresh(e=this.host){let t=new Map;e.matches(z)&&this.decorate(e,!1,t);for(let n of e.querySelectorAll(z))this.decorate(n,!1,t)}disconnect(){this.observer.disconnect()}async decorate(e,t=!1,n){let r=this.targetForAnchor(e,n),i=e instanceof HTMLAnchorElement?e:document.createElement(`a`);if(e!==i&&e.classList.contains(`markdown-session-link`)&&(i.dataset.sessionHref=e.dataset.sessionHref,i.setAttribute(`href`,e.getAttribute(`href`)??``),i.className=`markdown-session-link`,e.classList.remove(`markdown-session-link`),e.removeAttribute(`href`),e.removeAttribute(`data-session-href`),e.replaceWith(i),i.append(e)),!r)return;let a=this.cachedOrSeededEntry(r);if(this.stampAnchor(i,r,a?.value),t&&!a?.value)try{this.stampAnchor(i,r,await this.loadTitle(r))}catch{}}mainKey(){return f({agentsList:this.context?.agents.state.agentsList,hello:this.context?.gateway.snapshot.hello})}targetForAnchor(e,t){let n=e.dataset.sessionKey?.trim();if(n&&!e.dataset.sessionHref){let e=m(n);return e?{sessionKey:n,agentId:e.agentId,namespace:`chat`}:null}let r=Te(e.dataset.sessionHref??e.getAttribute(`href`)??``,{basePath:this.context?.basePath,mainKey:this.mainKey(),publicOrigin:O(this.context)});if(!r)return null;let i=`${r.url.pathname}${r.url.search}${r.url.hash}`;e.getAttribute(`href`)!==i&&e.setAttribute(`href`,i),e.classList.contains(`markdown-session-link`)||e.classList.add(`markdown-session-link`),e.removeAttribute(`target`),e.removeAttribute(`rel`);let a=t?.get(r.url.pathname);if(a===void 0){let e=ke(this.context?.sessions.state.result?.sessions??[],r.target,this.mainKey());a=e?{sessionKey:e.key,agentId:r.target.agentId,namespace:r.target.namespace}:null,t?.set(r.url.pathname,a)}return a||e.removeAttribute(`data-session-key`),a}setCacheEntry(e,t){this.cache.delete(e),this.cache.set(e,t);for(let e of this.cache.keys()){if(this.cache.size<=H)break;this.cache.delete(e)}}cachedOrSeededEntry(e){let t=Date.now(),n=this.cache.get(e.sessionKey);if(n&&n.expiresAt>t)return this.setCacheEntry(e.sessionKey,n),n;this.cache.delete(e.sessionKey);let r=this.context?.sessions.state.result?.sessions.find(t=>p(t.key,e.sessionKey));if(!r)return;let i={...e,sessionKey:r.key,agentId:r.agentId??m(r.key)?.agentId??e.agentId,title:r.displayName??r.derivedTitle},a={expiresAt:t+B,promise:Promise.resolve(i),value:i};return this.setCacheEntry(e.sessionKey,a),a}loadTitle(e){let t=this.cachedOrSeededEntry(e);if(t)return t.promise;let n={expiresAt:Date.now()+B,promise:Promise.resolve().then(async()=>{if(!this.client)throw Error(`Session title requires a connected Gateway`);return{...Ge(await this.client.request(`controlUi.sessionPreview`,{sessionKey:e.sessionKey})),namespace:e.namespace}})};return n.promise=n.promise.then(e=>(n.value=e,e),e=>{throw n.expiresAt=Date.now()+V,e}),this.setCacheEntry(e.sessionKey,n),n.promise}stampAnchor(e,t,n){let r=n?.title,i=oe(t.namespace,t.agentId,t.sessionKey,this.context?.basePath,{displayName:r,exactKey:!0,mainKey:this.mainKey()});if(e.dataset.sessionKey!==t.sessionKey&&(e.dataset.sessionKey=t.sessionKey),e.classList.contains(`markdown-session-link`)||e.classList.add(`markdown-session-link`),!e.dataset.sessionHref&&i&&e.getAttribute(`href`)!==i&&e.setAttribute(`href`,i),!r||e.classList.contains(`markdown-session-link--titled`))return;e.classList.add(`markdown-session-link--titled`);let a=e.querySelector(`:scope > .session-label`)??document.createElement(`span`);a.className=`session-label`,a.textContent=r,e.replaceChildren(a),e.title=t.sessionKey}}})))()}function G(e){return e.querySelector(`testclaw-session-menu, testclaw-catalog-session-menu`)!==null}var K,q,J,Y,X,Z,Q;function $(){return($=e((()=>{v(),ie(),ee(),c(),ce(),le(),l(),k(),he(),R(),W(),E(),K=450,q=80,J=300,Y=100,X=100,Z=0,Q=class extends b{constructor(...e){super(...e),this.applicationClient=null,this.applicationContext=null,this.applicationGateway=null,this.progressCards=null,this.stopProgressCardUpdates=null,this.stopContextUpdates=null,this.pullRequests=null,this.stopPullRequestUpdates=null,this.activeTarget=null,this.activeTrigger=null,this.activeSession=null,this.open=!1,this.delayed=!0,this.animateNextOpen=!0,this.skipDelayTimer=null,this.lastProgressCard=null,this.hovercard=new _e(()=>this.close(!0),Y,()=>this.close()),this.sessionLinkTitler=new U(this),this.loadGeneration=0,this.activeTargetObserver=new MutationObserver(()=>{if(this.activeTarget&&(!this.contains(this.activeTarget)||G(this))){this.close();return}this.open&&this.showCurrent()}),this.handleProgressCardUpdate=()=>{let e=this.activeSession;if(!e||!this.open||!this.hovercard.held)return;let t=this.progressCards?.get(e);t!==void 0&&(this.lastProgressCard=t),this.showCurrent()},this.handleSessionUpdate=()=>{this.sessionLinkTitler.refresh(),this.open&&this.hovercard.held&&this.showCurrent()},this.handlePullRequestUpdate=()=>{this.open&&this.hovercard.held&&this.showCurrent()},this.handlePointerOver=e=>{if(e.pointerType===`touch`||!globalThis.matchMedia?.(`(hover: hover)`).matches)return;let t=D(e);if(!t||G(this))return;let n=this.delayed;this.activate(t,t,n?K:q,n),this.hovercard.pointerInside=!0},this.handlePointerOut=e=>{let t=D(e);t&&t===this.activeTarget&&(e.relatedTarget instanceof Node&&t.contains(e.relatedTarget)||this.hovercard.schedulePointerExit())},this.handleFocusIn=e=>{if(this.hovercard.restoringFocus)return;let t=D(e),n=e.target instanceof HTMLElement?e.target:null,r=t?.matches(`.sidebar-recent-session`)?n?.closest(`a.sidebar-recent-session__link`):n;t&&r&&!G(this)&&(this.activate(t,r,0,!1),this.hovercard.focusInside=!0)},this.handleFocusOut=e=>{this.activeTarget&&(e.relatedTarget instanceof Node&&this.activeTarget.contains(e.relatedTarget)||(this.hovercard.focusInside=!1,this.hovercard.scheduleClose()))},this.handleClick=e=>{D(e)&&this.close()},this.handleSessionMenuOpen=()=>{this.close()},this.handleCardPointerLeave=()=>{this.hovercard.pointerOverCard=!1,this.hovercard.scheduleClose()}}static{this.properties={client:{attribute:!1,noAccessor:!0},context:{attribute:!1,noAccessor:!0},gateway:{attribute:!1,noAccessor:!0}}}get activeArtifactKey(){return this.activeSession?d(this.activeSession.sessionKey,this.activeSession.agentId):null}get client(){return this.applicationClient}set client(e){this.applicationClient=e,this.sessionLinkTitler.client=e}get context(){return this.applicationContext}set context(e){this.stopContextUpdates?.(),this.stopContextUpdates=null,this.applicationContext=e,this.sessionLinkTitler.context=e,this.isConnected&&(this.sessionLinkTitler.refresh(),this.connectStore())}get gateway(){return this.applicationGateway}set gateway(e){e!==this.applicationGateway&&(this.disconnectStore(),this.applicationGateway=e,this.close(),this.isConnected&&this.connectStore())}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,this.addEventListener(`pointerover`,this.handlePointerOver),this.addEventListener(`pointerout`,this.handlePointerOut),this.addEventListener(`focusin`,this.handleFocusIn),this.addEventListener(`focusout`,this.handleFocusOut),this.addEventListener(`keydown`,this.hovercard.handleTriggerKeyDown),this.addEventListener(`click`,this.handleClick),this.addEventListener(A,this.handleSessionMenuOpen),this.sessionLinkTitler.connect(),this.connectStore()}disconnectedCallback(){this.removeEventListener(`pointerover`,this.handlePointerOver),this.removeEventListener(`pointerout`,this.handlePointerOut),this.removeEventListener(`focusin`,this.handleFocusIn),this.removeEventListener(`focusout`,this.handleFocusOut),this.removeEventListener(`keydown`,this.hovercard.handleTriggerKeyDown),this.removeEventListener(`click`,this.handleClick),this.removeEventListener(A,this.handleSessionMenuOpen),this.sessionLinkTitler.disconnect(),this.disconnectStore(),this.close(),this.clearSkipDelayTimer(),super.disconnectedCallback()}connectStore(){if(this.applicationContext&&!this.stopContextUpdates){let e=this.applicationContext.sessions.subscribe(this.handleSessionUpdate),t=this.applicationContext.agentSelection.subscribe(()=>this.close());this.stopContextUpdates=()=>{e(),t()}}this.applicationGateway&&!this.progressCards&&(this.progressCards=C(this.applicationGateway),this.stopProgressCardUpdates=this.progressCards.subscribe(this.handleProgressCardUpdate))}disconnectStore(){this.progressCards?.unwatch(this),this.stopProgressCardUpdates?.(),this.stopProgressCardUpdates=null,this.stopContextUpdates?.(),this.stopContextUpdates=null,this.progressCards=null,this.releasePullRequestStore()}activate(e,t,n,r){let i=e.dataset.sessionKey;if(!i)return;let a=m(i)?.agentId??e.closest(`testclaw-app-sidebar`)?.expandedAgentId();if(!a)return;let o=d(i,a);if(e===this.activeTarget&&i===this.activeSession?.sessionKey&&o===this.activeArtifactKey){if(t!==this.activeTrigger){if(this.hovercard.reset(),this.activeTrigger=t,this.hovercard.markTrigger(t),this.open)this.showCurrent();else{this.animateNextOpen=r;let e=++this.loadGeneration;this.hovercard.scheduleOpen(n,()=>void this.loadAndShow(i,e))}}return}this.close(n>0),this.activeTarget=e,this.activeTrigger=t,this.activeSession={sessionKey:i,agentId:a},this.open=!1,this.animateNextOpen=r,this.lastProgressCard=null,this.progressCards?.watch(this,[this.activeSession]),this.hovercard.markTrigger(t),this.activeTargetObserver.observe(this,{attributes:!0,attributeFilter:[`aria-expanded`],childList:!0,subtree:!0});let s=++this.loadGeneration;this.hovercard.scheduleOpen(n,()=>void this.loadAndShow(i,s))}async loadAndShow(e,t){let n=this.activeTarget,r=this.activeArtifactKey,i=this.activeSession;if(n instanceof HTMLAnchorElement&&n.dataset.sessionKey===e&&this.sessionLinkTitler.decorate(n,!0),t===this.loadGeneration&&i?.sessionKey===e&&r&&i&&n&&!G(this)&&this.hovercard.held){this.open=!0,this.delayed=!1,this.clearSkipDelayTimer(),this.watchPullRequests(r),this.showCurrent();try{await this.progressCards?.load(i)}catch{}t===this.loadGeneration&&this.activeSession?.sessionKey===e&&this.hovercard.held&&this.showCurrent()}}watchPullRequests(e){let t=this.applicationGateway;t&&(this.releasePullRequestStore(),this.pullRequests=se(t),this.stopPullRequestUpdates=this.pullRequests.subscribe(this.handlePullRequestUpdate),this.pullRequests.watch(this,[e],{foreground:!0}))}releasePullRequestStore(){this.pullRequests?.unwatch(this),this.stopPullRequestUpdates?.(),this.stopPullRequestUpdates=null,this.pullRequests=null}showCurrent(){let e=this.activeTarget,t=this.activeSession,n=t?.sessionKey,r=this.activeArtifactKey;if(!e||!t||!n||!r||!this.open)return;let i=this.querySelector(`testclaw-app-sidebar`)?.findSidebarHovercardRowByKey(n),a=this.pullRequests?.get(r),o=this.progressCards?.get(t);o!==void 0&&(this.lastProgressCard=o);let c=this.applicationGateway,l={authTokens:c?re({hello:c.snapshot.hello,settings:{token:c.connection.token},password:c.connection.password}):[],authReady:!!(c&&(c.snapshot.hello||c.connection.token.trim()||c.connection.password.trim()))},u=JSON.stringify({progress:this.lastProgressCard?.revision??null,pullRequests:a?{branch:a.branch,pullRequests:a.pullRequests}:null,row:i?{label:i.label,boardFace:i.boardFace,hasAutomation:i.hasAutomation,hasActiveRun:i.hasActiveRun,channelAvatarUrl:i.channelAvatarUrl,channelPresentation:i.channelPresentation,lastMessagePreview:i.lastMessagePreview,createdActor:i.createdActor,participants:i.participants,expandedParticipants:i.expandedParticipants,participantCount:i.participantCount,workContext:i.workContext,createdAt:i.createdAt,startedAt:i.startedAt,updatedAt:i.updatedAt,status:i.status,endedAt:i.endedAt}:null});if(this.hovercard.card?.dataset.revision===u)return;let d=this.hovercard.card,f=d?.contains(document.activeElement)&&document.activeElement instanceof HTMLElement?document.activeElement:null,p=f?this.hovercard.focusables().indexOf(f):-1,m=f instanceof HTMLAnchorElement?f.href:null,h=!d&&this.animateNextOpen,g=d;if(g||(Z+=1,g=Ee(`testclaw-session-progress-hovercard-${Z}`,`session-progress-hovercard`),this.animateNextOpen=!1,h?g.dataset.open=`false`:g.dataset.instant=`true`),g.dataset.revision=u,g.setAttribute(`aria-label`,s(`sessionHovercard.ariaLabel`)),y(Ue({row:i,selfUserId:this.applicationContext?.gateway.snapshot.selfUser?.id,avatarAuth:l,personActivity:this.personActivity(),automationLink:this.applicationContext?{href:`${ne(`cron`,this.applicationContext.basePath)}?${new URLSearchParams({session:n,agent:t.agentId})}`,navigate:()=>{let e=this.applicationContext;this.close(),e?.navigate(`cron`,{search:`?${new URLSearchParams({session:n,agent:t.agentId})}`})}}:void 0,pullRequests:a,progressCard:this.lastProgressCard}),g),!g.firstElementChild){this.hovercard.clearCard(),this.hovercard.pointerOverCard=!1,this.hovercard.cardFocusInside=!1;return}if(d){if(f&&!g.contains(document.activeElement)){let e=this.hovercard.focusables(),t=(m?e.find(e=>e instanceof HTMLAnchorElement&&e.href===m):void 0)??e[p];t?t.focus({preventScroll:!0}):(this.hovercard.cardFocusInside=!1,this.hovercard.returnFocus(this.activeTrigger),this.hovercard.focusInside=document.activeElement===this.activeTrigger)}this.hovercard.position();return}g.addEventListener(`pointerleave`,this.handleCardPointerLeave),g.addEventListener(`keydown`,this.hovercard.handleCardKeyDown),this.hovercard.mount(e,g,Ce(e),!1,()=>y(_,g)),h&&(g.offsetWidth,window.setTimeout(()=>{this.hovercard.card===g&&this.open&&(g.dataset.open=`true`)},0))}personActivity(){let e=this.applicationContext;return e?Se(e,()=>this.close()):void 0}close(e=!1){let t=this.open;this.hovercard.reset(e?X:0),this.loadGeneration+=1,this.open=!1,this.animateNextOpen=!0,this.lastProgressCard=null,this.activeTargetObserver.disconnect(),this.progressCards?.unwatch(this),this.releasePullRequestStore(),this.activeTarget=null,this.activeTrigger=null,this.activeSession=null,t&&(this.clearSkipDelayTimer(),this.skipDelayTimer=window.setTimeout(()=>{this.skipDelayTimer=null,this.delayed=!0},J))}clearSkipDelayTimer(){this.skipDelayTimer!==null&&(window.clearTimeout(this.skipDelayTimer),this.skipDelayTimer=null)}}})))()}$();export{Q as SessionProgressHovercardProvider};
//# sourceMappingURL=session-progress-hovercard.runtime-DO4LJR_B.js.map