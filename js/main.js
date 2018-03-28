// Map dimensions
var mapWidth = 700;
var mapHeight = 500;

// Slider
var slider = document.getElementById("years-slider");
var output = document.getElementById("selected-year");

// Country bar chart stuff
var barChart = null;
var barChartCanvas = document.getElementById("country-chart");
Chart.defaults.global.defaultFontFamily = "Roboto";
Chart.defaults.global.defaultFontSize = 18;



// Run the displaying
createMap(mapWidth, mapHeight);
buildEmptyBarChart();


function createMap(width, height){
    // Create the type of projection we want for the map : Docs -> https://github.com/d3/d3-geo#geoMercator
    let projection = d3.geo.mercator()
            .scale(125)
            .translate([350, 375]);
    // Create a path variable
    let path = d3.geo.path().projection(projection);
    // Create the SVG zone
    let svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);
    // Append a group to svg
    let g = svg.append("g");

    // Load our geojson map of the world : created with -> https://geojson-maps.ash.ms
    let mapFile = "data/processed/map.geojson";
    d3.json(mapFile, function(data){
        // Create an Area to the svg group with some parameter from the geojson
        var areas = g.selectAll("g")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "area")
            .attr("fill", "#A9A9A9")
            .attr("stroke", "#FFF")
            .attr("data-name", function(d) { return d.properties.name; })
            .attr("data-iso3", function(d) { return d.properties.iso_a3; })
            .attr("stroke-width", 0.5);

        // We will fill all country area with a color will define the criticity
        fillColorByCriticality(2014);
    });

    // Zoom management => http://bl.ocks.org/d3noob/5189284
    let zoom = d3.behavior.zoom()
        .on("zoom",function() {
            g.attr("transform","translate("+
                d3.event.translate.join(",")+")scale("+d3.event.scale+")");
      });

    svg.call(zoom)
}


function fillColorByCriticality(targetYear) {
    let csvCo2EmissionFile = "data/processed/co2-emissions.csv";
    let colors = ["#F0C8B5", "#EAAB90", "#D18358", "#B55E3E", "#7D3827"];
    let scales = [1.74, 4.64, 7.94, 11.69];
    let colorNoData = "#A9A9A9";

    d3.dsv(";")(csvCo2EmissionFile, function(error, data){
        data.forEach( function(element, index) {

            if(element[targetYear] == ""){
                $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colorNoData);
            }
            else{

                if(element[targetYear] < scales[0]){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[0]);
                }
                else if(element[targetYear] <= scales[1]){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[1]);
                }
                else if(element[targetYear] <= scales[2]){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[2]);
                }
                else if(element[targetYear] <= scales[3]){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[3]);
                }
                else if(element[targetYear] > scales[3]){
                    $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[4]);
                }

            }
        });

        // MANDATORY for a good working : next .hover and .click event must be inside the fillColorByCriticality function to works good
        // So, each time the fillColor... function is called, the event is re-defined, so we delet all event each time, to have only one event defined.
        $(".area").off();

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
            // Log the country click
            if($(this).data("name") != null){
                sendDataLog("click", "country", $(this).data("name"));
            }

            // Build a chart if we have an iso3 data
            if($(this).data("iso3") != null && $(this).data("iso3") != -99){
                buildBarChart($(this), data, colors, scales);
            }else{
                buildEmptyBarChart("Aucune donnée disponible pour ce pays");
            }
        });

    });
}



function updateTooltip(currentArea, data, targetYear){
    let hoverCountryName = currentArea.data("name");
    let countryIso3 = currentArea.data("iso3");
    let emissionObject = getEmissionObjectByIso3(data, countryIso3);
    let strEmissionsCount = null
    let strToDisplay = null;

    // Prevent error when hover a country who doesnt exist on the csv file.
    if(emissionObject != null){
        strEmissionsCount = emissionObject[targetYear];
    }else{
        strEmissionsCount = ""
    }

    if(strEmissionsCount == ""){
         strToDisplay = hoverCountryName +" ["+targetYear+"]"+ "<br>" + "Aucune donnée";
    }else{
        strToDisplay = hoverCountryName +" ["+targetYear+"]"+ "<br>" +parseFloat(strEmissionsCount).toFixed(3);
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
        "top": e.pageY - $(document).scrollTop() - 70,
        "left": e.pageX - $("#custom-tooltip").width() / 2 - 10,
    });
});



