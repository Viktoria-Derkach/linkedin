import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export namespace AccountResetPassword {
  export const topic = 'account.reset-password.command';

  export class Request {
    @IsString()
    resetToken: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {
      message: 'Password must contain at least one number',
    })
    newPassword: string;
  }

  export class Response {
    // access_token: string;
  }
}
