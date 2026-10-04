const bcrypt = require("bcrypt");
const { dbConf, DB, ADMIN_EMAIL, ADMIN_PASSWORD } = require("./config");
const { q } = require("./db");

module.exports = async function initDb() {
  // create database if missing

  const c = await mysql.createConnection(dbConf);
  await c.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET utf8mb4`,
  );
  await c.end();

  // 2. run Schema
  const schema = fs.readFileSync(
    path.join(__dirname, "..", "schema.sql"),
    "utf8",
  );
  for (const stmt of schema.split(";").filter((s) => s.trim())) await q(stmt);

  // 3. seed default admin

  const [a] = await q("SELECT 1 FROM users WHERE role='admin' LIMIT 1");
  if (!a) {
    await q(
      "INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,'Head office','admin')",
      [
        "System Administrator Account",
        ADMIN_EMAIL,
        await bcrypt.hash(ADMIN_PASSWORD, 10),
      ],
    );
    console.log("Default admin created:", ADMIN_EMAIL);
  }
};
