import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Jl as n,_n as r,sn as i}from"./control-ui-core-S9jKXqB5.js";import{$ as a,X as o,Y as s,b as c,x as l}from"./lit-runtime-DWoPVI38.js";import{Fi as u,Fr as d,Ii as f}from"./control-ui-core-G2U4O6rB.js";import{Fi as p,Ii as m,Pi as h}from"./control-ui-boot-shared-ooxiG3qa.js";import{Br as g,Ur as _,Vr as v}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as y,t as b}from"./en-devices-Ds-S73sh.js";function x(e){return t(e===`limited`?`devices.pairing.limitedAccess`:e===`node`?`devices.pairing.nodeAccessSummary`:`devices.pairing.fullAccessSummary`)}function S(e){if(!e.open)return o;let n=e.lifecycle,r=t(`devices.pairing.title`),s=n.phase===`success`?t(`devices.pairing.pairedTitle`):n.phase===`delivery-uncertain`?t(`devices.pairing.deliveryUncertainTitle`):n.phase===`expired`?t(`devices.pairing.expiredTitle`):t(`devices.pairing.subtitle`),c=t(`devices.pairing.copySetupCode`),d=n.phase===`waiting`?n.setup:null,f=d?.gatewayUrls??(d?[d.gatewayUrl]:[]),m=n.access===`node`,v=m?w:C,y=d?`testclaw node run --pair "oc-pair://${d.setupCode}"`:``,b=!!(d&&d.expiresAtMs<=e.nowMs),S=n.phase!==`success`&&n.phase!==`delivery-uncertain`&&n.phase!==`reconciling`&&(n.phase!==`error`||n.source!==`status`),E=n.phase===`selection`||n.phase===`error`&&n.source===`create`;return a`
    <testclaw-modal-dialog label=${r} description=${s} @modal-cancel=${e.onClose}>
      <section class="device-pair-setup">
        <header class="device-pair-setup__header">
          <div class="device-pair-setup__phone" aria-hidden="true">
            ${m?u.server:u.smartphone}
          </div>
          <div>
            <h2>${r}</h2>
            <p>${s}</p>
            ${n.phase!==`success`&&!m?a`<p class="device-pair-setup__get-apps">
                    ${t(`devices.pairing.noApp`)}
                    <button type="button" @click=${e.onGetApps}>
                      ${t(`devices.pairing.getApps`)}
                    </button>
                  </p>`:o}
          </div>
          <button
            class="btn btn--icon btn--ghost device-pair-setup__close"
            type="button"
            aria-label=${t(`common.dismiss`)}
            @click=${e.onClose}
          >
            ${u.x}
          </button>
        </header>

        <div class="device-pair-setup__body">
          ${S?a`<fieldset class="device-pair-setup__access" ?disabled=${!E}>
                  <legend>${t(`devices.pairing.accessTitle`)}</legend>
                  ${T.map(([r,i,o])=>a`<label>
                      <input
                        type="radio"
                        name="device-pair-access"
                        .checked=${n.access===r}
                        @change=${()=>e.onAccessChange(r)}
                      />
                      <span>
                        <strong>${t(i)}</strong>
                        <small>${t(o)}</small>
                      </span>
                    </label>`)}
                </fieldset>`:o}
          ${n.phase===`selection`?a`
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${m?u.server:u.smartphone}
                    ${t(`devices.pairing.generateCode`)}
                  </button>
                `:o}
          ${n.phase===`loading`?a`
                  <div class="device-pair-setup__loading" role="status" aria-live="polite">
                    <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                    <span>${t(`devices.pairing.generating`)}</span>
                  </div>
                `:o}
          ${n.phase===`reconciling`?a`
                  <div class="device-pair-setup__loading" role="status" aria-live="polite">
                    <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                    <span>${t(`common.loading`)}</span>
                  </div>
                `:o}
          ${n.phase===`error`?a`
                  <div class="callout danger device-pair-setup__error" role="alert">
                    <strong
                      >${t(n.source===`status`?`devices.pairing.statusFailed`:`devices.pairing.failed`)}</strong
                    >
                    <span>${n.message}</span>
                  </div>
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${u.refresh} ${t(`common.reload`)}
                  </button>
                `:o}
          ${d?a`
                  ${m?a`<div class="device-pair-setup__command">
                          ${b?o:a`<div class="login-gate__command">
                                  <code>${y}</code>
                                  ${_(y,t(`connection.help.copyCommand`))}
                                </div>`}
                          <p class="device-pair-setup__waiting" role="timer" aria-live="off">
                            ${b?t(`devices.pairing.nodeExpired`):t(`devices.pairing.nodeExpiresIn`,{time:i(d.expiresAtMs,e.nowMs)})}
                          </p>
                        </div>`:a`<div class="device-pair-setup__qr-frame">
                          ${d.qrDataUrl?a`<img
                                  class="device-pair-setup__qr"
                                  src=${d.qrDataUrl}
                                  alt=${t(`devices.pairing.qrAlt`)}
                                  width="360"
                                  height="360"
                                  draggable="false"
                                />`:a`<div class="device-pair-setup__qr-unavailable">
                                  ${t(`devices.pairing.qrUnavailable`)}
                                </div>`}
                        </div>`}

                  <div class="device-pair-setup__meta">
                    <span class="settings-status settings-status--accent">
                      <span class="settings-status__dot"></span>
                      ${d.auth}
                    </span>
                    <div class="device-pair-setup__gateways">
                      ${f.map(e=>a`
                          <span class="device-pair-setup__gateway" title=${e}
                            >${e}</span
                          >
                        `)}
                    </div>
                  </div>

                  ${d.accessDowngraded?a`
                          <div class="callout warn device-pair-setup__access-warning" role="status">
                            <strong>${t(`devices.pairing.transportLimitedTitle`)}</strong>
                            <span>${t(`devices.pairing.transportLimitedHint`)}</span>
                          </div>
                        `:o}

                  <div class="device-pair-setup__actions">
                    ${m?o:l(d.setupCode,a`<button
                              class="btn primary"
                              type="button"
                              @click=${e=>void g(e,d.setupCode,c)}
                            >
                              ${u.copy} <span data-copy-label>${c}</span>
                            </button>`)}
                    <button class="btn" type="button" @click=${e.onRefresh}>
                      ${u.refresh} ${t(`devices.pairing.newCode`)}
                    </button>
                  </div>

                  <details class="device-pair-setup__fallback">
                    <summary>${t(`devices.pairing.showSetupCode`)}</summary>
                    <code>${d.setupCode}</code>
                  </details>

                  ${e.pendingCount>0?a`
                          <div class="callout warn device-pair-setup__pending">
                            <span>
                              ${t(`devices.pairing.pending`,{count:String(e.pendingCount)})}
                            </span>
                            <button class="btn btn--sm" @click=${e.onManageDevices}>
                              ${t(`devices.pairing.review`)}
                            </button>
                          </div>
                        `:a`<p class="device-pair-setup__waiting">
                          ${t(m?`devices.pairing.nodeWaiting`:`devices.pairing.waiting`)}
                        </p>`}
                `:o}
          ${n.phase===`success`?a`<div class="device-pair-setup__state" role="status" aria-live="polite">
                  <div
                    class="device-pair-setup__state-icon device-pair-setup__state-icon--success"
                    aria-hidden="true"
                  >
                    ${u.badgeCheck}
                  </div>
                  <h3>${n.deviceName??t(`devices.pairing.pairedTitle`)}</h3>
                  <p>
                    ${n.deviceName?a`${t(`devices.pairing.pairedTitle`)}
                            <span aria-hidden="true">·</span> `:o}${x(n.access)}
                  </p>
                  <button class="btn primary" type="button" @click=${e.onClose}>
                    ${t(`devices.pairing.done`)}
                  </button>
                </div>`:o}
          ${n.phase===`delivery-uncertain`?a`<div class="device-pair-setup__state" role="alert">
                  <div class="device-pair-setup__state-icon" aria-hidden="true">
                    ${u.alertTriangle}
                  </div>
                  <h3>${t(`devices.pairing.deliveryUncertainTitle`)}</h3>
                  <p>${t(`devices.pairing.deliveryUncertainHint`)}</p>
                  <div class="device-pair-setup__actions">
                    <button class="btn primary" type="button" @click=${e.onRefresh}>
                      ${u.refresh} ${t(`devices.pairing.generateNewCode`)}
                    </button>
                  </div>
                </div>`:o}
          ${n.phase===`expired`?a`<div class="device-pair-setup__state" role="status" aria-live="polite">
                  <div class="device-pair-setup__state-icon" aria-hidden="true">
                    ${u.refresh}
                  </div>
                  <h3>${t(`devices.pairing.expiredTitle`)}</h3>
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${u.refresh} ${t(`devices.pairing.generateNewCode`)}
                  </button>
                </div>`:o}
        </div>

        <footer class="device-pair-setup__footer">
          <a
            href=${v}
            target=${h}
            rel=${p()}
            aria-label=${t(`devices.pairing.helpNewTab`)}
          >
            <span>${t(`devices.pairing.help`)}</span>
            <span class="device-pair-setup__external-icon" aria-hidden="true"
              >${u.externalLink}</span
            >
          </a>
          <button class="btn btn--ghost" type="button" @click=${e.onManageDevices}>
            ${t(`devices.pairing.manageDevices`)}
          </button>
        </footer>
      </section>
    </testclaw-modal-dialog>
  `}var C,w,T;function E(){return(E=e((()=>{s(),c(),v(),f(),d(),n(),b(),m(),r(),y(),C=`https://docs.testclaw.ai/channels/pairing#pair-from-the-control-ui-recommended`,w=`https://docs.testclaw.ai/gateway/pairing#one-paste-node-pairing`,T=[[`full`,`devices.pairing.fullAccess`,`devices.pairing.fullAccessHint`],[`limited`,`devices.pairing.limitedAccess`,`devices.pairing.limitedAccessHint`],[`node`,`devices.pairing.nodeAccess`,`devices.pairing.nodeAccessHint`]]})))()}E();export{S as renderDevicePairSetup};
//# sourceMappingURL=view-pairing.runtime-B-jTy4uQ.js.map