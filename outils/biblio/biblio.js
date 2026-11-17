/* ===== HAMMER · Bibliothèque de données V11 (Space Marines + Orks) =====
   Base de référence INDÉPENDANTE de la collection (IndexedDB « hammer-biblio »).
   Rapprochement toujours manuel ; rien n'est jamais écrasé en silence. 100 % local après téléchargement. */
(function(){
"use strict";
if(typeof S==="undefined")return;
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sv=()=>{try{save()}catch(_){}};
const nk=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9+]+/g," ").trim();
const DEF_SRC="https://raw.githubusercontent.com/delevallez62-lgtm/armees40k-app./main/data/biblio/";
const LB=()=>{const l=S.lib=S.lib&&typeof S.lib==="object"?S.lib:{};l.links=l.links||{};l.bk=l.bk||{};l.news=l.news||[];l.tr=l.tr||{};l.tm=l.tm||{};if(l.auto==null)l.auto=true;if(!l.src)l.src=DEF_SRC;return l};
const clone=o=>o===undefined?o:JSON.parse(JSON.stringify(o));
/* ---------- SHA-1 (sans dépendance, fonctionne aussi hors contexte sécurisé) ---------- */
function sha1(str){const u=new TextEncoder().encode(str),l=u.length,n=((l+8)>>6)+1,w=new Uint32Array(n*16);
 for(let i=0;i<l;i++)w[i>>2]|=u[i]<<(24-(i&3)*8);w[l>>2]|=0x80<<(24-(l&3)*8);w[n*16-1]=l*8;
 let h0=0x67452301,h1=0xEFCDAB89,h2=0x98BADCFE,h3=0x10325476,h4=0xC3D2E1F0;const x=new Uint32Array(80),rl=(v,b)=>(v<<b)|(v>>>(32-b));
 for(let i=0;i<n;i++){for(let j=0;j<16;j++)x[j]=w[i*16+j];for(let j=16;j<80;j++)x[j]=rl(x[j-3]^x[j-8]^x[j-14]^x[j-16],1);
  let a=h0,b=h1,c=h2,d=h3,e=h4;
  for(let j=0;j<80;j++){const f=j<20?(b&c)|(~b&d):j<40?b^c^d:j<60?(b&c)|(b&d)|(c&d):b^c^d,k=j<20?0x5A827999:j<40?0x6ED9EBA1:j<60?0x8F1BBCDC:0xCA62C1D6,t=(rl(a,5)+f+e+k+x[j])>>>0;e=d;d=c;c=rl(b,30)>>>0;b=a;a=t}
  h0=(h0+a)>>>0;h1=(h1+b)>>>0;h2=(h2+c)>>>0;h3=(h3+d)>>>0;h4=(h4+e)>>>0}
 return[h0,h1,h2,h3,h4].map(v=>v.toString(16).padStart(8,"0")).join("")}
