import {
  APIError,
  ApiResponse,
  connectDB,
  formatZodErrors
} from "@/lib/utils";
import { httpStatusCodes, serverMessages } from "@/lib/constants";

import { registerSchema } from "./register.dto";
import { registerService } from "./service";

export async function POST(req: Request) {
  try {
    connectDB();

    const body = await req.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    await registerService.register(validated);

    return ApiResponse.success(undefined, serverMessages.users.register.success, httpStatusCodes.CREATED_SUCCESSFULLY)

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}