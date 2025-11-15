import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

import { AuthConfigService } from 'src/platform/auth/config';

@Injectable()
export class SaltManagerService {
  constructor(private readonly authConfigService: AuthConfigService) {}

  generateSalt(): Buffer {
    const saltLength = this.authConfigService.argon2Config.saltLength;

    return crypto.randomBytes(saltLength);
  }

  generateSaltWithGlobalSalt(): Buffer {
    const saltLength = this.authConfigService.argon2Config.saltLength;
    const randomSalt = crypto.randomBytes(saltLength);

    const globalSalt = this.authConfigService.getGlobalSalt();
    if (globalSalt) {
      // Combine global salt with random salt
      const globalSaltBuffer = Buffer.from(globalSalt, 'utf8');

      return Buffer.concat([globalSaltBuffer, randomSalt]);
    }

    return randomSalt;
  }

  generateDeterministicSalt(input: string): Buffer {
    const saltLength = this.authConfigService.argon2Config.saltLength;
    return crypto
      .createHash('sha256')
      .update(input)
      .digest()
      .slice(0, saltLength);
  }
}
