const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'quan-ly-mon-an'
});
connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ");
  } else {
      console.log("Error connecting database", err);
  }
});
module.exports = connection;
