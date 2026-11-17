/* ===== Constructeur d'armée V11 : catalogue visuel, effectifs, armes, meneurs, détachement, optimisations, points ===== */
const BLD={id:null,scr:"home",q:"",src:"all",fac:"",role:"",cfg:null,ldr:null,dq:"",lq:"",log:null};
const RG=r=>{r=String(r||"");return/Epic Hero/i.test(r)?"Héros épiques":/Character/i.test(r)?"Personnages":/Battleline/i.test(r)?"Ligne":/Dedicated Transport/i.test(r)?"Transports assignés":/Aircraft/i.test(r)?"Aéronefs":/Titanic/i.test(r)?"Titanesques":/Monster/i.test(r)?"Monstres":/Walker/i.test(r)?"Marcheurs":/Mounted/i.test(r)?"Montés":/Vehicle/i.test(r)?"Véhicules":/Infantry/i.test(r)?"Infanterie":/Fortification/i.test(r)?"Fortifications":r||"Autre"};
const roleOf=u=>{if(!u)return"Autre";const r=u.wp&&u.wp.role;if(r)return RG(r);const k=(u.kw||[]).join(" ");return RG(/Epic Hero/i.test(k)?"Epic Hero":/Character/i.test(k)?"Character":/Battleline/i.test(k)?"Battleline":/Vehicle/i.test(k)?"Vehicle":/Monster/i.test(k)?"Monster":/Infantry/i.test(k)?"Infantry":"")};
const isChar=u=>/Personnage|Héros/.test(roleOf(u));
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const ptsMeta=()=>{const m=D.man||{},p=(m.source&&m.source.points)||{};return{src:p.source||"Données de la bibliothèque",pub:p.published||(m.source&&m.source.wahapedia&&m.source.wahapedia.last_update)||"",ver:m.version||"",sync:p.synchronised||m.generated||"",chk:(LB().last&&LB().last.at)||0}};
const ptsVer=()=>ptsMeta().pub+"|"+ptsMeta().ver.replace(/\+fr\d+/,"");
/* ----- barème ----- */
const pcOf=u=>u&&((u.wp&&u.wp.pc)||u.pc)||null;
const tierFor=(pc,copy)=>pc.tiers.find(t=>copy>=t.a&&(t.b==null||copy<=t.b))||pc.tiers[pc.tiers.length-1];
function sizesOf(u,copy){if(!u)return[];const pc=pcOf(u);if(pc)return tierFor(pc,copy).sz.map(x=>({n:x.n,m:x.m||x.n,pts:x.pts}));
 if(u.sz&&u.sz.min!=null){const a=[];for(let n=u.sz.min;n<=Math.min(u.sz.max,u.sz.min+12);n++)a.push({n,m:n,pts:n===u.sz.min&&u.pts!=null?+u.pts:null});return a}return[]}
function costOf(u,size,copy){if(!u)return{pts:null,note:"Coût à vérifier"};const pc=pcOf(u);
 if(pc){const t=tierFor(pc,copy),r=t.sz.find(x=>size===x.n||(x.m&&size>=x.n&&size<=x.m));return r?{pts:r.pts,src:"Wahapedia 11e",tier:t.a+(t.b==null?"+":t.b!==t.a?"–"+t.b:"")}:{pts:null,note:"Effectif hors barème : coût à vérifier"}}
 if(u.pts!=null&&(!u.sz||size===u.sz.min))return{pts:+u.pts,src:"BSData"};return{pts:null,note:"Coût à vérifier"}}
/* ----- moteur de points centralisé ----- */
function calc(L){const lines=[],seen={};let total=0,unk=0;const bump=id=>seen[id]=(seen[id]||0)+1;
 const add=(ln)=>{lines.push(ln);if(ln.pts==null)unk++;else total+=ln.pts};
 (L.units||[]).forEach((u,i)=>{const c=u.cfg,lu=c&&c.lib&&D.byId[c.lib];
  if(!lu){add({i,k:"u",name:u.name,sz:u.size,pts:+u.pts||0,note:"coût saisi à la main"});(u.subs||[]).forEach((s,j)=>add({i,j,k:"l",name:(s.label||"Meneur")+" : "+s.name,pts:+((S.coll[s.ref]||{}).pts??s.pts)||0,note:"coût saisi à la main"}));return}
  const copy=bump(lu.id),cs=costOf(lu,c.size,copy);
  add({i,k:"u",name:u.name,sz:c.size,pts:cs.pts,note:cs.note||("barème "+cs.src+(cs.tier?" · exemplaire "+cs.tier:"")),lib:lu.id});
  const pc=pcOf(lu);((pc&&pc.wg)||[]).forEach(w=>{const q=(c.wg||{})[w.n]||0;if(q)add({i,k:"w",name:q+" × "+w.n,pts:q*w.pts,note:w.pts+" pts pièce"})});
  if(c.enh&&c.enh.id){const e=D.enh.find(x=>x.id===c.enh.id);add({i,k:"e",name:"Optimisation : "+(e?tName(e.n).t:c.enh.name),pts:e&&e.pts!=null?+e.pts:null,note:e&&e.pts!=null?"":"Coût à vérifier"})}
  (u.subs||[]).forEach((s,j)=>{const sc=s.cfg,sl=sc&&sc.lib&&D.byId[sc.lib];if(!sl){add({i,j,k:"l",name:(s.label||"Meneur")+" : "+s.name,pts:+((S.coll[s.ref]||{}).pts??s.pts)||0,note:"coût saisi à la main"});return}
   const cp=bump(sl.id),cc=costOf(sl,sc.size||1,cp);add({i,j,k:"l",name:"Meneur : "+s.name,pts:cc.pts,note:cc.note||("barème "+cc.src+(cc.tier?" · exemplaire "+cc.tier:"")),lib:sl.id});
   if(sc.enh&&sc.enh.id){const e=D.enh.find(x=>x.id===sc.enh.id);add({i,j,k:"e",name:"Optimisation : "+(e?tName(e.n).t:sc.enh.name),pts:e&&e.pts!=null?+e.pts:null,note:e&&e.pts!=null?"":"Coût à vérifier"})}})});
 return{lines,total,unk}}
/* écrit les coûts dans les champs classiques (points d'unité) pour que le reste de l'appli reste cohérent */
function applyPts(L){try{const R=calc(L);(L.units||[]).forEach((u,i)=>{if(!u.cfg)return;const mine=R.lines.filter(l=>l.i===i&&l.j==null&&l.pts!=null);u.pts=mine.reduce((a,l)=>a+l.pts,0);u.size=u.cfg.size;
  (u.subs||[]).forEach((s,j)=>{if(!s.cfg)return;const sl=R.lines.filter(l=>l.i===i&&l.j===j&&l.pts!=null);s.pts=sl.reduce((a,l)=>a+l.pts,0)})});return R}catch(_){return calc(L)}}
/* mise à jour du barème : recalcul, différences conservées, effectifs et équipements intacts */
function syncPts(L){const b=L.bld;if(!b)return;const R=calc(L),old=b.tot==null?R.total:b.tot,ver=ptsVer();
 if(b.pv&&b.pv!==ver){const ch=[];(L.units||[]).forEach((u,i)=>{if(!u.cfg)return;const nw=R.lines.filter(l=>l.i===i&&l.j==null&&l.pts!=null).reduce((a,l)=>a+l.pts,0);if(Math.abs(nw-(+u.pts||0))>0&&u.pts!=null)ch.push({n:u.name,o:+u.pts||0,p:nw})});
  if(ch.length||R.total!==old){b.log=b.log||[];b.log.unshift({at:Date.now(),v:ver,o:old,n:R.total,ch,seen:false});b.log=b.log.slice(0,10)}}
 b.pv=ver;const R2=applyPts(L);b.tot=R2.total}
