/* ===== EQE : moteur d'équipement figurine par figurine =====
   Construit, pour chaque fiche, un modèle structuré tiré du texte officiel de la fiche (composition, équipement de base, options) :
   types de figurines, équipement de base de chaque type, règles d'options (qui, combien, quoi remplace quoi).
   Aucune règle n'est inventée : une option non comprise reste « non prise en charge » et la fiche est marquée partielle.
   Le même moteur sert au constructeur, à la vérification de liste et au contrôle final. */
const EQE=(()=>{
 const K=n=>lckBase(n);
 const NUM={one:1,two:2,three:3,four:4,five:5,six:6};
 const num=x=>{x=String(x||"").toLowerCase();return NUM[x]||(/^\d+$/.test(x)?+x:null)};
 const strip=t=>String(t||"").replace(/\*\*/g,"");
 const cleanName=x=>String(x||"").replace(/\(.*?\)/g,"").replace(/\.$/,"").replace(/^(?:an?|one|the)\s+/i,"").trim();
 /* « 1 Power Fist ; 1 Storm Bolter » -> [{n,q}] */
 function itemsOf(s){return strip(s).split(/;|\n/).map(x=>x.trim()).filter(Boolean).map(x=>{x=x.replace(/\(.*?\)/g,"").replace(/\.$/,"").trim();const m=/^(\d+)\s*[x×]?\s*(.+)$/.exec(x);return m?{n:cleanName(m[2]),q:+m[1]}:{n:cleanName(x),q:1}})}
 /* alternatives : puces, liste en ligne, « 1 X and 1 Y » (une seule alternative à deux armes) */
 function altsOf(tail,inl,rest){
  const one=t=>{const a=[];const tt=String(t).replace(/\(.*?\)/g,"").replace(/^\d+\s*[x×]?\s*/,"").replace(/\.$/,"").trim();const parts=KNOWN&&KNOWN.has(K(tt))?[String(t)]:String(t).split(/\s+and\s+/i);parts.forEach(y=>{y=y.replace(/\(.*?\)/g,"").replace(/\.$/,"").trim();if(!y)return;const m=/^(\d+)\s*[x×]?\s*(.+)$/.exec(y);a.push(m?{n:cleanName(m[2]),q:+m[1]}:{n:cleanName(y),q:1})});return a};
  let src;const t=String(tail||"").trim();
  if(t&&!/following/i.test(t)){src=/\bor\b|,/.test(t)&&!/\band\b/.test(t)?t.split(/,\s*(?:or\s+)?|\s+or\s+/):[t]}
  else if(inl)src=inl.replace(/\(duplicates[^)]*\)/ig,"").split(/,\s*(?:and\s+|or\s+)?/);
  else src=String(rest||"").split(/\n\s*[•■]\s*/).slice(1);
  return src.map(one).filter(a=>a.length)}
 let KNOWN=null;
 const splitAnd=(t)=>{const full=cleanName(t);if(KNOWN&&KNOWN.has(K(full)))return[full];return String(t||"").split(/\s+and\s+|,\s*/i).map(cleanName).filter(Boolean)};
 const fromNames=t=>splitAnd(t);
 /* ----- types de figurines (composition) ----- */
 function parseTypes(lib){const comp=(lib.wp&&lib.wp.comp)||[];const T=[];
  comp.forEach((c,i)=>{const m=/^(\d+)(?:\s*-\s*(\d+))?\s+(.+?)(?:\s+models?)?$/i.exec(strip(c).trim());if(!m)return;
   T.push({i:T.length,name:m[3].trim(),k:nk(m[3]),min:+m[1],max:m[2]?+m[2]:+m[1]})});return T}
 /* ----- équipement de base de chaque type ----- */
 function parseBase(lib,T){const out={},issues=[];const txt=strip((lib.wp&&lib.wp.loadout)||"");
  txt.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean).forEach(par=>{const m=/^(.*?)\s+(?:is|are)\s+equipped\s+with:?\s*(.*)$/is.exec(par);if(!m){issues.push("équipement de base non lu : "+par.slice(0,60));return}
   const subj=m[1].replace(/^(?:every|each|the|this|all)\s+/i,"").trim(),its=itemsOf(m[2]);const sk=nk(subj);
   let hit;if(!sk||/^(?:model|models|unit)$/.test(sk))hit=T;else{hit=T.filter(t=>t.k===sk);if(!hit.length)hit=T.filter(t=>(" "+t.k+" ").includes(" "+sk+" ")||(" "+sk+" ").includes(" "+t.k+" "))}
   if(!hit.length){issues.push("type inconnu dans l'équipement de base : "+subj);return}
   if(hit.length>1&&sk&&!/^(?:model|models|unit)$/.test(sk)&&hit.some(t=>t.k===sk))hit=hit.filter(t=>t.k===sk);
   hit.forEach(t=>{out[t.i]=(out[t.i]||[]).concat(its)})});
  return{base:out,issues}}
 /* ----- règles d'options ----- */
 function parseRules(lib,T){KNOWN=new Set([...(lib.rw||[]),...(lib.mw||[])].map(w=>K(String(w.n).replace(/^➤\s*/,""))));const opt=(lib.wp&&lib.wp.opt)||[],R=[],issues=[];
  opt.forEach((s0,idx)=>{s0=String(s0||"").trim();if(!s0)return;const lines=s0.split("\n");let f=strip(lines[0]).replace(/\s+/g," ").trim();const rest="\n"+lines.slice(1).join("\n"),inl=f.indexOf(":")>=0?f.slice(f.indexOf(":")+1).trim():"";
   if(/^none\.?$/i.test(f)||/^\s*\*/.test(f)||/^a model can only/i.test(f)||/ is equipped with:/i.test(f)){if(/^\s*\*/.test(f)&&/cannot|only|more than/i.test(f))issues.push("restriction à relire : "+f.replace(/^\*+\s*/,"").slice(0,90));return}
   let cond=null;const cm=/^if this unit contains (only )?(\d+)( or (more|fewer))? models?,\s*(.+)$/i.exec(f);if(cm){cond={n:+cm[2],m:cm[4]?cm[4].toLowerCase():"eq"};f=cm[5]}
   const per=/for (?:every|each) (\d+) models?(?: in this unit)?/i.exec(f);let body=per?f.replace(per[0],"").replace(/^[\s,:]+/,""):f;
   if(/duplicates|up to (?:two|three|\d+) of the following|cannot be taken on the same|more than/i.test(f)&&!/up to \d+ [A-Za-z’' -]*models/i.test(f)){issues.push("option complexe non prise en charge : "+f.slice(0,100));return}
   let m,subj="",from=null,tail=null,add=false,req=null;
   if((m=/^(.*?)\s+(?:can|may)\s+(?:each\s+)?have\s+(?:their|its|his|her)\s+(.+?)\s+replaced\s+(?:with|by)\s+(.+)$/i.exec(body))){subj=m[1];from=m[2];tail=m[3]}
   else if((m=/^(.*?)\s+(?:can|may)\s+(?:each\s+)?replace\s+(?:their|its|his|her)\s+(.+?)\s+with\s+(.+)$/i.exec(body))){subj=m[1];from=m[2];tail=m[3]}
   else if((m=/^(.*?)(?:’|')s\s+(.+?)\s+(?:can\s+be\s+replaced|can\s+be\s+replaced)\s+(?:with|by)\s+(.+)$/i.exec(body))){subj=m[1];from=m[2];tail=m[3]}
   else if((m=/^(.*?)\s+(?:can|may)\s+(?:also\s+)?be\s+equipped\s+(?:with\s+)?(.+)$/i.exec(body))&&!/\bor can\b/i.test(body)){subj=m[1];tail=m[2];add=true}
   else if((m=/^(.*?)\s+(?:can|may)\s+(?:also\s+)?take\s+(.+)$/i.exec(body))){subj=m[1];tail=m[2];add=true}
   if(tail==null){issues.push("option non lue : "+f.slice(0,100));return}
   const rq=/^(.*?)\s+equipped\s+with\s+(.+)$/i.exec(subj);if(rq){subj=rq[1];req=fromNames(rq[2])}
   /* portée */
   const anyN=/\bany numbers? of\b|^all\b|\ball models\b/i.test(subj+" "+body.slice(0,40))&&!/up to/i.test(f);let k=null;const up=/up to (\d+|one|two|three|four|five)\b/i.exec(f);
   const lead=/^(?:up to\s+)?(\d+|one|two|three|four|five)\b/i.exec(subj.trim());
   if(!anyN){k=up?num(up[1]):lead?num(lead[1]):1}
   let sc=subj.replace(/^(?:any numbers? of|all|up to \d+|up to \w+|\d+|one|two|three|four|five|the|this|that)\s+/ig,"").replace(/^(?:\d+|one|two|three|four|five)\s+/i,"").replace(/\s+in this unit$/i,"").replace(/\s+models?$/i,"").trim();
   if(/^(?:model|models|unit)?$/i.test(sc)||/^this model$/i.test(subj.trim()))sc="";
   /* résolution du sujet en types de figurines */
   let types=null;const sk=nk(sc);
   if(!sk)types=T.map(t=>t.i);
   else{let h=T.filter(t=>t.k===sk);if(!h.length)h=T.filter(t=>(" "+t.k+" ").includes(" "+sk+" "));if(!h.length)h=T.filter(t=>(" "+sk+" ").includes(" "+t.k+" "));
    if(h.length===1)types=[h[0].i];else if(h.length>1&&T.length===h.length&&0)types=h.map(t=>t.i)}
   if(!types){issues.push("figurine concernée non identifiée : "+f.slice(0,100));return}
   const alts=altsOf(tail,inl,rest);if(!alts.length){issues.push("armes proposées non lues : "+f.slice(0,100));return}
   R.push({id:R.length,idx,txt:f,types,kind:per?"per":anyN?"any":"n",k:per?(k||1):k,per:per?+per[1]:null,cond,from:from?fromNames(from):[],req:req||[],alts,add})});
  return{rules:R,issues}}
 const cache=new Map();
 function model(lib){if(!lib)return null;const key=lib.id+"|"+((lib.wp&&lib.wp.opt)||[]).length+"|"+(D.man&&D.man.version||"");if(cache.has(key))return cache.get(key);
  const T=parseTypes(lib);let M={lib,types:T,rules:[],base:{},issues:[],usable:false,reliable:false};
  if(T.length){const b=parseBase(lib,T),r=parseRules(lib,T);M.base=b.base;M.rules=r.rules;M.issues=[...b.issues,...r.issues];
   const baseOk=T.every(t=>b.base[t.i]&&b.base[t.i].length);M.usable=baseOk;M.reliable=baseOk&&!M.issues.length;
   if(!baseOk)M.issues.push("équipement de base incomplet")}
  else M.issues.push("composition de l'unité non lue");
  cache.set(key,M);return M}
 /* composition pour un effectif donné : types fixes + au plus un type variable */
 function counts(M,size){const T=M.types,fixed=T.filter(t=>t.min===t.max),flex=T.filter(t=>t.min!==t.max);
  const fs=fixed.reduce((a,t)=>a+t.min,0);
  if(flex.length===0)return fs===size?T.map(t=>({t:t.i,n:t.min})):null;
  if(flex.length===1){const n=size-fs;return n>=flex[0].min&&n<=flex[0].max?T.map(t=>({t:t.i,n:t.min===t.max?t.min:n})):null}
  let rest=size-fs-flex.reduce((a,t)=>a+t.min,0);if(rest<0)return null;const add={};flex.slice().sort((x,y)=>y.max-x.max).forEach(t=>{const a=Math.min(rest,t.max-t.min);add[t.i]=a;rest-=a});if(rest>0)return null;
  return T.map(t=>({t:t.i,n:t.min===t.max?t.min:t.min+add[t.i]}))}
 const flexN=M=>M.types.filter(t=>t.min!==t.max).length;
 const tally=figs=>{const g={};(figs||[]).forEach(f=>g[f.t]=(g[f.t]||0)+1);return g};
 /* composition réellement choisie : chaque type dans ses bornes, total = effectif */
 const compOk=(M,size,figs)=>{const g=tally(figs);let s=0;for(const t of M.types){const n=g[t.i]||0;if(n<t.min||n>t.max)return false;s+=n}return s===size}
 /* +1 / −1 figurine d'un type variable (compensé sur un autre type variable) ; null si impossible */
 function setCount(M,size,figs,ti,d){const g=tally(figs),T=M.types,fl=T.filter(t=>t.min!==t.max);if(fl.length<2)return null;
  const other=fl.filter(t=>t.i!==ti).pop();if(!other)return null;const a=(g[ti]||0)+d,bb=(g[other.i]||0)-d,tt=T[ti];
  if(a<tt.min||a>tt.max||bb<other.min||bb>other.max)return null;g[ti]=a;g[other.i]=bb;
  const used={};const out=[];T.forEach(t=>{for(let k=0;k<g[t.i];k++){const src=(figs||[]).filter(f=>f.t===t.i)[k];out.push(src?{t:t.i,c:JSON.parse(JSON.stringify(src.c||{}))}:{t:t.i,c:{}})}});return out}
 const compatible=(M,size)=>!!M.usable&&!!counts(M,size);
 function newFigs(M,size){const c=counts(M,size);if(!c)return null;const f=[];c.forEach(x=>{for(let i=0;i<x.n;i++)f.push({t:x.t,c:{}})});return f}
 /* adapte les figurines à un nouvel effectif (conserve les choix des premières) */
 function resize(M,size,figs){if(figs&&compOk(M,size,figs))return figs.map(f=>({t:f.t,c:JSON.parse(JSON.stringify(f.c||{}))}));const nf=newFigs(M,size);if(!nf)return null;const used={};(figs||[]).forEach(f=>{(used[f.t]=used[f.t]||[]).push(f)});const seen={};
  return nf.map(f=>{const a=used[f.t]||[];const i=seen[f.t]=(seen[f.t]||0);seen[f.t]++;return a[i]?{t:f.t,c:JSON.parse(JSON.stringify(a[i].c||{}))}:f})}
 const lim=(r,size)=>{let l=r.kind==="per"?Math.floor(size/r.per)*(r.k||1):r.kind==="any"?size:(r.k||1);if(r.cond){const q=r.cond;const ok=q.m==="more"?size>=q.n:q.m==="fewer"?size<=q.n:size===q.n;if(!ok)l=0}return l};
 const nameOf=a=>a.q>1?a.q+" × "+a.n:a.n;
 const altTxt=a=>a.map(x=>(()=>{try{return frName(x.n)}catch(_){return x.n}})()+(x.q>1?" ×"+x.q:"")).join(" + ");
 const itemTxt=n=>{try{return frName(n)}catch(_){return n}};
 /* équipement final d'une figurine ; renvoie aussi les erreurs de cette figurine */
 function figItems(M,fig){const err=[];let items=(M.base[fig.t]||[]).map(x=>({n:x.n,q:x.q}));const chosen=[];Object.keys(fig.c||{}).forEach(rid=>{const r=M.rules[+rid];(fig.c[rid]||[]).forEach(ai=>chosen.push({r,ai}))});
  const pending=chosen.slice();let prog=true;const have=n=>items.filter(x=>K(x.n)===K(n)).reduce((a,x)=>a+x.q,0);
  while(pending.length&&prog){prog=false;for(let i=0;i<pending.length;i++){const {r,ai}=pending[i];
    if(!r||!r.types.includes(fig.t)||!r.alts[ai]){pending.splice(i,1);err.push({rule:r?r.id:null,msg:"option non applicable à cette figurine"});prog=true;break}
    const need=r.from.concat(r.req||[]);let okk=true;r.from.forEach(n=>{if(have(n)<1)okk=false});(r.req||[]).forEach(n=>{if(have(n)<1)okk=false});
    if(!okk)continue;
    r.from.forEach(n=>{let rm=1;items=items.map(x=>{if(rm&&K(x.n)===K(n)){rm--;return x.q>1?{n:x.n,q:x.q-1}:null}return x}).filter(Boolean)});
    r.alts[ai].forEach(a=>{const e=items.find(x=>K(x.n)===K(a.n));if(e)e.q+=a.q;else items.push({n:a.n,q:a.q})});pending.splice(i,1);prog=true;break}}
  pending.forEach(({r})=>err.push({rule:r.id,msg:"« "+(r.from.map(itemTxt).join(" + ")||"équipement")+" » n'est plus disponible (déjà remplacé ou absent)"}));
  return{items,err}}
 /* validation complète : erreurs précises (figurine, équipement, règle) */
 function validate(M,size,figs){const errors=[];if(!M||!M.usable)return{errors:[{msg:"équipement non vérifiable pour cette fiche"}],final:[]};
  if(!counts(M,size))return{errors:[{msg:"effectif "+size+" non prévu pour cette composition"}],final:[]};
  if(!compOk(M,size,figs))errors.push({msg:"composition incohérente pour "+size+" figurines"});
  const use={},final=[];
  (figs||[]).forEach((f,i)=>{const fi=figItems(M,f);final.push(fi.items);fi.err.forEach(e=>errors.push({fig:i,rule:e.rule,msg:e.msg}));
   Object.keys(f.c||{}).forEach(rid=>{if((f.c[rid]||[]).length>1)errors.push({fig:i,rule:+rid,msg:"Une seule option à la fois pour « "+((M.rules[+rid]||{from:[]}).from.map(itemTxt).join(" + ")||"cette option")+" »"})});
   Object.keys(f.c||{}).forEach(rid=>{if((f.c[rid]||[]).length){(use[rid]=use[rid]||[]).push(i)}})});
  Object.keys(use).forEach(rid=>{const r=M.rules[+rid];if(!r)return;const L=lim(r,size);if(use[rid].length>L)errors.push({rule:r.id,figs:use[rid],fig:use[rid][L],msg:L?"Maximum "+L+" figurine"+(L>1?"s":"")+" pour cette option ("+size+" figurines)":"Option non permise à "+size+" figurine"+(size>1?"s":"")})});
  return{errors,final}}
 /* options offertes à une figurine, avec état et raison */
 function options(M,size,figs,i){const f=figs[i],out=[];const base=validate(M,size,figs).errors.map(e=>e.msg+"|"+(e.fig!=null?e.fig:""));
  M.rules.forEach(r=>{if(!r.types.includes(f.t))return;const cur=(f.c[r.id]||[]);const alts=r.alts.map((a,ai)=>{
    const sel=cur.includes(ai);const test=figs.map((g,j)=>j===i?{t:g.t,c:Object.assign({},g.c,{[r.id]:sel?[]:[ai]})}:g);
    const v=validate(M,size,test);const nw=v.errors.filter(e=>!base.includes(e.msg+"|"+(e.fig!=null?e.fig:"")));
    return{ai,txt:altTxt(a),sel,ok:sel||!nw.length,why:sel?"":(nw[0]?nw[0].msg:"")}});
   out.push({rule:r,alts,cur,from:r.from.map(itemTxt).join(" + "),cap:lim(r,size)})});
  return out}
 /* totaux par arme (clé canonique) sur toute l'unité */
 function totals(final){const t={};final.forEach(its=>its.forEach(x=>{const k=K(x.n);t[k]=(t[k]||{n:x.n,q:0});t[k].q+=x.q}));return t}
 /* reconstitue des figurines à partir de totaux d'armes (anciennes configurations) ; renvoie null si impossible */
 /* noms d'armes saisis ailleurs (ALN, import PDF) : rapprochement avec les armes de l'unité, jamais ambigu */
 const tk=s=>nk(String(s||"").replace(/^➤\s*/,"").replace(/\(.*?\)/g,"").split(/\s+[-–]\s+/)[0]).split(" ").map(w=>w.length>3&&/[sx]$/.test(w)?w.slice(0,-1):w).filter(w=>w&&!/^(?:de|du|des|la|le|les|d|l|a|au|aux|et|the|of)$/.test(w)),fz=(a,b)=>{if(a===b)return true;if(a.length<6||b.length<6||Math.abs(a.length-b.length)>1)return false;let i=0;while(i<a.length&&a[i]===b[i])i++;let j=0;while(j<a.length-i&&j<b.length-i&&a[a.length-1-j]===b[b.length-1-j])j++;const A=a.slice(i,a.length-j),B=b.slice(i,b.length-j);return A.length<=1&&B.length<=1||(A.length===2&&B.length===2&&A[0]===B[1]&&A[1]===B[0])},
 has=(S,x)=>S.has(x)||[...S].some(y=>fz(x,y)),sub=(a,B)=>a.length>0&&a.every(x=>has(B,x));
 let ALIAS=(name,cands)=>{const nt=tk(name);if(!nt.length)return null;const N=new Set(nt);
  const hits=cands.filter(c=>{const en=tk(c);let fr=[];try{const r=tName(c);fr=tk(r.t);if(r.prop)fr=fr.concat(tk(r.prop))}catch(_){}const U=new Set([...en,...fr]);return sub(nt,U)||sub(en,N)||sub(fr,N)});
  return hits.length===1?hits[0]:null};const setAlias=f=>{ALIAS=f};
 function unitNames(M){const o=new Map();const add=n=>{if(n&&!o.has(K(n)))o.set(K(n),n)};Object.values(M.base||{}).forEach(l=>(l||[]).forEach(x=>add(x.n)));(M.rules||[]).forEach(r=>{(r.from||[]).forEach(n=>add(typeof n==="string"?n:n&&n.n));(r.alts||[]).forEach(a=>a.forEach(x=>add(x.n)))});return o}
 function fromCounts(M,size,wq){const figs=newFigs(M,size);if(!figs)return null;const tot={};const UN=ALIAS?unitNames(M):null;
  Object.keys(wq||{}).forEach(k=>{let b=K(k);if(UN&&!UN.has(b)){try{const a=ALIAS(k,[...UN.values()]);if(a)b=K(a)}catch(_){}}tot[b]=Math.max(tot[b]||0,wq[k])});
  const baseTot=totals(figs.map(f=>(M.base[f.t]||[]).map(x=>({n:x.n,q:x.q}))));
  M.rules.forEach(r=>{r.alts.forEach((a,ai)=>{let n=Infinity;a.forEach(x=>{const k=K(x.n);const extra=(tot[k]||0)-((baseTot[k]&&baseTot[k].q)||0);n=Math.min(n,Math.floor(Math.max(0,extra)/Math.max(1,x.q)))});
     if(!isFinite(n)||n<=0)return;
     for(let j=0;j<figs.length&&n>0;j++){const f=figs[j];if(!r.types.includes(f.t)||(f.c[r.id]||[]).length)continue;
      const t=JSON.parse(JSON.stringify(figs));t[j].c[r.id]=[ai];const v=validate(M,size,t);if(!v.errors.length){figs[j].c[r.id]=[ai];n--}}})});
  return figs}
 return{model,counts,compatible,newFigs,resize,setCount,flexN,tally,validate,options,totals,fromCounts,setAlias,alias:(n,c)=>ALIAS(n,c),figItems,lim,itemTxt,altTxt}})();
