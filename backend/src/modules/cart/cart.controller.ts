import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  async addItem(@Request() req: any, @Body() itemDto: CartItemDto) {
    return this.cartService.addItem(req.user.id, itemDto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(
    @Request() req: any,
    @Param('id') itemId: number,
    @Body() updateDto: UpdateCartItemDto
  ) {
    return this.cartService.updateItem(req.user.id, itemId, updateDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Request() req: any, @Param('id') itemId: number) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  async clearCart(@Request() req: any) {
    await this.cartService.clearCart(req.user.id);
    return { message: 'Cart cleared' };
  }
}
