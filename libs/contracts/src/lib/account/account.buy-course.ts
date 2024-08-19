import { IsEmail, IsString } from 'class-validator';
import { IUser } from '@linkedin/interfaces';

export namespace AccountBuyCourse {
  export const topic = 'account.buy-course.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;
  }

  export class Response {
    paymentLink: string;
  }
}
