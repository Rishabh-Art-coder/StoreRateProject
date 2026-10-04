const { q } = require("../db");
const { check } = require("../utils/validation");
const { bad, dup, like, orderBy } = require("../utils/helpers");
const { createUser } = require("../services/userServices");

const OWNER_RATING = `(SELECT ROUND(AVG(r.rating),1) FROM stores s
  JOIN ratings r ON r.store_id=s.id WHERE s.owner_id=u.id) AS rating`;

exports.getStatus = async (_req, res) => {
  const [stats] = await q(
    "SELECT (SELECT count(*) FROM users) users,(SELECT count(*) FROM stores) stores,(SELECT count(*) FROM ratings) ratings",
  );
  res.json(stats);
};

exports.listUsers = async (req, res) => {
  const { name, email, address, role } = req.query;
  const selectedRole = role || "";
  res.json(
    await q(
      `SELECT u.id,u.name,u.email,u.address,u.role,${OWNER_RATING}
       FROM users u WHERE u.name LIKE ? AND u.email LIKE ? AND u.address LIKE ? AND (?='' OR u.role=?)
       ${orderBy(
         req,
         {
           name: "u.name",
           email: "u.email",
           address: "u.address",
           role: "u.role",
           rating: "rating",
         },
         "name",
       )}`,
      [like(name), like(email), like(address), selectedRole, selectedRole],
    ),
  );
};

exports.listOwners = async (_req, res) => {
  res.json(
    await q(
      "SELECT id,name,email,address,role FROM users WHERE role='owner' ORDER BY name",
    ),
  );
};

exports.getUser = async (req, res) => {
  const [user] = await q(
    `SELECT u.id,u.name,u.email,u.address,u.role,${OWNER_RATING} FROM users u WHERE u.id=?`,
    [req.params.id],
  );
  return user ? res.json(user) : res.sendStatus(404);
};

exports.createUser = async (req, res) => {
  const body = req.body;
  const error = check(body, ["name", "email", "address", "password"]);
  if (error) return bad(res, error);
  const role = body.role || "user";
  if (!["admin", "owner", "user"].includes(role))
    return bad(res, "Role must be admin, owner, or user");

  try {
    const user = await createUser(body, role);
    return res.status(201).json(user);
  } catch (error) {
    if (dup(error)) return bad(res, "Email already registered", 409);
    throw error;
  }
};

exports.listStores = async (req, res) => {
  const { name, email, address } = req.query;
  res.json(
    await q(
      `SELECT s.id,s.name,s.email,s.address,COALESCE(u.name,'Unassigned') AS owner,ROUND(AVG(r.rating),1) AS rating
       FROM stores s LEFT JOIN users u ON u.id=s.owner_id
       LEFT JOIN ratings r ON r.store_id=s.id
       WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
       GROUP BY s.id,u.name
       ${orderBy(
         req,
         {
           name: "s.name",
           email: "s.email",
           address: "s.address",
           owner: "u.name",
           rating: "rating",
         },
         "name",
       )}`,
      [like(name), like(email), like(address)],
    ),
  );
};

exports.createStore = async (req, res) => {
  const body = req.body;
  const error = check(body, ["email", "address"]);
  if (error) return bad(res, error);
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.trim().length > 60
  )
    return bad(res, "Store name is required (max 60 characters)");

  let ownerId = null;
  if (body.ownerId || body.owner_email) {
    const owners = body.ownerId
      ? await q("SELECT id FROM users WHERE id=? AND role='owner'", [
          body.ownerId,
        ])
      : await q("SELECT id FROM users WHERE email=? AND role='owner'", [
          body.owner_email.trim().toLowerCase(),
        ]);
    if (!owners[0]) return bad(res, "No store owner found with that email");
    ownerId = owners[0].id;
  }

  try {
    const result = await q(
      "INSERT INTO stores(name,email,address,owner_id) VALUES(?,?,?,?)",
      [
        body.name.trim(),
        body.email.trim().toLowerCase(),
        body.address.trim(),
        ownerId,
      ],
    );
    return res.status(201).json({ id: result.insertId });
  } catch (error) {
    if (dup(error)) return bad(res, "Store email already exists", 409);
    throw error;
  }
};
