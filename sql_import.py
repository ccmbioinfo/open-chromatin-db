#!/usr/bin/python
import csv
import os
import MySQLdb

# Establish connection with database
db = MySQLdb.connect(user="root",
                     passwd="password",
                     db="bed")

cursor = db.cursor()

# Name of table to be created
table_name = "bed2"
directory = "/home/samfeng/bed/"

# Create table
cursor.execute("CREATE TABLE `{0}` (id int not null)".format(table_name))

# Create an array storing the list of BED files
bed_array = []
for x in os.listdir(directory):
  if x.endswith('.bed'):
    bed_array.append(directory + x)

# Determine the data headers and add to MySQL database
with open(bed_array[0]) as f:
  reader = csv.reader(f, delimiter='\t')
  header = next(reader)
  
for x in header:
  cursor.execute("ALTER TABLE {0} ADD `{1}` text".format(table_name, x) ) 

cursor.execute("ALTER TABLE {0} DROP COLUMN id".format(table_name))

header_string = "`{0}`".format("`, `".join(header))

# Load data from all files in bed_array
for x in bed_array:
  cursor.execute("LOAD DATA LOCAL INFILE '{0}' INTO TABLE {1} FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' IGNORE 1 LINES ({2})".format(x, table_name, header_string))
  
db.commit()
db.close();
