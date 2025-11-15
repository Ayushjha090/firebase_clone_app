import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from 'src/platform/auth/interfaces';
import { PlatformUser } from 'src/platform/shared/entities';
import { PlatformUserPrisma } from 'src/platform/shared/types';

@Injectable()
export class PrismaUserRepositoryService implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<PlatformUser | null> {
    const user = (await this.prisma.platformUser.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })) as PlatformUserPrisma | null;

    return user ? PlatformUser.fromPrisma(user) : null;
  }

  async findByUserName(userName: string): Promise<PlatformUser | null> {
    const user = (await this.prisma.platformUser.findFirst({
      where: {
        userName,
        deletedAt: null,
      },
    })) as PlatformUserPrisma | null;

    return user ? PlatformUser.fromPrisma(user) : null;
  }

  async save(user: PlatformUser): Promise<PlatformUser> {
    const savedUser = (await this.prisma.platformUser.create({
      data: user.toPrismaData(),
      select: {
        id: true,
        name: true,
        userName: true,
        email: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    })) as PlatformUserPrisma;

    return PlatformUser.fromPrisma(savedUser);
  }

  async existsByEmailOrUserName(
    email: string,
    userName: string,
  ): Promise<boolean> {
    const count = await this.prisma.platformUser.count({
      where: {
        OR: [{ email }, { userName }],
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async findMany(criteria: Record<string, unknown>): Promise<PlatformUser[]> {
    const users = (await this.prisma.platformUser.findMany({
      where: {
        ...criteria,
        deletedAt: null,
      },
    })) as PlatformUserPrisma[];

    return users.map((user) => PlatformUser.fromPrisma(user));
  }
}
