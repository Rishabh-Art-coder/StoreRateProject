const { dbConf, DB } = require("./config");

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  ...dbConf,
  database: DB,
  decimalNumbers: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const q = async (sql, parameters = []) => {
  const [rows] = await pool.query(sql, parameters);
  return rows;
};

module.exports = { pool, q };