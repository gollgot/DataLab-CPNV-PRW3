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

    // Load our geojson map of Europe : created with -> https://geojson-maps.ash.ms
    d3.json("datas/europe.geojson", function(data){
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
            .attr("stroke-width", 0.7)
            .on("mouseenter", function(){
                d3.select(this)
                    .attr("fill", "#AD4032");

                //console.log(d3.select(this));
            })
            .on("mouseout", function(){
                d3.select(this)
                    .attr("fill", "#A9A9A9");
            });
    });
}