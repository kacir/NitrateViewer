import numpy, gdal

def customListSort(a,b):
    """ custom sorter function needed to sort a dictonary object according to numeric identifer. """
    if a["id"] > b["id"]:
        return -1
    elif a["id"] == b["id"]:
        return 0
    else:
        return -1


def zonal_stats(rasterPath):
    """ takes a raster and transiltions it into a set of zonal stats for each census tract """

    #rasterPath = r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\nitrateRasters\k4.0.tiff"
    #path to rasterized census tracts
    zonesPath = r"C:\scratch\scatch\zonesRaster3.tif"
    
    #open the nitrate raster and convert it into a numpy array
    rasterDataset = gdal.Open(rasterPath)
    nitrateBand = rasterDataset.GetRasterBand(1)
    nitrateArray = nitrateBand.ReadAsArray()

    #open the zonal raster and convert it into a numpy array
    zoneDataset = gdal.Open(zonesPath)
    zoneBand = zoneDataset.GetRasterBand(1)
    zoneArray = zoneBand.ReadAsArray()

    #dictionary will contain keys for each zone. the key value will be a list of nitrate values for that zone.
    statsDict = {}

    #looping through dimentions of the nitrate Array - assuming the two rasters have the same extent and same # of cells in both dimentions
    xcounter = 0
    while xcounter < 1000 - 1:#loop through x axis
        xcounter += 1
        ycounter = 0
        while ycounter < 945 - 1:#loop through y axis
            ycounter += 1

            #find the value for that particular zone
            zoneValue = zoneArray[xcounter -1][ycounter -1]

            #-999 is a no data zone value, if there is no data then just move along
            if zoneValue == -999:
                continue
            else:
                nitrateValue = nitrateArray[xcounter][ycounter]
                #if the zone does that have a key yet in the stats dictionary then add it. if it does then append to the key's list
                if  statsDict.has_key(zoneValue):
                    statsDict[zoneValue].append(nitrateValue)
                else:
                    statsDict[zoneValue] = []
                    statsDict[zoneValue].append(nitrateValue)

    #create a hosting list which will contain zonal statsitics for each zone id
    summaryStats = []
    
    for key in statsDict.keys():
        mean = float(numpy.mean(statsDict[key]))
        std = float(numpy.std(statsDict[key]))
        summaryStats.append({ "id" : int(key), "mean" : mean, "std" : std})

    #return all of results in order of id
    summaryStats.sort(customListSort)
    summaryStats.reverse()

    print "script finished, stats are as follows"
    print summaryStats
    return summaryStats
