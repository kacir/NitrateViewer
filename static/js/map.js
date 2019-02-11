//http://www.geothread.net/importing-geojson-data-in-arcgis-javascript-maps/
//link adds stuff to

//plugin made to load JSON data into a map
//https://github.com/Esri/geojson-layer-js

//making custom widgets
//https://developers.arcgis.com/javascript/latest/sample-code/widgets-custom-widget/index.html



require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WMSLayer",
    "esri/widgets/LayerList",
    "esri/layers/FeatureLayer",
    "esri/PopupTemplate",
    "esri/Graphic",
    "esri/geometry/Polygon",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleFillSymbol"
  ], function(
    Map,
    MapView,
    WMSLayer,
    LayerList,
    FeatureLayer,
    PopupTemplate,
    Graphic,
    Polygon,
    GraphicsLayer,
    SimpleFillSymbol
  ) {

    function geoJsonToGraphics (data) {
      var graphicsArray = [];

      var symbolTemplate = new SimpleFillSymbol ({
        color : [0,0,0],
        style : "solid"
      });
    
      for (i = 0; i < data.features; i++){
        var poly = new Polygon({
          rings: feature.geometry.coordinates,
          spatialReference : {wkid : 4326}
        });
    
        var tempGrahpic = new Graphic ({
          geometry: poly,
          symbol : symbolTemplate
        });
    
        graphicsArray.push(tempGrahpic);
      }
      var masterGraphicLayer = new GraphicsLayer ({graphics : graphicsArray });
      
      //add the graphics layer to the map
      map.add(masterGraphicLayer);
    
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
          fieldName: "canrate ",
          label: "Cancer Rate",
          format : {places : 0, digitSeparator : true},
          visible: true
        }, {
          fieldName: "nitrate ",
          label: "Nitrate Level",
          format : {places : 0, digitSeparator : true},
          visible: true
        }, {
          fieldName: "GEOID10",
          label: "GEOID10",
          visible: true
        }]
      }]
    };

    var template2 = new PopupTemplate()

    var popupLayer = new FeatureLayer({url : arcGISOnlineUrl, popupEnabled : true, popupTemplate : template });

    //add kml layer to map
    var testLayer = KMLLayer({url : "/test.kml"});

    var map = new Map({
      basemap: "gray",
      layers: [layer, popupLayer, testLayer]
    });

    var mapView = new MapView({
      container: "viewDiv",
      map: map,
      zoom : 7,
      center : [ -89.56 , 44.71]
    });

    mapView.when(function(){
     var layerList = new LayerList({view : mapView});

     mapView.ui.add(layerList , "top-right");
   });

   //request json data from backend
   $.ajax({url: "/censustract" , success : geoJsonToGraphics});

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