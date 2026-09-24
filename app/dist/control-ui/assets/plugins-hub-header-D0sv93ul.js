import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Jl as n}from"./control-ui-core-S9jKXqB5.js";import{$ as r,X as i,Y as a}from"./lit-runtime-DWoPVI38.js";import{Qa as o,do as s,fo as c}from"./control-ui-core-G2U4O6rB.js";import{Di as l,Ei as u}from"./control-ui-boot-shared-ooxiG3qa.js";import{_t as d,f,ht as p,p as m}from"./control-ui-boot-shared-CCYBAAP9.js";function h(){return(h=e((()=>{})))()}function g(){return[{value:`plugins`,label:t(`tabs.plugins`)},{value:`skills`,label:t(`tabs.skills`)},{value:`skill-workshop`,label:t(`tabs.skillWorkshop`)}]}function _(e){return m({id:`plugins`,active:e.active,tabs:g(),ariaLabel:t(`pluginsPage.hubTablistLabel`),panelId:v,className:`plugins-tabs`,onSelect:e.onSelect})}var v;function y(){return(y=e((()=>{f(),n(),u(),l(),v=`plugins-hub-panel`})))()}function b(e){let t=x[e.active];return r`
    <section
      class="content-header content-header--stacked content-header--settings content-header--page hub-page-header plugins-hub-header"
    >
      <div class="hub-page-header__title">
        <h1 class="page-title">${c(t.route)}</h1>
        <div class="page-subtitle">
          ${s(t.route)} ${d(t.docsUrl)}
        </div>
      </div>
      <div class="hub-page-header__tabs">
        ${_({active:e.active,onSelect:e.onSelect})}
      </div>
      <div class="hub-page-header__actions">
        ${e.secondaryAction?r`<button
                type="button"
                class="btn btn--sm ${e.secondaryAction.icon?`btn--icon`:``} plugins-hub-header__secondary oc-action oc-action-secondary"
                aria-label=${e.secondaryAction.label}
                title=${e.secondaryAction.icon?e.secondaryAction.label:i}
                @click=${e.secondaryAction.onClick}
              >
                ${e.secondaryAction.icon??e.secondaryAction.label}
              </button>`:i}
      </div>
    </section>
  `}var x;function S(){return(S=e((()=>{a(),o(),p(),y(),x={plugins:{route:`plugins`,docsUrl:`https://docs.testclaw.ai/plugins/manage-plugins`},skills:{route:`skills`,docsUrl:`https://docs.testclaw.ai/tools/skills`},"skill-workshop":{route:`skill-workshop`,docsUrl:`https://docs.testclaw.ai/tools/skill-workshop`}}})))()}export{h as a,y as i,b as n,v as r,S as t};
//# sourceMappingURL=plugins-hub-header-D0sv93ul.js.map