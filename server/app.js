var express = require('express');
var fs = require('fs');
var child_process = require('child_process');
const uuidv4 = require('uuid/v4');
const csv = require('csvtojson');
var es = require('event-stream');

// Open Express connection on port 3001
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
  limit: '5mb', 
  parameterLimit: 10000 // Limits increased due to DataTables
})); 
app.listen(port, () => console.log(`Listening on port ${port}`));

// GET request for DHS-Gene data from server
app.post('/dhs', (req, res) => {
  var file = `/home/samfeng/DHS-Sorted/Intensity-${req.body.chr}-sorted.bed.gz`;
  var query = `${req.body.chr}:${req.body.beginning}-${req.body.end}`;
  console.log(file, query);
  var results = child_process.spawn('tabix', [file, query, '-h']);
  
  var tmpFile = '/tmp/' + uuidv4() + '.bed';
  var writeStream = fs.createWriteStream(tmpFile);

  results.stdout.pipe(writeStream);

  writeStream.on('finish', () => {
    res.send({
      fileName: tmpFile
    });
  });
});

// POST request to populate DataTables displaying DHS data
app.post('/tabledata', (req, res) => {
  var start = (req.body.start | 0) + 2;
  var quit = (req.body.length | 0) + start;
  var end = quit - 1;
  var file = req.body.file;
  
  var recordsTotal = '';
  var lengthCommand = `wc -l < ${file}`
  var length = child_process.spawn('sh', ['-c', lengthCommand]);
  length.stdout.on('data', function(data) {
    recordsTotal += data.toString('utf8') - 1;
    
    var output = [];
    var dataCommand = `sed -n '${start},${end}p;${quit}q' ${file}`
    var data = child_process.spawn('sh', ['-c', dataCommand]);
    
    data.stdout
      .pipe(es.split())
      .pipe(es.mapSync((line) => {
        if (line) {
          var split = line.split('\t');
          output.push(split);
        }
      }));

    data.on('close', function() {
      res.send({
        draw: req.body.draw,
        recordsTotal: recordsTotal,
        recordsFiltered: recordsTotal,
        data: output
      });
    });
  });
});

// POST request to download full queried DHS dataset from server
app.post('/full-file', (req, res) => {
  var tmpFile = req.body.fileName;
  console.log(tmpFile);
  fs.createReadStream(tmpFile).pipe(res); 
});

// POST request for headers for DHS data from server
app.post('/headers', (req, res) => {
  var tmpFile = req.body.fileName;
  csv({delimiter: '\t'})
    .fromFile(tmpFile)
    .on('header', (header) => {
      res.send(header);
    });
});

// GET request for DHS-Gene data from server
app.post('/gene', (req, res) => {
  var file = `/home/vnelakuditi/parsed_data_download/DHS-Gene-all_${req.body.chr}.sorted.tab.gz`;
  var query = `${req.body.chr}:${req.body.beginning}-${req.body.end}`;
  console.log(file, query);
  var results = child_process.spawn('tabix', [file, query, '-h']);
  
  var tmpFile = '/tmp/' + uuidv4() + '.bed';
  var writeStream = fs.createWriteStream(tmpFile);

  results.stdout.pipe(writeStream);

  writeStream.on('finish', () => {
    res.send({
      fileName: tmpFile
    });
  });
});

// POST request to populate DataTables displaying DHS-gene data
app.post('/tabledata-gene', (req, res) => {
  var start = (req.body.start | 0) + 2;
  var quit = (req.body.length | 0) + start;
  var end = quit - 1;
  var file = req.body.file;
  
  var recordsTotal = '';
  var lengthCommand = `wc -l < ${file}`
  var length = child_process.spawn('sh', ['-c', lengthCommand]);
  length.stdout.on('data', function(data) {
    recordsTotal += data.toString('utf8') - 1;
    
    var output = [];
    var dataCommand = `sed -n '${start},${end}p;${quit}q' ${file}`
    var data = child_process.spawn('sh', ['-c', dataCommand]);
    
    data.stdout
      .pipe(es.split())
      .pipe(es.mapSync((line) => {
        if (line) {
          var split = line.split('\t');
          output.push(split);
        }
      }));

    data.on('close', function() {
      res.send({
        draw: req.body.draw,
        recordsTotal: recordsTotal,
        recordsFiltered: recordsTotal,
        data: output
      });
    });
  });
});

// POST request to download full queried DHS-Gene dataset from server
app.post('/full-file-gene', (req, res) => {  
  var tmpFile = req.body.fileName;
  console.log(tmpFile);
  fs.createReadStream(tmpFile).pipe(res); 
}); 

// POST request for headers for DHS-Gene data from server
app.post('/headers-gene', (req, res) => {
  var tmpFile = req.body.fileName;
  csv({delimiter: '\t'})
    .fromFile(tmpFile)
    .on('header', (header) => {
      res.send(header);
    });
});