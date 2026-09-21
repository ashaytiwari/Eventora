import mongoose, { Types } from "mongoose";

import Event from "@/models/event.model";

import { UserRole } from "@/lib/constants";

import { GetEventsSearchParamsDto } from "@/app/api/events/events.dto";
import { GetUpcomingEventsSearchParamsDto } from "@/app/api/events/upcoming/upcomingEvents.dto";
import { EventStatus } from "@/lib/constants/eventStatus";

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

  async findUpcomingEvents(data: GetUpcomingEventsSearchParamsDto) {

    const { searchText, status, page, limit } = data;

    const skip = (page - 1) * limit;

    const match: Record<string, any> = {
      startAt: {
        $gte: new Date(),
      },
    };

    if (status && status !== 'ALL') {
      match.status = status;
    } else {
      match.status = {
        $in: [EventStatus.PUBLISHED, EventStatus.CANCELLED],
      };
    }

    if (searchText && searchText.trim() !== '') {
      match.title = {
        $regex: searchText.trim(),
        $options: 'i',
      };
    }

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: match,
      },
      {
        $sort: {
          startAt: 1,
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
              $lookup: {
                from: 'organizations',
                localField: 'organizerId',
                foreignField: 'userId',
                as: 'organization',
              },
            },
            {
              $unwind: {
                path: '$organization',
                preserveNullAndEmptyArrays: true,
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const pipeline: mongoose.PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'organizations',
          localField: 'organizerId',
          foreignField: 'userId',
          as: 'organization',
        },
      },
      {
        $unwind: {
          path: '$organization',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const [result] = await Event.aggregate(pipeline);

    return result || null;

  }

  async updateById(id: string, data: any) {

    return Event.findByIdAndUpdate(id, data, { new: true });

  }

}

export const eventsRepository = new EventsRepository();