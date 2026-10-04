const bad = (res, msg, code = 400) => res.status(code).json({ error: msg });
const dup = (err) => err && err.code === "ER_DUP_ENTRY";
const like = (value) => `%${String(value || "").trim()}%`;

const orderBy = (req, columns, defaultColumn) => {
  const column =
    Array.isArray(columns)
      ? columns.includes(req.query.sort)
        ? req.query.sort
        : defaultColumn
      : Object.prototype.hasOwnProperty.call(columns, req.query.sort)
        ? columns[req.query.sort]
        : columns[defaultColumn];
  return `ORDER BY ${column} ${
    String(req.query.order).toLowerCase() === "desc" ? "DESC" : "ASC"
  }`;
};

module.exports = { bad, dup, like, orderBy };