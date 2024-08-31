import { IsEmail, IsString } from 'class-validator';

export namespace AccountRefreshToken {
  export const topic = 'account.refresh-token.command';

  export class Request {
    @IsString()
    token: string;
  }

  export class Response {
    access_token: string;
  }
}
