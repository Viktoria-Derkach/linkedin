import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
  IsArray,
  IsOptional,
  IsDate,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Express } from 'express';

class EventDto {
  @IsString()
  title: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  speakers: string[];
}

class MediaDto {
  @IsString()
  image: string; // Image URL or path
}

class PollDto {
  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];
}

export class CreatePostDto {
  @IsString()
  type: 'file' | 'event' | 'media' | 'poll' | 'text';

  @IsOptional()
  @IsString()
  file?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(1800)
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EventDto)
  event?: EventDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  media?: MediaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PollDto)
  poll?: PollDto;
}
