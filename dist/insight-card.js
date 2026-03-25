/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=globalThis,e$5=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$5=new WeakMap;let n$4 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$5&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$5.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$4("string"==typeof t?t:t+"",void 0,s$2),i$5=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$4(o,t,s$2)},S$1=(s,o)=>{if(e$5)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$5?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$4,defineProperty:e$4,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$4,getPrototypeOf:n$3}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$4(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$4(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$3(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$4(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$3=t=>t,s$1=t$2.trustedTypes,e$3=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$3=`lit$${Math.random().toFixed(9).slice(2)}$`,n$2="?"+o$3,r$2=`<${n$2}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_$1=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$3?e$3.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_$1:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_$1||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$3+x):s+o$3+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$3),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$3)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$3),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$2)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$3,t+1));)d.push({type:7,index:l}),t+=o$3.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M$1(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M$1(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M$1(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$3(t).nextSibling;i$3(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M$1(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M$1(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M$1(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M$1(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$2 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$2._$litElement$=true,i$2["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$2});const o$2=s.litElementPolyfillSupport;o$2?.({LitElement:i$2});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o$1={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o$1,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n$1(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n$1({...r,state:true,attribute:false})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$2=(e,t,c)=>(c.configurable=true,c.enumerable=true,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,c),c);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e$1(e,r){return (n,s,i)=>{const o=t=>t.renderRoot?.querySelector(e)??null;return e$2(n,s,{get(){return o(this)}})}}

/**
* Copyright (c) 2025, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* uPlot.js (μPlot)
* A small, fast chart for time series, lines, areas, ohlc & bars
* https://github.com/leeoniya/uPlot (v1.6.32)
*/

const FEAT_TIME          = true;

const pre = "u-";

const UPLOT          =       "uplot";
const ORI_HZ         = pre + "hz";
const ORI_VT         = pre + "vt";
const TITLE          = pre + "title";
const WRAP           = pre + "wrap";
const UNDER          = pre + "under";
const OVER           = pre + "over";
const AXIS           = pre + "axis";
const OFF            = pre + "off";
const SELECT         = pre + "select";
const CURSOR_X       = pre + "cursor-x";
const CURSOR_Y       = pre + "cursor-y";
const CURSOR_PT      = pre + "cursor-pt";
const LEGEND         = pre + "legend";
const LEGEND_LIVE    = pre + "live";
const LEGEND_INLINE  = pre + "inline";
const LEGEND_SERIES  = pre + "series";
const LEGEND_MARKER  = pre + "marker";
const LEGEND_LABEL   = pre + "label";
const LEGEND_VALUE   = pre + "value";

const WIDTH       = "width";
const HEIGHT      = "height";
const TOP         = "top";
const BOTTOM      = "bottom";
const LEFT        = "left";
const RIGHT       = "right";
const hexBlack    = "#000";
const transparent = hexBlack + "0";

const mousemove   = "mousemove";
const mousedown   = "mousedown";
const mouseup     = "mouseup";
const mouseenter  = "mouseenter";
const mouseleave  = "mouseleave";
const dblclick    = "dblclick";
const resize      = "resize";
const scroll      = "scroll";

const change      = "change";
const dppxchange  = "dppxchange";

const LEGEND_DISP = "--";

const domEnv = typeof window != 'undefined';

const doc = domEnv ? document  : null;
const win = domEnv ? window    : null;
const nav = domEnv ? navigator : null;

let pxRatio;

//export const canHover = domEnv && !win.matchMedia('(hover: none)').matches;

let query;

function setPxRatio() {
	let _pxRatio = devicePixelRatio;

	// during print preview, Chrome fires off these dppx queries even without changes
	if (pxRatio != _pxRatio) {
		pxRatio = _pxRatio;

		query && off(change, query, setPxRatio);
		query = matchMedia(`(min-resolution: ${pxRatio - 0.001}dppx) and (max-resolution: ${pxRatio + 0.001}dppx)`);
		on(change, query, setPxRatio);

		win.dispatchEvent(new CustomEvent(dppxchange));
	}
}

function addClass(el, c) {
	if (c != null) {
		let cl = el.classList;
		!cl.contains(c) && cl.add(c);
	}
}

function remClass(el, c) {
	let cl = el.classList;
	cl.contains(c) && cl.remove(c);
}

function setStylePx(el, name, value) {
	el.style[name] = value + "px";
}

function placeTag(tag, cls, targ, refEl) {
	let el = doc.createElement(tag);

	if (cls != null)
		addClass(el, cls);

	if (targ != null)
		targ.insertBefore(el, refEl);

	return el;
}

function placeDiv(cls, targ) {
	return placeTag("div", cls, targ);
}

const xformCache = new WeakMap();

function elTrans(el, xPos, yPos, xMax, yMax) {
	let xform = "translate(" + xPos + "px," + yPos + "px)";
	let xformOld = xformCache.get(el);

	if (xform != xformOld) {
		el.style.transform = xform;
		xformCache.set(el, xform);

		if (xPos < 0 || yPos < 0 || xPos > xMax || yPos > yMax)
			addClass(el, OFF);
		else
			remClass(el, OFF);
	}
}

const colorCache = new WeakMap();

function elColor(el, background, borderColor) {
	let newColor = background + borderColor;
	let oldColor = colorCache.get(el);

	if (newColor != oldColor) {
		colorCache.set(el, newColor);
		el.style.background = background;
		el.style.borderColor = borderColor;
	}
}

const sizeCache = new WeakMap();

function elSize(el, newWid, newHgt, centered) {
	let newSize = newWid + "" + newHgt;
	let oldSize = sizeCache.get(el);

	if (newSize != oldSize) {
		sizeCache.set(el, newSize);
		el.style.height = newHgt + "px";
		el.style.width = newWid + "px";
		el.style.marginLeft = centered ? -newWid/2 + "px" : 0;
		el.style.marginTop = centered ? -newHgt/2 + "px" : 0;
	}
}

const evOpts = {passive: true};
const evOpts2 = {...evOpts, capture: true};

function on(ev, el, cb, capt) {
	el.addEventListener(ev, cb, capt ? evOpts2 : evOpts);
}

function off(ev, el, cb, capt) {
	el.removeEventListener(ev, cb, evOpts);
}

domEnv && setPxRatio();

// binary search for index of closest value
function closestIdx(num, arr, lo, hi) {
	let mid;
	lo = lo || 0;
	hi = hi || arr.length - 1;
	let bitwise = hi <= 2147483647;

	while (hi - lo > 1) {
		mid = bitwise ? (lo + hi) >> 1 : floor((lo + hi) / 2);

		if (arr[mid] < num)
			lo = mid;
		else
			hi = mid;
	}

	if (num - arr[lo] <= arr[hi] - num)
		return lo;

	return hi;
}

function makeIndexOfs(predicate) {
	 let indexOfs = (data, _i0, _i1) => {
		let i0 = -1;
		let i1 = -1;

		for (let i = _i0; i <= _i1; i++) {
			if (predicate(data[i])) {
				i0 = i;
				break;
			}
		}

		for (let i = _i1; i >= _i0; i--) {
			if (predicate(data[i])) {
				i1 = i;
				break;
			}
		}

		return [i0, i1];
	 };

	 return indexOfs;
}

const notNullish = v => v != null;
const isPositive = v => v != null && v > 0;

const nonNullIdxs = makeIndexOfs(notNullish);
const positiveIdxs = makeIndexOfs(isPositive);

function getMinMax(data, _i0, _i1, sorted = 0, log = false) {
//	console.log("getMinMax()");

	let getEdgeIdxs = log ? positiveIdxs : nonNullIdxs;
	let predicate = log ? isPositive : notNullish;

	[_i0, _i1] = getEdgeIdxs(data, _i0, _i1);

	let _min = data[_i0];
	let _max = data[_i0];

	if (_i0 > -1) {
		if (sorted == 1) {
			_min = data[_i0];
			_max = data[_i1];
		}
		else if (sorted == -1) {
			_min = data[_i1];
			_max = data[_i0];
		}
		else {
			for (let i = _i0; i <= _i1; i++) {
				let v = data[i];

				if (predicate(v)) {
					if (v < _min)
						_min = v;
					else if (v > _max)
						_max = v;
				}
			}
		}
	}

	return [_min ?? inf, _max ?? -inf]; // todo: fix to return nulls
}

function rangeLog(min, max, base, fullMags) {
	let minSign = sign(min);
	let maxSign = sign(max);

	if (min == max) {
		if (minSign == -1) {
			min *= base;
			max /= base;
		}
		else {
			min /= base;
			max *= base;
		}
	}

	let logFn = base == 10 ? log10 : log2;

	let growMinAbs = minSign == 1 ? floor : ceil;
	let growMaxAbs = maxSign == 1 ? ceil : floor;

	let minExp = growMinAbs(logFn(abs(min)));
	let maxExp = growMaxAbs(logFn(abs(max)));

	let minIncr = pow(base, minExp);
	let maxIncr = pow(base, maxExp);

	// fix values like Math.pow(10, -5) === 0.000009999999999999999
	if (base == 10) {
		if (minExp < 0)
			minIncr = roundDec(minIncr, -minExp);
		if (maxExp < 0)
			maxIncr = roundDec(maxIncr, -maxExp);
	}

	if (fullMags || base == 2) {
		min = minIncr * minSign;
		max = maxIncr * maxSign;
	}
	else {
		min = incrRoundDn(min, minIncr);
		max = incrRoundUp(max, maxIncr);
	}

	return [min, max];
}

function rangeAsinh(min, max, base, fullMags) {
	let minMax = rangeLog(min, max, base, fullMags);

	if (min == 0)
		minMax[0] = 0;

	if (max == 0)
		minMax[1] = 0;

	return minMax;
}

const rangePad = 0.1;

const autoRangePart = {
	mode: 3,
	pad: rangePad,
};

const _eqRangePart = {
	pad:  0,
	soft: null,
	mode: 0,
};

const _eqRange = {
	min: _eqRangePart,
	max: _eqRangePart,
};

// this ensures that non-temporal/numeric y-axes get multiple-snapped padding added above/below
// TODO: also account for incrs when snapping to ensure top of axis gets a tick & value
function rangeNum(_min, _max, mult, extra) {
	if (isObj(mult))
		return _rangeNum(_min, _max, mult);

	_eqRangePart.pad  = mult;
	_eqRangePart.soft = extra ? 0 : null;
	_eqRangePart.mode = extra ? 3 : 0;

	return _rangeNum(_min, _max, _eqRange);
}

// nullish coalesce
function ifNull(lh, rh) {
	return lh == null ? rh : lh;
}

// checks if given index range in an array contains a non-null value
// aka a range-bounded Array.some()
function hasData(data, idx0, idx1) {
	idx0 = ifNull(idx0, 0);
	idx1 = ifNull(idx1, data.length - 1);

	while (idx0 <= idx1) {
		if (data[idx0] != null)
			return true;
		idx0++;
	}

	return false;
}

function _rangeNum(_min, _max, cfg) {
	let cmin = cfg.min;
	let cmax = cfg.max;

	let padMin = ifNull(cmin.pad, 0);
	let padMax = ifNull(cmax.pad, 0);

	let hardMin = ifNull(cmin.hard, -inf);
	let hardMax = ifNull(cmax.hard,  inf);

	let softMin = ifNull(cmin.soft,  inf);
	let softMax = ifNull(cmax.soft, -inf);

	let softMinMode = ifNull(cmin.mode, 0);
	let softMaxMode = ifNull(cmax.mode, 0);

	let delta = _max - _min;
	let deltaMag = log10(delta);

	let scalarMax = max(abs(_min), abs(_max));
	let scalarMag = log10(scalarMax);

	let scalarMagDelta = abs(scalarMag - deltaMag);

	// this handles situations like 89.7, 89.69999999999999
	// by assuming 0.001x deltas are precision errors
//	if (delta > 0 && delta < abs(_max) / 1e3)
//		delta = 0;

	// treat data as flat if delta is less than 1e-24
	// or range is 11+ orders of magnitude below raw values, e.g. 99999999.99999996 - 100000000.00000004
	if (delta < 1e-24 || scalarMagDelta > 10) {
		delta = 0;

		// if soft mode is 2 and all vals are flat at 0, avoid the 0.1 * 1e3 fallback
		// this prevents 0,0,0 from ranging to -100,100 when softMin/softMax are -1,1
		if (_min == 0 || _max == 0) {
			delta = 1e-24;

			if (softMinMode == 2 && softMin != inf)
				padMin = 0;

			if (softMaxMode == 2 && softMax != -inf)
				padMax = 0;
		}
	}

	let nonZeroDelta = delta || scalarMax || 1e3;
	let mag          = log10(nonZeroDelta);
	let base         = pow(10, floor(mag));

	let _padMin  = nonZeroDelta * (delta == 0 ? (_min == 0 ? .1 : 1) : padMin);
	let _newMin  = roundDec(incrRoundDn(_min - _padMin, base/10), 24);
	let _softMin = _min >= softMin && (softMinMode == 1 || softMinMode == 3 && _newMin <= softMin || softMinMode == 2 && _newMin >= softMin) ? softMin : inf;
	let minLim   = max(hardMin, _newMin < _softMin && _min >= _softMin ? _softMin : min(_softMin, _newMin));

	let _padMax  = nonZeroDelta * (delta == 0 ? (_max == 0 ? .1 : 1) : padMax);
	let _newMax  = roundDec(incrRoundUp(_max + _padMax, base/10), 24);
	let _softMax = _max <= softMax && (softMaxMode == 1 || softMaxMode == 3 && _newMax >= softMax || softMaxMode == 2 && _newMax <= softMax) ? softMax : -inf;
	let maxLim   = min(hardMax, _newMax > _softMax && _max <= _softMax ? _softMax : max(_softMax, _newMax));

	if (minLim == maxLim && minLim == 0)
		maxLim = 100;

	return [minLim, maxLim];
}

// alternative: https://stackoverflow.com/a/2254896
const numFormatter = new Intl.NumberFormat(domEnv ? nav.language : 'en-US');
const fmtNum = val => numFormatter.format(val);

const M = Math;

const PI = M.PI;
const abs = M.abs;
const floor = M.floor;
const round = M.round;
const ceil = M.ceil;
const min = M.min;
const max = M.max;
const pow = M.pow;
const sign = M.sign;
const log10 = M.log10;
const log2 = M.log2;
// TODO: seems like this needs to match asinh impl if the passed v is tweaked?
const sinh =  (v, linthresh = 1) => M.sinh(v) * linthresh;
const asinh = (v, linthresh = 1) => M.asinh(v / linthresh);

const inf = Infinity;

function numIntDigits(x) {
	return (log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
}

function clamp(num, _min, _max) {
	return min(max(num, _min), _max);
}

function isFn(v) {
	return typeof v == "function";
}

function fnOrSelf(v) {
	return isFn(v) ? v : () => v;
}

const noop = () => {};

// note: these identity fns may get deoptimized if reused for different arg types
// a TS version would enforce they stay monotyped and require making variants
const retArg0 = _0 => _0;

const retArg1 = (_0, _1) => _1;

const retNull = _ => null;

const retTrue = _ => true;

const retEq = (a, b) => a == b;

const regex6 = /\.\d*?(?=9{6,}|0{6,})/gm;

// e.g. 17999.204999999998 -> 17999.205
const fixFloat = val => {
	if (isInt(val) || fixedDec.has(val))
		return val;

	const str = `${val}`;

	const match = str.match(regex6);

	if (match == null)
		return val;

	let len = match[0].length - 1;

	// e.g. 1.0000000000000001e-24
	if (str.indexOf('e-') != -1) {
		let [num, exp] = str.split('e');
		return +`${fixFloat(num)}e${exp}`;
	}

	return roundDec(val, len);
};

function incrRound(num, incr) {
	return fixFloat(roundDec(fixFloat(num/incr))*incr);
}

function incrRoundUp(num, incr) {
	return fixFloat(ceil(fixFloat(num/incr))*incr);
}

function incrRoundDn(num, incr) {
	return fixFloat(floor(fixFloat(num/incr))*incr);
}

// https://stackoverflow.com/a/48764436
// rounds half away from zero
function roundDec(val, dec = 0) {
	if (isInt(val))
		return val;
//	else if (dec == 0)
//		return round(val);

	let p = 10 ** dec;
	let n = (val * p) * (1 + Number.EPSILON);
	return round(n) / p;
}

const fixedDec = new Map();

function guessDec(num) {
	return ((""+num).split(".")[1] || "").length;
}

function genIncrs(base, minExp, maxExp, mults) {
	let incrs = [];

	let multDec = mults.map(guessDec);

	for (let exp = minExp; exp < maxExp; exp++) {
		let expa = abs(exp);
		let mag = roundDec(pow(base, exp), expa);

		for (let i = 0; i < mults.length; i++) {
			let _incr = base == 10 ? +`${mults[i]}e${exp}` : mults[i] * mag;
			let dec = (exp >= 0 ? 0 : expa) + (exp >= multDec[i] ? 0 : multDec[i]);
			let incr = base == 10 ? _incr : roundDec(_incr, dec);
			incrs.push(incr);
			fixedDec.set(incr, dec);
		}
	}

	return incrs;
}

//export const assign = Object.assign;

const EMPTY_OBJ = {};
const EMPTY_ARR = [];

const nullNullTuple = [null, null];

const isArr = Array.isArray;
const isInt = Number.isInteger;
const isUndef = v => v === void 0;

function isStr(v) {
	return typeof v == 'string';
}

function isObj(v) {
	let is = false;

	if (v != null) {
		let c = v.constructor;
		is = c == null || c == Object;
	}

	return is;
}

function fastIsObj(v) {
	return v != null && typeof v == 'object';
}

const TypedArray = Object.getPrototypeOf(Uint8Array);

const __proto__ = "__proto__";

function copy(o, _isObj = isObj) {
	let out;

	if (isArr(o)) {
		let val = o.find(v => v != null);

		if (isArr(val) || _isObj(val)) {
			out = Array(o.length);
			for (let i = 0; i < o.length; i++)
				out[i] = copy(o[i], _isObj);
		}
		else
			out = o.slice();
	}
	else if (o instanceof TypedArray) // also (ArrayBuffer.isView(o) && !(o instanceof DataView))
		out = o.slice();
	else if (_isObj(o)) {
		out = {};
		for (let k in o) {
			if (k != __proto__)
				out[k] = copy(o[k], _isObj);
		}
	}
	else
		out = o;

	return out;
}

function assign(targ) {
	let args = arguments;

	for (let i = 1; i < args.length; i++) {
		let src = args[i];

		for (let key in src) {
			if (key != __proto__) {
				if (isObj(targ[key]))
					assign(targ[key], copy(src[key]));
				else
					targ[key] = copy(src[key]);
			}
		}
	}

	return targ;
}

// nullModes
const NULL_REMOVE = 0;  // nulls are converted to undefined (e.g. for spanGaps: true)
const NULL_RETAIN = 1;  // nulls are retained, with alignment artifacts set to undefined (default)
const NULL_EXPAND = 2;  // nulls are expanded to include any adjacent alignment artifacts

// sets undefined values to nulls when adjacent to existing nulls (minesweeper)
function nullExpand(yVals, nullIdxs, alignedLen) {
	for (let i = 0, xi, lastNullIdx = -1; i < nullIdxs.length; i++) {
		let nullIdx = nullIdxs[i];

		if (nullIdx > lastNullIdx) {
			xi = nullIdx - 1;
			while (xi >= 0 && yVals[xi] == null)
				yVals[xi--] = null;

			xi = nullIdx + 1;
			while (xi < alignedLen && yVals[xi] == null)
				yVals[lastNullIdx = xi++] = null;
		}
	}
}

// nullModes is a tables-matched array indicating how to treat nulls in each series
// output is sorted ASC on the joined field (table[0]) and duplicate join values are collapsed
function join(tables, nullModes) {
	if (allHeadersSame(tables)) {
	//	console.log('cheap join!');

		let table = tables[0].slice();

		for (let i = 1; i < tables.length; i++)
			table.push(...tables[i].slice(1));

		if (!isAsc(table[0]))
			table = sortCols(table);

		return table;
	}

	let xVals = new Set();

	for (let ti = 0; ti < tables.length; ti++) {
		let t = tables[ti];
		let xs = t[0];
		let len = xs.length;

		for (let i = 0; i < len; i++)
			xVals.add(xs[i]);
	}

	let data = [Array.from(xVals).sort((a, b) => a - b)];

	let alignedLen = data[0].length;

	let xIdxs = new Map();

	for (let i = 0; i < alignedLen; i++)
		xIdxs.set(data[0][i], i);

	for (let ti = 0; ti < tables.length; ti++) {
		let t = tables[ti];
		let xs = t[0];

		for (let si = 1; si < t.length; si++) {
			let ys = t[si];

			let yVals = Array(alignedLen).fill(undefined);

			let nullMode = nullModes ? nullModes[ti][si] : NULL_RETAIN;

			let nullIdxs = [];

			for (let i = 0; i < ys.length; i++) {
				let yVal = ys[i];
				let alignedIdx = xIdxs.get(xs[i]);

				if (yVal === null) {
					if (nullMode != NULL_REMOVE) {
						yVals[alignedIdx] = yVal;

						if (nullMode == NULL_EXPAND)
							nullIdxs.push(alignedIdx);
					}
				}
				else
					yVals[alignedIdx] = yVal;
			}

			nullExpand(yVals, nullIdxs, alignedLen);

			data.push(yVals);
		}
	}

	return data;
}

const microTask = typeof queueMicrotask == "undefined" ? fn => Promise.resolve().then(fn) : queueMicrotask;

// TODO: https://github.com/dy/sort-ids (~2x faster for 1e5+ arrays)
function sortCols(table) {
	let head = table[0];
	let rlen = head.length;

	let idxs = Array(rlen);
	for (let i = 0; i < idxs.length; i++)
		idxs[i] = i;

	idxs.sort((i0, i1) => head[i0] - head[i1]);

	let table2 = [];
	for (let i = 0; i < table.length; i++) {
		let row = table[i];
		let row2 = Array(rlen);

		for (let j = 0; j < rlen; j++)
			row2[j] = row[idxs[j]];

		table2.push(row2);
	}

	return table2;
}

// test if we can do cheap join (all join fields same)
function allHeadersSame(tables) {
	let vals0 = tables[0][0];
	let len0 = vals0.length;

	for (let i = 1; i < tables.length; i++) {
		let vals1 = tables[i][0];

		if (vals1.length != len0)
			return false;

		if (vals1 != vals0) {
			for (let j = 0; j < len0; j++) {
				if (vals1[j] != vals0[j])
					return false;
			}
		}
	}

	return true;
}

function isAsc(vals, samples = 100) {
	const len = vals.length;

	// empty or single value
	if (len <= 1)
		return true;

	// skip leading & trailing nullish
	let firstIdx = 0;
	let lastIdx = len - 1;

	while (firstIdx <= lastIdx && vals[firstIdx] == null)
		firstIdx++;

	while (lastIdx >= firstIdx && vals[lastIdx] == null)
		lastIdx--;

	// all nullish or one value surrounded by nullish
	if (lastIdx <= firstIdx)
		return true;

	const stride = max(1, floor((lastIdx - firstIdx + 1) / samples));

	for (let prevVal = vals[firstIdx], i = firstIdx + stride; i <= lastIdx; i += stride) {
		const v = vals[i];

		if (v != null) {
			if (v <= prevVal)
				return false;

			prevVal = v;
		}
	}

	return true;
}

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const days = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

function slice3(str) {
	return str.slice(0, 3);
}

const days3 = days.map(slice3);

const months3 = months.map(slice3);

const engNames = {
	MMMM: months,
	MMM:  months3,
	WWWW: days,
	WWW:  days3,
};

function zeroPad2(int) {
	return (int < 10 ? '0' : '') + int;
}

function zeroPad3(int) {
	return (int < 10 ? '00' : int < 100 ? '0' : '') + int;
}

/*
function suffix(int) {
	let mod10 = int % 10;

	return int + (
		mod10 == 1 && int != 11 ? "st" :
		mod10 == 2 && int != 12 ? "nd" :
		mod10 == 3 && int != 13 ? "rd" : "th"
	);
}
*/

const subs = {
	// 2019
	YYYY:	d => d.getFullYear(),
	// 19
	YY:		d => (d.getFullYear()+'').slice(2),
	// July
	MMMM:	(d, names) => names.MMMM[d.getMonth()],
	// Jul
	MMM:	(d, names) => names.MMM[d.getMonth()],
	// 07
	MM:		d => zeroPad2(d.getMonth()+1),
	// 7
	M:		d => d.getMonth()+1,
	// 09
	DD:		d => zeroPad2(d.getDate()),
	// 9
	D:		d => d.getDate(),
	// Monday
	WWWW:	(d, names) => names.WWWW[d.getDay()],
	// Mon
	WWW:	(d, names) => names.WWW[d.getDay()],
	// 03
	HH:		d => zeroPad2(d.getHours()),
	// 3
	H:		d => d.getHours(),
	// 9 (12hr, unpadded)
	h:		d => {let h = d.getHours(); return h == 0 ? 12 : h > 12 ? h - 12 : h;},
	// AM
	AA:		d => d.getHours() >= 12 ? 'PM' : 'AM',
	// am
	aa:		d => d.getHours() >= 12 ? 'pm' : 'am',
	// a
	a:		d => d.getHours() >= 12 ? 'p' : 'a',
	// 09
	mm:		d => zeroPad2(d.getMinutes()),
	// 9
	m:		d => d.getMinutes(),
	// 09
	ss:		d => zeroPad2(d.getSeconds()),
	// 9
	s:		d => d.getSeconds(),
	// 374
	fff:	d => zeroPad3(d.getMilliseconds()),
};

function fmtDate(tpl, names) {
	names = names || engNames;
	let parts = [];

	let R = /\{([a-z]+)\}|[^{]+/gi, m;

	while (m = R.exec(tpl))
		parts.push(m[0][0] == '{' ? subs[m[1]] : m[0]);

	return d => {
		let out = '';

		for (let i = 0; i < parts.length; i++)
			out += typeof parts[i] == "string" ? parts[i] : parts[i](d, names);

		return out;
	}
}

const localTz = new Intl.DateTimeFormat().resolvedOptions().timeZone;

// https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone/53652131#53652131
function tzDate(date, tz) {
	let date2;

	// perf optimization
	if (tz == 'UTC' || tz == 'Etc/UTC')
		date2 = new Date(+date + date.getTimezoneOffset() * 6e4);
	else if (tz == localTz)
		date2 = date;
	else {
		date2 = new Date(date.toLocaleString('en-US', {timeZone: tz}));
		date2.setMilliseconds(date.getMilliseconds());
	}

	return date2;
}

//export const series = [];

// default formatters:

const onlyWhole = v => v % 1 == 0;

const allMults = [1,2,2.5,5];

// ...0.01, 0.02, 0.025, 0.05, 0.1, 0.2, 0.25, 0.5
const decIncrs = genIncrs(10, -32, 0, allMults);

// 1, 2, 2.5, 5, 10, 20, 25, 50...
const oneIncrs = genIncrs(10, 0, 32, allMults);

// 1, 2,      5, 10, 20, 25, 50...
const wholeIncrs = oneIncrs.filter(onlyWhole);

const numIncrs = decIncrs.concat(oneIncrs);

const NL = "\n";

const yyyy    = "{YYYY}";
const NLyyyy  = NL + yyyy;
const md      = "{M}/{D}";
const NLmd    = NL + md;
const NLmdyy  = NLmd + "/{YY}";

const aa      = "{aa}";
const hmm     = "{h}:{mm}";
const hmmaa   = hmm + aa;
const NLhmmaa = NL + hmmaa;
const ss      = ":{ss}";

const _ = null;

function genTimeStuffs(ms) {
	let	s  = ms * 1e3,
		m  = s  * 60,
		h  = m  * 60,
		d  = h  * 24,
		mo = d  * 30,
		y  = d  * 365;

	// min of 1e-3 prevents setting a temporal x ticks too small since Date objects cannot advance ticks smaller than 1ms
	let subSecIncrs = ms == 1 ? genIncrs(10, 0, 3, allMults).filter(onlyWhole) : genIncrs(10, -3, 0, allMults);

	let timeIncrs = subSecIncrs.concat([
		// minute divisors (# of secs)
		s,
		s * 5,
		s * 10,
		s * 15,
		s * 30,
		// hour divisors (# of mins)
		m,
		m * 5,
		m * 10,
		m * 15,
		m * 30,
		// day divisors (# of hrs)
		h,
		h * 2,
		h * 3,
		h * 4,
		h * 6,
		h * 8,
		h * 12,
		// month divisors TODO: need more?
		d,
		d * 2,
		d * 3,
		d * 4,
		d * 5,
		d * 6,
		d * 7,
		d * 8,
		d * 9,
		d * 10,
		d * 15,
		// year divisors (# months, approx)
		mo,
		mo * 2,
		mo * 3,
		mo * 4,
		mo * 6,
		// century divisors
		y,
		y * 2,
		y * 5,
		y * 10,
		y * 25,
		y * 50,
		y * 100,
	]);

	// [0]:   minimum num secs in the tick incr
	// [1]:   default tick format
	// [2-7]: rollover tick formats
	// [8]:   mode: 0: replace [1] -> [2-7], 1: concat [1] + [2-7]
	const _timeAxisStamps = [
	//   tick incr    default          year                    month   day                   hour    min       sec   mode
		[y,           yyyy,            _,                      _,      _,                    _,      _,        _,       1],
		[d * 28,      "{MMM}",         NLyyyy,                 _,      _,                    _,      _,        _,       1],
		[d,           md,              NLyyyy,                 _,      _,                    _,      _,        _,       1],
		[h,           "{h}" + aa,      NLmdyy,                 _,      NLmd,                 _,      _,        _,       1],
		[m,           hmmaa,           NLmdyy,                 _,      NLmd,                 _,      _,        _,       1],
		[s,           ss,              NLmdyy + " " + hmmaa,   _,      NLmd + " " + hmmaa,   _,      NLhmmaa,  _,       1],
		[ms,          ss + ".{fff}",   NLmdyy + " " + hmmaa,   _,      NLmd + " " + hmmaa,   _,      NLhmmaa,  _,       1],
	];

	// the ensures that axis ticks, values & grid are aligned to logical temporal breakpoints and not an arbitrary timestamp
	// https://www.timeanddate.com/time/dst/
	// https://www.timeanddate.com/time/dst/2019.html
	// https://www.epochconverter.com/timezones
	function timeAxisSplits(tzDate) {
		return (self, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace) => {
			let splits = [];
			let isYr = foundIncr >= y;
			let isMo = foundIncr >= mo && foundIncr < y;

			// get the timezone-adjusted date
			let minDate = tzDate(scaleMin);
			let minDateTs = roundDec(minDate * ms, 3);

			// get ts of 12am (this lands us at or before the original scaleMin)
			let minMin = mkDate(minDate.getFullYear(), isYr ? 0 : minDate.getMonth(), isMo || isYr ? 1 : minDate.getDate());
			let minMinTs = roundDec(minMin * ms, 3);

			if (isMo || isYr) {
				let moIncr = isMo ? foundIncr / mo : 0;
				let yrIncr = isYr ? foundIncr / y  : 0;
			//	let tzOffset = scaleMin - minDateTs;		// needed?
				let split = minDateTs == minMinTs ? minDateTs : roundDec(mkDate(minMin.getFullYear() + yrIncr, minMin.getMonth() + moIncr, 1) * ms, 3);
				let splitDate = new Date(round(split / ms));
				let baseYear = splitDate.getFullYear();
				let baseMonth = splitDate.getMonth();

				for (let i = 0; split <= scaleMax; i++) {
					let next = mkDate(baseYear + yrIncr * i, baseMonth + moIncr * i, 1);
					let offs = next - tzDate(roundDec(next * ms, 3));

					split = roundDec((+next + offs) * ms, 3);

					if (split <= scaleMax)
						splits.push(split);
				}
			}
			else {
				let incr0 = foundIncr >= d ? d : foundIncr;
				let tzOffset = floor(scaleMin) - floor(minDateTs);
				let split = minMinTs + tzOffset + incrRoundUp(minDateTs - minMinTs, incr0);
				splits.push(split);

				let date0 = tzDate(split);

				let prevHour = date0.getHours() + (date0.getMinutes() / m) + (date0.getSeconds() / h);
				let incrHours = foundIncr / h;

				let minSpace = self.axes[axisIdx]._space;
				let pctSpace = foundSpace / minSpace;

				while (1) {
					split = roundDec(split + foundIncr, ms == 1 ? 0 : 3);

					if (split > scaleMax)
						break;

					if (incrHours > 1) {
						let expectedHour = floor(roundDec(prevHour + incrHours, 6)) % 24;
						let splitDate = tzDate(split);
						let actualHour = splitDate.getHours();

						let dstShift = actualHour - expectedHour;

						if (dstShift > 1)
							dstShift = -1;

						split -= dstShift * h;

						prevHour = (prevHour + incrHours) % 24;

						// add a tick only if it's further than 70% of the min allowed label spacing
						let prevSplit = splits[splits.length - 1];
						let pctIncr = roundDec((split - prevSplit) / foundIncr, 3);

						if (pctIncr * pctSpace >= .7)
							splits.push(split);
					}
					else
						splits.push(split);
				}
			}

			return splits;
		}
	}

	return [
		timeIncrs,
		_timeAxisStamps,
		timeAxisSplits,
	];
}

const [ timeIncrsMs, _timeAxisStampsMs, timeAxisSplitsMs ] = genTimeStuffs(1);
const [ timeIncrsS,  _timeAxisStampsS,  timeAxisSplitsS  ] = genTimeStuffs(1e-3);

// base 2
genIncrs(2, -53, 53, [1]);

/*
console.log({
	decIncrs,
	oneIncrs,
	wholeIncrs,
	numIncrs,
	timeIncrs,
	fixedDec,
});
*/

function timeAxisStamps(stampCfg, fmtDate) {
	return stampCfg.map(s => s.map((v, i) =>
		i == 0 || i == 8 || v == null ? v : fmtDate(i == 1 || s[8] == 0 ? v : s[1] + v)
	));
}

// TODO: will need to accept spaces[] and pull incr into the loop when grid will be non-uniform, eg for log scales.
// currently we ignore this for months since they're *nearly* uniform and the added complexity is not worth it
function timeAxisVals(tzDate, stamps) {
	return (self, splits, axisIdx, foundSpace, foundIncr) => {
		let s = stamps.find(s => foundIncr >= s[0]) || stamps[stamps.length - 1];

		// these track boundaries when a full label is needed again
		let prevYear;
		let prevMnth;
		let prevDate;
		let prevHour;
		let prevMins;
		let prevSecs;

		return splits.map(split => {
			let date = tzDate(split);

			let newYear = date.getFullYear();
			let newMnth = date.getMonth();
			let newDate = date.getDate();
			let newHour = date.getHours();
			let newMins = date.getMinutes();
			let newSecs = date.getSeconds();

			let stamp = (
				newYear != prevYear && s[2] ||
				newMnth != prevMnth && s[3] ||
				newDate != prevDate && s[4] ||
				newHour != prevHour && s[5] ||
				newMins != prevMins && s[6] ||
				newSecs != prevSecs && s[7] ||
				                       s[1]
			);

			prevYear = newYear;
			prevMnth = newMnth;
			prevDate = newDate;
			prevHour = newHour;
			prevMins = newMins;
			prevSecs = newSecs;

			return stamp(date);
		});
	}
}

// for when axis.values is defined as a static fmtDate template string
function timeAxisVal(tzDate, dateTpl) {
	let stamp = fmtDate(dateTpl);
	return (self, splits, axisIdx, foundSpace, foundIncr) => splits.map(split => stamp(tzDate(split)));
}

function mkDate(y, m, d) {
	return new Date(y, m, d);
}

function timeSeriesStamp(stampCfg, fmtDate) {
	return fmtDate(stampCfg);
}
const _timeSeriesStamp = '{YYYY}-{MM}-{DD} {h}:{mm}{aa}';

function timeSeriesVal(tzDate, stamp) {
	return (self, val, seriesIdx, dataIdx) => dataIdx == null ? LEGEND_DISP : stamp(tzDate(val));
}

function legendStroke(self, seriesIdx) {
	let s = self.series[seriesIdx];
	return s.width ? s.stroke(self, seriesIdx) : s.points.width ? s.points.stroke(self, seriesIdx) : null;
}

function legendFill(self, seriesIdx) {
	return self.series[seriesIdx].fill(self, seriesIdx);
}

const legendOpts = {
	show: true,
	live: true,
	isolate: false,
	mount: noop,
	markers: {
		show: true,
		width: 2,
		stroke: legendStroke,
		fill: legendFill,
		dash: "solid",
	},
	idx: null,
	idxs: null,
	values: [],
};

function cursorPointShow(self, si) {
	let o = self.cursor.points;

	let pt = placeDiv();

	let size = o.size(self, si);
	setStylePx(pt, WIDTH, size);
	setStylePx(pt, HEIGHT, size);

	let mar = size / -2;
	setStylePx(pt, "marginLeft", mar);
	setStylePx(pt, "marginTop", mar);

	let width = o.width(self, si, size);
	width && setStylePx(pt, "borderWidth", width);

	return pt;
}

function cursorPointFill(self, si) {
	let sp = self.series[si].points;
	return sp._fill || sp._stroke;
}

function cursorPointStroke(self, si) {
	let sp = self.series[si].points;
	return sp._stroke || sp._fill;
}

function cursorPointSize(self, si) {
	let sp = self.series[si].points;
	return sp.size;
}

const moveTuple = [0,0];

function cursorMove(self, mouseLeft1, mouseTop1) {
	moveTuple[0] = mouseLeft1;
	moveTuple[1] = mouseTop1;
	return moveTuple;
}

function filtBtn0(self, targ, handle, onlyTarg = true) {
	return e => {
		e.button == 0 && (!onlyTarg || e.target == targ) && handle(e);
	};
}

function filtTarg(self, targ, handle, onlyTarg = true) {
	return e => {
		(!onlyTarg || e.target == targ) && handle(e);
	};
}

const cursorOpts = {
	show: true,
	x: true,
	y: true,
	lock: false,
	move: cursorMove,
	points: {
		one:    false,
		show:   cursorPointShow,
		size:   cursorPointSize,
		width:  0,
		stroke: cursorPointStroke,
		fill:   cursorPointFill,
	},

	bind: {
		mousedown:   filtBtn0,
		mouseup:     filtBtn0,
		click:       filtBtn0, // legend clicks, not .u-over clicks
		dblclick:    filtBtn0,

		mousemove:   filtTarg,
		mouseleave:  filtTarg,
		mouseenter:  filtTarg,
	},

	drag: {
		setScale: true,
		x: true,
		y: false,
		dist: 0,
		uni: null,
		click: (self, e) => {
		//	e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
		},
		_x: false,
		_y: false,
	},

	focus: {
		dist: (self, seriesIdx, dataIdx, valPos, curPos) => valPos - curPos,
		prox: -1,
		bias: 0,
	},

	hover: {
		skip: [void 0],
		prox: null,
		bias: 0,
	},

	left: -10,
	top: -10,
	idx: null,
	dataIdx: null,
	idxs: null,

	event: null,
};

const axisLines = {
	show: true,
	stroke: "rgba(0,0,0,0.07)",
	width: 2,
//	dash: [],
};

const grid = assign({}, axisLines, {
	filter: retArg1,
});

const ticks = assign({}, grid, {
	size: 10,
});

const border = assign({}, axisLines, {
	show: false,
});

const font      = '12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const labelFont = "bold " + font;
const lineGap = 1.5;	// font-size multiplier

const xAxisOpts = {
	show: true,
	scale: "x",
	stroke: hexBlack,
	space: 50,
	gap: 5,
	alignTo: 1,
	size: 50,
	labelGap: 0,
	labelSize: 30,
	labelFont,
	side: 2,
//	class: "x-vals",
//	incrs: timeIncrs,
//	values: timeVals,
//	filter: retArg1,
	grid,
	ticks,
	border,
	font,
	lineGap,
	rotate: 0,
};

const numSeriesLabel = "Value";
const timeSeriesLabel = "Time";

const xSeriesOpts = {
	show: true,
	scale: "x",
	auto: false,
	sorted: 1,
//	label: "Time",
//	value: v => stamp(new Date(v * 1e3)),

	// internal caches
	min: inf,
	max: -inf,
	idxs: [],
};

function numAxisVals(self, splits, axisIdx, foundSpace, foundIncr) {
	return splits.map(v => v == null ? "" : fmtNum(v));
}

function numAxisSplits(self, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
	let splits = [];

	let numDec = fixedDec.get(foundIncr) || 0;

	scaleMin = forceMin ? scaleMin : roundDec(incrRoundUp(scaleMin, foundIncr), numDec);

	for (let val = scaleMin; val <= scaleMax; val = roundDec(val + foundIncr, numDec))
		splits.push(Object.is(val, -0) ? 0 : val);		// coalesces -0

	return splits;
}

// this doesnt work for sin, which needs to come off from 0 independently in pos and neg dirs
function logAxisSplits(self, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
	const splits = [];

	const logBase = self.scales[self.axes[axisIdx].scale].log;

	const logFn = logBase == 10 ? log10 : log2;

	const exp = floor(logFn(scaleMin));

	foundIncr = pow(logBase, exp);

	// boo: 10 ** -24 === 1.0000000000000001e-24
	// this grabs the proper 1e-24 one
	if (logBase == 10)
		foundIncr = numIncrs[closestIdx(foundIncr, numIncrs)];

	let split = scaleMin;
	let nextMagIncr = foundIncr * logBase;

	if (logBase == 10)
		nextMagIncr = numIncrs[closestIdx(nextMagIncr, numIncrs)];

	do {
		splits.push(split);
		split = split + foundIncr;

		if (logBase == 10 && !fixedDec.has(split))
			split = roundDec(split, fixedDec.get(foundIncr));

		if (split >= nextMagIncr) {
			foundIncr = split;
			nextMagIncr = foundIncr * logBase;

			if (logBase == 10)
				nextMagIncr = numIncrs[closestIdx(nextMagIncr, numIncrs)];
		}
	} while (split <= scaleMax);

	return splits;
}

function asinhAxisSplits(self, axisIdx, scaleMin, scaleMax, foundIncr, foundSpace, forceMin) {
	let sc = self.scales[self.axes[axisIdx].scale];

	let linthresh = sc.asinh;

	let posSplits = scaleMax > linthresh ? logAxisSplits(self, axisIdx, max(linthresh, scaleMin), scaleMax, foundIncr) : [linthresh];
	let zero = scaleMax >= 0 && scaleMin <= 0 ? [0] : [];
	let negSplits = scaleMin < -linthresh ? logAxisSplits(self, axisIdx, max(linthresh, -scaleMax), -scaleMin, foundIncr): [linthresh];

	return negSplits.reverse().map(v => -v).concat(zero, posSplits);
}

const RE_ALL   = /./;
const RE_12357 = /[12357]/;
const RE_125   = /[125]/;
const RE_1     = /1/;

const _filt = (splits, distr, re, keepMod) => splits.map((v, i) => ((distr == 4 && v == 0) || i % keepMod == 0 && re.test(v.toExponential()[v < 0 ? 1 : 0])) ? v : null);

function log10AxisValsFilt(self, splits, axisIdx, foundSpace, foundIncr) {
	let axis = self.axes[axisIdx];
	let scaleKey = axis.scale;
	let sc = self.scales[scaleKey];

//	if (sc.distr == 3 && sc.log == 2)
//		return splits;

	let valToPos = self.valToPos;

	let minSpace = axis._space;

	let _10 = valToPos(10, scaleKey);

	let re = (
		valToPos(9, scaleKey) - _10 >= minSpace ? RE_ALL :
		valToPos(7, scaleKey) - _10 >= minSpace ? RE_12357 :
		valToPos(5, scaleKey) - _10 >= minSpace ? RE_125 :
		RE_1
	);

	if (re == RE_1) {
		let magSpace = abs(valToPos(1, scaleKey) - _10);

		if (magSpace < minSpace)
			return _filt(splits.slice().reverse(), sc.distr, re, ceil(minSpace / magSpace)).reverse(); // max->min skip
	}

	return _filt(splits, sc.distr, re, 1);
}

function log2AxisValsFilt(self, splits, axisIdx, foundSpace, foundIncr) {
	let axis = self.axes[axisIdx];
	let scaleKey = axis.scale;
	let minSpace = axis._space;
	let valToPos = self.valToPos;

	let magSpace = abs(valToPos(1, scaleKey) - valToPos(2, scaleKey));

	if (magSpace < minSpace)
		return _filt(splits.slice().reverse(), 3, RE_ALL, ceil(minSpace / magSpace)).reverse(); // max->min skip

	return splits;
}

function numSeriesVal(self, val, seriesIdx, dataIdx) {
	return dataIdx == null ? LEGEND_DISP : val == null ? "" : fmtNum(val);
}

const yAxisOpts = {
	show: true,
	scale: "y",
	stroke: hexBlack,
	space: 30,
	gap: 5,
	alignTo: 1,
	size: 50,
	labelGap: 0,
	labelSize: 30,
	labelFont,
	side: 3,
//	class: "y-vals",
//	incrs: numIncrs,
//	values: (vals, space) => vals,
//	filter: retArg1,
	grid,
	ticks,
	border,
	font,
	lineGap,
	rotate: 0,
};

// takes stroke width
function ptDia(width, mult) {
	let dia = 3 + (width || 1) * 2;
	return roundDec(dia * mult, 3);
}

function seriesPointsShow(self, si) {
	let { scale, idxs } = self.series[0];
	let xData = self._data[0];
	let p0 = self.valToPos(xData[idxs[0]], scale, true);
	let p1 = self.valToPos(xData[idxs[1]], scale, true);
	let dim = abs(p1 - p0);

	let s = self.series[si];
//	const dia = ptDia(s.width, pxRatio);
	let maxPts = dim / (s.points.space * pxRatio);
	return idxs[1] - idxs[0] <= maxPts;
}

const facet = {
	scale: null,
	auto: true,
	sorted: 0,

	// internal caches
	min: inf,
	max: -inf,
};

const gaps = (self, seriesIdx, idx0, idx1, nullGaps) => nullGaps;

const xySeriesOpts = {
	show: true,
	auto: true,
	sorted: 0,
	gaps,
	alpha: 1,
	facets: [
		assign({}, facet, {scale: 'x'}),
		assign({}, facet, {scale: 'y'}),
	],
};

const ySeriesOpts = {
	scale: "y",
	auto: true,
	sorted: 0,
	show: true,
	spanGaps: false,
	gaps,
	alpha: 1,
	points: {
		show: seriesPointsShow,
		filter: null,
	//  paths:
	//	stroke: "#000",
	//	fill: "#fff",
	//	width: 1,
	//	size: 10,
	},
//	label: "Value",
//	value: v => v,
	values: null,

	// internal caches
	min: inf,
	max: -inf,
	idxs: [],

	path: null,
	clip: null,
};

function clampScale(self, val, scaleMin, scaleMax, scaleKey) {
/*
	if (val < 0) {
		let cssHgt = self.bbox.height / pxRatio;
		let absPos = self.valToPos(abs(val), scaleKey);
		let fromBtm = cssHgt - absPos;
		return self.posToVal(cssHgt + fromBtm, scaleKey);
	}
*/
	return scaleMin / 10;
}

const xScaleOpts = {
	time: FEAT_TIME,
	auto: true,
	distr: 1,
	log: 10,
	asinh: 1,
	min: null,
	max: null,
	dir: 1,
	ori: 0,
};

const yScaleOpts = assign({}, xScaleOpts, {
	time: false,
	ori: 1,
});

const syncs = {};

function _sync(key, opts) {
	let s = syncs[key];

	if (!s) {
		s = {
			key,
			plots: [],
			sub(plot) {
				s.plots.push(plot);
			},
			unsub(plot) {
				s.plots = s.plots.filter(c => c != plot);
			},
			pub(type, self, x, y, w, h, i) {
				for (let j = 0; j < s.plots.length; j++)
					s.plots[j] != self && s.plots[j].pub(type, self, x, y, w, h, i);
			},
		};

		if (key != null)
			syncs[key] = s;
	}

	return s;
}

const BAND_CLIP_FILL   = 1 << 0;
const BAND_CLIP_STROKE = 1 << 1;

function orient(u, seriesIdx, cb) {
	const mode = u.mode;
	const series = u.series[seriesIdx];
	const data = mode == 2 ? u._data[seriesIdx] : u._data;
	const scales = u.scales;
	const bbox   = u.bbox;

	let dx = data[0],
		dy = mode == 2 ? data[1] : data[seriesIdx],
		sx = mode == 2 ? scales[series.facets[0].scale] : scales[u.series[0].scale],
		sy = mode == 2 ? scales[series.facets[1].scale] : scales[series.scale],
		l = bbox.left,
		t = bbox.top,
		w = bbox.width,
		h = bbox.height,
		H = u.valToPosH,
		V = u.valToPosV;

	return (sx.ori == 0
		? cb(
			series,
			dx,
			dy,
			sx,
			sy,
			H,
			V,
			l,
			t,
			w,
			h,
			moveToH,
			lineToH,
			rectH,
			arcH,
			bezierCurveToH,
		)
		: cb(
			series,
			dx,
			dy,
			sx,
			sy,
			V,
			H,
			t,
			l,
			h,
			w,
			moveToV,
			lineToV,
			rectV,
			arcV,
			bezierCurveToV,
		)
	);
}

function bandFillClipDirs(self, seriesIdx) {
	let fillDir = 0;

	// 2 bits, -1 | 1
	let clipDirs = 0;

	let bands = ifNull(self.bands, EMPTY_ARR);

	for (let i = 0; i < bands.length; i++) {
		let b = bands[i];

		// is a "from" band edge
		if (b.series[0] == seriesIdx)
			fillDir = b.dir;
		// is a "to" band edge
		else if (b.series[1] == seriesIdx) {
			if (b.dir == 1)
				clipDirs |= 1;
			else
				clipDirs |= 2;
		}
	}

	return [
		fillDir,
		(
			clipDirs == 1 ? -1 : // neg only
			clipDirs == 2 ?  1 : // pos only
			clipDirs == 3 ?  2 : // both
			                 0   // neither
		)
	];
}

function seriesFillTo(self, seriesIdx, dataMin, dataMax, bandFillDir) {
	let mode = self.mode;
	let series = self.series[seriesIdx];
	let scaleKey = mode == 2 ? series.facets[1].scale : series.scale;
	let scale = self.scales[scaleKey];

	return (
		bandFillDir == -1 ? scale.min :
		bandFillDir ==  1 ? scale.max :
		scale.distr ==  3 ? (
			scale.dir == 1 ? scale.min :
			scale.max
		) : 0
	);
}

// creates inverted band clip path (from stroke path -> yMax || yMin)
// clipDir is always inverse of fillDir
// default clip dir is upwards (1), since default band fill is downwards/fillBelowTo (-1) (highIdx -> lowIdx)
function clipBandLine(self, seriesIdx, idx0, idx1, strokePath, clipDir) {
	return orient(self, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
		let pxRound = series.pxRound;

		const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
		const lineTo = scaleX.ori == 0 ? lineToH : lineToV;

		let frIdx, toIdx;

		if (dir == 1) {
			frIdx = idx0;
			toIdx = idx1;
		}
		else {
			frIdx = idx1;
			toIdx = idx0;
		}

		// path start
		let x0 = pxRound(valToPosX(dataX[frIdx], scaleX, xDim, xOff));
		let y0 = pxRound(valToPosY(dataY[frIdx], scaleY, yDim, yOff));
		// path end x
		let x1 = pxRound(valToPosX(dataX[toIdx], scaleX, xDim, xOff));
		// upper or lower y limit
		let yLimit = pxRound(valToPosY(clipDir == 1 ? scaleY.max : scaleY.min, scaleY, yDim, yOff));

		let clip = new Path2D(strokePath);

		lineTo(clip, x1, yLimit);
		lineTo(clip, x0, yLimit);
		lineTo(clip, x0, y0);

		return clip;
	});
}

function clipGaps(gaps, ori, plotLft, plotTop, plotWid, plotHgt) {
	let clip = null;

	// create clip path (invert gaps and non-gaps)
	if (gaps.length > 0) {
		clip = new Path2D();

		const rect = ori == 0 ? rectH : rectV;

		let prevGapEnd = plotLft;

		for (let i = 0; i < gaps.length; i++) {
			let g = gaps[i];

			if (g[1] > g[0]) {
				let w = g[0] - prevGapEnd;

				w > 0 && rect(clip, prevGapEnd, plotTop, w, plotTop + plotHgt);

				prevGapEnd = g[1];
			}
		}

		let w = plotLft + plotWid - prevGapEnd;

		// hack to ensure we expand the clip enough to avoid cutting off strokes at edges
		let maxStrokeWidth = 10;

		w > 0 && rect(clip, prevGapEnd, plotTop - maxStrokeWidth / 2, w, plotTop + plotHgt + maxStrokeWidth);
	}

	return clip;
}

function addGap(gaps, fromX, toX) {
	let prevGap = gaps[gaps.length - 1];

	if (prevGap && prevGap[0] == fromX)			// TODO: gaps must be encoded at stroke widths?
		prevGap[1] = toX;
	else
		gaps.push([fromX, toX]);
}

function findGaps(xs, ys, idx0, idx1, dir, pixelForX, align) {
	let gaps = [];
	let len = xs.length;

	for (let i = dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += dir) {
		let yVal = ys[i];

		if (yVal === null) {
			let fr = i, to = i;

			if (dir == 1) {
				while (++i <= idx1 && ys[i] === null)
					to = i;
			}
			else {
				while (--i >= idx0 && ys[i] === null)
					to = i;
			}

			let frPx = pixelForX(xs[fr]);
			let toPx = to == fr ? frPx : pixelForX(xs[to]);

			// if value adjacent to edge null is same pixel, then it's partially
			// filled and gap should start at next pixel
			let fri2 = fr - dir;
			let frPx2 = align <= 0 && fri2 >= 0 && fri2 < len ? pixelForX(xs[fri2]) : frPx;
		//	if (frPx2 == frPx)
		//		frPx++;
		//	else
				frPx = frPx2;

			let toi2 = to + dir;
			let toPx2 = align >= 0 && toi2 >= 0 && toi2 < len ? pixelForX(xs[toi2]) : toPx;
		//	if (toPx2 == toPx)
		//		toPx--;
		//	else
				toPx = toPx2;

			if (toPx >= frPx)
				gaps.push([frPx, toPx]); // addGap
		}
	}

	return gaps;
}

function pxRoundGen(pxAlign) {
	return pxAlign == 0 ? retArg0 : pxAlign == 1 ? round : v => incrRound(v, pxAlign);
}

/*
// inefficient linear interpolation that does bi-directinal scans on each call
export function costlyLerp(i, idx0, idx1, _dirX, dataY) {
	let prevNonNull = nonNullIdx(dataY, _dirX == 1 ? idx0 : idx1, i, -_dirX);
	let nextNonNull = nonNullIdx(dataY, i, _dirX == 1 ? idx1 : idx0,  _dirX);

	let prevVal = dataY[prevNonNull];
	let nextVal = dataY[nextNonNull];

	return prevVal + (i - prevNonNull) / (nextNonNull - prevNonNull) * (nextVal - prevVal);
}
*/

function rect(ori) {
	let moveTo = ori == 0 ?
		moveToH :
		moveToV;

	let arcTo = ori == 0 ?
		(p, x1, y1, x2, y2, r) => { p.arcTo(x1, y1, x2, y2, r); } :
		(p, y1, x1, y2, x2, r) => { p.arcTo(x1, y1, x2, y2, r); };

	let rect = ori == 0 ?
		(p, x, y, w, h) => { p.rect(x, y, w, h); } :
		(p, y, x, h, w) => { p.rect(x, y, w, h); };

	// TODO (pending better browser support): https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/roundRect
	return (p, x, y, w, h, endRad = 0, baseRad = 0) => {
		if (endRad == 0 && baseRad == 0)
			rect(p, x, y, w, h);
		else {
			endRad  = min(endRad,  w / 2, h / 2);
			baseRad = min(baseRad, w / 2, h / 2);

			// adapted from https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas/7838871#7838871
			moveTo(p, x + endRad, y);
			arcTo(p, x + w, y, x + w, y + h, endRad);
			arcTo(p, x + w, y + h, x, y + h, baseRad);
			arcTo(p, x, y + h, x, y, baseRad);
			arcTo(p, x, y, x + w, y, endRad);
			p.closePath();
		}
	};
}

// orientation-inverting canvas functions
const moveToH = (p, x, y) => { p.moveTo(x, y); };
const moveToV = (p, y, x) => { p.moveTo(x, y); };
const lineToH = (p, x, y) => { p.lineTo(x, y); };
const lineToV = (p, y, x) => { p.lineTo(x, y); };
const rectH = rect(0);
const rectV = rect(1);
const arcH = (p, x, y, r, startAngle, endAngle) => { p.arc(x, y, r, startAngle, endAngle); };
const arcV = (p, y, x, r, startAngle, endAngle) => { p.arc(x, y, r, startAngle, endAngle); };
const bezierCurveToH = (p, bp1x, bp1y, bp2x, bp2y, p2x, p2y) => { p.bezierCurveTo(bp1x, bp1y, bp2x, bp2y, p2x, p2y); };
const bezierCurveToV = (p, bp1y, bp1x, bp2y, bp2x, p2y, p2x) => { p.bezierCurveTo(bp1x, bp1y, bp2x, bp2y, p2x, p2y); };

// TODO: drawWrap(seriesIdx, drawPoints) (save, restore, translate, clip)
function points(opts) {
	return (u, seriesIdx, idx0, idx1, filtIdxs) => {
	//	log("drawPoints()", arguments);

		return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
			let { pxRound, points } = series;

			let moveTo, arc;

			if (scaleX.ori == 0) {
				moveTo = moveToH;
				arc = arcH;
			}
			else {
				moveTo = moveToV;
				arc = arcV;
			}

			const width = roundDec(points.width * pxRatio, 3);

			let rad = (points.size - points.width) / 2 * pxRatio;
			let dia = roundDec(rad * 2, 3);

			let fill = new Path2D();
			let clip = new Path2D();

			let { left: lft, top: top, width: wid, height: hgt } = u.bbox;

			rectH(clip,
				lft - dia,
				top - dia,
				wid + dia * 2,
				hgt + dia * 2,
			);

			const drawPoint = pi => {
				if (dataY[pi] != null) {
					let x = pxRound(valToPosX(dataX[pi], scaleX, xDim, xOff));
					let y = pxRound(valToPosY(dataY[pi], scaleY, yDim, yOff));

					moveTo(fill, x + rad, y);
					arc(fill, x, y, rad, 0, PI * 2);
				}
			};

			if (filtIdxs)
				filtIdxs.forEach(drawPoint);
			else {
				for (let pi = idx0; pi <= idx1; pi++)
					drawPoint(pi);
			}

			return {
				stroke: width > 0 ? fill : null,
				fill,
				clip,
				flags: BAND_CLIP_FILL | BAND_CLIP_STROKE,
			};
		});
	};
}

function _drawAcc(lineTo) {
	return (stroke, accX, minY, maxY, inY, outY) => {
		if (minY != maxY) {
			if (inY != minY && outY != minY)
				lineTo(stroke, accX, minY);
			if (inY != maxY && outY != maxY)
				lineTo(stroke, accX, maxY);

			lineTo(stroke, accX, outY);
		}
	};
}

const drawAccH = _drawAcc(lineToH);
const drawAccV = _drawAcc(lineToV);

function linear(opts) {
	const alignGaps = ifNull(opts?.alignGaps, 0);

	return (u, seriesIdx, idx0, idx1) => {
		return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
			[idx0, idx1] = nonNullIdxs(dataY, idx0, idx1);

			let pxRound = series.pxRound;

			let pixelForX = val => pxRound(valToPosX(val, scaleX, xDim, xOff));
			let pixelForY = val => pxRound(valToPosY(val, scaleY, yDim, yOff));

			let lineTo, drawAcc;

			if (scaleX.ori == 0) {
				lineTo = lineToH;
				drawAcc = drawAccH;
			}
			else {
				lineTo = lineToV;
				drawAcc = drawAccV;
			}

			const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);

			const _paths = {stroke: new Path2D(), fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL};
			const stroke = _paths.stroke;

			let hasGap = false;

			// decimate when number of points >= 4x available pixels
			const decimate = idx1 - idx0 >= xDim * 4;

			if (decimate) {
				let xForPixel = pos => u.posToVal(pos, scaleX.key, true);

				let minY = null,
					maxY = null,
					inY, outY, drawnAtX;

				let accX = pixelForX(dataX[dir == 1 ? idx0 : idx1]);

				let idx0px = pixelForX(dataX[idx0]);
				let idx1px = pixelForX(dataX[idx1]);

				// tracks limit of current x bucket to avoid having to get x pixel for every x value
				let nextAccXVal = xForPixel(dir == 1 ? idx0px + 1 : idx1px - 1);

				for (let i = dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += dir) {
					let xVal = dataX[i];
					let reuseAccX = dir == 1 ? (xVal < nextAccXVal) : (xVal > nextAccXVal);
					let x = reuseAccX ? accX :  pixelForX(xVal);

					let yVal = dataY[i];

					if (x == accX) {
						if (yVal != null) {
							outY = yVal;

							if (minY == null) {
								lineTo(stroke, x, pixelForY(outY));
								inY = minY = maxY = outY;
							} else {
								if (outY < minY)
									minY = outY;
								else if (outY > maxY)
									maxY = outY;
							}
						}
						else {
							if (yVal === null)
								hasGap = true;
						}
					}
					else {
						if (minY != null)
							drawAcc(stroke, accX, pixelForY(minY), pixelForY(maxY), pixelForY(inY), pixelForY(outY));

						if (yVal != null) {
							outY = yVal;
							lineTo(stroke, x, pixelForY(outY));
							minY = maxY = inY = outY;
						}
						else {
							minY = maxY = null;

							if (yVal === null)
								hasGap = true;
						}

						accX = x;
						nextAccXVal = xForPixel(accX + dir);
					}
				}

				if (minY != null && minY != maxY && drawnAtX != accX)
					drawAcc(stroke, accX, pixelForY(minY), pixelForY(maxY), pixelForY(inY), pixelForY(outY));
			}
			else {
				for (let i = dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += dir) {
					let yVal = dataY[i];

					if (yVal === null)
						hasGap = true;
					else if (yVal != null)
						lineTo(stroke, pixelForX(dataX[i]), pixelForY(yVal));
				}
			}

			let [ bandFillDir, bandClipDir ] = bandFillClipDirs(u, seriesIdx);

			if (series.fill != null || bandFillDir != 0) {
				let fill = _paths.fill = new Path2D(stroke);

				let fillToVal = series.fillTo(u, seriesIdx, series.min, series.max, bandFillDir);
				let fillToY = pixelForY(fillToVal);

				let frX = pixelForX(dataX[idx0]);
				let toX = pixelForX(dataX[idx1]);

				if (dir == -1)
					[toX, frX] = [frX, toX];

				lineTo(fill, toX, fillToY);
				lineTo(fill, frX, fillToY);
			}

			if (!series.spanGaps) { // skip in mode: 2?
			//	console.time('gaps');
				let gaps = [];

				hasGap && gaps.push(...findGaps(dataX, dataY, idx0, idx1, dir, pixelForX, alignGaps));

			//	console.timeEnd('gaps');

			//	console.log('gaps', JSON.stringify(gaps));

				_paths.gaps = gaps = series.gaps(u, seriesIdx, idx0, idx1, gaps);

				_paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
			}

			if (bandClipDir != 0) {
				_paths.band = bandClipDir == 2 ? [
					clipBandLine(u, seriesIdx, idx0, idx1, stroke, -1),
					clipBandLine(u, seriesIdx, idx0, idx1, stroke,  1),
				] : clipBandLine(u, seriesIdx, idx0, idx1, stroke, bandClipDir);
			}

			return _paths;
		});
	};
}

// BUG: align: -1 behaves like align: 1 when scale.dir: -1
function stepped(opts) {
	const align = ifNull(opts.align, 1);
	// whether to draw ascenders/descenders at null/gap bondaries
	const ascDesc = ifNull(opts.ascDesc, false);
	const alignGaps = ifNull(opts.alignGaps, 0);
	const extend = ifNull(opts.extend, false);

	return (u, seriesIdx, idx0, idx1) => {
		return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
			[idx0, idx1] = nonNullIdxs(dataY, idx0, idx1);

			let pxRound = series.pxRound;

			let { left, width } = u.bbox;

			let pixelForX = val => pxRound(valToPosX(val, scaleX, xDim, xOff));
			let pixelForY = val => pxRound(valToPosY(val, scaleY, yDim, yOff));

			let lineTo = scaleX.ori == 0 ? lineToH : lineToV;

			const _paths = {stroke: new Path2D(), fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL};
			const stroke = _paths.stroke;

			const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);

			let prevYPos  = pixelForY(dataY[dir == 1 ? idx0 : idx1]);
			let firstXPos = pixelForX(dataX[dir == 1 ? idx0 : idx1]);
			let prevXPos = firstXPos;

			let firstXPosExt = firstXPos;

			if (extend && align == -1) {
				firstXPosExt = left;
				lineTo(stroke, firstXPosExt, prevYPos);
			}

			lineTo(stroke, firstXPos, prevYPos);

			for (let i = dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += dir) {
				let yVal1 = dataY[i];

				if (yVal1 == null)
					continue;

				let x1 = pixelForX(dataX[i]);
				let y1 = pixelForY(yVal1);

				if (align == 1)
					lineTo(stroke, x1, prevYPos);
				else
					lineTo(stroke, prevXPos, y1);

				lineTo(stroke, x1, y1);

				prevYPos = y1;
				prevXPos = x1;
			}

			let prevXPosExt = prevXPos;

			if (extend && align == 1) {
				prevXPosExt = left + width;
				lineTo(stroke, prevXPosExt, prevYPos);
			}

			let [ bandFillDir, bandClipDir ] = bandFillClipDirs(u, seriesIdx);

			if (series.fill != null || bandFillDir != 0) {
				let fill = _paths.fill = new Path2D(stroke);

				let fillTo = series.fillTo(u, seriesIdx, series.min, series.max, bandFillDir);
				let fillToY = pixelForY(fillTo);

				lineTo(fill, prevXPosExt, fillToY);
				lineTo(fill, firstXPosExt, fillToY);
			}

			if (!series.spanGaps) {
			//	console.time('gaps');
				let gaps = [];

				gaps.push(...findGaps(dataX, dataY, idx0, idx1, dir, pixelForX, alignGaps));

			//	console.timeEnd('gaps');

			//	console.log('gaps', JSON.stringify(gaps));

				// expand/contract clips for ascenders/descenders
				let halfStroke = (series.width * pxRatio) / 2;
				let startsOffset = (ascDesc || align ==  1) ?  halfStroke : -halfStroke;
				let endsOffset   = (ascDesc || align == -1) ? -halfStroke :  halfStroke;

				gaps.forEach(g => {
					g[0] += startsOffset;
					g[1] += endsOffset;
				});

				_paths.gaps = gaps = series.gaps(u, seriesIdx, idx0, idx1, gaps);

				_paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
			}

			if (bandClipDir != 0) {
				_paths.band = bandClipDir == 2 ? [
					clipBandLine(u, seriesIdx, idx0, idx1, stroke, -1),
					clipBandLine(u, seriesIdx, idx0, idx1, stroke,  1),
				] : clipBandLine(u, seriesIdx, idx0, idx1, stroke, bandClipDir);
			}

			return _paths;
		});
	};
}

function findColWidth(dataX, dataY, valToPosX, scaleX, xDim, xOff, colWid = inf) {
	if (dataX.length > 1) {
		// prior index with non-undefined y data
		let prevIdx = null;

		// scan full dataset for smallest adjacent delta
		// will not work properly for non-linear x scales, since does not do expensive valToPosX calcs till end
		for (let i = 0, minDelta = Infinity; i < dataX.length; i++) {
			if (dataY[i] !== undefined) {
				if (prevIdx != null) {
					let delta = abs(dataX[i] - dataX[prevIdx]);

					if (delta < minDelta) {
						minDelta = delta;
						colWid = abs(valToPosX(dataX[i], scaleX, xDim, xOff) - valToPosX(dataX[prevIdx], scaleX, xDim, xOff));
					}
				}

				prevIdx = i;
			}
		}
	}

	return colWid;
}

function bars(opts) {
	opts = opts || EMPTY_OBJ;
	const size = ifNull(opts.size, [0.6, inf, 1]);
	const align = opts.align || 0;
	const _extraGap = (opts.gap || 0);

	let ro = opts.radius;

	ro =
		// [valueRadius, baselineRadius]
		ro == null ? [0, 0] :
		typeof ro == 'number' ? [ro, 0] : ro;

	const radiusFn = fnOrSelf(ro);

	const gapFactor = 1 - size[0];
	const _maxWidth  = ifNull(size[1], inf);
	const _minWidth  = ifNull(size[2], 1);

	const disp = ifNull(opts.disp, EMPTY_OBJ);
	const _each = ifNull(opts.each, _ => {});

	const { fill: dispFills, stroke: dispStrokes } = disp;

	return (u, seriesIdx, idx0, idx1) => {
		return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
			let pxRound = series.pxRound;
			let _align = align;

			let extraGap = _extraGap * pxRatio;
			let maxWidth = _maxWidth * pxRatio;
			let minWidth = _minWidth * pxRatio;

			let valRadius, baseRadius;

			if (scaleX.ori == 0)
				[valRadius, baseRadius] = radiusFn(u, seriesIdx);
			else
				[baseRadius, valRadius] = radiusFn(u, seriesIdx);

			const _dirX = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);
		//	const _dirY = scaleY.dir * (scaleY.ori == 1 ? 1 : -1);

			let rect = scaleX.ori == 0 ? rectH : rectV;

			let each = scaleX.ori == 0 ? _each : (u, seriesIdx, i, top, lft, hgt, wid) => {
				_each(u, seriesIdx, i, lft, top, wid, hgt);
			};

			// band where this series is the "from" edge
			let band = ifNull(u.bands, EMPTY_ARR).find(b => b.series[0] == seriesIdx);

			let fillDir = band != null ? band.dir : 0;
			let fillTo = series.fillTo(u, seriesIdx, series.min, series.max, fillDir);
			let fillToY = pxRound(valToPosY(fillTo, scaleY, yDim, yOff));

			// barWid is to center of stroke
			let xShift, barWid, fullGap, colWid = xDim;

			let strokeWidth = pxRound(series.width * pxRatio);

			let multiPath = false;

			let fillColors = null;
			let fillPaths = null;
			let strokeColors = null;
			let strokePaths = null;

			if (dispFills != null && (strokeWidth == 0 || dispStrokes != null)) {
				multiPath = true;

				fillColors = dispFills.values(u, seriesIdx, idx0, idx1);
				fillPaths = new Map();
				(new Set(fillColors)).forEach(color => {
					if (color != null)
						fillPaths.set(color, new Path2D());
				});

				if (strokeWidth > 0) {
					strokeColors = dispStrokes.values(u, seriesIdx, idx0, idx1);
					strokePaths = new Map();
					(new Set(strokeColors)).forEach(color => {
						if (color != null)
							strokePaths.set(color, new Path2D());
					});
				}
			}

			let { x0, size } = disp;

			if (x0 != null && size != null) {
				_align = 1;
				dataX = x0.values(u, seriesIdx, idx0, idx1);

				if (x0.unit == 2)
					dataX = dataX.map(pct => u.posToVal(xOff + pct * xDim, scaleX.key, true));

				// assumes uniform sizes, for now
				let sizes = size.values(u, seriesIdx, idx0, idx1);

				if (size.unit == 2)
					barWid = sizes[0] * xDim;
				else
					barWid = valToPosX(sizes[0], scaleX, xDim, xOff) - valToPosX(0, scaleX, xDim, xOff); // assumes linear scale (delta from 0)

				colWid = findColWidth(dataX, dataY, valToPosX, scaleX, xDim, xOff, colWid);

				let gapWid = colWid - barWid;
				fullGap = gapWid + extraGap;
			}
			else {
				colWid = findColWidth(dataX, dataY, valToPosX, scaleX, xDim, xOff, colWid);

				let gapWid = colWid * gapFactor;

				fullGap = gapWid + extraGap;
				barWid = colWid - fullGap;
			}

			if (fullGap < 1)
				fullGap = 0;

			if (strokeWidth >= barWid / 2)
				strokeWidth = 0;

			// for small gaps, disable pixel snapping since gap inconsistencies become noticible and annoying
			if (fullGap < 5)
				pxRound = retArg0;

			let insetStroke = fullGap > 0;

			let rawBarWid = colWid - fullGap - (insetStroke ? strokeWidth : 0);

			barWid = pxRound(clamp(rawBarWid, minWidth, maxWidth));

			xShift = (_align == 0 ? barWid / 2 : _align == _dirX ? 0 : barWid) - _align * _dirX * ((_align == 0 ? extraGap / 2 : 0) + (insetStroke ? strokeWidth / 2 : 0));


			const _paths = {stroke: null, fill: null, clip: null, band: null, gaps: null, flags: 0};  // disp, geom

			const stroke = multiPath ? null : new Path2D();

			let dataY0 = null;

			if (band != null)
				dataY0 = u.data[band.series[1]];
			else {
				let { y0, y1 } = disp;

				if (y0 != null && y1 != null) {
					dataY = y1.values(u, seriesIdx, idx0, idx1);
					dataY0 = y0.values(u, seriesIdx, idx0, idx1);
				}
			}

			let radVal = valRadius * barWid;
			let radBase = baseRadius * barWid;

			for (let i = _dirX == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += _dirX) {
				let yVal = dataY[i];

				if (yVal == null)
					continue;

				if (dataY0 != null) {
					let yVal0 = dataY0[i] ?? 0;

					if (yVal - yVal0 == 0)
						continue;

					fillToY = valToPosY(yVal0, scaleY, yDim, yOff);
				}

				let xVal = scaleX.distr != 2 || disp != null ? dataX[i] : i;

				// TODO: all xPos can be pre-computed once for all series in aligned set
				let xPos = valToPosX(xVal, scaleX, xDim, xOff);
				let yPos = valToPosY(ifNull(yVal, fillTo), scaleY, yDim, yOff);

				let lft = pxRound(xPos - xShift);
				let btm = pxRound(max(yPos, fillToY));
				let top = pxRound(min(yPos, fillToY));
				// this includes the stroke
				let barHgt = btm - top;

				if (yVal != null) {  // && yVal != fillTo (0 height bar)
					let rv = yVal < 0 ? radBase : radVal;
					let rb = yVal < 0 ? radVal : radBase;

					if (multiPath) {
						if (strokeWidth > 0 && strokeColors[i] != null)
							rect(strokePaths.get(strokeColors[i]), lft, top + floor(strokeWidth / 2), barWid, max(0, barHgt - strokeWidth), rv, rb);

						if (fillColors[i] != null)
							rect(fillPaths.get(fillColors[i]), lft, top + floor(strokeWidth / 2), barWid, max(0, barHgt - strokeWidth), rv, rb);
					}
					else
						rect(stroke, lft, top + floor(strokeWidth / 2), barWid, max(0, barHgt - strokeWidth), rv, rb);

					each(u, seriesIdx, i,
						lft    - strokeWidth / 2,
						top,
						barWid + strokeWidth,
						barHgt,
					);
				}
			}

			if (strokeWidth > 0)
				_paths.stroke = multiPath ? strokePaths : stroke;
			else if (!multiPath) {
				_paths._fill = series.width == 0 ? series._fill : series._stroke ?? series._fill;
				_paths.width = 0;
			}

			_paths.fill = multiPath ? fillPaths : stroke;

			return _paths;
		});
	};
}

function splineInterp(interp, opts) {
	const alignGaps = ifNull(opts?.alignGaps, 0);

	return (u, seriesIdx, idx0, idx1) => {
		return orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim) => {
			[idx0, idx1] = nonNullIdxs(dataY, idx0, idx1);

			let pxRound = series.pxRound;

			let pixelForX = val => pxRound(valToPosX(val, scaleX, xDim, xOff));
			let pixelForY = val => pxRound(valToPosY(val, scaleY, yDim, yOff));

			let moveTo, bezierCurveTo, lineTo;

			if (scaleX.ori == 0) {
				moveTo = moveToH;
				lineTo = lineToH;
				bezierCurveTo = bezierCurveToH;
			}
			else {
				moveTo = moveToV;
				lineTo = lineToV;
				bezierCurveTo = bezierCurveToV;
			}

			const dir = scaleX.dir * (scaleX.ori == 0 ? 1 : -1);

			let firstXPos = pixelForX(dataX[dir == 1 ? idx0 : idx1]);
			let prevXPos = firstXPos;

			let xCoords = [];
			let yCoords = [];

			for (let i = dir == 1 ? idx0 : idx1; i >= idx0 && i <= idx1; i += dir) {
				let yVal = dataY[i];

				if (yVal != null) {
					let xVal = dataX[i];
					let xPos = pixelForX(xVal);

					xCoords.push(prevXPos = xPos);
					yCoords.push(pixelForY(dataY[i]));
				}
			}

			const _paths = {stroke: interp(xCoords, yCoords, moveTo, lineTo, bezierCurveTo, pxRound), fill: null, clip: null, band: null, gaps: null, flags: BAND_CLIP_FILL};
			const stroke = _paths.stroke;

			let [ bandFillDir, bandClipDir ] = bandFillClipDirs(u, seriesIdx);

			if (series.fill != null || bandFillDir != 0) {
				let fill = _paths.fill = new Path2D(stroke);

				let fillTo = series.fillTo(u, seriesIdx, series.min, series.max, bandFillDir);
				let fillToY = pixelForY(fillTo);

				lineTo(fill, prevXPos, fillToY);
				lineTo(fill, firstXPos, fillToY);
			}

			if (!series.spanGaps) {
			//	console.time('gaps');
				let gaps = [];

				gaps.push(...findGaps(dataX, dataY, idx0, idx1, dir, pixelForX, alignGaps));

			//	console.timeEnd('gaps');

			//	console.log('gaps', JSON.stringify(gaps));

				_paths.gaps = gaps = series.gaps(u, seriesIdx, idx0, idx1, gaps);

				_paths.clip = clipGaps(gaps, scaleX.ori, xOff, yOff, xDim, yDim);
			}

			if (bandClipDir != 0) {
				_paths.band = bandClipDir == 2 ? [
					clipBandLine(u, seriesIdx, idx0, idx1, stroke, -1),
					clipBandLine(u, seriesIdx, idx0, idx1, stroke,  1),
				] : clipBandLine(u, seriesIdx, idx0, idx1, stroke, bandClipDir);
			}

			return _paths;

			//  if FEAT_PATHS: false in rollup.config.js
			//	u.ctx.save();
			//	u.ctx.beginPath();
			//	u.ctx.rect(u.bbox.left, u.bbox.top, u.bbox.width, u.bbox.height);
			//	u.ctx.clip();
			//	u.ctx.strokeStyle = u.series[sidx].stroke;
			//	u.ctx.stroke(stroke);
			//	u.ctx.fillStyle = u.series[sidx].fill;
			//	u.ctx.fill(fill);
			//	u.ctx.restore();
			//	return null;
		});
	};
}

function monotoneCubic(opts) {
	return splineInterp(_monotoneCubic, opts);
}

// Monotone Cubic Spline interpolation, adapted from the Chartist.js implementation:
// https://github.com/gionkunz/chartist-js/blob/e7e78201bffe9609915e5e53cfafa29a5d6c49f9/src/scripts/interpolation.js#L240-L369
function _monotoneCubic(xs, ys, moveTo, lineTo, bezierCurveTo, pxRound) {
	const n = xs.length;

	if (n < 2)
		return null;

	const path = new Path2D();

	moveTo(path, xs[0], ys[0]);

	if (n == 2)
		lineTo(path, xs[1], ys[1]);
	else {
		let ms  = Array(n),
			ds  = Array(n - 1),
			dys = Array(n - 1),
			dxs = Array(n - 1);

		// calc deltas and derivative
		for (let i = 0; i < n - 1; i++) {
			dys[i] = ys[i + 1] - ys[i];
			dxs[i] = xs[i + 1] - xs[i];
			ds[i]  = dys[i] / dxs[i];
		}

		// determine desired slope (m) at each point using Fritsch-Carlson method
		// http://math.stackexchange.com/questions/45218/implementation-of-monotone-cubic-interpolation
		ms[0] = ds[0];

		for (let i = 1; i < n - 1; i++) {
			if (ds[i] === 0 || ds[i - 1] === 0 || (ds[i - 1] > 0) !== (ds[i] > 0))
				ms[i] = 0;
			else {
				ms[i] = 3 * (dxs[i - 1] + dxs[i]) / (
					(2 * dxs[i] + dxs[i - 1]) / ds[i - 1] +
					(dxs[i] + 2 * dxs[i - 1]) / ds[i]
				);

				if (!isFinite(ms[i]))
					ms[i] = 0;
			}
		}

		ms[n - 1] = ds[n - 2];

		for (let i = 0; i < n - 1; i++) {
			bezierCurveTo(
				path,
				xs[i] + dxs[i] / 3,
				ys[i] + ms[i] * dxs[i] / 3,
				xs[i + 1] - dxs[i] / 3,
				ys[i + 1] - ms[i + 1] * dxs[i] / 3,
				xs[i + 1],
				ys[i + 1],
			);
		}
	}

	return path;
}

const cursorPlots = new Set();

function invalidateRects() {
	for (let u of cursorPlots)
		u.syncRect(true);
}

if (domEnv) {
	on(resize, win, invalidateRects);
	on(scroll, win, invalidateRects, true);
	on(dppxchange, win, () => { uPlot.pxRatio = pxRatio; });
}

const linearPath = linear() ;
const pointsPath = points() ;

function setDefaults(d, xo, yo, initY) {
	let d2 = initY ? [d[0], d[1]].concat(d.slice(2)) : [d[0]].concat(d.slice(1));
	return d2.map((o, i) => setDefault(o, i, xo, yo));
}

function setDefaults2(d, xyo) {
	return d.map((o, i) => i == 0 ? {} : assign({}, xyo, o));  // todo: assign() will not merge facet arrays
}

function setDefault(o, i, xo, yo) {
	return assign({}, (i == 0 ? xo : yo), o);
}

function snapNumX(self, dataMin, dataMax) {
	return dataMin == null ? nullNullTuple : [dataMin, dataMax];
}

const snapTimeX = snapNumX;

// this ensures that non-temporal/numeric y-axes get multiple-snapped padding added above/below
// TODO: also account for incrs when snapping to ensure top of axis gets a tick & value
function snapNumY(self, dataMin, dataMax) {
	return dataMin == null ? nullNullTuple : rangeNum(dataMin, dataMax, rangePad, true);
}

function snapLogY(self, dataMin, dataMax, scale) {
	return dataMin == null ? nullNullTuple : rangeLog(dataMin, dataMax, self.scales[scale].log, false);
}

const snapLogX = snapLogY;

function snapAsinhY(self, dataMin, dataMax, scale) {
	return dataMin == null ? nullNullTuple : rangeAsinh(dataMin, dataMax, self.scales[scale].log, false);
}

const snapAsinhX = snapAsinhY;

// dim is logical (getClientBoundingRect) pixels, not canvas pixels
function findIncr(minVal, maxVal, incrs, dim, minSpace) {
	let intDigits = max(numIntDigits(minVal), numIntDigits(maxVal));

	let delta = maxVal - minVal;

	let incrIdx = closestIdx((minSpace / dim) * delta, incrs);

	do {
		let foundIncr = incrs[incrIdx];
		let foundSpace = dim * foundIncr / delta;

		if (foundSpace >= minSpace && intDigits + (foundIncr < 5 ? fixedDec.get(foundIncr) : 0) <= 17)
			return [foundIncr, foundSpace];
	} while (++incrIdx < incrs.length);

	return [0, 0];
}

function pxRatioFont(font) {
	let fontSize, fontSizeCss;
	font = font.replace(/(\d+)px/, (m, p1) => (fontSize = round((fontSizeCss = +p1) * pxRatio)) + 'px');
	return [font, fontSize, fontSizeCss];
}

function syncFontSize(axis) {
	if (axis.show) {
		[axis.font, axis.labelFont].forEach(f => {
			let size = roundDec(f[2] * pxRatio, 1);
			f[0] = f[0].replace(/[0-9.]+px/, size + 'px');
			f[1] = size;
		});
	}
}

function uPlot(opts, data, then) {
	const self = {
		mode: ifNull(opts.mode, 1),
	};

	const mode = self.mode;

	function getHPos(val, scale, dim, off) {
		let pct = scale.valToPct(val);
		return off + dim * (scale.dir == -1 ? (1 - pct) : pct);
	}

	function getVPos(val, scale, dim, off) {
		let pct = scale.valToPct(val);
		return off + dim * (scale.dir == -1 ? pct : (1 - pct));
	}

	function getPos(val, scale, dim, off) {
		return scale.ori == 0 ? getHPos(val, scale, dim, off) : getVPos(val, scale, dim, off);
	}

	self.valToPosH = getHPos;
	self.valToPosV = getVPos;

	let ready = false;
	self.status = 0;

	const root = self.root = placeDiv(UPLOT);

	if (opts.id != null)
		root.id = opts.id;

	addClass(root, opts.class);

	if (opts.title) {
		let title = placeDiv(TITLE, root);
		title.textContent = opts.title;
	}

	const can = placeTag("canvas");
	const ctx = self.ctx = can.getContext("2d");

	const wrap = placeDiv(WRAP, root);

	on("click", wrap, e => {
		if (e.target === over) {
			let didDrag = mouseLeft1 != mouseLeft0 || mouseTop1 != mouseTop0;
			didDrag && drag.click(self, e);
		}
	}, true);

	const under = self.under = placeDiv(UNDER, wrap);
	wrap.appendChild(can);
	const over = self.over = placeDiv(OVER, wrap);

	opts = copy(opts);

	const pxAlign = +ifNull(opts.pxAlign, 1);

	const pxRound = pxRoundGen(pxAlign);

	(opts.plugins || []).forEach(p => {
		if (p.opts)
			opts = p.opts(self, opts) || opts;
	});

	const ms = opts.ms || 1e-3;

	const series  = self.series = mode == 1 ?
		setDefaults(opts.series || [], xSeriesOpts, ySeriesOpts, false) :
		setDefaults2(opts.series || [null], xySeriesOpts);
	const axes    = self.axes   = setDefaults(opts.axes   || [], xAxisOpts,   yAxisOpts,    true);
	const scales  = self.scales = {};
	const bands   = self.bands  = opts.bands || [];

	bands.forEach(b => {
		b.fill = fnOrSelf(b.fill || null);
		b.dir = ifNull(b.dir, -1);
	});

	const xScaleKey = mode == 2 ? series[1].facets[0].scale : series[0].scale;

	const drawOrderMap = {
		axes: drawAxesGrid,
		series: drawSeries,
	};

	const drawOrder = (opts.drawOrder || ["axes", "series"]).map(key => drawOrderMap[key]);

	function initValToPct(sc) {
		const getVal = (
			sc.distr == 3   ? val => log10(val > 0 ? val : sc.clamp(self, val, sc.min, sc.max, sc.key)) :
			sc.distr == 4   ? val => asinh(val, sc.asinh) :
			sc.distr == 100 ? val => sc.fwd(val) :
			val => val
		);

		return val => {
			let _val = getVal(val);
			let { _min, _max } = sc;
			let delta = _max - _min;
			return (_val - _min) / delta;
		};
	}

	function initScale(scaleKey) {
		let sc = scales[scaleKey];

		if (sc == null) {
			let scaleOpts = (opts.scales || EMPTY_OBJ)[scaleKey] || EMPTY_OBJ;

			if (scaleOpts.from != null) {
				// ensure parent is initialized
				initScale(scaleOpts.from);
				// dependent scales inherit
				let sc = assign({}, scales[scaleOpts.from], scaleOpts, {key: scaleKey});
				sc.valToPct = initValToPct(sc);
				scales[scaleKey] = sc;
			}
			else {
				sc = scales[scaleKey] = assign({}, (scaleKey == xScaleKey ? xScaleOpts : yScaleOpts), scaleOpts);

				sc.key = scaleKey;

				let isTime = sc.time;

				let rn = sc.range;

				let rangeIsArr = isArr(rn);

				if (scaleKey != xScaleKey || (mode == 2 && !isTime)) {
					// if range array has null limits, it should be auto
					if (rangeIsArr && (rn[0] == null || rn[1] == null)) {
						rn = {
							min: rn[0] == null ? autoRangePart : {
								mode: 1,
								hard: rn[0],
								soft: rn[0],
							},
							max: rn[1] == null ? autoRangePart : {
								mode: 1,
								hard: rn[1],
								soft: rn[1],
							},
						};
						rangeIsArr = false;
					}

					if (!rangeIsArr && isObj(rn)) {
						let cfg = rn;
						// this is similar to snapNumY
						rn = (self, dataMin, dataMax) => dataMin == null ? nullNullTuple : rangeNum(dataMin, dataMax, cfg);
					}
				}

				sc.range = fnOrSelf(rn || (isTime ? snapTimeX : scaleKey == xScaleKey ?
					(sc.distr == 3 ? snapLogX : sc.distr == 4 ? snapAsinhX : snapNumX) :
					(sc.distr == 3 ? snapLogY : sc.distr == 4 ? snapAsinhY : snapNumY)
				));

				sc.auto = fnOrSelf(rangeIsArr ? false : sc.auto);

				sc.clamp = fnOrSelf(sc.clamp || clampScale);

				// caches for expensive ops like asinh() & log()
				sc._min = sc._max = null;

				sc.valToPct = initValToPct(sc);
			}
		}
	}

	initScale("x");
	initScale("y");

	// TODO: init scales from facets in mode: 2
	if (mode == 1) {
		series.forEach(s => {
			initScale(s.scale);
		});
	}

	axes.forEach(a => {
		initScale(a.scale);
	});

	for (let k in opts.scales)
		initScale(k);

	const scaleX = scales[xScaleKey];

	const xScaleDistr = scaleX.distr;

	let valToPosX, valToPosY;

	if (scaleX.ori == 0) {
		addClass(root, ORI_HZ);
		valToPosX = getHPos;
		valToPosY = getVPos;
		/*
		updOriDims = () => {
			xDimCan = plotWid;
			xOffCan = plotLft;
			yDimCan = plotHgt;
			yOffCan = plotTop;

			xDimCss = plotWidCss;
			xOffCss = plotLftCss;
			yDimCss = plotHgtCss;
			yOffCss = plotTopCss;
		};
		*/
	}
	else {
		addClass(root, ORI_VT);
		valToPosX = getVPos;
		valToPosY = getHPos;
		/*
		updOriDims = () => {
			xDimCan = plotHgt;
			xOffCan = plotTop;
			yDimCan = plotWid;
			yOffCan = plotLft;

			xDimCss = plotHgtCss;
			xOffCss = plotTopCss;
			yDimCss = plotWidCss;
			yOffCss = plotLftCss;
		};
		*/
	}

	const pendScales = {};

	// explicitly-set initial scales
	for (let k in scales) {
		let sc = scales[k];

		if (sc.min != null || sc.max != null) {
			pendScales[k] = {min: sc.min, max: sc.max};
			sc.min = sc.max = null;
		}
	}

//	self.tz = opts.tz || Intl.DateTimeFormat().resolvedOptions().timeZone;
	const _tzDate  = (opts.tzDate || (ts => new Date(round(ts / ms))));
	const _fmtDate = (opts.fmtDate || fmtDate);

	const _timeAxisSplits = (ms == 1 ? timeAxisSplitsMs(_tzDate) : timeAxisSplitsS(_tzDate));
	const _timeAxisVals   = timeAxisVals(_tzDate, timeAxisStamps((ms == 1 ? _timeAxisStampsMs : _timeAxisStampsS), _fmtDate));
	const _timeSeriesVal  = timeSeriesVal(_tzDate, timeSeriesStamp(_timeSeriesStamp, _fmtDate));

	const activeIdxs = [];

	const legend     = (self.legend = assign({}, legendOpts, opts.legend));
	const cursor     =                (self.cursor = assign({}, cursorOpts, {drag: {y: mode == 2}}, opts.cursor));
	const showLegend = legend.show;
	const showCursor =                cursor.show;
	const markers    = legend.markers;

	{
		legend.idxs = activeIdxs;

		markers.width  = fnOrSelf(markers.width);
		markers.dash   = fnOrSelf(markers.dash);
		markers.stroke = fnOrSelf(markers.stroke);
		markers.fill   = fnOrSelf(markers.fill);
	}

	let legendTable;
	let legendHead;
	let legendBody;
	let legendRows = [];
	let legendCells = [];
	let legendCols;
	let multiValLegend = false;
	let NULL_LEGEND_VALUES = {};

	if (legend.live) {
		const getMultiVals = series[1] ? series[1].values : null;
		multiValLegend = getMultiVals != null;
		legendCols = multiValLegend ? getMultiVals(self, 1, 0) : {_: 0};

		for (let k in legendCols)
			NULL_LEGEND_VALUES[k] = LEGEND_DISP;
	}

	if (showLegend) {
		legendTable = placeTag("table", LEGEND, root);
		legendBody = placeTag("tbody", null, legendTable);

		// allows legend to be moved out of root
		legend.mount(self, legendTable);

		if (multiValLegend) {
			legendHead = placeTag("thead", null, legendTable, legendBody);

			let head = placeTag("tr", null, legendHead);
			placeTag("th", null, head);

			for (var key in legendCols)
				placeTag("th", LEGEND_LABEL, head).textContent = key;
		}
		else {
			addClass(legendTable, LEGEND_INLINE);
			legend.live && addClass(legendTable, LEGEND_LIVE);
		}
	}

	const son  = {show: true};
	const soff = {show: false};

	function initLegendRow(s, i) {
		if (i == 0 && (multiValLegend || !legend.live || mode == 2))
			return nullNullTuple;

		let cells = [];

		let row = placeTag("tr", LEGEND_SERIES, legendBody, legendBody.childNodes[i]);

		addClass(row, s.class);

		if (!s.show)
			addClass(row, OFF);

		let label = placeTag("th", null, row);

		if (markers.show) {
			let indic = placeDiv(LEGEND_MARKER, label);

			if (i > 0) {
				let width  = markers.width(self, i);

				if (width)
					indic.style.border = width + "px " + markers.dash(self, i) + " " + markers.stroke(self, i);

				indic.style.background = markers.fill(self, i);
			}
		}

		let text = placeDiv(LEGEND_LABEL, label);

		if (s.label instanceof HTMLElement)
			text.appendChild(s.label);
		else
			text.textContent = s.label;

		if (i > 0) {
			if (!markers.show)
				text.style.color = s.width > 0 ? markers.stroke(self, i) : markers.fill(self, i);

			onMouse("click", label, e => {
				if (cursor._lock)
					return;

				setCursorEvent(e);

				let seriesIdx = series.indexOf(s);

				if ((e.ctrlKey || e.metaKey) != legend.isolate) {
					// if any other series is shown, isolate this one. else show all
					let isolate = series.some((s, i) => i > 0 && i != seriesIdx && s.show);

					series.forEach((s, i) => {
						i > 0 && setSeries(i, isolate ? (i == seriesIdx ? son : soff) : son, true, syncOpts.setSeries);
					});
				}
				else
					setSeries(seriesIdx, {show: !s.show}, true, syncOpts.setSeries);
			}, false);

			if (cursorFocus) {
				onMouse(mouseenter, label, e => {
					if (cursor._lock)
						return;

					setCursorEvent(e);

					setSeries(series.indexOf(s), FOCUS_TRUE, true, syncOpts.setSeries);
				}, false);
			}
		}

		for (var key in legendCols) {
			let v = placeTag("td", LEGEND_VALUE, row);
			v.textContent = "--";
			cells.push(v);
		}

		return [row, cells];
	}

	const mouseListeners = new Map();

	function onMouse(ev, targ, fn, onlyTarg = true) {
		const targListeners = mouseListeners.get(targ) || {};
		const listener = cursor.bind[ev](self, targ, fn, onlyTarg);

		if (listener) {
			on(ev, targ, targListeners[ev] = listener);
			mouseListeners.set(targ, targListeners);
		}
	}

	function offMouse(ev, targ, fn) {
		const targListeners = mouseListeners.get(targ) || {};

		for (let k in targListeners) {
			if (ev == null || k == ev) {
				off(k, targ, targListeners[k]);
				delete targListeners[k];
			}
		}

		if (ev == null)
			mouseListeners.delete(targ);
	}

	let fullWidCss = 0;
	let fullHgtCss = 0;

	let plotWidCss = 0;
	let plotHgtCss = 0;

	// plot margins to account for axes
	let plotLftCss = 0;
	let plotTopCss = 0;

	// previous values for diffing
	let _plotLftCss = plotLftCss;
	let _plotTopCss = plotTopCss;
	let _plotWidCss = plotWidCss;
	let _plotHgtCss = plotHgtCss;


	let plotLft = 0;
	let plotTop = 0;
	let plotWid = 0;
	let plotHgt = 0;

	self.bbox = {};

	let shouldSetScales = false;
	let shouldSetSize = false;
	let shouldConvergeSize = false;
	let shouldSetCursor = false;
	let shouldSetSelect = false;
	let shouldSetLegend = false;

	function _setSize(width, height, force) {
		if (force || (width != self.width || height != self.height))
			calcSize(width, height);

		resetYSeries(false);

		shouldConvergeSize = true;
		shouldSetSize = true;

		commit();
	}

	function calcSize(width, height) {
	//	log("calcSize()", arguments);

		self.width  = fullWidCss = plotWidCss = width;
		self.height = fullHgtCss = plotHgtCss = height;
		plotLftCss  = plotTopCss = 0;

		calcPlotRect();
		calcAxesRects();

		let bb = self.bbox;

		plotLft = bb.left   = incrRound(plotLftCss * pxRatio, 0.5);
		plotTop = bb.top    = incrRound(plotTopCss * pxRatio, 0.5);
		plotWid = bb.width  = incrRound(plotWidCss * pxRatio, 0.5);
		plotHgt = bb.height = incrRound(plotHgtCss * pxRatio, 0.5);

	//	updOriDims();
	}

	// ensures size calc convergence
	const CYCLE_LIMIT = 3;

	function convergeSize() {
		let converged = false;

		let cycleNum = 0;

		while (!converged) {
			cycleNum++;

			let axesConverged = axesCalc(cycleNum);
			let paddingConverged = paddingCalc(cycleNum);

			converged = cycleNum == CYCLE_LIMIT || (axesConverged && paddingConverged);

			if (!converged) {
				calcSize(self.width, self.height);
				shouldSetSize = true;
			}
		}
	}

	function setSize({width, height}) {
		_setSize(width, height);
	}

	self.setSize = setSize;

	// accumulate axis offsets, reduce canvas width
	function calcPlotRect() {
		// easements for edge labels
		let hasTopAxis = false;
		let hasBtmAxis = false;
		let hasRgtAxis = false;
		let hasLftAxis = false;

		axes.forEach((axis, i) => {
			if (axis.show && axis._show) {
				let {side, _size} = axis;
				let isVt = side % 2;
				let labelSize = axis.label != null ? axis.labelSize : 0;

				let fullSize = _size + labelSize;

				if (fullSize > 0) {
					if (isVt) {
						plotWidCss -= fullSize;

						if (side == 3) {
							plotLftCss += fullSize;
							hasLftAxis = true;
						}
						else
							hasRgtAxis = true;
					}
					else {
						plotHgtCss -= fullSize;

						if (side == 0) {
							plotTopCss += fullSize;
							hasTopAxis = true;
						}
						else
							hasBtmAxis = true;
					}
				}
			}
		});

		sidesWithAxes[0] = hasTopAxis;
		sidesWithAxes[1] = hasRgtAxis;
		sidesWithAxes[2] = hasBtmAxis;
		sidesWithAxes[3] = hasLftAxis;

		// hz padding
		plotWidCss -= _padding[1] + _padding[3];
		plotLftCss += _padding[3];

		// vt padding
		plotHgtCss -= _padding[2] + _padding[0];
		plotTopCss += _padding[0];
	}

	function calcAxesRects() {
		// will accum +
		let off1 = plotLftCss + plotWidCss;
		let off2 = plotTopCss + plotHgtCss;
		// will accum -
		let off3 = plotLftCss;
		let off0 = plotTopCss;

		function incrOffset(side, size) {
			switch (side) {
				case 1: off1 += size; return off1 - size;
				case 2: off2 += size; return off2 - size;
				case 3: off3 -= size; return off3 + size;
				case 0: off0 -= size; return off0 + size;
			}
		}

		axes.forEach((axis, i) => {
			if (axis.show && axis._show) {
				let side = axis.side;

				axis._pos = incrOffset(side, axis._size);

				if (axis.label != null)
					axis._lpos = incrOffset(side, axis.labelSize);
			}
		});
	}

	if (cursor.dataIdx == null) {
		let hov = cursor.hover;

		let skip = hov.skip = new Set(hov.skip ?? []);
		skip.add(void 0); // alignment artifacts
		let prox = hov.prox = fnOrSelf(hov.prox);
		let bias = hov.bias ??= 0;

		// TODO: only scan between in-view idxs (i0, i1)
		cursor.dataIdx = (self, seriesIdx, cursorIdx, valAtPosX) => {
			if (seriesIdx == 0)
				return cursorIdx;

			let idx2 = cursorIdx;

			let _prox = prox(self, seriesIdx, cursorIdx, valAtPosX) ?? inf;
			let withProx = _prox >= 0 && _prox < inf;
			let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss;
			let cursorLft = cursor.left;

			let xValues = data[0];
			let yValues = data[seriesIdx];

			if (skip.has(yValues[cursorIdx])) {
				idx2 = null;

				let nonNullLft = null,
					nonNullRgt = null,
					j;

				if (bias == 0 || bias == -1) {
					j = cursorIdx;
					while (nonNullLft == null && j-- > 0) {
						if (!skip.has(yValues[j]))
							nonNullLft = j;
					}
				}

				if (bias == 0 || bias == 1) {
					j = cursorIdx;
					while (nonNullRgt == null && j++ < yValues.length) {
						if (!skip.has(yValues[j]))
							nonNullRgt = j;
					}
				}

				if (nonNullLft != null || nonNullRgt != null) {
					if (withProx) {
						let lftPos = nonNullLft == null ? -Infinity : valToPosX(xValues[nonNullLft], scaleX, xDim, 0);
						let rgtPos = nonNullRgt == null ?  Infinity : valToPosX(xValues[nonNullRgt], scaleX, xDim, 0);

						let lftDelta = cursorLft - lftPos;
						let rgtDelta = rgtPos - cursorLft;

						if (lftDelta <= rgtDelta) {
							if (lftDelta <= _prox)
								idx2 = nonNullLft;
						} else {
							if (rgtDelta <= _prox)
								idx2 = nonNullRgt;
						}
					}
					else {
						idx2 =
							nonNullRgt == null ? nonNullLft :
							nonNullLft == null ? nonNullRgt :
							cursorIdx - nonNullLft <= nonNullRgt - cursorIdx ? nonNullLft : nonNullRgt;
					}
				}
			}
			else if (withProx) {
				let dist = abs(cursorLft - valToPosX(xValues[cursorIdx], scaleX, xDim, 0));

				if (dist > _prox)
					idx2 = null;
			}

			return idx2;
		};
	}

	const setCursorEvent = e => { cursor.event = e; };

	cursor.idxs = activeIdxs;

	cursor._lock = false;

	let points = cursor.points;

	points.show   = fnOrSelf(points.show);
	points.size   = fnOrSelf(points.size);
	points.stroke = fnOrSelf(points.stroke);
	points.width  = fnOrSelf(points.width);
	points.fill   = fnOrSelf(points.fill);

	const focus = self.focus = assign({}, opts.focus || {alpha: 0.3}, cursor.focus);

	const cursorFocus = focus.prox >= 0;
	const cursorOnePt = cursorFocus && points.one;

	// series-intersection markers
	let cursorPts = [];
	// position caches in CSS pixels
	let cursorPtsLft = [];
	let cursorPtsTop = [];

	function initCursorPt(s, si) {
		let pt = points.show(self, si);

		if (pt instanceof HTMLElement) {
			addClass(pt, CURSOR_PT);
			addClass(pt, s.class);
			elTrans(pt, -10, -10, plotWidCss, plotHgtCss);
			over.insertBefore(pt, cursorPts[si]);

			return pt;
		}
	}

	function initSeries(s, i) {
		if (mode == 1 || i > 0) {
			let isTime = mode == 1 && scales[s.scale].time;

			let sv = s.value;
			s.value = isTime ? (isStr(sv) ? timeSeriesVal(_tzDate, timeSeriesStamp(sv, _fmtDate)) : sv || _timeSeriesVal) : sv || numSeriesVal;
			s.label = s.label || (isTime ? timeSeriesLabel : numSeriesLabel);
		}

		if (cursorOnePt || i > 0) {
			s.width  = s.width == null ? 1 : s.width;
			s.paths  = s.paths || linearPath || retNull;
			s.fillTo = fnOrSelf(s.fillTo || seriesFillTo);
			s.pxAlign = +ifNull(s.pxAlign, pxAlign);
			s.pxRound = pxRoundGen(s.pxAlign);

			s.stroke = fnOrSelf(s.stroke || null);
			s.fill   = fnOrSelf(s.fill || null);
			s._stroke = s._fill = s._paths = s._focus = null;

			let _ptDia = ptDia(max(1, s.width), 1);
			let points = s.points = assign({}, {
				size: _ptDia,
				width: max(1, _ptDia * .2),
				stroke: s.stroke,
				space: _ptDia * 2,
				paths: pointsPath,
				_stroke: null,
				_fill: null,
			}, s.points);
			points.show   = fnOrSelf(points.show);
			points.filter = fnOrSelf(points.filter);
			points.fill   = fnOrSelf(points.fill);
			points.stroke = fnOrSelf(points.stroke);
			points.paths  = fnOrSelf(points.paths);
			points.pxAlign = s.pxAlign;
		}

		if (showLegend) {
			let rowCells = initLegendRow(s, i);
			legendRows.splice(i, 0, rowCells[0]);
			legendCells.splice(i, 0, rowCells[1]);
			legend.values.push(null);	// NULL_LEGEND_VALS not yet avil here :(
		}

		if (showCursor) {
			activeIdxs.splice(i, 0, null);

			let pt = null;

			if (cursorOnePt) {
				if (i == 0)
					pt = initCursorPt(s, i);
			}
			else if (i > 0)
				pt = initCursorPt(s, i);

			cursorPts.splice(i, 0, pt);
			cursorPtsLft.splice(i, 0, 0);
			cursorPtsTop.splice(i, 0, 0);
		}

		fire("addSeries", i);
	}

	function addSeries(opts, si) {
		si = si == null ? series.length : si;

		opts = mode == 1 ? setDefault(opts, si, xSeriesOpts, ySeriesOpts) : setDefault(opts, si, {}, xySeriesOpts);

		series.splice(si, 0, opts);
		initSeries(series[si], si);
	}

	self.addSeries = addSeries;

	function delSeries(i) {
		series.splice(i, 1);

		if (showLegend) {
			legend.values.splice(i, 1);

			legendCells.splice(i, 1);
			let tr = legendRows.splice(i, 1)[0];
			offMouse(null, tr.firstChild);
			tr.remove();
		}

		if (showCursor) {
			activeIdxs.splice(i, 1);
			cursorPts.splice(i, 1)[0].remove();
			cursorPtsLft.splice(i, 1);
			cursorPtsTop.splice(i, 1);
		}

		// TODO: de-init no-longer-needed scales?

		fire("delSeries", i);
	}

	self.delSeries = delSeries;

	const sidesWithAxes = [false, false, false, false];

	function initAxis(axis, i) {
		axis._show = axis.show;

		if (axis.show) {
			let isVt = axis.side % 2;

			let sc = scales[axis.scale];

			// this can occur if all series specify non-default scales
			if (sc == null) {
				axis.scale = isVt ? series[1].scale : xScaleKey;
				sc = scales[axis.scale];
			}

			// also set defaults for incrs & values based on axis distr
			let isTime = sc.time;

			axis.size   = fnOrSelf(axis.size);
			axis.space  = fnOrSelf(axis.space);
			axis.rotate = fnOrSelf(axis.rotate);

			if (isArr(axis.incrs)) {
				axis.incrs.forEach(incr => {
					!fixedDec.has(incr) && fixedDec.set(incr, guessDec(incr));
				});
			}

			axis.incrs  = fnOrSelf(axis.incrs  || (          sc.distr == 2 ? wholeIncrs : (isTime ? (ms == 1 ? timeIncrsMs : timeIncrsS) : numIncrs)));
			axis.splits = fnOrSelf(axis.splits || (isTime && sc.distr == 1 ? _timeAxisSplits : sc.distr == 3 ? logAxisSplits : sc.distr == 4 ? asinhAxisSplits : numAxisSplits));

			axis.stroke        = fnOrSelf(axis.stroke);
			axis.grid.stroke   = fnOrSelf(axis.grid.stroke);
			axis.ticks.stroke  = fnOrSelf(axis.ticks.stroke);
			axis.border.stroke = fnOrSelf(axis.border.stroke);

			let av = axis.values;

			axis.values = (
				// static array of tick values
				isArr(av) && !isArr(av[0]) ? fnOrSelf(av) :
				// temporal
				isTime ? (
					// config array of fmtDate string tpls
					isArr(av) ?
						timeAxisVals(_tzDate, timeAxisStamps(av, _fmtDate)) :
					// fmtDate string tpl
					isStr(av) ?
						timeAxisVal(_tzDate, av) :
					av || _timeAxisVals
				) : av || numAxisVals
			);

			axis.filter = fnOrSelf(axis.filter || (          sc.distr >= 3 && sc.log == 10 ? log10AxisValsFilt : sc.distr == 3 && sc.log == 2 ? log2AxisValsFilt : retArg1));

			axis.font      = pxRatioFont(axis.font);
			axis.labelFont = pxRatioFont(axis.labelFont);

			axis._size   = axis.size(self, null, i, 0);

			axis._space  =
			axis._rotate =
			axis._incrs  =
			axis._found  =	// foundIncrSpace
			axis._splits =
			axis._values = null;

			if (axis._size > 0) {
				sidesWithAxes[i] = true;
				axis._el = placeDiv(AXIS, wrap);
			}

			// debug
		//	axis._el.style.background = "#"  + Math.floor(Math.random()*16777215).toString(16) + '80';
		}
	}

	function autoPadSide(self, side, sidesWithAxes, cycleNum) {
		let [hasTopAxis, hasRgtAxis, hasBtmAxis, hasLftAxis] = sidesWithAxes;

		let ori = side % 2;
		let size = 0;

		if (ori == 0 && (hasLftAxis || hasRgtAxis))
			size = (side == 0 && !hasTopAxis || side == 2 && !hasBtmAxis ? round(xAxisOpts.size / 3) : 0);
		if (ori == 1 && (hasTopAxis || hasBtmAxis))
			size = (side == 1 && !hasRgtAxis || side == 3 && !hasLftAxis ? round(yAxisOpts.size / 2) : 0);

		return size;
	}

	const padding = self.padding = (opts.padding || [autoPadSide,autoPadSide,autoPadSide,autoPadSide]).map(p => fnOrSelf(ifNull(p, autoPadSide)));
	const _padding = self._padding = padding.map((p, i) => p(self, i, sidesWithAxes, 0));

	let dataLen;

	// rendered data window
	let i0 = null;
	let i1 = null;
	const idxs = mode == 1 ? series[0].idxs : null;

	let data0 = null;

	let viaAutoScaleX = false;

	function setData(_data, _resetScales) {
		data = _data == null ? [] : _data;

		self.data = self._data = data;

		if (mode == 2) {
			dataLen = 0;
			for (let i = 1; i < series.length; i++)
				dataLen += data[i][0].length;
		}
		else {
			if (data.length == 0)
				self.data = self._data = data = [[]];

			data0 = data[0];
			dataLen = data0.length;

			let scaleData = data;

			if (xScaleDistr == 2) {
				scaleData = data.slice();

				let _data0 = scaleData[0] = Array(dataLen);
				for (let i = 0; i < dataLen; i++)
					_data0[i] = i;
			}

			self._data = data = scaleData;
		}

		resetYSeries(true);

		fire("setData");

		// forces x axis tick values to re-generate when neither x scale nor y scale changes
		// in ordinal mode, scale range is by index, so will not change if new data has same length, but tick values are from data
		if (xScaleDistr == 2) {
			shouldConvergeSize = true;

			/* or somewhat cheaper, and uglier:
			if (ready) {
				// logic extracted from axesCalc()
				let i = 0;
				let axis = axes[i];
				let _splits = axis._splits.map(i => data0[i]);
				let [_incr, _space] = axis._found;
				let incr = data0[_splits[1]] - data0[_splits[0]];
				axis._values = axis.values(self, axis.filter(self, _splits, i, _space, incr), i, _space, incr);
			}
			*/
		}

		if (_resetScales !== false) {
			let xsc = scaleX;

			if (xsc.auto(self, viaAutoScaleX))
				autoScaleX();
			else
				_setScale(xScaleKey, xsc.min, xsc.max);

			shouldSetCursor = shouldSetCursor || cursor.left >= 0;
			shouldSetLegend = true;
			commit();
		}
	}

	self.setData = setData;

	function autoScaleX() {
		viaAutoScaleX = true;

		let _min, _max;

		if (mode == 1) {
			if (dataLen > 0) {
				i0 = idxs[0] = 0;
				i1 = idxs[1] = dataLen - 1;

				_min = data[0][i0];
				_max = data[0][i1];

				if (xScaleDistr == 2) {
					_min = i0;
					_max = i1;
				}
				else if (_min == _max) {
					if (xScaleDistr == 3)
						[_min, _max] = rangeLog(_min, _min, scaleX.log, false);
					else if (xScaleDistr == 4)
						[_min, _max] = rangeAsinh(_min, _min, scaleX.log, false);
					else if (scaleX.time)
						_max = _min + round(86400 / ms);
					else
						[_min, _max] = rangeNum(_min, _max, rangePad, true);
				}
			}
			else {
				i0 = idxs[0] = _min = null;
				i1 = idxs[1] = _max = null;
			}
		}

		_setScale(xScaleKey, _min, _max);
	}

	let ctxStroke, ctxFill, ctxWidth, ctxDash, ctxJoin, ctxCap, ctxFont, ctxAlign, ctxBaseline;
	let ctxAlpha;

	function setCtxStyle(stroke, width, dash, cap, fill, join) {
		stroke ??= transparent;
		dash   ??= EMPTY_ARR;
		cap    ??= "butt"; // (‿|‿)
		fill   ??= transparent;
		join   ??= "round";

		if (stroke != ctxStroke)
			ctx.strokeStyle = ctxStroke = stroke;
		if (fill != ctxFill)
			ctx.fillStyle = ctxFill = fill;
		if (width != ctxWidth)
			ctx.lineWidth = ctxWidth = width;
		if (join != ctxJoin)
			ctx.lineJoin = ctxJoin = join;
		if (cap != ctxCap)
			ctx.lineCap = ctxCap = cap;
		if (dash != ctxDash)
			ctx.setLineDash(ctxDash = dash);
	}

	function setFontStyle(font, fill, align, baseline) {
		if (fill != ctxFill)
			ctx.fillStyle = ctxFill = fill;
		if (font != ctxFont)
			ctx.font = ctxFont = font;
		if (align != ctxAlign)
			ctx.textAlign = ctxAlign = align;
		if (baseline != ctxBaseline)
			ctx.textBaseline = ctxBaseline = baseline;
	}

	function accScale(wsc, psc, facet, data, sorted = 0) {
		if (data.length > 0 && wsc.auto(self, viaAutoScaleX) && (psc == null || psc.min == null)) {
			let _i0 = ifNull(i0, 0);
			let _i1 = ifNull(i1, data.length - 1);

			// only run getMinMax() for invalidated series data, else reuse
			let minMax = facet.min == null ? getMinMax(data, _i0, _i1, sorted, wsc.distr == 3) : [facet.min, facet.max];

			// initial min/max
			wsc.min = min(wsc.min, facet.min = minMax[0]);
			wsc.max = max(wsc.max, facet.max = minMax[1]);
		}
	}

	const AUTOSCALE = {min: null, max: null};

	function setScales() {
	//	log("setScales()", arguments);

		// implicitly add auto scales, and unranged scales
		for (let k in scales) {
			let sc = scales[k];

			if (pendScales[k] == null &&
				(
					// scales that have never been set (on init)
					sc.min == null ||
					// or auto scales when the x scale was explicitly set
					pendScales[xScaleKey] != null && sc.auto(self, viaAutoScaleX)
				)
			) {
				pendScales[k] = AUTOSCALE;
			}
		}

		// implicitly add dependent scales
		for (let k in scales) {
			let sc = scales[k];

			if (pendScales[k] == null && sc.from != null && pendScales[sc.from] != null)
				pendScales[k] = AUTOSCALE;
		}

		// explicitly setting the x-scale invalidates everything (acts as redraw)
		if (pendScales[xScaleKey] != null)
			resetYSeries(true); // TODO: only reset series on auto scales?

		let wipScales = {};

		for (let k in pendScales) {
			let psc = pendScales[k];

			if (psc != null) {
				let wsc = wipScales[k] = copy(scales[k], fastIsObj);

				if (psc.min != null)
					assign(wsc, psc);
				else if (k != xScaleKey || mode == 2) {
					if (dataLen == 0 && wsc.from == null) {
						let minMax = wsc.range(self, null, null, k);
						wsc.min = minMax[0];
						wsc.max = minMax[1];
					}
					else {
						wsc.min = inf;
						wsc.max = -inf;
					}
				}
			}
		}

		if (dataLen > 0) {
			// pre-range y-scales from y series' data values
			series.forEach((s, i) => {
				if (mode == 1) {
					let k = s.scale;
					let psc = pendScales[k];

					if (psc == null)
						return;

					let wsc = wipScales[k];

					if (i == 0) {
						let minMax = wsc.range(self, wsc.min, wsc.max, k);

						wsc.min = minMax[0];
						wsc.max = minMax[1];

						i0 = closestIdx(wsc.min, data[0]);
						i1 = closestIdx(wsc.max, data[0]);

						// don't try to contract same or adjacent idxs
						if (i1 - i0 > 1) {
							// closest indices can be outside of view
							if (data[0][i0] < wsc.min)
								i0++;
							if (data[0][i1] > wsc.max)
								i1--;
						}

						s.min = data0[i0];
						s.max = data0[i1];
					}
					else if (s.show && s.auto)
						accScale(wsc, psc, s, data[i], s.sorted);

					s.idxs[0] = i0;
					s.idxs[1] = i1;
				}
				else {
					if (i > 0) {
						if (s.show && s.auto) {
							// TODO: only handles, assumes and requires facets[0] / 'x' scale, and facets[1] / 'y' scale
							let [ xFacet, yFacet ] = s.facets;
							let xScaleKey = xFacet.scale;
							let yScaleKey = yFacet.scale;
							let [ xData, yData ] = data[i];

							let wscx = wipScales[xScaleKey];
							let wscy = wipScales[yScaleKey];

							// null can happen when only x is zoomed, but y has static range and doesnt get auto-added to pending
							wscx != null && accScale(wscx, pendScales[xScaleKey], xFacet, xData, xFacet.sorted);
							wscy != null && accScale(wscy, pendScales[yScaleKey], yFacet, yData, yFacet.sorted);

							// temp
							s.min = yFacet.min;
							s.max = yFacet.max;
						}
					}
				}
			});

			// range independent scales
			for (let k in wipScales) {
				let wsc = wipScales[k];
				let psc = pendScales[k];

				if (wsc.from == null && (psc == null || psc.min == null)) {
					let minMax = wsc.range(
						self,
						wsc.min ==  inf ? null : wsc.min,
						wsc.max == -inf ? null : wsc.max,
						k
					);
					wsc.min = minMax[0];
					wsc.max = minMax[1];
				}
			}
		}

		// range dependent scales
		for (let k in wipScales) {
			let wsc = wipScales[k];

			if (wsc.from != null) {
				let base = wipScales[wsc.from];

				if (base.min == null)
					wsc.min = wsc.max = null;
				else {
					let minMax = wsc.range(self, base.min, base.max, k);
					wsc.min = minMax[0];
					wsc.max = minMax[1];
				}
			}
		}

		let changed = {};
		let anyChanged = false;

		for (let k in wipScales) {
			let wsc = wipScales[k];
			let sc = scales[k];

			if (sc.min != wsc.min || sc.max != wsc.max) {
				sc.min = wsc.min;
				sc.max = wsc.max;

				let distr = sc.distr;

				sc._min = distr == 3 ? log10(sc.min) : distr == 4 ? asinh(sc.min, sc.asinh) : distr == 100 ? sc.fwd(sc.min) : sc.min;
				sc._max = distr == 3 ? log10(sc.max) : distr == 4 ? asinh(sc.max, sc.asinh) : distr == 100 ? sc.fwd(sc.max) : sc.max;

				changed[k] = anyChanged = true;
			}
		}

		if (anyChanged) {
			// invalidate paths of all series on changed scales
			series.forEach((s, i) => {
				if (mode == 2) {
					if (i > 0 && changed.y)
						s._paths = null;
				}
				else {
					if (changed[s.scale])
						s._paths = null;
				}
			});

			for (let k in changed) {
				shouldConvergeSize = true;
				fire("setScale", k);
			}

			if (showCursor && cursor.left >= 0)
				shouldSetCursor = shouldSetLegend = true;
		}

		for (let k in pendScales)
			pendScales[k] = null;
	}

	// grabs the nearest indices with y data outside of x-scale limits
	function getOuterIdxs(ydata) {
		let _i0 = clamp(i0 - 1, 0, dataLen - 1);
		let _i1 = clamp(i1 + 1, 0, dataLen - 1);

		while (ydata[_i0] == null && _i0 > 0)
			_i0--;

		while (ydata[_i1] == null && _i1 < dataLen - 1)
			_i1++;

		return [_i0, _i1];
	}

	function drawSeries() {
		if (dataLen > 0) {
			let shouldAlpha = series.some(s => s._focus) && ctxAlpha != focus.alpha;

			if (shouldAlpha)
				ctx.globalAlpha = ctxAlpha = focus.alpha;

			series.forEach((s, i) => {
				if (i > 0 && s.show) {
					cacheStrokeFill(i, false);
					cacheStrokeFill(i, true);

					if (s._paths == null) {
						let _ctxAlpha = ctxAlpha;

						if (ctxAlpha != s.alpha)
							ctx.globalAlpha = ctxAlpha = s.alpha;

						let _idxs = mode == 2 ? [0, data[i][0].length - 1] : getOuterIdxs(data[i]);
						s._paths = s.paths(self, i, _idxs[0], _idxs[1]);

						if (ctxAlpha != _ctxAlpha)
							ctx.globalAlpha = ctxAlpha = _ctxAlpha;
					}
				}
			});

			series.forEach((s, i) => {
				if (i > 0 && s.show) {
					let _ctxAlpha = ctxAlpha;

					if (ctxAlpha != s.alpha)
						ctx.globalAlpha = ctxAlpha = s.alpha;

					s._paths != null && drawPath(i, false);

					{
						let _gaps = s._paths != null ? s._paths.gaps : null;

						let show = s.points.show(self, i, i0, i1, _gaps);
						let idxs = s.points.filter(self, i, show, _gaps);

						if (show || idxs) {
							s.points._paths = s.points.paths(self, i, i0, i1, idxs);
							drawPath(i, true);
						}
					}

					if (ctxAlpha != _ctxAlpha)
						ctx.globalAlpha = ctxAlpha = _ctxAlpha;

					fire("drawSeries", i);
				}
			});

			if (shouldAlpha)
				ctx.globalAlpha = ctxAlpha = 1;
		}
	}

	function cacheStrokeFill(si, _points) {
		let s = _points ? series[si].points : series[si];

		s._stroke = s.stroke(self, si);
		s._fill   = s.fill(self, si);
	}

	function drawPath(si, _points) {
		let s = _points ? series[si].points : series[si];

		let {
			stroke,
			fill,
			clip: gapsClip,
			flags,

			_stroke: strokeStyle = s._stroke,
			_fill:   fillStyle   = s._fill,
			_width:  width       = s.width,
		} = s._paths;

		width = roundDec(width * pxRatio, 3);

		let boundsClip = null;
		let offset = (width % 2) / 2;

		if (_points && fillStyle == null)
			fillStyle = width > 0 ? "#fff" : strokeStyle;

		let _pxAlign = s.pxAlign == 1 && offset > 0;

		_pxAlign && ctx.translate(offset, offset);

		if (!_points) {
			let lft = plotLft - width / 2,
				top = plotTop - width / 2,
				wid = plotWid + width,
				hgt = plotHgt + width;

			boundsClip = new Path2D();
			boundsClip.rect(lft, top, wid, hgt);
		}

		// the points pathbuilder's gapsClip is its boundsClip, since points dont need gaps clipping, and bounds depend on point size
		if (_points)
			strokeFill(strokeStyle, width, s.dash, s.cap, fillStyle, stroke, fill, flags, gapsClip);
		else
			fillStroke(si, strokeStyle, width, s.dash, s.cap, fillStyle, stroke, fill, flags, boundsClip, gapsClip);

		_pxAlign && ctx.translate(-offset, -offset);
	}

	function fillStroke(si, strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip) {
		let didStrokeFill = false;

		// for all bands where this series is the top edge, create upwards clips using the bottom edges
		// and apply clips + fill with band fill or dfltFill
		flags != 0 && bands.forEach((b, bi) => {
			// isUpperEdge?
			if (b.series[0] == si) {
				let lowerEdge = series[b.series[1]];
				let lowerData = data[b.series[1]];

				let bandClip = (lowerEdge._paths || EMPTY_OBJ).band;

				if (isArr(bandClip))
					bandClip = b.dir == 1 ? bandClip[0] : bandClip[1];

				let gapsClip2;

				let _fillStyle = null;

				// hasLowerEdge?
				if (lowerEdge.show && bandClip && hasData(lowerData, i0, i1)) {
					_fillStyle = b.fill(self, bi) || fillStyle;
					gapsClip2 = lowerEdge._paths.clip;
				}
				else
					bandClip = null;

				strokeFill(strokeStyle, lineWidth, lineDash, lineCap, _fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip, gapsClip2, bandClip);

				didStrokeFill = true;
			}
		});

		if (!didStrokeFill)
			strokeFill(strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip);
	}

	const CLIP_FILL_STROKE = BAND_CLIP_FILL | BAND_CLIP_STROKE;

	function strokeFill(strokeStyle, lineWidth, lineDash, lineCap, fillStyle, strokePath, fillPath, flags, boundsClip, gapsClip, gapsClip2, bandClip) {
		setCtxStyle(strokeStyle, lineWidth, lineDash, lineCap, fillStyle);

		if (boundsClip || gapsClip || bandClip) {
			ctx.save();
			boundsClip && ctx.clip(boundsClip);
			gapsClip && ctx.clip(gapsClip);
		}

		if (bandClip) {
			if ((flags & CLIP_FILL_STROKE) == CLIP_FILL_STROKE) {
				ctx.clip(bandClip);
				gapsClip2 && ctx.clip(gapsClip2);
				doFill(fillStyle, fillPath);
				doStroke(strokeStyle, strokePath, lineWidth);
			}
			else if (flags & BAND_CLIP_STROKE) {
				doFill(fillStyle, fillPath);
				ctx.clip(bandClip);
				doStroke(strokeStyle, strokePath, lineWidth);
			}
			else if (flags & BAND_CLIP_FILL) {
				ctx.save();
				ctx.clip(bandClip);
				gapsClip2 && ctx.clip(gapsClip2);
				doFill(fillStyle, fillPath);
				ctx.restore();
				doStroke(strokeStyle, strokePath, lineWidth);
			}
		}
		else {
			doFill(fillStyle, fillPath);
			doStroke(strokeStyle, strokePath, lineWidth);
		}

		if (boundsClip || gapsClip || bandClip)
			ctx.restore();
	}

	function doStroke(strokeStyle, strokePath, lineWidth) {
		if (lineWidth > 0) {
			if (strokePath instanceof Map) {
				strokePath.forEach((strokePath, strokeStyle) => {
					ctx.strokeStyle = ctxStroke = strokeStyle;
					ctx.stroke(strokePath);
				});
			}
			else
				strokePath != null && strokeStyle && ctx.stroke(strokePath);
		}
	}

	function doFill(fillStyle, fillPath) {
		if (fillPath instanceof Map) {
			fillPath.forEach((fillPath, fillStyle) => {
				ctx.fillStyle = ctxFill = fillStyle;
				ctx.fill(fillPath);
			});
		}
		else
			fillPath != null && fillStyle && ctx.fill(fillPath);
	}

	function getIncrSpace(axisIdx, min, max, fullDim) {
		let axis = axes[axisIdx];

		let incrSpace;

		if (fullDim <= 0)
			incrSpace = [0, 0];
		else {
			let minSpace = axis._space = axis.space(self, axisIdx, min, max, fullDim);
			let incrs    = axis._incrs = axis.incrs(self, axisIdx, min, max, fullDim, minSpace);
			incrSpace    = findIncr(min, max, incrs, fullDim, minSpace);
		}

		return (axis._found = incrSpace);
	}

	function drawOrthoLines(offs, filts, ori, side, pos0, len, width, stroke, dash, cap) {
		let offset = (width % 2) / 2;

		pxAlign == 1 && ctx.translate(offset, offset);

		setCtxStyle(stroke, width, dash, cap, stroke);

		ctx.beginPath();

		let x0, y0, x1, y1, pos1 = pos0 + (side == 0 || side == 3 ? -len : len);

		if (ori == 0) {
			y0 = pos0;
			y1 = pos1;
		}
		else {
			x0 = pos0;
			x1 = pos1;
		}

		for (let i = 0; i < offs.length; i++) {
			if (filts[i] != null) {
				if (ori == 0)
					x0 = x1 = offs[i];
				else
					y0 = y1 = offs[i];

				ctx.moveTo(x0, y0);
				ctx.lineTo(x1, y1);
			}
		}

		ctx.stroke();

		pxAlign == 1 && ctx.translate(-offset, -offset);
	}

	function axesCalc(cycleNum) {
	//	log("axesCalc()", arguments);

		let converged = true;

		axes.forEach((axis, i) => {
			if (!axis.show)
				return;

			let scale = scales[axis.scale];

			if (scale.min == null) {
				if (axis._show) {
					converged = false;
					axis._show = false;
					resetYSeries(false);
				}
				return;
			}
			else {
				if (!axis._show) {
					converged = false;
					axis._show = true;
					resetYSeries(false);
				}
			}

			let side = axis.side;
			let ori = side % 2;

			let {min, max} = scale;		// 		// should this toggle them ._show = false

			let [_incr, _space] = getIncrSpace(i, min, max, ori == 0 ? plotWidCss : plotHgtCss);

			if (_space == 0)
				return;

			// if we're using index positions, force first tick to match passed index
			let forceMin = scale.distr == 2;

			let _splits = axis._splits = axis.splits(self, i, min, max, _incr, _space, forceMin);

			// tick labels
			// BOO this assumes a specific data/series
			let splits = scale.distr == 2 ? _splits.map(i => data0[i]) : _splits;
			let incr   = scale.distr == 2 ? data0[_splits[1]] - data0[_splits[0]] : _incr;

			let values = axis._values = axis.values(self, axis.filter(self, splits, i, _space, incr), i, _space, incr);

			// rotating of labels only supported on bottom x axis
			axis._rotate = side == 2 ? axis.rotate(self, values, i, _space) : 0;

			let oldSize = axis._size;

			axis._size = ceil(axis.size(self, values, i, cycleNum));

			if (oldSize != null && axis._size != oldSize)			// ready && ?
				converged = false;
		});

		return converged;
	}

	function paddingCalc(cycleNum) {
		let converged = true;

		padding.forEach((p, i) => {
			let _p = p(self, i, sidesWithAxes, cycleNum);

			if (_p != _padding[i])
				converged = false;

			_padding[i] = _p;
		});

		return converged;
	}

	function drawAxesGrid() {
		for (let i = 0; i < axes.length; i++) {
			let axis = axes[i];

			if (!axis.show || !axis._show)
				continue;

			let side = axis.side;
			let ori = side % 2;

			let x, y;

			let fillStyle = axis.stroke(self, i);

			let shiftDir = side == 0 || side == 3 ? -1 : 1;

			let [_incr, _space] = axis._found;

			// axis label
			if (axis.label != null) {
				let shiftAmt = axis.labelGap * shiftDir;
				let baseLpos = round((axis._lpos + shiftAmt) * pxRatio);

				setFontStyle(axis.labelFont[0], fillStyle, "center", side == 2 ? TOP : BOTTOM);

				ctx.save();

				if (ori == 1) {
					x = y = 0;

					ctx.translate(
						baseLpos,
						round(plotTop + plotHgt / 2),
					);
					ctx.rotate((side == 3 ? -PI : PI) / 2);

				}
				else {
					x = round(plotLft + plotWid / 2);
					y = baseLpos;
				}

				let _label = isFn(axis.label) ? axis.label(self, i, _incr, _space) : axis.label;

				ctx.fillText(_label, x, y);

				ctx.restore();
			}

			if (_space == 0)
				continue;

			let scale = scales[axis.scale];

			let plotDim = ori == 0 ? plotWid : plotHgt;
			let plotOff = ori == 0 ? plotLft : plotTop;

			let _splits = axis._splits;

			// tick labels
			// BOO this assumes a specific data/series
			let splits = scale.distr == 2 ? _splits.map(i => data0[i]) : _splits;
			let incr   = scale.distr == 2 ? data0[_splits[1]] - data0[_splits[0]] : _incr;

			let ticks = axis.ticks;
			let border = axis.border;
			let _tickSize = ticks.show ? ticks.size : 0;
			let tickSize = round(_tickSize * pxRatio);
			let axisGap = round((axis.alignTo == 2 ? axis._size - _tickSize - axis.gap : axis.gap) * pxRatio);

			// rotating of labels only supported on bottom x axis
			let angle = axis._rotate * -PI/180;

			let basePos  = pxRound(axis._pos * pxRatio);
			let shiftAmt = (tickSize + axisGap) * shiftDir;
			let finalPos = basePos + shiftAmt;
			    y        = ori == 0 ? finalPos : 0;
			    x        = ori == 1 ? finalPos : 0;

			let font         = axis.font[0];
			let textAlign    = axis.align == 1 ? LEFT :
			                   axis.align == 2 ? RIGHT :
			                   angle > 0 ? LEFT :
			                   angle < 0 ? RIGHT :
			                   ori == 0 ? "center" : side == 3 ? RIGHT : LEFT;
			let textBaseline = angle ||
			                   ori == 1 ? "middle" : side == 2 ? TOP   : BOTTOM;

			setFontStyle(font, fillStyle, textAlign, textBaseline);

			let lineHeight = axis.font[1] * axis.lineGap;

			let canOffs = _splits.map(val => pxRound(getPos(val, scale, plotDim, plotOff)));

			let _values = axis._values;

			for (let i = 0; i < _values.length; i++) {
				let val = _values[i];

				if (val != null) {
					if (ori == 0)
						x = canOffs[i];
					else
						y = canOffs[i];

					val = "" + val;

					let _parts = val.indexOf("\n") == -1 ? [val] : val.split(/\n/gm);

					for (let j = 0; j < _parts.length; j++) {
						let text = _parts[j];

						if (angle) {
							ctx.save();
							ctx.translate(x, y + j * lineHeight); // can this be replaced with position math?
							ctx.rotate(angle); // can this be done once?
							ctx.fillText(text, 0, 0);
							ctx.restore();
						}
						else
							ctx.fillText(text, x, y + j * lineHeight);
					}
				}
			}

			// ticks
			if (ticks.show) {
				drawOrthoLines(
					canOffs,
					ticks.filter(self, splits, i, _space, incr),
					ori,
					side,
					basePos,
					tickSize,
					roundDec(ticks.width * pxRatio, 3),
					ticks.stroke(self, i),
					ticks.dash,
					ticks.cap,
				);
			}

			// grid
			let grid = axis.grid;

			if (grid.show) {
				drawOrthoLines(
					canOffs,
					grid.filter(self, splits, i, _space, incr),
					ori,
					ori == 0 ? 2 : 1,
					ori == 0 ? plotTop : plotLft,
					ori == 0 ? plotHgt : plotWid,
					roundDec(grid.width * pxRatio, 3),
					grid.stroke(self, i),
					grid.dash,
					grid.cap,
				);
			}

			if (border.show) {
				drawOrthoLines(
					[basePos],
					[1],
					ori == 0 ? 1 : 0,
					ori == 0 ? 1 : 2,
					ori == 1 ? plotTop : plotLft,
					ori == 1 ? plotHgt : plotWid,
					roundDec(border.width * pxRatio, 3),
					border.stroke(self, i),
					border.dash,
					border.cap,
				);
			}
		}

		fire("drawAxes");
	}

	function resetYSeries(minMax) {
	//	log("resetYSeries()", arguments);

		series.forEach((s, i) => {
			if (i > 0) {
				s._paths = null;

				if (minMax) {
					if (mode == 1) {
						s.min = null;
						s.max = null;
					}
					else {
						s.facets.forEach(f => {
							f.min = null;
							f.max = null;
						});
					}
				}
			}
		});
	}

	let queuedCommit = false;
	let deferHooks = false;
	let hooksQueue = [];

	function flushHooks() {
		deferHooks = false;

		for (let i = 0; i < hooksQueue.length; i++)
			fire(...hooksQueue[i]);

		hooksQueue.length = 0;
	}

	function commit() {
		if (!queuedCommit) {
			microTask(_commit);
			queuedCommit = true;
		}
	}

	// manual batching (aka immediate mode), skips microtask queue
	function batch(fn, _deferHooks = false) {
		queuedCommit = true;
		deferHooks = _deferHooks;

		fn(self);
		_commit();

		if (_deferHooks && hooksQueue.length > 0)
			queueMicrotask(flushHooks);
	}

	self.batch = batch;

	function _commit() {
	//	log("_commit()", arguments);

		if (shouldSetScales) {
			setScales();
			shouldSetScales = false;
		}

		if (shouldConvergeSize) {
			convergeSize();
			shouldConvergeSize = false;
		}

		if (shouldSetSize) {
			setStylePx(under, LEFT,   plotLftCss);
			setStylePx(under, TOP,    plotTopCss);
			setStylePx(under, WIDTH,  plotWidCss);
			setStylePx(under, HEIGHT, plotHgtCss);

			setStylePx(over, LEFT,    plotLftCss);
			setStylePx(over, TOP,     plotTopCss);
			setStylePx(over, WIDTH,   plotWidCss);
			setStylePx(over, HEIGHT,  plotHgtCss);

			setStylePx(wrap, WIDTH,   fullWidCss);
			setStylePx(wrap, HEIGHT,  fullHgtCss);

			// NOTE: mutating this during print preview in Chrome forces transparent
			// canvas pixels to white, even when followed up with clearRect() below
			can.width  = round(fullWidCss * pxRatio);
			can.height = round(fullHgtCss * pxRatio);

			axes.forEach(({ _el, _show, _size, _pos, side }) => {
				if (_el != null) {
					if (_show) {
						let posOffset = (side === 3 || side === 0 ? _size : 0);
						let isVt = side % 2 == 1;

						setStylePx(_el, isVt ? "left"   : "top",    _pos - posOffset);
						setStylePx(_el, isVt ? "width"  : "height", _size);
						setStylePx(_el, isVt ? "top"    : "left",   isVt ? plotTopCss : plotLftCss);
						setStylePx(_el, isVt ? "height" : "width",  isVt ? plotHgtCss : plotWidCss);

						remClass(_el, OFF);
					}
					else
						addClass(_el, OFF);
				}
			});

			// invalidate ctx style cache
			ctxStroke = ctxFill = ctxWidth = ctxJoin = ctxCap = ctxFont = ctxAlign = ctxBaseline = ctxDash = null;
			ctxAlpha = 1;

			syncRect(true);

			if (
				plotLftCss != _plotLftCss ||
				plotTopCss != _plotTopCss ||
				plotWidCss != _plotWidCss ||
				plotHgtCss != _plotHgtCss
			) {
				resetYSeries(false);

				let pctWid = plotWidCss / _plotWidCss;
				let pctHgt = plotHgtCss / _plotHgtCss;

				if (showCursor && !shouldSetCursor && cursor.left >= 0) {
					cursor.left *= pctWid;
					cursor.top  *= pctHgt;

					vCursor && elTrans(vCursor, round(cursor.left), 0, plotWidCss, plotHgtCss);
					hCursor && elTrans(hCursor, 0, round(cursor.top), plotWidCss, plotHgtCss);

					for (let i = 0; i < cursorPts.length; i++) {
						let pt = cursorPts[i];

						if (pt != null) {
							cursorPtsLft[i] *= pctWid;
							cursorPtsTop[i] *= pctHgt;
							elTrans(pt, ceil(cursorPtsLft[i]), ceil(cursorPtsTop[i]), plotWidCss, plotHgtCss);
						}
					}
				}

				if (select.show && !shouldSetSelect && select.left >= 0 && select.width > 0) {
					select.left   *= pctWid;
					select.width  *= pctWid;
					select.top    *= pctHgt;
					select.height *= pctHgt;

					for (let prop in _hideProps)
						setStylePx(selectDiv, prop, select[prop]);
				}

				_plotLftCss = plotLftCss;
				_plotTopCss = plotTopCss;
				_plotWidCss = plotWidCss;
				_plotHgtCss = plotHgtCss;
			}

			fire("setSize");

			shouldSetSize = false;
		}

		if (fullWidCss > 0 && fullHgtCss > 0) {
			ctx.clearRect(0, 0, can.width, can.height);
			fire("drawClear");
			drawOrder.forEach(fn => fn());
			fire("draw");
		}

		if (select.show && shouldSetSelect) {
			setSelect(select);
			shouldSetSelect = false;
		}

		if (showCursor && shouldSetCursor) {
			updateCursor(null, true, false);
			shouldSetCursor = false;
		}

		if (legend.show && legend.live && shouldSetLegend) {
			setLegend();
			shouldSetLegend = false; // redundant currently
		}

		if (!ready) {
			ready = true;
			self.status = 1;

			fire("ready");
		}

		viaAutoScaleX = false;

		queuedCommit = false;
	}

	self.redraw = (rebuildPaths, recalcAxes) => {
		shouldConvergeSize = recalcAxes || false;

		if (rebuildPaths !== false)
			_setScale(xScaleKey, scaleX.min, scaleX.max);
		else
			commit();
	};

	// redraw() => setScale('x', scales.x.min, scales.x.max);

	// explicit, never re-ranged (is this actually true? for x and y)
	function setScale(key, opts) {
		let sc = scales[key];

		if (sc.from == null) {
			if (dataLen == 0) {
				let minMax = sc.range(self, opts.min, opts.max, key);
				opts.min = minMax[0];
				opts.max = minMax[1];
			}

			if (opts.min > opts.max) {
				let _min = opts.min;
				opts.min = opts.max;
				opts.max = _min;
			}

			if (dataLen > 1 && opts.min != null && opts.max != null && opts.max - opts.min < 1e-16)
				return;

			if (key == xScaleKey) {
				if (sc.distr == 2 && dataLen > 0) {
					opts.min = closestIdx(opts.min, data[0]);
					opts.max = closestIdx(opts.max, data[0]);

					if (opts.min == opts.max)
						opts.max++;
				}
			}

		//	log("setScale()", arguments);

			pendScales[key] = opts;

			shouldSetScales = true;
			commit();
		}
	}

	self.setScale = setScale;

//	INTERACTION

	let xCursor;
	let yCursor;
	let vCursor;
	let hCursor;

	// starting position before cursor.move
	let rawMouseLeft0;
	let rawMouseTop0;

	// starting position
	let mouseLeft0;
	let mouseTop0;

	// current position before cursor.move
	let rawMouseLeft1;
	let rawMouseTop1;

	// current position
	let mouseLeft1;
	let mouseTop1;

	let dragging = false;

	const drag = cursor.drag;

	let dragX = drag.x;
	let dragY = drag.y;

	if (showCursor) {
		if (cursor.x)
			xCursor = placeDiv(CURSOR_X, over);
		if (cursor.y)
			yCursor = placeDiv(CURSOR_Y, over);

		if (scaleX.ori == 0) {
			vCursor = xCursor;
			hCursor = yCursor;
		}
		else {
			vCursor = yCursor;
			hCursor = xCursor;
		}

		mouseLeft1 = cursor.left;
		mouseTop1 = cursor.top;
	}

	const select = self.select = assign({
		show:   true,
		over:   true,
		left:   0,
		width:  0,
		top:    0,
		height: 0,
	}, opts.select);

	const selectDiv = select.show ? placeDiv(SELECT, select.over ? over : under) : null;

	function setSelect(opts, _fire) {
		if (select.show) {
			for (let prop in opts) {
				select[prop] = opts[prop];

				if (prop in _hideProps)
					setStylePx(selectDiv, prop, opts[prop]);
			}

			_fire !== false && fire("setSelect");
		}
	}

	self.setSelect = setSelect;

	function toggleDOM(i) {
		let s = series[i];

		if (s.show)
			showLegend && remClass(legendRows[i], OFF);
		else {
			showLegend && addClass(legendRows[i], OFF);

			if (showCursor) {
				let pt = cursorOnePt ? cursorPts[0] : cursorPts[i];
				pt != null && elTrans(pt, -10, -10, plotWidCss, plotHgtCss);
			}
		}
	}

	function _setScale(key, min, max) {
		setScale(key, {min, max});
	}

	function setSeries(i, opts, _fire, _pub) {
	//	log("setSeries()", arguments);

		if (opts.focus != null)
			setFocus(i);

		if (opts.show != null) {
			series.forEach((s, si) => {
				if (si > 0 && (i == si || i == null)) {
					s.show = opts.show;
					toggleDOM(si);

					if (mode == 2) {
						_setScale(s.facets[0].scale, null, null);
						_setScale(s.facets[1].scale, null, null);
					}
					else
						_setScale(s.scale, null, null);

					commit();
				}
			});
		}

		_fire !== false && fire("setSeries", i, opts);

		_pub && pubSync("setSeries", self, i, opts);
	}

	self.setSeries = setSeries;

	function setBand(bi, opts) {
		assign(bands[bi], opts);
	}

	function addBand(opts, bi) {
		opts.fill = fnOrSelf(opts.fill || null);
		opts.dir = ifNull(opts.dir, -1);
		bi = bi == null ? bands.length : bi;
		bands.splice(bi, 0, opts);
	}

	function delBand(bi) {
		if (bi == null)
			bands.length = 0;
		else
			bands.splice(bi, 1);
	}

	self.addBand = addBand;
	self.setBand = setBand;
	self.delBand = delBand;

	function setAlpha(i, value) {
		series[i].alpha = value;

		if (showCursor && cursorPts[i] != null)
			cursorPts[i].style.opacity = value;

		if (showLegend && legendRows[i])
			legendRows[i].style.opacity = value;
	}

	// y-distance
	let closestDist;
	let closestSeries;
	let focusedSeries;
	const FOCUS_TRUE  = {focus: true};

	function setFocus(i) {
		if (i != focusedSeries) {
		//	log("setFocus()", arguments);

			let allFocused = i == null;

			let _setAlpha = focus.alpha != 1;

			series.forEach((s, i2) => {
				if (mode == 1 || i2 > 0) {
					let isFocused = allFocused || i2 == 0 || i2 == i;
					s._focus = allFocused ? null : isFocused;
					_setAlpha && setAlpha(i2, isFocused ? 1 : focus.alpha);
				}
			});

			focusedSeries = i;
			_setAlpha && commit();
		}
	}

	if (showLegend && cursorFocus) {
		onMouse(mouseleave, legendTable, e => {
			if (cursor._lock)
				return;

			setCursorEvent(e);

			if (focusedSeries != null)
				setSeries(null, FOCUS_TRUE, true, syncOpts.setSeries);
		});
	}

	function posToVal(pos, scale, can) {
		let sc = scales[scale];

		if (can)
			pos = pos / pxRatio - (sc.ori == 1 ? plotTopCss : plotLftCss);

		let dim = plotWidCss;

		if (sc.ori == 1) {
			dim = plotHgtCss;
			pos = dim - pos;
		}

		if (sc.dir == -1)
			pos = dim - pos;

		let _min = sc._min,
			_max = sc._max,
			pct = pos / dim;

		let sv = _min + (_max - _min) * pct;

		let distr = sc.distr;

		return (
			distr == 3 ? pow(10, sv) :
			distr == 4 ? sinh(sv, sc.asinh) :
			distr == 100 ? sc.bwd(sv) :
			sv
		);
	}

	function closestIdxFromXpos(pos, can) {
		let v = posToVal(pos, xScaleKey, can);
		return closestIdx(v, data[0], i0, i1);
	}

	self.valToIdx = val => closestIdx(val, data[0]);
	self.posToIdx = closestIdxFromXpos;
	self.posToVal = posToVal;
	self.valToPos = (val, scale, can) => (
		scales[scale].ori == 0 ?
		getHPos(val, scales[scale],
			can ? plotWid : plotWidCss,
			can ? plotLft : 0,
		) :
		getVPos(val, scales[scale],
			can ? plotHgt : plotHgtCss,
			can ? plotTop : 0,
		)
	);

	self.setCursor = (opts, _fire, _pub) => {
		mouseLeft1 = opts.left;
		mouseTop1 = opts.top;
	//	assign(cursor, opts);
		updateCursor(null, _fire, _pub);
	};

	function setSelH(off, dim) {
		setStylePx(selectDiv, LEFT,  select.left = off);
		setStylePx(selectDiv, WIDTH, select.width = dim);
	}

	function setSelV(off, dim) {
		setStylePx(selectDiv, TOP,    select.top = off);
		setStylePx(selectDiv, HEIGHT, select.height = dim);
	}

	let setSelX = scaleX.ori == 0 ? setSelH : setSelV;
	let setSelY = scaleX.ori == 1 ? setSelH : setSelV;

	function syncLegend() {
		if (showLegend && legend.live) {
			for (let i = mode == 2 ? 1 : 0; i < series.length; i++) {
				if (i == 0 && multiValLegend)
					continue;

				let vals = legend.values[i];

				let j = 0;

				for (let k in vals)
					legendCells[i][j++].firstChild.nodeValue = vals[k];
			}
		}
	}

	function setLegend(opts, _fire) {
		if (opts != null) {
			if (opts.idxs) {
				opts.idxs.forEach((didx, sidx) => {
					activeIdxs[sidx] = didx;
				});
			}
			else if (!isUndef(opts.idx))
				activeIdxs.fill(opts.idx);

			legend.idx = activeIdxs[0];
		}

		if (showLegend && legend.live) {
			for (let sidx = 0; sidx < series.length; sidx++) {
				if (sidx > 0 || mode == 1 && !multiValLegend)
					setLegendValues(sidx, activeIdxs[sidx]);
			}

			syncLegend();
		}

		shouldSetLegend = false;

		_fire !== false && fire("setLegend");
	}

	self.setLegend = setLegend;

	function setLegendValues(sidx, idx) {
		let s = series[sidx];
		let src = sidx == 0 && xScaleDistr == 2 ? data0 : data[sidx];
		let val;

		if (multiValLegend)
			val = s.values(self, sidx, idx) ?? NULL_LEGEND_VALUES;
		else {
			val = s.value(self, idx == null ? null : src[idx], sidx, idx);
			val = val == null ? NULL_LEGEND_VALUES : {_: val};
		}

		legend.values[sidx] = val;
	}

	function updateCursor(src, _fire, _pub) {
	//	ts == null && log("updateCursor()", arguments);

		rawMouseLeft1 = mouseLeft1;
		rawMouseTop1 = mouseTop1;

		[mouseLeft1, mouseTop1] = cursor.move(self, mouseLeft1, mouseTop1);

		cursor.left = mouseLeft1;
		cursor.top = mouseTop1;

		if (showCursor) {
			vCursor && elTrans(vCursor, round(mouseLeft1), 0, plotWidCss, plotHgtCss);
			hCursor && elTrans(hCursor, 0, round(mouseTop1), plotWidCss, plotHgtCss);
		}

		let idx;

		// when zooming to an x scale range between datapoints the binary search
		// for nearest min/max indices results in this condition. cheap hack :D
		let noDataInRange = i0 > i1; // works for mode 1 only

		closestDist = inf;
		closestSeries = null;

		// TODO: extract
		let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss;
		let yDim = scaleX.ori == 1 ? plotWidCss : plotHgtCss;

		// if cursor hidden, hide points & clear legend vals
		if (mouseLeft1 < 0 || dataLen == 0 || noDataInRange) {
			idx = cursor.idx = null;

			for (let i = 0; i < series.length; i++) {
				let pt = cursorPts[i];
				pt != null && elTrans(pt, -10, -10, plotWidCss, plotHgtCss);
			}

			if (cursorFocus)
				setSeries(null, FOCUS_TRUE, true, src == null && syncOpts.setSeries);

			if (legend.live) {
				activeIdxs.fill(idx);
				shouldSetLegend = true;
			}
		}
		else {
		//	let pctY = 1 - (y / rect.height);

			let mouseXPos, valAtPosX, xPos;

			if (mode == 1) {
				mouseXPos = scaleX.ori == 0 ? mouseLeft1 : mouseTop1;
				valAtPosX = posToVal(mouseXPos, xScaleKey);
				idx = cursor.idx = closestIdx(valAtPosX, data[0], i0, i1);
				xPos = valToPosX(data[0][idx], scaleX, xDim, 0);
			}

			// closest pt values
			let _ptLft = -10;
			let _ptTop = -10;
			let _ptWid = 0;
			let _ptHgt = 0;
			let _centered = true;
			let _ptFill = '';
			let _ptStroke = '';

			for (let i = mode == 2 ? 1 : 0; i < series.length; i++) {
				let s = series[i];

				let idx1  = activeIdxs[i];
				let yVal1 = idx1 == null ? null : (mode == 1 ? data[i][idx1] : data[i][1][idx1]);

				let idx2  = cursor.dataIdx(self, i, idx, valAtPosX);
				let yVal2 = idx2 == null ? null : (mode == 1 ? data[i][idx2] : data[i][1][idx2]);

				shouldSetLegend = shouldSetLegend || yVal2 != yVal1 || idx2 != idx1;

				activeIdxs[i] = idx2;

				if (i > 0 && s.show) {
					let xPos2 = idx2 == null ? -10 : idx2 == idx ? xPos : valToPosX(mode == 1 ? data[0][idx2] : data[i][0][idx2], scaleX, xDim, 0);

					// this doesnt really work for state timeline, heatmap, status history (where the value maps to color, not y coords)
					let yPos = yVal2 == null ? -10 : valToPosY(yVal2, mode == 1 ? scales[s.scale] : scales[s.facets[1].scale], yDim, 0);

					if (cursorFocus && yVal2 != null) {
						let mouseYPos = scaleX.ori == 1 ? mouseLeft1 : mouseTop1;
						let dist = abs(focus.dist(self, i, idx2, yPos, mouseYPos));

						if (dist < closestDist) {
							let bias = focus.bias;

							if (bias != 0) {
								let mouseYVal = posToVal(mouseYPos, s.scale);

								let seriesYValSign = yVal2     >= 0 ? 1 : -1;
								let mouseYValSign  = mouseYVal >= 0 ? 1 : -1;

								// with a focus bias, we will never cross zero when prox testing
								// it's either closest towards zero, or closest away from zero
								if (mouseYValSign == seriesYValSign && (
									mouseYValSign == 1 ?
										(bias == 1 ? yVal2 >= mouseYVal : yVal2 <= mouseYVal) :  // >= 0
										(bias == 1 ? yVal2 <= mouseYVal : yVal2 >= mouseYVal)    //  < 0
								)) {
									closestDist = dist;
									closestSeries = i;
								}
							}
							else {
								closestDist = dist;
								closestSeries = i;
							}
						}
					}

					if (shouldSetLegend || cursorOnePt) {
						let hPos, vPos;

						if (scaleX.ori == 0) {
							hPos = xPos2;
							vPos = yPos;
						}
						else {
							hPos = yPos;
							vPos = xPos2;
						}

						let ptWid, ptHgt, ptLft, ptTop,
							ptStroke, ptFill,
							centered = true,
							getBBox = points.bbox;

						if (getBBox != null) {
							centered = false;

							let bbox = getBBox(self, i);

							ptLft = bbox.left;
							ptTop = bbox.top;
							ptWid = bbox.width;
							ptHgt = bbox.height;
						}
						else {
							ptLft = hPos;
							ptTop = vPos;
							ptWid = ptHgt = points.size(self, i);
						}

						ptFill = points.fill(self, i);
						ptStroke = points.stroke(self, i);

						if (cursorOnePt) {
							if (i == closestSeries && closestDist <= focus.prox) {
								_ptLft = ptLft;
								_ptTop = ptTop;
								_ptWid = ptWid;
								_ptHgt = ptHgt;
								_centered = centered;
								_ptFill = ptFill;
								_ptStroke = ptStroke;
							}
						}
						else {
							let pt = cursorPts[i];

							if (pt != null) {
								cursorPtsLft[i] = ptLft;
								cursorPtsTop[i] = ptTop;

								elSize(pt, ptWid, ptHgt, centered);
								elColor(pt, ptFill, ptStroke);
								elTrans(pt, ceil(ptLft), ceil(ptTop), plotWidCss, plotHgtCss);
							}
						}
					}
				}
			}

			// if only using single hover point (at cursorPts[0])
			// we have trigger styling at last visible series (once closestSeries is settled)
			if (cursorOnePt) {
				// some of this logic is similar to series focus below, since it matches the behavior by design

				let p = focus.prox;

				let focusChanged = focusedSeries == null ? closestDist <= p : (closestDist > p || closestSeries != focusedSeries);

				if (shouldSetLegend || focusChanged) {
					let pt = cursorPts[0];

					if (pt != null) {
						cursorPtsLft[0] = _ptLft;
						cursorPtsTop[0] = _ptTop;

						elSize(pt, _ptWid, _ptHgt, _centered);
						elColor(pt, _ptFill, _ptStroke);
						elTrans(pt, ceil(_ptLft), ceil(_ptTop), plotWidCss, plotHgtCss);
					}
				}
			}
		}

		// nit: cursor.drag.setSelect is assumed always true
		if (select.show && dragging) {
			if (src != null) {
				let [xKey, yKey] = syncOpts.scales;
				let [matchXKeys, matchYKeys] = syncOpts.match;
				let [xKeySrc, yKeySrc] = src.cursor.sync.scales;

				// match the dragX/dragY implicitness/explicitness of src
				let sdrag = src.cursor.drag;
				dragX = sdrag._x;
				dragY = sdrag._y;

				if (dragX || dragY) {
					let { left, top, width, height } = src.select;

					let sori = src.scales[xKeySrc].ori;
					let sPosToVal = src.posToVal;

					let sOff, sDim, sc, a, b;

					let matchingX = xKey != null && matchXKeys(xKey, xKeySrc);
					let matchingY = yKey != null && matchYKeys(yKey, yKeySrc);

					if (matchingX && dragX) {
						if (sori == 0) {
							sOff = left;
							sDim = width;
						}
						else {
							sOff = top;
							sDim = height;
						}

						sc = scales[xKey];

						a = valToPosX(sPosToVal(sOff, xKeySrc),        sc, xDim, 0);
						b = valToPosX(sPosToVal(sOff + sDim, xKeySrc), sc, xDim, 0);

						setSelX(min(a,b), abs(b-a));
					}
					else
						setSelX(0, xDim);

					if (matchingY && dragY) {
						if (sori == 1) {
							sOff = left;
							sDim = width;
						}
						else {
							sOff = top;
							sDim = height;
						}

						sc = scales[yKey];

						a = valToPosY(sPosToVal(sOff, yKeySrc),        sc, yDim, 0);
						b = valToPosY(sPosToVal(sOff + sDim, yKeySrc), sc, yDim, 0);

						setSelY(min(a,b), abs(b-a));
					}
					else
						setSelY(0, yDim);
				}
				else
					hideSelect();
			}
			else {
				let rawDX = abs(rawMouseLeft1 - rawMouseLeft0);
				let rawDY = abs(rawMouseTop1 - rawMouseTop0);

				if (scaleX.ori == 1) {
					let _rawDX = rawDX;
					rawDX = rawDY;
					rawDY = _rawDX;
				}

				dragX = drag.x && rawDX >= drag.dist;
				dragY = drag.y && rawDY >= drag.dist;

				let uni = drag.uni;

				if (uni != null) {
					// only calc drag status if they pass the dist thresh
					if (dragX && dragY) {
						dragX = rawDX >= uni;
						dragY = rawDY >= uni;

						// force unidirectionality when both are under uni limit
						if (!dragX && !dragY) {
							if (rawDY > rawDX)
								dragY = true;
							else
								dragX = true;
						}
					}
				}
				else if (drag.x && drag.y && (dragX || dragY))
					// if omni with no uni then both dragX / dragY should be true if either is true
					dragX = dragY = true;

				let p0, p1;

				if (dragX) {
					if (scaleX.ori == 0) {
						p0 = mouseLeft0;
						p1 = mouseLeft1;
					}
					else {
						p0 = mouseTop0;
						p1 = mouseTop1;
					}

					setSelX(min(p0, p1), abs(p1 - p0));

					if (!dragY)
						setSelY(0, yDim);
				}

				if (dragY) {
					if (scaleX.ori == 1) {
						p0 = mouseLeft0;
						p1 = mouseLeft1;
					}
					else {
						p0 = mouseTop0;
						p1 = mouseTop1;
					}

					setSelY(min(p0, p1), abs(p1 - p0));

					if (!dragX)
						setSelX(0, xDim);
				}

				// the drag didn't pass the dist requirement
				if (!dragX && !dragY) {
					setSelX(0, 0);
					setSelY(0, 0);
				}
			}
		}

		drag._x = dragX;
		drag._y = dragY;

		if (src == null) {
			if (_pub) {
				if (syncKey != null) {
					let [xSyncKey, ySyncKey] = syncOpts.scales;

					syncOpts.values[0] = xSyncKey != null ? posToVal(scaleX.ori == 0 ? mouseLeft1 : mouseTop1, xSyncKey) : null;
					syncOpts.values[1] = ySyncKey != null ? posToVal(scaleX.ori == 1 ? mouseLeft1 : mouseTop1, ySyncKey) : null;
				}

				pubSync(mousemove, self, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, idx);
			}

			if (cursorFocus) {
				let shouldPub = _pub && syncOpts.setSeries;
				let p = focus.prox;

				if (focusedSeries == null) {
					if (closestDist <= p)
						setSeries(closestSeries, FOCUS_TRUE, true, shouldPub);
				}
				else {
					if (closestDist > p)
						setSeries(null, FOCUS_TRUE, true, shouldPub);
					else if (closestSeries != focusedSeries)
						setSeries(closestSeries, FOCUS_TRUE, true, shouldPub);
				}
			}
		}

		if (shouldSetLegend) {
			legend.idx = idx;
			setLegend();
		}

		_fire !== false && fire("setCursor");
	}

	let rect = null;

	Object.defineProperty(self, 'rect', {
		get() {
			if (rect == null)
				syncRect(false);

			return rect;
		},
	});

	function syncRect(defer = false) {
		if (defer)
			rect = null;
		else {
			rect = over.getBoundingClientRect();
			fire("syncRect", rect);
		}
	}

	function mouseMove(e, src, _l, _t, _w, _h, _i) {
		if (cursor._lock)
			return;

		// Chrome on Windows has a bug which triggers a stray mousemove event after an initial mousedown event
		// when clicking into a plot as part of re-focusing the browser window.
		// we gotta ignore it to avoid triggering a phantom drag / setSelect
		// However, on touch-only devices Chrome-based browsers trigger a 0-distance mousemove before mousedown
		// so we don't ignore it when mousedown has set the dragging flag
		if (dragging && e != null && e.movementX == 0 && e.movementY == 0)
			return;

		cacheMouse(e, src, _l, _t, _w, _h, _i, false, e != null);

		if (e != null)
			updateCursor(null, true, true);
		else
			updateCursor(src, true, false);
	}

	function cacheMouse(e, src, _l, _t, _w, _h, _i, initial, snap) {
		if (rect == null)
			syncRect(false);

		setCursorEvent(e);

		if (e != null) {
			_l = e.clientX - rect.left;
			_t = e.clientY - rect.top;
		}
		else {
			if (_l < 0 || _t < 0) {
				mouseLeft1 = -10;
				mouseTop1 = -10;
				return;
			}

			let [xKey, yKey] = syncOpts.scales;

			let syncOptsSrc = src.cursor.sync;
			let [xValSrc, yValSrc] = syncOptsSrc.values;
			let [xKeySrc, yKeySrc] = syncOptsSrc.scales;
			let [matchXKeys, matchYKeys] = syncOpts.match;

			let rotSrc = src.axes[0].side % 2 == 1;

			let xDim = scaleX.ori == 0 ? plotWidCss : plotHgtCss,
				yDim = scaleX.ori == 1 ? plotWidCss : plotHgtCss,
				_xDim = rotSrc ? _h : _w,
				_yDim = rotSrc ? _w : _h,
				_xPos = rotSrc ? _t : _l,
				_yPos = rotSrc ? _l : _t;

			if (xKeySrc != null)
				_l = matchXKeys(xKey, xKeySrc) ? getPos(xValSrc, scales[xKey], xDim, 0) : -10;
			else
				_l = xDim * (_xPos/_xDim);

			if (yKeySrc != null)
				_t = matchYKeys(yKey, yKeySrc) ? getPos(yValSrc, scales[yKey], yDim, 0) : -10;
			else
				_t = yDim * (_yPos/_yDim);

			if (scaleX.ori == 1) {
				let __l = _l;
				_l = _t;
				_t = __l;
			}
		}

		if (snap && (src == null || src.cursor.event.type == mousemove)) {
			if (_l <= 1 || _l >= plotWidCss - 1)
				_l = incrRound(_l, plotWidCss);

			if (_t <= 1 || _t >= plotHgtCss - 1)
				_t = incrRound(_t, plotHgtCss);
		}

		if (initial) {
			rawMouseLeft0 = _l;
			rawMouseTop0 = _t;

			[mouseLeft0, mouseTop0] = cursor.move(self, _l, _t);
		}
		else {
			mouseLeft1 = _l;
			mouseTop1 = _t;
		}
	}

	const _hideProps = {
		width: 0,
		height: 0,
		left: 0,
		top: 0,
	};

	function hideSelect() {
		setSelect(_hideProps, false);
	}

	let downSelectLeft;
	let downSelectTop;
	let downSelectWidth;
	let downSelectHeight;

	function mouseDown(e, src, _l, _t, _w, _h, _i) {
		dragging = true;
		dragX = dragY = drag._x = drag._y = false;

		cacheMouse(e, src, _l, _t, _w, _h, _i, true, false);

		if (e != null) {
			onMouse(mouseup, doc, mouseUp, false);
			pubSync(mousedown, self, mouseLeft0, mouseTop0, plotWidCss, plotHgtCss, null);
		}

		let { left, top, width, height } = select;

		downSelectLeft   = left;
		downSelectTop    = top;
		downSelectWidth  = width;
		downSelectHeight = height;

	//	hideSelect();
	}

	function mouseUp(e, src, _l, _t, _w, _h, _i) {
		dragging = drag._x = drag._y = false;

		cacheMouse(e, src, _l, _t, _w, _h, _i, false, true);

		let { left, top, width, height } = select;

		let hasSelect = width > 0 || height > 0;
		let chgSelect = (
			downSelectLeft   != left   ||
			downSelectTop    != top    ||
			downSelectWidth  != width  ||
			downSelectHeight != height
		);

		hasSelect && chgSelect && setSelect(select);

		if (drag.setScale && hasSelect && chgSelect) {
		//	if (syncKey != null) {
		//		dragX = drag.x;
		//		dragY = drag.y;
		//	}

			let xOff = left,
				xDim = width,
				yOff = top,
				yDim = height;

			if (scaleX.ori == 1) {
				xOff = top,
				xDim = height,
				yOff = left,
				yDim = width;
			}

			if (dragX) {
				_setScale(xScaleKey,
					posToVal(xOff, xScaleKey),
					posToVal(xOff + xDim, xScaleKey)
				);
			}

			if (dragY) {
				for (let k in scales) {
					let sc = scales[k];

					if (k != xScaleKey && sc.from == null && sc.min != inf) {
						_setScale(k,
							posToVal(yOff + yDim, k),
							posToVal(yOff, k)
						);
					}
				}
			}

			hideSelect();
		}
		else if (cursor.lock) {
			cursor._lock = !cursor._lock;
			updateCursor(src, true, e != null);
		}

		if (e != null) {
			offMouse(mouseup, doc);
			pubSync(mouseup, self, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
		}
	}

	function mouseLeave(e, src, _l, _t, _w, _h, _i) {
		if (cursor._lock)
			return;

		setCursorEvent(e);

		let _dragging = dragging;

		if (dragging) {
			// handle case when mousemove aren't fired all the way to edges by browser
			let snapH = true;
			let snapV = true;
			let snapProx = 10;

			let dragH, dragV;

			if (scaleX.ori == 0) {
				dragH = dragX;
				dragV = dragY;
			}
			else {
				dragH = dragY;
				dragV = dragX;
			}

			if (dragH && dragV) {
				// maybe omni corner snap
				snapH = mouseLeft1 <= snapProx || mouseLeft1 >= plotWidCss - snapProx;
				snapV = mouseTop1  <= snapProx || mouseTop1  >= plotHgtCss - snapProx;
			}

			if (dragH && snapH)
				mouseLeft1 = mouseLeft1 < mouseLeft0 ? 0 : plotWidCss;

			if (dragV && snapV)
				mouseTop1 = mouseTop1 < mouseTop0 ? 0 : plotHgtCss;

			updateCursor(null, true, true);

			dragging = false;
		}

		mouseLeft1 = -10;
		mouseTop1 = -10;

		activeIdxs.fill(null);

		// passing a non-null timestamp to force sync/mousemove event
		updateCursor(null, true, true);

		if (_dragging)
			dragging = _dragging;
	}

	function dblClick(e, src, _l, _t, _w, _h, _i) {
		if (cursor._lock)
			return;

		setCursorEvent(e);

		autoScaleX();

		hideSelect();

		if (e != null)
			pubSync(dblclick, self, mouseLeft1, mouseTop1, plotWidCss, plotHgtCss, null);
	}

	function syncPxRatio() {
		axes.forEach(syncFontSize);
		_setSize(self.width, self.height, true);
	}

	on(dppxchange, win, syncPxRatio);

	// internal pub/sub
	const events = {};

	events.mousedown = mouseDown;
	events.mousemove = mouseMove;
	events.mouseup = mouseUp;
	events.dblclick = dblClick;
	events["setSeries"] = (e, src, idx, opts) => {
		let seriesIdxMatcher = syncOpts.match[2];
		idx = seriesIdxMatcher(self, src, idx);
		idx != -1 && setSeries(idx, opts, true, false);
	};

	if (showCursor) {
		onMouse(mousedown,  over, mouseDown);
		onMouse(mousemove,  over, mouseMove);
		onMouse(mouseenter, over, e => {
			setCursorEvent(e);
			syncRect(false);
		});
		onMouse(mouseleave, over, mouseLeave);

		onMouse(dblclick, over, dblClick);

		cursorPlots.add(self);

		self.syncRect = syncRect;
	}

	// external on/off
	const hooks = self.hooks = opts.hooks || {};

	function fire(evName, a1, a2) {
		if (deferHooks)
			hooksQueue.push([evName, a1, a2]);
		else {
			if (evName in hooks) {
				hooks[evName].forEach(fn => {
					fn.call(null, self, a1, a2);
				});
			}
		}
	}

	(opts.plugins || []).forEach(p => {
		for (let evName in p.hooks)
			hooks[evName] = (hooks[evName] || []).concat(p.hooks[evName]);
	});

	const seriesIdxMatcher = (self, src, srcSeriesIdx) => srcSeriesIdx;

	const syncOpts = assign({
		key: null,
		setSeries: false,
		filters: {
			pub: retTrue,
			sub: retTrue,
		},
		scales: [xScaleKey, series[1] ? series[1].scale : null],
		match: [retEq, retEq, seriesIdxMatcher],
		values: [null, null],
	}, cursor.sync);

	if (syncOpts.match.length == 2)
		syncOpts.match.push(seriesIdxMatcher);

	cursor.sync = syncOpts;

	const syncKey = syncOpts.key;

	const sync = _sync(syncKey);

	function pubSync(type, src, x, y, w, h, i) {
		if (syncOpts.filters.pub(type, src, x, y, w, h, i))
			sync.pub(type, src, x, y, w, h, i);
	}

	sync.sub(self);

	function pub(type, src, x, y, w, h, i) {
		if (syncOpts.filters.sub(type, src, x, y, w, h, i))
			events[type](null, src, x, y, w, h, i);
	}

	self.pub = pub;

	function destroy() {
		sync.unsub(self);
		cursorPlots.delete(self);
		mouseListeners.clear();
		off(dppxchange, win, syncPxRatio);
		root.remove();
		legendTable?.remove(); // in case mounted outside of root
		fire("destroy");
	}

	self.destroy = destroy;

	function _init() {
		fire("init", opts, data);

		setData(data || opts.data, false);

		if (pendScales[xScaleKey])
			setScale(xScaleKey, pendScales[xScaleKey]);
		else
			autoScaleX();

		shouldSetSelect = select.show && (select.width > 0 || select.height > 0);
		shouldSetCursor = shouldSetLegend = true;

		_setSize(opts.width, opts.height);
	}

	series.forEach(initSeries);

	axes.forEach(initAxis);

	if (then) {
		if (then instanceof HTMLElement) {
			then.appendChild(root);
			_init();
		}
		else
			then(self, _init);
	}
	else
		_init();

	return self;
}

uPlot.assign = assign;
uPlot.fmtNum = fmtNum;
uPlot.rangeNum = rangeNum;
uPlot.rangeLog = rangeLog;
uPlot.rangeAsinh = rangeAsinh;
uPlot.orient   = orient;
uPlot.pxRatio = pxRatio;

{
	uPlot.join = join;
}

{
	uPlot.fmtDate = fmtDate;
	uPlot.tzDate  = tzDate;
}

uPlot.sync = _sync;

{
	uPlot.addGap = addGap;
	uPlot.clipGaps = clipGaps;

	let paths = uPlot.paths = {
		points,
	};

	(paths.linear  = linear);
	(paths.stepped = stepped);
	(paths.bars    = bars);
	(paths.spline  = monotoneCubic);
}

const ENTITY_OPTION_KEYS = /* @__PURE__ */ new Set([
  "name",
  "color",
  "y_axis",
  "line_width",
  "fill_opacity",
  "stroke_dash",
  "hidden",
  "transform",
  "statistics",
  "attribute",
  "unit",
  "scale",
  "invert"
]);
function normaliseEntityConfig(e) {
  if (typeof e === "string") return { entity: e };
  const obj = e;
  if (typeof obj["entity"] === "string") return obj;
  const entityKey = Object.keys(obj).find((k) => !ENTITY_OPTION_KEYS.has(k));
  if (entityKey) {
    const entityValue = obj[entityKey];
    const { [entityKey]: _ignored, ...siblingOptions } = obj;
    const nestedOptions = typeof entityValue === "object" && entityValue !== null ? entityValue : {};
    return { entity: entityKey, ...nestedOptions, ...siblingOptions };
  }
  return e;
}
function serialiseEntityConfig(ec) {
  const { entity, ...options } = ec;
  const cleanOptions = Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== void 0 && v !== null)
  );
  if (Object.keys(cleanOptions).length === 0) return entity;
  return { [entity]: cleanOptions };
}
const DEFAULT_COLORS = [
  "#FF6B4A",
  "#4AAFFF",
  "#6BDB6B",
  "#B07AFF",
  "#FFD166",
  "#06D6A0",
  "#EF476F",
  "#118AB2"
];
function hexToRgba(hex, alpha) {
  const clean = hex.replace(/^#/, "");
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else {
    return `rgba(0,0,0,${alpha})`;
  }
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r},${g},${b},${a})`;
}
function generateColors(count, palette = DEFAULT_COLORS) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(palette[i % palette.length]);
  }
  return result;
}
function formatValue(value, unit, decimals) {
  if (!isFinite(value)) return "\u2014";
  let formatted;
  if (decimals !== void 0) {
    formatted = value.toFixed(decimals);
  } else {
    formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }
  return unit ? `${formatted} ${unit}` : formatted;
}
function formatTime(ts) {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
function formatDate(ts) {
  const d = new Date(ts);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${day}.${month}`;
}
function formatDateTime(ts) {
  return `${formatDate(ts)} ${formatTime(ts)}`;
}
function findNumericSensor(hass, entities, entitiesFallback, fallback = "sensor.example") {
  const candidates = [...entities, ...entitiesFallback].filter(
    (e) => e.startsWith("sensor.")
  );
  const numeric = candidates.find((e) => {
    const state = hass?.states?.[e];
    return state && !isNaN(Number(state.state)) && state.attributes?.unit_of_measurement;
  });
  return numeric ?? candidates[0] ?? fallback;
}
function parsePeriod(s) {
  const m = s.match(/^(\d+(?:\.\d+)?)(m|h|d|w)$/);
  if (!m) return NaN;
  const n = parseFloat(m[1]);
  switch (m[2]) {
    case "m":
      return n * 6e4;
    case "h":
      return n * 36e5;
    case "d":
      return n * 864e5;
    case "w":
      return n * 6048e5;
    default:
      return NaN;
  }
}
function aggregateTimeSeries(data, periodMs, method) {
  if (data.length === 0 || periodMs <= 0) return data;
  const buckets = /* @__PURE__ */ new Map();
  for (const { t, v } of data) {
    const key = Math.floor(t / periodMs) * periodMs;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(v);
    else buckets.set(key, [v]);
  }
  const result = [];
  for (const [key, values] of buckets) {
    let v;
    switch (method) {
      case "mean":
        v = values.reduce((a, b) => a + b, 0) / values.length;
        break;
      case "min":
        v = values.reduce((a, b) => b < a ? b : a);
        break;
      case "max":
        v = values.reduce((a, b) => b > a ? b : a);
        break;
      case "sum":
        v = values.reduce((a, b) => a + b, 0);
        break;
      case "last":
        v = values[values.length - 1];
        break;
    }
    result.push({ t: key + periodMs / 2, v });
  }
  return result.sort((a, b) => a.t - b.t);
}
function applyTransform$1(data, transform) {
  if (transform === "none" || data.length === 0) return data;
  switch (transform) {
    case "diff": {
      const result = [];
      for (let i = 1; i < data.length; i++) {
        result.push({ t: data[i].t, v: data[i].v - data[i - 1].v });
      }
      return result;
    }
    case "normalize": {
      const vals = data.map((p) => p.v);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const range = max - min;
      if (range === 0) return data.map((p) => ({ t: p.t, v: 0 }));
      return data.map((p) => ({ t: p.t, v: (p.v - min) / range }));
    }
    case "cumulative": {
      let sum = 0;
      return data.map((p) => ({ t: p.t, v: sum += p.v }));
    }
  }
}

const CACHE_TTL_MS = 3e4;
const cache = /* @__PURE__ */ new Map();
function cacheKey(entityId, hours, attribute, statistics) {
  const parts = [entityId, hours];
  if (attribute) parts.push(attribute);
  if (statistics) parts.push(statistics);
  return parts.join(":");
}
function fromCache(entityId, hours, attribute, statistics) {
  const key = cacheKey(entityId, hours, attribute, statistics);
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.dataset;
}
function toCache(entityId, hours, dataset, attribute, statistics) {
  cache.set(cacheKey(entityId, hours, attribute, statistics), { dataset, timestamp: Date.now() });
}
function invalidateCache(entityId) {
  {
    cache.clear();
    return;
  }
}
async function fetchHistory(hass, entityId, startTime, endTime, attribute) {
  console.debug("[InsightChart] history request", { entityId, startTime, endTime, attribute });
  const response = await hass.callWS({
    type: "history/history_during_period",
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    entity_ids: [entityId],
    // Attributes are stripped from minimal responses — disable when needed
    minimal_response: !attribute,
    significant_changes_only: false
  });
  const isArray = Array.isArray(response);
  const responseKeys = !isArray ? Object.keys(response) : [];
  console.debug("[InsightChart] history response", { entityId, isArray, responseKeys, firstEntry: !isArray ? response[responseKeys[0]]?.[0] : response[0]?.[0] });
  let entries;
  if (isArray) {
    entries = response[0] ?? [];
  } else {
    const dict = response;
    entries = dict[entityId] ?? dict[entityId.toLowerCase()] ?? [];
  }
  const points = [];
  for (const entry of entries) {
    let v;
    if (attribute) {
      const attrVal = (entry.a ?? entry.attributes)?.[attribute];
      v = parseFloat(String(attrVal ?? ""));
    } else {
      const stateStr = entry.s ?? entry.state ?? "";
      v = parseFloat(stateStr);
    }
    if (!isFinite(v)) continue;
    let t;
    if (entry.lc !== void 0) {
      t = entry.lc * 1e3;
    } else if (entry.lu !== void 0) {
      t = entry.lu * 1e3;
    } else {
      t = new Date(entry.last_changed ?? entry.last_updated ?? "").getTime();
    }
    if (!isFinite(t)) continue;
    points.push({ t, v });
  }
  console.debug("[InsightChart] history parsed", { entityId, attribute, points: points.length });
  return points;
}
function choosePeriod(hours) {
  if (hours <= 24) return "5minute";
  if (hours <= 168) return "hour";
  if (hours <= 720) return "day";
  return "week";
}
async function fetchStatistics(hass, entityId, startTime, endTime, period) {
  console.debug("[InsightChart] statistics request", { entityId, period, startTime, endTime });
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    statistic_ids: [entityId],
    period,
    types: ["mean", "state"]
  });
  const entries = response[entityId] ?? [];
  const points = [];
  for (const entry of entries) {
    const v = entry.mean ?? entry.state;
    if (v == null || !isFinite(v)) continue;
    points.push({ t: new Date(entry.start).getTime(), v });
  }
  console.debug("[InsightChart] statistics parsed", { entityId, period, points: points.length });
  return points;
}
const HISTORY_THRESHOLD_HOURS = 72;
function applyValueModifiers(dataset, cfg) {
  const scale = cfg.scale ?? 1;
  const invert = cfg.invert ?? false;
  const unitOverride = cfg.unit;
  const needsValueChange = scale !== 1 || invert;
  const needsUnitChange = unitOverride !== void 0 && unitOverride !== dataset.unit;
  if (!needsValueChange && !needsUnitChange) return dataset;
  const factor = scale * (invert ? -1 : 1);
  return {
    ...dataset,
    unit: unitOverride ?? dataset.unit,
    data: needsValueChange ? dataset.data.map((p) => ({ t: p.t, v: p.v * factor })) : dataset.data
  };
}
async function getEntityData(hass, entityConfig, hours) {
  const cfg = normaliseEntityConfig(entityConfig);
  const entityId = cfg.entity;
  const attribute = cfg.attribute;
  const cached = fromCache(entityId, hours, attribute, cfg.statistics);
  if (cached) {
    return applyValueModifiers(cached, cfg);
  }
  const endTime = /* @__PURE__ */ new Date();
  const startTime = new Date(endTime.getTime() - hours * 36e5);
  const hassEntity = hass.states[entityId];
  const friendlyName = hassEntity?.attributes.friendly_name ?? entityId;
  const unit = attribute ? "" : hassEntity?.attributes.unit_of_measurement ?? "";
  let rawPoints;
  const useStatistics = cfg.statistics != null || hours > HISTORY_THRESHOLD_HOURS;
  console.debug("[InsightChart] data source", { entityId, useStatistics, hours, explicit: cfg.statistics });
  if (useStatistics) {
    const period = cfg.statistics ?? choosePeriod(hours);
    rawPoints = await fetchStatistics(hass, entityId, startTime, endTime, period);
  } else {
    rawPoints = await fetchHistory(hass, entityId, startTime, endTime, attribute);
  }
  const dataset = { entityId, friendlyName, unit, data: rawPoints };
  toCache(entityId, hours, dataset, attribute, cfg.statistics);
  return applyValueModifiers(dataset, cfg);
}
async function getMultiEntityData(hass, entities, hours) {
  return Promise.all(entities.map((e) => getEntityData(hass, e, hours)));
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1},e=t=>(...e)=>({_$litDirective$:t,values:e});let i$1 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n="important",i=" !"+n,o=e(class extends i$1{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"style"!==t$1.name||t$1.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(r)),this.render(r);for(const t of this.ft)null==r[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in r){const e=r[t];if(null!=e){this.ft.add(t);const r="string"==typeof e&&e.endsWith(i);t.includes("-")||r?s.setProperty(t,r?e.slice(0,-11):e,r?n:""):s[t]=e;}}return E}});

var __defProp$6 = Object.defineProperty;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = void 0 ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$6(target, key, result);
  return result;
};
class InsightBaseCard extends i$2 {
  constructor() {
    super(...arguments);
    this._data = [];
    this._loading = false;
    this._cardWidth = 400;
    /** Cached entity ID list — rebuilt on setConfig, used for fast state-change detection */
    this._entityIds = [];
    // -------------------------------------------------------------------------
    // Chart rebuild tracking (used by subclasses)
    // -------------------------------------------------------------------------
    /**
     * Signals that the chart must be fully rebuilt on the next sync.
     * Set to true on first render, config change, or theme change.
     * Subclasses should reset to false after completing the rebuild.
     */
    this._needsRebuild = true;
  }
  // -------------------------------------------------------------------------
  // LitElement lifecycle
  // -------------------------------------------------------------------------
  connectedCallback() {
    console.debug("[base-card] connected, hass", this.hass);
    super.connectedCallback();
    if (this.hass) {
      this._fetchData();
    }
    this._startRefreshTimer();
  }
  _startRefreshTimer() {
    if (this._refreshTimer !== void 0) {
      clearInterval(this._refreshTimer);
    }
    const interval = (this._config?.update_interval ?? 60) * 1e3;
    this._refreshTimer = setInterval(() => {
      if (this._config && this.hass) {
        invalidateCache();
        this._fetchData();
      }
    }, interval);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._refreshTimer !== void 0) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = void 0;
    }
  }
  updated(changedProps) {
    console.debug("[base-card] updated");
    super.updated(changedProps);
    if (changedProps.has("_config")) {
      this._needsRebuild = true;
      this._startRefreshTimer();
    }
    if (changedProps.has("hass") && this.hass && this._config) {
      const currentTheme = this.isDarkTheme;
      if (currentTheme !== this._lastTheme) {
        this._needsRebuild = true;
        this._lastTheme = currentTheme;
      }
      const shouldFetch = !this._lastFetchHass || this._entityIds.some(
        (id) => this.hass.states[id] !== this._lastFetchHass.states[id]
      );
      if (shouldFetch) {
        this._fetchData();
      }
    }
  }
  // -------------------------------------------------------------------------
  // HA card API
  // -------------------------------------------------------------------------
  setConfig(config) {
    console.debug("[base-card] setConfig");
    if (!config) {
      throw new Error("InsightChart: setConfig called without a config object");
    }
    const cfg = { ...config };
    if (!cfg["entities"] && cfg["entity"]) {
      cfg["entities"] = [cfg["entity"]];
    }
    const resolved = cfg;
    if (!resolved.entities || !Array.isArray(resolved.entities) || resolved.entities.length === 0) {
      throw new Error(
        "InsightChart: config must contain at least one entity in the 'entities' array"
      );
    }
    this._config = {
      ...this.getDefaultConfig(),
      ...resolved
    };
    this._entityIds = this._config.entities.map((e) => normaliseEntityConfig(e).entity);
    console.debug("[InsightChart] setConfig", this.tagName, this._config);
    if (this.hass) {
      this._fetchData();
    }
  }
  getGridOptions() {
    const overrides = this._config?.grid_options ?? {};
    return {
      columns: overrides.columns ?? 12,
      rows: overrides.rows ?? 3,
      min_columns: overrides.min_columns ?? 7,
      min_rows: overrides.min_rows ?? 3
    };
  }
  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------
  async _fetchData() {
    if (!this._config || !this.hass) return;
    const entities = this._config.entities.map((e) => normaliseEntityConfig(e).entity);
    console.debug("[InsightChart] fetchData start", this.tagName, { entities, hours: this._config.hours });
    this._loading = true;
    this._error = void 0;
    this._lastFetchHass = this.hass;
    try {
      const hours = this._config.hours ?? 24;
      this._data = await getMultiEntityData(
        this.hass,
        this._config.entities,
        hours
      );
      console.debug(
        "[InsightChart] fetchData done",
        this.tagName,
        this._data.map((d) => ({ entity: d.entityId, points: d.data.length }))
      );
    } catch (err) {
      this._error = err instanceof Error ? err.message : "Failed to fetch data";
      console.error("[InsightChart] fetchData error", this.tagName, err);
    } finally {
      this._loading = false;
    }
  }
  /** Subclasses can provide default config values */
  getDefaultConfig() {
    return { hours: 24, update_interval: 60 };
  }
  // -------------------------------------------------------------------------
  // Computed helpers
  // -------------------------------------------------------------------------
  /** All entities normalised to InsightEntityConfig objects */
  get entityConfigs() {
    return (this._config?.entities ?? []).map(normaliseEntityConfig);
  }
  get isMobile() {
    return this._cardWidth < 400;
  }
  get isDarkTheme() {
    if (!this.hass) return false;
    return this.hass.themes?.darkMode ?? false;
  }
  _getEntityColor(index, overrideColor) {
    if (overrideColor) return overrideColor;
    return generateColors(index + 1)[index];
  }
  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------
  _renderLoading() {
    return b`<div class="loading-container">
        <div class="loading-spinner"></div>
        </div>`;
  }
  _renderError() {
    return b`<div class="error">
          <span class="error-icon">⚠</span> ${this._error}
          </div>`;
  }
  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  render() {
    if (!this._config) {
      return b`<ha-card><div class="error">No configuration.</div></ha-card>`;
    }
    console.debug("[Base-card] render", this.offsetHeight);
    const styleContent = {
      paddingTop: `${this._config.margin_top ?? 0}px`,
      paddingBottom: `${this._config.margin_bottom ?? 0}px`,
      paddingLeft: `${this._config.margin_left ?? 0}px`,
      paddingRight: `${this._config.margin_right ?? 0}px`
    };
    return b`
          <ha-card>
            ${this._config.title ? b`<h1 class="card-header">${this._config.title}</h1>` : A}

            <div class="card-content" style="${o(styleContent)}">
              ${this._loading && this._data.length === 0 ? this._renderLoading() : A}
              ${this._error ? this._renderError() : A}
              <div class="chart-container">
                ${this.renderChart()}
              </div>
            </div>
          </ha-card>`;
  }
}
// -------------------------------------------------------------------------
// Styles
// -------------------------------------------------------------------------
InsightBaseCard.styles = i$5`
      :host {
          display: block;
          height: 100%;
      }

      ha-card {
          overflow: hidden;
          height: 100%;
      }

      .card-header {
        font-size: var(--ha-card-header-font-size, 1.125rem);
        font-weight: 500;
        color: var(--primary-text-color);
        padding: 12px 16px 0;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .chart-container {
        width: 100%;
        height: 250px;
      }

      /* Loading */
      .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        inset: 0;
        z-index: 1;
        background: color-mix(in srgb, var(--card-background-color, #fff) 95%, transparent);
      }

      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid var(--divider-color, #e0e0e0);
        border-top-color: var(--primary-color, #03a9f4);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Error */
      .error {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: var(--error-color, #db4437);
        font-size: 0.875rem;
        position: absolute;
        inset: 0;
        z-index: 1;
        background: color-mix(in srgb, var(--card-background-color, #fff) 95%, transparent);
      }

      .error-icon {
        font-size: 1.2em;
      }

      /* No data */
      .no-data {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--disabled-text-color, #9e9e9e);
        font-size: 0.875rem;
      }
      `;
__decorateClass$a([
  n$1({ attribute: false })
], InsightBaseCard.prototype, "hass");
__decorateClass$a([
  r()
], InsightBaseCard.prototype, "_config");
__decorateClass$a([
  r()
], InsightBaseCard.prototype, "_data");
__decorateClass$a([
  r()
], InsightBaseCard.prototype, "_loading");
__decorateClass$a([
  r()
], InsightBaseCard.prototype, "_error");
__decorateClass$a([
  r()
], InsightBaseCard.prototype, "_cardWidth");
__decorateClass$a([
  e$1(".card-header")
], InsightBaseCard.prototype, "_header");

var editor$1 = {
	loading: "Loading editor…",
	section: {
		general: "General",
		entities: "Entities",
		time_range: "Time range",
		chart_style: "Appearance",
		y_axis: "Y axis",
		data_aggregation: "Data aggregation",
		overlays: "Overlays",
		advanced: "Advanced"
	},
	field: {
		title: "Title (optional)",
		hours: "Time range",
		name: "Name",
		entity: "Entity",
		color: "Color",
		hex: "Hex",
		style: "Chart style",
		curve: "Interpolation",
		zoom: "Drag-to-zoom",
		show_points: "Data points",
		line_width: "Line width",
		fill_opacity: "Fill opacity",
		y_min: "Soft minimum",
		y_max: "Soft maximum",
		decimals: "Decimal places",
		logarithmic: "Logarithmic scale (base 10)",
		y_min_secondary: "Secondary axis minimum",
		y_max_secondary: "Secondary axis maximum",
		show_legend: "Show legend",
		show_x_axis: "Show X axis",
		show_y_axis: "Show Y axis",
		grid_opacity: "Grid opacity",
		tooltip_format: "Tooltip timestamp",
		time_format: "X-axis label format",
		aggregate: "Aggregation method",
		aggregate_period: "Aggregation period (e.g. 30m, 1h, 6h, 1d)",
		update_interval: "Update interval",
		margin_top: "Margin top",
		margin_bottom: "Margin bottom",
		margin_left: "Margin left",
		margin_right: "Margin right",
		padding_top: "Padding top",
		padding_bottom: "Padding bottom",
		padding_left: "Padding left",
		padding_right: "Padding right",
		y_axis: "Y axis",
		hidden: "Start hidden",
		stroke_dash: "Stroke dash (e.g. 5 or 8,4)",
		transform: "Transform",
		statistics: "Statistics period",
		attribute: "Attribute",
		unit: "Unit override",
		scale: "Scale factor",
		invert: "Invert values",
		value: "Value",
		label: "Label",
		dash: "Dash pattern (e.g. 4,3)",
		appearance: "Appearance",
		data: "Data"
	},
	action: {
		add_entity: "+ Add entity",
		remove_entity: "Remove entity",
		add_threshold: "+ Add threshold",
		add_color_threshold: "+ Add color threshold"
	},
	option: {
		style: {
			line: "Line",
			line_desc: "Classic line chart without fill",
			area: "Area",
			area_desc: "Line chart with filled area below",
			step: "Step",
			step_desc: "Staircase chart, ideal for state changes"
		},
		curve: {
			smooth: "Smooth",
			linear: "Linear"
		},
		points: {
			none: "None",
			hover: "On hover",
			always: "Always"
		},
		tooltip: {
			datetime: "Date & time",
			time: "Time",
			date: "Date"
		},
		time_format: {
			auto: "Auto",
			time: "HH:MM",
			date: "DD.MM",
			datetime: "DD.MM HH:MM"
		}
	},
	helper: {
		statistics: "Uses the Statistics API instead of the History API. The sensor must have a state_class (e.g. measurement). Without a selection the History API is used.",
		transform: "diff: change from previous value · normalize: scale to 0–1 · cumulative: running sum",
		scale: "Multiplication factor for all values. Example: 0.001 converts W to kW.",
		attribute: "Use a numeric entity attribute as the data source instead of the state. Set the unit manually if needed.",
		y_min: "The axis only goes below this value if data points require it.",
		y_max: "The axis only goes above this value if data points require it.",
		logarithmic: "All data values must be greater than 0.",
		aggregate: "Groups raw data into equal time buckets on the client.",
		aggregate_period: "Bucket size for aggregation, e.g. 30m, 1h, 6h, 1d.",
		stroke_dash: "Single number for equal gaps (e.g. 5), or dash,gap pair (e.g. 8,4).",
		color_thresholds: "Defines a color gradient based on Y values. At least 2 thresholds required."
	},
	subsection: {
		threshold_lines: "Threshold lines",
		color_thresholds: "Color thresholds (gradient)",
		primary_axis: "Primary axis",
		secondary_axis: "Secondary axis",
		layout: "Layout",
		margin: "Margin",
		padding: "Padding"
	}
};
var card$1 = {
	error: {
		no_config: "No configuration.",
		fetch_failed: "Failed to fetch data"
	}
};
var en = {
	editor: editor$1,
	card: card$1
};

var editor = {
	loading: "Editor wird geladen…",
	section: {
		general: "Allgemein",
		entities: "Entitäten",
		time_range: "Zeitbereich",
		chart_style: "Darstellung",
		y_axis: "Y-Achse",
		data_aggregation: "Datenaggregation",
		overlays: "Überlagerungen",
		advanced: "Erweitert"
	},
	field: {
		title: "Titel (optional)",
		hours: "Zeitbereich",
		name: "Name",
		entity: "Entität",
		color: "Farbe",
		hex: "Hex",
		style: "Diagrammstil",
		curve: "Interpolation",
		zoom: "Zoom per Drag",
		show_points: "Datenpunkte",
		line_width: "Linienbreite",
		fill_opacity: "Fülldeckkraft",
		y_min: "Weiches Minimum",
		y_max: "Weiches Maximum",
		decimals: "Nachkommastellen",
		logarithmic: "Logarithmische Skala (Basis 10)",
		y_min_secondary: "Sekundärachse Minimum",
		y_max_secondary: "Sekundärachse Maximum",
		show_legend: "Legende anzeigen",
		show_x_axis: "X-Achse anzeigen",
		show_y_axis: "Y-Achse anzeigen",
		grid_opacity: "Rasterdeckkraft",
		tooltip_format: "Tooltip-Zeitstempel",
		time_format: "X-Achsen-Beschriftungsformat",
		aggregate: "Aggregationsmethode",
		aggregate_period: "Aggregationszeitraum (z.B. 30m, 1h, 6h, 1d)",
		update_interval: "Aktualisierungsintervall",
		margin_top: "Außenabstand oben",
		margin_bottom: "Außenabstand unten",
		margin_left: "Außenabstand links",
		margin_right: "Außenabstand rechts",
		padding_top: "Innenabstand oben",
		padding_bottom: "Innenabstand unten",
		padding_left: "Innenabstand links",
		padding_right: "Innenabstand rechts",
		y_axis: "Y-Achse",
		hidden: "Ausgeblendet starten",
		stroke_dash: "Strichmuster (z.B. 5 oder 8,4)",
		transform: "Transformation",
		statistics: "Statistikzeitraum",
		attribute: "Attribut",
		unit: "Einheit (überschreiben)",
		scale: "Skalierungsfaktor",
		invert: "Werte invertieren",
		value: "Wert",
		label: "Bezeichnung",
		dash: "Strichmuster (z.B. 4,3)",
		appearance: "Darstellung",
		data: "Daten"
	},
	action: {
		add_entity: "+ Entität hinzufügen",
		remove_entity: "Entität entfernen",
		add_threshold: "+ Schwellenwert hinzufügen",
		add_color_threshold: "+ Farbschwellenwert hinzufügen"
	},
	option: {
		style: {
			line: "Linie",
			line_desc: "Klassisches Liniendiagramm ohne Füllung",
			area: "Fläche",
			area_desc: "Liniendiagramm mit gefüllter Fläche darunter",
			step: "Stufen",
			step_desc: "Treppendiagramm, ideal für Zustandsänderungen"
		},
		curve: {
			smooth: "Smooth",
			linear: "Linear"
		},
		points: {
			none: "Keine",
			hover: "Bei Hover",
			always: "Immer"
		},
		tooltip: {
			datetime: "Datum & Zeit",
			time: "Zeit",
			date: "Datum"
		},
		time_format: {
			auto: "Auto",
			time: "HH:MM",
			date: "DD.MM",
			datetime: "DD.MM HH:MM"
		}
	},
	helper: {
		statistics: "Nutzt die Statistics API statt der History API. Der Sensor benötigt eine state_class (z.B. measurement). Ohne Auswahl wird die History API verwendet.",
		transform: "diff: Differenz zum Vorgängerwert · normalize: auf 0–1 skalieren · cumulative: aufsummieren",
		scale: "Multiplikationsfaktor für alle Werte. Beispiel: 0.001 wandelt W in kW um.",
		attribute: "Numerisches Attribut statt des Entity-States als Datenpunkt verwenden. Einheit ggf. manuell setzen.",
		y_min: "Die Achse unterschreitet diesen Wert nur, wenn Datenpunkte darunter liegen.",
		y_max: "Die Achse überschreitet diesen Wert nur, wenn Datenpunkte darüber liegen.",
		logarithmic: "Alle Datenwerte müssen größer 0 sein.",
		aggregate: "Fasst Rohdaten clientseitig in gleichmäßige Zeitfenster zusammen.",
		aggregate_period: "Größe der Zeitfenster für die Aggregation, z.B. 30m, 1h, 6h, 1d.",
		stroke_dash: "Einzelne Zahl für gleichmäßige Lücken (z.B. 5), oder Strich,Lücke-Paar (z.B. 8,4).",
		color_thresholds: "Definiert einen Farbverlauf basierend auf Y-Werten. Mindestens 2 Schwellenwerte erforderlich."
	},
	subsection: {
		threshold_lines: "Schwellenwertlinien",
		color_thresholds: "Farbschwellenwerte (Gradient)",
		primary_axis: "Primärachse",
		secondary_axis: "Sekundärachse",
		layout: "Layout",
		margin: "Außenabstand",
		padding: "Innenabstand"
	}
};
var card = {
	error: {
		no_config: "Keine Konfiguration.",
		fetch_failed: "Datenabruf fehlgeschlagen"
	}
};
var de = {
	editor: editor,
	card: card
};

const translations = {
  en,
  de
};
function getNestedValue(obj, keyPath) {
  return keyPath.split(".").reduce((acc, key) => acc?.[key], obj);
}
function localize(key, lang = "en", vars) {
  const langKey = Object.keys(translations).includes(
    lang
  ) ? lang : "en";
  const langData = translations[langKey];
  const fallbackData = translations["en"];
  let template = getNestedValue(langData, key) ?? getNestedValue(fallbackData, key);
  if (typeof template !== "string") return key;
  return template;
}

var __defProp$5 = Object.defineProperty;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = void 0 ;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(target, key, result) ) || result;
  if (result) __defProp$5(target, key, result);
  return result;
};
i$5`
  .entity-picker-row {
    display: flex;
    align-items: flex-end;
    gap: 8px;
  }
  .entity-picker-row ha-entity-picker {
    flex: 1;
    min-width: 0;
    display: block;
  }
  .entity-picker-row .epr-color-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding-bottom: 8px;
    flex-shrink: 0;
  }
  .entity-picker-row .epr-color-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .entity-picker-row .epr-color-swatch {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 2px;
    background: transparent;
  }
`;
const TIME_PRESETS = [
  { label: "6h", hours: 6 },
  { label: "12h", hours: 12 },
  { label: "24h", hours: 24 },
  { label: "48h", hours: 48 },
  { label: "72h", hours: 72 },
  { label: "7d", hours: 168 }
];
class InsightBaseEditor extends i$2 {
  // -------------------------------------------------------------------------
  // LovelaceCardEditor API
  // -------------------------------------------------------------------------
  setConfig(config) {
    this._config = config;
  }
  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  get _lang() {
    return this.hass?.locale?.language ?? "en";
  }
  // -------------------------------------------------------------------------
  // Shared section renderers
  // -------------------------------------------------------------------------
  renderTitleSection() {
    return b`
      <div class="section">
        <div class="section-header">${localize("editor.section.general", this._lang)}</div>
        <ha-textfield
          label=${localize("editor.field.title", this._lang)}
          .value=${this._config?.title ?? ""}
          @change=${(e) => this._updateConfig({
      title: e.target.value || void 0
    })}
        ></ha-textfield>
      </div>
    `;
  }
  renderEntitySection() {
    const entities = (this._config?.entities ?? []).map(normaliseEntityConfig);
    return b`
      <div class="section">
        <div class="section-header">${localize("editor.section.entities", this._lang)}</div>

        ${entities.map(
      (ec, index) => b`
            <div class="entity-row">
              <ha-entity-picker
                label="Entity ${index + 1}"
                .hass=${this.hass}
                .value=${ec.entity}
                allow-custom-entity
                @value-changed=${(e) => this._updateEntity(index, { entity: e.detail.value })}
              ></ha-entity-picker>

              <ha-textfield
                label=${localize("editor.field.name", this._lang)}
                .value=${ec.name ?? ""}
                @change=${(e) => this._updateEntity(index, {
        name: e.target.value || void 0
      })}
              ></ha-textfield>

              <div class="entity-row-actions">
                <ha-icon-button
                  label=${localize("editor.action.remove_entity", this._lang)}
                  .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                  @click=${() => this._removeEntity(index)}
                ></ha-icon-button>
              </div>
            </div>
          `
    )}

        <mwc-button
          class="add-entity-btn"
          @click=${this._addEntity}
        >
          ${localize("editor.action.add_entity", this._lang)}
        </mwc-button>
      </div>
    `;
  }
  renderTimeRangeSection() {
    const currentHours = this._config?.hours ?? 24;
    return b`
      <div class="section">
        <div class="section-header">${localize("editor.section.time_range", this._lang)}</div>
        <div class="preset-buttons">
          ${TIME_PRESETS.map(
      ({ label, hours }) => b`
              <mwc-button
                class="preset-btn ${currentHours === hours ? "active" : ""}"
                dense
                @click=${() => this._updateConfig({ hours })}
              >
                ${label}
              </mwc-button>
            `
    )}
        </div>
      </div>
    `;
  }
  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  render() {
    if (!this._config) {
      return b`<div class="editor-loading">${localize("editor.loading", this._lang)}</div>`;
    }
    return b`
      <div class="editor-container">
      </div>
    `;
  }
  // -------------------------------------------------------------------------
  // Config mutation helpers
  // -------------------------------------------------------------------------
  _updateConfig(partial) {
    if (!this._config) return;
    this._config = { ...this._config, ...partial };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true
      })
    );
  }
  _addEntity() {
    if (!this._config) return;
    const entities = [
      ...this._config.entities ?? [],
      { entity: "" }
    ];
    this._updateConfig({ entities });
  }
  _removeEntity(index) {
    if (!this._config) return;
    const entities = [...this._config.entities ?? []];
    entities.splice(index, 1);
    this._updateConfig({ entities });
  }
  _updateEntity(index, patch) {
    if (!this._config) return;
    const entities = (this._config.entities ?? []).map(normaliseEntityConfig);
    entities[index] = { ...entities[index], ...patch };
    this._updateConfig({ entities });
  }
}
// -------------------------------------------------------------------------
// Styles
// -------------------------------------------------------------------------
InsightBaseEditor.styles = i$5`
    :host {
      display: block;
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 4px 0;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-header {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
      padding-bottom: 2px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    ha-textfield {
      width: 100%;
    }

    ha-entity-picker {
      width: 100%;
    }

    .entity-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 8px;
      align-items: flex-end;
    }

    .entity-row-actions {
      display: flex;
      align-items: center;
    }

    .add-entity-btn {
      align-self: flex-start;
      margin-top: 4px;
    }

    .preset-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .preset-btn {
      min-width: 48px;
    }

    .preset-btn.active {
      --mdc-theme-primary: var(--primary-color);
      background-color: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 4px;
    }

    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .toggle-label {
      font-size: 0.875rem;
      color: var(--primary-text-color);
    }

    .editor-loading {
      color: var(--secondary-text-color);
      font-size: 0.875rem;
      padding: 16px;
      text-align: center;
    }
  `;
__decorateClass$9([
  n$1({ attribute: false })
], InsightBaseEditor.prototype, "hass");
__decorateClass$9([
  r()
], InsightBaseEditor.prototype, "_config");

var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$4(target, key, result);
  return result;
};
let InsightToggleButton = class extends i$2 {
  constructor() {
    super(...arguments);
    this.svg = "";
    this.label = "";
    this.active = false;
    this.width = 80;
    this.height = 80;
  }
  render() {
    return b`
            <button
                class="toggle-btn ${this.active ? "active" : ""}"
                style="width:${this.width}px;height:${this.height}px;"
                aria-pressed=${this.active}
                @click=${this._handleClick}
            >
                <span class="icon" .innerHTML=${this.svg}></span>
                <span class="label">${this.label}</span>
            </button>
        `;
  }
  _handleClick() {
    this.dispatchEvent(
      new CustomEvent("toggle", {
        detail: { active: !this.active },
        bubbles: true,
        composed: true
      })
    );
  }
};
InsightToggleButton.styles = i$5`
        :host {
            display: inline-block;
        }

        .toggle-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 16px;
            border: 2px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            background: var(--card-background-color, #fff);
            cursor: pointer;
            transition:
                border-color 0.15s ease,
                background 0.15s ease;
            width: 100%;
            box-sizing: border-box;
        }

        .toggle-btn:hover {
            border-color: var(--primary-color, #03a9f4);
        }

        .toggle-btn.active {
            border-color: var(--primary-color, #03a9f4);
            background: color-mix(
                in srgb,
                var(--primary-color, #03a9f4) 12%,
                transparent
            );
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .icon svg {
            width: 100%;
            height: auto;
            display: block;
        }

        .label {
            font-size: 0.75rem;
            color: var(--secondary-text-color, #727272);
            text-align: center;
            white-space: normal;
            overflow-wrap: break-word;
        }

        .toggle-btn.active .label {
            color: var(--primary-color, #03a9f4);
            font-weight: 600;
        }
    `;
__decorateClass$8([
  n$1()
], InsightToggleButton.prototype, "svg", 2);
__decorateClass$8([
  n$1()
], InsightToggleButton.prototype, "label", 2);
__decorateClass$8([
  n$1({ type: Boolean, reflect: true })
], InsightToggleButton.prototype, "active", 2);
__decorateClass$8([
  n$1({ type: Number })
], InsightToggleButton.prototype, "width", 2);
__decorateClass$8([
  n$1({ type: Number })
], InsightToggleButton.prototype, "height", 2);
InsightToggleButton = __decorateClass$8([
  t$1("insight-toggle-button")
], InsightToggleButton);

var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$3(target, key, result);
  return result;
};
let InsightBoxModel = class extends i$2 {
  constructor() {
    super(...arguments);
    this.labelOuter = "Margin";
    this.labelInner = "Padding";
    this.keyOuter = "margin";
    this.keyInner = "padding";
    this.outerTop = 0;
    this.outerRight = 0;
    this.outerBottom = 0;
    this.outerLeft = 0;
    this.innerTop = 8;
    this.innerRight = 16;
    this.innerBottom = 8;
    this.innerLeft = 16;
  }
  render() {
    return b`
            <div class="bm-outer">
                <span class="bm-label">${this.labelOuter}</span>
                <div class="bm-top">
                    ${this._input(`${this.keyOuter}_top`, this.outerTop)}
                </div>
                <div class="bm-middle">
                    ${this._input(`${this.keyOuter}_left`, this.outerLeft)}
                    <div class="bm-inner">
                        <span class="bm-label bm-label--inner">${this.labelInner}</span>
                        <div class="bm-top">
                            ${this._input(`${this.keyInner}_top`, this.innerTop)}
                        </div>
                        <div class="bm-middle">
                            ${this._input(`${this.keyInner}_left`, this.innerLeft)}
                            <div class="bm-chart-area"></div>
                            ${this._input(`${this.keyInner}_right`, this.innerRight)}
                        </div>
                        <div class="bm-top">
                            ${this._input(`${this.keyInner}_bottom`, this.innerBottom)}
                        </div>
                    </div>
                    ${this._input(`${this.keyOuter}_right`, this.outerRight)}
                </div>
                <div class="bm-top">
                    ${this._input(`${this.keyOuter}_bottom`, this.outerBottom)}
                </div>
            </div>
        `;
  }
  _input(key, value) {
    return b`
            <input
                class="bm-input"
                type="number"
                min="0"
                max="100"
                .value=${String(value)}
                @change=${(e) => this._fire(key, parseInt(e.target.value) || 0)}
            />
        `;
  }
  _fire(key, value) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { key, value },
        bubbles: true,
        composed: true
      })
    );
  }
};
InsightBoxModel.styles = i$5`
        :host {
            display: block;
            margin: 24px 0px;
        }

        .bm-outer {
            border: 2px dashed var(--divider-color, #ccc);
            border-radius: 6px;
            padding: 4px 6px;
            position: relative;
        }

        .bm-inner {
            border: 2px dashed var(--primary-color, #03a9f4);
            border-radius: 4px;
            padding: 4px 6px;
            flex: 1;
            min-width: 0;
            position: relative;
        }

        .bm-label {
            position: absolute;
            top: -9px;
            left: 8px;
            background: var(--card-background-color, #fff);
            padding: 0 4px;
            font-size: 0.65rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--secondary-text-color);
        }

        .bm-label--inner {
            color: var(--primary-color, #03a9f4);
        }

        .bm-top {
            display: flex;
            justify-content: center;
            padding: 2px 0;
        }

        .bm-middle {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 2px 0;
        }

        .bm-chart-area {
            flex: 1;
            min-height: 28px;
            background: color-mix(in srgb, var(--primary-color, #03a9f4) 15%, transparent);
            border-radius: 3px;
        }

        .bm-input {
            width: 44px;
            text-align: center;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            padding: 3px 2px;
            font-size: 0.8rem;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            -moz-appearance: textfield;
        }

        .bm-input::-webkit-inner-spin-button,
        .bm-input::-webkit-outer-spin-button {
            opacity: 1;
        }

        .bm-input:focus {
            outline: 2px solid var(--primary-color, #03a9f4);
            outline-offset: -1px;
        }
    `;
__decorateClass$7([
  n$1({ attribute: "label-outer" })
], InsightBoxModel.prototype, "labelOuter", 2);
__decorateClass$7([
  n$1({ attribute: "label-inner" })
], InsightBoxModel.prototype, "labelInner", 2);
__decorateClass$7([
  n$1()
], InsightBoxModel.prototype, "keyOuter", 2);
__decorateClass$7([
  n$1()
], InsightBoxModel.prototype, "keyInner", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "outerTop", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "outerRight", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "outerBottom", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "outerLeft", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "innerTop", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "innerRight", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "innerBottom", 2);
__decorateClass$7([
  n$1({ type: Number })
], InsightBoxModel.prototype, "innerLeft", 2);
InsightBoxModel = __decorateClass$7([
  t$1("insight-box-model")
], InsightBoxModel);

function svgToDataUrl(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
const IMG_CHART_LINE = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polyline points="15,65 37,43 59,56 81,29 103,41 125,31 145,36" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);
const IMG_CHART_AREA = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polygon points="15,65 37,43 59,56 81,29 103,41 125,31 145,36 145,75 15,75" fill="rgba(74,175,255,0.18)"/>
  <polyline points="15,65 37,43 59,56 81,29 103,41 125,31 145,36" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);
const IMG_CHART_STEP = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polyline points="15,65 37,65 37,43 59,43 59,56 81,56 81,29 103,29 103,41 125,41 125,31 145,31" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter"/>
</svg>`);
const IMG_CURVE_SMOOTH = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <path d="M15,65 C26,55 32,36 45,35 C58,34 64,52 75,48 C86,44 92,22 105,22 C118,22 125,35 145,32" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);
const IMG_CURVE_LINEAR = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polyline points="15,65 45,35 75,48 105,22 145,32" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);
const SVG_ZOOM_DRAG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <line x1="2" y1="4"  x2="2"  y2="20" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="2,17 6,12 10,14 14,8 18,10 22,7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
  <rect x="8" y="6" width="10" height="10" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 1.5" rx="1"/>
  <circle cx="8" cy="6" r="1.2" fill="currentColor"/>
  <circle cx="18" cy="16" r="1.2" fill="currentColor"/>
  <line x1="5" y1="3" x2="7.5" y2="5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <polyline points="5,5.5 5,3 7.5,3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="19" y1="21" x2="16.5" y2="18.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <polyline points="19,18.5 19,21 16.5,21" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const SVG_SHOW_LEGEND = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="2" y1="2"  x2="2"  y2="16" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <line x1="2" y1="16" x2="22" y2="16" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="2,13 6,9 10,11 15,5 22,8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  <rect x="2" y="18" width="20" height="5" rx="1" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="0.8"/>
  <line x1="4" y1="20.5" x2="8" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="6" cy="20.5" r="1" fill="currentColor"/>
  <line x1="10" y1="20.5" x2="14" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1.5 1"/>
  <circle cx="12" cy="20.5" r="1" fill="currentColor"/>
  <line x1="16" y1="20.5" x2="20" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
const SVG_SHOW_X_AXIS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="4" y1="3" x2="4" y2="18" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="4,15 8,10 12,12 17,6 22,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="7"  y1="18" x2="7"  y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="12" y1="18" x2="12" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="17" y1="18" x2="17" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="22" y1="18" x2="22" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;
const SVG_SHOW_Y_AXIS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="4" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="4,15 8,10 12,12 17,6 22,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  <line x1="4" y1="2" x2="4" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="2" y1="6"  x2="4" y2="6"  stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="10" x2="4" y2="10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="14" x2="4" y2="14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="18" x2="4" y2="18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;

var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$2(target, key, result);
  return result;
};
let InsightLineCard = class extends InsightBaseCard {
  constructor() {
    super(...arguments);
    /** Cached per-entity colors for tooltip — rebuilt when config changes */
    this._tooltipColors = [];
    /** Cached u.over offset — stable between resizes, updated in ready hook */
    this._overLeft = 0;
    this._overTop = 0;
    /** Cached resolved --error-color for threshold lines — avoids getComputedStyle on every draw */
    this._thresholdDefaultColor = "#db4437";
    this._isZoomed = false;
    this._resizeObserver = null;
    /** Cached chart height in px — updated by ResizeObserver, read by _syncUplot/_buildOptions */
    this._chartHeight = 220;
  }
  // -------------------------------------------------------------------------
  // HA editor integration
  // -------------------------------------------------------------------------
  static getConfigElement() {
    return document.createElement("insight-line-card-editor");
  }
  static getStubConfig(hass, entities, entitiesFallback) {
    const sensor = findNumericSensor(hass, entities, entitiesFallback);
    return {
      type: InsightLineCard.cardType,
      entities: [sensor],
      hours: 24,
      style: "area",
      zoom: true,
      line_width: 1,
      show_legend: true,
      margin_bottom: 16,
      margin_top: 16,
      margin_left: 4,
      margin_right: 4
    };
  }
  // -------------------------------------------------------------------------
  // Base card overrides
  // -------------------------------------------------------------------------
  getDefaultConfig() {
    return {
      hours: 24,
      style: "area",
      curve: "smooth",
      zoom: true,
      line_width: 2,
      fill_opacity: 0.15,
      y_range: "auto",
      update_interval: 60,
      show_x_axis: true,
      show_y_axis: true
    };
  }
  /**
   * Measures available chart height from the DOM and updates _chartHeight.
   * Must only be called after paint (double-RAF from updated()), never during render().
   */
  _refreshChartHeight() {
    const total = this.offsetHeight;
    if (total === 0) return;
    const legendEl = this.shadowRoot?.querySelector(".u-legend");
    const legendHeight = legendEl?.offsetHeight ?? 0;
    let h = total;
    h -= this._header?.offsetHeight ?? 0;
    h -= legendHeight;
    h -= this._config?.margin_top ?? 0;
    h -= this._config?.margin_bottom ?? 0;
    const clamped = Math.max(80, h);
    if (clamped !== this._chartHeight) {
      this._chartHeight = clamped;
    }
  }
  // -------------------------------------------------------------------------
  // uPlot helpers
  // -------------------------------------------------------------------------
  /** Build uPlot series options for each entity */
  _buildSeries(config) {
    const series = [{}];
    const colors = generateColors(this.entityConfigs.length);
    const ct = config.color_thresholds;
    this.entityConfigs.forEach((ec, i) => {
      const color = ec.color ?? colors[i];
      const isArea = config.style === "area";
      const isStep = config.style === "step" || config.curve === "step";
      const isSmooth = !isStep && config.curve === "smooth";
      const pathBuilder = isStep ? uPlot.paths.stepped({ align: 1 }) : isSmooth ? uPlot.paths.spline() : void 0;
      const useGradient = ct && ct.length >= 2 && !ec.color;
      const fillOpacity = ec.fill_opacity ?? config.fill_opacity ?? 0.15;
      series.push({
        label: ec.name ?? this._data[i]?.friendlyName ?? ec.entity,
        scale: ec.y_axis === "right" ? "y2" : "y",
        stroke: useGradient ? (u) => this._buildColorGradient(u, ct) : color,
        fill: isArea ? useGradient ? (u) => this._buildColorGradient(u, ct, fillOpacity) : hexToRgba(color, fillOpacity) : void 0,
        show: !ec.hidden,
        width: ec.line_width ?? config.line_width ?? 2,
        dash: ec.stroke_dash != null ? Array.isArray(ec.stroke_dash) ? ec.stroke_dash : [ec.stroke_dash, ec.stroke_dash] : void 0,
        // true = always show static dots; false/"hover" = no static dots
        points: { show: config.show_points === true, size: 5 },
        paths: pathBuilder,
        spanGaps: true
      });
    });
    return series;
  }
  /** Build aligned uPlot data from EntityDataSet array */
  _buildUplotData() {
    if (this._data.length === 0) return [[], []];
    const config = this._config;
    const cardPeriodMs = config.aggregate_period ? parsePeriod(config.aggregate_period) : NaN;
    const cardMethod = config.aggregate;
    const datasets = this._data.map((dataset, i) => {
      const ec = this.entityConfigs[i];
      const method = cardMethod;
      const periodMs = cardPeriodMs;
      let data = dataset.data;
      if (method && isFinite(periodMs)) {
        data = aggregateTimeSeries(data, periodMs, method);
      }
      if (ec?.transform && ec.transform !== "none") {
        data = applyTransform$1(data, ec.transform);
      }
      return data;
    });
    const allTimestamps = /* @__PURE__ */ new Set();
    for (const data of datasets) {
      for (const point of data) {
        allTimestamps.add(Math.floor(point.t / 1e3));
      }
    }
    const timestamps = Array.from(allTimestamps).sort((a, b) => a - b);
    const valueSeries = datasets.map(
      (data) => {
        const map = /* @__PURE__ */ new Map();
        for (const point of data) {
          map.set(Math.floor(point.t / 1e3), point.v);
        }
        return timestamps.map((ts) => map.get(ts) ?? null);
      }
    );
    console.log("uPlot data built", valueSeries);
    return [timestamps, ...valueSeries];
  }
  /** Build uPlot options object */
  _buildOptions(config) {
    console.debug("[line-card] build options");
    const chartWidth = Math.max(
      100,
      this.wrapper?.clientWidth || this._cardWidth - 32
    );
    let chartHeight = this._chartHeight;
    const isDark = this.isDarkTheme;
    const cs = getComputedStyle(this);
    const axisStroke = isDark ? "rgba(255,255,255,0.55)" : cs.getPropertyValue("--secondary-text-color").trim() || "rgba(0,0,0,0.55)";
    const gridOpacity = config.grid_opacity ?? 1;
    const gridStroke = gridOpacity === 1 ? isDark ? "rgba(255,255,255,0.08)" : cs.getPropertyValue("--divider-color").trim() || "rgba(0,0,0,0.08)" : isDark ? `rgba(255,255,255,${(0.08 * gridOpacity).toFixed(3)})` : `rgba(0,0,0,${(0.08 * gridOpacity).toFixed(3)})`;
    const yMin = config.y_min;
    const yMax = config.y_max;
    const isLog = config.logarithmic === true;
    let yScaleOpts;
    if (isLog) {
      yScaleOpts = { distr: 3, log: 10, auto: true };
    } else if (Array.isArray(config.y_range)) {
      yScaleOpts = { range: config.y_range };
    } else if (yMin !== void 0 || yMax !== void 0) {
      yScaleOpts = {
        range: (_u, dataMin, dataMax) => [
          yMin !== void 0 ? Math.min(dataMin, yMin) : dataMin,
          yMax !== void 0 ? Math.max(dataMax, yMax) : dataMax
        ]
      };
    } else {
      yScaleOpts = { auto: true };
    }
    const hasSecondaryAxis = this.entityConfigs.some(
      (ec) => ec.y_axis === "right"
    );
    const y2Min = config.y_min_secondary;
    const y2Max = config.y_max_secondary;
    let y2ScaleOpts;
    if (Array.isArray(config.y_range_secondary)) {
      y2ScaleOpts = {
        range: config.y_range_secondary
      };
    } else if (y2Min !== void 0 || y2Max !== void 0) {
      y2ScaleOpts = {
        range: (_u, dataMin, dataMax) => [
          y2Min !== void 0 ? Math.min(dataMin, y2Min) : dataMin,
          y2Max !== void 0 ? Math.max(dataMax, y2Max) : dataMax
        ]
      };
    } else {
      y2ScaleOpts = { auto: true };
    }
    const primaryUnits = [
      ...new Set(
        this.entityConfigs.filter((ec) => ec.y_axis !== "right").map((_, i) => this._data[i]?.unit).filter(Boolean)
      )
    ];
    const secondaryUnits = [
      ...new Set(
        this.entityConfigs.flatMap(
          (ec, i) => ec.y_axis === "right" ? [this._data[i]?.unit] : []
        ).filter(Boolean)
      )
    ];
    const yUnit = primaryUnits.length === 1 ? primaryUnits[0] : "";
    const y2Unit = secondaryUnits.length === 1 ? secondaryUnits[0] : "";
    const decimals = config.decimals;
    const yValFormatter = (_u, vals) => vals.map(
      (v) => v == null ? "" : formatValue(v, void 0, decimals)
    );
    const yAxisSize = (u, vals) => {
      if (!vals?.length) return 40;
      u.ctx.font = "12px sans-serif";
      const maxW = vals.reduce((m, v) => {
        if (v == null) return m;
        return Math.max(m, u.ctx.measureText(String(v)).width);
      }, 0);
      return Math.max(32, Math.ceil(maxW) + 14);
    };
    return {
      width: chartWidth,
      height: chartHeight,
      cursor: {
        show: true,
        drag: {
          x: config.zoom !== false,
          y: false,
          uni: 50
        },
        focus: { prox: 16 },
        // "none": no cursor dots (return undefined → uPlot skips creation)
        // "hover"/"always": use uPlot default (omit show → cursorPointShow)
        ...config.show_points === false ? {
          points: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            show: () => void 0
          }
        } : {}
      },
      scales: {
        x: { time: true },
        y: yScaleOpts,
        ...hasSecondaryAxis ? { y2: y2ScaleOpts } : {}
      },
      series: this._buildSeries(config),
      axes: [
        {
          show: config.show_x_axis !== false,
          stroke: axisStroke,
          grid: { stroke: gridStroke, width: 1 },
          ticks: { stroke: gridStroke, width: 1 },
          font: "12px sans-serif",
          ...config.time_format && config.time_format !== "auto" ? {
            values: (_u, vals) => vals.map((v) => {
              const ms = v * 1e3;
              if (config.time_format === "time")
                return formatTime(ms);
              if (config.time_format === "date")
                return formatDate(ms);
              return formatDateTime(ms);
            })
          } : {}
        },
        {
          show: config.show_y_axis !== false,
          scale: "y",
          stroke: axisStroke,
          grid: { stroke: gridStroke, width: 1 },
          ticks: { stroke: gridStroke, width: 1 },
          font: "12px sans-serif",
          size: yAxisSize,
          label: yUnit,
          labelSize: yUnit ? 16 : 0,
          labelFont: "11px sans-serif",
          values: yValFormatter
        },
        ...hasSecondaryAxis ? [
          {
            scale: "y2",
            side: 1,
            // right side
            stroke: axisStroke,
            grid: { show: false },
            ticks: { stroke: gridStroke, width: 1 },
            font: "12px sans-serif",
            size: yAxisSize,
            label: y2Unit,
            labelSize: y2Unit ? 16 : 0,
            labelFont: "11px sans-serif",
            values: yValFormatter
          }
        ] : [
          {
            // Invisible balancing axis on the right to mirror the left Y-axis width
            show: false,
            side: 1,
            scale: "y",
            size: yAxisSize,
            gap: 0,
            stroke: axisStroke,
            grid: { show: false },
            ticks: { show: false }
          }
        ]
      ],
      legend: {
        show: config.show_legend !== false,
        live: false
      },
      hooks: {
        setScale: [
          (u, key) => {
            if (key !== "x") return;
            const xs = u.data[0];
            if (!xs?.length) return;
            const fullMin = xs[0];
            const fullMax = xs[xs.length - 1];
            const curMin = u.scales.x?.min ?? fullMin;
            const curMax = u.scales.x?.max ?? fullMax;
            const zoomed = curMin > fullMin || curMax < fullMax;
            this._zoomedRange = zoomed ? [curMin, curMax] : void 0;
            this._isZoomed = zoomed;
          }
        ],
        setCursor: [(u) => this._updateTooltip(u)],
        draw: config.thresholds?.length ? [
          (u) => this._drawThresholds(u, config.thresholds)
        ] : [],
        ready: [
          (u) => {
            this._tooltipEl = document.createElement("div");
            this._tooltipEl.className = "u-tooltip";
            u.root.appendChild(this._tooltipEl);
            this._overLeft = u.over.offsetLeft;
            this._overTop = u.over.offsetTop;
            this._attachPinchHandlers(u);
          }
        ],
        setSize: [
          (u) => {
            this._overLeft = u.over.offsetLeft;
            this._overTop = u.over.offsetTop;
          }
        ],
        destroy: [
          () => {
            this._tooltipEl = void 0;
            this._detachPinchHandlers();
            this._pinch = void 0;
          }
        ]
      },
      padding: [
        config.padding_top ?? 8,
        config.padding_right ?? 16,
        config.padding_bottom ?? 8,
        config.padding_left ?? 16
      ]
    };
  }
  /**
   * Build a vertical CanvasGradient from color_thresholds.
   * Stops are mapped from data values to Y-pixel positions so the gradient
   * transitions exactly at the configured threshold values.
   */
  _buildColorGradient(u, thresholds, opacity = 1) {
    if (!isFinite(u.bbox.top) || !isFinite(u.bbox.height) || u.bbox.height === 0) {
      const mid = thresholds[Math.floor(thresholds.length / 2)];
      const c = mid?.color ?? thresholds[0]?.color ?? "#888";
      return opacity < 1 ? hexToRgba(c, opacity) : c;
    }
    const grad = u.ctx.createLinearGradient(
      0,
      u.bbox.top,
      0,
      u.bbox.top + u.bbox.height
    );
    const sorted = [...thresholds].sort((a, b) => b.value - a.value);
    for (const t of sorted) {
      const yPx = u.valToPos(t.value, "y", true);
      const stop = Math.max(
        0,
        Math.min(1, (yPx - u.bbox.top) / u.bbox.height)
      );
      const color = opacity < 1 ? hexToRgba(t.color, opacity) : t.color;
      grad.addColorStop(stop, color);
    }
    return grad;
  }
  /** Draw horizontal threshold lines on the canvas */
  _drawThresholds(u, thresholds) {
    const defaultColor = this._thresholdDefaultColor;
    const dpr = window.devicePixelRatio ?? 1;
    const ctx = u.ctx;
    ctx.save();
    for (const t of thresholds) {
      const y = Math.round(u.valToPos(t.value, "y", true));
      if (y < u.bbox.top || y > u.bbox.top + u.bbox.height) continue;
      ctx.beginPath();
      ctx.strokeStyle = t.color ?? defaultColor;
      ctx.lineWidth = dpr;
      ctx.setLineDash((t.dash ?? [4, 3]).map((v) => v * dpr));
      ctx.moveTo(u.bbox.left, y);
      ctx.lineTo(u.bbox.left + u.bbox.width, y);
      ctx.stroke();
      if (t.label) {
        ctx.setLineDash([]);
        ctx.fillStyle = t.color ?? defaultColor;
        ctx.font = `${11 * dpr}px sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(
          t.label,
          u.bbox.left + u.bbox.width - 4 * dpr,
          y - 2 * dpr
        );
      }
    }
    ctx.restore();
  }
  /** Update the floating tooltip position and content on cursor move */
  _updateTooltip(u) {
    const tooltip = this._tooltipEl;
    if (!tooltip) return;
    const idx = u.cursor.idx;
    if (idx == null || (u.cursor.left ?? -1) < 0) {
      tooltip.style.display = "none";
      return;
    }
    const ts = u.data[0][idx];
    if (ts == null) {
      tooltip.style.display = "none";
      return;
    }
    const config = this._config;
    const tsMs = ts * 1e3;
    const fmt = config.tooltip_format ?? "datetime";
    const timeLabel = fmt === "time" ? formatTime(tsMs) : fmt === "date" ? formatDate(tsMs) : formatDateTime(tsMs);
    const rows = this._data.map((dataset, i) => {
      const val = u.data[i + 1]?.[idx];
      if (val == null) return "";
      const unit = dataset.unit ? ` ${dataset.unit}` : "";
      const color = this._tooltipColors[i] ?? "#888";
      const name = dataset.friendlyName;
      return `<div class="u-tooltip-row">
        <span class="u-tooltip-dot" style="background:${color}"></span>
        <span class="u-tooltip-name">${name}</span>
        <span class="u-tooltip-value">${formatValue(val)}${unit}</span>
      </div>`;
    }).filter(Boolean).join("");
    tooltip.innerHTML = `<div class="u-tooltip-time">${timeLabel}</div>${rows}`;
    tooltip.style.display = "block";
    const left = u.cursor.left + this._overLeft;
    const top = u.cursor.top + this._overTop;
    const flip = left > u.width / 2;
    tooltip.style.left = `${left + (flip ? -12 : 12)}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = flip ? "translate(-100%, -50%)" : "translateY(-50%)";
  }
  // -------------------------------------------------------------------------
  // Pinch-to-zoom (mobile)
  // -------------------------------------------------------------------------
  _attachPinchHandlers(u) {
    const over = u.over;
    const onStart = (e) => {
      if (e.touches.length !== 2) return;
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(
        t1.clientX - t0.clientX,
        t1.clientY - t0.clientY
      );
      this._pinch = {
        dist,
        scaleMin: u.scales.x?.min ?? u.data[0][0],
        scaleMax: u.scales.x?.max ?? u.data[0][u.data[0].length - 1]
      };
    };
    const onMove = (e) => {
      if (e.touches.length !== 2 || !this._pinch) return;
      e.preventDefault();
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const newDist = Math.hypot(
        t1.clientX - t0.clientX,
        t1.clientY - t0.clientY
      );
      const { dist: initDist, scaleMin, scaleMax } = this._pinch;
      const initRange = scaleMax - scaleMin;
      const factor = initDist / newDist;
      const newRange = initRange * factor;
      const rect = over.getBoundingClientRect();
      const centerPx = (t0.clientX + t1.clientX) / 2 - rect.left;
      const centerTime = u.posToVal(centerPx, "x");
      let newMin = centerTime - newRange / 2;
      let newMax = centerTime + newRange / 2;
      const xs = u.data[0];
      const dataMin = xs[0];
      const dataMax = xs[xs.length - 1];
      if (newMin < dataMin) {
        newMin = dataMin;
        newMax = Math.min(dataMax, dataMin + newRange);
      }
      if (newMax > dataMax) {
        newMax = dataMax;
        newMin = Math.max(dataMin, dataMax - newRange);
      }
      if (newMax - newMin < 60) return;
      u.setScale("x", { min: newMin, max: newMax });
    };
    const onEnd = (e) => {
      if (e.touches.length < 2) this._pinch = void 0;
    };
    over.addEventListener("touchstart", onStart, { passive: true });
    over.addEventListener("touchmove", onMove, { passive: false });
    over.addEventListener("touchend", onEnd, { passive: true });
    this._touchHandlers = {
      start: onStart,
      move: onMove,
      end: onEnd,
      target: over
    };
  }
  _detachPinchHandlers() {
    if (!this._touchHandlers) return;
    const { start, move, end, target } = this._touchHandlers;
    target.removeEventListener("touchstart", start);
    target.removeEventListener("touchmove", move);
    target.removeEventListener("touchend", end);
    this._touchHandlers = void 0;
  }
  // -------------------------------------------------------------------------
  // Chart render
  // -------------------------------------------------------------------------
  renderChart() {
    console.debug("[line-card] render chart", this._config);
    const config = this._config;
    if (!config) return b``;
    return b`
            <div class="chart-wrapper">
                <div id="chart"></div>
                ${this._isZoomed ? b`<button
                          class="zoom-reset-btn"
                          @click=${this._resetZoom}
                          title="Reset zoom"
                      >
                          <ha-svg-icon
                              .path=${"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"}
                          ></ha-svg-icon>
                      </button>` : ""}
            </div>
        `;
  }
  _resetZoom() {
    if (!this._uplot) return;
    const xs = this._uplot.data[0];
    if (!xs?.length) return;
    this._zoomedRange = void 0;
    this._isZoomed = false;
    this._uplot.setScale("x", { min: xs[0], max: xs[xs.length - 1] });
  }
  connectedCallback() {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver(([entry]) => {
      this._refreshChartHeight();
      const height = this._chartHeight;
      const width = this.wrapper?.clientWidth ?? entry.contentRect.width;
      if (width < 10 || height < 10) return;
      if (!this._uplot) {
        this._syncUplot();
      } else {
        this._uplot.setSize({ width, height });
      }
    });
    this.updateComplete.then(() => {
      this._resizeObserver.observe(this);
      if (!this._uplot) this._syncUplot();
    });
  }
  updated(changedProps) {
    super.updated(changedProps);
    console.log("[line-card] updated, data", this._data);
    console.log("[line-card] updated, uPlot", this._uplot);
    if (this._needsRebuild && this._uplot) {
      this._syncUplot();
      return;
    }
    if (this._uplot && this._data !== this._lastDataRef) {
      const previouslyEmpty = !this._lastDataRef || this._lastDataRef.every((d) => d.data.length === 0);
      this._cachedUData = this._buildUplotData();
      this._lastDataRef = this._data;
      if (previouslyEmpty) {
        this._needsRebuild = true;
        this._syncUplot();
      } else {
        this._uplot.setData(this._cachedUData, false);
        if (this._zoomedRange) {
          this._uplot.setScale("x", {
            min: this._zoomedRange[0],
            max: this._zoomedRange[1]
          });
        }
      }
    }
  }
  /** Create or update the uPlot instance to match current state */
  _syncUplot() {
    console.log("[_syncUpload]", this._config, this._data);
    const config = this._config;
    if (!config || !this.wrapper) return;
    const needsFull = this._needsRebuild || !this._uplot;
    const dataChanged = this._data !== this._lastDataRef;
    console.debug(
      "[_syncUpload] needsFull, dataChanged",
      needsFull,
      dataChanged
    );
    if (needsFull || dataChanged) {
      this._cachedUData = this._buildUplotData();
      this._lastDataRef = this._data;
    }
    const uData = this._cachedUData;
    if (needsFull) {
      const palette = generateColors(this.entityConfigs.length);
      this._tooltipColors = this.entityConfigs.map(
        (ec, i) => ec.color ?? palette[i]
      );
      this._thresholdDefaultColor = getComputedStyle(this).getPropertyValue("--error-color").trim() || "#db4437";
      const opts = this._buildOptions(config);
      this._uplot?.destroy();
      this._uplot = void 0;
      this._uplot = new uPlot(opts, uData, this.wrapper);
      this._needsRebuild = false;
      if (this._zoomedRange) {
        this._uplot.setScale("x", {
          min: this._zoomedRange[0],
          max: this._zoomedRange[1]
        });
      }
    } else {
      const chartWidth = Math.max(
        100,
        this.wrapper.clientWidth || this._cardWidth - 32
      );
      const chartHeight = this._chartHeight;
      if (dataChanged) {
        this._uplot.setData(uData, false);
        if (this._zoomedRange) {
          this._uplot.setScale("x", {
            min: this._zoomedRange[0],
            max: this._zoomedRange[1]
          });
        }
      }
      this._uplot.setSize({ width: chartWidth, height: chartHeight });
    }
  }
  disconnectedCallback() {
    console.debug("[line-card] disconneted");
    super.disconnectedCallback();
    this._uplot?.destroy();
    this._uplot = void 0;
    this._lastDataRef = void 0;
    this._cachedUData = void 0;
    this._zoomedRange = void 0;
    this._isZoomed = false;
  }
};
// uPlot injects CSS into document.head which doesn't reach Shadow DOM —
// include the essential uPlot styles here directly.
InsightLineCard.styles = [
  InsightBaseCard.styles,
  i$5`
            .chart-wrapper {
                position: relative;
                width: 100%;
                display: block;
            }

            #chart {
                width: 100%;
                display: block;
            }

            .zoom-reset-btn {
                position: absolute;
                top: 6px;
                right: 6px;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 6px;
                background: var(--card-background-color, #fff);
                color: var(--primary-text-color);
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                opacity: 0.85;
                transition: opacity 0.15s;
            }
            .zoom-reset-btn:hover {
                opacity: 1;
            }
            .zoom-reset-btn ha-svg-icon {
                --mdc-icon-size: 16px;
            }

            /* uPlot core layout — must be in Shadow DOM since uPlot injects to document.head */
            .u-wrap {
                display: block;
                position: relative;
                user-select: none;
                width: 100%;
            }
            .u-over,
            .u-under {
                position: absolute;
            }
            .u-under {
                overflow: hidden;
            }
            .u-axis {
                position: absolute;
            }

            /* Canvas must be constrained to logical size — uPlot sets 2x pixel
         dimensions for HiDPI but relies on injected CSS for the CSS size */
            .u-wrap canvas {
                display: block;
                width: 100%;
                height: 100%;
            }

            /* Legend below the plot — horizontal, centered */
            .u-legend {
                font-size: 12px;
                color: var(--secondary-text-color);
                margin: 4px auto 0;
                text-align: center;
            }
            .u-inline {
                display: block;
            }
            .u-inline * {
                display: inline-block;
            }
            .u-inline tr {
                margin-right: 12px;
            }
            .u-legend th {
                font-weight: normal;
                padding: 2px 0;
                cursor: pointer;
            }
            .u-legend th > * {
                vertical-align: middle;
            }
            .u-legend .u-marker {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 3px;
            }
            .u-legend .u-off > * {
                opacity: 0.4;
            }
            /* uPlot legend click fires only when e.target === th — pass clicks through children */
            .u-legend th * {
                pointer-events: none;
            }

            /* Cursor & selection */
            .u-select {
                background: color-mix(
                    in srgb,
                    var(--primary-color, #03a9f4) 15%,
                    transparent
                );
                position: absolute;
                pointer-events: none;
            }
            .u-cursor-x,
            .u-cursor-y {
                position: absolute;
                left: 0;
                top: 0;
                pointer-events: none;
                will-change: transform;
                z-index: 100;
            }
            .u-cursor-x {
                height: 100%;
                border-right: 1px dashed #607d8b;
            }
            .u-cursor-y {
                width: 100%;
                border-bottom: 1px dashed #607d8b;
            }
            .u-cursor-pt {
                position: absolute;
                top: 0;
                left: 0;
                border-radius: 50%;
                border: 0 solid;
                pointer-events: none;
                will-change: transform;
                z-index: 100;
                background-clip: padding-box !important;
            }
            .u-axis.u-off,
            .u-select.u-off,
            .u-cursor-x.u-off,
            .u-cursor-y.u-off,
            .u-cursor-pt.u-off {
                display: none;
            }

            /* Custom floating tooltip */
            .u-tooltip {
                position: absolute;
                pointer-events: none;
                z-index: 200;
                background: var(--card-background-color, #fff);
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 6px;
                padding: 6px 10px;
                font-size: 0.75rem;
                color: var(--primary-text-color);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                white-space: nowrap;
                display: none;
            }
            .u-tooltip-time {
                color: var(--secondary-text-color);
                margin-bottom: 4px;
                font-size: 0.7rem;
            }
            .u-tooltip-row {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 1px 0;
            }
            .u-tooltip-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .u-tooltip-name {
                color: var(--secondary-text-color);
                flex: 1;
            }
            .u-tooltip-value {
                font-weight: 500;
                text-align: right;
            }
        `
];
InsightLineCard.cardType = "custom:insight-line-card";
InsightLineCard.cardName = "Insight-line";
InsightLineCard.cardDescription = "Interactive time-series line & area chart with zoom";
__decorateClass$6([
  r()
], InsightLineCard.prototype, "_isZoomed", 2);
__decorateClass$6([
  e$1("#chart")
], InsightLineCard.prototype, "wrapper", 2);
__decorateClass$6([
  e$1(".chart-wrapper")
], InsightLineCard.prototype, "_chartWrapper", 2);
InsightLineCard = __decorateClass$6([
  t$1("insight-line-card")
], InsightLineCard);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: InsightLineCard.cardType.replace("custom:", ""),
  name: InsightLineCard.cardName,
  description: InsightLineCard.cardDescription,
  preview: true
});

// Material Design Icons v7.4.47
var mdiAxisArrow = "M12,2L16,6H13V13.85L19.53,17.61L21,15.03L22.5,20.5L17,21.96L18.53,19.35L12,15.58L5.47,19.35L7,21.96L1.5,20.5L3,15.03L4.47,17.61L11,13.85V6H8L12,2Z";
var mdiChartLine = "M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z";
var mdiCog = "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z";
var mdiDatabaseClock = "M16.5 16.25L19.36 17.94L18.61 19.16L15 17V12H16.5V16.25M23 16C23 19.87 19.87 23 16 23C13.61 23 11.5 21.8 10.25 20C6.18 19.79 3 18.08 3 16V13C3 14.88 5.58 16.44 9.06 16.88C9.03 16.59 9 16.3 9 16C9 15.62 9.04 15.25 9.1 14.88C5.6 14.45 3 12.88 3 11V8C3 10.09 6.2 11.8 10.27 12C10.87 11.14 11.64 10.44 12.53 9.93C12.04 9.97 11.5 10 11 10C6.58 10 3 8.21 3 6S6.58 2 11 2 19 3.79 19 6C19 7.2 17.93 8.28 16.25 9C17 9.04 17.75 9.19 18.44 9.45C18.79 9 19 8.5 19 8V9.68C21.36 10.81 23 13.21 23 16M21 16C21 13.24 18.76 11 16 11S11 13.24 11 16 13.24 21 16 21 21 18.76 21 16Z";
var mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
var mdiFormatListBulleted = "M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z";
var mdiLayersOutline = "M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z";
var mdiPlus = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";

class InsightEntityTab {
  constructor(index, config) {
    this.index = index;
    this.config = config !== void 0 ? normaliseEntityConfig(config) : { entity: "" };
  }
}

const ENTITY_BASE_SCHEMA = [
  { name: "entity", selector: { entity: {} } },
  { name: "name", selector: { text: {} } },
  {
    name: "y_axis",
    selector: {
      select: {
        mode: "list",
        options: [
          { value: "left", label: "Left axis" },
          { value: "right", label: "Right axis" }
        ]
      }
    }
  },
  { name: "hidden", selector: { boolean: {} } }
];
function buildAppearanceSchema(style) {
  const isArea = style === "area";
  return [
    {
      name: "line_width",
      selector: {
        number: { min: 0.5, max: 10, step: 0.5, mode: "slider", unit_of_measurement: "px" }
      }
    },
    ...isArea ? [
      {
        name: "fill_opacity",
        selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } }
      }
    ] : [],
    { name: "stroke_dash", selector: { text: {} } }
  ];
}
const DATA_SCHEMA = [
  { name: "attribute", selector: { text: {} } },
  { name: "unit", selector: { text: {} } },
  { name: "scale", selector: { number: { step: 1e-3, mode: "box" } } },
  { name: "invert", selector: { boolean: {} } },
  {
    name: "transform",
    selector: {
      select: {
        options: [
          { value: "none", label: "None" },
          { value: "diff", label: "Difference" },
          { value: "normalize", label: "Normalize (0\u20131)" },
          { value: "cumulative", label: "Cumulative" }
        ]
      }
    }
  },
  {
    name: "statistics",
    selector: {
      select: {
        options: [
          { value: "none", label: "None (use History API)" },
          { value: "5minute", label: "5 minutes" },
          { value: "hour", label: "Hour" },
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" }
        ]
      }
    }
  }
];

var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let InsightLineEntityEditor = class extends i$2 {
  constructor() {
    super(...arguments);
    this.chartStyle = "area";
    this._computeLabel = (schema) => {
      return localize(`editor.field.${schema.name}`, this._lang);
    };
    this._computeHelper = (schema) => {
      const key = `editor.helper.${schema.name}`;
      const result = localize(key, this._lang);
      return result === key ? "" : result;
    };
  }
  get _lang() {
    return this.hass?.locale?.language ?? "en";
  }
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  render() {
    if (!this.tab) return b`${A}`;
    const ec = this.tab.config;
    const dashStr = Array.isArray(ec.stroke_dash) ? ec.stroke_dash.join(",") : ec.stroke_dash != null ? String(ec.stroke_dash) : "";
    const baseData = {
      entity: ec.entity ?? "",
      name: ec.name ?? "",
      y_axis: ec.y_axis ?? "left",
      hidden: ec.hidden ?? false
    };
    const appearanceData = {
      line_width: ec.line_width,
      fill_opacity: ec.fill_opacity,
      stroke_dash: dashStr
    };
    const dataData = {
      attribute: ec.attribute ?? "",
      unit: ec.unit ?? "",
      scale: ec.scale,
      invert: ec.invert ?? false,
      transform: ec.transform ?? "none",
      statistics: ec.statistics ?? "none"
    };
    return b`
            <div class="entity-editor-content">
                <div class="entity-top-row">
                    <ha-icon-button
                        .path=${mdiDelete}
                        @click=${this._handleDelete}
                    ></ha-icon-button>
                </div>

                <div class="color-row">
                    <div class="color-label">
                        ${localize("editor.field.color", this._lang)}
                    </div>
                    <input
                        type="color"
                        class="color-swatch"
                        .value=${ec.color ?? DEFAULT_COLORS[this.tab.index - 1] ?? DEFAULT_COLORS[0]}
                        @input=${(e) => this._patch({
      color: e.target.value
    })}
                    />
                </div>

                <ha-form
                    .hass=${this.hass}
                    .schema=${ENTITY_BASE_SCHEMA}
                    .data=${baseData}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${(e) => this._onBaseChanged(e.detail.value)}
                ></ha-form>

                <div class="section-title">
                    ${localize("editor.field.appearance", this._lang)}
                </div>
                <ha-form
                    .hass=${this.hass}
                    .schema=${buildAppearanceSchema(this.chartStyle ?? "area")}
                    .data=${appearanceData}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${(e) => this._onAppearanceChanged(e.detail.value)}
                ></ha-form>

                <div class="section-title">
                    ${localize("editor.field.data", this._lang)}
                </div>
                <ha-form
                    .hass=${this.hass}
                    .schema=${DATA_SCHEMA}
                    .data=${dataData}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${(e) => this._onDataChanged(e.detail.value)}
                ></ha-form>
            </div>
        `;
  }
  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  _onBaseChanged(raw) {
    const detail = { ...this.tab.config };
    detail.entity = raw["entity"] ?? detail.entity;
    detail.y_axis = raw["y_axis"] ?? detail.y_axis;
    detail.hidden = raw["hidden"];
    if (raw["name"]) {
      detail.name = raw["name"];
    } else {
      delete detail.name;
    }
    this.dispatchEvent(new CustomEvent("onChange", { detail }));
  }
  _onAppearanceChanged(raw) {
    const dashStr = raw["stroke_dash"];
    const parsedDash = dashStr ? dashStr.includes(",") ? dashStr.split(",").map(Number).filter((n) => !isNaN(n)) : Number(dashStr) || void 0 : void 0;
    const detail = { ...this.tab.config };
    detail.line_width = raw["line_width"];
    detail.fill_opacity = raw["fill_opacity"];
    if (parsedDash != null) {
      detail.stroke_dash = parsedDash;
    } else {
      delete detail.stroke_dash;
    }
    this.dispatchEvent(new CustomEvent("onChange", { detail }));
  }
  _onDataChanged(raw) {
    const detail = { ...this.tab.config };
    if (raw["attribute"])
      detail.attribute = raw["attribute"];
    else delete detail.attribute;
    if (raw["unit"]) detail.unit = raw["unit"];
    else delete detail.unit;
    if (raw["scale"] != null) detail.scale = raw["scale"];
    else delete detail.scale;
    detail.invert = raw["invert"];
    detail.transform = raw["transform"] || void 0;
    const statsRaw = raw["statistics"];
    if (statsRaw && statsRaw !== "none") {
      detail.statistics = statsRaw;
    } else {
      delete detail.statistics;
    }
    this.dispatchEvent(new CustomEvent("onChange", { detail }));
  }
  _patch(patch) {
    const updated = { ...this.tab.config, ...patch };
    this.dispatchEvent(new CustomEvent("onChange", { detail: updated }));
  }
  _handleDelete() {
    this.dispatchEvent(
      new CustomEvent("onDelete", { detail: this.tab.index })
    );
  }
};
// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
InsightLineEntityEditor.styles = i$5`
        :host {
            display: block;
        }

        .entity-editor-content {
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 8px;
        }

        .entity-top-row {
            display: flex;
            justify-content: flex-end;
        }

        .color-row {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-bottom: 16px;
        }

        .color-swatch {
            width: 100%;
            height: 36px;
            border-radius: 4px;
            cursor: pointer;
            padding: 2px;
            background: transparent;
        }

        .section-title {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--secondary-text-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 8px 0px 16px 0px;
            padding: 8px 0px;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
    `;
__decorateClass$5([
  n$1({ attribute: false })
], InsightLineEntityEditor.prototype, "hass", 2);
__decorateClass$5([
  n$1({ attribute: false })
], InsightLineEntityEditor.prototype, "tab", 2);
__decorateClass$5([
  n$1()
], InsightLineEntityEditor.prototype, "chartStyle", 2);
InsightLineEntityEditor = __decorateClass$5([
  t$1("insight-line-entity-editor")
], InsightLineEntityEditor);

var __defProp = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __getProtoOf$2 = Object.getPrototypeOf;
var __reflectGet$2 = Reflect.get;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __superGet$2 = (cls, obj, key) => __reflectGet$2(__getProtoOf$2(cls), key, obj);
function dropEmpty(data) {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([, v]) => v !== null && v !== void 0 && v !== ""
    )
  );
}
function buildChartStyleSchema(cfg) {
  const isArea = (cfg.style ?? "area") === "area";
  return [
    {
      name: "line_width",
      selector: {
        number: {
          min: 0.5,
          max: 10,
          step: 0.5,
          mode: "slider",
          unit_of_measurement: "px"
        }
      }
    },
    ...isArea ? [
      {
        name: "fill_opacity",
        selector: {
          number: {
            min: 0,
            max: 1,
            step: 0.05,
            mode: "slider"
          }
        }
      }
    ] : [],
    {
      name: "grid_opacity",
      selector: {
        number: { min: 0, max: 1, step: 0.05, mode: "slider" }
      }
    }
  ];
}
function buildGeneralSchema(lang, cfg) {
  const isStep = cfg.style === "step";
  return [
    {
      name: "title",
      selector: { text: {} }
    },
    {
      name: "style",
      required: true,
      selector: {
        select: {
          mode: "box",
          options: [
            {
              value: "line",
              label: localize("editor.option.style.line", lang),
              image: IMG_CHART_LINE
            },
            {
              value: "area",
              label: localize("editor.option.style.area", lang),
              image: IMG_CHART_AREA
            },
            {
              value: "step",
              label: localize("editor.option.style.step", lang),
              image: IMG_CHART_STEP
            }
          ]
        }
      }
    },
    ...!isStep ? [
      {
        name: "curve",
        selector: {
          select: {
            mode: "box",
            options: [
              {
                value: "smooth",
                label: localize(
                  "editor.option.curve.smooth",
                  lang
                ),
                image: IMG_CURVE_SMOOTH
              },
              {
                value: "linear",
                label: localize(
                  "editor.option.curve.linear",
                  lang
                ),
                image: IMG_CURVE_LINEAR
              }
            ]
          }
        }
      }
    ] : []
  ];
}
const Y_AXIS_GENERAL_SCHEMA = [
  { name: "logarithmic", selector: { boolean: {} } },
  {
    name: "decimals",
    selector: { number: { min: 0, max: 6, step: 1, mode: "box" } }
  }
];
const Y_AXIS_PRIMARY_SCHEMA = [
  { name: "y_min", selector: { number: { step: 0.1, mode: "box" } } },
  { name: "y_max", selector: { number: { step: 0.1, mode: "box" } } }
];
const Y_AXIS_SECONDARY_SCHEMA = [
  {
    name: "y_min_secondary",
    selector: { number: { step: 0.1, mode: "box" } }
  },
  {
    name: "y_max_secondary",
    selector: { number: { step: 0.1, mode: "box" } }
  }
];
function buildAggregationSchema(cfg) {
  return [
    {
      name: "aggregate",
      selector: {
        select: {
          options: [
            { value: "none", label: "None" },
            { value: "mean", label: "Mean" },
            { value: "min", label: "Min" },
            { value: "max", label: "Max" },
            { value: "sum", label: "Sum" },
            { value: "last", label: "Last" }
          ]
        }
      }
    },
    ...cfg.aggregate && cfg.aggregate !== "none" ? [
      {
        name: "aggregate_period",
        selector: {
          select: {
            options: [
              { value: "5m", label: "5 min" },
              { value: "15m", label: "15 min" },
              { value: "30m", label: "30 min" },
              { value: "1h", label: "1 h" },
              { value: "3h", label: "3 h" },
              { value: "6h", label: "6 h" },
              { value: "12h", label: "12 h" },
              { value: "1d", label: "1 day" }
            ]
          }
        }
      }
    ] : []
  ];
}
const ADVANCED_SCHEMA = [
  {
    name: "update_interval",
    selector: {
      number: {
        min: 10,
        max: 3600,
        step: 10,
        mode: "box",
        unit_of_measurement: "s"
      }
    }
  }
];
const THRESHOLD_SCHEMA = [
  { name: "value", selector: { number: { step: 0.1, mode: "box" } } },
  { name: "label", selector: { text: {} } },
  { name: "dash", selector: { text: {} } }
];
const COLOR_THRESHOLD_SCHEMA = [
  { name: "value", selector: { number: { step: 0.1, mode: "box" } } }
];
let InsightLineCardEditor = class extends InsightBaseEditor {
  constructor() {
    super(...arguments);
    this._tabs = [];
    this._currTab = "1";
    this._hoursOptions = [
      { value: "6", label: "6h" },
      { value: "12", label: "12h" },
      { value: "24", label: "24h" },
      { value: "48", label: "48h" },
      { value: "72", label: "72h" },
      { value: "168", label: "7d" }
    ];
    this._addTab = () => {
      const newTab = new InsightEntityTab(this._tabs.length + 1, void 0);
      this._tabs = [...this._tabs, newTab];
      this._currTab = newTab.index.toString();
      this._syncEntitiesToConfig();
    };
    // ---------------------------------------------------------------------------
    // computeLabel
    // ---------------------------------------------------------------------------
    this._computeLabel = (schema) => {
      if ("title" in schema) return schema.title;
      return localize(`editor.field.${schema.name}`, this._lang);
    };
    this._computeHelper = (schema) => {
      const key = `editor.helper.${schema.name}`;
      const result = localize(key, this._lang);
      return result === key ? "" : result;
    };
    this._appendThreshold = () => {
      const thresholds = [
        ...this._lineConfig.thresholds ?? [],
        { value: 0, color: "#db4437" }
      ];
      this._updateConfig({ thresholds });
    };
    // ---------------------------------------------------------------------------
    // Color threshold helpers
    // ---------------------------------------------------------------------------
    this._appendColorThreshold = () => {
      const color_thresholds = [
        ...this._lineConfig.color_thresholds ?? [],
        { value: 0, color: "#03a9f4" }
      ];
      this._updateConfig({ color_thresholds });
    };
  }
  get _lineConfig() {
    return this._config ?? {};
  }
  setConfig(config) {
    super.setConfig(config);
    const cfg = config;
    this._tabs = (cfg.entities ?? []).map(
      (e, i) => new InsightEntityTab(i + 1, e)
    );
    if (this._tabs.length === 0) this._addTab();
  }
  // Required by abstract base — unused since we override render()
  renderCardOptions() {
    return b`${A}`;
  }
  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  render() {
    if (!this._config) {
      return b`<div class="editor-loading">
                ${localize("editor.loading", this._lang)}
            </div>`;
    }
    return b`
            <div class="editor-container">
                ${this._renderGeneralSection()} ${this._renderEntitySection()}
                ${this._renderChartStyleSection()} ${this._renderYAxisSection()}
                ${this._renderAggregationSection()}
                ${this._renderOverlaysSection()}
                ${this._renderAdvancedSection()}
            </div>
        `;
  }
  _renderGeneralSection() {
    const cfg = this._lineConfig;
    const data = {
      title: cfg.title ?? "",
      style: cfg.style ?? "area",
      curve: cfg.curve ?? "smooth"
    };
    return b`
            <div class="section">
                <ha-form
                    .hass=${this.hass}
                    .schema=${buildGeneralSchema(this._lang, cfg)}
                    .data=${data}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${(e) => this._updateConfig(
      e.detail.value
    )}
                ></ha-form>
                <div class="control-row">
                    <span class="control-label"
                        >${localize("editor.field.hours", this._lang)}</span
                    >
                    <ha-control-select
                        .options=${this._hoursOptions}
                        .value=${String(cfg.hours ?? 24)}
                        @value-changed=${(e) => this._updateConfig({
      hours: Number(e.detail.value)
    })}
                    ></ha-control-select>
                </div>
            </div>
        `;
  }
  // ---------------------------------------------------------------------------
  // Entities (expandable + tabs)
  // ---------------------------------------------------------------------------
  _renderEntitySection() {
    const currentTab = this._tabs.find((t) => t.index.toString() === this._currTab) ?? this._tabs[0];
    return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiFormatListBulleted}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.entities", this._lang)}</span
                >
                <div class="entities-panel">
                    <div class="entities-toolbar">
                        <ha-tab-group @wa-tab-show=${this._handleTabChanged}>
                            ${this._tabs.map(
      (tab) => b`
                                    <ha-tab-group-tab
                                        slot="nav"
                                        .panel=${tab.index}
                                        .active=${this._currTab === tab.index.toString()}
                                    >
                                        ${tab.index}
                                    </ha-tab-group-tab>
                                `
    )}
                        </ha-tab-group>
                        <ha-icon-button
                            .path=${mdiPlus}
                            .label=${localize(
      "editor.action.add_entity",
      this._lang
    )}
                            @click=${this._addTab}
                        ></ha-icon-button>
                    </div>

                    ${currentTab ? b`
                              <insight-line-entity-editor
                                  .hass=${this.hass}
                                  .tab=${currentTab}
                                  .chartStyle=${this._lineConfig.style ?? "area"}
                                  @onChange=${this._handleEntityChange}
                                  @onDelete=${this._handleEntityDelete}
                              ></insight-line-entity-editor>
                          ` : A}
                </div>
            </ha-expansion-panel>
        `;
  }
  _handleTabChanged(e) {
    const next = e.detail.name?.toString();
    if (next && next !== this._currTab) this._currTab = next;
  }
  _handleEntityChange(e) {
    e.stopPropagation();
    const idx = this._tabs.findIndex(
      (t) => t.index.toString() === this._currTab
    );
    if (idx === -1) return;
    this._tabs[idx].config = e.detail;
    this._syncEntitiesToConfig();
  }
  _handleEntityDelete(e) {
    e.stopPropagation();
    const delIndex = e.detail;
    this._tabs = this._tabs.filter((t) => t.index !== delIndex).map((t, i) => new InsightEntityTab(i + 1, t.config));
    const newCurr = Math.max(1, parseInt(this._currTab) - 1);
    this._currTab = this._tabs.length > 0 ? Math.min(newCurr, this._tabs.length).toString() : "1";
    this._syncEntitiesToConfig();
  }
  _syncEntitiesToConfig() {
    this._updateConfig({
      entities: this._tabs.filter((t) => t.config.entity).map(
        (t) => serialiseEntityConfig(t.config)
      )
    });
  }
  // ---------------------------------------------------------------------------
  // Chart style
  // ---------------------------------------------------------------------------
  _renderChartStyleSection() {
    const cfg = this._lineConfig;
    const showPointsStr = cfg.show_points === true ? "true" : cfg.show_points === "hover" ? "hover" : "false";
    const data = {
      line_width: cfg.line_width ?? 2,
      fill_opacity: cfg.fill_opacity ?? 0.15,
      grid_opacity: cfg.grid_opacity ?? 1
    };
    const timeFormatOptions = [
      {
        value: "auto",
        label: localize("editor.option.time_format.auto", this._lang)
      },
      {
        value: "time",
        label: localize("editor.option.time_format.time", this._lang)
      },
      {
        value: "date",
        label: localize("editor.option.time_format.date", this._lang)
      },
      {
        value: "datetime",
        label: localize(
          "editor.option.time_format.datetime",
          this._lang
        )
      }
    ];
    const tooltipOptions = [
      {
        value: "datetime",
        label: localize("editor.option.tooltip.datetime", this._lang)
      },
      {
        value: "time",
        label: localize("editor.option.tooltip.time", this._lang)
      },
      {
        value: "date",
        label: localize("editor.option.tooltip.date", this._lang)
      }
    ];
    const pointsOptions = [
      {
        value: "false",
        label: localize("editor.option.points.none", this._lang)
      },
      {
        value: "hover",
        label: localize("editor.option.points.hover", this._lang)
      },
      {
        value: "true",
        label: localize("editor.option.points.always", this._lang)
      }
    ];
    return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiChartLine}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.chart_style", this._lang)}</span
                >
                <div class="panel-content">
                    <div class="toggle-row">
                        <insight-toggle-button
                            .svg=${SVG_ZOOM_DRAG}
                            .label=${localize("editor.field.zoom", this._lang)}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.zoom !== false}
                            @toggle=${() => this._updateConfig({
      zoom: cfg.zoom === false
    })}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${SVG_SHOW_LEGEND}
                            .label=${localize(
      "editor.field.show_legend",
      this._lang
    )}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_legend !== false}
                            @toggle=${() => this._updateConfig({
      show_legend: cfg.show_legend === false
    })}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${SVG_SHOW_X_AXIS}
                            .label=${localize(
      "editor.field.show_x_axis",
      this._lang
    )}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_x_axis !== false}
                            @toggle=${() => this._updateConfig({
      show_x_axis: cfg.show_x_axis === false
    })}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${SVG_SHOW_Y_AXIS}
                            .label=${localize(
      "editor.field.show_y_axis",
      this._lang
    )}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_y_axis !== false}
                            @toggle=${() => this._updateConfig({
      show_y_axis: cfg.show_y_axis === false
    })}
                        ></insight-toggle-button>
                    </div>

                    <div class="control-row">
                        <span class="control-label"
                            >${localize(
      "editor.field.show_points",
      this._lang
    )}</span
                        >
                        <ha-control-select
                            .options=${pointsOptions}
                            .value=${showPointsStr}
                            @value-changed=${(e) => {
      const v = e.detail.value;
      this._updateConfig({
        show_points: v === "true" ? true : v === "hover" ? "hover" : false
      });
    }}
                        ></ha-control-select>
                    </div>
                    <div class="control-row">
                        <span class="control-label"
                            >${localize(
      "editor.field.tooltip_format",
      this._lang
    )}</span
                        >
                        <ha-control-select
                            .options=${tooltipOptions}
                            .value=${cfg.tooltip_format ?? "datetime"}
                            @value-changed=${(e) => this._updateConfig({
      tooltip_format: e.detail.value
    })}
                        ></ha-control-select>
                    </div>
                    <div class="control-row">
                        <span class="control-label"
                            >${localize(
      "editor.field.time_format",
      this._lang
    )}</span
                        >
                        <ha-control-select
                            .options=${timeFormatOptions}
                            .value=${cfg.time_format ?? "auto"}
                            @value-changed=${(e) => this._updateConfig({
      time_format: e.detail.value
    })}
                        ></ha-control-select>
                    </div>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${buildChartStyleSchema(cfg)}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(e) => this._updateConfig(
      e.detail.value
    )}
                    ></ha-form>
                    ${this._renderBoxModel()}
                </div>
            </ha-expansion-panel>
        `;
  }
  // ---------------------------------------------------------------------------
  // Y axis
  // ---------------------------------------------------------------------------
  _renderYAxisSection() {
    const cfg = this._lineConfig;
    const primaryData = {
      logarithmic: cfg.logarithmic ?? false,
      decimals: cfg.decimals,
      y_min: cfg.y_min,
      y_max: cfg.y_max
    };
    const secondaryData = {
      y_min_secondary: cfg.y_min_secondary,
      y_max_secondary: cfg.y_max_secondary
    };
    return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiAxisArrow}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.y_axis", this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_GENERAL_SCHEMA}
                        .data=${primaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(e) => this._updateConfig(
      dropEmpty(
        e.detail.value
      )
    )}
                    ></ha-form>
                    <div class="section-title" style="padding-top:24px">
                        ${localize(
      "editor.subsection.primary_axis",
      this._lang
    )}
                    </div>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_PRIMARY_SCHEMA}
                        .data=${primaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(e) => this._updateConfig(
      dropEmpty(
        e.detail.value
      )
    )}
                    ></ha-form>
                    <div class="section-title" style="padding-top:24px">
                        ${localize(
      "editor.subsection.secondary_axis",
      this._lang
    )}
                    </div>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_SECONDARY_SCHEMA}
                        .data=${secondaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(e) => this._updateConfig(
      dropEmpty(
        e.detail.value
      )
    )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
  }
  // ---------------------------------------------------------------------------
  // Data aggregation
  // ---------------------------------------------------------------------------
  _renderAggregationSection() {
    const cfg = this._lineConfig;
    const data = {
      aggregate: cfg.aggregate ?? "none",
      aggregate_period: cfg.aggregate_period ?? ""
    };
    return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiDatabaseClock}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize(
      "editor.section.data_aggregation",
      this._lang
    )}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${buildAggregationSchema(cfg)}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(e) => {
      const v = e.detail.value;
      const next = {
        ...this._lineConfig,
        ...dropEmpty(v)
      };
      if (!v["aggregate"] || v["aggregate"] === "none") {
        delete next.aggregate;
        delete next.aggregate_period;
      } else if (!v["aggregate_period"]) {
        delete next.aggregate_period;
      }
      this._config = next;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: { config: next },
          bubbles: true,
          composed: true
        })
      );
    }}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
  }
  // ---------------------------------------------------------------------------
  // Overlays (threshold lines + color thresholds)
  // ---------------------------------------------------------------------------
  _renderOverlaysSection() {
    const cfg = this._lineConfig;
    const thresholds = cfg.thresholds ?? [];
    const colorThresholds = cfg.color_thresholds ?? [];
    return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiLayersOutline}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.overlays", this._lang)}</span
                >
                <div class="panel-content">
                    <div class="section-title">
                        ${localize(
      "editor.subsection.threshold_lines",
      this._lang
    )}
                    </div>
                    ${thresholds.map(
      (t, idx) => b`
                            <div class="overlay-row">
                                <div class="overlay-color-field">
                                    <span class="field-label"
                                        >${localize(
        "editor.field.color",
        this._lang
      )}</span
                                    >
                                    <input
                                        type="color"
                                        class="color-swatch"
                                        .value=${t.color ?? "#db4437"}
                                        @input=${(e) => this._updateThresholdAt(idx, {
        ...t,
        color: e.target.value
      })}
                                    />
                                </div>
                                <ha-form
                                    .hass=${this.hass}
                                    .schema=${THRESHOLD_SCHEMA}
                                    .data=${{
        value: t.value,
        label: t.label ?? "",
        dash: t.dash?.join(",") ?? ""
      }}
                                    .computeLabel=${this._computeLabel}
                                    @value-changed=${(e) => this._updateThresholdAt(idx, {
        ...t,
        ...this._parseThreshold(
          e.detail.value
        )
      })}
                                ></ha-form>
                                <ha-icon-button
                                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                                    @click=${() => this._removeThresholdAt(idx)}
                                ></ha-icon-button>
                            </div>
                        `
    )}
                    <ha-button @click=${this._appendThreshold}
                        >${localize(
      "editor.action.add_threshold",
      this._lang
    )}</ha-button
                    >

                    <div class="section-title" style="margin-top:24px">
                        ${localize(
      "editor.subsection.color_thresholds",
      this._lang
    )}
                    </div>
                    ${colorThresholds.map(
      (ct, idx) => b`
                            <div class="overlay-row">
                                <div class="overlay-color-field">
                                    <span class="field-label"
                                        >${localize(
        "editor.field.color",
        this._lang
      )}</span
                                    >
                                    <input
                                        type="color"
                                        class="color-swatch"
                                        .value=${ct.color ?? "#03a9f4"}
                                        @input=${(e) => this._updateColorThresholdAt(idx, {
        ...ct,
        color: e.target.value
      })}
                                    />
                                </div>
                                <ha-form
                                    .hass=${this.hass}
                                    .schema=${COLOR_THRESHOLD_SCHEMA}
                                    .data=${{ value: ct.value }}
                                    .computeLabel=${this._computeLabel}
                                    @value-changed=${(e) => this._updateColorThresholdAt(idx, {
        ...ct,
        value: e.detail.value["value"] ?? 0
      })}
                                ></ha-form>
                                <ha-icon-button
                                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                                    @click=${() => this._removeColorThresholdAt(idx)}
                                ></ha-icon-button>
                            </div>
                        `
    )}
                    <ha-button @click=${this._appendColorThreshold}
                        >${localize(
      "editor.action.add_color_threshold",
      this._lang
    )}</ha-button
                    >
                </div>
            </ha-expansion-panel>
        `;
  }
  // ---------------------------------------------------------------------------
  // Advanced
  // ---------------------------------------------------------------------------
  _renderAdvancedSection() {
    const cfg = this._lineConfig;
    const data = {
      update_interval: cfg.update_interval ?? 60
    };
    return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon slot="leading-icon" .path=${mdiCog}></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.advanced", this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${ADVANCED_SCHEMA}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(e) => this._updateConfig(
      e.detail.value
    )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
  }
  _renderBoxModel() {
    const cfg = this._lineConfig;
    return b`
            <div class="layout-section">
                <div class="section-title">
                    ${localize("editor.subsection.layout", this._lang)}
                </div>
                <insight-box-model
                    .labelOuter=${localize(
      "editor.subsection.margin",
      this._lang
    )}
                    .labelInner=${localize(
      "editor.subsection.padding",
      this._lang
    )}
                    keyOuter="margin"
                    keyInner="padding"
                    .outerTop=${cfg.margin_top ?? 0}
                    .outerRight=${cfg.margin_right ?? 0}
                    .outerBottom=${cfg.margin_bottom ?? 0}
                    .outerLeft=${cfg.margin_left ?? 0}
                    .innerTop=${cfg.padding_top ?? 8}
                    .innerRight=${cfg.padding_right ?? 16}
                    .innerBottom=${cfg.padding_bottom ?? 8}
                    .innerLeft=${cfg.padding_left ?? 16}
                    @value-changed=${(e) => this._updateConfig({
      [e.detail.key]: e.detail.value
    })}
                ></insight-box-model>
            </div>
        `;
  }
  // ---------------------------------------------------------------------------
  // Threshold helpers
  // ---------------------------------------------------------------------------
  _parseThreshold(raw) {
    const dashStr = raw["dash"];
    const dash = dashStr ? dashStr.split(",").map(Number).filter((n) => !isNaN(n)) : void 0;
    return {
      value: raw["value"] ?? 0,
      label: raw["label"] || void 0,
      dash: dash?.length ? dash : void 0
    };
  }
  _removeThresholdAt(index) {
    const thresholds = [...this._lineConfig.thresholds ?? []];
    thresholds.splice(index, 1);
    this._updateConfig({ thresholds });
  }
  _updateThresholdAt(index, t) {
    const thresholds = [...this._lineConfig.thresholds ?? []];
    thresholds[index] = t;
    this._updateConfig({ thresholds });
  }
  _removeColorThresholdAt(index) {
    const color_thresholds = [...this._lineConfig.color_thresholds ?? []];
    color_thresholds.splice(index, 1);
    this._updateConfig({ color_thresholds });
  }
  _updateColorThresholdAt(index, ct) {
    const color_thresholds = [...this._lineConfig.color_thresholds ?? []];
    color_thresholds[index] = ct;
    this._updateConfig({ color_thresholds });
  }
};
// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
InsightLineCardEditor.styles = [
  __superGet$2(InsightLineCardEditor, InsightLineCardEditor, "styles"),
  i$5`
            .entities-panel {
                padding: 8px 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .entities-toolbar {
                display: flex;
                align-items: flex-start;
                gap: 4px;
            }

            ha-tab-group {
                flex: 1;
            }

            ha-expansion-panel {
                margin-top: 4px;
            }

            .panel-content {
                padding: 8px 0;
            }

            .section-title {
                font-size: 0.8rem;
                font-weight: 500;
                /*color: var(--secondary-text-color);*/
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin: 8px 0px 16px 0px;
                padding: 8px 0px;
                border-bottom: 1px solid var(--divider-color, #e0e0e0);
            }

            .toggle-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
                gap: 8px;
                padding: 20px 0px;
            }

            .control-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 20px 0px;
            }

            .control-label {
                font-weight: 500;
            }

            ha-control-select {
                width: 100%;
            }

            .field-label {
                font-size: 0.875rem;
                color: var(--secondary-text-color);
                white-space: nowrap;
            }

            .color-swatch {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                padding: 2px;
                background: transparent;
                flex-shrink: 0;
            }

            .color-text {
                flex: 1;
            }

            .add-entity-btn {
                align-self: flex-start;
                margin-top: 4px;
            }

            .subsection-label {
                font-size: 0.8rem;
                font-weight: 500;
                color: var(--secondary-text-color);
                margin-bottom: 4px;
            }

            .overlay-row {
                display: flex;
                align-items: flex-start;
                gap: 4px;
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 6px;
                padding: 8px;
                margin-bottom: 6px;
            }

            .overlay-color-field {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                padding-top: 4px;
            }

            .overlay-row ha-form {
                flex: 1;
            }

            .layout-section {
                margin: 16px 0;
            }
        `
];
__decorateClass$4([
  r()
], InsightLineCardEditor.prototype, "_tabs", 2);
__decorateClass$4([
  r()
], InsightLineCardEditor.prototype, "_currTab", 2);
InsightLineCardEditor = __decorateClass$4([
  t$1("insight-line-card-editor")
], InsightLineCardEditor);

var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __getProtoOf$1 = Object.getPrototypeOf;
var __reflectGet$1 = Reflect.get;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __superGet$1 = (cls, obj, key) => __reflectGet$1(__getProtoOf$1(cls), key, obj);
function aggregateBuckets(values, method = "mean") {
  if (values.length === 0) return 0;
  if (method === "sum") return values.reduce((a, b) => a + b, 0);
  if (method === "min") return Math.min(...values);
  if (method === "max") return Math.max(...values);
  return values.reduce((a, b) => a + b, 0) / values.length;
}
function bucketKey(ts, groupBy = "day") {
  const d = new Date(ts);
  if (groupBy === "hour") {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
  }
  if (groupBy === "week") {
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return `${start.getFullYear()}-W${start.getDate()}`;
  }
  if (groupBy === "month") {
    return `${d.getFullYear()}-${d.getMonth()}`;
  }
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function bucketLabel(key, groupBy = "day") {
  const parts = key.split("-");
  if (groupBy === "hour") {
    return `${parts[3]}:00`;
  }
  if (groupBy === "week") {
    return key;
  }
  if (groupBy === "month") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[parseInt(parts[1], 10)] ?? key;
  }
  return `${parts[2]}.${(parseInt(parts[1], 10) + 1).toString().padStart(2, "0")}`;
}
let InsightBarCard = class extends InsightBaseCard {
  static getConfigElement() {
    return document.createElement("insight-bar-card-editor");
  }
  static getStubConfig(hass, entities, entitiesFallback) {
    const sensor = findNumericSensor(hass, entities, entitiesFallback);
    return {
      type: InsightBarCard.cardType,
      entities: [{ entity: sensor }],
      hours: 24,
      group_by: "hour",
      aggregate: "mean",
      layout: "grouped"
    };
  }
  getDefaultConfig() {
    return {
      hours: 168,
      group_by: "day",
      aggregate: "mean",
      layout: "grouped",
      update_interval: 60
    };
  }
  renderChart() {
    return b`
      <canvas
        class="bar-canvas"
        style="width:100%;height:250px"
      ></canvas>
    `;
  }
  updated(changedProps) {
    super.updated(changedProps);
    requestAnimationFrame(() => this._drawBars());
  }
  _drawBars() {
    const config = this._config;
    if (!config || this._loading || this._data.length === 0) return;
    const canvasEl = this.shadowRoot?.querySelector(".bar-canvas");
    if (!canvasEl) return;
    const dpr = window.devicePixelRatio ?? 1;
    const displayWidth = canvasEl.clientWidth || this._cardWidth - 32;
    const displayHeight = canvasEl.clientHeight || 250;
    canvasEl.width = displayWidth * dpr;
    canvasEl.height = displayHeight * dpr;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const dataChanged = this._data !== this._lastBarDataRef;
    const configChanged = config.group_by !== this._lastBarGroupBy || config.aggregate !== this._lastBarAggregate;
    let bars;
    let colors;
    if (!dataChanged && !configChanged && this._barCache) {
      ({ bars, colors } = this._barCache);
    } else {
      colors = generateColors(this._data.length);
      const bucketMap = /* @__PURE__ */ new Map();
      this._data.forEach((dataset, seriesIdx) => {
        for (const point of dataset.data) {
          const key = bucketKey(point.t, config.group_by);
          if (!bucketMap.has(key)) bucketMap.set(key, /* @__PURE__ */ new Map());
          const seriesMap = bucketMap.get(key);
          if (!seriesMap.has(seriesIdx)) seriesMap.set(seriesIdx, []);
          seriesMap.get(seriesIdx).push(point.v);
        }
      });
      const sortedKeys = Array.from(bucketMap.keys()).sort();
      bars = sortedKeys.map((key) => {
        const seriesMap = bucketMap.get(key);
        const values = this._data.map((_, i) => {
          const raw = seriesMap.get(i) ?? [];
          return aggregateBuckets(raw, config.aggregate);
        });
        return { label: bucketLabel(key, config.group_by), values, colors };
      });
      this._barCache = { bars, colors };
      this._lastBarDataRef = this._data;
      this._lastBarGroupBy = config.group_by;
      this._lastBarAggregate = config.aggregate;
    }
    if (bars.length === 0) return;
    const padding = { top: 16, right: 8, bottom: 36, left: 50 };
    const plotW = displayWidth - padding.left - padding.right;
    const plotH = displayHeight - padding.top - padding.bottom;
    let maxVal = 0;
    if (config.layout === "stacked") {
      for (const b of bars) {
        const sum = b.values.reduce((a, v) => a + v, 0);
        if (sum > maxVal) maxVal = sum;
      }
    } else {
      for (const b of bars) {
        for (const v of b.values) {
          if (v > maxVal) maxVal = v;
        }
      }
    }
    if (maxVal <= 0) return;
    const numSeries = this._data.length;
    const barGroupWidth = plotW / bars.length;
    const barPadding = barGroupWidth * 0.15;
    const groupInnerWidth = barGroupWidth - barPadding * 2;
    const textColor = this.isDarkTheme ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
    const gridColor = this.isDarkTheme ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
    ctx.font = "11px sans-serif";
    ctx.fillStyle = textColor;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const val = maxVal * i / ySteps;
      const y = padding.top + plotH - plotH * i / ySteps;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotW, y);
      ctx.stroke();
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(formatValue(val), padding.left - 4, y);
    }
    bars.forEach((bar, barIdx) => {
      const groupX = padding.left + barIdx * barGroupWidth + barPadding;
      if (config.layout === "stacked") {
        let yOffset = 0;
        bar.values.forEach((val, si) => {
          const barH = val / maxVal * plotH;
          const x = groupX;
          const y = padding.top + plotH - yOffset - barH;
          ctx.fillStyle = bar.colors[si];
          ctx.fillRect(x, y, groupInnerWidth, barH);
          yOffset += barH;
        });
      } else {
        const barW = groupInnerWidth / numSeries;
        bar.values.forEach((val, si) => {
          const barH = val / maxVal * plotH;
          const x = groupX + si * barW;
          const y = padding.top + plotH - barH;
          ctx.fillStyle = bar.colors[si];
          ctx.fillRect(x, y, barW * 0.85, barH);
        });
      }
      const labelX = padding.left + barIdx * barGroupWidth + barGroupWidth / 2;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = textColor;
      ctx.fillText(
        bar.label,
        labelX,
        padding.top + plotH + 6
      );
    });
  }
};
InsightBarCard.cardType = "custom:insight-bar-card";
InsightBarCard.cardName = "InsightChart Bar";
InsightBarCard.cardDescription = "Bar chart with grouping and aggregation";
InsightBarCard.styles = [
  __superGet$1(InsightBarCard, InsightBarCard, "styles"),
  i$5`
      .bar-canvas {
        display: block;
      }
    `
];
InsightBarCard = __decorateClass$3([
  t$1("insight-bar-card")
], InsightBarCard);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: InsightBarCard.cardType.replace("custom:", ""),
  name: InsightBarCard.cardName,
  description: InsightBarCard.cardDescription,
  preview: true
});

var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let InsightBarCardEditor = class extends InsightBaseEditor {
  renderCardOptions() {
    const cfg = this._config;
    const groupBy = cfg?.group_by ?? "day";
    const aggregate = cfg?.aggregate ?? "mean";
    const layout = cfg?.layout ?? "grouped";
    return b`
      <div class="section">
        <div class="section-header">Grouping</div>
        <div class="preset-buttons">
          ${["hour", "day", "week", "month"].map(
      (g) => b`
              <mwc-button
                class="preset-btn ${groupBy === g ? "active" : ""}"
                dense
                @click=${() => this._updateConfig({ group_by: g })}
              >${g}</mwc-button>
            `
    )}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Aggregation</div>
        <div class="preset-buttons">
          ${["mean", "sum", "min", "max"].map(
      (a) => b`
              <mwc-button
                class="preset-btn ${aggregate === a ? "active" : ""}"
                dense
                @click=${() => this._updateConfig({ aggregate: a })}
              >${a}</mwc-button>
            `
    )}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Layout</div>
        <div class="preset-buttons">
          ${["grouped", "stacked"].map(
      (l) => b`
              <mwc-button
                class="preset-btn ${layout === l ? "active" : ""}"
                dense
                @click=${() => this._updateConfig({ layout: l })}
              >${l}</mwc-button>
            `
    )}
        </div>
      </div>
    `;
  }
};
InsightBarCardEditor = __decorateClass$2([
  t$1("insight-bar-card-editor")
], InsightBarCardEditor);

var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getProtoOf = Object.getPrototypeOf;
var __reflectGet = Reflect.get;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
const PALETTES = {
  YlOrRd: [
    { position: 0, color: "#ffffcc" },
    { position: 0.25, color: "#fed976" },
    { position: 0.5, color: "#fd8d3c" },
    { position: 0.75, color: "#e31a1c" },
    { position: 1, color: "#800026" }
  ],
  Blues: [
    { position: 0, color: "#f7fbff" },
    { position: 0.5, color: "#6baed6" },
    { position: 1, color: "#08306b" }
  ],
  Greens: [
    { position: 0, color: "#f7fcf5" },
    { position: 0.5, color: "#74c476" },
    { position: 1, color: "#00441b" }
  ],
  RdBu: [
    { position: 0, color: "#d73027" },
    { position: 0.5, color: "#f7f7f7" },
    { position: 1, color: "#4575b4" }
  ]
};
function hexToRgb(hex) {
  const clean = hex.replace(/^#/, "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16)
  ];
}
function interpolateColor(stops, t) {
  if (stops.length === 0) return "#888";
  if (t <= 0) return stops[0].color;
  if (t >= 1) return stops[stops.length - 1].color;
  for (let i = 0; i < stops.length - 1; i++) {
    const lo = stops[i];
    const hi = stops[i + 1];
    if (t >= lo.position && t <= hi.position) {
      const range = hi.position - lo.position;
      const localT = range === 0 ? 0 : (t - lo.position) / range;
      const [r1, g1, b1] = hexToRgb(lo.color);
      const [r2, g2, b2] = hexToRgb(hi.color);
      const r = Math.round(r1 + (r2 - r1) * localT);
      const g = Math.round(g1 + (g2 - g1) * localT);
      const b = Math.round(b1 + (b2 - b1) * localT);
      return `rgb(${r},${g},${b})`;
    }
  }
  return stops[stops.length - 1].color;
}
function resolveColorScale(scale) {
  if (!scale) return PALETTES.YlOrRd;
  if (typeof scale === "string") return PALETTES[scale] ?? PALETTES.YlOrRd;
  return scale;
}
function buildHourDayGrid(data) {
  const daySet = /* @__PURE__ */ new Set();
  for (const p of data) {
    const d = new Date(p.t);
    daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  const days = Array.from(daySet).sort();
  const dayIndex = new Map(days.map((d, i) => [d, i]));
  const colLabels = days.map((d) => {
    const parts = d.split("-");
    return `${parts[2]}.${(parseInt(parts[1], 10) + 1).toString().padStart(2, "0")}`;
  });
  const rowLabels = Array.from(
    { length: 24 },
    (_, h) => h.toString().padStart(2, "0")
  );
  const sums = /* @__PURE__ */ new Map();
  for (const p of data) {
    const d = new Date(p.t);
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const key = `${d.getHours()}_${dayKey}`;
    const prev = sums.get(key) ?? { sum: 0, count: 0 };
    sums.set(key, { sum: prev.sum + p.v, count: prev.count + 1 });
  }
  const cells = [];
  for (const [key, { sum, count }] of sums) {
    const [hourStr, ...dayParts] = key.split("_");
    const dayKey = dayParts.join("_");
    const colIdx = dayIndex.get(dayKey) ?? -1;
    if (colIdx < 0) continue;
    cells.push({
      rowIdx: parseInt(hourStr, 10),
      colIdx,
      value: sum / count,
      count
    });
  }
  return { cells, rowLabels, colLabels };
}
function buildWeekdayHourGrid(data) {
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const rowLabels = DAY_NAMES;
  const colLabels = Array.from(
    { length: 24 },
    (_, h) => h.toString().padStart(2, "0")
  );
  const sums = /* @__PURE__ */ new Map();
  for (const p of data) {
    const d = new Date(p.t);
    const key = `${d.getDay()}_${d.getHours()}`;
    const prev = sums.get(key) ?? { sum: 0, count: 0 };
    sums.set(key, { sum: prev.sum + p.v, count: prev.count + 1 });
  }
  const cells = [];
  for (const [key, { sum, count }] of sums) {
    const [dayStr, hourStr] = key.split("_");
    cells.push({
      rowIdx: parseInt(dayStr, 10),
      colIdx: parseInt(hourStr, 10),
      value: sum / count,
      count
    });
  }
  return { cells, rowLabels, colLabels };
}
let InsightHeatmapCard = class extends InsightBaseCard {
  static getConfigElement() {
    return document.createElement("insight-heatmap-card-editor");
  }
  static getStubConfig(hass, entities, entitiesFallback) {
    const sensor = findNumericSensor(hass, entities, entitiesFallback);
    return {
      type: InsightHeatmapCard.cardType,
      entities: [{ entity: sensor }],
      hours: 168,
      color_scale: "YlOrRd",
      layout: "hour_day"
    };
  }
  getDefaultConfig() {
    return {
      hours: 168,
      color_scale: "YlOrRd",
      layout: "hour_day",
      update_interval: 60
    };
  }
  renderChart() {
    return b`
      <canvas
        class="heatmap-canvas"
        style="width:100%;height:250px"
      ></canvas>
    `;
  }
  updated(changedProps) {
    super.updated(changedProps);
    requestAnimationFrame(() => this._drawHeatmap());
  }
  _drawHeatmap() {
    const config = this._config;
    if (!config || this._loading || this._data.length === 0) return;
    const dataset = this._data[0];
    if (!dataset || dataset.data.length === 0) return;
    const canvasEl = this.shadowRoot?.querySelector(".heatmap-canvas");
    if (!canvasEl) return;
    const dpr = window.devicePixelRatio ?? 1;
    const displayWidth = canvasEl.clientWidth || this._cardWidth - 32;
    const displayHeight = canvasEl.clientHeight || 250;
    canvasEl.width = displayWidth * dpr;
    canvasEl.height = displayHeight * dpr;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const layout = config.layout ?? "hour_day";
    let cells;
    let rowLabels;
    let colLabels;
    const rawData = dataset.data;
    if (this._gridCache && rawData === this._lastHeatDataRef && layout === this._lastHeatLayout) {
      ({ cells, rowLabels, colLabels } = this._gridCache);
    } else {
      if (layout === "weekday_hour") {
        ({ cells, rowLabels, colLabels } = buildWeekdayHourGrid(rawData));
      } else {
        ({ cells, rowLabels, colLabels } = buildHourDayGrid(rawData));
      }
      this._gridCache = { cells, rowLabels, colLabels };
      this._lastHeatDataRef = rawData;
      this._lastHeatLayout = layout;
    }
    if (cells.length === 0) return;
    const colorStops = resolveColorScale(config.color_scale);
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const c of cells) {
      if (c.value < minVal) minVal = c.value;
      if (c.value > maxVal) maxVal = c.value;
    }
    const range = maxVal - minVal || 1;
    const labelW = 28;
    const labelH = 20;
    const padding = { top: labelH, right: 8, bottom: 8, left: labelW };
    const plotW = displayWidth - padding.left - padding.right;
    const plotH = displayHeight - padding.top - padding.bottom;
    const numCols = colLabels.length;
    const numRows = rowLabels.length;
    const cellW = plotW / numCols;
    const cellH = plotH / numRows;
    const textColor = this.isDarkTheme ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)";
    for (const cell of cells) {
      const t = (cell.value - minVal) / range;
      ctx.fillStyle = interpolateColor(colorStops, t);
      ctx.fillRect(
        padding.left + cell.colIdx * cellW,
        padding.top + cell.rowIdx * cellH,
        cellW - 1,
        cellH - 1
      );
    }
    ctx.font = "10px sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    const maxColLabels = Math.floor(plotW / 36);
    const colStep = Math.max(1, Math.floor(numCols / maxColLabels));
    for (let c = 0; c < numCols; c += colStep) {
      ctx.fillText(
        colLabels[c],
        padding.left + c * cellW + cellW / 2,
        padding.top - 3
      );
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let r = 0; r < numRows; r++) {
      ctx.fillText(
        rowLabels[r],
        padding.left - 4,
        padding.top + r * cellH + cellH / 2
      );
    }
  }
};
InsightHeatmapCard.cardType = "custom:insight-heatmap-card";
InsightHeatmapCard.cardName = "InsightChart Heatmap";
InsightHeatmapCard.cardDescription = "Heatmap visualisation of a sensor over time";
InsightHeatmapCard.styles = [
  __superGet(InsightHeatmapCard, InsightHeatmapCard, "styles"),
  i$5`
      .heatmap-canvas {
        display: block;
      }
    `
];
InsightHeatmapCard = __decorateClass$1([
  t$1("insight-heatmap-card")
], InsightHeatmapCard);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: InsightHeatmapCard.cardType.replace("custom:", ""),
  name: InsightHeatmapCard.cardName,
  description: InsightHeatmapCard.cardDescription,
  preview: true
});

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
let InsightHeatmapCardEditor = class extends InsightBaseEditor {
  renderCardOptions() {
    const cfg = this._config;
    const layout = cfg?.layout ?? "hour_day";
    const colorScale = cfg?.color_scale ?? "YlOrRd";
    return b`
      <div class="section">
        <div class="section-header">Layout</div>
        <div class="preset-buttons">
          ${["hour_day", "weekday_hour"].map(
      (l) => b`
              <mwc-button
                class="preset-btn ${layout === l ? "active" : ""}"
                dense
                @click=${() => this._updateConfig({ layout: l })}
              >${l.replace("_", " / ")}</mwc-button>
            `
    )}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Color scale</div>
        <div class="preset-buttons">
          ${["YlOrRd", "Blues", "Greens", "RdBu"].map(
      (c) => b`
              <mwc-button
                class="preset-btn ${colorScale === c ? "active" : ""}"
                dense
                @click=${() => this._updateConfig({ color_scale: c })}
              >${c}</mwc-button>
            `
    )}
        </div>
      </div>
    `;
  }
};
InsightHeatmapCardEditor = __decorateClass([
  t$1("insight-heatmap-card-editor")
], InsightHeatmapCardEditor);
//# sourceMappingURL=insight-card.js.map
