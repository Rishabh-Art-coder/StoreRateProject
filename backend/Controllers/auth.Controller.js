const router = require("express").Router();
const bcrypt = require("bcrypt");
const { q } = require("../db");
const { auth, sign } = require("../middleware/auth");
const { check } = require("../utils/validation");
const { bad, dup } = require("../utils/helpers");
const { createUser } = require("../services/userService");

exports.signup = async (req, res) => {
  const e = check(req.body, ["name", "email", "address", "password"]);
  if (e) return bad(res, e);
  try {
    const u = await createUser(req.body, "user");
    res.status(201).json({ token: sign(u), user: u });
  } catch (error) {
    bad(res, dup(err) ? "Email already registered" : "Signup failed");
  }
};

exports.login = async (req, res) => {
  const [u] = await q("SELECT * FROM users WHERE email=?", [
    String(req.body.email || "").toLowerCase(),
  ]);

  if (
    !u ||
    !(await bcrypt.compare(String(req.body.password || ""), u.password_hash))
  )
    return bad(res, "Invalid email or password", 401);
  res.json({
    token: sign(u),
    user: { id: u.id, name: u.name, email: u.email, role: u.role },
  });
};

exports.changePassword = async(req , res) => {
  const e = check(req.body , ["password"]);
  if (e) return bad(res, e);
  await q("UPDATE users SET password_hash=? WHERE id=?", [
    await bcrypt.hash(req.body.password, 10),
    req.user.id,
  ]);
  res.json({ ok: true });
}