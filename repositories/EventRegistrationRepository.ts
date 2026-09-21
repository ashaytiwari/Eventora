import mongoose, { Types } from "mongoose";

import EventRegistrations from "@/models/eventRegistrations.model";
import { GetMyEventsSearchParamsDto } from "@/app/api/events/my-events/myEvents.dto";

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

  async findUserRegisteredEvents(
    userId: Types.ObjectId,
    data: GetMyEventsSearchParamsDto
  ) {

    const { searchText, status, page, limit } = data;
    const skip = (page - 1) * limit;

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $lookup: {
          from: "organizations",
          localField: "event.organizerId",
          foreignField: "userId",
          as: "event.organization",
        },
      },
      {
        $unwind: {
          path: "$event.organization",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (searchText && searchText.trim() !== "") {
      pipeline.push({
        $match: {
          "event.title": {
            $regex: searchText.trim(),
            $options: "i",
          },
        },
      });
    }

    if (status && status !== "ALL") {
      pipeline.push({
        $match: {
          "event.status": status,
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          "event.startAt": 1,
          registeredAt: -1,
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          data: 1,
          total: {
            $ifNull: [
              {
                $arrayElemAt: ["$totalCount.count", 0],
              },
              0,
            ],
          },
        },
      }
    );

    const [result] = await EventRegistrations.aggregate(pipeline);

    return result;

  }

}

export const eventRegistrationRepository = new EventRegistrationRepository();