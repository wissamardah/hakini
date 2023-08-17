const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'binary',
  password: ''
});
connection.connect();
module.exports = connection;