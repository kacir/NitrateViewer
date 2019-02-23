from flask import Flask, request, render_template, jsonify, make_response
import gdal, osr
import os, os.path
from customZonalStats import zonal_stats
import json

app = Flask(__name__)

wellShapefilePath = r"C:\scratch\scatch\nitrate_wells2.shp"
nitrateRasterFolder = r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\nitrateRasters"

@app.route("/")
def home():
    """home page contains the website"""
    return render_template("index.html")

@app.route("/censustract")
def censusTracks():
    """return the census tract points as geojson"""
    return render_template("cancer_tracts.geojson")



@app.route("/calculate")
def findStats():
    """function finds or calculates the observed zonal statistics and sends it to the front end for display"""
    kValue = request.args.get("kvalue")

    #if the url parameter comes up empty then return nothing because there is not anything useful to calculate yet
    if kValue == None or kValue == "" or kValue == " " or kValue == "None":
        print("kvalue parameter not found. finishing request")
        return None
    try:
        kValue = float(kValue)
    except:
        print("kvalue parameter can't be converted to a number. finishing request")
    print "k value has been succesfully found. it is: " + str(kValue)


    #temp path for a nitrate raster for the particular k value
    destinationPath = r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\nitrateRasters\k" + str(kValue) + ".tiff"
    
    #if the raster does not exist then calculate the new raster
    if os.path.isfile(destinationPath):
        print "raster already exists. skipping over creation"
    else:
        print "raster does not already exist. generating new raster"
        calculateNitrateRaster(kValue, destinationPath)

    #perform zonal statistics on the raster
    print "about to run zonal statistics on " + destinationPath
    statsSummary = zonal_stats(destinationPath)

    #join the statsToJSON information
    print "starting to join feature and summary info"
    regressionDataX = []#secondary list that makes it easy for the front end to do linear regression
    regressionDataY = []#secondary list that makes it easy for the front end to do linear regression
    graphData = []#list that will make it easy for d3 to plot the points on a svg graph

    #loop through every single point feature in the geojson points file
    #and join to the nonspatial data from the zonal stats function
    featureCollectionString = open(r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\templates\cancer_tracts.geojson", "r").read()
    featureCollectionObject = json.loads(featureCollectionString)
    featureList = featureCollectionObject["features"]
    for feature in featureList:
        for summary in statsSummary:
            if feature["properties"]["id"] == summary["id"]:
                feature["stats"] = summary
                regressionDataX.append(summary["mean"])
                regressionDataY.append(feature["properties"]["canrate"])
                graphData.append([feature["properties"]["canrate"], summary["mean"]])

    print "finished joining spatial and non-spatial data"

    #placing the regression data into the JSON response
    featureCollectionObject["regressionDataX"] = regressionDataX
    featureCollectionObject["regressionDataY"] = regressionDataY
    featureCollectionObject["graphData"] = graphData

    #convert the zonal stats results into a python dictionary and then convert into json and send out
    print "converting list of lists to JSON"
    statsSummaryJSON = json.dumps(featureCollectionObject)
    print statsSummaryJSON

    #package the json into a response object and send to client machine
    print "converting JSON string into response to client machine"
    response = make_response(statsSummaryJSON)
    response.headers['content-type'] = 'application/json'
    return response




def calculateNitrateRaster(kValue, destinationPath):
    """does the raster interpelation for the project based on a provided k value using gdal"""
    print "calculate nitrate raster called!"
    algorithmOptions = 'invdist:power='+ str(kValue) + ':max_points=30:min_points=5:nodata=-999'
    outBounds = [294822.7680654586292803, 225108.6378120621666312, 774373.8599878594977781, 759802.2332637654617429]
    outRasterSRS = osr.SpatialReference()
    outRasterSRS.ImportFromEPSG(3070)
    gdal.Grid(destinationPath, wellShapefilePath, width=1000, height=1000, outputType=gdal.GDT_Float32, zfield="nitr_ran", algorithm=algorithmOptions, outputBounds=outBounds, outputSRS=outRasterSRS)