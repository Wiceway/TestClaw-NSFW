import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Jl as n}from"./control-ui-core-S9jKXqB5.js";import{$ as r,X as i,Y as a}from"./lit-runtime-DWoPVI38.js";import{Ni as o}from"./control-ui-core-G2U4O6rB.js";import{da as s,la as c}from"./control-ui-boot-shared-ooxiG3qa.js";import{n as l,t as u}from"./en-debug-ChywClrD.js";import{t as d}from"./sparkline-tile-BO1w_6U1.js";function f(e,t){let n=[];for(let r of e){let e=t(r.status),i=typeof e==`number`?{value:e}:e;i&&Number.isFinite(i.value)?n.push({...i,at:r.at}):n.length=0}return n}function p(e){return`${Math.round(e*100)}%`}function m(e){return t(`debug.overlay.memoryMb`,{value:String(Math.round(e/1048576))})}function h(e){return c(e)??t(`common.na`)}function g(e,n){let a=e.eventLoop,o=a?.reasons??[],s=o.includes(`cpu`)||o.includes(`event_loop_utilization`),c=f(n,e=>{let n=e.eventLoop?.cpuCoreRatio;if(n===void 0)return;let r=e.eventLoop?.cpuBreakdown,i=[r?.mainThreadCoreRatio,r?.workerCoreRatio,r?.otherThreadsCoreRatio];return{value:n,secondary:t(`debug.overlay.hostShort`,{value:_(r?.hostUtilization)}),stack:i.every(e=>typeof e==`number`)?i:void 0}}),l=a?.cpuBreakdown;return r`
    <testclaw-tooltip class="gateway-cpu-tooltip" placement="top-start" open-on-click auto-size>
      <button
        type="button"
        class="gateway-cpu-trigger"
        aria-label=${t(`debug.overlay.cpuBreakdown`)}
      >
        <testclaw-sparkline
          class="gateway-vital gateway-vital--cpu"
          data-degraded=${s?``:i}
          .label=${t(`debug.overlay.cpu`)}
          .sub=${t(`debug.overlay.gatewayCpuScope`)}
          .samples=${c}
          .format=${p}
          .floorMax=${1}
          .stackColors=${[`var(--cpu-main)`,`var(--cpu-workers)`,`var(--cpu-other)`]}
        ></testclaw-sparkline>
      </button>
      <div slot="content" class="gateway-cpu-detail">
        <strong>${t(`debug.overlay.cpuBreakdownCurrent`)}</strong>
        <dl>
          <div class="gateway-cpu-detail__total">
            <dt>${t(`debug.overlay.gatewayCpuProcess`)}</dt>
            <dd>${_(a?.cpuCoreRatio)}</dd>
          </div>
          ${v(t(`debug.overlay.mainThreadCpu`),l?.mainThreadCoreRatio,`main`)}
          ${v(t(`debug.overlay.workerCpu`),l?.workerCoreRatio,`workers`)}
          ${v(t(`debug.overlay.otherThreadCpu`),l?.otherThreadsCoreRatio,`other`)}
          <div class="gateway-cpu-detail__host">
            <dt>
              ${l?.hostCpuCount==null?t(`debug.overlay.hostCpu`):t(`debug.overlay.hostCpuCount`,{count:String(l.hostCpuCount)})}
            </dt>
            <dd>${_(l?.hostUtilization)}</dd>
          </div>
          <div>
            <dt>${t(`debug.overlay.loopUtilization`)}</dt>
            <dd>${_(a?.utilization)}</dd>
          </div>
        </dl>
      </div>
    </testclaw-tooltip>
  `}function _(e){return typeof e==`number`?p(e):`—`}function v(e,t,n){return r`<div class="gateway-cpu-detail__thread">
    <dt>
      <span class="gateway-cpu-key gateway-cpu-key--${n}" aria-hidden="true"></span>${e}
    </dt>
    <dd>${n===`other`&&typeof t==`number`?`≈`:``}${_(t)}</dd>
  </div>`}function y(e,n){let i=typeof e.processMemory?.heapUsedBytes==`number`?t(`debug.overlay.heapShort`,{value:m(e.processMemory.heapUsedBytes)}):``;return r`<testclaw-sparkline
    class="gateway-vital gateway-vital--memory"
    .label=${t(`debug.overlay.memory`)}
    .sub=${i}
    .samples=${f(n,e=>e.processMemory?.rssBytes)}
    .format=${m}
    autorange
  ></testclaw-sparkline>`}function b(e,n){let a=e.eventLoop,o=a?.reasons?.includes(`event_loop_delay`),s=typeof a?.delayMaxMs==`number`?t(`debug.overlay.maxShort`,{value:h(a.delayMaxMs)}):``;return r`
    <div class="gateway-vitals">
      ${g(e,n)} ${y(e,n)}
      <testclaw-sparkline
        class="gateway-vital gateway-vital--delay"
        data-degraded=${o?``:i}
        .label=${t(`debug.overlay.delayP99`)}
        .sub=${s}
        .samples=${f(n,e=>e.eventLoop?.delayP99Ms)}
        .format=${h}
        .floorMax=${20}
      ></testclaw-sparkline>
    </div>
  `}function x(){return(x=e((()=>{a(),o(),n(),u(),s(),d(),l()})))()}export{b as a,y as i,x as n,g as r,f as t};
//# sourceMappingURL=gateway-vitals-C6z7rmBL.js.map