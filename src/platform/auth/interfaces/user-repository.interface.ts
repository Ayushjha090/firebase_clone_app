import { PlatformUser } from 'src/platform/shared/entities/platform-user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<PlatformUser | null>;
  findByUserName(userName: string): Promise<PlatformUser | null>;
  save(user: PlatformUser): Promise<PlatformUser>;
  existsByEmailOrUserName(email: string, userName: string): Promise<boolean>;
  findMany(criteria: Record<string, unknown>): Promise<PlatformUser[]>;
}
