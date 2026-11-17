/* ---------- mises à jour : détail, propagation, nouvelles fiches, nouveautés, modifications de l'utilisateur ---------- */
/* Journal de l'application (écrit à la main, plus récent d'abord). id croissant. */
const APPLOG=[
 {id:27,d:"2026-11-17",t:"Noms français officiels : toutes les factions",s:"Les noms français d'unités confirmés par l'Inventaire du Munitorum et des articles officiels de Games Workshop France sont ajoutés pour Astra Militarum, Custodes, Sororitas, Agents impériaux, Mechanicus, Chevaliers, Chevaliers Gris, T'au, Aeldari, Drukhari, Chaos, Death Guard, Thousand Sons, World Eaters, Enfants de l'Empereur, Démons, Tyranides, Cultes Genestealers et Votann. Les cas incertains sont « à vérifier »."},
 {id:26,d:"2026-11-17",t:"Noms français Space Marines et chapitres",s:"145 noms français Space Marines (génériques, Ultramarines, Blood Angels, Dark Angels, Space Wolves, Black Templars, Deathwatch…) enregistrés tels quels depuis ta liste et affichés en français ; les noms anglais restent pour la recherche et la fiche originale."},
 {id:25,d:"2026-11-17",t:"Noms français Orks/Nécrons : liste utilisée telle quelle",s:"Les noms français de ta liste Orks et Nécrons sont enregistrés tels quels, sans vérification, et affichés en français ; les noms anglais restent pour la recherche et la fiche originale."},
 {id:24,d:"2026-11-17",t:"Listes de noms français Orks et Nécrons",s:"Tes listes de noms français sont enregistrées avec les noms anglais conservés : les noms confirmés par une source officielle restent « confirmés », les autres sont « à vérifier ». La recherche accepte les deux langues."},
 {id:23,d:"2026-11-17",t:"Noms français officiels (Nécrons, Orks) et ~2 700 noms traduits",s:"Noms d'unités confirmés par des sources françaises de Games Workshop (ex. Guerriers Nécrons, Immortels, Boss de Guerre, Médiko) ; les cas moins sûrs restent en « à vérifier ». Environ 2 700 noms de capacités, stratagèmes, améliorations et détachements traduits (propositions à vérifier) ; les noms propres et le jargon ork restent en anglais."},
 {id:22,d:"2026-11-17",t:"Unification des fiches et noms français",s:"Les fiches de ta collection sont rapprochées automatiquement de la bibliothèque quand la correspondance est certaine (sauvegarde avant, restauration possible dans Gérer la bibliothèque). Les noms français viennent de tes fiches ou de tes corrections, jamais inventés. Dans Modifier une fiche : statuts, correction du nom français et bouton « Voir la fiche en anglais » (consultation seule). La recherche accepte anglais et français."},
 {id:21,d:"2026-11-17",t:"Lier une fiche depuis le constructeur",s:"Dans le catalogue du constructeur, les fiches de ta collection non liées sont marquées « 🔗 à lier ». En ouvrant l'une d'elles, tu peux la lier à la bibliothèque directement : le lien est valable partout dans l'appli (collection, listes, mode jeu) et l'écran se met à jour avec les effectifs et coûts."},
 {id:20,d:"2026-11-17",t:"Appui et bouton Enregistrer",s:"Tu peux maintenant ajouter un appui (en plus du meneur) à une unité pendant la création de liste. La dernière étape n'a plus de boutons d'export : un seul bouton « Enregistrer la liste »."},
 {id:19,d:"2026-11-17",t:"Avertissement « À traduire »",s:"Quand le traducteur n'arrive pas à traduire un texte (nouvelle règle, nouveau stratagème…), une tuile « ⚠ À traduire » apparaît sur l'accueil avec le nombre de textes. Tu écris ou corriges la traduction, tu l'enregistres, et elle est utilisée partout et apprise par le traducteur. Une recherche permet aussi de corriger n'importe quelle traduction existante."},
 {id:18,d:"2026-11-17",t:"Traduction : équipements, mots-clés et traducteur hors ligne amélioré",s:"45 textes d'équipement traduits en français, nouveaux mots-clés d'unités et d'armes en français, et traducteur automatique hors ligne renforcé (mémoire par propositions, accords masculin/féminin, signes + et − conservés). Les noms d'unités et d'armes restent en anglais."},
 {id:17,d:"2026-11-17",t:"Création d'armée en 4 onglets",s:"Chaque étape a sa propre page : 1 Armée (faction, taille, détachements), 2 Règles (mission principale et règle de faction), 3 Unités, 4 Vérifier. Boutons « Suivant » en bas de chaque page."},
 {id:16,d:"2026-11-17",t:"Interface simplifiée",s:"Création d'armée repensée : une seule « prochaine étape » affichée, bouton Ajouter une unité en premier, réglages (faction, limite, détachements) repliés une fois remplis, total de points toujours visible en haut, boutons plus grands et textes plus lisibles."},
 {id:15,d:"2026-11-17",t:"Constructeur guidé et points de détachement",s:"Parcours en étapes avec aides pour débutants, plusieurs détachements tant qu'il reste des points de détachement (500 pts = 1, 1 000 = 2, 2 000 = 3), et règle d'armée principale toujours visible (Doctrines de combat, Waaagh!, Protocoles de réanimation)."},
 {id:14,d:"2026-11-17",t:"Missions principales et règle de faction",s:"Les détachements de toutes les factions indiquent leurs Forces Dispositions (Wahapedia) : tu choisis la mission principale de ton armée, avec les missions selon l'adversaire. La règle de faction est notée sur l'armée et lisible dans la liste et le mode jeu."},
 {id:13,d:"2026-11-17",t:"Constructeur d'armée",s:"Catalogue visuel (collection et bibliothèque, une seule carte par unité), effectifs et paliers de points V11, armes compactes, équipements payants, meneurs, détachements, optimisations, récapitulatif, export PDF et JSON, et mise à jour des points avec différences."},
 {id:12,d:"2026-11-17",t:"Mises à jour automatiques et onglet Nouveautés",s:"À chaque lancement, l'appli récupère la dernière version de la bibliothèque et applique les changements à toutes tes fiches et listes. Une fenêtre résume ce qui a changé. L'onglet Nouveautés garde tout, avec des tiroirs modifiables."},
 {id:11,d:"2026-11-17",t:"Traduction qui apprend",s:"Le lexique est appris des traductions déjà présentes. Une phrase proche d'une phrase connue est adaptée, et chaque traduction que tu valides enrichit la mémoire."},
 {id:10,d:"2026-11-17",t:"Mise à jour gratuite sur GitHub",s:"Chaque jour, GitHub récupère les nouveautés de Wahapedia et d'Oracle et les publie, sans dépendre de l'abonnement."},
 {id:9,d:"2026-11-16",t:"Création d'armée par faction",s:"Tu choisis d'abord une ou plusieurs factions (ou un chapitre Space Marines), puis toutes leurs figurines : collection et bibliothèque. La fiche s'ouvre avec les armes à cocher."},
 {id:8,d:"2026-11-16",t:"Options d'équipement",s:"Chaque fiche liée garde l'équipement de base, les options et les restrictions, en texte simple, dans un tiroir fermé de base. Tu peux ajouter tes propres notes dans Modifier."},
 {id:7,d:"2026-11-15",t:"Lier à la version anglaise",s:"Un clic lie la fiche, ajoute les armes manquantes (sans doublon grâce à la comparaison des chiffres et des noms) et enregistre les options d'équipement."},
 {id:6,d:"2026-11-15",t:"Fusion à l'import",s:"Les fiches créées depuis la bibliothèque sont fusionnées avec tes imports PDF ou texte, après ta validation, en gardant toujours le texte français."},
 {id:5,d:"2026-11-14",t:"Toutes les factions V11",s:"1 623 fiches de 24 factions (dont les Necrons) depuis Wahapedia, avec une recherche dans la collection pour créer une fiche en un clic."},
 {id:4,d:"2026-11-13",t:"Traductions françaises",s:"Plus de 9 000 textes traduits (armes, aptitudes, stratagèmes…), marqués « à vérifier », avec un bouton pour tout valider."},
 {id:3,d:"2026-11-12",t:"Bibliothèque V11",s:"Fiches Space Marines et Orks, détachements, stratagèmes et améliorations, hors ligne, avec sauvegarde et contrôle d'intégrité."},
 {id:2,d:"2026-11-11",t:"Import PDF fiabilisé",s:"Lecture des PDF de listes : unités à plusieurs profils (Boyz et Boss Nob), boucliers INV et FAP, stratagèmes, aptitudes."},
 {id:1,d:"2026-11-10",t:"Mode tutoriel",s:"Même menu que le mode jeu, avec des indications pour débuter."}
];
let PREVU={};
/* ----- modifications de l'utilisateur, conservées d'une mise à jour à l'autre ----- */
const OVK={units:"units",detachments:"dets",enhancements:"enh",stratagems:"str"};
function itemOf(key){const i=key.indexOf(":"),kind=key.slice(0,i),id=key.slice(i+1);
 if(kind==="units")return D.byId[id]||null;if(kind==="rules")return D.rules.find(r=>r.n===id)||null;const arr=D[OVK[kind]];return arr?arr.find(x=>x.id===id)||null:null}
