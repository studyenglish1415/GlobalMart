import { AddressesService } from '../src/modules/addresses/addresses.service';

const createMockRepo = (initial = []) => {
  const data = [...initial];
  return {
    create: jest.fn((obj) => ({ ...obj })),
    find: jest.fn(async (opts) => data.filter((d) => (opts && opts.where ? Object.keys(opts.where).every(k => d[k] === opts.where[k]) : true))),
    findOne: jest.fn(async (opts) => {
      if (!opts) return null;
      const where = opts.where || {};
      return data.find((d) => Object.keys(where).every(k => d[k] === where[k])) || null;
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
    remove: jest.fn(async (item) => item),
  };
};

describe('AddressesService (unit)', () => {
  let svc: AddressesService;
  let repo: any;

  beforeEach(() => {
    repo = createMockRepo([]);
    svc = new AddressesService(repo);
    jest.clearAllMocks();
  });

  it('findByUser returns list', async () => {
    repo.find.mockResolvedValue([{ id: 1, user_id: 2 }]);
    const res = await svc.findByUser(2);
    expect(Array.isArray(res)).toBe(true);
  });

  it('findById throws when not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(svc.findById(10, 1)).rejects.toThrow();
  });

  it('create saves address', async () => {
    repo.create.mockImplementation((o) => ({ ...o }));
    repo.save.mockResolvedValue({ id: 3, user_id: 1 });
    const res = await svc.create(1, { line1: 'a' } as any);
    expect(res).toHaveProperty('id');
  });

  it('update finds and saves', async () => {
    repo.findOne.mockResolvedValue({ id: 4, user_id: 2 });
    repo.save.mockResolvedValue({ id: 4, user_id: 2, line1: 'b' });
    const res = await svc.update(4, 2, { line1: 'b' } as any);
    expect(repo.save).toHaveBeenCalled();
    expect(res.id).toBe(4);
  });

  it('delete removes address', async () => {
    repo.findOne.mockResolvedValue({ id: 5, user_id: 3 });
    repo.remove.mockResolvedValue({ id: 5 });
    const res = await svc.delete(5, 3);
    expect(repo.remove).toHaveBeenCalled();
    expect(res.id).toBe(5);
  });
});
