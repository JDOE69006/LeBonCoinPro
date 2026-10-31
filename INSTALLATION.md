# Installer LebonCoinPro

Ce guide explique comment télécharger l'extension depuis GitHub et l'ajouter à Chrome, Microsoft Edge ou Opera. Aucune connaissance technique n'est nécessaire.

> Téléchargez l'extension uniquement depuis le dépôt GitHub officiel ou depuis un lien fourni par une personne de confiance. N'installez pas un fichier envoyé par un inconnu.

## 1. Télécharger l'extension depuis GitHub

1. Ouvrez dans votre navigateur le lien GitHub du projet qui vous a été communiqué.
2. Sur la page du projet, cliquez sur le bouton vert **Code**.
3. Dans le menu qui s'ouvre, cliquez sur **Download ZIP** (ou **Télécharger le fichier ZIP**).
4. Attendez la fin du téléchargement. Le fichier se trouve généralement dans le dossier **Téléchargements** de votre ordinateur.

## 2. Décompresser le fichier ZIP

Le navigateur ne peut pas installer directement le fichier ZIP. Il faut d'abord l'extraire :

1. Ouvrez le dossier **Téléchargements**.
2. Faites un clic droit sur le fichier ZIP téléchargé.
3. Choisissez **Extraire tout…**, puis cliquez sur **Extraire**.
   - Sur macOS, double-cliquez sur le fichier ZIP.
4. Un nouveau dossier apparaît. Ouvrez-le. Si vous voyez encore un dossier portant le nom du projet, ouvrez-le également.
5. Repérez le dossier qui contient directement le fichier **manifest.json** ainsi que les fichiers `main.js`, `popup.html` et `popup.css`.

Gardez ce dossier à un endroit où vous ne le supprimerez pas, par exemple dans **Documents**. L'extension sera chargée depuis cet emplacement.

## 3. Afficher les extensions du navigateur

Il faut activer le **mode développeur** pour ajouter manuellement l'extension. Cela ne nécessite pas d'installer un logiciel supplémentaire.

### Google Chrome

1. Dans la barre d'adresse de Chrome, saisissez `chrome://extensions`, puis appuyez sur **Entrée**.
2. En haut à droite de la page, activez **Mode développeur**.
3. Cliquez sur **Charger l'extension non empaquetée**.
4. Dans la fenêtre de sélection, choisissez le dossier extrait qui contient directement **manifest.json**.
5. Cliquez sur **Sélectionner un dossier** (le nom du bouton peut varier selon votre système).

### Microsoft Edge

1. Dans la barre d'adresse d'Edge, saisissez `edge://extensions`, puis appuyez sur **Entrée**.
2. Activez **Mode développeur** dans le menu ou le panneau des extensions.
3. Cliquez sur **Charger décompressée**.
4. Choisissez le dossier extrait qui contient directement **manifest.json**, puis confirmez.

### Opera

1. Dans la barre d'adresse d'Opera, saisissez `opera://extensions`, puis appuyez sur **Entrée**.
2. Activez **Mode développeur** en haut de la page.
3. Cliquez sur **Charger l'extension non empaquetée** (le libellé peut légèrement varier).
4. Choisissez le dossier extrait qui contient directement **manifest.json**, puis confirmez.

Si `opera://extensions` ne s'ouvre pas, ouvrez le menu Opera, puis **Extensions** > **Extensions**. Vous pouvez aussi saisir « extensions » dans la recherche des réglages d'Opera.

## 4. Vérifier l'installation

1. La page des extensions doit afficher **LebonCoinPro** sans message d'erreur.
2. Ouvrez une page Leboncoin ou actualisez celle qui était déjà ouverte.
3. Cliquez sur l'icône **Extensions** (souvent une pièce de puzzle) près de la barre d'adresse.
4. Si nécessaire, utilisez l'icône en forme d'épingle à côté de LebonCoinPro pour l'afficher dans la barre du navigateur.
5. Cliquez sur **LebonCoinPro** pour ouvrir ses préférences. Les deux options sont activées par défaut et peuvent être modifiées à cet endroit.

L'extension est prévue pour les pages de `leboncoin.fr`. Certaines actions, comme cloner une annonce, nécessitent d'être connecté à votre compte et de disposer des droits sur l'annonce.

## En cas de problème

- **Le navigateur indique que le manifeste est introuvable** : vous avez probablement choisi le mauvais dossier. Recommencez et sélectionnez celui où le fichier **manifest.json** est visible directement.
- **Vous avez choisi le fichier ZIP** : extrayez-le d'abord, puis sélectionnez le dossier extrait.
- **L'extension ne semble pas agir** : vérifiez qu'elle est activée dans la page des extensions, puis actualisez la page Leboncoin.
- **Après une mise à jour, les changements n'apparaissent pas** : téléchargez et extrayez à nouveau les fichiers, chargez le dossier mis à jour dans le navigateur, puis actualisez les pages Leboncoin.
- **Une alerte de sécurité apparaît** : c'est le navigateur qui signale qu'une extension est ajoutée manuellement. Continuez uniquement si vous faites confiance à la source du dépôt et au code téléchargé.