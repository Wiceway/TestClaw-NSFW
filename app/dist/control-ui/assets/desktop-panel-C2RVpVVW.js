const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./rfb-CE2mbgHF.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$a as t,eo as n,qi as r,ti as i}from"./control-ui-foundation-CGMdhB5v.js";import{$l as a,Bs as o,Hi as s,Hl as c,Jl as l,Ms as u,Ns as ee,Qc as d,Rs as f,Vl as p,Xi as m,ac as h,au as g,ic as _,iu as v,qc as y,zs as b}from"./control-ui-core-S9jKXqB5.js";import{$ as x,X as S,Y as C,ct as w,mt as T,nt as te,tt as E,ut as D}from"./lit-runtime-DWoPVI38.js";import{D as ne,Fi as O,Ii as k,Jr as re,Li as A,O as ie,Ri as j,Vr as M,Xn as ae,Yn as oe,ai as se,oi as ce}from"./control-ui-core-G2U4O6rB.js";import{ca as le,sa as ue}from"./control-ui-boot-shared-ooxiG3qa.js";import{Qt as N,Zt as P}from"./control-ui-boot-shared-CCYBAAP9.js";import{i as de,n as fe}from"./control-ui-boot-shared-7DNogyqm.js";import{n as pe,t as me}from"./scrollbar-styles-ggixz3hE.js";import{n as he,t as ge}from"./dock-panel-styles-CkzyHu5_.js";import{n as _e}from"./gateway-websocket-url-cYJwVUmD.js";import{n as ve,t as ye}from"./desktop-focus-window-2g9SSvaH.js";var F,I;function L(){return(L=e((()=>{g(),F={desktop:{title:v.desktop.title,openWindow:v.desktop.openWindow,unavailable:v.desktop.unavailable,toggle:v.desktop.toggle,hide:`Hide desktop panel`,resize:`Resize desktop panel`,dockBottom:`Dock to bottom`,dockRight:`Dock to right`,enterFullscreen:`Enter fullscreen`,exitFullscreen:`Exit fullscreen`,fullscreenUnavailable:`Fullscreen is unavailable in this browser`,enterPictureInPicture:`Open desktop in Picture-in-Picture`,exitPictureInPicture:`Close Picture-in-Picture`,pictureInPictureTitle:`Desktop — view-only Picture-in-Picture`,pictureInPictureUnavailable:`Picture-in-Picture requires a supported browser and a secure connection`,pickerTitle:`Desktop sources`,thisMachine:`This machine`,refresh:`Refresh`,refreshing:`Refreshing…`,loading:`Loading desktop sources…`,empty:`No desktop-capable sources are available.`,sourceUnavailable:`The requested desktop is unavailable. Retry when the machine is ready.`,macLocked:`This Mac is locked. Sign in through Screen Sharing or on the Mac to use computer control.`,macLockStateUnknown:`This Mac’s lock state is unknown. Check the desktop before using computer control; Screen Sharing remains available for sign-in.`,connect:`Connect`,connecting:v.desktop.connecting,starting:`Starting your machine…`,preparing:`Preparing the desktop…`,takeControl:`Take control`,switchToViewOnly:`Switch to view only`,viewOnly:`View only`,control:`Control`,agentInputPaused:`You control this desktop. Agent input is paused until you switch to view only.`,keyboard:`Keyboard`,keyboardInput:`Remote desktop keyboard input`,touchControls:`Remote desktop controls`,fit:`Fit`,actual:`Actual`,match:`Match`,sizing:`Desktop size`,matchRequirement:`Match requires a VNC server that supports desktop resizing.`,fitScreen:`Fit screen`,actualSize:`Use actual size`,back:`Back`,disconnect:`Disconnect`,reconnect:v.desktop.reconnect,passwordPrompt:`Enter the VNC password for this machine.`,passwordLabel:`VNC password`,accountPrompt:`Enter a macOS account allowed in System Settings → General → Sharing. Remote Management also requires Observe/Control permissions.`,usernameLabel:`macOS username`,accountPasswordLabel:`macOS password`,controlTaken:`Another operator took control`,controlTakenBy:`{operator} took control`,disconnected:`Desktop disconnected: {reason}`,closeCode:`connection closed with code {code}`,unknownReason:`unknown reason`,errors:{pictureInPictureFailed:`Could not open or update Picture-in-Picture. Check browser permissions and try again from the desktop viewer.`,listFailed:`Could not load desktop sources: {error}`,fullscreenFailed:`Could not change fullscreen mode: {error}`,securityFailed:`Desktop security negotiation failed: {reason}`,connectionFailed:`Reconnect. If it fails again, check the browser console and desktop service logs.`}}},I=Object.assign(()=>Object.assign(v.desktop,F.desktop),{catalog:F})})))()}var R;function z(){return(z=e((()=>{o(),R=class{constructor(e,t){this.host=e,this.target=t,this.app=null,this.error=null,this.operationId=0}clear(){this.operationId+=1,this.app=null,this.error=null,this.host.requestUpdate()}async launch(e){let{client:t,source:n,presented:r,state:i,apps:a}=this.target();if(!t||!r||n?.kind!==`environment`||i!==`connecting`&&i!==`connected`||!a.includes(e)||this.app===e)return;let o=++this.operationId;this.app=e,this.error=null,this.host.requestUpdate();try{await t.request(`desktop.launch`,{source:n,app:e})}catch(e){if(o!==this.operationId)return;this.error=f(e)}o===this.operationId&&(this.app=null,this.host.requestUpdate())}}})))()}var B,V;function H(){return(H=e((()=>{u(),n(),B=async()=>(await t(()=>import(`./rfb-CE2mbgHF.js`),__vite__mapDeps([0]),import.meta.url)).default,V=class{constructor(e,t=e=>new WebSocket(e),n=B){this.rfbConstructor=e,this.createWebSocket=t,this.loadRfb=n}async connect(e){let t=this.rfbConstructor??await this.loadRfb(),n=_e(e.wsUrl,e.gatewayUrl);if(!e.isCurrent())throw new DOMException(`Desktop connection is no longer current`,`AbortError`);let r=this.createWebSocket(n),i;r.addEventListener(`close`,e=>{i={code:e.code,reason:e.reason}});let a=new t(e.target,r,e.credentials?{credentials:e.credentials}:void 0);a.background=e.background??getComputedStyle(e.target).backgroundColor,a.viewOnly=e.viewOnly,a.resizeSession=!1;let o=!1,s=!1,c=!0,l=!1,u=e.sizingMode??`fit`,d=t=>{e.target.querySelector(`canvas`)?.dispatchEvent(t)},f=(e,t=e.type)=>new KeyboardEvent(t,{key:e.key,code:e.code,location:e.location,ctrlKey:e.ctrlKey,shiftKey:e.shiftKey,altKey:e.altKey,metaKey:e.metaKey,repeat:e.repeat,isComposing:e.isComposing,bubbles:!0,cancelable:!0}),p=new Map,m=new Set,h=e=>{let t=e.code||e.key;!a.viewOnly&&!o&&t!==`Unidentified`&&!(t===`CapsLock`&&ee())&&p.set(t,e)},g=e=>p.delete(e.code||e.key),_=()=>p.clear(),v=()=>{for(let e of p.values())d(f(e,`keyup`));p.clear()},y=e=>m.add(e.pointerId),b=e=>m.delete(e.pointerId);e.target.addEventListener(`keydown`,h,!0),e.target.addEventListener(`keyup`,g,!0),e.target.addEventListener(`pointerdown`,y,!0),window.addEventListener(`pointerup`,b,!0),window.addEventListener(`pointercancel`,b,!0),window.addEventListener(`blur`,_);let x=()=>{e.target.removeEventListener(`keydown`,h,!0),e.target.removeEventListener(`keyup`,g,!0),e.target.removeEventListener(`pointerdown`,y,!0),window.removeEventListener(`pointerup`,b,!0),window.removeEventListener(`pointercancel`,b,!0),window.removeEventListener(`blur`,_),p.clear(),m.clear()},S=()=>{v(),s=!0,a.resizeSession=!1,a.viewOnly=!0},C=()=>{a.resizeSession=!1,!o&&e.isCurrent()&&(a.scaleViewport=u!==`actual`,a.resizeSession=c&&l&&!a.viewOnly&&e.canResize===!0&&u===`match`)};return C(),a.addEventListener(`connect`,()=>{if(o||!e.isCurrent()){S();return}l=!0,e.onConnect?.(),C()}),a.addEventListener(`disconnect`,t=>{o=!0,S(),x();let{clean:n}=t.detail;e.onDisconnect?.({...i,clean:n})}),a.addEventListener(`securityfailure`,t=>{S();let n=t.detail??{};e.onSecurityFailure?.(n)}),{disconnect:()=>{o||(o=!0,S(),x(),a.disconnect())},disableInput:S,setPresented:t=>(c=t,o||s||!e.isCurrent()||!c&&m.size>0?!1:(c||v(),a.resizeSession=!1,a.viewOnly=!c||e.viewOnly,C(),!0)),setSizingMode:e=>{u=e,C()},sendKeyboardEvent:e=>d(f(e)),sendText:e=>{let t=e.replace(/\r\n?/g,`
`);for(let e of t){if(e.length===2){a.sendKey(16777216|e.codePointAt(0),null);continue}d(new KeyboardEvent(`keydown`,{key:e===`
`?`Enter`:e,code:`Unidentified`,bubbles:!0,cancelable:!0}))}},sendBackspace:()=>a.sendKey(65288,`Backspace`)}}}})))()}var U,W;function G(){return(G=e((()=>{u(),U=`________________`,W=class{constructor(e){this.options=e,this.value=U,this.modifierConnection=null,this.modifiers=new Map,this.clearModifiers=()=>{this.modifiers.clear(),window.removeEventListener(`blur`,this.clearModifiers),window.removeEventListener(`keyup`,this.handleWindowKeyup,!0)},this.handleWindowKeyup=e=>{if(!e.isTrusted||e.composedPath()[0]===this.options.input())return;let t=this.currentConnection();t&&this.modifiers.delete(e.code)&&(this.modifiers.size===0&&this.clearModifiers(),t.sendKeyboardEvent(e))}}focus(e){let t=this.currentConnection();e&&t&&this.reconcileModifiers(e,t);let n=this.options.input();n?.focus({preventScroll:!0}),n?.setSelectionRange(n.value.length,n.value.length)}reset(e){e||(this.clearModifiers(),this.modifierConnection=null),this.value=U;let t=e??this.options.input();t&&(t.value=U)}handleKeyboardEvent(e){let t=this.currentConnection();t&&(e.type===`keydown`&&this.reconcileModifiers(e,t),!(!e.isComposing&&!e.altKey&&(ee()?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey)&&e.key.toLowerCase()===`v`)&&([`Meta`,`Control`,`Shift`,`Alt`].includes(e.key)&&(e.type===`keydown`?(this.modifiers.set(e.code,e),window.addEventListener(`blur`,this.clearModifiers,{once:!0}),window.addEventListener(`keyup`,this.handleWindowKeyup,!0)):(this.modifiers.delete(e.code),this.modifiers.size===0&&this.clearModifiers())),t.sendKeyboardEvent(e),e.preventDefault()))}handleInput(e){let t=e.currentTarget,n=this.currentConnection();if(!n){this.reset(t);return}let r=t.value,i=e.inputType===`insertFromPaste`?[...this.modifiers.values()]:[];for(let e of i)n.sendKeyboardEvent(new KeyboardEvent(`keyup`,e));let a=0;for(let e of this.value){if(!r.startsWith(e,a))break;a+=e.length}for(let e=Array.from(this.value.slice(a)).length;e>0;--e)n.sendBackspace();n.sendText(r.slice(a));for(let e of i)n.sendKeyboardEvent(e);if(r.length<1||r.length>32){this.reset(t);return}this.value=r}reconcileModifiers(e,t){if(e.isTrusted){for(let[n,r]of this.modifiers)e.getModifierState(r.key)||(this.modifiers.delete(n),t.sendKeyboardEvent(new KeyboardEvent(`keyup`,r)));this.modifiers.size===0&&this.clearModifiers()}}currentConnection(){let e=this.options.controlling()?this.options.connection():null;return e!==this.modifierConnection&&(this.clearModifiers(),this.modifierConnection=e),e}}})))()}function be(e,t){e.request(`desktop.release`,{wsPath:t}).catch(()=>void 0)}var K;function q(){return(q=e((()=>{K=class{constructor(){this.current=null,this.retained=null,this.connected=!1,this.hiddenTimer=null}get handle(){return this.connected?this.current:null}begin(e){this.clearHiddenTimer();let t=e?this.connected?this.current:this.retained:null,n=this.current,r=this.retained;this.current=null,this.retained=t,this.connected=!1;let i=this.abandonObservation;this.abandonObservation=void 0,i?.(),n!==t&&n?.disconnect(),r!==t&&r?.disconnect(),t?.disableInput()}setPresented(e,t){let n=this.hiddenTimer!==null;return this.clearHiddenTimer(),e?(n&&this.current?.setPresented(!0),!n):(this.handle?.setPresented(!1)?this.hiddenTimer=setTimeout(t,3e4):t(),!1)}clearHiddenTimer(){this.hiddenTimer!==null&&(clearTimeout(this.hiddenTimer),this.hiddenTimer=null)}attach(e){this.current=e}retainObservation(e){this.abandonObservation=e}setSizingMode(e){this.current?.setSizingMode(e)}markConnected(){this.abandonObservation=void 0,this.connected=!0;let e=this.retained;this.retained=null,e?.disconnect()}disconnect(){this.begin(!1)}}})))()}function xe(e,t){let n=e.get(`password`);if(typeof n!=`string`||n.length===0)return;let r=e.get(`username`);if(t!==`ard-account`||typeof r==`string`&&r.trim().length!==0)return{...typeof r==`string`&&r.trim()?{username:r.trim()}:{},password:n}}function Se(e,t,n){return e.kind!==`environment`&&n?.password&&(t===`vnc-password`||t===`ard-account`&&n.username)?n:void 0}function Ce(e,t){let n=e.preauthenticated?void 0:e.vncPassword?{password:e.vncPassword}:e.auth===`vnc-password`?t:void 0;return e.auth===`vnc-password`&&e.preauthenticated!==!0&&!n?.password?{phase:`credentials`,auth:`vnc-password`,credentials:n}:{phase:`ready`,auth:e.auth===`ard-account`?`ard-account`:void 0,credentials:n}}function we(e){if(!e||typeof e!=`object`||!(`details`in e))return null;let t=e.details;if(!t||typeof t!=`object`||!(`code`in t)||t.code!==J)return null;let n=`auth`in t?t.auth:void 0;return n===`vnc-password`||n===`ard-account`?n:null}var J;function Te(){return(Te=e((()=>{J=`DESKTOP_CREDENTIALS_REQUIRED`})))()}var Ee;function De(){return(De=e((()=>{C(),k(),Ee=class{constructor(e,t){this.host=e,this.options=t,this.active=!1,this.errorText=null,this.restoreFocus=!1,this.onFullscreenChange=()=>this.handleFullscreenChange(),e.addController(this)}hostConnected(){document.addEventListener(`fullscreenchange`,this.onFullscreenChange)}hostDisconnected(){document.removeEventListener(`fullscreenchange`,this.onFullscreenChange),this.restoreFocus=!1,this.fullscreenElement()===this.options.section()&&document.exitFullscreen().catch(()=>{})}renderButton(){let e=this.supported(),t=this.active?this.options.exitLabel():e?this.options.enterLabel():this.options.unavailableLabel();return x`<testclaw-tooltip .content=${t}>
      <button
        class=${this.options.buttonClass}
        type="button"
        aria-label=${t}
        aria-pressed=${this.active?`true`:`false`}
        aria-disabled=${e?`false`:`true`}
        @click=${()=>void this.toggle()}
      >
        <span class=${this.options.iconClass} aria-hidden="true">
          ${this.active?O.minimize:O.maximize}
        </span>
      </button>
    </testclaw-tooltip>`}async exit(){if(this.active)try{await document.exitFullscreen()}catch(e){this.setError(this.options.errorMessage(e))}}fullscreenElement(){return(this.host.renderRoot instanceof ShadowRoot?this.host.renderRoot.fullscreenElement:null)??document.fullscreenElement}supported(){return document.fullscreenEnabled&&typeof Element.prototype.requestFullscreen==`function`}handleFullscreenChange(){let e=this.active;this.active=this.fullscreenElement()===this.options.section(),this.options.onChange(),this.host.requestUpdate(),e&&!this.active&&this.restoreFocus&&this.host.updateComplete.then(()=>{this.host.renderRoot.querySelector(this.options.buttonSelector)?.focus(),this.restoreFocus=!1})}async toggle(){if(this.setError(null),this.active){await this.exit();return}let e=this.options.section();if(!e||!this.supported()){this.setError(this.options.unavailableLabel());return}this.restoreFocus=!0;try{await e.requestFullscreen()}catch(e){this.restoreFocus=!1,this.setError(this.options.errorMessage(e))}}setError(e){this.errorText=e,e&&this.options.onError?.(e),this.host.requestUpdate()}}})))()}var Oe;function ke(){return(ke=e((()=>{l(),L(),o(),De(),I(),Oe=class extends Ee{constructor(e,t){super(e,{...t,buttonClass:`bp-icon desktop-fullscreen-button`,buttonSelector:`.desktop-fullscreen-button`,iconClass:`desktop-fullscreen-icon`,enterLabel:()=>a(`desktop.enterFullscreen`),exitLabel:()=>a(`desktop.exitFullscreen`),unavailableLabel:()=>a(`desktop.fullscreenUnavailable`),errorMessage:e=>a(`desktop.errors.fullscreenFailed`,{error:f(e)})})}}})))()}function Ae(e){return x`
    <div class="desktop-status">
      ${e.inventoryError?S:x`<div>
              ${a(`desktop.disconnected`,{reason:e.reason??a(`desktop.unknownReason`)})}
            </div>`}
      <button class="desktop-button desktop-button--primary" type="button" @click=${e.onRetry}>
        ${a(e.inventoryError?`common.retry`:`desktop.reconnect`)}
      </button>
    </div>
  `}function je(){return(je=e((()=>{C(),l(),L(),I()})))()}var Me;function Ne(){return(Ne=e((()=>{C(),Me=T`
  /* The inset sizes this to the viewport on its own. Do not reintroduce viewport
     height units: Android WebView hosts the Control UI in a container that
     resolves dvh/vh/svh/lvh to 0, which collapses the viewer to a blank page. */
  .desktop-document {
    position: fixed;
    inset: 0;
    display: flex;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--bg);
  }
  .desktop-document .desktop-content {
    width: 100%;
  }
  .desktop-document .desktop-stage {
    width: 100%;
  }
  .desktop-touch-toolbar {
    position: absolute;
    z-index: 3;
    right: 12px;
    bottom: max(12px, env(safe-area-inset-bottom));
    left: 12px;
    display: flex;
    width: max-content;
    max-width: calc(100% - 24px);
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 0 auto;
    padding: 5px;
    border: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--bg) 84%, transparent);
    box-shadow: 0 8px 28px rgb(0 0 0 / 35%);
    backdrop-filter: blur(16px);
  }
  .desktop-touch-action {
    display: inline-flex;
    min-width: 48px;
    height: 44px;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 0;
    border-radius: 10px;
    padding: 0 9px;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 11px;
  }
  .desktop-touch-action[aria-pressed="true"] {
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 16%, transparent);
  }
  .desktop-touch-action:focus-visible {
    outline: 2px solid var(--focus, var(--accent));
    outline-offset: 1px;
  }
  .desktop-touch-action__icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
  }
  .desktop-touch-action__icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.8;
  }
  .desktop-keyboard-input {
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 1px;
    height: 1px;
    border: 0;
    padding: 0;
    opacity: 0;
    pointer-events: none;
  }
  @media (max-width: 430px) {
    .desktop-touch-action {
      min-width: 44px;
      padding: 0 7px;
    }
    .desktop-touch-action__label {
      display: none;
    }
  }
`})))()}var Pe;function Fe(){return(Fe=e((()=>{C(),Pe=T`
  .desktop-apps {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 3px;
  }
  .desktop-app-button,
  .desktop-toolbar-action,
  .desktop-toolbar-mode {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 0;
    border-radius: 4px;
    padding: 5px 7px;
    background: transparent;
    color: var(--muted);
    font: inherit;
    font-size: 12px;
    white-space: nowrap;
  }
  .desktop-app-button {
    color: var(--text);
  }
  .desktop-app-button:hover:not(:disabled),
  .desktop-toolbar-action:hover:not(:disabled) {
    background: color-mix(in srgb, var(--text) 8%, transparent);
    color: var(--text);
  }
  .desktop-app-button:focus-visible,
  .desktop-toolbar-action:focus-visible {
    outline: 2px solid var(--focus, var(--accent));
    outline-offset: 1px;
  }
  .desktop-app-button:disabled,
  .desktop-toolbar-action:disabled {
    cursor: default;
    opacity: 0.55;
  }
  .desktop-app-button__icon {
    display: inline-flex;
    width: 15px;
    height: 15px;
  }
  .desktop-app-button__icon svg {
    width: 100%;
    height: 100%;
    stroke-width: 1.75;
  }
  .desktop-app-button__icon--launching {
    animation: desktop-app-launch 900ms linear infinite;
  }
  @keyframes desktop-app-launch {
    50% {
      opacity: 0.6;
      transform: rotate(180deg) scale(0.92);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .desktop-app-button__icon--launching {
      animation: none;
    }
  }
`})))()}var Ie,Le;function Re(){return(Re=e((()=>{C(),me(),he(),Ne(),Fe(),Ie=T`
  .bp--embedded {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .bp--bottom {
    left: var(--shell-nav-width, 0);
    right: calc(var(--oc-terminal-reserve-right, 0px) + var(--oc-browser-reserve-right, 0px));
    bottom: calc(var(--oc-terminal-reserve-bottom, 0px) + var(--oc-browser-reserve-bottom, 0px));
  }
  .bp--right {
    top: var(--shell-topbar-height, 0);
    right: calc(var(--oc-terminal-reserve-right, 0px) + var(--oc-browser-reserve-right, 0px));
    bottom: calc(var(--oc-terminal-reserve-bottom, 0px) + var(--oc-browser-reserve-bottom, 0px));
  }
  .bp-title {
    min-width: 0;
  }
  .bp-icon[aria-disabled="true"] {
    opacity: 0.4;
  }
  .desktop-toolbar-action > svg {
    width: 15px;
    height: 15px;
  }
  .desktop-fullscreen-icon > svg {
    width: 15px;
    height: 15px;
  }
  .bp:fullscreen {
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .desktop-content {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
  }
  .desktop-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border, #262b34);
  }
  .desktop-toolbar--connection {
    flex-wrap: wrap;
    min-height: 42px;
    gap: 12px;
  }
  .desktop-toolbar__spacer {
    flex: 1;
  }
  .desktop-sizing {
    width: 88px;
    height: 32px;
    flex: 0 0 auto;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0 6px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 12px;
  }
  .desktop-touch-toolbar .desktop-sizing {
    height: 44px;
  }
  .desktop-button {
    border: 1px solid var(--border, #262b34);
    border-radius: 6px;
    padding: 5px 10px;
    background: transparent;
    color: var(--text, #d7dae0);
    font: inherit;
    font-size: 12px;
  }
  .desktop-button:hover:not(:disabled) {
    background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
  }
  .desktop-button--primary {
    border-color: var(--accent, #ff5c5c);
    color: var(--accent, #ff5c5c);
  }
  .desktop-button:disabled,
  .desktop-touch-action:disabled {
    opacity: 0.5;
  }
  .desktop-session {
    overflow: hidden;
    max-width: 100%;
    color: var(--muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .desktop-note {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border, #262b34);
    color: var(--muted, #8a919e);
    font-size: 12px;
  }
  .desktop-note--error {
    color: var(--danger, #ff6b6b);
  }
  .desktop-picker,
  .desktop-status {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
    padding: 14px;
    background: var(--panel);
  }
  .desktop-status {
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--muted, #8a919e);
  }
  .desktop-credentials {
    display: flex;
    width: min(320px, 100%);
    flex-direction: column;
    gap: 10px;
    text-align: left;
  }
  .desktop-credentials__label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: var(--text, #d7dae0);
    font-size: 12px;
  }
  .desktop-credentials__input {
    border: 1px solid var(--border, #262b34);
    border-radius: 6px;
    padding: 7px 9px;
    background: var(--bg, #111318);
    color: var(--text, #d7dae0);
    font: inherit;
  }
  .desktop-environment {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border: 1px solid var(--border, #262b34);
    border-radius: 8px;
  }
  .desktop-environment__details {
    display: flex;
    flex: 1;
    min-width: 0;
    flex-direction: column;
    gap: 5px;
  }
  .desktop-environment__id {
    overflow: hidden;
    color: var(--text, #d7dae0);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .desktop-environment__meta,
  .desktop-environment__sessions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 5px;
    color: var(--muted, #8a919e);
    font-size: 11px;
  }
  .desktop-stage {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: var(--bg);
  }
  .desktop-surface {
    position: absolute;
    inset: 0;
    background: var(--bg);
  }
  /* View-only affordance: clicking anywhere on the desktop takes control. */
  .desktop-stage__take-control {
    position: absolute;
    inset: 0;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: var(--cursor-action, pointer);
  }
  .desktop-stage__take-control:focus-visible {
    outline: 2px solid var(--accent, #ff5c5c);
    outline-offset: -2px;
  }
`,Le=[ge,Pe,Ie,Me,pe]})))()}function ze(e){return a(e===`browser`?`browser.title`:`terminal.title`)}function Be(e){return e===`browser`?O.chrome:O.terminal}function Ve(){return(Ve=e((()=>{l(),k()})))()}async function He(e,t){if(t===null)return[];if(t!==void 0)try{return[await e.request(`environments.status`,{environmentId:t})]}catch(e){if(e instanceof oe&&e.code===`INVALID_REQUEST`&&e.message===`unknown environmentId`)return[];throw e}return(await e.request(`environments.list`,{})).environments}async function Ue(e,t){let n=await t.target;if(!t.isCurrent())return;let r=await He(e,n);if(!t.isCurrent())return;let i=r.find(e=>e.id===n);if(i?.status===`starting`)return{environments:[i],selectedSource:void 0,pendingSource:i.id};if(i?.status===`error`||!t.recoverToPicker&&i&&i.status!==`available`)throw Error(i.worker?.error??`Desktop environment is unavailable`);if(!(t.recoverToPicker&&n!==void 0&&!r.some(e=>e.id===n&&e.desktop)&&(r=await He(e,void 0),!t.isCurrent())))return{selectedSource:r.find(e=>e.id===n&&e.status===`available`&&e.desktop===!0)?.id,environments:r.filter(e=>e.desktop===!0)}}function Y(e){return e.id===`gateway`?{kind:`host`}:e.id.startsWith(`node:`)&&e.id.length>5?{kind:`node`,nodeId:e.id.slice(5)}:{kind:`environment`,environmentId:e.id}}function X(){return(X=e((()=>{ae()})))()}function We(e){let t=Xe({...e.connection,state:e.content.state,presentationControls:e.workspaceControls?x`<button
            class="desktop-toolbar-action"
            type="button"
            title=${a(`desktop.openWindow`)}
            aria-label=${a(`desktop.openWindow`)}
            @click=${e.onOpenWindow}
          >
            ${O.externalLink}</button
          >${e.renderFullscreenControl()}`:S}),n=e.embedded||e.fullscreen?``:e.dock===`bottom`?`height:${e.height}px`:`width:${e.width}px`;return x`
    <section
      class="bp bp--${e.embedded?`embedded`:e.dock}"
      style=${n}
      aria-label=${a(`desktop.title`)}
    >
      ${e.embedded?S:e.renderResizer()}
      ${e.embedded?S:Ke({dock:e.dock,fullscreenControl:e.renderFullscreenControl(),onDock:e.onDock,onOpenWindow:e.onOpenWindow,onClose:e.onClose})}
      ${Ge({...e.content,connection:t})}
    </section>
  `}function Ge(e){return x`
    <div class="desktop-content">
      ${e.notice}
      ${e.state===`picker`?e.picker:e.state===`inventory-error`||e.state===`disconnected`?e.recovery:e.state===`credentials`?e.credentials:e.connection}
    </div>
  `}function Ke(e){return x`
    <header class="rail-header bp-header">
      <div class="rail-header__title bp-title">${a(`desktop.title`)}</div>
      <div class="rail-header__actions bp-actions">
        <button
          class="rail-header__action bp-icon ${e.dock===`bottom`?`is-active`:``}"
          type="button"
          title=${a(`desktop.dockBottom`)}
          aria-label=${a(`desktop.dockBottom`)}
          @click=${()=>e.onDock(`bottom`)}
        >
          ${O.panelBottomOpen}
        </button>
        <button
          class="rail-header__action bp-icon ${e.dock===`right`?`is-active`:``}"
          type="button"
          title=${a(`desktop.dockRight`)}
          aria-label=${a(`desktop.dockRight`)}
          @click=${()=>e.onDock(`right`)}
        >
          ${O.panelRightOpen}
        </button>
        <button
          class="rail-header__action bp-icon bp-open-window"
          type="button"
          title=${a(`desktop.openWindow`)}
          aria-label=${a(`desktop.openWindow`)}
          @click=${e.onOpenWindow}
        >
          ${O.externalLink}
        </button>
        ${e.fullscreenControl}
        <button
          class="rail-header__action bp-icon"
          type="button"
          title=${a(`desktop.hide`)}
          aria-label=${a(`desktop.hide`)}
          @click=${e.onClose}
        >
          ${O.x}
        </button>
      </div>
    </header>
  `}function qe(e){return e.automatic?x`<div class="desktop-status" role="status">
      <button class="desktop-button" type="button" @click=${e.onRefresh}>
        ${a(`common.retry`)}
      </button>
    </div>`:x`
    <div class="desktop-toolbar">
      <span>${a(`desktop.pickerTitle`)}</span>
      <span class="desktop-toolbar__spacer"></span>
      <button
        class="desktop-button"
        type="button"
        ?disabled=${e.loading}
        @click=${e.onRefresh}
      >
        ${e.loading?a(`desktop.refreshing`):a(`desktop.refresh`)}
      </button>
    </div>
    <div class="desktop-picker">
      ${e.loading&&e.environments.length===0?N(`desktop`,a(`desktop.loading`)):e.environments.length===0?x`<div class="desktop-status">${a(`desktop.empty`)}</div>`:e.environments.map(t=>Je(t,e.onConnect))}
    </div>
  `}function Je(e,t){let n=e.worker,r=Y(e);return x`
    <div class="desktop-environment">
      <div class="desktop-environment__details">
        <div class="desktop-environment__id">
          ${r.kind===`host`?a(`desktop.thisMachine`):e.id}
        </div>
        <div class="desktop-environment__meta">
          <span>${n?.state??e.status}</span>
        </div>
        ${n&&n.attachedSessionIds.length>0?x`<div class="desktop-environment__sessions">
                ${n.attachedSessionIds.map(e=>x`<span class="desktop-session">${e}</span>`)}
              </div>`:S}
      </div>
      <button
        class="desktop-button desktop-button--primary"
        type="button"
        @click=${()=>t(e.id)}
      >
        ${a(`desktop.connect`)}
      </button>
    </div>
  `}function Ye(e){return x`
    <div class="desktop-status">
      <form class="desktop-credentials" @submit=${e.onSubmit}>
        <div>${a(e.ardAccount?`desktop.accountPrompt`:`desktop.passwordPrompt`)}</div>
        ${e.ardAccount?x`<label class="desktop-credentials__label">
                ${a(`desktop.usernameLabel`)}
                <input
                  class="desktop-credentials__input"
                  name="username"
                  type="text"
                  autocomplete="off"
                  .value=${e.username}
                  required
                />
              </label>`:S}
        <label class="desktop-credentials__label">
          ${a(e.ardAccount?`desktop.accountPasswordLabel`:`desktop.passwordLabel`)}
          <input
            class="desktop-credentials__input"
            name="password"
            type="password"
            autocomplete="off"
            required
          />
        </label>
        <button class="desktop-button desktop-button--primary" type="submit">
          ${a(`desktop.connect`)}
        </button>
      </form>
    </div>
  `}function Xe(e){return x`
    <div class="desktop-toolbar desktop-toolbar--connection">
      ${e.showApps&&e.desktopApps.length>0?x`<div class="desktop-apps">
              ${e.desktopApps.map(t=>{let n=e.launchingApp===t,r=ze(t);return x`<button
                  class="desktop-app-button"
                  type="button"
                  title=${r}
                  aria-label=${r}
                  aria-busy=${n?`true`:`false`}
                  ?disabled=${!e.environmentSelected||n}
                  @click=${()=>e.onLaunch(t)}
                >
                  <span
                    class="desktop-app-button__icon ${n?`desktop-app-button__icon--launching`:``}"
                    aria-hidden="true"
                  >
                    ${Be(t)}
                  </span>
                  <span>${r}</span>
                </button>`})}
            </div>`:S}
      <span class="desktop-toolbar__spacer"></span>
      ${e.controlling?x`<button
              class="desktop-toolbar-action"
              type="button"
              aria-label=${a(`desktop.switchToViewOnly`)}
              ?disabled=${e.state!==`connected`}
              @click=${e.onControlToggle}
            >
              ${a(`desktop.control`)}
            </button>`:e.state===`connected`?x`<span class="desktop-toolbar-mode" role="status">${a(`desktop.viewOnly`)}</span>`:S}
      ${Ze(e.sizing)} ${e.pictureInPictureControl}
      ${e.presentationControls??S}
      <button
        class="desktop-toolbar-action"
        type="button"
        title=${a(`desktop.disconnect`)}
        aria-label=${a(`desktop.disconnect`)}
        @click=${e.onDisconnect}
      >
        ${a(`desktop.disconnect`)}
      </button>
    </div>
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.controlling?S:x`<button
              class="desktop-stage__take-control"
              type="button"
              title=${a(`desktop.takeControl`)}
              aria-label=${a(`desktop.takeControl`)}
              ?disabled=${e.state!==`connected`}
              @click=${e.onTakeControl}
            ></button>`}
      ${e.state===`connecting`?N(`desktop`,a(`desktop.connecting`),!1,!0):S}
    </div>
  `}function Ze(e){return x`
    <select
      class="desktop-sizing"
      aria-label=${a(`desktop.sizing`)}
      title=${a(`desktop.matchRequirement`)}
      @change=${t=>{if(!(t.currentTarget instanceof HTMLSelectElement))return;let n=t.currentTarget.value;(n===`fit`||n===`actual`||n===`match`&&e.canResize)&&e.onChange(n)}}
    >
      <option value="fit" .selected=${e.mode===`fit`}>${a(`desktop.fit`)}</option>
      <option value="actual" .selected=${e.mode===`actual`}>${a(`desktop.actual`)}</option>
      ${e.canResize||e.mode===`match`?x`<option
              value="match"
              .selected=${e.mode===`match`}
              ?disabled=${!e.canResize}
            >
              ${a(`desktop.match`)}
            </option>`:S}
    </select>
  `}function Qe(e,t,n){let r=e?x`<div class="desktop-note desktop-note--error" role="alert">${e}</div>`:t?x`<div class="desktop-note" role="status">${t}</div>`:S,i=n?.state===`locked`?a(`desktop.macLocked`):n?.state===`unknown`?a(`desktop.macLockStateUnknown`):null;return x`${r}${i?x`<div class="desktop-note" role="status">${i}</div>`:S}`}function Z(){return(Z=e((()=>{C(),l(),L(),k(),P(),Ve(),X(),I()})))()}var $e,et;function tt(){return(tt=e((()=>{C(),l(),L(),A(),Z(),I(),$e=j(E`<rect x="2" y="3" width="20" height="18" rx="2" />
  <rect x="12" y="11" width="7" height="7" rx="1" />`),et=class{constructor(e,t){this.host=e,this.state=t,this.errorText=null,this.popup=null,this.pending=!1,this.generation=0,this.stopMirror=null,e.addController(this)}hostDisconnected(){this.close()}get opener(){return this.host.ownerDocument.defaultView}source(){return this.host.available&&this.state()===`connected`&&(!this.host.embedded||this.host.presented)?this.host.renderRoot.querySelector(`.desktop-surface canvas`):null}renderNotice(...[e,t,n]){return Qe(this.errorText??e,t,n)}renderButton(){let e=this.state()===`connected`,t=this.host.documentMode?`desktop-touch-action`:`desktop-toolbar-action`,n=this.opener?.isSecureContext===!0&&typeof this.opener.documentPictureInPicture?.requestWindow==`function`,r=this.popup?a(`desktop.exitPictureInPicture`):a(n?`desktop.enterPictureInPicture`:`desktop.pictureInPictureUnavailable`);return x`<button
      class=${t+` desktop-picture-in-picture-button`}
      type="button"
      title=${r}
      aria-label=${r}
      aria-pressed=${this.popup?`true`:`false`}
      aria-busy=${this.pending?`true`:`false`}
      ?disabled=${!n||!e||this.pending}
      @click=${()=>void this.toggle()}
    >
      ${$e}
    </button>`}close(){++this.generation,this.stopMirror?.(),this.stopMirror=null;let e=this.popup;this.popup=null,e?.close(),this.errorText=null,this.host.requestUpdate()}async toggle(){if(this.popup){this.close();return}let e=this.opener,t=e?.documentPictureInPicture,n=this.source();if(this.pending||!e?.isSecureContext||!t||!n||!this.host.isConnected)return;let r=++this.generation;this.pending=!0,this.errorText=null,this.host.requestUpdate();let i=null;try{if(i=await t.requestWindow({width:640,height:400}),i.closed||r!==this.generation||!this.host.isConnected||this.source()!==n){i.close();return}this.popup=i,this.startMirror(i,n)}catch{i?.close(),r===this.generation&&(this.close(),this.errorText=a(`desktop.errors.pictureInPictureFailed`))}finally{this.pending=!1,this.host.requestUpdate()}}startMirror(e,t){let n=e.document;n.title=a(`desktop.pictureInPictureTitle`),n.documentElement.lang=this.host.ownerDocument.documentElement.lang;let r=n.createElement(`canvas`);r.setAttribute(`role`,`img`),r.setAttribute(`aria-label`,a(`desktop.pictureInPictureTitle`)),r.style.cssText=`display:block;width:100%;height:100%;object-fit:contain;pointer-events:none`,n.body.style.cssText=`margin:0;height:100vh;background:Canvas;color:CanvasText;overflow:hidden`,n.body.replaceChildren(r);let i=r.getContext(`2d`);if(!i)throw Error(`Picture-in-Picture canvas is unavailable`);let o=0,s=-1/0,c=()=>{this.popup===e&&this.close()};e.addEventListener(`pagehide`,c,{once:!0}),this.stopMirror=()=>{e.cancelAnimationFrame(o),e.removeEventListener(`pagehide`,c),r.remove()};let l=n=>{if(this.popup===e){if(e.closed||this.source()!==t||!t.isConnected){this.close();return}try{if(n-s>=1e3/30&&t.width>0&&t.height>0){let a=Math.min(1,e.innerWidth*e.devicePixelRatio/t.width,e.innerHeight*e.devicePixelRatio/t.height),o=Math.max(1,Math.round(t.width*a)),c=Math.max(1,Math.round(t.height*a));(r.width!==o||r.height!==c)&&(r.width=o,r.height=c),i.drawImage(t,0,0,o,c),s=n}o=e.requestAnimationFrame(l)}catch{this.close(),this.errorText=a(`desktop.errors.pictureInPictureFailed`),this.host.requestUpdate()}}};o=e.requestAnimationFrame(l)}}})))()}function nt(e){let t=x`
    <div class="desktop-stage">
      <div class="desktop-surface"></div>
      ${e.state===`connecting`?N(`desktop`,a(`desktop.connecting`),!1,!0):S}
      <textarea
        class="desktop-keyboard-input"
        inputmode="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        tabindex="-1"
        aria-label=${a(`desktop.keyboardInput`)}
        ?disabled=${e.state!==`connected`||!e.controlling}
        .value=${e.keyboardInputValue}
        @keydown=${e.onKeyboardEvent}
        @keyup=${e.onKeyboardEvent}
        @input=${e.onKeyboardInput}
      ></textarea>
      <nav class="desktop-touch-toolbar" aria-label=${a(`desktop.touchControls`)}>
        ${e.pictureInPictureControl}
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${a(e.controlling?`desktop.switchToViewOnly`:`desktop.takeControl`)}
          aria-pressed=${e.controlling?`true`:`false`}
          ?disabled=${e.state!==`connected`}
          @click=${e.onControlToggle}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">
            ${e.controlling?O.hand:O.eye}
          </span>
          <span class="desktop-touch-action__label">
            ${a(e.controlling?`desktop.control`:`desktop.viewOnly`)}
          </span>
        </button>
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${a(`desktop.keyboard`)}
          ?disabled=${e.state!==`connected`||!e.controlling}
          @click=${e.onKeyboardFocus}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${rt}</span>
          <span class="desktop-touch-action__label">${a(`desktop.keyboard`)}</span>
        </button>
        ${Ze(e.sizing)}
        <button
          class="desktop-touch-action"
          type="button"
          aria-label=${a(`desktop.back`)}
          @click=${e.onClose}
        >
          <span class="desktop-touch-action__icon" aria-hidden="true">${O.arrowLeft}</span>
          <span class="desktop-touch-action__label">${a(`desktop.back`)}</span>
        </button>
      </nav>
    </div>
  `;return x`
    <section class="desktop-document" aria-label=${a(`desktop.title`)}>
      ${Ge({state:e.state,notice:e.notice,picker:e.picker,recovery:e.recovery,credentials:e.credentials,connection:t})}
    </section>
  `}var rt;function it(){return(it=e((()=>{C(),l(),L(),A(),k(),P(),Z(),I(),rt=j(E`
  <rect width="20" height="14" x="2" y="5" rx="2" />
  <path d="M6 9h.01" />
  <path d="M10 9h.01" />
  <path d="M14 9h.01" />
  <path d="M18 9h.01" />
  <path d="M6 13h.01" />
  <path d="M10 13h.01" />
  <path d="M14 13h.01" />
  <path d="M18 13h.01" />
  <path d="M8 17h8" />
`)})))()}function at(e){let t=e.startup?{...e.content,notice:x`${e.content.notice}${Qe(null,a(e.startup.worker?.state===`bootstrapping`?`desktop.preparing`:`desktop.starting`))}`}:e.content,n=e.focusTarget();return e.documentMode?nt({...t,controlling:e.controlling,sizing:e.sizing,keyboardInputValue:e.mobileKeyboard.value,pictureInPictureControl:e.pictureInPictureControl,onControlToggle:e.onControlToggle,onKeyboardFocus:t=>e.mobileKeyboard.focus(t),onKeyboardEvent:t=>e.mobileKeyboard.handleKeyboardEvent(t),onKeyboardInput:t=>e.mobileKeyboard.handleInput(t),onClose:e.onDocumentClose}):We({embedded:e.embedded,workspaceControls:e.workspaceControls,dock:e.dockLayout.dock,height:e.dockLayout.height,width:e.dockLayout.width,fullscreen:e.fullscreenMode.active,renderResizer:()=>e.dockLayout.renderResizer(`bp`,a(`desktop.resize`)),renderFullscreenControl:()=>e.fullscreenMode.renderButton(),onDock:t=>e.dockLayout.setDock(t),onOpenWindow:()=>{let t=e.focusTarget();ve(t.basePath,t.source,!t.workspaceControls&&t.control)},onClose:e.onClose,content:t,connection:{controlling:e.controlling,desktopApps:e.desktopApps,environmentSelected:n.source!==null,launchingApp:e.launchingApp,showApps:n.source!==null&&Y({id:n.source}).kind===`environment`,sizing:e.sizing,pictureInPictureControl:e.pictureInPictureControl,onLaunch:e.onLaunch,onTakeControl:e.onTakeControl,onControlToggle:e.onControlToggle,onDisconnect:e.onDisconnect}})}function ot(){return(ot=e((()=>{C(),l(),it(),ye(),Z(),X()})))()}async function st(e,t){let n=(await e.request(`sessions.describe`,{key:t})).session;return de(n??void 0)}var ct;function lt(){return(lt=e((()=>{s(),d(),le(),h(),fe(),X(),ct=class{constructor(e,t,n,i,a,o){this.host=e,this.currentTarget=t,this.onTargetChange=n,this.onInventoryChange=i,this.requestedAvailabilityTarget=a,this.onTargetError=o,this.refreshId=0,this.availabilityRequestId=0,this.desktopSource=null,this.availabilitySnapshot=null,this.startupPoll=new ue(e,2e3,()=>void this.refreshStartup(),!1),new _(e).effect(()=>e.available&&e.suppliedEnvironments===null?e.client:null,t=>t.addEventListener(n=>{if(!e.isConnected||!e.available||t!==e.client)return;if(n.event===`node.runnerInventory.changed`){let e=n.payload;r(e)&&typeof e.nodeId==`string`&&e.nodeId.length>0&&(this.availabilityTarget===`node:${e.nodeId}`?this.refreshDesktopAvailability(e.nodeId):this.onInventoryChange());return}if(n.event===`presence`||n.event===`node.pair.resolved`||n.event===`config.changed`){this.onInventoryChange();return}let i=e.documentMode&&e.sessionKey!==null&&e.requestedSource===null&&n.event===`sessions.changed`&&!(r(n.payload)&&n.payload.phase===`message`)?m(n.payload):null;if(i&&y(i.key,e.sessionKey)){let e=this.resolveTarget();e&&e.target.then(t=>{e.isCurrent()&&t!==void 0&&(t===null||t!==this.currentTarget())&&this.onTargetChange(t)}).catch(t=>{e.isCurrent()&&this.onTargetError(t)})}}))}invalidate(){this.refreshId+=1,this.stopStartup()?.resolve(void 0)}stopStartup(){this.startupPoll.stop();let e=this.startup;return this.startup=void 0,this.startupEnvironment&&(this.startupEnvironment=void 0,this.host.requestUpdate()),e}async refreshStartup(){let e=this.startup;if(e&&!e.busy){if(!e.isCurrent()){this.stopStartup()?.resolve(void 0);return}e.busy=!0;try{let t=await e.load();if(this.startup!==e)return;!e.isCurrent()||!t?.pendingSource?this.stopStartup()?.resolve(e.isCurrent()?t:void 0):(this.startupEnvironment=t.environments.find(e=>e.id===t.pendingSource),this.host.requestUpdate())}catch(t){this.startup===e&&this.stopStartup()?.reject(t)}finally{e.busy=!1}}}async waitForStartup(e,t){let n=await e();if(t())return n?.pendingSource?await new Promise((r,i)=>{this.startupEnvironment=n.environments.find(e=>e.id===n.pendingSource),this.host.requestUpdate(),this.startup={load:e,isCurrent:t,resolve:r,reject:i,busy:!1},this.startupPoll.start()}):n}loadInventory(e){this.invalidate();let t=this.host.client,n=e.automatic?this.resolveTarget(e.target):{target:Promise.resolve(e.target),isCurrent:()=>!0},r=()=>this.host.isConnected&&this.host.available&&t===this.host.client&&e.isCurrent()&&n?.isCurrent()===!0;return{isCurrent:r,result:t&&n?this.waitForStartup(()=>Ue(t,{target:n.target,isCurrent:r,recoverToPicker:this.host.documentMode&&!this.host.embedded}),r):Promise.resolve(void 0)}}setDesktopSource(e,t){let n=this.host.client,r=this.desktopSource;r&&(r.client!==n||e.kind!==`node`||r.nodeId!==e.nodeId)&&this.clearDesktopSource(),this.desktopSource=n&&e.kind===`node`?{client:n,nodeId:e.nodeId,availability:t}:null}clearDesktopSource(){this.desktopSource=null,this.availabilitySnapshot=null,this.availabilityRequestId+=1}get desktopAvailability(){let e=this.desktopSource;if(!e||e.client!==this.host.client)return;let t=this.availabilitySnapshot;return t?.client===e.client&&t.nodeId===e.nodeId?t.availability:e.availability}get availabilityTarget(){return this.desktopSource&&this.desktopSource.client!==this.host.client?null:this.requestedAvailabilityTarget()}async refreshDesktopAvailability(e){let{client:t}=this.host;if(!t)return;let n=`node:${e}`,r=++this.availabilityRequestId,i=()=>this.host.isConnected&&this.host.available&&t===this.host.client&&r===this.availabilityRequestId&&n===this.availabilityTarget;try{let r=await t.request(`environments.status`,{environmentId:n});if(!i())return;if(r.id!==n)throw Error(`Desktop status returned a different environment`);this.availabilitySnapshot={client:t,nodeId:e,availability:r.desktopAvailability},this.host.requestUpdate()}catch{i()&&this.desktopAvailability&&(this.availabilitySnapshot={client:t,nodeId:e,availability:{state:`unknown`}},this.host.requestUpdate())}}resolveTarget(e){let{client:t,sessionKey:n,requestedSource:r,documentMode:i}=this.host;if(!t)return;let a=++this.refreshId,o=()=>a===this.refreshId&&this.host.isConnected&&t===this.host.client&&n===this.host.sessionKey&&i===this.host.documentMode&&this.host.available&&r===this.host.requestedSource,s=r??e;return{target:s===void 0&&i&&n!==null?st(t,n):Promise.resolve(s??(n===null?void 0:null)),isCurrent:o}}}})))()}var Q;function $(){return($=e((()=>{C(),te(),l(),L(),o(),c(),ce(),re(),z(),H(),G(),q(),Te(),ke(),ie(),je(),Re(),Z(),tt(),ot(),lt(),X(),I(),Q=class extends p{constructor(...e){super(...e),this.client=null,this.available=!1,this.suppressed=!1,this.documentMode=!1,this.requestedSource=null,this.sessionKey=null,this.documentControl=!1,this.basePath=``,this.suppliedEnvironments=null,this.workspaceControls=!1,this.embedded=!1,this.presented=!1,this.refreshOnPresentation=!0,this.onDocumentClose=null,this.onFocusTargetChange=null,this.desktopClientFactory=()=>new V,this.environments=[],this.loading=!1,this.state=`picker`,this.environmentId=null,this.source=null,this.controlling=!1,this.errorText=null,this.noticeText=null,this.disconnectedReason=null,this.desktopApps=[],this.sizingMode=`fit`,this.canResize=!1,this.connection=new K,this.launcher=new R(this,()=>({client:this.client,source:this.source,presented:!this.embedded||this.presented,state:this.state,apps:this.desktopApps})),this.pictureInPicture=new et(this,()=>this.state),this.pendingConnection=null,this.operationId=0,this.controlTakeoverRecoveryUsed=!1,this.sourceSelection=`pending`,this.sessionSource=new ct(this,()=>this.environmentId,e=>{this.usesAutomaticSource&&(this.returnToPicker(`pending`),this.refreshEnvironments(void 0,e))},()=>{(this.state===`picker`||this.state===`inventory-error`&&this.usesAutomaticSource)&&!this.suppressed&&(this.embedded?this.presented:this.documentMode||this.dockLayout.open)&&this.refreshEnvironments()},()=>this.state===`picker`&&!this.loading||this.state===`inventory-error`?null:this.environmentId??(this.usesAutomaticSource?this.requestedSource:null),e=>{this.usesAutomaticSource&&(this.state===`picker`||this.state===`inventory-error`)&&(this.sessionSource.invalidate(),this.operationId+=1,this.loading=!1,this.errorText=a(`desktop.errors.listFailed`,{error:f(e)}),this.state=`inventory-error`)}),this.mobileKeyboard=new W({connection:()=>this.connection.handle,controlling:()=>this.controlling,input:()=>this.shadowRoot?.querySelector(`.desktop-keyboard-input`)}),this.dockLayout=new se(this,{layout:ne,reservationPrefix:`desktop`,isAvailable:()=>this.available,isFullscreen:()=>this.fullscreenMode.active}),this.fullscreenMode=new Oe(this,{section:()=>this.renderRoot.querySelector(`section.bp`),onChange:()=>this.dockLayout.syncReservation()}),this.onToggleRequest=e=>this.handleToggleRequest(e)}static{this.styles=Le}connectedCallback(){super.connectedCallback(),this.embedded||window.addEventListener(M,this.onToggleRequest),this.dockLayout.setSuppressed(this.suppressed),(this.documentMode&&this.hasUpdated&&this.available||!this.documentMode&&!this.embedded&&this.dockLayout.open)&&this.refreshEnvironments()}disconnectedCallback(){window.removeEventListener(M,this.onToggleRequest),this.documentMode&&this.usesAutomaticSource?this.returnToPicker(`pending`):this.disconnectConnection(),this.sessionSource.clearDesktopSource(),this.credentials=void 0,super.disconnectedCallback()}updated(e){if(e.has(`embedded`)&&(this.embedded?window.removeEventListener(M,this.onToggleRequest):window.addEventListener(M,this.onToggleRequest)),e.has(`suppressed`)){let e=this.dockLayout.setSuppressed(this.suppressed);this.suppressed?this.returnToPicker():e&&this.refreshEnvironments()}let t=e.has(`client`)||e.has(`available`),n=t||e.has(`embedded`)||e.has(`documentMode`)||e.has(`requestedSource`)&&(!this.embedded||this.suppliedEnvironments!==null||this.usesAutomaticSource)||e.has(`sessionKey`)||e.has(`documentControl`);if((this.documentMode||this.embedded)&&n?(this.returnToPicker(`pending`),this.available&&(!this.embedded||this.presented&&this.refreshOnPresentation)&&this.refreshEnvironments()):this.embedded&&e.has(`presented`)&&e.get(`presented`)!==this.presented&&this.state!==`disconnected`?(this.pictureInPicture.close(),this.mobileKeyboard.reset(),this.connection.setPresented(this.presented,()=>this.returnToPicker(`pending`))&&this.refreshOnPresentation&&this.refreshEnvironments()):t&&(!this.available&&this.dockLayout.open?(this.dockLayout.hideWithoutPersisting(),this.returnToPicker()):this.available&&this.dockLayout.restoreOpenState()&&this.refreshEnvironments()),e.has(`suppliedEnvironments`)&&this.suppliedEnvironments!==null){this.environments=[...this.suppliedEnvironments];let e=this.environments.find(e=>e.id===this.environmentId);this.source&&this.sessionSource.setDesktopSource(this.source,e?.desktopAvailability)}this.dockLayout.syncReservation(),this.onFocusTargetChange?.({kind:`desktop`,control:this.controlling,...this.sourceSelection===`picker`?{}:this.sourceSelection===`explicit`||this.sessionKey===null?{source:this.environmentId}:{session:this.sessionKey}})}handleToggleRequest(e){if(this.documentMode||this.suppressed||this.embedded&&!this.presented)return;let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null;if(!this.embedded&&(t?.dock===`right`||t?.dock===`bottom`)&&this.dockLayout.setDock(t.dock,!1),t?.open===!1){this.closePanel();return}if(!this.available||this.embedded&&!this.client)return;let n=this.embedded||this.dockLayout.open;this.embedded||this.dockLayout.setOpen(!0);let r=t?.environmentId??(t?.open===!0?this.environmentId:null);r?this.connectRequestedEnvironment(r,!!t?.environmentId):this.embedded?(this.returnToPicker(this.sessionKey===null?`picker`:`pending`),this.refreshEnvironments()):n?t?.open!==!0&&this.closePanel():this.refreshEnvironments()}closePanel(){this.returnToPicker(),this.embedded||this.dockLayout.setOpen(!1)}get usesAutomaticSource(){return this.sourceSelection===`pending`||this.sourceSelection===`resolved`}returnToPicker(e=`picker`){this.disconnectConnection(),this.state=`picker`,this.sourceSelection=e,this.environmentId=null,this.source=null,this.credentials=void 0,this.credentialAuth=void 0,this.desktopApps=[],this.controlling=!1,this.sizingMode=`fit`,this.canResize=!1,this.disconnectedReason=null,this.sessionSource.clearDesktopSource()}disconnectConnection(e=!1){this.pictureInPicture.close(),this.operationId+=1,this.pendingConnection=null,this.connection.begin(e),this.mobileKeyboard.reset(),e||(this.sessionSource.invalidate(),this.loading=!1,this.launcher.clear())}async refreshEnvironments(e,t){if(!this.client||!this.available||this.embedded&&!this.presented)return!1;let n=e??++this.operationId;this.loading=!0,this.errorText=null;let r=!1,i;if(this.suppliedEnvironments!==null){this.environments=[...this.suppliedEnvironments],this.loading=!1;let e=this.environments.find(e=>e.id===this.requestedSource&&e.desktop);return e&&this.sourceSelection===`pending`&&(this.sourceSelection=`resolved`,await this.connectEnvironment(e.id,!1)),!0}let o=this.sessionSource.loadInventory({automatic:this.sourceSelection===`pending`,target:t,isCurrent:()=>n===this.operationId&&(!this.embedded||this.presented)});try{let e=await o.result;e&&o.isCurrent()&&(i=e.selectedSource,this.environments=e.environments,r=!0)}catch(e){o.isCurrent()&&(this.errorText=a(`desktop.errors.listFailed`,{error:f(e)}),(this.requestedSource!==null||this.sessionKey!==null)&&(this.state=`inventory-error`))}finally{o.isCurrent()&&(this.loading=!1)}return r&&o.isCurrent()&&this.sourceSelection===`pending`&&(i===void 0?(this.requestedSource!==null||this.sessionKey!==null)&&(this.noticeText=a(`desktop.sourceUnavailable`)):(this.sourceSelection=`resolved`,await this.connectEnvironment(i,this.documentControl))),r}async connectRequestedEnvironment(e,t=!0){if(e===this.environmentId&&(this.state===`connecting`||this.state===`connected`||this.state===`credentials`)){t&&(this.sourceSelection=`explicit`);return}this.returnToPicker(t?`explicit`:this.sourceSelection),this.environmentId=e,this.state=`connecting`;let n=this.operationId,r=await this.refreshEnvironments(n,e);if(n===this.operationId){if(!r){this.state=`inventory-error`;return}this.connectEnvironment(e,!1)}}async connectEnvironment(e,t,n={}){let r=this.client;if(!e||!r||!this.available||this.embedded&&!this.presented)return;this.environmentId!==e&&(this.credentials=void 0,this.credentialAuth=void 0,this.sizingMode=`fit`),this.canResize=!1;let i=this.environments.find(t=>t.id===e);this.desktopApps=[...i?.worker?.desktopApps??[]],this.disconnectConnection(this.environmentId===e);let a=this.operationId,o=Y(i??{id:e});this.environmentId=e,this.source=o,this.sessionSource.setDesktopSource(o,i?.desktopAvailability),this.controlling=t,this.state=`connecting`,this.errorText=null,this.disconnectedReason=null,n.preserveNotice||(this.noticeText=null),this.controlTakeoverRecoveryUsed=n.takeoverRecovery===!0;try{let n=Se(o,this.credentialAuth,this.credentials),i=await r.request(`desktop.observe`,{source:o,control:t,...n?{credentials:n}:{}}),s=()=>be(r,i.wsPath);if(a!==this.operationId){s();return}this.controlling=i.control,this.canResize=i.canResize===!0,(!this.canResize||!this.controlling)&&this.sizingMode===`match`&&(this.sizingMode=`fit`);let{credentials:c,auth:l,phase:u}=Ce(i,this.credentials);if(u===`credentials`&&this.connection.disconnect(),this.connection.retainObservation(s),this.credentialAuth=l??this.credentialAuth,u===`credentials`){this.pendingConnection={environmentId:e,control:t,observed:i,operationId:a},this.state=`credentials`;return}await this.connectObserved({environmentId:e,control:t,observed:i,operationId:a},c)}catch(n){let r=we(n);if(r&&a===this.operationId){this.connection.disconnect(),this.credentialAuth=r,this.pendingConnection={environmentId:e,control:t,operationId:a},this.state=`credentials`;return}this.failConnection(a,n)}}async connectObserved(e,t){let n=this.client;if(n&&e.operationId===this.operationId){this.state=`connecting`;try{if(await this.updateComplete,e.operationId!==this.operationId)return;let r=this.shadowRoot?.querySelector(`.desktop-surface`);if(!r)throw Error(`Desktop render target is unavailable`);let i=await this.desktopClientFactory().connect({background:getComputedStyle(r).backgroundColor,isCurrent:()=>e.operationId===this.operationId,wsUrl:e.observed.wsPath,gatewayUrl:n.gatewayUrl,credentials:t,viewOnly:!e.observed.control,canResize:e.observed.canResize,sizingMode:this.sizingMode,target:r,onConnect:()=>{e.operationId===this.operationId&&(this.connection.setSizingMode(this.sizingMode),this.connection.markConnected(),this.state=`connected`)},onDisconnect:t=>{e.operationId===this.operationId&&this.handleDesktopDisconnect(e.environmentId,t)},onSecurityFailure:t=>{if(e.operationId===this.operationId){let n=b(t.reason,a(`desktop.unknownReason`));this.errorText=a(`desktop.errors.securityFailed`,{reason:n}),this.failConnection(e.operationId,Error(n))}}});if(e.operationId!==this.operationId){i.disconnect();return}this.connection.attach(i),this.connection.setSizingMode(this.sizingMode)}catch(t){this.failConnection(e.operationId,t)}}}failConnection(e,t){e===this.operationId&&(this.disconnectConnection(),this.state=`disconnected`,this.disconnectedReason=f(t))}handleCredentialsSubmit(e){e.preventDefault();let t=this.pendingConnection;if(!t||t.operationId!==this.operationId)return;let n=xe(new FormData(e.currentTarget),this.credentialAuth);n&&(this.credentials=n,this.pendingConnection=null,t.observed?this.connectObserved({...t,observed:t.observed},n):this.connectEnvironment(t.environmentId,t.control))}handleDesktopDisconnect(e,{code:t,reason:n,clean:r}){if(this.disconnectConnection(),t===1008&&this.credentialAuth===`ard-account`&&e!==null){this.credentials=this.credentials?.username?{username:this.credentials.username}:void 0,this.pendingConnection={environmentId:e,control:this.controlling,operationId:this.operationId},this.state=`credentials`,this.errorText=a(`desktop.errors.securityFailed`,{reason:b(n,a(`desktop.unknownReason`))});return}if(t===4e3&&(n===`control-taken`||n?.startsWith(`control-taken:`))&&this.controlling&&e!==null&&(!this.embedded||this.presented)&&!this.controlTakeoverRecoveryUsed){let t=b(n.slice(14));this.noticeText=t?a(`desktop.controlTakenBy`,{operator:t}):a(`desktop.controlTaken`),this.connectEnvironment(e,!1,{preserveNotice:!0,takeoverRecovery:!0});return}this.state=`disconnected`,this.disconnectedReason=b(n,t?a(`desktop.closeCode`,{code:String(t)}):``)||(r?null:a(`desktop.errors.connectionFailed`))}render(){if(!this.available||!this.documentMode&&!this.embedded&&!this.dockLayout.open)return S;let e=this.pictureInPicture.renderNotice(this.fullscreenMode.errorText??this.launcher.error??this.errorText,this.noticeText??(this.controlling&&this.source?.kind===`environment`?a(`desktop.agentInputPaused`):null),this.sessionSource.desktopAvailability),t=qe({automatic:this.usesAutomaticSource&&this.embedded&&this.sessionKey!==null,environments:this.environments,loading:this.loading,onRefresh:()=>void this.refreshEnvironments(),onConnect:e=>{this.sourceSelection=`explicit`,this.connectEnvironment(e,!1)}}),n=Ye({ardAccount:this.credentialAuth===`ard-account`,username:this.credentials?.username??``,onSubmit:e=>this.handleCredentialsSubmit(e)}),r=Ae({inventoryError:this.state===`inventory-error`,reason:this.disconnectedReason,onRetry:()=>{if(this.state===`inventory-error`&&this.documentMode||!this.environmentId){this.sourceSelection!==`picker`&&(this.sourceSelection=`pending`),this.state=`picker`,this.refreshEnvironments();return}if(this.state===`inventory-error`&&this.environmentId){this.connectRequestedEnvironment(this.environmentId);return}this.connectEnvironment(this.environmentId,this.controlling)}}),i={state:this.state===`picker`&&this.loading&&this.usesAutomaticSource&&(this.sessionKey!==null||this.requestedSource!==null)?`connecting`:this.state,notice:e,picker:t,credentials:n,recovery:r},o={mode:this.sizingMode,canResize:this.canResize&&this.controlling&&this.state===`connected`,onChange:e=>{this.sizingMode=e,this.connection.setSizingMode(e)}};return at({documentMode:this.documentMode,embedded:this.embedded,workspaceControls:this.workspaceControls,content:i,controlling:this.controlling,desktopApps:this.desktopApps,launchingApp:this.launcher.app,startup:this.sessionSource.startupEnvironment,sizing:o,mobileKeyboard:this.mobileKeyboard,pictureInPictureControl:this.pictureInPicture.renderButton(),dockLayout:this.dockLayout,fullscreenMode:this.fullscreenMode,onControlToggle:()=>void this.connectEnvironment(this.environmentId,!this.controlling),onTakeControl:()=>void this.connectEnvironment(this.environmentId,!0),onLaunch:e=>void this.launcher.launch(e),onClose:()=>this.closePanel(),onDocumentClose:()=>this.onDocumentClose?.(),focusTarget:()=>({basePath:this.basePath,source:this.environmentId,control:this.controlling,workspaceControls:this.workspaceControls}),onDisconnect:()=>{this.embedded&&(this.sessionKey!==null||this.suppliedEnvironments!==null)?this.handleDesktopDisconnect(this.environmentId,{clean:!0}):this.returnToPicker()}})}},i([D({attribute:!1})],Q.prototype,`client`,void 0),i([D({type:Boolean})],Q.prototype,`available`,void 0),i([D({type:Boolean})],Q.prototype,`suppressed`,void 0),i([D({type:Boolean})],Q.prototype,`documentMode`,void 0),i([D({attribute:!1})],Q.prototype,`requestedSource`,void 0),i([D({attribute:!1})],Q.prototype,`sessionKey`,void 0),i([D({type:Boolean})],Q.prototype,`documentControl`,void 0),i([D({attribute:!1})],Q.prototype,`basePath`,void 0),i([D({attribute:!1})],Q.prototype,`suppliedEnvironments`,void 0),i([D({type:Boolean})],Q.prototype,`workspaceControls`,void 0),i([D({type:Boolean})],Q.prototype,`embedded`,void 0),i([D({type:Boolean})],Q.prototype,`presented`,void 0),i([D({type:Boolean})],Q.prototype,`refreshOnPresentation`,void 0),i([D({attribute:!1})],Q.prototype,`onDocumentClose`,void 0),i([D({attribute:!1})],Q.prototype,`onFocusTargetChange`,void 0),i([w()],Q.prototype,`environments`,void 0),i([w()],Q.prototype,`loading`,void 0),i([w()],Q.prototype,`state`,void 0),i([w()],Q.prototype,`environmentId`,void 0),i([w()],Q.prototype,`source`,void 0),i([w()],Q.prototype,`controlling`,void 0),i([w()],Q.prototype,`errorText`,void 0),i([w()],Q.prototype,`noticeText`,void 0),i([w()],Q.prototype,`disconnectedReason`,void 0),i([w()],Q.prototype,`desktopApps`,void 0),i([w()],Q.prototype,`sizingMode`,void 0),i([w()],Q.prototype,`canResize`,void 0),i([w()],Q.prototype,`sourceSelection`,void 0),customElements.get(`testclaw-desktop-panel`)||customElements.define(`testclaw-desktop-panel`,Q)})))()}export{$ as t};
//# sourceMappingURL=desktop-panel-C2RVpVVW.js.map