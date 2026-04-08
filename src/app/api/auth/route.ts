import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { apiHandler, ApiError } from "@/lib/api-handler";

const ADMIN_PIN = process.env.ADMIN_PIN!;

export const POST = apiHandler(async (req: NextRequest) => {
  const { pin } = await req.json();

  if (!pin || typeof pin !== "string") {
    throw new ApiError(400, "נדרש קוד PIN");
  }

  if (pin !== ADMIN_PIN) {
    throw new ApiError(401, "קוד PIN שגוי");
  }

  const token = signToken();
  return NextResponse.json({ token });
});
