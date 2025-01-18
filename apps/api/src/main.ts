/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initDb } from './app/config/db-init';
import { AddHeaderMiddleware } from './app/config/add-headers-middleware';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

async function bootstrap() {

  try{
    await initDb()
  } catch(error){
    Logger.error(`[APP] No se cargar la base de datos: ${ error.message }`);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  
  app.use(new AddHeaderMiddleware().use);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const packageJsonPath = join("package.json");
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV == "development"){
    app.enableCors();
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 2025;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix} - Version ${packageJson.version}`
  );
}

bootstrap();
