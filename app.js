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
  var sql = "SELECT * from bed1";
  var params = [];
  if (req.body.chr || req.body.start || req.body.end) {
    sql = sql + " WHERE";
    if (req.body.chr) {
      sql = sql + " `DHS.Chr`=?";
      params.push(req.body.chr);
    } 
    if (req.body.start) {
      if (params.length != 0) {
        sql = sql + " AND CAST(`DHS.Start` AS SIGNED)>?";
      } else {
        sql = sql + " CAST(`DHS.Start` AS SIGNED)>?";
      }
      params.push(parseInt(req.body.start));
    }
    if (req.body.end) {
      if (params.length != 0) {
        sql = sql + " AND CAST(`DHS.End` AS SIGNED)>?";
      } else {
        sql = sql + " CAST(`DHS.End` AS SIGNED)>?";
      }
      params.push(parseInt(req.body.start));
    }
  }
  sql = sql + " LIMIT 1";
  connection.query(sql, params, (err,rows) => {
    if(err) throw err;
    console.log(JSON.stringify(rows));
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

