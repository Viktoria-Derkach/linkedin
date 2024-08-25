/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create the HTTP application
  const app = await NestFactory.create(AppModule);

  // Access the ConfigService to get environment variables
  const configService = app.get(ConfigService);

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Start the HTTP application
  // await app.listen(configService.get('HTTP_PORT', 3000));

  // Create and configure the RabbitMQ microservice
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL')],
      queue: configService.get<string>('RMQ_QUEUE'),
      queueOptions: {
        durable: false,
      },
    },
  });

  // Start the microservice
  // await app.startAllMicroservices();
  await app.init();

  Logger.log(`🚀 account is running on: `);

  await microservice.listen();
}

bootstrap();
