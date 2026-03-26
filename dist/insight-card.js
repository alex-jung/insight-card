var pkg_version="0.1.1";const t$3=globalThis,e$5=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$5=new WeakMap;let n$4=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e$5&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$5.set(s,t))}return t}toString(){return this.cssText}};const i$5=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$4(o,t,s$2)},c$2=e$5?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n$4("string"==typeof t?t:t+"",void 0,s$2))(e)})(t):t,{is:i$4,defineProperty:e$4,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$4,getPrototypeOf:n$3}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f$1=(t,s)=>!i$4(t,s),b$1={attribute:!0,type:String,converter:u$1,reflect:!1,useDefault:!1,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$4(this.prototype,t,h)}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t}};return{get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$3(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$4(t)];for(const i of s)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s))}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,o)=>{if(e$5)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,i){this._$AK(t,i)}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&!0===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null}}requestUpdate(t,s,i,e=!1,h){if(void 0!==t){const r=this.constructor;if(!1===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),!0!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),!0===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];!0!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e)}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");const t$2=globalThis,i$3=t=>t,s$1=t$2.trustedTypes,e$3=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$3=`lit$${Math.random().toFixed(9).slice(2)}$`,n$2="?"+o$3,r$2=`<${n$2}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_$1=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,b=(t=>(i,...s)=>({_$litType$:t,strings:i,values:s}))(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$3?e$3.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_$1:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_$1||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$3+x):s+o$3+(-2===d?i:x)}return[V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$3),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t)}else t.startsWith(o$3)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$3),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c())}}}else if(8===r.nodeType)if(r.data===n$2)d.push({type:2,index:l});else{let t=-1;for(;-1!==(t=r.data.indexOf(o$3,t+1));)d.push({type:7,index:l}),t+=o$3.length-1}l++}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M$1(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M$1(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,!0);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n]}o!==r?.index&&(h=P.nextNode(),o++)}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M$1(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>u(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else{const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){const s=i$3(t).nextSibling;i$3(t).remove(),t=s}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=M$1(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M$1(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r}o&&!e&&this.j(t)}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class I extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===A?void 0:t}}class L extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A)}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5}_$AI(t,i=this){if((t=M$1(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M$1(this,t)}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.2");const s=globalThis;let i$2=class extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{})}return h._$AI(t),h})(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};i$2._$litElement$=!0,i$2.finalized=!0,s.litElementHydrateSupport?.({LitElement:i$2});const o$2=s.litElementPolyfillSupport;o$2?.({LitElement:i$2}),(s.litElementVersions??=[]).push("4.2.2");const t$1=t=>(e,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},o$1={attribute:!0,type:String,converter:u$1,reflect:!1,hasChanged:f$1},r$1=(t=o$1,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(r.name,t),"accessor"===n){const{name:o}=r;return{set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,!0,r)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,!0,r)}}throw Error("Unsupported decorator location: "+n)};function n$1(t){return(e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}function r(r){return n$1({...r,state:!0,attribute:!1})}function e$1(e,r){return(n,s,i)=>((e,t,c)=>(c.configurable=!0,c.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,c),c))(n,s,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}const OFF="u-off",domEnv="undefined"!=typeof window,doc=domEnv?document:null,win=domEnv?window:null,nav=domEnv?navigator:null;let pxRatio,query;function addClass(el,c){if(null!=c){let cl=el.classList;!cl.contains(c)&&cl.add(c)}}function remClass(el,c){let cl=el.classList;cl.contains(c)&&cl.remove(c)}function setStylePx(el,name,value){el.style[name]=value+"px"}function placeTag(tag,cls,targ,refEl){let el=doc.createElement(tag);return null!=cls&&addClass(el,cls),null!=targ&&targ.insertBefore(el,refEl),el}function placeDiv(cls,targ){return placeTag("div",cls,targ)}const xformCache=new WeakMap;function elTrans(el,xPos,yPos,xMax,yMax){let xform="translate("+xPos+"px,"+yPos+"px)";xform!=xformCache.get(el)&&(el.style.transform=xform,xformCache.set(el,xform),xPos<0||yPos<0||xPos>xMax||yPos>yMax?addClass(el,OFF):remClass(el,OFF))}const colorCache=new WeakMap;function elColor(el,background,borderColor){let newColor=background+borderColor;newColor!=colorCache.get(el)&&(colorCache.set(el,newColor),el.style.background=background,el.style.borderColor=borderColor)}const sizeCache=new WeakMap;function elSize(el,newWid,newHgt,centered){let newSize=newWid+""+newHgt;newSize!=sizeCache.get(el)&&(sizeCache.set(el,newSize),el.style.height=newHgt+"px",el.style.width=newWid+"px",el.style.marginLeft=centered?-newWid/2+"px":0,el.style.marginTop=centered?-newHgt/2+"px":0)}const evOpts={passive:!0},evOpts2={...evOpts,capture:!0};function on(ev,el,cb,capt){el.addEventListener(ev,cb,capt?evOpts2:evOpts)}function off(ev,el,cb,capt){el.removeEventListener(ev,cb,evOpts)}function closestIdx(num,arr,lo,hi){let mid;lo=lo||0;let bitwise=(hi=hi||arr.length-1)<=2147483647;for(;hi-lo>1;)mid=bitwise?lo+hi>>1:floor((lo+hi)/2),arr[mid]<num?lo=mid:hi=mid;return num-arr[lo]<=arr[hi]-num?lo:hi}function makeIndexOfs(predicate){return(data,_i0,_i1)=>{let i0=-1,i1=-1;for(let i=_i0;i<=_i1;i++)if(predicate(data[i])){i0=i;break}for(let i=_i1;i>=_i0;i--)if(predicate(data[i])){i1=i;break}return[i0,i1]}}domEnv&&function setPxRatio(){let _pxRatio=devicePixelRatio;pxRatio!=_pxRatio&&(pxRatio=_pxRatio,query&&off("change",query,setPxRatio),query=matchMedia(`(min-resolution: ${pxRatio-.001}dppx) and (max-resolution: ${pxRatio+.001}dppx)`),on("change",query,setPxRatio),win.dispatchEvent(new CustomEvent("dppxchange")))}();const notNullish=v=>null!=v,isPositive=v=>null!=v&&v>0,nonNullIdxs=makeIndexOfs(notNullish),positiveIdxs=makeIndexOfs(isPositive);function rangeLog(min,max,base,fullMags){let minSign=sign(min),maxSign=sign(max);min==max&&(-1==minSign?(min*=base,max/=base):(min/=base,max*=base));let logFn=10==base?log10:log2,growMaxAbs=1==maxSign?ceil:floor,minExp=(1==minSign?floor:ceil)(logFn(abs(min))),maxExp=growMaxAbs(logFn(abs(max))),minIncr=pow(base,minExp),maxIncr=pow(base,maxExp);return 10==base&&(minExp<0&&(minIncr=roundDec(minIncr,-minExp)),maxExp<0&&(maxIncr=roundDec(maxIncr,-maxExp))),fullMags||2==base?(min=minIncr*minSign,max=maxIncr*maxSign):(min=incrRoundDn(min,minIncr),max=incrRoundUp(max,maxIncr)),[min,max]}function rangeAsinh(min,max,base,fullMags){let minMax=rangeLog(min,max,base,fullMags);return 0==min&&(minMax[0]=0),0==max&&(minMax[1]=0),minMax}const autoRangePart={mode:3,pad:.1},_eqRangePart={pad:0,soft:null,mode:0},_eqRange={min:_eqRangePart,max:_eqRangePart};function rangeNum(_min,_max,mult,extra){return isObj(mult)?_rangeNum(_min,_max,mult):(_eqRangePart.pad=mult,_eqRangePart.soft=extra?0:null,_eqRangePart.mode=extra?3:0,_rangeNum(_min,_max,_eqRange))}function ifNull(lh,rh){return null==lh?rh:lh}function _rangeNum(_min,_max,cfg){let cmin=cfg.min,cmax=cfg.max,padMin=ifNull(cmin.pad,0),padMax=ifNull(cmax.pad,0),hardMin=ifNull(cmin.hard,-inf),hardMax=ifNull(cmax.hard,inf),softMin=ifNull(cmin.soft,inf),softMax=ifNull(cmax.soft,-inf),softMinMode=ifNull(cmin.mode,0),softMaxMode=ifNull(cmax.mode,0),delta=_max-_min,deltaMag=log10(delta),scalarMax=max(abs(_min),abs(_max)),scalarMag=log10(scalarMax),scalarMagDelta=abs(scalarMag-deltaMag);(delta<1e-24||scalarMagDelta>10)&&(delta=0,0!=_min&&0!=_max||(delta=1e-24,2==softMinMode&&softMin!=inf&&(padMin=0),2==softMaxMode&&softMax!=-inf&&(padMax=0)));let nonZeroDelta=delta||scalarMax||1e3,mag=log10(nonZeroDelta),base=pow(10,floor(mag)),_newMin=roundDec(incrRoundDn(_min-nonZeroDelta*(0==delta?0==_min?.1:1:padMin),base/10),24),_softMin=_min>=softMin&&(1==softMinMode||3==softMinMode&&_newMin<=softMin||2==softMinMode&&_newMin>=softMin)?softMin:inf,minLim=max(hardMin,_newMin<_softMin&&_min>=_softMin?_softMin:min(_softMin,_newMin)),_newMax=roundDec(incrRoundUp(_max+nonZeroDelta*(0==delta?0==_max?.1:1:padMax),base/10),24),_softMax=_max<=softMax&&(1==softMaxMode||3==softMaxMode&&_newMax>=softMax||2==softMaxMode&&_newMax<=softMax)?softMax:-inf,maxLim=min(hardMax,_newMax>_softMax&&_max<=_softMax?_softMax:max(_softMax,_newMax));return minLim==maxLim&&0==minLim&&(maxLim=100),[minLim,maxLim]}const numFormatter=new Intl.NumberFormat(domEnv?nav.language:"en-US"),fmtNum=val=>numFormatter.format(val),M=Math,PI=M.PI,abs=M.abs,floor=M.floor,round=M.round,ceil=M.ceil,min=M.min,max=M.max,pow=M.pow,sign=M.sign,log10=M.log10,log2=M.log2,asinh=(v,linthresh=1)=>M.asinh(v/linthresh),inf=1/0;function numIntDigits(x){return 1+(0|log10((x^x>>31)-(x>>31)))}function clamp(num,_min,_max){return min(max(num,_min),_max)}function isFn(v){return"function"==typeof v}function fnOrSelf(v){return isFn(v)?v:()=>v}const retArg0=_0=>_0,retArg1=(_0,_1)=>_1,retNull=_=>null,retTrue=_=>!0,retEq=(a,b)=>a==b,regex6=/\.\d*?(?=9{6,}|0{6,})/gm,fixFloat=val=>{if(isInt(val)||fixedDec.has(val))return val;const str=`${val}`,match=str.match(regex6);if(null==match)return val;let len=match[0].length-1;if(-1!=str.indexOf("e-")){let[num,exp]=str.split("e");return+`${fixFloat(num)}e${exp}`}return roundDec(val,len)};function incrRound(num,incr){return fixFloat(roundDec(fixFloat(num/incr))*incr)}function incrRoundUp(num,incr){return fixFloat(ceil(fixFloat(num/incr))*incr)}function incrRoundDn(num,incr){return fixFloat(floor(fixFloat(num/incr))*incr)}function roundDec(val,dec=0){if(isInt(val))return val;let p=10**dec,n=val*p*(1+Number.EPSILON);return round(n)/p}const fixedDec=new Map;function guessDec(num){return((""+num).split(".")[1]||"").length}function genIncrs(base,minExp,maxExp,mults){let incrs=[],multDec=mults.map(guessDec);for(let exp=minExp;exp<maxExp;exp++){let expa=abs(exp),mag=roundDec(pow(base,exp),expa);for(let i=0;i<mults.length;i++){let _incr=10==base?+`${mults[i]}e${exp}`:mults[i]*mag,dec=(exp>=0?0:expa)+(exp>=multDec[i]?0:multDec[i]),incr=10==base?_incr:roundDec(_incr,dec);incrs.push(incr),fixedDec.set(incr,dec)}}return incrs}const EMPTY_OBJ={},EMPTY_ARR=[],nullNullTuple=[null,null],isArr=Array.isArray,isInt=Number.isInteger;function isStr(v){return"string"==typeof v}function isObj(v){let is=!1;if(null!=v){let c=v.constructor;is=null==c||c==Object}return is}function fastIsObj(v){return null!=v&&"object"==typeof v}const TypedArray=Object.getPrototypeOf(Uint8Array);function copy(o,_isObj=isObj){let out;if(isArr(o)){let val=o.find(v=>null!=v);if(isArr(val)||_isObj(val)){out=Array(o.length);for(let i=0;i<o.length;i++)out[i]=copy(o[i],_isObj)}else out=o.slice()}else if(o instanceof TypedArray)out=o.slice();else if(_isObj(o)){out={};for(let k in o)"__proto__"!=k&&(out[k]=copy(o[k],_isObj))}else out=o;return out}function assign(targ){let args=arguments;for(let i=1;i<args.length;i++){let src=args[i];for(let key in src)"__proto__"!=key&&(isObj(targ[key])?assign(targ[key],copy(src[key])):targ[key]=copy(src[key]))}return targ}function nullExpand(yVals,nullIdxs,alignedLen){for(let xi,i=0,lastNullIdx=-1;i<nullIdxs.length;i++){let nullIdx=nullIdxs[i];if(nullIdx>lastNullIdx){for(xi=nullIdx-1;xi>=0&&null==yVals[xi];)yVals[xi--]=null;for(xi=nullIdx+1;xi<alignedLen&&null==yVals[xi];)yVals[lastNullIdx=xi++]=null}}}const microTask="undefined"==typeof queueMicrotask?fn=>Promise.resolve().then(fn):queueMicrotask;const months=["January","February","March","April","May","June","July","August","September","October","November","December"],days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function slice3(str){return str.slice(0,3)}const days3=days.map(slice3),months3=months.map(slice3),engNames={MMMM:months,MMM:months3,WWWW:days,WWW:days3};function zeroPad2(int){return(int<10?"0":"")+int}const subs={YYYY:d=>d.getFullYear(),YY:d=>(d.getFullYear()+"").slice(2),MMMM:(d,names)=>names.MMMM[d.getMonth()],MMM:(d,names)=>names.MMM[d.getMonth()],MM:d=>zeroPad2(d.getMonth()+1),M:d=>d.getMonth()+1,DD:d=>zeroPad2(d.getDate()),D:d=>d.getDate(),WWWW:(d,names)=>names.WWWW[d.getDay()],WWW:(d,names)=>names.WWW[d.getDay()],HH:d=>zeroPad2(d.getHours()),H:d=>d.getHours(),h:d=>{let h=d.getHours();return 0==h?12:h>12?h-12:h},AA:d=>d.getHours()>=12?"PM":"AM",aa:d=>d.getHours()>=12?"pm":"am",a:d=>d.getHours()>=12?"p":"a",mm:d=>zeroPad2(d.getMinutes()),m:d=>d.getMinutes(),ss:d=>zeroPad2(d.getSeconds()),s:d=>d.getSeconds(),fff:d=>{return((int=d.getMilliseconds())<10?"00":int<100?"0":"")+int;var int}};function fmtDate(tpl,names){names=names||engNames;let m,parts=[],R=/\{([a-z]+)\}|[^{]+/gi;for(;m=R.exec(tpl);)parts.push("{"==m[0][0]?subs[m[1]]:m[0]);return d=>{let out="";for(let i=0;i<parts.length;i++)out+="string"==typeof parts[i]?parts[i]:parts[i](d,names);return out}}const localTz=(new Intl.DateTimeFormat).resolvedOptions().timeZone;const onlyWhole=v=>v%1==0,allMults=[1,2,2.5,5],decIncrs=genIncrs(10,-32,0,allMults),oneIncrs=genIncrs(10,0,32,allMults),wholeIncrs=oneIncrs.filter(onlyWhole),numIncrs=decIncrs.concat(oneIncrs),md="{M}/{D}",NLmd="\n"+md,NLmdyy=NLmd+"/{YY}",hmmaa="{h}:{mm}{aa}",NLhmmaa="\n"+hmmaa,_=null;function genTimeStuffs(ms){let s=1e3*ms,m=60*s,h=60*m,d=24*h,mo=30*d,y=365*d;return[(1==ms?genIncrs(10,0,3,allMults).filter(onlyWhole):genIncrs(10,-3,0,allMults)).concat([s,5*s,10*s,15*s,30*s,m,5*m,10*m,15*m,30*m,h,2*h,3*h,4*h,6*h,8*h,12*h,d,2*d,3*d,4*d,5*d,6*d,7*d,8*d,9*d,10*d,15*d,mo,2*mo,3*mo,4*mo,6*mo,y,2*y,5*y,10*y,25*y,50*y,100*y]),[[y,"{YYYY}",_,_,_,_,_,_,1],[28*d,"{MMM}","\n{YYYY}",_,_,_,_,_,1],[d,md,"\n{YYYY}",_,_,_,_,_,1],[h,"{h}{aa}",NLmdyy,_,NLmd,_,_,_,1],[m,hmmaa,NLmdyy,_,NLmd,_,_,_,1],[s,":{ss}",NLmdyy+" "+hmmaa,_,NLmd+" "+hmmaa,_,NLhmmaa,_,1],[ms,":{ss}.{fff}",NLmdyy+" "+hmmaa,_,NLmd+" "+hmmaa,_,NLhmmaa,_,1]],function(tzDate){return(self,axisIdx,scaleMin,scaleMax,foundIncr,foundSpace)=>{let splits=[],isYr=foundIncr>=y,isMo=foundIncr>=mo&&foundIncr<y,minDate=tzDate(scaleMin),minDateTs=roundDec(minDate*ms,3),minMin=mkDate(minDate.getFullYear(),isYr?0:minDate.getMonth(),isMo||isYr?1:minDate.getDate()),minMinTs=roundDec(minMin*ms,3);if(isMo||isYr){let moIncr=isMo?foundIncr/mo:0,yrIncr=isYr?foundIncr/y:0,split=minDateTs==minMinTs?minDateTs:roundDec(mkDate(minMin.getFullYear()+yrIncr,minMin.getMonth()+moIncr,1)*ms,3),splitDate=new Date(round(split/ms)),baseYear=splitDate.getFullYear(),baseMonth=splitDate.getMonth();for(let i=0;split<=scaleMax;i++){let next=mkDate(baseYear+yrIncr*i,baseMonth+moIncr*i,1),offs=next-tzDate(roundDec(next*ms,3));split=roundDec((+next+offs)*ms,3),split<=scaleMax&&splits.push(split)}}else{let incr0=foundIncr>=d?d:foundIncr,split=minMinTs+(floor(scaleMin)-floor(minDateTs))+incrRoundUp(minDateTs-minMinTs,incr0);splits.push(split);let date0=tzDate(split),prevHour=date0.getHours()+date0.getMinutes()/m+date0.getSeconds()/h,incrHours=foundIncr/h,pctSpace=foundSpace/self.axes[axisIdx]._space;for(;split=roundDec(split+foundIncr,1==ms?0:3),!(split>scaleMax);)if(incrHours>1){let expectedHour=floor(roundDec(prevHour+incrHours,6))%24,dstShift=tzDate(split).getHours()-expectedHour;dstShift>1&&(dstShift=-1),split-=dstShift*h,prevHour=(prevHour+incrHours)%24,roundDec((split-splits[splits.length-1])/foundIncr,3)*pctSpace>=.7&&splits.push(split)}else splits.push(split)}return splits}}]}const[timeIncrsMs,_timeAxisStampsMs,timeAxisSplitsMs]=genTimeStuffs(1),[timeIncrsS,_timeAxisStampsS,timeAxisSplitsS]=genTimeStuffs(.001);function timeAxisStamps(stampCfg,fmtDate){return stampCfg.map(s=>s.map((v,i)=>0==i||8==i||null==v?v:fmtDate(1==i||0==s[8]?v:s[1]+v)))}function timeAxisVals(tzDate,stamps){return(self,splits,axisIdx,foundSpace,foundIncr)=>{let prevYear,prevMnth,prevDate,prevHour,prevMins,prevSecs,s=stamps.find(s=>foundIncr>=s[0])||stamps[stamps.length-1];return splits.map(split=>{let date=tzDate(split),newYear=date.getFullYear(),newMnth=date.getMonth(),newDate=date.getDate(),newHour=date.getHours(),newMins=date.getMinutes(),newSecs=date.getSeconds(),stamp=newYear!=prevYear&&s[2]||newMnth!=prevMnth&&s[3]||newDate!=prevDate&&s[4]||newHour!=prevHour&&s[5]||newMins!=prevMins&&s[6]||newSecs!=prevSecs&&s[7]||s[1];return prevYear=newYear,prevMnth=newMnth,prevDate=newDate,prevHour=newHour,prevMins=newMins,prevSecs=newSecs,stamp(date)})}}function mkDate(y,m,d){return new Date(y,m,d)}function timeSeriesStamp(stampCfg,fmtDate){return fmtDate(stampCfg)}genIncrs(2,-53,53,[1]);function timeSeriesVal(tzDate,stamp){return(self,val,seriesIdx,dataIdx)=>null==dataIdx?"--":stamp(tzDate(val))}const legendOpts={show:!0,live:!0,isolate:!1,mount:()=>{},markers:{show:!0,width:2,stroke:function(self,seriesIdx){let s=self.series[seriesIdx];return s.width?s.stroke(self,seriesIdx):s.points.width?s.points.stroke(self,seriesIdx):null},fill:function(self,seriesIdx){return self.series[seriesIdx].fill(self,seriesIdx)},dash:"solid"},idx:null,idxs:null,values:[]};const moveTuple=[0,0];function filtBtn0(self,targ,handle,onlyTarg=!0){return e=>{0==e.button&&(!onlyTarg||e.target==targ)&&handle(e)}}function filtTarg(self,targ,handle,onlyTarg=!0){return e=>{(!onlyTarg||e.target==targ)&&handle(e)}}const cursorOpts={show:!0,x:!0,y:!0,lock:!1,move:function(self,mouseLeft1,mouseTop1){return moveTuple[0]=mouseLeft1,moveTuple[1]=mouseTop1,moveTuple},points:{one:!1,show:function(self,si){let o=self.cursor.points,pt=placeDiv(),size=o.size(self,si);setStylePx(pt,"width",size),setStylePx(pt,"height",size);let mar=size/-2;setStylePx(pt,"marginLeft",mar),setStylePx(pt,"marginTop",mar);let width=o.width(self,si,size);return width&&setStylePx(pt,"borderWidth",width),pt},size:function(self,si){return self.series[si].points.size},width:0,stroke:function(self,si){let sp=self.series[si].points;return sp._stroke||sp._fill},fill:function(self,si){let sp=self.series[si].points;return sp._fill||sp._stroke}},bind:{mousedown:filtBtn0,mouseup:filtBtn0,click:filtBtn0,dblclick:filtBtn0,mousemove:filtTarg,mouseleave:filtTarg,mouseenter:filtTarg},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(self,e)=>{e.stopPropagation(),e.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(self,seriesIdx,dataIdx,valPos,curPos)=>valPos-curPos,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},axisLines={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},grid=assign({},axisLines,{filter:retArg1}),ticks=assign({},grid,{size:10}),border=assign({},axisLines,{show:!1}),font='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',labelFont="bold "+font,xAxisOpts={show:!0,scale:"x",stroke:"#000",space:50,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:labelFont,side:2,grid:grid,ticks:ticks,border:border,font:font,lineGap:1.5,rotate:0},xSeriesOpts={show:!0,scale:"x",auto:!1,sorted:1,min:inf,max:-inf,idxs:[]};function numAxisVals(self,splits,axisIdx,foundSpace,foundIncr){return splits.map(v=>null==v?"":fmtNum(v))}function numAxisSplits(self,axisIdx,scaleMin,scaleMax,foundIncr,foundSpace,forceMin){let splits=[],numDec=fixedDec.get(foundIncr)||0;for(let val=scaleMin=forceMin?scaleMin:roundDec(incrRoundUp(scaleMin,foundIncr),numDec);val<=scaleMax;val=roundDec(val+foundIncr,numDec))splits.push(Object.is(val,-0)?0:val);return splits}function logAxisSplits(self,axisIdx,scaleMin,scaleMax,foundIncr,foundSpace,forceMin){const splits=[],logBase=self.scales[self.axes[axisIdx].scale].log,exp=floor((10==logBase?log10:log2)(scaleMin));foundIncr=pow(logBase,exp),10==logBase&&(foundIncr=numIncrs[closestIdx(foundIncr,numIncrs)]);let split=scaleMin,nextMagIncr=foundIncr*logBase;10==logBase&&(nextMagIncr=numIncrs[closestIdx(nextMagIncr,numIncrs)]);do{splits.push(split),split+=foundIncr,10!=logBase||fixedDec.has(split)||(split=roundDec(split,fixedDec.get(foundIncr))),split>=nextMagIncr&&(nextMagIncr=(foundIncr=split)*logBase,10==logBase&&(nextMagIncr=numIncrs[closestIdx(nextMagIncr,numIncrs)]))}while(split<=scaleMax);return splits}function asinhAxisSplits(self,axisIdx,scaleMin,scaleMax,foundIncr,foundSpace,forceMin){let linthresh=self.scales[self.axes[axisIdx].scale].asinh,posSplits=scaleMax>linthresh?logAxisSplits(self,axisIdx,max(linthresh,scaleMin),scaleMax,foundIncr):[linthresh],zero=scaleMax>=0&&scaleMin<=0?[0]:[];return(scaleMin<-linthresh?logAxisSplits(self,axisIdx,max(linthresh,-scaleMax),-scaleMin,foundIncr):[linthresh]).reverse().map(v=>-v).concat(zero,posSplits)}const RE_ALL=/./,RE_12357=/[12357]/,RE_125=/[125]/,RE_1=/1/,_filt=(splits,distr,re,keepMod)=>splits.map((v,i)=>4==distr&&0==v||i%keepMod==0&&re.test(v.toExponential()[v<0?1:0])?v:null);function log10AxisValsFilt(self,splits,axisIdx,foundSpace,foundIncr){let axis=self.axes[axisIdx],scaleKey=axis.scale,sc=self.scales[scaleKey],valToPos=self.valToPos,minSpace=axis._space,_10=valToPos(10,scaleKey),re=valToPos(9,scaleKey)-_10>=minSpace?RE_ALL:valToPos(7,scaleKey)-_10>=minSpace?RE_12357:valToPos(5,scaleKey)-_10>=minSpace?RE_125:RE_1;if(re==RE_1){let magSpace=abs(valToPos(1,scaleKey)-_10);if(magSpace<minSpace)return _filt(splits.slice().reverse(),sc.distr,re,ceil(minSpace/magSpace)).reverse()}return _filt(splits,sc.distr,re,1)}function log2AxisValsFilt(self,splits,axisIdx,foundSpace,foundIncr){let axis=self.axes[axisIdx],scaleKey=axis.scale,minSpace=axis._space,valToPos=self.valToPos,magSpace=abs(valToPos(1,scaleKey)-valToPos(2,scaleKey));return magSpace<minSpace?_filt(splits.slice().reverse(),3,RE_ALL,ceil(minSpace/magSpace)).reverse():splits}function numSeriesVal(self,val,seriesIdx,dataIdx){return null==dataIdx?"--":null==val?"":fmtNum(val)}const yAxisOpts={show:!0,scale:"y",stroke:"#000",space:30,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:labelFont,side:3,grid:grid,ticks:ticks,border:border,font:font,lineGap:1.5,rotate:0};const facet={scale:null,auto:!0,sorted:0,min:inf,max:-inf},gaps=(self,seriesIdx,idx0,idx1,nullGaps)=>nullGaps,xySeriesOpts={show:!0,auto:!0,sorted:0,gaps:gaps,alpha:1,facets:[assign({},facet,{scale:"x"}),assign({},facet,{scale:"y"})]},ySeriesOpts={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:gaps,alpha:1,points:{show:function(self,si){let{scale:scale,idxs:idxs}=self.series[0],xData=self._data[0],p0=self.valToPos(xData[idxs[0]],scale,!0),p1=self.valToPos(xData[idxs[1]],scale,!0),maxPts=abs(p1-p0)/(self.series[si].points.space*pxRatio);return idxs[1]-idxs[0]<=maxPts},filter:null},values:null,min:inf,max:-inf,idxs:[],path:null,clip:null};function clampScale(self,val,scaleMin,scaleMax,scaleKey){return scaleMin/10}const xScaleOpts={time:!0,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},yScaleOpts=assign({},xScaleOpts,{time:!1,ori:1}),syncs={};function _sync(key,opts){let s=syncs[key];return s||(s={key:key,plots:[],sub(plot){s.plots.push(plot)},unsub(plot){s.plots=s.plots.filter(c=>c!=plot)},pub(type,self,x,y,w,h,i){for(let j=0;j<s.plots.length;j++)s.plots[j]!=self&&s.plots[j].pub(type,self,x,y,w,h,i)}},null!=key&&(syncs[key]=s)),s}function orient(u,seriesIdx,cb){const mode=u.mode,series=u.series[seriesIdx],data=2==mode?u._data[seriesIdx]:u._data,scales=u.scales,bbox=u.bbox;let dx=data[0],dy=2==mode?data[1]:data[seriesIdx],sx=2==mode?scales[series.facets[0].scale]:scales[u.series[0].scale],sy=2==mode?scales[series.facets[1].scale]:scales[series.scale],l=bbox.left,t=bbox.top,w=bbox.width,h=bbox.height,H=u.valToPosH,V=u.valToPosV;return 0==sx.ori?cb(series,dx,dy,sx,sy,H,V,l,t,w,h,moveToH,lineToH,rectH,arcH,bezierCurveToH):cb(series,dx,dy,sx,sy,V,H,t,l,h,w,moveToV,lineToV,rectV,arcV,bezierCurveToV)}function bandFillClipDirs(self,seriesIdx){let fillDir=0,clipDirs=0,bands=ifNull(self.bands,EMPTY_ARR);for(let i=0;i<bands.length;i++){let b=bands[i];b.series[0]==seriesIdx?fillDir=b.dir:b.series[1]==seriesIdx&&(1==b.dir?clipDirs|=1:clipDirs|=2)}return[fillDir,1==clipDirs?-1:2==clipDirs?1:3==clipDirs?2:0]}function seriesFillTo(self,seriesIdx,dataMin,dataMax,bandFillDir){let mode=self.mode,series=self.series[seriesIdx],scaleKey=2==mode?series.facets[1].scale:series.scale,scale=self.scales[scaleKey];return-1==bandFillDir?scale.min:1==bandFillDir?scale.max:3==scale.distr?1==scale.dir?scale.min:scale.max:0}function clipBandLine(self,seriesIdx,idx0,idx1,strokePath,clipDir){return orient(self,seriesIdx,(series,dataX,dataY,scaleX,scaleY,valToPosX,valToPosY,xOff,yOff,xDim,yDim)=>{let pxRound=series.pxRound;const dir=scaleX.dir*(0==scaleX.ori?1:-1),lineTo=0==scaleX.ori?lineToH:lineToV;let frIdx,toIdx;1==dir?(frIdx=idx0,toIdx=idx1):(frIdx=idx1,toIdx=idx0);let x0=pxRound(valToPosX(dataX[frIdx],scaleX,xDim,xOff)),y0=pxRound(valToPosY(dataY[frIdx],scaleY,yDim,yOff)),x1=pxRound(valToPosX(dataX[toIdx],scaleX,xDim,xOff)),yLimit=pxRound(valToPosY(1==clipDir?scaleY.max:scaleY.min,scaleY,yDim,yOff)),clip=new Path2D(strokePath);return lineTo(clip,x1,yLimit),lineTo(clip,x0,yLimit),lineTo(clip,x0,y0),clip})}function clipGaps(gaps,ori,plotLft,plotTop,plotWid,plotHgt){let clip=null;if(gaps.length>0){clip=new Path2D;const rect=0==ori?rectH:rectV;let prevGapEnd=plotLft;for(let i=0;i<gaps.length;i++){let g=gaps[i];if(g[1]>g[0]){let w=g[0]-prevGapEnd;w>0&&rect(clip,prevGapEnd,plotTop,w,plotTop+plotHgt),prevGapEnd=g[1]}}let w=plotLft+plotWid-prevGapEnd,maxStrokeWidth=10;w>0&&rect(clip,prevGapEnd,plotTop-maxStrokeWidth/2,w,plotTop+plotHgt+maxStrokeWidth)}return clip}function findGaps(xs,ys,idx0,idx1,dir,pixelForX,align){let gaps=[],len=xs.length;for(let i=1==dir?idx0:idx1;i>=idx0&&i<=idx1;i+=dir){if(null===ys[i]){let fr=i,to=i;if(1==dir)for(;++i<=idx1&&null===ys[i];)to=i;else for(;--i>=idx0&&null===ys[i];)to=i;let frPx=pixelForX(xs[fr]),toPx=to==fr?frPx:pixelForX(xs[to]),fri2=fr-dir;frPx=align<=0&&fri2>=0&&fri2<len?pixelForX(xs[fri2]):frPx;let toi2=to+dir;toPx=align>=0&&toi2>=0&&toi2<len?pixelForX(xs[toi2]):toPx,toPx>=frPx&&gaps.push([frPx,toPx])}}return gaps}function pxRoundGen(pxAlign){return 0==pxAlign?retArg0:1==pxAlign?round:v=>incrRound(v,pxAlign)}function rect(ori){let moveTo=0==ori?moveToH:moveToV,arcTo=0==ori?(p,x1,y1,x2,y2,r)=>{p.arcTo(x1,y1,x2,y2,r)}:(p,y1,x1,y2,x2,r)=>{p.arcTo(x1,y1,x2,y2,r)},rect=0==ori?(p,x,y,w,h)=>{p.rect(x,y,w,h)}:(p,y,x,h,w)=>{p.rect(x,y,w,h)};return(p,x,y,w,h,endRad=0,baseRad=0)=>{0==endRad&&0==baseRad?rect(p,x,y,w,h):(endRad=min(endRad,w/2,h/2),baseRad=min(baseRad,w/2,h/2),moveTo(p,x+endRad,y),arcTo(p,x+w,y,x+w,y+h,endRad),arcTo(p,x+w,y+h,x,y+h,baseRad),arcTo(p,x,y+h,x,y,baseRad),arcTo(p,x,y,x+w,y,endRad),p.closePath())}}const moveToH=(p,x,y)=>{p.moveTo(x,y)},moveToV=(p,y,x)=>{p.moveTo(x,y)},lineToH=(p,x,y)=>{p.lineTo(x,y)},lineToV=(p,y,x)=>{p.lineTo(x,y)},rectH=rect(0),rectV=rect(1),arcH=(p,x,y,r,startAngle,endAngle)=>{p.arc(x,y,r,startAngle,endAngle)},arcV=(p,y,x,r,startAngle,endAngle)=>{p.arc(x,y,r,startAngle,endAngle)},bezierCurveToH=(p,bp1x,bp1y,bp2x,bp2y,p2x,p2y)=>{p.bezierCurveTo(bp1x,bp1y,bp2x,bp2y,p2x,p2y)},bezierCurveToV=(p,bp1y,bp1x,bp2y,bp2x,p2y,p2x)=>{p.bezierCurveTo(bp1x,bp1y,bp2x,bp2y,p2x,p2y)};function points(opts){return(u,seriesIdx,idx0,idx1,filtIdxs)=>orient(u,seriesIdx,(series,dataX,dataY,scaleX,scaleY,valToPosX,valToPosY,xOff,yOff,xDim,yDim)=>{let moveTo,arc,{pxRound:pxRound,points:points}=series;0==scaleX.ori?(moveTo=moveToH,arc=arcH):(moveTo=moveToV,arc=arcV);const width=roundDec(points.width*pxRatio,3);let rad=(points.size-points.width)/2*pxRatio,dia=roundDec(2*rad,3),fill=new Path2D,clip=new Path2D,{left:lft,top:top,width:wid,height:hgt}=u.bbox;rectH(clip,lft-dia,top-dia,wid+2*dia,hgt+2*dia);const drawPoint=pi=>{if(null!=dataY[pi]){let x=pxRound(valToPosX(dataX[pi],scaleX,xDim,xOff)),y=pxRound(valToPosY(dataY[pi],scaleY,yDim,yOff));moveTo(fill,x+rad,y),arc(fill,x,y,rad,0,2*PI)}};if(filtIdxs)filtIdxs.forEach(drawPoint);else for(let pi=idx0;pi<=idx1;pi++)drawPoint(pi);return{stroke:width>0?fill:null,fill:fill,clip:clip,flags:3}})}function _drawAcc(lineTo){return(stroke,accX,minY,maxY,inY,outY)=>{minY!=maxY&&(inY!=minY&&outY!=minY&&lineTo(stroke,accX,minY),inY!=maxY&&outY!=maxY&&lineTo(stroke,accX,maxY),lineTo(stroke,accX,outY))}}const drawAccH=_drawAcc(lineToH),drawAccV=_drawAcc(lineToV);function linear(opts){const alignGaps=ifNull(opts?.alignGaps,0);return(u,seriesIdx,idx0,idx1)=>orient(u,seriesIdx,(series,dataX,dataY,scaleX,scaleY,valToPosX,valToPosY,xOff,yOff,xDim,yDim)=>{[idx0,idx1]=nonNullIdxs(dataY,idx0,idx1);let lineTo,drawAcc,pxRound=series.pxRound,pixelForX=val=>pxRound(valToPosX(val,scaleX,xDim,xOff)),pixelForY=val=>pxRound(valToPosY(val,scaleY,yDim,yOff));0==scaleX.ori?(lineTo=lineToH,drawAcc=drawAccH):(lineTo=lineToV,drawAcc=drawAccV);const dir=scaleX.dir*(0==scaleX.ori?1:-1),_paths={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},stroke=_paths.stroke;let hasGap=!1;if(idx1-idx0>=4*xDim){let inY,outY,drawnAtX,xForPixel=pos=>u.posToVal(pos,scaleX.key,!0),minY=null,maxY=null,accX=pixelForX(dataX[1==dir?idx0:idx1]),idx0px=pixelForX(dataX[idx0]),idx1px=pixelForX(dataX[idx1]),nextAccXVal=xForPixel(1==dir?idx0px+1:idx1px-1);for(let i=1==dir?idx0:idx1;i>=idx0&&i<=idx1;i+=dir){let xVal=dataX[i],x=(1==dir?xVal<nextAccXVal:xVal>nextAccXVal)?accX:pixelForX(xVal),yVal=dataY[i];x==accX?null!=yVal?(outY=yVal,null==minY?(lineTo(stroke,x,pixelForY(outY)),inY=minY=maxY=outY):outY<minY?minY=outY:outY>maxY&&(maxY=outY)):null===yVal&&(hasGap=!0):(null!=minY&&drawAcc(stroke,accX,pixelForY(minY),pixelForY(maxY),pixelForY(inY),pixelForY(outY)),null!=yVal?(outY=yVal,lineTo(stroke,x,pixelForY(outY)),minY=maxY=inY=outY):(minY=maxY=null,null===yVal&&(hasGap=!0)),accX=x,nextAccXVal=xForPixel(accX+dir))}null!=minY&&minY!=maxY&&drawnAtX!=accX&&drawAcc(stroke,accX,pixelForY(minY),pixelForY(maxY),pixelForY(inY),pixelForY(outY))}else for(let i=1==dir?idx0:idx1;i>=idx0&&i<=idx1;i+=dir){let yVal=dataY[i];null===yVal?hasGap=!0:null!=yVal&&lineTo(stroke,pixelForX(dataX[i]),pixelForY(yVal))}let[bandFillDir,bandClipDir]=bandFillClipDirs(u,seriesIdx);if(null!=series.fill||0!=bandFillDir){let fill=_paths.fill=new Path2D(stroke),fillToY=pixelForY(series.fillTo(u,seriesIdx,series.min,series.max,bandFillDir)),frX=pixelForX(dataX[idx0]),toX=pixelForX(dataX[idx1]);-1==dir&&([toX,frX]=[frX,toX]),lineTo(fill,toX,fillToY),lineTo(fill,frX,fillToY)}if(!series.spanGaps){let gaps=[];hasGap&&gaps.push(...findGaps(dataX,dataY,idx0,idx1,dir,pixelForX,alignGaps)),_paths.gaps=gaps=series.gaps(u,seriesIdx,idx0,idx1,gaps),_paths.clip=clipGaps(gaps,scaleX.ori,xOff,yOff,xDim,yDim)}return 0!=bandClipDir&&(_paths.band=2==bandClipDir?[clipBandLine(u,seriesIdx,idx0,idx1,stroke,-1),clipBandLine(u,seriesIdx,idx0,idx1,stroke,1)]:clipBandLine(u,seriesIdx,idx0,idx1,stroke,bandClipDir)),_paths})}function findColWidth(dataX,dataY,valToPosX,scaleX,xDim,xOff,colWid=inf){if(dataX.length>1){let prevIdx=null;for(let i=0,minDelta=1/0;i<dataX.length;i++)if(void 0!==dataY[i]){if(null!=prevIdx){let delta=abs(dataX[i]-dataX[prevIdx]);delta<minDelta&&(minDelta=delta,colWid=abs(valToPosX(dataX[i],scaleX,xDim,xOff)-valToPosX(dataX[prevIdx],scaleX,xDim,xOff)))}prevIdx=i}}return colWid}function _monotoneCubic(xs,ys,moveTo,lineTo,bezierCurveTo,pxRound){const n=xs.length;if(n<2)return null;const path=new Path2D;if(moveTo(path,xs[0],ys[0]),2==n)lineTo(path,xs[1],ys[1]);else{let ms=Array(n),ds=Array(n-1),dys=Array(n-1),dxs=Array(n-1);for(let i=0;i<n-1;i++)dys[i]=ys[i+1]-ys[i],dxs[i]=xs[i+1]-xs[i],ds[i]=dys[i]/dxs[i];ms[0]=ds[0];for(let i=1;i<n-1;i++)0===ds[i]||0===ds[i-1]||ds[i-1]>0!=ds[i]>0?ms[i]=0:(ms[i]=3*(dxs[i-1]+dxs[i])/((2*dxs[i]+dxs[i-1])/ds[i-1]+(dxs[i]+2*dxs[i-1])/ds[i]),isFinite(ms[i])||(ms[i]=0));ms[n-1]=ds[n-2];for(let i=0;i<n-1;i++)bezierCurveTo(path,xs[i]+dxs[i]/3,ys[i]+ms[i]*dxs[i]/3,xs[i+1]-dxs[i]/3,ys[i+1]-ms[i+1]*dxs[i]/3,xs[i+1],ys[i+1])}return path}const cursorPlots=new Set;function invalidateRects(){for(let u of cursorPlots)u.syncRect(!0)}domEnv&&(on("resize",win,invalidateRects),on("scroll",win,invalidateRects,!0),on("dppxchange",win,()=>{uPlot.pxRatio=pxRatio}));const linearPath=linear(),pointsPath=points();function setDefaults(d,xo,yo,initY){return(initY?[d[0],d[1]].concat(d.slice(2)):[d[0]].concat(d.slice(1))).map((o,i)=>setDefault(o,i,xo,yo))}function setDefault(o,i,xo,yo){return assign({},0==i?xo:yo,o)}function snapNumX(self,dataMin,dataMax){return null==dataMin?nullNullTuple:[dataMin,dataMax]}const snapTimeX=snapNumX;function snapNumY(self,dataMin,dataMax){return null==dataMin?nullNullTuple:rangeNum(dataMin,dataMax,.1,!0)}function snapLogY(self,dataMin,dataMax,scale){return null==dataMin?nullNullTuple:rangeLog(dataMin,dataMax,self.scales[scale].log,!1)}const snapLogX=snapLogY;function snapAsinhY(self,dataMin,dataMax,scale){return null==dataMin?nullNullTuple:rangeAsinh(dataMin,dataMax,self.scales[scale].log,!1)}const snapAsinhX=snapAsinhY;function findIncr(minVal,maxVal,incrs,dim,minSpace){let intDigits=max(numIntDigits(minVal),numIntDigits(maxVal)),delta=maxVal-minVal,incrIdx=closestIdx(minSpace/dim*delta,incrs);do{let foundIncr=incrs[incrIdx],foundSpace=dim*foundIncr/delta;if(foundSpace>=minSpace&&intDigits+(foundIncr<5?fixedDec.get(foundIncr):0)<=17)return[foundIncr,foundSpace]}while(++incrIdx<incrs.length);return[0,0]}function pxRatioFont(font){let fontSize,fontSizeCss;return[font=font.replace(/(\d+)px/,(m,p1)=>(fontSize=round((fontSizeCss=+p1)*pxRatio))+"px"),fontSize,fontSizeCss]}function syncFontSize(axis){axis.show&&[axis.font,axis.labelFont].forEach(f=>{let size=roundDec(f[2]*pxRatio,1);f[0]=f[0].replace(/[0-9.]+px/,size+"px"),f[1]=size})}function uPlot(opts,data,then){const self={mode:ifNull(opts.mode,1)},mode=self.mode;function getHPos(val,scale,dim,off){let pct=scale.valToPct(val);return off+dim*(-1==scale.dir?1-pct:pct)}function getVPos(val,scale,dim,off){let pct=scale.valToPct(val);return off+dim*(-1==scale.dir?pct:1-pct)}function getPos(val,scale,dim,off){return 0==scale.ori?getHPos(val,scale,dim,off):getVPos(val,scale,dim,off)}self.valToPosH=getHPos,self.valToPosV=getVPos;let ready=!1;self.status=0;const root=self.root=placeDiv("uplot");if(null!=opts.id&&(root.id=opts.id),addClass(root,opts.class),opts.title){placeDiv("u-title",root).textContent=opts.title}const can=placeTag("canvas"),ctx=self.ctx=can.getContext("2d"),wrap=placeDiv("u-wrap",root);on("click",wrap,e=>{if(e.target===over){(mouseLeft1!=mouseLeft0||mouseTop1!=mouseTop0)&&drag.click(self,e)}},!0);const under=self.under=placeDiv("u-under",wrap);wrap.appendChild(can);const over=self.over=placeDiv("u-over",wrap),pxAlign=+ifNull((opts=copy(opts)).pxAlign,1),pxRound=pxRoundGen(pxAlign);(opts.plugins||[]).forEach(p=>{p.opts&&(opts=p.opts(self,opts)||opts)});const ms=opts.ms||.001,series=self.series=1==mode?setDefaults(opts.series||[],xSeriesOpts,ySeriesOpts,!1):function(d,xyo){return d.map((o,i)=>0==i?{}:assign({},xyo,o))}(opts.series||[null],xySeriesOpts),axes=self.axes=setDefaults(opts.axes||[],xAxisOpts,yAxisOpts,!0),scales=self.scales={},bands=self.bands=opts.bands||[];bands.forEach(b=>{b.fill=fnOrSelf(b.fill||null),b.dir=ifNull(b.dir,-1)});const xScaleKey=2==mode?series[1].facets[0].scale:series[0].scale,drawOrderMap={axes:function(){for(let i=0;i<axes.length;i++){let axis=axes[i];if(!axis.show||!axis._show)continue;let x,y,side=axis.side,ori=side%2,fillStyle=axis.stroke(self,i),shiftDir=0==side||3==side?-1:1,[_incr,_space]=axis._found;if(null!=axis.label){let shiftAmt=axis.labelGap*shiftDir,baseLpos=round((axis._lpos+shiftAmt)*pxRatio);setFontStyle(axis.labelFont[0],fillStyle,"center",2==side?"top":"bottom"),ctx.save(),1==ori?(x=y=0,ctx.translate(baseLpos,round(plotTop+plotHgt/2)),ctx.rotate((3==side?-PI:PI)/2)):(x=round(plotLft+plotWid/2),y=baseLpos);let _label=isFn(axis.label)?axis.label(self,i,_incr,_space):axis.label;ctx.fillText(_label,x,y),ctx.restore()}if(0==_space)continue;let scale=scales[axis.scale],plotDim=0==ori?plotWid:plotHgt,plotOff=0==ori?plotLft:plotTop,_splits=axis._splits,splits=2==scale.distr?_splits.map(i=>data0[i]):_splits,incr=2==scale.distr?data0[_splits[1]]-data0[_splits[0]]:_incr,ticks=axis.ticks,border=axis.border,_tickSize=ticks.show?ticks.size:0,tickSize=round(_tickSize*pxRatio),axisGap=round((2==axis.alignTo?axis._size-_tickSize-axis.gap:axis.gap)*pxRatio),angle=axis._rotate*-PI/180,basePos=pxRound(axis._pos*pxRatio),finalPos=basePos+(tickSize+axisGap)*shiftDir;y=0==ori?finalPos:0,x=1==ori?finalPos:0,setFontStyle(axis.font[0],fillStyle,1==axis.align?"left":2==axis.align?"right":angle>0?"left":angle<0?"right":0==ori?"center":3==side?"right":"left",angle||1==ori?"middle":2==side?"top":"bottom");let lineHeight=axis.font[1]*axis.lineGap,canOffs=_splits.map(val=>pxRound(getPos(val,scale,plotDim,plotOff))),_values=axis._values;for(let i=0;i<_values.length;i++){let val=_values[i];if(null!=val){0==ori?x=canOffs[i]:y=canOffs[i],val=""+val;let _parts=-1==val.indexOf("\n")?[val]:val.split(/\n/gm);for(let j=0;j<_parts.length;j++){let text=_parts[j];angle?(ctx.save(),ctx.translate(x,y+j*lineHeight),ctx.rotate(angle),ctx.fillText(text,0,0),ctx.restore()):ctx.fillText(text,x,y+j*lineHeight)}}}ticks.show&&drawOrthoLines(canOffs,ticks.filter(self,splits,i,_space,incr),ori,side,basePos,tickSize,roundDec(ticks.width*pxRatio,3),ticks.stroke(self,i),ticks.dash,ticks.cap);let grid=axis.grid;grid.show&&drawOrthoLines(canOffs,grid.filter(self,splits,i,_space,incr),ori,0==ori?2:1,0==ori?plotTop:plotLft,0==ori?plotHgt:plotWid,roundDec(grid.width*pxRatio,3),grid.stroke(self,i),grid.dash,grid.cap),border.show&&drawOrthoLines([basePos],[1],0==ori?1:0,0==ori?1:2,1==ori?plotTop:plotLft,1==ori?plotHgt:plotWid,roundDec(border.width*pxRatio,3),border.stroke(self,i),border.dash,border.cap)}fire("drawAxes")},series:function(){if(dataLen>0){let shouldAlpha=series.some(s=>s._focus)&&ctxAlpha!=focus.alpha;shouldAlpha&&(ctx.globalAlpha=ctxAlpha=focus.alpha),series.forEach((s,i)=>{if(i>0&&s.show&&(cacheStrokeFill(i,!1),cacheStrokeFill(i,!0),null==s._paths)){let _ctxAlpha=ctxAlpha;ctxAlpha!=s.alpha&&(ctx.globalAlpha=ctxAlpha=s.alpha);let _idxs=2==mode?[0,data[i][0].length-1]:function(ydata){let _i0=clamp(i0-1,0,dataLen-1),_i1=clamp(i1+1,0,dataLen-1);for(;null==ydata[_i0]&&_i0>0;)_i0--;for(;null==ydata[_i1]&&_i1<dataLen-1;)_i1++;return[_i0,_i1]}(data[i]);s._paths=s.paths(self,i,_idxs[0],_idxs[1]),ctxAlpha!=_ctxAlpha&&(ctx.globalAlpha=ctxAlpha=_ctxAlpha)}}),series.forEach((s,i)=>{if(i>0&&s.show){let _ctxAlpha=ctxAlpha;ctxAlpha!=s.alpha&&(ctx.globalAlpha=ctxAlpha=s.alpha),null!=s._paths&&drawPath(i,!1);{let _gaps=null!=s._paths?s._paths.gaps:null,show=s.points.show(self,i,i0,i1,_gaps),idxs=s.points.filter(self,i,show,_gaps);(show||idxs)&&(s.points._paths=s.points.paths(self,i,i0,i1,idxs),drawPath(i,!0))}ctxAlpha!=_ctxAlpha&&(ctx.globalAlpha=ctxAlpha=_ctxAlpha),fire("drawSeries",i)}}),shouldAlpha&&(ctx.globalAlpha=ctxAlpha=1)}}},drawOrder=(opts.drawOrder||["axes","series"]).map(key=>drawOrderMap[key]);function initValToPct(sc){const getVal=3==sc.distr?val=>log10(val>0?val:sc.clamp(self,val,sc.min,sc.max,sc.key)):4==sc.distr?val=>asinh(val,sc.asinh):100==sc.distr?val=>sc.fwd(val):val=>val;return val=>{let _val=getVal(val),{_min:_min,_max:_max}=sc;return(_val-_min)/(_max-_min)}}function initScale(scaleKey){let sc=scales[scaleKey];if(null==sc){let scaleOpts=(opts.scales||EMPTY_OBJ)[scaleKey]||EMPTY_OBJ;if(null!=scaleOpts.from){initScale(scaleOpts.from);let sc=assign({},scales[scaleOpts.from],scaleOpts,{key:scaleKey});sc.valToPct=initValToPct(sc),scales[scaleKey]=sc}else{sc=scales[scaleKey]=assign({},scaleKey==xScaleKey?xScaleOpts:yScaleOpts,scaleOpts),sc.key=scaleKey;let isTime=sc.time,rn=sc.range,rangeIsArr=isArr(rn);if((scaleKey!=xScaleKey||2==mode&&!isTime)&&(!rangeIsArr||null!=rn[0]&&null!=rn[1]||(rn={min:null==rn[0]?autoRangePart:{mode:1,hard:rn[0],soft:rn[0]},max:null==rn[1]?autoRangePart:{mode:1,hard:rn[1],soft:rn[1]}},rangeIsArr=!1),!rangeIsArr&&isObj(rn))){let cfg=rn;rn=(self,dataMin,dataMax)=>null==dataMin?nullNullTuple:rangeNum(dataMin,dataMax,cfg)}sc.range=fnOrSelf(rn||(isTime?snapTimeX:scaleKey==xScaleKey?3==sc.distr?snapLogX:4==sc.distr?snapAsinhX:snapNumX:3==sc.distr?snapLogY:4==sc.distr?snapAsinhY:snapNumY)),sc.auto=fnOrSelf(!rangeIsArr&&sc.auto),sc.clamp=fnOrSelf(sc.clamp||clampScale),sc._min=sc._max=null,sc.valToPct=initValToPct(sc)}}}initScale("x"),initScale("y"),1==mode&&series.forEach(s=>{initScale(s.scale)}),axes.forEach(a=>{initScale(a.scale)});for(let k in opts.scales)initScale(k);const scaleX=scales[xScaleKey],xScaleDistr=scaleX.distr;let valToPosX,valToPosY;0==scaleX.ori?(addClass(root,"u-hz"),valToPosX=getHPos,valToPosY=getVPos):(addClass(root,"u-vt"),valToPosX=getVPos,valToPosY=getHPos);const pendScales={};for(let k in scales){let sc=scales[k];null==sc.min&&null==sc.max||(pendScales[k]={min:sc.min,max:sc.max},sc.min=sc.max=null)}const _tzDate=opts.tzDate||(ts=>new Date(round(ts/ms))),_fmtDate=opts.fmtDate||fmtDate,_timeAxisSplits=1==ms?timeAxisSplitsMs(_tzDate):timeAxisSplitsS(_tzDate),_timeAxisVals=timeAxisVals(_tzDate,timeAxisStamps(1==ms?_timeAxisStampsMs:_timeAxisStampsS,_fmtDate)),_timeSeriesVal=timeSeriesVal(_tzDate,timeSeriesStamp("{YYYY}-{MM}-{DD} {h}:{mm}{aa}",_fmtDate)),activeIdxs=[],legend=self.legend=assign({},legendOpts,opts.legend),cursor=self.cursor=assign({},cursorOpts,{drag:{y:2==mode}},opts.cursor),showLegend=legend.show,showCursor=cursor.show,markers=legend.markers;let legendTable,legendHead,legendBody;legend.idxs=activeIdxs,markers.width=fnOrSelf(markers.width),markers.dash=fnOrSelf(markers.dash),markers.stroke=fnOrSelf(markers.stroke),markers.fill=fnOrSelf(markers.fill);let legendCols,legendRows=[],legendCells=[],multiValLegend=!1,NULL_LEGEND_VALUES={};if(legend.live){const getMultiVals=series[1]?series[1].values:null;multiValLegend=null!=getMultiVals,legendCols=multiValLegend?getMultiVals(self,1,0):{_:0};for(let k in legendCols)NULL_LEGEND_VALUES[k]="--"}if(showLegend)if(legendTable=placeTag("table","u-legend",root),legendBody=placeTag("tbody",null,legendTable),legend.mount(self,legendTable),multiValLegend){legendHead=placeTag("thead",null,legendTable,legendBody);let head=placeTag("tr",null,legendHead);for(var key in placeTag("th",null,head),legendCols)placeTag("th","u-label",head).textContent=key}else addClass(legendTable,"u-inline"),legend.live&&addClass(legendTable,"u-live");const son={show:!0},soff={show:!1};const mouseListeners=new Map;function onMouse(ev,targ,fn,onlyTarg=!0){const targListeners=mouseListeners.get(targ)||{},listener=cursor.bind[ev](self,targ,fn,onlyTarg);listener&&(on(ev,targ,targListeners[ev]=listener),mouseListeners.set(targ,targListeners))}function offMouse(ev,targ,fn){const targListeners=mouseListeners.get(targ)||{};for(let k in targListeners)null!=ev&&k!=ev||(off(k,targ,targListeners[k]),delete targListeners[k]);null==ev&&mouseListeners.delete(targ)}let fullWidCss=0,fullHgtCss=0,plotWidCss=0,plotHgtCss=0,plotLftCss=0,plotTopCss=0,_plotLftCss=plotLftCss,_plotTopCss=plotTopCss,_plotWidCss=plotWidCss,_plotHgtCss=plotHgtCss,plotLft=0,plotTop=0,plotWid=0,plotHgt=0;self.bbox={};let shouldSetScales=!1,shouldSetSize=!1,shouldConvergeSize=!1,shouldSetCursor=!1,shouldSetSelect=!1,shouldSetLegend=!1;function _setSize(width,height,force){(force||width!=self.width||height!=self.height)&&calcSize(width,height),resetYSeries(!1),shouldConvergeSize=!0,shouldSetSize=!0,commit()}function calcSize(width,height){self.width=fullWidCss=plotWidCss=width,self.height=fullHgtCss=plotHgtCss=height,plotLftCss=plotTopCss=0,function(){let hasTopAxis=!1,hasBtmAxis=!1,hasRgtAxis=!1,hasLftAxis=!1;axes.forEach((axis,i)=>{if(axis.show&&axis._show){let{side:side,_size:_size}=axis,isVt=side%2,fullSize=_size+(null!=axis.label?axis.labelSize:0);fullSize>0&&(isVt?(plotWidCss-=fullSize,3==side?(plotLftCss+=fullSize,hasLftAxis=!0):hasRgtAxis=!0):(plotHgtCss-=fullSize,0==side?(plotTopCss+=fullSize,hasTopAxis=!0):hasBtmAxis=!0))}}),sidesWithAxes[0]=hasTopAxis,sidesWithAxes[1]=hasRgtAxis,sidesWithAxes[2]=hasBtmAxis,sidesWithAxes[3]=hasLftAxis,plotWidCss-=_padding[1]+_padding[3],plotLftCss+=_padding[3],plotHgtCss-=_padding[2]+_padding[0],plotTopCss+=_padding[0]}(),function(){let off1=plotLftCss+plotWidCss,off2=plotTopCss+plotHgtCss,off3=plotLftCss,off0=plotTopCss;function incrOffset(side,size){switch(side){case 1:return off1+=size,off1-size;case 2:return off2+=size,off2-size;case 3:return off3-=size,off3+size;case 0:return off0-=size,off0+size}}axes.forEach((axis,i)=>{if(axis.show&&axis._show){let side=axis.side;axis._pos=incrOffset(side,axis._size),null!=axis.label&&(axis._lpos=incrOffset(side,axis.labelSize))}})}();let bb=self.bbox;plotLft=bb.left=incrRound(plotLftCss*pxRatio,.5),plotTop=bb.top=incrRound(plotTopCss*pxRatio,.5),plotWid=bb.width=incrRound(plotWidCss*pxRatio,.5),plotHgt=bb.height=incrRound(plotHgtCss*pxRatio,.5)}const CYCLE_LIMIT=3;if(self.setSize=function({width:width,height:height}){_setSize(width,height)},null==cursor.dataIdx){let hov=cursor.hover,skip=hov.skip=new Set(hov.skip??[]);skip.add(void 0);let prox=hov.prox=fnOrSelf(hov.prox),bias=hov.bias??=0;cursor.dataIdx=(self,seriesIdx,cursorIdx,valAtPosX)=>{if(0==seriesIdx)return cursorIdx;let idx2=cursorIdx,_prox=prox(self,seriesIdx,cursorIdx,valAtPosX)??inf,withProx=_prox>=0&&_prox<inf,xDim=0==scaleX.ori?plotWidCss:plotHgtCss,cursorLft=cursor.left,xValues=data[0],yValues=data[seriesIdx];if(skip.has(yValues[cursorIdx])){idx2=null;let j,nonNullLft=null,nonNullRgt=null;if(0==bias||-1==bias)for(j=cursorIdx;null==nonNullLft&&j-- >0;)skip.has(yValues[j])||(nonNullLft=j);if(0==bias||1==bias)for(j=cursorIdx;null==nonNullRgt&&j++<yValues.length;)skip.has(yValues[j])||(nonNullRgt=j);if(null!=nonNullLft||null!=nonNullRgt)if(withProx){let lftDelta=cursorLft-(null==nonNullLft?-1/0:valToPosX(xValues[nonNullLft],scaleX,xDim,0)),rgtDelta=(null==nonNullRgt?1/0:valToPosX(xValues[nonNullRgt],scaleX,xDim,0))-cursorLft;lftDelta<=rgtDelta?lftDelta<=_prox&&(idx2=nonNullLft):rgtDelta<=_prox&&(idx2=nonNullRgt)}else idx2=null==nonNullRgt?nonNullLft:null==nonNullLft?nonNullRgt:cursorIdx-nonNullLft<=nonNullRgt-cursorIdx?nonNullLft:nonNullRgt}else if(withProx){abs(cursorLft-valToPosX(xValues[cursorIdx],scaleX,xDim,0))>_prox&&(idx2=null)}return idx2}}const setCursorEvent=e=>{cursor.event=e};cursor.idxs=activeIdxs,cursor._lock=!1;let points=cursor.points;points.show=fnOrSelf(points.show),points.size=fnOrSelf(points.size),points.stroke=fnOrSelf(points.stroke),points.width=fnOrSelf(points.width),points.fill=fnOrSelf(points.fill);const focus=self.focus=assign({},opts.focus||{alpha:.3},cursor.focus),cursorFocus=focus.prox>=0,cursorOnePt=cursorFocus&&points.one;let cursorPts=[],cursorPtsLft=[],cursorPtsTop=[];function initCursorPt(s,si){let pt=points.show(self,si);if(pt instanceof HTMLElement)return addClass(pt,"u-cursor-pt"),addClass(pt,s.class),elTrans(pt,-10,-10,plotWidCss,plotHgtCss),over.insertBefore(pt,cursorPts[si]),pt}function initSeries(s,i){if(1==mode||i>0){let isTime=1==mode&&scales[s.scale].time,sv=s.value;s.value=isTime?isStr(sv)?timeSeriesVal(_tzDate,timeSeriesStamp(sv,_fmtDate)):sv||_timeSeriesVal:sv||numSeriesVal,s.label=s.label||(isTime?"Time":"Value")}if(cursorOnePt||i>0){s.width=null==s.width?1:s.width,s.paths=s.paths||linearPath||retNull,s.fillTo=fnOrSelf(s.fillTo||seriesFillTo),s.pxAlign=+ifNull(s.pxAlign,pxAlign),s.pxRound=pxRoundGen(s.pxAlign),s.stroke=fnOrSelf(s.stroke||null),s.fill=fnOrSelf(s.fill||null),s._stroke=s._fill=s._paths=s._focus=null;let _ptDia=roundDec((3+2*(max(1,s.width)||1))*1,3),points=s.points=assign({},{size:_ptDia,width:max(1,.2*_ptDia),stroke:s.stroke,space:2*_ptDia,paths:pointsPath,_stroke:null,_fill:null},s.points);points.show=fnOrSelf(points.show),points.filter=fnOrSelf(points.filter),points.fill=fnOrSelf(points.fill),points.stroke=fnOrSelf(points.stroke),points.paths=fnOrSelf(points.paths),points.pxAlign=s.pxAlign}if(showLegend){let rowCells=function(s,i){if(0==i&&(multiValLegend||!legend.live||2==mode))return nullNullTuple;let cells=[],row=placeTag("tr","u-series",legendBody,legendBody.childNodes[i]);addClass(row,s.class),s.show||addClass(row,OFF);let label=placeTag("th",null,row);if(markers.show){let indic=placeDiv("u-marker",label);if(i>0){let width=markers.width(self,i);width&&(indic.style.border=width+"px "+markers.dash(self,i)+" "+markers.stroke(self,i)),indic.style.background=markers.fill(self,i)}}let text=placeDiv("u-label",label);for(var key in s.label instanceof HTMLElement?text.appendChild(s.label):text.textContent=s.label,i>0&&(markers.show||(text.style.color=s.width>0?markers.stroke(self,i):markers.fill(self,i)),onMouse("click",label,e=>{if(cursor._lock)return;setCursorEvent(e);let seriesIdx=series.indexOf(s);if((e.ctrlKey||e.metaKey)!=legend.isolate){let isolate=series.some((s,i)=>i>0&&i!=seriesIdx&&s.show);series.forEach((s,i)=>{i>0&&setSeries(i,isolate?i==seriesIdx?son:soff:son,!0,syncOpts.setSeries)})}else setSeries(seriesIdx,{show:!s.show},!0,syncOpts.setSeries)},!1),cursorFocus&&onMouse("mouseenter",label,e=>{cursor._lock||(setCursorEvent(e),setSeries(series.indexOf(s),FOCUS_TRUE,!0,syncOpts.setSeries))},!1)),legendCols){let v=placeTag("td","u-value",row);v.textContent="--",cells.push(v)}return[row,cells]}(s,i);legendRows.splice(i,0,rowCells[0]),legendCells.splice(i,0,rowCells[1]),legend.values.push(null)}if(showCursor){activeIdxs.splice(i,0,null);let pt=null;cursorOnePt?0==i&&(pt=initCursorPt(s,i)):i>0&&(pt=initCursorPt(s,i)),cursorPts.splice(i,0,pt),cursorPtsLft.splice(i,0,0),cursorPtsTop.splice(i,0,0)}fire("addSeries",i)}self.addSeries=function(opts,si){si=null==si?series.length:si,opts=1==mode?setDefault(opts,si,xSeriesOpts,ySeriesOpts):setDefault(opts,si,{},xySeriesOpts),series.splice(si,0,opts),initSeries(series[si],si)},self.delSeries=function(i){if(series.splice(i,1),showLegend){legend.values.splice(i,1),legendCells.splice(i,1);let tr=legendRows.splice(i,1)[0];offMouse(null,tr.firstChild),tr.remove()}showCursor&&(activeIdxs.splice(i,1),cursorPts.splice(i,1)[0].remove(),cursorPtsLft.splice(i,1),cursorPtsTop.splice(i,1)),fire("delSeries",i)};const sidesWithAxes=[!1,!1,!1,!1];function autoPadSide(self,side,sidesWithAxes,cycleNum){let[hasTopAxis,hasRgtAxis,hasBtmAxis,hasLftAxis]=sidesWithAxes,ori=side%2,size=0;return 0==ori&&(hasLftAxis||hasRgtAxis)&&(size=0==side&&!hasTopAxis||2==side&&!hasBtmAxis?round(xAxisOpts.size/3):0),1==ori&&(hasTopAxis||hasBtmAxis)&&(size=1==side&&!hasRgtAxis||3==side&&!hasLftAxis?round(yAxisOpts.size/2):0),size}const padding=self.padding=(opts.padding||[autoPadSide,autoPadSide,autoPadSide,autoPadSide]).map(p=>fnOrSelf(ifNull(p,autoPadSide))),_padding=self._padding=padding.map((p,i)=>p(self,i,sidesWithAxes,0));let dataLen,i0=null,i1=null;const idxs=1==mode?series[0].idxs:null;let ctxStroke,ctxFill,ctxWidth,ctxDash,ctxJoin,ctxCap,ctxFont,ctxAlign,ctxBaseline,ctxAlpha,data0=null,viaAutoScaleX=!1;function setData(_data,_resetScales){if(data=null==_data?[]:_data,self.data=self._data=data,2==mode){dataLen=0;for(let i=1;i<series.length;i++)dataLen+=data[i][0].length}else{0==data.length&&(self.data=self._data=data=[[]]),data0=data[0],dataLen=data0.length;let scaleData=data;if(2==xScaleDistr){scaleData=data.slice();let _data0=scaleData[0]=Array(dataLen);for(let i=0;i<dataLen;i++)_data0[i]=i}self._data=data=scaleData}if(resetYSeries(!0),fire("setData"),2==xScaleDistr&&(shouldConvergeSize=!0),!1!==_resetScales){let xsc=scaleX;xsc.auto(self,viaAutoScaleX)?autoScaleX():_setScale(xScaleKey,xsc.min,xsc.max),shouldSetCursor=shouldSetCursor||cursor.left>=0,shouldSetLegend=!0,commit()}}function autoScaleX(){let _min,_max;viaAutoScaleX=!0,1==mode&&(dataLen>0?(i0=idxs[0]=0,i1=idxs[1]=dataLen-1,_min=data[0][i0],_max=data[0][i1],2==xScaleDistr?(_min=i0,_max=i1):_min==_max&&(3==xScaleDistr?[_min,_max]=rangeLog(_min,_min,scaleX.log,!1):4==xScaleDistr?[_min,_max]=rangeAsinh(_min,_min,scaleX.log,!1):scaleX.time?_max=_min+round(86400/ms):[_min,_max]=rangeNum(_min,_max,.1,!0))):(i0=idxs[0]=_min=null,i1=idxs[1]=_max=null)),_setScale(xScaleKey,_min,_max)}function setCtxStyle(stroke,width,dash,cap,fill,join){stroke??="#0000",dash??=EMPTY_ARR,cap??="butt",fill??="#0000",join??="round",stroke!=ctxStroke&&(ctx.strokeStyle=ctxStroke=stroke),fill!=ctxFill&&(ctx.fillStyle=ctxFill=fill),width!=ctxWidth&&(ctx.lineWidth=ctxWidth=width),join!=ctxJoin&&(ctx.lineJoin=ctxJoin=join),cap!=ctxCap&&(ctx.lineCap=ctxCap=cap),dash!=ctxDash&&ctx.setLineDash(ctxDash=dash)}function setFontStyle(font,fill,align,baseline){fill!=ctxFill&&(ctx.fillStyle=ctxFill=fill),font!=ctxFont&&(ctx.font=ctxFont=font),align!=ctxAlign&&(ctx.textAlign=ctxAlign=align),baseline!=ctxBaseline&&(ctx.textBaseline=ctxBaseline=baseline)}function accScale(wsc,psc,facet,data,sorted=0){if(data.length>0&&wsc.auto(self,viaAutoScaleX)&&(null==psc||null==psc.min)){let _i0=ifNull(i0,0),_i1=ifNull(i1,data.length-1),minMax=null==facet.min?function(data,_i0,_i1,sorted=0,log=!1){let getEdgeIdxs=log?positiveIdxs:nonNullIdxs,predicate=log?isPositive:notNullish;[_i0,_i1]=getEdgeIdxs(data,_i0,_i1);let _min=data[_i0],_max=data[_i0];if(_i0>-1)if(1==sorted)_min=data[_i0],_max=data[_i1];else if(-1==sorted)_min=data[_i1],_max=data[_i0];else for(let i=_i0;i<=_i1;i++){let v=data[i];predicate(v)&&(v<_min?_min=v:v>_max&&(_max=v))}return[_min??inf,_max??-inf]}(data,_i0,_i1,sorted,3==wsc.distr):[facet.min,facet.max];wsc.min=min(wsc.min,facet.min=minMax[0]),wsc.max=max(wsc.max,facet.max=minMax[1])}}self.setData=setData;const AUTOSCALE={min:null,max:null};function cacheStrokeFill(si,_points){let s=_points?series[si].points:series[si];s._stroke=s.stroke(self,si),s._fill=s.fill(self,si)}function drawPath(si,_points){let s=_points?series[si].points:series[si],{stroke:stroke,fill:fill,clip:gapsClip,flags:flags,_stroke:strokeStyle=s._stroke,_fill:fillStyle=s._fill,_width:width=s.width}=s._paths;width=roundDec(width*pxRatio,3);let boundsClip=null,offset=width%2/2;_points&&null==fillStyle&&(fillStyle=width>0?"#fff":strokeStyle);let _pxAlign=1==s.pxAlign&&offset>0;if(_pxAlign&&ctx.translate(offset,offset),!_points){let lft=plotLft-width/2,top=plotTop-width/2,wid=plotWid+width,hgt=plotHgt+width;boundsClip=new Path2D,boundsClip.rect(lft,top,wid,hgt)}_points?strokeFill(strokeStyle,width,s.dash,s.cap,fillStyle,stroke,fill,flags,gapsClip):function(si,strokeStyle,lineWidth,lineDash,lineCap,fillStyle,strokePath,fillPath,flags,boundsClip,gapsClip){let didStrokeFill=!1;0!=flags&&bands.forEach((b,bi)=>{if(b.series[0]==si){let gapsClip2,lowerEdge=series[b.series[1]],lowerData=data[b.series[1]],bandClip=(lowerEdge._paths||EMPTY_OBJ).band;isArr(bandClip)&&(bandClip=1==b.dir?bandClip[0]:bandClip[1]);let _fillStyle=null;lowerEdge.show&&bandClip&&function(data,idx0,idx1){for(idx0=ifNull(idx0,0),idx1=ifNull(idx1,data.length-1);idx0<=idx1;){if(null!=data[idx0])return!0;idx0++}return!1}(lowerData,i0,i1)?(_fillStyle=b.fill(self,bi)||fillStyle,gapsClip2=lowerEdge._paths.clip):bandClip=null,strokeFill(strokeStyle,lineWidth,lineDash,lineCap,_fillStyle,strokePath,fillPath,flags,boundsClip,gapsClip,gapsClip2,bandClip),didStrokeFill=!0}}),didStrokeFill||strokeFill(strokeStyle,lineWidth,lineDash,lineCap,fillStyle,strokePath,fillPath,flags,boundsClip,gapsClip)}(si,strokeStyle,width,s.dash,s.cap,fillStyle,stroke,fill,flags,boundsClip,gapsClip),_pxAlign&&ctx.translate(-offset,-offset)}const CLIP_FILL_STROKE=3;function strokeFill(strokeStyle,lineWidth,lineDash,lineCap,fillStyle,strokePath,fillPath,flags,boundsClip,gapsClip,gapsClip2,bandClip){setCtxStyle(strokeStyle,lineWidth,lineDash,lineCap,fillStyle),(boundsClip||gapsClip||bandClip)&&(ctx.save(),boundsClip&&ctx.clip(boundsClip),gapsClip&&ctx.clip(gapsClip)),bandClip?(flags&CLIP_FILL_STROKE)==CLIP_FILL_STROKE?(ctx.clip(bandClip),gapsClip2&&ctx.clip(gapsClip2),doFill(fillStyle,fillPath),doStroke(strokeStyle,strokePath,lineWidth)):2&flags?(doFill(fillStyle,fillPath),ctx.clip(bandClip),doStroke(strokeStyle,strokePath,lineWidth)):1&flags&&(ctx.save(),ctx.clip(bandClip),gapsClip2&&ctx.clip(gapsClip2),doFill(fillStyle,fillPath),ctx.restore(),doStroke(strokeStyle,strokePath,lineWidth)):(doFill(fillStyle,fillPath),doStroke(strokeStyle,strokePath,lineWidth)),(boundsClip||gapsClip||bandClip)&&ctx.restore()}function doStroke(strokeStyle,strokePath,lineWidth){lineWidth>0&&(strokePath instanceof Map?strokePath.forEach((strokePath,strokeStyle)=>{ctx.strokeStyle=ctxStroke=strokeStyle,ctx.stroke(strokePath)}):null!=strokePath&&strokeStyle&&ctx.stroke(strokePath))}function doFill(fillStyle,fillPath){fillPath instanceof Map?fillPath.forEach((fillPath,fillStyle)=>{ctx.fillStyle=ctxFill=fillStyle,ctx.fill(fillPath)}):null!=fillPath&&fillStyle&&ctx.fill(fillPath)}function drawOrthoLines(offs,filts,ori,side,pos0,len,width,stroke,dash,cap){let offset=width%2/2;1==pxAlign&&ctx.translate(offset,offset),setCtxStyle(stroke,width,dash,cap,stroke),ctx.beginPath();let x0,y0,x1,y1,pos1=pos0+(0==side||3==side?-len:len);0==ori?(y0=pos0,y1=pos1):(x0=pos0,x1=pos1);for(let i=0;i<offs.length;i++)null!=filts[i]&&(0==ori?x0=x1=offs[i]:y0=y1=offs[i],ctx.moveTo(x0,y0),ctx.lineTo(x1,y1));ctx.stroke(),1==pxAlign&&ctx.translate(-offset,-offset)}function axesCalc(cycleNum){let converged=!0;return axes.forEach((axis,i)=>{if(!axis.show)return;let scale=scales[axis.scale];if(null==scale.min)return void(axis._show&&(converged=!1,axis._show=!1,resetYSeries(!1)));axis._show||(converged=!1,axis._show=!0,resetYSeries(!1));let side=axis.side,ori=side%2,{min:min,max:max}=scale,[_incr,_space]=function(axisIdx,min,max,fullDim){let incrSpace,axis=axes[axisIdx];if(fullDim<=0)incrSpace=[0,0];else{let minSpace=axis._space=axis.space(self,axisIdx,min,max,fullDim);incrSpace=findIncr(min,max,axis._incrs=axis.incrs(self,axisIdx,min,max,fullDim,minSpace),fullDim,minSpace)}return axis._found=incrSpace}(i,min,max,0==ori?plotWidCss:plotHgtCss);if(0==_space)return;let forceMin=2==scale.distr,_splits=axis._splits=axis.splits(self,i,min,max,_incr,_space,forceMin),splits=2==scale.distr?_splits.map(i=>data0[i]):_splits,incr=2==scale.distr?data0[_splits[1]]-data0[_splits[0]]:_incr,values=axis._values=axis.values(self,axis.filter(self,splits,i,_space,incr),i,_space,incr);axis._rotate=2==side?axis.rotate(self,values,i,_space):0;let oldSize=axis._size;axis._size=ceil(axis.size(self,values,i,cycleNum)),null!=oldSize&&axis._size!=oldSize&&(converged=!1)}),converged}function paddingCalc(cycleNum){let converged=!0;return padding.forEach((p,i)=>{let _p=p(self,i,sidesWithAxes,cycleNum);_p!=_padding[i]&&(converged=!1),_padding[i]=_p}),converged}function resetYSeries(minMax){series.forEach((s,i)=>{i>0&&(s._paths=null,minMax&&(1==mode?(s.min=null,s.max=null):s.facets.forEach(f=>{f.min=null,f.max=null})))})}let xCursor,yCursor,vCursor,hCursor,rawMouseLeft0,rawMouseTop0,mouseLeft0,mouseTop0,rawMouseLeft1,rawMouseTop1,mouseLeft1,mouseTop1,queuedCommit=!1,deferHooks=!1,hooksQueue=[];function flushHooks(){deferHooks=!1;for(let i=0;i<hooksQueue.length;i++)fire(...hooksQueue[i]);hooksQueue.length=0}function commit(){queuedCommit||(microTask(_commit),queuedCommit=!0)}function _commit(){if(shouldSetScales&&(!function(){for(let k in scales){let sc=scales[k];null==pendScales[k]&&(null==sc.min||null!=pendScales[xScaleKey]&&sc.auto(self,viaAutoScaleX))&&(pendScales[k]=AUTOSCALE)}for(let k in scales){let sc=scales[k];null==pendScales[k]&&null!=sc.from&&null!=pendScales[sc.from]&&(pendScales[k]=AUTOSCALE)}null!=pendScales[xScaleKey]&&resetYSeries(!0);let wipScales={};for(let k in pendScales){let psc=pendScales[k];if(null!=psc){let wsc=wipScales[k]=copy(scales[k],fastIsObj);if(null!=psc.min)assign(wsc,psc);else if(k!=xScaleKey||2==mode)if(0==dataLen&&null==wsc.from){let minMax=wsc.range(self,null,null,k);wsc.min=minMax[0],wsc.max=minMax[1]}else wsc.min=inf,wsc.max=-inf}}if(dataLen>0){series.forEach((s,i)=>{if(1==mode){let k=s.scale,psc=pendScales[k];if(null==psc)return;let wsc=wipScales[k];if(0==i){let minMax=wsc.range(self,wsc.min,wsc.max,k);wsc.min=minMax[0],wsc.max=minMax[1],i0=closestIdx(wsc.min,data[0]),i1=closestIdx(wsc.max,data[0]),i1-i0>1&&(data[0][i0]<wsc.min&&i0++,data[0][i1]>wsc.max&&i1--),s.min=data0[i0],s.max=data0[i1]}else s.show&&s.auto&&accScale(wsc,psc,s,data[i],s.sorted);s.idxs[0]=i0,s.idxs[1]=i1}else if(i>0&&s.show&&s.auto){let[xFacet,yFacet]=s.facets,xScaleKey=xFacet.scale,yScaleKey=yFacet.scale,[xData,yData]=data[i],wscx=wipScales[xScaleKey],wscy=wipScales[yScaleKey];null!=wscx&&accScale(wscx,pendScales[xScaleKey],xFacet,xData,xFacet.sorted),null!=wscy&&accScale(wscy,pendScales[yScaleKey],yFacet,yData,yFacet.sorted),s.min=yFacet.min,s.max=yFacet.max}});for(let k in wipScales){let wsc=wipScales[k],psc=pendScales[k];if(null==wsc.from&&(null==psc||null==psc.min)){let minMax=wsc.range(self,wsc.min==inf?null:wsc.min,wsc.max==-inf?null:wsc.max,k);wsc.min=minMax[0],wsc.max=minMax[1]}}}for(let k in wipScales){let wsc=wipScales[k];if(null!=wsc.from){let base=wipScales[wsc.from];if(null==base.min)wsc.min=wsc.max=null;else{let minMax=wsc.range(self,base.min,base.max,k);wsc.min=minMax[0],wsc.max=minMax[1]}}}let changed={},anyChanged=!1;for(let k in wipScales){let wsc=wipScales[k],sc=scales[k];if(sc.min!=wsc.min||sc.max!=wsc.max){sc.min=wsc.min,sc.max=wsc.max;let distr=sc.distr;sc._min=3==distr?log10(sc.min):4==distr?asinh(sc.min,sc.asinh):100==distr?sc.fwd(sc.min):sc.min,sc._max=3==distr?log10(sc.max):4==distr?asinh(sc.max,sc.asinh):100==distr?sc.fwd(sc.max):sc.max,changed[k]=anyChanged=!0}}if(anyChanged){series.forEach((s,i)=>{2==mode?i>0&&changed.y&&(s._paths=null):changed[s.scale]&&(s._paths=null)});for(let k in changed)shouldConvergeSize=!0,fire("setScale",k);showCursor&&cursor.left>=0&&(shouldSetCursor=shouldSetLegend=!0)}for(let k in pendScales)pendScales[k]=null}(),shouldSetScales=!1),shouldConvergeSize&&(!function(){let converged=!1,cycleNum=0;for(;!converged;){cycleNum++;let axesConverged=axesCalc(cycleNum),paddingConverged=paddingCalc(cycleNum);converged=cycleNum==CYCLE_LIMIT||axesConverged&&paddingConverged,converged||(calcSize(self.width,self.height),shouldSetSize=!0)}}(),shouldConvergeSize=!1),shouldSetSize){if(setStylePx(under,"left",plotLftCss),setStylePx(under,"top",plotTopCss),setStylePx(under,"width",plotWidCss),setStylePx(under,"height",plotHgtCss),setStylePx(over,"left",plotLftCss),setStylePx(over,"top",plotTopCss),setStylePx(over,"width",plotWidCss),setStylePx(over,"height",plotHgtCss),setStylePx(wrap,"width",fullWidCss),setStylePx(wrap,"height",fullHgtCss),can.width=round(fullWidCss*pxRatio),can.height=round(fullHgtCss*pxRatio),axes.forEach(({_el:_el,_show:_show,_size:_size,_pos:_pos,side:side})=>{if(null!=_el)if(_show){let isVt=side%2==1;setStylePx(_el,isVt?"left":"top",_pos-(3===side||0===side?_size:0)),setStylePx(_el,isVt?"width":"height",_size),setStylePx(_el,isVt?"top":"left",isVt?plotTopCss:plotLftCss),setStylePx(_el,isVt?"height":"width",isVt?plotHgtCss:plotWidCss),remClass(_el,OFF)}else addClass(_el,OFF)}),ctxStroke=ctxFill=ctxWidth=ctxJoin=ctxCap=ctxFont=ctxAlign=ctxBaseline=ctxDash=null,ctxAlpha=1,syncRect(!0),plotLftCss!=_plotLftCss||plotTopCss!=_plotTopCss||plotWidCss!=_plotWidCss||plotHgtCss!=_plotHgtCss){resetYSeries(!1);let pctWid=plotWidCss/_plotWidCss,pctHgt=plotHgtCss/_plotHgtCss;if(showCursor&&!shouldSetCursor&&cursor.left>=0){cursor.left*=pctWid,cursor.top*=pctHgt,vCursor&&elTrans(vCursor,round(cursor.left),0,plotWidCss,plotHgtCss),hCursor&&elTrans(hCursor,0,round(cursor.top),plotWidCss,plotHgtCss);for(let i=0;i<cursorPts.length;i++){let pt=cursorPts[i];null!=pt&&(cursorPtsLft[i]*=pctWid,cursorPtsTop[i]*=pctHgt,elTrans(pt,ceil(cursorPtsLft[i]),ceil(cursorPtsTop[i]),plotWidCss,plotHgtCss))}}if(select.show&&!shouldSetSelect&&select.left>=0&&select.width>0){select.left*=pctWid,select.width*=pctWid,select.top*=pctHgt,select.height*=pctHgt;for(let prop in _hideProps)setStylePx(selectDiv,prop,select[prop])}_plotLftCss=plotLftCss,_plotTopCss=plotTopCss,_plotWidCss=plotWidCss,_plotHgtCss=plotHgtCss}fire("setSize"),shouldSetSize=!1}fullWidCss>0&&fullHgtCss>0&&(ctx.clearRect(0,0,can.width,can.height),fire("drawClear"),drawOrder.forEach(fn=>fn()),fire("draw")),select.show&&shouldSetSelect&&(setSelect(select),shouldSetSelect=!1),showCursor&&shouldSetCursor&&(updateCursor(null,!0,!1),shouldSetCursor=!1),legend.show&&legend.live&&shouldSetLegend&&(setLegend(),shouldSetLegend=!1),ready||(ready=!0,self.status=1,fire("ready")),viaAutoScaleX=!1,queuedCommit=!1}function setScale(key,opts){let sc=scales[key];if(null==sc.from){if(0==dataLen){let minMax=sc.range(self,opts.min,opts.max,key);opts.min=minMax[0],opts.max=minMax[1]}if(opts.min>opts.max){let _min=opts.min;opts.min=opts.max,opts.max=_min}if(dataLen>1&&null!=opts.min&&null!=opts.max&&opts.max-opts.min<1e-16)return;key==xScaleKey&&2==sc.distr&&dataLen>0&&(opts.min=closestIdx(opts.min,data[0]),opts.max=closestIdx(opts.max,data[0]),opts.min==opts.max&&opts.max++),pendScales[key]=opts,shouldSetScales=!0,commit()}}self.batch=function(fn,_deferHooks=!1){queuedCommit=!0,deferHooks=_deferHooks,fn(self),_commit(),_deferHooks&&hooksQueue.length>0&&queueMicrotask(flushHooks)},self.redraw=(rebuildPaths,recalcAxes)=>{shouldConvergeSize=recalcAxes||!1,!1!==rebuildPaths?_setScale(xScaleKey,scaleX.min,scaleX.max):commit()},self.setScale=setScale;let dragging=!1;const drag=cursor.drag;let dragX=drag.x,dragY=drag.y;showCursor&&(cursor.x&&(xCursor=placeDiv("u-cursor-x",over)),cursor.y&&(yCursor=placeDiv("u-cursor-y",over)),0==scaleX.ori?(vCursor=xCursor,hCursor=yCursor):(vCursor=yCursor,hCursor=xCursor),mouseLeft1=cursor.left,mouseTop1=cursor.top);const select=self.select=assign({show:!0,over:!0,left:0,width:0,top:0,height:0},opts.select),selectDiv=select.show?placeDiv("u-select",select.over?over:under):null;function setSelect(opts,_fire){if(select.show){for(let prop in opts)select[prop]=opts[prop],prop in _hideProps&&setStylePx(selectDiv,prop,opts[prop]);!1!==_fire&&fire("setSelect")}}function _setScale(key,min,max){setScale(key,{min:min,max:max})}function setSeries(i,opts,_fire,_pub){null!=opts.focus&&function(i){if(i!=focusedSeries){let allFocused=null==i,_setAlpha=1!=focus.alpha;series.forEach((s,i2)=>{if(1==mode||i2>0){let isFocused=allFocused||0==i2||i2==i;s._focus=allFocused?null:isFocused,_setAlpha&&function(i,value){series[i].alpha=value,showCursor&&null!=cursorPts[i]&&(cursorPts[i].style.opacity=value);showLegend&&legendRows[i]&&(legendRows[i].style.opacity=value)}(i2,isFocused?1:focus.alpha)}}),focusedSeries=i,_setAlpha&&commit()}}(i),null!=opts.show&&series.forEach((s,si)=>{si>0&&(i==si||null==i)&&(s.show=opts.show,function(i){if(series[i].show)showLegend&&remClass(legendRows[i],OFF);else if(showLegend&&addClass(legendRows[i],OFF),showCursor){let pt=cursorOnePt?cursorPts[0]:cursorPts[i];null!=pt&&elTrans(pt,-10,-10,plotWidCss,plotHgtCss)}}(si),2==mode?(_setScale(s.facets[0].scale,null,null),_setScale(s.facets[1].scale,null,null)):_setScale(s.scale,null,null),commit())}),!1!==_fire&&fire("setSeries",i,opts),_pub&&pubSync("setSeries",self,i,opts)}let closestDist,closestSeries,focusedSeries;self.setSelect=setSelect,self.setSeries=setSeries,self.addBand=function(opts,bi){opts.fill=fnOrSelf(opts.fill||null),opts.dir=ifNull(opts.dir,-1),bi=null==bi?bands.length:bi,bands.splice(bi,0,opts)},self.setBand=function(bi,opts){assign(bands[bi],opts)},self.delBand=function(bi){null==bi?bands.length=0:bands.splice(bi,1)};const FOCUS_TRUE={focus:!0};function posToVal(pos,scale,can){let sc=scales[scale];can&&(pos=pos/pxRatio-(1==sc.ori?plotTopCss:plotLftCss));let dim=plotWidCss;1==sc.ori&&(dim=plotHgtCss,pos=dim-pos),-1==sc.dir&&(pos=dim-pos);let _min=sc._min,sv=_min+(sc._max-_min)*(pos/dim),distr=sc.distr;return 3==distr?pow(10,sv):4==distr?((v,linthresh=1)=>M.sinh(v)*linthresh)(sv,sc.asinh):100==distr?sc.bwd(sv):sv}function setSelH(off,dim){setStylePx(selectDiv,"left",select.left=off),setStylePx(selectDiv,"width",select.width=dim)}function setSelV(off,dim){setStylePx(selectDiv,"top",select.top=off),setStylePx(selectDiv,"height",select.height=dim)}showLegend&&cursorFocus&&onMouse("mouseleave",legendTable,e=>{cursor._lock||(setCursorEvent(e),null!=focusedSeries&&setSeries(null,FOCUS_TRUE,!0,syncOpts.setSeries))}),self.valToIdx=val=>closestIdx(val,data[0]),self.posToIdx=function(pos,can){return closestIdx(posToVal(pos,xScaleKey,can),data[0],i0,i1)},self.posToVal=posToVal,self.valToPos=(val,scale,can)=>0==scales[scale].ori?getHPos(val,scales[scale],can?plotWid:plotWidCss,can?plotLft:0):getVPos(val,scales[scale],can?plotHgt:plotHgtCss,can?plotTop:0),self.setCursor=(opts,_fire,_pub)=>{mouseLeft1=opts.left,mouseTop1=opts.top,updateCursor(null,_fire,_pub)};let setSelX=0==scaleX.ori?setSelH:setSelV,setSelY=1==scaleX.ori?setSelH:setSelV;function setLegend(opts,_fire){if(null!=opts&&(opts.idxs?opts.idxs.forEach((didx,sidx)=>{activeIdxs[sidx]=didx}):(v=>void 0===v)(opts.idx)||activeIdxs.fill(opts.idx),legend.idx=activeIdxs[0]),showLegend&&legend.live){for(let sidx=0;sidx<series.length;sidx++)(sidx>0||1==mode&&!multiValLegend)&&setLegendValues(sidx,activeIdxs[sidx]);!function(){if(showLegend&&legend.live)for(let i=2==mode?1:0;i<series.length;i++){if(0==i&&multiValLegend)continue;let vals=legend.values[i],j=0;for(let k in vals)legendCells[i][j++].firstChild.nodeValue=vals[k]}}()}shouldSetLegend=!1,!1!==_fire&&fire("setLegend")}function setLegendValues(sidx,idx){let val,s=series[sidx],src=0==sidx&&2==xScaleDistr?data0:data[sidx];multiValLegend?val=s.values(self,sidx,idx)??NULL_LEGEND_VALUES:(val=s.value(self,null==idx?null:src[idx],sidx,idx),val=null==val?NULL_LEGEND_VALUES:{_:val}),legend.values[sidx]=val}function updateCursor(src,_fire,_pub){let idx;rawMouseLeft1=mouseLeft1,rawMouseTop1=mouseTop1,[mouseLeft1,mouseTop1]=cursor.move(self,mouseLeft1,mouseTop1),cursor.left=mouseLeft1,cursor.top=mouseTop1,showCursor&&(vCursor&&elTrans(vCursor,round(mouseLeft1),0,plotWidCss,plotHgtCss),hCursor&&elTrans(hCursor,0,round(mouseTop1),plotWidCss,plotHgtCss));let noDataInRange=i0>i1;closestDist=inf,closestSeries=null;let xDim=0==scaleX.ori?plotWidCss:plotHgtCss,yDim=1==scaleX.ori?plotWidCss:plotHgtCss;if(mouseLeft1<0||0==dataLen||noDataInRange){idx=cursor.idx=null;for(let i=0;i<series.length;i++){let pt=cursorPts[i];null!=pt&&elTrans(pt,-10,-10,plotWidCss,plotHgtCss)}cursorFocus&&setSeries(null,FOCUS_TRUE,!0,null==src&&syncOpts.setSeries),legend.live&&(activeIdxs.fill(idx),shouldSetLegend=!0)}else{let mouseXPos,valAtPosX,xPos;1==mode&&(mouseXPos=0==scaleX.ori?mouseLeft1:mouseTop1,valAtPosX=posToVal(mouseXPos,xScaleKey),idx=cursor.idx=closestIdx(valAtPosX,data[0],i0,i1),xPos=valToPosX(data[0][idx],scaleX,xDim,0));let _ptLft=-10,_ptTop=-10,_ptWid=0,_ptHgt=0,_centered=!0,_ptFill="",_ptStroke="";for(let i=2==mode?1:0;i<series.length;i++){let s=series[i],idx1=activeIdxs[i],yVal1=null==idx1?null:1==mode?data[i][idx1]:data[i][1][idx1],idx2=cursor.dataIdx(self,i,idx,valAtPosX),yVal2=null==idx2?null:1==mode?data[i][idx2]:data[i][1][idx2];if(shouldSetLegend=shouldSetLegend||yVal2!=yVal1||idx2!=idx1,activeIdxs[i]=idx2,i>0&&s.show){let xPos2=null==idx2?-10:idx2==idx?xPos:valToPosX(1==mode?data[0][idx2]:data[i][0][idx2],scaleX,xDim,0),yPos=null==yVal2?-10:valToPosY(yVal2,1==mode?scales[s.scale]:scales[s.facets[1].scale],yDim,0);if(cursorFocus&&null!=yVal2){let mouseYPos=1==scaleX.ori?mouseLeft1:mouseTop1,dist=abs(focus.dist(self,i,idx2,yPos,mouseYPos));if(dist<closestDist){let bias=focus.bias;if(0!=bias){let mouseYVal=posToVal(mouseYPos,s.scale),mouseYValSign=mouseYVal>=0?1:-1;mouseYValSign==(yVal2>=0?1:-1)&&(1==mouseYValSign?1==bias?yVal2>=mouseYVal:yVal2<=mouseYVal:1==bias?yVal2<=mouseYVal:yVal2>=mouseYVal)&&(closestDist=dist,closestSeries=i)}else closestDist=dist,closestSeries=i}}if(shouldSetLegend||cursorOnePt){let hPos,vPos;0==scaleX.ori?(hPos=xPos2,vPos=yPos):(hPos=yPos,vPos=xPos2);let ptWid,ptHgt,ptLft,ptTop,ptStroke,ptFill,centered=!0,getBBox=points.bbox;if(null!=getBBox){centered=!1;let bbox=getBBox(self,i);ptLft=bbox.left,ptTop=bbox.top,ptWid=bbox.width,ptHgt=bbox.height}else ptLft=hPos,ptTop=vPos,ptWid=ptHgt=points.size(self,i);if(ptFill=points.fill(self,i),ptStroke=points.stroke(self,i),cursorOnePt)i==closestSeries&&closestDist<=focus.prox&&(_ptLft=ptLft,_ptTop=ptTop,_ptWid=ptWid,_ptHgt=ptHgt,_centered=centered,_ptFill=ptFill,_ptStroke=ptStroke);else{let pt=cursorPts[i];null!=pt&&(cursorPtsLft[i]=ptLft,cursorPtsTop[i]=ptTop,elSize(pt,ptWid,ptHgt,centered),elColor(pt,ptFill,ptStroke),elTrans(pt,ceil(ptLft),ceil(ptTop),plotWidCss,plotHgtCss))}}}}if(cursorOnePt){let p=focus.prox;if(shouldSetLegend||(null==focusedSeries?closestDist<=p:closestDist>p||closestSeries!=focusedSeries)){let pt=cursorPts[0];null!=pt&&(cursorPtsLft[0]=_ptLft,cursorPtsTop[0]=_ptTop,elSize(pt,_ptWid,_ptHgt,_centered),elColor(pt,_ptFill,_ptStroke),elTrans(pt,ceil(_ptLft),ceil(_ptTop),plotWidCss,plotHgtCss))}}}if(select.show&&dragging)if(null!=src){let[xKey,yKey]=syncOpts.scales,[matchXKeys,matchYKeys]=syncOpts.match,[xKeySrc,yKeySrc]=src.cursor.sync.scales,sdrag=src.cursor.drag;if(dragX=sdrag._x,dragY=sdrag._y,dragX||dragY){let sOff,sDim,sc,a,b,{left:left,top:top,width:width,height:height}=src.select,sori=src.scales[xKeySrc].ori,sPosToVal=src.posToVal,matchingX=null!=xKey&&matchXKeys(xKey,xKeySrc),matchingY=null!=yKey&&matchYKeys(yKey,yKeySrc);matchingX&&dragX?(0==sori?(sOff=left,sDim=width):(sOff=top,sDim=height),sc=scales[xKey],a=valToPosX(sPosToVal(sOff,xKeySrc),sc,xDim,0),b=valToPosX(sPosToVal(sOff+sDim,xKeySrc),sc,xDim,0),setSelX(min(a,b),abs(b-a))):setSelX(0,xDim),matchingY&&dragY?(1==sori?(sOff=left,sDim=width):(sOff=top,sDim=height),sc=scales[yKey],a=valToPosY(sPosToVal(sOff,yKeySrc),sc,yDim,0),b=valToPosY(sPosToVal(sOff+sDim,yKeySrc),sc,yDim,0),setSelY(min(a,b),abs(b-a))):setSelY(0,yDim)}else hideSelect()}else{let rawDX=abs(rawMouseLeft1-rawMouseLeft0),rawDY=abs(rawMouseTop1-rawMouseTop0);if(1==scaleX.ori){let _rawDX=rawDX;rawDX=rawDY,rawDY=_rawDX}dragX=drag.x&&rawDX>=drag.dist,dragY=drag.y&&rawDY>=drag.dist;let p0,p1,uni=drag.uni;null!=uni?dragX&&dragY&&(dragX=rawDX>=uni,dragY=rawDY>=uni,dragX||dragY||(rawDY>rawDX?dragY=!0:dragX=!0)):drag.x&&drag.y&&(dragX||dragY)&&(dragX=dragY=!0),dragX&&(0==scaleX.ori?(p0=mouseLeft0,p1=mouseLeft1):(p0=mouseTop0,p1=mouseTop1),setSelX(min(p0,p1),abs(p1-p0)),dragY||setSelY(0,yDim)),dragY&&(1==scaleX.ori?(p0=mouseLeft0,p1=mouseLeft1):(p0=mouseTop0,p1=mouseTop1),setSelY(min(p0,p1),abs(p1-p0)),dragX||setSelX(0,xDim)),dragX||dragY||(setSelX(0,0),setSelY(0,0))}if(drag._x=dragX,drag._y=dragY,null==src){if(_pub){if(null!=syncKey){let[xSyncKey,ySyncKey]=syncOpts.scales;syncOpts.values[0]=null!=xSyncKey?posToVal(0==scaleX.ori?mouseLeft1:mouseTop1,xSyncKey):null,syncOpts.values[1]=null!=ySyncKey?posToVal(1==scaleX.ori?mouseLeft1:mouseTop1,ySyncKey):null}pubSync("mousemove",self,mouseLeft1,mouseTop1,plotWidCss,plotHgtCss,idx)}if(cursorFocus){let shouldPub=_pub&&syncOpts.setSeries,p=focus.prox;null==focusedSeries?closestDist<=p&&setSeries(closestSeries,FOCUS_TRUE,!0,shouldPub):closestDist>p?setSeries(null,FOCUS_TRUE,!0,shouldPub):closestSeries!=focusedSeries&&setSeries(closestSeries,FOCUS_TRUE,!0,shouldPub)}}shouldSetLegend&&(legend.idx=idx,setLegend()),!1!==_fire&&fire("setCursor")}self.setLegend=setLegend;let rect=null;function syncRect(defer=!1){defer?rect=null:(rect=over.getBoundingClientRect(),fire("syncRect",rect))}function mouseMove(e,src,_l,_t,_w,_h,_i){cursor._lock||dragging&&null!=e&&0==e.movementX&&0==e.movementY||(cacheMouse(e,src,_l,_t,_w,_h,_i,!1,null!=e),null!=e?updateCursor(null,!0,!0):updateCursor(src,!0,!1))}function cacheMouse(e,src,_l,_t,_w,_h,_i,initial,snap){if(null==rect&&syncRect(!1),setCursorEvent(e),null!=e)_l=e.clientX-rect.left,_t=e.clientY-rect.top;else{if(_l<0||_t<0)return mouseLeft1=-10,void(mouseTop1=-10);let[xKey,yKey]=syncOpts.scales,syncOptsSrc=src.cursor.sync,[xValSrc,yValSrc]=syncOptsSrc.values,[xKeySrc,yKeySrc]=syncOptsSrc.scales,[matchXKeys,matchYKeys]=syncOpts.match,rotSrc=src.axes[0].side%2==1,xDim=0==scaleX.ori?plotWidCss:plotHgtCss,yDim=1==scaleX.ori?plotWidCss:plotHgtCss,_xDim=rotSrc?_h:_w,_yDim=rotSrc?_w:_h,_xPos=rotSrc?_t:_l,_yPos=rotSrc?_l:_t;if(_l=null!=xKeySrc?matchXKeys(xKey,xKeySrc)?getPos(xValSrc,scales[xKey],xDim,0):-10:xDim*(_xPos/_xDim),_t=null!=yKeySrc?matchYKeys(yKey,yKeySrc)?getPos(yValSrc,scales[yKey],yDim,0):-10:yDim*(_yPos/_yDim),1==scaleX.ori){let __l=_l;_l=_t,_t=__l}}!snap||null!=src&&"mousemove"!=src.cursor.event.type||((_l<=1||_l>=plotWidCss-1)&&(_l=incrRound(_l,plotWidCss)),(_t<=1||_t>=plotHgtCss-1)&&(_t=incrRound(_t,plotHgtCss))),initial?(rawMouseLeft0=_l,rawMouseTop0=_t,[mouseLeft0,mouseTop0]=cursor.move(self,_l,_t)):(mouseLeft1=_l,mouseTop1=_t)}Object.defineProperty(self,"rect",{get:()=>(null==rect&&syncRect(!1),rect)});const _hideProps={width:0,height:0,left:0,top:0};function hideSelect(){setSelect(_hideProps,!1)}let downSelectLeft,downSelectTop,downSelectWidth,downSelectHeight;function mouseDown(e,src,_l,_t,_w,_h,_i){dragging=!0,dragX=dragY=drag._x=drag._y=!1,cacheMouse(e,src,_l,_t,_w,_h,0,!0,!1),null!=e&&(onMouse("mouseup",doc,mouseUp,!1),pubSync("mousedown",self,mouseLeft0,mouseTop0,plotWidCss,plotHgtCss,null));let{left:left,top:top,width:width,height:height}=select;downSelectLeft=left,downSelectTop=top,downSelectWidth=width,downSelectHeight=height}function mouseUp(e,src,_l,_t,_w,_h,_i){dragging=drag._x=drag._y=!1,cacheMouse(e,src,_l,_t,_w,_h,0,!1,!0);let{left:left,top:top,width:width,height:height}=select,hasSelect=width>0||height>0,chgSelect=downSelectLeft!=left||downSelectTop!=top||downSelectWidth!=width||downSelectHeight!=height;if(hasSelect&&chgSelect&&setSelect(select),drag.setScale&&hasSelect&&chgSelect){let xOff=left,xDim=width,yOff=top,yDim=height;if(1==scaleX.ori&&(xOff=top,xDim=height,yOff=left,yDim=width),dragX&&_setScale(xScaleKey,posToVal(xOff,xScaleKey),posToVal(xOff+xDim,xScaleKey)),dragY)for(let k in scales){let sc=scales[k];k!=xScaleKey&&null==sc.from&&sc.min!=inf&&_setScale(k,posToVal(yOff+yDim,k),posToVal(yOff,k))}hideSelect()}else cursor.lock&&(cursor._lock=!cursor._lock,updateCursor(src,!0,null!=e));null!=e&&(offMouse("mouseup",doc),pubSync("mouseup",self,mouseLeft1,mouseTop1,plotWidCss,plotHgtCss,null))}function dblClick(e,src,_l,_t,_w,_h,_i){cursor._lock||(setCursorEvent(e),autoScaleX(),hideSelect(),null!=e&&pubSync("dblclick",self,mouseLeft1,mouseTop1,plotWidCss,plotHgtCss,null))}function syncPxRatio(){axes.forEach(syncFontSize),_setSize(self.width,self.height,!0)}on("dppxchange",win,syncPxRatio);const events={};events.mousedown=mouseDown,events.mousemove=mouseMove,events.mouseup=mouseUp,events.dblclick=dblClick,events.setSeries=(e,src,idx,opts)=>{-1!=(idx=(0,syncOpts.match[2])(self,src,idx))&&setSeries(idx,opts,!0,!1)},showCursor&&(onMouse("mousedown",over,mouseDown),onMouse("mousemove",over,mouseMove),onMouse("mouseenter",over,e=>{setCursorEvent(e),syncRect(!1)}),onMouse("mouseleave",over,function(e,src,_l,_t,_w,_h,_i){if(cursor._lock)return;setCursorEvent(e);let _dragging=dragging;if(dragging){let dragH,dragV,snapH=!0,snapV=!0,snapProx=10;0==scaleX.ori?(dragH=dragX,dragV=dragY):(dragH=dragY,dragV=dragX),dragH&&dragV&&(snapH=mouseLeft1<=snapProx||mouseLeft1>=plotWidCss-snapProx,snapV=mouseTop1<=snapProx||mouseTop1>=plotHgtCss-snapProx),dragH&&snapH&&(mouseLeft1=mouseLeft1<mouseLeft0?0:plotWidCss),dragV&&snapV&&(mouseTop1=mouseTop1<mouseTop0?0:plotHgtCss),updateCursor(null,!0,!0),dragging=!1}mouseLeft1=-10,mouseTop1=-10,activeIdxs.fill(null),updateCursor(null,!0,!0),_dragging&&(dragging=_dragging)}),onMouse("dblclick",over,dblClick),cursorPlots.add(self),self.syncRect=syncRect);const hooks=self.hooks=opts.hooks||{};function fire(evName,a1,a2){deferHooks?hooksQueue.push([evName,a1,a2]):evName in hooks&&hooks[evName].forEach(fn=>{fn.call(null,self,a1,a2)})}(opts.plugins||[]).forEach(p=>{for(let evName in p.hooks)hooks[evName]=(hooks[evName]||[]).concat(p.hooks[evName])});const seriesIdxMatcher=(self,src,srcSeriesIdx)=>srcSeriesIdx,syncOpts=assign({key:null,setSeries:!1,filters:{pub:retTrue,sub:retTrue},scales:[xScaleKey,series[1]?series[1].scale:null],match:[retEq,retEq,seriesIdxMatcher],values:[null,null]},cursor.sync);2==syncOpts.match.length&&syncOpts.match.push(seriesIdxMatcher),cursor.sync=syncOpts;const syncKey=syncOpts.key,sync=_sync(syncKey);function pubSync(type,src,x,y,w,h,i){syncOpts.filters.pub(type,src,x,y,w,h,i)&&sync.pub(type,src,x,y,w,h,i)}function _init(){fire("init",opts,data),setData(data||opts.data,!1),pendScales[xScaleKey]?setScale(xScaleKey,pendScales[xScaleKey]):autoScaleX(),shouldSetSelect=select.show&&(select.width>0||select.height>0),shouldSetCursor=shouldSetLegend=!0,_setSize(opts.width,opts.height)}return sync.sub(self),self.pub=function(type,src,x,y,w,h,i){syncOpts.filters.sub(type,src,x,y,w,h,i)&&events[type](null,src,x,y,w,h,i)},self.destroy=function(){sync.unsub(self),cursorPlots.delete(self),mouseListeners.clear(),off("dppxchange",win,syncPxRatio),root.remove(),legendTable?.remove(),fire("destroy")},series.forEach(initSeries),axes.forEach(function(axis,i){if(axis._show=axis.show,axis.show){let isVt=axis.side%2,sc=scales[axis.scale];null==sc&&(axis.scale=isVt?series[1].scale:xScaleKey,sc=scales[axis.scale]);let isTime=sc.time;axis.size=fnOrSelf(axis.size),axis.space=fnOrSelf(axis.space),axis.rotate=fnOrSelf(axis.rotate),isArr(axis.incrs)&&axis.incrs.forEach(incr=>{!fixedDec.has(incr)&&fixedDec.set(incr,guessDec(incr))}),axis.incrs=fnOrSelf(axis.incrs||(2==sc.distr?wholeIncrs:isTime?1==ms?timeIncrsMs:timeIncrsS:numIncrs)),axis.splits=fnOrSelf(axis.splits||(isTime&&1==sc.distr?_timeAxisSplits:3==sc.distr?logAxisSplits:4==sc.distr?asinhAxisSplits:numAxisSplits)),axis.stroke=fnOrSelf(axis.stroke),axis.grid.stroke=fnOrSelf(axis.grid.stroke),axis.ticks.stroke=fnOrSelf(axis.ticks.stroke),axis.border.stroke=fnOrSelf(axis.border.stroke);let av=axis.values;axis.values=isArr(av)&&!isArr(av[0])?fnOrSelf(av):isTime?isArr(av)?timeAxisVals(_tzDate,timeAxisStamps(av,_fmtDate)):isStr(av)?function(tzDate,dateTpl){let stamp=fmtDate(dateTpl);return(self,splits,axisIdx,foundSpace,foundIncr)=>splits.map(split=>stamp(tzDate(split)))}(_tzDate,av):av||_timeAxisVals:av||numAxisVals,axis.filter=fnOrSelf(axis.filter||(sc.distr>=3&&10==sc.log?log10AxisValsFilt:3==sc.distr&&2==sc.log?log2AxisValsFilt:retArg1)),axis.font=pxRatioFont(axis.font),axis.labelFont=pxRatioFont(axis.labelFont),axis._size=axis.size(self,null,i,0),axis._space=axis._rotate=axis._incrs=axis._found=axis._splits=axis._values=null,axis._size>0&&(sidesWithAxes[i]=!0,axis._el=placeDiv("u-axis",wrap))}}),then?then instanceof HTMLElement?(then.appendChild(root),_init()):then(self,_init):_init(),self}uPlot.assign=assign,uPlot.fmtNum=fmtNum,uPlot.rangeNum=rangeNum,uPlot.rangeLog=rangeLog,uPlot.rangeAsinh=rangeAsinh,uPlot.orient=orient,uPlot.pxRatio=pxRatio,uPlot.join=function(tables,nullModes){if(function(tables){let vals0=tables[0][0],len0=vals0.length;for(let i=1;i<tables.length;i++){let vals1=tables[i][0];if(vals1.length!=len0)return!1;if(vals1!=vals0)for(let j=0;j<len0;j++)if(vals1[j]!=vals0[j])return!1}return!0}(tables)){let table=tables[0].slice();for(let i=1;i<tables.length;i++)table.push(...tables[i].slice(1));return function(vals,samples=100){const len=vals.length;if(len<=1)return!0;let firstIdx=0,lastIdx=len-1;for(;firstIdx<=lastIdx&&null==vals[firstIdx];)firstIdx++;for(;lastIdx>=firstIdx&&null==vals[lastIdx];)lastIdx--;if(lastIdx<=firstIdx)return!0;const stride=max(1,floor((lastIdx-firstIdx+1)/samples));for(let prevVal=vals[firstIdx],i=firstIdx+stride;i<=lastIdx;i+=stride){const v=vals[i];if(null!=v){if(v<=prevVal)return!1;prevVal=v}}return!0}(table[0])||(table=function(table){let head=table[0],rlen=head.length,idxs=Array(rlen);for(let i=0;i<idxs.length;i++)idxs[i]=i;idxs.sort((i0,i1)=>head[i0]-head[i1]);let table2=[];for(let i=0;i<table.length;i++){let row=table[i],row2=Array(rlen);for(let j=0;j<rlen;j++)row2[j]=row[idxs[j]];table2.push(row2)}return table2}(table)),table}let xVals=new Set;for(let ti=0;ti<tables.length;ti++){let xs=tables[ti][0],len=xs.length;for(let i=0;i<len;i++)xVals.add(xs[i])}let data=[Array.from(xVals).sort((a,b)=>a-b)],alignedLen=data[0].length,xIdxs=new Map;for(let i=0;i<alignedLen;i++)xIdxs.set(data[0][i],i);for(let ti=0;ti<tables.length;ti++){let t=tables[ti],xs=t[0];for(let si=1;si<t.length;si++){let ys=t[si],yVals=Array(alignedLen).fill(void 0),nullMode=nullModes?nullModes[ti][si]:1,nullIdxs=[];for(let i=0;i<ys.length;i++){let yVal=ys[i],alignedIdx=xIdxs.get(xs[i]);null===yVal?0!=nullMode&&(yVals[alignedIdx]=yVal,2==nullMode&&nullIdxs.push(alignedIdx)):yVals[alignedIdx]=yVal}nullExpand(yVals,nullIdxs,alignedLen),data.push(yVals)}}return data},uPlot.fmtDate=fmtDate,uPlot.tzDate=function(date,tz){let date2;return"UTC"==tz||"Etc/UTC"==tz?date2=new Date(+date+6e4*date.getTimezoneOffset()):tz==localTz?date2=date:(date2=new Date(date.toLocaleString("en-US",{timeZone:tz})),date2.setMilliseconds(date.getMilliseconds())),date2},uPlot.sync=_sync;{uPlot.addGap=function(gaps,fromX,toX){let prevGap=gaps[gaps.length-1];prevGap&&prevGap[0]==fromX?prevGap[1]=toX:gaps.push([fromX,toX])},uPlot.clipGaps=clipGaps;let paths=uPlot.paths={points:points};paths.linear=linear,paths.stepped=function(opts){const align=ifNull(opts.align,1),ascDesc=ifNull(opts.ascDesc,!1),alignGaps=ifNull(opts.alignGaps,0),extend=ifNull(opts.extend,!1);return(u,seriesIdx,idx0,idx1)=>orient(u,seriesIdx,(series,dataX,dataY,scaleX,scaleY,valToPosX,valToPosY,xOff,yOff,xDim,yDim)=>{[idx0,idx1]=nonNullIdxs(dataY,idx0,idx1);let pxRound=series.pxRound,{left:left,width:width}=u.bbox,pixelForX=val=>pxRound(valToPosX(val,scaleX,xDim,xOff)),pixelForY=val=>pxRound(valToPosY(val,scaleY,yDim,yOff)),lineTo=0==scaleX.ori?lineToH:lineToV;const _paths={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},stroke=_paths.stroke,dir=scaleX.dir*(0==scaleX.ori?1:-1);let prevYPos=pixelForY(dataY[1==dir?idx0:idx1]),firstXPos=pixelForX(dataX[1==dir?idx0:idx1]),prevXPos=firstXPos,firstXPosExt=firstXPos;extend&&-1==align&&(firstXPosExt=left,lineTo(stroke,firstXPosExt,prevYPos)),lineTo(stroke,firstXPos,prevYPos);for(let i=1==dir?idx0:idx1;i>=idx0&&i<=idx1;i+=dir){let yVal1=dataY[i];if(null==yVal1)continue;let x1=pixelForX(dataX[i]),y1=pixelForY(yVal1);1==align?lineTo(stroke,x1,prevYPos):lineTo(stroke,prevXPos,y1),lineTo(stroke,x1,y1),prevYPos=y1,prevXPos=x1}let prevXPosExt=prevXPos;extend&&1==align&&(prevXPosExt=left+width,lineTo(stroke,prevXPosExt,prevYPos));let[bandFillDir,bandClipDir]=bandFillClipDirs(u,seriesIdx);if(null!=series.fill||0!=bandFillDir){let fill=_paths.fill=new Path2D(stroke),fillToY=pixelForY(series.fillTo(u,seriesIdx,series.min,series.max,bandFillDir));lineTo(fill,prevXPosExt,fillToY),lineTo(fill,firstXPosExt,fillToY)}if(!series.spanGaps){let gaps=[];gaps.push(...findGaps(dataX,dataY,idx0,idx1,dir,pixelForX,alignGaps));let halfStroke=series.width*pxRatio/2,startsOffset=ascDesc||1==align?halfStroke:-halfStroke,endsOffset=ascDesc||-1==align?-halfStroke:halfStroke;gaps.forEach(g=>{g[0]+=startsOffset,g[1]+=endsOffset}),_paths.gaps=gaps=series.gaps(u,seriesIdx,idx0,idx1,gaps),_paths.clip=clipGaps(gaps,scaleX.ori,xOff,yOff,xDim,yDim)}return 0!=bandClipDir&&(_paths.band=2==bandClipDir?[clipBandLine(u,seriesIdx,idx0,idx1,stroke,-1),clipBandLine(u,seriesIdx,idx0,idx1,stroke,1)]:clipBandLine(u,seriesIdx,idx0,idx1,stroke,bandClipDir)),_paths})},paths.bars=function(opts){const size=ifNull((opts=opts||EMPTY_OBJ).size,[.6,inf,1]),align=opts.align||0,_extraGap=opts.gap||0;let ro=opts.radius;ro=null==ro?[0,0]:"number"==typeof ro?[ro,0]:ro;const radiusFn=fnOrSelf(ro),gapFactor=1-size[0],_maxWidth=ifNull(size[1],inf),_minWidth=ifNull(size[2],1),disp=ifNull(opts.disp,EMPTY_OBJ),_each=ifNull(opts.each,_=>{}),{fill:dispFills,stroke:dispStrokes}=disp;return(u,seriesIdx,idx0,idx1)=>orient(u,seriesIdx,(series,dataX,dataY,scaleX,scaleY,valToPosX,valToPosY,xOff,yOff,xDim,yDim)=>{let valRadius,baseRadius,pxRound=series.pxRound,_align=align,extraGap=_extraGap*pxRatio,maxWidth=_maxWidth*pxRatio,minWidth=_minWidth*pxRatio;0==scaleX.ori?[valRadius,baseRadius]=radiusFn(u,seriesIdx):[baseRadius,valRadius]=radiusFn(u,seriesIdx);const _dirX=scaleX.dir*(0==scaleX.ori?1:-1);let xShift,barWid,fullGap,rect=0==scaleX.ori?rectH:rectV,each=0==scaleX.ori?_each:(u,seriesIdx,i,top,lft,hgt,wid)=>{_each(u,seriesIdx,i,lft,top,wid,hgt)},band=ifNull(u.bands,EMPTY_ARR).find(b=>b.series[0]==seriesIdx),fillDir=null!=band?band.dir:0,fillTo=series.fillTo(u,seriesIdx,series.min,series.max,fillDir),fillToY=pxRound(valToPosY(fillTo,scaleY,yDim,yOff)),colWid=xDim,strokeWidth=pxRound(series.width*pxRatio),multiPath=!1,fillColors=null,fillPaths=null,strokeColors=null,strokePaths=null;null==dispFills||0!=strokeWidth&&null==dispStrokes||(multiPath=!0,fillColors=dispFills.values(u,seriesIdx,idx0,idx1),fillPaths=new Map,new Set(fillColors).forEach(color=>{null!=color&&fillPaths.set(color,new Path2D)}),strokeWidth>0&&(strokeColors=dispStrokes.values(u,seriesIdx,idx0,idx1),strokePaths=new Map,new Set(strokeColors).forEach(color=>{null!=color&&strokePaths.set(color,new Path2D)})));let{x0:x0,size:size}=disp;if(null!=x0&&null!=size){_align=1,dataX=x0.values(u,seriesIdx,idx0,idx1),2==x0.unit&&(dataX=dataX.map(pct=>u.posToVal(xOff+pct*xDim,scaleX.key,!0)));let sizes=size.values(u,seriesIdx,idx0,idx1);barWid=2==size.unit?sizes[0]*xDim:valToPosX(sizes[0],scaleX,xDim,xOff)-valToPosX(0,scaleX,xDim,xOff),colWid=findColWidth(dataX,dataY,valToPosX,scaleX,xDim,xOff,colWid),fullGap=colWid-barWid+extraGap}else colWid=findColWidth(dataX,dataY,valToPosX,scaleX,xDim,xOff,colWid),fullGap=colWid*gapFactor+extraGap,barWid=colWid-fullGap;fullGap<1&&(fullGap=0),strokeWidth>=barWid/2&&(strokeWidth=0),fullGap<5&&(pxRound=retArg0);let insetStroke=fullGap>0;barWid=pxRound(clamp(colWid-fullGap-(insetStroke?strokeWidth:0),minWidth,maxWidth)),xShift=(0==_align?barWid/2:_align==_dirX?0:barWid)-_align*_dirX*((0==_align?extraGap/2:0)+(insetStroke?strokeWidth/2:0));const _paths={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},stroke=multiPath?null:new Path2D;let dataY0=null;if(null!=band)dataY0=u.data[band.series[1]];else{let{y0:y0,y1:y1}=disp;null!=y0&&null!=y1&&(dataY=y1.values(u,seriesIdx,idx0,idx1),dataY0=y0.values(u,seriesIdx,idx0,idx1))}let radVal=valRadius*barWid,radBase=baseRadius*barWid;for(let i=1==_dirX?idx0:idx1;i>=idx0&&i<=idx1;i+=_dirX){let yVal=dataY[i];if(null==yVal)continue;if(null!=dataY0){let yVal0=dataY0[i]??0;if(yVal-yVal0==0)continue;fillToY=valToPosY(yVal0,scaleY,yDim,yOff)}let xPos=valToPosX(2!=scaleX.distr||null!=disp?dataX[i]:i,scaleX,xDim,xOff),yPos=valToPosY(ifNull(yVal,fillTo),scaleY,yDim,yOff),lft=pxRound(xPos-xShift),btm=pxRound(max(yPos,fillToY)),top=pxRound(min(yPos,fillToY)),barHgt=btm-top;if(null!=yVal){let rv=yVal<0?radBase:radVal,rb=yVal<0?radVal:radBase;multiPath?(strokeWidth>0&&null!=strokeColors[i]&&rect(strokePaths.get(strokeColors[i]),lft,top+floor(strokeWidth/2),barWid,max(0,barHgt-strokeWidth),rv,rb),null!=fillColors[i]&&rect(fillPaths.get(fillColors[i]),lft,top+floor(strokeWidth/2),barWid,max(0,barHgt-strokeWidth),rv,rb)):rect(stroke,lft,top+floor(strokeWidth/2),barWid,max(0,barHgt-strokeWidth),rv,rb),each(u,seriesIdx,i,lft-strokeWidth/2,top,barWid+strokeWidth,barHgt)}}return strokeWidth>0?_paths.stroke=multiPath?strokePaths:stroke:multiPath||(_paths._fill=0==series.width?series._fill:series._stroke??series._fill,_paths.width=0),_paths.fill=multiPath?fillPaths:stroke,_paths})},paths.spline=function(opts){return function(interp,opts){const alignGaps=ifNull(opts?.alignGaps,0);return(u,seriesIdx,idx0,idx1)=>orient(u,seriesIdx,(series,dataX,dataY,scaleX,scaleY,valToPosX,valToPosY,xOff,yOff,xDim,yDim)=>{[idx0,idx1]=nonNullIdxs(dataY,idx0,idx1);let moveTo,bezierCurveTo,lineTo,pxRound=series.pxRound,pixelForX=val=>pxRound(valToPosX(val,scaleX,xDim,xOff)),pixelForY=val=>pxRound(valToPosY(val,scaleY,yDim,yOff));0==scaleX.ori?(moveTo=moveToH,lineTo=lineToH,bezierCurveTo=bezierCurveToH):(moveTo=moveToV,lineTo=lineToV,bezierCurveTo=bezierCurveToV);const dir=scaleX.dir*(0==scaleX.ori?1:-1);let firstXPos=pixelForX(dataX[1==dir?idx0:idx1]),prevXPos=firstXPos,xCoords=[],yCoords=[];for(let i=1==dir?idx0:idx1;i>=idx0&&i<=idx1;i+=dir)if(null!=dataY[i]){let xPos=pixelForX(dataX[i]);xCoords.push(prevXPos=xPos),yCoords.push(pixelForY(dataY[i]))}const _paths={stroke:interp(xCoords,yCoords,moveTo,lineTo,bezierCurveTo,pxRound),fill:null,clip:null,band:null,gaps:null,flags:1},stroke=_paths.stroke;let[bandFillDir,bandClipDir]=bandFillClipDirs(u,seriesIdx);if(null!=series.fill||0!=bandFillDir){let fill=_paths.fill=new Path2D(stroke),fillToY=pixelForY(series.fillTo(u,seriesIdx,series.min,series.max,bandFillDir));lineTo(fill,prevXPos,fillToY),lineTo(fill,firstXPos,fillToY)}if(!series.spanGaps){let gaps=[];gaps.push(...findGaps(dataX,dataY,idx0,idx1,dir,pixelForX,alignGaps)),_paths.gaps=gaps=series.gaps(u,seriesIdx,idx0,idx1,gaps),_paths.clip=clipGaps(gaps,scaleX.ori,xOff,yOff,xDim,yDim)}return 0!=bandClipDir&&(_paths.band=2==bandClipDir?[clipBandLine(u,seriesIdx,idx0,idx1,stroke,-1),clipBandLine(u,seriesIdx,idx0,idx1,stroke,1)]:clipBandLine(u,seriesIdx,idx0,idx1,stroke,bandClipDir)),_paths})}(_monotoneCubic,opts)}}const ENTITY_OPTION_KEYS=new Set(["name","color","y_axis","line_width","fill_opacity","stroke_dash","hidden","transform","statistics","attribute","unit","scale","invert"]);function normaliseEntityConfig(e){if("string"==typeof e)return{entity:e};const obj=e;if("string"==typeof obj.entity)return obj;const entityKey=Object.keys(obj).find(k=>!ENTITY_OPTION_KEYS.has(k));if(entityKey){const entityValue=obj[entityKey],{[entityKey]:_ignored,...siblingOptions}=obj;return{entity:entityKey,..."object"==typeof entityValue&&null!==entityValue?entityValue:{},...siblingOptions}}return e}const DEFAULT_COLORS=["#FF6B4A","#4AAFFF","#6BDB6B","#B07AFF","#FFD166","#06D6A0","#EF476F","#118AB2"];function hexToRgba(hex,alpha){const clean=hex.replace(/^#/,"");let r,g,b;if(3===clean.length)r=parseInt(clean[0]+clean[0],16),g=parseInt(clean[1]+clean[1],16),b=parseInt(clean[2]+clean[2],16);else{if(6!==clean.length)return`rgba(0,0,0,${alpha})`;r=parseInt(clean.slice(0,2),16),g=parseInt(clean.slice(2,4),16),b=parseInt(clean.slice(4,6),16)}if(isNaN(r)||isNaN(g)||isNaN(b))return`rgba(0,0,0,${alpha})`;return`rgba(${r},${g},${b},${Math.max(0,Math.min(1,alpha))})`}function generateColors(count,palette=DEFAULT_COLORS){const result=[];for(let i=0;i<count;i++)result.push(palette[i%palette.length]);return result}function formatValue(value,unit,decimals){if(!isFinite(value))return"—";let formatted;return formatted=void 0!==decimals?value.toFixed(decimals):Number.isInteger(value)?value.toString():value.toFixed(1),unit?`${formatted} ${unit}`:formatted}function formatTime(ts){const d=new Date(ts);return`${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`}function formatDate(ts){const d=new Date(ts);return`${d.getDate().toString().padStart(2,"0")}.${(d.getMonth()+1).toString().padStart(2,"0")}`}function formatDateTime(ts){return`${formatDate(ts)} ${formatTime(ts)}`}function findNumericSensor(hass,entities,entitiesFallback,fallback="sensor.example"){const candidates=[...entities,...entitiesFallback].filter(e=>e.startsWith("sensor.")),numeric=candidates.find(e=>{const state=hass?.states?.[e];return state&&!isNaN(Number(state.state))&&state.attributes?.unit_of_measurement});return numeric??candidates[0]??fallback}const cache=new Map;function cacheKey(entityId,hours,attribute,statistics){const parts=[entityId,hours];return attribute&&parts.push(attribute),statistics&&parts.push(statistics),parts.join(":")}function applyValueModifiers(dataset,cfg){const scale=cfg.scale??1,invert=cfg.invert??!1,unitOverride=cfg.unit,needsValueChange=1!==scale||invert,needsUnitChange=void 0!==unitOverride&&unitOverride!==dataset.unit;if(!needsValueChange&&!needsUnitChange)return dataset;const factor=scale*(invert?-1:1);return{...dataset,unit:unitOverride??dataset.unit,data:needsValueChange?dataset.data.map(p=>({t:p.t,v:p.v*factor})):dataset.data}}async function getEntityData(hass,entityConfig,hours){const cfg=normaliseEntityConfig(entityConfig),entityId=cfg.entity,attribute=cfg.attribute,cached=function(entityId,hours,attribute,statistics){const key=cacheKey(entityId,hours,attribute,statistics),entry=cache.get(key);return entry?Date.now()-entry.timestamp>3e4?(cache.delete(key),null):entry.dataset:null}(entityId,hours,attribute,cfg.statistics);if(cached)return applyValueModifiers(cached,cfg);const endTime=new Date,startTime=new Date(endTime.getTime()-36e5*hours),hassEntity=hass.states[entityId],friendlyName=hassEntity?.attributes.friendly_name??entityId,unit=attribute?"":hassEntity?.attributes.unit_of_measurement??"";let rawPoints;const useStatistics=null!=cfg.statistics||hours>72;if(cfg.statistics,useStatistics){const period=cfg.statistics??function(hours){return hours<=24?"5minute":hours<=168?"hour":hours<=720?"day":"week"}(hours);rawPoints=await async function(hass,entityId,startTime,endTime,period){const entries=(await hass.callWS({type:"recorder/statistics_during_period",start_time:startTime.toISOString(),end_time:endTime.toISOString(),statistic_ids:[entityId],period:period,types:["mean","state"]}))[entityId]??[],points=[];for(const entry of entries){const v=entry.mean??entry.state;null!=v&&isFinite(v)&&points.push({t:new Date(entry.start).getTime(),v:v})}return points.length,points}(hass,entityId,startTime,endTime,period)}else rawPoints=await async function(hass,entityId,startTime,endTime,attribute){const response=await hass.callWS({type:"history/history_during_period",start_time:startTime.toISOString(),end_time:endTime.toISOString(),entity_ids:[entityId],minimal_response:!attribute,significant_changes_only:!1}),isArray=Array.isArray(response),responseKeys=isArray?[]:Object.keys(response);let entries;if(isArray?response[0]:response[responseKeys[0]],isArray)entries=response[0]??[];else{const dict=response;entries=dict[entityId]??dict[entityId.toLowerCase()]??[]}const points=[];for(const entry of entries){let v,t;if(attribute){const attrVal=(entry.a??entry.attributes)?.[attribute];v=parseFloat(String(attrVal??""))}else{const stateStr=entry.s??entry.state??"";v=parseFloat(stateStr)}isFinite(v)&&(t=void 0!==entry.lc?1e3*entry.lc:void 0!==entry.lu?1e3*entry.lu:new Date(entry.last_changed??entry.last_updated??"").getTime(),isFinite(t)&&points.push({t:t,v:v}))}return points.length,points}(hass,entityId,startTime,endTime,attribute);const dataset={entityId:entityId,friendlyName:friendlyName,unit:unit,data:rawPoints};return function(entityId,hours,dataset,attribute,statistics){cache.set(cacheKey(entityId,hours,attribute,statistics),{dataset:dataset,timestamp:Date.now()})}(entityId,hours,dataset,attribute,cfg.statistics),applyValueModifiers(dataset,cfg)}const t_ATTRIBUTE=1;let i$1=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const n="important",i=" !"+n,o=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends i$1{constructor(t$1){if(super(t$1),t$1.type!==t_ATTRIBUTE||"style"!==t$1.name||t$1.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(r)),this.render(r);for(const t of this.ft)null==r[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in r){const e=r[t];if(null!=e){this.ft.add(t);const r="string"==typeof e&&e.endsWith(i);t.includes("-")||r?s.setProperty(t,r?e.slice(0,-11):e,r?n:""):s[t]=e}}return E}});var __defProp$8=Object.defineProperty,__decorateClass$b=(decorators,target,key,kind)=>{for(var decorator,result=void 0,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=decorator(target,key,result)||result);return result&&__defProp$8(target,key,result),result};class InsightBaseCard extends i$2{constructor(){super(...arguments),this._data=[],this._loading=!1,this._cardWidth=400,this._entityIds=[],this._needsRebuild=!0}connectedCallback(){this.hass,super.connectedCallback(),this.hass&&this._fetchData(),this._startRefreshTimer()}_startRefreshTimer(){void 0!==this._refreshTimer&&clearInterval(this._refreshTimer);const interval=1e3*(this._config?.update_interval??60);console.log("[base-card] _startRefreshTimer — interval:",interval,"ms"),this._refreshTimer=setInterval(()=>{console.log("[base-card] timer fired — config:",!!this._config,"hass:",!!this.hass),this._config&&this.hass&&(cache.clear(),this._fetchData())},interval)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._refreshTimer&&(clearInterval(this._refreshTimer),this._refreshTimer=void 0)}updated(changedProps){if(super.updated(changedProps),changedProps.has("_config")&&(this._needsRebuild=!0,this._startRefreshTimer()),changedProps.has("hass")&&this.hass&&this._config){const currentTheme=this.isDarkTheme;currentTheme!==this._lastTheme&&(this._needsRebuild=!0,this._lastTheme=currentTheme);(!this._lastFetchHass||this._entityIds.some(id=>this.hass.states[id]!==this._lastFetchHass.states[id]))&&this._fetchData()}}setConfig(config){if(!config)throw new Error("Insight Cards: setConfig called without a config object");const cfg={...config};!cfg.entities&&cfg.entity&&(cfg.entities=[cfg.entity]);const resolved=cfg;if(!resolved.entities||!Array.isArray(resolved.entities)||0===resolved.entities.length)throw new Error("Insight Cards: config must contain at least one entity in the 'entities' array");this._config={...this.getDefaultConfig(),...resolved},this._entityIds=this._config.entities.map(e=>normaliseEntityConfig(e).entity),this.tagName,this._config,this.hass&&this._fetchData()}getGridOptions(){const overrides=this._config?.grid_options??{};return{columns:overrides.columns??12,rows:overrides.rows??3,min_columns:overrides.min_columns??7,min_rows:overrides.min_rows??3}}async _fetchData(){if(!this._config||!this.hass)return;const entities=this._config.entities.map(e=>normaliseEntityConfig(e).entity),prevDataRef=this._data;console.log("[base-card] fetchData START",this.tagName,{entities:entities,hours:this._config.hours}),this._loading=!0,this._error=void 0,this._lastFetchHass=this.hass;try{const hours=this._config.hours??24;this._data=await async function(hass,entities,hours){return Promise.all(entities.map(e=>getEntityData(hass,e,hours)))}(this.hass,this._config.entities,hours),console.log("[base-card] fetchData DONE",this.tagName,"| sameRef:",this._data===prevDataRef,"| points:",this._data.map(d=>({entity:d.entityId,points:d.data.length})))}catch(err){this._error=err instanceof Error?err.message:"Failed to fetch data",console.error("[base-card] fetchData ERROR",this.tagName,err)}finally{this._loading=!1}}getDefaultConfig(){return{hours:24,update_interval:60}}get entityConfigs(){return(this._config?.entities??[]).map(normaliseEntityConfig)}get isMobile(){return this._cardWidth<400}get isDarkTheme(){return!!this.hass&&(this.hass.themes?.darkMode??!1)}_getEntityColor(index,overrideColor){return overrideColor||generateColors(index+1)[index]}_renderLoading(){return b`<div class="loading-container">
        <div class="loading-spinner"></div>
        </div>`}_renderError(){return b`<div class="error">
          <span class="error-icon">⚠</span> ${this._error}
          </div>`}render(){if(!this._config)return b`<ha-card><div class="error">No configuration.</div></ha-card>`;this.offsetHeight;const styleContent={paddingTop:`${this._config.margin_top??0}px`,paddingBottom:`${this._config.margin_bottom??0}px`,paddingLeft:`${this._config.margin_left??0}px`,paddingRight:`${this._config.margin_right??0}px`};return b`
          <ha-card>
            ${this._config.title?b`<h1 class="card-header">${this._config.title}</h1>`:A}

            <div class="card-content" style="${o(styleContent)}">
              ${this._loading&&0===this._data.length?this._renderLoading():A}
              ${this._error?this._renderError():A}
              <div class="chart-container">
                ${this.renderChart()}
              </div>
            </div>
          </ha-card>`}}InsightBaseCard.styles=i$5`
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
      `,__decorateClass$b([n$1({attribute:!1})],InsightBaseCard.prototype,"hass"),__decorateClass$b([r()],InsightBaseCard.prototype,"_config"),__decorateClass$b([r()],InsightBaseCard.prototype,"_data"),__decorateClass$b([r()],InsightBaseCard.prototype,"_loading"),__decorateClass$b([r()],InsightBaseCard.prototype,"_error"),__decorateClass$b([r()],InsightBaseCard.prototype,"_cardWidth"),__decorateClass$b([e$1(".card-header")],InsightBaseCard.prototype,"_header");const translations={en:{editor:{loading:"Loading editor…",section:{general:"General",entities:"Entities",time_range:"Time range",chart_style:"Appearance",y_axis:"Y axis",data_aggregation:"Data aggregation",overlays:"Overlays",interactions:"Interactions",advanced:"Advanced"},field:{title:"Title (optional)",hours:"Time range",name:"Name",entity:"Entity",color:"Color",hex:"Hex",style:"Chart style",curve:"Interpolation",zoom:"Drag-to-zoom",show_points:"Data points",line_width:"Line width",fill_opacity:"Fill opacity",y_min:"Minimum",y_max:"Maximum",decimals:"Decimal places",logarithmic:"Logarithmic scale (base 10)",y_min_secondary:"Minimum",y_max_secondary:"Maximum",show_legend:"Show legend",show_x_axis:"Show X axis",show_y_axis:"Show Y axis",grid_opacity:"Grid opacity",tooltip_format:"Tooltip timestamp",time_format:"X-axis label format",aggregate:"Aggregation method",aggregate_period:"Aggregation period (e.g. 30m, 1h, 6h, 1d)",update_interval:"Update interval",margin_top:"Margin top",margin_bottom:"Margin bottom",margin_left:"Margin left",margin_right:"Margin right",padding_top:"Padding top",padding_bottom:"Padding bottom",padding_left:"Padding left",padding_right:"Padding right",y_axis:"Y axis",hidden:"Start hidden",stroke_dash:"Stroke dash (e.g. 5 or 8,4)",transform:"Transform",statistics:"Statistics period",attribute:"Attribute",unit:"Unit override",scale:"Scale factor",invert:"Invert values",tap_action:"Tap action",double_tap_action:"Double tap action",hold_action:"Hold action",value:"Value",label:"Label",dash:"Dash pattern (e.g. 4,3)",appearance:"Appearance",data:"Data"},action:{add_entity:"+ Add entity",remove_entity:"Remove entity",add_threshold:"+ Add threshold",add_color_threshold:"+ Add color threshold",add_interaction:"Add interaction"},option:{style:{line:"Line",line_desc:"Classic line chart without fill",area:"Area",area_desc:"Line chart with filled area below",step:"Step",step_desc:"Staircase chart, ideal for state changes"},curve:{smooth:"Smooth",linear:"Linear"},points:{none:"None",hover:"On hover",always:"Always"},tooltip:{datetime:"Date & time",time:"Time",date:"Date"},time_format:{auto:"Auto",time:"HH:MM",date:"DD.MM",datetime:"DD.MM HH:MM"}},helper:{statistics:"Uses the Statistics API instead of the History API. The sensor must have a state_class (e.g. measurement). Without a selection the History API is used.",transform:"diff: change from previous value · normalize: scale to 0–1 · cumulative: running sum",scale:"Multiplication factor for all values. Example: 0.001 converts W to kW.",attribute:"Use a numeric entity attribute as the data source instead of the state. Set the unit manually if needed.",y_min:"The axis only goes below this value if data points require it.",y_max:"The axis only goes above this value if data points require it.",y_min_secondary:"The axis only goes below this value if data points require it.",y_max_secondary:"The axis only goes above this value if data points require it.",logarithmic:"All data values must be greater than 0.",aggregate:"Groups raw data into equal time buckets on the client.",aggregate_period:"Bucket size for aggregation, e.g. 30m, 1h, 6h, 1d.",stroke_dash:"Single number for equal gaps (e.g. 5), or dash,gap pair (e.g. 8,4).",color_thresholds:"Defines a color gradient based on Y values. At least 2 thresholds required."},subsection:{threshold_lines:"Threshold lines",color_thresholds:"Color thresholds (gradient)",primary_axis:"Primary axis",secondary_axis:"Secondary axis",layout:"Layout",margin:"Margin",padding:"Padding"}},card:{error:{no_config:"No configuration.",fetch_failed:"Failed to fetch data"}}},de:{editor:{loading:"Editor wird geladen…",section:{general:"Allgemein",entities:"Entitäten",time_range:"Zeitbereich",chart_style:"Darstellung",y_axis:"Y-Achse",data_aggregation:"Datenaggregation",overlays:"Überlagerungen",interactions:"Interaktionen",advanced:"Erweitert"},field:{title:"Titel (optional)",hours:"Zeitbereich",name:"Name",entity:"Entität",color:"Farbe",hex:"Hex",style:"Diagrammstil",curve:"Interpolation",zoom:"Zoom per Drag",show_points:"Datenpunkte",line_width:"Linienbreite",fill_opacity:"Fülldeckkraft",y_min:"Minimum",y_max:"Maximum",decimals:"Nachkommastellen",logarithmic:"Logarithmische Skala (Basis 10)",y_min_secondary:"Minimum",y_max_secondary:"Maximum",show_legend:"Legende anzeigen",show_x_axis:"X-Achse anzeigen",show_y_axis:"Y-Achse anzeigen",grid_opacity:"Rasterdeckkraft",tooltip_format:"Tooltip-Zeitstempel",time_format:"X-Achsen-Beschriftungsformat",aggregate:"Aggregationsmethode",aggregate_period:"Aggregationszeitraum (z.B. 30m, 1h, 6h, 1d)",update_interval:"Aktualisierungsintervall",margin_top:"Außenabstand oben",margin_bottom:"Außenabstand unten",margin_left:"Außenabstand links",margin_right:"Außenabstand rechts",padding_top:"Innenabstand oben",padding_bottom:"Innenabstand unten",padding_left:"Innenabstand links",padding_right:"Innenabstand rechts",y_axis:"Y-Achse",hidden:"Ausgeblendet starten",stroke_dash:"Strichmuster (z.B. 5 oder 8,4)",transform:"Transformation",statistics:"Statistikzeitraum",attribute:"Attribut",unit:"Einheit (überschreiben)",scale:"Skalierungsfaktor",invert:"Werte invertieren",tap_action:"Tipp-Aktion",double_tap_action:"Doppeltipp-Aktion",hold_action:"Halten-Aktion",value:"Wert",label:"Bezeichnung",dash:"Strichmuster (z.B. 4,3)",appearance:"Darstellung",data:"Daten"},action:{add_entity:"+ Entität hinzufügen",remove_entity:"Entität entfernen",add_threshold:"+ Schwellenwert hinzufügen",add_color_threshold:"+ Farbschwellenwert hinzufügen",add_interaction:"Interaktion hinzufügen"},option:{style:{line:"Linie",line_desc:"Klassisches Liniendiagramm ohne Füllung",area:"Fläche",area_desc:"Liniendiagramm mit gefüllter Fläche darunter",step:"Stufen",step_desc:"Treppendiagramm, ideal für Zustandsänderungen"},curve:{smooth:"Smooth",linear:"Linear"},points:{none:"Keine",hover:"Bei Hover",always:"Immer"},tooltip:{datetime:"Datum & Zeit",time:"Zeit",date:"Datum"},time_format:{auto:"Auto",time:"HH:MM",date:"DD.MM",datetime:"DD.MM HH:MM"}},helper:{statistics:"Nutzt die Statistics API statt der History API. Der Sensor benötigt eine state_class (z.B. measurement). Ohne Auswahl wird die History API verwendet.",transform:"diff: Differenz zum Vorgängerwert · normalize: auf 0–1 skalieren · cumulative: aufsummieren",scale:"Multiplikationsfaktor für alle Werte. Beispiel: 0.001 wandelt W in kW um.",attribute:"Numerisches Attribut statt des Entity-States als Datenpunkt verwenden. Einheit ggf. manuell setzen.",y_min:"Die Achse unterschreitet diesen Wert nur, wenn Datenpunkte darunter liegen.",y_max:"Die Achse überschreitet diesen Wert nur, wenn Datenpunkte darüber liegen.",y_min_secondary:"Die Achse unterschreitet diesen Wert nur, wenn Datenpunkte darunter liegen.",y_max_secondary:"Die Achse überschreitet diesen Wert nur, wenn Datenpunkte darüber liegen.",logarithmic:"Alle Datenwerte müssen größer 0 sein.",aggregate:"Fasst Rohdaten clientseitig in gleichmäßige Zeitfenster zusammen.",aggregate_period:"Größe der Zeitfenster für die Aggregation, z.B. 30m, 1h, 6h, 1d.",stroke_dash:"Einzelne Zahl für gleichmäßige Lücken (z.B. 5), oder Strich,Lücke-Paar (z.B. 8,4).",color_thresholds:"Definiert einen Farbverlauf basierend auf Y-Werten. Mindestens 2 Schwellenwerte erforderlich."},subsection:{threshold_lines:"Schwellenwertlinien",color_thresholds:"Farbschwellenwerte (Gradient)",primary_axis:"Primärachse",secondary_axis:"Sekundärachse",layout:"Layout",margin:"Außenabstand",padding:"Innenabstand"}},card:{error:{no_config:"Keine Konfiguration.",fetch_failed:"Datenabruf fehlgeschlagen"}}}};function getNestedValue(obj,keyPath){return keyPath.split(".").reduce((acc,key)=>acc?.[key],obj)}function localize(key,lang="en",vars){const langKey=Object.keys(translations).includes(lang)?lang:"en",fallbackData=translations.en;let template=getNestedValue(translations[langKey],key)??getNestedValue(fallbackData,key);return"string"!=typeof template?key:template}var __defProp$7=Object.defineProperty,__decorateClass$a=(decorators,target,key,kind)=>{for(var decorator,result=void 0,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=decorator(target,key,result)||result);return result&&__defProp$7(target,key,result),result};i$5`
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
`;const TIME_PRESETS=[{label:"6h",hours:6},{label:"12h",hours:12},{label:"24h",hours:24},{label:"48h",hours:48},{label:"72h",hours:72},{label:"7d",hours:168}];class InsightBaseEditor extends i$2{setConfig(config){this._config=config}get _lang(){return this.hass?.locale?.language??"en"}renderTitleSection(){return b`
      <div class="section">
        <div class="section-header">${localize("editor.section.general",this._lang)}</div>
        <ha-textfield
          label=${localize("editor.field.title",this._lang)}
          .value=${this._config?.title??""}
          @change=${e=>this._updateConfig({title:e.target.value||void 0})}
        ></ha-textfield>
      </div>
    `}renderEntitySection(){const entities=(this._config?.entities??[]).map(normaliseEntityConfig);return b`
      <div class="section">
        <div class="section-header">${localize("editor.section.entities",this._lang)}</div>

        ${entities.map((ec,index)=>b`
            <div class="entity-row">
              <ha-entity-picker
                label="Entity ${index+1}"
                .hass=${this.hass}
                .value=${ec.entity}
                allow-custom-entity
                @value-changed=${e=>this._updateEntity(index,{entity:e.detail.value})}
              ></ha-entity-picker>

              <ha-textfield
                label=${localize("editor.field.name",this._lang)}
                .value=${ec.name??""}
                @change=${e=>this._updateEntity(index,{name:e.target.value||void 0})}
              ></ha-textfield>

              <div class="entity-row-actions">
                <ha-icon-button
                  label=${localize("editor.action.remove_entity",this._lang)}
                  .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                  @click=${()=>this._removeEntity(index)}
                ></ha-icon-button>
              </div>
            </div>
          `)}

        <mwc-button
          class="add-entity-btn"
          @click=${this._addEntity}
        >
          ${localize("editor.action.add_entity",this._lang)}
        </mwc-button>
      </div>
    `}renderTimeRangeSection(){const currentHours=this._config?.hours??24;return b`
      <div class="section">
        <div class="section-header">${localize("editor.section.time_range",this._lang)}</div>
        <div class="preset-buttons">
          ${TIME_PRESETS.map(({label:label,hours:hours})=>b`
              <mwc-button
                class="preset-btn ${currentHours===hours?"active":""}"
                dense
                @click=${()=>this._updateConfig({hours:hours})}
              >
                ${label}
              </mwc-button>
            `)}
        </div>
      </div>
    `}render(){return this._config?b`
      <div class="editor-container">
      </div>
    `:b`<div class="editor-loading">${localize("editor.loading",this._lang)}</div>`}_updateConfig(partial){this._config&&(this._config={...this._config,...partial},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0})))}_addEntity(){if(!this._config)return;const entities=[...this._config.entities??[],{entity:""}];this._updateConfig({entities:entities})}_removeEntity(index){if(!this._config)return;const entities=[...this._config.entities??[]];entities.splice(index,1),this._updateConfig({entities:entities})}_updateEntity(index,patch){if(!this._config)return;const entities=(this._config.entities??[]).map(normaliseEntityConfig);entities[index]={...entities[index],...patch},this._updateConfig({entities:entities})}}InsightBaseEditor.styles=i$5`
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
  `,__decorateClass$a([n$1({attribute:!1})],InsightBaseEditor.prototype,"hass"),__decorateClass$a([r()],InsightBaseEditor.prototype,"_config");var __defProp$6=Object.defineProperty,__getOwnPropDesc$9=Object.getOwnPropertyDescriptor,__decorateClass$9=(decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$9(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=(kind?decorator(target,key,result):decorator(result))||result);return kind&&result&&__defProp$6(target,key,result),result};let InsightToggleButton=class extends i$2{constructor(){super(...arguments),this.svg="",this.label="",this.active=!1,this.width=80,this.height=80}render(){return b`
            <button
                class="toggle-btn ${this.active?"active":""}"
                style="width:${this.width}px;height:${this.height}px;"
                aria-pressed=${this.active}
                @click=${this._handleClick}
            >
                <span class="icon" .innerHTML=${this.svg}></span>
                <span class="label">${this.label}</span>
            </button>
        `}_handleClick(){this.dispatchEvent(new CustomEvent("toggle",{detail:{active:!this.active},bubbles:!0,composed:!0}))}};InsightToggleButton.styles=i$5`
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
    `,__decorateClass$9([n$1()],InsightToggleButton.prototype,"svg",2),__decorateClass$9([n$1()],InsightToggleButton.prototype,"label",2),__decorateClass$9([n$1({type:Boolean,reflect:!0})],InsightToggleButton.prototype,"active",2),__decorateClass$9([n$1({type:Number})],InsightToggleButton.prototype,"width",2),__decorateClass$9([n$1({type:Number})],InsightToggleButton.prototype,"height",2),InsightToggleButton=__decorateClass$9([t$1("insight-toggle-button")],InsightToggleButton);var __defProp$5=Object.defineProperty,__getOwnPropDesc$8=Object.getOwnPropertyDescriptor,__decorateClass$8=(decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$8(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=(kind?decorator(target,key,result):decorator(result))||result);return kind&&result&&__defProp$5(target,key,result),result};let InsightBoxModel=class extends i$2{constructor(){super(...arguments),this.labelOuter="Margin",this.labelInner="Padding",this.keyOuter="margin",this.keyInner="padding",this.outerTop=0,this.outerRight=0,this.outerBottom=0,this.outerLeft=0,this.innerTop=8,this.innerRight=16,this.innerBottom=8,this.innerLeft=16}render(){return b`
            <div class="bm-outer">
                <span class="bm-label">${this.labelOuter}</span>
                <div class="bm-top">
                    ${this._input(`${this.keyOuter}_top`,this.outerTop)}
                </div>
                <div class="bm-middle">
                    ${this._input(`${this.keyOuter}_left`,this.outerLeft)}
                    <div class="bm-inner">
                        <span class="bm-label bm-label--inner">${this.labelInner}</span>
                        <div class="bm-top">
                            ${this._input(`${this.keyInner}_top`,this.innerTop)}
                        </div>
                        <div class="bm-middle">
                            ${this._input(`${this.keyInner}_left`,this.innerLeft)}
                            <div class="bm-chart-area"></div>
                            ${this._input(`${this.keyInner}_right`,this.innerRight)}
                        </div>
                        <div class="bm-top">
                            ${this._input(`${this.keyInner}_bottom`,this.innerBottom)}
                        </div>
                    </div>
                    ${this._input(`${this.keyOuter}_right`,this.outerRight)}
                </div>
                <div class="bm-top">
                    ${this._input(`${this.keyOuter}_bottom`,this.outerBottom)}
                </div>
            </div>
        `}_input(key,value){return b`
            <input
                class="bm-input"
                type="number"
                min="0"
                max="100"
                .value=${String(value)}
                @change=${e=>this._fire(key,parseInt(e.target.value)||0)}
            />
        `}_fire(key,value){this.dispatchEvent(new CustomEvent("value-changed",{detail:{key:key,value:value},bubbles:!0,composed:!0}))}};InsightBoxModel.styles=i$5`
        :host {
            display: block;
            margin: 8px 0px;
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
    `,__decorateClass$8([n$1({attribute:"label-outer"})],InsightBoxModel.prototype,"labelOuter",2),__decorateClass$8([n$1({attribute:"label-inner"})],InsightBoxModel.prototype,"labelInner",2),__decorateClass$8([n$1()],InsightBoxModel.prototype,"keyOuter",2),__decorateClass$8([n$1()],InsightBoxModel.prototype,"keyInner",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"outerTop",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"outerRight",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"outerBottom",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"outerLeft",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"innerTop",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"innerRight",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"innerBottom",2),__decorateClass$8([n$1({type:Number})],InsightBoxModel.prototype,"innerLeft",2),InsightBoxModel=__decorateClass$8([t$1("insight-box-model")],InsightBoxModel);var __defProp$4=Object.defineProperty,__getOwnPropDesc$7=Object.getOwnPropertyDescriptor,__decorateClass$7=(decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$7(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=(kind?decorator(target,key,result):decorator(result))||result);return kind&&result&&__defProp$4(target,key,result),result};let InsightSectionTitle=class extends i$2{constructor(){super(...arguments),this.label=""}render(){return b`
            <div class="section-title">
                <span class="line"></span>
                <span class="label">${this.label}</span>
                <span class="line"></span>
            </div>
        `}};function svgToDataUrl(svg){return`data:image/svg+xml,${encodeURIComponent(svg)}`}InsightSectionTitle.styles=i$5`
        :host {
            display: block;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 24px 0px 8px 0px;
        }

        .line {
            flex: 1;
            height: 1px;
            background: var(--divider-color, #e0e0e0);
        }

        .label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--secondary-text-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }
    `,__decorateClass$7([n$1()],InsightSectionTitle.prototype,"label",2),InsightSectionTitle=__decorateClass$7([t$1("insight-section-title")],InsightSectionTitle);const IMG_CHART_LINE=svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">\n  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>\n  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <polyline points="15,65 37,43 59,56 81,29 103,41 125,31 145,36" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>'),IMG_CHART_AREA=svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">\n  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>\n  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <polygon points="15,65 37,43 59,56 81,29 103,41 125,31 145,36 145,75 15,75" fill="rgba(74,175,255,0.18)"/>\n  <polyline points="15,65 37,43 59,56 81,29 103,41 125,31 145,36" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>'),IMG_CHART_STEP=svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">\n  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>\n  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <polyline points="15,65 37,65 37,43 59,43 59,56 81,56 81,29 103,29 103,41 125,41 125,31 145,31" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter"/>\n</svg>'),IMG_CURVE_SMOOTH=svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">\n  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>\n  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <path d="M15,65 C26,55 32,36 45,35 C58,34 64,52 75,48 C86,44 92,22 105,22 C118,22 125,35 145,32" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>'),IMG_CURVE_LINEAR=svgToDataUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">\n  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>\n  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>\n  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>\n  <polyline points="15,65 45,35 75,48 105,22 145,32" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>');var __defProp$3=Object.defineProperty,__getOwnPropDesc$6=Object.getOwnPropertyDescriptor,__decorateClass$6=(decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$6(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=(kind?decorator(target,key,result):decorator(result))||result);return kind&&result&&__defProp$3(target,key,result),result};let InsightLineCard=class extends InsightBaseCard{constructor(){super(...arguments),this._tooltipColors=[],this._overLeft=0,this._overTop=0,this._thresholdDefaultColor="#db4437",this._isZoomed=!1,this._resizeObserver=null,this._chartHeight=220}static getConfigElement(){return document.createElement("insight-line-card-editor")}static getStubConfig(hass,entities,entitiesFallback){const sensor=findNumericSensor(hass,entities,entitiesFallback);return{type:InsightLineCard.cardType,entities:[sensor],hours:24,style:"area",zoom:!0,line_width:2,show_legend:!0,margin_bottom:16,margin_top:16,margin_left:4,margin_right:4}}getDefaultConfig(){return{hours:24,style:"area",curve:"smooth",zoom:!0,line_width:2,fill_opacity:.15,update_interval:60,show_legend:!0,show_x_axis:!0,show_y_axis:!0}}_refreshChartHeight(){const total=this.offsetHeight;if(0===total)return;const legendEl=this.shadowRoot?.querySelector(".u-legend"),legendHeight=legendEl?.offsetHeight??0;let h=total;h-=this._header?.offsetHeight??0,h-=legendHeight,h-=this._config?.margin_top??0,h-=this._config?.margin_bottom??0;const clamped=Math.max(80,h);clamped!==this._chartHeight&&(this._chartHeight=clamped)}_buildSeries(config){const series=[{}],colors=generateColors(this.entityConfigs.length),ct=config.color_thresholds;return this.entityConfigs.forEach((ec,i)=>{const color=ec.color??colors[i],isArea="area"===config.style,isStep="step"===config.style||"step"===config.curve,isSmooth=!isStep&&"smooth"===config.curve,pathBuilder=isStep?uPlot.paths.stepped({align:1}):isSmooth?uPlot.paths.spline():void 0,useGradient=ct&&ct.length>=2&&!ec.color,fillOpacity=ec.fill_opacity??config.fill_opacity??.15;series.push({label:ec.name??this._data[i]?.friendlyName??ec.entity,scale:"right"===ec.y_axis?"y2":"y",stroke:useGradient?u=>this._buildColorGradient(u,ct):color,fill:isArea?useGradient?u=>this._buildColorGradient(u,ct,fillOpacity):hexToRgba(color,fillOpacity):void 0,show:!ec.hidden,width:ec.line_width??config.line_width??2,dash:null!=ec.stroke_dash?Array.isArray(ec.stroke_dash)?ec.stroke_dash:[ec.stroke_dash,ec.stroke_dash]:void 0,points:{show:!0===config.show_points,size:5},paths:pathBuilder,spanGaps:!0})}),series}_buildUplotData(){if(0===this._data.length)return[[],[]];const config=this._config,cardPeriodMs=config.aggregate_period?function(s){const m=s.match(/^(\d+(?:\.\d+)?)(m|h|d|w)$/);if(!m)return NaN;const n=parseFloat(m[1]);switch(m[2]){case"m":return 6e4*n;case"h":return 36e5*n;case"d":return 864e5*n;case"w":return 6048e5*n;default:return NaN}}(config.aggregate_period):NaN,cardMethod=config.aggregate,datasets=this._data.map((dataset,i)=>{const ec=this.entityConfigs[i],method=cardMethod,periodMs=cardPeriodMs;let data=dataset.data;return method&&isFinite(periodMs)&&(data=function(data,periodMs,method){if(0===data.length||periodMs<=0)return data;const buckets=new Map;for(const{t:t,v:v}of data){const key=Math.floor(t/periodMs)*periodMs,bucket=buckets.get(key);bucket?bucket.push(v):buckets.set(key,[v])}const result=[];for(const[key,values]of buckets){let v;switch(method){case"mean":v=values.reduce((a,b)=>a+b,0)/values.length;break;case"min":v=values.reduce((a,b)=>b<a?b:a);break;case"max":v=values.reduce((a,b)=>b>a?b:a);break;case"sum":v=values.reduce((a,b)=>a+b,0);break;case"last":v=values[values.length-1]}result.push({t:key+periodMs/2,v:v})}return result.sort((a,b)=>a.t-b.t)}(data,periodMs,method)),ec?.transform&&"none"!==ec.transform&&(data=function(data,transform){if("none"===transform||0===data.length)return data;switch(transform){case"diff":{const result=[];for(let i=1;i<data.length;i++)result.push({t:data[i].t,v:data[i].v-data[i-1].v});return result}case"normalize":{const vals=data.map(p=>p.v),min=Math.min(...vals),range=Math.max(...vals)-min;return 0===range?data.map(p=>({t:p.t,v:0})):data.map(p=>({t:p.t,v:(p.v-min)/range}))}case"cumulative":{let sum=0;return data.map(p=>({t:p.t,v:sum+=p.v}))}}}(data,ec.transform)),data}),allTimestamps=new Set;for(const data of datasets)for(const point of data)allTimestamps.add(Math.floor(point.t/1e3));const timestamps=Array.from(allTimestamps).sort((a,b)=>a-b),valueSeries=datasets.map(data=>{const map=new Map;for(const point of data)map.set(Math.floor(point.t/1e3),point.v);return timestamps.map(ts=>map.get(ts)??null)});return console.log("uPlot data built",valueSeries),[timestamps,...valueSeries]}_buildOptions(config){const chartWidth=Math.max(100,this.wrapper?.clientWidth||this._cardWidth-32);let chartHeight=this._chartHeight;const isDark=this.isDarkTheme,cs=getComputedStyle(this),axisStroke=isDark?"rgba(255,255,255,0.55)":cs.getPropertyValue("--secondary-text-color").trim()||"rgba(0,0,0,0.55)",gridOpacity=config.grid_opacity??1,gridStroke=1===gridOpacity?isDark?"rgba(255,255,255,0.08)":cs.getPropertyValue("--divider-color").trim()||"rgba(0,0,0,0.08)":isDark?`rgba(255,255,255,${(.08*gridOpacity).toFixed(3)})`:`rgba(0,0,0,${(.08*gridOpacity).toFixed(3)})`,yMin=config.y_min,yMax=config.y_max;let yScaleOpts;yScaleOpts=!0===config.logarithmic?{distr:3,log:10,auto:!0}:Array.isArray(config.y_range)?{range:config.y_range}:void 0!==yMin||void 0!==yMax?{range:(_u,dataMin,dataMax)=>[void 0!==yMin?Math.min(dataMin,yMin):dataMin,void 0!==yMax?Math.max(dataMax,yMax):dataMax]}:{auto:!0};const hasSecondaryAxis=this.entityConfigs.some(ec=>"right"===ec.y_axis),y2Min=config.y_min_secondary,y2Max=config.y_max_secondary;let y2ScaleOpts;y2ScaleOpts=Array.isArray(config.y_range_secondary)?{range:config.y_range_secondary}:void 0!==y2Min||void 0!==y2Max?{range:(_u,dataMin,dataMax)=>[void 0!==y2Min?Math.min(dataMin,y2Min):dataMin,void 0!==y2Max?Math.max(dataMax,y2Max):dataMax]}:{auto:!0};const primaryUnits=[...new Set(this.entityConfigs.filter(ec=>"right"!==ec.y_axis).map((_,i)=>this._data[i]?.unit).filter(Boolean))],secondaryUnits=[...new Set(this.entityConfigs.flatMap((ec,i)=>"right"===ec.y_axis?[this._data[i]?.unit]:[]).filter(Boolean))],yUnit=1===primaryUnits.length?primaryUnits[0]:"",y2Unit=1===secondaryUnits.length?secondaryUnits[0]:"",decimals=config.decimals,yValFormatter=(_u,vals)=>vals.map(v=>null==v?"":formatValue(v,void 0,decimals)),yAxisSize=(u,vals)=>{if(!vals?.length)return 40;u.ctx.save(),u.ctx.font="12px sans-serif";const maxW=vals.reduce((m,v)=>null==v?m:Math.max(m,u.ctx.measureText(String(v)).width),0);return u.ctx.restore(),Math.max(32,Math.ceil(maxW)+14)};return{width:chartWidth,height:chartHeight,cursor:{show:!0,drag:{x:!1!==config.zoom,y:!1,uni:50},focus:{prox:16},...!1===config.show_points?{points:{show:()=>{}}}:{}},scales:{x:{time:!0},y:yScaleOpts,...hasSecondaryAxis?{y2:y2ScaleOpts}:{}},series:this._buildSeries(config),axes:[{show:!1!==config.show_x_axis,stroke:axisStroke,grid:{stroke:gridStroke,width:1},ticks:{stroke:gridStroke,width:1},font:"12px sans-serif",...config.time_format&&"auto"!==config.time_format?{values:(_u,vals)=>vals.map(v=>{const ms=1e3*v;return"time"===config.time_format?formatTime(ms):"date"===config.time_format?formatDate(ms):formatDateTime(ms)})}:{}},{show:!1!==config.show_y_axis,scale:"y",stroke:axisStroke,grid:{stroke:gridStroke,width:1},ticks:{stroke:gridStroke,width:1},font:"12px sans-serif",size:yAxisSize,label:yUnit,labelSize:yUnit?16:0,labelFont:"11px sans-serif",values:yValFormatter},...hasSecondaryAxis?[{show:!1!==config.show_y_axis,scale:"y2",side:1,stroke:axisStroke,grid:{show:!1},ticks:{stroke:gridStroke,width:1},font:"12px sans-serif",size:yAxisSize,label:y2Unit,labelSize:y2Unit?16:0,labelFont:"11px sans-serif",values:yValFormatter}]:[{show:!1,side:1,scale:"y",size:yAxisSize,gap:0,stroke:axisStroke,grid:{show:!1},ticks:{show:!1}}]],legend:{show:!1!==config.show_legend,live:!1},hooks:{setScale:[(u,key)=>{if("x"!==key)return;const xs=u.data[0];if(!xs?.length)return;const fullMin=xs[0],fullMax=xs[xs.length-1],curMin=u.scales.x?.min??fullMin,curMax=u.scales.x?.max??fullMax,zoomed=curMin>fullMin||curMax<fullMax;this._zoomedRange=zoomed?[curMin,curMax]:void 0,this._isZoomed=zoomed}],setCursor:[u=>this._updateTooltip(u)],draw:config.thresholds?.length?[u=>this._drawThresholds(u,config.thresholds)]:[],ready:[u=>{this._tooltipEl=document.createElement("div"),this._tooltipEl.className="u-tooltip",u.root.appendChild(this._tooltipEl),this._overLeft=u.over.offsetLeft,this._overTop=u.over.offsetTop,this._attachPinchHandlers(u),u.over.addEventListener("dblclick",e=>{e.stopImmediatePropagation(),clearTimeout(this._tapTimer),this._handleAction("double_tap_action")},{capture:!0})}],setSize:[u=>{this._overLeft=u.over.offsetLeft,this._overTop=u.over.offsetTop}],destroy:[()=>{this._tooltipEl=void 0,this._detachPinchHandlers(),this._pinch=void 0}]},padding:[config.padding_top??8,config.padding_right??16,config.padding_bottom??8,config.padding_left??16]}}_handleAction(actionType){const cfg=this._config,action=cfg?.[actionType];if(action){if("none"!==action.action)switch(action.action){case"more-info":this._fireMoreInfo(cfg);break;case"navigate":action.navigation_path&&(history.pushState(null,"",action.navigation_path),this.dispatchEvent(new CustomEvent("location-changed",{bubbles:!0,composed:!0})));break;case"url":action.url_path&&window.open(action.url_path,"_blank");break;case"perform-action":{const serviceStr=action.perform_action??action.service??"",[domain,service]=serviceStr.split(".",2);domain&&service&&this.hass?.callService(domain,service,action.data??action.service_data??{});break}}}else"tap_action"===actionType&&this._fireMoreInfo(cfg)}_fireMoreInfo(cfg){const first=cfg?.entities?.[0];if(!first)return;const entityId=normaliseEntityConfig(first).entity;entityId&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:entityId},bubbles:!0,composed:!0}))}_buildColorGradient(u,thresholds,opacity=1){if(!isFinite(u.bbox.top)||!isFinite(u.bbox.height)||0===u.bbox.height){const mid=thresholds[Math.floor(thresholds.length/2)],c=mid?.color??thresholds[0]?.color??"#888";return opacity<1?hexToRgba(c,opacity):c}const grad=u.ctx.createLinearGradient(0,u.bbox.top,0,u.bbox.top+u.bbox.height),sorted=[...thresholds].sort((a,b)=>b.value-a.value);for(const t of sorted){const yPx=u.valToPos(t.value,"y",!0),stop=Math.max(0,Math.min(1,(yPx-u.bbox.top)/u.bbox.height)),color=opacity<1?hexToRgba(t.color,opacity):t.color;grad.addColorStop(stop,color)}return grad}_drawThresholds(u,thresholds){const defaultColor=this._thresholdDefaultColor,dpr=window.devicePixelRatio??1,ctx=u.ctx;ctx.save();for(const t of thresholds){const y=Math.round(u.valToPos(t.value,"y",!0));y<u.bbox.top||y>u.bbox.top+u.bbox.height||(ctx.beginPath(),ctx.strokeStyle=t.color??defaultColor,ctx.lineWidth=dpr,ctx.setLineDash((t.dash??[4,3]).map(v=>v*dpr)),ctx.moveTo(u.bbox.left,y),ctx.lineTo(u.bbox.left+u.bbox.width,y),ctx.stroke(),t.label&&(ctx.setLineDash([]),ctx.fillStyle=t.color??defaultColor,ctx.font=11*dpr+"px sans-serif",ctx.textAlign="right",ctx.textBaseline="bottom",ctx.fillText(t.label,u.bbox.left+u.bbox.width-4*dpr,y-2*dpr)))}ctx.restore()}_updateTooltip(u){const tooltip=this._tooltipEl;if(!tooltip)return;const idx=u.cursor.idx;if(null==idx||(u.cursor.left??-1)<0)return void(tooltip.style.display="none");const ts=u.data[0][idx];if(null==ts)return void(tooltip.style.display="none");const tsMs=1e3*ts,fmt=this._config.tooltip_format??"datetime",timeLabel="time"===fmt?formatTime(tsMs):"date"===fmt?formatDate(tsMs):formatDateTime(tsMs),rows=this._data.map((dataset,i)=>{const val=u.data[i+1]?.[idx];if(null==val)return"";const unit=dataset.unit?` ${dataset.unit}`:"";return`<div class="u-tooltip-row">\n        <span class="u-tooltip-dot" style="background:${this._tooltipColors[i]??"#888"}"></span>\n        <span class="u-tooltip-name">${dataset.friendlyName}</span>\n        <span class="u-tooltip-value">${formatValue(val)}${unit}</span>\n      </div>`}).filter(Boolean).join("");tooltip.innerHTML=`<div class="u-tooltip-time">${timeLabel}</div>${rows}`,tooltip.style.display="block";const left=u.cursor.left+this._overLeft,top=u.cursor.top+this._overTop,flip=left>u.width/2;tooltip.style.left=`${left+(flip?-12:12)}px`,tooltip.style.top=`${top}px`,tooltip.style.transform=flip?"translate(-100%, -50%)":"translateY(-50%)"}_attachPinchHandlers(u){const over=u.over,onStart=e=>{if(2!==e.touches.length)return;const t0=e.touches[0],t1=e.touches[1],dist=Math.hypot(t1.clientX-t0.clientX,t1.clientY-t0.clientY);this._pinch={dist:dist,scaleMin:u.scales.x?.min??u.data[0][0],scaleMax:u.scales.x?.max??u.data[0][u.data[0].length-1]}},onMove=e=>{if(2!==e.touches.length||!this._pinch)return;e.preventDefault();const t0=e.touches[0],t1=e.touches[1],newDist=Math.hypot(t1.clientX-t0.clientX,t1.clientY-t0.clientY),{dist:initDist,scaleMin:scaleMin,scaleMax:scaleMax}=this._pinch,newRange=(scaleMax-scaleMin)*(initDist/newDist),rect=over.getBoundingClientRect(),centerPx=(t0.clientX+t1.clientX)/2-rect.left,centerTime=u.posToVal(centerPx,"x");let newMin=centerTime-newRange/2,newMax=centerTime+newRange/2;const xs=u.data[0],dataMin=xs[0],dataMax=xs[xs.length-1];newMin<dataMin&&(newMin=dataMin,newMax=Math.min(dataMax,dataMin+newRange)),newMax>dataMax&&(newMax=dataMax,newMin=Math.max(dataMin,dataMax-newRange)),newMax-newMin<60||u.setScale("x",{min:newMin,max:newMax})},onEnd=e=>{e.touches.length<2&&(this._pinch=void 0)};over.addEventListener("touchstart",onStart,{passive:!0}),over.addEventListener("touchmove",onMove,{passive:!1}),over.addEventListener("touchend",onEnd,{passive:!0}),this._touchHandlers={start:onStart,move:onMove,end:onEnd,target:over}}_detachPinchHandlers(){if(!this._touchHandlers)return;const{start:start,move:move,end:end,target:target}=this._touchHandlers;target.removeEventListener("touchstart",start),target.removeEventListener("touchmove",move),target.removeEventListener("touchend",end),this._touchHandlers=void 0}renderChart(){this._config;return this._config?b`
            <div
                class="chart-wrapper"
                @click=${()=>{this._tapTimer=setTimeout(()=>this._handleAction("tap_action"),250)}}
            >
                <div id="chart"></div>
                ${this._isZoomed?b`<button
                          class="zoom-reset-btn"
                          @click=${this._resetZoom}
                          title="Reset zoom"
                      >
                          <ha-svg-icon
                              .path=${"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"}
                          ></ha-svg-icon>
                      </button>`:""}
            </div>
        `:b``}_resetZoom(e){if(e.stopPropagation(),!this._uplot)return;const xs=this._uplot.data[0];xs?.length&&(this._zoomedRange=void 0,this._isZoomed=!1,this._uplot.setScale("x",{min:xs[0],max:xs[xs.length-1]}))}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(([entry])=>{this._refreshChartHeight();const height=this._chartHeight,width=this.wrapper?.clientWidth??entry.contentRect.width;width<10||height<10||(this._uplot?this._uplot.setSize({width:width,height:height}):this._syncUplot())}),this.updateComplete.then(()=>{this._resizeObserver.observe(this),this._uplot||this._syncUplot()})}updated(changedProps){super.updated(changedProps);const changedKeys=[...changedProps.keys()];if(console.log("[line-card] updated — changedProps:",changedKeys,"| _uplot:",!!this._uplot,"| _needsRebuild:",this._needsRebuild,"| dataChanged:",this._data!==this._lastDataRef,"| _data.length:",this._data.length,"| _lastDataRef:",this._lastDataRef?`[${this._lastDataRef.length} entities]`:"undefined"),this._needsRebuild&&this._uplot)return console.log("[line-card] → full rebuild (needsRebuild)"),void this._syncUplot();if(this._uplot&&this._data!==this._lastDataRef){const previouslyEmpty=!this._lastDataRef||this._lastDataRef.every(d=>0===d.data.length);console.log("[line-card] → data changed, previouslyEmpty:",previouslyEmpty,"| old points:",this._lastDataRef?.map(d=>d.data.length),"| new points:",this._data.map(d=>d.data.length)),this._cachedUData=this._buildUplotData(),this._lastDataRef=this._data,previouslyEmpty?(console.log("[line-card] → full rebuild (was empty)"),this._needsRebuild=!0,this._syncUplot()):this._zoomedRange?(console.log("[line-card] → setData (zoomed, preserving range)"),this._uplot.setData(this._cachedUData,!1),this._uplot.setScale("x",{min:this._zoomedRange[0],max:this._zoomedRange[1]})):(console.log("[line-card] → setData(true) — auto-scale X+Y"),this._uplot.setData(this._cachedUData,!0))}else this._uplot?console.log("[line-card] → _data unchanged (same reference), no chart update"):console.log("[line-card] → _uplot is null, skipping (waiting for _syncUplot from connectedCallback)")}_syncUplot(){console.log("[_syncUpload]",this._config,this._data);const config=this._config;if(!config||!this.wrapper)return;const needsFull=this._needsRebuild||!this._uplot,dataChanged=this._data!==this._lastDataRef;(needsFull||dataChanged)&&(this._cachedUData=this._buildUplotData(),this._lastDataRef=this._data);const uData=this._cachedUData;if(needsFull){const palette=generateColors(this.entityConfigs.length);this._tooltipColors=this.entityConfigs.map((ec,i)=>ec.color??palette[i]),this._thresholdDefaultColor=getComputedStyle(this).getPropertyValue("--error-color").trim()||"#db4437";const opts=this._buildOptions(config);this._uplot?.destroy(),this._uplot=void 0,this._uplot=new uPlot(opts,uData,this.wrapper),this._needsRebuild=!1,this._zoomedRange&&this._uplot.setScale("x",{min:this._zoomedRange[0],max:this._zoomedRange[1]})}else{const chartWidth=Math.max(100,this.wrapper.clientWidth||this._cardWidth-32),chartHeight=this._chartHeight;dataChanged&&(this._zoomedRange?(this._uplot.setData(uData,!1),this._uplot.setScale("x",{min:this._zoomedRange[0],max:this._zoomedRange[1]})):this._uplot.setData(uData,!0)),this._uplot.setSize({width:chartWidth,height:chartHeight})}}disconnectedCallback(){super.disconnectedCallback(),this._uplot?.destroy(),this._uplot=void 0,this._lastDataRef=void 0,this._cachedUData=void 0,this._zoomedRange=void 0,this._isZoomed=!1}};InsightLineCard.styles=[InsightBaseCard.styles,i$5`
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
                z-index: 1;
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
        `],InsightLineCard.cardType="custom:insight-line-card",InsightLineCard.cardName="Insight Line Card",InsightLineCard.cardDescription="Interactive time-series line & area chart with zoom",__decorateClass$6([r()],InsightLineCard.prototype,"_isZoomed",2),__decorateClass$6([e$1("#chart")],InsightLineCard.prototype,"wrapper",2),__decorateClass$6([e$1(".chart-wrapper")],InsightLineCard.prototype,"_chartWrapper",2),InsightLineCard=__decorateClass$6([t$1("insight-line-card")],InsightLineCard),window.customCards=window.customCards??[],window.customCards.push({type:InsightLineCard.cardType.replace("custom:",""),name:InsightLineCard.cardName,description:InsightLineCard.cardDescription,preview:!0});class InsightEntityTab{constructor(index,config){this.index=index,this.config=void 0!==config?normaliseEntityConfig(config):{entity:""}}}const ENTITY_BASE_SCHEMA=[{name:"entity",selector:{entity:{}}},{name:"name",selector:{text:{}}},{name:"y_axis",selector:{select:{mode:"list",options:[{value:"left",label:"Primary axis"},{value:"right",label:"Secondary axis"}]}}},{name:"hidden",selector:{boolean:{}}}];const DATA_SCHEMA=[{name:"attribute",selector:{text:{}}},{name:"unit",selector:{text:{}}},{name:"scale",selector:{number:{step:.001,mode:"box"}}},{name:"invert",selector:{boolean:{}}},{name:"transform",selector:{select:{options:[{value:"none",label:"None"},{value:"diff",label:"Difference"},{value:"normalize",label:"Normalize (0–1)"},{value:"cumulative",label:"Cumulative"}]}}},{name:"statistics",selector:{select:{options:[{value:"none",label:"None (use History API)"},{value:"5minute",label:"5 minutes"},{value:"hour",label:"Hour"},{value:"day",label:"Day"},{value:"week",label:"Week"},{value:"month",label:"Month"}]}}}];var __defProp$2=Object.defineProperty,__getOwnPropDesc$5=Object.getOwnPropertyDescriptor,__decorateClass$5=(decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$5(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=(kind?decorator(target,key,result):decorator(result))||result);return kind&&result&&__defProp$2(target,key,result),result};let InsightLineEntityEditor=class extends i$2{constructor(){super(...arguments),this.chartStyle="area",this._computeLabel=schema=>localize(`editor.field.${schema.name}`,this._lang),this._computeHelper=schema=>{const key=`editor.helper.${schema.name}`,result=localize(key,this._lang);return result===key?"":result}}get _lang(){return this.hass?.locale?.language??"en"}render(){if(!this.tab)return b`${A}`;const ec=this.tab.config,dashStr=Array.isArray(ec.stroke_dash)?ec.stroke_dash.join(","):null!=ec.stroke_dash?String(ec.stroke_dash):"",baseData={entity:ec.entity??"",name:ec.name??"",y_axis:ec.y_axis??"left",hidden:ec.hidden??!1},appearanceData={line_width:ec.line_width,fill_opacity:ec.fill_opacity,stroke_dash:dashStr},dataData={attribute:ec.attribute??"",unit:ec.unit??"",scale:ec.scale,invert:ec.invert??!1,transform:ec.transform??"none",statistics:ec.statistics??"none"};return b`
            <div class="entity-editor-content">
                <div class="entity-top-row">
                    <ha-icon-button
                        .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                        @click=${this._handleDelete}
                    ></ha-icon-button>
                </div>

                <div class="color-row">
                    <div class="color-label">
                        ${localize("editor.field.color",this._lang)}
                    </div>
                    <input
                        type="color"
                        class="color-swatch"
                        .value=${ec.color??DEFAULT_COLORS[this.tab.index-1]??DEFAULT_COLORS[0]}
                        @input=${e=>this._patch({color:e.target.value})}
                    />
                </div>

                <ha-form
                    .hass=${this.hass}
                    .schema=${ENTITY_BASE_SCHEMA}
                    .data=${baseData}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${e=>this._onBaseChanged(e.detail.value)}
                ></ha-form>

                <insight-section-title
                    .label=${localize("editor.field.appearance",this._lang)}
                ></insight-section-title>
                <ha-form
                    .hass=${this.hass}
                    .schema=${style=this.chartStyle??"area",[{name:"line_width",selector:{number:{min:.5,max:10,step:.5,mode:"slider",unit_of_measurement:"px"}}},..."area"===style?[{name:"fill_opacity",selector:{number:{min:0,max:1,step:.05,mode:"slider"}}}]:[],{name:"stroke_dash",selector:{text:{}}}]}
                    .data=${appearanceData}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${e=>this._onAppearanceChanged(e.detail.value)}
                ></ha-form>

                <insight-section-title
                    .label=${localize("editor.field.data",this._lang)}
                ></insight-section-title>
                <ha-form
                    .hass=${this.hass}
                    .schema=${DATA_SCHEMA}
                    .data=${dataData}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${e=>this._onDataChanged(e.detail.value)}
                ></ha-form>
            </div>
        `;var style}_onBaseChanged(raw){const detail={...this.tab.config};detail.entity=raw.entity??detail.entity,detail.y_axis=raw.y_axis??detail.y_axis,detail.hidden=raw.hidden,raw.name?detail.name=raw.name:delete detail.name,this.dispatchEvent(new CustomEvent("onChange",{detail:detail}))}_onAppearanceChanged(raw){const dashStr=raw.stroke_dash,parsedDash=dashStr?dashStr.includes(",")?dashStr.split(",").map(Number).filter(n=>!isNaN(n)):Number(dashStr)||void 0:void 0,detail={...this.tab.config};detail.line_width=raw.line_width,detail.fill_opacity=raw.fill_opacity,null!=parsedDash?detail.stroke_dash=parsedDash:delete detail.stroke_dash,this.dispatchEvent(new CustomEvent("onChange",{detail:detail}))}_onDataChanged(raw){const detail={...this.tab.config};raw.attribute?detail.attribute=raw.attribute:delete detail.attribute,raw.unit?detail.unit=raw.unit:delete detail.unit,null!=raw.scale?detail.scale=raw.scale:delete detail.scale,detail.invert=raw.invert,detail.transform=raw.transform||void 0;const statsRaw=raw.statistics;statsRaw&&"none"!==statsRaw?detail.statistics=statsRaw:delete detail.statistics,this.dispatchEvent(new CustomEvent("onChange",{detail:detail}))}_patch(patch){const updated={...this.tab.config,...patch};this.dispatchEvent(new CustomEvent("onChange",{detail:updated}))}_handleDelete(){this.dispatchEvent(new CustomEvent("onDelete",{detail:this.tab.index}))}};InsightLineEntityEditor.styles=i$5`
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
    `,__decorateClass$5([n$1({attribute:!1})],InsightLineEntityEditor.prototype,"hass",2),__decorateClass$5([n$1({attribute:!1})],InsightLineEntityEditor.prototype,"tab",2),__decorateClass$5([n$1()],InsightLineEntityEditor.prototype,"chartStyle",2),InsightLineEntityEditor=__decorateClass$5([t$1("insight-line-entity-editor")],InsightLineEntityEditor);var __defProp$1=Object.defineProperty,__getOwnPropDesc$4=Object.getOwnPropertyDescriptor,__getProtoOf$2=Object.getPrototypeOf,__reflectGet$2=Reflect.get,__decorateClass$4=(decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$4(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=(kind?decorator(target,key,result):decorator(result))||result);return kind&&result&&__defProp$1(target,key,result),result};function dropEmpty(data){return Object.fromEntries(Object.entries(data).filter(([,v])=>null!=v&&""!==v))}const Y_AXIS_GENERAL_SCHEMA=[{name:"logarithmic",selector:{boolean:{}}},{name:"decimals",selector:{number:{min:0,max:6,step:1,mode:"box"}}}],Y_AXIS_PRIMARY_SCHEMA=[{name:"y_min",selector:{number:{step:.1,mode:"box"}}},{name:"y_max",selector:{number:{step:.1,mode:"box"}}}],Y_AXIS_SECONDARY_SCHEMA=[{name:"y_min_secondary",selector:{number:{step:.1,mode:"box"}}},{name:"y_max_secondary",selector:{number:{step:.1,mode:"box"}}}];const ADVANCED_SCHEMA=[{name:"update_interval",selector:{number:{min:10,max:3600,step:10,mode:"box",unit_of_measurement:"s"}}}],THRESHOLD_SCHEMA=[{name:"value",selector:{number:{step:.1,mode:"box"}}},{name:"label",selector:{text:{}}},{name:"dash",selector:{text:{}}}],COLOR_THRESHOLD_SCHEMA=[{name:"value",selector:{number:{step:.1,mode:"box"}}}];let InsightLineCardEditor=class extends InsightBaseEditor{constructor(){super(...arguments),this._tabs=[],this._currTab="1",this._hoursOptions=[{value:"6",label:"6h"},{value:"12",label:"12h"},{value:"24",label:"24h"},{value:"48",label:"48h"},{value:"72",label:"72h"},{value:"168",label:"7d"}],this._addTab=()=>{const newTab=new InsightEntityTab(this._tabs.length+1,void 0);this._tabs=[...this._tabs,newTab],this._currTab=newTab.index.toString(),this._syncEntitiesToConfig()},this._interactionsSchema=[{name:"tap_action",selector:{ui_action:{actions:["perform-action","assist","url","navigate","none"],default_action:"more-info"}}},{name:"",type:"optional_actions",flatten:!0,schema:["double_tap_action","hold_action"].map(action=>({name:action,selector:{ui_action:{actions:["more-info","perform-action","assist","navigate","url","none"],default_action:"none"}}}))}],this._computeLabel=schema=>"title"in schema?schema.title:localize(`editor.field.${schema.name}`,this._lang),this._computeHelper=schema=>{const key=`editor.helper.${schema.name}`,result=localize(key,this._lang);return result===key?"":result},this._appendThreshold=()=>{const thresholds=[...this._lineConfig.thresholds??[],{value:0,color:"#db4437"}];this._updateConfig({thresholds:thresholds})},this._appendColorThreshold=()=>{const color_thresholds=[...this._lineConfig.color_thresholds??[],{value:0,color:"#03a9f4"}];this._updateConfig({color_thresholds:color_thresholds})}}get _lineConfig(){return this._config??{}}setConfig(config){super.setConfig(config);const cfg=config;this._tabs=(cfg.entities??[]).map((e,i)=>new InsightEntityTab(i+1,e)),0===this._tabs.length&&this._addTab()}renderCardOptions(){return b`${A}`}render(){return this._config?b`
            <div class="editor-container">
                ${this._renderGeneralSection()} ${this._renderEntitySection()}
                ${this._renderChartStyleSection()} ${this._renderYAxisSection()}
                ${this._renderAggregationSection()}
                ${this._renderOverlaysSection()}
                ${this._renderInteractionsSection()}
                ${this._renderAdvancedSection()}
            </div>
        `:b`<div class="editor-loading">
                ${localize("editor.loading",this._lang)}
            </div>`}_renderGeneralSection(){const cfg=this._lineConfig,data={title:cfg.title??"",style:cfg.style??"area",curve:cfg.curve??"smooth"};return b`
            <div class="section">
                <ha-form
                    .hass=${this.hass}
                    .schema=${function(lang,cfg){const isStep="step"===cfg.style;return[{name:"title",selector:{text:{}}},{name:"style",required:!0,selector:{select:{mode:"box",options:[{value:"line",label:localize("editor.option.style.line",lang),image:IMG_CHART_LINE},{value:"area",label:localize("editor.option.style.area",lang),image:IMG_CHART_AREA},{value:"step",label:localize("editor.option.style.step",lang),image:IMG_CHART_STEP}]}}},...isStep?[]:[{name:"curve",selector:{select:{mode:"box",options:[{value:"smooth",label:localize("editor.option.curve.smooth",lang),image:IMG_CURVE_SMOOTH},{value:"linear",label:localize("editor.option.curve.linear",lang),image:IMG_CURVE_LINEAR}]}}}]]}(this._lang,cfg)}
                    .data=${data}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${e=>this._updateConfig(e.detail.value)}
                ></ha-form>
                <div class="control-row">
                    <span class="control-label"
                        >${localize("editor.field.hours",this._lang)}</span
                    >
                    <ha-control-select
                        .options=${this._hoursOptions}
                        .value=${String(cfg.hours??24)}
                        @value-changed=${e=>this._updateConfig({hours:Number(e.detail.value)})}
                    ></ha-control-select>
                </div>
            </div>
        `}_renderEntitySection(){const currentTab=this._tabs.find(t=>t.index.toString()===this._currTab)??this._tabs[0];return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${"M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.entities",this._lang)}</span
                >
                <div class="entities-panel">
                    <div class="entities-toolbar">
                        <ha-tab-group @wa-tab-show=${this._handleTabChanged}>
                            ${this._tabs.map(tab=>b`
                                    <ha-tab-group-tab
                                        slot="nav"
                                        .panel=${tab.index}
                                        .active=${this._currTab===tab.index.toString()}
                                    >
                                        ${tab.index}
                                    </ha-tab-group-tab>
                                `)}
                        </ha-tab-group>
                        <ha-icon-button
                            .path=${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}
                            .label=${localize("editor.action.add_entity",this._lang)}
                            @click=${this._addTab}
                        ></ha-icon-button>
                    </div>

                    ${currentTab?b`
                              <insight-line-entity-editor
                                  .hass=${this.hass}
                                  .tab=${currentTab}
                                  .chartStyle=${this._lineConfig.style??"area"}
                                  @onChange=${this._handleEntityChange}
                                  @onDelete=${this._handleEntityDelete}
                              ></insight-line-entity-editor>
                          `:A}
                </div>
            </ha-expansion-panel>
        `}_handleTabChanged(e){const next=e.detail.name?.toString();next&&next!==this._currTab&&(this._currTab=next)}_handleEntityChange(e){e.stopPropagation();const idx=this._tabs.findIndex(t=>t.index.toString()===this._currTab);-1!==idx&&(this._tabs[idx].config=e.detail,this._syncEntitiesToConfig())}_handleEntityDelete(e){e.stopPropagation();const delIndex=e.detail;this._tabs=this._tabs.filter(t=>t.index!==delIndex).map((t,i)=>new InsightEntityTab(i+1,t.config));const newCurr=Math.max(1,parseInt(this._currTab)-1);this._currTab=this._tabs.length>0?Math.min(newCurr,this._tabs.length).toString():"1",this._syncEntitiesToConfig()}_syncEntitiesToConfig(){this._updateConfig({entities:this._tabs.filter(t=>t.config.entity).map(t=>function(ec){const{entity:entity,...options}=ec,cleanOptions=Object.fromEntries(Object.entries(options).filter(([,v])=>null!=v));return 0===Object.keys(cleanOptions).length?entity:{[entity]:cleanOptions}}(t.config))})}_renderChartStyleSection(){const cfg=this._lineConfig,showPointsStr=!0===cfg.show_points?"true":"hover"===cfg.show_points?"hover":"false",data={line_width:cfg.line_width??2,fill_opacity:cfg.fill_opacity??.15,grid_opacity:cfg.grid_opacity??1},timeFormatOptions=[{value:"auto",label:localize("editor.option.time_format.auto",this._lang)},{value:"time",label:localize("editor.option.time_format.time",this._lang)},{value:"date",label:localize("editor.option.time_format.date",this._lang)},{value:"datetime",label:localize("editor.option.time_format.datetime",this._lang)}],tooltipOptions=[{value:"datetime",label:localize("editor.option.tooltip.datetime",this._lang)},{value:"time",label:localize("editor.option.tooltip.time",this._lang)},{value:"date",label:localize("editor.option.tooltip.date",this._lang)}],pointsOptions=[{value:"false",label:localize("editor.option.points.none",this._lang)},{value:"hover",label:localize("editor.option.points.hover",this._lang)},{value:"true",label:localize("editor.option.points.always",this._lang)}];return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${"M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.chart_style",this._lang)}</span
                >
                <div class="panel-content">
                    <div class="toggle-row">
                        <insight-toggle-button
                            .svg=${'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="1" opacity="0.3"/>\n  <line x1="2" y1="4"  x2="2"  y2="20" stroke="currentColor" stroke-width="1" opacity="0.3"/>\n  <polyline points="2,17 6,12 10,14 14,8 18,10 22,7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>\n  <rect x="8" y="6" width="10" height="10" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 1.5" rx="1"/>\n  <circle cx="8" cy="6" r="1.2" fill="currentColor"/>\n  <circle cx="18" cy="16" r="1.2" fill="currentColor"/>\n  <line x1="5" y1="3" x2="7.5" y2="5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <polyline points="5,5.5 5,3 7.5,3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>\n  <line x1="19" y1="21" x2="16.5" y2="18.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <polyline points="19,18.5 19,21 16.5,21" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>'}
                            .label=${localize("editor.field.zoom",this._lang)}
                            .width=${110}
                            .height=${120}
                            ?active=${!1!==cfg.zoom}
                            @toggle=${()=>this._updateConfig({zoom:!1===cfg.zoom})}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <line x1="2" y1="2"  x2="2"  y2="16" stroke="currentColor" stroke-width="1" opacity="0.3"/>\n  <line x1="2" y1="16" x2="22" y2="16" stroke="currentColor" stroke-width="1" opacity="0.3"/>\n  <polyline points="2,13 6,9 10,11 15,5 22,8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>\n  <rect x="2" y="18" width="20" height="5" rx="1" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="0.8"/>\n  <line x1="4" y1="20.5" x2="8" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\n  <circle cx="6" cy="20.5" r="1" fill="currentColor"/>\n  <line x1="10" y1="20.5" x2="14" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1.5 1"/>\n  <circle cx="12" cy="20.5" r="1" fill="currentColor"/>\n  <line x1="16" y1="20.5" x2="20" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\n</svg>'}
                            .label=${localize("editor.field.show_legend",this._lang)}
                            .width=${110}
                            .height=${120}
                            ?active=${!1!==cfg.show_legend}
                            @toggle=${()=>this._updateConfig({show_legend:!1===cfg.show_legend})}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <line x1="4" y1="3" x2="4" y2="18" stroke="currentColor" stroke-width="1" opacity="0.3"/>\n  <polyline points="4,15 8,10 12,12 17,6 22,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>\n  <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>\n  <line x1="7"  y1="18" x2="7"  y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <line x1="12" y1="18" x2="12" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <line x1="17" y1="18" x2="17" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <line x1="22" y1="18" x2="22" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n</svg>'}
                            .label=${localize("editor.field.show_x_axis",this._lang)}
                            .width=${110}
                            .height=${120}
                            ?active=${!1!==cfg.show_x_axis}
                            @toggle=${()=>this._updateConfig({show_x_axis:!1===cfg.show_x_axis})}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <line x1="4" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="1" opacity="0.3"/>\n  <polyline points="4,15 8,10 12,12 17,6 22,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>\n  <line x1="4" y1="2" x2="4" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>\n  <line x1="2" y1="6"  x2="4" y2="6"  stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <line x1="2" y1="10" x2="4" y2="10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <line x1="2" y1="14" x2="4" y2="14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n  <line x1="2" y1="18" x2="4" y2="18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>\n</svg>'}
                            .label=${localize("editor.field.show_y_axis",this._lang)}
                            .width=${110}
                            .height=${120}
                            ?active=${!1!==cfg.show_y_axis}
                            @toggle=${()=>this._updateConfig({show_y_axis:!1===cfg.show_y_axis})}
                        ></insight-toggle-button>
                    </div>

                    <div class="control-row">
                        <span class="control-label"
                            >${localize("editor.field.show_points",this._lang)}</span
                        >
                        <ha-control-select
                            .options=${pointsOptions}
                            .value=${showPointsStr}
                            @value-changed=${e=>{const v=e.detail.value,newCfg={...this._config};"true"===v?newCfg.show_points=!0:"hover"===v?newCfg.show_points="hover":delete newCfg.show_points,this._config=newCfg,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:newCfg},bubbles:!0,composed:!0}))}}
                        ></ha-control-select>
                    </div>
                    <div class="control-row">
                        <span class="control-label"
                            >${localize("editor.field.tooltip_format",this._lang)}</span
                        >
                        <ha-control-select
                            .options=${tooltipOptions}
                            .value=${cfg.tooltip_format??"datetime"}
                            @value-changed=${e=>this._updateConfig({tooltip_format:e.detail.value})}
                        ></ha-control-select>
                    </div>
                    <div class="control-row">
                        <span class="control-label"
                            >${localize("editor.field.time_format",this._lang)}</span
                        >
                        <ha-control-select
                            .options=${timeFormatOptions}
                            .value=${cfg.time_format??"auto"}
                            @value-changed=${e=>this._updateConfig({time_format:e.detail.value})}
                        ></ha-control-select>
                    </div>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${function(cfg){return[{name:"line_width",selector:{number:{min:.5,max:10,step:.5,mode:"slider",unit_of_measurement:"px"}}},..."area"===(cfg.style??"area")?[{name:"fill_opacity",selector:{number:{min:0,max:1,step:.05,mode:"slider"}}}]:[],{name:"grid_opacity",selector:{number:{min:0,max:1,step:.05,mode:"slider"}}}]}(cfg)}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${e=>this._updateConfig(e.detail.value)}
                    ></ha-form>
                    ${this._renderBoxModel()}
                </div>
            </ha-expansion-panel>
        `}_renderYAxisSection(){const cfg=this._lineConfig,primaryData={logarithmic:cfg.logarithmic??!1,decimals:cfg.decimals,y_min:cfg.y_min,y_max:cfg.y_max},secondaryData={y_min_secondary:cfg.y_min_secondary,y_max_secondary:cfg.y_max_secondary};return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${"M12,2L16,6H13V13.85L19.53,17.61L21,15.03L22.5,20.5L17,21.96L18.53,19.35L12,15.58L5.47,19.35L7,21.96L1.5,20.5L3,15.03L4.47,17.61L11,13.85V6H8L12,2Z"}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.y_axis",this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_GENERAL_SCHEMA}
                        .data=${primaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${e=>this._updateConfig(dropEmpty(e.detail.value))}
                    ></ha-form>
                    <insight-section-title
                        .label=${localize("editor.subsection.primary_axis",this._lang)}
                    ></insight-section-title>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_PRIMARY_SCHEMA}
                        .data=${primaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${e=>this._updateConfig(dropEmpty(e.detail.value))}
                    ></ha-form>
                    <insight-section-title
                        .label=${localize("editor.subsection.secondary_axis",this._lang)}
                    ></insight-section-title>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_SECONDARY_SCHEMA}
                        .data=${secondaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${e=>this._updateConfig(dropEmpty(e.detail.value))}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `}_renderAggregationSection(){const cfg=this._lineConfig,data={aggregate:cfg.aggregate??"none",aggregate_period:cfg.aggregate_period??""};return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${"M16.5 16.25L19.36 17.94L18.61 19.16L15 17V12H16.5V16.25M23 16C23 19.87 19.87 23 16 23C13.61 23 11.5 21.8 10.25 20C6.18 19.79 3 18.08 3 16V13C3 14.88 5.58 16.44 9.06 16.88C9.03 16.59 9 16.3 9 16C9 15.62 9.04 15.25 9.1 14.88C5.6 14.45 3 12.88 3 11V8C3 10.09 6.2 11.8 10.27 12C10.87 11.14 11.64 10.44 12.53 9.93C12.04 9.97 11.5 10 11 10C6.58 10 3 8.21 3 6S6.58 2 11 2 19 3.79 19 6C19 7.2 17.93 8.28 16.25 9C17 9.04 17.75 9.19 18.44 9.45C18.79 9 19 8.5 19 8V9.68C21.36 10.81 23 13.21 23 16M21 16C21 13.24 18.76 11 16 11S11 13.24 11 16 13.24 21 16 21 21 18.76 21 16Z"}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.data_aggregation",this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${function(cfg){return[{name:"aggregate",selector:{select:{options:[{value:"none",label:"None"},{value:"mean",label:"Mean"},{value:"min",label:"Min"},{value:"max",label:"Max"},{value:"sum",label:"Sum"},{value:"last",label:"Last"}]}}},...cfg.aggregate&&"none"!==cfg.aggregate?[{name:"aggregate_period",selector:{select:{options:[{value:"5m",label:"5 min"},{value:"15m",label:"15 min"},{value:"30m",label:"30 min"},{value:"1h",label:"1 h"},{value:"3h",label:"3 h"},{value:"6h",label:"6 h"},{value:"12h",label:"12 h"},{value:"1d",label:"1 day"}]}}}]:[]]}(cfg)}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${e=>{const v=e.detail.value,next={...this._lineConfig,...dropEmpty(v)};v.aggregate&&"none"!==v.aggregate?v.aggregate_period||delete next.aggregate_period:(delete next.aggregate,delete next.aggregate_period),this._config=next,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:next},bubbles:!0,composed:!0}))}}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `}_renderOverlaysSection(){const cfg=this._lineConfig,thresholds=cfg.thresholds??[],colorThresholds=cfg.color_thresholds??[];return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${"M12,18.54L19.37,12.8L21,14.07L12,21.07L3,14.07L4.62,12.81L12,18.54M12,16L3,9L12,2L21,9L12,16M12,4.53L6.26,9L12,13.47L17.74,9L12,4.53Z"}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.overlays",this._lang)}</span
                >
                <div class="panel-content">
                    <insight-section-title
                        .label=${localize("editor.subsection.threshold_lines",this._lang)}
                    ></insight-section-title>
                    ${thresholds.map((t,idx)=>b`
                            <div class="overlay-row">
                                <div class="overlay-color-field">
                                    <span class="field-label"
                                        >${localize("editor.field.color",this._lang)}</span
                                    >
                                    <input
                                        type="color"
                                        class="color-swatch"
                                        .value=${t.color??"#db4437"}
                                        @input=${e=>this._updateThresholdAt(idx,{...t,color:e.target.value})}
                                    />
                                </div>
                                <ha-form
                                    .hass=${this.hass}
                                    .schema=${THRESHOLD_SCHEMA}
                                    .data=${{value:t.value,label:t.label??"",dash:t.dash?.join(",")??""}}
                                    .computeLabel=${this._computeLabel}
                                    @value-changed=${e=>this._updateThresholdAt(idx,{...t,...this._parseThreshold(e.detail.value)})}
                                ></ha-form>
                                <ha-icon-button
                                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                                    @click=${()=>this._removeThresholdAt(idx)}
                                ></ha-icon-button>
                            </div>
                        `)}
                    <ha-button @click=${this._appendThreshold}
                        >${localize("editor.action.add_threshold",this._lang)}</ha-button
                    >

                    <insight-section-title
                        .label=${localize("editor.subsection.color_thresholds",this._lang)}
                    ></insight-section-title>
                    ${colorThresholds.map((ct,idx)=>b`
                            <div class="overlay-row">
                                <div class="overlay-color-field">
                                    <span class="field-label"
                                        >${localize("editor.field.color",this._lang)}</span
                                    >
                                    <input
                                        type="color"
                                        class="color-swatch"
                                        .value=${ct.color??"#03a9f4"}
                                        @input=${e=>this._updateColorThresholdAt(idx,{...ct,color:e.target.value})}
                                    />
                                </div>
                                <ha-form
                                    .hass=${this.hass}
                                    .schema=${COLOR_THRESHOLD_SCHEMA}
                                    .data=${{value:ct.value}}
                                    .computeLabel=${this._computeLabel}
                                    @value-changed=${e=>this._updateColorThresholdAt(idx,{...ct,value:e.detail.value.value??0})}
                                ></ha-form>
                                <ha-icon-button
                                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                                    @click=${()=>this._removeColorThresholdAt(idx)}
                                ></ha-icon-button>
                            </div>
                        `)}
                    <ha-button @click=${this._appendColorThreshold}
                        >${localize("editor.action.add_color_threshold",this._lang)}</ha-button
                    >
                </div>
            </ha-expansion-panel>
        `}_renderInteractionsSection(){return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${"M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5Z"}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.interactions",this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${this._interactionsSchema}
                        .data=${this._config}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${e=>this._updateConfig(e.detail.value)}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `}_renderAdvancedSection(){const data={update_interval:this._lineConfig.update_interval??60};return b`
            <ha-expansion-panel outlined>
                <ha-svg-icon slot="leading-icon" .path=${"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"}></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.advanced",this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${ADVANCED_SCHEMA}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${e=>this._updateConfig(e.detail.value)}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `}_renderBoxModel(){const cfg=this._lineConfig;return b`
            <div class="layout-section">
                <insight-section-title
                    .label=${localize("editor.subsection.layout",this._lang)}
                ></insight-section-title>
                <insight-box-model
                    .labelOuter=${localize("editor.subsection.margin",this._lang)}
                    .labelInner=${localize("editor.subsection.padding",this._lang)}
                    keyOuter="margin"
                    keyInner="padding"
                    .outerTop=${cfg.margin_top??0}
                    .outerRight=${cfg.margin_right??0}
                    .outerBottom=${cfg.margin_bottom??0}
                    .outerLeft=${cfg.margin_left??0}
                    .innerTop=${cfg.padding_top??8}
                    .innerRight=${cfg.padding_right??16}
                    .innerBottom=${cfg.padding_bottom??8}
                    .innerLeft=${cfg.padding_left??16}
                    @value-changed=${e=>this._updateConfig({[e.detail.key]:e.detail.value})}
                ></insight-box-model>
            </div>
        `}_parseThreshold(raw){const dashStr=raw.dash,dash=dashStr?dashStr.split(",").map(Number).filter(n=>!isNaN(n)):void 0;return{value:raw.value??0,label:raw.label||void 0,dash:dash?.length?dash:void 0}}_removeThresholdAt(index){const thresholds=[...this._lineConfig.thresholds??[]];thresholds.splice(index,1),this._updateConfig({thresholds:thresholds})}_updateThresholdAt(index,t){const thresholds=[...this._lineConfig.thresholds??[]];thresholds[index]=t,this._updateConfig({thresholds:thresholds})}_removeColorThresholdAt(index){const color_thresholds=[...this._lineConfig.color_thresholds??[]];color_thresholds.splice(index,1),this._updateConfig({color_thresholds:color_thresholds})}_updateColorThresholdAt(index,ct){const color_thresholds=[...this._lineConfig.color_thresholds??[]];color_thresholds[index]=ct,this._updateConfig({color_thresholds:color_thresholds})}};var cls,obj,key;InsightLineCardEditor.styles=[(cls=InsightLineCardEditor,obj=InsightLineCardEditor,key="styles",__reflectGet$2(__getProtoOf$2(cls),key,obj)),i$5`
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
                padding: 16px 0px 16px 0px;
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
        `],__decorateClass$4([r()],InsightLineCardEditor.prototype,"_tabs",2),__decorateClass$4([r()],InsightLineCardEditor.prototype,"_currTab",2),InsightLineCardEditor=__decorateClass$4([t$1("insight-line-card-editor")],InsightLineCardEditor);var __defProp=Object.defineProperty,__getOwnPropDesc$3=Object.getOwnPropertyDescriptor,__getProtoOf$1=Object.getPrototypeOf,__reflectGet$1=Reflect.get,__decorateClass$3=(decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$3(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=(kind?decorator(target,key,result):decorator(result))||result);return kind&&result&&__defProp(target,key,result),result};function bucketKey(ts,groupBy="day"){const d=new Date(ts);if("hour"===groupBy)return`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;if("week"===groupBy){const start=new Date(d);return start.setDate(d.getDate()-d.getDay()),`${start.getFullYear()}-W${start.getDate()}`}return"month"===groupBy?`${d.getFullYear()}-${d.getMonth()}`:`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`}let InsightBarCard=class extends InsightBaseCard{constructor(){super(...arguments),this._resizeObserver=null,this._hoveredSeriesIdx=null,this._hiddenSeries=new Set,this._chartHeight=220}static getConfigElement(){return document.createElement("insight-bar-card-editor")}static getStubConfig(hass,entities,entitiesFallback){const sensor=findNumericSensor(hass,entities,entitiesFallback);return{type:InsightBarCard.cardType,entities:[{entity:sensor}],hours:24,group_by:"hour",aggregate:"mean",layout:"grouped"}}getDefaultConfig(){return{hours:168,group_by:"day",aggregate:"mean",layout:"grouped",update_interval:60}}renderChart(){return b`
      <div id="chart"></div>
      ${this._renderLegend()}
    `}_renderLegend(){const config=this._config;if(!1===config?.show_legend||0===this._data.length)return A;const palette=generateColors(this._data.length),colors=this.entityConfigs.map((ec,i)=>ec.color??palette[i]);return b`
      <div class="bar-legend">
        ${this._data.map((dataset,i)=>{const isHidden=this._hiddenSeries.has(i),isDimmed=!isHidden&&null!==this._hoveredSeriesIdx&&this._hoveredSeriesIdx!==i;return b`
            <span
              class="bar-legend-item ${isDimmed?"dimmed":""} ${isHidden?"hidden":""}"
              @mouseenter=${()=>{isHidden||(this._hoveredSeriesIdx=i,this._uplot?.redraw(!1))}}
              @mouseleave=${()=>{this._hoveredSeriesIdx=null,this._uplot?.redraw(!1)}}
              @click=${()=>this._toggleSeries(i)}
            >
              <span class="bar-legend-marker" style="background:${isHidden?"transparent":colors[i]}; border: 2px solid ${colors[i]}"></span>
              ${dataset.friendlyName??this.entityConfigs[i]?.entity??`Entity ${i+1}`}
            </span>
          `})}
      </div>
    `}_toggleSeries(idx){const next=new Set(this._hiddenSeries);next.has(idx)?next.delete(idx):next.add(idx),this._hiddenSeries=next,this._hoveredSeriesIdx=null,this._uplot&&this._uplot.setData(this._uplot.data,!0)}updated(changedProps){super.updated(changedProps),changedProps.has("_config")&&(this._hiddenSeries=new Set),requestAnimationFrame(()=>requestAnimationFrame(()=>this._syncUplot()))}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(()=>{this._refreshChartHeight();const width=this.wrapper?.clientWidth??0,height=this._chartHeight;width<10||height<10||(this._uplot?this._uplot.setSize({width:width,height:height}):this._syncUplot())}),this.updateComplete.then(()=>{this._resizeObserver.observe(this)})}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),this._resizeObserver=null,this._uplot?.destroy(),this._uplot=void 0}_refreshChartHeight(){const total=this.offsetHeight;if(0===total)return;const legendEl=this.shadowRoot?.querySelector(".bar-legend"),legendHeight=legendEl?.offsetHeight??0;let h=total;h-=this._header?.offsetHeight??0,h-=legendHeight,h-=this._config?.margin_top??0,h-=this._config?.margin_bottom??0;const clamped=Math.max(80,h);clamped!==this._chartHeight&&(this._chartHeight=clamped)}_buildBucketData(){const config=this._config;if(this._bucketData&&this._data===this._lastBucketDataRef&&config.group_by===this._lastGroupBy&&config.aggregate===this._lastAggregate)return this._bucketData;const palette=generateColors(this._data.length),colors=this.entityConfigs.map((ec,i)=>ec.color??palette[i]),bucketMap=new Map;this._data.forEach((dataset,si)=>{for(const point of dataset.data){const key=bucketKey(point.t,config.group_by);bucketMap.has(key)||bucketMap.set(key,new Map);const sm=bucketMap.get(key);sm.has(si)||sm.set(si,[]),sm.get(si).push(point.v)}});const sortedKeys=Array.from(bucketMap.keys()).sort(),labels=sortedKeys.map(key=>function(key,groupBy="day"){const parts=key.split("-");if("hour"===groupBy)return`${parts[3]}:00`;if("week"===groupBy)return key;if("month"===groupBy)return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(parts[1],10)]??key;return`${parts[2]}.${(parseInt(parts[1],10)+1).toString().padStart(2,"0")}`}(key,config.group_by)),series=this._data.map((_,si)=>sortedKeys.map(key=>function(values,method="mean"){return 0===values.length?0:"sum"===method?values.reduce((a,b)=>a+b,0):"min"===method?Math.min(...values):"max"===method?Math.max(...values):values.reduce((a,b)=>a+b,0)/values.length}(bucketMap.get(key)?.get(si)??[],config.aggregate)));let maxVal=0;if("stacked"===config.layout)for(let bi=0;bi<sortedKeys.length;bi++){const sum=series.reduce((acc,s)=>acc+(s[bi]??0),0);sum>maxVal&&(maxVal=sum)}else for(const s of series)for(const v of s)v>maxVal&&(maxVal=v);return this._bucketData={labels:labels,series:series,colors:colors,maxVal:maxVal},this._lastBucketDataRef=this._data,this._lastGroupBy=config.group_by,this._lastAggregate=config.aggregate,this._bucketData}_buildUplotData(bucketData){const n=bucketData.labels.length;if(0===n)return[[],[]];const xs=Array.from({length:n},(_,i)=>i);return[xs,...bucketData.series]}_buildOptions(bucketData){this._config;const{labels:labels,colors:colors}=bucketData,n=labels.length,chartWidth=Math.max(100,this.wrapper?.clientWidth||this._cardWidth-32),isDark=this.isDarkTheme,axisStroke=isDark?"rgba(255,255,255,0.55)":"rgba(0,0,0,0.55)",gridStroke=isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)",series=[{}];return this._data.forEach((dataset,i)=>{series.push({label:dataset.friendlyName??`Entity ${i+1}`,stroke:colors[i],fill:colors[i],paths:()=>null,points:{show:!1}})}),{width:chartWidth,height:this._chartHeight,scales:{x:{time:!1},y:{range:(_u,_min,_max)=>{const bd=this._bucketData,cfg=this._config;if(!bd)return[0,1];let maxVal=0;if("stacked"===cfg?.layout)for(let bi=0;bi<bd.labels.length;bi++){const sum=bd.series.reduce((acc,s,si)=>this._hiddenSeries.has(si)?acc:acc+(s[bi]??0),0);sum>maxVal&&(maxVal=sum)}else for(let si=0;si<bd.series.length;si++)if(!this._hiddenSeries.has(si))for(const v of bd.series[si])v>maxVal&&(maxVal=v);return[0,maxVal>0?1.05*maxVal:1]}}},axes:[{stroke:axisStroke,grid:{show:!1},ticks:{show:!1},splits:_u=>Array.from({length:n},(_,i)=>i),values:(_u,vals)=>vals.map(v=>labels[Math.round(v)]??""),size:36},{stroke:axisStroke,grid:{stroke:gridStroke,width:1},ticks:{show:!1},values:(_u,vals)=>vals.map(v=>null==v?"":formatValue(v)),size:50}],series:series,legend:{show:!1},cursor:{show:!1},hooks:{draw:[u=>this._drawBarsHook(u)]},padding:[8,8,0,0]}}_drawBarsHook(u){const config=this._config,bucketData=this._bucketData;if(!config||!bucketData)return;const{labels:labels,series:series,colors:colors,maxVal:maxVal}=bucketData,n=labels.length;if(0===n||maxVal<=0)return;const ctx=u.ctx,{left:left,top:_top,width:width,height:_height}=u.bbox,numSeries=series.length,bucketW=width/n,barGroupW=.7*bucketW,yBase=u.valToPos(0,"y",!0);ctx.save();for(let bi=0;bi<n;bi++){const groupX=left+bi*bucketW+.15*bucketW;if("stacked"===config.layout){let cumulative=0;for(let si=0;si<numSeries;si++){if(this._hiddenSeries.has(si))continue;const val=series[si][bi]??0;if(val<=0)continue;ctx.globalAlpha=null!==this._hoveredSeriesIdx&&this._hoveredSeriesIdx!==si?.15:1;const yTop=u.valToPos(cumulative+val,"y",!0),yBottom=u.valToPos(cumulative,"y",!0);ctx.fillStyle=colors[si],ctx.fillRect(groupX,yTop,barGroupW,yBottom-yTop),cumulative+=val}}else{const barW=barGroupW/numSeries;for(let si=0;si<numSeries;si++){if(this._hiddenSeries.has(si))continue;const val=series[si][bi]??0;if(val<=0)continue;ctx.globalAlpha=null!==this._hoveredSeriesIdx&&this._hoveredSeriesIdx!==si?.15:1;const yTop=u.valToPos(val,"y",!0),x=groupX+si*barW;ctx.fillStyle=colors[si],ctx.fillRect(x,yTop,.85*barW,yBase-yTop)}}}ctx.restore()}_syncUplot(){if(!this._config||!this.wrapper)return;if(0===this._data.length)return;const bucketData=this._buildBucketData();if(0===bucketData.labels.length)return this._uplot?.destroy(),void(this._uplot=void 0);const uData=this._buildUplotData(bucketData),prevBucketCount=this._uplot?.data[0]?.length,bucketCountChanged=bucketData.labels.length!==prevBucketCount,entityCountChanged=!!this._uplot&&this._data.length!==this._uplot.series.length-1;this._needsRebuild||!this._uplot||bucketCountChanged||entityCountChanged?(this._uplot?.destroy(),this._uplot=void 0,this._uplot=new uPlot(this._buildOptions(bucketData),uData,this.wrapper),this._needsRebuild=!1):this._data!==this._lastSyncedDataRef&&this._uplot.setData(uData,!0),this._lastSyncedDataRef=this._data}};InsightBarCard.cardType="custom:insight-bar-card",InsightBarCard.cardName="Insight Bar Card",InsightBarCard.cardDescription="Bar chart with grouping and aggregation",InsightBarCard.styles=[((cls,obj,key)=>__reflectGet$1(__getProtoOf$1(cls),key,obj))(InsightBarCard,InsightBarCard,"styles"),i$5`
      #chart {
        width: 100%;
        display: block;
      }

      /* uPlot core layout — injected to document.head by uPlot, replicated here for Shadow DOM */
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
      .u-wrap canvas {
        display: block;
        width: 100%;
        height: 100%;
      }

      .bar-legend {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px 12px;
        font-size: 12px;
        color: var(--secondary-text-color);
        padding: 4px 0 2px;
      }
      .bar-legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .bar-legend-item.dimmed {
        opacity: 0.35;
      }
      .bar-legend-item.hidden {
        opacity: 0.4;
      }
      .bar-legend-item.hidden .bar-legend-marker {
        border-style: dashed !important;
      }
      .bar-legend-marker {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
      }
    `],__decorateClass$3([r()],InsightBarCard.prototype,"_hoveredSeriesIdx",2),__decorateClass$3([r()],InsightBarCard.prototype,"_hiddenSeries",2),__decorateClass$3([e$1("#chart")],InsightBarCard.prototype,"wrapper",2),InsightBarCard=__decorateClass$3([t$1("insight-bar-card")],InsightBarCard),window.customCards=window.customCards??[],window.customCards.push({type:InsightBarCard.cardType.replace("custom:",""),name:InsightBarCard.cardName,description:InsightBarCard.cardDescription,preview:!0});var __getOwnPropDesc$2=Object.getOwnPropertyDescriptor;let InsightBarCardEditor=class extends InsightBaseEditor{renderCardOptions(){const cfg=this._config,groupBy=cfg?.group_by??"day",aggregate=cfg?.aggregate??"mean",layout=cfg?.layout??"grouped";return b`
      <div class="section">
        <div class="section-header">Grouping</div>
        <div class="preset-buttons">
          ${["hour","day","week","month"].map(g=>b`
              <mwc-button
                class="preset-btn ${groupBy===g?"active":""}"
                dense
                @click=${()=>this._updateConfig({group_by:g})}
              >${g}</mwc-button>
            `)}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Aggregation</div>
        <div class="preset-buttons">
          ${["mean","sum","min","max"].map(a=>b`
              <mwc-button
                class="preset-btn ${aggregate===a?"active":""}"
                dense
                @click=${()=>this._updateConfig({aggregate:a})}
              >${a}</mwc-button>
            `)}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Layout</div>
        <div class="preset-buttons">
          ${["grouped","stacked"].map(l=>b`
              <mwc-button
                class="preset-btn ${layout===l?"active":""}"
                dense
                @click=${()=>this._updateConfig({layout:l})}
              >${l}</mwc-button>
            `)}
        </div>
      </div>
    `}};InsightBarCardEditor=((decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$2(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=decorator(result)||result);return result})([t$1("insight-bar-card-editor")],InsightBarCardEditor);var __getOwnPropDesc$1=Object.getOwnPropertyDescriptor,__getProtoOf=Object.getPrototypeOf,__reflectGet=Reflect.get;const PALETTES={YlOrRd:[{position:0,color:"#ffffcc"},{position:.25,color:"#fed976"},{position:.5,color:"#fd8d3c"},{position:.75,color:"#e31a1c"},{position:1,color:"#800026"}],Blues:[{position:0,color:"#f7fbff"},{position:.5,color:"#6baed6"},{position:1,color:"#08306b"}],Greens:[{position:0,color:"#f7fcf5"},{position:.5,color:"#74c476"},{position:1,color:"#00441b"}],RdBu:[{position:0,color:"#d73027"},{position:.5,color:"#f7f7f7"},{position:1,color:"#4575b4"}]};function hexToRgb(hex){const clean=hex.replace(/^#/,""),full=3===clean.length?clean.split("").map(c=>c+c).join(""):clean;return[parseInt(full.slice(0,2),16),parseInt(full.slice(2,4),16),parseInt(full.slice(4,6),16)]}function interpolateColor(stops,t){if(0===stops.length)return"#888";if(t<=0)return stops[0].color;if(t>=1)return stops[stops.length-1].color;for(let i=0;i<stops.length-1;i++){const lo=stops[i],hi=stops[i+1];if(t>=lo.position&&t<=hi.position){const range=hi.position-lo.position,localT=0===range?0:(t-lo.position)/range,[r1,g1,b1]=hexToRgb(lo.color),[r2,g2,b2]=hexToRgb(hi.color);return`rgb(${Math.round(r1+(r2-r1)*localT)},${Math.round(g1+(g2-g1)*localT)},${Math.round(b1+(b2-b1)*localT)})`}}return stops[stops.length-1].color}let InsightHeatmapCard=class extends InsightBaseCard{static getConfigElement(){return document.createElement("insight-heatmap-card-editor")}static getStubConfig(hass,entities,entitiesFallback){const sensor=findNumericSensor(hass,entities,entitiesFallback);return{type:InsightHeatmapCard.cardType,entities:[{entity:sensor}],hours:168,color_scale:"YlOrRd",layout:"hour_day"}}getDefaultConfig(){return{hours:168,color_scale:"YlOrRd",layout:"hour_day",update_interval:60}}renderChart(){return b`
      <canvas
        class="heatmap-canvas"
        style="width:100%;height:250px"
      ></canvas>
    `}updated(changedProps){super.updated(changedProps),requestAnimationFrame(()=>this._drawHeatmap())}_drawHeatmap(){const config=this._config;if(!config||this._loading||0===this._data.length)return;const dataset=this._data[0];if(!dataset||0===dataset.data.length)return;const canvasEl=this.shadowRoot?.querySelector(".heatmap-canvas");if(!canvasEl)return;const dpr=window.devicePixelRatio??1,displayWidth=canvasEl.clientWidth||this._cardWidth-32,displayHeight=canvasEl.clientHeight||250;canvasEl.width=displayWidth*dpr,canvasEl.height=displayHeight*dpr;const ctx=canvasEl.getContext("2d");if(!ctx)return;ctx.scale(dpr,dpr);const layout=config.layout??"hour_day";let cells,rowLabels,colLabels;const rawData=dataset.data;if(this._gridCache&&rawData===this._lastHeatDataRef&&layout===this._lastHeatLayout?({cells:cells,rowLabels:rowLabels,colLabels:colLabels}=this._gridCache):(({cells:cells,rowLabels:rowLabels,colLabels:colLabels}="weekday_hour"===layout?function(data){const rowLabels=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],colLabels=Array.from({length:24},(_,h)=>h.toString().padStart(2,"0")),sums=new Map;for(const p of data){const d=new Date(p.t),key=`${d.getDay()}_${d.getHours()}`,prev=sums.get(key)??{sum:0,count:0};sums.set(key,{sum:prev.sum+p.v,count:prev.count+1})}const cells=[];for(const[key,{sum:sum,count:count}]of sums){const[dayStr,hourStr]=key.split("_");cells.push({rowIdx:parseInt(dayStr,10),colIdx:parseInt(hourStr,10),value:sum/count,count:count})}return{cells:cells,rowLabels:rowLabels,colLabels:colLabels}}(rawData):function(data){const daySet=new Set;for(const p of data){const d=new Date(p.t);daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)}const days=Array.from(daySet).sort(),dayIndex=new Map(days.map((d,i)=>[d,i])),colLabels=days.map(d=>{const parts=d.split("-");return`${parts[2]}.${(parseInt(parts[1],10)+1).toString().padStart(2,"0")}`}),rowLabels=Array.from({length:24},(_,h)=>h.toString().padStart(2,"0")),sums=new Map;for(const p of data){const d=new Date(p.t),dayKey=`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,key=`${d.getHours()}_${dayKey}`,prev=sums.get(key)??{sum:0,count:0};sums.set(key,{sum:prev.sum+p.v,count:prev.count+1})}const cells=[];for(const[key,{sum:sum,count:count}]of sums){const[hourStr,...dayParts]=key.split("_"),dayKey=dayParts.join("_"),colIdx=dayIndex.get(dayKey)??-1;colIdx<0||cells.push({rowIdx:parseInt(hourStr,10),colIdx:colIdx,value:sum/count,count:count})}return{cells:cells,rowLabels:rowLabels,colLabels:colLabels}}(rawData)),this._gridCache={cells:cells,rowLabels:rowLabels,colLabels:colLabels},this._lastHeatDataRef=rawData,this._lastHeatLayout=layout),0===cells.length)return;const colorStops=(scale=config.color_scale)?"string"==typeof scale?PALETTES[scale]??PALETTES.YlOrRd:scale:PALETTES.YlOrRd;var scale;let minVal=1/0,maxVal=-1/0;for(const c of cells)c.value<minVal&&(minVal=c.value),c.value>maxVal&&(maxVal=c.value);const range=maxVal-minVal||1,padding_top=20,padding_left=28,plotW=displayWidth-padding_left-8,plotH=displayHeight-padding_top-8,numCols=colLabels.length,numRows=rowLabels.length,cellW=plotW/numCols,cellH=plotH/numRows,textColor=this.isDarkTheme?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.55)";for(const cell of cells){const t=(cell.value-minVal)/range;ctx.fillStyle=interpolateColor(colorStops,t),ctx.fillRect(padding_left+cell.colIdx*cellW,padding_top+cell.rowIdx*cellH,cellW-1,cellH-1)}ctx.font="10px sans-serif",ctx.fillStyle=textColor,ctx.textAlign="center",ctx.textBaseline="bottom";const maxColLabels=Math.floor(plotW/36),colStep=Math.max(1,Math.floor(numCols/maxColLabels));for(let c=0;c<numCols;c+=colStep)ctx.fillText(colLabels[c],padding_left+c*cellW+cellW/2,padding_top-3);ctx.textAlign="right",ctx.textBaseline="middle";for(let r=0;r<numRows;r++)ctx.fillText(rowLabels[r],padding_left-4,padding_top+r*cellH+cellH/2)}};InsightHeatmapCard.cardType="custom:insight-heatmap-card",InsightHeatmapCard.cardName="Insight Heatmap Card",InsightHeatmapCard.cardDescription="Heatmap visualisation of a sensor over time",InsightHeatmapCard.styles=[((cls,obj,key)=>__reflectGet(__getProtoOf(cls),key,obj))(InsightHeatmapCard,InsightHeatmapCard,"styles"),i$5`
      .heatmap-canvas {
        display: block;
      }
    `],InsightHeatmapCard=((decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc$1(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=decorator(result)||result);return result})([t$1("insight-heatmap-card")],InsightHeatmapCard),window.customCards=window.customCards??[],window.customCards.push({type:InsightHeatmapCard.cardType.replace("custom:",""),name:InsightHeatmapCard.cardName,description:InsightHeatmapCard.cardDescription,preview:!0});var __getOwnPropDesc=Object.getOwnPropertyDescriptor;let InsightHeatmapCardEditor=class extends InsightBaseEditor{renderCardOptions(){const cfg=this._config,layout=cfg?.layout??"hour_day",colorScale=cfg?.color_scale??"YlOrRd";return b`
      <div class="section">
        <div class="section-header">Layout</div>
        <div class="preset-buttons">
          ${["hour_day","weekday_hour"].map(l=>b`
              <mwc-button
                class="preset-btn ${layout===l?"active":""}"
                dense
                @click=${()=>this._updateConfig({layout:l})}
              >${l.replace("_"," / ")}</mwc-button>
            `)}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Color scale</div>
        <div class="preset-buttons">
          ${["YlOrRd","Blues","Greens","RdBu"].map(c=>b`
              <mwc-button
                class="preset-btn ${colorScale===c?"active":""}"
                dense
                @click=${()=>this._updateConfig({color_scale:c})}
              >${c}</mwc-button>
            `)}
        </div>
      </div>
    `}};InsightHeatmapCardEditor=((decorators,target,key,kind)=>{for(var decorator,result=kind>1?void 0:kind?__getOwnPropDesc(target,key):target,i=decorators.length-1;i>=0;i--)(decorator=decorators[i])&&(result=decorator(result)||result);return result})([t$1("insight-heatmap-card-editor")],InsightHeatmapCardEditor),console.info(`%c Insight Cards %c v${pkg_version} `,"background:#4AAFFF;color:#fff;font-weight:bold;border-radius:4px 0 0 4px;padding:2px 6px","background:#1a1a2e;color:#4AAFFF;font-weight:bold;border-radius:0 4px 4px 0;padding:2px 6px");
//# sourceMappingURL=insight-card.js.map
