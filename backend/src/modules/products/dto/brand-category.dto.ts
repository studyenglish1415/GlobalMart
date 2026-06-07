import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country?: string;
}

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  country?: string;
}

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  parent_id?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  parent_id?: number;
}
