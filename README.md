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


## NightDial v14 — Smart Night / Flip Pro / OLED / Réveil visuel

Ouvrir les réglages de l'horloge puis **Options Nuit, Flip Pro et Réveil** :

- **Nuit automatique** (activée par défaut) : entre 22:00 et 07:00, atténuation visuelle réglable. Les plages franchissant minuit sont prises en charge ; l'intensité diurne enregistrée n'est pas modifiée.
- **Masquer date/météo la nuit** : facultatif ; la date et la météo réapparaissent lorsque les réglages sont ouverts.
- **Flip Pro** (activé) : animation courte au changement de minute en mode Flip Clock ; respecte « Réduire les animations ».
- **Protection OLED** (activée) : décalage discret de quelques pixels toutes les deux minutes, susceptible de limiter la rétention d'image mais ne la prévenant pas totalement.
- **Réveil progressif visuel** (désactivé par défaut) : choisissez l'heure du réveil et la durée (15, 30, 45 ou 60 minutes). L'affichage s'éclaire progressivement avec une nuance chaude. Bouton « Aperçu » pendant huit secondes.
- **Économie d'énergie** : quand la trotteuse est désactivée, l'heure est actualisée à la minute plutôt qu'en continu.

**Limites importantes :** il ne s'agit pas d'une alarme sonore fiable. L'application web doit rester au premier plan, avec l'écran éveillé. iOS peut interrompre le Wake Lock ; NightDial ne peut pas modifier la luminosité physique. Utiliser l'alarme native iOS pour les réveils importants.

La v14 conserve le stockage local `nightdial-v1`, les modes analogique / numérique / Flip Clock, les huit couleurs, les réglages de météo, les gestes et l'icône PWA.
