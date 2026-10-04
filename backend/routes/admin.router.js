const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/adminController");

router.use(auth("admin")); // neeche ke saare routes sirf admin ke liye

router.get("/stats", c.getStatus);

router.get("/users", c.listUsers);
router.get("/users/:id", c.getUser);
router.post("/users", c.createUser);

router.get("/stores", c.listStores);
router.post("/stores", c.createStore);

module.exports = router;