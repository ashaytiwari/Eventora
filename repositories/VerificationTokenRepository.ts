import mongoose from "mongoose";

import { VerificationTokenPurpose } from "@/lib/constants";

import VerificationToken from "@/models/verification-token.model";

export class VerificationTokenRepository {

  async create(data: any) {
    return VerificationToken.create(data);
  }

  async findByUserId(userId: string) {
    return VerificationToken.findOne({ userId });
  }

  async findByToken(token: string) {
    return VerificationToken.findOne({ token });
  }

  async deleteByUserIdAndPurpose(
    userId: mongoose.Types.ObjectId,
    purpose: VerificationTokenPurpose
  ) {
    return VerificationToken.deleteMany({
      userId,
      purpose,
    });
  }

  async deleteById(id: mongoose.Types.ObjectId) {
    return VerificationToken.deleteOne({ _id: id });
  }

}

export const verificationTokenRepository = new VerificationTokenRepository();
