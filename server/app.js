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

// GET request for DHS data from server
app.post('/api/dhs', (req, res) => {
  var input = req.body.input.toLowerCase();
  var chr = input.match(/^chr(\d+)/);
  var file = `../data/DHS-Sorted/Intensity-${chr[0]}-sorted.bed.gz`;
  var query = `${input}`;
  console.log(file, query);
  
  var results;
  if (req.body.jbrowse) {
    var position = input.substr(input.indexOf(":") + 1).split('-').join('\t')
    console.log(`tabix ${file} ${query} -h | sed -e '1p' -e '/${position}'/!d`);
    results = child_process.spawn('sh', ['-c', `tabix ${file} ${query} -h | sed -e '1p' -e '/${position}'/!d`]);
  } else {
    results = child_process.spawn('tabix', [file, query, '-h']);
  }
  
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
app.post('/api/tabledata', (req, res) => {
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
app.post('/api/full-file', (req, res) => {
  var tmpFile = req.body.fileName;
  fs.createReadStream(tmpFile).pipe(res); 
});

// POST request for headers for DHS data from server
app.post('/api/headers', (req, res) => {
  var tmpFile = req.body.fileName;
  csv({delimiter: '\t'})
    .fromFile(tmpFile)
    .on('header', (header) => {
      res.send(header);
    });
});

// GET request for DHS-Gene data from server
app.post('/api/dhs-gene/dhs', (req, res) => {
  var input = req.body.input.toLowerCase();
  var position = '';
  if (input.split(':')[1] !== undefined) { 
    position =  position + ':' + input.split(':')[1]; 
  }
  input = input.substring(0,3) + input.charAt(3).toUpperCase() + position;
  var chr = input.match(/^chr(X|Y|\d+)/);
  var file = `../data/parsed_data_download/DHS-Gene-all_${chr[0]}.sorted.tab.gz`;
  var query = `${input}`;
  console.log(file, query);

  var results;
  if (req.body.jbrowse) {
    var position = input.substr(input.indexOf(":") + 1).split('-').join('\t')
    console.log(`tabix ${file} ${query} -h | sed -e '1p' -e '/${position}'/!d`);
    results = child_process.spawn('sh', ['-c', `tabix ${file} ${query} -h | sed -e '1p' -e '/${position}'/!d`]);
  } else {
    results = child_process.spawn('tabix', [file, query, '-h']);
  }
  
  var tmpFile = '/tmp/' + uuidv4() + '.bed';
  var writeStream = fs.createWriteStream(tmpFile);

  results.stdout.pipe(writeStream);

  writeStream.on('finish', () => {
    res.send({
      fileName: tmpFile
    });
  });
});

app.post('/api/dhs-gene/gene', (req, res) => {
  var input = req.body.input.toUpperCase();
  var geneIndex = child_process.spawn('sh', ['-c', `grep '${input}\\b' ../data/gene_column_indexes/*_geneindexes.out | cut -f1,5 | sed 's/.\\+://'`]);
  
  var chr, index;
  geneIndex.stdout.on('data', function(data) {
    var result = data.toString().replace(/\n|\r/g, '').split('\t');
    console.log(result);
    chr = result[0];
    index = result[1];
  });
  
  geneIndex.on('close', function (code) {
    if (chr !== undefined && index !== undefined) {
      var geneData = child_process.spawn('sh', ['-c', `cut -f1-3,${index} ../data/parsed_data_download/DHS-Gene-all_${chr}.sorted.tab`]);
      
      var tmpFile = '/tmp/' + uuidv4() + '.bed';
      var writeStream = fs.createWriteStream(tmpFile);

      geneData.stdout.pipe(writeStream);

      writeStream.on('finish', () => {
        res.send({
          fileName: tmpFile
        });
      });
    } else {
      res.send({
        fileName: '../client/public/files/empty.bed'
      });
    }
  });
});

// POST request to populate DataTables displaying DHS-gene data
app.post('/api/tabledata-gene', (req, res) => {
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
app.post('/api/full-file-gene', (req, res) => {  
  var tmpFile = req.body.fileName;
  fs.createReadStream(tmpFile).pipe(res); 
}); 

// POST request for headers for DHS-Gene data from server
app.post('/api/headers-gene', (req, res) => {
  var tmpFile = req.body.fileName;
  csv({delimiter: '\t'})
    .fromFile(tmpFile)
    .on('header', (header) => {
      res.send(header);
    });
});