import { CouponsService } from '../src/modules/coupons/coupons.service';

const createMockRepo = (initial = []) => {
  const data = [...initial];
  return {
    findOne: jest.fn(async (opts) => {
      if (!opts) return null;
      const where = opts.where || {};
      return data.find((d) => Object.keys(where).every(k => d[k] === where[k])) || null;
    }),
  };
};

describe('CouponsService (unit)', () => {
  let svc: CouponsService;
  let repo: any;

  beforeEach(() => {
    repo = createMockRepo([]);
    svc = new CouponsService(repo);
    jest.clearAllMocks();
  });

  it('getByCoupon returns coupon when exists', async () => {
    repo.findOne.mockResolvedValue({ id: 1, code: 'SAVE10' });
    const res = await svc.getByCoupon('SAVE10');
    expect(res).toBeDefined();
    expect(res.code).toBe('SAVE10');
  });

  it('getByCoupon throws when not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(svc.getByCoupon('NOPE')).rejects.toThrow();
  });
});
