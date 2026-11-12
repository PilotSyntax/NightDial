# NightDial

Horloge nocturne pour iPhone 16e et autres appareils iOS, en HTML/CSS/JavaScript sans compte Apple Developer.

## v26 — Theta Sleep intégré et réveil au premier plan

- Dans **Réglages → Nuit → Theta Sleep**, activez le mode nuit, puis cochez **Musique thêta**. La piste originale **Dérive thêta 428 Hz** est incluse dans NightDial et démarre sur cette action. Choisissez 15, 30 ou 60 minutes. Un changement de durée reste calculé depuis le début de la lecture. Le volume peut être ajusté sans relancer la piste. Sur iPhone, utilisez les boutons physiques si le réglage dans NightDial est sans effet.
- La lecture s’arrête à la fin de la minuterie, à la sortie du mode nuit ou au déclenchement du réveil. Au premier lancement de la piste avec une connexion, NightDial tente de la mettre en cache. Attendez le message **Piste disponible hors ligne** avant de couper la connexion. Safari peut effacer le cache ou interrompre la lecture en arrière-plan.
- Dans **Réglages → Réveil**, choisissez une des trois sonneries et touchez **Écouter et préparer la sonnerie**. Laissez NightDial visible et l’écran éveillé. Le retour au premier plan dans les deux minutes qui suivent l’heure prévue peut déclencher un réveil manqué. NightDial indique si le navigateur refuse la lecture. Utilisez l’application Horloge d’iOS pour les réveils importants.
- Le Service Worker utilise le cache `nightdial-premium-v26`. Les préférences sous `nightdial-v1` sont conservées. La v26 ne modifie pas le fichier local éventuellement importé dans la v25.

**Droits audio.** [Dérive thêta 428 Hz](derive-theta-428hz.mp3) est une création originale du propriétaire de NightDial, publiée avec son autorisation. Tous droits réservés sur le morceau. La licence Apache 2.0 du code ne s’applique pas à ce fichier audio.

**Validation sur appareil.** Vérifier le réveil programmé sans interaction à l’heure prévue, le report, la lecture de Theta Sleep et la reprise hors ligne après mise à jour. Faire ces essais dans Safari et depuis l’écran d’accueil, puis consigner le modèle et la version d’iOS.

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


## v15 — split-flap de gare et ville météo

Le mode **Flip Clock** utilise désormais quatre cellules mécaniques indépendantes (heures et minutes) avec deux volets par cellule : volet supérieur qui bascule, puis volet inférieur qui se referme. Seuls les chiffres qui changent sont animés à la minute. L'option **Animation Flip gare** active ou désactive le mouvement. Utilisez **Tester les volets de gare** dans les options avancées pour vérifier l'effet immédiatement, sans attendre une minute. L'option d'accessibilité « Réduire les animations » est respectée.

La **ville** apparaît à côté de la température lorsque la géolocalisation est autorisée et qu'une ville a pu être identifiée. Le nom provient de l'API de géocodage inversé BigDataCloud (client navigateur, sans clé). Une position fraîche est envoyée depuis l'iPhone à ce service tiers ; le nom de ville est stocké localement jusqu'à 24 h afin de limiter les appels. Si le service ne répond pas, l'heure continue normalement et la ville peut être absente. La météo reste fournie par Open-Meteo. Pour forcer le rafraîchissement, toucher la température.

Fonctions v14 conservées : horaires nocturnes, atténuation, micro-déplacement OLED, lever de soleil visuel et son aperçu, Wake Lock (selon iOS), swipe entre trois modes, huit couleurs et stockage local des préférences (`nightdial-v1`).

**Attention :** les effets visuels n'empêchent pas le verrouillage imposé par iOS et ne remplacent pas une alarme native fiable.


## v19 — NightDial Motion

Le mode **Motion** (Options → Avancé) ajoute un effet de parallaxe 3D très subtil à l'horloge. Il est **désactivé par défaut**, avec un réglage d'intensité de 1 à 10 (valeur initiale : 3).

Sur Safari iOS : activez « Parallaxe 3D », puis acceptez la demande d'accès aux capteurs déclenchée par l'interaction ou appuyez sur « Autoriser les mouvements ». Le navigateur peut refuser l'accès et certains appareils ne possèdent pas le capteur.

Économie d'énergie et accessibilité : le suivi des capteurs est suspendu dès que NightDial est masqué, que les réglages sont ouverts, que l'option est désactivée ou que « Réduire les animations » est activé. La projection est limitée à quelques pixels et degrés, et les mises à jour graphiques sont plafonnées à 20 Hz. Les préférences continuent d'être stockées sous la clé historique `nightdial-v1`.

La parallaxe reste une animation visuelle facultative et n'affecte pas le réveil, la luminosité système, ni la fonction de protection OLED.


## v22 — Smart Bedside

Dans **Réglages → Nuit → Smart Bedside**, activez le **profil de chevet** pour appliquer automatiquement un cadran, une couleur et une intensité distincts pendant la plage **Début / Fin** configurée dans l'onglet Nuit (par défaut 22:00–07:00). Choisissez parmi analogique, numérique et Flip gare, parmi les huit couleurs, et réglez l'intensité de 5 à 70 %. Le bouton **Aperçu du profil nuit (8 s)** permet de tester la présentation sans attendre la nuit.

