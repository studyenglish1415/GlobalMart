import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProductsService } from '../products/products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';

const UPLOAD_DIR = join(__dirname, '..', '..', '..', 'public', 'uploads');
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

@ApiTags('Admin - Product Images')
@Controller('admin/products/:productId/images')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminProductImagesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List product images' })
  async list(@Param('productId') productId: number) {
    return this.productsService.listProductImages(Number(productId));
  }

  @Post()
  @ApiOperation({ summary: 'Create product image from URL list' })
  async create(@Param('productId') productId: number, @Body() body: any) {
    // expects { image_url } or { image_urls: [] }
    if (body.image_urls && Array.isArray(body.image_urls)) {
      return this.productsService.bulkCreateProductImages(Number(productId), body.image_urls);
    }
    if (body.image_url) {
      return this.productsService.createProductImage({ product_id: Number(productId), image_url: body.image_url } as any);
    }
    throw new BadRequestException('Missing image_url or image_urls');
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: UPLOAD_DIR,
      filename: (req, file, cb) => {
        const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + extname(file.originalname);
        cb(null, name);
      },
    }),
  }))
  @ApiOperation({ summary: 'Upload an image file' })
  async upload(@Param('productId') productId: number, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    const publicUrl = `/uploads/${file.filename}`;
    return this.productsService.createProductImage({ product_id: Number(productId), image_url: publicUrl } as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product image' })
  async update(@Param('id') id: number, @Body() body: any) {
    return this.productsService.updateProductImage(Number(id), body as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product image' })
  async delete(@Param('id') id: number) {
    return this.productsService.deleteProductImage(Number(id));
  }
}

