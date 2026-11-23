/* ===== HAMMER · Tuto de chaque menu : petit rond « ? » discret, ouvre un guide pas à pas (hors ligne) ===== */
(()=>{
if(typeof S==="undefined")return;
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* t = titre · s = à quoi sert ce menu · st = pas à pas (dans l'ordre) · it = chaque bouton/zone [icône, libellé du bouton, titre, explication] · tp = astuces */
const H={
home:{t:"Accueil",s:"Le point de départ : toutes les sections de l'application sont ici.",
 st:["Touche une tuile (Mes armées, Collection, Peinture…) pour ouvrir la section.","Pour jouer : touche « Mode jeu », choisis ta liste, et suis l'assistant.","Pour lancer des dés tout de suite : « Lancer de dés » dans Outils rapides, ou le bouton rond 🎲 de l'écran.","Pour revenir ici depuis n'importe où : touche l'icône 🏠 de la barre du bas.","Le petit rond « ? » en bas à gauche de chaque menu rouvre cette aide."],
 it:[["🛡","Mes armées","Mes armées","Tes listes d'armée : créer, modifier, vérifier, jouer, partager."],
 ["🎯","Missions & Layout","Missions & Layout","Les cartes de mission, les objectifs secondaires et les plans de terrain."],
 ["📦","Collection","Collection","Toutes tes figurines, une fiche par unité."],
 ["🎨","Peinture & Hobby","Peinture & Hobby","L'avancement de tes figurines, tes schémas et tes pots de peinture."],
 ["📘","Règles V11","Règles V11","L'encyclopédie des règles, consultable hors ligne."],
 ["📊","Centre de commandement","Centre de commandement","Tes parties jouées, statistiques, duels, conseils et journal."],
 ["🎓","Apprendre à jouer","Apprendre à jouer","Les bases pour une première partie, et la partie tutorielle guidée."],
 ["🛠","Constructeur d'armée","Constructeur d'armée","Compose une armée légale : points, détachements, équipements vérifiés."],
 ["📜","Lore","Lore","Ton carnet d'histoire de l'univers (texte et images que tu écris)."],
 ["🔔","Nouveautés","Nouveautés","Ce qui a changé dans l'appli et dans la bibliothèque, mise à jour manuelle."],
 ["🎲","Mode jeu","Mode jeu","Lance ou reprend une partie : unités, stratagèmes, score, journal."],
 ["📥","Importer","Importer","Ajoute des listes ou des règles depuis un PDF ou un texte collé."],
 ["⚙","Personnaliser","Personnaliser","Choisis ce qui s'affiche sur l'accueil."]],
 tp:["Rien n'est envoyé sur internet : tes données restent sur ton appareil.","L'application marche hors ligne ; elle se met à jour toute seule quand une connexion est disponible."]},
lists:{t:"Mes armées",s:"Toutes tes listes d'armée. Chaque carte montre le nom, les points et l'état de la vérification.",
 st:["Pour une armée vérifiée par les règles V11 : touche « 🛠 Créer une armée » (voir le tuto du Constructeur).","Pour une liste rapide sans contrôle : touche « + Liste simple », donne-lui un nom.","Pour reprendre une liste envoyée par un ami : « 📥 Recevoir une liste », puis scanne ou colle son code.","Ouvre une liste avec « Gérer » pour voir et modifier ses unités.","Pour la jouer : « ▶ Jouer » sur la carte.","Avant une partie : « ✅ Vérifier » contrôle la liste (points, détachement, équipements)."],
 it:[["🛠","🛠 Créer une armée","Créer une armée","Ouvre le Constructeur : choix de faction, détachement, unités et équipements contrôlés en direct."],
 ["➕","+ Liste simple","Liste simple","Une liste vide à remplir à la main. Aucun blocage, tu gères tout."],
 ["📥","📥 Recevoir une liste","Recevoir une liste","Reçois une liste d'un autre appareil par QR code ou code texte."],
 ["📷","📷","Photo","Ajoute une photo d'armée affichée sur la carte."],
 ["▶","▶ Jouer","Jouer","Démarre le Mode jeu avec cette liste."],
 ["✅","✅ Vérifier","Vérifier la liste","Rapport : points, limite d'unités, détachement, équipements illégaux, avec la correction à faire. Rouge = à corriger, orange = à vérifier."],
 ["📂","Gérer","Gérer","Ouvre la liste : unités, règles de détachement, stratagèmes, optimisations."],
 ["⇄","⇄ Envoyer","Envoyer","Affiche un QR code / code pour copier la liste sur un autre téléphone."],
 ["✏","Renommer","Renommer","Change le nom."],
 ["🗑","Supprimer","Supprimer","Efface la liste. Les fiches de ta collection restent."]],
 tp:["Une liste créée dans le Constructeur affiche un badge de conformité ; une liste simple n'est pas contrôlée.","Pense à vérifier ta liste avant de partir jouer."]},
units:{t:"Unités d'une liste",s:"Le contenu d'une liste : une carte par unité, avec effectif, points et équipement.",
 st:["Touche une carte pour ouvrir la fiche (profil, armes, aptitudes).","Pour ajouter une unité : « + Ajouter une figurine », choisis-la, valide.","Pour changer l'équipement : touche « ⚙ Équipement » sur la carte, puis la figurine à modifier.","Dans la fiche d'une figurine : touche une arme pour la choisir. Les armes incompatibles sont grisées avec la raison.","Touche « Enregistrer » : tu reviens à la liste des figurines, puis enregistre l'unité.","Pour modifier l'effectif ou les points à la main : champs « Fig. » et « Pts » de la carte.","Pour vérifier toute la liste : bouton « ✅ Vérifier la liste »."],
 it:[["🃏","","Carte d'unité","Nom, nombre de figurines, points et statut d'équipement (✅ conforme / ❌ à corriger / ⚠ non configuré)."],
 ["⚙","⚙ Équipement","Équipement","Configure les armes figurine par figurine. C'est le seul endroit où changer les armes d'une unité contrôlée."],
 ["➕","+ Ajouter une figurine","Ajouter","Unité de ta collection ou de la bibliothèque, puis choix des armes."],
 ["📄","Fiche vide","Fiche vide","Crée une fiche à la main si l'unité n'existe nulle part."],
 ["👤","+X pts meneur / appui","Meneur et appui","Un personnage qui rejoint l'unité : ses points sont ajoutés à part."],
 ["✅","✅ Vérifier la liste","Vérifier la liste","Contrôle V11 de toute la liste."],
 ["✏","Modifier la liste","Modifier la liste","Réorganise ou renomme la liste."],
 ["✕","✕","Retirer","Enlève l'unité de la liste ; elle reste en collection."],
 ["📑","Onglets du haut","Unités / Détachement / Stratagèmes / Optimisations","Chaque onglet montre une partie de la liste."]],
 tp:["Une unité ⚠ « non configuré » vient d'un import : touche ⚙ pour choisir son équipement.","Un import ne perd jamais tes points ni tes armes : l'ancien équipement est conservé."]},
dets:{t:"Règles de détachement",s:"Les règles spéciales de ton détachement (une armée en choisit un ou plusieurs selon sa taille).",
 st:["Regarde la bibliothèque (📚) : les détachements déjà connus.","Touche un détachement pour l'utiliser dans cette liste.","Il se marque « Utilisé » : ses stratagèmes apparaissent en jeu.","Pour en créer un à la main : « + Détachement » (règle et stratagèmes).","Modifier / Supprimer corrige ou retire un détachement que tu as créé."],
 it:[["📚","Bibliothèque","Bibliothèque","Tous les détachements enregistrés."],["➕","+ Détachement","Nouveau détachement","Crée ta propre règle."],["✔","","Utilisé dans cette liste","Le détachement actif."],["👁","Voir ses stratagèmes","Stratagèmes","Ouvre la liste de ses stratagèmes."],["✏","Modifier","Modifier / Supprimer","Corrige ou retire."]],
 tp:["Chaque détachement coûte des points de détachement ; le Constructeur t'empêche de dépasser la limite."]},
strats:{t:"Stratagèmes",s:"Les astuces à jouer avec tes points de commandement (PC).",
 st:["Choisis la phase avec les filtres (Commandement, Mouvement, Tir, Charge, Combat).","Lis le coût en PC et le moment où on peut le jouer.","Pour ajouter le tien : « + Stratagème » (nom, coût, quand, effet).","Les stratagèmes de base viennent en premier, puis ceux de ton détachement."],
 it:[["➕","+ Stratagème","Ajouter","Nom, coût en PC, moment, effet."],["🔎","Tir","Filtres par phase","Ne montre que la phase choisie."],["📦","Ma liste","Groupes","Base puis détachement."]]},
opti:{t:"Optimisations",s:"Les améliorations rattachées à tes personnages.",
 st:["« + Optimisation » : écris son nom, son coût et son effet.","Elle apparaît sur la liste qui la porte.","Dans le Constructeur, les optimisations sont choisies directement sur le personnage et vérifiées (une seule par personnage, pas deux fois la même)."],
 it:[["➕","+ Optimisation","Ajouter","Note une amélioration."],["🧹","Effacer","Effacer","Supprime le texte."]]},
coll:{t:"Collection",s:"Toutes tes figurines, une fiche par unité (profil, armes, aptitudes).",
 st:["Pour chercher : champ « Rechercher » (nom, mot-clé, équipement ou liste).","Touche une carte pour ouvrir la fiche.","Pour ajouter depuis la bibliothèque V11 : « 📚 Bibliothèque », choisis les unités, « ➕ Ajouter à ma collection ».","Pour une faction : « + Faction », nom et bannière ; tes figurines se rangent dedans.","Pour supprimer plusieurs fiches : « Sélectionner », coche, puis supprime.","Pour lier une fiche à la bibliothèque : touche 📚 sur la fiche (indispensable pour vérifier l'équipement)."],
 it:[["🔎","Rechercher","Recherche","Par nom, mot-clé, équipement ou liste."],["📚","📚 Bibliothèque","Bibliothèque V11","Catalogue officiel des unités avec points et équipements."],["🏳","+ Faction","Factions","Crée une faction."],["☑","Sélectionner","Sélection multiple","Coche plusieurs fiches."],["🔗","🔗","Lien bibliothèque","Une fiche non liée ne peut pas être vérifiée : lie-la en une touche."],["🗑","Tout supprimer","Tout supprimer","Vide la collection (confirmation demandée)."]],
 tp:["Une fiche importée avec le même nom que l'existante y ajoute ses armes sans rien écraser."]},
bib:{t:"Bibliothèque V11",s:"Le catalogue officiel (Space Marines, Orks, etc.) : unités, détachements, stratagèmes, améliorations, règles.",
 st:["Filtre par faction avec la liste déroulante.","Choisis un onglet : Unités, Détachements, Stratagèmes, Améliorations, Règles.","Touche un élément pour lire sa fiche.","Pour ajouter des unités : « ☐ Sélectionner », coche, puis « ➕ Ajouter à ma collection ».","« ⚠ À vérifier » liste ce qui est incertain.","« ⚙ Gérer » ouvre la mise à jour et les licences."],
 it:[["🔎","Rechercher","Recherche","Français ou anglais."],["➕","➕ Ajouter à ma collection","Ajouter","Crée la fiche dans ta collection, liée à la bibliothèque."],["⚠","⚠ À vérifier","À vérifier","Points ou règles incertains."],["⚙","⚙ Gérer","Gérer","Mise à jour des données et sources."]]},
paint:{t:"Peinture & Hobby",s:"L'avancement de tes figurines, tes schémas de peinture et tes pots.",
 st:["Cherche une figurine ou une faction dans le champ du haut.","Touche l'état d'une figurine : À monter, Monté, Sous-couché, En peinture, Terminé.","« 🖌 Schémas par figurine » : note les couleurs utilisées.","« 🎨 Mes peintures » : ta collection de pots. Pour en ajouter, scanne le code-barres ou cherche la marque.","Sur un pot : touche la couleur plein écran, ± pour la quantité, état Plein / Vide / À acheter.","Le compteur du haut montre le pourcentage terminé."],
 it:[["📊","À monter … Terminé","Statuts","Touche pour changer l'état."],["🖌","🖌 Schémas par figurine","Schémas","Recettes par figurine."],["🎨","🎨 Mes peintures","Peintures","Tes pots, avec quantité et état."],["📷","Scanner","Scanner un pot","Lit le code-barres et retrouve le pot (nécessite l'appareil photo)."],["🏆","","Progression","Pourcentage de figurines terminées."]]},
mis:{t:"Missions & Layout",s:"Cartes de mission, objectifs secondaires et plans de terrain.",
 st:["Choisis un onglet : 🎯 Primaires, ⚡ Secondaires, 🗺 Layouts, 📁 Autres.","Cherche une carte avec le champ de recherche.","Touche une carte pour lire sa mission.","Pour importer des cartes : « 📄 Importer un PDF », le PDF est lu et chaque carte rangée.","« + Dossier de primaires » crée ton propre dossier.","« ⬆ Exporter mes photos » sauvegarde les photos de layouts ; « ⬇ Importer des photos » les restaure."],
 it:[["🎯","🎯 Primaires","Primaires","Objectifs principaux."],["⚡","⚡ Secondaires","Secondaires","Objectifs secondaires."],["🗺","🗺 Layouts","Layouts","Plans de terrain."],["📄","📄 Importer un PDF","Importer un PDF","Range automatiquement."],["📷","⬆ Exporter mes photos","Photos","Export / import."]]},
ana:{t:"Centre de commandement",s:"Tes parties, statistiques, duels, conseils et journal.",
 st:["Onglet « 🏁 Parties » : tes parties en cours et terminées. « Historique manuel » ajoute une partie jouée ailleurs.","Filtre avec « Filtres » pour regarder un adversaire ou un détachement.","Onglet « ⚔ Affronter » : duel (une figurine contre une autre) ou simulation.","Onglet « 💡 Conseils » : qui envoyer contre qui.","Onglet « 📓 Journal » : tout ce que tu as noté en jouant.","Onglet « 🛡 Armées » : choisis deux armées pour les comparer."],
 it:[["🏁","🏁 Parties","Parties","Historique et statistiques de victoires."],["⚔","⚔ Affronter","Affronter","Duel ou simulation, avec le détail par arme."],["💡","💡 Conseils","Conseils","Cibles prioritaires, unités à protéger."],["📓","📓 Journal","Journal","Dégâts, unités tombées, jets. Export / import."],["🛡","🛡 Armées","Armées","Comparer deux armées."]]},
imp:{t:"Importer",s:"Ajoute des listes ou des règles depuis un PDF ou un texte.",
 st:["Donne un nom à la liste (facultatif : points de l'armée).","Choisis la faction des figurines, ou laisse « Automatique ».","Choisis un PDF avec « Importer depuis un PDF », ou colle le texte de la liste.","Touche « Importer ».","Va dans Mes armées : ouvre la liste et, sur chaque unité ⚠, touche ⚙ pour choisir l'équipement.","« 📄 Importer un PDF : règles, missions, layouts » range automatiquement les cartes."],
 it:[["📄","Importer depuis un PDF","Liste en PDF","Lit unités et armes."],["📋","…ou colle le texte","Texte","Colle une liste copiée d'une autre appli."],["🏳","…ou créer une faction","Faction","Range les figurines importées."],["🔁","Rouvrir le dernier PDF","Dernier PDF","Reprend sans rechoisir."]],
 tp:["Les points ne sont pas recalculés à l'import : ils sont conservés tels que lus."]},
enc:{t:"Règles V11",s:"L'encyclopédie hors ligne des règles.",
 st:["Tape un mot-clé dans la recherche.","Ou choisis une catégorie : Règles générales, Mots-clés, Aptitudes, Armes, Terrain…","Touche une règle pour la lire.","« ＋ Ajouter une règle » : écris ta propre précision.","« 🕓 Historique » retrouve les modifications ; « ⇅ Import / export » sauvegarde l'encyclopédie.","« Nouvelles règles à valider » liste ce qui vient d'être détecté."],
 it:[["🔎","Rechercher","Recherche","Mot-clé ou nom."],["📘","Catégories","Catégories","Règles générales, mots-clés, aptitudes, armes, terrain."],["＋","＋ Ajouter une règle","Ajouter","Ta propre règle."],["⇅","⇅ Import / export","Import / export","Sauvegarde."],["🕓","🕓 Historique","Historique","Modifications."]]},
learn:{t:"Apprendre à jouer",s:"Les bases pour une première partie.",
 st:["Lis les tiroirs dans l'ordre : Avant de commencer, Les dés, Lire une fiche, Un tour, Une attaque, Objectifs, Vocabulaire, Conseils.","Coche les 8 étapes de « Ta première partie pas à pas » au fur et à mesure.","Pour être guidé en direct : « 🎓 Commencer une partie tutorielle » ; l'assistant du Mode jeu s'ouvre avec la partie tutorielle cochée.","Pendant la partie tutorielle, un bandeau en haut des écrans de jeu te dit quoi faire à chaque étape."],
 it:[["🎓","🎓 Commencer une partie tutorielle","Partie tutorielle","Un coach pas à pas par-dessus le Mode jeu."],["✅","","Pas à pas","8 étapes à cocher."],["📖","","Tiroirs","Touche un titre pour l'ouvrir."]]},
bld:{t:"Constructeur d'armée",s:"Crée une armée légale en 4 étapes : Armée, Règles, Unités, Vérifier.",
 st:["Écran de départ : donne un nom, choisis la faction, la limite de points (500 / 1000 / 2000 ou saisie), un format facultatif, puis « Créer l'armée → ».","Étape 1 « Armée » : vérifie faction et limite, puis « ➕ Choisir un détachement » (le coût en points de détachement est affiché).","Étape 2 « Règles » : lis la règle de faction et celle du détachement ; « Suivant ».","Étape 3 « Unités » : « ➕ Ajouter une unité », cherche (français ou anglais), filtre par collection / bibliothèque / rôle, touche l'unité.","Écran de configuration : choisis l'effectif (le coût s'adapte), l'équipement, un meneur ou un appui, une amélioration (personnages).","Pour l'équipement : touche une figurine, touche les armes à prendre dans sa fiche (les incompatibles sont grisées), « Enregistrer », puis « Ajouter à l'armée ».","Si un choix est illégal, une fenêtre explique pourquoi : « Modifier » pour corriger ou « Ajouter quand même » à tes risques.","Étape 4 « Vérifier » : le verdict V11 liste les erreurs et leur correction. Corrige jusqu'au vert, puis enregistre."],
 it:[["1","1 Armée","Armée","Faction, limite de points, détachement."],["2","2 Règles","Règles","Règle de faction et de détachement."],["3","3 Unités","Unités","Ajoute et configure."],["4","4 Vérifier","Vérifier","Verdict et corrections."],["🔎","Rechercher une unité…","Catalogue","📦 collection, 📚 bibliothèque ou toutes ; 🔗 = fiche à lier."],["⚙","⚙ Équipement","Équipement","Fiche figurine par figurine ; seule porte pour changer les armes."],["±","Composition","Composition","Nombre de figurines de chaque type (ex. 1 Sergent + 4)."],["💰","Équipements payants","Équipements payants","Coût en plus, selon le barème Wahapedia."],["⛔","Fenêtres de blocage","Blocages","Dépassement d'effectif, arme interdite, doublon d'amélioration, limite d'unités."],["ℹ","ℹ Comment ça marche ?","Aide du Constructeur","Rappel des règles V11 : limites de points, d'unités, de personnages épiques."]],
 tp:["Incursion 1000 pts : 2 pts de détachement, 2 améliorations, 2 exemplaires max d'une unité ; Strike Force 2000 pts : 3 / 4 / 3.","Un doublon est doublé pour les unités Battleline et les Transports dédiés ; les Héros épiques : 1 seul.","Une amélioration par personnage, jamais sur un Héros épique."]},
lore:{t:"Lore",s:"Ton carnet personnel d'univers : tu écris, il garde.",
 st:["Touche une rubrique : Histoire, Personnages, Organisations, Couleurs et Héraldique.","Touche « ✎ Modifier » pour écrire ou changer le texte.","Ajoute des images si tu veux, puis enregistre."],
 it:[["✎","✎ Modifier","Modifier","Écris ton texte."],["📚","Rubriques","Rubriques","Quatre rubriques de départ."]]},
news:{t:"Nouveautés",s:"Ce qui a changé et l'état de tes données.",
 st:["« 🔄 Vérifier maintenant » cherche une mise à jour (connexion nécessaire).","Ouvre un tiroir « 📚 Bibliothèque » pour voir ce qui a changé dans les règles et les points.","Ouvre un tiroir « 🛠 Application » pour lire les nouveautés de l'appli."],
 it:[["🔄","🔄 Vérifier maintenant","Mise à jour","Cherche les données récentes."],["⚠","⚠️🌐","Hors ligne","Indique qu'il n'y a pas de connexion."]],
 tp:["Sur l'APK, l'application se met à jour toute seule au lancement."]},
play:{t:"Mode jeu : Unités",s:"Ta liste, pendant la partie.",
 st:["Cherche une unité, une arme, une aptitude ou un stratagème.","Touche une unité pour déplier sa fiche ; « Tout déplier » ouvre toutes les fiches.","Touche la valeur de sauvegarde pour lancer les dés de sauvegarde.","Dans une arme, touche le nombre d'attaques pour ouvrir le lanceur de dés, puis 💾 enregistre le tir.","Touche 🩸 à côté d'un nom pour noter dégâts, tour et figurines perdues.","Une unité détruite devient grise et passe en bas.","Barre du bas : Unités, Stratagèmes, Score, Règles, Gestion, Terminer."],
 it:[["🔎","","Recherche","Unité, arme, aptitude ou stratagème."],["↕","Tout déplier","Déplier / replier","Ouvre ou ferme toutes les fiches."],["🎲","3+/4++","Sauvegardes","Lance les dés de sauvegarde."],["⚄","A","Attaques","Lanceur de dés."],["🩸","🩸","Dégâts","Note dégâts et pertes."]]},
pst:{t:"Mode jeu : Stratagèmes",s:"Les stratagèmes de ton armée, par phase.",
 st:["Choisis la phase avec les filtres.","Lis le coût en PC et le moment où il se joue.","Les stratagèmes de base d'abord, puis ceux de ton détachement."],
 it:[["🔎","Tir","Filtres","Phase en cours."],["💰","1PC","Coût","Points de commandement."]]},
bat:{t:"Mode jeu : Score",s:"Points de victoire, commandement et missions.",
 st:["Touche ±1 / ±5 pour modifier les points d'un joueur.","Touche R1 à R5 pour voir ou corriger un round.","« 🎴 Tirer 2 secondaires » (mode tactique) ou choisis-les (mode fixe).","« 🚩 Suivre les missions de cette partie » : coche les objectifs réussis, les points se calculent.","« 🩸 État des unités » montre ce qui est encore en jeu ; « 📋 Récapitulatif » résume la partie.","Termine avec « Terminer » en bas : la partie est enregistrée dans le Centre de commandement."],
 it:[["±","+5","Points","−5, −1, +1, +5."],["🔢","R 1","Rounds","R1 à R5."],["🎴","🎴 Tirer 2 secondaires","Secondaires","Tactique ou fixe."],["🚩","Suivre les missions","Missions","Objectifs cochés."],["♻","Réinitialiser les scores","Remise à zéro","Remet à 0."]]}
};
const ALIAS={gm:"ana",str:"strats",strats0:"strats",dets0:"dets",det:"dets",enh:"opti",rules:"enc",chk:"lists"};
const css=`<style id="hpcss">
#hpq{position:fixed;left:10px;bottom:calc(74px + env(safe-area-inset-bottom,0px));z-index:16;width:30px;height:30px;border-radius:50%;border:1px solid var(--bd);background:var(--card);color:var(--mu);font:700 15px/1 system-ui;display:grid;place-items:center;opacity:.55;cursor:pointer;padding:0;box-shadow:0 1px 6px rgba(0,0,0,.25)}#hpq:active,#hpq:hover{opacity:1;color:var(--ac)}
#hpov{position:fixed;inset:0;z-index:60;background:rgba(5,12,9,.65);display:flex;align-items:flex-end;justify-content:center}
.hpn{background:var(--card);color:var(--tx);width:min(640px,100%);max-height:92vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px 16px 20px;box-shadow:0 -10px 40px rgba(0,0,0,.5)}
.hpn h2{margin:0;font-size:20px}.hpn .hp-s{color:var(--mu);font-size:13px;margin:2px 0 8px}
.hp-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.hp-x{min-width:40px;min-height:40px;border-radius:50%;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-size:16px;cursor:pointer}
.hp-h{margin:16px 0 6px;padding:6px 10px;border-radius:8px;background:var(--ac);color:#fff;font-weight:800;font-size:12.5px;letter-spacing:.6px;text-transform:uppercase}
.hp-o{counter-reset:s;list-style:none;padding:0;margin:0}.hp-o li{counter-increment:s;display:grid;grid-template-columns:30px 1fr;gap:8px;padding:8px 0;border-top:1px solid var(--bd);font-size:14px;line-height:1.4}.hp-o li:first-child{border-top:0}
.hp-o li::before{content:counter(s);width:24px;height:24px;border-radius:50%;background:var(--ac);color:#fff;display:grid;place-items:center;font-weight:800;font-size:12px}
.hp-i{display:grid;grid-template-columns:34px 1fr;gap:10px;padding:9px 0;border-top:1px solid var(--bd)}.hp-i:first-of-type{border-top:0}
.hp-ic{font-size:21px;text-align:center;line-height:1.2}.hp-i b{display:block;font-size:14px}.hp-i p{margin:2px 0 0;font-size:13px;line-height:1.4;color:var(--mu)}
.hp-k{display:inline-block;margin:3px 0 1px;padding:2px 10px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-size:12px;font-weight:700}
.hp-t{margin:6px 0 0;padding:8px 10px;border-left:4px solid #e08a2c;background:var(--bg);border-radius:8px;font-size:13px;line-height:1.4}
.hp-ok{width:100%;margin-top:14px;min-height:46px;border:0;border-radius:12px;background:var(--ac);color:#fff;font:inherit;font-weight:800;font-size:15px;cursor:pointer}
</style>`;
const gcss=`<style id="gmcss">
header .chrp{position:absolute;right:12px;top:55px;margin:0;padding:1px 9px;font-size:12px;background:rgba(255,255,255,.18)}
.mzb:has(>.chrp:only-child){display:block;height:0;min-height:0;margin:0;padding:0;overflow:visible}
header .mbq{padding:3px 8px 4px 12px;gap:1px}header .mbc button,header .mbq button{min-height:30px;min-width:30px}header .mbc b{font-size:17px}header .mbl b{font-size:18px}
</style>`;
const key=()=>{const k=typeof tab!=="undefined"?tab:"home";return H[k]?k:(ALIAS[k]&&H[ALIAS[k]]?ALIAS[k]:null)};
function html(k){const h=H[k];return`<div class="hpn" role="dialog" aria-label="Tuto : ${E(h.t)}"><div class="hp-top"><div><h2>${E(h.t)}</h2><div class="hp-s">${E(h.s)}</div></div><button class="hp-x" data-hpx aria-label="Fermer">✕</button></div>
 <div class="hp-h">Pas à pas</div><ol class="hp-o">${h.st.map(x=>`<li><span>${E(x)}</span></li>`).join("")}</ol>
 <div class="hp-h">Chaque bouton, en détail</div>${h.it.map(i=>`<div class="hp-i"><span class="hp-ic">${i[0]}</span><div><b>${E(i[2])}</b>${i[1]?`<span class="hp-k">${E(i[1])}</span>`:""}<p>${E(i[3])}</p></div></div>`).join("")}
 ${(h.tp||[]).length?`<div class="hp-h">À savoir</div>${h.tp.map(x=>`<div class="hp-t">${E(x)}</div>`).join("")}`:""}
 <button class="hp-ok" data-hpx>J'ai compris</button></div>`}
function open(k){k=k||key();if(!k)return;close();document.body.insertAdjacentHTML("beforeend",`<div id="hpov">${html(k)}</div>`)}
function close(){const o=document.getElementById("hpov");if(o)o.remove()}
document.addEventListener("click",e=>{const t=e.target;if(!t||!t.closest)return;if(t.closest("#hpq")){e.preventDefault();open();return}if(t.closest("[data-hpx]")){close();return}if(t.id==="hpov")close()},true);
function mount(){try{if(!document.getElementById("hpcss"))document.head.insertAdjacentHTML("beforeend",css);if(!document.getElementById("gmcss"))document.head.insertAdjacentHTML("beforeend",gcss);
 const old=document.querySelector("#m>.hp");if(old)old.remove();
 let b=document.getElementById("hpq");if(!b){b=document.createElement("button");b.id="hpq";b.type="button";b.title="Tuto de ce menu";b.setAttribute("aria-label","Tuto de ce menu");b.textContent="?";document.body.appendChild(b)}
 b.style.display=key()?"":"none"}catch(e){}}
let tm=null;new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(mount,80)}).observe(document.body,{childList:true,subtree:true});
mount();
window.HELPUI={mount,open,topics:Object.keys(H)};
})();
