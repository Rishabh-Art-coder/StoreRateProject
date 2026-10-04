const bcrypt = require("bcrypt");
const { q } = require("../db");
const { sign } = require("../Middleware/auth");
const { check } = require("../utils/validation");
const { bad, dup } = require("../utils/helpers");
const { createUser } = require("../services/userServices");

exports.signup = async (req, res) => {
  const error = check(req.body, ["name", "email", "address", "password"]);
  if (error) return bad(res, error);
  try {
    const user = await createUser(req.body, "user");
    return res.status(201).json({ token: sign(user), user });
  } catch (error) {
    if (dup(error)) return bad(res, "Email already registered", 409);
    throw error;
  }
};

exports.login = async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const [user] = await q("SELECT * FROM users WHERE email=?", [email]);

  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return bad(res, "Invalid email or password", 401);
  return res.json({
    token: sign(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.changePassword = async (req, res) => {
  const error = check(req.body, ["password"]);
  if (error) return bad(res, error);
  const result = await q("UPDATE users SET password_hash=? WHERE id=?", [
    await bcrypt.hash(req.body.password, 10),
    req.user.id,
  ]);
  if (!result.affectedRows) return res.sendStatus(404);
  return res.json({ ok: true });
};
