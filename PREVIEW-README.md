# Prévisualisation locale — Mes armées 40k

Cette copie est isolée sur la branche `chatgpt/test`. Elle ne modifie pas la branche `main` utilisée par la publication habituelle.

## Démarrer sous Windows

1. Télécharge l'archive ZIP de la branche `chatgpt/test` depuis GitHub.
2. Décompresse entièrement le ZIP dans un dossier.
3. Double-clique sur `LANCER-PREVIEW.bat`.
4. Le navigateur s'ouvre sur http://127.0.0.1:8000.
5. Pour arrêter le serveur, reviens dans la fenêtre noire et appuie sur Ctrl+C.

Python 3 doit être installé sur le PC. Le script ne modifie aucun fichier et ne lance aucune compilation Android.

## Limites importantes

- C'est une prévisualisation locale de la page web, pas une publication en ligne.
- Les fonctions qui dépendent du runtime Claude (notamment la synchronisation cloud liée au compte Claude) ne sont pas garanties hors de claude.ai.
- Les données locales créées pendant les tests peuvent être enregistrées dans le navigateur utilisé. Pour éviter toute confusion avec tes données habituelles, utilise un profil de navigateur séparé ou une fenêtre privée.
- Ne lance pas `android/build.sh` pour cette prévisualisation. La clé de signature Android doit être sauvegardée séparément.

## Mise à jour

Pour récupérer les dernières modifications de cette branche, télécharge à nouveau le ZIP de `chatgpt/test` et décompresse-le dans un nouveau dossier de test.
