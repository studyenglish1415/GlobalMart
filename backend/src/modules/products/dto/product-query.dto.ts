import { IsOptional, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty , ApiPropertyOptional} from '@nestjs/swagger';

export class ProductQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @Min(1)
  @ApiProperty()
  page: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @ApiProperty()
  limit: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @ApiProperty()
  search: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @ApiProperty()
  categoryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @ApiProperty()
  brandId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @ApiProperty()
  sortBy: string = 'created_at';

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  @ApiProperty()
  order: 'ASC' | 'DESC' = 'DESC';
}
