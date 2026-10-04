const router = require("express").Router();
const { auth } = require("../Middleware/auth");
const c = require("../Controllers/owner.Controller");
const admin = require("../Controllers/admin.Controller");

router.get("/dashboard", auth("owner"), c.getDashboard);
router.get("/stores", auth("owner"), admin.listStores);
router.get("/users", auth("owner"), admin.listUsers);

module.exports = router;