function applyOvr(){try{const ov=LB().ovr||{};Object.keys(ov).forEach(key=>{const it=itemOf(key),o=ov[key];if(!it||!o)return;
  if(o.pts!=null&&key.indexOf("units:")===0)it.pts=o.pts;
  if(o.stats&&it.pr&&it.pr[0])Object.assign(it.pr[0],o.stats);
  if(o.ab&&it.ab)it.ab.forEach(a=>{const x=o.ab[nk(a.n)];if(x&&x.d!=null)a.d=x.d});
  ["d","when","tg","fx","rs"].forEach(f=>{if(o[f]!=null)it[f]=o[f]});
  if(o.abd!=null&&it.ab&&typeof it.ab==="object"&&!Array.isArray(it.ab))it.ab.description=o.abd;
  it._ovr=1})}catch(e){try{console.error(e)}catch(_){}}}
/* ----- détail d'un changement de fiche ----- */
const LBLK={units:"fiche",detachments:"détachement",enhancements:"amélioration",stratagems:"stratagème",rules:"règle"};
function unitDiff(o,n){const L=[];if(!o||!n)return L;const fn=x=>tName(String(x.n).replace(/^➤\s*/,"")).t;
 if(o.pts!=null&&n.pts!=null&&+o.pts!==+n.pts)L.push("Points : "+o.pts+" → "+n.pts);
 (n.pr||[]).forEach((p,i)=>{const q=(o.pr||[])[i];if(!q)return;["M","E","SV","PV","CD","CO"].forEach(k=>{const a=statOf(q,k),b=statOf(p,k);if(a!==b)L.push((n.pr.length>1?p.n+" · ":"")+k+" : "+(a||"–")+" → "+(b||"–"))})});
 const mp=u=>new Map([...(u.rw||[]),...(u.mw||[])].map(w=>[nk(w.n),w])),ow=mp(o),nw=mp(n),sg=w=>JSON.stringify([w.r,w.a,w.sk,w.s,w.ap,w.d,w.kw]);
 nw.forEach((w,k)=>{const x=ow.get(k);if(!x)L.push("Arme ajoutée : "+fn(w));else if(sg(x)!==sg(w))L.push("Arme modifiée : "+fn(w))});ow.forEach((w,k)=>{if(!nw.has(k))L.push("Arme retirée : "+fn(w))});
 const ma=u=>new Map((u.ab||[]).map(a=>[nk(a.n),a])),oa=ma(o),na=ma(n);
 na.forEach((a,k)=>{const x=oa.get(k);if(!x)L.push("Aptitude ajoutée : "+tAB(a.n).t);else if(nk(stripMd(x.d))!==nk(stripMd(a.d)))L.push("Aptitude modifiée : "+tAB(a.n).t)});oa.forEach((a,k)=>{if(!na.has(k))L.push("Aptitude retirée : "+tAB(a.n).t)});
 const ok=new Set(o.kw||[]);(n.kw||[]).forEach(k=>{if(!ok.has(k))L.push("Mot-clé ajouté : "+tKW(k).t)});return L}
