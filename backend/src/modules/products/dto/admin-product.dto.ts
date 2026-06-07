import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  brand_id?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  category_id?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  active?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  currency?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  brand_id?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  category_id?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  active?: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty()
  currency?: string;
}
