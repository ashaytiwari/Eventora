import mongoose from "mongoose";

import { APIError, generateToken, sha256Hash } from "@/lib/utils";
import { errorCodes, httpStatusCodes, VerificationTokenPurpose } from "@/lib/constants";

import { userRepository } from "@/repositories/UserRepository";
import { verificationTokenRepository } from "@/repositories/VerificationTokenRepository";

class VerificationTokenService {

  async create(userId: mongoose.Types.ObjectId, purpose: VerificationTokenPurpose, expiresIn: number) {

    await verificationTokenRepository.deleteByUserIdAndPurpose(userId, purpose);

    const token = generateToken({ _id: userId }, expiresIn);

    const hashedToken = sha256Hash(token);

    await verificationTokenRepository.create({
      userId,
      token: hashedToken,
      expiresAt: new Date(Date.now() + expiresIn),
      purpose
    });

    return token;

  }

  async verify(token: string) {

    const hashedToken = sha256Hash(token);
    const verificationToken = await verificationTokenRepository.findByToken(hashedToken);

    if (!verificationToken) {
      throw new APIError(errorCodes.INVALID_CREDENTIALS, httpStatusCodes.UNAUTHORIZED);
    }

    if (verificationToken.expiresAt.getTime() < Date.now()) {
      await verificationTokenRepository.deleteById(verificationToken._id);
      throw new APIError(errorCodes.TOKEN_EXPIRES, httpStatusCodes.BAD_REQUEST);
    }

    const user = await userRepository.findById(verificationToken.userId);

    if (!user) {
      throw new APIError(errorCodes.INVALID_CREDENTIALS, httpStatusCodes.UNAUTHORIZED);
    }

    if (verificationToken.purpose === VerificationTokenPurpose.EMAIL_VERIFICATION) {

      await verificationTokenRepository.deleteById(verificationToken._id);
      await this.emailVerificationHandler(user, verificationToken._id);

    } else if (verificationToken.purpose === VerificationTokenPurpose.PASSWORD_RESET) {

      await verificationTokenRepository.deleteById(verificationToken._id);
      return user;

    }


    return true;

  }

  async emailVerificationHandler(user: any, verificationTokenId: mongoose.Types.ObjectId) {

    if (user.emailVerified) {
      await verificationTokenRepository.deleteById(verificationTokenId);
      throw new APIError(errorCodes.EMAIL_ALREADY_VERIFIED, httpStatusCodes.BAD_REQUEST);
    }

    await userRepository.update(user._id, { emailVerified: true });

    return true;

  }

}

export const verificationTokenService = new VerificationTokenService();