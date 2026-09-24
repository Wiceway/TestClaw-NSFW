import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Hl as o,Jl as s,ac as c,ic as l}from"./control-ui-core-S9jKXqB5.js";import{$ as u,X as d,Y as f,ct as p,i as m,nt as h,o as g}from"./lit-runtime-DWoPVI38.js";import{Di as _,Oi as v,Qa as y,Za as b}from"./control-ui-core-G2U4O6rB.js";import{At as x,Et as S,Nt as C,Ot as w,Pt as T,Tt as E,_t as D,ht as O,wt as k,yt as A}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as j,t as M}from"./en-settings-DALqdpqg.js";import{n as N,t as P}from"./en-apps-Cu09aevB.js";import{n as F,t as I}from"./settings-workspace-DJAhLnkQ.js";import{t as L}from"./native-chrome-setup-Vq_1dBlX.js";function R(e){let t=B.get(e);if(t)return t;let n={domains:null,targetProfile:null};return B.set(e,n),n}function z(e,t,n){let r=B.get(e);r&&r[t]===n&&(r[t]=null,r.domains===null&&r.targetProfile===null&&B.delete(e))}var B,V;function H(){return(H=e((()=>{t(),f(),h(),m(),y(),v(),O(),I(),s(),P(),M(),o(),c(),L(),N(),j(),B=new WeakMap,V=class extends a{constructor(...e){super(...e),this.newDomain=``,this.targetProfileTimer=null,this.subscriptions=new l(this).watch(()=>this.context?.nativeDeviceSettings,(e,t)=>e.subscribe(t),e=>{this.targetProfileTimer&&this.targetProfileTimer.capability!==e&&this.flushTargetProfile()})}disconnectedCallback(){this.flushTargetProfile(),this.subscriptions.clear(),super.disconnectedCallback()}toggle(e,t,n,r,a=!1){return t===void 0?d:C({title:i(`configPage.deviceSettings.${n}`),description:r,checked:t,disabled:a,onChange:t=>this.context.nativeDeviceSettings?.set(e,t)})}editTargetProfile(e){let t=this.context.nativeDeviceSettings;t&&(this.targetProfileTimer!==null&&clearTimeout(this.targetProfileTimer.timer),R(t).targetProfile={value:e,sent:!1},this.targetProfileTimer={capability:t,timer:setTimeout(()=>this.flushTargetProfile(),400)},this.requestUpdate())}flushTargetProfile(){let e=this.targetProfileTimer;if(!e)return;clearTimeout(e.timer),this.targetProfileTimer=null;let t=B.get(e.capability)?.targetProfile;t&&!t.sent&&(t.sent=!0,e.capability.set(`browser.cookieSync.targetProfile`,t.value,()=>{z(e.capability,`targetProfile`,t)}))}updateDomains(e){let t=this.context.nativeDeviceSettings;if(!t)return;let n=B.get(t)?.domains??t.snapshot?.browser?.cookieSync?.domains;if(!n)return;let r=[...new Set(e(n).map(e=>e.trim().toLowerCase()).filter(Boolean))];R(t).domains=r,this.requestUpdate(),t.set(`browser.cookieSync.domains`,r,()=>{z(t,`domains`,r)})}renderBrowser(e){let t=this.context.nativeDeviceSettings,n=e.cookieSync,r=t?B.get(t):void 0,a=r?.domains??n?.domains??[],o=()=>{this.updateDomains(e=>[...e,this.newDomain]),this.newDomain=``};return u`
      ${w({title:i(`configPage.deviceSettings.chromeExtension`)},S({title:i(`configPage.deviceSettings.chromeExtensionSetup`),stacked:!0,control:u`
            <div class="device-extension-setup">
              <testclaw-native-chrome-setup auto-inspect></testclaw-native-chrome-setup>
              <div class="device-extension-setup__actions">
                <a
                  href="https://chromewebstore.google.com/detail/testclaw/kcdjddhmeafeomebliikmbpblkmkfoig"
                  target="_blank"
                  rel="noopener noreferrer"
                  >${i(`appsPage.ctaChromeWebStore`)}</a
                >
                ${D(`https://docs.testclaw.ai/tools/chrome-extension`)}
              </div>
            </div>
          `}))}
      ${e.importAvailable||n&&!n.available?w({title:i(`configPage.deviceSettings.browser`)},u`
                ${e.importAvailable?S({title:i(`configPage.deviceSettings.browserImport`),description:i(`configPage.deviceSettings.browserImportHint`),control:u`<button
                          type="button"
                          class="btn"
                          @click=${()=>t?.openPanel(`browser-import`)}
                        >
                          ${i(`configPage.deviceSettings.importBrowserLogins`)}
                        </button>`}):d}
                ${n&&!n.available?S({title:i(`configPage.deviceSettings.cookieSync`),description:i(`configPage.deviceSettings.cookieSyncUnavailable`)}):d}
              `):d}
      ${n?.available?w({title:i(e.importAvailable?`configPage.deviceSettings.cookieSync`:`configPage.deviceSettings.browser`),description:e.importAvailable?void 0:i(`configPage.deviceSettings.cookieSync`)},u`
                ${this.toggle(`browser.cookieSync.enabled`,n.enabled,`cookieSyncEnabled`,i(`configPage.deviceSettings.cookieSyncHint`))}
                ${S({title:i(`configPage.deviceSettings.domains`),description:i(`configPage.deviceSettings.domainsHint`),stacked:!0,control:u`<div class="device-domains">
                    ${a.map(e=>u`<div class="device-domain-entry">
                        ${T(e)}
                        <button
                          type="button"
                          class="btn small"
                          aria-label=${i(`configPage.deviceSettings.removeDomain`,{domain:e})}
                          @click=${()=>this.updateDomains(t=>t.filter(t=>t!==e))}
                        >
                          ${i(`common.remove`)}
                        </button>
                      </div>`)}
                    <form
                      class="device-domain-entry"
                      @submit=${e=>{e.preventDefault(),o()}}
                    >
                      <input
                        type="text"
                        class="settings-input"
                        aria-label=${i(`configPage.deviceSettings.addDomain`)}
                        .value=${g(this.newDomain)}
                        @input=${e=>{this.newDomain=e.currentTarget.value}}
                      />
                      <button type="submit" class="btn" ?disabled=${!this.newDomain.trim()}>
                        ${i(`configPage.deviceSettings.addDomain`)}
                      </button>
                    </form>
                  </div>`})}
                ${S({title:i(`configPage.deviceSettings.targetProfile`),description:i(`configPage.deviceSettings.targetProfileHint`),control:u`<input
                    type="text"
                    class="settings-input"
                    aria-label=${i(`configPage.deviceSettings.targetProfile`)}
                    .value=${g(r?.targetProfile?.value??n.targetProfile)}
                    @input=${e=>{this.editTargetProfile(e.currentTarget.value)}}
                    @change=${()=>this.flushTargetProfile()}
                  />`})}
                ${S({title:i(`configPage.deviceSettings.syncStatus`),description:n.detail??void 0,control:x({kind:n.state===`error`?`danger`:n.state===`running`?`accent`:`muted`,label:i(`configPage.deviceSettings.syncStates.${n.state}`)})})}
              `):d}
    `}renderSettings(e){let{app:t,capabilities:n}=e,r=this.context.nativeDeviceSettings;return u`
      ${t?w({title:i(`configPage.deviceSettings.app`)},u`
                ${this.toggle(`app.nativeExperienceEnabled`,t.nativeExperienceEnabled,`nativeExperience`,i(`configPage.deviceSettings.nativeExperienceHint`))}
                ${t.appearance===void 0?d:S({title:i(`configPage.deviceSettings.appearance`),control:u`<select
                          class="settings-select"
                          aria-label=${i(`configPage.deviceSettings.appearance`)}
                          .value=${g(t.appearance)}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`app.appearance`,t)}}
                        >
                          ${[`system`,`light`,`dark`].map(e=>u`<option value=${e} ?selected=${e===t.appearance}>${i(`configPage.deviceSettings.appearanceModes.${e}`)}</option>`)}
                        </select>`})}
                ${this.toggle(`app.notificationsEnabled`,t.notificationsEnabled,`notificationsEnabled`,i(`configPage.deviceSettings.notificationsEnabledHint`))}
                ${this.toggle(`app.showDockIcon`,t.showDockIcon,`showDockIcon`,i(`configPage.deviceSettings.showDockIconHint`))}
                ${t.iconStyle?S({title:i(`configPage.deviceSettings.iconStyle`),description:i(`configPage.deviceSettings.iconStyleHint`),control:u`<select
                          class="settings-select"
                          aria-label=${i(`configPage.deviceSettings.iconStyle`)}
                          .value=${g(t.iconStyle.selectedId)}
                          ?disabled=${t.iconStyle.available.length===0}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`app.iconStyle`,t)}}
                        >
                          ${t.iconStyle.available.map(e=>u`<option
                              value=${e.id}
                              ?selected=${e.id===t.iconStyle?.selectedId}
                            >
                              ${e.name}
                            </option>`)}
                        </select>`}):d}
                ${this.toggle(`app.iconAnimationsEnabled`,t.iconAnimationsEnabled,`iconAnimations`,i(`configPage.deviceSettings.iconAnimationsHint`))}
                ${this.toggle(`app.launchAtLogin`,t.launchAtLogin,`launchAtLogin`,t.launchAtLoginAvailable===!1?i(`configPage.deviceSettings.launchAtLoginUnavailable`):void 0,t.launchAtLoginAvailable===!1)}
                ${this.toggle(`app.quickChatEnabled`,t.quickChatEnabled,`quickChat`,i(`configPage.deviceSettings.quickChatHint`))}
                ${t.quickChatShortcut===void 0?d:S({title:i(`configPage.deviceSettings.quickChatShortcut`),control:u`
                          ${T(t.quickChatShortcut??i(`configPage.deviceSettings.notSet`))}
                          <button
                            type="button"
                            class="btn"
                            @click=${()=>r?.openPanel(`quick-chat-shortcut`)}
                          >
                            ${i(`configPage.deviceSettings.changeShortcut`)}
                          </button>
                        `})}
              `):d}
      ${n?w({title:i(`configPage.deviceSettings.capabilities`)},u`
                ${this.toggle(`capabilities.canvasEnabled`,n.canvasEnabled,`canvas`,i(`configPage.deviceSettings.canvasHint`))}
                ${this.toggle(`capabilities.cameraEnabled`,n.cameraEnabled,`camera`,i(`configPage.deviceSettings.cameraHint`))}
                ${this.toggle(`capabilities.keepAwakeEnabled`,n.keepAwakeEnabled,`keepAwake`,i(e.device.platform===`ios`?`configPage.deviceSettings.keepAwakeHint`:`configPage.deviceSettings.keepAwakeComputerHint`))}
                ${n.healthSummaryAvailable?this.toggle(`capabilities.healthSummaryEnabled`,n.healthSummaryEnabled,`healthSummary`,i(`configPage.deviceSettings.healthSummaryHint`)):d}
                ${this.toggle(`capabilities.computerControlEnabled`,n.computerControlEnabled,`computerControl`,i(`configPage.deviceSettings.computerControlHint`))}
                ${this.toggle(`capabilities.desktopSharingEnabled`,n.desktopSharingEnabled,`desktopSharing`,i(e.device.platform===`macos`?`configPage.deviceSettings.desktopSharingHint`:`configPage.deviceSettings.desktopSharingComputerHint`))}
                ${e.desktopSharing?S({title:i(`configPage.deviceSettings.desktopSharingStatus`),description:e.desktopSharing.detail,control:x({kind:e.desktopSharing.state===`error`?`danger`:e.desktopSharing.state===`running`?`ok`:`muted`,label:i(`configPage.deviceSettings.desktopSharingStates.${e.desktopSharing.state}`)})}):d}
                ${this.toggle(`capabilities.unattendedDesktopEnabled`,n.unattendedDesktopEnabled,`unattendedDesktop`,i(`configPage.deviceSettings.unattendedDesktopHint`))}
                ${e.desktopAvailability?S({title:i(`configPage.deviceSettings.desktopAvailability`),control:x({kind:e.desktopAvailability.state===`unlocked`?`ok`:`warn`,label:i(`configPage.deviceSettings.desktopStates.${e.desktopAvailability.state}`)})}):d}
                ${n.computerControlEnabled&&n.computerControlProvider!==void 0?S({title:i(`configPage.deviceSettings.computerControlProvider`),control:u`<select
                          class="settings-select"
                          aria-label=${i(`configPage.deviceSettings.computerControlProvider`)}
                          .value=${n.computerControlProvider}
                          @change=${e=>{let t=e.currentTarget.value;r?.set(`capabilities.computerControlProvider`,t)}}
                        >
                          <option
                            value="peekaboo"
                            ?selected=${n.computerControlProvider===`peekaboo`}
                          >
                            ${i(`configPage.deviceSettings.peekaboo`)}
                          </option>
                          <option
                            value="cua"
                            ?selected=${n.computerControlProvider===`cua`}
                            ?disabled=${!n.cuaDriverBundled}
                          >
                            ${i(n.cuaDriverBundled?`configPage.deviceSettings.cua`:`configPage.deviceSettings.cuaUnavailable`)}
                          </option>
                        </select>`}):d}
                ${this.toggle(`capabilities.peekabooBridgeEnabled`,n.peekabooBridgeEnabled,`peekabooBridge`,i(`configPage.deviceSettings.peekabooBridgeHint`),!n.computerControlEnabled)}
              `):d}
      ${e.browser?this.renderBrowser(e.browser):d}
      ${t?.debugPaneEnabled===void 0?d:w({title:i(`configPage.deviceSettings.developer`)},u`
                ${this.toggle(`app.debugPaneEnabled`,t.debugPaneEnabled,`debugTools`)}
                ${t.debugPaneEnabled?S({title:i(`configPage.deviceSettings.debugWindow`),control:u`<button type="button" class="btn" @click=${()=>r?.openPanel(`debug`)}>${i(`configPage.deviceSettings.openDebug`)}</button>`}):d}
              `)}
      ${e.device.platform===`ios`?w({title:i(`configPage.deviceSettings.device`)},u`${[`diagnostics`,`licenses`,`about`,`watch`].map(e=>S({title:i(`configPage.deviceSettings.panels.${e}`),control:u`<button
                    type="button"
                    class="btn"
                    @click=${()=>r?.openPanel(e)}
                  >
                    ${i(`configPage.deviceSettings.openPanel`)}
                  </button>`}))}`):d}
    `}render(){let e=this.context?.nativeDeviceSettings,t=e?.snapshot,n=e?t?this.renderSettings(t):A(i(`configPage.deviceSettings.loading`)):A(i(`configPage.deviceSettings.appOnly`));return u`
      ${E({title:i(b(t)),subtitle:u`${i(t?.device.platform===`macos`?`configPage.deviceSettings.intro`:`configPage.deviceSettings.introIos`)}
        ${D(`https://docs.testclaw.ai/platforms/${t?.device.platform??`macos`}`)}`})}
      ${F(k(n))}
    `}},r([n({context:_,subscribe:!0})],V.prototype,`context`,void 0),r([p()],V.prototype,`newDomain`,void 0),customElements.get(`testclaw-device-page`)||customElements.define(`testclaw-device-page`,V)})))()}H();
//# sourceMappingURL=device-page-Cx1Y9-lj.js.map