/* @tabnas/chess-game 0.1.0 — built artifact, do not edit here.
 *
 * Source: https://github.com/tabnas/chess (web/), MIT.
 * Refresh with:  cd ../chess/web && npm run build
 *                cp dist/chess-game.js ../../web/public/chess-game.js
 *
 * Vendored rather than installed because @tabnas/chess-game is not on npm
 * yet, and the Cloudflare build can only resolve published packages. Once
 * it publishes, replace this with a dependency and an import.
 */
/*! @tabnas/chess-game 0.1.0 | MIT | https://github.com/tabnas/chess
 * Bundles @tabnas/chess and @tabnas/parser. No external requests. */
"use strict";var ChessGame=(()=>{var Ln=Object.create;var Be=Object.defineProperty;var Bn=Object.getOwnPropertyDescriptor;var qn=Object.getOwnPropertyNames;var Fn=Object.getPrototypeOf,Kn=Object.prototype.hasOwnProperty;var H=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}},Un=(t,e)=>{for(var n in e)Be(t,n,{get:e[n],enumerable:!0})},$t=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of qn(e))!Kn.call(t,i)&&i!==n&&Be(t,i,{get:()=>e[i],enumerable:!(r=Bn(e,i))||r.enumerable});return t};var Yn=(t,e,n)=>(n=t!=null?Ln(Fn(t)):{},$t(e||!t||!t.__esModule?Be(n,"default",{value:t,enumerable:!0}):n,t)),Gn=t=>$t(Be({},"__esModule",{value:!0}),t);var ce=H($=>{"use strict";Object.defineProperty($,"__esModule",{value:!0});$.asTin=$.STRING=$.SKIP=$.INSPECT=$.EMPTY=$.AFTER=$.BEFORE=$.CLOSE=$.OPEN=void 0;$.OPEN="o";$.CLOSE="c";$.BEFORE="b";$.AFTER="a";$.EMPTY="";$.INSPECT=Symbol.for("nodejs.util.inspect.custom");$.SKIP=Symbol.for("tabnas.SKIP");$.STRING="string";var Dn=t=>t;$.asTin=Dn});var xe=H(E=>{"use strict";Object.defineProperty(E,"__esModule",{value:!0});E.STATE_MASK=E.STOP=E.CI_RESET=E.IS_ROW=E.CONSUME=E.makeTextMatcher=E.makeNumberMatcher=E.makeCommentMatcher=E.makeStringMatcher=E.makeLineMatcher=E.makeSpaceMatcher=E.makeFixedMatcher=E.makeMatchMatcher=E.makeToken=E.makePoint=E.makeLex=E.makeNoToken=E.Token=E.Point=E.Lex=void 0;E.guardedMatcher=te;E.scan=ke;E.buildCharRunSpec=Kt;E.buildLineRunSpec=mt;E.buildStringBodySpec=ft;var Q=ce(),T=ae(),qe=class{constructor(e,n,r,i){this.len=-1,this.sI=0,this.rI=1,this.cI=1,this.token=[],this.len=e,n!=null&&(this.sI=n),r!=null&&(this.rI=r),i!=null&&(this.cI=i)}toString(){return"Point["+[this.sI+"/"+this.len,this.rI,this.cI]+(0<this.token.length?" "+this.token:"")+"]"}[Q.INSPECT](){return this.toString()}};E.Point=qe;var Fe=(...t)=>new qe(...t);E.makePoint=Fe;var Ke=class{#e;#t;constructor(e,n,r,i,s,o,l,c,a){this.isToken=!0,this.name=Q.EMPTY,this.tin=-1,this.val=void 0,this.sI=-1,this.rI=-1,this.cI=-1,this.len=-1,this.name=e,this.tin=n,this.#e=i,this.#t=c,this.val=r,this.sI=s.sI,this.rI=s.rI,this.cI=s.cI,this.use=o,this.why=l,this.len=a??(i==null?0:i.length)}get src(){let e=this.#e;if(e===void 0){let n=this.#t;e=this.#e=n===void 0?Q.EMPTY:n.substring(this.sI,this.sI+this.len)}return e}set src(e){this.#e=e}resolveVal(e,n){return typeof this.val=="function"?this.val(e,n):this.val}bad(e,n){return this.err=e,n!=null&&(this.use=(0,T.deep)(this.use||{},n)),this}toString(){return"Token["+this.name+"="+this.tin+" "+(0,T.snip)(this.src)+(this.val===void 0||this.name==="#ST"||this.name==="#TX"?"":"="+(0,T.snip)(this.val))+" "+[this.sI,this.rI,this.cI]+(this.use==null?"":" "+(0,T.snip)(""+JSON.stringify(this.use).replace(/"/g,""),22))+(this.err==null?"":" "+this.err)+(this.why==null?"":" "+(0,T.snip)(""+this.why,22))+"]"}[Q.INSPECT](){return this.toString()}};E.Token=Ke;var dt=(...t)=>new Ke(...t);E.makeToken=dt;var Hn=()=>dt("",-1,void 0,Q.EMPTY,Fe(-1));E.makeNoToken=Hn;function te(t,e){return function(r,i,s){if(t.lex){if(t.check){r.refwd();let o=t.check(r);if(o&&o.done)return o.token}return e(r,i,s)}}}var ee=65536;E.CONSUME=ee;var Ye=1<<17;E.IS_ROW=Ye;var ht=1<<18;E.CI_RESET=ht;var Oe=1<<19;E.STOP=Oe;var Ft=65535;E.STATE_MASK=Ft;function ke(t,e,n,r,i,s){let o=e,l=n,c=r,a=t.length,f=i.nclasses,d=i.classOf,u=i.table,h=i.initialState;for(;o<a;){let p=t.charCodeAt(o),y=p<256?d[p]:i.fallback(t[o]),m=u[h*f+y];if(m&ee&&(o++,m&Ye?(l++,c=1):m&ht?c=1:c++),h=m&Ft,m&Oe)break}return s.sI=o,s.rI=l,s.cI=c,e<o}function mt(t){let e=new Uint8Array(256);for(let s=0;s<256;s++)t.charsBitmap[s]&&(e[s]=t.rowCharsBitmap[s]?2:1);let n=t.chars,r=t.rowChars;return{initialState:0,nclasses:3,classOf:e,fallback:s=>n[s]?r[s]?2:1:0,table:zn}}var zn=new Int32Array([Oe,ee,ee|Ye]);function Kt(t,e){return{initialState:0,nclasses:2,classOf:t,fallback:r=>e[r]?1:0,table:Vn}}var Vn=new Int32Array([Oe,ee]);function ft(t,e){let n=e.charCodeAt(0),r=t.string.escCharCode,i=t.string.replaceCodeMap,s=t.string.hasReplace,o=!!t.string.multiBitmap[n],l=t.string.allowControl,c=t.line.charsBitmap,a=t.line.rowCharsBitmap,f=new Uint8Array(256);for(let p=0;p<256;p++)p===n||p===r||s&&i[p]!==void 0?f[p]=1:p<32&&(o&&c[p]?f[p]=a[p]?3:2:l&&!c[p]?f[p]=0:f[p]=1);let d=t.line.chars,u=t.line.rowChars;return{initialState:0,nclasses:4,classOf:f,fallback:p=>{let y=p.charCodeAt(0);return p===e||y===r||s&&i[y]!==void 0?1:o&&d[p]?u[p]?3:2:0},table:Zn}}var Zn=new Int32Array([ee,Oe,ee|ht,ee|Ye]),Wn=(t,e)=>{let n=new Array(256),r=[],i=(s,o)=>o.len-s.len||(s.src<o.src?-1:s.src>o.src?1:0);for(let s of(0,T.keys)(t.fixed.token)){let o=t.fixed.token[s];if(o==null||s.length===0)continue;let l={src:s,len:s.length,tin:o},c=s.charCodeAt(0);c<256?(n[c]=n[c]||[]).push(l):r.push(l)}for(let s of n)s&&s.sort(i);return r.sort(i),te(t.fixed,function(o){let l=o.pnt,c=o.src,a=c.charCodeAt(l.sI),f=a<256?n[a]:r;if(f===void 0)return;let d=o.want;for(let u of f)if(!(d!=null&&!d.includes(u.tin))&&(u.len===1&&a<256||c.startsWith(u.src,l.sI))){let h=o.token(u.tin,void 0,u.src,l);return l.sI+=u.len,l.cI+=u.len,h}})};E.makeFixedMatcher=Wn;var Xn=(t,e)=>{let n=(0,T.entries)(t.match.value).sort(([i],[s])=>i<s?-1:i>s?1:0).map(([,i])=>i),r=(0,T.values)(t.match.token).sort((i,s)=>(i.tin$||0)-(s.tin$||0));return n.length===0&&r.length===0?null:te(t.match,function(s,o,l=0){let c=s.pnt,a=s.refwd(),f=o.state==="o"?0:1,d=s.want;if(d==null)for(let u of n)if(u.match instanceof RegExp){let h=a.match(u.match);if(h){let p=h[0],y=p.length;if(0<y){let m,k=u.val?u.val(h):p;return m=s.token("#VL",k,p,c),c.sI+=y,c.cI+=y,m}}}else{let h=u.match(s,o);if(h!=null)return h}for(let u of r){if(d!=null){if(!u.tin$||!d.includes(u.tin$))continue}else if(u.tin$&&!u.eager$&&!o.spec.def.tcol[f][l].includes(u.tin$))continue;if(u instanceof RegExp){let h=a.match(u);if(h){let p=h[0],y=p.length;if(0<y){let m,k=u.tin$;return m=s.token(k,p,p,c),c.sI+=y,c.cI+=y,m}}}else{let h=u(s,o);if(h!=null)return h}}})};E.makeMatchMatcher=Xn;var Jn=(t,e)=>{let n=e.comment;t.comment={lex:n?!!n.lex:!1,def:(n?.def?(0,T.entries)(n.def):[]).reduce((c,[a,f])=>{if(f==null||f===!1)return c;let{suffixes:d,suffixFn:u}=Qn(f.suffix),h={name:a,start:f.start,end:f.end,line:!!f.line,lex:!!f.lex,eatline:!!f.eatline,suffixes:d,suffixFn:u};return c[a]=h,c},{}),check:n?.check};let r=(c,a)=>a.start.length-c.start.length||(c.name<a.name?-1:c.name>a.name?1:0),i=t.comment.lex?(0,T.values)(t.comment.def).filter(c=>c.lex&&c.line).sort(r):[],s=t.comment.lex?(0,T.values)(t.comment.def).filter(c=>c.lex&&!c.line).sort(r):[],o=mt(t.line),l={sI:0,rI:0,cI:0};return te(t.comment,function(a){let f=a.pnt,d=a.src,u=f.rI,h=f.cI,p=t.line.charsBitmap,y=t.line.rowCharsBitmap,m=t.line.chars,k=t.line.rowChars;for(let g of i)if(d.startsWith(g.start,f.sI)){let N=d.length,b=f.sI+g.start.length;h+=g.start.length;let A=0,_;for(;b<N&&!((_=d.charCodeAt(b))<256?p[_]:m[d[b]]);){let x=Lt(d,b,g.suffixes);if(x>0){A=x;break}if(x=Bt(a,b,g.suffixFn),x>0){A=x;break}h++,b++}A>0?(b+=A,h+=A):g.eatline&&(ke(d,b,u,h,o,l),u=l.rI,b=l.sI);let M=a.token("#CM",void 0,void 0,f,void 0,void 0,b-f.sI);return f.sI=b,f.cI=h,f.rI=u,M}for(let g of s)if(d.startsWith(g.start,f.sI)){let N=d.length,b=f.sI+g.start.length,A=g.end;h+=g.start.length;let _=0,M;for(;b<N&&!d.startsWith(A,b);){let x=Lt(d,b,g.suffixes);if(x>0){_=x;break}if(x=Bt(a,b,g.suffixFn),x>0){_=x;break}M=d.charCodeAt(b),(M<256?y[M]:k[d[b]])&&(u++,h=0),h++,b++}if(_>0){for(let B=0;B<_;B++)M=d.charCodeAt(b+B),(M<256?y[M]:k[d[b+B]])&&(u++,h=0),h++;let x=a.token("#CM",void 0,void 0,f,void 0,void 0,b+_-f.sI);return f.sI=b+_,f.rI=u,f.cI=h,x}if(d.startsWith(A,b)){h+=A.length,g.eatline&&(ke(d,b,u,h,o,l),u=l.rI,b=l.sI);let x=a.token("#CM",void 0,void 0,f,void 0,void 0,b+A.length-f.sI);return f.sI=b+A.length,f.rI=u,f.cI=h,x}else return a.bad(T.S.unterminated_comment,f.sI,f.sI+9*g.start.length)}})};E.makeCommentMatcher=Jn;function Qn(t){if(t==null)return{suffixes:void 0,suffixFn:void 0};if(typeof t=="function")return{suffixes:void 0,suffixFn:t};let e=[];if(typeof t=="string")t!==""&&e.push(t);else if(Array.isArray(t))for(let n of t)typeof n=="string"&&n!==""&&e.push(n);return e.length>1&&e.sort((n,r)=>r.length-n.length||(n<r?-1:n>r?1:0)),{suffixes:e.length===0?void 0:e,suffixFn:void 0}}function Lt(t,e,n){if(!n||n.length===0)return 0;for(let r of n)if(t.startsWith(r,e))return r.length;return 0}function Bt(t,e,n){if(!n)return 0;let r=t.pnt,i=r.sI,s=r.rI,o=r.cI;r.sI=e;let l;try{l=n(t,void 0)}finally{r.sI=i,r.rI=s,r.cI=o}return l==null?0:typeof l.src=="string"?l.src.length:0}var er=(t,e)=>{let n=(0,T.regexp)(t.line.lex?"y":"ys","(.*?)",...t.rePart.ender);return function(i){if(t.text.check){i.refwd();let f=t.text.check(i);if(f&&f.done)return f.token}let s=t.text,o=i.pnt,l=t.value.def,c=t.value.defre;n.lastIndex=o.sI;let a=n.exec(i.src);if(a){let f=a[1],d=a[2],u;if(f!=null){let h=f.length;if(0<h){let p;if(t.value.lex){if((p=l[f])!==void 0)u=i.token("#VL",p.val,f,o),o.sI+=h,o.cI+=h;else for(let y of c)if(y.match){let m=y.match.exec(y.consume?i.refwd():f);if(m&&(y.consume||m[0].length===f.length)){let k=m[0];if(y.val==null)u=i.token("#VL",k,k,o);else{let g=y.val(m);u=i.token("#VL",g,k,o)}o.sI+=k.length,o.cI+=k.length}}}u==null&&s.lex&&(u=i.token("#TX",f,f,o),o.sI+=h,o.cI+=h)}}if(u&&(u=Ut(i,u,d)),u&&0<t.text.modify.length){let h=t.text.modify;for(let p=0;p<h.length;p++)u.val=h[p](u.val,i,t,e)}return u}}};E.makeTextMatcher=er;var tr=(t,e)=>{let n=t.number,r=[n.hex?"[xX][0-9a-fA-F_]+":null,n.oct?"[oO][0-7_]+":null,n.bin?"[bB][01_]+":null].filter(c=>c!=null).join("|"),i="\\.?[0-9]+(?:[0-9_]*[0-9])?(?:\\.(?:[0-9](?:[0-9_]*[0-9])?)?)?(?:[eE][-+]?[0-9]+(?:[0-9_]*[0-9])?)?",s=(0,T.regexp)("y",("([-+]?"+(r===""?i:"(?:0(?:"+r+")|"+i+")")).replace(/_/g,n.sep?(0,T.escre)(n.sepChar):""),")",...t.rePart.ender),o=n.sep?(0,T.regexp)("g",(0,T.escre)(n.sepChar)):void 0,l=n.sep?n.sepChar:void 0;return te(t.number,function(a){n=t.number;let f=a.pnt,d=t.value.def;s.lastIndex=f.sI;let u=s.exec(a.src);if(u){let h=u[1],p=u[2],y,m=!0;if(h!=null&&(m=!t.number.exclude||!h.match(t.number.exclude))){let k=h.length;if(0<k){let g;if(t.value.lex&&(g=d[h])!==void 0)y=a.token("#VL",g.val,h,f);else{let N=o&&l&&-1<h.indexOf(l)?h.replace(o,""):h,b=+N;if(isNaN(b)){let A=N[0];(A==="-"||A==="+")&&(b=(A==="-"?-1:1)*+N.substring(1))}isNaN(b)||(y=a.token("#NR",b,h,f),f.sI+=k,f.cI+=k)}}}return m&&y!=null&&(y=Ut(a,y,p)),y}})};E.makeNumberMatcher=tr;var nr=(t,e)=>{let n=e.string||{};t.string=t.string||{},t.string.quoteMap=(0,T.charset)(n.chars),t.string.quoteBitmap=(0,T.charsBitmap)(n.chars),t.string.multiChars=(0,T.charset)(n.multiChars),t.string.multiBitmap=(0,T.charsBitmap)(n.multiChars),t.string.escMap={...n.escape},t.string.replaceCodeMap=(0,T.omap)((0,T.clean)({...n.replace}),([s,o])=>[s.charCodeAt(0),o]),t.string=(0,T.deep)(t.string,{lex:!!n?.lex,escChar:n.escapeChar,escCharCode:n.escapeChar==null?void 0:n.escapeChar.charCodeAt(0),allowUnknown:!!n.allowUnknown,escapeStrict:!!n.escapeStrict,allowControl:!!n.allowControl,hasReplace:!1,abandon:!!n.abandon}),t.string.check=n.check,t.string.escMap=(0,T.clean)(t.string.escMap);for(let s of(0,T.keys)(t.string.escMap))t.string.escMap[s]===""&&delete t.string.escMap[s];t.string.escBitmap=(0,T.charsBitmap)(t.string.escMap),t.string.hasReplace=0<(0,T.keys)(t.string.replaceCodeMap).length;let r=new Map;for(let s of Object.keys(t.string.quoteMap))r.set(s.charCodeAt(0),ft(t,s));let i={sI:0,rI:0,cI:0};return te(t.string,function(o){let l=t.string,{quoteMap:c,quoteBitmap:a,escMap:f,escCharCode:d,multiChars:u,multiBitmap:h,allowUnknown:p,replaceCodeMap:y,hasReplace:m,escapeStrict:k}=l,{pnt:g,src:N}=o,b=g.sI,A=g.rI,_=N.length,M=N.charCodeAt(b);if(!(M<256?a[M]:c[N[b]]))return;let x=N[b],B=M<256?!!h[M]:!!u[x],j=r.get(M)||(()=>{let J=ft(t,x);return r.set(M,J),J})(),I=b+1,Ee=A,S=g.cI+1,C;for(;I<_;){let J=I;if(ke(N,I,Ee,S,j,i),I=i.sI,Ee=i.rI,S=i.cI,C!==void 0&&J<I&&C.push(N.substring(J,I)),I>=_)break;let le=N.charCodeAt(I);if(le===M){let U=C===void 0?N.substring(b+1,I):C.join(Q.EMPTY);I++;let V=o.token("#ST",U,void 0,g,void 0,void 0,I-b);return g.sI=I,g.rI=Ee,g.cI=S+1,V}if(m){let U=y[le];if(U!==void 0){C===void 0&&(C=b+1<I?[N.substring(b+1,I)]:[]),C.push(U),I++,S++;continue}}if(le===d){if(C===void 0&&(C=b+1<I?[N.substring(b+1,I)]:[]),I++,S++,I>=_)break;let U=N[I],V=f[U];if(V!=null)C.push(V),I++,S++;else if(U==="x"&&!k){I++;let P=parseInt(N.substring(I,I+2),16);if(isNaN(P))return l.abandon?void 0:(I-=2,S-=1,g.sI=I,g.cI=S,o.bad(T.S.invalid_ascii,I,I+4));C.push(String.fromCharCode(P)),I+=2,S+=3}else if(U==="u")if(I++,N[I]==="{"&&!k){let P=N.indexOf("}",I+1),be=P===-1?"":N.substring(I+1,P),ut=0<be.length&&be.length<=6&&/^[0-9a-fA-F]+$/.test(be)?parseInt(be,16):NaN;if(isNaN(ut)||1114111<ut)return l.abandon?void 0:(I=I-2,g.sI=I,g.cI=S-1,o.bad(T.S.invalid_unicode,I,P===-1?_:P+1));C.push(String.fromCodePoint(ut)),S+=P+1-I+1,I=P+1}else{let P=parseInt(N.substring(I,I+4),16);if(isNaN(P))return l.abandon?void 0:(I=I-2,S-=1,g.sI=I,g.cI=S,o.bad(T.S.invalid_unicode,I,I+6));C.push(String.fromCharCode(P)),I+=4,S+=5}else if(p)C.push(U),I++,S++;else return l.abandon?void 0:(g.sI=I,g.cI=S,o.bad(T.S.unexpected,I,I+1));continue}if(le<32)return l.abandon?void 0:(g.sI=I,g.cI=S,o.bad(T.S.unprintable,I,I+1));break}if(!l.abandon)return g.rI=A,o.bad(T.S.unterminated_string,b,I)})};E.makeStringMatcher=nr;var rr=(t,e)=>{let n=mt(t.line),r={sI:0,rI:0,cI:0};return te(t.line,function(s){let{pnt:o,src:l}=s;if(t.line.single){let c=t.line.charsBitmap,a=t.line.rowCharsBitmap,f=t.line.chars,d=t.line.rowChars,u=o.sI,h=o.rI,p,y={};for(;(p=l.charCodeAt(u))<256?c[p]:f[l[u]];){let m=l[u],k=(y[m]||0)+1;if(y[m]=k,k>1)break;(p<256?a[p]:d[l[u]])&&h++,u++}if(o.sI<u){let m=s.token("#LN",void 0,void 0,o,void 0,void 0,u-o.sI);return o.sI=u,o.rI=h,o.cI=1,m}return}if(ke(l,o.sI,o.rI,o.cI,n,r)){let c=s.token("#LN",void 0,void 0,o,void 0,void 0,r.sI-o.sI);return o.sI=r.sI,o.rI=r.rI,o.cI=1,c}})};E.makeLineMatcher=rr;var ir=(t,e)=>{let n=Kt(t.space.charsBitmap,t.space.chars),r={sI:0,rI:0,cI:0};return te(t.space,function(s){let{pnt:o,src:l}=s;if(ke(l,o.sI,o.rI,o.cI,n,r)){let c=s.token("#SP",void 0,void 0,o,void 0,void 0,r.sI-o.sI);return o.sI=r.sI,o.rI=r.rI,o.cI=r.cI,c}})};E.makeSpaceMatcher=ir;function Ut(t,e,n){let r=t.pnt,i=e;if(t.cfg.fixed.lex&&n!=null&&0<n.length){let o,l=t.cfg.fixed.token[n];l!=null&&(o=t.token(l,void 0,n,r)),o!=null&&(r.sI+=o.src.length,r.cI+=o.src.length,e==null?i=o:r.token.push(o))}return i}var qt={match:1,fixed:1,space:1,line:1,string:1,comment:1,number:1,text:1},Ue=class{refwd(){return this.fwdSI!==this.pnt.sI&&(this.fwd=this.src.substring(this.pnt.sI),this.fwdSI=this.pnt.sI),this.fwd}relex(e,n,r){if(e==null||e.len<=0||e.sI<0)return;let i=this.pnt,s=i.sI,o=i.rI,l=i.cI,c=i.token,a=i.end;i.sI=e.sI,i.rI=e.rI,i.cI=e.cI,i.token=[],i.end=void 0,this.want=n;let f;try{f=this.next(r)}finally{this.want=null}if(f==null||!n.includes(f.tin)){i.sI=s,i.rI=o,i.cI=l,i.token=c,i.end=a;return}e.ignored!=null&&(f.ignored=e.ignored);let d=this.relexUndo;return d.sI=s,d.rI=o,d.cI=l,d.token=c,d.end=a,f}unrelex(e,n,r,i,s){let o=this.pnt;o.sI=e,o.rI=n,o.cI=r,o.token=i,o.end=s}speculate(e,n,r){let i=this.pnt,s=i.sI,o=i.rI,l=i.cI,c=i.token.length,a=i.end;qt[e.matcher]===void 0&&this.refwd();let f=e(this,n,r);if(f!=null&&this.want.includes(f.tin))return f;i.sI=s,i.rI=o,i.cI=l,i.token.length=c,i.end=a}constructor(e){this.src=Q.EMPTY,this.ctx={},this.cfg={},this.pnt=Fe(-1),this.fwd=Q.EMPTY,this.fwdSI=-1,this.want=null,this.relexUndo={sI:-1,rI:-1,cI:-1,token:[],end:void 0},this.ctx=e,this.src=e.src(),this.cfg=e.cfg,this.pnt=Fe(this.src.length)}token(e,n,r,i,s,o,l){let c,a;return typeof e=="string"?(a=e,c=(0,T.tokenize)(a,this.cfg)):(c=e,a=(0,T.tokenize)(e,this.cfg)),dt(a,c,n,r,i||this.pnt,s,o,this.src,l)}next(e,n,r,i){let s,o=this.pnt,l=o.sI,c;if(o.end)s=o.end;else if(0<o.token.length)s=o.token.shift();else if(o.len<=o.sI)o.end=this.token("#ZZ",void 0,"",o),s=o.end;else{let a=this.cfg.lex.dispatch,f=this.src.charCodeAt(o.sI),d=a===void 0?this.cfg.lex.match:a[f<256?f:256];try{for(let u of d){if(this.want!=null){let h=u.matcher;if(h!=="match"&&h!=="fixed"){let p=this.cfg.t,y=h==="space"?p.SP:h==="line"?p.LN:h==="string"?p.ST:h==="comment"?p.CM:h==="number"?p.NR:h==="text"?p.TX:-1;if(y===-1){let m=this.speculate(u,e,i);if(m===void 0)continue;s=m,c=u;break}if(!this.want.includes(y))continue}}if(qt[u.matcher]===void 0&&this.refwd(),s=u(this,e,i)){c=u;break}}}catch(u){s=s||this.token("#BD",void 0,this.src[o.sI],o,{err:u},u.code||T.S.unexpected)}s=s||this.token("#BD",void 0,this.src[o.sI],o,void 0,T.S.unexpected)}return this.ctx.log&&this.ctx.log(T.S.lex,this.ctx,e,this,o,l,c,s,n,r,i),this.ctx.sub.lex&&this.ctx.sub.lex.map(a=>a(s,e,this.ctx)),s}tokenize(e){return(0,T.tokenize)(e,this.cfg)}bad(e,n,r){return this.token("#BD",void 0,0<=n&&n<=r?this.src.substring(n,r):this.src[this.pnt.sI],void 0,void 0,e)}};E.Lex=Ue;var sr=(...t)=>new Ue(...t);E.makeLex=sr});var Ne=H(Z=>{"use strict";Object.defineProperty(Z,"__esModule",{value:!0});Z.TabnasError=void 0;Z.errdesc=Ht;Z.errinject=Gt;Z.errsite=bt;Z.errmsg=Dt;Z.trimstk=or;Z.strinject=zt;Z.prop=Vt;var ue=ce(),pt=ae(),Yi={function:"function",object:"object",string:"string",unexpected:"unexpected",Object:"Object",Array:"Array",gap:"  ",no_re_flags:ue.EMPTY},gt=class extends SyntaxError{constructor(e,n,r,i,s){n=(0,pt.deep)({},n);let o=Ht(e,n,r,i,s);super(o.message),(0,pt.assign)(this,o)}};Z.TabnasError=gt;function Gt(t,e,n,r,i,s){let o={...s||{},...s.cfg||{},...s.opts||{},...r||{},...r==null?{}:{src:r.src},...i||{},...s.meta||{},...n||{},code:e,details:n,token:r,rule:i,ctx:s};return zt(t,o,{indent:"  "})}function or(t){t.stack&&(t.stack=t.stack.split(`
`).filter(e=>!e.includes("tabnas/tabnas")).map(e=>e.replace(/    at /,"at ")).join(`
`))}function bt(t){let{src:e,sub:n,msg:r,cline:i,row:s,col:o,pos:l}=t;s=s!=null&&0<s?s:1,o=o!=null&&0<o?o:1;let c=i||ue.EMPTY,a=i?"\x1B[0m":ue.EMPTY;l=l!=null&&0<l?l:e==null?0:e.split(`
`).reduce((g,N,b)=>(g+=b<s-1?N.length+1:b===s-1?o:0,g),0);let f=n??ue.EMPTY,d=e.substring(Math.max(0,l-333),l).split(`
`),u=e.substring(l,l+333).split(`
`),h=2+(ue.EMPTY+(s+2)).length,p=s<3?1:s-2,y=g=>c+(ue.EMPTY+p++).padStart(h," ")+" | "+a+(g??ue.EMPTY),m=d.length;return[2<m?y(d[m-3]):null,1<m?y(d[m-2]):null,y(d[m-1]+u[0])," ".repeat(h)+"   "+" ".repeat(o-1)+c+"^".repeat(f.length||1)+" "+r+a,y(u[1]),y(u[2])].filter(g=>g!=null).join(`
`)}function Dt(t){let e={active:!1,reset:"",hi:"",lo:"",line:""};t.color&&t.color.active&&Object.assign(e,t.color);let n={msg:null,hint:null,site:null,...t.txts||{}};return[t.prefix==null?null:typeof t.prefix=="function"?t.prefix(e,t):""+t.prefix,(t.code==null?"":e.hi+"["+(t.name==null?"":t.name+"/")+t.code+"]:")+e.reset+" "+(n.msg==null?"":n.msg),t.row!=null&&t.col!=null||t.file!=null?"  "+e.line+"-->"+e.reset+" "+(t.file==null?"<no-file>":t.file)+(t.row==null||t.col==null?"":":"+t.row+":"+t.col):null,t.src==null||n.site==null?"":bt({src:t.src,sub:t.sub,msg:t.smsg||t.txts?.msg,cline:e.line,row:t.row,col:t.col,pos:t.pos}),"",n.hint==null?"":n.hint,t.suffix==null?null:typeof t.suffix=="function"?t.suffix(e,t):""+t.suffix].filter(i=>i!=null).join(`
`)}function Ht(t,e,n,r,i){try{let s=i.src(),o=i.cfg,l=i.meta,c=Gt({msg:o.error[t]||e?.use?.err&&(e.use.err.code||e.use.err.message)||o.error.unknown,hint:(o.hint[t]||e.use?.err?.message||o.hint.unknown||"").trim().split(`
`).map(u=>"  "+u).join(`
`),site:""},t,e,n,r,i);c.site=bt({src:s,msg:c.msg,cline:o.color.active?o.color.line:"",row:n.rI,col:n.cI,pos:n.sI,sub:n.src});let a=o.errmsg.suffix===!0?u=>["",...o.errmsg.link?["  "+u.lo+o.errmsg.link+u.reset]:[],"  "+u.lo+"--internal: tag="+(i.opts.tag||"")+"; rule="+r.name+"~"+r.state+"; token="+(0,pt.tokenize)(n.tin,i.cfg)+(n.why==null?"":"~"+n.why)+"; plugins="+i.plgn().map(h=>h.name).join(",")+"--"+u.reset].join(`
`):typeof o.errmsg.suffix=="string"||typeof o.errmsg.suffix=="function"?o.errmsg.suffix:void 0,f=Dt({code:t,name:o.errmsg.name,txts:c,src:s,file:l?l.fileName:void 0,row:n.rI,col:n.cI,pos:n.sI,sub:n.src,color:o.color,suffix:a}),d={internal:{token:n,ctx:i}};return d={...Object.create(d),message:f,code:t,details:e,meta:l,fileName:l?l.fileName:void 0,lineNumber:n.rI,columnNumber:n.cI,txts:()=>c},d}catch(s){return console.log(s),{}}}function zt(t,e,n){let r=typeof t,i=Array.isArray(t)?"array":t==null?"string":r==="object"?r:"string",s=i==="object"?t:i==="array"?t.reduce((l,c,a)=>(l[a]=c,l),{}):{_:t},o=e??{};return Object.entries(s).map(l=>s[l[0]]=l[1]==null?"":(""+l[1]).replace(/\{([\w_0-9.]+)}/g,(c,a)=>{let f=Vt(o,a);if(f=f===void 0?c:f,typeof f=="object"){let d=f?.constructor?.name;d==="Object"||d==="Array"?f=JSON.stringify(f).replace(/([^"])"/g,"$1"):f=f.toString()}else f=""+f;return n&&typeof n.indent=="string"&&(f=f.replace(/\n/g,`
`+n.indent)),f})),i==="string"?s._:i==="array"?Object.values(s):s}function Vt(t,e,n){let r=t;try{let i=e.split("."),s;for(let o=0;o<i.length;o++){if(s=i[o],s==="__proto__")throw new Error(s);o<i.length-1&&(t=t[s]=t[s]||{})}if(n!==void 0){if(s==="__proto__")throw new Error(s);t[s]=n}return t[s]}catch{throw new Error("Cannot "+(n===void 0?"get":"set")+" path "+e+" on object: "+Yt(r)+(n===void 0?"":" to value: "+Yt(n,22)))}}function Yt(t,e=44){let n;try{n=typeof t=="object"?JSON.stringify(t):""+t}catch{n=""+t}return lr(e<n.length?n.substring(0,e-3)+"...":n,e)}function lr(t,e=5){return t===void 0?"":(""+t).substring(0,e).replace(/[\r\n\t]/g,".")}});var ae=H(O=>{"use strict";Object.defineProperty(O,"__esModule",{value:!0});O.MATCHER_TOKEN_NAMES=O.values=O.keys=O.omap=O.isarr=O.entries=O.defprop=O.assign=O.S=O.KEY_ORDER=void 0;O.recordKeyOrder=Er;O.keyOrder=Or;O.badlex=hr;O.charset=Te;O.charsBitmap=De;O.clean=He;O.clone=br;O.configure=ar;O.deep=Ve;O.escre=ne;O.filterRules=Ir;O.getpath=wr;O.makelog=mr;O.mesc=fr;O.regexp=Ge;O.snip=Qt;O.srcfmt=Jt;O.tokenize=Me;O.parserwrap=Sr;O.str=gr;O.findTokenSet=ur;O.modlist=vr;O.resolveFuncRefs=kt;O.isMatcherToken=kr;var G=ce(),Zt=xe(),Wt=Ne(),he=t=>t==null?[]:Object.keys(t);O.keys=he;var ze=t=>t==null?[]:Object.values(t);O.values=ze;var de=t=>t==null?[]:Object.entries(t);O.entries=de;var ye=(t,...e)=>Object.assign(t??{},...e);O.assign=ye;var cr=t=>Array.isArray(t);O.isarr=cr;var Xt=Object.defineProperty;O.defprop=Xt;var fe=(t,e)=>Object.entries(t||{}).reduce((n,r)=>{let i=e?e(r):r;i[0]===void 0?delete n[r[0]]:n[i[0]]=i[1];let s=2;for(;i[s]!==void 0;)n[i[s]]=i[s+1],s+=2;return n},{});O.omap=fe;var q={indent:". ",logindent:"  ",space:" ",gap:"  ",Object:"Object",Array:"Array",object:"object",string:"string",function:"function",unexpected:"unexpected",map:"map",list:"list",elem:"elem",pair:"pair",val:"val",node:"node",no_re_flags:G.EMPTY,unprintable:"unprintable",invalid_ascii:"invalid_ascii",invalid_unicode:"invalid_unicode",invalid_lex_state:"invalid_lex_state",unterminated_string:"unterminated_string",unterminated_comment:"unterminated_comment",lex:"lex",parse:"parse",error:"error",none:"none",imp_map:"imp,map",imp_list:"imp,list",imp_null:"imp,null",end:"end",open:"open",close:"close",rule:"rule",stack:"stack",nUll:"null",name:"name",make:"make",colon:":",step:"step"};O.S=q;function ar(t,e,n){let r=e||{};r.t=r.t||{},r.tI=r.tI||1;let i=d=>Me(d,r);n.standard$!==!1&&(i("#BD"),i("#ZZ"),i("#UK"),i("#AA"),i("#SP"),i("#LN"),i("#CM"),i("#NR"),i("#ST"),i("#TX"),i("#VL")),r.safe={key:n.safe?.key!==!1},r.fixed={lex:!!n.fixed?.lex,token:n.fixed?fe(yr(He(n.fixed.token)),([d,u])=>[u,Me(d,r)]):{},ref:void 0,check:n.fixed?.check},r.fixed.ref=fe(r.fixed.token,([d,u])=>[d,u]),r.fixed.ref=Object.assign(r.fixed.ref,fe(r.fixed.ref,([d,u])=>[u,d])),r.match={lex:!!n.match?.lex,value:n.match?fe(He(n.match.value),([d,u])=>[d,u]):{},token:n.match?fe(He(n.match.token),([d,u])=>[Me(d,r),u]):{},check:n.match?.check},fe(r.match.token,([d,u])=>[d,(u.tin$=+d,u)]);let s=n.tokenSet?Object.keys(n.tokenSet).reduce((d,u)=>(d[u]=n.tokenSet[u].filter(h=>h!=null).map(h=>i(h)),d),{}):{};r.tokenSet=r.tokenSet||{},de(s).map(d=>{let u=d[0],h=d[1];r.tokenSet[u]?(r.tokenSet[u].length=0,r.tokenSet[u].push(...h)):r.tokenSet[u]=h}),r.tokenSetTins=de(r.tokenSet).reduce((d,u)=>(d[u[0]]=d[u[0]]||{},u[1].map(h=>d[u[0]][h]=!0),d),{}),r.tokenSetTins.IGNORE=r.tokenSetTins.IGNORE||{},r.space={lex:!!n.space?.lex,chars:Te(n.space?.chars),charsBitmap:De(n.space?.chars),check:n.space?.check},r.line={lex:!!n.line?.lex,chars:Te(n.line?.chars),charsBitmap:De(n.line?.chars),rowChars:Te(n.line?.rowChars),rowCharsBitmap:De(n.line?.rowChars),single:!!n.line?.single,check:n.line?.check},r.text={lex:!!n.text?.lex,modify:(r.text?.modify||[]).concat((n.text?.modify?[n.text.modify]:[]).flat()).filter(d=>d!=null),check:n.text?.check},r.number={lex:!!n.number?.lex,hex:!!n.number?.hex,oct:!!n.number?.oct,bin:!!n.number?.bin,sep:n.number?.sep!=null&&n.number.sep!=="",exclude:n.number?.exclude,sepChar:n.number?.sep,check:n.number?.check},r.value={lex:!!n.value?.lex,def:de(n.value?.def||{}).reduce((d,u)=>(u[1]==null||u[1]===!1||u[1].match||(d[u[0]]=u[1]),d),Object.create(null)),defre:de(n.value?.def||{}).filter(([,d])=>d&&d.match).map(([d,u])=>({name:d,val:u.val,match:u.match,consume:!!u.consume})).sort((d,u)=>d.name<u.name?-1:d.name>u.name?1:0)},r.rule={start:n.rule?.start==null?"val":n.rule.start,maxmul:n.rule?.maxmul==null?3:n.rule.maxmul,finish:!!n.rule?.finish,include:n.rule?.include?n.rule.include.split(/\s*,+\s*/).filter(d=>d!==""):[],exclude:n.rule?.exclude?n.rule.exclude.split(/\s*,+\s*/).filter(d=>d!==""):[]},r.map={extend:!!n.map?.extend,merge:n.map?.merge,child:!!n.map?.child,ordered:!!n.map?.ordered},r.list={property:!!n.list?.property,pair:!!n.list?.pair,child:!!n.list?.child},r.info={map:!!n.info?.map,list:!!n.info?.list,text:!!n.info?.text,marker:n.info?.marker||"__info__"};let l=Object.keys(r.fixed.token).sort((d,u)=>u.length-d.length).map(d=>ne(d)).join("|"),c=n.comment?.lex?(n.comment.def?ze(n.comment.def):[]).filter(d=>d&&d.lex).map(d=>ne(d.start)).join("|"):"",a=["([",ne(he(Te(r.space.lex&&r.space.chars,r.line.lex&&r.line.chars)).join("")),"]",(typeof n.ender=="string"?n.ender.split(""):Array.isArray(n.ender)?n.ender:[]).map(d=>"|"+ne(d)).join(""),l===""?"":"|",l,c===""?"":"|",c,"|$)"];r.rePart={fixed:l,ender:a,commentStart:c},r.re={ender:Ge(null,...a),rowChars:Ge(null,ne(n.line?.rowChars)),columns:Ge(null,"["+ne(n.line?.chars)+"]","(.*)$")},r.lex={empty:!!n.lex?.empty,emptyResult:n.lex?.emptyResult,relex:!!n.lex?.relex,match:n.lex?.match?de(n.lex.match).reduce((d,u)=>{let h=u[0],p=u[1];if(p){let y=p.make(r,n);y&&(y.matcher=h,y.make=p.make,y.order=p.order),d.push(y)}return d},[]).filter(d=>d!=null&&d!==!1&&-1<+d.order).sort((d,u)=>d.order-u.order):[]},r.parse={prepare:ze(n.parse?.prepare)},r.debug={get_console:n.debug?.get_console||(()=>console),maxlen:n.debug?.maxlen==null?99:n.debug.maxlen,print:{config:!!n.debug?.print?.config,src:n.debug?.print?.src}},r.error=n.error??{},r.errmsg=n.errmsg??{suffix:!0},r.hint=n.hint??{},n.config?.modify&&he(n.config.modify).forEach(d=>n.config.modify[d](r,n)),pr(r),r.debug.print.config&&r.debug.get_console().dir(r,{depth:null}),r.result={fail:[]},n.result&&(r.result.fail=[...n.result.fail]),r.rewind={history:n.rewind?.history==null?1/0:n.rewind.history};let f=n.color??{};return r.color=r.color??{},r.color.active=f.active??r.color.active??!0,r.color.reset=f.reset??r.color.reset??"\x1B[0m",r.color.hi=f.hi??r.color.hi??"\x1B[91m",r.color.lo=f.lo??r.color.lo??"\x1B[2m",r.color.line=f.line??r.color.line??"\x1B[34m",ye(t.options,n),ye(t.token,r.t),ye(t.tokenSet,r.tokenSet),ye(t.fixed,r.fixed.ref),r}function Me(t,e,n){let r=e.t,i=r[t];return i==null&&G.STRING===typeof t&&(i=e.tI++,r[i]=t,r[t]=i,r[t.substring(1)]=i,n!=null&&ye(n.token,e.t)),i}function ur(t,e){let n=e.tokenSet;return n[t]??(typeof t=="string"?n[t.replace(/#/g,"")]:void 0)}function fr(t,e){return e=new String(t),e.esc=!0,e}function Ge(t,...e){return new RegExp(e.map(n=>n.esc?ne(n.toString()):n).join(G.EMPTY),t??"")}function ne(t){return t==null?"":t.replace(/[-\\|\]{}()[^$+*?.!=]/g,"\\$&").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function dr(t){let e=t.constructor;return q.function===typeof e&&q.Object!==e.name&&q.Array!==e.name}function Ve(t,...e){let n=q.function===typeof t,r=t!=null&&(q.object===typeof t||n);for(let i of e){let s=q.function===typeof i,o=i!=null&&(q.object===typeof i||s),l;if(r&&o&&!s&&Array.isArray(t)===Array.isArray(i)&&!dr(i))for(let c in i)t[c]=Ve(t[c],i[c]);else t=i===void 0||G.SKIP===i?t:s?i:o?q.function===typeof(l=i.constructor)&&q.Object!==l.name&&q.Array!==l.name?i:Ve(Array.isArray(i)?[]:{},i):i,n=q.function===typeof t,r=t!=null&&(q.object===typeof t||n)}return t}function hr(t,e,n){let r=t.next.bind(t);return t.next=(i,s,o,l)=>{let c=r(i,s,o,l);if(e===c.tin){let a={};throw c.use!=null&&(a.use=c.use),new Wt.TabnasError(c.why||q.unexpected,a,c,i,n)}return c},t}function mr(t,e){let n=t.opts?.plugin?.debug?.trace;if(e||n)if(typeof e?.log=="number"||n){let r=!1,i=e?.log;(i===-1||n)&&(i=1,r=!0),t.log=(...s)=>{if(r){let o=s.filter(l=>q.object!=typeof l).map(l=>q.function==typeof l?l.name:l).join(q.gap);t.cfg.debug.get_console().log(o)}else t.cfg.debug.get_console().dir(s,{depth:i})}}else typeof e.log=="function"&&(t.log=e.log);return t.log}function pr(t){let e=new Array(257);for(let i=0;i<=256;i++)e[i]=[];let n=i=>{for(let s=0;s<=256;s++)e[s].push(i)},r=(i,s)=>{for(let o=0;o<256;o++)s(o)&&e[o].push(i);e[256].push(i)};for(let i of t.lex.match){let s=i.matcher;if(s==="fixed"&&!t.fixed.check){let o={};for(let l of he(t.fixed.token))if(0<l.length){let c=l.charCodeAt(0);c<256&&(o[c]=!0)}r(i,l=>o[l]===!0)}else if(s==="space"&&!t.space.check)r(i,o=>t.space.charsBitmap[o]!==0);else if(s==="line"&&!t.line.check)r(i,o=>t.line.charsBitmap[o]!==0);else if(s==="string"&&!t.string.check)r(i,o=>t.string.quoteBitmap[o]!==0);else if(s==="comment"&&!t.comment.check){let o={};for(let l of ze(t.comment.def||{})){let c=l.start;if(typeof c=="string"&&0<c.length){let a=c.charCodeAt(0);a<256&&(o[a]=!0)}}r(i,l=>o[l]===!0)}else s==="number"&&!t.number.check?r(i,o=>o===43||o===45||o===46||48<=o&&o<=57):n(i)}t.lex.dispatch=e}function Jt(t){return typeof t.debug.print.src=="function"?t.debug.print.src:e=>{let n=e==null?G.EMPTY:Array.isArray(e)?JSON.stringify(e).replace(/]$/,de(e).filter(r=>isNaN(r[0])).map((r,i)=>(i===0?", ":"")+r[0]+": "+JSON.stringify(r[1]))+"]"):JSON.stringify(e);return n=n.substring(0,t.debug.maxlen)+(t.debug.maxlen<n.length?"...":G.EMPTY),n}}function gr(t,e=44){let n;try{n=typeof t=="object"?JSON.stringify(t):""+t}catch{n=""+t}return Qt(e<n.length?n.substring(0,e-3)+"...":n,e)}function Qt(t,e=5){return t===void 0?"":(""+t).substring(0,e).replace(/[\r\n\t]/g,".")}function br(t){let e=Object.create(Object.getPrototypeOf(t));for(let n in t)e[n]=Ve(void 0,t[n]);return e}function Te(...t){return t==null?{}:t.filter(e=>e!==!1).map(e=>typeof e=="object"?he(e).join(G.EMPTY):e).join(G.EMPTY).split(G.EMPTY).reduce((e,n)=>(e[n]=n.charCodeAt(0),e),{})}function De(...t){let e=new Uint8Array(256);for(let n of t){if(n==null||n===!1)continue;let r=typeof n=="string"?n:he(n).join(G.EMPTY);for(let i=0;i<r.length;i++){let s=r.charCodeAt(i);s<256&&(e[s]=1)}}return e}var yt=new Set(["#BD","#ZZ","#UK","#AA","#SP","#LN","#CM","#NR","#ST","#TX","#VL"]);O.MATCHER_TOKEN_NAMES=yt;function kr(t){return yt.has(t)}function yr(t){if(t==null)return t;for(let e of he(t))if(yt.has(e))throw new Error(`Tabnas: ${e} is produced by a lexer matcher and cannot be bound to the fixed literal ${JSON.stringify(t[e])}. Doing so adds a second producer for the same token rather than replacing the matcher, and values silently vanish. Configure the matcher instead (options.number, options.string, options.text, options.value, options.space, options.line, options.comment), or use a token name of your own. Fixed punctuation tokens (#OB #CB #OS #CS #CL #CA) may be rebound freely.`);return t}function He(t){for(let e in t)t[e]==null&&delete t[e];return t}function Ir(t,e){let n={...t.def},r=["open","close"];for(let s of r)n[s]=t.def[s].map(o=>({...o,g:typeof o.g=="string"?(o.g||"").split(/\s*,+\s*/):o.g||[]})).filter(o=>e.rule.include.reduce((l,c)=>l||o.g!=null&&o.g.indexOf(c)!==-1,e.rule.include.length===0)).filter(o=>e.rule.exclude.reduce((l,c)=>l&&(o.g==null||o.g.indexOf(c)===-1),!0));let i=Object.create(Object.getPrototypeOf(t));return Object.assign(i,t),i.def=n,i}function vr(t,e){if(e&&t){if(0<t.length){if(e.delete&&0<e.delete.length)for(let r=0;r<e.delete.length;r++){let i=e.delete[r];if(i<0?-1*i<=t.length:i<t.length){let s=(t.length+i)%t.length;t[s]=null}}if(e.move)for(let r=0;r<e.move.length;r+=2){let i=(t.length+e.move[r])%t.length,s=(t.length+e.move[r+1])%t.length,o=t[i];t.splice(i,1),t.splice(s,0,o)}let n=t.filter(r=>r!=null);n.length!==t.length&&(t.length=0,t.push(...n))}if(e.custom){let n=e.custom(t);n!=null&&(t=n)}}return t}function Sr(t){return{start:function(e,n,r,i){try{return t.start(e,n,r,i)}catch(s){if(s.name==="SyntaxError"){let o=0,l=0,c=0,a=G.EMPTY,f=s.message.match(/^Unexpected token (.) .*position\s+(\d+)/i);if(f){a=f[1],o=parseInt(f[2]),l=e.substring(0,o).replace(/[^\n]/g,G.EMPTY).length;let u=o-1;for(;-1<u&&e.charAt(u)!==`
`;)u--;c=Math.max(e.substring(u,o).length,0)}let d=s.token||(0,Zt.makeToken)("#UK",Me("#UK",n.internal().config),void 0,a,(0,Zt.makePoint)(a.length,o,s.lineNumber||l,s.columnNumber||c));throw new Wt.TabnasError(s.code||"json",s.details||{msg:s.message},d,{},s.ctx||{uI:-1,opts:n.options,cfg:n.internal().config,token:d,meta:r,src:()=>e,root:()=>{},plgn:()=>n.internal().plugins,inst:()=>n,rule:{name:"no-rule"},sub:{},xs:-1,v2:d,v1:d,t:[d,d],tC:-1,kI:-1,rs:[],rsI:0,rsm:{},n:{},log:r?r.log:void 0,F:Jt(n.internal().config),u:{},NORULE:{name:"no-rule"},NOTOKEN:{name:"no-token"}})}else throw s}}}}function wr(t,e){e=typeof e=="string"?e.split("."):e;let n=t;for(let r=0;r<e.length&&n!=null;r++)n=n[e[r]];return n}function kt(t,e){if(t==null||typeof t!="object"){if(typeof t=="string"&&t[0]==="@"){if(t[1]==="@")return t.substring(1);if(t.substring(1)==="SKIP")return G.SKIP;let i=t.match(/^@\/(.*)\/([\w]*)$/);if(i)return new RegExp(i[1],i[2]);let s=t.match(/^@~\/(.*)\/([\w]*)$/);if(s){let o=new RegExp(s[1],s[2]);return o.eager$=!0,o}if(e){let o=e[t];if(typeof o=="function")return o}}return t}if(Array.isArray(t))return t.map(i=>kt(i,e));let n=t.constructor;if(n&&n.name!=="Object")return t;let r={};for(let i of Object.keys(t))r[i]=kt(t[i],e);return r}var Ze=Symbol.for("tabnas.keyOrder");O.KEY_ORDER=Ze;function Er(t,e){let n=t[Ze];n===void 0&&(n=[],Xt(t,Ze,{value:n,enumerable:!1,writable:!0,configurable:!0})),n.push(""+e)}function Or(t){if(t!=null&&typeof t=="object"){let e=t[Ze];return e!==void 0?e.slice():Object.keys(t)}return[]}});var tn=H(Ie=>{"use strict";Object.defineProperty(Ie,"__esModule",{value:!0});Ie.BUILTIN_REFS=Ie.BUILTIN_SCHEMA_VERSION=void 0;var xr=ae();Ie.BUILTIN_SCHEMA_VERSION=3;var Nr=Object.defineProperty;function It(t,e,n){t!=null&&typeof t=="object"&&Nr(t,e,{value:n,writable:!0})}function en(t,e){return e==="user"?{rule:t,src:"",kids:[]}:{src:"",kids:[]}}var Tr=(t,e,n)=>{let r=n&&n.k&&n.k.node$||{};r.init&&(t.node=en(r.rule,r.kind));let i=t.node,s=r.nterms||0;for(let o=0;o<s;o++)i.src+=t.o[o].src},Mr=(t,e,n)=>{let r=n&&n.k&&n.k.capture$||{};t.node==null&&(t.node=en(r.rule,r.kind));let i=t.node,s=t.child&&t.child.node;if(s!=null){if(typeof s!="object"||!("src"in s)){i.kids.push(s);return}s!==i&&(i.src+=s.src,s.rule?i.kids.push(s):Array.isArray(s.kids)&&i.kids.push(...s.kids))}},_r=t=>{t.child&&t.child.node!==void 0&&(t.node=t.child.node)},Cr=(t,e,n)=>{let r=n&&n.k&&n.k.fold$||{},i=t.parent&&t.parent.node;if(i==null||typeof i!="object"||!("src"in i))return;let s=t.node;s!=null&&typeof s=="object"&&"src"in s&&s!==i&&(i.src+=s.src,s.rule?i.kids.push(s):Array.isArray(s.kids)&&i.kids.push(...s.kids));let o=r.cN||0;for(let l=0;l<o;l++)i.src+=t.c[l].src;t.node=void 0},Pr=(t,e)=>{t.k.pd_phase=0,t.k.pd_mark=e.mark()},Ar=(t,e)=>{if(t.k.pd_mark==null)throw new Error("@probeDecide$: no pd_mark — phase-0 @probeInit$ did not run");let n=e.t[0];e.rewind(t.k.pd_mark),t.k.pd_phase=n&&n.name===t.k.pd_d?1:2},Rr=t=>!t.k.pd_phase,jr=t=>t.k.pd_phase===1,$r=t=>t.k.pd_phase===2,Lr=(t,e,n)=>{let r=Object.create(null);if(t.node=r,e.cfg.info.map){let i=n&&n.k&&n.k.object$||{};It(r,e.cfg.info.marker,{implicit:!!i.implicit,meta:{}})}},Br=(t,e,n)=>{let r=[];if(t.node=r,e.cfg.info.list){let i=n&&n.k&&n.k.array$||{};It(r,e.cfg.info.marker,{implicit:!!i.implicit,meta:{}})}},qr=t=>{t.node=void 0},Fr=(t,e,n)=>{let r=n&&n.k&&n.k.key$||{};t.u[r.slot||"key"]=t.o[r.from||0]?.val},Kr=(t,e,n)=>{let r=n&&n.k&&n.k.setval$||{},i=t.node;if(i!=null&&typeof i=="object"){let s=t.u[r.slot||"key"];if(e.cfg.info.map&&s===e.cfg.info.marker)return;e.cfg.map&&e.cfg.map.ordered&&!(s in i)&&(0,xr.recordKeyOrder)(i,s),i[s]=t.child.node}},Ur=t=>{t.child.node!==void 0&&Array.isArray(t.node)&&t.node.push(t.child.node)},Yr=(t,e,n)=>{if(t.child.node!==void 0){t.node=t.child.node;return}let r=n&&n.k&&n.k.value$||{},i=t.o[r.from||0],s=i?i.resolveVal(t,e):void 0,o=e.cfg.info;if(o.text&&typeof s=="string"&&i&&(i.tin===e.cfg.t.ST||i.tin===e.cfg.t.TX)){let l=i.tin===e.cfg.t.ST&&i.src.length>0?i.src[0]:"",c=new String(s);It(c,o.marker,{quote:l}),s=c}t.node=s};Ie.BUILTIN_REFS=Object.freeze({"@node$":Tr,"@capture$":Mr,"@bubble$":_r,"@fold$":Cr,"@probeInit$":Pr,"@probeDecide$":Ar,"@probePhase0$":Rr,"@probePhase1$":jr,"@probePhase2$":$r,"@object$":Lr,"@array$":Br,"@reset$":qr,"@key$":Fr,"@setval$":Kr,"@push$":Ur,"@value$":Yr})});var vt=H(We=>{"use strict";Object.defineProperty(We,"__esModule",{value:!0});We.defaults=void 0;var re=xe(),Gr={safe:{key:!0},tag:"-",fixed:{lex:!0,token:{"#OB":"{","#CB":"}","#OS":"[","#CS":"]","#CL":":","#CA":","}},match:{lex:!0,token:{}},tokenSet:{IGNORE:["#SP","#LN","#CM"],VAL:["#TX","#NR","#ST","#VL"],KEY:["#TX","#NR","#ST","#VL"]},space:{lex:!0,chars:" 	"},line:{lex:!0,chars:`\r
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
Unexpected end of source.`},lex:{match:{match:{order:1e6,make:re.makeMatchMatcher},fixed:{order:2e6,make:re.makeFixedMatcher},space:{order:3e6,make:re.makeSpaceMatcher},line:{order:4e6,make:re.makeLineMatcher},string:{order:5e6,make:re.makeStringMatcher},comment:{order:6e6,make:re.makeCommentMatcher},number:{order:7e6,make:re.makeNumberMatcher},text:{order:8e6,make:re.makeTextMatcher}},empty:!0,emptyResult:void 0,relex:!1},parse:{prepare:{}},rule:{start:"val",finish:!0,maxmul:3,include:"",exclude:""},result:{fail:[]},rewind:{history:64},config:{modify:{}},parser:{start:void 0}};We.defaults=Gr});var nn=H(Xe=>{"use strict";Object.defineProperty(Xe,"__esModule",{value:!0});Xe.Context=void 0;var St=class{constructor(e){this.uI=0,this.xs=-1,this.v=[],this.vAbs=0,this.tC=-2,this.kI=-1,this.rs=[],this.rsI=0,this.u={},this.opts=e.opts,this.cfg=e.cfg,this.meta=e.meta,this.src=e.src,this.root=e.root,this.plgn=e.plgn,this.inst=e.inst,this.sub=e.sub,this.rsm=e.rsm,this.F=e.F,this.NOTOKEN=e.NOTOKEN,this.NORULE=e.NORULE,this.rule=e.NORULE,this.t=[e.NOTOKEN,e.NOTOKEN]}get t0(){return this.t[0]??this.NOTOKEN}set t0(e){this.t[0]=e}get t1(){return this.t[1]??this.NOTOKEN}set t1(e){this.t[1]=e}get v1(){return this.v[this.v.length-1]??this.NOTOKEN}set v1(e){0<this.v.length?this.v[this.v.length-1]=e:this.v.push(e)}get v2(){return this.v[this.v.length-2]??this.NOTOKEN}set v2(e){let n=this.v.length;1<n?this.v[n-2]=e:n===1?this.v.unshift(e):this.v.push(e)}mark(){return this.vAbs}rewind(e){let n=this.vAbs-e;if(n<=0)return;if(n>this.v.length)throw new Error(`tabnas: ctx.rewind target ${e} is outside the retained history window (oldest mark available is ${this.vAbs-this.v.length}, current is ${this.vAbs}); increase options.rewind.history.`);let r=this.lex.pnt.token,i=this.NOTOKEN,s=[];for(let o=0;o<this.t.length;o++){let l=this.t[o];l&&l!==i&&s.push(l),this.t[o]=i}for(let o=s.length-1;o>=0;o--)r.unshift(s[o]);for(let o=0;o<n;o++)r.unshift(this.v.pop());this.vAbs-=n,this.lex.pnt.end=void 0}};Xe.Context=St});var Ot=H(F=>{"use strict";Object.defineProperty(F,"__esModule",{value:!0});F.makeRuleSpec=F.makeNoRule=F.makeRule=F.AltMatch=F.RuleSpec=F.Rule=void 0;F.validateAlt=un;F.validateAlts=Wr;var R=ce(),D=ae(),wt=Ne(),Je=class{#e;#t;#n;get n(){return this.#e??=Object.create(null)}set n(e){this.#e=e}get u(){return this.#t??=Object.create(null)}set u(e){this.#t=e}get k(){return this.#n??=Object.create(null)}set k(e){this.#n=e}rawn(){return this.#e}rawu(){return this.#t}rawk(){return this.#n}constructor(e,n,r){this.i=-1,this.name=R.EMPTY,this.node=null,this.state=R.OPEN,this.d=-1,this.bo=!1,this.ao=!1,this.bc=!1,this.ac=!1,this.oN=0,this.cN=0,this.need=0,this.i=n.uI++,this.name=e.name,this.spec=e,this.child=n.NORULE,this.parent=n.NORULE,this.prev=n.NORULE,this.next=n.NORULE,this._NOTOKEN=n.NOTOKEN,this.o=[],this.c=[],this.node=r,this.d=n.rsI,this.bo=e.def.bo!=null,this.ao=e.def.ao!=null,this.bc=e.def.bc!=null,this.ac=e.def.ac!=null}get o0(){return this.o[0]??this._NOTOKEN}set o0(e){this.o[0]=e}get o1(){return this.o[1]??this._NOTOKEN}set o1(e){this.o[1]=e}get c0(){return this.c[0]??this._NOTOKEN}set c0(e){this.c[0]=e}get c1(){return this.c[1]??this._NOTOKEN}set c1(e){this.c[1]=e}get os(){return this.oN}set os(e){this.oN=e}get cs(){return this.cN}set cs(e){this.cN=e}process(e,n){return this.spec.process(this,e,n,this.state)}eq(e,n=0){return(this.#e?.[e]??0)===n}lt(e,n=0){return(this.#e?.[e]??0)<n}gt(e,n=0){return(this.#e?.[e]??0)>n}lte(e,n=0){return(this.#e?.[e]??0)<=n}gte(e,n=0){return(this.#e?.[e]??0)>=n}exist(e){return this.#e?.[e]!=null}toString(){return"[Rule "+this.name+"~"+this.i+"]"}};F.Rule=Je;var Qe=(...t)=>new Je(...t);F.makeRule=Qe;var Dr=(t,e)=>Qe(an(t,e.cfg,{}),e);F.makeNoRule=Dr;var et=class{constructor(){this.p=R.EMPTY,this.r=R.EMPTY,this.b=0}};F.AltMatch=et;var cn=(...t)=>new et(...t),Hr=cn(),tt=class{constructor(e,n,r){this.name=R.EMPTY,this.def={open:[],close:[],bo:[],bc:[],ao:[],ac:[],tcol:[],fnref:{}},this.ji=e,this.cfg=n,this.def=Object.assign(this.def,r),this.def.open=(this.def.open||[]).filter(s=>s!=null),this.def.close=(this.def.close||[]).filter(s=>s!=null);for(let s of this.def.open)_e(s,R.OPEN,this);for(let s of this.def.close)_e(s,R.CLOSE,this);let i=["bo","ao","bc","ac"];for(let s of i)for(let o of this.def[s]??[])if(typeof o=="object"){let l=o;this[s](l.append,l.action)}}tin(e){return(0,D.tokenize)(e,this.cfg)}fnref(e){Object.assign(this.def.fnref,e);let n=this.name,r=this.def.fnref,i=this.def.fnrefInstalled=this.def.fnrefInstalled||new Map,s=this.def.fnrefReplaced=this.def.fnrefReplaced||new Set,o=[`@${n}-bo`,`@${n}-ao`,`@${n}-bc`,`@${n}-ac`];for(let l of o){let c=i.get(l);c||i.set(l,c=new WeakSet);let a=l.replace(/^[^-]+-/,""),f=r[l+"/replace"];if(f){s.has(l)||(s.add(l),this.def[a].length=0,c=new WeakSet,i.set(l,c),c.add(f),this[a](!0,f));continue}if(s.has(l))continue;let d=r[l+"/prepend"],u=r[l+"/append"]??r[l];d&&!c.has(d)&&(c.add(d),this[a](!1,d)),u&&!c.has(u)&&(c.add(u),this[a](!0,u))}return this}add(e,n,r){let i=r?.append?"push":"unshift",s=((0,D.isarr)(n)?n:[n]).filter(c=>c!=null&&typeof c=="object").map(c=>_e(c,e,this)),o=e==="o"?"open":"close",l=this.def[o];return r?.clear&&(l.length=0),l[i](...s),l=this.def[o]=(0,D.modlist)(l,r),this.norm(),this}open(e,n){return this.add("o",e,n)}close(e,n){return this.add("c",e,n)}action(e,n,r,i){let s=this.def[n+r];return e?s.push(i):s.unshift(i),this}bo(e,n){return this.action(n?!!e:!0,R.BEFORE,R.OPEN,typeof e=="string"?this.def.fnref[e]:n??e)}ao(e,n){return this.action(n?!!e:!0,R.AFTER,R.OPEN,typeof e=="string"?this.def.fnref[e]:n??e)}bc(e,n){return this.action(n?!!e:!0,R.BEFORE,R.CLOSE,typeof e=="string"?this.def.fnref[e]:n??e)}ac(e,n){return this.action(n?!!e:!0,R.AFTER,R.CLOSE,typeof e=="string"?this.def.fnref[e]:n??e)}clear(){return this.def.open.length=0,this.def.close.length=0,this.def.bo.length=0,this.def.ao.length=0,this.def.bc.length=0,this.def.ac.length=0,this}clearOpen(){return this.def.open.length=0,this}clearClose(){return this.def.close.length=0,this}clearActions(...e){let n=0<e.length?e:["bo","ao","bc","ac"],r=this.def.fnrefInstalled,i=this.def.fnrefReplaced;for(let s of n){this.def[s].length=0;let o=`@${this.name}-${s}`;r&&r.delete(o),i&&i.delete(o)}return this}norm(){this.def.open.map(o=>_e(o,R.OPEN,this)),this.def.close.map(o=>_e(o,R.CLOSE,this));let e=[],n=o=>o.reduce((l,c)=>Math.max(l,c.sN||0),0),r=n(this.def.open),i=n(this.def.close);for(let o=0;o<r;o++)this.def.open.reduce(...s(0,o,e));for(let o=0;o<i;o++)this.def.close.reduce(...s(1,o,e));e[0]=e[0]||[],e[1]=e[1]||[];for(let o=0;o<r;o++)e[0][o]=e[0][o]||[];for(let o=0;o<i;o++)e[1][o]=e[1][o]||[];this.def.tcol=e;function s(o,l,c){c[o]=c[o]||[];let a=c[o][l]=c[o][l]||[];return[function(f,d){let u=d.t&&d.t[l];if(u&&0<u.length){let h=[...new Set(f.concat(u))];f.length=0,f.push(...h)}return f},a]}return this}process(e,n,r,i){n.log&&n.log(D.S.rule,n,e,r);let s=i==="o",o=s?e:n.NORULE,l=s?"O":"C",c=this.def,a=n.log!=null,f=s?c.open:c.close,d=s?e.bo?c.bo:null:e.bc?c.bc:null;if(d){let m;for(let k=0;k<d.length;k++)if(m=d[k].call(this,e,n,o,m),m?.isToken&&m?.err)return this.bad(m,e,n,{is_open:s})}let u=0<f.length?zr(s,f,r,e,n):Hr;if(u.h&&(u=u.h(e,n,u,o)||u,a&&(l+="H")),u.e)return this.bad(u.e,e,n,{is_open:s});if(u.n){let m=e.n;for(let k in u.n)m[k]=u.n[k]===0?0:(m[k]==null?0:m[k])+u.n[k]}u.u&&(e.u=Object.assign(e.u,u.u)),u.k&&(e.k=Object.assign(e.k,u.k));let h=e[s?"oN":"cN"]-(u.b||0);if(0<h){let m=n.NOTOKEN;for(let g=0;g<h;g++)n.v.push(n.t[g]),n.t[g]=m;n.vAbs+=h;let k=n.cfg.rewind.history;k!==1/0&&n.v.length>2*k&&n.v.splice(0,n.v.length-k)}if(u.a){a&&(l+="A");let m=u.a(e,n,u);if(m&&m.isToken&&m.err)return this.bad(m,e,n,{is_open:s})}if(u.p){n.rs[n.rsI++]=e;let m=n.rsm[u.p];if(m){o=e.child=Qe(m,n,e.node),o.parent=e;let k=e.rawn();if(k!==void 0){let N;for(let b in k)(N??=o.n)[b]=k[b]}let g=e.rawk();if(g!==void 0){let N;for(let b in g)(N??=o.k)[b]=g[b]}a&&(l+="P`"+u.p+"`")}else return this.bad(this.unknownRule(n.t0,u.p),e,n,{is_open:s})}else if(u.r){let m=n.rsm[u.r];if(m){o=Qe(m,n,e.node),o.parent=e.parent,o.prev=e;let k=e.rawn();if(k!==void 0){let N;for(let b in k)(N??=o.n)[b]=k[b]}let g=e.rawk();if(g!==void 0){let N;for(let b in g)(N??=o.k)[b]=g[b]}a&&(l+="R`"+u.r+"`")}else return this.bad(this.unknownRule(n.t0,u.r),e,n,{is_open:s})}else s||(o=n.rs[--n.rsI]||n.NORULE);e.next=o;let p=s?e.ao?c.ao:null:e.ac?c.ac:null;if(p){let m;for(let k=0;k<p.length;k++)if(m=p[k](e,n,o,m),m?.isToken&&m?.err)return this.bad(m,e,n,{is_open:s})}o.why=l,n.log&&n.log(D.S.node,n,e,r,o),R.OPEN===e.state&&(e.state=R.CLOSE);let y=e[s?"oN":"cN"]-(u.b||0);if(y<0&&(y=0),0<y){let m=n.t.length;for(let k=0;k<m-y;k++)n.t[k]=n.t[k+y];for(let k=Math.max(0,m-y);k<m;k++)n.t[k]=n.NOTOKEN}return o}bad(e,n,r,i){throw new wt.TabnasError(e.err||D.S.unexpected,{...e.use,state:i.is_open?D.S.open:D.S.close},e,n,r)}unknownRule(e,n){return e.err="unknown_rule",e.use=e.use||{},e.use.rulename=n,e}};F.RuleSpec=tt;var an=(...t)=>new tt(...t);F.makeRuleSpec=an;function zr(t,e,n,r,i){let s=i._palt||(i._palt=cn());s.b=0,s.p=R.EMPTY,s.r=R.EMPTY,s.n=void 0,s.h=void 0,s.a=void 0,s.u=void 0,s.k=void 0,s.e=void 0;let o=null,l=0,c=i.cfg.t,a=!0,f=1<<c.AA-1,d=i.cfg.tokenSetTins.IGNORE,u=c.BD,h=D.S.unexpected,p=e.length,y=i.NOTOKEN,m=i.t,k=i.cfg.lex.relex,g=-1,N=y,b=0,A=0,_=0,M=null,x;for(l=0;l<p;l++){o=e[l];let j=0;a=!0,g=-1;let I=o.S,Ee=o.sN|0;for(let S=0;S<Ee;S++){let C=m[S];if(C==null||y===C){do if(C=n.next(r,o,l,S),i.tC++,u===C.tin&&!k){let U={};throw C.use!=null&&(U.use=C.use),new wt.TabnasError(C.why||h,U,C,r,i)}while(d[C.tin]);m[S]=C}let J=I?I[S]:null,le=u===C.tin;if(le||J!=null){let U=!1;if(!le&&J!=null){let V=C.tin,P=V/31|0,be=P===0?f:0;U=(J[P]&(1<<V%31-1|be))!==0}if(!U){let V;if(k&&0<C.len){let P=o.t[S];P!=null&&0<P.length&&(V=n.relex(C,P,r))}if(V==null){a=!1;break}if(g===-1){let P=n.relexUndo;g=S,N=C,b=P.sI,A=P.rI,_=P.cI,M=P.token,x=P.end}m[S]=V;for(let P=S+1;P<m.length;P++)m[P]=y}}j=S+1}if(a){if(t){r.oN=j;for(let S=0;S<j;S++)r.o[S]=m[S];for(let S=j;S<r.o.length;S++)r.o[S]=y}else{r.cN=j;for(let S=0;S<j;S++)r.c[S]=m[S];for(let S=j;S<r.c.length;S++)r.c[S]=y}o.c&&(a=o.c(r,i,s))}if(a)break;if(o=null,g!==-1){n.unrelex(b,A,_,M,x),m[g]=N;for(let S=g+1;S<m.length;S++)m[S]=y;g=-1}}if(!a){let j=m[0];if(k&&j!=null&&u===j.tin){let I={};throw j.use!=null&&(I.use=j.use),new wt.TabnasError(j.why||h,I,j,r,i)}s.e=m[0]??y}o&&(s.n=o.n!=null?o.n:s.n,s.h=o.h!=null?o.h:s.h,s.a=o.a!=null?o.a:s.a,s.u=o.u!=null?o.u:s.u,s.k=o.k!=null?o.k:s.k,s.g=o.g!=null?o.g:s.g,s.e=o.e&&o.e(r,i,s)||void 0,s.p=o.p!=null&&o.p!==!1?typeof o.p=="string"?o.p:o.p(r,i,s):s.p,s.r=o.r!=null&&o.r!==!1?typeof o.r=="string"?o.r:o.r(r,i,s):s.r,s.b=o.b!=null&&o.b!==!1?typeof o.b=="number"?o.b:o.b(r,i,s):s.b);let B=l<e.length;return i.log&&i.log(D.S.parse,i,r,n,B,a,l,o,s),s}var Vr=(t,e)=>t.filter(n=>31*e<=n&&n<31*(e+1)),Zr=(t,e)=>t.reduce((n,r)=>1<<r-(31*e+1)|n,0),Et=/^[a-z][a-z0-9-]+$/;function _e(t,e,n){R.STRING===typeof t.g?t.g=t.g.split(/\s*,\s*/):t.g==null&&(t.g=[]);for(let i of t.g)if(!Et.test(i))throw new Error(`Grammar: invalid group tag "${i}" in rule ${n.name} (${e}) — must match ${Et}`);t.g=t.g.sort();let r=t;if(!t.s||t.s.length===0)t.s=null,r.t=[],r.S=null,r.sN=0;else{let i=c=>c.flat().map(f=>typeof f=="string"?f.split(/\s* +\s*/):f).flat().map(f=>typeof f=="string"?n.ji.tokenSet(f)??n.ji.token(f):f).flat().filter(f=>typeof f=="number");typeof t.s=="string"&&(t.s=t.s.split(/\s* +\s*/));let s=t.s.length,o=new Array(s),l=new Array(s);for(let c=0;c<s;c++){let a=i([t.s[c]]);o[c]=a;let f=n.ji.token("#AA");if(f!=null&&a.includes(f)){l[c]=null;continue}l[c]=0<a.length?new Array(Math.max(...a.map(d=>1+d/31|0))).fill(null).map((d,u)=>u).map(d=>Zr(Vr(a,d),d)):null}r.t=o,r.S=l,r.sN=s}if(t.p?me("push",e,n,t,"p"):t.p=null,t.r?me("replace",e,n,t,"r"):t.r=null,t.b?me("back",e,n,t,"b"):t.b=null,t.a?me("action",e,n,t,"a"):t.a=null,t.h?me("modify",e,n,t,"h"):t.h=null,t.e?me("error",e,n,t,"e"):t.e=null,!t.c)t.c=null;else{let i=typeof t.c;if(i==="string")me("condition",e,n,t,"c");else if(i==="function")t.c.name==="c"&&(0,D.defprop)(t.c,"name",{value:"ruleCond"});else if(i==="object"){let s=t.c,o=[],l=Object.keys(t.c);for(let c of l){let a=s[c];if(a!=null){let f=fn(c,a);if(0<f.length){let d=(n?.name??"?")+"."+(R.OPEN===e?"open":"close");throw new Error("tabnas: "+d+": "+f.join("; "))}if(typeof a=="object")for(let d of Object.keys(a))o.push(ln(d,c,a[d]));else o.push(ln("$eq",c,a))}}o.length===0?delete t.c:o.length===1?t.c=o[0]:t.c=function(a,f,d){for(let u of o)if(u(a,f,d)==!1)return!1;return!0}}else throw new Error("Grammar: invalid condition: "+t.c)}return t}function rn(t){return typeof t=="string"&&t.startsWith("@")}function me(t,e,n,r,i){let s=r[i];if(i==="a"&&Array.isArray(s)){if(s.length===0){r[i]=null;return}let o=s.map(l=>{if(rn(l)){let c=n.def.fnref[l];if(c==null)throw new Error(`Grammar: unknown ${t} function reference: `+l+` for rule ${n.name} (${e}) and alt ${r.s} (${r.g})`);return c}return l});r[i]=function(c,a,f){let d;for(let u of o)if(d=u(c,a,f),d&&d.isToken&&d.err)return d;return d};return}if(rn(s)){let o=n.def.fnref[s];if(o==null)throw new Error(`Grammar: unknown ${t} function reference: `+s+` for rule ${n.name} (${e}) and alt ${r.s} (${r.g})`);r[i]=o}}var sn={$eq:1,$ne:1,$lt:1,$lte:1,$gt:1,$gte:1,$exist:1},on={n:1,u:1,k:1,d:1,i:1,name:1,state:1,node:1,need:1,oN:1,cN:1,o:1,c:1,o0:1,o1:1,c0:1,c1:1,parent:1,child:1,prev:1,next:1,spec:1};function un(t){let e=[];if(t==null||typeof t!="object")return e;if(t.c!=null&&typeof t.c=="object"&&typeof t.c!="function")for(let n of Object.keys(t.c)){let r=t.c[n];r!=null&&e.push(...fn(n,r))}if(t.g!=null){let n=typeof t.g=="string"?t.g.split(","):t.g;if(Array.isArray(n))for(let r of n)typeof r=="string"&&!Et.test(r.trim())&&e.push('invalid group tag: "'+r+'"')}return e}function Wr(t,e=""){let n=[],r=e?e+" ":"";if(!Array.isArray(t))return n;for(let i=0;i<t.length;i++)for(let s of un(t[i]))n.push(r+"alt["+i+"]: "+s);return n}function fn(t,e){let n=[],r=t.split(".")[0];if(on[r]!==1&&n.push('unknown condition path: "'+t+'" (no rule property "'+r+'"); known roots: '+Object.keys(on).join(", ")),e!=null&&typeof e=="object")for(let i of Object.keys(e))sn[i]!==1&&n.push("unknown condition operator: "+i+' (on "'+t+'"); known operators: '+Object.keys(sn).join(", "));return n}function ln(t,e,n){let r=e.split("."),i=r[0]==="n"&&r.length===2&&typeof n=="number",s=o=>{let l=(0,D.getpath)(o,r);return l==null&&i?0:l};if(t==="$eq")return function(l,c,a){return s(l)===n};if(t==="$ne")return function(l,c,a){return s(l)!=n};if(t==="$lt")return function(l,c,a){let f=s(l);return f==null||f<n};if(t==="$lte")return function(l,c,a){let f=s(l);return f==null||f<=n};if(t==="$gt")return function(l,c,a){let f=s(l);return f==null||f>n};if(t==="$gte")return function(l,c,a){let f=s(l);return f==null||f>=n};if(t==="$exist")return function(l,c,a){let f=(0,D.getpath)(l,r);return n===!0?f!=null:f==null};throw new Error("Grammer: unknown comparison operator: "+t)}});var dn=H(W=>{"use strict";Object.defineProperty(W,"__esModule",{value:!0});W.makeParser=W.makeRuleSpec=W.makeRule=W.Parser=void 0;var Xr=ce(),Jr=nn(),Y=ae(),ve=Ne(),nt=xe(),Se=Ot();Object.defineProperty(W,"makeRule",{enumerable:!0,get:function(){return Se.makeRule}});Object.defineProperty(W,"makeRuleSpec",{enumerable:!0,get:function(){return Se.makeRuleSpec}});var rt=class t{#e;#t;constructor(e,n,r){this.rsm={},this.options=e,this.cfg=n,this.ji=r}rule(e,n){if(e==null)return this.rsm;let r=this.rsm[e];if(n===null)delete this.rsm[e];else if(n!==void 0){r=this.rsm[e]=this.rsm[e]||(0,Se.makeRuleSpec)(this.ji,this.cfg,{}),r.name=e,r=this.rsm[e]=n(this.rsm[e],this)||this.rsm[e];return}return r}start(e,n,r,i){let s,o=(0,nt.makeToken)("#ZZ",(0,Y.tokenize)("#ZZ",this.cfg),void 0,Xr.EMPTY,(0,nt.makePoint)(-1)),l=(0,Y.tokenize)("#BD",this.cfg),c=(0,nt.makeNoToken)(),a=new Jr.Context({opts:this.options,cfg:this.cfg,meta:r||{},src:()=>e,root:()=>s,plgn:()=>n.internal().plugins,inst:()=>n,sub:n.internal().sub,rsm:this.rsm,F:this.#t??=(0,Y.srcfmt)(this.cfg),NOTOKEN:c,NORULE:{}});i!=null&&(0,Y.deep)(a,i);let f=(0,Se.makeRule)(this.#e??=(0,Se.makeRuleSpec)(this.ji,this.cfg,{}),a);if(a.NORULE=f,a.rule=f,r&&Y.S.function===typeof r.log&&(a.log=r.log),this.cfg.parse.prepare.forEach(b=>b(n,a,r)),e===""){if(this.cfg.lex.empty)return this.cfg.lex.emptyResult;throw new ve.TabnasError(Y.S.unexpected,{src:e},a.t0,f,a)}let d=(0,nt.makeLex)(a);a.lex=d;let u=this.rsm[this.cfg.rule.start];if(u==null)return;let h=(0,Se.makeRule)(u,a);s=h;let p=0;for(let b in this.rsm)p++;let y=2*p*d.src.length*2*a.cfg.rule.maxmul,m=0;for(;f!==h&&m<y;)a.kI=m,a.rule=h,a.log&&a.log(Y.S.step,a.kI+":"),a.sub.rule&&a.sub.rule.map(b=>b(h,a)),h=h.process(a,d),a.log&&a.log(Y.S.stack,a,h,d),m++;let k=a.t[0];if(k!=null&&c.tin!==k.tin&&o.tin!==k.tin){if(l===k.tin){let b={};throw k.use!=null&&(b.use=k.use),new ve.TabnasError(k.why||Y.S.unexpected,b,k,h,a)}throw new ve.TabnasError(Y.S.unexpected,{},k,f,a)}let g=d.next(h);if(l===g.tin){let b={};throw g.use!=null&&(b.use=g.use),new ve.TabnasError(g.why||Y.S.unexpected,b,g,h,a)}if(o.tin!==g.tin)throw new ve.TabnasError(Y.S.unexpected,{},a.t0,f,a);let N=a.root().node;if(this.cfg.result.fail.includes(N))throw new ve.TabnasError(Y.S.unexpected,{},a.t0,f,a);return N}clone(e,n,r){let i=new t(e,n,r);return i.rsm=Object.keys(this.rsm).reduce((s,o)=>(s[o]=(0,Y.filterRules)(this.rsm[o],this.cfg),s),{}),i.norm(),i}norm(){(0,Y.values)(this.rsm).map(e=>e.norm())}};W.Parser=rt;var Qr=(...t)=>new rt(...t);W.makeParser=Qr});var yn=H(st=>{"use strict";Object.defineProperty(st,"__esModule",{value:!0});st.mergeInstances=li;st.deshareMatchTokens=kn;var ei=vt();function Ce(t){if(t==null||typeof t!="object"||Array.isArray(t))return!1;let e=Object.getPrototypeOf(t);return e===null||e===Object.prototype}function ie(t,e){if(Object.is(t,e))return!0;if(t instanceof RegExp&&e instanceof RegExp)return t.source===e.source&&t.flags===e.flags;if(Array.isArray(t)&&Array.isArray(e))return t.length===e.length&&t.every((n,r)=>ie(n,e[r]));if(Ce(t)&&Ce(e)){let n=Object.keys(t),r=Object.keys(e);return n.length===r.length&&n.every(i=>ie(t[i],e[i]))}return!1}function bn(t,e,n,r){if(t===void 0)return e;if(e===void 0)return t;if(Ce(t)&&Ce(e)){let i={},s=Object.keys(e),o=[...Object.keys(t),...s.filter(l=>!(l in t))];for(let l of o){let c=bn(t[l],e[l],Ce(n)?n[l]:void 0,[...r,l]);c!==void 0&&(i[l]=c)}return i}if(ie(t,e))return t;if(ie(t,n))return e;if(ie(e,n))return t;throw new Error("merge: conflicting option values at "+r.join("."))}function ti(t){let e=t.fixed?.token;if(e==null)return;let n={};for(let r of Object.keys(e)){let i=e[r];if(n[i]!=null&&n[i]!==r)throw new Error("merge: fixed tokens "+n[i]+" and "+r+" both claim source "+JSON.stringify(i));n[i]=r}}function kn(t){let e=t.match?.token;if(e==null)return;let n={};for(let r of Object.keys(e)){let i=e[r];if(i instanceof RegExp){let s=new RegExp(i.source,i.flags);i.eager$&&(s.eager$=!0),n[r]=s}else if(typeof i=="function"){let s=(o,l,c)=>i(o,l,c);i.eager$&&(s.eager$=!0),n[r]=s}else n[r]=i}t.match.token=n}function ni(t){let e=t.lex?.match;if(e==null)return;let n=Object.keys(e).sort((i,s)=>{let o=e[i]?.order??0,l=e[s]?.order??0;return o!==l?o-l:i<s?-1:i>s?1:0}),r={};for(let i of n)r[i]=e[i];t.lex.match=r}function ri(t,e){let n=r=>{let i=e.t[r];if(i==null)throw new Error("merge: unknown token tin: "+r);return i};return typeof t=="number"?n(t):Array.isArray(t)?t.map(r=>typeof r=="number"?n(r):r):t}function ii(t){return[t.c?1:0,t.e?1:0,t.h?1:0,t.b?1:0,t.n?Object.keys(t.n).length:0,t.a?1:0,t.u?1:0,t.k?1:0,t.p?1:0,t.r?1:0]}function hn(t,e,n){let i=(t.t||[]).map(o=>o.map(l=>e.t[l]).sort().join(" ")),s={...t};return delete s.t,delete s.S,delete s.sN,s.s=t.s&&t.s.length?t.s.map(o=>ri(o,e)):null,s.g=[...t.g||[]],t.n&&(s.n={...t.n}),t.u&&(s.u={...t.u}),t.k&&(s.k={...t.k}),{alt:s,keys:i,complexity:ii(t),gkey:(t.g||[]).join(","),tag:n}}function si(t,e){let n=Math.min(t.keys.length,e.keys.length);for(let r=0;r<n;r++)if(t.keys[r]!==e.keys[r])return t.keys[r]<e.keys[r]?-1:1;if(t.keys.length!==e.keys.length)return e.keys.length-t.keys.length;for(let r=0;r<t.complexity.length;r++){let i=e.complexity[r]-t.complexity[r];if(i!==0)return i}return t.gkey!==e.gkey?t.gkey<e.gkey?-1:1:t.tag<e.tag?-1:t.tag>e.tag?1:0}function pe(t,e){return t===e?!0:typeof t=="function"&&typeof e=="function"&&t.toString()===e.toString()}function oi(t,e){return t.keys.length!==e.keys.length||!t.keys.every((n,r)=>n===e.keys[r])||t.gkey!==e.gkey||t.alt.c!==e.alt.c&&(t.alt.c||e.alt.c)?!1:pe(t.alt.a,e.alt.a)&&pe(t.alt.h,e.alt.h)&&pe(t.alt.e,e.alt.e)&&(t.alt.b===e.alt.b||pe(t.alt.b,e.alt.b))&&(t.alt.p===e.alt.p||pe(t.alt.p,e.alt.p))&&(t.alt.r===e.alt.r||pe(t.alt.r,e.alt.r))&&ie(t.alt.n,e.alt.n)&&ie(t.alt.u,e.alt.u)&&ie(t.alt.k,e.alt.k)}function mn(t,e){let n=e.filter(o=>!t.some(l=>oi(l,o))),r=[],i=0,s=0;for(;i<t.length&&s<n.length;)si(t[i],n[s])<=0?r.push(t[i++]):r.push(n[s++]);for(;i<t.length;)r.push(t[i++]);for(;s<n.length;)r.push(n[s++]);return r}function pn(t,e){let n=t.internal(),r=n.config,i=n.parser.rule(),s={};for(let o of Object.keys(i)){let l=i[o].def,c={};for(let a of Object.keys(l.fnref))a.includes("$")?c[a]=l.fnref[a]:c["@"+e+":"+a.substring(1)]=l.fnref[a];s[o]={fnref:c,bo:[...l.bo],ao:[...l.ao],bc:[...l.bc],ac:[...l.ac],open:l.open.map(a=>hn(a,r,e)),close:l.close.map(a=>hn(a,r,e))}}return s}function it(t,e){let n=[...t];for(let r of e)n.some(i=>pe(i,r))||n.push(r);return n}function gn(t){let e={...t};return e.s=Array.isArray(t.s)?[...t.s]:t.s,e.g=[...t.g||[]],t.n&&(e.n={...t.n}),t.u&&(e.u={...t.u}),t.k&&(e.k={...t.k}),e}function li(t,e,n){let r=(_,M)=>{let x=_.internal().merged.tag;if(x==null||x===""||x==="-")throw new Error("merge: the "+M+" instance needs a tag option (used to prefix its named actions)");return String(x)},i=r(t,"first"),s=r(e,"second");if(i===s)throw new Error("merge: instance tags must differ, both are "+JSON.stringify(i));let[o,l]=i<s?[t,e]:[e,t],[c,a]=i<s?[i,s]:[s,i],f=_=>{let{tag:M,plugins:x,...B}=_;return B},d=bn(f(o.internal().merged),f(l.internal().merged),ei.defaults,[]);d.tag=c+"~"+a,ti(d),kn(d),ni(d);let u=pn(o,c),h=pn(l,a),p=[...Object.keys(u),...Object.keys(h).filter(_=>!(_ in u))].sort(),y={fnref:{},bo:[],ao:[],bc:[],ac:[],open:[],close:[]},m={};for(let _ of p){let M=u[_]||y,x=h[_]||y;m[_]={fnref:{...M.fnref,...x.fnref},bo:it(M.bo,x.bo),ao:it(M.ao,x.ao),bc:it(M.bc,x.bc),ac:it(M.ac,x.ac),open:mn(M.open,x.open),close:mn(M.close,x.close)}}let k=function(_){for(let M of p){let x=m[M];_.rule(M,B=>{Object.assign(B.def.fnref,x.fnref),B.def.bo.push(...x.bo),B.def.ao.push(...x.ao),B.def.bc.push(...x.bc),B.def.ac.push(...x.ac),0<x.open.length&&B.open(x.open.map(j=>gn(j.alt)),{append:!0}),0<x.close.length&&B.close(x.close.map(j=>gn(j.alt)),{append:!0})})}};Object.defineProperty(k,"name",{value:"merged"});let g=n(d);g.use(k);let N=g.internal().sub,b=o.internal().sub,A=l.internal().sub;for(let _ of["lex","rule"]){let M=[...b[_]||[],...A[_]||[]];0<M.length&&(N[_]=[...N[_]||[],...M])}return g}});var Sn=H(v=>{"use strict";Object.defineProperty(v,"__esModule",{value:!0});v.validateAlts=v.validateAlt=v.makeToken=v.makeTextMatcher=v.makeStringMatcher=v.makeSpaceMatcher=v.makeRuleSpec=v.makeRule=v.makePoint=v.makeParser=v.makeNumberMatcher=v.makeLineMatcher=v.makeLex=v.makeFixedMatcher=v.makeCommentMatcher=v.util=v.S=v.SKIP=v.EMPTY=v.AFTER=v.BEFORE=v.CLOSE=v.OPEN=v.BUILTIN_SCHEMA_VERSION=v.BUILTIN_REFS=v.TabnasError=v.Tabnas=v.keyOrder=v.VERSION=void 0;var z=ce();Object.defineProperty(v,"OPEN",{enumerable:!0,get:function(){return z.OPEN}});Object.defineProperty(v,"CLOSE",{enumerable:!0,get:function(){return z.CLOSE}});Object.defineProperty(v,"BEFORE",{enumerable:!0,get:function(){return z.BEFORE}});Object.defineProperty(v,"AFTER",{enumerable:!0,get:function(){return z.AFTER}});Object.defineProperty(v,"EMPTY",{enumerable:!0,get:function(){return z.EMPTY}});Object.defineProperty(v,"SKIP",{enumerable:!0,get:function(){return z.SKIP}});var w=ae();Object.defineProperty(v,"keyOrder",{enumerable:!0,get:function(){return w.keyOrder}});Object.defineProperty(v,"S",{enumerable:!0,get:function(){return w.S}});var Pe=tn();Object.defineProperty(v,"BUILTIN_REFS",{enumerable:!0,get:function(){return Pe.BUILTIN_REFS}});Object.defineProperty(v,"BUILTIN_SCHEMA_VERSION",{enumerable:!0,get:function(){return Pe.BUILTIN_SCHEMA_VERSION}});var se=Ne();Object.defineProperty(v,"TabnasError",{enumerable:!0,get:function(){return se.TabnasError}});var ci=vt(),L=xe();Object.defineProperty(v,"makeCommentMatcher",{enumerable:!0,get:function(){return L.makeCommentMatcher}});Object.defineProperty(v,"makeFixedMatcher",{enumerable:!0,get:function(){return L.makeFixedMatcher}});Object.defineProperty(v,"makeLex",{enumerable:!0,get:function(){return L.makeLex}});Object.defineProperty(v,"makeLineMatcher",{enumerable:!0,get:function(){return L.makeLineMatcher}});Object.defineProperty(v,"makeNumberMatcher",{enumerable:!0,get:function(){return L.makeNumberMatcher}});Object.defineProperty(v,"makePoint",{enumerable:!0,get:function(){return L.makePoint}});Object.defineProperty(v,"makeSpaceMatcher",{enumerable:!0,get:function(){return L.makeSpaceMatcher}});Object.defineProperty(v,"makeStringMatcher",{enumerable:!0,get:function(){return L.makeStringMatcher}});Object.defineProperty(v,"makeTextMatcher",{enumerable:!0,get:function(){return L.makeTextMatcher}});Object.defineProperty(v,"makeToken",{enumerable:!0,get:function(){return L.makeToken}});var Ae=dn();Object.defineProperty(v,"makeParser",{enumerable:!0,get:function(){return Ae.makeParser}});Object.defineProperty(v,"makeRule",{enumerable:!0,get:function(){return Ae.makeRule}});Object.defineProperty(v,"makeRuleSpec",{enumerable:!0,get:function(){return Ae.makeRuleSpec}});var vn=Ot();Object.defineProperty(v,"validateAlt",{enumerable:!0,get:function(){return vn.validateAlt}});Object.defineProperty(v,"validateAlts",{enumerable:!0,get:function(){return vn.validateAlts}});var In=yn(),xt={keyOrder:w.keyOrder,recordKeyOrder:w.recordKeyOrder,KEY_ORDER:w.KEY_ORDER,badlex:w.badlex,charset:w.charset,clean:w.clean,clone:w.clone,configure:w.configure,deep:w.deep,entries:w.entries,errdesc:se.errdesc,errinject:se.errinject,errmsg:se.errmsg,errsite:se.errsite,escre:w.escre,keys:w.keys,makelog:w.makelog,mesc:w.mesc,omap:w.omap,parserwrap:w.parserwrap,prop:se.prop,regexp:w.regexp,srcfmt:w.srcfmt,str:w.str,strinject:se.strinject,tokenize:w.tokenize,trimstk:se.trimstk,values:w.values,isMatcherToken:w.isMatcherToken,guardedMatcher:L.guardedMatcher,scan:L.scan,buildCharRunSpec:L.buildCharRunSpec,buildLineRunSpec:L.buildLineRunSpec,buildStringBodySpec:L.buildStringBodySpec,CONSUME:L.CONSUME,IS_ROW:L.IS_ROW,CI_RESET:L.CI_RESET,STOP:L.STOP,STATE_MASK:L.STATE_MASK};v.util=xt;var Nt=class t{#e;static{this.util=xt}static{this.S=w.S}static{this.OPEN=z.OPEN}static{this.CLOSE=z.CLOSE}static{this.BEFORE=z.BEFORE}static{this.AFTER=z.AFTER}static{this.EMPTY=z.EMPTY}static{this.SKIP=z.SKIP}constructor(e,n){let r=[],i={};if(e)if(Array.isArray(e.plugins)){r=e.plugins;let{plugins:c,...a}=e;i=a}else i=e;this.parent=n;let s={parser:void 0,config:void 0,plugins:[],sub:{lex:void 0,rule:void 0},mark:Math.random(),merged:void 0};this.#e=s;let o=(0,w.deep)({},n?{...n.#e.merged}:i.defaults$===!1?{}:ci.defaults,i||{});s.merged=o,this.id="Tabnas/"+Date.now()+"/"+(""+Math.random()).substring(2,8).padEnd(6,"0")+(o.tag==null?"":"/"+o.tag),this.token=(c=>s.config.fixed.token[c]??(0,w.tokenize)(c,s.config,this)),this.tokenSet=(c=>(0,w.findTokenSet)(c,s.config)),this.fixed=(c=>s.config.fixed.ref[c]);let l=(c=>this.#t(c));if((0,w.deep)(l,s.merged),(0,w.defprop)(this,"options",{value:l,writable:!0,enumerable:!0,configurable:!0}),n){let c=n.#e;s.config=(0,w.configure)(this,void 0,o),(0,w.assign)(this.token,s.config.t);for(let u of Object.keys(n))this[u]===void 0&&(this[u]=n[u]);s.parser=(0,Ae.makeParser)(o,s.config,this);let a=c.plugins;s.plugins=[];for(let u of a)this.use(u);let f=s.parser.rule(),d={};for(let u of Object.keys(f))d[u]=(0,w.filterRules)(f[u],s.config);s.parser.rsm=d,s.parser.norm()}else s.config=(0,w.configure)(this,void 0,o),s.parser=(0,Ae.makeParser)(o,s.config,this),(0,w.assign)(this.token,s.config.t);for(let c of r)this.use(c)}#t(e){return e!=null&&((0,w.deep)(this.#e.merged,e),(0,w.configure)(this,this.#e.config,this.#e.merged),this.#e.parser=this.#e.parser.clone(this.#e.merged,this.#e.config,this),(0,w.deep)(this.options,this.#e.merged)),{...this.#e.merged}}parse(e,n,r){if(w.S.string===typeof e){let i=this.#e.parser,s=this.#e.merged.parser;return(s?.start?(0,w.parserwrap)(s):i).start(e,this,n,r)}return e}config(){return(0,w.deep)(this.#e.config)}use(e,n){if(w.S.function!==typeof e)throw new Error("Tabnas.use: the first argument must be a function defining a plugin.");let r=e.name.toLowerCase(),i=(0,w.deep)({},e.defaults||{},n||{});this.options({plugin:{[r]:i}});let s=this.#e.merged.plugin[r];return this.#e.plugins.push(e),e.options=s,e(this,s)||this}rule(e,n){let r=this.#e.parser.rule(e,n);return r===void 0?this:r}make(e){return new t(e,this)}merge(e){return(0,In.mergeInstances)(this,e,n=>new t(n))}empty(e){return new t({defaults$:!1,standard$:!1,grammar$:!1,...e||{}})}toString(){return this.id}sub(e){return e.lex&&(this.#e.sub.lex=this.#e.sub.lex||[],this.#e.sub.lex.push(e.lex)),e.rule&&(this.#e.sub.rule=this.#e.sub.rule||[],this.#e.sub.rule.push(e.rule)),this}internal(){return this.#e}grammar(e,n){e=(0,w.deep)({},e),e.options&&(0,In.deshareMatchTokens)(e.options);let r=n?.rule?.alt?.g,i=r==null?null:Array.isArray(r)?[...r]:String(r).split(/\s*,\s*/).filter(l=>l.length>0),s=l=>i==null||i.length===0||!Array.isArray(l)?l:l.map(c=>{if(c==null||w.S.object!==typeof c)return c;let a=c.g==null?[]:Array.isArray(c.g)?[...c.g]:String(c.g).split(/\s*,\s*/).filter(f=>f.length>0);return{...c,g:[...a,...i]}});if(e.v!=null){if(typeof e.v!="number"||!Number.isInteger(e.v)||e.v<1)throw new Error(`Grammar: invalid builtin schema version: ${e.v} (expected a positive integer)`);if(e.v>Pe.BUILTIN_SCHEMA_VERSION)throw new Error(`Grammar: requires builtin schema version ${e.v}, but this engine supports up to ${Pe.BUILTIN_SCHEMA_VERSION}`)}if(e.ref){for(let l of Object.keys(e.ref))if(l.includes("$"))throw new Error(`Grammar: '$' is reserved for engine builtins; user ref key '${l}' may not contain '$'`)}let o=Object.assign(Object.create(null),Pe.BUILTIN_REFS,e.ref||{});if(e.clear===!0){let l=this.#e.parser.rule();for(let f of(0,w.keys)(l))this.rule(f,null);let c=this.#e.config.fixed.token,a={};for(let f of(0,w.keys)(c)){let d=this.token(c[f]);d!=null&&(a[d]=null)}0<(0,w.keys)(a).length&&this.options({fixed:{token:a}})}if(e.options){let l=(0,w.resolveFuncRefs)(e.options,o);this.options(l)}if(e.rule)for(let l of Object.keys(e.rule)){let c=e.rule[l];if(c===null){this.rule(l,null);continue}this.rule(l,a=>{if(a.fnref(o),c.open){let f=Array.isArray(c.open),d=f?c.open:c.open.alts,u=f?{}:c.open.inject;a.open(s(d),u)}if(c.close){let f=Array.isArray(c.close),d=f?c.close:c.close.alts,u=f?{}:c.close.inject;a.close(s(d),u)}})}return this}get util(){return xt}};v.Tabnas=Nt;var ai="0.8.5";v.VERSION=ai});var Mn=H(K=>{"use strict";Object.defineProperty(K,"__esModule",{value:!0});K.Chess=K.ANNOTATION_NAG=K.VERSION=void 0;K.stripCommands=yi;K.parseSan=Ii;K.parse=Tn;K.parseGame=Ni;var ui=Sn(),fi=`
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
}`;K.VERSION="0.1.0";var di="(?![A-Za-z0-9_+#=:-])";function On(t){let e=t?"O-O-O|O-O":"O-O-O|O-O|0-0-0|0-0",n=t?"[KQRBN]":"[KQRBNP]",r=t?"=":"=?",i=t?"[+#]":"\\+\\+|[+#]",s=t?"":"(?<annotation>!!|\\?\\?|!\\?|\\?!|!|\\?)?";return new RegExp(`^(?:(?<castle>${e})|(?<piece>${n})(?<dfile>[a-h])?(?<drank>[1-8])?(?<pcapture>x)?(?<pto>[a-h][1-8])|(?<pfile>[a-h])(?:x(?<pxfile>[a-h]))?(?<prank>[1-8])(?:${r}(?<promotion>[QRBN]))?)(?<check>${i})?`+s+di)}var hi=/^[1-9]\d{0,8}(?:[ \t]*\.+|(?![A-Za-z0-9_+#=:/-]))/,mi=/^\$\d{1,9}/,pi=/^\$(?:25[0-5]|2[0-4]\d|1\d\d|\d\d?)(?!\d)/,gi=/^(?:(?:1-0|0-1|1\/2-1\/2)(?![A-Za-z0-9_+#=:/-])|\*)/,bi=/^[A-Za-z0-9_]+/,_t=/\[%([A-Za-z_][A-Za-z0-9_]*)(?:[ \t]+([^\]]*))?\]/g,ki=/(?:!!|\?\?|!\?|\?!|!|\?)$/;K.ANNOTATION_NAG={"!":1,"?":2,"!!":3,"??":4,"!?":5,"?!":6};function yi(t){return t.replace(_t," ").replace(/[ \t]+/g," ").trim()}function Ii(t,e){let r=On(e?.strict===!0).exec(t);if(!(r==null||r[0].length!==t.length))return xn(r)}function xn(t){let e=t.groups,n={san:t[0].replace(ki,"")};return e.castle!=null?(n.piece="K",n.castle=3<e.castle.length?"queen":"king"):e.piece!=null?(n.piece=e.piece,(e.dfile!=null||e.drank!=null)&&(n.disambiguation={},e.dfile!=null&&(n.disambiguation.file=e.dfile),e.drank!=null&&(n.disambiguation.rank=+e.drank)),e.pcapture!=null&&(n.capture=!0),n.to=e.pto):(n.piece="P",e.pxfile!=null?(n.disambiguation={file:e.pfile},n.capture=!0,n.to=e.pxfile+e.prank):n.to=e.pfile+e.prank,e.promotion!=null&&(n.promotion=e.promotion)),e.check!=null&&(n.check=e.check==="#"?"#":"+"),e.annotation!=null&&(n.annotation=e.annotation),n}function vi(){return function(e){let n=e.pnt;if(e.src[n.sI]!=="{")return;let r=e.src.indexOf("}",n.sI+1);if(r===-1)return e.bad("unterminated_comment",n.sI,e.src.length);let i=e.src.substring(n.sI,r+1),s=e.token("#CMT",i.substring(1,i.length-1),i,n);return Pt(n,i),s}}function Si(){return function(e){let n=e.pnt;if(e.src[n.sI]!==";")return;let r=Nn(e.src,n.sI),i=e.token("#RMK",r.substring(1),r,n);return Pt(n,r),i}}function wi(){return function(e){let n=e.pnt;if(n.cI!==1||e.src[n.sI]!=="%")return;let r=Nn(e.src,n.sI),i=e.token("#CM",void 0,r,n);return Pt(n,r),i}}function Nn(t,e){let n=e;for(;n<t.length&&t[n]!==`
`&&t[n]!=="\r";)n++;return t.substring(e,n)}function Pt(t,e){let n=-1;for(let r=0;r<e.length;r++)e[r]===`
`&&(t.rI++,n=r);t.sI+=e.length,t.cI=n===-1?t.cI+e.length:e.length-n}var Ct=Symbol.for("@tabnas/chess:count");function Tt(t){let e=t[Ct];return e==null&&(e=Ei(t),Object.defineProperty(t,Ct,{value:e,writable:!0})),e}function Ei(t){let e=t.tags?.FEN,n={number:1,side:"w"};if(typeof e=="string"){let r=e.trim().split(/\s+/);if(r[1]==="b"&&(n.side="b"),r[5]!=null&&/^\d+$/.test(r[5])){let i=parseInt(r[5],10);0<i&&(n.number=i)}}return n}function Re(t){return t.node}function Mt(t,e,n){let r=Re(t),i=0<r.moves.length?r.moves[r.moves.length-1]:r;(i[e]=i[e]||[]).push(n)}function wn(t,e,n){let r={kind:t,text:e};if(n){let i=[];_t.lastIndex=0;let s;for(;(s=_t.exec(e))!=null;){let o=s[2]==null?[]:s[2].split(",").map(l=>l.trim()).filter(l=>l!=="");i.push({name:s[1],args:o})}0<i.length&&(r.commands=i)}return r}function Oi(t,e){return{"@pgn-bo":n=>{n.node=[]},"@gameitem-bc":n=>{n.child.node!=null&&n.node.push(n.child.node)},"@game-bo":n=>{n.node={tags:Object.create(null),moves:[]}},"@movetext-bo":n=>{n.node==null&&(n.node={moves:[]})},"@tag":n=>{let r=n.node,i=n.o0.src;Object.prototype.hasOwnProperty.call(r.tags,i)||(r.tags[i]=n.o1.val)},"@result-open":n=>{n.node.result=n.o0.src},"@result-close":n=>{n.node.result=n.c0.src},"@more-tags":n=>{let r=n.node;return r.moves.length===0&&r.result==null},"@no-result":n=>n.node.result==null,"@move":(n,r)=>{let i=Re(n),s=Tt(i),o=En(t,n.o0,r);o.number=s.number,o.side=s.side,s.side==="w"?s.side="b":(s.side="w",s.number++),i.moves.push(o)},"@bare-move":(n,r)=>{n.node=En(t,n.o0,r)},"@number":n=>{let r=Tt(Re(n)),i=n.o0.src;r.number=parseInt(i,10);let s=i.length-i.replace(/\./g,"").length;s===1?r.side="w":1<s&&(r.side="b")},"@nag":n=>{Mt(n,"nags",parseInt(n.o0.src.substring(1),10))},"@brace-comment":n=>{Mt(n,"comments",wn("brace",n.o0.val,e))},"@line-comment":n=>{Mt(n,"comments",wn("line",n.o0.val,e))},"@rav-bo":n=>{let r=Re(n.parent),i=r.moves[r.moves.length-1],s={moves:[]},o=i==null?{...Tt(r)}:{number:i.number,side:i.side};Object.defineProperty(s,Ct,{value:o,writable:!0}),n.node=s},"@element-bc":n=>{if(n.u.rav!==!0)return;let r=Re(n),i=r.moves[r.moves.length-1]||r;(i.variations=i.variations||[]).push(n.child.node)}}}function En(t,e,n){let r=t.exec(e.src);if(r==null)throw n.tabnas.error("unexpected",{src:e.src});return xn(r)}var xi=function(e,n){let r=n?.strict===!0,i=n?.commands!==!1,s=n?.start||"pgn",o=On(r);e.options({fixed:{token:{"#OB":null,"#CB":null,"#CL":null,"#CA":null,"#OS":"[","#CS":"]","#OP":"(","#CP":")"}},match:{token:{"#RES":gi,"#SAN":o,"#MVN":hi,"#NAG":r?pi:mi,"#TGN":bi}},lex:{match:{pgnComment:{order:12e5,make:vi},pgnRemark:{order:13e5,make:Si},pgnEscape:{order:15e5,make:wi}},emptyResult:[]},tokenSet:{ELEM:["#SAN","#MVN","#NAG","#CMT","#RMK","#OP"],HEAD:["#OS","#SAN","#MVN","#NAG","#CMT","#RMK","#OP","#RES"],EEND:["#RES","#OS","#CP"]},text:{lex:!1},number:{lex:!1},comment:{lex:!1},string:{chars:'"',multiChars:"",escapeStrict:!0,escape:{n:null,t:null,r:null,b:null,f:null,v:null,0:null},allowUnknown:!0},rule:{start:s}});let l=JSON.parse(fi);l.ref=Oi(o,i),e.grammar(l,{rule:{alt:{g:"chess"}}})};K.Chess=xi;K.Chess.defaults={strict:!1,commands:!0,start:"pgn"};function Tn(t,e){return new ui.Tabnas().use(K.Chess,{...e,start:"pgn"}).parse(t)}function Ni(t,e){return Tn(t,e)[0]}K.default=K.Chess});var qi={};Un(qi,{ChessGameElement:()=>Le,applyMove:()=>$e,attacked:()=>X,boardSvg:()=>ot,boardText:()=>lt,define:()=>jt,index:()=>ct,legalMoves:()=>Rt,parseFen:()=>je,resolve:()=>at,square:()=>Rn,startPosition:()=>we});var $n=Yn(Mn());var Ti={k:"♚",q:"♛",r:"♜",b:"♝",n:"♞",p:"♟"},_n="abcdefgh";function Mi(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ot(t){let{position:e,flipped:n}=t,r=[],i=12,s=2,o=[];for(let l=0;l<8;l++)for(let c=0;c<8;c++){let a=n?(7-l<<4)+(7-c):(l<<4)+c,f=s+c*i,d=s+l*i,u=(l+c&1)===1;r.push(`<rect class="sq ${u?"dark":"light"}" x="${f}" y="${d}" width="${i}" height="${i}"/>`);let h=a===t.check?"check":a===t.to?"to":a===t.from?"from":"";h&&r.push(`<rect class="hl ${h}" x="${f}" y="${d}" width="${i}" height="${i}"/>`);let p=e.board[a];if(p!=null){let y=p[0]==="w"?"white":"black";o.push(`<text class="pc ${y}" x="${f+i/2}" y="${d+i/2}">`+Ti[p[1]]+"</text>")}}for(let l=0;l<8;l++){let c=n?_n[7-l]:_n[l],a=n?l+1:8-l;r.push(`<text class="co file" x="${s+l*i+i/2}" y="${s+8*i+1.4}">${c}</text>`,`<text class="co rank" x="${s-.7}" y="${s+l*i+i/2}">${a}</text>`)}return`<svg class="board" viewBox="0 0 ${s*2+8*i} ${s*2+8*i+1}" role="img" aria-label="chess position">`+r.join("")+o.join("")+"</svg>"}function lt(t){let e=[];for(let n=0;n<8;n++){let r=[];for(let i=0;i<8;i++){let s=t.board[(n<<4)+i];r.push(s==null?".":s[0]==="w"?s[1].toUpperCase():s[1])}e.push(Mi(r.join(" ")))}return e.join(`
`)}var At="abcdefgh",Pn={n:[-33,-31,-18,-14,14,18,31,33],b:[-17,-15,15,17],r:[-16,-1,1,16],q:[-17,-16,-15,-1,1,15,16,17],k:[-17,-16,-15,-1,1,15,16,17]},An={b:!0,r:!0,q:!0};function Rn(t){return At[t&15]+String(8-(t>>4))}function ct(t){let e=At.indexOf(t[0]),n=8-Number(t[1]);return 0>e||0>n||7<n?-1:(n<<4)+e}function oe(t){return(t&136)===0}function we(){return je("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")}function je(t){let e=t.trim().split(/\s+/),n=new Array(128).fill(null),r=0;for(let i of e[0]||"")if(i==="/")r=r+16&-16;else if(/[1-8]/.test(i))r+=Number(i);else{let s=i.toLowerCase();if(!"pnbrqk".includes(s))throw new Error("bad FEN piece: "+i);if(!oe(r))throw new Error("FEN board overflows");n[r]=(i===s?"b":"w")+s,r++}return{board:n,turn:e[1]==="b"?"b":"w",castling:e[2]&&e[2]!=="-"?e[2]:"",ep:e[3]&&e[3]!=="-"?ct(e[3]):-1,halfmove:Number(e[4])||0,fullmove:Number(e[5])||1}}function _i(t){return{...t,board:t.board.slice()}}function Ci(t,e){for(let n=0;n<128;n++)if(oe(n)&&t.board[n]===e+"k")return n;return-1}function X(t,e,n){for(let r=0;r<128;r++){if(!oe(r))continue;let i=t.board[r];if(i==null||i[0]!==n)continue;let s=i[1];if(s==="p"){let o=n==="w"?-16:16;if(r+o-1===e||r+o+1===e)return!0;continue}for(let o of Pn[s]){let l=r+o;for(;oe(l);){if(l===e)return!0;if(t.board[l]!=null||!An[s])break;l+=o}}}return!1}function Cn(t,e,n,r,i){let s=r>>4,o=e.turn==="w"?0:7,l={from:n,to:r,piece:"p",colour:e.turn,...i};if(s===o)for(let c of["q","r","b","n"])t.push({...l,promotion:c});else t.push(l)}function Rt(t){let e=[],n=t.turn,r=n==="w"?"b":"w";for(let o=0;o<128;o++){if(!oe(o))continue;let l=t.board[o];if(l==null||l[0]!==n)continue;let c=l[1];if(c==="p"){let a=n==="w"?-16:16,f=n==="w"?6:1,d=o+a;if(oe(d)&&t.board[d]==null){Cn(e,t,o,d,{});let u=o+a+a;o>>4===f&&t.board[u]==null&&e.push({from:o,to:u,piece:"p",colour:n})}for(let u of[-1,1]){let h=o+a+u;if(!oe(h))continue;let p=t.board[h];p!=null&&p[0]===r?Cn(e,t,o,h,{capture:p[1]}):h===t.ep&&e.push({from:o,to:h,piece:"p",colour:n,capture:"p",epCapture:h-a})}continue}for(let a of Pn[c]){let f=o+a;for(;oe(f);){let d=t.board[f];if(d==null)e.push({from:o,to:f,piece:c,colour:n});else{d[0]===r&&e.push({from:o,to:f,piece:c,colour:n,capture:d[1]});break}if(!An[c])break;f+=a}}}let i=n==="w"?112:0,s=n==="w"?"KQ":"kq";return t.board[i+4]===n+"k"&&!X(t,i+4,r)&&(t.castling.includes(s[0])&&t.board[i+7]===n+"r"&&t.board[i+5]==null&&t.board[i+6]==null&&!X(t,i+5,r)&&!X(t,i+6,r)&&e.push({from:i+4,to:i+6,piece:"k",colour:n,castle:"k"}),t.castling.includes(s[1])&&t.board[i]===n+"r"&&t.board[i+1]==null&&t.board[i+2]==null&&t.board[i+3]==null&&!X(t,i+3,r)&&!X(t,i+2,r)&&e.push({from:i+4,to:i+2,piece:"k",colour:n,castle:"q"})),e.filter(o=>{let l=$e(t,o),c=Ci(l,n);return c===-1||!X(l,c,r)})}function $e(t,e){let n=_i(t),r=n.board[e.from];if(n.board[e.from]=null,n.board[e.to]=e.promotion?e.colour+e.promotion:r,e.epCapture!=null&&(n.board[e.epCapture]=null),e.castle){let o=e.colour==="w"?112:0;e.castle==="k"?(n.board[o+5]=n.board[o+7],n.board[o+7]=null):(n.board[o+3]=n.board[o],n.board[o]=null)}n.ep=e.piece==="p"&&Math.abs(e.to-e.from)===32?(e.from+e.to)/2:-1;let i=n.castling,s=o=>{for(let l of o)i=i.replace(l,"")};return e.piece==="k"&&s(e.colour==="w"?"KQ":"kq"),(e.from===119||e.to===119)&&s("K"),(e.from===112||e.to===112)&&s("Q"),(e.from===7||e.to===7)&&s("k"),(e.from===0||e.to===0)&&s("q"),n.castling=i,n.halfmove=e.piece==="p"||e.capture!=null?0:n.halfmove+1,e.colour==="b"&&n.fullmove++,n.turn=e.colour==="w"?"b":"w",n}function at(t,e){let n=e.piece.toLowerCase(),r=e.to?ct(e.to):-1,i=Rt(t).filter(s=>{if(e.castle)return s.castle===(e.castle==="queen"?"q":"k");if(s.castle||s.piece!==n||s.to!==r)return!1;if(e.promotion){if(s.promotion!==e.promotion.toLowerCase())return!1}else if(s.promotion)return!1;let o=e.disambiguation;return!(o&&(o.file&&At[s.from&15]!==o.file||o.rank&&8-(s.from>>4)!==o.rank))});return i.length===1?i[0]:void 0}var jn=`
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

.note { color: var(--muted); font-size: 0.8rem; }
.note:empty { display: none; }
.note.bad { color: var(--bad); }

@media (max-width: 30rem) {
  .wrap { gap: 0.75rem; }
  .boardpane { width: 100%; }
  .moves { max-height: 12rem; }
}
`;var Pi={1:"!",2:"?",3:"!!",4:"??",5:"!?",6:"?!"},Ai={"1-0":"White wins","0-1":"Black wins","1/2-1/2":"Draw","*":"Unfinished"};function ge(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ri(t){let e;try{e=t.tags?.FEN?je(t.tags.FEN):we()}catch{e=we()}let n=[],r,i=(o,l,c)=>{let a=[],f=l;for(let d of o.moves){let u=f,h={id:n.length,move:d,position:u,line:a,at:a.length,depth:c},p=at(u,d);p?(f=$e(u,p),h.position=f,h.from=p.from,h.to=p.to):(h.error=`${d.san}: not a legal move in this position`,r=r??`Move ${d.number}${d.side==="w"?".":"..."} ${h.error}`),n.push(h),a.push(h);for(let y of d.variations||[])i(y,u,c+1);if(h.error)break}return a},s=i(t,e,0);return{start:e,nodes:n,mainline:s,notation:ji(t,n),error:r}}function ji(t,e){let n=new Map;for(let o of e)n.set(o.move,o);let r=[],i=(o,l)=>{for(let c of o||[]){let a=Pi[c];r.push(`<span class="nag" title="Numeric annotation glyph $${c}">`+(a?ge(a):`$${c}`)+"</span>")}for(let c of l||[]){let a=c.text.trim();a&&r.push(`<span class="cm">${ge(a)}</span>`)}},s=(o,l)=>{i(o.nags,o.comments);let c=-1;for(let a of o.moves){let f=n.get(a),d=a.side==="w";(d||c!==a.number)&&r.push(`<span class="no">${a.number}${d?".":"..."}</span>`),c=a.number,r.push(`<button class="mv${f?.error?" bad":""}" type="button" data-node="${f?f.id:-1}"`+(f?.error?` title="${ge(f.error)}"`:"")+`>${ge(a.san)}${ge(a.annotation||"")}</button>`),i(a.nags,a.comments);for(let u of a.variations||[])r.push('<span class="var">('),s(u,l+1),r.push(")</span>"),c=-1}};return s(t,0),t.result&&r.push(`<span class="res" title="${Ai[t.result]||""}">${t.result}</span>`),r.join(" ")}var $i=`
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
    <div class="note" id="note" role="status"></div>
  </div>
</div>`,Le=class extends HTMLElement{static observedAttributes=["orientation","game","ply"];#e;#t;#n;#i=!1;#o;#c=!1;constructor(){super(),this.#e=this.attachShadow({mode:"open"}),this.#e.innerHTML=`<style>${jn}</style>${$i}`}connectedCallback(){this.#c||(this.#c=!0,this.#a()),this.#o=new MutationObserver(()=>this.load()),this.#o.observe(this,{childList:!0,characterData:!0,subtree:!0}),this.load()}disconnectedCallback(){this.#o?.disconnect(),this.#o=void 0}attributeChangedCallback(e){this.#c&&(e==="orientation"?(this.#i=this.getAttribute("orientation")==="black",this.#s()):this.load())}get move(){return this.#n?.move}get ply(){return this.#n?this.#n.at+1:0}goto(e){let n=this.#n?.line||this.#t?.mainline||[];this.#r(0<e?n[e-1]:void 0)}load(){let e=f=>this.#e.getElementById(f),n=e("note"),r=e("moves"),i=e("tags");this.#i=this.getAttribute("orientation")==="black",this.#n=void 0;let s=(f,d)=>{this.#t=void 0,i.textContent="",r.textContent="",n.className=d?"note bad":"note",n.textContent=f,this.#s()},o;try{o=(0,$n.parse)(this.textContent||"")}catch(f){return s(String(f.message).split(`
`)[0],!0)}let l=Number(this.getAttribute("game")||0),c=o[l]||o[0];if(c==null)return s("No game.",!1);this.#t=Ri(c),i.innerHTML=Bi(c,o.length,l),r.innerHTML=this.#t.notation;for(let f of Array.from(r.querySelectorAll("button[data-node]")))f.addEventListener("click",()=>{this.#r(this.#t?.nodes[Number(f.dataset.node)])});n.className=this.#t.error?"note bad":"note",n.textContent=this.#t.error||"";let a=this.getAttribute("ply");a!=null?this.goto(Number(a)):this.#s()}#a(){let e=(i,s)=>this.#e.getElementById(i)?.addEventListener("click",s),n=()=>{let i=this.#n?.line||this.#t?.mainline;this.#r(i?.[i.length-1])},r=()=>{this.#i=!this.#i,this.#s()};e("first",()=>this.#r(void 0)),e("prev",()=>this.#l(-1)),e("next",()=>this.#l(1)),e("last",n),e("flip",r),this.hasAttribute("tabindex")||(this.tabIndex=0),this.addEventListener("keydown",i=>{let o={ArrowLeft:()=>this.#l(-1),ArrowRight:()=>this.#l(1),Home:()=>this.#r(void 0),End:n,f:r}[i.key];o&&(i.preventDefault(),o())})}#l(e){let n=this.#n?.line||this.#t?.mainline;if(n==null)return;let r=this.#n?this.#n.at+e:0<e?0:-1;r>=n.length||this.#r(0>r?void 0:n[r])}#r(e){this.#n=e,this.#s(),this.dispatchEvent(new CustomEvent("chess-move",{detail:{move:e?.move,ply:this.ply},bubbles:!0}))}#s(){let e=this.#e.getElementById("board"),n=this.#e.getElementById("ply"),r=this.#n?.position||this.#t?.start||we(),i=r.board.indexOf(r.turn+"k"),s=0<=i&&X(r,i,r.turn==="w"?"b":"w")?i:void 0;e.innerHTML=ot({position:r,from:this.#n?.from,to:this.#n?.to,flipped:this.#i,check:s}),e.firstElementChild?.setAttribute("aria-label",`Chess position.
`+lt(r));let o=this.#n?.line||this.#t?.mainline||[];n.textContent=`${this.ply} / ${o.length}`;for(let l of Array.from(this.#e.querySelectorAll(".mv.on")))l.classList.remove("on");if(this.#n){let l=this.#e.querySelector(`.mv[data-node="${this.#n.id}"]`);l&&(l.classList.add("on"),Li(this.#e.getElementById("moves"),l))}}};function Li(t,e){let n=e.offsetTop-t.offsetTop,r=n+e.offsetHeight;n<t.scrollTop?t.scrollTop=n:r>t.scrollTop+t.clientHeight&&(t.scrollTop=r-t.clientHeight)}function Bi(t,e,n){let r=t.tags||{},i=[],s=[r.White,r.Black].filter(Boolean).join(" — "),o=[r.Event,r.Site,r.Date].filter(Boolean).join(" · ");return s&&i.push(`<div class="players">${ge(s)}</div>`),o&&i.push(`<div class="meta">${ge(o)}</div>`),1<e&&i.push(`<div class="meta">Game ${n+1} of ${e}</div>`),i.join("")}function jt(t="chess-game"){customElements.get(t)||customElements.define(t,Le)}typeof customElements<"u"&&jt();return Gn(qi);})();
