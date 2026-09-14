import mongoose, { Types } from "mongoose";

import Event from "@/models/event.model";

import { UserRole } from "@/lib/constants";

import { GetEventsSearchParamsDto } from "@/app/api/events/events.dto";

export class EventsRepository {

  async create(data: any) {
    return Event.create(data);
  }

  async findAll(data: GetEventsSearchParamsDto, userId: Types.ObjectId, role: string) {

    const { searchText, status, page, limit } = data;

    const skip = (page - 1) * limit;

    const match: Record<string, any> = {};

    if (role === UserRole.EVENT_ORGANIZER) {
      match.organizerId = new Types.ObjectId(userId);
    }

    if (status && status !== 'ALL') {
      match.status = status;
    }

    if (searchText) {
      match.title = {
        $regex: searchText,
        $options: 'i'
      }
    }

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: match
      },
      {
        $sort: {
          createdAt: -1,
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
            {
              $project: {
                about: 0,
                language: 0,
                artist: 0,
                ageLimit: 0,
                virtualEventLink: 0
              },
            },
          ],

          totalCount: [
            {
              $count: 'count',
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
                $arrayElemAt: ['$totalCount.count', 0],
              },
              0,
            ],
          },
        },
      },
    ];

    const [result] = await Event.aggregate(pipeline);

    return result;

  }

  async findById(id: string) {

    return Event.findById(id);

  }

  async updateById(id: string, data: any) {

    return Event.findByIdAndUpdate(id, data, { new: true });

  }

}

export const eventsRepository = new EventsRepository();