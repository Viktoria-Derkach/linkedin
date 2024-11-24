import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getJWTConfig } from './configs/jwt.config';
import { getMongoConfig } from './configs/mongo.config';
import { getRedisConfig } from './configs/redis.config';
import { getRMQClientConfig } from './configs/rmq.client.config';
import {
  CsrfMiddleware,
  doubleCsrfProtection,
} from './middleware/csrf.middleware';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.posts.env', isGlobal: true }),
    ClientsModule.registerAsync([getRMQClientConfig()]),
    JwtModule.registerAsync(getJWTConfig()),
    CacheModule.registerAsync(getRedisConfig()),
    MongooseModule.forRootAsync(getMongoConfig()),
    PostModule,
    UploadModule,
  ],
  controllers: [AppController, PostController, PostController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');

    consumer
      .apply(CsrfMiddleware, doubleCsrfProtection) // Apply CSRF middleware
      .forRoutes('*'); // Apply to all routes
  }
}