// Slider Management =>
// fill the map with good color criticallity based on the target year when we slide to show the change
slider.oninput = function() {
    output.innerHTML = this.value;
    fillColorByCriticality(this.value);
}
// When we choose a year, log the info
$("#years-slider").change(function(){
    sendDataLog("select", "year", $(this).val());
});


// Function that will create an empty bar chart, this way this is more userfriendly than a empty white bloc
function buildEmptyBarChart(title = "Veuillez cliquer sur un pays pour en voir le détail"){
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
                text: title,
                fontSize: 22,
            }
        }
    });
}

// Function that will build a real bachart to show the detail of one selected country
function buildBarChart(currentArea, data, colorsPattern, scales){
    let countryName = currentArea.data("name");
    let countryIso3 = currentArea.data("iso3");
    let emissionObject = getEmissionObjectByIso3(data, countryIso3);
    let maxYear = 2014;
    let yearGap = 20;


    // Prevent error if we can't found an object with the iso3 passed
    if(emissionObject != null){
        // Create 2 arrays, one for the data of co2 emissions, one for the label (displayed at the bottom of the bar chart)
        // Each array will be for a 20 year gap from 2014 (last data for the moment)
        let emissionData = new Array();
        let allLabels = new Array();
        for (var i = maxYear - yearGap; i <= maxYear ; i++) {
            strYear = i.toString();
            if(emissionObject[strYear] == null){
                emissionData.push(null);
            }else{
                emissionData.push(parseFloat(emissionObject[strYear]).toFixed(3));
            }

            allLabels.push(strYear);
        }

        // Create an array of colors that will contains the corresponding color for each data.
        // The color will be choose in comparaison with the scales[]. E.G: A data 1.80 (scales[0]) => color will be #F0C8B5 (colorsPattern[0])
        let colors = new Array();
        for (var i = 0; i < emissionData.length; i++) {
            if(emissionData[i] < scales[0]){
                colors.push(colorsPattern[0]);
            }
            else if(emissionData[i] <= scales[1]){
                colors.push(colorsPattern[1]);
            }
            else if(emissionData[i] <= scales[2]){
                colors.push(colorsPattern[2]);
            }
            else if(emissionData[i] <= scales[3]){
                colors.push(colorsPattern[3]);
            }
            else if(emissionData[i] > scales[3]){
                colors.push(colorsPattern[4]);
            }
        }

        let barChartData = {
          label: countryName,
          data: emissionData,
          backgroundColor: colors,
        };

        // Destroy the current barchart if exists, mandatory to create a new one
        if(barChart){
            barChart.destroy();
        }

        // Bar chart creation
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
                    text: countryName + " " + (maxYear - yearGap) + " - " + maxYear,
                    fontSize: 24,
                    fontColor: "#000",
                }
            }
        });
    }
    // No object data -> display an empty chart
    else{
        buildEmptyBarChart("Aucune donnée disponible pour ce pays");
    }
}

// We send a log of users usage, this way we can now which country is the most clicked, and which year is the most selected
function sendDataLog(eventType, target, data){
    var log = {
        event : eventType,
        target : target,
        data : data
    };
    var json = JSON.stringify(log);

    $.ajax({
        type: "POST",
        url: "http://172.17.102.83/api/projects/co2_emissions",
        // The key needs to match your method's input parameter (case-sensitive).
        data: json,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        dataType: "json",
        success: function(data){
            alert("OK");
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });
}