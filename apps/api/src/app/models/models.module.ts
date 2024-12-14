import { Global, Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';

@Global()
@Module({
  providers: [UsersService, ProjectsService],
  exports: [UsersService]
})
export class ModelsModule {}
