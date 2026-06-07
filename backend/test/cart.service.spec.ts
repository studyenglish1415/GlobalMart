import { CartService } from '../src/modules/cart/cart.service';

// Minimal mock repo creator
const createMockRepo = (initial = []) => {
  const data = [...initial];
  return {
    create: jest.fn((obj) => ({ ...obj })),
    findOne: jest.fn(async (opts) => {
      if (!opts) return null;
      const where = opts.where || {};
      if (where.user_id) return data.find((d) => d.user_id === where.user_id) || null;
      if (where.id) return data.find((d) => d.id === where.id) || null;
      return null;
    }),
    save: jest.fn(async (item) => {
      if (!item.id) {
        const id = data.length + 1;
        const saved = { id, ...item };
        data.push(saved);
        return saved;
      }
      const idx = data.findIndex((d) => d.id === item.id);
      if (idx >= 0) data[idx] = { ...data[idx], ...item };
      return item;
    }),
    delete: jest.fn(async () => ({})),
    find: jest.fn(async () => [...data]),
    update: jest.fn(async () => ({})),
    remove: jest.fn(async (item) => item),
  };
};

describe('CartService (unit)', () => {
  let cartService: any;
  let cartRepo: any;
  let cartItemRepo: any;
  let productItemRepo: any;

  beforeEach(() => {
    cartRepo = createMockRepo([]);
    cartItemRepo = createMockRepo([]);
    productItemRepo = createMockRepo([]);
    cartService = new CartService(cartRepo, cartItemRepo, productItemRepo);
    jest.clearAllMocks();
  });

  it('getOrCreateCart creates a cart when none exists', async () => {
    cartRepo.findOne.mockResolvedValue(null);
    cartRepo.save.mockResolvedValue({ id: 1, user_id: 1 });
    const res = await cartService.getOrCreateCart(1);
    expect(cartRepo.save).toHaveBeenCalled();
    expect(res).toBeDefined();
  });

  it('addItem throws when product item missing', async () => {
    productItemRepo.findOne.mockResolvedValue(null);
    cartRepo.findOne.mockResolvedValue({ id: 1, user_id: 1 });
    await expect(cartService.addItem(1, { product_item_id: 99, quantity: 1 } as any)).rejects.toThrow();
  });

  it('addItem increments existing cart item quantity', async () => {
    cartRepo.findOne.mockResolvedValue({ id: 1, user_id: 1 });
    productItemRepo.findOne.mockResolvedValue({ id: 10 });
    cartItemRepo.findOne.mockResolvedValue({ id: 5, cart_id: 1, var_product_id: 10, quantity: 1 });
    await cartService.addItem(1, { product_item_id: 10, quantity: 2 } as any);
    expect(cartItemRepo.save).toHaveBeenCalled();
    const savedArg = cartItemRepo.save.mock.calls[0][0];
    expect(savedArg.quantity).toBe(3);
  });

  it('removeItem removes existing item', async () => {
    cartRepo.findOne.mockResolvedValue({ id: 1, user_id: 1 });
    cartItemRepo.findOne.mockResolvedValue({ id: 7, cart_id: 1 });
    await cartService.removeItem(1, 7);
    expect(cartItemRepo.remove).toHaveBeenCalled();
  });

  it('updateItem throws when item not found', async () => {
    cartRepo.findOne.mockResolvedValue({ id: 1, user_id: 1 });
    cartItemRepo.findOne.mockResolvedValue(null);
    await expect(cartService.updateItem(1, 123, { quantity: 2 } as any)).rejects.toThrow();
  });
});
