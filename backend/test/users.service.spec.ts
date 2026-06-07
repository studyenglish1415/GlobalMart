import { UsersService } from '../src/modules/users/users.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('UsersService (unit)', () => {
  let usersService: UsersService;
  const mockUsersRepo: any = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    usersService = new UsersService(mockUsersRepo);
  });

  it('findByEmail returns user when found', async () => {
    mockUsersRepo.findOne.mockResolvedValue({ id: 1, email: 'u@x.com' });
    const res = await usersService.findByEmail('u@x.com');
    expect(res).toBeDefined();
    expect(res.email).toBe('u@x.com');
  });

  it('createUser hashes password and saves user', async () => {
    (bcrypt.hash as any).mockResolvedValue('hashedpw');
    mockUsersRepo.create.mockImplementation((obj) => ({ ...obj }));
    mockUsersRepo.save.mockResolvedValue({ id: 2, email: 'new@x.com' });

    const res = await usersService.createUser({ email: 'new@x.com', password: 'pw' });
    expect(bcrypt.hash).toHaveBeenCalledWith('pw', 10);
    expect(mockUsersRepo.save).toHaveBeenCalled();
    expect(res).toHaveProperty('id');
  });

  it('updateUser calls update and returns updated user', async () => {
    mockUsersRepo.update.mockResolvedValue(undefined);
    mockUsersRepo.findOne.mockResolvedValue({ id: 3, email: 'up@x.com' });
    const res = await usersService.updateUser(3, { first_name: 'Up' } as any);
    expect(mockUsersRepo.update).toHaveBeenCalledWith(3, { first_name: 'Up' });
    expect(res).toBeDefined();
    expect(res.id).toBe(3);
  });

  it('findAll returns array of users', async () => {
    mockUsersRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await usersService.findAll();
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBe(2);
  });
});
