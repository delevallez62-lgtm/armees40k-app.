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
let EDI=null,DEL=null,FLASH=null;
const TYPES=[["max","Maximum par unité"],["min","Minimum obligatoire"],["role","Réservée à une figurine (rôle)"],["excl","Deux équipements incompatibles"],["size","Effectif de l'unité"],["fixed","Aucune option d'équipement"]];
const FIELDS={max:["w","n","per"],min:["w","n"],role:["w","role","n"],excl:["w","w2"],size:["min","max"],fixed:[]};
const wnames=(u,extra)=>{const s=new Set(),o=[];poolOf(u).map(w=>EQ.wbase(w.name)).concat(extra||[]).forEach(n=>{const k=EQ.nk(n);if(k&&!s.has(k)){s.add(k);o.push(n)}});return o};
const wsel=(name,val,names)=>{const l=val&&!names.includes(val)?names.concat([val]):names;return`<select data-eqf="${name}">${l.map(n=>`<option${n===val?" selected":""}>${E(n)}</option>`).join("")}</select>`};
function consForm(u,c){const nw=!c;c=c||{t:"max",n:1};const nm=wnames(u,(c.ws||[]).concat(c.w?[c.w]:[])),show=k=>(FIELDS[c.t]||[]).includes(k)?"":" hidden";
 return`<div class="eq-f" data-eqform="${E(c.id||"new")}"><label>Type de restriction<select data-eqf="t">${TYPES.map(([k,n])=>`<option value="${k}"${c.t===k?" selected":""}>${n}</option>`).join("")}</select></label>
 <label data-eqrow="w"${show("w")}>Équipement${wsel("w",c.t==="excl"?(c.ws&&c.ws[0])||nm[0]||"":c.w||nm[0]||"",nm)}</label>
 <label data-eqrow="w2"${show("w2")}>Incompatible avec${wsel("w2",(c.ws&&c.ws[1])||nm[1]||nm[0]||"",nm)}</label>
 <label data-eqrow="n"${show("n")}>Nombre autorisé<input data-eqf="n" type="number" min="1" inputmode="numeric" value="${c.n||1}"></label>
 <label data-eqrow="per"${show("per")}>Par tranche de … figurines <span class="mu">(0 = pour toute l'unité)</span><input data-eqf="per" type="number" min="0" inputmode="numeric" value="${c.per||0}"></label>
 <label data-eqrow="role"${show("role")}>Figurine concernée (rôle)<input data-eqf="role" value="${E(c.role||"Sergent")}"></label>
 <label data-eqrow="min"${show("min")}>Effectif minimum<input data-eqf="min" type="number" min="1" inputmode="numeric" value="${c.min||1}"></label>
 <label data-eqrow="max"${show("max")}>Effectif maximum<input data-eqf="max" type="number" min="1" inputmode="numeric" value="${c.max||c.min||1}"></label>
 <div class="eq-row"><button class="b p" data-eq="csave" data-id="${E(c.id||"")}">${nw?"Ajouter":"Enregistrer"}</button><button class="b" data-eq="ccancel">Annuler</button></div></div>`}
const ICON={max:"🔢",min:"⬇",role:"👤",excl:"⛔",size:"👥",fixed:"🔒"};
function pill(c){if(c.mod)return['mod','✎ Modifiée par toi'];if(c.st==="off"||c.st==="sec")return['ok','✔ Officiel V11'];if(c.ok===1)return['ok','✔ Confirmée par toi'];return['pdf','⚠ À vérifier']}
function consRows(u,edit){const cs=consOf(u);return cs.length?cs.map(c=>{if(edit&&EDI===c.id)return`<div class="eq-c">${consForm(u,c)}</div>`;
 const conf=EQ.isConf(c),pl=pill(c),srcT=c.st==="off"&&c.src?`${E(c.src.doc||"")}${c.src.p?", page "+c.src.p:""}`:c.src&&c.src.passage&&!c.mod?`« ${E(c.src.passage)} »`:"";
 return`<div class="eq-c ${conf?"ok":"pdf"}${c.off?" off":""}${FLASH===c.id?" eq-flash":""}"><div class="eq-ct"><span class="eq-ic">${ICON[c.t]||"•"}</span><div class="eq-tx"><b>${E(EQ.describe(c))}</b><div class="eq-pl"><span class="eq-p ${pl[0]}">${pl[1]}</span>${c.off?'<span class="eq-p off">⏸ désactivée</span>':""}</div>${srcT||c.orig?`<div class="eq-s">${srcT}${c.orig?(srcT?" · ":"")+"valeur officielle : "+E(EQ.describe(c.orig)):""}</div>`:""}</div></div>${edit?`<div class="eq-a"><button class="b" data-eq="cedit" data-id="${E(c.id)}">✎ Modifier</button><button class="b" data-eq="ctog" data-id="${E(c.id)}">${c.off?"▶ Réactiver":"⏸ Désactiver"}</button>${!conf&&!c.off?`<button class="b" data-eq="cfm" data-id="${E(c.id)}">✔ Confirmer</button>`:""}${c.orig?`<button class="b" data-eq="crest" data-id="${E(c.id)}">↺ Valeur officielle</button>`:""}<button class="b x${DEL===c.id?" cf":""}" data-eq="crm" data-id="${E(c.id)}">${DEL===c.id?"Sûr ?":"✕ Supprimer"}</button></div>`:""}</div>`}).join(""):'<p class="mu">Aucune restriction connue : « À vérifier » tant qu\'elle n\'est pas renseignée. HAMMER n\'invente aucune règle.</p>'}
