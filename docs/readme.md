## Prerequisites
- Nothing

## Installation
 - Clone or download the project [here](https://github.com/CPNV-ES/Datalab/tree/master).
 - Put the `app/co2_emissions` folder in your web server.
 - You just have to open the co2_emissions folder in your browser.

## How it works ?
all the interesting code is in the `js/mains.js` file.
 1. We create an interactive map generated with the [D3.js library](https://d3js.org/).
 2. We color all the countries with appropriate range of colors compared to our .csv data and the target year.
 3. When the year slider is updated we color again all countries with the selected year.
 4. When a country is clicked we create a bar chart with the [chart.js library](http://www.chartjs.org/) and display the last 20 years compared to our data for the selected country.

To have more details about the code, just read the main.js file it contains a lot of commentaries and a good structure.