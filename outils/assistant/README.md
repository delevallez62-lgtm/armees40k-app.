# Assistant d'optimisation (phase 1, hors ligne)

Onglet « 🎯 Assistant » du Centre de commandement (remplace « Conseils » ; « Contre un adversaire » en est un sous-onglet).
- `assistant-engine.js` : cibles de référence, métriques par unité (réutilise `ANA`), bancs d'essai par faction (médianes de la bibliothèque), indicateurs et score global.
- `assistant-recommend.js` : diagnostic, recommandations (équipement via `EQE`, ajout, remplacement), validation (`lckBadOf`, points `calc`), création de variantes (`applyRec`). Outils de test dans `BIBAST.test`.
- `assistant-ui.js` : interface (panneaux Ma liste / Unité / Impact, variantes, infobulles).
Intégré par `patch-biblio.py` (marqueur `/*__ASSIST__*/`).
Scores : 50 = médiane des unités de la faction ; aucune valeur inventée ; « données insuffisantes » plutôt qu'un conseil approximatif.
Tests : `outils/biblio/tests/t-ast2.js` (toutes les factions : légalité, points, liste d'origine intacte, score prévu = score réel).
Non fait (phase 2/3) : analyse contre une faction adverse, exploitation du journal de bataille, export des variantes (copie texte disponible).
