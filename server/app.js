var mysql = require('mysql');
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

// Open connection to MySQL database
var connection = mysql.createConnection({
    user: 'node-user',
//    host: 'mysql', // Required line if working with Docker
    password: 'password',
    database: 'bed'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('SQL DB connected!');
});

// All relevant columns in DHS data
var columns = "`DHS.Chr`, `DHS.Start`, `DHS.End`, `placenta`, `thyroid gland`, `retina`, `testis`, `embryonic facial prominence`, `heart left ventricle`, `SW480`, `hematopoietic multipotent progenitor cell`, `hepatocyte`, `superior temporal gyrus`, `skin fibroblast`, `left renal cortex interstitium`, `common myeloid progenitor, CD34-positive`, `muscle of arm`, `lung`, `renal pelvis`, `CD4-positive helper T cell`, `large intestine`, `iPS DF 19.11`, `right kidney`, `B cell`, `foreskin fibroblast`, `brain`, `muscle of leg`, `G401`, `cardiac mesoderm`, `muscle of trunk`, `kidney`, `forelimb muscle`, `muscle of back`, `stomach`, `adrenal gland`, `spinal cord`, `renal cortex interstitium`, `heart`, `trophoblast cell`, `medulla oblongata`, `RPMI8226`, `left kidney`, `small intestine`, `T-cell`, `EL`, `mammary epithelial cell`, `left lung`, `thymus`, `CD8-positive, alpha-beta T cell`, `iPS DF 6.9`, `dermis blood vessel endothelial cell`, `K562`, `fibroblast of skin of abdomen`, `SJCRH30`, `left renal pelvis`, `iPS DF 4.7`, `H9`, `right lung`, `right renal pelvis`, `eye`, `NAMALWA`, `Daoy`, `midbrain`, `ELF-1`, `KBM-7`, `SJSA1`, `LNCaP clone FGC`, `fibroblast of pedal digit skin`, `ovary`, `RCC 7860`, `A549`, `CD1c-positive myeloid dendritic cell`, `ELR`, `T-helper 1 cell`, `astrocyte of the cerebellum`, `fibroblast of the conjunctiva`, `MCF-7`, `non-pigmented ciliary epithelial cell`, `WI38`, `HL-60`, `prostate gland`, `amniotic stem cell`, `middle frontal gyrus`, `limb`, `LoVo`, `dedifferentiated amniotic fluid mesenchymal stem cell`, `IMR-90`, `urinary bladder`, `induced pluripotent stem cell`, `umbilical cord`, `Ammon's horn`, `tongue`, `inferior parietal cortex`, `NCI-H226`, `adipocyte`, `HepG2`, `bipolar neuron`, `neural stem progenitor cell`, `foreskin keratinocyte`, `Karpas-422`, `occipital lobe`, `SK-N-SH`, `A172`, `HAP-1`, `RKO`, `epithelial cell of prostate`, `T-helper 2 cell`, `CD14-positive monocyte`, `pancreas`, `MG63`, `retinal pigment epithelial cell`, `CMK`, `HFF-Myc`, `L1-S8`, `iPS DF 19.7`, `H1-hESC`, `putamen`, `pons`, `right renal cortex interstitium`, `EH`, `Caki2`, `globus pallidus`, `spleen`, `caudate nucleus`, `thoracic segment muscle`, `natural killer cell`, `dermis microvascular lymphatic vessel endothelial cell`, `epithelial cell of proximal tubule`, `brain pericyte`, `skin of body`, `SK-N-DZ`, `regulatory T cell`, `foreskin melanocyte`, `BE2C`, `fibroblast of upper leg skin`, `smooth muscle cell of the brain vasculature`, `fibroblast of gingiva`, `Panc1`, `fibroblast of pulmonary artery`, `HCT116`, `fibroblast of lung`, `Jurkat clone E61`, `GM12864`, `body of pancreas`, `ACHN`, `hindlimb muscle`, `H4`, `HT-29`, `pulmonary artery endothelial cell`, `HS-5`, `WERI-Rb-1`, `NT2/D1`, `L1-S8R`, `fibroblast of the aortic adventitia`, `fibroblast of dermis`, `fibroblast of arm`, `OCI-LY7`, `GM12878`, `MM.1S`, `fibroblast of mammary gland`, `bronchial epithelial cell`, `HeLa-S3`, `choroid plexus epithelial cell`, `keratinocyte`, `renal cortical epithelial cell`, `Caco-2`, `SK-N-MC`, `stromal cell of bone marrow`, `HS-27A`, `glomerular visceral epithelial cell`, `H7-hESC`, `myotube`, `PC-9`, `brain microvascular endothelial cell`, `fibroblast of peridontal ligament`, `glomerular endothelial cell`, `amniotic epithelial cell`, `A673`, `astrocyte`, `GM06990`, `kidney epithelial cell`, `PC-3`, `Acute Lymphocytic Leukemia - CTR`, `Acute Myeloid Leukemia`, `CD14-positive, CD16-negative classical monocyte`, `CD34-negative, CD41-positive, CD42-positive megakaryocyte cell`, `erythroblast`, `macrophage`, `macrophage - T=6days B-glucan`, `macrophage - T=6days LPS`, `macrophage - T=6days untreated`, `monocyte - T=0days`, `inflammatory macrophage`, `alternatively activated macrophage`, `CD4-positive, alpha-beta T cell`";

