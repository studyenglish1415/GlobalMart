import { AdminCategoriesController } from '../src/modules/admin/categories.controller';

describe('AdminCategoriesController', () => {
  let ctrl: AdminCategoriesController;
  const mockProductsService: any = {
    createCategory: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new AdminCategoriesController(mockProductsService);
  });

  it('create calls createCategory', async () => {
    await ctrl.create({ name: 'Cat' } as any);
    expect(mockProductsService.createCategory).toHaveBeenCalledWith({ name: 'Cat' });
  });

  it('update calls updateCategory with numeric id', async () => {
    await ctrl.update('8' as any, { name: 'Cat2' } as any);
    expect(mockProductsService.updateCategory).toHaveBeenCalledWith(8, { name: 'Cat2' });
  });

  it('delete calls deleteCategory with numeric id', async () => {
    await ctrl.delete('2' as any);
    expect(mockProductsService.deleteCategory).toHaveBeenCalledWith(2);
  });
});
