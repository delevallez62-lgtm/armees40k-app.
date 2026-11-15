# Équipements, restrictions et validation (HAMMER)

Module hors ligne ajouté à `index.html` par `patch-eq.py` (moteur `eq-engine.js`, interface `eq-ui.js`, styles `eq.css`).

* **Variantes d'armes** : regroupées sans suppression. `S.coll[ref].prim` = fiche de référence, `.mrg` = variante fusionnée (masquée),
  `.cfgs` = configurations, `.eqw` = toutes les armes connues. Les armes d'origine de chaque fiche ne sont jamais modifiées.
  Sauvegarde complète avant migration : `localStorage["armees40k_bk_eq1"]` (restauration dans l'onglet Collection).
* **Armées** : `S.lists[].units[]` gardent exactement leurs armes ; `unit.eq = {m:[{r,w:[...]}]}` = équipement figurine par figurine.
* **Restrictions** : `S.eqc[nom de l'unité] = [{id,t:max|min|role|excl|fixed,w,n,role,ws,st:off|sec|pdf|user,ok,src}]`.
  Extraites du texte des fiches (statut « pdf — à vérifier »), jamais inventées. Rouge seulement si la restriction est confirmée.
* Tests moteur : `node eq-test.js`.
