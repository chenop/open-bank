import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ApiError } from "@/lib/api-handler";
import { verifyAdmin } from "@/lib/auth";
import { Account } from "@/models/Account";
import { Investment } from "@/models/Investment";
import { Transaction } from "@/models/Transaction";
import { calculateCurrentValue } from "@/lib/interest";
import mongoose from "mongoose";

type Context = { params: Promise<{ id: string; investId: string }> };

const validateId = (id: string, label: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `מזהה ${label} לא תקף`);
  }
};

// PUT /api/accounts/[id]/investments/[investId] — redeem
export const PUT = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id, investId } = await context.params;
  validateId(id, "חשבון");
  validateId(investId, "השקעה");

  const account = await Account.findById(id);
  if (!account) throw new ApiError(404, "חשבון לא נמצא");

  const investment = await Investment.findById(investId);
  if (!investment) throw new ApiError(404, "השקעה לא נמצאה");
  if (String(investment.account) !== id) throw new ApiError(400, "השקעה לא שייכת לחשבון");
  if (investment.redeemedAt) throw new ApiError(400, "השקעה כבר נפדתה");

  const redeemedAmount = calculateCurrentValue(
    investment.principalAmount,
    investment.annualRate,
    investment.startDate
  );

  investment.redeemedAt = new Date();
  investment.redeemedAmount = redeemedAmount;
  await investment.save();

  await Transaction.create({
    account: new mongoose.Types.ObjectId(id),
    type: "uninvest",
    amount: redeemedAmount,
    description: `פדיון השקעה`,
    relatedInvestment: investment._id,
  });

  return NextResponse.json({
    ...investment.toObject(),
    currentValue: redeemedAmount,
  });
});
