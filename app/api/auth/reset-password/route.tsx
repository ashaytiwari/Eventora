import z from "zod";

import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { serverMessages } from "@/lib/constants";

import { authService } from "@/services/auth.service";

export async function POST(req: Request) {
  try {

    await connectDB();

    const body = await req.json();

    const validationResult = z
      .object({
        token: z.string(),
        password: z.string().min(8, "Password must be at least 8 characters long"),
      })
      .safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    await authService.resetPassword(validated.token, validated.password);

    return ApiResponse.success(undefined, serverMessages.users.resetPassword.success);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}