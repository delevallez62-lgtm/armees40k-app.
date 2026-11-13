# Suivi des dégâts et statistiques de parties

- `trk-engine.js` : identifiants stables d'unités, statistiques de dégâts réels, résultats de parties (moteur sans interface).
- `trk-ui.js` / `trk.css` : feuille de saisie dans le lanceur de dés, tableau de bord de l'onglet Parties.
- `trk-test.js` : tests (`node trk-test.js`).
- `patch-trk.py <page> trk-engine.js trk-ui.js trk.css <sortie>` : intègre le module à la page.

Stockage local : `S.trk = {rec, man, meta, ui}` (dégâts réels, unités saisies à la main, « qui commence », état de l'interface).
Les dégâts réels ne sont jamais mélangés aux estimations du simulateur (`outils/analyse`).
