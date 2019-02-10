var graph = d3.select("#graphsvg");

var paddingLeft = 20;
var paddingRight = 20;
var paddingBottom = 20;
var paddingTop = 20;

var paddingInteriorLeft = 50;
var paddingInteriorRight = 50;
var paddingInteriorBottom = 50;
var paddingInteriorTop = 50;

var svgWidth = 500;
var svgHeight = 500;

var graphWidth = svgWidth - paddingLeft - paddingRight - paddingInteriorLeft - paddingInteriorRight;
var graphHeight = svgHeight - paddingBottom - paddingTop - paddingInteriorBottom - paddingInteriorTop;

//generate groups for graph labels and other info to show
graph.append("rect")
    .classed("svg-background", true)
    .attr("width" , svgWidth.toString())
    .attr("height" , svgHeight.toString())
    .attr("style", "fill:rgb(255,255,255)");

var labelsGroup = graph.append("g")
    .classed("labels", true)
    .attr("transform", "translate(" + paddingLeft + "," + paddingTop + ")");

// x axis label
labelsGroup.append("text")
    .text("Nitrate Levels")
    .attr("text-anchor", "middle")
    .attr("transform" , "translate(" + ((svgWidth - paddingLeft -  paddingRight) / 2) + "," + ((svgHeight - paddingBottom - paddingTop) - (paddingInteriorBottom / 2)) + ")" );

// y axis label
labelsGroup.append("text")
    .text("Cancer Rate")
    .attr("text-anchor" , "middle")
    .attr("transform", "translate(" + (paddingLeft + (paddingInteriorLeft / 2)) + "," + ((svgHeight - paddingBottom - paddingTop) / 2) + "), rotate(-90)");


var graphInterior = graph.append("g")
    .classed("graphInterior", true)
    .attr("transform", "translate(" + (paddingLeft + paddingInteriorLeft) + "," + (paddingTop + paddingInteriorTop) + ")");

graphInterior.append("rect")
    .attr("width" , graphWidth)
    .attr("height" , graphHeight)
    .attr("style", "fill:rgb(230,230,230)");

d3.select("#submit").on("click", function(){
    var kValue = $("input").val();

    if (isNaN(kValue)) {
        alert("value typed and submitted is not a number");
    } else {
        console.log("button has been pressed");
        alert("button pressed for value: " + kValue);

        //make a request to the backend for a kml file, then add the kml file to the map
    }


});