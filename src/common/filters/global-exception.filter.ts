import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiResponseDto } from 'src/common/dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode: number;
    let message: string;
    let data: unknown;

    // Handle HttpException (includes BadRequestException from ValidationPipe)
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;

        // Handle validation errors (BadRequestException from ValidationPipe)
        if (statusCode === HttpStatus.BAD_REQUEST && 'message' in responseObj) {
          const messages = responseObj.message;
          if (Array.isArray(messages)) {
            // Format validation errors
            const validationErrors: Record<string, string[]> = {};
            messages.forEach((msg: string) => {
              const field = this.extractFieldFromMessage(msg);
              if (!validationErrors[field]) {
                validationErrors[field] = [];
              }
              validationErrors[field].push(msg);
            });

            data = validationErrors;
            message = 'Validation Error';
          } else {
            data = { error: messages };
            message = 'Bad Request';
          }
        } else {
          data = responseObj;
          message = (responseObj.message as string) || 'Error';
        }
      } else {
        data = { error: exceptionResponse };
        message = 'Error';
      }

      // Log HTTP exceptions (including validation errors)
      this.logger.warn(
        `${request.method} ${request.url} - ${statusCode} - ${message}`,
      );
    } else {
      // Handle unknown errors
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      data = { error: 'An unexpected error occurred' };

      // Log unknown errors
      this.logger.error(
        `${request.method} ${request.url} - Unhandled Error`,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
    }

    const apiResponse = ApiResponseDto.error(data, message, statusCode);
    response.status(statusCode).json(apiResponse);
  }

  private extractFieldFromMessage(message: string): string {
    // Extract field name from validation message
    // Example: "name must contain at least 3 characters" -> "name"
    const match = message.match(/^(\w+)/);
    return match ? match[1] : 'unknown';
  }
}
