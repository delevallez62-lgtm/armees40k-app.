/* ===== HAMMER · Mode « Partie tutorielle » =====
   Un coach pas à pas posé PAR-DESSUS le Mode jeu existant (aucune règle du mode classique n'est modifiée).
   Toutes les règles affichées viennent des données déjà présentes dans l'appli (encyclopédie V11 + résumé « Apprendre à jouer »).
   100 % local, hors ligne. */
(function(){
"use strict";
if(typeof S==="undefined")return;
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const T=()=>{const t=S.tut=S.tut&&typeof S.tut==="object"?S.tut:{};if(t.step==null)t.step=0;if(!t.done)t.done={};if(!t.lvl)t.lvl="e";if(t.u==null)t.u=0;return t};
const sv=()=>{try{save()}catch(_){}};
/* ---------- données de règles (encyclopédie importée) ---------- */
let RC=null,RT=0;
const RU=()=>{const n=Date.now();if(!RC||n-RT>4000){try{RC=window.__enc.rules().all||{}}catch(_){RC={}}RT=n}return RC};
const R=id=>RU()[id]||null;
const nk=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9+]+/g," ").trim();
const rb=id=>{const r=R(id);return r?`<div class="tt-rule"><b>${E(r.n)}</b><p>${E(r.def)}</p></div>`:`<p class="tt-miss">⚠ La règle « ${E(id)} » n'est pas dans les données importées : information non disponible.</p>`};
const LD=()=>(window.XV&&XV.learnData)||{STEPS:[],PH:[],WT:[],GL:[]};
const learnPh=i=>{const p=LD().PH[i];return p?`<div class="tt-rule tt-lr"><b>${E(String(p[0]).replace(/^\d\s*·\s*/,""))}</b><p>${p[1]}</p></div>`:""};
/* ---------- armée ---------- */
const LST=()=>S.lists.find(l=>l.id===T().list)||null;
const UN=()=>{const L=LST();return L?L.units.filter(u=>u&&u.name):[]};
const ALL=()=>UN().flatMap(u=>[u,...(u.subs||[])]);
const num=x=>{const m=/-?\d+/.exec(String(x==null?"":x));return m?+m[0]:null};
const isMelee=w=>/m[êe]l[ée]e/i.test(String(w.range||""));
const cn=u=>`<b class="cap">${E(u.name)}</b>`;
const kwOf=u=>String(u.kw||"").split(",").map(x=>x.trim()).filter(Boolean);
function pickW(melee,pref){let best=null;ALL().forEach(u=>(u.weapons||[]).forEach(w=>{if(isMelee(w)!==melee)return;const sc=(/^\d+$/.test(String(w.a).trim())?2:0)+(/^\d+$/.test(String(w.f).trim())?2:0)+(/^\d\+$/.test(String(w.hit).trim())?2:0)+(pref&&pref(u)?1:0);if(!best||sc>best.sc)best={u,w,sc}}));return best}
function targetFor(u){const t=ALL().find(x=>x!==u&&x.stats&&num(x.stats.E)!=null&&/\d/.test(String(x.stats.SV||"")));return t||null}
const svOf=s=>{const m=/(\d)\s*\+/.exec(String(s||""));return m?+m[1]:null};
const invOf=s=>{const m=/(\d)\s*\+\+/.exec(String(s||""));return m?+m[1]:null};
function woundNeed(F,Et){if(F>=2*Et)return 2;if(F>Et)return 3;if(F===Et)return 4;if(F*2<=Et)return 6;return 5}
function exAttack(melee){
 const p=pickW(melee,u=>!melee||true);if(!p)return`<p class="tt-miss">Aucune arme ${melee?"de mêlée":"de tir"} trouvée dans cette armée : exemple non disponible.</p>`;
 const {u,w}=p,tg=targetFor(u),A=String(w.a||"").trim(),ct=String(w.hit||"").trim(),F=num(w.f),PA=num(w.pa)||0,D=String(w.d||"").trim();
 let h=`<div class="tt-ex"><b>Exemple avec ta liste</b><p>${cn(u)} attaque avec <b>${E(w.name)}</b> : ${melee?"mêlée":"portée "+E(w.range+(/"|po/.test(w.range)?"":'"'))}, A ${E(A)}, ${melee?"CC":"CT"} ${E(ct||"-")}, F ${E(w.f)}, PA ${E(w.pa)}, D ${E(D)}.</p>`;
 const cible=tg?`<b class="cap">${E(tg.name)}</b> (E ${E(tg.stats.E)}, Sv ${E(tg.stats.SV)})`:`une cible d'exemple (E 4, Sv 3+)`;
 const Et=tg?num(tg.stats.E):4,svv=tg?svOf(tg.stats.SV):3,inv=tg?invOf(tg.stats.SV):null;
 h+=`<p class="mu">Pour l'exemple, imaginons que la cible soit ${cible}.</p><ol class="tt-ol">`;
 h+=`<li><b>Attaques :</b> ${/^\d+$/.test(A)?`${A} attaque${+A>1?"s":""} par figurine qui utilise cette arme.`:`A vaut « ${E(A)} » : on lance d'abord ce dé pour savoir combien d'attaques on obtient.`}</li>`;
 h+=`<li><b>Toucher :</b> ${/^\d\+$/.test(ct)?`un D6 par attaque ; il faut ${E(ct)} ou plus pour toucher.`:`cette arme n'a pas de valeur de touche (« ${E(ct||"-")} ») : lis ses capacités sur la fiche.`}</li>`;
 if(F!=null&&Et!=null){const n=woundNeed(F,Et);h+=`<li><b>Blesser :</b> Force ${F} contre Endurance ${Et} → il faut <b>${n}+</b>.</li>`}else h+=`<li><b>Blesser :</b> on compare la Force de l'arme à l'Endurance de la cible (valeurs non numériques ici).</li>`;
 if(svv!=null){let need=svv-PA;let t=`la cible sauvegarde sur ${svv}+ ; avec PA ${PA}, il lui faut <b>${need>6?"plus de 6 (impossible)":need+"+"}</b> sur son dé.`;if(inv)t+=` Elle a aussi une sauvegarde invulnérable ${inv}++ (non modifiée par la PA).`;h+=`<li><b>Sauvegarde :</b> ${t}</li>`}
 h+=`<li><b>Dégâts :</b> chaque attaque non arrêtée retire ${E(D)} PV à une figurine de l'unité visée.</li></ol><button class="b" data-tt="wpn" data-m="${melee?1:0}">🎲 Essayer cette arme au lanceur de dés</button></div>`;return h}
