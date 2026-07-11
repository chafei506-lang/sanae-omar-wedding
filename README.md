# 💍 Site de Mariage — Sanae & Omar (27.12.2025)

Bienvenue sur le projet du site internet célébrant le mariage de **Sanae & Omar**. Ce site responsive sur une seule page (Single-Page Website) permet de partager les photos et vidéos du jour J avec vos invités.

---

## 📂 Structure des Dossiers Média

Le projet comprend un dossier `./media/` qui doit être structuré de la manière suivante pour accueillir vos fichiers média :

```text
c:/Users/anass/Desktop/sanaa_3ars/
├── media/
│   ├── photos-retouchees/      <- Photos professionnelles retouchées
│   ├── photos-invitees/        <- Photos prises sur le vif par vos invités
│   ├── photos-normales/        <- Photos casual / traditionnelles
│   └── videos/                 <- Vidéos (images de couverture)
│       └── poster_full.jpg     <- Image de couverture du Film Complet
├── index.html                  <- Structure HTML
├── style.css                   <- Fichier de styles (CSS)
├── script.js                   <- Logique applicative et configuration
└── README.md                   <- Le présent fichier d'aide
```

---

## ⚙️ Configuration Automatique & Gestion des Photos

Pour optimiser le temps de chargement du site, les 974+ photos haute résolution sont automatiquement compressées et indexées par un script d'optimisation.

### Comment ajouter ou modifier vos photos :

1. **Déposez vos nouvelles photos** directement dans les dossiers sources correspondants (peu importe le nom ou la résolution) :
   *   `./media/photos-retouchees/` — photos retouchées.
   *   `./media/photos-invitees/` — photos prises par les invités.
   *   `./media/photos-normales/` — autres photos casual.
2. **Exécutez le script d'optimisation** depuis un terminal à la racine du projet :
   ```bash
   python generate_thumbs.py
   ```
3. **Ce que fait le script automatiquement** :
   *   Détecte les nouvelles images brutes.
   *   Les déplace vers le dossier sécurisé `./media/originals/[categorie]/` (les fichiers originaux y restent intacts pour que les invités puissent les télécharger en HD).
   *   Génère des miniatures WebP ultra-légères (~10 Ko) dans `./media/thumbs/[categorie]/` pour un affichage instantané de la grille.
   *   Génère des versions moyennes WebP (~100 Ko) dans `./media/medium/[categorie]/` pour une navigation rapide en plein écran (lightbox).
   *   Met à jour le fichier d'indexation `media_list.js` en y intégrant les dimensions de chaque photo pour éviter tout décalage visuel (layout shift).

---

## 📹 Configuration des Vidéos (Google Drive, YouTube, Vimeo)

Pour préserver la vitesse de chargement et éviter les blocages de taille de fichiers sur GitHub, les vidéos du mariage sont hébergées en ligne.

### 1. Le Teaser "Best Of"
Pour intégrer la courte vidéo rétrospective :
1. Déposez votre vidéo sur **Google Drive**.
2. Faites un clic droit > **Partager** > modifiez l'accès général à **"Tous les utilisateurs disposant du lien"** en mode **Lecteur**.
3. Récupérez le lien de partage standard (ex: `https://drive.google.com/file/d/ID_DE_VOTRE_FICHIER/view?usp=sharing`).
4. Transformez ce lien en lien d'intégration (preview) en remplaçant la fin par `/preview`. Le format correct est :
   `https://drive.google.com/file/d/ID_DE_VOTRE_FICHIER/preview`
5. Collez ce lien dans `script.js` dans la variable `BEST_OF_VIDEO_URL` :
   ```javascript
   BEST_OF_VIDEO_URL: "https://drive.google.com/file/d/ID_DE_VOTRE_FICHIER/preview"
   ```

### 2. Le Film Complet (Grande Vidéo)
Le film complet peut faire plusieurs gigaoctets. Suivez ces étapes pour le lier :

1. **Hébergez la vidéo en ligne gratuitement** :
   *   **YouTube (Recommandé)** : Importez la vidéo et configurez la visibilité sur **"Non répertoriée"** (Unlisted). De cette façon, seuls les visiteurs de votre site de mariage pourront la visionner (elle ne sera pas publique sur votre chaîne ni dans les résultats de recherche).
   *   **Google Drive** : Déposez le fichier complet sur votre Drive, configurez les droits pour que **"Tous les utilisateurs disposant du lien"** puissent la lire.
   *   **Vimeo** : Importez la vidéo en mode d'accès restreint.
2. **Liez la vidéo au site** :
   Copiez le lien (ex: `https://www.youtube.com/watch?v=XXXXXX` ou le lien de votre dossier/fichier Google Drive) et collez-le dans `script.js` dans la variable `FULL_VIDEO_URL` :
   ```javascript
   FULL_VIDEO_URL: "PASTE_YOUR_LINK_HERE"
   ```

*Le site s'adapte automatiquement : s'il détecte un lien d'intégration YouTube ou Vimeo, il incrustera directement le lecteur vidéo interactif sur la page. S'il s'agit d'un lien Google Drive ou Cloud standard, il affichera un magnifique bouton de cinéma invitant à ouvrir le film dans un nouvel onglet.*

---

## 🚀 Lancement Local & Déploiement

1. Double-cliquez sur `index.html` pour l'ouvrir dans n'importe quel navigateur web.
2. Pour tester dans des conditions réelles de serveur, vous pouvez lancer un mini-serveur local avec VS Code (Live Server) ou via commande (ex: `npx http-server`).
3. Pour héberger gratuitement le site en ligne, vous pouvez utiliser **GitHub Pages**, **Netlify**, ou **Vercel** en y glissant simplement les fichiers de ce dossier.
