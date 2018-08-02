#!/usr/bin/python

import json

file = "../jbrowse/data/trackList.json"

with open(file) as f:
  data = json.load(f)
  
tracks = data["tracks"]

for item in tracks:
  if item["type"] == "FeatureTrack":
    item["type"] = "CanvasFeatures"
  if "trackType" in item:
    item["trackType"] = "CanvasFeatures"
  if "style" in item:
    item["style"]["height"] = "function(feature){ if (feature.get('score')==0) {return 0;} else {return 15;} }"
    item["style"]["color"] = "function(feature) { var index=feature.get('color'); var color; if (index==0) color='#8dd3c7'; else if (index==1) color='#bebada'; if (index==2) color='#fccde5'; if (index==3) color='#fb8072'; else if (index==4) color='#80b1d3'; if (index==5) color='#fdb462'; if (index==6) color='#b3de69'; else if (index==7) color='#bc80bd'; return color; }"
  item["displayMode"] = "compact"

with open(file, 'w') as f:
  json.dump(data, f, indent=3)
