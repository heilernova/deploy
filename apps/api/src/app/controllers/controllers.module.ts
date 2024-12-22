import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ProfileController } from './profile/profile.controller';

@Module({
  controllers: [AuthController, ProfileController]
})
export class ControllersModule {}
