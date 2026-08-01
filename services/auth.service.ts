import { RegisterDto } from "@/app/api/users/register/register.dto";

import { userRepository } from "@/repositories/UserRepository";

import { APP_CONFIG } from "@/config";

import {
  AuthProvider,
  errorCodes,
  httpStatusCodes,
  serverMessages,
  UserRole,
  UserStatus,
  VerificationTokenPurpose
} from "@/lib/constants";
import { APIError, comparePassword, hashPassword } from "@/lib/utils";
import { sendEmail } from "@/lib/utils/email";

import { resetPasswordTemplate } from "@/templates/resetPasswordTemplate";

import { verificationTokenService } from "./verificationToken.service";

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
      throw new APIError(serverMessages.users.login.invalidCredentials, httpStatusCodes.FORBIDDEN);
    }

    const isPasswordValid = await comparePassword(password, user.password!);

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

  async forgotPassword(email: string) {

    const user = await userRepository.findByEmail(email);

    // don't throw any error, just return, this is for preventing email enumeration attacks
    if (
      !user ||
      user.status !== UserStatus.ACTIVE ||
      user.emailVerified === false
    ) {
      return;
    }

    const token = await verificationTokenService.create(
      user._id,
      VerificationTokenPurpose.PASSWORD_RESET,
      APP_CONFIG.PASSWORD_RESET_TOKEN_EXPIRES_IN
    );

    const resetPasswordURL = `${process.env.AUTH_URL}/auth/reset-password?token=${token}`;

    const htmlContent = resetPasswordTemplate({
      firstName: user.firstname,
      resetPasswordURL: resetPasswordURL
    });

    await sendEmail({
      emailTo: user.email,
      subject: "Reset Your Password",
      html: htmlContent
    });

  }

  async resetPassword(token: string, password: string) {

    const verifiedUser: any = await verificationTokenService.verify(token);

    if (verifiedUser) {
      const hashedPassword = await hashPassword(password);
      await userRepository.update(verifiedUser._id, { password: hashedPassword });
    }

    return true;
  }

}

export const authService = new AuthService();