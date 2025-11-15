export class ApiResponseDto<T = unknown> {
  statusCode: number;
  error: boolean;
  data: T;
  message: string;

  constructor(statusCode: number, error: boolean, data: T, message: string) {
    this.statusCode = statusCode;
    this.error = error;
    this.data = data;
    this.message = message;
  }

  static success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(statusCode, false, data, message);
  }

  static error<T>(
    data: T,
    message: string,
    statusCode: number,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(statusCode, true, data, message);
  }
}