const logs=u=>(S.eqlog||[]).filter(x=>x.k===EQ.consKey(u)).slice(-6).reverse();
function histRows(u){const l=logs(u);return l.length?`<details class="eq-add"><summary>Historique de mes modifications (${l.length})</summary>${l.map(x=>`<div class="eq-lg"><span>${new Date(x.t).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</span> ${E(x.m)}</div>`).join("")}</details>`:""}
function impact(u){const k=EQ.consKey(u),r=[];(S.lists||[]).forEach(l=>(l.units||[]).forEach(x=>{if(EQ.consKey(x)===k){const v=vOf(x);r.push(`${LV[v.st][0]} ${E(l.name||"Liste")}`)}}));return r.length?`<div class="eq-imp">Effet sur tes listes : ${r.join(" · ")}</div>`:'<div class="eq-imp mu">Cette unité n\'est dans aucune liste pour l\'instant.</div>'}
let OPEN=false;
function consBlock(u,withImpact){const cs=consOf(u),n=cs.length,unc=cs.filter(c=>!c.off&&!EQ.isConf(c)).length,off=cs.filter(c=>c.off).length,op=OPEN||EDI||FLASH;
 const sum=`${n?n+" règle"+(n>1?"s":""):"Aucune règle connue"}${unc?` · <span class="eq-w2">${unc} à vérifier</span>`:""}${off?` · ${off} désactivée${off>1?"s":""}`:""}`;
 return`<details class="eq-dr"${op?" open":""} data-eqdr="1"><summary><span>📏 Restrictions d'équipement</span><em>${sum}</em></summary><div class="eq-cb">${offInfo(u)}${consRows(u,true)}${EDI==="new"?`<div class="eq-c">${consForm(u,null)}</div>`:`<div class="eq-row"><button class="b p" data-eq="cnew">+ Ajouter une restriction</button><button class="b" data-eq="cfix">🔒 Aucune option (confirmé)</button></div>`}${withImpact?impact(u):""}${histRows(u)}</div></details>`}
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.dataset&&d.dataset.eqdr)OPEN=d.open},true);
function offInfo(u){const d=(S.eqd||{})[EQ.consKey(u)];if(!d)return"";
 if(d.nocompat)return`<div class="eq-i orange"><span>⚠ Une fiche officielle V11 existe pour « ${E(d.n)} » (${E(d.doc)}, page ${d.p}) mais ses armes ne correspondent pas à celles de cette fiche : aucune restriction appliquée, version à vérifier.</span></div>`;
 return`<div class="eq-ok">✔ Données officielles V11 : ${E(d.doc)}, page ${d.p}.${d.x?` ${d.x} option${d.x>1?"s":""} complexe${d.x>1?"s":""} non reprise${d.x>1?"s":""} automatiquement : à vérifier dans le document.`:""}</div>`}