/* ----- propagation d'une fiche de bibliothèque vers les fiches de collection et les listes ----- */
function replaceAbility(m,a,lines){try{const names=[nk(a.n),nk(frAbN(a.n))];let parts=[];try{parts=abSplit(m)}catch(_){}
 const i=parts.findIndex(x=>names.includes(nk(x.n)));if(i<0)return false;const nameTxt=parts[i].n;parts[i]={n:nameTxt,b:lines.join(" ").trim()};
 m.text=parts.map(x=>((x.n?x.n+" ":"")+x.b).trim()).filter(Boolean);return true}catch(_){return false}}
function pushUnitToSheet(m,u,old,force){let ch=0;try{const lk=LB().links[m.ref],pi=(lk&&lk.prof)||0,pf=profOf(u,pi),po=old?profOf(old,pi):null;m.stats=m.stats||{};
 ["M","E","SV","PV","CD","CO"].forEach(k=>{const nv=statOf(pf,k),ov=po?statOf(po,k):null,cur=String(m.stats[k]||"").trim();if(nv&&cur!==nv&&(force||!cur||cur===ov)){m.stats[k]=nv;ch++}});
 if(u.pts!=null&&+m.pts!==+u.pts&&(force||!m.pts||(old&&+m.pts===+old.pts))){m.pts=+u.pts;ch++}
 if(old){const mapW=x=>new Map([...(x.rw||[]).map(w=>[nk(w.n),wToApp(w,false)]),...(x.mw||[]).map(w=>[nk(w.n),wToApp(w,true)])]),ow=mapW(old),nw=mapW(u);
  (m.weapons||[]).forEach(w=>{for(const[k,o]of ow){if(wSig(o)===wSig(w)&&nw.has(k)){const n=nw.get(k);if(wSig(n)!==wSig(w)){["range","a","hit","f","pa","d","caps"].forEach(f=>{w[f]=n[f]});ch++}break}}})}
 const oa=new Map(((old&&old.ab)||[]).map(a=>[nk(a.n),a])),have=new Set(String(m.apt||"").split(",").map(t=>nk(t)).filter(Boolean)),apt=String(m.apt||"").split(",").map(t=>t.trim()).filter(Boolean);m.text=Array.isArray(m.text)?m.text:[];
 (u.ab||[]).forEach(a=>{const x=oa.get(nk(a.n)),fr=abLines(a);
  if(!x){if(old&&!have.has(nk(a.n))&&!have.has(nk(fr.name))){apt.push(fr.name);fr.lines.forEach(l=>m.text.push(l));ch++}}
  else if(nk(stripMd(x.d))!==nk(stripMd(a.d))){const t=trDesc(a.d);if(force||t.st==="ok"||t.prop){const body=stripMd(t.st==="ok"?t.t:(t.prop||a.d)).split("\n").map(s=>s.trim()).filter(Boolean);if(replaceAbility(m,a,body))ch++}}});
 m.apt=apt.join(", ");
 const kws=String(m.kw||"").split(",").map(t=>t.trim()).filter(Boolean),hk=new Set(kws.map(nk));(u.kw||[]).forEach(k=>{if(old&&(old.kw||[]).includes(k))return;const t=tKW(k).t;if(t&&!hk.has(nk(t))){kws.push(t);hk.add(nk(t));ch++}});m.kw=kws.join(", ");
 snapEq(m,u,u.wp||{})}catch(e){try{console.error(e)}catch(_){}}return ch}
