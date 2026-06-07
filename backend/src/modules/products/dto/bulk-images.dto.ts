import { IsNumber, IsArray, ArrayNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkCreateImagesDto {
  @IsNumber()
  @ApiProperty()
  product_id: number;

  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({ type: [String] })
  image_urls: string[];
}
