## Transformations manuelles

### Génération du fichier co2-emissions.csv
Voici les étapes à réalisées pour passer des raw data aux process data:

1. Ouvrir dans excel le fichier .xls qui se trouve dans le dossier `data/raw/`.
2. Garder seulement la feuille nommée **Data**.
3. Supprimer les 3 premières lignes du fichier.
4. Enregistrer le fichier sous `data/processed/`, avec comme nom **co2-emissions** de type **CSV (séparateur : point-virgule)(\*.csv)**

Date de la génération du fichier : 14.02.2018

#### Pourquoi ?
J'ai décider de transformer manuellement les données du fichier excel en données CSV, plutôt que de télécharger directement depuis le site de la banque mondiale de données, car le fichier CSV proposé par le site n'est pas bien formatté et pose des problèmes.

De plus, je n'ai pas fait de script car les étapes sont très simple et je ne veux pas passer du temps à faire un script pour quelque chose comme ça.

### Génération du fichier europe.geojson
Aller sur [ce site](https://geojson-maps.ash.ms), puis créer simplement la map que vous souhaiter et enregistrer le fichier sous `data/processed/`, avec comme nom **map.geojson**.

Date de la génération du fichier : 14.02.2018