import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponseDto } from 'src/common/dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already an ApiResponseDto, return as is
        if (data instanceof ApiResponseDto) {
          return data;
        }

        // Otherwise, wrap in success response
        return ApiResponseDto.success(data, 'Success');
      }),
    );
  }
}
