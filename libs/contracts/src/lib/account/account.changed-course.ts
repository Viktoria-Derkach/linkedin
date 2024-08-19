import { IsEmail, IsString } from 'class-validator';
import { IUser, PurchaseState } from '@linkedin/interfaces';
import { PaymentStatus } from '../payment/payment.check';

export namespace AccountChangedCourse {
  export const topic = 'account.change-course.event';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;

    @IsString()
    state: PurchaseState;
  }
}
