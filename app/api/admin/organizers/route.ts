import { adminService } from "@/services/admin.service";

import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { requireRole } from "@/lib/utils/apiMiddlewares";
import { sendEmail } from "@/lib/utils/email";

import { organizerOnboardingTemplate } from "@/templates/organizerOnboardingTemplate";

import { addOrganizersSchema } from "./organizers.dto";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await requireRole([UserRole.SUPER_ADMIN]);

    const body = await req.json();

    const validationResult = addOrganizersSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    const organizerDetails = await adminService.addOrganizers(validated, session.user.id);

    const appURL = `${process.env.AUTH_URL}/auth/signin`;

    const htmlContent = organizerOnboardingTemplate({
      firstName: organizerDetails.firstname,
      lastName: organizerDetails.lastname,
      email: organizerDetails.email,
      organizationName: organizerDetails.organization,
      temporaryPassword: organizerDetails.password,
      appURL: appURL
    });

    await sendEmail({
      emailTo: organizerDetails.email,
      subject: "Welcome to Eventora",
      html: htmlContent
    });

    return ApiResponse.success(undefined, serverMessages.admin.organizers.create.success, httpStatusCodes.CREATED_SUCCESSFULLY);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}