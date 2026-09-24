import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Bs as n,Jl as r,Rs as i}from"./control-ui-core-S9jKXqB5.js";import{$ as a,X as o,Y as s,_ as c,m as l}from"./lit-runtime-DWoPVI38.js";import{Fi as u,Ii as d,Ut as f,Wt as p}from"./control-ui-core-G2U4O6rB.js";import{Rl as m,zl as h}from"./control-ui-boot-shared-ooxiG3qa.js";import{Ia as g,La as _,nt as v,tt as y}from"./control-ui-boot-shared-CCYBAAP9.js";import{m as b}from"./control-ui-boot-shared-VDjYq2Zh.js";import{$ as x,Q as S,X as C,Z as w,et as T,it as E}from"./control-ui-boot-new-DhInmp9T.js";function D(e){return O?Promise.resolve():(O=!0,p(void 0,({host:n,render:r,finish:s})=>{let l=e.defaults.cwd,d=!1,f=`checking`,p=0,m=!1,h=null,g=!1,y=new S(e.listDirectory,F),x=()=>{y.reset(),p+=1,s(),O=!1},C=async t=>{if(t.preventDefault(),!(m||f===`checking`||f===`unavailable`)){m=!0,h=null,F();try{h=await e.submit({cwd:l.trim(),worktree:f===`git`&&d})}catch(e){h=i(e)}if(!h){x();return}m=!1,F()}},T=()=>{let e=n.querySelector(`wa-popover.session-group-defaults__folder-popover`);e&&(e.open=!1)},D=()=>{y.reset(),g=!1,F()},k=e=>{l=e.trim(),D(),T(),A(!1)},A=async t=>{let n=++p;f=`checking`,d=!1,h=null,F();try{let r=await e.inspectRepository(l.trim()||void 0);if(n!==p)return;f=r,d=r===`git`&&t&&e.defaults.worktree}catch{if(n!==p)return;f=`unavailable`,d=!1}F()},j=e=>{d=e,h=null,F()},M=e=>{let t=e.detail.item.getAttribute(`value`);(t===`local`||t===`worktree`)&&j(t===`worktree`)},N=e=>{if(!(e.currentTarget instanceof HTMLElement))return;let t=e.currentTarget;e.key===`Escape`&&t.open&&(e.preventDefault(),e.stopPropagation(),t.open=!1,t.querySelector(`#session-group-defaults-mode-trigger`)?.focus({preventScroll:!0}))},P=()=>{g=!0,y.navigate(l||void 0)};function F(){let n=l.trim(),i=n?b(n):t(`sessionsView.groupDefaultsCwdPlaceholder`),s=f===`checking`?`checking`:f===`git`?`git`:`local`,p=[{value:`local`,label:t(`sessionsView.groupDefaultsLocal`),description:t(`newSession.checkoutCurrentNote`),icon:u.monitor},{value:`worktree`,label:t(`sessionsView.groupDefaultsWorktree`),description:t(`sessionsView.groupDefaultsWorktreeHint`),icon:u.gitBranch}],S=p[+!!d];r(()=>a`
          <testclaw-modal-dialog
            label=${t(`sessionsView.groupDefaultsTitle`,{group:e.group})}
            @modal-cancel=${e=>{if(m){e.preventDefault();return}x()}}
          >
            <form class="exec-approval-card session-group-defaults" @submit=${C}>
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">
                    ${t(`sessionsView.groupDefaultsTitle`,{group:e.group})}
                  </div>
                  <div class="exec-approval-sub">${t(`sessionsView.groupDefaultsDescription`)}</div>
                </div>
              </div>
              <div class="session-group-defaults__fields">
                <div class="field">
                  <span>${t(`sessionsView.groupDefaultsCwd`)}</span>
                  <button
                    id="session-group-defaults-folder-trigger"
                    type="button"
                    class="new-session-page__trigger session-group-defaults__folder"
                    aria-label="${t(`sessionsView.groupDefaultsCwd`)}: ${i}"
                    aria-haspopup="dialog"
                    ?disabled=${m}
                  >
                    <span class="new-session-page__target-icon" aria-hidden="true"
                      >${u.folder}</span
                    >
                    <span class="session-group-defaults__folder-copy">
                      <strong>${i}</strong>
                      <small title=${n||o}
                        >${n||t(`sessionsView.groupDefaultsCwdHint`)}</small
                      >
                    </span>
                    <span class="new-session-page__trigger-chevron" aria-hidden="true"
                      >${u.chevronDown}</span
                    >
                  </button>
                  <wa-popover
                    ${c(v)}
                    class="new-session-page__select new-session-page__project-popover new-session-page__picker-popover session-group-defaults__folder-popover"
                    for="session-group-defaults-folder-trigger"
                    placement="bottom-start"
                    without-arrow
                    @wa-hide=${D}
                  >
                    ${g?w({browser:y,id:`session-group-defaults-browser`,label:t(`newSession.gateway`),registerProjectPath:null,registeringProject:!1,onBack:D,onRegisterProject:()=>void 0,onClose:D,onApplyFolder:k}):a`
                            <div class="new-session-page__picker-root">
                              ${E({value:`agent-workspace`,label:t(`sessionsView.groupDefaultsCwdPlaceholder`),icon:u.folder,checked:!n,onSelect:()=>k(``)},m)}
                              <button
                                type="button"
                                class="session-menu__item"
                                data-value="browse"
                                aria-pressed="false"
                                ?disabled=${m}
                                @click=${P}
                              >
                                <span class="session-menu__check" aria-hidden="true"></span>
                                <span class="session-menu__text">${t(`newSession.browse`)}</span>
                                <span class="new-session-page__menu-chevron" aria-hidden="true"
                                  >${u.chevronRight}</span
                                >
                              </button>
                            </div>
                          `}
                  </wa-popover>
                </div>
                <div class="field">
                  <span>${t(`sessionsView.groupDefaultsMode`)}</span>
                  <div
                    class="session-group-defaults__environment"
                    data-session-group-environment=${s}
                    aria-live="polite"
                  >
                    ${f===`git`?a`
                            <wa-dropdown
                              class="session-group-defaults__mode-dropdown"
                              placement="bottom-start"
                              aria-label=${t(`sessionsView.groupDefaultsMode`)}
                              @wa-select=${M}
                              @keydown=${N}
                            >
                              <button
                                id="session-group-defaults-mode-trigger"
                                slot="trigger"
                                type="button"
                                class="session-group-defaults__resolved-mode session-group-defaults__mode-trigger"
                                data-value=${S.value}
                                aria-label=${`${t(`sessionsView.groupDefaultsMode`)}: ${S.label}`}
                                ?disabled=${m}
                              >
                                <span class="new-session-page__target-icon" aria-hidden="true"
                                  >${S.icon}</span
                                >
                                <span class="session-group-defaults__resolved-copy">
                                  <strong>${S.label}</strong>
                                  <small>${S.description}</small>
                                </span>
                                <span class="new-session-page__trigger-chevron" aria-hidden="true"
                                  >${u.chevronDown}</span
                                >
                              </button>
                              ${p.map(e=>{let t=e===S;return a`
                                  <wa-dropdown-item
                                    class="session-group-defaults__mode-option"
                                    data-environment-mode=${e.value}
                                    ?data-selected=${t}
                                    aria-label=${`${e.label}, ${e.description}`}
                                    value=${e.value}
                                    type="checkbox"
                                    .checked=${t}
                                    ?disabled=${m}
                                    ?autofocus=${t&&!m}
                                    ${c(e=>_(e,t))}
                                  >
                                    <span
                                      slot="icon"
                                      class="new-session-page__target-icon session-group-defaults__mode-option-icon"
                                      aria-hidden="true"
                                      >${e.icon}</span
                                    >
                                    <span class="session-group-defaults__resolved-copy">
                                      <strong>${e.label}</strong>
                                      <small>${e.description}</small>
                                    </span>
                                  </wa-dropdown-item>
                                `})}
                            </wa-dropdown>
                          `:a`
                            <div
                              class="session-group-defaults__resolved-mode"
                              role=${f===`checking`?`status`:o}
                            >
                              <span class="new-session-page__target-icon" aria-hidden="true"
                                >${f===`checking`?u.gitBranch:u.monitor}</span
                              >
                              <span class="session-group-defaults__resolved-copy">
                                <strong
                                  >${t(f===`checking`?`newSession.checkingGit`:`sessionsView.groupDefaultsLocal`)}</strong
                                >
                                ${f===`checking`?o:a`<small
                                        >${t(f===`unavailable`?`newSession.gitCheckUnavailable`:`newSession.checkoutCurrentNote`)}</small
                                      >`}
                              </span>
                            </div>
                          `}
                  </div>
                </div>
              </div>
              ${h?a`<div class="exec-approval-error" role="alert">${h}</div>`:o}
              <div class="exec-approval-actions">
                <button
                  type="submit"
                  class="btn primary"
                  ?disabled=${m||f===`checking`||f===`unavailable`}
                >
                  ${t(`common.save`)}
                </button>
                ${f===`unavailable`?a`
                        <button
                          type="button"
                          class="btn"
                          ?disabled=${m}
                          @click=${()=>void A(l.trim()===e.defaults.cwd.trim())}
                        >
                          ${t(`common.retry`)}
                        </button>
                      `:o}
                <button type="button" class="btn" ?disabled=${m} @click=${x}>
                  ${t(`common.cancel`)}
                </button>
              </div>
            </form>
          </testclaw-modal-dialog>
        `)}A(!0)}))}var O;function k(){return(k=e((()=>{s(),l(),r(),m(),n(),T(),x(),C(),d(),f(),y(),g(),h(),O=!1})))()}k();export{D as showSessionGroupDefaultsDialog};
//# sourceMappingURL=session-group-defaults-dialog-DqcPto5V.js.map