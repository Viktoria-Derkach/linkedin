import { PostType } from '@linkedin/interfaces';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';

export class FindPostsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  perPage = 10; // Default value of 10

  @IsOptional()
  @IsIn(['asc', 'desc']) // Only allows 'asc' or 'desc'
  sortDir: 'asc' | 'desc' = 'asc'; // Default value of 'asc'

  @IsOptional()
  @IsIn(['interactedAt', 'createdAt', 'updatedAt']) // Only allows 'asc' or 'desc'
  sortBy: 'interactedAt' | 'createdAt' | 'updatedAt' = 'interactedAt'; // Default value of 'asc'

  @IsOptional()
  @IsEnum(PostType)
  type: PostType;
}
