import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsUniqueArray } from '../decorators/is-unique-array.decorator';

class EventDto {
  @ApiProperty({ description: 'title of event', example: 'holiday' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'desc of event', example: 'gooddd' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  speakers: string[];
}

class MediaDto {
  @ApiProperty()
  @IsString()
  image: string; // Image URL or path
}

class PollDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(2)
  @IsUniqueArray({ message: 'Options must contain unique values' })
  @IsString({ each: true })
  options: string[];
}

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  type: 'file' | 'event' | 'media' | 'poll' | 'text';

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

export class CreatePostResponseDto {
  @ApiProperty()
  postId: string;
}
