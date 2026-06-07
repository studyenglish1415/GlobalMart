import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductImageDto {
  @IsNumber()
  @ApiProperty()
  product_id: number;

  @IsString()
  @ApiProperty()
  image_url: string;
}

export class UpdateProductImageDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  image_url?: string;
}
