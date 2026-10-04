const router = require("express").Router();
const { auth } = require("../middleware/auth");
const c = require("../controllers/authController");

router.post("/signup", c.signup);
router.post("/login", c.login);
router.put("/password", auth(), c.changePassword);

module.exports = router;