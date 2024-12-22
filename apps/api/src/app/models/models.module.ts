import { Global, Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';
import { TokensService } from './tokens';

@Global()
@Module({
  providers: [UsersService, ProjectsService, TokensService],
  exports: [UsersService, ProjectsService, TokensService]
})
export class ModelsModule {}
