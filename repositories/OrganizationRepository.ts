import Organization from "@/models/organization.model";

export class OrganizationRepository {

  async create(data: any) {
    return Organization.create(data);
  }

}

export const organizationRepository = new OrganizationRepository();