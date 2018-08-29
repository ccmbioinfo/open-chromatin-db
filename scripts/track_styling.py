#!/usr/bin/python

import json
import csv

trackFile = "../jbrowse/data/trackList.json"
categoryFile = "Tissue-Categories.csv"

with open(trackFile) as f:
  trackData = json.load(f)
  
tracks = trackData["tracks"]

with open(categoryFile) as f:
  reader = csv.DictReader(f)
  categoryData = {}
  for row in reader:
    categoryData[row["Cell Type"]] = row["Category"]
  
for item in tracks:
  item["category"] =  categoryData[item["key"]]
  item["type"] = "CanvasFeatures"
  item["trackType"] = "CanvasFeatures"
  item["style"]["height"] = "function(feature){ if (feature.get('score')==0) {return 0;} else {return 15;} }"
  item["style"]["color"] = "function(feature) { var index=feature.get('color'); var color; if (index==0) color='#8dd3c7'; else if (index==1) color='#bebada'; if (index==2) color='#fccde5'; if (index==3) color='#fb8072'; else if (index==4) color='#80b1d3'; if (index==5) color='#fdb462'; if (index==6) color='#b3de69'; else if (index==7) color='#bc80bd'; return color; }"
  item["displayMode"] = "compact"
  item["onClick"] = { "label": "{seq_id}:{start}-{end}", "url": "http://dhs.ccm.sickkids.ca/dhs/jbrowse-query?search={seq_id}:{start}-{end}" }

with open(trackFile, 'w') as f:
  json.dump(trackData, f, indent=3)