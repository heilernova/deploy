import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ModelsModule } from './models/models.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ControllersModule } from './controllers/controllers.module';
import { join } from 'node:path';

@Module({
  imports: [
    CommonModule,
    ModelsModule,
    ControllersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../panel/browser'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