/* ---------- menu « ce que je peux équiper, et qui peut le porter » ---------- */
const chipsW=a=>a.map(w=>`<span>${E(EQ.S1(w))}</span>`).join("");
function equipMenu(p){const pool=(p.eqw||p.weapons||[]),off=EQ.officialFor(EQ.mergedData(S,window.EQ_DATA),p.name,pool),k=EQ.consKey(p),cons=(S.eqc&&S.eqc[k]||[]).filter(c=>!c.off);
 const baseW=off&&off.def&&off.def.length?off.def:(p.weapons||[]).map(w=>EQ.wbase(w.name)).filter((x,i,a)=>a.findIndex(y=>EQ.same(x,y))===i);
 const rules=off?off.opt||[]:[];const cards=[];
 rules.forEach(r=>{const to=EQ.toText(r),ic=r.t==="repl"?"🔁":"➕";
  cards.push(`<div class="eq-oc"><div class="eq-oh"><span>${ic}</span><b>${E(to)}</b><em class="eq-p ok">✔ Officiel V11</em></div><div class="eq-ol"><i>👥 Qui</i> ${E(EQ.whoText(r))}</div>${r.t==="repl"?`<div class="eq-ol"><i>🔁 Remplace</i> ${E((r.from||[]).map(EQ.S1).join(" ou "))}</div>`:'<div class="eq-ol"><i>➕ En plus</i> de son équipement</div>'}</div>`)});
 cons.filter(c=>c.st!=="off"&&["max","role","excl","min"].includes(c.t)).forEach(c=>{const pl=pill(c),w=c.t==="excl"?EQ.S1(c.ws[0])+" / "+EQ.S1(c.ws[1]):EQ.S1(c.w);
  cards.push(`<div class="eq-oc"><div class="eq-oh"><span>${ICON[c.t]||"•"}</span><b>${E(w)}</b><em class="eq-p ${pl[0]}">${pl[1]}</em></div><div class="eq-ol">${E(EQ.describe(c))}</div></div>`)});
 const known=new Set(rules.flatMap(r=>(r.to||[]).concat(r.from||[])).map(EQ.nk));const free=(pool||[]).map(w=>EQ.wbase(w.name)).filter((x,i,a)=>a.findIndex(y=>EQ.same(x,y))===i).filter(w=>!baseW.some(b=>EQ.same(b,w))&&!cons.some(c=>(c.w&&EQ.same(c.w,w))||(c.ws||[]).some(x=>EQ.same(x,w)))&&![...known].some(x=>EQ.same(x,w)));
 free.forEach(w=>cards.push(`<div class="eq-oc"><div class="eq-oh"><span>❔</span><b>${E(EQ.S1(w))}</b><em class="eq-p pdf">⚠ À vérifier</em></div><div class="eq-ol">Arme connue de cette fiche, mais aucune limite connue : qui peut la porter ?</div></div>`));
 return`<div class="eq-menu"><div class="eq-mt">🧰 Ce que je peux équiper</div>
 <div class="eq-base"><b>🔹 Équipement de base</b><div class="eq-w">${chipsW(baseW)||'<span class="mu">inconnu</span>'}</div><small>${off?"Chaque figurine commence avec cet équipement (fiche officielle V11).":"Équipement de la fiche enregistrée."}</small></div>
 ${cards.length?`<div class="eq-mt2">Options : quoi, et pour qui</div><div class="eq-oc-g">${cards.join("")}</div>`:'<p class="mu">Aucune option d\'équipement connue pour cette unité.</p>'}</div>`}
