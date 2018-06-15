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
table_name = "bed"
directory = "/home/samfeng/bed/Intensity"

# Create table
cursor.execute("CREATE TABLE `{0}` (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (id))".format(table_name))

# Create an array storing the list of BED files
bed_array = []
for x in os.listdir(directory):
  if x.endswith('.bed'):
    bed_array.append(directory + x)

# Perform a natural sort on BED files (assuming they are differentiated by chromosome number)
convert = lambda text: int(text) if text.isdigit() else text.lower() 
alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ] 
bed_array = sorted(bed_array, key = alphanum_key)

# Determine the data headers and add to MySQL database
with open(bed_array[0]) as f:
  reader = csv.reader(f, delimiter='\t')
  header = next(reader)

cursor.execute("ALTER TABLE {0} ADD `{1}` VARCHAR(5), ADD `{2}` INT, ADD `{3}` INT".format(table_name, header[0], header[1], header[2])) 

for x in header[3:]:
  cursor.execute("ALTER TABLE {0} ADD `{1}` DECIMAL(4,3)".format(table_name, x) ) 

header_string = "`{0}`".format("`, `".join(header))

# Load data from all files in bed_array
for x in bed_array:
  cursor.execute("LOAD DATA LOCAL INFILE '{0}' INTO TABLE {1} FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' IGNORE 1 LINES ({2})".format(x, table_name, header_string))

cursor.execute("CREATE INDEX query_index ON {0} (`{1}`, `{2}`, `{3}`)".format(table_name, header[0], header[1], header[2]))

db.commit()
db.close();
