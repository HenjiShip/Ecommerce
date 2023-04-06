const express = require("express");

const { userTest, login } = require("../controllers/user.js");
const { auth, createCookie, authCookie } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authCookie, userTest);
router.post("/", auth, createCookie, login);

module.exports = router;
