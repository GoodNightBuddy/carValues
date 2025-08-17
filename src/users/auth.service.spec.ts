import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { randomUUID } from 'crypto';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  const fakeUser = {
    id: randomUUID(),
    email: 'email',
    password: 'password',
  } as User;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: randomUUID(),
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with salted and hashed password', async () => {
    const user = await service.signUp('email', 'password');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('password');
    expect(user.email).toEqual('email');
    expect(user.id).toBeDefined();
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('signUp throws error when email is already in use', async () => {
    await service.signUp(fakeUser.email, fakeUser.password);

    try {
      await service.signUp(fakeUser.email, fakeUser.password);
      fail('Expected signUp to throw');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('signs in', async () => {
    await service.signUp(fakeUser.email, fakeUser.password);

    const user = await service.signIn(fakeUser.email, fakeUser.password);
    expect(user).toBeDefined();
  });

  it('signIn throws error when email is not found', async () => {
    try {
      await service.signIn('', '');
      fail('expected signIn to throw');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('User with such email not found');
    }
  });

  it('signIn throws if password is invalid', async () => {
    await service.signUp(fakeUser.email, fakeUser.password);
    try {
      await service.signIn(fakeUser.email, 'invalid password');
      fail('expected signIn to throw');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('Password is not correct');
    }
  });
});