function pushSheetToLists(m){let n=0;try{(S.lists||[]).forEach(l=>{const fix=p=>{if(!p||p.ref!==m.ref)return;
  const same=JSON.stringify([p.stats,p.apt,p.text,p.kw,p.fkw]),after=JSON.stringify([m.stats,m.apt,m.text,m.kw,m.fkw]);
  if(same!==after){p.stats=clone(m.stats);p.apt=m.apt;p.text=clone(m.text);p.kw=m.kw;p.fkw=m.fkw;n++}
  (p.weapons||[]).forEach(w=>{const c=(m.weapons||[]).find(x=>nk(x.name)===nk(w.name));if(c&&wSig(c)!==wSig(w)){["range","a","hit","f","pa","d","caps"].forEach(f=>{w[f]=c[f]});n++}});(p.subs||[]).forEach(fix)};(l.units||[]).forEach(fix)})}catch(_){}return n}
function unitsOfSheets(){const out=[];Object.values(S.coll||{}).forEach(m=>{const lk=LB().links[m.ref];let u=lk&&D.byId[lk.id];if(!u){const am=autoMatch(m);if(am&&am.level==="ok")u=am.u}if(u)out.push([m,u])});return out}
async function majAfter(news){const lb=LB();let sheets=0,lists=0,created=[];
 try{const pairs=unitsOfSheets();
  news.items.chg.filter(i=>i.k.indexOf("units:")===0).forEach(i=>{const id=i.k.slice(6),u=D.byId[id],old=PREVU[id];if(!u||!old)return;
   pairs.filter(([m,x])=>x.id===id).forEach(([m])=>{if(pushUnitToSheet(m,u,old,false)){sheets++;lists+=pushSheetToLists(m)}})});
  // nouvelles fiches trouvées : on crée la fiche de collection
  const have=new Set(Object.values(S.coll||{}).map(m=>nnm(m.name))),linked=new Set(Object.values(lb.links).map(l=>l.id));
  news.items.add.filter(i=>i.k.indexOf("units:")===0).slice(0,300).forEach(i=>{const u=D.byId[i.k.slice(6)];if(!u||linked.has(u.id)||have.has(nnm(u.n))||have.has(nnm(frName(u.n))))return;const m=createFromLib(u);m.auto=1;created.push(m.name);have.add(nnm(m.name))});
  try{syncAll();snapAll()}catch(_){}
 }catch(e){try{console.error(e)}catch(_){}}
 try{window.BLDSYNC&&window.BLDSYNC()}catch(_){}
 news.prop={sheets,lists};news.created=created.slice(0,50);news.nCreated=created.length;PREVU={};sv()}
/* ----- modification d'une nouveauté par l'utilisateur : enregistrée, appliquée partout ----- */
function saveOvr(key,patch){const lb=LB();lb.ovr=lb.ovr||{};const o=lb.ovr[key]=lb.ovr[key]||{};
 if(patch.ab){o.ab=o.ab||{};Object.assign(o.ab,patch.ab);delete patch.ab}Object.assign(o,patch);if(patch.stats)o.stats=Object.assign({},lb.ovr[key].stats||{},patch.stats);
 const it=itemOf(key);if(!it)return{sheets:0,lists:0};const old=key.indexOf("units:")===0?JSON.parse(JSON.stringify(it)):null;applyOvr();let sheets=0,lists=0;
 if(old){unitsOfSheets().filter(([m,u])=>u.id===it.id).forEach(([m])=>{
   if(pushUnitToSheet(m,it,old,true)||true){sheets++;
    if(patch.ab)Object.keys(o.ab||{}).forEach(k=>{const a=(it.ab||[]).find(x=>nk(x.n)===k);if(a)replaceAbility(m,a,stripMd(o.ab[k].d||"").split("\n").map(s=>s.trim()).filter(Boolean))});
    lists+=pushSheetToLists(m)}})}
 sv();return{sheets,lists}}
