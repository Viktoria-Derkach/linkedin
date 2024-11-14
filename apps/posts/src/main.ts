/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/exception-filters/http-exception.filters';
import { ResponseInterceptor } from './app/interceptors/response.interceptor';

async function bootstrap() {
  // Create the HTTP application
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  const loggerInstance = app.get(Logger);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(loggerInstance));
  // Access the ConfigService to get environment variables
  const configService = app.get(ConfigService);

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Start the HTTP application
  const port = configService.get('HTTP_PORT', 3001);
  await app.listen(port);

  await app.init();

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  // const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3000;
  // await app.listen(port);
  // Logger.log(
  //   `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  // );
}

bootstrap();
