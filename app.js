var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
let Client = require('ssh2-sftp-client');
let sftp = new Client();
sftp.connect({
  host: '172.20.4.59',
  port: '22',
  username: 'samfeng',
  password: 'xsw2XSW@'
}).catch((err) => {
  consol.log(err);
});

const app = express();
const port = process.env.PORT || 3001;

var connection = mysql.createConnection({
    user: 'root',
    password: 'password',
    database: 'bed'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.use(bodyParser.json());

app.post('/search', (req, res) => {
  sftp.list('/var/lib/mysql-files/').then((data) => {
    if (data.length > 0) {
      sftp.delete('/var/lib/mysql-files/Query-result.bed');
    }
    console.log(req.body);
    var sql = "SELECT * FROM headers UNION SELECT * INTO OUTFILE '/var/lib/mysql-files/Query-result.bed' FROM bed";
    var params = [];
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
      res.send(rows);
      sftp.get('/var/lib/mysql-files/Query-result.bed').then((stream)=> {
        stream.pipe(fs.createWriteStream('/home/samfeng/open-chromatin-db/public/files/Query-result.bed'));
      });
    });
  });
});

app.get('/tabledata', (req, res) => {
  var sql = "SELECT * FROM bed LIMIT 5000"
  connection.query(sql, (err,rows) => {
    if(err) throw err;
    res.send(rows);
  });
});

//app.get('/export', (req, res) => {
// 
//});

app.listen(port, () => console.log(`Listening on port ${port}`));

//connection.end((err) => {
//});
