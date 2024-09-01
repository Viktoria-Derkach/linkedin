import { IsEmail, IsString } from 'class-validator';

export namespace AccountForgotPassword {
  export const topic = 'account.forgot-password.command';

  export class Request {
    @IsEmail()
    email: string;
  }

  export class Response {
    // access_token: string;
  }
}
