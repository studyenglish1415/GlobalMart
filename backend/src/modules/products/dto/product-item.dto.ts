import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductItemDto {
  @IsNumber()
  @ApiProperty()
  product_id: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  sku?: string;

  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsOptional()
  @ApiProperty()
  weight?: number;
}

export class UpdateProductItemDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  sku?: string;

  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsOptional()
  @ApiProperty()
  weight?: number;
}
