import { Module } from '@nestjs/common';
import { AuthModule } from 'src/platform/auth/auth.module';

@Module({
  imports: [AuthModule],
  exports: [AuthModule],
})
export class PlatformModule {}
