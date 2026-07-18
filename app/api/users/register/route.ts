import { NextResponse } from "next/server";

import { errorCodes, httpStatusCodes, serverMessages } from "@/lib/constants";
import { connectDB } from "@/lib/utils/db";
import { zodValidationParser } from "@/lib/utils/common";

import { authService } from "@/services/AuthService";

import { registerSchema } from "./register.dto";

export async function POST(req: Request) {
  try {
    connectDB();

    const body = await req.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: serverMessages.validationError,
          issues: zodValidationParser(validationResult)
        },
        {
          status: httpStatusCodes.BAD_REQUEST,
        }
      );
    }

    const validated = validationResult.data;

    await authService.register(validated);

    return NextResponse.json(
      {
        success: true,
        message: serverMessages.users.register.success,
      },
      {
        status: httpStatusCodes.CREATED_SUCCESSFULLY,
      }
    );

  } catch (error: any) {

    if (error.message === errorCodes.EMAIL_ALREADY_EXISTS) {

      return NextResponse.json(
        {
          success: false,
          message: serverMessages.users.register.emailAlreadyRegistered
        },
        {
          status: httpStatusCodes.DUPLICATE_ENTRY,
        }
      );

    }

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: httpStatusCodes.BAD_REQUEST,
      }
    );
  }
}