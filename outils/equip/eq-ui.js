/* ===== HAMMER · Équipements : interface (intégrée aux écrans existants) ===== */
(()=>{
const EQ=window.EQ;if(!EQ||typeof S==="undefined")return;
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sv=()=>{try{save()}catch(_){}};
const LV={green:["🟢","Valide"],orange:["🟠","À vérifier"],red:["🔴","Invalide"]};
const BK="armees40k_bk_eq1";
/* ---------- sauvegarde / migration ---------- */
function backup(){try{const d=JSON.stringify({ts:Date.now(),coll:S.coll,lists:S.lists,eqc:S.eqc||null});try{localStorage.setItem(BK,d);return true}catch(_){S.eqbk=JSON.parse(d);return true}}catch(_){return false}}
function getBackup(){try{const d=localStorage.getItem(BK);if(d)return JSON.parse(d)}catch(_){}return S.eqbk||null}
function migrate(force){if(S.eqoff&&!force)return 0;if(S.eqv==null){backup()}const n=EQ.regroup(S);if(S.eqv==null||force){S.eqv=1;S.eqdt=Date.now()}if(force)delete S.eqoff;return n}
function restore(){const b=getBackup();if(!b)return false;S.coll=b.coll;S.lists=b.lists;S.eqc=b.eqc||{};S.eqx=[];S.eqoff=1;delete S.eqv;sv();return true}
const primOf=u=>{const m=u&&S.coll[u.ref];return m&&m.mrg&&S.coll[m.mrg]?S.coll[m.mrg]:m||null};
const consOf=u=>EQ.consOf(S,u);
const poolOf=u=>{const p=primOf(u),a=((p&&p.eqw)||[]).concat(u.weapons||[]),seen=new Set(),o=[];a.forEach(w=>{const b=EQ.wbase(w.name),k=EQ.nk(b);if(k&&!seen.has(k)){seen.add(k);o.push(w)}});return o};
const vOf=u=>EQ.validate(u,consOf(u));
/* ---------- section « fiche » (collection / liste) ---------- */
function consRows(u,edit){const cs=consOf(u);return cs.length?cs.map(c=>`<div class="eq-c ${EQ.isConf(c)?"ok":"pdf"}"><div><b>${E(EQ.describe(c))}</b><div class="eq-s">${E(EQ.stLabel(c))}${c.st==="off"&&c.src?` · ${E(c.src.doc||"")}${c.src.p?", page "+c.src.p:""}`:c.src&&c.src.passage?` · <i>« ${E(c.src.passage)} »</i>`:""}</div></div>${edit?`<span class="eq-a">${EQ.isConf(c)?"":`<button class="b" data-eq="cfm" data-id="${E(c.id)}">Confirmer</button>`}<button class="b x" data-eq="crm" data-id="${E(c.id)}" aria-label="Retirer">✕</button></span>`:""}</div>`).join(""):'<p class="mu">Aucune restriction connue : « À vérifier » tant qu\'elle n\'est pas renseignée. HAMMER n\'invente aucune règle.</p>'}
function addForm(u){const pool=poolOf(u).map(w=>EQ.wbase(w.name)),opts=pool.map(n=>`<option>${E(n)}</option>`).join("");return`<details class="eq-add"><summary>+ Ajouter une restriction</summary><div class="eq-f"><label>Type<select data-eqf="t"><option value="max">Maximum par unité</option><option value="role">Réservée à une figurine (ex. sergent)</option><option value="excl">Deux équipements incompatibles</option><option value="min">Minimum obligatoire</option></select></label><label>Équipement<select data-eqf="w">${opts}</select></label><label data-eqrow="w2" hidden>Incompatible avec<select data-eqf="w2">${opts}</select></label><label data-eqrow="n">Nombre<input data-eqf="n" type="number" min="1" value="1" inputmode="numeric"></label><label data-eqrow="role" hidden>Figurine concernée<input data-eqf="role" value="Sergent"></label><button class="b p" data-eq="cadd">Enregistrer (confirmée par moi)</button></div></details>`}
function offInfo(u){const d=(S.eqd||{})[EQ.consKey(u)];if(!d)return"";
 if(d.nocompat)return`<div class="eq-i orange"><span>⚠ Une fiche officielle V11 existe pour « ${E(d.n)} » (${E(d.doc)}, page ${d.p}) mais ses armes ne correspondent pas à celles de cette fiche : aucune restriction appliquée, version à vérifier.</span></div>`;
 return`<div class="eq-ok">✔ Données officielles V11 : ${E(d.doc)}, page ${d.p}.${d.x?` ${d.x} option${d.x>1?"s":""} complexe${d.x>1?"s":""} non reprise${d.x>1?"s":""} automatiquement : à vérifier dans le document.`:""}</div>`}
function collSection(u){const p=primOf(u)||u,cf=p.cfgs||[],pool=(p.eqw||[]);
 return`<div class="eq-sec" data-eqsec="coll"><div class="sech">🧰 Équipements connus</div>
 ${cf.length>1?`<p class="mu" style="margin:6px 0">${cf.length} configurations d'équipement regroupées dans cette fiche :</p>`:""}
 ${cf.map((c,i)=>`<div class="eq-cfg"><b>${E(c.name)}</b><div class="eq-w">${c.w.map(w=>`<span>${E(EQ.S1(w))}</span>`).join("")||'<span class="mu">aucune arme</span>'}</div></div>`).join("")}
 <p class="mu" style="margin:8px 0 2px">Toutes les armes connues pour cette unité : ${pool.length?pool.map(w=>E(EQ.S1(EQ.wbase(w.name)))).filter((x,i,a)=>a.indexOf(x)===i).join(", "):"—"}. Dans une armée, seules les armes réellement choisies apparaissent.</p>
 <div class="sech">📏 Restrictions d'équipement</div>${offInfo(p)}${consRows(p,true)}
 <div class="eq-row"><button class="b" data-eq="cfix">Cette unité n'a aucune option (confirmé)</button></div>${addForm(p)}</div>`}
function listSection(u){const v=vOf(u),L=LV[v.st];
 return`<div class="eq-sec" data-eqsec="list"><div class="sech">⚙ Équipement de l'unité <span class="eq-b ${v.st}">${L[0]} ${L[1]}</span></div>
 <div class="eq-sum">${v.lines.length?v.lines.map(l=>`<div>${E(l.t)}</div>`).join(""):'<span class="mu">Aucun équipement.</span>'}</div>
 ${v.issues.length?`<div class="eq-is">${v.issues.map(i=>`<div class="eq-i ${i.lvl}"><span>${i.lvl==="red"?"⛔":"⚠"} ${E(i.msg)}</span>${i.m&&i.m.length?`<button class="b" data-eq="fix" data-m="${i.m[0]}">Corriger</button>`:""}</div>`).join("")}</div>`:'<p class="eq-ok">Toutes les contraintes connues sont respectées.</p>'}
 <div class="eq-row"><button class="b p" data-eq="cfg">Configurer les figurines (${EQ.sizeOf(u)})</button></div>
 ${offInfo(u)}<details class="eq-add"><summary>Restrictions connues (${consOf(u).length})</summary>${consRows(u,false)}</details></div>`}
/* ---------- feuille de configuration individuelle ---------- */
let SHT=null;
const root=()=>{let o=document.getElementById("eqs");if(!o){o=document.createElement("div");o.id="eqs";o.setAttribute("role","dialog");o.setAttribute("aria-label","Équipement des figurines");document.body.appendChild(o);o.addEventListener("click",onSheet);o.addEventListener("change",onSheetCh)}return o};
function closeSheet(){const o=document.getElementById("eqs");if(o)o.remove();SHT=null;try{draw()}catch(_){}}
function openSheet(u,focus,note){SHT={u,focus:focus==null?-1:focus,note:note||""};drawSheet()}
function drawSheet(){if(!SHT)return;const u=SHT.u,cons=consOf(u),pool=poolOf(u),v=vOf(u),M=v.models.m,N=EQ.sizeOf(u),L=LV[v.st];
 const bad=new Set();v.issues.forEach(i=>(i.m||[]).forEach(x=>bad.add(x)));
 const roles=[...new Set(cons.filter(c=>c.t==="role").map(c=>c.role).concat(["Sergent"]))];
 root().innerHTML=`<div class="eq-sh"><div class="eq-top"><div><h2>${E(EQ.cap(u.name))}</h2><p class="mu" style="margin:0">Équipement figurine par figurine</p></div><button class="eq-x" data-eq="close" aria-label="Fermer">✕</button></div>
 ${SHT.note?`<p class="eq-ok">${E(SHT.note)}</p>`:""}
 <div class="eq-st ${v.st}">${L[0]} ${L[1]}</div>
 <div class="eq-sum">${v.lines.map(l=>`<div>${E(l.t)}</div>`).join("")||'<span class="mu">Aucun équipement</span>'}</div>
 ${v.issues.length?`<div class="eq-is">${v.issues.map(i=>`<div class="eq-i ${i.lvl}"><span>${i.lvl==="red"?"⛔":"⚠"} ${E(i.msg)}</span>${i.m&&i.m.length?`<button class="b" data-eq="fix" data-m="${i.m[0]}">Aller à la figurine ${i.m[0]+1}</button>`:""}</div>`).join("")}</div>`:'<p class="eq-ok">Toutes les contraintes connues sont respectées.</p>'}
 <label class="eq-n">Nombre de figurines dans l'unité<div class="tk-step eq-step"><button data-eq="dn" data-v="-1">−</button><input data-eqn="1" type="number" min="1" inputmode="numeric" value="${N}"><button data-eq="dn" data-v="1">+</button></div></label>
 ${v.models.asm&&!v.models.cust?'<p class="mu">Répartition proposée automatiquement d\'après les quantités de la liste : modifie-la si besoin.</p>':""}
 <div class="eq-ms">${M.map((m,i)=>`<div class="eq-m${bad.has(i)?" bad":""}${SHT.focus===i?" foc":""}" id="eqm${i}"><div class="eq-mh"><b>Figurine ${i+1}</b><input data-eqr="${i}" list="eqro" value="${E(m.r)}" placeholder="Rôle (ex. Sergent)"></div><div class="eq-chs">${pool.map(w=>{const b=EQ.wbase(w.name),on=m.w.some(x=>EQ.same(x,b));return`<button class="eq-ch${on?" on":""}" data-eq="tw" data-m="${i}" data-w="${E(b)}">${on?"✓ ":""}${E(EQ.S1(b))}</button>`}).filter((x,i,a)=>a.indexOf(x)===i).join("")}</div></div>`).join("")}</div><datalist id="eqro">${roles.map(r=>`<option value="${E(r)}">`).join("")}</datalist>
 <div class="eq-row"><button class="b" data-eq="reset">↺ Répartition automatique</button><button class="b p" data-eq="close">Terminer</button></div></div>`;
 if(SHT.focus>=0){const el=document.getElementById("eqm"+SHT.focus);if(el&&el.scrollIntoView)el.scrollIntoView({block:"center"})}}
function setModels(M){const u=SHT.u;EQ.applyModels(u,M,poolOf(u));sv();drawSheet()}
function curModels(){const u=SHT.u;return vOf(u).models.m.map(m=>({r:m.r,w:m.w.slice()}))}
function onSheet(e){const b=e.target.closest&&e.target.closest("[data-eq]");if(!b){if(e.target.id==="eqs")closeSheet();return}const k=b.dataset.eq;
 if(k==="close"){closeSheet();return}
 if(k==="fix"){SHT.focus=+b.dataset.m;drawSheet();return}
 if(k==="tw"){const M=curModels(),m=M[+b.dataset.m],w=b.dataset.w,i=m.w.findIndex(x=>EQ.same(x,w));if(i>=0)m.w.splice(i,1);else m.w.push(w);SHT.focus=+b.dataset.m;setModels(M);return}
 if(k==="reset"){delete SHT.u.eq;const v=vOf(SHT.u);EQ.applyModels(SHT.u,v.models.m,poolOf(SHT.u));delete SHT.u.eq;sv();SHT.focus=-1;drawSheet();return}
 if(k==="dn"){const u=SHT.u,n=Math.max(1,EQ.sizeOf(u)+ +b.dataset.v);u.size=n;delete u.eq;sv();drawSheet();return}}
function onSheetCh(e){const t=e.target;if(t.dataset.eqr!=null){const M=curModels();M[+t.dataset.eqr].r=t.value.trim();setModels(M);return}
 if(t.dataset.eqn){const u=SHT.u,n=Math.max(1,parseInt(t.value,10)||1);u.size=n;delete u.eq;sv();drawSheet()}}
/* ---------- validation de l'armée ---------- */
function armyBanner(L){const us=L.units,ar=EQ.validateArmy(us,u=>consOf(u)),l=LV[ar.st];
 return`<div class="card eq-army ${ar.st}" data-eqarmy="1"><div class="eq-ah"><b>${l[0]} Validation de l'armée : ${l[1]}</b><button class="b" data-eq="army">Détail</button></div><div class="mu">${ar.n.green} valide(s) · ${ar.n.orange} à vérifier · ${ar.n.red} invalide(s)</div></div>`}
function armyPanel(L){const ar=EQ.validateArmy(L.units,u=>consOf(u)),l=LV[ar.st];
 root().innerHTML=`<div class="eq-sh"><div class="eq-top"><div><h2>Validation de l'armée</h2><p class="mu" style="margin:0">${E(L.name||"")}</p></div><button class="eq-x" data-eq="close" aria-label="Fermer">✕</button></div><div class="eq-st ${ar.st}">${l[0]} ${l[1]}</div>
 <p class="mu">Rouge : une restriction confirmée est enfreinte. Orange : information absente ou non confirmée. L'orange ne bloque rien.</p>
 ${ar.rs.map((r,i)=>{const x=LV[r.v.st];return`<div class="eq-ur"><div class="eq-uh"><b>${x[0]} ${E(EQ.cap(r.u.name))}</b><button class="b" data-eq="openu" data-i="${i}">Ouvrir</button></div>${r.v.issues.map(s=>`<div class="eq-i ${s.lvl}"><span>${s.lvl==="red"?"⛔":"⚠"} ${E(s.msg)}</span>${s.m&&s.m.length?`<button class="b" data-eq="fixu" data-i="${i}" data-m="${s.m[0]}">Corriger</button>`:""}</div>`).join("")||'<div class="eq-ok">Tout est conforme.</div>'}</div>`}).join("")}</div>`;SHT={army:L}}
/* ---------- actions fiches / restrictions ---------- */
function curU(){return typeof ed!=="undefined"?ed:null}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-eq]");if(!b||b.closest("#eqs"))return;const k=b.dataset.eq,u=curU();
 if(k==="cfg"&&u){e.stopPropagation();openSheet(u);return}
 if(k==="fix"&&u){e.stopPropagation();openSheet(u,+b.dataset.m);return}
 if(k==="army"){e.stopPropagation();const L=cl();if(L)armyPanel(L);return}
 const p=u&&primOf(u)||u;
 if(k==="cfm"&&p){e.stopPropagation();const c=EQ.consOf(S,p).find(x=>x.id===b.dataset.id);if(c){c.ok=1;sv();modalRefresh()}return}
 if(k==="crm"&&p){e.stopPropagation();EQ.rejectCons(S,p,b.dataset.id);sv();modalRefresh();return}
 if(k==="cfix"&&p){e.stopPropagation();EQ.addCons(S,p,{t:"fixed",st:"user",ok:1,manual:1,src:{doc:"Saisie utilisateur"}});sv();modalRefresh();return}
 if(k==="cadd"&&p){e.stopPropagation();const g=n=>{const el=document.querySelector(`[data-eqf="${n}"]`);return el?el.value:""},t=g("t"),w=g("w"),n=Math.max(1,parseInt(g("n"),10)||1);if(!w){toast("Choisis un équipement");return}
  const c={t,w,st:"user",ok:1,manual:1,src:{doc:"Saisie utilisateur"}};if(t==="max"||t==="min")c.n=n;else if(t==="role"){c.role=g("role").trim()||"Sergent";c.n=n}else if(t==="excl"){const w2=g("w2");if(!w2||EQ.same(w,w2)){toast("Choisis deux équipements différents");return}c.ws=[w,w2];delete c.w}
  EQ.addCons(S,p,c);sv();modalRefresh();toast("Restriction enregistrée");return}},true);
