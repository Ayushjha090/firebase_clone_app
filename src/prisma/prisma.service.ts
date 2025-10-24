import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

// Type for model names
type ModelName = keyof Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$transaction' | '$on' | '$use'
>;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      (
        this as unknown as {
          $on: (event: string, callback: (e: unknown) => void) => void;
        }
      ).$on('query', (e: unknown) => {
        const event = e as { query: string; params: string; duration: number };
        this.logger.log(`Query: ${event.query}`);
        this.logger.log(`Params: ${event.params}`);
        this.logger.log(`Duration: ${event.duration}ms`);
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  // Transaction helper
  async executeTransaction<T>(
    fn: (prisma: PrismaClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(fn);
  }

  // Soft delete helper with better typing
  async softDelete<T extends ModelName>(
    model: T,
    id: string,
  ): Promise<unknown> {
    const updateData = { deletedAt: new Date() };
    const modelClient = this[model] as unknown as {
      update: (args: {
        where: { id: string };
        data: { deletedAt: Date };
      }) => Promise<unknown>;
    };

    return modelClient.update({
      where: { id },
      data: updateData,
    });
  }

  // Pagination helper with better typing
  async paginate<T>(
    model: string,
    page: number = 1,
    limit: number = 10,
    where?: Record<string, unknown>,
    include?: Record<string, unknown>,
  ): Promise<{
    data: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const modelClient = this[model as ModelName] as unknown as {
      findMany: (args: unknown) => Promise<T[]>;
      count: (args: unknown) => Promise<number>;
    };

    const [data, total] = await Promise.all([
      modelClient.findMany({
        skip,
        take: limit,
        where: { ...where, deletedAt: null },
        include,
      }),
      modelClient.count({
        where: { ...where, deletedAt: null },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
