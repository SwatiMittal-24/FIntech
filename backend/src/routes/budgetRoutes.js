const express = require("express");
const router = express.Router();

const {
  setBudget,
  getBudgets,
  getBudgetSummary,
} = require("../controllers/budgetController");

const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, setBudget);
router.get("/", authMiddleware, getBudgets);
router.get("/summary", authMiddleware, getBudgetSummary);

module.exports = router;