function collSection(u){const p=primOf(u)||u,cf=p.cfgs||[],lists=(S.lists||[]);
 const used=c=>lists.filter(l=>(l.units||[]).some(x=>x.ref===c.ref)).map(l=>l.name||"Liste");
 return`<div class="eq-sec" data-eqsec="coll">${equipMenu(p)}
 ${cf.length>1?`<div class="eq-mt2">Variantes d'équipement connues (${cf.length})</div><div class="eq-cfgs">${cf.map(c=>{const us=used(c);return`<div class="eq-cfg"><b>${E(c.name)}</b><div class="eq-w">${chipsW(c.w)||'<span class="mu">aucune arme</span>'}</div><small>${us.length?"Dans : "+E(us.join(", ")):"Dans aucune de tes listes"}</small></div>`}).join("")}</div>`:""}
 ${consBlock(p,true)}</div>`}
function listSection(u){const v=vOf(u),L=LV[v.st];
 return`<div class="eq-sec" data-eqsec="list"><div class="sech">⚙ Équipement de l'unité <span class="eq-b ${v.st}">${L[0]} ${L[1]}</span></div>
 <div class="eq-sum">${v.lines.length?v.lines.map(l=>`<div>${E(l.t)}</div>`).join(""):'<span class="mu">Aucun équipement.</span>'}</div>
 ${v.issues.length?`<div class="eq-is">${v.issues.map(i=>`<div class="eq-i ${i.lvl}"><span>${i.lvl==="red"?"⛔":"⚠"} ${E(i.msg)}</span>${i.m&&i.m.length?`<button class="b" data-eq="fix" data-m="${i.m[0]}">Corriger</button>`:""}</div>`).join("")}</div>`:'<p class="eq-ok">Toutes les contraintes connues sont respectées.</p>'}
 <div class="eq-row"><button class="b p" data-eq="cfg">Configurer les figurines (${EQ.sizeOf(u)})</button></div>
 <details class="eq-dr"><summary><span>🧰 Ce que cette unité peut équiper</span><em>Qui peut porter quoi</em></summary><div class="eq-cb">${equipMenu(primOf(u)||u)}</div></details>
 ${consBlock(u,false)}</div>`}
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
 ${consBlock(u,false)}
 <div class="eq-row"><button class="b" data-eq="reset">↺ Répartition automatique</button><button class="b p" data-eq="close">Terminer</button></div></div>`;
 if(SHT.focus>=0){const el=document.getElementById("eqm"+SHT.focus);if(el&&el.scrollIntoView)el.scrollIntoView({block:"center"})}}
