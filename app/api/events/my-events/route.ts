import { NextRequest } from "next/server";

import { eventRegistrationService } from "@/services/eventRegistration.service";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { getMyEventsSearchParamsSchema } from "./myEvents.dto";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await requireRole([UserRole.EVENT_ATTENDEE]);

    const searchParams = req.nextUrl.searchParams;

    const searchText = searchParams.get('searchText');
    const status = searchParams.get('status') || undefined;
    const page = searchParams.get('page') || undefined;
    const limit = searchParams.get('limit') || undefined;

    const validationResult = getMyEventsSearchParamsSchema.safeParse({
      searchText,
      status,
      page,
      limit,
    });

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    const myEventsResults = await eventRegistrationService.getMyEvents(
      session.user.id,
      validated
    );

    return ApiResponse.success(myEventsResults, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}
