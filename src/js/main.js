
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
        .attr("fill", "steelblue")
        .attr("stroke", "darkslategray")
        .attr("data-name", function(d) { return d.properties.name; })
        .attr("stroke-width", 0.5)
        .on("mouseenter", function(){
            d3.select(this)
                .attr("fill", "#F00");
        })
        .on("mouseout", function(){
            d3.select(this)
                .attr("fill", "steelblue");
        });

    /*group.append("text")
        .attr("x", function(d) { return path.centroid(d)[0]; })
        .attr("y", function(d) { return path.centroid(d)[1]; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.properties.name; });*/
});