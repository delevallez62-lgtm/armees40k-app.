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
const sh=(i)=>{const x=LD().STEPS[i];return x?`<p>${E(x[1])}</p>`:""};
const hasPsy=()=>ALL().some(u=>psyRe.test((u.text||[]).join(" ")+" "+(u.apt||"")));
const strt=(ph)=>stratsFor(ph)?`<p class="mu">Tu as ${stratsFor(ph)} stratagème${stratsFor(ph)>1?"s":""} utilisable${stratsFor(ph)>1?"s":""} pendant cette phase.</p>${phBtn(ph)}`:"";
const TIP={prep:"Installe la table, puis déploie tes unités. Quand tout est prêt, appuie sur ▶.",
 army:"Touche une unité de la liste pour voir sa fiche. Les chiffres : M = vitesse, E = résistance, SV = armure, PV = vie.",
 turn:"Phase 1 : chaque joueur gagne 1 PC (point de commandement). Note-le dans Score.",
 move:"Phase 2 : déplace chaque unité jusqu'à son M en pouces (son M + 1 dé si elle avance).",
 psy:"Certaines de tes unités ont des pouvoirs psychiques : lis leur texte sur la fiche.",
 shoot:"Phase 3 : choisis une unité, une cible visible et à portée. Lance : toucher → blesser → sauvegarde.",
 charge:"Phase 4 : une unité à 12\" ou moins d'un ennemi peut charger. Lance 2D6 : c'est la distance.",
 fight:"Phase 5 : les unités au contact combattent avec une arme de mêlée. Mêmes jets que le tir.",
 end:"Compte les objectifs, note les points dans Score, puis passe le tour à ton adversaire."};
