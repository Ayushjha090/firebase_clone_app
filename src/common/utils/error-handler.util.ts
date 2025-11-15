import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma';

import { ApiResponseDto } from 'src/common/dto/api-response.dto';

export class ErrorHandlerUtil {
  private static readonly logger = new Logger(ErrorHandlerUtil.name);

  static handleError(error: unknown): ApiResponseDto<unknown> {
    if (error instanceof HttpException) {
      // Handle HTTP exceptions (validation errors, custom errors)
      const statusCode = error.getStatus();
      const exceptionResponse = error.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;

        // Handle validation errors
        if (statusCode === HttpStatus.BAD_REQUEST && 'message' in responseObj) {
          const messages = responseObj.message;
          if (Array.isArray(messages)) {
            const validationErrors: Record<string, string[]> = {};
            messages.forEach((msg: string) => {
              const field = this.extractFieldFromMessage(msg);
              if (!validationErrors[field]) {
                validationErrors[field] = [];
              }
              validationErrors[field].push(msg);
            });

            return ApiResponseDto.error(
              validationErrors,
              'Validation Error',
              statusCode,
            );
          } else {
            return ApiResponseDto.error(
              { error: messages },
              'Bad Request',
              statusCode,
            );
          }
        } else {
          return ApiResponseDto.error(
            responseObj,
            (responseObj.message as string) || 'Error',
            statusCode,
          );
        }
      } else {
        return ApiResponseDto.error(
          { error: exceptionResponse },
          'Error',
          statusCode,
        );
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma errors
      const { statusCode, message } = this.getPrismaErrorInfo(error.code);
      this.logger.error(`Prisma Error ${error.code}:`, error);
      return ApiResponseDto.error({ error: message }, message, statusCode);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      this.logger.error('Unknown Prisma Error:', error);
      return ApiResponseDto.error(
        { error: 'Database connection error' },
        'Database Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      this.logger.error('Prisma Validation Error:', error);
      return ApiResponseDto.error(
        { error: 'Invalid data provided' },
        'Validation Error',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Handle unknown errors
    this.logger.error('Unknown Error:', error);
    return ApiResponseDto.error(
      { error: 'An unexpected error occurred' },
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  private static extractFieldFromMessage(message: string): string {
    const match = message.match(/^(\w+)/);
    return match ? match[1] : 'unknown';
  }

  private static getPrismaErrorInfo(code: string): {
    statusCode: number;
    message: string;
  } {
    const errorMap: Record<string, { statusCode: number; message: string }> = {
      P2002: {
        statusCode: HttpStatus.CONFLICT,
        message: 'A record with this information already exists',
      },
      P2025: { statusCode: HttpStatus.NOT_FOUND, message: 'Record not found' },
      P2003: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid reference provided',
      },
      P2014: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Required relation is missing',
      },
    };
    return (
      errorMap[code] || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database operation failed',
      }
    );
  }
}
