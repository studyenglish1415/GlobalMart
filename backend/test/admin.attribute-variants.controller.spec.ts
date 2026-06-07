import { AdminAttributeVariantsController } from '../src/modules/admin/attribute-variants.controller';

describe('AdminAttributeVariantsController', () => {
  let ctrl: AdminAttributeVariantsController;
  const mockProductsService: any = {
    createAttributeVariant: jest.fn(),
    updateAttributeVariant: jest.fn(),
    deleteAttributeVariant: jest.fn(),
    listVariantsByAttribute: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new AdminAttributeVariantsController(mockProductsService);
  });

  it('create calls createAttributeVariant', async () => {
    await ctrl.create({ attribute_id: 1, name: 'Small' } as any);
    expect(mockProductsService.createAttributeVariant).toHaveBeenCalledWith({ attribute_id: 1, name: 'Small' });
  });

  it('update calls updateAttributeVariant with numeric id', async () => {
    await ctrl.update('7' as any, { name: 'Large' } as any);
    expect(mockProductsService.updateAttributeVariant).toHaveBeenCalledWith(7, { name: 'Large' });
  });

  it('delete calls deleteAttributeVariant with numeric id', async () => {
    await ctrl.delete('2' as any);
    expect(mockProductsService.deleteAttributeVariant).toHaveBeenCalledWith(2);
  });

  it('listByAttribute calls listVariantsByAttribute with numeric id', async () => {
    await ctrl.listByAttribute('11' as any);
    expect(mockProductsService.listVariantsByAttribute).toHaveBeenCalledWith(11);
  });
});
