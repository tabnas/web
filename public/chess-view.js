/* @tabnas/chess-view 0.1.3 — built artifact, do not edit here.
 *
 * Source: https://github.com/tabnas/chess (web/), MIT.
 * Refresh with:  cd ../chess/web && npm run build
 *                cp dist/chess-view.js ../../web/public/chess-view.js
 *
 * Still vendored, though the reason has expired: @tabnas/chess-view IS on
 * npm now, so the note this replaces — "once it publishes, replace this
 * with a dependency and an import" — is actionable. Left as a file for
 * the moment because swapping it for a dependency changes what the
 * Cloudflare build resolves, and that is worth doing on its own rather
 * than inside a content change.
 *
 * Was chess-game 0.1.0. The element is <chess-view> from 0.1.2 on.
 */
/*! @tabnas/chess-view 0.1.3 | MIT | https://github.com/tabnas/chess
 * Bundles @tabnas/chess and @tabnas/parser. No external requests. */
"use strict";var ChessView=(()=>{var Un=Object.create;var Be=Object.defineProperty;var Yn=Object.getOwnPropertyDescriptor;var Dn=Object.getOwnPropertyNames;var Gn=Object.getPrototypeOf,Hn=Object.prototype.hasOwnProperty;var H=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}},zn=(t,e)=>{for(var n in e)Be(t,n,{get:e[n],enumerable:!0})},Lt=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of Dn(e))!Hn.call(t,s)&&s!==n&&Be(t,s,{get:()=>e[s],enumerable:!(r=Yn(e,s))||r.enumerable});return t};var Vn=(t,e,n)=>(n=t!=null?Un(Gn(t)):{},Lt(e||!t||!t.__esModule?Be(n,"default",{value:t,enumerable:!0}):n,t)),Zn=t=>Lt(Be({},"__esModule",{value:!0}),t);var ce=H(j=>{"use strict";Object.defineProperty(j,"__esModule",{value:!0});j.asTin=j.STRING=j.SKIP=j.INSPECT=j.EMPTY=j.AFTER=j.BEFORE=j.CLOSE=j.OPEN=void 0;j.OPEN="o";j.CLOSE="c";j.BEFORE="b";j.AFTER="a";j.EMPTY="";j.INSPECT=Symbol.for("nodejs.util.inspect.custom");j.SKIP=Symbol.for("tabnas.SKIP");j.STRING="string";var Wn=t=>t;j.asTin=Wn});var xe=H(S=>{"use strict";Object.defineProperty(S,"__esModule",{value:!0});S.STATE_MASK=S.STOP=S.CI_RESET=S.IS_ROW=S.CONSUME=S.makeTextMatcher=S.makeNumberMatcher=S.makeCommentMatcher=S.makeStringMatcher=S.makeLineMatcher=S.makeSpaceMatcher=S.makeFixedMatcher=S.makeMatchMatcher=S.makeToken=S.makePoint=S.makeLex=S.makeNoToken=S.Token=S.Point=S.Lex=void 0;S.guardedMatcher=ne;S.scan=ke;S.buildCharRunSpec=Ut;S.buildLineRunSpec=pt;S.buildStringBodySpec=dt;var ee=ce(),N=ue(),qe=class{constructor(e,n,r,s){this.len=-1,this.sI=0,this.rI=1,this.cI=1,this.token=[],this.len=e,n!=null&&(this.sI=n),r!=null&&(this.rI=r),s!=null&&(this.cI=s)}toString(){return"Point["+[this.sI+"/"+this.len,this.rI,this.cI]+(0<this.token.length?" "+this.token:"")+"]"}[ee.INSPECT](){return this.toString()}};S.Point=qe;var Fe=(...t)=>new qe(...t);S.makePoint=Fe;var Ke=class{#e;#t;constructor(e,n,r,s,i,o,l,a,c){this.isToken=!0,this.name=ee.EMPTY,this.tin=-1,this.val=void 0,this.sI=-1,this.rI=-1,this.cI=-1,this.len=-1,this.name=e,this.tin=n,this.#e=s,this.#t=a,this.val=r,this.sI=i.sI,this.rI=i.rI,this.cI=i.cI,this.use=o,this.why=l,this.len=c??(s==null?0:s.length)}get src(){let e=this.#e;if(e===void 0){let n=this.#t;e=this.#e=n===void 0?ee.EMPTY:n.substring(this.sI,this.sI+this.len)}return e}set src(e){this.#e=e}resolveVal(e,n){return typeof this.val=="function"?this.val(e,n):this.val}bad(e,n){return this.err=e,n!=null&&(this.use=(0,N.deep)(this.use||{},n)),this}toString(){return"Token["+this.name+"="+this.tin+" "+(0,N.snip)(this.src)+(this.val===void 0||this.name==="#ST"||this.name==="#TX"?"":"="+(0,N.snip)(this.val))+" "+[this.sI,this.rI,this.cI]+(this.use==null?"":" "+(0,N.snip)(""+JSON.stringify(this.use).replace(/"/g,""),22))+(this.err==null?"":" "+this.err)+(this.why==null?"":" "+(0,N.snip)(""+this.why,22))+"]"}[ee.INSPECT](){return this.toString()}};S.Token=Ke;var ht=(...t)=>new Ke(...t);S.makeToken=ht;var Xn=()=>ht("",-1,void 0,ee.EMPTY,Fe(-1));S.makeNoToken=Xn;function ne(t,e){return function(r,s,i){if(t.lex){if(t.check){r.refwd();let o=t.check(r);if(o&&o.done)return o.token}return e(r,s,i)}}}var te=65536;S.CONSUME=te;var Ye=1<<17;S.IS_ROW=Ye;var mt=1<<18;S.CI_RESET=mt;var Oe=1<<19;S.STOP=Oe;var Kt=65535;S.STATE_MASK=Kt;function ke(t,e,n,r,s,i){let o=e,l=n,a=r,c=t.length,u=s.nclasses,d=s.classOf,f=s.table,h=s.initialState;for(;o<c;){let m=t.charCodeAt(o),g=m<256?d[m]:s.fallback(t[o]),p=f[h*u+g];if(p&te&&(o++,p&Ye?(l++,a=1):p&mt?a=1:a++),h=p&Kt,p&Oe)break}return i.sI=o,i.rI=l,i.cI=a,e<o}function pt(t){let e=new Uint8Array(256);for(let i=0;i<256;i++)t.charsBitmap[i]&&(e[i]=t.rowCharsBitmap[i]?2:1);let n=t.chars,r=t.rowChars;return{initialState:0,nclasses:3,classOf:e,fallback:i=>n[i]?r[i]?2:1:0,table:Jn}}var Jn=new Int32Array([Oe,te,te|Ye]);function Ut(t,e){return{initialState:0,nclasses:2,classOf:t,fallback:r=>e[r]?1:0,table:Qn}}var Qn=new Int32Array([Oe,te]);function dt(t,e){let n=e.charCodeAt(0),r=t.string.escCharCode,s=t.string.replaceCodeMap,i=t.string.hasReplace,o=!!t.string.multiBitmap[n],l=t.string.allowControl,a=t.line.charsBitmap,c=t.line.rowCharsBitmap,u=new Uint8Array(256);for(let m=0;m<256;m++)m===n||m===r||i&&s[m]!==void 0?u[m]=1:m<32&&(o&&a[m]?u[m]=c[m]?3:2:l&&!a[m]?u[m]=0:u[m]=1);let d=t.line.chars,f=t.line.rowChars;return{initialState:0,nclasses:4,classOf:u,fallback:m=>{let g=m.charCodeAt(0);return m===e||g===r||i&&s[g]!==void 0?1:o&&d[m]?f[m]?3:2:0},table:er}}var er=new Int32Array([te,Oe,te|mt,te|Ye]),tr=(t,e)=>{let n=new Array(256),r=[],s=(i,o)=>o.len-i.len||(i.src<o.src?-1:i.src>o.src?1:0);for(let i of(0,N.keys)(t.fixed.token)){let o=t.fixed.token[i];if(o==null||i.length===0)continue;let l={src:i,len:i.length,tin:o},a=i.charCodeAt(0);a<256?(n[a]=n[a]||[]).push(l):r.push(l)}for(let i of n)i&&i.sort(s);return r.sort(s),ne(t.fixed,function(o){let l=o.pnt,a=o.src,c=a.charCodeAt(l.sI),u=c<256?n[c]:r;if(u===void 0)return;let d=o.want;for(let f of u)if(!(d!=null&&!d.includes(f.tin))&&(f.len===1&&c<256||a.startsWith(f.src,l.sI))){let h=o.token(f.tin,void 0,f.src,l);return l.sI+=f.len,l.cI+=f.len,h}})};S.makeFixedMatcher=tr;var nr=(t,e)=>{let n=(0,N.entries)(t.match.value).sort(([s],[i])=>s<i?-1:s>i?1:0).map(([,s])=>s),r=(0,N.values)(t.match.token).sort((s,i)=>(s.tin$||0)-(i.tin$||0));return n.length===0&&r.length===0?null:ne(t.match,function(i,o,l=0){let a=i.pnt,c=i.refwd(),u=o.state==="o"?0:1,d=i.want;if(d==null)for(let f of n)if(f.match instanceof RegExp){let h=c.match(f.match);if(h){let m=h[0],g=m.length;if(0<g){let p,y=f.val?f.val(h):m;return p=i.token("#VL",y,m,a),a.sI+=g,a.cI+=g,p}}}else{let h=f.match(i,o);if(h!=null)return h}for(let f of r){if(d!=null){if(!f.tin$||!d.includes(f.tin$))continue}else if(f.tin$&&!f.eager$&&!o.spec.def.tcol[u][l].includes(f.tin$))continue;if(f instanceof RegExp){let h=c.match(f);if(h){let m=h[0],g=m.length;if(0<g){let p,y=f.tin$;return p=i.token(y,m,m,a),a.sI+=g,a.cI+=g,p}}}else{let h=f(i,o);if(h!=null)return h}}})};S.makeMatchMatcher=nr;var rr=(t,e)=>{let n=e.comment;t.comment={lex:n?!!n.lex:!1,def:(n?.def?(0,N.entries)(n.def):[]).reduce((a,[c,u])=>{if(u==null||u===!1)return a;let{suffixes:d,suffixFn:f}=sr(u.suffix),h={name:c,start:u.start,end:u.end,line:!!u.line,lex:!!u.lex,eatline:!!u.eatline,suffixes:d,suffixFn:f};return a[c]=h,a},{}),check:n?.check};let r=(a,c)=>c.start.length-a.start.length||(a.name<c.name?-1:a.name>c.name?1:0),s=t.comment.lex?(0,N.values)(t.comment.def).filter(a=>a.lex&&a.line).sort(r):[],i=t.comment.lex?(0,N.values)(t.comment.def).filter(a=>a.lex&&!a.line).sort(r):[],o=pt(t.line),l={sI:0,rI:0,cI:0};return ne(t.comment,function(c){let u=c.pnt,d=c.src,f=u.rI,h=u.cI,m=t.line.charsBitmap,g=t.line.rowCharsBitmap,p=t.line.chars,y=t.line.rowChars;for(let b of s)if(d.startsWith(b.start,u.sI)){let T=d.length,k=u.sI+b.start.length;h+=b.start.length;let A=0,C;for(;k<T&&!((C=d.charCodeAt(k))<256?m[C]:p[d[k]]);){let x=Bt(d,k,b.suffixes);if(x>0){A=x;break}if(x=qt(c,k,b.suffixFn),x>0){A=x;break}h++,k++}A>0?(k+=A,h+=A):b.eatline&&(ke(d,k,f,h,o,l),f=l.rI,k=l.sI);let M=c.token("#CM",void 0,void 0,u,void 0,void 0,k-u.sI);return u.sI=k,u.cI=h,u.rI=f,M}for(let b of i)if(d.startsWith(b.start,u.sI)){let T=d.length,k=u.sI+b.start.length,A=b.end;h+=b.start.length;let C=0,M;for(;k<T&&!d.startsWith(A,k);){let x=Bt(d,k,b.suffixes);if(x>0){C=x;break}if(x=qt(c,k,b.suffixFn),x>0){C=x;break}M=d.charCodeAt(k),(M<256?g[M]:y[d[k]])&&(f++,h=0),h++,k++}if(C>0){for(let B=0;B<C;B++)M=d.charCodeAt(k+B),(M<256?g[M]:y[d[k+B]])&&(f++,h=0),h++;let x=c.token("#CM",void 0,void 0,u,void 0,void 0,k+C-u.sI);return u.sI=k+C,u.rI=f,u.cI=h,x}if(d.startsWith(A,k)){h+=A.length,b.eatline&&(ke(d,k,f,h,o,l),f=l.rI,k=l.sI);let x=c.token("#CM",void 0,void 0,u,void 0,void 0,k+A.length-u.sI);return u.sI=k+A.length,u.rI=f,u.cI=h,x}else return c.bad(N.S.unterminated_comment,u.sI,u.sI+9*b.start.length)}})};S.makeCommentMatcher=rr;function sr(t){if(t==null)return{suffixes:void 0,suffixFn:void 0};if(typeof t=="function")return{suffixes:void 0,suffixFn:t};let e=[];if(typeof t=="string")t!==""&&e.push(t);else if(Array.isArray(t))for(let n of t)typeof n=="string"&&n!==""&&e.push(n);return e.length>1&&e.sort((n,r)=>r.length-n.length||(n<r?-1:n>r?1:0)),{suffixes:e.length===0?void 0:e,suffixFn:void 0}}function Bt(t,e,n){if(!n||n.length===0)return 0;for(let r of n)if(t.startsWith(r,e))return r.length;return 0}function qt(t,e,n){if(!n)return 0;let r=t.pnt,s=r.sI,i=r.rI,o=r.cI;r.sI=e;let l;try{l=n(t,void 0)}finally{r.sI=s,r.rI=i,r.cI=o}return l==null?0:typeof l.src=="string"?l.src.length:0}var ir=(t,e)=>{let n=(0,N.regexp)(t.line.lex?"y":"ys","(.*?)",...t.rePart.ender);return function(s){if(t.text.check){s.refwd();let u=t.text.check(s);if(u&&u.done)return u.token}let i=t.text,o=s.pnt,l=t.value.def,a=t.value.defre;n.lastIndex=o.sI;let c=n.exec(s.src);if(c){let u=c[1],d=c[2],f;if(u!=null){let h=u.length;if(0<h){let m;if(t.value.lex){if((m=l[u])!==void 0)f=s.token("#VL",m.val,u,o),o.sI+=h,o.cI+=h;else for(let g of a)if(g.match){let p=g.match.exec(g.consume?s.refwd():u);if(p&&(g.consume||p[0].length===u.length)){let y=p[0];if(g.val==null)f=s.token("#VL",y,y,o);else{let b=g.val(p);f=s.token("#VL",b,y,o)}o.sI+=y.length,o.cI+=y.length}}}f==null&&i.lex&&(f=s.token("#TX",u,u,o),o.sI+=h,o.cI+=h)}}if(f&&(f=Yt(s,f,d)),f&&0<t.text.modify.length){let h=t.text.modify;for(let m=0;m<h.length;m++)f.val=h[m](f.val,s,t,e)}return f}}};S.makeTextMatcher=ir;var or=(t,e)=>{let n=t.number,r=[n.hex?"[xX][0-9a-fA-F_]+":null,n.oct?"[oO][0-7_]+":null,n.bin?"[bB][01_]+":null].filter(a=>a!=null).join("|"),s="\\.?[0-9]+(?:[0-9_]*[0-9])?(?:\\.(?:[0-9](?:[0-9_]*[0-9])?)?)?(?:[eE][-+]?[0-9]+(?:[0-9_]*[0-9])?)?",i=(0,N.regexp)("y",("([-+]?"+(r===""?s:"(?:0(?:"+r+")|"+s+")")).replace(/_/g,n.sep?(0,N.escre)(n.sepChar):""),")",...t.rePart.ender),o=n.sep?(0,N.regexp)("g",(0,N.escre)(n.sepChar)):void 0,l=n.sep?n.sepChar:void 0;return ne(t.number,function(c){n=t.number;let u=c.pnt,d=t.value.def;i.lastIndex=u.sI;let f=i.exec(c.src);if(f){let h=f[1],m=f[2],g,p=!0;if(h!=null&&(p=!t.number.exclude||!h.match(t.number.exclude))){let y=h.length;if(0<y){let b;if(t.value.lex&&(b=d[h])!==void 0)g=c.token("#VL",b.val,h,u);else{let T=o&&l&&-1<h.indexOf(l)?h.replace(o,""):h,k=+T;if(isNaN(k)){let A=T[0];(A==="-"||A==="+")&&(k=(A==="-"?-1:1)*+T.substring(1))}isNaN(k)||(g=c.token("#NR",k,h,u),u.sI+=y,u.cI+=y)}}}return p&&g!=null&&(g=Yt(c,g,m)),g}})};S.makeNumberMatcher=or;var lr=(t,e)=>{let n=e.string||{};t.string=t.string||{},t.string.quoteMap=(0,N.charset)(n.chars),t.string.quoteBitmap=(0,N.charsBitmap)(n.chars),t.string.multiChars=(0,N.charset)(n.multiChars),t.string.multiBitmap=(0,N.charsBitmap)(n.multiChars),t.string.escMap={...n.escape},t.string.replaceCodeMap=(0,N.omap)((0,N.clean)({...n.replace}),([i,o])=>[i.charCodeAt(0),o]),t.string=(0,N.deep)(t.string,{lex:!!n?.lex,escChar:n.escapeChar,escCharCode:n.escapeChar==null?void 0:n.escapeChar.charCodeAt(0),allowUnknown:!!n.allowUnknown,escapeStrict:!!n.escapeStrict,allowControl:!!n.allowControl,hasReplace:!1,abandon:!!n.abandon}),t.string.check=n.check,t.string.escMap=(0,N.clean)(t.string.escMap);for(let i of(0,N.keys)(t.string.escMap))t.string.escMap[i]===""&&delete t.string.escMap[i];t.string.escBitmap=(0,N.charsBitmap)(t.string.escMap),t.string.hasReplace=0<(0,N.keys)(t.string.replaceCodeMap).length;let r=new Map;for(let i of Object.keys(t.string.quoteMap))r.set(i.charCodeAt(0),dt(t,i));let s={sI:0,rI:0,cI:0};return ne(t.string,function(o){let l=t.string,{quoteMap:a,quoteBitmap:c,escMap:u,escCharCode:d,multiChars:f,multiBitmap:h,allowUnknown:m,replaceCodeMap:g,hasReplace:p,escapeStrict:y}=l,{pnt:b,src:T}=o,k=b.sI,A=b.rI,C=T.length,M=T.charCodeAt(k);if(!(M<256?c[M]:a[T[k]]))return;let x=T[k],B=M<256?!!h[M]:!!f[x],$=r.get(M)||(()=>{let Q=dt(t,x);return r.set(M,Q),Q})(),v=k+1,Se=A,I=b.cI+1,_;for(;v<C;){let Q=v;if(ke(T,v,Se,I,$,s),v=s.sI,Se=s.rI,I=s.cI,_!==void 0&&Q<v&&_.push(T.substring(Q,v)),v>=C)break;let ae=T.charCodeAt(v);if(ae===M){let U=_===void 0?T.substring(k+1,v):_.join(ee.EMPTY);v++;let V=o.token("#ST",U,void 0,b,void 0,void 0,v-k);return b.sI=v,b.rI=Se,b.cI=I+1,V}if(p){let U=g[ae];if(U!==void 0){_===void 0&&(_=k+1<v?[T.substring(k+1,v)]:[]),_.push(U),v++,I++;continue}}if(ae===d){if(_===void 0&&(_=k+1<v?[T.substring(k+1,v)]:[]),v++,I++,v>=C)break;let U=T[v],V=u[U];if(V!=null)_.push(V),v++,I++;else if(U==="x"&&!y){v++;let P=parseInt(T.substring(v,v+2),16);if(isNaN(P))return l.abandon?void 0:(v-=2,I-=1,b.sI=v,b.cI=I,o.bad(N.S.invalid_ascii,v,v+4));_.push(String.fromCharCode(P)),v+=2,I+=3}else if(U==="u")if(v++,T[v]==="{"&&!y){let P=T.indexOf("}",v+1),be=P===-1?"":T.substring(v+1,P),ft=0<be.length&&be.length<=6&&/^[0-9a-fA-F]+$/.test(be)?parseInt(be,16):NaN;if(isNaN(ft)||1114111<ft)return l.abandon?void 0:(v=v-2,b.sI=v,b.cI=I-1,o.bad(N.S.invalid_unicode,v,P===-1?C:P+1));_.push(String.fromCodePoint(ft)),I+=P+1-v+1,v=P+1}else{let P=parseInt(T.substring(v,v+4),16);if(isNaN(P))return l.abandon?void 0:(v=v-2,I-=1,b.sI=v,b.cI=I,o.bad(N.S.invalid_unicode,v,v+6));_.push(String.fromCharCode(P)),v+=4,I+=5}else if(m)_.push(U),v++,I++;else return l.abandon?void 0:(b.sI=v,b.cI=I,o.bad(N.S.unexpected,v,v+1));continue}if(ae<32)return l.abandon?void 0:(b.sI=v,b.cI=I,o.bad(N.S.unprintable,v,v+1));break}if(!l.abandon)return b.rI=A,o.bad(N.S.unterminated_string,k,v)})};S.makeStringMatcher=lr;var ar=(t,e)=>{let n=pt(t.line),r={sI:0,rI:0,cI:0};return ne(t.line,function(i){let{pnt:o,src:l}=i;if(t.line.single){let a=t.line.charsBitmap,c=t.line.rowCharsBitmap,u=t.line.chars,d=t.line.rowChars,f=o.sI,h=o.rI,m,g={};for(;(m=l.charCodeAt(f))<256?a[m]:u[l[f]];){let p=l[f],y=(g[p]||0)+1;if(g[p]=y,y>1)break;(m<256?c[m]:d[l[f]])&&h++,f++}if(o.sI<f){let p=i.token("#LN",void 0,void 0,o,void 0,void 0,f-o.sI);return o.sI=f,o.rI=h,o.cI=1,p}return}if(ke(l,o.sI,o.rI,o.cI,n,r)){let a=i.token("#LN",void 0,void 0,o,void 0,void 0,r.sI-o.sI);return o.sI=r.sI,o.rI=r.rI,o.cI=1,a}})};S.makeLineMatcher=ar;var cr=(t,e)=>{let n=Ut(t.space.charsBitmap,t.space.chars),r={sI:0,rI:0,cI:0};return ne(t.space,function(i){let{pnt:o,src:l}=i;if(ke(l,o.sI,o.rI,o.cI,n,r)){let a=i.token("#SP",void 0,void 0,o,void 0,void 0,r.sI-o.sI);return o.sI=r.sI,o.rI=r.rI,o.cI=r.cI,a}})};S.makeSpaceMatcher=cr;function Yt(t,e,n){let r=t.pnt,s=e;if(t.cfg.fixed.lex&&n!=null&&0<n.length){let o,l=t.cfg.fixed.token[n];l!=null&&(o=t.token(l,void 0,n,r)),o!=null&&(r.sI+=o.src.length,r.cI+=o.src.length,e==null?s=o:r.token.push(o))}return s}var Ft={match:1,fixed:1,space:1,line:1,string:1,comment:1,number:1,text:1},Ue=class{refwd(){return this.fwdSI!==this.pnt.sI&&(this.fwd=this.src.substring(this.pnt.sI),this.fwdSI=this.pnt.sI),this.fwd}relex(e,n,r){if(e==null||e.len<=0||e.sI<0)return;let s=this.pnt,i=s.sI,o=s.rI,l=s.cI,a=s.token,c=s.end;s.sI=e.sI,s.rI=e.rI,s.cI=e.cI,s.token=[],s.end=void 0,this.want=n;let u;try{u=this.next(r)}finally{this.want=null}if(u==null||!n.includes(u.tin)){s.sI=i,s.rI=o,s.cI=l,s.token=a,s.end=c;return}e.ignored!=null&&(u.ignored=e.ignored);let d=this.relexUndo;return d.sI=i,d.rI=o,d.cI=l,d.token=a,d.end=c,u}unrelex(e,n,r,s,i){let o=this.pnt;o.sI=e,o.rI=n,o.cI=r,o.token=s,o.end=i}speculate(e,n,r){let s=this.pnt,i=s.sI,o=s.rI,l=s.cI,a=s.token.length,c=s.end;Ft[e.matcher]===void 0&&this.refwd();let u=e(this,n,r);if(u!=null&&this.want.includes(u.tin))return u;s.sI=i,s.rI=o,s.cI=l,s.token.length=a,s.end=c}constructor(e){this.src=ee.EMPTY,this.ctx={},this.cfg={},this.pnt=Fe(-1),this.fwd=ee.EMPTY,this.fwdSI=-1,this.want=null,this.relexUndo={sI:-1,rI:-1,cI:-1,token:[],end:void 0},this.ctx=e,this.src=e.src(),this.cfg=e.cfg,this.pnt=Fe(this.src.length)}token(e,n,r,s,i,o,l){let a,c;return typeof e=="string"?(c=e,a=(0,N.tokenize)(c,this.cfg)):(a=e,c=(0,N.tokenize)(e,this.cfg)),ht(c,a,n,r,s||this.pnt,i,o,this.src,l)}next(e,n,r,s){let i,o=this.pnt,l=o.sI,a;if(o.end)i=o.end;else if(0<o.token.length)i=o.token.shift();else if(o.len<=o.sI)o.end=this.token("#ZZ",void 0,"",o),i=o.end;else{let c=this.cfg.lex.dispatch,u=this.src.charCodeAt(o.sI),d=c===void 0?this.cfg.lex.match:c[u<256?u:256];try{for(let f of d){if(this.want!=null){let h=f.matcher;if(h!=="match"&&h!=="fixed"){let m=this.cfg.t,g=h==="space"?m.SP:h==="line"?m.LN:h==="string"?m.ST:h==="comment"?m.CM:h==="number"?m.NR:h==="text"?m.TX:-1;if(g===-1){let p=this.speculate(f,e,s);if(p===void 0)continue;i=p,a=f;break}if(!this.want.includes(g))continue}}if(Ft[f.matcher]===void 0&&this.refwd(),i=f(this,e,s)){a=f;break}}}catch(f){i=i||this.token("#BD",void 0,this.src[o.sI],o,{err:f},f.code||N.S.unexpected)}i=i||this.token("#BD",void 0,this.src[o.sI],o,void 0,N.S.unexpected)}return this.ctx.log&&this.ctx.log(N.S.lex,this.ctx,e,this,o,l,a,i,n,r,s),this.ctx.sub.lex&&this.ctx.sub.lex.map(c=>c(i,e,this.ctx)),i}tokenize(e){return(0,N.tokenize)(e,this.cfg)}bad(e,n,r){return this.token("#BD",void 0,0<=n&&n<=r?this.src.substring(n,r):this.src[this.pnt.sI],void 0,void 0,e)}};S.Lex=Ue;var ur=(...t)=>new Ue(...t);S.makeLex=ur});var Te=H(Z=>{"use strict";Object.defineProperty(Z,"__esModule",{value:!0});Z.TabnasError=void 0;Z.errdesc=zt;Z.errinject=Gt;Z.errsite=kt;Z.errmsg=Ht;Z.trimstk=fr;Z.strinject=Vt;Z.prop=Zt;var fe=ce(),gt=ue(),Qs={function:"function",object:"object",string:"string",unexpected:"unexpected",Object:"Object",Array:"Array",gap:"  ",no_re_flags:fe.EMPTY},bt=class extends SyntaxError{constructor(e,n,r,s,i){n=(0,gt.deep)({},n);let o=zt(e,n,r,s,i);super(o.message),(0,gt.assign)(this,o)}};Z.TabnasError=bt;function Gt(t,e,n,r,s,i){let o={...i||{},...i.cfg||{},...i.opts||{},...r||{},...r==null?{}:{src:r.src},...s||{},...i.meta||{},...n||{},code:e,details:n,token:r,rule:s,ctx:i};return Vt(t,o,{indent:"  "})}function fr(t){t.stack&&(t.stack=t.stack.split(`
`).filter(e=>!e.includes("tabnas/tabnas")).map(e=>e.replace(/    at /,"at ")).join(`
`))}function kt(t){let{src:e,sub:n,msg:r,cline:s,row:i,col:o,pos:l}=t;i=i!=null&&0<i?i:1,o=o!=null&&0<o?o:1;let a=s||fe.EMPTY,c=s?"\x1B[0m":fe.EMPTY;l=l!=null&&0<l?l:e==null?0:e.split(`
`).reduce((b,T,k)=>(b+=k<i-1?T.length+1:k===i-1?o:0,b),0);let u=n??fe.EMPTY,d=e.substring(Math.max(0,l-333),l).split(`
`),f=e.substring(l,l+333).split(`
`),h=2+(fe.EMPTY+(i+2)).length,m=i<3?1:i-2,g=b=>a+(fe.EMPTY+m++).padStart(h," ")+" | "+c+(b??fe.EMPTY),p=d.length;return[2<p?g(d[p-3]):null,1<p?g(d[p-2]):null,g(d[p-1]+f[0])," ".repeat(h)+"   "+" ".repeat(o-1)+a+"^".repeat(u.length||1)+" "+r+c,g(f[1]),g(f[2])].filter(b=>b!=null).join(`
`)}function Ht(t){let e={active:!1,reset:"",hi:"",lo:"",line:""};t.color&&t.color.active&&Object.assign(e,t.color);let n={msg:null,hint:null,site:null,...t.txts||{}};return[t.prefix==null?null:typeof t.prefix=="function"?t.prefix(e,t):""+t.prefix,(t.code==null?"":e.hi+"["+(t.name==null?"":t.name+"/")+t.code+"]:")+e.reset+" "+(n.msg==null?"":n.msg),t.row!=null&&t.col!=null||t.file!=null?"  "+e.line+"-->"+e.reset+" "+(t.file==null?"<no-file>":t.file)+(t.row==null||t.col==null?"":":"+t.row+":"+t.col):null,t.src==null||n.site==null?"":kt({src:t.src,sub:t.sub,msg:t.smsg||t.txts?.msg,cline:e.line,row:t.row,col:t.col,pos:t.pos}),"",n.hint==null?"":n.hint,t.suffix==null?null:typeof t.suffix=="function"?t.suffix(e,t):""+t.suffix].filter(s=>s!=null).join(`
`)}function zt(t,e,n,r,s){try{let i=s.src(),o=s.cfg,l=s.meta,a=Gt({msg:o.error[t]||e?.use?.err&&(e.use.err.code||e.use.err.message)||o.error.unknown,hint:(o.hint[t]||e.use?.err?.message||o.hint.unknown||"").trim().split(`
`).map(f=>"  "+f).join(`
`),site:""},t,e,n,r,s);a.site=kt({src:i,msg:a.msg,cline:o.color.active?o.color.line:"",row:n.rI,col:n.cI,pos:n.sI,sub:n.src});let c=o.errmsg.suffix===!0?f=>["",...o.errmsg.link?["  "+f.lo+o.errmsg.link+f.reset]:[],"  "+f.lo+"--internal: tag="+(s.opts.tag||"")+"; rule="+r.name+"~"+r.state+"; token="+(0,gt.tokenize)(n.tin,s.cfg)+(n.why==null?"":"~"+n.why)+"; plugins="+s.plgn().map(h=>h.name).join(",")+"--"+f.reset].join(`
`):typeof o.errmsg.suffix=="string"||typeof o.errmsg.suffix=="function"?o.errmsg.suffix:void 0,u=Ht({code:t,name:o.errmsg.name,txts:a,src:i,file:l?l.fileName:void 0,row:n.rI,col:n.cI,pos:n.sI,sub:n.src,color:o.color,suffix:c}),d={internal:{token:n,ctx:s}};return d={...Object.create(d),message:u,code:t,details:e,meta:l,fileName:l?l.fileName:void 0,lineNumber:n.rI,columnNumber:n.cI,txts:()=>a},d}catch(i){return console.log(i),{}}}function Vt(t,e,n){let r=typeof t,s=Array.isArray(t)?"array":t==null?"string":r==="object"?r:"string",i=s==="object"?t:s==="array"?t.reduce((l,a,c)=>(l[c]=a,l),{}):{_:t},o=e??{};return Object.entries(i).map(l=>i[l[0]]=l[1]==null?"":(""+l[1]).replace(/\{([\w_0-9.]+)}/g,(a,c)=>{let u=Zt(o,c);if(u=u===void 0?a:u,typeof u=="object"){let d=u?.constructor?.name;d==="Object"||d==="Array"?u=JSON.stringify(u).replace(/([^"])"/g,"$1"):u=u.toString()}else u=""+u;return n&&typeof n.indent=="string"&&(u=u.replace(/\n/g,`
`+n.indent)),u})),s==="string"?i._:s==="array"?Object.values(i):i}function Zt(t,e,n){let r=t;try{let s=e.split("."),i;for(let o=0;o<s.length;o++){if(i=s[o],i==="__proto__")throw new Error(i);o<s.length-1&&(t=t[i]=t[i]||{})}if(n!==void 0){if(i==="__proto__")throw new Error(i);t[i]=n}return t[i]}catch{throw new Error("Cannot "+(n===void 0?"get":"set")+" path "+e+" on object: "+Dt(r)+(n===void 0?"":" to value: "+Dt(n,22)))}}function Dt(t,e=44){let n;try{n=typeof t=="object"?JSON.stringify(t):""+t}catch{n=""+t}return dr(e<n.length?n.substring(0,e-3)+"...":n,e)}function dr(t,e=5){return t===void 0?"":(""+t).substring(0,e).replace(/[\r\n\t]/g,".")}});var ue=H(O=>{"use strict";Object.defineProperty(O,"__esModule",{value:!0});O.MATCHER_TOKEN_NAMES=O.values=O.keys=O.omap=O.isarr=O.entries=O.defprop=O.assign=O.S=O.KEY_ORDER=void 0;O.recordKeyOrder=Mr;O.keyOrder=Cr;O.badlex=kr;O.charset=Ne;O.charsBitmap=Ge;O.clean=He;O.clone=Ir;O.configure=mr;O.deep=Ve;O.escre=re;O.filterRules=Or;O.getpath=Nr;O.makelog=yr;O.mesc=gr;O.regexp=De;O.snip=en;O.srcfmt=Qt;O.tokenize=Me;O.parserwrap=Tr;O.str=wr;O.findTokenSet=pr;O.modlist=xr;O.resolveFuncRefs=yt;O.isMatcherToken=Er;var D=ce(),Wt=xe(),Xt=Te(),me=t=>t==null?[]:Object.keys(t);O.keys=me;var ze=t=>t==null?[]:Object.values(t);O.values=ze;var he=t=>t==null?[]:Object.entries(t);O.entries=he;var ye=(t,...e)=>Object.assign(t??{},...e);O.assign=ye;var hr=t=>Array.isArray(t);O.isarr=hr;var Jt=Object.defineProperty;O.defprop=Jt;var de=(t,e)=>Object.entries(t||{}).reduce((n,r)=>{let s=e?e(r):r;s[0]===void 0?delete n[r[0]]:n[s[0]]=s[1];let i=2;for(;s[i]!==void 0;)n[s[i]]=s[i+1],i+=2;return n},{});O.omap=de;var q={indent:". ",logindent:"  ",space:" ",gap:"  ",Object:"Object",Array:"Array",object:"object",string:"string",function:"function",unexpected:"unexpected",map:"map",list:"list",elem:"elem",pair:"pair",val:"val",node:"node",no_re_flags:D.EMPTY,unprintable:"unprintable",invalid_ascii:"invalid_ascii",invalid_unicode:"invalid_unicode",invalid_lex_state:"invalid_lex_state",unterminated_string:"unterminated_string",unterminated_comment:"unterminated_comment",lex:"lex",parse:"parse",error:"error",none:"none",imp_map:"imp,map",imp_list:"imp,list",imp_null:"imp,null",end:"end",open:"open",close:"close",rule:"rule",stack:"stack",nUll:"null",name:"name",make:"make",colon:":",step:"step"};O.S=q;function mr(t,e,n){let r=e||{};r.t=r.t||{},r.tI=r.tI||1;let s=d=>Me(d,r);n.standard$!==!1&&(s("#BD"),s("#ZZ"),s("#UK"),s("#AA"),s("#SP"),s("#LN"),s("#CM"),s("#NR"),s("#ST"),s("#TX"),s("#VL")),r.safe={key:n.safe?.key!==!1},r.fixed={lex:!!n.fixed?.lex,token:n.fixed?de(Sr(He(n.fixed.token)),([d,f])=>[f,Me(d,r)]):{},ref:void 0,check:n.fixed?.check},r.fixed.ref=de(r.fixed.token,([d,f])=>[d,f]),r.fixed.ref=Object.assign(r.fixed.ref,de(r.fixed.ref,([d,f])=>[f,d])),r.match={lex:!!n.match?.lex,value:n.match?de(He(n.match.value),([d,f])=>[d,f]):{},token:n.match?de(He(n.match.token),([d,f])=>[Me(d,r),f]):{},check:n.match?.check},de(r.match.token,([d,f])=>[d,(f.tin$=+d,f)]);let i=n.tokenSet?Object.keys(n.tokenSet).reduce((d,f)=>(d[f]=n.tokenSet[f].filter(h=>h!=null).map(h=>s(h)),d),{}):{};r.tokenSet=r.tokenSet||{},he(i).map(d=>{let f=d[0],h=d[1];r.tokenSet[f]?(r.tokenSet[f].length=0,r.tokenSet[f].push(...h)):r.tokenSet[f]=h}),r.tokenSetTins=he(r.tokenSet).reduce((d,f)=>(d[f[0]]=d[f[0]]||{},f[1].map(h=>d[f[0]][h]=!0),d),{}),r.tokenSetTins.IGNORE=r.tokenSetTins.IGNORE||{},r.space={lex:!!n.space?.lex,chars:Ne(n.space?.chars),charsBitmap:Ge(n.space?.chars),check:n.space?.check},r.line={lex:!!n.line?.lex,chars:Ne(n.line?.chars),charsBitmap:Ge(n.line?.chars),rowChars:Ne(n.line?.rowChars),rowCharsBitmap:Ge(n.line?.rowChars),single:!!n.line?.single,check:n.line?.check},r.text={lex:!!n.text?.lex,modify:(r.text?.modify||[]).concat((n.text?.modify?[n.text.modify]:[]).flat()).filter(d=>d!=null),check:n.text?.check},r.number={lex:!!n.number?.lex,hex:!!n.number?.hex,oct:!!n.number?.oct,bin:!!n.number?.bin,sep:n.number?.sep!=null&&n.number.sep!=="",exclude:n.number?.exclude,sepChar:n.number?.sep,check:n.number?.check},r.value={lex:!!n.value?.lex,def:he(n.value?.def||{}).reduce((d,f)=>(f[1]==null||f[1]===!1||f[1].match||(d[f[0]]=f[1]),d),Object.create(null)),defre:he(n.value?.def||{}).filter(([,d])=>d&&d.match).map(([d,f])=>({name:d,val:f.val,match:f.match,consume:!!f.consume})).sort((d,f)=>d.name<f.name?-1:d.name>f.name?1:0)},r.rule={start:n.rule?.start==null?"val":n.rule.start,maxmul:n.rule?.maxmul==null?3:n.rule.maxmul,finish:!!n.rule?.finish,include:n.rule?.include?n.rule.include.split(/\s*,+\s*/).filter(d=>d!==""):[],exclude:n.rule?.exclude?n.rule.exclude.split(/\s*,+\s*/).filter(d=>d!==""):[]},r.map={extend:!!n.map?.extend,merge:n.map?.merge,child:!!n.map?.child,ordered:!!n.map?.ordered},r.list={property:!!n.list?.property,pair:!!n.list?.pair,child:!!n.list?.child},r.info={map:!!n.info?.map,list:!!n.info?.list,text:!!n.info?.text,marker:n.info?.marker||"__info__"};let l=Object.keys(r.fixed.token).sort((d,f)=>f.length-d.length).map(d=>re(d)).join("|"),a=n.comment?.lex?(n.comment.def?ze(n.comment.def):[]).filter(d=>d&&d.lex).map(d=>re(d.start)).join("|"):"",c=["([",re(me(Ne(r.space.lex&&r.space.chars,r.line.lex&&r.line.chars)).join("")),"]",(typeof n.ender=="string"?n.ender.split(""):Array.isArray(n.ender)?n.ender:[]).map(d=>"|"+re(d)).join(""),l===""?"":"|",l,a===""?"":"|",a,"|$)"];r.rePart={fixed:l,ender:c,commentStart:a},r.re={ender:De(null,...c),rowChars:De(null,re(n.line?.rowChars)),columns:De(null,"["+re(n.line?.chars)+"]","(.*)$")},r.lex={empty:!!n.lex?.empty,emptyResult:n.lex?.emptyResult,relex:!!n.lex?.relex,match:n.lex?.match?he(n.lex.match).reduce((d,f)=>{let h=f[0],m=f[1];if(m){let g=m.make(r,n);g&&(g.matcher=h,g.make=m.make,g.order=m.order),d.push(g)}return d},[]).filter(d=>d!=null&&d!==!1&&-1<+d.order).sort((d,f)=>d.order-f.order):[]},r.parse={prepare:ze(n.parse?.prepare)},r.debug={get_console:n.debug?.get_console||(()=>console),maxlen:n.debug?.maxlen==null?99:n.debug.maxlen,print:{config:!!n.debug?.print?.config,src:n.debug?.print?.src}},r.error=n.error??{},r.errmsg=n.errmsg??{suffix:!0},r.hint=n.hint??{},n.config?.modify&&me(n.config.modify).forEach(d=>n.config.modify[d](r,n)),vr(r),r.debug.print.config&&r.debug.get_console().dir(r,{depth:null}),r.result={fail:[]},n.result&&(r.result.fail=[...n.result.fail]),r.rewind={history:n.rewind?.history==null?1/0:n.rewind.history};let u=n.color??{};return r.color=r.color??{},r.color.active=u.active??r.color.active??!0,r.color.reset=u.reset??r.color.reset??"\x1B[0m",r.color.hi=u.hi??r.color.hi??"\x1B[91m",r.color.lo=u.lo??r.color.lo??"\x1B[2m",r.color.line=u.line??r.color.line??"\x1B[34m",ye(t.options,n),ye(t.token,r.t),ye(t.tokenSet,r.tokenSet),ye(t.fixed,r.fixed.ref),r}function Me(t,e,n){let r=e.t,s=r[t];return s==null&&D.STRING===typeof t&&(s=e.tI++,r[s]=t,r[t]=s,r[t.substring(1)]=s,n!=null&&ye(n.token,e.t)),s}function pr(t,e){let n=e.tokenSet;return n[t]??(typeof t=="string"?n[t.replace(/#/g,"")]:void 0)}function gr(t,e){return e=new String(t),e.esc=!0,e}function De(t,...e){return new RegExp(e.map(n=>n.esc?re(n.toString()):n).join(D.EMPTY),t??"")}function re(t){return t==null?"":t.replace(/[-\\|\]{}()[^$+*?.!=]/g,"\\$&").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function br(t){let e=t.constructor;return q.function===typeof e&&q.Object!==e.name&&q.Array!==e.name}function Ve(t,...e){let n=q.function===typeof t,r=t!=null&&(q.object===typeof t||n);for(let s of e){let i=q.function===typeof s,o=s!=null&&(q.object===typeof s||i),l;if(r&&o&&!i&&Array.isArray(t)===Array.isArray(s)&&!br(s))for(let a in s)t[a]=Ve(t[a],s[a]);else t=s===void 0||D.SKIP===s?t:i?s:o?q.function===typeof(l=s.constructor)&&q.Object!==l.name&&q.Array!==l.name?s:Ve(Array.isArray(s)?[]:{},s):s,n=q.function===typeof t,r=t!=null&&(q.object===typeof t||n)}return t}function kr(t,e,n){let r=t.next.bind(t);return t.next=(s,i,o,l)=>{let a=r(s,i,o,l);if(e===a.tin){let c={};throw a.use!=null&&(c.use=a.use),new Xt.TabnasError(a.why||q.unexpected,c,a,s,n)}return a},t}function yr(t,e){let n=t.opts?.plugin?.debug?.trace;if(e||n)if(typeof e?.log=="number"||n){let r=!1,s=e?.log;(s===-1||n)&&(s=1,r=!0),t.log=(...i)=>{if(r){let o=i.filter(l=>q.object!=typeof l).map(l=>q.function==typeof l?l.name:l).join(q.gap);t.cfg.debug.get_console().log(o)}else t.cfg.debug.get_console().dir(i,{depth:s})}}else typeof e.log=="function"&&(t.log=e.log);return t.log}function vr(t){let e=new Array(257);for(let s=0;s<=256;s++)e[s]=[];let n=s=>{for(let i=0;i<=256;i++)e[i].push(s)},r=(s,i)=>{for(let o=0;o<256;o++)i(o)&&e[o].push(s);e[256].push(s)};for(let s of t.lex.match){let i=s.matcher;if(i==="fixed"&&!t.fixed.check){let o={};for(let l of me(t.fixed.token))if(0<l.length){let a=l.charCodeAt(0);a<256&&(o[a]=!0)}r(s,l=>o[l]===!0)}else if(i==="space"&&!t.space.check)r(s,o=>t.space.charsBitmap[o]!==0);else if(i==="line"&&!t.line.check)r(s,o=>t.line.charsBitmap[o]!==0);else if(i==="string"&&!t.string.check)r(s,o=>t.string.quoteBitmap[o]!==0);else if(i==="comment"&&!t.comment.check){let o={};for(let l of ze(t.comment.def||{})){let a=l.start;if(typeof a=="string"&&0<a.length){let c=a.charCodeAt(0);c<256&&(o[c]=!0)}}r(s,l=>o[l]===!0)}else i==="number"&&!t.number.check?r(s,o=>o===43||o===45||o===46||48<=o&&o<=57):n(s)}t.lex.dispatch=e}function Qt(t){return typeof t.debug.print.src=="function"?t.debug.print.src:e=>{let n=e==null?D.EMPTY:Array.isArray(e)?JSON.stringify(e).replace(/]$/,he(e).filter(r=>isNaN(r[0])).map((r,s)=>(s===0?", ":"")+r[0]+": "+JSON.stringify(r[1]))+"]"):JSON.stringify(e);return n=n.substring(0,t.debug.maxlen)+(t.debug.maxlen<n.length?"...":D.EMPTY),n}}function wr(t,e=44){let n;try{n=typeof t=="object"?JSON.stringify(t):""+t}catch{n=""+t}return en(e<n.length?n.substring(0,e-3)+"...":n,e)}function en(t,e=5){return t===void 0?"":(""+t).substring(0,e).replace(/[\r\n\t]/g,".")}function Ir(t){let e=Object.create(Object.getPrototypeOf(t));for(let n in t)e[n]=Ve(void 0,t[n]);return e}function Ne(...t){return t==null?{}:t.filter(e=>e!==!1).map(e=>typeof e=="object"?me(e).join(D.EMPTY):e).join(D.EMPTY).split(D.EMPTY).reduce((e,n)=>(e[n]=n.charCodeAt(0),e),{})}function Ge(...t){let e=new Uint8Array(256);for(let n of t){if(n==null||n===!1)continue;let r=typeof n=="string"?n:me(n).join(D.EMPTY);for(let s=0;s<r.length;s++){let i=r.charCodeAt(s);i<256&&(e[i]=1)}}return e}var vt=new Set(["#BD","#ZZ","#UK","#AA","#SP","#LN","#CM","#NR","#ST","#TX","#VL"]);O.MATCHER_TOKEN_NAMES=vt;function Er(t){return vt.has(t)}function Sr(t){if(t==null)return t;for(let e of me(t))if(vt.has(e))throw new Error(`Tabnas: ${e} is produced by a lexer matcher and cannot be bound to the fixed literal ${JSON.stringify(t[e])}. Doing so adds a second producer for the same token rather than replacing the matcher, and values silently vanish. Configure the matcher instead (options.number, options.string, options.text, options.value, options.space, options.line, options.comment), or use a token name of your own. Fixed punctuation tokens (#OB #CB #OS #CS #CL #CA) may be rebound freely.`);return t}function He(t){for(let e in t)t[e]==null&&delete t[e];return t}function Or(t,e){let n={...t.def},r=["open","close"];for(let i of r)n[i]=t.def[i].map(o=>({...o,g:typeof o.g=="string"?(o.g||"").split(/\s*,+\s*/):o.g||[]})).filter(o=>e.rule.include.reduce((l,a)=>l||o.g!=null&&o.g.indexOf(a)!==-1,e.rule.include.length===0)).filter(o=>e.rule.exclude.reduce((l,a)=>l&&(o.g==null||o.g.indexOf(a)===-1),!0));let s=Object.create(Object.getPrototypeOf(t));return Object.assign(s,t),s.def=n,s}function xr(t,e){if(e&&t){if(0<t.length){if(e.delete&&0<e.delete.length)for(let r=0;r<e.delete.length;r++){let s=e.delete[r];if(s<0?-1*s<=t.length:s<t.length){let i=(t.length+s)%t.length;t[i]=null}}if(e.move)for(let r=0;r<e.move.length;r+=2){let s=(t.length+e.move[r])%t.length,i=(t.length+e.move[r+1])%t.length,o=t[s];t.splice(s,1),t.splice(i,0,o)}let n=t.filter(r=>r!=null);n.length!==t.length&&(t.length=0,t.push(...n))}if(e.custom){let n=e.custom(t);n!=null&&(t=n)}}return t}function Tr(t){return{start:function(e,n,r,s){try{return t.start(e,n,r,s)}catch(i){if(i.name==="SyntaxError"){let o=0,l=0,a=0,c=D.EMPTY,u=i.message.match(/^Unexpected token (.) .*position\s+(\d+)/i);if(u){c=u[1],o=parseInt(u[2]),l=e.substring(0,o).replace(/[^\n]/g,D.EMPTY).length;let f=o-1;for(;-1<f&&e.charAt(f)!==`
`;)f--;a=Math.max(e.substring(f,o).length,0)}let d=i.token||(0,Wt.makeToken)("#UK",Me("#UK",n.internal().config),void 0,c,(0,Wt.makePoint)(c.length,o,i.lineNumber||l,i.columnNumber||a));throw new Xt.TabnasError(i.code||"json",i.details||{msg:i.message},d,{},i.ctx||{uI:-1,opts:n.options,cfg:n.internal().config,token:d,meta:r,src:()=>e,root:()=>{},plgn:()=>n.internal().plugins,inst:()=>n,rule:{name:"no-rule"},sub:{},xs:-1,v2:d,v1:d,t:[d,d],tC:-1,kI:-1,rs:[],rsI:0,rsm:{},n:{},log:r?r.log:void 0,F:Qt(n.internal().config),u:{},NORULE:{name:"no-rule"},NOTOKEN:{name:"no-token"}})}else throw i}}}}function Nr(t,e){e=typeof e=="string"?e.split("."):e;let n=t;for(let r=0;r<e.length&&n!=null;r++)n=n[e[r]];return n}function yt(t,e){if(t==null||typeof t!="object"){if(typeof t=="string"&&t[0]==="@"){if(t[1]==="@")return t.substring(1);if(t.substring(1)==="SKIP")return D.SKIP;let s=t.match(/^@\/(.*)\/([\w]*)$/);if(s)return new RegExp(s[1],s[2]);let i=t.match(/^@~\/(.*)\/([\w]*)$/);if(i){let o=new RegExp(i[1],i[2]);return o.eager$=!0,o}if(e){let o=e[t];if(typeof o=="function")return o}}return t}if(Array.isArray(t))return t.map(s=>yt(s,e));let n=t.constructor;if(n&&n.name!=="Object")return t;let r={};for(let s of Object.keys(t))r[s]=yt(t[s],e);return r}var Ze=Symbol.for("tabnas.keyOrder");O.KEY_ORDER=Ze;function Mr(t,e){let n=t[Ze];n===void 0&&(n=[],Jt(t,Ze,{value:n,enumerable:!1,writable:!0,configurable:!0})),n.push(""+e)}function Cr(t){if(t!=null&&typeof t=="object"){let e=t[Ze];return e!==void 0?e.slice():Object.keys(t)}return[]}});var nn=H(ve=>{"use strict";Object.defineProperty(ve,"__esModule",{value:!0});ve.BUILTIN_REFS=ve.BUILTIN_SCHEMA_VERSION=void 0;var _r=ue();ve.BUILTIN_SCHEMA_VERSION=3;var Pr=Object.defineProperty;function wt(t,e,n){t!=null&&typeof t=="object"&&Pr(t,e,{value:n,writable:!0})}function tn(t,e){return e==="user"?{rule:t,src:"",kids:[]}:{src:"",kids:[]}}var Ar=(t,e,n)=>{let r=n&&n.k&&n.k.node$||{};r.init&&(t.node=tn(r.rule,r.kind));let s=t.node,i=r.nterms||0;for(let o=0;o<i;o++)s.src+=t.o[o].src},Rr=(t,e,n)=>{let r=n&&n.k&&n.k.capture$||{};t.node==null&&(t.node=tn(r.rule,r.kind));let s=t.node,i=t.child&&t.child.node;if(i!=null){if(typeof i!="object"||!("src"in i)){s.kids.push(i);return}i!==s&&(s.src+=i.src,i.rule?s.kids.push(i):Array.isArray(i.kids)&&s.kids.push(...i.kids))}},$r=t=>{t.child&&t.child.node!==void 0&&(t.node=t.child.node)},jr=(t,e,n)=>{let r=n&&n.k&&n.k.fold$||{},s=t.parent&&t.parent.node;if(s==null||typeof s!="object"||!("src"in s))return;let i=t.node;i!=null&&typeof i=="object"&&"src"in i&&i!==s&&(s.src+=i.src,i.rule?s.kids.push(i):Array.isArray(i.kids)&&s.kids.push(...i.kids));let o=r.cN||0;for(let l=0;l<o;l++)s.src+=t.c[l].src;t.node=void 0},Lr=(t,e)=>{t.k.pd_phase=0,t.k.pd_mark=e.mark()},Br=(t,e)=>{if(t.k.pd_mark==null)throw new Error("@probeDecide$: no pd_mark — phase-0 @probeInit$ did not run");let n=e.t[0];e.rewind(t.k.pd_mark),t.k.pd_phase=n&&n.name===t.k.pd_d?1:2},qr=t=>!t.k.pd_phase,Fr=t=>t.k.pd_phase===1,Kr=t=>t.k.pd_phase===2,Ur=(t,e,n)=>{let r=Object.create(null);if(t.node=r,e.cfg.info.map){let s=n&&n.k&&n.k.object$||{};wt(r,e.cfg.info.marker,{implicit:!!s.implicit,meta:{}})}},Yr=(t,e,n)=>{let r=[];if(t.node=r,e.cfg.info.list){let s=n&&n.k&&n.k.array$||{};wt(r,e.cfg.info.marker,{implicit:!!s.implicit,meta:{}})}},Dr=t=>{t.node=void 0},Gr=(t,e,n)=>{let r=n&&n.k&&n.k.key$||{};t.u[r.slot||"key"]=t.o[r.from||0]?.val},Hr=(t,e,n)=>{let r=n&&n.k&&n.k.setval$||{},s=t.node;if(s!=null&&typeof s=="object"){let i=t.u[r.slot||"key"];if(e.cfg.info.map&&i===e.cfg.info.marker)return;e.cfg.map&&e.cfg.map.ordered&&!(i in s)&&(0,_r.recordKeyOrder)(s,i),s[i]=t.child.node}},zr=t=>{t.child.node!==void 0&&Array.isArray(t.node)&&t.node.push(t.child.node)},Vr=(t,e,n)=>{if(t.child.node!==void 0){t.node=t.child.node;return}let r=n&&n.k&&n.k.value$||{},s=t.o[r.from||0],i=s?s.resolveVal(t,e):void 0,o=e.cfg.info;if(o.text&&typeof i=="string"&&s&&(s.tin===e.cfg.t.ST||s.tin===e.cfg.t.TX)){let l=s.tin===e.cfg.t.ST&&s.src.length>0?s.src[0]:"",a=new String(i);wt(a,o.marker,{quote:l}),i=a}t.node=i};ve.BUILTIN_REFS=Object.freeze({"@node$":Ar,"@capture$":Rr,"@bubble$":$r,"@fold$":jr,"@probeInit$":Lr,"@probeDecide$":Br,"@probePhase0$":qr,"@probePhase1$":Fr,"@probePhase2$":Kr,"@object$":Ur,"@array$":Yr,"@reset$":Dr,"@key$":Gr,"@setval$":Hr,"@push$":zr,"@value$":Vr})});var It=H(We=>{"use strict";Object.defineProperty(We,"__esModule",{value:!0});We.defaults=void 0;var se=xe(),Zr={safe:{key:!0},tag:"-",fixed:{lex:!0,token:{"#OB":"{","#CB":"}","#OS":"[","#CS":"]","#CL":":","#CA":","}},match:{lex:!0,token:{}},tokenSet:{IGNORE:["#SP","#LN","#CM"],VAL:["#TX","#NR","#ST","#VL"],KEY:["#TX","#NR","#ST","#VL"]},space:{lex:!0,chars:" 	"},line:{lex:!0,chars:`\r
`,rowChars:`
`,single:!1},text:{lex:!0},number:{lex:!0,hex:!0,oct:!0,bin:!0,sep:"_",exclude:void 0},comment:{lex:!0,def:{hash:{line:!0,start:"#",lex:!0,eatline:!1},slash:{line:!0,start:"//",lex:!0,eatline:!1},multi:{line:!1,start:"/*",end:"*/",lex:!0,eatline:!1}}},string:{lex:!0,chars:"'\"`",multiChars:"`",escapeChar:"\\",escape:{b:"\b",f:"\f",n:`
`,r:"\r",t:"	",v:"\v",'"':'"',"'":"'","`":"`","\\":"\\","/":"/"},allowUnknown:!0,escapeStrict:!1,allowControl:!1,abandon:!1},map:{extend:!0,merge:void 0,child:!1},list:{property:!0,pair:!1,child:!1},info:{map:!1,list:!1,text:!1,marker:"__info__"},value:{lex:!0,def:{true:{val:!0},false:{val:!1},null:{val:null}}},ender:[],plugin:{},debug:{get_console:()=>console,maxlen:99,print:{config:!1,src:void 0}},error:{unknown:"unknown error: {code}",unexpected:"unexpected character(s): {src}",invalid_unicode:"invalid unicode escape: {src}",invalid_ascii:"invalid ascii escape: {src}",unprintable:"unprintable character: {src}",unterminated_string:"unterminated string: {src}",unterminated_comment:"unterminated comment: {src}",unknown_rule:"unknown rule: {rulename}",end_of_source:"unexpected end of source"},errmsg:{name:"tabnas",suffix:!0},hint:{unknown:`
Unknown error code: {code}
Details:
{details}`,unexpected:`
The character(s) {src} do not match any rule alternative active at
this position.`,invalid_unicode:`
The escape sequence {src} does not encode a valid unicode code point.`,invalid_ascii:`
The escape sequence {src} does not encode a valid ASCII character.`,unprintable:`
The character {src} (code point below 32) is not allowed inside a
string literal.`,unterminated_string:`
This string has no end quote.`,unterminated_comment:`
This comment is never closed.`,unknown_rule:`
No rule named $rulename is defined.`,end_of_source:`
Unexpected end of source.`},lex:{match:{match:{order:1e6,make:se.makeMatchMatcher},fixed:{order:2e6,make:se.makeFixedMatcher},space:{order:3e6,make:se.makeSpaceMatcher},line:{order:4e6,make:se.makeLineMatcher},string:{order:5e6,make:se.makeStringMatcher},comment:{order:6e6,make:se.makeCommentMatcher},number:{order:7e6,make:se.makeNumberMatcher},text:{order:8e6,make:se.makeTextMatcher}},empty:!0,emptyResult:void 0,relex:!1},parse:{prepare:{}},rule:{start:"val",finish:!0,maxmul:3,include:"",exclude:""},result:{fail:[]},rewind:{history:64},config:{modify:{}},parser:{start:void 0}};We.defaults=Zr});var rn=H(Xe=>{"use strict";Object.defineProperty(Xe,"__esModule",{value:!0});Xe.Context=void 0;var Et=class{constructor(e){this.uI=0,this.xs=-1,this.v=[],this.vAbs=0,this.tC=-2,this.kI=-1,this.rs=[],this.rsI=0,this.u={},this.opts=e.opts,this.cfg=e.cfg,this.meta=e.meta,this.src=e.src,this.root=e.root,this.plgn=e.plgn,this.inst=e.inst,this.sub=e.sub,this.rsm=e.rsm,this.F=e.F,this.NOTOKEN=e.NOTOKEN,this.NORULE=e.NORULE,this.rule=e.NORULE,this.t=[e.NOTOKEN,e.NOTOKEN]}get t0(){return this.t[0]??this.NOTOKEN}set t0(e){this.t[0]=e}get t1(){return this.t[1]??this.NOTOKEN}set t1(e){this.t[1]=e}get v1(){return this.v[this.v.length-1]??this.NOTOKEN}set v1(e){0<this.v.length?this.v[this.v.length-1]=e:this.v.push(e)}get v2(){return this.v[this.v.length-2]??this.NOTOKEN}set v2(e){let n=this.v.length;1<n?this.v[n-2]=e:n===1?this.v.unshift(e):this.v.push(e)}mark(){return this.vAbs}rewind(e){let n=this.vAbs-e;if(n<=0)return;if(n>this.v.length)throw new Error(`tabnas: ctx.rewind target ${e} is outside the retained history window (oldest mark available is ${this.vAbs-this.v.length}, current is ${this.vAbs}); increase options.rewind.history.`);let r=this.lex.pnt.token,s=this.NOTOKEN,i=[];for(let o=0;o<this.t.length;o++){let l=this.t[o];l&&l!==s&&i.push(l),this.t[o]=s}for(let o=i.length-1;o>=0;o--)r.unshift(i[o]);for(let o=0;o<n;o++)r.unshift(this.v.pop());this.vAbs-=n,this.lex.pnt.end=void 0}};Xe.Context=Et});var xt=H(F=>{"use strict";Object.defineProperty(F,"__esModule",{value:!0});F.makeRuleSpec=F.makeNoRule=F.makeRule=F.AltMatch=F.RuleSpec=F.Rule=void 0;F.validateAlt=fn;F.validateAlts=ts;var R=ce(),G=ue(),St=Te(),Je=class{#e;#t;#n;get n(){return this.#e??=Object.create(null)}set n(e){this.#e=e}get u(){return this.#t??=Object.create(null)}set u(e){this.#t=e}get k(){return this.#n??=Object.create(null)}set k(e){this.#n=e}rawn(){return this.#e}rawu(){return this.#t}rawk(){return this.#n}constructor(e,n,r){this.i=-1,this.name=R.EMPTY,this.node=null,this.state=R.OPEN,this.d=-1,this.bo=!1,this.ao=!1,this.bc=!1,this.ac=!1,this.oN=0,this.cN=0,this.need=0,this.i=n.uI++,this.name=e.name,this.spec=e,this.child=n.NORULE,this.parent=n.NORULE,this.prev=n.NORULE,this.next=n.NORULE,this._NOTOKEN=n.NOTOKEN,this.o=[],this.c=[],this.node=r,this.d=n.rsI,this.bo=e.def.bo!=null,this.ao=e.def.ao!=null,this.bc=e.def.bc!=null,this.ac=e.def.ac!=null}get o0(){return this.o[0]??this._NOTOKEN}set o0(e){this.o[0]=e}get o1(){return this.o[1]??this._NOTOKEN}set o1(e){this.o[1]=e}get c0(){return this.c[0]??this._NOTOKEN}set c0(e){this.c[0]=e}get c1(){return this.c[1]??this._NOTOKEN}set c1(e){this.c[1]=e}get os(){return this.oN}set os(e){this.oN=e}get cs(){return this.cN}set cs(e){this.cN=e}process(e,n){return this.spec.process(this,e,n,this.state)}eq(e,n=0){return(this.#e?.[e]??0)===n}lt(e,n=0){return(this.#e?.[e]??0)<n}gt(e,n=0){return(this.#e?.[e]??0)>n}lte(e,n=0){return(this.#e?.[e]??0)<=n}gte(e,n=0){return(this.#e?.[e]??0)>=n}exist(e){return this.#e?.[e]!=null}toString(){return"[Rule "+this.name+"~"+this.i+"]"}};F.Rule=Je;var Qe=(...t)=>new Je(...t);F.makeRule=Qe;var Wr=(t,e)=>Qe(un(t,e.cfg,{}),e);F.makeNoRule=Wr;var et=class{constructor(){this.p=R.EMPTY,this.r=R.EMPTY,this.b=0}};F.AltMatch=et;var cn=(...t)=>new et(...t),Xr=cn(),tt=class{constructor(e,n,r){this.name=R.EMPTY,this.def={open:[],close:[],bo:[],bc:[],ao:[],ac:[],tcol:[],fnref:{}},this.ji=e,this.cfg=n,this.def=Object.assign(this.def,r),this.def.open=(this.def.open||[]).filter(i=>i!=null),this.def.close=(this.def.close||[]).filter(i=>i!=null);for(let i of this.def.open)Ce(i,R.OPEN,this);for(let i of this.def.close)Ce(i,R.CLOSE,this);let s=["bo","ao","bc","ac"];for(let i of s)for(let o of this.def[i]??[])if(typeof o=="object"){let l=o;this[i](l.append,l.action)}}tin(e){return(0,G.tokenize)(e,this.cfg)}fnref(e){Object.assign(this.def.fnref,e);let n=this.name,r=this.def.fnref,s=this.def.fnrefInstalled=this.def.fnrefInstalled||new Map,i=this.def.fnrefReplaced=this.def.fnrefReplaced||new Set,o=[`@${n}-bo`,`@${n}-ao`,`@${n}-bc`,`@${n}-ac`];for(let l of o){let a=s.get(l);a||s.set(l,a=new WeakSet);let c=l.replace(/^[^-]+-/,""),u=r[l+"/replace"];if(u){i.has(l)||(i.add(l),this.def[c].length=0,a=new WeakSet,s.set(l,a),a.add(u),this[c](!0,u));continue}if(i.has(l))continue;let d=r[l+"/prepend"],f=r[l+"/append"]??r[l];d&&!a.has(d)&&(a.add(d),this[c](!1,d)),f&&!a.has(f)&&(a.add(f),this[c](!0,f))}return this}add(e,n,r){let s=r?.append?"push":"unshift",i=((0,G.isarr)(n)?n:[n]).filter(a=>a!=null&&typeof a=="object").map(a=>Ce(a,e,this)),o=e==="o"?"open":"close",l=this.def[o];return r?.clear&&(l.length=0),l[s](...i),l=this.def[o]=(0,G.modlist)(l,r),this.norm(),this}open(e,n){return this.add("o",e,n)}close(e,n){return this.add("c",e,n)}action(e,n,r,s){let i=this.def[n+r];return e?i.push(s):i.unshift(s),this}bo(e,n){return this.action(n?!!e:!0,R.BEFORE,R.OPEN,typeof e=="string"?this.def.fnref[e]:n??e)}ao(e,n){return this.action(n?!!e:!0,R.AFTER,R.OPEN,typeof e=="string"?this.def.fnref[e]:n??e)}bc(e,n){return this.action(n?!!e:!0,R.BEFORE,R.CLOSE,typeof e=="string"?this.def.fnref[e]:n??e)}ac(e,n){return this.action(n?!!e:!0,R.AFTER,R.CLOSE,typeof e=="string"?this.def.fnref[e]:n??e)}clear(){return this.def.open.length=0,this.def.close.length=0,this.def.bo.length=0,this.def.ao.length=0,this.def.bc.length=0,this.def.ac.length=0,this}clearOpen(){return this.def.open.length=0,this}clearClose(){return this.def.close.length=0,this}clearActions(...e){let n=0<e.length?e:["bo","ao","bc","ac"],r=this.def.fnrefInstalled,s=this.def.fnrefReplaced;for(let i of n){this.def[i].length=0;let o=`@${this.name}-${i}`;r&&r.delete(o),s&&s.delete(o)}return this}norm(){this.def.open.map(o=>Ce(o,R.OPEN,this)),this.def.close.map(o=>Ce(o,R.CLOSE,this));let e=[],n=o=>o.reduce((l,a)=>Math.max(l,a.sN||0),0),r=n(this.def.open),s=n(this.def.close);for(let o=0;o<r;o++)this.def.open.reduce(...i(0,o,e));for(let o=0;o<s;o++)this.def.close.reduce(...i(1,o,e));e[0]=e[0]||[],e[1]=e[1]||[];for(let o=0;o<r;o++)e[0][o]=e[0][o]||[];for(let o=0;o<s;o++)e[1][o]=e[1][o]||[];this.def.tcol=e;function i(o,l,a){a[o]=a[o]||[];let c=a[o][l]=a[o][l]||[];return[function(u,d){let f=d.t&&d.t[l];if(f&&0<f.length){let h=[...new Set(u.concat(f))];u.length=0,u.push(...h)}return u},c]}return this}process(e,n,r,s){n.log&&n.log(G.S.rule,n,e,r);let i=s==="o",o=i?e:n.NORULE,l=i?"O":"C",a=this.def,c=n.log!=null,u=i?a.open:a.close,d=i?e.bo?a.bo:null:e.bc?a.bc:null;if(d){let p;for(let y=0;y<d.length;y++)if(p=d[y].call(this,e,n,o,p),p?.isToken&&p?.err)return this.bad(p,e,n,{is_open:i})}let f=0<u.length?Jr(i,u,r,e,n):Xr;if(f.h&&(f=f.h(e,n,f,o)||f,c&&(l+="H")),f.e)return this.bad(f.e,e,n,{is_open:i});if(f.n){let p=e.n;for(let y in f.n)p[y]=f.n[y]===0?0:(p[y]==null?0:p[y])+f.n[y]}f.u&&(e.u=Object.assign(e.u,f.u)),f.k&&(e.k=Object.assign(e.k,f.k));let h=e[i?"oN":"cN"]-(f.b||0);if(0<h){let p=n.NOTOKEN;for(let b=0;b<h;b++)n.v.push(n.t[b]),n.t[b]=p;n.vAbs+=h;let y=n.cfg.rewind.history;y!==1/0&&n.v.length>2*y&&n.v.splice(0,n.v.length-y)}if(f.a){c&&(l+="A");let p=f.a(e,n,f);if(p&&p.isToken&&p.err)return this.bad(p,e,n,{is_open:i})}if(f.p){n.rs[n.rsI++]=e;let p=n.rsm[f.p];if(p){o=e.child=Qe(p,n,e.node),o.parent=e;let y=e.rawn();if(y!==void 0){let T;for(let k in y)(T??=o.n)[k]=y[k]}let b=e.rawk();if(b!==void 0){let T;for(let k in b)(T??=o.k)[k]=b[k]}c&&(l+="P`"+f.p+"`")}else return this.bad(this.unknownRule(n.t0,f.p),e,n,{is_open:i})}else if(f.r){let p=n.rsm[f.r];if(p){o=Qe(p,n,e.node),o.parent=e.parent,o.prev=e;let y=e.rawn();if(y!==void 0){let T;for(let k in y)(T??=o.n)[k]=y[k]}let b=e.rawk();if(b!==void 0){let T;for(let k in b)(T??=o.k)[k]=b[k]}c&&(l+="R`"+f.r+"`")}else return this.bad(this.unknownRule(n.t0,f.r),e,n,{is_open:i})}else i||(o=n.rs[--n.rsI]||n.NORULE);e.next=o;let m=i?e.ao?a.ao:null:e.ac?a.ac:null;if(m){let p;for(let y=0;y<m.length;y++)if(p=m[y](e,n,o,p),p?.isToken&&p?.err)return this.bad(p,e,n,{is_open:i})}o.why=l,n.log&&n.log(G.S.node,n,e,r,o),R.OPEN===e.state&&(e.state=R.CLOSE);let g=e[i?"oN":"cN"]-(f.b||0);if(g<0&&(g=0),0<g){let p=n.t.length;for(let y=0;y<p-g;y++)n.t[y]=n.t[y+g];for(let y=Math.max(0,p-g);y<p;y++)n.t[y]=n.NOTOKEN}return o}bad(e,n,r,s){throw new St.TabnasError(e.err||G.S.unexpected,{...e.use,state:s.is_open?G.S.open:G.S.close},e,n,r)}unknownRule(e,n){return e.err="unknown_rule",e.use=e.use||{},e.use.rulename=n,e}};F.RuleSpec=tt;var un=(...t)=>new tt(...t);F.makeRuleSpec=un;function Jr(t,e,n,r,s){let i=s._palt||(s._palt=cn());i.b=0,i.p=R.EMPTY,i.r=R.EMPTY,i.n=void 0,i.h=void 0,i.a=void 0,i.u=void 0,i.k=void 0,i.e=void 0;let o=null,l=0,a=s.cfg.t,c=!0,u=1<<a.AA-1,d=s.cfg.tokenSetTins.IGNORE,f=a.BD,h=G.S.unexpected,m=e.length,g=s.NOTOKEN,p=s.t,y=s.cfg.lex.relex,b=-1,T=g,k=0,A=0,C=0,M=null,x;for(l=0;l<m;l++){o=e[l];let $=0;c=!0,b=-1;let v=o.S,Se=o.sN|0;for(let I=0;I<Se;I++){let _=p[I];if(_==null||g===_){do if(_=n.next(r,o,l,I),s.tC++,f===_.tin&&!y){let U={};throw _.use!=null&&(U.use=_.use),new St.TabnasError(_.why||h,U,_,r,s)}while(d[_.tin]);p[I]=_}let Q=v?v[I]:null,ae=f===_.tin;if(ae||Q!=null){let U=!1;if(!ae&&Q!=null){let V=_.tin,P=V/31|0,be=P===0?u:0;U=(Q[P]&(1<<V%31-1|be))!==0}if(!U){let V;if(y&&0<_.len){let P=o.t[I];P!=null&&0<P.length&&(V=n.relex(_,P,r))}if(V==null){c=!1;break}if(b===-1){let P=n.relexUndo;b=I,T=_,k=P.sI,A=P.rI,C=P.cI,M=P.token,x=P.end}p[I]=V;for(let P=I+1;P<p.length;P++)p[P]=g}}$=I+1}if(c){if(t){r.oN=$;for(let I=0;I<$;I++)r.o[I]=p[I];for(let I=$;I<r.o.length;I++)r.o[I]=g}else{r.cN=$;for(let I=0;I<$;I++)r.c[I]=p[I];for(let I=$;I<r.c.length;I++)r.c[I]=g}o.c&&(c=o.c(r,s,i))}if(c)break;if(o=null,b!==-1){n.unrelex(k,A,C,M,x),p[b]=T;for(let I=b+1;I<p.length;I++)p[I]=g;b=-1}}if(!c){let $=p[0];if(y&&$!=null&&f===$.tin){let v={};throw $.use!=null&&(v.use=$.use),new St.TabnasError($.why||h,v,$,r,s)}i.e=p[0]??g}o&&(i.n=o.n!=null?o.n:i.n,i.h=o.h!=null?o.h:i.h,i.a=o.a!=null?o.a:i.a,i.u=o.u!=null?o.u:i.u,i.k=o.k!=null?o.k:i.k,i.g=o.g!=null?o.g:i.g,i.e=o.e&&o.e(r,s,i)||void 0,i.p=o.p!=null&&o.p!==!1?typeof o.p=="string"?o.p:o.p(r,s,i):i.p,i.r=o.r!=null&&o.r!==!1?typeof o.r=="string"?o.r:o.r(r,s,i):i.r,i.b=o.b!=null&&o.b!==!1?typeof o.b=="number"?o.b:o.b(r,s,i):i.b);let B=l<e.length;return s.log&&s.log(G.S.parse,s,r,n,B,c,l,o,i),i}var Qr=(t,e)=>t.filter(n=>31*e<=n&&n<31*(e+1)),es=(t,e)=>t.reduce((n,r)=>1<<r-(31*e+1)|n,0),Ot=/^[a-z][a-z0-9-]+$/;function Ce(t,e,n){R.STRING===typeof t.g?t.g=t.g.split(/\s*,\s*/):t.g==null&&(t.g=[]);for(let s of t.g)if(!Ot.test(s))throw new Error(`Grammar: invalid group tag "${s}" in rule ${n.name} (${e}) — must match ${Ot}`);t.g=t.g.sort();let r=t;if(!t.s||t.s.length===0)t.s=null,r.t=[],r.S=null,r.sN=0;else{let s=a=>a.flat().map(u=>typeof u=="string"?u.split(/\s* +\s*/):u).flat().map(u=>typeof u=="string"?n.ji.tokenSet(u)??n.ji.token(u):u).flat().filter(u=>typeof u=="number");typeof t.s=="string"&&(t.s=t.s.split(/\s* +\s*/));let i=t.s.length,o=new Array(i),l=new Array(i);for(let a=0;a<i;a++){let c=s([t.s[a]]);o[a]=c;let u=n.ji.token("#AA");if(u!=null&&c.includes(u)){l[a]=null;continue}l[a]=0<c.length?new Array(Math.max(...c.map(d=>1+d/31|0))).fill(null).map((d,f)=>f).map(d=>es(Qr(c,d),d)):null}r.t=o,r.S=l,r.sN=i}if(t.p?pe("push",e,n,t,"p"):t.p=null,t.r?pe("replace",e,n,t,"r"):t.r=null,t.b?pe("back",e,n,t,"b"):t.b=null,t.a?pe("action",e,n,t,"a"):t.a=null,t.h?pe("modify",e,n,t,"h"):t.h=null,t.e?pe("error",e,n,t,"e"):t.e=null,!t.c)t.c=null;else{let s=typeof t.c;if(s==="string")pe("condition",e,n,t,"c");else if(s==="function")t.c.name==="c"&&(0,G.defprop)(t.c,"name",{value:"ruleCond"});else if(s==="object"){let i=t.c,o=[],l=Object.keys(t.c);for(let a of l){let c=i[a];if(c!=null){let u=dn(a,c);if(0<u.length){let d=(n?.name??"?")+"."+(R.OPEN===e?"open":"close");throw new Error("tabnas: "+d+": "+u.join("; "))}if(typeof c=="object")for(let d of Object.keys(c))o.push(an(d,a,c[d]));else o.push(an("$eq",a,c))}}o.length===0?delete t.c:o.length===1?t.c=o[0]:t.c=function(c,u,d){for(let f of o)if(f(c,u,d)==!1)return!1;return!0}}else throw new Error("Grammar: invalid condition: "+t.c)}return t}function sn(t){return typeof t=="string"&&t.startsWith("@")}function pe(t,e,n,r,s){let i=r[s];if(s==="a"&&Array.isArray(i)){if(i.length===0){r[s]=null;return}let o=i.map(l=>{if(sn(l)){let a=n.def.fnref[l];if(a==null)throw new Error(`Grammar: unknown ${t} function reference: `+l+` for rule ${n.name} (${e}) and alt ${r.s} (${r.g})`);return a}return l});r[s]=function(a,c,u){let d;for(let f of o)if(d=f(a,c,u),d&&d.isToken&&d.err)return d;return d};return}if(sn(i)){let o=n.def.fnref[i];if(o==null)throw new Error(`Grammar: unknown ${t} function reference: `+i+` for rule ${n.name} (${e}) and alt ${r.s} (${r.g})`);r[s]=o}}var on={$eq:1,$ne:1,$lt:1,$lte:1,$gt:1,$gte:1,$exist:1},ln={n:1,u:1,k:1,d:1,i:1,name:1,state:1,node:1,need:1,oN:1,cN:1,o:1,c:1,o0:1,o1:1,c0:1,c1:1,parent:1,child:1,prev:1,next:1,spec:1};function fn(t){let e=[];if(t==null||typeof t!="object")return e;if(t.c!=null&&typeof t.c=="object"&&typeof t.c!="function")for(let n of Object.keys(t.c)){let r=t.c[n];r!=null&&e.push(...dn(n,r))}if(t.g!=null){let n=typeof t.g=="string"?t.g.split(","):t.g;if(Array.isArray(n))for(let r of n)typeof r=="string"&&!Ot.test(r.trim())&&e.push('invalid group tag: "'+r+'"')}return e}function ts(t,e=""){let n=[],r=e?e+" ":"";if(!Array.isArray(t))return n;for(let s=0;s<t.length;s++)for(let i of fn(t[s]))n.push(r+"alt["+s+"]: "+i);return n}function dn(t,e){let n=[],r=t.split(".")[0];if(ln[r]!==1&&n.push('unknown condition path: "'+t+'" (no rule property "'+r+'"); known roots: '+Object.keys(ln).join(", ")),e!=null&&typeof e=="object")for(let s of Object.keys(e))on[s]!==1&&n.push("unknown condition operator: "+s+' (on "'+t+'"); known operators: '+Object.keys(on).join(", "));return n}function an(t,e,n){let r=e.split("."),s=r[0]==="n"&&r.length===2&&typeof n=="number",i=o=>{let l=(0,G.getpath)(o,r);return l==null&&s?0:l};if(t==="$eq")return function(l,a,c){return i(l)===n};if(t==="$ne")return function(l,a,c){return i(l)!=n};if(t==="$lt")return function(l,a,c){let u=i(l);return u==null||u<n};if(t==="$lte")return function(l,a,c){let u=i(l);return u==null||u<=n};if(t==="$gt")return function(l,a,c){let u=i(l);return u==null||u>n};if(t==="$gte")return function(l,a,c){let u=i(l);return u==null||u>=n};if(t==="$exist")return function(l,a,c){let u=(0,G.getpath)(l,r);return n===!0?u!=null:u==null};throw new Error("Grammer: unknown comparison operator: "+t)}});var hn=H(W=>{"use strict";Object.defineProperty(W,"__esModule",{value:!0});W.makeParser=W.makeRuleSpec=W.makeRule=W.Parser=void 0;var ns=ce(),rs=rn(),Y=ue(),we=Te(),nt=xe(),Ie=xt();Object.defineProperty(W,"makeRule",{enumerable:!0,get:function(){return Ie.makeRule}});Object.defineProperty(W,"makeRuleSpec",{enumerable:!0,get:function(){return Ie.makeRuleSpec}});var rt=class t{#e;#t;constructor(e,n,r){this.rsm={},this.options=e,this.cfg=n,this.ji=r}rule(e,n){if(e==null)return this.rsm;let r=this.rsm[e];if(n===null)delete this.rsm[e];else if(n!==void 0){r=this.rsm[e]=this.rsm[e]||(0,Ie.makeRuleSpec)(this.ji,this.cfg,{}),r.name=e,r=this.rsm[e]=n(this.rsm[e],this)||this.rsm[e];return}return r}start(e,n,r,s){let i,o=(0,nt.makeToken)("#ZZ",(0,Y.tokenize)("#ZZ",this.cfg),void 0,ns.EMPTY,(0,nt.makePoint)(-1)),l=(0,Y.tokenize)("#BD",this.cfg),a=(0,nt.makeNoToken)(),c=new rs.Context({opts:this.options,cfg:this.cfg,meta:r||{},src:()=>e,root:()=>i,plgn:()=>n.internal().plugins,inst:()=>n,sub:n.internal().sub,rsm:this.rsm,F:this.#t??=(0,Y.srcfmt)(this.cfg),NOTOKEN:a,NORULE:{}});s!=null&&(0,Y.deep)(c,s);let u=(0,Ie.makeRule)(this.#e??=(0,Ie.makeRuleSpec)(this.ji,this.cfg,{}),c);if(c.NORULE=u,c.rule=u,r&&Y.S.function===typeof r.log&&(c.log=r.log),this.cfg.parse.prepare.forEach(k=>k(n,c,r)),e===""){if(this.cfg.lex.empty)return this.cfg.lex.emptyResult;throw new we.TabnasError(Y.S.unexpected,{src:e},c.t0,u,c)}let d=(0,nt.makeLex)(c);c.lex=d;let f=this.rsm[this.cfg.rule.start];if(f==null)return;let h=(0,Ie.makeRule)(f,c);i=h;let m=0;for(let k in this.rsm)m++;let g=2*m*d.src.length*2*c.cfg.rule.maxmul,p=0;for(;u!==h&&p<g;)c.kI=p,c.rule=h,c.log&&c.log(Y.S.step,c.kI+":"),c.sub.rule&&c.sub.rule.map(k=>k(h,c)),h=h.process(c,d),c.log&&c.log(Y.S.stack,c,h,d),p++;let y=c.t[0];if(y!=null&&a.tin!==y.tin&&o.tin!==y.tin){if(l===y.tin){let k={};throw y.use!=null&&(k.use=y.use),new we.TabnasError(y.why||Y.S.unexpected,k,y,h,c)}throw new we.TabnasError(Y.S.unexpected,{},y,u,c)}let b=d.next(h);if(l===b.tin){let k={};throw b.use!=null&&(k.use=b.use),new we.TabnasError(b.why||Y.S.unexpected,k,b,h,c)}if(o.tin!==b.tin)throw new we.TabnasError(Y.S.unexpected,{},c.t0,u,c);let T=c.root().node;if(this.cfg.result.fail.includes(T))throw new we.TabnasError(Y.S.unexpected,{},c.t0,u,c);return T}clone(e,n,r){let s=new t(e,n,r);return s.rsm=Object.keys(this.rsm).reduce((i,o)=>(i[o]=(0,Y.filterRules)(this.rsm[o],this.cfg),i),{}),s.norm(),s}norm(){(0,Y.values)(this.rsm).map(e=>e.norm())}};W.Parser=rt;var ss=(...t)=>new rt(...t);W.makeParser=ss});var vn=H(it=>{"use strict";Object.defineProperty(it,"__esModule",{value:!0});it.mergeInstances=ds;it.deshareMatchTokens=yn;var is=It();function _e(t){if(t==null||typeof t!="object"||Array.isArray(t))return!1;let e=Object.getPrototypeOf(t);return e===null||e===Object.prototype}function ie(t,e){if(Object.is(t,e))return!0;if(t instanceof RegExp&&e instanceof RegExp)return t.source===e.source&&t.flags===e.flags;if(Array.isArray(t)&&Array.isArray(e))return t.length===e.length&&t.every((n,r)=>ie(n,e[r]));if(_e(t)&&_e(e)){let n=Object.keys(t),r=Object.keys(e);return n.length===r.length&&n.every(s=>ie(t[s],e[s]))}return!1}function kn(t,e,n,r){if(t===void 0)return e;if(e===void 0)return t;if(_e(t)&&_e(e)){let s={},i=Object.keys(e),o=[...Object.keys(t),...i.filter(l=>!(l in t))];for(let l of o){let a=kn(t[l],e[l],_e(n)?n[l]:void 0,[...r,l]);a!==void 0&&(s[l]=a)}return s}if(ie(t,e))return t;if(ie(t,n))return e;if(ie(e,n))return t;throw new Error("merge: conflicting option values at "+r.join("."))}function os(t){let e=t.fixed?.token;if(e==null)return;let n={};for(let r of Object.keys(e)){let s=e[r];if(n[s]!=null&&n[s]!==r)throw new Error("merge: fixed tokens "+n[s]+" and "+r+" both claim source "+JSON.stringify(s));n[s]=r}}function yn(t){let e=t.match?.token;if(e==null)return;let n={};for(let r of Object.keys(e)){let s=e[r];if(s instanceof RegExp){let i=new RegExp(s.source,s.flags);s.eager$&&(i.eager$=!0),n[r]=i}else if(typeof s=="function"){let i=(o,l,a)=>s(o,l,a);s.eager$&&(i.eager$=!0),n[r]=i}else n[r]=s}t.match.token=n}function ls(t){let e=t.lex?.match;if(e==null)return;let n=Object.keys(e).sort((s,i)=>{let o=e[s]?.order??0,l=e[i]?.order??0;return o!==l?o-l:s<i?-1:s>i?1:0}),r={};for(let s of n)r[s]=e[s];t.lex.match=r}function as(t,e){let n=r=>{let s=e.t[r];if(s==null)throw new Error("merge: unknown token tin: "+r);return s};return typeof t=="number"?n(t):Array.isArray(t)?t.map(r=>typeof r=="number"?n(r):r):t}function cs(t){return[t.c?1:0,t.e?1:0,t.h?1:0,t.b?1:0,t.n?Object.keys(t.n).length:0,t.a?1:0,t.u?1:0,t.k?1:0,t.p?1:0,t.r?1:0]}function mn(t,e,n){let s=(t.t||[]).map(o=>o.map(l=>e.t[l]).sort().join(" ")),i={...t};return delete i.t,delete i.S,delete i.sN,i.s=t.s&&t.s.length?t.s.map(o=>as(o,e)):null,i.g=[...t.g||[]],t.n&&(i.n={...t.n}),t.u&&(i.u={...t.u}),t.k&&(i.k={...t.k}),{alt:i,keys:s,complexity:cs(t),gkey:(t.g||[]).join(","),tag:n}}function us(t,e){let n=Math.min(t.keys.length,e.keys.length);for(let r=0;r<n;r++)if(t.keys[r]!==e.keys[r])return t.keys[r]<e.keys[r]?-1:1;if(t.keys.length!==e.keys.length)return e.keys.length-t.keys.length;for(let r=0;r<t.complexity.length;r++){let s=e.complexity[r]-t.complexity[r];if(s!==0)return s}return t.gkey!==e.gkey?t.gkey<e.gkey?-1:1:t.tag<e.tag?-1:t.tag>e.tag?1:0}function ge(t,e){return t===e?!0:typeof t=="function"&&typeof e=="function"&&t.toString()===e.toString()}function fs(t,e){return t.keys.length!==e.keys.length||!t.keys.every((n,r)=>n===e.keys[r])||t.gkey!==e.gkey||t.alt.c!==e.alt.c&&(t.alt.c||e.alt.c)?!1:ge(t.alt.a,e.alt.a)&&ge(t.alt.h,e.alt.h)&&ge(t.alt.e,e.alt.e)&&(t.alt.b===e.alt.b||ge(t.alt.b,e.alt.b))&&(t.alt.p===e.alt.p||ge(t.alt.p,e.alt.p))&&(t.alt.r===e.alt.r||ge(t.alt.r,e.alt.r))&&ie(t.alt.n,e.alt.n)&&ie(t.alt.u,e.alt.u)&&ie(t.alt.k,e.alt.k)}function pn(t,e){let n=e.filter(o=>!t.some(l=>fs(l,o))),r=[],s=0,i=0;for(;s<t.length&&i<n.length;)us(t[s],n[i])<=0?r.push(t[s++]):r.push(n[i++]);for(;s<t.length;)r.push(t[s++]);for(;i<n.length;)r.push(n[i++]);return r}function gn(t,e){let n=t.internal(),r=n.config,s=n.parser.rule(),i={};for(let o of Object.keys(s)){let l=s[o].def,a={};for(let c of Object.keys(l.fnref))c.includes("$")?a[c]=l.fnref[c]:a["@"+e+":"+c.substring(1)]=l.fnref[c];i[o]={fnref:a,bo:[...l.bo],ao:[...l.ao],bc:[...l.bc],ac:[...l.ac],open:l.open.map(c=>mn(c,r,e)),close:l.close.map(c=>mn(c,r,e))}}return i}function st(t,e){let n=[...t];for(let r of e)n.some(s=>ge(s,r))||n.push(r);return n}function bn(t){let e={...t};return e.s=Array.isArray(t.s)?[...t.s]:t.s,e.g=[...t.g||[]],t.n&&(e.n={...t.n}),t.u&&(e.u={...t.u}),t.k&&(e.k={...t.k}),e}function ds(t,e,n){let r=(C,M)=>{let x=C.internal().merged.tag;if(x==null||x===""||x==="-")throw new Error("merge: the "+M+" instance needs a tag option (used to prefix its named actions)");return String(x)},s=r(t,"first"),i=r(e,"second");if(s===i)throw new Error("merge: instance tags must differ, both are "+JSON.stringify(s));let[o,l]=s<i?[t,e]:[e,t],[a,c]=s<i?[s,i]:[i,s],u=C=>{let{tag:M,plugins:x,...B}=C;return B},d=kn(u(o.internal().merged),u(l.internal().merged),is.defaults,[]);d.tag=a+"~"+c,os(d),yn(d),ls(d);let f=gn(o,a),h=gn(l,c),m=[...Object.keys(f),...Object.keys(h).filter(C=>!(C in f))].sort(),g={fnref:{},bo:[],ao:[],bc:[],ac:[],open:[],close:[]},p={};for(let C of m){let M=f[C]||g,x=h[C]||g;p[C]={fnref:{...M.fnref,...x.fnref},bo:st(M.bo,x.bo),ao:st(M.ao,x.ao),bc:st(M.bc,x.bc),ac:st(M.ac,x.ac),open:pn(M.open,x.open),close:pn(M.close,x.close)}}let y=function(C){for(let M of m){let x=p[M];C.rule(M,B=>{Object.assign(B.def.fnref,x.fnref),B.def.bo.push(...x.bo),B.def.ao.push(...x.ao),B.def.bc.push(...x.bc),B.def.ac.push(...x.ac),0<x.open.length&&B.open(x.open.map($=>bn($.alt)),{append:!0}),0<x.close.length&&B.close(x.close.map($=>bn($.alt)),{append:!0})})}};Object.defineProperty(y,"name",{value:"merged"});let b=n(d);b.use(y);let T=b.internal().sub,k=o.internal().sub,A=l.internal().sub;for(let C of["lex","rule"]){let M=[...k[C]||[],...A[C]||[]];0<M.length&&(T[C]=[...T[C]||[],...M])}return b}});var En=H(w=>{"use strict";Object.defineProperty(w,"__esModule",{value:!0});w.validateAlts=w.validateAlt=w.makeToken=w.makeTextMatcher=w.makeStringMatcher=w.makeSpaceMatcher=w.makeRuleSpec=w.makeRule=w.makePoint=w.makeParser=w.makeNumberMatcher=w.makeLineMatcher=w.makeLex=w.makeFixedMatcher=w.makeCommentMatcher=w.util=w.S=w.SKIP=w.EMPTY=w.AFTER=w.BEFORE=w.CLOSE=w.OPEN=w.BUILTIN_SCHEMA_VERSION=w.BUILTIN_REFS=w.TabnasError=w.Tabnas=w.keyOrder=w.VERSION=void 0;var z=ce();Object.defineProperty(w,"OPEN",{enumerable:!0,get:function(){return z.OPEN}});Object.defineProperty(w,"CLOSE",{enumerable:!0,get:function(){return z.CLOSE}});Object.defineProperty(w,"BEFORE",{enumerable:!0,get:function(){return z.BEFORE}});Object.defineProperty(w,"AFTER",{enumerable:!0,get:function(){return z.AFTER}});Object.defineProperty(w,"EMPTY",{enumerable:!0,get:function(){return z.EMPTY}});Object.defineProperty(w,"SKIP",{enumerable:!0,get:function(){return z.SKIP}});var E=ue();Object.defineProperty(w,"keyOrder",{enumerable:!0,get:function(){return E.keyOrder}});Object.defineProperty(w,"S",{enumerable:!0,get:function(){return E.S}});var Pe=nn();Object.defineProperty(w,"BUILTIN_REFS",{enumerable:!0,get:function(){return Pe.BUILTIN_REFS}});Object.defineProperty(w,"BUILTIN_SCHEMA_VERSION",{enumerable:!0,get:function(){return Pe.BUILTIN_SCHEMA_VERSION}});var oe=Te();Object.defineProperty(w,"TabnasError",{enumerable:!0,get:function(){return oe.TabnasError}});var hs=It(),L=xe();Object.defineProperty(w,"makeCommentMatcher",{enumerable:!0,get:function(){return L.makeCommentMatcher}});Object.defineProperty(w,"makeFixedMatcher",{enumerable:!0,get:function(){return L.makeFixedMatcher}});Object.defineProperty(w,"makeLex",{enumerable:!0,get:function(){return L.makeLex}});Object.defineProperty(w,"makeLineMatcher",{enumerable:!0,get:function(){return L.makeLineMatcher}});Object.defineProperty(w,"makeNumberMatcher",{enumerable:!0,get:function(){return L.makeNumberMatcher}});Object.defineProperty(w,"makePoint",{enumerable:!0,get:function(){return L.makePoint}});Object.defineProperty(w,"makeSpaceMatcher",{enumerable:!0,get:function(){return L.makeSpaceMatcher}});Object.defineProperty(w,"makeStringMatcher",{enumerable:!0,get:function(){return L.makeStringMatcher}});Object.defineProperty(w,"makeTextMatcher",{enumerable:!0,get:function(){return L.makeTextMatcher}});Object.defineProperty(w,"makeToken",{enumerable:!0,get:function(){return L.makeToken}});var Ae=hn();Object.defineProperty(w,"makeParser",{enumerable:!0,get:function(){return Ae.makeParser}});Object.defineProperty(w,"makeRule",{enumerable:!0,get:function(){return Ae.makeRule}});Object.defineProperty(w,"makeRuleSpec",{enumerable:!0,get:function(){return Ae.makeRuleSpec}});var In=xt();Object.defineProperty(w,"validateAlt",{enumerable:!0,get:function(){return In.validateAlt}});Object.defineProperty(w,"validateAlts",{enumerable:!0,get:function(){return In.validateAlts}});var wn=vn(),Tt={keyOrder:E.keyOrder,recordKeyOrder:E.recordKeyOrder,KEY_ORDER:E.KEY_ORDER,badlex:E.badlex,charset:E.charset,clean:E.clean,clone:E.clone,configure:E.configure,deep:E.deep,entries:E.entries,errdesc:oe.errdesc,errinject:oe.errinject,errmsg:oe.errmsg,errsite:oe.errsite,escre:E.escre,keys:E.keys,makelog:E.makelog,mesc:E.mesc,omap:E.omap,parserwrap:E.parserwrap,prop:oe.prop,regexp:E.regexp,srcfmt:E.srcfmt,str:E.str,strinject:oe.strinject,tokenize:E.tokenize,trimstk:oe.trimstk,values:E.values,isMatcherToken:E.isMatcherToken,guardedMatcher:L.guardedMatcher,scan:L.scan,buildCharRunSpec:L.buildCharRunSpec,buildLineRunSpec:L.buildLineRunSpec,buildStringBodySpec:L.buildStringBodySpec,CONSUME:L.CONSUME,IS_ROW:L.IS_ROW,CI_RESET:L.CI_RESET,STOP:L.STOP,STATE_MASK:L.STATE_MASK};w.util=Tt;var Nt=class t{#e;static{this.util=Tt}static{this.S=E.S}static{this.OPEN=z.OPEN}static{this.CLOSE=z.CLOSE}static{this.BEFORE=z.BEFORE}static{this.AFTER=z.AFTER}static{this.EMPTY=z.EMPTY}static{this.SKIP=z.SKIP}constructor(e,n){let r=[],s={};if(e)if(Array.isArray(e.plugins)){r=e.plugins;let{plugins:a,...c}=e;s=c}else s=e;this.parent=n;let i={parser:void 0,config:void 0,plugins:[],sub:{lex:void 0,rule:void 0},mark:Math.random(),merged:void 0};this.#e=i;let o=(0,E.deep)({},n?{...n.#e.merged}:s.defaults$===!1?{}:hs.defaults,s||{});i.merged=o,this.id="Tabnas/"+Date.now()+"/"+(""+Math.random()).substring(2,8).padEnd(6,"0")+(o.tag==null?"":"/"+o.tag),this.token=(a=>i.config.fixed.token[a]??(0,E.tokenize)(a,i.config,this)),this.tokenSet=(a=>(0,E.findTokenSet)(a,i.config)),this.fixed=(a=>i.config.fixed.ref[a]);let l=(a=>this.#t(a));if((0,E.deep)(l,i.merged),(0,E.defprop)(this,"options",{value:l,writable:!0,enumerable:!0,configurable:!0}),n){let a=n.#e;i.config=(0,E.configure)(this,void 0,o),(0,E.assign)(this.token,i.config.t);for(let f of Object.keys(n))this[f]===void 0&&(this[f]=n[f]);i.parser=(0,Ae.makeParser)(o,i.config,this);let c=a.plugins;i.plugins=[];for(let f of c)this.use(f);let u=i.parser.rule(),d={};for(let f of Object.keys(u))d[f]=(0,E.filterRules)(u[f],i.config);i.parser.rsm=d,i.parser.norm()}else i.config=(0,E.configure)(this,void 0,o),i.parser=(0,Ae.makeParser)(o,i.config,this),(0,E.assign)(this.token,i.config.t);for(let a of r)this.use(a)}#t(e){return e!=null&&((0,E.deep)(this.#e.merged,e),(0,E.configure)(this,this.#e.config,this.#e.merged),this.#e.parser=this.#e.parser.clone(this.#e.merged,this.#e.config,this),(0,E.deep)(this.options,this.#e.merged)),{...this.#e.merged}}parse(e,n,r){if(E.S.string===typeof e){let s=this.#e.parser,i=this.#e.merged.parser;return(i?.start?(0,E.parserwrap)(i):s).start(e,this,n,r)}return e}config(){return(0,E.deep)(this.#e.config)}use(e,n){if(E.S.function!==typeof e)throw new Error("Tabnas.use: the first argument must be a function defining a plugin.");let r=e.name.toLowerCase(),s=(0,E.deep)({},e.defaults||{},n||{});this.options({plugin:{[r]:s}});let i=this.#e.merged.plugin[r];return this.#e.plugins.push(e),e.options=i,e(this,i)||this}rule(e,n){let r=this.#e.parser.rule(e,n);return r===void 0?this:r}make(e){return new t(e,this)}merge(e){return(0,wn.mergeInstances)(this,e,n=>new t(n))}empty(e){return new t({defaults$:!1,standard$:!1,grammar$:!1,...e||{}})}toString(){return this.id}sub(e){return e.lex&&(this.#e.sub.lex=this.#e.sub.lex||[],this.#e.sub.lex.push(e.lex)),e.rule&&(this.#e.sub.rule=this.#e.sub.rule||[],this.#e.sub.rule.push(e.rule)),this}internal(){return this.#e}grammar(e,n){e=(0,E.deep)({},e),e.options&&(0,wn.deshareMatchTokens)(e.options);let r=n?.rule?.alt?.g,s=r==null?null:Array.isArray(r)?[...r]:String(r).split(/\s*,\s*/).filter(l=>l.length>0),i=l=>s==null||s.length===0||!Array.isArray(l)?l:l.map(a=>{if(a==null||E.S.object!==typeof a)return a;let c=a.g==null?[]:Array.isArray(a.g)?[...a.g]:String(a.g).split(/\s*,\s*/).filter(u=>u.length>0);return{...a,g:[...c,...s]}});if(e.v!=null){if(typeof e.v!="number"||!Number.isInteger(e.v)||e.v<1)throw new Error(`Grammar: invalid builtin schema version: ${e.v} (expected a positive integer)`);if(e.v>Pe.BUILTIN_SCHEMA_VERSION)throw new Error(`Grammar: requires builtin schema version ${e.v}, but this engine supports up to ${Pe.BUILTIN_SCHEMA_VERSION}`)}if(e.ref){for(let l of Object.keys(e.ref))if(l.includes("$"))throw new Error(`Grammar: '$' is reserved for engine builtins; user ref key '${l}' may not contain '$'`)}let o=Object.assign(Object.create(null),Pe.BUILTIN_REFS,e.ref||{});if(e.clear===!0){let l=this.#e.parser.rule();for(let u of(0,E.keys)(l))this.rule(u,null);let a=this.#e.config.fixed.token,c={};for(let u of(0,E.keys)(a)){let d=this.token(a[u]);d!=null&&(c[d]=null)}0<(0,E.keys)(c).length&&this.options({fixed:{token:c}})}if(e.options){let l=(0,E.resolveFuncRefs)(e.options,o);this.options(l)}if(e.rule)for(let l of Object.keys(e.rule)){let a=e.rule[l];if(a===null){this.rule(l,null);continue}this.rule(l,c=>{if(c.fnref(o),a.open){let u=Array.isArray(a.open),d=u?a.open:a.open.alts,f=u?{}:a.open.inject;c.open(i(d),f)}if(a.close){let u=Array.isArray(a.close),d=u?a.close:a.close.alts,f=u?{}:a.close.inject;c.close(i(d),f)}})}return this}get util(){return Tt}};w.Tabnas=Nt;var ms="0.8.4";w.VERSION=ms});var _n=H(K=>{"use strict";Object.defineProperty(K,"__esModule",{value:!0});K.Chess=K.ANNOTATION_NAG=K.VERSION=void 0;K.stripCommands=Ss;K.parseSan=Os;K.parse=Cn;K.parseGame=As;var ps=En(),gs=`
{
  "rule": {
    "pgn": {
      "open": [
        {
          "s": "#ZZ",
          "g": "pgn,empty"
        },
        {
          "s": "#HEAD",
          "p": "gameitem",
          "b": 1,
          "g": "pgn,game"
        }
      ],
      "close": [
        {
          "s": "#ZZ",
          "g": "pgn,end"
        }
      ]
    },
    "gameitem": {
      "open": [
        {
          "s": "#HEAD",
          "p": "game",
          "b": 1,
          "g": "game,item"
        }
      ],
      "close": [
        {
          "s": "#HEAD",
          "r": "gameitem",
          "b": 1,
          "g": "game,next"
        },
        {
          "s": "#ZZ",
          "g": "game,end"
        }
      ]
    },
    "game": {
      "open": [
        {
          "s": "#OS",
          "p": "tag",
          "b": 1,
          "g": "game,tag"
        },
        {
          "s": "#ELEM",
          "p": "movetext",
          "b": 1,
          "g": "game,movetext"
        },
        {
          "s": "#RES",
          "a": "@result-open",
          "g": "game,result"
        }
      ],
      "close": [
        {
          "s": "#OS",
          "p": "tag",
          "b": 1,
          "c": "@more-tags",
          "g": "game,tag"
        },
        {
          "s": "#ELEM",
          "p": "movetext",
          "b": 1,
          "c": "@no-result",
          "g": "game,movetext"
        },
        {
          "s": "#RES",
          "a": "@result-close",
          "g": "game,result"
        },
        {
          "s": "#ZZ",
          "g": "game,end"
        },
        {
          "b": 1,
          "g": "game,more"
        }
      ]
    },
    "tag": {
      "open": [
        {
          "s": "#OS",
          "p": "tagbody",
          "g": "tag,open"
        }
      ],
      "close": [
        {
          "s": "#CS",
          "g": "tag,close"
        }
      ]
    },
    "tagbody": {
      "open": [
        {
          "s": "#TGN #ST",
          "a": "@tag",
          "g": "tag,pair"
        }
      ],
      "close": [
        {
          "s": "#CS",
          "b": 1,
          "g": "tag,end"
        }
      ]
    },
    "movetext": {
      "open": [
        {
          "s": "#ELEM",
          "p": "element",
          "b": 1,
          "g": "movetext,elem"
        }
      ],
      "close": [
        {
          "s": "#EEND",
          "b": 1,
          "g": "movetext,end"
        },
        {
          "s": "#ZZ",
          "g": "movetext,end"
        },
        {
          "b": 1,
          "g": "movetext,more"
        }
      ]
    },
    "element": {
      "open": [
        {
          "s": "#SAN",
          "a": "@move",
          "g": "elem,move"
        },
        {
          "s": "#MVN",
          "a": "@number",
          "g": "elem,number"
        },
        {
          "s": "#NAG",
          "a": "@nag",
          "g": "elem,nag"
        },
        {
          "s": "#CMT",
          "a": "@brace-comment",
          "g": "elem,comment"
        },
        {
          "s": "#RMK",
          "a": "@line-comment",
          "g": "elem,comment"
        },
        {
          "s": "#OP",
          "p": "rav",
          "b": 1,
          "u": {
            "rav": true
          },
          "g": "elem,rav"
        }
      ],
      "close": [
        {
          "s": "#ELEM",
          "r": "element",
          "b": 1,
          "g": "elem,next"
        },
        {
          "s": "#EEND",
          "b": 1,
          "g": "elem,end"
        },
        {
          "s": "#ZZ",
          "g": "elem,end"
        },
        {
          "b": 1,
          "g": "elem,more"
        }
      ]
    },
    "rav": {
      "open": [
        {
          "s": "#OP",
          "p": "movetext",
          "g": "rav,open"
        }
      ],
      "close": [
        {
          "s": "#CP",
          "g": "rav,close"
        }
      ]
    },
    "move": {
      "open": [
        {
          "s": "#SAN",
          "a": "@bare-move",
          "g": "move,san"
        }
      ],
      "close": [
        {
          "s": "#ZZ",
          "g": "move,end"
        },
        {
          "b": 1,
          "g": "move,more"
        }
      ]
    }
  }
}`;K.VERSION="0.1.3";var bs="(?![A-Za-z0-9_+#=:-])";function xn(t){let e=t?"O-O-O|O-O":"O-O-O|O-O|0-0-0|0-0",n=t?"[KQRBN]":"[KQRBNP]",r=t?"=":"=?",s=t?"[+#]":"\\+\\+|[+#]",i=t?"":"(?<annotation>!!|\\?\\?|!\\?|\\?!|!|\\?)?";return new RegExp(`^(?:(?<castle>${e})|(?<piece>${n})(?<dfile>[a-h])?(?<drank>[1-8])?(?<pcapture>x)?(?<pto>[a-h][1-8])|(?<pfile>[a-h])(?:x(?<pxfile>[a-h]))?(?<prank>[1-8])(?:${r}(?<promotion>[QRBN]))?)(?<check>${s})?`+i+bs)}var ks=/^[1-9]\d{0,8}(?:[ \t]*\.+|(?![A-Za-z0-9_+#=:/-]))/,ys=/^\$\d{1,9}/,vs=/^\$(?:25[0-5]|2[0-4]\d|1\d\d|\d\d?)(?!\d)/,ws=/^(?:(?:1-0|0-1|1\/2-1\/2)(?![A-Za-z0-9_+#=:/-])|\*)/,Is=/^[A-Za-z0-9_]+/,Mt=/\[%([A-Za-z_][A-Za-z0-9_]*)/g,Es=/(?:!!|\?\?|!\?|\?!|!|\?)$/;K.ANNOTATION_NAG={"!":1,"?":2,"!!":3,"??":4,"!?":5,"?!":6};function Tn(t){let e=[],n=[];Mt.lastIndex=0;let r;for(;(r=Mt.exec(t))!=null;){let s=r.index,i=r.index+r[0].length,o=[];if(t[i]===" "||t[i]==="	"){for(;t[i]===" "||t[i]==="	";)i++;for(;;){if(t[i]==='"'){let l=t.indexOf('"',i+1);if(0>l)break;for(o.push(t.slice(i+1,l)),i=l+1;t[i]===" "||t[i]==="	";)i++}else{let l=i;for(;l<t.length&&t[l]!==","&&t[l]!=="]";)l++;let a=t.slice(i,l).trim();a!==""&&o.push(a),i=l}if(t[i]===","){for(i++;t[i]===" "||t[i]==="	";)i++;continue}break}}t[i]==="]"&&(i++,e.push({name:r[1],args:o}),n.push([s,i]),Mt.lastIndex=i)}return{commands:e,spans:n}}function Ss(t){let{spans:e}=Tn(t),n="",r=0;for(let[s,i]of e)n+=t.slice(r,s)+" ",r=i;return n+=t.slice(r),n.replace(/[ \t]+/g," ").trim()}function Os(t,e){let r=xn(e?.strict===!0).exec(t);if(!(r==null||r[0].length!==t.length))return Nn(r)}function Nn(t){let e=t.groups,n={san:t[0].replace(Es,"")};return e.castle!=null?(n.piece="K",n.castle=3<e.castle.length?"queen":"king"):e.piece!=null?(n.piece=e.piece,(e.dfile!=null||e.drank!=null)&&(n.disambiguation={},e.dfile!=null&&(n.disambiguation.file=e.dfile),e.drank!=null&&(n.disambiguation.rank=+e.drank)),e.pcapture!=null&&(n.capture=!0),n.to=e.pto):(n.piece="P",e.pxfile!=null?(n.disambiguation={file:e.pfile},n.capture=!0,n.to=e.pxfile+e.prank):n.to=e.pfile+e.prank,e.promotion!=null&&(n.promotion=e.promotion)),e.check!=null&&(n.check=e.check==="#"?"#":"+"),e.annotation!=null&&(n.annotation=e.annotation),n}function xs(){return function(e){let n=e.pnt;if(e.src[n.sI]!=="{")return;let r=e.src.indexOf("}",n.sI+1);if(r===-1)return e.bad("unterminated_comment",n.sI,e.src.length);let s=e.src.substring(n.sI,r+1),i=e.token("#CMT",s.substring(1,s.length-1),s,n);return At(n,s),i}}function Ts(){return function(e){let n=e.pnt;if(e.src[n.sI]!==";")return;let r=Mn(e.src,n.sI),s=e.token("#RMK",r.substring(1),r,n);return At(n,r),s}}function Ns(){return function(e){let n=e.pnt;if(n.cI!==1||e.src[n.sI]!=="%")return;let r=Mn(e.src,n.sI),s=e.token("#CM",void 0,r,n);return At(n,r),s}}function Mn(t,e){let n=e;for(;n<t.length&&t[n]!==`
`&&t[n]!=="\r";)n++;return t.substring(e,n)}function At(t,e){let n=-1;for(let r=0;r<e.length;r++)e[r]===`
`&&(t.rI++,n=r);t.sI+=e.length,t.cI=n===-1?t.cI+e.length:e.length-n}var Pt=Symbol.for("@tabnas/chess:count");function Ct(t){let e=t[Pt];return e==null&&(e=Ms(t),Object.defineProperty(t,Pt,{value:e,writable:!0})),e}function Ms(t){let e=t.tags?.FEN,n={number:1,side:"w"};if(typeof e=="string"){let r=e.trim().split(/\s+/);if(r[1]==="b"&&(n.side="b"),r[5]!=null&&/^\d+$/.test(r[5])){let s=parseInt(r[5],10);0<s&&(n.number=s)}}return n}function Re(t){return t.node}function _t(t,e,n){let r=Re(t),s=0<r.moves.length?r.moves[r.moves.length-1]:r;(s[e]=s[e]||[]).push(n)}function Sn(t,e,n){let r={kind:t,text:e};if(n){let{commands:s}=Tn(e);0<s.length&&(r.commands=s)}return r}function Cs(t,e){return{"@pgn-bo":n=>{n.node=[]},"@gameitem-bc":n=>{n.child.node!=null&&n.node.push(n.child.node)},"@game-bo":n=>{n.node={tags:Object.create(null),moves:[]}},"@movetext-bo":n=>{n.node==null&&(n.node={moves:[]})},"@tag":n=>{let r=n.node,s=n.o0.src;Object.prototype.hasOwnProperty.call(r.tags,s)||(r.tags[s]=n.o1.val)},"@result-open":n=>{n.node.result=n.o0.src},"@result-close":n=>{n.node.result=n.c0.src},"@more-tags":n=>{let r=n.node;return r.moves.length===0&&r.result==null},"@no-result":n=>n.node.result==null,"@move":(n,r)=>{let s=Re(n),i=Ct(s),o=On(t,n.o0,r);o.number=i.number,o.side=i.side,i.side==="w"?i.side="b":(i.side="w",i.number++),s.moves.push(o)},"@bare-move":(n,r)=>{n.node=On(t,n.o0,r)},"@number":n=>{let r=Ct(Re(n)),s=n.o0.src;r.number=parseInt(s,10);let i=s.length-s.replace(/\./g,"").length;i===1?r.side="w":1<i&&(r.side="b")},"@nag":n=>{_t(n,"nags",parseInt(n.o0.src.substring(1),10))},"@brace-comment":n=>{_t(n,"comments",Sn("brace",n.o0.val,e))},"@line-comment":n=>{_t(n,"comments",Sn("line",n.o0.val,e))},"@rav-bo":n=>{let r=Re(n.parent),s=r.moves[r.moves.length-1],i={moves:[]},o=s==null?{...Ct(r)}:{number:s.number,side:s.side};Object.defineProperty(i,Pt,{value:o,writable:!0}),n.node=i},"@element-bc":n=>{if(n.u.rav!==!0)return;let r=Re(n),s=r.moves[r.moves.length-1]||r;(s.variations=s.variations||[]).push(n.child.node)}}}function On(t,e,n){let r=t.exec(e.src);if(r==null)throw n.tabnas.error("unexpected",{src:e.src});return Nn(r)}var _s=function(e,n){let r=n?.strict===!0,s=n?.commands!==!1,i=n?.start||"pgn",o=xn(r);e.options({fixed:{token:{"#OB":null,"#CB":null,"#CL":null,"#CA":null,"#OS":"[","#CS":"]","#OP":"(","#CP":")"}},match:{token:{"#RES":ws,"#SAN":o,"#MVN":ks,"#NAG":r?vs:ys,"#TGN":Is}},lex:{match:{pgnComment:{order:12e5,make:xs},pgnRemark:{order:13e5,make:Ts},pgnEscape:{order:15e5,make:Ns}},emptyResult:[]},tokenSet:{ELEM:["#SAN","#MVN","#NAG","#CMT","#RMK","#OP"],HEAD:["#OS","#SAN","#MVN","#NAG","#CMT","#RMK","#OP","#RES"],EEND:["#RES","#OS","#CP"]},text:{lex:!1},number:{lex:!1},comment:{lex:!1},string:{chars:'"',multiChars:"",escapeStrict:!0,escape:{n:null,t:null,r:null,b:null,f:null,v:null,0:null},allowUnknown:!0},error:{unexpected:"not chess notation: {src}",unterminated_comment:"this comment is never closed",unterminated_string:"this tag value has no closing quote",unprintable:"a tag value cannot contain a line break"},hint:{unexpected:`
Chess notation is a sequence of move numbers, moves, comments,
variations, glyphs and a result. Check for a stray character, or for
something that looks like a move but is not one — Ke9 names no square,
Nx names no destination. If the notation simply stops here, look instead
for a variation "(" or a tag "[" that was never closed.`,unterminated_comment:`
A brace comment runs from the opening brace to the next closing brace
(PGN spec 5). To put a comment on the rest of a line, start it with a
semicolon instead.`,unterminated_string:`
A tag value is a double-quoted string that ends on the line it starts on
(PGN spec 8.1).`,unprintable:`
A tag value is a double-quoted string on a single line (PGN spec 8.1).
The tag pair is probably missing its closing quote, so the value ran on
into the next line.`},rule:{start:i}});let l=JSON.parse(gs);l.ref=Cs(o,s),e.grammar(l,{rule:{alt:{g:"chess"}}})};K.Chess=_s;K.Chess.defaults={strict:!1,commands:!0,start:"pgn"};function Ps(){let t=globalThis.process;return t?.env?.NO_COLOR!=null&&t.env.NO_COLOR!==""?{active:!1}:{active:t?.stdout?.isTTY===!0}}function Cn(t,e){return new ps.Tabnas({color:Ps()}).use(K.Chess,{...e,start:"pgn"}).parse(t)}function As(t,e){return Cn(t,e)[0]}K.default=K.Chess});var Zs={};zn(Zs,{ChessViewElement:()=>Le,applyMove:()=>je,attacked:()=>X,boardSvg:()=>ot,boardText:()=>lt,define:()=>jt,index:()=>at,legalMoves:()=>$t,parseFen:()=>$e,resolve:()=>ct,square:()=>jn,startPosition:()=>Ee});var ut=Vn(_n());var Rs={k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟"},Pn="abcdefgh";function $s(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ot(t){let{position:e,flipped:n}=t,r=[],s=12,i=2,o=[];for(let l=0;l<8;l++)for(let a=0;a<8;a++){let c=n?(7-l<<4)+(7-a):(l<<4)+a,u=i+a*s,d=i+l*s,f=(l+a&1)===1;r.push(`<rect class="sq ${f?"dark":"light"}" x="${u}" y="${d}" width="${s}" height="${s}"/>`);let h=c===t.check?"check":c===t.to?"to":c===t.from?"from":"";h&&r.push(`<rect class="hl ${h}" x="${u}" y="${d}" width="${s}" height="${s}"/>`);let m=e.board[c];if(m!=null){let g=m[0]==="w"?"white":"black";o.push(`<text class="pc ${g}" x="${u+s/2}" y="${d+s/2}">`+Rs[m[1]]+"</text>")}}for(let l=0;l<8;l++){let a=n?Pn[7-l]:Pn[l],c=n?l+1:8-l;r.push(`<text class="co file" x="${i+l*s+s/2}" y="${i+8*s+1.4}">${a}</text>`,`<text class="co rank" x="${i-.7}" y="${i+l*s+s/2}">${c}</text>`)}return`<svg class="board" viewBox="0 0 ${i*2+8*s} ${i*2+8*s+1}" role="img" aria-label="chess position">`+r.join("")+o.join("")+"</svg>"}function lt(t){let e=[];for(let n=0;n<8;n++){let r=[];for(let s=0;s<8;s++){let i=t.board[(n<<4)+s];r.push(i==null?".":i[0]==="w"?i[1].toUpperCase():i[1])}e.push($s(r.join(" ")))}return e.join(`
`)}var Rt="abcdefgh",Rn={n:[-33,-31,-18,-14,14,18,31,33],b:[-17,-15,15,17],r:[-16,-1,1,16],q:[-17,-16,-15,-1,1,15,16,17],k:[-17,-16,-15,-1,1,15,16,17]},$n={b:!0,r:!0,q:!0};function jn(t){return Rt[t&15]+String(8-(t>>4))}function at(t){let e=Rt.indexOf(t[0]),n=8-Number(t[1]);return 0>e||0>n||7<n?-1:(n<<4)+e}function le(t){return(t&136)===0}function Ee(){return $e("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")}function $e(t){let e=t.trim().split(/\s+/),n=new Array(128).fill(null),r=0;for(let s of e[0]||"")if(s==="/")r=r+16&-16;else if(/[1-8]/.test(s))r+=Number(s);else{let i=s.toLowerCase();if(!"pnbrqk".includes(i))throw new Error("bad FEN piece: "+s);if(!le(r))throw new Error("FEN board overflows");n[r]=(s===i?"b":"w")+i,r++}return{board:n,turn:e[1]==="b"?"b":"w",castling:e[2]&&e[2]!=="-"?e[2]:"",ep:e[3]&&e[3]!=="-"?at(e[3]):-1,halfmove:Number(e[4])||0,fullmove:Number(e[5])||1}}function js(t){return{...t,board:t.board.slice()}}function Ls(t,e){for(let n=0;n<128;n++)if(le(n)&&t.board[n]===e+"k")return n;return-1}function X(t,e,n){for(let r=0;r<128;r++){if(!le(r))continue;let s=t.board[r];if(s==null||s[0]!==n)continue;let i=s[1];if(i==="p"){let o=n==="w"?-16:16;if(r+o-1===e||r+o+1===e)return!0;continue}for(let o of Rn[i]){let l=r+o;for(;le(l);){if(l===e)return!0;if(t.board[l]!=null||!$n[i])break;l+=o}}}return!1}function An(t,e,n,r,s){let i=r>>4,o=e.turn==="w"?0:7,l={from:n,to:r,piece:"p",colour:e.turn,...s};if(i===o)for(let a of["q","r","b","n"])t.push({...l,promotion:a});else t.push(l)}function $t(t){let e=[],n=t.turn,r=n==="w"?"b":"w";for(let o=0;o<128;o++){if(!le(o))continue;let l=t.board[o];if(l==null||l[0]!==n)continue;let a=l[1];if(a==="p"){let c=n==="w"?-16:16,u=n==="w"?6:1,d=o+c;if(le(d)&&t.board[d]==null){An(e,t,o,d,{});let f=o+c+c;o>>4===u&&t.board[f]==null&&e.push({from:o,to:f,piece:"p",colour:n})}for(let f of[-1,1]){let h=o+c+f;if(!le(h))continue;let m=t.board[h];m!=null&&m[0]===r?An(e,t,o,h,{capture:m[1]}):h===t.ep&&e.push({from:o,to:h,piece:"p",colour:n,capture:"p",epCapture:h-c})}continue}for(let c of Rn[a]){let u=o+c;for(;le(u);){let d=t.board[u];if(d==null)e.push({from:o,to:u,piece:a,colour:n});else{d[0]===r&&e.push({from:o,to:u,piece:a,colour:n,capture:d[1]});break}if(!$n[a])break;u+=c}}}let s=n==="w"?112:0,i=n==="w"?"KQ":"kq";return t.board[s+4]===n+"k"&&!X(t,s+4,r)&&(t.castling.includes(i[0])&&t.board[s+7]===n+"r"&&t.board[s+5]==null&&t.board[s+6]==null&&!X(t,s+5,r)&&!X(t,s+6,r)&&e.push({from:s+4,to:s+6,piece:"k",colour:n,castle:"k"}),t.castling.includes(i[1])&&t.board[s]===n+"r"&&t.board[s+1]==null&&t.board[s+2]==null&&t.board[s+3]==null&&!X(t,s+3,r)&&!X(t,s+2,r)&&e.push({from:s+4,to:s+2,piece:"k",colour:n,castle:"q"})),e.filter(o=>{let l=je(t,o),a=Ls(l,n);return a===-1||!X(l,a,r)})}function je(t,e){let n=js(t),r=n.board[e.from];if(n.board[e.from]=null,n.board[e.to]=e.promotion?e.colour+e.promotion:r,e.epCapture!=null&&(n.board[e.epCapture]=null),e.castle){let o=e.colour==="w"?112:0;e.castle==="k"?(n.board[o+5]=n.board[o+7],n.board[o+7]=null):(n.board[o+3]=n.board[o],n.board[o]=null)}n.ep=e.piece==="p"&&Math.abs(e.to-e.from)===32?(e.from+e.to)/2:-1;let s=n.castling,i=o=>{for(let l of o)s=s.replace(l,"")};return e.piece==="k"&&i(e.colour==="w"?"KQ":"kq"),(e.from===119||e.to===119)&&i("K"),(e.from===112||e.to===112)&&i("Q"),(e.from===7||e.to===7)&&i("k"),(e.from===0||e.to===0)&&i("q"),n.castling=s,n.halfmove=e.piece==="p"||e.capture!=null?0:n.halfmove+1,e.colour==="b"&&n.fullmove++,n.turn=e.colour==="w"?"b":"w",n}function ct(t,e){let n=e.piece.toLowerCase(),r=e.to?at(e.to):-1,s=$t(t).filter(i=>{if(e.castle)return i.castle===(e.castle==="queen"?"q":"k");if(i.castle||i.piece!==n||i.to!==r)return!1;if(e.promotion){if(i.promotion!==e.promotion.toLowerCase())return!1}else if(i.promotion)return!1;let o=e.disambiguation;return!(o&&(o.file&&Rt[i.from&15]!==o.file||o.rank&&8-(i.from>>4)!==o.rank))});return s.length===1?s[0]:void 0}var Ln=`
:host {
  --board-light: #f0d9b5;
  --board-dark: #b58863;
  --board-from: #f7d64b;
  --board-to: #f7d64b;
  --board-check: #d64435;
  --piece-light: #fffef8;
  --piece-dark: #2b2724;
  --piece-edge: #2b2724;

  --fg: #1c1a18;
  --muted: #6b6560;
  --bg: #fbfaf8;
  --panel: #ffffff;
  --line: #e2ddd6;
  --accent: #2f6f4e;
  --accent-fg: #ffffff;
  --bad: #a3251b;

  --size: 24rem;
  --radius: 6px;
  --font: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  --glyphs: "Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols 2",
            "DejaVu Sans", "Free Serif", sans-serif;

  display: block;
  color: var(--fg);
  font-family: var(--font);
  font-size: 0.9rem;
  line-height: 1.5;
  contain: content;
}

@media (prefers-color-scheme: dark) {
  :host([theme="auto"]), :host(:not([theme])) {
    --board-light: #b8b0a4;
    --board-dark: #6f6459;
    --piece-light: #f6f3ee;
    --piece-dark: #1a1715;
    --piece-edge: #100e0d;
    --fg: #eae6e0;
    --muted: #a29a92;
    --bg: #1a1917;
    --panel: #232120;
    --line: #3a3734;
    --accent: #5fae86;
    --accent-fg: #10201a;
    --bad: #e88b80;
  }
}
:host([theme="dark"]) {
  --board-light: #b8b0a4;
  --board-dark: #6f6459;
  --piece-light: #f6f3ee;
  --piece-dark: #1a1715;
  --piece-edge: #100e0d;
  --fg: #eae6e0;
  --muted: #a29a92;
  --bg: #1a1917;
  --panel: #232120;
  --line: #3a3734;
  --accent: #5fae86;
  --accent-fg: #10201a;
  --bad: #e88b80;
}

:host(:focus-visible) { outline: 2px solid var(--accent); outline-offset: 3px; }
:host([hidden]) { display: none; }

.wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0.85rem;
  box-sizing: border-box;
}

.boardpane { flex: 0 0 auto; width: var(--size); max-width: 100%; }
.boardbox { width: 100%; }

svg.board { display: block; width: 100%; height: auto; }
.sq.light { fill: var(--board-light); }
.sq.dark  { fill: var(--board-dark); }

/* Layered over the square, so a light square keeps its own colour under
   the mark rather than being replaced by a translucent one. */
.hl { pointer-events: none; }
.hl.from  { fill: var(--board-from); opacity: 0.42; }
.hl.to    { fill: var(--board-to); opacity: 0.62; }
.hl.check { fill: var(--board-check); opacity: 0.55; }

/* One glyph shape per piece, painted light or dark: the hollow "white"
   glyphs vary too much between fonts to sit beside the solid ones. */
.pc {
  font-family: var(--glyphs);
  font-size: 9.6px;
  text-anchor: middle;
  dominant-baseline: central;
  paint-order: stroke fill;
  stroke: var(--piece-edge);
  stroke-width: 0.35px;
  stroke-linejoin: round;
  pointer-events: none;
}
.pc.white { fill: var(--piece-light); }
.pc.black { fill: var(--piece-dark); }

.co {
  font-family: var(--font);
  font-size: 1.5px;
  fill: var(--muted);
  dominant-baseline: central;
}
.co.file { text-anchor: middle; }
.co.rank { text-anchor: end; }

.bar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
}
.bar button {
  font: inherit;
  line-height: 1;
  padding: 0.35rem 0.55rem;
  color: var(--fg);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  cursor: pointer;
}
.bar button:hover { border-color: var(--accent); }
.bar button:active { transform: translateY(1px); }
.bar button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.ply {
  margin-left: auto;
  color: var(--muted);
  font-family: var(--mono);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.side {
  flex: 1 1 14rem;
  min-width: 12rem;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.players { font-weight: 600; }
.meta { color: var(--muted); font-size: 0.82rem; }
.tags:empty { display: none; }

.moves {
  /* Hug the notation rather than stretch to the board's height: a short
     game beside a tall empty box looks broken. Long games still cap and
     scroll at max-height. */
  flex: 0 1 auto;
  max-height: var(--size);
  overflow-y: auto;
  padding: 0.5rem 0.6rem;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-family: var(--mono);
  font-size: 0.82rem;
  line-height: 1.9;
  overscroll-behavior: contain;
}
.moves:focus-visible { outline: 2px solid var(--accent); outline-offset: -1px; }

.no { color: var(--muted); }
.mv {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  border-radius: 3px;
  padding: 0.05rem 0.25rem;
  cursor: pointer;
}
.mv:hover { background: var(--line); }
.mv.on { background: var(--accent); color: var(--accent-fg); }
.mv.bad { color: var(--bad); text-decoration: underline wavy; }
.mv:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }

.cm { color: var(--muted); font-family: var(--font); font-style: italic; }
.nag { color: var(--accent); }
.var { color: var(--muted); }
.var .mv { font-size: 0.95em; }
.res { font-weight: 600; }

/* A full-width row under both panes: the status is about the component,
   so it stays put when the notation is switched off. */
.note { flex: 1 1 100%; min-width: 0; color: var(--muted); font-size: 0.8rem; }
.note:empty { display: none; }
.note.bad { color: var(--bad); }

/* A command the supplement gives a meaning to — a clock, an evaluation —
   shown as its own chip rather than left as markup in the prose. */
.cmd {
  font-family: var(--mono);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--muted);
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.05rem 0.4rem;
  margin: 0 0.15rem;
  white-space: nowrap;
}

.comment {
  padding: 0.5rem 0.6rem;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-size: 0.85rem;
}
.comment:empty { display: none; }
.comment p { margin: 0.35rem 0 0; }
.comment p:first-child { margin-top: 0; }
.comment .who {
  font-family: var(--mono);
  font-weight: 600;
  margin-right: 0.35rem;
}

.srcpane { flex: 1 1 100%; min-width: 0; }
.srcpane textarea {
  display: block;
  width: 100%;
  min-height: 6rem;
  box-sizing: border-box;
  resize: vertical;
  padding: 0.5rem 0.6rem;
  background: var(--panel);
  color: var(--fg);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-family: var(--mono);
  font-size: 0.8rem;
  line-height: 1.6;
  tab-size: 2;
}
.srcpane textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: -1px; }
.srcpane textarea:read-only { color: var(--muted); resize: none; }

/* The switches. Each hides a part of the UI without the component having
   to know it is hidden — the layout is flex, so a removed pane simply
   stops taking space. */
:host(:not([source="view"]):not([source="edit"])) .srcpane { display: none; }
:host([controls="hidden"]) .bar { display: none; }
:host([notation="hidden"]) .side { display: none; }
:host([tags="hidden"]) .tags { display: none; }
:host([coordinates="hidden"]) .co { display: none; }

/* With the notation gone the board is the whole component, so let it have
   the width rather than sitting in a column of its own. */
:host([notation="hidden"]) .boardpane { flex: 1 1 auto; }

@media (max-width: 30rem) {
  .wrap { gap: 0.75rem; }
  .boardpane { width: 100%; }
  .moves { max-height: 12rem; }
}
`;var Bs={1:"!",2:"?",3:"!!",4:"??",5:"!?",6:"?!"},qs={clk:"Clock",emt:"Move time",egt:"Game time",mct:"Mechanical clock",eval:"Evaluation"};function Fn(t){let e=[];for(let n of t||[])for(let r of n.commands||[]){let s=qs[r.name];s&&e.push(`<span class="cmd" title="${s}">${J(r.args.join(" "))}</span>`)}return e.join("")}function Kn(t){let e=[];for(let n of t||[]){let r=(0,ut.stripCommands)(n.text);r&&e.push(r)}return e}var Fs={"1-0":"White wins","0-1":"Black wins","1/2-1/2":"Draw","*":"Unfinished"};function J(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}var Bn={"(":"variation","{":"comment","[":"tag"};function Ks(t){let e=[],n={")":"(","}":"{","]":"["},r=1,s=1,i=!1,o=!1,l=!1;for(let a=0;a<t.length;a++){let c=t[a];if(c===`
`){r++,s=1,o=!1,l=!1;continue}o||(i?c==="}"&&(i=!1,e.pop()):l?c==="\\"?(a++,s++):c==='"'&&(l=!1):c==='"'?l=!0:c===";"?o=!0:n[c]!=null?0<e.length&&e[e.length-1].char===n[c]&&e.pop():(c==="("||c==="["||c==="{")&&(e.push({char:c,row:r,col:s}),c==="{"&&(i=!0))),s++}return e[0]}function qn(t){return t.charAt(0).toUpperCase()+t.slice(1)}function Us(t,e){let n=t,r=String(n.message??"").split(`
`)[0].replace(/^\[[^\]]*\]:\s*/,""),s=n.lineNumber,i=n.columnNumber;if(s==null||i==null)return qn(r||"this is not chess notation")+".";let o=e.split(`
`)[s-1]??"",l=`line ${s}, column ${i}`;if(n.code==="unexpected"){let a=Ks(e);if(i>o.length)return a?`The notation ends before the ${Bn[a.char]} opened at line ${a.row}, column ${a.col} is closed.`:`The notation ends in the middle of a game, at ${l}.`;let c=/^\S+/.exec(o.slice(i-1)),u=a?` The ${Bn[a.char]} opened at line ${a.row}, column ${a.col} is still open.`:"";if(c)return`“${c[0]}” is not chess notation — ${l}.${u}`}return`${qn(r)} — ${l}.`}function Ys(t){let e;try{e=t.tags?.FEN?$e(t.tags.FEN):Ee()}catch{e=Ee()}let n=[],r,s=(o,l,a)=>{let c=[],u=l;for(let d of o.moves){let f=u,h={id:n.length,move:d,position:f,line:c,at:c.length,depth:a},m=ct(f,d);m?(u=je(f,m),h.position=u,h.from=m.from,h.to=m.to):(h.error=`${d.san}: not a legal move in this position`,r=r??`Move ${d.number}${d.side==="w"?".":"..."} ${h.error}`),n.push(h),c.push(h);for(let g of d.variations||[])s(g,f,a+1);if(h.error)break}return c},i=s(t,e,0);return{game:t,start:e,nodes:n,mainline:i,error:r}}function Ds(t,e,n){let r=new Map;for(let l of e)r.set(l.move,l);let s=[],i=(l,a)=>{for(let c of l||[]){let u=Bs[c];s.push(`<span class="nag" title="Numeric annotation glyph $${c}">`+(u?J(u):`$${c}`)+"</span>")}if(s.push(Fn(a)),n)for(let c of Kn(a))s.push(`<span class="cm">${J(c)}</span>`)},o=(l,a)=>{i(l.nags,l.comments);let c=-1;for(let u of l.moves){let d=r.get(u),f=u.side==="w";(f||c!==u.number)&&s.push(`<span class="no">${u.number}${f?".":"..."}</span>`),c=u.number,s.push(`<button class="mv${d?.error?" bad":""}" type="button" data-node="${d?d.id:-1}"`+(d?.error?` title="${J(d.error)}"`:"")+`>${J(u.san)}${J(u.annotation||"")}</button>`),i(u.nags,u.comments);for(let h of u.variations||[])s.push('<span class="var">('),o(h,a+1),s.push(")</span>"),c=-1}};return o(t,0),t.result&&s.push(`<span class="res" title="${Fs[t.result]||""}">${t.result}</span>`),s.join(" ")}var Gs=`
<div class="wrap" part="wrap">
  <div class="boardpane">
    <div class="boardbox" id="board" part="board"></div>
    <div class="bar" part="controls">
      <button type="button" id="first" title="Start (Home)" aria-label="Start">&#9198;</button>
      <button type="button" id="prev" title="Previous (Left arrow)" aria-label="Previous">&#9664;</button>
      <button type="button" id="next" title="Next (Right arrow)" aria-label="Next">&#9654;</button>
      <button type="button" id="last" title="End (End)" aria-label="End">&#9197;</button>
      <button type="button" id="flip" title="Flip the board (f)" aria-label="Flip the board">&#8645;</button>
      <span class="ply" id="ply" aria-live="polite"></span>
    </div>
  </div>
  <div class="side" part="notation">
    <div class="tags" id="tags"></div>
    <div class="moves" id="moves" part="moves" tabindex="0"></div>
    <div class="comment" id="comment" part="commentary" role="note"></div>
  </div>
  <!-- Outside the side panel on purpose: this reports on the component,
       not on the notation, so notation="hidden" must not silence it. A
       board with no visible reason for being empty is worse than none.
       (No backticks in here: TEMPLATE is a template literal.) -->
  <div class="note" id="note" part="status" role="status"></div>
  <div class="srcpane" part="source">
    <textarea id="src" part="editor" spellcheck="false" autocapitalize="off"
      autocorrect="off" aria-label="Chess notation source"></textarea>
  </div>
</div>`,Hs=typeof HTMLElement>"u"?class{}:HTMLElement,Le=class extends Hs{static observedAttributes=["orientation","game","ply","source","commentary","controls","notation","tags","coordinates"];#e;#t;#n;#o=!1;#l;#u=!1;#a;#r=!1;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),this.#e.innerHTML=`<style>${Ln}</style>${Gs}`}connectedCallback(){this.#u||(this.#u=!0,this.#p()),this.#l=new MutationObserver(()=>{this.#a=void 0,this.load()}),this.#l.observe(this,{childList:!0,characterData:!0,subtree:!0}),this.load()}disconnectedCallback(){this.#l?.disconnect(),this.#l=void 0}attributeChangedCallback(e){this.#u&&(e==="orientation"?(this.#o=this.getAttribute("orientation")==="black",this.#i()):e==="game"||e==="ply"?this.load():(this.#f(),this.#i()))}get source(){return this.#a??this.textContent??""}set source(e){this.#a=e,this.load()}get move(){return this.#n?.move}get ply(){return this.#n?this.#n.at+1:0}goto(e){let n=this.#n?.line||this.#t?.mainline||[];this.#s(0<e?n[e-1]:void 0)}load(){let e=m=>this.#e.getElementById(m),n=e("note"),r=e("moves"),s=e("tags"),i=this.source;this.#o=this.getAttribute("orientation")==="black",this.#m(i);let o=(m,g)=>{if(!this.#r)return;let p={source:i,ok:m,error:g};this.dispatchEvent(new CustomEvent("chess-source",{detail:p,bubbles:!0}))},l=(m,g)=>{n.className=g?"note bad":"note",n.textContent=m},a=(m,g)=>{this.#r||(this.#t=void 0,this.#n=void 0,s.textContent="",r.textContent="",this.#i()),l(m,g),o(!1,m)},c;try{c=(0,ut.parse)(i)}catch(m){return a(Us(m,i),!0)}let u=Number(this.getAttribute("game")||0),d=c[u]||c[0];if(d==null)return a("No game.",!1);let f=this.#r?this.ply:0;this.#n=void 0,this.#t=Ys(d),s.innerHTML=Vs(d,c.length,u),this.#f(),l(this.#t.error||"",this.#t.error!=null),o(!0,this.#t.error);let h=this.getAttribute("ply");this.#r?this.goto(Math.min(f,this.#t.mainline.length)):h!=null?this.goto(Number(h)):this.#i()}#f(){let e=this.#e.getElementById("moves");if(this.#t==null){e.textContent="";return}e.innerHTML=Ds(this.#t.game,this.#t.nodes,this.#d()!=="panel");for(let n of Array.from(e.querySelectorAll("button[data-node]")))n.addEventListener("click",()=>{this.#s(this.#t?.nodes[Number(n.dataset.node)])})}#d(){let e=this.getAttribute("commentary");return e==="panel"||e==="hidden"?e:"inline"}#h(){let e=this.getAttribute("source");return e==="view"||e==="edit"?e:"hidden"}#m(e){let n=this.#e.getElementById("src");n!=null&&(n.readOnly=this.#h()!=="edit",!this.#r&&n.value!==e&&(n.value=e))}#p(){let e=(i,o)=>this.#e.getElementById(i)?.addEventListener("click",o),n=()=>{let i=this.#n?.line||this.#t?.mainline;this.#s(i?.[i.length-1])},r=()=>{this.#o=!this.#o,this.#i()};e("first",()=>this.#s(void 0)),e("prev",()=>this.#c(-1)),e("next",()=>this.#c(1)),e("last",n),e("flip",r);let s=this.#e.getElementById("src");s.addEventListener("input",()=>{this.#r=!0,this.#a=s.value;try{this.load()}finally{this.#r=!1}}),this.hasAttribute("tabindex")||(this.tabIndex=0),this.addEventListener("keydown",i=>{if(i.composedPath().includes(s))return;let l={ArrowLeft:()=>this.#c(-1),ArrowRight:()=>this.#c(1),Home:()=>this.#s(void 0),End:n,f:r}[i.key];l&&(i.preventDefault(),l())})}#c(e){let n=this.#n?.line||this.#t?.mainline;if(n==null)return;let r=this.#n?this.#n.at+e:0<e?0:-1;r>=n.length||this.#s(0>r?void 0:n[r])}#g(){let e=this.#e.getElementById("comment");if(this.#d()!=="panel"){e.textContent="";return}let n=this.#n?this.#n.move.comments:this.#t?.game.comments,r=this.#n?`${this.#n.move.number}${this.#n.move.side==="w"?".":"…"} ${this.#n.move.san}`:"",s=Kn(n),i=Fn(n);if(s.length===0&&i===""){e.innerHTML="";return}e.innerHTML=(r?`<span class="who">${J(r)}</span>`:"")+i+s.map(o=>`<p>${J(o)}</p>`).join("")}#s(e){this.#n=e,this.#i();let n={move:e?.move,ply:this.ply};this.dispatchEvent(new CustomEvent("chess-move",{detail:n,bubbles:!0}))}#i(){let e=this.#e.getElementById("board"),n=this.#e.getElementById("ply"),r=this.#n?.position||this.#t?.start||Ee(),s=r.board.indexOf(r.turn+"k"),i=0<=s&&X(r,s,r.turn==="w"?"b":"w")?s:void 0;e.innerHTML=ot({position:r,from:this.#n?.from,to:this.#n?.to,flipped:this.#o,check:i}),e.firstElementChild?.setAttribute("aria-label",`Chess position.
`+lt(r));let o=this.#n?.line||this.#t?.mainline||[];n.textContent=`${this.ply} / ${o.length}`,this.#g();for(let l of Array.from(this.#e.querySelectorAll(".mv.on")))l.classList.remove("on");if(this.#n){let l=this.#e.querySelector(`.mv[data-node="${this.#n.id}"]`);l&&(l.classList.add("on"),zs(this.#e.getElementById("moves"),l))}}};function zs(t,e){let n=e.offsetTop-t.offsetTop,r=n+e.offsetHeight;n<t.scrollTop?t.scrollTop=n:r>t.scrollTop+t.clientHeight&&(t.scrollTop=r-t.clientHeight)}function Vs(t,e,n){let r=t.tags||{},s=[],i=[r.White,r.Black].filter(Boolean).join(" — "),o=[r.Event,r.Site,r.Date].filter(Boolean).join(" · ");return i&&s.push(`<div class="players">${J(i)}</div>`),o&&s.push(`<div class="meta">${J(o)}</div>`),1<e&&s.push(`<div class="meta">Game ${n+1} of ${e}</div>`),s.join("")}function jt(t="chess-view"){customElements.get(t)||customElements.define(t,Le)}typeof customElements<"u"&&jt();return Zn(Zs);})();
