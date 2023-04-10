const express = require("express");

const {
  login,
  logout,
  updateCart,
  getUserCart,
  netlifyTest,
} = require("../controllers/user.js");
const { auth, createCookie, authCookie } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", auth, createCookie, login);
router.delete("/", logout);
router.post("/cart", authCookie, updateCart);
router.get("/cart", authCookie, getUserCart);
router.get("/fart", netlifyTest);

module.exports = router;
