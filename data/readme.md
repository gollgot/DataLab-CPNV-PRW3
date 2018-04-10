## Raw Data
Le fichier API_EN.ATM.CO2E.PC_DS2_fr_excel_v2.xls provient de la banque mondiale de données et contient les données brutes.

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

## Logged Data
J'ai décider de logger deux types de comportement :
 1. Lors ce qu'un utilisateur sélectionne une date à l'aide du date-picker. 
 2. Lors ce qu'un utilisateur sélectionne un pays sur la carte intéractive.

L'envoi des données se fait quand le clic est relaché.

Les données sont stockées et envoyées sous le format json comme suit :

Pour une date sélectionnée :
``` json
{
	"event":"select",
	"target":"year",
	"data":"1989"
}
```

Pour un pays sélectionné :
``` json
{
	"event":"click",
	"target":"country",
	"data":"Greenland"
}

Comme cela, dans le cas d'une création de statistique sur le comportement des utilisateurs, il sera facilement possible de récupérer les données liées aux années ou aux pays. 