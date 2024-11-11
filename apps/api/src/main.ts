import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { initDatabase } from './config';

async function bootstrap() {

  if (existsSync(".env")) process.loadEnvFile(".env");

  try{
    await initDatabase()
  } catch(error){
    Logger.error(`[APP] No se cargar la base de datos: ${ error.message }`);
    process.exit(1);
  }

  const port = process.env.PORT ?? "3000";
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port);
  Logger.log(`[APP] Running on port ${port}`)
}
bootstrap();
