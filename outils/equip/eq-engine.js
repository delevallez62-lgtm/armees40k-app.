/* ===== HAMMER · Équipements, restrictions et validation (moteur pur, hors ligne) ===== */
(function(root){
"use strict";
const nk=s=>String(s==null?"":s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const nn=s=>String(s==null?"":s).replace(/\s+[x×]\s?\d+(?=\s|$)/i,"").toLowerCase().trim();
const wbase=n=>String(n||"").split(/\s+[-–—]\s+/)[0].trim();
const S1=s=>{s=String(s||"");return s.charAt(0).toUpperCase()+s.slice(1)};
const cap=s=>String(s||"").replace(/(^|[\s(])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase());
const ST={off:"Confirmée (source officielle)",sec:"Confirmée (source secondaire fiable)",pdf:"Extraite du PDF — à vérifier",unk:"Inconnue",user:"Confirmée par toi"};
const isConf=c=>c.st==="off"||c.st==="sec"||c.ok===1;
const stLabel=c=>c.ok===1&&c.st!=="off"&&c.st!=="sec"?ST.user:(ST[c.st]||ST.unk);
const same=(a,b)=>{const x=nk(a),y=nk(b);return !!x&&!!y&&(x===y||(" "+y+" ").includes(" "+x+" ")||(" "+x+" ").includes(" "+y+" "))};

/* ---------- équipement : lecture, modèles, résumé ---------- */
function parseEquip(str){const out=[];String(str||"").split(/,(?![^(]*\))/).forEach(p=>{p=p.trim();if(!p)return;const m=/^(.*?)\s*\((\d+)\)\s*$/.exec(p);out.push(m?{name:m[1].trim(),n:+m[2]}:{name:p,n:null})});return out}
function poolOf(unit){const c=parseEquip(unit.equip),seen=new Map();(unit.weapons||[]).forEach(w=>{const b=wbase(w.name),k=nk(b);if(!k||seen.has(k))return;const e=c.find(x=>same(x.name,b));seen.set(k,{b,n:e?e.n:null})});c.forEach(e=>{if(![...seen.values()].some(x=>same(x.b,e.name)))seen.set(nk(e.name),{b:e.name,n:e.n})});return[...seen.values()]}
function sizeOf(unit){return Math.max(1,parseInt(unit&&unit.size,10)||1)}
function roleOf(cons){const r=(cons||[]).filter(c=>!c.off&&c.t==="role"&&c.role);return r.length?r[0].role:""}
function eqList(s,pool){return String(s||"").split(/,(?![^(]*\))/).map(x=>x.replace(/^\s*\d+\s*[x×]?\s+/,"").replace(/\s*\(\d+\)\s*$/,"").replace(/[.;]+$/,"").trim()).filter(Boolean).map(x=>{const p=pool.find(q=>same(q.b,x));return p?p.b:x})}
function deriveMdl(unit,cons){const N=sizeOf(unit),pool=poolOf(unit),named=(unit.mdl||[]).filter(m=>m&&m.n).slice(0,N).map(m=>({r:String(m.n).trim(),w:eqList(m.eq,pool)}));
 const rest=Math.max(0,N-named.length),M=named.concat(Array.from({length:rest},()=>({r:"",w:[]}))),oth=M.slice(named.length);let asm=false;const part=[];
 pool.forEach(p=>{const c=p.n==null?N:p.n;if(p.n==null)asm=true;const used=named.filter(m=>m.w.some(x=>same(x,p.b))).length,rem=Math.max(0,c-used);if(!oth.length)return;if(rem>=oth.length)oth.forEach(m=>m.w.push(p.b));else if(rem>0)part.push({b:p.b,c:rem})});
 part.sort((x,y)=>y.c-x.c);const held=new Set();part.forEach(p=>{asm=true;const free=oth.map((m,i)=>i).filter(i=>!held.has(i));(free.length>=p.c?free:oth.map((m,i)=>i)).slice(0,p.c).forEach(i=>{oth[i].w.push(p.b);held.add(i)})});
 return{m:M,asm,mdl:true}}
function derive(unit,cons){if(unit&&Array.isArray(unit.mdl)&&unit.mdl.some(m=>m&&m.n)&&sizeOf(unit)>=unit.mdl.filter(m=>m&&m.n).length)return deriveMdl(unit,cons);const N=sizeOf(unit),pool=poolOf(unit),role=N>1?roleOf(cons):"";
 const M=Array.from({length:N},(_,i)=>({r:i===0&&role?role:"",w:[]}));let asm=false;const part=[];
 pool.forEach(p=>{const c=p.n==null?N:p.n;if(p.n==null)asm=true;if(c>=N)M.forEach(m=>m.w.push(p.b));else part.push({b:p.b,c})});
 part.sort((a,b)=>b.c-a.c);const held=new Set();
 part.forEach(p=>{asm=true;const rc=(cons||[]).find(c=>!c.off&&c.t==="role"&&same(c.w,p.b));let cand=[];
  if(rc)cand=M.map((m,i)=>i).filter(i=>nk(M[i].r)===nk(rc.role)&&!held.has(i));
  if(cand.length<p.c)cand=cand.concat(M.map((m,i)=>i).filter(i=>!cand.includes(i)&&!held.has(i)&&!(role&&i===0&&!rc)));
  if(cand.length<p.c)cand=cand.concat(M.map((m,i)=>i).filter(i=>!cand.includes(i)));
  cand.slice(0,p.c).forEach(i=>{M[i].w.push(p.b);held.add(i)})});
 return{m:M,asm}}
function modelsOf(unit,cons){if(unit&&unit.eq&&Array.isArray(unit.eq.m)&&unit.eq.m.length)return{m:unit.eq.m.map(x=>({r:x.r||"",w:(x.w||[]).slice()})),asm:false,cust:true};return Object.assign(derive(unit,cons),{cust:false})}
function summary(models){const g=new Map();models.forEach(m=>{const w=m.w.slice().sort((a,b)=>a.localeCompare(b)),k=(m.r||"")+"|"+w.join("|");const e=g.get(k)||{n:0,w,r:m.r||""};e.n++;g.set(k,e)});return[...g.values()].sort((a,b)=>b.n-a.n||(a.r?1:0)-(b.r?1:0)).map(e=>({n:e.n,w:e.w,r:e.r,t:`${e.n} × ${e.w.length?e.w.map(S1).join(" + "):"sans arme"}${e.r?" — "+cap(e.r):""}`}))}
function summaryW(models){const NN=models.length,by=new Map();models.forEach(m=>m.w.forEach(w=>{const e=by.get(w)||{w,n:0,roles:new Map()};e.n++;const r=m.r||"";e.roles.set(r,(e.roles.get(r)||0)+1);by.set(w,e)}));
 return[...by.values()].map(e=>{const rs=[...e.roles.keys()],only=rs.length===1&&rs[0]?rs[0]:"";if(e.n===NN)return{n:e.n,w:e.w,r:"",t:`${e.n} × ${S1(e.w)}`};let t=`${e.n} × ${S1(e.w)}`;if(only)t+=` — ${cap(only)}`;else if(rs.some(r=>r)){const x=[...e.roles].filter(([r])=>r).map(([r,k])=>`dont ${k} ${cap(r)}`).join(", ");t+=` (${x})`}return{n:e.n,w:e.w,r:only,t}}).sort((a,b)=>b.n-a.n||a.t.localeCompare(b.t))}
function countsOf(models){const c=new Map();models.forEach(m=>m.w.forEach(w=>c.set(w,(c.get(w)||0)+1)));return c}
function equipString(models){return[...countsOf(models)].map(([w,n])=>`${w} (${n})`).join(", ")}

/* ---------- restrictions ---------- */
let SEQ=0;const cid=()=>"c"+Date.now().toString(36)+(SEQ++).toString(36);
function describe(c){const w=S1(c.w||"");switch(c.t){
 case"max":return`${w} : ${c.per?c.n+" par tranche de "+c.per+" figurines":"maximum "+c.n+" par unité"}${c.ifmin||c.ifmax?" ("+(c.ifmin?"unité ≥ "+c.ifmin:"")+(c.ifmin&&c.ifmax?", ":"")+(c.ifmax?"unité ≤ "+c.ifmax:"")+")":""}`;
 case"min":return`${w} : minimum ${c.n} par unité`;
 case"role":return`${w} : réservé à la figurine « ${cap(c.role)} »${c.n?" (maximum "+c.n+")":""}`;
 case"excl":return`${S1(c.ws[0])} et ${S1(c.ws[1])} : incompatibles sur une même figurine`;
 case"fixed":return"Aucune option d'équipement";
 default:return c.t}}
function sig(c){return[c.t,nk(c.w||""),(c.ws||[]).map(nk).sort().join("+"),c.n||"",c.per||"",nk(c.role||"")].join("|")}
function ruleIf(c,N){return !((c.ifmin&&N<c.ifmin)||(c.ifmax&&N>c.ifmax))}
function validate(unit,cons,opt){opt=opt||{};const mm=opt.models||modelsOf(unit,cons),M=mm.m,N=sizeOf(unit),nm=cap(unit.name||"Unité"),issues=[];
 const live=(cons||[]).filter(c=>!c.off);
 const holders=w=>M.map((m,i)=>m.w.some(x=>same(w,x))?i:-1).filter(i=>i>=0);
 let unconf=0,conf=0;
 live.forEach(c=>{if(c.t==="fixed"){isConf(c)?conf++:unconf++;return}
  if(!ruleIf(c,N))return;const sev=isConf(c)?"red":"orange";isConf(c)?conf++:unconf++;
  const add=(msg,m)=>issues.push({lvl:sev,msg:sev==="orange"?msg+" (restriction non confirmée : à vérifier)":msg,m:m||[],cid:c.id});
  if(c.t==="max"){const h=holders(c.w),lim=c.per?Math.floor(N/c.per)*c.n:c.n;if(h.length>lim)add(`${nm} : ${h.length} × ${S1(c.w)} sélectionné${h.length>1?"s":""}, maximum autorisé : ${lim}.`,h)}
  else if(c.t==="min"){const h=holders(c.w);if(h.length<c.n)add(`${nm} : ${h.length} × ${S1(c.w)}, minimum requis : ${c.n}.`,[])}
  else if(c.t==="role"){const h=holders(c.w),bad=h.filter(i=>nk(M[i].r)!==nk(c.role));if(bad.length)add(`${nm} : « ${S1(c.w)} » est réservé à la figurine « ${cap(c.role)} » (figurine${bad.length>1?"s":""} ${bad.map(i=>i+1).join(", ")}).`,bad);else if(c.n&&h.length>c.n)add(`${nm} : ${h.length} × ${S1(c.w)}, maximum autorisé : ${c.n}.`,h)}
  else if(c.t==="excl"){const bad=M.map((m,i)=>m.w.some(x=>same(c.ws[0],x))&&m.w.some(x=>same(c.ws[1],x))?i:-1).filter(i=>i>=0);if(bad.length)add(`${nm} : ${S1(c.ws[0])} et ${S1(c.ws[1])} ne peuvent pas être portés par la même figurine (figurine${bad.length>1?"s":""} ${bad.map(i=>i+1).join(", ")}).`,bad)}});
 if(!live.length)issues.push({lvl:"orange",unk:1,msg:`${nm} : aucune restriction d'équipement connue — composition à vérifier.`,m:[]});
 else if(!issues.length&&unconf>0&&conf===0)issues.push({lvl:"orange",unk:1,msg:`${nm} : restrictions extraites du PDF, pas encore confirmées.`,m:[]});
 if(mm.asm&&!mm.cust&&live.some(c=>c.t==="role"||c.t==="excl"))issues.push({lvl:"orange",asm:1,msg:`${nm} : répartition des armes entre les figurines supposée (vérifie-la).`,m:[]});
 const st=issues.some(i=>i.lvl==="red")?"red":issues.length?"orange":"green";
 return{st,issues,models:mm,summary:summary(M),lines:summaryW(M)}}
function validateArmy(units,consOf){const rs=units.map(u=>({u,v:validate(u,consOf(u))}));const st=rs.some(r=>r.v.st==="red")?"red":rs.some(r=>r.v.st==="orange")?"orange":"green";
 return{st,rs,n:{red:rs.filter(r=>r.v.st==="red").length,orange:rs.filter(r=>r.v.st==="orange").length,green:rs.filter(r=>r.v.st==="green").length}}}

/* ---------- extraction depuis le texte des fiches (formulations françaises) ---------- */
const NUM={un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6};
const numOf=s=>{s=String(s||"").toLowerCase().trim();return NUM[s]!=null?NUM[s]:(/^\d+$/.test(s)?+s:0)};
function items(s){return String(s||"").replace(/[.;:]+$/,"").split(/\s*,\s*|\s+ou\s+|\s+et\s+/i).map(x=>x.replace(/^(?:de |d'|d’|du |des |la |le |les |l'|l’|un |une |son |sa |ses )+/i,"").trim()).filter(x=>x&&x.length<60)}
function extract(lines,known,unitName){const text=(Array.isArray(lines)?lines.join(" "):String(lines||"")).replace(/\s+/g," ");
 const sents=text.split(/(?<=[.;])\s+|▪|•|■/).map(s=>s.trim()).filter(s=>s.length>12);const out=[];
 const kw=b=>(known||[]).find(k=>same(k,b))||b;
 const push=(c,s)=>{c.id=cid();c.st="pdf";c.src={doc:"Fiche importée (PDF)",unit:unitName||"",ver:"V11",passage:s.slice(0,240)};out.push(c)};
 sents.forEach(s=>{
  let m;
  const verb="(?:peut|peuvent)\\s+(?:être\\s+équipée?s?\\s+(?:de\\s+|d['’]\\s*|avec\\s+)|remplacer\\s+(?:son|sa|ses|leur|leurs|\\S+)?\\s*[^,]*?\\s+par\\s+|avoir\\s+)";
  if((m=new RegExp("^(?:jusqu['’]à)\\s+(un|une|deux|trois|quatre|cinq|six|\\d+)\\s+figurines?\\s+(?:de cette unité\\s+)?"+verb+"(.+)$","i").exec(s))){const n=numOf(m[1]);items(m[2]).forEach(w=>{if(n)push({t:"max",w:kw(w),n},s)});return}
  if((m=new RegExp("^une\\s+(?:seule\\s+)?figurine\\s+(?:de cette unité\\s+)?"+verb+"(.+)$","i").exec(s))){items(m[1]).forEach(w=>push({t:"max",w:kw(w),n:1},s));return}
  if((m=new RegExp("^(?:le|la)\\s+(sergent|chef d['’]unité|meneur|champion|sergent-chef|[a-zéèêàù\\-]+)\\s+"+verb+"(.+)$","i").exec(s))&&!/^(une|un|chaque|jusqu|cette)$/i.test(m[1])){const role=m[1].replace(/^chef d['’]unité$/i,"chef d'unité");items(m[2]).forEach(w=>push({t:"role",w:kw(w),role,n:1},s));return}
  if((m=/(?:ne\s+peut\s+pas|ne\s+peuvent\s+pas)\s+être\s+équipée?s?\s+simultanément\s+(?:de\s+|d['’]\s*|avec\s+)(.+?)\s+et\s+(?:de\s+|d['’]\s*|avec\s+)?(.+?)[.;]?$/i.exec(s))){const a=items(m[1])[0],b=items(m[2])[0];if(a&&b)push({t:"excl",ws:[kw(a),kw(b)]},s);return}
  if((m=/^à\s+la\s+place\s+(?:de|d'|d’)\s*(?:son|sa|ses|leur)?\s*(.+?),\s*.*?(?:peut|peuvent)\s+(?:avoir|être\s+équipée?s?\s+(?:de\s+|d['’]\s*|avec\s+))(.+?)[.;]?$/i.exec(s))){const a=items(m[1])[0],b=items(m[2])[0];if(a&&b)push({t:"excl",ws:[kw(a),kw(b)]},s)}
 });
 const seen=new Set();return out.filter(c=>{const k=sig(c);if(seen.has(k))return false;seen.add(k);return true})}

/* ---------- groupes de variantes : fiche de référence ---------- */
const cfgName=(w,others)=>{const d=w.filter(x=>!others.every(o=>o.some(y=>same(x,y))));const n=(d.length?d:w).map(cap);return n.length?n.join(", "):"Équipement standard"};
function regroup(S){S.eqc=S.eqc&&typeof S.eqc==="object"?S.eqc:{};S.eqx=Array.isArray(S.eqx)?S.eqx:[];const g=new Map();
 Object.values(S.coll||{}).forEach(m=>{const k=nn(m.name);if(!k)return;(g.get(k)||g.set(k,[]).get(k)).push(m)});
 let n=0;g.forEach((a,k)=>{
  let prim=a.find(m=>m.prim&&!(m.mrg&&S.coll[m.mrg]))||a.find(m=>!m.var)||a[0];
  a.forEach(m=>{if(m===prim){delete m.mrg;m.prim=1;delete m.var;delete m.vd}else{m.mrg=prim.ref;delete m.prim}});
  const bw=a.map(m=>poolOf(m).map(x=>x.b));
  prim.cfgs=a.map((m,i)=>({ref:m.ref,name:cfgName(bw[i],bw.filter((_,j)=>j!==i)),w:bw[i]}));
  const pool=new Map();a.forEach(m=>(m.weapons||[]).forEach(w=>{const kk=nk(w.name);if(kk&&!pool.has(kk))pool.set(kk,JSON.parse(JSON.stringify(w)))}));
  prim.eqw=[...pool.values()];
  if(a.length>1)n++;
  /* restrictions candidates lues dans le texte des fiches du groupe */
  const cons=S.eqc[k]=S.eqc[k]||[],have=new Set(cons.map(sig)),rej=new Set(S.eqx);
  const names=[...pool.values()].map(w=>wbase(w.name));
  a.forEach(m=>{if(!(m.text&&m.text.length))return;extract(m.text,names,m.name).forEach(c=>{const s=sig(c);if(have.has(s)||rej.has(k+"#"+s))return;have.add(s);cons.push(c)})})});
 return n}
const consKey=u=>nn(u&&u.name);
const consOf=(S,u)=>(S.eqc&&S.eqc[consKey(u)])||[];
function groupRefs(S,ref){const m=S.coll[ref];if(!m)return[ref];const p=m.mrg&&S.coll[m.mrg]?S.coll[m.mrg]:m;return Object.values(S.coll).filter(x=>x.ref===p.ref||x.mrg===p.ref).map(x=>x.ref)}
function addCons(S,u,c){const k=consKey(u);(S.eqc[k]=S.eqc[k]||[]).push(Object.assign({id:cid()},c));return S.eqc[k]}
function rejectCons(S,u,id){const k=consKey(u),a=S.eqc[k]||[],c=a.find(x=>x.id===id);if(!c)return;if(c.st==="pdf"&&!c.manual)S.eqx.push(k+"#"+sig(c));S.eqc[k]=a.filter(x=>x.id!==id)}
/* applique une répartition par figurine à une unité de liste (met à jour armes + équipement) */
function applyModels(unit,models,pool){const names=new Set();models.forEach(m=>m.w.forEach(w=>names.add(nk(w))));
 const prof=[];(pool||[]).concat(unit.weapons||[]).forEach(w=>{if(names.has(nk(wbase(w.name)))&&!prof.some(x=>nk(x.name)===nk(w.name)))prof.push(JSON.parse(JSON.stringify(w)))});
 unit.weapons=prof;unit.equip=equipString(models);unit.eq={m:models.map(m=>({r:m.r||"",w:m.w.slice()})),cust:1}}
root.EQ={S1,nk,nn,wbase,cap,same,parseEquip,poolOf,sizeOf,derive,modelsOf,summary,summaryW,countsOf,equipString,describe,sig,validate,validateArmy,extract,regroup,consKey,consOf,groupRefs,addCons,rejectCons,applyModels,ST,stLabel,isConf,cid};
if(typeof module!=="undefined")module.exports=root.EQ;
})(typeof window!=="undefined"?window:globalThis);
