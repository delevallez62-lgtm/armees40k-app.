# Analyse & Simulation (branche de test)

Module local de comparaison d'armées, de simulation (règles V11) et d'historique des parties.

- `ana-engine.js` : moteur de calcul sans interface (lecture des fiches, séquence d'attaque V11, simulation, analyse d'armées, estimation, statistiques).
- `ana-ui.js` : onglet « Analyse & Simulation » (six sections).
- `ana-test.js` : tests du moteur (`node ana-test.js` ; `ANA_FIXTURE=export.json` pour les tests sur données réelles).
- `patch-ana.py <index.html source> ana-engine.js ana-ui.js <sortie>` : intègre le module à la page.

Aucun appel réseau. Données : listes importées dans l'appli. Sauvegarde locale : `S.ash` (parties) et `S.ana` (réglages).
