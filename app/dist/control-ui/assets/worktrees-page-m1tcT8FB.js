import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Jr as t,qr as n,ti as r}from"./control-ui-foundation-CGMdhB5v.js";import{$l as i,Bl as a,Bs as o,Hl as s,Jl as c,Rs as l,Ti as u,_c as d,_n as f,fc as p,fn as m,gc as h,vi as g,wi as _}from"./control-ui-core-S9jKXqB5.js";import{$ as v,X as y,Y as b,ct as x,nt as S}from"./lit-runtime-DWoPVI38.js";import{Di as C,Oi as w,Or as T,Qa as E,do as D,fo as O,kr as k}from"./control-ui-core-G2U4O6rB.js";import{go as A,ho as j}from"./control-ui-boot-shared-ooxiG3qa.js";import{G as M,H as N,U as P,V as F}from"./control-ui-boot-shared-C3bL_9oq.js";import{At as I,Et as L,Ot as R,_t as z,ht as B,lo as V,uo as H,wt as U,yt as W}from"./control-ui-boot-shared-CCYBAAP9.js";import{B as G}from"./control-ui-boot-new-DhInmp9T.js";import{n as K,t as q}from"./settings-workspace-DJAhLnkQ.js";import{n as J,t as Y}from"./sessions-hub-header-B0Yf5Iz2.js";var X,Z;function Q(){return(Q=e((()=>{t(),F(),b(),S(),E(),w(),T(),V(),Y(),B(),q(),c(),o(),f(),_(),p(),A(),s(),X=`https://docs.testclaw.ai/concepts/managed-worktrees`,Z=class extends a{constructor(...e){super(...e),this.records=[],this.error=null,this.busyId=null,this.createOpen=!1,this.createRepoRoot=``,this.createName=``,this.createBaseRef=``,this.createBranches=[],this.creating=!1,this.gcLoading=!1,this.listClient=null,this.gateway=new j(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.records=[],this.error=null},invalidateRequests:e=>{(e.snapshot.phase!==`connected`||!e.snapshot.client)&&(this.listClient=null,this.listTask.run([null])),this.branchesTask.run([null,``]),this.invalidateOperations()},ensureInitialData:()=>void this.load(),onSnapshot:e=>{k(e.snapshot).canAdmin||(this.createOpen=!1)}}),this.listTask=new N(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`worktrees.list`,{},{signal:t}):P,onComplete:e=>{this.records=e.worktrees.toSorted((e,t)=>t.lastActiveAt-e.lastActiveAt)},onError:e=>{this.error=l(e)}}),this.branchesTask=new N(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.createRepoRoot.trim()],task:([e,t],{signal:n})=>e&&t?e.request(`worktrees.branches`,{repoRoot:t},{signal:n}):P,onComplete:e=>{this.createBranches=e.branches.map(e=>e.name)},onError:()=>{this.createBranches=[]}})}disconnectedCallback(){this.listClient=null,this.listTask.run([null]),this.branchesTask.run([null,``]),super.disconnectedCallback()}invalidateOperations(){this.busyId=null,this.creating=!1,this.gcLoading=!1}get operationPending(){return this.loading||this.busyId!==null||this.creating}get loading(){return this.gcLoading||this.listTask.status===M.PENDING}get canAdmin(){return k(this.context.gateway.snapshot).canAdmin}get canWrite(){return k(this.context.gateway.snapshot).canWrite}async load(e={}){let t=this.gateway.client;!t||!this.gateway.connected||this.busyId!==null||this.creating||this.gcLoading||this.listTask.status===M.PENDING&&this.listClient===t||(this.listClient=t,e.preserveError||(this.error=null),await this.listTask.run([t]))}async runOperation(e,t){this.error=null;try{await t()}catch(t){this.gateway.isCurrent(e)&&(this.error=l(t))}finally{this.gateway.isCurrent(e)&&(this.invalidateOperations(),await this.load({preserveError:!0}))}}async removeWorktree(e){let t=this.gateway.capture();t&&this.canAdmin&&!this.operationPending&&await H({message:i(`worktrees.confirmDelete`,{name:e.name}),confirmLabel:i(`common.delete`),danger:!0})&&this.gateway.isCurrent(t)&&this.canAdmin&&!this.operationPending&&(this.busyId=e.id,await this.runOperation(t,async()=>{let n=await t.client.request(`worktrees.remove`,{id:e.id});if(!this.gateway.isCurrent(t)||n.removed)return;let r=n.snapshotError??``,a=await H({message:i(`worktrees.confirmForceDelete`,{error:r}),confirmLabel:i(`common.delete`),danger:!0});if(!this.gateway.isCurrent(t)||!this.canAdmin)return;if(!a){this.error=r||null;return}let o=await t.client.request(`worktrees.remove`,{id:e.id,force:!0});this.gateway.isCurrent(t)&&(this.error=o.snapshotError??null)}))}async restore(e){let t=this.gateway.capture();t&&this.canAdmin&&!this.operationPending&&(this.busyId=e.id,await this.runOperation(t,()=>t.client.request(`worktrees.restore`,{id:e.id})))}async gc(){let e=this.gateway.capture();e&&this.canAdmin&&!this.operationPending&&(this.gcLoading=!0,await this.runOperation(e,()=>e.client.request(`worktrees.gc`,{})))}toggleCreate(){if(this.canAdmin&&!this.creating&&(this.createOpen=!this.createOpen,this.createOpen&&!this.createRepoRoot)){let e=this.context.agents.state.agentsList,t=e?.agents.find(t=>t.id===e.defaultId);this.createRepoRoot=t?.workspace??``,this.loadCreateBranches()}}loadCreateBranches(){let e=this.gateway.connected?this.gateway.client:null,t=this.createRepoRoot.trim();if(!e||!t||!this.canWrite){this.createBranches=[],this.branchesTask.run([null,``]);return}this.branchesTask.run([e,t])}async createWorktree(){let e=this.gateway.capture(),t=this.createRepoRoot.trim();e&&this.canAdmin&&t&&!this.operationPending&&(this.creating=!0,await this.runOperation(e,async()=>{await G(e.client,{repoRoot:t,name:this.createName,baseRef:this.createBaseRef}),this.gateway.isCurrent(e)&&(this.createOpen=!1,this.createName=``)}))}renderOwner(e){if(e.ownerKind===`session`&&e.ownerId){let t=h(this.context,e.ownerId),n=d({context:this.context,face:t,sessionKey:e.ownerId,preferenceDerivedFace:!0});return v`<a
        href=${n.href}
        title=${e.ownerId}
        @click=${e=>{g(e)&&(e.preventDefault(),this.context.navigate(t,n.options))}}
        >${i(`worktrees.ownerSession`)}</a
      >`}return e.ownerKind===`workboard`?v`<span title=${e.ownerId??``}>${i(`worktrees.ownerWorkboard`)}</span>`:v`<span>${i(`worktrees.ownerManual`)}</span>`}renderCreateRows(){return this.createOpen?v`
      ${L({title:i(`worktrees.repo`),control:v`
          <input
            class="settings-input"
            type="text"
            aria-label=${i(`worktrees.repo`)}
            ?disabled=${this.creating}
            .value=${this.createRepoRoot}
            @change=${e=>{this.createRepoRoot=e.target.value,this.createBaseRef=``,this.loadCreateBranches()}}
          />
        `})}
      ${L({title:i(`worktrees.name`),control:v`
          <input
            class="settings-input"
            type="text"
            aria-label=${i(`worktrees.name`)}
            ?disabled=${this.creating}
            placeholder=${i(`worktrees.namePlaceholder`)}
            .value=${this.createName}
            @input=${e=>{this.createName=e.target.value}}
          />
        `})}
      ${L({title:i(`worktrees.baseBranch`),control:v`
          <input
            class="settings-input"
            type="text"
            aria-label=${i(`worktrees.baseBranch`)}
            ?disabled=${this.creating}
            placeholder=${i(`worktrees.baseBranchPlaceholder`)}
            list="worktrees-create-branches"
            .value=${this.createBaseRef}
            @input=${e=>{this.createBaseRef=e.target.value}}
          />
          <datalist id="worktrees-create-branches">
            ${this.createBranches.map(e=>v`<option value=${e}></option>`)}
          </datalist>
        `})}
      ${L({title:i(`worktrees.newWorktree`),control:v`
          <button
            class="btn btn--sm"
            ?disabled=${this.operationPending||!this.createRepoRoot.trim()}
            @click=${()=>void this.createWorktree()}
          >
            ${this.creating?i(`common.loading`):i(`common.create`)}
          </button>
        `})}
    `:y}renderRecordRow(e){return L({title:e.name,description:v`
        <span title=${e.repoRoot}>${u(e.repoRoot)}</span> · ${e.branch} ·
        ${this.renderOwner(e)} · ${m(e.lastActiveAt)}
      `,control:v`
        ${e.removedAt?I({kind:`muted`,label:i(`worktrees.restorable`)}):I({kind:`ok`,label:i(`common.active`)})}
        <button
          class=${e.removedAt?`btn btn--sm`:`btn btn--sm danger`}
          title=${this.canAdmin?``:i(`worktrees.adminRequired`)}
          ?disabled=${!this.canAdmin||this.operationPending}
          @click=${()=>void(e.removedAt?this.restore(e):this.removeWorktree(e))}
        >
          ${e.removedAt?i(`worktrees.restore`):i(`common.delete`)}
        </button>
      `})}render(){let e=v`
      <button
        class="btn"
        title=${this.canAdmin?``:i(`worktrees.adminRequired`)}
        aria-expanded=${String(this.createOpen)}
        ?disabled=${!this.canAdmin||this.creating}
        @click=${()=>this.toggleCreate()}
      >
        ${i(`worktrees.newWorktree`)}
      </button>
      <button
        class="btn"
        title=${this.canAdmin?``:i(`worktrees.adminRequired`)}
        ?disabled=${!this.canAdmin||this.operationPending}
        @click=${()=>void this.gc()}
      >
        ${this.loading?i(`common.loading`):i(`worktrees.cleanNow`)}
      </button>
    `,t=v`
      ${this.renderCreateRows()}
      ${this.records.length===0?W(i(`worktrees.empty`)):this.records.map(e=>this.renderRecordRow(e))}
    `,n=U(v`
        ${this.canAdmin?y:v`<div class="callout info" role="note">${i(`worktrees.adminRequired`)}</div>`}
        ${this.error?v`<div class="callout danger" role="alert">${this.error}</div>`:y}
        ${R({title:i(`worktrees.title`),description:i(`worktrees.subtitle`),actions:e},t)}
      `,{wide:!0});return v`
      ${J({active:`worktrees`,title:O(`sessions`),subtitle:v`${D(`worktrees`)} ${z(X)}`,onSelect:e=>{e!==`worktrees`&&this.context?.navigate(e)}})}
      ${K(n,{id:`sessions-hub-panel`})}
    `}},r([n({context:C,subscribe:!0})],Z.prototype,`context`,void 0),r([x()],Z.prototype,`records`,void 0),r([x()],Z.prototype,`error`,void 0),r([x()],Z.prototype,`busyId`,void 0),r([x()],Z.prototype,`createOpen`,void 0),r([x()],Z.prototype,`createRepoRoot`,void 0),r([x()],Z.prototype,`createName`,void 0),r([x()],Z.prototype,`createBaseRef`,void 0),r([x()],Z.prototype,`createBranches`,void 0),r([x()],Z.prototype,`creating`,void 0),r([x()],Z.prototype,`gcLoading`,void 0),customElements.get(`testclaw-worktrees-page`)||customElements.define(`testclaw-worktrees-page`,Z)})))()}Q();
//# sourceMappingURL=worktrees-page-m1tcT8FB.js.map