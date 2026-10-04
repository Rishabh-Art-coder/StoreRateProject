require('dotenv').config();
const {dbConf , DB} = require('./config/index.js');

const mysql = require('mysql2');

const pool = mysql.createPool({
  ...dbConf,
  database: DB
  , decimalNumbers: true,
});

const q = async (sql, p) => (await pool.query(sql, p))[0];

module.exports = pool.promise();