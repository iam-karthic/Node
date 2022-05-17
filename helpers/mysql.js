const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_DB_HOST,
  port: process.env.MYSQL_DB_PORT,
  user: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  dateStrings: true,
});

module.exports = pool;
