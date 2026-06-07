import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

//   @Post('validate')
//   @ApiOperation({ summary: 'Validate coupon code and calculate discount' })
//   async validate(@Body() validateDto: ValidateCouponDto) {
//     return this.couponsService.validate(validateDto);
//   }

  @Get(':code')
  @ApiOperation({ summary: 'Get coupon details' })
  async getByCode(@Param('code') code: string) {
    return this.couponsService.getByCoupon(code);
  }
}
