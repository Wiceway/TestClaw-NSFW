import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ti as t}from"./control-ui-foundation-CGMdhB5v.js";import{Bl as n,Hl as r,Vl as i}from"./control-ui-core-S9jKXqB5.js";import{$ as a,Y as o,ct as s,mt as c,nt as l,ut as u}from"./lit-runtime-DWoPVI38.js";import{ct as d,ot as f}from"./control-ui-boot-shared-8dYR6CXG.js";import{aa as p,ia as m,na as h,oa as g,ra as _}from"./control-ui-boot-shared-CCYBAAP9.js";import"./control-ui-boot-shared-VDjYq2Zh.js";var v,y;function b(){return(b=e((()=>{o(),l(),f(),r(),p(),_(),v=class extends n{constructor(...e){super(...e),this.mode=`grid`,this.customIcon=``}select(e,t){this.props.disabled||this.props.onChange({icon:e,color:t})}showGrid(){this.mode=`grid`,this.customIcon=``,this.updateComplete.then(()=>{this.isConnected&&this.querySelector(`.session-menu__icon-choice--custom`)?.focus()})}render(){return m({inline:!0,clearable:this.props.clearable,mode:this.mode,currentIcon:this.props.icon,currentColor:this.props.color,disabled:this.props.disabled??!1,colorDisabled:this.props.disabled??!1,customIconValue:this.customIcon,onSelectColor:(e,t)=>this.select(this.props.icon,t),onSelect:(e,t)=>this.select(t,this.props.color),onReset:()=>this.select(null,null),onShowCustom:()=>{this.mode=`custom`,this.customIcon=``,this.updateComplete.then(()=>{this.isConnected&&this.querySelector(`.session-menu__icon-custom-input`)?.focus()})},onBack:()=>this.showGrid(),onInput:e=>{e.currentTarget instanceof HTMLTextAreaElement&&(this.customIcon=e.currentTarget.value)},onApply:()=>{let e=d(this.customIcon);e&&!this.props.disabled&&(this.select(e,this.props.color),this.showGrid())},onGridKeydown:h})}},t([u({attribute:!1})],v.prototype,`props`,void 0),t([s()],v.prototype,`mode`,void 0),t([s()],v.prototype,`customIcon`,void 0),y=class extends i{static{this.styles=c`
    :host {
      color: var(--appearance-color, inherit);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1em;
      height: 1em;
    }
    svg,
    img {
      width: 100%;
      height: 100%;
    }
    img {
      object-fit: contain;
    }
  `}render(){let e=this.props.icon?.trim();return a`${e?g(e)??e:this.props.fallback}`}},t([u({attribute:!1})],y.prototype,`props`,void 0),customElements.get(`testclaw-appearance-picker`)||customElements.define(`testclaw-appearance-picker`,v),customElements.get(`testclaw-appearance-glyph`)||customElements.define(`testclaw-appearance-glyph`,y)})))()}b();export{y as AppearanceGlyph,v as AppearancePicker};
//# sourceMappingURL=appearance-picker-BoDY51cl.js.map