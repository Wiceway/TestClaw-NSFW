const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-BUmhTcxK.js","./input-dialog-BosD-bnA.js","./control-ui-core-CBmGCeuQ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,Gi as n,Ha as r,Ia as i,Jr as a,b as o,co as s,ct as c,dt as l,eo as u,kr as d,lo as f,lt as p,nt as ee,oo as te,pr as m,qi as h,qr as ne,ti as g,yr as re}from"./control-ui-foundation-CGMdhB5v.js";import{$l as _,Bl as ie,Bs as ae,Hl as oe,Jl as v,Kr as se,Rs as ce,Si as le,Uc as ue,Wc as de,Wr as fe,_n as y,ac as pe,fn as b,ic as me,nn as x,nr as he,pn as ge,rr as _e,un as S,xi as ve}from"./control-ui-core-S9jKXqB5.js";import{$ as C,X as w,Y as T,c as ye,ct as E,i as be,nt as xe,o as D,s as Se,ut as Ce}from"./lit-runtime-DWoPVI38.js";import{Cr as we,Di as Te,Et as O,Fi as k,Ii as A,Oi as Ee,Or as De,Qa as Oe,Tr as ke,Ut as Ae,Wt as je,do as Me,fo as Ne,ot as Pe,rt as Fe}from"./control-ui-core-G2U4O6rB.js";import{c as Ie,u as Le}from"./gateway-runtime-BV4hxqU_.js";import{Jr as Re,ca as ze,da as Be,go as Ve,ho as He,la as Ue,qr as We,sa as Ge}from"./control-ui-boot-shared-ooxiG3qa.js";import{G as Ke,H as j,U as M,V as qe}from"./control-ui-boot-shared-C3bL_9oq.js";import{C as Je,S as N,g as Ye,k as Xe}from"./config-runtime-CgOgfOrG.js";import{At as P,Et as F,Ia as Ze,Mt as Qe,Ot as I,Pt as $e,St as et,Ur as tt,Vr as nt,_t as rt,ht as L,lo as it,uo as at,wt as ot,yt as st}from"./control-ui-boot-shared-CCYBAAP9.js";import{A as ct,M as R,N as lt,j as ut,k as dt,mt as ft}from"./control-ui-boot-new-DhInmp9T.js";import{n as pt,t as mt}from"./desktop-focus-window-2g9SSvaH.js";import{_ as ht,a as gt,c as _t,d as vt,f as yt,g as bt,h as xt,i as z,l as St,m as Ct,n as wt,o as B,p as Tt,r as Et,s as Dt,t as Ot,u as kt,v as At}from"./page-operations-DKnkLME9.js";import{n as jt,t as Mt}from"./settings-workspace-DJAhLnkQ.js";import{n as Nt,t as Pt}from"./capacity-meter-WRJGAD19.js";import{n as Ft,t as It}from"./en-devices-Ds-S73sh.js";function Lt(e){return je(void 0,({render:t,finish:n})=>{let r=!1,i=()=>n(),a=t=>{if(!e.secret){i();return}t.preventDefault(),!r&&(r=!0,s())},o=e.secret?`btn primary`:`btn secret-reveal__dismiss`,s=()=>{t(()=>C`
          <testclaw-modal-dialog
            label=${e.title}
            description=${e.message}
            @modal-cancel=${a}
          >
            <div class="exec-approval-card">
              <div class="secret-reveal__header">
                ${e.status===`success`?C`<span class="secret-reveal__status" aria-hidden="true"
                        >${k.check}</span
                      >`:w}
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <div class="secret-reveal__body"><p>${e.message}</p></div>
              ${e.callout?C`<div class="callout info secret-reveal__callout">${e.callout}</div>`:w}
              ${e.secret?C`
                      <div class="secret-reveal__value">
                        <code class="secret-reveal__code">${e.secret}</code>
                        ${tt(e.secret,_(`common.copy`))}
                      </div>
                    `:w}
              ${r?C`<p class="secret-reveal__hint" role="status">${e.dismissHint}</p>`:w}
              ${e.note?C`<p class="secret-reveal__note">${e.note}</p>`:w}
              <div class="exec-approval-actions">
                <button type="button" class=${o} autofocus @click=${i}>
                  ${e.acknowledgeLabel}
                </button>
              </div>
            </div>
          </testclaw-modal-dialog>
        `)};s()})}function Rt(){return(Rt=e((()=>{T(),v(),nt(),A(),Ae()})))()}function V(e){return Array.isArray(e)?e.map(e=>f(e)).filter(e=>e!==void 0):[]}function zt(e){if(!h(e))return;let t=Object.keys(e),n=e.total,r=e.available;return t.length===2&&t.includes(`total`)&&t.includes(`available`)&&typeof n==`number`&&typeof r==`number`&&Number.isSafeInteger(n)&&Number.isSafeInteger(r)&&n>=1&&n<=1024&&r>=0&&r<=n?{total:n,available:r}:void 0}function Bt(e){if(!h(e))return;let t=e;if(t.status===`missing`&&Object.keys(t).length===1)return{status:`missing`};let n=f(t.version);return t.status===`installed`&&n&&Object.keys(t).length===2?{status:`installed`,version:n}:void 0}function Vt(e){let t=f(e.nodeId);if(!t)return null;let n=f(e.approvalState);return{nodeId:t,displayName:f(e.displayName),platform:f(e.platform),deviceFamily:f(e.deviceFamily),version:f(e.version),coreVersion:f(e.coreVersion),uiVersion:f(e.uiVersion),modelIdentifier:f(e.modelIdentifier),clientId:f(e.clientId),clientMode:f(e.clientMode),remoteIp:f(e.remoteIp),caps:V(e.caps),commands:V(e.commands),approvalState:n&&nn.has(n)?n:void 0,pendingRequestId:f(e.pendingRequestId),workerSlots:zt(e.workerSlots),workerBundle:Bt(e.workerBundle),hostStats:tn.safeParse(e.hostStats).data,connected:e.connected===!0,paired:e.paired===!0,connectedAtMs:m(e.connectedAtMs),lastSeenAtMs:m(e.lastSeenAtMs),approvedAtMs:m(e.approvedAtMs)}}function Ht(e){let t=new Set;for(let n of[...e.roles??[],e.role]){let e=f(n);e&&t.add(e)}return[...t]}function Ut(...e){let t;for(let n of e)n!==void 0&&(t===void 0||n>t)&&(t=n);return t}function Wt(e,t,n,r){let i=t?Ht(t):[];n?.paired&&!i.includes(`node`)&&i.push(`node`);let a=f(t?.operatorLabel),o=f(t?.displayName)??f(n?.displayName),s=f(t?.clientId)??n?.clientId;return{id:e,name:a??o??s??e,displayName:o,clientId:s,clientMode:f(t?.clientMode)??n?.clientMode,platform:f(r?.platform)??f(t?.platform)??n?.platform,deviceFamily:f(r?.deviceFamily)??f(t?.deviceFamily)??n?.deviceFamily,version:f(r?.version)??n?.version,modelIdentifier:f(r?.modelIdentifier)??n?.modelIdentifier,remoteIp:f(t?.remoteIp)??n?.remoteIp,roles:i,scopes:V(t?.scopes),connected:n?.connected===!0||t?.connected===!0,autoApproved:t?.approvedVia===`silent`||t?.approvedVia===`trusted-cidr`||t?.approvedVia===`ssh-verified`,lastSeenAtMs:Ut(t?.lastSeenAtMs,n?.lastSeenAtMs,n?.connectedAtMs,m(r?.ts)),approvedAtMs:Ut(t?.approvedAtMs,n?.approvedAtMs),presence:r,device:t,node:n}}function Gt(e){let t=e.displayName?.trim().toLowerCase();if(t)return`name:${t}`;let n=e.clientId?.trim().toLowerCase(),r=e.clientMode?.trim().toLowerCase();return n||r?`client:${n??``}:${r??``}`:`id:${e.id}`}function Kt(e){return e.lastSeenAtMs??e.approvedAtMs??0}function qt(e,t){if(e.connected!==t.connected)return e.connected?-1:1;let n=Kt(t)-Kt(e);return n===0?e.id.localeCompare(t.id):n}function Jt(e,t){let n=qt(e.primary,t.primary);return n===0?e.name.localeCompare(t.name):n}function Yt(e){let t=new Map;for(let n of e.nodes){let e=Vt(n);e&&t.set(e.nodeId,e)}let n=new Map;for(let t of e.presence??[])for(let e of[t.deviceId,t.instanceId]){let r=f(e)?.toLowerCase();r&&n.set(r,t)}let r=[],i=new Set;for(let a of e.paired){let e=f(a.deviceId);e&&!i.has(e)&&(i.add(e),r.push(Wt(e,a,t.get(e),n.get(e.toLowerCase()))))}for(let[e,a]of t)i.has(e)||r.push(Wt(e,void 0,a,n.get(e.toLowerCase())));let a=new Map;for(let e of r){let t=Gt(e),n=a.get(t);n?n.push(e):a.set(t,[e])}let o=[];for(let[e,t]of a){let n=t.toSorted(qt),r=n[0];r&&o.push({key:e,name:r.name,primary:r,duplicates:n.slice(1)})}return o.toSorted(Jt)}function Xt(e){return e.flatMap(e=>e.duplicates.filter(e=>!e.connected&&(e.autoApproved||e.device!==void 0&&e.device.approvedVia===void 0)))}function Zt(e){return e.find(e=>f(e.mode)?.toLowerCase()===`gateway`)}function Qt(e,t){let n=new Set;for(let e of t)for(let t of[e.primary,...e.duplicates])n.add(t.id.toLowerCase());return e.filter(e=>{if(f(e.mode)?.toLowerCase()===`gateway`||f(e.reason)?.toLowerCase()===`disconnect`)return!1;let t=[e.deviceId,e.instanceId].map(e=>f(e)?.toLowerCase()).filter(e=>e!==void 0);return t.length===0&&!f(e.host)&&!f(e.mode)?!1:!t.some(e=>n.has(e))})}function $t(e){let t=e.roles.includes(`node`),n=e.roles.filter(e=>e!==`node`);return{removeNode:t||e.node?.paired===!0,removeDevice:!!e.device&&(n.length>0||e.roles.length===0)}}function en(e){let t=new Map;for(let n of e){let e=(n.deviceId??n.instanceId)?.trim().toLowerCase();if(!e||n.mode?.trim().toLowerCase()===`gateway`)continue;let r=n.roles?.includes(`node`)?`${e}:node`:e;t.set(r,n.reason?.trim().toLowerCase()===`disconnect`?`offline`:`connected`)}return JSON.stringify([...t].toSorted(([e],[t])=>e.localeCompare(t)))}var tn,nn;function H(){return(H=e((()=>{re(),Ye(),tn=Je({cpuCount:N().int().positive(),loadAverage:Xe([N().nonnegative(),N().nonnegative(),N().nonnegative()]).optional(),memoryTotalBytes:N().positive(),memoryFreeBytes:N().nonnegative(),diskTotalBytes:N().positive().optional(),diskAvailableBytes:N().nonnegative().optional(),updatedAtMs:N().nonnegative()}).refine(e=>e.memoryFreeBytes<=e.memoryTotalBytes&&(e.diskAvailableBytes===void 0||e.diskTotalBytes===void 0||e.diskAvailableBytes<=e.diskTotalBytes)),nn=new Set([`approved`,`pending-approval`,`pending-reapproval`,`unapproved`])})))()}var rn;function an(){return(an=e((()=>{it(),v(),ae(),z(),u(),rn=class{constructor(e){this.host=e}async editAlias(e){if(!this.host.canManagePairing()||this.host.pendingDialog())return;let n=new AbortController;this.host.setPendingDialog(n);try{let{showInputDialog:r}=await t(async()=>{let{showInputDialog:e}=await import(`./input-dialog-BUmhTcxK.js`);return{showInputDialog:e}},__vite__mapDeps([0,1,2]),import.meta.url);await r({signal:n.signal,title:_(`devices.inventory.renameTitle`,{name:e.name}),label:_(`devices.inventory.renamePrompt`),defaultValue:e.operatorLabel??``,requireValue:!0,requireChange:!0,submit:t=>this.host.canManagePairing()?this.host.runPageTask(n=>Ct(n,{deviceId:e.id,label:t})):Promise.resolve(_(`devices.readOnly.pairingRequired`))})}catch(e){this.host.setDevicesError(ce(e))}finally{this.host.pendingDialog()===n&&this.host.setPendingDialog(null)}}confirmInventoryRemoval(e){if(!this.host.canManagePairing())return Promise.resolve();if(e.kind===`entry`){let t=e.entry;return this.confirmDestructiveAction({title:_(`devices.inventory.removePromptTitle`,{name:t.name}),message:_(`devices.inventory.removePromptBody`),details:_(`devices.inventory.deviceId`,{id:t.id}),confirmLabel:_(`devices.inventory.remove`)},e=>yt(e,t))}let t=e.entries;return this.confirmDestructiveAction({title:_(t.length===1?`devices.inventory.removeStalePromptTitleOne`:`devices.inventory.removeStalePromptTitle`,{count:String(t.length)}),message:_(`devices.inventory.removeStalePromptBody`),confirmLabel:_(`devices.inventory.remove`)},e=>Tt(e,t))}confirmPairingReject(e,t){return this.host.canManagePairing()?this.confirmDestructiveAction({title:_(e===`device`?`devices.inventory.rejectDevicePromptTitle`:`devices.inventory.rejectNodePromptTitle`),message:_(`devices.inventory.rejectPromptBody`),confirmLabel:_(`devices.inventory.reject`)},n=>e===`device`?St(n,t):kt(n,t)):Promise.resolve()}confirmTokenRevoke(e,t){return this.host.canManagePairing()?this.confirmDestructiveAction({title:_(`devices.inventory.revokePromptTitle`,{role:t}),message:_(`devices.inventory.revokePromptBody`),details:_(`devices.inventory.deviceId`,{id:e}),confirmLabel:_(`devices.inventory.revoke`)},n=>xt(n,{deviceId:e,gatewayUrl:this.host.gatewayUrl(),role:t})):Promise.resolve()}async confirmDestructiveAction(e,t){if(this.host.pendingDialog())return;let n=new AbortController;this.host.setPendingDialog(n);let r=this.host.requestGeneration(),i=this.host.gatewayClient(),a=await at({...e,danger:!0,signal:n.signal});this.host.pendingDialog()===n&&this.host.setPendingDialog(null),a&&!n.signal.aborted&&r===this.host.requestGeneration()&&i===this.host.gatewayClient()&&this.host.gatewayConnected()&&this.host.canManagePairing()&&await this.host.runPageTask(t)}}})))()}function on(e){let t=n(e);return Array.isArray(t.nodes)?t.nodes:[]}function sn(){return(sn=e((()=>{})))()}function cn(e){return te(e.normalize(`NFC`)).replace(/(?=\p{M})\p{Emoji_Component}/gu,``).replace(/(?<![\p{L}\p{M}\p{N}])\p{M}+/gu,``).replace(/[^\p{L}\p{M}\p{N}]+/gu,`-`).replace(/^-+/,``).replace(/-+$/,``)}function ln(e){return e.map(e=>e.displayName||e.remoteIp||e.nodeId).filter(Boolean).join(`, `)}function un(e){let t=e.displayName||e.remoteIp||e.nodeId,n=[`node=${e.nodeId}`],r=f(e.clientId);return r&&n.push(`client=${r}`),`${t} [${n.join(`, `)}]`}function dn(e){return(s(e)??``).startsWith(`testclaw-`)}function fn(e){let t=s(e)??``;return t.startsWith(`clawdbot-`)||t.startsWith(`moldbot-`)}function pn(e){let t=e.filter(e=>dn(e.clientId));if(t.length!==1)return;let n=e.filter(e=>fn(e.clientId)).length;if(n!==0&&t.length+n===e.length)return t[0]}function mn(e,t,n,r){let i=typeof e.displayName==`string`?e.displayName:``,a=i?cn(i):``;return a&&a===n?2e3:r!==void 0&&a&&a.replace(/-/g,``)===r?1900:t.length>=6&&e.nodeId.startsWith(t)?1e3:0}function hn(e,t,n=!1){let r=t.trim();if(!r)throw Error(`node required`);let i=e.filter(e=>e.nodeId===r);if(i.length===0&&(i=e.filter(e=>e.remoteIp===r)),i.length===0){let t=cn(r),a=n?t.replace(/-/g,``):void 0,o=0;e.forEach(e=>{let n=mn(e,r,t,a);n>o&&(o=n,i.length=0),n>0&&n===o&&i.push(e)})}if(i.length===0){let t=ln(e);throw Error(`unknown node: ${r}${t?` (known: ${t})`:``}`)}let a=i.filter(e=>e.connected===!0),o=a.length>0?a:i;if(o.length===1)return o[0]?.nodeId??``;let s=pn(o);if(s)return s.nodeId;throw Error(`ambiguous node: ${r} (matches: ${o.map(un).join(`, `)})`)}function gn(){return(gn=e((()=>{})))()}function _n(e){let t=h(e?.agents)?e.agents:null,n=h(t?.entries)?t.entries:{},r=[];for(let[e,t]of Object.entries(n)){if(!h(t))continue;let n=f(t.name),i=t.default===!0;r.push({id:e,name:n,isDefault:i,record:t})}return r}function vn(e,t){let n=[];for(let r of e){let e=Array.isArray(r.commands)?r.commands:[],i=new Set(e.map(String));if(!t.every(e=>i.has(e)))continue;let a=f(r.nodeId)??``;if(!a)continue;let o=f(r.displayName)??a;n.push({id:a,label:o===a?a:`${o} · ${a}`})}return n.sort((e,t)=>e.label.localeCompare(t.label)),n}function yn(e){let t=e.platform?.trim().toLowerCase()??``,n=e.modelIdentifier?.trim()??``,r=e.clientId?.trim().toLowerCase()??``,i=e.clientMode?.trim().toLowerCase()??``;if(n.startsWith(`Watch`)||bn.test(t)||r===c.WATCHOS_APP)return R.watch;if(n.startsWith(`iPad`)||xn.test(t))return R.tablet;if(n.startsWith(`iPhone`)||Sn.test(t)||Cn.has(r))return R.smartphone;if(wn.has(r)||i===p.WEBCHAT)return R.browser;if(Tn.has(i)||En.has(r))return R.terminal;if(i===`gateway`)return R.server;switch(ut(n)){case`laptop`:return R.laptop;case`mini`:return R.macMini;case`studio`:case`pro`:return R.pcCase;case`imac`:return R.allInOne;default:return k.monitor}}function U(e){return C`
    <div class="device-entry__tile" aria-hidden="true">
      <span class="device-entry__tile-icon">${e}</span>
    </div>
  `}var bn,xn,Sn,Cn,wn,Tn,En;function W(){return(W=e((()=>{T(),l(),lt(),A(),dt(),bn=/\bwatchos\b/,xn=/\b(ipados|ipad)\b/,Sn=/\b(ios|android|iphone)\b/,Cn=new Set([c.IOS_APP,c.ANDROID_APP]),wn=new Set([c.CONTROL_UI,c.WEBCHAT_UI,c.WEBCHAT]),Tn=new Set([p.CLI,p.BACKEND,p.PROBE,p.TEST]),En=new Set([c.CLI,c.TUI])})))()}function Dn(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function On(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function kn(e,t,n){let r=e?.defaults??{},i=n?e?.agents?.[`*`]??{}:{};return{security:Dn(i.security??r.security??t?.security),ask:On(i.ask??r.ask??t?.ask),askFallback:Dn(i.askFallback??r.askFallback??t?.askFallback??`deny`),autoAllowSkills:i.autoAllowSkills??r.autoAllowSkills??t?.autoAllowSkills??!1}}function An(e){return _n(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function jn(e,t){let n=An(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function Mn(e,t){return e===K?K:e&&t.some(t=>t.id===e)?e:K}function Nn(e){let t=e.execApprovalsSnapshot,n=gt(t)?t:null,r=t&&!gt(t)?t:null,i=n?null:e.execApprovalsForm??r?.file??null,a=!!(i||n),o=jn(e.configForm,i),s=Vn(e.nodes),c=e.execApprovalsTarget,l=c===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;c===`node`&&l&&!s.some(e=>e.id===l)&&(l=null);let u=Mn(e.execApprovalsSelectedAgent,o),d=kn(i,r?.resolvedDefaults,u!==K),f=u===K?null:(i?.agents??{})[u]??null,p=Array.isArray(f?.allowlist)?f.allowlist??[]:[];return{ready:a,disabled:!e.canAdmin||e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:i,nativePolicy:n,defaults:d,selectedScope:u,selectedAgent:f,agents:o,allowlist:p,target:c,targetNodeId:l,targetNodes:s,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals,canAdmin:e.canAdmin}}function Pn(e){let t=e.ready,n=e.target!==`node`||!!e.targetNodeId,r=C`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.dirty||!n||!!e.nativePolicy}
      @click=${e.onSave}
    >
      ${e.saving?_(`common.saving`):_(`common.save`)}
    </button>
  `,i=C`
    ${e.canAdmin?C`
            ${In(e)}
            ${t?e.nativePolicy?Fn(e.nativePolicy):C`${Ln(e)} ${Rn(e)}`:F({title:_(`devices.execApprovals.loadHint`),control:C`
                      <button
                        class="btn"
                        ?disabled=${e.loading||!n}
                        @click=${e.onLoad}
                      >
                        ${e.loading?_(`common.loading`):_(`common.loadApprovals`)}
                      </button>
                    `})}
          `:F({title:_(`devices.readOnly.adminRequired`)})}
  `;return C`
    ${I({title:_(`devices.execApprovals.title`),description:C`
          ${_(`devices.execApprovals.subtitlePrefix`)}
          <span class="mono">exec host=gateway/node</span>.
        `,actions:r},i)}
    ${e.canAdmin&&t&&!e.nativePolicy&&e.selectedScope!==K?zn(e):w}
  `}function Fn(e){let t=e.enabled&&Array.isArray(e.rules)?e.rules:[],n=e.enabled?e.defaultAction:e.message??`unavailable`;return C`
    ${F({title:_(`devices.execApprovals.hostNativePolicy`),description:_(`devices.execApprovals.hostNativeHint`),control:$e(_(`devices.execApprovals.native`))})}
    ${F({title:_(`devices.execApprovals.defaultAction`),description:n,control:$e(_(t.length===1?`devices.execApprovals.rule`:`devices.execApprovals.rules`,{count:String(t.length)}))})}
    ${t.map(e=>F({title:e.pattern,description:C`
          ${e.action} · ${e.shells?.join(`, `)||_(`devices.execApprovals.allShells`)} ·
          ${e.enabled===!1?_(`devices.execApprovals.off`):_(`devices.execApprovals.on`)}
          ${e.description?C`<br />${x(e.description,120)}`:w}
        `}))}
  `}function In(e){let t=e.targetNodes.length>0,n=e.targetNodeId??``;return C`
    ${F({title:_(`devices.execApprovals.target`),description:_(`devices.execApprovals.targetHint`),control:C`
        <select
          class="settings-select"
          aria-label=${_(`devices.execApprovals.host`)}
          .value=${D(e.target)}
          ?disabled=${e.disabled}
          @change=${t=>{if(t.target.value===`node`){let t=e.targetNodes[0]?.id??null;e.onSelectTarget(`node`,n||t)}else e.onSelectTarget(`gateway`,null)}}
        >
          <option value="gateway" ?selected=${e.target===`gateway`}>
            ${_(`devices.execApprovals.gateway`)}
          </option>
          <option value="node" ?selected=${e.target===`node`}>
            ${_(`devices.execApprovals.node`)}
          </option>
        </select>
      `})}
    ${e.target===`node`?F({title:_(`devices.execApprovals.node`),description:t?void 0:_(`devices.execApprovals.noNodes`),control:C`
              <select
                class="settings-select"
                aria-label=${_(`devices.execApprovals.node`)}
                .value=${D(n)}
                ?disabled=${e.disabled||!t}
                @change=${t=>{let n=t.target.value.trim();e.onSelectTarget(`node`,n||null)}}
              >
                <option value="" ?selected=${n===``}>
                  ${_(`devices.execApprovals.selectNode`)}
                </option>
                ${e.targetNodes.map(e=>C`<option value=${e.id} ?selected=${n===e.id}>
                      ${e.label}
                    </option>`)}
              </select>
            `}):w}
  `}function Ln(e){let t=[{value:K,label:_(`devices.execApprovals.defaults`),icon:k.settings},...e.agents.map(e=>({value:e.id,label:e.name?.trim()?`${e.name} (${e.id})`:e.id,agent:{id:e.id,...e.name?{name:e.name}:{}},badge:e.isDefault?_(`agents.default`):void 0}))];return F({title:_(`devices.execApprovals.scope`),stacked:!0,control:C`
      <testclaw-agent-select
        class="agent-select--settings"
        .options=${t}
        .value=${e.selectedScope}
        .accessibleLabel=${_(`devices.execApprovals.scope`)}
        .disabled=${e.disabled}
        .onSelect=${e.onSelectScope}
      ></testclaw-agent-select>
    `})}function G(e,t){return C`
    <select
      class="settings-select"
      aria-label=${t.ariaLabel}
      .value=${D(t.currentValue)}
      ?disabled=${e.disabled}
      @change=${n=>{let r=n.target.value;!t.isDefaults&&r===`__default__`?e.onRemove([...t.basePath,t.key]):e.onPatch([...t.basePath,t.key],r)}}
    >
      ${t.isDefaults?w:C`<option value="__default__" ?selected=${t.currentValue===`__default__`}>
              ${_(`devices.execApprovals.useDefaultValue`,{value:t.defaultValue})}
            </option>`}
      ${t.values.map(e=>C`<option value=${e.value} ?selected=${t.currentValue===e.value}>
            ${_(e.labelKey)}
          </option>`)}
    </select>
  `}function Rn(e){let t=e.selectedScope===K,n=e.defaults,r=e.selectedAgent??{},i=t?[`defaults`]:[`agents`,e.selectedScope],a=typeof r.security==`string`?r.security:void 0,o=typeof r.ask==`string`?r.ask:void 0,s=typeof r.askFallback==`string`?r.askFallback:void 0,c=t?n.security:a??`__default__`,l=t?n.ask:o??`__default__`,u=t?n.askFallback:s??`__default__`,d=typeof r.autoAllowSkills==`boolean`?r.autoAllowSkills:void 0,f=d??n.autoAllowSkills,p=d==null;return C`
    ${F({title:_(`devices.execApprovals.security`),description:t?_(`devices.execApprovals.defaultSecurity`):a===void 0?void 0:_(`devices.execApprovals.defaultValue`,{value:n.security}),control:G(e,{key:`security`,ariaLabel:_(`devices.execApprovals.mode`),values:q,currentValue:c,defaultValue:n.security,isDefaults:t,basePath:i})})}
    ${F({title:_(`devices.execApprovals.ask`),description:t?_(`devices.execApprovals.defaultPrompt`):o===void 0?void 0:_(`devices.execApprovals.defaultValue`,{value:n.ask}),control:G(e,{key:`ask`,ariaLabel:_(`devices.execApprovals.mode`),values:Hn,currentValue:l,defaultValue:n.ask,isDefaults:t,basePath:i})})}
    ${F({title:_(`devices.execApprovals.askFallback`),description:t?_(`devices.execApprovals.promptUnavailable`):s===void 0?void 0:_(`devices.execApprovals.defaultValue`,{value:n.askFallback}),control:G(e,{key:`askFallback`,ariaLabel:_(`devices.execApprovals.fallback`),values:q,currentValue:u,defaultValue:n.askFallback,isDefaults:t,basePath:i})})}
    ${F({title:_(`devices.execApprovals.autoAllowSkills`),description:t?_(`devices.execApprovals.autoAllowSkillsHint`):p?void 0:_(`devices.execApprovals.override`,{value:_(f?`devices.execApprovals.on`:`devices.execApprovals.off`)}),control:C`
        ${!t&&!p?C`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,`autoAllowSkills`])}
              >
                ${_(`devices.execApprovals.useDefault`)}
              </button>`:w}
        ${Qe({checked:f,disabled:e.disabled,ariaLabel:_(`devices.execApprovals.autoAllowSkills`),onChange:t=>e.onPatch([...i,`autoAllowSkills`],t)})}
      `})}
  `}function zn(e){let t=[`agents`,e.selectedScope,`allowlist`],n=e.allowlist;return I({title:_(`devices.execApprovals.allowlist`),description:_(`devices.execApprovals.allowlistHint`),actions:C`
        <button
          class="btn btn--sm"
          ?disabled=${e.disabled}
          @click=${()=>{let r=[...n,{pattern:``}];e.onPatch(t,r)}}
        >
          ${_(`devices.execApprovals.addPattern`)}
        </button>
      `},n.length===0?st(_(`devices.execApprovals.emptyAllowlist`)):n.map((t,n)=>Bn(e,t,n)))}function Bn(e,t,n){let r=t.lastUsedAt?b(t.lastUsedAt):_(`common.never`),i=t.lastUsedCommand?x(t.lastUsedCommand,120):null,a=t.lastResolvedPath?x(t.lastResolvedPath,120):null;return F({title:t.pattern?.trim()?t.pattern:_(`devices.execApprovals.newPattern`),description:C`
      ${_(`devices.execApprovals.lastUsed`,{time:r})}
      ${i?C`<br /><span class="mono">${i}</span>`:w}
      ${a?C`<br /><span class="mono">${a}</span>`:w}
    `,control:C`
      <input
        class="settings-input"
        type="text"
        aria-label=${_(`devices.execApprovals.pattern`)}
        .value=${t.pattern??``}
        ?disabled=${e.disabled}
        @input=${t=>{let r=t.target;e.onPatch([`agents`,e.selectedScope,`allowlist`,n,`pattern`],r.value)}}
      />
      <button
        class="btn btn--sm danger"
        ?disabled=${e.disabled}
        @click=${()=>{if(e.allowlist.length<=1){e.onRemove([`agents`,e.selectedScope,`allowlist`]);return}e.onRemove([`agents`,e.selectedScope,`allowlist`,n])}}
      >
        ${_(`devices.execApprovals.remove`)}
      </button>
    `})}function Vn(e){return vn(e,[`system.execApprovals.get`,`system.execApprovals.set`])}var K,q,Hn;function Un(){return(Un=e((()=>{T(),be(),ft(),A(),L(),v(),y(),z(),W(),K=`__defaults__`,q=[{value:`deny`,labelKey:`devices.execApprovals.options.deny`},{value:`allowlist`,labelKey:`devices.execApprovals.options.allowlist`},{value:`full`,labelKey:`devices.execApprovals.options.full`}],Hn=[{value:`off`,labelKey:`devices.execApprovals.options.off`},{value:`on-miss`,labelKey:`devices.execApprovals.options.onMiss`},{value:`always`,labelKey:`devices.execApprovals.options.always`}]})))()}function Wn(e){let t=e.workerSlots;if(t){let n=e.unavailable?null:t.total-t.available,r=n===null?_(`capacityMeter.unavailable`):_(`capacityMeter.workerSlots`,{used:String(n),total:String(t.total)}),i=e.unavailable?`stale`:t.available===0?`warn`:`accent`;return{label:r,title:n===null?void 0:r,meter:Nt({mode:`discrete`,total:t.total,used:n,tone:i,label:r})}}if(!(e.capabilities?.some(e=>e===`codex.exec-server`||e===`codex.exec-server.stdio.v1`)||e.commands?.includes(`codex.exec-server.stdio.v1`)))return;let n=_(`capacityMeter.execHost`);return{label:n,title:n,meter:C`<span class="capacity-meter-exec" role="img" aria-label=${n}>
      <span aria-hidden="true">${k.terminal}</span>${n}
    </span>`}}function Gn(){return(Gn=e((()=>{T(),v(),Pt(),A()})))()}function Kn(e,t,n){return C`
    <span class="device-capability" role="listitem" title=${n}>
      <span class="device-capability__icon" aria-hidden="true">${e}</span>
      <span>${t}</span>
    </span>
  `}function qn(e){if(e.length===0)return w;let t=[...new Set(e.map(e=>e===`codex-cli-session-source`?`codex-cli-sessions`:e))],n=t.filter(e=>J.has(e)),r=t.filter(e=>!J.has(e)),i=r.slice(0,Yn-+(n.length>0)),a=r.length-i.length,o=_(n.length===1?`devices.capabilities.runtime`:`devices.capabilities.runtimes`,{count:String(n.length)}),s=n.join(`, `);return C`
    <div class="device-capabilities" role="list" aria-label=${_(`devices.inventory.capabilities`)}>
      ${n.length>0?Kn(k.squareTerminal,o,s):w}
      ${i.map(e=>{let t=Jn.get(e);return Kn(t?.icon??k.puzzle,t?_(`devices.capabilities.${t.key}.label`):e,t?_(`devices.capabilities.${t.key}.description`):e)})}
      ${a>0?C`<span
              class="device-capability device-capability--overflow"
              role="listitem"
              title=${_(`devices.capabilities.overflow`,{count:String(a)})}
              >+${a}</span
            >`:w}
    </div>
  `}var Jn,J,Yn;function Xn(){return(Xn=e((()=>{T(),A(),v(),It(),Ft(),Jn=new Map(Object.entries({browser:{icon:k.globe,key:`browser`},canvas:{icon:k.panelsTopLeft,key:`canvas`},screen:{icon:k.monitor,key:`screen`},computer:{icon:k.monitorSmartphone,key:`computer`},file:{icon:k.folder,key:`file`},system:{icon:k.terminal,key:`system`},mcp:{icon:k.plug,key:`mcp`},"local-inference":{icon:k.cpu,key:`localInference`},camera:{icon:k.camera,key:`camera`},talk:{icon:k.mic,key:`talk`},location:{icon:k.target,key:`location`},notifications:{icon:k.bell,key:`notifications`},contacts:{icon:k.users,key:`contacts`},calendar:{icon:k.calendarClock,key:`calendar`},reminders:{icon:k.listChecks,key:`reminders`},device:{icon:k.smartphone,key:`device`},photos:{icon:k.image,key:`photos`},sms:{icon:k.messageSquare,key:`sms`},health:{icon:k.activity,key:`health`},motion:{icon:k.radio,key:`motion`}})),J=new Set([`claude-sessions`,`codex-cli-sessions`,`codex-app-server-threads`,`opencode-sessions`,`pi-sessions`]),Yn=16})))()}function Zn(e,t){return e.desktopEnvironments?.find(e=>e.id===t&&e.desktop===!0)?.id}async function Qn(e){let t=await he(e);le({message:_(t?`devices.inventory.deviceIdCopied`:`common.copyFailed`)})}function Y(e,t){if(!t.deviceId&&!t.desktopEnvironment)return w;let n=e.canManagePairing?w:_(`devices.readOnly.pairingRequired`);return C`
    <wa-dropdown
      placement="bottom-end"
      @wa-select=${n=>{switch(n.detail.item.value){case`desktop`:t.desktopEnvironment&&pt(e.basePath,t.desktopEnvironment);break;case`copy`:t.deviceId&&Qn(t.deviceId);break;case`editAlias`:e.canManagePairing&&t.onEditAlias?.();break;case`approve`:e.canManagePairing&&t.pendingRequestId&&e.onNodeApprove(t.pendingRequestId);break;case`reject`:e.canManagePairing&&t.pendingRequestId&&e.onNodeReject(t.pendingRequestId);break;case`remove`:e.canManagePairing&&t.onRemove?.()}}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost device-entry__menu-trigger"
        aria-label=${_(`devices.inventory.actionsName`,{name:t.name})}
        title=${_(`devices.inventory.actions`)}
      >
        ${k.moreHorizontal}
      </button>
      ${t.desktopEnvironment?C`<wa-dropdown-item value="desktop"
              >${_(`devices.inventory.openDesktop`)}</wa-dropdown-item
            >`:w}
      ${t.pendingRequestId?C`
              <wa-dropdown-item
                value="approve"
                ?disabled=${!e.canManagePairing}
                title=${n}
                >${_(`devices.inventory.approve`)}</wa-dropdown-item
              >
              <wa-dropdown-item
                value="reject"
                ?disabled=${!e.canManagePairing}
                title=${n}
                >${_(`devices.inventory.reject`)}</wa-dropdown-item
              >
            `:w}
      ${t.deviceId?C`<wa-dropdown-item value="copy"
              >${_(`devices.inventory.copyDeviceId`)}</wa-dropdown-item
            >`:w}
      ${t.onEditAlias?C`<wa-dropdown-item
              value="editAlias"
              ?disabled=${!e.canManagePairing}
              title=${n}
              >${_(`devices.inventory.editAlias`)}</wa-dropdown-item
            >`:w}
      ${t.onRemove?C`<wa-dropdown-item
              value="remove"
              variant="danger"
              ?disabled=${!e.canManagePairing}
              title=${n}
              >${_(`devices.inventory.removeAction`)}</wa-dropdown-item
            >`:w}
    </wa-dropdown>
  `}function X(){return(X=e((()=>{T(),mt(),A(),Ze(),v(),_e(),ve()})))()}function Z(e){return d(e,{style:`legacy-binary`,maxUnit:`tera`,separator:` `,fractionDigits:(e,t)=>+(t===`tera`||e<10)})}function Q(e,t,n,r,i,a=80,o=90){let s=i===void 0?t<a?`ok`:t<o?`warn`:`danger`:`stale`,c=i===void 0?n:`${n} · ${i}`,l=i===void 0?r:`${r} · ${_(`devices.inventory.lastKnown`,{time:i})}`;return C`<span class="device-resource device-resource--${e}" title=${l}>
    <span class="device-resource__label">${c}</span>
    ${Nt({mode:`continuous`,percent:Math.min(100,Math.max(0,t)),tone:s,label:l})}
  </span>`}function $n(e,t){if(!e)return w;let n=t===void 0?void 0:ge(Math.max(0,Date.now()-t)),r=[];if(e.loadAverage&&e.cpuCount>0){let t=_(`devices.inventory.loadTitle`,{averages:e.loadAverage.map(e=>e.toFixed(2)).join(` / `),cores:String(e.cpuCount)});r.push(Q(`load`,e.loadAverage[0]/e.cpuCount*100,_(`devices.inventory.loadLabel`,{load:e.loadAverage[0].toFixed(1)}),t,n,70,100))}if(e.memoryTotalBytes>0&&e.memoryFreeBytes>=0){let t=e.memoryTotalBytes-e.memoryFreeBytes,i=Z(t),a=Z(e.memoryTotalBytes),o=a.slice(a.lastIndexOf(` `)),s=i.endsWith(o)?i.slice(0,-o.length):i;r.push(Q(`memory`,t/e.memoryTotalBytes*100,`${s} / ${a}`,_(`devices.inventory.memoryTitle`,{used:i,total:a}),n))}if(e.diskTotalBytes!=null&&e.diskTotalBytes>0&&e.diskAvailableBytes!=null){let t=Z(e.diskAvailableBytes),i=Z(e.diskTotalBytes);r.push(Q(`disk`,(1-e.diskAvailableBytes/e.diskTotalBytes)*100,_(`devices.inventory.diskLabel`,{available:t}),_(`devices.inventory.diskTitle`,{available:t,total:i}),n))}return r.length?C`<div class="device-resources">${r}</div>`:w}function er(){return(er=e((()=>{T(),Pt(),v(),y()})))()}function tr(...e){let t=new Set;for(let n of e)for(let e of r(n))t.add(e);return[...t].toSorted()}function nr(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function rr(e){return{roles:tr(e.roles,e.role),scopes:ee(e.scopes)}}function ir(e){let t=tr(e.roles,e.role),n=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:n===void 0?t:tr(n.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:ee(e.scopes)}}function ar(e,t){let n=rr(e),r=t?ir(t):null;return r?nr(r.roles,n.roles)?nr(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}function or(){return(or=e((()=>{i()})))()}function sr(e,t,n){let r=new Map(t.map(e=>[f(e.deviceId),e]).filter(e=>!!e[0]));return e.map(e=>dr(e,n,cr(r,e)))}function cr(e,t){let n=f(t.deviceId);if(!n)return;let r=e.get(n);if(!r)return;let i=f(t.publicKey),a=f(r.publicKey);if(!(i&&a&&i!==a))return r}function lr(e){return e?_(`devices.inventory.rolesAndScopes`,{roles:S(e.roles),scopes:S(e.scopes)}):_(`devices.inventory.none`)}function ur(e){switch(e){case`scope-upgrade`:return _(`devices.inventory.scopeUpgrade`);case`role-upgrade`:return _(`devices.inventory.roleUpgrade`);case`re-approval`:return _(`devices.inventory.reapproval`);case`new-pairing`:return _(`devices.inventory.newPairing`)}throw Error(`unsupported pending approval kind`)}function dr(e,t,n){let r=f(e.displayName)||e.deviceId,i=typeof e.ts==`number`?b(e.ts):_(`common.na`),a=ar(e,n),o=e.isRepair?` · ${_(`devices.inventory.repair`)}`:``;return C`
    <div class="settings-row device-entry">
      ${U(k.monitorSmartphone)}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${r}</span>
          <span class="device-entry__status"
            >${P({kind:`warn`,label:_(`devices.inventory.pendingApproval`)})}</span
          >
        </div>
        <span class="settings-row__desc">
          ${_(`devices.inventory.requestedAt`,{note:ur(a.kind),time:i})}${o}
        </span>
      </div>
      <div class="settings-row__control">
        <button
          class="btn btn--sm"
          ?disabled=${!t.canManagePairing}
          @click=${()=>t.onDeviceApprove(e.requestId)}
        >
          ${_(`devices.inventory.approve`)}
        </button>
        <button
          class="btn btn--sm"
          ?disabled=${!t.canManagePairing}
          @click=${()=>t.onDeviceReject(e.requestId)}
        >
          ${_(`devices.inventory.reject`)}
        </button>
        ${Y(t,{name:r,deviceId:e.deviceId})}
      </div>
      <details class="device-entry__details">
        <summary>${_(`devices.inventory.details`)}</summary>
        <dl class="device-entry__facts">
          <dt class="settings-row__desc">${_(`devices.inventory.deviceIdLabel`)}</dt>
          <dd class="settings-row__value settings-row__value--mono" title=${e.deviceId}>
            ${e.deviceId}
          </dd>
          ${e.remoteIp?C`<dt class="settings-row__desc">${_(`devices.inventory.remoteIpLabel`)}</dt>
                  <dd class="settings-row__value settings-row__value--mono">${e.remoteIp}</dd>`:w}
          <dt class="settings-row__desc">${_(`devices.inventory.requestedAccessLabel`)}</dt>
          <dd class="settings-row__value">${lr(a.requested)}</dd>
          ${a.approved?C`<dt class="settings-row__desc">
                    ${_(`devices.inventory.approvedAccessLabel`)}
                  </dt>
                  <dd class="settings-row__value">${lr(a.approved)}</dd>`:w}
        </dl>
      </details>
    </div>
  `}function fr(){return(fr=e((()=>{T(),or(),A(),L(),v(),y(),X(),W()})))()}function pr(e){let t=$t(e);return{id:e.id,name:e.name,...t}}function mr(e,t,n){if(n&&e.length===0)return``;let r=e.filter(e=>e.primary.connected).length,i=[_(`devices.inventory.summaryConnected`,{connected:String(r),total:String(e.length)})];return t>0&&i.push(_(`devices.inventory.summaryPending`,{count:String(t)})),i.join(` · `)}function hr(e){let t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],r=Array.isArray(t.paired)?t.paired:[],i=Yt({paired:r,nodes:e.nodes,presence:e.presence}),a=Zt(e.presence),o=Qt(e.presence,i),s=Xt(i),c=e.loading||e.devicesLoading,l=C`
    ${s.length>0?C`
            <button
              class="btn btn--sm danger"
              title=${e.canManagePairing?``:_(`devices.readOnly.pairingRequired`)}
              ?disabled=${!e.canManagePairing}
              @click=${()=>e.onInventoryCleanup(s.map(pr))}
            >
              ${k.trash} ${_(`devices.inventory.cleanupStale`,{count:String(s.length)})}
            </button>
          `:w}
    <button
      class="btn"
      title=${e.canPairDevice?``:_(`devices.pairing.adminRequired`)}
      ?disabled=${!e.canPairDevice}
      @click=${e.onDevicePairSetupOpen}
    >
      ${k.plus} ${_(`devices.pairing.button`)}
    </button>
  `,u=i.length===0&&!a,d=C`
    ${a?Dr({kind:`gateway`,entry:a},e):w}
    ${c&&i.length===0?et():u?st(_(`devices.inventory.empty`)):i.map(t=>gr(t,e))}
  `;return C`
    ${e.devicesError?C`<div class="callout danger">${e.devicesError}</div>`:w}
    ${e.lastError?C`<div class="callout danger">${e.lastError}</div>`:w}
    ${n.length>0?I({title:_(`devices.inventory.pendingApproval`),count:n.length},sr(n,r,e)):w}
    ${I({title:_(`devices.inventory.title`),description:mr(i,n.length,c),actions:l},d)}
    ${o.length>0?I({title:_(`devices.inventory.connectedWithoutPairing`)},o.map(t=>Dr({kind:`unpaired`,entry:t},e))):w}
  `}function gr(e,t){return e.duplicates.length===0?Tr(e.primary,t):C`
    ${Tr(e.primary,t)}
    <details class="device-group__dups">
      <summary>
        ${_(e.duplicates.length===1?`devices.inventory.olderPairing`:`devices.inventory.olderPairings`,{count:String(e.duplicates.length),name:e.name})}
      </summary>
      ${e.duplicates.map(e=>Tr(e,t))}
    </details>
  `}function _r(e){let t=f(e)?.toLowerCase();return t===`win32`||t===`windows`||t?.startsWith(`windows `)===!0}function vr(e){let t=e.node;return t?.paired?t.approvalState===void 0||t.approvalState===`approved`:!1}function yr(e){let t=f(e.node?.coreVersion);if(t)return t;if(f(e.node?.uiVersion))return;let n=f(e.node?.platform)?.toLowerCase();return n===`darwin`||n===`linux`||n===`win32`||n===`windows`?f(e.node?.version):void 0}function br(e,t){let n=[],r=vr(e),i=yr(e),a=f(t);if(r&&i&&a&&i!==a){let e=_(`devices.inventory.versionDriftTitle`,{nodeVersion:i,gatewayVersion:a});n.push(C`<span title=${e}>
        ${P({kind:`warn`,label:_(`devices.inventory.versionDrift`)})}
      </span>`)}e.node?.workerBundle?.status===`missing`&&n.push(C`<span title=${_(`devices.inventory.workerMissingTitle`)}>
        ${P({kind:`warn`,label:_(`devices.inventory.workerMissing`)})}
      </span>`),r&&e.node?.connected===!1&&_r(e.platform)&&n.push(C`<span title=${_(`devices.inventory.manualWakeTitle`)}>
        ${P({kind:`warn`,label:_(`devices.inventory.manualWake`)})}
      </span>`);let o=e.node?.approvalState;return(o===`pending-approval`||o===`pending-reapproval`)&&n.push(P({kind:`warn`,label:_(`devices.inventory.approvalNeeded`)})),n}function xr(e){return _(`devices.inventory.inputAgo`,{time:ge(e*1e3,{suffix:!1})})}function Sr(e){let t=[];if(e.platform&&t.push(Re(e.platform,e.deviceFamily)),e.modelIdentifier){let n=ct(e.modelIdentifier);n&&t.push(n),t.push(e.modelIdentifier)}e.version&&t.push(e.version),e.node?.workerBundle?.status===`installed`&&t.push(_(`devices.inventory.workerVersion`,{version:e.node.workerBundle.version})),e.connected&&e.presence?.lastInputSeconds!=null?t.push(xr(e.presence.lastInputSeconds)):!e.connected&&e.lastSeenAtMs?t.push(_(`devices.inventory.seen`,{time:b(e.lastSeenAtMs)})):!e.connected&&e.approvedAtMs&&t.push(_(`devices.inventory.approved`,{time:b(e.approvedAtMs)}));for(let n of e.roles)t.push(n);return e.autoApproved&&t.push(_(`devices.inventory.autoPaired`)),t.join(` · `)}function Cr(e){if(e.length===0)return w;let t=e.slice(0,Ar),n=e.length-t.length,r=n>0?` +${n}`:``;return C`<dt class="settings-row__desc">${_(`devices.inventory.commands`)}</dt>
    <dd class="settings-row__value settings-row__value--mono">${S(t)}${r}</dd>`}function wr(e,t){let n=e.device?.tokens??[],r=e.node?.commands??[],i=e.scopes;return C`
    <details class="device-entry__details">
      <summary>${_(`devices.inventory.details`)}</summary>
      <dl class="device-entry__facts">
        <dt class="settings-row__desc">${_(`devices.inventory.deviceIdLabel`)}</dt>
        <dd class="settings-row__value settings-row__value--mono" title=${e.id}>${e.id}</dd>
        ${e.remoteIp?C`<dt class="settings-row__desc">${_(`devices.inventory.remoteIpLabel`)}</dt>
                <dd class="settings-row__value settings-row__value--mono">${e.remoteIp}</dd>`:w}
        ${i.length>0?C`<dt class="settings-row__desc">${_(`devices.inventory.scopesLabel`)}</dt>
                <dd class="device-entry__scopes">
                  ${i.map(e=>C`<span class="device-capability device-capability--scope"
                        >${e}</span
                      >`)}
                </dd>`:w}
        ${n.length>0?C`<dt class="settings-row__desc">${_(`devices.inventory.tokens`)}</dt>
                <dd class="device-entry__tokens">
                  <table
                    class="device-token-table settings-table--stacked"
                    role="table"
                    aria-label=${_(`devices.inventory.tokens`)}
                  >
                    <thead>
                      <tr>
                        <th scope="col">${_(`devices.inventory.tokenRole`)}</th>
                        <th scope="col">${_(`devices.inventory.tokenStatus`)}</th>
                        <th scope="col">${_(`devices.inventory.scopesLabel`)}</th>
                        <th scope="col">${_(`devices.inventory.tokenAge`)}</th>
                        <th scope="col">${_(`devices.inventory.actions`)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${n.map(n=>kr({id:e.id,name:e.name},n,t))}
                    </tbody>
                  </table>
                </dd>`:w}
        ${Cr(r)}
      </dl>
    </details>
  `}function Tr(e,t){let n=Wn({workerSlots:e.node?.workerSlots,capabilities:e.node?.caps,commands:e.node?.commands,unavailable:e.node?.connected!==!0||!vr(e)}),r=e.node?.approvalState===`pending-approval`||e.node?.approvalState===`pending-reapproval`?e.node.pendingRequestId:void 0,i=Zn(t,`node:${e.id}`),a=e.node?.connected??e.connected,o=P(a?{kind:`ok`,label:_(`devices.inventory.connected`)}:{kind:`muted`,label:_(`devices.inventory.offline`)});return C`
    <div class="settings-row device-entry" title=${n?.title??w}>
      ${U(yn(e))}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${e.name}</span>
          <span class="device-entry__status">${o}</span>
        </div>
        <span class="settings-row__desc">${Sr(e)}</span>
        ${$n(e.node?.hostStats,a?void 0:e.node?.hostStats?.updatedAtMs)}
        ${qn(e.node?.caps??[])}
      </div>
      <div class="settings-row__control">
        ${n?.meter??w} ${br(e,t.gatewayVersion)}
        ${Or(t,i,e.node?.commands)}
        ${Y(t,{name:e.name,deviceId:e.id,desktopEnvironment:i,pendingRequestId:r,onEditAlias:e.device?()=>t.onDeviceRename({id:e.id,name:e.name,operatorLabel:e.device?.operatorLabel}):void 0,onRemove:()=>t.onInventoryRemove(pr(e))})}
      </div>
      ${wr(e,t)}
    </div>
  `}function Er(e){let t=[];if(e.platform&&t.push(Re(e.platform,e.deviceFamily)),e.modelIdentifier){let n=ct(e.modelIdentifier);n&&t.push(n),t.push(e.modelIdentifier)}return e.version&&t.push(e.version),e.lastInputSeconds!=null&&t.push(xr(e.lastInputSeconds)),t}function Dr(e,t){let{entry:n}=e,r=e.kind===`gateway`,i=Er(n);r&&t.gatewaySystemInfo&&i.push(_(`devices.inventory.uptime`,{time:Ue(t.gatewaySystemInfo.uptimeMs)??``})),!r&&Array.isArray(n.roles)&&i.push(...n.roles.filter(Boolean));let a=r?k.server:yn({clientMode:n.mode??void 0,platform:n.platform??void 0,modelIdentifier:n.modelIdentifier??void 0}),o=r?n.host??_(`devices.execApprovals.gateway`):n.host??n.mode??_(`devices.inventory.unknownClient`),s=r?Zn(t,`gateway`):void 0;return C`
    <div class="settings-row device-entry">
      ${U(a)}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${o}</span>
          <span class="device-entry__status">
            ${P(r?{kind:`accent`,label:_(`devices.inventory.gateway`)}:{kind:`muted`,label:_(`devices.inventory.unpaired`)})}
          </span>
        </div>
        ${i.length>0?C`<span class="settings-row__desc">${i.join(` · `)}</span>`:w}
        ${r?$n(t.gatewaySystemInfo):w}
      </div>
      <div class="settings-row__control">
        ${Or(t,s)}
        ${Y(t,{name:o,deviceId:n.deviceId,desktopEnvironment:s})}
      </div>
    </div>
  `}function Or(e,t,n){return t?C`<button
      class="btn btn--sm device-entry__desktop"
      title=${_(`devices.inventory.desktopOpenWindow`)}
      @click=${()=>pt(e.basePath,t)}
    >
      ${k.monitor} ${_(`devices.inventory.desktop`)}
    </button>`:n?.includes(`desktop.stream`)?C`<span
        class="device-capability device-capability--disabled"
        aria-disabled="true"
        title=${_(`devices.inventory.desktopEnableHint`)}
        >${k.monitor} ${_(`devices.inventory.desktop`)}</span
      >`:w}function kr(e,t,n){let r=t.revokedAtMs?_(`devices.inventory.revoked`):_(`devices.inventory.active`),i=S(t.scopes),a=b(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return C`
    <tr>
      <td data-label=${_(`devices.inventory.tokenRole`)}>${t.role}</td>
      <td data-label=${_(`devices.inventory.tokenStatus`)}>${r}</td>
      <td data-label=${_(`devices.inventory.scopesLabel`)}>${i}</td>
      <td data-label=${_(`devices.inventory.tokenAge`)}>${a}</td>
      <td data-label=${_(`devices.inventory.actions`)}>
        <div class="device-entry__token-actions">
          <button
            class="btn btn--sm"
            ?disabled=${!n.canManagePairing}
            @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
          >
            ${_(`devices.inventory.rotate`)}
          </button>
          ${t.revokedAtMs?w:C`
                  <button
                    class="btn btn--sm danger"
                    ?disabled=${!n.canManagePairing}
                    @click=${()=>n.onDeviceRevoke(e.id,t.role)}
                  >
                    ${_(`devices.inventory.revoke`)}
                  </button>
                `}
        </div>
      </td>
    </tr>
  `}var Ar;function jr(){return(jr=e((()=>{T(),mt(),A(),L(),Gn(),v(),Be(),y(),dt(),H(),We(),Xn(),X(),er(),fr(),W(),Ar=16})))()}function Mr(e){let t=Nr(e),n=Nn(e);return ot(C`
      ${!e.canManagePairing||!e.canAdmin?C`<div class="callout info" role="note">
              ${_(!e.canManagePairing&&!e.canAdmin?`devices.readOnly.pairingAndAdminRequired`:e.canManagePairing?`devices.readOnly.adminRequired`:`devices.readOnly.pairingRequired`)}
            </div>`:w}
      ${hr(e)} ${Pn(n)}
      ${Pr(t)}
    `,{wide:!0})}function Nr(e){return{...e,...Lr(e.configForm),ready:!!e.configForm,disabled:!e.canAdmin||e.configLoading||e.configSaving||e.configFormMode===`raw`,nodes:vn(e.nodes,[`system.run`]),inventory:on({nodes:e.nodes})}}function Pr(e){let t=e.nodes.length>0,n=C`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.configDirty}
      @click=${e.onSaveBindings}
    >
      ${e.configSaving?_(`common.saving`):_(`common.save`)}
    </button>
  `,r=C`
    ${e.canAdmin?w:F({title:_(`devices.readOnly.adminRequired`)})}
    ${e.configFormMode===`raw`?F({title:_(`devices.binding.formModeHint`)}):w}
    ${e.ready?C`
            ${F({title:_(`devices.binding.defaultBinding`),description:t?_(`devices.binding.defaultBindingHint`):C`${_(`devices.binding.defaultBindingHint`)} ${_(`devices.binding.noNodes`)}`,control:Ir(null,e)})}
            ${e.agents.length===0?F({title:_(`devices.binding.noAgents`)}):e.agents.map(t=>Fr(t,e))}
          `:F({title:_(`devices.binding.loadConfigHint`),control:C`
              <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
                ${e.configLoading?_(`common.loading`):_(`common.loadConfig`)}
              </button>
            `})}
  `;return I({title:_(`devices.binding.execNodeBinding`),description:_(`devices.binding.execNodeBindingSubtitle`),actions:n},r)}function Fr(e,t){let n=e.binding??`__default__`,r=e.name?.trim()?`${e.name} (${e.id})`:e.id;return F({title:r,description:C`
      ${e.isDefault?_(`devices.binding.defaultAgent`):_(`devices.binding.agent`)} ·
      ${n===`__default__`?_(`devices.binding.usesDefault`,{node:t.defaultBinding??_(`devices.binding.any`)}):_(`devices.binding.override`,{node:e.binding??``})}
    `,control:Ir(e,t)})}function Ir(e,t){let n=e===null,r=n?``:`__default__`,i=n?t.defaultBinding??``:e.binding??`__default__`,a;if(i!==r)try{a=hn(t.inventory,i)}catch{}let o=t.nodes.map(e=>({...e,id:e.id===a?i:e.id,disabled:!1}));return i!==r&&!o.some(e=>e.id===i)&&o.push({id:i,label:`${i} (${_(`devices.binding.unavailable`)})`,disabled:!0}),C`
    <select
      class="settings-select"
      aria-label=${_(n?`devices.binding.node`:`devices.binding.binding`)}
      .value=${D(i)}
      ?disabled=${t.disabled||t.nodes.length===0&&i===r}
      @change=${n=>{let r=n.target.value.trim();e===null?t.onBindDefault(r||null):t.onBindAgent(e.id,r===`__default__`?null:r)}}
    >
      <option value=${r} ?selected=${i===r}>
        ${_(n?`devices.binding.anyNode`:`devices.binding.useDefault`)}
      </option>
      ${ye(o,e=>e.id,e=>C`<option
            value=${e.id}
            ?selected=${i===e.id}
            ?disabled=${e.disabled}
          >
            ${e.label}
          </option>`)}
    </select>
  `}function Lr(e){let t={id:`main`,name:void 0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=_n(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,isDefault:e.isDefault,binding:n}});return i.length===0?{defaultBinding:r,agents:[t]}:{defaultBinding:r,agents:i}}function Rr(){return(Rr=e((()=>{T(),be(),Se(),sn(),gn(),L(),v(),Un(),jr(),W()})))()}var zr,Br,Vr,$;function Hr(){return(Hr=e((()=>{a(),qe(),T(),xe(),o(),Oe(),Ee(),De(),Fe(),Rt(),L(),Mt(),v(),de(),fe(),Ie(),H(),z(),Ve(),oe(),ze(),pe(),an(),Rr(),zr=`https://docs.testclaw.ai/nodes`,Br=3e4,Vr=6e4,$=class extends ie{constructor(...e){super(...e),this.presence=[],this.gatewaySystemInfo=null,this.desktopEnvironments=[],this.systemInfoUnavailable=!1,this.pageState=Et(),this.canPairDevice=!1,this.canManagePairing=!1,this.canAdmin=!1,this.execApprovalsTarget=`gateway`,this.execApprovalsTargetNodeId=null,this.pendingConfirmation=null,this.dialogs=new rn({canManagePairing:()=>this.canManagePairing,gatewayConnected:()=>this.gateway.connected,requestGeneration:()=>this.requestGeneration,gatewayClient:()=>this.gateway.client,gatewayUrl:()=>this.context.gateway.connection.gatewayUrl,runPageTask:e=>this.runPageTask(e),pendingDialog:()=>this.pendingConfirmation,setPendingDialog:e=>{this.pendingConfirmation=e},setDevicesError:e=>{this.pageState.devicesError=e,this.requestUpdate()}}),this.routeDataInitialized=!1,this.gateway=new He(this,{getGateway:()=>this.context?.gateway,onIdentityChange:e=>this.resetServerState(e.snapshot),invalidateRequests:e=>{this.pageState.requestGeneration=this.gateway.epoch,!e.identityChanged&&e.snapshot.phase!==`connected`&&this.resetServerState(e.snapshot),this.presenceTask.run([null,null])},onSnapshot:e=>this.handleGatewaySnapshot(e),ensureInitialData:()=>this.ensureInitialData()}),this.presenceTask=new j(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`system-presence`,{},{signal:n}):M,onComplete:e=>{Array.isArray(e)&&(this.presence=e)},onError:e=>{se(e)&&(this.presence=[])}}),this.systemInfoTask=new j(this,{args:()=>[this.gateway.gateway,this.canLoadSystemInfo?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`system.info`,{},{signal:n}):M,onComplete:e=>{this.gatewaySystemInfo=e,this.systemInfoPolling.stop(),this.systemInfoPolling.start()},onError:e=>{se(e)&&(this.gatewaySystemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}}),this.environmentsTask=new j(this,{args:()=>[this.gateway.gateway,this.canLoadDesktopEnvironments?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`environments.list`,{},{signal:n}):M,onComplete:e=>{this.desktopEnvironments=e.environments},onError:()=>{this.desktopEnvironments=[]}}),this.systemInfoPolling=new Ge(this,Vr,()=>this.refreshSystemInfo(),!1,`visible`),this.polling=new Ge(this,Br,()=>{this.refreshNodeInventory(!0),this.canManagePairing&&this.runPageTask(e=>B(e,{quiet:!0}))},!1,`visible`),this.subscriptions=new me(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e)return;let n=t.event===`presence`?O(t.payload):null;if(n){let e=en(n)!==en(this.presence);this.presenceTask.run([null,null]),this.presence=n,e&&(this.canManagePairing&&this.runPageTask(e=>B(e,{quiet:!0})),this.refreshNodeInventory(!0))}(t.event===`device.pair.changed`||t.event===`device.pair.requested`||t.event===`device.pair.resolved`)&&this.canManagePairing&&this.runPageTask(e=>B(e,{quiet:!0})),(t.event===`node.pair.requested`||t.event===`node.pair.resolved`||t.event===`node.runnerInventory.changed`||t.event===`node.hostStats`)&&this.refreshNodeInventory(!0)}))}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){this.cancelPendingConfirmation(),this.subscriptions.clear(),this.presenceTask.run([null,null]),this.resetInventoryDetails(),this.presence=[],this.canPairDevice=!1,this.canManagePairing=!1,this.canAdmin=!1,super.disconnectedCallback()}get requestGeneration(){return this.pageState.requestGeneration}handleGatewaySnapshot(e){let t=e.snapshot;if(this.pageState.client=t.client,this.pageState.connected=t.phase===`connected`,this.pageState.requestGeneration=this.gateway.epoch,this.syncGatewayState(t),this.canLoadSystemInfo||(this.systemInfoTask.run([null,null]),this.gatewaySystemInfo=null),this.canLoadDesktopEnvironments||(this.environmentsTask.run([null,null]),this.desktopEnvironments=[]),this.routeDataInitialized&&t.phase===`connected`&&t.client&&(e.identityChanged||e.connectionChanged)){let e=O(t.hello?.snapshot);this.presence=e??[],this.loadPresence()}this.syncPolling()}syncGatewayState(e){let t=e.phase===`connected`,n=e.hello?.auth??null;this.canAdmin=t&&we(n),this.canManagePairing=t&&(!n||ke(n)),this.canPairDevice=this.canAdmin}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0;let t=this.context.gateway.snapshot;if(!this.gateway.isRouteDataCurrent(e)){this.resetServerState(t),this.presence=O(t.hello?.snapshot)??[],this.loadPresence(),this.ensureInitialData();return}this.pageState={...e.devices,client:t.client,connected:t.phase===`connected`,requestGeneration:this.gateway.epoch};let n=O(t.hello?.snapshot);n&&(this.presence=n),this.loadPresence()}resetServerState(e){this.cancelPendingConfirmation(),this.pageState.requestGeneration+=1;let t=Et({client:e.client,connected:e.phase===`connected`});t.requestGeneration=this.gateway.epoch,this.pageState=t,this.presenceTask.run([null,null]),this.presence=[],this.resetInventoryDetails()}async runPageTask(e){let t=this.pageState;try{let n=e(t);return this.pageState===t&&this.requestUpdate(),await n}finally{this.pageState===t&&this.requestUpdate()}}ensureInitialData(){let e=this.pageState;if(!e.connected||!e.client||!this.routeDataInitialized)return;!e.nodes.length&&!e.nodesLoading&&this.refreshNodeInventory(),this.canManagePairing&&!e.devicesList&&!e.devicesLoading&&this.runPageTask(e=>B(e));let t=this.context.runtimeConfig.state;!t.configSnapshot&&!t.configLoading&&this.context.runtimeConfig.refresh(),this.canAdmin&&!e.execApprovalsSnapshot&&!e.execApprovalsLoading&&this.runPageTask(e=>Dt(e,this.resolveExecApprovalsTarget()))}syncPolling(){if(this.canLoadSystemInfo?this.systemInfoPolling.start():this.systemInfoPolling.stop(),this.gateway.connected&&this.gateway.client){this.polling.start();return}this.polling.stop()}get canLoadSystemInfo(){let e=this.gateway.snapshot;return this.isConnected&&e?.phase===`connected`&&!this.systemInfoUnavailable&&Le(e,`system.info`)===!0}get canLoadDesktopEnvironments(){let e=this.gateway.snapshot;return this.isConnected&&!!(e&&Pe(e))}refreshSystemInfo(){this.canLoadSystemInfo&&this.systemInfoTask.status!==Ke.PENDING&&this.systemInfoTask.run()}refreshNodeInventory(e=!1){this.refreshSystemInfo(),this.canLoadDesktopEnvironments&&this.environmentsTask.status!==Ke.PENDING&&this.environmentsTask.run(),this.runPageTask(t=>_t(t,{quiet:e}))}resetInventoryDetails(){this.systemInfoTask.run([null,null]),this.environmentsTask.run([null,null]),this.systemInfoPolling.stop(),this.gatewaySystemInfo=null,this.desktopEnvironments=[],this.systemInfoUnavailable=!1}loadPresence(){let e=this.gateway.gateway,t=this.gateway.client;return!e||!this.gateway.connected||!t?Promise.resolve():this.presenceTask.run([e,t])}cancelPendingConfirmation(){this.pendingConfirmation?.abort(),this.pendingConfirmation=null}async reportRotationOutcome(e,t,n){if(!this.canManagePairing)return;let r=await this.runPageTask(r=>bt(r,{deviceId:e.id,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t,scopes:n}));r&&await(r.delivery===`in-band`?Lt({title:_(`devices.inventory.rotatePromptTitle`,{role:t}),message:_(`devices.inventory.rotatePromptBody`),secret:r.token,acknowledgeLabel:_(`devices.inventory.rotateAcknowledge`),dismissHint:_(`devices.inventory.rotateDismissHint`)}):Lt({title:_(`devices.inventory.rotateWithheldTitle`,{device:e.name}),status:`success`,message:_(`devices.inventory.rotateWithheldNext`),callout:_(`devices.inventory.rotateWithheldException`),acknowledgeLabel:_(`common.close`),note:_(`devices.inventory.rotateWithheldNote`)}))}resolveExecApprovalsTarget(){return this.execApprovalsTarget===`node`&&this.execApprovalsTargetNodeId?{kind:`node`,nodeId:this.execApprovalsTargetNodeId}:{kind:`gateway`}}render(){let e=this.pageState,t=this.context.runtimeConfig.state,n=this.context.gateway.snapshot,r=n.phase===`connected`&&n.hello?.server?.version?.trim()||null;return C`
      <section class="content-header">
        <div>
          <div class="page-title">${Ne(`devices`)}</div>
          <div class="page-subtitle">
            ${Me(`devices`)} ${rt(zr)}
          </div>
        </div>
      </section>
      ${jt(Mr({loading:e.nodesLoading,nodes:e.nodes,presence:this.presence,gatewayVersion:r,basePath:this.context.basePath,gatewaySystemInfo:this.gatewaySystemInfo,desktopEnvironments:this.desktopEnvironments,lastError:e.lastError,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,canPairDevice:this.canPairDevice,canManagePairing:this.canManagePairing,canAdmin:this.canAdmin,configForm:ue(t),configLoading:t.configLoading,configSaving:t.configSaving,configDirty:t.configFormDirty,configFormMode:t.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:this.execApprovalsTarget,execApprovalsTargetNodeId:this.execApprovalsTargetNodeId,onDevicePairSetupOpen:()=>{this.canAdmin&&this.context.overlays.openDevicePairSetup()},onDeviceApprove:e=>{this.canManagePairing&&this.runPageTask(t=>Ot(t,e))},onDeviceReject:e=>void this.dialogs.confirmPairingReject(`device`,e),onNodeApprove:e=>{this.canManagePairing&&this.runPageTask(t=>wt(t,e))},onNodeReject:e=>void this.dialogs.confirmPairingReject(`node`,e),onInventoryRemove:e=>void this.dialogs.confirmInventoryRemoval({kind:`entry`,entry:e}),onInventoryCleanup:e=>{e.length>0&&this.dialogs.confirmInventoryRemoval({kind:`stale`,entries:e})},onDeviceRotate:(e,t,n)=>void this.reportRotationOutcome(e,t,n),onDeviceRevoke:(e,t)=>void this.dialogs.confirmTokenRevoke(e,t),onDeviceRename:e=>void this.dialogs.editAlias(e),onLoadConfig:()=>void this.context.runtimeConfig.discardDraft({reloadOnly:!0}),onLoadExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>Dt(e,this.resolveExecApprovalsTarget())):void 0,onBindDefault:e=>{this.canAdmin&&(e?this.context.runtimeConfig.patchForm([`tools`,`exec`,`node`],e):this.context.runtimeConfig.removeFormValue([`tools`,`exec`,`node`]))},onBindAgent:(e,t)=>{if(!this.canAdmin)return;let n=this.context.runtimeConfig.agentEntry(e,{ensure:!!t});if(!n)return;let r=[...n.path,`tools`,`exec`,`node`];t?this.context.runtimeConfig.patchForm(r,t):this.context.runtimeConfig.removeFormValue(r)},onSaveBindings:()=>{this.canAdmin&&this.context.runtimeConfig.save()},onExecApprovalsTargetChange:(t,n)=>{this.execApprovalsTarget=t,this.execApprovalsTargetNodeId=n,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null,this.requestUpdate()},onExecApprovalsSelectAgent:t=>{e.execApprovalsSelectedAgent=t,this.requestUpdate()},onExecApprovalsPatch:(e,t)=>this.canAdmin?void this.runPageTask(n=>At(n,e,t)):void 0,onExecApprovalsRemove:e=>this.canAdmin?void this.runPageTask(t=>vt(t,e)):void 0,onSaveExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>ht(e,this.resolveExecApprovalsTarget())):void 0}))}
    `}},g([ne({context:Te,subscribe:!0})],$.prototype,`context`,void 0),g([Ce({attribute:!1})],$.prototype,`routeData`,void 0),g([E()],$.prototype,`presence`,void 0),g([E()],$.prototype,`gatewaySystemInfo`,void 0),g([E()],$.prototype,`desktopEnvironments`,void 0),g([E()],$.prototype,`pageState`,void 0),g([E()],$.prototype,`canPairDevice`,void 0),g([E()],$.prototype,`canManagePairing`,void 0),g([E()],$.prototype,`canAdmin`,void 0),g([E()],$.prototype,`execApprovalsTarget`,void 0),g([E()],$.prototype,`execApprovalsTargetNodeId`,void 0),customElements.get(`testclaw-devices-page`)||customElements.define(`testclaw-devices-page`,$)})))()}Hr();
//# sourceMappingURL=devices-page-tOXKcsBe.js.map