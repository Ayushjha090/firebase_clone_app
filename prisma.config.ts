import path from 'node:path';
import dotenv from 'dotenv';
import type { PrismaConfig } from 'prisma';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default {
  schema: path.join('prisma'),
} satisfies PrismaConfig;
