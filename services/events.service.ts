import { Types } from "mongoose";

import { AddEventDto } from "@/app/api/events/addEvents.dto";
import { eventsRepository } from "@/repositories/EventsRepository";

class EventsService {

  async create(data: AddEventDto, userId: Types.ObjectId) {

    const newEvent = await eventsRepository.create({
      ...data,
      organizerId: userId,
    });

    return newEvent;

  }

}

export const eventsService = new EventsService();