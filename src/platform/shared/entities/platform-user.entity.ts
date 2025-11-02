import {
  PlatformUserPrisma,
  PlatformUserPrismaCreate,
  PlatformUserPrismaPublic,
} from 'src/platform/shared/types/platform-user-prisma.type';

export class PlatformUser {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly userName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date,
  ) {}

  static fromPrisma(prismaUser: PlatformUserPrisma): PlatformUser {
    return new PlatformUser(
      prismaUser.id,
      prismaUser.name,
      prismaUser.userName,
      prismaUser.email,
      prismaUser.password,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.deletedAt || undefined,
    );
  }

  toPrismaData(): PlatformUserPrismaCreate {
    return {
      id: this.id,
      name: this.name,
      userName: this.userName,
      email: this.email,
      password: this.password,
    };
  }

  // Business logic methods
  isActive(): boolean {
    return !this.deletedAt;
  }

  getPublicData(): PlatformUserPrismaPublic {
    return {
      id: this.id,
      name: this.name,
      userName: this.userName,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
