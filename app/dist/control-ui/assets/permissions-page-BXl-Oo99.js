import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Hl as o,Jl as s,ac as c,ic as l}from"./control-ui-core-S9jKXqB5.js";import{$ as u,X as d,Y as f}from"./lit-runtime-DWoPVI38.js";import{Di as p,Fi as m,Ii as h,Oi as g,Qa as _,fo as v}from"./control-ui-core-G2U4O6rB.js";import{At as y,Et as b,Nt as x,Ot as S,Tt as C,_t as w,ht as T,kt as E,wt as D,yt as O}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as k,t as A}from"./en-settings-DALqdpqg.js";import{n as j,t as M}from"./settings-workspace-DJAhLnkQ.js";var N;function P(){return(P=e((()=>{t(),f(),_(),g(),h(),T(),M(),s(),A(),o(),c(),k(),N=class extends a{constructor(...e){super(...e),this.subscriptions=new l(this).watch(()=>this.context?.nativeDeviceSettings,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),super.disconnectedCallback()}renderPermissions(e){let t=this.context.nativeDeviceSettings,{permissions:n}=e,r=n.location,a=r?.preciseEditable??e.device.platform===`macos`;return u`
      ${n.entries.length>0?S({title:i(`configPage.deviceSettings.systemAccess`)},n.entries.map(({id:n,status:r})=>{let a=i(`configPage.deviceSettings.permissions.${n}.title`),o=e.device.platform===`macos`&&(n===`screenRecording`||n===`accessibility`)&&r===`notDetermined`;return b({title:a,description:i(`configPage.deviceSettings.permissions.${n}.hint`),stackedOnNarrow:!0,control:u`
                    <div class="settings-permission-control">
                      ${y({kind:`muted`,dot:!1,label:u`${r===`granted`?u`<span class="settings-permission-check" aria-hidden="true">${m.check}</span>`:d}${i(`configPage.deviceSettings.permissionStatuses.${o?`notGranted`:r}`)}`})}
                      ${r===`notDetermined`?u`<button type="button" class="btn" aria-label=${`${i(`configPage.deviceSettings.grant`)}: ${a}`} @click=${()=>t?.requestPermission(n)}>${i(`configPage.deviceSettings.grant`)}</button>`:r===`denied`?u`<button type="button" class="btn" aria-label=${`${i(`configPage.deviceSettings.openSystemSettings`)}: ${a}`} @click=${()=>t?.openSystemSettings(n)}>${i(`configPage.deviceSettings.openSystemSettings`)}</button>`:d}
                      ${o?u`<button type="button" class="btn settings-permission-recovery" aria-label=${`${i(`configPage.deviceSettings.openSystemSettings`)}: ${a}`} @click=${()=>t?.openSystemSettings(n)}>${i(`configPage.deviceSettings.openSystemSettings`)}</button>`:d}
                    </div>
                  `})})):d}
      ${r?S({title:i(`configPage.deviceSettings.location`)},u`
                ${b({title:i(`configPage.deviceSettings.locationAccess`),description:i(`configPage.deviceSettings.locationHint`),stackedOnNarrow:!0,control:E({value:r.mode,ariaLabel:i(`configPage.deviceSettings.locationAccess`),options:[`off`,`whileUsing`,`always`].map(e=>({value:e,label:i(`configPage.deviceSettings.locationModes.${e}`)})),onChange:e=>t?.set(`permissions.location.mode`,e)})})}
                ${a?x({title:i(`configPage.deviceSettings.preciseLocation`),description:i(`configPage.deviceSettings.preciseLocationHint`),checked:r.precise,disabled:r.mode===`off`,onChange:e=>t?.set(`permissions.location.precise`,e)}):b({title:i(`configPage.deviceSettings.preciseLocation`),description:i(`configPage.deviceSettings.preciseLocationReadOnlyHint`),stackedOnNarrow:!0,control:u`
                          <div class="settings-permission-control">
                            ${y({kind:`muted`,dot:!1,label:i(r.precise?`configPage.deviceSettings.preciseLocationStatuses.enabled`:`configPage.deviceSettings.preciseLocationStatuses.disabled`)})}
                            <button
                              type="button"
                              class="btn"
                              aria-label=${`${i(`configPage.deviceSettings.openSettings`)}: ${i(`configPage.deviceSettings.preciseLocation`)}`}
                              @click=${()=>t?.openSystemSettings(`location`)}
                            >
                              ${i(`configPage.deviceSettings.openSettings`)}
                            </button>
                          </div>
                        `})}
              `):d}
      ${e.capabilities?.activeComputerPresenceEnabled===void 0?d:S({title:i(`configPage.deviceSettings.privacy`)},x({title:i(`configPage.deviceSettings.activePresence`),description:i(`configPage.deviceSettings.activePresenceHint`),checked:e.capabilities.activeComputerPresenceEnabled,onChange:e=>t?.set(`capabilities.activeComputerPresenceEnabled`,e)}))}
    `}render(){let e=this.context?.nativeDeviceSettings,t=e?.snapshot,n=e?t?this.renderPermissions(t):O(i(`configPage.deviceSettings.loading`)):O(i(`configPage.deviceSettings.appOnly`));return u`
      ${C({title:v(`device-permissions`),subtitle:u`${i(t?.device.platform===`macos`?`configPage.deviceSettings.permissionsIntro`:`configPage.deviceSettings.permissionsIntroIos`)}
        ${w(`https://docs.testclaw.ai/platforms/${t?.device.platform??`macos`}`)}`})}
      ${j(D(n))}
    `}},r([n({context:p,subscribe:!0})],N.prototype,`context`,void 0),customElements.get(`testclaw-device-permissions-page`)||customElements.define(`testclaw-device-permissions-page`,N)})))()}P();
//# sourceMappingURL=permissions-page-BXl-Oo99.js.map