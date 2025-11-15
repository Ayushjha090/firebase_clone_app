import { Body, Controller, Post } from '@nestjs/common';

import { BaseController } from 'src/common/controllers';
import { AuthService } from 'src/platform/auth/auth.service';
import { RegisterPlatformUserDto } from 'src/platform/auth/dto';
import { ApiResponseDto } from 'src/common/dto';
import { PlatformUser } from 'src/platform/shared/entities/platform-user.entity';
import { PlatformUserPrismaPublic } from 'src/platform/shared/types/platform-user-prisma.type';

@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  async registerUser(
    @Body() registerUserData: RegisterPlatformUserDto,
  ): Promise<ApiResponseDto<PlatformUserPrismaPublic>> {
    try {
      const user = await this.authService.registerUser(registerUserData);

      return this.handleResponse(user, 'User registered successfully', 201);
    } catch (error) {
      return this.handleError(error) as ApiResponseDto<PlatformUser>;
    }
  }
}
