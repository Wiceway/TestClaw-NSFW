import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$l as t,Bs as n,Jl as r,zs as i}from"./control-ui-core-S9jKXqB5.js";import{$ as a,X as o,Y as s,b as c,x as l}from"./lit-runtime-DWoPVI38.js";import{Fi as u,Ii as d,Ni as f}from"./control-ui-core-G2U4O6rB.js";import{Br as p,Gr as m,Kr as h,Vr as g}from"./control-ui-boot-shared-CCYBAAP9.js";import{n as _,t as v}from"./channel-picker-BtUNSoO-.js";function y(e){return`*`.repeat(Array.from(S.segment(e)).length)}function b(e){let t=e.closest(`[data-sensitive-input]`)?.querySelector(`[data-sensitive-mask-text]`);t&&(t.textContent=y(e.value),t.style.transform=`translateX(${-e.scrollLeft}px)`)}function x(e){let t=e.revealed?e.hideLabel:e.revealLabel,n=e.className?`oc-sensitive-input ${e.className}`:`oc-sensitive-input`,r=t=>{let n=t.currentTarget;b(n),e.onInput(n.value)},i=e=>{b(e.currentTarget)};return a`
    <span
      class=${n}
      data-sensitive-input
      data-sensitive-mask-ready="true"
      data-revealed=${String(e.revealed)}
    >
      <span
        class="oc-sensitive-mask"
        aria-hidden="true"
        data-sensitive-mask
        ?hidden=${e.revealed}
      >
        <span
          data-sensitive-mask-text
          .textContent=${e.revealed?``:y(e.value)}
        ></span>
      </span>
      <input
        id=${e.id}
        class=${e.inputClassName??o}
        name=${e.name??o}
        type=${e.revealed?`text`:`password`}
        autocomplete="off"
        spellcheck="false"
        placeholder=${e.placeholder??``}
        .value=${e.value}
        ?disabled=${e.disabled}
        aria-invalid=${e.invalid?`true`:o}
        aria-describedby=${e.describedBy??o}
        aria-label=${e.label??o}
        data-sensitive-value
        @input=${r}
        @change=${i}
        @focus=${i}
        @scroll=${i}
      />
      <testclaw-tooltip .content=${t}>
        <button
          type="button"
          class="oc-sensitive-toggle"
          aria-label=${t}
          aria-controls=${e.id}
          aria-pressed=${String(e.revealed)}
          data-sensitive-icon=${e.revealed?`eye-off`:`eye`}
          ?disabled=${e.disabled}
          @click=${e.onToggle}
        >
          ${e.revealed?u.eyeOff:u.eye}
        </button>
      </testclaw-tooltip>
    </span>
  `}var S;function C(){return(C=e((()=>{s(),d(),f(),S=new Intl.Segmenter(void 0,{granularity:`grapheme`})})))()}function w(e,n=t(`modelSetup.wizard.continue`)){return a`
    <button type="button" class="btn primary" disabled aria-busy="true" aria-label=${n}>
      <span class="btn__label">${n}</span>
      <span class="btn__spinner" aria-hidden="true"></span>
      <span class="sr-only" role="status" aria-live="polite">${e}</span>
    </button>
  `}function T(e,t){return`${e.presentation===`channels`?`channels-wizard`:`wizard-step`}__${t}`}function E(e){return e.message||e.title||t(`chat.questions.answer`)}function D(e){return e.step.message?a`<div class=${T(e,`message`)}>
        ${i(e.step.message)}
      </div>`:o}function O(e,t,n){return t===`channels`?a`
      <span class="channels-wizard__option-label">
        ${n===void 0?o:n?`☑ `:`☐ `}${e.label}
      </span>
      ${e.hint?a`<span class="channels-wizard__option-hint">${e.hint}</span>`:o}
    `:a`
    <span>
      <strong>${e.label}</strong>
      ${e.hint?a`<small>${e.hint}</small>`:o}
    </span>
  `}function k(e){let n=e.deviceCode,r=t(n?`modelSetup.wizard.copyCode`:`modelSetup.wizard.copyLink`),i=n?.code??e.externalUrl;return a`
    <div class="wizard-step__sign-in">
      <p class="muted">${n?.message??t(`modelSetup.wizard.browserInstructions`)}</p>
      ${n?a`<code class="wizard-step__sign-in-code">${n.code}</code>`:o}
      <div class="wizard-step__actions">
        ${e.externalUrl?a`<a class="btn primary wizard-step__external-link" data-link-reader-external href=${e.externalUrl} target="_blank" rel="noreferrer">${t(`modelSetup.wizard.openSignIn`)}</a>`:o}
        ${i?l(i,a`<button type="button" class="btn" @click=${e=>void p(e,i,r)}><span data-copy-label>${r}</span></button>`):o}
      </div>
      <div class="muted" role="status" aria-live="polite">${t(`modelSetup.wizard.waiting`)}</div>
      ${n?.expiresInMinutes?a`<div class="muted">${t(`modelSetup.wizard.expires`,{count:String(n.expiresInMinutes)})}</div>`:o}
      ${n?a`<p class="muted">${t(`modelSetup.wizard.deviceCodeWarning`)}</p>`:o}
    </div>
  `}function A(e){if(e.options.length<=2)return a`<div
      class="wizard-step__actions"
      role="group"
      aria-label=${e.label}
      aria-describedby=${e.validationErrorId??o}
    >
      ${e.options.map((t,n)=>a`<button type="button" class=${n===0?`btn primary`:`btn`} ?disabled=${e.busy} @click=${()=>e.onAnswer(t.value)}>${O(t)}</button>`)}
    </div>`;let t=e.options.findIndex(t=>Object.is(t.value,e.value));return h({label:e.label,value:t<0?null:String(t),options:e.options.map((e,t)=>({value:String(t),label:e.label,description:e.hint,kind:`neutral`})),disabled:e.busy,invalid:!!e.validationErrorId,describedBy:e.validationErrorId,onChange:t=>e.onAnswer(e.options[Number(t)]?.value)})}function j(e,t,n,r=e.busy){let i=e.answerLabel??t;if(e.presentation===`channels`&&e.busy)return a`<div class="channels-wizard__footer">
      ${w(e.busyLabel??i)}
    </div>`;let o=a`
    <button
      type=${n?`button`:`submit`}
      class="btn primary"
      ?disabled=${r}
      @click=${n}
    >
      ${i}
    </button>
  `;return e.presentation===`channels`?a`<div class="channels-wizard__footer">${o}</div>`:e.leadingAction?a`<div class="wizard-step__actions wizard-step__actions--split">
        ${e.leadingAction}${o}
      </div>`:o}function M(e,t,n){let r=n.some(e=>Object.is(e,t.value));return e.presentation===`channels`?a`<button
      type="button"
      class="channels-wizard__option"
      aria-pressed=${r?`true`:`false`}
      ?disabled=${e.busy}
      aria-invalid=${e.validationErrorId?`true`:o}
      aria-describedby=${e.validationErrorId??o}
      @click=${()=>e.onValueChange(t.value)}
    >
      ${O(t,e.presentation,r)}
    </button>`:a`<label class="wizard-step__option">
    <input
      type="checkbox"
      .checked=${r}
      ?disabled=${e.busy}
      aria-invalid=${e.validationErrorId?`true`:o}
      aria-describedby=${e.validationErrorId??o}
      @change=${r=>{let i=r.currentTarget.checked?[...n,t.value]:n.filter(e=>!Object.is(e,t.value));e.onValueChange(i)}}
    />
    ${O(t)}
  </label>`}function N(e){return e.externalUrl||e.deviceCode?k(e):o}function P(e){return a`
    ${D(e)} ${N(e.step)}
    ${j(e,t(`modelSetup.wizard.continue`),()=>e.onAnswer(void 0))}
  `}function F(e){return a`
    ${e.step.externalUrl||e.step.deviceCode?o:a`<div class="wizard-step__progress" role="status" aria-live="polite">
            <span class="wizard-step__spinner" aria-hidden="true"></span>
            ${D(e)}
          </div>`}
    ${N(e.step)}
    ${e.leadingAction?a`<div class="wizard-step__actions wizard-step__actions--split">
            ${e.leadingAction}
          </div>`:o}
  `}function I(e){let n=e.step,r=typeof e.value==`string`?e.value:``,s=n.sensitive&&e.onToggleSensitiveVisibility?x({id:e.inputId,name:`wizard-text`,value:r,revealed:e.sensitiveRevealed===!0,revealLabel:t(`configForm.revealValue`),hideLabel:t(`configForm.hideValue`),inputClassName:`input`,placeholder:n.placeholder,disabled:e.busy,invalid:!!e.validationErrorId,describedBy:e.validationErrorId,label:n.message?void 0:E(n),onInput:e.onValueChange,onToggle:e.onToggleSensitiveVisibility}):a`<input
          id=${e.inputId}
          class="input"
          name="wizard-text"
          type=${n.sensitive?`password`:`text`}
          autocomplete=${n.sensitive?`off`:`on`}
          placeholder=${n.placeholder??``}
          .value=${r}
          ?disabled=${e.busy}
          aria-invalid=${e.validationErrorId?`true`:o}
          aria-describedby=${e.validationErrorId??o}
          aria-label=${n.message?o:E(n)}
          @input=${t=>e.presentation!==`channels`&&e.onValueChange(t.currentTarget.value)}
        />`,c=a`
    <form
      class="wizard-step__form"
      @submit=${t=>{t.preventDefault();let n=t.currentTarget.elements.namedItem(`wizard-text`);e.onAnswer(e.presentation===`channels`?n?.value??``:r)}}
    >
      ${n.message?a`<div class=${T(e,`message`)}>
              <label for=${e.inputId}>${i(n.message)}</label>
            </div>`:o}
      ${e.externalAuthInput?o:N(n)} ${s}
      ${j(e.externalAuthInput?{...e,leadingAction:void 0}:e,t(`modelSetup.wizard.submit`))}
    </form>
  `;return e.externalAuthInput?a`
        ${N(n)}
        <details class="wizard-step__manual-entry">
          <summary class="muted">${t(`modelSetup.wizard.manualEntry`)}</summary>
          ${c}
        </details>
        <div class="wizard-step__actions wizard-step__actions--split">
          ${e.leadingAction??o}
        </div>
      `:c}function L(e){let n=e.step.options??[],r=e.step.type===`multiselect`,i=r?Array.isArray(e.value)?e.value:[]:[e.value];if(!r&&e.presentation!==`channels`)return a`
      ${D(e)}
      ${A({options:n,busy:e.busy,label:E(e.step),value:e.value,validationErrorId:e.validationErrorId,onAnswer:e.onAnswer})}
      ${e.leadingAction??o}
    `;if(e.presentation===`channels`&&!r){let r=n.findIndex(t=>Object.is(t.value,e.value)),i=e.channelSelect&&n.every(e=>typeof e.value==`string`),s=i?_:h;return a`
      ${D(e)}
      ${s({label:E(e.step),value:r<0?null:String(i?n[r]?.value:r),options:n.map((e,t)=>({value:String(i?e.value:t),label:e.label,description:e.hint,kind:i?`channel`:`neutral`})),disabled:e.busy,invalid:!!e.validationErrorId,describedBy:e.validationErrorId,onChange:t=>e.onAnswer(i?t:n[Number(t)]?.value)})}
      ${e.busy?j(e,t(`modelSetup.wizard.continue`),void 0,!0):o}
    `}let s=r?e.presentation===`channels`?[...i]:i:e.value;return a`
    ${D(e)}
    <div
      class=${T(e,`options`)}
      role="group"
      aria-label=${E(e.step)}
      aria-describedby=${e.validationErrorId??o}
    >
      ${n.map(t=>M(e,t,i))}
    </div>
    ${j(e,t(`modelSetup.wizard.continue`),()=>e.onAnswer(s),e.busy||!r&&e.value===void 0)}
  `}function R(e){let n=T(e,e.presentation===`channels`?`footer`:`actions`);return a`
    ${D(e)}
    <div
      class=${e.presentation!==`channels`&&e.leadingAction?`${n} wizard-step__actions--split`:n}
    >
      ${e.presentation===`channels`?o:e.leadingAction??o}
      ${e.presentation===`channels`&&e.busy?w(e.busyLabel??t(`common.loading`)):[!1,!0].map(n=>a`<button
                type="button"
                class=${n?`btn primary`:`btn`}
                ?disabled=${e.busy}
                @click=${()=>e.onAnswer(n)}
              >
                ${n?e.confirmAffirmativeLabel??t(`common.yes`):t(`common.no`)}
              </button>`)}
    </div>
  `}function z(e){switch(e.step.type){case`text`:return I(e);case`select`:case`multiselect`:return L(e);case`confirm`:return R(e);case`progress`:return e.step.executor===`gateway`?F(e):P(e);case`note`:case`action`:return P(e)}return o}function B(){return(B=e((()=>{s(),c(),r(),n(),v(),g(),m(),C()})))()}export{z as i,w as n,A as r,B as t};
//# sourceMappingURL=wizard-step-controls-BOTgnqix.js.map