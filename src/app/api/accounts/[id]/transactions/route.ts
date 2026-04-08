import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ApiError } from "@/lib/api-handler";
import { verifyAdmin } from "@/lib/auth";
import { Account } from "@/models/Account";
import { Transaction } from "@/models/Transaction";
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

// GET /api/accounts/[id]/transactions
export const GET = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;
  validateId(id);
  await findAccount(id);

  const objectId = new mongoose.Types.ObjectId(id);
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit")) || 50, 100);
  const offset = Number(new URL(req.url).searchParams.get("offset")) || 0;

  const [balance, transactions] = await Promise.all([
    getBalance(objectId),
    Transaction.find({ account: objectId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean(),
  ]);

  return NextResponse.json({ balance, transactions });
});

// POST /api/accounts/[id]/transactions
export const POST = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;
  validateId(id);
  await findAccount(id);

  const body = await req.json();
  const { type, amount, description } = body;

  if (type !== "deposit" && type !== "withdraw") {
    throw new ApiError(400, "סוג תנועה לא תקף");
  }

  if (typeof amount !== "number" || amount <= 0) {
    throw new ApiError(400, "סכום חייב להיות מספר חיובי");
  }

  const objectId = new mongoose.Types.ObjectId(id);
  const signedAmount = type === "deposit" ? amount : -amount;

  if (type === "withdraw") {
    const balance = await getBalance(objectId);
    if (balance < amount) {
      throw new ApiError(400, "אין מספיק יתרה");
    }
  }

  const transaction = await Transaction.create({
    account: objectId,
    type,
    amount: signedAmount,
    description: description || undefined,
  });

  return NextResponse.json(transaction, { status: 201 });
});
