import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ga as t,Ia as n,Jr as r,Mr as i,Va as a,Zn as o,ar as s,cr as c,gi as l,ir as u,oo as d,qi as f,qr as p,ti as m,za as h}from"./control-ui-foundation-CGMdhB5v.js";import{$l as g,Ac as _,Ar as v,Bc as y,Bl as b,Bs as x,Dc as S,Dr as C,Ec as w,Fc as ee,Fr as te,Hc as T,Hl as E,Hr as D,Ic as O,Ir as ne,Jl as k,Kl as A,Lc as re,Lr as ie,Ml as ae,Nr as j,Oc as oe,Pc as se,Pl as ce,Pr as M,Qc as le,Rc as ue,Rr as de,Rs as N,Uc as fe,Vc as pe,Vr as me,Wc as he,_n as ge,ac as _e,fn as ve,ic as ye,jn as be,kc as xe,kn as Se,sl as Ce,za as we,zc as Te,zs as Ee}from"./control-ui-core-S9jKXqB5.js";import{$ as P,X as F,Y as I,_ as De,b as Oe,ct as L,i as ke,m as Ae,nt as je,o as Me,r as Ne,t as Pe,ut as R,x as Fe}from"./lit-runtime-DWoPVI38.js";import{Di as Ie,Fi as z,Fr as Le,Ii as Re,Ni as ze,Oa as Be,Oi as Ve,Qa as He,Xn as Ue,Yn as We,ba as B,do as Ge,fo as Ke,wa as V}from"./control-ui-core-G2U4O6rB.js";import{c as qe,s as Je}from"./gateway-runtime-BV4hxqU_.js";import{$ as Ye,Ua as Xe,Va as Ze,as as Qe,at as $e,co as et,eo as tt,et as nt,go as rt,ho as it,ir as at,is as ot,qa as st,tt as ct,za as lt}from"./control-ui-boot-shared-ooxiG3qa.js";import{B as ut}from"./control-ui-boot-shared-C3bL_9oq.js";import{Aa as dt,At as ft,Br as pt,Ct as mt,Da as ht,Et as H,Jr as gt,Mt as _t,Ot as U,Pt as W,St as vt,Va as yt,Vr as bt,_t as xt,ci as St,di as Ct,er as wt,f as Tt,fi as Et,ht as G,li as Dt,nr as Ot,p as kt,qr as At,si as jt,ui as Mt,yt as K,za as Nt}from"./control-ui-boot-shared-CCYBAAP9.js";import"./control-ui-boot-shared-VDjYq2Zh.js";import{n as Pt,t as Ft}from"./settings-workspace-DJAhLnkQ.js";import{c as It,l as Lt,o as Rt,t as zt}from"./github-identity-view-B8f4OQ8W.js";import{a as Bt,c as Vt,i as Ht,n as Ut,o as Wt,r as Gt,s as Kt}from"./tool-catalog-BWRRuDep.js";import{n as qt,t as Jt}from"./model-picker-B5f1dDe1.js";import{n as Yt,t as Xt}from"./decision-model-picker-DCNG76SK.js";import{a as Zt,n as Qt,o as $t,r as en,s as tn,t as nn}from"./skills-shared-DCdiA2QU.js";import{n as rn,t as an}from"./cron-jobs-pagination-fv383neL.js";import{a as on,n as sn,r as cn,s as ln,t as un}from"./presenter-wVFa7WAH.js";function dn(e,t){return Object.hasOwn(e.agentFileContents,t)||Object.hasOwn(e.agentFileDrafts,t)}function fn(e){let t=Object.entries(e.agentFileDrafts).filter(([t,n])=>n!==e.agentFileContents[t]||e.agentFileConflict===t);return t.length===0?null:{drafts:Object.fromEntries(t),hashes:Object.fromEntries(t.flatMap(([t])=>e.agentFileHashes[t]===void 0?[]:[[t,e.agentFileHashes[t]]])),active:e.agentFileActive,conflict:e.agentFileConflict}}function pn(e,t,n){let r={...e};return n===void 0?delete r[t]:r[t]=n,r}async function q(e,t,n,r){let i=r.kind===`write`,a=i?`agentFileSaving`:`agentFilesLoading`,o=e.client,s=e.agents;if(!o||!e.connected||e[a]||i&&!dn(e,n))return!1;if(r.kind===`read`&&!r.force&&Object.hasOwn(e.agentFileContents,n))return!0;let c=e.requestGeneration,l=()=>e.client===o&&e.agents===s&&e.connected&&e.requestGeneration===c,u=()=>{e.agentFileWriteRevisions.set(n,(e.agentFileWriteRevisions.get(n)??0)+1)};i&&u();let d=e.agentFileWriteRevisions.get(n),f=()=>l()&&(i||e.agentFileWriteRevisions.get(n)===d),p=e.agentFileHashes[n],m=r.kind===`read`?r.resolution:void 0;e[a]=!0,e.agentFilesError=null;try{let a=await o.request(i?`agents.files.set`:`agents.files.get`,{agentId:t,name:n,...r.kind===`write`?{content:r.content,...p?{expectedHash:p}:{}}:{}});if(a?.file&&f()){let t=r.kind===`write`?r.content:a.file.content??``,o=e.agentFileContents[n],c=e.agentFileDrafts[n];e.agentFileContents={...e.agentFileContents,[n]:t},e.agentFileBaseHashes=pn(e.agentFileBaseHashes,n,a.file.hash);let l=m===`draft`||!Object.hasOwn(e.agentFileDrafts,n)||c===t||!i&&c===o;return l&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:t}),(i||m!==void 0||l)&&(e.agentFileHashes=pn(e.agentFileHashes,n,a.file.hash),e.agentFileConflict===n&&(e.agentFileConflict=null)),e.agentFilesError=null,s.recordFile(a),!0}}catch(t){return f()&&(e.agentFilesError=N(t),mn(t)&&(e.agentFileConflict=n)),!1}finally{l()&&(i&&u(),e[a]=!1)}return!1}function mn(e){return e instanceof We&&f(e.details)&&e.details.type===`agent_file_conflict`}function hn(e,t,n,r){return q(e,t,n,{kind:`read`,force:r?.force})}function gn(e,t,n,r){return q(e,t,n,{kind:`write`,content:r})}function _n(e,t){Object.hasOwn(e.agentFileContents,t)&&(e.agentFileDrafts={...e.agentFileDrafts,[t]:e.agentFileContents[t]??``},e.agentFileHashes=pn(e.agentFileHashes,t,e.agentFileBaseHashes[t]),e.agentFileConflict===t&&(e.agentFileConflict=null,e.agentFilesError=null))}function vn(e,t,n){return q(e,t,n,{kind:`read`,force:!0,resolution:`draft`})}async function yn(e,t,n,r){let i=e.client,a=e.agents,o=e.requestGeneration;return!await q(e,t,n,{kind:`read`,force:!0,resolution:`hash`})||!e.connected||e.client!==i||e.agents!==a||e.requestGeneration!==o?!1:await q(e,t,n,{kind:`write`,content:r})}function bn(){return(bn=e((()=>{Ue(),x()})))()}function xn(e){return e?e.length<=Dn?{ok:!0,dataUrl:e}:kn:J}function Sn(e){return new Promise(t=>{let n=new FileReader;n.addEventListener(`load`,()=>t(xn(typeof n.result==`string`?n.result:null))),n.addEventListener(`error`,()=>t(J)),n.readAsDataURL(e)})}function Cn(e,t){return e.startsWith(`data:${t}`)&&e.length<=Dn}function wn(e,t,n){let{data:r}=e.getImageData(0,0,t,n);for(let e=3;e<r.length;e+=4)if(r[e]!==255)return!1;return!0}async function Tn(e){if(!e.type.startsWith(`image/`)||e.size>2097152)return J;try{let t=await createImageBitmap(e);try{let n=document.createElement(`canvas`),r=n.getContext(`2d`);if(!r)return await Sn(e);let i=e=>{let i=Math.min(1,e/Math.max(t.width,t.height));n.width=Math.max(1,Math.round(t.width*i)),n.height=Math.max(1,Math.round(t.height*i)),r.clearRect(0,0,n.width,n.height),r.drawImage(t,0,0,n.width,n.height)};i(En);let a=n.toDataURL(`image/webp`,.8);if(a.startsWith(`data:image/webp`))return xn(a);if(wn(r,n.width,n.height)){let e=n.toDataURL(`image/jpeg`,.85);if(Cn(e,`image/jpeg`))return{ok:!0,dataUrl:e}}for(let e of On){i(e);let t=n.toDataURL(`image/png`);if(Cn(t,`image/png`))return{ok:!0,dataUrl:t}}return kn}finally{t.close()}}catch{return Sn(e)}}var En,Dn,On,J,kn;function An(){return(An=e((()=>{o(),En=96,Dn=16e3,On=[En,64,48],J={ok:!1,reason:`unusable`},kn={ok:!1,reason:`too-detailed`}})))()}function jn(e){let t=(Y.get(e)??0)+1;return Y.set(e,t),t}function Mn(e){jn(e),e.identityDraft={name:null,emoji:null,avatar:null},e.identitySaving=!1,e.identityError=null}function Nn(e,t,n){e.identityDraft={...e.identityDraft,[t]:n},e.identityError=null}function Pn(e,t){let n=jn(e);Tn(t).then(t=>{Y.get(e)===n&&(t.ok?(e.identityDraft={...e.identityDraft,avatar:t.dataUrl},e.identityError=null):e.identityError=g(Ln[t.reason]))})}async function Fn(e){let{host:t,expectedClient:n,agentId:r,agents:i,agentIdentity:a,runtimeConfig:o}=e,s=t.identityDraft,c=s.name?.trim(),l=s.emoji?.trim(),u=s.avatar??void 0;if(!(s.name!==null&&!c||s.emoji!==null&&!l)){if(!c&&!l&&!u){Mn(t);return}t.identitySaving=!0,t.identityError=null;try{let s=await o.runExternalMutation(e=>{if(e!==n)throw Error(`Connection changed before the agent identity update started.`);return ie(e,{agentId:r,name:c,emoji:l,avatar:u})},{canDispatch:e.canDispatch,dispatchError:`Access changed before the agent identity update started.`});if(!s.ok)throw Error(s.error);let d=s.refresh.ok?[]:[s.refresh.error];a.invalidate([r]);try{await i.refreshList()}catch(e){d.push(`Agent identity was saved, but the agent list refresh failed: ${N(e)}`)}try{await a.ensure([r])}catch(e){d.push(`Agent identity was saved, but the identity refresh failed: ${N(e)}`)}e.isCurrent()&&(Mn(t),e.onSaved(),t.identityError=d.length>0?d.join(` `):null)}catch(n){e.isCurrent()&&(t.identityError=N(n))}finally{e.isCurrent()&&(t.identitySaving=!1)}}}function In(e,t){let n=e.snapshot.pinnedAgentIds,r=n.includes(t)?n.filter(e=>e!==t):[...n,t];e.update({pinnedAgentIds:r})}var Ln,Y;function Rn(){return(Rn=e((()=>{k(),j(),x(),An(),Ln={unusable:`agents.identity.imageUnusable`,"too-detailed":`agents.identity.imageTooDetailed`},Y=new WeakMap})))()}function zn(e){return{onModelChange:(t,n)=>{e.canUpdate(t)&&(Wn(e.getRuntimeConfig(),t,n),e.onPrimaryChanged())},onDecisionModelChange:(t,n)=>{e.canUpdate(t)&&Bn(e.getRuntimeConfig(),t,n)},onModelFallbacksChange:(t,n)=>{e.canUpdate(t)&&Gn(e.getRuntimeConfig(),t,n)}}}function Bn(e,t,n){let r=e.agentEntry(t,{ensure:n!==null});if(!r)return;let i=[...r.path,`decisionModel`];n===null?e.removeFormValue(i):e.patchForm(i,n)}function Vn(e){return{path:[...e.path,`model`],existing:e.entry.model}}function Hn(e,t,n,r){n&&r?e.patchForm(t,{primary:n,fallbacks:r}):n?e.patchForm(t,n):r?e.patchForm(t,{fallbacks:r}):e.removeFormValue(t)}function Un(e){if(typeof e==`string`)return{primary:e.trim()||null,fallbacks:null};if(e&&typeof e==`object`){let t=e;return{primary:typeof t.primary==`string`&&t.primary.trim()||null,fallbacks:Array.isArray(t.fallbacks)?t.fallbacks:null}}return{primary:null,fallbacks:null}}function Wn(e,t,n){let r=e.agentEntry(t,{ensure:!!n});if(!r)return;let i=Vn(r);Hn(e,i.path,n,Un(i.existing).fallbacks)}function Gn(e,t,n){let r=e.agentEntry(t,{ensure:!0});if(!r)return;let i=Vn(r);Hn(e,i.path,Un(i.existing).primary,a(n))}function Kn(){return(Kn=e((()=>{n()})))()}function qn(e,t,n){let r=t?.canonicalLocation;if(!r)return``;let i=`${t.location.pathname}${t.location.search}${t.location.hash}`;return n!==i&&e.replace(`agents`,r),i}function Jn(e,t,n,r){n!==t&&e.navigate(`agents`,{pathname:V(t,r===`overview`?null:r,e.basePath)})}function Yn(e,t,n,r){t&&r!==n&&e.navigate(`agents`,{pathname:V(t,r,e.basePath)})}function Xn(){return(Xn=e((()=>{B(),A()})))()}async function Zn(e,t){let n=e.client;if(!n||!e.connected||e.agentSkillsLoading)return;let r=e.requestGeneration,i=()=>e.client===n&&e.connected&&e.requestGeneration===r;e.agentSkillsLoading=!0,e.agentSkillsError=null;try{let r=await we(n,t);r&&i()&&(e.agentSkillsReport=r,e.agentSkillsAgentId=t)}catch(t){i()&&(e.agentSkillsError=N(t))}finally{i()&&(e.agentSkillsLoading=!1)}}async function Qn(e,t,n=()=>!0){let r=e.agentEntry(t);if(!r||!Array.isArray(r.entry.skills)||!n())return!1;let i=r.path[2];return typeof i==`string`&&e.patch({raw:{agents:{entries:{[i]:{skills:null}}}},note:`Reset agent skills to inherited defaults`,replacePaths:[`agents.entries.${i}.skills`],canDispatch:n})}function $n(){return($n=e((()=>{x()})))()}function er(e){let t=e.trim();return t?t.split(/\s+/).length:0}function tr(e){return e.length===0?0:e.split(/\r?\n/).length}function nr(e){return e<=0?g(`agents.files.emptyDraft`):g(`agents.files.minRead`,{count:String(Math.max(1,Math.round(e/220)))})}function rr(e,t){if(!(e instanceof HTMLElement))return;let n=g(t?`agents.files.collapsePreview`:`agents.files.expandPreview`);e.classList.toggle(`is-fullscreen`,t),e.setAttribute(`aria-pressed`,String(t)),e.setAttribute(`aria-label`,n),e.closest(`testclaw-tooltip`)?.setAttribute(`content`,n)}function ir(e){e.querySelector(`.md-preview-dialog__panel`)?.classList.remove(`fullscreen`),rr(e.querySelector(`.md-preview-expand-btn`),!1),e.classList.remove(`fullscreen`)}function ar(){return(ar=e((()=>{k()})))()}function or(e){let t=e.conflictName;return t?P`<div class="callout danger">
    <span>${e.error??g(`agents.files.conflictHint`)}</span>
    <div class="agent-file-actions">
      <button
        class="btn btn--sm"
        type="button"
        ?disabled=${e.busy}
        @click=${()=>e.onReload(t)}
      >
        ${g(`common.reload`)}
      </button>
      <button
        class="btn btn--sm"
        type="button"
        ?disabled=${e.busy||!e.canWrite}
        @click=${()=>e.onOverwrite(t)}
      >
        ${g(`agents.files.overwrite`)}
      </button>
    </div>
  </div>`:e.error?P`<div class="callout danger">${e.error}</div>`:F}function sr(){return(sr=e((()=>{I(),k()})))()}function cr(e){let t=e.split(`.`).pop()?.trim().toLowerCase();return t===`md`||t===`markdown`?g(`agents.files.markdownPreview`):t?g(`agents.files.extensionPreview`,{ext:t.toUpperCase()}):g(`agents.files.preview`)}function lr(e,t){let n=e.trim(),r=t?.trim();if(!n)return``;if(r&&n===r)return`.`;if(r&&n.startsWith(`${r}/`))return n.slice(r.length+1)||`.`;let i=n.split(/[\\/]+/);for(let e=i.length-1;e>=0;--e){let t=i[e];if(t)return t}return n}function ur(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`preview`}function dr(e){let t=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,n=t?.files??[],r=e.agentFileActive??null,i=e=>e.missing&&e.expectedAbsent===!0&&e.name!==r,a=n.filter(e=>!i(e)),o=n.filter(i),s=r?n.find(e=>e.name===r)??null:null,c=r?dn(e,r):!1,l=r?Object.hasOwn(e.agentFileContents,r):!1,u=r?e.agentFileContents[r]??``:``,d=r?e.agentFileDrafts[r]??u:``,f=c&&(!l||d!==u),p=s?Ot(d,{codeBlockChrome:`none`,mode:`document`}):``,m=xe(new TextEncoder().encode(d).length),h=er(d),_=tr(d),v=s?lr(s.path,t?.workspace):``,y=s?`agent-file-preview-title-${ur(s.name)}`:``,b=s?.missing?g(`agents.files.willCreateOnSave`):g(f?`agents.files.liveDraftPreview`:`agents.files.savedPreview`),x=s?.missing?`is-missing`:f?`is-dirty`:`is-synced`,S=s?.updatedAtMs?g(`agents.files.updated`,{time:ve(s.updatedAtMs)}):s?.missing?g(`agents.files.notCreatedYet`):g(`agents.files.updatedUnknown`);return P`
    ${or({error:e.agentFilesError,conflictName:r&&e.agentFileConflict===r?r:null,busy:e.agentFilesLoading||e.agentFileSaving,canWrite:e.canWrite,onReload:e.onFileReload,onOverwrite:e.onFileOverwrite})}
    ${U({title:g(`agents.files.coreFilesTitle`),description:t?P`${g(`agents.files.coreFilesSubtitle`)} ${g(`agents.files.workspace`)}:
              <code>${t.workspace}</code>`:g(`agents.files.coreFilesSubtitle`),actions:P`
          <button
            class="btn btn--sm"
            ?disabled=${e.agentFilesLoading}
            @click=${()=>e.onLoadFiles(e.agentId)}
          >
            ${e.agentFilesLoading?g(`common.loading`):g(`common.refresh`)}
          </button>
        `},t?n.length===0?K(g(`agents.files.empty`)):P`
              <div class="agents-panel-body">
                <div class="agent-file-tabs">
                  ${kt({id:`agent-files`,active:r,tabs:a.map(t=>({value:t.name,label:t.name.replace(/\.md$/i,``),badge:t.missing&&t.expectedAbsent!==!0?g(`agents.files.missing`):void 0,disabled:e.agentFilesLoading})),ariaLabel:g(`agents.files.coreFilesTitle`),panelId:`agent-file-panel`,variant:`sub`,onSelect:e.onSelectFile})}
                  ${o.length===0?F:P`
                          <select
                            class="agent-tab-add"
                            aria-label=${g(`agents.files.addFile`)}
                            .value=${``}
                            ?disabled=${e.agentFilesLoading}
                            @change=${t=>{let n=t.currentTarget;if(!(n instanceof HTMLSelectElement))return;let r=n.value;n.value=``,r&&e.onSelectFile(r)}}
                          >
                            <option value="">${g(`agents.files.addFile`)}</option>
                            ${o.map(e=>P`<option value=${e.name}>
                                  ${e.name.replace(/\.md$/i,``)}
                                </option>`)}
                          </select>
                        `}
                </div>
                <div
                  id="agent-file-panel"
                  role="tabpanel"
                  aria-labelledby=${r?`agent-files-tab-${r}`:F}
                >
                  ${s?P`
                          <div class="agent-file-header">
                            <div>
                              <div class="agent-file-sub mono">${s.path}</div>
                            </div>
                            <div class="agent-file-actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${!c}
                                @click=${e=>{let t=e.currentTarget;t instanceof HTMLElement&&t.closest(`.settings-group`)?.querySelector(`testclaw-modal-dialog`)?.show()}}
                              >
                                ${z.eye} ${g(`agents.files.preview`)}
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${!e.canWrite||!l||!f}
                                @click=${()=>e.onFileReset(s.name)}
                              >
                                ${g(`common.reset`)}
                              </button>
                              <button
                                class="btn btn--sm primary"
                                ?disabled=${!e.canWrite||!c||e.agentFileSaving||!f}
                                @click=${()=>e.onFileSave(s.name)}
                              >
                                ${e.agentFileSaving?g(`common.saving`):g(`common.save`)}
                              </button>
                            </div>
                          </div>
                          ${s.missing?P`<div class="callout info">
                                  ${s.expectedAbsent===!0?g(`agents.files.createHint`):g(`agents.files.missingHint`)}
                                </div>`:F}
                          <label class="field agent-file-field">
                            <span>${g(`agents.files.content`)}</span>
                            <textarea
                              class="agent-file-textarea"
                              ?disabled=${!e.canWrite||!c}
                              placeholder=${c?F:e.agentFilesLoading?g(`common.loading`):g(`agents.files.loadHint`)}
                              .value=${d}
                              @input=${t=>{t.currentTarget instanceof HTMLTextAreaElement&&e.onFileDraftChange(s.name,t.currentTarget.value)}}
                            ></textarea>
                          </label>
                          <testclaw-modal-dialog
                            class="agent-file-preview"
                            manual
                            label=${s.name}
                            style="--testclaw-modal-width: min(1040px, calc(100vw - 32px));"
                            @modal-cancel=${e=>{e.currentTarget instanceof HTMLElement&&ir(e.currentTarget)}}
                          >
                            <div class="md-preview-dialog__panel">
                              <div class="md-preview-dialog__header">
                                <div class="md-preview-dialog__header-main">
                                  <div class="md-preview-dialog__eyebrow">
                                    ${z.scrollText}
                                    <span>${cr(s.name)}</span>
                                  </div>
                                  <div class="md-preview-dialog__title-wrap">
                                    <div
                                      id=${y}
                                      class="md-preview-dialog__title"
                                      translate="no"
                                    >
                                      ${s.name}
                                    </div>
                                    <div class="md-preview-dialog__path mono" translate="no">
                                      ${v}
                                    </div>
                                  </div>
                                </div>
                                <div class="md-preview-dialog__actions">
                                  <testclaw-tooltip .content=${g(`agents.files.expandPreview`)}>
                                    <button
                                      type="button"
                                      class="btn btn--sm md-preview-icon-btn md-preview-expand-btn"
                                      aria-label=${g(`agents.files.expandPreview`)}
                                      aria-pressed="false"
                                      @click=${e=>{let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.closest(`.md-preview-dialog__panel`);if(!n)return;let r=n.classList.toggle(`fullscreen`);t.closest(`testclaw-modal-dialog`)?.classList.toggle(`fullscreen`,r),rr(t,r)}}
                                    >
                                      <span class="when-normal" aria-hidden="true"
                                        >${z.maximize}</span
                                      ><span class="when-fullscreen" aria-hidden="true"
                                        >${z.minimize}</span
                                      >
                                    </button>
                                  </testclaw-tooltip>
                                  <testclaw-tooltip .content=${g(`agents.files.editFile`)}>
                                    <button
                                      type="button"
                                      class="btn btn--sm md-preview-icon-btn"
                                      aria-label=${g(`agents.files.editFile`)}
                                      @click=${e=>{let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.closest(`testclaw-modal-dialog`),r=n?.closest(`.settings-group`)?.querySelector(`.agent-file-textarea`);n?.setReturnFocusTarget(r??null),n?.hide(),n&&ir(n)}}
                                    >
                                      <span aria-hidden="true">${z.edit}</span>
                                    </button>
                                  </testclaw-tooltip>
                                  <testclaw-tooltip .content=${g(`agents.files.closePreview`)}>
                                    <button
                                      type="button"
                                      class="btn btn--sm md-preview-icon-btn"
                                      aria-label=${g(`agents.files.closePreview`)}
                                      @click=${e=>{let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.closest(`testclaw-modal-dialog`);n?.hide(),n&&ir(n)}}
                                    >
                                      <span aria-hidden="true">${z.x}</span>
                                    </button>
                                  </testclaw-tooltip>
                                </div>
                              </div>
                              <div class="md-preview-dialog__meta">
                                <div
                                  class="md-preview-dialog__chip ${x}"
                                  data-priority="essential"
                                >
                                  <strong>${b}</strong>
                                </div>
                                <div class="md-preview-dialog__chip" data-priority="essential">
                                  <strong>${nr(h)}</strong>
                                  <span
                                    >${g(`agents.files.words`,{count:String(h)})}</span
                                  >
                                </div>
                                <div class="md-preview-dialog__chip" data-priority="secondary">
                                  <strong>${_}</strong>
                                  <span>${g(`agents.files.lines`)}</span>
                                </div>
                                <div class="md-preview-dialog__chip" data-priority="essential">
                                  <strong>${m}</strong>
                                  <span>${S}</span>
                                </div>
                              </div>
                              <div class="md-preview-dialog__body">
                                <article class="md-preview-dialog__reader sidebar-markdown">
                                  ${Ne(p)}
                                </article>
                              </div>
                            </div>
                          </testclaw-modal-dialog>
                        `:P`<div class="muted">${g(`agents.files.selectFile`)}</div>`}
                </div>
              </div>
            `:K(g(`agents.files.loadHint`)))}
  `}function fr(){return(fr=e((()=>{I(),Pe(),Tt(),Re(),wt(),Le(),ze(),G(),k(),_(),ge(),ar(),sr(),bn()})))()}function pr(){return hr+=1,`testclaw-multi-select-${hr}`}function mr(e){let t=e.indexOf(`/`);return t>0?e.slice(0,t):void 0}var hr,gr,X;function _r(){return(_r=e((()=>{ut(),c(),n(),I(),je(),ke(),Ae(),k(),E(),gt(),Re(),ht(),hr=0,gr=e=>e.preventDefault(),X=class extends b{constructor(...e){super(...e),this.options=[],this.value=[],this.isExcluded=()=>!1,this.getValueKey=e=>e,this.placeholder=``,this.accessibleLabel=``,this.allowCustom=!1,this.disabled=!1,this.onChange=()=>{},this.onOpen=()=>{},this.open=!1,this.query=``,this.activeIndex=0,this.listboxId=pr(),this.field=null,this.input=null,this.setField=e=>{this.field=e instanceof HTMLElement?e:null},this.setInput=e=>{this.input=e instanceof HTMLInputElement?e:null},this.configurePopup=e=>{e instanceof l&&this.field&&(At(e,this.field,`bottom`),e.sync=`width`)},this.handleFieldClick=e=>{this.disabled||e.target instanceof Element&&e.target.closest(`button`)||(this.input?.focus(),this.openMenu())},this.handleInput=e=>{e.currentTarget instanceof HTMLInputElement&&(this.query=e.currentTarget.value,this.activeIndex=0,this.openMenu())},this.handleKeydown=e=>{if(!(this.disabled||e.isComposing))switch(e.key){case`ArrowDown`:case`ArrowUp`:{if(e.preventDefault(),!this.open){this.openMenu();return}let t=this.rows(),n=t.flatMap((e,t)=>e.disabled?[]:[t]);if(n.length>0){let r=n.indexOf(this.activeRowIndex(t)),a=e.key===`ArrowDown`?1:n.length-1;this.activeIndex=i(n[(r+a)%n.length],`selectable option index`)}return}case`Enter`:{if(!this.open)return;let t=this.rows(),n=t[this.activeRowIndex(t)];n&&(e.preventDefault(),this.selectRow(n));return}case`,`:this.allowCustom&&(e.preventDefault(),this.commitTypedQuery());return;case`Escape`:this.open&&(e.preventDefault(),e.stopPropagation(),this.closeMenu());return;case`Backspace`:!this.query&&this.value.length>0&&(e.preventDefault(),this.removeAt(this.value.length-1))}},this.handleFocusOut=e=>{let t=e.relatedTarget;t instanceof Node&&this.contains(t)||this.closeMenu()}}willUpdate(e){e.has(`disabled`)&&this.disabled&&this.open&&this.closeMenu(),this.open&&(e.has(`options`)||e.has(`value`)||e.has(`isExcluded`)||e.has(`getValueKey`))&&(this.activeIndex=Math.min(this.activeIndex,Math.max(0,this.rows().length-1)))}updated(e){if(!this.open||![`open`,`query`,`activeIndex`,`options`,`value`,`isExcluded`,`getValueKey`].some(t=>e.has(t)))return;let t=this.querySelector(`.multi-select__menu`),n=t?.querySelector(`[aria-selected="true"]`);if(!t||!n)return;let r=t.getBoundingClientRect(),i=n.getBoundingClientRect();i.top<r.top?t.scrollTop-=r.top-i.top:i.bottom>r.bottom&&(t.scrollTop+=i.bottom-r.bottom)}optionFor(e){let t=this.getValueKey(e);return this.options.find(e=>this.getValueKey(e.value)===t)}rows(){let e=new Set(this.value.map(e=>this.getValueKey(e))),t=this.query.trim(),n=this.getValueKey(t),r=t.toLowerCase(),i=[],a=null;for(let t of this.options){let o=this.getValueKey(t.value);if(e.has(o)||this.isExcluded(t.value))continue;if(o===n){a=t;continue}let s=[t.label,t.value,t.provider,t.detail];(!r||s.some(e=>e?.toLowerCase().includes(r)))&&i.push(t)}return a?i.unshift(a):this.allowCustom&&t&&!e.has(n)&&!this.isExcluded(t)&&i.push({value:t,label:t,provider:mr(t),custom:!0}),i}openMenu(){this.disabled||this.open||(this.open=!0,this.activeIndex=0,this.onOpen())}activeRowIndex(e){let t=e[this.activeIndex];return t&&!t.disabled?this.activeIndex:e.findIndex(e=>!e.disabled)}closeMenu(){this.open=!1,this.query=``,this.activeIndex=0}commit(e){if(this.disabled)return;let t=new Set(this.value.map(e=>this.getValueKey(e))),n=[];for(let r of e){let e=r.trim(),i=this.getValueKey(e);e&&!t.has(i)&&!this.isExcluded(e)&&!this.optionFor(e)?.disabled&&(t.add(i),n.push(e))}n.length>0&&this.onChange([...this.value,...n]),this.query=``,this.activeIndex=0}commitTypedQuery(){this.commit(h(this.query))}selectRow(e){e.disabled||(e.custom?this.commitTypedQuery():this.commit([e.value]))}removeAt(e){this.disabled||(this.onChange(this.value.filter((t,n)=>n!==e)),this.input?.focus())}renderChip(e,t){let n=this.optionFor(e),r=n?.provider??mr(e),i=n?.label??e;return P`
      <span class="chip multi-select__chip" data-value=${e} title=${e}>
        ${r?dt(r,{className:`multi-select__chip-icon`}):F}
        <span class="multi-select__chip-label">${i}</span>
        <button
          type="button"
          class="chip-remove"
          aria-label=${g(`common.multiSelect.remove`,{value:i})}
          ?disabled=${this.disabled}
          @click=${()=>this.removeAt(t)}
        >
          ${z.x}
        </button>
      </span>
    `}render(){let e=this.open?this.rows():[],t=this.activeRowIndex(e),n=this.accessibleLabel||this.placeholder;return P`
      <div
        class=${this.open?`multi-select multi-select--open`:`multi-select`}
        ?data-disabled=${this.disabled}
        @click=${this.handleFieldClick}
        @focusout=${this.handleFocusOut}
        ${De(this.setField)}
      >
        ${this.value.map((e,t)=>this.renderChip(e,t))}
        <input
          ${De(this.setInput)}
          class="multi-select__input"
          type="text"
          role="combobox"
          autocomplete="off"
          spellcheck="false"
          aria-label=${n}
          aria-expanded=${this.open?`true`:`false`}
          aria-controls=${this.listboxId}
          aria-autocomplete="list"
          aria-activedescendant=${t>=0?`${this.listboxId}-${t}`:F}
          placeholder=${this.value.length===0?this.placeholder:``}
          .value=${Me(this.query)}
          ?disabled=${this.disabled}
          @input=${this.handleInput}
          @keydown=${this.handleKeydown}
        />
        <span class="multi-select__chevron" aria-hidden="true">${z.chevronDown}</span>
      </div>
      <wa-popup class="multi-select__popup" ?active=${this.open} ${De(this.configurePopup)}>
        <div class="multi-select__menu" role="listbox" id=${this.listboxId} aria-label=${n}>
          ${e.map((e,n)=>P`
              <div
                class="multi-select__option"
                role="option"
                id=${`${this.listboxId}-${n}`}
                aria-selected=${n===t?`true`:`false`}
                aria-disabled=${e.disabled?`true`:`false`}
                data-value=${e.value}
                ?data-custom=${!!e.custom}
                @mousedown=${gr}
                @mousemove=${()=>{!e.disabled&&this.activeIndex!==n&&(this.activeIndex=n)}}
                @click=${()=>this.selectRow(e)}
              >
                ${e.provider?dt(e.provider,{className:`multi-select__option-icon`}):F}
                <span class="picker-select__copy">
                  <span class="picker-select__label">
                    ${e.custom?g(`common.multiSelect.addCustom`,{value:e.value}):e.label}
                  </span>
                  ${e.detail?P`<span class="picker-select__description">${e.detail}</span>`:F}
                </span>
              </div>
            `)}
          ${e.length===0?P`<div class="multi-select__empty">${g(`common.multiSelect.noMatches`)}</div>`:F}
        </div>
      </wa-popup>
    `}},m([R({attribute:!1})],X.prototype,`options`,void 0),m([R({attribute:!1})],X.prototype,`value`,void 0),m([R({attribute:!1})],X.prototype,`isExcluded`,void 0),m([R({attribute:!1})],X.prototype,`getValueKey`,void 0),m([R({attribute:!1})],X.prototype,`placeholder`,void 0),m([R({attribute:!1})],X.prototype,`accessibleLabel`,void 0),m([R({attribute:!1})],X.prototype,`allowCustom`,void 0),m([R({attribute:!1})],X.prototype,`disabled`,void 0),m([R({attribute:!1})],X.prototype,`onChange`,void 0),m([R({attribute:!1})],X.prototype,`onOpen`,void 0),m([L()],X.prototype,`open`,void 0),m([L()],X.prototype,`query`,void 0),m([L()],X.prototype,`activeIndex`,void 0)})))()}function vr(){return(vr=e((()=>{_r(),customElements.get(`testclaw-multi-select`)||customElements.define(`testclaw-multi-select`,X)})))()}function yr(e){let{agent:t,configForm:n,agentFilesList:r,configLoading:i,configSaving:a,configDirty:o,onConfigReload:c,onConfigSave:l,onModelChange:u,onModelFallbacksChange:d,onSelectPanel:f}=e,p=w(t,n,r,e.defaultId,e.agentIdentity),m=p.isDefault,h=ee(n,t.id),_=t.model,v=y(h.defaults?.model??_),b=pe(h.entry?.model),x=pe(h.defaults?.model)||(v===`-`?null:se(v))||(n?null:pe(_)),C=b??x??null,te=m?C:b,T=ue(h.entry?.model,h.defaults?.model)??(n?null:Te(_))??[],E=!e.canUpdateConfig||!n||i||a,D=t.thinkingDefault??`-`,O=e.identityDraft,ne=O.name??e.agentIdentity?.name??t.identity?.name??t.name??``,k=O.emoji??e.agentIdentity?.emoji??t.identity?.emoji??``,A=O.avatar?null:ce(t,e.agentIdentity),ie=O.avatar??(A?e.identityAvatarLoader.resolve(A):null),ae=O.name!==null||O.emoji!==null||O.avatar!==null,j=O.name!==null&&!O.name.trim()||O.emoji!==null&&!O.emoji.trim(),M=e.identitySaving||!e.canUpdateIdentity,le=t=>{let n=t.target,r=n.files?.[0];n.value=``,r&&e.onIdentityAvatarSelect(r)},de=S(n,null,e.modelCatalog,t.id),N=oe(n,C,t.id);return P`
    ${U({title:g(`agents.identity.title`),description:g(`agents.identity.subtitle`)},P`
        <div class="settings-row settings-row--stacked">
          <div class="agent-identity-editor">
            <span class="agent-identity-editor__avatar" aria-hidden="true">
              ${yt({id:t.id,avatar:ie,textAvatar:O.emoji??re(t,e.agentIdentity)},``,A?e.identityAvatarLoader.imageErrorHandler(A):void 0)}
            </span>
            <div class="agent-identity-editor__fields">
              <label class="field">
                <span>${g(`agents.identity.name`)}</span>
                <input
                  type="text"
                  maxlength="64"
                  .value=${ne}
                  placeholder=${g(`agents.identity.namePlaceholder`)}
                  ?disabled=${M}
                  @input=${t=>e.onIdentityFieldChange(`name`,t.target.value)}
                />
              </label>
              <label class="field agent-identity-editor__emoji">
                <span>${g(`agents.identity.emoji`)}</span>
                <input
                  type="text"
                  maxlength="8"
                  .value=${k}
                  placeholder="🦞"
                  ?disabled=${M}
                  @input=${t=>e.onIdentityFieldChange(`emoji`,t.target.value)}
                />
              </label>
            </div>
          </div>
          ${e.identityError?P`<div class="settings-row__desc" role="alert" style="color: var(--danger);">
                  ${e.identityError}
                </div>`:F}
          <div class="agent-identity-editor__actions">
            <button
              type="button"
              class="btn btn--sm"
              ?disabled=${M}
              @click=${e=>{let t=e.currentTarget,n=t instanceof HTMLButtonElement?t.nextElementSibling:null;n instanceof HTMLInputElement&&n.click()}}
            >
              ${g(ie?`agents.identity.replaceImage`:`agents.identity.chooseImage`)}
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ?disabled=${M}
              @change=${le}
            />
            <button
              type="button"
              class="btn btn--sm primary"
              ?disabled=${M||!ae||j}
              @click=${()=>e.onIdentitySave()}
            >
              ${e.identitySaving?g(`common.saving`):g(`common.save`)}
            </button>
          </div>
          <div class="settings-row__desc agent-identity-editor__hint">
            ${g(`agents.identity.fileHint`)}
          </div>
        </div>
      `)}
    ${U({title:g(`agents.overview.title`),description:g(`agents.overview.subtitle`)},P`
        <dl class="settings-kv">
          <dt>${g(`agents.context.workspace`)}</dt>
          <dd>
            <testclaw-tooltip .content=${g(`agents.context.openFilesTab`)}>
              <button
                type="button"
                class="workspace-link mono"
                @click=${()=>f(`files`)}
                aria-label=${g(`agents.context.openFilesTab`)}
              >
                ${p.workspace}
              </button>
            </testclaw-tooltip>
          </dd>
          <dt>${g(`agents.context.primaryModel`)}</dt>
          <dd><code>${p.model}</code></dd>
          <dt>${g(`agents.context.runtime`)}</dt>
          <dd><code>${p.runtime}</code></dd>
          <dt>${g(`agents.context.thinkingDefault`)}</dt>
          <dd><code>${D}</code></dd>
          <dt>${g(`agents.context.skillsFilter`)}</dt>
          <dd>${p.skillsLabel}</dd>
        </dl>
      `)}
    ${o?P`<div class="callout warn">${g(`agents.overview.unsavedConfig`)}</div>`:F}
    ${U({title:g(`agents.overview.modelSelection`),notice:Et({status:e.modelCatalogStatus}),actions:P`
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${i}
            @click=${c}
          >
            ${g(`common.reloadConfig`)}
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||a||!o}
            @click=${l}
          >
            ${g(a?`common.saving`:`common.save`)}
          </button>
        `},P`
        ${H({title:g(m?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),control:qt({label:g(m?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),value:te??``,options:[{value:``,label:m?g(`agents.overview.notSet`):x?g(`agents.overview.inheritDefaultModel`,{model:x}):g(`agents.overview.inheritDefault`)},...S(n,C??void 0,e.modelCatalog,t.id)],disabled:E,onChange:e=>u(t.id,e||null),onOpen:e.onModelCatalogOpen})})}
        ${H({title:g(`chat.modelControls.decisionLabel`),description:g(`chat.modelControls.decisionAgentHelp`),control:Yt({id:`agent-decision-model`,models:e.decisionModels,value:typeof h.entry?.decisionModel==`string`?h.entry.decisionModel:void 0,inherit:{model:typeof h.defaults?.decisionModel==`string`?h.defaults.decisionModel:void 0},disabled:E,onChange:n=>e.onDecisionModelChange(t.id,n),onOpen:e.onModelCatalogOpen})})}
        ${H({title:g(`agents.overview.fallbacks`),stacked:!0,control:P`
            <testclaw-multi-select
              class="agent-fallbacks"
              .options=${de}
              .value=${T}
              .isExcluded=${N}
              .getValueKey=${s}
              .placeholder=${g(`agents.overview.addFallback`)}
              .accessibleLabel=${g(`agents.overview.fallbacks`)}
              .allowCustom=${!0}
              .disabled=${E}
              .onChange=${e=>d(t.id,e)}
              .onOpen=${e.onModelCatalogOpen}
            ></testclaw-multi-select>
          `})}
      `)}
  `}function br(e,t,n){return U({title:g(`agents.context.title`),description:t},P`
      <dl class="settings-kv">
        <dt>${g(`agents.context.workspace`)}</dt>
        <dd>
          <button type="button" class="workspace-link mono" @click=${()=>n(`files`)}>
            ${e.workspace}
          </button>
        </dd>
        <dt>${g(`agents.context.primaryModel`)}</dt>
        <dd><code>${e.model}</code></dd>
        <dt>${g(`agents.context.runtime`)}</dt>
        <dd><code>${e.runtime}</code></dd>
        <dt>${g(`agents.context.identityName`)}</dt>
        <dd>${e.identityName}</dd>
        <dt>${g(`agents.context.identityAvatar`)}</dt>
        <dd>${e.identityAvatar}</dd>
        <dt>${g(`agents.context.skillsFilter`)}</dt>
        <dd>${e.skillsLabel}</dd>
        <dt>${g(`agents.context.default`)}</dt>
        <dd>${e.isDefault?g(`common.yes`):g(`common.no`)}</dd>
      </dl>
    `)}function xr(){return(xr=e((()=>{I(),u(),Xt(),Nt(),Jt(),vr(),Ct(),G(),ze(),k(),_(),ae()})))()}function Sr(e){let t=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving,n=ee(e.configForm,e.agentId),r=Array.isArray(n.entry?.skills)?a(n.entry.skills):void 0,i=O(e.configForm,e.agentId),o=new Set(i??[]),s=i!==void 0,c=r===void 0&&s,l=e.canPatchConfig&&r!==void 0&&!!e.configForm&&!e.configLoading&&!e.configSaving,u=!!(e.report&&e.activeAgentId===e.agentId),f=u?e.report?.skills??[]:[],p=d(e.filter),m=p?f.filter(e=>d([e.name,e.description,e.source].join(` `)).includes(p)):f,h=$t(m),_=s?f.filter(e=>o.has(e.name)).length:f.length,v=f.length;return P`
    ${e.configForm?F:P`<div class="callout info">${g(`agents.skillsPanel.loadConfig`)}</div>`}
    ${s?P`<div class="callout info">
            ${g(c?`agents.skillsPanel.inheritedAllowlist`:`agents.skillsPanel.customAllowlist`)}
          </div>`:P`<div class="callout info">${g(`agents.skillsPanel.allEnabled`)}</div>`}
    ${!u&&!e.loading?P`<div class="callout info">${g(`agents.skillsPanel.loadAgent`)}</div>`:F}
    ${e.error?P`<div class="callout danger">${e.error}</div>`:F}
    ${U({title:g(`agents.skillsPanel.title`),description:P`${g(`agents.skillsPanel.subtitle`)}
        ${v>0?P`<span class="mono">${_}/${v}</span>`:F}`,actions:P`
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${()=>e.onDisableAll(e.agentId)}
          >
            ${g(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!l}
            @click=${()=>e.onClear(e.agentId)}
          >
            ${g(`common.reset`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${g(`common.reloadConfig`)}
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?g(`common.loading`):g(`common.refresh`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?g(`common.saving`):g(`common.save`)}
          </button>
        `},P`
        ${H({title:g(`agents.skillsPanel.filter`),description:g(`agents.skillsPanel.shown`,{count:String(m.length)}),control:P`
            <input
              class="settings-input"
              aria-label=${g(`agents.skillsPanel.filter`)}
              .value=${e.filter}
              @input=${t=>{let n=t.currentTarget;n instanceof HTMLInputElement&&e.onFilterChange(n.value)}}
              placeholder=${g(`agents.skillsPanel.searchPlaceholder`)}
              autocomplete="off"
              name="agent-skills-filter"
            />
          `})}
        ${m.length===0?K(g(`agents.skillsPanel.empty`)):P`
                <div class="agents-panel-body agent-skills-groups">
                  ${h.map(n=>Cr(n,{agentId:e.agentId,allowSet:o,usingAllowlist:s,editable:t,filterActive:!!p,onToggle:e.onToggle}))}
                </div>
              `}
      `)}
  `}function Cr(e,t){let n=!t.filterActive&&(e.id===`workspace`||e.id===`built-in`);return P`
    <details class="agent-skills-group" ?open=${!n}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(e=>wr(e,{agentId:t.agentId,allowSet:t.allowSet,usingAllowlist:t.usingAllowlist,editable:t.editable,onToggle:t.onToggle}))}
      </div>
    </details>
  `}function wr(e,t){let n=!t.usingAllowlist||t.allowSet.has(e.name),r=nn(e),i=Qt(e);return P`
    <div class="settings-row agent-skill-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${e.emoji?`${e.emoji} `:``}${e.name}</span
        >
        <span class="settings-row__desc">${e.description}</span>
        ${Zt({skill:e})}
        ${r.length>0?P`<span class="settings-row__desc">
                ${g(`agents.skillsPanel.missing`,{items:r.join(`, `)})}
              </span>`:F}
        ${i.length>0?P`<span class="settings-row__desc">
                ${g(`agents.skillsPanel.reason`,{items:i.join(`, `)})}
              </span>`:F}
      </div>
      <div class="settings-row__control">
        ${_t({checked:n,disabled:!t.editable,ariaLabel:e.name,onChange:n=>t.onToggle(t.agentId,e.name,n)})}
      </div>
    </div>
  `}function Tr(){return(Tr=e((()=>{n(),I(),G(),k(),_(),tn(),en()})))()}function Er(e,t){let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function Dr(e){if(!e)return[];let t=new Set;for(let n of e.channelOrder??[])t.add(n);for(let n of e.channelMeta??[])t.add(n.id);for(let n of Object.keys(e.channelAccounts??{}))t.add(n);let n=[],r=e.channelOrder?.length?e.channelOrder:Array.from(t);for(let e of r)t.has(e)&&(n.push(e),t.delete(e));for(let e of t)n.push(e);return n.map(t=>({id:t,label:Er(e,t),accounts:e.channelAccounts?.[t]??[]}))}function Or(e){let t=0,n=0,r=0;for(let i of e){let e=i.probe&&typeof i.probe==`object`&&`ok`in i.probe?!!i.probe.ok:!1,a=typeof i.connected==`boolean`||typeof i.running==`boolean`;(i.connected===!0||i.running===!0||!a&&e)&&(t+=1),i.configured&&(n+=1),i.enabled&&(r+=1)}return{total:e.length,connected:t,configured:n,enabled:r}}function kr(e){let t=Dr(e.snapshot),n=e.lastSuccess?ve(e.lastSuccess):g(`common.never`);return P`
    ${br(e.context,g(`agents.context.configurationSubtitle`),e.onSelectPanel)}
    ${e.error?P`<div class="callout danger">${e.error}</div>`:F}
    ${e.snapshot?F:P`<div class="callout info">${g(`agents.channels.loadHint`)}</div>`}
    ${U({title:g(`agents.channels.title`),description:P`${g(`agents.channels.subtitle`)}
        ${g(`agents.channels.lastRefresh`,{time:n})}`,actions:P`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?g(`common.refreshing`):g(`common.refresh`)}
          </button>
        `},t.length===0?K(g(`agents.channels.empty`)):t.map(t=>{let n=Or(t.accounts),r=n.total?g(`agents.channels.connectedCount`,{connected:String(n.connected),total:String(n.total)}):g(`agents.channels.noAccounts`),i=n.configured?g(`agents.channels.configuredCount`,{count:String(n.configured)}):g(`agents.channels.notConfigured`),a=n.total?g(`agents.channels.enabledCount`,{count:String(n.enabled)}):g(`common.disabled`),o=v({configForm:e.configForm,channelId:t.id,fields:jr}),s=[t.id,i,a,...o.map(e=>`${e.label}: ${e.value}`)];return H({title:t.label,description:s.join(` · `),control:P`
                ${n.configured===0?P`
                        <a
                          class="settings-row__value"
                          href="https://docs.testclaw.ai/channels"
                          target="_blank"
                          rel="noopener"
                          >${g(`agents.channels.setupGuide`)}</a
                        >
                      `:F}
                ${ft({kind:n.connected>0?`ok`:n.total?`warn`:`muted`,label:r})}
              `})}))}
  `}function Ar(e){return P`
    ${br(e.context,g(`agents.context.schedulingSubtitle`),e.onSelectPanel)}
    ${e.error?P`<div class="callout danger">${e.error}</div>`:F}
    ${U({title:g(`agents.cronPanel.schedulerTitle`),description:g(`agents.cronPanel.schedulerSubtitle`),actions:P`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?g(`common.refreshing`):g(`common.refresh`)}
          </button>
        `},P`
        ${H({title:g(`common.enabled`),control:W(e.status?e.status.enabled?g(`common.yes`):g(`common.no`):g(`common.na`))})}
        ${H({title:g(`agents.cronPanel.jobs`),control:W(e.scopedTotal??g(`common.na`))})}
        ${H({title:g(`agents.cronPanel.nextWake`),control:W(on(e.status?.enabled===!1?null:e.scopedNextWakeAtMs))})}
      `)}
    ${U({title:g(`agents.cronPanel.agentJobsTitle`),description:g(`agents.cronPanel.agentJobsSubtitle`)},e.jobs.length===0?K(g(`agents.cronPanel.noJobs`)):P`
            ${e.jobs.map(t=>{let n=[t.description,sn(t),t.sessionTarget,cn(t),un(t)].filter(Boolean);return H({title:t.name,description:n.join(` · `),control:P`
                  ${ft({kind:t.enabled?`ok`:`warn`,label:t.enabled?g(`common.enabled`):g(`common.disabled`)})}
                  <a
                    class="btn btn--sm"
                    href=${`${Be(`cron`,e.basePath)}?job=${encodeURIComponent(t.id)}`}
                    aria-label=${g(`agents.cronPanel.editJob`,{name:t.name})}
                  >
                    ${g(`agents.cronPanel.edit`)}
                  </a>
                  <button
                    class="btn btn--sm"
                    ?disabled=${!e.canRunNow}
                    @click=${()=>e.onRunNow(t.id)}
                  >
                    ${g(`agents.cronPanel.runNow`)}
                  </button>
                `})})}
            ${rn({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMore})}
          `)}
  `}var jr;function Mr(){return(Mr=e((()=>{I(),B(),an(),G(),k(),C(),ge(),ln(),xr(),jr=[`groupPolicy`,`streamMode`,`dmPolicy`]})))()}function Z(e){let t=d(e);return Ir.get(t)??t}function Nr(e){return e?e.map(Z).filter(Boolean):[]}function Pr(e){let n=Nr(e),r=[];for(let e of n){let t=Object.hasOwn(Lr,e)?Lr[e]:void 0;if(t){r.push(...t);continue}r.push(e)}return t(r)}function Fr(e){return Kt(e)}var Ir,Lr;function Rr(){return(Rr=e((()=>{n(),Wt(),Ir=new Map([[`bash`,`exec`],[`apply-patch`,`apply_patch`],[`cron`,`automations`]]),Lr={...Bt}})))()}function zr(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function Br(e){let t=e.normalize(e.raw);return t?t===`*`?{kind:`all`}:t.includes(`*`)?{kind:`regex`,value:RegExp(`^${zr(t).replaceAll(`\\*`,`.*`)}$`)}:{kind:`exact`,value:t}:{kind:`exact`,value:``}}function Vr(e){return Array.isArray(e.raw)?e.raw.map(t=>Br({raw:t,normalize:e.normalize})).filter(e=>e.kind!==`exact`||e.value):[]}function Q(e,t){for(let n of t)if(n.kind===`all`||n.kind===`exact`&&e===n.value||n.kind===`regex`&&n.value.test(e))return!0;return!1}function Hr(e){return Array.isArray(e)?Vr({raw:Pr(e),normalize:Z}):[]}function Ur(e,t){if(!t)return!0;let n=Z(e);if(Q(n,Hr(t.deny)))return!1;let r=Hr(t.allow);return!!(r.length===0||Q(n,r)||n===`apply_patch`&&Q(`exec`,r))}function Wr(e,t){if(!Array.isArray(t)||t.length===0)return!1;let n=Z(e),r=Hr(t);return!!(Q(n,r)||n===`apply_patch`&&Q(`exec`,r))}function Gr(){return(Gr=e((()=>{Rr()})))()}function Kr(e){return e.length===0?F:P`
    <div class="agent-tool-badges">
      ${e.map(e=>P`<span class="settings-row__value">${e}</span>`)}
    </div>
  `}function qr(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId,i=[];return n===`plugin`&&r?i.push(g(`agentTools.plugin`,{id:r})):n===`core`&&i.push(g(`agentTools.builtIn`)),t.optional&&i.push(g(`agentTools.optional`)),i}function Jr(e){let t=qr(e.section,e.tool);return e.activeEntry&&t.unshift(g(`agentTools.liveNow`)),t}function Yr(e){return e.denied?g(`agentTools.disabledByOverride`):e.allowed&&e.baseAllowed?g(`agentTools.enabledByProfile`):e.allowed?g(`agentTools.enabledByOverride`):g(`agentTools.notIncluded`)}function Xr(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId;return n===`plugin`&&r?g(`agentTools.plugin`,{id:r}):g(`agentTools.builtIn`)}function Zr(e){return e.denied?g(`agentTools.overrideOff`):e.allowed&&e.baseAllowed?g(`agentTools.enabled`):e.allowed?g(`agentTools.overrideOn`):g(`agentTools.profileOff`)}function Qr(e){return e.activeEntry?g(`agentTools.liveNow`):e.runtimeSessionMatchesSelectedAgent?g(`agentTools.notLive`):g(`agentTools.otherAgent`)}function $r(e){return`agent-tool-${Z(e).replace(/[^a-z0-9_-]+/g,`-`)}`}function ei(e){return(e??[]).flatMap(e=>e.tools)}function ti(e){let t=e.currentTarget;if(t instanceof HTMLDetailsElement&&!t.open)for(let e of t.querySelectorAll(`.agent-tool-card[open]`))e.open=!1}function ni(e,t){let n=document.getElementById(t);if(!(n instanceof HTMLDetailsElement))return;e.preventDefault();let r=n.closest(`.agent-tools-group`);r&&(r.open=!0),n.open=!0;let i=new URL(window.location.href);i.hash=t,window.history.replaceState(null,``,i),requestAnimationFrame(()=>{n.scrollIntoView?.({block:`center`,behavior:at()}),n.querySelector(`summary`)?.focus()})}function ri(e){let t=e?.notices??[];return t.length===0?F:P`
    <div class="agent-tools-notices">
      ${t.map(e=>P`
          <div
            class="callout ${e.severity===`warning`?`warning`:`info`}"
            style="margin-top: 12px"
          >
            ${Ee(e.message)}
          </div>
        `)}
    </div>
  `}function ii(e){return e.source===`plugin`?e.pluginId?g(`agentTools.connectedSource`,{id:e.pluginId}):g(`agentTools.connected`):e.source===`channel`?e.channelId?g(`agentTools.channelSource`,{id:e.channelId}):g(`agentTools.channel`):e.source===`mcp`?`MCP`:g(`agentTools.builtIn`)}function ai(e){let t=ee(e.configForm,e.agentId),n=t.entry?.tools??{},r=t.globalTools??{},i=n.profile??r.profile??`full`,a=Gt(e.toolsCatalogResult),o=Ht(e.toolsCatalogResult),s=n.profile?g(`agentTools.profileSourceAgent`):r.profile?g(`agentTools.profileSourceGlobal`):g(`agentTools.profileSourceDefault`),c=Array.isArray(n.allow)&&n.allow.length>0,l=Array.isArray(r.allow)&&r.allow.length>0,u=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving&&!c&&!(e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError),d=c?[]:Array.isArray(n.alsoAllow)?n.alsoAllow:[],f=c?[]:Array.isArray(n.deny)?n.deny:[],p=c?{allow:n.allow??[],deny:n.deny??[]}:Fr(i),m=o.flatMap(e=>e.tools.map(e=>e.id)),h=e=>{let t=Ur(e,p),n=Wr(e,d),r=Wr(e,f);return{allowed:(t||n)&&!r,baseAllowed:t,denied:r}},_=m.filter(e=>h(e).allowed).length,v=e.runtimeSessionMatchesSelectedAgent&&!e.toolsEffectiveError?ei(e.toolsEffectiveResult?.groups):[],y=Array.from(new Map(v.map(e=>[Z(e.id),e])).values()),b=y.slice(0,oi),x=Math.max(0,y.length-b.length),S=y.length,C=new Map(v.map(e=>[Z(e.id),e])),w=new Set(C.keys()),te=e=>e.toSorted((e,t)=>{let n=Z(e.id),r=Z(t.id),i=+!!w.has(n),a=+!!w.has(r);if(i!==a)return a-i;let o=+!!h(e.id).allowed,s=+!!h(t.id).allowed;return o===s?e.label.localeCompare(t.label):s-o}),T=(t,n)=>{let r=new Set(Nr(d)),i=new Set(Nr(f));for(let e of t){let t=h(e).baseAllowed,a=Z(e);n?(i.delete(a),t||r.add(a)):(r.delete(a),i.add(a))}e.onOverridesChange(e.agentId,[...r],[...i])},E=e.runtimeSessionMatchesSelectedAgent?e.toolsEffectiveLoading&&!e.toolsEffectiveResult&&!e.toolsEffectiveError?vt({label:g(`agentTools.loadingAvailable`),rows:2}):e.toolsEffectiveError?K(g(`agentTools.availableError`)):(e.toolsEffectiveResult?.groups?.length??0)===0?K(g(`agentTools.noAvailable`)):P`
              <div class="agents-panel-body">
                <div class="agent-tools-runtime">
                  ${b.map(e=>{let t=$r(e.id);return P`
                      <a
                        class="agent-tools-runtime-chip"
                        href="#${t}"
                        @click=${e=>ni(e,t)}
                      >
                        <span class="mono" translate="no">${e.label}</span>
                        <span class="agent-tools-runtime-chip__meta"
                          >${ii(e)}</span
                        >
                      </a>
                    `})}
                  ${x>0?P`
                          <span
                            class="agent-tools-runtime-chip agent-tools-runtime-chip--more"
                            title=${g(`agentTools.moreLiveTitle`,{count:String(x)})}
                          >
                            ${g(`agentTools.moreLive`,{count:String(x)})}
                          </span>
                        `:F}
                </div>
              </div>
            `:K(g(`agentTools.switchAgent`));return P`
    ${e.configForm?F:P`<div class="callout info">${g(`agentTools.loadConfig`)}</div>`}
    ${c?P`<div class="callout info">${g(`agentTools.explicitAllowlist`)}</div>`:F}
    ${l?P`<div class="callout info">${g(`agentTools.globalAllowlist`)}</div>`:F}
    ${e.toolsCatalogError?P`<div class="callout info">${g(`agentTools.catalogFallback`)}</div>`:F}
    ${U({title:g(`agentTools.title`),description:P`${g(`agentTools.subtitle`)}
          <span class="mono"
            >${g(`agentTools.enabledSummary`,{enabled:String(_),total:String(m.length)})}</span
          >`,actions:P`
          <button
            class="btn btn--sm"
            ?disabled=${!u}
            @click=${()=>T(m,!0)}
          >
            ${g(`agentTools.enableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!u}
            @click=${()=>T(m,!1)}
          >
            ${g(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${g(`common.reloadConfig`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?g(`common.saving`):g(`common.save`)}
          </button>
        `},P`
        <dl class="settings-kv">
          <dt>${g(`agentTools.profile`)}</dt>
          <dd><code>${i}</code></dd>
          <dt>${g(`agentTools.source`)}</dt>
          <dd>${s}</dd>
          <dt>${g(`agentTools.enabled`)}</dt>
          <dd><code>${_}/${m.length}</code></dd>
          <dt>${g(`agentTools.live`)}</dt>
          <dd><code>${S}</code></dd>
          <dt>${g(`agentTools.status`)}</dt>
          <dd>
            ${e.configSaving?g(`agentTools.statusSaving`):e.configDirty?g(`agentTools.statusUnsaved`):g(`agentTools.statusSaved`)}
          </dd>
        </dl>
        ${H({title:g(`agentTools.quickPresets`),stacked:!0,control:P`
            <div class="agent-tools-buttons">
              ${a.map(t=>P`
                  <button
                    class="btn btn--sm ${i===t.id?`active`:``}"
                    ?disabled=${!u}
                    @click=${()=>e.onProfileChange(e.agentId,t.id,!0)}
                  >
                    ${t.label}
                  </button>
                `)}
              <button
                class="btn btn--sm"
                ?disabled=${!u}
                @click=${()=>e.onProfileChange(e.agentId,null,!1)}
              >
                ${g(`agentTools.inherit`)}
              </button>
            </div>
          `})}
      `)}
    ${U({title:g(`agentTools.availableNow`),description:P`${g(`agentTools.availableNowSubtitle`)}
          <span class="mono">${e.runtimeSessionKey||g(`agentTools.noSession`)}</span>`},P`${ri(e.toolsEffectiveResult)}${E}`)}
    ${Rt(e.githubIdentity,e.onOpenGitHubConnections)}
    ${U({title:g(`agentTools.catalogTitle`)},P`
        ${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError?vt({label:g(`agentTools.loadingCatalog`)}):F}
        <div
          class="agents-panel-body agent-tools-grid"
          ?hidden=${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError}
        >
          ${o.map(t=>{let n=te(t.tools),r=t.tools.filter(e=>h(e.id).allowed).length,i=t.tools.filter(e=>w.has(Z(e.id))).length,a=n.slice(0,4),o=Math.max(0,n.length-a.length);return P`
              <details class="agent-tools-group" @toggle=${ti}>
                <summary class="agent-tools-group__summary">
                  <span class="agent-tools-group__summary-main">
                    <span class="agent-tools-group__title">
                      ${t.label}
                      ${t.source===`plugin`&&t.pluginId?P`<span class="settings-row__value"
                              >${g(`agentTools.plugin`,{id:t.pluginId})}</span
                            >`:F}
                    </span>
                    <span
                      class="agent-tools-group__preview"
                      aria-label=${g(`agentTools.toolPreview`)}
                    >
                      ${a.map(e=>P`<span class="mono" translate="no" title=${e.label}
                            >${e.label}</span
                          >`)}
                      ${o>0?P`<span
                              >${g(`agentTools.more`,{count:String(o)})}</span
                            >`:F}
                    </span>
                  </span>
                  <span class="agent-tools-group__counts">
                    <span
                      >${g(t.tools.length===1?`agentTools.toolsOne`:`agentTools.tools`,{count:String(t.tools.length)})}</span
                    >
                    <span
                      >${g(r===1?`agentTools.enabledToolsOne`:`agentTools.enabledTools`,{count:String(r)})}</span
                    >
                    ${i>0?P`<span
                            >${g(i===1?`agentTools.liveToolsOne`:`agentTools.liveTools`,{count:String(i)})}</span
                          >`:F}
                  </span>
                </summary>
                <div class="agent-tools-list agent-tools-list--stacked">
                  ${n.map(n=>{let r=$r(n.id),i=h(n.id),a=C.get(Z(n.id))??null,o=n.defaultProfiles??[],s=Jr({section:t,tool:n,activeEntry:a}),c=Zr(i),l=Qr({activeEntry:a,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent});return P`
                      <details class="agent-tool-card" id=${r}>
                        <summary class="agent-tool-summary">
                          <div class="agent-tool-summary__main">
                            <div class="agent-tool-summary__title-row">
                              <span class="agent-tool-title mono" translate="no"
                                >${n.label}</span
                              >
                            </div>
                            <div class="agent-tool-sub">${n.description}</div>
                          </div>
                          <dl class="agent-tool-summary__facts">
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${g(`agentTools.access`)}</dt>
                              <dd>${c}</dd>
                            </div>
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${g(`agentTools.session`)}</dt>
                              <dd>${l}</dd>
                            </div>
                          </dl>
                          <div class="agent-tool-summary__badges">
                            ${Kr(s)}
                          </div>
                          <span
                            class="agent-tool-toggle"
                            @click=${e=>e.stopPropagation()}
                            @keydown=${e=>e.stopPropagation()}
                          >
                            ${_t({checked:i.allowed,disabled:!u,ariaLabel:g(i.allowed?`agentTools.disableNamed`:`agentTools.enableNamed`,{name:n.label}),onChange:e=>T([n.id],e)})}
                          </span>
                        </summary>
                        <div class="agent-tool-details">
                          <div class="agent-tool-details-strip">
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${g(`agentTools.access`)}</div>
                              <div>${Yr(i)}</div>
                            </div>
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${g(`agentTools.source`)}</div>
                              <div>${Xr(t,n)}</div>
                            </div>
                            ${o.length>0?P`
                                    <div class="agent-tool-detail agent-tool-detail--inline">
                                      <div class="label">${g(`agentTools.defaultPresets`)}</div>
                                      <div class="agent-tool-badges">
                                        ${o.map(e=>P`<span class="settings-row__value"
                                              >${e}</span
                                            >`)}
                                      </div>
                                    </div>
                                  `:F}
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${g(`agentTools.session`)}</div>
                              <div>
                                ${a?g(`agentTools.availableVia`,{source:ii(a)}):e.runtimeSessionMatchesSelectedAgent?g(`agentTools.unavailableSession`):g(`agentTools.inspectAgent`)}
                              </div>
                            </div>
                            <a class="agent-tool-jump" href="#${r}">
                              ${g(`agentTools.linkTool`)}
                            </a>
                          </div>
                        </div>
                      </details>
                    `})}
                </div>
              </details>
            `})}
        </div>
      `)}
  `}var oi;function si(){return(si=e((()=>{I(),Rr(),G(),zt(),k(),_(),Ut(),x(),Gr(),oi=12})))()}function ci(e){let t=fe(e.config),n=e.agentsList?.agents??[],r=e.agentsList?.selectionRequired?null:e.agentsList?.defaultId??null,i=e.selectedAgentId,a=i?n.find(e=>e.id===i)??null:null,o=i&&e.agentSkills.agentSkillsAgentId===i?e.agentSkills.agentSkillsReport?.skills?.length??null:null,s=e.channels.channelsSnapshot?Object.keys(e.channels.channelsSnapshot.channelAccounts??{}).length:null,c=i?e.cron.cronJobsTotal:null,l={files:e.agentFiles.agentFilesList?.files?.length??null,skills:o,channels:s,cron:c||null};return P`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          <div class="agents-toolbar-actions">
            ${e.access.canCreateAgent?P`
                    <button
                      class="btn btn--sm btn--ghost agents-create-btn"
                      ?disabled=${e.loading}
                      @click=${e.onCreateAgent}
                    >
                      ${g(`custodian.newAgent`)}
                    </button>
                  `:F}
            ${a?P`
                    ${Fe(a.id,P`
                        <button
                          type="button"
                          class="btn btn--sm btn--ghost"
                          @click=${e=>void pt(e,a.id,g(`agents.copyId`))}
                        >
                          <span data-copy-label>${g(`agents.copyId`)}</span>
                        </button>
                      `)}
                    <button
                      type="button"
                      class="btn btn--sm btn--ghost"
                      ?disabled=${!e.access.canUpdateConfig||!!(r&&a.id===r)}
                      @click=${()=>e.onSetDefault(a.id)}
                    >
                      ${r&&a.id===r?g(`agents.default`):g(`agents.setDefault`)}
                    </button>
                    <button
                      type="button"
                      class="btn btn--sm btn--ghost"
                      @click=${()=>e.onTogglePinnedAgent(a.id)}
                    >
                      ${e.pinnedAgentIds.includes(a.id)?g(`agents.unpinFromSwitcher`):g(`agents.pinToSwitcher`)}
                    </button>
                  `:F}
            <button
              class="btn btn--sm agents-refresh-btn"
              ?disabled=${e.loading}
              @click=${e.onRefresh}
            >
              ${e.loading?g(`common.loading`):g(`common.refresh`)}
            </button>
          </div>
        </div>
        ${e.error?P`<div class="callout danger" style="margin-top: 8px;">${e.error}</div>`:F}
      </section>
      <section class="agents-main">
        <div class="settings-group">
          ${mt({title:g(`agents.defaults.title`),description:g(`agents.defaults.description`),onClick:e.onOpenAgentDefaults})}
        </div>
        ${a?P`
                ${li(e.activePanel,t=>e.onSelectPanel(t),l)}
                <div
                  id="agent-panel"
                  class="settings-stack"
                  role="tabpanel"
                  aria-labelledby=${`agents-tab-${e.activePanel}`}
                >
                  ${e.config.lastError?P`<div class="callout danger" role="alert">
                          ${e.config.lastError}
                        </div>`:F}
                  ${e.activePanel===`overview`?Fe(a.id,yr({agent:a,basePath:e.basePath,defaultId:r,configForm:t,agentFilesList:e.agentFiles.agentFilesList,agentIdentity:e.agentIdentityById[a.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,identityDraft:e.identityDraft,identityAvatarLoader:e.identityAvatarLoader,identitySaving:e.identitySaving,identityError:e.identityError,canUpdateConfig:e.access.canUpdateConfig,canUpdateIdentity:e.access.canUpdateIdentity,configLoading:e.config.configLoading,configSaving:e.config.configSaving,configDirty:e.config.configFormDirty,modelCatalog:e.modelCatalog,decisionModels:e.decisionModels,modelCatalogStatus:e.modelCatalogStatus,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onIdentityFieldChange:e.onIdentityFieldChange,onIdentityAvatarSelect:e.onIdentityAvatarSelect,onIdentitySave:e.onIdentitySave,onModelChange:e.onModelChange,onDecisionModelChange:e.onDecisionModelChange,onModelFallbacksChange:e.onModelFallbacksChange,onModelCatalogOpen:e.onModelCatalogOpen,onSelectPanel:e.onSelectPanel})):F}
                  ${e.activePanel===`files`?dr({agentId:a.id,agentFilesList:e.agentFiles.agentFilesList,agentFilesLoading:e.agentFiles.agentFilesLoading,agentFilesError:e.agentFiles.agentFilesError??e.agentFilesListError,agentFileActive:e.agentFiles.agentFileActive,agentFileContents:e.agentFiles.agentFileContents,agentFileDrafts:e.agentFiles.agentFileDrafts,agentFileSaving:e.agentFiles.agentFileSaving,agentFileConflict:e.agentFiles.agentFileConflict,canWrite:e.access.canWriteFiles,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave,onFileReload:e.onFileReload,onFileOverwrite:e.onFileOverwrite}):F}
                  ${e.activePanel===`tools`?ai({agentId:a.id,configForm:t,configLoading:e.config.configLoading,configSaving:e.config.configSaving,configDirty:e.config.configFormDirty,toolsCatalogLoading:e.tools.toolsCatalogLoading,toolsCatalogError:e.tools.toolsCatalogError,toolsCatalogResult:e.tools.toolsCatalogResult,toolsEffectiveLoading:e.tools.toolsEffectiveLoading,toolsEffectiveError:e.tools.toolsEffectiveError,toolsEffectiveResult:e.tools.toolsEffectiveResult,runtimeSessionKey:e.runtimeSessionKey,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent,canUpdateConfig:e.access.canUpdateConfig,githubIdentity:e.githubIdentity,onOpenGitHubConnections:e.onOpenGitHubConnections,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):F}
                  ${e.activePanel===`skills`?Sr({agentId:a.id,report:e.agentSkills.agentSkillsReport,loading:e.agentSkills.agentSkillsLoading,error:e.agentSkills.agentSkillsError,activeAgentId:e.agentSkills.agentSkillsAgentId,configForm:t,configLoading:e.config.configLoading,configSaving:e.config.configSaving,configDirty:e.config.configFormDirty,filter:e.agentSkills.skillsFilter,canPatchConfig:e.access.canPatchConfig,canUpdateConfig:e.access.canUpdateConfig,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):F}
                  ${e.activePanel===`channels`?kr({context:w(a,t,e.agentFiles.agentFilesList,r,e.agentIdentityById[a.id]??null),configForm:t,snapshot:e.channels.channelsSnapshot,loading:e.channels.channelsLoading,error:e.channels.channelsError,lastSuccess:e.channels.channelsLastSuccess,onRefresh:e.onChannelsRefresh,onSelectPanel:e.onSelectPanel}):F}
                  ${e.activePanel===`cron`?Ar({basePath:e.basePath,context:w(a,t,e.agentFiles.agentFilesList,r,e.agentIdentityById[a.id]??null),agentId:a.id,jobs:e.cron.cronJobs,jobsTotal:e.cron.cronJobsTotal,jobsHasMore:e.cron.cronJobsHasMore,jobsLoadingMore:e.cron.cronJobsLoadingMore,status:e.cron.cronStatus,scopedTotal:e.cron.cronScopedTotal,scopedNextWakeAtMs:e.cron.cronScopedNextWakeAtMs,loading:e.cron.cronLoading,error:e.cron.cronError,canRunNow:e.access.canRunCron,onRefresh:e.onCronRefresh,onLoadMore:e.onCronLoadMore,onRunNow:e.onCronRunNow,onSelectPanel:e.onSelectPanel}):F}
                  ${e.activePanel===`memory`?P`
                          <div class="settings-group agent-memory-import-row">
                            ${mt({title:g(`tabs.memory`),description:g(`subtitles.memory`),onClick:()=>e.onOpenMemorySettings?.()})}
                            ${mt({title:g(`tabs.memoryImport`),description:g(`subtitles.memoryImport`),onClick:()=>e.onOpenMemoryImport?.()})}
                          </div>
                          <testclaw-agent-memory-panel
                            .agentId=${a.id}
                          ></testclaw-agent-memory-panel>
                        `:F}
                </div>
              `:U({title:g(`agents.selectTitle`)},K(g(`agents.selectSubtitle`)))}
      </section>
    </div>
  `}function li(e,t,n){let r=[{id:`overview`,label:g(`agents.tabs.overview`)},{id:`files`,label:g(`agents.tabs.files`)},{id:`tools`,label:g(`agents.tabs.tools`)},{id:`skills`,label:g(`agents.tabs.skills`)},{id:`channels`,label:g(`agents.tabs.channels`)},{id:`cron`,label:g(`agents.tabs.cronJobs`)},{id:`memory`,label:g(`agents.tabs.memory`)}];return kt({id:`agents`,active:e,tabs:r.map(e=>({value:e.id,label:e.label,count:n[e.id]})),ariaLabel:g(`tabs.agents`),panelId:`agent-panel`,onSelect:t})}function ui(){return(ui=e((()=>{I(),Oe(),bt(),Tt(),G(),k(),Vt(),_(),he(),fr(),xr(),Tr(),Mr(),si()})))()}var di,$,fi,pi;function mi(){return(mi=e((()=>{r(),I(),je(),He(),B(),Ve(),Ct(),G(),Ft(),Lt(),k(),_(),j(),A(),he(),Ze(),x(),Se(),qe(),Qe(),Ye(),le(),rt(),E(),_e(),bn(),Rn(),Kn(),Xn(),$n(),ui(),di=`https://docs.testclaw.ai/concepts/multi-agent`,$=class extends b{constructor(...e){super(...e),this.agentsList=null,this.agentsSelectedId=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,this.toolsCatalogError=null,this.toolsCatalogResult=null,this.toolsEffectiveLoading=!1,this.toolsEffectiveLoadingKey=null,this.toolsEffectiveResultKey=null,this.toolsEffectiveError=null,this.toolsEffectiveResult=null,this.chatModelCatalog=[],this.decisionModels=[],this.chatModelCatalogStatus=Dt(),this.chatModelCatalogPending=null,this.chatModelCatalogRequest=null,this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileBaseHashes={},this.agentFileHashes={},this.agentFileConflict=null,this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentFileWriteRevisions=new Map,this.retainedFileDrafts=new Map,this.agentIdentityLoading=!1,this.agentIdentityError=null,this.identityDraft={name:null,emoji:null,avatar:null},this.identityAvatarLoader=new ot(this),this.identitySaving=!1,this.identityError=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.skillsFilter=``,this.cron=lt(),this.routeDataInitialized=!1,this.applyingRouteSelection=!1,this.routeSelectionSuperseded=!1,this.hasBoundAgents=!1,this.agentsSource=null,this.hasBoundAgentIdentity=!1,this.agentIdentitySource=null,this.hasBoundSessions=!1,this.sessionsSource=null,this.chatModelCatalogSubscription=null,this.normalizedLocation=``,this.githubProfileId=null,this.githubIdentity=new It({requestUpdate:()=>this.requestUpdate(),runExternalMutation:(e,t)=>this.context.runtimeConfig.runExternalMutation(e,t)}),this.gateway=new it(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForSourceChange(),invalidateRequests:e=>{e.identityChanged||(this.invalidateTransientRequests(),this.resetModelCatalog())},onSnapshot:({becameAvailable:e,becameConnected:t})=>{if(this.syncGatewayState(),e&&!t){let e=this.chatModelCatalogSubscription;Promise.resolve(this.chatModelCatalogPending).then(()=>{let t=this.gateway.snapshot,n=this.chatModelCatalogStatus;e?.isCurrent()&&t&&be(t)&&(n.awaitingGateway||n.error!==null)&&this.ensureModelCatalog({refresh:!0})})}},ensureInitialData:()=>this.ensureInitialData()}),this.subscriptions=new ye(this).effect(()=>this.context?.settingsAgentSelection,e=>(this.syncSettingsSelection(),e.subscribe(()=>{if(this.context.settingsAgentSelection!==e)return;let t=this.agentsSelectedId;this.syncSettingsSelection();let n=this.agentsSelectedId,r=this.context.router.getState();!this.applyingRouteSelection&&this.routeDataInitialized&&this.routeData&&n&&r.matches[0]?.routeId===`agents`&&(!r.pendingMatches.length||r.pendingMatches[0]?.routeId===`agents`)&&Jn(this.context,n,t,this.agentsPanel),this.loadActivePanelData(),this.requestUpdate()}))).effect(()=>this.context?.agents,e=>{let t=this.hasBoundAgents;this.hasBoundAgents=!0,this.agentsSource=e,t&&this.resetForSourceChange(),this.syncAgentState(e),this.ensureInitialData();let n=e.subscribe(()=>{this.agentsSource===e&&this.context.agents===e&&(this.syncAgentState(e),this.ensureAgentIdentities(),this.loadActivePanelData(),this.requestUpdate())});return()=>{n(),this.agentsSource===e&&(this.agentsSource=null)}}).effect(()=>this.context?.agentIdentity,e=>{let t=this.hasBoundAgentIdentity;this.hasBoundAgentIdentity=!0,this.agentIdentitySource=e,t&&(this.invalidateTransientRequests(),this.agentIdentityError=null),this.ensureAgentIdentities(),this.ensureInitialData();let n=e.subscribe(()=>{this.agentIdentitySource===e&&this.context.agentIdentity===e&&this.requestUpdate()});return()=>{n(),this.agentIdentitySource===e&&(this.agentIdentitySource=null)}}).watch(()=>this.context?.channels,(e,t)=>e.subscribe(t)).watch(()=>this.context?.navigation,(e,t)=>e.subscribe(t)).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessions;this.hasBoundSessions=!0,this.sessionsSource=e,t&&(this.invalidateTransientRequests(),D(this),this.loadActivePanelData());let n=e.subscribe(()=>{this.sessionsSource===e&&this.context.sessions===e&&(me(this),this.requestUpdate())});return()=>{n(),this.sessionsSource===e&&(this.sessionsSource=null)}})}get sessions(){return this.context.sessions}get agents(){return this.context.agents}get client(){return this.gateway.client}get connected(){return this.gateway.connected}get requestGeneration(){return this.gateway.epoch}get sessionsResult(){return this.context.sessions.state.result}get sessionKey(){return this.context.gateway.snapshot.sessionKey}get agentsPanel(){return this.routeData?.panel??`overview`}disconnectedCallback(){this.githubIdentity.dispose(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.syncCanonicalLocation(),this.ensureInitialData())}syncGatewayState(){(this.cron.client!==this.client||this.cron.connected!==this.connected)&&(this.cron={...this.cron,client:this.client,connected:this.connected})}canCall(e,t){return Je(this.context?.gateway?.snapshot,e,t)}syncAgentState(e=this.context.agents){let t=e.state;this.agentsList=t.agentsList?T(t.agentsList):null,this.syncSettingsSelection(),this.syncCurrentAgentFiles(e)}syncSettingsSelection(){let e=this.context.settingsAgentSelection.state.selectedId;if(e!==this.agentsSelectedId){if(this.agentsSelectedId){let e=fn(this);e&&this.retainedFileDrafts.set(this.agentsSelectedId,e)}this.agentsSelectedId=e,this.resetSelectionState();let t=e?this.retainedFileDrafts.get(e):void 0;t&&e&&(this.retainedFileDrafts.delete(e),this.agentFileDrafts=t.drafts,this.agentFileHashes=t.hashes,this.agentFileActive=t.active,this.agentFileConflict=t.conflict)}}syncCurrentAgentFiles(e=this.context.agents){let t=this.resolveSelectedAgentId();if(!t||this.agentsPanel!==`files`)return;let n=e.files(t);n.list&&(this.agentFilesList=n.list,this.selectDefaultAgentFile(t))}async selectDefaultAgentFile(e,t=!1){let n=this.agentFilesList?.files??[];(!this.agentFileActive||!n.some(e=>e.name===this.agentFileActive))&&(this.agentFileActive=n.find(e=>e.name===`AGENTS.md`)?.name??null),this.agentFileActive&&await hn(this,e,this.agentFileActive,{force:t})}resetForSourceChange(){this.retainedFileDrafts.clear(),this.agentsList=null,this.agentsSelectedId=null,this.resetSelectionState()}invalidateTransientRequests(){this.gateway.invalidate(),this.agentFilesLoading=!1,this.agentFileSaving=!1,this.identitySaving=!1,this.agentIdentityLoading=!1,this.agentSkillsLoading=!1,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,D(this),this.cron={...this.cron,cronLoading:!1,cronJobsLoadingMore:!1,cronJobsReloadPending:!1,cronJobsReloadPendingTableFilters:!1,cronRunsLoadingMore:!1,cronBusy:!1}}applyRouteData(){let e=this.routeData;if(!e){this.routeDataInitialized=!1;return}this.routeDataInitialized=!0,this.gateway.isRouteDataCurrent(e)&&e.agentsList&&(this.agentsList=e.agentsList);let t=this.context.settingsAgentSelection,n=e.settingsAgentSelection===t&&e.selectionIntentRevision===t.intentRevision;if(this.routeSelectionSuperseded=!n,e.requestedAgentId&&n){this.applyingRouteSelection=!0;try{t.set(e.requestedAgentId)}finally{this.applyingRouteSelection=!1}}this.syncSettingsSelection(),!n&&e.requestedAgentId&&this.agentsSelectedId&&this.context.replace(`agents`,{...e.canonicalLocation??e.location,pathname:V(this.agentsSelectedId,e.panel===`overview`?null:e.panel,this.context.basePath)})}syncCanonicalLocation(){this.routeSelectionSuperseded||(this.normalizedLocation=qn(this.context,this.routeData,this.normalizedLocation))}resolveSelectedAgentId(){return this.agentsSelectedId}chatAgentId(){return Ce(this.sessionKey)?.agentId??this.context.gateway.snapshot.assistantAgentId??this.agentsList?.defaultId??`main`}agentIdentityById(){return Object.fromEntries(this.context.agentIdentity.entries().map(e=>[e.agentId,e]))}ensureInitialData(){if(this.connected&&this.client&&this.routeDataInitialized&&this.routeData){if(!this.context.runtimeConfig.state.configSnapshot&&!this.context.runtimeConfig.state.configLoading&&this.context.runtimeConfig.ensureLoaded(),!this.agentsList&&!this.context.agents.state.agentsLoading){this.loadAgentsAndCommit();return}this.ensureAgentIdentities(),this.loadActivePanelData()}}isCurrentRequest(e,t,n,r={}){return this.client===e&&this.connected&&this.requestGeneration===t&&(!r.agents||this.context.agents===r.agents)&&(!r.agentIdentity||this.context.agentIdentity===r.agentIdentity)&&(!r.sessions||this.context.sessions===r.sessions)&&(!n||this.resolveSelectedAgentId()===n)}ensureAgentIdentities(){let e=this.client,t=this.context.agentIdentity,n=this.agentsList?.agents.map(e=>e.id).filter(e=>!t.get(e))??[];if(!e||!this.connected||n.length===0||this.agentIdentityLoading)return;let r=this.requestGeneration;this.agentIdentityLoading=!0,this.agentIdentityError=null,t.ensure(n).catch(n=>{this.isCurrentRequest(e,r,void 0,{agentIdentity:t})&&(this.agentIdentityError=N(n))}).finally(()=>{this.isCurrentRequest(e,r,void 0,{agentIdentity:t})&&(this.agentIdentityLoading=!1)})}loadActivePanelData(){if(!this.routeData)return;let e=this.resolveSelectedAgentId();if(e){if(this.agentsPanel===`overview`){this.ensureModelCatalog();return}if(this.agentsPanel===`files`&&this.agentFilesList?.agentId!==e){this.loadAgentFiles(e);return}if(this.agentsPanel===`skills`&&this.agentSkillsAgentId!==e){Zn(this,e);return}if(this.agentsPanel===`tools`){this.syncGitHubIdentity(e),this.toolsCatalogResult?.agentId!==e&&!this.toolsCatalogLoading&&M(this,e),this.loadEffectiveToolsForAgent(e),this.githubIdentity.statusReadable&&!this.githubIdentity.status&&!this.githubIdentity.loading&&!this.githubIdentity.error&&this.githubIdentity.verify();return}if(this.agentsPanel===`channels`&&!this.context.channels.state.channelsSnapshot){this.context.channels.refresh(!1);return}this.agentsPanel===`cron`&&(this.cron.cronAgentId!==e&&(this.cron=lt({client:this.client,connected:this.connected}),this.cron.cronAgentId=e),!this.cron.cronLoading&&!this.cron.cronStatus&&this.refreshCron())}}syncGitHubIdentity(e){let t=this.context.gateway.snapshot,n=t.selfUser?.id??null;n!==this.githubProfileId&&(this.githubIdentity.dispose(),this.githubProfileId=n);let r=(e,n)=>Je(t,e,n,{requireAdvertisement:!1});this.githubIdentity.sync({client:this.client,connected:this.connected,target:e?{kind:`shared`,scope:`agent`,agentId:e,config:fe(this.context.runtimeConfig.state)}:null,statusReadable:r(`tools.github.status`,`operator.read`),configurable:r(`tools.github.configure`,`operator.admin`),authorizable:[`tools.github.authorize.start`,`tools.github.authorize.poll`,`tools.github.authorize.cancel`].every(e=>r(e,`operator.admin`)),clientRevision:this.requestGeneration})}resetModelCatalog(){this.chatModelCatalogRequest?.abort(),this.chatModelCatalogRequest=null,this.chatModelCatalogSubscription?.unsubscribe(),this.chatModelCatalogSubscription=null,this.chatModelCatalog=[],this.decisionModels=[],this.chatModelCatalogStatus=Dt(),this.chatModelCatalogPending=null}ensureModelCatalog(e={}){let t=this.client,n=this.resolveSelectedAgentId();if(!t||!this.connected||!n)return;if(!this.chatModelCatalogSubscription?.isCurrent()){this.resetModelCatalog();let e=this.requestGeneration,r=this.context?.gateway,i=this.context?.agents,a={isCurrent:()=>this.chatModelCatalogSubscription===a&&this.context?.gateway===r&&this.isCurrentRequest(t,e,n,{agents:i}),unsubscribe:$e(this.context.gateway,()=>{a.isCurrent()&&(this.chatModelCatalogRequest?.abort(),this.chatModelCatalogRequest=null,this.chatModelCatalogPending=null,this.ensureModelCatalog({refresh:!0}))})};this.chatModelCatalogSubscription=a}if(this.chatModelCatalogPending||!e.refresh&&this.chatModelCatalogStatus.hasLoaded)return;let r=this.chatModelCatalogSubscription,i=new AbortController;this.chatModelCatalogRequest=i;let a=()=>r?.isCurrent()&&this.chatModelCatalogRequest===i;this.chatModelCatalogStatus=jt(this.chatModelCatalogStatus);let o=nt(t,{agentId:n,signal:i.signal}).then(e=>{if(!a())return;this.chatModelCatalog=e.models,this.decisionModels=e.decisionModels??[];let t=ct(e);this.chatModelCatalogStatus=t?Mt(St(),Error(t),this.gateway.snapshot):St()},e=>{a()&&(this.chatModelCatalogStatus=Mt(this.chatModelCatalogStatus,e,this.gateway.snapshot))}).finally(()=>{this.chatModelCatalogPending===o&&(this.chatModelCatalogPending=null,this.chatModelCatalogRequest=null)});this.chatModelCatalogPending=o}async loadAgentsAndCommit(){let e=this.client,t=this.requestGeneration,n=this.context.agents;e&&(await n.ensureList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),this.ensureAgentIdentities(),this.loadActivePanelData()))}async loadAgentFiles(e,t=!1){let n=this.client,r=this.context.agents;if(!n||!this.connected||this.agentFilesLoading)return;if(r.files(e).list&&!t){this.syncCurrentAgentFiles(r);return}let i=this.requestGeneration;this.agentFilesLoading=!0,this.agentFilesError=null;try{let a=t?await r.refreshFiles(e):await r.ensureFiles(e);if(!this.isCurrentRequest(n,i,e,{agents:r}))return;this.agentFilesList=a??r.files(e).list}finally{this.isCurrentRequest(n,i,e,{agents:r})&&(this.agentFilesLoading=!1)}this.isCurrentRequest(n,i,e,{agents:r})&&await this.selectDefaultAgentFile(e,t)}async refreshCron(){let e=this.cron;e.connected&&e.client&&!e.cronLoading&&await Promise.all([this.runCronTask(e=>Xe(e)),this.runCronTask(e=>tt(e)),this.runCronTask(e=>et(e,{tableFilters:!0}))])}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.cron===t&&this.requestUpdate(),await n}finally{this.cron===t&&this.requestUpdate()}}saveIdentityDraft(){if(!this.canCall(`agents.update`,`operator.admin`))return;let e=this.client,t=this.resolveSelectedAgentId();if(!e||!t||this.identitySaving)return;let n=this.requestGeneration,r=this.context.agents,i=this.context.agentIdentity;Fn({host:this,expectedClient:e,agentId:t,agents:r,agentIdentity:i,runtimeConfig:this.context.runtimeConfig,canDispatch:()=>this.canCall(`agents.update`,`operator.admin`)&&this.isCurrentRequest(e,n,t,{agents:r,agentIdentity:i}),isCurrent:()=>this.isCurrentRequest(e,n,t,{agents:r,agentIdentity:i}),onSaved:()=>this.syncAgentState(r)})}resetSelectionState(){this.gateway.invalidate(),this.resetModelCatalog(),this.agentFilesList=null,this.agentFilesError=null,this.agentFileActive=null,this.agentFileContents={},this.agentFileBaseHashes={},this.agentFileHashes={},this.agentFileConflict=null,this.agentFileDrafts={},this.agentFileWriteRevisions.clear(),this.agentFilesLoading=!1,this.agentFileSaving=!1,this.agentSkillsReport=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsAgentId=null,this.agentIdentityLoading=!1,this.agentIdentityError=null,Mn(this),this.toolsCatalogResult=null,this.toolsCatalogError=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,D(this),this.cron=lt({client:this.client,connected:this.connected})}toolsPath(e,t){if(e!==this.resolveSelectedAgentId())return null;let n=this.context.runtimeConfig.agentEntry(e,{ensure:t});return n?[...n.path,`tools`]:null}loadEffectiveToolsForAgent(e){if(e!==this.chatAgentId()){D(this);return}let t=de(this,{agentId:e,sessionKey:this.sessionKey});(this.toolsEffectiveResultKey!==t||this.toolsEffectiveError)&&te(this,{agentId:e,sessionKey:this.sessionKey})}refreshAgents(){let e=this.client,t=this.requestGeneration,n=this.context.agents;e&&(async()=>{await n.refreshList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),this.loadActivePanelData())})()}saveAgentConfig(){if(!this.canCall(`config.set`,`operator.admin`))return;let e=this.client,t=this.requestGeneration,n=this.context.agents;e&&(async()=>{await this.context.runtimeConfig.save()&&(await n.refreshList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(this.syncAgentState(n),this.ensureAgentIdentities(),this.loadActivePanelData()))})()}setDefaultAgent(e){if(!this.canCall(`config.set`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,r=this.context.agents,i=this.context.runtimeConfig;if(!t)return;let a=()=>this.context.runtimeConfig===i&&this.isCurrentRequest(t,n,void 0,{agents:r})&&this.canCall(`config.set`,`operator.admin`);(async()=>{await i.ensureLoaded(),a()&&await ne(i,e,()=>r.refreshList(),a)})()}saveSelectedAgentFile(e,t,n){e===this.resolveSelectedAgentId()&&this.canCall(`agents.files.set`,`operator.admin`)&&gn(this,e,t,n)}overwriteSelectedAgentFile(e,t,n){e===this.resolveSelectedAgentId()&&this.canCall(`agents.files.set`,`operator.admin`)&&yn(this,e,t,n)}reloadConfig(){this.context.runtimeConfig.discardDraft({reloadOnly:!0})}clearAgentSkills(e){if(!this.canCall(`config.patch`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,r=this.context.agents,i=this.context.runtimeConfig;if(!t)return;let a=()=>this.context.runtimeConfig===i&&this.isCurrentRequest(t,n,e,{agents:r})&&this.canCall(`config.patch`,`operator.admin`);Qn(i,e,a).then(t=>{if(a()){if(!t){this.agentSkillsError=i.state.lastError??g(`agents.skillsPanel.updateError`);return}this.agentSkillsError=null,Zn(this,e)}})}runCronJobNow(e){this.canCall(`cron.run`,`operator.admin`)&&this.cron.cronJobs.some(t=>t.id===e)&&this.runCronTask(t=>st(t,e,`force`))}render(){let e=this.context.runtimeConfig.state,t=this.context.agents.state,n=this.resolveSelectedAgentId(),r={canCreateAgent:this.canCall(`testclaw.chat`,`operator.admin`),canPatchConfig:this.canCall(`config.patch`,`operator.admin`),canUpdateConfig:this.canCall(`config.set`,`operator.admin`),canUpdateIdentity:this.canCall(`agents.update`,`operator.admin`),canWriteFiles:this.canCall(`agents.files.set`,`operator.admin`),canRunCron:this.canCall(`cron.run`,`operator.admin`)};return this.syncGitHubIdentity(n),P`
      <section class="content-header">
        <div>
          <div class="page-title">${Ke(`agents`)}</div>
          <div class="page-subtitle">
            ${Ge(`agents`)} ${xt(di)}
          </div>
        </div>
      </section>
      ${Pt(this.identityAvatarLoader.withActiveRoutes(()=>ci({access:r,basePath:this.context.basePath,loading:t.agentsLoading,error:t.agentsError,agentsList:this.agentsList,selectedAgentId:n,activePanel:this.agentsPanel,config:e,channels:this.context.channels.state,cron:this.cron,agentFiles:this,agentFilesListError:this.context.agents.files(n).error,agentIdentityLoading:this.agentIdentityLoading,agentIdentityError:this.agentIdentityError,agentIdentityById:this.agentIdentityById(),identityDraft:this.identityDraft,identityAvatarLoader:this.identityAvatarLoader,identitySaving:this.identitySaving,identityError:this.identityError,agentSkills:this,tools:this,githubIdentity:this.githubIdentity,onOpenGitHubConnections:()=>this.context.navigate(`profile`,{hash:`#settings-profile-github-connections`}),runtimeSessionKey:this.sessionKey,runtimeSessionMatchesSelectedAgent:n===this.chatAgentId(),modelCatalog:this.chatModelCatalog,decisionModels:this.decisionModels,modelCatalogStatus:this.chatModelCatalogStatus,pinnedAgentIds:this.context.navigation.snapshot.pinnedAgentIds,onTogglePinnedAgent:e=>In(this.context.navigation,e),onRefresh:()=>this.refreshAgents(),onCreateAgent:()=>{this.canCall(`testclaw.chat`,`operator.admin`)&&this.context.navigate(`custodian`,{search:`?intent=new-agent`})},onSelectPanel:e=>Yn(this.context,n,this.agentsPanel,e),onLoadFiles:e=>void this.loadAgentFiles(e,!0),onSelectFile:e=>{this.agentFileActive=e,n&&hn(this,n,e)},onFileDraftChange:(e,t)=>{n===this.resolveSelectedAgentId()&&(this.agentFileDrafts={...this.agentFileDrafts,[e]:t})},onFileReset:e=>{n===this.resolveSelectedAgentId()&&_n(this,e)},onFileSave:e=>{n&&this.saveSelectedAgentFile(n,e,this.agentFileDrafts[e]??this.agentFileContents[e]??``)},onFileReload:e=>{n&&vn(this,n,e)},onFileOverwrite:e=>{n&&this.overwriteSelectedAgentFile(n,e,this.agentFileDrafts[e]??this.agentFileContents[e]??``)},onToolsProfileChange:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.toolsPath(e,!!(t||n));r&&(t?this.context.runtimeConfig.patchForm([...r,`profile`],t):this.context.runtimeConfig.removeFormValue([...r,`profile`]),n&&this.context.runtimeConfig.removeFormValue([...r,`allow`]))},onToolsOverridesChange:(e,t,n)=>{if(!this.canCall(`config.set`,`operator.admin`))return;let r=this.toolsPath(e,t.length>0||n.length>0);r&&(t.length?this.context.runtimeConfig.patchForm([...r,`alsoAllow`],t):this.context.runtimeConfig.removeFormValue([...r,`alsoAllow`]),n.length?this.context.runtimeConfig.patchForm([...r,`deny`],n):this.context.runtimeConfig.removeFormValue([...r,`deny`]))},onConfigReload:()=>this.reloadConfig(),onConfigSave:()=>this.saveAgentConfig(),onIdentityFieldChange:(e,t)=>{n===this.resolveSelectedAgentId()&&this.canCall(`agents.update`,`operator.admin`)&&Nn(this,e,t)},onIdentityAvatarSelect:e=>{n===this.resolveSelectedAgentId()&&this.canCall(`agents.update`,`operator.admin`)&&Pn(this,e)},onIdentitySave:()=>this.saveIdentityDraft(),onChannelsRefresh:()=>void this.context.channels.refresh(!1),onOpenMemoryImport:()=>this.context.navigate(`memory-import`),onOpenMemorySettings:()=>this.context.navigate(`memory`),onOpenAgentDefaults:()=>this.context.navigate(`ai-agents`),onCronRefresh:()=>void this.refreshCron(),onCronLoadMore:()=>void this.runCronTask(e=>et(e,{append:!0,tableFilters:!0})),onCronRunNow:e=>this.runCronJobNow(e),onSkillsFilterChange:e=>this.skillsFilter=e,onSkillsRefresh:()=>{n&&Zn(this,n)},onAgentSkillToggle:(e,t,n)=>{if(e!==this.resolveSelectedAgentId()||!this.canCall(`config.set`,`operator.admin`))return;let r=this.context.runtimeConfig.agentEntry(e,{ensure:!0});if(!r||!t.trim())return;let i=O(fe(this.context.runtimeConfig.state),e)??this.agentSkillsReport?.agentSkillFilter??this.agentSkillsReport?.skills?.map(e=>e.name).filter(Boolean)??[],a=new Set(i);n?a.add(t.trim()):a.delete(t.trim()),this.context.runtimeConfig.patchForm([...r.path,`skills`],[...a])},onAgentSkillsClear:e=>this.clearAgentSkills(e),onAgentSkillsDisableAll:e=>{if(e!==this.resolveSelectedAgentId()||!this.canCall(`config.set`,`operator.admin`))return;let t=this.context.runtimeConfig.agentEntry(e,{ensure:!0});t&&this.context.runtimeConfig.patchForm([...t.path,`skills`],[])},...zn({getRuntimeConfig:()=>this.context.runtimeConfig,canUpdate:e=>e===this.resolveSelectedAgentId()&&this.canCall(`config.set`,`operator.admin`),onPrimaryChanged:()=>void me(this)}),onModelCatalogOpen:()=>this.ensureModelCatalog({refresh:!0}),onSetDefault:e=>this.setDefaultAgent(e)})))}
    `}},m([p({context:Ie,subscribe:!0})],$.prototype,`context`,void 0),m([R({attribute:!1})],$.prototype,`routeData`,void 0),m([L()],$.prototype,`agentsList`,void 0),m([L()],$.prototype,`agentsSelectedId`,void 0),m([L()],$.prototype,`toolsCatalogLoading`,void 0),m([L()],$.prototype,`toolsCatalogLoadingAgentId`,void 0),m([L()],$.prototype,`toolsCatalogError`,void 0),m([L()],$.prototype,`toolsCatalogResult`,void 0),m([L()],$.prototype,`toolsEffectiveLoading`,void 0),m([L()],$.prototype,`toolsEffectiveLoadingKey`,void 0),m([L()],$.prototype,`toolsEffectiveResultKey`,void 0),m([L()],$.prototype,`toolsEffectiveError`,void 0),m([L()],$.prototype,`toolsEffectiveResult`,void 0),m([L()],$.prototype,`chatModelCatalog`,void 0),m([L()],$.prototype,`decisionModels`,void 0),m([L()],$.prototype,`chatModelCatalogStatus`,void 0),m([L()],$.prototype,`agentFilesLoading`,void 0),m([L()],$.prototype,`agentFilesError`,void 0),m([L()],$.prototype,`agentFilesList`,void 0),m([L()],$.prototype,`agentFileContents`,void 0),m([L()],$.prototype,`agentFileBaseHashes`,void 0),m([L()],$.prototype,`agentFileHashes`,void 0),m([L()],$.prototype,`agentFileConflict`,void 0),m([L()],$.prototype,`agentFileDrafts`,void 0),m([L()],$.prototype,`agentFileActive`,void 0),m([L()],$.prototype,`agentFileSaving`,void 0),m([L()],$.prototype,`agentIdentityLoading`,void 0),m([L()],$.prototype,`agentIdentityError`,void 0),m([L()],$.prototype,`identityDraft`,void 0),m([L()],$.prototype,`identitySaving`,void 0),m([L()],$.prototype,`identityError`,void 0),m([L()],$.prototype,`agentSkillsLoading`,void 0),m([L()],$.prototype,`agentSkillsError`,void 0),m([L()],$.prototype,`agentSkillsReport`,void 0),m([L()],$.prototype,`agentSkillsAgentId`,void 0),m([L()],$.prototype,`skillsFilter`,void 0),m([L()],$.prototype,`cron`,void 0),fi=!0,pi=e=>P`<testclaw-agents-page .routeData=${e}></testclaw-agents-page>`,customElements.get(`testclaw-agents-page`)||customElements.define(`testclaw-agents-page`,$)})))()}mi();export{fi as header,pi as render};
//# sourceMappingURL=agents-page-Bhdyi6mB.js.map