import mongoose from "mongoose";

import { generateToken } from "@/lib/utils";

import { verificationTokenRepository } from "@/repositories/VerificationTokenRepository";

class VerificationTokenService {

  async create(userId: mongoose.Types.ObjectId) {

    const tokenExpiresAt = '1d';
    const token = generateToken({ _id: userId }, "1d");

    await verificationTokenRepository.create({
      userId,
      token,
      expiresAt: tokenExpiresAt
    });

    return token;

  }

}

export const verificationTokenService = new VerificationTokenService();