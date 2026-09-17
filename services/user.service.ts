import { Types } from "mongoose";

import { errorCodes, httpStatusCodes } from "@/lib/constants";
import { APIError } from "@/lib/utils";

import { userRepository } from "@/repositories/UserRepository";
import { GetUsersSearchParamsDto } from "@/app/api/users/users.dto";

class UserService {

  async getProfile(userId: Types.ObjectId) {

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new APIError(errorCodes.USER_NOT_FOUND, httpStatusCodes.NOT_FOUND);
    }

    return {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      mustChangePassword: user.mustChangePassword,
    };
  }

  async getAll(data: GetUsersSearchParamsDto) {

    const usersResult = await userRepository.findAll(data);

    const total = usersResult?.total ?? 0;

    return {
      users: usersResult?.data ?? [],
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

  async updateStatus(userId: Types.ObjectId, status: any) {

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new APIError(errorCodes.USER_NOT_FOUND, httpStatusCodes.NOT_FOUND);
    }

    const updatedUser = await userRepository.update(userId, { status });

    return {
      _id: updatedUser?._id,
      firstname: updatedUser?.firstname,
      lastname: updatedUser?.lastname,
      email: updatedUser?.email,
      role: updatedUser?.role,
      status: updatedUser?.status,
    };

  }

}

export const userService = new UserService();