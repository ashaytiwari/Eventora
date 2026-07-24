import z from "zod";

import {
  APIError,
  ApiResponse,
  connectDB,
  formatZodErrors
} from "@/lib/utils";
import { serverMessages } from "@/lib/constants";

import { verificationTokenService } from "@/services/verificationToken.service";

export async function POST(req: Request) {
  try {

    await connectDB();

    const body = await req.json();

    const validationResult = z
      .object({
        token: z.string(),
      })
      .safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    await verificationTokenService.verify(validated.token);

    return ApiResponse.success(undefined, serverMessages.users.emailVerification.success);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}