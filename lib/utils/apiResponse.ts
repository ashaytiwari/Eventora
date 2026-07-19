import { NextResponse } from 'next/server';

import { httpStatusCodes } from '../constants';

export class ApiResponse {

  static success<T>(
    data?: T,
    message = 'Success',
    status = httpStatusCodes.SUCCESS
  ) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static error(
    message = 'Something went wrong.',
    status = httpStatusCodes.INTERNAL_SERVER_ERROR
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }

  static validation(
    errors: Record<string, string>,
    message = 'Validation failed.'
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      {
        status: httpStatusCodes.BAD_REQUEST,
      }
    );
  }

  static badRequest(
    errors: Record<string, string>,
    message = 'Bad Request.'
  ) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      {
        status: httpStatusCodes.BAD_REQUEST,
      }
    );
  }
}