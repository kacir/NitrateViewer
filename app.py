from flask import Flask
import gdal
import os, os.path
app = Flask(__name__)

@app.route("/")
def home():
    """home page contains the website"""
    return "Hello, Flask!"

@app.route("/")
def findStats():
    """function finds or calculates the observed zonal statistics and sends it to the front end for display"""


    return ""

def calculateNitrateRaster(kValue):
    """does the raster interpelation for the project based on a provided k value using gdal"""
    wellShapefilePath = r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\originData\well_nitrate.shp"
    destinationPath = r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\nitrateRasters\k" + str(kValue) + ".tiff"
    algorithmOptions = 'invdist:power='+ kValue + ':max_points=30:min_points=5'

    gdal.Grid(destinationPath, wellShapefilePath, outputType=gdal.GDT_Byte, zfield="nitr_ran", algorithm=algorithmOptions)

    #force script to wait untill the raster has finished being generated, then return the path to the new raster

    return destinationPath

def findRaster(kValue) :
    """searches the static job directly to determine if the raster 
    has already been generated for the specific k value. This should cut 
    down on the time it takes to run the process for future 
    requests for the same k value """
    return ""