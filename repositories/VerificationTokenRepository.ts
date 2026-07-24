import VerificationToken from "@/models/verification-token.model";

export class VerificationTokenRepository {

  async create(data: any) {
    return VerificationToken.create(data);
  }

  async findByUserId(userId: string) {
    return VerificationToken.findOne({ userId });
  }

  async removeByUserId(userId: string) {
    return VerificationToken.deleteMany({ userId });
  }

}

export const verificationTokenRepository = new VerificationTokenRepository();