/* ----- fenêtre de démarrage : seulement s'il y a du nouveau ----- */
function majSummary(){const lb=LB(),un=lb.news.filter(n=>!n.seen),app=APPLOG.filter(x=>x.id>(lb.appSeen||0));return{un,app}}
function popup(){try{const {un,app}=majSummary();if(!un.length&&!app.length)return;if(window.__majPop)return;window.__majPop=1;css();
 const nn=a=>un.reduce((s,n)=>s+(n.items[a]||[]).length,0),cr=un.reduce((s,n)=>s+(n.nCreated||0),0),sh=un.reduce((s,n)=>s+((n.prop||{}).sheets||0),0),li=un.reduce((s,n)=>s+((n.prop||{}).lists||0),0);
 const names=un.flatMap(n=>n.items.add.concat(n.items.chg)).slice(0,6).map(i=>i.n);
 let h=`<div class="bib-ov" data-bib="bgp"><div class="bib-pn" style="max-height:80vh"><div class="bib-top"><h2>🆕 Mise à jour</h2><button class="b" data-bib="popx">✕</button></div>`;
 if(un.length)h+=`<h4>Bibliothèque</h4><ul style="margin:4px 0;padding-left:18px"><li><b>${nn("add")}</b> nouveauté${nn("add")>1?"s":""} (fiches, règles, stratagèmes…)</li><li><b>${nn("chg")}</b> modification${nn("chg")>1?"s":""}</li>${cr?`<li><b>${cr}</b> fiche${cr>1?"s":""} créée${cr>1?"s":""} dans ta collection</li>`:""}${sh||li?`<li>${sh} fiche${sh>1?"s":""} de collection et ${li} élément${li>1?"s":""} de liste mis à jour</li>`:""}</ul>${names.length?`<p class="bib-meta">${E(names.join(" · "))}${nn("add")+nn("chg")>6?" …":""}</p>`:""}`;
 if(app.length)h+=`<h4>Application</h4><ul style="margin:4px 0;padding-left:18px">${app.slice(0,5).map(x=>`<li><b>${E(x.t)}</b></li>`).join("")}${app.length>5?`<li class="bib-meta">et ${app.length-5} autre${app.length-5>1?"s":""}</li>`:""}</ul>`;
 h+=`<div class="row" style="gap:8px;margin-top:12px"><button class="b" data-bib="popx" style="flex:1">Fermer</button><button class="b p" data-bib="popn" style="flex:2">Voir les nouveautés</button></div></div></div>`;
 box("bibp").innerHTML=h}catch(e){try{console.error(e)}catch(_){}}}