function setModels(M){const u=SHT.u;EQ.applyModels(u,M,poolOf(u));sv();drawSheet()}
function curModels(){const u=SHT.u;return vOf(u).models.m.map(m=>({r:m.r,w:m.w.slice()}))}
function onSheet(e){const b=e.target.closest&&e.target.closest("[data-eq]");if(!b){if(e.target.id==="eqs")closeSheet();return}const k=b.dataset.eq;
 if(CACT.includes(k)){if(SHT&&SHT.u)consAction(k,b,SHT.u);return}
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
const CACT=["cedit","ccancel","csave","ctog","crest","crm","cfm","cfix","cnew"];
const snap=c=>JSON.parse(JSON.stringify({t:c.t,w:c.w,ws:c.ws,n:c.n,per:c.per,role:c.role,min:c.min,max:c.max,st:c.st,src:c.src}));
function logChange(u,m){S.eqlog=S.eqlog||[];S.eqlog.push({k:EQ.consKey(u),m,t:Date.now()});if(S.eqlog.length>300)S.eqlog=S.eqlog.slice(-300)}
function rerender(){if(SHT&&SHT.u)drawSheet();else modalRefresh();try{decorate()}catch(_){}}
function announce(u,msg){let t=msg;try{const k=EQ.consKey(u),us=[];(S.lists||[]).forEach(l=>(l.units||[]).forEach(x=>{if(EQ.consKey(x)===k)us.push(x)}));if(us.length){const w=us.map(x=>vOf(x).st),st=w.includes("red")?"red":w.includes("orange")?"orange":"green";t+=" · "+LV[st][0]+" "+LV[st][1]}}catch(_){}toast(t)}
function readForm(root){const g=n=>{const el=root.querySelector('[data-eqf="'+n+'"]');return el?el.value:""},t=g("t"),c={t};
 if(t==="max"||t==="min"||t==="role"){c.w=g("w");c.n=Math.max(1,parseInt(g("n"),10)||1);if(!c.w)return{err:"Choisis un équipement"}}
 if(t==="max")c.per=Math.max(0,parseInt(g("per"),10)||0);
 if(t==="role")c.role=g("role").trim()||"Sergent";
 if(t==="excl"){const a=g("w"),b=g("w2");if(!a||!b||EQ.same(a,b))return{err:"Choisis deux équipements différents"};c.ws=[a,b]}
 if(t==="size"){c.min=Math.max(1,parseInt(g("min"),10)||1);c.max=Math.max(c.min,parseInt(g("max"),10)||c.min)}
 return c}
function consAction(k,b,u){if(!u)return;const p=primOf(u)||u,cons=EQ.consOf(S,p),id=b.dataset.id,c=id?cons.find(x=>x.id===id):null,root=document.getElementById("eqs")||document;
 if(k==="cnew"){EDI="new";rerender();return}
 if(k==="ccancel"){EDI=null;rerender();return}
 if(k==="cedit"&&c){EDI=c.id;rerender();return}
 if(k==="cfix"){const n=EQ.addCons(S,p,{t:"fixed",st:"user",ok:1,manual:1,src:{doc:"Saisie utilisateur"}});FLASH=n[n.length-1].id;logChange(p,"Ajoutée : Aucune option d'équipement");sv();rerender();announce(u,"Restriction ajoutée");return}
 if(k==="csave"){const f=b.closest(".eq-f")||root,v=readForm(f);if(v.err){toast(v.err);return}
  if(c){const was=EQ.describe(c);if(!c.orig&&!c.manual)c.orig=snap(c);const keep={id:c.id,orig:c.orig,manual:c.manual,src:c.src};["w","ws","n","per","role","min","max"].forEach(x=>delete c[x]);Object.assign(c,v);c.id=keep.id;if(keep.orig)c.orig=keep.orig;c.manual=keep.manual;c.st="user";c.ok=1;c.mod=1;c.src=keep.manual?keep.src:{doc:"Modifiée par l'utilisateur"};delete c.off;
   FLASH=c.id;logChange(p,"Modifiée : "+was+" → "+EQ.describe(c))}
  else{const n=EQ.addCons(S,p,Object.assign(v,{st:"user",ok:1,manual:1,src:{doc:"Saisie utilisateur"}}));FLASH=n[n.length-1].id;logChange(p,"Ajoutée : "+EQ.describe(n[n.length-1]))}
  EDI=null;sv();rerender();announce(u,c?"Restriction modifiée":"Restriction ajoutée");setTimeout(()=>{FLASH=null},2200);return}
 if(!c)return;
 if(k==="ctog"){c.off=!c.off;FLASH=c.id;logChange(p,(c.off?"Désactivée : ":"Réactivée : ")+EQ.describe(c));sv();rerender();announce(u,c.off?"Restriction désactivée":"Restriction réactivée");setTimeout(()=>{FLASH=null},2200);return}
 if(k==="cfm"){c.ok=1;FLASH=c.id;logChange(p,"Confirmée : "+EQ.describe(c));sv();rerender();announce(u,"Restriction confirmée");setTimeout(()=>{FLASH=null},2200);return}
 if(k==="crest"&&c.orig){const was=EQ.describe(c);["w","ws","n","per","role","min","max"].forEach(x=>delete c[x]);Object.assign(c,c.orig);delete c.orig;delete c.mod;delete c.off;c.ok=0;FLASH=c.id;logChange(p,"Valeur officielle rétablie : "+was+" → "+EQ.describe(c));sv();rerender();announce(u,"Valeur officielle rétablie");setTimeout(()=>{FLASH=null},2200);return}
 if(k==="crm"){if(DEL!==c.id){DEL=c.id;rerender();setTimeout(()=>{if(DEL===c.id){DEL=null;if(document.querySelector(".eq-sec,#eqs"))rerender()}},3500);return}
  DEL=null;logChange(p,"Supprimée : "+EQ.describe(c));EQ.rejectCons(S,p,c.id);sv();rerender();announce(u,"Restriction supprimée");return}}
/* ---------- actions fiches / restrictions ---------- */
function curU(){return typeof ed!=="undefined"?ed:null}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-eq]");if(!b||b.closest("#eqs"))return;const k=b.dataset.eq,u=curU();
 if(k==="cfg"&&u){e.stopPropagation();openSheet(u);return}
 if(k==="fix"&&u){e.stopPropagation();openSheet(u,+b.dataset.m);return}
 if(k==="army"){e.stopPropagation();const L=cl();if(L)armyPanel(L);return}
 if(k==="goto"){e.stopPropagation();const m=document.querySelector(".eq-menu");if(m)m.scrollIntoView({behavior:"smooth",block:"start"});return}
 if(CACT.includes(k)){e.stopPropagation();consAction(k,b,u);return}},true);
