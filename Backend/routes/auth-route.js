const express = require("express");
const {
  registerUser,
  loginUser,
  authMiddleware,
  checkAuth,
  logoutUser,
} = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authMiddleware, checkAuth);
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;
