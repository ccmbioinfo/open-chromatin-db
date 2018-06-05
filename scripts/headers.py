#!/usr/bin/python
import csv
import MySQLdb

# Establish connection with database
db = MySQLdb.connect(user="root",
                     passwd="password",
                     db="bed")

cursor = db.cursor()

table_name = "headers"
directory = "/home/samfeng/bed/"

# headers.bed should be a BED file only with header values
file_name = directory + "headers.bed"

# Create table
cursor.execute("CREATE TABLE `{0}` (id int not null)".format(table_name))

with open(directory + "headers.bed") as f:
  reader = csv.reader(f, delimiter='\t')
  header = next(reader)
  
for x in header:
  cursor.execute("ALTER TABLE {0} ADD `{1}` text".format(table_name, x) ) 

cursor.execute("ALTER TABLE {0} DROP COLUMN id".format(table_name))

header_string = "`{0}`".format("`, `".join(header))

cursor.execute("LOAD DATA LOCAL INFILE '{0}' INTO TABLE {1} FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' ({2})".format(file_name, table_name, header_string))
  
db.commit()
db.close();


