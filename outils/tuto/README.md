# Mode « Partie tutorielle »

Coach en 11 étapes posé **par-dessus** le Mode jeu existant (aucune règle du mode classique n'est modifiée).
- Entrée : carte « Premières parties » en haut de « Apprendre à jouer ».
- Les règles affichées viennent de l'encyclopédie V11 de l'appli (`__enc.rules()`) et du résumé « Apprendre à jouer » (`XV.learnData`) ; si une règle manque, l'appli le dit.
- Les exemples sont calculés avec les unités, armes et caractéristiques de la liste choisie.
- État dans `S.tut` : étape, étapes faites, niveau (essentiel / intermédiaire / avancé), pause. Reprise après rechargement.
Build : `patch-tuto.py` (dernier maillon de la chaîne de patchs).