/* ----- accès aux listes ----- */
const curL=()=>(S.lists||[]).find(l=>l.id===BLD.id)||null;
const imgOf=m=>(m&&S.imgs&&S.imgs[m.ref])||"";
const eqLines=(c,weapons)=>{const o=[];Object.keys(c.wq||{}).forEach(n=>{const q=c.wq[n];if(q>0){const w=(c.wn||{})[n];o.push(q+" × "+n+(w?" — "+w:""))}});return o};
const sizeTxt=(u,copy)=>{const s=sizesOf(u,copy||1);return s.length?s[0].n+" figurine"+(s[0].n>1?"s":""):""};
const costTxt=(u,copy)=>{const s=sizesOf(u,copy||1);if(!s.length)return"Coût à vérifier";const c=costOf(u,s[0].n,copy||1);return c.pts==null?"Coût à vérifier":(s.length>1?"dès ":"")+c.pts+" pts"};
/* ----- catalogue : une seule carte par unité (collection ET bibliothèque reliées par leurs liens validés) ----- */
function catEntries(){const out=[],by=new Map(),links=LB().links;
 Object.values(S.coll||{}).filter(m=>!(m.mrg&&S.coll[m.mrg])).forEach(m=>{const lk=links[m.ref],lu=lk&&D.byId[lk.id],key=lu?"u:"+lu.id:"c:"+m.ref;
  if(by.has(key)){by.get(key).colls.push(m);return}
  const e={key,name:m.name,lib:lu||null,coll:m,colls:[m],img:imgOf(m),role:lu?roleOf(lu):RG(/personnage/i.test(m.kw||"")?"Character":/véhicule/i.test(m.kw||"")?"Vehicle":/infanterie/i.test(m.kw||"")?"Infantry":""),fac:lu?lu._c:""};by.set(key,e);out.push(e)});
 D.units.forEach(u=>{const key="u:"+u.id;if(by.has(key))return;const t=tName(u.n),e={key,name:t.st==="ok"?t.t:u.n,lib:u,coll:null,colls:[],img:"",role:roleOf(u),fac:u._c};by.set(key,e);out.push(e)});return out}
function entryOf(key){return catEntries().find(e=>e.key===key)||null}
function catFilter(L){let A=catEntries();const q=nk(BLD.q||""),f=BLD.fac===""?(L&&L.bld&&L.bld.fac||""):BLD.fac==="*"?"":BLD.fac;
 A=A.filter(e=>(BLD.src==="all"||(BLD.src==="coll"?!!e.coll:!!e.lib))&&(!f||!e.lib||inFac(e.lib,f))&&(!BLD.role||e.role===BLD.role)&&(!q||q.split(" ").every(w=>nk(e.name+" "+(e.lib?e.lib.n:"")).includes(w))));
 return A.sort((a,b)=>String(a.name).localeCompare(b.name))}
function catHtml(L){const A=catFilter(L),roles=[...new Set(catEntries().map(e=>e.role))].sort(),lim=BLD.more?9999:48;
 const facs=facList(),curF=BLD.fac===""?(L&&L.bld&&L.bld.fac||""):BLD.fac==="*"?"":BLD.fac;
 const card=e=>{const sz=e.lib?sizeTxt(e.lib,1):(e.coll&&e.coll.nb?"":"");const ct=e.lib?costTxt(e.lib,1):(e.coll&&e.coll.pts?e.coll.pts+" pts (saisi)":"Coût à vérifier");
  return`<button type="button" class="bld-c" data-bld="pick" data-k="${E(e.key)}"><span class="bld-im">${e.img?`<img src="${e.img}" alt="">`:"🛡"}</span><b>${E(e.name)}</b><small>${E([sz,ct].filter(Boolean).join(" — "))}</small><small>${E(e.role)}</small><span class="bld-bd">${e.coll?'<i title="Ma collection">📦</i>':""}${e.lib?'<i title="Bibliothèque V11">📚</i>':""}</span></button>`};
 return`<div class="bib-top"><h2>Ajouter une unité</h2><button class="b" data-bld="x">✕</button></div>
 <input id="bldq" placeholder="Rechercher une unité…" value="${E(BLD.q)}" autocomplete="off">
 <div class="row" style="gap:6px;margin:6px 0">${[["all","Toutes les unités"],["coll","📦 Ma collection"],["lib","📚 Bibliothèque"]].map(([k,n])=>`<button class="b ${BLD.src===k?"p":""}" data-bld="src" data-v="${k}">${n}</button>`).join("")}</div>
 <div class="row" style="gap:6px"><select id="bldf" style="flex:1"><option value="*"${curF===""?" selected":""}>Toutes les factions</option>${facs.map(([k,n,c])=>`<option value="${E(k)}"${curF===k?" selected":""}>${E(n)}</option>`).join("")}</select><select id="bldr" style="flex:1"><option value="">Toutes les catégories</option>${roles.map(r=>`<option${BLD.role===r?" selected":""}>${E(r)}</option>`).join("")}</select></div>
 <p class="bib-meta">${A.length} unité${A.length>1?"s":""}</p><div class="bld-g">${A.slice(0,lim).map(card).join("")}</div>${A.length>lim?`<button class="b" data-bld="more" style="width:100%;margin-top:8px">Afficher les ${A.length-lim} autres</button>`:""}`}
/* ----- configuration d'une unité : effectif, armes, équipements payants, optimisation, meneur ----- */
function weaponsOf(e){if(e.coll&&(e.coll.weapons||[]).length)return e.coll.weapons.map(w=>Object.assign({},w));
 if(e.lib)return[...(e.lib.rw||[]).map(w=>Object.assign(wToApp(w,false),{name:frName(String(w.n).replace(/^➤\s*/,"")),en:w.n})),...(e.lib.mw||[]).map(w=>Object.assign(wToApp(w,true),{name:frName(String(w.n).replace(/^➤\s*/,"")),en:w.n}))];return[]}
function defaultWeapons(e,c){const W=weaponsOf(e),nz=t=>nk(String(t||"").replace(/^➤\s*/,"")),eq=[];
 String((e.coll&&e.coll.equip)||"").split(/,(?![^()]*\))/).forEach(x=>{x=x.replace(/\s*\(\s*\d+\s*\)\s*$/,"").trim();if(x)eq.push([nz(x),c.size])});
 if(!eq.length&&e.lib&&e.lib.wp&&e.lib.wp.loadout){const re=/\*\*(?:Every|Each)\s+([^*]*?)\s+(?:is|are)\s+equipped\s+with:\*\*\s*([^\n]+)/gi;let m;const t=String(e.lib.wp.loadout);while((m=re.exec(t))){const all=/^(model|figurine)s?$/i.test(m[1].trim())||!/nob|sergeant|boss|champion|leader|captain|lieutenant/i.test(m[1]);m[2].split(/;/).forEach(x=>{x=x.replace(/\.$/,"").replace(/^\d+\s+/,"").trim();if(x)eq.push([nz(x),all?c.size:1])})}}
 W.forEach(w=>{const a=nz(w.name),b=nz(w.en||"");const h=eq.find(([n])=>a===n||a.indexOf(n+" - ")===0||b===n||b.indexOf(n+" - ")===0||(n&&b&&(b.indexOf(n)===0)));if(h)c.wq[w.name]=Math.max(c.wq[w.name]||0,h[1])})}
