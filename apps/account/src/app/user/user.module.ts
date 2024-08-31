import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { RefreshToken, RefreshTokenSchema } from './models/refresh-token.model';
// import { UserCommands } from './user.commands';
// import { UserQueries } from './user.queries';
// import { UserEventEmmiter } from './user.event-emmiter';
// import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [UserRepository],
  exports: [UserRepository],
  // controllers: [UserCommands, UserQueries],
})
export class UserModule {}
