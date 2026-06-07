import { AdminProductImagesController } from '../src/modules/admin/product-images.controller';

describe('AdminProductImagesController', () => {
  let ctrl: AdminProductImagesController;
  const mockProductsService: any = {
    createProductImage: jest.fn(),
    bulkCreateProductImages: jest.fn(),
    updateProductImage: jest.fn(),
    deleteProductImage: jest.fn(),
    listProductImages: jest.fn(),
    getProductImage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new AdminProductImagesController(mockProductsService);
  });

  it('create calls createProductImage', async () => {
    await ctrl.create({ product_id: 1, image_url: 'a' } as any);
    expect(mockProductsService.createProductImage).toHaveBeenCalledWith({ product_id: 1, image_url: 'a' });
  });

  it('bulkCreate calls bulkCreateProductImages', async () => {
    await ctrl.bulkCreate({ product_id: 2, image_urls: ['a','b'] } as any);
    expect(mockProductsService.bulkCreateProductImages).toHaveBeenCalledWith(2, ['a','b']);
  });

  it('update calls updateProductImage with numeric id', async () => {
    await ctrl.update('3' as any, { image_url: 'z' } as any);
    expect(mockProductsService.updateProductImage).toHaveBeenCalledWith(3, { image_url: 'z' });
  });

  it('delete calls deleteProductImage with numeric id', async () => {
    await ctrl.delete('4' as any);
    expect(mockProductsService.deleteProductImage).toHaveBeenCalledWith(4);
  });

  it('listByProduct calls listProductImages with numeric id', async () => {
    await ctrl.listByProduct('5' as any);
    expect(mockProductsService.listProductImages).toHaveBeenCalledWith(5);
  });

  it('getOne calls getProductImage with numeric id', async () => {
    await ctrl.getOne('6' as any);
    expect(mockProductsService.getProductImage).toHaveBeenCalledWith(6);
  });
});
