#!/usr/bin/python
import os
import re

# Script to convert multiple CSV files into one, keeping only one header

directory = "/home/samfeng/Intensity-Final-Updated/"
output_file = "All-tracks-sorted.bed"

bed_array = []

for x in os.listdir(directory):
  if x.endswith('.bed'):
    bed_array.append(directory + x)

convert = lambda text: int(text) if text.isdigit() else text.lower()
alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
bed_array = sorted(bed_array, key = alphanum_key)

print bed_array

with open(output_file,"w") as outfile:
  with open(bed_array[0]) as f:
    for line in f:        #keep the header from file1
        outfile.write(line)

  for x in bed_array[1:]:
    with open(x) as f:
      next(f)
      for line in f:
        outfile.write(line)