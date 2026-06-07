import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @IsNumber()
  @ApiProperty()
  product_item_id: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;
}
