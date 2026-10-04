const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');

const auth = (...roles) => {
  try {
    req.user = jwt.verify((req.headers.authorization || "").slice(7),
      JWT_SECRET,);
    if (roles.length && !roles.includes(req.user.role))
      return res.sendStatus(403);
    next();
  } catch (error) {
    res.sendStatus(401);
  }
}


const sign = (u) =>
  jwt.sign({ id: u.id, role: u.role, name: u.name }, JWT_SECRET, {
    expiresIn: "8h",
  });

module.exports = { auth, sign };
