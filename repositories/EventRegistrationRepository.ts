import { Types } from "mongoose";

import EventRegistrations from "@/models/eventRegistrations.model";

class EventRegistrationRepository {

  async create(data: any) {
    return EventRegistrations.create(data);
  }

  async findByEventId(eventId: Types.ObjectId) {
    return EventRegistrations.find({ eventId });
  }

  async findByUserId(userId: Types.ObjectId) {
    return EventRegistrations.find({ userId });
  }

  async findByEventIdAndUserId(eventId: Types.ObjectId, userId: Types.ObjectId) {
    return EventRegistrations.findOne({ eventId, userId });
  }

}

export const eventRegistrationRepository = new EventRegistrationRepository();