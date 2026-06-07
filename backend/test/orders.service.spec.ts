import { OrdersService } from '../src/modules/orders/orders.service';

const createMockRepo = (initial = []) => {
  const data = [...initial];
  return {
    create: jest.fn((obj) => ({ ...obj })),
    findOne: jest.fn(async (opts) => {
      if (!opts) return null;
      const where = opts.where || {};
      if (where.id) return data.find((d) => d.id === where.id) || null;
      if (where.user_id) return data.find((d) => d.user_id === where.user_id) || null;
      return null;
    }),
    save: jest.fn(async (item) => {
      if (!item.id) {
        const id = data.length + 1;
        const saved = { id, ...item };
        data.push(saved);
        return saved;
      }
      return item;
    }),
    find: jest.fn(async () => [...data]),
    findAndCount: jest.fn(async () => [[...data], data.length]),
    delete: jest.fn(async () => ({})),
    update: jest.fn(async () => ({})),
  };
};

describe('OrdersService (unit)', () => {
  let ordersService: any;
  let orderRepo: any;
  let orderItemRepo: any;
  let statusHistoryRepo: any;
  let cartRepo: any;
  let couponRepo: any;

  beforeEach(() => {
    orderRepo = createMockRepo([]);
    orderItemRepo = createMockRepo([]);
    statusHistoryRepo = createMockRepo([]);
    cartRepo = createMockRepo([]);
    couponRepo = createMockRepo([]);
    ordersService = new OrdersService(orderRepo, orderItemRepo, statusHistoryRepo, cartRepo, couponRepo);
    jest.clearAllMocks();
  });

  it('findById throws when order not found', async () => {
    orderRepo.findOne.mockResolvedValue(null);
    await expect(ordersService.findById(99, 1)).rejects.toThrow();
  });

  it('getStatusHistory returns history array', async () => {
    orderRepo.findOne.mockResolvedValue({ id: 5, user_id: 1 });
    statusHistoryRepo.find.mockResolvedValue([{ id: 1, order_id: 5 }]);
    const res = await ordersService.getStatusHistory(5, 1);
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(1);
  });

  it('create throws when cart missing', async () => {
    cartRepo.findOne.mockResolvedValue(null);
    await expect(ordersService.create(1, { address_id: 1 } as any)).rejects.toThrow();
  });

  it('create saves order and order items when cart has items', async () => {
    cartRepo.findOne.mockResolvedValue({ id: 1, user_id: 1, cart_items: [{ product_item: { id: 10, price: 5.0 }, quantity: 2 }] });
    orderRepo.create.mockImplementation((o) => ({ ...o }));
    orderRepo.save.mockResolvedValue({ id: 11, user_id: 1, total_price: 0 });
    orderItemRepo.save.mockResolvedValue({ id: 21 });
    statusHistoryRepo.create.mockImplementation((h) => ({ ...h }));
    statusHistoryRepo.save.mockResolvedValue({ id: 31 });

    const res = await ordersService.create(1, { address_id: 1 } as any);
    expect(orderRepo.save).toHaveBeenCalled();
    expect(orderItemRepo.save).toHaveBeenCalled();
    expect(statusHistoryRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });
});
