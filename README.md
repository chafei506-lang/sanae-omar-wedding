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
│   └── videos/                 <- Vidéos (court teaser et poster images)
│       ├── best_of.mp4         <- Court teaser / rétrospective (ex: 20-100 Mo)
│       ├── poster_bestof.jpg   <- Image de couverture du Best Of
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

## 📹 Gestion de la Grande Vidéo (32 Go)

Le film de mariage complet fait environ 32 Go. **Ne le placez jamais directement sur le site**, car sa taille bloquerait complètement le chargement de la page pour les visiteurs et dépasserait les capacités d'un hébergement web standard.

### Étape 1 : Compresser le fichier (Optionnel mais recommandé)
Si vous souhaitez réduire la taille pour faciliter l'envoi, utilisez le logiciel gratuit **HandBrake** (téléchargeable sur [handbrake.fr](https://handbrake.fr/)) :
1. Ouvrez votre vidéo de 32 Go dans HandBrake.
2. Choisissez le préréglage (Preset) **"Fast 1080p30"** ou **"Production Standard"**.
3. Dans l'onglet **"Vidéo"**, assurez-vous que le codec est **H.264** et réglez la qualité constante (Constant Quality RF) autour de **22**.
4. Cliquez sur **"Démarrer l'encodage"**. Le fichier final fera généralement entre 1 et 3 Go tout en conservant une qualité excellente.

### Étape 2 : Héberger la vidéo en ligne gratuitement
Uploadez votre vidéo compressée ou originale sur l'une de ces plateformes gratuites :
*   **YouTube (Recommandé)** : Importez la vidéo et choisissez la visibilité **"Non répertoriée"** (Unlisted). De cette façon, seuls les visiteurs de votre site pourront la voir, elle ne sera pas publique sur votre chaîne ni dans les recherches YouTube.
*   **Google Drive** : Déposez le fichier sur votre Drive, faites un clic droit > Partager > changez les droits pour **"Tous les utilisateurs disposant du lien peuvent lire"**.
*   **Vimeo** : Importez la vidéo en mode privé ou mot de passe selon vos préférences.

### Étape 3 : Lier la vidéo au site
Copiez le lien obtenu à l'étape 2 (ex: `https://www.youtube.com/watch?v=XXXXXX` ou `https://drive.google.com/drive/folders/XXXXXX`) et collez-le dans `script.js` au niveau de la variable `FULL_VIDEO_URL` :

```javascript
FULL_VIDEO_URL: "PASTE_YOUR_LINK_HERE"
```

*Le site est intelligent : s'il détecte un lien YouTube ou Vimeo, il intégrera directement le lecteur vidéo interactif (iframe) sur la page. S'il s'agit d'un lien Google Drive ou Cloud, il affichera un magnifique bouton renvoyant le visiteur vers le lien de téléchargement/lecture externe.*

---

## 🚀 Lancement Local & Déploiement

1. Double-cliquez sur `index.html` pour l'ouvrir dans n'importe quel navigateur web.
2. Pour tester dans des conditions réelles de serveur, vous pouvez lancer un mini-serveur local avec VS Code (Live Server) ou via commande (ex: `npx http-server`).
3. Pour héberger gratuitement le site en ligne, vous pouvez utiliser **GitHub Pages**, **Netlify**, ou **Vercel** en y glissant simplement les fichiers de ce dossier.
