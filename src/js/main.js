
var width = 760,
    height = 700;

var canvas = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3.geo.mercator()
        .scale(500)
        .translate([300, 1000]);

var path = d3.geo.path().projection(projection);

d3.json("datas/europe.geojson", function(data){

    //var country = data.features[0].properties.name;

    var group = canvas.selectAll("g")
        .data(data.features)
        .enter()
        .append("g");

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

            console.log(d3.select(this));
        })
        .on("mouseout", function(){
            d3.select(this)
                .attr("fill", "#A9A9A9");
        });

    /*group.append("text")
        .attr("x", function(d) { return path.centroid(d)[0]; })
        .attr("y", function(d) { return path.centroid(d)[1]; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.properties.name; });*/
});