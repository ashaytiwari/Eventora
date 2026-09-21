import { Types } from "mongoose";

import { EventRegisterDto } from "@/app/api/events/register/eventRegister.dto";
import { GetMyEventsSearchParamsDto } from "@/app/api/events/my-events/myEvents.dto";

import { errorCodes, httpStatusCodes } from "@/lib/constants";
import { EventStatus } from "@/lib/constants/eventStatus";
import { APIError } from "@/lib/utils";

import { eventRegistrationRepository } from "@/repositories/EventRegistrationRepository";
import { eventsRepository } from "@/repositories/EventsRepository";

class EventRegistrationService {

  async register(userId: Types.ObjectId, data: EventRegisterDto) {

    const event = await eventsRepository.findById(data.eventId);

    if (!event) {
      throw new APIError(errorCodes.EVENT_NOT_FOUND, httpStatusCodes.NOT_FOUND);
    }

    if (event.endAt <= new Date()) {
      throw new APIError(errorCodes.EVENT_REGISTRATION_CLOSED, httpStatusCodes.BAD_REQUEST);
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new APIError(errorCodes.BAD_REQUEST, httpStatusCodes.BAD_REQUEST);
    }

    const alreadyRegistered = await eventRegistrationRepository.findByEventIdAndUserId(new Types.ObjectId(data.eventId), new Types.ObjectId(userId));

    if (alreadyRegistered) {
      throw new APIError(errorCodes.EVENT_ALREADY_REGISTERED, httpStatusCodes.BAD_REQUEST);
    }

    const registration = await eventRegistrationRepository.create({
      eventId: new Types.ObjectId(data.eventId),
      userId: new Types.ObjectId(userId),
      attendeeDetails: data.attendees,
    });

    return registration;

  }

  async isRegistered(userId: Types.ObjectId, eventId: string): Promise<boolean> {

    if (!Types.ObjectId.isValid(eventId)) {
      return false;
    }

    const registration = await eventRegistrationRepository.findByEventIdAndUserId(
      new Types.ObjectId(eventId),
      new Types.ObjectId(userId)
    );

    return Boolean(registration);

  }

  async getMyEvents(userId: Types.ObjectId, data: GetMyEventsSearchParamsDto) {

    const results = await eventRegistrationRepository.findUserRegisteredEvents(
      userId,
      data
    );

    const total = results?.total ?? 0;

    return {
      registrations: results?.data ?? [],
      pagination: {
        page: data.page,
        limit: data.limit,
        total,
        totalPages: Math.ceil(total / data.limit),
        hasNextPage: data.page < Math.ceil(total / data.limit),
        hasPreviousPage: data.page > 1,
      },
    };

  }

}

export const eventRegistrationService = new EventRegistrationService();