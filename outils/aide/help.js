/* ===== HAMMER · Tuto intégré à chaque onglet (visuel, hors ligne) ===== */
(()=>{
if(typeof S==="undefined")return;
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* [icône, bouton tel qu'il apparaît (ou ""), titre, explication] */
const H={
home:["Accueil","Ton point de départ : tout est à un toucher.",[
 ["🏠","","Tuiles de sections","Chaque tuile ouvre une section : Mes armées, Collection, Peinture, Missions, Centre de commandement, Apprendre à jouer, Règles V11, Importer."],
 ["🎲","Reprendre la partie","Mode jeu","Lance ou reprend une partie : suivi des unités, stratagèmes, points et rounds."],
 ["⚡","Lancer de dés","Outils rapides","Raccourcis : lanceur de dés, nouvelle liste, mes peintures."],
 ["⚙","Personnaliser","Personnaliser","Adapte l'accueil à ta façon de jouer."],
 ["📰","","Actus & mises à jour","Les nouveautés de l'application et des règles."]],
 ["Le bouton rond 🎲 en bas est toujours là pour lancer des dés."]],
lists:["Mes armées","Toutes tes listes d'armée au même endroit.",[
 ["➕","+ Nouvelle liste","Créer une liste","Ajoute une liste vide, ou importe-la depuis l'onglet Importer."],
 ["📷","📷","Photo de l'armée","Ajoute une photo qui s'affiche sur la carte de la liste."],
 ["▶","▶ Jouer","Jouer","Démarre le Mode jeu avec cette liste."],
 ["📂","Gérer","Gérer","Ouvre la liste : unités, détachements, stratagèmes, optimisations."],
 ["✏","Renommer","Renommer","Change le nom de la liste."],
 ["🗑","Supprimer","Supprimer","Retire la liste. Tes figurines restent dans la collection."]]],
units:["Unités d'une liste","Les figurines de ta liste.",[
 ["🃏","","Carte d'unité","Touche une carte pour ouvrir la fiche : profil, armes, aptitudes."],
 ["➕","+ Ajouter une figurine","Ajouter","Choisis une unité de ta collection, puis coche les armes qu'elle aura dans cette liste. Seules les armes validées sont visibles dans la liste."],
 ["📄","Fiche vide","Fiche vide","Crée une fiche à la main (nom, profil, armes)."],
 ["✏","Modifier la liste","Modifier la liste","Réorganise la liste, change son nom ou ses points."],
 ["✕","✕","Retirer","Enlève l'unité de la liste (elle reste en collection)."],
 ["⚔","","Armes de l'unité","Dans la fiche d'une unité de liste, les armes affichées sont celles que tu as validées à l'ajout."]],
 ["Les onglets du haut changent de vue : Unités, Règles de détachement, Stratagèmes, Optimisations."]],
dets:["Règles de détachement","Les règles spéciales de ton détachement.",[
 ["📚","Bibliothèque (3)","Bibliothèque","Tous les détachements déjà enregistrés. Touche-en un pour l'utiliser."],
 ["➕","+ Détachement","Nouveau détachement","Crée un détachement avec sa règle et ses stratagèmes."],
 ["✔","","Utilisé dans cette liste","Le détachement actif : ses stratagèmes sont visibles en jeu."],
 ["👁","Voir ses stratagèmes","Stratagèmes","Ouvre la liste de ses stratagèmes."],
 ["✏","Modifier","Modifier / Supprimer","Corrige ou retire un détachement."]]],
strats:["Stratagèmes","Les astuces à utiliser avec tes points de commandement.",[
 ["➕","+ Stratagème","Ajouter","Crée un stratagème (nom, coût en PC, quand l'utiliser, effet)."],
 ["🔎","Tir","Filtres par phase","Commandement, Mouvement, Tir, Charge, Combat : n'affiche que ceux de la phase."],
 ["📦","Ma liste","Groupes","Stratagèmes de base, puis ceux de ton détachement."]]],
opti:["Optimisations","Les améliorations attachées à tes unités.",[
 ["➕","+ Optimisation","Ajouter","Note une optimisation (visible dans les listes)."],
 ["🧹","Effacer","Effacer","Supprime le texte d'une optimisation."]]],
coll:["Collection","Toutes tes figurines, une fiche par unité.",[
 ["🔎","Rechercher","Recherche","Par nom, mot-clé ou liste."],
 ["☑","Sélectionner","Sélection multiple","Coche plusieurs fiches puis supprime-les d'un coup."],
 ["🏳","+ Faction","Factions","Crée une faction avec sa bannière. Les figurines sont rangées par faction."],
 ["🃏","","Fiche d'unité","Touche une carte : profil, armes, aptitudes. Si tu importes une fiche du même nom avec d'autres armes, elles sont ajoutées à cette même fiche."]]],
paint:["Peinture & Hobby","Suis l'avancement de tes figurines.",[
 ["🖌","🖌 Schémas par figurine","Schémas","Note les couleurs et recettes utilisées pour chaque figurine."],
 ["🎨","🎨 Mes peintures","Peintures","Ta collection de pots de peinture."],
 ["📊","À monter","Statuts","À monter, Monté, Sous-couché, En peinture, Terminé : touche pour changer."],
 ["🏆","","Progression","Le compteur du haut montre combien de figurines sont terminées."]]],
mis:["Missions & Layout","Les cartes de mission et de terrain.",[
 ["🎯","🎯 Primaires","Primaires","Objectifs principaux de la partie."],
 ["⚡","⚡ Secondaires","Secondaires","Objectifs secondaires à tirer ou à choisir."],
 ["🗺","🗺 Layouts","Layouts","Plans de terrain et déploiements."],
 ["📁","+ Dossier de primaires","Dossiers","Crée tes propres dossiers de cartes."],
 ["📄","📄 Importer un PDF","Importer un PDF","Lit un PDF de règles, missions ou layouts et range chaque carte au bon endroit."],
 ["📷","⬆ Exporter mes photos","Photos","Exporte et importe les photos de tes layouts."]]],
ana:["Centre de commandement","Parties, analyses et journal de bataille.",[
 ["🏁","Parties","Parties","Tes parties en cours et terminées, avec tes statistiques de victoires. « Historique manuel » ajoute une partie jouée ailleurs."],
 ["⚔","Affronter","Affronter","Duel : une figurine contre une autre. Simulation : les dés lancés des milliers de fois, avec le détail par arme."],
 ["💡","Conseils","Conseils","Qui envoyer contre qui, cibles prioritaires, unités à protéger, en mots simples."],
 ["📓","Journal","Journal","Tout ce que tu as noté en jouant : dégâts, unités tombées, jets de dés. Export et import possibles."],
 ["🛡","Armées","Armées","Comparer deux armées, simuler une bataille, estimer tes chances de victoire."]],
 ["Choisis tes deux armées en haut : elles servent aux analyses."]],
imp:["Importer","Ajoute des listes et des règles.",[
 ["📄","Importer depuis un PDF","Liste en PDF","Choisis ton PDF : les unités, armes sont lues et ajoutés."],
 ["📋","…ou colle le texte de la liste","Texte","Colle la liste copiée depuis une autre appli."],
 ["🏳","…ou créer une nouvelle faction","Faction","Range les unités importées dans une faction."],
 ["🔁","📄 Rouvrir le dernier PDF","Dernier PDF","Reprend le dernier PDF sans le rechoisir."],
 ["📄","📄 Importer un PDF : règles, missions, layouts","PDF de règles","Range automatiquement missions et layouts."]]],
enc:["Règles V11","Une encyclopédie hors ligne.",[
 ["🔎","Appui","Recherche","Tape un mot-clé ou le nom d'une règle."],
 ["📘","📘 Règles générales","Catégories","Règles générales, mots-clés, aptitudes, armes, terrain…"],
 ["＋","＋ Ajouter une règle","Ajouter","Écris ta propre règle ou précision."],
 ["⇅","⇅ Import / export","Import / export","Sauvegarde ou transfère ton encyclopédie."],
 ["🕓","🕓 Historique","Historique","Retrouve les modifications."],
 ["⚠","59 Règles à compléter","À compléter","Liste ce qui manque ou est ambigu, à valider."]]],
learn:["Apprendre à jouer","Les bases d'une première partie.",[
 ["✅","","Pas à pas","Coche les 8 étapes de ta première partie."],
 ["📖","","Tiroirs","Dés, fiches, phases, attaque, objectifs, vocabulaire : touche un titre pour l'ouvrir."]]],
play:["Mode jeu : Unités","Ta liste, pendant la partie.",[
 ["🔎","","Recherche","Unité, arme, aptitude ou stratagème."],
 ["↕","Tout déplier","Déplier / replier","Ouvre ou ferme toutes les fiches d'un coup."],
 ["🃏","","Fiche d'unité","Touche une unité : profil, armes, aptitudes."],
 ["🎲","3+/4++","Lancer les sauvegardes","Touche la valeur SV 🎲 pour lancer les dés de sauvegarde."],
 ["⚄","A","Lancer les attaques","Dans une arme, touche le nombre d'attaques (A) pour ouvrir le lanceur de dés. Quand c'est fini, 💾 enregistre le tir."],
 ["🩸","🩸","Noter des dégâts","Touche 🩸 à côté d'un nom : dégâts infligés ou subis, tour, figurines perdues. Une unité tombée devient grise et passe en bas."]],
 ["La barre du bas : Unités, Stratagèmes, Score, Règles, Gestion, Terminer."]],
pst:["Mode jeu : Stratagèmes","Les astuces de ton armée.",[
 ["🔎","Tir","Filtres par phase","Commandement, Mouvement, Tir, Charge, Combat : n'affiche que la phase en cours."],
 ["💰","1PC","Coût","Chaque stratagème coûte des points de commandement (PC)."],
 ["📦","Ma liste","Groupes","Stratagèmes de base, puis ceux de ton détachement."]]],
bat:["Mode jeu : Score","Points, commandement et missions.",[
 ["±","+5","Points à la main","−5, −1, +1, +5 : ajoute ou retire des points d'un joueur."],
 ["🔢","R 1","Rounds","Touche R1 à R5 pour voir ou corriger un round."],
 ["🎴","🎴 Tirer 2 secondaires","Objectifs secondaires","Mode Tactique : tire des cartes. Mode Fixe : choisis-les."],
 ["🚩","Suivre les missions de cette partie","Missions","Coche les objectifs réussis : les points se calculent."],
 ["🩸","🩸 État des unités","État des unités","Voir quelles unités sont encore en jeu."],
 ["📋","📋 Récapitulatif","Récapitulatif","Le résumé de la partie."],
 ["♻","Réinitialiser les scores","Remise à zéro","Remet tous les scores à 0."]]]
};
const css=`<style id="hpcss">
.hp{margin:0 0 12px;border:1px solid var(--bd);border-radius:14px;background:var(--card);overflow:hidden}
.hp>summary{list-style:none;display:flex;align-items:center;gap:10px;padding:10px 14px;min-height:48px;cursor:pointer;position:relative;font-weight:800;font-size:14px}.hp>summary::-webkit-details-marker{display:none}
.hp>summary .hp-q{width:28px;height:28px;border-radius:50%;background:var(--ac);color:#fff;display:grid;place-items:center;font-size:15px;flex:none}.hp>summary small{display:block;font-weight:400;font-size:12px;color:var(--mu)}
.hp>summary::after{content:"›";position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:22px;color:var(--mu);transition:transform .2s}.hp[open]>summary::after{transform:translateY(-50%) rotate(90deg)}
.hp-b{padding:2px 12px 12px;border-top:1px solid var(--bd)}.hp-i{display:grid;grid-template-columns:34px 1fr;gap:10px;padding:10px 0;border-top:1px solid var(--bd)}.hp-i:first-child{border-top:0}
.hp-ic{font-size:22px;text-align:center;line-height:1.2}.hp-i b{display:block;font-size:14px}.hp-i p{margin:2px 0 0;font-size:13px;line-height:1.4;color:var(--mu)}
.hp-k{display:inline-block;margin:4px 0 2px;padding:3px 12px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-size:12.5px;font-weight:700;box-shadow:0 1px 0 rgba(0,0,0,.25)}
.hp-t{margin:8px 0 0;padding:8px 10px;border-left:4px solid var(--ac);background:var(--bg);border-radius:8px;font-size:12.5px;line-height:1.4}
</style>`;
function html(k){const h=H[k];if(!h)return"";const tips=h[3]||[];
 return`<details class="hp" data-hp="${k}"><summary><span class="hp-q">?</span><div>Tuto : ${E(h[0])}<small>${E(h[1])}</small></div></summary><div class="hp-b">${h[2].map(i=>`<div class="hp-i"><span class="hp-ic">${i[0]}</span><div><b>${E(i[2])}</b>${i[1]?`<span class="hp-k">${E(i[1])}</span>`:""}<p>${E(i[3])}</p></div></div>`).join("")}${tips.map(t=>`<div class="hp-t">💡 ${E(t)}</div>`).join("")}</div></details>`}
let busy=false,OPEN={};
function mount(){if(busy)return;busy=true;try{const m=document.getElementById("m");if(!m||typeof tab==="undefined")return;
 if(!document.getElementById("hpcss"))document.head.insertAdjacentHTML("beforeend",css);
 const k=tab;const cur=m.querySelector(":scope>.hp");
 if(!H[k]){if(cur)cur.remove();return}
 if(cur&&cur.dataset.hp===k)return;if(cur)cur.remove();
 m.insertAdjacentHTML("afterbegin",html(k));const d=m.querySelector(":scope>.hp");if(d&&OPEN[k])d.open=true}
 catch(e){}finally{busy=false}}
document.addEventListener("toggle",e=>{const d=e.target;if(d&&d.classList&&d.classList.contains("hp"))OPEN[d.dataset.hp]=d.open},true);
let tm=null;new MutationObserver(()=>{if(busy)return;clearTimeout(tm);tm=setTimeout(mount,50)}).observe(document.body,{childList:true,subtree:true});
mount();
window.HELPUI={mount,topics:Object.keys(H)};
})();
