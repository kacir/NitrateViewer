//module sets up the svg graphic programatically based on a hard coded set of graph dimentions and padding
var graph = d3.select("#graphsvg");

var paddingLeft = 20;
var paddingRight = 20;
var paddingBottom = 20;
var paddingTop = 20;

var paddingInteriorLeft = 50;
var paddingInteriorRight = 10;
var paddingInteriorBottom = 50;
var paddingInteriorTop = 10;

var svgWidth = 500;
var svgHeight = 500;

//dimentions of the graph interior where the points will be
var graphWidth = svgWidth - paddingLeft - paddingRight - paddingInteriorLeft - paddingInteriorRight;
var graphHeight = svgHeight - paddingBottom - paddingTop - paddingInteriorBottom - paddingInteriorTop;

//generate groups for graph labels and other info to show
//background rectable for the entire svg
graph.append("rect")
    .classed("svg-background", true)
    .attr("width" , svgWidth.toString())
    .attr("height" , svgHeight.toString())
    .attr("style", "fill:rgb(255,255,255)");

//group for the axis labels
var labelsGroup = graph.append("g")
    .classed("labels", true)
    .attr("transform", "translate(" + paddingLeft + "," + paddingTop + ")");

// x axis label
labelsGroup.append("text")
    .text("Nitrate Levels")
    .attr("text-anchor", "middle")
    .attr("transform" , "translate(" + ((svgWidth - paddingLeft -  paddingRight) / 2) + "," + ((svgHeight - paddingBottom - paddingTop)) + ")" );

// y axis label
labelsGroup.append("text")
    .text("Cancer Rate")
    .attr("text-anchor" , "middle")
    .attr("transform", "translate(" + (paddingLeft) + "," + ((svgHeight - paddingBottom - paddingTop) / 2) + "), rotate(-90)");

//graph group that will contain everything in the interior of the graph like the legend, points and trendline
var graphInterior = graph.append("g")
    .classed("graphInterior", true)
    .attr("transform", "translate(" + (paddingLeft + paddingInteriorLeft) + "," + (paddingTop + paddingInteriorTop) + ")");

//background color rectagle for svg
graphInterior.append("rect")
    .attr("id" , "graphInteriorrect")
    .attr("width" , graphWidth)
    .attr("height" , graphHeight)
    .attr("style", "fill:rgb(230,230,230)");





//append a legend for the graph into the graph space
graphLegend = graphInterior.append("g")
    .attr("id", "graphlegend")
    .attr("transform" , "translate(" + (graphWidth * 0.7) + ", 20)");

graphLegend.append("rect")
    .attr("stroke" , "black")
    .attr("fill", "white")
    .attr("stroke-width" , "1")
    .attr("width", "90")
    .attr("height" , "60");

graphLegend.append("text")
    .text("Legend")
    .classed("graph-legend-item", true)
    .style("fill", "black")
    .attr("text-anchor", "start")
    .attr("transform" , "translate(20, 17)");

graphLegend.append("text")
    .text("Census Tract")
    .classed("graph-legend-item", true)
    .attr("font-size" , "12")
    .attr("text-anchor", "start")
    .attr("transform" , "translate(20, 34)");

graphLegend.append("text")
    .text("Trendline")
    .classed("graph-legend-item", true)
    .attr("font-size" , "12")
    .attr("text-anchor", "start")
    .attr("transform" , "translate(30, 54)");

graphLegend.append("circle")
    .classed("graph-legend-item", true)
    .attr("r", 2)
    .attr("fill" , "blue")
    .attr("transform" , "translate(10, 30)");

graphLegend.append("line")
    .classed("graph-legend-item", true)
    .attr("stroke", "rgb(255,0,0)")
    .attr("stroke-width" , "2")
    .attr("stroke-dasharray", "20")
    .attr("x2", 25)
    .attr("y2", 0)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("transform" , "translate(5, 50)");