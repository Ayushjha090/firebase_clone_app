import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import { PasswordHasher } from 'src/platform/auth/interfaces';
import { AuthConfigService } from 'src/platform/auth/config';
import { SaltManagerService } from 'src/platform/auth/services';

@Injectable()
export class PasswordHasherService implements PasswordHasher {
  constructor(
    private readonly authConfigService: AuthConfigService,
    private readonly saltManager: SaltManagerService,
  ) {}

  async hash(password: string): Promise<string> {
    try {
      const argon2Options = this.authConfigService.getArgon2Options();
      const salt = this.saltManager.generateSaltWithGlobalSalt();

      return await argon2.hash(password, {
        type: argon2.argon2id,
        ...argon2Options,
        salt: salt,
      });
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  async verify(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, password);
    } catch (error) {
      throw new Error(`Password verification failed: ${error.message}`);
    }
  }

  async hashWithSpecificSalt(password: string, salt: Buffer): Promise<string> {
    try {
      const argon2Options = this.authConfigService.getArgon2Options();

      return await argon2.hash(password, {
        type: argon2.argon2id,
        ...argon2Options,
        salt: salt,
      });
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }
}