document.addEventListener("change",e=>{const t=e.target;if(t.dataset&&t.dataset.eqf==="t"){const f=t.closest(".eq-f");if(!f)return;const fs=FIELDS[t.value]||[];f.querySelectorAll("[data-eqrow]").forEach(r=>{r.hidden=!fs.includes(r.dataset.eqrow)})}});
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
   if(!sub){const h=co?collSection(u):listSection(u),sv2=pn.querySelector(".sv");if(sv2)sv2.insertAdjacentHTML("beforebegin",h);else pn.insertAdjacentHTML("beforeend",h);if(co&&!pn.querySelector(".eq-go")){const tp=pn.querySelector(".top");if(tp)tp.insertAdjacentHTML("afterend",'<button class="b p eq-go" data-eq="goto" style="width:100%;margin:8px 0;min-height:46px">🧰 Ce que je peux équiper ↓</button>')}}}}
 const m=document.getElementById("m");
 if(m&&typeof tab!=="undefined"){
  if(tab==="units"){const L=typeof cl==="function"?cl():null;if(L&&L.units&&L.units.length){const g=m.querySelector(".grid");
    if(g&&!m.querySelector(".eq-army")){g.insertAdjacentHTML("beforebegin",armyBanner(L))}
    else if(m.querySelector(".eq-army")){const ar=m.querySelector(".eq-army"),n=armyBanner(L);if(ar.outerHTML!==n){const t=document.createElement("div");t.innerHTML=n;ar.replaceWith(t.firstChild)}}
    m.querySelectorAll('.card.hv[data-act="view"][data-i]').forEach(c=>{const u=L.units[+c.dataset.i];if(!u)return;const v=vOf(u),x=LV[v.st];let d=c.querySelector(".eq-dot");if(!d){d=document.createElement("span");d.className="eq-dot";const nb=c.querySelector("b.cap");if(nb)nb.after(d)}if(d.dataset.s!==v.st){d.dataset.s=v.st;d.textContent=x[0];d.title="Équipement : "+x[1]}})}}
  if(tab==="coll"){m.querySelectorAll('[data-act="cview"][data-r]').forEach(c=>{const p=S.coll[c.dataset.r];if(!p||!p.cfgs||p.cfgs.length<2||c.querySelector(".eq-cf"))return;const s=document.createElement("span");s.className="eq-cf";s.textContent=p.cfgs.length+" configurations";const t=c.querySelector("b.cap,.tn");if(t&&t.parentNode)t.parentNode.insertBefore(s,t.nextSibling)});
   if(!m.querySelector(".eq-bk")){const bk=getBackup();m.insertAdjacentHTML("beforeend",`<div class="card eq-bk"><b>🧰 Regroupement des variantes d'armes</b><p class="mu" style="margin:4px 0">Les unités à plusieurs configurations d'armes sont regroupées en une seule fiche. Aucune donnée n'est supprimée.${bk?" Sauvegarde faite le "+new Date(bk.ts).toLocaleString("fr-FR")+".":""}</p>${S.eqoff?'<button class="b p" data-eqx="redo">Regrouper à nouveau</button>':bk?'<button class="b" data-eqx="restore">Restaurer la sauvegarde d\'avant le regroupement</button>':""}<div class="eq-row"><label class="b p" style="cursor:pointer;display:inline-flex;align-items:center">📥 Importer des fiches officielles (PDF)<input type="file" accept="application/pdf,.pdf" multiple data-eqpdf="1" hidden></label></div>${impList()}<div class="eq-row"><button class="b" data-eqx="exp">⬇ Exporter mes restrictions (.json)</button><label class="b" style="cursor:pointer;display:inline-flex;align-items:center">⬆ Importer des restrictions<input type="file" accept=".json,application/json" data-eqj="1" hidden></label></div><p class="mu" style="margin:4px 0 0;font-size:12px">Toutes les restrictions (officielles, lues dans tes PDF, ou saisies par toi) sont gardées sur ton téléphone. Exporte-les pour les conserver ou les transférer.</p></div>`)}}}
 if(typeof tab!=="undefined"&&tab==="play"){const L=typeof cl==="function"?cl():null;if(L)document.querySelectorAll('#pl .puh[data-k^="u:"]').forEach(h=>{const i=+h.dataset.k.split(":")[2],u=L.units[i];if(!u)return;const v=vOf(u),x=LV[v.st];let d=h.querySelector(".eq-dot");if(!d){d=document.createElement("span");d.className="eq-dot";const nb=h.querySelector("b.cap");if(nb)nb.after(d)}if(d.dataset.s!==v.st){d.dataset.s=v.st;d.textContent=x[0];d.title="Équipement : "+x[1]}})}
 }catch(e){console.warn("eq decorate",e)}finally{busy=false}}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-eqx]");if(!b)return;e.stopPropagation();const k=b.dataset.eqx;
 if(k==="restore")ask({t:"Restaurer la sauvegarde ?",p:"Les fiches et les listes reviennent exactement à l'état d'avant le regroupement des variantes. Le regroupement automatique est alors désactivé.",ok:"Restaurer",dg:1},()=>{restore();toast("Sauvegarde restaurée")});
 if(k==="exp"){exportR();return}
 if(k==="clrimp"){ask({t:"Supprimer les fiches importées ?",p:"Les fiches officielles lues dans tes PDF sont retirées de la mémoire. Les restrictions déjà appliquées à tes unités restent, tu peux les modifier.",ok:"Supprimer",dg:1},()=>{delete S.eqimp;sv();toast("Fiches supprimées")});return}
 if(k==="redo"){migrate(true);sv();try{draw()}catch(_){}toast("Variantes regroupées")}},true);
