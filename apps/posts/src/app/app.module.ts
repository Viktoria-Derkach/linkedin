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

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.posts.env', isGlobal: true }),
    ClientsModule.registerAsync([getRMQClientConfig()]),
    JwtModule.registerAsync(getJWTConfig()),
    PostModule,
  ],
  controllers: [AppController, PostController],
  providers: [AppService],
})
export class AppModule {}
