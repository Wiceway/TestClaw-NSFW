import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{d as t,f as n}from"./control-ui-foundation-CGMdhB5v.js";import{$l as r,Bs as i,Jl as a,Rs as o}from"./control-ui-core-S9jKXqB5.js";import{$ as s,X as c,Y as l,Z as u}from"./lit-runtime-DWoPVI38.js";import{Fr as d,dt as f,lt as p,xt as m,yt as h}from"./control-ui-core-G2U4O6rB.js";import{mo as g,po as _}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as v,t as y}from"./en-update-actions-DO5QUedS.js";import{t as b}from"./update-run-view-BsQ08KdN.js";function x(e,t){let n=e?.currentVersion?.trim(),i=n?r(`updates.target.version`,{version:n}):null,a=p(t,e);if(i&&a){let n=t?.install?.git,o=n?.status===`behind`||n?.status===`diverged`||t?.target?.kind===`git`||e?.commitsBehind!==void 0;return r(o?`updates.confirm.versionsBehind`:`updates.confirm.versions`,{available:a,installed:i})}return i??a??void 0}function S(e){return r(e?`updates.dialog.installing`:`updates.dialog.disconnected`)}async function C(e){if(E)return;let t=document.createElement(`div`);document.body.append(t),document.body.classList.add(T);let i=e.viaNativeApp?{confirmLabel:r(`updates.confirm.macAction`),message:r(`updates.confirm.macMessage`),title:r(`chat.sidebar.updateMacAndGateway`)}:{confirmLabel:r(`updates.confirm.action`),message:r(`updates.confirm.message`),title:r(`chat.sidebar.updateGateway`)},a=x(e.updateAvailable,e.updateSchedule);await new Promise(l=>{let d=e.existingRun?{kind:`run`,run:e.existingRun}:{kind:`confirm`},f=!1,p,h,_=!1,v,y=`idle`,b=()=>{f||(f=!0,p?.(),h!==void 0&&globalThis.clearTimeout(h),u(c,t),t.remove(),document.body.classList.remove(T),E=!1,l())},x=()=>{!f&&d.kind===`run`&&d.run.status!==`running`&&e.onAcknowledge?.(),b()},C=(e,t)=>{let n=e(e=>{if(!f){if(v=e,d.kind===`run`&&!e.run){b();return}t(e)}});f?n():p=n};E=!0;let D=()=>{if(f)return;let o=d,l=o.kind===`run`?o.run:null,m=o.kind===`run`?v?.readError:null,h=o.kind===`working`||l?.status===`running`,_=l!==null&&l.status!==`running`,b=o.kind===`failed`||l!==null&&n(l),C=y===`pending`,w=typeof y==`object`?y.error:null,T=b||!!m||y!==`idle`,E=v?.connected===!1,A=o.kind===`run`?m??``:o.kind===`failed`?o.message:o.kind===`working`?S(!E):`${i.message} ${r(`updates.confirm.impact`)}`;u(s`
          <testclaw-modal-dialog label=${i.title} description=${A} @modal-cancel=${x}>
            <div class="exec-approval-card update-run-dialog">
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">${i.title}</div>
                  <div class="exec-approval-sub" style="white-space: pre-line">${A}</div>
                </div>
              </div>
              <div role="status" aria-live="polite" class="exec-approval-sub">
                ${E&&T?r(`updates.dialog.checkStatusDisconnected`):y===`success`&&!m?r(`updates.dialog.statusRefreshed`):c}
              </div>
              ${w?s`<div role="alert" class="exec-approval-sub">${w}</div>`:c}
              ${a&&o.kind===`confirm`?s`<div class="exec-approval-command mono update-confirmation-details">
                      <div>${a}</div>
                      ${g(e.updateSchedule,e.updateAvailable)}
                    </div>`:c}
              ${o.kind===`run`?s`<testclaw-update-run-view
                      .run=${o.run}
                      .connected=${!E}
                    ></testclaw-update-run-view>`:c}
              <div class="exec-approval-actions">
                ${_||T?s` ${T&&e.onCheckStatus?s`<button
                                type="button"
                                class="btn ${C?`btn--busy`:``}"
                                ?disabled=${C||E}
                                @click=${O}
                              >
                                ${C?s`<span class="btn__spinner" aria-hidden="true"></span>${r(`updates.dialog.checkingStatus`)}`:r(`updates.dialog.checkStatus`)}
                              </button>`:c}
                        ${b?s`<button
                                type="button"
                                class="btn primary"
                                ?disabled=${C||E}
                                @click=${()=>{d={kind:`confirm`},y=`idle`,p?.(),D()}}
                              >
                                ${r(`updates.dialog.retryUpdate`)}
                              </button>`:c}
                        ${b&&e.onReviewUpdate?s`<button
                                type="button"
                                class="btn"
                                @click=${()=>{x(),e.onReviewUpdate?.()}}
                              >
                                ${r(`updates.reviewUpdate`)}
                              </button>`:c}
                        <button type="button" class="btn" autofocus @click=${x}>
                          ${r(`common.close`)}
                        </button>`:s`
                        <button
                          type="button"
                          class="btn danger ${h?`btn--busy`:``}"
                          ?disabled=${h}
                          @click=${k}
                        >
                          ${h?s`<span class="btn__spinner" aria-hidden="true"></span>${r(`chat.updating`)}`:i.confirmLabel}
                        </button>
                        <button type="button" class="btn" autofocus @click=${x}>
                          ${r(h?`common.close`:`common.cancel`)}
                        </button>
                      `}
              </div>
            </div>
          </testclaw-modal-dialog>
        `,t)};async function O(){if(y!==`pending`&&v?.connected!==!1&&e.onCheckStatus){y=`pending`,D();try{y=await e.onCheckStatus()?`success`:v?.readError?`idle`:{error:r(`updates.dialog.statusNotRefreshed`)}}catch(e){y={error:o(e)}}finally{D()}}}function k(){if(d.kind!==`confirm`)return;if(e.viaNativeApp&&m()){x();return}let t=e.watchUpdateProgress;if(!t){e.startGatewayUpdate(),x();return}_=!1,h!==void 0&&globalThis.clearTimeout(h),d={kind:`working`},D(),e.startGatewayUpdate();let n=!0;C(t,e=>{let t=n;if(n=!1,d.kind===`confirm`)return;if(e.run&&(!t||e.run.status===`running`)){_=!0,d={kind:`run`,run:e.run},D();return}let r=e.failure&&e.readError?`${e.failure}\n${e.readError}`:e.failure??e.readError;if(r&&!t){d={kind:`failed`,message:r},D();return}_||=e.busy,d={kind:`working`},D()}),!f&&(h=globalThis.setTimeout(()=>{f||_||d.kind!==`working`||(d={kind:`failed`,message:r(`updates.dialog.notStarted`)},D())},w))}e.existingRun&&e.watchUpdateProgress&&C(e.watchUpdateProgress,e=>{e.run&&(d={kind:`run`,run:e.run},D())}),D()})}var w,T,E;function D(){return(D=e((()=>{l(),t(),_(),a(),y(),d(),b(),i(),h(),f(),v(),w=4e3,T=`update-dialog-open`,E=!1})))()}D();export{C as confirmAndStartUpdateRuntime};
//# sourceMappingURL=update-confirmation.runtime-CFlNDESo.js.map