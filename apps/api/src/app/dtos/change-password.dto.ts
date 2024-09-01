import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class ChangePassword {
  @IsString()
  oldPassword: string;

  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  newPassword: string;
}