/* ---------- missions ---------- */
const jp=v=>{if(Array.isArray(v))return v;try{const x=JSON.parse(v);return Array.isArray(x)?x:[]}catch(_){return[]}};
function gameRec(){try{const g=S.bat&&S.bat.gid;return g?S.games.find(x=>x.id===g)||null:null}catch(_){return null}}
function missionOf(){const r=gameRec(),m=r&&r.p&&r.p[0]&&r.p[0].mission;if(!m)return null;const d=(window.__msd||[]).find(x=>x.id===m.mid)||null;return{cat:m,data:d}}
function condHtml(d){const c=jp(d.cond);if(!c.length)return"";return`<ul class="tt-ul">${c.map(x=>`<li>${E(x.tx||"")} <span class="mu">— ${E(x.w||"")} ${x.rd?"(round"+(x.rd.length>1?"s":"")+" "+x.rd.join(", ")+")":""}</span> <b>${x.pts!=null?x.pts+" pt"+(x.pts>1?"s":""):""}</b></li>`).join("")}</ul>`}
const CATFR={"take-and-hold":"Prendre et Tenir","purge-the-foe":"Éliminez l'Adversaire","disruption":"Perturbation","reconnaissance":"Reconnaissance"};
function easiest(){const a=(window.__msd||[]).map(m=>({m,s:jp(m.cond).length+jp(m.setup).length*2+jp(m.act).length*3+jp(m.rules).length*2})).sort((x,y)=>x.s-y.s);return a[0]||null}
/* ---------- étapes ---------- */
const doL=a=>`<ul class="tt-do">${a.map(x=>`<li>${x}</li>`).join("")}</ul>`;
const abilIn=(re,lbl)=>{const out=[];ALL().forEach(u=>{const t=(u.text||[]).join(" ");let m=re.exec(t);if(m){const i=Math.max(0,m.index-90);out.push(`<li>${cn(u)} : « …${E(t.slice(i,m.index+150).trim())}… »</li>`)}});return out.length?`<div class="tt-ex"><b>${lbl}</b><ul class="tt-ul">${out.slice(0,5).join("")}</ul></div>`:""};
const stratsFor=ph=>{const L=LST();if(!L||typeof phRe!=="function")return 0;const re=phRe(ph);return(L.strats||[]).filter(s=>re.test(s.name+" "+s.body)).length};
const phBtn=(ph)=>{const n=stratsFor(ph);return`<button class="b" data-tt="strat" data-ph="${ph}">⚡ Stratagèmes de cette phase (${n})</button>`};
const STATX=[
 ["M","Mouvement",u=>`${E(u.stats.M)}" : en mouvement normal, l'unité peut parcourir <b>jusqu'à ${E(u.stats.M)} pouces</b>.`,"gen-ph-mvt"],
 ["E","Endurance",u=>`${E(u.stats.E)} : c'est la résistance de l'unité. On la compare à la <b>Force</b> de l'arme qui la touche pour savoir ce qu'il faut obtenir au dé pour la blesser.`,"gen-blessure"],
 ["SV","Sauvegarde",u=>`${E(u.stats.SV)} : le dé de sauvegarde doit atteindre cette valeur pour arrêter une attaque. La <b>PA</b> de l'arme fait baisser ce dé.${invOf(u.stats.SV)?` La valeur « ${invOf(u.stats.SV)}++ » est une sauvegarde invulnérable, que la PA ne modifie pas.`:""}`,"gen-svg"],
 ["PV","Points de vie",u=>`${E(u.stats.PV)} : chaque figurine peut encaisser ${E(u.stats.PV)} point${num(u.stats.PV)>1?"s":""} de dégâts avant d'être détruite.`,"gen-degats"],
 ["CD","Commandement",u=>`${E(u.stats.CD)} : pour un jet de commandement, on lance 2D6 ; il faut un total égal ou supérieur à cette valeur.`,"gen-cd"],
 ["CO","Contrôle d'objectif",u=>`${E(u.stats.CO)} : sert à savoir qui contrôle un objectif (on additionne la CO des figurines à portée).`,"gen-controle"]];
const WSTAT=[
 ["Portée","Distance maximale de la cible, en pouces. « Mêlée » = au corps à corps.","gen-mesure"],
 ["A","Attaques : nombre de dés de touche lancés (un par attaque).","gen-touche"],
 ["CT / CC","Capacité de tir (armes de tir) ou de combat (mêlée) : valeur à atteindre au dé pour toucher.","gen-touche"],
 ["F","Force : comparée à l'Endurance de la cible pour savoir ce qu'il faut faire pour blesser.","gen-blessure"],
 ["PA","Pénétration d'armure : fait baisser le dé de sauvegarde de l'adversaire.","gen-svg"],
 ["D","Dégâts : points de vie retirés par attaque non arrêtée.","gen-degats"]];
function unitCard(u){const st=u.stats||{};
 return`<div class="tt-uc"><div class="tt-uh">${cn(u)} <span class="mu">${u.size?u.size+" figurine"+(u.size>1?"s":""):"effectif non précisé"} · ${num(u.pts)||u.pts||0} pts</span></div>
 <p class="mu">Rôle (d'après ses mots-clés) : ${E(kwOf(u).join(", ")||"non précisé")}</p>
 <div class="tt-sg">${STATX.map(s=>`<details class="tt-st"><summary><i>${s[0]}</i><b>${E(st[s[0]]||"–")}</b></summary><div class="tt-sx"><b>${s[1]}</b><p>${st[s[0]]?s[2](u):"Valeur absente de la fiche : information non disponible."}</p></div></details>`).join("")}</div>
 <p class="mu tt-hint">Touche chaque case pour comprendre ce qu'elle veut dire pour cette unité.</p></div>`}
function weaponsBlock(u){const ws=u.weapons||[];if(!ws.length)return`<p class="tt-miss">Aucune arme enregistrée pour cette unité.</p>`;
 return`<div class="tt-w">${ws.map(w=>`<div class="tt-wr"><b>${E(w.name)}</b><span>${E(w.range)} · A ${E(w.a)} · ${isMelee(w)?"CC":"CT"} ${E(w.hit||"-")} · F ${E(w.f)} · PA ${E(w.pa)} · D ${E(w.d)}</span>${w.caps?`<small>${E(w.caps)}</small>`:""}</div>`).join("")}</div>
 <details class="tt-st2"><summary>Que veulent dire ces chiffres ?</summary>${WSTAT.map(s=>`<p><b>${s[0]}</b> — ${s[1]}</p>`).join("")}</details>`}
