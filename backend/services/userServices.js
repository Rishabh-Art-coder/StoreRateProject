const bcrypt = require("bcrypt");

const { q } = require("./db");

async function createUser(b, role) {
  const hash = await bcrypt.hash(b.password, 10);

  const r = await q(
    "INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,?,?)",
    [b.name, b.email.toLowerCase(), hash, b.address || "", role],
  );

  return (
    await q("SELECT id,name,email,address,role FROM users WHERE id=?", [
      r.insertId,
    ])
  )[0];
}

module.exports = { createUser };
