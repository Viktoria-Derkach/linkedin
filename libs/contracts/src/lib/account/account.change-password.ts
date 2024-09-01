import { IsEmail, IsString } from 'class-validator';

export namespace AccountChangePassword {
  export const topic = 'account.change-password.command';

  export class Request {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;

    @IsString()
    userId: string;
  }

  export class Response {}
}
