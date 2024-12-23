import { Module } from '@nestjs/common';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getRMQClientConfig } from '../configs/rmq.client.config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../models/post.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    // ConfigModule.forRoot({ envFilePath: 'envs/.posts.env', isGlobal: true }),
    // ClientsModule.registerAsync([getRMQClientConfig()]),
    JwtModule.registerAsync(getJWTConfig()),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
