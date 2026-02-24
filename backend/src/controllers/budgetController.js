const prisma = require("../config/prisma");

// 1️⃣ Create or Update Budget
exports.setBudget = async (req, res, next) => {
  try {
    const { category, limit, month } = req.body;

    // Basic Validation
    if (!category || !limit || !month) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (limit <= 0) {
      return res.status(400).json({ message: "Limit must be greater than 0" });
    }

    // Check if budget already exists for that month + category
    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: req.user.userId,
        category,
        month,
      },
    });

    let budget;

    if (existingBudget) {
      // Update existing
      budget = await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { limit },
      });
    } else {
      // Create new
      budget = await prisma.budget.create({
        data: {
          category,
          limit,
          month,
          userId: req.user.userId,
        },
      });
    }

    res.status(201).json({
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    next(error);
  }
};

// 2️⃣ Get All Budgets
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user.userId,
      },
    });

    res.json(budgets);
  } catch (error) {
    next(error);
  }
};

// 3️⃣ Budget Summary
exports.getBudgetSummary = async (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    const budgets = await prisma.budget.findMany({
      where: {
        userId: req.user.userId,
        month,
      },
    });

    const summary = [];

    for (let budget of budgets) {
      const totalSpent = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          userId: req.user.userId,
          category: budget.category,
        },
      });

      const spent = totalSpent._sum.amount || 0;
      const remaining = budget.limit - spent;

      summary.push({
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining,
        status: spent > budget.limit ? "OVER" : "WITHIN",
      });
    }

    res.json(summary);
  } catch (error) {
    next(error);
  }
};