function officialCard(e){const base=(e.def||[]).map(w=>`<span>${E(EQ.S1(w))}</span>`).join("")||'<span class="mu">inconnu</span>';
 return`<div class="eq-base"><b>🔹 Équipement de base</b><div class="eq-w">${base}</div></div>${(e.opt||[]).length?`<div class="eq-oc-g" style="margin-top:8px">${e.opt.map(r=>`<div class="eq-oc"><div class="eq-oh"><span>${r.t==="repl"?"🔁":"➕"}</span><b>${E(EQ.toText(r))}</b></div><div class="eq-ol"><i>👥 Qui</i> ${E(EQ.whoText(r))}</div>${r.t==="repl"?`<div class="eq-ol"><i>🔁 Remplace</i> ${E((r.from||[]).map(EQ.S1).join(" ou "))}</div>`:""}</div>`).join("")}</div>`:'<p class="mu">Aucune option d\'équipement.</p>'}${e.x?`<p class="eq-w2" style="margin:6px 0 0">⚠ ${e.x} option(s) complexe(s) non reprise(s) automatiquement : à vérifier dans le document (page ${e.p}).</p>`:""}`}
function impList(){const imp=S.eqimp&&S.eqimp.units?Object.values(S.eqimp.units):[];if(!imp.length)return'<p class="mu" style="margin:6px 0">Importe un PDF de fiches officielles (anglais ou français) : les options d\'équipement de chaque figurine sont lues et gardées, même pour les unités que tu n\'as pas.</p>';
 return`<details class="eq-dr"><summary><span>📚 Fiches officielles en mémoire (${imp.length})</span><em>${(S.eqimp.meta&&S.eqimp.meta.sources||[]).length} PDF importé(s)</em></summary><div class="eq-cb">${imp.sort((a,b)=>a.n.localeCompare(b.n)).map(e=>`<details class="eq-add"><summary>${E(e.n)} <span class="mu" style="font-weight:400">· p.${e.p}</span></summary>${officialCard(e)}</details>`).join("")}<div class="eq-row"><button class="b x" data-eqx="clrimp">🗑 Supprimer les fiches importées</button></div></div></details>`}
