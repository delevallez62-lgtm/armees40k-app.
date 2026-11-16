# Bibliothèque V11 (Space Marines + Orks)

- `build-biblio.py <src/data d'Oracle> <sortie> [commit] [date]` : lit (sans exécuter) les fichiers de warhammer-oracle et produit `manifest.json` + `space-marines.json`, `orks.json`, `common.json` (identifiants BSData conservés, version, sommes SHA-1).
- `biblio.js` : stockage séparé (IndexedDB `hammer-biblio`), traduction à 3 statuts, symbole 📚 (Collection seulement), rapprochement manuel avec choix des informations (sans écrasement, avec annulation), synchro facultative différentielle (comparaison des versions, intégrité SHA-1, nouveautés), sauvegarde/restauration.
- `patch-biblio.py` : intègre le module et un instantané compressé dans la page (hors ligne dès le premier lancement).
- Mise à jour automatique : une tâche planifiée régénère `data/biblio/` dans ce dépôt quand Oracle publie de nouvelles données ; l'appli lit `https://raw.githubusercontent.com/delevallez62-lgtm/armees40k-app./main/data/biblio/manifest.json`.
- `tests/` : scénarios Playwright (rapprochement, synchro avec source simulée, intégrité).
