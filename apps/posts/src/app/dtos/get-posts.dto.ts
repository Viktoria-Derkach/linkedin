import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';

// @Query('page') page: number,
// @Query('perPage') perPage: number,
// @Query('sortBy') sortBy: string,
// @Query('sortDir') sortDir: string,
// @Query('filters') filters: string
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
}
