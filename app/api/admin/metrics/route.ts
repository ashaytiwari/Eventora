import { NextRequest } from "next/server";

import { APIError, ApiResponse, connectDB } from "@/lib/utils";
import { requireRole } from "@/lib/utils/apiMiddlewares";
import { httpStatusCodes, serverMessages, UserRole } from "@/lib/constants";

import { adminService } from "@/services/admin.service";

export async function GET(req: NextRequest) {
  try {

    await connectDB();

    await requireRole([UserRole.SUPER_ADMIN]);

    const metrics = await adminService.getActivityMetrics();

    console.log(metrics)

    return ApiResponse.success(metrics, serverMessages.success, httpStatusCodes.SUCCESS);

  } catch (error: any) {

    if (error instanceof APIError) {
      return ApiResponse.error(error.message, error.statusCode);
    }

    return ApiResponse.error(error);
  }
}