/* ---------- stockage séparé : IndexedDB ---------- */
let DBP=null;
const idb=()=>DBP||(DBP=new Promise((ok,ko)=>{try{const r=indexedDB.open("hammer-biblio",1);r.onupgradeneeded=()=>{const d=r.result;d.createObjectStore("chunks",{keyPath:"id"});d.createObjectStore("prev",{keyPath:"id"});d.createObjectStore("meta",{keyPath:"id"})};r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)}catch(e){ko(e)}}));
const tx=(st,mode,fn)=>idb().then(d=>new Promise((ok,ko)=>{const t=d.transaction(st,mode),s=t.objectStore(st),r=fn(s);t.oncomplete=()=>ok(r&&r.result);t.onerror=()=>ko(t.error);t.onabort=()=>ko(t.error)}));
const idbGet=(st,id)=>tx(st,"readonly",s=>s.get(id));
const idbAll=st=>tx(st,"readonly",s=>s.getAll());
const idbPut=(st,o)=>tx(st,"readwrite",s=>s.put(o));
const idbDel=(st,id)=>tx(st,"readwrite",s=>s.delete(id));
async function prune(man){const keep=new Set((man.chunks||[]).map(c=>c.id));for(const r of await idbAll("chunks"))if(!keep.has(r.id))await idbDel("chunks",r.id)}
async function gunzip(b64){const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
 const rs=new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip")));return rs.text()}
const D={fr:{},frN:0,ready:false,man:null,chunks:{},units:[],byId:{},dets:[],enh:[],str:[],rules:[],err:null,origin:""};
const normN=s=>String(s||"").toLowerCase().replace(/’/g,"'").replace(/\[.*?\]/g,"").replace(/[^a-z0-9]/g,"");
function index(){D.units=[];D.dets=[];D.enh=[];D.str=[];D.rules=[];D.byId={};D.fr={};D.frN=0;const ext={};
 Object.entries(D.chunks).forEach(([id,c])=>{
  if(id==="fr"){D.fr=c.tr||{};D.frN=Object.keys(D.fr).length;return}
  const g=id.replace(/^wp-/,"");
  (c.units||[]).forEach(u=>{u._c=g;u.src=u.src||"bsdata";D.units.push(u);D.byId[u.id]=u});
  if(c.ext)Object.entries(c.ext).forEach(([k,e])=>{(ext[g]=ext[g]||{})[k]=e});
  (c.detachments||[]).forEach(x=>{x._c=g;D.dets.push(x)});(c.enhancements||[]).forEach(x=>{x._c=g;D.enh.push(x)});(c.stratagems||[]).forEach(x=>{x._c=g;D.str.push(x)});(c.rules||[]).forEach(x=>D.rules.push(x))});
 D.units.forEach(u=>{if(!u.wp){const e=(ext[u._c]||{})[normN(u.n)];if(e)u.wp=e}});
 D.units.forEach(u=>{if(u.ab)u.ab=u.ab.filter(a=>!/^\s*templar vows\b/i.test(a.n))});
 D.units.sort((a,b)=>a.n.localeCompare(b.n))}
async function loadFromIdb(){const m=await idbGet("meta","manifest");if(!m)return false;const rows=await idbAll("chunks"),ch={};rows.forEach(r=>{ch[r.id]=JSON.parse(r.raw)});D.man=m.man;D.origin=m.origin||"";D.chunks=ch;index();return true}
async function importEmbedded(){const em=window.__BIBLIO;if(!em)throw new Error("Aucune donnée intégrée");
 const raws={};for(const c of em.manifest.chunks){const t=await gunzip(em.chunks[c.id]);if(sha1(t)!==c.sha1)throw new Error("Intégrité : "+c.id);raws[c.id]=t}
 for(const c of em.manifest.chunks)await idbPut("chunks",{id:c.id,raw:raws[c.id],sha1:c.sha1});
 await idbPut("meta",{id:"manifest",man:em.manifest,origin:"embedded",at:Date.now()})}
let INIT=null;
function init(){if(INIT)return INIT;INIT=(async()=>{try{
  const em=window.__BIBLIO;let m=null;try{m=await idbGet("meta","manifest")}catch(_){}
  if(!m||(m.origin==="embedded"&&em&&m.man.version!==em.manifest.version))await importEmbedded();
  await loadFromIdb();D.ready=true;D.err=null;setTimeout(()=>{try{syncAll();snapAll()}catch(_){}},0)}catch(e){D.err=e&&e.message||String(e)}
  return D})();return INIT}
/* ---------- traduction : vocabulaire officiel français connu, jamais inventé ---------- */
// Chaque paire a été retrouvée dans les règles de base françaises officielles, les fiches françaises ou l'encyclopédie V11 de l'appli.
const KW={"infantry":"Infanterie","vehicle":"Véhicule","monster":"Monstre","character":"Personnage","battleline":"Ligne","walker":"Marcheur","titanic":"Titanesque","fortification":"Fortification","grenades":"Grenades","explosives":"Explosifs","psyker":"Psyker","frame":"Châssis","dedicated transport":"Transport assigné","leader":"Meneur","support":"Appui","fly":"Vol","epic hero":"Héros épique","mounted":"Monté","transport":"Transport","daemon":"Daemon","imperium":"Imperium"};
const WK={"assault":"Assaut","heavy":"Lourd","rapid fire":"Tir rapide","melta":"Fusion","ignores cover":"Ignore le couvert","twin-linked":"Jumelé","lethal hits":"Touches fatales","sustained hits":"Touches soutenues","devastating wounds":"Blessures dévastatrices","blast":"Déflagration","cleave":"Abattage","torrent":"Torrent","hazardous":"À risque","indirect fire":"Tir indirect","close-quarters":"Combat rapproché","pistol":"Pistolet","precision":"Précision","extra attacks":"Attaques bonus","lance":"Lance","psychic":"Psychique","one shot":"Tir unique"};
const AB={"deep strike":"Frappe en profondeur","lone operative":"Agent solitaire","feel no pain":"Insensible à la douleur","deadly demise":"Destruction néfaste","firing deck":"Pont de tir","leader":"Meneur"};
const PH={"command phase":"Phase de Commandement","movement phase":"Phase de Mouvement","shooting phase":"Phase de Tir","charge phase":"Phase de Charge","fight phase":"Phase de Combat"};
const cap1=s=>s.charAt(0).toUpperCase()+s.slice(1);
function trWords(s){ // « non-Monster/Vehicle » → « non-Monstre/Véhicule » seulement si tous les mots sont connus
 const parts=String(s).split(/([\/,\s:]+|non-)/i);let ok=true,out=parts.map(p=>{if(!p||/^([\/,\s:]+|non-)$/i.test(p))return p;const k=p.toLowerCase().replace(/s$/,"");const f=KW[p.toLowerCase()]||KW[k];if(f)return/^[A-ZÀ-Ý]+$/.test(p)&&p.length>2?f.toUpperCase():f;if(/^(d?\d*d?\d*\+?)$/i.test(p)||/^\d+\+?$/.test(p))return p;ok=false;return p});return ok?out.join(""):null}
function tWK(en){const s=String(en||"").trim();if(!s)return{t:s,st:"no"};
 const m=/^(anti)-(.+?)\s*(\d\+)?$/i.exec(s);if(m){const x=KW[m[2].toLowerCase().replace(/\s+/g," ").replace(/^non-/,"")];if(x)return{t:"Anti-"+x+(m[3]?" "+m[3]:""),st:"ok"}}
 const m2=/^([A-Za-z' -]+?)\s*((?:D?\d+[+]?|D\d)?)\s*(?::\s*(.+))?$/.exec(s);if(m2){const base=m2[1].trim().toLowerCase(),f=WK[base];if(f){let t=f+(m2[2]?" "+m2[2]:"");if(m2[3]){const w=trWords(m2[3]);if(w===null)return{t:s,st:"no"};t+=": "+w}return{t,st:"ok"}}}
 return{t:s,st:"no"}}
function tKW(en){const s=String(en||"").trim(),f=KW[s.toLowerCase()];return f?{t:f,st:"ok"}:{t:s,st:"no"}}
function tAB(en){const s=String(en||"").trim(),u=LB().tr["n:"+nk(s)];if(u&&u.fr)return{t:u.fr,st:u.st||"ok",src:"user"};
 {const pm=/^(.*?)\s*((?:D?\d+(?:\")?\+?|D\d)(?:\+\d)?)$/.exec(s);if(pm){const bu=LB().tr["b:"+nk(pm[1])];if(bu&&bu.fr)return{t:bu.fr+" "+pm[2],st:"ok",src:"user"}}}
 const m=/^([A-Za-z' -]+?)\s*((?:D?\d+(?:")?\+?|D\d)?)\s*(\(.*\))?$/.exec(s);if(m){const f=AB[m[1].trim().toLowerCase()];if(f)return{t:f+(m[2]?" "+m[2]:"")+(m[3]?" "+m[3]:""),st:"ok"}}const ov=D.fr[hh(s)];return ov&&nk(ov.fr)!==nk(s)?(LB().vall?{t:ov.fr,st:"ok",src:"validé"}:{t:s,st:"chk",prop:ov.fr,src:"claude"}):{t:s,st:"no"}}
/*__RULES__*/
const twRule=x=>{const t=tName(x);return t.st==="ok"?t.t:(t.prop||x)};
const hh=t=>sha1(nk(stripMd(t))).slice(0,12);
function sents(t){return stripMd(t).split(/\n+/).flatMap(l=>l.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9■•(\[])/)).map(x=>x.trim()).filter(Boolean)}
function trDesc(en){const tm=LB().tm,k=hh(en),all=tm["t:"+k];if(all)return{t:all.fr,st:"ok",src:"user",k};
 const ov=D.fr[k];if(ov&&nk(ov.fr)!==nk(en))return LB().vall?{t:ov.fr,st:"ok",src:"validé",k}:{t:en,st:"chk",prop:ov.fr,src:"claude",k};
 const rr=ruleTr(en,twRule);if(rr)return LB().vall?{t:rr,st:"ok",src:"validé",k}:{t:en,st:"chk",prop:rr,src:"regles",k};
 const ss=sents(en);if(ss.length<2)return{t:en,st:"no",k};const out=[];for(const x of ss){const e=tm["s:"+hh(x)];if(!e)return{t:en,st:"no",k};out.push(e.fr)}return{t:en,st:"chk",prop:out.join(" "),src:"user",k}}
function frBodyOf(m,name){const names=String(m.apt||"").split(",").map(x=>x.trim()).filter(Boolean),k=nk(name),L=m.text||[];let cur=null;const seg=[];
 for(const l of L){const lk=nk(l);const hit=names.find(n=>{const nn=nk(n);return nn&&(lk===nn||lk.startsWith(nn+" "))});if(hit){cur={n:hit,lines:[String(l).trim().slice(hit.length).trim()].filter(Boolean)};seg.push(cur)}else if(cur)cur.lines.push(String(l).trim())}
 const f=seg.find(x=>nk(x.n)===k);return f?f.lines.join("\n").trim():""}
function learnAb(m,ab,frName){const lb=LB(),en=String(ab.n).trim();lb.tr["n:"+nk(en)]={fr:frName,st:"ok",src:"user",at:Date.now()};
 const P=/^(.*?)\s*((?:D?\d+(?:\")?\+?|D\d)(?:\+\d)?)?$/,a=P.exec(en),b=P.exec(String(frName).trim());if(a&&b&&a[2]&&a[2]===b[2]&&nk(a[1])&&nk(b[1]))lb.tr["b:"+nk(a[1])]={fr:b[1].trim(),st:"ok",src:"user",at:Date.now()};
 const body=frBodyOf(m,frName);if(!body)return"nom";const enT=stripMd(ab.d||"");lb.tm["t:"+hh(enT)]={en:enT,fr:body,name:{en,fr:frName},st:"ok",at:Date.now()};
 const se=sents(enT),sf=sents(body);if(se.length>1&&se.length===sf.length)se.forEach((x,i)=>{const k="s:"+hh(x);if(!lb.tm[k])lb.tm[k]={en:x,fr:sf[i],st:"chk",at:Date.now()}});return"texte"}
function tName(en){const s=String(en||"").trim(),u=LB().tr["n:"+nk(s)];if(u&&u.fr)return{t:u.fr,st:u.st||"ok",src:"user"};const ov=D.fr[hh(s)];if(ov&&nk(ov.fr)!==nk(s))return LB().vall?{t:ov.fr,st:"ok",src:"validé"}:{t:s,st:"chk",prop:ov.fr,src:"claude"};const wn=WN[s.toLowerCase().replace(/^➤\s*/,"")];return wn?(LB().vall?{t:wn,st:"ok",src:"validé"}:{t:s,st:"chk",prop:wn,src:"glossaire"}):{t:s,st:"no"}}
function tPhase(en){const s=String(en||"").trim(),f=PH[s.toLowerCase()];return f?{t:f,st:"ok"}:{t:s,st:"no"}}
const SB={ok:["🟢","Traduction confirmée"],chk:["🟠","À vérifier"],no:["⚪","Non traduit"]};
const badge=st=>`<span class="bib-st ${st}" title="${SB[st][1]}">${SB[st][0]}</span>`;
const show=r=>r.st==="ok"?r.t:r.t; // un texte « à vérifier » ou « non traduit » reste affiché tel qu'il est dans la source
/* ---------- conversions vers le format de HAMMER ---------- */
const nm=x=>String(x==null?"":x).replace(/"/g,"").trim();
const stripMd=s=>String(s||"").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1").replace(/■/g,"•");
function wToApp(w,melee){const name=String(w.n).replace(/^➤\s*/,""),cp=(w.kw||[]).map(k=>{const r=tWK(k);return r.t}).filter(x=>x&&x!=="-").join(", ");
 const tn=tName(name);return{name:tn.t,range:melee?"Mêlée":nm(w.r),a:nm(w.a),hit:(h=>h==="N/A"?"-":/^\d$/.test(h)?h+"+":h)(nm(w.sk)),f:nm(w.s),pa:nm(w.ap),d:nm(w.d),caps:cp}}
const wSig=w=>[String(w.range||"").toLowerCase().replace(/m[êe]l[ée]e|melee/,"m"),w.a,w.hit==="N/A"?"-":w.hit,w.f,w.pa,w.d].map(x=>String(x==null?"":x).replace(/\s/g,"").toLowerCase()).join("|");
const statOf=(p,k)=>nm(p&&p[k]);
function profOf(u,i){return u.pr[Math.max(0,Math.min(u.pr.length-1,i||0))]}
/* ---------- suggestions : jamais de rapprochement automatique ---------- */
const STOP=new Set(["squad","unit","units","escouade","space","marine","marines","the","de","du","des","la","le","les","d","l","of","and","et","with","avec","sur","pour","in"]);
const toks=s=>nk(s).split(" ").filter(w=>w&&!STOP.has(w)).map(w=>w.replace(/(s|x)$/,""));
function suggest(m){const T=toks(m.name),alias=LB().tr["n:"+nk(m.name)];const out=[];if(!T.length)return out;
 D.units.forEach(u=>{const U=toks(u.n),fr=LB().tr["n:"+nk(u.n)],F=fr?toks(fr.fr):[];let sc=0;
  const hit=a=>a.filter(w=>T.includes(w)).length;const h=Math.max(hit(U),hit(F));if(!h)return;
  sc=h/Math.max(T.length,U.length||1);if(nk(u.n)===nk(m.name))sc=1;if(sc>=.5)out.push({u,sc})});
 return out.sort((a,b)=>b.sc-a.sc||a.u.n.localeCompare(b.u.n)).slice(0,8)}
function search(q,fac){const k=nk(q),w=k.split(" ").filter(Boolean);
 return D.units.filter(u=>(!fac||inFac(u,fac))&&(!w.length||w.every(x=>(nk(u.n)+" "+nk((LB().tr["n:"+nk(u.n)]||{}).fr||"")+" "+nk((u.kw||[]).join(" "))).includes(x)))).slice(0,60)}
/* ---------- rapprochement : comparaison puis choix ---------- */
/* arme « déjà présente » : mêmes chiffres (≥5 sur 6) + nom qui se ressemble un peu + capacités proches */
const bg=t=>{t=nk(t).replace(/ /g,"");const o=new Set();for(let i=0;i<t.length-1;i++)o.add(t.slice(i,i+2));return o};
const dice=(a,b)=>{const A=bg(a),B=bg(b);if(!A.size||!B.size)return 0;let i=0;A.forEach(x=>{if(B.has(x))i++});return 2*i/(A.size+B.size)};
const capSet=t=>new Set(nk(String(t||"")).split(" ").filter(w=>w.length>2));
const capSim=(a,b)=>{const A=capSet(a),B=capSet(b);if(!A.size&&!B.size)return 1;if(!A.size||!B.size)return 0;let i=0;A.forEach(x=>{if(B.has(x))i++});return i/(A.size+B.size-i)};
function wLike(aw,mw,names){const A=wSig(aw).split("|"),B=wSig(mw).split("|");let eq=0;for(let i=0;i<6;i++)if(A[i]===B[i])eq++;if(eq<5)return false;
 const ns=[aw.name].concat(names||[]).filter(Boolean),base=x=>nk(String(x).replace(/^➤\s*/,"").split(" - ")[0]);
 const nameOk=ns.some(n=>dice(base(n),base(mw.name))>=.3||dice(n,mw.name)>=.3);
 return nameOk&&capSim(aw.caps,mw.caps)>=.5}
function buildCmp(m,u,pi){const p=profOf(u,pi),rows={stats:[],weapons:[],abil:[],kw:[],misc:[]};
 const ms=m.stats||{};["M","E","SV","PV","CD","CO"].forEach(k=>{const lib=statOf(p,k),mine=String(ms[k]==null?"":ms[k]).trim();
  if(!lib)return;if(!mine)rows.stats.push({id:"st:"+k,k,lib,mine,kind:"add"});else if(nk(mine)!==nk(lib))rows.stats.push({id:"st:"+k,k,lib,mine,kind:"diff"});else rows.stats.push({id:"st:"+k,k,lib,mine,kind:"same"})});
 const mine=(m.weapons||[]).map(w=>({w,s:wSig(w),n:nk(w.name)}));
 const libW=[...(u.rw||[]).map(w=>({lw:w,aw:wToApp(w,false)})),...(u.mw||[]).map(w=>({lw:w,aw:wToApp(w,true)}))];
 libW.forEach((x,i)=>{const s=wSig(x.aw),same=mine.find(y=>y.s===s)||mine.find(y=>wLike(x.aw,y.w,[String(x.lw.n)])),byName=mine.find(y=>y.n===nk(x.aw.name)||y.n===nk(String(x.lw.n).replace(/^➤\s*/,"")));
  if(same)rows.weapons.push({id:"w:"+i,x,kind:"same",mine:same.w,learn:nk(same.w.name)!==nk(x.aw.name)});
  else if(byName)rows.weapons.push({id:"w:"+i,x,kind:"diff",mine:byName.w});
  else rows.weapons.push({id:"w:"+i,x,kind:"add"})});
 const have=new Set([...String(m.apt||"").split(",").map(nk),...(m.text||[]).map(l=>nk(String(l).slice(0,60)))].filter(Boolean));
 const hasAb=n=>{const k=nk(n);if(!k)return false;if(have.has(k))return true;return[...have].some(h=>h.startsWith(k)||(k.startsWith(h)&&h.length>5))};
 (u.ab||[]).forEach((a,i)=>{const t=tAB(a.n),ex=hasAb(a.n)||hasAb(t.t);rows.abil.push({id:"a:"+i,a,t,kind:ex?"same":"add"})});
 const mk=new Set(String(m.kw||"").split(",").map(x=>nk(x)).filter(Boolean));
 (u.kw||[]).forEach((k,i)=>{const t=tKW(k);if(!(mk.has(nk(k))||mk.has(nk(t.t))))rows.kw.push({id:"k:"+i,k,t,kind:"add"})});
 const pts=u.pts;if(pts!=null){const mp=+m.pts||0;rows.misc.push({id:"pts",lib:String(pts),mine:mp?String(mp):"",kind:!mp?"add":(mp===pts?"same":"diff")})}
 return rows}
/* fiche liée = toutes les armes de la version anglaise toujours présentes sur la fiche de collection (sans validation) */
function syncOne(ref){const lb=LB(),lk=lb.links[ref],m=S.coll[ref];if(!lk||!m||!D.ready)return 0;const u=D.byId[lk.id];if(!u)return 0;
 const rows=buildCmp(m,u,lk.prof||0);m.weapons=Array.isArray(m.weapons)?m.weapons:[];let n=0;
 rows.weapons.forEach(r=>{if(r.kind==="add"){m.weapons.push(clone(r.x.aw));n++}});return n}
function syncAll(){if(!D.ready)return 0;let t=0;try{Object.keys(LB().links||{}).forEach(r=>{try{t+=syncOne(r)}catch(_){}})}catch(_){}if(t){sv();Object.keys(AM).forEach(k=>delete AM[k])}return t}
window.BIBSYNC=function(p){try{if(p&&p.ref&&S.coll[p.ref]===p&&syncOne(p.ref))sv()}catch(_){}return""};
setInterval(()=>{try{if(LB()&&Object.keys(LB().links||{}).length)syncAll()}catch(_){}},4000);
function autoLink(m,u){const pi=(u.pr.findIndex(p=>nk(p.n)===nk(u.n))>=0?u.pr.findIndex(p=>nk(p.n)===nk(u.n)):0),rows=buildCmp(m,u,pi),pick={};let n=0;rows.weapons.forEach(r=>{if(r.kind==="add"){pick[r.id]=true;n++}});applyCmp(m,u,pi,rows,pick,{});snapEq(m,u,u.wp||{});delete AM[m.ref];BD.open[m.ref]=true;return n}
function applyCmp(m,u,pi,rows,pick,map){map=map||{};const ref=m.ref,lb=LB();const bk={stats:clone(m.stats),weapons:clone(m.weapons),apt:m.apt,text:clone(m.text),kw:m.kw,pts:m.pts,at:Date.now()};lb.bk[ref]=bk;
 const done=[];const p=profOf(u,pi);m.stats=m.stats||{};
 rows.stats.forEach(r=>{if(pick[r.id]){m.stats[r.k]=r.lib;done.push(r.k)}});
 m.weapons=Array.isArray(m.weapons)?m.weapons:[];
 rows.weapons.forEach(r=>{const c=pick[r.id];if(!c)return;
  if(r.kind==="add"){m.weapons.push(clone(r.x.aw));done.push("arme:"+r.x.aw.name)}
  else if(r.kind==="diff"){const i=m.weapons.indexOf(r.mine);if(i>=0){const keepName=m.weapons[i].name;m.weapons[i]=Object.assign(clone(r.x.aw),{name:keepName});done.push("arme:"+keepName)}}
  if(r.kind==="same"&&r.learn&&pick["ln:"+r.id]){const en=String(r.x.lw.n).replace(/^➤\s*/,"");lb.tr["n:"+nk(en)]={fr:r.mine.name,st:"ok",src:"user",at:Date.now()};done.push("nom:"+en)}});
 const apt=String(m.apt||"").split(",").map(s=>s.trim()).filter(Boolean);m.text=Array.isArray(m.text)?m.text:[];
 rows.abil.forEach(r=>{if(r.kind==="add"&&map[r.id]){const w=learnAb(m,r.a,map[r.id]);done.push("association:"+r.a.n+" ↔ "+map[r.id]+" ("+w+")");return}
  if(r.kind==="add"&&pick[r.id]){const name=r.t.t;if(!apt.some(x=>nk(x)===nk(name)))apt.push(name);const body=stripMd(r.a.d).split("\n").map(s=>s.trim()).filter(Boolean);m.text.push((name+" "+(body[0]||"")).trim());body.slice(1).forEach(l=>m.text.push(l));done.push("capacité:"+name)}});
 m.apt=apt.join(", ");
 const kws=String(m.kw||"").split(",").map(s=>s.trim()).filter(Boolean);rows.kw.forEach(r=>{if(pick[r.id]){kws.push(r.t.t);done.push("mot-clé:"+r.t.t)}});m.kw=kws.join(", ");
 rows.misc.forEach(r=>{if(r.id==="pts"&&pick[r.id]){m.pts=+r.lib;done.push("points")}});
 lb.links[ref]={id:u.id,h:u.h,v:D.man.version,at:Date.now(),prof:pi,applied:done,stale:false};snapEq(m,u,u.wp||{});
 if(pick.info&&u.wp){lb.links[ref].info={loadout:u.wp.loadout,comp:u.wp.comp,opt:u.wp.opt,src:"Wahapedia",at:Date.now()};done.push("informations de référence")}
 sv();return done}
function undoLink(ref,restore){const lb=LB(),m=S.coll[ref];if(!m)return;const bk=lb.bk[ref];if(restore&&bk){m.stats=clone(bk.stats);m.weapons=clone(bk.weapons);m.apt=bk.apt;m.text=clone(bk.text);m.kw=bk.kw;m.pts=bk.pts;delete lb.bk[ref]}delete lb.links[ref];sv()}
/* ---------- synchronisation facultative et différentielle ---------- */
function chunkIndex(c){const o={};["units","detachments","enhancements","stratagems"].forEach(k=>(c[k]||[]).forEach(x=>{o[k+":"+x.id]={n:x.n,h:x.h||sha1(JSON.stringify(x,(k,v)=>k[0]==="_"?undefined:v)).slice(0,10)}}));return o}
function diffNews(oldC,newC){const a=chunkIndex(oldC||{}),b=chunkIndex(newC),add=[],chg=[],del=[];
 Object.keys(b).forEach(k=>{if(!a[k])add.push(k);else if(a[k].h!==b[k].h)chg.push(k)});Object.keys(a).forEach(k=>{if(!b[k])del.push(k)});
 const lbl=k=>({units:"fiche",detachments:"détachement",enhancements:"amélioration",stratagems:"stratagème"}[k.split(":")[0]]);
 return{add:add.map(k=>({k,t:lbl(k),n:b[k].n})),chg:chg.map(k=>({k,t:lbl(k),n:b[k].n})),del:del.map(k=>({k,t:lbl(k),n:a[k].n}))}}
async function checkUpdate(manual){const lb=LB();await init();
 if(!navigator.onLine&&!manual)return{state:"off"};
 let man;try{const r=await fetch(lb.src+"manifest.json?"+Date.now(),{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);man=await r.json()}catch(e){lb.last={at:Date.now(),err:String(e.message||e)};sv();return{state:"err",err:lb.last.err}}
 lb.last={at:Date.now()};if(!man||man.schema!==1||!Array.isArray(man.chunks)){lb.last.err="Format de manifeste inconnu";sv();return{state:"err",err:lb.last.err}}
 if(man.game&&D.man&&man.game!==D.man.game){lb.last.err="Autre version des règles ("+man.game+") : mise à jour refusée";sv();return{state:"err",err:lb.last.err}}
 const old={};(D.man&&D.man.chunks||[]).forEach(c=>old[c.id]=c);const todo=man.chunks.filter(c=>!old[c.id]||old[c.id].sha1!==c.sha1);
 if(!todo.length&&D.man&&D.man.version===man.version){sv();return{state:"same"}}
 const got={};
 for(const c of todo){let t;try{const r=await fetch(lb.src+c.file+"?"+c.sha1.slice(0,8),{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);t=await r.text()}catch(e){return{state:"err",err:"Téléchargement "+c.id+" : "+(e.message||e)}}
  if(sha1(t)!==c.sha1)return{state:"err",err:"Intégrité refusée pour "+c.id+" (somme de contrôle différente) : rien n'a été modifié"};got[c.id]=t}
 // tout est vérifié : on peut écrire
 const news={at:Date.now(),from:D.man&&D.man.version,to:man.version,items:{add:[],chg:[],del:[]},seen:false};
 for(const c of todo){const prevC=D.chunks[c.id],nw=JSON.parse(got[c.id]);const df=diffNews(prevC,nw);["add","chg","del"].forEach(k=>news.items[k].push(...df[k]));
  if(prevC){const pr=await idbGet("chunks",c.id);if(pr)await idbPut("prev",{id:c.id,raw:pr.raw,sha1:pr.sha1,man:D.man&&D.man.version})}
  await idbPut("chunks",{id:c.id,raw:got[c.id],sha1:c.sha1})}
 await idbPut("meta",{id:"manifest",man,origin:"sync",at:Date.now()});await prune(man);await loadFromIdb();try{syncAll()}catch(_){}
 // associations conservées ; on signale seulement celles dont la fiche a changé
 let stale=0;Object.entries(lb.links).forEach(([ref,l])=>{const u=D.byId[l.id];if(u&&u.h!==l.h){l.stale=true;stale++}});news.stale=stale;
 if(news.items.add.length||news.items.chg.length||news.items.del.length||stale){lb.news.unshift(news);lb.news=lb.news.slice(0,20)}
 lb.last.ok=man.version;sv();return{state:"updated",news}}
async function exportLib(){await init();const o={kind:"hammer-biblio",schema:1,at:Date.now(),manifest:D.man,chunks:{}};const rows=await idbAll("chunks");rows.forEach(r=>o.chunks[r.id]=r.raw);return JSON.stringify(o)}
async function importLib(txt){let o;try{o=JSON.parse(txt)}catch(_){throw new Error("Fichier illisible")}
 if(!o||o.kind!=="hammer-biblio"||!o.manifest||!o.chunks)throw new Error("Ce n'est pas une sauvegarde de bibliothèque");
 for(const c of o.manifest.chunks){const t=o.chunks[c.id];if(typeof t!=="string"||sha1(t)!==c.sha1)throw new Error("Intégrité refusée : "+c.id)}
 for(const c of o.manifest.chunks)await idbPut("chunks",{id:c.id,raw:o.chunks[c.id],sha1:c.sha1});
 await idbPut("meta",{id:"manifest",man:o.manifest,origin:"restore",at:Date.now()});await prune(o.manifest);await loadFromIdb()}
async function verify(){await init();const rows=await idbAll("chunks"),bad=[];const man={};(D.man.chunks||[]).forEach(c=>man[c.id]=c);
 for(const r of rows){if(!man[r.id]||sha1(r.raw)!==man[r.id].sha1)bad.push(r.id)}
 (D.man.chunks||[]).forEach(c=>{if(!rows.find(r=>r.id===c.id))bad.push(c.id+" (absent)")});return bad}
async function restorePrev(){const rows=await idbAll("prev");if(!rows.length)throw new Error("Aucune version précédente conservée");
 for(const r of rows)await idbPut("chunks",{id:r.id,raw:r.raw,sha1:r.sha1});
 // manifeste reconstruit à partir des chunks restaurés
 const man=clone(D.man);man.chunks.forEach(c=>{const r=rows.find(x=>x.id===c.id);if(r){c.sha1=r.sha1;c.bytes=r.raw.length}});man.version=(rows[0].man||man.version);
 await idbPut("meta",{id:"manifest",man,origin:"restore",at:Date.now()});await loadFromIdb()}
/* ---------- affichage des textes : l'original reste ; une proposition ne le remplace jamais ---------- */
const TXM={};
function trx(en,kind){en=String(en||"");if(!en.trim())return"";const isName=/^nom/.test(kind||""),r=isName?tName(en):trDesc(en),k=hh(en);TXM[k]={en,name:isName};
 const body=E(stripMd(en)).replace(/\n/g,"<br>");
 if(r.st==="ok")return`<div>${md2(r.t)}</div><details><summary class="bib-meta">Texte original anglais</summary><div>${body}</div></details><div class="bib-meta">🟢 Traduction confirmée</div>`;
 if(r.st==="chk"&&r.prop)return`<div>${body}</div><div class="bib-prop">🟠 <b>Traduction proposée (à vérifier)</b><br>${md2(r.prop)}<br><button class="b" data-bibtr="ok" data-k="${k}">✔ Valider</button> <button class="b" data-bibtr="fix" data-k="${k}">✎ Corriger</button></div>`;
 return`<div>${body}</div><div class="bib-meta">⚪ Non traduit (texte original)</div>`}
const md2=t=>E(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/\*(.+?)\*/g,"<i>$1</i>").replace(/\n/g,"<br>");
const nameHtml=en=>{const t=tName(en);return`<b>${E(t.t)}</b>${t.st==="chk"&&t.prop?` <span class="bib-meta">· proposé : ${E(t.prop)}</span>`:""}`};
function storeTr(k,fr){const m=TXM[k];if(!m||!fr)return;const lb=LB();if(m.name)lb.tr["n:"+nk(m.en)]={fr,st:"ok",src:"user",at:Date.now()};else lb.tm["t:"+k]={en:stripMd(m.en),fr,st:"ok",src:"validated",at:Date.now()};sv()}
/* ---------- interface ---------- */
const B={tab:"units",q:"",fac:"",open:null,cmp:null,msg:""};
function css(){if(document.getElementById("bibcss"))return;const s=document.createElement("style");s.id="bibcss";s.textContent=`
.bib-st{font-size:12px;margin-left:4px}.bib-ov{position:fixed;inset:0;z-index:46;background:rgba(5,12,9,.72);display:flex;align-items:flex-end;justify-content:center}
.bib-pn{background:var(--card);color:var(--tx);border-radius:18px 18px 0 0;width:min(640px,100%);max-height:94vh;overflow:auto;padding:14px;box-sizing:border-box}
.bib-pn h2{margin:0 0 6px;font-size:20px}.bib-top{display:flex;align-items:flex-start;gap:8px}.bib-top h2{flex:1;min-width:0}
.bib-row{border:1px solid var(--bd);border-radius:12px;padding:8px 10px;margin:8px 0;background:var(--bg)}.bib-row b{color:var(--ac)}
.bib-d{border-color:#e0a030}.bib-a{border-color:#2e9d6b}.bib-s{opacity:.7}
.bib-ck{display:flex;gap:8px;align-items:flex-start;margin:4px 0;font-size:14px}.bib-ck input{width:22px;height:22px;flex:none;margin-top:1px}
.bib-chips{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.bib-chips button{min-height:36px;padding:2px 10px;border:1px solid var(--bd);border-radius:99px;background:var(--card);color:var(--tx);font:inherit;font-size:13px;cursor:pointer}.bib-chips button.on{background:var(--ac);color:#141008;border-color:var(--ac);font-weight:700}
.bib-meta{font-size:12px;color:var(--mu)}.bib-wl{font-size:13px;color:var(--mu)}.bib-new{border:2px solid var(--ac);border-radius:12px;padding:8px 10px;margin:8px 0}
.bibb{position:absolute;left:4px;top:4px;z-index:3;width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;font-size:15px;padding:0;cursor:pointer;line-height:1}.bibb.on{background:#2e9d6b;border-color:#fff}.bibb.old{background:#e0a030}
.bib-box{position:relative}.bib-two{display:grid;grid-template-columns:1fr 1fr;gap:6px}.bib-two>div{border:1px solid var(--bd);border-radius:8px;padding:4px 6px;font-size:13px}.bib-two label{display:flex;gap:6px;align-items:center;font-size:13px}
.bib-warn{border:1px solid #e0a030;background:rgba(224,160,48,.15);color:inherit;border-radius:99px;padding:0 8px;min-height:24px;font:inherit;font-size:12px;cursor:pointer}.bib-warn.ok{border-color:#2e9d6b;background:rgba(46,157,107,.18)}details.bib-dr>summary{cursor:pointer}.bib-drb{padding:6px 2px}
.bib-lkc{border:1px solid var(--ac);border-radius:12px;padding:12px;margin:12px 0;background:var(--bg)}.bib-lkc>b{font-size:16px;color:var(--ac)}.bib-lkn{font-size:16px;font-weight:700;margin:6px 0 10px}.bib-lkc .b{min-height:44px;font-size:15px}.bib-lkc>.b{width:100%;margin-top:8px}.bib-lnk{background:none;border:0;padding:0 2px;color:var(--ac);text-decoration:underline;font:inherit;cursor:pointer}details.bib-dr>summary{cursor:pointer}#md .pn,#wpk .pn,#bibm .bib-pn{padding-bottom:calc(120px + env(safe-area-inset-bottom,0px))!important}.bib-cs{margin:10px 0;padding:10px;border:1px solid var(--ac);border-radius:12px}.bib-cs>b{color:var(--ac)}.bib-oc{border:1px solid var(--bd);border-radius:12px;padding:8px 10px;margin:8px 0;background:var(--bg)}.bib-oh{font-weight:700;color:var(--ac);margin-bottom:4px}.bib-ol{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:4px 0}.bib-ot{font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--mu);min-width:64px}.bib-chip{display:inline-block;border:1px solid var(--bd);border-radius:99px;padding:2px 10px;background:var(--card);font-size:13.5px}.bib-oa{font-size:12px;color:var(--mu);margin-top:6px}.bib-oa .bib-warn{margin-left:4px}.bib-drb h4{margin:14px 0 4px;color:var(--ac)}
.bib-prop{border:1px dashed #e0a030;border-radius:10px;padding:6px 8px;margin:6px 0;background:rgba(224,160,48,.08);font-size:13.5px}.bib-opt{border-top:1px solid var(--bd);padding:4px 0}.bib-prop .b{min-height:34px;padding:2px 10px;margin-top:4px}
.bib-ban{border:2px solid var(--ac);border-radius:14px;padding:10px 12px;margin:0 0 12px;background:color-mix(in srgb,var(--ac) 12%,transparent);cursor:pointer}
`;document.head.appendChild(s)}
const box=id=>{let b=document.getElementById(id);if(!b){b=document.createElement("div");b.id=id;document.body.appendChild(b)}return b};
const closeM=id=>{const b=document.getElementById(id);if(b)b.innerHTML=""};
const fmtD=t=>{try{return new Date(t).toLocaleDateString("fr-FR")}catch(_){return""}};
const STATS=[["M","M"],["E","E"],["SV","Sv"],["PV","PV"],["CD","Cd"],["CO","CO"]];
function unitHtml(u){const tn=tName(u.n);
 let h=`<h4>${E(u.n)} ${badge(tn.st)}</h4>${tn.st==="ok"?`<p>Nom français : <b>${E(tn.t)}</b></p>`:`<p class="bib-meta">Nom original anglais · pas de traduction confirmée</p>${tn.st==="chk"?trx(u.n,"nom d'unité").replace(/^<div>.*?<\/div>/,""):""}`}<p class="bib-meta">${E(facLbl(u))} · ${u.pts!=null?u.pts+" pts · ":""}${u.sz?"taille "+u.sz.min+(u.sz.max&&u.sz.max!==u.sz.min?"–"+u.sz.max:"")+" · ":""}source : ${u.src==="wahapedia"?"Wahapedia":"BSData"}${u.wp&&u.src!=="wahapedia"?" + Wahapedia":""} · ${E(u.id)}</p>`;
 h+=u.pr.map(p=>`<div class="bib-row"><b>${E(p.n)}</b><div>${STATS.map(([k,l])=>`${l} <b>${E(nm(p[k])||"–")}</b>`).join(" · ")}</div></div>`).join("");
 const W=(a,melee)=>a.map(w=>{const aw=wToApp(w,melee),ks=(w.kw||[]).map(k=>{const r=tWK(k);return`${E(r.t)}${badge(r.st)}`}).join(", ");return`<div class="bib-row"><b>${E(aw.name)}</b> <span class="bib-meta">${E(w.n!==aw.name?w.n:"")}</span><div>${melee?"Mêlée":"Portée "+E(aw.range)+'"'} · A ${E(aw.a)} · ${melee?"CC":"CT"} ${E(aw.hit)} · F ${E(aw.f)} · PA ${E(aw.pa)} · D ${E(aw.d)}</div>${ks?`<div class="bib-wl">${ks}</div>`:""}</div>`}).join("");
 h+=`<h4>Armes de tir (${u.rw.length})</h4>${W(u.rw,false)||'<p class="bib-meta">Aucune</p>'}<h4>Armes de mêlée (${u.mw.length})</h4>${W(u.mw,true)||'<p class="bib-meta">Aucune</p>'}`;
 h+=`<h4>Capacités (${u.ab.length})</h4>${u.ab.map(a=>{const t=tAB(a.n);return`<details class="bib-row"><summary><b>${E(t.t)}</b> ${badge(t.st)}${t.st==="ok"?` <span class="bib-meta">${E(a.n)}</span>`:(t.prop?` <span class="bib-meta">· proposé : ${E(t.prop)}</span>`:"")}</summary>${trx(a.d,"texte de capacité")}</details>`}).join("")||'<p class="bib-meta">Aucune</p>'}`;
 h+=`<h4>Mots-clés</h4><p>${u.kw.map(k=>{const r=tKW(k);return`${E(r.t)}${badge(r.st)}`}).join(", ")}</p>`;
 if(u.wp){const w=u.wp;h+=`<h4>Équipement, composition et options <span class="bib-meta">(Wahapedia)</span></h4><p class="bib-meta">Informations de référence : elles ne bloquent jamais tes listes.</p>`
  +(w.loadout?`<div class="bib-row"><b>Équipement de base</b>${trx(w.loadout,"équipement de base")}</div>`:"")
  +(w.comp&&w.comp.length?`<div class="bib-row"><b>Composition</b>${w.comp.map(t=>`<div class="bib-opt">${trx(t,"composition")}</div>`).join("")}</div>`:"")
  +(w.opt&&w.opt.length?`<div class="bib-row"><b>Options d'équipement</b>${w.opt.map(t=>`<div class="bib-opt">${trx(t,"option d'équipement")}</div>`).join("")}</div>`:"")
  +(w.ledby&&w.ledby.length?`<div class="bib-row"><b>Peut être mené par</b><br>${E(w.ledby.join(", "))}</div>`:"")+(w.leads&&w.leads.length?`<div class="bib-row"><b>Peut mener</b><br>${E(w.leads.join(", "))}</div>`:"")+(w.transport?`<div class="bib-row"><b>Transport</b>${trx(w.transport,"composition")}</div>`:"")}
 else h+=`<p class="bib-meta">Options d'équipement et restrictions : absentes de cette source.</p>`;return h}
const FACN={"space-marines":"Space Marines","orks":"Orks"};
const inFac=(u,g)=>String(g).indexOf("sm:")===0?(u._c==="space-marines"&&(u.f||[]).includes(String(g).slice(3))):u._c===g;
function facList(){const m=new Map();D.units.forEach(u=>{const e=m.get(u._c)||[u._c,FACN[u._c]||(u.f&&u.f[0])||u._c,0];e[2]++;m.set(u._c,e)});
 const L=[...m.values()],ch=new Map();D.units.filter(u=>u._c==="space-marines").forEach(u=>(u.f||[]).forEach(c=>{if(c!=="Space Marines")ch.set(c,(ch.get(c)||0)+1)}));
 ch.forEach((n,c)=>L.push(["sm:"+c,"Space Marines — "+c,n]));
 return L.sort((a,b)=>a[1].localeCompare(b[1]))}
const facLbl=u=>(u._c==="space-marines"&&(u.f||[]).length>1)?"Space Marines":(u.f||[]).join(", ");
function libView(){css();const lb=LB(),man=D.man;
 let h=`<div class="card"><div class="row" style="justify-content:space-between"><b>📚 Bibliothèque V11</b><button class="b" data-bib="menu">⚙ Gérer</button></div>`;
 if(!D.ready){h+=`<p class="mu">${D.err?"Erreur : "+E(D.err):"Chargement de la bibliothèque…"}</p></div>`;if(!D.err)init().then(()=>{try{draw()}catch(_){}});return h}
 h+=`<p class="bib-meta">Version ${E(man.version)} · récupérée le ${E(man.generated||"")} · ${D.units.length} fiches · ${D.dets.length} détachements · ${D.str.length} stratagèmes · ${D.enh.length} améliorations · ${D.frN} traductions proposées (à vérifier)</p><p class="bib-meta">Données communautaires non officielles (BSData / Warhammer Oracle / Wahapedia). Warhammer 40,000 est la propriété de Games Workshop. <a href="#" data-bib="lic">Licences et sources</a></p></div>`;
 const un=lb.news.filter(n=>!n.seen);
 if(lb.news.length)h+=`<details class="card" ${un.length?"open":""}><summary><b>🆕 Nouveautés</b> ${un.length?`<span class="bib-st">${un.length} non lue(s)</span>`:""}</summary>${lb.news.slice(0,5).map((n,i)=>`<div class="bib-new"><b>${fmtD(n.at)}</b> · version ${E(n.to||"")}<br>${n.items.add.length?`➕ ${n.items.add.length} nouveauté(s) : ${E(n.items.add.slice(0,6).map(x=>x.t+" "+x.n).join(" ; "))}${n.items.add.length>6?"…":""}<br>`:""}${n.items.chg.length?`✎ ${n.items.chg.length} modifiée(s) : ${E(n.items.chg.slice(0,6).map(x=>x.t+" "+x.n).join(" ; "))}${n.items.chg.length>6?"…":""}<br>`:""}${n.items.del.length?`➖ ${n.items.del.length} retirée(s)<br>`:""}${n.stale?`⚠ ${n.stale} fiche(s) de ta collection liées à une fiche modifiée : ouvre-les pour revoir.<br>`:""}</div>`).join("")}<button class="b" data-bib="seen">Tout marquer comme lu</button></details>`;
 h+=`<div class="card"><label>Rechercher<input id="bibq" value="${E(B.q)}" placeholder="Nom, mot-clé…" autocomplete="off"></label><label>Faction<select id="bibfac"><option value="">Toutes les factions (${D.units.length})</option>${facList().map(([k,n,c])=>`<option value="${E(k)}"${B.fac===k?" selected":""}>${E(n)} (${c})</option>`).join("")}</select></label><div class="bib-chips">${[["units","Unités"],["det","Détachements"],["str","Stratagèmes"],["enh","Améliorations"],["rules","Règles"]].map(([k,n])=>`<button class="${B.tab===k?"on":""}" data-bib="tab" data-v="${k}">${n}</button>`).join("")}</div></div><div id="bibl">${list()}</div>`;return h}
function list(){const q=nk(B.q),f=B.fac,inF=x=>!f||x._c===f||x._c==="common",hit=s=>!q||q.split(" ").every(w=>nk(s).includes(w));let h="";
 if(B.tab==="units"){const L=search(B.q,f);h=L.map(u=>{const t=tName(u.n);return`<div class="card hv" data-bib="unit" data-id="${E(u.id)}"><b class="cap">${E(t.t)}</b> ${badge(t.st)}${t.st==="chk"&&t.prop?` <span class="bib-meta">· proposé : ${E(t.prop)}</span>`:""}<div class="bib-meta">${E(facLbl(u))} · ${u.pts!=null?u.pts+" pts":""} ${u.src==="wahapedia"?"· 🌐 Wahapedia":(u.wp?"· + Wahapedia":"")}</div></div>`}).join("")||'<p class="mu">Aucune fiche.</p>';if(D.units.length&&L.length===60)h+='<p class="mu">Affine la recherche pour voir la suite.</p>'}
 else if(B.tab==="det"){h=D.dets.filter(x=>inF(x)&&hit(x.n+" "+(x.f||""))).map(d=>`<details class="card"><summary><b>${E(d.n)}</b> <span class="bib-meta">${E(d.f||"")} · ${d.pts!=null?d.pts+" pt(s)":""}</span> ${badge("no")}</summary>${d.ab?`<p>${nameHtml(d.ab.name)}</p>${trx(d.ab.description,"règle de détachement")}`:""}${(d.abx||[]).map(x=>`<p>${nameHtml(x.name)}</p>${trx(x.description,"règle de détachement")}`).join("")}<p class="bib-meta">Dispositions : ${E((d.dp||[]).join(", ")||"—")} · source : ${d.src==="wahapedia"?"Wahapedia":"BSData"}</p><p><b>Stratagèmes liés :</b> ${D.str.filter(s=>s.det===d.n).length} · <b>Améliorations :</b> ${D.enh.filter(e=>e.det===d.n).length}</p></details>`).join("")||'<p class="mu">Aucun.</p>'}
 else if(B.tab==="str"){h=D.str.filter(x=>inF(x)&&hit(x.n+" "+(x.det||"")+" "+(x.f||""))).slice(0,120).map(s=>{const p=tPhase(s.ph||"");return`<details class="card"><summary><b>${E(s.n)}</b> <span class="bib-st">${s.cp!=null?s.cp+" PC":""}</span> <span class="bib-meta">${E(s.det||s.f||"")}</span></summary><p class="bib-meta">Phase : ${E(p.t)} ${badge(p.st)} · Type : ${E(s.t||"—")}</p><p><b>Quand :</b></p>${trx(s.when||"—","stratagème : quand")}<p><b>Cible :</b></p>${trx(s.tg||"—","stratagème : cible")}<p><b>Effet :</b></p>${trx(s.fx||"—","stratagème : effet")}${s.rs?`<p><b>Restrictions :</b></p>${trx(s.rs,"stratagème : restrictions")}`:""}<p class="bib-meta">Source : ${s.src==="wahapedia"?"Wahapedia":"Warhammer Oracle (Faction Packs)"}</p></details>`}).join("")||'<p class="mu">Aucun.</p>'}
 else if(B.tab==="enh"){h=D.enh.filter(x=>inF(x)&&hit(x.n+" "+(x.det||""))).map(e=>`<details class="card"><summary><b>${E(e.n)}</b> <span class="bib-meta">${E(e.det||"")} · ${e.pts!=null?e.pts+" pts":""}</span></summary>${trx(e.d,"texte d'amélioration")}<p class="bib-meta">Source : ${e.src==="wahapedia"?"Wahapedia":"BSData"}</p></details>`).join("")||'<p class="mu">Aucune.</p>'}
 else if(B.tab==="rules"){h=D.rules.filter(r=>hit(r.n)).map(r=>`<details class="card"><summary><b>${E(r.n)}</b></summary>${trx(r.d,"règle")}</details>`).join("")}
 return h}
function refreshOpen(){if(B.openId&&document.querySelector("#bibm .bib-ov")){const pn=document.querySelector("#bibm .bib-pn"),st=pn?pn.scrollTop:0;openUnit(B.openId);const p2=document.querySelector("#bibm .bib-pn");if(p2)p2.scrollTop=st}else{try{draw()}catch(_){}}}
function openUnit(id){const u=D.byId[id];if(!u)return;B.openId=id;css();const o=box("bibm");
 o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>Fiche de la bibliothèque</h2><button class="b" data-bib="x">✕</button></div>${unitHtml(u)}<div class="bib-meta">Légende : 🟢 traduction confirmée · 🟠 à vérifier · ⚪ non traduit (texte d'origine conservé)</div><button class="b p" data-bib="pickcoll" data-id="${E(u.id)}" style="width:100%;margin-top:8px">🔗 Rapprocher avec une fiche de ma collection</button></div></div>`}
function openPickColl(id){const u=D.byId[id];if(!u)return;const items=Object.values(S.coll||{}).filter(m=>!(m.mrg&&S.coll[m.mrg])).sort((a,b)=>String(a.name).localeCompare(String(b.name)));const o=box("bibm");
 o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>Choisir ma fiche</h2><button class="b" data-bib="x">✕</button></div><p class="bib-meta">Bibliothèque : <b>${E(u.n)}</b>. Sélectionne la fiche de ta collection à enrichir.</p>${items.map(m=>`<button class="b" data-bib="cmp" data-r="${E(m.ref)}" data-id="${E(u.id)}" style="width:100%;text-align:left;margin:4px 0">${E(m.name)}${LB().links[m.ref]?" 📚":""}</button>`).join("")||'<p class="mu">Ta collection est vide.</p>'}</div></div>`}
function openLink(ref){css();const m=S.coll[ref];if(!m)return;const lb=LB(),lk=lb.links[ref];const o=box("bibm");
 const run=()=>{const sg=suggest(m);o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>📚 Bibliothèque</h2><button class="b" data-bib="x">✕</button></div><p>Fiche de ta collection : <b class="cap">${E(m.name)}</b></p>
 ${lk&&lk.info?`<details class="bib-row"><summary><b>ℹ Informations de référence (${E(lk.info.src||"")})</b></summary>${lk.info.loadout?`<p>${E(stripMd(lk.info.loadout)).replace(/\n/g,"<br>")}</p>`:""}${(lk.info.comp||[]).map(c=>`<p>• ${E(c)}</p>`).join("")}${(lk.info.opt||[]).map(c=>`<p>• ${E(c)}</p>`).join("")}<p class="bib-meta">Texte original anglais ; aucune règle n'est appliquée automatiquement.</p></details>`:""}
 ${lk&&D.byId[lk.id]?`<div class="bib-row bib-a">✅ Déjà rapprochée avec <b>${E(D.byId[lk.id].n)}</b> (${fmtD(lk.at)})${lk.stale?" · ⚠ la fiche de la bibliothèque a changé depuis":""}.<br><button class="b" data-bib="cmp" data-r="${E(ref)}" data-id="${E(lk.id)}">Mettre à jour (armes manquantes)</button> <button class="b" data-bib="cmpx" data-r="${E(ref)}" data-id="${E(lk.id)}">Options avancées</button> <button class="b x" data-bib="unlink" data-r="${E(ref)}">Défaire</button></div>`:""}
 <label>Chercher dans la bibliothèque<input id="bibs" placeholder="ex. Intercessors, Boyz…" value="${E(B.sq==null?m.name:B.sq)}" autocomplete="off"></label>
 <p class="bib-meta">HAMMER propose, c'est toi qui décides. Rien n'est jamais rapproché automatiquement.</p><div id="bibsr">${sres(m)}</div></div></div>`};
 B.ref=ref;B.sq=undefined;if(D.ready)run();else init().then(run)}
function sres(m){const q=B.sq==null?m.name:B.sq;let L;if(B.sq==null){L=suggest(m).map(x=>x.u);return(L.length?`<p class="bib-meta">Correspondances possibles (à vérifier) :</p>`:`<p class="tt-miss" style="color:#e0a030">Aucune correspondance proposée pour « ${E(m.name)} » : cette unité ne semble pas être dans la bibliothèque. Tu peux quand même chercher à la main.</p>`)+L.map(u=>cand(m,u)).join("")}
 L=search(q,"");return L.map(u=>cand(m,u)).join("")||'<p class="mu">Aucun résultat.</p>'}
const cand=(m,u)=>{const t=tName(u.n);return`<div class="bib-row"><b>${E(t.t)}</b> ${badge(t.st)}<div class="bib-meta">${E(facLbl(u))} · ${u.pr.length} profil(s) · ${u.rw.length+u.mw.length} arme(s)</div><button class="b p" data-bib="cmp" data-r="${E(m.ref)}" data-id="${E(u.id)}">Lier et ajouter les armes</button></div>`};
function openCmp(ref,id,pi){const m=S.coll[ref],u=D.byId[id];if(!m||!u)return;css();pi=pi==null?(u.pr.findIndex(p=>nk(p.n)===nk(u.n))>=0?u.pr.findIndex(p=>nk(p.n)===nk(u.n)):0):pi;
 const rows=buildCmp(m,u,pi);B.cmp={ref,id,pi,rows,pick:{},map:{}};
 // valeurs par défaut : on ajoute ce qui manque ; on garde tes données quand elles diffèrent
 const P=B.cmp.pick;rows.weapons.forEach(r=>{if(r.kind==="add")P[r.id]=true});
 drawCmp()}
function drawCmp(){const C=B.cmp;if(!C)return;const m=S.coll[C.ref],u=D.byId[C.id],R=C.rows,P=C.pick,o=box("bibm");
 const ck=(id,txt,cls)=>`<label class="bib-ck"><input type="checkbox" data-bibck="${id}" ${P[id]?"checked":""}><span>${txt}</span></label>`;
 const sec=(t,body,empty)=>`<h4>${t}</h4>${body||`<p class="bib-meta">${empty||"Rien à compléter."}</p>`}`;
 const wadd=R.weapons.filter(r=>r.kind==="add"),wsame=R.weapons.filter(r=>r.kind==="same").length;
 let h=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>Ajouter des armes</h2><button class="b" data-bib="x">✕</button></div>
 <p><b class="cap">${E(m.name)}</b> <span class="bib-meta">← ${E(u.n)}</span></p>
 ${u.pr.length>1?`<label>Profil<select data-bibpi="1">${u.pr.map((p,i)=>`<option value="${i}"${i===C.pi?" selected":""}>${E(p.n)}</option>`).join("")}</select></label>`:""}
 <h4>Armes à ajouter à ta fiche</h4>
 ${wadd.length?`<div class="row" style="gap:6px;margin:4px 0"><button class="b" data-bib="ckw" data-v="1">Tout cocher</button><button class="b" data-bib="ckw" data-v="0">Tout décocher</button></div>`+wadd.map(r=>{const aw=r.x.aw;return`<div class="bib-row bib-a">${ck(r.id,`<b>${E(aw.name)}</b><br><span class="bib-meta">${E(aw.range)}${/^\d/.test(aw.range)?'"':""} · A ${E(aw.a)} · ${E(aw.hit)} · F ${E(aw.f)} · PA ${E(aw.pa)} · D ${E(aw.d)}${aw.caps?" · "+E(aw.caps):""}</span>`)}</div>`}).join(""):`<p class="bib-meta">Aucune nouvelle arme : ta fiche a déjà tout.</p>`}
 ${wsame?`<p class="bib-meta">✓ ${wsame} arme${wsame>1?"s":""} déjà dans ta fiche (non touchée${wsame>1?"s":""}).</p>`:""}
 <div class="row" style="gap:8px;margin:10px 0;position:sticky;bottom:0;padding:8px 0;background:var(--bg,#14161a)"><button class="b" data-bib="x" style="flex:1">Annuler</button><button class="b p" data-bib="apply" style="flex:2">✔ Ajouter les armes cochées</button></div>
 <details class="bib-row"><summary><b>Autres informations (facultatif)</b></summary><p class="bib-meta">Caractéristiques, capacités, mots-clés, points… Rien n'est coché par défaut ; tes valeurs ne sont jamais remplacées sans que tu le demandes.</p>`;
 h+=sec("Caractéristiques",R.stats.filter(r=>r.kind!=="same").map(r=>r.kind==="add"?ck(r.id,`<b>${r.k}</b> absente : ajouter <b>${E(r.lib)}</b>`):`<div class="bib-row bib-d"><b>${r.k}</b> : toi <b>${E(r.mine)}</b> · bibliothèque <b>${E(r.lib)}</b><br>${ck(r.id,"Remplacer par la valeur de la bibliothèque")}</div>`).join(""),"Toutes les caractéristiques concordent déjà ou sont complètes.");
 h+=sec("Armes dont le profil diffère",R.weapons.filter(r=>r.kind==="diff").map(r=>{const aw=r.x.aw,pr=`${aw.range}${/^\d/.test(aw.range)?'"':""} · A ${aw.a} · ${aw.hit} · F ${aw.f} · PA ${aw.pa} · D ${aw.d}`;
  if(r.kind==="same")return`<div class="bib-row bib-s">✓ <b>${E(aw.name)}</b> existe déjà chez toi (<b>${E(r.mine.name)}</b>, même profil).${r.learn?`<br>${ck("ln:"+r.id,`Retenir « ${E(r.mine.name)} » comme nom français de « ${E(String(r.x.lw.n).replace(/^➤\s*/,""))} »`)}`:""}</div>`;
  if(r.kind==="diff")return`<div class="bib-row bib-d"><b>${E(r.mine.name)}</b> : valeurs différentes<div class="bib-two"><div>Toi : ${E(r.mine.range)} · A ${E(r.mine.a)} · ${E(r.mine.hit)} · F ${E(r.mine.f)} · PA ${E(r.mine.pa)} · D ${E(r.mine.d)}</div><div>Biblio : ${E(pr)}</div></div>${ck(r.id,"Remplacer le profil par celui de la bibliothèque (je garde le nom)")}</div>`;
  return`<div class="bib-row bib-a">${ck(r.id,`Ajouter <b>${E(aw.name)}</b> — ${E(pr)}${aw.caps?` — ${E(aw.caps)}`:""}`)}</div>`}).join(""),"Aucune.");
 const mine=String(m.apt||"").split(",").map(x=>x.trim()).filter(Boolean),used=new Set(Object.values(C.map||{}));
 const sugg=r=>{const t=tAB(r.a.n);const kt=nk(t.t),ke=nk(r.a.n);let best=mine.find(n=>nk(n)===kt);if(best)return best;const tk=new Set(toks(t.t).concat(toks(r.a.n)));let sc=0;mine.forEach(n=>{const x=toks(n).filter(w=>tk.has(w)).length;if(x>sc&&x>=1&&x>=Math.ceil(toks(n).length/2)){sc=x;best=n}});return sc?best:null};
 h+=sec("Capacités",R.abil.filter(r=>r.kind==="add").map(r=>{const mp=(C.map||{})[r.id],sg=sugg(r);return`<div class="bib-row ${mp?"bib-s":"bib-a"}">${mp?`<div class="bib-ck"><span>↔ <b>${E(r.t.t)}</b> (anglais) = <b>${E(mp)}</b> (ta fiche).<br><span class="bib-meta">Ton texte français est conservé tel quel ; on retient seulement l'association pour mieux traduire l'anglais à l'avenir.</span></span></div>`:ck(r.id,`Ajouter <b>${E(r.t.t)}</b> ${badge(r.t.st)} <span class="bib-meta">(texte en anglais)</span>`)}<select data-bibmap="${r.id}" style="width:100%;margin-top:4px"><option value="">${mp?"Ne plus associer":"C'est une nouvelle capacité"}</option>${mine.map(n=>`<option value="${E(n)}"${mp===n?" selected":""}>${sg===n&&!mp?"★ Suggestion : ":""}↔ C'est déjà « ${E(n)} »</option>`).join("")}</select></div>`}).join(""),"Toutes les capacités sont déjà présentes.");
 h+=sec("Mots-clés",R.kw.map(r=>ck(r.id,`Ajouter <b>${E(r.t.t)}</b> ${badge(r.t.st)}`)).join(""),"Aucun mot-clé à ajouter.");
 h+=sec("Points",R.misc.filter(r=>r.kind!=="same").map(r=>r.kind==="add"?ck(r.id,`Points absents : ajouter <b>${E(r.lib)}</b>`):`<div class="bib-row bib-d">Points : toi <b>${E(r.mine)}</b> · biblio <b>${E(r.lib)}</b><br>${ck(r.id,"Remplacer")}</div>`).join(""),"Points identiques ou non renseignés.");
 if(u.wp&&(u.wp.loadout||(u.wp.opt||[]).length||(u.wp.comp||[]).length))h+=sec("Informations de référence",ck("info","Garder l'équipement de base, la composition et les options (Wahapedia) comme <b>information de référence</b> liée à ma fiche. Elles ne bloquent jamais mes listes."));
 h+=`</details></div></div>`;
 const sc=(o.querySelector&&o.querySelector(".bib-pn"))?o.querySelector(".bib-pn").scrollTop:0;o.innerHTML=h;const pn=o.querySelector(".bib-pn");if(pn)pn.scrollTop=sc}
function menu(){css();const lb=LB(),o=box("bibm");o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>⚙ Gérer la bibliothèque</h2><button class="b" data-bib="x">✕</button></div>
 <p class="bib-meta">Wahapedia (export 11e) : ${E(D.man&&D.man.source&&D.man.source.wahapedia?D.man.source.wahapedia.last_update:"non chargé")} · ${D.frN} traduction(s) proposée(s).</p><p class="bib-meta">Version ${E(D.man?D.man.version:"—")} · origine ${E(D.origin||"—")} · dernière vérification ${lb.last?fmtD(lb.last.at)+(lb.last.err?" (échec : "+E(lb.last.err)+")":""):"jamais"}</p>
 <div class="bib-row"><b>Mise à jour (facultative)</b><p class="bib-meta">Compare les versions, ne télécharge que ce qui a changé, vérifie l'intégrité, conserve tes fiches et tes rapprochements.</p><label class="bib-ck"><input type="checkbox" data-bibopt="auto" ${lb.auto?"checked":""}><span>Vérifier automatiquement (1 fois par jour, si Internet)</span></label><button class="b p" data-bib="upd" style="width:100%">🔄 Vérifier les nouveautés maintenant</button><div id="bibmsg" class="bib-meta"></div></div>
 <div class="bib-row"><b>Sauvegarde</b><button class="b" data-bib="exp">💾 Sauvegarder la bibliothèque</button> <label class="b" style="cursor:pointer">📂 Restaurer<input type="file" accept=".json,application/json" id="bibimp" hidden></label> <button class="b" data-bib="prev">↩ Version précédente</button></div>
 <div class="bib-row"><b>Traductions apprises de tes fiches</b><p class="bib-meta">${Object.keys(lb.tr).length} nom(s) · ${Object.keys(lb.tm).length} texte(s)/phrase(s). Elles servent uniquement à afficher la bibliothèque ; tes fiches ne sont jamais modifiées.</p><button class="b x" data-bib="tmclr">Effacer ces traductions apprises</button></div>
 <div class="bib-row"><b>Valider les traductions</b><p class="bib-meta">${lb.vall?"✅ Toutes les traductions proposées sont validées (affichées comme confirmées).":"Marque d'un coup comme confirmées toutes les traductions « à vérifier »."} Tes fiches ne sont jamais modifiées ; tu peux annuler.</p>${lb.vall?`<button class="b x" data-bib="vallno">↩ Annuler la validation globale</button>`:`<button class="b" data-bib="vall">✔ Tout valider</button>`}</div>
 <div class="bib-row"><b>Intégrité</b><button class="b" data-bib="ver">🔍 Vérifier les données</button></div>
 <div class="bib-row"><b>Source de mise à jour</b><input id="bibsrc" value="${E(lb.src)}" style="width:100%"><button class="b" data-bib="srcset">Enregistrer</button> <button class="b" data-bib="srcdef">Par défaut</button></div>
 <p class="bib-meta">La bibliothèque est stockée à part de tes données personnelles : une erreur d'import ne peut pas abîmer ta collection.</p></div></div>`}
function licModal(){css();const o=box("bibm"),mn=D.man||{};o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>Sources et licences</h2><button class="b" data-bib="x">✕</button></div>
 <p>Ces données sont <b>communautaires et non officielles</b>. Warhammer 40,000, ses règles et ses fiches sont la propriété de Games Workshop ; HAMMER n'est ni affilié ni approuvé par GW.</p>
 <ul><li>Fiches, détachements, améliorations, règles partagées : projet communautaire <b>BSData/wh40k-11e</b>, récupérées via le dépôt <b>gregario/warhammer-oracle</b> (licence MIT pour son code). La licence propre à BSData n'a pas pu être vérifiée depuis ici.</li><li>Stratagèmes : saisis dans <b>warhammer-oracle</b> d'après les Faction Packs publiés.</li><li>Traductions : seul le vocabulaire français officiel retrouvé dans les règles de base, les fiches françaises et l'encyclopédie de l'appli est marqué « confirmé ». Le reste reste en anglais.</li></ul>
 <p class="bib-meta">Version ${E(mn.version||"")} · ${E((mn.source&&mn.source.oracle&&mn.source.oracle.commit)||"")} · usage personnel pendant le jeu.</p></div></div>`}
/* ---------- actions ---------- */
function msg(t){const b=document.getElementById("bibmsg");if(b)b.textContent=t}
function dl(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"application/json"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
async function doUpd(manual){msg("Vérification…");const r=await checkUpdate(manual);
 const t={same:"✅ Déjà à jour.",off:"Pas de connexion.",err:"⚠ "+(r.err||""),updated:"✅ Mise à jour installée : "+(r.news?r.news.items.add.length+" nouveauté(s), "+r.news.items.chg.length+" modifiée(s).":"")}[r.state];msg(t||"");
 if(r.state==="updated"){try{toast("🆕 Bibliothèque V11 mise à jour")}catch(_){}try{draw()}catch(_){}}return r}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-bibtr]");if(!b)return;e.preventDefault();e.stopPropagation();const k=b.dataset.k,m=TXM[k];if(!m)return;const pr=(D.fr[k]||{}).fr||(m.name?(tName(m.en).prop||""):(trDesc(m.en).prop||""));
 if(b.dataset.bibtr==="ok"){storeTr(k,pr);try{refreshOpen()}catch(_){}try{toast("Traduction validée ✓")}catch(_){}}
 else ask({t:"Corriger la traduction",p:"Le texte français que tu enregistres devient « confirmé ». L'original anglais n'est pas modifié.",input:pr,ok:"Enregistrer"},v=>{if(v&&v.trim()){storeTr(k,v.trim());try{refreshOpen()}catch(_){}}})},true);
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-bib]");if(!b)return;const a=b.dataset.bib;
 if(a==="bg"&&e.target!==b)return;e.preventDefault();e.stopPropagation();
 try{switch(a){
  case"open":await init();openLink(b.dataset.r);break;
  case"x":case"bg":closeM("bibm");B.cmp=null;break;
  case"home":tab="bib";S.mg=true;try{draw()}catch(_){}window.scrollTo(0,0);break;
  case"tab":B.tab=b.dataset.v;try{draw()}catch(_){}break;
  case"fac":B.fac=b.dataset.v;try{draw()}catch(_){}break;
  case"unit":await init();openUnit(b.dataset.id);break;
  case"pickcoll":openPickColl(b.dataset.id);break;
  case"cmp":{await init();const m=S.coll[b.dataset.r],u=D.byId[b.dataset.id];if(!m||!u)break;const n=autoLink(m,u);closeM("bibm");try{draw()}catch(_){}try{window.WPK&&WPK.refresh&&WPK.refresh()}catch(_){}try{toast("Liée ✓"+(n?" · "+n+" arme"+(n>1?"s":"")+" ajoutée"+(n>1?"s":""):"")+" · options et restrictions d'équipement ajoutées")}catch(_){}break}
  case"pkfac":{if(typeof pk!=="undefined"&&pk){const g=b.dataset.v;pk.facs=pk.facs||[];if(g&&!pk.facs.includes(g))pk.facs.push(g);pk.addf=false;pk.q="";pkDraw()}break}
  case"pkfacx":{if(typeof pk!=="undefined"&&pk){const g=b.dataset.v;pk.facs=g?(pk.facs||[]).filter(x=>x!==g):[];pk.addf=false;pk.q="";pkDraw()}break}
  case"pkfaca":{if(typeof pk!=="undefined"&&pk){pk.addf=b.dataset.v==="1";pk.q="";pkDraw()}break}
  case"pklib":{await init();const u=D.byId[b.dataset.id];if(!u)break;const m=createFromLib(u);const x=document.createElement("button");x.dataset.act="pick";x.dataset.r=m.ref;document.body.appendChild(x);x.click();x.remove();break}
  case"mk":{await init();const u=D.byId[b.dataset.id];if(!u)break;const m=createFromLib(u);try{draw()}catch(_){}try{toast("Fiche « "+m.name+" » créée ✓")}catch(_){}break}
  case"cmpx":await init();openCmp(b.dataset.r,b.dataset.id);break;
  case"ckw":{const C=B.cmp;if(!C)break;const v=b.dataset.v==="1";C.rows.weapons.forEach(r=>{if(r.kind==="add")C.pick[r.id]=v});drawCmp();break}
  case"apply":{const C=B.cmp;if(!C)break;const m=S.coll[C.ref],u=D.byId[C.id];const done=applyCmp(m,u,C.pi,C.rows,C.pick,C.map);closeM("bibm");B.cmp=null;try{draw()}catch(_){}try{toast(done.length?"Fiche complétée ("+done.length+" élément"+(done.length>1?"s":"")+") ✓":"Rapprochement enregistré, aucun changement")}catch(_){}break}
  case"unlink":ask({t:"Défaire le rapprochement ?",p:"Le lien est supprimé. Tu peux aussi retirer ce qui a été ajouté en revenant à l'état d'avant.",ok:"Garder les ajouts",alt:"Annuler les ajouts",altcb:()=>{undoLink(b.dataset.r,true);closeM("bibm");try{draw()}catch(_){}toast("Fiche remise comme avant")}},()=>{undoLink(b.dataset.r,false);closeM("bibm");try{draw()}catch(_){}});break;
  case"menu":menu();break;
  case"__tr":break;
  case"vall":ask({t:"Valider toutes les traductions ?",p:"Toutes les traductions « à vérifier » seront affichées comme confirmées. Tes fiches ne changent pas, et tu peux annuler à tout moment.",ok:"Tout valider"},()=>{const lb=LB();lb.vall=Date.now();sv();try{draw()}catch(_){}try{menu()}catch(_){}try{toast("Traductions validées ✓")}catch(_){}});break;
  case"vallno":{const lb=LB();delete lb.vall;sv();try{draw()}catch(_){}try{menu()}catch(_){}try{toast("Validation globale annulée")}catch(_){}break}
  case"tmclr":ask({t:"Effacer les traductions apprises ?",p:"Les associations et textes retenus depuis tes fiches sont supprimés. Tes fiches ne changent pas.",ok:"Effacer",dg:1},()=>{const lb=LB();lb.tm={};Object.keys(lb.tr).forEach(k=>{if(lb.tr[k].src==="user")delete lb.tr[k]});sv();menu()});break;
  case"lic":licModal();break;
  case"seen":LB().news.forEach(n=>n.seen=true);sv();try{draw()}catch(_){}break;
  case"upd":await doUpd(true);break;
  case"exp":dl("hammer-bibliotheque-"+(D.man?D.man.version:"")+".json",await exportLib());break;
  case"ver":{const bad=await verify();msg(bad.length?"⚠ Problème d'intégrité : "+bad.join(", ")+". Utilise « Version précédente » ou « Restaurer ».":"✅ Intégrité vérifiée : "+D.man.chunks.length+" blocs conformes.")}break;
  case"prev":try{await restorePrev();msg("✅ Version précédente restaurée.");draw()}catch(x){msg("⚠ "+x.message)}break;
  case"srcset":{const v=(document.getElementById("bibsrc").value||"").trim();if(/^https:\/\//.test(v)){LB().src=v.endsWith("/")?v:v+"/";sv();msg("Source enregistrée.")}else msg("L'adresse doit commencer par https://")}break;
  case"srcdef":LB().src=DEF_SRC;sv();msg("Source par défaut rétablie.");break;
  case"news":tab="bib";S.mg=true;try{draw()}catch(_){}break;
 }}catch(x){try{toast("Erreur : "+x.message)}catch(_){}}},true);
document.addEventListener("change",e=>{const t=e.target;if(!t)return;
 if(t.dataset&&t.dataset.bibck!=null&&B.cmp){B.cmp.pick[t.dataset.bibck]=t.checked;return}
 if(t.dataset&&t.dataset.bibmap&&B.cmp){const C=B.cmp;if(t.value){C.map[t.dataset.bibmap]=t.value;C.pick[t.dataset.bibmap]=false}else{delete C.map[t.dataset.bibmap];C.pick[t.dataset.bibmap]=true}drawCmp();return}
 if(t.dataset&&t.dataset.bibpi&&B.cmp){const C=B.cmp;openCmp(C.ref,C.id,+t.value);return}
 if(t.dataset&&t.dataset.bibopt==="auto"){LB().auto=t.checked;sv();return}
 if(t.id==="bibimp"){const f=t.files&&t.files[0];if(!f)return;f.text().then(async x=>{try{await importLib(x);msg("✅ Bibliothèque restaurée.");try{draw()}catch(_){}}catch(er){msg("⚠ "+er.message)}})}});
document.addEventListener("input",e=>{const t=e.target;if(!t)return;
 if(t.id==="bibfac"){B.fac=t.value;try{draw()}catch(_){}return}
 if(t.id==="bibq"){B.q=t.value;const l=document.getElementById("bibl");if(l)l.innerHTML=list()}
 if(t.id==="bibs"){B.sq=t.value;const m=S.coll[B.ref];const r=document.getElementById("bibsr");if(m&&r)r.innerHTML=sres(m)}});

/* ---------- fiche de la COLLECTION : tiroir « Options d'équipement » (fermé par défaut) ---------- */
const AM={};
function profMatch(m,u){ // jeu de profils d'armes de la fiche présent dans la fiche de la bibliothèque
 const mine=(m.weapons||[]).map(wSig),libW=new Set([...(u.rw||[]).map(w=>wSig(wToApp(w,false))),...(u.mw||[]).map(w=>wSig(wToApp(w,true)))]);
 const hit=mine.filter(x=>libW.has(x)).length;return{hit,n:mine.length}}
function statSame(m,u){const ms=m.stats||{};return u.pr.some(p=>["M","E","SV","PV","CD","CO"].every(k=>{const a=String(ms[k]==null?"":ms[k]).trim(),b=statOf(p,k);return!a||!b||nk(a)===nk(b)})&&["E","SV"].every(k=>String(ms[k]||"").trim()))}
function autoMatch(m){if(!D.ready)return null;const lb=LB(),lk=lb.links[m.ref];
 const key=m.ref+"|"+(lk?lk.id:"")+"|"+(m.weapons||[]).length+"|"+JSON.stringify(m.stats||{})+"|"+D.man.version;if(AM[m.ref]&&AM[m.ref].key===key)return AM[m.ref].r;
 let r=null;
 if(lk&&D.byId[lk.id])r={u:D.byId[lk.id],level:"ok",why:"rapprochement confirmé par toi",manual:true};
 else{
  const byName=D.units.filter(u=>nk(u.n)===nk(m.name)||(lb.tr["n:"+nk(u.n)]&&nk(lb.tr["n:"+nk(u.n)].fr)===nk(m.name)));
  if(byName.length){const pref=byName.find(u=>u.f.includes("Space Marines"))||byName[0];r={u:pref,level:"ok",why:"même nom"}}
  else{
   const cand=D.units.map(u=>({u,pm:profMatch(m,u),st:statSame(m,u)})).filter(x=>x.st&&x.pm.n&&x.pm.hit>0).map(x=>{const T=toks(m.name),U=toks(x.u.n),ov=T.length&&U.length?T.filter(w=>U.includes(w)).length/Math.max(T.length,1):0;return{...x,ov,ps:x.pm.hit/Math.max(x.pm.n,1),sc:x.pm.hit/Math.max(x.pm.n,1)+0.6*ov}}).sort((a,b)=>b.sc-a.sc||b.pm.hit-a.pm.hit);
   const nm0=suggest(m)[0];
   if(nm0&&nm0.sc>=.5&&(!cand.length||cand[0].ov<.5))r={u:nm0.u,level:"chk",why:"nom proche, caractéristiques ou armes différentes",cands:suggest(m).map(x=>x.u)};
   else if(cand.length){const t=cand[0],second=cand[1];const uniq=!second||t.sc-second.sc>=.25||nk(second.u.n)===nk(t.u.n);
    r={u:t.u,level:((t.ps>=.8&&t.pm.hit>=2&&uniq)||(t.ov>=.5&&t.ps>=.6&&uniq))?"ok":"chk",why:`mêmes caractéristiques et ${t.pm.hit} arme(s) sur ${t.pm.n} au même profil`+(uniq?"":" (plusieurs candidats)"),cands:cand.slice(0,6).map(x=>x.u)};
   }else{const sg=suggest(m);if(sg.length&&sg[0].sc>=.5)r={u:sg[0].u,level:"chk",why:"nom proche seulement",cands:sg.map(x=>x.u)}}
  }}
 AM[m.ref]={key,r};return r}
const BD={open:{},en:{}};
function frItem(en,kind){en=String(en||"");const isName=/^nom/.test(kind||""),r=isName?tName(en):trDesc(en),k=hh(en);TXM[k]={en,name:isName};
 const show=BD.en[k]||BD.enAll;
 if(r.st==="ok")return{html:md2(show?en:r.t),st:"ok",k,sure:true};
 if(r.st==="chk"&&r.prop)return{html:md2(show?en:r.prop),st:"chk",k,sure:false,prop:true};
 return{html:md2(en),st:"no",k,sure:false}}
function itemHtml(en,kind){const x=frItem(en,kind);
 const tag=x.st==="ok"?"":x.st==="chk"?` <button class="bib-warn" data-bibdr="en" data-k="${x.k}" title="Traduction à vérifier : voir l'anglais">⚠ ${BD.en[x.k]?"FR":"EN"}</button>${BD.en[x.k]?"":` <button class="bib-warn ok" data-bibtr="ok" data-k="${x.k}" title="Valider cette traduction">✔</button>`}`:` <span class="bib-st no" title="Non traduit : texte original anglais">⚪ EN</span>`;
 return`<div class="bib-opt">${x.html}${tag}</div>`}

const chip=i=>`<span class="bib-chip">${i.n?E(i.n)+" × ":""}${E(i.name)}</span>`;
function actions(k,sure){return sure?"":`<div class="bib-oa">⚠ à vérifier · <button class="bib-warn" data-bibdr="en" data-k="${k}">${BD.en[k]?"FR":"EN"}</button> <button class="bib-warn ok" data-bibdr-ok="1" data-bibtr="ok" data-k="${k}">✔</button></div>`}
function optCard(en){const x=frItem(en,"option d'équipement"),o=ruleOpt(en,twRule);
 if(BD.enAll||BD.en[x.k]||!o||x.st==="ok")return`<div class="bib-oc"><div>${x.html}</div>${actions(x.k,x.st==="ok")}</div>`;
 return`<div class="bib-oc"><div class="bib-oh">${o.mode==="replace"?"🔁 Remplacement":"➕ Ajout d'équipement"}</div><div class="bib-ol"><span class="bib-ot">Qui</span> <span style="flex:1;min-width:0">${E(o.who)}</span></div>${o.old.length?`<div class="bib-ol"><span class="bib-ot">Retire</span> ${o.old.map(n=>`<span class="bib-chip">${E(n)}</span>`).join("")}</div>`:""}<div class="bib-ol"><span class="bib-ot">${o.mode==="replace"?(o.oneOf?"Par, au choix":"Par"):(o.oneOf?"Au choix":"Reçoit")}</span> ${o.choices.map(chip).join("")}</div>${actions(x.k,false)}<details class="bib-meta" style="margin-top:4px"><summary>Texte complet</summary><div style="white-space:pre-wrap">${E(en)}</div></details></div>`}
function loadCard(en){const x=frItem(en,"équipement de base"),o=ruleLoad(en,twRule);
 if(BD.enAll||BD.en[x.k]||!o||x.st==="ok")return`<div class="bib-oc"><div>${x.html}</div>${actions(x.k,x.st==="ok")}</div>`;
 return`<div class="bib-oc">${o.map(b=>`<div class="bib-ol"><span class="bib-ot">${E(b.who)}</span> ${b.items.map(chip).join("")}</div>`).join("")}${actions(x.k,false)}</div>`}
function compCard(list){const rows=list.map(t=>{const x=frItem(t,"composition");return`<span class="bib-chip">${x.html}</span>`}).join("");return`<div class="bib-oc"><div class="bib-ol">${rows}</div></div>`}
function snapEq(p,u,w){try{const x={id:u.id,n:u.n,loadout:w.loadout||"",opt:(w.opt||[]).slice(),comp:(w.comp||[]).slice()};if(!(x.loadout||x.opt.length||x.comp.length))return;
 if(JSON.stringify(p.eqx)!==JSON.stringify(x)){p.eqx=x;sv()}}catch(_){}}
function snapAll(){if(!D.ready)return;try{Object.values(S.coll||{}).forEach(m=>{try{const lk=LB().links[m.ref];let u=lk&&D.byId[lk.id];if(!u){const am=autoMatch(m);if(am&&am.level==="ok")u=am.u}if(u)snapEq(m,u,u.wp||{})}catch(_){}})}catch(_){}}
window.BIBSNAP=snapAll;
window.BIBDRW=function(p,force){try{
 if(!p||!p.ref||!S.coll[p.ref])return"";p=S.coll[p.ref];
 const stub=(msg,btn)=>{css();const rf=E(p.ref);return`<details class="bib-dr eq" data-bibref="${rf}" ${BD.open[p.ref]||force?"open":""}><summary>🧰 Options d'équipement <span class="bib-warn">⚠</span></summary><div class="bib-drb"><div class="bib-row bib-d">⚠ ${msg}${btn===false?"":`<br><button class="b p" data-bib="open" data-r="${rf}">🔎 Choisir l'équivalent anglais</button>`}</div></div></details>`};
 if(!D.ready){if(!D.err&&!BD.wait){BD.wait=true;init().then(()=>{BD.wait=false;try{draw()}catch(_){}})}return stub(D.err?"Bibliothèque indisponible : "+E(D.err):"Chargement de la bibliothèque…",false)}
 const am=autoMatch(p);css();const ref=p.ref,isOpen=!!BD.open[ref],own=String(p.eqo||"").trim();
 let w=null,warn=false,saved=false;
 if(am){const u=am.u;w=u.wp||{};warn=am.level!=="ok";snapEq(p,u,w)}
 else if(p.eqx&&(p.eqx.loadout||(p.eqx.opt||[]).length||(p.eqx.comp||[]).length)){w=p.eqx;saved=true}
 const ownH=own?`<h4>Mes notes d'équipement</h4><p style="white-space:pre-wrap">${E(own)}</p>`:"";
 if(!w&&!own)return stub("Pas de version anglaise liée. Ouvre « Modifier » pour la lier ou pour écrire toi-même les options et restrictions.",false);
 w=w||{};
 const loadout=w.loadout?`<h4>Équipement de base</h4><p>${frItem(w.loadout,"équipement de base").html}</p>`:"";
 const opts=(w.opt&&w.opt.length)?`<h4>Options d'équipement et restrictions</h4><ul style="margin:4px 0;padding-left:18px">${w.opt.map(o=>`<li style="margin:6px 0">${frItem(o,"option d'équipement").html}</li>`).join("")}</ul>`:(w.loadout||am?`<h4>Options d'équipement et restrictions</h4><p class="bib-meta">Aucune option listée pour cette unité.</p>`:"");
 return`<details class="bib-dr eq" data-bibref="${E(ref)}" ${BD.open[ref]||force?"open":""}><summary>🧰 Options d'équipement ${warn?'<span class="bib-warn">⚠</span>':""}</summary><div class="bib-drb">${loadout}${opts}${ownH}</div></details>`}catch(e){try{console.error("BIBDRW",e)}catch(_){}return`<details class="bib-dr eq" open><summary>🧰 Options d'équipement <span class="bib-warn">⚠</span></summary><div class="bib-drb"><p class="bib-meta">Affichage impossible pour cette fiche.</p></div></details>`}};
const eqo=m=>`<label>Options d'équipement et restrictions (texte libre, affiché dans le tiroir de la fiche)<textarea data-p="eqo" rows="4" placeholder="ex. Peut remplacer son canon par…">${E(m.eqo||"")}</textarea></label>`;
window.BIBLNKP=function(m){try{if(!m||!m.ref||!S.coll[m.ref])return"";css();
 if(!D.ready){if(!D.err&&!BD.wait){BD.wait=true;init().then(()=>{BD.wait=false;try{window.WPK&&WPK.refresh&&WPK.refresh()}catch(_){}})}return""}
 const ref=m.ref,r=E(ref),lk=LB().links[ref];
 if(lk&&D.byId[lk.id])return`<p class="bib-meta">📚 Liée à la version anglaise : <b>${E(tName(D.byId[lk.id].n).t)}</b></p>`;
 const am=autoMatch(m);
 if(am)return`<div class="bib-lkc"><b>📚 Fiche non liée</b><div class="bib-meta">Version anglaise proposée${am.level==="ok"?"":" (à vérifier)"} :</div><div class="bib-lkn">${E(tName(am.u.n).t)}</div><button type="button" class="b p" data-bib="cmp" data-r="${r}" data-id="${E(am.u.id)}">🔗 Lier et compléter la fiche</button><button type="button" class="b" data-bib="open" data-r="${r}" style="margin-top:6px">Choisir une autre fiche</button></div>`;
 return`<div class="bib-lkc"><b>📚 Fiche non liée</b><div class="bib-meta">Aucune version anglaise trouvée automatiquement.</div><button type="button" class="b p" data-bib="open" data-r="${r}">🔎 Chercher la version anglaise</button></div>`}catch(e){return""}};
window.BIBLNK=function(u){try{if(!u||!u.ref||!S.coll[u.ref])return"";css();
 if(!D.ready){if(!D.err&&!BD.wait){BD.wait=true;init().then(()=>{BD.wait=false;try{draw()}catch(_){}})}return""}
 const ref=u.ref,m=S.coll[ref],lk=LB().links[ref],am=autoMatch(m),lu=(lk&&D.byId[lk.id])||(am&&am.u);const r=E(ref);
 if(!lu)return`<div class="bib-lkc"><b>📚 Version anglaise</b><div class="bib-meta">Non liée</div><button type="button" class="b p" data-bib="open" data-r="${r}">🔎 Lier à la fiche anglaise</button></div>${eqo(m)}`;
 const n=buildCmp(m,lu,0).weapons.filter(x=>x.kind==="add").length,sure=lk||(am&&am.level==="ok");
 return`<div class="bib-lkc"><b>📚 Version anglaise</b><div class="bib-lkn">${E(tName(lu.n).t)}${sure?"":" <span class=\"bib-meta\">(à confirmer)</span>"}</div>${m.eqx&&(m.eqx.opt||[]).length?`<div class="bib-meta">✓ ${m.eqx.opt.length} option${m.eqx.opt.length>1?"s":""} d'équipement et restrictions enregistrée${m.eqx.opt.length>1?"s":""} sur la fiche</div>`:""}<div class="row" style="gap:6px;flex-wrap:wrap">${!lk&&!sure?`<button type="button" class="b p" data-bibdr="okm" data-r="${r}" data-id="${E(lu.id)}">✔ Confirmer</button>`:""}${n?`<button type="button" class="b p" data-bib="cmp" data-r="${r}" data-id="${E(lu.id)}">➕ ${n} arme${n>1?"s":""} à ajouter</button>`:""}<button type="button" class="b" data-bib="open" data-r="${r}">Changer</button>${lk?`<button type="button" class="b x" data-bib="unlink" data-r="${r}">Délier</button>`:""}</div></div>${eqo(m)}`}catch(e){return""}};
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.classList&&d.classList.contains("bib-dr"))BD.open[d.dataset.bibref]=d.open},true);
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-bibdr]");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.bibdr;
 if(a==="en"){BD.en[b.dataset.k]=!BD.en[b.dataset.k];try{draw()}catch(_){}}
 else if(a==="enall"){BD.enAll=!BD.enAll;try{draw()}catch(_){}}
 else if(a==="okm"){const m=S.coll[b.dataset.r],u=D.byId[b.dataset.id];if(m&&u){const n=autoLink(m,u);try{draw()}catch(_){}try{toast("Liée ✓"+(n?" · "+n+" arme"+(n>1?"s":"")+" ajoutée"+(n>1?"s":""):"")+" · options et restrictions d'équipement ajoutées")}catch(_){}}}
 else if(a==="wadd"){const m=S.coll[b.dataset.r],am=m&&autoMatch(m);if(!am)return;const u=am.u,libW=[...(u.rw||[]).map(x=>wToApp(x,false)),...(u.mw||[]).map(x=>wToApp(x,true))],aw=libW[+b.dataset.i];if(!aw)return;m.weapons=Array.isArray(m.weapons)?m.weapons:[];if(!m.weapons.some(x=>wSig(x)===wSig(aw))){m.weapons.push(clone(aw));sv();try{draw()}catch(_){}try{toast("Arme ajoutée à ta fiche ✓")}catch(_){}}}
},true);

/* ---------- aptitudes retirées partout (demande de l'utilisateur) ---------- */
const BAN=/^\s*templar vows\b/i;
window.BIBCLEAN=function(){let n=0;try{
 const fix=p=>{if(!p||typeof p!=="object")return;
  const hit=x=>BAN.test(String(x||""));
  if((p.apt||"").split(",").some(hit)||(p.xab||[]).some(x=>hit(x&&x.n))||(p.text||[]).some(l=>hit(String(l).trim()))){
   let parts=[];try{parts=window.abSplit?abSplit(p):[]}catch(_){}
   if(parts.length&&parts.some(x=>hit(x.n)))p.text=parts.filter(x=>!hit(x.n)).map(x=>((x.n?x.n+" ":"")+x.b).trim()).filter(Boolean);
   else p.text=(p.text||[]).filter(l=>!hit(String(l).trim()));
   p.apt=(p.apt||"").split(",").map(t=>t.trim()).filter(t=>t&&!hit(t)).join(", ");
   if(Array.isArray(p.xab))p.xab=p.xab.filter(x=>!hit(x&&x.n));
   n++}
  (p.subs||[]).forEach(fix)};
 Object.values(S.coll||{}).forEach(fix);(S.lists||[]).forEach(l=>(l.units||[]).forEach(fix));
 if(n)sv()}catch(e){try{console.error(e)}catch(_){}}try{snapAll()}catch(_){}return n};
setTimeout(()=>{try{BIBCLEAN()}catch(_){}},800);
/* ---------- créer une fiche de collection depuis la bibliothèque + fusion à l'import ---------- */
const nnm=t=>String(t||"").replace(/\s+[x×]\s?\d+(?=\s|$)/i,"").toLowerCase().trim();
const frName=en=>{const r=tName(en);return r.st==="ok"?r.t:(r.prop||r.t)};
const frAbN=en=>{const r=tAB(en);return r.st==="ok"?r.t:(r.prop||r.t)};
const frBody=en=>{const r=trDesc(en);return r.st==="ok"?r.t:(r.prop||en)};
function abLines(a){const name=frAbN(a.n),body=stripMd(frBody(a.d)).split("\n").map(x=>x.trim()).filter(Boolean);return{name,lines:[(name+" "+(body[0]||"")).trim()].concat(body.slice(1))}}
function createFromLib(u){const pi=Math.max(0,u.pr.findIndex(p=>nk(p.n)===nk(u.n))),p=profOf(u,pi),ref="r"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
 const stats={};["M","E","SV","PV","CD","CO"].forEach(k=>{stats[k]=statOf(p,k)||""});
 const wl=[...(u.rw||[]).map(w=>({w,a:wToApp(w,false)})),...(u.mw||[]).map(w=>({w,a:wToApp(w,true)}))].map(x=>Object.assign(x.a,{name:frName(String(x.w.n).replace(/^➤\s*/,""))}));
 const apt=[],text=[];(u.ab||[]).forEach(a=>{const x=abLines(a);if(!apt.some(n=>nk(n)===nk(x.name)))apt.push(x.name);x.lines.forEach(l=>text.push(l))});
 const kw=(u.kw||[]).map(k=>tKW(k).t).filter(Boolean);
 const fac=(S.fac||[]).find(f=>(u.f||[]).some(n=>nk(n)===nk(f.name||"")));
 const m={ref,name:frName(u.n),stats,weapons:wl,equip:wl.map(w=>w.name).join(", "),apt:apt.join(", "),kw:kw.join(", "),fkw:(u._c==="space-marines"&&(u.f||[]).length>1?"Space Marines":(u.f||[]).join(", ")),text,xab:[],mdl:[],pts:u.pts!=null?+u.pts:0,nb:0,subs:[],fromLib:1};
 if(fac)m.fac=fac.id;
 S.coll[ref]=m;LB().links[ref]={id:u.id,h:u.h,v:D.man.version,at:Date.now(),prof:pi,applied:["fiche créée depuis la bibliothèque"],stale:false};snapEq(m,u,u.wp||{});sv();return m}
window.BIBCS=function(q){try{q=String(q||"").trim();if(q.length<2)return"";css();
 if(!D.ready){if(!D.err&&!BD.wait){BD.wait=true;init().then(()=>{BD.wait=false;try{draw()}catch(_){}})}return""}
 const L=search(q,"").slice(0,8);if(!L.length)return`<div class="bib-cs"><b>📚 Dans la bibliothèque</b><p class="bib-meta">Aucune unité trouvée.</p></div>`;
 const have=new Set(Object.values(S.coll).map(m=>nnm(m.name)));
 return`<div class="bib-cs"><b>📚 Dans la bibliothèque</b>`+L.map(u=>{const n=frName(u.n),dup=have.has(nnm(n))||have.has(nnm(u.n));
  return`<div class="bib-row"><b class="cap">${E(n)}</b><div class="bib-meta">${E(facLbl(u))}${u.pts!=null?" · "+u.pts+" pts":""}</div>${dup?`<span class="bib-meta">✓ déjà dans ta collection</span>`:`<button class="b p" data-bib="mk" data-id="${E(u.id)}">➕ Créer la fiche</button>`}</div>`}).join("")+`</div>`}catch(e){return""}};
function libUnitOf(m){const lk=LB().links[m.ref];return lk&&D.byId[lk.id]}
window.BIBMERGE={
 cands(units){const out=[];if(!D.ready)return out;const used=new Set();
  const pool=Object.values(S.coll).filter(m=>m.fromLib&&libUnitOf(m));
  (units||[]).forEach(p=>{const key=nnm(p.name);
   if(Object.values(S.coll).some(m=>!m.fromLib&&nnm(m.name)===key))return;
   const sg=new Set((p.weapons||[]).map(wSig));
   const m=pool.find(m=>{if(used.has(m.ref))return false;const u=libUnitOf(m);
    if(nnm(m.name)===key||nnm(u.n)===key||nnm(frName(u.n))===key)return true;
    const ms=m.stats||{},ps=p.stats||{},same=["M","E","SV","PV","CD","CO"].every(k=>String(ms[k]||"")===String(ps[k]||""));
    const ov=(m.weapons||[]).filter(w=>sg.has(wSig(w))).length;return same&&ov>=1&&ov>=Math.ceil(sg.size/2)});
   if(m){used.add(m.ref);out.push({p,m})}});
  return out},
 ask(r,items,o,go){try{const pairs=this.cands(r.units);if(!pairs.length)return false;
  ask({t:"Fusionner avec la bibliothèque ?",p:"Ces unités importées correspondent à des fiches créées depuis la bibliothèque. En fusionnant, tes textes français sont toujours gardés ; seuls les éléments qui manquent (armes, aptitudes, mots-clés) sont ajoutés à la fiche de collection.",items:pairs.map(x=>x.p.name+" ↔ "+x.m.name+" (bibliothèque)"),ok:"Fusionner",alt:"Garder séparées",altcb:()=>{pairs.forEach(x=>{if(nnm(x.m.name)===nnm(x.p.name))x.m.name=x.m.name+" (bibliothèque)"});go(r,items,Object.assign({},o,{bm:1}))}},
   ()=>{pairs.forEach(x=>this.prep(x));go(r,items,Object.assign({},o,{bm:1,_pairs:pairs}))});return true}catch(e){return false}},
 prep(x){const m=x.m,p=x.p;m.name=p.name;m.weapons=(m.weapons||[]).filter(w=>!(p.weapons||[]).some(y=>wSig(y)===wSig(w)||nk(y.name)===nk(w.name)||wLike(w,y)))},
 post(o){try{const pairs=o&&o._pairs;if(!pairs)return;pairs.forEach(x=>{const m=S.coll[x.m.ref];const u=m&&libUnitOf(m);if(!m||!u)return;
   const pi=(LB().links[m.ref]||{}).prof||0,pf=profOf(u,pi);m.stats=m.stats||{};["M","E","SV","PV","CD","CO"].forEach(k=>{if(!String(m.stats[k]||"").trim()){const v=statOf(pf,k);if(v)m.stats[k]=v}});
   const have=new Set(String(m.apt||"").split(",").map(t=>nk(t)).filter(Boolean)),apt=String(m.apt||"").split(",").map(t=>t.trim()).filter(Boolean);m.text=Array.isArray(m.text)?m.text:[];
   const wd=t=>new Set(nk(t).split(" ").filter(w=>w.length>3)),jac=(a,b)=>{let i=0;a.forEach(w=>{if(b.has(w))i++});const n=a.size+b.size-i;return n?i/n:0};const tl=m.text.map(wd);
   (u.ab||[]).forEach(a=>{const en=nk(a.n),fr=abLines(a);if(have.has(en)||have.has(nk(fr.name)))return;const bw=wd(fr.lines.join(" "));if(bw.size>=4&&tl.some(t=>jac(t,bw)>=.5))return;apt.push(fr.name);fr.lines.forEach(l=>m.text.push(l))});m.apt=apt.join(", ");
   const kws=String(m.kw||"").split(",").map(t=>t.trim()).filter(Boolean),hk=new Set(kws.map(nk));(u.kw||[]).forEach(k=>{const t=tKW(k).t;if(t&&!hk.has(nk(t))&&!hk.has(nk(k))){kws.push(t);hk.add(nk(t))}});m.kw=kws.join(", ");
   snapEq(m,u,u.wp||{});delete m.fromLib;m.merged=1;delete AM[m.ref]});sv()}catch(e){try{console.error(e)}catch(_){}}}};
/* ---------- création d'armée : faction d'abord, puis toutes les figurines (collection + bibliothèque) ---------- */
function slugOfColl(m){try{const lk=LB().links[m.ref];let u=lk&&D.byId[lk.id];if(!u){const am=autoMatch(m);if(am&&am.level==="ok")u=am.u}if(u)return u._c;
 const f=(S.fac||[]).find(x=>x.id===m.fac);if(f){const g=facList().find(x=>nk(x[1])===nk(f.name));if(g)return g[0]}}catch(_){}return null}
window.BIBPK=function(pk){try{
 if(!pk||pk.lead||pk.mode==="d")return null;
 if(!D.ready){if(!D.err&&!BD.wait){BD.wait=true;init().then(()=>{BD.wait=false;try{const r=document.getElementById("pr");if(r)r.innerHTML=pkRes()}catch(_){}})}return null}
 css();const q=nk(pk.q||""),coll=Object.values(S.coll||{}).filter(m=>!(m.mrg&&S.coll[m.mrg])),slugs=new Map(coll.map(m=>[m.ref,slugOfColl(m)]));
 const have=new Set(coll.map(m=>nnm(m.name))),linked=new Set(coll.map(m=>{const l=LB().links[m.ref];return l&&l.id}).filter(Boolean));
 const cardC=m=>{const n=(S.lists.find(l=>l.id===S.cur)||{units:[]}).units.filter(x=>x.ref===m.ref).length;return`<div class="card hv" data-act="pick" data-r="${E(m.ref)}">${n?`<span class="mu" style="float:right">✓ ×${n}</span>`:""}<div class="row">${typeof pimg==="function"?pimg(m):""}<b class="cap">${E(m.name)}</b></div></div>`};
 const cardL=u=>`<div class="card hv" data-bib="pklib" data-id="${E(u.id)}"><div class="row"><b class="cap">${E(frName(u.n))}</b></div><div class="bib-meta">📚 Bibliothèque · ${E(facLbl(u))}${u.pts!=null?" · "+u.pts+" pts":""} — la fiche sera créée dans ta collection</div></div>`;
 const match=(m,n)=>!q||q.split(" ").every(w=>nk(n).includes(w));
 const sel=pk.facs||(pk.facs=[]),fname=g=>g==="__other"?"Autres fiches de ma collection":(facList().find(x=>x[0]===g)||[g,g])[1];
 const unitOf=m=>{try{const lk=LB().links[m.ref];let u=lk&&D.byId[lk.id];if(!u){const am=autoMatch(m);if(am&&am.level==="ok")u=am.u}return u}catch(_){return null}};
 const inF=(m,g)=>g==="__other"?!slugs.get(m.ref):String(g).indexOf("sm:")===0?(()=>{const u=unitOf(m);return !!u&&inFac(u,g)})():slugs.get(m.ref)===g;
 // choix d'une faction (première ou supplémentaire)
 if((!sel.length&&!q)||pk.addf){
  const fl=facList().filter(x=>!sel.includes(x[0])).map(([g,n,c])=>({g,n,c,k:coll.filter(m=>inF(m,g)).length})),other=coll.filter(m=>!slugs.get(m.ref)).length;
  fl.sort((a,b)=>(b.k>0)-(a.k>0)||a.n.localeCompare(b.n));
  const back=sel.length?`<div class="row" style="margin:6px 0"><button class="b" data-bib="pkfaca" data-v="0">↩ Retour aux figurines</button></div>`:"";
  return`${back}<p class="bib-meta">${sel.length?"Ajoute une autre faction : ses figurines s'afficheront avec celles de "+E(sel.map(fname).join(", "))+".":"Choisis d'abord une faction. Tu verras ensuite toutes ses figurines : celles de ta collection et celles de la bibliothèque. Tu pourras ajouter d'autres factions ensuite."}</p><div class="grid" style="margin-top:8px">${fl.map(x=>`<div class="card hv" data-bib="pkfac" data-v="${E(x.g)}"><b>${E(x.n)}</b><div class="bib-meta">${x.k?x.k+" dans ta collection · ":""}${x.c} dans la bibliothèque</div></div>`).join("")}${other&&!sel.includes("__other")?`<div class="card hv" data-bib="pkfac" data-v="__other"><b>Autres fiches de ma collection</b><div class="bib-meta">${other} sans faction identifiée</div></div>`:""}</div>`}
 // figurines des factions choisies (ou recherche dans toutes)
 let head="",out="";
 if(sel.length){
  head=`<div class="bib-chips" style="margin:6px 0">${sel.map(g=>`<button class="on" data-bib="pkfacx" data-v="${E(g)}">${E(fname(g))} ✕</button>`).join("")}<button data-bib="pkfaca" data-v="1">➕ Ajouter une faction</button></div>`;
  sel.forEach(g=>{const C=coll.filter(m=>inF(m,g)&&match(m,m.name)).sort((a,b)=>String(a.name).localeCompare(b.name)),
   L=(g==="__other"?[]:D.units.filter(u=>inFac(u,g)&&!linked.has(u.id)&&!have.has(nnm(u.n))&&!have.has(nnm(frName(u.n)))&&match(u,u.n+" "+frName(u.n)))).sort((a,b)=>frName(a.n).localeCompare(frName(b.n)));
   if(!C.length&&!L.length)return;
   out+=`<h3 style="margin:14px 0 4px">${E(fname(g))}</h3>`+(C.length?`<h4>Ma collection (${C.length})</h4><div class="grid">${C.map(cardC).join("")}</div>`:"")+(L.length?`<h4>Bibliothèque (${L.length})</h4><div class="grid">${L.map(cardL).join("")}</div>`:"")});
 }else{
  head=`<div class="row" style="margin:6px 0;justify-content:space-between"><b>Toutes les factions</b><button class="b" data-bib="pkfacx" data-v="">↩ Choisir une faction</button></div>`;
  const C=coll.filter(m=>match(m,m.name)).sort((a,b)=>String(a.name).localeCompare(b.name)),L=D.units.filter(u=>!linked.has(u.id)&&!have.has(nnm(u.n))&&!have.has(nnm(frName(u.n)))&&match(u,u.n+" "+frName(u.n))).slice(0,40).sort((a,b)=>frName(a.n).localeCompare(frName(b.n)));
  out=(C.length?`<h4>Ma collection (${C.length})</h4><div class="grid">${C.map(cardC).join("")}</div>`:"")+(L.length?`<h4>Bibliothèque (${L.length})</h4><div class="grid">${L.map(cardL).join("")}</div>`:"")}
 return head+(out||`<p class="mu">Aucune figurine trouvée.</p>`)}catch(e){try{console.error(e)}catch(_){}return null}};
/* ---------- intégration ---------- */
window.XV=window.XV||{};XV.bib=function(){try{if(!D.ready&&!D.err)init();return libView()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
const h0=window.XV.home;if(typeof h0==="function")window.XV.home=function(){let b="";try{const un=LB().news.filter(n=>!n.seen);if(un.length){css();const n=un[0];b=`<div class="bib-ban" data-bib="news">🆕 <b>Bibliothèque V11 mise à jour</b> · ${n.items.add.length} nouveauté(s), ${n.items.chg.length} modifiée(s)<br><span class="bib-meta">Touche pour voir le détail</span></div>`}}catch(_){}return b+h0.apply(this,arguments)};
window.BIBAUTO=autoMatch;window.BIBCLS=ref=>{try{const l=LB().links[ref];return l?(l.stale?" old":" on"):""}catch(_){return""}};
window.BIB={wLike,trDesc,learnAb,sents,init,D,tWK,tKW,tAB,tName,tPhase,suggest,search,buildCmp,applyCmp,checkUpdate,verify,exportLib,importLib,sha1,LB,gunzip,wToApp,wSig,diffNews};
// vérification automatique, au plus 1 fois par jour, silencieuse
setTimeout(async()=>{try{const lb=LB();if(!lb.auto||!navigator.onLine)return;if(lb.last&&Date.now()-lb.last.at<20*3600*1000)return;await init();const r=await checkUpdate(false);if(r.state==="updated"){try{toast("🆕 Bibliothèque V11 mise à jour")}catch(_){}try{draw()}catch(_){}}}catch(_){}},6000);
})();
