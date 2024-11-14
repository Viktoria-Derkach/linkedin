import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getRMQClientConfig } from './configs/rmq.client.config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from './configs/jwt.config';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './configs/mongo.config';
import { UploadModule } from './upload/upload.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { getRedisConfig } from './configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.posts.env', isGlobal: true }),
    ClientsModule.registerAsync([getRMQClientConfig()]),
    JwtModule.registerAsync(getJWTConfig()),
    PostModule,
    UploadModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    CacheModule.registerAsync(getRedisConfig()),
  ],
  controllers: [AppController, PostController, PostController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
