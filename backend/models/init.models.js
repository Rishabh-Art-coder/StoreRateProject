const bcrypt = require("bcrypt");
const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");
const { dbConf, DB, ADMIN_EMAIL, ADMIN_PASSWORD } = require("../config");
const { q } = require("../db");

module.exports = async function initDb() {
  const connection = await mysql.createConnection(dbConf);
  try {
    const databaseName = DB.replace(/`/g, "``");
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4`,
    );
  } finally {
    await connection.end();
  }

  const schema = fs.readFileSync(
    path.join(__dirname, "..", "schema.sql"),
    "utf8",
  );
  for (const statement of schema.split(";").filter((part) => part.trim()))
    await q(statement);

  const [admin] = await q("SELECT 1 FROM users WHERE role='admin' LIMIT 1");
  if (!admin) {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD)
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be configured to seed the admin user",
      );
    await q(
      "INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,'Head office','admin')",
      [
        "System Administrator Account",
        ADMIN_EMAIL.trim().toLowerCase(),
        await bcrypt.hash(ADMIN_PASSWORD, 10),
      ],
    );
    console.log("Default admin created:", ADMIN_EMAIL.trim().toLowerCase());
  }
};
