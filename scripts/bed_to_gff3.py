#!/usr/bin/python
import csv
import os
import re
import pandas as pd
import subprocess

# Filename refers to the BED file that needs to be converted
filename = '/home/samfeng/open-chromatin-db/files/All-Tracks.bed'

# Path to directory of project in question
project_root = '/home/samfeng/open-chromatin-db/'

dictionary = {}

# Keys that exist for each of the GFF files
constant_keys = ['DHS.Chr', 'DHS.Start', 'DHS.End']

with open(filename) as f:
  # Place data into pandas dataframe
  df = pd.read_csv(filename, sep='\t')
  
  # For each of the cell types, modify key such that it is an acceptable file name
  header = df.columns.values 
  reader = csv.reader(f, delimiter='\t')
  header = next(reader)

  for old_key in header:
    if old_key not in constant_keys:
      new_key = re.sub('[/=, ]', '', old_key)
      dictionary[new_key] = old_key
  
  print dictionary
  print "DF loaded!"
  
  # Constant values for required GFF fields
  df['period'] = '.'
  df['type'] = 'sequence_feature'
  
  # Round all numbers to 3 decimal palces
  df.round(3)
  
  # As BED files are 0 start-indexed and GFF files are 1 start-indexed, add 1 to the DHS.Start field
  df[constant_keys[1]]+=1
  
  # For each key, create file in proper GFF format. Score is the intensity of the cell-type. Import data into JBrowse.
  for key, value in dictionary.items(): 
    gff_filename = key + '.gff'
    gff_path = project_root + 'files/gff/' + gff_filename
    file = open(gff_path, 'w')
    columns = [constant_keys[0], 'period', 'type', constant_keys[1], constant_keys[2], value, 'period', 'period', 'period']
    df.to_csv(gff_path, sep='\t', header=None, index=None, columns=columns, float_format='%.3f')
    file.close()
    value = value.replace('/', '-')
    subprocess.call(['bin/flatfile-to-json.pl', '--gff', gff_path, '--trackLabel', value], cwd = project_root + 'jbrowse')
    print key