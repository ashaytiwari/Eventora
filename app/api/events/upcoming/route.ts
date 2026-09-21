import { NextRequest } from "next/server";

import { eventsService } from "@/services/events.service";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { getUpcomingEventsSearchParamsSchema } from "./upcomingEvents.dto";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    await requireRole([UserRole.EVENT_ATTENDEE, UserRole.EVENT_ORGANIZER, UserRole.SUPER_ADMIN]);

    const searchParams = req.nextUrl.searchParams;

    const searchText = searchParams.get('searchText');
    const status = searchParams.get('status') || undefined;
    const page = searchParams.get('page') || undefined;
    const limit = searchParams.get('limit') || undefined;

    const validationResult = getUpcomingEventsSearchParamsSchema.safeParse({
      searchText,
      status,
      page,
      limit,
    });

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    const eventsResults = await eventsService.getUpcomingEvents(validated);

    return ApiResponse.success(eventsResults, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}
