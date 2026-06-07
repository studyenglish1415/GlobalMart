import { AdminProductsController } from '../src/modules/admin/products.controller';

describe('AdminProductsController', () => {
  let ctrl: AdminProductsController;
  const mockProductsService: any = {
    createProduct: jest.fn(),
    adminListProducts: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new AdminProductsController(mockProductsService);
  });

  it('create calls productsService.createProduct', async () => {
    await ctrl.create({ name: 'X' } as any);
    expect(mockProductsService.createProduct).toHaveBeenCalledWith({ name: 'X' });
  });

  it('list calls adminListProducts with parsed query params', async () => {
    await ctrl.list({}, { query: { page: '2', limit: '5' } } as any, {} as any);
    expect(mockProductsService.adminListProducts).toHaveBeenCalledWith(2, 5);
  });

  it('update calls updateProduct with numeric id', async () => {
    await ctrl.update('10' as any, { name: 'Updated' } as any);
    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(10, { name: 'Updated' });
  });

  it('delete calls deleteProduct with numeric id', async () => {
    await ctrl.delete('7' as any);
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(7);
  });
});
