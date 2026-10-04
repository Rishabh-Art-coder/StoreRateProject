const router = require("express").Router();
const { auth } = require("../Middleware/auth");
const c = require("../Controllers/auth.Controller");

router.post("/signup", c.signup);
router.post("/login", c.login);
router.put("/password", auth(), c.changePassword);

module.exports = router;