function copyIdx(L,c){const e=entryOf(c.key);if(!e||!e.lib)return 1;let n=0;(L.units||[]).forEach((u,i)=>{if(c.idx!=null&&i>=c.idx)return;if(u.cfg&&u.cfg.lib===e.lib.id)n++;(u.subs||[]).forEach(s=>{if(s.cfg&&s.cfg.lib===e.lib.id)n++})});return n+1}
function openCfg(key,idx){const L=curL(),e=entryOf(key);if(!L||!e)return;let c;
 if(idx!=null){const u=L.units[idx];c=JSON.parse(JSON.stringify(u.cfg||{}));c.key=key;c.idx=idx;c.size=c.size||u.size||1;c.wq=c.wq||{};c.wn=c.wn||{};c.wg=c.wg||{};c.subs=JSON.parse(JSON.stringify(u.subs||[]));c.manual=c.manual||u.pts||0}
 else{c={key,idx:null,wq:{},wn:{},wg:{},enh:null,subs:[],manual:(e.coll&&e.coll.pts)||0};const sz=e.lib?sizesOf(e.lib,copyIdx(L,{key,idx:null})):[];c.size=sz.length?sz[0].n:1;defaultWeapons(e,c)}
 BLD.cfg=c;BLD.scr="cfg";render()}
function preview(L,c,e){const lib=e&&e.lib,tmp={name:e.name,size:c.size,pts:+c.manual||0,cfg:{lib:lib?lib.id:null,size:c.size,wg:c.wg,enh:c.enh},subs:c.subs||[]},L2={units:c.idx!=null?L.units.map((u,i)=>i===c.idx?tmp:u):[...L.units,tmp]},R=calc(L2),i=c.idx!=null?c.idx:L2.units.length-1;
 const mine=R.lines.filter(l=>l.i===i);return{lines:mine,total:mine.reduce((a,l)=>a+(l.pts||0),0),unk:mine.filter(l=>l.pts==null).length}}
const stepper=(a,k,v,mx)=>`<span class="bld-st"><button type="button" data-bld="${a}" data-k="${E(k)}" data-d="-1">−</button><b>${v}</b><button type="button" data-bld="${a}" data-k="${E(k)}" data-d="1" ${mx!=null&&v>=mx?"disabled":""}>+</button></span>`;
function compat(ul,ll){if(!ul||!ll)return{s:"?",t:"À vérifier"};const a=((ul.wp||{}).ledby||[]).map(nk),b=((ll.wp||{}).leads||[]).map(nk);
 if(a.includes(nk(ll.n))||b.includes(nk(ul.n)))return{s:"ok",t:"✓ Peut rejoindre cette unité"};if(!a.length&&!b.length)return{s:"?",t:"À vérifier"};return{s:"?",t:"À vérifier : non listé"}}
function cfgHtml(){const L=curL(),c=BLD.cfg,e=entryOf(c.key);if(!L||!e)return"";const lib=e.lib,copy=copyIdx(L,c),sizes=lib?sizesOf(lib,copy):[],pv=preview(L,c,e),pc=lib&&pcOf(lib),W=weaponsOf(e);
 let h=`<div class="bib-top"><h2>${E(e.name)}</h2><button class="b" data-bld="x">✕</button></div><div class="row" style="gap:10px;align-items:center"><span class="bld-im" style="width:64px;height:64px">${e.img?`<img src="${e.img}" alt="">`:"🛡"}</span><span class="bib-meta">${e.coll?"📦 Ma collection ":""}${e.lib?"📚 Bibliothèque":""}<br>${E(e.role)}${lib?" · "+E(facLbl(lib)):""}</span></div>`;
 h+=`<h4>Effectif</h4>`;
 if(sizes.length){h+=`<div class="row" style="gap:6px;flex-wrap:wrap">${sizes.map(s=>`<button type="button" class="b ${c.size===s.n?"p":""}" data-bld="size" data-v="${s.n}">${s.n} figurine${s.n>1?"s":""} · ${s.pts==null?"à vérifier":s.pts+" pts"}</button>`).join("")}</div><p class="bib-meta">Tailles et coûts lus dans le barème${pc?" Wahapedia 11e (exemplaire n°"+copy+" de cette unité)":" de la bibliothèque"}.</p>`}
 else h+=`<div class="row" style="gap:8px;align-items:center">${stepper("sz","sz",c.size,40)}<label style="flex:1">Coût (saisi à la main)<input id="bldman" inputmode="numeric" value="${E(c.manual||"")}"></label></div><p class="bib-meta">Aucun barème pour cette unité : le coût reste « à vérifier » tant que tu ne l'as pas saisi.</p>`;
 h+=`<h4>Armes <span class="bib-meta">(quantité par arme)</span></h4>`;
 if(!W.length)h+=`<p class="bib-meta">Aucune arme connue pour cette unité.</p>`;
 else h+=`<p class="bib-meta">Aucune ligne n'est répétée : un compteur par arme. Le porteur est facultatif (ex. Sergent).</p>`+W.map(w=>{const q=c.wq[w.name]||0;return`<div class="bld-w ${q?"on":""}"><div class="row" style="justify-content:space-between;gap:6px"><b>${E(w.name)}</b>${stepper("wq",w.name,q,c.size)}</div><div class="bib-meta">${E(w.range||"")}${/^\d/.test(w.range||"")?'"':""} · A ${E(w.a)} · ${E(w.hit)} · F ${E(w.f)} · PA ${E(w.pa)} · D ${E(w.d)}${w.caps?" · "+E(w.caps):""}</div>${q?`<input class="bldnote" data-bldn="${E(w.name)}" placeholder="Porteur (facultatif)" value="${E((c.wn||{})[w.name]||"")}">`:""}</div>`}).join("");
 if(pc&&pc.wg&&pc.wg.length)h+=`<h4>Équipements payants</h4>${pc.wg.map(w=>`<div class="row" style="justify-content:space-between;gap:6px;margin:4px 0"><span><b>${E(w.n)}</b><div class="bib-meta">${w.pts} pts pièce</div></span>${stepper("wg",w.n,(c.wg||{})[w.n]||0,null)}</div>`).join("")}<p class="bib-meta">Les autres armes et équipements sont inclus dans le coût de l'unité : aucun point en plus.</p>`;
 const eq=lib&&lib.wp&&((lib.wp.opt||[]).length||lib.wp.loadout);if(eq)h+=`<details class="bib-nw"><summary><b>Options et restrictions d'équipement</b> <span class="bib-meta">À vérifier à la main</span></summary>${lib.wp.loadout?`<p>${frItem(lib.wp.loadout,"équipement de base").html}</p>`:""}<ul style="padding-left:18px">${(lib.wp.opt||[]).map(o=>`<li>${frItem(o,"option d'équipement").html}</li>`).join("")}</ul></details>`;
 if(lib&&isChar(lib)){const det=L.bld&&L.bld.det,list=det?D.enh.filter(x=>nk(x.det||"")===nk(det.name)):[],used=new Set(L.units.filter((u,i)=>i!==c.idx&&u.cfg&&u.cfg.enh).map(u=>u.cfg.enh.id));
  h+=`<h4>Optimisation</h4>`+(!det?`<p class="bib-meta">Choisis d'abord un détachement pour voir ses optimisations.</p>`:!list.length?`<p class="bib-meta">Aucune optimisation connue pour ce détachement.</p>`:`<button type="button" class="b ${!c.enh?"p":""}" data-bld="enh" data-v="">Aucune</button>`+list.map(x=>`<div class="bld-w ${c.enh&&c.enh.id===x.id?"on":""}"><div class="row" style="justify-content:space-between;gap:6px"><b>${E(tName(x.n).t)}</b><span>${x.pts==null?"à vérifier":"+"+x.pts+" pts"}</span></div><div class="bib-meta">${md2(trDesc(x.d).st==="ok"?trDesc(x.d).t:(trDesc(x.d).prop||x.d))}</div>${used.has(x.id)?`<span class="bib-meta">Déjà prise par une autre unité</span>`:`<button type="button" class="b ${c.enh&&c.enh.id===x.id?"p":""}" data-bld="enh" data-v="${E(x.id)}">${c.enh&&c.enh.id===x.id?"✓ Choisie":"Choisir"}</button>`}</div>`).join(""))}
 if(!lib||!isChar(lib)){h+=`<h4>Meneur</h4>`+((c.subs||[]).length?c.subs.map((s,j)=>{const sl=s.cfg&&s.cfg.lib&&D.byId[s.cfg.lib],cp=sl?costOf(sl,1,2):null,cm=compat(lib,sl);return`<div class="bld-w on"><div class="row" style="gap:8px;align-items:center"><span class="bld-im" style="width:44px;height:44px">${imgOf(S.coll[s.ref])?`<img src="${imgOf(S.coll[s.ref])}" alt="">`:"🛡"}</span><span style="flex:1"><b>${E(s.name)}</b><div class="bib-meta">${sl?(costOf(sl,1,1).pts==null?"Coût à vérifier":costOf(sl,1,1).pts+" pts"):"coût saisi"} · ${E(cm.t)}</div></span></div><div class="row" style="gap:6px;margin-top:6px"><button type="button" class="b" data-bld="ldr">Changer</button><button type="button" class="b x" data-bld="ldrx">Retirer</button></div></div>`}).join(""):`<button type="button" class="b" data-bld="ldr">➕ Ajouter un meneur</button>`)}
 h+=`<div class="bld-bar"><div><b>${pv.unk?"≥ ":""}${fmt(pv.total)} pts</b><div class="bib-meta">${pv.unk?pv.unk+" coût à vérifier":"unité + équipements"}</div></div><button class="b p" data-bld="ok" style="flex:1">${c.idx!=null?"Enregistrer":"Ajouter à l'armée"}</button></div>`;return h}
