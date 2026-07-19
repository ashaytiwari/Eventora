import { httpStatusCodes, serverMessages } from "@/lib/constants";

import { APIError } from "@/lib/utils/apiError";
import { ApiResponse } from "@/lib/utils/apiResponse";
import { connectDB } from "@/lib/utils/db";
import { formatZodErrors } from "@/lib/utils/zod";

import { authService } from "@/services/AuthService";

import { registerSchema } from "./register.dto";

export async function POST(req: Request) {
  try {
    connectDB();

    const body = await req.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    await authService.register(validated);

    return ApiResponse.success(undefined, serverMessages.users.register.success, httpStatusCodes.CREATED_SUCCESSFULLY)

  } catch (error: any) {

    console.log(error);
    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}