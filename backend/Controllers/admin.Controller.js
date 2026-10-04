const router = require("express").Router();
const { q } = require("../db");
const { auth } = require("../middleware/auth");
const { check } = require("../utils/validation");
const { bad, dup, like, orderBy } = require("../utils/helpers");
const { createUser } = require("../services/userService");

exports.getStatus = async (_, res) => {
  const [s] = await q(
    "SELECT (SELECT count(*) FROM users) users,(SELECT count(*) FROM stores) stores,(SELECT count(*) FROM ratings) ratings",
  );
  res.json(s);
};

exports.listUsers = async (req, res) => {
  const { name, email, address, role } = req.query,
    rl = role || "";
  res.json(
    await q(
      `SELECT u.id,u.name,u.email,u.address,u.role,${OWNER_RATING}
       FROM users u WHERE u.name LIKE ? AND u.email LIKE ? AND u.address LIKE ? AND (?='' OR u.role=?)
       ${orderBy(req, ["name", "email", "address", "role"], "name")}`,
      [like(name), like(email), like(address), rl, rl],
    ),
  );
};
exports.getUser = async (req, res) => {
  const [u] = await q(
    `SELECT u.id,u.name,u.email,u.address,u.role,${OWNER_RATING} FROM users u WHERE u.id=?`,
    [req.params.id],
  );
  u ? res.json(u) : res.sendStatus(404);
};

exports.createUser = async (req, res) => {
  const { name, email, address } = req.query;
  res.json(
    await q(
      `SELECT s.id,s.name,s.email,s.address,ROUND(AVG(r.rating),1) AS rating FROM stores s
       LEFT JOIN ratings r ON r.store_id=s.id WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
       GROUP BY s.id ${orderBy(req, ["name", "email", "address", "rating"], "name")}`,
      [like(name), like(email), like(address)],
    ),
  );
};
exports.listStores = async (req, res) => {
  const { name, email, address } = req.query;
  res.json(
    await q(
      `SELECT s.id,s.name,s.email,s.address,ROUND(AVG(r.rating),1) AS rating FROM stores s
       LEFT JOIN ratings r ON r.store_id=s.id WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
       GROUP BY s.id ${orderBy(req, ["name", "email", "address", "rating"], "name")}`,
      [like(name), like(email), like(address)],
    ),
  );
};

exports.createStore = async (req, res) => {
  const b = req.body,
    e = check(b, ["email", "address"]);
  if (e) return bad(res, e);
  if (!b.name || b.name.length > 60)
    return bad(res, "Store name is required (max 60 characters)");
  let ownerId = null;
  if (b.owner_email) {
    const [o] = await q("SELECT id FROM users WHERE email=? AND role='owner'", [
      b.owner_email.toLowerCase(),
    ]);
    if (!o) return bad(res, "No store owner found with that email");
    ownerId = o.id;
  }
  try {
    const r = await q(
      "INSERT INTO stores(name,email,address,owner_id) VALUES(?,?,?,?)",
      [b.name, b.email.toLowerCase(), b.address, ownerId],
    );
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    bad(
      res,
      dup(err) ? "Store email already exists" : "Could not create store",
    );
  }
};
