const mysql      = require('mysql');
let connection = mysql.createConnection({
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
    //   let createConnection = mysql.createConnection({
		  // host     : '127.0.0.1',
		  // user     : 'root',
		  // password : ''
    //   });
    //   createConnection.connect(function(err) {
    //   	con.query("CREATE DATABASE quan-ly-mon-an", function (err, result) {});
    //   	connecttion.connect(function(err) {
      		
    //   	})
    //   });
  }
});
module.exports = connection;
