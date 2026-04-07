import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { apiHandler, ApiError } from "@/lib/api-handler";
import { verifyAdmin } from "@/lib/auth";
import { Account } from "@/models/Account";
import mongoose from "mongoose";

type Context = { params: Promise<{ id: string }> };

// POST /api/accounts/[id]/share — generate share token
export const POST = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "מזהה חשבון לא תקף");
  }

  const token = crypto.randomBytes(16).toString("hex");

  const account = await Account.findByIdAndUpdate(
    id,
    { shareToken: token },
    { new: true }
  );

  if (!account) throw new ApiError(404, "חשבון לא נמצא");

  return NextResponse.json({ shareToken: token });
});