function ensureSheet(e){return e.coll||createFromLib(e.lib)}
function commitCfg(){const L=curL(),c=BLD.cfg,e=c&&entryOf(c.key);if(!L||!e)return;const m=ensureSheet(e),W=weaponsOf(e).filter(w=>(c.wq[w.name]||0)>0).map(w=>{const x=Object.assign({},w);delete x.en;return x});
 const old=c.idx!=null?L.units[c.idx]:null,n=old||{ref:m.ref,size:c.size,pts:0,subs:[],man:1};
 if(!old){SH.forEach(f=>{n[f]=clone(m[f])})}
 n.weapons=W;n.size=c.size;n.equip=eqLines(c).join(" ; ")||n.equip||"";n.subs=c.subs||[];
 n.cfg={lib:e.lib?e.lib.id:null,size:c.size,wq:c.wq,wn:c.wn,wg:c.wg,enh:c.enh||null,manual:+c.manual||0,eq:eqLines(c)};if(!e.lib)n.pts=+c.manual||0;
 if(!old)L.units.push(n);syncPts(L);applyPts(L);save();BLD.cfg=null;BLD.scr="edit";try{draw()}catch(_){}render()}
/* ----- meneurs ----- */
function ldrHtml(){const L=curL(),c=BLD.cfg,e=entryOf(c.key),ul=e&&e.lib,q=nk(BLD.lq||"");
 let A=catEntries().filter(x=>(x.lib?isChar(x.lib):/Personnage|Héros/.test(x.role))&&(!q||nk(x.name+" "+(x.lib?x.lib.n:"")).includes(q)));
 const g=L.bld&&L.bld.fac;A=A.filter(x=>!x.lib||!g||inFac(x.lib,g)||BLD.lall);
 A.sort((a,b)=>{const ca=compat(ul,a.lib).s==="ok",cb=compat(ul,b.lib).s==="ok";return(cb-ca)||String(a.name).localeCompare(b.name)});
 return`<div class="bib-top"><h2>Ajouter un meneur</h2><button class="b" data-bld="back">← Retour</button></div><p class="bib-meta">Pour : <b>${E(e.name)}</b>. Le coût du meneur s'ajoute à part. « À vérifier » = association non confirmée par les données : rien n'est interdit.</p>
 <input id="bldlq" placeholder="Rechercher un personnage…" value="${E(BLD.lq)}" autocomplete="off"><label class="bib-ck" style="margin:6px 0"><input type="checkbox" data-bldck="lall" ${BLD.lall?"checked":""}><span>Afficher les personnages de toutes les factions</span></label>
 <div class="bld-g">${A.slice(0,60).map(x=>{const cm=compat(ul,x.lib),ct=x.lib?costTxt(x.lib,1):(x.coll&&x.coll.pts?x.coll.pts+" pts (saisi)":"Coût à vérifier");return`<button type="button" class="bld-c" data-bld="ldrpick" data-k="${E(x.key)}"><span class="bld-im">${x.img?`<img src="${x.img}" alt="">`:"🛡"}</span><b>${E(x.name)}</b><small>${E(ct)}</small><small>${E(cm.t)}</small><span class="bld-bd">${x.coll?"<i>📦</i>":""}${x.lib?"<i>📚</i>":""}</span></button>`}).join("")}</div>`}
function ldrPick(key){const c=BLD.cfg,le=entryOf(key);if(!le)return;const m=ensureSheet(le),s={label:"Meneur",ref:m.ref};SH.forEach(f=>{s[f]=clone(m[f])});s.weapons=clone(m.weapons||[]);s.cfg={lib:le.lib?le.lib.id:null,size:1,enh:null};
 s.pts=le.lib?(costOf(le.lib,1,1).pts||0):(+m.pts||0);c.subs=[s];BLD.scr="cfg";render()}
/* ----- détachements ----- */
function detList(L){const g=L.bld&&L.bld.fac;const grp=String(g||"").indexOf("sm:")===0?"space-marines":g;return D.dets.filter(d=>!grp||d._c===grp).sort((a,b)=>a.n.localeCompare(b.n))}
function detHtml(){const L=curL(),cur=L.bld&&L.bld.det,q=nk(BLD.dq||"");let A=detList(L).filter(d=>!q||nk(d.n).includes(q));
 const sub=d=>{const ab=d.ab||{},t=trDesc(ab.description||""),tx=t.st==="ok"?t.t:(t.prop||ab.description||""),rs=/Restrictions?:\s*([\s\S]*)$/i.exec(stripMd(tx)),st=D.str.filter(x=>nk(x.det||"")===nk(d.n)),en=D.enh.filter(x=>nk(x.det||"")===nk(d.n));
  return`<details class="bib-nw"><summary><b>${E(tName(d.n).t)}</b> ${cur&&cur.id===d.id?'<span class="bib-st">choisi</span>':""} <span class="bib-meta">${st.length} stratagème${st.length>1?"s":""} · ${en.length} optimisation${en.length>1?"s":""}${d.pts!=null?" · "+d.pts+" pts":""}</span><div class="bib-meta">🎯 ${(d.dp||[]).length?E((d.dp||[]).map(p=>{try{return misTag(DISP[p])}catch(_){return p}}).join(" · ")):"Force Disposition inconnue"}</div></summary>
  ${ab.name?`<h4>${E(tAB(ab.name).t)}</h4><div>${md2(tx)}</div>`:""}${rs?`<h4>Restrictions connues</h4><p>${E(rs[1].trim())}</p>`:""}
  ${st.length?`<h4>Stratagèmes</h4><ul style="padding-left:18px;margin:4px 0">${st.map(x=>`<li><b>${E(tName(x.n).t)}</b> <span class="bib-meta">${x.cp!=null?x.cp+" PC":""}</span></li>`).join("")}</ul>`:""}
  ${en.length?`<h4>Optimisations</h4><ul style="padding-left:18px;margin:4px 0">${en.map(x=>`<li><b>${E(tName(x.n).t)}</b> <span class="bib-meta">${x.pts==null?"coût à vérifier":x.pts+" pts"}</span></li>`).join("")}</ul>`:""}
  <button type="button" class="b p" data-bld="detpick" data-id="${E(d.id)}" style="width:100%;margin-top:6px">Choisir ce détachement</button></details>`};
 return`<div class="bib-top"><h2>Détachement</h2><button class="b" data-bld="x">✕</button></div><input id="bldd" placeholder="Rechercher…" value="${E(BLD.dq)}" autocomplete="off">${cur?`<p class="bib-meta">Actuel : <b>${E(cur.name)}</b> <button class="b x" data-bld="detx">Retirer</button></p>`:""}${A.length?A.map(sub).join(""):'<p class="bib-meta">Aucun détachement dans la bibliothèque pour cette faction.</p>'}`}
