import User from "@/models/user.model";
import mongoose from "mongoose";

export class UserRepository {

  async create(data: any) {
    return User.create(data);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByEmailWithPassword(email: string) {
    return User.findOne({
      email,
    }).select("+password");
  }

  async findById(id: mongoose.Types.ObjectId) {
    return User.findById(id);
  }

  async update(id: mongoose.Types.ObjectId, data: any) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();