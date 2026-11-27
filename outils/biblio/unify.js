/* ===== Unification des fiches : noms français, rapprochements fiables, vue anglaise en consultation ===== */
/* Règles : jamais de nom inventé ; un nom n'est « confirmé » que s'il vient de toi (collection, correction) ; rien n'est fusionné quand c'est incertain ; les données personnelles ne sont jamais modifiées. */
const UNI={busy:false};
const UIDB=()=>new Promise((res,rej)=>{const r=indexedDB.open("hammer-unif",1);r.onupgradeneeded=()=>r.result.createObjectStore("bk");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function uiPut(k,v){const db=await UIDB();return new Promise((res,rej)=>{const t=db.transaction("bk","readwrite");t.objectStore("bk").put(v,k);t.oncomplete=()=>res(true);t.onerror=()=>rej(t.error)})}
async function uiGet(k){const db=await UIDB();return new Promise((res,rej)=>{const t=db.transaction("bk").objectStore("bk").get(k);t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error)})}
/* sauvegarde complète (sans images) avant toute modification : une copie « première » jamais écrasée + une copie « dernière » */
async function uniBackup(why){try{const lb=LB(),snap=JSON.stringify({at:Date.now(),why,coll:S.coll,lists:S.lists,lib:{links:lb.links,tr:lb.tr,al:lb.al||{},unc:lb.unc||{}},hist:S.hist||null,stats:S.stats||null});
 if(!(await uiGet("first")))await uiPut("first",snap);await uiPut("last",snap);lb.ubk=Date.now();return true}catch(e){return false}}
async function uniRestore(which){try{const s=await uiGet(which||"last");if(!s)return false;const x=JSON.parse(s),lb=LB();S.coll=x.coll;S.lists=x.lists;lb.links=x.lib.links;lb.tr=x.lib.tr;lb.al=x.lib.al;lb.unc=x.lib.unc;Object.keys(AM).forEach(k=>delete AM[k]);sv();try{draw()}catch(_){}return true}catch(e){return false}}
const sameNm=(a,b)=>nk(a)===nk(b);
const facTxt=m=>nk([m.fkw,m.kw,(S.fac||[]).filter(f=>f.id===m.fac).map(f=>f.name).join(" ")].join(" "));
/* plusieurs unités de même nom (factions différentes) : on ne choisit que si la faction de la fiche tranche */
function resolveSame(m,u){const same=D.units.filter(x=>sameNm(x.n,u.n));if(same.length<=1)return u;const ft=facTxt(m),ok=same.filter(x=>(x.f||[]).some(f=>f&&ft.includes(nk(f)))||(x._c&&ft.includes(nk(x._c.replace(/-/g," ")))));return ok.length===1?ok[0]:null}
/* le nom de la fiche désigne clairement une AUTRE unité de la bibliothèque : on ne rapproche pas */
function contradict(m,u){return D.units.some(x=>x.id!==u.id&&sameNm(x.n,m.name)&&!sameNm(x.n,u.n))}
function nameEvidence(m,u){const lb=LB(),tr=lb.tr["n:"+nk(u.n)],al=(lb.al||{})[u.id]||[];if(sameNm(m.name,u.n)||(tr&&sameNm(tr.fr,m.name))||al.some(a=>sameNm(a,m.name)))return true;
 const fr=(D.fr[hh(u.n)]||{}).fr,T=toks(m.name),cands=[toks(u.n)].concat(fr?[toks(fr)]:[]);return cands.some(U=>T.length&&U.length&&T.filter(w=>U.includes(w)).length/Math.max(T.length,U.length)>=.6)}
/* ----- unification automatique ----- */
function unify(opts){if(!D.ready||UNI.busy)return null;UNI.busy=true;UNI.need=false;try{const lb=LB();lb.al=lb.al||{};lb.unc=lb.unc||{};const res={linked:0,names:0,unc:0,stamped:0};
 // 1) rapprochements évidents
 const plan=[];Object.values(S.coll||{}).forEach(m=>{if(!m||(m.mrg&&S.coll[m.mrg])||lb.links[m.ref])return;let am=null;try{am=autoMatch(m)}catch(_){}if(!am)return;
  if(am.level==="ok"&&!contradict(m,am.u)){const u=resolveSame(m,am.u);if(u)plan.push({m,u});else plan.push({m,unc:[am.u]})}
  else plan.push({m,unc:(am.cands&&am.cands.length?am.cands:[am.u]).slice(0,5)})});
 const toLink=plan.filter(p=>p.u),toUnc=plan.filter(p=>p.unc);
 const stamp=Object.keys(lb.links).filter(r=>!lb.links[r].st);
 const njobs=()=>{const o=[];Object.keys(lb.links).forEach(r=>{const m=S.coll[r],u=D.byId[(lb.links[r]||{}).id];if(m&&u&&!m.fromLib&&!sameNm(m.name,u.n))o.push([m,u])});return o};const nameJobs0=njobs();
 if(toLink.length||stamp.length||toLink.length||nameJobs0.some(([m,u])=>{const t=lb.tr["n:"+nk(u.n)];return !t||t.st!=="ok"}))UNI.need=true;
 if(UNI.need&&!(opts&&opts.noBackup)){uniBackup("avant unification automatique")}  // copie asynchrone ; les changements ci-dessous n'effacent rien
 toLink.forEach(({m,u})=>{const pi=Math.max(0,u.pr.findIndex(p=>nk(p.n)===nk(u.n)));lb.links[m.ref]={id:u.id,h:u.h,v:D.man.version,at:Date.now(),prof:pi,applied:[],stale:false,st:"auto",src:"unification"};try{snapEq(m,u,u.wp||{})}catch(_){}delete lb.unc[m.ref];res.linked++});
 toUnc.forEach(({m,unc})=>{const ids=unc.map(x=>x.id);if(JSON.stringify((lb.unc[m.ref]||{}).c)!==JSON.stringify(ids)){lb.unc[m.ref]={c:ids,at:Date.now()};res.unc++}});
 stamp.forEach(r=>{lb.links[r].st=(S.coll[r]&&S.coll[r].fromLib)?"auto":"manual";res.stamped++});
 const nameJobs=njobs();
 // 2) noms français appris de TES fiches (jamais d'un nom approximatif) ; désaccord entre deux fiches = à vérifier
 const byU={};nameJobs.forEach(([m,u])=>{(byU[u.id]=byU[u.id]||{u,names:new Set()}).names.add(m.name.trim())});
 Object.values(byU).forEach(({u,names})=>{const key="n:"+nk(u.n),cur=lb.tr[key];lb.al[u.id]=[...new Set([...(lb.al[u.id]||[]),...names])];
  if(names.size===1){const fr=[...names][0];if(!cur||(cur.src==="collection"&&cur.fr!==fr&&cur.st!=="ok")){lb.tr[key]={fr,st:"ok",src:"collection",at:Date.now(),ver:D.man.version};res.names++}}
  else if(!cur){lb.tr[key]={fr:[...names][0],st:"chk",src:"collection",at:Date.now(),alt:[...names]};res.names++}});
 if(res.linked||res.names||res.unc||res.stamped){Object.keys(AM).forEach(k=>delete AM[k]);sv();try{draw()}catch(_){}}
 return res}finally{UNI.busy=false}}
/* ----- statuts ----- */
function nameStatus(u){const lb=LB(),t=lb.tr["n:"+nk(u.n)];if(t&&t.fr){if(t.st==="ok")return{k:"ok",t:"Français confirmé",fr:t.fr,src:t.src==="collection"?"ta collection":"toi"};return{k:"chk",t:"Traduction à vérifier",fr:t.fr}}
 const o=D.fr[hh(u.n)];if(o&&o.ok===false&&/^liste fournie/.test(o.src||"")&&o.fr&&!sameNm(o.fr,u.n))return{k:"chk",t:"Traduction provisoire à vérifier",fr:o.fr};if(o&&o.ok)return{k:"ok",t:"Français confirmé",fr:o.fr,src:"source officielle Games Workshop France"};if(o&&o.fr&&!sameNm(o.fr,u.n))return{k:"chk",t:"Traduction à vérifier",fr:o.fr};return{k:"todo",t:"Anglais conservé : traduction à effectuer",fr:""}}
function linkStatus(ref){const lb=LB(),lk=lb.links[ref];if(lk&&D.byId[lk.id])return lk.st==="manual"?{k:"man",t:"Correspondance manuelle validée"}:{k:"auto",t:"Correspondance confirmée automatiquement"};if(lb.unc&&lb.unc[ref])return{k:"unc",t:"Correspondance incertaine"};return{k:"none",t:"Aucune correspondance trouvée"}}
/* ----- recherche dans les deux langues ----- */
window.BIBAL=ref=>{try{if(!D.ready)return"";const lb=LB(),lk=lb.links[ref],u=lk&&D.byId[lk.id];if(!u)return"";return u.n+" "+(lb.al&&lb.al[u.id]||[]).join(" ")+" "+(((lb.tr["n:"+nk(u.n)]||{}).fr)||"")+" "+((D.fr[hh(u.n)]||{}).fr||"")}catch(_){return""}};
/* ----- vue anglaise (consultation seule) ----- */
function enView(ref){const lk=LB().links[ref],u=lk&&D.byId[lk.id];if(!u)return;css();const p=profOf(u,(lk&&lk.prof)||0),w=u.wp||{};
 const wl=a=>a.map(x=>`<div class="bib-row"><b>${E(x.n)}</b> <span class="bib-meta">${E(x.r)} · A ${E(x.a)} · ${E(x.sk)} · F ${E(x.s)} · PA ${E(x.ap)} · D ${E(x.d)}${(x.kw||[]).length?" · "+E(x.kw.join(", ")):""}</span></div>`).join("");
 const o=box("bibe");o.innerHTML=`<div class="bib-ov" data-uni="bg" style="z-index:95"><div class="bib-pn"><div class="bib-top"><h2>🇬🇧 ${E(u.n)}</h2><button class="b" data-uni="close">✕ Fermer</button></div><p class="bib-meta">Fiche originale anglaise, en consultation seulement : ta fiche française n'est pas modifiée.</p>
 <div class="sg">${["M","E","SV","PV","CD","CO"].map(k=>`<div class="sx"><i>${k}</i><b>${E(statOf(p,k)||"–")}</b></div>`).join("")}</div>
 ${(u.rw||[]).length?`<h4>Ranged weapons</h4>${wl(u.rw)}`:""}${(u.mw||[]).length?`<h4>Melee weapons</h4>${wl(u.mw)}`:""}
 ${(u.ab||[]).length?`<h4>Abilities</h4>${u.ab.map(a=>`<div class="bib-row"><b>${E(a.n)}</b><div>${E(stripMd(a.d)).replace(/\n/g,"<br>")}</div></div>`).join("")}`:""}
 <h4>Keywords</h4><p>${E((u.kw||[]).join(", "))}</p>
 ${w.loadout?`<h4>Wargear</h4><p>${E(stripMd(w.loadout)).replace(/\n/g,"<br>")}</p>`:""}${(w.opt||[]).length?`<h4>Options</h4>${w.opt.map(x=>`<p>${E(stripMd(x)).replace(/\n/g,"<br>")}</p>`).join("")}`:""}${(w.comp||[]).length?`<h4>Unit composition</h4>${w.comp.map(x=>`<p>${E(stripMd(x))}</p>`).join("")}`:""}
 </div></div>`}
function uniBlock(m){try{const lb=LB(),lk=lb.links[m.ref],u=lk&&D.byId[lk.id],ls=linkStatus(m.ref);let h=`<div class="bib-lkc"><b>🔗 Unification</b><div class="bib-meta">${E(ls.t)}</div>`;
 if(u){const ns=nameStatus(u);h+=`<div class="bib-meta">Nom anglais : <b>${E(u.n)}</b></div><div class="bib-meta">Nom français : <b>${E(ns.fr||"—")}</b> · ${E(ns.t)}${ns.src?" ("+E(ns.src)+")":""}</div>
  <label>Corriger le nom français<input id="uninm" data-uref="${E(m.ref)}" value="${E(ns.fr||"")}" placeholder="Nom français officiel"></label>
  <div class="row" style="gap:6px;flex-wrap:wrap"><button type="button" class="b" data-uni="savenm" data-r="${E(m.ref)}">✔ Enregistrer le nom</button><button type="button" class="b p" data-uni="en" data-r="${E(m.ref)}">🇬🇧 Voir la fiche en anglais</button></div>`}
 else if(lb.unc&&lb.unc[m.ref]){h+=``+lb.unc[m.ref].c.map(id=>D.byId[id]).filter(Boolean).map(x=>`<div class="row" style="gap:6px;align-items:center;margin:4px 0"><span style="flex:1">${E(x.n)} <span class="bib-meta">${E(facLbl(x))}</span></span><button type="button" class="b" data-uni="linkto" data-r="${E(m.ref)}" data-id="${E(x.id)}">Lier</button></div>`).join("")}
 return h+`</div>`}catch(e){return""}}

/* ----- onglet « À vérifier » de la bibliothèque : noms à confirmer + fiches à rapprocher ----- */
const CHK={more:25};
function chkNames(){const out=[];D.units.forEach(u=>{const t=tName(u.n);if(t.st==="chk"&&t.prop)out.push({u,prop:t.prop});else if(t.prov)out.push({u,prop:t.t})});return out}
function chkLinks(){const lb=LB(),out=[];Object.values(S.coll||{}).forEach(m=>{if(!m||(m.mrg&&S.coll[m.mrg])||(lb.links[m.ref]&&D.byId[lb.links[m.ref].id]))return;let c=((lb.unc||{})[m.ref]||{}).c;c=c?c.map(id=>D.byId[id]).filter(Boolean):suggest(m).map(x=>x.u).slice(0,4);out.push({m,c,unc:!!((lb.unc||{})[m.ref])})});return out.sort((a,b)=>(b.c.length>0)-(a.c.length>0))}
window.BIBCHKN=()=>{try{return chkNames().length+chkLinks().length}catch(_){return 0}};
window.BIBCHK=q=>{try{const k=nk(q||""),hit=s=>!k||k.split(" ").every(w=>nk(s).includes(w));let h="";
 const nm=chkNames().filter(x=>hit(x.u.n+" "+x.prop)),lk=chkLinks().filter(x=>hit(x.m.name+" "+x.c.map(y=>y.n).join(" ")));
 h+=`<div class="card"><b>⚠ À vérifier</b></div>`;
 h+=`<div class="card"><b>Noms français à confirmer (${nm.length})</b>`+(nm.length?nm.slice(0,CHK.more).map(({u,prop})=>`<div class="bib-row"><b>${E(u.n)}</b> <span class="bib-meta">${E(facLbl(u))}</span><div class="bib-meta">Proposé : ${E(prop)}</div><input id="chk-${E(u.id)}" value="${E(prop)}" placeholder="Nom français" style="width:100%;margin:4px 0"><div class="row" style="gap:6px;flex-wrap:wrap"><button type="button" class="b p" data-uni="nmsave" data-id="${E(u.id)}">✔ Valider / enregistrer</button><button type="button" class="b" data-uni="nmkeep" data-id="${E(u.id)}">Garder en anglais</button><button type="button" class="b" data-bib="unit" data-id="${E(u.id)}">Voir la fiche</button></div></div>`).join("")+(nm.length>CHK.more?`<button class="b" data-uni="more" style="width:100%">Voir plus (${nm.length-CHK.more})</button>`:""):`<p class="bib-meta">✅ Aucun nom à confirmer.</p>`)+`</div>`;
 h+=`<div class="card"><b>Fiches de collection à lier (${lk.length})</b>`+(lk.length?lk.slice(0,CHK.more).map(({m,c,unc})=>`<div class="bib-row"><b>${E(m.name)}</b> <span class="bib-meta">${unc?"Correspondance incertaine":"Non liée"}</span>${c.length?c.map(x=>`<div class="row" style="gap:6px;align-items:center;margin:4px 0"><span style="flex:1">${E(tName(x.n).t)} <span class="bib-meta">${E(x.n)} · ${E(facLbl(x))}</span></span><button type="button" class="b" data-uni="linkto" data-r="${E(m.ref)}" data-id="${E(x.id)}">🔗 Lier</button></div>`).join(""):`<div class="bib-meta">Aucune fiche proche trouvée.</div>`}<button type="button" class="b" data-bib="open" data-r="${E(m.ref)}" style="margin-top:4px">🔎 Chercher une autre fiche</button></div>`).join("")+(lk.length>CHK.more?`<button class="b" data-uni="more" style="width:100%">Voir plus (${lk.length-CHK.more})</button>`:""):`<p class="bib-meta">✅ Toutes tes fiches sont liées.</p>`)+`</div>`;
 return h}catch(e){return`<p class="mu">Erreur : ${E(e&&e.message)}</p>`}};
window.BIBUNI=unify;window.BIBUNIBLK=uniBlock;window.BIBENV=enView;window.BIBUNIRESTORE=uniRestore;window.BIBUNIBK=uniBackup;window.BIBNS=nameStatus;window.BIBLS=linkStatus;
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-uni]");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.uni;
 if(a==="more"){CHK.more+=25;try{draw()}catch(_){}return}
 if(a==="nmsave"||a==="nmkeep"){const u=D.byId[b.dataset.id];if(!u)return;const v=a==="nmkeep"?u.n:((document.getElementById("chk-"+b.dataset.id)||{}).value||"").trim();if(!v){try{toast("Écris le nom français")}catch(_){}return}
  LB().tr["n:"+nk(u.n)]={fr:v,st:"ok",src:"user",at:Date.now()};try{learnPair(u.n,v)}catch(_){}sv();try{draw()}catch(_){}try{toast(a==="nmkeep"?"Nom anglais conservé ✓":"Nom enregistré ✓")}catch(_){}return}
 if(a==="en"){enView(b.dataset.r);return}
 if(a==="restore"){ask({t:"Revenir à l'état d'avant l'unification ?",p:"Tes fiches, listes et rapprochements reviennent à la sauvegarde faite avant les rapprochements automatiques. Ce qui a été modifié depuis cette sauvegarde est perdu.",ok:"Restaurer"},async()=>{const ok=await uniRestore("first");try{toast(ok?"État restauré ✓":"Aucune sauvegarde trouvée")}catch(_){}try{menu()}catch(_){}});return}
 if(a==="close"||(a==="bg"&&e.target===b)){closeM("bibe");return}
 if(a==="savenm"){const m=S.coll[b.dataset.r],lk=m&&LB().links[m.ref],u=lk&&D.byId[lk.id],v=(document.getElementById("uninm")||{}).value;if(!u||!String(v||"").trim()){try{toast("Écris le nom français")}catch(_){}return}
  LB().tr["n:"+nk(u.n)]={fr:v.trim(),st:"ok",src:"user",at:Date.now()};try{learnPair(u.n,v.trim())}catch(_){}sv();try{draw()}catch(_){}try{toast("Nom français enregistré ✓")}catch(_){}return}
 if(a==="linkto"){const m=S.coll[b.dataset.r],u=D.byId[b.dataset.id];if(!m||!u)return;await uniBackup("avant rapprochement manuel");const lb=LB(),pi=Math.max(0,u.pr.findIndex(p=>nk(p.n)===nk(u.n)));lb.links[m.ref]={id:u.id,h:u.h,v:D.man.version,at:Date.now(),prof:pi,applied:[],stale:false,st:"manual",src:"toi"};try{snapEq(m,u,u.wp||{})}catch(_){}delete (lb.unc||{})[m.ref];Object.keys(AM).forEach(k=>delete AM[k]);sv();try{draw()}catch(_){}try{toast("Fiches rapprochées ✓")}catch(_){}return}
},true);
setTimeout(async()=>{try{await init();unify()}catch(_){}},2800);
