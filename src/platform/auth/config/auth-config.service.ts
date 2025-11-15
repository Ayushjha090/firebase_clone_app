import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthConfig } from 'src/platform/auth/types';

@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: ConfigService) {}

  get authConfig(): AuthConfig {
    return this.configService.get<AuthConfig>('auth')!;
  }

  get passwordConfig() {
    return this.authConfig.password;
  }

  get argon2Config() {
    return this.passwordConfig.argon2;
  }

  getGlobalSalt(): string | undefined {
    return this.passwordConfig.globalSalt;
  }

  getArgon2Options() {
    return {
      memoryCost: this.argon2Config.memoryCost,
      timeCost: this.argon2Config.timeCost,
      parallelism: this.argon2Config.parallelism,
      hashLength: this.argon2Config.hashLength,
      saltLength: this.argon2Config.saltLength,
    };
  }
}
