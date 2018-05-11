var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

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

app.post('/query', (req, res) => {
  console.log(req.body);
//  var sql = "SELECT * INTO OUTFILE '/var/lib/mysql-files/test.bed' FROM bed1";
  var sql = "SELECT * FROM bed1";
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
  sql = sql + " LIMIT 1";
  console.log(sql);
  console.log(params);
  connection.query(sql, params, (err,rows) => {
    if(err) throw err;
    console.log(rows);
    res.send(rows);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

//connection.end((err) => {
//});
