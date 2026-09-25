// Routes: /api/auth   (Person 1 - Authentication)
// - POST   /register   -> auth.controller.register
// - POST   /login      -> auth.controller.login
// - POST   /logout     -> auth.controller.logout   (optional)


const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);

module.exports = router;