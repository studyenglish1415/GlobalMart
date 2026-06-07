import { AdminProductItemsController } from '../src/modules/admin/product-items.controller';

describe('AdminProductItemsController', () => {
  let ctrl: AdminProductItemsController;
  const mockProductsService: any = {
    createProductItem: jest.fn(),
    listProductItems: jest.fn(),
    getProductItem: jest.fn(),
    updateProductItem: jest.fn(),
    deleteProductItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new AdminProductItemsController(mockProductsService);
  });

  it('create calls createProductItem', async () => {
    await ctrl.create({ product_id: 1 } as any);
    expect(mockProductsService.createProductItem).toHaveBeenCalledWith({ product_id: 1 });
  });

  it('listByProduct calls listProductItems with numeric id', async () => {
    await ctrl.listByProduct('3' as any);
    expect(mockProductsService.listProductItems).toHaveBeenCalledWith(3);
  });

  it('getOne calls getProductItem with numeric id', async () => {
    await ctrl.getOne('5' as any);
    expect(mockProductsService.getProductItem).toHaveBeenCalledWith(5);
  });

  it('update calls updateProductItem with numeric id', async () => {
    await ctrl.update('6' as any, { price: 9 } as any);
    expect(mockProductsService.updateProductItem).toHaveBeenCalledWith(6, { price: 9 });
  });

  it('delete calls deleteProductItem with numeric id', async () => {
    await ctrl.delete('7' as any);
    expect(mockProductsService.deleteProductItem).toHaveBeenCalledWith(7);
  });
});
