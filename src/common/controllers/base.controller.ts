import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { ErrorHandlerUtil } from 'src/common/utils/error-handler.util';

export abstract class BaseController {
  protected handleResponse<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): ApiResponseDto<T> {
    return ApiResponseDto.success(data, message, statusCode);
  }

  protected handleError(error: unknown): ApiResponseDto<unknown> {
    return ErrorHandlerUtil.handleError(error);
  }

  protected async executeService<T>(
    serviceCall: () => Promise<T>,
    successMessage: string = 'Success',
    statusCode: number = 200,
  ): Promise<ApiResponseDto<T | unknown>> {
    try {
      const data = await serviceCall();
      return this.handleResponse(data, successMessage, statusCode);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