Le profil ne modifie **jamais** les réglages de jour sauvegardés (`mode`, `color`, `bright`), et ceux-ci reviennent automatiquement à la fin de la plage, même après un passage à minuit. La fonction est désactivée par défaut et les anciennes préférences restent dans `nightdial-v1`. L'atténuation nocturne, le réveil, NightDial Motion, Sleep Countdown, Morning Briefing et les trois cadrans restent accessibles.

Les bascules ne peuvent se produire que lorsque la PWA est ouverte/visible ou à sa reprise : Safari ne garantit aucune exécution en arrière-plan.


## v23 — Réveil mélodique natif iPhone

Dans **Réglages → Réveil**, choisissez la **Sonnerie du réveil** : Zen (cloche douce), Nature (chants d'oiseaux synthétiques) ou Digital (impulsions électroniques). **Écouter la sonnerie** joue un extrait de 5 secondes depuis un lecteur HTML5 natif, déclenché par une interaction directe. **Tester le son (iPhone)** reste disponible comme contrôle indépendant, tout comme **Diagnostic Web Audio**.

À l'heure configurée, si la PWA est **visible et active**, NightDial tente de lancer la sonnerie sélectionnée depuis un fichier WAV généré localement, avec un volume progressif intégré directement aux échantillons audio (montée d'environ 90 secondes, indépendamment du contrôle `HTMLMediaElement.volume`, non fiable sur iPhone). Le son est en boucle jusqu'à **Arrêter** ou **Reporter** ; le snooze existant et le lever de soleil visuel sont conservés.

**Limitation critique iOS** : l'autorisation de lecture lors d'un clic ne garantit **pas** qu'une lecture automatique sera autorisée plus tard. Safari peut bloquer la lecture sans geste récent et suspendre la page si l'écran est verrouillé ou l'application en arrière-plan. NightDial n'est pas un remplacement fiable de l'alarme native iPhone. Utilisez toujours l'application Horloge d'iOS pour les réveils importants.

Aucun fichier de musique ou accès distant n'est nécessaire ; les trois sonneries sont générées par synthèse dans le navigateur et les préférences restent sous `nightdial-v1`.


## v24 — Theta Sleep (ondes binaurales optionnelles)

Dans **Réglages → Nuit → Theta Sleep**, activez les battements binauraux stéréo lorsque le **mode nuit** (manuel ou programmé) est en vigueur. Choisissez un écart de fréquence de **4, 6 ou 8 Hz**, un volume limité (**5–35 %**) et une minuterie de **15, 30 ou 60 minutes**. NightDial génère un signal stéréo hors ligne de **220 Hz à gauche** et **224/226/228 Hz à droite** ; l'écart peut créer une perception de pulsation binaurale. Un **casque stéréo** est nécessaire à cette perception. L'audio démarre uniquement après un geste explicite et l'option est désactivée par défaut, y compris au rechargement.

La lecture tente de continuer pendant que l'écran NightDial reste ouvert, mais **Safari/iOS peut l'interrompre en arrière-plan, lors du verrouillage de l'écran ou d'un changement de sortie audio**. Les réglages peuvent être ajustés pendant la lecture. Le moteur s'arrête automatiquement à la fin de la minuterie, à la sortie du mode nuit ou au déclenchement du réveil. Le lecteur signale les blocages et interruptions détectés.

**Aucune efficacité clinique sur l'endormissement n'est garantie** : les preuves concernant les battements binauraux et le sommeil sont limitées. Gardez un volume bas, arrêtez si l'écoute est inconfortable, et privilégiez un casque confortable plutôt que de dormir avec un équipement qui gêne.


## Historique v25 — Musique thêta Pixabay (import local)

Le synthétiseur binaural de v24 est remplacé par le morceau **« Thetha Waves 428 Hz » de Michael-X_Studio**, durée 9 min 30, disponible sur Pixabay : https://pixabay.com/music/meditationspiritual-thetha-waves-428-hz-285027/.

**Configuration sur iPhone :** depuis Safari, télécharger le MP3 avec **Free Download** sur la page Pixabay, puis ouvrir NightDial → Réglages → Nuit → Theta Sleep et sélectionner le fichier via **Musique locale**. Une fois importé, le MP3 est enregistré en IndexedDB dans le stockage local de NightDial (aucun téléversement à notre serveur ou au dépôt GitHub). Activer ensuite la musique pendant le mode nuit ; elle est lue en boucle via un lecteur HTML5 natif pendant 15, 30 ou 60 min. Le volume est réglable dans NightDial, mais **iOS peut ignorer la propriété de volume des éléments audio** : utiliser les boutons physiques du téléphone si nécessaire. La lecture s'arrête à la fin de la minuterie, du mode nuit ou lorsqu'une alarme NightDial se déclenche. Le morceau n'est pas activé automatiquement au rechargement. Si Safari supprime son stockage ou si le site est ouvert dans un autre navigateur, le fichier doit être réimporté.

**Licence** : Pixabay Content License (https://pixabay.com/service/license-summary/) ; utilisation possible au sein d'une œuvre ou application originale, mais la redistribution de la piste **en tant que fichier musical autonome** est interdite. **Le fichier MP3 n'est pas inclus dans ce dépôt public.** Conserver la preuve de téléchargement et vérifier les conditions de la page d'origine, marquée « Content ID Registered ». La piste est utilisée comme musique de relaxation ; son titre ou ses mentions de fréquence ne constituent pas une preuve d'effet physiologique. La lecture en arrière-plan ou écran verrouillé sur iOS n'est pas garantie.
