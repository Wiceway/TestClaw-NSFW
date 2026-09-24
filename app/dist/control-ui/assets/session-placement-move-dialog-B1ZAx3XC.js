import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Bs as n,Jl as r,Rs as i}from"./control-ui-core-S9jKXqB5.js";import{$ as a,X as o,Y as s}from"./lit-runtime-DWoPVI38.js";import{Fi as c,Ii as l,Ut as u,Wt as d}from"./control-ui-core-G2U4O6rB.js";import{Rl as f,zl as p}from"./control-ui-boot-shared-ooxiG3qa.js";import{Da as m,wa as h}from"./control-ui-boot-shared-CCYBAAP9.js";import{G as g,W as _,et as v,it as y,nt as b,rt as x,tt as S}from"./control-ui-boot-new-DhInmp9T.js";function C(e){if(!e)return``;switch(e.kind){case`gateway`:return`gateway`;case`profile`:return`profile:${e.profileId}`;case`device`:return`device:${e.deviceId}`}throw Error(`Unknown session placement move target`)}function w(e){return T?Promise.resolve(null):(T=!0,d(void 0,({render:n,finish:r})=>{let s=!0,l=null,u={profiles:[],devices:[]},d=e.mode===`move`?{kind:`gateway`}:null,f=new _,p=e=>{r(e),T=!1},m=e=>{d=e,v()},g=e=>{if(e.preventDefault(),!d)return;if(d.kind!==`profile`){p(d);return}let t=f.resolve(d.profileId),n=f.resolveOs(d.profileId);p({...d,...t?{machineClass:t}:{},...n?{os:n}:{}})};function v(){let r=C(d),i=u.profiles.toSorted(h),_=e.mode===`restart`,w=e.mode===`dispatch`,T=t(`sessionsView.${e.mode}SessionTitle`),E=t(`sessionsView.${e.mode}SessionDescription`,{session:e.sessionLabel}),D=t(`sessionsView.${e.mode}SessionAction`);n(()=>a`
          <testclaw-modal-dialog label=${T} @modal-cancel=${()=>p(null)}>
            <form class="exec-approval-card" @submit=${g}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${T}</div>
                <div class="muted">${E}</div>
              </div>
              ${_?a`<div class="exec-approval-error" role="alert">
                      ${t(`sessionsView.restartSessionWarning`)}
                    </div>`:w?a`<div class="callout">${t(`sessionsView.dispatchSessionNotice`)}</div>`:e.activeRun?a`<div class="exec-approval-error" role="alert">
                          ${t(`sessionsView.moveSessionActiveRunWarning`)}
                        </div>`:a`<div class="callout">
                          ${t(`sessionsView.moveSessionNoReplayWarning`)}
                        </div>`}
              ${s?a`<div class="muted">${t(`common.loading`)}</div>`:l?a`<div class="exec-approval-error" role="alert">${l}</div>`:a`
                        <div class="new-session-page__picker-root">
                          ${w?o:y({value:`gateway`,label:t(`newSession.gateway`),icon:c.monitor,checked:r===`gateway`,disabled:!!e.gatewayDisabledReason,title:e.gatewayDisabledReason,onSelect:()=>m({kind:`gateway`})},!1)}
                          ${u.devices.length>0?a`
                                  <div class="new-session-page__menu-title">
                                    ${t(`newSession.yourDevices`)}
                                  </div>
                                  ${u.devices.map(t=>{let n=e.deviceDisabledReason??t.disabledReason;return y({value:`device:${t.deviceId}`,label:t.label,sub:t.subtitle,icon:c.monitor,facts:e.deviceDisabledReason?[e.deviceDisabledReason]:t.facts,checked:r===`device:${t.deviceId}`,disabled:!!e.deviceDisabledReason||!t.selectable,title:n,onSelect:()=>m({kind:`device`,deviceId:t.deviceId})},!1)})}
                                `:o}
                          ${u.profiles.length>0?a`
                                  <div class="new-session-page__menu-title">
                                    ${t(`newSession.cloud`)}
                                  </div>
                                  ${i.map(n=>{let r=d?.kind===`profile`&&d.profileId===n.id,i=f.machines(n),s=n.operatingSystems??[],c=f.resolve(n.id)||i.find(e=>e.default===!0)?.id||``;return a`
                                      ${x({profiles:[n],selectedId:r?n.id:``,submitting:!1,profileDisabledReason:e.profileDisabledReason,onSelect:e=>m({kind:`profile`,profileId:e})})}
                                      ${r&&s.length>=2?a`
                                              <div class="new-session-page__menu-title">
                                                ${t(`newSession.operatingSystem`)}
                                              </div>
                                              ${b({operatingSystems:s,selectedId:f.selectedOs(n),submitting:!1,onSelect:e=>f.selectOs(n.id,e,u.profiles,!1,v)})}
                                            `:o}
                                      ${r&&i.length>0?a`
                                              <div class="new-session-page__menu-title">
                                                ${t(`newSession.machine`)}
                                              </div>
                                              ${S({machines:i,selectedId:c,submitting:!1,onSelect:e=>f.select(n.id,e,u.profiles,!1,v)})}
                                            `:o}
                                    `})}
                                `:o}
                        </div>
                      `}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${s||!!l||!d}
                >
                  ${D}
                </button>
                <button type="button" class="btn" @click=${()=>p(null)}>
                  ${t(`common.cancel`)}
                </button>
              </div>
            </form>
          </testclaw-modal-dialog>
        `)}v(),e.loadCatalog().then(e=>{u=e}).catch(e=>{l=i(e,t(`sessionsView.moveSessionCatalogFailed`))}).finally(()=>{s=!1,v()})}))}var T;function E(){return(E=e((()=>{s(),r(),f(),n(),v(),g(),l(),u(),m(),p(),T=!1})))()}E();export{w as showSessionPlacementTargetDialog};
//# sourceMappingURL=session-placement-move-dialog-B1ZAx3XC.js.map