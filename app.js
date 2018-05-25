var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var tmp = require('tmp');

// Open Express connection on port 3001
const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.json());
app.listen(port, () => console.log(`Listening on port ${port}`));

// Open connection to MySQL database
var connection = mysql.createConnection({
    user: 'root',
    password: 'password',
    database: 'bed'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

// POST query request from client
app.post('/search', (req, res) => {
  tmp.file({prefix: 'query-', postfix: '.bed'}, function _tempFileCreated(err, path, fd, cleanupCallBack) {
    if (err) throw err;
    
    var location = path.slice(path.indexOf('query-'));
    
    var params = [];
    
    var sql = `SELECT * FROM headers UNION SELECT * INTO OUTFILE '/var/lib/mysql-files/${location}' FROM bed`;
    
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
    sql = sql + " LIMIT 2";
    console.log(sql);
    console.log(params);
    connection.query(sql, params, (err,rows) => {
      if(err) throw err;
      console.log(rows);
      fs.createReadStream(`/var/lib/mysql-files/${location}`).pipe(fs.createWriteStream(`/home/samfeng/open-chromatin-db/public/files/${location}`));
    });
    res.send({url: location});
    cleanupCallBack();
  });
});

// GET request for table data from server
app.get('/tabledata', (req, res) => {
  var sql = "SELECT * FROM bed LIMIT 5000"
  connection.query(sql, (err,rows) => {
    if(err) throw err;
    res.send(rows);
  });
});

// If required in the future, closes connection to MySQL database
//connection.end((err) => {
//});
