import { authService } from "@/services/auth.service";

import {
  APIError,
  ApiResponse,
  connectDB,
  formatZodErrors
} from "@/lib/utils";
import { httpStatusCodes, serverMessages, VerificationTokenPurpose } from "@/lib/constants";
import { sendEmail } from "@/lib/utils/email";

import { verificationTokenService } from "@/services/verificationToken.service";

import { verifyEmailTemplate } from "@/templates/verifyEmailTemplate";

import { registerSchema } from "./register.dto";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    const newUser = await authService.register(validated);
    const token = await verificationTokenService.create(newUser._id, VerificationTokenPurpose.EMAIL_VERIFICATION);

    const verificationURL = `${process.env.AUTH_URL}/verify-email?token=${token}`;

    const htmlContent = verifyEmailTemplate({
      firstName: newUser.firstname,
      verificationLink: verificationURL
    });

    await sendEmail({
      emailTo: newUser.email,
      subject: "Verify Your Email",
      html: htmlContent
    });

    return ApiResponse.success(undefined, serverMessages.users.register.success, httpStatusCodes.CREATED_SUCCESSFULLY);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}