function popClose(go){try{const lb=LB();lb.news.forEach(n=>n.seen=true);lb.appSeen=Math.max(lb.appSeen||0,...APPLOG.map(x=>x.id));sv();closeM("bibp");if(go){tab="news";S.mg=true}draw()}catch(_){}}
/* ----- onglet Nouveautés ----- */
const NW={more:{}};
function itemBody(key,edit){const it=itemOf(key);if(!it)return`<p class="bib-meta">Cette fiche n'est plus dans la bibliothèque.</p>`;const kind=key.split(":")[0];let h="";
 const ed=(t,html)=>`<div class="bib-row"><b>${t}</b><div>${html}</div></div>`;
 if(kind==="units"){const p=it.pr&&it.pr[0]||{};
  if(edit){h+=`<label>Points<input data-nwf="pts" inputmode="numeric" value="${E(it.pts==null?"":it.pts)}"></label><div class="bib-chips" style="flex-wrap:wrap;gap:6px;margin:6px 0">${["M","E","SV","PV","CD","CO"].map(k=>`<label style="flex:1;min-width:52px">${k}<input data-nwf="st:${k}" value="${E(statOf(p,k))}"></label>`).join("")}</div>`;
   h+=(it.ab||[]).map((a,i)=>{const t=trDesc(a.d),tx=stripMd(t.st==="ok"?t.t:(t.prop||a.d));return`<label>${E(tAB(a.n).t)}<textarea data-nwf="ab:${E(nk(a.n))}" rows="4">${E(tx)}</textarea></label>`}).join("")}
  else{h+=`<p class="bib-meta">${E(facLbl(it))}${it.pts!=null?" · "+it.pts+" pts":""}</p><div class="sg">${["M","E","SV","PV","CD","CO"].map(k=>`<div class="sx"><i>${k}</i><b>${E(statOf(p,k)||"–")}</b></div>`).join("")}</div>`;
   const w=[...(it.rw||[]).map(x=>wToApp(x,false)),...(it.mw||[]).map(x=>wToApp(x,true))];if(w.length)h+=`<div class="bib-meta">${w.map(x=>E(x.name)+" ("+E(x.range)+" · A "+E(x.a)+" · "+E(x.hit)+" · F "+E(x.f)+" · PA "+E(x.pa)+" · D "+E(x.d)+")").join("<br>")}</div>`;
   h+=(it.ab||[]).map(a=>{const t=trDesc(a.d);return ed(E(tAB(a.n).t),md2(t.st==="ok"?t.t:(t.prop||a.d)))}).join("")}}
 else{const F=kind==="stratagems"?[["when","Quand"],["tg","Cible"],["fx","Effet"],["rs","Restrictions"]]:kind==="detachments"?[]:[["d","Texte"]];
  if(kind==="detachments"){const d=it.ab&&it.ab.description||"";const t=trDesc(d),tx=stripMd(t.st==="ok"?t.t:(t.prop||d));h+=edit?`<label>${E(it.ab&&it.ab.name||"Règle")}<textarea data-nwf="abd" rows="6">${E(tx)}</textarea></label>`:ed(E(it.ab&&it.ab.name||"Règle de détachement"),md2(tx))}
  else F.forEach(([f,lab])=>{const raw=it[f]||"";if(!raw&&!edit)return;const t=trDesc(raw),tx=stripMd(t.st==="ok"?t.t:(t.prop||raw));h+=edit?`<label>${lab}<textarea data-nwf="${f}" rows="4">${E(tx)}</textarea></label>`:ed(lab,md2(tx))})}
 return h+`<div class="row" style="gap:6px;margin-top:8px">${edit?`<button class="b p" data-bibnw="save" data-k="${E(key)}">✔ Enregistrer</button><button class="b" data-bibnw="view" data-k="${E(key)}">Annuler</button>`:`<button class="b" data-bibnw="edit" data-k="${E(key)}">✎ Modifier</button>`}</div>${it._ovr?`<p class="bib-meta">✎ Modifié par toi : conservé à chaque mise à jour.</p>`:""}`}
function nwItem(i){const k=i.k,kind=k.split(":")[0],lab={units:"Fiche",detachments:"Détachement",enhancements:"Amélioration",stratagems:"Stratagème",rules:"Règle"}[kind];
 return`<details class="bib-nw" data-nwk="${E(k)}"><summary><b>${E(tName(i.n).t)}</b> <span class="bib-meta">${lab}</span></summary><div class="bib-nwb">${(i.d&&i.d.length)?`<ul class="bib-meta" style="margin:4px 0;padding-left:18px">${i.d.slice(0,10).map(x=>`<li>${E(x)}</li>`).join("")}</ul>`:""}<div class="bib-nwc"></div></div></details>`}
function nwView(){css();const lb=LB();
 let h=`<div class="card"><div class="row" style="justify-content:space-between"><b>🆕 Nouveautés</b><span><button class="b" data-bibnw="check">🔄 Vérifier maintenant</button></span></div><p class="bib-meta">${lb.last&&lb.last.ok?"Dernière version : "+E(lb.last.ok):"Version "+E(D.man?D.man.version:"")}${lb.last?" · vérifiée "+fmtD(lb.last.at):""}${lb.last&&lb.last.err?" · ⚠ "+E(lb.last.err):""}</p></div>`;
 h+=`<h3 style="margin:14px 0 6px">📚 Bibliothèque (Wahapedia / Oracle)</h3>`;
 if(!lb.news.length)h+=`<div class="card"><p class="bib-meta">Aucune mise à jour reçue pour l'instant. Les nouveautés apparaîtront ici dès qu'elles seront publiées.</p></div>`;
 lb.news.forEach((n,ni)=>{const g=(arr,title)=>arr.length?`<h4>${title} (${arr.length})</h4>`+arr.slice(0,NW.more[ni+title]?9999:60).map(nwItem).join("")+(arr.length>60&&!NW.more[ni+title]?`<button class="b" data-bibnw="more" data-i="${ni+title}">Afficher les ${arr.length-60} autres</button>`:""):"";
  const add=n.items.add,chg=n.items.chg,del=n.items.del||[];
  h+=`<details class="card" ${ni===0?"open":""}><summary><b>${fmtD(n.at)}</b> · ${add.length} nouveauté${add.length>1?"s":""}, ${chg.length} modification${chg.length>1?"s":""}${n.nCreated?" · "+n.nCreated+" fiche"+(n.nCreated>1?"s":"")+" créée"+(n.nCreated>1?"s":""):""}${n.seen?"":' <span class="bib-st">nouveau</span>'}</summary>
   <p class="bib-meta">Version ${E(n.to||"")}${n.prop&&(n.prop.sheets||n.prop.lists)?" · "+n.prop.sheets+" fiche(s) de collection et "+n.prop.lists+" élément(s) de liste mis à jour":""}</p>
   ${g(add.filter(i=>i.k.indexOf("units:")===0),"➕ Nouvelles fiches")}${g(chg.filter(i=>i.k.indexOf("units:")===0),"✎ Fiches modifiées")}${g(add.filter(i=>i.k.indexOf("units:")!==0),"➕ Nouvelles règles")}${g(chg.filter(i=>i.k.indexOf("units:")!==0),"✎ Règles modifiées")}${del.length?`<h4>Retirées (${del.length})</h4><p class="bib-meta">${E(del.slice(0,12).map(i=>i.n).join(", "))}</p>`:""}</details>`});
 h+=`<h3 style="margin:14px 0 6px">🛠 Application</h3>`+APPLOG.map(x=>`<details class="card bib-nw"><summary><b>${E(x.t)}</b> <span class="bib-meta">${E(x.d)}</span></summary><p>${E(x.s)}</p></details>`).join("");
 try{lb.news.forEach(n=>n.seen=true);lb.appSeen=Math.max(lb.appSeen||0,...APPLOG.map(x=>x.id));sv()}catch(_){}
 return h}
