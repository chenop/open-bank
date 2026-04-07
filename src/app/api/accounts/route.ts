import { NextRequest, NextResponse } from "next/server";
import { apiHandler, ApiError } from "@/lib/api-handler";
import { verifyAdmin } from "@/lib/auth";
import { Account } from "@/models/Account";

// GET /api/accounts — list all accounts
export const GET = apiHandler(async (req: NextRequest) => {
  verifyAdmin(req);
  const accounts = await Account.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(accounts);
});

// POST /api/accounts — create account
export const POST = apiHandler(async (req: NextRequest) => {
  verifyAdmin(req);
  const { name, avatarColor } = await req.json();

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "שם חשבון נדרש");
  }

  const account = await Account.create({
    name: name.trim(),
    avatarColor: avatarColor || "#3B82F6",
  });

  return NextResponse.json(account, { status: 201 });
});
