# Import PDF de liste (format armylistnetwork)

`patch-pdf.py` corrige/étend le lecteur de PDF de la page (colonnes libellé/texte, tableau d'armes, détachements,
stratégèmes, sauts de page). Chaîne de construction : `patch-pdf.py` → `collection/patch-coll.py` → `apprendre/patch-learn.py` → `aide/patch-help.py`.

Tests (hors ligne) :
- `tests/gen-liste-pdf.py N` fabrique `sN.pdf` + `sN.json` (vérité terrain) au même format que le site (retours à la ligne,
  tableaux centrés, sauts de page, aptitudes longues, noms avec virgule, plusieurs profils…).
- `tests/test-import-pdf.js page.html N` lit les N PDF avec l'appli (pdf.js + `parse`) et compare tout à la vérité terrain.
- `tests/audit-completude.js` vérifie qu'aucun mot du PDF réel ne disparaît.
