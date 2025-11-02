// src/platform/auth/dto/register-platform-user.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class RegisterPlatformUserDto {
  @IsNotEmpty({ message: 'name should not be empty' })
  @IsString({ message: 'name must be a string' })
  @MinLength(3, { message: 'name must contain at least 3 characters' })
  @MaxLength(65, { message: 'name can contain at most 65 characters' })
  name: string;

  @IsNotEmpty({ message: 'userName should not be empty' })
  @IsString({ message: 'userName must be a string' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'userName can only contain letters, numbers, and underscores',
  })
  userName: string;

  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;

  @IsNotEmpty({ message: 'password should not be empty' })
  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
  password: string;
}
