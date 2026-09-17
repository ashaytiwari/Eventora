import { NextRequest } from "next/server";

import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";
import { APIError, ApiResponse, connectDB, formatZodErrors } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";

import { userService } from "@/services/user.service";

import { getUsersSearchParamsSchema } from "./users.dto";

export async function GET(req: NextRequest) {

  try {

    await connectDB();

    await requireRole([UserRole.SUPER_ADMIN]);

    const searchParams = req.nextUrl.searchParams;

    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const searchText = searchParams.get('searchText');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');

    const validationResult = getUsersSearchParamsSchema.safeParse({ role, status, searchText, page, limit });

    if (!validationResult.success) {
      return ApiResponse.validation(formatZodErrors(validationResult as any));
    }

    const validated = validationResult.data;

    const users = await userService.getAll(validated);

    return ApiResponse.success(users, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);

  }
}