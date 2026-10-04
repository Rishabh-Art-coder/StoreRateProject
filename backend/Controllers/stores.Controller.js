exports.listStores = async (req, res) => {
  const s = like(req.query.search);
  res.json(
    await q(
      `SELECT s.id,s.name,s.address,ROUND(AVG(r.rating),1) AS rating,
       (SELECT rating FROM ratings WHERE store_id=s.id AND user_id=?) AS my_rating
       FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
       WHERE s.name LIKE ? OR s.address LIKE ? GROUP BY s.id ${orderBy(req, ["name", "address", "rating"], "name")}`,
      [req.user.id, s, s],
    ),
  );
};
exports.rateStore = async (req, res) => {
  const n = Number(req.body.rating);
  if (!Number.isInteger(n) || n < 1 || n > 5)
    return bad(res, "Rating must be between 1 and 5");
  try {
    await q(
      `INSERT INTO ratings(user_id,store_id,rating) VALUES(?,?,?)
       ON DUPLICATE KEY UPDATE rating=VALUES(rating)`,
      [req.user.id, req.params.id, n],
    );
    res.json({ ok: true });
  } catch {
    bad(res, "Store not found", 404);
  }
};