document.addEventListener("toggle",e=>{const d=e.target;if(!d||!d.dataset||!d.dataset.nwk||!d.open)return;const c=d.querySelector(".bib-nwc");if(c&&!c.dataset.done){c.dataset.done=1;c.innerHTML=itemBody(d.dataset.nwk,false)}},true);
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-bibnw]");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.bibnw;
 if(a==="check"){b.disabled=true;b.textContent="Vérification…";const r=await checkUpdate(true);try{toast(r.state==="updated"?"🆕 Mise à jour appliquée":r.state==="same"?"Déjà à jour ✓":r.state==="err"?"⚠ "+r.err:"Hors ligne")}catch(_){}try{draw()}catch(_){}return}
 if(a==="more"){NW.more[b.dataset.i]=1;try{draw()}catch(_){}return}
 const k=b.dataset.k,det=b.closest("details"),c=det&&det.querySelector(".bib-nwc");if(!c)return;
 if(a==="edit")c.innerHTML=itemBody(k,true);
 else if(a==="view")c.innerHTML=itemBody(k,false);
 else if(a==="save"){const patch={},kind=k.split(":")[0];c.querySelectorAll("[data-nwf]").forEach(f=>{const n=f.dataset.nwf,v=f.value;
   if(n==="pts"){const x=parseInt(v,10);if(!isNaN(x))patch.pts=x}else if(n.indexOf("st:")===0){(patch.stats=patch.stats||{})[n.slice(3)]=v.trim()}else if(n.indexOf("ab:")===0){(patch.ab=patch.ab||{})[n.slice(3)]={d:v}}else patch[n]=v});
  const r=saveOvr(k,patch);c.innerHTML=itemBody(k,false);try{toast("Modifié ✓ · "+r.sheets+" fiche(s) et "+r.lists+" élément(s) de liste mis à jour")}catch(_){}try{draw()}catch(_){}}
},true);
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-bib]");if(!b)return;const a=b.dataset.bib;if(a==="popx"||a==="bgp"&&e.target===b){popClose(false);e.stopPropagation()}else if(a==="popn"){popClose(true);e.stopPropagation()}},true);
/* ----- À traduire : textes que le traducteur n'a pas su traduire (avertissement + correction/enregistrement) ----- */
window.XV=window.XV||{};
const TRW={ver:0,key:"",all:[],q:"",more:15,open:{}};
function trwAll(){if(!D.ready||!KPREADY)return TRW.all;const key=(D.man&&D.man.version||"")+"|"+D.units.length+"|"+TRW.ver;if(TRW.key===key)return TRW.all;
 const seen=new Set(),out=[],add=(t,kind,name)=>{t=String(t||"").trim();if(t.length<3||!/[A-Za-z]{3}/.test(t))return;const k=hh(t);if(seen.has(k))return;seen.add(k);let r;try{r=name?tName(t):trDesc(t)}catch(_){return}out.push({k,en:t,kind,name:!!name,todo:r.st!=="ok"&&!r.prop&&!D.fr[k],cur:r.st==="ok"?r.t:(r.prop||"")})};
 D.dets.forEach(d=>{add(d.n,"Nom de détachement",1);if(d.ab)add(d.ab.description,"Règle de détachement");(d.abx||[]).forEach(x=>add(x.description,"Règle de détachement"))});
 D.enh.forEach(e=>{add(e.n,"Nom d'amélioration",1);add(e.d,"Amélioration")});
 D.str.forEach(x=>{add(x.n,"Nom de stratagème",1);[["when","quand"],["tg","cible"],["fx","effet"],["rs","restrictions"]].forEach(([f,l])=>add(x[f],"Stratagème ("+l+")"))});
 (D.rules||[]).forEach(r=>{add(r.n,"Nom de règle",1);add(r.d,"Règle")});
 Object.values(D.frules||{}).forEach(l=>l.forEach(r=>{add(r.n,"Nom de règle de faction",1);add(r.d,"Règle de faction")}));
 D.units.forEach(u=>(u.ab||[]).forEach(a=>add(a.d,"Capacité de "+u.n)));
 TRW.key=key;TRW.all=out;return out}
