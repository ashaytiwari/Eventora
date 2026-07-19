import {
  AuthProvider,
  errorCodes,
  httpStatusCodes,
  UserRole,
  UserStatus
} from "@/lib/constants";
import { APIError, hashPassword } from "@/lib/utils";

import { userRepository } from "../UserRepository";
import { RegisterDto } from "./register.dto";

export class RegisterService {

  async register(data: RegisterDto) {

    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new APIError(errorCodes.EMAIL_ALREADY_EXISTS, httpStatusCodes.DUPLICATE_ENTRY);
    }

    const hashedPassword = await hashPassword(data.password);

    await userRepository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
      role: UserRole.EVENT_ATTENDEE,
      providers: [AuthProvider.CREDENTIALS],
      status: UserStatus.ACTIVE,
      emailVerified: false,
    });
  }

}

export const registerService = new RegisterService();