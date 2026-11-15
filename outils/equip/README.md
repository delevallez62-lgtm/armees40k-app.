# Équipements, restrictions et validation (HAMMER)

Module hors ligne ajouté à `index.html` par `patch-eq.py` (moteur `eq-engine.js`, interface `eq-ui.js`, styles `eq.css`).

* **Variantes d'armes** : regroupées sans suppression. `S.coll[ref].prim` = fiche de référence, `.mrg` = variante fusionnée (masquée),
  `.cfgs` = configurations, `.eqw` = toutes les armes connues. Les armes d'origine de chaque fiche ne sont jamais modifiées.
  Sauvegarde complète avant migration : `localStorage["armees40k_bk_eq1"]` (restauration dans l'onglet Collection).
* **Armées** : `S.lists[].units[]` gardent exactement leurs armes ; `unit.eq = {m:[{r,w:[...]}]}` = équipement figurine par figurine.
* **Restrictions** : `S.eqc[nom de l'unité] = [{id,t:max|min|role|excl|fixed,w,n,role,ws,st:off|sec|pdf|user,ok,src}]`.
  Extraites du texte des fiches (statut « pdf — à vérifier »), jamais inventées. Rouge seulement si la restriction est confirmée.
* Tests moteur : `node eq-test.js`.

## Données officielles V11 (hors ligne, sans IA)
`build-restrictions.py` lit les **Packs de Faction officiels** (Warhammer Community, PDF français, convertis par `pdftotext -layout`) avec des règles de lecture déterministes
et produit `data/eq-official.json` / `data/eq-data.js` (embarqué dans l'appli). 97 fiches (Chaos Daemons, Nécrons, Aeldari, etc.) ; seules les nouvelles fiches des packs sont publiées par GW.
Aucun texte officiel n'est recopié : seulement des restrictions structurées + document + page. Les options trop complexes sont comptées (`x`) et signalées « à vérifier ».
Une fiche officielle n'est appliquée que si ses armes correspondent à celles de la fiche de l'utilisateur (vérification de version).

## Wahapedia V11 (source secondaire fiable, hors ligne ensuite)
`build-wahapedia.js` lit l'export de données officiel de Wahapedia (CSV, édition 11, voir https://wahapedia.ru/wh40k11ed/the-rules/data-export/ ; « powered by Wahapedia »)
et produit `data/eq-wahapedia.json` / `data/eq-wp.js` (embarqué) : ~1 440 fiches V11 (toutes factions, dont ~190 Space Marines), options d'équipement, effectif et équipement de base.
Statut `sec` (source secondaire fiable). Priorité : PDF importés > Packs de Faction officiels > Wahapedia. Données au 2026-11-12.
Mise à jour : `curl` des CSV `Datasheets`, `Datasheets_options`, `Datasheets_unit_composition`, `Factions`, `Source`, `Last_update` puis `node build-wahapedia.js <dossier>`.
