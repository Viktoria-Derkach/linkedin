/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/exception-filters/http-exception.filters';
import { ResponseInterceptor } from './app/interceptors/response.interceptor';

import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

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

  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for our simple e-commerce app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  await app.init();

  Logger.log(`🚀 Posts is running on: http://localhost:${port}`);
}

bootstrap();
