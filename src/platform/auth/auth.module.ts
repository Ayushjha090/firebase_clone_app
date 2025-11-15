import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from 'src/platform/auth/auth.controller';
import { AuthService } from 'src/platform/auth/auth.service';
import { authConfig, AuthConfigService } from 'src/platform/auth/config/';
import { SaltManagerService } from 'src/platform/auth/services/salt-manager.service';
import { PasswordHasherService } from 'src/platform/auth/services/password-hasher.service';
import { PrismaUserRepositoryService } from 'src/platform/auth/repositories/prisma-user-repository.service';
import {
  PASSWORD_HASHER,
  USER_REPOSITORY,
} from 'src/platform/auth/tokens/auth.token';

@Module({
  imports: [ConfigModule.forFeature(authConfig), PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthConfigService,
    SaltManagerService,
    {
      provide: PASSWORD_HASHER,
      useClass: PasswordHasherService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepositoryService,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
