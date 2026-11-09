# Application Android « Mes armées 40k »

Sources pour reconstruire l'APK (`build.sh`). À compléter avant la construction :
- `assets/index.html` : page de départ, générée à partir de `../index.html` + `assets/app-extra.js` ;
- `assets/lib/pdf.min.js` et `pdf.worker.min.js` (pdfjs-dist 3.11.174) ;
- `release.keystore` : la clé de signature, gardée **hors du dépôt**. Sans elle, une nouvelle version ne s'installe pas par-dessus l'ancienne.