const trwTodo=()=>trwAll().filter(x=>x.todo);
function trwCard(i){TXM[i.k]={en:i.en,name:i.name};return`<details class="bib-nw" ${TRW.open[i.k]?"open":""} data-trwk="${i.k}"><summary><b>${E(i.kind)}</b> <span class="bib-meta">${E(stripMd(i.en).slice(0,70))}${i.en.length>70?"…":""}</span></summary><div class="bib-nwb"><div class="bib-meta" style="white-space:pre-wrap">${E(stripMd(i.en))}</div><label>Traduction française<textarea data-trwf="${i.k}" rows="${i.name?1:5}" placeholder="Écris la traduction ici">${E(stripMd(i.cur||""))}</textarea></label><div class="row" style="gap:6px"><button class="b p" data-trw="save" data-k="${i.k}">✔ Enregistrer</button></div></div></details>`}
function trwView(){css();const td=trwTodo(),ready=D.ready&&KPREADY;
 let h=`<div class="card"><b>⚠ Textes à traduire</b><p class="bib-meta">${!ready?"Analyse des traductions en cours…":td.length?"Le traducteur n'a pas su traduire <b>"+td.length+"</b> texte"+(td.length>1?"s":"")+". Écris la traduction et touche Enregistrer : elle sera utilisée partout et apprise par le traducteur.":"✅ Tout est traduit. Tu peux quand même rechercher un texte ci-dessous pour le corriger."}</p></div>`;
 if(td.length){h+=`<div class="card"><b>Sans traduction (${td.length})</b>${td.slice(0,TRW.more).map(trwCard).join("")}${td.length>TRW.more?`<button class="b" data-trw="more" style="width:100%;margin-top:8px">Voir plus (${td.length-TRW.more})</button>`:""}</div>`}
 h+=`<div class="card"><b>🔎 Corriger une traduction existante</b><input id="trwq" placeholder="Mot ou phrase (anglais ou français)" value="${E(TRW.q)}" style="width:100%;margin:6px 0">`;
 const q=nk(TRW.q);if(q.length>=3&&ready){const m=trwAll().filter(x=>nk(x.en).includes(q)||nk(x.cur||"").includes(q)).slice(0,12);h+=m.length?m.map(trwCard).join(""):`<p class="bib-meta">Aucun résultat.</p>`}else h+=`<p class="bib-meta">Tape au moins 3 lettres.</p>`;
 return h+`</div>`}
XV.trw=function(){try{if(!D.ready&&!D.err)init();return trwView()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
window.BIBTRW={all:()=>trwAll(),n:()=>{try{return trwTodo().length}catch(_){return 0}}};
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-trw]");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.trw;
 if(a==="more"){TRW.more+=20;try{draw()}catch(_){}return}
 if(a==="save"){const k=b.dataset.k,ta=document.querySelector('[data-trwf="'+k+'"]'),v=ta&&ta.value.trim(),m=TXM[k];if(!v||!m){try{toast("Écris d'abord la traduction")}catch(_){}return}
  const dg=x=>(String(x).match(/\d+/g)||[]).sort().join(",");if(dg(m.en)!==dg(v)&&!confirm("Les nombres ne sont pas les mêmes que dans l'original. Enregistrer quand même ?"))return;
  storeTr(k,v);TRW.ver++;TRW.open={};try{toast("Traduction enregistrée ✓")}catch(_){}try{draw()}catch(_){}}},true);
document.addEventListener("input",e=>{const t=e.target;if(t&&t.id==="trwq"){TRW.q=t.value;clearTimeout(TRW.t);TRW.t=setTimeout(()=>{try{draw();const i=document.getElementById("trwq");if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}}catch(_){}},350)}});
window.XV=window.XV||{};XV.news=function(){try{if(!D.ready&&!D.err)init();return nwView()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
/* ----- lancement : mise à jour automatique puis fenêtre de résumé ----- */
setTimeout(async()=>{try{const lb=LB();await init();
 if(lb.auto&&navigator.onLine&&!(lb.last&&Date.now()-lb.last.at<10*60*1000)){const r=await checkUpdate(false);if(r.state==="updated"){try{draw()}catch(_){}}}
 popup()}catch(_){try{popup()}catch(__){}}},1800);
window.BIBMAJ={unitDiff,saveOvr,applyOvr,majAfter,popup,APPLOG};
