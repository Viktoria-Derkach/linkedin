import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { EventDto, MediaDto, PollDto } from './common.dto';

export class UpdatePostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  file?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(1800)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => EventDto)
  event?: EventDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  media?: MediaDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => PollDto)
  poll?: PollDto;
}

// export class UpdatePostResponseDto {
//   @ApiProperty()
//   postId: string;
// }
