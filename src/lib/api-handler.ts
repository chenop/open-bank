import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "./db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerFn = (req: NextRequest, context: any) => Promise<NextResponse>;

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export function apiHandler(handler: HandlerFn): HandlerFn {
  return async (req, context) => {
    try {
      await connectDB();
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
