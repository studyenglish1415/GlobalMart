import { AdminAttributesController } from '../src/modules/admin/attributes.controller';

describe('AdminAttributesController', () => {
  let ctrl: AdminAttributesController;
  const mockProductsService: any = {
    createAttribute: jest.fn(),
    updateAttribute: jest.fn(),
    deleteAttribute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new AdminAttributesController(mockProductsService);
  });

  it('create calls productsService.createAttribute', async () => {
    await ctrl.create({ name: 'Size' } as any);
    expect(mockProductsService.createAttribute).toHaveBeenCalledWith({ name: 'Size' });
  });

  it('update calls updateAttribute with numeric id', async () => {
    await ctrl.update('12' as any, { name: 'Color' } as any);
    expect(mockProductsService.updateAttribute).toHaveBeenCalledWith(12, { name: 'Color' });
  });

  it('delete calls deleteAttribute with numeric id', async () => {
    await ctrl.delete('3' as any);
    expect(mockProductsService.deleteAttribute).toHaveBeenCalledWith(3);
  });
});
