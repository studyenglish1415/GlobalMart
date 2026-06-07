import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../database/entities/coupon.entity';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepo: Repository<Coupon>
  ) {}

//   async validate(validateDto: ValidateCouponDto) {
//     const coupon = await this.couponRepo.findOne({
//       where: { code: validateDto.code },
//     });

//     if (!coupon) {
//       throw new NotFoundException('Coupon not found');
//     }

//     if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
//       throw new BadRequestException('Coupon has expired');
//     }

//     if (
//       coupon.min_order_value &&
//       validateDto.cart_total < coupon.min_order_value
//     ) {
//       throw new BadRequestException(
//         `Minimum order value of ${coupon.min_order_value} required`
//       );
//     }

//     const discount = (validateDto.cart_total * coupon.discount_percent) / 100;
//     const finalTotal = validateDto.cart_total - discount;

//     return {
//       code: coupon.code,
//       discount_percent: coupon.discount_percent,
//       discount_amount: discount,
//       final_total: finalTotal,
//     };
//  }

  async getByCoupon(code: string) {
    const coupon = await this.couponRepo.findOne({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }
}
