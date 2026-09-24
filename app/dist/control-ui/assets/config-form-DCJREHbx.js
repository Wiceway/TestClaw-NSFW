import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ti as t}from"./control-ui-foundation-CGMdhB5v.js";import{$l as n,Bl as r,Hl as i,Jl as a,Zl as o,_r as s,br as c,dr as l,fr as u,gr as d,hr as f,pr as p,ur as m,vr as h,yr as g}from"./control-ui-core-S9jKXqB5.js";import{$ as _,J as v,K as y,X as b,Y as x,_ as S,c as C,ct as w,m as T,nt as E,q as D,s as O,ut as k}from"./lit-runtime-DWoPVI38.js";import{Fi as ee,Gn as A,Hn as j,Ii as M,Kn as N,qn as P}from"./control-ui-core-G2U4O6rB.js";import{Mt as F,Nt as I,_t as L,ht as R,nt as te,tt as ne,wt as re,xt as z,yt as ie}from"./control-ui-boot-shared-CCYBAAP9.js";import{a as ae,c as oe,d as se,i as ce,l as B,n as le,o as ue,r as de,s as fe,t as pe,u as me}from"./config-form.tiers-CVymKsPv.js";import{a as he,n as ge,r as _e,t as ve}from"./config-form.array-items-uNvc8oxt.js";import{A as ye,C as V,D as be,E as xe,F as H,I as Se,M as U,O as Ce,S as we,T as W,_ as Te,a as Ee,b as De,c as Oe,d as G,f as ke,g as Ae,h as je,i as Me,j as Ne,k as Pe,l as K,m as Fe,n as q,o as Ie,p as Le,r as Re,s as ze,t as Be,u as Ve,v as He,w as Ue,x as J,y as We}from"./config-form.node.shared-CgIgd4Xp.js";import{i as Ge,n as Ke,r as qe,t as Je}from"./phone-runtime-ZUS6orP4.js";function Ye(e,t,n,r){let i=t[n];if(i===void 0)return{ok:!1,value:Ze};let a=n===t.length-1;if(typeof i==`number`){if(e!=null&&!Array.isArray(e))return{ok:!1,value:Ze};let o=Array.isArray(e)?[...e]:[];if(a)return r===void 0?o.splice(i,1):o[i]=r,{ok:!0,value:o};let s=Ye(o[i],t,n+1,r);return s.ok?(o[i]=s.value,{ok:!0,value:o}):s}if(e!=null&&(typeof e!=`object`||Array.isArray(e)))return{ok:!1,value:Ze};let o=e?{...e}:{};if(a)return r===void 0?delete o[i]:Object.defineProperty(o,i,{value:r,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o};let s=Ye(Object.hasOwn(o,i)?o[i]:void 0,t,n+1,r);return s.ok?(Object.defineProperty(o,i,{value:s.value,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o}):s}function Xe(e,t,n){return t.length===0?{ok:!0,value:n}:Ye(e,t,0,n)}var Ze;function Qe(){return(Qe=e((()=>{Ze=Symbol(`invalid-path-patch`)})))()}function $e(e){return structuredClone(e)}function et(e){let t=g(e.schema);if(t!==`object`&&t!==`array`)return;let n=e.schema.default;return t===`object`&&n&&typeof n==`object`&&!Array.isArray(n)||t===`array`&&Array.isArray(n)?$e(n):t===`object`?{}:[]}function tt(e,t){return t!==void 0&&e.value===void 0&&e.isRequired!==!0&&e.structuredDraftOwner!==!0&&!W(e.schema,t)}var nt;function rt(){return(rt=e((()=>{x(),E(),a(),i(),Qe(),V(),H(),nt=class extends r{constructor(...e){super(...e),this.error=``}willUpdate(e){if(!e.has(`props`))return;let t=e.get(`props`),n=this.props;n&&(!t||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity))&&(this.draftValue=$e(n.initialValue),this.error=``)}patchDraft(e,t){let r=this.props,i=this.draftValue;if(!r||!i)return!1;let a=r.params.path;if(e.length<a.length||!a.every((t,n)=>t===e[n]))return!1;let o=e.slice(a.length),s=o.length===0?{ok:!0,value:t}:Xe(i,o,t);if(!s.ok)return!1;let c=s.value,l=g(r.params.schema);return l===`object`&&(!c||typeof c!=`object`||Array.isArray(c))||l===`array`&&!Array.isArray(c)?!1:(this.draftValue=c,this.error=``,!W(r.params.schema,c)||r.params.onPatch(a,c)!==!1||(this.error=n(`configForm.draftRejected`),!1))}render(){let e=this.props,t=this.draftValue;if(!e||!t)return b;let n=U(e.params.path,`structured-draft-error`);return _`
      ${e.renderNode({...e.params,value:t,sourceIdentity:t,controlIdentity:t,structuredDraftOwner:!0,onPatch:(e,t)=>this.patchDraft(e,t),onRemove:e=>this.patchDraft(e,void 0)})}
      ${this.error?_`
              <div class="settings-row settings-row--stacked cfg-structured-draft__error">
                <div class="settings-row__control">
                  <span id=${n} class="cfg-field__error" role="alert">${this.error}</span>
                </div>
              </div>
            `:b}
    `}},t([k({attribute:!1})],nt.prototype,`props`,void 0),t([w()],nt.prototype,`draftValue`,void 0),t([w()],nt.prototype,`error`,void 0),customElements.get(`testclaw-config-form-structured-draft`)||customElements.define(`testclaw-config-form-structured-draft`,nt)})))()}function it(e,t){return t.length>e.length&&e.every((e,n)=>J(e,t[n]))}function at(e){let{schema:t,value:n,minimumItems:r,maximumItems:i,uniqueItems:a,isUnset:o,isRequired:s,itemSchemaAt:c}=e,l=Math.max(1,r-n.length),u=l>100?1:l,d=[];for(let e=0;e<u;e+=1){let t=we(c(n.length+e));if(t===Ae){d.length=0;break}d.push(t)}let f=d.length===u?[...n,...d]:void 0,p=f!==void 0&&!a&&(i===void 0||f.length<=i)&&(f.length<r||W(t,f))?f:void 0,m=W(t,n),h=Te(t).find(e=>W(t,e)&&(o||!m||it(n,e)))??(o&&s&&i===0&&W(t,[])?[]:void 0);return{atomicCandidate:Array.isArray(h)?structuredClone(h):void 0,autoCandidate:p}}function ot(){return(ot=e((()=>{V()})))()}var st;function ct(){return(ct=e((()=>{V(),st=class{constructor(){this.identities=new WeakMap,this.previous=[]}read(e){let t=this.identities.get(e);if(t?.length===e.length)return this.previous=e,t;let n=this.identities.get(this.previous)??[],r=new Set(this.previous.flatMap((t,n)=>J(t,e[n])?[]:[n])),i=e.map((e,t)=>{let i=J(e,this.previous[t])?t:[...r].find(t=>J(e,this.previous[t]));return i===void 0?Symbol(`array-row`):(r.delete(i),n[i])});return this.identities.set(e,i),this.previous=e,i}patch(e,t,n){let r=this.previous;this.identities.set(e,t);let i=n(e)!==!1;return i||(this.identities.delete(e),this.previous=r),i}}})))()}function lt(e,t){let n=e.currentTarget;if(!(n instanceof HTMLElement))return;let r=n.closest(`.cfg-block`);Array.from(r?.getElementsByTagName(`testclaw-config-form-collection-draft`)??[]).find(e=>e.parentElement===r&&e.id===t)?.openDraft?.()}var Y;function ut(){return(ut=e((()=>{x(),E(),a(),i(),V(),A(),H(),Y=class extends r{constructor(...e){super(...e),this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.error=``,this.invalidTarget=null}willUpdate(e){let t=e.get(`props`),n=this.props;t&&(!n||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity)&&!J(t.sourceIdentity,n.sourceIdentity))&&this.closeDraft()}openDraft(){this.props?.disabled||(this.draftOpen=!0,this.updateComplete.then(()=>{this.querySelector(`[data-collection-draft-value]`)?.focus()}))}clearError(){this.error=``,this.invalidTarget=null}closeDraft(){this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.clearError()}fail(e,t){this.invalidTarget=e,this.error=t,this.updateComplete.then(()=>{this.querySelector(e===`key`?`[data-collection-draft-key]`:`[data-collection-draft-value]`)?.focus()})}parseValue(e){if(this.draftIsNull)return{ok:!0,value:null};let t=g(e),r=e.anyOf??e.oneOf??[],i=r.some(h)&&r.some(e=>[`number`,`integer`].includes(g(e)??``));if(t===`string`)return{ok:!0,value:this.draftValue};if(t===`number`||t===`integer`){let e=j(this.draftValue,t===`integer`);return typeof e==`number`?{ok:!0,value:e}:{ok:!1,message:n(`configForm.invalidNumber`)}}try{let t=JSON.parse(this.draftValue);if(typeof t==`number`){let t=j(this.draftValue,!1);return typeof t==`number`?{ok:!0,value:t}:i&&W(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:n(`configForm.invalidNumber`)}}return{ok:!0,value:t}}catch{return i&&W(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:n(`configForm.invalidJson`)}}}commit(){let e=this.props;if(!e||e.disabled)return;let t=this.parseValue(e.schema);if(!t.ok){this.fail(`value`,t.message);return}if(!W(e.schema,t.value)){this.fail(`value`,[`number`,`integer`].includes(g(e.schema)??``)?n(`configForm.invalidNumber`):n(`configForm.invalidString`));return}if(e.existingValues?.some(e=>J(e,t.value))){this.fail(`value`,n(`configForm.invalidString`));return}if(e.validateValue&&!e.validateValue(t.value)){this.fail(`value`,n(`configForm.invalidString`));return}let r=this.draftKey.trim();if(e.existingKeys&&(!r||e.existingKeys.includes(r)||e.validateKey?.(r)===!1)){this.fail(`key`,n(`configForm.invalidString`));return}this.dispatchEvent(new CustomEvent(`config-collection-draft-commit`,{bubbles:!0,composed:!0,cancelable:!0,detail:{...e.existingKeys?{key:r}:{},value:t.value}}))?this.closeDraft():this.fail(`value`,n(`configForm.invalidString`))}updated(){let e=this.querySelector(`[data-collection-draft-key]`),t=this.querySelector(`[data-collection-draft-value]`);e?.setCustomValidity(this.invalidTarget===`key`?this.error:``),t?.setCustomValidity(this.invalidTarget===`value`?this.error:``)}render(){let e=this.props;if(!e||!this.draftOpen||e.disabled)return b;let t=g(e.schema),r=W(e.schema,null),i=t===`string`||t===`number`||t===`integer`,a=`${this.id}-error`,o=`${n(`configForm.add`)}: ${e.label}`,s=i?_`
          <input
            data-collection-draft-value
            type=${t===`string`?`text`:`number`}
            class="settings-input"
            aria-label=${o}
            aria-describedby=${a}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          />
        `:_`
          <textarea
            data-collection-draft-value
            class="settings-input"
            aria-label=${o}
            aria-describedby=${a}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            placeholder=${n(`configForm.jsonValue`)}
            rows="2"
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          ></textarea>
        `;return _`
      <div class="settings-row settings-row--stacked cfg-collection-draft">
        <div class="settings-row__control">
          <div class="cfg-collection-draft__controls">
            ${e.existingKeys?_`
                    <input
                      data-collection-draft-key
                      type="text"
                      class="settings-input"
                      aria-label=${n(`configForm.key`)}
                      aria-describedby=${a}
                      aria-invalid=${this.invalidTarget===`key`?`true`:`false`}
                      placeholder=${n(`configForm.key`)}
                      .value=${this.draftKey}
                      @input=${e=>{this.draftKey=e.currentTarget.value,this.clearError()}}
                    />
                  `:b}
            ${r?_`
                    <label class="field checkbox">
                      <input
                        data-collection-draft-null
                        type="checkbox"
                        .checked=${this.draftIsNull}
                        @change=${e=>{this.draftIsNull=e.currentTarget.checked,this.clearError()}}
                      />
                      <span>${n(`configForm.nullValue`)}</span>
                    </label>
                  `:b}
            ${s}
            <span id=${a} class="cfg-field__error" role="alert" ?hidden=${!this.error}
              >${this.error}</span
            >
            <div class="cfg-collection-draft__actions">
              <button type="button" class="btn btn--sm" @click=${()=>this.commit()}>
                ${e.existingKeys?n(`configForm.addEntry`):n(`configForm.add`)}
              </button>
              <button type="button" class="btn btn--sm" @click=${()=>this.closeDraft()}>
                ${n(`common.cancel`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}},t([k({attribute:!1})],Y.prototype,`props`,void 0),t([w()],Y.prototype,`draftOpen`,void 0),t([w()],Y.prototype,`draftKey`,void 0),t([w()],Y.prototype,`draftValue`,void 0),t([w()],Y.prototype,`draftIsNull`,void 0),t([w()],Y.prototype,`error`,void 0),t([w()],Y.prototype,`invalidTarget`,void 0),customElements.get(`testclaw-config-form-collection-draft`)||customElements.define(`testclaw-config-form-collection-draft`,Y)})))()}function dt(e,t){let{schema:r,value:i,path:a,hints:o,rawAvailable:s,maskSensitive:c,unsupported:l,disabled:u,reservedKeys:d,validateKey:f,onPatch:p,searchCriteria:h,revealSensitive:g,isSensitivePathRevealed:v,onToggleSensitivePath:y}=e,x=Ee(r),S=x?{}:we(r),C=U(a,`map-draft`),w={schema:r,label:n(`configForm.customEntries`),disabled:u,identity:JSON.stringify(a.filter(e=>typeof e==`string`)),sourceIdentity:e.sourceIdentity??i,existingKeys:[...new Set([...Object.keys(i),...d])],validateKey:f},T=Object.entries(i??{}).filter(([e])=>!d.has(e)),E=h&&de(h)?T.filter(([e,t])=>ue({schema:r,value:t,path:[...a,e],hints:o,criteria:h})):T;return h&&de(h)&&E.length===0?b:_`
    <div class="cfg-block cfg-map">
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${n(`configForm.customEntries`)}</span>
        </div>
        <div class="settings-row__control">
          <button
            type="button"
            class="btn btn--sm"
            aria-controls=${C}
            ?disabled=${u}
            @click=${e=>{if(S===Ae){lt(e,C);return}let t={...i},n=1,r=`custom-${n}`;for(;r in t;)n+=1,r=`custom-${n}`;t[r]=S,p(a,t)===!1&&lt(e,C)}}
          >
            ${n(`configForm.addEntry`)}
          </button>
        </div>
      </div>

      <testclaw-config-form-collection-draft
        id=${C}
        .props=${w}
        @config-collection-draft-commit=${e=>{let t=e.detail.key;(!t||Object.hasOwn(i,t)||d.has(t)||p(a,{...i,[t]:e.detail.value})===!1)&&e.preventDefault()}}
      ></testclaw-config-form-collection-draft>
      ${E.length===0?b:_`
              <div class="settings-subrows">
                ${E.map(([d,b])=>{let S=[...a,d],C=Re({path:S,value:b,hints:o,revealSensitive:g??!1,isSensitivePathRevealed:v});return _`
                    <div class="settings-row">
                      <div class="settings-row__text">
                        <input
                          type="text"
                          class="settings-input"
                          placeholder=${n(`configForm.key`)}
                          aria-label=${`${n(`configForm.key`)}: ${d}`}
                          .value=${d}
                          ?disabled=${u}
                          @change=${e=>{let t=e.currentTarget;if(!(t instanceof HTMLInputElement))return;let r=t.value.trim();if(!r||r===d){t.value=d;return}let o=f(r)?m(i[d])?n(`configForm.renameRedactedBlocked`):``:n(`configForm.invalidString`);if(r in i||o){t.value=d,o&&(t.setCustomValidity(o),t.reportValidity(),t.setCustomValidity(``));return}let s={...i,[r]:i[d]};delete s[d],p(a,s)===!1&&(t.value=d)}}
                        />
                      </div>
                      <div class="settings-row__control">
                        <testclaw-tooltip .content=${n(`configForm.removeEntry`)}>
                          <button
                            type="button"
                            class="btn btn--icon"
                            style="width:28px;height:28px;padding:0;"
                            aria-label=${n(`configForm.removeEntry`)}
                            ?disabled=${u}
                            @click=${()=>{let e={...i};delete e[d],p(a,e)}}
                          >
                            ${ee.trash}
                          </button>
                        </testclaw-tooltip>
                      </div>
                    </div>
                    ${x?K({label:d,showLabel:!1,stacked:!0,control:Ve({schema:r,path:S,ariaLabel:`${d}: ${n(`configForm.jsonValue`)}`,sourceValue:b,fallback:ze(b),rows:2,sensitiveState:C,disabled:u,isRequired:!0,onToggleSensitivePath:y,onPatch:p})}):t({schema:r,value:b,path:S,hints:o,rawAvailable:s,maskSensitive:c,unsupported:l,disabled:u,compact:e.compact,commitOnBlur:e.commitOnBlur,isRequired:!0,sourceIdentity:b,controlIdentity:i,searchCriteria:h,showLabel:!1,revealSensitive:g,isSensitivePathRevealed:v,onToggleSensitivePath:y,onPatch:p})}
                  `})}
              </div>
            `}
    </div>
  `}function ft(){return(ft=e((()=>{x(),M(),a(),p(),ut(),V(),Me(),ce(),H()})))()}function pt(e){let{schema:t,value:n,path:r,hints:i,unsupported:a,disabled:o,onPatch:u,onRemove:d,rawAvailable:f,maskSensitive:p,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g,searchCriteria:_}=e,v=_&&de(_)&&fe({schema:t,path:r,hints:i,criteria:_})?void 0:_,y=n===void 0&&t.default!==void 0,b=y?t.default:n,x=b===void 0?vt:b,S=b&&typeof b==`object`&&!Array.isArray(b)?b:{},C=Pe(t).map(e=>[e,ye(t,e)]).filter(e=>!!e[1]),w=Ne(t),T=C.toSorted((e,t)=>{let n=l([...r,e[0]],i)?.order??0,a=l([...r,t[0]],i)?.order??0;return n===a?e[0].localeCompare(t[0]):n-a}),E=new Set(C.map(([e])=>e)),D=Ce(t),O=!!D&&typeof D==`object`,k=(e,n)=>{if(e.length<r.length||!r.every((t,n)=>t===e[n]))return!1;let i,a=e.slice(r.length);if(a.length===0){if(!n||typeof n!=`object`||Array.isArray(n))return!1;i=n}else{try{i=structuredClone(S)}catch{return!1}n===void 0?s(i,a):c(i,a,n)}return De(t,S,i)?y?u(r,i)!==!1:(n===void 0&&d?d(e):u(e,n))!==!1:!1};return{fields:T.map(([t,n])=>({schema:y&&Object.hasOwn(S,t)?Fe(n,S[t]):n,value:y?void 0:S[t],path:[...r,t],hints:i,rawAvailable:f,maskSensitive:p,unsupported:a,disabled:o,compact:e.compact,commitOnBlur:e.commitOnBlur,isRequired:w.has(t),sourceIdentity:y?void 0:S[t],controlIdentity:e.controlIdentity??S,searchCriteria:v,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g,onPatch:k})),additional:O?{...e,schema:D,value:S,sourceIdentity:x,reservedKeys:E,validateKey:e=>Ue(t,e),searchCriteria:v,onPatch:k}:null}}function mt(e,t){let{schema:n,path:r,hints:i}=e,{label:a,help:o}=B(r,n,i),s=pt(e),c=_`
    ${s.fields.map(e=>t(e))}
    ${s.additional?dt(s.additional,t):b}
  `;return r.length===1||e.showLabel===!1?c:_`
    <details class="cfg-object cfg-block" ?open=${r.length<=2}>
      <summary class="settings-row cfg-object__summary">
        <div class="settings-row__text">
          <span class="settings-row__title">${a}</span>
          ${o?_`<span class="settings-row__desc">${o}</span>`:b}
        </div>
        <div class="settings-row__control">
          <span class="settings-row__chevron cfg-object__chevron">${ee.chevronRight}</span>
        </div>
      </summary>
      <div class="settings-subrows">${c}</div>
    </details>
  `}function ht(e,t){return _`${bt(e,t)}`}function gt(e,t,r){let{schema:i,value:a,path:o,hints:s,unsupported:c,disabled:l,onPatch:u,searchCriteria:d,rawAvailable:f,maskSensitive:p,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g}=e,v=e.showLabel??!0,y=e.showHeaderMeta??v,{label:x,help:S}=B(o,i,s),w=d&&de(d)&&fe({schema:i,path:o,hints:s,criteria:d})?void 0:d,T=Array.isArray(i.items)?i.items:void 0,E=Array.isArray(i.items)?i.items[0]??{}:i.items;if(!E)return K({label:x,showLabel:!0,control:b,error:n(`configForm.unsupportedArray`)});let D=a===void 0&&Array.isArray(i.default),O=Array.isArray(a)?a:Array.isArray(i.default)?i.default:[],k=Array.isArray(a)?a:Array.isArray(i.default)?i.default:_t,A=Oe(e,O),j=r.read(O),M=(e,t)=>r.patch(e,t,e=>u(o,e)),{minItems:N,maxItems:P,uniqueItems:F}=He(i),I=e=>ve(i,e)??(T?{}:E),{atomicCandidate:L,autoCandidate:R}=at({schema:i,value:O,minimumItems:N,maximumItems:P,uniqueItems:F,isUnset:a===void 0,isRequired:e.isRequired??!1,itemSchemaAt:I}),te=P===void 0||O.length<P,ne=L===void 0&&R===void 0,re=I(O.length),z=U(o,`array-draft`),ae={schema:re,label:x,disabled:l||!te,identity:JSON.stringify(o.filter(e=>typeof e==`string`)),sourceIdentity:k,existingValues:F?O:void 0,validateValue:e=>{let t=[...O,e];return(P===void 0||t.length<=P)&&(t.length<N||W(i,t))}},oe=(e,t)=>{if(e.length<=o.length||!o.every((t,n)=>t===e[n]))return!1;let n=e.slice(o.length),r=n[0];if(typeof r!=`number`||r<0||r>=O.length)return!1;let a=[...O],s=n.slice(1);if(s.length===0){if(t===void 0)return!1;a[r]=t}else{let e=Xe(O[r],s,t);if(!e.ok)return!1;a[r]=e.value}return We(i,O,a,F,!0)?M(a,j):!1};return _`
    <div class="cfg-block cfg-array">
      <div class="settings-row">
        <div class="settings-row__text">
          ${v?_`<span class="settings-row__title">${x}</span>`:b}
          ${y&&S?_`<span class="settings-row__desc">${S}</span>`:b}
          ${y&&A!==b?_`<span class="settings-row__desc">${A}</span>`:b}
        </div>
        <div class="settings-row__control">
          ${e.compact?b:_`
                  <span class="settings-row__value"
                    >${n(O.length===1?`configForm.itemCountOne`:`configForm.itemCount`,{count:String(O.length)})}</span
                  >
                `}
          <button
            type="button"
            class=${e.compact?`btn btn--sm btn--icon`:`btn btn--sm`}
            aria-label=${n(`configForm.add`)}
            aria-controls=${z}
            ?disabled=${l||!te&&L===void 0}
            @click=${e=>{if(L)u(o,L)===!1&&lt(e,z);else if(ne)lt(e,z);else if(R){let t=Array.from({length:R.length-O.length},()=>Symbol(`array-row`));M(R,[...j,...t])||lt(e,z)}}}
          >
            ${e.compact?ee.plus:n(`configForm.add`)}
          </button>
        </div>
      </div>
      <testclaw-config-form-collection-draft
        id=${z}
        .props=${ae}
        @config-collection-draft-commit=${e=>{let t=[...O,e.detail.value],n=!(F&&O.some(t=>J(t,e.detail.value)))&&(P===void 0||O.length<P)&&W(re,e.detail.value)&&(t.length<N||W(i,t)),r=!1;n&&(r=M(t,[...j,Symbol(`array-row`)])),r||e.preventDefault()}}
      ></testclaw-config-form-collection-draft>
      ${O.length===0?e.compact?b:ie(n(`configForm.noItems`)):_`
              <div class="settings-subrows">
                ${C(O,(e,t)=>j[t],(r,a)=>{let u=I(a),d=O.toSpliced(a,1),v=We(i,O,d,F,!1),y=_` <testclaw-tooltip
                      .content=${n(`configForm.removeItem`)}
                    >
                      <button
                        type="button"
                        class="btn btn--icon"
                        style="width:28px;height:28px;padding:0;"
                        aria-label=${n(`configForm.removeItem`)}
                        ?disabled=${l||O.length<=N||!v}
                        @click=${e=>{let t=e.currentTarget===document.activeElement,n=document.activeElement?.closest(`.cfg-array`)?.querySelector(`button[aria-controls]`);v&&M(d,j.toSpliced(a,1))&&t&&queueMicrotask(()=>{document.activeElement===document.body&&n?.focus()})}}
                      >
                        ${ee.trash}
                      </button>
                    </testclaw-tooltip>`,b=t({schema:D?Fe(u,r):u,value:D?void 0:r,path:[...o,a],hints:s,rawAvailable:f,maskSensitive:p,unsupported:c,disabled:l,compact:e.compact,commitOnBlur:e.commitOnBlur,isRequired:!0,sourceIdentity:D?void 0:r,controlIdentity:O,searchCriteria:w,showLabel:!1,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g,onPatch:oe});return e.compact?_`<div class="cfg-array__item">
                        <div class="cfg-array__value">${b}</div>
                        ${y}
                      </div>`:_`
                      <div class="settings-row">
                        <div class="settings-row__text">
                          <span class="settings-row__title">#${a+1}</span>
                        </div>
                        <div class="settings-row__control">${y}</div>
                      </div>
                      ${b}
                    `})}
              </div>
            `}
    </div>
  `}var _t,vt,yt,bt;function xt(){return(xt=e((()=>{x(),v(),O(),M(),a(),p(),ot(),ct(),ut(),Qe(),he(),V(),ft(),Me(),ce(),H(),R(),_t=Symbol(`unset-array-source`),vt=Symbol(`unset-map-source`),yt=class extends D{constructor(...e){super(...e),this.rows=new st,this.field=``}render(e,t){let n=JSON.stringify(e.path.filter(e=>typeof e==`string`));return n!==this.field&&(this.rows=new st,this.field=n),gt(e,t,this.rows)}},bt=y(yt)})))()}function St(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=e.showLabel??!0,{label:c,help:l}=B(r,t,i),u=e.descriptionId??(s&&l?U(r,`description`):void 0),d=ze(n===void 0?t.default:n),f=Re({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),p=Ve({schema:t,path:r,ariaLabel:c,descriptionId:u,sourceValue:e.sourceIdentity??n,fallback:d,rows:3,sensitiveState:f,disabled:a,isRequired:e.isRequired,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:o});return K({label:c,help:l,helpId:u,defaultDescription:f.isRedacted?b:G(t,n),showLabel:s,stacked:!0,control:p})}function Ct(){return(Ct=e((()=>{x(),Me(),ce(),H()})))()}function wt(e,t){let n=e.trim();if(n.startsWith(`+`))try{let e=Ke(n,{extract:!1});if(!e?.isPossible())return;let r=e.formatInternational();return!e.country||Tt.has(e.countryCallingCode)?r:`${new Intl.DisplayNames(t?[t]:void 0,{type:`region`}).of(e.country)||e.country} · ${r}`}catch{return}}var Tt;function Et(){return(Et=e((()=>{Je(),qe(),Tt=new Set(Object.entries(Ge.country_calling_codes).filter(([,e])=>e.length>1).map(([e])=>e))})))()}function Dt(e){if(typeof e==`string`)return`string`;if(typeof e==`number`)return`number`;if(typeof e==`boolean`)return`boolean`}function Ot(e,t,n){if(!(e instanceof HTMLInputElement))return;let r=Z.get(e),i=r?.edit!==void 0&&e.ownerDocument.activeElement===e&&r.pathKey===t&&r.presentationIdentity===n;Z.set(e,{edit:i?r.edit:void 0,pathKey:t,presentationIdentity:n})}function kt(e,t){let n=Z.get(e);return n?(n.edit??={branch:t},n.edit):{branch:t}}function At(e,t){return Z.get(e)?.edit??{branch:t}}function jt(e){let t=Z.get(e);t&&(t.edit=void 0)}function Mt(e){e.currentTarget instanceof HTMLInputElement&&jt(e.currentTarget)}function X(e,t){e.setCustomValidity(t),e.setAttribute(`aria-invalid`,String(!!t));let n=e.closest(`.settings-row`)?.querySelector(`.cfg-field__error`);return n&&(n.hidden=!t,n.textContent=t),!t}function Nt(e,t,n,r,i,a,o){if(!(e instanceof HTMLInputElement))return;let s=Pt.get(e);s&&(!Object.is(s.sourceIdentity,n)||s.pathKey!==r||s.presentationIdentity!==i||s.renderedValue!==a?e.matches(`:focus`)&&e.value!==s.renderedValue?o(e):(e.value=a,X(e,``)):Object.is(s.controlIdentity,t)||o(e)),Pt.set(e,{controlIdentity:t,sourceIdentity:n,pathKey:r,presentationIdentity:i,renderedValue:a})}var Z,Pt;function Ft(){return(Ft=e((()=>{Z=new WeakMap,Pt=new WeakMap})))()}function It(e,t,n,r){let i=e.trim(),a=t.anyOf??t.oneOf??[],o=W(t,e),s=r?r.branch:Dt(n),c=i===`true`||i!==`false`&&void 0;if(c!==void 0&&W(t,c)){let e=!1,t=!1;for(let n of a)(g(n)===`boolean`||typeof n.const==`boolean`||n.enum?.some(e=>typeof e==`boolean`))&&W(n,c)&&(e=!0,t||=Object.is(n.const,c)||!!n.enum?.some(e=>Object.is(e,c)));if(e&&(s!==`string`||t||!o))return c}let l;for(let n of a){let r=g(n);if(r!==`number`&&r!==`integer`)continue;let i=j(e,r===`integer`);if(typeof i==`number`&&W(t,i)){l=i;break}}if(s===`number`){if(l!==void 0)return l;if(N(e))return o&&P(i)?e:void 0}return s===`string`&&o||l===void 0?e:l}function Lt(e,t,r,i){return W(t,It(e,t,r,i))?``:n(`configForm.invalidString`)}function Rt(e,t,n,r,i){return e===``&&!n&&!!Lt(e,t,r,i)}function zt(e,t){return W(t,e)?``:n(`configForm.invalidNumber`)}function Bt(e,t){let n=e.value;if(n.trim()===``)return e.validity.badInput?{kind:`invalid`}:{kind:`empty`};let r=j(n,g(t)===`integer`);return typeof r==`number`?{kind:`value`,parsed:r,message:zt(r,t)}:{kind:`invalid`}}function Vt(e,t){return e.kind===`value`?e.message:e.kind===`invalid`||t?n(`configForm.invalidNumber`):``}function Ht(e,t,n,r){X(e,Vt(t,n.isRequired===!0))&&(t.kind===`empty`?r(void 0):t.kind===`value`&&r(t.parsed))}function Ut(e,t,n){return Vt(Bt(e,t),n)}function Wt(e){let{schema:t,value:r,path:i,hints:a,disabled:s,onPatch:c,inputType:u}=e,d=e.showLabel??!0,f=l(i,a),{label:p,help:m}=B(i,t,a),h=e.descriptionId??(d&&m?U(i,`description`):void 0),g=U(i,`scalar-error`),v=Re(e),y=typeof r==`object`&&!!r&&!Array.isArray(r),x=Ie(r),C=e.rawAvailable??!0,w=v.isMasked,T=v.isRedacted&&!w||v.sentinelRedacted||x,E=T?x?n(C?`configForm.structuredSecretRaw`:`configForm.structuredSecretFile`):w?`••••••••`:Se():f?.placeholder??(!w&&t.default!==void 0?n(`configForm.defaultValue`,{value:q(t.default)}):``),D=T?``:y?ze(r):r??(e.compact?t.default:void 0)??``,O=r===void 0?t.default:r,k=Dt(O),ee=w?`password`:v.isSensitive&&!T?`text`:u,A=f?.presentation===`phone-number`,j=A&&!T&&!w&&typeof r==`string`?wt(r,o.getLocale()):void 0,M=e.controlIdentity??e.sourceIdentity??r,N=e.sourceIdentity??r,P=U(i.filter(e=>typeof e==`string`),`scalar-identity`),F=q(D),I=[T?`redacted`:`visible`,ee,A?`phone`:`plain`,x?C?`secret-raw`:`secret-file`:`scalar`].join(`:`),L=n=>{if(T){X(n,``);return}if(u===`number`){X(n,Ut(n,t,e.isRequired===!0));return}let r=n.value,i=At(n,k);X(n,Rt(r,t,e.isRequired===!0,O,i)?``:Lt(r,t,O,i))},R=(e,t)=>c(i,t)!==!1||(e.value=F,L(e),!1),te=n=>{if(T)return;if(u===`number`){Ht(n,Bt(n,t),e,e=>R(n,e));return}let r=kt(n,k),i=n.value,a=Lt(i,t,O,r);if(!a&&!A){X(n,``),R(n,It(i,t,O,r)),jt(n);return}let o=i.trim();if(Rt(o,t,e.isRequired===!0,O,r)){n.value=o,X(n,``),R(n,void 0),jt(n);return}if(Lt(o,t,O,r)){X(n,a),jt(n);return}n.value=o,X(n,``),R(n,It(o,t,O,r)),jt(n)},ne=_`
    <input
      ${S(e=>{Ot(e,P,I),Nt(e,M,N,P,I,F,L)})}
      type=${ee}
      class="settings-input${T?` cfg-redacted`:``}"
      aria-label=${p}
      aria-describedby=${[h,g].filter(Boolean).join(` `)}
      aria-invalid="false"
      placeholder=${E}
      .value=${F}
      ?disabled=${s}
      ?readonly=${T}
      @click=${()=>{v.isRedacted&&!x&&e.onToggleSensitivePath&&e.onToggleSensitivePath(i)}}
      @input=${n=>{if(T)return;let r=n.target;if(e.commitOnBlur){kt(r,k),L(r);return}let i=r.value;if(u===`number`){Ht(r,Bt(r,t),e,e=>R(r,e));return}let a=kt(r,k);Rt(i,t,e.isRequired===!0,O,a)?(X(r,``),R(r,void 0)):X(r,Lt(i,t,O,a))&&R(r,It(i,t,O,a))}}
      @change=${t=>{!e.commitOnBlur&&u!==`number`&&te(t.target)}}
      @blur=${t=>{let n=t.target;e.commitOnBlur&&n.value!==F&&te(n),Mt(t)}}
    />
  `,re=x?b:Le({path:i,state:v,disabled:s,onToggleSensitivePath:e.onToggleSensitivePath}),z=je(ne,re),ie=A?_`
        <span class="settings-phone-presentation">
          ${z}
          ${j?_`<span class="settings-phone-presentation__value">${j}</span>`:b}
        </span>
      `:z;return K({label:p,help:m,helpId:h,defaultDescription:T||w?b:G(t,r),showLabel:d,control:ie,errorId:g})}function Gt(e){let{schema:t,value:r,path:i,hints:a,disabled:o,onPatch:s}=e,c=e.showLabel??!0,{label:u,help:d}=B(i,t,a),f=e.descriptionId??(c&&d?U(i,`description`):void 0),p=U(i,`scalar-error`),m=r??(e.compact?t.default:void 0)??``,h=r===void 0?t.default:r,g=be(t),v=typeof g.step==`number`?g.step:1,y=e.controlIdentity??e.sourceIdentity??r,x=e.sourceIdentity??r,C=U(i.filter(e=>typeof e==`string`),`scalar-identity`),w=q(m),T=n=>{X(n,Ut(n,t,e.isRequired===!0))},E=(e,t)=>s(i,t)!==!1||(e.value=w,T(e),!1),D=e=>{if(o)return;let n=Number(h),r=xe((Number.isFinite(n)?n:0)+e*v,t);W(t,r)&&s(i,r)},O=_`
    ${e.compact?b:_` <button
            type="button"
            class="btn btn--sm btn--icon"
            aria-label=${`${u}: -${v}`}
            ?disabled=${o}
            @click=${()=>D(-1)}
          >
            −
          </button>`}
    <input
      ${S(e=>Nt(e,y,x,C,`number`,w,T))}
      type="number"
      class="settings-input"
      aria-label=${u}
      aria-describedby=${[f,p].filter(Boolean).join(` `)}
      aria-invalid="false"
      placeholder=${l(i,a)?.placeholder??(t.default===void 0?b:n(`configForm.defaultValue`,{value:q(t.default)}))}
      min=${g.min??b}
      max=${g.max??b}
      step=${g.step}
      .value=${w}
      ?disabled=${o}
      @keydown=${t=>{!e.compact&&r===void 0&&h!==void 0&&(t.key===`ArrowUp`||t.key===`ArrowDown`)&&(t.preventDefault(),D(t.key===`ArrowUp`?1:-1))}}
      @input=${n=>{let r=n.target;if(e.commitOnBlur){T(r);return}Ht(r,Bt(r,t),e,e=>E(r,e))}}
      @change=${n=>{if(e.commitOnBlur)return;let r=n.target,i=Bt(r,t);if(i.kind!==`value`){X(r,Vt(i,e.isRequired===!0));return}let a=xe(i.parsed,t);r.value=q(a),X(r,zt(a,t))&&E(r,a)}}
      @blur=${n=>{let r=n.target;if(!e.commitOnBlur||r.value===w)return;let i=Bt(r,t);i.kind===`value`&&(i.parsed=xe(i.parsed,t),i.message=zt(i.parsed,t),r.value=q(i.parsed)),Ht(r,i,e,e=>E(r,e))}}
    />
    ${e.compact?b:_` <button
            type="button"
            class="btn btn--sm btn--icon"
            aria-label=${`${u}: +${v}`}
            ?disabled=${o}
            @click=${()=>D(1)}
          >
            +
          </button>`}
  `;return K({label:u,help:d,helpId:f,defaultDescription:G(t,r),showLabel:c,control:O,errorId:p})}function Kt(e){let{schema:t,value:r,path:i,hints:a,disabled:o,options:s,onPatch:c}=e,u=e.showLabel??!0,{label:d,help:f}=B(i,t,a),p=e.descriptionId??(u&&f?U(i,`description`):void 0),m=r===void 0&&t.default!==void 0,h=m?t.default:r,g=s.findIndex(e=>J(e,h)),v=`__unset__`,y=`__null__`,x=t.nullable&&t.enumIncludesNull,S=m?v:h===null&&x?y:g>=0?String(g):v,C=_`
    <select
      class="settings-select"
      aria-label=${d}
      aria-describedby=${p??b}
      ?disabled=${o}
      .value=${S}
      @change=${n=>{let r=n.target,a=r.value;if(a===v&&e.isRequired&&t.default===void 0){r.value=S;return}if(a===v){(e.isRequired&&t.default!==void 0?c(i,structuredClone(t.default)):e.onRemove?e.onRemove(i):c(i,void 0))===!1&&(r.value=S);return}let o=a===y?null:s[Number(a)];c(i,o)===!1&&(r.value=S)}}
    >
      <option
        value=${v}
        ?selected=${S===v}
        ?disabled=${e.isRequired&&t.default===void 0}
      >
        ${t.default===void 0?l(i,a)?.placeholder??n(`configForm.select`):n(`configForm.defaultValue`,{value:q(t.default)})}
      </option>
      ${x?_`
              <option value=${y} ?selected=${S===y}>
                ${n(`configForm.nullValue`)}
              </option>
            `:b}
      ${s.map((e,t)=>_`
          <option value=${String(t)} ?selected=${S===String(t)}>
            ${Be(e,s)}
          </option>
        `)}
    </select>
  `;return K({label:d,help:f,helpId:p,defaultDescription:G(t,r),showLabel:u,control:C})}function qt(){return(qt=e((()=>{Et(),x(),T(),a(),V(),Me(),A(),Ft(),ce(),H()})))()}function Q(e){let{schema:t,value:r,path:i,hints:a,unsupported:o,disabled:s,onPatch:c}=e,u=e.showLabel??!0,f=g(t),{label:p,help:m}=B(i,t,a),h=d(i),v=e.searchCriteria;if(o.has(h)||[...o].some(e=>{if(!e.includes(`*`))return!1;let t=e.split(`.`);return t.length===i.length&&t.every((e,t)=>e===`*`||e===String(i[t]))}))return K({label:p,showLabel:!0,control:b,error:n(`configForm.unsupportedNode`)});if(v&&de(v)&&!ue({schema:t,value:r,path:i,hints:a,criteria:v}))return b;let y=et(e);if(tt(e,y)){let t={identity:JSON.stringify(i.filter(e=>typeof e==`string`)),sourceIdentity:e.sourceIdentity??r,initialValue:y,params:e,renderNode:Q};return _`
      <testclaw-config-form-structured-draft
        class="cfg-structured-draft"
        .props=${t}
      ></testclaw-config-form-structured-draft>
    `}if(t.anyOf||t.oneOf){let n=(t.anyOf??t.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(n.length===1){let t=n[0];return t?Q({...e,schema:t}):b}let a=n.map(e=>{if(e.const!==void 0)return e.const;if(e.enum&&e.enum.length===1)return e.enum[0]}),o=a.every(e=>e!==void 0);if(o&&a.length>0&&a.length<=5){let n=r===void 0?t.default:r;return K({label:p,help:m,defaultDescription:G(t,r),showLabel:u,control:ke({options:a,resolvedValue:n,disabled:s,ariaLabel:p,descriptionId:e.descriptionId,onSelect:e=>c(i,e)})})}if(o&&a.length>5)return Kt({...e,options:a});let l=new Set(n.map(e=>g(e)).filter(Boolean)),d=new Set([...l].map(e=>e===`integer`?`number`:e));if(e.maskSensitive===!0&&Array.isArray(t.type)&&d.size===2&&d.has(`string`)&&d.has(`object`)&&(r===void 0||typeof r==`string`||Ie(r)))return Wt({...e,inputType:`text`});if([...d].every(e=>[`string`,`number`,`boolean`].includes(e))){let n=d.has(`string`),r=d.has(`number`);if(d.has(`boolean`)&&d.size===1)return Q({...e,schema:{...t,type:`boolean`,anyOf:void 0,oneOf:void 0}});if(n||r)return Wt({...e,inputType:r&&!n?`number`:`text`})}return St(e)}if(t.enum){let n=t.enum;if(n.length<=5&&!(t.nullable&&t.enumIncludesNull)){let a=r===void 0?t.default:r;return K({label:p,help:m,defaultDescription:G(t,r),showLabel:u,control:ke({options:n,resolvedValue:a,disabled:s,ariaLabel:p,descriptionId:e.descriptionId,onSelect:e=>c(i,e)})})}return Kt({...e,options:n})}if(f===`object`)return mt(e,Q);if(f===`array`)return ht(e,Q);if(f===`boolean`){if(!e.isRequired&&l(i,a)?.placeholder)return Kt({...e,options:[!0,!1]});let n=typeof r==`boolean`?r:typeof t.default==`boolean`&&t.default,o=e=>c(i,e);if(e.compact)return K({label:p,help:m,showLabel:u,control:_`<input
          type="checkbox"
          aria-label=${p}
          aria-describedby=${e.descriptionId??b}
          .checked=${n}
          ?disabled=${s}
          @change=${e=>{let t=e.currentTarget;o(t.checked)===!1&&(t.checked=n)}}
        />`});if(!u)return K({label:p,help:m,showLabel:u,control:F({checked:n,disabled:s,ariaLabel:p,onChange:o})});let d=m||t.default!==void 0?_`
            ${m??b} ${m&&t.default!==void 0?_`<br />`:b}
            ${G(t,r)}
          `:void 0;return I({title:p,description:d,checked:n,disabled:s,onChange:o})}return f===`number`||f===`integer`?Gt(e):f===`string`?Wt({...e,inputType:`text`}):Ee(t)?St(e):K({label:p,showLabel:!0,control:b,error:n(`configForm.unsupportedType`,{type:String(f)})})}function Jt(){return(Jt=e((()=>{x(),a(),rt(),xt(),Ct(),qt(),Me(),ce(),H(),R()})))()}function Yt(e){let t=le({schema:e.schema,path:e.path.map(String),hints:e.hints});return _`
    <div class="config-tier-groups">
      ${t.common||e.commonPrelude?_`<div class="settings-group">
              ${e.commonPrelude??b}${t.common?e.renderTier(t.common):b}
            </div>`:b}
      ${t.advanced&&t.advancedLeafCount>0?_`<details
              class="config-advanced-disclosure"
              ?open=${e.revealAdvanced}
              @toggle=${t=>{let n=t.currentTarget;n instanceof HTMLDetailsElement&&n.open!==e.revealAdvanced&&(n.open?e.onShowAdvanced():e.onHideAdvanced?e.onHideAdvanced():n.open=!0)}}
            >
              <summary class="settings-section__heading config-advanced-disclosure__summary">
                ${n(`configForm.advancedSettings`)}
              </summary>
              ${e.revealAdvanced?_`<div class="settings-group">${e.renderTier(t.advanced)}</div>`:b}
            </details>`:b}
    </div>
  `}function Xt(e){let t=me[e.key];return ae({key:e.key,schema:e.schema,value:e.sectionValue,hints:e.uiHints,query:e.query,label:t?.label,description:t?.description})}function Zt(e){if(!e.schema)return _` <div class="muted">${n(`configForm.schemaUnavailable`)}</div> `;let t=e.schema,r=e.value??{};if(g(t)!==`object`||!t.properties)return _` <div class="callout danger">${n(`configForm.unsupportedSchema`)}</div> `;let i=new Set(e.unsupportedPaths??[]),a=t.properties,o=e.searchQuery??``,s=oe(o),c=e.activeSection,d=e.activeSubsection??null,p=Object.entries(a).toSorted((t,n)=>{let r=l([t[0]],e.uiHints)?.order??50,i=l([n[0]],e.uiHints)?.order??50;return r===i?t[0].localeCompare(n[0]):r-i}).filter(([t,n])=>!(c&&t!==c||o&&!Xt({key:t,schema:n,sectionValue:r[t],uiHints:e.uiHints,query:o}))),m=null;if(c&&d&&p.length===1){let e=p[0]?.[1];e&&g(e)===`object`&&e.properties&&e.properties[d]&&(m={sectionKey:c,subsectionKey:d,schema:e.properties[d]})}if(p.length===0)return e.embedded&&!o?b:re(ie(o?n(`configForm.noSettingsMatch`,{query:o}):n(`configForm.noSettingsInSection`)));let h=t=>{let r=l(t.path.slice(0,1),e.uiHints),a=e.showSectionDocs===!1?void 0:r?.docsUrl,c=`settings-section-help-${t.id}`,u=e.showAdvanced===!0||e.forceAdvancedSection===t.path[0]||!!o;return _`
      <section class="settings-section" id=${t.id}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${t.label}</h2>
          ${e.sectionActions||a?_`<div class="settings-section__actions">
                  ${e.sectionActions??b}
                  ${a?_`
                          <span class="settings-section__docs">
                            ${z({id:c,label:n(`configForm.sectionHelp`,{section:t.label}),tooltip:n(`configForm.sectionHelp`,{section:t.label}),icon:`question`,popoverId:`settings-section-help-popover-${t.id}`})}
                            <wa-popover
                              ${S(te)}
                              id=${`settings-section-help-popover-${t.id}`}
                              class="settings-section__help-popover"
                              for=${c}
                              placement="bottom-end"
                            >
                              <div class="settings-section__help-panel">
                                ${t.description?_`<p>${t.description}</p>`:b}
                                ${L(a)}
                              </div>
                            </wa-popover>
                          </span>
                        `:b}
                </div>`:b}
        </div>
        ${t.description?_`<p class="settings-section__desc">${t.description}</p>`:b}
        ${Yt({schema:t.node,path:t.path,hints:e.uiHints,revealAdvanced:u,onShowAdvanced:e.onShowAdvanced,onHideAdvanced:e.showAdvanced===!0&&e.forceAdvancedSection!==t.path[0]&&!o?e.onHideAdvanced:void 0,renderTier:n=>Q({schema:n,value:t.nodeValue,path:t.path,hints:e.uiHints,rawAvailable:e.rawAvailable??!0,unsupported:i,disabled:e.disabled??!1,showLabel:!1,showHeaderMeta:!0,searchCriteria:s,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:e.onPatch,onRemove:e.onRemove}),commonPrelude:e.sectionPrelude})}
      </section>
    `};return re(m?(()=>{let{sectionKey:t,subsectionKey:n,schema:i}=m,a=f([t,n],e.uiHints),o=a?.label??i.title??u(n),s=a?.help??i.description??``,c=r[t],l=c&&typeof c==`object`?c[n]:void 0;return h({id:`config-section-${t}-${n}`,label:o,description:s,node:i,nodeValue:l,path:[t,n]})})():p.map(([e,t])=>{let n=me[e]??{label:e.charAt(0).toUpperCase()+e.slice(1),description:t.description??``};return h({id:`config-section-${e}`,label:n.label,description:n.description,node:t,nodeValue:r[e],path:[e]})}))}function Qt(){return(Qt=e((()=>{x(),T(),a(),se(),Jt(),ce(),H(),pe(),R(),ne()})))()}function $t(e){return Object.keys(e??{}).filter(e=>!vn.has(e)).length===0}function en(e){let t=e.filter(e=>e!=null),n=t.length!==e.length;return{enumValues:tn(t),nullable:n}}function tn(e){let t=[];for(let n of e)t.some(e=>Object.is(e,n))||t.push(n);return t}function nn(e,t=new Set){if(t.has(e))return new Set;t.add(e);let n=new Set,r=Array.isArray(e.type)?e.type:e.type?[e.type]:[];for(let e of r)e!==`null`&&n.add(e);n.size===0&&(e.properties||e.additionalProperties)&&n.add(`object`);for(let r of e.allOf??[])for(let e of nn(r,t))n.add(e);return t.delete(e),n}function rn(e){if(e.size===1)return e.values().next().value;if(e.size>1&&[...e].every(e=>e===`number`||e===`integer`))return e.has(`integer`)?`integer`:`number`}function an(e){return e.size>1&&rn(e)===void 0}function on(e){return rn(nn(e))}function sn(e){return!!(on(e)||e.items||e.enum||e.anyOf||e.oneOf||e.allOf)}function cn(e){return un(e,yn)}function ln(e){if(!un(e,bn))return!1;if(e.not===void 0)return!0;if(on(e)!==`object`||!e.not||typeof e.not!=`object`||Array.isArray(e.not))return!1;let t=e.not.required;return Array.isArray(t)&&t.length>0&&t.every(e=>typeof e==`string`)&&Object.keys(e.not).every(e=>e===`required`||vn.has(e))}function un(e,t){return Object.keys(e).every(n=>t.has(n)||n===`propertyNames`&&typeof e.propertyNames==`object`&&e.propertyNames!==null&&!Array.isArray(e.propertyNames)&&h(e.propertyNames)&&$({type:`string`,...e.propertyNames},[]).unsupportedPaths.length===0)}function dn(e,t=new Set){if(t.has(e))return!1;t.add(e);let n=Array.isArray(e.type)?e.type:e.type?[e.type]:[],r=e.nullable===!0||n.length===0||n.includes(`null`);return e.const!==void 0&&(r&&=e.const===null),e.enum&&(r&&=e.enum.some(e=>e===null)),e.allOf&&(r&&=e.allOf.every(e=>dn(e,t))),e.anyOf&&(r&&=e.anyOf.some(e=>dn(e,t))),e.oneOf&&(r&&=e.oneOf.filter(e=>dn(e,t)).length===1),t.delete(e),r}function fn(e){let t=_e(e);if(t.length<=1)return!1;let n=new Set(t.flatMap(e=>Object.keys(e.properties??{})));return t.some(e=>{let t=e.additionalProperties;return!!t&&typeof t==`object`&&Object.keys(t).length>0&&[...n].some(t=>!Object.hasOwn(e.properties??{},t))})}function pn(e){return!e||typeof e!=`object`?{schema:null,unsupportedPaths:[`<root>`]}:$(e,[])}function $(e,t,n=!1,r,i){let a=e;if(!n&&!e.anyOf&&!e.oneOf&&!e.allOf&&Array.isArray(e.type)&&new Set(e.type.filter(e=>e!==`null`)).size>1&&(e.type.every(e=>e===`null`||xn.has(e))||e.type.every(e=>[`string`,`object`,`null`].includes(e)))){let t=e.type.includes(`object`)?[`string`,...e.type.filter(e=>e!==`string`)]:e.type;a={...e,type:t.includes(`object`)?t:void 0,anyOf:t.map(e=>({type:e}))}}let o=new Set,s={...a},c=d(t)||`<root>`;if(ln(a)||o.add(c),a.anyOf||a.oneOf){let e=_n(a,t);return e?{schema:e.schema,unsupportedPaths:Array.from(new Set([...o,...e.unsupportedPaths]))}:{schema:a,unsupportedPaths:[c]}}let l=Array.isArray(a.type)?a.type.filter(e=>e!==`null`):[],u=nn(a),f=n&&!!r&&a.type===void 0&&u.size===0;f&&r&&u.add(r),n&&r&&u.size>0&&an(new Set([...u,r]))&&o.add(c),(new Set(l).size>1||an(u))&&o.add(c);let p=rn(u),m=dn(a)&&(i===void 0||i);if(a.allOf){let e=[];for(let n of a.allOf){if(!n||typeof n!=`object`){o.add(c);continue}if(!sn(n)){e.push(n),cn(n)||o.add(c);continue}let r=$(n,t,!0,p,m);e.push(r.schema??n);for(let e of r.unsupportedPaths)o.add(e)}s.allOf=e}s.type=p??a.type,s.nullable=m;let h=a.properties!==void 0||a.additionalProperties!==void 0,g=a.items!==void 0||a.additionalItems!==void 0;if(s.enum){let{enumValues:e,nullable:t}=en(s.enum);s.enum=e,s.enumIncludesNull=t&&m,e.length===0&&o.add(c)}if(a.allOf&&m&&!s.enumIncludesNull&&o.add(c),p===`object`&&(!f||h)){let e=a.properties??{},r=new Set(Pe(a)),i=Ce(a);[...Ne(a)].some(e=>!r.has(e))&&!i&&o.add(c),fn(a)&&o.add(c);let l={};for(let[r,i]of Object.entries(e)){if(n&&!sn(i)){l[r]=i,cn(i)||o.add(d([...t,r])||`<root>`);continue}let e=$(i,[...t,r],n);e.schema&&(l[r]=e.schema);for(let t of e.unsupportedPaths)o.add(t)}if(s.properties=l,a.allOf)for(let e of Pe(a)){let n=ye(a,e);if(!n)continue;let r=$(n,[...t,e]);for(let e of r.unsupportedPaths)o.add(e)}if(a.additionalProperties===!0)s.additionalProperties={};else if(a.additionalProperties===!1)s.additionalProperties=!1;else if(a.additionalProperties&&typeof a.additionalProperties==`object`&&!$t(a.additionalProperties)){let e=$(a.additionalProperties,[...t,`*`],n);s.additionalProperties=e.schema??a.additionalProperties;for(let t of e.unsupportedPaths)o.add(t)}}else if(p===`array`&&(!f||g)){if(Array.isArray(a.items)){let e=[];for(let r=0;r<a.items.length;r+=1){let i=a.items[r];if(!i){o.add(c);continue}if(n&&!sn(i)){e.push(i),cn(i)||o.add(c);continue}let s=$(i,[...t,r],n);e.push(s.schema??i);for(let e of s.unsupportedPaths)o.add(e)}if(s.items=e,a.additionalItems&&typeof a.additionalItems==`object`){if(n&&!sn(a.additionalItems))s.additionalItems=a.additionalItems,cn(a.additionalItems)||o.add(c);else{let e=$(a.additionalItems,[...t,`*`],n);s.additionalItems=e.schema??a.additionalItems;for(let t of e.unsupportedPaths)o.add(t)}}else s.additionalItems=a.additionalItems}else if(!a.items)o.add(c);else if(n&&!sn(a.items))s.items=a.items,cn(a.items)||o.add(c);else{let e=$(a.items,[...t,`*`],n);s.items=e.schema??a.items;for(let t of e.unsupportedPaths)o.add(t)}if(a.allOf)for(let e of ge(a)){let n=ve(a,e);if(!n)continue;let r=$(n,[...t,e]);for(let e of r.unsupportedPaths)o.add(e)}}else(!f||p!==`object`&&p!==`array`)&&p!==`string`&&p!==`number`&&p!==`integer`&&p!==`boolean`&&!s.enum&&!(n&&a.allOf)&&o.add(c);return{schema:s,unsupportedPaths:Array.from(o)}}function mn(e){if(g(e)!==`object`)return!1;let t=e.properties?.source,n=e.properties?.provider,r=e.properties?.id;return!t||!n||!r?!1:typeof t.const==`string`&&g(n)===`string`&&g(r)===`string`}function hn(e){let t=e.oneOf??e.anyOf;return!t||t.length===0?!1:t.every(e=>mn(e))}function gn(e,t,n,r){let i=n.findIndex(e=>g(e)===`string`);if(i<0)return null;let a=n.filter((e,t)=>t!==i),o=a[0],s=n[i];return a.length!==1||!o||!s||!hn(o)?null:$({...e,...s,nullable:r||s.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t)}function _n(e,t){if(e.allOf)return null;let n=e.anyOf??e.oneOf;if(!n)return null;let r=[],i=[],a=!1;for(let e of n){if(!e||typeof e!=`object`)return null;if(Array.isArray(e.enum)){let{enumValues:t,nullable:n}=en(e.enum);r.push(...t),n&&(a=!0);continue}if(`const`in e){if(e.const==null){a=!0;continue}r.push(e.const);continue}if(g(e)===`null`){a=!0;continue}i.push(e)}a&&=dn(e);let o=gn(e,t,i,a);if(o)return o;if(r.length>0&&i.length>0){let t=i.length===1?i[0]:void 0;if(t?.type!==`boolean`||Object.keys(t).length!==1||r.includes(`true`)||r.includes(`false`)||e.anyOf===void 0&&r.some(e=>typeof e==`boolean`))return i.every(e=>e.type===`string`)&&r.every(e=>typeof e==`string`||typeof e==`boolean`)&&!dn(e)?{schema:{...e,nullable:a},unsupportedPaths:[]}:null;i.pop(),r.unshift(!0,!1)}if(r.length>0&&i.length===0)return{schema:{...e,enum:tn(r),nullable:a,enumIncludesNull:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]};if(i.length===1){let n=i[0];return n?$({...e,...n,nullable:a||n.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t):null}return i.length>0&&r.length===0&&i.every(e=>{let t=g(e);return!!t&&Sn.has(String(t))})?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}var vn,yn,bn,xn,Sn;function Cn(){return(Cn=e((()=>{he(),V(),H(),vn=new Set([`$id`,`$schema`,`title`,`description`,`default`,`deprecated`,`nullable`,`enumIncludesNull`,`examples`,`readOnly`,`tags`,`writeOnly`,`x-tags`]),yn=new Set([...vn,`const`,`required`,`additionalProperties`,`minimum`,`maximum`,`exclusiveMinimum`,`exclusiveMaximum`,`multipleOf`,`minLength`,`maxLength`,`pattern`,`format`,`minItems`,`maxItems`,`uniqueItems`]),bn=new Set([...yn,`type`,`properties`,`items`,`additionalItems`,`enum`,`anyOf`,`oneOf`,`allOf`,`not`]),xn=new Set([`string`,`number`,`integer`,`boolean`]),Sn=new Set([...xn,`object`,`array`])})))()}function wn(){return(wn=e((()=>{Qt(),Cn(),Jt(),H()})))()}export{et as _,Zt as a,Q as c,xt as d,pt as f,tt as g,rt as h,Qt as i,wt as l,dt as m,pn as n,Yt as o,ft as p,Cn as r,Jt as s,wn as t,Et as u};
//# sourceMappingURL=config-form-DCJREHbx.js.map