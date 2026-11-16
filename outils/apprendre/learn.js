/* ===== HAMMER · Apprendre à jouer : les bases d'une première partie (V11, résumé reformulé, hors ligne) ===== */
(()=>{
if(typeof S==="undefined")return;
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const st=()=>{const l=S.learn=S.learn&&typeof S.learn==="object"?S.learn:{};if(!l.ck)l.ck={};return l};
const STEPS=[
 ["Choisis une mission","Elle indique la taille des armées, le déploiement et comment on gagne. Tu la trouves dans « Missions & Layout »."],
 ["Prépare ton armée","Une liste d'unités dans « Mes armées ». Ton adversaire fait pareil."],
 ["Installe le champ de bataille","Une table, du décor, les objectifs, comme la mission le demande."],
 ["Déploie tes unités","Pose-les dans ta zone de déploiement, selon la mission."],
 ["Lance le « Mode jeu »","L'appli suit les rounds, les points de commandement et le score."],
 ["Joue 5 rounds","À chaque round, chaque joueur joue un tour de 5 phases (voir plus bas)."],
 ["Marque les points","Selon ta mission, à la fin des phases ou des tours."],
 ["Compare les scores","Le plus haut total gagne la partie."]];
const PH=[
 ["1 · Commandement","Chaque joueur gagne <b>1 point de commandement (PC)</b>. Pour chaque unité <b>ébranlée</b> ou réduite à la moitié de ses effectifs (ou moins), tu fais un jet d'ébranlement : 2D6 ≥ son Cd. Réussi : elle n'est plus ébranlée."],
 ["2 · Mouvement","Chaque unité choisit <b>une</b> option : <b>rester immobile</b> ; <b>mouvement normal</b> (jusqu'à sa valeur M en pouces, si elle n'est pas engagée) ; <b>avance</b> (M + 1D6, mais elle ne pourra ni charger ni tirer normalement ce tour) ; <b>retraite</b> (si elle est engagée)."],
 ["3 · Tir","Chaque unité qui n'est pas engagée et qui n'a pas avancé peut tirer avec ses armes de tir. La cible doit être <b>visible</b>, <b>à portée</b> et <b>non engagée</b>. Une unité engagée ne tire presque pas (armes [Combat rapproché], Monstres et Véhicules)."],
 ["4 · Charge","Une unité à <b>12\" ou moins</b> d'un ennemi (non engagée, qui n'a ni avancé ni battu en retraite) déclare une charge. Tu lances <b>2D6</b> : c'est la distance maximale. Elle doit finir son mouvement <b>engagée</b> avec les cibles de charge, sinon la charge est ratée."],
 ["5 · Combat","Les <b>deux</b> joueurs combattent avec leurs unités engagées. Celles qui ont chargé ce tour combattent <b>en premier</b>, puis on alterne. Chaque figurine utilise <b>une</b> arme de mêlée."]];
const WT=[["Force ≥ 2 × Endurance","2+"],["Force > Endurance","3+"],["Force = Endurance","4+"],["Force < Endurance","5+"],["Force ≤ ½ Endurance","6+"]];
const GL=[
 ["Engagée","Une unité est engagée quand une de ses figurines est à <b>2\" ou moins</b> d'une unité ennemie."],
 ["Cohésion","À la fin d'un mouvement, chaque figurine doit être à 2\" d'une autre figurine de son unité et à 9\" de toutes les autres."],
 ["Ébranlée","Unité qui a perdu son moral : son Contrôle d'objectif tombe à « - » et elle ne peut plus être ciblée par des stratagèmes."],
 ["Effectif initial","Nombre de figurines de l'unité au début de la partie. « À demi-effectif » = il en reste la moitié (ou moins)."],
 ["Joueur actif","Celui dont c'est le tour."],
 ["PC","Points de commandement : on les dépense pour utiliser des stratagèmes. Chaque joueur en gagne 1 par tour."],
 ["Stratagème","Une astuce qui coûte des PC. Tu ne peux pas utiliser le même stratagème deux fois dans la même phase, ni cibler la même unité avec deux stratagèmes dans la même phase."]];
const dr=(ic,t,sub,body)=>`<details class="lr-d"><summary><span class="lr-i">${ic}</span><div><b>${t}</b><small>${sub}</small></div></summary><div class="lr-b">${body}</div></details>`;
function view(){const l=st(),done=STEPS.filter((_,i)=>l.ck[i]).length;
 return`<div class="lrn"><h2>Apprendre à jouer</h2><p class="mu" style="margin:0 0 10px">Juste ce qu'il faut savoir pour une première partie. Règles V11, résumées avec mes mots.</p>
 <div class="lr-hero"><b>L'essentiel en 30 secondes</b><ul><li>Chaque joueur a une <b>armée</b> d'unités (des figurines).</li><li>Une partie dure en général <b>5 rounds</b>. À chaque round, chaque joueur joue un <b>tour</b> de <b>5 phases</b>.</li><li>Une <b>mission</b> dit comment se placer et comment <b>gagner des points</b>.</li><li>On lance des dés à 6 faces : « <b>4+</b> » veut dire « 4 ou plus ».</li></ul></div>
 ${dr("✅","Ta première partie pas à pas",done+" / "+STEPS.length+" étapes cochées",`<div class="lr-steps">${STEPS.map((s,i)=>`<label class="lr-s${l.ck[i]?" on":""}"><input type="checkbox" data-lr="${i}"${l.ck[i]?" checked":""}><span><b>${E(s[0])}</b><small>${E(s[1])}</small></span></label>`).join("")}</div><button class="b" data-lrx="reset">Tout décocher</button>`)}
 ${dr("🎒","Avant de commencer","Ce qu'il te faut",`<ul><li>Ton armée (figurines + liste dans l'appli).</li><li>Un adversaire, avec son armée.</li><li>Une table avec du décor.</li><li>Un <b>mètre ruban en pouces (\")</b> : toutes les distances se mesurent en pouces, entre les socles.</li><li>Des <b>dés à 6 faces</b> (D6). L'appli a un lanceur de dés intégré.</li><li>Une <b>mission</b> : elle décide du déploiement et de la victoire.</li></ul>`)}
 ${dr("🎲","Les dés","D6, 4+, 2D6…",`<ul><li><b>4+</b> : il faut faire 4 ou plus sur le dé.</li><li><b>2D6</b> : deux dés additionnés. <b>D3</b> : un D6 divisé par 2, arrondi au supérieur. <b>D6+1</b> : un D6 plus 1.</li><li>Sur un jet de touche ou de blessure, un <b>1 non modifié</b> échoue toujours et un <b>6 non modifié</b> est une réussite critique.</li></ul>`)}
 ${dr("📇","Lire une fiche d'unité","Les chiffres à connaître",`<div class="lr-g"><div><b>M</b> Mouvement (en pouces)</div><div><b>E</b> Endurance : résistance</div><div><b>Sv</b> Sauvegarde : l'armure (ex. 3+)</div><div><b>SvIn</b> Sauvegarde invulnérable, si elle existe</div><div><b>PV</b> Points de vie</div><div><b>Cd</b> Commandement (courage)</div><div><b>CO</b> Contrôle d'objectif</div></div><p class="mu" style="margin:8px 0 4px">Chaque arme a :</p><div class="lr-g"><div><b>Portée</b> (« Mêlée » = corps à corps)</div><div><b>A</b> nombre d'attaques (dés)</div><div><b>CT / CC</b> précision au tir / au corps à corps</div><div><b>F</b> Force</div><div><b>PA</b> pénétration d'armure (ex. -1)</div><div><b>D</b> dégâts par attaque</div></div>`)}
 ${dr("🔄","Un tour = 5 phases","Dans cet ordre, à chaque tour",PH.map(p=>`<div class="lr-p"><b>${p[0]}</b><div>${p[1]}</div></div>`).join(""))}
 ${dr("🎯","Faire une attaque","Toucher, blesser, sauvegarde, dégâts",`<ol class="lr-o"><li><b>Choisis les armes.</b> Au tir, une ou plusieurs armes de tir par figurine. Au combat, <b>une seule</b> arme de mêlée par figurine.</li><li><b>Choisis les cibles.</b> Au tir : une unité ennemie visible, à portée et non engagée (par arme). Au combat : des unités engagées avec la figurine.</li><li><b>Lance autant de dés que la valeur A.</b> Pour chaque dé :</li></ol>
  <div class="lr-p"><b>① Toucher</b><div>Le dé doit être ≥ CT (tir) ou CC (mêlée).</div></div>
  <div class="lr-p"><b>② Blesser</b><div>Compare la Force de l'arme à l'Endurance de la cible :</div><table class="lr-t">${WT.map(r=>`<tr><td>${r[0]}</td><td><b>${r[1]}</b></td></tr>`).join("")}</table></div>
  <div class="lr-p"><b>③ Sauvegarde</b><div>L'adversaire lance 1 dé par blessure. La PA de l'arme <b>baisse</b> le dé (PA -1 : un 3 devient un 2). Si le dé modifié est ≥ Sv, l'attaque est arrêtée. Un 1 non modifié ne sauve jamais. Une Sv invulnérable se compare au dé non modifié.</div></div>
  <div class="lr-p"><b>④ Dégâts</b><div>Chaque attaque non arrêtée retire D points de vie à une figurine de l'unité (en priorité une figurine déjà blessée). À 0 PV, elle est détruite.</div></div>`)}
 ${dr("🚩","Objectifs et points","Qui contrôle un objectif ?",`<ul><li>Chaque joueur additionne le <b>CO</b> de ses figurines qui sont <b>sur l'objectif</b> (dans sa zone).</li><li>Le total le <b>plus élevé</b> contrôle l'objectif. À égalité, personne.</li><li>Une unité <b>ébranlée</b> a un CO de « - » : elle ne compte plus.</li><li>Les <b>points de victoire</b> se marquent selon ta mission. L'appli les suit dans le Mode jeu.</li></ul>`)}
 ${dr("📖","Mots à connaître","Le vocabulaire de base",GL.map(g=>`<div class="lr-p"><b>${g[0]}</b><div>${g[1]}</div></div>`).join(""))}
 ${dr("💡","Conseils pour débuter","Pour que ça se passe bien",`<ul><li>Fais une <b>petite partie</b> pour la première fois.</li><li>Ne lis pas toutes les aptitudes à l'avance : regarde-les quand elles servent. Touche un nom d'aptitude dans la fiche pour la relire.</li><li>Utilise le <b>Mode jeu</b> et le <b>lanceur de dés</b> : ils font les comptes à ta place.</li><li>Dans le doute, demande à ton adversaire et relis l'onglet <b>Règles V11</b>.</li><li>Une règle d'une unité ou d'une mission l'emporte sur la règle générale, quand elle dit le contraire.</li></ul>`)}
 <p class="lr-src">Source : Règles de Base Warhammer 40,000 V11 (Warhammer Community). Résumé simplifié, sans reprendre le texte officiel.</p></div>`}
window.XV=window.XV||{};window.XV.learnData={STEPS,PH,WT,GL};window.XV.learn=()=>{try{return css()+view()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
const css=()=>"";
document.addEventListener("change",e=>{const t=e.target;if(!t||t.dataset.lr==null)return;const l=st();l.ck[+t.dataset.lr]=t.checked?1:0;if(!t.checked)delete l.ck[+t.dataset.lr];try{save()}catch(_){}const lab=t.closest(".lr-s");if(lab)lab.classList.toggle("on",t.checked);const d=t.closest(".lr-d"),sm=d&&d.querySelector("summary small");if(sm)sm.textContent=Object.keys(l.ck).length+" / "+STEPS.length+" étapes cochées"});
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-lrx]");if(!b)return;st().ck={};try{save();draw()}catch(_){}});
})();
