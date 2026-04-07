import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { apiHandler, ApiError } from "@/lib/api-handler";

const ADMIN_PIN_HASH = process.env.ADMIN_PIN_HASH!;

export const POST = apiHandler(async (req: NextRequest) => {
  const { pin } = await req.json();

  if (!pin || typeof pin !== "string") {
    throw new ApiError(400, "נדרש קוד PIN");
  }

  const valid = await bcrypt.compare(pin, ADMIN_PIN_HASH);
  if (!valid) {
    throw new ApiError(401, "קוד PIN שגוי");
  }

  const token = signToken();
  return NextResponse.json({ token });
});
