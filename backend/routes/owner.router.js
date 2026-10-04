const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/ownerController");

router.get("/dashboard", auth("owner"), c.getDashboard);

module.exports = router;