function detPick(id){const L=curL(),d=D.dets.find(x=>x.id===id);if(!L||!d)return;L.bld=L.bld||{};const keep=[];
 L.dets=(L.dets||[]).filter(x=>!x.bld);L.strats=(L.strats||[]).filter(x=>!x.bld);
 const ab=d.ab||{},t=trDesc(ab.description||""),tx=stripMd(t.st==="ok"?t.t:(t.prop||ab.description||""));
 L.bld.det={id:d.id,name:tName(d.n).t,en:d.n};L.dets.push({name:tName(d.n).t,cost:d.pts!=null?String(d.pts):"",rule:(ab.name?tAB(ab.name).t+" : ":"")+tx,bld:1});
 D.str.filter(x=>nk(x.det||"")===nk(d.n)).forEach(x=>{const parts=[["when","Quand"],["tg","Cible"],["fx","Effet"],["rs","Restrictions"]].map(([k,l])=>x[k]?l+" : "+stripMd((trDesc(x[k]).st==="ok"?trDesc(x[k]).t:(trDesc(x[k]).prop||x[k]))):"").filter(Boolean).join("\n");L.strats.push({det:tName(d.n).t,name:tName(x.n).t,cp:x.cp,body:parts,bld:1})});
 // les optimisations d'un autre détachement ne sont plus valables
 let lost=0;L.units.forEach(u=>{if(u.cfg&&u.cfg.enh){const e=D.enh.find(z=>z.id===u.cfg.enh.id);if(!e||nk(e.det||"")!==nk(d.n)){u.cfg.enh=null;lost++}}});
 syncPts(L);applyPts(L);save();BLD.scr="edit";try{draw()}catch(_){}try{toast("Détachement choisi"+(lost?" · "+lost+" optimisation(s) retirée(s) (autre détachement)":""))}catch(_){}render()}
/* ----- vérifications simples et fiables ----- */
function checks(L){const R=calc(L),out=[],b=L.bld||{};
 if(b.limit&&R.total>b.limit)out.push({lv:"bad",t:"Limite dépassée : "+fmt(R.total)+" / "+fmt(b.limit)+" pts (+"+fmt(R.total-b.limit)+")"});else if(b.limit)out.push({lv:"ok",t:"Dans la limite : "+fmt(R.total)+" / "+fmt(b.limit)+" pts"});
 if(R.unk)out.push({lv:"warn",t:R.unk+" coût"+(R.unk>1?"s":"")+" à vérifier : le total n'est pas exact"});
 if(!b.det)out.push({lv:"info",t:"Aucun détachement choisi"});
 (L.units||[]).forEach((u,i)=>{const c=u.cfg,lu=c&&c.lib&&D.byId[c.lib];if(!lu)return;const sz=sizesOf(lu,1);if(sz.length&&!sz.some(s=>c.size>=s.n&&c.size<=s.m))out.push({lv:"warn",t:u.name+" : effectif "+c.size+" hors barème (à vérifier)"});
  (u.subs||[]).forEach(s=>{const sl=s.cfg&&s.cfg.lib&&D.byId[s.cfg.lib],cm=compat(lu,sl);if(cm.s!=="ok")out.push({lv:"info",t:u.name+" + "+s.name+" : association à vérifier"})})});
 const seen={};(L.units||[]).forEach(u=>{if(u.cfg&&u.cfg.enh){seen[u.cfg.enh.id]=(seen[u.cfg.enh.id]||0)+1}});Object.keys(seen).forEach(k=>{if(seen[k]>1)out.push({lv:"bad",t:"Optimisation prise "+seen[k]+" fois"})});
 return out}
/* ----- récapitulatif compact ----- */
function unitText(u,i,R){const c=u.cfg||{},ln=R.lines.filter(l=>l.i===i&&l.j==null),base=ln.find(l=>l.k==="u"),tot=ln.filter(l=>l.pts!=null).reduce((a,l)=>a+l.pts,0),unk=ln.some(l=>l.pts==null);
 const eq=(c.eq&&c.eq.length?c.eq:eqLines(c)),out=[`${u.name} — ${c.size||u.size||"?"} figurine${(c.size||u.size)>1?"s":""} — ${unk?"coût à vérifier":tot+" pts"}`];
 eq.forEach(x=>out.push("   "+x));ln.filter(l=>l.k==="w"||l.k==="e").forEach(l=>out.push("   "+l.name+(l.pts!=null?" ("+l.pts+" pts)":" (à vérifier)")));
 (u.subs||[]).forEach((s,j)=>{const sl=R.lines.filter(l=>l.i===i&&l.j===j),st=sl.filter(l=>l.pts!=null).reduce((a,l)=>a+l.pts,0);out.push("   Meneur : "+s.name+" — "+(sl.some(l=>l.pts==null)?"coût à vérifier":st+" pts"))});return out}
function recapText(L){const R=calc(L),b=L.bld||{},m=ptsMeta(),o=[L.name,[b.facN,b.det&&b.det.name,b.fmt].filter(Boolean).join(" · "),"Points : "+(R.unk?"≥ ":"")+fmt(R.total)+(b.limit?" / "+fmt(b.limit):"")+" pts"+(R.unk?" ("+R.unk+" coût à vérifier)":""),""];
 (L.units||[]).forEach((u,i)=>{unitText(u,i,R).forEach(x=>o.push(x));o.push("")});o.push("Barème : "+m.src+(m.pub?" · publié "+String(m.pub).slice(0,10):"")+(m.sync?" · synchronisé "+m.sync:""));return o.join("\n")}
