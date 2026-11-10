# NightDial

Horloge nocturne pour iPhone 16e et autres appareils iOS, en HTML/CSS/JavaScript sans compte Apple Developer.

## Fonctions
- Modes analogique XXL et numérique XXL, portrait et paysage
- Date française, météo locale via Open-Meteo (autorisation de localisation)
- Trois couleurs (rouge, ambre, vert), intensité et atténuation visuelle
- Wake Lock lorsque pris en charge par Safari/iOS
- Affichage plein écran après ajout à l'écran d'accueil, fonctionnement hors ligne après premier chargement

## Hébergement GitHub Pages
Dans **Settings > Pages**, choisir **Deploy from a branch**, branche **main**, dossier **/(root)** et enregistrer. Le dépôt doit être éligible à GitHub Pages selon l'abonnement et la visibilité. Sur un compte gratuit, un dépôt public est généralement requis.

Site attendu : https://pilotsyntax.github.io/NightDial/

## Installation iPhone
Ouvrir le lien HTTPS dans Safari, Partager > Ajouter à l'écran d'accueil (ouvrir comme application web). Pour la météo, autoriser la localisation. Pour la luminosité physique minimale, utiliser le contrôle de luminosité d'iOS.

**Limites iOS :** Wake Lock n'est pas garanti en toutes circonstances. La page ne peut pas régler la luminosité matérielle. GitHub Pages publie publiquement les fichiers du site.
