import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Hi as t,Jr as n,oo as r,qi as i,qr as a,ti as o,uo as s}from"./control-ui-foundation-CGMdhB5v.js";import{$l as c,Bl as l,Bs as u,Hl as ee,Jl as d,Rs as f,_n as te,ac as p,ft as ne,ic as re,lt as ie,nn as ae,za as oe,zs as m}from"./control-ui-core-S9jKXqB5.js";import{$ as h,X as g,Y as _,_ as se,c as v,ct as y,i as ce,m as le,nt as ue,o as b,r as de,s as x,t as fe,ut as pe}from"./lit-runtime-DWoPVI38.js";import{Di as me,Fi as S,Fr as C,Ii as w,Oi as he,Xn as ge,Yn as _e}from"./control-ui-core-G2U4O6rB.js";import{c as ve,s as T}from"./gateway-runtime-BV4hxqU_.js";import{_ as E,go as ye,ho as be,ot as xe,st as Se,v as D}from"./control-ui-boot-shared-ooxiG3qa.js";import{G as O,H as Ce,U as we,V as Te}from"./control-ui-boot-shared-C3bL_9oq.js";import{At as k,Dr as Ee,Mt as De,Ot as Oe,er as ke,f as Ae,ht as A,kt as je,nr as Me,p as Ne,wr as Pe,wt as Fe,yt as Ie}from"./control-ui-boot-shared-CCYBAAP9.js";import{C as Le,D as Re,E as ze,O as Be,Q as Ve,U as He,W as Ue,j,k as We,tt as Ge,w as Ke}from"./control-ui-boot-shared-VDjYq2Zh.js";import{n as qe,t as Je}from"./settings-workspace-DJAhLnkQ.js";import{a as Ye,i as M,n as Xe,o as Ze,r as Qe,s as $e,t as et}from"./skills-shared-DCdiA2QU.js";import{i as tt,n as nt,r as rt,t as it}from"./plugins-hub-header-D0sv93ul.js";function at(e){return e===N.SECURITY_UNAVAILABLE||e===N.DOWNLOAD_BLOCKED}function ot(e){if(!i(e))return;let t=at(e.clawhubTrustCode)?e.clawhubTrustCode:void 0,n=s(e.version),r=s(e.warning);if(t||n||r)return{...t?{clawhubTrustCode:t}:{},...n?{version:n}:{},...r?{warning:r}:{}}}var N;function st(){return(st=e((()=>{N={SECURITY_UNAVAILABLE:`clawhub_security_unavailable`,DOWNLOAD_BLOCKED:`clawhub_download_blocked`}})))()}function ct(e){return e.installRef??e.slug}async function lt(e,t,n){return(await e.request(`skills.search`,{query:t.trim()||void 0,limit:20},{signal:n}))?.results??[]}function ut(e){return e?.trim()||void 0}async function dt(e,t,n,r){let i,a=await e.runExternalMutation(async e=>{if(e!==t)throw Error(`Connection changed before the skill update started.`);try{return await e.request(`skills.update`,n)}catch(e){throw i=e instanceof Error?e:Error(String(e)),i}},{canDispatch:r,dispatchError:`Access changed before the skill update started.`});if(!a.ok)throw i??Error(a.error);return a.refresh.ok?null:a.refresh.error}function ft(e,t){return{kind:`success`,message:t?`${e}\n${t}`:e}}function P(e,t,n){return e.connected&&e.client===t&&e.skillOperation===n}function F(e,t){e.skillOperation===t&&(e.skillOperation=null)}function pt(e,t,n){t.trim()&&(e.skillMessages={...e.skillMessages,[t]:n})}function mt(e){if(e&&typeof e==`object`&&`details`in e)return ot(e.details)}function I(e){return`${e.registry}\0${e.ownerHandle??``}\0${e.slug}\0${e.version}`}function ht(e){return!!(e&&e.status===`linked`&&e.valid)}function gt(e){return e.skills.some(e=>ht(e.clawhub))}function L(e){if(!e.skillCard?.present)return;let t=e.clawhub?.status===`linked`&&e.clawhub.valid?e.clawhub.installedVersion:``;return`${e.skillCard.path}\0${e.skillCard.sizeBytes}\0${t}`}function R(e,t){let n=e.skillsReport?.skills.find(e=>e.skillKey===t);return n?L(n):void 0}function z(e){let t=e.skillsAgentId?.trim();return t?{agentId:t}:{}}function B(e){return{agentId:e.skillsAgentId,revision:e.skillsAgentRevision}}function V(e,t){return e.skillsAgentId===t.agentId&&e.skillsAgentRevision===t.revision}async function _t(e,t,n,r,i){try{let r=await t();if(!e())return;n(r)}catch(t){if(!e())return;r(t)}i()}function H(e,t){let n=t?.trim()||null;e.skillsAgentId!==n&&(e.skillsAgentId=n,e.skillsAgentRevision++,e.skillsLoading=!1,e.skillsReport=null,e.skillsError=null,e.skillEdits={},e.skillMessages={},e.clawhubInstallMessage=null,e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null,e.skillCardContents={},e.skillCardContentKeys={},e.skillCardLoadingKey=null,e.skillCardErrors={})}function vt(e,t){t&&H(e,t.agents.some(t=>t.id===e.skillsAgentId)?e.skillsAgentId:t.agents.some(e=>e.id===t.defaultId)?t.defaultId:null)}async function U(e,t){let n=e.client,r=e.skillsAgentId?.trim();if(!n||!r||!e.connected||e.skillsLoading||e.skillOperation&&e.skillOperation!==t?.operation)return;t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={});let i=B(e),a=()=>e.client===n&&V(e,i)&&(!t?.operation||e.skillOperation===t.operation),o=()=>e.connected&&a();e.skillsLoading=!0,e.skillsError=null;try{let t=await oe(n,r);if(!o())return;t&&Array.isArray(t.skills)&&(e.skillsReport=t,bt(e,t),St(e,t))}catch(t){if(!o())return;e.skillsError=f(t)}finally{a()&&(e.skillsLoading=!1)}}async function W(e,t,n,r=!1){let i=r;for(;P(e,t,n);){let r=B(e);if(await U(e,{clearMessages:i,operation:n}),i=!1,!P(e,t,n)||V(e,r))return}}async function yt(e,t){let n=e.client;if(!n||!e.connected||e.skillsLoading||e.skillOperation)return;let r={kind:`refresh`};e.skillOperation=r;try{if(await t(),!P(e,n,r))return;await W(e,n,r,!0)}finally{F(e,r)}}function bt(e,t){let n=new Map(t.skills.map(e=>[e.skillKey,L(e)]).filter(e=>e[1]!==void 0));e.skillCardContents=Object.fromEntries(Object.entries(e.skillCardContents).filter(([t])=>e.skillCardContentKeys[t]===n.get(t))),e.skillCardContentKeys=Object.fromEntries(Object.entries(e.skillCardContentKeys).filter(([e,t])=>t===n.get(e))),e.skillCardErrors=Object.fromEntries(Object.entries(e.skillCardErrors).filter(([e])=>n.has(e))),e.skillCardLoadingKey&&!n.has(e.skillCardLoadingKey)&&(e.skillCardLoadingKey=null)}async function xt(e,t){if(!e.client||!e.connected||e.skillCardLoadingKey===t||e.skillCardContents[t]!==void 0&&e.skillCardContentKeys[t]===R(e,t))return;let n=R(e,t);if(!n)return;let r=B(e),i={...z(e),skillKey:t};e.skillCardLoadingKey=t;let{[t]:a,...o}=e.skillCardErrors;e.skillCardErrors=o;try{let a=await e.client.request(`skills.skillCard`,i);V(e,r)&&a?.skillKey===t&&typeof a.content==`string`&&R(e,t)===n&&(e.skillCardContents={...e.skillCardContents,[t]:a.content},e.skillCardContentKeys={...e.skillCardContentKeys,[t]:n})}catch(n){V(e,r)&&(e.skillCardErrors={...e.skillCardErrors,[t]:f(n)})}finally{V(e,r)&&e.skillCardLoadingKey===t&&(e.skillCardLoadingKey=null)}}async function St(e,t){let n=e.client,r=B(e);if(!n||!e.connected||!gt(t)){e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null;return}e.clawhubVerdictsLoading=!0,e.clawhubVerdictsError=null;try{let t=await n.request(`skills.securityVerdicts`,z(e));if(!V(e,r))return;e.clawhubVerdicts=Object.fromEntries((t?.items??[]).map(e=>[I({registry:e.registry,slug:e.requestedSlug,ownerHandle:e.requestedOwnerHandle,version:e.requestedVersion}),e]))}catch(t){if(!V(e,r))return;e.clawhubVerdicts={},e.clawhubVerdictsError=f(t)}finally{V(e,r)&&(e.clawhubVerdictsLoading=!1)}}function Ct(e,t,n){e.skillOperation||e.skillsLoading||(e.skillEdits={...e.skillEdits,[t]:n})}async function wt(e,t,n){let r=e.client;if(!r||!e.connected||e.skillsLoading||e.skillOperation)return;let i=B(e),a={kind:`skill`,skillKey:t};e.skillOperation=a,e.skillsError=null;try{let o=await n(r);if(!P(e,r,a)||!V(e,i)||(await U(e,{operation:a}),!P(e,r,a)||!V(e,i)))return;pt(e,t,o)}catch(n){if(!P(e,r,a)||!V(e,i))return;let o=f(n);e.skillsError=o,pt(e,t,{kind:`error`,message:o})}finally{P(e,r,a)&&!V(e,i)&&await W(e,r,a),F(e,a)}}async function Tt(e,t,n,r=()=>!0){await Et(e,t,{enabled:n},n?`Skill enabled`:`Skill disabled`,r)}async function Et(e,t,n,r,i){await wt(e,t,async a=>ft(r,await dt(e.runtimeConfig,a,{skillKey:t,...n},i)))}async function Dt(e,t,n=()=>!0){let r=ut(e.skillEdits[t]);r&&await Et(e,t,{apiKey:r},`API key saved — stored in testclaw.json (skills.entries.${t})`,n)}async function Ot(e,t,n,r,i=!1){await wt(e,t,async t=>{let a=await t.request(`skills.install`,{...z(e),name:n,installId:r,dangerouslyForceUnsafeInstall:i});return{kind:`success`,message:m(a?.message,`Installed`)}})}async function kt(e,t){if(!e.client||!e.connected)return;let n=e.client,r=B(e);e.clawhubDetailRef=t,e.clawhubDetailLoading=!0,e.clawhubDetailError=null,e.clawhubDetail=null,await _t(()=>e.connected&&e.client===n&&t===e.clawhubDetailRef&&V(e,r),()=>n.request(`skills.detail`,{slug:t}),t=>{e.clawhubDetail=t??null},t=>{e.clawhubDetailError=f(t)},()=>{e.clawhubDetailLoading=!1})}function At(e){e.clawhubDetailRef=null,e.clawhubDetail=null,e.clawhubDetailError=null,e.clawhubDetailLoading=!1}async function jt(e,t,n){let r=e.client;if(!r||!e.connected||e.skillsLoading||e.skillOperation)return;let i=B(e),a={kind:`clawhub`,ref:t};e.skillOperation=a,e.clawhubInstallMessage=null;try{let o=await r.request(`skills.install`,{...z(e),source:`clawhub`,slug:t,...n?{version:n}:{}});if(!P(e,r,a)||!V(e,i)||(await U(e,{operation:a}),!P(e,r,a)||!V(e,i)))return;e.clawhubInstallMessage={kind:`success`,text:G(m(o?.message,`Installed ${t}`),o?.warning?m(o.warning):void 0)}}catch(t){if(P(e,r,a)&&V(e,i)){let n=mt(t);e.clawhubInstallMessage={kind:`error`,text:G(f(t),n?.warning)}}}finally{P(e,r,a)&&!V(e,i)&&await W(e,r,a),F(e,a)}}var G;function K(){return(K=e((()=>{st(),u(),G=(e,t)=>t?`${e}\n\n${t}`:e})))()}var Mt;function Nt(){return(Nt=e((()=>{ge(),d(),u(),ve(),ze(),Mt=class{constructor(e,t,n,r){this.host=e,this.gateway=t,this.selectedAgent=n,this.refreshWorkspace=r,this.list=null,this.view=null,this.loading=!1,this.busy=!1,this.error=null,this.notice=null,this.draft=null,this.importVisible=!1,this.importSlug=``,this.importSource=null,this.importSelection=[],this.newFilePath=``,this.query=``,this.readSequence=0}changed(){this.host.requestUpdate()}clearFeedback(){this.error=null,this.notice=null}get importOpen(){return this.importVisible}set importOpen(e){this.clearFeedback(),this.importVisible=e,e||(this.importSlug=``,this.importSource=null,this.importSelection=[])}reset(){this.readSequence++,this.list=null,this.view=null,this.loading=!1,this.busy=!1,this.draft=null,this.importOpen=!1,this.newFilePath=``,this.query=``}get showWorkspace(){return this.view===null||this.view===`workspace`}get canWrite(){return T(this.gateway.snapshot,`skills.library.save`,`operator.write`,{requireAdvertisement:!1})}get canTransfer(){return T(this.gateway.snapshot,`skills.library.mutate`,`operator.admin`,{requireAdvertisement:!1})}get createTarget(){return this.showWorkspace&&this.list?.canManageWorkspace?`workspace`:this.list?.profileId?`personal`:`unavailable`}get canCreate(){return this.loading?!1:this.createTarget===`workspace`?T(this.gateway.snapshot,`skills.proposals.create`,`operator.admin`,{requireAdvertisement:!1}):this.createTarget===`personal`&&this.canWrite}get canEdit(){return this.canWrite&&(this.draft?.entry?.canEdit??!0)}async load(){let e=this.gateway.capture();if(e&&!this.loading){this.loading=!0,this.error=null,this.changed();try{let t=await e.client.request(`skills.library.list`,{scope:`all`});if(!this.gateway.isCurrent(e))return;this.list=t,this.view??=t.defaultTarget===`personal`?`mine`:`workspace`}catch(t){this.gateway.isCurrent(e)&&(this.error=f(t))}finally{this.gateway.isCurrent(e)&&(this.loading=!1,this.changed())}}}create(){let e=this.gateway.capture();e&&this.canCreate&&this.createTarget!==`unavailable`&&(this.draft={target:this.createTarget,connection:e,agentId:this.selectedAgent(),entry:null,slug:``,description:``,content:``,files:[],revisions:[],selectedFile:`SKILL.md`,rollbackRevision:``,dirty:!1,proposal:null},this.clearFeedback(),this.newFilePath=``,this.changed())}close(){this.busy||this.draft?.dirty&&!window.confirm(c(`skillLibrary.discard`))||(this.readSequence++,this.draft=null,this.importOpen=!1,this.newFilePath=``,this.changed())}async open(e){if(this.draft?.dirty&&!window.confirm(c(`skillLibrary.discard`)))return;let t=this.gateway.capture();if(!t||this.busy)return;let n=++this.readSequence;await this.perform(async()=>{let r=await t.client.request(`skills.library.read`,{skillId:e});this.gateway.isCurrent(t)&&n===this.readSequence&&(this.draft={target:`personal`,connection:t,agentId:null,entry:r.entry,slug:r.entry.slug,description:r.entry.description,content:r.content,files:r.files,revisions:r.revisions,selectedFile:`SKILL.md`,rollbackRevision:``,dirty:!1,proposal:null})})}async perform(e){if(this.busy||this.loading)return;let n=this.gateway.capture();if(!n){this.error=c(`skillLibrary.connectionChanged`),this.changed();return}this.busy=!0,this.clearFeedback(),this.changed();try{await e()}catch(e){if(this.gateway.isCurrent(n)){let n=e instanceof _e?t(e.details)?.code:void 0;this.error=n===`SKILL_LIBRARY_CONFLICT`?c(`skillLibrary.conflict`):n===`SKILL_LIBRARY_IDENTITY_REQUIRED`?c(`skillLibrary.signIn`):f(e)}}finally{this.gateway.isCurrent(n)&&(this.busy=!1,this.changed())}}async receipt(e){this.notice=c(`skillLibrary.receipt.${e.state}`,{slug:e.entry.slug,target:e.target,owner:e.entry.ownerLabel})+` `+e.nextAction,await this.load()}async save(){let e=this.draft;e&&this.canEdit&&await this.perform(async()=>{if(!this.gateway.isCurrent(e.connection))throw Error(c(`skillLibrary.connectionChanged`));let t=e.connection.client;if(e.target===`workspace`){if(!e.agentId)throw Error(c(`skillLibrary.selectAgent`));let n=e.files.map(e=>{let t=Re(e);if(t===null||e.executable)throw Error(c(`skillLibrary.workspaceTextOnly`));return{path:e.path,content:t}}),r=await t.request(`skills.proposals.create`,{agentId:e.agentId,name:e.slug,description:e.description,content:e.content,supportFiles:n});if(!this.gateway.isCurrent(e.connection))return;e.proposal=r,e.dirty=!1,this.notice=c(`skillLibrary.pending`,{id:r.record.id,agent:e.agentId});return}let n=await t.request(`skills.library.save`,{...e.entry?{skillId:e.entry.skillId}:{},expectedRevision:e.entry?.revision??null,slug:e.slug,content:e.content,files:e.files});this.gateway.isCurrent(e.connection)&&(e.entry=n.entry,e.dirty=!1,e.revisions=[{revision:n.entry.revision,createdAt:n.entry.updatedAt},...e.revisions.filter(e=>e.revision!==n.entry.revision)],await this.receipt(n))})}async applyWorkspace(){let e=this.draft,t=e?.proposal,n=e?.agentId;e&&t&&n&&await this.perform(async()=>{if(!this.gateway.isCurrent(e.connection))throw Error(c(`skillLibrary.connectionChanged`));let r=await e.connection.client.request(`skills.proposals.apply`,{agentId:n,proposalId:t.record.id,expectedRevisionHash:t.revisionHash});this.gateway.isCurrent(e.connection)&&(this.draft=null,this.notice=c(`skillLibrary.workspaceSaved`,{agent:n,state:r.record.status}),await this.refreshWorkspace())})}async mutate(e){let t=this.draft,n=t?.entry;t&&n&&this.canEdit&&!t.dirty&&(e!==`remove`&&e!==`transfer`||window.confirm(c(`skillLibrary.confirm.${e}`,{slug:t.slug})))&&await this.perform(async()=>{if(!this.gateway.isCurrent(t.connection))throw Error(c(`skillLibrary.connectionChanged`));let r=await t.connection.client.request(`skills.library.mutate`,{skillId:n.skillId,expectedRevision:n.revision,action:e,...e===`rollback`?{revision:t.rollbackRevision}:{}});if(this.gateway.isCurrent(t.connection)&&(e===`remove`&&(this.draft=null),await this.receipt(r),this.gateway.isCurrent(t.connection)&&e!==`remove`)){if(e===`rollback`){let e=await t.connection.client.request(`skills.library.read`,{skillId:r.entry.skillId,revision:r.entry.revision});if(!this.gateway.isCurrent(t.connection))return;t.content=e.content,t.files=e.files,t.revisions=e.revisions,t.selectedFile=`SKILL.md`,t.rollbackRevision=``}t.entry=r.entry}})}async importFiles(e){if(!e.length)return;let t=this.gateway.capture();t&&await this.perform(async()=>{let[n]=e;if(n&&e.length===1&&n.name.toLowerCase().endsWith(`.zip`)){if(this.createTarget===`workspace`)throw Error(c(`skillLibrary.workspaceTextOnly`));if(!this.list?.profileId)throw Error(c(`skillLibrary.signIn`));let e=await We(t.client,n,this.importSlug,()=>this.gateway.isCurrent(t));this.gateway.isCurrent(t)&&(this.importOpen=!1,await this.receipt(e));return}let r=await Be(e);this.gateway.isCurrent(t)&&(this.create(),this.draft&&(Object.assign(this.draft,r,{slug:this.importSlug,dirty:!0}),this.importOpen=!1))})}async importClawHub(e,t,n){let r=this.gateway.capture();r&&this.list?.profileId&&this.canWrite&&await this.perform(async()=>{let i=await r.client.request(`skills.library.import`,{slug:e,source:{kind:`clawhub`,slug:t,...n?{version:n}:{}}});this.gateway.isCurrent(r)&&(this.importOpen=!1,await this.receipt(i))})}}})))()}function Pt(e){return k({kind:e?`ok`:`muted`,label:c(e?`skillsPage.enabled`:`skillsPage.disabled`)})}function q(e,t){let n=e.clawhub;return n?.valid?t[I({registry:n.registry,slug:n.slug,ownerHandle:n.ownerHandle,version:n.installedVersion})]??null:null}function Ft(e,t){let n=`clawhub`in e&&e.clawhub?.status===`invalid`?e.clawhub.reason:null,r=`eligible`in e?M(e):!e.disabled,i=t&&(!t.ok||t.decision!==`pass`),a=i&&t.securityStatus===`malicious`,o=n||a?`danger`:i?`warn`:e.disabled?`muted`:r?`ok`:`warn`,s=c(i?a?`skillsPage.verdict.blocked`:`skillsPage.verdict.review`:n?`skillsPage.invalidLink`:e.disabled?`skillsPage.tabs.disabled`:r?`eligible`in e?`skillsPage.tabs.ready`:`skillsPage.enabled`:`skillsPage.tabs.needsSetup`),l=`missing`in e?[...Xe(e),...et(e)]:[c(`skillDiscovery.libraryStatus`)],u=[s,n,...i?t.reasons??[]:[],...l].filter(Boolean).join(` · `);return h`<span
    class="plugin-catalog-card__status settings-status settings-status--${o}"
    role="img"
    tabindex="0"
    aria-label=${u}
    title=${u}
  >
    <span class="settings-status__dot" aria-hidden="true"></span>
  </span>`}function J(){return(J=e((()=>{_(),A(),d(),E(),Qe(),K(),D()})))()}function It(e){let t=e.list,n=[],r=!!t?.entries.length;(t?.multipleProfiles||r||t?.defaultTarget===`personal`)&&(t?.profileId&&n.push({value:`mine`,label:c(`skillLibrary.mine`)}),(t?.multipleProfiles||t?.entries.some(e=>e.shared||e.ownerProfileId===null))&&n.push({value:`team`,label:c(`skillLibrary.team`)}),n.push({value:`all`,label:c(`skillLibrary.all`)},{value:`workspace`,label:c(`skillLibrary.inventory`)}));let i=e.query.toLowerCase().trim(),a=(t?.entries??[]).filter(n=>(e.view===`mine`?n.ownerProfileId===t?.profileId:e.view!==`team`||n.shared||n.ownerProfileId===null)&&(!i||`${n.slug} ${n.name} ${n.description} ${n.ownerLabel}`.toLowerCase().includes(i)));return h`
    <div class="plugins-toolbar">
      ${n.length>0?je({value:e.view??`workspace`,ariaLabel:c(`skillLibrary.library`),options:n,onChange:t=>{e.view=t,e.changed()}}):g}
      <button
        type="button"
        class="btn"
        ?disabled=${!e.canCreate||e.busy}
        @click=${()=>e.create()}
      >
        ${c(`skillLibrary.create`)}
      </button>
      <button
        type="button"
        class="btn"
        ?disabled=${!e.canCreate||e.busy}
        @click=${()=>{e.importOpen=!0,e.importSource=null,e.changed()}}
      >
        ${c(`skillLibrary.import`)}
      </button>
      ${e.showWorkspace?g:h`<button
              type="button"
              class="btn"
              ?disabled=${e.loading||e.busy}
              @click=${()=>void e.load()}
            >
              ${c(`common.refresh`)}
            </button>`}
    </div>
    ${t?.defaultTarget===`unavailable`?h`<p class="muted">${c(`skillLibrary.signIn`)}</p>`:g}
    ${e.error&&!e.draft&&!e.importOpen?h`<div class="callout danger" role="alert">${e.error}</div>`:g}
    ${e.notice&&!e.draft?h`<div class="callout success" role="status">${e.notice}</div>`:g}
    ${t&&!e.showWorkspace?h`<p class="muted">
              ${c(`skillLibrary.defaultLimit`,{count:String(t.defaultSelectionLimit)})}
            </p>
            ${t.defaultSelectionNotice?h`<p class="callout" role="status">${t.defaultSelectionNotice}</p>`:g}`:g}
    ${e.showWorkspace?g:h`
            <label class="field"
              ><span>${c(`common.search`)}</span
              ><input
                class="settings-input"
                name="library-search"
                .value=${e.query}
                placeholder=${c(`skillLibrary.search`)}
                @input=${t=>{e.query=j(t,HTMLInputElement).value,e.changed()}}
            /></label>
            ${e.loading?h`<p role="status">${c(`common.loading`)}</p>`:Oe({title:c(`skillLibrary.${e.view}`),count:a.length},a.length===0?Ie(c(`skillLibrary.empty`)):v(a,e=>e.skillId,t=>h` <div class="settings-row">
                            <button
                              type="button"
                              class="settings-row__text plugins-item__detail-button"
                              ?disabled=${e.loading||e.busy}
                              @click=${()=>void e.open(t.skillId)}
                            >
                              <span class="settings-row__title">${t.slug}</span>
                              <span class="settings-row__desc">${t.description}</span>
                              <span class="settings-row__desc"
                                >${t.ownerLabel} ·
                                ${t.shared?c(`skillLibrary.shared`):c(`skillLibrary.private`)}
                                · ${t.revision.slice(0,8)}</span
                              >
                            </button>
                            <div class="settings-row__control">
                              ${Pt(t.enabled)}
                            </div>
                          </div>`))}
          `}
    ${Y(e)}
  `}function Lt(e){let t=e.draft;if(!t)return g;let n=t.proposal!==null,r=!e.canEdit||e.busy||e.loading||n,i=t.files.find(e=>e.path===t.selectedFile),a=t.selectedFile===`SKILL.md`?t.content:i?Re(i):null,o=n=>{r||(t.selectedFile===`SKILL.md`?t.content=n:t.files=t.files.map(e=>e.path===t.selectedFile?{...e,content:n,encoding:`utf8`}:e),t.dirty=!0,e.changed())},s=r||t.dirty,l=(t,n=s)=>h`<button
      type="button"
      class=${t===`remove`?`btn danger`:`btn`}
      ?disabled=${n}
      @click=${()=>void e.mutate(t)}
    >
      ${c(`skillLibrary.${t}`)}
    </button>`;return h` <testclaw-modal-dialog
    label=${t.entry?.slug??c(`skillLibrary.create`)}
    style="--testclaw-modal-width: 960px;"
    @modal-cancel=${t=>{t.preventDefault(),e.close()}}
  >
    <form
      class="exec-approval-card skill-reader-dialog"
      @submit=${t=>{t.preventDefault(),e.save()}}
      @keydown=${e=>{(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&!r&&(e.preventDefault(),j(e,HTMLFormElement).requestSubmit())}}
    >
      <div class="exec-approval-header">
        <strong class="exec-approval-title">${t.entry?.slug??c(`skillLibrary.create`)}</strong
        ><button
          type="button"
          class="btn btn--icon btn--ghost"
          aria-label=${c(`common.close`)}
          ?disabled=${e.busy}
          @click=${()=>e.close()}
        >
          ${S.x}
        </button>
      </div>
      <div
        class="skill-reader-dialog__body"
        style="display: grid; gap: var(--space-4); min-width: 0;"
      >
        <p class="muted">
          ${t.target===`workspace`?c(`skillLibrary.workspaceTarget`,{agent:t.agentId??``}):t.entry?c(`skillLibrary.ownerRevision`,{owner:t.entry.ownerLabel,revision:t.entry.revision.slice(0,8)}):c(`skillLibrary.personalTarget`)}
        </p>
        ${t.entry?Ke(t.entry):g}
        ${e.canEdit?g:h`<p role="status">${c(`skillLibrary.readOnly`)}</p>`}
        <label class="field"
          ><span>${c(`skillLibrary.slug`)}</span
          ><input
            class="settings-input"
            name="library-slug"
            title=${c(`skillLibrary.slugHelp`)}
            required
            pattern="[a-z0-9][a-z0-9\\-]{0,62}"
            maxlength="63"
            ?disabled=${r}
            .value=${b(t.slug)}
            @input=${n=>{t.slug=j(n,HTMLInputElement).value,t.dirty=!0,e.changed()}}
        /></label>
        ${t.target===`workspace`?h`<label class="field"
                ><span>${c(`skillLibrary.description`)}</span
                ><input
                  class="settings-input"
                  name="library-description"
                  required
                  ?disabled=${r}
                  .value=${t.description}
                  @input=${n=>{t.description=j(n,HTMLInputElement).value,t.dirty=!0,e.changed()}}
              /></label>`:g}
        <div class="plugins-toolbar">
          <label class="field" style="min-width: 0; flex: 1;"
            ><span>${c(`skillLibrary.file`)}</span
            ><select
              class="settings-select"
              aria-label=${c(`skillLibrary.file`)}
              .value=${t.selectedFile}
              @change=${n=>{t.selectedFile=j(n,HTMLSelectElement).value,e.changed()}}
            >
              <option value="SKILL.md" ?selected=${t.selectedFile===`SKILL.md`}>
                SKILL.md
              </option>
              ${t.files.map(e=>h`<option value=${e.path} ?selected=${t.selectedFile===e.path}>
                    ${e.path}${e.executable?` *`:``}
                  </option>`)}
            </select></label
          >
          ${i&&e.canEdit?h`<button
                  type="button"
                  class="btn"
                  ?disabled=${r}
                  @click=${()=>{window.confirm(c(`skillLibrary.deleteFileConfirm`,{path:i.path}))&&(t.files=t.files.filter(e=>e.path!==i.path),t.selectedFile=`SKILL.md`,t.dirty=!0,e.changed())}}
                >
                  ${c(`skillLibrary.deleteFile`)}
                </button>`:g}
        </div>
        ${i&&e.canEdit?h`<label class="field checkbox"
                ><input
                  type="checkbox"
                  name="library-file-executable"
                  ?disabled=${r}
                  .checked=${i.executable===!0}
                  @change=${n=>{let r=j(n,HTMLInputElement).checked;t.files=t.files.map(e=>e.path===i.path?{...e,executable:r}:e),t.dirty=!0,e.changed()}}
                /><span>${c(`skillLibrary.executable`)}</span></label
              >`:g}
        ${a===null?h`<p class="muted">${c(`skillLibrary.binary`)}</p>`:h`<label class="field"
                ><span>${t.selectedFile}</span
                ><textarea
                  name="library-content"
                  class="settings-input"
                  spellcheck="false"
                  rows="18"
                  style="font-family: var(--mono); min-width: 0; max-width: 100%; box-sizing: border-box; resize: vertical;"
                  ?readonly=${r}
                  .value=${b(a)}
                  @input=${e=>o(j(e,HTMLTextAreaElement).value)}
                ></textarea>
              </label>`}
        ${r?g:h`<div class="plugins-toolbar">
                <label class="field" style="flex: 1; min-width: 0;"
                  ><span>${c(`skillLibrary.newFile`)}</span
                  ><input
                    class="settings-input"
                    name="library-file-path"
                    .value=${e.newFilePath}
                    @input=${t=>{e.newFilePath=j(t,HTMLInputElement).value,e.changed()}} /></label
                ><button
                  type="button"
                  class="btn"
                  ?disabled=${!e.newFilePath.trim()}
                  @click=${()=>{let n=e.newFilePath.trim();n===`SKILL.md`||t.files.some(e=>e.path===n)?e.error=c(`skillLibrary.fileExists`):(t.files=[...t.files,{path:n,content:``,encoding:`utf8`}],t.selectedFile=n,t.dirty=!0,e.newFilePath=``),e.changed()}}
                >
                  ${c(`skillLibrary.addFile`)}
                </button>
              </div>`}
        ${e.error?h`<div class="callout danger" role="alert">${e.error}</div>`:g}
        ${e.notice?h`<div class="callout success" role="status">${e.notice}</div>`:g}
        <div class="plugins-toolbar">
          ${e.canEdit?n?h`<button
                    type="button"
                    class="btn primary"
                    ?disabled=${e.busy}
                    @click=${()=>void e.applyWorkspace()}
                  >
                    ${c(`skillLibrary.apply`)}
                  </button>`:h`<button
                    type="submit"
                    class="btn primary"
                    ?disabled=${r||!t.dirty||!t.content.trim()}
                  >
                    ${e.busy?c(`common.loading`):t.target===`workspace`?c(`skillLibrary.propose`):c(`skillLibrary.save`)}
                  </button>`:g}
          ${e.canEdit&&t.entry?h`
                  ${l(t.entry.enabled?`disable`:`enable`)}
                  ${t.entry.ownerProfileId?l(t.entry.shared?`unshare`:`share`):g}
                `:g}
        </div>
        ${e.canEdit&&t.entry&&t.revisions.length>1?h`<div class="plugins-toolbar">
                <label class="field" style="flex: 1; min-width: 0;"
                  ><span>${c(`skillLibrary.revision`)}</span
                  ><select
                    class="settings-select"
                    aria-label=${c(`skillLibrary.revision`)}
                    .value=${t.rollbackRevision}
                    ?disabled=${s}
                    @change=${n=>{t.rollbackRevision=j(n,HTMLSelectElement).value,e.changed()}}
                  >
                    <option value="" ?selected=${t.rollbackRevision===``}>
                      ${c(`skillLibrary.selectRevision`)}
                    </option>
                    ${t.revisions.filter(e=>e.revision!==t.entry?.revision).map(e=>h`<option
                            value=${e.revision}
                            ?selected=${t.rollbackRevision===e.revision}
                          >
                            ${new Date(e.createdAt).toLocaleString()} ·
                            ${e.revision.slice(0,8)}
                          </option>`)}
                  </select></label
                >${l(`rollback`,s||!t.rollbackRevision)}
              </div>`:g}
        ${e.canEdit&&t.entry?h`<div
                class="plugins-toolbar"
                style="border-top: 1px solid var(--border); padding-top: var(--space-4);"
              >
                ${e.canTransfer&&t.entry.ownerProfileId?l(`transfer`):g}
                ${l(`remove`)}
              </div>`:g}
      </div>
    </form>
  </testclaw-modal-dialog>`}function Rt(e){if(!e.importOpen)return g;let t=e.importSelection,n=t.length?c(t.length===1?`skillLibrary.selectedFile`:`skillLibrary.selectedFiles`,{count:String(t.length),names:t.slice(0,2).map(e=>e.webkitRelativePath||e.name).join(`, `)+(t.length>2?`, …`:``)}):c(`skillLibrary.noFilesSelected`),r=()=>e.close();return h`<testclaw-modal-dialog
    label=${c(`skillLibrary.import`)}
    @modal-cancel=${e=>{e.preventDefault(),r()}}
  >
    <form
      class="exec-approval-card skill-reader-dialog"
      @submit=${t=>{t.preventDefault(),e.importSource?e.importClawHub(e.importSlug,e.importSource.slug,e.importSource.version):e.importFiles(e.importSelection)}}
    >
      <div class="exec-approval-header">
        <strong class="exec-approval-title">${c(`skillLibrary.import`)}</strong
        ><button
          type="button"
          class="btn btn--icon btn--ghost"
          aria-label=${c(`common.close`)}
          ?disabled=${e.busy}
          @click=${r}
        >
          ${S.x}
        </button>
      </div>
      <div class="skill-reader-dialog__body skill-library-import">
        <p class="muted">
          ${e.importSource?c(`skillLibrary.importClawHub`,{source:e.importSource.slug}):e.createTarget===`workspace`?c(`skillLibrary.importWorkspace`):c(`skillLibrary.importHelp`)}
        </p>
        <label class="field"
          ><span>${c(`skillLibrary.slug`)}</span
          ><input
            class="settings-input"
            required
            name="library-import-slug"
            title=${c(`skillLibrary.slugHelp`)}
            pattern="[a-z0-9][a-z0-9\\-]{0,62}"
            .value=${e.importSlug}
            ?disabled=${e.busy}
            @input=${t=>{e.importSlug=j(t,HTMLInputElement).value,e.changed()}}
        /></label>
        ${e.importSource?g:h`<div class="field" role="group" aria-labelledby="library-import-files-label">
                <span id="library-import-files-label">${c(`skillLibrary.files`)}</span>
                <small id="library-import-files-help" class="settings-row__desc">
                  ${c(e.createTarget===`workspace`?`skillLibrary.workspaceFilesHelp`:`skillLibrary.filesHelp`)}
                </small>
                <div class="plugins-toolbar skill-library-import__pickers">
                  ${[!1,!0].map(t=>h`
                      <button
                        type="button"
                        class="btn"
                        aria-describedby="library-import-files-help library-import-selection"
                        ?disabled=${e.busy}
                        @click=${e=>{let t=j(e,HTMLButtonElement).nextElementSibling;t instanceof HTMLInputElement&&t.click()}}
                      >
                        ${c(t?`skillLibrary.chooseFolderButton`:`skillLibrary.chooseFilesButton`)}
                      </button>
                      <input
                        type="file"
                        hidden
                        ?webkitdirectory=${t}
                        multiple
                        name=${t?`library-import-directory`:`library-import-files`}
                        ?disabled=${e.busy}
                        @change=${t=>{let n=j(t,HTMLInputElement);e.importSelection=Array.from(n.files??[]),n.value=``,e.changed()}}
                      />
                    `)}
                </div>
                <div class="plugins-toolbar">
                  <small
                    id="library-import-selection"
                    class="settings-row__desc"
                    aria-live="polite"
                  >
                    ${n}
                  </small>
                  ${t.length?h`<button
                          type="button"
                          class="btn btn--sm btn--ghost"
                          ?disabled=${e.busy}
                          @click=${()=>{e.importSelection=[],e.changed()}}
                        >
                          ${c(`skillLibrary.clearSelection`)}
                        </button>`:g}
                </div>
              </div>`}
        ${e.error?h`<div class="callout danger" role="alert">${e.error}</div>`:g}
        <button
          type="submit"
          class="btn primary"
          ?disabled=${e.busy||!e.importSource&&t.length===0}
        >
          ${e.busy?c(`common.loading`):c(`skillLibrary.import`)}
        </button>
      </div>
    </form>
  </testclaw-modal-dialog>`}var Y;function zt(){return(zt=e((()=>{_(),ce(),x(),w(),A(),C(),d(),Le(),ze(),J(),Y=e=>h`${Lt(e)} ${Rt(e)}`})))()}function X(e){let t=e.clawhub;return t?.valid?t.requestedReference??(t.ownerHandle?`@${t.ownerHandle}/${t.slug}`:null):null}function Bt(e){let t=e.libraries.filter(e=>!e.removed).map(t=>({id:`library:${t.skillId}`,name:t.slug,description:t.description,attribution:t.ownerLabel,library:t,skill:e.skills.find(e=>e.source===`testclaw-library`&&e.name===t.name)})),n=new Set(e.libraries.map(e=>e.name));for(let r of e.skills)r.source===`testclaw-library`&&n.has(r.name)||t.push({id:`local:${r.skillKey}`,name:r.name,description:r.description,attribution:X(r)??r.source,skill:r});let r=new Set;for(let n of e.results){let e=ct(n),i=`${n.registry}\n${e}`;if(r.has(i))continue;r.add(i);let a=t.find(t=>t.skill?.clawhub?.valid&&t.skill.clawhub.registry===n.registry&&X(t.skill)===e);a?a.remote=n:t.push({id:`remote:${e}`,name:n.displayName,description:n.summary??``,attribution:e,remote:n})}let i=e.query.trim().toLowerCase();return t.filter(e=>e.remote||!i||`${e.name} ${e.description} ${e.attribution}`.toLowerCase().includes(i))}function Vt(){return(Vt=e((()=>{})))()}function Ht(e,t){let{state:n}=t,r=e.remote,i=r?ct(r):``,a=!!(e.skill||e.library),o=a||!r?.installOnly,s=r?.icon?n.clawhubIconUrls?.[r.icon]:void 0,l=n.skillOperation?.kind===`clawhub`&&n.skillOperation.ref===i;return h`<article
    class="plugin-catalog-card oc-card oc-card-interactive"
    data-skill-id=${e.id}
  >
    ${o?h`<button
            type="button"
            class="plugin-catalog-card__primary-link skill-discovery-card__open"
            aria-label=${c(`skillsPage.openDetails`,{name:e.name})}
            @click=${()=>e.library?t.onLibraryOpen?.(e.library.skillId):e.skill?t.onDetailOpen(e.skill.skillKey):t.onClawHubDetailOpen(i)}
          ></button>`:g}
    <div class="plugin-catalog-card__head">
      <div class="installed-plugins-card__head">
        <span class="installed-plugins-card__art plugin-catalog-card__art" aria-hidden="true">
          ${s?h`<img src=${s} alt="" loading="lazy" />`:e.skill?.emoji??S.bookOpenText}
        </span>
        <div class="installed-plugins-card__identity">
          <div class="plugin-card-title-row"><h2>${e.name}</h2></div>
          <span class="plugin-card-author">${e.attribution}</span>
        </div>
      </div>
      <div class="plugin-catalog-card__action">
        ${a?Ft(e.skill??{disabled:!e.library.enabled},e.skill?q(e.skill,n.clawhubVerdicts):null):h`<button
                type="button"
                class="btn btn--sm plugin-catalog-card__install oc-action oc-action-secondary"
                ?disabled=${!n.connected||!t.canInstall||t.loading||n.skillOperation!==null}
                aria-label=${c(`skillsPage.installNamed`,{name:e.name})}
                @click=${()=>t.onClawHubInstall(i)}
              >
                ${c(l?`skillsPage.installing`:`skillsPage.install`)}
              </button>`}
      </div>
    </div>
    ${Ge(e.description)}
    ${r?.trustState?h`<span class="muted skill-discovery-card__notice">${c(`skillsPage.notScannedByClawHub`)}</span>`:g}
  </article>`}function Ut(e){let{state:t}=e,n=Bt({skills:t.skillsReport?.skills??[],libraries:e.libraryEntries??[],results:t.clawhubSearchResults??[],query:t.clawhubSearchQuery});return h`<section
    class="plugin-catalog-results skill-discovery"
    aria-label=${c(`skillsPage.title`)}
  >
    <label class="plugin-catalog-search">
      <span aria-hidden="true">${S.search}</span>
      <input
        type="search"
        class="settings-input"
        name="skills-search"
        autocomplete="off"
        autofocus
        aria-label=${c(`skillDiscovery.search`)}
        placeholder=${c(`skillDiscovery.search`)}
        .value=${t.clawhubSearchQuery}
        @input=${t=>{e.onClawHubQueryChange(t.currentTarget.value)}}
        ${se(e=>{e instanceof HTMLInputElement&&!e.dataset.autofocused&&(e.dataset.autofocused=`true`,queueMicrotask(()=>{e.isConnected&&e.focus({preventScroll:!0})}))})}
      />
    </label>
    ${e.error?h`<div class="callout danger" role="alert">${e.error}</div>`:g}
    ${t.connected?g:h`<p role="status" class="muted">${c(`skillsPage.disconnected`)}</p>`}
    ${t.clawhubSearchError?h`<div class="callout danger" role="alert">
            ${t.clawhubSearchError}
            <button
              type="button"
              class="btn btn--sm"
              @click=${()=>e.onClawHubQueryChange(t.clawhubSearchQuery)}
            >
              ${c(`common.retry`)}
            </button>
          </div>`:g}
    ${t.clawhubInstallMessage?h`<div
            role=${t.clawhubInstallMessage.kind===`error`?`alert`:`status`}
            class="callout ${t.clawhubInstallMessage.kind===`error`?`danger`:`success`}"
          >
            ${t.clawhubInstallMessage.text}
          </div>`:g}
    <div
      class="plugin-catalog-grid plugin-catalog-grid--results"
      aria-busy=${e.loading||t.clawhubSearchLoading}
    >
      ${v(n,e=>e.id,t=>Ht(t,e))}
    </div>
    ${n.length===0&&!e.loading&&!t.clawhubSearchLoading&&t.connected&&!t.clawhubSearchError?h`<p class="muted" role="status">${c(`skillsPage.empty`)}</p>`:g}
  </section>`}function Wt(){return(Wt=e((()=>{_(),le(),x(),w(),d(),E(),Ve(),Vt(),J(),D()})))()}function Z(e){return e?ne(e,window.location.href):null}function Gt(e,t){switch(t){case`all`:return!0;case`ready`:return!e.disabled&&M(e);case`needs-setup`:return!e.disabled&&!M(e);case`disabled`:return e.disabled}throw Error(`Unsupported skills status filter`)}function Kt(e){return e.disabled?`muted`:M(e)?`ok`:`warn`}function qt(e,t){if(!e)return t?{label:c(`skillsPage.refreshing`),kind:`muted`,chipClass:`chip`}:{label:c(`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`};let n=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?{label:n===`clean`||!n?c(`skillsPage.verdict.clean`):n,kind:`ok`,chipClass:`chip-ok`}:n===`pending`||n===`not-run`?{label:c(`skillsPage.verdict.pending`),kind:`muted`,chipClass:`chip`}:{label:c(n===`malicious`?`skillsPage.verdict.blocked`:n===`suspicious`?`skillsPage.verdict.review`:`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`}}function Q(e){return e.loading||e.state.skillOperation!==null}function Jt(e){return Q(e)||!e.canUpdate}function Yt(e){return Q(e)||!e.canInstall}function Xt(e,t){return e.state.skillOperation?.kind===`skill`&&e.state.skillOperation.skillKey===t}function Zt(e,t){return e.state.skillOperation?.kind===`clawhub`&&e.state.skillOperation.ref===t}function Qt(e){let{state:t}=e,n=t.skillsReport?.skills??[],i={all:n.length,ready:0,"needs-setup":0,disabled:0};for(let e of n)e.disabled?i.disabled++:M(e)?i.ready++:i[`needs-setup`]++;let a=t.skillsStatusFilter===`all`?n:n.filter(e=>Gt(e,t.skillsStatusFilter)),o=r(t.skillsFilter),s=o?a.filter(e=>r([e.name,e.description,e.source].join(` `)).includes(o)):a,l=Ze(s),u=t.skillsDetailKey?n.find(e=>e.skillKey===t.skillsDetailKey)??null:null;return h`
    ${Fe(e.surface===`discovery`?h` ${Ut(e)} ${e.library??g} `:h`
            ${e.library??g}
            ${e.showInventory===!1?g:en(e,i,s.length)}
            ${e.error?h`<div class="callout danger" role="alert">${e.error}</div>`:g}
            ${e.showInventory===!1?g:s.length===0?Ie(!t.connected&&!t.skillsReport?c(`skillsPage.disconnected`):c(`skillsPage.empty`)):v(l,e=>e.id,t=>$t(t,e))}
          `,{wide:!0,carapace:e.surface===`discovery`})}
    ${u?rn(u,e):g}
    ${t.clawhubDetailRef?tn(e):g}
  `}function $t(e,t){return h`
    <details class="settings-section skills-group" open>
      <summary class="settings-section__header skills-group__summary">
        <h2 class="settings-section__heading">
          ${e.label} <span class="settings-count">${e.skills.length}</span>
        </h2>
        <span class="skills-group__chevron" aria-hidden="true">${S.chevronRight}</span>
      </summary>
      <div class="settings-group">
        ${v(e.skills,e=>e.skillKey,e=>nn(e,t))}
      </div>
    </details>
  `}function en(e,t,n){return h` <div class="plugins-toolbar plugins-toolbar--fields">
    ${je({value:e.state.skillsStatusFilter,ariaLabel:c(`skillsPage.title`),options:sn.map(e=>({value:e.id,label:h`${c(e.labelKey)} <span class="settings-count">${t[e.id]}</span>`})),onChange:t=>e.onStatusFilterChange(t)})}
    <label class="plugins-field skills-toolbar__search">
      <span>${c(`common.search`)}</span>
      <input
        class="settings-input"
        .value=${e.state.skillsFilter}
        @input=${t=>e.onFilterChange(t.target.value)}
        placeholder=${c(`skillsPage.filterPlaceholder`)}
        autocomplete="off"
        name="skills-filter"
      />
    </label>
    <span class="plugins-toolbar__hint"
      >${c(`skillsPage.shown`,{count:String(n)})}</span
    >
    <button
      type="button"
      class="btn"
      ?disabled=${Q(e)||!e.state.connected}
      @click=${e.onRefresh}
    >
      ${e.loading?c(`common.loading`):c(`common.refresh`)}
    </button>
  </div>`}function tn(e){let{state:t}=e,n=t.clawhubDetail,r=n?.skill?.icon?t.clawhubIconUrls?.[n.skill.icon]:void 0,i=r||!n?.owner?.image?void 0:t.clawhubIconUrls?.[n.owner.image],a=r??i;return h`
    <testclaw-modal-dialog
      label=${n?.skill?.displayName??t.clawhubDetailRef??c(`skillsPage.notFound`)}
      style="--testclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${e.onClawHubDetailClose}
    >
      <div class="exec-approval-card skill-reader-dialog">
        <div class="exec-approval-header">
          <div class="clawhub-skill-detail__identity">
            ${a?h`<img
                    class="clawhub-skill-icon clawhub-skill-icon--detail ${i?`clawhub-skill-icon--profile`:``}"
                    src=${a}
                    alt=""
                  />`:g}
            <div class="exec-approval-title">
              ${n?.skill?.displayName??t.clawhubDetailRef}
            </div>
          </div>
          <button
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${c(`skillsPage.close`)}
            @click=${e.onClawHubDetailClose}
          >
            ${S.x}
          </button>
        </div>
        <div class="skill-reader-dialog__body clawhub-skill-detail__body">
          ${t.clawhubDetailLoading?h`<div class="muted" role="status">${c(`common.loading`)}</div>`:t.clawhubDetailError?h`<div class="callout danger skill-reader-dialog__error" role="alert">
                    <span aria-hidden="true">${S.alertTriangle}</span>
                    <span>${t.clawhubDetailError}</span>
                  </div>`:n?.skill?h`
                      <div>${n.skill.summary??``}</div>
                      ${n.owner?.displayName||n.latestVersion?h`<div
                              class="clawhub-skill-detail__meta muted"
                              style="letter-spacing: normal;"
                            >
                              ${n.owner?.displayName?h`${c(`skillsPage.by`)}
                                    ${n.owner.displayName}${n.owner.handle?h` (@${n.owner.handle})`:g}`:g}
                              ${n.owner?.displayName&&n.latestVersion?` · `:g}
                              ${n.latestVersion?c(`skillsPage.latest`,{version:n.latestVersion.version}):g}
                            </div>`:g}
                      ${n.latestVersion?.changelog?h`<article class="clawhub-skill-detail__changelog sidebar-markdown">
                              ${de(Me(n.latestVersion.changelog,{codeBlockChrome:`none`,mode:`document`}))}
                            </article>`:g}
                      ${n.metadata?.os?h`<div class="clawhub-skill-detail__meta muted">
                              ${c(`skillsPage.platforms`,{platforms:n.metadata.os.join(`, `)})}
                            </div>`:g}
                      <div class="exec-approval-actions" style="margin-top: 0;">
                        <button
                          class="btn primary"
                          ?disabled=${Yt(e)}
                          @click=${()=>{t.clawhubDetailRef&&e.onClawHubInstall(t.clawhubDetailRef)}}
                        >
                          ${Zt(e,t.clawhubDetailRef??``)?c(`skillsPage.installing`):e.showInventory===!1?c(`skillLibrary.import`):c(`skillsPage.installNamed`,{name:n.skill.displayName})}
                        </button>
                      </div>
                    `:h`<div class="muted" role="status">${c(`skillsPage.notFound`)}</div>`}
        </div>
      </div>
    </testclaw-modal-dialog>
  `}function nn(e,t){let n=q(e,t.state.clawhubVerdicts);return h`
    <div class="settings-row plugins-item plugins-item--clickable">
      <button
        type="button"
        class="settings-row__text plugins-item__detail-button"
        aria-label=${c(`skillsPage.openDetails`,{name:e.name})}
        @click=${()=>t.onDetailOpen(e.skillKey)}
      >
        <span class="settings-row__title">
          ${e.emoji?h`<span>${e.emoji}</span> `:g}${e.name}
        </span>
        <span class="settings-row__desc">${ae(e.description,140)}</span>
      </button>
      <div class="settings-row__control">
        ${Ft(e,n)}
        ${e.clawhub?.status===`linked`?k(qt(n,t.state.clawhubVerdictsLoading)):e.clawhub?.status===`invalid`?k({kind:`warn`,label:c(`skillsPage.invalidLink`)}):g}
      </div>
    </div>
  `}function rn(e,t){let{state:n}=t,r=Jt(t),i=Yt(t),a=Xt(t,e.skillKey),o=n.skillEdits[e.skillKey]??``,s=n.skillMessages[e.skillKey]??null,l=new Set([...e.missing.bins,...e.missing.anyBins]),u=e.install.find(e=>e.bins.some(e=>l.has(e))),ee=e.bundled&&e.source!==`testclaw-bundled`,d=et(e),f=Xe(e),te=q(e,n.clawhubVerdicts),p=n.skillsDetailTab===`card`&&e.skillCard?.present?`card`:`overview`;return h`
    <testclaw-modal-dialog
      label=${e.name}
      style="--testclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${t.onDetailClose}
    >
      <div class="exec-approval-card skill-reader-dialog">
        <div class="exec-approval-header">
          <div class="exec-approval-title" style="display: flex; align-items: center; gap: 8px;">
            <span class="statusDot ${Kt(e)}"></span>
            ${e.emoji?h`<span style="font-size: 18px;">${e.emoji}</span>`:g}
            <span>${e.name}</span>
          </div>
          <button
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${c(`skillsPage.close`)}
            @click=${t.onDetailClose}
          >
            ${S.x}
          </button>
        </div>
        <div class="skill-reader-dialog__body" style="display: grid; gap: var(--space-4);">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${Ye({skill:e,showBundledBadge:ee})}
          </div>

          ${e.clawhub||e.skillCard?.present?h`
                  ${Ne({id:`skill-detail`,active:p,tabs:[{value:`overview`,label:c(`skillsPage.overview`)},...e.skillCard?.present?[{value:`card`,label:c(`skillsPage.skillCard`)}]:[]],ariaLabel:e.name,panelId:`skill-detail-panel`,variant:`sub`,onSelect:t.onDetailTabChange})}
                `:g}
          <div
            id="skill-detail-panel"
            role=${e.clawhub||e.skillCard?.present?`tabpanel`:g}
            aria-labelledby=${e.clawhub||e.skillCard?.present?`skill-detail-tab-${p}`:g}
          >
            ${p===`overview`?an(e,t,te):on(e,t)}
          </div>
          ${d.length>0?h`
                  <div
                    class="callout"
                    style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                  >
                    <div style="font-weight: 600; margin-bottom: 4px;">
                      ${c(`skillsPage.missingRequirements`)}
                    </div>
                    <div>${d.join(`, `)}</div>
                  </div>
                `:g}
          ${f.length>0?h`
                  <div class="muted" style="font-size: 13px;">
                    ${c(`skillsPage.reason`,{reasons:f.join(`, `)})}
                  </div>
                `:g}

          <div style="display: flex; align-items: center; gap: 12px;">
            ${De({checked:!e.disabled,disabled:r,ariaLabel:e.name,onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?c(`skillsPage.disabled`):c(`skillsPage.enabled`)}
            </span>
            ${u?h`<button
                    class="btn"
                    ?disabled=${i}
                    @click=${()=>u&&t.onInstall(e.skillKey,e.name,u.id)}
                  >
                    ${a?c(`skillsPage.installing`):u?.label}
                  </button>`:g}
          </div>

          ${s?h`<div
                  class="callout ${s.kind===`error`?`danger`:`success`}"
                  role=${s.kind===`error`?`alert`:`status`}
                >
                  ${m(s.message)}
                </div>`:g}
          ${e.primaryEnv?h`
                  <div style="display: grid; gap: 8px;">
                    <label class="field">
                      <span
                        >${c(`skillsPage.apiKey`)}
                        <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                          >(${e.primaryEnv})</span
                        ></span
                      >
                      <input
                        type="password"
                        required
                        ?disabled=${r}
                        .value=${o}
                        @input=${n=>t.onEdit(e.skillKey,n.target.value)}
                      />
                    </label>
                    ${(()=>{let t=Z(e.homepage);return t?h`<div class="muted" style="font-size: 13px;">
                            ${c(`skillsPage.getKey`)}
                            <a href="${t}" target="_blank" rel="noopener noreferrer"
                              >${e.homepage}</a
                            >
                          </div>`:g})()}
                    <button
                      class="btn primary"
                      ?disabled=${r||!o.trim()}
                      @click=${()=>t.onSaveKey(e.skillKey)}
                    >
                      ${c(`skillsPage.saveKey`)}
                    </button>
                  </div>
                `:g}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div>
              <span style="font-weight: 600;">${c(`skillsPage.source`)}</span> ${e.source}
            </div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(()=>{let t=Z(e.homepage);return t?h`<div>
                    <a href="${t}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:g})()}
          </div>
        </div>
      </div>
    </testclaw-modal-dialog>
  `}function an(e,t,n){let r=e.clawhub;if(!r)return g;if(r.status===`invalid`)return h`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">${c(`skillsPage.invalidLink`)}</div>
      <div>${m(r.reason)}</div>
    </div>`;let i=Z(n?.securityAuditUrl??void 0),a=n?.reasons?.length?m(n.reasons.join(`, `)):null,o=qt(n,t.state.clawhubVerdictsLoading),s=`${r.ownerHandle?`@${r.ownerHandle}/`:``}${r.slug}@${r.installedVersion}`;return h`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-strong);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${o.chipClass}">${o.label}</span>
        <span class="muted" style="font-size: 12px;">${s}</span>
        ${t.state.clawhubVerdictsLoading&&n?h`<span class="muted">${c(`skillsPage.refreshing`)}</span>`:g}
      </div>
      ${t.state.clawhubVerdictsError?h`<div class="muted" style="font-size: 13px;">
              ${t.state.clawhubVerdictsError}
            </div>`:a?h`<div class="muted" style="font-size: 13px;">${a}</div>`:g}
      ${i?h`<div style="font-size: 13px;">
              <a href="${i}" target="_blank" rel="noopener noreferrer"
                >${c(`skillsPage.fullSecurityReport`)}</a
              >
            </div>`:g}
    </div>
  `}function on(e,t){if(!e.skillCard?.present)return g;let n=t.state.skillCardContents[e.skillKey];if(n===void 0){let n=t.state.skillCardErrors[e.skillKey];return n?h`<div class="callout danger" role="alert">${n}</div>`:h`<div class="muted" role="status" style="font-size: 13px;">
      ${t.state.skillCardLoadingKey===e.skillKey?c(`skillsPage.loadingSkillCard`):c(`skillsPage.skillCardNotLoaded`)}
    </div>`}return h`
    <article
      class="sidebar-markdown"
      style="max-width: 100%; overflow-wrap: anywhere;"
      @click=${Pe}
    >
      ${de(Me(n))}
    </article>
  `}var sn;function cn(){return(cn=e((()=>{_(),x(),fe(),Ae(),w(),Ee(),C(),ke(),A(),d(),xe(),E(),u(),te(),ie(),$e(),Qe(),Wt(),J(),D(),Se(),sn=[{id:`all`,labelKey:`skillsPage.tabs.all`},{id:`ready`,labelKey:`skillsPage.tabs.ready`},{id:`needs-setup`,labelKey:`skillsPage.tabs.needsSetup`},{id:`disabled`,labelKey:`skillsPage.tabs.disabled`}]})))()}var $;function ln(){return(ln=e((()=>{n(),Te(),_(),ue(),he(),w(),Je(),d(),u(),ve(),K(),ye(),ee(),p(),Ue(),it(),tt(),Nt(),zt(),cn(),$=class extends l{constructor(...e){super(...e),this.surface=`settings`,this.skillsAgentId=null,this.skillsAgentRevision=0,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillsFilter=``,this.skillsStatusFilter=`all`,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchQuery=``,this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubIconUrls={},this.clawhubSearchTimer=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.debouncedClawHubSearchQuery=``,this.gateway=new be(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetLoadedSkillState(),ensureInitialData:()=>this.ensureInitialData()}),this.clawhubIcons=new He({kind:`catalog`,getFetchContext:()=>({resourceBasePath:this.context.resourceBasePath,gatewayUrl:this.context.gateway.connection.gatewayUrl,auth:{hello:this.context.gateway.snapshot.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}}),isConnected:()=>this.gateway.connected,onUrlsChange:e=>{this.clawhubIconUrls=e}}),this.library=new Mt(this,this.gateway,()=>this.skillsAgentId,()=>this.refreshPage()),this.clawhubSearchTask=new Ce(this,{args:()=>[this.gateway.connected&&!this.clawhubSearchTimer&&this.surface===`discovery`?this.gateway.client:null,this.debouncedClawHubSearchQuery,this.gateway.epoch],task:([e,t],{signal:n})=>e?lt(e,t,n):we}),this.subscriptions=new re(this).effect(()=>this.context?.agents,e=>{let t=e.subscribe(()=>{this.reconcileAgentState(),this.ensureInitialData(),this.requestUpdate()});return this.reconcileAgentState(),this.ensureInitialData(),t}).watch(()=>this.context&&this.agentSelection,(e,t)=>e.subscribe(t),()=>{let e=this.skillsAgentId;this.reconcileAgentState(),this.routeDataInitialized&&e!==this.skillsAgentId&&(this.routeDataEnabled=!1,this.ensureInitialData())})}get runtimeConfig(){return this.context.runtimeConfig}get client(){return this.gateway.client}get connected(){return this.gateway.connected}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}updated(){this.clawhubIcons.syncCatalog([],[...(this.clawhubSearchResults??[]).flatMap(e=>e.icon?[e.icon]:[]),...this.clawhubDetail?.skill?.icon?[this.clawhubDetail.skill.icon]:[],...this.clawhubDetail?.owner?.image?[this.clawhubDetail.owner.image]:[]])}disconnectedCallback(){this.subscriptions.clear(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.clawhubIcons.reset(),super.disconnectedCallback()}get agentSelection(){return this.surface===`settings`?this.context.settingsAgentSelection:this.context.agentSelection}reconcileAgentState(){let e=this.context.agents.state,t=this.skillsAgentId;H(this,this.agentSelection.state.selectedId),this.surface===`discovery`&&e.agentsList&&vt(this,e.agentsList),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`,At(this))}resetLoadedSkillState(){this.library.reset(),this.clawhubSearchTask.abort(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.skillsAgentId=null,this.skillsAgentRevision++,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.debouncedClawHubSearchQuery=this.clawhubSearchQuery.trim(),this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubIcons.reset()}applyRouteData(){let e=this.routeData;if(!e)return;if(this.routeDataInitialized=!0,this.routeDataEnabled=!0,!this.gateway.isRouteDataCurrent(e)||e.agents!==this.context.agents){this.routeDataEnabled=!1;return}let t=this.agentSelection.state;if(this.agentSelection.intentRevision!==e.selectionIntentRevision){this.routeDataEnabled=!1,this.reconcileAgentState();return}if(H(this,e.selectedAgentId),e.selectedAgentId&&t.selectedId!==e.selectedAgentId&&this.agentSelection.set(e.selectedAgentId),this.reconcileAgentState(),this.skillsAgentId!==e.selectedAgentId){this.routeDataEnabled=!1;return}this.routeDataEnabled=!0,this.skillsLoading=!1,this.skillsReport=e.report,this.skillsError=e.error,e.report&&St(this,e.report),e.clawhubRef&&e.clawhubRef!==this.clawhubDetailRef&&kt(this,e.clawhubRef)}ensureInitialData(){if(this.library&&!this.library.list&&!this.library.loading&&!this.library.error&&this.library.load(),this.routeDataEnabled||!this.routeDataInitialized||!this.gateway.connected||!this.gateway.client)return;let e=this.context.agents.state;if(!e.agentsList){e.agentsLoading||this.loadAgents();return}this.reconcileAgentState(),!this.skillsReport&&!this.skillsLoading&&U(this)}async loadAgents(){if(!this.gateway.client||!this.gateway.connected)return;let e=this.context.agents;e.state.agentsList||await e.ensureList(),this.context.agents===e&&(this.reconcileAgentState(),this.ensureInitialData())}async refreshPage(){await Promise.all([yt(this,()=>this.loadAgents()),this.library.load()])}changeClawHubQuery(e){this.clawhubSearchQuery=e,this.clawhubInstallMessage=null,this.clawhubSearchTimer&&clearTimeout(this.clawhubSearchTimer),this.clawhubSearchTimer=setTimeout(()=>{this.clawhubSearchTimer=null,this.debouncedClawHubSearchQuery=e.trim(),this.requestUpdate()},300),this.requestUpdate()}get clawhubSearchResults(){return this.clawhubSearchTask.status===O.COMPLETE&&this.debouncedClawHubSearchQuery===this.clawhubSearchQuery.trim()?this.clawhubSearchTask.value??null:null}get clawhubSearchLoading(){return this.clawhubSearchTimer!==null||this.clawhubSearchTask.status===O.PENDING}get clawhubSearchError(){if(this.clawhubSearchTask.status!==O.ERROR||this.debouncedClawHubSearchQuery!==this.clawhubSearchQuery.trim())return null;let e=this.clawhubSearchTask.error;return f(e)}changeDetailTab(e){this.skillsDetailTab=e,e===`card`&&this.skillsDetailKey&&xt(this,this.skillsDetailKey)}canUpdateSkills(){return T(this.context?.gateway?.snapshot,`skills.update`,`operator.admin`)}canInstallSkills(){return T(this.context?.gateway?.snapshot,`skills.install`,`operator.admin`)}canInstallFromClawHub(){return this.library.list!==null&&!this.library.loading&&(this.library.showWorkspace?this.canInstallSkills():this.library.canWrite&&!!this.library.list.profileId)}selectHubTab(e){e!==`skills`&&this.context.navigate(e)}render(){let e=this.context.agents.state,t=this.skillsError??e.agentsError;return h`
      ${this.surface===`discovery`?nt({active:`skills`,onSelect:e=>this.selectHubTab(e),secondaryAction:{label:c(`skillDiscovery.settings`),icon:S.settings,onClick:()=>this.context.navigate(`skill-settings`,{search:this.skillsAgentId?`?agent=${encodeURIComponent(this.skillsAgentId)}`:``})}}):h`<div class="plugins-toolbar">
              <button
                type="button"
                class="btn"
                @click=${()=>this.context.navigate(`skills`,{search:this.skillsAgentId?`?agent=${encodeURIComponent(this.skillsAgentId)}`:``})}
              >
                ${S.search} ${c(`skillDiscovery.search`)}
              </button>
              <button
                type="button"
                class="btn"
                @click=${()=>this.context.navigate(`skill-workshop`)}
              >
                ${c(`pluginsPage.workshopTab`)}
              </button>
            </div>`}
      ${qe(h`
        <div
          id=${this.surface===`discovery`?rt:g}
          role=${this.surface===`discovery`?`tabpanel`:g}
          aria-labelledby=${this.surface===`discovery`?`plugins-tab-skills`:g}
        >
          ${Qt({state:this,surface:this.surface,libraryEntries:this.library.list?.entries??[],onLibraryOpen:e=>void this.library.open(e),library:this.surface===`discovery`?h`
                    ${this.library.error&&!this.library.draft&&!this.library.importOpen?h`<div class="callout danger" role="alert">${this.library.error}</div>`:g}
                    ${this.library.notice&&!this.library.draft?h`<div class="callout success" role="status">${this.library.notice}</div>`:g}
                    ${Y(this.library)}
                  `:It(this.library),showInventory:this.library.showWorkspace,canUpdate:this.canUpdateSkills(),canInstall:this.canInstallFromClawHub(),loading:this.skillsLoading||e.agentsLoading||this.library.busy,error:t,onFilterChange:e=>this.skillsFilter=e,onStatusFilterChange:e=>this.skillsStatusFilter=e,onRefresh:()=>void this.refreshPage(),onToggle:(e,t)=>{this.canUpdateSkills()&&Tt(this,e,t,()=>this.canUpdateSkills())},onEdit:(e,t)=>{this.canUpdateSkills()&&Ct(this,e,t)},onSaveKey:e=>{this.canUpdateSkills()&&Dt(this,e,()=>this.canUpdateSkills())},onInstall:(e,t,n)=>{this.canInstallSkills()&&Ot(this,e,t,n)},onDetailOpen:e=>{this.skillsDetailKey=e,this.skillsDetailTab=`overview`},onDetailClose:()=>this.skillsDetailKey=null,onDetailTabChange:e=>this.changeDetailTab(e),onClawHubQueryChange:e=>this.changeClawHubQuery(e),onClawHubDetailOpen:e=>void kt(this,e),onClawHubDetailClose:()=>At(this),onClawHubInstall:(e,t)=>{this.canInstallFromClawHub()&&(this.library.showWorkspace?jt(this,e,t):(this.clawhubDetailRef=null,this.library.importSource={slug:e,version:t},this.library.importSlug=``,this.library.importOpen=!0,this.requestUpdate()))}})}
        </div>
      `)}
    `}},o([a({context:me,subscribe:!0})],$.prototype,`context`,void 0),o([pe({attribute:!1})],$.prototype,`routeData`,void 0),o([pe({attribute:!1})],$.prototype,`surface`,void 0),o([y()],$.prototype,`skillsAgentId`,void 0),o([y()],$.prototype,`skillsAgentRevision`,void 0),o([y()],$.prototype,`skillsLoading`,void 0),o([y()],$.prototype,`skillsReport`,void 0),o([y()],$.prototype,`skillsError`,void 0),o([y()],$.prototype,`skillOperation`,void 0),o([y()],$.prototype,`skillsFilter`,void 0),o([y()],$.prototype,`skillsStatusFilter`,void 0),o([y()],$.prototype,`skillEdits`,void 0),o([y()],$.prototype,`skillMessages`,void 0),o([y()],$.prototype,`skillsDetailKey`,void 0),o([y()],$.prototype,`skillsDetailTab`,void 0),o([y()],$.prototype,`clawhubSearchQuery`,void 0),o([y()],$.prototype,`clawhubDetail`,void 0),o([y()],$.prototype,`clawhubDetailRef`,void 0),o([y()],$.prototype,`clawhubDetailLoading`,void 0),o([y()],$.prototype,`clawhubDetailError`,void 0),o([y()],$.prototype,`clawhubInstallMessage`,void 0),o([y()],$.prototype,`clawhubVerdicts`,void 0),o([y()],$.prototype,`clawhubVerdictsLoading`,void 0),o([y()],$.prototype,`clawhubVerdictsError`,void 0),o([y()],$.prototype,`skillCardContents`,void 0),o([y()],$.prototype,`skillCardContentKeys`,void 0),o([y()],$.prototype,`skillCardLoadingKey`,void 0),o([y()],$.prototype,`skillCardErrors`,void 0),o([y()],$.prototype,`clawhubIconUrls`,void 0),customElements.get(`testclaw-skills-page`)||customElements.define(`testclaw-skills-page`,$)})))()}ln();
//# sourceMappingURL=skills-page-iYPp2wOj.js.map