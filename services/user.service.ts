import { Types } from "mongoose";

import { errorCodes, httpStatusCodes } from "@/lib/constants";
import { APIError } from "@/lib/utils";

import { userRepository } from "@/repositories/UserRepository";

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

}

export const userService = new UserService();