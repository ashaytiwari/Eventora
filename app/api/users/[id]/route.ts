import { NextRequest } from "next/server";
import { Types } from "mongoose";

import { APIError, ApiResponse, connectDB } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";
import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";

import { userService } from "@/services/user.service";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    await connectDB();

    await requireRole([UserRole.EVENT_ORGANIZER, UserRole.SUPER_ADMIN, UserRole.EVENT_ATTENDEE]);

    const { id } = await context.params;

    const userProfile = await userService.getProfile(new Types.ObjectId(id));

    return ApiResponse.success(userProfile, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);

  }
}