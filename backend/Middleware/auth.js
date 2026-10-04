const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const auth = (...roles) => (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token || !JWT_SECRET)
    return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.sendStatus(401);
  }

  if (roles.length && !roles.includes(req.user.role))
    return res.sendStatus(403);
  return next();
};

const sign = (user) => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET must be configured");
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "8h" },
  );
};

module.exports = { auth, sign };
