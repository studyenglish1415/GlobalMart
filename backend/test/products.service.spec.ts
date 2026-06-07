import { ProductsService } from '../src/modules/products/products.service';

const createMockRepo = (initial = []) => {
  const data = [...initial];
  return {
    create: jest.fn((obj) => ({ ...obj })),
    findOne: jest.fn(async (opts) => {
      if (!opts) return null;
      const where = opts.where || {};
      if (where.id) return data.find((d) => d.id === where.id) || null;
      return null;
    }),
    save: jest.fn(async (item) => {
      if (Array.isArray(item)) {
        const saved = item.map((it, i) => ({ id: data.length + i + 1, ...it }));
        data.push(...saved);
        return saved;
      }
      if (!item.id) {
        const id = data.length + 1;
        const saved = { id, ...item };
        data.push(saved);
        return saved;
      }
      return item;
    }),
    find: jest.fn(async (opts) => data.filter((d) => (opts && opts.where ? Object.keys(opts.where).every(k => d[k] === opts.where[k]) : true))),
    update: jest.fn(async () => ({})),
    delete: jest.fn(async () => ({})),
    findAndCount: jest.fn(async () => [[...data], data.length]),
  };
};

describe('ProductsService (unit)', () => {
  let svc: ProductsService;
  let productsRepo: any;
  let categoriesRepo: any;
  let brandsRepo: any;
  let itemsRepo: any;
  let imagesRepo: any;
  let attributesRepo: any;
  let variantsRepo: any;

  beforeEach(() => {
    productsRepo = createMockRepo([]);
    categoriesRepo = createMockRepo([]);
    brandsRepo = createMockRepo([]);
    itemsRepo = createMockRepo([]);
    imagesRepo = createMockRepo([]);
    attributesRepo = createMockRepo([]);
    variantsRepo = createMockRepo([]);

    svc = new ProductsService(
      productsRepo,
      categoriesRepo,
      brandsRepo,
      itemsRepo,
      imagesRepo,
      attributesRepo,
      variantsRepo
    );
    jest.clearAllMocks();
  });

  it('findById returns product when present', async () => {
    productsRepo.findOne.mockResolvedValue({ id: 1, name: 'P' });
    const res = await svc.findById(1);
    expect(res).toBeDefined();
    expect(res.id).toBe(1);
  });

  it('getCategories and getBrands call repos', async () => {
    categoriesRepo.find.mockResolvedValue([{ id: 1 }]);
    brandsRepo.find.mockResolvedValue([{ id: 2 }]);
    const cats = await svc.getCategories();
    const brands = await svc.getBrands();
    expect(Array.isArray(cats)).toBe(true);
    expect(Array.isArray(brands)).toBe(true);
  });

  it('createBrand, updateBrand, deleteBrand flow', async () => {
    brandsRepo.create.mockImplementation((o) => ({ ...o }));
    brandsRepo.save.mockResolvedValue({ id: 5, name: 'B' });
    const created = await svc.createBrand({ name: 'B' });
    expect(created).toHaveProperty('id');

    brandsRepo.update.mockResolvedValue(undefined);
    brandsRepo.findOne.mockResolvedValue({ id: 5, name: 'B2' });
    const updated = await svc.updateBrand(5, { name: 'B2' });
    expect(brandsRepo.update).toHaveBeenCalledWith(5, { name: 'B2' });
    expect(updated.name).toBe('B2');

    brandsRepo.delete.mockResolvedValue({});
    await svc.deleteBrand(5);
    expect(brandsRepo.delete).toHaveBeenCalledWith({ id: 5 });
  });

  it('createCategory and createProduct create and save', async () => {
    categoriesRepo.create.mockImplementation((o) => ({ ...o }));
    categoriesRepo.save.mockResolvedValue({ id: 8 });
    const cat = await svc.createCategory({ name: 'C' });
    expect((cat as any).id).toBeDefined();

    productsRepo.create.mockImplementation((o) => ({ ...o }));
    productsRepo.save.mockResolvedValue({ id: 9 });
    const p = await svc.createProduct({ name: 'Prod' } as any);
    expect((p as any).id).toBeDefined();
  });

  it('createProductItem and listProductItems', async () => {
    itemsRepo.create.mockImplementation((o) => ({ ...o }));
    itemsRepo.save.mockResolvedValue({ id: 3, product_id: 1 });
    const it = await svc.createProductItem({ product_id: 1 } as any);
    expect((it as any).id).toBeDefined();

    itemsRepo.find.mockResolvedValue([{ id: 3, product_id: 1 }]);
    const list = await svc.listProductItems(1);
    expect(list.length).toBeGreaterThan(0);
  });

  it('bulkCreateProductImages saves multiple images', async () => {
    imagesRepo.save.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await svc.bulkCreateProductImages(1, ['a.jpg', 'b.jpg']);
    expect(Array.isArray(res)).toBe(true);
    expect(imagesRepo.save).toHaveBeenCalled();
  });

  it('createAttributeVariant creates and saves', async () => {
    variantsRepo.create.mockImplementation((o) => ({ ...o }));
    variantsRepo.save.mockResolvedValue({ id: 4 });
    const v = await svc.createAttributeVariant({ attribute_id: 1, name: 'X' } as any);
    expect((v as any).id).toBeDefined();
  });
});
