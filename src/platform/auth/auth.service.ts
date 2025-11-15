import { Inject, Injectable } from '@nestjs/common';

import type {
  UserRepository,
  PasswordHasher,
} from 'src/platform/auth/interfaces';
import { PlatformUser } from 'src/platform/shared/entities';
import { UserAlreadyExistsException } from 'src/platform/shared/exceptions';
import { RegisterPlatformUserDto } from 'src/platform/auth/dto';
import { PASSWORD_HASHER, USER_REPOSITORY } from 'src/platform/auth/tokens';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async registerUser(registerUserData: RegisterPlatformUserDto) {
    const existingUser = await this.userRepository.findByEmail(
      registerUserData.email,
    );
    if (existingUser) {
      throw new UserAlreadyExistsException('email');
    }

    const existingUserName = await this.userRepository.findByUserName(
      registerUserData.userName,
    );
    if (existingUserName) {
      throw new UserAlreadyExistsException('username');
    }

    const hashedPassword = await this.passwordHasher.hash(
      registerUserData.password,
    );

    const user = new PlatformUser(
      crypto.randomUUID(),
      registerUserData.name,
      registerUserData.userName,
      registerUserData.email,
      hashedPassword,
      new Date(),
      new Date(),
    );

    const newUser = await this.userRepository.save(user);

    return newUser.getPublicData();
  }
}
