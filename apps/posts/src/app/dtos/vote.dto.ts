import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VoteDto {
  @ApiProperty()
  @IsString()
  option: string;
}
