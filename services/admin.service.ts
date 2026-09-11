import { Types } from "mongoose";
import { getServerSession } from 'next-auth';

import { AddOrganizersDto } from "@/app/api/admin/organizers/organizers.dto";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

import { AuthProvider, errorCodes, httpStatusCodes, UserRole, UserStatus } from "@/lib/constants";
import { APIError, generateRandomString, hashPassword } from "@/lib/utils";

import { organizationRepository } from "@/repositories/OrganizationRepository";
import { userRepository } from "@/repositories/UserRepository";

class AdminService {

  async addOrganizers(data: AddOrganizersDto) {

    const session = await getServerSession(authOptions);

    if (!session?.user.id || !session.user.email) {
      throw new APIError(errorCodes.UNAUTHORIZED, httpStatusCodes.UNAUTHORIZED);
    }

    const isValidAdmin = await this.isValidAdmin(session.user.id);

    if (!isValidAdmin) {
      throw new APIError(errorCodes.UNAUTHORIZED, httpStatusCodes.UNAUTHORIZED);
    }

    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new APIError(errorCodes.EMAIL_ALREADY_EXISTS, httpStatusCodes.DUPLICATE_ENTRY);
    }

    const randomPassword = generateRandomString();
    const hashedPassword = await hashPassword(randomPassword);

    const newUser = await userRepository.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
      role: UserRole.EVENT_ORGANIZER,
      createdBy: session.user.id,
      providers: [AuthProvider.CREDENTIALS],
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });

    const newOrganization = await organizationRepository.create({
      organizationName: data.organizationName,
      userId: newUser._id as Types.ObjectId,
    });

    return {
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      organization: newOrganization.organizationName,
      password: randomPassword,
    };
  }

  async isValidAdmin(id: Types.ObjectId) {

    const user = await userRepository.findById(id);

    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      false;
    }

    return true;

  }

}

export const adminService = new AdminService();