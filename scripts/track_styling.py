#!/usr/bin/python

import json

file = "../jbrowse/data/trackList.json"

with open(file) as f:
  data = json.load(f)
  
tracks = data["tracks"]

for item in tracks:
  if item['key'] != 'GRCh37':
    if item["type"] == "FeatureTrack":
      item["type"] = "CanvasFeatures"
    if "trackType" in item:
      item["trackType"] = "CanvasFeatures"
    if "style" in item:
      item["style"]["height"] = "function(feature){ if (feature.get('score')==0) {return 0;} else {return 15;} }"
      item["style"]["color"] = "function(feature) { var index=feature.get('color'); var color; if (index==0) color='#3300CC'; else if (index==1) color='#00FF99'; if (index==2) color='#9900FF'; if (index==3) color='#FFCC00'; else if (index==4) color='#FF0000'; if (index==5) color='#990033'; if (index==6) color='#FF9933'; else if (index==7) color='#00CCFF'; else if (index==8) color='#00FF33'; else if (index==9) color='#FF6699'; return color; }"
    item["displayMode"] = "compact"

with open(file, 'w') as f:
  json.dump(data, f, indent=3)
