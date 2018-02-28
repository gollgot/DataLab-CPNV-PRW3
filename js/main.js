// Map dimensions
var width = 760;
var height = 700;

// Slider
var slider = document.getElementById("years-slider");
var output = document.getElementById("selected-year");

// Country bar chart stuff
var barChart = null;
var barChartCanvas = document.getElementById("country-chart");
Chart.defaults.global.defaultFontFamily = "Roboto";
Chart.defaults.global.defaultFontSize = 18;



// Run the displaying
createMap(width, height);
buildEmptyBarChart();


function createMap(width, height){

    // Create the SVG zone
    var canvas = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create the type of projection we want for the map : Docs -> https://github.com/d3/d3-geo#geoMercator
    var projection = d3.geo.mercator()
            .scale(500)
            .translate([300, 950]);

    // Create a path variable
    var path = d3.geo.path().projection(projection);

    // Load our geojson map of Europe : created with -> https://geojson-maps.ash.ms
    let mapFile = "data/processed/map.geojson";
    d3.json(mapFile, function(data){
        //var country = data.features[0].properties.name;

        // Create a svg group
        var group = canvas.selectAll("g")
            .data(data.features)
            .enter()
            .append("g");

        // Create a svg Area with some parameter from the geojson
        var areas = group.append("path")
            .attr("d", path)
            .attr("class", "area")
            .attr("fill", "#A9A9A9")
            .attr("stroke", "#FFF")
            .attr("data-name", function(d) { return d.properties.name; })
            .attr("data-iso3", function(d) { return d.properties.iso_a3; })
            .attr("stroke-width", 0.7);

        // We will fill all country area with a color will define the criticity
        fillColorByCriticality(2014);
    });

}


function fillColorByCriticality(targetYear) {
    let csvCo2EmissionFile = "data/processed/co2-emissions.csv";
    let colors = ["#F0C8B5", "#EAAB90", "#D18358", "#B55E3E", "#7D3827"];
    let colorNoData = "#A9A9A9";

    d3.dsv(";")(csvCo2EmissionFile, function(error, data){
        data.forEach( function(element, index) {

            if(element[targetYear] == ""){
                $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colorNoData);
            }
            else{

                if(element[targetYear] < 1.74){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[0]);
                }
                else if(element[targetYear] <= 4.64){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[1]);
                }
                else if(element[targetYear] <= 7.94){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[2]);
                }
                else if(element[targetYear] <= 11.69){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[3]);
                }
                else if(element[targetYear] > 11.69){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[4]);
                }

            }
        });


        // Hover on an area
        $(".area").hover(function(){
            // Set cursor to pointer and update the tooltip box
            $(this).css({
                "cursor": "pointer",
            });
            updateTooltip($(this), data, targetYear);
        }, function(){
            // Hover finish, reset the tooltip box
            resetTooltip();
        });

        $(".area").click(function(){
            buildBarChart($(this), data);
        });

    });
}



function updateTooltip(currentArea, data, targetYear){
    let hoverCountryName = currentArea.data("name");
    let countryIso3 = currentArea.data("iso3");
    let emissionObject = getEmissionObjectByIso3(data, countryIso3);

    let strEmissionsCount = emissionObject[targetYear];
    let strToDisplay = null;

    if(strEmissionsCount == ""){
        strToDisplay = hoverCountryName +" - "+ "Aucune donnée";
    }else{
        strToDisplay = hoverCountryName +" - "+ parseFloat(strEmissionsCount).toFixed(3);
    }

    $("#custom-tooltip").html(strToDisplay);
    $("#custom-tooltip").show();
}

function resetTooltip(){
    $("#custom-tooltip").html("");
    $("#custom-tooltip").hide();
}

function getEmissionObjectByIso3(data, targetIso3){
    let emissionObject = null;
    data.forEach( function(element, index) {
        if(element["Country Code"] == targetIso3){
            emissionObject = element;
        }
    });

    return emissionObject;
}

// All the time we move our mouse, the tooltip box follow the cursor
$(document).mousemove(function(e){
    $("#custom-tooltip").css({
        "top": e.pageY - $("#custom-tooltip").height() - 30,
        "left": e.pageX - $("#custom-tooltip").width() / 2 - 10,
    });
});



// Slider Management => When we choose a year, fill the map with good color criticallity based on the target year
slider.oninput = function() {
    output.innerHTML = this.value;
    fillColorByCriticality(this.value);
}


// Function that will create an empty bar chart, this way this is more userfriendly than a empty white bloc
function buildEmptyBarChart(){

    let barChartData = {
      label: "test2",
      data: [0, 10],
      backgroundColor: "#6F6F6F",
    };

    // Destroy the current barchart if exists, mandatory to create a new one
    if(barChart){
        barChart.destroy();
    }

    barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: {
            labels: null,
            datasets: [barChartData]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Veuillez cliquer sur un pays pour en voir le détail",
            }
        }
    });
}

// Function that will build a real bachart to show the detail of one selected country
function buildBarChart(currentArea, data){
    let countryName = currentArea.data("name");
    let countryIso3 = currentArea.data("iso3");
    let emissionObject = getEmissionObjectByIso3(data, countryIso3);
    let maxYear = 2014;
    let yearGap = 20;

    let emissionData = new Array();
    let allLabels = new Array();
    for (var i = maxYear - yearGap; i <= maxYear ; i++) {
        strYear = i.toString();
        emissionData.push(emissionObject[strYear]);
        allLabels.push(strYear);
    }

    let barChartData = {
      label: countryName,
      data: emissionData,
      backgroundColor: "#6F6F6F",
    };

    // Destroy the current barchart if exists, mandatory to create a new one
    if(barChart){
        barChart.destroy();
    }

    barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: {
            labels: allLabels,
            datasets: [barChartData]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: countryName,
            }
        }
    });
}