import { AuthService } from '../src/modules/auth/auth.service';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt methods
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService (unit)', () => {
  let authService: AuthService;
  const mockUsersService: any = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockJwtService: any = {
    sign: jest.fn(() => 'signed-token'),
    verify: jest.fn(() => ({ sub: 1, email: 'a@b.com' })),
  };

  const sessionsData: any[] = [];
  const mockSessionsRepo: any = {
    create: jest.fn((obj) => ({ id: sessionsData.length + 1, ...obj })),
    save: jest.fn(async (s) => {
      sessionsData.push(s);
      return s;
    }),
    findOne: jest.fn(async ({ where }) => sessionsData.find((s) => s.token === where.token) || null),
    delete: jest.fn(async () => ({})),
  };

  const mockConfig: any = { get: jest.fn((k) => undefined) };

  beforeEach(() => {
    jest.clearAllMocks();
    sessionsData.length = 0;
    authService = new AuthService(
      mockUsersService,
      mockJwtService,
      mockSessionsRepo,
      mockConfig
    );
  });

  it('registers a new user and returns tokens', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    mockUsersService.createUser.mockResolvedValue({ id: 1, email: 'a@b.com', first_name: 'A' });

    const res = await authService.register({ email: 'a@b.com', password: 'pw' });
    expect(res).toBeDefined();
    expect(res.user.email).toBe('a@b.com');
    expect(mockJwtService.sign).toHaveBeenCalled();
    expect(mockSessionsRepo.save).toHaveBeenCalled();
  });

  it('login throws on invalid credentials', async () => {
    mockUsersService.findByEmail.mockResolvedValue(null);
    await expect(authService.login('x@y.com', 'pw')).rejects.toThrow();
  });

  it('refresh rejects missing token', async () => {
    await expect(authService.refresh('')).rejects.toThrow();
  });

  it('login succeeds with correct credentials', async () => {
    const user = { id: 2, email: 'ok@ok.com', password_hash: 'hashed', first_name: 'B' };
    mockUsersService.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as any).mockResolvedValue(true);

    const res = await authService.login('ok@ok.com', 'pw');
    expect(res).toBeDefined();
    expect(res.user.email).toBe('ok@ok.com');
    expect(mockSessionsRepo.save).toHaveBeenCalled();
  });

  it('refresh succeeds with valid session', async () => {
    // create an initial session
    const initialToken = 'refresh-1';
    sessionsData.push({ id: 1, user_id: 1, token: initialToken, expires_at: new Date(Date.now() + 10000) });
    mockJwtService.verify.mockReturnValue({ sub: 1, email: 'a@b.com' });
    mockUsersService.findById.mockResolvedValue({ id: 1, email: 'a@b.com', first_name: 'A' });

    const res = await authService.refresh(initialToken);
    expect(res).toBeDefined();
    expect(res.refresh_token).toBeDefined();
    expect(mockSessionsRepo.save).toHaveBeenCalled();
  });

  it('logout deletes session', async () => {
    sessionsData.push({ id: 2, user_id: 2, token: 'todel', expires_at: new Date(Date.now() + 10000) });
    await expect(authService.logout('todel')).resolves.toEqual({ success: true });
    expect(mockSessionsRepo.delete).toHaveBeenCalled();
  });

  it('logoutAll deletes all user sessions', async () => {
    sessionsData.push({ id: 3, user_id: 3, token: 'a', expires_at: new Date() });
    await expect(authService.logoutAll(3)).resolves.toEqual({ success: true });
    expect(mockSessionsRepo.delete).toHaveBeenCalled();
  });

  it('changePassword updates password and revokes sessions', async () => {
    const user = { id: 4, email: 'cp@x.com', password_hash: 'oldhash' };
    mockUsersService.findById.mockResolvedValue(user);
    (bcrypt.compare as any).mockResolvedValue(true);
    (bcrypt.hash as any).mockResolvedValue('newhash');
    (mockUsersService.updateUser as any).mockResolvedValue(undefined);

    await expect(authService.changePassword(4, 'old', 'new')).resolves.toEqual({ success: true });
    expect(mockSessionsRepo.delete).toHaveBeenCalled();
  });
});
