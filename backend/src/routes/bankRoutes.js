const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const {
  createBankAccount,
  addTransaction,
  getAccounts,
} = require("../controllers/bankController");

router.post("/", authMiddleware, createBankAccount);
router.post("/transaction", authMiddleware, addTransaction);
router.get("/", authMiddleware, getAccounts);

module.exports = router;