document.addEventListener("change",e=>{const t=e.target;if(t.dataset&&t.dataset.eqf==="t"){const f=t.closest(".eq-f");if(!f)return;const v=t.value;f.querySelector('[data-eqrow="w2"]').hidden=v!=="excl";f.querySelector('[data-eqrow="role"]').hidden=v!=="role";f.querySelector('[data-eqrow="n"]').hidden=v==="excl"}});
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#eqs [data-eq]");if(!b||!SHT||!SHT.army)return;const k=b.dataset.eq,L=SHT.army;
 if(k==="close"){e.stopPropagation();closeSheet();return}
 if(k==="openu"||k==="fixu"){e.stopPropagation();const u=L.units[+b.dataset.i];if(u)openSheet(u,k==="fixu"?+b.dataset.m:-1)}},true);
function modalRefresh(){try{if(typeof modal==="function")modal()}catch(_){}}
/* ---------- injection dans les écrans existants ---------- */
let busy=false;
function decorate(){if(busy)return;busy=true;try{
 const md=document.getElementById("md");
 if(md){const pn=md.querySelector(".pn"),u=curU();
  if(pn&&u&&typeof edit!=="undefined"&&!edit&&!pn.querySelector(".eq-sec")){const co=typeof ctx!=="undefined"&&ctx==="coll",sub=typeof ftab!=="undefined"&&ftab>0&&!co;
   if(!sub){const h=co?collSection(u):listSection(u),sv2=pn.querySelector(".sv");if(sv2)sv2.insertAdjacentHTML("beforebegin",h);else pn.insertAdjacentHTML("beforeend",h)}}}
 const m=document.getElementById("m");
 if(m&&typeof tab!=="undefined"){
  if(tab==="units"){const L=typeof cl==="function"?cl():null;if(L&&L.units&&L.units.length){const g=m.querySelector(".grid");
    if(g&&!m.querySelector(".eq-army")){g.insertAdjacentHTML("beforebegin",armyBanner(L))}
    else if(m.querySelector(".eq-army")){const ar=m.querySelector(".eq-army"),n=armyBanner(L);if(ar.outerHTML!==n){const t=document.createElement("div");t.innerHTML=n;ar.replaceWith(t.firstChild)}}
    m.querySelectorAll('.card.hv[data-act="view"][data-i]').forEach(c=>{const u=L.units[+c.dataset.i];if(!u)return;const v=vOf(u),x=LV[v.st];let d=c.querySelector(".eq-dot");if(!d){d=document.createElement("span");d.className="eq-dot";const nb=c.querySelector("b.cap");if(nb)nb.after(d)}if(d.dataset.s!==v.st){d.dataset.s=v.st;d.textContent=x[0];d.title="Équipement : "+x[1]}})}}
  if(tab==="coll"){m.querySelectorAll('[data-act="cview"][data-r]').forEach(c=>{const p=S.coll[c.dataset.r];if(!p||!p.cfgs||p.cfgs.length<2||c.querySelector(".eq-cf"))return;const s=document.createElement("span");s.className="eq-cf";s.textContent=p.cfgs.length+" configurations";const t=c.querySelector("b.cap,.tn");if(t&&t.parentNode)t.parentNode.insertBefore(s,t.nextSibling)});
   if(!m.querySelector(".eq-bk")){const bk=getBackup();m.insertAdjacentHTML("beforeend",`<div class="card eq-bk"><b>🧰 Regroupement des variantes d'armes</b><p class="mu" style="margin:4px 0">Les unités à plusieurs configurations d'armes sont regroupées en une seule fiche. Aucune donnée n'est supprimée.${bk?" Sauvegarde faite le "+new Date(bk.ts).toLocaleString("fr-FR")+".":""}</p>${S.eqoff?'<button class="b p" data-eqx="redo">Regrouper à nouveau</button>':bk?'<button class="b" data-eqx="restore">Restaurer la sauvegarde d\'avant le regroupement</button>':""}</div>`)}}}
 if(typeof tab!=="undefined"&&tab==="play"){const L=typeof cl==="function"?cl():null;if(L)document.querySelectorAll('#pl .puh[data-k^="u:"]').forEach(h=>{const i=+h.dataset.k.split(":")[2],u=L.units[i];if(!u)return;const v=vOf(u),x=LV[v.st];let d=h.querySelector(".eq-dot");if(!d){d=document.createElement("span");d.className="eq-dot";const nb=h.querySelector("b.cap");if(nb)nb.after(d)}if(d.dataset.s!==v.st){d.dataset.s=v.st;d.textContent=x[0];d.title="Équipement : "+x[1]}})}
 }catch(e){}finally{busy=false}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-eqx]");if(!b)return;e.stopPropagation();const k=b.dataset.eqx;
 if(k==="restore")ask({t:"Restaurer la sauvegarde ?",p:"Les fiches et les listes reviennent exactement à l'état d'avant le regroupement des variantes. Le regroupement automatique est alors désactivé.",ok:"Restaurer",dg:1},()=>{restore();toast("Sauvegarde restaurée")});
 if(k==="redo"){migrate(true);sv();try{draw()}catch(_){}toast("Variantes regroupées")}},true);
let tmr=null;const obs=new MutationObserver(()=>{if(busy)return;clearTimeout(tmr);tmr=setTimeout(decorate,60)});
function start(){obs.observe(document.body,{childList:true,subtree:true});decorate()}
/* nouvelle unité ajoutée à la main : choisir l'équipement */
function manualAdd(n,m){try{const cfg=m&&m.cfgs&&m.cfgs[0];if(!n.eq)delete n.eq;const note=m&&m.cfgs&&m.cfgs.length>1?"Choisis l'équipement de cette unité : "+m.cfgs.map(c=>c.name).join(" / ")+".":"Vérifie l'équipement de cette unité.";if((m&&m.eqw&&m.eqw.length>EQ.poolOf(n).length)||consOf(n).length)setTimeout(()=>openSheet(n,-1,note),60)}catch(_){}}
window.EQUI={migrate,restore,backup,getBackup,openSheet,decorate,manualAdd,primOf,vOf,consOf,poolOf,decor:decorate};
try{migrate();sv()}catch(e){console.warn("eq migrate",e)}
start();
})();
