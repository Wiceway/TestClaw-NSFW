import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{kr as t,qi as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Bs as o,Gc as s,Hl as c,Jl as l,Rs as u,Wc as ee,_c as te,_n as ne,ac as d,au as re,fc as ie,hc as ae,ic as f,iu as oe,pn as se,si as ce,vi as le}from"./control-ui-core-S9jKXqB5.js";import{$ as p,X as m,Y as h,_ as ue,b as g,c as _,m as v,nt as y,s as de,ut as b,x as fe}from"./lit-runtime-DWoPVI38.js";import{Er as pe,Fi as x,Ii as S,Jr as me,Mr as C,Nr as he,Or as ge,Vr as w,ot as _e,rt as ve}from"./control-ui-core-G2U4O6rB.js";import{Jr as ye,ca as be,qr as xe,sa as T}from"./control-ui-boot-shared-ooxiG3qa.js";import{Ia as E,La as D}from"./control-ui-boot-shared-CCYBAAP9.js";import{t as O}from"./desktop-panel-C2RVpVVW.js";import{t as k}from"./sparkline-tile-BO1w_6U1.js";var A,j;function M(){return(M=e((()=>{re(),A={systems:{title:`Systems`,inventory:`Machines`,search:`Find a machine…`,filterSort:`Filter & sort machines`,sortBy:`Sort by`,alphabetical:`Alphabetical`,onlineFirst:`Online first`,offlineFirst:`Offline first`,all:`All`,select:`Select a machine`,selectHint:`Choose a host, worker, or paired node to see its status and desktop.`,refresh:`Refresh machines`,loading:`Loading machines…`,empty:`No machines are available to this account.`,noMatches:`No machines match your search or filters.`,offlineGateway:`Gateway disconnected. Reconnect to refresh machines or open a desktop.`,offlineTitle:`This machine is offline`,offlineHint:`Its last reported information is shown. Reconnect the machine to open its desktop.`,noDesktopTitle:`No desktop available`,noDesktopHint:`This machine has not reported a desktop. Its other capabilities remain available.`,noHostDesktopHint:`Refresh machines to check screen-sharing availability on this Gateway.`,screenSharingDetected:`Screen Sharing is available`,desktopDetected:`A desktop is available`,managedDesktopConfigured:`A managed desktop is configured`,screenSharingNeeded:`Turn on Screen Sharing`,desktopServerNeeded:`Set up a desktop server`,desktopSetupAttention:`Screen sharing needs attention`,desktopSetupEnableHint:`Enable desktop access to view and control this machine in Assistant.`,screenSharingSetupHint:`On this Mac, open System Settings → General → Sharing. Turn on Screen Sharing, or allow this account to Observe and Control in Remote Management, then check again.`,desktopServerSetupHint:`Set up a password-protected VNC server on this machine, or configure a managed desktop on Linux, then check again.`,enableDesktopAccess:`Enable desktop access in Assistant`,desktopSetupEnabling:`Enabling desktop access…`,desktopSetupEnabled:`Desktop access is enabled`,desktopSetupConnecting:`Waiting for desktop access to become available.`,desktopSetupApplyHint:`Applies without restarting the Gateway.`,desktopSetupAdminHint:`A Gateway administrator can enable desktop access.`,desktopSetupCheckAgain:`Check again`,desktopSetupFailed:`Desktop access could not be enabled. Refresh machines and try again.`,accessTitle:`Desktop access unavailable`,accessHint:`Desktop viewing requires an advertised desktop service and administrator access.`,missingTitle:`This machine is no longer listed`,missingHint:`Refresh the inventory or choose another machine. Your selection has not been changed.`,details:`Machine details`,closeDetails:`Close details`,stats:`Show statistics`,hideStats:`Hide statistics`,online:`Online`,offline:`Offline`,unknown:`Unknown`,unavailable:`Unavailable`,desktop:`Desktop`,host:`Gateway host`,worker:`Worker`,node:`Paired node`,workers:`Workers`,nodes:`Paired nodes`,status:`Status`,platform:`Platform`,identifier:`Identifier`,capabilities:`Capabilities`,telemetry:`Reported statistics`,load:`Load (1 min)`,cpuCount:`{count} cores`,memory:`Memory used`,disk:`Disk available`,sampled:`Sampled {time}`,collectingHistory:`Collecting history…`,lastKnown:`Last reported {time}`,noTelemetry:`This machine has not reported resource statistics.`,attachedSessions:`Attached sessions`,attachedHint:`Attachment does not mean a session is currently executing on this machine.`,relatedSessions:`Related sessions`,relatedHint:`Bindings from the loaded session list. A binding is not proof that a turn executed here.`,noRelatedSessions:`No related sessions in the loaded list.`,relations:{placement:`Placed here`,"retained-placement":`Retained placement`,runner:`Runner`,"exec-binding":`Configured exec target`,gateway:`Local session context`},statuses:{starting:`Starting`,stopping:`Stopping`,error:`Error`},errors:`Some machine information could not be refreshed.`}},j=Object.assign(()=>Object.assign(oe,A),{catalog:A})})))()}async function Se(e,t){if(!t.isCurrent()||t.signal?.aborted)return;let n={signal:t.signal},[r,i,a]=await Promise.allSettled([e.request(`environments.list`,{includeDesktopSetup:!0},n),e.request(`node.list`,{},n),e.request(`system.info`,{},n)]);if(t.isCurrent()&&!t.signal?.aborted){if(r.status===`rejected`)throw r.reason;return{environments:r.value.environments,nodes:i.status===`fulfilled`?i.value.nodes:[],gatewaySystemInfo:a.status===`fulfilled`?a.value:null,errors:{...i.status===`rejected`?{nodes:u(i.reason)}:{},...a.status===`rejected`?{systemInfo:u(a.reason)}:{}}}}}function Ce(e,t){let n=new Map(e.nodes.map(e=>[`node:${e.nodeId}`,e])),r=new Map,i=(e,t,n)=>{let i=r.get(e),a={kind:t,session:n};i?i.push(a):r.set(e,[a])};for(let e of t){let t=e.placement;if(t&&t.state!==`local`){if(t.state===`requested`)continue;t.environmentId&&i(t.environmentId,t.state===`reclaimed`||t.state===`failed`?`retained-placement`:`placement`,e),t.state===`active`&&t.runner?.deviceId&&i(`node:${t.runner.deviceId}`,`runner`,e);continue}let n=e.execNode?.trim();i(n?`node:${n}`:`gateway`,n?`exec-binding`:`gateway`,e)}return e.environments.filter(e=>e.type!==`worker`||e.worker?.state!==`destroyed`&&e.worker?.state!==`failed`).map(t=>({environment:t,node:t.type===`node`?n.get(t.id):void 0,gatewaySystemInfo:t.id===`gateway`?e.gatewaySystemInfo??void 0:void 0,sessions:r.get(t.id)??[]}))}function N(){return(N=e((()=>{o()})))()}function P(e){return e.gatewaySystemInfo??e.node?.hostStats}var F,I;function L(){return(L=e((()=>{F=3e4,I=12e4})))()}var R;function z(){return(z=e((()=>{he(),ge(),ve(),l(),ee(),o(),N(),L(),R=class{constructor(e){this.context=e,this.inventory=null,this.rows=[],this.selectedId=null,this.query=``,this.sortMode=`online-first`,this.statusFilter=`all`,this.showStats=!0,this.showDetails=!1,this.loading=!1,this.error=null,this.sampledAtMs=null,this.desktopSetupError=null,this.telemetry=new Map,this.listeners=new Set,this.subscriptions=[],this.generation=0,this.presented=!1,this.refreshQueued=!1,this.scope=C(e.gateway),this.lifecycle=ce(e.gateway.snapshot)}get current(){return this.scope===C(this.context.gateway)}get connected(){return this.current&&this.context.gateway.snapshot.phase===`connected`}get desktopAvailable(){return this.current&&_e(this.context.gateway.snapshot)}get selected(){return this.current?this.rows.find(e=>e.environment.id===this.selectedId):void 0}get hostDesktopEnabled(){let e=s(this.context.runtimeConfig.state.configSnapshot)?.desktop;return n(e)&&n(e.host)&&e.host.enabled===!0}get desktopSetupBusy(){return this.desktopSetupRequest!==void 0}resetDesktopSetup(){this.desktopSetupRequest=void 0,this.desktopSetupError=null}get canEnableHostDesktop(){let e=this.selected?.environment.desktopSetup;return this.presented&&this.connected&&this.selectedId===`gateway`&&(e?.state===`ready`||e?.state===`managed`)&&!this.hostDesktopEnabled&&this.context.runtimeConfig.canPatch===!0}async enableHostDesktop(){let e=this.lifecycle.capture(),t=this.context.runtimeConfig;if(!e||!this.canEnableHostDesktop||this.desktopSetupBusy)return;let n=Symbol(`desktop-setup`),r=()=>this.desktopSetupRequest===n&&this.presented&&this.current&&this.lifecycle.isCurrent(e)&&this.context.runtimeConfig===t;this.desktopSetupRequest=n,this.desktopSetupError=null,this.notify();try{if(await t.ensureLoaded(),!r()||!this.canEnableHostDesktop)return;let e=await t.patch({raw:{desktop:{host:{enabled:!0}}},note:`systems: enable host desktop`,canDispatch:()=>r()&&this.canEnableHostDesktop});r()&&!e&&(this.desktopSetupError=t.state.lastError??i(`systems.desktopSetupFailed`)),r()&&e&&await this.refresh()}catch(e){r()&&(this.desktopSetupError=u(e))}finally{r()&&(this.desktopSetupRequest=void 0,this.notify())}}telemetryHistory(e){return this.current?this.telemetry.get(e)??[]:[]}subscribe(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}notify(){for(let e of this.listeners)e()}projectRows(){this.rows=this.inventory&&this.current?Ce(this.inventory,this.context.sessions.state.result?.sessions??[]):[]}recordTelemetry(e){let t=new Set(this.rows.map(e=>e.environment.id));for(let e of this.telemetry.keys())t.has(e)||this.telemetry.delete(e);for(let t of this.rows){let n=t.environment.id,r=P(t);if(!r){this.telemetry.delete(n);continue}let i=n===`gateway`;if(i&&!e)continue;let a=t.node?.hostStats?.updatedAtMs??this.sampledAtMs;if(a===null)continue;let o=this.telemetry.get(n)??[],s=o.at(-1);if(s&&a<=s.at)continue;let c=i?F:I,l=s&&a-s.at<=c?o:[];this.telemetry.set(n,[...l.slice(-119),{at:a,stats:r}])}}select(e){this.current&&e.trim()&&(this.telemetryRequest?.abort(),this.telemetryRequest=void 0,e!==this.selectedId&&this.resetDesktopSetup(),this.selectedId=e,this.notify())}search(e){this.query=e,this.notify()}setSortMode(e){this.sortMode=e,this.notify()}setStatusFilter(e){this.statusFilter=e,this.notify()}toggleStats(){this.showStats=!this.showStats,this.notify()}toggleDetails(){this.showDetails=!this.showDetails,this.notify()}setPresented(e){if(this.presented!==e){if(this.presented=e,!e){for(let e of this.subscriptions)e();this.subscriptions=[],this.cancelRefresh(),this.resetDesktopSetup();return}this.subscriptions=[this.context.gateway.subscribe(e=>{let t=this.lifecycle.transition(e);this.current?t&&(this.cancelRefresh(),this.resetDesktopSetup(),this.telemetry.clear(),e.phase===`connected`&&this.refresh()):this.clear(),this.notify()}),this.context.gateway.subscribeEvents(e=>{e.event===`presence`||e.event===`node.pair.resolved`||e.event===`node.runnerInventory.changed`||e.event===`config.changed`?this.refresh():e.event===`node.hostStats`&&n(e.payload)&&typeof e.payload.nodeId==`string`&&this.selectedId===`node:${e.payload.nodeId}`&&this.refreshTelemetry()}),this.context.sessions.subscribe(()=>{this.projectRows(),this.notify()}),this.context.runtimeConfig.subscribe(()=>this.notify())],this.lifecycle.transition(this.context.gateway.snapshot)&&this.telemetry.clear(),this.current?this.refresh():this.clear()}}cancelRefresh(){this.generation+=1,this.request?.abort(),this.telemetryRequest?.abort(),this.request=void 0,this.telemetryRequest=void 0,this.loading=!1,this.refreshQueued=!1}clear(){this.cancelRefresh(),this.inventory=null,this.rows=[],this.selectedId=null,this.error=null,this.sampledAtMs=null,this.telemetry.clear(),this.resetDesktopSetup(),this.query=``}async refresh(){let e=this.context.gateway.snapshot;this.lifecycle.transition(e)&&this.telemetry.clear();let t=this.lifecycle.capture();if(!this.presented||!this.current||!t||!pe(e.hello?.auth??null))return;if(this.loading){this.refreshQueued=!0;return}this.cancelRefresh();let n=this.generation,r=new AbortController;this.request=r;let i=()=>this.presented&&this.current&&n===this.generation&&this.lifecycle.isCurrent(t);this.loading=!0,this.error=null,this.notify();try{let e=await Se(t.client,{signal:r.signal,isCurrent:i});if(!e||!i())return;let n=this.inventory===null;if(this.inventory=e,this.projectRows(),this.sampledAtMs=Date.now(),this.recordTelemetry(!0),n&&this.selectedId===null){let e=this.context.gateway.snapshot.sessionKey;this.selectedId=this.rows.find(t=>t.sessions.some(t=>t.session.key===e))?.environment.id??this.rows.find(e=>e.environment.id===`gateway`)?.environment.id??this.rows[0]?.environment.id??null}}catch(e){i()&&(this.error=u(e))}finally{if(i()){this.loading=!1,this.request=void 0;let e=this.refreshQueued;this.refreshQueued=!1,this.notify(),e&&this.refresh()}}}async refreshTelemetry(){let e=this.selected,t=this.inventory,n=this.lifecycle.capture();if(!this.presented||!this.current||!n||!e||!t||this.loading||this.telemetryRequest)return;let r=e.environment.id===`gateway`;if(!r&&e.environment.type!==`node`)return;let i=new AbortController;this.telemetryRequest=i;let a=this.generation,o=this.selectedId,s=()=>this.presented&&this.current&&this.lifecycle.isCurrent(n)&&this.telemetryRequest===i&&a===this.generation&&this.selectedId===o;try{if(r){let e=await n.client.request(`system.info`,{},{signal:i.signal});if(!s()||!this.inventory)return;let{systemInfo:t,...r}=this.inventory.errors;this.inventory={...this.inventory,gatewaySystemInfo:e,errors:r},this.sampledAtMs=Date.now()}else{let e=await n.client.request(`node.list`,{},{signal:i.signal});if(!s()||!this.inventory)return;let{nodes:t,...r}=this.inventory.errors;this.inventory={...this.inventory,nodes:e.nodes,errors:r}}this.projectRows(),this.recordTelemetry(r)}catch(e){s()&&this.inventory&&(this.inventory={...this.inventory,errors:{...this.inventory.errors,[r?`systemInfo`:`nodes`]:u(e)}})}finally{s()&&(this.telemetryRequest=void 0,this.notify())}}}})))()}function B(e,t,n){return p`<wa-dropdown-item
    class="sidebar-session-sort-menu__item"
    value=${e}
    role="menuitemradio"
    aria-checked=${String(n)}
    ${ue(e=>D(e,n))}
  >
    <span class="session-menu__text">${i(t)}</span>
    <span slot="details" class="session-menu__check" aria-hidden="true"
      >${n?x.check:m}</span
    >
  </wa-dropdown-item>`}function V(e){let t=e.gatewaySystemInfo?.machineName??e.environment.label??e.node?.displayName;if(t)return t;if(e.environment.id===`gateway`)return i(`systems.host`);let n=e.environment.worker;if(n){let t=e.sessions.find(e=>e.kind===`placement`)?.session;if(t)return t.displayName??t.label??t.key;if(n.profileId)return`${n.providerId} · ${n.profileId}`}return e.environment.id}function we(e){return e.slice(e.lastIndexOf(`:`)+1,e.lastIndexOf(`:`)+7)}function H(e){return e.environment.id===`gateway`?`host`:e.environment.type===`node`?`node`:`worker`}function U(e){return i(e.environment.status===`available`?`systems.online`:e.environment.status===`unavailable`?`systems.offline`:`systems.statuses.`+e.environment.status)}function W(e){let t=e.gatewaySystemInfo?.osLabel??e.environment.platform??e.node?.platform;return t?ye(t,e.node?.deviceFamily):void 0}var G,K,q;function J(){return(J=e((()=>{h(),y(),v(),S(),E(),l(),M(),xe(),c(),d(),j(),G=[{value:`name`,labelKey:`systems.alphabetical`},{value:`online-first`,labelKey:`systems.onlineFirst`},{value:`offline-first`,labelKey:`systems.offlineFirst`}],K=[{value:`all`,labelKey:`systems.all`},{value:`online`,labelKey:`systems.online`},{value:`offline`,labelKey:`systems.offline`}],q=class extends a{constructor(){super(),new f(this).watch(()=>this.controller,(e,t)=>e.subscribe(t))}render(){let e=this.controller;if(!e?.current)return m;let t=e.query.trim().toLocaleLowerCase(),n=e.rows.filter(n=>(e.statusFilter===`all`||n.environment.status===(e.statusFilter===`online`?`available`:`unavailable`))&&[V(n),n.environment.id,W(n)??``,n.environment.platform??n.node?.platform??``].some(e=>e.toLocaleLowerCase().includes(t))).toSorted((t,n)=>{if(e.sortMode!==`name`){let r=e.sortMode===`online-first`?`available`:`unavailable`,i=Number(n.environment.status===r)-Number(t.environment.status===r);if(i)return i}return V(t).localeCompare(V(n),void 0,{numeric:!0,sensitivity:`base`})||t.environment.id.localeCompare(n.environment.id)}),r=t=>{let n=t.environment.status===`available`,r=W(t),a=U(t);return p`<button
        class="systems-machine"
        type="button"
        data-status=${t.environment.status}
        aria-pressed=${t.environment.id===e.selectedId}
        aria-description=${r?`${a} · ${r}`:a}
        @click=${()=>e.select(t.environment.id)}
      >
        <i class="systems-machine__dot" aria-hidden="true"></i>
        <span class="systems-machine__name">${V(t)}</span>
        <span class="systems-machine__meta"
          >${n?t.environment.worker?we(t.environment.id):r??m:a}</span
        >
        ${t.environment.desktop?p`<span class="systems-machine__desktop"
                >${x.monitor}<span class="sr-only">${i(`systems.desktop`)}</span></span
              >`:m}
      </button>`};return p`<section class="systems-sidebar" aria-label=${i(`systems.inventory`)}>
      <div class="systems-filter">
        <span aria-hidden="true">${x.search}</span>
        <input
          type="search"
          aria-label=${i(`systems.search`)}
          placeholder=${i(`systems.search`)}
          .value=${e.query}
          @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.search(t.currentTarget.value)}}
        />
        <wa-dropdown
          class="systems-filter-menu sidebar-session-sort-menu"
          placement="bottom-end"
          aria-label=${i(`systems.filterSort`)}
          @wa-select=${t=>{let n=t.detail.item.value,r=G.find(e=>n===`sort:${e.value}`),i=K.find(e=>n===`status:${e.value}`);r?e.setSortMode(r.value):i&&e.setStatusFilter(i.value)}}
        >
          <button
            slot="trigger"
            type="button"
            class="systems-filter__sort sidebar-session-sort ${e.statusFilter===`all`?``:`sidebar-session-sort--filtered`}"
            aria-label=${i(`systems.filterSort`)}
            title=${i(`systems.filterSort`)}
          >
            ${x.listFilter}
          </button>
          <div class="sidebar-session-sort-menu__title">${i(`systems.sortBy`)}</div>
          ${G.map(t=>B(`sort:${t.value}`,t.labelKey,e.sortMode===t.value))}
          <div class="session-menu__separator" role="separator"></div>
          <div class="sidebar-session-sort-menu__title">${i(`systems.status`)}</div>
          ${K.map(t=>B(`status:${t.value}`,t.labelKey,e.statusFilter===t.value))}
        </wa-dropdown>
        <button
          type="button"
          class="systems-filter__refresh"
          aria-label=${i(`systems.refresh`)}
          title=${i(`systems.refresh`)}
          ?disabled=${e.loading||!e.connected}
          @click=${()=>void e.refresh()}
        >
          ${x.refresh}
        </button>
      </div>
      <div class="systems-sidebar__list" aria-busy=${e.loading}>
        ${e.loading&&!e.inventory?p`<p class="systems-sidebar__empty" role="status">${i(`systems.loading`)}</p>`:m}
        ${n.filter(e=>H(e)===`host`).map(r)}
        ${[`node`,`worker`].map(e=>{let t=n.filter(t=>H(t)===e);return t.length?p`<section class="systems-group">
                <h3>
                  <span>${i(e===`node`?`systems.nodes`:`systems.workers`)}</span>
                  <span class="systems-group__count">${t.length}</span>
                </h3>
                ${t.map(r)}
              </section>`:m})}
        ${!e.loading&&n.length===0?p`<p class="systems-sidebar__empty">${i(t||e.statusFilter!==`all`?`systems.noMatches`:`systems.empty`)}</p>`:m}
      </div>
    </section>`}},r([b({attribute:!1})],q.prototype,`controller`,void 0),customElements.get(`testclaw-systems-sidebar`)||customElements.define(`testclaw-systems-sidebar`,q)})))()}function Y(e){return t(e,{style:`legacy-binary`,separator:` `,maxUnit:`tera`,fractionDigits:(e,t)=>+(t===`tera`||e<10)})}function X(e,t){let n=[];for(let{at:r,stats:i}of e){let e=t(i);e===void 0||!Number.isFinite(e)?n.length=0:n.push({at:r,value:e})}return n}function Z(e,t){let n=P(e);if(!n)return p`<p class="systems-no-telemetry">${i(`systems.noTelemetry`)}</p>`;let r=e.node?.hostStats?.updatedAtMs??t.sampledAtMs,a=e.environment.id===`gateway`,o=!t.connected||e.environment.status!==`available`||!!t.inventory?.errors[a?`systemInfo`:`nodes`]||r!==null&&Date.now()-r>(a?3e4:12e4),s=t.telemetryHistory(e.environment.id),c=s.length?s:[{at:r??0,stats:n}],l=(e,t)=>p`
    <testclaw-sparkline
      class="gateway-vital systems-vital systems-vital--disk"
      title=${e??m}
      .label=${e?`${i(`systems.disk`)} ${e}`:i(`systems.disk`)}
      .sub=${t===void 0?``:`/ ${Y(t)}`}
      .samples=${X(c,t=>e===void 0?t.disks===void 0?t.diskAvailableBytes:void 0:t.disks?.find(t=>t.path===e)?.availableBytes)}
      .format=${Y}
      .autorange=${!0}
    ></testclaw-sparkline>
  `;return fe(e.environment.id,p`<div class="systems-metrics" data-stale=${o}>
      <div
        class="systems-vitals ${n.disks&&n.disks.length!==1?`systems-vitals--volumes`:``}"
      >
        <testclaw-sparkline
          class="gateway-vital systems-vital systems-vital--load"
          .label=${i(`systems.load`)}
          .sub=${i(`systems.cpuCount`,{count:String(n.cpuCount)})}
          .samples=${X(c,e=>e.loadAverage?.[0])}
          .format=${e=>e.toFixed(2)}
          .floorMax=${n.cpuCount}
        ></testclaw-sparkline>
        <testclaw-sparkline
          class="gateway-vital systems-vital systems-vital--memory"
          .label=${i(`systems.memory`)}
          .sub=${`/ ${Y(n.memoryTotalBytes)}`}
          .samples=${X(c,e=>e.memoryTotalBytes-e.memoryFreeBytes)}
          .format=${Y}
          .floorMax=${n.memoryTotalBytes}
        ></testclaw-sparkline>
        ${n.disks===void 0?l(void 0,n.diskTotalBytes):_(n.disks,e=>e.path,e=>l(e.path,e.totalBytes))}
      </div>
      <div class="systems-metrics-caption">
        ${!o&&c.length<2?p`<span>${i(`systems.collectingHistory`)}</span>`:m}
        ${r===null?m:p`<span class="systems-sample-time">${i(o?`systems.lastKnown`:`systems.sampled`,{time:se(Math.max(0,Date.now()-r))})}</span>`}
      </div>
    </div>`)}function Te(e,t,n=!0){return e?p`<testclaw-systems-page
        .routeData=${e}
        .presented=${n}
      ></testclaw-systems-page>`:m}function Ee(e){return e?p`<testclaw-systems-sidebar .controller=${e.controller}></testclaw-systems-sidebar>`:m}function De(e){return{controller:new R(e)}}var Q;function $(){return($=e((()=>{h(),y(),g(),de(),S(),k(),me(),O(),l(),M(),ne(),ie(),c(),be(),d(),z(),J(),L(),j(),Q=class extends a{constructor(){super(),this.presented=!0,this.poll=new T(this,15e3,()=>{this.presented&&document.visibilityState!==`hidden`&&(this.routeData?.controller.showStats||this.routeData?.controller.showDetails)&&this.routeData?.controller.refreshTelemetry()}),this.handleDesktopToggle=e=>{let t=this.routeData?.controller;if(!this.presented||!t?.current||!(e instanceof CustomEvent))return;let r=n(e.detail)?e.detail:{},i=typeof r.environmentId==`string`?r.environmentId:void 0;if(e.preventDefault(),e.stopImmediatePropagation(),r?.open===!1){this.querySelector(`testclaw-desktop-panel`)?.handleToggleRequest(e);return}if(i&&i!==t.selectedId){t.select(i),t.rows.some(e=>e.environment.id===i)||t.refresh();return}i&&this.querySelector(`testclaw-desktop-panel`)?.handleToggleRequest(e)},this.poll,new f(this).watch(()=>this.routeData?.controller,(e,t)=>e.subscribe(t))}connectedCallback(){super.connectedCallback(),window.addEventListener(w,this.handleDesktopToggle)}disconnectedCallback(){window.removeEventListener(w,this.handleDesktopToggle),this.activeController?.setPresented(!1),this.activeController=void 0,super.disconnectedCallback()}updated(e){(e.has(`routeData`)||e.has(`presented`))&&(this.activeController!==this.routeData?.controller&&this.activeController?.setPresented(!1),this.activeController=this.routeData?.controller,this.activeController?.setPresented(this.presented))}renderDetails(e,t){let n=t.environment;return p`<aside class="systems-details" aria-label=${i(`systems.details`)}>
      <header>
        <h2>${i(`systems.details`)}</h2>
        <button
          class="systems-icon-button"
          aria-label=${i(`systems.closeDetails`)}
          @click=${()=>e.toggleDetails()}
        >
          ${x.x}
        </button>
      </header>
      <dl>
        <dt>${i(`systems.identifier`)}</dt>
        <dd>${n.id}</dd>
        <dt>${i(`systems.status`)}</dt>
        <dd>${e.connected?U(t):i(`systems.offline`)}</dd>
        <dt>${i(`systems.platform`)}</dt>
        <dd>${W(t)??i(`systems.unknown`)}</dd>
      </dl>
      <h3>${i(`systems.telemetry`)}</h3>
      ${Z(t,e)}
      <h3>${i(`systems.relatedSessions`)}</h3>
      <p class="systems-detail-hint">${i(`systems.relatedHint`)}</p>
      ${t.sessions.length?t.sessions.map(t=>{let n=t.session,r=ae(n),a=te({context:e.context,face:r,sessionKey:n.key,preferenceDerivedFace:!0});return p`<a
                class="systems-session-link"
                href=${a.href}
                @click=${t=>{le(t)&&(t.preventDefault(),e.context.navigate(r,a.options))}}
                ><strong>${n.displayName??n.label??n.key}</strong
                ><span>${i(`systems.relations.`+t.kind)}</span></a
              >`}):p`<p class="systems-detail-hint">${i(`systems.noRelatedSessions`)}</p>`}
      ${n.worker?.attachedSessionIds.length?p`<h3>${i(`systems.attachedSessions`)}</h3>
              <p class="systems-detail-hint">${i(`systems.attachedHint`)}</p>
              <ul>
                ${n.worker.attachedSessionIds.map(e=>p`<li>${e}</li>`)}
              </ul>`:m}
      <h3>${i(`systems.capabilities`)}</h3>
      <div class="systems-capabilities">
        ${(n.capabilities??[]).map(e=>p`<span>${e}</span>`)}
      </div>
    </aside>`}renderHostDesktopSetup(e,t){let n=t.environment.desktopSetup,r=e.hostDesktopEnabled,a=W(t)?.startsWith(`macOS`)===!0,o=n?.state===`ready`||n?.state===`managed`,s=r?`systems.desktopSetupEnabled`:n?.state===`managed`?`systems.managedDesktopConfigured`:n?.state===`ready`?a?`systems.screenSharingDetected`:`systems.desktopDetected`:n?.state===`needs-server`?a?`systems.screenSharingNeeded`:`systems.desktopServerNeeded`:`systems.desktopSetupAttention`,c=r?`systems.desktopSetupConnecting`:o?`systems.desktopSetupEnableHint`:a&&n?.state===`needs-server`?`systems.screenSharingSetupHint`:`systems.desktopServerSetupHint`;return p`<div class="systems-state" role="status">
      <span class="systems-state__icon" aria-hidden="true">${x.monitor}</span>
      <h2>${i(s)}</h2>
      <p>${i(c)}</p>
      ${n?.state===`unsupported`&&n.detail?p`<p>${n.detail}</p>`:m}
      ${e.desktopSetupError?p`<p class="systems-callout--error" role="alert">${e.desktopSetupError}</p>`:m}
      ${!r&&o?p`
              <button
                class="btn primary systems-text-button"
                ?disabled=${!e.canEnableHostDesktop||e.desktopSetupBusy}
                @click=${()=>void e.enableHostDesktop()}
              >
                ${i(e.desktopSetupBusy?`systems.desktopSetupEnabling`:`systems.enableDesktopAccess`)}
              </button>
              <p>
                ${i(e.context.runtimeConfig.canPatch===!0?`systems.desktopSetupApplyHint`:`systems.desktopSetupAdminHint`)}
              </p>
            `:m}
      ${!r&&!o?p`<button class="systems-text-button" ?disabled=${e.loading||!e.connected} @click=${()=>void e.refresh()}>${i(`systems.desktopSetupCheckAgain`)}</button>`:m}
    </div>`}render(){let e=this.routeData?.controller;if(!e?.current)return p`<p class="systems-state" role="status">${i(`systems.loading`)}</p>`;let t=e.selected,n=!!(t?.environment.desktop&&t.environment.status===`available`&&e.desktopAvailable&&this.presented),r=t?V(t):i(`systems.title`),a=Object.values(e.inventory?.errors??{}),o=e.connected?e.loading&&!e.inventory?i(`systems.loading`):e.selectedId&&!t?i(`systems.missingTitle`):t?t.environment.status===`available`?t.environment.desktop?i(`systems.accessTitle`):i(`systems.noDesktopTitle`):t.environment.status===`unavailable`?i(`systems.offlineTitle`):U(t):i(`systems.select`):i(`systems.offlineGateway`),s=e.selectedId&&!t?i(`systems.missingHint`):t?t.environment.status===`available`?t.environment.desktop?i(`systems.accessHint`):i(t.environment.id===`gateway`?`systems.noHostDesktopHint`:`systems.noDesktopHint`):i(`systems.offlineHint`):i(`systems.selectHint`);return p`<section class="systems-workspace" aria-label=${i(`systems.title`)}>
      <header class="systems-toolbar">
        <div class="systems-heading">
          <h1>${r}</h1>
          <span>${i(t?`systems.`+H(t):`systems.selectHint`)}</span>
        </div>
        <select
          class="systems-mobile-picker"
          aria-label=${i(`systems.select`)}
          @change=${t=>{t.currentTarget instanceof HTMLSelectElement&&e.select(t.currentTarget.value)}}
        >
          <option value="" disabled .selected=${!t}>${i(`systems.select`)}</option>
          ${e.rows.map(t=>p`<option value=${t.environment.id} .selected=${t.environment.id===e.selectedId}>${V(t)}</option>`)}
        </select>
        <button
          class="systems-icon-button"
          title=${i(e.showStats?`systems.hideStats`:`systems.stats`)}
          aria-label=${i(e.showStats?`systems.hideStats`:`systems.stats`)}
          aria-pressed=${e.showStats}
          @click=${()=>e.toggleStats()}
        >
          ${x.activity}
        </button>
        <button
          class="systems-icon-button"
          title=${i(`systems.details`)}
          aria-label=${i(`systems.details`)}
          aria-pressed=${e.showDetails}
          ?disabled=${!t}
          @click=${()=>e.toggleDetails()}
        >
          ${x.panelRightOpen}
        </button>
      </header>
      ${e.error?p`<div class="systems-callout systems-callout--error" role="alert">${e.error}<button @click=${()=>void e.refresh()} ?disabled=${e.loading}>${i(`common.retry`)}</button></div>`:m}
      ${e.connected?m:p`<div class="systems-callout" role="status">${i(`systems.offlineGateway`)}</div>`}
      ${a.length?p`<details class="systems-callout">
              <summary>${i(`systems.errors`)}</summary>
              ${a.map(e=>p`<p>${e}</p>`)}
            </details>`:m}
      ${e.showStats&&t?Z(t,e):m}
      <div class="systems-body">
        <div class="systems-desktop">
          ${n&&t?p`<testclaw-desktop-panel
                  embedded
                  data-chat-autotype-exempt
                  .client=${e.context.gateway.snapshot.client}
                  .available=${e.desktopAvailable}
                  .presented=${this.presented}
                  .workspaceControls=${!0}
                  .suppliedEnvironments=${e.inventory?.environments??[]}
                  .requestedSource=${t.environment.id}
                  .basePath=${e.context.basePath}
                ></testclaw-desktop-panel>`:t?.environment.id===`gateway`&&e.connected&&t.environment.status===`available`&&(t.environment.desktopSetup||t.environment.desktop&&e.hostDesktopEnabled&&e.context.runtimeConfig.canPatch===!0)?this.renderHostDesktopSetup(e,t):p`<div class="systems-state" role="status">
                    <span class="systems-state__icon" aria-hidden="true">${x.monitor}</span>
                    <h2>${o}</h2>
                    <p>${s}</p>
                    ${t?p`<button class="systems-text-button" @click=${()=>e.toggleDetails()}>${i(`systems.details`)}</button>`:m}
                  </div>`}
        </div>
        ${e.showDetails&&t?this.renderDetails(e,t):m}
      </div>
    </section>`}},r([b({attribute:!1})],Q.prototype,`routeData`,void 0),r([b({type:Boolean})],Q.prototype,`presented`,void 0),customElements.get(`testclaw-systems-page`)||customElements.define(`testclaw-systems-page`,Q)})))()}$();export{De as load,Te as render,Ee as renderSidebar};
//# sourceMappingURL=systems-page-uNjJN2cq.js.map