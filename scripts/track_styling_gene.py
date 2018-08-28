#!/usr/bin/python

import json

file = "../jbrowse-gene/hg19/trackList.json"

with open(file) as f:
  data = json.load(f)
  
tracks = data["tracks"]

for item in tracks:
  if "category" in item and item["category"] == "DHS":
    item["onClick"] = { "label": "{name}", "url": "http://dhs.ccm.sickkids.ca:3000/dhs-gene/jbrowse-query?search={name}&type=dhs" }
  if item["label"] == "genes":
    item["onClick"] = { "label": "{name}", "url": "http://dhs.ccm.sickkids.ca:3000/dhs-gene/jbrowse-query?search={name}&type=gene" }
  
with open(file, 'w') as f:
  json.dump(data, f, indent=3)