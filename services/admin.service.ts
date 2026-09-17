import { Types } from "mongoose";

import { AddOrganizersDto, UpdateOrganizerDto } from "@/app/api/admin/organizers/organizers.dto";

import { AuthProvider, errorCodes, httpStatusCodes, UserRole, UserStatus } from "@/lib/constants";
import { APIError, generateRandomString, hashPassword } from "@/lib/utils";

import { organizationRepository } from "@/repositories/OrganizationRepository";
import { userRepository } from "@/repositories/UserRepository";

class AdminService {

  async addOrganizers(data: AddOrganizersDto, userId: Types.ObjectId) {

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
      createdBy: userId,
      providers: [AuthProvider.CREDENTIALS],
      status: UserStatus.ACTIVE,
      emailVerified: true,
      mustChangePassword: true
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

  async getOrganizerById(userId: string | Types.ObjectId) {

    const objectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const user = await userRepository.findById(objectId);

    if (!user) {
      throw new APIError(errorCodes.USER_NOT_FOUND, httpStatusCodes.NOT_FOUND);
    }

    const organization = await organizationRepository.findByUserId(objectId);

    return {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      organization: organization
        ? {
            organizationName: organization.organizationName,
            about: organization.about,
            website: organization.website,
            tagLine: organization.tagLine,
            address: organization.address,
          }
        : null,
    };

  }

  async updateOrganizer(userId: string | Types.ObjectId, data: UpdateOrganizerDto) {

    const objectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const user = await userRepository.findById(objectId);

    if (!user) {
      throw new APIError(errorCodes.USER_NOT_FOUND, httpStatusCodes.NOT_FOUND);
    }

    const userUpdatePayload: Record<string, any> = {
      firstname: data.firstname,
      lastname: data.lastname,
    };

    if (data.status) {
      userUpdatePayload.status = data.status;
    }

    const updatedUser = await userRepository.update(objectId, userUpdatePayload);

    const organizationUpdatePayload: Record<string, any> = {
      organizationName: data.organizationName,
    };

    if (data.about !== undefined) {
      organizationUpdatePayload.about = data.about;
    }

    if (data.website !== undefined) {
      organizationUpdatePayload.website = data.website;
    }

    if (data.tagLine !== undefined) {
      organizationUpdatePayload.tagLine = data.tagLine;
    }

    if (data.address !== undefined) {
      organizationUpdatePayload.address = data.address;
    }

    const updatedOrganization = await organizationRepository.updateByUserId(objectId, organizationUpdatePayload);

    return {
      user: updatedUser,
      organization: updatedOrganization,
    };

  }

  async isValidAdmin(id: Types.ObjectId) {

    const user = await userRepository.findById(id);

    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      return false;
    }

    return true;

  }

}

export const adminService = new AdminService();