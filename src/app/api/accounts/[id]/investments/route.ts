import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ApiError } from "@/lib/api-handler";
import { verifyAdmin } from "@/lib/auth";
import { Account } from "@/models/Account";
import { Investment } from "@/models/Investment";
import { Transaction } from "@/models/Transaction";
import { calculateCurrentValue } from "@/lib/interest";
import mongoose from "mongoose";

type Context = { params: Promise<{ id: string }> };

const validateId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "מזהה חשבון לא תקף");
  }
};

const findAccount = async (id: string) => {
  const account = await Account.findById(id);
  if (!account) throw new ApiError(404, "חשבון לא נמצא");
  return account;
};

const getBalance = async (accountId: mongoose.Types.ObjectId) => {
  const result = await Transaction.aggregate([
    { $match: { account: accountId } },
    { $group: { _id: null, balance: { $sum: "$amount" } } },
  ]);
  return result[0]?.balance ?? 0;
};

// GET /api/accounts/[id]/investments
export const GET = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;
  validateId(id);
  await findAccount(id);

  const objectId = new mongoose.Types.ObjectId(id);
  const investments = await Investment.find({ account: objectId })
    .sort({ createdAt: -1 })
    .lean();

  const enriched = investments.map((inv) => ({
    ...inv,
    currentValue: inv.redeemedAt
      ? inv.redeemedAmount!
      : calculateCurrentValue(inv.principalAmount, inv.annualRate, inv.startDate),
  }));

  return NextResponse.json({ investments: enriched });
});

// POST /api/accounts/[id]/investments
export const POST = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;
  validateId(id);
  await findAccount(id);

  const body = await req.json();
  const { principalAmount, annualRate = 0.05 } = body;

  if (typeof principalAmount !== "number" || principalAmount <= 0) {
    throw new ApiError(400, "סכום חייב להיות מספר חיובי");
  }

  if (typeof annualRate !== "number" || annualRate <= 0 || annualRate >= 1) {
    throw new ApiError(400, "ריבית חייבת להיות בין 0 ל-1");
  }

  const objectId = new mongoose.Types.ObjectId(id);
  const balance = await getBalance(objectId);

  if (balance < principalAmount) {
    throw new ApiError(400, "אין מספיק יתרה");
  }

  const investment = await Investment.create({
    account: objectId,
    principalAmount,
    annualRate,
    startDate: new Date(),
  });

  await Transaction.create({
    account: objectId,
    type: "invest",
    amount: -principalAmount,
    description: `השקעה בריבית ${(annualRate * 100).toFixed(0)}%`,
    relatedInvestment: investment._id,
  });

  return NextResponse.json(investment, { status: 201 });
});
