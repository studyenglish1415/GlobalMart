import { AdminBrandsController } from '../src/modules/admin/brands.controller';

describe('AdminBrandsController', () => {
  let ctrl: AdminBrandsController;
  const mockProductsService: any = {
    createBrand: jest.fn(),
    updateBrand: jest.fn(),
    deleteBrand: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new AdminBrandsController(mockProductsService);
  });

  it('create calls createBrand', async () => {
    await ctrl.create({ name: 'BrandX' } as any);
    expect(mockProductsService.createBrand).toHaveBeenCalledWith({ name: 'BrandX' });
  });

  it('update calls updateBrand with numeric id', async () => {
    await ctrl.update('4' as any, { name: 'B2' } as any);
    expect(mockProductsService.updateBrand).toHaveBeenCalledWith(4, { name: 'B2' });
  });

  it('delete calls deleteBrand with numeric id', async () => {
    await ctrl.delete('9' as any);
    expect(mockProductsService.deleteBrand).toHaveBeenCalledWith(9);
  });
});
