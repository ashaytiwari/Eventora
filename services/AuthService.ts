import { RegisterDto } from "../app/api/users/register/register.dto";

import { AuthProvider, errorCodes, UserRole, UserStatus } from "../lib/constants";
import { hashPassword } from "../lib/utils/bcrypt";

import { userRepository } from "../repositories/UserRepository";

export class AuthService {

  async register(data: RegisterDto) {

    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error(errorCodes.EMAIL_ALREADY_EXISTS);
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

export const authService = new AuthService();