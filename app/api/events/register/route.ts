import { NextRequest } from "next/server";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { eventRegisterSchema } from "./eventRegister.dto";
import { eventRegistrationService } from "@/services/eventRegistration.service";

export async function POST(req: NextRequest) {
  try {

    await connectDB();

    const session = await requireRole([UserRole.EVENT_ATTENDEE]);

    const body = await req.json();

    const validationResult = eventRegisterSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    await eventRegistrationService.register(session.user.id, validated);

    return ApiResponse.success(null, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);

  }
}