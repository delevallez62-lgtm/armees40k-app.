# Bibliothèque V11 (Space Marines + Orks)

- `build-biblio.py <src/data d'Oracle> <sortie> [commit] [date]` : lit (sans exécuter) les fichiers de warhammer-oracle et produit `manifest.json` + `space-marines.json`, `orks.json`, `common.json` (identifiants BSData conservés, version, sommes SHA-1).
- `biblio.js` : stockage séparé (IndexedDB `hammer-biblio`), traduction à 3 statuts, symbole 📚 (Collection seulement), rapprochement manuel avec choix des informations (sans écrasement, avec annulation), synchro facultative différentielle (comparaison des versions, intégrité SHA-1, nouveautés), sauvegarde/restauration.
- `patch-biblio.py` : intègre le module et un instantané compressé dans la page (hors ligne dès le premier lancement).
- Mise à jour automatique : une tâche planifiée régénère `data/biblio/` dans ce dépôt quand Oracle publie de nouvelles données ; l'appli lit `https://raw.githubusercontent.com/delevallez62-lgtm/armees40k-app./main/data/biblio/manifest.json`.
- `tests/` : scénarios Playwright (rapprochement, synchro avec source simulée, intégrité).

## Wahapedia et traductions
- `build-wahapedia.py <csv> <data/biblio>` : ajoute les blocs `wp-*` (options d'équipement, composition, fiches/stratagèmes/améliorations manquants). Les CSV : https://wahapedia.ru/wh40k11ed/<Nom>.csv (Factions, Datasheets, Datasheets_models, Datasheets_wargear, Datasheets_abilities, Datasheets_keywords, Datasheets_options, Datasheets_unit_composition, Datasheets_leader, Abilities, Detachments, Detachment_abilities, Enhancements, Stratagems, Last_update).
- `todo-translate.py` liste les textes à traduire (noms d'abord) ; `merge-fr.py` les ajoute à `fr.json` (garde-fou : mêmes nombres que l'anglais). `glossaire-fr.json` : vocabulaire officiel de référence.
