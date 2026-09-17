import mongoose from "mongoose";

import { GetUsersSearchParamsDto } from "@/app/api/users/users.dto";

import User from "@/models/user.model";

import { UserRole } from "@/lib/constants";

export class UserRepository {

  async create(data: any) {
    return User.create(data);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByEmailWithPassword(email: string) {
    return User.findOne({
      email,
    }).select("+password");
  }

  async findByIdWithPassword(id: mongoose.Types.ObjectId) {
    return User.findById(id).select("+password");
  }

  async findById(id: mongoose.Types.ObjectId) {
    return User.findById(id);
  }

  async update(id: mongoose.Types.ObjectId, data: any) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return User.findByIdAndDelete(id);
  }

  async findAll(data: GetUsersSearchParamsDto) {

    const { searchText, status, role, page, limit } = data;

    const skip = (page - 1) * limit;

    const match: Record<string, any> = {
      role: {
        $ne: UserRole.SUPER_ADMIN
      }
    };

    if (role && role !== 'ALL') {
      match.role = role;
    }

    if (status && status !== 'ALL') {
      match.status = status;
    }

    if (searchText) {
      match.fullName = {
        $regex: searchText,
        $options: 'i'
      }
    }

    const pipeline: mongoose.PipelineStage[] = [
      {
        $addFields: {
          fullName: {
            $concat: ["$firstname", " ", "$lastname"]
          }
        }
      },
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
                password: 0,
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

    const [result] = await User.aggregate(pipeline);

    return result;

  }
}

export const userRepository = new UserRepository();