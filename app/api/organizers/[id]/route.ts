import { NextRequest } from "next/server";

import { adminService } from "@/services/admin.service";

import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { updateOrganizerSchema } from "./organizers.dto";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    await connectDB();

    const session = await requireRole([UserRole.SUPER_ADMIN, UserRole.EVENT_ORGANIZER]);

    const { id } = await context.params;

    if (session.user.role === UserRole.EVENT_ORGANIZER && session.user.id !== id) {
      return ApiResponse.error("Forbidden", httpStatusCodes.FORBIDDEN);
    }

    const organizerDetails = await adminService.getOrganizerById(id);

    return ApiResponse.success(organizerDetails, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);

  }

}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {

    await connectDB();

    const session = await requireRole([UserRole.SUPER_ADMIN, UserRole.EVENT_ORGANIZER]);

    const { id } = await context.params;

    if (session.user.role === UserRole.EVENT_ORGANIZER && session.user.id !== id) {
      return ApiResponse.error("Forbidden", httpStatusCodes.FORBIDDEN);
    }

    const body = await req.json();

    const validationResult = updateOrganizerSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    // Event organizers cannot change their own account status (only super admin can)
    if (session.user.role === UserRole.EVENT_ORGANIZER) {
      delete validated.status;
    }

    const updatedData = await adminService.updateOrganizer(id, validated);

    return ApiResponse.success(updatedData, "Organizer updated successfully", httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);

  }

}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  return PATCH(req, context);

}
