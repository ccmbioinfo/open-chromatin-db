var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var tmp = require('tmp');
var async = require('async');

// Open Express connection on port 3001
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
  parameterLimit: 2000
})); 
app.listen(port, () => console.log(`Listening on port ${port}`));

// Open connection to MySQL database
var connection = mysql.createConnection({
    user: 'node-user',
//    host: 'mysql',
    password: 'password',
    database: 'bed'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('SQL DB connected!');
});

var columns = "`DHS.Chr`, `DHS.Start`, `DHS.End`, `placenta`, `thyroid gland`, `retina`, `testis`, `embryonic facial prominence`, `heart left ventricle`, `SW480`, `hematopoietic multipotent progenitor cell`, `hepatocyte`, `superior temporal gyrus`, `skin fibroblast`, `left renal cortex interstitium`, `common myeloid progenitor, CD34-positive`, `muscle of arm`, `lung`, `renal pelvis`, `CD4-positive helper T cell`, `large intestine`, `iPS DF 19.11`, `right kidney`, `B cell`, `foreskin fibroblast`, `brain`, `muscle of leg`, `G401`, `cardiac mesoderm`, `muscle of trunk`, `kidney`, `forelimb muscle`, `muscle of back`, `stomach`, `adrenal gland`, `spinal cord`, `renal cortex interstitium`, `heart`, `trophoblast cell`, `medulla oblongata`, `RPMI8226`, `left kidney`, `small intestine`, `T-cell`, `EL`, `mammary epithelial cell`, `left lung`, `thymus`, `CD8-positive, alpha-beta T cell`, `iPS DF 6.9`, `dermis blood vessel endothelial cell`, `K562`, `fibroblast of skin of abdomen`, `SJCRH30`, `left renal pelvis`, `iPS DF 4.7`, `H9`, `right lung`, `right renal pelvis`, `eye`, `NAMALWA`, `Daoy`, `midbrain`, `ELF-1`, `KBM-7`, `SJSA1`, `LNCaP clone FGC`, `fibroblast of pedal digit skin`, `ovary`, `RCC 7860`, `A549`, `CD1c-positive myeloid dendritic cell`, `ELR`, `T-helper 1 cell`, `astrocyte of the cerebellum`, `fibroblast of the conjunctiva`, `MCF-7`, `non-pigmented ciliary epithelial cell`, `WI38`, `HL-60`, `prostate gland`, `amniotic stem cell`, `middle frontal gyrus`, `limb`, `LoVo`, `dedifferentiated amniotic fluid mesenchymal stem cell`, `IMR-90`, `urinary bladder`, `induced pluripotent stem cell`, `umbilical cord`, `Ammon's horn`, `tongue`, `inferior parietal cortex`, `NCI-H226`, `adipocyte`, `HepG2`, `bipolar neuron`, `neural stem progenitor cell`, `foreskin keratinocyte`, `Karpas-422`, `occipital lobe`, `SK-N-SH`, `A172`, `HAP-1`, `RKO`, `epithelial cell of prostate`, `T-helper 2 cell`, `CD14-positive monocyte`, `pancreas`, `MG63`, `retinal pigment epithelial cell`, `CMK`, `HFF-Myc`, `L1-S8`, `iPS DF 19.7`, `H1-hESC`, `putamen`, `pons`, `right renal cortex interstitium`, `EH`, `Caki2`, `globus pallidus`, `spleen`, `caudate nucleus`, `thoracic segment muscle`, `natural killer cell`, `dermis microvascular lymphatic vessel endothelial cell`, `epithelial cell of proximal tubule`, `brain pericyte`, `skin of body`, `SK-N-DZ`, `regulatory T cell`, `foreskin melanocyte`, `BE2C`, `fibroblast of upper leg skin`, `smooth muscle cell of the brain vasculature`, `fibroblast of gingiva`, `Panc1`, `fibroblast of pulmonary artery`, `HCT116`, `fibroblast of lung`, `Jurkat clone E61`, `GM12864`, `body of pancreas`, `ACHN`, `hindlimb muscle`, `H4`, `HT-29`, `pulmonary artery endothelial cell`, `HS-5`, `WERI-Rb-1`, `NT2/D1`, `L1-S8R`, `fibroblast of the aortic adventitia`, `fibroblast of dermis`, `fibroblast of arm`, `OCI-LY7`, `GM12878`, `MM.1S`, `fibroblast of mammary gland`, `bronchial epithelial cell`, `HeLa-S3`, `choroid plexus epithelial cell`, `keratinocyte`, `renal cortical epithelial cell`, `Caco-2`, `SK-N-MC`, `stromal cell of bone marrow`, `HS-27A`, `glomerular visceral epithelial cell`, `H7-hESC`, `myotube`, `PC-9`, `brain microvascular endothelial cell`, `fibroblast of peridontal ligament`, `glomerular endothelial cell`, `amniotic epithelial cell`, `A673`, `astrocyte`, `GM06990`, `kidney epithelial cell`, `PC-3`, `Acute Lymphocytic Leukemia - CTR`, `Acute Myeloid Leukemia`, `CD14-positive, CD16-negative classical monocyte`, `CD34-negative, CD41-positive, CD42-positive megakaryocyte cell`, `erythroblast`, `macrophage`, `macrophage - T=6days B-glucan`, `macrophage - T=6days LPS`, `macrophage - T=6days untreated`, `monocyte - T=0days`, `inflammatory macrophage`, `alternatively activated macrophage`, `CD4-positive, alpha-beta T cell`";

