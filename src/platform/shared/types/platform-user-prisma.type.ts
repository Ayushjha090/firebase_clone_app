export interface PlatformUserPrisma {
  id: string;
  name: string;
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface PlatformUserPrismaCreate {
  id: string;
  name: string;
  userName: string;
  email: string;
  password: string;
}

export interface PlatformUserPrismaPublic {
  id: string;
  name: string;
  userName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