function capsIn(){const seen=new Set(),out=[];ALL().forEach(u=>(u.weapons||[]).forEach(w=>String(w.caps||"").split(/,(?![^\[]*\])/).forEach(c=>{c=c.trim();if(!c)return;const k=nk(c.replace(/\s*\d+\+?$/,""));if(seen.has(k))return;seen.add(k);let r=null;try{r=window.encApi.find(c.replace(/\s*[\d]+\+?$/,"").replace(/\s+(non|Non).*$/,"").trim())}catch(_){}out.push(r?`<li><b>${E(c)}</b> — ${E(r.def)}</li>`:`<li><b>${E(c)}</b> — <span class="tt-miss">règle absente des données importées (lis la fiche de l'unité)</span></li>`)})));return out.slice(0,8)}
const psyRe=/psychi/i;
const STEPS=[
 {t:"Préparer la partie",ph:"Avant la bataille",
  why:"Savoir comment une partie est organisée évite de se perdre ensuite.",
  e:()=>{const L=LST(),ld=LD().STEPS;return`<p>Une partie se joue à <b>deux joueurs</b>, chacun avec son armée.</p>${rb("gen-phases")}<p>${ld[5]?"<b>"+E(ld[5][0])+"</b> — "+E(ld[5][1]):""}</p><p>${ld[7]?"<b>"+E(ld[7][0])+"</b> — "+E(ld[7][1]):""}</p>${rb("gen-objectifs")}<p>${ld[2]?"<b>"+E(ld[2][0])+"</b> — "+E(ld[2][1]):""}</p>${rb("gen-mesure")}
   <div class="tt-ex"><b>Ton armée : ${E(L?L.name:"—")}</b><ul class="tt-ul">${UN().map(u=>`<li>${cn(u)} ${u.size?"× "+u.size:""} <span class="mu">— ${E(kwOf(u).slice(0,3).join(", ")||"")}</span></li>`).join("")}</ul></div>`},
  doI:()=>["Installer la table et le décor comme l'indique la mission","Placer les objectifs","Avoir un mètre ruban gradué en pouces","Avoir des dés à six faces (D6)","Préparer tes figurines à côté de ta liste"],
  i:()=>rb("gen-des")+rb("gen-effectif"),a:()=>rb("gen-attachees")+rb("gen-reserves")},
 {t:"Découvrir son armée",ph:"Tes unités",
  why:"Tes exemples viendront de tes propres unités : mieux vaut les connaître avant de jouer.",
  e:()=>{const us=UN(),t=T();if(!us.length)return`<p class="tt-miss">Cette armée ne contient aucune unité.</p>`;if(t.u>=us.length)t.u=0;const u=us[t.u];
   return`<p>Unité ${t.u+1} sur ${us.length}. Je te les montre une par une, sans tout t'expliquer d'un coup.</p>${unitCard(u)}<h4>Ses armes</h4>${weaponsBlock(u)}<h4>Ses capacités</h4>${u.apt?`<p>${E(u.apt)}</p><p class="mu">Ouvre la fiche pour lire chaque capacité en détail.</p>`:`<p class="mu">Aucune capacité enregistrée.</p>`}
   <div class="tt-nav"><button class="b" data-tt="uprev"${t.u?"":" disabled"}>◀ Unité précédente</button><button class="b" data-tt="fiche" data-i="${t.u}">📇 Ouvrir la fiche</button><button class="b p" data-tt="unext"${t.u<us.length-1?"":" disabled"}>Unité suivante ▶</button></div>`},
  doI:()=>["Regarder le profil de chaque unité","Repérer leurs armes","Lire les capacités qui te semblent importantes"],
  i:()=>{const c=capsIn();return c.length?`<h4>Capacités d'armes présentes dans ta liste</h4><ul class="tt-ul">${c.join("")}</ul>`:""},
  a:()=>rb("gen-alloc")+rb("gen-invu")},
 {t:"Mission et déploiement",ph:"Avant la bataille",
  why:"La mission dit comment marquer des points et où poser tes unités.",
  e:()=>{const m=missionOf(),ld=LD().STEPS;let h="";
   if(m&&m.data){h+=`<div class="tt-ex"><b>${E(m.cat.ic||"")} ${E(m.data.nm)}</b> <span class="mu">${E(m.cat.fr||"")}</span><p>${E(m.data.d)}</p></div><h4>Comment on marque des points</h4>${condHtml(m.data)||'<p class="mu">Cette mission ne liste pas de condition de score dans les données.</p>'}`;
    const su=jp(m.data.setup);if(su.length)h+=`<h4>Règles de mise en place</h4><ul class="tt-ul">${su.map(x=>`<li>${E(typeof x==="string"?x:x.tx||x.t||JSON.stringify(x))}</li>`).join("")}</ul>`;else h+=`<p class="mu">Cette mission n'indique pas de règle de mise en place particulière dans les données.</p>`}
   else h+=`<p class="tt-miss">Aucune mission n'est enregistrée pour cette partie : information non disponible. Ouvre « Missions & Layout » pour en choisir une.</p><button class="b" data-tt="mis">🗺 Ouvrir Missions & Layout</button>`;
   h+=`<p>${ld[1]?"<b>"+E(ld[1][0])+"</b> — "+E(ld[1][1]):""}</p><p>${ld[2]?"<b>"+E(ld[2][0])+"</b> — "+E(ld[2][1]):""}</p><p>${ld[3]?"<b>"+E(ld[3][0])+"</b> — "+E(ld[3][1]):""}</p>${rb("gen-objectifs")}`;
   if(window.__sxd&&window.__sxd.length)h+=`<p class="mu">Les objectifs secondaires se suivent dans l'onglet Score (Bataille).</p>`;return h},
  doI:()=>["Choisir ou confirmer la mission","Installer le terrain et les objectifs","Déployer tes unités dans ta zone de déploiement","Ton adversaire déploie les siennes"],
  i:()=>rb("gen-obj-sec")+rb("gen-controle"),a:()=>rb("gen-reserves")+rb("gen-arrivee")},
 {t:"Début du tour",ph:"Déroulement d'un tour",
  why:"Chaque tour suit toujours le même ordre : le connaître t'évite d'oublier quelque chose.",
  e:()=>`${rb("gen-phases")}<ol class="tt-ol">${LD().PH.map(p=>`<li><b>${E(String(p[0]).replace(/^\d\s*·\s*/,""))}</b></li>`).join("")}</ol><p>Je te présente chaque phase au moment où tu y arrives. Quand tu as fini une phase, touche « Étape terminée ».</p>`,
  doI:()=>["Savoir quel joueur est actif","Suivre le round dans l'onglet Score"],
  i:()=>rb("gen-strat"),a:()=>""},
 {t:"Phase de Commandement",ph:"Commandement",pk:"Commandement",
  why:"C'est le moment des ressources : tu gagnes des PC et tu vérifies le moral de tes unités.",
  e:()=>`${learnPh(0)}${rb("gen-ph-cmd")}${rb("gen-pc")}${abilIn(/phase\s+de\s+Commandement/i,"Capacités de ta liste qui parlent de cette phase")}${phBtn("Commandement")}`,
  doI:()=>["Gagner 1 PC (chaque joueur)","Faire les jets d'ébranlement si nécessaire","Utiliser les aptitudes de Commandement de tes unités"],
  i:()=>rb("gen-ebranle")+rb("gen-cd"),a:()=>rb("gen-doublons")+rb("gen-aura")},
 {t:"Phase de Mouvement",ph:"Mouvement",pk:"Mouvement",
  why:"Tu places tes unités pour pouvoir tirer, charger et prendre les objectifs.",
  e:()=>{const us=ALL().filter(u=>u.stats&&num(u.stats.M)!=null).sort((a,b)=>num(b.stats.M)-num(a.stats.M));let ex="";
   if(us.length){const f=us[0],s=us[us.length-1];ex=`<div class="tt-ex"><b>Exemple avec ta liste</b><p>${cn(f)} a M ${E(f.stats.M)} : mouvement normal jusqu'à <b>${num(f.stats.M)}"</b> ; en avançant, <b>${num(f.stats.M)}" + 1D6"</b>.${us.length>1?` À l'inverse, ${cn(s)} (M ${E(s.stats.M)}) se déplace moins vite : jusqu'à ${num(s.stats.M)}".`:""}</p></div>`}
   return`${learnPh(1)}${rb("gen-ph-mvt")}${rb("gen-avance")}${rb("gen-coherence")}${rb("gen-mesure")}${ex}${abilIn(/phase\s+de\s+Mouvement/i,"Capacités de ta liste qui parlent de cette phase")}${phBtn("Mouvement")}`},
  doI:()=>["Choisir une option pour chaque unité (rester immobile, mouvement normal, avance…)","Mesurer en pouces depuis le socle","Vérifier la cohésion de chaque unité après son mouvement"],
  i:()=>rb("gen-retraite")+rb("gen-engage"),a:()=>rb("gen-transport")+rb("gen-debarq")+rb("gen-reserves")},
 {t:"Phase psychique (si elle existe)",ph:"Psychique ?",skip:true,
  why:"Je vérifie ce que dit ta version des règles avant de t'expliquer quoi que ce soit.",
  e:()=>{const ph=LD().PH.map(p=>String(p[0]).replace(/^\d\s*·\s*/,"")),has=ph.some(x=>psyRe.test(x));
   let h=has?`<p>Une phase psychique est listée dans les règles importées.</p>`:`<p>Dans les règles importées dans HAMMER (V11), un tour compte ces phases : <b>${E(ph.join(", "))}</b>. <b>Il n'y a pas de phase psychique séparée</b> : je n'en invente pas.</p>${rb("gen-phases")}`;
   const a=abilIn(psyRe,"Aptitudes psychiques trouvées dans ta liste");h+=a||`<p class="mu">Aucune unité de ton armée n'a d'aptitude psychique : cette étape ne te concerne pas, tu peux continuer.</p>`;
   if(a)h+=`<p class="mu">Ces aptitudes se jouent selon le texte écrit sur leur fiche : ouvre la fiche de l'unité pour lire exactement quand et comment les utiliser.</p>`;return h},
  doI:()=>["Lire le texte des aptitudes psychiques de tes unités s'il y en a","Sinon, passer à l'étape suivante"],
  i:()=>rb("arm-psy"),a:()=>""},
 {t:"Phase de Tir",ph:"Tir",pk:"Tir",
  why:"C'est la première phase où l'on lance beaucoup de dés : on la découpe en 9 petits gestes.",
  e:()=>{const p=pickW(false),seq=[
   ["Choisir une unité qui va tirer",rb("gen-ph-tir")],
   ["Vérifier quelles armes peuvent tirer",`<p>Sur la fiche, les armes ont une <b>portée</b> en pouces. Celles marquées « Mêlée » ne tirent pas.</p>${p?`<p>Ex. : ${cn(p.u)} a <b>${E(p.w.name)}</b> (portée ${E(p.w.range)}).</p>`:""}`],
   ["Choisir une cible valide",learnPh(2)],
   ["Vérifier la portée et la ligne de vue",`${rb("gen-vis")}<p>Mesure depuis le socle de ta figurine jusqu'à celui de la cible.</p>`],
   ["Déterminer le nombre d'attaques",`<p>La valeur <b>A</b> de l'arme dit combien d'attaques elle fait, par figurine qui tire.</p>`],
   ["Jets pour toucher",rb("gen-touche")],
   ["Jets pour blesser",`${rb("gen-blessure")}<table class="tt-t">${LD().WT.map(r=>`<tr><td>${E(r[0])}</td><td><b>${E(r[1])}</b></td></tr>`).join("")}</table>`],
   ["Sauvegardes",rb("gen-svg")],
   ["Appliquer les dégâts",rb("gen-degats")]];
   return`<ol class="tt-seq">${seq.map((s,i)=>`<li><details${i===0?" open":""}><summary><span class="tt-n">${i+1}</span>${s[0]}</summary><div>${s[1]}</div></details></li>`).join("")}</ol>${exAttack(false)}${phBtn("Tir")}`},
  doI:()=>["Choisir une unité éligible","Choisir sa cible (visible, à portée, non engagée)","Lancer les dés : toucher, blesser","Faire faire les sauvegardes par l'adversaire","Retirer les figurines détruites"],
  i:()=>rb("gen-crit")+rb("gen-invu")+rb("gen-bm")+rb("gen-alloc"),a:()=>rb("gen-tir-juge")+rb("arm-assaut")+rb("arm-lourd")},
 {t:"Phase de Charge",ph:"Charge",pk:"Charge",
  why:"La charge amène tes unités au contact pour pouvoir combattre au corps à corps.",
  e:()=>{const p=pickW(true),m=p?p.u:ALL()[0];
   return`${learnPh(3)}${rb("gen-ph-charge")}${rb("gen-engage")}${m?`<div class="tt-ex"><b>Exemple avec ta liste</b><p>Si ${cn(m)} est à 12" ou moins d'un ennemi, elle peut déclarer une charge : tu lances <b>2D6</b>, et c'est la distance maximale qu'elle peut parcourir pour atteindre l'ennemi.</p></div>`:""}${phBtn("Charge")}`},
  doI:()=>["Choisir une unité qui peut charger","Annoncer la ou les cibles (ennemis à 12\" ou moins)","Lancer 2D6 pour la distance de charge","Déplacer l'unité si la distance suffit"],
  i:()=>rb("gen-engag"),a:()=>rb("gen-danger")},
 {t:"Phase de Combat",ph:"Combat",pk:"Combat",
  why:"Les unités au contact se battent : tu retrouves les mêmes jets que pour le tir.",
  e:()=>`${learnPh(4)}${rb("gen-ph-combat")}${exAttack(true)}${phBtn("Combat")}`,
  doI:()=>["Faire combattre chaque unité engagée (celles qui ont chargé d'abord)","Choisir une arme de mêlée par figurine","Jets pour toucher, blesser, sauvegardes, dégâts","Consolider si les règles le permettent"],
  i:()=>rb("gen-insertion")+rb("gen-consol"),a:()=>rb("gen-debord")},
 {t:"Fin du tour et score",ph:"Fin du tour",
  why:"On compte les points, puis le tour passe à l'autre joueur.",
  e:()=>{const m=missionOf(),ld=LD().STEPS;return`${m&&m.data?`<h4>Points de la mission « ${E(m.data.nm)} »</h4>${condHtml(m.data)}`:`<p class="tt-miss">Aucune mission enregistrée : je ne peux pas te donner ses conditions de score.</p>`}${rb("gen-controle")}<p>${ld[6]?"<b>"+E(ld[6][0])+"</b> — "+E(ld[6][1]):""}</p><p>${ld[7]?"<b>"+E(ld[7][0])+"</b> — "+E(ld[7][1]):""}</p><p>Le suivi des points, des PC et des rounds se fait dans l'onglet <b>Score</b> de HAMMER.</p><button class="b" data-tt="score">🏆 Ouvrir le Score</button>`},
  doI:()=>["Compter les objectifs contrôlés","Noter les points dans l'onglet Score","Passer au tour de l'autre joueur, puis au round suivant","À la fin du dernier round, comparer les scores"],
  i:()=>rb("gen-obj-sec"),a:()=>""}
];
const N=STEPS.length;
/* ---------- questions ---------- */
const QP=[
 ["Pourquoi dois-je faire un jet pour blesser ?",()=>rb("gen-blessure")+`<table class="tt-t">${LD().WT.map(r=>`<tr><td>${E(r[0])}</td><td><b>${E(r[1])}</b></td></tr>`).join("")}</table>`+exAttack(false)],
 ["Comment fonctionne la sauvegarde ?",()=>rb("gen-svg")+rb("gen-invu")],
 ["Pourquoi cette unité ne peut-elle pas tirer ?",()=>rb("gen-ph-tir")+learnPh(2)+rb("gen-engage")],
 ["Que signifie la PA de cette arme ?",()=>rb("gen-svg")+exAttack(false)],
 ["Que veut dire « engagée » ?",()=>rb("gen-engage")+rb("gen-engag")],
 ["Comment mesure-t-on les distances ?",()=>rb("gen-mesure")],
 ["À quoi sert le Commandement (Cd) ?",()=>rb("gen-cd")+rb("gen-ebranle")],
 ["Comment fonctionne un stratagème ?",()=>rb("gen-strat")+rb("gen-pc")]];
function search(q){const k=nk(q);if(k.length<2)return[];const ws=k.split(" ").filter(w=>w.length>1);return Object.values(RU()).map(r=>{const n=nk(r.n+" "+(r.al||[]).join(" ")),d=nk(r.def||"");let s=0;ws.forEach(w=>{if(n.includes(w))s+=3;if(d.includes(w))s+=1});return{r,s}}).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,6).map(x=>x.r)}
/* ---------- interface ---------- */
const css=`
.tt-card{border:2px solid #f0b429;border-radius:14px;padding:12px;margin:0 0 14px;background:linear-gradient(145deg,rgba(240,180,41,.12),transparent)}
.tt-card h3{margin:0 0 2px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#f0b429}.tt-card h4{margin:2px 0 6px;font-size:18px}
.tt-card p{margin:6px 0}.tt-card .b{width:100%;min-height:44px;margin-top:6px}
.tt-ov{position:fixed;inset:0;z-index:44;background:rgba(5,12,9,.7);display:flex;align-items:flex-end;justify-content:center}
.tt-pn{background:var(--card,#16211b);color:var(--tx,#e6efe9);border-radius:18px 18px 0 0;width:min(560px,100%);max-height:92vh;overflow:auto;padding:16px;box-sizing:border-box}
.tt-pn h2{margin:0 0 6px;font-size:21px}.tt-pn select{width:100%;margin:6px 0;min-height:44px}
.tt-pn .b,.tt-card .b{min-height:42px}.tt-sheet .b{min-height:38px}
.tt-pill{position:fixed;left:8px;right:8px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:17;max-width:560px;margin:0 auto;display:flex;align-items:center;gap:8px;background:#f0b429;color:#1b1500;border-radius:16px;padding:9px 12px;box-shadow:0 6px 22px rgba(0,0,0,.45);font-weight:700;cursor:pointer;box-sizing:border-box}
.tt-pill span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tt-pill i{font-style:normal}
.tt-sheet{position:fixed;left:0;right:0;bottom:calc(60px + env(safe-area-inset-bottom,0px));top:4vh;z-index:18;max-width:600px;margin:0 auto;background:var(--card,#16211b);color:var(--tx,#e6efe9);border:2px solid #f0b429;border-radius:18px 18px 0 0;display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.55);box-sizing:border-box}
.tt-h{padding:8px 12px 4px;border-bottom:1px solid var(--bd,#27382f)}.tt-top{display:flex;align-items:center;gap:8px}.tt-top b{flex:1;min-width:0;font-size:16px}
.tt-top .b{min-height:36px;padding:4px 10px}
.tt-prog{display:flex;gap:3px;margin:8px 0 2px}.tt-prog button{flex:1;height:10px;min-width:0;border:0;border-radius:5px;background:var(--bd,#27382f);padding:0;cursor:pointer}.tt-prog button.dn{background:#2e9d6b}.tt-prog button.on{background:#f0b429;height:14px;margin-top:-2px}
.tt-ph{font-size:12px;color:var(--mu,#8fa398)}
.tt-lv{display:flex;gap:6px;margin:6px 0 0}.tt-lv button{flex:1;min-height:30px;border:1px solid var(--bd,#27382f);border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:12.5px;cursor:pointer;padding:0 4px}.tt-lv button.on{background:#f0b429;color:#1b1500;border-color:#f0b429;font-weight:700}
.tt-body{flex:1;overflow:auto;padding:8px 12px;min-height:0;padding-right:36px}.tt-body h4{margin:14px 0 4px;color:#f0b429}.tt-why{background:rgba(240,180,41,.12);border-left:4px solid #f0b429;border-radius:8px;padding:7px 10px;margin:0 0 8px}
.tt-rule{border:1px solid var(--bd,#27382f);border-radius:10px;padding:6px 10px;margin:8px 0;background:rgba(127,127,127,.06)}.tt-rule b{color:#f0b429}.tt-rule p{margin:3px 0 0}.tt-lr{border-style:dashed}
.tt-miss{color:#e0a030;font-size:13.5px}.tt-ex{border:1px solid #2e9d6b;background:rgba(46,157,107,.1);border-radius:10px;padding:8px 10px;margin:10px 0}
.tt-do{margin:6px 0;padding-left:20px}.tt-ul{margin:6px 0;padding-left:20px}.tt-ol{margin:6px 0;padding-left:22px}.tt-body p{margin:6px 0}
.tt-foot{display:flex;gap:8px;flex-wrap:wrap;padding:8px 12px 10px;border-top:1px solid var(--bd,#27382f);background:var(--card,#16211b)}.tt-foot .b{flex:1 1 40%;min-width:0}
.tt-sub{display:flex;gap:6px;flex-wrap:wrap;padding:6px 12px 0}.tt-sub .b{flex:1 1 30%;min-width:0;font-size:12px;min-height:32px;padding:2px 4px}
.tt-nav{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.tt-nav .b{flex:1 1 30%;min-width:0;font-size:13px}
.tt-uc{border:1px solid var(--bd,#27382f);border-radius:12px;padding:8px 10px;margin:8px 0}.tt-uh{font-size:16px}
.tt-sg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:8px 0}
.tt-st{border:1px solid var(--bd,#27382f);border-radius:10px;text-align:center;background:var(--bg,#0d1511)}.tt-st>summary{list-style:none;cursor:pointer;padding:6px 2px;min-height:40px}.tt-st>summary::-webkit-details-marker{display:none}
.tt-st i{display:block;font-style:normal;font-size:11px;color:var(--mu,#8fa398)}.tt-st b{font-size:20px;color:#f0b429}.tt-st[open]{grid-column:1/-1;text-align:left}.tt-st[open]>summary{text-align:center}.tt-sx{padding:0 10px 8px}
.tt-hint{font-size:12px}.tt-w{margin:6px 0}.tt-wr{border-top:1px solid var(--bd,#27382f);padding:5px 0}.tt-wr span{display:block;font-size:13px;color:var(--mu,#8fa398)}.tt-wr small{display:block;font-size:12px;color:#f0b429}
.tt-st2{margin:6px 0}.tt-st2 summary{cursor:pointer;color:#f0b429}
.tt-seq{list-style:none;margin:6px 0;padding:0}.tt-seq li{margin:5px 0}.tt-seq details{border:1px solid var(--bd,#27382f);border-radius:10px;padding:2px 8px}.tt-seq summary{cursor:pointer;min-height:38px;display:flex;align-items:center;gap:8px;font-weight:600}
.tt-n{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#f0b429;color:#1b1500;font-size:13px;flex:none}
.tt-t{border-collapse:collapse;width:100%;margin:6px 0}.tt-t td{border-bottom:1px solid var(--bd,#27382f);padding:4px 6px}
.tt-q input{width:100%;min-height:44px;box-sizing:border-box}.tt-qp{display:flex;flex-direction:column;gap:6px;margin:8px 0}.tt-qp .b{text-align:left;min-height:44px;white-space:normal}
.tt-lh{position:fixed;left:8px;right:8px;top:calc(8px + env(safe-area-inset-top,0px));z-index:45;max-width:560px;margin:0 auto;background:#f0b429;color:#1b1500;border-radius:12px;padding:8px 12px;font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.5);box-sizing:border-box}
.tt-done{display:inline-block;background:#2e9d6b;color:#fff;border-radius:99px;padding:0 8px;font-size:11.5px;margin-left:6px}
`;
function ensureCss(){if(document.getElementById("ttcss"))return;const s=document.createElement("style");s.id="ttcss";s.textContent=css;document.head.appendChild(s)}
function box(id){let b=document.getElementById(id);if(!b){b=document.createElement("div");b.id=id;document.body.appendChild(b)}return b}
const running=()=>{const t=T();return t.on&&t.phase==="run"&&S.pm&&S.pm===t.list&&LST()};
/* carte dans « Apprendre à jouer » */
function card(){const t=T(),L=LST(),run=t.phase==="run"&&L,fin=run&&!(S.pm&&S.pm===t.list);
 let b;if(t.on&&run&&!fin)b=`<p class="mu">Partie en cours avec <b>${E(L.name)}</b> · étape ${t.step+1} / ${N}.</p><button class="b p" data-tt="resume">▶ Reprendre le tutoriel</button><button class="b" data-tt="reset">↺ Recommencer</button>`;
 else if(run&&t.step>0&&!fin)b=`<p class="mu">Tutoriel en pause à l'étape ${t.step+1} / ${N} (${E(STEPS[t.step].t)}).</p><button class="b p" data-tt="resume">▶ Reprendre</button><button class="b" data-tt="reset">↺ Recommencer</button>`;
 else b=`<button class="b p" data-tt="open">🎓 Commencer une partie tutorielle</button>${t.step>0&&L?`<p class="mu">Dernier tutoriel : étape ${t.step+1} / ${N}. <button class="b" data-tt="open" style="width:auto;margin:0">Relancer</button></p>`:""}`;
 return`<section class="tt-card"><h3>Premières parties</h3><h4>Mode partie tutorielle</h4><p>Découvrez Warhammer 40 000 en réalisant votre première partie. HAMMER vous accompagne à chaque étape, vous explique les règles, vous montre quoi faire et vous aide à comprendre le déroulement d'une bataille.</p>${b}</section>`}
function setupModal(){ensureCss();const o=box("ttm"),t=T(),ls=S.lists||[],e=easiest();
 const sel=t.list&&ls.some(l=>l.id===t.list)?t.list:(ls.some(l=>l.id===S.cur)?S.cur:(ls[0]||{}).id);
 const L=ls.find(l=>l.id===sel);
 o.innerHTML=`<div class="tt-ov" data-tt="bg"><div class="tt-pn"><h2>🎓 Partie tutorielle</h2><p>Tu joues une vraie partie avec <b>ta propre armée</b>, et HAMMER t'accompagne étape par étape : ${N} étapes, du déploiement à la fin du tour.</p>
 ${ls.length?`<label>Mon armée<select id="ttl">${ls.map(l=>`<option value="${l.id}"${l.id===sel?" selected":""}>${E(l.name)} (${(l.units||[]).length} unités)</option>`).join("")}</select></label>${L?`<p class="mu">${(L.units||[]).map(u=>E(u.name)).join(", ")}</p>`:""}`:`<p class="tt-miss">Tu n'as encore aucune armée enregistrée : importe-en une pour commencer.</p>`}
 <button class="b" data-tt="imp">📥 Importer une armée (PDF ou texte)</button>
 ${e?`<h4>Scénario conseillé pour débuter</h4><p><b>${E(e.m.nm)}</b> — ${E(e.m.d)}</p><p class="mu">Choisie parce qu'elle a peu de conditions de score (${jp(e.m.cond).length}) et aucune règle spéciale dans les données de HAMMER. ${CATFR[e.m.cat]?`Pour l'obtenir, choisis la catégorie « <b>${E(CATFR[e.m.cat])}</b> » pour les deux joueurs.`:""} Tu restes libre de ton choix : le tutoriel utilisera la mission que tu auras choisie.</p>`:""}
 <p class="mu">Tu peux mettre le tutoriel en pause, quitter et reprendre à la même étape. Tout fonctionne hors ligne.</p>
 <button class="b p" data-tt="go" style="width:100%;margin-top:8px"${ls.length?"":" disabled"}>⚔ Préparer la bataille et commencer</button><button class="b" data-tt="x" style="width:100%;margin-top:6px">Annuler</button></div></div>`}
function closeM(id){const o=document.getElementById(id);if(o)o.innerHTML=""}
/* coach */
let SIG="";
function render(){ensureCss();const el=box("ttc"),t=T();
 if(!running()){if(el.innerHTML){el.innerHTML="";SIG=""}return}
 const sig=[t.step,t.lvl,t.min,t.u,t.rv,t.list,JSON.stringify(t.done),S.cur,S.pm,(S.games||[]).length,tab].join("|");if(sig===SIG)return;SIG=sig;
 const st=STEPS[t.step],dn=t.done[t.step];
 if(t.min){el.innerHTML=`<div class="tt-pill" data-tt="max" role="button" aria-label="Ouvrir le tutoriel"><i>🎓</i><span>Étape ${t.step+1}/${N} · ${E(st.t)}</span><i>▲</i></div>`;return}
 const lv=t.lvl,body=()=>{let h=`<div class="tt-why"><b>Pourquoi ?</b> ${E(st.why)}</div>`;
  h+=`<details class="tt-st2" ${(!dn||t.rv)?"open":""}><summary>Explication de l'étape</summary>${st.e()}</details>`;
  h+=`<h4>À faire sur la table</h4>${doL(st.doI())}`;
  if(lv==="i"||lv==="a"){const x=st.i();if(x)h+=`<h4>Intermédiaire</h4>${x}`}
  if(lv==="a"){const x=st.a();if(x)h+=`<h4>Avancé</h4>${x}`}
  return h};
 el.innerHTML=`<div class="tt-sheet" role="dialog" aria-label="Partie tutorielle"><div class="tt-h"><div class="tt-top"><b>${E(st.t)}${dn?'<span class="tt-done">fait ✓</span>':""}</b><button class="b" data-tt="pause" title="Réduire (pause)">▼ Pause</button><button class="b" data-tt="quit" aria-label="Quitter">✕</button></div>
  <div class="tt-ph">Étape ${t.step+1} sur ${N} · ${E(st.ph)}</div><div class="tt-prog">${STEPS.map((s,i)=>`<button class="${i===t.step?"on":t.done[i]?"dn":""}" data-tt="go" data-i="${i}" aria-label="Étape ${i+1} : ${E(s.t)}"></button>`).join("")}</div>
  <div class="tt-lv">${[["e","Essentiel"],["i","+ Intermédiaire"],["a","+ Avancé"]].map(x=>`<button class="${lv===x[0]?"on":""}" data-tt="lvl" data-v="${x[0]}">${x[1]}</button>`).join("")}</div></div>
  <div class="tt-body" id="ttb">${body()}</div>
  <div class="tt-sub"><button class="b" data-tt="q">❓ J'ai une question</button><button class="b" data-tt="units">📇 Mes fiches</button><button class="b" data-tt="gloss">📖 Glossaire</button></div>
  <div class="tt-foot"><button class="b" data-tt="prev"${t.step?"":" disabled"}>◀ Précédent</button><button class="b" data-tt="rev">🔁 Revoir l'explication</button><button class="b p" data-tt="next" style="flex-basis:100%">${t.step===N-1?"✔ Terminer le tutoriel":(st.skip?"Continuer ▶":"✔ J'ai compris · Étape terminée")}</button></div></div>`}
function launchHint(){const o=document.getElementById("ttl2");const t=T();const w=document.getElementById("gpo");if(!(t.on&&t.phase==="launch"&&w)){if(o&&o.innerHTML)o.innerHTML="";return}const e=easiest(),c=e&&CATFR[e.m.cat];const h=box("ttl2");if(!h.innerHTML)h.innerHTML=`<div class="tt-lh">🎓 <b>Tutoriel</b> — choisis ta mission pour chaque joueur${c?` (conseillé : « ${E(c)} » pour les deux)`:""}, valide chaque joueur, puis lance la partie. Je prends le relais dès que la bataille commence.</div>`}
function tick(){try{launchHint();const t=T();if(t.on&&t.phase==="launch"&&S.pm&&S.pm===t.list){t.phase="run";t.min=false;sv();SIG=""}render()}catch(e){}}
function openQ(){ensureCss();const o=box("ttq");o.innerHTML=`<div class="tt-ov" data-tt="qx"><div class="tt-pn tt-q"><div class="tt-top"><h2 style="flex:1">❓ J'ai une question</h2><button class="b" data-tt="qx">✕</button></div><input id="ttqi" type="search" placeholder="Cherche un mot : touche, sauvegarde, engagée…" autocomplete="off"><div class="tt-qp" id="ttqp">${QP.map((q,i)=>`<button class="b" data-tt="qp" data-i="${i}">${E(q[0])}</button>`).join("")}</div><div id="ttqr"></div><p class="mu">Les réponses viennent uniquement des règles importées dans HAMMER. Si une information manque, je te le dis.</p></div></div>`}
function showQ(html){const r=document.getElementById("ttqr");if(r){r.innerHTML=html;r.scrollIntoView({block:"nearest"})}}
function act(a,b,e){const t=T();
 switch(a){
 case"open":case"relaunch":setupModal();break;
 case"x":case"bg":if(a==="bg"&&e.target!==b)return false;closeM("ttm");break;
 case"imp":closeM("ttm");tab="imp";try{draw()}catch(_){}try{toast("Importe ton armée, puis reviens dans Apprendre à jouer → Partie tutorielle")}catch(_){}break;
 case"go":{if(b.dataset.i!=null){t.step=+b.dataset.i;t.rv=false;sv();SIG="";render();break}
  const s=document.getElementById("ttl");const id=s?s.value:(S.lists[0]||{}).id;if(!id)break;
  t.list=id;t.on=true;t.step=0;t.done={};t.u=0;t.min=false;t.rv=false;t.phase=(S.pm&&S.pm===id)?"run":"launch";sv();closeM("ttm");
  if(t.phase==="launch"){if(window.gPrep){tab="lists";try{draw()}catch(_){}window.gPrep(id)}else{S.cur=id;S.pm=id;S.mg=false;tab="play";try{draw()}catch(_){}}}else{SIG="";render()}break}
 case"resume":t.on=true;t.min=false;sv();SIG="";if(S.pm&&S.pm===t.list){t.phase="run";if(tab==="learn"||tab==="home"){try{draw()}catch(_){}}render()}else if(t.list&&S.lists.some(l=>l.id===t.list)){t.phase="launch";window.gPrep&&window.gPrep(t.list)}break;
 case"reset":ask({t:"Recommencer le tutoriel ?",p:"Tu repars de l'étape 1. Ta partie en cours n'est pas modifiée.",ok:"Recommencer",dg:1},()=>{t.step=0;t.done={};t.u=0;t.lvl="e";t.min=false;t.on=!!(S.pm&&S.pm===t.list);sv();SIG="";try{draw()}catch(_){}render()});break;
 case"max":t.min=false;sv();SIG="";render();break;
 case"pause":t.min=true;sv();SIG="";render();try{toast("Tutoriel en pause : touche la pastille jaune pour reprendre")}catch(_){}break;
 case"quit":ask({t:"Quitter le tutoriel ?",p:"Ta partie continue normalement. Tu pourras reprendre le tutoriel à cette étape depuis « Apprendre à jouer ».",ok:"Quitter"},()=>{t.on=false;sv();SIG="";render();try{draw()}catch(_){}});break;
 case"next":t.done[t.step]=1;t.rv=false;if(t.step<N-1)t.step++;else{t.on=false;try{toast("Bravo, tu as terminé le tutoriel 🎓")}catch(_){}}sv();SIG="";render();{const bd=document.getElementById("ttb");if(bd)bd.scrollTop=0}break;
 case"prev":if(t.step>0){t.step--;t.rv=false;sv();SIG="";render()}break;
 case"rev":t.rv=true;sv();SIG="";render();{const bd=document.getElementById("ttb");if(bd)bd.scrollTop=0}break;
 case"lvl":t.lvl=b.dataset.v;sv();SIG="";render();break;
 case"unext":{const n=UN().length;if(t.u<n-1)t.u++;sv();SIG="";render()}break;
 case"uprev":if(t.u>0)t.u--;sv();SIG="";render();break;
 case"fiche":{const u=UN()[+b.dataset.i];if(u){S.cur=t.list;ed=u;ctx="list";edit=false;try{draw()}catch(_){}}}break;
 case"units":{const us=UN();if(us.length){ensureCss();const o=box("ttq");o.innerHTML=`<div class="tt-ov" data-tt="qx"><div class="tt-pn"><div class="tt-top"><h2 style="flex:1">📇 Mes fiches</h2><button class="b" data-tt="qx">✕</button></div><div class="tt-qp">${us.map((u,i)=>`<button class="b" data-tt="fiche2" data-i="${i}">${E(u.name)}</button>`).join("")}</div></div></div>`}}break;
 case"fiche2":{closeM("ttq");const u=UN()[+b.dataset.i];if(u){S.cur=t.list;ed=u;ctx="list";edit=false;try{draw()}catch(_){}}}break;
 case"gloss":t.min=true;sv();SIG="";tab="enc";try{draw()}catch(_){}render();break;
 case"strat":t.min=true;sv();SIG="";S.cur=t.list;if(typeof pph!=="undefined")pph=b.dataset.ph||"";tab="pst";try{draw()}catch(_){}render();break;
 case"mis":t.min=true;sv();SIG="";tab="mis";try{draw()}catch(_){}render();break;
 case"score":t.min=true;sv();SIG="";tab="bat";try{draw()}catch(_){}render();break;
 case"wpn":{const p=pickW(b.dataset.m==="1");if(p){t.min=true;sv();SIG="";render();const x=document.createElement("button");x.className="wza";x.style.display="none";x.dataset.dzw=JSON.stringify({u:p.u.name,n:p.w.name,t:b.dataset.m==="1"?"m":"r",a:p.w.a,ct:p.w.hit,f:p.w.f,pa:p.w.pa,d:p.w.d,c:p.w.caps||"",m:1});document.body.appendChild(x);x.click();x.remove()}}break;
 case"q":openQ();break;
 case"qx":if(e.target!==b)return false;closeM("ttq");break;
 case"qp":showQ((QP[+b.dataset.i]||[0,()=>""])[1]());break;
 default:return false}
 return true}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-tt]");if(!b)return;if(b.dataset.tt==="qx"&&e.target!==b&&b.classList.contains("tt-ov"))return;if(b.dataset.tt==="bg"&&e.target!==b)return;const r=act(b.dataset.tt,b,e);if(r!==false){e.preventDefault();e.stopPropagation()}},true);
document.addEventListener("input",e=>{if(e.target&&e.target.id==="ttqi"){const q=e.target.value,r=search(q);document.getElementById("ttqp").style.display=q.trim()?"none":"";showQ(q.trim().length<2?"":(r.length?r.map(x=>`<div class="tt-rule"><b>${E(x.n)}</b><p>${E(x.def)}</p></div>`).join(""):`<p class="tt-miss">Je n'ai rien trouvé à ce sujet dans les règles importées : information non disponible.</p>`))}});
/* intégration : carte dans « Apprendre à jouer », rendu après chaque draw(), suivi du lancement de la partie */
window.XV=window.XV||{};const base=window.XV.learn;window.XV.learn=function(){let c="";try{ensureCss();c=card()}catch(e){}return c+(base?base():"")};
const d0=window.draw;if(typeof d0==="function")window.draw=function(){const r=d0.apply(this,arguments);try{render()}catch(e){}return r};
setInterval(tick,900);try{tick()}catch(_){}
window.TUTO={STEPS,T,render,act,N};
})();