// POST query request from client
app.post('/search', (req, res) => {
  tmp.file({prefix: 'query-', postfix: '.bed'}, function _tempFileCreated(err, path, fd, cleanupCallBack) {
    if (err) throw err;
    
    var location = path.slice(path.indexOf('query-'));
    
    var params = [];
    
    var sql = `SELECT * FROM headers UNION SELECT ` + columns + ` INTO OUTFILE '/var/lib/mysql-files/${location}' FROM bedidx`;
    
    if (req.body.chr || req.body.start || req.body.end) {
      sql = sql + " WHERE";
      if (req.body.chr) {
        sql = sql + " `DHS.Chr`=?";
        params.push(req.body.chr);
      }
      if (req.body.start) {
        if (params.length != 0) {
          sql = sql + " AND CAST(`DHS.Start` AS SIGNED)>=?";
        } else {
          sql = sql + " CAST(`DHS.Start` AS SIGNED)>=?";
        }
        params.push(parseInt(req.body.start));
      }
      if (req.body.end) {
        if (params.length != 0) {
          sql = sql + " AND CAST(`DHS.End` AS SIGNED)<=?";
        } else {
          sql = sql + " CAST(`DHS.End` AS SIGNED)<=?";
        }
        params.push(parseInt(req.body.end));
      }
    }
    console.log(sql);
    console.log(params);
    connection.query(sql, params, (err,rows) => {
      if(err) throw err;
      console.log(rows);
      fs.createReadStream(`/var/lib/mysql-files/${location}`).pipe(fs.createWriteStream(`/home/samfeng/open-chromatin-db/client/public/files/${location}`));
      res.send({url: location});
    });
    cleanupCallBack();
  });
});

app.post('/tabledata', (req, res) => {
  var start = req.body.start | 0;
  var length = req.body.length | 0;
  
  params = [req.body.chr, req.body.chr, req.body.beginning, req.body.beginning, req.body.end, req.body.end, length, start];
  for (var i=0; i<params.length; i++) {
    if (params[i].length==0) params[i]=null;
  }
  console.log(params);

  var countSql = "SELECT COUNT(*) AS total FROM bedidx WHERE (? IS NULL OR `DHS.Chr` = ?) AND (? IS NULL OR CAST(`DHS.Start` AS SIGNED)>=?) AND (? IS NULL OR CAST(`DHS.End` AS SIGNED)<=?)"
  var dataSql = "SELECT * FROM bedidx WHERE (? IS NULL OR `DHS.Chr` = ?) AND (? IS NULL OR CAST(`DHS.Start` AS SIGNED)>=?) AND (? IS NULL OR CAST(`DHS.End` AS SIGNED)<=?) LIMIT ? OFFSET ?"
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

// GET request for table data from server
app.get('/headers', (req, res) => {
  var sql = "SELECT * FROM headers LIMIT 1"
  connection.query(sql, (err,rows) => {
    if(err) throw err;
    res.send(rows);
  });
});

// If required in the future, closes connection to MySQL database
//connection.end((err) => {
//});
