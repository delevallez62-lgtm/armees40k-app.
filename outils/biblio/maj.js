/* ---------- mises à jour : détail, propagation, nouvelles fiches, nouveautés, modifications de l'utilisateur ---------- */
/* Journal de l'application (écrit à la main, plus récent d'abord). id croissant. */
const APPLOG=[
 {id:53,d:"2026-11-23",t:"Fiche plein écran par figurine",s:"Au choix des armes figurine par figurine, touche une figurine : sa fiche s'ouvre directement (caractéristiques, équipement actuel, profils de toutes les armes proposées). Touche une arme pour la choisir, puis « Enregistrer » te ramène à la liste des figurines."},
 {id:52,d:"2026-11-23",t:"Fiche de la figurine",s:"En choisissant les armes figurine par figurine, touche une figurine : sa fiche s'affiche avec toutes les caractéristiques de son équipement actuel, et chaque arme proposée montre son profil (portée, A, touche, F, PA, D, capacités) avant que tu la choisisses."},
 {id:51,d:"2026-11-23",t:"Armes : un seul clic",s:"Dans le choix des armes, touche simplement le nom de l'arme : celles qui ne sont plus permises se grisent avec la raison. Le choix figurine par figurine est affiché directement ; les boutons ＋/− par quantité sont dans « Ajuster par quantité ». Même principe pour les fiches sans mode figurine."},
 {id:50,d:"2026-11-22",t:"Équipement ＋/− partout",s:"Le bouton ⚙ Équipement ＋/− est maintenant sur chaque unité d'une liste d'armée et dans sa fiche : mêmes règles que le constructeur (options bloquées avec raison, composition, vérification). Après l'import d'une unité liée à la bibliothèque, le choix des armes ouvre aussi ce configurateur. Dans la fiche d'une unité de liste, on ne peut plus ajouter ni supprimer une arme à la main. Les points et les profils d'armes de l'unité ne changent pas ; l'ancien équipement est conservé. Un pastille ✅ / ⚠️ / ❌ indique la conformité."},
 {id:49,d:"2026-11-22",t:"Équipement : ＋ / − par arme, composition variable",s:"Dans la configuration d'une unité, chaque option d'arme a un ＋ et un − : le ＋ l'attribue à la première figurine qui peut la recevoir, le − la retire ; le ＋ se bloque dès que la règle de la fiche est atteinte (raison affichée). Le détail figurine par figurine reste disponible. Les unités à composition variable (ex. Boyz : Nobs et Boyz) permettent de régler la composition."},
 {id:48,d:"2026-11-21",t:"Équipement figurine par figurine",s:"Dans la configuration d'une unité, l'équipement se règle figurine par figurine (sergent, figurines, personnage) d'après les options de la fiche : chaque option est disponible, choisie ou bloquée avec sa raison (maximum pour l'effectif, arme déjà remplacée, réservée à une autre figurine). Aucune configuration illégale ne peut être conservée ; la liste est vérifiée avant l'enregistrement. Les fiches dont les options ne sont lues qu'en partie sont signalées « validation partielle ». L'appli Android se met à jour toute seule (au lancement et au retour dans l'appli)."},
 {id:47,d:"2026-11-20",t:"Constructeur : options d'arme lues bien plus complètement",s:"La lecture des options d'équipement des fiches couvre maintenant 86 % des options (97 % des unités sont lues en entier) : « pour chaque 5 figurines, 1 peut être équipée de… » (ex. lance-grenades des Intercessors), « jusqu'à N », « si l'unité compte N figurines »… Une arme dépassant le plafond est refusée. Si une arme dépend d'une option que l'appli ne sait pas lire, elle demande confirmation au lieu de l'ajouter en silence."},
 {id:46,d:"2026-11-20",t:"Constructeur : armes regroupées, blocages et messages courts",s:"Les armes dont le nom ne diffère que par un suffixe (« - Standard », « (Supercharge) », profils d'une arme combinée ou d'un poing tronçonneur) forment une seule ligne : un compteur ajoute tous les profils. Tout changement qui rend l'unité hors règles (arme, équipement, effectif, optimisation) est refusé avec une raison courte ; à l'ajout, une fenêtre propose Modifier ou Ajouter quand même. Le récapitulatif et le rapport de vérification sont simplifiés : verdict, erreurs, puis détails repliés."},
 {id:45,d:"2026-11-19",t:"Constructeur : options d'arme contrôlées",s:"Dans la configuration d'une unité, une arme ou un équipement qui dépasse les options de la fiche (ex. 2 armes spéciales pour 5 figurines) est refusé avec l'explication. En touchant « Ajouter à l'armée », si l'unité n'est pas conforme (équipement, exemplaires, limite de points…), une fenêtre indique pourquoi et propose de modifier ou d'ajouter quand même."},
 {id:44,d:"2026-11-19",t:"Vérifier ma liste (règles V11)",s:"Le bouton ✅ Vérifier contrôle une liste d'armée : détail des points (barème officiel), points de détachement, nombre d'optimisations, optimisation au bon endroit (détachement choisi, personnage, pas de héros épique, une par unité), limite d'exemplaires, seigneur de guerre, effectifs, rattachements, équipements et options de la fiche. Il rappelle aussi ce qu'il faut pour un tournoi et copie la liste au format de soumission."},
 {id:43,d:"2026-11-18",t:"Listes d'armée : figurines et points",s:"Chaque liste affiche toujours son nombre de figurines et ses points. Dans une liste, chaque fiche montre sur le côté son effectif et ses points, modifiables à volonté (le total se met à jour). Pour une armée du constructeur, changer l'effectif recalcule les points d'après le barème ; un coût saisi à la main est conservé."},
 {id:42,d:"2026-11-18",t:"Peinture : pot en image, quantité et état",s:"Quand un pot est scanné, son image (de la couleur du pot) apparaît au milieu de l'écran avec ＋ et − : ＋ l'ajoute à ta liste, − le retire. En ouvrant une peinture de ta liste tu retrouves le même schéma en plus petit pour gérer plusieurs pots, et en dessous l'état du pot : Plein (par défaut), Vide ou À acheter (écrit « Vide » ou « Achat à prévoir » dans la liste)."},
 {id:41,d:"2026-11-18",t:"Peinture : scanner un pot par son code-barres",s:"Dans Peinture › Mes peintures, le tiroir « ➕ Ajouter une nouvelle peinture » (fermé par défaut) contient le scanner de code-barres (caméra, photo ou capture d'écran, saisie à la main), la lecture de pot, l'import de capture et les peintures courantes. Le catalogue (8 300 peintures, 3 900 codes-barres) fonctionne hors ligne et se met à jour chaque nuit."},
 {id:40,d:"2026-11-18",t:"Import : même unité sous un autre nom ?",s:"Quand tu importes une unité (texte ou PDF) très proche d'une fiche de ta collection ou de la bibliothèque (mêmes caractéristiques et armes) mais avec un autre nom, l'appli te demande s'il s'agit de la même unité. Si tu confirmes, le nom existant est remplacé par celui de l'import partout, sans doublon."},
 {id:39,d:"2026-11-18",t:"Deuxième passe de traduction des noms",s:"441 noms de capacités, stratagèmes, améliorations, détachements et règles de faction traduits en plus (propositions à vérifier). Les noms de personnages, de lieux, de clans, le jargon ork et les noms d'équipements propres restent en anglais ; tu peux les corriger dans Nouveautés › Traduction."},
 {id:38,d:"2026-11-18",t:"Nouveautés › Traduction",s:"Le menu Traduction s'ouvre depuis le bouton ⚠️🌐 à côté de la bannière de l'onglet Nouveautés. Il rassemble tout ce qui n'est pas encore traduit, en tiroirs fermés qui reprennent l'aspect de l'appli (fiche d'unité, stratagème, amélioration, détachement, règle). Tu modifies, tu enregistres : la traduction est appliquée partout où ce texte apparaît."},
 {id:37,d:"2026-11-18",t:"Points par nombre de figurines vérifiés automatiquement",s:"Chaque fiche de la bibliothèque affiche maintenant ses points selon le nombre de figurines (et selon le numéro de l'unité dans l'armée). La mise à jour quotidienne depuis Wahapedia contrôle ces points contre le fichier de Wahapedia avant de publier : en cas d'écart, rien n'est publié."},
 {id:36,d:"2026-11-17",t:"Menu Lore personnel",s:"Un espace Lore entièrement personnalisable et vierge : Histoire en tiroirs et chapitres (textes et images), Personnages, Organisations, Couleurs et Héraldique. Tout est modifiable, réorganisable, et reste sur ton appareil."},
 {id:35,d:"2026-11-17",t:"Lanceur de dés : aptitude Torrent",s:"Après le premier jet (toucher), un bouton « 🌊 Torrent » dans les capacités de l'arme fait réussir tous les dés : tu valides et tu passes directement à la blessure. Les touches automatiques ne comptent pas comme critiques. Tu peux le désactiver pour revenir aux vrais jets."},
 {id:34,d:"2026-11-17",t:"Mise à jour des noms français sur tous les appareils",s:"Correction : les nouveaux noms français (Sororitas et autres) étaient bien dans la bibliothèque mais certains appareils gardaient l'ancienne copie. La bibliothèque se recharge maintenant dès que des noms ou traductions changent."},
 {id:33,d:"2026-11-17",t:"Noms français provisoires visibles",s:"Dans la bibliothèque, le nom français fourni s'affiche même quand il est provisoire (astérisque), avec la mention « ⚠ provisoire ». Il reste dans l'onglet « À vérifier » jusqu'à validation."},
 {id:32,d:"2026-11-17",t:"Noms français Adepta Sororitas",s:"Les noms français de ta liste Sororitas sont enregistrés (34 confirmés tels quels, 4 provisoires marqués « à vérifier »). Les noms anglais restent pour la recherche."},
 {id:31,d:"2026-11-17",t:"Mission de la liste reprise en mode jeu ; points de détachement bien visibles",s:"En mode jeu, la mission principale choisie dans la liste est reprise automatiquement quand tu sélectionnes cette liste. Dans la liste des détachements, le coût de chacun s'affiche en gros et un bandeau indique les points utilisés et restants."},
 {id:30,d:"2026-11-17",t:"Ajouter des unités à la collection depuis la bibliothèque",s:"Chaque unité de la bibliothèque a un bouton « Ajouter à ma collection » (liste et fiche), avec sélection multiple. La fiche est générée avec le nom français, les profils, armes et capacités, et liée à la bibliothèque ; si elle y est déjà, c'est indiqué."},
 {id:29,d:"2026-11-17",t:"Onglet « À vérifier » dans la bibliothèque",s:"Un nouvel onglet de la bibliothèque rassemble les noms français à confirmer (tu peux les corriger, les valider ou les garder en anglais) et les fiches de ta collection pas encore liées (tu les lies à la main, avec des propositions)."},
 {id:28,d:"2026-11-17",t:"Recherche en français et en anglais",s:"Dans la bibliothèque, la collection et le constructeur, tu peux taper le nom français ou anglais d'une unité (avec ou sans accents) : la fiche est retrouvée et affichée avec son nom français validé ; le nom anglais reste indiqué sur la fiche."},
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
 let h=`<div class="card"><div class="row" style="justify-content:space-between"><b>🆕 Nouveautés</b><span style="display:inline-flex;gap:6px"><button class="b" data-trn="open" title="Traductions à faire" aria-label="Traductions à faire" style="font-size:18px;min-width:52px">⚠️🌐</button><button class="b" data-bibnw="check">🔄 Vérifier maintenant</button></span></div><p class="bib-meta">${lb.last&&lb.last.ok?"Dernière version : "+E(lb.last.ok):"Version "+E(D.man?D.man.version:"")}${lb.last?" · vérifiée "+fmtD(lb.last.at):""}${lb.last&&lb.last.err?" · ⚠ "+E(lb.last.err):""}</p></div>`;
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

/* ===== Nouveautés › Traduction : tout ce qui n'est pas encore traduit, en tiroirs qui reprennent l'aspect de l'appli ===== */
const TRN={done:{},kind:"units",q:"",more:25,ver:0,key:"",items:[],open:{},fields:{}};
const trUn=t=>t.st!=="ok"&&(!t.prop||nk(t.prop)===nk(t.t));
function trCur(t,en){return t.st==="ok"?t.t:(t.prop&&nk(t.prop)!==nk(en)?t.prop:"")}
function trItems(){if(!D.ready||!KPREADY){if(D.ready&&!KP)buildKP();return null}
 const key=(D.man&&D.man.version||"")+"|"+TRN.ver;if(TRN.key===key)return TRN.items;const o=[];
 D.units.forEach(u=>{let a=trUn(tName(u.n));(u.ab||[]).forEach(x=>{if(trUn(tAB(x.n))||trUn(trDesc(x.d)))a=true});if(a)o.push({kind:"units",id:u.id,n:u.n,sub:facLbl(u)})});
 D.str.forEach((x,i)=>{let a=trUn(tName(x.n));["when","tg","fx","rs"].forEach(k=>{if(x[k]&&trUn(trDesc(x[k])))a=true});if(a)o.push({kind:"str",id:String(i),n:x.n,sub:x.det||x.f||""})});
 D.enh.forEach((x,i)=>{if(trUn(tName(x.n))||trUn(trDesc(x.d)))o.push({kind:"enh",id:String(i),n:x.n,sub:x.det||""})});
 D.dets.forEach((x,i)=>{let a=trUn(tName(x.n));if(x.ab&&trUn(trDesc(x.ab.description)))a=true;(x.abx||[]).forEach(y=>{if(trUn(trDesc(y.description)))a=true});if(a)o.push({kind:"det",id:String(i),n:x.n,sub:x.f||""})});
 (D.rules||[]).forEach((x,i)=>{if(trUn(tName(x.n))||trUn(trDesc(x.d)))o.push({kind:"rules",id:String(i),n:x.n,sub:""})});
 TRN.key=key;TRN.items=o.filter(x=>!TRN.done[x.kind+":"+x.id]);return TRN.items}
const trKindLab={units:"Fiches d'unités",str:"Stratagèmes",enh:"Améliorations",det:"Détachements",rules:"Règles"};
/* un champ éditable : le texte français prérempli, l'original en dessous */
function trField(key,en,isName,rows){en=String(en||"");if(!en.trim())return"";const f=TRN.fields[key]=TRN.fields[key]||[],i=f.length;f.push({en,name:!!isName});
 const t=isName?tName(en):trDesc(en),cur=trCur(t,en);
 return`<div class="trf ${t.st==="ok"?"ok":""}"><textarea data-trfi="${i}" rows="${isName?1:Math.min(8,Math.max(2,Math.ceil(stripMd(en).length/48)))}" placeholder="Traduction française…">${E(stripMd(cur))}</textarea><div class="bib-meta" style="font-size:11px">Original : ${E(stripMd(en).slice(0,260))}${en.length>260?"…":""}</div></div>`}
function trBody(it){const key=it.kind+":"+it.id;TRN.fields[key]=[];let h="";
 if(it.kind==="units"){const u=D.byId[it.id];if(!u)return"";const p=profOf(u,0);
  h+=`<h4 style="margin-top:0">${trField(key,u.n,1)}</h4><p class="bib-meta">${E(facLbl(u))}${u.pts!=null?" · "+u.pts+" pts":""}</p>`;
  h+=`<div class="sg">${["M","E","SV","PV","CD","CO"].map(k=>`<div class="sx"><i>${k}</i><b>${E(statOf(p,k)||"–")}</b></div>`).join("")}</div>`;
  const w=[...(u.rw||[]).map(x=>wToApp(x,false)),...(u.mw||[]).map(x=>wToApp(x,true))];if(w.length)h+=`<div class="bib-meta">${w.map(x=>E(x.name)+" ("+E(x.range)+" · A "+E(x.a)+" · "+E(x.hit)+" · F "+E(x.f)+" · PA "+E(x.pa)+" · D "+E(x.d)+")").join("<br>")}</div>`;
  h+=`<h4>Capacités</h4>`+(u.ab||[]).map(a=>`<div class="bib-row"><b>${trField(key,a.n,1)}</b>${trField(key,a.d,0)}</div>`).join("")||"<p class=\"bib-meta\">Aucune capacité.</p>";
  h+=`<h4>Mots-clés</h4><p>${(u.kw||[]).map(k=>E(tKW(k).t)).join(", ")}</p>`}
 else if(it.kind==="str"){const x=D.str[+it.id];if(!x)return"";const ph=tPhase(x.ph||"");
  h+=`<h4 style="margin-top:0">${trField(key,x.n,1)} <span class="bib-st">${x.cp!=null?x.cp+" PC":""}</span></h4><p class="bib-meta">${E(x.det||x.f||"")} · Phase : ${E(ph.t)}${x.t?" · "+E(x.t):""}</p>`;
  [["when","Quand"],["tg","Cible"],["fx","Effet"],["rs","Restrictions"]].forEach(([k,l])=>{if(x[k])h+=`<p><b>${l} :</b></p>`+trField(key,x[k],0)})}
 else if(it.kind==="enh"){const x=D.enh[+it.id];if(!x)return"";h+=`<h4 style="margin-top:0">${trField(key,x.n,1)}</h4><p class="bib-meta">${E(x.det||"")}${x.pts!=null?" · "+x.pts+" pts":""}</p>`+trField(key,x.d,0)}
 else if(it.kind==="det"){const x=D.dets[+it.id];if(!x)return"";h+=`<h4 style="margin-top:0">${trField(key,x.n,1)}</h4><p class="bib-meta">${E(x.f||"")}${x.pts!=null?" · "+x.pts+" point(s) de détachement":""}</p>`;
  if(x.ab)h+=`<div class="bib-row"><b>${trField(key,x.ab.name,1)}</b><div class="bib-meta">(règle du détachement)</div>${trField(key,x.ab.description,0)}</div>`;(x.abx||[]).forEach(y=>{h+=`<div class="bib-row"><b>${trField(key,y.name,1)}</b>${trField(key,y.description,0)}</div>`})}
 else if(it.kind==="rules"){const x=D.rules[+it.id];if(!x)return"";h+=`<h4 style="margin-top:0">${trField(key,x.n,1)}</h4>`+trField(key,x.d,0)}
 return h+`<div class="row" style="gap:6px;margin-top:10px"><button type="button" class="b p" data-trn="save" data-k="${E(key)}">✔ Enregistrer</button><span class="bib-meta" style="align-self:center">La traduction s'applique partout où ce texte apparaît.</span></div>`}
function trSection(){return`<h3 style="margin:14px 0 6px;font-size:14px;opacity:.7">🌐 Traduction</h3><details class="card" id="nwtr"><summary style="font-size:14px">Ouvrir : tout ce qui n'est pas encore traduit</summary><div id="nwtrc" style="margin-top:8px"></div></details>`}
function trRender(){const c=document.getElementById("nwtrc");if(!c)return;const all=trItems();if(all===null){c.innerHTML=`<p class="bib-meta">Analyse des traductions en cours…</p>`;setTimeout(trRender,700);return}
 const q=nk(TRN.q),cnt={};all.forEach(x=>cnt[x.kind]=(cnt[x.kind]||0)+1);
 const L=all.filter(x=>x.kind===TRN.kind&&(!q||nk(x.n+" "+x.sub+" "+tName(x.n).t).includes(q))).sort((a,b)=>a.n.localeCompare(b.n));
 c.innerHTML=`<p class="bib-meta">${all.length} élément${all.length>1?"s":""} avec du texte non traduit. Ouvre un tiroir, modifie, enregistre : le texte est remplacé partout.</p><div class="bib-chips" style="flex-wrap:wrap">${Object.keys(trKindLab).map(k=>`<button class="${TRN.kind===k?"on":""}" data-trn="kind" data-v="${k}">${trKindLab[k]} (${cnt[k]||0})</button>`).join("")}</div><input id="trnq" placeholder="Rechercher…" value="${E(TRN.q)}" style="width:100%;margin:8px 0" autocomplete="off">
 ${L.slice(0,TRN.more).map(it=>{const key=it.kind+":"+it.id;return`<details class="bib-nw" data-trk="${E(key)}" ${TRN.open[key]?"open":""}><summary><b>${E(tName(it.n).t)}</b> <span class="bib-meta">${E(it.sub)}</span></summary><div class="trb" ${TRN.open[key]?"":'data-empty="1"'}>${TRN.open[key]?trBody(it):""}</div></details>`}).join("")||`<p class="bib-meta">✅ Rien à traduire dans cette catégorie.</p>`}
 ${L.length>TRN.more?`<button class="b" data-trn="more" style="width:100%">Voir plus (${L.length-TRN.more})</button>`:""}`}
document.addEventListener("toggle",e=>{const d=e.target;if(!d)return;if(d.id==="nwtr"&&d.open){trRender();return}
 if(d.dataset&&d.dataset.trk){const key=d.dataset.trk;TRN.open[key]=d.open;if(d.open){const b=d.querySelector(".trb");if(b&&b.dataset.empty){const it=(TRN.items||[]).find(x=>x.kind+":"+x.id===key);if(it){b.innerHTML=trBody(it);delete b.dataset.empty}}}}},true);
document.addEventListener("input",e=>{const t=e.target;if(t&&t.id==="trnq"){TRN.q=t.value;TRN.more=25;clearTimeout(TRN.t);TRN.t=setTimeout(()=>{trRender();const i=document.getElementById("trnq");if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},300)}});
function trOpen(){css();const o=box("bibtr");o.innerHTML=`<div class="bib-ov" data-trn="bgx"><div class="bib-pn"><div class="bib-top"><h2>🌐 Traduction</h2><button class="b" data-trn="close" aria-label="Fermer">✕</button></div><div id="nwtrc"></div></div></div>`;trRender()}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-trn]");if(!b)return;const a=b.dataset.trn;if(a==="bgx"&&e.target!==b)return;e.preventDefault();e.stopPropagation();
 if(a==="open"){trOpen();return}if(a==="close"||a==="bgx"){closeM("bibtr");return}
 if(a==="kind"){TRN.kind=b.dataset.v;TRN.more=25;trRender();return}
 if(a==="more"){TRN.more+=25;trRender();return}
 if(a==="save"){const key=b.dataset.k,det=b.closest("details"),f=TRN.fields[key]||[];let n=0;
  det.querySelectorAll("[data-trfi]").forEach(t=>{const fd=f[+t.dataset.trfi];if(!fd)return;const v=t.value.trim();if(!v)return;const cur=fd.name?tName(fd.en):trDesc(fd.en);if(cur.st==="ok"&&nk(cur.t)===nk(v)&&cur.src==="user"||cur.st==="ok"&&nk(cur.t)===nk(v))return;
   const k=hh(fd.en);TXM[k]={en:fd.en,name:fd.name};storeTr(k,v);n++});
  if(n){TRN.done[key]=1;TRN.open[key]=false}TRN.ver++;try{toast(n?n+" traduction"+(n>1?"s":"")+" enregistrée"+(n>1?"s":"")+" ✓ (appliquée partout)":"Rien à enregistrer")}catch(_){}
  try{window.BIBTRW&&0}catch(_){}try{draw()}catch(_){}setTimeout(trRender,50)}
},true);
window.XV=window.XV||{};XV.news=function(){try{if(!D.ready&&!D.err)init();return nwView()}catch(e){return`<div class="card"><b>Erreur</b><p class="mu">${E(e&&e.message)}</p></div>`}};
/* ----- lancement : mise à jour automatique puis fenêtre de résumé ----- */
setTimeout(async()=>{try{const lb=LB();await init();
 if(lb.auto&&navigator.onLine&&!(lb.last&&Date.now()-lb.last.at<10*60*1000)){const r=await checkUpdate(false);if(r.state==="updated"){try{draw()}catch(_){}}}
 popup()}catch(_){try{popup()}catch(__){}}},1800);
window.BIBMAJ={unitDiff,saveOvr,applyOvr,majAfter,popup,APPLOG};
