import { eventsService } from "@/services/events.service";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { addEventSchema } from "./addEvents.dto";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await requireRole([UserRole.EVENT_ORGANIZER]);

    const body = await req.json();

    const validationResult = addEventSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    const newEvent = await eventsService.create(validated, session.user.id);

    return ApiResponse.success(newEvent, serverMessages.events.create.success, httpStatusCodes.CREATED_SUCCESSFULLY);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}