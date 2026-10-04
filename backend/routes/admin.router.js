const router = require("express").Router();
const { auth } = require("../Middleware/auth");
const c = require("../Controllers/admin.Controller");

router.use(auth("admin")); // neeche ke saare routes sirf admin ke liye

router.get("/stats", c.getStatus);
router.get("/owners", c.listOwners);

router.get("/users", c.listUsers);
router.get("/users/:id", c.getUser);
router.post("/users", c.createUser);

router.get("/stores", c.listStores);
router.post("/stores", c.createStore);

module.exports = router;