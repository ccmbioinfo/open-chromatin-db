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
  var sql = 'SELECT * from bed1 WHERE `DHS.Chr`=? AND CAST(`DHS.Start` AS SIGNED)>? AND CAST(`DHS.End` AS SIGNED)<? LIMIT 1';
  var params = [req.body.chr, parseInt(req.body.start), parseInt(req.body.end)];
  connection.query(sql, params, (err,rows) => {
    if(err) throw err;
    console.log(JSON.stringify(rows));
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));