async function importPdfs(files){if(!files||!files.length)return;if(typeof pdfLib!=="function"||!window.EQPDF){toast("Lecteur de PDF indisponible");return}
 toast("Lecture du PDF…");let lib;try{lib=await pdfLib()}catch(_){ask({t:"Lecteur de PDF indisponible",p:"Le lecteur de PDF n'a pas pu se charger (connexion ?). Réessaie quand il est disponible.",ok:"OK"},()=>{});return}
 S.eqimp=S.eqimp&&S.eqimp.units?S.eqimp:{meta:{sources:[]},units:{}};let tot=0,opts=0,cx=0,none=0;const names=[];
 for(const f of files){try{const doc=await lib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise,pages=[];for(let n=1;n<=doc.numPages;n++){const pg=await doc.getPage(n),tc=await pg.getTextContent();pages.push(tc.items)}
  const nm=f.name.replace(/\.pdf$/i,""),us=window.EQPDF.parsePages(pages,{file:nm});Object.entries(us).forEach(([k,e])=>{e.doc=nm;S.eqimp.units[k]=e;tot++;opts+=e.opt.length;cx+=e.x;if(e.none&&!e.opt.length)none++;names.push(e.n)});
  const src=S.eqimp.meta.sources.find(s=>s.file===nm);const d=new Date().toLocaleDateString("fr-FR");if(src)src.date=d;else S.eqimp.meta.sources.push({file:nm,doc:nm,date:d})}catch(e){toast("PDF illisible : "+f.name)}}
 if(!tot){ask({t:"Aucune fiche trouvée",p:"Ce PDF ne contient pas de fiches d'unité avec « Wargear options / Unit composition » lisibles (PDF scanné ou autre format).",ok:"OK"},()=>{});return}
 try{EQ.regroup(S)}catch(_){}sv();const mine=names.filter(n=>Object.values(S.coll||{}).some(m=>EQ.nk(EQ.nn(m.name))===EQ.nk(n))).length;
 try{draw()}catch(_){}
 ask({t:tot+" fiche"+(tot>1?"s":"")+" officielle"+(tot>1?"s":"")+" lue"+(tot>1?"s":""),p:`${opts} option${opts>1?"s":""} d'équipement enregistrée${opts>1?"s":""} ; ${none} unité${none>1?"s":""} sans option.${cx?" "+cx+" phrase"+(cx>1?"s":"")+" trop complexe"+(cx>1?"s":"")+" pour être lue"+(cx>1?"s":"")+" (signalée"+(cx>1?"s":"")+" « à vérifier »).":""} ${mine?mine+" correspond"+(mine>1?"ent":"")+" à ta collection : restrictions appliquées.":"Aucune ne correspond à ta collection pour l'instant : elles sont gardées en mémoire et s'appliqueront dès que tu ajouteras ces unités."}`,ok:"OK"},()=>{})}
document.addEventListener("change",e=>{const t=e.target;if(t&&t.dataset&&t.dataset.eqpdf==="1"){const fs=[...(t.files||[])];t.value="";importPdfs(fs)}});
function exportR(){try{const d=JSON.stringify({app:"armees40k",v:1,kind:"restrictions",exp:new Date().toISOString(),eqc:S.eqc||{},eqx:S.eqx||[],eqlog:S.eqlog||[]},null,1),b=new Blob([d],{type:"application/json"}),url=URL.createObjectURL(b),a=document.createElement("a");a.href=url;a.download="restrictions-armees40k.json";document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},800);toast("Restrictions exportées")}catch(e){toast("Export impossible : "+e.message)}}
function importR(file){const rd=new FileReader();rd.onload=()=>{try{const j=JSON.parse(rd.result);if(!j||j.kind!=="restrictions"||typeof j.eqc!=="object")throw new Error("fichier non reconnu");S.eqc=S.eqc||{};let n=0;Object.entries(j.eqc).forEach(([k,a])=>{const cur=S.eqc[k]=S.eqc[k]||[],have=new Set(cur.map(EQ.sig));(a||[]).forEach(c=>{if(c&&c.t&&!have.has(EQ.sig(c))){c.id=c.id||EQ.cid();cur.push(c);have.add(EQ.sig(c));n++}})});S.eqx=[...new Set((S.eqx||[]).concat(j.eqx||[]))];sv();toast(n+" restriction(s) importée(s)");try{draw()}catch(_){}}catch(e){toast("Import impossible : "+e.message)}};rd.readAsText(file)}
document.addEventListener("change",e=>{const t=e.target;if(t&&t.dataset&&t.dataset.eqj==="1"){if(t.files&&t.files[0])importR(t.files[0]);t.value=""}});
let tmr=null;const obs=new MutationObserver(()=>{if(busy)return;clearTimeout(tmr);tmr=setTimeout(decorate,60)});
function start(){obs.observe(document.body,{childList:true,subtree:true});decorate()}
/* nouvelle unité ajoutée à la main : choisir l'équipement */
function manualAdd(n,m){try{const cfg=m&&m.cfgs&&m.cfgs[0];if(!n.eq)delete n.eq;const note=m&&m.cfgs&&m.cfgs.length>1?"Choisis l'équipement de cette unité : "+m.cfgs.map(c=>c.name).join(" / ")+".":"Vérifie l'équipement de cette unité.";if((m&&m.eqw&&m.eqw.length>EQ.poolOf(n).length)||consOf(n).length)setTimeout(()=>openSheet(n,-1,note),60)}catch(_){}}
window.EQUI={migrate,restore,backup,getBackup,openSheet,decorate,manualAdd,primOf,vOf,consOf,poolOf,decor:decorate};
try{migrate();sv()}catch(e){console.warn("eq migrate",e)}
start();
})();