// POST request to populate DataTables displaying DHS data
app.post('/tabledata', (req, res) => {
  var start = req.body.start | 0;
  var length = req.body.length | 0;
  
  var params = [req.body.chr, req.body.chr, req.body.beginning, req.body.beginning, req.body.end, req.body.end, length, start];
  for (var i=0; i<params.length; i++) {
    if (params[i].length==0) params[i]=null;
  }
  console.log(params);

  var countSql = "SELECT COUNT(*) AS total FROM bedidx WHERE (? IS NULL OR `DHS.Chr` = ?) AND (? IS NULL OR CAST(`DHS.End` AS SIGNED)>=?) AND (? IS NULL OR CAST(`DHS.Start` AS SIGNED)<=?)"
  var dataSql = "SELECT * FROM bedidx WHERE (? IS NULL OR `DHS.Chr` = ?) AND (? IS NULL OR CAST(`DHS.End` AS SIGNED)>=?) AND (? IS NULL OR CAST(`DHS.Start` AS SIGNED)<=?) LIMIT ? OFFSET ?"
  connection.query(countSql, params, (err,countRows) => { 
    if(err) throw err;
    connection.query(dataSql, params, (err,dataRows) => {
      if(err) throw err;
      res.send({
        draw: req.body.draw,
        recordsTotal: 1449102,
        recordsFiltered: countRows[0].total,
        data: dataRows
      });
    });
  });
});

// POST request to download full queried DHS dataset from server
app.post('/full-file', (req, res) => {
  var location = '/var/lib/mysql-files/' + uuidv4() + '.bed';

  var params = [];
  var sql = `SELECT * FROM headers UNION SELECT ${columns} INTO OUTFILE '${location}' FROM bedidx`;

  params = [req.body.chr, req.body.chr, req.body.beginning, req.body.beginning, req.body.end, req.body.end];
  for (var i=0; i<params.length; i++) {
    if (params[i].length==0) params[i]=null;
  }
  console.log(params);

  sql = sql + " WHERE (? IS NULL OR `DHS.Chr` = ?) AND (? IS NULL OR CAST(`DHS.Start` AS SIGNED)>=?) AND (? IS NULL OR CAST(`DHS.End` AS SIGNED)<=?)"

  connection.query(sql, params, (err,rows) => {
    if(err) throw err;
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename=DHS.bed'
    });
    fs.createReadStream(location).pipe(res);
  });
});

// GET request for headers for DHS data from server
app.get('/headers', (req, res) => {
  var sql = "SELECT * FROM headers LIMIT 1"
  connection.query(sql, (err,rows) => {
    if(err) throw err;
    res.send(rows);
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
//  fs.unlink(tmpFile,(err) => {
//    if (err) console.log("Failed to delete temp file");
//  });
}); 

// GET request for headers for DHS-Gene data from server
app.post('/headers-gene', (req, res) => {
  var tmpFile = req.body.fileName;
  csv({delimiter: '\t'})
  .fromFile(tmpFile)
  .on('header', (header) => {
    console.log(header);
    res.send(header);
  });
});

// If required in the future, closes connection to MySQL database
//connection.end((err) => {
//});