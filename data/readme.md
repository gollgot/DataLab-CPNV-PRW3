## Raw Data
Le fichier co2-emissions.xsl provient de la banque mondiale de données.

pour le télécharger :

1. Allez sur [ce site](https://donnees.banquemondiale.org/indicateur/EN.ATM.CO2E.PC?locations=CH&view=chart)
2. Cliquez sur Télécharger : Excel
3. Les données brutes sont dans la feuille nommée **Data**

Date de l'importation : 14.02.2018

## Processed Data

### co2-emissions.csv
Ce sont les données traîtées en format .csv. Pour comprendre comment passer des raw data aux processed data, veuillez voir [ce fichier](../code/scripts/readme.md).

Ce sont les données des émissions de tonnes de Co2 par habitant de chaque pays du monde, et sur une large tranche d'années.

### europe.geojson
Ceci est un fichier json comprenant des coordonnée de points géographique qui permet de recréer des cartes facilement.

Pour ce qui est de la génération de celui-ci, veuillez voir [ce fichier](../code/scripts/readme.md).