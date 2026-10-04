const { q } = require("../db");
const { bad, like, orderBy } = require("../utils/helpers");

exports.listStores = async (req, res) => {
  const search = like(req.query.search);
  res.json(
    await q(
      `SELECT s.id,s.name,s.address,ROUND(AVG(r.rating),1) AS rating,
       (SELECT rating FROM ratings WHERE store_id=s.id AND user_id=?) AS my_rating
       FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
       WHERE s.name LIKE ? OR s.address LIKE ?
       GROUP BY s.id
       ${orderBy(
         req,
         { name: "s.name", address: "s.address", rating: "rating" },
         "name",
       )}`,
      [req.user.id, search, search],
    ),
  );
};

exports.rateStore = async (req, res) => {
  const rating = Number(req.body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return bad(res, "Rating must be between 1 and 5");

  const stores = await q("SELECT id FROM stores WHERE id=?", [req.params.id]);
  if (!stores.length) return bad(res, "Store not found", 404);

  await q(
    `INSERT INTO ratings(user_id,store_id,rating) VALUES(?,?,?)
     ON DUPLICATE KEY UPDATE rating=VALUES(rating)`,
    [req.user.id, req.params.id, rating],
  );
  return res.json({ ok: true });
};
