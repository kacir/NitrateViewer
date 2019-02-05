import numpy, gdal

def zonal_stats(rasterPath):
    pass

    #rasterPath = r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\nitrateRasters\k4.0.tiff"
    zonesPath = r"C:\scratch\scatch\zonesRaster3.tif"

    rasterDataset = gdal.Open(rasterPath)
    nitrateBand = rasterDataset.GetRasterBand(1)
    nitrateArray = nitrateBand.ReadAsArray()

    zoneDataset = gdal.Open(zonesPath)
    zoneBand = zoneDataset.GetRasterBand(1)
    zoneArray = zoneBand.ReadAsArray()

    print "array shape below"
    print nitrateArray.shape

    statsDict = {}

    #looping through dimentions of the nitrate Array - assuming the two rasters have ths ame extent
    xcounter = 0
    while xcounter < 1000 - 1:
        xcounter += 1
        ycounter = 0
        while ycounter < 945 - 1:
            ycounter += 1

            zoneValue = zoneArray[xcounter -1][ycounter -1]
            if zoneValue == -999:
                continue
            else:
                nitrateValue = nitrateArray[xcounter][ycounter]
                if  statsDict.has_key(zoneValue):
                    statsDict[zoneValue].append(nitrateValue)
                else:
                    statsDict[zoneValue] = []
                    statsDict[zoneValue].append(nitrateValue)

    summaryStats = []
            
    for key in statsDict.keys():
        mean = float(numpy.mean(statsDict[key]))
        std = float(numpy.std(statsDict[key]))
        summaryStats.append({ "id" : int(key), "mean" : mean, "std" : std})

    print "script finished, stats are as follows"
    print summaryStats
    return summaryStats
