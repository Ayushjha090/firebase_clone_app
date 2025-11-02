import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  password: {
    argon2: {
      memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || '65536', 10),
      timeCost: parseInt(process.env.ARGON2_TIME_COST || '3', 10),
      parallelism: parseInt(process.env.ARGON2_PARALLELISM || '1', 10),
      hashLength: parseInt(process.env.ARGON2_HASH_LENGTH || '32', 10),
      saltLength: parseInt(process.env.ARGON2_SALT_LENGTH || '32', 10),
    },
    globalSalt: process.env.GLOBAL_SALT,
  },
}));
