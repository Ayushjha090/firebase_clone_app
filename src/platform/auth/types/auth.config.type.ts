export interface AuthConfig {
  password: {
    argon2: {
      memoryCost: number;
      timeCost: number;
      parallelism: number;
      hashLength: number;
      saltLength: number;
    };
    globalSalt?: string;
  };
}
