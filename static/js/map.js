//http://www.geothread.net/importing-geojson-data-in-arcgis-javascript-maps/
//link adds stuff to

//plugin made to load JSON data into a map
//https://github.com/Esri/geojson-layer-js

//making custom widgets
//https://developers.arcgis.com/javascript/latest/sample-code/widgets-custom-widget/index.html

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WMSLayer"
  ], function(
    Map,
    MapView,
    WMSLayer
  ) {

    var layer = new WMSLayer({
      url: "http://giswebservices.massgis.state.ma.us/geoserver/ows?",
      sublayers: [{
        name: "massgis:GISDATA.AIRPORTS_PT"
      }]
    });

    var map = new Map({
      basemap: "streets",
      layers: [layer]
    });

    var view = new MapView({
      container: "viewDiv",
      map: map
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