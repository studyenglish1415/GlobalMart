import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateCouponDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  cart_total: number;
}
