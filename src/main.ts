if (!process.env.IS_TS_NODE) {
  require('module-alias/register')
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorLogger } from './ErrorLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { 
    cors: true
  });
  app.setGlobalPrefix('api');
  await app.listen(80);
}
bootstrap();
