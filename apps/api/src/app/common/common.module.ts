import { Global, Module } from '@nestjs/common';
import { DbService } from './db/db.service';
import { Pm2Service } from './pm2/pm2.service';

@Global()
@Module({
  providers: [DbService, Pm2Service],
  exports: [DbService, Pm2Service]
})
export class CommonModule {}
