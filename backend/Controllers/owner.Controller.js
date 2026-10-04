const { q } = require("../db");
const { orderBy } = require("../utils/helpers");

exports.getDashboard = async (req, res) => {
  const [store] = await q(
    `SELECT s.id,s.name,s.address,ROUND(AVG(r.rating),1) AS average, count(r.id) AS total
     FROM stores s LEFT JOIN ratings r ON r.store_id=s.id WHERE s.owner_id=? GROUP BY s.id`,
    [req.user.id],
  );
  if (!store) return res.json({ store: null, raters: [] });
  const raters = await q(
    `SELECT u.name,u.email,r.rating,r.updated_at FROM ratings r JOIN users u ON u.id=r.user_id
     WHERE r.store_id=? ${orderBy(
       req,
       { name: "u.name", email: "u.email", rating: "r.rating" },
       "name",
     )}`,
    [store.id],
  );
  res.json({ store, raters });
};
