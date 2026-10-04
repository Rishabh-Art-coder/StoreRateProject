const bad = (res, msg , code = 400) => res.status(code).json({error: msg});
const dup = (err) => err.code === "ER_DUP_ENTRY";
const like = (v) => `%${v|| ""}%`;

// whitelist- based Order by to avoid sql injection

const orderBy = (req , cols , def) => {
  `ORDER BY ${cols.includes(req.query.sort) ? req.query.sort : def} ${req.query.order === "desc" ? "DESC" : "ASC"}`
};

module.exports = {bad , dup , like , orderBy};