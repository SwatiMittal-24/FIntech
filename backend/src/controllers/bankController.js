const prisma = require("../config/prisma");

// 1️⃣ Add Bank Account
exports.createBankAccount = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Account name required" });
    }

    const account = await prisma.bankAccount.create({
      data: {
        name,
        userId: req.user.userId,
      },
    });

    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

// 2️⃣ Add Transaction
exports.addTransaction = async (req, res, next) => {
  try {
    const { accountId, type, amount } = req.body;

    if (!accountId || !type || !amount) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    // ✅ TYPE VALIDATION HERE
    if (!["CREDIT", "DEBIT"].includes(type)) {
      return res.status(400).json({
        message: "Type must be CREDIT or DEBIT",
      });
    }

    const account = await prisma.bankAccount.findFirst({
      where: {
        id: accountId,
        userId: req.user.userId,
      },
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    let newBalance;

    if (type === "CREDIT") {
      newBalance = account.balance + amount;
    } else {
      if (account.balance < amount) {
        return res.status(400).json({
          message: "Insufficient balance",
        });
      }
      newBalance = account.balance - amount;
    }

    await prisma.transaction.create({
      data: {
        type,
        amount,
        bankAccountId: accountId,
      },
    });

    await prisma.bankAccount.update({
      where: { id: accountId },
      data: { balance: newBalance },
    });

    res.json({
      message: "Transaction added",
      balance: newBalance,
    });

  } catch (error) {
    next(error);
  }
};

// 3️⃣ Get Accounts
exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await prisma.bankAccount.findMany({
      where: { userId: req.user.userId },
      include: { transactions: true },
    });

    res.json(accounts);
  } catch (error) {
    next(error);
  }
};