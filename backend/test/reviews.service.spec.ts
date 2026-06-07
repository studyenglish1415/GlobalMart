import { ReviewsService } from '../src/modules/reviews/reviews.service';

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
      if (!item.id) {
        const id = data.length + 1;
        const saved = { id, ...item };
        data.push(saved);
        return saved;
      }
      return item;
    }),
    findAndCount: jest.fn(async () => [[...data], data.length]),
    remove: jest.fn(async (item) => item),
  };
};

describe('ReviewsService (unit)', () => {
  let svc: ReviewsService;
  let repo: any;

  beforeEach(() => {
    repo = createMockRepo([]);
    svc = new ReviewsService(repo);
    jest.clearAllMocks();
  });

  it('findByProduct returns paginated data', async () => {
    repo.findAndCount.mockResolvedValue([[{ id: 1, product_id: 2 }], 1]);
    const res = await svc.findByProduct(2);
    expect(res.total).toBe(1);
    expect(Array.isArray(res.reviews)).toBe(true);
  });

  it('findById throws when missing', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(svc.findById(99)).rejects.toThrow();
  });

  it('create saves a review', async () => {
    repo.create.mockImplementation((o) => ({ ...o }));
    repo.save.mockResolvedValue({ id: 3, user_id: 1, product_id: 4 });
    const res = await svc.create(1, { product_id: 4, rating: 5, comment: 'ok' } as any);
    expect(repo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });

  it('delete throws when deleting another user review', async () => {
    repo.findOne.mockResolvedValue({ id: 5, user_id: 2 });
    await expect(svc.delete(5, 1)).rejects.toThrow();
  });

  it('delete removes own review', async () => {
    repo.findOne.mockResolvedValue({ id: 6, user_id: 3 });
    repo.remove.mockResolvedValue({ id: 6 });
    const res = await svc.delete(6, 3);
    expect(repo.remove).toHaveBeenCalled();
    expect(res).toHaveProperty('id', 6);
  });
});
