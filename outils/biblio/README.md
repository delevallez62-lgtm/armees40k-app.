# Bibliothèque V11 (Space Marines + Orks)

- `build-biblio.py <src/data d'Oracle> <sortie> [commit] [date]` : lit (sans exécuter) les fichiers de warhammer-oracle et produit `manifest.json` + `space-marines.json`, `orks.json`, `common.json` (identifiants BSData conservés, version, sommes SHA-1).
- `biblio.js` : stockage séparé (IndexedDB `hammer-biblio`), traduction à 3 statuts, symbole 📚 (Collection seulement), rapprochement manuel avec choix des informations (sans écrasement, avec annulation), synchro facultative différentielle (comparaison des versions, intégrité SHA-1, nouveautés), sauvegarde/restauration.
- `patch-biblio.py` : intègre le module et un instantané compressé dans la page (hors ligne dès le premier lancement).
- Mise à jour automatique : une tâche planifiée régénère `data/biblio/` dans ce dépôt quand Oracle publie de nouvelles données ; l'appli lit `https://raw.githubusercontent.com/delevallez62-lgtm/armees40k-app./main/data/biblio/manifest.json`.
- `tests/` : scénarios Playwright (rapprochement, synchro avec source simulée, intégrité).

## Wahapedia et traductions
- `build-wahapedia.py <csv> <data/biblio>` : ajoute les blocs `wp-*` (options d'équipement, composition, fiches/stratagèmes/améliorations manquants). Les CSV : https://wahapedia.ru/wh40k11ed/<Nom>.csv (Factions, Datasheets, Datasheets_models, Datasheets_wargear, Datasheets_abilities, Datasheets_keywords, Datasheets_options, Datasheets_unit_composition, Datasheets_leader, Abilities, Detachments, Detachment_abilities, Enhancements, Stratagems, Last_update).
- `todo-translate.py` liste les textes à traduire (noms d'abord) ; `merge-fr.py` les ajoute à `fr.json` (garde-fou : mêmes nombres que l'anglais). `glossaire-fr.json` : vocabulaire officiel de référence.

## Architecture de construction (à lire avant de modifier)

- **Page finale** = `base-main.html` (page de base, copie de travail) + patchs successifs : `patch-pdf` → `patch-coll` → `patch-learn` → `patch-help` → `patch-perso` → `patch-tuto` → `patch-biblio.py`. Chaque patch remplace des morceaux de texte par `rep(ancien, nouveau)` ; si un texte de la base change ou disparaît, `rep` échoue (sauf mode `ALLEGE` : il signale « IGNORÉ » et continue).
- **Modules fusionnés dans une seule fonction** par `patch-biblio.py` : `biblio.js`, `listcheck.js`, `equip.js`, `build.js`, `maj.js`, `unify.js`, assistant. Les `function` sont remontées, mais les `const` dépendent de l'ordre.
- **Modules déjà intégrés à la base** (`analyse/`, `stats/`) : les modifier dans `outils/` ne suffit pas, il faut aussi modifier la base.
- **Données** : `data/biblio/*.json` + `manifest.json` (empreintes). Après toute modification : `bump-version.py`. Éviter les conflits : refaire `git pull` avant de relancer un `apply-*.py`.
- **Crochets de contrôle** (tests) : `BLDAUDIT`, `BLDAUDIT2`, `BLDSP`, `BLDSMOKE`, `BLDTR`, `BLDG`. Tests : `tests/t-*.js <page.html>` (Playwright, hors ligne).
- **Ajouter des profils d'armes fournis** : déposer le CSV dans `profils-fournis/` puis `apply-profils-fournis.py`.
