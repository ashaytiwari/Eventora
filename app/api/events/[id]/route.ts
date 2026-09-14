import { NextRequest } from "next/server";

import { eventsService } from "@/services/events.service";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { addEventSchema } from "../events.dto";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  try {
    await connectDB();

    const { id } = await context.params;

    const event = await eventsService.getById(id);

    if (!event) {
      return ApiResponse.error("Event not found", httpStatusCodes.NOT_FOUND);
    }

    return ApiResponse.success(event, serverMessages.success, httpStatusCodes.SUCCESS);

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

  try {
    await connectDB();

    const session = await requireRole([UserRole.EVENT_ORGANIZER, UserRole.SUPER_ADMIN]);

    const { id } = await context.params;

    const existingEvent = await eventsService.getById(id);

    if (!existingEvent) {
      return ApiResponse.error("Event not found", httpStatusCodes.NOT_FOUND);
    }

    if (
      session.user.role === UserRole.EVENT_ORGANIZER &&
      existingEvent.organizerId.toString() !== session.user.id
    ) {
      return ApiResponse.error("Unauthorized to edit this event", httpStatusCodes.FORBIDDEN);
    }

    const body = await req.json();

    const validationResult = addEventSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const updatedEvent = await eventsService.update(id, validationResult.data);

    return ApiResponse.success(updatedEvent, "Event updated successfully", httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);

  }

}