const BASE=[
 {id:"prep",t:"Avant de commencer",ph:"La partie",
  why:"Comprendre en 1 minute comment se déroule une partie.",
  e:()=>{const m=missionOf(),L=LST();let h=`<p>Une partie, c'est <b>deux joueurs</b> qui jouent chacun leur tour avec leurs figurines sur une table.</p><p>Elle dure en général <b>5 rounds</b>. À la fin, <b>celui qui a le plus de points gagne</b>.</p>`;
   if(m&&m.data){h+=`<div class="tt-ex"><b>Votre mission : ${E(m.data.nm)}</b><p>${E(m.data.d)}</p>${condHtml(m.data)?`<p><b>Comment marquer des points :</b></p>${condHtml(m.data)}`:""}</div>`}
   else h+=`<p class="tt-miss">Aucune mission n'est enregistrée pour cette partie. Tu peux en choisir une dans « Missions & Layout ».</p><button class="b" data-tt="mis">🗺 Choisir une mission</button>`;
   h+=`<p><b>Il te faut :</b> une table avec du décor, un mètre ruban en <b>pouces</b> (le signe "), des dés à 6 faces et tes figurines.</p><div class="tt-ex"><b>Ton armée : ${E(L?L.name:"—")}</b><ul class="tt-ul">${UN().map(u=>`<li>${cn(u)}${u.size?" × "+u.size:""}</li>`).join("")}</ul></div>`;return h},
  doI:()=>["Installe la table, le décor et les objectifs comme la mission le demande","Pose tes figurines dans ta zone de déploiement","Pose ton mètre ruban et tes dés à portée de main"],
  i:()=>rb("gen-phases")+rb("gen-objectifs")+rb("gen-mesure")+sh(2)+sh(3),a:()=>rb("gen-attachees")+rb("gen-reserves")},
 {id:"army",t:"Découvre ton armée",ph:"Tes unités",
  why:"Tes exemples viendront de tes propres figurines.",
  e:()=>{const us=UN(),t=T();if(!us.length)return`<p class="tt-miss">Cette armée ne contient aucune unité.</p>`;if(t.u>=us.length)t.u=0;const u=us[t.u];
   return`<p>Unité ${t.u+1} sur ${us.length}. Touche un chiffre pour savoir ce qu'il veut dire.</p>${unitCard(u)}<h4>Ses armes</h4>${weaponsBlock(u)}${u.apt?`<h4>Ses capacités</h4><p>${E(u.apt)}</p><p class="mu">La fiche de l'unité explique chacune d'elles.</p>`:""}
   <div class="tt-nav"><button class="b" data-tt="uprev"${t.u?"":" disabled"}>◀ Précédente</button><button class="b" data-tt="fiche" data-i="${t.u}">📇 Fiche</button><button class="b p" data-tt="unext"${t.u<us.length-1?"":" disabled"}>Suivante ▶</button></div>`},
  doI:()=>["Regarde le profil de chaque unité","Repère leurs armes : on s'en servira pour tirer et combattre"],
  i:()=>{const c=capsIn();return(c.length?`<h4>Capacités d'armes de ta liste</h4><ul class="tt-ul">${c.join("")}</ul>`:"")+rb("gen-blessure")+rb("gen-svg")},a:()=>rb("gen-alloc")+rb("gen-invu")},
 {id:"turn",t:"Un tour, c'est 5 phases",ph:"Phase 1 · Commandement",pk:"Commandement",
  why:"Chaque tour suit toujours le même ordre : tu n'as qu'à le suivre.",
  e:()=>`<p>À ton tour, tu joues <b>5 phases, toujours dans cet ordre</b> :</p><ol class="tt-ol"><li><b>Commandement</b> — tu gagnes des points</li><li><b>Mouvement</b> — tu déplaces tes unités</li><li><b>Tir</b> — tes unités tirent</li><li><b>Charge</b> — tes unités foncent au contact</li><li><b>Combat</b> — corps à corps</li></ol><p>Je t'explique chaque phase quand tu y arrives.</p><div class="tt-ex"><b>Phase de Commandement (maintenant)</b><p>Chaque joueur gagne <b>1 point de commandement (PC)</b>. Les PC servent à utiliser des <b>stratagèmes</b> : des astuces qui donnent un petit avantage.</p></div>${abilIn(/phase\s+de\s+Commandement/i,"Dans ta liste, ces capacités se jouent à cette phase")}${strt("Commandement")}`,
  doI:()=>["Prends 1 PC (ton adversaire aussi)","Note-le dans l'onglet Score","Rien d'autre à faire pour l'instant : passe à la suite"],
  i:()=>learnPh(0)+rb("gen-ph-cmd")+rb("gen-pc")+rb("gen-ebranle")+rb("gen-cd"),a:()=>rb("gen-doublons")+rb("gen-aura")+rb("gen-strat")},
 {id:"move",t:"Mouvement",ph:"Phase 2 · Mouvement",pk:"Mouvement",
  why:"Tu rapproches tes unités des objectifs et des ennemis.",
  e:()=>{const us=ALL().filter(u=>u.stats&&num(u.stats.M)!=null).sort((a,b)=>num(b.stats.M)-num(a.stats.M));let ex="";
   if(us.length){const f=us[0];ex=`<div class="tt-ex"><b>Avec ta liste</b><p>${cn(f)} a <b>M ${E(f.stats.M)}</b> : elle peut se déplacer de <b>${num(f.stats.M)}"</b>. Si elle <b>avance</b> : ${num(f.stats.M)}" + 1 dé (D6) en plus.</p></div>`}
   return`<p>Pour <b>chaque unité</b>, choisis une seule option :</p><ul class="tt-ul"><li>🧍 <b>Rester sur place</b></li><li>🚶 <b>Mouvement normal</b> : jusqu'à son M, en pouces</li><li>🏃 <b>Avancer</b> : son M + 1 dé (D6). Attention : une unité qui avance ne tire qu'avec ses armes « Assaut ».</li></ul><p>Mesure depuis le <b>socle</b> des figurines. Après son mouvement, chaque figurine doit rester <b>à 2" au moins d'une autre figurine de son unité</b> (l'unité reste groupée).</p>${ex}${abilIn(/phase\s+de\s+Mouvement/i,"Dans ta liste, ces capacités se jouent à cette phase")}${strt("Mouvement")}`},
  doI:()=>["Choisis une option pour chaque unité","Déplace tes figurines en mesurant en pouces","Vérifie que chaque unité est bien groupée"],
  i:()=>learnPh(1)+rb("gen-ph-mvt")+rb("gen-avance")+rb("gen-coherence")+rb("gen-retraite"),a:()=>rb("gen-transport")+rb("gen-debarq")+rb("gen-reserves")},
 {id:"shoot",t:"Tir",ph:"Phase 3 · Tir",pk:"Tir",
  why:"C'est ta première attaque : on la fait en 6 gestes simples.",
  e:()=>`<ol class="tt-seq">${[
   ["Choisis une unité qui tire","Une unité qui n'est pas au corps à corps et qui n'a pas avancé."],
   ["Choisis une cible","Une unité ennemie que tu <b>vois</b>, qui est <b>à portée</b> de l'arme (la portée est en pouces)."],
   ["Lance un dé par attaque","Le nombre d'attaques, c'est la valeur <b>A</b>. Une attaque touche si le dé est <b>égal ou supérieur</b> à la CT de l'arme."],
   ["Pour chaque touche, lance pour blesser","On compare la <b>Force</b> de l'arme à l'<b>Endurance</b> de la cible : "+LD().WT.map(r=>`${E(r[0])} → <b>${E(r[1])}</b>`).join(" ; ")+"."],
   ["L'adversaire fait ses sauvegardes","Il lance un dé par blessure. La <b>PA</b> de l'arme fait baisser son dé. S'il atteint sa Sauvegarde, l'attaque est arrêtée."],
   ["Retire les dégâts","Chaque attaque non arrêtée retire des points de vie (la valeur <b>D</b> de l'arme)."]
  ].map((s,i)=>`<li><span class="tt-n">${i+1}</span><div><b>${s[0]}</b><br>${s[1]}</div></li>`).join("")}</ol>${exAttack(false)}${strt("Tir")}`,
  doI:()=>["Choisis une unité et une cible","Lance les dés : toucher, puis blesser","Fais faire les sauvegardes, puis retire les figurines détruites"],
  i:()=>learnPh(2)+rb("gen-ph-tir")+rb("gen-vis")+rb("gen-touche")+rb("gen-blessure")+rb("gen-svg")+rb("gen-degats")+rb("gen-crit"),a:()=>rb("gen-invu")+rb("gen-bm")+rb("gen-alloc")+rb("gen-tir-juge")+rb("arm-assaut")+rb("arm-lourd")},
 {id:"charge",t:"Charge",ph:"Phase 4 · Charge",pk:"Charge",
  why:"Pour pouvoir combattre au corps à corps, il faut d'abord atteindre l'ennemi.",
  e:()=>{const p=pickW(true),m=p?p.u:ALL()[0];
   return`<p>Une unité qui est <b>à 12" ou moins</b> d'un ennemi peut <b>déclarer une charge</b>.</p><ol class="tt-ol"><li>Annonce l'unité ennemie visée.</li><li>Lance <b>2 dés (2D6)</b> : le total est la distance maximale que tu peux parcourir.</li><li>Si tu peux atteindre l'ennemi, déplace ton unité à son contact.</li></ol>${m?`<div class="tt-ex"><b>Avec ta liste</b><p>Si ${cn(m)} est à 12" ou moins d'un ennemi, tu peux tenter la charge.</p></div>`:""}${strt("Charge")}`},
  doI:()=>["Choisis une unité à 12\" ou moins d'un ennemi","Lance 2D6 et compare à la distance","Déplace-la au contact si le jet suffit"],
  i:()=>learnPh(3)+rb("gen-ph-charge")+rb("gen-engage")+rb("gen-engag"),a:()=>rb("gen-danger")},
 {id:"fight",t:"Combat",ph:"Phase 5 · Combat",pk:"Combat",
  why:"Les unités au contact se battent : c'est comme le tir, mais avec les armes de mêlée.",
  e:()=>`<p>Toutes les unités <b>au contact</b> d'un ennemi combattent, <b>les deux joueurs</b>. Celles qui ont chargé ce tour combattent <b>en premier</b>, puis on alterne.</p><p>Chaque figurine utilise <b>une seule arme de mêlée</b>. Ensuite, tu retrouves les mêmes jets que pour le tir : toucher, blesser, sauvegardes, dégâts.</p>${exAttack(true)}${strt("Combat")}`,
  doI:()=>["Fais combattre chaque unité au contact (celles qui ont chargé d'abord)","Pour chaque arme de mêlée : toucher, blesser, sauvegardes, dégâts"],
  i:()=>learnPh(4)+rb("gen-ph-combat")+rb("gen-insertion")+rb("gen-consol"),a:()=>rb("gen-debord")},
 {id:"end",t:"Fin du tour et score",ph:"Fin du tour",
  why:"On compte les points, puis c'est à l'autre joueur.",
  e:()=>{const m=missionOf();return`<p>Ton tour est fini. On regarde <b>les objectifs</b> : le joueur dont les figurines ont le plus de <b>CO</b> (Contrôle d'objectif) à portée d'un objectif le contrôle.</p>${m&&m.data?`<div class="tt-ex"><b>Points de « ${E(m.data.nm)} »</b>${condHtml(m.data)||'<p class="mu">Pas de condition de score listée.</p>'}</div>`:`<p class="tt-miss">Aucune mission enregistrée : je ne peux pas te donner ses conditions de score.</p>`}<p>Ensuite, <b>l'autre joueur joue son tour</b>, puis un nouveau round commence. Après le dernier round, <b>on compare les scores</b>.</p><p>Note tes points dans l'onglet <b>Score</b> de HAMMER.</p><button class="b" data-tt="score">🏆 Ouvrir le Score</button>`},
  doI:()=>["Compte les objectifs que tu contrôles","Note les points dans Score","Passe le tour à ton adversaire"],
  i:()=>sh(5)+sh(6)+sh(7)+rb("gen-controle"),a:()=>rb("gen-obj-sec")}
];
const PSY={id:"psy",t:"Aptitudes psychiques",ph:"Dans ta liste",why:"Certaines de tes unités ont des pouvoirs psychiques.",
 e:()=>`<p>Dans les règles de HAMMER (V11), il n'y a <b>pas de phase psychique</b> à part. Les pouvoirs psychiques s'utilisent <b>pendant les phases habituelles</b>, comme l'indique le texte de l'unité.</p>${abilIn(psyRe,"Pouvoirs trouvés dans ta liste")}<p class="mu">Ouvre la fiche de l'unité pour lire quand et comment s'en servir.</p>`,
 doI:()=>["Lis le texte des pouvoirs de l'unité concernée"],i:()=>rb("arm-psy"),a:()=>""};
const STEPS=[];function buildSteps(){const a=BASE.slice();if(hasPsy())a.splice(4,0,PSY);STEPS.length=0;a.forEach(x=>STEPS.push(x));return STEPS}
buildSteps();
let N=STEPS.length;const upd=()=>{buildSteps();N=STEPS.length;const t=T();if(t.step>=N)t.step=N-1};
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
.tt-card{border:2px solid var(--ac,#f0b429);border-radius:14px;padding:12px;margin:0 0 14px;background:linear-gradient(145deg,color-mix(in srgb,var(--ac,#f0b429) 14%,transparent),transparent)}
.tt-card h3{margin:0 0 2px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--ac,#f0b429)}.tt-card h4{margin:2px 0 6px;font-size:18px}
.tt-card p{margin:6px 0}.tt-card .b{width:100%;min-height:44px;margin-top:6px}
.tt-ov{position:fixed;inset:0;z-index:44;background:rgba(5,12,9,.7);display:flex;align-items:flex-end;justify-content:center}
.tt-pn{background:var(--card,#16211b);color:var(--tx,#e6efe9);border-radius:18px 18px 0 0;width:min(560px,100%);max-height:92vh;overflow:auto;padding:16px;box-sizing:border-box}
.tt-pn h2{margin:0 0 6px;font-size:21px}.tt-pn select{width:100%;margin:6px 0;min-height:44px}
.tt-pn .b,.tt-card .b{min-height:42px}.tt-sheet .b{min-height:38px}
.tt-strip{position:relative;background:var(--card);border:2px solid var(--ac,#f0b429);border-radius:14px;padding:8px 10px;margin:0 0 10px;box-shadow:var(--sh);box-sizing:border-box;color:var(--tx)}
.tt-sr{display:flex;align-items:center;gap:8px}.tt-ti{flex:1;min-width:0}.tt-ti b{display:block;font-size:16px}.tt-ti small{color:var(--mu);font-size:12px}
.tt-ic{width:44px;height:44px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-size:18px;cursor:pointer;flex:none;padding:0}.tt-ic.p{background:var(--ac,#f0b429);color:#141008;border-color:var(--ac,#f0b429);font-weight:800}.tt-ic:disabled{opacity:.35}
.tt-tip{margin:6px 0;font-size:15px;line-height:1.35}
.tt-sr2{display:flex;gap:6px}.tt-sr2 button{flex:1;min-height:36px;border:1px solid var(--bd);border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer;min-width:0}.tt-sr2 button:last-child{flex:0 0 44px}
.tt-more{max-height:52vh;overflow:auto;margin-top:8px;border-top:1px solid var(--bd);padding-top:6px}.tt-more h4{margin:12px 0 4px;color:var(--ac,#f0b429)}.tt-more p{margin:6px 0}
.tt-uhint{margin:6px 0;padding:8px 10px;border:2px dashed var(--ac,#f0b429);border-radius:12px;background:color-mix(in srgb,var(--ac,#f0b429) 10%,transparent);font-size:14px;line-height:1.35}
.tt-pill{position:fixed;left:8px;right:8px;bottom:calc(72px + env(safe-area-inset-bottom,0px));z-index:17;max-width:560px;margin:0 auto;display:flex;align-items:center;gap:8px;background:var(--ac,#f0b429);color:#141008;border-radius:16px;padding:9px 12px;box-shadow:0 6px 22px rgba(0,0,0,.45);font-weight:700;cursor:pointer;box-sizing:border-box}
.tt-pill span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tt-pill i{font-style:normal}
.tt-sheet{position:fixed;left:0;right:0;bottom:calc(60px + env(safe-area-inset-bottom,0px));top:4vh;z-index:18;max-width:600px;margin:0 auto;background:var(--card,#16211b);color:var(--tx,#e6efe9);border:2px solid var(--ac,#f0b429);border-radius:18px 18px 0 0;display:flex;flex-direction:column;box-shadow:0 -10px 40px rgba(0,0,0,.55);box-sizing:border-box}
.tt-h{padding:8px 12px 4px;border-bottom:1px solid var(--bd,#27382f)}.tt-top{display:flex;align-items:center;gap:8px}.tt-top b{flex:1;min-width:0;font-size:16px}
.tt-top .b{min-height:36px;padding:4px 10px}
.tt-prog{display:flex;gap:3px;margin:8px 0 2px}.tt-prog button{flex:1;height:10px;min-width:0;border:0;border-radius:5px;background:var(--bd,#27382f);padding:0;cursor:pointer}.tt-prog button.dn{background:#2e9d6b}.tt-prog button.on{background:var(--ac,#f0b429);height:14px;margin-top:-2px}
.tt-ph{font-size:12px;color:var(--mu,#8fa398)}
.tt-lv{display:flex;gap:6px;margin:6px 0 0}.tt-lv button{flex:1;min-height:30px;border:1px solid var(--bd,#27382f);border-radius:10px;background:transparent;color:inherit;font:inherit;font-size:12.5px;cursor:pointer;padding:0 4px}.tt-lv button.on{background:var(--ac,#f0b429);color:#141008;border-color:var(--ac,#f0b429);font-weight:700}
.tt-body{flex:1;overflow:auto;padding:8px 12px;min-height:0;padding-right:36px}.tt-body h4{margin:14px 0 4px;color:var(--ac,#f0b429)}.tt-why{background:color-mix(in srgb,var(--ac,#f0b429) 14%,transparent);border-left:4px solid var(--ac,#f0b429);border-radius:8px;padding:7px 10px;margin:0 0 8px}
.tt-rule{border:1px solid var(--bd,#27382f);border-radius:10px;padding:6px 10px;margin:8px 0;background:rgba(127,127,127,.06)}.tt-rule b{color:var(--ac,#f0b429)}.tt-rule p{margin:3px 0 0}.tt-lr{border-style:dashed}
.tt-miss{color:#e0a030;font-size:13.5px}.tt-ex{border:1px solid #2e9d6b;background:rgba(46,157,107,.1);border-radius:10px;padding:8px 10px;margin:10px 0}
.tt-do{margin:6px 0;padding-left:20px}.tt-ul{margin:6px 0;padding-left:20px}.tt-ol{margin:6px 0;padding-left:22px}.tt-body p{margin:6px 0}
.tt-foot{display:flex;gap:8px;flex-wrap:wrap;padding:8px 12px 10px;border-top:1px solid var(--bd,#27382f);background:var(--card,#16211b)}.tt-foot .b{flex:1 1 40%;min-width:0}
.tt-sub{display:flex;gap:6px;flex-wrap:wrap;padding:6px 12px 0}.tt-sub .b{flex:1 1 30%;min-width:0;font-size:12px;min-height:32px;padding:2px 4px}
.tt-nav{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.tt-nav .b{flex:1 1 30%;min-width:0;font-size:13px}
.tt-uc{border:1px solid var(--bd,#27382f);border-radius:12px;padding:8px 10px;margin:8px 0}.tt-uh{font-size:16px}
.tt-sg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:8px 0}
.tt-st{border:1px solid var(--bd,#27382f);border-radius:10px;text-align:center;background:var(--bg,#0d1511)}.tt-st>summary{list-style:none;cursor:pointer;padding:6px 2px;min-height:40px}.tt-st>summary::-webkit-details-marker{display:none}
.tt-st i{display:block;font-style:normal;font-size:11px;color:var(--mu,#8fa398)}.tt-st b{font-size:20px;color:var(--ac,#f0b429)}.tt-st[open]{grid-column:1/-1;text-align:left}.tt-st[open]>summary{text-align:center}.tt-sx{padding:0 10px 8px}
.tt-hint{font-size:12px}.tt-w{margin:6px 0}.tt-wr{border-top:1px solid var(--bd,#27382f);padding:5px 0}.tt-wr span{display:block;font-size:13px;color:var(--mu,#8fa398)}.tt-wr small{display:block;font-size:12px;color:var(--ac,#f0b429)}
.tt-st2{margin:6px 0}.tt-st2 summary{cursor:pointer;color:var(--ac,#f0b429)}
.tt-seq{list-style:none;margin:6px 0;padding:0}.tt-seq li{margin:5px 0}.tt-seq details{border:1px solid var(--bd,#27382f);border-radius:10px;padding:2px 8px}.tt-seq summary{cursor:pointer;min-height:38px;display:flex;align-items:center;gap:8px;font-weight:600}
.tt-n{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--ac,#f0b429);color:#141008;font-size:13px;flex:none}
.tt-t{border-collapse:collapse;width:100%;margin:6px 0}.tt-t td{border-bottom:1px solid var(--bd,#27382f);padding:4px 6px}
.tt-q input{width:100%;min-height:44px;box-sizing:border-box}.tt-qp{display:flex;flex-direction:column;gap:6px;margin:8px 0}.tt-qp .b{text-align:left;min-height:44px;white-space:normal}
.tt-opt{display:flex;align-items:center;gap:8px;margin:8px 0;padding:8px 10px;border:2px solid var(--ac,#f0b429);border-radius:12px;background:color-mix(in srgb,var(--ac,#f0b429) 12%,transparent);font-size:14px;cursor:pointer}.tt-opt input{width:22px;height:22px;flex:none}
.tt-lh{position:fixed;left:8px;right:8px;top:calc(8px + env(safe-area-inset-top,0px));z-index:45;max-width:560px;margin:0 auto;background:var(--ac,#f0b429);color:#141008;border-radius:12px;padding:8px 12px;font-size:13px;box-shadow:0 6px 20px rgba(0,0,0,.5);box-sizing:border-box}
.tt-done{display:inline-block;background:#2e9d6b;color:#fff;border-radius:99px;padding:0 8px;font-size:11.5px;margin-left:6px}
`;
function ensureCss(){if(document.getElementById("ttcss"))return;const s=document.createElement("style");s.id="ttcss";s.textContent=css;document.head.appendChild(s)}
function box(id){let b=document.getElementById(id);if(!b){b=document.createElement("div");b.id=id;document.body.appendChild(b)}return b}
const running=()=>{const t=T();return t.on&&t.phase==="run"&&S.pm&&S.pm===t.list&&LST()};
/* carte dans « Apprendre à jouer » */
function card(){const t=T(),L=LST(),live=!!(L&&S.pm&&S.pm===t.list&&t.phase==="run");let b;
 if(live)b=`<p class="mu">Partie en cours avec <b>${E(L.name)}</b> · étape ${t.step+1} / ${N}.</p><button class="b p" data-tt="resume">▶ ${t.on?"Ouvrir le guide":"Reprendre le tutoriel"}</button><button class="b" data-tt="reset">↺ Recommencer le guide</button>`;
 else b=`<button class="b p" data-tt="start">🎓 Commencer une partie tutorielle</button><p class="mu">Tu lances une partie comme d'habitude (mêmes écrans que le Mode jeu), avec le guide en plus.</p>`;
 return`<section class="tt-card"><h3>Premières parties</h3><h4>Mode partie tutorielle</h4><p>Découvrez Warhammer 40 000 en réalisant votre première partie. HAMMER vous accompagne à chaque étape, vous explique les règles, vous montre quoi faire et vous aide à comprendre le déroulement d'une bataille.</p>${b}</section>`}
function closeM(id){const o=document.getElementById(id);if(o)o.innerHTML=""}
/* coach */
let SIG="";
const GAME_TABS=["play","pst","bat"];
const PHK=id=>{const st=STEPS.find(x=>x.id===id);return st&&st.pk||""};
function syncPh(){const t=T(),st=STEPS[t.step];if(typeof pph!=="undefined"){const k=(st&&st.pk)||"";if(pph!==k){pph=k;if(tab==="pst"){try{window.draw()}catch(_){}}}}}
function stripHtml(){const t=T(),st=STEPS[t.step],dn=t.done[t.step],lv=t.lvl;
 let more="";if(t.open){more=`<div class="tt-more"><div class="tt-lv">${[["e","Essentiel"],["i","+ Détails"],["a","+ Expert"]].map(x=>`<button class="${lv===x[0]?"on":""}" data-tt="lvl" data-v="${x[0]}">${x[1]}</button>`).join("")}</div><div class="tt-why">💡 ${E(st.why)}</div>${st.e()}<h4>✅ À faire sur la table</h4>${doL(st.doI())}${(lv==="i"||lv==="a")&&st.i()?`<h4>Pour aller plus loin</h4>${st.i()}`:""}${lv==="a"&&st.a()?`<h4>Pour les experts</h4>${st.a()}`:""}<div class="tt-sub"><button class="b" data-tt="units">📇 Fiches</button><button class="b" data-tt="gloss">📖 Règles</button></div></div>`}
 return`<div class="tt-strip" id="tts"><div class="tt-sr"><button class="tt-ic" data-tt="prev" aria-label="Étape précédente"${t.step?"":" disabled"}>◀</button><div class="tt-ti"><b>🎓 ${E(st.t)}${dn?'<span class="tt-done">✓</span>':""}</b><small>Étape ${t.step+1} sur ${N} · ${E(st.ph)}</small></div><button class="tt-ic p" data-tt="next" aria-label="Étape suivante">${t.step===N-1?"✔":"▶"}</button></div>
 <div class="tt-tip">${st.tip||E(TIP[st.id]||"")}</div>
 <div class="tt-sr2"><button data-tt="more">${t.open?"▲ Moins":"▼ Plus d'explications"}</button><button data-tt="q">❓ Question</button><button data-tt="quit" aria-label="Quitter le tutoriel">✕</button></div>${more}</div>`}
function unitTip(u,id){const ws=u.weapons||[],tx=(u.text||[]).join(" ");
 const rng=ws.filter(w=>!isMelee(w)),mel=ws.filter(w=>isMelee(w));
 const wl=a=>a.map(w=>`<b>${E(w.name)}</b> (${isMelee(w)?"mêlée":"portée "+E(w.range)}${/"/.test(String(w.range))?"":'"'}, A ${E(w.a)}, ${isMelee(w)?"CC":"CT"} ${E(w.hit||"-")}, F ${E(w.f)}, PA ${E(w.pa)}, D ${E(w.d)})`).join("<br>");
 if(id==="turn"){const m=/phase\s+de\s+Commandement/i.exec(tx);return m?`Cette unité a une capacité qui parle de la phase de Commandement : ouvre sa fiche pour la lire.`:`Rien à faire pour cette unité à cette phase.`}
 if(id==="move"){const M=u.stats&&num(u.stats.M);return M!=null?`Elle peut se déplacer de <b>${M}"</b>. Si elle avance : <b>${M}" + 1 dé</b>.`:""}
 if(id==="shoot")return rng.length?`Elle peut tirer (si elle n'est pas au contact et n'a pas avancé) avec :<br>${wl(rng)}`:`Cette unité n'a pas d'arme de tir.`;
 if(id==="charge")return`Si elle est à <b>12" ou moins</b> d'un ennemi, elle peut charger : lance <b>2D6</b>.`;
 if(id==="fight")return mel.length?`Au contact, chaque figurine utilise <b>une</b> arme de mêlée :<br>${wl(mel)}`:`Cette unité n'a pas d'arme de mêlée.`;
 if(id==="psy"){const m=psyRe.test(tx+" "+(u.apt||""));return m?`Cette unité a des aptitudes psychiques : lis sa fiche.`:""}
 return""}
function unitOf(k){const m=/^u:([^:]+):(\d+)$/.exec(k)||null,m2=/^l:([^:]+):(\d+):(\d+)$/.exec(k)||null;const L=S.lists.find(l=>l.id===T().list);if(!L)return null;if(m)return L.units[+m[2]]||null;if(m2){const u=L.units[+m2[2]];return u&&(u.subs||[])[+m2[3]]||null}return null}
function hints(){const t=T(),st=STEPS[t.step];document.querySelectorAll(".tt-uhint").forEach(x=>{if(!st||!["turn","move","shoot","charge","fight","psy"].includes(st.id)||tab!=="play")x.remove()});
 if(!st||!["turn","move","shoot","charge","fight","psy"].includes(st.id)||tab!=="play")return;
 document.querySelectorAll(".pu.open").forEach(c=>{const h=c.querySelector(".puh"),k=h&&h.dataset.k,u=k&&unitOf(k);if(!u)return;const txt=unitTip(u,st.id),old=c.querySelector(".tt-uhint");if(!txt){if(old)old.remove();return}
  const html=`<div class="tt-uhint" data-s="${st.id}">🎓 <b>Pour débuter · ${E(st.t)}</b><br>${txt}</div>`;if(old&&old.dataset.s===st.id&&old.dataset.u===u.name)return;if(old)old.remove();const pb=c.querySelector(".pb");if(pb){pb.insertAdjacentHTML("afterbegin",html);const n=pb.querySelector(".tt-uhint");if(n)n.dataset.u=u.name}})}
function render(){ensureCss();upd();const t=T();const old=document.getElementById("tts"),pill=document.getElementById("ttc");if(pill)pill.innerHTML="";
 const on=running()&&GAME_TABS.includes(tab);
 if(!on){if(old)old.remove();SIG="";hints();return}
 const main=document.querySelector("main");if(!main)return;
 const hd=document.querySelector("header");if(hd)document.documentElement.style.setProperty("--tt-top",hd.offsetHeight+"px");
 const sig=[t.step,t.lvl,t.open,t.list,JSON.stringify(t.done),t.u,tab].join("|");
 if(!old||old.parentElement!==main||SIG!==sig){const fresh=document.createElement("div");fresh.innerHTML=stripHtml();const el=fresh.firstChild;if(old)old.remove();main.insertBefore(el,main.firstChild);SIG=sig}
 hints()}
let wizOpen=false;
function launchHint(){const t=T(),w=document.getElementById("gpo"),h=box("ttl2");
 if(w){wizOpen=true;
  if(!w.querySelector("#ttopt")){const top=w.querySelector(".top");if(top){const lb=document.createElement("label");lb.className="tt-opt";lb.innerHTML='<input type="checkbox" id="ttopt"> <span>🎓 <b>Partie tutorielle</b> : HAMMER te guide pas à pas pendant la partie</span>';top.insertAdjacentElement("afterend",lb)}}
  const c=w.querySelector("#ttopt");if(c)c.checked=!!(t.on&&t.phase==="launch");
  const sp=w.querySelector("#ttopt")&&w.querySelector("#ttopt").nextElementSibling;
  if(sp){const e=easiest(),cf=e&&CATFR[e.m.cat],on=t.on&&t.phase==="launch",tx=on&&cf?`<br><small>Conseil : choisis « ${E(cf)} » pour les deux joueurs, valide, puis lance la partie.</small>`:"";const html='🎓 <b>Partie tutorielle</b> : HAMMER te guide pas à pas pendant la partie'+tx;if(sp.dataset.h!==html){sp.dataset.h=html;sp.innerHTML=html}}
 }else{
  if(wizOpen&&!S.pm&&t.phase==="launch"&&t.on){t.on=false;sv()}
  wizOpen=false;if(h.innerHTML){h.innerHTML="";h.dataset.m=""}}}
function tick(){try{launchHint();const t=T();if(t.on&&t.phase==="launch"&&S.pm){t.list=S.pm;t.phase="run";t.min=false;t.step=0;t.done={};sv();SIG=""}render()}catch(e){}}
function openQ(){ensureCss();const o=box("ttq");o.innerHTML=`<div class="tt-ov" data-tt="qx"><div class="tt-pn tt-q"><div class="tt-top"><h2 style="flex:1">❓ Question</h2><button class="b" data-tt="qx">✕</button></div><input id="ttqi" type="search" placeholder="Cherche un mot : touche, sauvegarde, engagée…" autocomplete="off"><div class="tt-qp" id="ttqp">${QP.map((q,i)=>`<button class="b" data-tt="qp" data-i="${i}">${E(q[0])}</button>`).join("")}</div><div id="ttqr"></div><p class="mu">Les réponses viennent uniquement des règles importées dans HAMMER. Si une information manque, je te le dis.</p></div></div>`}
function showQ(html){const r=document.getElementById("ttqr");if(r){r.innerHTML=html;r.scrollIntoView({block:"nearest"})}}
function act(a,b,e){const t=T();
 switch(a){
 case"start":{const ls=S.lists||[];if(!ls.length){try{info("Crée ou importe d'abord une armée (Gestion → Importer).")}catch(_){}break}
  t.on=true;t.phase="launch";t.step=0;t.done={};t.u=0;t.min=false;t.rv=false;t.list=(ls.some(l=>l.id===S.cur)?S.cur:ls[0].id);sv();SIG="";
  if(window.gPrep){tab="lists";try{draw()}catch(_){}window.gPrep(t.list)}break}
 case"go":break;
 case"resume":t.on=true;t.min=false;sv();SIG="";if(S.pm&&S.pm===t.list){t.phase="run";try{draw()}catch(_){}render()}break;
 case"reset":ask({t:"Recommencer le tutoriel ?",p:"Tu repars de l'étape 1. Ta partie en cours n'est pas modifiée.",ok:"Recommencer",dg:1},()=>{t.step=0;t.done={};t.u=0;t.lvl="e";t.min=false;t.on=!!(S.pm&&S.pm===t.list);sv();SIG="";try{draw()}catch(_){}render()});break;
 case"more":t.open=!t.open;sv();SIG="";render();break;
 case"quit":ask({t:"Quitter le tutoriel ?",p:"Ta partie continue normalement. Tu pourras reprendre le tutoriel à cette étape depuis « Apprendre à jouer ».",ok:"Quitter"},()=>{t.on=false;sv();SIG="";render();try{draw()}catch(_){}});break;
 case"next":t.done[t.step]=1;if(t.step<N-1)t.step++;else{t.on=false;try{toast("Bravo, tu as terminé le tutoriel 🎓")}catch(_){}}sv();SIG="";syncPh();render();window.scrollTo(0,0);break;
 case"prev":if(t.step>0){t.step--;sv();SIG="";syncPh();render()}break;
 case"lvl":t.lvl=b.dataset.v;sv();SIG="";render();break;
 case"unext":{const n=UN().length;if(t.u<n-1)t.u++;sv();SIG="";render()}break;
 case"uprev":if(t.u>0)t.u--;sv();SIG="";render();break;
 case"fiche":{const u=UN()[+b.dataset.i];if(u){S.cur=t.list;ed=u;ctx="list";edit=false;try{draw()}catch(_){}}}break;
 case"units":{const us=UN();if(us.length){ensureCss();const o=box("ttq");o.innerHTML=`<div class="tt-ov" data-tt="qx"><div class="tt-pn"><div class="tt-top"><h2 style="flex:1">📇 Fiches</h2><button class="b" data-tt="qx">✕</button></div><div class="tt-qp">${us.map((u,i)=>`<button class="b" data-tt="fiche2" data-i="${i}">${E(u.name)}</button>`).join("")}</div></div></div>`}}break;
 case"fiche2":{closeM("ttq");const u=UN()[+b.dataset.i];if(u){S.cur=t.list;ed=u;ctx="list";edit=false;try{draw()}catch(_){}}}break;
 case"gloss":sv();SIG="";tab="enc";try{draw()}catch(_){}render();break;
 case"strat":sv();SIG="";S.cur=t.list;if(typeof pph!=="undefined")pph=b.dataset.ph||"";tab="pst";try{draw()}catch(_){}render();break;
 case"mis":sv();SIG="";tab="mis";try{draw()}catch(_){}render();break;
 case"score":sv();SIG="";tab="bat";try{draw()}catch(_){}render();break;
 case"wpn":{const p=pickW(b.dataset.m==="1");if(p){sv();SIG="";render();const x=document.createElement("button");x.className="wza";x.style.display="none";x.dataset.dzw=JSON.stringify({u:p.u.name,n:p.w.name,t:b.dataset.m==="1"?"m":"r",a:p.w.a,ct:p.w.hit,f:p.w.f,pa:p.w.pa,d:p.w.d,c:p.w.caps||"",m:1});document.body.appendChild(x);x.click();x.remove()}}break;
 case"q":openQ();break;
 case"qx":if(e.target!==b)return false;closeM("ttq");break;
 case"qp":showQ((QP[+b.dataset.i]||[0,()=>""])[1]());break;
 default:return false}
 return true}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-tt]");if(!b)return;if(b.dataset.tt==="qx"&&e.target!==b&&b.classList.contains("tt-ov"))return;if(b.dataset.tt==="bg"&&e.target!==b)return;const r=act(b.dataset.tt,b,e);if(r!==false){e.preventDefault();e.stopPropagation()}},true);
document.addEventListener("change",e=>{if(e.target&&e.target.id==="ttopt"){const t=T();if(e.target.checked){t.on=true;t.phase="launch";t.step=0;t.done={};t.u=0;t.min=false}else{t.on=false}sv();try{launchHint()}catch(_){}}});
document.addEventListener("input",e=>{if(e.target&&e.target.id==="ttqi"){const q=e.target.value,r=search(q);document.getElementById("ttqp").style.display=q.trim()?"none":"";showQ(q.trim().length<2?"":(r.length?r.map(x=>`<div class="tt-rule"><b>${E(x.n)}</b><p>${E(x.def)}</p></div>`).join(""):`<p class="tt-miss">Je n'ai rien trouvé à ce sujet dans les règles importées : information non disponible.</p>`))}});
/* intégration : carte dans « Apprendre à jouer », rendu après chaque draw(), suivi du lancement de la partie */
window.XV=window.XV||{};const base=window.XV.learn;window.XV.learn=function(){let c="";try{ensureCss();c=card()}catch(e){}return c+(base?base():"")};
const d0=window.draw;if(typeof d0==="function")window.draw=function(){const r=d0.apply(this,arguments);try{render()}catch(e){}return r};
setInterval(tick,250);try{tick()}catch(_){}
window.TUTO={STEPS,T,render,act,get N(){return N}};
})();
