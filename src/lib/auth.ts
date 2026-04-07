import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { ApiError } from "./api-handler";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyAdmin(req: NextRequest): void {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError(401, "לא מורשה");
  }
  try {
    jwt.verify(header.slice(7), JWT_SECRET);
  } catch {
    throw new ApiError(401, "טוקן לא תקף");
  }
}
