import { Module } from '@nestjs/common';

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

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.posts.env', isGlobal: true }),
    ClientsModule.registerAsync([getRMQClientConfig()]),
    JwtModule.registerAsync(getJWTConfig()),
    PostModule,
    UploadModule,
    MongooseModule.forRootAsync(getMongoConfig()),
  ],
  controllers: [AppController, PostController, PostController],
  providers: [AppService],
})
export class AppModule {}
