import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - Unhandled Error`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    // Return generic error response for unhandled errors
    const apiResponse = ApiResponseDto.error(
      { error: 'An unexpected error occurred' },
      'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    // Framework-agnostic response
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(apiResponse);
  }
}
