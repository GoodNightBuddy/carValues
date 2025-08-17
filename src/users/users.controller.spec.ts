import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { randomUUID } from 'crypto';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findById: (id: string) => {
        return Promise.resolve({
          id,
          email: 'email',
          password: 'password',
        } as User);
      },
      findByEmail: (email: string) => {
        return Promise.resolve([
          {
            id: randomUUID(),
            email,
            password: 'password',
          } as User,
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signUp: async () => {},
      signIn: (email: string, password: string) => {
        return Promise.resolve({ id: randomUUID(), email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return a list of user with given email', async () => {
    const email = 'email';
    const users = await controller.findByEmail(email);
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].email).toEqual(email);
  });

  it('findById should return a user with given id', async () => {
    const user = await controller.findById('id');
    expect(user).toBeDefined();
  });

  it('signin should return a user a set userId to session', async () => {
    const session = { userId: '' };
    const user = await controller.signIn(
      { email: 'email', password: 'password' },
      session,
    );
    expect(user).toBeDefined();
    expect(session.userId).not.toBe('');
  });
});
