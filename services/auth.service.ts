import bcrypt from "bcryptjs";

import { RegisterDto } from "@/app/api/users/register/register.dto";

import { userRepository } from "@/repositories/UserRepository";

import {
  AuthProvider,
  errorCodes,
  httpStatusCodes,
  serverMessages,
  UserRole,
  UserStatus
} from "@/lib/constants";
import { APIError, hashPassword } from "@/lib/utils";

class AuthService {

  async register(data: RegisterDto) {

    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new APIError(errorCodes.EMAIL_ALREADY_EXISTS, httpStatusCodes.DUPLICATE_ENTRY);
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await userRepository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
      role: UserRole.EVENT_ATTENDEE,
      providers: [AuthProvider.CREDENTIALS],
      status: UserStatus.ACTIVE,
      emailVerified: false,
    });

    return newUser;
  }

  async login(email: string, password: string) {

    const user = await userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new APIError(serverMessages.users.login.invalidCredentials, httpStatusCodes.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      throw new APIError(serverMessages.users.login.invalidCredentials, httpStatusCodes.UNAUTHORIZED);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new APIError(serverMessages.users.login.accountInactive, httpStatusCodes.FORBIDDEN);
    }

    if (user.emailVerified === false) {
      throw new APIError(serverMessages.users.login.emailNotVerified, httpStatusCodes.FORBIDDEN);
    }

    return user;

  }

}

export const authService = new AuthService();