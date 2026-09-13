import Event from "@/models/event.model";

export class EventsRepository {

  async create(data: any) {
    return Event.create(data);
  }

}

export const eventsRepository = new EventsRepository();