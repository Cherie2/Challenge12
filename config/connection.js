
// Import and require mysql2
const mysql = require('mysql2');


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    DB_USER,
    DB_PASS,
    DB_NAME
  },
);

db.connect(function(err){
  if(err) throw err
})

module.exports = db;