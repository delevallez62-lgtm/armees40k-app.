# Mode « Partie tutorielle »

Une partie classique du Mode jeu, avec de petites fenêtres (une idée à la fois) qui guident un vrai débutant :
- à l'ouverture de l'assistant de lancement : « Démarrer une partie avec un autre joueur » (5 fenêtres) ;
- puis 10 étapes : Ta liste, Un tour de jeu, Commandement, Stratagèmes, Mouvement, Tir, Comparer Force et Endurance (interactif), Charge, Combat, Fin du tour et score ;
- boutons « ❓ » ouvrant une seule règle à la fois (encyclopédie V11 de l'appli) ;
- dans chaque fiche d'unité ouverte : pastilles 🎓 (M, E, Sv, PV, Cd, CO, Portée, A, CT/CC, F, PA, D, Force vs Endurance) qui expliquent au toucher avec les valeurs de l'unité ;
- une pastille « Étape n/10 » en bas pour rouvrir l'étape.
Tout n'apparaît que pendant une partie tutorielle (`S.tut.on`). État dans `S.tut` : étape, étapes faites, fenêtres déjà vues, fenêtre ouverte. Reprise après rechargement.
Build : `patch-tuto.py`.
