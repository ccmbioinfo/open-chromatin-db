#!/usr/bin/python

import json

file = "../trackList.json"

with open(file) as f:
  data = json.load(f)
  
tracks = data["tracks"]

for item in tracks:
  if item["type"] == "FeatureTrack":
    item["type"] = "CanvasFeatures"
  if "trackType" in item:
    item["trackType"] = "CanvasFeatures"
  if "style" in item:
    item["style"]["height"] = "function(feature){ return feature.get('score') * 20; }"

with open(file, 'w') as f:
  json.dump(data, f, indent=4)