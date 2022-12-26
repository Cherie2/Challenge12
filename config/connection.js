// Import and require mysql2 and dotenv
const mysql = require("mysql2");
require("dotenv").config();

// Connect to database
const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
