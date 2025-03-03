//http://www.geothread.net/importing-geojson-data-in-arcgis-javascript-maps/
//link adds stuff to

//plugin made to load JSON data into a map
//https://github.com/Esri/geojson-layer-js

//making custom widgets
//https://developers.arcgis.com/javascript/latest/sample-code/widgets-custom-widget/index.html

function searchArray (subjectArray, targetID) {

  for (i = 0; i < subjectArray.length; i++ ){
    if (subjectArray[i].id == targetID){
      return i;
    };
  };
};

//linear regression formula taken from https://stackoverflow.com/questions/6195335/linear-regression-in-javascript
function linearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
  } 

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WMSLayer",
    "esri/widgets/LayerList",
    "esri/layers/FeatureLayer",
    "esri/PopupTemplate",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
  ], function(
    Map,
    MapView,
    WMSLayer,
    LayerList,
    FeatureLayer,
    PopupTemplate,
    Graphic,
    GraphicsLayer
  ) {

    function geoJsonToGraphics (data) {
      console.log("before parsing nitrate");
      console.log(data);
      
      var graphicsArray = [];
      var graphicsArrayStandardDev = [];
      var nitrateSymbol = {};
      var nitrateStandardDevSymbol = {};
      var pointSymbolSize = "10px"

      nitrateSymbol.high = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [0, 0, 255],
        size: pointSymbolSize,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      };

      nitrateSymbol.low = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [176, 224, 230],
        size: pointSymbolSize,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      };

      nitrateSymbol.medium = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [30, 144, 255],
        size: pointSymbolSize,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [255, 255, 255],
          width: 1
        }
      };

      nitrateSymbol.noData = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [0, 0, 0],
        size: pointSymbolSize,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [25, 25, 25],
          width: 1
        }
      };

      nitrateStandardDevSymbol.high = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [128,128,0],
        size: pointSymbolSize,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [169,169,169],
          width: 1
        }
      };

      nitrateStandardDevSymbol.medium = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [255,255,0],
        size: pointSymbolSize,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [169,169,169],
          width: 1
        }
      };

      nitrateStandardDevSymbol.low = {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        color: [255,255,204],
        size: pointSymbolSize,
        outline: { // autocasts as new SimpleLineSymbol()
          color: [169,169,169],
          width: 1
        }
      };

      var pointPopuptemplateNitrate = {
        title: "Census Tract Point (Nitrate)",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "id",
            label : "Tract ID"
          }, {
            fieldName: "mean",
            label : "Mean Nitrate Level",
            format : {places : 4, digitSeparator : false}
          }, {
            fieldName: "std",
            label : "Stand Deviation Within Tract",
            format : {places : 4, digitSeparator : false}
          }]
        }]
      };


      var pointPopuptemplateStd = {
        title: "Census Tract Point (Standard Deviation)",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "id",
            label : "Tract ID"
          }, {
            fieldName: "mean",
            label : "Mean Nitrate Level",
            format : {places : 4, digitSeparator : false}
          }, {
            fieldName: "std",
            label : "Stand Deviation Within Tract",
            format : {places : 4, digitSeparator : false}
          }]
        }]
      };

      //put together symbol markers for each standard deviation break
      var maxStandardDev = d3.max(data.features, function(element){
        if (!(element.stats === null || element.stats === undefined)) {
          return element.stats.std;
        } else {
          return null;
        }
      });
      //put together symbol markers for each standard deviation break
      var minStandardDev = d3.min(data.features, function(element){
        if (!(element.stats === null || element.stats === undefined)) {
          return element.stats.std;
        } else {
          return null;
        }
      });
      //standard deviation breakpoints for the calculations
      var standardDevRange = Math.abs(maxStandardDev - minStandardDev);
      var StandardDev1ThirdEnd = (standardDevRange / 3) + minStandardDev;
      var StandardDev2ThirdEnd = (standardDevRange / 3) + (standardDevRange / 3) + minStandardDev;
    
      for (i = 0; i < data.features.length; i++){
        var feature = data.features[i];
        var featureSummary = feature.stats;

        if (featureSummary === undefined){
          var pointAttributes = {id : -9999, mean : 0, std : 0};
          var choosenSymbolNitrate =  nitrateSymbol.noData;
          var choosenSymbolStandardDev = nitrateSymbol.noData;
        } else {
          var pointAttributes = {id : featureSummary.id, mean : featureSummary.mean, std : featureSummary.std};
          //symbolize nitrate according to catagory
          if (featureSummary.mean < 2 ) {
            var choosenSymbolNitrate = nitrateSymbol.low;
          } else if (featureSummary.mean >= 2 && featureSummary.mean < 4.5){
            var choosenSymbolNitrate = nitrateSymbol.medium;
          } else {
            var choosenSymbolNitrate = nitrateSymbol.high;
          }
          //symbolize nitrate standard deviation according to catagory
          if (featureSummary.std > minStandardDev && featureSummary.std < StandardDev1ThirdEnd){
            var choosenSymbolStandardDev = nitrateStandardDevSymbol.low;
          } else if (featureSummary.std > StandardDev1ThirdEnd && featureSummary.std < StandardDev2ThirdEnd){
            var choosenSymbolStandardDev = nitrateStandardDevSymbol.medium;
          } else {
            var choosenSymbolStandardDev = nitrateStandardDevSymbol.high;
          }

        }


        var tempPointNitrate = {
          type : "point",
          longitude : feature.geometry.coordinates[0],
          latitude : feature.geometry.coordinates[1]
        };
    
        var tempGrahpicNitrate = new Graphic ({
          geometry: tempPointNitrate,
          symbol: choosenSymbolNitrate,
          attributes : pointAttributes,
          popupTemplate : pointPopuptemplateNitrate
        });
    
        graphicsArray.push(tempGrahpicNitrate);

        var tempGraphicStandardDev = new Graphic ({
          geometry: tempPointNitrate,
          symbol: choosenSymbolStandardDev,
          attributes : pointAttributes,
          popupTemplate : pointPopuptemplateStd
        });

        graphicsArrayStandardDev.push(tempGraphicStandardDev);
      }
      var kValue = $("input").val();
      var standDevGraphicLayer = new GraphicsLayer ({visible: false, graphics : graphicsArrayStandardDev, title: "Nitrate Std Dev (K = " + kValue + ")" });
      var masterGraphicLayer = new GraphicsLayer ({graphics : graphicsArray, title: "Nitrate Levels (K = " + kValue + ")" });


      
      console.log("finished getting graphics together adding to map");

      //add the graphics layer to the map
      map.add(standDevGraphicLayer);
      map.add(masterGraphicLayer);

      console.log("starting to calculate the linear regression info");
      var regressionResults = linearRegression(data.regressionDataY, data.regressionDataX);
      console.log(regressionResults);
      //display the regression results on the front end
      if (regressionResults.r2 >= 0.5){
        var significanceText = "This means there is a high correlation between cancer rates and nitrate levels.";
      } else {
        var significanceText = "This means there is a low correlation between cancer rates and nitrate levels.";
      }
      $("#correlationfactors").text("The R Squared Value is: " + regressionResults.r2.toFixed(5) + 
        "." + significanceText + " The line of best fit formula is: Y = " + regressionResults.slope.toFixed(3) +  "X + " + regressionResults.intercept.toFixed(3));

      
      //create a linear scale to plot out the point data inside of the svg
      var xreturner = function(d) {return d[1];};
      var xscale = d3.scaleLinear()//x is the nitrate rate
        .domain([d3.min(data.graphData, xreturner) , d3.max(data.graphData, xreturner)])
        .range([0, graphWidth]);
      var yreturner = function(d){return d[0];};
      var yscale = d3.scaleLinear()//y is the cancer rate level
        .domain([d3.max(data.graphData, yreturner) , d3.min(data.graphData, yreturner)])
        .range([0, graphHeight]);
      
      console.log("the y max is: " + d3.max(data.graphData, yreturner));
      console.log("the y min was : " + d3.min(data.graphData, yreturner));

      console.log("the x min was: " + d3.min(data.graphData, xreturner));
      console.log("the x max was " + d3.max(data.graphData, xreturner));
      

      //convert the data into graphed information
      graphInterior.selectAll(".graphPoints")
        .data(data.graphData)
        .enter()
        .append("circle")
        .attr("r", 1.5)
        .attr("fill" , "black")
        .attr("class" , "graphPoints")
        .attr("yvalue" , function(data){
          return data[0];
        })
        .attr("xvalue" , function(data){
          return data[1];
        })
        .attr("cy", function(data){
          if (data[1] === undefined || data[0] === undefined){
            return 0;
          } else {
            return yscale(data[0]);
          }
        })
        .attr("cx", function(data){
          if (data[1] === undefined || data[0] === undefined){
            return 0;
          } else {
            return xscale(data[1]);
          }
        });

        //add y axis ticks
        var yAxis = d3.axisLeft().scale(yscale);
        graphInterior.append("g")
          .classed("axis-y", true)
          .call(yAxis);

        var xAxis = d3.axisBottom().scale(xscale);
        graphInterior.append("g")
          .classed("axis-x", true)
          .attr("transform" , "translate( 0 ," + graphHeight + ")")
          .call(xAxis);
      
      //Add trend line to the map
      //find x,y value for bottom left portion graph, (y is y intercept to best fit formula)
      var x1TrendLine = d3.min(data.graphData, xreturner);
      var y1TrendLine = (x1TrendLine * regressionResults.slope) + regressionResults.intercept;
      //find x,y value for top right postion of graph
      var x2TrendLine = d3.max(data.graphData, xreturner);
      var y2TrendLine = (x2TrendLine * regressionResults.slope) + regressionResults.intercept;
      //add line to graph interior
      graphInterior.append("line")
        .attr("stroke", "rgb(255,0,0)")
        .attr("stroke-width" , "5")
        .classed("trendline" , true)
        .attr("stroke-dasharray", "20")
        .attr("x1" , xscale(x1TrendLine))
        .attr("y1" , yscale(y1TrendLine))
        .attr("x2" , xscale(x2TrendLine))
        .attr("y2" , yscale(y2TrendLine));


      shower.hide();
      shower.legend();
    };
    

    var layer = new WMSLayer({
      url: "https://wms.qgiscloud.com/rkacir/censustract_service",
      sublayers: [{
        name: "cancer_tracts"
      }],
      title : "Cancer Rates"
    });

    var arcGISOnlineUrl = "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/cancer_tracts_kacir/FeatureServer/0?token=OoWHS6vgbO0OlDLMFvmUKWFcbGwFDtPdec6ecZ_cJXcnTqYFMcoO1QX-nxN-DePzCmqW2Br9ovt6EjKWGob9a0bpAd9WiwJhz9l2mu4Eofr_TLwkm6Sgu5tOJQw3Xsnh1pGYQnsIMJyDijzuClVepUEp9JqUL7V97b8pvZQxpziqCmTWfLdn7S9eVvCry1iIUSPcqvg7M350ms3vDc_A4z1mGen6KXuA9Bj_Lnk9FAviCouEiSAHygQVym8Y_4sk";

    var template = {  // autocasts as new PopupTemplate()
      title: "Census Tract",
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: "canrate",
          label: "Cancer Rate",
          format : {places : 2, digitSeparator : true},
          visible: true
        },
        {
          fieldName: "GEOID10",
          label: "GEOID10",
          visible: true
        }]
      }]
    };

    var template2 = new PopupTemplate()

    var popupLayer = new FeatureLayer({url : arcGISOnlineUrl, popupEnabled : true, popupTemplate : template, title : "Cancer Rates Popup" });

    var map = new Map({
      basemap: "gray",
      layers: [layer, popupLayer]
    });

    var mapView = new MapView({
      container: "viewDiv",
      map: map,
      zoom : 6,
      center : [ -89.56 , 44.71]
    });

    mapView.when(function(){
     var layerList = new LayerList({view : mapView});

     mapView.ui.add(layerList , "top-right");
   });


   var calculateStats = function(){
    shower.show();
    var kValue = $("input").val();

    if (isNaN(kValue)) {
        alert("value typed and submitted is not a number");
        shower.hide();
    } else {
        console.log("button has been pressed");

        //make a request to the backend for a kml file, then add the kml file to the map
        //request json data from backend
        //$.ajax({url: "/censustract" , success : geoJsonToGraphics});

        /*
        $.when($.ajax("/censustract") , $.ajax("/calculate?kvalue="+ kValue))
          .done(geoJsonToGraphics)
          .fail(alert("the calculate request has failed"));
          */
        $.ajax({url : "/calculate?kvalue=" + kValue, success : geoJsonToGraphics, timeout : 30000});
    }
}
   d3.select("#submit").on("click", calculateStats);
   $("input").keypress(function(e){
      if (e.originalEvent.key === "Enter"){
        console.log("enter key pressed!");
        calculateStats();
      }

   });



  });
  /***********************************
   * Data attribution:
   *  OpenStreetMap WMS by terrestris GmbH and Co. KG. Following sources were used:
   *  (c) OpenStreetMap contributors (http://www.openstreetmap.org/copyright)
   *  (c) OpenStreetMap Data (http://openstreetmapdata.com)
   *  (c) Natural Earth Data (http://www.naturalearthdata.com)
   *  (c) ASTER GDEM 30m (https://asterweb.jpl.nasa.gov/gdem.asp)
   *  (c) SRTM 450m by ViewfinderPanoramas (http://viewfinderpanoramas.org/)
   *  (c) Great Lakes Bathymetry by NGDC (http://www.ngdc.noaa.gov/mgg/greatlakes/)
   *  (c) SRTM 30m by NASA EOSDIS Land Processes Distributed Active Archive Center (LP DAAC, https://lpdaac.usgs.gov/)
   *********************************/