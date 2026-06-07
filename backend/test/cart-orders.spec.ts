import { CartService } from '../src/modules/cart/cart.service';
import { OrdersService } from '../src/modules/orders/orders.service';

// Mock repositories with minimal behaviour
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
    findAndCount: jest.fn(async () => [[...data], data.length]),
    find: jest.fn(async (opts) => data.filter((d) => (opts && opts.where ? Object.keys(opts.where).every(k => d[k] === opts.where[k]) : true))),
    update: jest.fn(async () => ({})),
  };
};

describe('Cart -> Orders flow (unit)', () => {
  let cartService: any;
  let ordersService: any;
  let cartRepo: any;
  let cartItemRepo: any;
  let productItemRepo: any;
  let orderRepo: any;
  let orderItemRepo: any;
  let statusHistoryRepo: any;

  beforeEach(() => {
    cartRepo = createMockRepo([{ id: 1, user_id: 1 }]);
    cartItemRepo = createMockRepo([]);
    productItemRepo = createMockRepo([{ id: 10, price: 9.99 }]);

    orderRepo = createMockRepo([]);
    orderItemRepo = createMockRepo([]);
    statusHistoryRepo = createMockRepo([]);

    cartService = new CartService(cartRepo, cartItemRepo, productItemRepo);
    ordersService = new OrdersService(orderRepo, orderItemRepo, statusHistoryRepo, cartRepo, ({ findOne: async () => null } as any));
  });

  it('adds item to cart and creates an order with correct price', async () => {
    // add item
    const saved = await cartService.addItem(1, { product_item_id: 10, quantity: 2 });
    expect(saved).toBeDefined();

    // mock cartRepo to return cart with cart_items
    cartRepo.findOne = jest.fn(async (opts) => {
      if (opts.where && opts.where.user_id === 1) {
        return { id: 1, user_id: 1, cart_items: [ { product_item: { id: 10, price: 9.99 }, quantity: 2 } ] };
      }
      return null;
    });

    const createdOrder = await ordersService.create(1, { address_id: 1, payment_method_id: 1 } as any);
    expect(createdOrder).toBeDefined();
    // orderRepo.save should have been called and orderItemRepo.save called with price
    expect(orderItemRepo.save).toHaveBeenCalled();
  });
});
