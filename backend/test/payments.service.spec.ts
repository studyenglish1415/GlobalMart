import { PaymentsService } from '../src/modules/payments/payments.service';

const createMockRepo = (initial = []) => {
  const data = [...initial];
  return {
    create: jest.fn((obj) => ({ ...obj })),
    find: jest.fn(async () => [...data]),
    save: jest.fn(async (item) => ({ id: data.length + 1, ...item })),
    findOne: jest.fn(async (opts) => {
      if (!opts) return null;
      const where = opts.where || {};
      return data.find((d) => Object.keys(where).every(k => d[k] === where[k])) || null;
    }),
  };
};

describe('PaymentsService (unit)', () => {
  let svc: PaymentsService;
  let pmRepo: any;
  let paymentRepo: any;

  beforeEach(() => {
    pmRepo = createMockRepo([{ id: 1, name: 'Card' }]);
    paymentRepo = createMockRepo([]);
    svc = new PaymentsService(pmRepo, paymentRepo);
    jest.clearAllMocks();
  });

  it('getPaymentMethods returns list', async () => {
    const res = await svc.getPaymentMethods();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);
  });

  it('createPayment constructs and saves payment', async () => {
    const res = await svc.createPayment({ order_id: 1, payment_method_id: 1, amount: 9.99 });
    expect(paymentRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });

  it('updatePaymentStatus updates when exists', async () => {
    paymentRepo.findOne.mockResolvedValue({ id: 5, status: 'pending' });
    paymentRepo.save.mockResolvedValue({ id: 5, status: 'completed' });
    const res = await svc.updatePaymentStatus(5, 'completed');
    expect(res).toBeDefined();
    expect(res.status).toBe('completed');
  });

  it('updatePaymentStatus returns null when missing', async () => {
    paymentRepo.findOne.mockResolvedValue(null);
    const res = await svc.updatePaymentStatus(99, 'x');
    expect(res).toBeNull();
  });
});
