
var width = 760,
    height = 700;

createMap(width, height);

function createMap(width, height){

    // Create the SVG zone
    var canvas = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create the type of projection we want for the map : Docs -> https://github.com/d3/d3-geo#geoMercator
    var projection = d3.geo.mercator()
            .scale(500)
            .translate([300, 1000]);

    // Create a path variable
    var path = d3.geo.path().projection(projection);

    var tooltip = d3.select("#tooltip")
      .attr("class", "tooltip")
      .style("opacity", 0);

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
        fillColorByCriticality();
    });

}

function fillColorByCriticality() {
    let csvCo2EmissionFile = "data/processed/co2-emissions.csv";
    let colors = ["#F0C8B5", "#EAAB90", "#D18358", "#B55E3E", "#7D3827"];

    d3.dsv(";")(csvCo2EmissionFile, function(error, data){
        data.forEach( function(element, index) {
            if(element[2014] < 2.77){
                $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[0]);
            }
            else if(element[2014] <= 6.5){
                $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[1]);
            }
            else if(element[2014] <= 10.31){
                $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[2]);
            }
            else if(element[2014] <= 17.36){
                $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[3]);
            }
            else if(element[2014] > 17.36){
                $(".area[data-iso3="+element["Country Code"]+"]").css("fill", colors[4]);
            }
        });


        // Hover -> change color to show where we are on
        var lastHoveredColor;
        $(".area").hover(function(){

            //lastHoveredColor = $(this).css("fill");
            $(this).css({
               // "fill": "#000",
                "cursor": "pointer",
            });

            updateTooltip($(this), data);

        }, function(){
            //$(this).css("fill", lastHoveredColor);
            resetTooltip();
        });

    });
}



function updateTooltip(currentArea, data){
    let hoverCountryName = currentArea.data("name");
    let countryIso3 = currentArea.data("iso3");
    let emissionObject = getEmissionObjectByIso3(data, countryIso3);

    $("#custom-tooltip").html(hoverCountryName + " - "+ emissionObject[2014]);
    $("#custom-tooltip").show();
}

function resetTooltip(){
    $("#custom-tooltip").html("");
    $("#custom-tooltip").hide();
}

$(document).mousemove(function(e){
    $("#custom-tooltip").css({
        "top": e.pageY - $("#custom-tooltip").height() - 20,
        "left": e.pageX - $("#custom-tooltip").width() / 2 - 10,
    });
});

function getEmissionObjectByIso3(data, targetIso3){
    let emissionObject = null;
    data.forEach( function(element, index) {
        if(element["Country Code"] == targetIso3){
            emissionObject = element;
        }
    });

    return emissionObject;
}