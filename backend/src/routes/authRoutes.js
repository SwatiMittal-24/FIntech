const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected Test Route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user,
  });
});

module.exports = router;