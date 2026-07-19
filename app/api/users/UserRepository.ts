import User from "@/models/user.model";

export class UserRepository {

  async create(data: any) {
    return User.create(data);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async update(id: string, data: any) {
    return User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return User.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();