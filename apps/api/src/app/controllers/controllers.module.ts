import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ProfileController } from './profile/profile.controller';
import { ProjectsController } from './projects/projects.controller';
import { DeployController } from './deploy/deploy.controller';

@Module({
  controllers: [AuthController, ProfileController, ProjectsController, DeployController]
})
export class ControllersModule {}
