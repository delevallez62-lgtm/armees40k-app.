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
const LB=()=>{const l=S.lib=S.lib&&typeof S.lib==="object"?S.lib:{};l.links=l.links||{};l.bk=l.bk||{};l.news=l.news||[];l.tr=l.tr||{};if(l.auto==null)l.auto=true;if(!l.src)l.src=DEF_SRC;return l};
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
async function gunzip(b64){const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
 const rs=new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip")));return rs.text()}
const D={ready:false,man:null,chunks:{},units:[],byId:{},dets:[],enh:[],str:[],rules:[],err:null,origin:""};
function index(){D.units=[];D.dets=[];D.enh=[];D.str=[];D.rules=[];D.byId={};
 Object.entries(D.chunks).forEach(([id,c])=>{(c.units||[]).forEach(u=>{u._c=id;D.units.push(u);D.byId[u.id]=u});(c.detachments||[]).forEach(x=>{x._c=id;D.dets.push(x)});(c.enhancements||[]).forEach(x=>{x._c=id;D.enh.push(x)});(c.stratagems||[]).forEach(x=>{x._c=id;D.str.push(x)});(c.rules||[]).forEach(x=>D.rules.push(x))});
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
  await loadFromIdb();D.ready=true;D.err=null}catch(e){D.err=e&&e.message||String(e)}
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
 const m=/^([A-Za-z' -]+?)\s*((?:D?\d+(?:")?\+?|D\d)?)\s*(\(.*\))?$/.exec(s);if(m){const f=AB[m[1].trim().toLowerCase()];if(f)return{t:f+(m[2]?" "+m[2]:"")+(m[3]?" "+m[3]:""),st:"ok"}}return{t:s,st:"no"}}
function tName(en){const s=String(en||"").trim(),u=LB().tr["n:"+nk(s)];return u&&u.fr?{t:u.fr,st:u.st||"ok",src:"user"}:{t:s,st:"no"}}
function tPhase(en){const s=String(en||"").trim(),f=PH[s.toLowerCase()];return f?{t:f,st:"ok"}:{t:s,st:"no"}}
const SB={ok:["🟢","Traduction confirmée"],chk:["🟠","À vérifier"],no:["⚪","Non traduit"]};
const badge=st=>`<span class="bib-st ${st}" title="${SB[st][1]}">${SB[st][0]}</span>`;
const show=r=>r.st==="ok"?r.t:r.t; // un texte « à vérifier » ou « non traduit » reste affiché tel qu'il est dans la source
/* ---------- conversions vers le format de HAMMER ---------- */
const nm=x=>String(x==null?"":x).replace(/"/g,"").trim();
const stripMd=s=>String(s||"").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1").replace(/■/g,"•");
function wToApp(w,melee){const name=String(w.n).replace(/^➤\s*/,""),cp=(w.kw||[]).map(k=>{const r=tWK(k);return r.t}).filter(x=>x&&x!=="-").join(", ");
 const tn=tName(name);return{name:tn.t,range:melee?"Mêlée":nm(w.r),a:nm(w.a),hit:nm(w.sk)==="N/A"?"-":nm(w.sk),f:nm(w.s),pa:nm(w.ap),d:nm(w.d),caps:cp}}
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
 return D.units.filter(u=>(!fac||(fac==="orks"?u._c==="orks":u._c==="space-marines"))&&(!w.length||w.every(x=>(nk(u.n)+" "+nk((LB().tr["n:"+nk(u.n)]||{}).fr||"")+" "+nk((u.kw||[]).join(" "))).includes(x)))).slice(0,60)}
/* ---------- rapprochement : comparaison puis choix ---------- */
function buildCmp(m,u,pi){const p=profOf(u,pi),rows={stats:[],weapons:[],abil:[],kw:[],misc:[]};
 const ms=m.stats||{};["M","E","SV","PV","CD","CO"].forEach(k=>{const lib=statOf(p,k),mine=String(ms[k]==null?"":ms[k]).trim();
  if(!lib)return;if(!mine)rows.stats.push({id:"st:"+k,k,lib,mine,kind:"add"});else if(nk(mine)!==nk(lib))rows.stats.push({id:"st:"+k,k,lib,mine,kind:"diff"});else rows.stats.push({id:"st:"+k,k,lib,mine,kind:"same"})});
 const mine=(m.weapons||[]).map(w=>({w,s:wSig(w),n:nk(w.name)}));
 const libW=[...(u.rw||[]).map(w=>({lw:w,aw:wToApp(w,false)})),...(u.mw||[]).map(w=>({lw:w,aw:wToApp(w,true)}))];
 libW.forEach((x,i)=>{const s=wSig(x.aw),same=mine.find(y=>y.s===s),byName=mine.find(y=>y.n===nk(x.aw.name)||y.n===nk(String(x.lw.n).replace(/^➤\s*/,"")));
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
function applyCmp(m,u,pi,rows,pick){const ref=m.ref,lb=LB();const bk={stats:clone(m.stats),weapons:clone(m.weapons),apt:m.apt,text:clone(m.text),kw:m.kw,pts:m.pts,at:Date.now()};lb.bk[ref]=bk;
 const done=[];const p=profOf(u,pi);m.stats=m.stats||{};
 rows.stats.forEach(r=>{if(pick[r.id]){m.stats[r.k]=r.lib;done.push(r.k)}});
 m.weapons=Array.isArray(m.weapons)?m.weapons:[];
 rows.weapons.forEach(r=>{const c=pick[r.id];if(!c)return;
  if(r.kind==="add"){m.weapons.push(clone(r.x.aw));done.push("arme:"+r.x.aw.name)}
  else if(r.kind==="diff"){const i=m.weapons.indexOf(r.mine);if(i>=0){const keepName=m.weapons[i].name;m.weapons[i]=Object.assign(clone(r.x.aw),{name:keepName});done.push("arme:"+keepName)}}
  if(r.kind==="same"&&r.learn&&pick["ln:"+r.id]){const en=String(r.x.lw.n).replace(/^➤\s*/,"");lb.tr["n:"+nk(en)]={fr:r.mine.name,st:"ok",src:"user",at:Date.now()};done.push("nom:"+en)}});
 const apt=String(m.apt||"").split(",").map(s=>s.trim()).filter(Boolean);m.text=Array.isArray(m.text)?m.text:[];
 rows.abil.forEach(r=>{if(r.kind==="add"&&pick[r.id]){const name=r.t.t;if(!apt.some(x=>nk(x)===nk(name)))apt.push(name);const body=stripMd(r.a.d).split("\n").map(s=>s.trim()).filter(Boolean);m.text.push((name+" "+(body[0]||"")).trim());body.slice(1).forEach(l=>m.text.push(l));done.push("capacité:"+name)}});
 m.apt=apt.join(", ");
 const kws=String(m.kw||"").split(",").map(s=>s.trim()).filter(Boolean);rows.kw.forEach(r=>{if(pick[r.id]){kws.push(r.t.t);done.push("mot-clé:"+r.t.t)}});m.kw=kws.join(", ");
 rows.misc.forEach(r=>{if(r.id==="pts"&&pick[r.id]){m.pts=+r.lib;done.push("points")}});
 lb.links[ref]={id:u.id,h:u.h,v:D.man.version,at:Date.now(),prof:pi,applied:done,stale:false};
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
 await idbPut("meta",{id:"manifest",man,origin:"sync",at:Date.now()});await loadFromIdb();
 // associations conservées ; on signale seulement celles dont la fiche a changé
 let stale=0;Object.entries(lb.links).forEach(([ref,l])=>{const u=D.byId[l.id];if(u&&u.h!==l.h){l.stale=true;stale++}});news.stale=stale;
 if(news.items.add.length||news.items.chg.length||news.items.del.length||stale){lb.news.unshift(news);lb.news=lb.news.slice(0,20)}
 lb.last.ok=man.version;sv();return{state:"updated",news}}
async function exportLib(){await init();const o={kind:"hammer-biblio",schema:1,at:Date.now(),manifest:D.man,chunks:{}};const rows=await idbAll("chunks");rows.forEach(r=>o.chunks[r.id]=r.raw);return JSON.stringify(o)}
async function importLib(txt){let o;try{o=JSON.parse(txt)}catch(_){throw new Error("Fichier illisible")}
 if(!o||o.kind!=="hammer-biblio"||!o.manifest||!o.chunks)throw new Error("Ce n'est pas une sauvegarde de bibliothèque");
 for(const c of o.manifest.chunks){const t=o.chunks[c.id];if(typeof t!=="string"||sha1(t)!==c.sha1)throw new Error("Intégrité refusée : "+c.id)}
 for(const c of o.manifest.chunks)await idbPut("chunks",{id:c.id,raw:o.chunks[c.id],sha1:c.sha1});
 await idbPut("meta",{id:"manifest",man:o.manifest,origin:"restore",at:Date.now()});await loadFromIdb()}
async function verify(){await init();const rows=await idbAll("chunks"),bad=[];const man={};(D.man.chunks||[]).forEach(c=>man[c.id]=c);
 for(const r of rows){if(!man[r.id]||sha1(r.raw)!==man[r.id].sha1)bad.push(r.id)}
 (D.man.chunks||[]).forEach(c=>{if(!rows.find(r=>r.id===c.id))bad.push(c.id+" (absent)")});return bad}
async function restorePrev(){const rows=await idbAll("prev");if(!rows.length)throw new Error("Aucune version précédente conservée");
 for(const r of rows)await idbPut("chunks",{id:r.id,raw:r.raw,sha1:r.sha1});
 // manifeste reconstruit à partir des chunks restaurés
 const man=clone(D.man);man.chunks.forEach(c=>{const r=rows.find(x=>x.id===c.id);if(r){c.sha1=r.sha1;c.bytes=r.raw.length}});man.version=(rows[0].man||man.version);
 await idbPut("meta",{id:"manifest",man,origin:"restore",at:Date.now()});await loadFromIdb()}
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
.bib-ban{border:2px solid var(--ac);border-radius:14px;padding:10px 12px;margin:0 0 12px;background:color-mix(in srgb,var(--ac) 12%,transparent);cursor:pointer}
`;document.head.appendChild(s)}
const box=id=>{let b=document.getElementById(id);if(!b){b=document.createElement("div");b.id=id;document.body.appendChild(b)}return b};
const closeM=id=>{const b=document.getElementById(id);if(b)b.innerHTML=""};
const fmtD=t=>{try{return new Date(t).toLocaleDateString("fr-FR")}catch(_){return""}};
const STATS=[["M","M"],["E","E"],["SV","Sv"],["PV","PV"],["CD","Cd"],["CO","CO"]];
function unitHtml(u){const tn=tName(u.n);
 let h=`<h4>${E(u.n)} ${badge(tn.st)}</h4>${tn.st==="ok"?`<p>Nom français : <b>${E(tn.t)}</b></p>`:`<p class="bib-meta">Nom original anglais · pas de traduction confirmée</p>`}<p class="bib-meta">${E(u.f.join(", "))} · ${u.pts!=null?u.pts+" pts · ":""}${u.sz?"taille "+u.sz.min+(u.sz.max&&u.sz.max!==u.sz.min?"–"+u.sz.max:"")+" · ":""}source ${E(u._c)} · ${E(u.id)}</p>`;
 h+=u.pr.map(p=>`<div class="bib-row"><b>${E(p.n)}</b><div>${STATS.map(([k,l])=>`${l} <b>${E(nm(p[k])||"–")}</b>`).join(" · ")}</div></div>`).join("");
 const W=(a,melee)=>a.map(w=>{const aw=wToApp(w,melee),ks=(w.kw||[]).map(k=>{const r=tWK(k);return`${E(r.t)}${badge(r.st)}`}).join(", ");return`<div class="bib-row"><b>${E(aw.name)}</b> <span class="bib-meta">${E(w.n!==aw.name?w.n:"")}</span><div>${melee?"Mêlée":"Portée "+E(aw.range)+'"'} · A ${E(aw.a)} · ${melee?"CC":"CT"} ${E(aw.hit)} · F ${E(aw.f)} · PA ${E(aw.pa)} · D ${E(aw.d)}</div>${ks?`<div class="bib-wl">${ks}</div>`:""}</div>`}).join("");
 h+=`<h4>Armes de tir (${u.rw.length})</h4>${W(u.rw,false)||'<p class="bib-meta">Aucune</p>'}<h4>Armes de mêlée (${u.mw.length})</h4>${W(u.mw,true)||'<p class="bib-meta">Aucune</p>'}`;
 h+=`<h4>Capacités (${u.ab.length})</h4>${u.ab.map(a=>{const t=tAB(a.n);return`<details class="bib-row"><summary><b>${E(t.t)}</b> ${badge(t.st)}${t.st!=="ok"?"":` <span class="bib-meta">${E(a.n)}</span>`}</summary><p>${E(stripMd(a.d)).replace(/\n/g,"<br>")}</p><p class="bib-meta">Texte original anglais (non traduit)</p></details>`}).join("")||'<p class="bib-meta">Aucune</p>'}`;
 h+=`<h4>Mots-clés</h4><p>${u.kw.map(k=>{const r=tKW(k);return`${E(r.t)}${badge(r.st)}`}).join(", ")}</p>`;
 h+=`<p class="bib-meta">Options d'équipement et restrictions : non présentes dans les données sources.</p>`;return h}
function libView(){css();const lb=LB(),man=D.man;
 let h=`<div class="card"><div class="row" style="justify-content:space-between"><b>📚 Bibliothèque V11</b><button class="b" data-bib="menu">⚙ Gérer</button></div>`;
 if(!D.ready){h+=`<p class="mu">${D.err?"Erreur : "+E(D.err):"Chargement de la bibliothèque…"}</p></div>`;if(!D.err)init().then(()=>{try{draw()}catch(_){}});return h}
 h+=`<p class="bib-meta">Version ${E(man.version)} · récupérée le ${E(man.generated||"")} · ${D.units.length} fiches · ${D.dets.length} détachements · ${D.str.length} stratagèmes · ${D.enh.length} améliorations</p><p class="bib-meta">Données communautaires non officielles (BSData / Warhammer Oracle). Warhammer 40,000 est la propriété de Games Workshop. <a href="#" data-bib="lic">Licences et sources</a></p></div>`;
 const un=lb.news.filter(n=>!n.seen);
 if(lb.news.length)h+=`<details class="card" ${un.length?"open":""}><summary><b>🆕 Nouveautés</b> ${un.length?`<span class="bib-st">${un.length} non lue(s)</span>`:""}</summary>${lb.news.slice(0,5).map((n,i)=>`<div class="bib-new"><b>${fmtD(n.at)}</b> · version ${E(n.to||"")}<br>${n.items.add.length?`➕ ${n.items.add.length} nouveauté(s) : ${E(n.items.add.slice(0,6).map(x=>x.t+" "+x.n).join(" ; "))}${n.items.add.length>6?"…":""}<br>`:""}${n.items.chg.length?`✎ ${n.items.chg.length} modifiée(s) : ${E(n.items.chg.slice(0,6).map(x=>x.t+" "+x.n).join(" ; "))}${n.items.chg.length>6?"…":""}<br>`:""}${n.items.del.length?`➖ ${n.items.del.length} retirée(s)<br>`:""}${n.stale?`⚠ ${n.stale} fiche(s) de ta collection liées à une fiche modifiée : ouvre-les pour revoir.<br>`:""}</div>`).join("")}<button class="b" data-bib="seen">Tout marquer comme lu</button></details>`;
 h+=`<div class="card"><label>Rechercher<input id="bibq" value="${E(B.q)}" placeholder="Nom, mot-clé…" autocomplete="off"></label><div class="bib-chips">${[["","Tout"],["space-marines","Space Marines"],["orks","Orks"]].map(([k,n])=>`<button class="${B.fac===k?"on":""}" data-bib="fac" data-v="${k}">${n}</button>`).join("")}</div><div class="bib-chips">${[["units","Unités"],["det","Détachements"],["str","Stratagèmes"],["enh","Améliorations"],["rules","Règles"]].map(([k,n])=>`<button class="${B.tab===k?"on":""}" data-bib="tab" data-v="${k}">${n}</button>`).join("")}</div></div><div id="bibl">${list()}</div>`;return h}
function list(){const q=nk(B.q),f=B.fac,inF=x=>!f||x._c===f||x._c==="common",hit=s=>!q||q.split(" ").every(w=>nk(s).includes(w));let h="";
 if(B.tab==="units"){const L=search(B.q,f);h=L.map(u=>{const t=tName(u.n);return`<div class="card hv" data-bib="unit" data-id="${E(u.id)}"><b class="cap">${E(t.t)}</b> ${badge(t.st)}<div class="bib-meta">${E(u.f.join(", "))} · ${u.pts!=null?u.pts+" pts":""}</div></div>`}).join("")||'<p class="mu">Aucune fiche.</p>';if(D.units.length&&L.length===60)h+='<p class="mu">Affine la recherche pour voir la suite.</p>'}
 else if(B.tab==="det"){h=D.dets.filter(x=>inF(x)&&hit(x.n+" "+(x.f||""))).map(d=>`<details class="card"><summary><b>${E(d.n)}</b> <span class="bib-meta">${E(d.f||"")} · ${d.pts!=null?d.pts+" pt(s)":""}</span> ${badge("no")}</summary>${d.ab?`<p><b>${E(d.ab.name)}</b><br>${E(stripMd(d.ab.description)).replace(/\n/g,"<br>")}</p>`:""}<p class="bib-meta">Dispositions : ${E((d.dp||[]).join(", ")||"—")}</p><p class="bib-meta">Texte original anglais (non traduit)</p><p><b>Stratagèmes liés :</b> ${D.str.filter(s=>s.det===d.n).length} · <b>Améliorations :</b> ${D.enh.filter(e=>e.det===d.n).length}</p></details>`).join("")||'<p class="mu">Aucun.</p>'}
 else if(B.tab==="str"){h=D.str.filter(x=>inF(x)&&hit(x.n+" "+(x.det||"")+" "+(x.f||""))).slice(0,120).map(s=>{const p=tPhase(s.ph||"");return`<details class="card"><summary><b>${E(s.n)}</b> <span class="bib-st">${s.cp!=null?s.cp+" PC":""}</span> <span class="bib-meta">${E(s.det||s.f||"")}</span></summary><p class="bib-meta">Phase : ${E(p.t)} ${badge(p.st)} · Type : ${E(s.t||"—")}</p><p><b>Quand :</b> ${E(s.when||"—")}</p><p><b>Cible :</b> ${E(s.tg||"—")}</p><p><b>Effet :</b> ${E(s.fx||"—")}</p>${s.rs?`<p><b>Restrictions :</b> ${E(s.rs)}</p>`:""}<p class="bib-meta">Texte original anglais (non traduit)</p></details>`}).join("")||'<p class="mu">Aucun.</p>'}
 else if(B.tab==="enh"){h=D.enh.filter(x=>inF(x)&&hit(x.n+" "+(x.det||""))).map(e=>`<details class="card"><summary><b>${E(e.n)}</b> <span class="bib-meta">${E(e.det||"")} · ${e.pts!=null?e.pts+" pts":""}</span></summary><p>${E(stripMd(e.d))}</p><p class="bib-meta">Texte original anglais (non traduit)</p></details>`).join("")||'<p class="mu">Aucune.</p>'}
 else if(B.tab==="rules"){h=D.rules.filter(r=>hit(r.n)).map(r=>`<details class="card"><summary><b>${E(r.n)}</b></summary><p>${E(stripMd(r.d)).replace(/\n/g,"<br>")}</p><p class="bib-meta">Texte original anglais (non traduit)</p></details>`).join("")}
 return h}
function openUnit(id){const u=D.byId[id];if(!u)return;css();const o=box("bibm");
 o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>Fiche de la bibliothèque</h2><button class="b" data-bib="x">✕</button></div>${unitHtml(u)}<div class="bib-meta">Légende : 🟢 traduction confirmée · 🟠 à vérifier · ⚪ non traduit (texte d'origine conservé)</div><button class="b p" data-bib="pickcoll" data-id="${E(u.id)}" style="width:100%;margin-top:8px">🔗 Rapprocher avec une fiche de ma collection</button></div></div>`}
function openPickColl(id){const u=D.byId[id];if(!u)return;const items=Object.values(S.coll||{}).filter(m=>!(m.mrg&&S.coll[m.mrg])).sort((a,b)=>String(a.name).localeCompare(String(b.name)));const o=box("bibm");
 o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>Choisir ma fiche</h2><button class="b" data-bib="x">✕</button></div><p class="bib-meta">Bibliothèque : <b>${E(u.n)}</b>. Sélectionne la fiche de ta collection à enrichir.</p>${items.map(m=>`<button class="b" data-bib="cmp" data-r="${E(m.ref)}" data-id="${E(u.id)}" style="width:100%;text-align:left;margin:4px 0">${E(m.name)}${LB().links[m.ref]?" 📚":""}</button>`).join("")||'<p class="mu">Ta collection est vide.</p>'}</div></div>`}
function openLink(ref){css();const m=S.coll[ref];if(!m)return;const lb=LB(),lk=lb.links[ref];const o=box("bibm");
 const run=()=>{const sg=suggest(m);o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>📚 Bibliothèque</h2><button class="b" data-bib="x">✕</button></div><p>Fiche de ta collection : <b class="cap">${E(m.name)}</b></p>
 ${lk&&D.byId[lk.id]?`<div class="bib-row bib-a">✅ Déjà rapprochée avec <b>${E(D.byId[lk.id].n)}</b> (${fmtD(lk.at)})${lk.stale?" · ⚠ la fiche de la bibliothèque a changé depuis":""}.<br><button class="b" data-bib="cmp" data-r="${E(ref)}" data-id="${E(lk.id)}">Revoir / compléter</button> <button class="b x" data-bib="unlink" data-r="${E(ref)}">Défaire</button></div>`:""}
 <label>Chercher dans la bibliothèque<input id="bibs" placeholder="ex. Intercessors, Boyz…" value="${E(B.sq==null?m.name:B.sq)}" autocomplete="off"></label>
 <p class="bib-meta">HAMMER propose, c'est toi qui décides. Rien n'est jamais rapproché automatiquement.</p><div id="bibsr">${sres(m)}</div></div></div>`};
 B.ref=ref;B.sq=undefined;if(D.ready)run();else init().then(run)}
function sres(m){const q=B.sq==null?m.name:B.sq;let L;if(B.sq==null){L=suggest(m).map(x=>x.u);return(L.length?`<p class="bib-meta">Correspondances possibles (à vérifier) :</p>`:`<p class="tt-miss" style="color:#e0a030">Aucune correspondance proposée pour « ${E(m.name)} » : cette unité ne semble pas être dans la bibliothèque (Space Marines et Orks seulement). Tu peux quand même chercher à la main.</p>`)+L.map(u=>cand(m,u)).join("")}
 L=search(q,"");return L.map(u=>cand(m,u)).join("")||'<p class="mu">Aucun résultat.</p>'}
const cand=(m,u)=>{const t=tName(u.n);return`<div class="bib-row"><b>${E(t.t)}</b> ${badge(t.st)}<div class="bib-meta">${E(u.f.join(", "))} · ${u.pr.length} profil(s) · ${u.rw.length+u.mw.length} arme(s)</div><button class="b p" data-bib="cmp" data-r="${E(m.ref)}" data-id="${E(u.id)}">Voir et comparer</button></div>`};
function openCmp(ref,id,pi){const m=S.coll[ref],u=D.byId[id];if(!m||!u)return;css();pi=pi==null?(u.pr.findIndex(p=>nk(p.n)===nk(u.n))>=0?u.pr.findIndex(p=>nk(p.n)===nk(u.n)):0):pi;
 const rows=buildCmp(m,u,pi);B.cmp={ref,id,pi,rows,pick:{}};
 // valeurs par défaut : on ajoute ce qui manque ; on garde tes données quand elles diffèrent
 const P=B.cmp.pick;[...rows.stats,...rows.weapons,...rows.abil,...rows.kw,...rows.misc].forEach(r=>{if(r.kind==="add")P[r.id]=true});
 drawCmp()}
function drawCmp(){const C=B.cmp;if(!C)return;const m=S.coll[C.ref],u=D.byId[C.id],R=C.rows,P=C.pick,o=box("bibm");
 const ck=(id,txt,cls)=>`<label class="bib-ck"><input type="checkbox" data-bibck="${id}" ${P[id]?"checked":""}><span>${txt}</span></label>`;
 const sec=(t,body,empty)=>`<h4>${t}</h4>${body||`<p class="bib-meta">${empty||"Rien à compléter."}</p>`}`;
 let h=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>Rapprochement</h2><button class="b" data-bib="x">✕</button></div>
 <p><b class="cap">${E(m.name)}</b> (ma collection) ↔ <b>${E(u.n)}</b> (bibliothèque)</p>
 <p class="bib-meta">Rien n'est modifié tant que tu n'as pas validé. Les cases cochées seront ajoutées ou changées ; les valeurs différentes sont <b>conservées chez toi</b> sauf si tu coches l'autre.</p>
 ${u.pr.length>1?`<label>Profil de la bibliothèque utilisé pour les caractéristiques<select data-bibpi="1">${u.pr.map((p,i)=>`<option value="${i}"${i===C.pi?" selected":""}>${E(p.n)}</option>`).join("")}</select></label>`:""}`;
 h+=sec("Caractéristiques",R.stats.filter(r=>r.kind!=="same").map(r=>r.kind==="add"?ck(r.id,`<b>${r.k}</b> absente : ajouter <b>${E(r.lib)}</b>`):`<div class="bib-row bib-d"><b>${r.k}</b> : toi <b>${E(r.mine)}</b> · bibliothèque <b>${E(r.lib)}</b><br>${ck(r.id,"Remplacer par la valeur de la bibliothèque")}</div>`).join(""),"Toutes les caractéristiques concordent déjà ou sont complètes.");
 h+=sec("Armes et équipements",R.weapons.map(r=>{const aw=r.x.aw,pr=`${aw.range}${/^\d/.test(aw.range)?'"':""} · A ${aw.a} · ${aw.hit} · F ${aw.f} · PA ${aw.pa} · D ${aw.d}`;
  if(r.kind==="same")return`<div class="bib-row bib-s">✓ <b>${E(aw.name)}</b> existe déjà chez toi (<b>${E(r.mine.name)}</b>, même profil).${r.learn?`<br>${ck("ln:"+r.id,`Retenir « ${E(r.mine.name)} » comme nom français de « ${E(String(r.x.lw.n).replace(/^➤\s*/,""))} »`)}`:""}</div>`;
  if(r.kind==="diff")return`<div class="bib-row bib-d"><b>${E(r.mine.name)}</b> : valeurs différentes<div class="bib-two"><div>Toi : ${E(r.mine.range)} · A ${E(r.mine.a)} · ${E(r.mine.hit)} · F ${E(r.mine.f)} · PA ${E(r.mine.pa)} · D ${E(r.mine.d)}</div><div>Biblio : ${E(pr)}</div></div>${ck(r.id,"Remplacer le profil par celui de la bibliothèque (je garde le nom)")}</div>`;
  return`<div class="bib-row bib-a">${ck(r.id,`Ajouter <b>${E(aw.name)}</b> — ${E(pr)}${aw.caps?` — ${E(aw.caps)}`:""}`)}</div>`}).join(""),"Aucune arme dans la bibliothèque.");
 h+=sec("Capacités",R.abil.filter(r=>r.kind==="add").map(r=>ck(r.id,`Ajouter <b>${E(r.t.t)}</b> ${badge(r.t.st)} <span class="bib-meta">(texte en anglais)</span>`)).join(""),"Toutes les capacités sont déjà présentes.");
 h+=sec("Mots-clés",R.kw.map(r=>ck(r.id,`Ajouter <b>${E(r.t.t)}</b> ${badge(r.t.st)}`)).join(""),"Aucun mot-clé à ajouter.");
 h+=sec("Points",R.misc.filter(r=>r.kind!=="same").map(r=>r.kind==="add"?ck(r.id,`Points absents : ajouter <b>${E(r.lib)}</b>`):`<div class="bib-row bib-d">Points : toi <b>${E(r.mine)}</b> · biblio <b>${E(r.lib)}</b><br>${ck(r.id,"Remplacer")}</div>`).join(""),"Points identiques ou non renseignés.");
 h+=`<p class="bib-meta">Options d'équipement et restrictions : non fournies par les sources. Les listes d'armée existantes ne sont pas modifiées ; les nouvelles armes sont ajoutées à ta fiche de collection, à toi de les choisir à l'ajout dans une liste.</p>
 <div class="row" style="gap:8px;margin-top:8px"><button class="b" data-bib="x" style="flex:1">Annuler</button><button class="b p" data-bib="apply" style="flex:2">✔ Valider le rapprochement</button></div></div></div>`;
 const sc=(o.querySelector&&o.querySelector(".bib-pn"))?o.querySelector(".bib-pn").scrollTop:0;o.innerHTML=h;const pn=o.querySelector(".bib-pn");if(pn)pn.scrollTop=sc}
function menu(){css();const lb=LB(),o=box("bibm");o.innerHTML=`<div class="bib-ov" data-bib="bg"><div class="bib-pn"><div class="bib-top"><h2>⚙ Gérer la bibliothèque</h2><button class="b" data-bib="x">✕</button></div>
 <p class="bib-meta">Version ${E(D.man?D.man.version:"—")} · origine ${E(D.origin||"—")} · dernière vérification ${lb.last?fmtD(lb.last.at)+(lb.last.err?" (échec : "+E(lb.last.err)+")":""):"jamais"}</p>
 <div class="bib-row"><b>Mise à jour (facultative)</b><p class="bib-meta">Compare les versions, ne télécharge que ce qui a changé, vérifie l'intégrité, conserve tes fiches et tes rapprochements.</p><label class="bib-ck"><input type="checkbox" data-bibopt="auto" ${lb.auto?"checked":""}><span>Vérifier automatiquement (1 fois par jour, si Internet)</span></label><button class="b p" data-bib="upd" style="width:100%">🔄 Vérifier les nouveautés maintenant</button><div id="bibmsg" class="bib-meta"></div></div>
 <div class="bib-row"><b>Sauvegarde</b><button class="b" data-bib="exp">💾 Sauvegarder la bibliothèque</button> <label class="b" style="cursor:pointer">📂 Restaurer<input type="file" accept=".json,application/json" id="bibimp" hidden></label> <button class="b" data-bib="prev">↩ Version précédente</button></div>
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
  case"cmp":await init();openCmp(b.dataset.r,b.dataset.id);break;
  case"apply":{const C=B.cmp;if(!C)break;const m=S.coll[C.ref],u=D.byId[C.id];const done=applyCmp(m,u,C.pi,C.rows,C.pick);closeM("bibm");B.cmp=null;try{draw()}catch(_){}try{toast(done.length?"Fiche complétée ("+done.length+" élément"+(done.length>1?"s":"")+") ✓":"Rapprochement enregistré, aucun changement")}catch(_){}break}
  case"unlink":ask({t:"Défaire le rapprochement ?",p:"Le lien est supprimé. Tu peux aussi retirer ce qui a été ajouté en revenant à l'état d'avant.",ok:"Garder les ajouts",alt:"Annuler les ajouts",altcb:()=>{undoLink(b.dataset.r,true);closeM("bibm");try{draw()}catch(_){}toast("Fiche remise comme avant")}},()=>{undoLink(b.dataset.r,false);closeM("bibm");try{draw()}catch(_){}});break;
  case"menu":menu();break;
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
 if(t.dataset&&t.dataset.bibpi&&B.cmp){const C=B.cmp;openCmp(C.ref,C.id,+t.value);return}
 if(t.dataset&&t.dataset.bibopt==="auto"){LB().auto=t.checked;sv();return}
 if(t.id==="bibimp"){const f=t.files&&t.files[0];if(!f)return;f.text().then(async x=>{try{await importLib(x);msg("✅ Bibliothèque restaurée.");try{draw()}catch(_){}}catch(er){msg("⚠ "+er.message)}})}});
document.addEventListener("input",e=>{const t=e.target;if(!t)return;
 if(t.id==="bibq"){B.q=t.value;const l=document.getElementById("bibl");if(l)l.innerHTML=list()}
 if(t.id==="bibs"){B.sq=t.value;const m=S.coll[B.ref];const r=document.getElementById("bibsr");if(m&&r)r.innerHTML=sres(m)}});
/* ---------- intégration ---------- */
window.XV=window.XV||{};XV.bib=function(){try{if(!D.ready&&!D.err)init();return libView()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
const h0=window.XV.home;if(typeof h0==="function")window.XV.home=function(){let b="";try{const un=LB().news.filter(n=>!n.seen);if(un.length){css();const n=un[0];b=`<div class="bib-ban" data-bib="news">🆕 <b>Bibliothèque V11 mise à jour</b> · ${n.items.add.length} nouveauté(s), ${n.items.chg.length} modifiée(s)<br><span class="bib-meta">Touche pour voir le détail</span></div>`}}catch(_){}return b+h0.apply(this,arguments)};
window.BIBCLS=ref=>{try{const l=LB().links[ref];return l?(l.stale?" old":" on"):""}catch(_){return""}};
window.BIB={init,D,tWK,tKW,tAB,tName,tPhase,suggest,search,buildCmp,applyCmp,checkUpdate,verify,exportLib,importLib,sha1,LB,gunzip,wToApp,wSig,diffNews};
// vérification automatique, au plus 1 fois par jour, silencieuse
setTimeout(async()=>{try{const lb=LB();if(!lb.auto||!navigator.onLine)return;if(lb.last&&Date.now()-lb.last.at<20*3600*1000)return;await init();const r=await checkUpdate(false);if(r.state==="updated"){try{toast("🆕 Bibliothèque V11 mise à jour")}catch(_){}try{draw()}catch(_){}}}catch(_){}},6000);
})();