function recapHtml(L,forPrint){const R=calc(L),b=L.bld||{},m=ptsMeta(),ck=checks(L),old=m.chk&&Date.now()-m.chk>7*864e5;
 const row=(u,i)=>{const t=unitText(u,i,R);return`<div class="bld-rc"><b>${E(t[0])}</b>${t.slice(1).map(x=>`<div class="bib-meta">${E(x.trim())}</div>`).join("")}</div>`};
 return`<div class="bib-top"><h2>${E(L.name)}</h2>${forPrint?"":`<button class="b" data-bld="back">← Retour</button>`}</div><p class="bib-meta">${E([b.facN,b.det&&b.det.name,b.fmt].filter(Boolean).join(" · "))}</p>
 <div class="bld-tot"><b>${R.unk?"≥ ":""}${fmt(R.total)}${b.limit?" / "+fmt(b.limit):""} pts</b>${R.unk?`<span class="bib-meta"> · ${R.unk} coût à vérifier</span>`:""}</div>
 ${(L.units||[]).map(row).join("")||'<p class="bib-meta">Aucune unité.</p>'}
 <h4>Détail des points</h4><table style="width:100%;font-size:13px">${R.lines.map(l=>`<tr><td>${E(l.name)}${l.sz?" ("+l.sz+")":""}<div class="bib-meta">${E(l.note||"")}</div></td><td style="text-align:right">${l.pts==null?"à vérifier":l.pts+" pts"}</td></tr>`).join("")}<tr><td><b>Total</b></td><td style="text-align:right"><b>${R.unk?"≥ ":""}${R.total} pts</b></td></tr></table>
 <h4>Vérifications</h4>${ck.map(x=>`<div class="bld-ck ${x.lv}">${x.lv==="ok"?"✓":x.lv==="bad"?"⛔":x.lv==="warn"?"⚠":"ℹ"} ${E(x.t)}</div>`).join("")}
 <p class="bib-meta">Barème : ${E(m.src)}${m.pub?" · publié le "+E(String(m.pub).slice(0,10)):""}${m.ver?" · version "+E(m.ver):""}${m.sync?" · synchronisé le "+E(m.sync):""}.${old||!m.chk?" ⚠ Aucune vérification récente de mise à jour : les points peuvent ne plus être à jour.":" Dernière vérification : "+E(fmtD(m.chk))+"."}</p>
 ${forPrint?"":`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px"><button class="b p" data-bld="print">📄 PDF</button><button class="b" data-bld="json">💾 Exporter</button><button class="b" data-bld="share">📤 Partager</button><button class="b" data-bld="copy">📋 Copier le texte</button></div>`}`}
/* ----- export / import ----- */
function exportJson(L){const sheets={};(L.units||[]).forEach(u=>{[u].concat(u.subs||[]).forEach(x=>{if(x.ref&&S.coll[x.ref])sheets[x.ref]=clone(S.coll[x.ref])})});return JSON.stringify({kind:"hammer-armee",v:1,at:Date.now(),pts:ptsMeta(),list:clone(L),sheets})}
function importJson(txt){let o;try{o=JSON.parse(txt)}catch(_){throw new Error("Fichier illisible")}if(!o||o.kind!=="hammer-armee"||!o.list)throw new Error("Ce n'est pas une armée HAMMER");
 const L=o.list;L.id="l"+Date.now();L.name=(L.name||"Armée")+(S.lists.some(x=>x.name===L.name)?" (importée)":"");Object.keys(o.sheets||{}).forEach(r=>{if(!S.coll[r])S.coll[r]=o.sheets[r]});S.lists.push(L);save();return L}
function dl2(name,text,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:type||"application/json"}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function printList(L){let p=document.getElementById("bldprint");if(!p){p=document.createElement("div");p.id="bldprint";document.body.appendChild(p)}p.innerHTML=recapHtml(L,true);p.style.display="block";setTimeout(()=>{try{window.print()}catch(_){}setTimeout(()=>{p.style.display="none"},400)},50)}
/* ----- vues principales ----- */
function homeHtml(){const lists=S.lists||[];
 return`<div class="card"><b>🛠 Constructeur d'armée</b><p class="bib-meta">Crée une armée en choisissant visuellement tes unités (collection et bibliothèque V11). Les points sont calculés avec le barème de la bibliothèque.</p>
 <label>Nom de l'armée<input id="bldn" placeholder="ex. Armée Orks 2000"></label>
 <label>Faction<select id="bldfac"><option value="">— Choisir —</option>${facList().map(([k,n])=>`<option value="${E(k)}">${E(n)}</option>`).join("")}</select></label>
 <label>Format de partie (libre)<input id="bldfmt" placeholder="ex. Strike Force" list="bldfl"><datalist id="bldfl"><option value="Combat Patrol"><option value="Incursion"><option value="Strike Force"><option value="Onslaught"></datalist></label>
 <label>Limite de points<input id="bldlim" inputmode="numeric" value="2000"></label><div class="row" style="gap:6px;margin:6px 0">${[1000,2000,3000].map(n=>`<button type="button" class="b" data-bld="lim" data-v="${n}">${n}</button>`).join("")}</div>
 <button class="b p" data-bld="create" style="width:100%">Créer l'armée</button></div>
 <div class="card"><b>Mes armées</b>${lists.length?lists.map(l=>{let p=0;try{p=l.bld?calc(l).total:lpts(l)}catch(_){}return`<div class="row" style="justify-content:space-between;gap:6px;margin:6px 0"><span><b>${E(l.name)}</b><div class="bib-meta">${(l.units||[]).length} unité(s) · ${p} pts${l.bld&&l.bld.limit?" / "+l.bld.limit:""}</div></span><button class="b" data-bld="open" data-id="${E(l.id)}">Ouvrir</button></div>`}).join(""):'<p class="bib-meta">Aucune armée.</p>'}
 <label class="b" style="cursor:pointer;display:inline-block;margin-top:6px">📂 Importer une armée<input type="file" id="bldimp" accept=".json,application/json" hidden></label></div>`}
function editHtml(L){syncPts(L);const R=calc(L),b=L.bld||(L.bld={}),pct=b.limit?Math.min(100,R.total/b.limit*100):0,over=b.limit&&R.total>b.limit,m=ptsMeta();
 const un=(L.units||[]).map((u,i)=>{const t=unitText(u,i,R),e=entryOf(u.cfg&&u.cfg.lib?"u:"+u.cfg.lib:"c:"+u.ref)||entryOf("c:"+u.ref);return`<div class="card bld-u"><div class="row" style="gap:8px;align-items:center"><span class="bld-im" style="width:48px;height:48px">${imgOf(S.coll[u.ref])?`<img src="${imgOf(S.coll[u.ref])}" alt="">`:"🛡"}</span><span style="flex:1;min-width:0"><b>${E(t[0])}</b></span></div>${t.slice(1).map(x=>`<div class="bib-meta">${E(x.trim())}</div>`).join("")}<div class="row" style="gap:6px;margin-top:6px"><button class="b" data-bld="edit" data-i="${i}">Modifier</button><button class="b x" data-bld="del" data-i="${i}">Retirer</button></div></div>`}).join("");
 const lg=(b.log||[]).find(x=>!x.seen);
 return`<div class="card"><div class="row" style="justify-content:space-between;gap:6px"><input id="bldname" value="${E(L.name)}" style="font-weight:700;flex:1"><button class="b" data-bld="home">← Armées</button></div>
 <div class="bld-pts ${over?"over":""}"><b>${R.unk?"≥ ":""}${fmt(R.total)} / ${b.limit?fmt(b.limit):"—"} points</b><div class="bld-bar2"><i style="width:${pct}%"></i></div>${R.unk?`<span class="bib-meta">${R.unk} coût à vérifier : total non exact</span>`:""}${over?`<span class="bib-meta" style="color:#e0563f">Limite dépassée de ${fmt(R.total-b.limit)} pts</span>`:""}</div>
 <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px"><label style="flex:1;min-width:120px">Faction<select id="bldfac2"><option value="">—</option>${facList().map(([k,n])=>`<option value="${E(k)}"${b.fac===k?" selected":""}>${E(n)}</option>`).join("")}</select></label><label style="width:110px">Limite<input id="bldlim2" inputmode="numeric" value="${E(b.limit||"")}"></label><label style="flex:1;min-width:120px">Format<input id="bldfmt2" value="${E(b.fmt||"")}"></label></div>
 <div class="row" style="gap:6px;margin-top:6px"><button class="b" data-bld="det">${b.det?"⚔ "+E(b.det.name):"⚔ Choisir un détachement"}</button></div></div>${missionBlock(L)}${ruleBlock(L)}
 ${lg?`<div class="card" style="border-color:var(--ac)"><b>Mise à jour des points</b><p class="bib-meta">Ancien total : ${fmt(lg.o)} pts · Nouveau total : ${fmt(lg.n)} pts · Différence : ${lg.n-lg.o>=0?"+":""}${lg.n-lg.o} pts</p>${lg.ch.map(x=>`<div class="bib-meta">${E(x.n)} : ${x.o} → ${x.p} pts</div>`).join("")}<p class="bib-meta">Les effectifs et équipements n'ont pas changé.</p><button class="b" data-bld="logok">OK</button></div>`:""}
 <div class="row" style="gap:6px;margin:8px 0"><button class="b p" data-bld="add" style="flex:2">➕ Ajouter une unité</button><button class="b" data-bld="recap" style="flex:1">📋 Récapitulatif</button></div>
 ${un||'<div class="card"><p class="bib-meta">Aucune unité. Touche « Ajouter une unité » pour ouvrir le catalogue.</p></div>'}
 <div class="row" style="gap:6px;flex-wrap:wrap;margin:8px 0"><button class="b" data-bld="dup">⧉ Dupliquer</button><button class="b" data-bld="json">💾 Exporter</button><button class="b" data-bld="classic">Ouvrir comme liste classique</button></div>
 <p class="bib-meta">Barème : ${E(m.src)}${m.pub?" · publié le "+E(String(m.pub).slice(0,10)):""} · synchronisé le ${E(m.sync||"—")}${!m.chk||Date.now()-m.chk>7*864e5?" · ⚠ aucune vérification récente":""}</p>`}
function sheetHtml(L){if(BLD.scr==="cat")return catHtml(L);if(BLD.scr==="cfg")return cfgHtml();if(BLD.scr==="ldr")return ldrHtml();if(BLD.scr==="det")return detHtml();if(BLD.scr==="recap")return recapHtml(L);return""}
function render(){css();const L=curL(),ov=["cat","cfg","ldr","det","recap"].includes(BLD.scr)&&L,b=box("bldm");
 if(!ov){b.innerHTML="";return}const old=b.querySelector(".bib-pn"),st=old?old.scrollTop:0,keep=document.activeElement&&document.activeElement.id;
 b.innerHTML=`<div class="bib-ov" data-bld="bg"><div class="bib-pn">${sheetHtml(L)}</div></div>`;const pn=b.querySelector(".bib-pn");if(pn)pn.scrollTop=st;if(keep){const f=document.getElementById(keep);if(f&&f.setSelectionRange){f.focus();try{f.setSelectionRange(f.value.length,f.value.length)}catch(_){}}}}
/* ----- règle de faction + mission principale (Force Disposition) ----- */
const DISP={"Take and Hold":"take-and-hold","Purge the Foe":"purge-the-foe","Disruption":"disruption","Reconnaissance":"reconnaissance","Priority Assets":"priority-assets"};
const ORD5=["take-and-hold","purge-the-foe","disruption","reconnaissance","priority-assets"];
const grpOfFac=f=>String(f||"").indexOf("sm:")===0?"space-marines":String(f||"");
function listGroup(L){let g=grpOfFac(L.bld&&L.bld.fac);if(g)return g;const c={};(L.units||[]).forEach(u=>{const lu=u.cfg&&u.cfg.lib&&D.byId[u.cfg.lib],lk=!lu&&LB().links[u.ref],x=lu||(lk&&D.byId[lk.id]);if(x)c[x._c]=(c[x._c]||0)+1});return Object.keys(c).sort((a,b)=>c[b]-c[a])[0]||""}
function frItems(L){const g=listGroup(L),src=g&&D.frules&&D.frules[g];
 if(src&&src.length){const it=src.map(r=>{const t=trDesc(r.d),tx=stripMd(t.st==="ok"?t.t:(t.prop||r.d));return{n:tAB(r.n).t,d:tx}});
  if(JSON.stringify((L.frule||{}).items)!==JSON.stringify(it)){L.frule={g,at:Date.now(),items:it};try{save()}catch(_){}}return it}
 return(L.frule&&L.frule.items)||[]}
function ruleBlock(L){const it=frItems(L);if(!it.length)return"";const fl=facList().find(x=>x[0]===listGroup(L));
 return`<details class="card bld-fr" id="bldfr" ${BLD.fro?"open":""}><summary><b>📜 Règle de faction</b> <small class="bib-meta">${E(fl?fl[1]:"")}</small></summary>${it.map(x=>`<h4 style="margin:8px 0 2px">${E(x.n)}</h4><div style="font-size:14px">${md2(x.d)}</div>`).join("")}</details>`}
function dispsOf(L){const names=[];if(L.bld&&L.bld.det)names.push(L.bld.det.en||L.bld.det.name);(L.dets||[]).forEach(d=>names.push(d.name));const out=[],seen=new Set();
 names.forEach(n=>{const d=D.dets.find(x=>nk(x.n)===nk(n)||nk(tName(x.n).t)===nk(n));if(d)(d.dp||[]).forEach(p=>{const id=DISP[p];if(id&&!seen.has(id)){seen.add(id);out.push({id,en:p,det:d.n})}})});return out}
const msdOf=(me,op)=>{const M=window.__msd||[],l=M.filter(m=>m.cat===me);return l[ORD5.indexOf(op)]||null};
function missionBlock(L){if(!L.bld||!L.bld.det&&!(L.dets||[]).length)return"";const ds=dispsOf(L),opts=ds.length?ds:ORD5.map(id=>({id,en:id})),cur=L.mission,okc=opts.some(o=>o.id===cur);
 if(opts.length===1&&L.mission!==opts[0].id){L.mission=opts[0].id;L.game=L.game||"w40k";try{save()}catch(_){}}
 const nm=id=>{try{return misTag(id)}catch(_){return id}};
 const tbl=L.mission?`<table style="width:100%;font-size:12.5px;margin-top:6px">${ORD5.map(op=>{const m=msdOf(L.mission,op);return`<tr><td class="bib-meta">si l'adversaire a ${E(nm(op))}</td><td><b>${E(m?m.nm:"—")}</b></td></tr>`}).join("")}</table>`:"";
 return`<div class="card" id="bldms"><b>🎯 Mission principale</b><p class="bib-meta">${ds.length?(opts.length>1?"Ton détachement donne le choix entre "+opts.length+" Forces Dispositions. Choisis celle de ton armée :":"Force Disposition imposée par ton détachement :"):"Force Disposition inconnue pour ce détachement : choisis librement (à vérifier)."}</p>
 <div class="row" style="gap:6px;flex-wrap:wrap">${opts.map(o=>`<button type="button" class="b ${L.mission===o.id?"p":""}" data-bld="disp" data-v="${o.id}">${E(nm(o.id))}</button>`).join("")}</div>${tbl}${L.mission&&!okc&&ds.length?`<p class="bib-meta" style="color:#e0a030">⚠ Cette disposition n'est pas proposée par le détachement choisi (à vérifier).</p>`:""}
 <p class="bib-meta">La mission principale exacte dépend de la Force Disposition de l'adversaire. Le mode jeu l'utilise automatiquement.</p></div>`}
/* petit texte « Règle de faction » sous les en-têtes : liste d'unités et mode jeu */
{const old=window.tbPost;window.tbPost=()=>{try{postRule()}catch(_){}if(old)old()}}
function postRule(){const m=document.getElementById("m"),o=document.getElementById("bldfr");const t=typeof tab!=="undefined"?tab:"";
 if(!m||!["units","play","pst"].includes(t)){if(o&&o.dataset.auto)o.remove();return}
 const L=(S.lists||[]).find(l=>l.id===S.cur);if(!L){if(o&&o.dataset.auto)o.remove();return}if(o&&o.dataset.auto==="1"&&o.dataset.l===L.id+"|"+t)return;
 const h=ruleBlock(L);if(o&&o.dataset.auto)o.remove();if(!h)return;m.insertAdjacentHTML("afterbegin",h.replace('id="bldfr"','id="bldfr" data-auto="1" data-l="'+L.id+"|"+t+'"'))}
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.id==="bldfr")BLD.fro=d.open},true);
/* ----- événements ----- */
window.XV=window.XV||{};XV.bld=function(){try{if(!D.ready&&!D.err)init();const L=curL();return L&&BLD.scr!=="home"?editHtml(L):homeHtml()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
const rd=()=>{try{draw()}catch(_){}render()};
const clampQ=(c)=>{Object.keys(c.wq||{}).forEach(k=>{if(c.wq[k]>c.size)c.wq[k]=c.size})};
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-bld]");if(!b)return;const a=b.dataset.bld,L=curL(),c=BLD.cfg;
 if(a==="bg"){if(e.target===b){BLD.scr="edit";BLD.cfg=null;render()}return}
 e.preventDefault();e.stopPropagation();
 if(a==="lim"){const i=document.getElementById("bldlim");if(i)i.value=b.dataset.v;return}
 if(a==="create"){const g=id=>(document.getElementById(id)||{}).value||"",fac=g("bldfac");if(!fac){try{toast("Choisis d'abord une faction")}catch(_){}return}
  await init();const n=g("bldn").trim()||"Armée "+((S.lists||[]).length+1),fl=facList().find(x=>x[0]===fac),l={id:"l"+Date.now(),name:n,units:[],dets:[],strats:[],total:"",bld:{fac,facN:fl?fl[1]:fac,fmt:g("bldfmt").trim(),limit:parseInt(g("bldlim"),10)||0,pv:ptsVer(),tot:0}};
  S.lists.push(l);S.cur=l.id;BLD.id=l.id;BLD.scr="edit";try{frItems(l)}catch(_){}save();rd();return}
 if(a==="open"){BLD.id=b.dataset.id;const l=curL();if(l&&!l.bld)l.bld={fac:"",facN:"",fmt:"",limit:+l.ovP||0,pv:ptsVer(),tot:null};BLD.scr="edit";S.cur=BLD.id;rd();return}
 if(a==="home"){BLD.scr="home";BLD.id=null;rd();return}
 if(!L)return;
 if(a==="add"){BLD.scr="cat";BLD.src="all";BLD.fac="";BLD.q="";BLD.role="";BLD.more=false;render();return}
 if(a==="x"){BLD.scr="edit";BLD.cfg=null;render();return}
 if(a==="back"){BLD.scr=BLD.scr==="ldr"?"cfg":"edit";render();return}
 if(a==="src"){BLD.src=b.dataset.v;render();return}
 if(a==="more"){BLD.more=true;render();return}
 if(a==="pick"){openCfg(b.dataset.k,null);return}
 if(a==="edit"){const u=L.units[+b.dataset.i];if(u)openCfg(u.cfg&&u.cfg.lib?"u:"+u.cfg.lib:"c:"+u.ref,+b.dataset.i);return}
 if(a==="del"){const i=+b.dataset.i,u=L.units[i];if(!u)return;ask({t:"Retirer « "+u.name+" » de l'armée ?",p:"Sa fiche de collection n'est pas supprimée.",ok:"Retirer",dg:1},()=>{L.units.splice(i,1);syncPts(L);applyPts(L);save();rd()});return}
 if(c){
  if(a==="size"){const o=c.size;c.size=+b.dataset.v;Object.keys(c.wq).forEach(k=>{if(c.wq[k]===o)c.wq[k]=c.size});clampQ(c);render();return}
  if(a==="sz"){const o=c.size;c.size=Math.max(1,Math.min(40,c.size+(+b.dataset.d)));Object.keys(c.wq).forEach(k=>{if(c.wq[k]===o)c.wq[k]=c.size});clampQ(c);render();return}
  if(a==="wq"){const k=b.dataset.k;c.wq[k]=Math.max(0,Math.min(c.size,(c.wq[k]||0)+(+b.dataset.d)));if(!c.wq[k]){delete c.wq[k];delete c.wn[k]}render();return}
  if(a==="wg"){const k=b.dataset.k;c.wg[k]=Math.max(0,(c.wg[k]||0)+(+b.dataset.d));if(!c.wg[k])delete c.wg[k];render();return}
  if(a==="enh"){const v=b.dataset.v;c.enh=v?{id:v,name:(D.enh.find(x=>x.id===v)||{}).n||""}:null;render();return}
  if(a==="ldr"){BLD.scr="ldr";render();return}
  if(a==="ldrx"){c.subs=[];render();return}
  if(a==="ldrpick"){ldrPick(b.dataset.k);return}
  if(a==="ok"){commitCfg();return}
 }
 if(a==="det"){BLD.scr="det";BLD.dq="";render();return}
 if(a==="detpick"){detPick(b.dataset.id);return}
 if(a==="detx"){if(L.bld)L.bld.det=null;L.dets=(L.dets||[]).filter(x=>!x.bld);L.strats=(L.strats||[]).filter(x=>!x.bld);L.units.forEach(u=>{if(u.cfg)u.cfg.enh=null});syncPts(L);applyPts(L);save();BLD.scr="edit";rd();return}
 if(a==="recap"){BLD.scr="recap";render();return}
 if(a==="print"){printList(L);return}
 if(a==="json"){dl2((L.name||"armee").replace(/[^\w-]+/g,"_")+".hammer.json",exportJson(L));return}
 if(a==="copy"){try{await navigator.clipboard.writeText(recapText(L));toast("Liste copiée ✓")}catch(_){dl2((L.name||"armee")+".txt",recapText(L),"text/plain")}return}
 if(a==="share"){const t=recapText(L);try{if(navigator.share)await navigator.share({title:L.name,text:t});else{await navigator.clipboard.writeText(t);toast("Liste copiée : colle-la où tu veux ✓")}}catch(_){}return}
 if(a==="dup"){const n=clone(L);n.id="l"+Date.now();n.name=L.name+" (copie)";S.lists.push(n);S.cur=n.id;BLD.id=n.id;save();toast("Armée dupliquée ✓");rd();return}
 if(a==="classic"){S.cur=L.id;tab="units";try{draw()}catch(_){}return}
 if(a==="disp"){L.mission=b.dataset.v;L.game=L.game||"w40k";if(L.mid){try{const mm=(window.__msd||[]).find(x=>x.id===L.mid);if(!mm||mm.cat!==L.mission)L.mid=""}catch(_){}}save();rd();return}
 if(a==="logok"){(L.bld.log||[]).forEach(x=>x.seen=true);save();rd();return}
},true);
document.addEventListener("input",e=>{const t=e.target;if(!t)return;
 if(t.id==="bldq"){BLD.q=t.value;BLD.more=false;render()}
 else if(t.id==="bldlq"){BLD.lq=t.value;render()}
 else if(t.id==="bldd"){BLD.dq=t.value;render()}
 else if(t.id==="bldman"&&BLD.cfg){BLD.cfg.manual=parseInt(t.value,10)||0}
 else if(t.dataset&&t.dataset.bldn&&BLD.cfg){BLD.cfg.wn[t.dataset.bldn]=t.value}},true);
document.addEventListener("change",async e=>{const t=e.target;if(!t)return;const L=curL();
 if(t.id==="bldf"){BLD.fac=t.value;render()}else if(t.id==="bldr"){BLD.role=t.value;render()}
 else if(t.dataset&&t.dataset.bldck==="lall"){BLD.lall=t.checked;render()}
 else if(t.id==="bldname"&&L){L.name=t.value.trim()||L.name;save()}
 else if(t.id==="bldfac2"&&L){L.bld.fac=t.value;const f=facList().find(x=>x[0]===t.value);L.bld.facN=f?f[1]:"";try{frItems(L)}catch(_){}save();rd()}
 else if(t.id==="bldlim2"&&L){L.bld.limit=parseInt(t.value,10)||0;save();rd()}
 else if(t.id==="bldfmt2"&&L){L.bld.fmt=t.value.trim();save()}
 else if(t.id==="bldimp"&&t.files&&t.files[0]){try{const l=importJson(await t.files[0].text());BLD.id=l.id;BLD.scr="edit";S.cur=l.id;toast("Armée importée ✓");rd()}catch(err){try{toast("⚠ "+err.message)}catch(_){}}}},true);
/* points mis à jour avec la bibliothèque : recalcul de toutes les armées du constructeur */
window.BLDSYNC=()=>{try{(S.lists||[]).forEach(l=>{if(l.bld)syncPts(l)});save()}catch(_){}};
window.BLDCALC=calc;window.BLDCOST=costOf;
window.BLDL=curL;window.BLDSTATE=BLD;
