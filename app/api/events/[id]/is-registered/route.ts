import { NextRequest } from "next/server";
import { Types } from "mongoose";

import { eventRegistrationService } from "@/services/eventRegistration.service";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await requireRole([UserRole.EVENT_ATTENDEE]);

    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return ApiResponse.error("Invalid event ID", httpStatusCodes.BAD_REQUEST);
    }

    const isRegistered = await eventRegistrationService.isRegistered(
      session.user.id,
      id
    );

    return ApiResponse.success({ isRegistered }, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);

  }
}
