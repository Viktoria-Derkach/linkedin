import { IsString } from 'class-validator';

export namespace AccountGetUser {
  export const topic = 'account.get-user.query';

  export class Request {
    @IsString()
    userId: string;
  }

  export class Response {
    roleId: any;
  }
}
