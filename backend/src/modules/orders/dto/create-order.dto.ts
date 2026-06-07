import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNumber()
  @ApiProperty()
  address_id: number;

  @IsNumber()
  @ApiProperty()
  payment_method_id: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  coupon_code: string;
}
