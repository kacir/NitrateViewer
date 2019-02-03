from zonal_stats import zonal_stats

print "running current file"
vectorPath = r"C:\scratch\scatch\cancer_tracts2.shx"
rasterPath = r"C:\Users\Robert\Documents\Grad School\GEOG777\prj1\NitrateViewer\nitrateRasters\k4.0.tiff"

stats = zonal_stats(vectorPath, rasterPath, global_src_extent=False)
print "stats finished"
print stats