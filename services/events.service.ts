import { Types } from "mongoose";

import { AddEventDto, GetEventsSearchParamsDto } from "@/app/api/events/events.dto";
import { GetUpcomingEventsSearchParamsDto } from "@/app/api/events/upcoming/upcomingEvents.dto";
import { eventsRepository } from "@/repositories/EventsRepository";

class EventsService {

  async create(data: AddEventDto, userId: Types.ObjectId) {

    const newEvent = await eventsRepository.create({
      ...data,
      organizerId: userId,
    });

    return newEvent;

  }

  async getAll(data: GetEventsSearchParamsDto, userId: Types.ObjectId, role: string) {

    const eventResults = await eventsRepository.findAll(data, userId, role);

    const total = eventResults?.total ?? 0;

    return {
      events: eventResults?.data ?? [],
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

  async getUpcomingEvents(data: GetUpcomingEventsSearchParamsDto) {

    const eventResults = await eventsRepository.findUpcomingEvents(data);

    const total = eventResults?.total ?? 0;

    return {
      events: eventResults?.data ?? [],
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

  async getById(id: string) {

    return eventsRepository.findById(id);

  }

  async update(id: string, data: any) {

    return eventsRepository.updateById(id, data);

  }

}

export const eventsService = new EventsService();