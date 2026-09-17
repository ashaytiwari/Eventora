import mongoose, { Types } from "mongoose";

import Organization from "@/models/organization.model";

export class OrganizationRepository {

  async create(data: any) {
    return Organization.create(data);
  }

  async findByUserId(userId: string | Types.ObjectId) {
    const objectId = typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;
    return Organization.findOne({ userId: objectId });
  }

  async updateByUserId(userId: string | Types.ObjectId, data: any) {
    const objectId = typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;
    return Organization.findOneAndUpdate(
      { userId: objectId },
      { $set: data },
      { new: true, upsert: true }
    );
  }

}

export const organizationRepository = new OrganizationRepository();