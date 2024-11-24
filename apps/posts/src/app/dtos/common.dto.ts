import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsString } from 'class-validator';
import { IsUniqueArray } from '../decorators/is-unique-array.decorator';

export class EventDto {
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

export class MediaDto {
  @ApiProperty()
  @IsString()
  image: string; // Image URL or path
}

export class PollDto {
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
