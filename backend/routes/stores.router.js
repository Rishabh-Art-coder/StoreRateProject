const router = require("express").Router();
const { auth } = require("../Middleware/auth");
const c = require("../Controllers/stores.Controller");

router.use(auth("user")); // neeche ke saare routes sirf normal user ke liye

router.get("/", c.listStores);
router.post("/:id/rating", c.rateStore);

module.exports = router;