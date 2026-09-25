import { NextRequest } from "next/server";
import { Types } from "mongoose";

import { eventRegistrationService } from "@/services/eventRegistration.service";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { getEventRegistrationsSearchParamsSchema } from "./eventRegistrations.dto";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await requireRole([
      UserRole.EVENT_ORGANIZER,
      UserRole.SUPER_ADMIN,
    ]);

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return ApiResponse.error("Invalid event ID", httpStatusCodes.BAD_REQUEST);
    }

    const searchParams = req.nextUrl.searchParams;

    const searchText = searchParams.get("searchText");
    const page = searchParams.get("page") || undefined;
    const limit = searchParams.get("limit") || undefined;

    const validationResult = getEventRegistrationsSearchParamsSchema.safeParse({
      searchText,
      page,
      limit,
    });

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    const result = await eventRegistrationService.getEventRegistrations(
      id,
      validated,
      session.user.id,
      session.user.role
    );

    return ApiResponse.success(result, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}
