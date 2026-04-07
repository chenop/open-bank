import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ApiError } from "@/lib/api-handler";
import { verifyAdmin } from "@/lib/auth";
import { Account } from "@/models/Account";
import mongoose from "mongoose";

type Context = { params: Promise<{ id: string }> };

function validateId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "מזהה חשבון לא תקף");
  }
}

async function findAccount(id: string) {
  const account = await Account.findById(id);
  if (!account) throw new ApiError(404, "חשבון לא נמצא");
  return account;
}

// GET /api/accounts/[id]
export const GET = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;
  validateId(id);
  const account = await findAccount(id);
  return NextResponse.json(account);
});

// PUT /api/accounts/[id]
export const PUT = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;
  validateId(id);

  const body = await req.json();
  const update: Record<string, unknown> = {};

  if (body.name !== undefined) update.name = body.name;
  if (body.avatarColor !== undefined) update.avatarColor = body.avatarColor;
  if (body.permissions !== undefined) update.permissions = body.permissions;

  const account = await Account.findByIdAndUpdate(id, update, { new: true });
  if (!account) throw new ApiError(404, "חשבון לא נמצא");

  return NextResponse.json(account);
});

// DELETE /api/accounts/[id]
export const DELETE = apiHandler(async (req: NextRequest, context: Context) => {
  verifyAdmin(req);
  const { id } = await context.params;
  validateId(id);

  const account = await Account.findByIdAndDelete(id);
  if (!account) throw new ApiError(404, "חשבון לא נמצא");

  return NextResponse.json({ message: "חשבון נמחק" });
});
