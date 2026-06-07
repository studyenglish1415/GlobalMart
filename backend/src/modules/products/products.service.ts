import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
import { Category } from '../../database/entities/category.entity';
import { Brand } from '../../database/entities/brand.entity';
import { ProductItem } from '../../database/entities/product-item.entity';
import { ProductImage } from '../../database/entities/product-image.entity';
import { Attribute } from '../../database/entities/attribute.entity';
import { AttributeVariant } from '../../database/entities/attribute-variant.entity';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
    @InjectRepository(Brand)
    private brandsRepo: Repository<Brand>,
    @InjectRepository(ProductItem)
    private itemsRepo: Repository<ProductItem>,
    @InjectRepository(ProductImage)
    private imagesRepo: Repository<ProductImage>,
    @InjectRepository(Attribute)
    private attributesRepo: Repository<Attribute>,
    @InjectRepository(AttributeVariant)
    private variantsRepo: Repository<AttributeVariant>
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      brandId,
      sortBy = 'created_at',
      order = 'DESC',
    } = query;
    const skip = (page - 1) * limit;

    let qb = this.productsRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.product_items', 'items')
      .leftJoinAndSelect('product.images', 'images');

    if (search) {
      qb = qb.where('product.name ILIKE :search', { search: `%${search}%` });
    }

    if (categoryId) {
      qb = qb.andWhere('product.category_id = :categoryId', { categoryId });
    }

    if (brandId) {
      qb = qb.andWhere('product.brand_id = :brandId', { brandId });
    }

    const [products, total] = await qb
      .orderBy(`product.${sortBy}`, order)
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { products, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findById(id: number) {
    return this.productsRepo.findOne({
      where: { id },
      relations: ['category', 'brand', 'product_items', 'images', 'attributes'],
    });
  }

  async getCategories() {
    return this.categoriesRepo.find();
  }

  async getBrands() {
    return this.brandsRepo.find();
  }

  async createBrand(data: { name: string; country?: string }) {
    const brand = this.brandsRepo.create(data as any);
    return this.brandsRepo.save(brand);
  }

  async updateBrand(id: number, data: Partial<{ name: string; country: string }>) {
    await this.brandsRepo.update(id, data as any);
    return this.brandsRepo.findOne({ where: { id } });
  }

  async deleteBrand(id: number) {
    return this.brandsRepo.delete({ id });
  }

  async createCategory(data: { name: string; parent_id?: number }) {
    const cat = this.categoriesRepo.create(data as any);
    return this.categoriesRepo.save(cat);
  }

  async updateCategory(id: number, data: Partial<{ name: string; parent_id: number }>) {
    await this.categoriesRepo.update(id, data as any);
    return this.categoriesRepo.findOne({ where: { id } });
  }

  async deleteCategory(id: number) {
    return this.categoriesRepo.delete({ id });
  }

  async createProduct(data: Partial<Product>) {
    const p = this.productsRepo.create(data as any);
    return this.productsRepo.save(p);
  }

  async updateProduct(id: number, data: Partial<Product>) {
    await this.productsRepo.update(id, data as any);
    return this.findById(id);
  }

  async deleteProduct(id: number) {
    return this.productsRepo.delete({ id });
  }

  // Product items (variants)
  async createProductItem(data: Partial<ProductItem>) {
    const it = this.itemsRepo.create(data as any);
    return this.itemsRepo.save(it);
  }

  async updateProductItem(id: number, data: Partial<ProductItem>) {
    await this.itemsRepo.update(id, data as any);
    return this.itemsRepo.findOne({ where: { id } });
  }

  async deleteProductItem(id: number) {
    return this.itemsRepo.delete({ id });
  }

  async listProductItems(product_id: number) {
    return this.itemsRepo.find({ where: { product_id } });
  }

  async getProductItem(id: number) {
    return this.itemsRepo.findOne({ where: { id } });
  }

  // Product images
  async createProductImage(data: Partial<ProductImage>) {
    const img = this.imagesRepo.create(data as any);
    return this.imagesRepo.save(img);
  }

  async updateProductImage(id: number, data: Partial<ProductImage>) {
    await this.imagesRepo.update(id, data as any);
    return this.imagesRepo.findOne({ where: { id } });
  }

  async deleteProductImage(id: number) {
    return this.imagesRepo.delete({ id });
  }

  async listProductImages(product_id: number) {
    return this.imagesRepo.find({ where: { product_id } });
  }

  async getProductImage(id: number) {
    return this.imagesRepo.findOne({ where: { id } });
  }

  // Attributes
  async createAttribute(data: Partial<Attribute>) {
    const a = this.attributesRepo.create(data as any);
    return this.attributesRepo.save(a);
  }

  async updateAttribute(id: number, data: Partial<Attribute>) {
    await this.attributesRepo.update(id, data as any);
    return this.attributesRepo.findOne({ where: { id } });
  }

  async deleteAttribute(id: number) {
    return this.attributesRepo.delete({ id });
  }

  // Attribute variants
  async createAttributeVariant(data: Partial<AttributeVariant>) {
    const v = this.variantsRepo.create(data as any);
    return this.variantsRepo.save(v);
  }

  async updateAttributeVariant(id: number, data: Partial<AttributeVariant>) {
    await this.variantsRepo.update(id, data as any);
    return this.variantsRepo.findOne({ where: { id } });
  }

  async deleteAttributeVariant(id: number) {
    return this.variantsRepo.delete({ id });
  }

  // Bulk create images
  async bulkCreateProductImages(product_id: number, image_urls: string[]) {
    const imgs = image_urls.map((url) => ({ product_id, image_url: url } as any));
    return this.imagesRepo.save(imgs as any);
  }

  // Admin product list (reuse public findAll but return raw)
  async adminListProducts(page = 1, limit = 20) {
    return this.findAll({ page, limit } as any);
  }

  async listVariantsByAttribute(attributeId: number) {
    return this.variantsRepo.find({ where: { attribute_id: attributeId } });
  }
}
